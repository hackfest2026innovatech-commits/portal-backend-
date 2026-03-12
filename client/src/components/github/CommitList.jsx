import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import Avatar from '../common/Avatar';
import Pagination from '../common/Pagination';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';
import * as githubService from '../../services/github.service';

/**
 * Single commit row within the list.
 */
function CommitRow({ commit }) {
  const {
    sha,
    message = '',
    author = {},
    date,
    additions = 0,
    deletions = 0,
    url,
  } = commit;

  const title = message.split('\n')[0] || 'No message';
  const shortSha = sha?.slice(0, 7) || '-------';
  const timeAgo = date
    ? formatDistanceToNow(new Date(date), { addSuffix: true })
    : '';

  return (
    <div
      className={clsx(
        'flex items-center gap-3 sm:gap-4 px-4 py-3',
        'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        'transition-colors duration-150'
      )}
    >
      {/* SHA */}
      <div className="flex-shrink-0">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {shortSha}
          </a>
        ) : (
          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {shortSha}
          </span>
        )}
      </div>

      {/* Message */}
      <p className="flex-1 min-w-0 text-sm text-gray-900 dark:text-gray-100 truncate">
        {title}
      </p>

      {/* Stats badges */}
      <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
        {additions > 0 && (
          <span
            className={clsx(
              'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium',
              'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            )}
          >
            +{additions}
          </span>
        )}
        {deletions > 0 && (
          <span
            className={clsx(
              'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium',
              'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            -{deletions}
          </span>
        )}
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Avatar
          src={author.avatarUrl}
          name={author.name || author.login || 'Unknown'}
          size="sm"
          className="!h-6 !w-6 !text-[10px] !ring-1"
        />
        <span className="hidden md:inline text-xs text-gray-600 dark:text-gray-400 max-w-[100px] truncate">
          {author.name || author.login || 'Unknown'}
        </span>
      </div>

      {/* Time */}
      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0 w-24 text-right">
        {timeAgo}
      </span>
    </div>
  );
}

/**
 * List of commits with pagination. Fetches from the API if teamId is provided,
 * or accepts commits directly via the commits prop.
 *
 * @param {object} props
 * @param {string} [props.teamId] - Team ID to fetch commits for
 * @param {Array} [props.commits] - Pre-loaded commits array
 * @param {number} [props.pageSize] - Items per page (default 10)
 * @param {string} [props.className]
 */
export default function CommitList({
  teamId,
  commits: externalCommits,
  pageSize = 10,
  className,
}) {
  const [commits, setCommits] = useState(externalCommits || []);
  const [loading, setLoading] = useState(!externalCommits);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCommits = useCallback(
    async (page) => {
      if (!teamId) return;
      setLoading(true);
      try {
        const data = await githubService.getCommits(teamId, {
          page,
          limit: pageSize,
        });
        const items = data.data?.commits || data.commits || data.data || [];
        const pagination = data.data?.pagination || data.pagination || {};
        setCommits(items);
        setTotalPages(pagination.totalPages || Math.ceil((pagination.total || items.length) / pageSize) || 1);
      } catch (err) {
        console.error('Failed to fetch commits:', err);
        setCommits([]);
      } finally {
        setLoading(false);
      }
    },
    [teamId, pageSize]
  );

  useEffect(() => {
    if (externalCommits) {
      setCommits(externalCommits);
      setTotalPages(Math.ceil(externalCommits.length / pageSize) || 1);
      setLoading(false);
    } else {
      fetchCommits(currentPage);
    }
  }, [externalCommits, currentPage, fetchCommits, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (!externalCommits) {
      fetchCommits(page);
    }
  };

  // If using external commits, paginate client-side
  const displayedCommits = externalCommits
    ? commits.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : commits;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="md" label="Loading commits..." />
      </div>
    );
  }

  if (!displayedCommits.length) {
    return (
      <EmptyState
        icon={CodeBracketIcon}
        title="No commits yet"
        description="Commits will appear here once team members start pushing code."
      />
    );
  }

  return (
    <div className={clsx('rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <CodeBracketIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Commits
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({externalCommits ? externalCommits.length : displayedCommits.length} total)
        </span>
      </div>

      {/* Commit rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {displayedCommits.map((commit, idx) => (
          <CommitRow key={commit.sha || commit._id || idx} commit={commit} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
