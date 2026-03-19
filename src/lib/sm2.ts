import type { Quality, MechanicReview } from '@/types/training';

/**
 * SM-2 spaced repetition algorithm.
 *
 * Quality scale:
 *   0 = Missed (complete blackout)
 *   1 = Missed (wrong, but remembered on seeing answer)
 *   2 = Missed (barely remembered after hint)
 *   3 = Got it (correct but hesitant)
 *   4 = Got it (correct after brief pause)
 *   5 = Nailed it (perfect, instant recall)
 *
 * UI mapping: Missed → 1 | Got it → 3 | Nailed it → 5
 */
export function sm2Update(
  card: Pick<MechanicReview, 'ease_factor' | 'interval_days' | 'repetitions'>,
  quality: Quality
): Pick<MechanicReview, 'ease_factor' | 'interval_days' | 'repetitions' | 'next_review_at' | 'last_quality'> {
  let { ease_factor, interval_days, repetitions } = card;

  if (quality >= 3) {
    // Correct response — advance interval
    if (repetitions === 0) {
      interval_days = 1;
    } else if (repetitions === 1) {
      interval_days = 6;
    } else {
      interval_days = Math.round(interval_days * ease_factor);
    }
    repetitions += 1;
    // Ease factor update: increases for high quality, decreases for low
    ease_factor = Math.max(1.3, ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    // Incorrect response — reset streak, review tomorrow
    repetitions = 0;
    interval_days = 1;
    // Ease factor decreases on failure
    ease_factor = Math.max(1.3, ease_factor - 0.2);
  }

  const next_review_at = new Date(Date.now() + interval_days * 24 * 60 * 60 * 1000).toISOString();

  return {
    ease_factor,
    interval_days,
    repetitions,
    next_review_at,
    last_quality: quality,
  };
}

/**
 * Returns the display label and mapped quality for the 3-button UI.
 */
export const RATING_BUTTONS = [
  { label: 'Missed', quality: 1 as Quality, description: "Didn't recall it" },
  { label: 'Got it', quality: 3 as Quality, description: 'Recalled with effort' },
  { label: 'Nailed it', quality: 5 as Quality, description: 'Instant recall' },
] as const;
