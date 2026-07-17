"""
LoRA fine-tunes Qwen2.5-1.5B-Instruct to classify a transaction description into
a CardPerks reward category.

Run this on a GPU (free Colab T4 is enough for a 1.5B model with LoRA + 4-bit).
Locally without a GPU this will be extremely slow or OOM.

pip install -U transformers peft accelerate bitsandbytes datasets

Usage:
    python generate_data.py          # creates data/transactions.csv
    python train_lora.py             # trains, saves adapter to ./qwen-cardperks-lora
"""
import csv
from pathlib import Path

import torch
from datasets import Dataset
from peft import LoraConfig, get_peft_model
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling,
)

MODEL_ID = "Qwen/Qwen2.5-1.5B-Instruct"
DATA_PATH = Path(__file__).parent / "data" / "transactions.csv"
OUTPUT_DIR = Path(__file__).parent / "qwen-cardperks-lora" / "qwen-cardperks-lora"

CATEGORIES = ["dining", "travel", "groceries", "gas", "entertainment", "other"]

PROMPT_TEMPLATE = (
    "Classify this credit card transaction into exactly one category: "
    f"{', '.join(CATEGORIES)}.\n"
    "Transaction: {description}\n"
    "Category:"
)


def load_examples():
    rows = []
    with open(DATA_PATH) as f:
        for r in csv.DictReader(f):
            prompt = PROMPT_TEMPLATE.format(description=r["description"])
            # Trailing space before category matters for tokenization consistency.
            full_text = f"{prompt} {r['category']}"
            rows.append({"text": full_text, "prompt": prompt})
    return rows


def main():
    print("Loading tokenizer + base model...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.bfloat16,
        device_map="auto",
    )

    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
    )
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    print("Loading data...")
    examples = load_examples()
    dataset = Dataset.from_list(examples)

    def tokenize(batch):
        return tokenizer(batch["text"], truncation=True, max_length=128, padding="max_length")

    tokenized = dataset.map(tokenize, batched=True, remove_columns=dataset.column_names)

    collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

    args = TrainingArguments(
        output_dir=str(OUTPUT_DIR / "checkpoints"),
        per_device_train_batch_size=8,
        gradient_accumulation_steps=2,
        num_train_epochs=3,
        learning_rate=2e-4,
        logging_steps=10,
        save_strategy="epoch",
        bf16=True,
        report_to="none",
    )

    trainer = Trainer(model=model, args=args, train_dataset=tokenized, data_collator=collator)
    trainer.train()

    print(f"Saving LoRA adapter to {OUTPUT_DIR}")
    model.save_pretrained(str(OUTPUT_DIR))
    tokenizer.save_pretrained(str(OUTPUT_DIR))


if __name__ == "__main__":
    main()
