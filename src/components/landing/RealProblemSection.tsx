'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GRADIENTS } from '@/styles/brand-colors';

const disconnectionPoints = [
  {
    text: 'Your mind is ready but your body is exhausted.',
    colors: ['#E84535', '#E84535'],
  },
  {
    text: 'Your goals are clear but your environment is chaotic.',
    colors: ['#3E6FA3', '#4E8C73'],
  },
  {
    text: 'Your values say one thing; your calendar says another.',
    colors: ['#6330A0', '#3E6FA3'],
  },
];

export default function RealProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 bg-[#0a0a0a] overflow-hidden">
      {/* Tangled threads visual - background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          className="w-full max-w-2xl h-64 opacity-20"
          viewBox="0 0 400 200"
          fill="none"
        >
          {/* Tangled state - curved intersecting paths */}
          <motion.path
            d="M50 100 Q100 50, 150 100 T250 100 Q300 150, 350 100"
            stroke="#E84535"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          <motion.path
            d="M50 80 Q120 130, 200 80 T350 80"
            stroke="#4E8C73"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
          />
          <motion.path
            d="M50 120 Q150 60, 200 120 Q250 180, 350 120"
            stroke="#3E6FA3"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.4 }}
          />
          <motion.path
            d="M50 100 Q100 160, 200 100 Q300 40, 350 100"
            stroke="#6330A0"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.6 }}
          />
        </svg>
      </div>

      <motion.div
        className="relative max-w-3xl mx-auto px-6"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.5,
              staggerChildren: 0.12,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-6 text-center"
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
          It&apos;s Not a Discipline Problem
        </motion.h2>

        {/* Opening statement */}
        <motion.p
          className="text-lg md:text-xl text-gray-400 text-center mb-12 max-w-2xl mx-auto"
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
          Most productivity systems treat you like a machine with a faulty motor.{' '}
          <span className="text-gray-500">Push harder. Optimize more. Install another app.</span>
        </motion.p>

        {/* The reframe */}
        <motion.p
          className="text-2xl md:text-3xl text-white font-medium text-center mb-12"
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
          But you&apos;re not broken.{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textAccent }}>
            You&apos;re disconnected.
          </span>
        </motion.p>

        {/* Disconnection examples */}
        <div className="space-y-4 mb-12">
          {disconnectionPoints.map((point, index) => (
            <motion.div
              key={index}
              className="relative"
              variants={{
                hidden: { opacity: 0, x: -30, filter: 'blur(6px)' },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.6, ease: 'easeOut' },
                },
              }}
            >
              <div className="flex items-center gap-4 py-3 px-4 rounded-lg bg-white/[0.02] border border-white/5">
                {/* Two colored dots showing the misalignment */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: point.colors[0] }}
                  />
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: point.colors[1] }}
                  />
                </div>
                <p className="text-gray-300 text-base md:text-lg">{point.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing insight */}
        <motion.p
          className="text-lg md:text-xl text-gray-400 text-center leading-relaxed"
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
          When the parts of your life pull in different directions,{' '}
          <span className="text-white">no amount of willpower can hold it together.</span>
        </motion.p>
      </motion.div>
    </section>
  );
}
