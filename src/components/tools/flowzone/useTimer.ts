import { useState, useRef, useCallback, useEffect } from 'react';
import { STRUGGLE_PHASE_RATIO } from './constants';

interface UseTimerReturn {
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  isStrugglePhase: boolean;
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useTimer(durationMinutes: number, onComplete: () => void): UseTimerReturn {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const endTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clearTick = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
    setSecondsLeft(remaining);
    if (remaining <= 0) {
      clearTick();
      setIsRunning(false);
      onCompleteRef.current();
    }
  }, [clearTick]);

  const start = useCallback(() => {
    setSecondsLeft(totalSeconds);
    endTimeRef.current = Date.now() + totalSeconds * 1000;
    setIsRunning(true);
    clearTick();
    intervalRef.current = setInterval(tick, 250);
  }, [totalSeconds, tick, clearTick]);

  const pause = useCallback(() => {
    clearTick();
    setIsRunning(false);
    // Store remaining time
    const remaining = Math.max(0, endTimeRef.current - Date.now());
    endTimeRef.current = remaining; // temporarily store ms remaining
  }, [clearTick]);

  const resume = useCallback(() => {
    // endTimeRef has ms remaining from pause
    endTimeRef.current = Date.now() + endTimeRef.current;
    setIsRunning(true);
    clearTick();
    intervalRef.current = setInterval(tick, 250);
  }, [tick, clearTick]);

  const stop = useCallback(() => {
    clearTick();
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  }, [clearTick, totalSeconds]);

  useEffect(() => {
    return clearTick;
  }, [clearTick]);

  const elapsed = totalSeconds - secondsLeft;
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;
  const isStrugglePhase = progress < STRUGGLE_PHASE_RATIO && isRunning;

  return {
    secondsLeft,
    totalSeconds,
    isRunning,
    isStrugglePhase,
    progress,
    start,
    pause,
    resume,
    stop,
  };
}
