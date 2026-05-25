'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GRADIENTS } from '@/styles/brand-colors';

interface DefEntry {
  pos: string;
  text: string;
  ours?: boolean;
}

const DEFS: DefEntry[] = [
  {
    pos: 'scientific · n.',
    text: 'A state of optimal experience marked by complete absorption, where action and awareness merge.',
  },
  {
    pos: 'somatic · v.',
    text: 'To move without resistance; to act from a center that requires no effort to maintain.',
  },
  {
    pos: 'philosophical · n.',
    text: 'The alignment of inner state with outer act, such that the doing and the doer become one.',
  },
  {
    pos: 'fourflowOS · n.',
    text: 'Coherence, in motion.',
    ours: true,
  },
];

function Entry({ num, pos, text, ours, delay }: { num: number; pos: string; text: string; ours?: boolean; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="flex gap-5 py-6 border-b border-dashed border-white/[0.06] last:border-b-0"
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.6, ease: 'easeOut', delay }}
    >
      <div className="font-display text-xl text-white/45 w-7 flex-shrink-0 leading-[1.55]">{num}</div>
      <div className="flex-1 min-w-0">
        <div className="font-display italic text-white/45 text-[13px] mb-1.5 tracking-wide">{pos}</div>
        <div
          className={
            ours
              ? 'font-display italic text-2xl md:text-[26px] leading-[1.4] bg-clip-text text-transparent'
              : 'font-display text-lg md:text-xl leading-[1.55] text-white/90'
          }
          style={ours ? { backgroundImage: GRADIENTS.textWide } : undefined}
        >
          {text}
        </div>
      </div>
    </motion.div>
  );
}

export default function FlowDefinitionsSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center py-20 md:py-24 bg-[#050505] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative max-w-3xl mx-auto px-6">
        <h2 className="text-center font-display text-3xl md:text-5xl font-normal text-white leading-[1.15] mb-12 md:mb-16">
          A state of{' '}
          <span
            className="italic bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENTS.textWide }}
          >
            Flow
          </span>
          .
        </h2>

        <div className="relative bg-white/[0.015] border border-white/[0.08] p-8 md:p-14">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(99,48,160,0.06), transparent 60%)',
            }}
          />

          <div className="relative">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="font-display text-5xl md:text-6xl text-white font-medium tracking-tight">
                flow
              </span>
              <span className="font-display italic text-white/45 text-xl">/floʊ/</span>
            </div>
            <div className="text-white/30 text-[11px] tracking-[0.12em] uppercase pb-6 mb-4 border-b border-white/[0.08]">
              Old English <em>flōwan</em> · to move freely · root of <em>fluent</em>, <em>influence</em>
            </div>

            {DEFS.map((d, i) => (
              <Entry
                key={i}
                num={i + 1}
                pos={d.pos}
                text={d.text}
                ours={d.ours}
                delay={i * 0.5}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
