export const STORAGE_KEY = 'ffos_flowwrite_v2';

export const DURATIONS = [5, 10, 15, 20];

/** Word goals offered in `words` mode; step the inline +/- by WORD_STEP. */
export const WORD_TARGETS = [150, 300, 500, 750];
export const DEFAULT_WORD_TARGET = 300;
export const WORD_STEP = 50;

/** Silence before the page starts to dim (flow mode) — near-immediate. */
export const STALL_GRACE_MS = 500;
/** How long the dim takes to settle in once stalled. */
export const DIM_RAMP_MS = 1800;
/** Maximum page dim — much dimmer now, but never pure black. */
export const DIM_MAX = 0.85;

/** Trace sampling: one sample per interval, rate measured over the window. */
export const SAMPLE_INTERVAL_MS = 500;
export const RATE_WINDOW_MS = 4000;
/** Keystrokes-per-second that counts as full intensity. */
export const RATE_FULL = 6;

/** A stall (for stats): silence longer than this. */
export const STALL_THRESHOLD_MS = 8000;
