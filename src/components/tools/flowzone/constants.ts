import { BreathworkPattern, AmbientSound, CuratedPlaylistItem } from './types';

export const SAGE = '#6BA292';

export const TIMER_OPTIONS = [
  { label: '25 min', minutes: 25 },
  { label: '45 min', minutes: 45 },
  { label: '60 min', minutes: 60 },
  { label: '90 min', minutes: 90 },
];

export const BREATHWORK_PATTERNS: BreathworkPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: '4-4-4-4 — Equal inhale, hold, exhale, hold',
    phases: [
      { label: 'Inhale', durationMs: 4000 },
      { label: 'Hold', durationMs: 4000 },
      { label: 'Exhale', durationMs: 4000 },
      { label: 'Hold', durationMs: 4000 },
    ],
    cycleDurationMs: 16000,
  },
  {
    id: '478',
    name: '4-7-8 Relaxing',
    description: '4-7-8 — Deep calming breath',
    phases: [
      { label: 'Inhale', durationMs: 4000 },
      { label: 'Hold', durationMs: 7000 },
      { label: 'Exhale', durationMs: 8000 },
    ],
    cycleDurationMs: 19000,
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: '5.5-5.5 — Heart-brain coherence',
    phases: [
      { label: 'Inhale', durationMs: 5500 },
      { label: 'Exhale', durationMs: 5500 },
    ],
    cycleDurationMs: 11000,
  },
  {
    id: 'energize',
    name: 'Energizing Breath',
    description: '2-2 — Quick energizing cycles',
    phases: [
      { label: 'Inhale', durationMs: 2000 },
      { label: 'Exhale', durationMs: 2000 },
    ],
    cycleDurationMs: 4000,
  },
];

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'white-noise', name: 'White Noise', icon: '〰️' },
  { id: 'rain', name: 'Rain', icon: '🌧' },
  { id: 'binaural', name: 'Binaural Beats', icon: '🎧' },
];

export const CURATED_PLAYLISTS: CuratedPlaylistItem[] = [
  { id: 'lofi-1', title: 'Lofi Focus Beats', youtubeId: 'jfKfPfyJRdk' },
  { id: 'ambient-1', title: 'Deep Focus Ambient', youtubeId: 'aLqc-rFTCD0' },
  { id: 'nature-1', title: 'Forest Sounds', youtubeId: 'xNN7iTA57jM' },
  { id: 'classical-1', title: 'Classical Focus', youtubeId: 'WPni755-Krg' },
];

export const STRUGGLE_PHASE_RATIO = 0.25;
