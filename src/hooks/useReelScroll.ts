'use client';

import { useEffect } from 'react';

interface Options {
  /**
   * CSS selector for the elements that count as reel "sections". Each match
   * is one snap target. The hook computes scroll positions from their
   * `offsetTop` values.
   */
  sectionSelector: string;
  /** Duration of the programmatic scroll in ms. Default 900. */
  duration?: number;
  /** Minimum |deltaY| for a wheel event to fire a section advance. Default 5. */
  wheelThreshold?: number;
  /** Minimum touch swipe distance in px to fire an advance. Default 50. */
  swipeThreshold?: number;
}

/**
 * Reels-style scroll hijack: each wheel tick, swipe, or PageUp/Down advances
 * one section with an eased programmatic scroll. Respects `prefers-reduced-motion`
 * (becomes a no-op so native scrolling takes over).
 */
export function useReelScroll({
  sectionSelector,
  duration = 900,
  wheelThreshold = 5,
  swipeThreshold = 50,
}: Options) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    let isAnimating = false;
    let lastInputAt = 0;

    const getSections = (): HTMLElement[] =>
      Array.from(document.querySelectorAll<HTMLElement>(sectionSelector));

    const findCurrentIndex = (): number => {
      const sections = getSections();
      if (sections.length === 0) return 0;
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      sections.forEach((s, i) => {
        const top = s.offsetTop;
        const center = top + s.offsetHeight / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      return bestIdx;
    };

    const smoothScrollTo = (targetY: number) => {
      isAnimating = true;
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = easeOutQuart(t);
        window.scrollTo(0, startY + distance * eased);
        if (t < 1) requestAnimationFrame(step);
        else isAnimating = false;
      };
      requestAnimationFrame(step);
    };

    const goToSection = (dir: 1 | -1) => {
      if (isAnimating) return;
      const sections = getSections();
      if (sections.length === 0) return;
      const currentIdx = findCurrentIndex();
      const targetIdx = Math.max(0, Math.min(sections.length - 1, currentIdx + dir));
      if (targetIdx === currentIdx) return;
      smoothScrollTo(sections[targetIdx].offsetTop);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < wheelThreshold) return;
      e.preventDefault();
      // throttle: ignore wheel events within 100ms of last input (handles trackpad inertia)
      const now = performance.now();
      if (now - lastInputAt < 100) return;
      lastInputAt = now;
      if (isAnimating) return;
      goToSection(e.deltaY > 0 ? 1 : -1);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isAnimating) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < swipeThreshold) return;
      goToSection(deltaY > 0 ? 1 : -1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === 'PageDown' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goToSection(1);
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToSection(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        smoothScrollTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        const sections = getSections();
        if (sections.length > 0) smoothScrollTo(sections[sections.length - 1].offsetTop);
      }
    };

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [sectionSelector, duration, wheelThreshold, swipeThreshold]);
}
