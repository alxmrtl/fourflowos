import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ─── Types ────────────────────────────────────────────────────────────────────

type Pillar = 'self' | 'space' | 'story' | 'spirit';

interface FlowLensAnswers {
  q1: Pillar;   // where do you look when something isn't working
  q2: Pillar;   // when you're at your best, what made the difference
  q3: Pillar;   // first thing you skip when life gets busy
  q4: Pillar;   // watching someone struggle, what are they missing
  q5: Pillar;   // how you explain your stuck periods
  q6: 'a' | 'b' | 'c' | 'd'; // SELF depth: body/energy relationship
  q7: 'a' | 'b' | 'c' | 'd'; // SPACE depth: environment/tools relationship
  q8: 'a' | 'b' | 'c' | 'd'; // STORY depth: goals/direction relationship
  q9: 'a' | 'b' | 'c' | 'd'; // SPIRIT depth: values/purpose relationship
  q10: Pillar;  // how you prepare for best work
  q11: Pillar;  // type of advice you naturally give
  q12: string;  // domain context: 'creative' | 'career' | 'business' | 'personal'
}

interface PillarScores {
  self: number;
  space: number;
  story: number;
  spirit: number;
}

// Depth scoring: a=strong, b=moderate, c=gap, d=gap
const DEPTH_STRENGTH: Record<string, number> = { a: 2, b: 1, c: 0, d: 0 };

// Pillar display names for prompt
const PILLAR_NAMES: Record<Pillar, string> = {
  self: 'SELF (Body, Emotions, Mind)',
  space: 'SPACE (Environment, Tools, Systems)',
  story: 'STORY (Direction, Mission, Narrative)',
  spirit: 'SPIRIT (Values, Curiosity, Vision)',
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getUserFromRequest(request: NextRequest): Promise<{ id: string } | null> {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function scorePillars(answers: FlowLensAnswers): PillarScores {
  const scores: PillarScores = { self: 0, space: 0, story: 0, spirit: 0 };

  // Q1–Q5, Q10–Q11: direct pillar votes (+2 each for primary signal)
  const directPillarQuestions: (keyof FlowLensAnswers)[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q10', 'q11'];
  for (const q of directPillarQuestions) {
    const p = answers[q] as Pillar;
    if (p in scores) scores[p] += 2;
  }

  // Q6–Q9: within-pillar depth (+bonus for strength, -penalty for gap)
  scores.self   += DEPTH_STRENGTH[answers.q6] ?? 0;
  scores.space  += DEPTH_STRENGTH[answers.q7] ?? 0;
  scores.story  += DEPTH_STRENGTH[answers.q8] ?? 0;
  scores.spirit += DEPTH_STRENGTH[answers.q9] ?? 0;

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

// ─── Technique recommendations ────────────────────────────────────────────────

interface Recommendation {
  type: 'technique' | 'tool';
  title: string;
  pillar: string;
  path?: string;
}

// Curated technique samples per pillar — injected into prompt for concrete recommendations.
// These are real technique slugs from the compendium.
const PILLAR_TECHNIQUES: Record<Pillar, { title: string; path: string; description: string }[]> = {
  self: [
    { title: 'Movement Primer', path: 'compendium/framework/SELF/Focused-Body/_techniques/movement-primer.md', description: 'Brief physical activation before cognitive work' },
    { title: 'Observer Redirect', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/observer-redirect.md', description: 'Detach from reactive patterns and redirect energy' },
    { title: 'Body State Check', path: 'compendium/framework/SELF/Focused-Body/_techniques/body-state-check.md', description: 'Rapid somatic scan to calibrate before working' },
    { title: 'Breath Regulation', path: 'compendium/framework/SELF/Focused-Body/_techniques/breath-regulation.md', description: 'Nervous system reset via deliberate breathing' },
    { title: 'Pre-Session Clearance', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/pre-session-clearance.md', description: 'Release emotional residue before entering flow work' },
  ],
  space: [
    { title: 'Compression Over Expansion', path: 'compendium/framework/SELF/Open-Mind/_techniques/compression-over-expansion.md', description: 'Narrow scope to amplify signal' },
    { title: 'Overchoice Elimination', path: 'compendium/framework/SELF/Open-Mind/_techniques/overchoice-elimination.md', description: 'Remove decision points that fragment attention' },
    { title: 'Signal vs Noise Filter', path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/signal-vs-noise-filter.md', description: 'Audit which inputs actually inform action' },
    { title: 'Micro-Review Loop', path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/micro-review-loop.md', description: 'Short feedback cycles that close gaps fast' },
    { title: 'Streak Architecture', path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/streak-architecture.md', description: 'Make progress visible so momentum compounds' },
  ],
  story: [
    { title: 'Open Loop Closure', path: 'compendium/framework/SELF/Open-Mind/_techniques/open-loop-closure.md', description: 'Close incomplete tasks that drain cognitive background' },
    { title: 'Sub-Goal Decomposition', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/sub-goal-decomposition.md', description: 'Break distant targets into near-term wins' },
    { title: 'Clarity Over Intensity', path: 'compendium/framework/SELF/Open-Mind/_techniques/clarity-over-intensity.md', description: 'Precision of aim before force of effort' },
    { title: 'DMN-Goal Engagement', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/dmn-goal-engagement.md', description: 'Use default mode network for goal consolidation' },
    { title: 'Transition Ritual', path: 'compendium/framework/SELF/Open-Mind/_techniques/transition-ritual.md', description: 'Bridge between modes — signal to the brain what comes next' },
  ],
  spirit: [
    { title: 'Flow Channel Formula', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/flow-channel-formula.md', description: 'Calibrate challenge-skill balance for genuine pull' },
    { title: 'Micro-Completion Architecture', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/micro-completion-architecture.md', description: 'Design work so small wins are structurally guaranteed' },
    { title: 'Pattern Literacy', path: 'compendium/framework/SELF/Open-Mind/_techniques/pattern-literacy.md', description: 'Read recurring themes in your work and energy' },
    { title: 'Progress Ledger', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/progress-ledger.md', description: 'Track invisible effort to keep motivation signal clean' },
    { title: 'Ambiguity Control', path: 'compendium/framework/SELF/Open-Mind/_techniques/ambiguity-control.md', description: 'Define what is known so the unknown stops leaking energy' },
  ],
};

// Your Practice tools — mapped to each pillar
const PRACTICE_TOOLS: Record<Pillar, { title: string; description: string }> = {
  self: { title: 'FlowZone', description: 'Deep work timer with breathwork — builds physiological coherence before and during focus sessions' },
  space: { title: 'FlowRead', description: 'Speed reading trainer — builds feedback density and attention through deliberate practice' },
  spirit: { title: 'FlowSpark', description: 'Curiosity mapping — surfaces genuine pulls and intersection patterns that reveal authentic flow channels' },
  story: { title: 'Training', description: 'Compendium spaced repetition — daily reps across all 12 states build systematic framework fluency' },
};

function getRecommendations(blindSide: Pillar, domain: string): Recommendation[] {
  const techniques = PILLAR_TECHNIQUES[blindSide].slice(0, 2);
  const tool = PRACTICE_TOOLS[blindSide];

  const recs: Recommendation[] = techniques.map(t => ({
    type: 'technique' as const,
    title: t.title,
    pillar: blindSide,
    path: t.path,
  }));

  recs.push({
    type: 'tool',
    title: tool.title,
    pillar: blindSide,
  });

  return recs;
}

// ─── Generation prompt ────────────────────────────────────────────────────────

function buildPrompt(
  answers: FlowLensAnswers,
  scores: PillarScores,
  gravity: Pillar,
  blindSide: Pillar,
  recommendations: Recommendation[],
): string {
  const depthAnswerLabels: Record<string, Record<string, string>> = {
    q6: {
      a: 'Notices physical depletion quickly — usually within a day — and acts on it',
      b: 'Takes a few days to connect slumps to something physical, then adjusts',
      c: 'Usually realizes the physical connection in hindsight, after the slump has passed',
      d: 'Rarely connects under-performance or mood to physical state',
    },
    q7: {
      a: 'Constantly optimizing environment — enjoys designing the setup',
      b: 'Functional minimalist — uses what works, doesn\'t overthink it',
      c: 'Knows environment affects them but rarely addresses it',
      d: 'Overwhelmed by setup friction but doesn\'t prioritize fixing it',
    },
    q8: {
      a: 'Strong clarity — always knows what they\'re pointed at',
      b: 'Sense of movement — direction matters more than a fixed target',
      c: 'Vision is clear but near-term missions feel fuzzy',
      d: 'Direction drifts when deep in execution',
    },
    q9: {
      a: 'Strong inner compass — knows when something is off before they can say why',
      b: 'Values matter deeply but rarely surface unless violated',
      c: 'Purpose feels clear in good moments but vague when grinding',
      d: 'Purpose is something they\'re still working out',
    },
  };

  const pillarVoteQuestions = [
    { q: 'q1', label: 'When something isn\'t working, they look first at', answer: PILLAR_NAMES[answers.q1] },
    { q: 'q2', label: 'When at their best, what made the difference', answer: PILLAR_NAMES[answers.q2] },
    { q: 'q3', label: 'First thing they skip when busy', answer: PILLAR_NAMES[answers.q3] },
    { q: 'q4', label: 'What they think struggling people are missing', answer: PILLAR_NAMES[answers.q4] },
    { q: 'q5', label: 'How they narrate their stuck periods', answer: PILLAR_NAMES[answers.q5] },
    { q: 'q10', label: 'First move when they lose momentum mid-session', answer: PILLAR_NAMES[answers.q10] },
    { q: 'q11', label: 'Type of advice they naturally give others', answer: PILLAR_NAMES[answers.q11] },
  ];

  const techList = recommendations
    .filter(r => r.type === 'technique')
    .map(r => `• ${r.title}: ${PILLAR_TECHNIQUES[blindSide as Pillar].find(t => t.title === r.title)?.description ?? ''}`)
    .join('\n');

  const toolRec = recommendations.find(r => r.type === 'tool');
  const domain = answers.q12;

  return `You are writing a Flow Lens Profile — a short, plain-language assessment of how someone is wired for performance and flow.

The Flow Lens identifies where a person naturally gravitates as a lever (their strongest pattern) and where they have a consistent blind spot (what they systematically underweight).

## FRAMEWORK
The four pillars:
- SELF: Body, emotions, mind — the reception layer. How clear is the vessel?
- SPACE: Environment, tools, systems — the transmission layer. Is the setup supporting signal flow?
- STORY: Direction, mission, narrative — temporal direction. Do they know where they're going?
- SPIRIT: Values, curiosity, vision — timeless direction. Are they connected to what matters?

## INTAKE DATA

Pillar scores (from 12 questions):
- SELF: ${scores.self}
- SPACE: ${scores.space}
- STORY: ${scores.story}
- SPIRIT: ${scores.spirit}

Natural Gravity (highest): ${gravity.toUpperCase()}
Blind Side (lowest): ${blindSide.toUpperCase()}

Domain context: ${domain}

Pillar-mapping answers:
${pillarVoteQuestions.map(v => `- ${v.label}: ${v.answer}`).join('\n')}

Within-pillar depth answers:
- SELF depth: ${depthAnswerLabels.q6[answers.q6]}
- SPACE depth: ${depthAnswerLabels.q7[answers.q7]}
- STORY depth: ${depthAnswerLabels.q8[answers.q8]}
- SPIRIT depth: ${depthAnswerLabels.q9[answers.q9]}

## RECOMMENDED PRACTICES (for Blind Side — ${blindSide.toUpperCase()})
Techniques available:
${techList}
Tool: ${toolRec ? `${toolRec.title} — ${PRACTICE_TOOLS[blindSide].description}` : ''}

## OUTPUT FORMAT
Write the profile in this exact structure, using the section headers as written:

**YOUR GRAVITY: [Pillar Name in all caps]**
[2–3 sentences. How they instinctively see the world through this lens. What they're naturally competent at. The strength that is also the constraint.]

**YOUR BLIND SIDE: [Pillar Name in all caps]**
[2–3 sentences. What they systematically underweight. The cost — not as a weakness list, but as "here's what you're consistently missing and what it's costing you." Be specific to their actual answers.]

**THE COMPOUNDING MOVE**
[1 paragraph. First identify the specific way this person's gravity is actively creating their blind side — not just "they underweight X" but how their gravity, applied in their domain, is functioning as a substitution for what the blind side would provide. Then name the one move that would activate both simultaneously: something they can do *through* their gravity that starts to develop the gap. If the insight could apply to any person with this gravity/blind-side combination, rewrite it — it must be derivable only from this person's specific answer pattern.]

**PRACTICES**
[List 2–3 specific practices. First the compendium techniques (name them exactly as given). Then the tool. One sentence per practice — what it does, not what it is. Domain context: ${domain}.]

## TONE RULES
- Plain language. No jargon. No "Flow Keys" or "pillars" vocabulary in the output — just name the domain directly (body, environment, direction, purpose).
- Direct and specific. Not generic self-help. This person gave you specific answers — reflect them back with precision.
- Warm but unsparing. Don't soften the blind side. Be honest about what it costs.
- Length: ~300 words total. Dense, not padded.
- Do not use bullet points except in the Practices section.`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  let body: { answers: FlowLensAnswers };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const { answers } = body;
  if (!answers || typeof answers !== 'object') {
    return NextResponse.json({ success: false, error: 'answers required' }, { status: 400 });
  }

  // Score pillars
  const scores = scorePillars(answers);
  const { gravity, blindSide } = deriveGravityAndBlindSide(scores);
  const recommendations = getRecommendations(blindSide, answers.q12 ?? 'general');

  // Save intake
  const { data: intake, error: intakeError } = await supabase
    .from('flow_lens_intakes')
    .insert({ user_id: user.id, answers, pillar_scores: scores })
    .select('id')
    .single();

  if (intakeError) {
    console.error('[flow-lens] intake insert error:', intakeError);
    return NextResponse.json({ success: false, error: 'Failed to save intake' }, { status: 500 });
  }

  // Generate profile via Claude Haiku
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = buildPrompt(answers, scores, gravity, blindSide, recommendations);

  let profileText = '';
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });
    profileText = message.content[0].type === 'text' ? message.content[0].text : '';
  } catch (err) {
    console.error('[flow-lens] Claude error:', err);
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 });
  }

  if (!profileText) {
    return NextResponse.json({ success: false, error: 'Empty generation response' }, { status: 500 });
  }

  // Parse structured sections from the generated text
  const profileJson = {
    gravity,
    blind_side: blindSide,
    pillar_scores: scores,
    sections: parseProfileSections(profileText),
  };

  // Save profile (upsert — replace previous if exists for this user)
  const { data: existing } = await supabase
    .from('flow_lens_profiles')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  let profileId: string;

  if (existing?.id) {
    const { error } = await supabase
      .from('flow_lens_profiles')
      .update({
        intake_id: intake.id,
        gravity_pillar: gravity,
        blind_side_pillar: blindSide,
        profile_text: profileText,
        profile_json: profileJson,
        recommendations,
        model: 'claude-haiku-4-5-20251001',
        generated_at: new Date().toISOString(),
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
        user_id: user.id,
        intake_id: intake.id,
        gravity_pillar: gravity,
        blind_side_pillar: blindSide,
        profile_text: profileText,
        profile_json: profileJson,
        recommendations,
        model: 'claude-haiku-4-5-20251001',
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
      id: profileId,
      gravity_pillar: gravity,
      blind_side_pillar: blindSide,
      profile_text: profileText,
      profile_json: profileJson,
      recommendations,
      generated_at: new Date().toISOString(),
    },
  });
}

function parseProfileSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const sectionPatterns = [
    { key: 'gravity', pattern: /\*\*YOUR GRAVITY[^*]*\*\*\s*([\s\S]*?)(?=\*\*YOUR BLIND SIDE|\*\*THE COMPOUNDING|\*\*PRACTICES|$)/i },
    { key: 'blind_side', pattern: /\*\*YOUR BLIND SIDE[^*]*\*\*\s*([\s\S]*?)(?=\*\*THE COMPOUNDING|\*\*PRACTICES|$)/i },
    { key: 'compounding_move', pattern: /\*\*THE COMPOUNDING MOVE\*\*\s*([\s\S]*?)(?=\*\*PRACTICES|$)/i },
    { key: 'practices', pattern: /\*\*PRACTICES\*\*\s*([\s\S]*?)$/i },
  ];

  for (const { key, pattern } of sectionPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) sections[key] = match[1].trim();
  }

  return sections;
}
