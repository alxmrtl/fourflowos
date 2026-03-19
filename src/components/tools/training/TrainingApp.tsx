'use client';

import { useEffect } from 'react';
import { useTrainingStore } from './useTrainingStore';
import CardSession from './CardSession';
import ProgressGrid from './ProgressGrid';

export default function TrainingApp() {
  const {
    queue,
    currentIndex,
    sessionResults,
    stats,
    isLoading,
    error,
    sessionComplete,
    rateCard,
    loadQueue,
  } = useTrainingStore();

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-light mb-2">
            FourFlow Training
          </p>
          <h1 className="font-display text-4xl font-semibold text-neutral">
            Daily Reps
          </h1>
        </div>

        {/* Stats bar */}
        {stats && !isLoading && (
          <div className="flex justify-center gap-6 mb-8 text-sm text-neutral-light">
            <div className="text-center">
              <span className="text-xl font-bold text-neutral">{stats.due_count}</span>
              <div className="text-xs">due</div>
            </div>
            <div className="text-center">
              <span className="text-xl font-bold text-neutral">{stats.new_count}</span>
              <div className="text-xs">new available</div>
            </div>
            <div className="text-center">
              <span className="text-xl font-bold text-neutral">{stats.total_introduced}</span>
              <div className="text-xs">of {stats.total_mechanics} introduced</div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16 text-neutral-light text-sm">
            Loading session…
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-16">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button
              onClick={loadQueue}
              className="px-4 py-2 rounded-lg bg-neutral/10 text-neutral text-sm font-medium hover:bg-neutral/20"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty queue — fully caught up */}
        {!isLoading && !error && queue.length === 0 && !sessionComplete && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">✦</div>
            <h2 className="font-display text-2xl font-semibold text-neutral mb-2">
              All caught up
            </h2>
            <p className="text-sm text-neutral-light mb-6">
              No cards due. Come back tomorrow.
            </p>
            <ProgressGrid />
          </div>
        )}

        {/* Active session */}
        {!isLoading && !error && queue.length > 0 && (
          <CardSession
            queue={queue}
            currentIndex={currentIndex}
            sessionResults={sessionResults}
            onRate={rateCard}
            onNewSession={loadQueue}
          />
        )}

        {/* Progress grid — shown after session or always when no active cards */}
        {!isLoading && !error && queue.length > 0 && sessionComplete && (
          <ProgressGrid />
        )}

        {/* Always show progress grid if session is ongoing (collapsed) */}
        {!isLoading && !error && queue.length > 0 && !sessionComplete && (
          <ProgressGrid />
        )}

      </div>
    </div>
  );
}
