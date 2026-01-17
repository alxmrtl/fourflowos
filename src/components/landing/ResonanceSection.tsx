'use client';

import { motion } from 'framer-motion';

export default function ResonanceSection() {
  return (
    <section className="relative py-20 md:py-28 bg-[#050505] overflow-hidden">
      {/* Subtle gradient orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background: 'radial-gradient(circle, #FF6F61 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          Is This You?
        </motion.h2>

        {/* Flowing text - each line staggers in */}
        <div className="space-y-6 md:space-y-8">
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-gray-200 font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Skilled but scattered.{' '}
            <span className="text-gray-400">Ambitious but exhausted.</span>{' '}
            <span className="text-gray-500">Starting strong, fading fast.</span>
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-gray-400 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            You've tried the apps, the routines, the hacks.{' '}
            <span className="text-gray-500">They work for a week. Then life happens.</span>
          </motion.p>

          <motion.p
            className="text-xl md:text-2xl text-white font-medium leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            What if the problem isn't discipline?{' '}
            <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] to-[#7A4DA4] bg-clip-text text-transparent">
              What if it's disconnection?
            </span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
