'use client';

import { useState, useCallback, useEffect } from 'react';

export type FieldId = 'core' | 'consume' | 'catalyze' | 'create';
export type ToolId = 'flow-lens' | 'ancestral-signal' | 'flowread' | 'compendium' | 'breathwork' | 'curiosity' | 'flowzone' | 'training';

const LAST_TOOL_KEY = 'flowlab_last_tool';
const VALID_TOOLS: ToolId[] = ['flow-lens', 'ancestral-signal', 'flowread', 'compendium', 'breathwork', 'curiosity', 'flowzone', 'training'];

export function useLabState() {
  const [activeTool, setActiveToolState] = useState<ToolId>('flow-lens');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // URL param takes priority (e.g. /me?tool=flowzone from Practice page)
    const params = new URLSearchParams(window.location.search);
    const urlTool = params.get('tool') as ToolId | null;
    if (urlTool && VALID_TOOLS.includes(urlTool)) {
      setActiveToolState(urlTool);
      return;
    }
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
