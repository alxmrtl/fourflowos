'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { GRADIENTS, STEEL, SAGE, AMETHYST } from '@/styles/brand-colors';
import { useCallback, useRef, useState } from 'react';
import { DIMENSIONS } from '@/data/framework';
import { APPS } from '@/data/apps';
import PageLayout from '@/components/layout/PageLayout';
import NameBreakdownSection from '@/components/landing/NameBreakdownSection';
import SynergyConstellation from '@/components/landing/SynergyConstellation';

const dimensionDetails = {
  self: {
    descriptor: 'Your inner state',
    question: 'How am I right now?',
    tagline: 'Body, mind, and emotion in tune — the first condition of flow.',
    orientation:
      'Inward. The state you arrive with: body, mind, emotions. Everything else lands on this ground.',
    withoutThis:
      'Nothing lands. A restless body or a noisy mind blocks the best setup and the clearest mission.',
  },
  space: {
    descriptor: 'Your environment',
    question: 'What supports my flow?',
    tagline: 'The setup that makes focus the path of least resistance.',
    orientation:
      'Outward. The world around the work: rooms, tools, feedback. Set up well, focus becomes the default.',
    withoutThis:
      'Every session is a fight with your surroundings. Willpower does work your setup should do for free.',
  },
  story: {
    descriptor: 'Your direction',
    question: 'What am I building?',
    tagline: 'Mission, role, and arc — where past meets future.',
    orientation:
      'Across time. A mission you can name, a role you own, an arc connecting today to what you’re building.',
    withoutThis:
      'Good days stop adding up. Effort scatters, and work starts to feel like motion without meaning.',
  },
  spirit: {
    descriptor: 'Your core',
    question: 'What drives me?',
    tagline: 'Values and vision as fuel, not constraint.',
    orientation:
      'Beyond time. Values you live, curiosity that pulls, a vision clear enough to steer by.',
    withoutThis:
      'Everything runs on discipline. Direction drifts, and energy has no source deeper than the deadline.',
  },
};

const convictions = [
  {
    claim: 'Flow isn’t forced. It’s cultivated.',
    support: 'The capacity is already there. The work is clearing what’s in the way.',
  },
  {
    claim: 'The blocker is a condition, never a character flaw.',
    support:
      'Twelve conditions open flow. When it won’t come, one of them is jammed. You can find which.',
  },
  {
    claim: 'Diagnosis precedes intervention.',
    support:
      'Most fixes get applied before anyone finds the real blocker. Name the bottleneck first. One targeted move beats ten generic ones.',
  },
  {
    claim: 'Wholeness over fragment.',
    support:
      'Flow doesn’t live inside one activity. It shows up when self, space, story, and spirit point the same way.',
  },
];

// Tools shown in the carousel — each mapped to the key(s) it trains.
const TOOL_ROWS: { appId: string; keys: { label: string; color: string }[]; badge?: string }[] = [
  { appId: 'flowbreath', keys: [{ label: 'Tuned Emotions', color: '#E84535' }] },
  {
    appId: 'flowzone',
    keys: [
      { label: 'Focused Body', color: '#E84535' },
      { label: 'Intentional Space', color: '#4E8C73' },
    ],
  },
  { appId: 'flowread', keys: [{ label: 'Open Mind', color: '#E84535' }] },
  { appId: 'curiosity-explorer', keys: [{ label: 'Ignited Curiosity', color: '#6330A0' }] },
  { appId: 'flowwrite', keys: [{ label: 'Generative Story', color: '#3E6FA3' }] },
  { appId: 'flowcompendium', keys: [{ label: 'All twelve keys', color: '#9CA3AF' }] },
  { appId: 'flowrep', keys: [{ label: 'Focused Body', color: '#E84535' }], badge: 'iOS' },
  {
    appId: 'flowhabits',
    keys: [{ label: 'All four dimensions', color: '#9CA3AF' }],
    badge: 'iOS · soon',
  },
];

// Radial reveal origins based on key index (left / middle / right);
// dimension flips sweep out from the header.
const KEY_ORIGINS = ['15% 75%', '50% 75%', '85% 75%'];
const DIMENSION_ORIGIN = '15% 20%';

type Selection = { dimensionId: string; keyId: string | null } | null;

/** The one header pattern every section on this page uses. */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <motion.div
      className="text-center mb-12 md:mb-16 px-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: AMETHYST }}>
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-normal text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}

/**
 * The aperture: twelve gate blades, three per dimension, opening like an iris.
 * The page's one signature visual.
 */
function ApertureVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const reduce = useReducedMotion();
  const open = reduce || inView;

  const C = 120;
  const R1 = 60;
  const R2 = 94;
  const colors = Object.values(DIMENSIONS).map((d) => d.color);
  const blades = Array.from({ length: 12 }, (_, i) => {
    const angle = ((i * 30 - 90) * Math.PI) / 180;
    return {
      x1: C + R1 * Math.cos(angle),
      y1: C + R1 * Math.sin(angle),
      x2: C + R2 * Math.cos(angle),
      y2: C + R2 * Math.sin(angle),
      color: colors[Math.floor(i / 3)],
    };
  });

  return (
    <div ref={ref} className="relative w-60 h-60 md:w-72 md:h-72 mx-auto">
      <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="aperture-core">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="55%" stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint outer ring */}
        <motion.circle
          cx={C}
          cy={C}
          r={106}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          initial={reduce ? false : { opacity: 0 }}
          animate={open ? { opacity: 1 } : {}}
          transition={{ duration: 1.2 }}
        />

        {/* Twelve gate blades — closed tight, twisting open like an iris */}
        {blades.map((b, i) => (
          <motion.g
            key={i}
            style={{ transformOrigin: '120px 120px', transformBox: 'view-box' }}
            initial={reduce ? false : { scale: 0.28, rotate: -75, opacity: 0 }}
            animate={open ? { scale: 1, rotate: 0, opacity: 1 } : {}}
            transition={{ delay: reduce ? 0 : 0.1 + i * 0.055, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* soft halo behind each blade */}
            <line
              x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
              stroke={b.color} strokeWidth={10} strokeLinecap="round" opacity={0.18}
            />
            <line
              x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
              stroke={b.color} strokeWidth={4.5} strokeLinecap="round" opacity={0.9}
            />
          </motion.g>
        ))}

        {/* Core light — what gets through */}
        <motion.circle
          cx={C}
          cy={C}
          r={40}
          fill="url(#aperture-core)"
          style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.35))' }}
          initial={reduce ? false : { opacity: 0 }}
          animate={open ? { opacity: 1 } : {}}
          transition={{ delay: reduce ? 0 : 0.9, duration: 1.4, ease: 'easeOut' }}
        />
        {/* Breathing halo (skipped under reduced motion) */}
        {open && !reduce && (
          <motion.circle
            cx={C}
            cy={C}
            fill="url(#aperture-core)"
            initial={{ r: 40, opacity: 0 }}
            animate={{ r: [40, 47, 40], opacity: [0.35, 0.6, 0.35] }}
            transition={{ delay: 1.6, duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </svg>
    </div>
  );
}

/** Compact version of the home page's closing doors — same words, same targets. */
function Door({ href, label, sub, color }: { href: string; label: string; sub: string; color: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-4 no-underline transition-transform duration-500 hover:-translate-y-1"
    >
      <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors duration-500">
        <div
          className="absolute -inset-6 rounded-full blur-2xl opacity-20 group-hover:opacity-50 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${color}, transparent 60%)` }}
        />
        <div
          className="relative w-11 h-11 md:w-12 md:h-12 rounded-full opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color}, rgba(0,0,0,0.5) 80%)`,
            boxShadow: `0 0 24px ${color}`,
          }}
        />
      </div>
      <div className="font-display italic text-lg md:text-xl text-white">{label}</div>
      <div className="text-[11px] tracking-[0.18em] uppercase text-white/45 group-hover:text-white inline-flex items-center gap-2 transition-colors duration-300 -mt-2">
        {sub}
        <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
      </div>
    </Link>
  );
}

/** Horizontal one-at-a-time scroll through the tools. Drag with mouse, swipe on touch. */
function ToolsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, startScroll: 0, moved: false });

  const nearestIndex = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return 0;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  }, []);

  const handleScroll = useCallback(() => {
    setActiveIndex(nearestIndex());
  }, [nearestIndex]);

  const scrollTo = (index: number) => {
    const clamped = Math.max(0, Math.min(TOOL_ROWS.length - 1, index));
    cardRefs.current[clamped]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  // Mouse drag-to-scroll. Touch keeps native scrolling.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setIsDragging(true);
    dragState.current = { startX: e.clientX, startScroll: scroller.scrollLeft, moved: false };
    scroller.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 4) dragState.current.moved = true;
    scroller.scrollLeft = dragState.current.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    scrollerRef.current?.releasePointerCapture(e.pointerId);
    if (dragState.current.moved) scrollTo(nearestIndex());
  };

  return (
    <div className="relative">
      {/* Scroller — snap disabled while dragging so the drag feels direct */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`flex gap-5 overflow-x-auto pb-4 select-none [&::-webkit-scrollbar]:hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory'
        }`}
        style={{
          scrollbarWidth: 'none',
          paddingLeft: 'max(1.5rem, calc(50% - 330px))',
          paddingRight: 'max(1.5rem, calc(50% - 330px))',
        }}
      >
        {TOOL_ROWS.map((row, i) => {
          const app = APPS[row.appId];
          if (!app) return null;
          const isActive = i === activeIndex;
          return (
            <div
              key={row.appId}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="snap-center flex-shrink-0 w-[85vw] max-w-[660px] transition-all duration-500"
              style={{
                opacity: isActive ? 1 : 0.35,
                transform: isActive ? 'scale(1)' : 'scale(0.96)',
              }}
            >
              <div
                className="relative h-full rounded-2xl border border-white/10 p-6 md:p-8"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))' }}
              >
                {row.badge && (
                  <span className="absolute top-5 right-5 px-2 py-0.5 bg-white/8 rounded text-[9px] text-gray-500 uppercase font-semibold tracking-wider">
                    {row.badge}
                  </span>
                )}
                <div className="flex flex-col md:flex-row gap-5 md:gap-7">
                  <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 pointer-events-none">
                    <Image src={app.icon} alt={app.name} fill className="object-contain" draggable={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-2xl text-white mb-0.5">{app.name}</h3>
                    <p className="text-sm text-gray-500 italic mb-3">{app.tagline}</p>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{app.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {row.keys.map((k) => (
                        <span
                          key={k.label}
                          className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                          style={{
                            color: k.color,
                            background: `${k.color}15`,
                            border: `1px solid ${k.color}30`,
                          }}
                        >
                          {k.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <button
        onClick={() => scrollTo(activeIndex - 1)}
        disabled={activeIndex === 0}
        className="hidden md:flex absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/15 bg-ground/70 backdrop-blur items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-colors disabled:opacity-20 disabled:cursor-default"
        aria-label="Previous tool"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => scrollTo(activeIndex + 1)}
        disabled={activeIndex === TOOL_ROWS.length - 1}
        className="hidden md:flex absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/15 bg-ground/70 backdrop-blur items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-colors disabled:opacity-20 disabled:cursor-default"
        aria-label="Next tool"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {TOOL_ROWS.map((row, i) => (
          <button
            key={row.appId}
            onClick={() => scrollTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 18 : 6,
              height: 6,
              background: i === activeIndex ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)',
            }}
            aria-label={`Go to tool ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function FrameworkPage() {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });

  const [selected, setSelected] = useState<Selection>(null);

  const handleKeyClick = (dimensionId: string, keyId: string) => {
    if (selected?.dimensionId === dimensionId && selected?.keyId === keyId) {
      setSelected(null);
    } else {
      setSelected({ dimensionId, keyId });
    }
  };

  const handleCardClick = (dimensionId: string) => {
    if (selected?.dimensionId === dimensionId) {
      // Any click on an open card closes it — whole card is the toggle.
      setSelected(null);
    } else {
      setSelected({ dimensionId, keyId: null });
    }
  };

  return (
    <PageLayout accentColor="#6330A0">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: AMETHYST }}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.p>

          <motion.h1
            className="font-display text-5xl md:text-6xl font-normal text-white mb-5 leading-[1.1]"
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Flow has conditions.{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textWide }}>
              Learn to see them.
            </span>
          </motion.h1>

          <motion.p
            className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            When flow won&apos;t come, something specific is in the way. Not a character
            flaw, a condition. FourFlow maps twelve of them across four dimensions of
            your life, so you can find yours and train it.
          </motion.p>

          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            This page walks the whole system: the name, the method, the map, the tools.
          </motion.p>
        </div>
      </section>

      {/* ── The Name ──────────────────────────────────────────────────────────── */}
      <NameBreakdownSection />

      {/* ── Why It Works ──────────────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading
            eyebrow="Why It Works"
            title="Four convictions, one method."
            subtitle="Everything on this site traces back to these."
          />

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-10">
            {convictions.map((c, i) => (
              <motion.div
                key={c.claim}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: 0.08 * i, duration: 0.6 }}
                className="border-t border-white/10 pt-6"
              >
                <h3 className="font-display text-xl md:text-2xl italic text-white mb-3 leading-snug">
                  {c.claim}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{c.support}</p>
              </motion.div>
            ))}
          </div>

          {/* The aperture — twelve gates opening, light getting through */}
          <div className="mt-16 md:mt-24 text-center">
            <ApertureVisual />
            <motion.p
              className="font-display text-lg md:text-xl text-gray-300 italic mt-8"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Keys open gates. Open gates widen the aperture. Full aperture is flow.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Framework Grid ────────────────────────────────────────────────────── */}
      <section ref={gridRef} className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">

          <SectionHeading
            eyebrow="The Framework"
            title="Four dimensions. Twelve keys."
            subtitle="Tap a dimension to see its role. Tap a key to see what it opens."
          />

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {Object.values(DIMENSIONS).map((dimension, index) => {
              const details = dimensionDetails[dimension.id as keyof typeof dimensionDetails];
              const isThisDimensionActive = selected?.dimensionId === dimension.id;
              const isDimensionView = isThisDimensionActive && selected?.keyId === null;
              const selectedKeyData = isThisDimensionActive && selected?.keyId
                ? dimension.keys.find(k => k.id === selected.keyId)
                : undefined;
              const selectedKeyIndex = selectedKeyData
                ? dimension.keys.findIndex(k => k.id === selectedKeyData.id)
                : 0;
              const radialOrigin = isDimensionView
                ? DIMENSION_ORIGIN
                : (KEY_ORIGINS[selectedKeyIndex] ?? '50% 75%');

              return (
                <motion.div
                  key={dimension.id}
                  className="relative"
                  initial={{ opacity: 0, y: 40 }}
                  animate={gridInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
                >
                  <motion.div
                    className="group relative rounded-3xl overflow-hidden border cursor-pointer"
                    onClick={() => handleCardClick(dimension.id)}
                    style={{
                      background: `radial-gradient(120% 100% at 0% 0%, ${dimension.color}14, transparent 55%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                      borderColor: isThisDimensionActive ? `${dimension.color}50` : 'rgba(255,255,255,0.1)',
                      boxShadow: '0 0 0 rgba(0,0,0,0)',
                    }}
                    whileHover={{
                      y: -4,
                      borderColor: `${dimension.color}66`,
                      boxShadow: `0 24px 60px -28px ${dimension.color}66`,
                    }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Left spine — three gate ticks */}
                    <div
                      className="absolute top-0 left-0 bottom-0 w-4 z-10 flex flex-col items-center justify-evenly py-8"
                      style={{
                        background: `${dimension.color}0D`,
                        borderRight: `1px solid ${dimension.color}20`,
                      }}
                    >
                      {dimension.keys.map((key) => {
                        const isKeyActive = selected?.keyId === key.id && isThisDimensionActive;
                        const isLit = isKeyActive || isDimensionView;
                        return (
                          <div
                            key={key.id}
                            className="rounded-full transition-all duration-500"
                            style={{
                              width: 3,
                              height: isLit ? 22 : 10,
                              background: isLit ? dimension.color : `${dimension.color}40`,
                              boxShadow: isLit ? `0 0 10px 2px ${dimension.color}70` : 'none',
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* ── Front layer: dimension header + compact key buttons (drives card height) ── */}
                    <motion.div
                      className="relative p-6 md:p-8 pt-7 md:pt-9 pl-8 md:pl-10"
                      animate={{
                        opacity: isThisDimensionActive ? 0 : 1,
                        pointerEvents: isThisDimensionActive ? 'none' : 'auto',
                      }}
                      transition={{ duration: 0.3, delay: isThisDimensionActive ? 0 : 0.3 }}
                    >
                      {/* Dimension header — whole card opens the dimension view */}
                      <div className="mb-6">
                        <div className="flex items-start gap-4 md:gap-5">
                          <div
                            className="relative w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-2xl flex-shrink-0"
                            style={{ background: `${dimension.color}15` }}
                          >
                            <div
                              className="absolute -inset-3 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"
                              style={{ background: `radial-gradient(circle, ${dimension.color}55, transparent 70%)` }}
                            />
                            <Image
                              src={dimension.sectionLogo}
                              alt={dimension.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span
                              className="text-xs font-bold uppercase tracking-wider"
                              style={{ color: dimension.color }}
                            >
                              {details.descriptor}
                            </span>
                            <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5 group-hover:translate-x-1 transition-transform">
                              {dimension.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 italic">
                              &ldquo;{details.question}&rdquo;
                            </p>
                          </div>

                          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Compact key selector buttons */}
                      <div className="grid grid-cols-3 gap-3">
                        {dimension.keys.map((key) => (
                          <button
                            key={key.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleKeyClick(dimension.id, key.id);
                            }}
                            className="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 hover:scale-[1.03] text-center"
                            style={{
                              borderColor: `${dimension.color}20`,
                              background: `${dimension.color}08`,
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.borderColor = `${dimension.color}50`;
                              (e.currentTarget as HTMLElement).style.background = `${dimension.color}15`;
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.borderColor = `${dimension.color}20`;
                              (e.currentTarget as HTMLElement).style.background = `${dimension.color}08`;
                            }}
                          >
                            <div
                              className="relative w-10 h-10 rounded-lg flex-shrink-0"
                              style={{ background: `${dimension.color}20` }}
                            >
                              <Image
                                src={key.icon}
                                alt={key.name}
                                fill
                                className="object-contain p-1.5"
                              />
                            </div>
                            <span className="text-[11px] text-gray-300 leading-tight font-medium">
                              {key.name}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Dimension tagline — fills vertical rhythm, gives back layer room */}
                      <p className="text-xs text-gray-600 mt-4 pb-2 leading-relaxed">
                        {details.tagline}
                      </p>
                    </motion.div>

                    {/* ── Radial ink sweep overlay ── */}
                    <motion.div
                      className="absolute inset-0"
                      initial={false}
                      animate={{
                        clipPath: isThisDimensionActive
                          ? `circle(150% at ${radialOrigin})`
                          : `circle(0% at ${radialOrigin})`,
                      }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        background: `linear-gradient(135deg, ${dimension.color}25, ${dimension.color}15)`,
                      }}
                    />

                    {/* ── Back layer: dimension or key detail + switcher tabs ── */}
                    <motion.div
                      className="absolute inset-0 pt-7 md:pt-9 pr-6 md:pr-8 pb-6 md:pb-8 pl-8 md:pl-10 flex flex-col overflow-hidden"
                      initial={false}
                      animate={{
                        opacity: isThisDimensionActive ? 1 : 0,
                        pointerEvents: isThisDimensionActive ? 'auto' : 'none',
                      }}
                      transition={{ duration: 0.3, delay: isThisDimensionActive ? 0.3 : 0 }}
                    >
                      {/* Dimension glyph watermark */}
                      <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.06] pointer-events-none">
                        <Image src={dimension.sectionLogo} alt="" fill className="object-contain" />
                      </div>

                      {/* Detail — flex-1, clips gracefully if content is long */}
                      <div className="flex-1 overflow-hidden">
                        {isDimensionView && (
                          <div className="space-y-2.5">
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                                The Orientation
                              </p>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {details.orientation}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                                The Question
                              </p>
                              <p className="text-xs text-gray-300 leading-relaxed italic">
                                &ldquo;{details.question}&rdquo;
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                                Without This
                              </p>
                              <p className="text-xs text-gray-400 leading-relaxed italic">
                                {details.withoutThis}
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedKeyData && (
                          <div className="space-y-2.5">
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                                The Insight
                              </p>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {selectedKeyData.coreInsight}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                                Flow Connection
                              </p>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {selectedKeyData.flowConnection}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                                Without This
                              </p>
                              <p className="text-xs text-gray-400 leading-relaxed italic">
                                {selectedKeyData.withoutThis}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Switcher — dimension tab + key tabs, pinned to bottom */}
                      <div className="flex-shrink-0 mt-3">
                        <div className="flex gap-1.5 pt-2.5 border-t border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected({ dimensionId: dimension.id, keyId: null });
                            }}
                            className="flex-1 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all duration-200 leading-tight"
                            style={{
                              background: isDimensionView ? `${dimension.color}20` : 'rgba(255,255,255,0.03)',
                              color: isDimensionView ? dimension.color : '#6b7280',
                              border: `1px solid ${isDimensionView ? `${dimension.color}40` : 'rgba(255,255,255,0.07)'}`,
                            }}
                          >
                            {dimension.name}
                          </button>
                          {dimension.keys.map((key) => {
                            const isActive = selected?.keyId === key.id;
                            return (
                              <button
                                key={key.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelected({ dimensionId: dimension.id, keyId: key.id });
                                }}
                                className="flex-1 py-1 rounded-lg text-[10px] font-medium transition-all duration-200 leading-tight"
                                style={{
                                  background: isActive ? `${dimension.color}20` : 'rgba(255,255,255,0.03)',
                                  color: isActive ? dimension.color : '#6b7280',
                                  border: `1px solid ${isActive ? `${dimension.color}40` : 'rgba(255,255,255,0.07)'}`,
                                }}
                              >
                                {key.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>

                  </motion.div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── The Alignment ─────────────────────────────────────────────────────── */}
      <SynergyConstellation />

      {/* ── The Tools ─────────────────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <SectionHeading
          eyebrow="The Tools"
          title="The lens finds the block. The tools train it."
          subtitle="Flow is trainable. Each tool works one key — free, inside your practice."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <ToolsCarousel />
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link
            href="/me"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors group"
          >
            Start your practice
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </section>

      {/* ── Closing: two doors, same words as home ────────────────────────────── */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading eyebrow="From Here" title="Two doors." />

          <motion.div
            className="flex flex-wrap justify-center items-start gap-10 md:gap-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Door href="/me" label="Start your practice" sub="on your own" color={STEEL} />
            <Door href="/together" label="Work together" sub="with a guide" color={SAGE} />
          </motion.div>
        </div>
      </section>

    </PageLayout>
  );
}
