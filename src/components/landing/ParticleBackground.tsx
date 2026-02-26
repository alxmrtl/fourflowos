'use client';

import { useEffect, useRef, useCallback } from 'react';

const PILLAR_COLORS = ['#FF6F61', '#6BA292', '#5B84B1', '#7A4DA4'];
const PARTICLE_COUNT = 50;
const MERGE_DISTANCE = 60;
const STAR_DURATION = 500;

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

export default function ParticleBackground() {
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

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

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
