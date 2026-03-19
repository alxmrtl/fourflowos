'use client';

import { useState, useCallback, useRef } from 'react';
import { sm2Update } from '@/lib/sm2';
import type { QueueItem, QueueStats, Quality, ReviewUpdate, MechanicReview } from '@/types/training';

interface SessionResult {
  mechanic_id: string;
  quality: Quality;
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
}

const INITIAL_REVIEW: Pick<MechanicReview, 'ease_factor' | 'interval_days' | 'repetitions'> = {
  ease_factor: 2.5,
  interval_days: 1,
  repetitions: 0,
};

export function useTrainingStore() {
  const [state, setState] = useState<TrainingState>({
    queue: [],
    currentIndex: 0,
    stats: null,
    sessionResults: [],
    isLoading: true,
    error: null,
    sessionComplete: false,
  });

  // Use ref to avoid stale closures in rateCard
  const stateRef = useRef(state);
  stateRef.current = state;

  const loadQueue = useCallback(async () => {
    setState(s => ({ ...s, isLoading: true, error: null, sessionComplete: false, currentIndex: 0, sessionResults: [], queue: [] }));

    try {
      const res = await fetch('/api/train/queue');
      if (res.status === 401) {
        setState(s => ({ ...s, isLoading: false, error: 'Sign in to access training.' }));
        return;
      }
      if (!res.ok) throw new Error(`Queue load failed: ${res.status}`);

      const data = await res.json();
      setState(s => ({
        ...s,
        queue: data.queue,
        stats: data.stats,
        isLoading: false,
        sessionComplete: data.queue.length === 0,
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
      mechanic_id: item.mechanic.id,
      quality,
      ease_factor: updates.ease_factor,
      interval_days: updates.interval_days,
      repetitions: updates.repetitions,
      next_review_at: updates.next_review_at,
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
        { mechanic_id: item.mechanic.id, quality, title: item.mechanic.title },
      ],
    }));

    // Fire-and-forget sync to Supabase
    fetch('/api/train/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewUpdate),
    }).catch(err => console.warn('Review sync failed (will retry on next session):', err));
  }, []);

  const skipCard = useCallback(() => {
    const { queue, currentIndex } = stateRef.current;
    const nextIndex = currentIndex + 1;
    setState(s => ({
      ...s,
      currentIndex: nextIndex,
      sessionComplete: nextIndex >= queue.length,
    }));
  }, []);

  const currentCard = state.queue[state.currentIndex] ?? null;

  return {
    ...state,
    currentCard,
    cardNumber: state.currentIndex + 1,
    totalCards: state.queue.length,
    loadQueue,
    rateCard,
    skipCard,
  };
}
