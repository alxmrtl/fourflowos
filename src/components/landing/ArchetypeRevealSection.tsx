'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CORAL, SAGE, STEEL, AMETHYST, GRADIENTS } from '@/styles/brand-colors';

const featureLines = [
  { color: AMETHYST, text: 'Flow Unlock · Ancestral Signal — read where the pattern lives' },
  { color: STEEL,    text: 'FlowRead · FlowCompendium — take signal in, learn the science' },
  { color: CORAL,    text: 'FlowBreath · FlowSpark — shift state, find what\'s pulling' },
  { color: SAGE,     text: 'FlowZone — focus reps for the moments you almost lose it' },
];

const SECTIONS = [
  {
    id: 'core',
    label: 'CORE',
    desc: 'Know yourself',
    color: AMETHYST,
    tools: [
      { name: 'Flow Unlock', sub: 'Find your block' },
      { name: 'Ancestral Signal', sub: 'Deep architecture' },
    ],
    active: true,
  },
  {
    id: 'consume',
    label: 'CONSUME',
    desc: 'Take something in',
    color: STEEL,
    tools: [
      { name: 'FlowRead', sub: 'Focus reading trainer' },
      { name: 'FlowCompendium', sub: '191 flow protocols' },
    ],
    active: false,
  },
  {
    id: 'catalyze',
    label: 'CATALYZE',
    desc: 'Break inertia',
    color: CORAL,
    tools: [
      { name: 'FlowBreath', sub: 'Shift state — body first' },
      { name: 'FlowSpark', sub: 'Map what pulls you' },
    ],
    active: false,
  },
  {
    id: 'create',
    label: 'CREATE',
    desc: 'Enter deep work',
    color: SAGE,
    tools: [{ name: 'FlowZone', sub: 'Focus timer + reps' }],
    active: false,
  },
];

function SectionColPreview({
  section,
  index,
}: {
  section: (typeof SECTIONS)[0];
  index: number;
}) {
  return (
    <div
      className="flex flex-col"
      style={{ borderRight: index < 3 ? '1px solid rgba(255,255,255,0.06)' : undefined }}
    >
      {/* Mini animation blob */}
      <div className="h-[48px] flex items-center justify-center overflow-hidden">
        <motion.div
          className="rounded-full"
          style={{
            width: 40,
            height: 40,
            background: `radial-gradient(circle, ${section.color}50 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.9,
          }}
        />
      </div>

      {/* Section header */}
      <div className="px-2.5 pb-2 border-b border-white/[0.05]">
        <p
          className="text-[7.5px] font-bold uppercase tracking-[0.18em] leading-none"
          style={{ color: section.color }}
        >
          {section.label}
        </p>
        <p className="text-[6.5px] text-white/25 mt-0.5">{section.desc}</p>
      </div>

      {/* Tool buttons */}
      <div className="flex flex-col gap-1.5 px-2 py-2">
        {section.tools.map((tool, i) => (
          <div
            key={tool.name}
            className="rounded-md px-2 py-1.5"
            style={{
              backgroundColor: `${section.color}${section.active && i === 0 ? '22' : '0f'}`,
              border: `1px solid ${section.color}${section.active && i === 0 ? '40' : '1a'}`,
            }}
          >
            <p
              className="text-[7px] font-medium leading-tight"
              style={{
                color:
                  section.active && i === 0
                    ? 'rgba(255,255,255,0.80)'
                    : 'rgba(255,255,255,0.45)',
              }}
            >
              {tool.name}
            </p>
            <p className="text-[6px] text-white/25 leading-tight mt-0.5">{tool.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowLabPreview() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/10">
      {/* Simulated nav bar */}
      <div className="flex items-center justify-between px-4 h-9 bg-[#0a0a0a]/95 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-white/15" />
          <span className="text-[9px] font-bold text-white/35 tracking-wide">
            FourFlow<span className="text-white/15">OS</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-[8px] text-white/20">How It Works</span>
          <span className="hidden sm:block text-[8px] text-white/20">Practice</span>
          <span
            className="text-[8px] px-2 py-0.5 rounded-full border"
            style={{
              color: STEEL,
              borderColor: `${STEEL}70`,
              background: `${STEEL}18`,
            }}
          >
            Your Practice
          </span>
        </div>
      </div>

      {/* Section bar — 4 columns */}
      <div className="grid grid-cols-4">
        {SECTIONS.map((section, i) => (
          <SectionColPreview key={section.id} section={section} index={i} />
        ))}
      </div>

      {/* Activity area */}
      <div className="border-t border-white/[0.07] px-5 py-5 flex flex-col items-center justify-center gap-3 min-h-[88px]">
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: AMETHYST }}
          />
          <span
            className="text-[8px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: AMETHYST }}
          >
            Flow Unlock
          </span>
        </div>
        <div className="w-full max-w-[180px] space-y-1.5">
          <div className="h-1.5 rounded-full bg-white/[0.06] w-full" />
          <div className="h-1.5 rounded-full bg-white/[0.06] w-4/5" />
          <div className="h-1.5 rounded-full bg-white/[0.06] w-3/5" />
        </div>
      </div>

      {/* Bottom gradient mask */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </div>
  );
}

export default function ArchetypeRevealSection() {
  const copyRef = useRef(null);
  const previewRef = useRef(null);
  const copyInView = useInView(copyRef, { once: true, amount: 0.3 });
  const previewInView = useInView(previewRef, { once: true, amount: 0.3 });

  return (
    <section className="relative min-h-screen flex flex-col justify-center py-16 md:py-20 bg-[#050505]">
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
              Your practice
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-normal text-white mb-5 leading-[1.15]">
              It already lives<br />
              <span
                className="italic bg-clip-text text-transparent"
                style={{ backgroundImage: GRADIENTS.textWide }}
              >
                in the practice
              </span>
              .
            </h2>
            <p className="font-sans text-lg text-gray-400 leading-relaxed mb-8">
              You discover the pattern by doing the work. The stack is the daily surface where it becomes visible.
            </p>

            {/* Feature lines */}
            <ul className="space-y-3">
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
          </motion.div>

          {/* Right — FlowLab UI preview */}
          <motion.div
            ref={previewRef}
            className="relative"
            initial={{ opacity: 0, x: 40, filter: 'blur(14px)' }}
            animate={previewInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.12 }}
          >
            <div className="opacity-70 rotate-1 md:rotate-2 transition-transform duration-500 hover:rotate-0">
              <FlowLabPreview />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
