'use client';

interface KeywordPickerProps {
  words: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  accent?: string;
  /** Optional min selection for visual nudge (not a hard block) */
  minSuggest?: number;
  /** Optional max selection (enforced) */
  max?: number;
  className?: string;
}

export default function KeywordPicker({
  words,
  selected,
  onChange,
  accent = '#6330A0',
  max,
  className = '',
}: KeywordPickerProps) {
  const toggle = (word: string) => {
    if (selected.includes(word)) {
      onChange(selected.filter((w) => w !== word));
    } else {
      if (max && selected.length >= max) return;
      onChange([...selected, word]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {words.map((word) => {
        const isSelected = selected.includes(word);
        return (
          <button
            key={word}
            type="button"
            onClick={() => toggle(word)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${isSelected
                ? 'text-white border-transparent scale-[1.02]'
                : 'text-gray-400 bg-white/[0.04] border border-white/10 hover:border-white/25 hover:text-gray-200'
              }
            `}
            style={
              isSelected
                ? { backgroundColor: accent + '33', border: `1px solid ${accent}66`, color: '#fff' }
                : {}
            }
          >
            {word}
          </button>
        );
      })}
    </div>
  );
}
