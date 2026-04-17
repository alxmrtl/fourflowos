/**
 * Demo profile used for design preview of the Flow Lens output (V4).
 * Replace with real AI-generated data once live.
 */

export interface FlowLensDisplayProfile {
  id: string;
  gravity_pillar: string;
  blind_side_pillar: string;
  profile_text: string;
  profile_json: {
    pillar_scores?: Record<string, number>;
    sections?: Record<string, string>;
    // V4 structured output
    gravity_bullets?: string[];
    blind_side_bullets?: string[];
    the_tell?: string;
    the_move?: string;
    tool_prescription?: string;
    technique_prescriptions?: { name: string; prescription: string }[];
    concept_prescription?: { name: string; why: string };
  } | null;
  recommendations: { type: string; title: string; pillar: string; path?: string; route?: string }[] | null;
  generated_at: string;
}

export const DEMO_PROFILE: FlowLensDisplayProfile = {
  id: 'demo',
  gravity_pillar: 'self',
  blind_side_pillar: 'story',
  profile_text: '',
  profile_json: {
    pillar_scores: { self: 18, space: 10, story: 6, spirit: 12 },
    gravity_bullets: [
      'You read internal state with uncommon precision — body signals, energy shifts, emotional weather all register before your conscious mind names them.',
      'This makes you a reliable operator when you\'re right with yourself, and a near-impossible starter when you\'re not.',
      'The constraint: felt-sense has become a permission slip. You move when the signal clears, not when the work demands it.',
    ],
    blind_side_bullets: [
      'Direction and narrative are the last things you attend to — not because they don\'t matter, but because they don\'t feel like anything.',
      'You sustain intense effort without checking whether the aim is still right. Output accumulates; direction drifts.',
      'This doesn\'t cost you work. It costs you work that compounds toward something.',
    ],
    the_tell: 'You listed every internal obstacle with clinical precision — breath, tension, the fog. But when you described your last flow state, you named the conditions almost entirely in terms of outputs: what you got done, what clicked, what moved. The body awareness is your strongest signal. The missing read is where that energy is pointed.',
    the_move: 'Your somatic precision is functioning as a launch system — you\'re waiting for the body to clear before you commit direction. The unlock: let body awareness calibrate aim, not replace it. Thirty seconds before each session: name the state you\'re in, then name the one outcome that would make this session worth the energy.',
    tool_prescription: 'FlowZone makes each rep directional — you set a specific deliverable before the timer starts. It routes your natural state-awareness into "is this the right thing to push on?" before you commit the energy.',
    technique_prescriptions: [
      {
        name: 'One Thing Card',
        prescription: 'Physical card, one sentence: "Today, the only thing that matters is ___." It converts the somatic readiness you\'re good at into a pointed start condition.',
      },
      {
        name: 'Body State Check',
        prescription: '60-second somatic scan followed immediately by one named outcome — marries your instinctive body read with the directional clarity you tend to defer.',
      },
      {
        name: 'Reframe Via Arc',
        prescription: 'Name the current stuckness as a story stage, not a system failure. You\'re not broken — you\'re in the ordeal. Naming it activates the narrative instead of the self-regulation loop.',
      },
    ],
    concept_prescription: {
      name: 'Default Mode Network',
      why: 'Your brain is processing direction during rest, not during effort — understanding this changes how you use downtime and why clarity comes when you stop trying.',
    },
  },
  recommendations: [
    { type: 'technique', title: 'One Thing Card',     pillar: 'story' },
    { type: 'technique', title: 'Body State Check',   pillar: 'story' },
    { type: 'technique', title: 'Reframe Via Arc',    pillar: 'story' },
    { type: 'tool',      title: 'FlowCompendium',     pillar: 'story', route: '/me?tool=compendium' },
  ],
  generated_at: new Date().toISOString(),
};

export const ELEMENT_SRC: Record<string, string> = {
  self:   '/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png',
  space:  '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png',
  story:  '/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png',
  spirit: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPIRIT - Circle.png',
};

export const BG_CIRCLE_SRC = '/assets/LOGOS/MAIN LOGO - ELEMENTS/BG CIRCLE.png';

export const TOOL_ICON: Record<string, string> = {
  FlowZone:       '/assets/apps/flowzone-icon.png',
  FlowRead:       '/assets/apps/flowread-icon.png',
  FlowBreath:     '/assets/LOGOS/FOCUSED BODY.png',
  FlowSpark:      '/assets/LOGOS/IGNITED CURIOSITY.png',
  FlowCompendium: '/assets/LOGOS/OPEN MIND.png',
  Training:       '/assets/LOGOS/OPEN MIND.png',
};
