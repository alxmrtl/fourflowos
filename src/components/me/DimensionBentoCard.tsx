'use client';

import Image from 'next/image';
import type { DimensionType, KeyType } from '@/types/framework';
import type { DimensionData } from '@/types/profile-json';
import { DIMENSIONS, KEYS } from '@/data/framework';

interface Props {
  dim: DimensionType;
  data: DimensionData;
  onKeyClick: (slug: KeyType, dim: DimensionType) => void;
}

const DIM_FUNCTION: Record<DimensionType, string> = {
  self: 'Reception Layer',
  space: 'Transmission Layer',
  story: 'Temporal Direction',
  spirit: 'Timeless Direction',
};

const DIM_KEYS: Record<DimensionType, KeyType[]> = {
  self: ['tuned-emotions', 'focused-body', 'open-mind'],
  space: ['intentional-space', 'optimized-tools', 'feedback-systems'],
  story: ['generative-story', 'clear-mission', 'empowered-role'],
  spirit: ['grounding-values', 'ignited-curiosity', 'visualized-vision'],
};

export default function DimensionBentoCard({ dim, data, onKeyClick }: Props) {
  const meta = DIMENSIONS[dim];
  const keySlots = DIM_KEYS[dim];

  return (
    <div
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: 'rgba(20,20,20,0.95)' }}
    >
      {/* Top edge color bar */}
      <div style={{ height: 3, background: meta.color }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 flex-shrink-0">
            <Image
              src={meta.sectionLogo}
              alt={meta.name}
              width={28}
              height={28}
              className="object-contain opacity-80"
            />
          </div>
          <div>
            <p
              className="text-[10px] font-semibold tracking-widest uppercase leading-none"
              style={{ color: meta.color }}
            >
              {meta.name}
            </p>
            <p className="text-[10px] text-gray-600 mt-0.5">{DIM_FUNCTION[dim]}</p>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">
          {data.summary}
        </p>

        {/* Key buttons */}
        <div className="space-y-1.5">
          {keySlots.map((slug) => {
            const keyMeta = KEYS[slug];
            const hasData = !!data.keys[slug];
            return (
              <button
                key={slug}
                onClick={() => hasData && onKeyClick(slug, dim)}
                disabled={!hasData}
                className={`w-full text-left px-3 py-2 rounded-lg border-l-2 text-xs transition-colors ${
                  hasData
                    ? 'text-gray-300 hover:bg-white/5 cursor-pointer'
                    : 'text-gray-600 cursor-default'
                }`}
                style={{ borderLeftColor: hasData ? meta.color : 'rgba(255,255,255,0.1)' }}
              >
                {keyMeta?.name ?? slug}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
