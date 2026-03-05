'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, CSSProperties } from 'react';

// Source images and replace `background` with `backgroundImage: 'url(/images/...)'`
// Moment 1: moody workspace — desk lamp, hands on keyboard, warm amber glow
// Moment 2: two people in close conversation — candlelight or warm cafe light
// Moment 3: movement outdoors — running or walking, early morning, open space
const MOMENTS = [
  {
    background: 'linear-gradient(160deg, #1c1408 0%, #2e2008 50%, #0c0a04 100%)',
    text: 'A stretch of work that surprised you. The right thing came before you reached for it.',
  },
  {
    background: 'linear-gradient(160deg, #180b0e 0%, #281218 50%, #0c0608 100%)',
    text: 'A conversation that moved faster than your thinking.',
  },
  {
    background: 'linear-gradient(160deg, #070d16 0%, #0e1828 50%, #050810 100%)',
    text: 'A run that cleared what an hour of thinking couldn\u2019t.',
  },
];

function MomentBlock({ moment }: { moment: (typeof MOMENTS)[0] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      className="relative w-full overflow-hidden flex items-end"
      style={{ height: '60vh', minHeight: '300px' }}
      initial={{ opacity: 0, scale: 1.03, filter: 'blur(12px)' }}
      animate={isInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ background: moment.background }} />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

      {/* Text */}
      <div className="relative w-full pb-12 px-8 md:px-16 text-center">
        <p className="font-display text-xl md:text-2xl text-white/85 italic leading-relaxed max-w-lg mx-auto">
          {moment.text}
        </p>
      </div>
    </motion.div>
  );
}

function CloserLine({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <motion.p
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      {children}
    </motion.p>
  );
}

export default function FeltBeatSection() {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, amount: 0.6 });

  return (
    <section className="relative bg-[#050505]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Intro */}
      <div className="py-24 md:py-32 text-center px-6">
        <motion.p
          ref={introRef}
          className="font-sans text-lg text-gray-400"
          initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
          animate={introInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        >
          You know the state.
        </motion.p>
      </div>

      {/* Moment blocks */}
      <div>
        {MOMENTS.map((moment, i) => (
          <MomentBlock key={i} moment={moment} />
        ))}
      </div>

      {/* Closer sentences — each reveals individually */}
      <div className="py-24 md:py-36 flex flex-col items-center gap-8 text-center px-6">
        <CloserLine className="font-sans text-lg text-gray-400">
          It wasn&apos;t something you planned for.
        </CloserLine>
        <CloserLine className="font-sans text-lg text-gray-300">
          You were just in it.
        </CloserLine>
        <CloserLine className="font-sans text-xl" style={{ color: '#FF6F61cc' }}>
          That&apos;s the one.
        </CloserLine>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
