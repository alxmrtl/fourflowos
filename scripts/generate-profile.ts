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
 * What it does:
 *   1. Fetches assessment from Supabase
 *   2. Fetches natal chart data (or uses cached)
 *   3. Generates archetypal chart summary with Haiku
 *   4. Generates Flow Archetype JSON with Opus using "Flow Archetype v1" template
 *   5. Validates JSON structure
 *   6. Saves flow_profile_json + marks delivered
 *   7. Sends delivery email to the user
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

const CHART_SUMMARY_PROMPT = `You are synthesizing multiple cosmological and archetypal frameworks to produce a soul-blueprint summary for a Flow Profile.

The Flow Profile maps four dimensions of consciousness:
- SELF (Reception): body, emotions, mind — can they receive alignment signals?
- SPACE (Transmission): environment, tools, feedback loops
- STORY (Temporal Direction): narrative, mission, role in the world
- SPIRIT (Timeless Direction): values, curiosity, vision

Your task: Generate a 350-word archetypal synthesis that cross-references the available modality data below. Write in clear, human language — no jargon. Focus on PATTERN and WIRING: how this person is built to move through the world, not generic descriptions.

Structure your response as:

**Elemental Signature** (2-3 sentences): The dominant elemental and modal energy. How it shapes their experience.

**Core Archetypal Tension** (2-3 sentences): The primary creative polarity or challenge in their blueprint — what they're reconciling.

**Four-Pillar Implications** (4 brief paragraphs, one per pillar): How the combined blueprint suggests energy moves through SELF / SPACE / STORY / SPIRIT.

---

MODALITY DATA:

{CHART_DATA}`;

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
  expression: number;
  soulUrge: number;
} {
  // Life Path from birth date digits
  const digits = birthDate.replace(/\D/g, '').split('').map(Number);
  const lifePath = reduceToSingle(digits.reduce((s, d) => s + d, 0));

  // Expression (all letters) and Soul Urge (vowels only)
  const letters = name.toLowerCase().replace(/[^a-z]/g, '').split('');
  const expression = reduceToSingle(letters.reduce((s, l) => s + (LETTER_VALUES[l] ?? 0), 0));
  const soulUrge = reduceToSingle(
    letters.filter(l => VOWELS.has(l)).reduce((s, l) => s + (LETTER_VALUES[l] ?? 0), 0)
  );

  return { lifePath, expression, soulUrge };
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

// ─── Format intake data (v2 structured) ──────────────────────────────────────

function formatIntakeData(assessment: Record<string, unknown>): string {
  const s = assessment.intake_structured as IntakeStructuredV2 | null | undefined;

  // v2 structured path
  if (s && s.schema_version === '2.0') {
    const num = calcNumerology(String(assessment.name), String(assessment.birth_date));
    const lpDesc = LIFE_PATH_ARCHETYPES[num.lifePath] ?? `Life Path ${num.lifePath}`;

    const roleSignature = [
      s.story_role_pair1 && `${s.story_role_pair1 === 'architect' ? 'Architect' : 'Builder'}`,
      s.story_role_pair2 && `${s.story_role_pair2 === 'pioneer' ? 'Pioneer' : 'Integrator'}`,
      s.story_role_pair3 && `${s.story_role_pair3 === 'independent' ? 'Independent' : 'Collaborative'}`,
      s.story_role_pair4 && `${s.story_role_pair4 === 'teacher' ? 'Teacher' : 'Student'}`,
    ].filter(Boolean).join(' / ');

    return `
**Name**: ${assessment.name}
**Birth**: ${assessment.birth_date}${s.birth_time_known && s.birth_time ? `, ${s.birth_time}` : ' (time unknown)'}, ${assessment.birth_location}

---

### NUMEROLOGY SIGNATURE
**Life Path ${num.lifePath}**: ${lpDesc}
**Expression Number ${num.expression}**: the outer character and natural talents
**Soul Urge ${num.soulUrge}**: the inner motivation and deepest desire

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
Energy Level: ${s.self_body_energy ?? 5}/10
Body Story: ${s.self_body_story || '(not provided)'}
Stress Pattern: ${s.self_body_stress || '(not provided)'}

**Open Mind (Key)**
Mental Clarity: ${s.self_mind_clarity ?? 5}/10 (0=scattered → 10=focused)
New Idea Story: ${s.self_mind_new_idea || '(not provided)'}
Currently Drawn Toward: ${s.self_mind_drawn_toward || '(not provided)'}

---

### SPACE — Transmission Layer

**Intentional Space (Key)**
Environment Feel: ${s.space_environment_feel || '(not provided)'}
Story of Most-Self Space: ${s.space_environment_story || '(not provided)'}
Gap Between Present and Desired Space: ${s.space_environment_gap || '(not provided)'}

**Optimized Tools (Key)**
Relationship to Systems: [${s.space_tools_keywords?.join(', ') || 'none selected'}]
Primary Tool/System Story: ${s.space_tools_story || '(not provided)'}

**Feedback Systems (Key)**
Primary Feedback Channel: ${s.space_feedback_channel || '(not provided)'}
Feedback Story: ${s.space_feedback_story || '(not provided)'}

---

### STORY — Temporal Direction

**Generative Story (Key)**
Last 5 Years: "${s.story_narrative_last5 || '(untitled)'}"
Next 5 Years: "${s.story_narrative_next5 || '(untitled)'}"
Narrative Arc Pattern: ${s.story_narrative_arc || '(not provided)'}

**Clear Mission (Key)**
I Exist To: "${s.story_mission_completion || '(not provided)'}"
Mission Clarity: ${s.story_mission_clarity || '(not provided)'}
Primary Distraction from Mission: ${s.story_mission_distraction || '(not provided)'}

**Empowered Role (Key)**
Role Signature: ${roleSignature || '(not provided)'}
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

  // v1 fallback (legacy text fields)
  const a = assessment;
  return `
**Name**: ${a.name}
**Birth**: ${a.birth_date}${a.birth_time_known ? `, ${a.birth_time}` : ' (time unknown)'}, ${a.birth_location}

### Life Context
What's working: ${a.context_working}
What's stuck: ${a.context_stuck}
Building toward: ${a.context_building}

### SELF
Physical Energy: ${a.self_energy}
Emotions: ${a.self_emotions}
Mental Clarity: ${a.self_focus}

### SPACE
Environment: ${a.space_environment}
Tools & Systems: ${a.space_tools}
Feedback Loops: ${a.space_feedback}

### STORY
Life Narrative: ${a.story_narrative}
Mission: ${a.story_mission}
Role: ${a.story_role}

### SPIRIT
Values: ${a.spirit_values}
Curiosity: ${a.spirit_curiosity}
Vision: ${a.spirit_vision}
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
  const num = birthDate && name
    ? (() => {
        // inline numerology for the block
        const LVALS: Record<string, number> = {
          a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,
          n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
        };
        const VOW = new Set(['a','e','i','o','u']);
        const reduce = (n: number): number => {
          if (n === 11 || n === 22 || n === 33) return n;
          while (n > 9) {
            n = String(n).split('').reduce((s,d) => s + parseInt(d), 0);
            if (n === 11 || n === 22 || n === 33) return n;
          }
          return n;
        };
        const digits = birthDate.replace(/\D/g,'').split('').map(Number);
        const lp = reduce(digits.reduce((s,d) => s+d, 0));
        const letters = name.toLowerCase().replace(/[^a-z]/g,'').split('');
        const expr = reduce(letters.reduce((s,l) => s + (LVALS[l]??0), 0));
        const soul = reduce(letters.filter(l => VOW.has(l)).reduce((s,l) => s + (LVALS[l]??0), 0));
        return `Life Path ${lp} | Expression ${expr} | Soul Urge ${soul}`;
      })()
    : null;

  const astro = JSON.stringify(chartData, null, 2);
  const lines = [
    '## NATAL CHART (Astrology)',
    astro,
    num ? `\n## NUMEROLOGY\n${num}` : '',
    '\n## NOTE ON HUMAN DESIGN',
    'Human Design data not yet integrated. Infer archetypal tendencies from natal chart patterns where relevant.',
  ];
  return lines.filter(Boolean).join('\n');
}

async function generateChartSummary(
  chartData: Record<string, unknown>,
  assessment: Record<string, unknown>,
  anthropic: Anthropic
): Promise<string> {
  console.log('  Generating multi-modal chart summary (Haiku)...');
  const modalityBlock = buildModalityBlock(assessment, chartData);
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{ role: 'user', content: CHART_SUMMARY_PROMPT.replace('{CHART_DATA}', modalityBlock) }],
    });
    return message.content[0].type === 'text' ? message.content[0].text : '';
  } catch {
    const sun = (chartData.sun_sign as string) || '';
    const moon = (chartData.moon_sign as string) || '';
    const rising = (chartData.rising_sign as string) || '';
    return [sun && `Sun: ${sun}`, moon && `Moon: ${moon}`, rising && `Rising: ${rising}`]
      .filter(Boolean).join(' | ') || 'Chart data unavailable.';
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
    // Fall back to first active template
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
  console.log(`      Using: "${template.name}" (${template.model}, max ${Math.max(template.max_tokens, 4500)} tokens)`);

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

  // 4. Chart summary
  console.log('[4/6] Generating archetypal summary...');
  const chartContext = chartData
    ? await generateChartSummary(chartData, assessment, anthropic)
    : 'No natal chart data available.';
  console.log(`      ${chartContext.length} chars`);

  // 5. Generate profile
  console.log('[5/6] Generating Flow Archetype profile (Opus)...');
  const intakeData = formatIntakeData(assessment);
  const prompt = template.prompt_text
    .replace('{INTAKE_DATA}', intakeData)
    .replace('{CHART_DATA}', chartContext);

  let rawOutput = '';
  // Concise prompts with max-20-word bullets fit within 4500 tokens.
  // Override the UI default (3500) with this floor.
  const maxTokens = Math.max(template.max_tokens, 4500);

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
  // Strip markdown code fences if the model wrapped the JSON despite instructions
  const cleanedOutput = rawOutput.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

  let profileJson: FlowProfileJSON;
  try {
    profileJson = JSON.parse(cleanedOutput) as FlowProfileJSON;
    if (!profileJson.schema_version || !profileJson.archetype || !profileJson.dimensions) {
      throw new Error('Missing required fields: schema_version, archetype, or dimensions');
    }
    console.log(`      Archetype: "${profileJson.archetype.name}"`);
  } catch (err) {
    console.error('\nJSON parse failed — model did not return valid JSON.');
    console.error('Error:', err instanceof Error ? err.message : err);
    console.error('\nRaw output (first 500 chars):');
    console.error(rawOutput.slice(0, 500));
    console.error('\nSave raw output? (check scripts/last-output.txt)');
    const fs = await import('fs');
    fs.writeFileSync(resolve(__dirname, 'last-output.txt'), cleanedOutput);
    process.exit(1);
  }

  // 6. Save + deliver
  console.log('[6/6] Saving to Supabase + delivering...');

  // Save to profile_generations
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

  // Update assessment — deliver in same write
  const { error: updateError } = await supabase
    .from('assessments')
    .update({
      flow_profile_json: profileJson,
      flow_profile_final: rawOutput,   // keeps /me query (.not flow_profile_final is null) working
      flow_profile_draft: rawOutput,
      prompt_template_id: template.id,
      status: 'delivered',
    })
    .eq('id', assessmentId);

  if (updateError) {
    console.error('Supabase update failed:', updateError.message);
    process.exit(1);
  }
  console.log(`      Saved (generation: ${generation?.id ?? 'n/a'})`);

  // Send delivery email
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
  /me page  : available immediately after sign-in
`);
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
