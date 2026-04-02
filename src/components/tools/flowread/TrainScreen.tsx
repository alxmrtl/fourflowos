'use client';

import { useCallback, useState, useEffect } from 'react';
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
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [localCurrentIndex, setLocalCurrentIndex] = useState(0);
  const [seekVersion, setSeekVersion] = useState(0);
  const [seekIndex, setSeekIndex] = useState(0);

  // isActive = countdown running OR training in progress (including paused)
  const isActive = isTransitioning || isTraining;
  const canStart = inputWordCount > 0 && !isActive;
  const totalUnits = trainingMode === 'word'
    ? inputWordCount
    : Math.ceil(inputWordCount / 6);
  const estimatedMinutes = wpm > 0 ? Math.ceil(inputWordCount / wpm) : 0;

  const handleProgressUpdate = useCallback(
    (progress: number, index: number) => {
      setTrainingProgress(progress);
      setCurrentIndex(index);
      setLocalCurrentIndex(index);
    },
    [setTrainingProgress, setCurrentIndex]
  );

  const handleComplete = useCallback(() => {
    stopTraining();
    setLocalCurrentIndex(0);
  }, [stopTraining]);

  const handleBegin = useCallback(() => {
    setIsTransitioning(true);
    setCountdown(3);
    setLocalCurrentIndex(0);
    setSeekVersion(0);
    setSeekIndex(0);
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      setIsTransitioning(false);
      startTraining();
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 800);
    return () => clearTimeout(timer);
  }, [countdown, startTraining]);

  const handleStop = useCallback(() => {
    if (isTransitioning) {
      setIsTransitioning(false);
      setCountdown(null);
    }
    stopTraining();
    setLocalCurrentIndex(0);
  }, [isTransitioning, stopTraining]);

  const handlePlayPause = useCallback(() => {
    if (isPaused) {
      resumeTraining();
    } else {
      pauseTraining();
    }
  }, [isPaused, pauseTraining, resumeTraining]);

  const handleSeek = useCallback((index: number) => {
    setSeekIndex(index);
    setSeekVersion(v => v + 1);
    setLocalCurrentIndex(index);
    setCurrentIndex(index);
  }, [setCurrentIndex]);

  const handleContentChange = useCallback((value: string) => {
    setInputContent(value);
  }, [setInputContent]);

  return (
    <div className="flex flex-col gap-4">

      {/* === Control Bar === */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Row 1: left controls + sliders */}
        <div className="flex items-center gap-4">

          {/* Left slot: Begin OR Play/Pause + Stop */}
          <div className="shrink-0 flex items-center gap-2" style={{ minWidth: 88 }}>
            <AnimatePresence mode="wait" initial={false}>
              {!isActive ? (
                // Before session — Begin button
                <motion.button
                  key="begin"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleBegin}
                  disabled={!canStart}
                  className="h-10 px-5 rounded-xl text-white font-medium transition-all hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ background: canStart ? SAGE : 'rgba(255,255,255,0.1)' }}
                >
                  Begin
                </motion.button>
              ) : (
                // During session — Play/Pause + Stop
                <motion.div
                  key="playback"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <button
                    onClick={handlePlayPause}
                    disabled={isTransitioning}
                    title={isPaused ? 'Resume' : 'Pause'}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ background: SAGE }}
                  >
                    {isTransitioning
                      ? (countdown !== null && countdown > 0 ? String(countdown) : '▶')
                      : isPaused ? '▶' : '⏸'}
                  </button>
                  <button
                    onClick={handleStop}
                    title="Stop"
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 font-medium transition-all hover:text-white hover:bg-white/10"
                  >
                    ⏹
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* WPM slider */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
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
            <span className="text-sm text-white font-medium min-w-[70px] text-right shrink-0">
              {wpm} <span className="text-gray-500 font-normal">wpm</span>
            </span>
          </div>

          {/* Font size slider */}
          <div className="flex items-center gap-2 pl-3 border-l border-white/10 shrink-0">
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

        {/* Row 2: Timeline scrubber — only when session is active */}
        {isActive && totalUnits > 0 && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={totalUnits}
              value={localCurrentIndex}
              onChange={(e) => handleSeek(parseInt(e.target.value))}
              className="flex-1 h-1 appearance-none bg-white/10 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/80"
              style={{ accentColor: SAGE }}
            />
            <span className="text-xs text-gray-500 min-w-[60px] text-right shrink-0">
              {localCurrentIndex} / {totalUnits}
            </span>
          </div>
        )}
      </div>

      {/* === Content Box (fixed height, scrollable) === */}
      <div
        className="h-[260px] rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {isTransitioning && countdown !== null ? (
          /* Countdown */
          <div className="h-full flex items-center justify-center">
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
                  <span className="text-6xl font-light" style={{ color: SAGE }}>
                    {countdown}
                  </span>
                ) : (
                  <span className="text-2xl font-light text-white/60">Focus</span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : isTraining ? (
          /* Training display */
          <div className="h-full flex items-center justify-center p-4">
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
              seekIndex={seekIndex}
              seekVersion={seekVersion}
            />
          </div>
        ) : (
          /* Text input — idle */
          <div className="h-full flex flex-col p-5">
            <textarea
              value={textInput.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Paste your text here"
              className="flex-1 w-full bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none leading-relaxed overflow-y-auto scrollbar-dark"
              style={{ fontSize: `${fontSize}px` }}
            />
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 shrink-0">
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
        )}
      </div>

    </div>
  );
}
