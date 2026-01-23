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

// CIRCULAR FREQUENCY ANIMATION - Four arcs with center text
type TuningPhase = 'scramble' | 'spirit' | 'story' | 'space' | 'self' | 'aligned';

function CircularFrequencyAnimation({ inView }: { inView: boolean }) {
  const [phase, setPhase] = useState<TuningPhase>('scramble');

  useEffect(() => {
    if (!inView) return;

    const cycle = () => {
      setPhase('scramble');
      setTimeout(() => setPhase('spirit'), 1500);
      setTimeout(() => setPhase('story'), 3000);
      setTimeout(() => setPhase('space'), 4500);
      setTimeout(() => setPhase('self'), 6000);
      setTimeout(() => setPhase('aligned'), 7500);
    };

    cycle();
    const interval = setInterval(cycle, 10000);
    return () => clearInterval(interval);
  }, [inView]);

  const phaseOrder: TuningPhase[] = ['scramble', 'spirit', 'story', 'space', 'self', 'aligned'];

  const isFrequencyTuned = (tuneAt: TuningPhase) => {
    const currentIndex = phaseOrder.indexOf(phase);
    const tuneIndex = phaseOrder.indexOf(tuneAt);
    return currentIndex >= tuneIndex;
  };

  // Dimensions with their positions (clockwise from top: Spirit, Story, Space, Self)
  const dimensions = [
    { name: 'SPIRIT', tuneAt: 'spirit' as TuningPhase, color: '#7A4DA4', position: 'top', angle: -90 },
    { name: 'STORY', tuneAt: 'story' as TuningPhase, color: '#5B84B1', position: 'right', angle: 0 },
    { name: 'SPACE', tuneAt: 'space' as TuningPhase, color: '#6BA292', position: 'bottom', angle: 90 },
    { name: 'SELF', tuneAt: 'self' as TuningPhase, color: '#FF6F61', position: 'left', angle: 180 },
  ];

  // Relationships (clockwise flow)
  const relationships = [
    { from: 'SPIRIT', to: 'STORY', verb: 'inspires', showAt: 'story' as TuningPhase },
    { from: 'STORY', to: 'SPACE', verb: 'guides', showAt: 'space' as TuningPhase },
    { from: 'SPACE', to: 'SELF', verb: 'supports', showAt: 'self' as TuningPhase },
    { from: 'SELF', to: 'SPIRIT', verb: 'honors', showAt: 'aligned' as TuningPhase },
  ];

  // Get current relationship text
  const getCurrentRelationship = () => {
    if (phase === 'scramble') return null;
    if (phase === 'spirit') return { text: 'SPIRIT', subtext: null };

    const rel = relationships.find(r => r.showAt === phase);
    if (rel) {
      return {
        text: `${rel.from} ${rel.verb} ${rel.to}`,
        subtext: phase === 'aligned' ? 'The cycle continues' : null,
      };
    }
    return null;
  };

  const currentRel = getCurrentRelationship();

  // Generate frequency bars for an arc
  const generateBars = (isTuned: boolean, scrambleOffset: number) => {
    const barCount = 12;
    return [...Array(barCount)].map((_, i) => {
      const scrambleHeight = ((i * 7 + scrambleOffset) % 9) + 1;
      const alignedHeight = 5 + Math.sin(i * 0.5) * 4;
      return isTuned ? alignedHeight : scrambleHeight;
    });
  };

  const circleSize = 320;
  const arcRadius = circleSize / 2 - 30;

  return (
    <div className="relative w-full flex items-center justify-center">
      <div
        className="relative"
        style={{ width: circleSize, height: circleSize }}
      >
        {/* Outer circle guide */}
        <div
          className="absolute inset-0 rounded-full border border-white/5"
        />

        {/* Four frequency arcs */}
        {dimensions.map((dim, idx) => {
          const isTuned = isFrequencyTuned(dim.tuneAt);
          const bars = generateBars(isTuned, idx * 3);

          // Position calculations for each arc
          const positions: Record<string, { x: number; y: number; rotation: number }> = {
            top: { x: circleSize / 2, y: 25, rotation: 0 },
            right: { x: circleSize - 25, y: circleSize / 2, rotation: 90 },
            bottom: { x: circleSize / 2, y: circleSize - 25, rotation: 180 },
            left: { x: 25, y: circleSize / 2, rotation: 270 },
          };

          const pos = positions[dim.position];

          return (
            <div
              key={dim.name}
              className="absolute"
              style={{
                left: pos.x,
                top: pos.y,
                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
              }}
            >
              {/* Dimension label */}
              <span
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-wider transition-all duration-500 whitespace-nowrap"
                style={{
                  color: isTuned ? dim.color : `${dim.color}40`,
                  transform: `translateX(-50%) rotate(-${pos.rotation}deg)`,
                  textShadow: isTuned ? `0 0 15px ${dim.color}60` : 'none',
                }}
              >
                {dim.name}
              </span>

              {/* Frequency bars */}
              <div className="flex items-end justify-center gap-[3px] h-10">
                {bars.map((height, j) => (
                  <div
                    key={j}
                    className="w-1 rounded-full transition-all"
                    style={{
                      backgroundColor: isTuned ? dim.color : `${dim.color}30`,
                      height: `${height * 3 + 4}px`,
                      transitionDuration: isTuned ? '500ms' : '100ms',
                      transitionDelay: isTuned ? `${j * 30}ms` : '0ms',
                      boxShadow: isTuned ? `0 0 6px ${dim.color}` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Connection arrows between dimensions */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${circleSize} ${circleSize}`}
        >
          {/* Clockwise arrows */}
          {[
            { from: 'spirit', to: 'story', path: `M ${circleSize/2 + 40} 40 Q ${circleSize - 60} 60 ${circleSize - 40} ${circleSize/2 - 40}` },
            { from: 'story', to: 'space', path: `M ${circleSize - 40} ${circleSize/2 + 40} Q ${circleSize - 60} ${circleSize - 60} ${circleSize/2 + 40} ${circleSize - 40}` },
            { from: 'space', to: 'self', path: `M ${circleSize/2 - 40} ${circleSize - 40} Q 60 ${circleSize - 60} 40 ${circleSize/2 + 40}` },
            { from: 'self', to: 'spirit', path: `M 40 ${circleSize/2 - 40} Q 60 60 ${circleSize/2 - 40} 40` },
          ].map((arrow, i) => {
            const fromTuned = isFrequencyTuned(arrow.from as TuningPhase);
            const toTuned = isFrequencyTuned(arrow.to as TuningPhase);
            const isActive = fromTuned && toTuned;

            return (
              <path
                key={i}
                d={arrow.path}
                fill="none"
                stroke={isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)'}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
        >
          {currentRel ? (
            <>
              <p
                className="text-lg md:text-xl font-medium transition-all duration-500"
                style={{
                  color: phase === 'spirit' ? '#7A4DA4' : 'white',
                  textShadow: '0 0 30px rgba(0,0,0,0.5)',
                }}
              >
                {currentRel.text}
              </p>
              {currentRel.subtext && (
                <p className="text-xs text-white/50 mt-2 uppercase tracking-widest">
                  {currentRel.subtext}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-white/30 uppercase tracking-widest">
              Tuning...
            </p>
          )}
        </div>

        {/* Center glow on aligned */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700"
          style={{ opacity: phase === 'aligned' ? 1 : 0 }}
        >
          <div
            className="w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            }}
          />
        </div>
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
            The Signal
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Your{' '}
            <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] to-[#7A4DA4] bg-clip-text text-transparent">
              Biological Compass
            </span>
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
            That feeling when everything clicks? That&apos;s flow — your body signaling you&apos;ve found the{' '}
            <span className="italic">sweet spot</span> between{' '}
            <span className="text-[#FF6F61]">SELF</span>,{' '}
            <span className="text-[#6BA292]">SPACE</span>,{' '}
            <span className="text-[#5B84B1]">STORY</span>, and{' '}
            <span className="text-[#7A4DA4]">SPIRIT</span>.
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
            Like tuning into a frequency — each dimension locks in, one by one.
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
