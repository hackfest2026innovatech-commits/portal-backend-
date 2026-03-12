import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../common/Avatar';

/**
 * Individual commit card showing author, message, SHA, time, and file stats.
 *
 * @param {object} props
 * @param {object} props.commit
 * @param {string} props.commit.sha - Full commit SHA
 * @param {string} props.commit.message - Commit message
 * @param {object} props.commit.author - { name, avatarUrl, login }
 * @param {string} props.commit.date - ISO timestamp
 * @param {number} [props.commit.additions] - Lines added
 * @param {number} [props.commit.deletions] - Lines deleted
 * @param {number} [props.commit.filesChanged] - Number of files changed
 * @param {string} [props.commit.url] - Link to commit on GitHub
 * @param {string} [props.className]
 */
export default function CommitCard({ commit, className }) {
  const {
    sha,
    message = '',
    author = {},
    date,
    additions = 0,
    deletions = 0,
    filesChanged,
    url,
  } = commit;

  const lines = message.split('\n');
  const title = lines[0] || 'No message';
  const body = lines.slice(1).join('\n').trim();
  const shortSha = sha?.slice(0, 7) || '-------';

  const timeAgo = date
    ? formatDistanceToNow(new Date(date), { addSuffix: true })
    : '';

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'p-4 sm:p-5',
        'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',
        'transition-all duration-200',
        className
      )}
    >
      {/* Header: avatar + author + time */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            src={author.avatarUrl}
            name={author.name || author.login || 'Unknown'}
            size="sm"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {author.name || author.login || 'Unknown'}
            </p>
            {author.login && author.name && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                @{author.login}
              </p>
            )}
          </div>
        </div>
        {timeAgo && (
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
            {timeAgo}
          </span>
        )}
      </div>

      {/* Commit message */}
      <div className="mb-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
          {title}
        </p>
        {body && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 whitespace-pre-line">
            {body}
          </p>
        )}
      </div>

      {/* Footer: SHA + file stats */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
        {/* SHA link */}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'inline-flex items-center gap-1.5 px-2 py-1 rounded-md',
              'bg-gray-100 dark:bg-gray-700/50',
              'text-xs font-mono text-indigo-600 dark:text-indigo-400',
              'hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
              'transition-colors duration-150'
            )}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {shortSha}
          </a>
        ) : (
          <span
            className={clsx(
              'inline-flex items-center px-2 py-1 rounded-md',
              'bg-gray-100 dark:bg-gray-700/50',
              'text-xs font-mono text-gray-600 dark:text-gray-400'
            )}
          >
            {shortSha}
          </span>
        )}

        {/* File stats */}
        <div className="flex items-center gap-2">
          {filesChanged !== undefined && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {filesChanged} file{filesChanged !== 1 ? 's' : ''}
            </span>
          )}
          {(additions > 0 || deletions > 0) && (
            <div className="flex items-center gap-1.5">
              <span
                className={clsx(
                  'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono font-medium',
                  'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                )}
              >
                +{additions}
              </span>
              <span
                className={clsx(
                  'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono font-medium',
                  'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                )}
              >
                -{deletions}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
