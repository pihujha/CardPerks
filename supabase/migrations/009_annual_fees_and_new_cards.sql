-- ============================================================
-- Migration 009: Annual fees + new cards (ICICI, Freedom Flex, etc.)
-- ============================================================

-- ─── 1. Add annual fee columns to cards ──────────────────────
ALTER TABLE cards ADD COLUMN IF NOT EXISTS annual_fee    NUMERIC(10,2) DEFAULT 0;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS fee_currency  CHAR(3)       DEFAULT 'USD';

-- ─── 2. Set annual fees for existing US cards ─────────────────
UPDATE cards SET annual_fee = 95,  fee_currency = 'USD' WHERE id = '00000000-0000-0000-0000-000000000001';
UPDATE cards SET annual_fee = 550, fee_currency = 'USD' WHERE id = '00000000-0000-0000-0000-000000000002';
UPDATE cards SET annual_fee = 695, fee_currency = 'USD' WHERE id = '00000000-0000-0000-0000-000000000003';
UPDATE cards SET annual_fee = 250, fee_currency = 'USD' WHERE id = '00000000-0000-0000-0000-000000000004';
UPDATE cards SET annual_fee = 395, fee_currency = 'USD' WHERE id = '00000000-0000-0000-0000-000000000005';
UPDATE cards SET annual_fee = 95,  fee_currency = 'USD' WHERE id = '00000000-0000-0000-0000-000000000006';
UPDATE cards SET annual_fee = 0,   fee_currency = 'USD' WHERE id = '00000000-0000-0000-0000-000000000007';
UPDATE cards SET annual_fee = 0,   fee_currency = 'USD' WHERE id = '00000000-0000-0000-0000-000000000008';

-- ─── 3. Set annual fees for existing Indian cards ─────────────
UPDATE cards SET annual_fee = 12500, fee_currency = 'INR' WHERE id = '00000000-0000-0000-0001-000000000001';
UPDATE cards SET annual_fee = 10000, fee_currency = 'INR' WHERE id = '00000000-0000-0000-0001-000000000002';
UPDATE cards SET annual_fee = 2500,  fee_currency = 'INR' WHERE id = '00000000-0000-0000-0001-000000000003';
UPDATE cards SET annual_fee = 1000,  fee_currency = 'INR' WHERE id = '00000000-0000-0000-0001-000000000004';
UPDATE cards SET annual_fee = 12500, fee_currency = 'INR' WHERE id = '00000000-0000-0000-0001-000000000005';
UPDATE cards SET annual_fee = 5000,  fee_currency = 'INR' WHERE id = '00000000-0000-0000-0001-000000000006';
UPDATE cards SET annual_fee = 2999,  fee_currency = 'INR' WHERE id = '00000000-0000-0000-0001-000000000007';

-- ─── 4. New US cards ──────────────────────────────────────────
INSERT INTO cards (id, name, bank, network, tier, annual_fee, fee_currency) VALUES
  ('00000000-0000-0000-0000-000000000009', 'Chase Freedom Flex',       'Chase',              'Mastercard', 'basic', 0,  'USD'),
  ('00000000-0000-0000-0000-000000000010', 'Citi Double Cash',         'Citi',               'Mastercard', 'basic', 0,  'USD'),
  ('00000000-0000-0000-0000-000000000011', 'Amex Blue Cash Preferred', 'American Express',   'Amex',       'mid',   95, 'USD')
ON CONFLICT (id) DO NOTHING;

-- ─── 5. New ICICI cards ───────────────────────────────────────
INSERT INTO cards (id, name, bank, network, tier, annual_fee, fee_currency) VALUES
  ('00000000-0000-0000-0001-000000000008', 'ICICI Sapphiro',     'ICICI Bank', 'Visa',       'premium', 3500, 'INR'),
  ('00000000-0000-0000-0001-000000000009', 'ICICI Amazon Pay',   'ICICI Bank', 'Visa',       'basic',   500,  'INR'),
  ('00000000-0000-0000-0001-000000000010', 'ICICI Coral',        'ICICI Bank', 'Visa',       'basic',   500,  'INR'),
  ('00000000-0000-0000-0001-000000000011', 'ICICI Rubyx',        'ICICI Bank', 'Mastercard', 'mid',     3000, 'INR')
ON CONFLICT (id) DO NOTHING;

-- ─── 6. Benefits for new US cards ────────────────────────────

-- Chase Freedom Flex
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES
('00000000-0000-0000-0000-000000000009','5% Cash Back on Rotating Categories','5% cash back on up to $1,500 in combined purchases in bonus categories each quarter you activate.','shopping','quarterly',75.00,'credit','USD','https://creditcards.chase.com/cash-back-credit-cards/freedom/flex'),
('00000000-0000-0000-0000-000000000009','5% on Chase Travel','5% cash back on travel purchased through Chase Travel portal.','travel','annual',0.00,'reward_rate','USD','https://creditcards.chase.com/cash-back-credit-cards/freedom/flex'),
('00000000-0000-0000-0000-000000000009','3% on Dining','3% cash back on dining at restaurants, including takeout and eligible delivery services.','dining','annual',0.00,'reward_rate','USD','https://creditcards.chase.com/cash-back-credit-cards/freedom/flex'),
('00000000-0000-0000-0000-000000000009','3% on Drugstores','3% cash back at drugstores.','shopping','annual',0.00,'reward_rate','USD','https://creditcards.chase.com/cash-back-credit-cards/freedom/flex'),
('00000000-0000-0000-0000-000000000009','1% on All Other Purchases','1% cash back on all other eligible purchases.','other','annual',0.00,'reward_rate','USD','https://creditcards.chase.com/cash-back-credit-cards/freedom/flex'),
('00000000-0000-0000-0000-000000000009','Cell Phone Protection','Up to $800 per claim and $1,000 per year in cell phone protection when you pay your phone bill with the card.','other','annual',800.00,'insurance','USD','https://creditcards.chase.com/cash-back-credit-cards/freedom/flex'),
('00000000-0000-0000-0000-000000000009','No Annual Fee','No annual fee to maintain this card.','other','annual',0.00,'perk','USD','https://creditcards.chase.com/cash-back-credit-cards/freedom/flex'),
('00000000-0000-0000-0000-000000000009','Trip Cancellation / Interruption Insurance','Up to $1,500 per person and $6,000 per trip for non-refundable travel expenses.','insurance','annual',1500.00,'insurance','USD','https://creditcards.chase.com/cash-back-credit-cards/freedom/flex'),
('00000000-0000-0000-0000-000000000009','Purchase Protection','Covers new purchases for 120 days against damage or theft, up to $500 per claim, $50,000 per account.','other','annual',500.00,'insurance','USD','https://creditcards.chase.com/cash-back-credit-cards/freedom/flex');

-- Citi Double Cash
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES
('00000000-0000-0000-0000-000000000010','2% Cash Back Everywhere','Earn 1% when you buy and 1% when you pay, totaling 2% cash back on all purchases — no category restrictions.','other','annual',0.00,'reward_rate','USD','https://www.citi.com/credit-cards/citi-double-cash-credit-card'),
('00000000-0000-0000-0000-000000000010','No Annual Fee','No annual fee to maintain this card.','other','annual',0.00,'perk','USD','https://www.citi.com/credit-cards/citi-double-cash-credit-card'),
('00000000-0000-0000-0000-000000000010','Citi Entertainment Access','Special access to purchase tickets to thousands of events, including concerts, sporting events, dining experiences, and more.','entertainment','annual',0.00,'perk','USD','https://www.citi.com/credit-cards/citi-double-cash-credit-card'),
('00000000-0000-0000-0000-000000000010','$200 Cash Back Welcome Offer','Earn $200 cash back after spending $1,500 on purchases within the first 6 months.','other','one-time',200.00,'credit','USD','https://www.citi.com/credit-cards/citi-double-cash-credit-card');

-- Amex Blue Cash Preferred
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES
('00000000-0000-0000-0000-000000000011','6% at U.S. Supermarkets','6% cash back at U.S. supermarkets on up to $6,000 per year in purchases (then 1%).','shopping','annual',0.00,'reward_rate','USD','https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/'),
('00000000-0000-0000-0000-000000000011','6% on Select U.S. Streaming','6% cash back on select U.S. streaming subscriptions.','entertainment','annual',0.00,'reward_rate','USD','https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/'),
('00000000-0000-0000-0000-000000000011','3% at U.S. Gas Stations','3% cash back at U.S. gas stations.','fuel','annual',0.00,'reward_rate','USD','https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/'),
('00000000-0000-0000-0000-000000000011','3% on U.S. Transit','3% cash back on transit including taxis, rideshare, parking, tolls, trains, and buses.','travel','annual',0.00,'reward_rate','USD','https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/'),
('00000000-0000-0000-0000-000000000011','$84 Disney Bundle Credit','Up to $7 per month ($84/year) in statement credits when you pay for a Disney Bundle subscription.','entertainment','monthly',7.00,'credit','USD','https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/'),
('00000000-0000-0000-0000-000000000011','$120 Equinox Credit','Up to $10 per month ($120/year) in statement credits on eligible Equinox memberships.','wellness','monthly',10.00,'credit','USD','https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/'),
('00000000-0000-0000-0000-000000000011','Return Protection','For eligible purchases, you may return them to Amex if the retailer won''t accept the return within 90 days of purchase, up to $300 per item.','other','annual',0.00,'perk','USD','https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/');

-- ─── 7. Benefits for ICICI cards ─────────────────────────────

-- ICICI Sapphiro
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES
('00000000-0000-0000-0001-000000000008','Unlimited Domestic Lounge Access','Complimentary unlimited access to domestic airport lounges across India via DreamFolks.','travel','annual',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card'),
('00000000-0000-0000-0001-000000000008','4 International Lounge Visits/Year','4 complimentary international airport lounge visits per year via Priority Pass.','travel','annual',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card'),
('00000000-0000-0000-0001-000000000008','2 Golf Rounds per Quarter','2 complimentary golf rounds per quarter at select golf courses in India.','wellness','quarterly',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card'),
('00000000-0000-0000-0001-000000000008','2x Reward Points on All Spends','2 reward points per Rs.100 spent on all eligible purchases.','other','annual',0.00,'reward_rate','INR','https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card'),
('00000000-0000-0000-0001-000000000008','Air Accident Insurance','Rs.1 crore air accident death insurance coverage.','insurance','annual',10000000.00,'insurance','INR','https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card'),
('00000000-0000-0000-0001-000000000008','Fuel Surcharge Waiver','1% fuel surcharge waiver on fuel transactions between Rs.500 and Rs.4,000 per billing cycle.','fuel','ongoing',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card'),
('00000000-0000-0000-0001-000000000008','Dining Discount – Culinary Treats','15-25% discount at 2,500+ restaurants across India via the ICICI Culinary Treats programme.','dining','annual',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card'),
('00000000-0000-0000-0001-000000000008','Annual Fee Waiver on Rs.6L Spend','Annual renewal fee waived on spending Rs.6 lakh in the previous anniversary year.','other','annual',3500.00,'credit','INR','https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card');

-- ICICI Amazon Pay
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES
('00000000-0000-0000-0001-000000000009','5% Back on Amazon – Prime Members','5% back on all Amazon.in purchases for Amazon Prime members, credited as Amazon Pay balance.','shopping','annual',0.00,'reward_rate','INR','https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-icici-credit-card'),
('00000000-0000-0000-0001-000000000009','3% Back on Amazon – Non-Prime','3% back on Amazon.in purchases for non-Prime cardholders.','shopping','annual',0.00,'reward_rate','INR','https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-icici-credit-card'),
('00000000-0000-0000-0001-000000000009','2% Back on Amazon Pay Partners','2% back on payments made at Amazon Pay partner merchants.','shopping','annual',0.00,'reward_rate','INR','https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-icici-credit-card'),
('00000000-0000-0000-0001-000000000009','1% Back on All Other Spends','1% back on all other eligible purchases as Amazon Pay balance.','other','annual',0.00,'reward_rate','INR','https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-icici-credit-card'),
('00000000-0000-0000-0001-000000000009','No Annual Fee','No annual renewal fee, ever.','other','annual',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-icici-credit-card'),
('00000000-0000-0000-0001-000000000009','Fuel Surcharge Waiver','1% fuel surcharge waiver on fuel transactions.','fuel','ongoing',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-icici-credit-card');

-- ICICI Coral
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES
('00000000-0000-0000-0001-000000000010','2 Reward Points per Rs.100','Earn 2 reward points (PAYBACK points) for every Rs.100 spent on eligible purchases.','other','annual',0.00,'reward_rate','INR','https://www.icicibank.com/personal-banking/cards/credit-card/coral-credit-card'),
('00000000-0000-0000-0001-000000000010','1 Domestic Lounge Visit per Quarter','1 complimentary domestic airport lounge access per quarter (up to 4 per year).','travel','quarterly',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/coral-credit-card'),
('00000000-0000-0000-0001-000000000010','Buy 1 Get 1 Movie Ticket – BookMyShow','Buy one movie ticket on BookMyShow, get one free (up to Rs.250 off), once per month.','entertainment','monthly',250.00,'credit','INR','https://www.icicibank.com/personal-banking/cards/credit-card/coral-credit-card'),
('00000000-0000-0000-0001-000000000010','Dining Discount – Culinary Treats','Up to 15% discount at 2,500+ partner restaurants through ICICI Culinary Treats.','dining','annual',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/coral-credit-card'),
('00000000-0000-0000-0001-000000000010','Fuel Surcharge Waiver','1% fuel surcharge waiver on fuel transactions between Rs.500 and Rs.4,000.','fuel','ongoing',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/coral-credit-card'),
('00000000-0000-0000-0001-000000000010','Annual Fee Waiver on Rs.1.5L Spend','Annual renewal fee waived if annual spends reach Rs.1.5 lakh in the previous year.','other','annual',500.00,'credit','INR','https://www.icicibank.com/personal-banking/cards/credit-card/coral-credit-card');

-- ICICI Rubyx
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES
('00000000-0000-0000-0001-000000000011','2 Domestic Lounge Visits per Quarter','2 complimentary domestic airport lounge visits per quarter (8 per year).','travel','quarterly',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/rubyx-credit-card'),
('00000000-0000-0000-0001-000000000011','2 International Lounge Visits per Quarter','2 complimentary international airport lounge visits per quarter via Dragon Pass.','travel','quarterly',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/rubyx-credit-card'),
('00000000-0000-0000-0001-000000000011','Buy 1 Get 1 Movie – BookMyShow','Buy one, get one free movie ticket on BookMyShow, twice per month.','entertainment','monthly',500.00,'credit','INR','https://www.icicibank.com/personal-banking/cards/credit-card/rubyx-credit-card'),
('00000000-0000-0000-0001-000000000011','2 Reward Points per Rs.100','Earn 2 reward points for every Rs.100 spent on eligible purchases.','other','annual',0.00,'reward_rate','INR','https://www.icicibank.com/personal-banking/cards/credit-card/rubyx-credit-card'),
('00000000-0000-0000-0001-000000000011','Dining Discount – Culinary Treats','15-25% discount at 2,500+ partner restaurants via ICICI Culinary Treats.','dining','annual',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/rubyx-credit-card'),
('00000000-0000-0000-0001-000000000011','Fuel Surcharge Waiver','1% fuel surcharge waiver on fuel transactions.','fuel','ongoing',0.00,'perk','INR','https://www.icicibank.com/personal-banking/cards/credit-card/rubyx-credit-card'),
('00000000-0000-0000-0001-000000000011','Annual Fee Waiver on Rs.3L Spend','Annual renewal fee waived if annual spend reaches Rs.3 lakh.','other','annual',3000.00,'credit','INR','https://www.icicibank.com/personal-banking/cards/credit-card/rubyx-credit-card');
