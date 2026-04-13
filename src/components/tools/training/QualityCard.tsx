'use client';

import { useState } from 'react';
import type { QueueItem, Quality, CompendiumCard } from '@/types/training';
import { RATING_BUTTONS } from '@/lib/sm2';
import { renderMarkdown as sharedRenderMarkdown, renderRecallMd } from '@/lib/renderMarkdown';

const PILLAR_STYLES: Record<string, { bg: string; text: string; border: string; badge: string; recallBg: string }> = {
  self:   { bg: 'bg-self/5',    text: 'text-self',    border: 'border-self/20',   badge: 'bg-self text-white',   recallBg: 'bg-self/8' },
  space:  { bg: 'bg-space/5',   text: 'text-space',   border: 'border-space/20',  badge: 'bg-space text-white',  recallBg: 'bg-space/8' },
  story:  { bg: 'bg-story/5',   text: 'text-story',   border: 'border-story/20',  badge: 'bg-story text-white',  recallBg: 'bg-story/8' },
  spirit: { bg: 'bg-spirit/5',  text: 'text-spirit',  border: 'border-spirit/20', badge: 'bg-spirit text-white', recallBg: 'bg-spirit/8' },
};

const RATING_STYLES = [
  'border-neutral/20 hover:border-red-400 hover:bg-red-50 hover:text-red-700',
  'border-neutral/20 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700',
  'border-neutral/20 hover:border-green-400 hover:bg-green-50 hover:text-green-700',
];

/** Converts quality markdown to displayable HTML — delegates to shared renderer. */
function renderMarkdown(md: string): string {
  return sharedRenderMarkdown(md, { dark: false, skipRecall: true });
}

/** Renders the recall section (bold labels + wiki links). */
function renderRecall(md: string): string {
  return renderRecallMd(md, { dark: false });
}

/** Render a child card (technique/concept) as a collapsible section */
function ChildCard({ child }: { child: CompendiumCard }) {
  const [open, setOpen] = useState(false);
  const typeLabel = child.card_type === 'technique' ? 'Technique' : 'Concept';

  return (
    <div className="border border-neutral/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral/10 text-neutral-light">
            {typeLabel}
          </span>
          <span className="text-sm font-medium text-neutral">{child.title}</span>
        </div>
        <span className="text-xs text-neutral-light">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-neutral/5">
          {child.definition && (
            <p className="text-xs text-neutral-light italic mt-2 mb-2">{child.definition}</p>
          )}
          <div
            dangerouslySetInnerHTML={{ __html: renderMarkdown(child.content_md) }}
          />
        </div>
      )}
    </div>
  );
}

interface QualityCardProps {
  item: QueueItem;
  cardNumber: number;
  totalCards: number;
  onRate: (quality: Quality) => void;
  onMarkStudied: () => void;
}

export default function QualityCard({ item, cardNumber, totalCards, onRate, onMarkStudied }: QualityCardProps) {
  const [revealed, setReveal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { card, is_new, content_updated, children } = item;
  const styles = PILLAR_STYLES[card.pillar] ?? PILLAR_STYLES.self;
  const flowKeyLabel = card.flow_key
    .split('-')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ');

  // Determine card mode: study (new cards) vs recall (existing reviews)
  const isStudyMode = is_new;
  const isRecallMode = !isStudyMode;

  const handleReveal = () => setReveal(true);
  const handleRate = (quality: Quality) => {
    setReveal(false);
    setExpanded(false);
    onRate(quality);
  };
  const handleStudied = () => {
    onMarkStudied();
  };

  const contentHtml = renderMarkdown(card.content_md);
  const recallHtml = card.recall_md ? renderRecall(card.recall_md) : null;
  const hasFullContent = card.enrichment_score >= 2;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4 text-xs text-neutral-light">
        <span>{cardNumber} of {totalCards}</span>
        <div className="flex items-center gap-2">
          {content_updated && (
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">UPDATED</span>
          )}
          {is_new && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
              {isStudyMode ? 'STUDY' : 'NEW'}
            </span>
          )}
        </div>
      </div>

      {/* Card */}
      <div className={`rounded-2xl border ${styles.border} ${styles.bg} overflow-hidden`}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${styles.badge}`}>
              {card.pillar}
            </span>
            <span className={`text-xs ${styles.text} opacity-70`}>{flowKeyLabel}</span>
          </div>

          <h2 className={`font-display text-3xl font-semibold text-neutral leading-tight mb-2`}>
            {card.title}
          </h2>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* STUDY MODE: full content shown immediately, "Mark as Studied" */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {isStudyMode && (
          <div className="px-6 pb-6 space-y-4">
            {/* Definition */}
            <blockquote className={`border-l-3 ${styles.border} pl-4 py-1`}>
              <p className={`text-base font-medium ${styles.text} leading-relaxed`}>
                {card.definition}
              </p>
            </blockquote>

            {/* Full content */}
            {hasFullContent && (
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            )}

            {/* Linked techniques & concepts */}
            {children && children.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-light mt-4">
                  Related Techniques & Concepts
                </h3>
                {children.map(child => (
                  <ChildCard key={child.id} child={child} />
                ))}
              </div>
            )}

            {/* "What to Remember" callout — primes the 3 recall targets */}
            {recallHtml && (
              <div className={`rounded-xl px-4 py-4 ${styles.recallBg} border-2 ${styles.border}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${styles.text} mb-3`}>
                  What to Remember
                </p>
                <div dangerouslySetInnerHTML={{ __html: recallHtml }} />
              </div>
            )}

            {!recallHtml && !hasFullContent && (
              <p className="text-xs text-neutral-light opacity-50 italic">
                Full content coming — this quality is queued for enrichment.
              </p>
            )}

            {/* Mark as Studied */}
            <div className="border-t border-neutral/10 pt-4 mt-4">
              <button
                onClick={handleStudied}
                className={`w-full py-3 rounded-xl border-2 ${styles.border} ${styles.text} font-semibold text-sm transition-all hover:opacity-80 active:scale-95`}
              >
                Mark as Studied
              </button>
              <p className="text-xs text-neutral-light text-center mt-2 opacity-60">
                This card will return for recall in ~12 hours
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* RECALL MODE: blank slots → reveal answer → rate               */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {isRecallMode && !revealed && (
          <div className="px-6 pb-6">
            {/* Three blank recall slots */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold text-neutral-light uppercase tracking-wider w-24 shrink-0 pt-0.5">Hook</span>
                <div className="flex-1 border-b border-dashed border-neutral/20 pb-2 min-h-[1.5rem]" />
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold text-neutral-light uppercase tracking-wider w-24 shrink-0 pt-0.5">Mechanism</span>
                <div className="flex-1 border-b border-dashed border-neutral/20 pb-2 min-h-[1.5rem]" />
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold text-neutral-light uppercase tracking-wider w-24 shrink-0 pt-0.5">Anchor</span>
                <div className="flex-1 border-b border-dashed border-neutral/20 pb-2 min-h-[1.5rem]" />
              </div>
            </div>

            <button
              onClick={handleReveal}
              className={`w-full py-3 rounded-xl border-2 ${styles.border} ${styles.text} font-semibold text-sm transition-all hover:opacity-80 active:scale-95`}
            >
              Reveal Answer
            </button>
          </div>
        )}

        {isRecallMode && revealed && (
          <div className="px-6 pb-6 space-y-4">
            {/* Definition */}
            <blockquote className={`border-l-3 ${styles.border} pl-4 py-1`}>
              <p className={`text-base font-medium ${styles.text} leading-relaxed`}>
                {card.definition}
              </p>
            </blockquote>

            {/* Recall section — THE answer (Hook / Mechanism / Anchor) */}
            {recallHtml && (
              <div className={`rounded-xl px-4 py-3 ${styles.recallBg} border ${styles.border}`}>
                <div dangerouslySetInnerHTML={{ __html: recallHtml }} />
              </div>
            )}

            {!recallHtml && (
              <p className="text-xs text-neutral-light opacity-50 italic">
                No recall section yet — rate based on definition recall.
              </p>
            )}

            {/* Full content — secondary, clearly separated */}
            {hasFullContent && (
              <div>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-neutral-light opacity-40 hover:opacity-70 transition-opacity flex items-center gap-1"
                >
                  {expanded ? 'Hide full content' : 'Review full content'}
                </button>

                {expanded && (
                  <div
                    className="mt-4 border-t border-neutral/10 pt-4 opacity-70"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                )}
              </div>
            )}

            {/* Rating */}
            <div className="border-t border-neutral/10 pt-4 mt-4">
              <p className="text-xs text-neutral-light mb-3 text-center">All three? Got it. Blank? Missed.</p>
              <div className="grid grid-cols-3 gap-2">
                {RATING_BUTTONS.map((btn, i) => (
                  <button
                    key={btn.quality}
                    onClick={() => handleRate(btn.quality)}
                    title={btn.description}
                    className={`py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-95 ${RATING_STYLES[i]}`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
