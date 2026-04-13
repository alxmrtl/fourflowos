'use client';

import QualityCard from './QualityCard';
import type { QueueItem, Quality } from '@/types/training';

interface SessionResult {
  quality_id: string;
  quality: Quality | 'studied';
  title: string;
}

interface CardSessionProps {
  queue: QueueItem[];
  currentIndex: number;
  sessionResults: SessionResult[];
  onRate: (quality: Quality) => void;
  onMarkStudied: () => void;
  onNewSession: () => void;
}

const QUALITY_LABELS: Record<string, { icon: string; color: string; label: string }> = {
  '1': { icon: '\u25CB', color: 'text-red-500', label: 'Missed' },
  '3': { icon: '\u25D0', color: 'text-amber-500', label: 'Got it' },
  '5': { icon: '\u25CF', color: 'text-green-500', label: 'Nailed' },
  'studied': { icon: '\u25A1', color: 'text-blue-500', label: 'Studied' },
};

export default function CardSession({
  queue,
  currentIndex,
  sessionResults,
  onRate,
  onMarkStudied,
  onNewSession,
}: CardSessionProps) {
  const currentCard = queue[currentIndex] ?? null;
  const isComplete = currentIndex >= queue.length;

  // Completion screen
  if (isComplete) {
    const nailed = sessionResults.filter(r => r.quality === 5).length;
    const gotIt = sessionResults.filter(r => r.quality === 3).length;
    const missed = sessionResults.filter(r => typeof r.quality === 'number' && r.quality <= 2 && r.quality !== 0).length;
    const studied = sessionResults.filter(r => r.quality === 'studied').length;

    return (
      <div className="w-full max-w-xl mx-auto text-center py-8">
        <div className="text-4xl mb-4">&#10022;</div>
        <h2 className="font-display text-2xl font-semibold text-neutral mb-2">
          Session complete
        </h2>
        <p className="text-neutral-light text-sm mb-8">
          {sessionResults.length} cards {studied > 0 ? 'studied & reviewed' : 'reviewed'}
        </p>

        {/* Result summary */}
        {sessionResults.length > 0 && (
          <div className="flex justify-center gap-6 mb-8 text-sm">
            {nailed > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{nailed}</div>
                <div className="text-neutral-light">Nailed</div>
              </div>
            )}
            {gotIt > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{gotIt}</div>
                <div className="text-neutral-light">Got it</div>
              </div>
            )}
            {missed > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{missed}</div>
                <div className="text-neutral-light">Missed</div>
              </div>
            )}
            {studied > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{studied}</div>
                <div className="text-neutral-light">Studied</div>
              </div>
            )}
          </div>
        )}

        {/* Card-by-card recap */}
        {sessionResults.length > 0 && (
          <div className="text-left bg-background-dark rounded-xl p-4 mb-6 space-y-1.5">
            {sessionResults.map((r) => {
              const key = String(r.quality);
              const style = QUALITY_LABELS[key] ?? QUALITY_LABELS['1'];
              return (
                <div key={r.quality_id} className="flex items-center gap-2 text-sm">
                  <span className={`font-bold ${style.color}`}>{style.icon}</span>
                  <span className="text-neutral truncate">{r.title}</span>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onNewSession}
          className="px-6 py-3 bg-neutral text-white rounded-xl font-semibold text-sm hover:bg-neutral-dark transition-colors"
        >
          Load next session
        </button>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <QualityCard
      item={currentCard}
      cardNumber={currentIndex + 1}
      totalCards={queue.length}
      onRate={onRate}
      onMarkStudied={onMarkStudied}
    />
  );
}
