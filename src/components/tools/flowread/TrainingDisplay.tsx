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
}

/**
 * Calculate the Optimal Recognition Point (ORP) index for a word.
 * The ORP is where the eye naturally fixates - typically ~30% from the start.
 * Based on Spritz reading research.
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
 * For centered mode: uses absolute positioning so the ORP is ALWAYS at the exact center.
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
    // Absolute positioning approach:
    // - ORP letter is fixed at exact center (left: 50%, translateX: -50%)
    // - "before" text ends at the ORP (right: 50%, with padding for half ORP width)
    // - "after" text starts after the ORP (left: 50%, with padding for half ORP width)
    return (
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily,
          height: '1.4em',
        }}
      >
        {/* Before: absolutely positioned, right edge at center minus half ORP width */}
        <span
          className="absolute text-white/90 whitespace-pre"
          style={{
            right: '50%',
            marginRight: '0.27em', // half-width of ORP letter
          }}
        >
          {before}
        </span>

        {/* ORP letter: absolutely positioned at exact center */}
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

        {/* After: absolutely positioned, left edge at center plus half ORP width */}
        <span
          className="absolute text-white/90 whitespace-pre"
          style={{
            left: '50%',
            marginLeft: '0.27em', // half-width of ORP letter
          }}
        >
          {after}
        </span>
      </div>
    );
  }

  // For phrases mode: inline rendering
  return (
    <span style={{ fontFamily }}>
      <span className="text-white/80">{before}</span>
      <span className="font-semibold" style={{ color: CORAL }}>{orp}</span>
      <span className="text-white/80">{after}</span>
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
}: TrainingDisplayProps) {
  const [currentWord, setCurrentWord] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use refs for values that change but shouldn't restart the animation
  const wpmRef = useRef(wpm);
  const onCompleteRef = useRef(onComplete);
  const onProgressUpdateRef = useRef(onProgressUpdate);

  // Keep refs updated
  useEffect(() => {
    wpmRef.current = wpm;
  }, [wpm]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  // Memoize parsed text to prevent recreating on every render
  const words = useMemo(() => text.split(/\s+/).filter((w) => w.length > 0), [text]);

  // Create phrases (6 words each)
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

  // Animate training
  useEffect(() => {
    if (!isTraining || isPaused) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const getDelay = () => {
      const currentWpm = wpmRef.current;
      if (mode === 'word') {
        // ms per word
        return 60000 / currentWpm;
      } else {
        // 6 words per phrase
        return (60000 * 6) / currentWpm;
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

      // Update display
      if (mode === 'word') {
        setCurrentWord(words[idx]);
      } else {
        setCurrentPhrase(phrases[idx]);
      }

      // Update progress
      const newProgress = (idx + 1) / total;
      setProgress(newProgress);
      setCurrentIndex(idx + 1);
      onProgressUpdateRef.current(newProgress, idx + 1);

      indexRef.current = idx + 1;

      // Schedule next with current delay
      const delay = getDelay();
      timerRef.current = setTimeout(animate, delay);
    };

    // Start animation
    animate();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTraining, isPaused, mode, words, phrases]);

  // Reset on training stop
  useEffect(() => {
    if (!isTraining) {
      indexRef.current = 0;
      setCurrentWord('');
      setCurrentPhrase('');
      setProgress(0);
      setCurrentIndex(0);
    }
  }, [isTraining]);

  const fontFamily = fontType === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif';

  // Word-by-word display with ORP
  if (mode === 'word') {
    return (
      <div
        ref={containerRef}
        className="relative rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="absolute top-0 left-4 right-4 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${SAGE}40, transparent)` }}
        />

        {!isTraining ? (
          <p className="text-gray-600 text-center">Press Start to begin training</p>
        ) : (
          <>
            {/* Word display - ORP letter is always at exact center */}
            <motion.div
              key={currentWord}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.03 }}
              className="w-full max-w-2xl"
            >
              <ORPWord
                word={currentWord}
                fontSize={fontSize * 2.5}
                fontFamily={fontFamily}
                centered
              />
            </motion.div>

            <div className="mt-12 w-full max-w-xs">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{ width: `${progress * 100}%`, background: SAGE }}
                />
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">
                {currentIndex} / {totalUnits}
              </p>
            </div>
          </>
        )}
      </div>
    );
  }

  // Phrases display with ORP highlighting
  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center"
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="absolute top-0 left-4 right-4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${SAGE}40, transparent)` }}
      />

      {!isTraining ? (
        <p className="text-gray-600 text-center">Press Start to begin training</p>
      ) : (
        <>
          <motion.div
            key={currentPhrase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.08 }}
            className="text-center max-w-lg"
            style={{ lineHeight: 1.5 }}
          >
            <ORPPhrase
              phrase={currentPhrase}
              fontSize={fontSize * 1.5}
              fontFamily={fontFamily}
            />
          </motion.div>

          <div className="mt-8 w-full max-w-xs">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{ width: `${progress * 100}%`, background: SAGE }}
              />
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              {currentIndex} / {totalUnits}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
