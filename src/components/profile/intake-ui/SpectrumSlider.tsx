'use client';

interface SpectrumSliderProps {
  labelLeft: string;
  labelRight: string;
  descLeft?: string;
  descRight?: string;
  /** The selected pole value — left value, right value, or '' (center) */
  value: string;
  valueLeft: string;
  valueRight: string;
  onChange: (value: string) => void;
  accent?: string;
}

/**
 * Visual spectrum slider between two named poles.
 * Returns one of the two pole values (or '' if exactly centered).
 * Internally uses 0–10 range: ≤4 → left, ≥6 → right, 5 → ''
 */
export default function SpectrumSlider({
  labelLeft,
  labelRight,
  descLeft,
  descRight,
  value,
  valueLeft,
  valueRight,
  onChange,
  accent = '#5B84B1',
}: SpectrumSliderProps) {
  // Map value → slider position (0–10)
  const sliderPos = value === valueLeft ? 2 : value === valueRight ? 8 : 5;
  const pct = (sliderPos / 10) * 100;

  const handleSlider = (raw: number) => {
    if (raw <= 4) onChange(valueLeft);
    else if (raw >= 6) onChange(valueRight);
    else onChange('');
  };

  const isLeft = value === valueLeft;
  const isRight = value === valueRight;

  return (
    <div className="space-y-3">
      {/* Track */}
      <div className="relative h-3 bg-white/10 rounded-full">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, backgroundColor: accent + '66' }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white/70 shadow-lg transition-all duration-150"
          style={{ left: `calc(${pct}% - 10px)`, backgroundColor: accent }}
        />
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={sliderPos}
          onChange={(e) => handleSlider(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between items-start gap-4">
        <div className={`flex-1 transition-opacity duration-200 ${isLeft ? 'opacity-100' : 'opacity-50'}`}>
          <div className="text-xs font-semibold text-white uppercase tracking-wider">{labelLeft}</div>
          {descLeft && <div className="text-xs text-gray-500 mt-0.5">{descLeft}</div>}
        </div>
        <div className={`flex-1 text-right transition-opacity duration-200 ${isRight ? 'opacity-100' : 'opacity-50'}`}>
          <div className="text-xs font-semibold text-white uppercase tracking-wider">{labelRight}</div>
          {descRight && <div className="text-xs text-gray-500 mt-0.5">{descRight}</div>}
        </div>
      </div>
    </div>
  );
}
