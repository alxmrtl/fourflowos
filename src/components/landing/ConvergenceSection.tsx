'use client';

import { useEffect, useRef } from 'react';
import { GRADIENTS } from '@/styles/brand-colors';
import PrincipleBridge from './PrincipleBridge';

const CX = 340;
const CY = 240;
const R = 155;

// Continuous loop phase durations (ms)
const T_ORBIT = 5000;
const T_CONV = 2500;
const T_MERGED = 3000;
const T_EXPAND = 2500;
const T_CYCLE = T_ORBIT + T_CONV + T_MERGED + T_EXPAND;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

// Compute the merge "blend" factor: 0 = orbit positions, 1 = merged at center
function computeBlend(cycleT: number): number {
  if (cycleT < T_ORBIT) return 0;
  if (cycleT < T_ORBIT + T_CONV) {
    const p = (cycleT - T_ORBIT) / T_CONV;
    return easeInOut(p);
  }
  if (cycleT < T_ORBIT + T_CONV + T_MERGED) return 1;
  const p = (cycleT - T_ORBIT - T_CONV - T_MERGED) / T_EXPAND;
  return 1 - easeInOut(p);
}

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

  useEffect(() => {
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

    let startTime: number | null = null;
    let raf = 0;

    const trackLabel = (label: SVGTextElement, circ: SVGCircleElement, padding: number) => {
      const ccx = parseFloat(circ.getAttribute('cx') || '0');
      const ccy = parseFloat(circ.getAttribute('cy') || '0');
      const r = parseFloat(circ.getAttribute('r') || '0');
      const dx = ccx - CX;
      const dy = ccy - CY;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const ext = r + padding;
      label.setAttribute('x', String(ccx + (dx / d) * ext));
      label.setAttribute('y', String(ccy + (dy / d) * ext));
    };

    // Three orbital phase offsets (radians)
    const PHASES = [Math.PI, Math.PI / 3, -Math.PI / 3];
    const CIRCS = [c1, c2, c3];
    const LABELS = [l1, l2, l3];

    const animate = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const cycleT = elapsed % T_CYCLE;
      const blend = computeBlend(cycleT);
      // Orbit angle keeps moving continuously across phases — creates spiral feel during converge/expand
      const a = elapsed * 0.00028;

      for (let i = 0; i < 3; i++) {
        const orbitX = CX + R * Math.cos(a + PHASES[i]);
        const orbitY = CY + R * Math.sin(a + PHASES[i]) * 0.55;
        const x = orbitX + (CX - orbitX) * blend;
        const y = orbitY + (CY - orbitY) * blend;
        CIRCS[i].setAttribute('cx', String(x));
        CIRCS[i].setAttribute('cy', String(y));
        CIRCS[i].setAttribute('r', String(105 - 24 * blend));
        trackLabel(LABELS[i], CIRCS[i], 28);
        LABELS[i].setAttribute('opacity', String(0.85 * (1 - blend)));
      }

      cF.setAttribute('opacity', String(blend));
      ring.setAttribute('opacity', String(blend * 0.55));
      lF.setAttribute('opacity', String(blend));

      raf = requestAnimationFrame(animate);
    };

    let timeout: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          timeout = setTimeout(() => {
            raf = requestAnimationFrame(animate);
          }, 2000);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center py-16 md:py-20 bg-[#050505] overflow-hidden">
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
          <svg ref={svgRef} viewBox="0 0 680 480" className="w-full h-full" aria-hidden="true">
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
              fontFamily="Inter, system-ui, sans-serif"
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
              fontFamily="Inter, system-ui, sans-serif"
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
              fontFamily="Inter, system-ui, sans-serif"
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
              fontFamily="var(--font-display, 'EB Garamond'), Georgia, serif"
              fontStyle="italic"
              fontSize="64"
              opacity="0"
            >
              flow
            </text>
          </svg>
        </div>

        <PrincipleBridge>Alignment in flow is where they meet.</PrincipleBridge>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
