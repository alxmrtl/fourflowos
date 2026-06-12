/**
 * Flow Unlock — shared config consumed by both the API route and the admin prompt inspector.
 * Editing here updates both generation behavior and the admin display simultaneously.
 */

export type Pillar = 'self' | 'space' | 'story' | 'spirit';

// ─── Technique pools ──────────────────────────────────────────────────────────

export const PILLAR_TECHNIQUES: Record<Pillar, { title: string; path: string; description: string }[]> = {
  self: [
    { title: 'Pre-Session Clearance', path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/pre-session-clearance.md',    description: 'Witness emotional residue before work starts — without trying to fix it' },
    { title: 'Body State Check',      path: 'compendium/framework/SELF/Focused-Body/_techniques/body-state-check.md',           description: 'Rapid somatic scan: read arousal level, breath, tension, then match a regulation tool to what you find' },
    { title: 'Breath Regulation',     path: 'compendium/framework/SELF/Focused-Body/_techniques/breath-regulation.md',          description: 'Three-tool approach: cyclic sighing for daily reset, resonance breathing pre-session, 4-7-8 for acute moments' },
    { title: 'Observer Redirect',     path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/observer-redirect.md',        description: 'Shift from "I am the reaction" to "I am watching it" — then redirect toward the work\'s effect' },
    { title: 'Flow Channel Formula',  path: 'compendium/framework/SELF/Tuned-Emotions/_techniques/flow-channel-formula.md',     description: 'Check the challenge-skill ratio before starting — diagnose boredom, anxiety, or the flow channel' },
    { title: 'Movement Primer',       path: 'compendium/framework/SELF/Focused-Body/_techniques/movement-primer.md',            description: 'Brief physical activation before cognitive work — converts physical readiness into mental readiness' },
  ],
  space: [
    { title: 'Physical Space Audit',        path: 'compendium/framework/SPACE/Intentional-Space/_techniques/physical-space-audit.md',             description: 'Clear workspace completely; return only what\'s needed today; apply the open-loop test to every object' },
    { title: 'Micro-Review Loop',           path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/micro-review-loop.md',                 description: 'Two-minute pause at each work-unit boundary: one observation captured before the next unit starts' },
    { title: 'Signal vs Noise Filter',      path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/signal-vs-noise-filter.md',            description: 'Audit which inputs actually move the work — cut what doesn\'t, weight what does' },
    { title: 'Environmental Trigger Stack', path: 'compendium/framework/SPACE/Intentional-Space/_techniques/environmental-trigger-stack.md',       description: 'Stack sensory channels (sound, scent, light, posture) to condition the brain into focus state on cue' },
    { title: 'Progress Dashboard',          path: 'compendium/framework/SPACE/Feedback-Systems/_techniques/progress-dashboard.md',                 description: 'Display 1-3 metrics that update immediately after each work unit — makes momentum visible' },
    { title: 'One-Click Session Launch',    path: 'compendium/framework/SPACE/Optimized-Tools/_techniques/one-click-session-launch.md',           description: 'Collapse session-start to a single trigger by automating all non-decision steps' },
  ],
  story: [
    { title: 'One Thing Card',          path: 'compendium/framework/STORY/Clear-Mission/_techniques/one-thing-card.md',            description: 'Physical card: "Today, the only thing that matters is ___" — one sentence, primary visual field' },
    { title: 'Reframe Via Arc',         path: 'compendium/framework/STORY/Generative-Story/_techniques/reframe-via-arc.md',        description: 'Name the current stuckness as a story stage (ordeal, threshold, refusal) and name what comes next' },
    { title: 'Momentum Ledger',         path: 'compendium/framework/STORY/Generative-Story/_techniques/momentum-ledger.md',        description: 'Daily log: what moved, what unlocked, the living edge — weekly review compounds direction' },
    { title: 'Sub-Goal Decomposition',  path: 'compendium/framework/STORY/Clear-Mission/_techniques/sub-goal-decomposition.md',    description: 'Break distant targets into near wins with enough resolution to start today' },
    { title: 'Open Loop Closure',       path: 'compendium/framework/STORY/Clear-Mission/_techniques/open-loop-closure.md',         description: 'Identify and close incomplete tasks draining background cognitive load' },
    { title: 'Goal Hierarchy Cascade',  path: 'compendium/framework/STORY/Clear-Mission/_techniques/goal-hierarchy-cascade.md',   description: '5-level structure: 10-year direction → 1-year milestone → monthly → weekly → today\'s lever' },
  ],
  spirit: [
    { title: 'Excitement as GPS',           path: 'compendium/framework/SPIRIT/Ignited-Curiosity/_techniques/excitement-as-gps.md',            description: 'Treat genuine excitement as directional signal — follow it even when the destination isn\'t clear' },
    { title: 'Clean/Dirty Fuel Assessment', path: 'compendium/framework/SPIRIT/Ignited-Curiosity/_techniques/clean-dirty-fuel-assessment.md', description: 'Three diagnostics: pushed vs pulled, why-deepening, process vs completion orientation — the anonymity test reveals most' },
    { title: 'Integrity Gap Audit',         path: 'compendium/framework/SPIRIT/Grounding-Values/_techniques/integrity-gap-audit.md',           description: 'Three-column map: stated values vs revealed values (calendar, behavior) vs the gap — monthly review' },
    { title: 'Values Stress Test',          path: 'compendium/framework/SPIRIT/Grounding-Values/_techniques/values-stress-test.md',            description: 'Construct worst-case where the value costs something real — tests whether it holds or was just preference' },
    { title: 'Evidence Audit',              path: 'compendium/framework/SPIRIT/Visualized-Vision/_techniques/evidence-audit.md',               description: 'Distinguish evaluating direction by the mirror\'s current state vs internal clarity — separate signal from fear' },
    { title: 'Pattern Literacy',            path: 'compendium/framework/SPIRIT/Ignited-Curiosity/_techniques/pattern-literacy.md',             description: 'Read recurring themes in your work and energy — what keeps surfacing is data' },
  ],
};

// ─── Concept pool (one per blind-side pillar) ─────────────────────────────────

export const PILLAR_CONCEPTS: Record<Pillar, { name: string; domain: string }> = {
  self:   { name: 'Polyvagal Theory',          domain: 'nervous system regulation' },
  space:  { name: 'Minimal Effective Feedback', domain: 'feedback system design' },
  story:  { name: 'Default Mode Network',       domain: 'how the brain processes direction during rest' },
  spirit: { name: 'Intrinsic Motivation',       domain: 'distinguishing genuine pull from performance anxiety' },
};

// ─── Practice tools (one per blind-side pillar) ───────────────────────────────

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

// ─── Pillar domain definitions (used in prompt) ───────────────────────────────

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
FORBIDDEN constructions: em dash overuse; rule-of-three lists that feel padded; "Furthermore / Moreover / Additionally" transitions; anything starting with "You are someone who..."; softening hedges used to avoid committing to the insight
FORBIDDEN tone: fake warmth ("That's incredible"), performative affirmations, corporate-speak

REQUIRED voice:
- Plain, body-grounded language. No radio-engineering metaphor in output: never "signal", "reception", "frequency", "channel", "wiring", "interference". People don't experience their inner life as a signal chain. Write "your state runs hot", not "you receive signal fast". Native words: state, setup, pattern, loop, drift, pull, friction.
- Short declarative sentences. No compound-clause hedging.
- Name the specific pattern, not the category. Not "you struggle with focus" — "you're running output with no input loop. Nothing comes back in to correct course."
- Honest about the blind side. Warmth through specificity, not softening.
- Present tense. "This is what's happening" not "this may be what's happening."
- If they used a specific word (like "spiral", "drowning", "stuck"), you can mirror it once — then name what's underneath it.
- "the_tell" especially must feel like a sharp observation no generic tool could make.

No framework jargon: no "pillar", "gravity", "blind side", "SELF/SPACE/STORY/SPIRIT", "Flow Key", "FourFlow".
Name domains directly: body/mind/emotions, environment/tools, direction/goals, purpose/values.`;

// ─── Psycholinguistic analysis instructions (injected into prompt) ────────────

export const PSYCHOLINGUISTIC_INSTRUCTIONS = `Before writing a single word of output, work through these in order:

1. ATTRIBUTION STYLE — How do they frame their obstacle? Internal (body/emotion/mental state) → self signal. Environmental (tools/setup/noise) → space signal. Directional (no clear path/goal) → story signal. Meaning-based (pointless/empty/disconnected) → spirit signal. Often this diverges from their instinct score. The divergence is data.

2. ABSENT SIGNAL — What did they NOT mention in their flow description? If they described their last flow state without once mentioning how their body felt → self blind spot tell. No environment details → space blind spot. No purpose or meaning → spirit blind spot. What's missing is as diagnostic as what's there.

3. METAPHOR REGISTER — What spatial metaphors do they reach for? "Walls closing in" / "can't breathe" = threat/self. "Going in circles" / "spinning" = story. "Noise everywhere" / "too much" = space. "Empty" / "hollow" / "drifting" = spirit. The metaphor reveals the domain they're operating in.

4. ENERGY LANGUAGE — Do they hedge or assert? Hedging ("kind of", "I think", "maybe I should") = low signal certainty, often spirit gap. Rapid-fire lists in the obstacle description = story orientation (they see the map, can't move on it). Passive constructions ("things just aren't clicking") = difficulty naming the body state, often self blind spot. Urgency without direction = story gap.

5. THE INVERSION — Where does their self-diagnosis diverge from the actual pattern? The person who lists external problems but describes flow in purely internal terms has the inversion backwards. Name the inversion. That's the tell.

Write from these cross-patterns. Never paraphrase what they said. Name the structure underneath it.`;
