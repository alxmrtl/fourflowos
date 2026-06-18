'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * The thread of light — a single luminous dot that travels the whole landing
 * page, weaving between sections: behind the hero headline, down through the
 * question rain, along the timeline, into the convergence point, across the
 * dimension grid, joining the constellation, and settling between the two
 * closing doors.
 *
 * Driven by real scrollY against measured section positions, so the reel-snap
 * scroll (900ms eased) reads as the dot gliding station to station. The dot's
 * color matures through the four dimension colors as the story progresses.
 */

// Per-section anchor: where the dot rests while that section is centered,
// in viewport fractions, plus the dot's color at that station.
const ANCHORS = [
  { x: 0.50, y: 0.30, color: [255, 255, 255] },  // 1 hero — above the headline
  { x: 0.66, y: 0.46, color: [232, 69, 53] },    // 2 question rain — falls with them (coral)
  { x: 0.30, y: 0.56, color: [232, 69, 53] },    // 3 timeline — rides the lineage (coral)
  { x: 0.64, y: 0.42, color: [78, 140, 115] },   // 4 definitions — by the entry (sage)
  { x: 0.50, y: 0.50, color: [62, 111, 163] },   // 5 convergence — the meeting point (steel)
  { x: 0.34, y: 0.50, color: [99, 48, 160] },    // 6 dimensions — through the grid (amethyst)
  { x: 0.58, y: 0.48, color: [99, 48, 160] },    // 7 constellation — joins the keys (amethyst)
  { x: 0.50, y: 0.54, color: [255, 255, 255] },  // 8 closing — between the doors (white)
];

interface Waypoint {
  scroll: number; // scrollY at which this section is centered
  x: number;
  y: number;
  color: number[];
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ThreadOfLight() {
  const { scrollY } = useScroll();
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [vp, setVp] = useState({ w: 1200, h: 800 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);

    const measure = () => {
      const sections = Array.from(document.querySelectorAll('[data-reel-section]'));
      const vpH = window.innerHeight;
      setVp({ w: window.innerWidth, h: vpH });
      setWaypoints(
        sections.slice(0, ANCHORS.length).map((el, i) => {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          return {
            scroll: Math.max(0, top + rect.height / 2 - vpH / 2),
            ...ANCHORS[i],
          };
        }),
      );
    };

    measure();
    // Re-measure after layout settles (images/fonts) and on resize.
    const t = setTimeout(measure, 800);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Position along the waypoint chain for a given scrollY.
  const sample = (y: number) => {
    if (waypoints.length < 2) return null;
    if (y <= waypoints[0].scroll) return { ...waypoints[0], t: 0, i: 0 };
    const last = waypoints[waypoints.length - 1];
    if (y >= last.scroll) return { ...last, t: 1, i: waypoints.length - 2 };
    let i = 0;
    while (i < waypoints.length - 2 && y > waypoints[i + 1].scroll) i++;
    const a = waypoints[i];
    const b = waypoints[i + 1];
    const t = easeInOut((y - a.scroll) / Math.max(1, b.scroll - a.scroll));
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      color: a.color.map((c, k) => Math.round(lerp(c, b.color[k], t))),
      scroll: y,
      t,
      i,
    };
  };

  const rawX = useTransform(scrollY, y => {
    const s = sample(y);
    return s ? s.x * vp.w : vp.w / 2;
  });
  const rawY = useTransform(scrollY, y => {
    const s = sample(y);
    return s ? s.y * vp.h : vp.h * 0.3;
  });
  const color = useTransform(scrollY, y => {
    const s = sample(y);
    const [r, g, b] = s ? s.color : [255, 255, 255];
    return `rgb(${r}, ${g}, ${b})`;
  });
  // Fade out once past the last station (into the footer).
  const opacity = useTransform(scrollY, y => {
    if (waypoints.length < 2) return 0;
    const last = waypoints[waypoints.length - 1];
    if (y <= last.scroll) return 1;
    return Math.max(0, 1 - (y - last.scroll) / (vp.h * 0.6));
  });

  // The dot leads; the tail follows on softer springs.
  const x = useSpring(rawX, { stiffness: 55, damping: 17 });
  const y = useSpring(rawY, { stiffness: 55, damping: 17 });
  const tailX = useSpring(rawX, { stiffness: 26, damping: 15 });
  const tailY = useSpring(rawY, { stiffness: 26, damping: 15 });
  const tail2X = useSpring(rawX, { stiffness: 13, damping: 13 });
  const tail2Y = useSpring(rawY, { stiffness: 13, damping: 13 });

  // Slow idle drift so the light never fully stops — it keeps tracing a small,
  // quiet orbit around its resting anchor even when scroll is idle. Driven by a
  // single per-frame loop that reads the scroll spring and adds a sine offset,
  // so it ticks continuously regardless of scroll. Two periods (X/Y) give an
  // organic Lissajous float rather than a circle.
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);
  const tdx = useMotionValue(0);
  const tdy = useMotionValue(0);
  const t2dx = useMotionValue(0);
  const t2dy = useMotionValue(0);

  useAnimationFrame(t => {
    const ox = Math.sin(t / 3800) * 16;
    const oy = Math.cos(t / 5200) * 12;
    dx.set(x.get() + ox);
    dy.set(y.get() + oy);
    // Tails drift a touch wider and softer so the comet breathes.
    tdx.set(tailX.get() + ox * 1.3);
    tdy.set(tailY.get() + oy * 1.3);
    t2dx.set(tail2X.get() + ox * 1.6);
    t2dy.set(tail2Y.get() + oy * 1.6);
  });

  // Softer, diffuse glow rather than a hard white pixel: broader blur, lower
  // outer-white opacity. The core color carries the section hue.
  const glow = useTransform(color, c => `0 0 16px 5px ${c}, 0 0 50px 16px rgba(255,255,255,0.07)`);

  if (!enabled) return null;

  return (
    <motion.div className="fixed inset-0 pointer-events-none z-30" style={{ opacity }} aria-hidden="true">
      <motion.div
        className="absolute w-1 h-1 rounded-full"
        style={{ x: t2dx, y: t2dy, background: color, opacity: 0.18, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full"
        style={{ x: tdx, y: tdy, background: color, opacity: 0.38, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-white/70"
        style={{ x: dx, y: dy, boxShadow: glow, translateX: '-50%', translateY: '-50%' }}
      />
    </motion.div>
  );
}
