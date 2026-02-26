'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { DimensionType, KeyType } from '@/types/framework';
import type { DimensionData } from '@/types/profile-json';
import { DIMENSIONS, KEYS } from '@/data/framework';

const KEY_ORIGINS = ['15% 75%', '50% 75%', '85% 75%'];

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

function parseBullet(bullet: string): { label: string; body: string } {
  const colonIdx = bullet.indexOf(': ');
  if (colonIdx > 0) {
    return { label: bullet.slice(0, colonIdx), body: bullet.slice(colonIdx + 2) };
  }
  return { label: '', body: bullet };
}

function CategoryIcon({ category, color, size = 12 }: { category: string; color: string; size?: number }) {
  switch (category) {
    case 'Essence':
      return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
          <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8Z" />
        </svg>
      );
    case 'Pattern':
      return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M10 6a4 4 0 1 1-1-2.7" strokeLinecap="round" />
          <path d="M10 1.5V4H7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Tension':
      return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
          <path d="M7 0L2.5 7h3.5l-1 5 5-7H6.5L7 0z" />
        </svg>
      );
    case 'Direction':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M1 6h10M7.5 2.5L11 6l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

interface Props {
  dim: DimensionType;
  data: DimensionData;
}

export default function DimensionBentoCard({ dim, data }: Props) {
  const meta = DIMENSIONS[dim];
  const keySlots = DIM_KEYS[dim];

  const [activeKeySlug, setActiveKeySlug] = useState<KeyType | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const activeKeyIndex = activeKeySlug ? keySlots.indexOf(activeKeySlug) : 0;
  const radialOrigin = KEY_ORIGINS[activeKeyIndex] ?? '50% 75%';
  const activeKeyData = activeKeySlug ? data.keys[activeKeySlug] : null;
  const activeKeyMeta = activeKeySlug ? KEYS[activeKeySlug] : null;
  const bullets = activeKeyData?.bullets ?? [];

  function handleKeyClick(slug: KeyType) {
    if (!data.keys[slug]) return;
    setActiveKeySlug(slug);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleSwitchKey(slug: KeyType) {
    if (!data.keys[slug]) return;
    setActiveKeySlug(slug);
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/10"
      style={{ background: 'rgba(20,20,20,0.95)' }}
    >
      {/* Top edge color bar */}
      <div style={{ height: 3, background: meta.color }} />

      {/* FRONT — normal flow, drives card height */}
      <div className="relative p-4">
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
        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {data.summary}
        </p>

        {/* Key rows */}
        <div className="space-y-1.5">
          {keySlots.map((slug) => {
            const keyMeta = KEYS[slug];
            const keyData = data.keys[slug];
            const hasData = !!keyData;
            let essenceText: string | null = null;
            if (keyData?.bullets?.[0]) {
              const { label, body } = parseBullet(keyData.bullets[0]);
              if (label === 'Essence') essenceText = body;
            }
            return (
              <button
                key={slug}
                onClick={() => hasData && handleKeyClick(slug)}
                disabled={!hasData}
                className={`w-full text-left px-3 py-2 rounded-lg border-l-2 transition-colors ${
                  hasData ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'
                }`}
                style={{ borderLeftColor: hasData ? meta.color : 'rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex-shrink-0 opacity-60">
                    <Image
                      src={keyMeta.icon}
                      alt={keyMeta.name}
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-tight ${hasData ? 'text-gray-300' : 'text-gray-600'}`}>
                      {keyMeta.name}
                    </p>
                    {essenceText && (
                      <p className="text-[10px] text-gray-500 italic mt-0.5 line-clamp-1">
                        {essenceText}
                      </p>
                    )}
                  </div>
                  {hasData && (
                    <span className="text-gray-600 text-xs flex-shrink-0">→</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RADIAL OVERLAY */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{
          clipPath: isOpen
            ? `circle(150% at ${radialOrigin})`
            : `circle(0% at ${radialOrigin})`,
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ background: `linear-gradient(135deg, ${meta.color}18, ${meta.color}0c)` }}
      />

      {/* BACK */}
      <motion.div
        className="absolute inset-0 overflow-hidden flex flex-col p-4"
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, delay: isOpen ? 0.3 : 0 }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        {/* Top row: key icon + name + close */}
        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
          {activeKeyMeta && (
            <div className="w-5 h-5 flex-shrink-0">
              <Image
                src={activeKeyMeta.icon}
                alt={activeKeyMeta.name}
                width={20}
                height={20}
                className="object-contain opacity-80"
              />
            </div>
          )}
          <p className="text-sm font-medium text-white flex-1 truncate">
            {activeKeyMeta?.name ?? ''}
          </p>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Legend strip */}
        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-white/10 flex-shrink-0">
          {['Essence', 'Pattern', 'Tension', 'Direction'].map((cat) => (
            <div key={cat} className="flex items-center gap-1">
              <CategoryIcon category={cat} color={meta.color} size={10} />
              <span className="text-[9px] uppercase tracking-wide text-gray-600">{cat}</span>
            </div>
          ))}
        </div>

        {/* Bullet content — cross-fades on key switch */}
        <motion.div
          key={activeKeySlug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto space-y-2.5"
        >
          {bullets.map((bullet, i) => {
            const { label, body } = parseBullet(bullet);
            return (
              <div key={i} className="flex gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <CategoryIcon category={label} color={meta.color} size={12} />
                </div>
                <div>
                  {label && (
                    <span
                      className="text-[9px] uppercase tracking-wide font-medium"
                      style={{ color: meta.color }}
                    >
                      {label}{' '}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 leading-relaxed">{body}</span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Tab switcher footer */}
        <div className="flex-shrink-0 flex gap-1 mt-3 pt-2 border-t border-white/10">
          {keySlots.map((slug) => {
            if (!data.keys[slug]) return null;
            const kMeta = KEYS[slug];
            const firstWord = kMeta.name.split(' ')[0];
            const isActive = slug === activeKeySlug;
            return (
              <button
                key={slug}
                onClick={() => handleSwitchKey(slug)}
                className={`flex-1 text-[10px] py-1 rounded-md transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                {firstWord}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
