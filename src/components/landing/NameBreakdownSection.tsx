'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CORAL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';

// Restored from the pre-cleanup landing page (git 8137447^) and trimmed:
// section header + the three word rows only, one register.
const nameBreakdown = [
  {
    word: 'FOUR',
    meaning: 'dimensions of life tuned to generate',
    connector: '...',
    color: '#E84535',
  },
  {
    word: 'FLOW',
    meaning: '— effortless action, peak engagement — through your own',
    connector: '...',
    color: '#4E8C73',
  },
  {
    word: 'OS',
    meaning: '— an operating system for how you work and live.',
    connector: '',
    color: '#6330A0',
  },
];

export default function NameBreakdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, ${CORAL} 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, ${AMETHYST} 0%, transparent 40%)
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
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: AMETHYST }}>
            The Name
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-white leading-tight">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textWide }}>
              FourFlowOS
            </span>
          </h2>
          <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto leading-relaxed">
            The whole system is in the name.
          </p>
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
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                    {item.meaning}
                    {item.connector && (
                      <span className="text-gray-500 ml-1">{item.connector}</span>
                    )}
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
