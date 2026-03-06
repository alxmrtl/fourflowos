'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAudience } from '@/context/AudienceContext';
import { CORAL, SAGE, GRADIENTS } from '@/styles/brand-colors';

const individualContent = {
  opener: 'You know the feeling.',
  lines: [
    {
      highlight: 'Days when everything clicks',
      rest: ' — when work feels less like work and more like play.',
    },
    {
      highlight: 'And days when it doesn\'t.',
      rest: ' When focus is a fight. When motivation goes missing. When you\'re busy but not engaged.',
    },
  ],
  bridge: 'You\'ve tried the hacks. The apps. The routines.',
  bridgeSub: 'Some worked for a while. Most didn\'t stick.',
  pivot: 'Maybe the problem isn\'t discipline.',
  pivotHighlight: 'Maybe it\'s alignment.',
};

const leaderContent = {
  opener: 'You\'ve seen it happen.',
  lines: [
    {
      highlight: 'Someone on your team hits their stride',
      rest: ' — producing their best work, energized instead of drained.',
    },
    {
      highlight: 'And you\'ve seen the opposite.',
      rest: ' Talented people going through the motions. High performers burning out. Good teams stuck in neutral.',
    },
  ],
  bridge: 'The usual fixes don\'t fix it.',
  bridgeSub: 'More meetings. More metrics. More pressure.',
  pivot: 'Maybe engagement can\'t be demanded.',
  pivotHighlight: 'Maybe it has to be cultivated.',
};

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.25, once: false });
  const { isIndividual, isLeader } = useAudience();

  const content = isLeader ? leaderContent : individualContent;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Subtle gradient backdrop */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: isLeader
              ? `radial-gradient(ellipse at 50% 50%, ${SAGE} 0%, transparent 60%)`
              : `radial-gradient(ellipse at 50% 50%, ${CORAL} 0%, transparent 60%)`,
          }}
        />
      </div>

      <motion.div
        className="relative max-w-3xl mx-auto px-6"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.4,
              staggerChildren: 0.3,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* Opener */}
        <motion.p
          className="text-2xl md:text-3xl lg:text-4xl text-white font-light mb-12 md:mb-16"
          variants={{
            hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.8, ease: 'easeOut' },
            },
          }}
        >
          {content.opener}
        </motion.p>

        {/* Main narrative lines */}
        <div className="space-y-10 md:space-y-12 mb-16 md:mb-20">
          {content.lines.map((line, index) => (
            <motion.p
              key={index}
              className="text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed"
              variants={{
                hidden: { opacity: 0, y: 25, filter: 'blur(6px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.7, ease: 'easeOut' },
                },
              }}
            >
              <span className="text-white">{line.highlight}</span>
              {line.rest}
            </motion.p>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          className="w-16 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto mb-16 md:mb-20"
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            visible: {
              scaleX: 1,
              opacity: 1,
              transition: { duration: 0.8, ease: 'easeOut' },
            },
          }}
        />

        {/* Bridge */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: 'easeOut' },
            },
          }}
        >
          <p className="text-lg md:text-xl text-gray-400 mb-2">{content.bridge}</p>
          <p className="text-base md:text-lg text-gray-500">{content.bridgeSub}</p>
        </motion.div>

        {/* Pivot - the key insight */}
        <motion.div
          className="text-center"
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.8, ease: 'easeOut' },
            },
          }}
        >
          <p className="text-xl md:text-2xl text-gray-400 mb-3">{content.pivot}</p>
          <p
            className="text-2xl md:text-3xl lg:text-4xl font-semibold bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENTS.textWide }}
          >
            {content.pivotHighlight}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
