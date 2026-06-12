'use client';

import { useEffect, useRef, useState } from 'react';
import { GRADIENTS } from '@/styles/brand-colors';
import PrincipleBridge from './PrincipleBridge';

// Seeded PRNG — every visitor gets their own persistent arrangement jitter.
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getVisitorSeed(): number {
  try {
    const KEY = 'ffos_constellation_seed';
    const stored = localStorage.getItem(KEY);
    if (stored) return parseInt(stored, 10);
    const seed = Math.floor(Math.random() * 2 ** 31);
    localStorage.setItem(KEY, String(seed));
    return seed;
  } catch {
    return 19741975; // flow named, 1975
  }
}

interface KeyDef {
  name: string;
  dim: 'self' | 'space' | 'story' | 'spirit';
  color: string;
  weight: number;
}

const KEYS: KeyDef[] = [
  { name: 'Tuned Emotions',    dim: 'self',   color: '#E84535', weight: 1.0 },
  { name: 'Focused Body',      dim: 'self',   color: '#E84535', weight: 1.3 },
  { name: 'Open Mind',         dim: 'self',   color: '#E84535', weight: 0.85 },
  { name: 'Intentional Space', dim: 'space',  color: '#4E8C73', weight: 1.1 },
  { name: 'Optimized Tools',   dim: 'space',  color: '#4E8C73', weight: 0.9 },
  { name: 'Feedback Systems',  dim: 'space',  color: '#4E8C73', weight: 1.0 },
  { name: 'Generative Story',  dim: 'story',  color: '#3E6FA3', weight: 1.15 },
  { name: 'Clear Mission',     dim: 'story',  color: '#3E6FA3', weight: 1.3 },
  { name: 'Empowered Role',    dim: 'story',  color: '#3E6FA3', weight: 0.95 },
  { name: 'Grounding Values',  dim: 'spirit', color: '#6330A0', weight: 1.05 },
  { name: 'Ignited Curiosity', dim: 'spirit', color: '#6330A0', weight: 1.4 },
  { name: 'Visualized Vision', dim: 'spirit', color: '#6330A0', weight: 1.0 },
];

const N = 12;
const W = 720;
const H = 500;
const CX = 360;
const CY = 250;

type Point = [number, number];

const shapes = {
  line: (): Point[] => {
    const arr: Point[] = [];
    for (let i = 0; i < N; i++) arr.push([80 + i * (560 / (N - 1)), CY]);
    return arr;
  },
  spiral: (): Point[] => {
    const arr: Point[] = [];
    for (let i = 0; i < N; i++) {
      const r = 26 + i * 14;
      const theta = i * 0.72;
      arr.push([CX + r * Math.cos(theta), CY + r * Math.sin(theta)]);
    }
    return arr;
  },
  square: (): Point[] => {
    const size = 280;
    const x0 = CX - size / 2;
    const y0 = CY - size / 2;
    const arr: Point[] = [];
    const perSide = N / 4;
    for (let s = 0; s < 4; s++) {
      for (let k = 0; k < perSide; k++) {
        const t = k / perSide;
        let x = 0, y = 0;
        if (s === 0) { x = x0 + t * size; y = y0; }
        else if (s === 1) { x = x0 + size; y = y0 + t * size; }
        else if (s === 2) { x = x0 + size - t * size; y = y0 + size; }
        else { x = x0; y = y0 + size - t * size; }
        arr.push([x, y]);
      }
    }
    return arr;
  },
  triangle: (): Point[] => {
    const size = 320;
    const v1: Point = [CX, CY - size * 0.6];
    const v2: Point = [CX - size * 0.55, CY + size * 0.38];
    const v3: Point = [CX + size * 0.55, CY + size * 0.38];
    const sides: [Point, Point][] = [[v1, v2], [v2, v3], [v3, v1]];
    const arr: Point[] = [];
    for (const [a, b] of sides) {
      for (let k = 0; k < 4; k++) {
        const t = k / 4;
        arr.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    return arr;
  },
  cluster: (): Point[] => {
    const arr: Point[] = [];
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2 + KEYS[i].weight * 0.5;
      const r = 60 + (i * 17) % 130;
      arr.push([CX + r * Math.cos(angle), CY + r * Math.sin(angle) * 0.8]);
    }
    return arr;
  },
  arc: (): Point[] => {
    const arr: Point[] = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const x = 100 + t * 520;
      const y = CY - 100 * Math.sin(t * Math.PI);
      arr.push([x, y]);
    }
    return arr;
  },
  // The FourFlow form: each dimension's three keys gather into a petal in
  // its quadrant. Personal jitter is never applied here — your scatter is
  // yours alone; coherence is one shared form.
  mandala: (): Point[] => {
    const arr: Point[] = [];
    for (let d = 0; d < 4; d++) {
      const base = -Math.PI / 2 + d * (Math.PI / 2);
      for (let k = 0; k < 3; k++) {
        const angle = base + (k - 1) * 0.45;
        const r = k === 1 ? 160 : 106;
        arr.push([CX + r * Math.cos(angle), CY + r * Math.sin(angle) * 0.85]);
      }
    }
    return arr;
  },
};

const ARRANGEMENTS: (keyof typeof shapes)[] = ['spiral', 'cluster', 'arc', 'triangle', 'square', 'line'];
const CLICKS_TO_COHERE = 3; // the Nth rearrangement resolves into the mandala

export default function UniqueStackSection() {
  const svgRef = useRef<SVGSVGElement>(null);
  const dotsGRef = useRef<SVGGElement>(null);
  const linesGRef = useRef<SVGGElement>(null);
  const ripplesGRef = useRef<SVGGElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [caption, setCaption] = useState<string | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const dotsG = dotsGRef.current;
    const linesG = linesGRef.current;
    const ripplesG = ripplesGRef.current;
    const hint = hintRef.current;
    if (!svg || !dotsG || !linesG || !ripplesG || !hint) return;

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    // Build lines (sequence connections)
    for (let i = 0; i < N - 1; i++) {
      const l = document.createElementNS(SVG_NS, 'line');
      l.setAttribute('stroke', 'url(#uniqueLineGrad)');
      l.setAttribute('stroke-width', '1');
      l.setAttribute('stroke-linecap', 'round');
      l.setAttribute('opacity', '0.55');
      linesG.appendChild(l);
    }
    // Build dots
    for (let i = 0; i < N; i++) {
      const c = document.createElementNS(SVG_NS, 'circle');
      const k = KEYS[i];
      c.setAttribute('r', String(10 * k.weight));
      c.setAttribute('fill', k.color);
      c.setAttribute('filter', 'url(#uniqueGlow)');
      c.setAttribute('opacity', '0.92');
      dotsG.appendChild(c);
    }

    const dots = dotsG.querySelectorAll('circle');
    const lines = linesG.querySelectorAll('line');

    let current: Point[] = Array.from({ length: N }, () => [CX, CY] as Point);
    const setPositions = (positions: Point[]) => {
      positions.forEach(([x, y], i) => {
        dots[i].setAttribute('cx', String(x));
        dots[i].setAttribute('cy', String(y));
      });
      for (let i = 0; i < lines.length; i++) {
        const [x1, y1] = positions[i];
        const [x2, y2] = positions[i + 1];
        lines[i].setAttribute('x1', String(x1));
        lines[i].setAttribute('y1', String(y1));
        lines[i].setAttribute('x2', String(x2));
        lines[i].setAttribute('y2', String(y2));
      }
    };
    setPositions(current);

    let breathingStarted = false;
    let breatheStart = 0;
    let breatheRaf = 0;
    const breatheTick = (now: number) => {
      if (!breatheStart) breatheStart = now;
      const t = (now - breatheStart) / 1000;
      dots.forEach((d, i) => {
        const k = KEYS[i];
        const baseR = 10 * k.weight;
        const pulse = 1 + 0.12 * Math.sin(t * 1.2 + i * 0.5);
        d.setAttribute('r', String(baseR * pulse));
        d.setAttribute('opacity', String(0.75 + 0.2 * Math.sin(t * 0.9 + i * 0.7)));
      });
      lines.forEach((l, i) => {
        l.setAttribute('opacity', String(0.35 + 0.25 * Math.sin(t * 0.7 + i * 0.3)));
      });
      breatheRaf = requestAnimationFrame(breatheTick);
    };
    const startBreathing = () => {
      if (breathingStarted) return;
      breathingStarted = true;
      breatheRaf = requestAnimationFrame(breatheTick);
    };

    let morphRaf = 0;
    const morphTo = (target: Point[], duration: number, onDone?: () => void) => {
      const from = current.map(([x, y]) => [x, y] as Point);
      const start = performance.now();
      cancelAnimationFrame(morphRaf);
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const e = easeInOut(p);
        const interp = from.map((f, i) => [
          f[0] + (target[i][0] - f[0]) * e,
          f[1] + (target[i][1] - f[1]) * e,
        ] as Point);
        setPositions(interp);
        if (p < 1) morphRaf = requestAnimationFrame(step);
        else { current = target; onDone && onDone(); }
      };
      morphRaf = requestAnimationFrame(step);
    };

    const clientToSvg = (evt: MouseEvent) => {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: CX, y: CY };
      return pt.matrixTransform(ctm.inverse());
    };

    const spawnRipple = (x: number, y: number) => {
      const ripple = document.createElementNS(SVG_NS, 'circle');
      ripple.setAttribute('cx', String(x));
      ripple.setAttribute('cy', String(y));
      ripple.setAttribute('r', '4');
      ripple.setAttribute('fill', 'url(#uniqueRippleGrad)');
      ripple.setAttribute('opacity', '1');
      ripple.style.pointerEvents = 'none';
      ripplesG.appendChild(ripple);
      const start = performance.now();
      const dur = 900;
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        ripple.setAttribute('r', String(4 + 220 * p));
        ripple.setAttribute('opacity', String(1 - p));
        if (p < 1) requestAnimationFrame(step);
        else ripple.remove();
      };
      requestAnimationFrame(step);
    };

    // Personal signature: a persistent seeded jitter on every scattered
    // arrangement. The mandala alone is exempt — coherence is one form.
    const rand = mulberry32(getVisitorSeed());
    const jitter = Array.from({ length: N }, () => [
      (rand() - 0.5) * 26,
      (rand() - 0.5) * 26,
    ] as Point);
    const withSignature = (points: Point[]): Point[] =>
      points.map(([x, y], i) => [x + jitter[i][0], y + jitter[i][1]] as Point);

    let arrIdx = 0;
    let firstInteraction = true;
    let clickCount = 0;
    let coherenceShown = false;
    const pickNextShape = (): keyof typeof shapes => {
      const choices = ARRANGEMENTS.filter((_, i) => i !== arrIdx);
      const next = choices[Math.floor(Math.random() * choices.length)];
      arrIdx = ARRANGEMENTS.indexOf(next);
      return next;
    };

    const rearrange = (clickX: number, clickY: number) => {
      clickCount++;
      // The third rearrangement resolves into the FourFlow mandala —
      // scattered keys cohering into the form.
      if (clickCount % (CLICKS_TO_COHERE + 1) === CLICKS_TO_COHERE) {
        morphTo(shapes.mandala(), 1600, () => {
          if (!coherenceShown) {
            coherenceShown = true;
            setCaption('…and when the twelve cohere, the form appears.');
          }
        });
        return;
      }
      const name = pickNextShape();
      const base = withSignature(shapes[name]());
      const baseCx = base.reduce((s, [x]) => s + x, 0) / N;
      const baseCy = base.reduce((s, [, y]) => s + y, 0) / N;
      const targetCx = Math.max(220, Math.min(W - 220, clickX));
      const targetCy = Math.max(160, Math.min(H - 160, clickY));
      const dx = targetCx - baseCx;
      const dy = targetCy - baseCy;
      const target = base.map(([x, y]) => [x + dx, y + dy] as Point);
      morphTo(target, 1100);
    };

    const onClick = (e: MouseEvent) => {
      const { x, y } = clientToSvg(e);
      spawnRipple(x, y);
      rearrange(x, y);
      if (firstInteraction) {
        hint.classList.add('opacity-0');
        firstInteraction = false;
      }
    };
    svg.addEventListener('click', onClick);

    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((it) => {
          if (it.isIntersecting && !played) {
            played = true;
            setTimeout(() => morphTo(withSignature(shapes.spiral()), 2400, () => {
              startBreathing();
              setCaption('this arrangement is yours');
            }), 400);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(svg);

    return () => {
      cancelAnimationFrame(breatheRaf);
      cancelAnimationFrame(morphRaf);
      svg.removeEventListener('click', onClick);
      io.disconnect();
      while (dotsG.firstChild) dotsG.removeChild(dotsG.firstChild);
      while (linesG.firstChild) linesG.removeChild(linesG.firstChild);
      while (ripplesG.firstChild) ripplesG.removeChild(ripplesG.firstChild);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center py-16 md:py-20 bg-ground-deep overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative max-w-3xl mx-auto px-6 text-center mb-10 md:mb-14">
        <h2 className="font-display text-3xl md:text-5xl font-normal text-white leading-[1.15]">
          Your alignment is{' '}
          <span
            className="italic bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENTS.textWide }}
          >
            yours alone
          </span>
          .
        </h2>
      </div>

      <div className="relative max-w-3xl mx-auto px-6">
        <div className="relative w-full aspect-[720/500] max-h-[65vh]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-full cursor-pointer"
            aria-hidden="true"
          >
            <defs>
              <filter id="uniqueGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="uniqueLineGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E84535" stopOpacity="0.4" />
                <stop offset="33%" stopColor="#4E8C73" stopOpacity="0.4" />
                <stop offset="66%" stopColor="#3E6FA3" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6330A0" stopOpacity="0.4" />
              </linearGradient>
              <radialGradient id="uniqueRippleGrad">
                <stop offset="0%" stopColor="#F0EDE8" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#F0EDE8" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#F0EDE8" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g ref={ripplesGRef} />
            <g ref={linesGRef} />
            <g ref={dotsGRef} />
          </svg>

          <div
            ref={hintRef}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-4 flex flex-col items-center transition-opacity duration-700"
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <span className="absolute w-10 h-10 rounded-full border border-white/15 animate-ping" style={{ animationDuration: '1.8s' }} />
              <span className="absolute w-5 h-5 rounded-full border border-white/25 animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.35s' }} />
              <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Whisper caption — appears once the signature settles */}
      <p
        key={caption}
        className="text-center font-display italic text-sm md:text-base text-white/35 mt-2 transition-opacity duration-1000"
        style={{ opacity: caption ? 1 : 0, minHeight: '1.5em' }}
      >
        {caption ?? ' '}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] tracking-[0.18em] uppercase text-white/40">
        {[
          { label: 'SELF',   color: '#E84535' },
          { label: 'SPACE',  color: '#4E8C73' },
          { label: 'STORY',  color: '#3E6FA3' },
          { label: 'SPIRIT', color: '#6330A0' },
        ].map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }}
            />
            {d.label}
          </div>
        ))}
      </div>

      <PrincipleBridge>Twelve keys, arranged in your signature.</PrincipleBridge>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
