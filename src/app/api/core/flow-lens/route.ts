import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ─── Types ────────────────────────────────────────────────────────────────────

type Pillar = 'self' | 'space' | 'story' | 'spirit';

/**
 * V2 intake answers — visual-first, instinct-driven format.
 *
 * Phase 1 (rapid instinct):
 *   q1  = BigPair orientation vote ('inward' | 'forward') — qualitative
 *   q2  = ShapePick shape → pillar vote (+2)
 *   q3  = BigPair state texture ('sharp' | 'loose') — qualitative
 *   q4  = ThreeWayTap obstacle ('state'|'setup'|'direction') → pillar vote (+2)
 *   q5  = PairOff tournament winner → dominant pillar (+3)
 *   q6  = WordCloud selected words — qualitative, for Claude context
 *
 * Phase 2 (depth check):
 *   q7  = Slider 0–1, SELF body-awareness depth
 *   q8  = TwoTapPair { clearest, haziest } story item IDs — STORY depth
 *   q9  = Slider 0–1, SPACE environment depth (0=friction, 1=clear)
 *   q10 = PlainChoice a/b/c/d — SPIRIT depth
 *   q11 = Domain context string (no pillar score)
 */
interface FlowLensAnswers {
  // Phase 1
  q1?: 'inward' | 'forward';
  q2?: Pillar;
  q3?: 'sharp' | 'loose';
  q4?: 'state' | 'setup' | 'direction';
  q5?: Pillar;
  q6?: string[];

  // Phase 2
  q7?: number;
  q8?: { clearest: string; haziest: string };
  q9?: number;
  q10?: 'a' | 'b' | 'c' | 'd';
  q11?: string;
}

// AnswerMetadata kept minimal — timing not captured in V2 (qualitative signals suffice)
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
  the_move: string;
  tool_prescription: string;
  technique_prescriptions: { name: string; prescription: string }[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getUserFromRequest(request: NextRequest): Promise<{ id: string } | null> {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

/** Map slider 0–1 to depth score 0–2 */
function sliderToDepth(value: number): number {
  if (value > 0.66) return 2;
  if (value > 0.33) return 1;
  return 0;
}

const SPIRIT_DEPTH: Record<string, number> = { a: 2, b: 1, c: 0, d: 0 };

/**
 * Map ThreeWayTap obstacle answer to the pillar it votes for.
 * 'direction' → STORY, 'state' → SELF, 'setup' → SPACE
 * SPIRIT is intentionally absent from this question — its absence is meaningful.
 */
const OBSTACLE_PILLAR: Record<string, Pillar> = {
  state:     'self',
  setup:     'space',
  direction: 'story',
};

/**
 * Derive STORY depth from TwoTapPair result.
 * Clearest item signals how far up the story stack they operate.
 * Haziest = 'purpose' applies a penalty (no long-term frame).
 */
function storyDepthFromTwoTap(result: { clearest: string; haziest: string }): number {
  const byClarity: Record<string, number> = { purpose: 2, mission: 2, goal: 1, task: 0 };
  const base = byClarity[result.clearest] ?? 1;
  const penalty = result.haziest === 'purpose' ? 1 : 0;
  return Math.max(0, base - penalty);
}

function scorePillars(answers: FlowLensAnswers): PillarScores {
  const scores: PillarScores = { self: 0, space: 0, story: 0, spirit: 0 };

  // q2: ShapePick — direct pillar vote (+2)
  if (answers.q2 && answers.q2 in scores) scores[answers.q2] += 2;

  // q4: ThreeWayTap obstacle — pillar vote (+2); SPIRIT absent here by design
  if (answers.q4) {
    const pillar = OBSTACLE_PILLAR[answers.q4];
    if (pillar) scores[pillar] += 2;
  }

  // q5: PairOff tournament winner — strongest signal, weighted +3
  if (answers.q5 && answers.q5 in scores) scores[answers.q5] += 3;

  // q7: SELF slider depth (0–2)
  scores.self   += answers.q7 != null ? sliderToDepth(answers.q7) : 1;

  // q8: TwoTapPair STORY depth (0–2)
  scores.story  += answers.q8 ? storyDepthFromTwoTap(answers.q8) : 1;

  // q9: SPACE slider depth (0–2); left=friction=0, right=clear=1
  scores.space  += answers.q9 != null ? sliderToDepth(answers.q9) : 1;

  // q10: SPIRIT PlainChoice depth (0–2)
  scores.spirit += SPIRIT_DEPTH[answers.q10 ?? ''] ?? 1;

  return scores;
}

function deriveGravityAndBlindSide(scores: PillarScores): { gravity: Pillar; blindSide: Pillar } {
  const entries = Object.entries(scores) as [Pillar, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return {
    gravity: entries[0][0],
    blindSide: entries[entries.length - 1][0],
  };
}

// ─── Recommendations ──────────────────────────────────────────────────────────

interface Recommendation {
  type: 'technique' | 'tool';
  title: string;
  pillar: string;
  path?: string;
}

const PILLAR_TECHNIQUES: Record<Pillar, { title: string; path: string; description: string }[]> = {
  self: [
    { title: 'Movement Primer', path: 'compendium/framework/SELF/Focused-Body/_techniques/movement-primer.md', description: 'Brief physical activation before cognitive work' },
    { title: 'Body State Check', path: 'compendium/framework/SELF/Focused-Body/_techniques/body-state-check.md', description: 'Rapid somatic scan to calibrate before working' },
    { title: 'Observer Redirect', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/observer-redirect.md', description: 'Detach from reactive patterns and redirect energy' },
    { title: 'Breath Regulation', path: 'compendium/framework/SELF/Focused-Body/_techniques/breath-regulation.md', description: 'Nervous system reset via deliberate breathing' },
    { title: 'Pre-Session Clearance', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/pre-session-clearance.md', description: 'Release emotional residue before entering flow work' },
  ],
  space: [
    { title: 'Signal vs Noise Filter', path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/signal-vs-noise-filter.md', description: 'Audit which inputs actually inform action' },
    { title: 'Micro-Review Loop', path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/micro-review-loop.md', description: 'Short feedback cycles that close gaps fast' },
    { title: 'Compression Over Expansion', path: 'compendium/framework/SELF/Open-Mind/_techniques/compression-over-expansion.md', description: 'Narrow scope to amplify signal' },
    { title: 'Overchoice Elimination', path: 'compendium/framework/SELF/Open-Mind/_techniques/overchoice-elimination.md', description: 'Remove decision points that fragment attention' },
    { title: 'Streak Architecture', path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/streak-architecture.md', description: 'Make progress visible so momentum compounds' },
  ],
  story: [
    { title: 'Sub-Goal Decomposition', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/sub-goal-decomposition.md', description: 'Break distant targets into near-term wins' },
    { title: 'Clarity Over Intensity', path: 'compendium/framework/SELF/Open-Mind/_techniques/clarity-over-intensity.md', description: 'Precision of aim before force of effort' },
    { title: 'Open Loop Closure', path: 'compendium/framework/SELF/Open-Mind/_techniques/open-loop-closure.md', description: 'Close incomplete tasks that drain cognitive background' },
    { title: 'DMN-Goal Engagement', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/dmn-goal-engagement.md', description: 'Use default mode network for goal consolidation' },
    { title: 'Transition Ritual', path: 'compendium/framework/SELF/Open-Mind/_techniques/transition-ritual.md', description: 'Bridge between modes — signal to the brain what comes next' },
  ],
  spirit: [
    { title: 'Flow Channel Formula', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/flow-channel-formula.md', description: 'Calibrate challenge-skill balance for genuine pull' },
    { title: 'Pattern Literacy', path: 'compendium/framework/SELF/Open-Mind/_techniques/pattern-literacy.md', description: 'Read recurring themes in your work and energy' },
    { title: 'Progress Ledger', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/progress-ledger.md', description: 'Track invisible effort to keep motivation signal clean' },
    { title: 'Micro-Completion Architecture', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/micro-completion-architecture.md', description: 'Design work so small wins are structurally guaranteed' },
    { title: 'Ambiguity Control', path: 'compendium/framework/SELF/Open-Mind/_techniques/ambiguity-control.md', description: 'Define what is known so the unknown stops leaking energy' },
  ],
};

const PRACTICE_TOOLS: Record<Pillar, { title: string; description: string }> = {
  self:   { title: 'FlowZone',  description: 'Deep work timer — makes each focus rep directional, channels body awareness into deliberate sessions' },
  space:  { title: 'FlowRead',  description: 'Speed reading trainer — builds sustained attention and feedback density through deliberate practice' },
  story:  { title: 'Training',  description: 'Compendium spaced repetition — daily reps build systematic fluency in what direction and clarity require' },
  spirit: { title: 'FlowSpark', description: 'Curiosity mapping — surfaces genuine pulls and patterns that reveal what actually matters to you' },
};

function getRecommendations(blindSide: Pillar): Recommendation[] {
  const techniques = PILLAR_TECHNIQUES[blindSide].slice(0, 2);
  const tool = PRACTICE_TOOLS[blindSide];
  return [
    ...techniques.map(t => ({ type: 'technique' as const, title: t.title, pillar: blindSide, path: t.path })),
    { type: 'tool' as const, title: tool.title, pillar: blindSide },
  ];
}

// ─── Structured output tool ───────────────────────────────────────────────────

const PROFILE_TOOL: Anthropic.Tool = {
  name: 'generate_flow_lens_profile',
  description: 'Output the structured Flow Lens profile as JSON',
  input_schema: {
    type: 'object' as const,
    properties: {
      gravity_bullets: {
        type: 'array',
        description: '3 bullets about the person\'s gravity pillar — one tight sentence each, subject "You"',
        items: { type: 'string' },
        minItems: 3,
        maxItems: 3,
      },
      blind_side_bullets: {
        type: 'array',
        description: '3 bullets about the person\'s blind-side pillar — one tight sentence each, honest about cost',
        items: { type: 'string' },
        minItems: 3,
        maxItems: 3,
      },
      the_move: {
        type: 'string',
        description: '2 sentences: how the gravity is creating the blind side, and the one move that activates both',
      },
      tool_prescription: {
        type: 'string',
        description: '1 sentence: why this specific tool for this person, tied to their specific answer pattern',
      },
      technique_prescriptions: {
        type: 'array',
        description: '2 items, one per technique',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Exact technique name as provided' },
            prescription: { type: 'string', description: '1 sentence: what to do and why for this specific person' },
          },
          required: ['name', 'prescription'],
        },
        minItems: 2,
        maxItems: 2,
      },
    },
    required: ['gravity_bullets', 'blind_side_bullets', 'the_move', 'tool_prescription', 'technique_prescriptions'],
  },
};

// ─── Prompt ───────────────────────────────────────────────────────────────────

function describeSelfDepth(value: number): string {
  if (value > 0.75) return 'Notices physical depletion quickly — usually within hours — and acts on it';
  if (value > 0.5)  return 'Usually connects slumps to something physical within a day or two';
  if (value > 0.25) return 'Realizes the physical connection in hindsight, after the slump has passed';
  return 'Rarely connects under-performance or mood to physical state';
}

function describeSpaceDepth(value: number): string {
  if (value > 0.75) return 'Environment is well-managed — operates with minimal environmental friction';
  if (value > 0.5)  return 'Generally manages their workspace but some friction remains';
  if (value > 0.25) return 'Noticeable environmental friction that affects sessions';
  return 'Significant friction in environment or setup — getting in the way of work';
}

function describeStoryDepth(result: { clearest: string; haziest: string }): string {
  const labels: Record<string, string> = {
    purpose: 'long-term why',
    mission: '90-day direction',
    goal: 'what they\'re shipping this week',
    task: 'what they\'re doing next hour',
  };
  return `Clearest on "${labels[result.clearest] ?? result.clearest}", haziest on "${labels[result.haziest] ?? result.haziest}"`;
}

const SPIRIT_DEPTH_LABELS: Record<string, string> = {
  a: 'Strong inner compass — knows when something is off before they can say why',
  b: 'Values matter deeply but rarely surface unless something violates them',
  c: 'Purpose feels clear in good moments but vague when grinding',
  d: 'Purpose is something they\'re still actively working out',
};

const PILLAR_DOMAINS: Record<Pillar, string> = {
  self:   'body, emotions, and mental state',
  space:  'environment, tools, and feedback systems',
  story:  'direction, goals, and narrative',
  spirit: 'values, curiosity, and purpose',
};

const OBSTACLE_LABELS: Record<string, string> = {
  state:     'their own state — energy, emotions, how they feel',
  setup:     'their setup — environment, tools, friction',
  direction: 'direction — clarity on goals and what they\'re aiming at',
};

function buildPrompt(
  answers: FlowLensAnswers,
  scores: PillarScores,
  gravity: Pillar,
  blindSide: Pillar,
  recommendations: Recommendation[],
): string {
  const techniques = recommendations.filter(r => r.type === 'technique');
  const toolRec    = recommendations.find(r => r.type === 'tool');
  const domain     = answers.q11 ?? 'general';

  const techList = techniques
    .map(r => `• ${r.title}: ${PILLAR_TECHNIQUES[blindSide].find(t => t.title === r.title)?.description ?? ''}`)
    .join('\n');

  // Scored signals
  const scoredSignals = [
    answers.q2  && `- Shape instinct picked: ${PILLAR_DOMAINS[answers.q2]}`,
    answers.q4  && `- Biggest current obstacle: ${OBSTACLE_LABELS[answers.q4] ?? answers.q4}`,
    answers.q5  && `- Pair-off winner (strongest claim on attention): ${PILLAR_DOMAINS[answers.q5]}`,
    answers.q7  != null && `- Body awareness: ${describeSelfDepth(answers.q7)}`,
    answers.q8  && `- Direction clarity: ${describeStoryDepth(answers.q8)}`,
    answers.q9  != null && `- Environment status: ${describeSpaceDepth(answers.q9)}`,
    answers.q10 && `- Values/purpose: ${SPIRIT_DEPTH_LABELS[answers.q10] ?? ''}`,
  ].filter(Boolean).join('\n');

  // Qualitative context (not directly scored — use for texture and nuance)
  const qualSignals = [
    answers.q1  && `- Orientation pull: chose "${answers.q1 === 'inward' ? 'INWARD (settle, regulate, restore)' : 'FORWARD (build, push, progress)'}"`,
    answers.q3  && `- Current state texture: "${answers.q3.toUpperCase()}" — ${answers.q3 === 'sharp' ? 'precise, focused, structured' : 'loose, open, less constrained'}`,
    answers.q6?.length && `- State words chosen: ${answers.q6.join(', ')}`,
  ].filter(Boolean).join('\n');

  return `You are writing a Flow Lens Profile for someone in the domain of "${domain}".

The profile identifies where they naturally focus as a performance lever (their "gravity") and where they have a consistent blind spot.

## PILLAR SCORES
- Body/emotions/mind: ${scores.self}
- Environment/tools: ${scores.space}
- Direction/goals: ${scores.story}
- Values/purpose: ${scores.spirit}

Gravity (highest score): ${gravity.toUpperCase()} — ${PILLAR_DOMAINS[gravity]}
Blind side (lowest score): ${blindSide.toUpperCase()} — ${PILLAR_DOMAINS[blindSide]}

## SCORED SIGNALS
${scoredSignals}

## QUALITATIVE CONTEXT (use for texture, not scoring)
${qualSignals}

## PRACTICES TO RECOMMEND (for their blind side)
Techniques:
${techList}
Tool: ${toolRec ? `${toolRec.title} — ${PRACTICE_TOOLS[blindSide].description}` : ''}

## WRITING RULES
- No framework jargon: no "pillar", "gravity", "blind side", "SELF/SPACE/STORY/SPIRIT", "Flow Key", "FourFlow"
- Use plain language — name the domain directly (body, environment, direction, purpose)
- Each bullet: one tight sentence. Subject "You". Direct and specific to their answer pattern.
- "the_move": exactly 2 sentences. First: how their gravity is actively functioning as a substitute for what the blind side would provide. Second: the one concrete move that activates both simultaneously. Must be derivable only from THIS person's specific answers — not generic for this gravity/blind-side combination.
- "tool_prescription": 1 sentence — reference something specific in their answer pattern
- "technique_prescriptions": 1 sentence each — what to do and why for THIS person specifically
- Warm but unsparing. Don't soften the blind side. Be honest about what it costs.`;
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

  // Score pillars
  const scores   = scorePillars(answers);
  const { gravity, blindSide } = deriveGravityAndBlindSide(scores);
  const recommendations = getRecommendations(blindSide);

  // Save intake (with answer_metadata if provided)
  const intakePayload: Record<string, unknown> = {
    user_id: user.id,
    answers,
    pillar_scores: scores,
  };
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

  // Generate profile via Claude Sonnet with structured tool_use
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt    = buildPrompt(answers, scores, gravity, blindSide, recommendations);

  let structured: StructuredProfile | null = null;
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      tools: [PROFILE_TOOL],
      tool_choice: { type: 'tool', name: 'generate_flow_lens_profile' },
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
    gravity,
    blind_side: blindSide,
    pillar_scores: scores,
    gravity_bullets:          structured.gravity_bullets,
    blind_side_bullets:       structured.blind_side_bullets,
    the_move:                 structured.the_move,
    tool_prescription:        structured.tool_prescription,
    technique_prescriptions:  structured.technique_prescriptions,
  };

  // Upsert profile (replace previous if exists for this user)
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
        intake_id:         intake.id,
        gravity_pillar:    gravity,
        blind_side_pillar: blindSide,
        profile_text:      JSON.stringify(structured),
        profile_json:      profileJson,
        recommendations,
        model:             MODEL,
        generated_at:      new Date().toISOString(),
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
        user_id:           user.id,
        intake_id:         intake.id,
        gravity_pillar:    gravity,
        blind_side_pillar: blindSide,
        profile_text:      JSON.stringify(structured),
        profile_json:      profileJson,
        recommendations,
        model:             MODEL,
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
      id:                profileId,
      gravity_pillar:    gravity,
      blind_side_pillar: blindSide,
      profile_text:      JSON.stringify(structured),
      profile_json:      profileJson,
      recommendations,
      generated_at:      new Date().toISOString(),
    },
  });
}
