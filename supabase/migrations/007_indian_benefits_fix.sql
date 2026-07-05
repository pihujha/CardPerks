-- Delete existing Indian card benefits (in case partial data exists) then re-insert
ALTER TABLE benefits
  ALTER COLUMN value_usd TYPE numeric(12, 2);

DELETE FROM benefits WHERE card_id::text LIKE '00000000-0000-0000-0001-%';

-- ─────────────────────────────────────────────────────────────
-- 9. HDFC INFINIA (card_id: ...0001-000000000001)
-- Source: https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0001-000000000001',
 '5 Reward Points per Rs.150 Spent',
 'Earn 5 reward points for every Rs.150 spent on all eligible purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 '10x Reward Points on SmartBuy',
 'Earn up to 10x reward points on travel and shopping purchases made through the HDFC SmartBuy portal.',
 'travel', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Unlimited Priority Pass Lounge Access',
 'Complimentary unlimited access to 1,000+ airport lounges worldwide for primary and add-on cardholders via Priority Pass membership.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Complimentary Club Marriott Membership',
 'Complimentary Club Marriott membership with up to 20% discount on dining and 20% off Best Available Rates at Marriott Hotels in India.',
 'dining', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Complimentary Golf Access',
 'Complimentary golf rounds at select courses in India with 100% green fee waiver for the primary cardholder.',
 'wellness', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Personal Concierge Service',
 'Access to a dedicated personal concierge service available 24/7 for travel, dining, and lifestyle assistance.',
 'other', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Restaurant Discounts – Up to 15%',
 'Up to 15% discount at more than 3,000 participating restaurants across India.',
 'dining', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Fuel Surcharge Waiver',
 '1% fuel surcharge waiver on transactions between Rs.400 and Rs.1,000 per billing cycle.',
 'fuel', 'monthly', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Air Accident Death Benefit',
 'Rs.3 crore (Rs.30,000,000) air accident death insurance coverage for the primary cardholder.',
 'travel', 'annual', 30000000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Emergency Medical Insurance Abroad',
 'Up to Rs.50 lakh (Rs.5,000,000) medical insurance coverage while traveling abroad.',
 'travel', 'annual', 5000000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Accidental Death / Permanent Disability Cover',
 'Up to Rs.9 lakh (Rs.900,000) insurance cover for accidental death or permanent disability.',
 'other', 'annual', 900000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Annual Fee Waiver on Rs.10 Lakh Spend',
 'Renewal fee is waived upon achieving Rs.10 lakh (Rs.1,000,000) in annual spends on the card.',
 'other', 'annual', 12500.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Low Foreign Currency Markup',
 'Only 2% foreign currency markup on international transactions, lower than most premium cards.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card');


-- ─────────────────────────────────────────────────────────────
-- 10. HDFC DINERS CLUB BLACK (card_id: ...0001-000000000002)
-- Source: https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0001-000000000002',
 '5 Reward Points per Rs.150 Spent',
 'Earn 5 reward points for every Rs.150 spent on all eligible purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 '10x Reward Points on Partner Brands',
 'Earn 10x reward points on purchases with select partner brands including travel, dining, and shopping.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 '2x Reward Points on Weekend Dining',
 'Earn 2x reward points on dining expenses made on weekends.',
 'dining', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Unlimited Airport Lounge Access',
 'Unlimited complimentary access to 1,000+ airport lounges worldwide via Diners Club and DreamFolks, for both primary and add-on cardholders.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Welcome Gift – Premium Memberships',
 'Complimentary memberships including Amazon Prime, Forbes, Club Marriott, Times Prime, and MMT BLACK upon card issuance.',
 'other', 'one-time', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Annual Renewal Memberships (on Rs.8L spend)',
 'Retain premium memberships (Amazon Prime, Forbes, Club Marriott, Times Prime, MMT BLACK, Swiggy One) annually upon spending Rs.8 lakh in the previous year.',
 'other', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Monthly Milestone Vouchers (Rs.80K spend)',
 'Choose two vouchers worth Rs.500 each from TataCLiQ, BookMyShow, or Ola Select membership upon Rs.80,000 monthly spend.',
 'shopping', 'monthly', 1000.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Complimentary Golf Access',
 '6 complimentary golf rounds per quarter at select golf courses worldwide.',
 'wellness', 'quarterly', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Fuel Surcharge Waiver',
 '1% fuel surcharge waiver on fuel transactions exceeding Rs.400.',
 'fuel', 'monthly', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Air Accident Death Benefit',
 'Rs.2 crore (Rs.20,000,000) air accident death insurance coverage.',
 'travel', 'annual', 20000000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Emergency Overseas Hospitalization',
 'Up to Rs.50 lakh (Rs.5,000,000) coverage for emergency medical hospitalization abroad.',
 'travel', 'annual', 5000000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Credit Liability Cover',
 'Up to Rs.9 lakh (Rs.900,000) credit liability insurance coverage for unauthorized card use.',
 'other', 'annual', 900000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Baggage Delay Coverage',
 'Up to Rs.55,000 compensation for baggage delay during travel.',
 'travel', 'annual', 55000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black');


-- ─────────────────────────────────────────────────────────────
-- 11. HDFC REGALIA GOLD (card_id: ...0001-000000000003)
-- Source: https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0001-000000000003',
 '4 Reward Points per Rs.150 Spent',
 'Earn 4 reward points for every Rs.150 spent on all eligible retail purchases. 1 RP = Rs.0.65 on SmartBuy.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 '5x Reward Points on Partner Brands',
 'Earn 20 reward points per Rs.150 spent (5x) at Marks & Spencer, Nykaa, Reliance Digital, and Myntra.',
 'shopping', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Welcome Benefit – Rs.2,500 Gift Voucher',
 'Receive a Rs.2,500 gift voucher upon card approval as a welcome benefit.',
 'other', 'one-time', 2500.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Free MMT Black Elite + Club Vistara Silver Membership',
 'Complimentary MMT Black Elite and Club Vistara Silver Tier memberships upon spending Rs.1 lakh within 90 days of card issuance.',
 'travel', 'one-time', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Quarterly Milestone – Rs.1,500 Vouchers',
 'Earn Rs.1,500 in vouchers from Myntra, Marriott, Marks & Spencer, or Reliance Digital upon Rs.1.5 lakh quarterly spend.',
 'shopping', 'quarterly', 1500.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Annual Milestone – Rs.5,000 Flight Voucher (Rs.5L spend)',
 'Receive Rs.5,000 in flight vouchers upon achieving Rs.5 lakh in annual spend.',
 'travel', 'annual', 5000.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Annual Milestone – Additional Rs.5,000 Voucher (Rs.7.5L spend)',
 'Receive an additional Rs.5,000 in flight vouchers upon achieving Rs.7.5 lakh in annual spend.',
 'travel', 'annual', 5000.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 '12 Domestic Airport Lounge Visits',
 '12 complimentary domestic airport lounge visits per year across Indian airports via HDFC Bank Lounge Access Program.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 '6 International Priority Pass Lounge Visits',
 'Up to 6 complimentary international lounge visits per year via Priority Pass membership.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Annual Fee Waiver on Rs.4 Lakh Spend',
 'Renewal fee is waived if you spend Rs.4 lakh or more in the previous calendar year.',
 'other', 'annual', 2500.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Air Accident Death Benefit',
 'Rs.1 crore (Rs.10,000,000) air accident death insurance coverage for the primary cardholder.',
 'travel', 'annual', 10000000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Emergency Medical Insurance Abroad',
 'Up to Rs.15 lakh (Rs.1,500,000) emergency medical insurance coverage while traveling internationally.',
 'travel', 'annual', 1500000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Credit Liability Cover',
 'Up to Rs.9 lakh (Rs.900,000) liability protection against unauthorized card usage.',
 'other', 'annual', 900000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Low Foreign Currency Markup',
 '2% foreign currency markup on international transactions.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card');


-- ─────────────────────────────────────────────────────────────
-- 12. HDFC MILLENNIA (card_id: ...0001-000000000004)
-- Source: https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0001-000000000004',
 '5% Cashback on Partner Brands',
 'Earn 5% cashback on purchases at Amazon, BookMyShow, Flipkart, Myntra, SonyLiv, Swiggy, TataCliq, Uber, and Zomato. 1 Cash Point = Rs.1 when redeemed against statement balance.',
 'shopping', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 '1% Cashback on All Other Purchases',
 'Earn 1% cashback (as Cash Points) on all other eligible retail purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 'Welcome Benefit – Rs.1,000 Gift Voucher',
 'Receive a Rs.1,000 gift voucher as a welcome benefit upon card approval.',
 'other', 'one-time', 1000.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 'Quarterly Domestic Lounge Access (1 per quarter)',
 '1 complimentary domestic airport lounge visit per quarter (up to 4 visits annually). Requires Rs.1 lakh spend in the previous quarter to qualify.',
 'travel', 'quarterly', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 'Dining Discount – Swiggy Dineout',
 'Up to 20% discount on dining at participating restaurants via Swiggy Dineout.',
 'dining', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 'Fuel Surcharge Waiver',
 '1% fuel surcharge waiver on transactions of Rs.400 and above, up to a maximum of Rs.250 per billing cycle.',
 'fuel', 'monthly', 250.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 'Annual Fee Waiver on Rs.1 Lakh Spend',
 'Annual renewal fee (Rs.1,000) is waived if annual spends reach Rs.1 lakh in the previous anniversary year.',
 'other', 'annual', 1000.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card');


-- ─────────────────────────────────────────────────────────────
-- 13. AXIS MAGNUS (card_id: ...0001-000000000005)
-- Source: https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0001-000000000005',
 '12 EDGE Miles per Rs.200 on Travel & Dining',
 'Earn 12 EDGE Miles per Rs.200 spent on travel and dining categories. EDGE Miles can be transferred to airline and hotel programs.',
 'travel', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 '6 EDGE Miles per Rs.200 on All Other Spends',
 'Earn 6 EDGE Miles per Rs.200 on all other eligible purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'Welcome Benefit – 10,000 EDGE Miles',
 'Earn 10,000 EDGE Miles as a welcome bonus on joining the Axis Magnus program.',
 'other', 'one-time', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'Milestone Bonus – 25,000 EDGE Miles (Rs.15L spend)',
 'Earn 25,000 bonus EDGE Miles upon achieving Rs.15 lakh in annual spend.',
 'other', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'Unlimited Priority Pass Lounge Access',
 'Unlimited complimentary access to 1,000+ airport lounges worldwide via Priority Pass for the primary cardholder and one guest per visit.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'Complimentary BLU Membership by Jet Privilege',
 'Complimentary annual BLU membership providing access to exclusive travel offers and lounge services.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'Travel Insurance – Air Accident Cover',
 'Comprehensive travel insurance including air accident death benefit coverage for the primary cardholder.',
 'travel', 'annual', 0.00, 'insurance', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'Fuel Surcharge Waiver',
 '1% fuel surcharge waiver on fuel transactions.',
 'fuel', 'monthly', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'EDGE Miles Transfer to Airline Partners',
 'Transfer EDGE Miles to 15+ airline and hotel partners including Singapore Airlines KrisFlyer, Air India Flying Returns, and Marriott Bonvoy.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'Complimentary Golf Access',
 '2 complimentary rounds of golf per month at select partner golf courses in India.',
 'wellness', 'monthly', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'Zero Foreign Currency Markup',
 'Zero foreign currency markup fee on international transactions, making it ideal for frequent international travelers.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'Concierge Services',
 'Access to 24/7 concierge services for travel bookings, dining reservations, and lifestyle assistance.',
 'other', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card');


-- ─────────────────────────────────────────────────────────────
-- 14. AXIS ATLAS (card_id: ...0001-000000000006)
-- Source: https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0001-000000000006',
 '5 EDGE Miles per Rs.100 on Travel Spends',
 'Earn 5 EDGE Miles per Rs.100 on all travel-related purchases including flights and hotels.',
 'travel', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 '2 EDGE Miles per Rs.100 on All Other Spends',
 'Earn 2 EDGE Miles per Rs.100 on all other eligible purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Welcome Benefit – 2,500 EDGE Miles',
 'Earn 2,500 EDGE Miles as a welcome bonus on card issuance.',
 'other', 'one-time', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Silver Tier – 5,000 Milestone Miles (Rs.3L spend)',
 'Earn 5,000 bonus EDGE Miles on achieving Silver tier milestone of Rs.3 lakh annual spend.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Gold Tier – 10,000 Milestone Miles (Rs.7.5L spend)',
 'Earn 10,000 bonus EDGE Miles on achieving Gold tier milestone of Rs.7.5 lakh annual spend.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Platinum Tier – 15,000 Milestone Miles (Rs.15L spend)',
 'Earn 15,000 bonus EDGE Miles on achieving Platinum tier milestone of Rs.15 lakh annual spend.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Silver Tier – 2 International Lounge Visits',
 '2 complimentary international airport lounge visits per year at Silver tier (Rs.3L annual spend).',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Gold Tier – 5 International Lounge Visits',
 '5 complimentary international airport lounge visits per year at Gold tier (Rs.7.5L annual spend).',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Platinum Tier – Unlimited International Lounge Visits',
 'Unlimited complimentary international airport lounge visits via Priority Pass at Platinum tier (Rs.15L annual spend).',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'EDGE Miles Transfer to Airline Partners',
 'Transfer EDGE Miles to 15+ frequent flyer and hotel loyalty programs at competitive transfer rates.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Travel Insurance Coverage',
 'Comprehensive travel insurance including trip cancellation, lost baggage, and personal accident coverage.',
 'travel', 'annual', 0.00, 'insurance', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Fuel Surcharge Waiver',
 '1% fuel surcharge waiver on fuel transactions.',
 'fuel', 'monthly', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Zero Foreign Currency Markup',
 'Zero foreign currency markup fee on all international purchases.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card');


-- ─────────────────────────────────────────────────────────────
-- 15. SBI CARD PRIME (card_id: ...0001-000000000007)
-- Source: https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0001-000000000007',
 '10 Reward Points per Rs.100 on Dining, Groceries, Movies & Dept Stores',
 'Earn 10 reward points per Rs.100 spent on dining, grocery, movies, and departmental store purchases. 1 RP = Rs.0.25.',
 'dining', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 '20 Reward Points per Rs.100 on Birthday Spends',
 'Earn 20 reward points per Rs.100 on all purchases made on your birthday (capped at 2,000 bonus points per year).',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 '2 Reward Points per Rs.100 on All Other Purchases',
 'Earn 2 reward points per Rs.100 on all other eligible retail purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Welcome Voucher – Rs.3,000',
 'Receive a welcome gift voucher worth Rs.3,000 from select brands including Bata, Hush Puppies, Aditya Birla Fashion, Pantaloons, Yatra, or Shoppers Stop.',
 'shopping', 'one-time', 3000.00, 'credit', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Quarterly Milestone – Pizza Hut Voucher (Rs.50K spend)',
 'Receive a Rs.1,000 Pizza Hut e-voucher upon spending Rs.50,000 in a calendar quarter.',
 'dining', 'quarterly', 1000.00, 'credit', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Annual Milestone – Rs.7,000 Voucher (Rs.5L spend)',
 'Receive a Rs.7,000 Yatra or Pantaloons e-voucher upon achieving Rs.5 lakh in annual spend.',
 'travel', 'annual', 7000.00, 'credit', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 '8 Domestic Airport Lounge Visits',
 '8 complimentary domestic airport lounge visits per year (maximum 2 per quarter) across India.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 '4 International Airport Lounge Visits via Priority Pass',
 '4 complimentary international airport lounge visits annually through Priority Pass membership.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Complimentary Club ITC Silver Membership',
 'Complimentary Club ITC Silver tier membership for access to dining and lifestyle benefits at ITC hotels.',
 'dining', 'annual', 0.00, 'perk', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Golf Benefits (Mastercard / RuPay variants)',
 '4 complimentary rounds of golf per year, 50% discount on additional rounds, and complimentary monthly golf lessons.',
 'wellness', 'annual', 0.00, 'perk', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Fuel Surcharge Waiver',
 '1% fuel surcharge waiver on fuel transactions between Rs.500 and Rs.4,000, capped at Rs.250 per monthly cycle.',
 'fuel', 'monthly', 250.00, 'credit', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Fraud Liability Cover',
 'Rs.1 lakh fraud liability insurance cover protecting against unauthorized transactions on the card.',
 'other', 'annual', 100000.00, 'insurance', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Annual Fee Waiver on Rs.3 Lakh Spend',
 'Annual renewal fee (Rs.2,999) is waived upon achieving Rs.3 lakh in annual spend.',
 'other', 'annual', 2999.00, 'credit', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page');
