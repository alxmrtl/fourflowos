import { forwardRef } from 'react';

/**
 * The house card shell: hairline border, soft glass fill, 16px radius.
 * Used by tool cards, pattern selectors, modals — anywhere content sits
 * on the dark ground.
 */
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Slightly brighter fill for raised/hovered contexts. */
  lifted?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ lifted = false, className = '', children, ...rest }, ref) => (
    <div
      ref={ref}
      className={`rounded-2xl border border-white/[0.07] ${lifted ? 'bg-white/[0.04]' : 'bg-white/[0.02]'} ${className}`}
      {...rest}
    >
      {children}
    </div>
  ),
);

GlassCard.displayName = 'GlassCard';
export default GlassCard;
