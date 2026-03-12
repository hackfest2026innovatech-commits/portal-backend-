import { useMemo } from 'react';
import clsx from 'clsx';

/**
 * Animated single digit display with flip-style transition.
 */
function Digit({ value, color }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center',
        'w-16 h-20 sm:w-24 sm:h-28 md:w-28 md:h-32',
        'rounded-xl text-4xl sm:text-5xl md:text-6xl font-mono font-bold',
        'bg-gray-100 dark:bg-gray-800/80',
        'border border-gray-200 dark:border-gray-700',
        'shadow-sm',
        'transition-colors duration-500',
        color
      )}
      style={{
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {value}
    </span>
  );
}

/**
 * Colon separator between digit groups.
 */
function Separator({ pulsing, color }) {
  return (
    <span
      className={clsx(
        'flex flex-col items-center justify-center gap-2 mx-1 sm:mx-2',
        'text-3xl sm:text-4xl md:text-5xl font-bold',
        'transition-colors duration-500',
        color,
        pulsing && 'animate-pulse'
      )}
    >
      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-current" />
      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-current" />
    </span>
  );
}

/**
 * Large countdown display with HH:MM:SS.
 *
 * Color logic:
 *  - Green when > 50% time remaining
 *  - Yellow when > 20% time remaining
 *  - Red when < 20% time remaining
 *  - Pulsing animation when < 5 minutes
 *  - "Time's Up!" when 0
 *
 * @param {object} props
 * @param {number} props.hours
 * @param {number} props.minutes
 * @param {number} props.seconds
 * @param {boolean} props.isRunning
 * @param {number} [props.totalSeconds] - Current remaining seconds (for color calculation)
 * @param {number} [props.initialTotalSeconds] - Original total duration in seconds
 */
export default function CountdownTimer({
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
  const isFinished = remaining <= 0 && !isRunning;
  const isUnderFiveMin = remaining > 0 && remaining < 300;

  const colorClass = useMemo(() => {
    if (remaining <= 0) return 'text-red-500 dark:text-red-400';
    if (pct > 0.5) return 'text-emerald-500 dark:text-emerald-400';
    if (pct > 0.2) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  }, [pct, remaining]);

  const glowClass = useMemo(() => {
    if (remaining <= 0) return 'shadow-red-500/20 dark:shadow-red-500/10';
    if (pct > 0.5) return 'shadow-emerald-500/20 dark:shadow-emerald-500/10';
    if (pct > 0.2) return 'shadow-amber-500/20 dark:shadow-amber-500/10';
    return 'shadow-red-500/20 dark:shadow-red-500/10';
  }, [pct, remaining]);

  const pad = (n) => String(n).padStart(2, '0');

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div
          className={clsx(
            'px-8 py-6 rounded-2xl',
            'bg-red-50 dark:bg-red-900/20',
            'border-2 border-red-300 dark:border-red-700',
            'animate-pulse'
          )}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-mono text-red-500 dark:text-red-400 tracking-wider">
            Time&apos;s Up!
          </h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The hackathon timer has ended
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Timer container */}
      <div
        className={clsx(
          'inline-flex items-center justify-center',
          'p-4 sm:p-6 rounded-2xl',
          'bg-white dark:bg-gray-900/50',
          'border border-gray-200 dark:border-gray-700/50',
          'shadow-lg',
          glowClass,
          isUnderFiveMin && 'animate-pulse'
        )}
      >
        {/* Hours */}
        <div className="flex gap-1">
          <Digit value={pad(hours)[0]} color={colorClass} />
          <Digit value={pad(hours)[1]} color={colorClass} />
        </div>

        <Separator pulsing={isRunning} color={colorClass} />

        {/* Minutes */}
        <div className="flex gap-1">
          <Digit value={pad(minutes)[0]} color={colorClass} />
          <Digit value={pad(minutes)[1]} color={colorClass} />
        </div>

        <Separator pulsing={isRunning} color={colorClass} />

        {/* Seconds */}
        <div className="flex gap-1">
          <Digit value={pad(seconds)[0]} color={colorClass} />
          <Digit value={pad(seconds)[1]} color={colorClass} />
        </div>
      </div>

      {/* Labels */}
      <div className="flex items-center gap-16 sm:gap-24 md:gap-28 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">
        <span>Hours</span>
        <span>Minutes</span>
        <span>Seconds</span>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 text-sm">
        <span
          className={clsx(
            'h-2 w-2 rounded-full',
            isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400 dark:bg-gray-600'
          )}
        />
        <span className="text-gray-600 dark:text-gray-400">
          {isRunning ? 'Running' : 'Paused'}
        </span>
      </div>
    </div>
  );
}
