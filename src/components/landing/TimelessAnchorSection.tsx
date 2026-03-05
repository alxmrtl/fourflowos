'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function WaterWavesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 11c2-3.5 4-3.5 6 0s4 3.5 6 0 4-3.5 6 0" />
      <path d="M2 16c2-3.5 4-3.5 6 0s4 3.5 6 0 4-3.5 6 0" />
    </svg>
  );
}

function ColumnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="4" x2="20" y2="4" />
      <rect x="9" y="4" width="6" height="15" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 13.5H11V22L20 10.5H13V2Z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
    </svg>
  );
}

function MusicNoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

const cards = [
  {
    tradition: 'Taoism',
    analog: 'Wu wei',
    body: 'Effortless action. Not forcing the river — becoming it.',
    Icon: WaterWavesIcon,
  },
  {
    tradition: 'Ancient Greece',
    analog: 'Aristeia',
    body: 'Operating at the peak of human capacity — beyond effort, beyond doubt.',
    Icon: ColumnIcon,
  },
  {
    tradition: 'Sport Science',
    analog: 'The zone',
    body: 'Body and mind as one system. No gap between intention and action.',
    Icon: LightningIcon,
  },
  {
    tradition: 'Positive Psychology',
    analog: 'Flow',
    body: 'Named by Csikszentmihalyi in the 1970s. Measured, replicated, confirmed.',
    Icon: SparkleIcon,
  },
  {
    tradition: 'Jazz & Music',
    analog: 'The pocket',
    body: 'Playing beyond technique. The groove that arrives when you stop trying to find it.',
    Icon: MusicNoteIcon,
  },
];

export default function TimelessAnchorSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  return (
    <section className="relative py-24 md:py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-14">
          <motion.h2
            className="font-display text-3xl md:text-4xl font-normal text-white mb-4"
            initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
            animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          >
            It has a thousand names.
          </motion.h2>
          <motion.p
            className="font-sans text-lg text-gray-500 max-w-md mx-auto"
            initial={{ opacity: 0, y: 32 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.12 }}
          >
            Every tradition found it. Different words, different practices — same state.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
      className="relative rounded-xl p-5 flex flex-col gap-3 bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors duration-200 cursor-default"
      initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.0, ease: 'easeOut', delay: 0.07 * index }}
    >
      {/* Icon */}
      <div className="text-[#9B7CB5]">
        <card.Icon />
      </div>

      {/* Tradition overline */}
      <p className="font-sans text-[9px] font-semibold tracking-[0.18em] uppercase text-gray-600">
        {card.tradition}
      </p>

      {/* Analog word — gradient, display */}
      <p className="font-display text-2xl font-normal bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] bg-clip-text text-transparent leading-tight">
        {card.analog}
      </p>

      {/* Description */}
      <p className="font-sans text-xs text-gray-400 leading-relaxed">
        {card.body}
      </p>
    </motion.div>
  );
}
