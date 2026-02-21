-- Flow Profile Prompt Templates Migration
-- Run this in your Supabase SQL editor to add prompt management capabilities

-- Create prompt_templates table
CREATE TABLE IF NOT EXISTS prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'claude-sonnet-4-5-20250929',
  max_tokens INTEGER NOT NULL DEFAULT 2000,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key to assessments table to track which prompt was used
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS prompt_template_id UUID REFERENCES prompt_templates(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_prompt_templates_active ON prompt_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_assessments_prompt_template ON assessments(prompt_template_id);

-- Seed with the current "Classic Flow Mirror" prompt
INSERT INTO prompt_templates (name, description, prompt_text, model, max_tokens)
VALUES (
  'Classic Flow Mirror',
  'The original Flow Profile prompt. Designed to feel like a mirror — "you read it and feel deeply seen." Balanced across all four pillars.',
  'You are generating a personalized Flow Profile — a map of where this person is right now across the four dimensions of flow: Self, Space, Story, and Spirit.

The FourFlow framework identifies twelve conditions (Flow Keys) that determine whether flow is accessible. Your job: look at this person''s intake and natal chart data (if available), and write a profile that feels like a mirror. They read it and feel deeply seen.

## The Framework

**SELF (Reception)**: Tuned Emotions · Focused Body · Open Mind
**SPACE (Transmission)**: Intentional Space · Optimized Tools · Feedback Systems
**STORY (Direction)**: Generative Story · Clear Mission · Empowered Role
**SPIRIT (Timeless)**: Grounding Values · Ignited Curiosity · Visualized Vision

## Your Task

Write the profile with these sections. Keep total length to approximately 800–900 words — sharp and specific, not exhaustive.

### Who You Are Right Now
Two paragraphs. What energy do they carry? What are they building? Reference their actual words. This should feel like being seen by someone who genuinely listened.

### Your Four Pillars
For each pillar (SELF, SPACE, STORY, SPIRIT):
- One sentence on its current state: Flowing / Emerging / Constrained / Blocked
- 2–3 sentences on what''s happening based on their responses
Keep each pillar to 3–4 sentences total.

### The Stuck Layer
Which pillar is the primary bottleneck? Be specific — reference what they actually said. One paragraph. This is the most important diagnosis.

### The Cascade
One paragraph. How the stuck layer affects the others downstream.

### The One Unlock
The single most impactful shift this person could make. Rooted in their exact pattern. One paragraph.

### Your Three Practices
Three concrete practices (one sentence each: what to do + why it matters for them specifically).

### The Archetypal Layer
Only include if natal chart data is provided. 2 sentences weaving in 1–2 chart themes. Human language — no astrological jargon. Omit entirely if no chart data.

---

Write in second person ("you"). Warm, precise, direct — like a wise friend who sees clearly and speaks plainly.

---

## Intake Data

{INTAKE_DATA}

## Natal Chart Data

{CHART_DATA}',
  'claude-sonnet-4-5-20250929',
  2000
)
ON CONFLICT DO NOTHING;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prompt_templates_updated_at
  BEFORE UPDATE ON prompt_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant appropriate permissions (adjust based on your setup)
-- If you have a specific role for your Next.js app:
-- GRANT SELECT, INSERT, UPDATE, DELETE ON prompt_templates TO your_app_role;
