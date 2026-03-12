import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  MegaphoneIcon,
  BellIcon,
} from '@heroicons/react/24/solid';

const typeConfig = {
  info: {
    icon: InformationCircleIcon,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    icon: CheckCircleIcon,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  error: {
    icon: XCircleIcon,
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  announcement: {
    icon: MegaphoneIcon,
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
};

const defaultConfig = {
  icon: BellIcon,
  iconBg: 'bg-gray-100 dark:bg-gray-700',
  iconColor: 'text-gray-500 dark:text-gray-400',
};

/**
 * Single notification row with type icon, message, relative time, and read/unread styling.
 *
 * @param {object} props
 * @param {object} props.notification
 * @param {string} props.notification.type - info | success | warning | error | announcement
 * @param {string} props.notification.message - Notification message text
 * @param {string} [props.notification.title] - Optional title
 * @param {string} props.notification.createdAt - ISO timestamp
 * @param {boolean} props.notification.read - Whether it has been read
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className]
 */
export default function NotificationItem({ notification, onClick, className }) {
  const { type, message, title, createdAt, read } = notification;
  const config = typeConfig[type] || defaultConfig;
  const Icon = config.icon;

  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : '';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={clsx(
        'flex items-start gap-3 px-4 py-3',
        'transition-colors duration-150',
        onClick && 'cursor-pointer',
        !read && 'bg-indigo-50/50 dark:bg-indigo-900/10',
        read
          ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
          : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
        className
      )}
    >
      {/* Type icon */}
      <div
        className={clsx(
          'flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full',
          config.iconBg
        )}
      >
        <Icon className={clsx('h-4 w-4', config.iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p
            className={clsx(
              'text-sm leading-snug truncate',
              read
                ? 'font-medium text-gray-700 dark:text-gray-300'
                : 'font-semibold text-gray-900 dark:text-gray-100'
            )}
          >
            {title}
          </p>
        )}
        <p
          className={clsx(
            'text-sm leading-snug',
            !title && !read && 'font-semibold',
            read
              ? 'text-gray-500 dark:text-gray-400'
              : 'text-gray-700 dark:text-gray-200',
            title && 'mt-0.5 text-xs'
          )}
        >
          {message}
        </p>
        {timeAgo && (
          <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
            {timeAgo}
          </p>
        )}
      </div>

      {/* Unread dot */}
      {!read && (
        <span className="flex-shrink-0 mt-2 h-2 w-2 rounded-full bg-indigo-500" />
      )}
    </div>
  );
}
