import { useState, useEffect, useCallback } from 'react';
import {
  Tab,
  TrainingMode,
  SavedText,
  TrainingSettings,
  FontType,
} from './types';
import { STORAGE_KEYS, DEFAULT_WPM, DEFAULT_FONT_SIZE, SAMPLE_TEXTS } from './constants';

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const DEFAULT_SETTINGS: TrainingSettings = {
  wpm: DEFAULT_WPM,
  fontSize: DEFAULT_FONT_SIZE,
  fontType: 'serif',
  selectedTextId: 'sample-0',
};

export function useFlowReadStore() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('train');

  // Training state
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('word');
  const [settings, setSettings] = useState<TrainingSettings>(DEFAULT_SETTINGS);
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Modal state
  const [textModalOpen, setTextModalOpen] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    setSavedTexts(loadFromStorage(STORAGE_KEYS.savedTexts, []));
    setSettings(loadFromStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS));
    setMounted(true);
  }, []);

  // Persist saved texts
  useEffect(() => {
    if (mounted) saveToStorage(STORAGE_KEYS.savedTexts, savedTexts);
  }, [savedTexts, mounted]);

  // Persist settings
  useEffect(() => {
    if (mounted) saveToStorage(STORAGE_KEYS.settings, settings);
  }, [settings, mounted]);

  // Settings updates
  const updateSettings = useCallback((partial: Partial<TrainingSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const setWpm = useCallback((wpm: number) => {
    updateSettings({ wpm });
  }, [updateSettings]);

  const setFontSize = useCallback((fontSize: number) => {
    updateSettings({ fontSize });
  }, [updateSettings]);

  const setFontType = useCallback((fontType: FontType) => {
    updateSettings({ fontType });
  }, [updateSettings]);

  const selectText = useCallback((textId: string | null) => {
    updateSettings({ selectedTextId: textId });
  }, [updateSettings]);

  // Get selected text content
  const getSelectedText = useCallback((): { title: string; content: string; wordCount: number } | null => {
    const { selectedTextId } = settings;
    if (!selectedTextId) return null;

    // Check sample texts
    const sampleText = SAMPLE_TEXTS.find((t) => t.id === selectedTextId);
    if (sampleText) return sampleText;

    // Check saved texts
    const savedText = savedTexts.find((t) => t.id === selectedTextId);
    if (savedText) return { title: savedText.title, content: savedText.content, wordCount: savedText.wordCount };

    return null;
  }, [settings, savedTexts]);

  // Saved text functions
  const addSavedText = useCallback((title: string, content: string) => {
    const wordCount = content.trim().split(/\s+/).length;
    const newText: SavedText = {
      id: generateId(),
      title: title.trim() || `Custom Text ${savedTexts.length + 1}`,
      content: content.trim(),
      wordCount,
      createdAt: Date.now(),
    };
    setSavedTexts((prev) => [newText, ...prev]);
    return newText;
  }, [savedTexts.length]);

  const deleteSavedText = useCallback((id: string) => {
    setSavedTexts((prev) => prev.filter((t) => t.id !== id));
    // If deleting the selected text, clear selection
    if (settings.selectedTextId === id) {
      updateSettings({ selectedTextId: 'sample-0' });
    }
  }, [settings.selectedTextId, updateSettings]);

  // Training control
  const startTraining = useCallback(() => {
    setIsTraining(true);
    setIsPaused(false);
    setCurrentIndex(0);
    setTrainingProgress(0);
  }, []);

  const pauseTraining = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTraining = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stopTraining = useCallback(() => {
    setIsTraining(false);
    setIsPaused(false);
    setCurrentIndex(0);
    setTrainingProgress(0);
  }, []);

  return {
    mounted,

    // Navigation
    activeTab,
    setActiveTab,

    // Training
    trainingMode,
    setTrainingMode,
    settings,
    updateSettings,
    setWpm,
    setFontSize,
    setFontType,
    selectText,
    getSelectedText,
    savedTexts,
    addSavedText,
    deleteSavedText,
    isTraining,
    isPaused,
    trainingProgress,
    setTrainingProgress,
    currentIndex,
    setCurrentIndex,
    startTraining,
    pauseTraining,
    resumeTraining,
    stopTraining,

    // Modal
    textModalOpen,
    setTextModalOpen,
  };
}
