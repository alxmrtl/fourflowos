'use client';

import { useState, useCallback, useRef } from 'react';
import { sm2Update } from '@/lib/sm2';
import type { QueueItem, QueueStats, Quality, ReviewUpdate, QualityReview } from '@/types/training';

interface SessionResult {
  quality_id: string;
  quality: Quality | 'studied';
  title: string;
}

interface TrainingState {
  queue: QueueItem[];
  currentIndex: number;
  stats: QueueStats | null;
  sessionResults: SessionResult[];
  isLoading: boolean;
  error: string | null;
  sessionComplete: boolean;
  sessionId: string | null;
}

const INITIAL_REVIEW: Pick<QualityReview, 'ease_factor' | 'interval_days' | 'repetitions'> = {
  ease_factor: 2.5,
  interval_days: 1,
  repetitions: 0,
};

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

export function useTrainingStore() {
  const [state, setState] = useState<TrainingState>({
    queue: [],
    currentIndex: 0,
    stats: null,
    sessionResults: [],
    isLoading: true,
    error: null,
    sessionComplete: false,
    sessionId: null,
  });

  // Use ref to avoid stale closures in rateCard
  const stateRef = useRef(state);
  stateRef.current = state;

  const loadQueue = useCallback(async (params?: { pillar?: string; key?: string; mode?: string }) => {
    setState(s => ({ ...s, isLoading: true, error: null, sessionComplete: false, currentIndex: 0, sessionResults: [], queue: [], sessionId: null }));

    try {
      const searchParams = new URLSearchParams();
      if (params?.mode) searchParams.set('mode', params.mode);
      if (params?.pillar) searchParams.set('pillar', params.pillar);
      if (params?.key) searchParams.set('key', params.key);
      const qs = searchParams.toString();
      const url = `/api/train/queue${qs ? `?${qs}` : ''}`;

      const res = await fetch(url);
      if (res.status === 401) {
        setState(s => ({ ...s, isLoading: false, error: 'Sign in to access training.' }));
        return;
      }
      if (!res.ok) throw new Error(`Queue load failed: ${res.status}`);

      const data = await res.json();

      // Create session record
      let sessionId: string | null = null;
      if (data.queue.length > 0) {
        try {
          const sessionRes = await fetch('/api/train/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_type: params?.mode || 'daily',
              pillar_focus: params?.pillar || null,
              key_focus: params?.key || null,
            }),
          });
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            sessionId = sessionData.id;
          }
        } catch {
          // Session tracking is non-critical — don't block training
        }
      }

      setState(s => ({
        ...s,
        queue: data.queue,
        stats: data.stats,
        isLoading: false,
        sessionComplete: data.queue.length === 0,
        sessionId,
      }));
    } catch (err) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load queue',
      }));
    }
  }, []);

  const rateCard = useCallback(async (quality: Quality) => {
    const { queue, currentIndex } = stateRef.current;
    const item = queue[currentIndex];
    if (!item) return;

    const baseReview = item.review ?? INITIAL_REVIEW;
    const updates = sm2Update(baseReview, quality);

    const reviewUpdate: ReviewUpdate = {
      quality_id: item.card.id,
      quality,
      ease_factor: updates.ease_factor,
      interval_days: updates.interval_days,
      repetitions: updates.repetitions,
      next_review_at: updates.next_review_at,
      phase: 'recall',
    };

    // Optimistic advance — don't wait for server
    const nextIndex = currentIndex + 1;
    const isLast = nextIndex >= queue.length;

    setState(s => ({
      ...s,
      currentIndex: nextIndex,
      sessionComplete: isLast,
      sessionResults: [
        ...s.sessionResults,
        { quality_id: item.card.id, quality, title: item.card.title },
      ],
    }));

    // Fire-and-forget sync to Supabase
    fetch('/api/train/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewUpdate),
    }).catch(err => console.error('Review sync failed (will retry on next session):', err));

    // Complete session if last card
    if (isLast) {
      completeSession();
    }
  }, []);

  const markStudied = useCallback(async () => {
    const { queue, currentIndex } = stateRef.current;
    const item = queue[currentIndex];
    if (!item) return;

    const nextReviewAt = new Date(Date.now() + TWELVE_HOURS_MS).toISOString();

    const reviewUpdate: ReviewUpdate = {
      quality_id: item.card.id,
      quality: 0 as Quality, // No quality rating for study — just marks as seen
      ease_factor: 2.5,
      interval_days: 0,
      repetitions: 0,
      next_review_at: nextReviewAt,
      phase: 'study',
    };

    // Optimistic advance
    const nextIndex = currentIndex + 1;
    const isLast = nextIndex >= queue.length;

    setState(s => ({
      ...s,
      currentIndex: nextIndex,
      sessionComplete: isLast,
      sessionResults: [
        ...s.sessionResults,
        { quality_id: item.card.id, quality: 'studied', title: item.card.title },
      ],
    }));

    // Fire-and-forget sync
    fetch('/api/train/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewUpdate),
    }).catch(err => console.error('Study sync failed:', err));

    // Complete session if last card
    if (isLast) {
      completeSession();
    }
  }, []);

  const completeSession = useCallback(() => {
    const { sessionId, sessionResults } = stateRef.current;
    if (!sessionId) return;

    const studied = sessionResults.filter(r => r.quality === 'studied').length;
    const correct = sessionResults.filter(r => typeof r.quality === 'number' && r.quality >= 3).length;
    const missed = sessionResults.filter(r => typeof r.quality === 'number' && r.quality < 3 && r.quality !== 0).length;

    fetch(`/api/train/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cards_reviewed: sessionResults.length,
        cards_studied: studied,
        cards_correct: correct,
        cards_missed: missed,
      }),
    }).catch(err => console.error('Session complete sync failed:', err));
  }, []);

  const skipCard = useCallback(() => {
    const { queue, currentIndex } = stateRef.current;
    const nextIndex = currentIndex + 1;
    const isLast = nextIndex >= queue.length;
    setState(s => ({
      ...s,
      currentIndex: nextIndex,
      sessionComplete: isLast,
    }));
    if (isLast) {
      completeSession();
    }
  }, [completeSession]);

  const currentCard = state.queue[state.currentIndex] ?? null;

  return {
    ...state,
    currentCard,
    cardNumber: state.currentIndex + 1,
    totalCards: state.queue.length,
    loadQueue,
    rateCard,
    markStudied,
    skipCard,
  };
}
