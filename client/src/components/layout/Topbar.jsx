import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Avatar from '../common/Avatar';
import SearchInput from '../common/SearchInput';

export default function Topbar({
  title,
  user,
  unreadCount = 0,
  darkMode = false,
  onToggleDarkMode,
  onToggleSidebar,
  onSearch,
  showSearch = false,
  onLogout,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={clsx(
        'sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-4 sm:px-6',
        'bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 dark:border-gray-800'
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className={clsx(
            'rounded-lg p-2 text-gray-500 lg:hidden',
            'transition-colors duration-150',
            'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'
          )}
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        {title && (
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Center (optional search) */}
      {showSearch && (
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchInput
            placeholder="Search..."
            onChange={onSearch}
          />
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={onToggleDarkMode}
          className={clsx(
            'rounded-lg p-2 text-gray-500 transition-colors duration-150',
            'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'
          )}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className={clsx(
            'relative rounded-lg p-2 text-gray-500 transition-colors duration-150',
            'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'
          )}
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Separator */}
        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-150',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              dropdownOpen && 'bg-gray-100 dark:bg-gray-800'
            )}
          >
            <Avatar
              src={user?.avatar}
              name={user?.name}
              size="sm"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[120px]">
                {user?.name || 'User'}
              </p>
            </div>
            <ChevronDownIcon
              className={clsx(
                'hidden sm:block h-4 w-4 text-gray-400 transition-transform duration-200',
                dropdownOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              className={clsx(
                'absolute right-0 mt-2 w-56 rounded-xl border py-1 shadow-lg',
                'bg-white dark:bg-gray-800 dark:border-gray-700',
                'animate-in fade-in slide-in-from-top-2 duration-200'
              )}
            >
              <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || ''}
                </p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
                className={clsx(
                  'flex w-full items-center gap-3 px-4 py-2.5 text-sm',
                  'text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                  'transition-colors duration-150'
                )}
              >
                <UserCircleIcon className="h-4 w-4 text-gray-400" />
                Profile
              </button>

              <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout?.();
                }}
                className={clsx(
                  'flex w-full items-center gap-3 px-4 py-2.5 text-sm',
                  'text-red-600 dark:text-red-400',
                  'hover:bg-red-50 dark:hover:bg-red-500/10',
                  'transition-colors duration-150'
                )}
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
