'use client';

import { WORKSHOP_DIALS } from '@/types/workshop-intake';
import type { WorkshopDial } from '@/types/workshop-intake';

const LABELS: Record<WorkshopDial, string> = {
  stuck: 'Stuck',
  turning: 'Turning',
  open: 'Open',
};

interface KeyDialProps {
  value: WorkshopDial | '';
  onChange: (value: WorkshopDial) => void;
  /** Dimension color — tints the selected segment. */
  accent: string;
}

/**
 * The key dial — a three-option segmented control (Stuck / Turning / Open),
 * mirroring the three circles on the Flow Map worksheet. Thumb-sized targets;
 * selected state carries the dimension color.
 */
export default function KeyDial({ value, onChange, accent }: KeyDialProps) {
  return (
    <div
      role="radiogroup"
      className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10"
    >
      {WORKSHOP_DIALS.map((dial) => {
        const selected = value === dial;
        return (
          <button
            key={dial}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(dial)}
            className={`py-2.5 rounded-lg text-sm font-medium transition-all duration-base ${
              selected ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
            style={
              selected
                ? {
                    background: `${accent}2e`,
                    boxShadow: `inset 0 0 0 1px ${accent}80`,
                  }
                : undefined
            }
          >
            {LABELS[dial]}
          </button>
        );
      })}
    </div>
  );
}
