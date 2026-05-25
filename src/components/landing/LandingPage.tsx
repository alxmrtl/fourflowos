'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LandingNav from './LandingNav';
import HeroSectionV2 from './HeroSectionV2';
import QuestionRainSection from './QuestionRainSection';
import TimelessAnchorSectionV2 from './TimelessAnchorSectionV2';
import FlowDefinitionsSection from './FlowDefinitionsSection';
import ConvergenceSection from './ConvergenceSection';
import DimensionsSection from './DimensionsSection';
import UniqueStackSection from './UniqueStackSection';
import ClosingSection from './ClosingSection';
import Footer from './Footer';
import { useReelScroll } from '@/hooks/useReelScroll';

/**
 * Wraps each section with scroll-driven opacity so sections crossfade as the
 * page scrolls. Centered section = full opacity; one viewport away = invisible.
 */
function ReelSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [vpH, setVpH] = useState(800);
  const [sTop, setSTop] = useState(0);
  const [sH, setSH] = useState(800);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSTop(rect.top + window.scrollY);
      setSH(rect.height);
      setVpH(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const opacity = useTransform(scrollY, (y) => {
    const viewportCenter = y + vpH / 2;
    const sectionCenter = sTop + sH / 2;
    const distance = Math.abs(viewportCenter - sectionCenter);
    const fadeDist = vpH;
    const t = Math.min(1, distance / fadeDist);
    return 1 - t;
  });

  return (
    <motion.div ref={ref} data-reel-section style={{ opacity }}>
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  useReelScroll({ sectionSelector: '[data-reel-section]' });

  return (
    <div className="bg-[#0a0a0a]">
      <LandingNav />

      {/* 1. Hero — Flow is your nature. Find it where you are. */}
      <ReelSection>
        <HeroSectionV2 />
      </ReelSection>

      {/* 2. You've been asking the right questions — falling questions */}
      <ReelSection>
        <QuestionRainSection />
      </ReelSection>

      {/* 3. It has a thousand names — historical timeline carousel */}
      <ReelSection>
        <TimelessAnchorSectionV2 />
      </ReelSection>

      {/* 4. A state of Flow — definitions card */}
      <ReelSection>
        <FlowDefinitionsSection />
      </ReelSection>

      {/* 5. Where productivity, wellness, meaning stop competing — three-circle loop */}
      <ReelSection>
        <ConvergenceSection />
      </ReelSection>

      {/* 6. That alignment has a structure — dimensions + 12 keys grid */}
      <ReelSection>
        <DimensionsSection />
      </ReelSection>

      {/* 7. Your alignment is yours alone — 12-key constellation */}
      <ReelSection>
        <UniqueStackSection />
      </ReelSection>

      {/* 8. Find it where you are — two soft doors */}
      <ReelSection>
        <ClosingSection />
      </ReelSection>

      <Footer />
    </div>
  );
}
