'use client';

import Link from 'next/link';
import LandingNav from './LandingNav';
import HeroSectionV2 from './HeroSectionV2';
import HowItWorksSection from './HowItWorksSection';
import DimensionsSection from './DimensionsSection';
import AgentTeaserSection from './AgentTeaserSection';
import AppsSection from './AppsSection';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <LandingNav />

      {/* 1. Hero */}
      <HeroSectionV2 />

      {/* 2. How It Works */}
      <HowItWorksSection />

      {/* 3. The 12 dimensions we map */}
      <DimensionsSection />

      {/* 4. Agent teaser */}
      <AgentTeaserSection />

      {/* 5. Apps — secondary */}
      <AppsSection />

      {/* 6. Work Together inline CTA */}
      <section className="relative py-16 bg-[#050505]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-600 mb-3">
            Work Together
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Walk through your profile with Alex
          </h2>
          <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
            One session. Clear direction. Book a signal session to go from profile to action.
          </p>
          <Link
            href="/together"
            className="inline-flex px-8 py-4 bg-gradient-to-r from-[#5B84B1] to-[#7A4DA4] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
          >
            Book a Signal Session
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
