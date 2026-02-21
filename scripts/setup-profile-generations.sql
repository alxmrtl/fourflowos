-- profile_generations table
-- Run this after setup-prompt-templates.sql
--
-- Stores every generation run (CLI or UI button) for an assessment.
-- Enables generation history, A/B prompt comparison, and audit trail.

CREATE TABLE IF NOT EXISTS profile_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  prompt_template_id UUID REFERENCES prompt_templates(id) ON DELETE SET NULL,
  prompt_name TEXT NOT NULL,       -- snapshot of prompt name at generation time
  model TEXT NOT NULL,
  content TEXT NOT NULL,
  label TEXT,                      -- optional user-set label
  delivered BOOLEAN NOT NULL DEFAULT false,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fetching all generations for an assessment (most common query)
CREATE INDEX IF NOT EXISTS idx_profile_generations_assessment_id
  ON profile_generations(assessment_id);

-- Index for finding which generation was delivered
CREATE INDEX IF NOT EXISTS idx_profile_generations_delivered
  ON profile_generations(assessment_id, delivered)
  WHERE delivered = true;

-- Row-level security (service role key bypasses RLS — no public access needed)
ALTER TABLE profile_generations ENABLE ROW LEVEL SECURITY;
