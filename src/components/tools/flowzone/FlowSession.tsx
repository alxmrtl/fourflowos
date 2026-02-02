'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAGE } from './constants';
import { Priority, FlowSettings } from './types';
import { useTimer } from './useTimer';
import { useAudio } from './useAudio';

interface FlowSessionProps {
  priority: Priority;
  durationMinutes: number;
  audioSettings: FlowSettings;
  onComplete: (focusReps: number, actualMinutes: number) => void;
  onEnd: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function FlowSession({ priority, durationMinutes, audioSettings, onComplete, onEnd }: FlowSessionProps) {
  const [focusReps, setFocusReps] = useState(0);
  const [repFlash, setRepFlash] = useState(false);
  const [started, setStarted] = useState(false);
  const [audioLabel, setAudioLabel] = useState<string | null>(null);

  const handleComplete = useCallback(() => {
    audio.stopAll();
    onComplete(focusReps, durationMinutes);
  }, [focusReps, durationMinutes]);

  const timer = useTimer(durationMinutes, handleComplete);
  const audio = useAudio();

  // Start audio based on settings when session starts
  const startAudio = useCallback(() => {
    const src = audioSettings.audioSource;
    if (src === 'none') return;

    audio.setVolume(audioSettings.audioVolume);

    if (src === 'white-noise' || src === 'rain' || src === 'binaural') {
      audio.toggleSound(src);
      setAudioLabel(src === 'white-noise' ? 'White Noise' : src === 'rain' ? 'Rain' : 'Binaural Beats');
    } else if (src.startsWith('yt:')) {
      const videoId = src.slice(3);
      audio.playYoutube(videoId);
      setAudioLabel('YouTube');
    } else if (src === 'yt-custom' && audioSettings.youtubeCustomUrl) {
      audio.playYoutube(audioSettings.youtubeCustomUrl);
      setAudioLabel('Custom YouTube');
    }
  }, [audioSettings, audio]);

  const handleStart = () => {
    setStarted(true);
    timer.start();
    startAudio();
  };

  const handleFocusRep = () => {
    setFocusReps(prev => prev + 1);
    setRepFlash(true);
    setTimeout(() => setRepFlash(false), 400);
  };

  const handleEndEarly = () => {
    timer.stop();
    audio.stopAll();
    const elapsed = timer.totalSeconds - timer.secondsLeft;
    const actualMinutes = Math.round(elapsed / 60);
    onComplete(focusReps, actualMinutes);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audio.stopAll();
    };
  }, []);

  const ringSize = 240;
  const strokeWidth = 6;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - timer.progress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      {/* Struggle phase indicator */}
      <AnimatePresence>
        {timer.isStrugglePhase && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-6 left-0 right-0 text-center"
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
              Struggle Phase — this is normal, keep going
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Priority label */}
      <p className="text-gray-500 text-sm mb-2 max-w-xs truncate text-center">
        {priority.text}
      </p>

      {!started ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <p className="text-white text-4xl font-bold mb-2">{durationMinutes}:00</p>
          <p className="text-gray-500 text-sm mb-8">Ready to focus?</p>
          <button
            onClick={handleStart}
            className="px-10 py-4 rounded-full text-white text-lg font-semibold transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${SAGE}, ${SAGE}cc)`,
              boxShadow: `0 4px 24px ${SAGE}40`,
            }}
          >
            Start
          </button>
        </motion.div>
      ) : (
        <>
          {/* Timer ring */}
          <div className="relative mb-8">
            <svg width={ringSize} height={ringSize} className="-rotate-90">
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                stroke={SAGE}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-white text-4xl font-mono font-bold">
                {formatTime(timer.secondsLeft)}
              </p>
            </div>
          </div>

          {/* Focus Rep button */}
          <motion.button
            onClick={handleFocusRep}
            className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all"
            style={{
              background: repFlash ? SAGE : 'rgba(255,255,255,0.05)',
              border: `2px solid ${SAGE}60`,
            }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="text-center">
              <p className="text-white text-xl font-bold">{focusReps}</p>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider">Reps</p>
            </div>
            <AnimatePresence>
              {repFlash && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${SAGE}` }}
                />
              )}
            </AnimatePresence>
          </motion.button>
          <p className="text-gray-600 text-xs mt-2">Tap when you refocus</p>

          {/* Pause / End */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => (timer.isRunning ? timer.pause() : timer.resume())}
              className="px-4 py-2 rounded-full text-sm text-gray-400 border border-white/10 hover:text-white transition-colors"
            >
              {timer.isRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={handleEndEarly}
              className="px-4 py-2 rounded-full text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              End Session
            </button>
          </div>
        </>
      )}

      {/* Subtle audio indicator */}
      {started && audioLabel && (
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <span className="text-[10px] text-gray-600 uppercase tracking-widest">
            {audioLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
}
