'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_WORD_TARGET, STORAGE_KEY } from './constants';
import type { FlowWriteSession, FlowWriteSettings, FlowWriteState } from './types';

const DEFAULT_STATE: FlowWriteState = {
  settings: { targetMode: 'time', durationMinutes: 10, wordTarget: DEFAULT_WORD_TARGET, flowMode: true, fontStyle: 'serif' },
  draft: '',
  sessions: [],
};

function load(): FlowWriteState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<FlowWriteState>;
    return {
      settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
      draft: parsed.draft ?? '',
      sessions: parsed.sessions ?? [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function persist(state: FlowWriteState) {
  try {
    // Keep the history light — stats live in Supabase for signed-in users.
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      sessions: state.sessions.slice(-20),
    }));
  } catch { /* storage full or unavailable — session still works in memory */ }
}

export function useFlowWriteStore() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<FlowWriteState>(DEFAULT_STATE);

  useEffect(() => {
    setState(load());
    setMounted(true);
  }, []);

  const update = useCallback((updater: (prev: FlowWriteState) => FlowWriteState) => {
    setState(prev => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const setSettings = useCallback((settings: Partial<FlowWriteSettings>) => {
    update(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
  }, [update]);

  const setDraft = useCallback((draft: string) => {
    update(prev => ({ ...prev, draft }));
  }, [update]);

  const addSession = useCallback((session: FlowWriteSession) => {
    update(prev => ({ ...prev, sessions: [...prev.sessions, session], draft: '' }));
  }, [update]);

  return { mounted, ...state, setSettings, setDraft, addSession };
}
