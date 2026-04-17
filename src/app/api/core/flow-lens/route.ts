import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import {
  type Pillar,
  PILLAR_TECHNIQUES,
  PILLAR_CONCEPTS,
  PRACTICE_TOOLS,
  PILLAR_DOMAINS,
  IMAGE_DESCRIPTIONS,
  VOICE_RULES,
  PSYCHOLINGUISTIC_INSTRUCTIONS,
} from '@/data/flow-unlock-config';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * V4 intake answers — trimmed instinct, deep signal.
 *
 * Phase 1 (rapid instinct — 4 questions):
 *   q1  = ShapePick shape → pillar vote (+2)
 *   q2  = WordStorm: 3 words from 16, each mapped to a pillar (+1.5 each)
 *   q3  = ImagePull: 2 image IDs from 8, each mapped to a pillar (+2 each)
 *   q4  = Domain context string (no pillar score — used in prompt)
 *
 * Phase 2 (open signal — 4 text questions):
 *   q5  = "What's getting in the way of your best work right now?"
 *   q6  = "Describe the last time you were fully in it."
 *   q7  = "What do you tell yourself when you can't get started?"
 *   q8  = "What are you actually chasing right now?"
 */
interface FlowLensAnswers {
  q1?: Pillar;
  q2?: string[];
  q3?: string[];
  q4?: string;
  q5?: string;
  q6?: string;
  q7?: string;
  q8?: string;
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

interface StructuredProfile {
  gravity_bullets: string[];
  blind_side_bullets: string[];
  the_tell: string;
  the_move: string;
  tool_prescription: string;
  technique_prescriptions: { name: string; prescription: string }[];
  concept_prescription: { name: string; why: string };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getUserFromRequest(request: NextRequest): Promise<{ id: string } | null> {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

// ─── Scoring maps ─────────────────────────────────────────────────────────────

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

function scorePillars(answers: FlowLensAnswers): PillarScores {
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

function deriveGravityAndBlindSide(scores: PillarScores): { gravity: Pillar; blindSide: Pillar } {
  const entries = Object.entries(scores) as [Pillar, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return { gravity: entries[0][0], blindSide: entries[entries.length - 1][0] };
}

// ─── Recommendations ──────────────────────────────────────────────────────────

interface Recommendation {
  type: 'technique' | 'tool';
  title: string;
  pillar: string;
  path?: string;
  route?: string;
}

function getRecommendations(blindSide: Pillar): Recommendation[] {
  const techniques = PILLAR_TECHNIQUES[blindSide].slice(0, 3);
  const tool = PRACTICE_TOOLS[blindSide];
  return [
    ...techniques.map(t => ({ type: 'technique' as const, title: t.title, pillar: blindSide, path: t.path })),
    { type: 'tool' as const, title: tool.title, pillar: blindSide, route: tool.route },
  ];
}

// ─── Structured output tool ───────────────────────────────────────────────────

const PROFILE_TOOL: Anthropic.Tool = {
  name: 'generate_flow_unlock',
  description: 'Output the structured Flow Unlock profile as JSON',
  input_schema: {
    type: 'object' as const,
    properties: {
      gravity_bullets: {
        type: 'array',
        description: '3 bullets about how this person is wired — written from cross-pattern analysis, not from what they literally said. Subject "You". One sentence each.',
        items: { type: 'string' },
        minItems: 3,
        maxItems: 3,
      },
      blind_side_bullets: {
        type: 'array',
        description: '3 bullets naming the structural tendency that creates drag — honest, unsparing, specific to this person\'s pattern. One sentence each.',
        items: { type: 'string' },
        minItems: 3,
        maxItems: 3,
      },
      the_tell: {
        type: 'string',
        description: '2-3 sentences naming the specific cross-pattern or inversion you read. This is the insight they couldn\'t see themselves — name the structure, not the surface. Use signal language.',
      },
      the_move: {
        type: 'string',
        description: '2 sentences. First: how their gravity is substituting for what the blind side would provide. Second: the one concrete move that activates both. Must be specific to this person.',
      },
      tool_prescription: {
        type: 'string',
        description: '1 sentence: why this specific tool for this specific person — reference something concrete from their signal, not the tool description.',
      },
      technique_prescriptions: {
        type: 'array',
        description: '3 items, one per technique. Each: what to do and why for this specific person.',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Exact technique name as provided' },
            prescription: { type: 'string', description: '1 sentence: what to do and why for this person specifically' },
          },
          required: ['name', 'prescription'],
        },
        minItems: 3,
        maxItems: 3,
      },
      concept_prescription: {
        type: 'object',
        description: 'One concept worth sitting with — name it and explain why it\'s relevant to this person\'s specific pattern in one sentence.',
        properties: {
          name: { type: 'string', description: 'Exact concept name as provided' },
          why: { type: 'string', description: '1 sentence: why this concept for this person\'s specific pattern' },
        },
        required: ['name', 'why'],
      },
    },
    required: ['gravity_bullets', 'blind_side_bullets', 'the_tell', 'the_move', 'tool_prescription', 'technique_prescriptions', 'concept_prescription'],
  },
};

// ─── Prompt ───────────────────────────────────────────────────────────────────

function buildPrompt(
  answers: FlowLensAnswers,
  scores: PillarScores,
  gravity: Pillar,
  blindSide: Pillar,
  recommendations: Recommendation[],
): string {
  const techniques = recommendations.filter(r => r.type === 'technique');
  const toolRec    = recommendations.find(r => r.type === 'tool');
  const domain     = answers.q4 ?? 'general';
  const concept    = PILLAR_CONCEPTS[blindSide];

  const techList = techniques
    .map(r => `• ${r.title}: ${PILLAR_TECHNIQUES[blindSide].find(t => t.title === r.title)?.description ?? ''}`)
    .join('\n');

  const wordSignals = answers.q2?.length
    ? answers.q2.map(w => {
        const pillar = WORD_PILLAR[w.toUpperCase()];
        return pillar ? `${w} (${PILLAR_DOMAINS[pillar].split(',')[0].trim()})` : w;
      }).join(', ')
    : null;

  const imageSignals = answers.q3?.length
    ? answers.q3.map(id => IMAGE_DESCRIPTIONS[id] ?? id).join('; ')
    : null;

  const scoredSignals = [
    answers.q1  && `- Shape instinct: ${PILLAR_DOMAINS[answers.q1]}`,
    wordSignals  && `- Words chosen: ${wordSignals}`,
    imageSignals && `- Images chosen: ${imageSignals}`,
  ].filter(Boolean).join('\n');

  const blockingSignal  = answers.q5 ? `\n## SIGNAL: WHAT'S BLOCKING\n"${answers.q5}"` : '';
  const flowSignal      = answers.q6 ? `\n## SIGNAL: LAST FLOW STATE\n"${answers.q6}"` : '';
  const monologueSignal = answers.q7 ? `\n## SIGNAL: INTERNAL MONOLOGUE\n"${answers.q7}"` : '';
  const chasingSignal   = answers.q8 ? `\n## SIGNAL: WHAT THEY'RE CHASING\n"${answers.q8}"` : '';

  return `You are generating a Flow Unlock for someone in "${domain}" who is currently stuck.

This is not a personality profile — it's a diagnostic read of what's blocking them right now, and the specific move that breaks it.

## PILLAR SCORES (instinct signals)
- Body/emotions/mind (self): ${scores.self}
- Environment/tools (space): ${scores.space}
- Direction/goals (story): ${scores.story}
- Values/purpose (spirit): ${scores.spirit}

Gravity (highest): ${gravity.toUpperCase()} — ${PILLAR_DOMAINS[gravity]}
Blind side (lowest): ${blindSide.toUpperCase()} — ${PILLAR_DOMAINS[blindSide]}

## INSTINCT SIGNALS
${scoredSignals}
${blockingSignal}
${flowSignal}
${monologueSignal}
${chasingSignal}

## YOUR TASK: PSYCHOLINGUISTIC CROSS-PATTERN ANALYSIS

${PSYCHOLINGUISTIC_INSTRUCTIONS}

## PRACTICES TO RECOMMEND (for their ${blindSide.toUpperCase()} blind side)

Techniques:
${techList}

Concept to prescribe:
${concept.name} — the science of ${concept.domain}

## PRACTICE TOOL
${toolRec ? `${toolRec.title} — ${PRACTICE_TOOLS[blindSide].description}` : ''}
Write one sentence explaining why it fits THIS person's specific pattern. Reference something concrete from their signals.

## VOICE RULES (non-negotiable)

${VOICE_RULES}`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  let body: { answers: FlowLensAnswers; answer_metadata?: AnswerMetadata };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const { answers, answer_metadata } = body;
  if (!answers || typeof answers !== 'object') {
    return NextResponse.json({ success: false, error: 'answers required' }, { status: 400 });
  }

  const scores   = scorePillars(answers);
  const { gravity, blindSide } = deriveGravityAndBlindSide(scores);
  const recommendations = getRecommendations(blindSide);

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
  const prompt    = buildPrompt(answers, scores, gravity, blindSide, recommendations);

  let structured: StructuredProfile | null = null;
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      tools: [PROFILE_TOOL],
      tool_choice: { type: 'tool', name: 'generate_flow_unlock' },
      messages: [{ role: 'user', content: prompt }],
    });
    const toolBlock = message.content.find(b => b.type === 'tool_use');
    if (toolBlock?.type === 'tool_use') {
      structured = toolBlock.input as StructuredProfile;
    }
  } catch (err) {
    console.error('[flow-lens] Claude error:', err);
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 });
  }

  if (!structured) {
    return NextResponse.json({ success: false, error: 'Empty generation response' }, { status: 500 });
  }

  const profileJson = {
    gravity, blind_side: blindSide, pillar_scores: scores,
    gravity_bullets:         structured.gravity_bullets,
    blind_side_bullets:      structured.blind_side_bullets,
    the_tell:                structured.the_tell,
    the_move:                structured.the_move,
    tool_prescription:       structured.tool_prescription,
    technique_prescriptions: structured.technique_prescriptions,
    concept_prescription:    structured.concept_prescription,
  };

  const { data: existing } = await supabase
    .from('flow_lens_profiles')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  const MODEL = 'claude-sonnet-4-6';
  let profileId: string;

  if (existing?.id) {
    const { error } = await supabase
      .from('flow_lens_profiles')
      .update({
        intake_id: intake.id, gravity_pillar: gravity, blind_side_pillar: blindSide,
        profile_text: JSON.stringify(structured), profile_json: profileJson,
        recommendations, model: MODEL, generated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    if (error) {
      console.error('[flow-lens] profile update error:', error);
      return NextResponse.json({ success: false, error: 'Failed to save profile' }, { status: 500 });
    }
    profileId = existing.id;
  } else {
    const { data: newProfile, error } = await supabase
      .from('flow_lens_profiles')
      .insert({
        user_id: user.id, intake_id: intake.id,
        gravity_pillar: gravity, blind_side_pillar: blindSide,
        profile_text: JSON.stringify(structured), profile_json: profileJson,
        recommendations, model: MODEL,
      })
      .select('id')
      .single();
    if (error || !newProfile) {
      console.error('[flow-lens] profile insert error:', error);
      return NextResponse.json({ success: false, error: 'Failed to save profile' }, { status: 500 });
    }
    profileId = newProfile.id;
  }

  return NextResponse.json({
    success: true,
    profile: {
      id: profileId, gravity_pillar: gravity, blind_side_pillar: blindSide,
      profile_text: JSON.stringify(structured), profile_json: profileJson,
      recommendations, generated_at: new Date().toISOString(),
    },
  });
}
