'use client';

interface PolaritySliderProps {
  value: number;             // 0–10
  onChange: (value: number) => void;
  labelLeft: string;
  labelRight: string;
  accent?: string;
  className?: string;
}

export default function PolaritySlider({
  value,
  onChange,
  labelLeft,
  labelRight,
  accent = '#7A4DA4',
  className = '',
}: PolaritySliderProps) {
  const pct = (value / 10) * 100;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative h-2 bg-white/10 rounded-full">
        {/* Filled track */}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, backgroundColor: accent + '88' }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white/70 transition-all duration-150"
          style={{ left: `calc(${pct}% - 8px)`, backgroundColor: accent }}
        />
        {/* Native range (invisible, on top for interaction) */}
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{labelLeft}</span>
        <span>{labelRight}</span>
      </div>
    </div>
  );
}
