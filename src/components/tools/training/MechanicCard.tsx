'use client';

import { useState } from 'react';
import type { QueueItem, Quality } from '@/types/training';
import { RATING_BUTTONS } from '@/lib/sm2';

const PILLAR_STYLES: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  self:   { bg: 'bg-self/5',    text: 'text-self',    border: 'border-self/20',   badge: 'bg-self text-white' },
  space:  { bg: 'bg-space/5',   text: 'text-space',   border: 'border-space/20',  badge: 'bg-space text-white' },
  story:  { bg: 'bg-story/5',   text: 'text-story',   border: 'border-story/20',  badge: 'bg-story text-white' },
  spirit: { bg: 'bg-spirit/5',  text: 'text-spirit',  border: 'border-spirit/20', badge: 'bg-spirit text-white' },
};

const RATING_STYLES = [
  'border-neutral/20 hover:border-red-400 hover:bg-red-50 hover:text-red-700',
  'border-neutral/20 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700',
  'border-neutral/20 hover:border-green-400 hover:bg-green-50 hover:text-green-700',
];

/** Converts mechanic markdown to displayable HTML (safe — content is from our own compendium). */
function renderMarkdown(md: string): string {
  // Strip YAML frontmatter
  let content = md.replace(/^---[\s\S]*?---\n/, '');

  // Escape HTML entities first
  content = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Skip the top-level # Title heading (shown separately as card title)
  content = content.replace(/^# .+\n\n?/, '');

  // Skip the blockquote definition at top (shown separately)
  content = content.replace(/^&gt; .+\n\n?/, '');

  // Convert headings
  content = content.replace(/^### (.+)$/gm, '<h3 class="font-semibold text-sm text-neutral mt-4 mb-1">$1</h3>');
  content = content.replace(/^## (.+)$/gm, '<h2 class="font-semibold text-base text-neutral mt-6 mb-2 border-b border-neutral/10 pb-1">$1</h2>');

  // Convert bold / italic
  content = content.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  content = content.replace(/\*([^*]+?)\*/g, '<em>$1</em>');

  // Convert [[wiki links]] to inline badges
  content = content.replace(/\[\[([^\]]+)\]\]/g, '<span class="inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-neutral/10 text-neutral-light mx-0.5">$1</span>');

  // Convert blockquotes
  content = content.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-neutral/20 pl-3 text-neutral-light italic text-sm my-2">$1</blockquote>');

  // Convert list items
  content = content.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm text-neutral-light leading-relaxed">$1</li>');

  // Wrap consecutive <li> tags in <ul>
  content = content.replace(/(<li[^>]*>.*<\/li>\n?)+/g, match => `<ul class="my-2 space-y-0.5">${match}</ul>`);

  // Convert remaining lines to paragraphs
  const lines = content.split('\n');
  const processed: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      processed.push('<div class="h-2"></div>');
    } else if (trimmed.startsWith('<')) {
      processed.push(trimmed);
    } else {
      processed.push(`<p class="text-sm text-neutral-light leading-relaxed">${trimmed}</p>`);
    }
  }

  return processed.join('\n');
}

interface MechanicCardProps {
  item: QueueItem;
  cardNumber: number;
  totalCards: number;
  onRate: (quality: Quality) => void;
}

export default function MechanicCard({ item, cardNumber, totalCards, onRate }: MechanicCardProps) {
  const [revealed, setReveal] = useState(false);
  const { mechanic, is_new } = item;
  const styles = PILLAR_STYLES[mechanic.pillar] ?? PILLAR_STYLES.self;
  const flowKeyLabel = mechanic.flow_key
    .split('-')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ');

  const handleReveal = () => setReveal(true);
  const handleRate = (quality: Quality) => {
    setReveal(false);
    onRate(quality);
  };

  const contentHtml = renderMarkdown(mechanic.content_md);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4 text-xs text-neutral-light">
        <span>{cardNumber} of {totalCards}</span>
        {is_new && (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">NEW</span>
        )}
      </div>

      {/* Card */}
      <div className={`rounded-2xl border ${styles.border} ${styles.bg} overflow-hidden`}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${styles.badge}`}>
              {mechanic.pillar}
            </span>
            <span className={`text-xs ${styles.text} opacity-70`}>{flowKeyLabel}</span>
          </div>

          <h2 className={`font-display text-3xl font-semibold text-neutral leading-tight mb-2`}>
            {mechanic.title}
          </h2>

          {mechanic.enrichment_score <= 1 && !revealed && (
            <p className="text-xs text-neutral-light mt-1 opacity-60">Definition-only card</p>
          )}
        </div>

        {/* Front: recall prompt */}
        {!revealed && (
          <div className="px-6 pb-6">
            <p className="text-sm text-neutral-light mb-6 opacity-70">
              Recall what you know — the definition, how it enables flow, any techniques.
            </p>
            <button
              onClick={handleReveal}
              className={`w-full py-3 rounded-xl border-2 ${styles.border} ${styles.text} font-semibold text-sm transition-all hover:opacity-80 active:scale-95`}
            >
              Reveal Answer
            </button>
          </div>
        )}

        {/* Back: definition + content + rating */}
        {revealed && (
          <div className="px-6 pb-6 space-y-4">
            {/* Definition */}
            <blockquote className={`border-l-3 ${styles.border} pl-4 py-1`}>
              <p className={`text-base font-medium ${styles.text} leading-relaxed`}>
                {mechanic.definition}
              </p>
            </blockquote>

            {/* Full content (for enriched mechanics) */}
            {mechanic.enrichment_score >= 2 && (
              <div
                className="prose prose-sm max-w-none mt-4 border-t border-neutral/10 pt-4"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            )}

            {mechanic.enrichment_score <= 1 && (
              <p className="text-xs text-neutral-light opacity-50 italic">
                Full content coming — this mechanic is queued for enrichment.
              </p>
            )}

            {/* Rating */}
            <div className="border-t border-neutral/10 pt-4 mt-4">
              <p className="text-xs text-neutral-light mb-3 text-center">How well did you recall it?</p>
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
