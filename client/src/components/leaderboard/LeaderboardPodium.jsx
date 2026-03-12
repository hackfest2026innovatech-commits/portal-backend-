import clsx from 'clsx';
import { TrophyIcon } from '@heroicons/react/24/solid';

const podiumConfig = {
  1: {
    height: 'h-40 sm:h-48',
    bg: 'bg-gradient-to-t from-amber-500 to-amber-400',
    border: 'border-amber-300',
    trophyColor: 'text-amber-400',
    trophyBg: 'bg-amber-50 dark:bg-amber-900/30',
    label: '1st',
    labelBg: 'bg-amber-500',
    order: 'order-2',
    delay: 'animation-delay-200',
  },
  2: {
    height: 'h-28 sm:h-36',
    bg: 'bg-gradient-to-t from-gray-400 to-gray-300 dark:from-gray-500 dark:to-gray-400',
    border: 'border-gray-300 dark:border-gray-500',
    trophyColor: 'text-gray-400',
    trophyBg: 'bg-gray-100 dark:bg-gray-700',
    label: '2nd',
    labelBg: 'bg-gray-400 dark:bg-gray-500',
    order: 'order-1',
    delay: 'animation-delay-400',
  },
  3: {
    height: 'h-20 sm:h-28',
    bg: 'bg-gradient-to-t from-amber-700 to-amber-600',
    border: 'border-amber-600',
    trophyColor: 'text-amber-700 dark:text-amber-600',
    trophyBg: 'bg-orange-50 dark:bg-orange-900/30',
    label: '3rd',
    labelBg: 'bg-amber-700',
    order: 'order-3',
    delay: 'animation-delay-600',
  },
};

/**
 * Single podium block.
 */
function PodiumBlock({ team, position }) {
  const config = podiumConfig[position];
  if (!config || !team) return null;

  return (
    <div
      className={clsx(
        'flex flex-col items-center',
        config.order,
        'animate-in slide-in-from-bottom-4 fade-in duration-700 fill-mode-both'
      )}
      style={{
        animationDelay: position === 1 ? '200ms' : position === 2 ? '400ms' : '600ms',
      }}
    >
      {/* Trophy */}
      <div
        className={clsx(
          'flex items-center justify-center',
          'w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-3',
          config.trophyBg,
          'border-2',
          config.border,
          'shadow-lg'
        )}
      >
        <TrophyIcon className={clsx('h-6 w-6 sm:h-7 sm:w-7', config.trophyColor)} />
      </div>

      {/* Team name */}
      <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 text-center mb-1 max-w-[140px] truncate">
        {team.name}
      </p>

      {/* Score */}
      <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 tabular-nums">
        {team.totalAvg?.toFixed(1) || team.score?.toFixed(1) || '0.0'} pts
      </p>

      {/* Podium bar */}
      <div className="w-28 sm:w-36 md:w-44 flex flex-col items-center">
        <div
          className={clsx(
            'w-full rounded-t-xl',
            config.height,
            config.bg,
            'flex items-start justify-center pt-3',
            'shadow-inner',
            'transition-all duration-700'
          )}
        >
          <span
            className={clsx(
              'inline-flex items-center justify-center',
              'px-3 py-1 rounded-full',
              config.labelBg,
              'text-white text-xs sm:text-sm font-bold',
              'shadow-md'
            )}
          >
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Visual podium display for the top 3 teams.
 * Layout: 2nd (left, shorter), 1st (center, tallest), 3rd (right, shortest).
 * Animated entrance with staggered delays.
 *
 * @param {object} props
 * @param {Array} props.teams - Array of top 3 teams (ordered by rank: [1st, 2nd, 3rd])
 * @param {string} [props.className]
 */
export default function LeaderboardPodium({ teams = [], className }) {
  const first = teams[0];
  const second = teams[1];
  const third = teams[2];

  if (!first) {
    return (
      <div
        className={clsx(
          'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
          'p-12 text-center',
          className
        )}
      >
        <TrophyIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Winners will be displayed here after judging.
        </p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'p-6 sm:p-8 shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Title */}
      <h3 className="text-center text-lg font-bold text-gray-900 dark:text-gray-100 mb-8">
        Top Performers
      </h3>

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 sm:gap-4 md:gap-6">
        {second && <PodiumBlock team={second} position={2} />}
        {first && <PodiumBlock team={first} position={1} />}
        {third && <PodiumBlock team={third} position={3} />}
      </div>

      {/* Base platform */}
      <div className="mt-0 mx-auto max-w-lg">
        <div
          className={clsx(
            'h-3 rounded-b-xl',
            'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300',
            'dark:from-gray-600 dark:via-gray-500 dark:to-gray-600',
            'shadow-inner'
          )}
        />
      </div>
    </div>
  );
}
