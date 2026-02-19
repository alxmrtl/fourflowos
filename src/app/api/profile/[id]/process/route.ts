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
      console.error('Chart service error:', res.status);
      return 'Chart service unavailable.';
    }

    const data = await res.json();
    return JSON.stringify(data, null, 2);
  } catch (err) {
    console.error('Chart service fetch error:', err);
    return 'Chart service unavailable.';
  }
}

function sseEvent(data: object): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Return a streaming response immediately.
  // Token events flow continuously during Claude generation, preventing the
  // Vercel gateway from firing a 504 (which triggers when no bytes arrive in ~30s).
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { data: assessment, error: fetchError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError || !assessment) {
          controller.enqueue(sseEvent({ type: 'error', message: 'Assessment not found' }));
          controller.close();
          return;
        }

        // Use cached chart data if available, otherwise fetch and cache
        let chartData = 'No chart data available.';
        if (assessment.natal_chart_data) {
          chartData = JSON.stringify(assessment.natal_chart_data, null, 2);
        } else {
          controller.enqueue(sseEvent({ type: 'status', message: 'Fetching natal chart...' }));
          chartData = await fetchChartData(assessment);
          if (!chartData.includes('unavailable') && !chartData.includes('No chart')) {
            await supabase
              .from('assessments')
              .update({ natal_chart_data: JSON.parse(chartData) })
              .eq('id', id);
          }
        }

        controller.enqueue(sseEvent({ type: 'status', message: 'Generating profile...' }));

        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const intakeData = formatIntakeData(assessment);

        const prompt = FLOW_PROFILE_PROMPT
          .replace('{INTAKE_DATA}', intakeData)
          .replace('{CHART_DATA}', chartData);

        let profileText = '';

        const streamResponse = anthropic.messages.stream({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 3000,
          messages: [{ role: 'user', content: prompt }],
        });

        for await (const chunk of streamResponse) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            profileText += chunk.delta.text;
            // Forward each token — keeps bytes flowing, prevents gateway timeout
            controller.enqueue(sseEvent({ type: 'token', t: chunk.delta.text }));
          }
        }

        // Save completed profile to Supabase
        const { error: updateError } = await supabase
          .from('assessments')
          .update({
            flow_profile_draft: profileText,
            status: 'synthesis',
          })
          .eq('id', id);

        if (updateError) {
          controller.enqueue(sseEvent({ type: 'error', message: updateError.message }));
        } else {
          controller.enqueue(sseEvent({ type: 'done' }));
        }
      } catch (error) {
        console.error('Process error:', error);
        controller.enqueue(sseEvent({
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
