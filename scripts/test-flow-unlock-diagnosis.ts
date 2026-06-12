/**
 * Diagnosis quality check for the Flow Unlock V5 prompt.
 * Runs contrasting scripted intakes through the same prompt + schema the API
 * route uses and prints the Key-level diagnoses for human review.
 *
 *   npx tsx --env-file=.env.local scripts/test-flow-unlock-diagnosis.ts
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  type Pillar,
  KEY_CARDS,
  KEY_IDS,
  KEY_TECHNIQUES,
  PILLAR_DOMAINS,
  IMAGE_DESCRIPTIONS,
  VOICE_RULES,
  PSYCHOLINGUISTIC_INSTRUCTIONS,
} from '../src/data/flow-unlock-config';

interface Answers {
  q1?: Pillar; q2?: string[]; q3?: string[];
  q4?: string; q5?: string; q6?: string;
}

// ─── Scripted personas ────────────────────────────────────────────────────────

const CASES: { name: string; expect: string; answers: Answers }[] = [
  {
    name: 'Tool-tinkerer avoiding mission',
    expect: 'overexposed: optimized-tools (+ maybe ignited-curiosity); bottleneck: clear-mission',
    answers: {
      q1: 'space',
      q2: ['EQUIPPED', 'SCATTERED', 'DRIFTING'],
      q3: ['setup', 'tangle'],
      q4: 'I want to launch my newsletter but I have been "about to launch" for four months.',
      q5: 'I rebuilt the whole stack twice — moved from Substack to Ghost, set up a custom domain, built a Notion pipeline, tried three different editors, automated the publishing flow. My setup is honestly great now. I also keep researching growth tactics and reading about what other writers do.',
      q6: 'I tell myself I am almost ready, that once the system is right it will be easy to be consistent. Sometimes I wonder if I even know what the newsletter is about anymore.',
    },
  },
  {
    name: 'Curiosity-hopper with no feedback loop',
    expect: 'overexposed: ignited-curiosity; bottleneck: feedback-systems (or clear-mission)',
    answers: {
      q1: 'spirit',
      q2: ['IGNITED', 'RESTLESS', 'BUILDING'],
      q3: ['flame', 'horizon'],
      q4: 'My side projects never get past the exciting phase. I have shipped four prototypes this year and have no idea if any of them are good.',
      q5: 'I start new things constantly — every new idea gets a weekend of obsessed building. I read papers, watch talks, sketch architectures. When the excitement fades I jump to the next one. I never show anyone anything, I just move on.',
      q6: 'I tell myself the next one is the real one. That this time the idea is good enough to carry me through. Honestly I never find out whether the last one worked.',
    },
  },
  {
    name: 'Grinder ignoring body state',
    expect: 'overexposed: clear-mission (+ maybe feedback-systems); bottleneck: focused-body (or tuned-emotions)',
    answers: {
      q1: 'story',
      q2: ['FOCUSED', 'BUILDING', 'FOGGY'],
      q3: ['peak', 'pulse'],
      q4: 'I am six weeks from a funding deadline and my output quality is collapsing even though I work more hours than ever.',
      q5: 'I plan every day the night before, track every task, hit every block on the calendar. I doubled my hours, cut the gym, eat at my desk, sleep five hours. The plan is airtight and I execute it — but the work coming out is mush and I reread the same paragraph four times.',
      q6: 'I tell myself to push through, that I can rest after the deadline. That tiredness is a discipline problem.',
    },
  },
];

// ─── Prompt assembly (mirrors src/app/api/core/flow-lens/route.ts) ────────────

const WORD_PILLAR: Record<string, Pillar> = {
  ALIVE: 'self', FOGGY: 'self', GROUNDED: 'self', SCATTERED: 'self',
  CLUTTERED: 'space', EQUIPPED: 'space', SQUEEZED: 'space', FLUID: 'space',
  DRIFTING: 'story', BUILDING: 'story', STUCK: 'story', FOCUSED: 'story',
  RESTLESS: 'spirit', IGNITED: 'spirit', HOLLOW: 'spirit', CALLED: 'spirit',
};
const IMAGE_PILLAR: Record<string, Pillar> = {
  pulse: 'self', open: 'self', setup: 'space', tangle: 'space',
  horizon: 'story', peak: 'story', flame: 'spirit', north: 'spirit',
};

function scorePillars(a: Answers) {
  const s: Record<Pillar, number> = { self: 0, space: 0, story: 0, spirit: 0 };
  if (a.q1) s[a.q1] += 2;
  for (const w of a.q2 ?? []) { const p = WORD_PILLAR[w.toUpperCase()]; if (p) s[p] += 1.5; }
  for (const i of a.q3 ?? []) { const p = IMAGE_PILLAR[i]; if (p) s[p] += 2; }
  return s;
}

const DIMENSION_LABELS: Record<Pillar, string> = {
  self: 'SELF — body, emotions, and mental state',
  space: 'SPACE — environment, tools, and feedback',
  story: 'STORY — direction, mission, and role',
  spirit: 'SPIRIT — values, curiosity, and vision',
};

function buildKeyCardsSection(): string {
  const by: Record<Pillar, string[]> = { self: [], space: [], story: [], spirit: [] };
  for (const c of KEY_CARDS) {
    by[c.dimension].push(`• ${c.name} [${c.id}] — governs ${c.governs}\n  overexposed: ${c.overexposed}\n  starved: ${c.starved}`);
  }
  return (Object.keys(by) as Pillar[]).map(d => `${DIMENSION_LABELS[d]}\n${by[d].join('\n')}`).join('\n\n');
}

function buildTechniqueMenu(): string {
  return KEY_IDS.map(id => `[${id}]\n${KEY_TECHNIQUES[id].map(t => `  - ${t.title}: ${t.description}`).join('\n')}`).join('\n');
}

function buildPrompt(a: Answers, scores: Record<Pillar, number>): string {
  const wordSignals = a.q2?.map(w => {
    const p = WORD_PILLAR[w.toUpperCase()];
    return p ? `${w} (${PILLAR_DOMAINS[p].split(',')[0].trim()})` : w;
  }).join(', ');
  const imageSignals = a.q3?.map(id => IMAGE_DESCRIPTIONS[id] ?? id).join('; ');
  const instinct = [
    a.q1 && `- Shape instinct: ${PILLAR_DOMAINS[a.q1]}`,
    wordSignals && `- Words chosen: ${wordSignals}`,
    imageSignals && `- Images chosen: ${imageSignals}`,
  ].filter(Boolean).join('\n');

  return `You are generating a Flow Unlock — a key-level diagnostic of what's blocking someone on the specific issue they brought today. Not a personality profile: a read of THIS situation's pattern, and the move that breaks it.

The framework: twelve keys, three per dimension. People get stuck in a recognizable shape — they keep pulling 1-2 keys (overexposed: effort flows there by habit) while the key the situation actually needs sits starved. Your job: name that shape and the unlock.

## THE 12 KEYS (diagnostic vocabulary)

${buildKeyCardsSection()}

## INSTINCT PRIOR (weak signal — confirm or override from the text)
Dimension scores from rapid-instinct questions:
- self: ${scores.self} | space: ${scores.space} | story: ${scores.story} | spirit: ${scores.spirit}
${instinct}

## THE SITUATION (what they're bringing today)
"${a.q4}"

## WHERE THE ENERGY GOES (what they've been trying)
"${a.q5}"

## THE VOICE (what they tell themselves when it stalls)
"${a.q6}"

## YOUR TASK: CROSS-PATTERN ANALYSIS

${PSYCHOLINGUISTIC_INSTRUCTIONS}

## TECHNIQUE MENU (choose exactly one, from the bottleneck key's list)

${buildTechniqueMenu()}

## PRACTICE TOOL
The matching tool attaches automatically by the bottleneck key's dimension: SELF → FlowZone (focus timer that makes maintaining attention visible), SPACE → FlowRead (timed reading that trains staying in feedback), STORY → FlowCompendium (browse protocols for direction and mission), SPIRIT → FlowSpark (curiosity mapping that surfaces genuine pulls). Write tool_prescription for that tool only — one sentence tied to something concrete they shared. Only describe capabilities stated here.

## VOICE RULES (non-negotiable)

${VOICE_RULES}`;
}

const KEY_ENUM = KEY_IDS as string[];
const UNLOCK_TOOL: Anthropic.Tool = {
  name: 'generate_flow_unlock',
  description: 'Output the structured Flow Unlock diagnosis as JSON',
  input_schema: {
    type: 'object' as const,
    properties: {
      bottleneck_key: { type: 'string', enum: KEY_ENUM },
      overexposed_keys: { type: 'array', items: { type: 'string', enum: KEY_ENUM }, minItems: 1, maxItems: 2 },
      pattern_read: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 2 },
      the_tell: { type: 'string' },
      key_moves: {
        type: 'array',
        items: { type: 'object', properties: { key: { type: 'string', enum: KEY_ENUM }, move: { type: 'string' } }, required: ['key', 'move'] },
      },
      technique: { type: 'object', properties: { name: { type: 'string' }, prescription: { type: 'string' } }, required: ['name', 'prescription'] },
      tool_prescription: { type: 'string' },
    },
    required: ['bottleneck_key', 'overexposed_keys', 'pattern_read', 'the_tell', 'key_moves', 'technique', 'tool_prescription'],
  },
};

async function main() {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  for (const c of CASES) {
    const scores = scorePillars(c.answers);
    const prompt = buildPrompt(c.answers, scores);
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      tools: [UNLOCK_TOOL],
      tool_choice: { type: 'tool', name: 'generate_flow_unlock' },
      messages: [{ role: 'user', content: prompt }],
    });
    const block = msg.content.find(b => b.type === 'tool_use');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = (block as any)?.input;
    console.log(`\n━━━ ${c.name} ━━━`);
    console.log(`expected   : ${c.expect}`);
    console.log(`bottleneck : ${out.bottleneck_key}`);
    console.log(`overexposed: ${out.overexposed_keys?.join(', ')}`);
    console.log(`pattern    : ${out.pattern_read?.join(' | ')}`);
    console.log(`tell       : ${out.the_tell}`);
    for (const m of out.key_moves ?? []) console.log(`move [${m.key}]: ${m.move}`);
    console.log(`technique  : ${out.technique?.name} — ${out.technique?.prescription}`);
    console.log(`tool rx    : ${out.tool_prescription}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
