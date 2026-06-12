-- FlowWrite session stats (text never leaves the browser — stats only).
-- Run in the Supabase SQL editor. Mirrors the focus_sessions pattern.

create table if not exists flowwrite_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  duration_minutes numeric not null,
  words integer not null default 0,
  peak_streak_seconds integer not null default 0,
  stall_count integer not null default 0,
  started_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists flowwrite_sessions_user_idx
  on flowwrite_sessions (user_id, started_at desc);

alter table flowwrite_sessions enable row level security;

create policy "Users can insert own flowwrite sessions"
  on flowwrite_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can read own flowwrite sessions"
  on flowwrite_sessions for select
  using (auth.uid() = user_id);
