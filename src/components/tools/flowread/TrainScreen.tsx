'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrainingMode, FontType, TextInput } from './types';
import { SAGE, MIN_WPM, MAX_WPM, WPM_STEP, MIN_FONT_SIZE, MAX_FONT_SIZE } from './constants';
import TrainingDisplay from './TrainingDisplay';

interface TrainScreenProps {
  trainingMode: TrainingMode;
  wpm: number;
  setWpm: (wpm: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontType: FontType;
  setFontType: (type: FontType) => void;
  textInput: TextInput;
  setInputTitle: (title: string) => void;
  setInputContent: (content: string) => void;
  clearTextInput: () => void;
  inputWordCount: number;
  isTraining: boolean;
  isPaused: boolean;
  setTrainingProgress: (progress: number) => void;
  setCurrentIndex: (index: number) => void;
  startTraining: () => void;
  pauseTraining: () => void;
  resumeTraining: () => void;
  stopTraining: () => void;
}

export default function TrainScreen({
  trainingMode,
  wpm,
  setWpm,
  fontSize,
  setFontSize,
  fontType,
  textInput,
  setInputContent,
  clearTextInput,
  inputWordCount,
  isTraining,
  isPaused,
  startTraining,
  pauseTraining,
  resumeTraining,
  stopTraining,
  setTrainingProgress,
  setCurrentIndex,
}: TrainScreenProps) {
  // Countdown state for smooth transition
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [urlFetchStatus, setUrlFetchStatus] = useState<null | 'loading' | 'error'>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);

  const handleProgressUpdate = useCallback(
    (progress: number, index: number) => {
      setTrainingProgress(progress);
      setCurrentIndex(index);
    },
    [setTrainingProgress, setCurrentIndex]
  );

  const handleComplete = useCallback(() => {
    stopTraining();
  }, [stopTraining]);

  // Handle the Begin button with countdown transition
  const handleBegin = useCallback(() => {
    setIsTransitioning(true);
    setCountdown(3);
  }, []);

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      setIsTransitioning(false);
      startTraining();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [countdown, startTraining]);

  const handleContentChange = useCallback((value: string) => {
    const trimmed = value.trim();
    if (/^https?:\/\/\S+$/.test(trimmed)) {
      // Cancel any in-flight fetch
      fetchAbortRef.current?.abort();
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      setUrlFetchStatus('loading');
      setInputContent('');

      fetch(`https://r.jina.ai/${trimmed}`, {
        headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then((text) => {
          // Strip Jina Reader metadata headers
          const clean = text.replace(/^(Title|URL|Published|Author|Description):.*\n/gm, '').trim();
          if (!clean || clean.length < 10) throw new Error('No readable content found');
          setInputContent(clean);
          setUrlFetchStatus(null);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setUrlFetchStatus('error');
        });
    } else {
      fetchAbortRef.current?.abort();
      fetchAbortRef.current = null;
      setUrlFetchStatus(null);
      setInputContent(value);
    }
  }, [setInputContent]);

  const canStart = inputWordCount > 0;
  const estimatedMinutes = Math.ceil(inputWordCount / wpm);

  // Countdown transition screen
  if (isTransitioning && countdown !== null) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {countdown > 0 ? (
              <span
                className="text-6xl font-light"
                style={{ color: SAGE }}
              >
                {countdown}
              </span>
            ) : (
              <span className="text-2xl font-light text-white/60">
                Focus
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Training mode - show the display
  if (isTraining) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Training Display - takes most of the space */}
        <div className="flex-1 flex items-center justify-center">
          <TrainingDisplay
            mode={trainingMode}
            text={textInput.content}
            wpm={wpm}
            fontSize={fontSize}
            fontType={fontType}
            isTraining={isTraining}
            isPaused={isPaused}
            onProgressUpdate={handleProgressUpdate}
            onComplete={handleComplete}
          />
        </div>

        {/* Floating Control Bar */}
        <div className="mt-auto pt-6">
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-4">
              {/* Playback controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={isPaused ? resumeTraining : pauseTraining}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium transition-all hover:scale-105"
                  style={{ background: SAGE }}
                >
                  {isPaused ? '▶' : '⏸'}
                </button>
                <button
                  onClick={stopTraining}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 font-medium transition-all hover:text-white hover:bg-white/10"
                >
                  ⏹
                </button>
              </div>

              {/* Speed slider */}
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="range"
                  min={MIN_WPM}
                  max={MAX_WPM}
                  step={WPM_STEP}
                  value={wpm}
                  onChange={(e) => setWpm(parseInt(e.target.value))}
                  className="flex-1 h-1 appearance-none bg-white/10 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  style={{ accentColor: SAGE }}
                />
                <span className="text-sm text-white font-medium min-w-[70px] text-right">
                  {wpm} <span className="text-gray-500 font-normal">wpm</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Input mode - show the text input canvas
  return (
    <div className="flex-1 flex flex-col gap-4">

      {/* Intro copy */}
      <p className="text-center text-sm text-gray-500">
        Trains your focus by pacing you through content you want to read. Paste any text — or drop in a YouTube or article link.
      </p>

      {/* Control Bar — at top */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-4">
          {/* Start button */}
          <button
            onClick={handleBegin}
            disabled={!canStart}
            className="px-6 py-2.5 rounded-xl text-white font-medium transition-all hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: canStart ? SAGE : 'rgba(255,255,255,0.1)' }}
          >
            Begin
          </button>

          {/* Speed slider */}
          <div className="flex-1 flex items-center gap-3">
            <input
              type="range"
              min={MIN_WPM}
              max={MAX_WPM}
              step={WPM_STEP}
              value={wpm}
              onChange={(e) => setWpm(parseInt(e.target.value))}
              className="flex-1 h-1 appearance-none bg-white/10 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              style={{ accentColor: SAGE }}
            />
            <span className="text-sm text-white font-medium min-w-[70px] text-right">
              {wpm} <span className="text-gray-500 font-normal">wpm</span>
            </span>
          </div>

          {/* Font size control - compact */}
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <span className="text-xs text-gray-500">Aa</span>
            <input
              type="range"
              min={MIN_FONT_SIZE}
              max={MAX_FONT_SIZE}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-16 h-1 appearance-none bg-white/10 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/60"
            />
            <span className="text-xs text-gray-500 min-w-[28px]">{fontSize}</span>
          </div>
        </div>
      </div>

      {/* Text Input Canvas */}
      <div className="flex-1 flex flex-col">
        <div
          className="flex-1 flex flex-col rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* URL fetch status */}
          {urlFetchStatus === 'loading' && (
            <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ color: SAGE, background: 'rgba(107,162,146,0.1)' }}>
              Fetching content...
            </p>
          )}
          {urlFetchStatus === 'error' && (
            <p className="text-xs mb-3 px-3 py-2 rounded-lg text-red-400" style={{ background: 'rgba(255,100,100,0.08)' }}>
              Couldn&apos;t fetch content — paste your text directly instead.
            </p>
          )}

          {/* Content textarea - the hero */}
          <textarea
            value={textInput.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Paste your text here — or drop in a YouTube or article link"
            className="flex-1 w-full bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none text-base leading-relaxed scrollbar-dark"
            style={{ minHeight: '220px' }}
          />

          {/* Word count and clear - subtle footer */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
            <span>
              {inputWordCount > 0 ? (
                <>
                  {inputWordCount} words
                  {estimatedMinutes > 0 && (
                    <span className="text-gray-600"> · ~{estimatedMinutes} min</span>
                  )}
                </>
              ) : (
                'No text yet'
              )}
            </span>
            {inputWordCount > 0 && (
              <button
                onClick={clearTextInput}
                className="text-gray-600 hover:text-gray-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
