-- FourFlow Training Platform — Database Tables
-- Run this in Supabase Dashboard → SQL Editor

-- ─────────────────────────────────────────────
-- mechanics: the knowledge base (62 rows, synced from compendium)
-- ─────────────────────────────────────────────
create table if not exists mechanics (
  id text primary key,                   -- slug, e.g. "anxiety-suppression"
  title text not null,
  pillar text not null check (pillar in ('self', 'space', 'story', 'spirit')),
  flow_key text not null,                -- e.g. "tuned-emotions"
  keywords text[] default '{}',
  definition text not null,
  content_md text not null,             -- full markdown (for card back display)
  enrichment_score int default 1,       -- 1–5 from COMPENDIUM_HEALTH
  techniques_count int default 0,
  related_mechanics text[] default '{}',
  updated_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- mechanic_reviews: SRS state per user × mechanic
-- ─────────────────────────────────────────────
create table if not exists mechanic_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  mechanic_id text references mechanics(id) on delete cascade not null,
  ease_factor float default 2.5,        -- SM-2: starts 2.5, min 1.3
  interval_days int default 1,          -- days until next review
  repetitions int default 0,            -- successful streak count
  next_review_at timestamptz default now(),
  last_reviewed_at timestamptz,
  last_quality int,                     -- 0–5 (rating given)
  created_at timestamptz default now(),
  unique(user_id, mechanic_id)
);

-- ─────────────────────────────────────────────
-- training_sessions: session history (Phase 2)
-- ─────────────────────────────────────────────
create table if not exists training_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  started_at timestamptz default now(),
  completed_at timestamptz,
  cards_reviewed int default 0,
  session_type text default 'daily',    -- 'daily' | 'deep-dive' | 'pillar'
  pillar_focus text,
  key_focus text
);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table mechanics enable row level security;
alter table mechanic_reviews enable row level security;
alter table training_sessions enable row level security;

-- Mechanics: any authenticated user can read (sync script writes via service role)
create policy "auth users read mechanics"
  on mechanics for select
  to authenticated
  using (true);

-- Reviews: users see and modify only their own rows
create policy "users read own reviews"
  on mechanic_reviews for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users insert own reviews"
  on mechanic_reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users update own reviews"
  on mechanic_reviews for update
  to authenticated
  using (auth.uid() = user_id);

-- Sessions: users see and modify only their own
create policy "users read own sessions"
  on training_sessions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users insert own sessions"
  on training_sessions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users update own sessions"
  on training_sessions for update
  to authenticated
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────
create index if not exists mechanic_reviews_user_id_idx on mechanic_reviews(user_id);
create index if not exists mechanic_reviews_next_review_idx on mechanic_reviews(user_id, next_review_at);
create index if not exists mechanics_pillar_idx on mechanics(pillar);
create index if not exists mechanics_flow_key_idx on mechanics(flow_key);
