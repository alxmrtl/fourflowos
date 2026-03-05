'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import ParticleBackground from './ParticleBackground';

export default function HeroSectionV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      <ParticleBackground />

      {/* Floating orbs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: '#FF6F61' }}
          animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-0 top-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: '#7A4DA4' }}
          animate={{ x: [0, -60, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/4 bottom-0 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: '#6BA292' }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 w-64 h-64 rounded-full blur-3xl opacity-08"
          style={{ background: '#5B84B1' }}
          animate={{ x: [0, -30, 0], y: [0, 35, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

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
          <span className="bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] bg-clip-text text-transparent">
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
          You&apos;ve been in that state before.<br />
          Completely absorbed, things just working.<br />
          The conditions that make it available are{' '}
          <span className="whitespace-nowrap">specific to you.</span><br />
          <span className="bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] bg-clip-text text-transparent [text-shadow:none] drop-shadow-[0_0_12px_rgba(255,111,97,0.45)]">
            FourFlowOS maps them.
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
            href="/map"
            className="font-sans px-8 py-4 bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105"
          >
            Discover your archetype
          </Link>
          <a
            href="#honest-moment"
            className="font-sans text-sm text-gray-600 hover:text-gray-400 transition-colors"
          >
            See how it works ↓
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
