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
  const storyRef = useRef(null);
  const ctaRef = useRef(null);

  const storyInView = useInView(storyRef, { amount: 0.3 });
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

      {/* 9. Origin Story - Moved toward end */}
      <section ref={storyRef} className="relative py-16 md:py-24 bg-[#0a0a0a]">
        <motion.div
          className="max-w-4xl mx-auto px-6"
          initial="hidden"
          animate={storyInView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } },
            visible: {
              opacity: 1,
              transition: { duration: 0.5, staggerChildren: 0.12, delayChildren: 0.1 },
            },
          }}
        >
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            variants={{
              hidden: { opacity: 0, y: 50, filter: 'blur(12px)' },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.9, ease: 'easeOut' },
              },
            }}
          >
            <div className="p-8 md:p-12 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                Where This Came From
              </h2>
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-gray-300 leading-relaxed mb-6 text-center md:text-left">
                  I spent years scattered—starting projects, losing focus, burning out. I read the research on flow states and peak performance. I studied consciousness and presence practices. Slowly, patterns emerged.
                </p>
                <p className="text-gray-400 leading-relaxed mb-6 text-center md:text-left">
                  Four areas kept showing up: how I managed myself, my environment, my sense of direction, and what actually drove me. When these aligned, focus stopped being a fight.
                </p>
                <p className="text-gray-400 leading-relaxed text-center md:text-left">
                  This framework is what I built to stay in that alignment. It&apos;s practical, tested, and it works.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 10. CTA Section */}
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
