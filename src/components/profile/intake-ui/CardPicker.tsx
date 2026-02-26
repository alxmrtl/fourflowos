'use client';

export interface CardOption {
  value: string;
  title: string;
  description: string;
  emoji?: string;
}

interface CardPickerProps {
  options: CardOption[];
  selected: string;
  onChange: (value: string) => void;
  accent?: string;
  columns?: 2 | 4;
  className?: string;
}

export default function CardPicker({
  options,
  selected,
  onChange,
  accent = '#7A4DA4',
  columns = 2,
  className = '',
}: CardPickerProps) {
  const gridClass = columns === 4
    ? 'grid-cols-2 md:grid-cols-4'
    : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className={`grid ${gridClass} gap-3 ${className}`}>
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              relative text-left p-4 rounded-xl border transition-all duration-200
              ${isSelected
                ? 'text-white'
                : 'bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/25 hover:text-gray-200'
              }
            `}
            style={
              isSelected
                ? { backgroundColor: accent + '1A', borderColor: accent + '55' }
                : {}
            }
          >
            {isSelected && (
              <span
                className="absolute top-3 right-3 w-2 h-2 rounded-full"
                style={{ backgroundColor: accent }}
              />
            )}
            {opt.emoji && (
              <div className="text-xl mb-2">{opt.emoji}</div>
            )}
            <div className="font-medium text-sm mb-1"
              style={isSelected ? { color: '#fff' } : {}}>
              {opt.title}
            </div>
            <div className="text-xs leading-relaxed text-gray-500">
              {opt.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
