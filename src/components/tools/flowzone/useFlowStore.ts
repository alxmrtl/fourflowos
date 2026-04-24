import { useState, useEffect, useCallback } from 'react';
import { Priority, FlowSessionData, DayData, Phase, FlowSettings } from './types';

const STORAGE_KEY = 'fourflow-flowzone';
const SETTINGS_KEY = 'fourflow-flowzone-settings';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function loadDay(): DayData {
  if (typeof window === 'undefined') return { date: todayKey(), priorities: [], sessions: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: DayData = JSON.parse(raw);
      if (parsed.date === todayKey()) return parsed;
    }
  } catch { /* ignore */ }
  return { date: todayKey(), priorities: [], sessions: [] };
}

function saveDay(data: DayData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

const DEFAULT_SETTINGS: FlowSettings = {
  timerMinutes: 25,
  breathworkPatternId: 'box',
  breathworkPre: false,
  breathworkPost: false,
  breathworkCycles: 5,
  audioSource: 'none',
  audioVolume: 0.5,
  youtubeCustomUrl: '',
};

function loadSettings(): FlowSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: FlowSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch { /* ignore */ }
}

export function useFlowStore() {
  const [dayData, setDayData] = useState<DayData>({ date: todayKey(), priorities: [], sessions: [] });
  const [phase, setPhase] = useState<Phase>('dashboard');
  const [selectedPriorityId, setSelectedPriorityId] = useState<string | null>(null);
  const [settings, setSettings] = useState<FlowSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDayData(loadDay());
    setSettings(loadSettings());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveDay(dayData);
  }, [dayData, mounted]);

  useEffect(() => {
    if (mounted) saveSettings(settings);
  }, [settings, mounted]);

  const updateSettings = useCallback((partial: Partial<FlowSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const addPriority = useCallback((text: string) => {
    if (!text.trim()) return;
    setDayData(prev => ({
      ...prev,
      priorities: [...prev.priorities, { id: generateId(), text: text.trim() }],
    }));
  }, []);

  const removePriority = useCallback((id: string) => {
    setDayData(prev => ({
      ...prev,
      priorities: prev.priorities.filter(p => p.id !== id),
    }));
    setSelectedPriorityId(prev => (prev === id ? null : prev));
  }, []);

  const updatePriority = useCallback((id: string, text: string) => {
    setDayData(prev => ({
      ...prev,
      priorities: prev.priorities.map(p => (p.id === id ? { ...p, text } : p)),
    }));
  }, []);

  const addSession = useCallback((session: Omit<FlowSessionData, 'id'>) => {
    setDayData(prev => ({
      ...prev,
      sessions: [...prev.sessions, { ...session, id: generateId() }],
    }));
  }, []);

  const totalMinutes = dayData.sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalReps = dayData.sessions.reduce((sum, s) => sum + s.focusReps, 0);
  const sessionCount = dayData.sessions.length;

  const selectedPriority = dayData.priorities.find(p => p.id === selectedPriorityId) || null;

  const completePriority = useCallback((id: string) => {
    setDayData(prev => ({
      ...prev,
      priorities: prev.priorities.map(p => p.id === id ? { ...p, completed: true } : p),
    }));
  }, []);

  const activePriorities = dayData.priorities.filter(p => !p.completed);
  const donePriorities   = dayData.priorities.filter(p =>  p.completed);

  const resetDay = useCallback(() => {
    setDayData({ date: todayKey(), priorities: [], sessions: [] });
    setSelectedPriorityId(null);
  }, []);

  return {
    dayData,
    phase,
    setPhase,
    selectedPriorityId,
    setSelectedPriorityId,
    selectedPriority,
    settings,
    updateSettings,
    addPriority,
    removePriority,
    updatePriority,
    completePriority,
    activePriorities,
    donePriorities,
    addSession,
    totalMinutes,
    totalReps,
    sessionCount,
    resetDay,
    mounted,
  };
}
