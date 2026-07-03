-- ============================================================
-- CardPerks — Seed Migration 002 (US Cards)
-- If you already ran an older version: TRUNCATE benefits, cards CASCADE first
-- ============================================================

INSERT INTO cards (id, name, bank, network, tier) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Chase Sapphire Preferred',   'Chase',             'Visa',       'mid'),
  ('00000000-0000-0000-0000-000000000002', 'Chase Sapphire Reserve',     'Chase',             'Visa',       'premium'),
  ('00000000-0000-0000-0000-000000000003', 'Amex Platinum',              'American Express',  'Amex',       'premium'),
  ('00000000-0000-0000-0000-000000000004', 'Amex Gold',                  'American Express',  'Amex',       'mid'),
  ('00000000-0000-0000-0000-000000000005', 'Capital One Venture X',      'Capital One',       'Visa',       'premium'),
  ('00000000-0000-0000-0000-000000000006', 'Citi Premier',               'Citi',              'Mastercard', 'mid'),
  ('00000000-0000-0000-0000-000000000007', 'Discover it Cash Back',      'Discover',          'Discover',   'basic'),
  ('00000000-0000-0000-0000-000000000008', 'Chase Freedom Unlimited',    'Chase',             'Visa',       'basic');


-- ─── Chase Sapphire Preferred ────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0000-000000000001',
   '$50 Annual Hotel Credit',
   'Statement credit on hotel stays booked through Chase Travel portal.',
   'travel', 'annual', 50.00, 'credit', 'USD',
   'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

  ('00000000-0000-0000-0000-000000000001',
   'Complimentary DashPass',
   'Free DoorDash DashPass subscription (normally $9.99/month). Activate through the Chase app.',
   'dining', 'annual', 96.00, 'perk', 'USD',
   'https://www.doordash.com/dasher/app/in-app-offer/?utm_source=Chase'),

  ('00000000-0000-0000-0000-000000000001',
   'Trip Delay Reimbursement',
   'Up to $500 per ticket for delays of 12+ hours or requiring an overnight stay.',
   'travel', 'annual', 500.00, 'insurance', 'USD',
   'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

  ('00000000-0000-0000-0000-000000000001',
   'Primary Auto Rental Insurance',
   'Primary collision damage waiver on rental cars — no need to file with your own insurance first.',
   'travel', 'annual', 75.00, 'insurance', 'USD',
   'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred');


-- ─── Chase Sapphire Reserve ──────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0000-000000000002',
   '$300 Annual Travel Credit',
   'Automatically applied to the first $300 in travel purchases each cardmember year — flights, hotels, rideshare, parking, tolls, and more.',
   'travel', 'annual', 300.00, 'credit', 'USD',
   'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

  ('00000000-0000-0000-0000-000000000002',
   'Priority Pass Select',
   'Unlimited access to 1,400+ airport lounges worldwide. Includes 2 free guests per visit.',
   'travel', 'annual', 429.00, 'perk', 'USD',
   'https://www.prioritypass.com/en/partner-card-holders/chase'),

  ('00000000-0000-0000-0000-000000000002',
   'Global Entry / TSA PreCheck Credit',
   'Up to $100 statement credit for Global Entry application fee every 4.5 years (includes TSA PreCheck).',
   'travel', 'annual', 100.00, 'credit', 'USD',
   'https://www.cbp.gov/travel/trusted-traveler-programs/global-entry'),

  ('00000000-0000-0000-0000-000000000002',
   'Complimentary DashPass',
   'Free DoorDash DashPass subscription. Activate through the Chase app.',
   'dining', 'annual', 96.00, 'perk', 'USD',
   'https://www.doordash.com/dasher/app/in-app-offer/?utm_source=Chase'),

  ('00000000-0000-0000-0000-000000000002',
   '$5 Monthly DoorDash Credit',
   '$5 in DoorDash in-app credit each month, on top of the free DashPass.',
   'dining', 'monthly', 5.00, 'credit', 'USD',
   'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

  ('00000000-0000-0000-0000-000000000002',
   '$10 Monthly Peloton Credit',
   'Up to $10/month credit on eligible Peloton app or equipment purchases through 12/31/2025.',
   'wellness', 'monthly', 10.00, 'credit', 'USD',
   'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve');


-- ─── Amex Platinum ───────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0000-000000000003',
   '$200 Hotel Credit',
   'Up to $200 back on prepaid Fine Hotels + Resorts or The Hotel Collection bookings via Amex Travel (min 2-night stay).',
   'travel', 'annual', 200.00, 'credit', 'USD',
   'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

  ('00000000-0000-0000-0000-000000000003',
   '$200 Airline Fee Credit',
   'Up to $200 per year in statement credits for incidental fees (checked bags, seat upgrades, in-flight Wi-Fi) on one selected airline.',
   'travel', 'annual', 200.00, 'credit', 'USD',
   'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

  ('00000000-0000-0000-0000-000000000003',
   '$15 Monthly Uber Cash',
   '$15 Uber Cash each month ($20 in December) toward Uber rides or Uber Eats in the US. Must add Amex Platinum to Uber account.',
   'travel', 'monthly', 15.00, 'credit', 'USD',
   'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

  ('00000000-0000-0000-0000-000000000003',
   '$100 Saks Fifth Avenue Credit',
   'Up to $50 in statement credits at Saks Jan–Jun, and another $50 Jul–Dec ($100 total/year).',
   'shopping', 'annual', 100.00, 'credit', 'USD',
   'https://www.saks.com/f/american-express-platinum'),

  ('00000000-0000-0000-0000-000000000003',
   '$20 Monthly Digital Entertainment Credit',
   'Up to $20/month on eligible subscriptions: Disney+, Hulu, ESPN+, Peacock, SiriusXM, The New York Times, and more.',
   'entertainment', 'monthly', 20.00, 'credit', 'USD',
   'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

  ('00000000-0000-0000-0000-000000000003',
   '$25 Monthly Equinox Credit',
   'Up to $300/year ($25/month) toward an Equinox gym membership or Equinox+ digital fitness app.',
   'wellness', 'monthly', 25.00, 'credit', 'USD',
   'https://www.equinox.com/amex'),

  ('00000000-0000-0000-0000-000000000003',
   '$189 CLEAR Plus Credit',
   'Annual statement credit covering the full cost of a CLEAR Plus membership for expedited airport security lanes.',
   'travel', 'annual', 189.00, 'credit', 'USD',
   'https://www.clearme.com/partners/amex'),

  ('00000000-0000-0000-0000-000000000003',
   '$12.95 Monthly Walmart+ Credit',
   'Monthly statement credit covering the full cost of a Walmart+ membership ($12.95/month).',
   'shopping', 'monthly', 12.95, 'credit', 'USD',
   'https://www.walmart.com/plus/americanexpress'),

  ('00000000-0000-0000-0000-000000000003',
   'Priority Pass Select + Centurion Lounges',
   'Unlimited access to Priority Pass lounges and American Express Centurion Lounges for cardholder and guests.',
   'travel', 'annual', 429.00, 'perk', 'USD',
   'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

  ('00000000-0000-0000-0000-000000000003',
   'Global Entry / TSA PreCheck Credit',
   'Up to $100 reimbursement for Global Entry or TSA PreCheck application fee every 4.5 years.',
   'travel', 'annual', 100.00, 'credit', 'USD',
   'https://www.cbp.gov/travel/trusted-traveler-programs/global-entry');


-- ─── Amex Gold ───────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0000-000000000004',
   '$10 Monthly Dining Credit',
   'Up to $10/month in statement credits at Grubhub, The Cheesecake Factory, Goldbelly, Wine.com, and select Shake Shack.',
   'dining', 'monthly', 10.00, 'credit', 'USD',
   'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

  ('00000000-0000-0000-0000-000000000004',
   '$10 Monthly Uber Cash',
   '$10 Uber Cash each month toward Uber rides or Uber Eats in the US. Add card to Uber account to activate.',
   'travel', 'monthly', 10.00, 'credit', 'USD',
   'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

  ('00000000-0000-0000-0000-000000000004',
   '$7 Monthly Dunkin'' Credit',
   'Up to $7/month in statement credits at Dunkin'' locations nationwide.',
   'dining', 'monthly', 7.00, 'credit', 'USD',
   'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

  ('00000000-0000-0000-0000-000000000004',
   '$100 Hotel Collection Credit',
   'Up to $100 in credit on eligible charges when booking The Hotel Collection via Amex Travel (2-night minimum).',
   'travel', 'annual', 100.00, 'credit', 'USD',
   'https://www.americanexpress.com/us/credit-cards/card/gold-card/');


-- ─── Capital One Venture X ───────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0000-000000000005',
   '$300 Annual Travel Credit',
   'Up to $300 back in statement credits on bookings made through Capital One Travel each cardmember year.',
   'travel', 'annual', 300.00, 'credit', 'USD',
   'https://www.capitalone.com/credit-cards/venture-x/'),

  ('00000000-0000-0000-0000-000000000005',
   '10,000 Anniversary Bonus Miles',
   '10,000 miles (worth $100 in travel) deposited on your account anniversary each year.',
   'travel', 'annual', 100.00, 'credit', 'USD',
   'https://www.capitalone.com/credit-cards/venture-x/'),

  ('00000000-0000-0000-0000-000000000005',
   'Priority Pass Select + Capital One Lounges',
   'Unlimited Priority Pass lounge access plus access to Capital One Lounges for cardholder and 2 guests per visit.',
   'travel', 'annual', 429.00, 'perk', 'USD',
   'https://www.capitalone.com/credit-cards/venture-x/'),

  ('00000000-0000-0000-0000-000000000005',
   'Global Entry / TSA PreCheck Credit',
   'Up to $100 reimbursement for Global Entry or TSA PreCheck application fee.',
   'travel', 'annual', 100.00, 'credit', 'USD',
   'https://www.cbp.gov/travel/trusted-traveler-programs/global-entry');


-- ─── Citi Premier ────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0000-000000000006',
   '$100 Annual Hotel Savings Benefit',
   'Save $100 on a single hotel stay of $500+ (before taxes and fees) booked through thankyou.com. One use per calendar year.',
   'travel', 'annual', 100.00, 'credit', 'USD',
   'https://www.citi.com/credit-cards/citi-premier-credit-card');


-- ─── Discover it Cash Back ───────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0000-000000000007',
   'Cashback Match (First Year)',
   'Discover automatically matches all cash back you earn at the end of your first year — no limit, no sign-ups.',
   'other', 'one-time', 0.00, 'perk', 'USD',
   'https://www.discover.com/credit-cards/cash-back/it-card.html'),

  ('00000000-0000-0000-0000-000000000007',
   'Free FICO Credit Score',
   'Your FICO score on every monthly statement and in the app, updated monthly at no cost.',
   'other', 'monthly', 0.00, 'perk', 'USD',
   'https://www.discover.com/credit-cards/cash-back/it-card.html'),

  ('00000000-0000-0000-0000-000000000007',
   'SSN Dark Web Alerts',
   'Free monitoring of your Social Security Number across thousands of Dark Web sites with email alerts if found.',
   'other', 'annual', 0.00, 'perk', 'USD',
   'https://www.discover.com/credit-cards/cash-back/it-card.html');


-- ─── Chase Freedom Unlimited ─────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0000-000000000008',
   '3% Cash Back on Dining',
   '3% cash back at restaurants, including takeout and eligible delivery services.',
   'dining', 'monthly', 0.00, 'reward_rate', 'USD',
   'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

  ('00000000-0000-0000-0000-000000000008',
   '1.5% Cash Back on Everything',
   '1.5% unlimited cash back on all other purchases — no category tracking needed.',
   'other', 'monthly', 0.00, 'reward_rate', 'USD',
   'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

  ('00000000-0000-0000-0000-000000000008',
   'Complimentary DashPass (3 months)',
   'Three months of free DoorDash DashPass upon activation.',
   'dining', 'one-time', 24.00, 'perk', 'USD',
   'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

  ('00000000-0000-0000-0000-000000000008',
   'Trip Cancellation / Interruption Insurance',
   'Up to $1,500 per person and $6,000 per trip for prepaid non-refundable travel if your trip is cancelled or cut short.',
   'travel', 'annual', 0.00, 'insurance', 'USD',
   'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

  ('00000000-0000-0000-0000-000000000008',
   'Purchase Protection',
   'Covers new purchases against damage or theft for 120 days, up to $500 per claim and $50,000 per account.',
   'shopping', 'annual', 0.00, 'insurance', 'USD',
   'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited');
