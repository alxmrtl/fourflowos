'use client';

import Image from 'next/image';
import { GRADIENTS } from '@/styles/tokens';
import { getToolMeta } from '@/components/lab/sections-data';
import type { ToolId } from '@/components/lab/useLabState';

/**
 * The shared frame every practice tool renders inside — in the FlowLab
 * activity window and on standalone /tools/* routes alike. Owns the header
 * (icon, name, one-line purpose, Keys-trained chips) and the four-dimension
 * hairline. Tools never render their own headers.
 */

interface ToolShellProps {
  toolId: ToolId;
  children: React.ReactNode;
  /** Standalone routes render full-page (no rounded border). */
  standalone?: boolean;
  className?: string;
}

function ToolShellRoot({ toolId, children, standalone = false, className = '' }: ToolShellProps) {
  const meta = getToolMeta(toolId);

  const PADDING_CLASS = {
    none: '',
    normal: 'p-6 md:p-8',
    compact: 'p-4 lg:p-5',
  } as const;

  return (
    <div
      className={
        standalone
          ? `min-h-screen bg-ground text-white flex flex-col ${className}`
          : `border border-white/[0.07] rounded-2xl overflow-hidden ${className}`
      }
    >
      {meta && (
        <>
          <div className={`flex items-center gap-3 px-5 py-4 ${standalone ? 'pl-[68px] md:pl-6 max-w-5xl mx-auto w-full' : ''}`}>
            <div className="relative w-6 h-6 flex-shrink-0 opacity-85">
              <Image src={meta.iconSrc} alt={meta.label} fill className="object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white leading-none tracking-tight">{meta.label}</h2>
              <p className="text-[11px] text-white/45 mt-0.5 leading-tight">{meta.description}</p>
            </div>
            {meta.keysTrained && (
              <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                {meta.keysTrained.map(key => (
                  <span
                    key={key.name}
                    className="text-[10px] font-medium tracking-wide px-2 py-1 rounded-full border leading-none whitespace-nowrap"
                    style={{
                      color: key.color,
                      borderColor: `${key.color}40`,
                      background: `${key.color}10`,
                    }}
                    title={`Trains the ${key.name} Key`}
                  >
                    {key.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="h-px" style={{ background: GRADIENTS.fourPillar, opacity: 0.3 }} />
        </>
      )}
      <div className={`${standalone ? 'flex-1 flex flex-col' : ''} ${meta ? PADDING_CLASS[meta.padding] : ''}`}>
        {children}
      </div>
    </div>
  );
}

// ─── Standard states ──────────────────────────────────────────────────────────

/** Consistent empty state: icon, one or two lines, optional CTA. */
function Empty({
  iconSrc,
  title,
  body,
  cta,
}: {
  iconSrc?: string;
  title: string;
  body?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6">
      {iconSrc && (
        <div className="relative w-10 h-10 mb-4 opacity-60">
          <Image src={iconSrc} alt="" fill className="object-contain" />
        </div>
      )}
      <p className="text-sm text-white/80 font-medium">{title}</p>
      {body && <p className="text-[13px] text-white/45 mt-2 max-w-sm leading-relaxed">{body}</p>}
      {cta && <div className="mt-6">{cta}</div>}
    </div>
  );
}

/** Consistent loading state: accent-colored spinner + whisper line. */
function Loading({ color = '#ffffff', label }: { color?: string; label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className="w-5 h-5 rounded-full border-2 animate-spin"
        style={{ borderColor: `${color}30`, borderTopColor: color }}
      />
      {label && <p className="text-[11px] text-white/40 tracking-wide">{label}</p>}
    </div>
  );
}

/** Standardized intake field wrapper: label casing + spacing. */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-white/50 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-white/30 mt-1">{hint}</span>}
    </label>
  );
}

/** Standardized text input matching the house intake style. */
function Input({
  accentColor = '#ffffff',
  className = '',
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { accentColor?: string }) {
  return (
    <input
      className={`w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors duration-base focus:border-white/30 ${className}`}
      style={{ caretColor: accentColor }}
      {...rest}
    />
  );
}

const ToolShell = Object.assign(ToolShellRoot, { Empty, Loading, Field, Input });
export default ToolShell;
