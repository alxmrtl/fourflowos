'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAudience } from '@/context/AudienceContext';

const individualContent = {
  opener: 'Flow isn\'t random.',
  intro: 'It emerges when certain conditions line up:',
  conditions: [
    { text: 'What you\'re doing matters to you', color: '#7A4DA4' },
    { text: 'Your environment supports deep work', color: '#6BA292' },
    { text: 'Your energy is there to give', color: '#FF6F61' },
    { text: 'You have a reason bigger than the task', color: '#5B84B1' },
  ],
  outcomes: [
    'When these align, effort becomes effortless.',
    'Focus becomes natural.',
    'Work becomes meaningful.',
  ],
};

const leaderContent = {
  opener: 'Flow isn\'t just personal.',
  intro: 'It emerges when conditions support it:',
  conditions: [
    { text: 'When people connect their work to meaning', color: '#7A4DA4' },
    { text: 'When environments enable instead of interrupt', color: '#6BA292' },
    { text: 'When energy is protected, not extracted', color: '#FF6F61' },
    { text: 'When purpose runs deeper than the paycheck', color: '#5B84B1' },
  ],
  outcomes: [
    'When you create these conditions,',
    'people don\'t just perform better.',
    'They come alive.',
  ],
};

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2, once: false });
  const { isLeader } = useAudience();

  const content = isLeader ? leaderContent : individualContent;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#050505] overflow-hidden"
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.04]"
          style={{ background: '#7A4DA4' }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.04, 0.06, 0.04],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-[0.04]"
          style={{ background: '#6BA292' }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.04, 0.05, 0.04],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
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
              staggerChildren: 0.2,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* Opener */}
        <motion.p
          className="text-2xl md:text-3xl lg:text-4xl text-white font-light mb-8"
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

        {/* Intro */}
        <motion.p
          className="text-lg md:text-xl text-gray-400 mb-10"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: 'easeOut' },
            },
          }}
        >
          {content.intro}
        </motion.p>

        {/* Conditions list */}
        <motion.div
          className="space-y-5 mb-16 md:mb-20 pl-4 border-l-2 border-white/10"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {content.conditions.map((condition, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, ease: 'easeOut' },
                },
              }}
            >
              <span
                className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0"
                style={{ background: condition.color }}
              />
              <p className="text-lg md:text-xl text-gray-300">{condition.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Outcomes */}
        <motion.div
          className="text-center"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.2 },
            },
          }}
        >
          {content.outcomes.map((line, index) => (
            <motion.p
              key={index}
              className={`text-xl md:text-2xl ${
                index === content.outcomes.length - 1
                  ? 'text-white font-medium mt-2'
                  : 'text-gray-400'
              }`}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: 'easeOut' },
                },
              }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
