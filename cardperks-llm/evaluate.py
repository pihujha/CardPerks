"""
Measures real held-out accuracy of the fine-tuned adapter vs. the un-tuned base model.
This is what gives you an honest number for your resume bullet later —
don't write a number until this script has actually printed one for you.

Usage: python evaluate.py
"""
import csv
from pathlib import Path

import torch
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

from train_lora import MODEL_ID, OUTPUT_DIR, CATEGORIES, PROMPT_TEMPLATE

TEST_PATH = Path(__file__).parent / "data" / "transactions_test.csv"


def load_holdout():
    with open(TEST_PATH) as f:
        return list(csv.DictReader(f))


def predict(model, tokenizer, description):
    prompt = PROMPT_TEMPLATE.format(description=description)
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    out = model.generate(**inputs, max_new_tokens=5, do_sample=False)
    text = tokenizer.decode(out[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True)
    text = text.strip().lower()
    for cat in CATEGORIES:
        if cat in text:
            return cat
    return "other"


def run_eval(model, tokenizer, examples, label):
    correct = 0
    for row in examples:
        pred = predict(model, tokenizer, row["description"])
        correct += int(pred == row["category"])
    acc = correct / len(examples)
    print(f"{label}: {correct}/{len(examples)} correct = {acc:.1%}")
    return acc


def main():
    examples = load_holdout()
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

    print("Evaluating base model (no fine-tuning)...")
    base_model = AutoModelForCausalLM.from_pretrained(MODEL_ID, torch_dtype=torch.bfloat16, device_map="auto")
    run_eval(base_model, tokenizer, examples, "Base Qwen2.5-1.5B")

    print("Evaluating fine-tuned LoRA adapter...")
    tuned_model = PeftModel.from_pretrained(base_model, str(OUTPUT_DIR))
    run_eval(tuned_model, tokenizer, examples, "LoRA fine-tuned")


if __name__ == "__main__":
    main()
