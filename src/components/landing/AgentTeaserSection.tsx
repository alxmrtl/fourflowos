'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AgentTeaserSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-20 md:py-24 bg-[#0a0a0a]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-600 mb-3">
            Coming next
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            The{' '}
            <span className="bg-gradient-to-r from-[#6BA292] to-[#7A4DA4] bg-clip-text text-transparent">
              FourFlow Agent
            </span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-3">
            Your Flow Profile is a snapshot. The agent is what happens after — an AI observer that knows your profile and watches how you actually work.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            It notices patterns. It asks the right question at the right time. It adapts its presence to where you are. The 12 keys are its internal map, not its vocabulary.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
