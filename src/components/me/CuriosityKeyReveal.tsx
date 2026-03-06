'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { KeyData } from '@/types/profile-json';
import { KEYS } from '@/data/framework';
import { AMETHYST } from '@/styles/brand-colors';

interface CuriosityData {
  items: unknown[];
  intersections: unknown[];
  updated_at: string | null;
}

interface Props {
  data: KeyData;
  curiosity: CuriosityData | null;
}

export default function CuriosityKeyReveal({ data, curiosity }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const keyMeta = KEYS['ignited-curiosity'];
  const fallbackInsight = keyMeta?.coreInsight ?? '';
  const items = curiosity?.items ?? [];

  function getItemLabel(item: unknown): string {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>;
      if (typeof o.text === 'string') return o.text;
      if (typeof o.label === 'string') return o.label;
    }
    return JSON.stringify(item);
  }

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
      }}
    >
      <div className="flex items-start gap-4 py-6">
        {/* Key icon */}
        <div className="w-12 h-12 flex-shrink-0">
          {keyMeta?.icon ? (
            <Image
              src={keyMeta.icon}
              alt="Ignited Curiosity"
              width={48}
              height={48}
              className="object-contain opacity-75"
            />
          ) : (
            <div className="w-12 h-12 rounded-full border border-white/15" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-[11px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: AMETHYST }}
          >
            Ignited Curiosity
          </p>

          <p className="text-sm text-gray-300 leading-relaxed mb-5">
            {data.insight || fallbackInsight}
          </p>

          {/* Live curiosity map */}
          {items.length > 0 ? (
            <div
              className="rounded-xl border border-white/8 p-4"
              style={{ background: `${AMETHYST}08` }}
            >
              <p className="text-[11px] font-medium text-gray-500 mb-3">
                Your curiosity map, right now:
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full border"
                    style={{
                      borderColor: `${AMETHYST}40`,
                      color: AMETHYST,
                      background: `${AMETHYST}10`,
                    }}
                  >
                    {getItemLabel(item)}
                  </span>
                ))}
              </div>
              <Link
                href="/tools/curiosity-explorer"
                className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors mt-3"
              >
                Open Curiosity Map →
              </Link>
            </div>
          ) : (
            <div
              className="rounded-xl border border-white/6 p-4"
              style={{ background: 'rgba(122,77,164,0.04)' }}
            >
              <p className="text-xs text-gray-600 mb-2">
                Connect the Curiosity Map to see your active interests here.
              </p>
              <Link
                href="/tools/curiosity-explorer"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Open Curiosity Map →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
