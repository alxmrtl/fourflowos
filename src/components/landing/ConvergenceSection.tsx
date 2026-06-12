'use client';

import { useEffect, useRef, useState } from 'react';
import { GRADIENTS } from '@/styles/brand-colors';
import PrincipleBridge from './PrincipleBridge';

const CX = 340;
const CY = 240;
const R = 155;

const MERGE_DIST = 70;     // release within this distance of center → merge
const T_MERGE = 900;       // ms — blend ramp on merge
const T_MERGED = 3000;     // ms — hold merged
const T_RELEASE = 1800;    // ms — drift back to orbit
const AUTO_DEMO_AFTER = 13000; // ms idle in view before showing the payoff unprompted

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

type Mode = 'idle' | 'grabbed' | 'merging' | 'merged' | 'release';

export default function ConvergenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const c1Ref = useRef<SVGCircleElement>(null);
  const c2Ref = useRef<SVGCircleElement>(null);
  const c3Ref = useRef<SVGCircleElement>(null);
  const cFRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const l1Ref = useRef<SVGTextElement>(null);
  const l2Ref = useRef<SVGTextElement>(null);
  const l3Ref = useRef<SVGTextElement>(null);
  const lFRef = useRef<SVGTextElement>(null);

  const [hintVisible, setHintVisible] = useState(true);
  const [isCoarse, setIsCoarse] = useState(false);
  const hasMergedRef = useRef(false);

  useEffect(() => {
    setIsCoarse(window.matchMedia('(pointer: coarse)').matches);

    const svg = svgRef.current;
    const c1 = c1Ref.current;
    const c2 = c2Ref.current;
    const c3 = c3Ref.current;
    const cF = cFRef.current;
    const ring = ringRef.current;
    const l1 = l1Ref.current;
    const l2 = l2Ref.current;
    const l3 = l3Ref.current;
    const lF = lFRef.current;
    if (!svg || !c1 || !c2 || !c3 || !cF || !ring || !l1 || !l2 || !l3 || !lF) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches;

    let raf = 0;
    let startTime: number | null = null;
    let mode: Mode = 'idle';
    let modeStart = 0;          // timestamp of last mode change
    let blendFrom = 0;          // blend value when merging/release began
    let blend = 0;              // 0 = orbit, 1 = merged
    let grabbed = -1;           // index of dragged circle
    let grabPos = { x: 0, y: 0 };
    let lastInteraction = 0;
    let interacted = false;

    const PHASES = [Math.PI, Math.PI / 3, -Math.PI / 3];
    const CIRCS = [c1, c2, c3];
    const LABELS = [l1, l2, l3];

    const setMode = (m: Mode, now: number) => {
      mode = m;
      modeStart = now;
      blendFrom = blend;
      if (m === 'merging') {
        hasMergedRef.current = true;
        setHintVisible(false);
      }
    };

    const toSvg = (e: PointerEvent) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      return { x: pt.x, y: pt.y };
    };

    const circlePos = (i: number) => ({
      x: parseFloat(CIRCS[i].getAttribute('cx') || '0'),
      y: parseFloat(CIRCS[i].getAttribute('cy') || '0'),
    });

    const onPointerDown = (e: PointerEvent) => {
      lastInteraction = performance.now();
      interacted = true;
      if (mode === 'merging' || mode === 'merged') return;
      const p = toSvg(e);
      // Tap anywhere on touch → converge. Drag a circle on fine pointers.
      if (coarse) {
        setMode('merging', performance.now());
        return;
      }
      for (let i = 0; i < 3; i++) {
        const c = circlePos(i);
        const r = parseFloat(CIRCS[i].getAttribute('r') || '105');
        if (Math.hypot(p.x - c.x, p.y - c.y) < r) {
          grabbed = i;
          grabPos = p;
          svg.setPointerCapture(e.pointerId);
          svg.style.cursor = 'grabbing';
          setMode('grabbed', performance.now());
          return;
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (mode !== 'grabbed') return;
      grabPos = toSvg(e);
      lastInteraction = performance.now();
    };

    const onPointerUp = () => {
      svg.style.cursor = 'grab';
      if (mode !== 'grabbed') return;
      const dist = Math.hypot(grabPos.x - CX, grabPos.y - CY);
      grabbed = -1;
      setMode(dist < MERGE_DIST ? 'merging' : 'release', performance.now());
    };

    svg.addEventListener('pointerdown', onPointerDown);
    svg.addEventListener('pointermove', onPointerMove);
    svg.addEventListener('pointerup', onPointerUp);
    svg.addEventListener('pointercancel', onPointerUp);
    if (!coarse) svg.style.cursor = 'grab';

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      if (startTime === null) {
        startTime = now;
        lastInteraction = now;
      }
      const elapsed = now - startTime;
      const a = elapsed * 0.00028;

      // ── Mode machine drives the blend ──
      if (mode === 'idle') {
        blend = Math.max(0, blend - 0.02);
        // Show the payoff unprompted if the visitor just watches.
        if (now - lastInteraction > AUTO_DEMO_AFTER && !interacted) {
          setMode('merging', now);
          lastInteraction = now;
        }
      } else if (mode === 'grabbed') {
        // Pulling one circle inward draws the other two with it.
        const dist = Math.hypot(grabPos.x - CX, grabPos.y - CY);
        blend = clamp01(1 - dist / R) * 0.85;
      } else if (mode === 'merging') {
        const t = clamp01((now - modeStart) / T_MERGE);
        blend = blendFrom + (1 - blendFrom) * easeInOut(t);
        if (t >= 1) setMode('merged', now);
      } else if (mode === 'merged') {
        blend = 1;
        if (now - modeStart > T_MERGED) setMode('release', now);
      } else if (mode === 'release') {
        const t = clamp01((now - modeStart) / T_RELEASE);
        blend = blendFrom * (1 - easeInOut(t));
        if (t >= 1) {
          setMode('idle', now);
          lastInteraction = now;
        }
      }

      // ── Position circles ──
      for (let i = 0; i < 3; i++) {
        let x: number;
        let y: number;
        if (mode === 'grabbed' && i === grabbed) {
          x = grabPos.x;
          y = grabPos.y;
        } else {
          const orbitX = CX + R * Math.cos(a + PHASES[i]);
          const orbitY = CY + R * Math.sin(a + PHASES[i]) * 0.55;
          x = orbitX + (CX - orbitX) * blend;
          y = orbitY + (CY - orbitY) * blend;
        }
        CIRCS[i].setAttribute('cx', String(x));
        CIRCS[i].setAttribute('cy', String(y));
        CIRCS[i].setAttribute('r', String(105 - 24 * blend));

        // Label trails its circle, fading as things converge
        const dx = x - CX;
        const dy = y - CY;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const ext = parseFloat(CIRCS[i].getAttribute('r') || '105') + 28;
        LABELS[i].setAttribute('x', String(x + (dx / d) * ext));
        LABELS[i].setAttribute('y', String(y + (dy / d) * ext));
        LABELS[i].setAttribute('opacity', String(0.85 * (1 - blend)));
      }

      cF.setAttribute('opacity', String(blend));
      ring.setAttribute('opacity', String(blend * 0.55));
      lF.setAttribute('opacity', String(blend));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          raf = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(raf);
          startTime = null;
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      svg.removeEventListener('pointerdown', onPointerDown);
      svg.removeEventListener('pointermove', onPointerMove);
      svg.removeEventListener('pointerup', onPointerUp);
      svg.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center py-16 md:py-20 bg-ground-deep overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative max-w-3xl mx-auto px-6 text-center mb-10 md:mb-14">
        <h2 className="font-display text-3xl md:text-5xl font-normal text-white leading-[1.15]">
          Harmonizing productivity, wellness,{' '}
          <span
            className="italic bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENTS.textWide }}
          >
            and meaning
          </span>
          .
        </h2>
      </div>

      <div className="relative max-w-3xl mx-auto px-6">
        <div className="w-full aspect-[680/480] max-h-[68vh]">
          <svg ref={svgRef} viewBox="0 0 680 480" className="w-full h-full select-none" role="img" aria-label="Three circles — wellness, productivity, meaning — converging into flow">
            <defs>
              <radialGradient id="convSelfGrad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#E84535" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#E84535" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#E84535" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="convStoryGrad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#3E6FA3" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#3E6FA3" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3E6FA3" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="convSpiritGrad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#6330A0" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#6330A0" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6330A0" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="convFlowGrad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#F5F2EE" stopOpacity="0.4" />
                <stop offset="40%" stopColor="#4E8C73" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#4E8C73" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="convRingStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E84535" />
                <stop offset="50%" stopColor="#3E6FA3" />
                <stop offset="100%" stopColor="#6330A0" />
              </linearGradient>
              <filter id="convBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
            </defs>

            <circle ref={ringRef} cx={CX} cy={CY} r="112" fill="none" stroke="url(#convRingStroke)" strokeWidth="1" opacity="0" />

            <circle ref={c1Ref} cx="200" cy="240" r="105" fill="url(#convSelfGrad)" filter="url(#convBlur)" />
            <circle ref={c2Ref} cx="340" cy="140" r="105" fill="url(#convStoryGrad)" filter="url(#convBlur)" />
            <circle ref={c3Ref} cx="480" cy="240" r="105" fill="url(#convSpiritGrad)" filter="url(#convBlur)" />

            <circle ref={cFRef} cx={CX} cy={CY} r="110" fill="url(#convFlowGrad)" opacity="0" />

            <text
              ref={l1Ref}
              x="200" y="370"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#F0EDE8"
              fontFamily="var(--font-dm-sans), system-ui, sans-serif"
              fontSize="26"
              letterSpacing="1.5"
              opacity="0.85"
            >
              WELLNESS
            </text>
            <text
              ref={l2Ref}
              x="340" y="80"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#F0EDE8"
              fontFamily="var(--font-dm-sans), system-ui, sans-serif"
              fontSize="26"
              letterSpacing="1.5"
              opacity="0.85"
            >
              PRODUCTIVITY
            </text>
            <text
              ref={l3Ref}
              x="480" y="370"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#F0EDE8"
              fontFamily="var(--font-dm-sans), system-ui, sans-serif"
              fontSize="26"
              letterSpacing="1.5"
              opacity="0.85"
            >
              MEANING
            </text>
            <text
              ref={lFRef}
              x={CX} y={CY + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#F0EDE8"
              fontFamily="var(--font-cormorant), Georgia, serif"
              fontStyle="italic"
              fontSize="64"
              opacity="0"
            >
              flow
            </text>
          </svg>
        </div>

        {/* Interaction hint — fades after the first merge */}
        <p
          className="text-center text-[11px] tracking-[0.18em] uppercase text-white/25 -mt-2 transition-opacity duration-700"
          style={{ opacity: hintVisible ? 1 : 0 }}
        >
          {isCoarse ? 'tap to bring them together' : 'drag them together'}
        </p>

        <PrincipleBridge>Alignment in flow is where they meet.</PrincipleBridge>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
