'use client';

import { useState } from 'react';
import { useCurrentSection } from '@/hooks/useCurrentSection';
import { PILLAR_COLORS } from '@/styles/brand-colors';

const SECTIONS = [
  'Hero',
  'Question Rain',
  'Timeless Anchor',
  'Flow Definitions',
  'Convergence',
  'Dimensions',
  'Unique Stack',
  'Closing',
];

// Cycle the 4 pillar colors across 8 sections
const COLORS = SECTIONS.map((_, i) => PILLAR_COLORS[i % 4]);

export default function SectionIndicator() {
  const { currentIndex, scrollToIndex } = useCurrentSection();
  const [railHovered, setRailHovered] = useState(false);

  return (
    <>
      {/* ── DESKTOP: vertical dot rail, left side ── */}
      <div
        className="hidden md:block fixed left-7 top-1/2 -translate-y-1/2 z-40"
        onMouseEnter={() => setRailHovered(true)}
        onMouseLeave={() => setRailHovered(false)}
      >
        <div className="relative flex flex-col items-start">
          {/* hairline track */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: 4,
              top: 14,
              bottom: 14,
              width: 1,
              background: 'rgba(255,255,255,0.07)',
            }}
          />

          {SECTIONS.map((name, i) => {
            const isActive = i === currentIndex;
            const color = COLORS[i];
            return (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to ${name}`}
                className="relative z-10 flex items-center py-[10px] bg-transparent border-0 p-0 cursor-pointer"
              >
                {/* fixed-width dot wrapper keeps track centered */}
                <div className="w-[9px] flex items-center justify-center">
                  <div
                    style={{
                      width: isActive ? 9 : 5,
                      height: isActive ? 9 : 5,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: isActive ? color : 'rgba(255,255,255,0.20)',
                      boxShadow: isActive ? `0 0 8px ${color}, 0 0 18px ${color}38` : 'none',
                      transition: 'all 220ms cubic-bezier(0.4,0,0.2,1)',
                    }}
                  />
                </div>

                {/* label */}
                <span
                  aria-hidden
                  style={{
                    marginLeft: 12,
                    fontSize: 11,
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    color: isActive ? 'rgba(255,255,255,0.70)' : 'rgba(255,255,255,0.45)',
                    opacity: isActive ? 1 : railHovered ? 1 : 0,
                    transform: isActive || railHovered ? 'translateX(0)' : 'translateX(-6px)',
                    transition: 'opacity 150ms ease, transform 150ms ease',
                  }}
                >
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE: horizontal dot strip, bottom center ── */}
      <div
        className="md:hidden fixed inset-x-0 bottom-0 z-40 flex justify-center items-end pointer-events-none"
        style={{
          height: 72,
          background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 100%)',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
        }}
      >
        <div className="flex items-center gap-[10px] pointer-events-auto">
          {SECTIONS.map((name, i) => {
            const isActive = i === currentIndex;
            const isPast = i < currentIndex;
            const color = COLORS[i];
            return (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to ${name}`}
                className="flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer"
                style={{ width: 24, height: 24 }}
              >
                <div
                  style={{
                    width: isActive ? 10 : 6,
                    height: isActive ? 10 : 6,
                    borderRadius: '50%',
                    background: isActive
                      ? color
                      : isPast
                      ? 'rgba(255,255,255,0.40)'
                      : 'rgba(255,255,255,0.22)',
                    boxShadow: isActive
                      ? `0 0 8px ${color}, 0 0 14px ${color}38`
                      : 'none',
                    transition: 'all 220ms cubic-bezier(0.4,0,0.2,1)',
                    flexShrink: 0,
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
