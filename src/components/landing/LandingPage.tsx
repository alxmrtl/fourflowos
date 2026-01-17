'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { DIMENSIONS } from '@/data/framework';
import LandingNav from './LandingNav';
import HeroSection from './HeroSection';
import ResonanceSection from './ResonanceSection';
import NameBreakdownSection from './NameBreakdownSection';
import ShapeSymbolismSection from './ShapeSymbolismSection';
import SectionTransition from './SectionTransition';
import AppsSection from './AppsSection';
import Footer from './Footer';

const transformationSteps = [
  {
    before: 'Overwhelmed',
    after: 'Centered',
    description: 'From mental chaos to grounded clarity',
    color: '#FF6F61',
  },
  {
    before: 'Chaotic',
    after: 'Intentional',
    description: 'From fighting your environment to flowing with it',
    color: '#6BA292',
  },
  {
    before: 'Directionless',
    after: 'Purpose-Driven',
    description: 'From wandering to walking your path',
    color: '#5B84B1',
  },
  {
    before: 'Disconnected',
    after: 'Aligned',
    description: 'From fragmented to whole',
    color: '#7A4DA4',
  },
];

const principles = [
  {
    title: 'Flow Over Force',
    description: 'Stop pushing. Start aligning. Effort becomes effortless when the dimensions work as one.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Holistic by Nature',
    description: 'Mind shapes body. Space shapes mood. Spirit shapes action. Honor the connections.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: 'The Struggle Phase',
    description: 'Every session begins with resistance. The first 25% is the gateway—not the obstacle.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Work as Play',
    description: 'Transform development into a game. Progression and mastery make the journey joyful.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const transformRef = useRef(null);
  const principlesRef = useRef(null);
  const storyRef = useRef(null);

  const transformInView = useInView(transformRef, { once: true, margin: '-100px' });
  const principlesInView = useInView(principlesRef, { once: true, margin: '-100px' });
  const storyInView = useInView(storyRef, { once: true, margin: '-100px' });

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <LandingNav />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Is This You? - Immediate qualification */}
      <ResonanceSection />

      {/* Transition */}
      <SectionTransition variant="dots" />

      {/* 3. What is FourFlowOS? - Name breakdown */}
      <NameBreakdownSection />

      {/* 4. The Four Shapes - Visual symbolism */}
      <ShapeSymbolismSection />

      {/* Transition */}
      <SectionTransition fromColor="#7A4DA4" toColor="#FF6F61" />

      {/* 5. Transformation Section - The Shift */}
      <section ref={transformRef} className="relative py-16 md:py-24 bg-[#0a0a0a]">
        <motion.div
          className="max-w-6xl mx-auto px-6"
          initial="hidden"
          animate={transformInView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.1 },
            },
          }}
        >
          <motion.div
            className="text-center mb-12 md:mb-16"
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Shift
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              This is what changes when the four dimensions align.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {transformationSteps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={{
                  hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50, filter: 'blur(8px)' },
                  visible: {
                    opacity: 1,
                    x: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.7, ease: 'easeOut' },
                  },
                }}
              >
                <div
                  className="relative p-6 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 group"
                  style={{
                    boxShadow: `0 0 40px -15px ${step.color}20`,
                  }}
                >
                  {/* Arrow indicator */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-gray-500 line-through text-lg">{step.before}</span>
                    <svg
                      className="w-6 h-6 flex-shrink-0"
                      style={{ color: step.color }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="text-xl font-semibold" style={{ color: step.color }}>
                      {step.after}
                    </span>
                  </div>
                  <p className="text-gray-400">{step.description}</p>

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${step.color}10, transparent 70%)`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 6. Four Dimensions Quick View */}
      <section className="relative py-16 md:py-24 bg-[#050505]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <motion.div
          className="max-w-6xl mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
        >
          <motion.div
            className="text-center mb-12"
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Four Dimensions
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Four interconnected areas of life that, when aligned, create the conditions for flow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4">
            {Object.values(DIMENSIONS).map((dimension, index) => (
              <motion.div
                key={dimension.id}
                className="text-center p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-300 group"
                variants={{
                  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.6, ease: 'easeOut' },
                  },
                }}
                whileHover={{ y: -4 }}
              >
                <div
                  className="relative w-16 h-16 mx-auto mb-4 rounded-lg"
                  style={{ background: `${dimension.color}15` }}
                >
                  <Image
                    src={dimension.sectionLogo}
                    alt={dimension.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <h3 className="font-semibold text-white mb-2">{dimension.name}</h3>
                <p className="text-sm text-gray-500">{dimension.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-10"
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all duration-300 group"
            >
              Explore the Framework
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 7. Core Principles */}
      <section ref={principlesRef} className="relative py-16 md:py-24 bg-[#0a0a0a]">
        <motion.div
          className="max-w-6xl mx-auto px-6"
          initial="hidden"
          animate={principlesInView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
        >
          <motion.div
            className="text-center mb-12 md:mb-16"
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Guiding Principles
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              The philosophy behind the framework.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300"
                variants={{
                  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.6, ease: 'easeOut' },
                  },
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF6F61]/20 to-[#7A4DA4]/20 flex items-center justify-center text-white flex-shrink-0">
                    {principle.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 8. Apps Section */}
      <AppsSection />

      {/* 9. Origin Story - Moved toward end */}
      <section ref={storyRef} className="relative py-16 md:py-24 bg-[#0a0a0a]">
        <motion.div
          className="max-w-4xl mx-auto px-6"
          initial="hidden"
          animate={storyInView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.1 },
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
      <section className="relative py-16 md:py-24 bg-[#050505]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <motion.div
          className="max-w-4xl mx-auto px-6 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.1 },
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
