#!/usr/bin/env ts-node

/**
 * Flow Archetype Profile — CLI Generator + Auto-Deliver
 *
 * Generates a structured Flow Archetype profile and delivers it in one command.
 * No timeout constraints. Writes directly to Supabase. Sends delivery email.
 *
 * Usage:
 *   npm run profile:generate <assessment-id>
 *
 * Pipeline:
 *   1. Fetch assessment from Supabase
 *   2. Fetch/cache natal chart data
 *   3. Haiku pass: archetypal chart summary + per-key mechanic selection
 *   4. Opus pass: full Flow Archetype JSON using "Flow Archetype v1" template
 *   5. Validate JSON (schema v3: insight paragraph per key)
 *   6. Save flow_profile_json + mark delivered
 *   7. Send delivery email
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import Anthropic from '@anthropic-ai/sdk';
import { getSupabase } from '../src/lib/supabase';
import { sendDeliveryEmail } from '../src/lib/email';
import type { FlowProfileJSON } from '../src/types/profile-json';
import type { IntakeStructuredV2 } from '../src/types/intake';

const supabase = getSupabase();

// ─── JSON normalisation ───────────────────────────────────────────────────────

const DIM_ALIASES: Record<string, string> = {
  self: 'self', SELF: 'self', Self: 'self',
  space: 'space', SPACE: 'space', Space: 'space',
  story: 'story', STORY: 'story', Story: 'story',
  spirit: 'spirit', SPIRIT: 'spirit', Spirit: 'spirit',
};

const KEY_ALIASES: Record<string, string> = {
  'tuned-emotions': 'tuned-emotions', 'tuned_emotions': 'tuned-emotions', 'Tuned Emotions': 'tuned-emotions', 'tuned emotions': 'tuned-emotions',
  'focused-body': 'focused-body', 'focused_body': 'focused-body', 'Focused Body': 'focused-body', 'focused body': 'focused-body',
  'open-mind': 'open-mind', 'open_mind': 'open-mind', 'Open Mind': 'open-mind', 'open mind': 'open-mind',
  'intentional-space': 'intentional-space', 'intentional_space': 'intentional-space', 'Intentional Space': 'intentional-space', 'intentional space': 'intentional-space',
  'optimized-tools': 'optimized-tools', 'optimized_tools': 'optimized-tools', 'Optimized Tools': 'optimized-tools', 'optimized tools': 'optimized-tools',
  'feedback-systems': 'feedback-systems', 'feedback_systems': 'feedback-systems', 'Feedback Systems': 'feedback-systems', 'feedback systems': 'feedback-systems',
  'generative-story': 'generative-story', 'generative_story': 'generative-story', 'Generative Story': 'generative-story', 'generative story': 'generative-story',
  'clear-mission': 'clear-mission', 'clear_mission': 'clear-mission', 'Clear Mission': 'clear-mission', 'clear mission': 'clear-mission',
  'empowered-role': 'empowered-role', 'empowered_role': 'empowered-role', 'Empowered Role': 'empowered-role', 'empowered role': 'empowered-role',
  'grounding-values': 'grounding-values', 'grounding_values': 'grounding-values', 'Grounding Values': 'grounding-values', 'grounding values': 'grounding-values',
  'ignited-curiosity': 'ignited-curiosity', 'ignited_curiosity': 'ignited-curiosity', 'Ignited Curiosity': 'ignited-curiosity', 'ignited curiosity': 'ignited-curiosity',
  'visualized-vision': 'visualized-vision', 'visualized_vision': 'visualized-vision', 'Visualized Vision': 'visualized-vision', 'visualized vision': 'visualized-vision',
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[\s_]+/g, '-');
}

function normalizeProfileJson(profile: FlowProfileJSON): FlowProfileJSON {
  const normalizedDims: Record<string, unknown> = {};
  for (const [rawDim, dimData] of Object.entries(profile.dimensions ?? {})) {
    const dim = DIM_ALIASES[rawDim] ?? slugify(rawDim);
    if (!dimData) continue;
    const d = dimData as unknown as Record<string, unknown>;
    const rawKeys = (d.keys ?? {}) as Record<string, unknown>;
    const normalizedKeys: Record<string, unknown> = {};
    for (const [rawKey, keyData] of Object.entries(rawKeys)) {
      const key = KEY_ALIASES[rawKey] ?? KEY_ALIASES[slugify(rawKey)] ?? slugify(rawKey);
      if (keyData) normalizedKeys[key] = keyData;
    }
    normalizedDims[dim] = { ...d, keys: normalizedKeys };
  }
  return { ...profile, dimensions: normalizedDims as FlowProfileJSON['dimensions'] };
}

// ─── Flow mechanics reference ─────────────────────────────────────────────────
// Used by Haiku to select the 1-2 most relevant mechanics per key for this person.
// Haiku names them; Opus uses them as conceptual lenses without naming them.

const MECHANICS_REFERENCE = `tuned-emotions:
  Psychological Safety — removes fear of judgment during execution
  Outcome Detachment — prevents future-fixation from degrading present action
  Anxiety Suppression — reduces anticipatory threat signals that fragment focus
  Challenge-Skill Calibration — matches task difficulty to current capability to prevent boredom or overwhelm
  Ego Monitoring Removal — eliminates self-evaluation loops during performance
  Emotional Neutrality — prevents affective spikes from hijacking attention
  Error Tolerance — allows rapid correction without identity threat
  Effort-Reward Coupling — links exertion directly to perceived progress

focused-body:
  Mind-Body Coherence — aligns intention with physical execution
  Sensory Coherence — reduces conflicting sensory inputs
  Action-Awareness Merging — eliminates separation between doing and noticing
  Energy Sufficiency — ensures metabolic and nervous system readiness
  Rhythm and Pacing — establishes sustainable action cycles
  Physiological Regulation — keeps arousal within functional ranges

open-mind:
  Growth Orientation — frames difficulty as information rather than failure
  Compression Over Expansion — condenses concepts to reduce mental effort
  Clarity Over Intensity — prioritizes understanding over emotional force
  Attention Residue Elimination — prevents task-switching drag
  Overchoice Elimination — reduces decision overhead before and during action
  Cognitive Load Reduction — frees working memory for task-relevant processing
  Ambiguity Control — keeps uncertainty within tolerable bounds

intentional-setting:
  Environmental Simplicity — reduces background cognitive noise
  Social Field Alignment — aligns surrounding people with task intent
  Interruption Control — prevents attention capture from external sources
  Physical Space Priming — conditions the environment to cue focus
  Constraint Elegance — uses limits to sharpen action

optimized-tools:
  Automation of Non-Creative Steps — preserves attention for high-leverage work
  Subtraction Beats Addition — improves flow by removing rather than adding
  Friction Removal — eliminates unnecessary steps and resistance
  Tool-Task Alignment — matches tool capability to task demands
  Error Cost Minimization — limits penalty of mistakes to maintain momentum

feedback-systems:
  Immediate Feedback — shortens the loop between action and information
  Agency Loops — reinforces cause-effect understanding
  Progress Visibility — makes advancement perceptible in real time
  Speed of Consequence — accelerates learning through fast outcomes
  Feedback Density — increases signal frequency without overload

generative-story:
  Identity Immersion — aligns behavior with a lived role
  Tension-Release Dynamics — uses challenge and relief to maintain engagement
  Positive Orientation — biases interpretation toward progress
  Meaning Coherence — ensures actions fit a unified frame
  Narrative Momentum — pulls action forward without force

clear-mission:
  Clear Goals — defines what success looks like now
  Stakes Definition — specifies why the action matters
  Priority Singularity — prevents goal competition
  Outcome Horizon Setting — bounds attention to an appropriate timeframe

empowered-role:
  Identity Alignment — matches role to self-concept
  Role Clarity — defines responsibility boundaries
  Commitment Escalation — increases investment through action
  Responsibility Without Evaluation Pressure — maintains ownership while suppressing judgment

grounding-values:
  Internal Alignment — removes value-based friction from action
  Integrity Loops — reinforces trust in self-generated action
  Meaning Stabilization — prevents motivational decay over time
  Values Integration — embeds ethics into decision-making

ignited-curiosity:
  Intrinsic Reward Signaling — makes engagement self-reinforcing (clean fuel vs dirty fuel)
  Playfulness — reduces threat perception during exploration
  Strength Activation — leverages natural competencies
  Exploration Bias — encourages discovery over optimization
  Curiosity Loops — pulls attention forward through open questions

visualized-vision:
  Vision Priming — preloads direction before action begins
  Long-Horizon Coherence — aligns short actions with distant outcomes
  Inspirational Compression — condenses aspiration into simple symbols
  Symbolic Meaning — uses imagery to bypass analytical load`;

// ─── Haiku prompt (chart summary + mechanic selection) ────────────────────────

const HAIKU_PROMPT = `You are synthesizing cosmological, numerological, and intake data to produce two things for a Flow Profile:

1. A soul-blueprint summary (~350 words)
2. A mechanic selection — identifying which flow mechanics are most alive for this specific person

The Flow Profile maps four dimensions of consciousness:
- SELF (Reception): body, emotions, mind — can they receive alignment signals?
- SPACE (Transmission): environment, tools, feedback loops
- STORY (Temporal Direction): narrative, mission, role in the world
- SPIRIT (Timeless Direction): values, curiosity, vision

## PART 1 — ARCHETYPAL SUMMARY

Synthesize the modality and intake data below. Write in clear human language — no jargon. Focus on PATTERN and WIRING: how this person is built to move through the world, not generic descriptions.

Structure:

**Elemental Signature** (2-3 sentences): The dominant elemental and modal energy. How it shapes their experience.

**Core Archetypal Tension** (2-3 sentences): The primary creative polarity in their blueprint — what they're reconciling.

**Four-Pillar Implications** (4 brief paragraphs, one per pillar): How the combined blueprint suggests energy moves through SELF / SPACE / STORY / SPIRIT.

## PART 2 — MECHANIC SELECTION

After your written summary, select 1-2 mechanics per flow key that are most relevant or most alive for this specific person, based on their intake responses and archetypal blueprint.

Output the selections as a JSON block between these exact markers (no other text between them):

---MECHANICS---
{
  "tuned-emotions": ["MechanicName"],
  "focused-body": ["MechanicName"],
  "open-mind": ["MechanicName"],
  "intentional-setting": ["MechanicName"],
  "optimized-tools": ["MechanicName"],
  "feedback-systems": ["MechanicName"],
  "generative-story": ["MechanicName"],
  "clear-mission": ["MechanicName"],
  "empowered-role": ["MechanicName"],
  "grounding-values": ["MechanicName"],
  "ignited-curiosity": ["MechanicName"],
  "visualized-vision": ["MechanicName"]
}
---END---

Use only mechanic names from the reference list below. 1-2 per key.

## MECHANICS REFERENCE

${MECHANICS_REFERENCE}

---

## MODALITY DATA

{CHART_DATA}

## INTAKE CONTEXT

{INTAKE_DATA}`;

// ─── Numerology calculator (Pythagorean) ─────────────────────────────────────

const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function reduceToSingle(n: number): number {
  // Master numbers 11, 22, 33 are preserved
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) {
    n = String(n).split('').reduce((s, d) => s + parseInt(d), 0);
    if (n === 11 || n === 22 || n === 33) return n;
  }
  return n;
}

function calcNumerology(name: string, birthDate: string): {
  lifePath: number;
  birthdayNumber: number;
  expression: number;
  soulUrge: number;
  personality: number;
} {
  const digits = birthDate.replace(/\D/g, '').split('').map(Number);
  const lifePath = reduceToSingle(digits.reduce((s, d) => s + d, 0));

  const dayStr = birthDate.split(/[-\/]/)[2] ?? birthDate.slice(-2);
  const birthdayNumber = reduceToSingle(parseInt(dayStr, 10));

  const letters = name.toLowerCase().replace(/[^a-z]/g, '').split('');
  const expression = reduceToSingle(letters.reduce((s, l) => s + (LETTER_VALUES[l] ?? 0), 0));
  const soulUrge = reduceToSingle(
    letters.filter(l => VOWELS.has(l)).reduce((s, l) => s + (LETTER_VALUES[l] ?? 0), 0)
  );
  const personality = reduceToSingle(
    letters.filter(l => !VOWELS.has(l)).reduce((s, l) => s + (LETTER_VALUES[l] ?? 0), 0)
  );

  return { lifePath, birthdayNumber, expression, soulUrge, personality };
}

const LIFE_PATH_ARCHETYPES: Record<number, string> = {
  1: 'The Initiator — leadership, independence, pioneering; here to forge new paths',
  2: 'The Mediator — partnership, sensitivity, diplomacy; here to harmonize and connect',
  3: 'The Creator — self-expression, joy, communication; here to bring beauty into form',
  4: 'The Builder — structure, discipline, stability; here to create lasting foundations',
  5: 'The Explorer — freedom, adaptability, experience; here to expand what\'s possible',
  6: 'The Nurturer — responsibility, care, healing; here to serve and create beauty in relationship',
  7: 'The Seeker — introspection, analysis, spiritual depth; here to understand the hidden patterns',
  8: 'The Architect of Power — authority, abundance, mastery; here to build and wield influence wisely',
  9: 'The Sage — compassion, completion, universal service; here to embody wisdom and release',
  11: 'The Illuminator (Master 11) — heightened intuition, visionary channel; here to inspire through presence',
  22: 'The Master Builder (Master 22) — capacity to manifest large-scale visions; here to build for all',
  33: 'The Master Teacher (Master 33) — selfless service, compassion at scale; here to uplift humanity',
};

const BIRTHDAY_ARCHETYPES: Record<number, string> = {
  1: 'natural leader; independent, original; gifts of initiative and self-direction',
  2: 'born diplomat; sensitive, cooperative; gifts of perception and partnership',
  3: 'innate communicator; creative, expressive; gifts of charm and artistic vision',
  4: 'instinctive builder; disciplined, loyal; gifts of endurance and structural clarity',
  5: 'born adventurer; versatile, magnetic; gifts of adaptability and sensory intelligence',
  6: 'natural caretaker; responsible, harmonizing; gifts of empathy and aesthetic refinement',
  7: 'instinctive analyst; introspective, precise; gifts of depth and pattern recognition',
  8: 'born executive; ambitious, authoritative; gifts of strategic power and material mastery',
  9: 'natural humanitarian; compassionate, idealistic; gifts of universality and completion',
  11: 'born visionary (Master 11); intuitive, idealistic; gifts of inspiration and spiritual sensitivity',
  22: 'master architect (Master 22); practical visionary; gifts of large-scale manifestation',
  33: 'born teacher (Master 33); nurturing, self-sacrificing; gifts of unconditional service',
};

const EXPRESSION_ARCHETYPES: Record<number, string> = {
  1: 'destined to originate and lead; built to pioneer, create independently, stand at the front',
  2: 'destined to unite and harmonize; built to mediate, partner, and sense what others miss',
  3: 'destined to create and communicate; built to inspire through self-expression and beauty',
  4: 'destined to build and stabilize; built to create lasting systems, structures, and order',
  5: 'destined to explore and liberate; built to expand boundaries and champion change',
  6: 'destined to nurture and beautify; built to care, heal, and create harmony in relationships',
  7: 'destined to seek and understand; built to penetrate surface and reveal hidden truth',
  8: 'destined to lead and manifest; built to direct resources, wield authority, and produce results',
  9: 'destined to serve and complete; built to embody wisdom and give back to the whole',
  11: 'destined to illuminate (Master 11); built to channel inspiration and catalyze spiritual awakening',
  22: 'destined to build at scale (Master 22); built to translate vision into world-changing form',
  33: 'destined to teach and uplift (Master 33); built to hold others in unconditional care',
};

const PERSONALITY_ARCHETYPES: Record<number, string> = {
  1: 'appears confident, decisive, self-sufficient; projects independence',
  2: 'appears gentle, cooperative, supportive; projects approachability',
  3: 'appears charming, witty, expressive; projects warmth and creativity',
  4: 'appears reliable, grounded, trustworthy; projects stability',
  5: 'appears energetic, spontaneous, free; projects excitement',
  6: 'appears warm, nurturing, responsible; projects care and harmony',
  7: 'appears reserved, thoughtful, private; projects quiet depth',
  8: 'appears authoritative, polished, capable; projects competence',
  9: 'appears wise, compassionate, broad-minded; projects wisdom',
  11: 'appears otherworldly, magnetic, intense; projects visionary presence',
  22: 'appears commanding, serious, purposeful; projects rare capability',
  33: 'appears giving, luminous, devoted; projects saintly care',
};

// ─── Format intake data ───────────────────────────────────────────────────────

function formatIntakeData(assessment: Record<string, unknown>): string {
  const s = assessment.intake_structured as IntakeStructuredV2 | null | undefined;

  if (!s || s.schema_version !== '2.0') {
    console.error('  Assessment has no v2 structured intake data. Re-run intake via the new form.');
    process.exit(1);
  }

  const num = calcNumerology(String(assessment.name), String(assessment.birth_date));
  const firstName = String(assessment.name).trim().split(/\s+/)[0];

  return `
**Name**: ${assessment.name}
**First Name (${firstName})**: consider the meaning and etymological origin of this name — note resonance or tension with the archetype pattern
**Birth**: ${assessment.birth_date}${s.birth_time_known && s.birth_time ? `, ${s.birth_time}` : ' (time unknown)'}, ${assessment.birth_location}

---

### NUMEROLOGY SIGNATURE
Life Path and Soul Urge map to SPIRIT (timeless orientation, inner drive).
Birthday Number maps to SELF (innate body-gifts).
Expression maps to STORY (outer arc, mission).
Personality maps to SPACE (transmission interface, how others receive this person).

**Life Path ${num.lifePath}** [SPIRIT]: ${LIFE_PATH_ARCHETYPES[num.lifePath] ?? `orientation ${num.lifePath}`}
**Birthday Number ${num.birthdayNumber}** [SELF]: ${BIRTHDAY_ARCHETYPES[num.birthdayNumber] ?? `gift ${num.birthdayNumber}`}
**Expression ${num.expression}** [STORY]: ${EXPRESSION_ARCHETYPES[num.expression] ?? `outer destiny ${num.expression}`}
**Soul Urge ${num.soulUrge}** [SPIRIT]: the vowel-heart; inner hunger and deepest motivation
**Personality ${num.personality}** [SPACE]: ${PERSONALITY_ARCHETYPES[num.personality] ?? `outward face ${num.personality}`} — the exterior interface with the world

---

### OPENING FRAME
**Season**: ${s.opening_season || '(not provided)'}
**Current Chapter**: "${s.opening_chapter_title || '(untitled)'}"
**Quality of Attention**: ${s.opening_orientation_word || '(not provided)'}

---

### SELF — Reception Layer

**Tuned Emotions (Key)**
Emotional Keywords: [${s.self_emotions_keywords?.join(', ') || 'none selected'}]
When Most Alive Emotionally: "${s.self_emotions_alive || '(not provided)'}"
Hardest Emotion to Sit With: ${s.self_emotions_hard || '(not provided)'}

**Focused Body (Key)**
Energy Level: ${s.self_body_energy ?? 5}/10 (1=depleted → 10=energized)
Body Story: ${s.self_body_story || '(not provided)'}
Stress Pattern: ${s.self_body_stress || '(not provided)'} (options: tightening / collapse / restlessness / numbness)

**Open Mind (Key)**
Mental Clarity: ${s.self_mind_clarity ?? 5}/10 (0=scattered → 10=focused)
New Idea Story: ${s.self_mind_new_idea || '(not provided)'}
Currently Drawn Toward: ${s.self_mind_drawn_toward || '(not provided)'}

---

### SPACE — Transmission Layer

**Intentional Space (Key)**
Environment Feel: ${s.space_environment_feel || '(not provided)'} (options: sanctuary / functional / chaotic / unexamined)
Story of Most-Self Space: ${s.space_environment_story || '(not provided)'}
Gap Between Present and Desired Space: ${s.space_environment_gap || '(not provided)'}

**Optimized Tools (Key)**
Relationship to Systems: [${s.space_tools_keywords?.join(', ') || 'none selected'}]
Primary Tool/System Story: ${s.space_tools_story || '(not provided)'}

**Feedback Systems (Key)**
Primary Feedback Channel: ${s.space_feedback_channel || '(not provided)'} (options: internal compass / external validation / data-metrics / embodied-somatic)
Feedback Story: ${s.space_feedback_story || '(not provided)'}

---

### STORY — Temporal Direction

**Generative Story (Key)**
Last 5 Years: "${s.story_narrative_last5 || '(untitled)'}"
Next 5 Years: "${s.story_narrative_next5 || '(untitled)'}"
Narrative Arc Pattern: ${s.story_narrative_arc || '(not provided)'} (options: heros-journey / return / initiation / long-becoming / fall-and-rise / revolution / devotion / witness)

**Clear Mission (Key)**
I Exist To: "${s.story_mission_completion || '(not provided)'}"
Mission Clarity: ${s.story_mission_clarity || '(not provided)'} (scale: unarticulated → fuzzy → forming → clear)
Primary Distraction from Mission: ${s.story_mission_distraction || '(not provided)'}

**Empowered Role (Key)**
Role forced choices (selected pole of each pair):
  Design axis (architect vs builder): ${s.story_role_pair1 || '(not provided)'}
  Integration axis (pioneer vs integrator): ${s.story_role_pair2 || '(not provided)'}
  Independence axis (independent vs collaborative): ${s.story_role_pair3 || '(not provided)'}
  Direction axis (teacher vs student): ${s.story_role_pair4 || '(not provided)'}
Empowerment Story: ${s.story_role_story || '(not provided)'}

---

### SPIRIT — Timeless Direction

**Grounding Values (Key)**
Core Values Selected: [${s.spirit_values_selected?.join(', ') || 'none selected'}]
Value in Action: ${s.spirit_values_in_action || '(not provided)'}

**Ignited Curiosity (Key)**
Flow Memory (lost track of time): ${s.spirit_curiosity_flow_memory || '(not provided)'}
Curiosity Intersection: "${s.spirit_curiosity_intersection || '(not provided)'}"
Invisibility Test (would work on with no credit): ${s.spirit_curiosity_invisibility || '(not provided)'}

**Visualized Vision (Key)**
Peak Experience (most alive): ${s.spirit_vision_peak || '(not provided)'}
Future Self Image: "${s.spirit_vision_image || '(not provided)'}"
Legacy: "${s.spirit_vision_legacy || '(not provided)'}"

---

### THE SOUL SIGNATURE — Cross-Dimensional Archetypal Layer

**Myth Identity**
Character: ${s.soul_myth_character || '(not provided)'}
Admired Quality: "${s.soul_myth_quality || '(not provided)'}"

**Story Resonance**
Childhood Story: ${s.soul_fairy_tale_childhood || '(not provided)'}
Current Story: ${s.soul_fairy_tale_now || '(not provided)'}

**Shadow Projection** (what frustrates them most in others — likely a disowned quality):
${s.soul_shadow_projection || '(not provided)'}

**Nadir Story** (darkest moment):
${s.soul_nadir_story || '(not provided)'}

**Turning Point** (self-understanding changed):
${s.soul_turning_point || '(not provided)'}

**Core Gift** (what they give effortlessly):
${s.soul_gift || '(not provided)'}

**Hidden Self** (what people don't see):
${s.soul_hidden_self || '(not provided)'}

**Soul Word/Image**:
${s.soul_word || '(not provided)'}

**Closing Stem** ("The thing I most want someone who truly understands me to know..."):
${s.soul_closing_stem || '(not provided)'}
`.trim();
}

async function fetchChartData(assessment: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const chartServiceUrl = process.env.CHART_SERVICE_URL;
  if (!chartServiceUrl) {
    console.warn('  CHART_SERVICE_URL not set — skipping chart fetch');
    return null;
  }

  try {
    console.log('  Fetching natal chart...');
    const res = await fetch(`${chartServiceUrl}/chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birth_date: assessment.birth_date,
        birth_time: assessment.birth_time_known ? assessment.birth_time : null,
        birth_location: assessment.birth_location,
        lat: assessment.birth_lat,
        lng: assessment.birth_lng,
      }),
    });
    if (!res.ok) {
      console.warn(`  Chart service returned ${res.status}`);
      return null;
    }
    return await res.json() as Record<string, unknown>;
  } catch (err) {
    console.warn('  Chart fetch failed:', err);
    return null;
  }
}

function buildModalityBlock(
  assessment: Record<string, unknown>,
  chartData: Record<string, unknown>
): string {
  const name = String(assessment.name ?? '');
  const birthDate = String(assessment.birth_date ?? '');
  const numBlock = birthDate && name
    ? (() => {
        const n = calcNumerology(name, birthDate);
        return `Life Path ${n.lifePath} | Birthday ${n.birthdayNumber} | Expression ${n.expression} | Soul Urge ${n.soulUrge} | Personality ${n.personality}`;
      })()
    : null;

  const astro = JSON.stringify(chartData, null, 2);
  const lines = [
    '## NATAL CHART (Astrology)',
    astro,
    numBlock ? `\n## NUMEROLOGY\n${numBlock}` : '',
    '\n## NOTE ON HUMAN DESIGN',
    'Human Design data not yet integrated. Infer archetypal tendencies from natal chart patterns where relevant.',
  ];
  return lines.filter(Boolean).join('\n');
}

interface HaikuResult {
  summary: string;
  mechanicSelections: Record<string, string[]>;
}

function parseHaikuOutput(output: string): HaikuResult {
  const mechStart = output.indexOf('---MECHANICS---');
  const mechEnd = output.indexOf('---END---');

  if (mechStart === -1 || mechEnd === -1 || mechEnd <= mechStart) {
    console.warn('  Mechanic selections not found in Haiku output — proceeding without them');
    return { summary: output.trim(), mechanicSelections: {} };
  }

  const summary = output.slice(0, mechStart).trim();
  const jsonStr = output.slice(mechStart + 15, mechEnd).trim();

  let mechanicSelections: Record<string, string[]> = {};
  try {
    mechanicSelections = JSON.parse(jsonStr);
    const keyCount = Object.keys(mechanicSelections).length;
    console.log(`      Mechanic selections parsed: ${keyCount} keys`);
  } catch {
    console.warn('  Could not parse mechanic selections JSON — proceeding without them');
  }

  return { summary, mechanicSelections };
}

function buildMechanicContext(selections: Record<string, string[]>): string {
  if (Object.keys(selections).length === 0) return '';

  const lines = Object.entries(selections)
    .filter(([, mechanics]) => mechanics.length > 0)
    .map(([key, mechanics]) => `  ${key}: ${mechanics.join(', ')}`);

  return `\n\n---\n\n## KEY MECHANIC CONTEXT\nThese flow mechanics are most alive for this person. Use them as invisible lenses when writing each key's insight paragraph — draw from the underlying patterns and dynamics without naming the mechanics directly:\n\n${lines.join('\n')}`;
}

async function runHaikuPass(
  chartData: Record<string, unknown>,
  intakeData: string,
  assessment: Record<string, unknown>,
  anthropic: Anthropic
): Promise<HaikuResult> {
  console.log('  Running Haiku pass (chart summary + mechanic selection)...');
  const modalityBlock = buildModalityBlock(assessment, chartData);

  const prompt = HAIKU_PROMPT
    .replace('{CHART_DATA}', modalityBlock)
    .replace('{INTAKE_DATA}', intakeData);

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    console.log(`      ${text.length} chars`);
    return parseHaikuOutput(text);
  } catch (err) {
    console.warn('  Haiku pass failed:', err);
    // Minimal fallback — no mechanic context
    const sun = (chartData.sun_sign as string) || '';
    const moon = (chartData.moon_sign as string) || '';
    const rising = (chartData.rising_sign as string) || '';
    const fallbackSummary = [sun && `Sun: ${sun}`, moon && `Moon: ${moon}`, rising && `Rising: ${rising}`]
      .filter(Boolean).join(' | ') || 'Chart data unavailable.';
    return { summary: fallbackSummary, mechanicSelections: {} };
  }
}

async function main() {
  const assessmentId = process.argv[2];

  if (!assessmentId) {
    console.error(`
Usage:
  npm run profile:generate <assessment-id>

Example:
  npm run profile:generate abc-123-def-456
`);
    process.exit(1);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set in .env.local');
    process.exit(1);
  }

  const anthropic = new Anthropic({ apiKey });

  console.log(`\nFlow Archetype — generating for ${assessmentId}\n`);

  // 1. Fetch assessment
  console.log('[1/6] Fetching assessment...');
  const { data: assessment, error: fetchError } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', assessmentId)
    .single();

  if (fetchError || !assessment) {
    console.error('Assessment not found:', fetchError?.message);
    process.exit(1);
  }
  console.log(`      ${assessment.name} <${assessment.email}>`);

  if (!assessment.view_token) {
    console.error('Assessment has no view_token — cannot generate delivery link. Was this submitted via the intake form?');
    process.exit(1);
  }

  // 2. Fetch prompt template
  console.log('[2/6] Fetching "Flow Archetype v1" template...');
  const { data: promptTemplate } = await supabase
    .from('prompt_templates')
    .select('*')
    .eq('name', 'Flow Archetype v1')
    .single();

  if (!promptTemplate) {
    const { data: fallback } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!fallback) {
      console.error('No prompt templates found. Create "Flow Archetype v1" at /profile/admin/prompts first.');
      process.exit(1);
    }
    console.warn(`      "Flow Archetype v1" not found — using "${fallback.name}" instead`);
    Object.assign(promptTemplate ?? {}, fallback);
  }

  const template = promptTemplate!;
  const maxTokens = Math.max(template.max_tokens, 4500);
  console.log(`      Using: "${template.name}" (${template.model}, max ${maxTokens} tokens)`);

  // 3. Chart data
  console.log('[3/6] Resolving natal chart...');
  let chartData: Record<string, unknown> | null = assessment.natal_chart_data as Record<string, unknown> | null;
  if (chartData) {
    console.log('      Using cached chart data');
  } else {
    chartData = await fetchChartData(assessment);
    if (chartData) {
      await supabase.from('assessments').update({ natal_chart_data: chartData }).eq('id', assessmentId);
      console.log('      Fetched + cached');
    } else {
      console.log('      No chart data — proceeding without it');
    }
  }

  // 4. Haiku pass: chart summary + mechanic selection
  console.log('[4/6] Haiku pass (chart summary + mechanic selection)...');
  const intakeData = formatIntakeData(assessment);
  const { summary: chartSummary, mechanicSelections } = chartData
    ? await runHaikuPass(chartData, intakeData, assessment, anthropic)
    : { summary: 'No natal chart data available.', mechanicSelections: {} as Record<string, string[]> };

  const mechanicContext = buildMechanicContext(mechanicSelections);
  const chartContext = chartSummary + mechanicContext;
  console.log(`      Chart context: ${chartContext.length} chars`);

  // 5. Generate profile (Opus)
  console.log('[5/6] Generating Flow Archetype profile (Opus)...');
  const prompt = template.prompt_text
    .replace('{INTAKE_DATA}', intakeData)
    .replace('{CHART_DATA}', chartContext);

  let rawOutput = '';

  const stream = anthropic.messages.stream({
    model: template.model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });

  process.stdout.write('      ');
  let charCount = 0;
  stream.on('text', (text) => {
    rawOutput += text;
    charCount += text.length;
    if (charCount % 200 < text.length) process.stdout.write('.');
  });

  await stream.finalMessage();
  process.stdout.write('\n');

  if (!rawOutput.trim()) {
    console.error('Generation returned empty output');
    process.exit(1);
  }
  console.log(`      ${rawOutput.length} chars generated`);

  // Parse and validate JSON
  const firstBrace = rawOutput.indexOf('{');
  const lastBrace = rawOutput.lastIndexOf('}');
  const cleanedOutput = firstBrace > -1 && lastBrace > firstBrace
    ? rawOutput.slice(firstBrace, lastBrace + 1)
    : rawOutput.trim();

  let profileJson: FlowProfileJSON;
  try {
    profileJson = JSON.parse(cleanedOutput) as FlowProfileJSON;
    if (!profileJson.schema_version || !profileJson.archetype || !profileJson.dimensions) {
      throw new Error('Missing required fields: schema_version, archetype, or dimensions');
    }
    profileJson = normalizeProfileJson(profileJson);
    console.log(`      Archetype: "${profileJson.archetype.name}"`);
    console.log(`      Dimensions: ${Object.keys(profileJson.dimensions).join(', ')}`);
    for (const [dim, data] of Object.entries(profileJson.dimensions)) {
      const keys = Object.keys(data.keys);
      console.log(`        ${dim}: [${keys.join(', ')}]`);
      // Warn if any key is missing insight
      for (const k of keys) {
        const kd = data.keys[k as keyof typeof data.keys];
        if (!kd?.insight) console.warn(`        ⚠ ${dim}/${k} missing insight`);
      }
    }
  } catch (err) {
    console.error('\nJSON parse failed — model did not return valid JSON.');
    console.error('Error:', err instanceof Error ? err.message : err);
    console.error('\nRaw output (first 500 chars):');
    console.error(rawOutput.slice(0, 500));
    const fs = await import('fs');
    fs.writeFileSync(resolve(__dirname, 'last-output.txt'), cleanedOutput);
    console.error('\nFull output saved to scripts/last-output.txt');
    process.exit(1);
  }

  // 6. Save + deliver
  console.log('[6/6] Saving to Supabase + delivering...');

  const { data: generation } = await supabase
    .from('profile_generations')
    .insert({
      assessment_id: assessmentId,
      prompt_template_id: template.id,
      prompt_name: template.name,
      model: template.model,
      content: rawOutput,
    })
    .select('id')
    .single();

  const { error: updateError } = await supabase
    .from('assessments')
    .update({
      flow_profile_json: profileJson,
      flow_profile_final: rawOutput,
      prompt_template_id: template.id,
      status: 'delivered',
    })
    .eq('id', assessmentId);

  if (updateError) {
    console.error('Supabase update failed:', updateError.message);
    process.exit(1);
  }
  console.log(`      Saved (generation: ${generation?.id ?? 'n/a'})`);

  const host = process.env.NEXT_PUBLIC_SITE_URL || 'fourflowos.com';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const cleanHost = host.replace(/^https?:\/\//, '');
  const viewUrl = `${protocol}://${cleanHost}/me`;

  try {
    await sendDeliveryEmail({
      to: assessment.email,
      name: assessment.name,
      viewUrl,
    });
    console.log(`      Email sent to ${assessment.email}`);
  } catch (emailErr) {
    console.warn(`      Email failed (profile still delivered): ${emailErr instanceof Error ? emailErr.message : emailErr}`);
  }

  console.log(`
Done.
  Archetype : ${profileJson.archetype.name}
  Status    : delivered
  View URL  : ${viewUrl}
`);
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
