"""
CardPerks inference server — two endpoints, one base model, two LoRA adapters.

  POST /categorize   { description }  →  { category }
  POST /parse        { text }         →  { transactions: [{description, amount}] }

Both adapters load on CPU then move to MPS.  A threading.Lock serialises all
MPS calls to avoid Metal's hash-table race condition (SIGSEGV under concurrency).

Run: uvicorn infer_server:app --host 0.0.0.0 --port 8000
"""

import re
import threading
from pathlib import Path
from typing import Optional

import torch
from fastapi import FastAPI, HTTPException
from peft import PeftModel
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer

from train_lora import MODEL_ID, OUTPUT_DIR as CATEGORIZE_DIR, CATEGORIES, PROMPT_TEMPLATE

# Parser adapter lives next to the categorizer adapter
PARSE_DIR = Path(__file__).parent / "qwen-cardperks-parser" / "qwen-cardperks-parser"

PARSE_PROMPT = (
    "Extract transaction from bank statement entry. Output MERCHANT|AMOUNT or SKIP.\n"
    "Entry: {text}\n"
    "Result:"
)

app = FastAPI(title="CardPerks LLM Server")

# ── Load base model + both LoRA adapters ──────────────────────────────────────
# Load on CPU first (avoids MPS race during weight init), then move to MPS.
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

print("Loading base model on CPU…")
base_model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID, dtype=torch.float16, device_map={"": "cpu"}
)

print("Loading categorizer LoRA…")
cat_model = PeftModel.from_pretrained(base_model, str(CATEGORIZE_DIR), device_map={"": "cpu"})
cat_model = cat_model.to("mps")
cat_model.eval()

parse_model: Optional[PeftModel] = None
if PARSE_DIR.exists():
    print("Loading parser LoRA…")
    # Load fresh base model for the second adapter (PEFT doesn't stack adapters on the same instance easily)
    base2 = AutoModelForCausalLM.from_pretrained(
        MODEL_ID, dtype=torch.float16, device_map={"": "cpu"}
    )
    parse_model = PeftModel.from_pretrained(base2, str(PARSE_DIR), device_map={"": "cpu"})
    parse_model = parse_model.to("mps")
    parse_model.eval()
    print("Parser LoRA ready.")
else:
    print(f"Parser LoRA not found at {PARSE_DIR} — /parse will return 503 until trained.")

# One lock — MPS can only safely handle one inference call at a time
_lock = threading.Lock()


def run_model(model: PeftModel, prompt: str, max_new_tokens: int) -> str:
    with _lock:
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        with torch.no_grad():
            out = model.generate(**inputs, max_new_tokens=max_new_tokens, do_sample=False)
        return tokenizer.decode(
            out[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True
        ).strip()


# ── Request / response models ─────────────────────────────────────────────────

class TransactionRequest(BaseModel):
    description: str

class CategoryResponse(BaseModel):
    category: str

class ParseRequest(BaseModel):
    text: str   # full raw PDF text

class ParsedTransaction(BaseModel):
    description: str
    amount: float

class ParseResponse(BaseModel):
    transactions: list[ParsedTransaction]


# ── /categorize ───────────────────────────────────────────────────────────────

@app.post("/categorize", response_model=CategoryResponse)
def categorize(req: TransactionRequest):
    prompt = PROMPT_TEMPLATE.format(description=req.description)
    raw = run_model(cat_model, prompt, max_new_tokens=5).lower()
    category = next((c for c in CATEGORIES if c in raw), "other")
    return CategoryResponse(category=category)


# ── /parse ────────────────────────────────────────────────────────────────────

def chunk_pdf_text(text: str) -> list[str]:
    """
    Split raw PDF text into candidate chunks for the parser model.

    Strategy:
      - When we see a "Card Purchase" trigger line (no $ on it), take the next
        2 lines with it as a 3-line chunk (multi-line bank format).
      - All other non-empty lines are passed as single-line chunks.
    """
    lines = [l.strip() for l in text.split("\n")]
    chunks: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line:
            i += 1
            continue
        if re.search(r"card purchase", line, re.I) and "$" not in line:
            # Multi-line entry — grab trigger + next 2 lines
            block = "\n".join(l for l in lines[i : i + 3] if l)
            chunks.append(block)
            i += 3
        else:
            chunks.append(line)
            i += 1
    return chunks


@app.post("/parse", response_model=ParseResponse)
def parse_statement(req: ParseRequest):
    if parse_model is None:
        raise HTTPException(
            status_code=503,
            detail="Parser LoRA not loaded. Train it with colab_parse.ipynb first.",
        )

    chunks = chunk_pdf_text(req.text)
    transactions: list[ParsedTransaction] = []

    for chunk in chunks:
        # Quick pre-filter: skip obvious non-transactions without calling the model
        low = chunk.lower()
        if any(k in low for k in ["beginning balance", "ending balance", "zelle payment", "ach ", "direct deposit", "minimum payment", "statement period"]):
            continue
        if not re.search(r"\d", chunk):
            continue

        prompt = PARSE_PROMPT.format(text=chunk)
        result = run_model(parse_model, prompt, max_new_tokens=25).strip()

        if result.upper() == "SKIP" or not result or "|" not in result:
            continue

        # Parse "MERCHANT | AMOUNT"
        parts = result.split("|", 1)
        if len(parts) != 2:
            continue
        merchant = parts[0].strip()
        amt_str  = parts[1].strip().replace(",", "").replace("$", "")
        try:
            amount = float(amt_str)
        except ValueError:
            continue
        if amount < 0.01 or not merchant:
            continue

        transactions.append(ParsedTransaction(description=merchant, amount=amount))

    return ParseResponse(transactions=transactions)


# ── /health ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "categorizer": "ready",
        "parser": "ready" if parse_model is not None else "not loaded",
    }
