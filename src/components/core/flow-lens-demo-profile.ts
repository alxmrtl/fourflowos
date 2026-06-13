/**
 * Display types + demo data for the Flow Unlock output (V5).
 * V4 fields are kept optional so profiles generated before the Key-level
 * upgrade still render through the legacy branch of FlowUnlockResult.
 */

import type { KeyId } from '@/data/flow-unlock-config';

export interface FlowLensDisplayProfile {
  id: string;
  gravity_pillar: string;
  blind_side_pillar: string;
  profile_text: string;
  profile_json: {
    version?: number;
    pillar_scores?: Record<string, number>;
    // V5 structured output (Key-level)
    bottleneck_key?: KeyId;
    overexposed_keys?: KeyId[];
    pattern_read?: string[];
    key_moves?: { key: KeyId; move: string }[];
    technique?: { name: string; prescription: string };
    situation?: string | null;
    // Shared
    the_tell?: string;
    recommended_tool?: string;
    tool_prescription?: string;
    // V4 legacy fields
    sections?: Record<string, string>;
    gravity_bullets?: string[];
    blind_side_bullets?: string[];
    the_move?: string;
    technique_prescriptions?: { name: string; prescription: string }[];
    concept_prescription?: { name: string; why: string };
  } | null;
  recommendations: { type: string; title: string; pillar: string; path?: string; route?: string }[] | null;
  generated_at: string;
}

/** Compact history row returned by /api/core/profiles. */
export interface FlowUnlockHistoryItem {
  id: string;
  bottleneck_key: KeyId | null;
  blind_side_pillar: string;
  move: string | null;
  generated_at: string;
}

export const DEMO_PROFILE: FlowLensDisplayProfile = {
  id: 'demo',
  gravity_pillar: 'spirit',
  blind_side_pillar: 'story',
  profile_text: '',
  profile_json: {
    version: 5,
    pillar_scores: { self: 6, space: 10, story: 4, spirit: 14 },
    bottleneck_key: 'clear-mission',
    overexposed_keys: ['ignited-curiosity', 'optimized-tools'],
    pattern_read: [
      'Your effort keeps going into new ideas and a better setup — the next spark, the next system, the next almost-ready workspace.',
      'All of it is standing in for the one decision you haven\'t made: which single thing this month is actually for.',
    ],
    the_tell: 'You described five projects in the present tense and the finish line in the conditional. The energy is real — it just has no address. When you can\'t say what today is for, every spark feels like progress and nothing compounds.',
    key_moves: [
      { key: 'ignited-curiosity', move: 'Keep the sparks — but log them in a ledger instead of starting them. A question that returns next week has earned attention; one that doesn\'t was weather.' },
      { key: 'optimized-tools', move: 'Freeze the setup for seven days. No new tools, no rearranging — the system you have is good enough to find out what the real blocker is.' },
      { key: 'clear-mission', move: 'Tonight, write one sentence: "This month, the only thing that matters is ___." Put it where you\'ll see it before you see your feeds.' },
    ],
    technique: {
      name: 'One Thing Card',
      prescription: 'A physical card with one sentence forces the decision your tools keep deferring — and puts it in your visual field before the sparks arrive.',
    },
    recommended_tool: 'none',
  },
  recommendations: [
    { type: 'technique', title: 'One Thing Card', pillar: 'story', path: 'compendium/framework/STORY/Clear-Mission/_techniques/one-thing-card.md' },
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
  FlowWrite:      '/assets/LOGOS/GENERATIVE STORY.png',
  'Timeless Map': '/assets/LOGOS/GROUNDING VALUES.png',
  FlowCompendium: '/assets/LOGOS/OPEN MIND.png',
  Training:       '/assets/LOGOS/OPEN MIND.png',
  FlowUnlock:     '/assets/apps/flowunlock-icon.png',
};
