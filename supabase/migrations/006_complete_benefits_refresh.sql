-- ============================================================
-- CardPerks — Migration 006: Complete Benefits Refresh
-- Replaces all existing benefits with comprehensive data
-- from official card pages (fetched July 2026)
-- ============================================================

ALTER TABLE benefits
  ALTER COLUMN value_usd TYPE numeric(12, 2);

DELETE FROM benefits;

-- ─────────────────────────────────────────────────────────────
-- 1. CHASE SAPPHIRE PREFERRED (card_id: ...0001)
-- Source: https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0000-000000000001',
 'Welcome Bonus – 75,000 Points',
 'Earn 75,000 bonus points after spending $5,000 on purchases in the first 3 months from account opening.',
 'other', 'one-time', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 '5x Points on Chase Travel',
 'Earn 5x total points on travel booked through Chase Travel portal.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 '3x Points on Dining',
 'Earn 3x points on dining at restaurants, including takeout and eligible delivery services.',
 'dining', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 '3x Points on Online Grocery & Streaming',
 'Earn 3x points on online grocery purchases (excluding Walmart, Target, and wholesale clubs) and select streaming services.',
 'shopping', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 '2x Points on All Other Travel',
 'Earn 2x points on travel purchases not booked through Chase Travel.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 '1x Points on All Other Purchases',
 'Earn 1x point per dollar on all other eligible purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 '$100 Annual Hotel Credit',
 'Earn up to $100 in statement credits each account anniversary year for hotel stays booked through Chase Travel.',
 'travel', 'annual', 100.00, 'credit', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Global Entry / TSA PreCheck Credit',
 'One statement credit of up to $120 every four years for Global Entry or TSA PreCheck enrollment fees.',
 'travel', 'one-time', 120.00, 'credit', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Complimentary DashPass Membership',
 'Complimentary DashPass membership (normally $9.99/month) plus $10 monthly promo credits, a $240 annual value.',
 'dining', 'annual', 240.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Complimentary Apple TV+',
 'Get one year of complimentary Apple TV+ subscription (activate by 12/31/2026), valued at approximately $156/year.',
 'entertainment', 'annual', 156.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Trip Cancellation / Interruption Insurance',
 'Reimburses up to $10,000 per covered traveler and $20,000 per trip for non-refundable travel expenses if your trip is canceled or interrupted for a covered reason.',
 'travel', 'annual', 10000.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Trip Delay Reimbursement',
 'Up to $500 per covered traveler for meals and lodging when your trip is delayed more than 12 hours or requires an overnight stay.',
 'travel', 'annual', 500.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Baggage Delay Insurance',
 'Reimburses up to $100 a day for up to 5 days for essential purchases when your baggage is delayed more than 6 hours.',
 'travel', 'annual', 500.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Lost Luggage Reimbursement',
 'Up to $3,000 per covered traveler for lost or damaged checked or carry-on baggage.',
 'travel', 'annual', 3000.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Primary Auto Rental Coverage',
 'Primary collision damage waiver covering up to $60,000 for theft and collision damage on rental cars — no need to file with your personal insurance first.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Travel Accident Insurance',
 'Up to $500,000 in accidental death or dismemberment coverage when you pay for your trip with the card.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Emergency Evacuation & Transportation',
 'Coverage up to $100,000 for medical services and emergency transportation if you or a family member is injured or becomes ill during a trip.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Purchase Protection',
 'Covers eligible new purchases for 120 days from the purchase date against damage or theft, up to $500 per claim.',
 'shopping', 'annual', 500.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Extended Warranty Protection',
 'Extends the manufacturer''s warranty by one additional year on eligible warranties of three years or less.',
 'shopping', 'annual', 0.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'No Foreign Transaction Fees',
 'No fees on purchases made outside the United States.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'),

('00000000-0000-0000-0000-000000000001',
 'Points Transfer to Airline & Hotel Partners',
 'Transfer Ultimate Rewards points 1:1 to 14 airline and hotel loyalty programs including United, Southwest, Hyatt, and Marriott.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred');


-- ─────────────────────────────────────────────────────────────
-- 2. CHASE SAPPHIRE RESERVE (card_id: ...0002)
-- Source: https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0000-000000000002',
 'Welcome Bonus – 100,000 Points',
 'Earn 100,000 bonus points after spending $6,000 on purchases in the first 3 months from account opening.',
 'other', 'one-time', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 '8x Points on Chase Travel Purchases',
 'Earn 8x total points on all purchases through Chase Travel, including The Edit by Chase hotels.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 '4x Points on Direct Flights & Hotels',
 'Earn 4x points on flights and hotels booked directly with airlines and hotels.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 '3x Points on Dining',
 'Earn 3x points on dining worldwide, including restaurants, cafes, and eligible delivery services.',
 'dining', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 '1x Points on All Other Purchases',
 'Earn 1x point per dollar on all other eligible purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 '$300 Annual Travel Credit',
 'Automatically applied to the first $300 in travel purchases each cardmember anniversary year — covers flights, hotels, rideshare, parking, tolls, and more.',
 'travel', 'annual', 300.00, 'credit', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 '$500 Annual The Edit Hotel Credit',
 'Up to $500 annually ($250 per booking) in statement credits for prepaid stays booked through The Edit by Chase luxury hotel collection.',
 'travel', 'annual', 500.00, 'credit', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Global Entry / TSA PreCheck Credit',
 'One statement credit of up to $120 every four years for Global Entry or TSA PreCheck enrollment fees.',
 'travel', 'one-time', 120.00, 'credit', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 '$300 Annual Dining Credit',
 'Up to $150 in statement credits per half-year ($300 annually) at restaurants and on dining purchases.',
 'dining', 'annual', 300.00, 'credit', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 '$300 Annual StubHub / Entertainment Credit',
 'Up to $150 in statement credits per half-year ($300 annually) on StubHub and entertainment purchases.',
 'entertainment', 'annual', 300.00, 'credit', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 '$120 Annual Lyft Credit',
 'Up to $10 in monthly Lyft in-app credits through 9/30/2027, totaling up to $120 per year.',
 'travel', 'monthly', 120.00, 'credit', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 '$120 Annual Peloton Credit',
 'Up to $10 per month in statement credits on eligible Peloton memberships through 12/31/2027.',
 'wellness', 'monthly', 120.00, 'credit', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Complimentary DashPass Membership',
 'Complimentary DashPass subscription with $0 delivery fees on eligible orders plus monthly promo credits.',
 'dining', 'annual', 120.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Complimentary Apple TV+ & Apple Music',
 'Complimentary Apple TV+ and Apple Music subscriptions through 6/22/2027, valued at approximately $288/year.',
 'entertainment', 'annual', 288.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Chase Sapphire Lounge Access',
 'Complimentary access to Chase Sapphire Lounges by The Club at select airports, with up to 2 complimentary guests.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Priority Pass Select Membership',
 'Complimentary Priority Pass Select membership granting access to 1,300+ airport lounges worldwide.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'The Edit Hotel Benefits',
 'Complimentary property credit, daily breakfast for two, room upgrade when available, and early check-in/late checkout at 1,000+ luxury hotels through The Edit.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'IHG Platinum Elite Status',
 'Complimentary IHG Platinum Elite status through December 31, 2027, with room upgrades and bonus points.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Trip Cancellation / Interruption Insurance',
 'Reimburses up to $10,000 per covered traveler and $20,000 per trip for non-refundable travel expenses.',
 'travel', 'annual', 10000.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Trip Delay Reimbursement',
 'Up to $500 per covered traveler for meals and lodging on delays of 6+ hours or requiring an overnight stay.',
 'travel', 'annual', 500.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Baggage Delay Insurance',
 'Up to $100 per day for up to 5 days for essential purchases when baggage is delayed more than 6 hours.',
 'travel', 'annual', 500.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Lost Luggage Reimbursement',
 'Up to $3,000 per covered traveler for lost or damaged checked or carry-on luggage.',
 'travel', 'annual', 3000.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Primary Auto Rental Coverage',
 'Primary collision damage waiver covering up to $75,000 for theft and collision damage on rental cars.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Travel Accident Insurance',
 'Up to $1,000,000 in accidental death or dismemberment coverage when you purchase your trip with the card.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Emergency Evacuation Coverage',
 'Up to $100,000 for emergency medical evacuation and medical services during a covered trip.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Emergency Medical / Dental Benefit',
 'Up to $2,500 reimbursement (subject to $50 deductible) for emergency medical or dental expenses abroad.',
 'travel', 'annual', 2500.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Roadside Assistance',
 'Up to $50 per incident (maximum 4 times per year) for roadside emergencies including towing and fuel delivery.',
 'travel', 'annual', 200.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Purchase Protection',
 'Covers eligible new purchases for 120 days against damage or theft, up to $10,000 per claim.',
 'shopping', 'annual', 10000.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Return Protection',
 'Reimbursement up to $500 per item (max $1,000 per 12 months) for eligible items not accepted for return within 90 days.',
 'shopping', 'annual', 1000.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Extended Warranty Protection',
 'Extends manufacturer warranties by one additional year on eligible warranties of three years or less.',
 'shopping', 'annual', 0.00, 'insurance', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'No Foreign Transaction Fees',
 'No fees on purchases made outside the United States.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'),

('00000000-0000-0000-0000-000000000002',
 'Points Transfer to Airline & Hotel Partners',
 'Transfer Ultimate Rewards points 1:1 to 14+ airline and hotel loyalty programs including United, Hyatt, and Marriott.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve');


-- ─────────────────────────────────────────────────────────────
-- 3. AMEX PLATINUM (card_id: ...0003)
-- Source: https://www.americanexpress.com/us/credit-cards/card/platinum/
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0000-000000000003',
 '5x Points on Flights',
 'Earn 5x Membership Rewards points on flights booked directly with airlines or through Amex Travel (up to $500,000 per calendar year).',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '5x Points on Prepaid Hotels via Amex Travel',
 'Earn 5x Membership Rewards points on prepaid hotels booked through AmexTravel.com.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '1x Points on All Other Purchases',
 'Earn 1x Membership Rewards point per dollar on all other eligible purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '$600 Hotel Credit (Fine Hotels + Resorts)',
 'Up to $600 in statement credits annually ($300 semi-annually) at Fine Hotels + Resorts or The Hotel Collection bookings via Amex Travel.',
 'travel', 'annual', 600.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '$200 Annual Airline Fee Credit',
 'Up to $200 per year in statement credits for incidental airline fees (baggage fees, seat upgrades, in-flight purchases) on one selected qualifying airline.',
 'travel', 'annual', 200.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '$200 Annual Uber Cash',
 'Receive $15 in Uber Cash each month plus a $20 bonus in December, totaling $200 per year for Uber rides and Uber Eats in the U.S.',
 'travel', 'monthly', 200.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '$120 Uber One Membership Credit',
 'Receive up to $120 annually in statement credits toward Uber One membership fees after auto-renewal.',
 'travel', 'annual', 120.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '$209 CLEAR+ Membership Credit',
 'Receive up to $209 annually in statement credits toward CLEAR+ membership, which provides expedited airport security screening.',
 'travel', 'annual', 209.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '$400 Annual Resy Dining Credit',
 'Up to $100 per quarter ($400 annually) in statement credits at 10,000+ U.S. Resy restaurant partners.',
 'dining', 'quarterly', 400.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '$300 Annual Digital Entertainment Credit',
 'Up to $25 per month ($300 annually) in statement credits for eligible digital subscriptions including Disney+, Hulu, ESPN+, Paramount+, and Apple TV+.',
 'entertainment', 'monthly', 300.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '$300 Annual lululemon Credit',
 'Up to $75 per quarter ($300 annually) in statement credits at U.S. lululemon retail stores and lululemon.com.',
 'shopping', 'quarterly', 300.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '$155 Annual Walmart+ Credit',
 'Receive monthly statement credits covering the cost of a Walmart+ membership (auto-renewal required), totaling approximately $155/year.',
 'shopping', 'monthly', 155.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '$200 Annual Oura Ring Credit',
 'Up to $200 annually in statement credits toward the purchase of an Oura Ring health tracker.',
 'wellness', 'annual', 200.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 '$300 Annual Equinox Credit',
 'Up to $300 per year in statement credits for Equinox+ digital fitness subscription or eligible Equinox club memberships.',
 'wellness', 'annual', 300.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Global Lounge Collection Access',
 'Access to 1,550+ airport lounges worldwide including Amex Centurion Lounges, Delta Sky Club (when flying Delta), Priority Pass Select lounges, and Escape lounges.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Fine Hotels + Resorts Benefits',
 'Complimentary daily breakfast for two, guaranteed late checkout (4pm), room upgrade when available, noon check-in when available, and $100 hotel credit at 1,800+ properties.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Global Entry / TSA PreCheck Credit',
 'Statement credit of up to $120 for Global Entry or up to $85 for TSA PreCheck enrollment fees (once every 4 years).',
 'travel', 'one-time', 120.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Marriott Bonvoy Gold Elite Status',
 'Complimentary Marriott Bonvoy Gold Elite status with room upgrades, bonus points, and welcome amenity.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Hilton Honors Gold Status',
 'Complimentary Hilton Honors Gold status with room upgrades, daily F&B credits, and 80% bonus points.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Complimentary Car Rental Elite Status',
 'Complimentary elite status with Avis, Hertz, and National car rental programs for upgrades and priority service.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Global Dining Access by Resy',
 'Exclusive access to priority reservations and special dining experiences at sought-after restaurants worldwide via the Resy app.',
 'dining', 'annual', 0.00, 'perk', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Premium Global Assist Hotline',
 '24/7 emergency assistance including medical, legal, and financial referrals when traveling more than 100 miles from home.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Trip Delay Insurance',
 'Reimbursement of up to $500 per covered trip for reasonable expenses if your trip is delayed 6+ hours.',
 'travel', 'annual', 500.00, 'insurance', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Trip Cancellation & Interruption Insurance',
 'Reimbursement for non-refundable travel expenses up to $10,000 per trip if your trip is canceled or interrupted for a covered reason.',
 'travel', 'annual', 10000.00, 'insurance', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Car Rental Loss & Damage Insurance',
 'Secondary coverage for theft or damage to a rental car when you pay with the card and decline the collision waiver.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Purchase Protection',
 'Covers eligible purchases against damage or theft for up to 90 days from the purchase date.',
 'shopping', 'annual', 0.00, 'insurance', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Extended Warranty',
 'Extends the original manufacturer''s warranty by up to one additional year on eligible purchases.',
 'shopping', 'annual', 0.00, 'insurance', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'Cell Phone Protection',
 'Coverage for eligible cell phone damage or theft when you pay your monthly phone bill with the card.',
 'shopping', 'annual', 0.00, 'insurance', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/'),

('00000000-0000-0000-0000-000000000003',
 'No Foreign Transaction Fees',
 'No fees on international purchases charged in foreign currencies.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/platinum/');


-- ─────────────────────────────────────────────────────────────
-- 4. AMEX GOLD (card_id: ...0004)
-- Source: https://www.americanexpress.com/us/credit-cards/card/gold-card/
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0000-000000000004',
 '4x Points at Restaurants Worldwide',
 'Earn 4x Membership Rewards points at restaurants worldwide, on up to $50,000 in purchases per calendar year, then 1x.',
 'dining', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 '4x Points at U.S. Supermarkets',
 'Earn 4x Membership Rewards points at U.S. supermarkets, on up to $25,000 in purchases per calendar year, then 1x.',
 'shopping', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 '5x Points on Prepaid Hotels via Amex Travel',
 'Earn 5x Membership Rewards points on prepaid hotels booked through AmexTravel.com.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 '3x Points on Flights',
 'Earn 3x Membership Rewards points on flights booked directly with airlines or through AmexTravel.com.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 '2x Points on Prepaid Car Rentals & Cruises',
 'Earn 2x Membership Rewards points on prepaid car rentals and cruise bookings through AmexTravel.com.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 '1x Points on All Other Purchases',
 'Earn 1x Membership Rewards point per dollar on all other eligible purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 '$120 Annual Dining Credit',
 'Up to $10 per month ($120 annually) in statement credits at participating dining partners including Grubhub, Buffalo Wild Wings, Five Guys, The Cheesecake Factory, and Wonder.',
 'dining', 'monthly', 120.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 '$120 Annual Uber Cash',
 'Receive $10 in Uber Cash each month ($120 annually) for Uber Eats orders and Uber rides in the U.S.',
 'dining', 'monthly', 120.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 '$100 Annual Resy Dining Credit',
 'Up to $100 per calendar year in statement credits at qualifying U.S. Resy restaurant partners.',
 'dining', 'annual', 100.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 '$84 Annual Dunkin'' Credit',
 'Up to $7 per month ($84 annually) in statement credits at U.S. Dunkin'' locations.',
 'dining', 'monthly', 84.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 '$100 Hotel Collection Credit',
 'Up to $100 credit toward eligible on-property charges per booking at over 1,300 upscale hotels in The Hotel Collection (minimum 2-night stay required).',
 'travel', 'annual', 100.00, 'credit', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 'Complimentary Hertz Five Star Status',
 'Complimentary Hertz Five Star status with access to premium vehicle upgrades and expedited service.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 'Global Assist Hotline',
 '24/7 emergency assistance including medical, legal, and financial referrals when traveling more than 100 miles from home.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 'Trip Delay Insurance',
 'Reimbursement of up to $300 per trip for reasonable expenses if your trip is delayed 12+ hours.',
 'travel', 'annual', 300.00, 'insurance', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 'Baggage Insurance Plan',
 'Coverage up to $1,250 for carry-on baggage and $500 for checked baggage for lost, damaged, or stolen luggage on a common carrier.',
 'travel', 'annual', 1750.00, 'insurance', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 'Car Rental Loss & Damage Insurance',
 'Secondary coverage for theft or damage to a rental car when you pay with the card and decline the collision waiver.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'),

('00000000-0000-0000-0000-000000000004',
 'No Foreign Transaction Fees',
 'No fees on purchases made outside the United States or in foreign currencies.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.americanexpress.com/us/credit-cards/card/gold-card/');


-- ─────────────────────────────────────────────────────────────
-- 5. CAPITAL ONE VENTURE X (card_id: ...0005)
-- Source: https://www.capitalone.com/credit-cards/venture-x/
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0000-000000000005',
 '10x Miles on Hotels & Car Rentals via Capital One Travel',
 'Earn 10x miles on hotels and rental cars booked through Capital One Travel portal.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 '5x Miles on Flights via Capital One Travel',
 'Earn 5x miles on flights booked through Capital One Travel portal.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 '5x Miles on Capital One Entertainment',
 'Earn 5x miles on purchases through Capital One Entertainment ticketing platform.',
 'entertainment', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 '2x Miles on All Other Purchases',
 'Earn unlimited 2x miles on every other purchase, every day.',
 'other', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 '$300 Annual Travel Credit',
 'Receive up to $300 in statement credits annually for bookings made through Capital One Travel.',
 'travel', 'annual', 300.00, 'credit', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 '10,000 Anniversary Bonus Miles',
 'Receive 10,000 bonus miles every account anniversary year, worth at least $100 in travel.',
 'travel', 'annual', 100.00, 'credit', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 'Capital One Lounge Access',
 'Unlimited access to Capital One Lounges and Landing locations at select airports for the primary cardholder and up to 2 guests.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 'Priority Pass Select Membership',
 'Complimentary Priority Pass Select membership providing access to 1,300+ airport lounges worldwide.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 'Premier Collection Hotel Benefits',
 'Complimentary daily breakfast for two, room upgrade when available, early check-in/late checkout, and up to $100 property credit per stay at Premier Collection hotels.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 'Lifestyle Collection Hotel Credit ($50)',
 'Up to $50 in property credits per stay at eligible Lifestyle Collection hotels.',
 'travel', 'annual', 50.00, 'credit', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 'Complimentary PRIOR Subscription',
 'Complimentary annual PRIOR travel lifestyle subscription (valued at $149) with curated hotel recommendations and experiences.',
 'travel', 'annual', 149.00, 'perk', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 'Hertz Gold Plus Rewards Status',
 'Complimentary Hertz Gold Plus Rewards Five Star status with vehicle upgrades and expedited service.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 'Capital One Entertainment Access',
 'Exclusive access to pre-sale tickets, VIP packages, and special experiences for concerts, sports, and cultural events.',
 'entertainment', 'annual', 0.00, 'perk', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 'Price Drop Protection',
 'Receive up to $50 in travel credit if the price of a booked flight drops after purchase.',
 'travel', 'annual', 50.00, 'perk', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 'Visa Infinite Travel Insurance',
 'Comprehensive Visa Infinite travel protections including trip cancellation/interruption, lost luggage, and travel accident insurance.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 'No Foreign Transaction Fees',
 'No fees on purchases made outside the United States.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/'),

('00000000-0000-0000-0000-000000000005',
 'Miles Transfer to Airline & Hotel Partners',
 'Transfer Capital One miles to 15+ airline and hotel loyalty partners including Air Canada, Turkish Airlines, and Wyndham.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.capitalone.com/credit-cards/venture-x/');


-- ─────────────────────────────────────────────────────────────
-- 6. CITI PREMIER (card_id: ...0006)
-- Source: https://www.citi.com/credit-cards/citi-premier-credit-card
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0000-000000000006',
 '10x Points on Hotels, Car Rentals & Attractions via Citi Travel',
 'Earn 10x ThankYou points on hotels, car rentals, and attractions booked through CitiTravel.com.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 '3x Points on Air Travel & Hotels',
 'Earn 3x ThankYou points on air travel and other hotel purchases.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 '3x Points on Dining',
 'Earn 3x ThankYou points on restaurant and dining purchases.',
 'dining', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 '3x Points on Supermarkets',
 'Earn 3x ThankYou points on grocery and supermarket purchases.',
 'shopping', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 '3x Points on Gas & EV Charging',
 'Earn 3x ThankYou points at gas stations and EV charging stations.',
 'fuel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 '1x Points on All Other Purchases',
 'Earn 1x ThankYou point per dollar on all other eligible purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 '$100 Annual Hotel Savings Benefit',
 'Receive $100 off a single hotel stay of $500 or more per calendar year when booked through CitiTravel.com or by calling Citi Travel.',
 'travel', 'annual', 100.00, 'credit', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 'ThankYou Points Transfer to Airline Partners',
 'Transfer ThankYou points at 1:1 ratio to 15+ airline loyalty programs including Air France/KLM, Turkish Airlines, and Singapore Airlines.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 'Citi Entertainment Access',
 'Special access to presale tickets for live music, sporting events, dining experiences, and more through Citi Entertainment.',
 'entertainment', 'annual', 0.00, 'perk', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 'Trip Cancellation & Interruption Protection',
 'Reimbursement for non-refundable travel expenses if your trip is canceled or interrupted due to a covered reason.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 'Trip Delay Protection',
 'Coverage for reasonable expenses when your common carrier trip is delayed 6+ hours.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 'Lost / Damaged Luggage Coverage',
 'Reimbursement for lost or damaged baggage on a common carrier trip.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 'MasterRental Car Rental Coverage',
 'Secondary car rental insurance covering physical damage and theft to a covered rental vehicle.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 'Mastercard ID Theft Protection',
 'Identity theft protection monitoring and resolution services through Mastercard.',
 'other', 'annual', 0.00, 'perk', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 'No Foreign Transaction Fees',
 'No fees on purchases made outside the United States.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card'),

('00000000-0000-0000-0000-000000000006',
 'Free FICO Score Access',
 'Free access to your FICO credit score through your Citi online account.',
 'other', 'annual', 0.00, 'perk', 'USD',
 'https://www.citi.com/credit-cards/citi-premier-credit-card');


-- ─────────────────────────────────────────────────────────────
-- 7. DISCOVER IT CASH BACK (card_id: ...0007)
-- Source: https://www.discover.com/credit-cards/cash-back/it-card.html
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0000-000000000007',
 '5% Quarterly Rotating Category Cashback',
 'Earn 5% cash back at different places each quarter (such as grocery stores, restaurants, gas stations, Amazon.com) up to the quarterly maximum when you activate.',
 'shopping', 'quarterly', 0.00, 'reward_rate', 'USD',
 'https://www.discover.com/credit-cards/cash-back/it-card.html'),

('00000000-0000-0000-0000-000000000007',
 '1% Unlimited Cash Back on All Other Purchases',
 'Earn unlimited 1% cash back on all other purchases automatically.',
 'other', 'annual', 0.00, 'reward_rate', 'USD',
 'https://www.discover.com/credit-cards/cash-back/it-card.html'),

('00000000-0000-0000-0000-000000000007',
 'Cashback Match – First Year',
 'Discover automatically matches all the cash back you earned at the end of your first year with no limit — doubling your first year''s rewards.',
 'other', 'one-time', 0.00, 'credit', 'USD',
 'https://www.discover.com/credit-cards/cash-back/it-card.html'),

('00000000-0000-0000-0000-000000000007',
 'No Annual Fee',
 'There is no annual fee to use this card.',
 'other', 'annual', 0.00, 'perk', 'USD',
 'https://www.discover.com/credit-cards/cash-back/it-card.html'),

('00000000-0000-0000-0000-000000000007',
 '$0 Fraud Liability',
 'You are never responsible for unauthorized purchases on your Discover card.',
 'other', 'annual', 0.00, 'perk', 'USD',
 'https://www.discover.com/credit-cards/cash-back/it-card.html'),

('00000000-0000-0000-0000-000000000007',
 'Free Social Security Number Alerts',
 'Get an alert if Discover finds your Social Security number on thousands of Dark Web sites (free sign-up required).',
 'other', 'annual', 0.00, 'perk', 'USD',
 'https://www.discover.com/credit-cards/cash-back/it-card.html'),

('00000000-0000-0000-0000-000000000007',
 'Account Freeze Feature',
 'Instantly freeze your account to prevent new purchases, cash advances, and balance transfers via the Discover app or website.',
 'other', 'annual', 0.00, 'perk', 'USD',
 'https://www.discover.com/credit-cards/cash-back/it-card.html'),

('00000000-0000-0000-0000-000000000007',
 'Cash Back Never Expires',
 'Your earned cash back rewards never expire as long as your account is open.',
 'other', 'annual', 0.00, 'perk', 'USD',
 'https://www.discover.com/credit-cards/cash-back/it-card.html'),

('00000000-0000-0000-0000-000000000007',
 'No Foreign Transaction Fee',
 'No additional fees on purchases made outside the United States.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://www.discover.com/credit-cards/cash-back/it-card.html');


-- ─────────────────────────────────────────────────────────────
-- 8. CHASE FREEDOM UNLIMITED (card_id: ...0008)
-- Source: https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0000-000000000008',
 'Welcome Bonus – $200 Cash Back',
 'Earn a $200 bonus after spending $500 on purchases in the first 3 months from account opening.',
 'other', 'one-time', 200.00, 'credit', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 '5% Cash Back on Chase Travel',
 'Earn 5% cash back on travel booked through Chase Travel portal.',
 'travel', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 '3% Cash Back on Dining',
 'Earn 3% cash back on dining at restaurants including takeout and eligible delivery services.',
 'dining', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 '3% Cash Back at Drugstores',
 'Earn 3% cash back on purchases at drugstores.',
 'shopping', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 '1.5% Cash Back on All Other Purchases',
 'Earn unlimited 1.5% cash back on all other purchases with no category restrictions.',
 'other', 'annual', 0.00, 'reward_rate', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 'No Annual Fee',
 'There is no annual fee to maintain this card.',
 'other', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 'Complimentary DashPass Access',
 'Six months of complimentary DashPass membership with $0 delivery fees, plus up to $10 off quarterly on eligible non-restaurant orders through 12/31/2027.',
 'dining', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 'Purchase Protection',
 'Covers eligible new purchases against damage or theft for 120 days from purchase date, up to $500 per claim.',
 'shopping', 'annual', 500.00, 'insurance', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 'Extended Warranty Protection',
 'Extends manufacturer''s warranty by one additional year on eligible warranties of three years or less.',
 'shopping', 'annual', 0.00, 'insurance', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 'Trip Cancellation / Interruption Insurance',
 'Reimbursement up to $1,500 per person and $6,000 per trip for prepaid, non-refundable travel expenses.',
 'travel', 'annual', 1500.00, 'insurance', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 'Auto Rental Collision Damage Waiver',
 'Secondary coverage for theft and collision damage on eligible rental vehicles when you pay with the card.',
 'travel', 'annual', 0.00, 'insurance', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 'Travel & Emergency Assistance',
 'Legal, medical, and emergency referrals and support services available 24/7 when traveling.',
 'travel', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited'),

('00000000-0000-0000-0000-000000000008',
 'Cash Back Rewards Never Expire',
 'Your cash back rewards never expire as long as your account remains open.',
 'other', 'annual', 0.00, 'perk', 'USD',
 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited');


-- ─────────────────────────────────────────────────────────────
-- 9. HDFC INFINIA (card_id: ...0001-000000000001)
-- Source: https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0001-000000000001',
 '5 Reward Points per ₹150 Spent',
 'Earn 5 reward points for every ₹150 spent on all eligible purchases.',
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
 '1% fuel surcharge waiver on transactions between ₹400 and ₹1,000 per billing cycle.',
 'fuel', 'monthly', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Air Accident Death Benefit',
 '₹3 crore (₹30,000,000) air accident death insurance coverage for the primary cardholder.',
 'travel', 'annual', 30000000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Emergency Medical Insurance Abroad',
 'Up to ₹50 lakh (₹5,000,000) medical insurance coverage while traveling abroad.',
 'travel', 'annual', 5000000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Accidental Death / Permanent Disability Cover',
 'Up to ₹9 lakh (₹900,000) insurance cover for accidental death or permanent disability.',
 'other', 'annual', 900000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'),

('00000000-0000-0000-0001-000000000001',
 'Annual Fee Waiver on ₹10 Lakh Spend',
 'Renewal fee is waived upon achieving ₹10 lakh (₹1,000,000) in annual spends on the card.',
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
 '5 Reward Points per ₹150 Spent',
 'Earn 5 reward points for every ₹150 spent on all eligible purchases.',
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
 'Annual Renewal Memberships (on ₹8L spend)',
 'Retain premium memberships (Amazon Prime, Forbes, Club Marriott, Times Prime, MMT BLACK, Swiggy One) annually upon spending ₹8 lakh in the previous year.',
 'other', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Monthly Milestone Vouchers (₹80K spend)',
 'Choose two vouchers worth ₹500 each from TataCLiQ, BookMyShow, or Ola Select membership upon ₹80,000 monthly spend.',
 'shopping', 'monthly', 1000.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Complimentary Golf Access',
 '6 complimentary golf rounds per quarter at select golf courses worldwide.',
 'wellness', 'quarterly', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Fuel Surcharge Waiver',
 '1% fuel surcharge waiver on fuel transactions exceeding ₹400.',
 'fuel', 'monthly', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Air Accident Death Benefit',
 '₹2 crore (₹20,000,000) air accident death insurance coverage.',
 'travel', 'annual', 20000000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Emergency Overseas Hospitalization',
 'Up to ₹50 lakh (₹5,000,000) coverage for emergency medical hospitalization abroad.',
 'travel', 'annual', 5000000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Credit Liability Cover',
 'Up to ₹9 lakh (₹900,000) credit liability insurance coverage for unauthorized card use.',
 'other', 'annual', 900000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black'),

('00000000-0000-0000-0001-000000000002',
 'Baggage Delay Coverage',
 'Up to ₹55,000 compensation for baggage delay during travel.',
 'travel', 'annual', 55000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-diners-club-black');


-- ─────────────────────────────────────────────────────────────
-- 11. HDFC REGALIA GOLD (card_id: ...0001-000000000003)
-- Source: https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0001-000000000003',
 '4 Reward Points per ₹150 Spent',
 'Earn 4 reward points for every ₹150 spent on all eligible retail purchases. 1 RP = ₹0.65 on SmartBuy.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 '5x Reward Points on Partner Brands',
 'Earn 20 reward points per ₹150 spent (5x) at Marks & Spencer, Nykaa, Reliance Digital, and Myntra.',
 'shopping', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Welcome Benefit – ₹2,500 Gift Voucher',
 'Receive a ₹2,500 gift voucher upon card approval as a welcome benefit.',
 'other', 'one-time', 2500.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Free MMT Black Elite + Club Vistara Silver Membership',
 'Complimentary MMT Black Elite and Club Vistara Silver Tier memberships upon spending ₹1 lakh within 90 days of card issuance.',
 'travel', 'one-time', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Quarterly Milestone – ₹1,500 Vouchers',
 'Earn ₹1,500 in vouchers from Myntra, Marriott, Marks & Spencer, or Reliance Digital upon ₹1.5 lakh quarterly spend.',
 'shopping', 'quarterly', 1500.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Annual Milestone – ₹5,000 Flight Voucher (₹5L spend)',
 'Receive ₹5,000 in flight vouchers upon achieving ₹5 lakh in annual spend.',
 'travel', 'annual', 5000.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Annual Milestone – Additional ₹5,000 Voucher (₹7.5L spend)',
 'Receive an additional ₹5,000 in flight vouchers upon achieving ₹7.5 lakh in annual spend.',
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
 'Annual Fee Waiver on ₹4 Lakh Spend',
 'Renewal fee is waived if you spend ₹4 lakh or more in the previous calendar year.',
 'other', 'annual', 2500.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Air Accident Death Benefit',
 '₹1 crore (₹10,000,000) air accident death insurance coverage for the primary cardholder.',
 'travel', 'annual', 10000000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Emergency Medical Insurance Abroad',
 'Up to ₹15 lakh (₹1,500,000) emergency medical insurance coverage while traveling internationally.',
 'travel', 'annual', 1500000.00, 'insurance', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'),

('00000000-0000-0000-0001-000000000003',
 'Credit Liability Cover',
 'Up to ₹9 lakh (₹900,000) liability protection against unauthorized card usage.',
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
 'Earn 5% cashback on purchases at Amazon, BookMyShow, Flipkart, Myntra, SonyLiv, Swiggy, TataCliq, Uber, and Zomato. 1 Cash Point = ₹1 when redeemed against statement balance.',
 'shopping', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 '1% Cashback on All Other Purchases',
 'Earn 1% cashback (as Cash Points) on all other eligible retail purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 'Welcome Benefit – ₹1,000 Gift Voucher',
 'Receive a ₹1,000 gift voucher as a welcome benefit upon card approval.',
 'other', 'one-time', 1000.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 'Quarterly Domestic Lounge Access (1 per quarter)',
 '1 complimentary domestic airport lounge visit per quarter (up to 4 visits annually). Requires ₹1 lakh spend in the previous quarter to qualify.',
 'travel', 'quarterly', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 'Dining Discount – Swiggy Dineout',
 'Up to 20% discount on dining at participating restaurants via Swiggy Dineout.',
 'dining', 'annual', 0.00, 'perk', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 'Fuel Surcharge Waiver',
 '1% fuel surcharge waiver on transactions of ₹400 and above, up to a maximum of ₹250 per billing cycle.',
 'fuel', 'monthly', 250.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'),

('00000000-0000-0000-0001-000000000004',
 'Annual Fee Waiver on ₹1 Lakh Spend',
 'Annual renewal fee (₹1,000) is waived if annual spends reach ₹1 lakh in the previous anniversary year.',
 'other', 'annual', 1000.00, 'credit', 'INR',
 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card');


-- ─────────────────────────────────────────────────────────────
-- 13. AXIS MAGNUS (card_id: ...0001-000000000005)
-- Source: https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card
-- ─────────────────────────────────────────────────────────────
INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url) VALUES

('00000000-0000-0000-0001-000000000005',
 '12 EDGE Miles per ₹200 on Travel & Dining',
 'Earn 12 EDGE Miles per ₹200 spent on travel and dining categories. EDGE Miles can be transferred to airline and hotel programs.',
 'travel', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 '6 EDGE Miles per ₹200 on All Other Spends',
 'Earn 6 EDGE Miles per ₹200 on all other eligible purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'Welcome Benefit – 10,000 EDGE Miles',
 'Earn 10,000 EDGE Miles as a welcome bonus on joining the Axis Magnus program.',
 'other', 'one-time', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'),

('00000000-0000-0000-0001-000000000005',
 'Milestone Bonus – 25,000 EDGE Miles (₹15L spend)',
 'Earn 25,000 bonus EDGE Miles upon achieving ₹15 lakh in annual spend.',
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
 '5 EDGE Miles per ₹100 on Travel Spends',
 'Earn 5 EDGE Miles per ₹100 on all travel-related purchases including flights and hotels.',
 'travel', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 '2 EDGE Miles per ₹100 on All Other Spends',
 'Earn 2 EDGE Miles per ₹100 on all other eligible purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Welcome Benefit – 2,500 EDGE Miles',
 'Earn 2,500 EDGE Miles as a welcome bonus on card issuance.',
 'other', 'one-time', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Silver Tier – 5,000 Milestone Miles (₹3L spend)',
 'Earn 5,000 bonus EDGE Miles on achieving Silver tier milestone of ₹3 lakh annual spend.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Gold Tier – 10,000 Milestone Miles (₹7.5L spend)',
 'Earn 10,000 bonus EDGE Miles on achieving Gold tier milestone of ₹7.5 lakh annual spend.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Platinum Tier – 15,000 Milestone Miles (₹15L spend)',
 'Earn 15,000 bonus EDGE Miles on achieving Platinum tier milestone of ₹15 lakh annual spend.',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Silver Tier – 2 International Lounge Visits',
 '2 complimentary international airport lounge visits per year at Silver tier (₹3L annual spend).',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Gold Tier – 5 International Lounge Visits',
 '5 complimentary international airport lounge visits per year at Gold tier (₹7.5L annual spend).',
 'travel', 'annual', 0.00, 'perk', 'INR',
 'https://www.axisbank.com/retail/cards/credit-card/axis-bank-atlas-credit-card'),

('00000000-0000-0000-0001-000000000006',
 'Platinum Tier – Unlimited International Lounge Visits',
 'Unlimited complimentary international airport lounge visits via Priority Pass at Platinum tier (₹15L annual spend).',
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
 '10 Reward Points per ₹100 on Dining, Groceries, Movies & Dept Stores',
 'Earn 10 reward points per ₹100 spent on dining, grocery, movies, and departmental store purchases. 1 RP = ₹0.25.',
 'dining', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 '20 Reward Points per ₹100 on Birthday Spends',
 'Earn 20 reward points per ₹100 on all purchases made on your birthday (capped at 2,000 bonus points per year).',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 '2 Reward Points per ₹100 on All Other Purchases',
 'Earn 2 reward points per ₹100 on all other eligible retail purchases.',
 'other', 'annual', 0.00, 'reward_rate', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Welcome Voucher – ₹3,000',
 'Receive a welcome gift voucher worth ₹3,000 from select brands including Bata, Hush Puppies, Aditya Birla Fashion, Pantaloons, Yatra, or Shoppers Stop.',
 'shopping', 'one-time', 3000.00, 'credit', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Quarterly Milestone – Pizza Hut Voucher (₹50K spend)',
 'Receive a ₹1,000 Pizza Hut e-voucher upon spending ₹50,000 in a calendar quarter.',
 'dining', 'quarterly', 1000.00, 'credit', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Annual Milestone – ₹7,000 Voucher (₹5L spend)',
 'Receive a ₹7,000 Yatra or Pantaloons e-voucher upon achieving ₹5 lakh in annual spend.',
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
 '1% fuel surcharge waiver on fuel transactions between ₹500 and ₹4,000, capped at ₹250 per monthly cycle.',
 'fuel', 'monthly', 250.00, 'credit', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Fraud Liability Cover',
 '₹1 lakh fraud liability insurance cover protecting against unauthorized transactions on the card.',
 'other', 'annual', 100000.00, 'insurance', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'),

('00000000-0000-0000-0001-000000000007',
 'Annual Fee Waiver on ₹3 Lakh Spend',
 'Annual renewal fee (₹2,999) is waived upon achieving ₹3 lakh in annual spend.',
 'other', 'annual', 2999.00, 'credit', 'INR',
 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page');
