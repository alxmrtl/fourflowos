'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Flow-field particle ground.
 *
 * Particles ride a slowly-evolving analytic vector field (summed sine/cosine
 * terms — no noise library), leaving short fading trails so the flow itself
 * becomes visible. Different-colored particles that meet still merge into a
 * white star burst (the four dimensions converging). The field bends away
 * from the pointer on fine-pointer devices.
 */

const PILLAR_COLORS = ['#E84535', '#4E8C73', '#3E6FA3', '#6330A0'];
const MERGE_DISTANCE = 60;
const STAR_DURATION = 500;
const POINTER_RADIUS = 140;

interface Particle {
  x: number;
  y: number;
  color: string;
  radius: number;
  speed: number;
  merging?: { tx: number; ty: number };
}

interface Star {
  x: number;
  y: number;
  born: number;
}

// Analytic flow field: returns an angle for any point + time.
function fieldAngle(x: number, y: number, t: number): number {
  const s1 = Math.sin(x * 0.0022 + t * 0.00012);
  const s2 = Math.cos(y * 0.0026 - t * 0.00009);
  const s3 = Math.sin((x + y) * 0.0011 + t * 0.00005);
  return (s1 + s2 + s3) * Math.PI;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const visibleRef = useRef(true);

  const initParticle = useCallback((w: number, h: number): Particle => ({
    x: Math.random() * w,
    y: Math.random() * h,
    color: PILLAR_COLORS[Math.floor(Math.random() * 4)],
    radius: 2 + Math.random() * 2,
    speed: 0.35 + Math.random() * 0.45,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const particleCount = coarsePointer ? 36 : 60;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const cssW = () => canvas.width / dpr;
    const cssH = () => canvas.height / dpr;

    particlesRef.current = Array.from({ length: particleCount }, () =>
      initParticle(cssW(), cssH())
    );

    // Pointer tracking — canvas is pointer-events-none, so listen on window
    // and convert to canvas-local coordinates.
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onPointerLeave = () => { pointerRef.current.active = false; };
    if (!coarsePointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerout', onPointerLeave, { passive: true });
    }

    // Pause the loop when off-screen (the hero scrolls away but stays mounted).
    const observer = new IntersectionObserver(
      entries => { visibleRef.current = entries[0].isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Reduced motion: draw one static frame, no loop.
    if (reducedMotion) {
      const w = cssW(), h = cssH();
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      return () => {
        window.removeEventListener('resize', resize);
        observer.disconnect();
      };
    }

    const loop = () => {
      animRef.current = requestAnimationFrame(loop);
      if (!visibleRef.current) return;

      const w = cssW();
      const h = cssH();
      const particles = particlesRef.current;
      const stars = starsRef.current;
      const pointer = pointerRef.current;
      const now = performance.now();

      // Fade previous frame instead of clearing — short luminous trails
      // make the flow field visible as streamlines.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

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
          // Ride the field
          const angle = fieldAngle(p.x, p.y, now);
          p.x += Math.cos(angle) * p.speed;
          p.y += Math.sin(angle) * p.speed;

          // Pointer repulsion — the field bends around your presence
          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0.001 && dist < POINTER_RADIUS) {
              const push = (1 - dist / POINTER_RADIUS) ** 2 * 2.2;
              p.x += (dx / dist) * push;
              p.y += (dy / dist) * push;
            }
          }

          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
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
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      if (!coarsePointer) {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerout', onPointerLeave);
      }
      observer.disconnect();
    };
  }, [initParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
      aria-hidden="true"
    />
  );
}
