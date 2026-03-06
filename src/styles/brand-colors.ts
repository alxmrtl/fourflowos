/**
 * FourFlowOS Brand Colors — Single Source of Truth
 *
 * To pivot the entire color palette: edit the 4 hex constants below.
 * To pivot gradient design: edit the GRADIENTS object below.
 * Everything else (components, tools) derives from these.
 */

// ─── Pillar Colors ────────────────────────────────────────────────────────────
// Edit these 4 values to shift the whole brand palette.
export const CORAL    = '#E84535';  // SELF    (was #FF6F61)
export const SAGE     = '#4E8C73';  // SPACE   (was #6BA292)
export const STEEL    = '#3E6FA3';  // STORY   (was #5B84B1)
export const AMETHYST = '#6330A0';  // SPIRIT  (was #7A4DA4)

// ─── Gradient Roles ───────────────────────────────────────────────────────────
// Named by function, not color. Change values here to pivot gradient design.
// All consume the pillar constants above — one edit propagates everywhere.
export const GRADIENTS = {
  // CTA buttons
  primaryCta:   `linear-gradient(135deg, ${STEEL}, ${AMETHYST})`,    // main CTAs — steel leads, confident
  secondaryCta: `linear-gradient(135deg, ${STEEL}, ${CORAL})`,       // alternate — cool to warm
  tertiaryCta:  `linear-gradient(135deg, ${SAGE}, ${STEEL})`,        // form/intake — grounded, cool

  // Text highlights (use as backgroundImage with bg-clip-text)
  textAccent:   `linear-gradient(90deg, ${CORAL}, ${STEEL})`,        // fire→ice, high contrast
  textWide:     `linear-gradient(90deg, ${CORAL}, ${SAGE}, ${STEEL}, ${AMETHYST})`, // full spectrum
  textBlue:     `linear-gradient(90deg, ${STEEL}, ${AMETHYST})`,     // blue-to-purple variant
  textGreen:    `linear-gradient(90deg, ${SAGE}, ${AMETHYST})`,      // green-to-purple variant

  // Decorative
  fourPillar:   `linear-gradient(90deg, ${CORAL}, ${SAGE}, ${STEEL}, ${AMETHYST})`,
  fourPillarV:  `linear-gradient(135deg, ${CORAL}, ${SAGE}, ${STEEL}, ${AMETHYST})`,

  // Ambient glows (radial)
  selfGlow:     `radial-gradient(circle, ${CORAL}26, transparent 70%)`,
  spiritGlow:   `radial-gradient(circle, ${AMETHYST}26, transparent 70%)`,
  sageGlow:     `radial-gradient(circle, ${SAGE}26, transparent 70%)`,
  steelGlow:    `radial-gradient(circle, ${STEEL}26, transparent 70%)`,
} as const;

// ─── Pillar Color Array ───────────────────────────────────────────────────────
// Ordered: SELF, SPACE, STORY, SPIRIT
export const PILLAR_COLORS = [CORAL, SAGE, STEEL, AMETHYST] as const;

// ─── BRAND_COLORS object (structured reference) ───────────────────────────────
export const BRAND_COLORS = {
  pillars: {
    self:   { primary: CORAL,    dark: '#C4311F', light: '#F05A49', rgb: '232, 69, 53' },
    space:  { primary: SAGE,     dark: '#37634F', light: '#6AAF8E', rgb: '78, 140, 115' },
    story:  { primary: STEEL,    dark: '#2B5080', light: '#5A8DC2', rgb: '62, 111, 163' },
    spirit: { primary: AMETHYST, dark: '#461F78', light: '#8248C8', rgb: '99, 48, 160' },
  },
  neutral: {
    charcoal: '#333333',
    ivory: '#F5F5F5',
    dark: '#0a0a0a',
    darker: '#050505',
  },
} as const;

export type PillarType = 'self' | 'space' | 'story' | 'spirit';

export const getPillarColor = (pillar: PillarType) => BRAND_COLORS.pillars[pillar].primary;
