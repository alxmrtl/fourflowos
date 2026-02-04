'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrainingMode, FontType } from './types';
import { SAGE } from './constants';

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
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
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
  const lines = useMemo(() => text.split(/\n+/).filter((l) => l.length > 0), [text]);

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
    else if (mode === 'phrases') setTotalUnits(phrases.length);
    else setTotalUnits(lines.length);
  }, [mode, words.length, phrases.length, lines.length]);

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
      } else if (mode === 'phrases') {
        // 6 words per phrase
        return (60000 * 6) / currentWpm;
      } else {
        // Line mode: estimate words per line
        const currentLine = lines[indexRef.current] || '';
        const lineWordCount = currentLine.split(/\s+/).filter((w) => w.length > 0).length;
        return (60000 * lineWordCount) / currentWpm + 150; // 150ms pause between lines
      }
    };

    const animate = () => {
      const idx = indexRef.current;
      const total = mode === 'word' ? words.length : mode === 'phrases' ? phrases.length : lines.length;

      if (idx >= total) {
        if (timerRef.current) clearTimeout(timerRef.current);
        onCompleteRef.current();
        return;
      }

      // Update display
      if (mode === 'word') {
        setCurrentWord(words[idx]);
      } else if (mode === 'phrases') {
        setCurrentPhrase(phrases[idx]);
      } else {
        setCurrentLineIndex(idx);
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
  }, [isTraining, isPaused, mode, words, phrases, lines]);

  // Reset on training stop
  useEffect(() => {
    if (!isTraining) {
      indexRef.current = 0;
      setCurrentWord('');
      setCurrentPhrase('');
      setCurrentLineIndex(0);
      setProgress(0);
      setCurrentIndex(0);
    }
  }, [isTraining]);

  const fontFamily = fontType === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif';

  // Word-by-word display
  if (mode === 'word') {
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
              key={currentWord}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white font-medium text-center"
              style={{ fontSize: `${fontSize * 2}px`, fontFamily }}
            >
              {currentWord}
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

  // Phrases display
  if (mode === 'phrases') {
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
              className="text-white font-medium text-center max-w-lg"
              style={{ fontSize: `${fontSize * 1.5}px`, fontFamily, lineHeight: 1.4 }}
            >
              {currentPhrase}
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

  // Line-by-line display
  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl p-6 min-h-[300px] overflow-hidden"
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
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-600 text-center">Press Start to begin training</p>
        </div>
      ) : (
        <div className="space-y-2" style={{ fontFamily }}>
          {lines.map((line, idx) => (
            <div
              key={idx}
              className="relative py-1 px-2 rounded transition-all duration-200"
              style={{
                fontSize: `${fontSize}px`,
                color: idx === currentLineIndex ? 'white' : 'rgba(255,255,255,0.3)',
                background: idx === currentLineIndex ? `${SAGE}15` : 'transparent',
              }}
            >
              {idx === currentLineIndex && (
                <motion.div
                  layoutId="line-highlight"
                  className="absolute inset-0 rounded"
                  style={{ background: `${SAGE}10`, border: `1px solid ${SAGE}30` }}
                />
              )}
              <span className="relative z-10">{line}</span>
            </div>
          ))}
        </div>
      )}

      {isTraining && (
        <div className="mt-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{ width: `${progress * 100}%`, background: SAGE }}
            />
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            Line {currentIndex} / {totalUnits}
          </p>
        </div>
      )}
    </div>
  );
}
