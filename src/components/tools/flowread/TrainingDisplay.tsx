'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrainingMode, FontType } from './types';
import { SAGE, CORAL } from './constants';

interface TrainingDisplayProps {
  mode: TrainingMode;
  text: string;
  wpm: number;
  fontSize: number;
  fontType: FontType;
  isTraining: boolean;
  isPaused: boolean;
  onProgressUpdate: (progress: number, index: number) => void;
  onComplete: () => void;
  seekIndex?: number;
  seekVersion?: number;
}

/**
 * Calculate the Optimal Recognition Point (ORP) index for a word.
 * The ORP is where the eye naturally fixates - typically ~30% from the start.
 */
function getORPIndex(word: string): number {
  const len = word.length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

/**
 * Renders a word with ORP highlighting - the focal letter in coral color.
 */
function ORPWord({
  word,
  fontSize,
  fontFamily,
  centered = false,
}: {
  word: string;
  fontSize: number;
  fontFamily: string;
  centered?: boolean;
}) {
  const orpIndex = getORPIndex(word);
  const before = word.slice(0, orpIndex);
  const orp = word[orpIndex] || '';
  const after = word.slice(orpIndex + 1);

  if (centered) {
    return (
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily,
          height: '1.4em',
        }}
      >
        <span
          className="absolute text-white/80 whitespace-pre"
          style={{
            right: '50%',
            marginRight: '0.27em',
          }}
        >
          {before}
        </span>

        <span
          className="absolute left-1/2"
          style={{
            color: CORAL,
            transform: 'translateX(-50%)',
            fontWeight: 500,
          }}
        >
          {orp}
        </span>

        <span
          className="absolute text-white/80 whitespace-pre"
          style={{
            left: '50%',
            marginLeft: '0.27em',
          }}
        >
          {after}
        </span>
      </div>
    );
  }

  return (
    <span style={{ fontFamily }}>
      <span className="text-white/70">{before}</span>
      <span className="font-medium" style={{ color: CORAL }}>{orp}</span>
      <span className="text-white/70">{after}</span>
    </span>
  );
}

/**
 * Renders a phrase with ORP highlighting on each word.
 */
function ORPPhrase({
  phrase,
  fontSize,
  fontFamily,
}: {
  phrase: string;
  fontSize: number;
  fontFamily: string;
}) {
  const words = phrase.split(/\s+/);

  return (
    <span style={{ fontSize: `${fontSize}px` }}>
      {words.map((word, idx) => (
        <span key={idx}>
          <ORPWord word={word} fontSize={fontSize} fontFamily={fontFamily} />
          {idx < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}

export default function TrainingDisplay({
  mode,
  text,
  wpm,
  fontSize,
  fontType,
  isTraining,
  isPaused,
  onProgressUpdate,
  onComplete,
  seekIndex,
  seekVersion,
}: TrainingDisplayProps) {
  const [currentWord, setCurrentWord] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);
  const lastSeekVersionRef = useRef(0);

  const wpmRef = useRef(wpm);
  const onCompleteRef = useRef(onComplete);
  const onProgressUpdateRef = useRef(onProgressUpdate);

  useEffect(() => {
    wpmRef.current = wpm;
  }, [wpm]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  const words = useMemo(() => text.split(/\s+/).filter((w) => w.length > 0), [text]);

  const phrases = useMemo(() => {
    const result: string[] = [];
    for (let i = 0; i < words.length; i += 6) {
      result.push(words.slice(i, i + 6).join(' '));
    }
    return result;
  }, [words]);

  useEffect(() => {
    if (mode === 'word') setTotalUnits(words.length);
    else setTotalUnits(phrases.length);
  }, [mode, words.length, phrases.length]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Apply seek if a new seek signal arrived
    const incomingSeekVersion = seekVersion ?? 0;
    if (incomingSeekVersion > 0 && incomingSeekVersion !== lastSeekVersionRef.current) {
      lastSeekVersionRef.current = incomingSeekVersion;
      const targetIdx = seekIndex ?? 0;
      indexRef.current = targetIdx;
      // Update display immediately so paused state reflects the seek position
      if (mode === 'word') {
        setCurrentWord(words[targetIdx] || '');
      } else {
        setCurrentPhrase(phrases[targetIdx] || '');
      }
      const total = mode === 'word' ? words.length : phrases.length;
      const newProg = total > 0 ? targetIdx / total : 0;
      setProgress(newProg);
      setCurrentIndex(targetIdx);
      onProgressUpdateRef.current(newProg, targetIdx);
    }

    if (!isTraining || isPaused) {
      return;
    }

    // Speed ramp-up: start at 40% speed and reach full speed by word 10
    const RAMP_UP_UNITS = 10;
    const RAMP_START_RATIO = 0.4;

    const getDelay = (currentIdx: number) => {
      const targetWpm = wpmRef.current;

      let speedMultiplier = 1.0;
      if (currentIdx < RAMP_UP_UNITS) {
        const progress = currentIdx / RAMP_UP_UNITS;
        const eased = 1 - Math.pow(1 - progress, 2); // ease-out quad
        speedMultiplier = 1 / (RAMP_START_RATIO + (1 - RAMP_START_RATIO) * eased);
      }

      if (mode === 'word') {
        return (60000 / targetWpm) * speedMultiplier;
      } else {
        return ((60000 * 6) / targetWpm) * speedMultiplier;
      }
    };

    const animate = () => {
      const idx = indexRef.current;
      const total = mode === 'word' ? words.length : phrases.length;

      if (idx >= total) {
        if (timerRef.current) clearTimeout(timerRef.current);
        onCompleteRef.current();
        return;
      }

      if (mode === 'word') {
        setCurrentWord(words[idx]);
      } else {
        setCurrentPhrase(phrases[idx]);
      }

      const newProgress = (idx + 1) / total;
      setProgress(newProgress);
      setCurrentIndex(idx + 1);
      onProgressUpdateRef.current(newProgress, idx + 1);

      indexRef.current = idx + 1;

      const delay = getDelay(idx);
      timerRef.current = setTimeout(animate, delay);
    };

    animate();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTraining, isPaused, mode, words, phrases, seekVersion, seekIndex]);

  useEffect(() => {
    if (!isTraining) {
      indexRef.current = 0;
      setCurrentWord('');
      setCurrentPhrase('');
      setProgress(0);
      setCurrentIndex(0);
    }
  }, [isTraining]);

  const fontFamily = fontType === 'serif' ? 'Georgia, serif' : 'system-ui, -apple-system, sans-serif';

  if (!isTraining) {
    return null;
  }

  // Word-by-word display
  if (mode === 'word') {
    return (
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Word display */}
        <motion.div
          key={currentWord}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.03 }}
          className="w-full"
        >
          <ORPWord
            word={currentWord}
            fontSize={fontSize * 3}
            fontFamily={fontFamily}
            centered
          />
        </motion.div>

        {/* Progress */}
        <div className="mt-8 w-full max-w-xs">
          <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{
                width: `${progress * 100}%`,
                background: `linear-gradient(90deg, ${SAGE}60, ${SAGE})`,
              }}
            />
          </div>
          <p className="text-center text-xs text-gray-600 mt-3">
            {currentIndex} / {totalUnits}
          </p>
        </div>
      </div>
    );
  }

  // Phrases display
  return (
    <div className="w-full max-w-xl flex flex-col items-center">
      <motion.div
        key={currentPhrase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.08 }}
        className="text-center"
        style={{ lineHeight: 1.6 }}
      >
        <ORPPhrase
          phrase={currentPhrase}
          fontSize={fontSize * 1.8}
          fontFamily={fontFamily}
        />
      </motion.div>

      {/* Progress */}
      <div className="mt-6 w-full max-w-xs">
        <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${SAGE}60, ${SAGE})`,
            }}
          />
        </div>
        <p className="text-center text-xs text-gray-600 mt-3">
          {currentIndex} / {totalUnits}
        </p>
      </div>
    </div>
  );
}
