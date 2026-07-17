"""
Generate synthetic bank statement parsing training data.

Each row teaches the model:
  INPUT:  raw text chunk from a bank PDF (1–3 lines)
  OUTPUT: "MERCHANT | AMOUNT"  or  "SKIP"

Covers 4 real-world bank statement formats so the model generalises
to statements it has never seen.
"""

import csv
import random
from pathlib import Path

random.seed(42)

# ── Merchants by category ──────────────────────────────────────────────────────
MERCHANTS = {
    "dining": [
        "McDonald's", "Chipotle Mexican Grill", "Starbucks", "Chick-fil-A",
        "Subway", "Domino's Pizza", "Taco Bell", "In-N-Out Burger",
        "Panera Bread", "Shake Shack", "Panda Express", "Wendy's",
        "Five Guys", "Buffalo Wild Wings", "Olive Garden", "Applebee's",
        "Sq *Coffee House", "Dutch Bros Coffee", "Sweetgreen", "Wingstop",
    ],
    "groceries": [
        "Trader Joe's", "Whole Foods Market", "Kroger", "Safeway",
        "Costco Wholesale", "Target", "Walmart Grocery", "Aldi",
        "Smart And Final", "Sprouts Farmers Market", "Publix",
        "H-E-B", "Vons", "Ralph's", "Food 4 Less", "WinCo Foods",
    ],
    "travel": [
        "Lyft", "Uber", "Delta Air Lines", "United Airlines",
        "Marriott Hotels", "Hilton Garden Inn", "Airbnb",
        "Southwest Airlines", "Expedia", "National Car Rental",
        "Enterprise Rent-A-Car", "American Airlines", "JetBlue",
        "Hilton Hotels", "Hyatt", "Hertz",
    ],
    "gas": [
        "Shell", "Chevron", "BP", "ExxonMobil", "Arco",
        "Circle K", "Speedway", "Casey's", "Valero", "Sunoco",
        "Murphy USA", "Texaco",
    ],
    "entertainment": [
        "Netflix", "Spotify", "Apple.com/Bill", "Amazon Prime",
        "Hulu", "Disney+", "AMC Theatres", "Cinemark",
        "Cinemahosting Co", "PlayStation Store", "Xbox Game Pass",
        "Ticketmaster", "StubHub", "ESPN+", "Paramount+",
    ],
    "other": [
        "Amazon.com", "Target.com", "Walgreens", "CVS Pharmacy",
        "Home Depot", "Best Buy", "Macy's", "Zara",
        "USPS", "AT&T", "Verizon Wireless", "T-Mobile",
        "Apple Store", "Microsoft Store", "Chewy.com", "Petco",
    ],
}

CARD_LAST_4 = ["1449", "5821", "3092", "7734", "0011"]

def rand_date() -> str:
    month = random.randint(1, 12)
    day   = random.randint(1, 28)
    return f"{month:02d}/{day:02d}"

def rand_amount() -> float:
    return round(random.uniform(4.50, 299.99), 2)

def rand_balance() -> float:
    return round(random.uniform(200.0, 8000.0), 2)

def rand_merchant() -> tuple[str, str]:
    cat = random.choice(list(MERCHANTS.keys()))
    return cat, random.choice(MERCHANTS[cat])

def clean_merchant_name(name: str) -> str:
    """Strip noise tokens we'd expect in the model's output."""
    return name.strip()

# ── Format generators ──────────────────────────────────────────────────────────

def fmt_multiline(merchant: str, amount: float) -> tuple[str, str]:
    """
    Student debit / BoA multi-line:
      MM/DDCard Purchase
      MM/DD Merchant Name ... Card XXXX
      $XX.XX$X,XXX.XX
    We give the model lines 2 + 3 (the trigger line is not informative).
    """
    date    = rand_date()
    card    = random.choice(CARD_LAST_4)
    balance = rand_balance()
    # Sometimes add city / state noise to merchant line
    noise   = random.choice(["", " San Luis Obispo CA", " Austin TX", " Chicago IL", " Seattle WA", ""])
    desc_line = f"{date} {merchant}{noise} Card {card}"
    amt_line  = f"${amount:.2f}${balance:,.2f}"
    text      = f"{desc_line}\n{amt_line}"
    label     = f"{clean_merchant_name(merchant)} | {amount:.2f}"
    return text, label

def fmt_singleline(merchant: str, amount: float) -> tuple[str, str]:
    """
    Simple single-line:
      MM/DD MERCHANT $XX.XX $X,XXX.XX
    """
    date    = rand_date()
    balance = rand_balance()
    text    = f"{date} {merchant} ${amount:.2f} ${balance:,.2f}"
    label   = f"{clean_merchant_name(merchant)} | {amount:.2f}"
    return text, label

def fmt_chase(merchant: str, amount: float) -> tuple[str, str]:
    """
    Chase-like (uppercase, no $ sign, trailing digits):
      MM/DD MERCHANT NAME 800-XXX-XXXX CA  XX.XX
    """
    date = rand_date()
    suffix = random.choice(["", " 800-592-8996 CA", " 888-280-4331 WA", " 877-232-2855 IL"])
    text  = f"{date} {merchant.upper()}{suffix}  {amount:.2f}"
    label = f"{clean_merchant_name(merchant)} | {amount:.2f}"
    return text, label

def fmt_apple(merchant: str, amount: float) -> tuple[str, str]:
    """
    Apple Card:
      Merchant Name  MM/DD/YYYY  $XX.XX
    """
    month = random.randint(1, 12)
    day   = random.randint(1, 28)
    year  = random.choice([2024, 2025, 2026])
    text  = f"{merchant}  {month:02d}/{day:02d}/{year}  ${amount:.2f}"
    label = f"{clean_merchant_name(merchant)} | {amount:.2f}"
    return text, label

FORMATTERS = [fmt_multiline, fmt_singleline, fmt_chase, fmt_apple]

# ── Negative examples (SKIP) ──────────────────────────────────────────────────

def negative_examples() -> list[tuple[str, str]]:
    negs = []

    # Zelle / ACH credits
    names = ["Alex Johnson", "Mom", "John Smith", "Sarah Lee", "Chris Park"]
    for _ in range(80):
        date = rand_date()
        name = random.choice(names)
        ref  = random.randint(1000000000, 9999999999)
        amt  = round(random.uniform(20, 600), 2)
        bal  = rand_balance()
        negs.append((f"{date}Zelle Payment From {name} {ref}${-amt:.2f}${bal:,.2f}", "SKIP"))

    # Beginning balance lines
    for _ in range(30):
        bal = rand_balance()
        negs.append((f"Beginning Balance${bal:,.2f}", "SKIP"))

    # Header / label lines
    header_samples = [
        "DATEDESCRIP AMOUNT BALANCE",
        "DATE DESCRIPTION AMOUNT BALANCE",
        "Sample Debit Card Statement (Student)",
        "Account Summary",
        "Transaction History",
        "Statement Period: 05/01/2026 – 05/31/2026",
        "Page 1 of 3",
        "Ending Balance",
        "Total Purchases",
        "Minimum Payment Due",
    ]
    for s in header_samples:
        negs.append((s, "SKIP"))

    # Trigger lines only (no amount — model should skip or wait)
    for _ in range(30):
        date = rand_date()
        negs.append((f"{date}Card Purchase", "SKIP"))

    # Large balance-only lines
    for _ in range(20):
        bal = rand_balance()
        negs.append((f"${bal:,.2f}", "SKIP"))

    return negs

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    out_dir = Path(__file__).parent / "data"
    out_dir.mkdir(exist_ok=True)

    rows: list[tuple[str, str]] = []

    # Positive examples — ~600 total, balanced across formats
    per_category   = 25   # per (format × category) combination = 4 × 6 × 25 = 600
    for fmt in FORMATTERS:
        for merchants in MERCHANTS.values():
            for _ in range(per_category):
                merchant = random.choice(merchants)
                amount   = rand_amount()
                text, label = fmt(merchant, amount)
                rows.append((text, label))

    # Negative examples
    rows.extend(negative_examples())

    # Shuffle then split 80 / 20
    random.shuffle(rows)
    split = int(len(rows) * 0.8)
    train_rows, test_rows = rows[:split], rows[split:]

    def write_csv(path: Path, data: list[tuple[str, str]]) -> None:
        with open(path, "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["text", "label"])
            w.writerows(data)

    write_csv(out_dir / "parse_train.csv", train_rows)
    write_csv(out_dir / "parse_test.csv",  test_rows)

    pos = sum(1 for _, l in rows if l != "SKIP")
    neg = sum(1 for _, l in rows if l == "SKIP")
    print(f"Generated {len(rows)} rows  ({pos} purchases, {neg} SKIP)")
    print(f"  Train: {len(train_rows)}  |  Test: {len(test_rows)}")
    print(f"  → {out_dir / 'parse_train.csv'}")
    print(f"  → {out_dir / 'parse_test.csv'}")
    print("\nSample rows:")
    for text, label in random.sample(rows, 6):
        preview = text.replace("\n", " ↵ ")
        print(f"  [{label}]  ←  {preview[:80]}")

if __name__ == "__main__":
    main()
