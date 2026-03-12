import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { TrophyIcon } from '@heroicons/react/24/solid';

const MEDAL_COLORS = {
  1: 'text-amber-400',
  2: 'text-gray-400',
  3: 'text-amber-700 dark:text-amber-600',
};

const MEDAL_BG = {
  1: 'bg-amber-50 dark:bg-amber-900/20',
  2: 'bg-gray-50 dark:bg-gray-800/50',
  3: 'bg-orange-50 dark:bg-orange-900/20',
};

/**
 * Position display with medal for top 3.
 */
function PositionBadge({ position }) {
  if (position <= 3) {
    return (
      <div
        className={clsx(
          'inline-flex items-center justify-center w-8 h-8 rounded-full',
          MEDAL_BG[position]
        )}
      >
        <TrophyIcon className={clsx('h-5 w-5', MEDAL_COLORS[position])} />
      </div>
    );
  }

  return (
    <div className="inline-flex items-center justify-center w-8 h-8">
      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 tabular-nums">
        {position}
      </span>
    </div>
  );
}

/**
 * Score progress bar.
 */
function ScoreBar({ value, max = 10, color = 'bg-indigo-500' }) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-300', color)}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 tabular-nums w-8 text-right">
        {value?.toFixed(1)}
      </span>
    </div>
  );
}

/**
 * Sortable column header.
 */
function SortableHeader({ label, field, sortField, sortOrder, onSort, className }) {
  const isActive = sortField === field;

  return (
    <button
      onClick={() => onSort(field)}
      className={clsx(
        'inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide',
        'hover:text-gray-900 dark:hover:text-gray-100',
        'transition-colors duration-150',
        isActive
          ? 'text-gray-900 dark:text-gray-100'
          : 'text-gray-500 dark:text-gray-400',
        className
      )}
    >
      {label}
      <span className="inline-flex flex-col -space-y-1">
        <ChevronUpIcon
          className={clsx(
            'h-3 w-3',
            isActive && sortOrder === 'asc' ? 'text-indigo-500' : 'text-gray-300 dark:text-gray-600'
          )}
        />
        <ChevronDownIcon
          className={clsx(
            'h-3 w-3',
            isActive && sortOrder === 'desc' ? 'text-indigo-500' : 'text-gray-300 dark:text-gray-600'
          )}
        />
      </span>
    </button>
  );
}

/**
 * Ranked leaderboard table with medal positions, scores, progress bars, and sorting.
 *
 * @param {object} props
 * @param {Array} props.teams - Array of team data:
 *   { _id, name, totalAvg, innovation, technical, uiux, presentation, commitCount }
 * @param {string} [props.className]
 */
export default function LeaderboardTable({ teams = [], className }) {
  const [sortField, setSortField] = useState('totalAvg');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [teams, sortField, sortOrder]);

  if (!teams.length) {
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
          Leaderboard data not available yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'shadow-sm overflow-hidden',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  #
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Team
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <SortableHeader
                  label="Total"
                  field="totalAvg"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <SortableHeader
                  label="Innovation"
                  field="innovation"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <SortableHeader
                  label="Technical"
                  field="technical"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <SortableHeader
                  label="UI/UX"
                  field="uiux"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <SortableHeader
                  label="Present."
                  field="presentation"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                <SortableHeader
                  label="Commits"
                  field="commitCount"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {sortedTeams.map((team, idx) => {
              const position = idx + 1;
              const totalPct = team.totalAvg ? (team.totalAvg / 10) * 100 : 0;

              return (
                <tr
                  key={team._id || idx}
                  className={clsx(
                    'transition-colors duration-150',
                    idx % 2 === 0
                      ? 'bg-white dark:bg-gray-800'
                      : 'bg-gray-50/50 dark:bg-gray-800/30',
                    'hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10',
                    position <= 3 && 'font-medium'
                  )}
                >
                  {/* Position */}
                  <td className="px-4 py-3">
                    <PositionBadge position={position} />
                  </td>

                  {/* Team name */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {team.name}
                    </span>
                  </td>

                  {/* Total average with progress bar */}
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                        {team.totalAvg?.toFixed(1) || '0.0'}
                      </span>
                      <div className="w-24 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <div
                          className={clsx(
                            'h-full rounded-full transition-all duration-500',
                            totalPct >= 80
                              ? 'bg-emerald-500'
                              : totalPct >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          )}
                          style={{ width: `${Math.min(100, totalPct)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Criteria scores */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <ScoreBar value={team.innovation || 0} color="bg-indigo-500" />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <ScoreBar value={team.technical || 0} color="bg-teal-500" />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <ScoreBar value={team.uiux || 0} color="bg-amber-500" />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <ScoreBar value={team.presentation || 0} color="bg-rose-500" />
                  </td>

                  {/* Commit count */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={clsx(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      )}
                    >
                      {team.commitCount || 0}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
