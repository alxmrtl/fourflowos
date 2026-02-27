-- Make old v1 intake text columns nullable so v2 submissions (which don't populate them) succeed.
-- Run once in Supabase SQL Editor.

ALTER TABLE assessments
  ALTER COLUMN context_working  DROP NOT NULL,
  ALTER COLUMN context_stuck    DROP NOT NULL,
  ALTER COLUMN context_building DROP NOT NULL,
  ALTER COLUMN self_energy      DROP NOT NULL,
  ALTER COLUMN self_emotions    DROP NOT NULL,
  ALTER COLUMN self_focus       DROP NOT NULL,
  ALTER COLUMN space_environment DROP NOT NULL,
  ALTER COLUMN space_tools      DROP NOT NULL,
  ALTER COLUMN space_feedback   DROP NOT NULL,
  ALTER COLUMN story_narrative  DROP NOT NULL,
  ALTER COLUMN story_mission    DROP NOT NULL,
  ALTER COLUMN story_role       DROP NOT NULL,
  ALTER COLUMN spirit_values    DROP NOT NULL,
  ALTER COLUMN spirit_curiosity DROP NOT NULL,
  ALTER COLUMN spirit_vision    DROP NOT NULL;
