/**
 * FourFlowOS Design Tokens — single source of truth.
 *
 * Consumed by BOTH tailwind.config.ts (utility classes) and component code
 * (Framer Motion props, canvas/SVG, inline styles). Edit here, never inline.
 *
 * Palette + gradients live in ./brand-colors.ts (re-exported below).
 * Ratified June 12, 2026: dark palette + DM Sans / Cormorant Garamond
 * (see brand/BRAND_BIBLE.md in the parent repo).
 */

import { CORAL, SAGE, STEEL, AMETHYST, BRAND_COLORS } from './brand-colors';

export {
  CORAL, SAGE, STEEL, AMETHYST,
  GRADIENTS, PILLAR_COLORS, BRAND_COLORS, getPillarColor,
} from './brand-colors';
export type { PillarType } from './brand-colors';

// ─── Surfaces (dark ground) ───────────────────────────────────────────────────
// The site is dark-first. `ground` = page surfaces; the legacy light
// `background` token (#F5F5F5) remains in Tailwind for /train only.
export const GROUND = {
  DEFAULT: '#0a0a0a',  // the canvas — most pages
  deep:    '#050505',  // the void — landing sections
  lift:    '#111111',  // raised surfaces
} as const;

// ─── Tailwind color tokens ────────────────────────────────────────────────────
// Imported by tailwind.config.ts — the one place utility colors come from.
export const TAILWIND_COLORS = {
  self: {
    DEFAULT: BRAND_COLORS.pillars.self.primary,
    light: BRAND_COLORS.pillars.self.light,
    dark: BRAND_COLORS.pillars.self.dark,
  },
  space: {
    DEFAULT: BRAND_COLORS.pillars.space.primary,
    light: BRAND_COLORS.pillars.space.light,
    dark: BRAND_COLORS.pillars.space.dark,
  },
  story: {
    DEFAULT: BRAND_COLORS.pillars.story.primary,
    light: BRAND_COLORS.pillars.story.light,
    dark: BRAND_COLORS.pillars.story.dark,
  },
  spirit: {
    DEFAULT: BRAND_COLORS.pillars.spirit.primary,
    light: BRAND_COLORS.pillars.spirit.light,
    dark: BRAND_COLORS.pillars.spirit.dark,
  },
  neutral: {
    DEFAULT: '#333333',
    light: '#666666',
    dark: '#1A1A1A',
  },
  // Legacy light surface — used by /train (TrainingApp). Do not repoint.
  background: {
    DEFAULT: '#F5F5F5',
    light: '#FFFFFF',
    dark: '#E8E8E8',
  },
  ground: GROUND,
} as const;

// ─── Type scale ───────────────────────────────────────────────────────────────
// Audited from actual landing/tool usage (Tailwind defaults stay available).
// display = Cormorant headlines; the rest = DM Sans.
export const TYPE_SCALE = {
  display: ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],   // 60px — hero
  h1:      ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.02em' }],  // 48px — section headers
  h2:      ['1.875rem',{ lineHeight: '1.2' }],                             // 30px — section headers (mobile) / card titles
  body:    ['1rem',    { lineHeight: '1.6' }],                             // 16px
  caption: ['0.8125rem', { lineHeight: '1.4' }],                           // 13px — labels
  micro:   ['0.6875rem', { lineHeight: '1.3' }],                           // 11px — whispers, metadata
} as const;

// ─── Motion ───────────────────────────────────────────────────────────────────
// Durations in ms (Tailwind/CSS) and seconds (Framer Motion).
export const DURATION_MS = {
  instant: 100,
  fast: 150,
  base: 200,
  gentle: 300,
  slow: 500,
  drift: 700,
  reveal: 900,   // section/scroll reveals
  breath: 6000,  // one conscious breath — ambient loops
} as const;

export const DURATION_S = Object.fromEntries(
  Object.entries(DURATION_MS).map(([k, v]) => [k, v / 1000]),
) as Record<keyof typeof DURATION_MS, number>;

// The house easing curve (material standard) — used across section animations.
export const EASE_FLOW = [0.4, 0, 0.2, 1] as [number, number, number, number];
export const EASE_FLOW_CSS = 'cubic-bezier(0.4, 0, 0.2, 1)';

// ─── Glow ─────────────────────────────────────────────────────────────────────
// The recurring soft-glow patterns, parameterized. `intensity` 0–1.
export function glowFilter(color: string, intensity = 0.55, radius = 5): string {
  const alpha = Math.round(intensity * 255).toString(16).padStart(2, '0');
  return `drop-shadow(0 0 ${radius}px ${color}${alpha})`;
}

export function glowShadow(color: string, intensity = 0.55, radius = 10): string {
  const alpha = Math.round(intensity * 255).toString(16).padStart(2, '0');
  return `0 0 ${radius}px ${color}${alpha}`;
}

// ─── Radius reference (matches Tailwind defaults in use) ─────────────────────
// rounded-lg 8px · rounded-xl 12px · rounded-2xl 16px (cards/tool shell) ·
// rounded-3xl 24px · rounded-full pill. Use Tailwind classes; these constants
// exist for canvas/SVG code that needs the same numbers.
export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 24 } as const;

// ─── CSS variables ────────────────────────────────────────────────────────────
// Emitted at :root by the Tailwind plugin in tailwind.config.ts, for raw
// CSS/SVG spots that can't import this file.
export const CSS_VARS: Record<string, string> = {
  '--color-self': CORAL,
  '--color-space': SAGE,
  '--color-story': STEEL,
  '--color-spirit': AMETHYST,
  '--ground': GROUND.DEFAULT,
  '--ground-deep': GROUND.deep,
  '--ground-lift': GROUND.lift,
  '--duration-fast': `${DURATION_MS.fast}ms`,
  '--duration-base': `${DURATION_MS.base}ms`,
  '--duration-gentle': `${DURATION_MS.gentle}ms`,
  '--duration-slow': `${DURATION_MS.slow}ms`,
  '--ease-flow': EASE_FLOW_CSS,
};
