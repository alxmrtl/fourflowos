-- Flow Profile Assessments table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'intake_submitted' NOT NULL
    CHECK (status IN (
      'intake_submitted', 'processing', 'session_1_scheduled',
      'session_1_complete', 'synthesis', 'session_2_scheduled', 'delivered'
    )),

  -- Personal info
  name TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Birth data
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_time_known BOOLEAN DEFAULT false,
  birth_location TEXT NOT NULL,
  birth_lat DOUBLE PRECISION,
  birth_lng DOUBLE PRECISION,

  -- Life context
  context_working TEXT NOT NULL,
  context_stuck TEXT NOT NULL,
  context_building TEXT NOT NULL,

  -- SELF pillar questions
  self_energy TEXT NOT NULL,
  self_emotions TEXT NOT NULL,
  self_focus TEXT NOT NULL,

  -- SPACE pillar questions
  space_environment TEXT NOT NULL,
  space_tools TEXT NOT NULL,
  space_feedback TEXT NOT NULL,

  -- STORY pillar questions
  story_narrative TEXT NOT NULL,
  story_mission TEXT NOT NULL,
  story_role TEXT NOT NULL,

  -- SPIRIT pillar questions
  spirit_values TEXT NOT NULL,
  spirit_curiosity TEXT NOT NULL,
  spirit_vision TEXT NOT NULL,

  -- AI outputs
  natal_chart_data JSONB,
  facilitator_briefing TEXT,
  flow_profile_draft TEXT,
  flow_profile_final TEXT,

  -- Session tracking
  session_1_notes TEXT,
  session_1_date DATE,
  session_2_notes TEXT,
  session_2_date DATE
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Index for status filtering
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_email ON assessments(email);
