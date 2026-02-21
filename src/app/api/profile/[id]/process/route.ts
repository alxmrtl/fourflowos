import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Matches the CLI script's chart summary prompt for equivalent quality
const CHART_ARCHETYPAL_PROMPT = `You are analyzing a natal chart to extract archetypal patterns for a Flow Profile — a consciousness alignment diagnostic.

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

function isAuthorized(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key');
  return key === process.env.PROFILE_ADMIN_KEY;
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

async function fetchAndCacheChartData(
  assessment: Record<string, unknown>,
  id: string
): Promise<Record<string, unknown> | null> {
  const chartServiceUrl = process.env.CHART_SERVICE_URL;
  if (!chartServiceUrl) return null;

  try {
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

    if (!res.ok) return null;

    const data = await res.json() as Record<string, unknown>;
    await supabase.from('assessments').update({ natal_chart_data: data }).eq('id', id);
    return data;
  } catch {
    return null;
  }
}

// Phase 1: Use Haiku to generate a rich archetypal summary from full chart JSON.
// Falls back to basic sun/moon/rising string if Haiku call fails.
async function generateChartSummary(
  chartData: Record<string, unknown>,
  anthropic: Anthropic
): Promise<string> {
  try {
    const prompt = CHART_ARCHETYPAL_PROMPT.replace(
      '{CHART_DATA}',
      JSON.stringify(chartData, null, 2)
    );
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });
    return message.content[0].type === 'text' ? message.content[0].text : '';
  } catch {
    // Fallback to basic summary
    const sun = (chartData.sun_sign as string) || '';
    const moon = (chartData.moon_sign as string) || '';
    const rising = (chartData.rising_sign as string) || '';
    return [sun && `Sun: ${sun}`, moon && `Moon: ${moon}`, rising && `Rising: ${rising}`]
      .filter(Boolean)
      .join(' | ') || 'Chart data unavailable.';
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({})) as { prompt_template_id?: string; custom_prompt_text?: string };

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();

  const write = (data: object): Promise<void> =>
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

  // Run generation as a background async task.
  // The open writer keeps the Vercel function alive until writer.close() is called.
  void (async () => {
    let heartbeat: ReturnType<typeof setInterval> | null = null;

    try {
      // Fetch assessment
      const { data: assessment, error: fetchError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !assessment) {
        await write({ type: 'error', message: 'Assessment not found' });
        return;
      }

      // Fetch prompt template — use requested ID, or fall back to first active template
      let promptTemplate = null;

      if (body.prompt_template_id) {
        const { data } = await supabase
          .from('prompt_templates')
          .select('*')
          .eq('id', body.prompt_template_id)
          .single();
        promptTemplate = data;
      }

      if (!promptTemplate) {
        const { data } = await supabase
          .from('prompt_templates')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true })
          .limit(1)
          .single();
        promptTemplate = data;
      }

      if (!promptTemplate) {
        await write({ type: 'error', message: 'No prompt template available. Create one at /profile/admin/prompts.' });
        return;
      }

      await write({ type: 'status', message: `Using: ${promptTemplate.name}` });

      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      // Resolve chart data (use cached, or fetch and cache)
      let chartData: Record<string, unknown> | null = assessment.natal_chart_data as Record<string, unknown> | null;
      if (!chartData) {
        await write({ type: 'status', message: 'Fetching natal chart...' });
        chartData = await fetchAndCacheChartData(assessment, id);
      }

      // Phase 1: Haiku generates archetypal chart summary
      let chartContext: string;
      if (chartData) {
        await write({ type: 'status', message: 'Generating chart summary...' });
        chartContext = await generateChartSummary(chartData, anthropic);
      } else {
        chartContext = 'No natal chart data available.';
      }

      await write({ type: 'status', message: 'Generating profile...' });

      // Heartbeat every 5s — prevents Vercel gateway 504
      heartbeat = setInterval(() => {
        write({ type: 'heartbeat' }).catch(() => {
          if (heartbeat) clearInterval(heartbeat);
        });
      }, 5000);

      // Phase 2: Build final prompt — use custom text if provided, else template
      const intakeData = formatIntakeData(assessment);
      const basePromptText = body.custom_prompt_text || promptTemplate.prompt_text;
      const prompt = basePromptText
        .replace('{INTAKE_DATA}', intakeData)
        .replace('{CHART_DATA}', chartContext);

      let profileText = '';

      const stream = anthropic.messages.stream({
        model: promptTemplate.model,
        max_tokens: promptTemplate.max_tokens,
        messages: [{ role: 'user', content: prompt }],
      });

      stream.on('text', (text) => {
        profileText += text;
      });

      await stream.finalMessage();

      if (heartbeat) {
        clearInterval(heartbeat);
        heartbeat = null;
      }

      if (!profileText) {
        await write({ type: 'error', message: 'Generation returned empty profile' });
        return;
      }

      console.log(`[process] Generated ${profileText.length} chars for ${id} using "${promptTemplate.name}"`);

      // Save to profile_generations table
      const { data: generation, error: genError } = await supabase
        .from('profile_generations')
        .insert({
          assessment_id: id,
          prompt_template_id: promptTemplate.id,
          prompt_name: promptTemplate.name,
          model: promptTemplate.model,
          content: profileText,
        })
        .select('id')
        .single();

      if (genError) {
        console.error('[process] Failed to save to profile_generations:', genError);
      }

      // Update assessment — don't regress status if already delivered
      const statusUpdate = assessment.status === 'delivered' ? {} : { status: 'synthesis' };

      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          flow_profile_draft: profileText,
          prompt_template_id: promptTemplate.id,
          ...statusUpdate,
        })
        .eq('id', id);

      if (updateError) {
        console.error('[process] Supabase update error:', updateError);
        await write({ type: 'error', message: updateError.message });
      } else {
        console.log(`[process] Updated ${id} — status: ${assessment.status === 'delivered' ? 'kept delivered' : 'synthesis'}`);
        await write({ type: 'done', generation_id: generation?.id ?? null });
      }
    } catch (error) {
      console.error('[process] Error:', error);
      if (heartbeat) clearInterval(heartbeat);
      await write({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      await writer.close();
    }
  })().catch((err) => {
    console.error('[process] Unhandled background error:', err);
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
