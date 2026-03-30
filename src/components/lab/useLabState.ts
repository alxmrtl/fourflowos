'use client';

import { useState, useCallback, useEffect } from 'react';

export type Phase = 'breath' | 'fields';
export type FieldId = 'consume' | 'create' | 'catalyze' | 'core';
export type ToolId = 'flowread' | 'compendium' | 'flowzone' | 'curiosity' | 'breathwork' | 'training' | 'profile';

export function useLabState() {
  const [phase, setPhase] = useState<Phase>('breath');
  const [activeField, setActiveField] = useState<FieldId | null>(null);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [isMeta, setIsMeta] = useState(false);
  const [lastField, setLastField] = useState<FieldId | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const completed = localStorage.getItem('flowlab_breath_completed') === 'true';
    if (completed) setPhase('fields');
    const last = localStorage.getItem('flowlab_last_field') as FieldId | null;
    if (last) setLastField(last);
  }, []);

  const skipBreath = useCallback(() => setPhase('fields'), []);

  const completeBreath = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowlab_breath_completed', 'true');
    }
    setPhase('fields');
  }, []);

  const enterField = useCallback((field: FieldId) => {
    setActiveField(field);
    setLastField(field);
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowlab_last_field', field);
    }
  }, []);

  const enterTool = useCallback((tool: ToolId) => {
    setActiveTool(tool);
  }, []);

  const exitTool = useCallback(() => {
    setActiveTool(null);
  }, []);

  const toggleMeta = useCallback(() => setIsMeta(prev => !prev), []);

  const recentre = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('flowlab_breath_completed');
    }
    setPhase('breath');
    setIsMeta(false);
    setActiveField(null);
    setActiveTool(null);
  }, []);

  return {
    phase,
    activeField,
    activeTool,
    isMeta,
    lastField,
    skipBreath,
    completeBreath,
    enterField,
    enterTool,
    exitTool,
    toggleMeta,
    recentre,
  };
}
