import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import {
  CodeBracketIcon,
  UsersIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

/**
 * Single stat item.
 */
function StatItem({ icon: Icon, label, value, iconColor }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={clsx(
          'flex items-center justify-center h-10 w-10 rounded-lg',
          'bg-gray-100 dark:bg-gray-700/50'
        )}
      >
        <Icon className={clsx('h-5 w-5', iconColor)} />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
          {value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

/**
 * Card showing repository statistics: total commits, contributors, last commit time, and repo link.
 *
 * @param {object} props
 * @param {number} [props.totalCommits] - Total number of commits
 * @param {number} [props.totalContributors] - Number of unique contributors
 * @param {string} [props.lastCommitTime] - ISO timestamp of last commit
 * @param {string} [props.repoUrl] - URL to the GitHub repository
 * @param {string} [props.repoName] - Repository name (e.g. "org/repo")
 * @param {string} [props.className]
 */
export default function RepoStatsCard({
  totalCommits = 0,
  totalContributors = 0,
  lastCommitTime,
  repoUrl,
  repoName,
  className,
}) {
  const lastCommitAgo = lastCommitTime
    ? formatDistanceToNow(new Date(lastCommitTime), { addSuffix: true })
    : 'N/A';

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'p-5 sm:p-6 shadow-sm',
        className
      )}
    >
      {/* Header with repo link */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
          Repository Stats
        </h3>
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
              'hover:bg-gray-200 dark:hover:bg-gray-600',
              'transition-colors duration-150'
            )}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {repoName || 'View Repo'}
            <ArrowTopRightOnSquareIcon className="h-3 w-3" />
          </a>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatItem
          icon={CodeBracketIcon}
          label="Total Commits"
          value={totalCommits.toLocaleString()}
          iconColor="text-indigo-500"
        />
        <StatItem
          icon={UsersIcon}
          label="Contributors"
          value={totalContributors.toLocaleString()}
          iconColor="text-teal-500"
        />
        <StatItem
          icon={ClockIcon}
          label="Last Commit"
          value={lastCommitAgo}
          iconColor="text-amber-500"
        />
      </div>
    </div>
  );
}
