'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const nameBreakdown = [
  {
    word: 'FOUR',
    meaning: 'Four dimensions of life that create flow:',
    highlight: 'Self, Space, Story, Spirit.',
    color: '#FF6F61',
  },
  {
    word: 'FLOW',
    meaning: 'Effortless action. Deep engagement.',
    highlight: 'Work that feels like play.',
    color: '#6BA292',
  },
  {
    word: 'OS',
    meaning: 'An operating system for life.',
    highlight: 'A lens you see through.',
    color: '#7A4DA4',
  },
];

export default function NameBreakdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.25 });

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 bg-[#0a0a0a] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, #FF6F61 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, #7A4DA4 0%, transparent 40%)
            `,
          }}
        />
      </div>

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
        {/* Section intro */}
        <motion.div
          className="text-center mb-16"
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
            What is{' '}
            <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] via-[#5B84B1] to-[#7A4DA4] bg-clip-text text-transparent">
              FourFlowOS
            </span>
            ?
          </h2>
        </motion.div>

        {/* The three words */}
        <div className="space-y-12 md:space-y-16">
          {nameBreakdown.map((item, index) => (
            <motion.div
              key={item.word}
              className="relative"
              variants={{
                hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50, filter: 'blur(8px)' },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.8, ease: 'easeOut' },
                },
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                {/* The word */}
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span
                    className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                    style={{ color: item.color }}
                  >
                    {item.word}
                  </span>
                </motion.div>

                {/* The meaning */}
                <div className="flex-1">
                  <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                    {item.meaning}{' '}
                    <span className="text-white font-medium">{item.highlight}</span>
                  </p>
                </div>
              </div>

              {/* Decorative line */}
              {index < nameBreakdown.length - 1 && (
                <motion.div
                  className="mt-12 md:mt-16 h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${item.color}30, transparent)`,
                  }}
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1, transition: { duration: 0.8, delay: 0.3 } },
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
