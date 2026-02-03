'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

// BREATHING PULSE - Core insight animation
function BreathingPulse() {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <style jsx>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }
        @keyframes pulse-core {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .ring-1 { animation: pulse-ring 3s ease-in-out infinite; }
        .ring-2 { animation: pulse-ring 3s ease-in-out infinite 0.3s; }
        .ring-3 { animation: pulse-ring 3s ease-in-out infinite 0.6s; }
        .core { animation: pulse-core 3s ease-in-out infinite; }
      `}</style>

      {/* Outer rings */}
      <div className="ring-3 absolute w-44 h-44 rounded-full border border-[#FF6F61]/10" />
      <div className="ring-2 absolute w-32 h-32 rounded-full border border-[#FF6F61]/20" />
      <div className="ring-1 absolute w-20 h-20 rounded-full border border-[#FF6F61]/30" />

      {/* Core */}
      <div
        className="core relative w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle, #FF6F61 0%, #FF6F6180 50%, transparent 80%)',
          boxShadow: '0 0 40px #FF6F6180',
        }}
      />
    </div>
  );
}

// FOURFLOW EMBLEM - Four shapes coming together
function EmblemAnimation() {
  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <style jsx>{`
        @keyframes float-in-tl {
          0%, 100% { transform: translate(-30px, -30px) scale(0.9); opacity: 0.6; }
          50% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes float-in-tr {
          0%, 100% { transform: translate(30px, -30px) scale(0.9); opacity: 0.6; }
          50% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes float-in-bl {
          0%, 100% { transform: translate(-30px, 30px) scale(0.9); opacity: 0.6; }
          50% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes float-in-br {
          0%, 100% { transform: translate(30px, 30px) scale(0.9); opacity: 0.6; }
          50% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes center-glow {
          0%, 100% { transform: scale(0.8); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        .shape-tl { animation: float-in-tl 5s ease-in-out infinite; }
        .shape-tr { animation: float-in-tr 5s ease-in-out infinite; }
        .shape-bl { animation: float-in-bl 5s ease-in-out infinite; }
        .shape-br { animation: float-in-br 5s ease-in-out infinite; }
        .center-glow { animation: center-glow 5s ease-in-out infinite; }
      `}</style>

      {/* Four shapes in quadrants */}
      <div className="shape-br absolute w-16 h-16 translate-x-8 translate-y-8" style={{ zIndex: 1 }}>
        <Image
          src="/assets/LOGOS/MAIN LOGO - ELEMENTS/SPIRIT - Circle.png"
          alt="Spirit"
          fill
          className="object-contain"
        />
        <div className="absolute inset-0 rounded-full blur-xl bg-[#7A4DA4]/30" style={{ zIndex: -1 }} />
      </div>

      <div className="shape-tr absolute w-16 h-16 translate-x-8 -translate-y-8" style={{ zIndex: 2 }}>
        <Image
          src="/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png"
          alt="Space"
          fill
          className="object-contain"
        />
        <div className="absolute inset-0 rounded-full blur-xl bg-[#6BA292]/30" style={{ zIndex: -1 }} />
      </div>

      <div className="shape-bl absolute w-16 h-16 -translate-x-8 translate-y-8" style={{ zIndex: 3 }}>
        <Image
          src="/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png"
          alt="Story"
          fill
          className="object-contain"
        />
        <div className="absolute inset-0 rounded-full blur-xl bg-[#5B84B1]/30" style={{ zIndex: -1 }} />
      </div>

      <div className="shape-tl absolute w-16 h-16 -translate-x-8 -translate-y-8" style={{ zIndex: 4 }}>
        <Image
          src="/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png"
          alt="Self"
          fill
          className="object-contain"
        />
        <div className="absolute inset-0 rounded-full blur-xl bg-[#FF6F61]/30" style={{ zIndex: -1 }} />
      </div>

      {/* Center glow when aligned */}
      <div
        className="center-glow absolute w-24 h-24 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

// CIRCULAR FREQUENCY ANIMATION - Frequency ring with outer arrows
type AnimationPhase = 'scramble' | 'spirit' | 'story' | 'space' | 'self' | 'aligned';

const DIMENSIONS = [
  { id: 'spirit', name: 'SPIRIT', color: '#7A4DA4' },
  { id: 'story', name: 'STORY', color: '#5B84B1' },
  { id: 'space', name: 'SPACE', color: '#6BA292' },
  { id: 'self', name: 'SELF', color: '#FF6F61' },
];

// Clockwise relationships: Spirit → Story → Space → Self → Spirit
const RELATIONSHIPS = [
  { from: 'spirit', to: 'story', word: 'INSPIRES' },
  { from: 'story', to: 'space', word: 'GUIDES' },
  { from: 'space', to: 'self', word: 'SUPPORTS' },
  { from: 'self', to: 'spirit', word: 'HONORS' },
];

function CircularFrequencyAnimation({ inView }: { inView: boolean }) {
  const [phase, setPhase] = useState<AnimationPhase>('scramble');
  const [tick, setTick] = useState(0);

  // Animation cycle
  useEffect(() => {
    if (!inView) return;

    const cycle = () => {
      setPhase('scramble');
      setTimeout(() => setPhase('spirit'), 1200);
      setTimeout(() => setPhase('story'), 2400);
      setTimeout(() => setPhase('space'), 3600);
      setTimeout(() => setPhase('self'), 4800);
      setTimeout(() => setPhase('aligned'), 6000);
    };

    cycle();
    const interval = setInterval(cycle, 9000);
    return () => clearInterval(interval);
  }, [inView]);

  // Tick for frequency animation
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 150);
    return () => clearInterval(interval);
  }, []);

  const ORDER = ['spirit', 'story', 'space', 'self'];

  const isDimensionTuned = (dimId: string) => {
    if (phase === 'scramble') return false;
    if (phase === 'aligned') return true;
    const currentIdx = ORDER.indexOf(phase);
    const dimIdx = ORDER.indexOf(dimId);
    return dimIdx <= currentIdx;
  };

  const isArrowActive = (rel: { from: string; to: string }) => {
    if (phase === 'scramble') return false;
    if (phase === 'aligned') return true;
    const currentIdx = ORDER.indexOf(phase);
    const fromIdx = ORDER.indexOf(rel.from);
    const toIdx = ORDER.indexOf(rel.to);
    return fromIdx < currentIdx && toIdx <= currentIdx;
  };

  const tunedCount = DIMENSIONS.filter(d => isDimensionTuned(d.id)).length;
  const centerBrightness = tunedCount / 4;

  // Layout constants
  const size = 400;
  const center = size / 2;
  const radius = 110;
  const barCount = 72;

  // Frequency bar height
  const getBarHeight = (index: number, dimId: string) => {
    const isTuned = isDimensionTuned(dimId);
    if (isTuned) {
      const wave = Math.sin((index * 0.4) - (tick * 0.15));
      return 8 + wave * 4;
    } else {
      const chaos = Math.sin(index * 2.7 + tick * 0.8) * Math.cos(index * 1.3 - tick * 0.5);
      return 5 + Math.abs(chaos) * 8;
    }
  };

  // Get dimension color by angle
  const getBarColor = (angle: number) => {
    const a = ((angle % 360) + 360) % 360;
    if (a >= 315 || a < 45) return { color: '#7A4DA4', id: 'spirit' };
    if (a >= 45 && a < 135) return { color: '#5B84B1', id: 'story' };
    if (a >= 135 && a < 225) return { color: '#6BA292', id: 'space' };
    return { color: '#FF6F61', id: 'self' };
  };

  // Arrow path with outward curve
  const getArrowPath = (fromId: string, toId: string) => {
    const arrowRadius = radius + 20;
    const positions: Record<string, { x: number; y: number }> = {
      spirit: { x: center, y: center - arrowRadius },
      story: { x: center + arrowRadius, y: center },
      space: { x: center, y: center + arrowRadius },
      self: { x: center - arrowRadius, y: center },
    };
    const from = positions[fromId];
    const to = positions[toId];
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const outX = midX - center;
    const outY = midY - center;
    const outLen = Math.sqrt(outX * outX + outY * outY);
    const ctrlX = midX + (outX / outLen) * 35;
    const ctrlY = midY + (outY / outLen) * 35;
    return `M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${to.x} ${to.y}`;
  };

  // Word position along arrow curve
  const getWordPosition = (fromId: string, toId: string) => {
    const arrowRadius = radius + 20;
    const positions: Record<string, { x: number; y: number }> = {
      spirit: { x: center, y: center - arrowRadius },
      story: { x: center + arrowRadius, y: center },
      space: { x: center, y: center + arrowRadius },
      self: { x: center - arrowRadius, y: center },
    };
    const from = positions[fromId];
    const to = positions[toId];
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const outX = midX - center;
    const outY = midY - center;
    const outLen = Math.sqrt(outX * outX + outY * outY);
    return { x: midX + (outX / outLen) * 55, y: midY + (outY / outLen) * 55 };
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={`rgba(255,255,255,${0.1 + centerBrightness * 0.6})`} />
              <stop offset="30%" stopColor={`rgba(200,180,220,${0.05 + centerBrightness * 0.3})`} />
              <stop offset="60%" stopColor={`rgba(122,77,164,${0.02 + centerBrightness * 0.15})`} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.8)" />
            </marker>
          </defs>

          {/* Center glow */}
          <circle cx={center} cy={center} r={radius - 20} fill="url(#centerGlow)" className="transition-all duration-700" />

          {/* Frequency bars */}
          {[...Array(barCount)].map((_, i) => {
            const angle = (i / barCount) * 360;
            const angleRad = (angle - 90) * (Math.PI / 180);
            const { color, id: dimId } = getBarColor(angle);
            const isTuned = isDimensionTuned(dimId);
            const barHeight = getBarHeight(i, dimId);
            const x1 = center + Math.cos(angleRad) * (radius - barHeight);
            const y1 = center + Math.sin(angleRad) * (radius - barHeight);
            const x2 = center + Math.cos(angleRad) * (radius + barHeight);
            const y2 = center + Math.sin(angleRad) * (radius + barHeight);

            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isTuned ? color : `${color}40`}
                strokeWidth={2}
                strokeLinecap="round"
                className="transition-all duration-500"
                style={{ filter: isTuned ? `drop-shadow(0 0 4px ${color})` : 'none' }}
              />
            );
          })}

          {/* Arrows */}
          {RELATIONSHIPS.map((rel) => {
            const isActive = isArrowActive(rel);
            const path = getArrowPath(rel.from, rel.to);
            const wordPos = getWordPosition(rel.from, rel.to);

            return (
              <g key={`${rel.from}-${rel.to}`} className="transition-all duration-500">
                <path
                  d={path}
                  fill="none"
                  stroke={isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isActive ? 2.5 : 1}
                  markerEnd={isActive ? 'url(#arrowhead)' : undefined}
                  className="transition-all duration-500"
                />
                {isActive && (
                  <text
                    x={wordPos.x}
                    y={wordPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[10px] font-bold uppercase tracking-wider fill-white/80"
                  >
                    {rel.word}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Dimension labels */}
        {DIMENSIONS.map((dim) => {
          const isTuned = isDimensionTuned(dim.id);
          const labelRadius = radius + 75;
          const positions: Record<string, { x: number; y: number }> = {
            spirit: { x: center, y: center - labelRadius },
            story: { x: center + labelRadius, y: center },
            space: { x: center, y: center + labelRadius },
            self: { x: center - labelRadius, y: center },
          };
          const pos = positions[dim.id];

          return (
            <div
              key={dim.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{
                left: pos.x,
                top: pos.y,
                color: isTuned ? dim.color : `${dim.color}50`,
                textShadow: isTuned ? `0 0 20px ${dim.color}80` : 'none',
              }}
            >
              <span className="text-sm md:text-base font-bold uppercase tracking-widest">
                {dim.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SignalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (isInView) setHasEntered(true);
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-[#030303] overflow-hidden"
    >
      {/* Subtle background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(122,77,164,0.15) 0%, transparent 60%)',
        }}
      />

      <motion.div
        className="relative max-w-4xl mx-auto px-6 z-10"
        initial={{ opacity: 0 }}
        animate={hasEntered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
            When Alignment Happens
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] to-[#7A4DA4] bg-clip-text text-transparent">
              Flow
            </span>{' '}
            Is the Signal
          </h2>
        </motion.div>

        {/* Block 1: The Core Insight */}
        <motion.div
          className="mb-28"
          initial={{ opacity: 0, y: 40 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <BreathingPulse />
          <p className="text-2xl md:text-3xl text-white font-light text-center mt-8 max-w-2xl mx-auto">
            Most people chase flow as a goal. But flow is a{' '}
            <span className="italic">compass needle</span> — it points toward alignment. The state itself is proof that what you&apos;re doing, where you&apos;re doing it, why, and how you&apos;re showing up have all converged.
          </p>
        </motion.div>

        {/* Block 2: Circular Frequency Animation */}
        <motion.div
          className="mb-28"
          initial={{ opacity: 0, y: 40 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-lg text-gray-500 text-center mb-12">
            Each dimension feeds the next — a continuous cycle of alignment.
          </p>
          <CircularFrequencyAnimation inView={hasEntered} />
        </motion.div>

        {/* Block 3: The Emblem */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <EmblemAnimation />
          <div className="text-center mt-8 space-y-3">
            <p className="text-xl md:text-2xl text-white">
              Flow is the proof that you&apos;ve found the intersection.
            </p>
            <p className="text-base text-gray-500 max-w-lg mx-auto">
              Where what you do, where you do it, why you do it, and who you are all converge.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
