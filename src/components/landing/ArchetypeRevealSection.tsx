'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

const featureLines = [
  { color: '#FF6F61', text: 'Which keys are central to your flow' },
  { color: '#5B84B1', text: 'Where your four dimensions support or limit each other' },
  { color: '#7A4DA4', text: 'Your clearest, most natural entry point' },
];

const dimensions = [
  { label: 'SELF', color: '#FF6F61', keys: ['Tuned Emotions', 'Focused Body', 'Open Mind'] },
  { label: 'SPACE', color: '#6BA292', keys: ['Intentional Space', 'Optimized Tools', 'Feedback Systems'] },
  { label: 'STORY', color: '#5B84B1', keys: ['Generative Story', 'Clear Mission', 'Empowered Role'] },
  { label: 'SPIRIT', color: '#7A4DA4', keys: ['Grounding Values', 'Ignited Curiosity', 'Visualized Vision'] },
];

function BentoPreview() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/10 p-4 md:p-5">
      {/* Archetype header */}
      <div className="mb-4 pb-4 border-b border-white/8">
        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-gray-600 mb-1">
          Your Flow Archetype
        </p>
        <div className="h-5 w-40 rounded bg-gradient-to-r from-[#FF6F61]/30 to-[#7A4DA4]/30" />
        <div className="h-3 w-56 rounded bg-white/5 mt-2" />
      </div>

      {/* 2×2 dimension grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        {dimensions.map((dim) => (
          <div
            key={dim.label}
            className="rounded-xl p-3"
            style={{ backgroundColor: `${dim.color}0c`, border: `1px solid ${dim.color}22` }}
          >
            <p
              className="font-sans text-[8px] font-semibold tracking-widest uppercase mb-2"
              style={{ color: dim.color }}
            >
              {dim.label}
            </p>
            {/* Summary line */}
            <div className="h-2 w-full rounded bg-white/8 mb-1.5" />
            <div className="h-2 w-3/4 rounded bg-white/5 mb-3" />
            {/* Key pills */}
            <div className="flex flex-col gap-1">
              {dim.keys.map((key) => (
                <div
                  key={key}
                  className="h-5 rounded-lg flex items-center px-1.5"
                  style={{ backgroundColor: `${dim.color}18` }}
                >
                  <div
                    className="w-1 h-1 rounded-full mr-1.5 flex-shrink-0"
                    style={{ backgroundColor: dim.color }}
                  />
                  <span className="font-sans text-[7px] text-white/40 truncate">{key}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Signal strip */}
      <div className="grid grid-cols-3 gap-2">
        {['Life Path', 'Expression', 'Soul Urge'].map((label, i) => (
          <div key={label} className="rounded-lg bg-white/[0.03] border border-white/8 p-2 text-center">
            <p className="font-sans text-[7px] text-gray-600 mb-1">{label}</p>
            <div className="h-4 w-6 rounded mx-auto bg-white/10" />
          </div>
        ))}
      </div>

      {/* Bottom gradient mask */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </div>
  );
}

export default function ArchetypeRevealSection() {
  const copyRef = useRef(null);
  const previewRef = useRef(null);
  const copyInView = useInView(copyRef, { once: true, amount: 0.3 });
  const previewInView = useInView(previewRef, { once: true, amount: 0.3 });

  return (
    <section className="relative py-24 md:py-32 bg-[#050505]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — copy */}
          <motion.div
            ref={copyRef}
            initial={{ opacity: 0, x: -40, filter: 'blur(14px)' }}
            animate={copyInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          >
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-600 mb-4">
              Your Flow Archetype
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-normal text-white mb-5 leading-[1.1]">
              Here&apos;s how you work.
            </h2>
            <p className="font-sans text-lg text-gray-400 leading-relaxed mb-8">
              The Archetype Signal pulls from numerology, personality science, and behavioral patterns,
              reading them through the lens of the 12 keys. What comes back isn&apos;t a score — it&apos;s
              a picture of how you specifically come alive.
            </p>

            {/* Feature lines */}
            <ul className="space-y-3 mb-10">
              {featureLines.map((line) => (
                <li key={line.text} className="flex items-center gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: line.color }}
                  />
                  <span className="font-sans text-sm text-gray-300">{line.text}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/map"
                className="font-sans px-7 py-3.5 bg-gradient-to-r from-[#FF6F61] to-[#7A4DA4] text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 text-sm"
              >
                Discover your archetype
              </Link>
              <Link
                href="/framework"
                className="font-sans text-sm text-gray-500 hover:text-gray-300 transition-colors self-center"
              >
                Explore the framework →
              </Link>
            </div>
          </motion.div>

          {/* Right — BentoGrid preview */}
          <motion.div
            ref={previewRef}
            className="relative"
            initial={{ opacity: 0, x: 40, filter: 'blur(14px)' }}
            animate={previewInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.12 }}
          >
            <div className="opacity-70 rotate-1 md:rotate-2 transition-transform duration-500 hover:rotate-0">
              <BentoPreview />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
