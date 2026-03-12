import { useState } from 'react';
import clsx from 'clsx';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';
import Button from '../common/Button';
import * as timerService from '../../services/timer.service';
import toast from 'react-hot-toast';

/**
 * Numeric input for hours or minutes with increment/decrement buttons.
 */
function DurationInput({ label, value, onChange, max = 99, min = 0 }) {
  const handleIncrement = () => {
    onChange(Math.min(max, value + 1));
  };

  const handleDecrement = () => {
    onChange(Math.max(min, value - 1));
  };

  const handleChange = (e) => {
    const num = parseInt(e.target.value, 10);
    if (Number.isNaN(num)) {
      onChange(min);
    } else {
      onChange(Math.max(min, Math.min(max, num)));
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleDecrement}
          className={clsx(
            'flex items-center justify-center w-8 h-8 rounded-lg',
            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
            'hover:bg-gray-200 dark:hover:bg-gray-600',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
          )}
        >
          <span className="text-lg font-bold leading-none">-</span>
        </button>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          className={clsx(
            'w-16 h-10 text-center text-lg font-mono font-semibold rounded-lg',
            'border border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
            'transition-all duration-200',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
          )}
        />
        <button
          type="button"
          onClick={handleIncrement}
          className={clsx(
            'flex items-center justify-center w-8 h-8 rounded-lg',
            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
            'hover:bg-gray-200 dark:hover:bg-gray-600',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
          )}
        >
          <span className="text-lg font-bold leading-none">+</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Admin timer controls: set duration and start/pause/resume/reset the hackathon timer.
 * Only visible to superadmin users.
 *
 * @param {object} props
 * @param {boolean} props.isRunning - Whether the timer is currently running
 * @param {number} props.totalSeconds - Current remaining seconds
 * @param {Function} [props.onAction] - Optional callback after any action succeeds
 */
export default function TimerControls({ isRunning = false, totalSeconds = 0, onAction }) {
  const [durationHours, setDurationHours] = useState(2);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [loading, setLoading] = useState(null); // 'start' | 'pause' | 'resume' | 'reset' | null

  const hasTimeLeft = totalSeconds > 0;
  const isPaused = !isRunning && hasTimeLeft;
  const isIdle = !isRunning && !hasTimeLeft;

  const handleStart = async () => {
    const totalSec = durationHours * 3600 + durationMinutes * 60;
    if (totalSec <= 0) {
      toast.error('Please set a duration greater than 0');
      return;
    }

    setLoading('start');
    try {
      await timerService.startTimer(totalSec);
      toast.success('Timer started!');
      onAction?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start timer');
    } finally {
      setLoading(null);
    }
  };

  const handlePause = async () => {
    setLoading('pause');
    try {
      await timerService.pauseTimer();
      toast.success('Timer paused');
      onAction?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to pause timer');
    } finally {
      setLoading(null);
    }
  };

  const handleResume = async () => {
    setLoading('resume');
    try {
      await timerService.resumeTimer();
      toast.success('Timer resumed');
      onAction?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resume timer');
    } finally {
      setLoading(null);
    }
  };

  const handleReset = async () => {
    setLoading('reset');
    try {
      await timerService.resetTimer();
      toast.success('Timer reset');
      onAction?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset timer');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'p-6 shadow-sm'
      )}
    >
      <div className="flex items-center gap-2 mb-5">
        <ClockIcon className="h-5 w-5 text-indigo-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
          Timer Controls
        </h3>
      </div>

      {/* Duration inputs - only show when idle */}
      {isIdle && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Set the hackathon duration:
          </p>
          <div className="flex items-end gap-4">
            <DurationInput
              label="Hours"
              value={durationHours}
              onChange={setDurationHours}
              max={72}
            />
            <div className="flex items-center h-10 text-xl font-bold text-gray-400 dark:text-gray-500 pb-0.5">
              :
            </div>
            <DurationInput
              label="Minutes"
              value={durationMinutes}
              onChange={setDurationMinutes}
              max={59}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {isIdle && (
          <Button
            variant="success"
            icon={PlayIcon}
            loading={loading === 'start'}
            onClick={handleStart}
          >
            Start Timer
          </Button>
        )}

        {isRunning && (
          <Button
            variant="secondary"
            icon={PauseIcon}
            loading={loading === 'pause'}
            onClick={handlePause}
          >
            Pause
          </Button>
        )}

        {isPaused && (
          <Button
            variant="success"
            icon={PlayIcon}
            loading={loading === 'resume'}
            onClick={handleResume}
          >
            Resume
          </Button>
        )}

        {(isRunning || isPaused) && (
          <Button
            variant="danger"
            icon={ArrowPathIcon}
            loading={loading === 'reset'}
            onClick={handleReset}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Current status hint */}
      {!isIdle && (
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          {isRunning
            ? 'Timer is running. Participants can see the countdown.'
            : 'Timer is paused. Resume to continue the countdown.'}
        </p>
      )}
    </div>
  );
}
