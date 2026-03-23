-- Training V2 Migration: Study Phase + Dynamic Curriculum
-- Run in Supabase SQL Editor

-- 1. mechanic_reviews: track card phase (study vs recall)
ALTER TABLE mechanic_reviews
  ADD COLUMN IF NOT EXISTS phase text DEFAULT 'recall';

-- Add check constraint (safe — existing rows all get 'recall' default)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'mechanic_reviews_phase_check'
  ) THEN
    ALTER TABLE mechanic_reviews
      ADD CONSTRAINT mechanic_reviews_phase_check
      CHECK (phase IN ('study', 'recall'));
  END IF;
END $$;

-- 2. mechanics: explicit card type
ALTER TABLE mechanics
  ADD COLUMN IF NOT EXISTS card_type text DEFAULT 'mechanic';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'mechanics_card_type_check'
  ) THEN
    ALTER TABLE mechanics
      ADD CONSTRAINT mechanics_card_type_check
      CHECK (card_type IN ('mechanic', 'technique', 'concept'));
  END IF;
END $$;

-- 3. mechanics: link techniques/concepts to parent mechanic
ALTER TABLE mechanics
  ADD COLUMN IF NOT EXISTS parent_mechanic_id text;

-- 4. mechanics: content hash for change detection
ALTER TABLE mechanics
  ADD COLUMN IF NOT EXISTS content_hash text;

-- 5. training_sessions: add detail columns
ALTER TABLE training_sessions
  ADD COLUMN IF NOT EXISTS cards_studied int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cards_correct int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cards_missed int DEFAULT 0;

-- 6. Index for filtering by card_type (queue API)
CREATE INDEX IF NOT EXISTS mechanics_card_type_idx ON mechanics(card_type);
