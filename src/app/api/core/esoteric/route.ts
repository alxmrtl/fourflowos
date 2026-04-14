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

  return `You are writing a deep reading of a person based on their name etymology, numerology, and natal astrology. This is the "Ancestral Signal" — an assessment of the ancient architecture beneath a person's surface story.

Your audience: someone who is curious and open but not steeped in esoteric traditions. Translate everything into plain language. No jargon. No "Life Path 7 people tend to..." — instead, extract the actual insight and write it as an observation about this specific person.

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

## OUTPUT FORMAT

Write in four sections using these exact headers:

**NAME SIGNAL**
[2–3 sentences. What is encoded in this name? Not the etymological facts — the character the name points to. What is this person carrying in their name that they may not have fully recognized yet?]

**BIRTH CODE**
[2–3 sentences. What is the core life orientation from the numerological signature? Focus on the intersection of life path and soul urge — what they're here to do vs. what they privately crave. Name any significant convergence or tension.]

**NATAL PATTERN**
[2–3 sentences. What is the key signature from the birth chart? If only sun sign is available, focus on the elemental and directional quality of that sign. What is the central archetypal theme? Translate completely — no sign names in the text unless they help the reader locate themselves.]

**FLOW ARCHITECTURE**
[1 paragraph. Name the single most consistent structural fact about how this person is built — something that holds across their name, birth code, and natal pattern, even when those layers describe it differently. Not a summary. Not a list. One observation that, once named, makes the other details feel like evidence of it. If the three layers tell contradictory stories, name the tension — that is the architecture. Do not produce generic flow-open/flow-close statements.]

## TONE RULES
- Do not mention numerology, astrology, or etymology as disciplines. Translate into plain observation.
- No "people with this configuration..." — write directly to the person, but not as "you."
- Direct, slightly literary, warmly precise. Not mystical or vague.
- No bullet points. Flowing prose throughout.
- Total length: ~350 words.`;
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

  // Generate via Claude Haiku
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

  let profileText = '';
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 900,
      messages: [{ role: 'user', content: prompt }],
    });
    profileText = message.content[0].type === 'text' ? message.content[0].text : '';
  } catch (err) {
    console.error('[esoteric] Claude error:', err);
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 });
  }

  if (!profileText) {
    return NextResponse.json({ success: false, error: 'Empty generation response' }, { status: 500 });
  }

  // Parse sections
  const profileJson = {
    sections: parseEsotericSections(profileText),
    sun_sign: sunSign,
    has_chart: !!chartData,
  };

  // Upsert — replace previous esoteric profile for this user
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

function parseEsotericSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const patterns = [
    { key: 'name_signal', pattern: /\*\*NAME SIGNAL\*\*\s*([\s\S]*?)(?=\*\*BIRTH CODE|\*\*NATAL PATTERN|\*\*FLOW ARCHITECTURE|$)/i },
    { key: 'birth_code', pattern: /\*\*BIRTH CODE\*\*\s*([\s\S]*?)(?=\*\*NATAL PATTERN|\*\*FLOW ARCHITECTURE|$)/i },
    { key: 'natal_pattern', pattern: /\*\*NATAL PATTERN\*\*\s*([\s\S]*?)(?=\*\*FLOW ARCHITECTURE|$)/i },
    { key: 'flow_architecture', pattern: /\*\*FLOW ARCHITECTURE\*\*\s*([\s\S]*?)$/i },
  ];
  for (const { key, pattern } of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) sections[key] = match[1].trim();
  }
  return sections;
}
