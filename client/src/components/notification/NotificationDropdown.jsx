import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';
import Spinner from '../common/Spinner';

/**
 * Dropdown panel anchored to the notification bell.
 * Shows the last 5 notifications with "Mark all read" and "View all" links.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the dropdown is visible
 * @param {Function} props.onClose - Close the dropdown
 * @param {Function} [props.onViewAll] - Navigate to full notifications page
 * @param {string} [props.className]
 */
export default function NotificationDropdown({
  isOpen,
  onClose,
  onViewAll,
  className,
}) {
  const { notifications, loading, markAsRead, markAllRead, unreadCount } =
    useNotifications();
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // Allow clicks on the bell button itself (parent handles toggle)
        const bell = dropdownRef.current.previousElementSibling;
        if (bell && bell.contains(e.target)) return;
        onClose();
      }
    }

    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const recentNotifications = notifications.slice(0, 5);

  const handleItemClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
  };

  const handleMarkAllRead = (e) => {
    e.preventDefault();
    markAllRead();
  };

  const handleViewAll = (e) => {
    e.preventDefault();
    onClose();
    onViewAll?.();
  };

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        'absolute right-0 top-full mt-2 z-50',
        'w-80 sm:w-96',
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50',
        'overflow-hidden',
        'animate-in fade-in slide-in-from-top-2',
        className
      )}
      role="menu"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
              {unreadCount} unread
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-[360px] overflow-y-auto">
        {loading && !recentNotifications.length ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="sm" label="Loading..." />
          </div>
        ) : recentNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {recentNotifications.map((notification) => (
              <NotificationItem
                key={notification._id || notification.id}
                notification={notification}
                onClick={() => handleItemClick(notification)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
              <svg
                className="h-6 w-6 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No notifications yet
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {recentNotifications.length > 0 && onViewAll && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleViewAll}
            className={clsx(
              'block w-full px-4 py-3 text-center text-sm font-medium',
              'text-indigo-600 dark:text-indigo-400',
              'hover:bg-gray-50 dark:hover:bg-gray-700/50',
              'transition-colors duration-150'
            )}
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
