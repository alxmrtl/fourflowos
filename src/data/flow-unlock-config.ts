/**
 * Flow Unlock — shared config consumed by both the API route and the admin prompt inspector.
 * Editing here updates both generation behavior and the admin display simultaneously.
 *
 * V5: diagnosis happens at the Key level (12 Keys), not the Dimension level.
 * KEY_CARDS is the diagnostic vocabulary the LLM reads — each Key's signatures
 * are distilled from the compendium Key files (compendium/framework/[PILLAR]/[Key]/).
 */

export type Pillar = 'self' | 'space' | 'story' | 'spirit';

export type KeyId =
  | 'tuned-emotions' | 'focused-body' | 'open-mind'
  | 'intentional-space' | 'optimized-tools' | 'feedback-systems'
  | 'generative-story' | 'clear-mission' | 'empowered-role'
  | 'grounding-values' | 'ignited-curiosity' | 'visualized-vision';

export interface KeyCard {
  id: KeyId;
  name: string;
  dimension: Pillar;
  /** What this Key controls, in plain words. */
  governs: string;
  /** The recognizable signature of leaning on this Key too hard. */
  overexposed: string;
  /** The signature of neglecting it. */
  starved: string;
  /** One canonical practical move — fallback when generation omits a key_move. */
  nextStep: string;
}

// ─── The 12 Key cards — the diagnostic vocabulary ─────────────────────────────
// Order matters: grouped by Dimension, used for the pattern strip in the UI.

export const KEY_CARDS: KeyCard[] = [
  // SELF — body, emotions, mind
  {
    id: 'tuned-emotions', name: 'Tuned Emotions', dimension: 'self',
    governs: 'whether emotional state is read as information or runs as interference',
    overexposed: 'endless mood-managing and state-checking before any work happens; the session can\'t start until you feel right, so it rarely starts',
    starved: 'pushing through anxiety or boredom without reading it; treating the discomfort as a personal failing instead of a calibration cue',
    nextStep: 'Before your next session, name the feeling in one word and ask what it says about the challenge level — too big, too small, or just unclear.',
  },
  {
    id: 'focused-body', name: 'Focused Body', dimension: 'self',
    governs: 'whether the body anchors attention or runs as background noise',
    overexposed: 'training, optimizing, and recovery-stacking as the main event — the body routine is dialed while the actual work waits',
    starved: 'working from the neck up; hours at the desk with no movement, shallow breath, tension noticed only when it hurts — knowing what to do but unable to start',
    nextStep: 'Two minutes of movement and five slow breaths immediately before the work, then start while the body is still warm.',
  },
  {
    id: 'open-mind', name: 'Open Mind', dimension: 'self',
    governs: 'how much mental bandwidth is actually free for the task in front of you',
    overexposed: 'consuming, researching, and reorganizing notes as a substitute for doing; one more input always feels necessary before starting',
    starved: 'twenty open loops running in the background; every task gets a fraction of you; nothing finishes fully',
    nextStep: 'Write down every open loop pulling at you, pick the one the current work needs, and park the rest on paper.',
  },
  // SPACE — environment, tools, feedback
  {
    id: 'intentional-space', name: 'Intentional Space', dimension: 'space',
    governs: 'whether the environment pulls you toward the work or away from it',
    overexposed: 'endlessly rearranging the desk, the lighting, the perfect café — preparing the room has replaced entering the work',
    starved: 'working wherever is convenient amid clutter and interruption; every irrelevant object and ping quietly taxing attention',
    nextStep: 'Clear the surface to only what today\'s work needs, and decide one rule for interruptions before you sit down.',
  },
  {
    id: 'optimized-tools', name: 'Optimized Tools', dimension: 'space',
    governs: 'whether your tools collapse friction or generate it',
    overexposed: 'tool-switching and setup-tweaking that feels like progress; the system is always almost ready, the work never starts',
    starved: 'default settings, notifications on, the same clunky workflow repeated daily — hundreds of small frictions accepted as normal',
    nextStep: 'Automate or template the first step of your next session so starting takes one click — then change nothing else for a week.',
  },
  {
    id: 'feedback-systems', name: 'Feedback Systems', dimension: 'space',
    governs: 'whether anything comes back from the work to tell you it\'s working',
    overexposed: 'dashboard-watching and metric-tweaking; measuring became the work, and every number gets checked except the one that matters',
    starved: 'output with no return loop — shipping into silence, weeks of work with no checkpoint, course-correcting on vibes',
    nextStep: 'After your next work block, take two minutes and write one observation: what moved, what didn\'t. That\'s your loop — keep it.',
  },
  // STORY — narrative, mission, role
  {
    id: 'generative-story', name: 'Generative Story', dimension: 'story',
    governs: 'what setbacks mean — plot beats or verdicts',
    overexposed: 'narrating instead of acting; reframing, journaling, and meaning-making about the work as a stand-in for doing it',
    starved: 'every setback lands as evidence you\'re not cut out for this; waiting for conditions to improve before acting',
    nextStep: 'Name the stage you\'re in — ordeal, threshold, refusal — and write the one sentence of what the protagonist does next.',
  },
  {
    id: 'clear-mission', name: 'Clear Mission', dimension: 'story',
    governs: 'whether you know what matters right now, today',
    overexposed: 're-planning as procrastination — new systems, new lists, new quarters mapped while the actual next action stays untouched',
    starved: 'busy on six fronts, can\'t say which one matters; every morning starts with re-deciding what the day is for',
    nextStep: 'Write "Today, the only thing that matters is ___" — one sentence, kept visible — and let everything else wait until it\'s done.',
  },
  {
    id: 'empowered-role', name: 'Empowered Role', dimension: 'story',
    governs: 'whether you have real ownership — clarity on what winning looks like and latitude over how',
    overexposed: 'over-functioning — absorbing everyone else\'s jobs until your actual role blurs into all of it',
    starved: 'waiting for permission no one is going to give; unclear what success looks like, so effort scatters into proving instead of doing',
    nextStep: 'Define what "done and good" looks like for one current task in your own words — then act on that definition without asking.',
  },
  // SPIRIT — values, curiosity, vision
  {
    id: 'grounding-values', name: 'Grounding Values', dimension: 'spirit',
    governs: 'whether daily choices and stated values point the same way',
    overexposed: 'values-talk as a brake — every move audited for purity until nothing ships; principles becoming reasons not to act',
    starved: 'technically productive, quietly misaligned; the calendar reveals values the mouth never agreed to, and the drain is constant',
    nextStep: 'Pick one value you claim, find the spot this week where your calendar contradicts it, and change that one slot.',
  },
  {
    id: 'ignited-curiosity', name: 'Ignited Curiosity', dimension: 'spirit',
    governs: 'whether the work pulls you or you push yourself through it',
    overexposed: 'chasing every spark — new ideas, new domains, new projects — novelty as the escape route from anything that got hard',
    starved: 'everything runs on "should"; the genuine pull is buried under practical, and each session takes willpower to enter',
    nextStep: 'List what genuinely pulled your attention this week, no judgment — then give the strongest pull thirty protected minutes.',
  },
  {
    id: 'visualized-vision', name: 'Visualized Vision', dimension: 'spirit',
    governs: 'whether a concrete forward image makes today\'s work mean something',
    overexposed: 'living in the vision — boards, futures, ten-year selves — while the bridge from the image back to this week never gets built',
    starved: 'heads-down with no destination; "successful eventually" is the whole plan, so hard days feel like expense instead of progress',
    nextStep: 'Describe one specific scene from ninety days out — what you see and feel on the day it\'s working — and pin today\'s task to it.',
  },
];

export const KEY_BY_ID: Record<KeyId, KeyCard> = Object.fromEntries(
  KEY_CARDS.map(k => [k.id, k]),
) as Record<KeyId, KeyCard>;

export const KEY_IDS = KEY_CARDS.map(k => k.id);

// ─── Technique pools (2–3 per Key) ────────────────────────────────────────────

export const KEY_TECHNIQUES: Record<KeyId, { title: string; path: string; description: string }[]> = {
  'tuned-emotions': [
    { title: 'Pre-Session Clearance', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/pre-session-clearance.md', description: 'Witness emotional residue before work starts — without trying to fix it' },
    { title: 'Observer Redirect',     path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/observer-redirect.md',     description: 'Shift from "I am the reaction" to "I am watching it" — then redirect toward the work\'s effect' },
    { title: 'Flow Channel Formula',  path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/flow-channel-formula.md',  description: 'Check the challenge-skill ratio before starting — diagnose boredom, anxiety, or the flow channel' },
  ],
  'focused-body': [
    { title: 'Body State Check',  path: 'compendium/framework/SELF/Focused-Body/_techniques/body-state-check.md',  description: 'Rapid somatic scan: read arousal level, breath, tension, then match a regulation tool to what you find' },
    { title: 'Breath Regulation', path: 'compendium/framework/SELF/Focused-Body/_techniques/breath-regulation.md', description: 'Three-tool approach: cyclic sighing for daily reset, resonance breathing pre-session, 4-7-8 for acute moments' },
    { title: 'Movement Primer',   path: 'compendium/framework/SELF/Focused-Body/_techniques/movement-primer.md',   description: 'Brief physical activation before cognitive work — converts physical readiness into mental readiness' },
  ],
  'open-mind': [
    { title: 'Single-Tab Mind',        path: 'compendium/framework/SELF/Open-Mind/_techniques/single-tab-mind.md',        description: 'One mental tab at a time — switching costs multiply until there\'s almost no attention left' },
    { title: 'Overchoice Elimination', path: 'compendium/framework/SELF/Open-Mind/_techniques/overchoice-elimination.md', description: 'Remove decisions from the work session — every choice made mid-flow is a withdrawal from focus' },
    { title: 'Transition Ritual',      path: 'compendium/framework/SELF/Open-Mind/_techniques/transition-ritual.md',      description: 'Deliberately close one context before opening the next — arrive without the previous task still running' },
  ],
  'intentional-space': [
    { title: 'Physical Space Audit',        path: 'compendium/framework/SPACE/Intentional-Space/_techniques/physical-space-audit.md',        description: 'Clear workspace completely; return only what\'s needed today; apply the open-loop test to every object' },
    { title: 'Environmental Trigger Stack', path: 'compendium/framework/SPACE/Intentional-Space/_techniques/environmental-trigger-stack.md', description: 'Stack sensory channels (sound, scent, light, posture) to condition the brain into focus state on cue' },
    { title: 'Interruption Gate Protocol',  path: 'compendium/framework/SPACE/Intentional-Space/_techniques/interruption-gate-protocol.md',  description: 'Decide interruption rules in advance — you can\'t evaluate an interruption without being interrupted by the evaluation' },
  ],
  'optimized-tools': [
    { title: 'One-Click Session Launch',           path: 'compendium/framework/SPACE/Optimized-Tools/_techniques/one-click-session-launch.md',           description: 'Collapse session-start to a single trigger by automating all non-decision steps' },
    { title: 'Automation of Non-Creative Steps',   path: 'compendium/framework/SPACE/Optimized-Tools/_techniques/automation-of-non-creative-steps.md',   description: 'Every routine step you automate is attention kept for the work that matters' },
    { title: 'Task-Tool Fit Matrix',               path: 'compendium/framework/SPACE/Optimized-Tools/_techniques/task-tool-fit-matrix.md',               description: 'Make the tool-to-cognitive-mode match explicit before the session starts — wrong tool is invisible friction' },
  ],
  'feedback-systems': [
    { title: 'Micro-Review Loop',      path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/micro-review-loop.md',      description: 'Two-minute pause at each work-unit boundary: one observation captured before the next unit starts' },
    { title: 'Signal vs Noise Filter', path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/signal-vs-noise-filter.md', description: 'Audit which inputs actually move the work — cut what doesn\'t, weight what does' },
    { title: 'Progress Dashboard',     path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/progress-dashboard.md',     description: 'Display 1-3 metrics that update immediately after each work unit — makes momentum visible' },
  ],
  'generative-story': [
    { title: 'Reframe Via Arc',      path: 'compendium/framework/STORY/Generative-Story/_techniques/reframe-via-arc.md',      description: 'Name the current stuckness as a story stage (ordeal, threshold, refusal) and name what comes next' },
    { title: 'Momentum Ledger',      path: 'compendium/framework/STORY/Generative-Story/_techniques/momentum-ledger.md',      description: 'Daily log: what moved, what unlocked, the living edge — weekly review compounds direction' },
    { title: 'Session Handoff Hook', path: 'compendium/framework/STORY/Generative-Story/_techniques/session-handoff-hook.md', description: 'End each session with "Tomorrow I pick up at ___" — an open narrative loop that pulls re-entry without willpower' },
  ],
  'clear-mission': [
    { title: 'One Thing Card',         path: 'compendium/framework/STORY/Clear-Mission/_techniques/one-thing-card.md',         description: 'Physical card: "Today, the only thing that matters is ___" — one sentence, primary visual field' },
    { title: 'Scope Lock',             path: 'compendium/framework/STORY/Clear-Mission/_techniques/scope-lock.md',             description: 'Decide what\'s out of scope before the session starts — make it unavailable for re-evaluation during it' },
    { title: 'Goal Hierarchy Cascade', path: 'compendium/framework/STORY/Clear-Mission/_techniques/goal-hierarchy-cascade.md', description: '5-level structure: 10-year direction → 1-year milestone → monthly → weekly → today\'s lever' },
  ],
  'empowered-role': [
    { title: 'Authority Assumption',      path: 'compendium/framework/STORY/Empowered-Role/_techniques/authority-assumption.md',      description: 'Most people are waiting for permission that was never required and will never arrive — act on your own definition of done' },
    { title: 'Role Boundary Declaration', path: 'compendium/framework/STORY/Empowered-Role/_techniques/role-boundary-declaration.md', description: 'Declare the edges of your role — unclear edges split attention between doing the work and monitoring for violations' },
    { title: 'Contribution Trace',        path: 'compendium/framework/STORY/Empowered-Role/_techniques/contribution-trace.md',        description: 'Trace the chain from your output to its human impact — abstract work feels meaningless when the chain is invisible' },
  ],
  'grounding-values': [
    { title: 'Integrity Gap Audit',     path: 'compendium/framework/SPIRIT/Grounding-Values/_techniques/integrity-gap-audit.md',     description: 'Three-column map: stated values vs revealed values (calendar, behavior) vs the gap — monthly review' },
    { title: 'Values Stress Test',      path: 'compendium/framework/SPIRIT/Grounding-Values/_techniques/values-stress-test.md',      description: 'Construct worst-case where the value costs something real — tests whether it holds or was just preference' },
    { title: 'Daily Values Touchpoint', path: 'compendium/framework/SPIRIT/Grounding-Values/_techniques/daily-values-touchpoint.md', description: 'Thirty seconds of contact with what matters most — values erode through neglect, not attack' },
  ],
  'ignited-curiosity': [
    { title: 'Excitement as GPS',           path: 'compendium/framework/SPIRIT/Ignited-Curiosity/_techniques/excitement-as-gps.md',           description: 'Treat genuine excitement as directional signal — follow it even when the destination isn\'t clear' },
    { title: 'Clean/Dirty Fuel Assessment', path: 'compendium/framework/SPIRIT/Ignited-Curiosity/_techniques/clean-dirty-fuel-assessment.md', description: 'Three diagnostics: pushed vs pulled, why-deepening, process vs completion orientation — the anonymity test reveals most' },
    { title: 'Curiosity Ledger',            path: 'compendium/framework/SPIRIT/Ignited-Curiosity/_techniques/curiosity-ledger.md',            description: 'Casual curiosity fades overnight; questions that return are real — the ledger finds them' },
  ],
  'visualized-vision': [
    { title: '90-Day Vivid Scene', path: 'compendium/framework/SPIRIT/Visualized-Vision/_techniques/90-day-vivid-scene.md', description: 'Long-horizon vision motivates in theory; 90 days motivates in practice — close enough to feel like you' },
    { title: 'Resolution Test',    path: 'compendium/framework/SPIRIT/Visualized-Vision/_techniques/resolution-test.md',    description: 'If you can\'t describe what you see, hear, and feel on the day it\'s realized — you don\'t have a vision yet' },
    { title: 'Evidence Audit',     path: 'compendium/framework/SPIRIT/Visualized-Vision/_techniques/evidence-audit.md',     description: 'Distinguish evaluating direction by the mirror\'s current state vs internal clarity — separate signal from fear' },
  ],
};

// ─── Practice tools (one per Dimension — tools genuinely map to Dimensions) ───

export const PRACTICE_TOOLS: Record<Pillar, { title: string; description: string; route: string }> = {
  self: {
    title: 'FlowZone',
    route: '/me?tool=flowzone',
    description: 'Deep work focus timer. Each session you press a button when distraction pulls — makes the invisible work of maintaining focus visible. Builds body awareness through deliberate reps.',
  },
  space: {
    title: 'FlowRead',
    route: '/me?tool=flowread',
    description: 'Speed reading trainer. Builds sustained attention and feedback density through timed reading with comprehension checks. Trains staying in signal without drift.',
  },
  story: {
    title: 'FlowCompendium',
    route: '/me?tool=compendium',
    description: 'Browse 338 flow protocols organized by pillar and state. Find techniques and concepts specific to where you\'re blocked — direction, mission, narrative, and role clarity.',
  },
  spirit: {
    title: 'FlowSpark',
    route: '/me?tool=curiosity',
    description: 'Curiosity mapping tool. Surfaces genuine pulls through structured prompts. Reveals what actually matters vs what you think should matter.',
  },
};

// ─── Pillar domain definitions (instinct prior framing) ───────────────────────

export const PILLAR_DOMAINS: Record<Pillar, string> = {
  self:   'body, emotions, and mental state',
  space:  'environment, tools, and feedback systems',
  story:  'direction, goals, and narrative',
  spirit: 'values, curiosity, and purpose',
};

// ─── Image descriptions for ImagePull (used in prompt) ───────────────────────

export const IMAGE_DESCRIPTIONS: Record<string, string> = {
  pulse:   'pulse / EKG wave (inner signal, body awareness)',
  open:    'radiant bloom / open center (receptive, present)',
  setup:   'dot grid (structure, environment)',
  tangle:  'crossed curves / knot (friction, complexity)',
  horizon: 'arrow on horizon (direction, momentum)',
  peak:    'mountain peak / triangle (goal, aspiration)',
  flame:   'flame (purpose, ignition)',
  north:   '4-pointed star (values, true north)',
};

// ─── Voice rules (injected into prompt) ──────────────────────────────────────

export const VOICE_RULES = `FORBIDDEN words and phrases: "navigate", "delve", "leverage", "showcase", "comprehensive", "it's worth noting", "journey", "transform", "unlock your potential", "holistic", "tap into", "resonate", "empower"
FORBIDDEN constructions: em dash overuse; padded rule-of-three lists; "Furthermore / Moreover / Additionally"; anything starting with "You are someone who..."; hedges used to avoid committing to the insight
FORBIDDEN tone: fake warmth ("That's incredible"), performative affirmations, corporate-speak

REQUIRED voice:
- Address the person directly as "you" in every field — never "they" or "this person".
- Plain, body-grounded language. No radio-engineering metaphor: never "signal", "reception", "frequency", "channel", "wiring", "interference". Native words: state, setup, pattern, loop, drift, pull, friction.
- Short declarative sentences. Present tense. "This is what's happening", not "this may be what's happening."
- Name the specific pattern, not the category. Not "you struggle with focus" — "you're running output with no loop back. Nothing returns to correct course."
- Honest about the bottleneck. Warmth through specificity, not softening.
- If they used a specific word (like "spiral", "drowning", "stuck"), mirror it once — then name what's underneath it.
- "the_tell" must feel like a sharp observation no generic tool could make.

No framework jargon in any text field: no "Key", "Dimension", "pillar", "bottleneck", "overexposed", "SELF/SPACE/STORY/SPIRIT", "FourFlow". Name the domains directly: body/mind/emotions, environment/tools, direction/goals, purpose/values.`;

// ─── Analysis instructions (injected into prompt) ─────────────────────────────

export const PSYCHOLINGUISTIC_INSTRUCTIONS = `Before writing a single word of output, work through these in order:

0. EXPOSURE MAP — Read "where the energy goes" against the OVEREXPOSED signatures: which 1-2 keys are they pulling hard, over and over? Read the issue's symptoms against the STARVED signatures: which key, if turned, would change the situation most? Then apply the substitution principle: an overexposed key is usually doing the job of a starved one. Canonical substitutions (illustrations, not a lookup table): chasing curiosity instead of committing to a mission; tweaking tools instead of building a loop that returns real feedback; planning and narrating instead of reading the body's state; auditing values instead of building a concrete vision. Name the specific substitution you see.

1. ATTRIBUTION STYLE — How do they frame their obstacle? Internal (body/emotion/mental state) → SELF keys. Environmental (tools/setup/noise) → SPACE keys. Directional (no clear path/goal) → STORY keys. Meaning-based (pointless/empty/disconnected) → SPIRIT keys. When this diverges from their instinct score, the divergence is data.

2. ABSENT SIGNAL — What did they NOT mention? No body in the picture → Focused Body starved. No mention of what comes back from the work → Feedback Systems starved. No "why" anywhere → SPIRIT starved. What's missing is as diagnostic as what's there.

3. METAPHOR REGISTER — "Walls closing in" / "can't breathe" = SELF. "Going in circles" / "spinning" = STORY. "Noise everywhere" / "too much" = SPACE. "Empty" / "hollow" / "drifting" = SPIRIT.

4. ENERGY LANGUAGE — Hedging ("kind of", "maybe I should") = often a SPIRIT gap. Rapid-fire lists of attempts = they see the map, can't pick a road (Clear Mission). Passive constructions ("things just aren't clicking") = difficulty naming the body state. Urgency without direction = STORY gap.

5. THE INVERSION — Where does their self-diagnosis diverge from the actual pattern? The person who lists external problems but describes flow in purely internal terms has it backwards. Name the inversion. That's the tell.

The instinct scores are a weak prior, not a verdict — confirm or override them from the text. Write from these cross-patterns. Never paraphrase what they said. Name the structure underneath it.`;
