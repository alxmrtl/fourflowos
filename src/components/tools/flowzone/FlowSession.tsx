'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAGE, AMETHYST, CORAL, AUDIO_OPTIONS } from './constants';
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

    // Check if it's a generated sound
    if (src === 'white-noise' || src === 'binaural') {
      audio.toggleSound(src);
      setAudioLabel(src === 'white-noise' ? 'White Noise' : 'Binaural Beats');
    } else if (src === 'yt-custom' && audioSettings.youtubeCustomUrl) {
      audio.playYoutube(audioSettings.youtubeCustomUrl);
      setAudioLabel('Custom YouTube');
    } else {
      // Check AUDIO_OPTIONS for YouTube-sourced options
      const opt = AUDIO_OPTIONS.find(o => o.id === src);
      if (opt?.source === 'youtube' && opt.youtubeId) {
        audio.playYoutube(opt.youtubeId);
        setAudioLabel(opt.title);
      } else if (src.startsWith('yt:')) {
        audio.playYoutube(src.slice(3));
        setAudioLabel('YouTube');
      }
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

  const ringSize = 280;
  const strokeWidth = 6;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - timer.progress);

  // Gradient ID for the timer stroke
  const gradientId = 'timer-gradient';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ground flex flex-col items-center justify-center"
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
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-amber-400"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))' }}
            >
              {/* Flame icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                <path d="M12 22c-4-3-8-7-8-12a8 8 0 0116 0c0 5-4 9-8 12z" />
                <path d="M12 22c-1.5-1.5-3-3.5-3-6a3 3 0 016 0c0 2.5-1.5 4.5-3 6z" />
              </svg>
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
              background: `linear-gradient(135deg, ${SAGE}, ${AMETHYST}cc)`,
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
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-[-8px] rounded-full"
              style={{ border: `1px solid ${SAGE}15` }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Inner faint ring */}
            <div
              className="absolute inset-[8px] rounded-full"
              style={{ border: `1px solid rgba(255,255,255,0.03)` }}
            />
            <svg width={ringSize} height={ringSize} className="-rotate-90">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={SAGE} />
                  <stop offset="100%" stopColor={AMETHYST} />
                </linearGradient>
              </defs>
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
                stroke={`url(#${gradientId})`}
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
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: repFlash ? SAGE : 'rgba(255,255,255,0.05)',
              border: '2px solid transparent',
              backgroundImage: repFlash
                ? undefined
                : `linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05)), linear-gradient(135deg, ${SAGE}60, ${AMETHYST}60)`,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
            animate={!repFlash ? { scale: [1, 1.02, 1] } : {}}
            transition={!repFlash ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
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
                  style={{ border: `2px solid ${CORAL}` }}
                />
              )}
            </AnimatePresence>
          </motion.button>
          <p className="text-gray-600 text-xs mt-2">Tap when you refocus</p>

          {/* Pause / End */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => (timer.isRunning ? timer.pause() : timer.resume())}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-gray-400 border border-white/10 hover:text-white hover:border-space/40 transition-colors"
            >
              {/* Pause/Play icon */}
              {timer.isRunning ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
              )}
              {timer.isRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={handleEndEarly}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-gray-500 hover:text-red-400 hover:border-red-400/30 border border-transparent transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
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
