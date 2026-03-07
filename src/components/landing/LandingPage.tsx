'use client';

import Link from 'next/link';
import LandingNav from './LandingNav';
import HeroSectionV2 from './HeroSectionV2';
import { GRADIENTS } from '@/styles/brand-colors';
import HonestMomentSection from './HonestMomentSection';
import TimelessAnchorSection from './TimelessAnchorSection';
import DimensionsSection from './DimensionsSection';
import ArchetypeRevealSection from './ArchetypeRevealSection';
import Footer from './Footer';


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

      {/* 5. Framework: DimensionsSection (includes "conditions are universal" header) */}
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
