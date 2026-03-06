'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CORAL, GRADIENTS } from '@/styles/brand-colors';

export default function ResonanceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 bg-[#050505] overflow-hidden">
      {/* Breathing coral orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background: `radial-gradient(circle, ${CORAL} 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Scattered particle streams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: ['#E84535', '#4E8C73', '#3E6FA3', '#6330A0'][i % 4],
              left: `${20 + (i * 5)}%`,
              top: '50%',
            }}
            animate={{
              x: [0, (i % 2 === 0 ? 1 : -1) * (50 + i * 10), (i % 2 === 0 ? -1 : 1) * 30],
              y: [0, (i % 3 === 0 ? -1 : 1) * (40 + i * 8), (i % 3 === 0 ? 1 : -1) * 20],
              opacity: [0.4, 0.2, 0.4],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative max-w-3xl mx-auto px-6 text-center"
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
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-10"
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
          Is This You?
        </motion.h2>

        {/* Core pain points - single impactful line */}
        <motion.p
          className="text-2xl md:text-3xl lg:text-4xl text-gray-200 font-light leading-relaxed mb-12"
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
          Skilled but scattered.{' '}
          <span className="text-gray-400">Ambitious but exhausted.</span>{' '}
          <span className="text-gray-500">Start strong, fade fast.</span>
        </motion.p>

        {/* The reframe */}
        <motion.p
          className="text-xl md:text-2xl text-white font-medium leading-relaxed"
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
          What if the problem isn&apos;t discipline?{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textWide }}>
            What if it&apos;s disconnection?
          </span>
        </motion.p>
      </motion.div>
    </section>
  );
}
