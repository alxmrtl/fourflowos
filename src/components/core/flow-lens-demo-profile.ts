/**
 * Demo profile used for design preview of the 3 Flow Lens output versions.
 * Uses the new structured format introduced in Phase C.
 * Replace with real AI-generated data once Phase C prompt is live.
 */

export interface FlowLensDisplayProfile {
  id: string;
  gravity_pillar: string;
  blind_side_pillar: string;
  profile_text: string;
  profile_json: {
    pillar_scores?: Record<string, number>;
    sections?: Record<string, string>;
    // Phase C structured output
    gravity_bullets?: string[];
    blind_side_bullets?: string[];
    the_move?: string;
    tool_prescription?: string;
    technique_prescriptions?: { name: string; prescription: string }[];
  } | null;
  recommendations: { type: string; title: string; pillar: string; path?: string }[] | null;
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
      'You read internal state with uncommon precision — body signals, energy shifts, emotional weather',
      'This makes you a highly reliable operator when you are right with yourself',
      'The constraint: felt-sense becomes a permission slip instead of a launch condition',
    ],
    blind_side_bullets: [
      'Direction and narrative are consistently the last things you attend to',
      'You sustain intense effort without pausing to check whether the aim is still right',
      'This does not cost you output — it costs you output that compounds toward something',
    ],
    the_move:
      'Your somatic precision functions as a permission system — you move when you feel aligned. The unlock: let body awareness calibrate direction, not replace it. Before each session, 30 seconds to name one concrete outcome.',
    tool_prescription:
      'FlowZone makes each focus rep directional — you set a specific deliverable before the timer starts. It channels your natural state-awareness into "is this worth pushing on?" before you commit the energy.',
    technique_prescriptions: [
      {
        name: 'Movement Primer',
        prescription:
          '3-min activation converts physical readiness into directional readiness — pairs your strongest signal with what you tend to skip',
      },
      {
        name: 'Body State Check',
        prescription:
          '30-sec somatic scan + one named outcome. Marries your instinctive body read with the directional clarity you tend to defer',
      },
    ],
  },
  recommendations: [
    { type: 'technique', title: 'Movement Primer', pillar: 'self' },
    { type: 'technique', title: 'Body State Check', pillar: 'self' },
    { type: 'tool', title: 'FlowZone', pillar: 'self' },
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
  FlowZone:  '/assets/apps/flowzone-icon.png',
  FlowRead:  '/assets/apps/flowread-icon.png',
  FlowBreath: '/assets/LOGOS/FOCUSED BODY.png',
  FlowSpark:  '/assets/LOGOS/IGNITED CURIOSITY.png',
  Training:   '/assets/LOGOS/OPEN MIND.png',
};
