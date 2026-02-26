'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Map your signal',
    body: 'Take the intake. 12 questions across 4 dimensions. No generic advice — just a clear read of where your signal is blocked.',
    color: '#FF6F61',
    href: '/map',
    cta: 'Start now',
  },
  {
    number: '02',
    title: 'See what\'s in the way',
    body: 'Receive your Flow Archetype — an AI-generated profile across all 12 keys that names the specific pattern holding you back.',
    color: '#6BA292',
    href: null,
    cta: null,
  },
  {
    number: '03',
    title: 'Move through it',
    body: 'Work with the tools, the framework, or a practitioner. The path forward is specific to you.',
    color: '#7A4DA4',
    href: '/together',
    cta: 'Work together',
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" ref={ref} className="relative py-20 md:py-28 bg-[#0a0a0a]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-3xl mx-auto px-6">
        <motion.p
          className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-600 mb-3"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          How it works
        </motion.p>
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-white mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          Three moves. One clear signal.
        </motion.h2>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="flex gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
            >
              {/* Left border */}
              <div
                className="w-1 flex-shrink-0 rounded-full"
                style={{ background: step.color }}
              />
              <div>
                <p
                  className="text-[10px] font-semibold tracking-widest uppercase mb-1"
                  style={{ color: step.color }}
                >
                  {step.number}
                </p>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">{step.body}</p>
                {step.href && step.cta && (
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-1 text-xs transition-colors"
                    style={{ color: step.color }}
                  >
                    {step.cta} <span>→</span>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
