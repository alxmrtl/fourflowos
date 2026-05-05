import { BreathworkPattern, AudioOption } from './types';

// Brand pillar colors — sourced from brand-colors.ts (single source of truth)
export { CORAL, SAGE, STEEL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';

// Four-pillar gradient
export const FOUR_PILLAR_GRADIENT = `linear-gradient(90deg, ${CORAL}, ${SAGE}, ${STEEL}, ${AMETHYST})`;

export const TIMER_OPTIONS = [
  { label: '25 min', minutes: 25 },
  { label: '45 min', minutes: 45 },
  { label: '60 min', minutes: 60 },
  { label: '90 min', minutes: 90 },
];

export const BREATHWORK_PATTERNS: BreathworkPattern[] = [
  {
    id: 'box',
    name: 'Box 4-4-4-4',
    benefit: 'Calm & Center',
    description: 'Equal inhale, hold, exhale, hold',
    phases: [
      { label: 'Inhale', durationMs: 4000 },
      { label: 'Hold',   durationMs: 4000, holdScale: 1.0 },
      { label: 'Exhale', durationMs: 4000 },
      { label: 'Hold',   durationMs: 4000, holdScale: 0.6 },
    ],
    cycleDurationMs: 16000,
  },
  {
    id: '478',
    name: '4-7-8 Pattern',
    benefit: 'Deep Relaxation',
    description: 'Extended exhale calms the nervous system',
    phases: [
      { label: 'Inhale', durationMs: 4000 },
      { label: 'Hold',   durationMs: 7000, holdScale: 1.0 },
      { label: 'Exhale', durationMs: 8000 },
    ],
    cycleDurationMs: 19000,
  },
  {
    id: 'coherent',
    name: '5.5-5.5 Rhythm',
    benefit: 'Heart Coherence',
    description: 'Syncs heart rate variability',
    phases: [
      { label: 'Inhale', durationMs: 5500 },
      { label: 'Exhale', durationMs: 5500 },
    ],
    cycleDurationMs: 11000,
  },
  {
    id: 'energize',
    name: '2-2 Rapid Cycles',
    benefit: 'Quick Energy',
    description: 'Fast breathing to boost alertness',
    phases: [
      { label: 'Inhale', durationMs: 2000 },
      { label: 'Exhale', durationMs: 2000 },
    ],
    cycleDurationMs: 4000,
  },
];

export const AUDIO_OPTIONS: AudioOption[] = [
  { id: 'white-noise', title: 'White Noise', subtitle: 'Broadband masking', source: 'generated' },
  { id: 'binaural', title: 'Binaural Beats', subtitle: 'Theta brainwave entrainment', source: 'generated' },
  { id: 'rain', title: 'Rain & Thunder', subtitle: 'Natural rain ambience', source: 'youtube', youtubeId: 'mPZkdNFkNps' },
  { id: 'lofi', title: 'Lofi Beats', subtitle: 'Chill instrumental hip-hop', source: 'youtube', youtubeId: 'jfKfPfyJRdk' },
  { id: 'nature', title: 'Forest Ambience', subtitle: 'Birds and flowing water', source: 'youtube', youtubeId: 'xNN7iTA57jM' },
  { id: 'classical', title: 'Classical Focus', subtitle: 'Bach, Debussy, Satie', source: 'youtube', youtubeId: 'WPni755-Krg' },
];

export const STRUGGLE_PHASE_RATIO = 0.25;
