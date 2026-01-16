'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { DIMENSIONS } from '@/data/framework';
import LandingNav from './LandingNav';
import HeroSection from './HeroSection';
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

const whoItsFor = [
  {
    title: 'High-Performers',
    description: 'Skilled but unfulfilled. Ready to add meaning to success.',
  },
  {
    title: 'Entrepreneurs & Creatives',
    description: 'Done with burnout. Ready for sustainable, flowing energy.',
  },
  {
    title: 'Leaders',
    description: 'Your flow becomes your team\'s flow. Alignment is contagious.',
  },
  {
    title: 'Career Changers',
    description: 'In transition? Find clarity through the four dimensions.',
  },
];

export default function LandingPage() {
  const missionRef = useRef(null);
  const transformRef = useRef(null);
  const principlesRef = useRef(null);
  const whoRef = useRef(null);
  const storyRef = useRef(null);

  const missionInView = useInView(missionRef, { once: true, margin: '-100px' });
  const transformInView = useInView(transformRef, { once: true, margin: '-100px' });
  const principlesInView = useInView(principlesRef, { once: true, margin: '-100px' });
  const whoInView = useInView(whoRef, { once: true, margin: '-100px' });
  const storyInView = useInView(storyRef, { once: true, margin: '-100px' });

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <LandingNav />
      <HeroSection />

      {/* Mission Section */}
      <section ref={missionRef} className="relative py-16 md:py-24 bg-[#050505]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4] opacity-20" />
            <div className="absolute inset-[1px] rounded-2xl bg-[#0a0a0a]" />

            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="grid lg:grid-cols-5 gap-8 items-center">
                {/* Logo */}
                <div className="lg:col-span-2 flex justify-center">
                  <motion.div
                    className="relative w-40 h-40 md:w-56 md:h-56"
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {/* Glow ring */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'conic-gradient(from 0deg, #FF6F61, #6BA292, #5B84B1, #7A4DA4, #FF6F61)',
                        filter: 'blur(30px)',
                        opacity: 0.3,
                      }}
                    />
                    <Image
                      src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png"
                      alt="FourFlowOS"
                      fill
                      className="object-contain relative z-10"
                    />
                  </motion.div>
                </div>

                {/* Mission text */}
                <div className="lg:col-span-3">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Our Mission
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                    Millions moving from scattered to centered. From going through the motions to <span className="text-white font-semibold">fully alive</span>.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    We cultivate presence and clarity through a framework that harmonizes your inner world with your outer environment. This is the path from distraction to flow.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transformation Section */}
      <section ref={transformRef} className="relative py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={transformInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
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
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                animate={transformInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.15, duration: 0.6 }}
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
        </div>
      </section>

      {/* Four Dimensions Quick View */}
      <section className="relative py-16 md:py-24 bg-[#050505]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
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
        </div>
      </section>

      {/* Core Principles */}
      <section ref={principlesRef} className="relative py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={principlesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
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
                initial={{ opacity: 0, y: 30 }}
                animate={principlesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
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
        </div>
      </section>

      {/* Who It's For */}
      <section ref={whoRef} className="relative py-16 md:py-24 bg-[#050505]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={whoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built For
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              People ready to transform how they work and live.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whoItsFor.map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={whoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section ref={storyRef} className="relative py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
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
        </div>
      </section>

      <AppsSection />

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 bg-[#050505]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Here
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Explore the framework. Try the apps. See what alignment feels like.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
