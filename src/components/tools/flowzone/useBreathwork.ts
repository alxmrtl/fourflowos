import { useState, useRef, useCallback, useEffect } from 'react';
import { BreathworkPattern, BreathworkPhase } from './types';

interface UseBreathworkReturn {
  isActive: boolean;
  isComplete: boolean;
  currentPhase: BreathworkPhase | null;
  phaseProgress: number;   // 0-1 within current phase
  cycleProgress: number;   // 0-1 within the full cycle
  cycleCount: number;
  start: (pattern: BreathworkPattern, targetCycles?: number) => void;
  stop: () => void;
}

export function useBreathwork(): UseBreathworkReturn {
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathworkPhase | null>(null);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleProgress, setCycleProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const rafRef = useRef<number>(0);
  const patternRef = useRef<BreathworkPattern | null>(null);
  const startTimeRef = useRef(0);
  const targetCyclesRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = useCallback((freq: number, duration: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch { /* ignore audio errors */ }
  }, []);

  const animate = useCallback(() => {
    const pattern = patternRef.current;
    if (!pattern) return;

    const elapsed = Date.now() - startTimeRef.current;
    const cyclePos = elapsed % pattern.cycleDurationMs;
    const completedCycles = Math.floor(elapsed / pattern.cycleDurationMs);

    // Auto-stop when target reached
    const target = targetCyclesRef.current;
    if (target !== null && completedCycles >= target) {
      setIsActive(false);
      setIsComplete(true);
      return;
    }

    setCycleCount(completedCycles);
    setCycleProgress(cyclePos / pattern.cycleDurationMs);

    let accumulated = 0;
    let foundPhase: BreathworkPhase | null = null;
    let progress = 0;

    for (const phase of pattern.phases) {
      if (cyclePos < accumulated + phase.durationMs) {
        foundPhase = phase;
        progress = (cyclePos - accumulated) / phase.durationMs;
        break;
      }
      accumulated += phase.durationMs;
    }

    if (foundPhase) {
      setCurrentPhase(prev => {
        if (prev?.label !== foundPhase!.label) {
          if (foundPhase!.label === 'Inhale') playTone(440, 0.3);
          else if (foundPhase!.label === 'Exhale') playTone(330, 0.3);
          else playTone(380, 0.2);
        }
        return foundPhase;
      });
      setPhaseProgress(progress);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [playTone]);

  const start = useCallback((pattern: BreathworkPattern, targetCycles?: number) => {
    patternRef.current = pattern;
    startTimeRef.current = Date.now();
    targetCyclesRef.current = targetCycles ?? null;
    setCycleCount(0);
    setCycleProgress(0);
    setIsComplete(false);
    setIsActive(true);
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setIsActive(false);
    setIsComplete(false);
    setCurrentPhase(null);
    setPhaseProgress(0);
    setCycleProgress(0);
    setCycleCount(0);
    patternRef.current = null;
    targetCyclesRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  return { isActive, isComplete, currentPhase, phaseProgress, cycleProgress, cycleCount, start, stop };
}
