'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useAudience, AudienceType } from '@/context/AudienceContext';
import { GRADIENTS } from '@/styles/brand-colors';

const PILLAR_COLORS = ['#E84535', '#4E8C73', '#3E6FA3', '#6330A0'];
const PARTICLE_COUNT = 50;
const MERGE_DISTANCE = 60;
const STAR_DURATION = 500; // ms

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  phase: number;
  merging?: { tx: number; ty: number };
}

interface Star {
  x: number;
  y: number;
  born: number;
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);

  const initParticle = useCallback((w: number, h: number): Particle => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    color: PILLAR_COLORS[Math.floor(Math.random() * 4)],
    radius: 2 + Math.random() * 2,
    phase: Math.random() * Math.PI * 2,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      initParticle(canvas.width, canvas.height)
    );

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      const particles = particlesRef.current;
      const stars = starsRef.current;
      const now = performance.now();

      ctx.clearRect(0, 0, w, h);

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Check merge with others
        if (!p.merging) {
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            if (q.merging || p.color === q.color) continue;
            const dx = q.x - p.x;
            const dy = q.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MERGE_DISTANCE) {
              const mx = (p.x + q.x) / 2;
              const my = (p.y + q.y) / 2;
              p.merging = { tx: mx, ty: my };
              q.merging = { tx: mx, ty: my };
            }
          }
        }

        if (p.merging) {
          const dx = p.merging.tx - p.x;
          const dy = p.merging.ty - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 3) {
            stars.push({ x: p.x, y: p.y, born: now });
            Object.assign(p, initParticle(w, h));
            delete p.merging;
          } else {
            p.x += dx * 0.1;
            p.y += dy * 0.1;
          }
        } else {
          p.phase += 0.01;
          p.x += p.vx + Math.sin(p.phase) * 0.15;
          p.y += p.vy + Math.cos(p.phase * 0.7) * 0.15;

          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Draw stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        const age = now - s.born;
        if (age > STAR_DURATION) {
          stars.splice(i, 1);
          continue;
        }
        const t = age / STAR_DURATION;
        const r = 4 + t * 8;
        const alpha = 1 - t;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 15 * alpha;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
    />
  );
}

const audienceOptions = [
  {
    id: 'individual' as const,
    title: "I'm a creator",
    description: 'Optimize your own focus, energy, and engagement',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    gradient: 'from-story to-spirit',
  },
  {
    id: 'leader' as const,
    title: "I'm a leader",
    description: 'Help your people find focus, energy, and engagement',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    gradient: 'from-space to-story',
  },
];

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });
  const { audience, setAudience, hasSelected } = useAudience();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAudienceSelect = (id: AudienceType) => {
    setAudience(id);
    // Auto-scroll to next section after a brief delay for the animation
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }, 600);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ground"
    >
      {/* Particle merge background */}
      <ParticleBackground />

      {/* Animated gradient background */}
      <div className="absolute inset-0">
        {/* Floating orbs - slower, breathing rhythm */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: '#E84535' }}
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-0 top-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: '#6330A0' }}
          animate={{
            x: [0, -60, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/4 bottom-0 w-72 h-72 rounded-full blur-3xl opacity-12"
          style={{ background: '#4E8C73' }}
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Fourth orb for Story pillar */}
        <motion.div
          className="absolute right-1/4 bottom-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: '#3E6FA3' }}
          animate={{
            x: [0, -30, 0],
            y: [0, 35, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.6,
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* Animated logo */}
        <motion.div
          className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6"
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          variants={{
            hidden: { scale: 0, rotate: -180, opacity: 0 },
            visible: {
              scale: 1,
              rotate: 0,
              opacity: 1,
              transition: {
                type: 'spring',
                stiffness: 80,
                damping: 15,
                duration: 1.2,
              },
            },
          }}
        >
          {/* Outer breathing glow */}
          <motion.div
            className="absolute -inset-4 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(99, 48, 160, 0.4) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Glowing ring behind logo - slower rotation with breathing */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #E84535, #4E8C73, #3E6FA3, #6330A0, #E84535)',
              filter: 'blur(20px)',
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
              scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          {/* Logo image */}
          <div className="absolute inset-1 rounded-full overflow-hidden bg-ground">
            <Image
              src="/assets/LOGOS/FOURFLOW - MAIN LOGO.png"
              alt="FourFlowOS"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
        </motion.div>

        {/* Main headline - user-focused */}
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
          variants={{
            hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.8, ease: 'easeOut' },
            },
          }}
        >
          Flow isn&apos;t forced.{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENTS.textWide }}>
            It&apos;s cultivated.
          </span>
        </motion.h1>

        {/* Sub-tagline */}
        <motion.p
          className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10"
          variants={{
            hidden: { opacity: 0, y: 25, filter: 'blur(6px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.7, ease: 'easeOut' },
            },
          }}
        >
          Align the four dimensions that create effortless focus and meaningful engagement.
        </motion.p>

        {/* Choice Prompt */}
        <motion.p
          className="text-gray-400 text-lg mb-3"
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: 'easeOut' },
            },
          }}
        >
          Choose your path
        </motion.p>

        {/* Audience Selection Cards */}
        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center max-w-4xl mx-auto"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: 'easeOut' },
            },
          }}
        >
          {audienceOptions.map((option) => {
            const isSelected = audience === option.id;
            const isOtherSelected = hasSelected && !isSelected;

            return (
              <motion.button
                key={option.id}
                onClick={() => handleAudienceSelect(option.id)}
                className="relative flex-1 group"
                animate={{
                  opacity: isOtherSelected ? 0.25 : 1,
                  scale: isOtherSelected ? 0.95 : 1,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                whileHover={!hasSelected ? { scale: 1.03 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated gradient border */}
                <motion.div
                  className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-r ${option.gradient} opacity-0 blur-sm`}
                  animate={{
                    opacity: isSelected ? 0.8 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className={`absolute -inset-[1px] rounded-3xl bg-gradient-to-r ${option.gradient}`}
                  animate={{
                    opacity: isSelected ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Card content */}
                <div
                  className={`
                    relative p-8 md:p-10 rounded-3xl text-left transition-all duration-300
                    ${isSelected
                      ? 'bg-ground'
                      : 'bg-white/[0.03] border border-white/10 group-hover:bg-white/[0.06] group-hover:border-white/20'
                    }
                  `}
                >
                  {/* Selected checkmark */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r ${option.gradient} flex items-center justify-center`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <motion.div
                    className={`mb-5 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}
                    animate={{ scale: isSelected ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {option.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className={`text-xl md:text-2xl font-semibold mb-3 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {option.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm md:text-base leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                    {option.description}
                  </p>

                  {/* CTA indicator - arrow only */}
                  <motion.div
                    className={`mt-6 ${isSelected ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`}
                  >
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{
                        rotate: isSelected ? 90 : 0,
                        x: isSelected ? 0 : [0, 4, 0],
                      }}
                      transition={{
                        rotate: { duration: 0.3 },
                        x: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

      </motion.div>
    </section>
  );
}
