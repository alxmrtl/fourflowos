import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import { FACILITATOR_BRIEFING_PROMPT, FLOW_PROFILE_SYNTHESIS_PROMPT, LITE_PROFILE_PROMPT } from '@/data/profile-prompts';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60s for AI generation

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { type } = body as { type: 'briefing' | 'synthesis' | 'lite' };

  if (!type || !['briefing', 'synthesis', 'lite'].includes(type)) {
    return NextResponse.json({ success: false, error: 'Invalid type. Must be "briefing", "synthesis", or "lite".' }, { status: 400 });
  }

  try {
    // Fetch the assessment
    const { data: assessment, error: fetchError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !assessment) {
      return NextResponse.json({ success: false, error: 'Assessment not found' }, { status: 404 });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const intakeData = formatIntakeData(assessment);

    if (type === 'lite') {
      // Lite profile — intake-only, no session required
      let chartData = 'No chart data available.';
      if (assessment.natal_chart_data) {
        chartData = JSON.stringify(assessment.natal_chart_data, null, 2);
      } else {
        chartData = await fetchChartData(assessment);
        if (!chartData.includes('unavailable') && !chartData.includes('No chart')) {
          await supabase
            .from('assessments')
            .update({ natal_chart_data: JSON.parse(chartData) })
            .eq('id', id);
        }
      }

      const prompt = LITE_PROFILE_PROMPT
        .replace('{INTAKE_DATA}', intakeData)
        .replace('{CHART_DATA}', chartData);

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 6144,
        messages: [{ role: 'user', content: prompt }],
      });

      const profileText = message.content
        .filter(block => block.type === 'text')
        .map(block => block.type === 'text' ? block.text : '')
        .join('\n');

      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          flow_profile_draft: profileText,
          status: 'lite_generated',
        })
        .eq('id', id);

      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, type: 'lite' });

    } else if (type === 'briefing') {
      // Fetch chart data
      let chartData = 'No chart data available.';
      if (assessment.natal_chart_data) {
        chartData = JSON.stringify(assessment.natal_chart_data, null, 2);
      } else {
        chartData = await fetchChartData(assessment);
        // Store chart data if we got it
        if (!chartData.includes('unavailable') && !chartData.includes('No chart')) {
          await supabase
            .from('assessments')
            .update({ natal_chart_data: JSON.parse(chartData) })
            .eq('id', id);
        }
      }

      const prompt = FACILITATOR_BRIEFING_PROMPT
        .replace('{INTAKE_DATA}', intakeData)
        .replace('{CHART_DATA}', chartData);

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      const briefingText = message.content
        .filter(block => block.type === 'text')
        .map(block => block.type === 'text' ? block.text : '')
        .join('\n');

      // Update assessment
      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          facilitator_briefing: briefingText,
          status: 'processing',
        })
        .eq('id', id);

      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, type: 'briefing' });

    } else {
      // Synthesis — requires session notes
      if (!assessment.session_1_notes) {
        return NextResponse.json({ success: false, error: 'Session 1 notes are required for synthesis' }, { status: 400 });
      }

      const chartData = assessment.natal_chart_data
        ? JSON.stringify(assessment.natal_chart_data, null, 2)
        : 'No chart data available.';

      const prompt = FLOW_PROFILE_SYNTHESIS_PROMPT
        .replace('{INTAKE_DATA}', intakeData)
        .replace('{CHART_DATA}', chartData)
        .replace('{BRIEFING}', assessment.facilitator_briefing || 'No briefing available.')
        .replace('{SESSION_NOTES}', assessment.session_1_notes);

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }],
      });

      const profileText = message.content
        .filter(block => block.type === 'text')
        .map(block => block.type === 'text' ? block.text : '')
        .join('\n');

      // Update assessment
      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          flow_profile_draft: profileText,
          status: 'synthesis',
        })
        .eq('id', id);

      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, type: 'synthesis' });
    }
  } catch (error) {
    console.error('Process error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
