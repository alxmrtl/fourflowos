-- Flow Profile v2: Add structured intake JSONB column
-- Run once in Supabase SQL Editor
-- This is the only migration needed. No backwards compat changes.

ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS intake_structured JSONB;

-- Optional: index for querying by schema version
CREATE INDEX IF NOT EXISTS idx_assessments_intake_schema
  ON assessments ((intake_structured->>'schema_version'));
