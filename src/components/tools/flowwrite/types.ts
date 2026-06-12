export type WritePhase = 'setup' | 'writing' | 'complete';

export interface FlowWriteSettings {
  durationMinutes: number;
  /** Flow mode: the page dims when you stall; typing restores the light. */
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
