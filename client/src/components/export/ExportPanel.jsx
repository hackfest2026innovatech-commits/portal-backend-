import clsx from 'clsx';
import {
  UsersIcon,
  StarIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import ExportButton from './ExportButton';
import * as exportService from '../../services/export.service';

const exportOptions = [
  {
    key: 'teams',
    title: 'Teams',
    description: 'Export all registered teams with member details, GitHub repos, and contact information.',
    icon: UsersIcon,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-50 dark:bg-indigo-900/30',
    exportFn: () => exportService.exportTeams('csv'),
    filename: 'hackathon-teams.csv',
  },
  {
    key: 'scores',
    title: 'Scores',
    description: 'Export all evaluation scores from judges with per-criterion breakdowns and comments.',
    icon: StarIcon,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-900/30',
    exportFn: () => exportService.exportScores('csv'),
    filename: 'hackathon-scores.csv',
  },
  {
    key: 'submissions',
    title: 'Submissions',
    description: 'Export all form responses and project submissions with timestamps.',
    icon: DocumentTextIcon,
    iconColor: 'text-teal-500',
    iconBg: 'bg-teal-50 dark:bg-teal-900/30',
    exportFn: () => exportService.exportSubmissions(undefined, 'csv'),
    filename: 'hackathon-submissions.csv',
  },
  {
    key: 'report',
    title: 'Full Report',
    description: 'Comprehensive hackathon report with teams, scores, submissions, and commit statistics.',
    icon: CodeBracketIcon,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-900/30',
    exportFn: () => exportService.exportFullReport(),
    filename: 'hackathon-full-report.csv',
  },
];

/**
 * Panel displaying export options with descriptive cards. Each card has an ExportButton.
 *
 * @param {object} props
 * @param {string} [props.className]
 */
export default function ExportPanel({ className }) {
  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <ArrowDownTrayIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Export Data
        </h2>
      </div>

      {/* Export cards grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exportOptions.map((option) => {
            const Icon = option.icon;

            return (
              <div
                key={option.key}
                className={clsx(
                  'flex flex-col justify-between p-5 rounded-xl',
                  'border border-gray-200 dark:border-gray-700',
                  'hover:border-gray-300 dark:hover:border-gray-600',
                  'hover:shadow-sm',
                  'transition-all duration-200'
                )}
              >
                <div className="mb-4">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={clsx(
                        'flex items-center justify-center h-10 w-10 rounded-lg',
                        option.iconBg
                      )}
                    >
                      <Icon className={clsx('h-5 w-5', option.iconColor)} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {option.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {option.description}
                  </p>
                </div>

                {/* Export button */}
                <ExportButton
                  exportFn={option.exportFn}
                  filename={option.filename}
                  label={`Export ${option.title}`}
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
