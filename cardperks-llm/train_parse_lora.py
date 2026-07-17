"""
Train a LoRA adapter on Qwen2.5-1.5B-Instruct for bank statement parsing.

Task: given a raw text chunk from a bank PDF, output "MERCHANT | AMOUNT" or "SKIP".

Run on Google Colab (T4) — see colab_parse.ipynb.
"""

import torch
from pathlib import Path
from datasets import Dataset
from peft import LoraConfig, TaskType, get_peft_model
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    DataCollatorForSeq2Seq,
    TrainingArguments,
    Trainer,
)
import csv

# ── Config ────────────────────────────────────────────────────────────────────
MODEL_ID   = "Qwen/Qwen2.5-1.5B-Instruct"
OUTPUT_DIR = Path(__file__).parent / "qwen-cardperks-parser" / "qwen-cardperks-parser"
TRAIN_PATH = Path(__file__).parent / "data" / "parse_train.csv"
MAX_LEN    = 160   # longer than categorizer — entries can be multi-line

PARSE_PROMPT = (
    "Extract transaction from bank statement entry. Output MERCHANT|AMOUNT or SKIP.\n"
    "Entry: {text}\n"
    "Result:"
)

# ── Load data ─────────────────────────────────────────────────────────────────
def load_csv(path: Path) -> list[dict]:
    rows = []
    with open(path, newline="") as f:
        for row in csv.DictReader(f):
            rows.append({"text": row["text"], "label": row["label"]})
    return rows

# ── Tokenise ──────────────────────────────────────────────────────────────────
def make_tokenize_fn(tokenizer):
    def tokenize(examples):
        inputs, labels_all = [], []
        for text, label in zip(examples["text"], examples["label"]):
            prompt     = PARSE_PROMPT.format(text=text)
            full_text  = prompt + " " + label
            tok_full   = tokenizer(full_text,   truncation=True, max_length=MAX_LEN)
            tok_prompt = tokenizer(prompt,       truncation=True, max_length=MAX_LEN)
            input_ids  = tok_full["input_ids"]
            prompt_len = len(tok_prompt["input_ids"])
            # Mask prompt tokens in labels (only train on the answer portion)
            label_ids  = [-100] * prompt_len + input_ids[prompt_len:]
            inputs.append(input_ids)
            labels_all.append(label_ids)
        return {"input_ids": inputs, "labels": labels_all}
    return tokenize

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    tokenizer.pad_token = tokenizer.eos_token

    raw = load_csv(TRAIN_PATH)
    dataset = Dataset.from_list(raw)
    tokenize_fn = make_tokenize_fn(tokenizer)
    tokenized = dataset.map(
        tokenize_fn,
        batched=True,
        remove_columns=["text", "label"],
    )

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        dtype=torch.bfloat16,
        device_map="auto",
    )

    lora_cfg = LoraConfig(
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        target_modules=["q_proj", "v_proj"],
        bias="none",
        task_type=TaskType.CAUSAL_LM,
    )
    model = get_peft_model(model, lora_cfg)
    model.print_trainable_parameters()

    args = TrainingArguments(
        output_dir=str(OUTPUT_DIR),
        num_train_epochs=4,          # slightly more — parsing is a new task
        per_device_train_batch_size=8,
        gradient_accumulation_steps=2,
        learning_rate=2e-4,
        lr_scheduler_type="cosine",
        warmup_steps=50,
        fp16=True,
        logging_steps=25,
        save_steps=200,
        save_total_limit=1,
        report_to="none",
    )

    trainer = Trainer(
        model=model,
        args=args,
        train_dataset=tokenized,
        data_collator=DataCollatorForSeq2Seq(tokenizer, pad_to_multiple_of=8, label_pad_token_id=-100),
    )

    trainer.train()
    model.save_pretrained(str(OUTPUT_DIR))
    tokenizer.save_pretrained(str(OUTPUT_DIR))
    print(f"\nParser LoRA saved → {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
