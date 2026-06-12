'use client';

import { motion } from 'framer-motion';
import { GRADIENTS } from '@/styles/tokens';

/**
 * The house section header: Cormorant display headline with an optional
 * gradient-italic emphasis span, blur-reveal on scroll into view.
 * Every landing section re-implemented this; now it lives once.
 */
interface SectionHeadingProps {
  /** Plain part of the headline (before the emphasis). */
  children: React.ReactNode;
  /** Gradient-italic emphasized phrase, rendered after `children`. */
  emphasis?: string;
  /** Trailing punctuation after the emphasis (default "."). */
  punctuation?: string;
  gradient?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export default function SectionHeading({
  children,
  emphasis,
  punctuation = '.',
  gradient = GRADIENTS.textWide,
  className = '',
  as = 'h2',
}: SectionHeadingProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={`text-center font-display text-3xl md:text-5xl font-normal text-white leading-[1.15] ${className}`}
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
      {emphasis && (
        <>
          {' '}
          <span
            className="italic bg-clip-text text-transparent"
            style={{ backgroundImage: gradient }}
          >
            {emphasis}
          </span>
          {punctuation}
        </>
      )}
    </Tag>
  );
}
