-- ============================================================
-- CardPerks — Seed Migration 004 (Indian Cards)
-- Requires 003_schema_updates.sql to have been run first
-- Values are in INR (currency = 'INR')
-- ============================================================

INSERT INTO cards (id, name, bank, network, tier) VALUES
  ('00000000-0000-0000-0001-000000000001', 'HDFC Infinia',              'HDFC Bank',    'Visa',       'premium'),
  ('00000000-0000-0000-0001-000000000002', 'HDFC Diners Club Black',    'HDFC Bank',    'Diners',     'premium'),
  ('00000000-0000-0000-0001-000000000003', 'HDFC Regalia Gold',         'HDFC Bank',    'Visa',       'mid'),
  ('00000000-0000-0000-0001-000000000004', 'HDFC Millennia',            'HDFC Bank',    'Visa',       'basic'),
  ('00000000-0000-0000-0001-000000000005', 'Axis Magnus',               'Axis Bank',    'Visa',       'premium'),
  ('00000000-0000-0000-0001-000000000006', 'Axis Atlas',                'Axis Bank',    'Visa',       'mid'),
  ('00000000-0000-0000-0001-000000000007', 'SBI Card PRIME',            'SBI Card',     'Visa',       'mid');


-- ─── HDFC Infinia ────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0001-000000000001',
   'Unlimited Priority Pass Lounge Access',
   'Unlimited complimentary access to 1,500+ Priority Pass airport lounges worldwide for cardholder and add-on members.',
   'travel', 'annual', 15000.00, 'perk', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

  ('00000000-0000-0000-0001-000000000001',
   'Club Marriott South Asia Membership',
   'Complimentary Club Marriott South Asia membership — 20% off at 150+ Marriott restaurants and 20% off room rates.',
   'travel', 'annual', 7500.00, 'perk', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

  ('00000000-0000-0000-0001-000000000001',
   'Annual Fee Reversal on ₹10L Spend',
   'Annual fee of ₹12,500 reversed in full if you spend ₹10 lakh or more in the membership year.',
   'other', 'annual', 12500.00, 'credit', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

  ('00000000-0000-0000-0001-000000000001',
   '5 Reward Points per ₹150 on All Spends',
   'Earn 5 reward points for every ₹150 spent on all categories (10x on SmartBuy portal).',
   'other', 'monthly', 0.00, 'reward_rate', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

  ('00000000-0000-0000-0001-000000000001',
   'Complimentary Golf Games',
   '6 complimentary golf games per quarter at leading golf courses across India and select international courses.',
   'entertainment', 'quarterly', 9000.00, 'perk', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card');


-- ─── HDFC Diners Club Black ──────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0001-000000000002',
   'Unlimited Priority Pass Lounge Access',
   'Unlimited complimentary access to 1,000+ Priority Pass airport lounges worldwide.',
   'travel', 'annual', 15000.00, 'perk', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

  ('00000000-0000-0000-0001-000000000002',
   'Club Marriott South Asia Membership',
   'Complimentary Club Marriott South Asia membership with 20% off dining and rooms at Marriott properties.',
   'travel', 'annual', 7500.00, 'perk', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

  ('00000000-0000-0000-0001-000000000002',
   '5 Complimentary Golf Games per Quarter',
   '5 free golf games per quarter at top golf clubs in India and internationally.',
   'entertainment', 'quarterly', 7500.00, 'perk', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

  ('00000000-0000-0000-0001-000000000002',
   'Annual Fee Reversal on ₹5L Spend',
   'Annual fee of ₹10,000 reversed if you spend ₹5 lakh in the membership year.',
   'other', 'annual', 10000.00, 'credit', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

  ('00000000-0000-0000-0001-000000000002',
   '10x Reward Points on SmartBuy Partners',
   '10x reward points on Flights, Hotels, Instant EMI, and Smartbuy partners. 5x on dining and entertainment.',
   'other', 'monthly', 0.00, 'reward_rate', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black');


-- ─── HDFC Regalia Gold ───────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0001-000000000003',
   '12 Domestic Airport Lounge Visits/Year',
   '12 complimentary domestic airport lounge visits per year (3 per quarter) across 50+ Indian airports.',
   'travel', 'annual', 3600.00, 'perk', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

  ('00000000-0000-0000-0001-000000000003',
   '6 International Lounge Visits/Year via Priority Pass',
   '6 complimentary international airport lounge visits per year through Priority Pass membership.',
   'travel', 'annual', 9000.00, 'perk', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

  ('00000000-0000-0000-0001-000000000003',
   'Club Vistara Silver Membership',
   'Complimentary Club Vistara Silver membership with bonus CV Points and seat upgrades on Vistara flights.',
   'travel', 'annual', 2500.00, 'perk', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

  ('00000000-0000-0000-0001-000000000003',
   '₹1,500 Milestone Vouchers',
   '₹1,500 worth of Marks & Spencer / Reliance Digital / Myntra / Nykaa vouchers on spending ₹1.5L per quarter.',
   'shopping', 'quarterly', 1500.00, 'credit', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

  ('00000000-0000-0000-0001-000000000003',
   'Annual Fee Reversal on ₹3L Spend',
   'Annual fee of ₹2,500 waived if you spend ₹3 lakh in the preceding membership year.',
   'other', 'annual', 2500.00, 'credit', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card');


-- ─── HDFC Millennia ──────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0001-000000000004',
   '5% Cashback on Top Apps',
   '5% cashback on Amazon, Flipkart, Myntra, Swiggy, Zomato, Uber, BigBasket, and BookMyShow when paid via the card.',
   'shopping', 'monthly', 0.00, 'reward_rate', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

  ('00000000-0000-0000-0001-000000000004',
   '1% Cashback on All Other Online Spends',
   '1% cashback on all other online transactions (capped at ₹1,000/month).',
   'other', 'monthly', 0.00, 'reward_rate', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

  ('00000000-0000-0000-0001-000000000004',
   '₹1,000 Gift Voucher on ₹1L Quarterly Spend',
   'Earn a ₹1,000 gift voucher (Amazon, Flipkart, etc.) each quarter you spend ₹1 lakh or more.',
   'shopping', 'quarterly', 1000.00, 'credit', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

  ('00000000-0000-0000-0001-000000000004',
   '8 Complimentary Domestic Lounge Visits/Year',
   '8 free domestic airport lounge visits per year (2 per quarter) at 30+ Indian airports.',
   'travel', 'annual', 2400.00, 'perk', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

  ('00000000-0000-0000-0001-000000000004',
   'Annual Fee Reversal on ₹1L Spend',
   'Annual fee of ₹1,000 waived if you spend ₹1 lakh in the membership year.',
   'other', 'annual', 1000.00, 'credit', 'INR',
   'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card');


-- ─── Axis Magnus ─────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0001-000000000005',
   'Unlimited Priority Pass Lounge Access',
   'Unlimited complimentary Priority Pass lounge access for cardholder and one guest per visit.',
   'travel', 'annual', 15000.00, 'perk', 'INR',
   'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

  ('00000000-0000-0000-0001-000000000005',
   '₹25,000 Travel Voucher on ₹15L Annual Spend',
   'Earn a ₹25,000 travel voucher (flight/hotel bookings) when you spend ₹15 lakh in a membership year.',
   'travel', 'annual', 25000.00, 'credit', 'INR',
   'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

  ('00000000-0000-0000-0001-000000000005',
   '35 EDGE Miles per ₹200 on Travel & Dining',
   'Earn 35 EDGE Miles per ₹200 spent on travel and dining categories (flights, hotels, restaurants).',
   'travel', 'monthly', 0.00, 'reward_rate', 'INR',
   'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

  ('00000000-0000-0000-0001-000000000005',
   '12 EDGE Miles per ₹200 on All Other Spends',
   'Earn 12 EDGE Miles per ₹200 on all other categories.',
   'other', 'monthly', 0.00, 'reward_rate', 'INR',
   'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

  ('00000000-0000-0000-0001-000000000005',
   '4 Complimentary Golf Games per Month',
   '4 free golf rounds per month at leading golf courses in India.',
   'entertainment', 'monthly', 4000.00, 'perk', 'INR',
   'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card');


-- ─── Axis Atlas ──────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0001-000000000006',
   '5 Domestic Lounge Visits/Quarter',
   '5 complimentary domestic airport lounge visits per quarter via VISA Lounge Access Program.',
   'travel', 'quarterly', 1500.00, 'perk', 'INR',
   'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

  ('00000000-0000-0000-0001-000000000006',
   'EDGE Miles on All Spends',
   'Earn 5 EDGE Miles per ₹100 on travel categories and 2 EDGE Miles per ₹100 on all other spends.',
   'travel', 'monthly', 0.00, 'reward_rate', 'INR',
   'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

  ('00000000-0000-0000-0001-000000000006',
   'Milestone Travel Vouchers',
   'Earn travel vouchers of ₹500–₹5,000 on reaching quarterly and annual spend milestones.',
   'travel', 'annual', 5000.00, 'credit', 'INR',
   'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card');


-- ─── SBI Card PRIME ──────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

  ('00000000-0000-0000-0001-000000000007',
   '₹3,000 Pizza Hut e-Voucher on Annual Fee Payment',
   'Receive a ₹3,000 Pizza Hut e-Voucher when you pay the annual renewal fee.',
   'dining', 'annual', 3000.00, 'credit', 'INR',
   'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

  ('00000000-0000-0000-0001-000000000007',
   '₹1,500 Travel Voucher per Quarter',
   '₹1,500 e-Gift voucher from Yatra or Cleartrip each quarter on meeting spend targets.',
   'travel', 'quarterly', 1500.00, 'credit', 'INR',
   'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

  ('00000000-0000-0000-0001-000000000007',
   '₹500 BookMyShow Voucher per Quarter',
   '₹500 BookMyShow e-Gift voucher per quarter on meeting spend targets.',
   'entertainment', 'quarterly', 500.00, 'credit', 'INR',
   'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

  ('00000000-0000-0000-0001-000000000007',
   'Club Vistara Silver Membership',
   'Complimentary Club Vistara Silver membership with bonus CV Points and priority check-in benefits.',
   'travel', 'annual', 2500.00, 'perk', 'INR',
   'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

  ('00000000-0000-0000-0001-000000000007',
   '8 Complimentary Airport Lounge Visits/Year',
   '8 complimentary domestic airport lounge visits per year (2 per quarter) across major Indian airports.',
   'travel', 'annual', 2400.00, 'perk', 'INR',
   'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

  ('00000000-0000-0000-0001-000000000007',
   'Renewal Fee Waiver on ₹3L Spend',
   'Annual renewal fee of ₹2,999 waived if you spend ₹3 lakh in the previous membership year.',
   'other', 'annual', 2999.00, 'credit', 'INR',
   'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page');
