-- Security hardening migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
--
-- Fixes:
--   1. Enable RLS on assessments (was missing)
--   2. Enable RLS on prompt_templates (was missing)
--   3. Add explicit deny policy to profile_generations (RLS was on, no policies)
--   4. Fix mutable search_path on update_updated_at()
--   5. Fix mutable search_path on update_updated_at_column()
--
-- NOTE: All API routes use the service role key, which bypasses RLS entirely.
-- These policies deny direct client access — they do not affect server-side routes.


-- ─── 1. assessments ────────────────────────────────────────────────────────────

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Deny all direct client access. Server-side service role bypasses this.
CREATE POLICY "no_direct_access"
  ON assessments
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false);


-- ─── 2. prompt_templates ───────────────────────────────────────────────────────

ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;

-- Deny all direct client access. Server-side service role bypasses this.
CREATE POLICY "no_direct_access"
  ON prompt_templates
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false);


-- ─── 3. profile_generations (RLS already enabled, no policies) ─────────────────

-- RLS was enabled intentionally (service role only). Add an explicit policy
-- to make the intent clear and silence the Supabase security advisor warning.
CREATE POLICY "no_direct_access"
  ON profile_generations
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false);


-- ─── 4. Fix update_updated_at() — mutable search_path ─────────────────────────
-- Pinning search_path prevents a malicious schema from shadowing pg_catalog functions.

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;


-- ─── 5. Fix update_updated_at_column() — mutable search_path ──────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;
