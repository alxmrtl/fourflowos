'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import LandingNav from './LandingNav';
import HeroSection from './HeroSection';
import NameBreakdownSection from './NameBreakdownSection';
import DimensionsSection from './DimensionsSection';
import SignalSection from './SignalSection';
import SectionTransition from './SectionTransition';
import AppsSection from './AppsSection';
import Footer from './Footer';

export default function LandingPage() {
  const ctaRef = useRef(null);

  const ctaInView = useInView(ctaRef, { amount: 0.3 });

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <LandingNav />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. What is FourFlowOS? - Name breakdown */}
      <NameBreakdownSection />

      {/* 3. The Four Dimensions */}
      <DimensionsSection />

      {/* 4. The Signal - Philosophy/Theory */}
      <SignalSection />

      {/* Transition */}
      <SectionTransition fromColor="#7A4DA4" toColor="#FF6F61" />

      {/* 5. Apps Section */}
      <AppsSection />

      {/* CTA Section */}
      <section ref={ctaRef} className="relative py-16 md:py-24 bg-[#050505]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <motion.div
          className="max-w-4xl mx-auto px-6 text-center"
          initial="hidden"
          animate={ctaInView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } },
            visible: {
              opacity: 1,
              transition: { duration: 0.5, staggerChildren: 0.12, delayChildren: 0.1 },
            },
          }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            variants={{
              hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.7, ease: 'easeOut' },
              },
            }}
          >
            Start Here
          </motion.h2>
          <motion.p
            className="text-gray-400 mb-8 max-w-xl mx-auto"
            variants={{
              hidden: { opacity: 0, y: 25, filter: 'blur(8px)' },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.7, ease: 'easeOut' },
              },
            }}
          >
            Explore the framework. Try the apps. See what alignment feels like.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: 'easeOut' },
              },
            }}
          >
            <Link
              href="/framework"
              className="px-8 py-4 bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              Explore the Framework
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-full hover:bg-white/5 hover:border-gray-400 transition-all duration-300"
            >
              Get in Touch
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
