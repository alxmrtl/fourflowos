import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import { FLOW_PROFILE_PROMPT } from '@/data/profile-prompts';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

async function fetchChartData(assessment: Record<string, unknown>): Promise<string> {
  const chartServiceUrl = process.env.CHART_SERVICE_URL;
  if (!chartServiceUrl) return 'No chart service configured.';

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

    if (!res.ok) {
      console.error('[process] Chart service error:', res.status);
      return 'Chart service unavailable.';
    }

    const data = await res.json();
    return JSON.stringify(data, null, 2);
  } catch (err) {
    console.error('[process] Chart service fetch error:', err);
    return 'Chart service unavailable.';
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
      const { data: assessment, error: fetchError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !assessment) {
        await write({ type: 'error', message: 'Assessment not found' });
        return;
      }

      // Use cached chart data if available, otherwise fetch and cache
      let chartData = 'No chart data available.';
      if (assessment.natal_chart_data) {
        chartData = JSON.stringify(assessment.natal_chart_data, null, 2);
      } else {
        await write({ type: 'status', message: 'Fetching natal chart...' });
        chartData = await fetchChartData(assessment);
        if (!chartData.includes('unavailable') && !chartData.includes('No chart')) {
          await supabase
            .from('assessments')
            .update({ natal_chart_data: JSON.parse(chartData) })
            .eq('id', id);
        }
      }

      await write({ type: 'status', message: 'Generating profile...' });

      // Heartbeat every 5s — prevents Vercel gateway from firing a 504
      // (gateway cuts connection if no bytes arrive for ~30s)
      heartbeat = setInterval(() => {
        write({ type: 'heartbeat' }).catch(() => {
          if (heartbeat) clearInterval(heartbeat);
        });
      }, 5000);

      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const intakeData = formatIntakeData(assessment);
      const prompt = FLOW_PROFILE_PROMPT
        .replace('{INTAKE_DATA}', intakeData)
        .replace('{CHART_DATA}', chartData);

      let profileText = '';

      const stream = anthropic.messages.stream({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 3000,
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

      console.log(`[process] Generated ${profileText.length} chars for ${id}`);

      if (!profileText) {
        await write({ type: 'error', message: 'Generation returned empty profile' });
        return;
      }

      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          flow_profile_draft: profileText,
          status: 'synthesis',
        })
        .eq('id', id);

      if (updateError) {
        console.error('[process] Supabase update error:', updateError);
        await write({ type: 'error', message: updateError.message });
      } else {
        console.log(`[process] Updated ${id} to synthesis`);
        await write({ type: 'done' });
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
