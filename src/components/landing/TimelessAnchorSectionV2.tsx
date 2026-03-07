'use client';

import { motion, useAnimationFrame, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { AMETHYST, CORAL, STEEL, GRADIENTS } from '@/styles/brand-colors';

// ─── Icons ────────────────────────────────────────────────────────────────────

type IconProps = { className?: string };

const FootprintsIcon   = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="9" cy="17" rx="2.5" ry="3.5" transform="rotate(-10 9 17)" /><ellipse cx="15" cy="10" rx="2.5" ry="3.5" transform="rotate(10 15 10)" /><circle cx="7" cy="11" r="1" /><circle cx="11" cy="10" r="1" /><circle cx="13" cy="4" r="1" /><circle cx="17" cy="5" r="1" /></svg>;

const BrushIcon        = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2.5-2-3" /><path d="M9 21c0 0 1.5-2 2-4" /><path d="M21 4a4 4 0 01-4 4c-1.5 0-3.5-1-5-1" /></svg>;

const RippleIcon       = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="2" /><circle cx="12" cy="12" r="5.5" strokeOpacity="0.5" /><circle cx="12" cy="12" r="9" strokeOpacity="0.25" /></svg>;

const LotusIcon        = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c0-5-4-8-4-12a4 4 0 018 0c0 4-4 7-4 12z" /><path d="M12 21c-2-4-7-5-8-9a5 5 0 017 2" /><path d="M12 21c2-4 7-5 8-9a5 5 0 01-7 2" /></svg>;

const WavesIcon        = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 10c2-3.5 4-3.5 6 0s4 3.5 6 0 4-3.5 6 0" /><path d="M2 16c2-3.5 4-3.5 6 0s4 3.5 6 0 4-3.5 6 0" /></svg>;

const ShieldIcon       = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v5c0 5.5-4.5 9.5-8 10.5C8 20.5 4 16.5 4 11V6l8-3z" /></svg>;

const SparkleIcon      = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" /></svg>;

const ColumnIcon       = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="4" x2="20" y2="4" /><rect x="9" y="4" width="6" height="15" /><line x1="4" y1="21" x2="20" y2="21" /></svg>;

const EnsoIcon         = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 12a8 8 0 11-2.34-5.66" /></svg>;

const SpiralIcon       = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 12c1 0 2-.9 2-2s-.9-2-2-2-3 1-3 3 1 4 3 4 5-1.5 5-4-1.5-5-4-5-6 2-6 5 2 7 6 7" /></svg>;

const FlameIcon        = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 4-4 6-4 10a4 4 0 008 0c0-2-1-3.5-1-3.5s-.5 2-3 2.5C13 8.5 12 2 12 2z" /></svg>;

const MagnifyIcon      = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5l4.5 4.5" /></svg>;

const MusicIcon        = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;

const PeakIcon         = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20L8.5 7l4.5 6 3.5-5L22 20H2z" /></svg>;

const InfinityIcon     = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 000 8c2 0 4-1.5 6-4z" /><path d="M12 12c2 2.5 4 4 6 4a4 4 0 000-8c-2 0-4 1.5-6 4z" /></svg>;

const ScrollIcon       = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" /></svg>;

const NodesIcon        = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="5" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M7 12l10-5M7 12l10 5" /></svg>;

const TorchIcon        = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 3-3 4-3 7a3 3 0 006 0c0-3-3-4-3-7z" /><line x1="12" y1="12" x2="12" y2="22" /><line x1="9" y1="19" x2="15" y2="19" /></svg>;

const ConvergeIcon     = ({ className = '' }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="2.5" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeOpacity="0.5" /><path d="M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" strokeOpacity="0.3" /></svg>;

// ─── Card Data ────────────────────────────────────────────────────────────────

interface TimelineCard {
  era: string;
  title: string;
  body: string;
  t: number; // 0 = oldest, 1 = newest — drives color temperature
  Icon: React.FC<IconProps>;
}

const CARDS: TimelineCard[] = [
  { t: 0.00, era: '~200,000 BCE', title: 'Persistence Hunting',         Icon: FootprintsIcon, body: 'Sustained locomotor trance — early humans focused beyond exhaustion to outlast faster prey.' },
  { t: 0.03, era: '~40,000 BCE',  title: 'Cave Painting',               Icon: BrushIcon,      body: 'Hours of absorbed creation by firelight, deep underground. The earliest artifact of total focus.' },
  { t: 0.06, era: '~30,000 BCE',  title: 'Shamanic Trance',             Icon: RippleIcon,     body: 'Rhythm, fasting, and isolation to enter altered states and access insight beyond ordinary mind.' },
  { t: 0.13, era: '~1500 BCE',    title: 'Vedic Samadhi',               Icon: LotusIcon,      body: 'The Upanishads name the absorbed state beyond thought — the earliest written map of deep flow.' },
  { t: 0.20, era: '~600 BCE',     title: 'Wu Wei',                      Icon: WavesIcon,      body: 'Laozi: effortless action. Not forcing the river — becoming it.' },
  { t: 0.24, era: '~500 BCE',     title: 'Aristeia',                    Icon: ShieldIcon,     body: "Homer's warrior enters a peak performance surge — operating at full capacity, beyond effort and doubt." },
  { t: 0.27, era: '~380 BCE',     title: 'Platonic Inspiration',        Icon: SparkleIcon,    body: 'The poet is "in-breathed" by the Muses. Self-consciousness dissolves. Something larger flows through.' },
  { t: 0.29, era: '~350 BCE',     title: "Aristotle's Eudaimonia",      Icon: ColumnIcon,     body: 'Full-capacity flourishing — not happiness, but function at its highest expression.' },
  { t: 0.32, era: '~200 BCE',     title: "Patanjali's Dhyana",          Icon: EnsoIcon,       body: 'A three-stage progression: focused attention → unbroken flow → total absorption (samadhi).' },
  { t: 0.40, era: '~500 CE',      title: 'Zen Mushin',                  Icon: EnsoIcon,       body: "No-mind. The swordsman's blade moves before the decision forms. Stillness that acts." },
  { t: 0.50, era: '~1100s',       title: 'Sufi Fana',                   Icon: SpiralIcon,     body: 'Rumi: the small self dissolves into something larger and more capable. Ecstatic absorption.' },
  { t: 0.64, era: '1872',         title: "Nietzsche's Rausch",          Icon: FlameIcon,      body: 'Dionysian creative intoxication — vitality surges, the self loosens, great art flows through.' },
  { t: 0.67, era: '1890',         title: 'William James',               Icon: MagnifyIcon,    body: 'Mystical states are valid data for psychology. The door to scientific inquiry opens.' },
  { t: 0.73, era: '~1920s',       title: 'The Jazz Pocket',             Icon: MusicIcon,      body: "The groove arrives when you stop trying to find it. Flow in real-time musical collaboration." },
  { t: 0.78, era: '1943',         title: "Maslow's Peak Experience",    Icon: PeakIcon,       body: 'Moments at the top of the hierarchy of needs — self-consciousness dissolves, capacity expands.' },
  { t: 0.83, era: '1975',         title: 'Flow Named',                  Icon: InfinityIcon,   body: 'Csikszentmihalyi measures the state in chess players, surgeons, rock climbers. It gets a name.' },
  { t: 0.88, era: '1990',         title: 'Flow Published',              Icon: ScrollIcon,     body: 'Nine conditions identified. Challenge-skill balance formalized. The roadmap becomes public.' },
  { t: 0.92, era: '~1995',        title: 'Transient Hypofrontality',    Icon: NodesIcon,      body: 'The prefrontal cortex quiets during flow. The neural mechanism is found.' },
  { t: 0.96, era: '2017',         title: 'Stealing Fire',               Icon: TorchIcon,      body: 'Flow as performance technology. Silicon Valley and Special Operations converge on the state.' },
  { t: 1.00, era: 'Now',          title: 'The Present',                 Icon: ConvergeIcon,   body: "Every tradition arrived here. Every discipline confirmed it. The state is real, it's accessible, and the conditions that unlock it are knowable." },
];

// Key timestamp ticks to show on scrubber (index into CARDS)
const TIMESTAMP_TICKS = [3, 8, 11, 14, 17]; // ~1500 BCE, ~200 BCE, 1872, 1943, ~1995

// ─── Color interpolation ──────────────────────────────────────────────────────

function lerpColor(t: number): string {
  if (t < 0.5) {
    const f = t / 0.5;
    return `rgb(${Math.round(180 + (62 - 180) * f)},${Math.round(100 + (111 - 100) * f)},${Math.round(30 + (163 - 30) * f)})`;
  } else {
    const f = (t - 0.5) / 0.5;
    return `rgb(${Math.round(62 + (99 - 62) * f)},${Math.round(111 + (48 - 111) * f)},${Math.round(163 + (160 - 163) * f)})`;
  }
}

// ─── Card Component ───────────────────────────────────────────────────────────

function TimelineCard({ card, isLast }: { card: TimelineCard; isLast: boolean }) {
  const accentColor = lerpColor(card.t);
  return (
    <div
      data-card=""
      data-last-card={isLast ? '' : undefined}
      className="relative w-72 flex-shrink-0 rounded-xl p-5 flex flex-col gap-2.5 select-none"
      style={{
        background: isLast ? `linear-gradient(135deg, ${AMETHYST}14, ${STEEL}14)` : 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div style={{ color: accentColor }}>
        <card.Icon className="w-5 h-5" />
      </div>
      <p className="font-sans text-[9px] font-semibold tracking-[0.18em] uppercase" style={{ color: accentColor }}>
        {card.era}
      </p>
      <p className="font-display text-xl font-normal leading-tight" style={{ color: isLast ? AMETHYST : accentColor }}>
        {card.title}
      </p>
      <p className="font-sans text-sm text-gray-400 leading-relaxed">
        {card.body}
      </p>
    </div>
  );
}

// ─── Timeline Scrubber ────────────────────────────────────────────────────────

function TimelineScrubber({
  spineRef,
  pipRef,
  trailRef,
  iconRefs,
  onSeek,
}: {
  spineRef: React.RefObject<HTMLDivElement | null>;
  pipRef: React.RefObject<HTMLDivElement | null>;
  trailRef: React.RefObject<HTMLDivElement | null>;
  iconRefs: React.RefObject<(HTMLDivElement | null)[]>;
  onSeek: (fraction: number) => void;
}) {
  const isDraggingSpineRef = useRef(false);

  const getFraction = (clientX: number) => {
    if (!spineRef.current) return 0;
    const rect = spineRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    isDraggingSpineRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    onSeek(getFraction(e.clientX));
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSpineRef.current) return;
    onSeek(getFraction(e.clientX));
  };
  const onPointerUp = () => { isDraggingSpineRef.current = false; };

  return (
    <div className="max-w-5xl mx-auto px-10 mb-2">
      <div
        ref={spineRef}
        className="relative cursor-pointer select-none"
        style={{ height: 72 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* ── Icons row (top 28px) ── */}
        {CARDS.map((card, i) => {
          const pct = (i / (CARDS.length - 1)) * 100;
          return (
            <div
              key={i}
              ref={el => { iconRefs.current[i] = el; }}
              className="absolute"
              style={{
                left: `${pct}%`,
                top: 0,
                height: 28,
                transform: 'translateX(-50%)',
                opacity: 0,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                color: lerpColor(card.t),
                transition: 'none',
              }}
            >
              <card.Icon className="w-3.5 h-3.5" />
            </div>
          );
        })}

        {/* ── Track row (at 34px) ── */}
        <div className="absolute inset-x-0" style={{ top: 34 }}>
          {/* Base track */}
          <div className="absolute inset-x-0 h-px bg-white/10 rounded-full" />
          {/* Filled trail */}
          <div
            ref={trailRef}
            className="absolute left-0 h-px rounded-full"
            style={{
              width: '0%',
              background: `linear-gradient(90deg, ${CORAL}99, ${STEEL}99, ${AMETHYST})`,
            }}
          />
          {/* Pip */}
          <div
            ref={pipRef}
            className="absolute -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
            style={{
              left: '0%',
              top: 0,
              background: AMETHYST,
              boxShadow: `0 0 8px ${AMETHYST}cc`,
            }}
          />
          {/* Timestamp ticks — hidden on mobile to prevent label overlap */}
          <div className="hidden sm:block">
            {TIMESTAMP_TICKS.map(idx => {
              const pct = (idx / (CARDS.length - 1)) * 100;
              return (
                <div
                  key={idx}
                  className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5"
                  style={{ left: `${pct}%`, top: 2 }}
                >
                  <div className="w-px h-2.5 bg-white/15" />
                  <span className="font-sans text-[8px] tracking-[0.08em] text-gray-700 whitespace-nowrap">
                    {CARDS[idx].era}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── End labels ── */}
        <div className="absolute inset-x-0" style={{ top: 34 + 14 }}>
          <span className="absolute left-0 font-sans text-[9px] tracking-[0.12em] uppercase text-gray-700">
            200,000 BCE
          </span>
          <span className="absolute right-0 font-sans text-[9px] tracking-[0.12em] uppercase text-gray-700">
            Now
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Scrolling Carousel ───────────────────────────────────────────────────────

const PROXIMITY_RADIUS = 0.09; // fraction of total range — icon visible within this distance of pip

function ScrollingCarousel() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const trackRef      = useRef<HTMLDivElement>(null);
  const spineRef      = useRef<HTMLDivElement>(null);
  const pipRef        = useRef<HTMLDivElement>(null);
  const trailRef      = useRef<HTMLDivElement>(null);
  const iconRefs      = useRef<(HTMLDivElement | null)[]>([]);

  const xRef          = useRef(0);
  const boundsRef     = useRef({ min: -9999, max: 0 });
  const initializedRef = useRef(false);
  const isInViewRef   = useRef(false);

  const isDraggingRef    = useRef(false);
  const dragLastXRef     = useRef(0);
  const dragLastTimeRef  = useRef(0);
  const momentumRef      = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const isInView = useInView(sectionRef, { amount: 0.1 });
  useEffect(() => { isInViewRef.current = isInView; }, [isInView]);

  const measure = () => {
    if (!trackRef.current || !containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const cards = trackRef.current.querySelectorAll<HTMLElement>('[data-card]');
    if (!cards.length) return;
    const firstCard = cards[0];
    const lastCard  = cards[cards.length - 1];
    const cardWidth = firstCard.offsetWidth;
    const trackWidth = lastCard.offsetLeft + cardWidth;

    const maxX =  containerWidth / 2 - cardWidth / 2;
    const minX =  containerWidth / 2 - trackWidth + cardWidth / 2;
    boundsRef.current = { min: minX, max: maxX };

    if (!initializedRef.current) {
      xRef.current = maxX;
      initializedRef.current = true;
      trackRef.current.style.transform = `translateX(${xRef.current}px)`;
    }
  };

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const handleSeek = (fraction: number) => {
    const { min, max } = boundsRef.current;
    xRef.current = max - fraction * (max - min);
    momentumRef.current = 0;
  };

  useAnimationFrame((_, delta) => {
    if (!isInViewRef.current || !trackRef.current || !containerRef.current) return;
    const { min, max } = boundsRef.current;
    const dt = Math.min(delta, 100);

    if (!isDraggingRef.current) {
      const isAtEnd = xRef.current <= min + 1;
      if (!isAtEnd) {
        xRef.current -= (45 * dt) / 1000;
        xRef.current += momentumRef.current * dt;
        momentumRef.current *= Math.pow(0.88, dt / 16);
        if (Math.abs(momentumRef.current) < 0.001) momentumRef.current = 0;
      }
    }

    // Clamp — hard stop, no loop
    xRef.current = Math.max(min, Math.min(max, xRef.current));
    trackRef.current.style.transform = `translateX(${xRef.current}px)`;

    // Scrubber pip + trail
    const progress = max === min ? 0 : (max - xRef.current) / (max - min);
    if (pipRef.current)   pipRef.current.style.left   = `${(progress * 100).toFixed(2)}%`;
    if (trailRef.current) trailRef.current.style.width = `${(progress * 100).toFixed(2)}%`;

    // Timeline icons — fade by proximity to pip
    const n = CARDS.length - 1;
    iconRefs.current.forEach((el, i) => {
      if (!el) return;
      const iconProgress = i / n;
      const dist = Math.abs(progress - iconProgress);
      const proximity = Math.max(0, 1 - Math.pow(dist / PROXIMITY_RADIUS, 2));
      el.style.opacity = (proximity * 0.95).toFixed(3);
    });

    // Blur-proximity on cards
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const activationRadius = 380;
    trackRef.current.querySelectorAll<HTMLElement>('[data-card]').forEach(el => {
      const rect = el.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      const proximity = Math.max(0, 1 - Math.pow(dist / activationRadius, 2));
      el.style.filter  = `blur(${((1 - proximity) * 6).toFixed(2)}px)`;
      el.style.opacity = (0.2 + proximity * 0.8).toFixed(3);
    });

    // "The Present" glow
    const lastCardEl = trackRef.current.querySelector<HTMLElement>('[data-last-card]');
    if (lastCardEl) {
      const isAtEnd = xRef.current <= min + 2;
      if (isAtEnd) {
        const pulse = Math.sin(Date.now() / 700) * 0.5 + 0.5;
        const glow  = 10 + pulse * 16;
        const bOpacity = Math.round(55 + pulse * 55).toString(16).padStart(2, '0');
        lastCardEl.style.boxShadow  = `0 0 ${glow}px ${AMETHYST}55, inset 0 0 ${glow / 2}px ${AMETHYST}22`;
        lastCardEl.style.borderColor = `${AMETHYST}${bOpacity}`;
      } else {
        lastCardEl.style.boxShadow   = 'none';
        lastCardEl.style.borderColor = 'rgba(255,255,255,0.07)';
      }
    }
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragLastXRef.current  = e.clientX;
    dragLastTimeRef.current = e.timeStamp;
    momentumRef.current   = 0;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragLastXRef.current;
    const dt = e.timeStamp - dragLastTimeRef.current;
    xRef.current += dx;
    if (dt > 0) momentumRef.current = dx / dt;
    dragLastXRef.current  = e.clientX;
    dragLastTimeRef.current = e.timeStamp;
  };
  const onPointerUp = () => { isDraggingRef.current = false; setIsDragging(false); };

  return (
    <div ref={sectionRef}>
      <TimelineScrubber
        spineRef={spineRef}
        pipRef={pipRef}
        trailRef={trailRef}
        iconRefs={iconRefs}
        onSeek={handleSeek}
      />
      <div
        ref={containerRef}
        className={`overflow-hidden py-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDragStart={e => e.preventDefault()}
      >
        <div ref={trackRef} className="flex gap-5 w-max select-none">
          {CARDS.map((card, i) => (
            <TimelineCard key={i} card={card} isLast={i === CARDS.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Bridge Copy ──────────────────────────────────────────────────────────────

function BridgeParagraph({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <motion.p
      ref={ref}
      className="font-sans text-lg text-gray-400 leading-[1.8]"
      initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.9, ease: 'easeOut', delay }}
    >
      {children}
    </motion.p>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function TimelessAnchorSectionV2() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  return (
    <section className="relative py-24 md:py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={headerRef} className="text-center mb-14">
          <motion.h2
            className="font-display text-3xl md:text-4xl font-normal text-white mb-4"
            initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
            animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          >
            It has a thousand names.
          </motion.h2>
          <motion.p
            className="font-sans text-lg text-gray-500 max-w-md mx-auto"
            initial={{ opacity: 0, y: 32 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.12 }}
          >
            They used different words. They arrived at the same place.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto mt-0 space-y-8">
          <BridgeParagraph>Before language, this was a survival tool.</BridgeParagraph>
          <BridgeParagraph>When ordinary capacity wasn't enough, evolution gave us another gear.</BridgeParagraph>
          <BridgeParagraph>Once survival stopped being the only game, we found it again — by choice.</BridgeParagraph>
          <BridgeParagraph>Every civilization that pushed human performance to its edge ended up in the same place.</BridgeParagraph>
          <BridgeParagraph>Different directions, different words, same coordinates.</BridgeParagraph>
        </div>
      </div>

      <ScrollingCarousel />

      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto mt-16 space-y-8">
          <BridgeParagraph>That doesn't happen by accident.</BridgeParagraph>
          <BridgeParagraph>The state is real, and it's not tied to any tradition — it's in the biology.</BridgeParagraph>
          <BridgeParagraph>Most of what we used to orient by hasn't kept pace.</BridgeParagraph>
          <BridgeParagraph>When the ground moves that fast, 200,000 years of evidence starts to mean something.</BridgeParagraph>
          <BridgeParagraph>The conditions that unlock it are knowable.</BridgeParagraph>
          <motion.p
            className="font-sans text-lg text-gray-300 leading-[1.8]"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <motion.span
              className="bg-clip-text text-transparent"
              style={{ display: 'inline-block', backgroundImage: GRADIENTS.textAccent }}
              animate={{
                filter: [
                  'drop-shadow(0 0 5px rgba(232,69,53,0.55)) drop-shadow(0 0 14px rgba(232,69,53,0.22))',
                  'drop-shadow(0 0 5px rgba(62,111,163,0.65)) drop-shadow(0 0 14px rgba(62,111,163,0.28))',
                  'drop-shadow(0 0 5px rgba(232,69,53,0.55)) drop-shadow(0 0 14px rgba(232,69,53,0.22))',
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              FourFlowOS
            </motion.span>
            {' '}is built on that.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
