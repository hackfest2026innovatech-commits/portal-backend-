import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../common/Avatar';

const criteriaConfig = [
  { key: 'innovation', label: 'Innovation', color: 'bg-indigo-500' },
  { key: 'technical', label: 'Technical', color: 'bg-teal-500' },
  { key: 'uiux', label: 'UI/UX', color: 'bg-amber-500' },
  { key: 'presentation', label: 'Presentation', color: 'bg-rose-500' },
];

/**
 * Score bar for a single criterion.
 */
function ScoreBar({ label, value, color }) {
  const pct = (value / 10) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
          {value}/10
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Summary card for a single evaluation: judge name, score breakdown, total, comments, timestamp.
 *
 * @param {object} props
 * @param {object} props.evaluation
 * @param {object} props.evaluation.judge - { name, avatarUrl }
 * @param {object} props.evaluation.scores - { innovation, technical, uiux, presentation }
 * @param {string} [props.evaluation.comments]
 * @param {string} [props.evaluation.createdAt] - ISO timestamp
 * @param {string} [props.className]
 */
export default function EvaluationCard({ evaluation, className }) {
  const { judge = {}, scores = {}, comments, createdAt } = evaluation;

  const totalScore = Object.values(scores).reduce((sum, v) => sum + (v || 0), 0);
  const maxScore = criteriaConfig.length * 10;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : '';

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'p-5 shadow-sm',
        'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',
        'transition-all duration-200',
        className
      )}
    >
      {/* Header: Judge info + total score */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={judge.avatarUrl}
            name={judge.name || 'Judge'}
            size="md"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {judge.name || 'Judge'}
            </p>
            {timeAgo && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</p>
            )}
          </div>
        </div>

        {/* Total score circle */}
        <div
          className={clsx(
            'flex flex-col items-center justify-center',
            'w-14 h-14 rounded-full',
            'border-2',
            percentage >= 80
              ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : percentage >= 50
                ? 'border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                : 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
          )}
        >
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums leading-none">
            {totalScore}
          </span>
          <span className="text-[9px] text-gray-500 dark:text-gray-400">
            /{maxScore}
          </span>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="space-y-2.5 mb-4">
        {criteriaConfig.map((c) => (
          <ScoreBar
            key={c.key}
            label={c.label}
            value={scores[c.key] || 0}
            color={c.color}
          />
        ))}
      </div>

      {/* Comments preview */}
      {comments && (
        <div
          className={clsx(
            'p-3 rounded-lg',
            'bg-gray-50 dark:bg-gray-800/50',
            'border border-gray-100 dark:border-gray-700/50'
          )}
        >
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Comments
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {comments}
          </p>
        </div>
      )}
    </div>
  );
}
