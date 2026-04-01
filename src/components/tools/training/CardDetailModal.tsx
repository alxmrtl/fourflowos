'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Pillar } from '@/types/training';

// ── Types ─────────────────────────────────────────────────────────────

interface CardData {
  id: string;
  title: string;
  pillar: Pillar;
  flow_key: string;
  definition: string;
  content_md: string;
  recall_md: string | null;
  enrichment_score: number;
  card_type: string;
  keywords: string[];
}

interface QualitySummary {
  id: string;
  title: string;
  definition: string;
  mastery_level: string;
  enrichment_score: number;
}

export interface StateData {
  key: string;
  label: string;
  pillar: Pillar;
  qualities: QualitySummary[];
}

// ── Styles ────────────────────────────────────────────────────────────

const PILLAR_STYLES: Record<Pillar, { border: string; text: string; dot: string; recallBg: string; badge: string }> = {
  self:   { border: 'border-self',   text: 'text-self',   dot: 'bg-self',   recallBg: 'bg-self/8',   badge: 'bg-self/15 text-self' },
  space:  { border: 'border-space',  text: 'text-space',  dot: 'bg-space',  recallBg: 'bg-space/8',  badge: 'bg-space/15 text-space' },
  story:  { border: 'border-story',  text: 'text-story',  dot: 'bg-story',  recallBg: 'bg-story/8',  badge: 'bg-story/15 text-story' },
  spirit: { border: 'border-spirit', text: 'text-spirit', dot: 'bg-spirit', recallBg: 'bg-spirit/8', badge: 'bg-spirit/15 text-spirit' },
};

const MASTERY_DOT: Record<string, string> = {
  unseen: 'bg-neutral/30',
  learning: 'bg-amber-400',
  young: 'bg-blue-400',
  mature: 'bg-green-500',
};

const STATE_LOGO: Record<string, string> = {
  'tuned-emotions':    '/assets/LOGOS/TUNED EMOTIONS.png',
  'focused-body':      '/assets/LOGOS/FOCUSED BODY.png',
  'open-mind':         '/assets/LOGOS/OPEN MIND.png',
  'intentional-space': '/assets/LOGOS/INTENTIONAL SPACE.png',
  'optimized-tools':   '/assets/LOGOS/OPTIMIZED TOOLS.png',
  'feedback-systems':  '/assets/LOGOS/FEEDBACK SYSTEMS.png',
  'generative-story':  '/assets/LOGOS/GENERATIVE STORY.png',
  'clear-mission':     '/assets/LOGOS/CLEAR MISSION.png',
  'empowered-role':    '/assets/LOGOS/EMPOWERED ROLE.png',
  'grounding-values':  '/assets/LOGOS/GROUNDING VALUES.png',
  'ignited-curiosity': '/assets/LOGOS/IGNITED CURIOSITY.png',
  'visualized-vision': '/assets/LOGOS/VISUALIZED VISION.png',
};

function renderRecall(md: string): string {
  let content = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  content = content.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-neutral">$1</strong>');
  content = content.replace(/\[\[([^\]]+)\]\]/g, '<span class="inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-neutral/10 text-neutral-light mx-0.5">$1</span>');

  const lines = content.split('\n');
  const processed: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed) {
      processed.push(`<p class="text-sm text-neutral-light leading-relaxed mb-2">${trimmed}</p>`);
    }
  }

  return processed.join('\n');
}

// ── Card Detail View ──────────────────────────────────────────────────

function CardDetail({ cardId }: { cardId: string }) {
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/train/card/${encodeURIComponent(cardId)}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setCard)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [cardId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 rounded-full border-2 border-neutral/20 border-t-neutral/60 animate-spin" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <p className="text-sm text-neutral-light text-center py-8 opacity-60">
        Could not load card.
      </p>
    );
  }

  const s = PILLAR_STYLES[card.pillar];
  const recallHtml = card.recall_md ? renderRecall(card.recall_md) : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-white leading-tight">
          {card.title}
        </h2>
        {card.definition && (
          <p className={`text-xs mt-1 ${s.text} opacity-70 leading-relaxed`}>
            {card.definition}
          </p>
        )}
      </div>

      {/* Recall section */}
      {recallHtml ? (
        <div className={`rounded-xl px-4 py-4 ${s.recallBg} border ${s.border}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${s.text} mb-3`}>
            What to Remember
          </p>
          <div dangerouslySetInnerHTML={{ __html: recallHtml }} />
        </div>
      ) : (
        <p className="text-xs text-neutral-light opacity-40 italic">
          No recall notes yet — this card is queued for enrichment.
        </p>
      )}
    </div>
  );
}

// ── State Summary View ────────────────────────────────────────────────

function StateDetail({ stateData }: { stateData: StateData }) {
  const s = PILLAR_STYLES[stateData.pillar];
  const logo = STATE_LOGO[stateData.key];

  return (
    <div className="space-y-4">
      {/* State header */}
      <div className="flex items-center gap-3">
        {logo && (
          <Image src={logo} alt={stateData.label} width={40} height={40} className="rounded-md opacity-90" />
        )}
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${s.text} opacity-60`}>
            {stateData.pillar}
          </p>
          <h2 className="font-display text-2xl font-semibold text-white">
            {stateData.label}
          </h2>
        </div>
      </div>

      <p className="text-xs text-neutral-light opacity-50">
        Three qualities compose this state — each expressing one principle of the FourFlow framework.
      </p>

      {/* Quality summaries */}
      <div className="space-y-3">
        {stateData.qualities.map((q, i) => {
          const qualityType = i === 0 ? 'Restore' : i === 1 ? 'Maintain' : 'Concentrate';
          return (
            <div
              key={q.id}
              className={`rounded-xl p-4 border-l-[3px] ${s.border} bg-neutral/[0.03] border border-neutral/8`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className={`text-[9px] font-semibold uppercase tracking-widest ${s.text} opacity-70`}>
                    {qualityType}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{q.title}</h3>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">
                  <span className={`w-2 h-2 rounded-full ${MASTERY_DOT[q.mastery_level]}`} />
                  {q.enrichment_score > 0 && (
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(j => (
                        <span
                          key={j}
                          className={`w-1 h-1 rounded-full ${j <= q.enrichment_score ? s.dot : 'bg-neutral/15'}`}
                        />
                      ))}
                    </span>
                  )}
                </div>
              </div>
              {q.definition && (
                <p className="text-xs text-white/60 leading-relaxed">{q.definition}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────

interface CardDetailModalProps {
  cardId: string | null;
  stateData: StateData | null;
  onClose: () => void;
}

export default function CardDetailModal({ cardId, stateData, onClose }: CardDetailModalProps) {
  const isOpen = cardId !== null || stateData !== null;

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-lg bg-[#111] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-neutral/10 max-h-[90vh] sm:max-h-[80vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-neutral/10 hover:bg-neutral/20 transition-colors flex items-center justify-center text-neutral-light text-xs z-10"
          aria-label="Close"
        >
          ×
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6">
          {stateData ? (
            <StateDetail stateData={stateData} />
          ) : cardId ? (
            <CardDetail cardId={cardId} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
