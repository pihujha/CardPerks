-- ============================================================
-- CardPerks — Schema Migration 001 (Neon Auth edition)
-- Run this in Neon SQL Editor
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Cards (global catalog, seeded) ──────────────────────────
create type card_network as enum ('Visa', 'Mastercard', 'Amex', 'Discover');
create type card_tier    as enum ('basic', 'mid', 'premium');

create table cards (
  id         uuid primary key default uuid_generate_v4(),
  name       text         not null,
  bank       text         not null,
  network    card_network not null,
  tier       card_tier    not null,
  created_at timestamptz  not null default now()
);

-- ─── User ↔ Card join ────────────────────────────────────────
-- user_id references neon_auth.users_sync which Neon Auth manages
create table user_cards (
  id       uuid primary key default uuid_generate_v4(),
  user_id  text not null,             -- Neon Auth user ID (text UUID from Stack Auth)
  card_id  uuid not null references cards(id) on delete cascade,
  nickname text,
  added_at timestamptz not null default now(),
  unique (user_id, card_id)
);

create index idx_user_cards_user on user_cards(user_id);

-- ─── Benefits (per card, seeded) ─────────────────────────────
create type benefit_category  as enum (
  'travel', 'dining', 'entertainment', 'shopping', 'fuel', 'wellness', 'other'
);
create type benefit_frequency as enum ('monthly', 'annual', 'one-time');

create table benefits (
  id          uuid primary key default uuid_generate_v4(),
  card_id     uuid              not null references cards(id) on delete cascade,
  title       text              not null,
  description text,
  category    benefit_category  not null,
  frequency   benefit_frequency not null,
  value_usd   numeric(8, 2)     not null default 0,
  created_at  timestamptz       not null default now()
);

create index idx_benefits_card on benefits(card_id);

-- ─── Benefit Usage ───────────────────────────────────────────
-- period: 'YYYY-MM' for monthly, 'YYYY' for annual, '' for one-time
create table benefit_usage (
  id           uuid primary key default uuid_generate_v4(),
  user_card_id uuid not null references user_cards(id) on delete cascade,
  benefit_id   uuid not null references benefits(id)   on delete cascade,
  used_at      timestamptz not null default now(),
  period       text        not null default '',
  unique (user_card_id, benefit_id, period)
);

create index idx_benefit_usage_user_card on benefit_usage(user_card_id);
create index idx_benefit_usage_benefit   on benefit_usage(benefit_id);
