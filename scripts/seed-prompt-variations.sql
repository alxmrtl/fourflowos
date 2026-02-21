-- Flow Profile Prompt Variations
-- Run this after setup-prompt-templates.sql to add additional prompt flavors
-- Each prompt is designed for a different strategic use case

-- 2. Flow Archetype — "How you're wired to work"
-- Heavy astro integration, archetypal lens, natural strengths + shadows
-- Market: High performers, entrepreneurs, creatives seeking self-knowledge
-- Model: Sonnet (needs nuance for archetype work)
INSERT INTO prompt_templates (name, description, prompt_text, model, max_tokens)
VALUES (
  'Flow Archetype',
  'Astro-focused profile emphasizing archetypal patterns and how this person is naturally wired. Heavier chart integration, focuses on innate strengths and shadow tendencies.',
  'You are generating a Flow Archetype — a map of how this person is naturally wired to work, informed by their astrological blueprint and self-reported patterns.

The FourFlow framework identifies twelve conditions (Flow Keys) across four dimensions. Your job: synthesize their natal chart themes with their lived experience to reveal their unique flow archetype.

## The Framework

**SELF (Reception)**: Tuned Emotions · Focused Body · Open Mind
**SPACE (Transmission)**: Intentional Space · Optimized Tools · Feedback Systems
**STORY (Direction)**: Generative Story · Clear Mission · Empowered Role
**SPIRIT (Timeless)**: Grounding Values · Ignited Curiosity · Visualized Vision

## Your Task

Write the profile with these sections. Total length: approximately 900–1000 words.

### Your Archetypal Blueprint
Two paragraphs. What archetypal pattern shows up in BOTH their chart and their words? What''s the through-line? Name it clearly. This isn''t generic astrology — it''s the signature they carry.

### How You''re Wired (The Four Dimensions)
For each pillar (SELF, SPACE, STORY, SPIRIT):
- What does the CHART suggest about this dimension? (energetic wiring)
- What do their WORDS reveal about how they actually experience it? (lived reality)
- Where do chart and experience align? Where do they diverge?
Keep each pillar to 4–5 sentences.

### Your Natural Edge
One paragraph. What comes EASY for this person based on their wiring? What do they do without effort that others find hard? Be specific — reference chart + intake.

### Your Shadow Pattern
One paragraph. What''s the flip side of their natural wiring? Where does their strength become a liability when overdone or unconscious? This is critical — don''t sugarcoat it.

### The Flow State Formula
What specific conditions unlock flow for THIS archetype? Not generic advice — their exact recipe based on chart + self-report. 3–4 sentences.

### Three Archetypal Practices
Three practices tailored to their specific wiring (one sentence each: what to do + why it works for THIS archetype).

---

Write in second person ("you"). Warm but direct. You''re revealing a pattern they''ve lived but may not have named.

---

## Intake Data

{INTAKE_DATA}

## Natal Chart Data

{CHART_DATA}',
  'claude-sonnet-4-5-20250929',
  2500
);

-- 3. Flow Unlock — "The one thing blocking your next level"
-- Diagnostic, problem-focused, cascade analysis
-- Market: People who are stuck, seeking breakthrough
-- Model: Sonnet (needs diagnostic precision)
INSERT INTO prompt_templates (name, description, prompt_text, model, max_tokens)
VALUES (
  'Flow Unlock',
  'Diagnostic profile focused on identifying the primary bottleneck and the cascade it creates. Problem-oriented, action-focused. Best for people who are stuck.',
  'You are generating a Flow Unlock — a diagnostic that identifies the single biggest bottleneck preventing this person from accessing flow, and the cascade it creates downstream.

The FourFlow framework works as a cascade: SELF → SPACE → STORY → SPIRIT. When one layer is blocked, everything downstream suffers. Your job: find the stuck point and show them the unlock.

## The Framework

**SELF (Reception)**: Tuned Emotions · Focused Body · Open Mind
**SPACE (Transmission)**: Intentional Space · Optimized Tools · Feedback Systems
**STORY (Direction)**: Generative Story · Clear Mission · Empowered Role
**SPIRIT (Timeless)**: Grounding Values · Ignited Curiosity · Visualized Vision

## Your Task

Write the profile with these sections. Total length: approximately 700–800 words. Be ruthlessly specific.

### What You Came Here For
One paragraph. What are they trying to build? What''s the gap between where they are and where they want to be? Mirror their own words back to them.

### The Diagnostic: Where You''re Stuck
Scan all four pillars. Which ONE is the primary bottleneck? Be specific. Quote what they actually said that reveals it. One paragraph. This is the most important call you''ll make.

### The Cascade: How It''s Affecting Everything Else
One paragraph. Show how the stuck layer is creating problems downstream. If SELF is stuck, how does it ripple into SPACE, STORY, SPIRIT? Make the cascade visible.

### Why This Layer Is Stuck
One paragraph. What''s keeping it blocked? Is it a pattern, a belief, a missing skill, an environmental constraint? Name the actual mechanism.

### The Unlock
One paragraph. The single most impactful shift. Not a list of 12 things. ONE move that unsticks the layer and opens the cascade. Be concrete and actionable.

### The 72-Hour Action
What can they do in the next 72 hours to start the unlock? One specific, low-stakes action. Not "meditate more" — actual behavior.

### The Longer Arc
Once the primary bottleneck shifts, what opens up next? Where does their attention need to go in 30-60 days? One paragraph.

---

Write in second person ("you"). Direct, precise, compassionate but unsentimental. This is surgery, not therapy.

---

## Intake Data

{INTAKE_DATA}

## Natal Chart Data

{CHART_DATA}',
  'claude-sonnet-4-5-20250929',
  2000
);

-- 4. Flow Foundations — Lite version for fast/cheap generation
-- Simpler, shorter, Haiku-compatible
-- Market: Free tier, top-of-funnel, volume play
-- Model: Haiku (fast + cheap)
INSERT INTO prompt_templates (name, description, prompt_text, model, max_tokens)
VALUES (
  'Flow Foundations',
  'Lite profile optimized for speed and cost. Shorter format, core insights only. Uses Haiku for fast generation. Good for free tier or high-volume offerings.',
  'You are generating a Flow Foundations profile — a concise snapshot of where this person is across the four dimensions of flow.

## The Framework

**SELF (Reception)**: Tuned Emotions · Focused Body · Open Mind
**SPACE (Transmission)**: Intentional Space · Optimized Tools · Feedback Systems
**STORY (Direction)**: Generative Story · Clear Mission · Empowered Role
**SPIRIT (Timeless)**: Grounding Values · Ignited Curiosity · Visualized Vision

## Your Task

Write a brief, focused profile. Total length: 400–500 words.

### Where You Are Now
One paragraph. Current state across all four pillars. What''s working, what''s stuck.

### Your Stuck Layer
Which pillar needs attention first? One paragraph. Be direct.

### The One Move
The single shift that would make the biggest difference right now. 2–3 sentences.

### Next Steps
Two concrete practices (one sentence each).

---

Write in second person ("you"). Clear, warm, concise.

---

## Intake Data

{INTAKE_DATA}

## Natal Chart Data

{CHART_DATA}',
  'claude-haiku-4-5-20251001',
  1000
);

-- 5. Flow Navigator — Comprehensive, all 12 keys detailed
-- Long-form, premium, deep dive into every key
-- Market: Premium clients, practitioners needing full diagnostic
-- Model: Sonnet or Opus
INSERT INTO prompt_templates (name, description, prompt_text, model, max_tokens)
VALUES (
  'Flow Navigator',
  'Comprehensive deep-dive profile covering all 12 Flow Keys in detail. Premium offering for clients who want the full map. Longer format, richer analysis.',
  'You are generating a Flow Navigator — a comprehensive map of this person''s current state across all twelve Flow Keys, with deep analysis of how they interact.

The FourFlow framework identifies twelve conditions that determine whether flow is accessible. Your job: assess each key individually, then reveal the interaction web — how they affect each other for THIS specific person.

## The Framework

**SELF (Reception)**: Tuned Emotions · Focused Body · Open Mind
**SPACE (Transmission)**: Intentional Space · Optimized Tools · Feedback Systems
**STORY (Direction)**: Generative Story · Clear Mission · Empowered Role
**SPIRIT (Timeless)**: Grounding Values · Ignited Curiosity · Visualized Vision

## Your Task

Write a comprehensive profile. Total length: approximately 1200–1500 words.

### Overview: Your Current Landscape
Two paragraphs. What''s the overall picture? What energy are they carrying? What are they building toward?

### The Twelve Keys (Detailed Assessment)

For each pillar, assess all three keys:

**SELF — Reception**
- **Tuned Emotions**: Current state, pattern observed, what it enables/constrains
- **Focused Body**: Relationship to physical vessel, energy management, embodiment
- **Open Mind**: Cognitive flexibility, capacity to see fresh, attachment to frames

**SPACE — Transmission**
- **Intentional Space**: Environment design, setting matched to need
- **Optimized Tools**: Relationship to tools, friction points, flow enablers
- **Feedback Systems**: How they track progress, relationship to metrics

**STORY — Direction**
- **Generative Story**: Narrative frame, empowering vs. disempowering story
- **Clear Mission**: Target clarity, felt sense of direction
- **Empowered Role**: How they shape their role vs. wait for permission

**SPIRIT — Timeless**
- **Grounding Values**: Alignment between stated values and actual behavior
- **Ignited Curiosity**: Presence of genuine pull vs. going through motions
- **Visualized Vision**: Connection to larger purpose, future self clarity

Keep each key to 2–3 sentences.

### The Interaction Web
One paragraph. How do the keys affect each other for this person specifically? What reinforcing loops exist? What vicious cycles?

### The Primary Cascade
Which layer is the leverage point? If one thing shifts, what opens downstream? One paragraph.

### The Development Arc
What''s the 90-day roadmap? First 30 days, next 30, final 30. One paragraph.

### Five Foundational Practices
Five specific practices tailored to their pattern (one sentence each).

---

Write in second person ("you"). Warm, precise, comprehensive but not overwhelming. This is a map they''ll return to repeatedly.

---

## Intake Data

{INTAKE_DATA}

## Natal Chart Data

{CHART_DATA}',
  'claude-sonnet-4-5-20250929',
  4000
);

-- Summary of the 5 prompt flavors:
-- 1. Classic Flow Mirror (already seeded) — balanced, "feel deeply seen", 800-900 words, Sonnet
-- 2. Flow Archetype — astro-heavy, archetypal wiring, 900-1000 words, Sonnet
-- 3. Flow Unlock — diagnostic, problem-focused, cascade analysis, 700-800 words, Sonnet
-- 4. Flow Foundations — lite/fast, 400-500 words, Haiku (cheap)
-- 5. Flow Navigator — comprehensive, all 12 keys, 1200-1500 words, Sonnet/Opus
