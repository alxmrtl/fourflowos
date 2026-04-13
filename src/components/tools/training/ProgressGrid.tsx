'use client';

import { useState, useEffect } from 'react';
import type { MasteryStats, Pillar } from '@/types/training';

const PILLAR_COLORS: Record<Pillar, { dot: string; label: string; bg: string }> = {
  self:   { dot: 'bg-self',   label: 'text-self',   bg: 'border-self/20 bg-self/5' },
  space:  { dot: 'bg-space',  label: 'text-space',  bg: 'border-space/20 bg-space/5' },
  story:  { dot: 'bg-story',  label: 'text-story',  bg: 'border-story/20 bg-story/5' },
  spirit: { dot: 'bg-spirit', label: 'text-spirit', bg: 'border-spirit/20 bg-spirit/5' },
};

const MASTERY_COLORS = {
  unseen:   'bg-neutral/10 border border-neutral/15',
  learning: 'bg-amber-100 border border-amber-200',
  young:    'bg-blue-100 border border-blue-200',
  mature:   'bg-green-100 border border-green-200',
};

const MASTERY_LABELS = {
  unseen:   { dot: 'bg-neutral/30', label: 'Unseen' },
  learning: { dot: 'bg-amber-400',  label: 'Learning' },
  young:    { dot: 'bg-blue-400',   label: 'Young' },
  mature:   { dot: 'bg-green-500',  label: 'Mature' },
};

interface ProgressGridProps {
  initialStats?: MasteryStats | null;
}

export default function ProgressGrid({ initialStats }: ProgressGridProps) {
  const [stats, setStats] = useState<MasteryStats | null>(initialStats ?? null);
  const [loading, setLoading] = useState(!initialStats);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (initialStats) return;
    fetch('/api/train/progress')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setStats(data); })
      .finally(() => setLoading(false));
  }, [initialStats]);

  if (loading) {
    return (
      <div className="text-center py-8 text-sm text-neutral-light">
        Loading progress…
      </div>
    );
  }

  if (!stats) return null;

  const pillars: Pillar[] = ['self', 'space', 'story', 'spirit'];

  return (
    <div className="mt-8">
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-2 text-sm font-semibold text-neutral hover:text-neutral-dark transition-colors"
        >
          <span>{expanded ? '▾' : '▸'} Progress grid</span>
          <span className="text-neutral-light font-normal">
            {stats.total - stats.unseen} / {stats.total} introduced
          </span>
        </button>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-neutral-light">
          {(Object.keys(MASTERY_LABELS) as Array<keyof typeof MASTERY_LABELS>).map(level => (
            <div key={level} className="flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-sm ${MASTERY_LABELS[level].dot}`} />
              {MASTERY_LABELS[level].label}
            </div>
          ))}
        </div>
      </div>

      {/* Intro progress bar */}
      <div className="w-full h-1.5 bg-neutral/10 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-neutral/40 rounded-full transition-all duration-500"
          style={{ width: `${((stats.total - stats.unseen) / stats.total) * 100}%` }}
        />
      </div>

      {!expanded && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {pillars.map(pillar => {
            const p = stats.by_pillar[pillar];
            const pct = p.total > 0 ? Math.round((p.introduced / p.total) * 100) : 0;
            const c = PILLAR_COLORS[pillar];
            return (
              <div key={pillar} className={`rounded-xl border p-3 text-center ${c.bg}`}>
                <div className={`text-xs font-semibold uppercase tracking-wider ${c.label} mb-1`}>
                  {pillar}
                </div>
                <div className="text-lg font-bold text-neutral">{p.introduced}<span className="text-xs font-normal text-neutral-light">/{p.total}</span></div>
                <div className="text-xs text-neutral-light">{pct}%</div>
              </div>
            );
          })}
        </div>
      )}

      {expanded && (
        <div className="space-y-6 mt-4">
          {pillars.map(pillar => {
            const qualitiesForPillar = stats.qualities.filter(m => m.pillar === pillar);
            const c = PILLAR_COLORS[pillar];

            // Group by flow_key
            const byKey: Record<string, typeof qualitiesForPillar> = {};
            for (const m of qualitiesForPillar) {
              if (!byKey[m.flow_key]) byKey[m.flow_key] = [];
              byKey[m.flow_key].push(m);
            }

            return (
              <div key={pillar}>
                <div className={`flex items-center gap-2 mb-3`}>
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <span className={`text-sm font-semibold uppercase tracking-wider ${c.label}`}>
                    {pillar}
                  </span>
                </div>

                <div className="space-y-3">
                  {Object.entries(byKey).map(([key, qualities]) => {
                    const keyLabel = key.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
                    return (
                      <div key={key}>
                        <div className="text-xs text-neutral-light mb-1.5">{keyLabel}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {qualities.map(m => (
                            <div
                              key={m.id}
                              title={`${m.title}\n${m.mastery_level} · ${m.repetitions} reps · ${m.interval_days}d interval`}
                              className={`w-6 h-6 rounded-sm cursor-default transition-transform hover:scale-125 ${MASTERY_COLORS[m.mastery_level]}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
