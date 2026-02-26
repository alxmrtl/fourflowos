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

const supabase = getSupabase();

const CHART_SUMMARY_PROMPT = `You are analyzing a natal chart to extract archetypal patterns for a Flow Profile — a consciousness alignment diagnostic.

Your task: Generate a 250-word archetypal summary that captures:

1. **Dominant Themes**: Element balance (Fire/Earth/Air/Water), modality emphasis (Cardinal/Fixed/Mutable), house emphasis
2. **Core Aspects**: 3-5 most significant aspects (conjunctions, squares, trines) that define this person's archetypal pattern
3. **Flow Implications**: How these patterns specifically relate to the four FourFlow pillars:
   - SELF (body, emotions, mind) — How does this chart suggest energy moves through their vessel?
   - SPACE (environment, tools, feedback) — What external conditions support or hinder them?
   - STORY (narrative, mission, role) — What's their relationship to temporal direction and purpose?
   - SPIRIT (values, curiosity, vision) — What connects them to timeless meaning?

Write in clear, human language. No astrological jargon. Focus on HOW this person is wired to work, not generic descriptions.

---

NATAL CHART DATA:

{CHART_DATA}`;

function formatIntakeData(assessment: Record<string, unknown>): string {
  return `
**Name**: ${assessment.name}
**Email**: ${assessment.email}

**Birth**: ${assessment.birth_date}${assessment.birth_time_known ? `, ${assessment.birth_time}` : ' (time unknown)'}, ${assessment.birth_location}

---

### Life Context

**What's working:**
${assessment.context_working}

**What's stuck:**
${assessment.context_stuck}

**Building toward:**
${assessment.context_building}

---

### SELF (Reception)

**Physical Energy (Focused Body):**
${assessment.self_energy}

**Emotions (Tuned Emotions):**
${assessment.self_emotions}

**Mental Clarity (Open Mind):**
${assessment.self_focus}

---

### SPACE (Transmission)

**Environment (Intentional Space):**
${assessment.space_environment}

**Tools & Systems (Optimized Tools):**
${assessment.space_tools}

**Feedback Loops (Feedback Systems):**
${assessment.space_feedback}

---

### STORY (Direction)

**Life Narrative (Generative Story):**
${assessment.story_narrative}

**Mission (Clear Mission):**
${assessment.story_mission}

**Role (Empowered Role):**
${assessment.story_role}

---

### SPIRIT (Timeless)

**Values (Grounding Values):**
${assessment.spirit_values}

**Curiosity (Ignited Curiosity):**
${assessment.spirit_curiosity}

**Vision (Visualized Vision):**
${assessment.spirit_vision}
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

async function generateChartSummary(
  chartData: Record<string, unknown>,
  anthropic: Anthropic
): Promise<string> {
  console.log('  Generating chart summary (Haiku)...');
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: CHART_SUMMARY_PROMPT.replace('{CHART_DATA}', JSON.stringify(chartData, null, 2)) }],
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
  console.log(`      Using: "${template.name}" (${template.model}, max ${Math.max(template.max_tokens, 8000)} tokens)`);

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
    ? await generateChartSummary(chartData, anthropic)
    : 'No natal chart data available.';
  console.log(`      ${chartContext.length} chars`);

  // 5. Generate profile
  console.log('[5/6] Generating Flow Archetype profile (Opus)...');
  const intakeData = formatIntakeData(assessment);
  const prompt = template.prompt_text
    .replace('{INTAKE_DATA}', intakeData)
    .replace('{CHART_DATA}', chartContext);

  let rawOutput = '';
  // Flow Archetype profiles need ~6000-8000 tokens for 12 full key insights.
  // The template's max_tokens (3500) is a UI default — override with a safe floor here.
  const maxTokens = Math.max(template.max_tokens, 8000);

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
