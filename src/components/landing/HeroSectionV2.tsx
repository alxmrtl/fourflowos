'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef, useCallback } from 'react';
import ParticleBackground from './ParticleBackground';
import { GRADIENTS } from '@/styles/brand-colors';

export default function HeroSectionV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });

  const scrollToNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('honest-moment')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      <ParticleBackground />

      {/* Ambient colour wash — static radial gradients, no GPU compositing layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 50% at 10% 15%, rgba(232,69,53,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 45% 45% at 90% 40%, rgba(122,77,164,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 28% 92%, rgba(107,162,146,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 35% 35% at 72% 68%, rgba(91,132,177,0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* Dark radial vignette behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(10,10,10,0.65) 0%, transparent 100%)' }}
      />

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: 0.6, staggerChildren: 0.18, delayChildren: 0.1 },
          },
        }}
      >
        {/* Headline */}
        <motion.h1
          className="font-display text-5xl md:text-7xl font-normal mb-2 text-white leading-[1.05] tracking-tight"
          variants={{
            hidden: { opacity: 0, y: 36, filter: 'blur(10px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: 'easeOut' } },
          }}
        >
          Flow is your nature.
        </motion.h1>

        <motion.h2
          className="font-display text-5xl md:text-7xl font-normal italic mb-8 leading-[1.05] tracking-tight"
          variants={{
            hidden: { opacity: 0, y: 36, filter: 'blur(10px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: 'easeOut' } },
          }}
        >
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textAccent }}>
            Find your way back to it.
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="font-sans text-base md:text-lg text-gray-400 max-w-md mx-auto mb-10 leading-relaxed"
          variants={{
            hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: 'easeOut' } },
          }}
        >
          The state is ancient.<br />
          <span className="bg-clip-text text-transparent [text-shadow:none]" style={{ backgroundImage: GRADIENTS.textAccent }}>
            The moment calls for it.
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col items-center gap-4"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
          }}
        >
          <Link
            href="/me"
            className="font-sans inline-flex items-center gap-2 px-8 py-4 text-white font-medium rounded-full hover:shadow-lg hover:shadow-[#6330A0]/20 transition-all duration-300 hover:scale-105"
            style={{ background: GRADIENTS.primaryCta }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z" fill="currentColor" />
            </svg>
            Begin your practice
          </Link>
          <a
            href="#honest-moment"
            onClick={scrollToNext}
            className="font-sans inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full border border-white/30 text-white/80 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all duration-300"
          >
            Walk me through it
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3v10M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
