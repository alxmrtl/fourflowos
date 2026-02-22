#!/usr/bin/env ts-node

/**
 * Manual Flow Profile Generation Script
 *
 * Generates Flow Profiles outside the web timeout constraint with full chart context.
 *
 * Usage:
 *   npm run profile:generate <assessment-id> [prompt-name]
 *
 * Examples:
 *   npm run profile:generate abc-123
 *   npm run profile:generate abc-123 "Flow Archetype"
 *
 * Process:
 * 1. Fetches assessment from Supabase
 * 2. Fetches full natal chart data
 * 3. Uses Haiku to generate archetypal chart summary (~250 tokens, rich context)
 * 4. Uses Sonnet (or specified model) to generate full profile
 * 5. Writes result to Supabase (flow_profile_draft, status -> synthesis)
 *
 * No timeout constraints. Full context. Takes 2-3 minutes per profile.
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import Anthropic from '@anthropic-ai/sdk';
import { getSupabase } from '../src/lib/supabase';
import { FLOW_PROFILE_PROMPT } from '../src/data/profile-prompts';
import { humanizeProfile } from '../src/lib/humanizer';

const supabase = getSupabase();

// Chart archetypal summary prompt for Haiku
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

The summary will be combined with their intake responses to generate a personalized Flow Profile.

---

NATAL CHART DATA:

{CHART_DATA}`;

interface ChartData {
  sun_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  context?: string;
  planets?: Array<{
    name: string;
    sign: string;
    house: number;
    degree: number;
  }>;
  aspects?: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  }>;
  elements?: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  modalities?: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
}

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

async function fetchChartData(assessment: Record<string, unknown>): Promise<ChartData | null> {
  const chartServiceUrl = process.env.CHART_SERVICE_URL;
  if (!chartServiceUrl) {
    console.warn('⚠️  CHART_SERVICE_URL not configured. Proceeding without chart data.');
    return null;
  }

  try {
    console.log('📊 Fetching natal chart data...');
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
      console.error(`❌ Chart service error: ${res.status}`);
      return null;
    }

    const data = await res.json() as ChartData;
    console.log('✅ Chart data fetched successfully');
    return data;
  } catch (err) {
    console.error('❌ Chart service fetch error:', err);
    return null;
  }
}

async function generateChartSummary(chartData: ChartData, anthropic: Anthropic): Promise<string> {
  console.log('🔮 Generating archetypal chart summary with Haiku...');

  const prompt = CHART_SUMMARY_PROMPT.replace(
    '{CHART_DATA}',
    JSON.stringify(chartData, null, 2)
  );

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const summary = message.content[0].type === 'text' ? message.content[0].text : '';
  console.log(`✅ Chart summary generated (${summary.length} chars)`);
  return summary;
}

async function generateProfile(
  promptText: string,
  anthropic: Anthropic,
  model: string = 'claude-sonnet-4-5-20250929',
  maxTokens: number = 2000
): Promise<string> {
  console.log(`🧠 Generating Flow Profile with ${model}...`);

  const message = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: promptText }],
  });

  const profile = message.content[0].type === 'text' ? message.content[0].text : '';
  console.log(`✅ Profile generated (${profile.length} chars)`);
  return profile;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(`
❌ Error: Assessment ID required

Usage:
  npm run profile:generate <assessment-id> [prompt-name]

Examples:
  npm run profile:generate abc-123
  npm run profile:generate abc-123 "Flow Archetype"
  npm run profile:generate abc-123 "Classic Flow Mirror"
`);
    process.exit(1);
  }

  const assessmentId = args[0];
  const promptName = args[1] || 'Classic Flow Mirror'; // Default to Classic

  console.log(`\n🚀 Generating Flow Profile for assessment: ${assessmentId}\n`);

  // Initialize Anthropic
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY environment variable not set');
    process.exit(1);
  }
  const anthropic = new Anthropic({ apiKey });

  try {
    // Step 1: Fetch assessment
    console.log('📥 Fetching assessment from Supabase...');
    const { data: assessment, error: fetchError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (fetchError || !assessment) {
      console.error('❌ Assessment not found:', fetchError?.message || 'Unknown error');
      process.exit(1);
    }
    console.log(`✅ Assessment fetched: ${assessment.name} (${assessment.email})`);

    // Step 2: Fetch prompt template
    console.log(`📝 Fetching prompt template: "${promptName}"...`);
    const { data: promptTemplate, error: promptError } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('name', promptName)
      .single();

    if (promptError || !promptTemplate) {
      console.error(`❌ Prompt template "${promptName}" not found`);
      console.log('\n💡 Available prompts:');
      const { data: allPrompts } = await supabase
        .from('prompt_templates')
        .select('name, description')
        .eq('is_active', true);
      if (allPrompts) {
        allPrompts.forEach(p => {
          console.log(`   - "${p.name}" ${p.description ? `— ${p.description}` : ''}`);
        });
      }
      process.exit(1);
    }
    console.log(`✅ Using prompt: ${promptTemplate.name} (${promptTemplate.model})`);

    // Step 3: Fetch or use cached chart data
    let chartData: ChartData | null = null;
    if (assessment.natal_chart_data) {
      console.log('📊 Using cached natal chart data');
      chartData = assessment.natal_chart_data as ChartData;
    } else {
      chartData = await fetchChartData(assessment);
      if (chartData) {
        // Cache it for future use
        await supabase
          .from('assessments')
          .update({ natal_chart_data: chartData })
          .eq('id', assessmentId);
        console.log('✅ Chart data cached in Supabase');
      }
    }

    // Step 4: Generate chart summary with Haiku (or use basic summary if no chart)
    let chartSummary: string;
    if (chartData) {
      chartSummary = await generateChartSummary(chartData, anthropic);
    } else {
      chartSummary = 'No natal chart data available.';
      console.log('⚠️  Proceeding without chart data');
    }

    // Step 5: Format intake data
    const intakeData = formatIntakeData(assessment);

    // Step 6: Generate profile using the selected prompt template
    const promptText = promptTemplate.prompt_text
      .replace('{INTAKE_DATA}', intakeData)
      .replace('{CHART_DATA}', chartSummary);

    const rawProfile = await generateProfile(
      promptText,
      anthropic,
      promptTemplate.model,
      promptTemplate.max_tokens
    );

    // Step 6b: Humanizer pass — strip AI patterns, preserve structure
    console.log('✨ Humanizing profile...');
    const profile = await humanizeProfile(rawProfile, anthropic);
    console.log(`✅ Profile humanized (${profile.length} chars)`);

    // Step 7: Save to profile_generations table
    console.log('💾 Saving to profile_generations...');
    const { data: generation, error: genError } = await supabase
      .from('profile_generations')
      .insert({
        assessment_id: assessmentId,
        prompt_template_id: promptTemplate.id,
        prompt_name: promptTemplate.name,
        model: promptTemplate.model,
        content: profile,
      })
      .select('id')
      .single();

    if (genError) {
      console.error('⚠️  Failed to save to profile_generations:', genError.message);
      console.log('   (Continuing — will still update assessment draft)');
    } else {
      console.log(`✅ Generation saved: ${generation.id}`);
    }

    // Step 8: Update assessment (preserve status if already delivered)
    console.log('💾 Updating assessment...');
    const statusUpdate = assessment.status === 'delivered' ? {} : { status: 'synthesis' };
    const { error: updateError } = await supabase
      .from('assessments')
      .update({
        flow_profile_draft: profile,
        prompt_template_id: promptTemplate.id,
        ...statusUpdate,
      })
      .eq('id', assessmentId);

    if (updateError) {
      console.error('❌ Failed to save profile:', updateError.message);
      process.exit(1);
    }

    const statusMsg = assessment.status === 'delivered'
      ? 'kept delivered (no regression)'
      : 'updated to synthesis';

    console.log(`\n✅ Profile generated successfully!`);
    console.log(`📝 Profile length: ${profile.length} characters`);
    console.log(`📊 Status: ${statusMsg}`);
    if (generation?.id) {
      console.log(`🔑 Generation ID: ${generation.id}`);
    }
    console.log(`\n🔗 Review at: /profile/admin/${assessmentId}\n`);

  } catch (error) {
    console.error('\n❌ Generation failed:', error);
    process.exit(1);
  }
}

main();
