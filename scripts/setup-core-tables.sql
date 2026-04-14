-- FourFlow CORE Tables — Flow Lens Profile + Esoteric Profile
-- Clean break from legacy `assessments` system.
-- Run this in Supabase SQL editor.

-- ─── Flow Lens ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS flow_lens_intakes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  answers     JSONB NOT NULL,            -- { q1: 'self', q2: 'story', ..., q12: 'creative' }
  pillar_scores JSONB NOT NULL,          -- { self: 3, space: 1, story: 2, spirit: 1 }
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flow_lens_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  intake_id         UUID REFERENCES flow_lens_intakes(id) ON DELETE SET NULL,
  gravity_pillar    TEXT NOT NULL,       -- 'self' | 'space' | 'story' | 'spirit'
  blind_side_pillar TEXT NOT NULL,
  profile_text      TEXT NOT NULL,       -- full markdown output
  profile_json      JSONB,               -- structured { gravity, blind_side, compounding_move, practices[] }
  recommendations   JSONB,               -- [{ type, title, pillar, path }]
  model             TEXT,
  generated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flow_lens_intakes_user_id   ON flow_lens_intakes(user_id);
CREATE INDEX IF NOT EXISTS idx_flow_lens_profiles_user_id  ON flow_lens_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_flow_lens_profiles_intake   ON flow_lens_profiles(intake_id);

-- ─── Esoteric Profile ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS esoteric_intakes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  birth_date      DATE NOT NULL,
  birth_time      TIME,
  birth_location  TEXT,
  birth_lat       DOUBLE PRECISION,
  birth_lng       DOUBLE PRECISION,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS esoteric_profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  intake_id        UUID REFERENCES esoteric_intakes(id) ON DELETE SET NULL,
  numerology_data  JSONB,               -- raw output from buildNumerologyProfile()
  name_data        JSONB,               -- { first, last, middle, signature }
  natal_data       JSONB,               -- chart data if available
  profile_text     TEXT NOT NULL,       -- full prose reading (markdown)
  profile_json     JSONB,               -- structured { name_signal, birth_code, natal_pattern, flow_architecture, overall_pattern }
  generated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_esoteric_intakes_user_id   ON esoteric_intakes(user_id);
CREATE INDEX IF NOT EXISTS idx_esoteric_profiles_user_id  ON esoteric_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_esoteric_profiles_intake   ON esoteric_profiles(intake_id);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Users can only read their own rows. Service role key (used by API routes)
-- bypasses RLS — so admin routes using the service key see everything.

ALTER TABLE flow_lens_intakes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_lens_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE esoteric_intakes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE esoteric_profiles  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own flow lens intakes"
  ON flow_lens_intakes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users read own flow lens profiles"
  ON flow_lens_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users read own esoteric intakes"
  ON esoteric_intakes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users read own esoteric profiles"
  ON esoteric_profiles FOR SELECT
  USING (auth.uid() = user_id);
