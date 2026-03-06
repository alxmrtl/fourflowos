'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import LandingNav from './LandingNav';
import HeroSectionV2 from './HeroSectionV2';
import { CORAL, SAGE, STEEL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';
import HonestMomentSection from './HonestMomentSection';
import TimelessAnchorSection from './TimelessAnchorSection';
import DimensionsSection from './DimensionsSection';
import ArchetypeRevealSection from './ArchetypeRevealSection';
import Footer from './Footer';

const pillarSymbols = [
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png', alt: 'SELF', color: CORAL, x: '-8%', y: '-4%' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png', alt: 'SPACE', color: SAGE, x: '6%', y: '4%' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png', alt: 'STORY', color: STEEL, x: '-4%', y: '6%' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPIRIT - Circle.png', alt: 'SPIRIT', color: AMETHYST, x: '8%', y: '-2%' },
];

function UniquenessHeader() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="relative pt-24 md:pt-32 pb-0 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.p
          className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-600 mb-4"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          The framework
        </motion.p>

        <motion.h2
          className="font-display text-3xl md:text-4xl font-normal text-white mb-5 leading-[1.1]"
          initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
        >
          The conditions are universal.<br />
          <span className="italic bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textAccent }}>
            Your pattern isn&apos;t.
          </span>
        </motion.h2>

        <motion.p
          className="font-sans text-lg text-gray-400 leading-relaxed mb-4"
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          We&apos;ve mapped twelve keys that govern whether flow is available to you — across four dimensions of experience. The keys are the same for everyone. How they fit together in you is not. The map is how these keys open the state.
        </motion.p>

        {/* Pillar symbol cluster */}
        <motion.div
          className="relative flex items-center justify-center gap-3 my-10 h-16"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.28 }}
        >
          {pillarSymbols.map((symbol, i) => (
            <div
              key={symbol.alt}
              className="relative w-10 h-10"
              style={{ transform: `translate(${symbol.x}, ${symbol.y})` }}
            >
              <div
                className="absolute inset-0 rounded-full blur-lg opacity-40"
                style={{ backgroundColor: symbol.color }}
              />
              <Image
                src={symbol.src}
                alt={symbol.alt}
                fill
                className="object-contain relative z-10 opacity-70"
              />
            </div>
          ))}
        </motion.div>

        <motion.p
          className="font-sans text-lg text-gray-500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.36 }}
        >
          This is the map: Twelve Keys, across Four Dimensions. One picture of how you come alive.
        </motion.p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <LandingNav />

      {/* 1. Hero */}
      <HeroSectionV2 />

      {/* 2. Honest Moment */}
      <HonestMomentSection />

      {/* 3. Timeless Anchor — historical validation */}
      <TimelessAnchorSection />

      {/* 5. Framework: Uniqueness header + DimensionsSection */}
      <UniquenessHeader />
      <DimensionsSection />

      {/* 6. Archetype Reveal */}
      <ArchetypeRevealSection />

      {/* 7. Work Together CTA */}
      <section className="relative py-16 bg-[#050505]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-gray-600 mb-3">
            Work Together
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-normal text-white mb-4">
            Read your profile with someone who knows the terrain.
          </h2>
          <p className="font-sans text-sm text-gray-400 mb-8 max-w-md mx-auto">
            One session to go from archetype to a clear next move.
          </p>
          <Link
            href="/together"
            className="font-sans inline-flex px-8 py-4 text-white font-medium rounded-full hover:shadow-lg hover:shadow-[#6330A0]/25 transition-all duration-300 hover:scale-105 text-sm"
            style={{ background: GRADIENTS.primaryCta }}
          >
            Book a signal session
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
