"""
Generates a synthetic labeled dataset of (transaction description -> reward category)
for fine-tuning. This is intentionally template + randomization based, not scraped
real user data, since you don't have (and shouldn't use) real CardPerks transactions
for training.

Output: data/transactions.csv with columns [description, category]
"""
import csv
import random
from pathlib import Path

random.seed(42)

MERCHANTS = {
    "dining": ["Chipotle", "Olive Garden", "Starbucks", "Panda Express", "Local Bistro",
               "McDonald's", "Sushi Ren", "The Coffee Bean", "Domino's Pizza", "Shake Shack"],
    "travel": ["Delta Air Lines", "United Airlines", "Marriott Hotels", "Airbnb",
               "Uber", "Lyft", "Hertz Rent A Car", "Expedia", "Southwest Airlines", "Hilton"],
    "groceries": ["Trader Joe's", "Whole Foods", "Safeway", "Kroger", "Costco Wholesale",
                  "Ralphs", "Sprouts Farmers Market", "Aldi", "Vons", "Albertsons"],
    "gas": ["Shell Oil", "Chevron", "76 Gas Station", "Arco", "Costco Gas", "Mobil",
            "Valero", "Exxon", "BP", "Circle K Fuel"],
    "entertainment": ["AMC Theatres", "Netflix", "Spotify", "Steam Games", "Ticketmaster",
                       "Regal Cinemas", "Disney+", "PlayStation Store", "Bowlero", "Topgolf"],
    "other": ["Amazon.com", "Target", "Walgreens", "CVS Pharmacy", "Home Depot",
              "IKEA", "Best Buy", "Office Depot", "PetSmart", "Bed Bath & Beyond"],
}

CITY_STATE = ["San Luis Obispo CA", "San Jose CA", "Los Angeles CA", "Seattle WA",
              "Austin TX", "New York NY", "Chicago IL", "Denver CO"]

TEMPLATES = [
    "{merchant} #{num} {city}",
    "{merchant} {city} {num}",
    "POS DEBIT {merchant} {city}",
    "{merchant}",
    "{merchant}*{num}",
    "TST* {merchant} {city}",
]


def make_row(category):
    merchant = random.choice(MERCHANTS[category])
    template = random.choice(TEMPLATES)
    desc = template.format(
        merchant=merchant,
        city=random.choice(CITY_STATE),
        num=random.randint(1000, 9999),
    )
    return desc, category


def main(n_per_category=150):
    rows = []
    for category in MERCHANTS:
        for _ in range(n_per_category):
            rows.append(make_row(category))
    random.shuffle(rows)

    out_dir = Path(__file__).parent / "data"
    out_dir.mkdir(exist_ok=True)

    split = int(len(rows) * 0.8)
    train_rows, test_rows = rows[:split], rows[split:]

    for filename, subset in [("transactions.csv", train_rows), ("transactions_test.csv", test_rows)]:
        out_path = out_dir / filename
        with open(out_path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["description", "category"])
            writer.writerows(subset)

    print(f"Wrote {len(train_rows)} train rows and {len(test_rows)} test rows to {out_dir}")


if __name__ == "__main__":
    main()
