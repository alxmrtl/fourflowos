-- Drop v1 intake columns (replaced by intake_structured JSONB)
-- Drop flow_profile_draft (always identical to flow_profile_final, never read independently)
--
-- Run once in the Supabase SQL Editor.
-- Safe to re-run — all drops are IF EXISTS.

ALTER TABLE assessments
  DROP COLUMN IF EXISTS context_working,
  DROP COLUMN IF EXISTS context_stuck,
  DROP COLUMN IF EXISTS context_building,
  DROP COLUMN IF EXISTS self_energy,
  DROP COLUMN IF EXISTS self_emotions,
  DROP COLUMN IF EXISTS self_focus,
  DROP COLUMN IF EXISTS space_environment,
  DROP COLUMN IF EXISTS space_tools,
  DROP COLUMN IF EXISTS space_feedback,
  DROP COLUMN IF EXISTS story_narrative,
  DROP COLUMN IF EXISTS story_mission,
  DROP COLUMN IF EXISTS story_role,
  DROP COLUMN IF EXISTS spirit_values,
  DROP COLUMN IF EXISTS spirit_curiosity,
  DROP COLUMN IF EXISTS spirit_vision,
  DROP COLUMN IF EXISTS flow_profile_draft;
