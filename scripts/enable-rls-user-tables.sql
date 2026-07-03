-- ============================================================================
-- enable-rls-user-tables.sql
--
-- Enables Row Level Security on the two per-user tables that are written to
-- directly from the browser (anon key) but had no RLS migration in this repo:
--
--   focus_sessions       — FlowZone session stats (insert + read own rows)
--   curiosity_snapshots  — Curiosity Explorer state (upsert on user_id)
--
-- HOW TO RUN: paste this whole file into the Supabase SQL Editor and execute.
-- It is idempotent — safe to run more than once.
--
-- Without RLS on these tables, anyone with the public anon key (it ships in
-- the browser bundle by design) could read or write any user's rows.
-- ============================================================================

-- ── focus_sessions ──────────────────────────────────────────────────────────
-- App usage: INSERT from FlowZone.tsx / flowzone preview (own user_id),
--            SELECT from MePage and profile view.

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_rows_select" ON focus_sessions;
CREATE POLICY "own_rows_select" ON focus_sessions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_rows_insert" ON focus_sessions;
CREATE POLICY "own_rows_insert" ON focus_sessions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ── curiosity_snapshots ─────────────────────────────────────────────────────
-- App usage: UPSERT on user_id from CuriosityExplorer.tsx (needs INSERT +
--            UPDATE + SELECT), SELECT from MePage and profile view.
-- NOTE: the upsert's onConflict: 'user_id' requires a UNIQUE constraint on
--       user_id. It already works in production, so the constraint should
--       exist. If the upsert ever errors with "no unique constraint",
--       uncomment the line below:
-- CREATE UNIQUE INDEX IF NOT EXISTS curiosity_snapshots_user_id_key
--   ON curiosity_snapshots (user_id);

ALTER TABLE curiosity_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_rows_select" ON curiosity_snapshots;
CREATE POLICY "own_rows_select" ON curiosity_snapshots
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_rows_insert" ON curiosity_snapshots;
CREATE POLICY "own_rows_insert" ON curiosity_snapshots
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_rows_update" ON curiosity_snapshots;
CREATE POLICY "own_rows_update" ON curiosity_snapshots
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Verify ──────────────────────────────────────────────────────────────────
-- Both rows must show relrowsecurity = true:
--   SELECT relname, relrowsecurity FROM pg_class
--   WHERE relname IN ('focus_sessions','curiosity_snapshots');
--
-- Should list 5 policies (2 for focus_sessions, 3 for curiosity_snapshots):
--   SELECT tablename, policyname, cmd FROM pg_policies
--   WHERE tablename IN ('focus_sessions','curiosity_snapshots');
--
-- Functional check: log in on the site, finish a FlowZone session, and
-- confirm it appears on /me with no console errors.
