'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import IntakeForm from './IntakeForm';
import { GRADIENTS } from '@/styles/brand-colors';

export default function IntakePageContent() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <PageLayout showFooter={false} accentColor="#6330A0">
      {/* Hero */}
      <section ref={heroRef} className="relative py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-6">
              Flow Profile
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-5xl font-display font-bold italic text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            Map Your{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textWide }}>
              Flow State
            </span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            This intake maps your consciousness across four dimensions — Self, Space, Story, and Spirit.
            Take your time. There are no wrong answers.
          </motion.p>
        </div>
      </section>

      {/* Form */}
      <section className="relative pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <IntakeForm />
        </div>
      </section>
    </PageLayout>
  );
}
