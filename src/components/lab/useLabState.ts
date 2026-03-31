'use client';

import { useState, useCallback, useEffect } from 'react';

export type FieldId = 'core' | 'consume' | 'catalyze' | 'create';
export type ToolId = 'profile' | 'flowread' | 'compendium' | 'breathwork' | 'curiosity' | 'flowzone' | 'training';

const LAST_TOOL_KEY = 'flowlab_last_tool';

export function useLabState() {
  const [activeTool, setActiveToolState] = useState<ToolId>('profile');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(LAST_TOOL_KEY) as ToolId | null;
    if (stored) setActiveToolState(stored);
  }, []);

  const setActiveTool = useCallback((tool: ToolId) => {
    setActiveToolState(tool);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_TOOL_KEY, tool);
    }
  }, []);

  return { activeTool, setActiveTool };
}
