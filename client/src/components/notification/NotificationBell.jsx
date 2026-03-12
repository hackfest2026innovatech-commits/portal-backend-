import { useState, useCallback } from 'react';
import clsx from 'clsx';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

/**
 * Bell icon with unread count badge. Click toggles the notification dropdown.
 *
 * @param {object} props
 * @param {Function} [props.onViewAll] - Navigate to the full notifications page
 * @param {string} [props.className]
 */
export default function NotificationBell({ onViewAll, className }) {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className={clsx('relative', className)}>
      {/* Bell button */}
      <button
        type="button"
        onClick={toggle}
        className={clsx(
          'relative inline-flex items-center justify-center',
          'h-10 w-10 rounded-lg',
          'text-gray-500 dark:text-gray-400',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          'transition-all duration-200',
          isOpen && 'bg-gray-100 dark:bg-gray-800'
        )}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <BellIcon className="h-5 w-5" />

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span
            className={clsx(
              'absolute -top-0.5 -right-0.5',
              'inline-flex items-center justify-center',
              'min-w-[18px] h-[18px] px-1',
              'rounded-full text-[10px] font-bold leading-none',
              'bg-red-500 text-white',
              'ring-2 ring-white dark:ring-gray-900',
              'animate-in zoom-in duration-200'
            )}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <NotificationDropdown
        isOpen={isOpen}
        onClose={close}
        onViewAll={onViewAll}
      />
    </div>
  );
}
