'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FeltBeatSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="relative py-20 md:py-28 bg-[#050505]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <motion.div
        ref={ref}
        className="max-w-lg mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      >
        <p className="font-sans text-lg text-gray-400 leading-[2]">
          You know the state. Maybe it arrived in a stretch of work that surprised you, when
          the right thing came before you reached for it. A conversation that moved faster
          than your thinking. You weren&apos;t managing it. You were just in it.
        </p>
        <p className="font-sans text-lg mt-6" style={{ color: '#FF6F61cc' }}>
          That&apos;s the one.
        </p>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
