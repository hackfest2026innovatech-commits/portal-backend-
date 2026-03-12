import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useSocketEvent } from './useSocket';
import * as timerService from '../services/timer.service';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook to manage the hackathon countdown timer.
 * Subscribes to socket events: timer:tick, timer:start, timer:pause, timer:reset
 *
 * @returns {{ hours, minutes, seconds, isRunning, totalSeconds, loading }}
 */
export function useTimer() {
  const auth = useContext(AuthContext);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  // Calculate display values
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Clear any existing interval
  const clearCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start local countdown
  const startCountdown = useCallback(() => {
    clearCountdown();
    intervalRef.current = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          clearCountdown();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearCountdown]);

  // Fetch initial timer state only when authenticated
  useEffect(() => {
    if (!auth?.isAuthenticated) {
      setLoading(false);
      return;
    }

    async function fetchTimer() {
      try {
        const data = await timerService.getTimer();
        const timer = data.data?.timer || data.timer || data.data || data;
        const remaining = timer.currentRemaining ?? timer.remainingTime ?? timer.totalSeconds ?? timer.duration ?? 0;
        setTotalSeconds(Math.max(0, remaining));
        setIsRunning(!!timer.isRunning);

        if (timer.isRunning && remaining > 0) {
          startCountdown();
        }
      } catch (error) {
        // Timer might not be initialized yet, that's OK
        console.log('Timer not available:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTimer();

    return () => clearCountdown();
  }, [auth?.isAuthenticated, startCountdown, clearCountdown]);

  // Socket event: timer tick (server-authoritative sync)
  const handleTick = useCallback(
    (data) => {
      const remaining = data.remainingTime ?? data.totalSeconds ?? data.remainingSeconds ?? data;
      setTotalSeconds(Math.max(0, typeof remaining === 'number' ? remaining : 0));

      if (remaining <= 0) {
        setIsRunning(false);
        clearCountdown();
      }
    },
    [clearCountdown]
  );

  // Socket event: timer started
  const handleStart = useCallback(
    (data) => {
      const remaining = data.remainingTime ?? data.totalSeconds ?? data.remainingSeconds ?? data.duration ?? 0;
      setTotalSeconds(Math.max(0, remaining));
      setIsRunning(true);
      startCountdown();
    },
    [startCountdown]
  );

  // Socket event: timer paused
  const handlePause = useCallback(
    (data) => {
      const remaining = data.remainingTime ?? data.totalSeconds ?? data.remainingSeconds ?? totalSeconds;
      setTotalSeconds(Math.max(0, remaining));
      setIsRunning(false);
      clearCountdown();
    },
    [totalSeconds, clearCountdown]
  );

  // Socket event: timer reset
  const handleReset = useCallback(
    (data) => {
      const duration = data?.remainingTime ?? data?.totalSeconds ?? data?.duration ?? 0;
      setTotalSeconds(Math.max(0, duration));
      setIsRunning(false);
      clearCountdown();
    },
    [clearCountdown]
  );

  useSocketEvent('timer:tick', handleTick);
  useSocketEvent('timer:start', handleStart);
  useSocketEvent('timer:started', handleStart);
  useSocketEvent('timer:pause', handlePause);
  useSocketEvent('timer:paused', handlePause);
  useSocketEvent('timer:reset', handleReset);
  useSocketEvent('timer:finished', () => { setIsRunning(false); setTotalSeconds(0); clearCountdown(); });

  return {
    hours,
    minutes,
    seconds,
    isRunning,
    totalSeconds,
    loading,
  };
}
