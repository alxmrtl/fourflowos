export type TrainingMode = 'word' | 'phrases';
export type Tab = 'train' | 'about';
export type FontType = 'serif' | 'sans';

export interface SavedText {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: number;
}

export interface TrainingSettings {
  wpm: number;
  fontSize: number;
  fontType: FontType;
  selectedTextId: string | null;
}

export interface FlowReadState {
  // Navigation
  activeTab: Tab;

  // Training state
  trainingMode: TrainingMode;
  settings: TrainingSettings;
  savedTexts: SavedText[];
  isTraining: boolean;
  isPaused: boolean;
  trainingProgress: number; // 0-1
  currentIndex: number;

  // Text management modal
  textModalOpen: boolean;
}
