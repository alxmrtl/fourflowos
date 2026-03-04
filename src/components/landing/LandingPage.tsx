'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import LandingNav from './LandingNav';
import HeroSectionV2 from './HeroSectionV2';
import HonestMomentSection from './HonestMomentSection';
import TimelessAnchorSection from './TimelessAnchorSection';
import FeltBeatSection from './FeltBeatSection';
import DimensionsSection from './DimensionsSection';
import ArchetypeRevealSection from './ArchetypeRevealSection';
import Footer from './Footer';

const pillarSymbols = [
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png', alt: 'SELF', color: '#FF6F61', x: '-8%', y: '-4%' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png', alt: 'SPACE', color: '#6BA292', x: '6%', y: '4%' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png', alt: 'STORY', color: '#5B84B1', x: '-4%', y: '6%' },
  { src: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPIRIT - Circle.png', alt: 'SPIRIT', color: '#7A4DA4', x: '8%', y: '-2%' },
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
          The conditions are universal. Your pattern isn&apos;t.
        </motion.h2>

        <motion.p
          className="font-sans text-lg text-gray-400 leading-relaxed mb-4"
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          Flow runs on the same biology in every person. But the 12 conditions that make it
          available don&apos;t express the same way in everyone. How they combine, how they
          weight — that part is yours.
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
          The system maps 4 dimensions and 12 keys into a single archetype, built from how
          those factors actually show up in you.
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

      {/* 3. Timeless Anchor */}
      <TimelessAnchorSection />

      {/* 4. Felt Beat */}
      <FeltBeatSection />

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
            Walk through your profile with Alex.
          </h2>
          <p className="font-sans text-sm text-gray-400 mb-8 max-w-md mx-auto">
            One session to go from archetype to direction.
          </p>
          <Link
            href="/together"
            className="font-sans inline-flex px-8 py-4 bg-gradient-to-r from-[#5B84B1] to-[#7A4DA4] text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 text-sm"
          >
            Book a signal session
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
