'use client';

import { motion } from 'framer-motion';

const STEP_COLORS = [
  '#ffffff',  // 1: Personal (white)
  '#ffffff',  // 2: Birth (white)
  '#ffffff',  // 3: Context (white)
  '#FF6F61',  // 4: Self (coral)
  '#6BA292',  // 5: Space (sage)
  '#5B84B1',  // 6: Story (steel blue)
  '#7A4DA4',  // 7: Spirit (amethyst)
  '#6BA292',  // 8: Review (gradient start)
];

const STEP_LABELS = [
  'You',
  'Birth',
  'Context',
  'Self',
  'Space',
  'Story',
  'Spirit',
  'Review',
];

interface IntakeProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function IntakeProgress({ currentStep, totalSteps }: IntakeProgressProps) {
  const progress = ((currentStep) / totalSteps) * 100;
  const currentColor = STEP_COLORS[currentStep - 1] || '#7A4DA4';

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Step label */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: currentColor === '#ffffff' ? '#a1a1aa' : currentColor }}
        >
          {STEP_LABELS[currentStep - 1]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: currentStep >= 4
              ? `linear-gradient(90deg, #FF6F61, ${currentColor})`
              : 'rgba(255,255,255,0.3)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const dotColor = STEP_COLORS[i];

          return (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: isComplete || isCurrent
                  ? dotColor === '#ffffff' ? 'rgba(255,255,255,0.5)' : dotColor
                  : 'rgba(255,255,255,0.1)',
                transform: isCurrent ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
