'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export type FieldId = 'core' | 'consume' | 'catalyze' | 'create';
export type ToolId = 'flow-lens' | 'ancestral-signal' | 'flowread' | 'compendium' | 'breathwork' | 'curiosity' | 'flowzone' | 'flowwrite' | 'training';

const LAST_TOOL_KEY = 'flowlab_last_tool';
const VALID_TOOLS: ToolId[] = ['flow-lens', 'ancestral-signal', 'flowread', 'compendium', 'breathwork', 'curiosity', 'flowzone', 'flowwrite', 'training'];

export function useLabState() {
  const searchParams = useSearchParams();
  const urlTool = searchParams.get('tool') as ToolId | null;

  const [activeTool, setActiveToolState] = useState<ToolId>('flow-lens');

  // Runs on mount and whenever the URL ?tool= param changes —
  // covers both initial load and same-page navigation (e.g. /me?tool=flowzone link)
  useEffect(() => {
    if (urlTool && VALID_TOOLS.includes(urlTool)) {
      setActiveToolState(urlTool);
      return;
    }
    const stored = localStorage.getItem(LAST_TOOL_KEY) as ToolId | null;
    if (stored) setActiveToolState(stored);
  }, [urlTool]);

  const setActiveTool = useCallback((tool: ToolId) => {
    setActiveToolState(tool);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_TOOL_KEY, tool);
    }
  }, []);

  return { activeTool, setActiveTool };
}
