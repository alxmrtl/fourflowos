'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GRADIENTS } from '@/styles/brand-colors';

interface DefEntry {
  pos: string;
  text: string;
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
    text: 'Coherence of inner state with outer act, such that the doing and the doer become one.',
  },
];

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

function scrollToNext(from: HTMLElement | null) {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-reel-section]'));
  const parent = from?.closest('[data-reel-section]') as HTMLElement | null;
  const idx = parent ? sections.indexOf(parent) : -1;
  const next = sections[idx + 1];
  if (!next) return;
  const startY = window.scrollY;
  const distance = next.offsetTop - startY;
  const startTime = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / 900);
    window.scrollTo(0, startY + distance * easeOutQuart(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function Entry({ num, pos, text, delay }: { num: number; pos: string; text: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="flex gap-3 md:gap-4 py-2.5 md:py-4 border-b border-dashed border-white/[0.06] last:border-b-0"
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.6, ease: 'easeOut', delay }}
    >
      <div className="font-display text-sm md:text-xl text-white/70 md:text-white/45 w-5 md:w-6 flex-shrink-0 leading-[1.55]">{num}</div>
      <div className="flex-1 min-w-0">
        <div className="hidden md:block font-display italic text-white/45 text-[13px] mb-1.5 tracking-wide">{pos}</div>
        <div className="md:hidden font-display text-sm leading-[1.5] text-white/85">
          <span className="italic text-white/60 md:text-white/40 mr-1">{pos} </span>{text}
        </div>
        <div className="hidden md:block font-display md:text-base leading-[1.55] text-white/90">
          {text}
        </div>
      </div>
    </motion.div>
  );
}

function FourFlowBridge() {
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.button
      ref={ref}
      onClick={() => scrollToNext(ref.current)}
      className="group w-fit mt-5 md:mt-10 flex flex-col items-start gap-2 backdrop-blur-sm bg-white/[0.07] border border-white/[0.18] rounded-2xl px-6 py-2.5 md:px-8 md:py-4 shadow-[0_0_36px_rgba(122,77,164,0.28)] hover:shadow-[0_0_56px_rgba(122,77,164,0.45)] hover:bg-white/[0.11] hover:border-white/[0.28] transition-all duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
    >
      <div className="font-display italic text-white/60 md:text-white/40 text-[12px] tracking-wide group-hover:text-white/70 md:group-hover:text-white/55 transition-colors">
        fourflowOS · n.
      </div>
      <div className="flex items-center gap-3">
        <div
          className="font-display italic text-base md:text-lg leading-[1.3] bg-clip-text text-transparent"
          style={{ backgroundImage: GRADIENTS.textWide }}
        >
          Optimal experience through alignment.
        </div>
        <span className="text-white/55 md:text-white/35 group-hover:text-white/70 md:group-hover:text-white/60 transition-colors flex-shrink-0">↓</span>
      </div>
    </motion.button>
  );
}

export default function FlowDefinitionsSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center py-6 md:py-24 bg-[#050505] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative max-w-3xl mx-auto px-6">
        <h2 className="text-center font-display text-3xl md:text-5xl font-normal text-white leading-[1.15] mb-4 md:mb-10">
          A state of{' '}
          <span
            className="italic bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENTS.textWide }}
          >
            Flow
          </span>
          .
        </h2>

        <div className="relative bg-white/[0.015] border border-white/[0.08] p-4 md:p-8">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(99,48,160,0.06), transparent 60%)',
            }}
          />

          <div className="relative">
            <div className="flex items-baseline gap-4 mb-3 md:mb-2 pb-3 md:pb-0 border-b md:border-b-0 border-white/[0.08]">
              <span className="font-display text-3xl md:text-4xl text-white font-medium tracking-tight">
                flow
              </span>
              <span className="font-display italic text-white/45 text-xl">/floʊ/</span>
            </div>
            <div className="hidden md:block text-white/30 text-[11px] tracking-[0.12em] uppercase pb-6 mb-4 border-b border-white/[0.08]">
              Old English <em>flōwan</em> · to move freely · root of <em>fluent</em>, <em>influence</em>
            </div>

            {DEFS.map((d, i) => (
              <Entry
                key={i}
                num={i + 1}
                pos={d.pos}
                text={d.text}
                delay={i * 0.5}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative max-w-3xl mx-auto px-6 flex justify-start">
        <FourFlowBridge />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
