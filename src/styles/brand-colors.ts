/**
 * FourFlowOS Brand Colors
 * Centralized color definitions for consistent branding across the website
 */

export const BRAND_COLORS = {
  // The Four Pillars
  pillars: {
    self: {
      primary: '#FF6F61',
      dark: '#E64A45',
      light: '#FF8A80',
      rgb: '255, 111, 97',
    },
    space: {
      primary: '#6BA292',
      dark: '#517D63',
      light: '#8FC4B0',
      rgb: '107, 162, 146',
    },
    story: {
      primary: '#5B84B1',
      dark: '#3B4F71',
      light: '#7DA3C9',
      rgb: '91, 132, 177',
    },
    spirit: {
      primary: '#7A4DA4',
      dark: '#5E3570',
      light: '#9A6DC4',
      rgb: '122, 77, 164',
    },
  },

  // Neutral Colors
  neutral: {
    charcoal: '#333333',
    ivory: '#F5F5F5',
    dark: '#0a0a0a',
    darker: '#050505',
    gray: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
  },

  // Gradients
  gradients: {
    fourPillars: 'linear-gradient(90deg, #FF6F61, #6BA292, #5B84B1, #7A4DA4)',
    selfToSpirit: 'linear-gradient(90deg, #FF6F61, #7A4DA4)',
    selfToSpace: 'linear-gradient(90deg, #FF6F61, #6BA292)',
    storyToSpirit: 'linear-gradient(90deg, #5B84B1, #7A4DA4)',
    radialGlow: 'radial-gradient(circle, rgba(122, 77, 164, 0.15) 0%, transparent 70%)',
  },

  // Tailwind-compatible class strings
  tailwind: {
    self: {
      bg: 'bg-[#FF6F61]',
      text: 'text-[#FF6F61]',
      border: 'border-[#FF6F61]',
      bgLight: 'bg-[#FF6F61]/10',
    },
    space: {
      bg: 'bg-[#6BA292]',
      text: 'text-[#6BA292]',
      border: 'border-[#6BA292]',
      bgLight: 'bg-[#6BA292]/10',
    },
    story: {
      bg: 'bg-[#5B84B1]',
      text: 'text-[#5B84B1]',
      border: 'border-[#5B84B1]',
      bgLight: 'bg-[#5B84B1]/10',
    },
    spirit: {
      bg: 'bg-[#7A4DA4]',
      text: 'text-[#7A4DA4]',
      border: 'border-[#7A4DA4]',
      bgLight: 'bg-[#7A4DA4]/10',
    },
  },
} as const;

// Helper function to get pillar color by dimension ID
export const getPillarColor = (pillar: 'self' | 'space' | 'story' | 'spirit') => {
  return BRAND_COLORS.pillars[pillar].primary;
};

// Helper function to get gradient between two pillars
export const getPillarGradient = (from: string, to: string) => {
  return `linear-gradient(90deg, ${from}, ${to})`;
};

// Animation timing for zen/meditative feel
export const ANIMATION_TIMING = {
  breathing: '8s ease-in-out infinite',
  slowSpin: '30s linear infinite',
  slowPulse: '4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  floatingOrb: '25s ease-in-out infinite',
  gradientShift: '20s linear infinite',
} as const;

// Typography scale
export const TYPOGRAPHY = {
  fonts: {
    heading: 'Inter, system-ui, -apple-system, sans-serif',
    body: 'Inter, system-ui, -apple-system, sans-serif',
  },
  sizes: {
    hero: 'text-5xl md:text-7xl lg:text-8xl',
    h1: 'text-4xl md:text-5xl lg:text-6xl',
    h2: 'text-3xl md:text-4xl',
    h3: 'text-2xl md:text-3xl',
    body: 'text-base md:text-lg',
    small: 'text-sm',
  },
} as const;

export type PillarType = keyof typeof BRAND_COLORS.pillars;
