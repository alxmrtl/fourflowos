'use client';

const LABELS = [
  {
    name: 'Essence',
    description: 'The core truth of who you are in this area. Timeless, not situational.',
  },
  {
    name: 'Pattern',
    description: 'How that nature actually shows up — in your habits, your work, how others experience you.',
  },
  {
    name: 'Tension',
    description: "The friction that comes with your wiring here. Not a flaw. A feature of how you're built.",
  },
  {
    name: 'Direction',
    description: 'What this key is calling you toward. Your next move.',
  },
];

export default function ProfileReadingGuide() {
  return (
    <div
      className="mb-10 rounded-2xl border border-white/8 px-5 py-5"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-4">
        How to read your keys
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {LABELS.map((label) => (
          <div key={label.name}>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">
              {label.name}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">{label.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
