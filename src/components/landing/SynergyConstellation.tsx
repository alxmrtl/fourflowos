'use client';

import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { KEYS, KEY_SYNERGIES } from '@/data/framework';
import { KeyType } from '@/types/framework';

const DIMENSION_COLORS: Record<string, string> = {
  self: '#FF6F61',
  space: '#6BA292',
  story: '#5B84B1',
  spirit: '#7A4DA4',
};

// Home positions for each key within their quadrant (percentage based)
const KEY_HOME_POSITIONS: Record<KeyType, { x: number; y: number }> = {
  // Spirit (top-left quadrant)
  'grounding-values': { x: 12, y: 18 },
  'visualized-vision': { x: 25, y: 28 },
  'ignited-curiosity': { x: 38, y: 15 },
  // Story (top-right quadrant)
  'generative-story': { x: 62, y: 15 },
  'clear-mission': { x: 75, y: 28 },
  'empowered-role': { x: 88, y: 18 },
  // Self (bottom-left quadrant)
  'tuned-emotions': { x: 12, y: 82 },
  'open-mind': { x: 25, y: 72 },
  'focused-body': { x: 38, y: 85 },
  // Space (bottom-right quadrant)
  'intentional-space': { x: 62, y: 85 },
  'optimized-tools': { x: 75, y: 72 },
  'feedback-systems': { x: 88, y: 82 },
};

// Center stage positions for active keys (wider apart)
const CENTER_POSITIONS = {
  left: { x: 22, y: 50 },
  right: { x: 78, y: 50 },
};

const KEY_SIZE = 52;
const ACTIVE_KEY_SIZE = 68;
const MIN_DISTANCE = 70; // Minimum distance between keys in pixels
const CURSOR_INFLUENCE_RADIUS = 150;
const CURSOR_PUSH_STRENGTH = 25;

interface KeyState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function SynergyConstellation() {
  const [currentSynergyIndex, setCurrentSynergyIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [keyStates, setKeyStates] = useState<Record<KeyType, KeyState>>({} as Record<KeyType, KeyState>);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Initialize key states
  useEffect(() => {
    const states: Record<string, KeyState> = {};
    Object.entries(KEY_HOME_POSITIONS).forEach(([keyId, pos]) => {
      states[keyId] = {
        x: pos.x,
        y: pos.y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      };
    });
    setKeyStates(states as Record<KeyType, KeyState>);
  }, []);

  // Handle container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  // Physics simulation for floating keys
  useEffect(() => {
    if (!isVisible) return;

    const currentSynergy = KEY_SYNERGIES[currentSynergyIndex];
    const activeKeys = [currentSynergy.from, currentSynergy.to];

    const simulate = () => {
      setKeyStates((prev) => {
        const newStates = { ...prev };
        const keys = Object.keys(newStates) as KeyType[];

        keys.forEach((keyId) => {
          // Skip active keys - they go to center
          if (activeKeys.includes(keyId)) return;

          const state = { ...newStates[keyId] };
          const home = KEY_HOME_POSITIONS[keyId];

          // Cursor avoidance
          const mx = mouseX.get();
          const my = mouseY.get();
          const dxMouse = state.x - mx;
          const dyMouse = state.y - my;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < CURSOR_INFLUENCE_RADIUS / 5 && distMouse > 0) {
            const force = (1 - distMouse / (CURSOR_INFLUENCE_RADIUS / 5)) * CURSOR_PUSH_STRENGTH;
            state.vx += (dxMouse / distMouse) * force * 0.01;
            state.vy += (dyMouse / distMouse) * force * 0.01;
          }

          // Return to home position (spring force)
          const dxHome = home.x - state.x;
          const dyHome = home.y - state.y;
          state.vx += dxHome * 0.002;
          state.vy += dyHome * 0.002;

          // Collision avoidance with other keys
          keys.forEach((otherId) => {
            if (otherId === keyId || activeKeys.includes(otherId)) return;
            const other = newStates[otherId];
            const dx = state.x - other.x;
            const dy = state.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = (MIN_DISTANCE / containerSize.width) * 100;

            if (dist < minDist && dist > 0) {
              const force = (minDist - dist) * 0.1;
              state.vx += (dx / dist) * force;
              state.vy += (dy / dist) * force;
            }
          });

          // Random drift (bubble wobble)
          state.vx += (Math.random() - 0.5) * 0.02;
          state.vy += (Math.random() - 0.5) * 0.02;

          // Damping
          state.vx *= 0.95;
          state.vy *= 0.95;

          // Apply velocity
          state.x += state.vx;
          state.y += state.vy;

          // Boundary constraints (keep in quadrant area)
          state.x = Math.max(5, Math.min(95, state.x));
          state.y = Math.max(10, Math.min(90, state.y));

          newStates[keyId] = state;
        });

        return newStates;
      });

      animationFrameRef.current = requestAnimationFrame(simulate);
    };

    animationFrameRef.current = requestAnimationFrame(simulate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, currentSynergyIndex, mouseX, mouseY, containerSize.width]);

  // Cycle through synergies
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentSynergyIndex((prev) => (prev + 1) % KEY_SYNERGIES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const currentSynergy = KEY_SYNERGIES[currentSynergyIndex];
  const fromKey = KEYS[currentSynergy.from as KeyType];
  const toKey = KEYS[currentSynergy.to as KeyType];
  const fromColor = DIMENSION_COLORS[fromKey.dimension];
  const toColor = DIMENSION_COLORS[toKey.dimension];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(122,77,164,0.06) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Everything Connects
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            The keys flow into each other. When aligned, they amplify your state.
          </p>
        </motion.div>

        {/* Constellation Container */}
        <div
          ref={containerRef}
          className="relative mx-auto h-[450px] md:h-[550px]"
          onMouseMove={handleMouseMove}
        >
          {/* Dimension labels */}
          <div className="absolute top-2 left-4 text-xs font-bold uppercase tracking-wider opacity-60" style={{ color: DIMENSION_COLORS.spirit }}>
            Spirit
          </div>
          <div className="absolute top-2 right-4 text-xs font-bold uppercase tracking-wider opacity-60" style={{ color: DIMENSION_COLORS.story }}>
            Story
          </div>
          <div className="absolute bottom-2 left-4 text-xs font-bold uppercase tracking-wider opacity-60" style={{ color: DIMENSION_COLORS.self }}>
            Self
          </div>
          <div className="absolute bottom-2 right-4 text-xs font-bold uppercase tracking-wider opacity-60" style={{ color: DIMENSION_COLORS.space }}>
            Space
          </div>

          {/* Energy Tunnel SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 15 }}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Gradient for tunnel */}
              <linearGradient id="tunnel-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={fromColor} stopOpacity="0.6" />
                <stop offset="50%" stopColor={`${fromColor}80`} stopOpacity="0.3" />
                <stop offset="50%" stopColor={`${toColor}80`} stopOpacity="0.3" />
                <stop offset="100%" stopColor={toColor} stopOpacity="0.6" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="tunnel-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Inner glow gradient */}
              <linearGradient id="tunnel-inner" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={fromColor} stopOpacity="0.15" />
                <stop offset="50%" stopColor="white" stopOpacity="0.05" />
                <stop offset="100%" stopColor={toColor} stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Energy tunnel - outer glow */}
            <AnimatePresence mode="wait">
              <motion.ellipse
                key={`tunnel-outer-${currentSynergyIndex}`}
                cx="50%"
                cy="50%"
                rx="28%"
                ry="8%"
                fill="none"
                stroke="url(#tunnel-gradient)"
                strokeWidth="40"
                filter="url(#tunnel-glow)"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ transformOrigin: 'center' }}
              />
            </AnimatePresence>

            {/* Energy tunnel - inner fill */}
            <AnimatePresence mode="wait">
              <motion.ellipse
                key={`tunnel-inner-${currentSynergyIndex}`}
                cx="50%"
                cy="50%"
                rx="26%"
                ry="6%"
                fill="url(#tunnel-inner)"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                style={{ transformOrigin: 'center' }}
              />
            </AnimatePresence>

            {/* Energy flow particles */}
            <AnimatePresence mode="wait">
              <motion.line
                key={`flow-${currentSynergyIndex}`}
                x1="24%"
                y1="50%"
                x2="76%"
                y2="50%"
                stroke="url(#tunnel-gradient)"
                strokeWidth="2"
                strokeDasharray="8 12"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{
                  opacity: [0, 0.8, 0.8, 0],
                  pathLength: 1,
                  strokeDashoffset: [0, -100]
                }}
                transition={{
                  opacity: { duration: 0.5 },
                  pathLength: { duration: 0.6, delay: 0.2 },
                  strokeDashoffset: { duration: 3, repeat: Infinity, ease: 'linear' }
                }}
              />
            </AnimatePresence>
          </svg>

          {/* Question inside tunnel */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-8 max-w-md"
            style={{ zIndex: 25 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentSynergyIndex}
                className="text-lg md:text-xl font-medium leading-relaxed"
                style={{
                  background: `linear-gradient(90deg, ${fromColor}, white 30%, white 70%, ${toColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 40px rgba(255,255,255,0.1)',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {currentSynergy.question}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Floating Keys */}
          {Object.entries(KEYS).map(([keyId, key]) => {
            const isFrom = keyId === currentSynergy.from;
            const isTo = keyId === currentSynergy.to;
            const isActive = isFrom || isTo;
            const color = DIMENSION_COLORS[key.dimension];

            // Get position - either from physics simulation or center stage
            const state = keyStates[keyId as KeyType];
            let posX: number, posY: number;

            if (isActive) {
              posX = isFrom ? CENTER_POSITIONS.left.x : CENTER_POSITIONS.right.x;
              posY = CENTER_POSITIONS.left.y;
            } else if (state) {
              posX = state.x;
              posY = state.y;
            } else {
              const home = KEY_HOME_POSITIONS[keyId as KeyType];
              posX = home.x;
              posY = home.y;
            }

            const size = isActive ? ACTIVE_KEY_SIZE : KEY_SIZE;

            return (
              <motion.div
                key={keyId}
                className="absolute"
                style={{
                  width: size,
                  height: size,
                  zIndex: isActive ? 30 : 5,
                }}
                animate={{
                  left: `${posX}%`,
                  top: `${posY}%`,
                  x: '-50%',
                  y: '-50%',
                  scale: isActive ? 1 : 1,
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={{
                  type: 'spring',
                  stiffness: isActive ? 100 : 150,
                  damping: isActive ? 15 : 20,
                  mass: 0.8,
                }}
              >
                {/* Glow for active keys */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute rounded-2xl"
                      style={{
                        inset: -12,
                        background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: [0.6, 0.9, 0.6],
                        scale: [1, 1.1, 1],
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        opacity: { duration: 2, repeat: Infinity },
                        scale: { duration: 2, repeat: Infinity },
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Key container */}
                <motion.div
                  className="relative w-full h-full rounded-2xl border-2 overflow-hidden backdrop-blur-sm"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`
                      : 'rgba(10, 10, 10, 0.6)',
                    borderColor: isActive ? color : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isActive
                      ? `0 0 30px ${color}40, inset 0 0 20px ${color}20`
                      : 'none',
                  }}
                >
                  <Image
                    src={key.icon}
                    alt={key.name}
                    fill
                    className="object-contain p-2"
                    style={{ opacity: isActive ? 1 : 0.7 }}
                  />
                </motion.div>

                {/* Key name label for active keys */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-9 left-1/2 whitespace-nowrap"
                      initial={{ opacity: 0, y: -8, x: '-50%' }}
                      animate={{ opacity: 1, y: 0, x: '-50%' }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <span
                        className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide"
                        style={{
                          background: `${color}30`,
                          color: color,
                          border: `1px solid ${color}50`,
                          boxShadow: `0 0 15px ${color}30`,
                        }}
                      >
                        {key.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-6">
          {KEY_SYNERGIES.map((synergy, index) => {
            const sFromColor = DIMENSION_COLORS[KEYS[synergy.from as KeyType].dimension];
            const sToColor = DIMENSION_COLORS[KEYS[synergy.to as KeyType].dimension];
            const isActive = index === currentSynergyIndex;

            return (
              <button
                key={index}
                onClick={() => setCurrentSynergyIndex(index)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: isActive ? 24 : 8,
                  height: 8,
                  background: isActive
                    ? `linear-gradient(90deg, ${sFromColor}, ${sToColor})`
                    : 'rgba(255, 255, 255, 0.2)',
                }}
                aria-label={`View connection ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
