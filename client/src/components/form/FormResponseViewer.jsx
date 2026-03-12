import clsx from 'clsx';
import {
  DocumentTextIcon,
  PaperClipIcon,
  LinkIcon,
  ChatBubbleLeftIcon,
  Bars3BottomLeftIcon,
} from '@heroicons/react/24/outline';

const typeIcons = {
  text: ChatBubbleLeftIcon,
  textarea: Bars3BottomLeftIcon,
  file: PaperClipIcon,
  link: LinkIcon,
};

/**
 * Displays submitted form answers in a read-only format.
 * Shows question labels paired with their answer values.
 *
 * @param {object} props
 * @param {object} props.form - Form definition { title, description, fields: [...] }
 * @param {object} props.response - Submitted response { answers: [{ question, value, type, fieldId }], submittedAt, submittedBy }
 * @param {string} [props.className]
 */
export default function FormResponseViewer({ form, response, className }) {
  if (!response || !response.answers?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No response data available.
        </p>
      </div>
    );
  }

  const { answers, submittedAt, submittedBy } = response;

  const renderValue = (answer) => {
    const { value, type } = answer;

    if (!value && value !== 0) {
      return (
        <span className="text-sm italic text-gray-400 dark:text-gray-500">
          No answer provided
        </span>
      );
    }

    switch (type) {
      case 'link':
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'inline-flex items-center gap-1.5 text-sm',
              'text-indigo-600 dark:text-indigo-400',
              'hover:text-indigo-700 dark:hover:text-indigo-300',
              'hover:underline',
              'transition-colors duration-150'
            )}
          >
            <LinkIcon className="h-3.5 w-3.5" />
            {value}
          </a>
        );

      case 'file':
        if (typeof value === 'string') {
          return (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
                'bg-gray-100 dark:bg-gray-700/50',
                'text-sm text-gray-700 dark:text-gray-300',
                'hover:bg-gray-200 dark:hover:bg-gray-700',
                'transition-colors duration-150'
              )}
            >
              <PaperClipIcon className="h-4 w-4 text-gray-500" />
              View uploaded file
            </a>
          );
        }
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            File uploaded
          </span>
        );

      case 'textarea':
        return (
          <div
            className={clsx(
              'p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap',
              'bg-gray-50 dark:bg-gray-800/50',
              'border border-gray-200 dark:border-gray-700',
              'text-gray-700 dark:text-gray-300'
            )}
          >
            {value}
          </div>
        );

      default:
        return (
          <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
        );
    }
  };

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 mb-1">
          <DocumentTextIcon className="h-5 w-5 text-indigo-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {form?.title || 'Form Response'}
          </h2>
        </div>
        <div className="flex items-center gap-4 mt-1">
          {submittedBy && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Submitted by: <strong className="font-medium text-gray-700 dark:text-gray-300">{typeof submittedBy === 'object' ? submittedBy.name : submittedBy}</strong>
            </span>
          )}
          {submittedAt && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(submittedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Answers */}
      <div className="p-6 divide-y divide-gray-100 dark:divide-gray-700/50">
        {answers.map((answer, idx) => {
          const Icon = typeIcons[answer.type] || ChatBubbleLeftIcon;

          return (
            <div
              key={answer.fieldId || idx}
              className={clsx('py-4 first:pt-0 last:pb-0')}
            >
              {/* Question label */}
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {answer.question}
                </h4>
              </div>

              {/* Answer value */}
              <div className="ml-6">{renderValue(answer)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
