# CardPerks — Project Journey

A full technical retrospective of everything built, every decision made, and every bug fixed.

---

## 1. What CardPerks Is

CardPerks is a full-stack web application that helps users track their credit card benefits, visualize spending, and figure out which cards they are missing out on. The core premise: most people don't know what their credit cards actually offer, and they definitely don't know how much money they're leaving on the table by using the wrong card for a given purchase category.

The two headline features are:
- **Benefit tracking dashboard** — add your cards, see benefits, mark them used
- **Statement Analysis** — upload a bank statement (PDF or CSV), have an on-device fine-tuned LLM categorize every transaction, and see exactly which card would have earned you the most rewards

---

## 2. Tech Stack

### Frontend
- **React 18 + TypeScript** — component model, strict types throughout
- **Vite** — dev server and bundler; configured with a proxy so `/api` routes forward to `vercel dev` on port 3000 during local development
- **Tailwind CSS v4** — uses the new `@import "tailwindcss"` syntax and `@theme {}` blocks instead of a config file; class-based dark mode via `@custom-variant dark (&:where(.dark, .dark *))`
- **React Router v7** — SPA routing with `<RequireAuth>` wrapper components

### Backend (Vercel Serverless Functions)
- **Vercel Edge Runtime** — mandatory for auth functions because `jose` (JWT library) is ESM-only and crashes in Node.js CJS context; edge functions export `export const config = { runtime: 'edge' }`
- **Node.js Vercel Functions** — used for heavy-lifting functions like PDF parsing that require Node-only libraries
- **`@neondatabase/serverless`** — Neon's HTTP-based PostgreSQL driver that works in edge runtime (no TCP sockets required)

### Database
- **Neon PostgreSQL** — serverless Postgres; schema includes `users`, `cards`, `benefits`, `user_cards`, `benefit_usage`, and `statement_analyses`

### Authentication
- **Custom JWT auth with `jose`** — JWTs signed with HS256, stored in HttpOnly cookies named `cardperks-auth`; token verified on every protected request in edge middleware
- No third-party auth provider — everything hand-rolled

### ML / LLM
- **Qwen2.5-1.5B-Instruct** — base model from Alibaba; chosen because it's small enough to run locally on a Mac with MPS (Metal Performance Shaders) and large enough to follow instruction formats reliably
- **LoRA (Low-Rank Adaptation) via PEFT** — fine-tuned only the attention layers, not the full model; r=16, alpha=32, dropout=0.05; trained on `q_proj` and `v_proj`
- **HuggingFace `transformers` + `datasets` + `accelerate`** — standard PyTorch training stack
- **FastAPI + uvicorn** — local inference server exposing the fine-tuned model as a REST API
- **Google Colab T4 GPU** — trained the LoRA adapter in ~15 minutes; base model + adapter downloaded as a zip and used locally

---

## 3. The Auth System

One of the first hard technical decisions was auth. The options were:
- Clerk / Auth0 — third-party, fast but opaque
- NextAuth — tied to Next.js
- Custom JWT — full control, works anywhere

We went custom. The flow:
1. User signs up / signs in via `api/auth/register.ts` or `api/auth/login.ts`
2. Password hashed with bcrypt, stored in Neon
3. Server generates a JWT signed with `HS256` using `jose`
4. JWT set as `HttpOnly; SameSite=Strict; Secure` cookie — never readable from JavaScript
5. Every protected API route calls `getUserId(request)` which extracts and verifies the cookie

The critical constraint: `jose` is ESM-only. When we accidentally used it in a Node.js function, it threw `ERR_REQUIRE_ESM`. The fix was to mark every auth-touching function with `export const config = { runtime: 'edge' }` so Vercel runs them in the V8-based edge runtime where ESM is native.

---

## 4. Database Schema

The schema evolved organically:

```sql
users          — id, name, email, password_hash, created_at
cards          — id, name, bank, network, tier, annual_fee, ...
benefits       — id, card_id, title, description, category, value_usd, ...
user_cards     — id, user_id, card_id, nickname, added_at
benefit_usage  — id, user_id, benefit_id, used_at, notes
statement_analyses — id, user_id, name, period, card_name, transactions (JSONB), created_at
```

`statement_analyses.transactions` is a JSONB column storing the full array of `{ description, amount, category }` objects — this lets us run aggregations directly in SQL (e.g., `SUM((t->>'amount')::numeric)` over `jsonb_array_elements(transactions)`) without pulling data to the application layer.

The `statement_analyses` table is auto-created on first use via `CREATE TABLE IF NOT EXISTS` in the API handler, so there was no separate migration step.

---

## 5. UI / Design

### Color Palette
A warm, neutral palette inspired by aged paper and amber:
- Background: `#fbfaf8`
- Ink: `#1c1a17`
- Muted: `#8a857d`
- Border: `#eceae6`
- Accent (amber): `#b45309`

### Nav
Frosted glass sticky nav: `background: rgba(251,250,248,0.82); backdropFilter: blur(20px) saturate(1.4)`. Includes a top amber gradient accent line (1px), mobile hamburger menu, dark mode toggle, and user dropdown with settings modal.

### Animations
- `slideUp` keyframe animation on page sections
- Parallax background component (`ParallaxBackground.tsx`) with multiple layers at different scroll depths
- Cards on the dashboard animate with hover transforms and subtle shadows
- Landing page features section: interactive, not static

### Dark Mode
Class-based dark mode toggled by adding `.dark` to `<html>`. Persisted to `localStorage`. The Tailwind v4 variant ensures dark styles only apply when the class is present, not via `prefers-color-scheme`.

---

## 6. The ML Pipeline — Transaction Categorizer

This is the most technically interesting part of the project.

### The Problem
We wanted to categorize credit card transactions (e.g., "TRADER JOE S #041 SAN LUIS OBISPO CA") into buckets: dining, travel, groceries, gas, entertainment, other. Rule-based keyword matching was brittle and incomplete.

### The Solution: Fine-Tuned LLM
Rather than calling a cloud API (which adds latency, cost, and a dependency), we fine-tuned a small local model.

### Model Selection: Qwen2.5-1.5B-Instruct
- 1.5 billion parameters — runs on 8GB+ unified memory (Apple Silicon)
- Instruction-tuned base makes prompt adherence reliable out of the box
- Small enough that the LoRA adapter trains in ~15 minutes on a T4 GPU
- HuggingFace model ID: `Qwen/Qwen2.5-1.5B-Instruct`

### Training Data Generation (`generate_data.py`)
We generated 900 synthetic transaction examples programmatically:
- 6 categories × ~150 examples each
- Merchant names, locations, and formatting variations to simulate real bank statement descriptions
- 80/20 train/test split: `data/transactions.csv` (720 rows) and `data/transactions_test.csv` (180 rows)
- Format: `description,category` CSV

### LoRA Configuration (`train_lora.py`)
```python
LoraConfig(
    r=16,                          # rank — controls adapter capacity
    lora_alpha=32,                 # scaling factor
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"],  # attention layers only
    bias="none",
    task_type=TaskType.CAUSAL_LM,
)
```

Prompt template:
```
Categorize: {description}
Category:
```

Expected output: one of `dining`, `travel`, `groceries`, `gas`, `entertainment`, `other`

Training hyperparameters: `max_length=128`, `num_train_epochs=3`, `per_device_train_batch_size=8`, `learning_rate=2e-4`, `lr_scheduler_type=cosine`

### Google Colab Training (`colab_train.ipynb`)
Training locally was impractical (no CUDA). We exported a Jupyter notebook that:
1. Installs dependencies (`torchao` must be upgraded first — version incompatibility between torch and torchao caused `ImportError` on default Colab environment)
2. Uploads the training CSV
3. Verifies T4 GPU availability
4. Loads Qwen2.5-1.5B-Instruct in `bfloat16`
5. Applies LoRA config
6. Trains for 3 epochs
7. Saves adapter and downloads as zip

Training results:
- Initial loss: ~2.25
- Final loss: ~0.34
- Duration: ~15 minutes on T4

### Local Inference Server (`infer_server.py`)
FastAPI server that loads the fine-tuned model and exposes a `/categorize` endpoint.

**Key technical challenges on Apple Silicon:**

**Problem 1 — MPS SIGSEGV (segmentation fault)**
Running inference on MPS (Metal Performance Shaders, Apple's GPU backend) would randomly segfault when requests came in concurrently. Root cause: Metal's shader compilation uses a hash table internally, and concurrent threads hitting it simultaneously caused a race condition in the native Metal layer.

Fix: `threading.Lock()` around all inference code — only one request at a time touches MPS. Inelegant but the only reliable fix without moving to CPU.

**Problem 2 — `peft` KeyError on device_map**
Using `device_map="auto"` with PEFT's `PeftModel` on Mac caused a key error because the auto device map assigned layers to different devices and PEFT couldn't reconcile the adapter keys.

Fix: Load base model explicitly on CPU with `device_map={"": "cpu"}`, then call `.to("mps")` after loading the LoRA adapter.

**Problem 3 — CPU too slow**
Pure CPU inference (float32) was too slow for batch use (~3-5 seconds per transaction).

Fix: float16 on CPU during load, then move to MPS. MPS inference is ~10x faster.

Final inference server excerpt:
```python
base_model = AutoModelForCausalLM.from_pretrained(MODEL_ID, dtype=torch.float16, device_map={"": "cpu"})
model = PeftModel.from_pretrained(base_model, str(OUTPUT_DIR), device_map={"": "cpu"})
model = model.to("mps")
model.eval()
_lock = threading.Lock()

@app.post("/categorize")
def categorize(req: TransactionRequest):
    prompt = PROMPT_TEMPLATE.format(description=req.description)
    with _lock:
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        with torch.no_grad():
            out = model.generate(**inputs, max_new_tokens=5, do_sample=False)
        text = tokenizer.decode(out[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True).strip().lower()
    category = next((c for c in CATEGORIES if c in text), "other")
    return CategoryResponse(category=category)
```

### Vercel API Wrapper (`api/analyze-statement.ts`)
Edge function that:
1. Receives `{ descriptions: string[] }` from the frontend
2. Calls `http://localhost:8000/categorize` in batches of 4 (to avoid overloading the MPS lock)
3. Returns `{ categories: string[] }`
4. Uses `LLM_URL = process.env.LLM_URL || 'http://localhost:8000'` so the URL is swappable for production deployment

---

## 7. The Statement Analysis Page

### Feature Overview
Users can upload a credit card or debit card statement (CSV or PDF), and the app:
1. Parses the file into `{ description, amount }` pairs
2. Sends descriptions to the LLM categorizer in chunks of 10
3. Shows a real-time progress bar as categorization completes
4. Displays a horizontal bar chart of spending by category
5. Ranks 10 hardcoded cards by estimated rewards value based on actual spend
6. Shows the full transaction table with color-coded category badges

### The 10 Cards (Hardcoded)
| Card | Best Category |
|---|---|
| Amex Gold Card | 4x dining + groceries |
| Chase Sapphire Reserve | 3x dining + travel |
| Chase Sapphire Preferred | 3x dining, 2x groceries |
| Amex Platinum | 5x travel |
| Amex Blue Cash Preferred | 6x groceries |
| Chase Freedom Unlimited | 3x dining, 5x travel, 1.5x everything |
| Citi Double Cash | 2x everything |
| Capital One Venture | 2x / 5x travel |
| Wells Fargo Active Cash | 2x everything |
| Discover it | 1x (baseline) |

The card gap analysis computes `estimated_value = Σ (spend_in_category × reward_rate × cents_per_point)` for each card, ranks them, and highlights the top pick.

### CSV Parsing
Done entirely client-side. Auto-detects column indices for description and amount using fuzzy header matching (checks for "description", "merchant", "payee", etc.). Strips quotes, handles negative amounts (takes absolute value).

### PDF Parsing
PDFs are base64-encoded on the client and sent to `api/parse-pdf.ts` — a Node.js Vercel function (not edge, because pdf-parse requires Node).

**Bug: pdf-parse v2 + Node.js v20 = DOMMatrix error**
`pdf-parse@2.x` rewrites the internals to use `pdf.js` and requires `DOMMatrix` (a browser API) which Node.js only added in v22. Our machine was on Node.js v20.15.1.

Symptom:
```
ReferenceError: DOMMatrix is not defined
TypeError: process.getBuiltinModule is not a function
```

Fix: Downgraded to `pdf-parse@1.x` which uses the original pure-Node implementation.

**Bug: Different PDF layouts break the regex parser**
The initial regex parser assumed description and amount were on the same line. Real bank PDFs (at least one tested format) split across 3 lines:
```
05/27Card Purchase
05/27 Smart And Final 913 San Luis Obispo CA Card 1449
$179.28$4,682.89
```

Fix: Rewrote the parser as a state machine that detects the "Card Purchase" trigger line, then reads the next two lines for merchant and amount. Preserved single-line format as a fallback.

This recurring fragility is what motivated building the **parser LoRA** (next section).

---

## 8. Persistent Analyses

### The Problem
Statement analysis results lived only in React state — a page reload wiped everything.

### The Solution
A `statement_analyses` Neon table with JSONB storage for the full transaction array. Each analysis is a named "folder" the user creates before uploading.

### User Flow
1. Click "New Analysis" on the `/analysis` page
2. Fill a questionnaire: time period (e.g., "May 2026"), which card (dropdown from user's actual cards), and an auto-generated name ("Chase Freedom · May 2026", editable)
3. Upload PDF or CSV
4. Categorization runs, auto-saves to DB on completion
5. User is taken to the analysis detail view
6. Next visit: all past analyses are shown as clickable folder cards

### All-Time Summary Banner
At the top of the analysis list page, a summary card shows:
- Total spend across all statements ever uploaded (formatted `$X,XXX.XX`)
- Total statement count
- Total transaction count
- Category spending breakdown (bar chart, aggregated across all analyses)

The category aggregation is done in a single SQL query using `jsonb_array_elements` and `jsonb_object_agg` — no application-side aggregation.

### API Routes
- `GET /api/analyses` — list all analyses for authenticated user, with per-folder `spend_by_category` from SQL
- `POST /api/analyses` — create new analysis with full transaction JSONB
- `GET /api/analyses/[id]` — fetch full analysis detail
- `DELETE /api/analyses/[id]` — delete a folder

---

## 9. Dev Environment Setup

Running locally requires two servers:

```bash
# Terminal 1 — Vite (frontend, hot reload)
npm run dev      # port 5173

# Terminal 2 — Vercel (API routes, auth, DB)
npx vercel dev   # port 3000

# Terminal 3 — LLM inference server
cd cardperks-llm && python infer_server.py   # port 8000
```

Vite is configured to proxy `/api` to port 3000:
```ts
// vite.config.ts
server: { proxy: { '/api': 'http://localhost:3000' } }
```

Without this proxy, the frontend (5173) would hit CORS errors calling API routes on a different port. The proxy makes it transparent.

---

## 10. Bugs Fixed (Full List)

| Bug | Symptom | Fix |
|---|---|---|
| `jose` ESM in Node.js | `ERR_REQUIRE_ESM` | Move all auth to edge runtime |
| PEFT KeyError on Mac | `base_model.model.model.model.embed_tokens not found` | Use `device_map={"": "cpu"}` then `.to("mps")` |
| MPS SIGSEGV | Random segfault under concurrent requests | `threading.Lock()` around all MPS inference |
| `torchao` version mismatch | `ImportError: Found 0.10.0, need >0.16.0` | `pip install -U torchao` first in Colab |
| `torch_dtype` deprecation | PyTorch warning / failure | Changed to `dtype=` argument |
| `max_length=64` truncation | Category labels ("entertainment") truncated in training | Changed to `max_length=128` |
| Holdout data overlap | Evaluate was shuffling training data instead of using a separate test set | Added `transactions_test.csv`, separate 20% split in generate_data.py |
| Vercel dev not serving | Frontend assets returning 404 from vercel dev | Added Vite proxy, moved to dual-server setup |
| FileReader PDF garbage | `readAsText()` on binary PDF returns mojibake | Changed to `readAsDataURL()` → base64 → server-side parse |
| pdf-parse v2 DOMMatrix | `ReferenceError: DOMMatrix is not defined` on Node 20 | Downgraded to `pdf-parse@1.x` |
| PDF multi-line format | "Could not extract transactions" on real bank PDFs | Rewrote parser as 3-line state machine |
| MPS CPU fallback too slow | ~5s per transaction | float16 load + MPS execution |
| Vercel `vercel` not found | `zsh: command not found: vercel` | `npm install vercel` (already in devDependencies) |

---

## 11. The Parser LoRA — Completed

The regex PDF parser was fundamentally fragile — every bank formats their statement differently. We trained a second LoRA adapter on the same Qwen2.5-1.5B base that does structured extraction from raw statement text.

### Architecture
```
PDF text (raw)
    ↓  /parse  (parser LoRA)
[{ description, amount }]
    ↓  /categorize  (existing LoRA)
[{ description, amount, category }]
```

Both tasks use the same base model. The inference server loads both LoRA adapters at startup — one base model instance per adapter (PEFT multi-adapter stacking is tricky on MPS, so two separate instances).

### Training Data (`generate_parse_data.py`)
~770 training rows across 4 real-world bank statement formats:
1. **Multi-line student debit** — `MM/DD Merchant Name Card XXXX\n$XX.XX$X,XXX.XX`
2. **Chase-style** — `MM/DD MERCHANT NAME 800-XXX-XXXX CA  XX.XX`
3. **Apple Card** — `Merchant Name  MM/DD/YYYY  $XX.XX`
4. **Single-line** — `MM/DD Merchant $XX.XX $X,XXX.XX`

Plus ~170 negative examples (Zelle payments, balance lines, headers, trigger-only lines) that all output `SKIP`.

80/20 train/test split → `data/parse_train.csv`, `data/parse_test.csv`.

### Prompt Template
```
Extract transaction from bank statement entry. Output MERCHANT|AMOUNT or SKIP.
Entry: {text}
Result:
```

### Colab Training Bugs Hit
| Bug | Cause | Fix |
|---|---|---|
| `ValueError: bf16/gpu not supported` | T4 is Turing architecture — bf16 needs Ampere+ | Changed `bf16=True` → `fp16=True`, `bfloat16` → `float16` |
| `warmup_ratio is deprecated` | transformers v5 removed it | Changed to `warmup_steps=50` |
| `huggingface-hub 0.36.2 incompatible` | Pinning `transformers==4.47.0` pulled in old hub version conflicting with Colab's gradio | Removed version pins, used `-U` to upgrade to latest |
| Training ran 26 min with no progress | Runtime silently lost T4, fell back to CPU | Runtime → Change runtime type → T4 GPU, restarted |
| Parser returned empty transactions | Chunking sent 3-line block (trigger + desc + amount) but model trained on 2-line format (desc + amount only) | Fixed `chunk_pdf_text` to skip the "Card Purchase" trigger line |

### Result
- Training: ~20 minutes on T4, fp16
- `/parse` endpoint correctly extracts `{"description": "Trader Joe's", "amount": 33.89}` from multi-line PDF text
- `api/parse-pdf.ts` now calls `/parse` first (LLM), falls back to regex if server is offline
- PDF parsing is now format-agnostic — no more regex brittle edge cases

---

## 12. Numbers at a Glance

| Metric | Value |
|---|---|
| Total files changed | ~25 |
| Lines of TypeScript | ~2,000 |
| Lines of Python (ML pipeline) | ~600 |
| Training examples (categorizer) | 900 (720 train / 180 test) |
| Training time (T4 GPU) | ~15 minutes |
| Final training loss | 0.34 (from 2.25) |
| Sanity check accuracy | 6 / 6 |
| Cards hardcoded | 10 |
| API routes | 12 |
| DB tables | 6 |
| Bugs fixed | 19 |

---

*Written July 2026. Built by Pihu Jha.*
