export type WritePhase = 'writing' | 'complete';

/** What the session aims at: a stretch of time, a word count, or nothing (free write). */
export type TargetMode = 'time' | 'words' | 'open';

export interface FlowWriteSettings {
  /** Which kind of target the writer is working toward. */
  targetMode: TargetMode;
  durationMinutes: number;
  /** Word goal for `words` mode. */
  wordTarget: number;
  /** Flow mode: text + colour respond to your momentum; off for a still surface. */
  flowMode: boolean;
  fontStyle: 'sans' | 'serif';
}

export interface FlowWriteSession {
  id: string;
  startedAt: number;
  durationMinutes: number;
  words: number;
  peakStreakSeconds: number;
  stallCount: number;
  /** Typing-rate samples (normalized 0–1) — the session's flow trace. */
  trace: number[];
}

export interface FlowWriteState {
  settings: FlowWriteSettings;
  /** Draft text survives reloads mid-session. */
  draft: string;
  sessions: FlowWriteSession[];
}
