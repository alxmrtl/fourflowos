import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import { buildNumerologyProfile } from '@/lib/numerology';
import { formatNameSignature, getNameEtymology } from '@/lib/name-etymology';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getUserFromRequest(request: NextRequest): Promise<{ id: string } | null> {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

// ─── Natal chart (optional) ───────────────────────────────────────────────────

async function fetchChartData(
  birthDate: string,
  birthTime: string | null,
  birthLocation: string,
  lat: number | null,
  lng: number | null,
): Promise<Record<string, unknown> | null> {
  const chartServiceUrl = process.env.CHART_SERVICE_URL;
  if (!chartServiceUrl) return null;

  try {
    const res = await fetch(`${chartServiceUrl}/chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate, birth_time: birthTime, birth_location: birthLocation, lat, lng }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json() as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ─── Sun sign fallback (no chart service) ────────────────────────────────────

function getSunSignFromDate(birthDate: string): string {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}

// ─── Structured output tool ───────────────────────────────────────────────────

interface StructuredMap {
  archetype: string;
  epigraph: string;
  name_signal: string;
  birth_code: string;
  natal_pattern: string;
  flow_architecture: string;
  true_north: string;
}

const MAP_TOOL: Anthropic.Tool = {
  name: 'generate_timeless_map',
  description: 'Output the structured Timeless Map reading as JSON',
  input_schema: {
    type: 'object' as const,
    properties: {
      archetype: {
        type: 'string',
        description: 'A bespoke 2-4 word archetype title for this person, e.g. "The Patient Cartographer". Must be earned: synthesized from the tensions across name, numbers, and sky — never generic. BANNED: The Seeker, The Visionary, The Creator, The Explorer, The Builder, The Dreamer, The Leader, The Healer, or any single-word archetype. No name words inside the title.',
      },
      epigraph: {
        type: 'string',
        description: 'One line under the archetype, 12 words or fewer. The archetype\'s thesis — what this person is built for, stated plainly.',
      },
      name_signal: {
        type: 'string',
        description: '2-3 sentences. What is encoded in this name — not the etymological facts, the character the name points to. What are you carrying in your name that you may not have fully recognized yet?',
      },
      birth_code: {
        type: 'string',
        description: '2-3 sentences. The core life orientation from the numerological signature — the intersection of what you\'re here to do and what you privately crave. Name any significant convergence or tension.',
      },
      natal_pattern: {
        type: 'string',
        description: '2-3 sentences. The key signature from the birth sky. If only the sun sign is available, work from the elemental and directional quality of that sign. Translate completely — no sign names unless they help the reader locate themselves.',
      },
      flow_architecture: {
        type: 'string',
        description: 'One paragraph. The single most consistent structural fact about how you are built — something that holds across name, birth code, and natal pattern even when those layers describe it differently. If the layers tell contradictory stories, the tension IS the architecture. Once named, the other details should feel like evidence of it.',
      },
      true_north: {
        type: 'string',
        description: '2-3 sentences closing the reading. What this map suggests you are built to protect (the values underneath everything), and what kind of future image actually pulls you — the picture worth building toward. Plain language, forward-leaning, no instruction-giving.',
      },
    },
    required: ['archetype', 'epigraph', 'name_signal', 'birth_code', 'natal_pattern', 'flow_architecture', 'true_north'],
  },
};

// ─── Generation prompt ────────────────────────────────────────────────────────

function buildEsotericPrompt(
  fullName: string,
  birthDate: string,
  birthLocation: string | null,
  numerology: ReturnType<typeof buildNumerologyProfile>,
  nameSignature: string,
  chartData: Record<string, unknown> | null,
  sunSign: string,
): string {
  const chartSection = chartData
    ? `Full natal chart available:
Sun: ${chartData.sun_sign ?? sunSign}
Moon: ${chartData.moon_sign ?? 'unknown'}
Rising: ${chartData.rising_sign ?? 'unknown'}
Notable aspects: ${JSON.stringify(chartData.aspects ?? []).slice(0, 400)}`
    : `Natal chart not available. Sun sign from birth date: ${sunSign}${birthLocation ? ` | Born: ${birthLocation}` : ''}`;

  return `You are writing a Timeless Map — a deep reading of one person from three ancient layers: name etymology, numerology, and natal astrology. This maps what is static in them: the architecture beneath the surface story, the patterns that were there before any job, project, or season.

Your reader is curious and open but not steeped in esoteric traditions. Translate everything into plain language. No jargon, no "Life Path 7 people tend to..." — extract the actual insight and write it as an observation about this specific person.

## SUBJECT DATA

Name: ${fullName}
Birth date: ${birthDate}${birthLocation ? ` | ${birthLocation}` : ''}

## NAME ETYMOLOGY
${nameSignature || `(Name "${fullName}" not found in etymology database — use the sound, structure, and cultural context of the name itself.)`}

## NUMEROLOGY
Life Path ${numerology.lifePath}: ${numerology.lifePathMeaning}
Expression ${numerology.expression}: ${numerology.expressionMeaning}
Soul Urge ${numerology.soulUrge}: ${numerology.soulUrgeMeaning}
Personality ${numerology.personality}: ${numerology.personalityMeaning}
Birthday Number ${numerology.birthdayNumber}: ${numerology.birthdayMeaning}
${numerology.convergenceNote ? `Convergences and tensions: ${numerology.convergenceNote}` : ''}

## NATAL PATTERN
${chartSection}

## THE ARCHETYPE (write this last, even though it appears first)

Before finalizing, find the one place where all three layers point at the same structure — or where two of them pull against the third. That intersection is the archetype. Crown it with a bespoke 2-4 word title that no other person would receive: specific, earned, slightly surprising, instantly recognizable to the person as theirs. Test it: if the title could fit a thousand people, sharpen it until it fits one.

## TONE RULES
- Write in warm second person — "you", direct and close, like someone who has read the map and is telling you what they see.
- Do not mention numerology, astrology, or etymology as disciplines. Translate into plain observation.
- Direct, slightly literary, warmly precise. Not mystical, not vague, never flattering for its own sake.
- Flowing prose. No bullet points, no headers inside fields.
- Total length across all fields: ~420 words.`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  let body: {
    full_name: string;
    birth_date: string;
    birth_time?: string | null;
    birth_location?: string | null;
    birth_lat?: number | null;
    birth_lng?: number | null;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const { full_name, birth_date } = body;
  if (!full_name?.trim() || !birth_date) {
    return NextResponse.json({ success: false, error: 'full_name and birth_date are required' }, { status: 400 });
  }

  // Save intake
  const { data: intake, error: intakeError } = await supabase
    .from('esoteric_intakes')
    .insert({
      user_id: user.id,
      full_name: full_name.trim(),
      birth_date,
      birth_time: body.birth_time ?? null,
      birth_location: body.birth_location ?? null,
      birth_lat: body.birth_lat ?? null,
      birth_lng: body.birth_lng ?? null,
    })
    .select('id')
    .single();

  if (intakeError) {
    console.error('[esoteric] intake insert error:', intakeError);
    return NextResponse.json({ success: false, error: 'Failed to save intake' }, { status: 500 });
  }

  // Compute local data
  const numerology = buildNumerologyProfile(full_name.trim(), birth_date);
  const nameSignature = formatNameSignature(full_name.trim());
  const sunSign = getSunSignFromDate(birth_date);

  // Optional: fetch natal chart
  const chartData = await fetchChartData(
    birth_date,
    body.birth_time ?? null,
    body.birth_location ?? '',
    body.birth_lat ?? null,
    body.birth_lng ?? null,
  );

  // Build name data for storage
  const nameParts = full_name.trim().split(/\s+/);
  const nameData = {
    full: full_name.trim(),
    parts: nameParts.map(p => ({ name: p, etymology: getNameEtymology(p) })),
    signature: nameSignature,
  };

  // Generate via structured tool use
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = buildEsotericPrompt(
    full_name.trim(),
    birth_date,
    body.birth_location ?? null,
    numerology,
    nameSignature,
    chartData,
    sunSign,
  );

  let structured: StructuredMap | null = null;
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1100,
      tools: [MAP_TOOL],
      tool_choice: { type: 'tool', name: 'generate_timeless_map' },
      messages: [{ role: 'user', content: prompt }],
    });
    const toolBlock = message.content.find(b => b.type === 'tool_use');
    if (toolBlock?.type === 'tool_use') {
      structured = toolBlock.input as StructuredMap;
    }
  } catch (err) {
    console.error('[esoteric] Claude error:', err);
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 });
  }

  if (!structured?.archetype || !structured.flow_architecture) {
    return NextResponse.json({ success: false, error: 'Empty generation response' }, { status: 500 });
  }

  // Assembled markdown — fallback rendering + admin readability
  const profileText = [
    `# ${structured.archetype}`,
    `*${structured.epigraph}*`,
    `\n**NAME SIGNAL**\n${structured.name_signal}`,
    `\n**BIRTH CODE**\n${structured.birth_code}`,
    `\n**NATAL PATTERN**\n${structured.natal_pattern}`,
    `\n**FLOW ARCHITECTURE**\n${structured.flow_architecture}`,
    `\n**TRUE NORTH**\n${structured.true_north}`,
  ].join('\n');

  const profileJson = {
    archetype: structured.archetype,
    epigraph: structured.epigraph,
    sections: {
      name_signal: structured.name_signal,
      birth_code: structured.birth_code,
      natal_pattern: structured.natal_pattern,
      flow_architecture: structured.flow_architecture,
      true_north: structured.true_north,
    },
    sun_sign: sunSign,
    has_chart: !!chartData,
  };

  // Upsert — the Timeless Map is one-off; regenerating redraws it
  const { data: existing } = await supabase
    .from('esoteric_profiles')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  let profileId: string;

  if (existing?.id) {
    const { error } = await supabase
      .from('esoteric_profiles')
      .update({
        intake_id: intake.id,
        numerology_data: numerology,
        name_data: nameData,
        natal_data: chartData,
        profile_text: profileText,
        profile_json: profileJson,
        generated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    if (error) {
      console.error('[esoteric] profile update error:', error);
      return NextResponse.json({ success: false, error: 'Failed to save profile' }, { status: 500 });
    }
    profileId = existing.id;
  } else {
    const { data: newProfile, error } = await supabase
      .from('esoteric_profiles')
      .insert({
        user_id: user.id,
        intake_id: intake.id,
        numerology_data: numerology,
        name_data: nameData,
        natal_data: chartData,
        profile_text: profileText,
        profile_json: profileJson,
      })
      .select('id')
      .single();
    if (error || !newProfile) {
      console.error('[esoteric] profile insert error:', error);
      return NextResponse.json({ success: false, error: 'Failed to save profile' }, { status: 500 });
    }
    profileId = newProfile.id;
  }

  return NextResponse.json({
    success: true,
    profile: {
      id: profileId,
      profile_text: profileText,
      profile_json: profileJson,
      generated_at: new Date().toISOString(),
    },
  });
}
