import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import {
  type Pillar,
  type KeyId,
  KEY_CARDS,
  KEY_BY_ID,
  KEY_IDS,
  KEY_TECHNIQUES,
  PRESCRIBABLE_TOOLS,
  TOOL_BY_ID,
  TOOL_IDS,
  PILLAR_DOMAINS,
  IMAGE_DESCRIPTIONS,
  VOICE_RULES,
  PSYCHOLINGUISTIC_INSTRUCTIONS,
} from '@/data/flow-unlock-config';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * V5 intake answers — instinct prior + issue-anchored reflections.
 *
 * Phase 1 (rapid instinct — 3 questions, Dimension prior only):
 *   q1 = ShapePick shape → pillar vote (+2)
 *   q2 = WordStorm: 3 words from 16, each mapped to a pillar (+1.5 each)
 *   q3 = ImagePull: 2 image IDs from 8, each mapped to a pillar (+2 each)
 *
 * Phase 2 (issue-anchored reflections — 3 text questions):
 *   q4 = "What are you bringing today?" (the situation)
 *   q5 = "What have you already been trying?" (where the energy goes — overexposure probe)
 *   q6 = "What do you tell yourself when it stalls?" (the voice)
 */
interface FlowUnlockAnswers {
  q1?: Pillar;
  q2?: string[];
  q3?: string[];
  q4?: string;
  q5?: string;
  q6?: string;
}

interface AnswerMetadata {
  [key: string]: unknown;
}

interface PillarScores {
  self: number;
  space: number;
  story: number;
  spirit: number;
}

interface StructuredUnlock {
  bottleneck_key: KeyId;
  overexposed_keys: KeyId[];
  pattern_read: string[];
  the_tell: string;
  key_moves: { key: KeyId; move: string }[];
  technique: { name: string; prescription: string };
  recommended_tool: string;
  tool_prescription: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getUserFromRequest(request: NextRequest): Promise<{ id: string } | null> {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

// ─── Scoring maps (instinct prior — Dimension level) ──────────────────────────

const WORD_PILLAR: Record<string, Pillar> = {
  ALIVE: 'self', FOGGY: 'self', GROUNDED: 'self', SCATTERED: 'self',
  CLUTTERED: 'space', EQUIPPED: 'space', SQUEEZED: 'space', FLUID: 'space',
  DRIFTING: 'story', BUILDING: 'story', STUCK: 'story', FOCUSED: 'story',
  RESTLESS: 'spirit', IGNITED: 'spirit', HOLLOW: 'spirit', CALLED: 'spirit',
};

const IMAGE_PILLAR: Record<string, Pillar> = {
  pulse: 'self', open: 'self',
  setup: 'space', tangle: 'space',
  horizon: 'story', peak: 'story',
  flame: 'spirit', north: 'spirit',
};

function scorePillars(answers: FlowUnlockAnswers): PillarScores {
  const scores: PillarScores = { self: 0, space: 0, story: 0, spirit: 0 };
  if (answers.q1 && answers.q1 in scores) scores[answers.q1] += 2;
  if (answers.q2?.length) {
    for (const word of answers.q2) {
      const pillar = WORD_PILLAR[word.toUpperCase()];
      if (pillar) scores[pillar] += 1.5;
    }
  }
  if (answers.q3?.length) {
    for (const id of answers.q3) {
      const pillar = IMAGE_PILLAR[id];
      if (pillar) scores[pillar] += 2;
    }
  }
  return scores;
}

// ─── Daily limit ──────────────────────────────────────────────────────────────

function localDay(iso: string | Date, timeZone: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-CA', { timeZone });
  } catch {
    return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'UTC' });
  }
}

// ─── Structured output tool ───────────────────────────────────────────────────

const KEY_ENUM = KEY_IDS as string[];

const UNLOCK_TOOL: Anthropic.Tool = {
  name: 'generate_flow_unlock',
  description: 'Output the structured Flow Unlock diagnosis as JSON',
  input_schema: {
    type: 'object' as const,
    properties: {
      bottleneck_key: {
        type: 'string',
        enum: KEY_ENUM,
        description: 'The single starved key that, if turned, would most change this situation.',
      },
      overexposed_keys: {
        type: 'array',
        items: { type: 'string', enum: KEY_ENUM },
        minItems: 1,
        maxItems: 2,
        description: '1-2 keys this person keeps pulling — where their effort already goes, read from "where the energy goes" and the exposure map.',
      },
      pattern_read: {
        type: 'array',
        items: { type: 'string' },
        minItems: 2,
        maxItems: 2,
        description: '2 bullets, one sentence each: the over/under shape of this pattern in plain language. First bullet names where the effort keeps going; second names what that effort is substituting for.',
      },
      the_tell: {
        type: 'string',
        description: '2-3 sentences naming the specific cross-pattern or inversion you read. The insight they couldn\'t see themselves — name the structure, not the surface, in plain body-grounded language.',
      },
      key_moves: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            key: { type: 'string', enum: KEY_ENUM },
            move: { type: 'string', description: 'Maximum 2 sentences, doable today. For an overexposed key: how to ease off or redirect that effort. For the bottleneck key: the concrete move that opens it — specific to this person and this situation.' },
          },
          required: ['key', 'move'],
        },
        description: 'One entry per named key (each overexposed key + the bottleneck key). Each move must be doable today.',
      },
      technique: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Exact technique name from the menu, chosen for the bottleneck key' },
          prescription: { type: 'string', description: '1 sentence: what to do and why for this person specifically' },
        },
        required: ['name', 'prescription'],
        description: 'Exactly one technique from the bottleneck key\'s menu.',
      },
      recommended_tool: {
        type: 'string',
        enum: [...TOOL_IDS, 'none'],
        description: 'The practice tool whose purpose exactly matches this person\'s need, or "none". Default to "none" unless one tool is a clear, specific fit — most unlocks need no tool.',
      },
      tool_prescription: {
        type: 'string',
        description: '1 sentence: why the recommended tool fits this person\'s specific pattern — reference something concrete from what they shared. Only when recommended_tool is not "none".',
      },
    },
    required: ['bottleneck_key', 'overexposed_keys', 'pattern_read', 'the_tell', 'key_moves', 'technique', 'recommended_tool'],
  },
};

// ─── Prompt ───────────────────────────────────────────────────────────────────

const DIMENSION_LABELS: Record<Pillar, string> = {
  self: 'SELF — body, emotions, and mental state',
  space: 'SPACE — environment, tools, and feedback',
  story: 'STORY — direction, mission, and role',
  spirit: 'SPIRIT — values, curiosity, and vision',
};

function buildKeyCardsSection(): string {
  const byDimension: Record<Pillar, string[]> = { self: [], space: [], story: [], spirit: [] };
  for (const card of KEY_CARDS) {
    byDimension[card.dimension].push(
      `• ${card.name} [${card.id}] — governs ${card.governs}\n  overexposed: ${card.overexposed}\n  starved: ${card.starved}`,
    );
  }
  return (Object.keys(byDimension) as Pillar[])
    .map(d => `${DIMENSION_LABELS[d]}\n${byDimension[d].join('\n')}`)
    .join('\n\n');
}

function buildTechniqueMenu(): string {
  return KEY_IDS
    .map(id => {
      const lines = KEY_TECHNIQUES[id].map(t => `  - ${t.title}: ${t.description}`).join('\n');
      return `[${id}]\n${lines}`;
    })
    .join('\n');
}

function buildToolMenu(): string {
  return PRESCRIBABLE_TOOLS
    .map(t => `- ${t.title}: prescribe when ${t.prescribeWhen}`)
    .join('\n');
}

function buildPrompt(answers: FlowUnlockAnswers, scores: PillarScores): string {
  const wordSignals = answers.q2?.length
    ? answers.q2.map(w => {
        const pillar = WORD_PILLAR[w.toUpperCase()];
        return pillar ? `${w} (${PILLAR_DOMAINS[pillar].split(',')[0].trim()})` : w;
      }).join(', ')
    : null;

  const imageSignals = answers.q3?.length
    ? answers.q3.map(id => IMAGE_DESCRIPTIONS[id] ?? id).join('; ')
    : null;

  const instinctSignals = [
    answers.q1 && `- Shape instinct: ${PILLAR_DOMAINS[answers.q1]}`,
    wordSignals && `- Words chosen: ${wordSignals}`,
    imageSignals && `- Images chosen: ${imageSignals}`,
  ].filter(Boolean).join('\n');

  const situation = answers.q4 ? `\n## THE SITUATION (what they're bringing today)\n"${answers.q4}"` : '';
  const energy = answers.q5 ? `\n## WHERE THE ENERGY GOES (what they've been trying)\n"${answers.q5}"` : '';
  const voice = answers.q6 ? `\n## THE VOICE (what they tell themselves when it stalls)\n"${answers.q6}"` : '';

  return `You are generating a Flow Unlock — a key-level diagnostic of what's blocking someone on the specific issue they brought today. Not a personality profile: a read of THIS situation's pattern, and the move that breaks it.

The framework: twelve keys, three per dimension. People get stuck in a recognizable shape — they keep pulling 1-2 keys (overexposed: effort flows there by habit) while the key the situation actually needs sits starved. Your job: name that shape and the unlock.

## THE 12 KEYS (diagnostic vocabulary)

${buildKeyCardsSection()}

## INSTINCT PRIOR (weak signal — confirm or override from the text)
Dimension scores from rapid-instinct questions:
- self: ${scores.self} | space: ${scores.space} | story: ${scores.story} | spirit: ${scores.spirit}
${instinctSignals}
${situation}
${energy}
${voice}

## YOUR TASK: CROSS-PATTERN ANALYSIS

${PSYCHOLINGUISTIC_INSTRUCTIONS}

## TECHNIQUE MENU (choose exactly one, from the bottleneck key's list)

${buildTechniqueMenu()}

## PRACTICE TOOL (optional — recommend one only on a clear, specific match)
Recommend a tool ONLY if this person's situation clearly matches one tool's purpose below. Most unlocks need no tool — the moves and the technique are the prescription. Default recommended_tool to "none". Never invent a fit to fill the slot, and never recommend browsing a library or reference. When you do recommend one, write tool_prescription as one sentence tied to something concrete they shared.

${buildToolMenu()}

## VOICE RULES (non-negotiable)

${VOICE_RULES}`;
}

// ─── Validation / fallbacks ───────────────────────────────────────────────────

function isKeyId(v: unknown): v is KeyId {
  return typeof v === 'string' && (KEY_IDS as string[]).includes(v);
}

function lowestDimension(scores: PillarScores): Pillar {
  const entries = Object.entries(scores) as [Pillar, number][];
  entries.sort((a, b) => a[1] - b[1]);
  return entries[0][0];
}

function sanitizeStructured(raw: StructuredUnlock, scores: PillarScores): StructuredUnlock {
  const bottleneck: KeyId = isKeyId(raw.bottleneck_key)
    ? raw.bottleneck_key
    : KEY_CARDS.find(k => k.dimension === lowestDimension(scores))!.id;

  const overexposed = (Array.isArray(raw.overexposed_keys) ? raw.overexposed_keys : [])
    .filter(isKeyId)
    .filter(k => k !== bottleneck)
    .slice(0, 2);

  const namedKeys: KeyId[] = [...overexposed, bottleneck];
  const rawMoves = Array.isArray(raw.key_moves) ? raw.key_moves : [];
  const key_moves = namedKeys.map(key => {
    const found = rawMoves.find(m => m?.key === key && typeof m.move === 'string' && m.move.trim());
    return { key, move: found?.move ?? KEY_BY_ID[key].nextStep };
  });

  const menu = KEY_TECHNIQUES[bottleneck];
  const matched = menu.find(t => t.title === raw.technique?.name)
    ?? menu.find(t => t.title.toLowerCase() === raw.technique?.name?.toLowerCase());
  const technique = matched
    ? { name: matched.title, prescription: raw.technique?.prescription?.trim() || matched.description }
    : { name: menu[0].title, prescription: menu[0].description };

  const recommended_tool = typeof raw.recommended_tool === 'string' && raw.recommended_tool in TOOL_BY_ID
    ? raw.recommended_tool
    : 'none';
  const tool_prescription = recommended_tool === 'none'
    ? ''
    : (typeof raw.tool_prescription === 'string' ? raw.tool_prescription : '');

  return {
    bottleneck_key: bottleneck,
    overexposed_keys: overexposed,
    pattern_read: (Array.isArray(raw.pattern_read) ? raw.pattern_read : []).filter(b => typeof b === 'string').slice(0, 2),
    the_tell: typeof raw.the_tell === 'string' ? raw.the_tell : '',
    key_moves,
    technique,
    recommended_tool,
    tool_prescription,
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  let body: { answers: FlowUnlockAnswers; answer_metadata?: AnswerMetadata; timezone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const { answers, answer_metadata } = body;
  if (!answers || typeof answers !== 'object') {
    return NextResponse.json({ success: false, error: 'answers required' }, { status: 400 });
  }

  const timeZone = typeof body.timezone === 'string' && body.timezone ? body.timezone : 'UTC';

  // ── 1/day guard: one unlock per local calendar day ──
  const { data: latest } = await supabase
    .from('flow_lens_profiles')
    .select('id, gravity_pillar, blind_side_pillar, profile_text, profile_json, recommendations, generated_at')
    .eq('user_id', user.id)
    .order('generated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latest && localDay(latest.generated_at, timeZone) === localDay(new Date(), timeZone)) {
    return NextResponse.json(
      { success: false, error: 'daily_limit', profile: latest },
      { status: 429 },
    );
  }

  const scores = scorePillars(answers);

  const intakePayload: Record<string, unknown> = { user_id: user.id, answers, pillar_scores: scores };
  if (answer_metadata) intakePayload.answer_metadata = answer_metadata;

  const { data: intake, error: intakeError } = await supabase
    .from('flow_lens_intakes')
    .insert(intakePayload)
    .select('id')
    .single();

  if (intakeError) {
    console.error('[flow-lens] intake insert error:', intakeError);
    return NextResponse.json({ success: false, error: 'Failed to save intake' }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = buildPrompt(answers, scores);

  let structured: StructuredUnlock | null = null;
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      tools: [UNLOCK_TOOL],
      tool_choice: { type: 'tool', name: 'generate_flow_unlock' },
      messages: [{ role: 'user', content: prompt }],
    });
    const toolBlock = message.content.find(b => b.type === 'tool_use');
    if (toolBlock?.type === 'tool_use') {
      structured = sanitizeStructured(toolBlock.input as StructuredUnlock, scores);
    }
  } catch (err) {
    console.error('[flow-lens] Claude error:', err);
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 });
  }

  if (!structured) {
    return NextResponse.json({ success: false, error: 'Empty generation response' }, { status: 500 });
  }

  const bottleneckCard = KEY_BY_ID[structured.bottleneck_key];
  const bottleneckDimension = bottleneckCard.dimension;
  const tool = structured.recommended_tool !== 'none'
    ? TOOL_BY_ID[structured.recommended_tool] ?? null
    : null;
  const techniqueEntry = KEY_TECHNIQUES[structured.bottleneck_key]
    .find(t => t.title === structured.technique.name);

  // Gravity = dimension of the strongest overexposed key (or highest instinct score).
  const gravityDimension: Pillar = structured.overexposed_keys.length
    ? KEY_BY_ID[structured.overexposed_keys[0]].dimension
    : (Object.entries(scores) as [Pillar, number][]).sort((a, b) => b[1] - a[1])[0][0];

  const recommendations = [
    { type: 'technique' as const, title: structured.technique.name, pillar: bottleneckDimension, path: techniqueEntry?.path },
    ...(tool ? [{ type: 'tool' as const, title: tool.title, pillar: bottleneckDimension, route: tool.route }] : []),
  ];

  const profileJson = {
    version: 5,
    bottleneck_key: structured.bottleneck_key,
    overexposed_keys: structured.overexposed_keys,
    pillar_scores: scores,
    pattern_read: structured.pattern_read,
    the_tell: structured.the_tell,
    key_moves: structured.key_moves,
    technique: structured.technique,
    recommended_tool: structured.recommended_tool,
    tool_prescription: structured.tool_prescription,
    situation: answers.q4 ?? null,
  };

  const MODEL = 'claude-sonnet-4-6';

  // History: every unlock is a new row.
  const { data: newProfile, error } = await supabase
    .from('flow_lens_profiles')
    .insert({
      user_id: user.id, intake_id: intake.id,
      gravity_pillar: gravityDimension, blind_side_pillar: bottleneckDimension,
      profile_text: JSON.stringify(structured), profile_json: profileJson,
      recommendations, model: MODEL,
    })
    .select('id, generated_at')
    .single();

  if (error || !newProfile) {
    console.error('[flow-lens] profile insert error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save profile' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    profile: {
      id: newProfile.id, gravity_pillar: gravityDimension, blind_side_pillar: bottleneckDimension,
      profile_text: JSON.stringify(structured), profile_json: profileJson,
      recommendations, generated_at: newProfile.generated_at ?? new Date().toISOString(),
    },
  });
}
