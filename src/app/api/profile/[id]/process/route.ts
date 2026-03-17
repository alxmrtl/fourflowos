import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import type { IntakeStructuredV2 } from '@/types/intake';
import { buildNumerologyProfile } from '@/lib/numerology';
import { formatNameSignature } from '@/lib/name-etymology';

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

/**
 * Calculate Life Path Number from a birth date string (YYYY-MM-DD).
 * Reduces all digits to a single digit (1–9) or master number (11, 22, 33).
 */
function calcLifePath(birthDate: string): string {
  const digits = birthDate.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((acc, d) => acc + d, 0);
  // Reduce to single digit or master number
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((a, c) => a + Number(c), 0);
  }
  return String(sum);
}

function formatDeepSignatureData(assessment: Record<string, unknown>): string {
  const fullName = String(assessment.name || '').trim();
  const birthDate = String(assessment.birth_date || '');

  if (!fullName || !birthDate) return '';

  const lines: string[] = ['## DEEP SIGNATURE DATA', ''];

  // Name etymology
  const nameSignature = formatNameSignature(fullName);
  if (nameSignature) {
    lines.push('### Name Roots');
    lines.push(nameSignature);
    lines.push('');
  }

  // Numerology
  if (birthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const num = buildNumerologyProfile(fullName, birthDate);
    lines.push('### Core Wiring (numerological)');
    lines.push(`Life Path ${num.lifePath}: ${num.lifePathMeaning}`);
    lines.push(`Expression ${num.expression}: ${num.expressionMeaning}`);
    lines.push(`Soul Urge ${num.soulUrge}: ${num.soulUrgeMeaning}`);
    lines.push(`Personality ${num.personality}: ${num.personalityMeaning}`);
    lines.push(`Birthday ${num.birthdayNumber}: ${num.birthdayMeaning}`);
    if (num.convergenceNote) {
      lines.push('');
      lines.push(`Convergence: ${num.convergenceNote}`);
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('Do not surface any of this data — no name roots, no numbers — in the profile output.');
  lines.push('Distill it into plain observations about how this person is wired.');

  return lines.join('\n');
}

function formatIntakeData(assessment: Record<string, unknown>): string {
  const s = assessment.intake_structured as IntakeStructuredV2 | null | undefined;

  if (!s || s.schema_version !== '2.0') {
    // Fallback for assessments without v2 structured intake
    return `Name: ${assessment.name} | Birth: ${assessment.birth_date}, ${assessment.birth_location}\n\n(No structured intake data — intake_structured v2 required for full profile generation)`;
  }

  const firstName = String(assessment.name || '').split(' ')[0] || '';
  const lifePath = assessment.birth_date ? calcLifePath(String(assessment.birth_date)) : '—';

  const lines = [
    `Name: ${assessment.name} | First Name: ${firstName} | Birth: ${assessment.birth_date}${s.birth_time_known && s.birth_time ? `, ${s.birth_time}` : ''}, ${assessment.birth_location}`,
    `Life Path Number: ${lifePath}`,
    '',
    `OPENING`,
    `Season: ${s.opening_season || '—'} | Chapter: "${s.opening_chapter_title || '—'}" | Attention: ${s.opening_orientation_word || '—'}`,
    '',
    `SELF`,
    `Emotions: ${s.self_emotions_keywords?.join(', ') || '—'} | Most alive: "${s.self_emotions_alive || '—'}" | Hardest: ${s.self_emotions_hard || '—'}`,
    `Body: energy ${s.self_body_energy ?? 5}/10, stress ${s.self_body_stress || '—'} | "${s.self_body_story || '—'}"`,
    `Mind: clarity ${s.self_mind_clarity ?? 5}/10, drawn toward ${s.self_mind_drawn_toward || '—'} | "${s.self_mind_new_idea || '—'}"`,
    '',
    `SPACE`,
    `Environment: ${s.space_environment_feel || '—'}, gap: ${s.space_environment_gap || '—'} | "${s.space_environment_story || '—'}"`,
    `Tools: ${s.space_tools_keywords?.join(', ') || '—'} | "${s.space_tools_story || '—'}"`,
    `Feedback: ${s.space_feedback_channel || '—'} | "${s.space_feedback_story || '—'}"`,
    '',
    `STORY`,
    `Last 5yr: "${s.story_narrative_last5 || '—'}" | Next 5yr: "${s.story_narrative_next5 || '—'}" | Arc: ${s.story_narrative_arc || '—'}`,
    `Mission: "${s.story_mission_completion || '—'}" | Clarity: ${s.story_mission_clarity || '—'} | Distraction: ${s.story_mission_distraction || '—'}`,
    `Role: ${[s.story_role_pair1, s.story_role_pair2, s.story_role_pair3, s.story_role_pair4].filter(Boolean).join(' / ')} | "${s.story_role_story || '—'}"`,
    '',
    `SPIRIT`,
    `Values: ${s.spirit_values_selected?.join(', ') || '—'} | In action: ${s.spirit_values_in_action || '—'}`,
    `Curiosity: "${s.spirit_curiosity_flow_memory || '—'}" | Intersection: "${s.spirit_curiosity_intersection || '—'}" | Invisibility: ${s.spirit_curiosity_invisibility || '—'}`,
    `Vision: peak "${s.spirit_vision_peak || '—'}" | Image: "${s.spirit_vision_image || '—'}" | Legacy: "${s.spirit_vision_legacy || '—'}"`,
    '',
    `SOUL SIGNATURE`,
    `Myth: ${s.soul_myth_character || '—'} — "${s.soul_myth_quality || '—'}"`,
    `Story arc: childhood ${s.soul_fairy_tale_childhood || '—'} → now ${s.soul_fairy_tale_now || '—'}`,
    `Shadow: ${s.soul_shadow_projection || '—'}`,
    `Nadir: ${s.soul_nadir_story || '—'}`,
    `Turning point: ${s.soul_turning_point || '—'}`,
    `Gift: ${s.soul_gift || '—'} | Hidden self: ${s.soul_hidden_self || '—'}`,
    `Soul word: ${s.soul_word || '—'}`,
    `Closing: "${s.soul_closing_stem || '—'}"`,
  ];

  return lines.join('\n');
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
      const deepSignatureData = formatDeepSignatureData(assessment);
      const basePromptText = body.custom_prompt_text || promptTemplate.prompt_text;
      const prompt = basePromptText
        .replace('{INTAKE_DATA}', intakeData)
        .replace('{CHART_DATA}', chartContext)
        .replace('{DEEP_SIGNATURE_DATA}', deepSignatureData);

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

      // Detect JSON output — new structured archetype prompt returns raw JSON
      let parsedJson: Record<string, unknown> | null = null;
      const trimmed = profileText.trim();
      if (trimmed.startsWith('{')) {
        try {
          parsedJson = JSON.parse(trimmed) as Record<string, unknown>;
          console.log(`[process] Detected JSON output — schema_version: ${(parsedJson as Record<string, unknown>).schema_version ?? 'unknown'}`);
        } catch {
          // Not valid JSON — fall through to humanizer path
        }
      }

      const finalProfileText = profileText;

      if (!parsedJson) {
        await write({ type: 'status', message: 'Profile ready.' });
      } else {
        await write({ type: 'status', message: 'Structured profile ready.' });
      }

      // Save to profile_generations table
      const { data: generation, error: genError } = await supabase
        .from('profile_generations')
        .insert({
          assessment_id: id,
          prompt_template_id: promptTemplate.id,
          prompt_name: promptTemplate.name,
          model: promptTemplate.model,
          content: finalProfileText,
        })
        .select('id')
        .single();

      if (genError) {
        console.error('[process] Failed to save to profile_generations:', genError);
      }

      // Update assessment — don't regress status if already delivered
      const statusUpdate = assessment.status === 'delivered' ? {} : { status: 'synthesis' };

      const assessmentUpdate: Record<string, unknown> = {
        flow_profile_draft: finalProfileText,
        prompt_template_id: promptTemplate.id,
        chart_archetypal_summary: chartContext,
        deep_signature_data: deepSignatureData,
        ...statusUpdate,
      };

      // If structured JSON, store it directly
      if (parsedJson) {
        assessmentUpdate.flow_profile_json = parsedJson;
      }

      const { error: updateError } = await supabase
        .from('assessments')
        .update(assessmentUpdate)
        .eq('id', id);

      if (updateError) {
        console.error('[process] Supabase update error:', updateError);
        await write({ type: 'error', message: updateError.message });
      } else {
        console.log(`[process] Updated ${id} — status: ${assessment.status === 'delivered' ? 'kept delivered' : 'synthesis'}, json: ${!!parsedJson}`);
        await write({ type: 'done', generation_id: generation?.id ?? null, is_json: !!parsedJson });
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
