'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAudience } from '@/context/AudienceContext';
import { GRADIENTS } from '@/styles/brand-colors';

const individualContent = {
  paragraphs: [
    {
      text: 'There\'s a word for what happens when everything clicks.',
      style: 'opener' as const,
    },
    {
      text: 'Flow.',
      style: 'highlight' as const,
    },
    {
      text: 'That state where time disappears, focus sharpens, and effort feels effortless. Athletes call it the zone. Musicians call it being in the pocket. You\'ve felt it — and you\'ve noticed it\'s never there when you chase it.',
      style: 'body' as const,
    },
    {
      text: 'Psychologists have spent decades studying these moments. What they found changes everything:',
      style: 'body' as const,
    },
    {
      text: 'Flow isn\'t luck. It\'s a response to specific, repeatable conditions.',
      style: 'emphasis' as const,
    },
    {
      text: 'Not willpower. Not motivation hacks. Conditions.',
      style: 'body' as const,
    },
    {
      text: 'FourFlowOS gives you a lens to see which conditions are met and which aren\'t — so you can stop waiting for flow and start creating it.',
      style: 'closing' as const,
    },
  ],
};

const leaderContent = {
  paragraphs: [
    {
      text: 'There\'s a word for what happens when someone hits their stride.',
      style: 'opener' as const,
    },
    {
      text: 'Flow.',
      style: 'highlight' as const,
    },
    {
      text: 'That state where challenge meets skill, where people lose themselves in work that matters. It\'s not just a nice feeling — research shows it\'s where the best thinking, deepest creativity, and strongest engagement live.',
      style: 'body' as const,
    },
    {
      text: 'Here\'s what changes everything:',
      style: 'body' as const,
    },
    {
      text: 'Flow isn\'t random, and it isn\'t just individual.',
      style: 'emphasis' as const,
    },
    {
      text: 'It emerges from specific, designable conditions — ones already woven into how your team works, communicates, and finds meaning.',
      style: 'body' as const,
    },
    {
      text: 'FourFlowOS gives leaders a framework for seeing and shaping these conditions — turning peak performance from sporadic to structural.',
      style: 'closing' as const,
    },
  ],
};

const styleClasses: Record<string, string> = {
  opener: 'text-2xl md:text-3xl lg:text-4xl text-white font-light',
  highlight: 'text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-self via-space to-spirit bg-clip-text text-transparent',
  body: 'text-lg md:text-xl text-gray-400 leading-relaxed',
  emphasis: 'text-xl md:text-2xl lg:text-3xl text-white font-medium',
  closing: 'text-lg md:text-xl text-gray-300 leading-relaxed',
};

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2, once: false });
  const { isLeader } = useAudience();

  const content = isLeader ? leaderContent : individualContent;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-ground-deep overflow-hidden"
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.04]"
          style={{ background: '#6330A0' }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.04, 0.06, 0.04],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-[0.04]"
          style={{ background: '#4E8C73' }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.04, 0.05, 0.04],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative max-w-3xl mx-auto px-6 space-y-8 md:space-y-10"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.4,
              staggerChildren: 0.25,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {content.paragraphs.map((para, index) => (
          <motion.p
            key={index}
            className={styleClasses[para.style]}
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
            {para.style === 'closing' && para.text.startsWith('FourFlowOS')
              ? <>
                  <span className="bg-clip-text text-transparent font-medium" style={{ backgroundImage: GRADIENTS.textWide }}>FourFlowOS</span>
                  {para.text.slice('FourFlowOS'.length)}
                </>
              : para.text}
          </motion.p>
        ))}
      </motion.div>
    </section>
  );
}
