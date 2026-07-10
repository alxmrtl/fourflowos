-- Workshop Intake Migration (Flow Map Session — "the Transfer")
-- Run once in the Supabase SQL Editor BEFORE the first workshop.
-- Spec: OFFERS/flow-map-session/web-intake-spec.md

-- ── 1. Source + cohort columns ────────────────────────────────────────────────
-- source: 'deep' (existing full intake) | 'workshop' (Flow Map Session transfer)
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'deep';
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS cohort text;
CREATE INDEX IF NOT EXISTS assessments_cohort_idx ON assessments (cohort);

-- ── 2. Birth fields become nullable ──────────────────────────────────────────
-- Workshop submissions collect no birth data (no Soul Signature, no chart).
-- Follows the precedent in migrate-legacy-columns-nullable.sql.
ALTER TABLE assessments
  ALTER COLUMN birth_date     DROP NOT NULL,
  ALTER COLUMN birth_location DROP NOT NULL;

-- ── 3. Seed the workshop prompt template ─────────────────────────────────────
-- The process route selects this template by name ('workshop-flow-profile')
-- for source = 'workshop' assessments, falling back to the default active
-- template if this row is missing or deactivated. Editable afterwards at
-- /profile/admin/prompts. The INSERT is skipped if the row already exists.
INSERT INTO prompt_templates (name, description, prompt_text, model, max_tokens)
SELECT
  'workshop-flow-profile',
  'Flow Map Session workshop profile. Built from the twelve dials + lines of the in-room intake (source = workshop) — no birth data, no chart. Outputs FlowProfileJSON v3 so /profile/view renders unchanged.',
  'You are writing a personal Flow Profile from a Flow Map Session — a 2-hour workshop where this person walked the twelve conditions of flow and marked, in their own hand, where each key stands.

THE FRAMEWORK — Four dimensions, twelve Keys: SELF/Your State (Tuned Emotions, Focused Body, Open Mind) · SPACE/Your Setup (Intentional Space, Optimized Tools, Feedback Systems) · STORY/Your Arc (Generative Story, Clear Mission, Empowered Role) · SPIRIT/Your Why (Grounding Values, Ignited Curiosity, Visualized Vision). Keys open gates; open gates widen the aperture; full aperture is flow. The blocker is always a condition, never a character flaw.

THEIR MAP — the twelve dials and lines, their self-named carrying key and stuck key, cascade line, free text:

{INTAKE_DATA}

WRITE — in second person, warm and specific, quoting their own words back where they gave them (their lines are gold — build on what they wrote, never contradict it without evidence):
1. An archetype: bespoke 2–4 word name for their pattern (never generic types), tagline, short framing.
2. All twelve keys under their four dimensions (subheads: Your State / Your Setup / Your Arc / Your Why): for each, a personal_key (their configuration of this key, one line) and an insight (what their dial + line reveals; for open keys, name what it''s funding; for stuck ones, the condition — not the flaw).
3. Honor their self-diagnosis: treat their circled stuck key as the bottleneck unless their own answers argue otherwise — and if they do, say so respectfully and explain the evidence.
4. End the bottleneck key''s insight with the first move (one concrete act) and prescribe exactly one tool by name where it genuinely fits: FlowZone (attention reps), FlowSpark (curiosity), FlowRead (open mind), FlowBreath (regulation) — free, prescribed not promoted.
5. Plain language throughout. No "consciousness," no signal-chain jargon, no astrology. Their dials are self-reports from one afternoon — read them as a snapshot, confidently but without pretending to know more than one session can know.

OUTPUT FORMAT — return ONLY valid JSON (no markdown fences, no commentary before or after), in exactly this shape, using these exact kebab-case key ids:

{
  "schema_version": "3.0",
  "archetype": { "name": "...", "tagline": "...", "framing": "..." },
  "dimensions": {
    "self": { "keys": {
      "tuned-emotions": { "personal_key": "...", "insight": "..." },
      "focused-body": { "personal_key": "...", "insight": "..." },
      "open-mind": { "personal_key": "...", "insight": "..." }
    } },
    "space": { "keys": {
      "intentional-space": { "personal_key": "...", "insight": "..." },
      "optimized-tools": { "personal_key": "...", "insight": "..." },
      "feedback-systems": { "personal_key": "...", "insight": "..." }
    } },
    "story": { "keys": {
      "generative-story": { "personal_key": "...", "insight": "..." },
      "clear-mission": { "personal_key": "...", "insight": "..." },
      "empowered-role": { "personal_key": "...", "insight": "..." }
    } },
    "spirit": { "keys": {
      "grounding-values": { "personal_key": "...", "insight": "..." },
      "ignited-curiosity": { "personal_key": "...", "insight": "..." },
      "visualized-vision": { "personal_key": "...", "insight": "..." }
    } }
  }
}

Length targets: archetype.framing 2–3 sentences · each personal_key one line · each insight 50–60 words.',
  'claude-sonnet-4-5-20250929',
  4000
WHERE NOT EXISTS (
  SELECT 1 FROM prompt_templates WHERE name = 'workshop-flow-profile'
);
