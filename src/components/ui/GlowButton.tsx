'use client';

import Link from 'next/link';
import { GRADIENTS, AMETHYST } from '@/styles/tokens';

/**
 * The house CTA: pill, gradient fill, soft glow on hover.
 * `variant` picks the gradient role from tokens; `ghost` renders the
 * bordered secondary style instead.
 */
interface GlowButtonProps {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  glowColor?: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const VARIANT_GRADIENT: Record<string, string> = {
  primary: GRADIENTS.primaryCta,
  secondary: GRADIENTS.secondaryCta,
  tertiary: GRADIENTS.tertiaryCta,
};

export default function GlowButton({
  href,
  onClick,
  variant = 'primary',
  glowColor = AMETHYST,
  className = '',
  children,
  disabled = false,
  type = 'button',
}: GlowButtonProps) {
  const isGhost = variant === 'ghost';
  const base = 'font-sans inline-flex items-center justify-center gap-2 px-8 py-4 font-medium rounded-full transition-all duration-gentle';
  const ghostStyle = 'border border-white/30 text-white/80 hover:text-white hover:border-white/50 hover:bg-white/5';
  const solidStyle = 'text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100';

  const classes = `${base} ${isGhost ? ghostStyle : solidStyle} ${className}`;
  const style = isGhost
    ? undefined
    : {
        background: VARIANT_GRADIENT[variant],
        ['--tw-shadow-color' as string]: `${glowColor}33`,
        boxShadow: undefined,
      };

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} style={style}>
      {children}
    </button>
  );
}
