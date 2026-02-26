'use client';

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
}

interface ForcedChoicePairProps {
  optionA: ChoiceOption;
  optionB: ChoiceOption;
  selected: string;
  onChange: (value: string) => void;
  accent?: string;
  className?: string;
}

export default function ForcedChoicePair({
  optionA,
  optionB,
  selected,
  onChange,
  accent = '#7A4DA4',
  className = '',
}: ForcedChoicePairProps) {
  const btn = (opt: ChoiceOption) => {
    const isSelected = selected === opt.value;
    return (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`
          flex-1 text-left p-4 rounded-xl border transition-all duration-200
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
        <div className="font-semibold text-sm mb-0.5"
          style={isSelected ? { color: '#fff' } : {}}>
          {opt.label}
        </div>
        {opt.description && (
          <div className="text-xs text-gray-500 leading-relaxed">{opt.description}</div>
        )}
      </button>
    );
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      {btn(optionA)}
      <div className="flex items-center text-gray-600 text-xs font-medium self-center px-0.5">or</div>
      {btn(optionB)}
    </div>
  );
}
