-- ============================================================
-- Migration 008: Data fixes
-- 1. Correct monthly benefit values (were storing annual total instead of monthly amount)
-- 2. Add 'ongoing' frequency for passive auto-applied benefits
-- 3. Move fuel surcharge waivers to 'ongoing'
-- 4. Create 'insurance' category for insurance-type benefits
-- ============================================================

-- ─── 1. Fix monthly benefit values ───────────────────────────
-- These were storing the ANNUAL total as value_usd, but they're
-- monthly benefits so the value should be the PER-MONTH amount.

-- Chase Sapphire Reserve
UPDATE benefits SET title = 'Lyft Credit', value_usd = 10.00
  WHERE card_id = '00000000-0000-0000-0000-000000000002' AND title ILIKE '%lyft%';

UPDATE benefits SET title = 'Peloton Credit', value_usd = 10.00
  WHERE card_id = '00000000-0000-0000-0000-000000000002' AND title ILIKE '%peloton%';

-- Amex Platinum
UPDATE benefits SET title = 'Uber Cash', value_usd = 15.00
  WHERE card_id = '00000000-0000-0000-0000-000000000003' AND title ILIKE '%uber cash%';

UPDATE benefits SET title = 'Digital Entertainment Credit', value_usd = 25.00
  WHERE card_id = '00000000-0000-0000-0000-000000000003' AND title ILIKE '%digital entertainment%';

UPDATE benefits SET title = 'Walmart+ Credit', value_usd = 12.95
  WHERE card_id = '00000000-0000-0000-0000-000000000003' AND title ILIKE '%walmart%';

-- Amex Gold
UPDATE benefits SET title = 'Dining Credit', value_usd = 10.00
  WHERE card_id = '00000000-0000-0000-0000-000000000004' AND title ILIKE '%dining credit%';

UPDATE benefits SET title = 'Uber Cash', value_usd = 10.00
  WHERE card_id = '00000000-0000-0000-0000-000000000004' AND title ILIKE '%uber cash%';

UPDATE benefits SET title = 'Dunkin'' Credit', value_usd = 7.00
  WHERE card_id = '00000000-0000-0000-0000-000000000004' AND title ILIKE '%dunkin%';

-- ─── 2. Add 'ongoing' frequency value ────────────────────────
ALTER TYPE benefit_frequency ADD VALUE IF NOT EXISTS 'ongoing';

-- ─── 3. Fuel surcharge waivers → ongoing ─────────────────────
-- These apply automatically on qualifying fuel transactions;
-- there's nothing to "claim" month to month.
UPDATE benefits SET frequency = 'ongoing'
  WHERE title ILIKE '%fuel surcharge%';

-- ─── 4. Insurance benefits → 'insurance' category ────────────
-- Air accident, medical, baggage, trip cancellation etc.
-- belong in insurance, not travel.
ALTER TYPE benefit_category ADD VALUE IF NOT EXISTS 'insurance';

UPDATE benefits SET category = 'insurance'
  WHERE benefit_type = 'insurance';
