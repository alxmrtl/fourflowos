'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const principles = [
  {
    title: 'Flow Over Force',
    description: 'Effort becomes effortless when the dimensions work as one.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    gradient: 'from-self/20 to-space/20',
  },
  {
    title: 'Resistance is Information',
    description: "We welcome resistance. It's the gateway, not the obstacle.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    gradient: 'from-space/20 to-story/20',
  },
  {
    title: 'Work as Play',
    description: 'Progression and mastery make the journey joyful.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    gradient: 'from-story/20 to-spirit/20',
  },
];

export default function DifferentApproachSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.25 });

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 bg-ground-deep overflow-hidden">
      {/* Subtle warming gradient */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.03 } : { opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(ellipse at center, #E84535 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative max-w-4xl mx-auto px-6"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.5,
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
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
          What if You Stopped Fighting?
        </motion.h2>

        <motion.p
          className="text-gray-500 text-center mb-12 max-w-xl mx-auto"
          variants={{
            hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.6, ease: 'easeOut' },
            },
          }}
        >
          A different philosophy for how work gets done.
        </motion.p>

        {/* Three principles */}
        <div className="space-y-6">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              className="relative"
              variants={{
                hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.7, ease: 'easeOut', delay: index * 0.1 },
                },
              }}
            >
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors duration-300">
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${principle.gradient} flex items-center justify-center text-white flex-shrink-0`}
                  >
                    {principle.icon}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
