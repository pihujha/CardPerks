-- ============================================================
-- CardPerks — Schema Migration 003
-- Adds proof_url, benefit_type, currency to benefits
-- Extends card_network and benefit_frequency enums
-- ============================================================

-- ─── Extend enums ────────────────────────────────────────────
alter type card_network     add value if not exists 'Diners';
alter type card_network     add value if not exists 'Rupay';
alter type benefit_frequency add value if not exists 'quarterly';

-- ─── benefit_type enum ───────────────────────────────────────
-- credit      → fixed dollar/rupee credit to redeem (shows in This Month / This Year)
-- reward_rate → ongoing cashback or points rate on spending (shows in Today)
-- perk        → membership or access benefit to activate (shows in This Year or always)
-- insurance   → protection that kicks in automatically (informational)
create type benefit_type as enum ('credit', 'reward_rate', 'perk', 'insurance');

-- ─── New columns on benefits ─────────────────────────────────
alter table benefits
  add column benefit_type benefit_type not null default 'credit',
  add column currency     char(3)      not null default 'USD',
  add column proof_url    text;
