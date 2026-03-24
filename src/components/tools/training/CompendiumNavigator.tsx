'use client';

import { useState, useEffect, useMemo } from 'react';
import type { MasteryStats, Pillar, CardType } from '@/types/training';

// ── Color maps (aligned with ProgressGrid) ──────────────────────────

const PILLAR_COLORS: Record<Pillar, {
  label: string;
  bg: string;
  border: string;
  dot: string;
  barBg: (score: number) => string;
  badgeBg: string;
}> = {
  self: {
    label: 'text-self',
    bg: 'bg-self/5',
    border: 'border-self',
    dot: 'bg-self',
    barBg: (s) => ['bg-self/5', 'bg-self/8', 'bg-self/12', 'bg-self/18', 'bg-self/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-self/10 text-self',
  },
  space: {
    label: 'text-space',
    bg: 'bg-space/5',
    border: 'border-space',
    dot: 'bg-space',
    barBg: (s) => ['bg-space/5', 'bg-space/8', 'bg-space/12', 'bg-space/18', 'bg-space/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-space/10 text-space',
  },
  story: {
    label: 'text-story',
    bg: 'bg-story/5',
    border: 'border-story',
    dot: 'bg-story',
    barBg: (s) => ['bg-story/5', 'bg-story/8', 'bg-story/12', 'bg-story/18', 'bg-story/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-story/10 text-story',
  },
  spirit: {
    label: 'text-spirit',
    bg: 'bg-spirit/5',
    border: 'border-spirit',
    dot: 'bg-spirit',
    barBg: (s) => ['bg-spirit/5', 'bg-spirit/8', 'bg-spirit/12', 'bg-spirit/18', 'bg-spirit/25'][Math.max(0, Math.min(4, s - 1))],
    badgeBg: 'bg-spirit/10 text-spirit',
  },
};

const MASTERY_DOT: Record<string, string> = {
  unseen: 'bg-neutral/30',
  learning: 'bg-amber-400',
  young: 'bg-blue-400',
  mature: 'bg-green-500',
};

const MASTERY_BADGE: Record<string, { bg: string; label: string }> = {
  unseen: { bg: 'bg-neutral/10 text-neutral-light', label: 'Unseen' },
  learning: { bg: 'bg-amber-100 text-amber-700', label: 'Learning' },
  young: { bg: 'bg-blue-100 text-blue-700', label: 'Young' },
  mature: { bg: 'bg-green-100 text-green-700', label: 'Mature' },
};

// ── Types ────────────────────────────────────────────────────────────

type MechanicItem = MasteryStats['mechanics'][number];

interface NestedMechanic extends MechanicItem {
  children: MechanicItem[];
}

interface FlowKeyGroup {
  key: string;
  label: string;
  mechanics: NestedMechanic[];
}

interface PillarGroup {
  pillar: Pillar;
  keys: FlowKeyGroup[];
  totalMechanics: number;
  totalTechniques: number;
  totalConcepts: number;
}

// ── Key ordering (matches pillar flow) ───────────────────────────────

const KEY_ORDER: Record<Pillar, string[]> = {
  self: ['tuned-emotions', 'focused-body', 'open-mind'],
  space: ['intentional-space', 'optimized-tools', 'feedback-systems'],
  story: ['generative-story', 'clear-mission', 'empowered-role'],
  spirit: ['grounding-values', 'ignited-curiosity', 'visualized-vision'],
};

// ── Helpers ──────────────────────────────────────────────────────────

function formatKeyLabel(key: string): string {
  return key.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function isDue(nextReview: string | null): boolean {
  if (!nextReview) return false;
  return new Date(nextReview) <= new Date();
}



// ── Component ────────────────────────────────────────────────────────

export default function CompendiumNavigator() {
  const [stats, setStats] = useState<MasteryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [collapsedPillars, setCollapsedPillars] = useState<Set<Pillar>>(new Set());

  useEffect(() => {
    fetch('/api/train/progress')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setStats(data); })
      .finally(() => setLoading(false));
  }, []);

  // Build the nested hierarchy: pillar → flow_key → mechanics → children
  const pillarGroups: PillarGroup[] = useMemo(() => {
    if (!stats) return [];

    const allItems = stats.mechanics;
    const pillars: Pillar[] = ['self', 'space', 'story', 'spirit'];

    return pillars.map(pillar => {
      const pillarItems = allItems.filter(m => m.pillar === pillar);
      const mechanics = pillarItems.filter(m => m.card_type === 'mechanic');
      const children = pillarItems.filter(m => m.card_type !== 'mechanic');

      // Build a map of parent → children
      const childMap = new Map<string, MechanicItem[]>();
      for (const c of children) {
        if (c.parent_mechanic_id) {
          const existing = childMap.get(c.parent_mechanic_id) ?? [];
          existing.push(c);
          childMap.set(c.parent_mechanic_id, existing);
        }
      }

      // Also collect orphan children (no parent_mechanic_id) — group by flow_key
      const orphansByKey = new Map<string, MechanicItem[]>();
      for (const c of children) {
        if (!c.parent_mechanic_id) {
          const existing = orphansByKey.get(c.flow_key) ?? [];
          existing.push(c);
          orphansByKey.set(c.flow_key, existing);
        }
      }

      const keyOrder = KEY_ORDER[pillar] ?? [];
      const keys: FlowKeyGroup[] = keyOrder.map(key => {
        const keyMechanics = mechanics
          .filter(m => m.flow_key === key)
          .sort((a, b) => (b.enrichment_score ?? 0) - (a.enrichment_score ?? 0));

        const nested: NestedMechanic[] = keyMechanics.map(m => ({
          ...m,
          children: (childMap.get(m.id) ?? []).sort((a, b) => {
            // Techniques first, then concepts
            if (a.card_type !== b.card_type) return a.card_type === 'technique' ? -1 : 1;
            return a.title.localeCompare(b.title);
          }),
        }));

        // Append orphans as standalone items at end of key
        const orphans = orphansByKey.get(key) ?? [];
        for (const o of orphans) {
          nested.push({ ...o, children: [] });
        }

        return {
          key,
          label: formatKeyLabel(key),
          mechanics: nested,
        };
      });

      return {
        pillar,
        keys,
        totalMechanics: mechanics.length,
        totalTechniques: pillarItems.filter(m => m.card_type === 'technique').length,
        totalConcepts: pillarItems.filter(m => m.card_type === 'concept').length,
      };
    });
  }, [stats]);

  const togglePillar = (p: Pillar) => {
    setCollapsedPillars(prev => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-sm text-neutral-light">
        Loading compendium...
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs text-neutral-light">
        {Object.entries(MASTERY_DOT).map(([level, color]) => (
          <div key={level} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="capitalize">{level}</span>
          </div>
        ))}
        <span className="text-neutral/20">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold bg-neutral/10 rounded px-1">T</span>
          <span>Technique</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold bg-neutral/10 rounded px-1">C</span>
          <span>Concept</span>
        </div>
      </div>

      {/* Grid — 4 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillarGroups.map(({ pillar, keys, totalMechanics, totalTechniques, totalConcepts }) => {
          const c = PILLAR_COLORS[pillar];
          const isCollapsed = collapsedPillars.has(pillar);

          return (
            <div key={pillar} className="min-w-0">
              {/* Pillar header */}
              <button
                onClick={() => togglePillar(pillar)}
                className="w-full text-left mb-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                    <span className={`font-display text-lg font-semibold uppercase tracking-wider ${c.label}`}>
                      {pillar}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-light">
                    {isCollapsed ? '▸' : '▾'}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-light mt-0.5 ml-[18px]">
                  {totalMechanics}m · {totalTechniques}t · {totalConcepts}c
                </div>
              </button>

              {!isCollapsed && (
                <div className="space-y-4">
                  {keys.map(({ key, label, mechanics }) => (
                    <div key={key}>
                      {/* Flow Key label */}
                      <div className={`text-[11px] font-semibold uppercase tracking-wider ${c.label} opacity-60 mb-1.5 ml-1`}>
                        {label}
                      </div>

                      {/* Mechanic bars + nested children */}
                      <div className="space-y-1">
                        {mechanics.map(mechanic => (
                          <div key={mechanic.id}>
                            <MechanicBar
                              item={mechanic}
                              pillar={pillar}
                              isExpanded={expandedId === mechanic.id}
                              onToggle={() => setExpandedId(expandedId === mechanic.id ? null : mechanic.id)}
                            />

                            {/* Children: techniques + concepts */}
                            {mechanic.children.map(child => (
                              <div key={child.id} className="ml-4 mt-1">
                                <ChildBar
                                  item={child}
                                  pillar={pillar}
                                  isExpanded={expandedId === child.id}
                                  onToggle={() => setExpandedId(expandedId === child.id ? null : child.id)}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mechanic Bar ─────────────────────────────────────────────────────

function MechanicBar({
  item,
  pillar,
  isExpanded,
  onToggle,
}: {
  item: NestedMechanic;
  pillar: Pillar;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const c = PILLAR_COLORS[pillar];
  const bgClass = c.barBg(item.enrichment_score ?? 1);
  const due = isDue(item.next_review_at);

  return (
    <div>
      <button
        onClick={onToggle}
        className={`
          w-full h-8 rounded-lg flex items-center gap-2 px-2.5
          border-l-[3px] ${c.border}
          ${bgClass}
          transition-all duration-150
          hover:-translate-y-px hover:brightness-105
          ${isExpanded ? 'ring-1 ring-neutral/10' : ''}
        `}
      >
        {due && (
          <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse flex-shrink-0`} />
        )}
        <span className="text-xs font-medium text-neutral truncate flex-1 text-left">
          {item.title}
        </span>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${MASTERY_DOT[item.mastery_level]}`} />
      </button>

      {isExpanded && (
        <DetailExpand item={item} pillar={pillar} />
      )}
    </div>
  );
}

// ── Child Bar (Technique / Concept) ──────────────────────────────────

function ChildBar({
  item,
  pillar,
  isExpanded,
  onToggle,
}: {
  item: MechanicItem;
  pillar: Pillar;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const c = PILLAR_COLORS[pillar];
  const typeLabel = item.card_type === 'technique' ? 'T' : 'C';
  const borderStyle = item.card_type === 'technique' ? 'border-dashed' : 'border-dotted';
  const due = isDue(item.next_review_at);

  return (
    <div>
      <button
        onClick={onToggle}
        className={`
          w-full h-6 rounded-md flex items-center gap-1.5 px-2
          border-l-2 ${borderStyle} ${c.border}
          bg-neutral/[0.02]
          transition-all duration-150
          hover:-translate-y-px hover:bg-neutral/5
          ${isExpanded ? 'ring-1 ring-neutral/10' : ''}
        `}
      >
        {due && (
          <span className={`w-1 h-1 rounded-full ${c.dot} animate-pulse flex-shrink-0`} />
        )}
        <span className={`text-[10px] font-semibold rounded px-1 flex-shrink-0 ${c.badgeBg}`}>
          {typeLabel}
        </span>
        <span className="text-[11px] text-neutral-light truncate flex-1 text-left">
          {item.title}
        </span>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${MASTERY_DOT[item.mastery_level]}`} />
      </button>

      {isExpanded && (
        <DetailExpand item={item} pillar={pillar} />
      )}
    </div>
  );
}

// ── Detail Expand (Accordion Content) ────────────────────────────────

function DetailExpand({
  item,
  pillar,
}: {
  item: MechanicItem;
  pillar: Pillar;
}) {
  const c = PILLAR_COLORS[pillar];
  const mastery = MASTERY_BADGE[item.mastery_level];

  return (
    <div className="mt-1 mb-2 ml-1 p-3 rounded-lg bg-neutral/[0.03] border border-neutral/8 space-y-2.5">
      {/* Definition */}
      {item.definition && (
        <div className={`border-l-2 ${c.border} pl-3 text-xs text-neutral-light italic leading-relaxed`}>
          {item.definition}
        </div>
      )}

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${mastery.bg}`}>
          {mastery.label}
        </span>

        {item.card_type === 'mechanic' && item.enrichment_score > 0 && (
          <span className="flex items-center gap-0.5" title={`Enrichment: ${item.enrichment_score}/5`}>
            {[1, 2, 3, 4, 5].map(i => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i <= item.enrichment_score ? c.dot : 'bg-neutral/15'}`}
              />
            ))}
          </span>
        )}

        {item.repetitions > 0 && (
          <span className="text-[10px] text-neutral-light">
            {item.repetitions} reps · {item.interval_days}d
          </span>
        )}

        {item.card_type === 'mechanic' && item.techniques_count > 0 && (
          <span className="text-[10px] text-neutral-light">
            {item.techniques_count} techniques
          </span>
        )}
      </div>

      {/* Keywords — only for mechanics */}
      {item.card_type === 'mechanic' && item.keywords && item.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.keywords.slice(0, 8).map(kw => (
            <span
              key={kw}
              className="text-[10px] bg-neutral/8 text-neutral-light rounded px-1.5 py-0.5"
            >
              {kw}
            </span>
          ))}
          {item.keywords.length > 8 && (
            <span className="text-[10px] text-neutral-light opacity-50">
              +{item.keywords.length - 8}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
