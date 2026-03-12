import { useNotifications } from '../hooks/useNotifications';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import { timeAgo } from '../utils/formatters';
import { cn } from '../utils/classNames';
import {
  BellIcon,
  CheckIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

const typeIcons = {
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  error: XCircleIcon,
  announcement: MegaphoneIcon,
};

const typeColors = {
  info: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  warning: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
  success: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  error: 'text-red-500 bg-red-100 dark:bg-red-900/30',
  announcement: 'text-primary-500 bg-primary-100 dark:bg-primary-900/30',
};

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllRead, loading } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-secondary text-sm gap-1.5">
              <CheckIcon className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 card">
              <BellIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                You will see notifications here when there are updates.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = typeIcons[notification.type] || InformationCircleIcon;
              const colorClass = typeColors[notification.type] || typeColors.info;

              return (
                <div
                  key={notification._id}
                  className={cn(
                    'card p-4 flex items-start gap-4 transition-all duration-200',
                    !notification.read && 'border-l-4 border-l-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={cn('font-medium', !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300')}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                      title="Mark as read"
                    >
                      <CheckIcon className="w-4 h-4 text-gray-400 hover:text-primary-500" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
