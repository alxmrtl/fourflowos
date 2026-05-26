'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

function scrollToNext(from: HTMLElement | null) {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-reel-section]'));
  const parent = from?.closest('[data-reel-section]') as HTMLElement | null;
  const idx = parent ? sections.indexOf(parent) : -1;
  const next = sections[idx + 1];
  if (!next) return;
  const startY = window.scrollY;
  const distance = next.offsetTop - startY;
  const startTime = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / 900);
    window.scrollTo(0, startY + distance * easeOutQuart(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function PrincipleBridge({ children, className = '' }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.button
      ref={ref}
      onClick={() => scrollToNext(ref.current)}
      className={`group font-display italic text-white/70 hover:text-white/90 md:text-white/50 md:hover:text-white/75 text-base md:text-lg text-center mt-10 md:mt-14 mx-auto w-fit flex items-center gap-3 backdrop-blur-sm bg-white/[0.04] border border-white/[0.1] rounded-full px-8 py-3 shadow-[0_0_24px_rgba(255,255,255,0.05)] hover:shadow-[0_0_36px_rgba(255,255,255,0.1)] hover:bg-white/[0.07] hover:border-white/[0.18] transition-all duration-300 cursor-pointer ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
    >
      {children}
      <span className="opacity-60 group-hover:opacity-90 transition-opacity">↓</span>
    </motion.button>
  );
}
