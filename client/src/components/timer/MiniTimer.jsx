import { useMemo } from 'react';
import clsx from 'clsx';

/**
 * Compact HH:MM:SS display for the topbar.
 * Shows a color indicator dot (green/yellow/red) based on remaining time.
 *
 * @param {object} props
 * @param {number} props.hours
 * @param {number} props.minutes
 * @param {number} props.seconds
 * @param {boolean} props.isRunning
 * @param {number} [props.totalSeconds] - Current remaining seconds
 * @param {number} [props.initialTotalSeconds] - Original total duration
 */
export default function MiniTimer({
  hours = 0,
  minutes = 0,
  seconds = 0,
  isRunning = false,
  totalSeconds,
  initialTotalSeconds,
}) {
  const remaining = totalSeconds ?? hours * 3600 + minutes * 60 + seconds;
  const total = initialTotalSeconds || remaining || 1;
  const pct = total > 0 ? remaining / total : 0;
  const isFinished = remaining <= 0;
  const isUnderFiveMin = remaining > 0 && remaining < 300;

  const dotColor = useMemo(() => {
    if (isFinished) return 'bg-red-500';
    if (pct > 0.5) return 'bg-emerald-500';
    if (pct > 0.2) return 'bg-amber-500';
    return 'bg-red-500';
  }, [pct, isFinished]);

  const textColor = useMemo(() => {
    if (isFinished) return 'text-red-500 dark:text-red-400';
    if (pct > 0.5) return 'text-gray-700 dark:text-gray-200';
    if (pct > 0.2) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  }, [pct, isFinished]);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg',
        'bg-gray-100 dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'transition-all duration-300',
        isUnderFiveMin && 'animate-pulse'
      )}
    >
      {/* Color indicator dot */}
      <span
        className={clsx(
          'h-2 w-2 rounded-full flex-shrink-0',
          'transition-colors duration-500',
          dotColor,
          isRunning && !isFinished && 'animate-pulse'
        )}
      />

      {/* Time display */}
      {isFinished ? (
        <span className="text-xs font-semibold text-red-500 dark:text-red-400">
          Ended
        </span>
      ) : (
        <span
          className={clsx(
            'font-mono text-sm font-semibold tabular-nums tracking-wider',
            'transition-colors duration-500',
            textColor
          )}
        >
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </span>
      )}
    </div>
  );
}
