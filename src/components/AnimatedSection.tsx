'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** Amount of element that must be visible to trigger (0-1). Default 0.3 = 30% */
  threshold?: number;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Stagger children animations */
  staggerChildren?: number;
  /** Custom variants - if provided, overrides defaults */
  variants?: Variants;
  /** Direction to animate from: 'up', 'down', 'left', 'right', or 'none' */
  from?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Distance to animate in pixels */
  distance?: number;
  /** Whether to use blur effect */
  blur?: boolean;
  /** HTML element to render as */
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main';
  /** Additional style */
  style?: React.CSSProperties;
}

/**
 * AnimatedSection - Bidirectional scroll animation wrapper
 *
 * Fades in when entering viewport, fades out when leaving.
 * Works perpetually on scroll up/down.
 */
export default function AnimatedSection({
  children,
  className = '',
  threshold = 0.3,
  delay = 0,
  duration = 0.6,
  staggerChildren,
  variants,
  from = 'up',
  distance = 40,
  blur = true,
  as = 'div',
  style,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: threshold,
    // No 'once: true' - this is the key change!
  });

  // Calculate transform based on direction
  const getTransform = () => {
    switch (from) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      case 'none': return {};
      default: return { y: distance };
    }
  };

  // Default variants with configurable properties
  const defaultVariants: Variants = {
    hidden: {
      opacity: 0,
      ...getTransform(),
      ...(blur ? { filter: 'blur(10px)' } : {}),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        delay,
        ease: 'easeOut',
        ...(staggerChildren ? {
          staggerChildren,
          delayChildren: delay,
        } : {}),
      },
    },
  };

  const Component = motion[as];

  return (
    <Component
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants || defaultVariants}
    >
      {children}
    </Component>
  );
}

/**
 * Preset variants for child elements to use with staggerChildren
 */
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(8px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const fadeLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
    filter: 'blur(8px)'
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const fadeRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
    filter: 'blur(8px)'
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const scaleUpVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(8px)'
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};
