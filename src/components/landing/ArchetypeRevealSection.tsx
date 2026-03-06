'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

const featureLines = [
  { color: '#E84535', text: 'Your natural entry point into flow — the condition that opens everything else' },
  { color: '#3E6FA3', text: 'How your four dimensions interact — where they lift you, where they create drag' },
  { color: '#6330A0', text: 'The specific conditions that have always worked for you, named and mapped' },
];

const dimensions = [
  { label: 'SELF', color: '#E84535', keys: ['Tuned Emotions', 'Focused Body', 'Open Mind'] },
  { label: 'SPACE', color: '#4E8C73', keys: ['Intentional Space', 'Optimized Tools', 'Feedback Systems'] },
  { label: 'STORY', color: '#3E6FA3', keys: ['Generative Story', 'Clear Mission', 'Empowered Role'] },
  { label: 'SPIRIT', color: '#6330A0', keys: ['Grounding Values', 'Ignited Curiosity', 'Visualized Vision'] },
];

const dimensionSummaries: Record<string, string> = {
  SELF: 'Your inner signal is strong when you let emotion inform rather than drive. The body holds steadiness your mind often overrides.',
  SPACE: 'Your environment either amplifies or absorbs. The right constraints become launchpads — clutter is a hidden cost.',
  STORY: 'You orient by meaning. When the arc is clear, execution becomes obvious. Disconnected tasks drain more than they build.',
  SPIRIT: 'Curiosity is your compass. Values don\'t limit you — they\'re the ground you push off from.',
};

function BentoPreview() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/10 p-4 md:p-5">
      {/* Archetype header */}
      <div className="mb-4 pb-4 border-b border-white/[0.08]">
        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-gray-600 mb-1">
          Your Flow Archetype
        </p>
        <p className="font-sans text-base font-light text-white/80 leading-tight">
          The Resonant Architect
        </p>
        {/* 4-color hairline */}
        <div className="flex h-[2px] mt-2 mb-2 rounded-full overflow-hidden">
          <div className="flex-1" style={{ background: '#E84535' }} />
          <div className="flex-1" style={{ background: '#4E8C73' }} />
          <div className="flex-1" style={{ background: '#3E6FA3' }} />
          <div className="flex-1" style={{ background: '#6330A0' }} />
        </div>
        <p className="font-sans text-[10px] italic text-gray-500">
          You build with signal. Structure is how you transmit meaning.
        </p>
      </div>

      {/* 2×2 dimension grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {dimensions.map((dim) => (
          <div
            key={dim.label}
            className="rounded-xl overflow-hidden"
            style={{ border: `1px solid ${dim.color}22` }}
          >
            {/* Top color bar */}
            <div className="h-[3px]" style={{ background: dim.color }} />
            <div className="p-2.5 flex gap-2">
              {/* Left col */}
              <div className="w-[72px] flex-shrink-0">
                <p
                  className="font-sans text-[7px] font-semibold tracking-widest uppercase mb-2"
                  style={{ color: dim.color }}
                >
                  {dim.label}
                </p>
                <div className="flex flex-col gap-1">
                  {dim.keys.map((key) => (
                    <div
                      key={key}
                      className="rounded flex items-center gap-1 px-1 py-0.5"
                      style={{ backgroundColor: `${dim.color}14` }}
                    >
                      <div
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: dim.color }}
                      />
                      <span className="font-sans text-[6.5px] text-white/40 leading-tight truncate">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right col — summary text */}
              <div className="flex-1 min-w-0">
                <p className="font-sans text-[7px] text-gray-500 leading-[1.55]">
                  {dimensionSummaries[dim.label]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom gradient mask */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
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
              The Archetype draws on ancient wisdom traditions, personality science, and behavioral patterns, read
              through the lens of the twelve keys. What comes back is a blueprint: how you run, where you catch,
              what opens the state and what gets in the way.
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
                className="font-sans px-7 py-3.5 text-white font-medium rounded-full hover:shadow-lg hover:shadow-[#6330A0]/20 transition-all duration-300 hover:scale-105 text-sm"
                style={{ background: 'linear-gradient(135deg, #3E6FA3, #6330A0)' }}
              >
                Map your signal
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
