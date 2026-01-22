'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

// 1. THE SPLIT - Two orbs drifting apart (CSS keyframes for reliability)
function SplitAnimation() {
  return (
    <div className="relative w-full h-56 flex items-center justify-center">
      <style jsx>{`
        @keyframes drift-left {
          0%, 100% { transform: translateX(0); opacity: 0.7; }
          50% { transform: translateX(-60px); opacity: 1; }
        }
        @keyframes drift-right {
          0%, 100% { transform: translateX(0); opacity: 0.7; }
          50% { transform: translateX(60px); opacity: 1; }
        }
        @keyframes fade-line {
          0%, 100% { opacity: 0.4; transform: scaleX(1); }
          50% { opacity: 0.1; transform: scaleX(1.3); }
        }
        .orb-left {
          animation: drift-left 4s ease-in-out infinite;
        }
        .orb-right {
          animation: drift-right 4s ease-in-out infinite;
        }
        .connection-line {
          animation: fade-line 4s ease-in-out infinite;
        }
      `}</style>

      {/* Left orb - Productivity */}
      <div
        className="orb-left absolute w-24 h-24 rounded-full"
        style={{
          background: 'radial-gradient(circle, #5B84B1 0%, #5B84B150 40%, transparent 70%)',
          boxShadow: '0 0 60px #5B84B160',
        }}
      />

      {/* Right orb - Fulfillment */}
      <div
        className="orb-right absolute w-24 h-24 rounded-full"
        style={{
          background: 'radial-gradient(circle, #FF6F61 0%, #FF6F6150 40%, transparent 70%)',
          boxShadow: '0 0 60px #FF6F6160',
        }}
      />

      {/* Fading connection line */}
      <div
        className="connection-line absolute h-[2px] w-40"
        style={{
          background: 'linear-gradient(90deg, #5B84B1, transparent 40%, transparent 60%, #FF6F61)',
        }}
      />

      {/* Labels */}
      <span className="absolute left-1/4 -translate-x-full bottom-4 text-xs text-[#5B84B1]/70 uppercase tracking-wider font-medium">
        Productivity
      </span>
      <span className="absolute right-1/4 translate-x-full bottom-4 text-xs text-[#FF6F61]/70 uppercase tracking-wider font-medium">
        Fulfillment
      </span>
    </div>
  );
}

// 2. THE BODY KNOWS - Breathing pulse (CSS keyframes)
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

// 4. FOURFLOW EMBLEM - Four shapes coming together
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

      {/* Four shapes in quadrants - z-order: Frequencies(top) > Cross > Square > Circle(bottom) */}
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

// 5. FOUR FREQUENCIES - Scrambled to aligned with saturation change
function FrequencyAnimation({ inView }: { inView: boolean }) {
  const [phase, setPhase] = useState<'scramble' | 'tuning' | 'aligned'>('scramble');

  useEffect(() => {
    if (!inView) return;

    const cycle = () => {
      setPhase('scramble');
      setTimeout(() => setPhase('tuning'), 2000);
      setTimeout(() => setPhase('aligned'), 4000);
    };

    cycle();
    const interval = setInterval(cycle, 6000);
    return () => clearInterval(interval);
  }, [inView]);

  const colors = [
    { name: 'Self', base: '#FF6F61', dim: '#FF6F6140' },
    { name: 'Space', base: '#6BA292', dim: '#6BA29240' },
    { name: 'Story', base: '#5B84B1', dim: '#5B84B140' },
    { name: 'Spirit', base: '#7A4DA4', dim: '#7A4DA440' },
  ];

  // Different random patterns for scramble phase
  const scramblePatterns = [
    [3, 8, 2, 6, 9, 4, 7, 1, 5, 8, 3, 6, 2, 9, 4, 7, 5, 8, 3, 6],
    [7, 2, 9, 4, 6, 1, 8, 5, 3, 7, 9, 2, 6, 4, 8, 1, 5, 9, 3, 7],
    [5, 9, 3, 7, 2, 8, 4, 6, 1, 5, 3, 9, 7, 2, 8, 6, 4, 1, 5, 3],
    [2, 6, 8, 1, 5, 9, 3, 7, 4, 2, 8, 6, 1, 5, 9, 7, 3, 4, 2, 8],
  ];

  // Aligned pattern (sine wave)
  const alignedPattern = [...Array(20)].map((_, i) =>
    5 + Math.sin(i * 0.4) * 4
  );

  return (
    <div className="relative w-full max-w-2xl mx-auto space-y-6">
      {/* Phase indicator */}
      <div className="flex justify-center gap-4 mb-8">
        {['scramble', 'tuning', 'aligned'].map((p) => (
          <div
            key={p}
            className={`text-xs uppercase tracking-wider transition-all duration-500 ${
              phase === p ? 'text-white' : 'text-gray-600'
            }`}
          >
            {p === 'scramble' ? 'Interference' : p === 'tuning' ? 'Tuning...' : 'Aligned'}
          </div>
        ))}
      </div>

      {colors.map((color, i) => {
        const pattern = phase === 'aligned'
          ? alignedPattern
          : phase === 'tuning'
            ? alignedPattern.map((v, j) => v + (scramblePatterns[i][j] - 5) * (1 - (j / 20)))
            : scramblePatterns[i];

        const currentColor = phase === 'aligned' ? color.base : color.dim;
        const glowIntensity = phase === 'aligned' ? '40' : '10';

        return (
          <div key={i} className="flex items-center gap-4">
            <span
              className="text-xs font-semibold uppercase tracking-wider w-14 text-right transition-all duration-700"
              style={{
                color: phase === 'aligned' ? color.base : `${color.base}60`,
              }}
            >
              {color.name}
            </span>

            <div
              className="flex-1 h-14 relative overflow-hidden rounded-lg transition-all duration-700"
              style={{
                background: phase === 'aligned'
                  ? `linear-gradient(90deg, ${color.base}10, ${color.base}05)`
                  : 'rgba(255,255,255,0.02)',
                boxShadow: phase === 'aligned' ? `0 0 30px ${color.base}${glowIntensity}` : 'none',
              }}
            >
              {/* Bars */}
              <div className="absolute inset-0 flex items-center justify-around px-3">
                {pattern.map((height, j) => (
                  <div
                    key={j}
                    className="w-1.5 rounded-full transition-all"
                    style={{
                      backgroundColor: currentColor,
                      height: `${height * 4 + 8}px`,
                      transitionDuration: phase === 'scramble' ? '200ms' : '700ms',
                      transitionDelay: `${j * 20}ms`,
                      boxShadow: phase === 'aligned' ? `0 0 8px ${color.base}` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 6. ALIGNMENT - Four dots converging (CSS keyframes)
function AlignmentAnimation() {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <style jsx>{`
        @keyframes converge-tl {
          0%, 10% { transform: translate(-50px, -35px); }
          40%, 60% { transform: translate(0, 0); }
          90%, 100% { transform: translate(-50px, -35px); }
        }
        @keyframes converge-tr {
          0%, 10% { transform: translate(50px, -35px); }
          40%, 60% { transform: translate(0, 0); }
          90%, 100% { transform: translate(50px, -35px); }
        }
        @keyframes converge-bl {
          0%, 10% { transform: translate(-50px, 35px); }
          40%, 60% { transform: translate(0, 0); }
          90%, 100% { transform: translate(-50px, 35px); }
        }
        @keyframes converge-br {
          0%, 10% { transform: translate(50px, 35px); }
          40%, 60% { transform: translate(0, 0); }
          90%, 100% { transform: translate(50px, 35px); }
        }
        @keyframes glow-pulse {
          0%, 10% { transform: scale(0.3); opacity: 0; }
          40%, 60% { transform: scale(1.5); opacity: 1; }
          90%, 100% { transform: scale(0.3); opacity: 0; }
        }
        .dot-tl { animation: converge-tl 4s ease-in-out infinite; }
        .dot-tr { animation: converge-tr 4s ease-in-out infinite; }
        .dot-bl { animation: converge-bl 4s ease-in-out infinite; }
        .dot-br { animation: converge-br 4s ease-in-out infinite; }
        .center-pulse { animation: glow-pulse 4s ease-in-out infinite; }
      `}</style>

      {/* Four converging dots */}
      <div
        className="dot-tl absolute w-8 h-8 rounded-full"
        style={{
          backgroundColor: '#FF6F61',
          boxShadow: '0 0 25px #FF6F61',
        }}
      />
      <div
        className="dot-tr absolute w-8 h-8 rounded-full"
        style={{
          backgroundColor: '#6BA292',
          boxShadow: '0 0 25px #6BA292',
        }}
      />
      <div
        className="dot-bl absolute w-8 h-8 rounded-full"
        style={{
          backgroundColor: '#5B84B1',
          boxShadow: '0 0 25px #5B84B1',
        }}
      />
      <div
        className="dot-br absolute w-8 h-8 rounded-full"
        style={{
          backgroundColor: '#7A4DA4',
          boxShadow: '0 0 25px #7A4DA4',
        }}
      />

      {/* Center glow when aligned */}
      <div
        className="center-pulse absolute w-20 h-20 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)',
        }}
      />
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
            What Flow Is Actually{' '}
            <span className="bg-gradient-to-r from-[#FF6F61] via-[#6BA292] to-[#7A4DA4] bg-clip-text text-transparent">
              Telling You
            </span>
          </h2>
        </motion.div>

        {/* Block 1: The Split */}
        <motion.div
          className="mb-28"
          initial={{ opacity: 0, y: 40 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <SplitAnimation />
          <p className="text-lg md:text-xl text-gray-400 text-center mt-8 max-w-2xl mx-auto">
            Somewhere along the way, work got split from meaning —
            <span className="text-gray-500"> as if they were separate problems.</span>
          </p>
        </motion.div>

        {/* Block 2: The Body Knows */}
        <motion.div
          className="mb-28"
          initial={{ opacity: 0, y: 40 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <BreathingPulse />
          <p className="text-2xl md:text-3xl text-white font-light italic text-center mt-6">
            But the body knows something different.
          </p>
          <p className="text-base text-gray-500 text-center mt-3">
            It&apos;s a <span className="text-[#FF6F61]">biological signal</span> that something has aligned.
          </p>
        </motion.div>

        {/* Block 3: The Emblem (replaced Zone) */}
        <motion.div
          className="mb-28"
          initial={{ opacity: 0, y: 40 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <EmblemAnimation />
          <p className="text-xl md:text-2xl text-white text-center mt-6 font-medium">
            Flow sits at the intersection.
          </p>
          <p className="text-sm text-gray-500 text-center mt-2 max-w-lg mx-auto">
            Where what the world needs meets what makes a person come alive.
          </p>
        </motion.div>

        {/* Block 4: Four Frequencies */}
        <motion.div
          className="mb-28"
          initial={{ opacity: 0, y: 40 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-lg text-gray-500 text-center mb-10">
            Four frequencies keep appearing — in research, in tradition, in lived experience.
          </p>
          <FrequencyAnimation inView={hasEntered} />
        </motion.div>

        {/* Block 5: Alignment */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <AlignmentAnimation />
          <div className="text-center mt-8 space-y-3">
            <p className="text-xl md:text-2xl text-white">
              When these align, people come alive.
            </p>
            <p className="text-base text-gray-500">
              Not by adding more — by uncovering what was always trying to emerge.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
