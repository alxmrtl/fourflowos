'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const cards = [
  {
    tradition: 'Taoism',
    color: '#7A4DA4',
    body: 'Wu wei. Effortless action. Not forcing.',
  },
  {
    tradition: 'Ancient Greece',
    color: '#5B84B1',
    body: 'Aristeia. A person operating at their peak — beyond effort, beyond doubt.',
  },
  {
    tradition: 'Sport science',
    color: '#FF6F61',
    body: 'The zone. Body and mind as one system.',
  },
  {
    tradition: 'Positive psychology',
    color: '#6BA292',
    body: 'Flow. Named by Csikszentmihalyi in the 1970s. Measured, replicated, confirmed.',
  },
];

export default function TimelessAnchorSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  return (
    <section className="relative py-24 md:py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-14">
          <motion.h2
            className="font-display text-3xl md:text-4xl font-normal text-white mb-4"
            initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
            animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          >
            This state has always been there.
          </motion.h2>
          <motion.p
            className="font-sans text-lg text-gray-500 max-w-md mx-auto"
            initial={{ opacity: 0, y: 32 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.12 }}
          >
            People have been finding it and losing it for thousands of years. Different traditions,
            different names, same thing.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <AnchorCard key={card.tradition} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AnchorCard({ card, index }: { card: (typeof cards)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative rounded-xl p-5 group cursor-default"
      style={{
        backgroundColor: `${card.color}0a`,
        border: `1px solid ${card.color}22`,
        borderLeftWidth: '3px',
        borderLeftColor: `${card.color}66`,
      }}
      initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.0, ease: 'easeOut', delay: 0.08 * index }}
      whileHover={{
        backgroundColor: `${card.color}14`,
        transition: { duration: 0.2 },
      }}
    >
      <p
        className="font-sans text-[10px] font-semibold tracking-[0.18em] uppercase mb-3"
        style={{ color: card.color }}
      >
        {card.tradition}
      </p>
      <p className="font-sans text-sm text-gray-300 leading-relaxed">
        {card.body}
      </p>
    </motion.div>
  );
}
