'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { DIMENSIONS } from '@/data/framework';
import PageLayout from '@/components/layout/PageLayout';

const transformationSteps = [
  {
    before: 'Overwhelmed',
    after: 'Centered',
    description: 'From scattered attention to focused presence',
    color: '#FF6F61',
  },
  {
    before: 'Chaotic Environment',
    after: 'Intentional Space',
    description: 'From distractions everywhere to flow-optimized settings',
    color: '#6BA292',
  },
  {
    before: 'Directionless',
    after: 'Purpose-Driven',
    description: 'From random tasks to meaningful missions',
    color: '#5B84B1',
  },
  {
    before: 'Disconnected',
    after: 'Aligned',
    description: 'From going through the motions to living your values',
    color: '#7A4DA4',
  },
];

const principles = [
  {
    title: 'Flow Over Force',
    description: 'Stop grinding. Start aligning. When the four dimensions work together, effort becomes effortless.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Holistic Integration',
    description: 'Your body affects your mind. Your environment shapes your mood. Everything is connected.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: 'Struggle is Part of the Path',
    description: 'The first 25% of any focus session is the hardest. Knowing this changes everything.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Play, Not Grind',
    description: 'Personal development becomes engaging when framed as a game with progression and mastery.',
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
    title: 'High-Performers Feeling Stuck',
    description: 'You have the skills but something is missing. Success without fulfillment.',
  },
  {
    title: 'Entrepreneurs & Creatives',
    description: 'You need sustainable focus, not burnout cycles. Creative energy that flows.',
  },
  {
    title: 'Leaders Building Teams',
    description: 'Flow is contagious. When you find it, your team feels it too.',
  },
  {
    title: 'Anyone in Transition',
    description: 'New chapter? New career? The framework helps you find clarity fast.',
  },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const transformRef = useRef(null);
  const principlesRef = useRef(null);
  const whoRef = useRef(null);
  const storyRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const missionInView = useInView(missionRef, { once: true, margin: '-100px' });
  const transformInView = useInView(transformRef, { once: true, margin: '-100px' });
  const principlesInView = useInView(principlesRef, { once: true, margin: '-100px' });
  const whoInView = useInView(whoRef, { once: true, margin: '-100px' });
  const storyInView = useInView(storyRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <PageLayout accentColor="#7A4DA4">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-16 md:py-28 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-8">
              About FourFlowOS
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            Awakening the World{' '}
            <span className="bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] bg-clip-text text-transparent">
              Through Flow
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            A framework and ecosystem designed to help people discover their unique role
            in life&apos;s greater synchronicity.
          </motion.p>
        </div>

        {/* Floating logo with parallax */}
        <motion.div
          className="absolute right-[10%] top-1/2 -translate-y-1/2 opacity-5 pointer-events-none hidden lg:block"
          style={{ y: parallaxY }}
        >
          <div className="relative w-[400px] h-[400px]">
            <Image
              src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </motion.div>
      </section>

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
                    We envision a world where millions are awakened through <span className="text-white font-semibold">flow</span>,
                    discovering their unique role in life&apos;s greater synchronicity.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    Our mission is to ignite this inner fire, guiding others to find joy, purpose,
                    and fulfillment in their work and lives through a holistic framework that aligns
                    Self, Space, Story, and Spirit.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transformation Section */}
      <section ref={transformRef} className="relative py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={transformInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Transformation
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From disengaged to fully alive. This is the journey FourFlowOS facilitates.
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
      <section ref={principlesRef} className="relative py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={principlesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Core Philosophy
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              The principles that guide everything we build
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
              Who This Is For
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              FourFlowOS is built for people ready to transform how they work and live
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
      <section ref={storyRef} className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="p-8 md:p-12 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                The Origin Story
              </h2>
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-gray-300 leading-relaxed mb-6 text-center md:text-left">
                  My path led me from the haze of hesitation to the clear rhythm of inspired action.
                  I used to dance with distraction. Now, I choreograph high-flow lifestyles that bridge
                  science and spirituality to cultivate presence and clarity.
                </p>
                <p className="text-gray-400 leading-relaxed mb-6 text-center md:text-left">
                  In flow, we harmonize effort with ease, replace apathy with inspiration, and leave behind
                  grinding for thriving in joy and simplicity. Work, wellness, and wonder resonate in unison.
                </p>
                <p className="text-gray-400 leading-relaxed text-center md:text-left">
                  This framework emerged from years of studying peak performance, consciousness research,
                  and the practical application of flow science in real-world contexts. It&apos;s not just
                  theory&mdash;it&apos;s a lived methodology for sustainable excellence.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
              Ready to Begin?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Start your flow journey today. Explore the framework, try our apps, or get in touch.
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
    </PageLayout>
  );
}
