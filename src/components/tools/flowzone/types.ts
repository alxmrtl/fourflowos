export interface Priority {
  id: string;
  text: string;
}

export interface FlowSessionData {
  id: string;
  priorityId: string;
  priorityText: string;
  durationMinutes: number;
  focusReps: number;
  startedAt: number;
  completedAt: number;
}

export interface DayData {
  date: string; // YYYY-MM-DD
  priorities: Priority[];
  sessions: FlowSessionData[];
}

export type Phase = 'dashboard' | 'flow';

export interface BreathworkPattern {
  id: string;
  name: string;
  description: string;
  phases: BreathworkPhase[];
  cycleDurationMs: number;
}

export interface BreathworkPhase {
  label: string;
  durationMs: number;
}

export interface AmbientSound {
  id: string;
  name: string;
  icon: string;
}

export interface CuratedPlaylistItem {
  id: string;
  title: string;
  youtubeId: string;
}

export type AudioSource = 'none' | 'white-noise' | 'rain' | 'binaural' | string;
// curated youtube ids are stored as 'yt:videoId', custom as 'yt-custom'

export interface FlowSettings {
  timerMinutes: number;
  breathworkPatternId: string;
  breathworkPre: boolean;
  breathworkPost: boolean;
  audioSource: AudioSource;
  audioVolume: number;
  youtubeCustomUrl: string;
}
