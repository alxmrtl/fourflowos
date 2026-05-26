'use client';

import { useState, useEffect, useCallback } from 'react';

const SELECTOR = '[data-reel-section]';

export function useCurrentSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getSections = () =>
      Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));

    const update = () => {
      const sections = getSections();
      if (!sections.length) return;
      const midY = window.scrollY + window.innerHeight / 2;
      let best = 0, bestDist = Infinity;
      sections.forEach((s, i) => {
        const dist = Math.abs(s.offsetTop + s.offsetHeight / 2 - midY);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setCurrentIndex(best);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    const target = sections[index];
    if (target) window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  }, []);

  return { currentIndex, scrollToIndex };
}
