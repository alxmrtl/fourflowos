export const STORAGE_KEY = 'ffos_flowwrite_v1';

export const DURATIONS = [5, 10, 15, 20];

/** Seconds of silence before the page starts to dim (flow mode). */
export const STALL_GRACE_MS = 5000;
/** How long the dim takes to settle in once stalled. */
export const DIM_RAMP_MS = 4000;
/** Maximum page dim — never punitive, never black. */
export const DIM_MAX = 0.55;

/** Trace sampling: one sample per interval, rate measured over the window. */
export const SAMPLE_INTERVAL_MS = 500;
export const RATE_WINDOW_MS = 4000;
/** Keystrokes-per-second that counts as full intensity. */
export const RATE_FULL = 6;

/** A stall (for stats): silence longer than this. */
export const STALL_THRESHOLD_MS = 8000;

export const STARTER_PROMPTS = [
  'What is actually on your mind right now?',
  'Describe the last time work felt effortless.',
  'What would you make if nobody was watching?',
  'Write the first paragraph of the thing you keep postponing.',
  'What does the next year look like if it goes right?',
];
