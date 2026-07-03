'use client';

import Image from 'next/image';
import type { DimensionType, KeyType } from '@/types/framework';
import type { DimensionData } from '@/types/profile-json';
import { DIMENSIONS } from '@/data/framework';
import KeyReveal from './KeyReveal';
import CuriosityKeyReveal from './CuriosityKeyReveal';

const DIMENSION_KEYS: Record<DimensionType, KeyType[]> = {
  self: ['tuned-emotions', 'focused-body', 'open-mind'],
  space: ['intentional-space', 'optimized-tools', 'feedback-systems'],
  story: ['generative-story', 'clear-mission', 'empowered-role'],
  spirit: ['grounding-values', 'ignited-curiosity', 'visualized-vision'],
};

const DIMENSION_FUNCTION: Record<DimensionType, string> = {
  self: 'Reception Layer',
  space: 'Transmission Layer',
  story: 'Temporal Direction',
  spirit: 'Timeless Direction',
};

interface CuriosityData {
  items: unknown[];
  intersections: unknown[];
  updated_at: string | null;
}

interface Props {
  dim: DimensionType;
  data: DimensionData;
  curiosity?: CuriosityData | null;
}

export default function DimensionSectionReveal({ dim, data, curiosity }: Props) {
  const meta = DIMENSIONS[dim];
  const keys = DIMENSION_KEYS[dim];

  return (
    <div className="mb-12">
      {/* Section header */}
      <div
        className="flex items-start gap-4 mb-6 pb-5 border-b"
        style={{ borderColor: `${meta.color}20` }}
      >
        <div className="w-10 h-10 flex-shrink-0">
          <Image
            src={meta.sectionLogo}
            alt={meta.name}
            width={40}
            height={40}
            className="object-contain opacity-70"
          />
        </div>
        <div>
          <div className="flex items-baseline gap-3 mb-1">
            <h3
              className="text-base font-semibold tracking-wide"
              style={{ color: meta.color }}
            >
              {meta.name}
            </h3>
            <span className="text-[11px] text-gray-600 tracking-wide">
              {DIMENSION_FUNCTION[dim]}
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{data.summary}</p>
        </div>
      </div>

      {/* Keys — left border accent */}
      <div
        className="pl-5 border-l-2"
        style={{
          borderColor: `${meta.color}35`,
          background: `linear-gradient(to right, ${meta.color}04, transparent 80%)`,
          borderRadius: '0 0 0 0',
        }}
      >
        {keys.map((keySlug, i) => {
          const keyData = data.keys[keySlug];
          const fallback = { insight: '', invitation: '' };

          // Special treatment for ignited-curiosity
          if (keySlug === 'ignited-curiosity') {
            return (
              <CuriosityKeyReveal
                key={keySlug}
                data={keyData ?? fallback}
                curiosity={curiosity ?? null}
              />
            );
          }

          return (
            <KeyReveal
              key={keySlug}
              keySlug={keySlug}
              data={keyData ?? fallback}
              accentColor={meta.color}
              isLast={i === keys.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
}
