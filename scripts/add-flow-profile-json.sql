-- Migration: add flow_profile_json column to assessments
-- Run once in Supabase SQL Editor

ALTER TABLE assessments ADD COLUMN IF NOT EXISTS flow_profile_json JSONB;

CREATE INDEX IF NOT EXISTS idx_assessments_json_present
  ON assessments ((flow_profile_json IS NOT NULL));
