import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  TrophyIcon,
  BellIcon,
  ArrowDownTrayIcon,
  UsersIcon,
  CodeBracketIcon,
  ChevronLeftIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const menuConfig = {
  superadmin: [
    { label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { label: 'Teams', icon: UserGroupIcon, path: '/teams' },
    { label: 'Timer', icon: ClockIcon, path: '/timer' },
    { label: 'Forms', icon: DocumentTextIcon, path: '/forms' },
    { label: 'Leaderboard', icon: TrophyIcon, path: '/leaderboard' },
    { label: 'Notifications', icon: BellIcon, path: '/notifications/manage' },
    { label: 'Export', icon: ArrowDownTrayIcon, path: '/export' },
    { label: 'Users', icon: UsersIcon, path: '/admin/users' },
  ],
  student: [
    { label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { label: 'My Team', icon: UserGroupIcon, path: '/my-team' },
    { label: 'Forms', icon: DocumentTextIcon, path: '/my-forms' },
    { label: 'Commits', icon: CodeBracketIcon, path: '/my-commits' },
    { label: 'Notifications', icon: BellIcon, path: '/notifications' },
  ],
  judge: [
    { label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { label: 'Assignments', icon: ClipboardDocumentCheckIcon, path: '/assignments' },
    { label: 'Leaderboard', icon: TrophyIcon, path: '/leaderboard' },
    { label: 'Notifications', icon: BellIcon, path: '/notifications' },
  ],
};

export default function Sidebar({ role = 'student', collapsed, onToggle }) {
  const location = useLocation();
  const items = menuConfig[role] || menuConfig.student;

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-40 flex flex-col border-r',
        'bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 dark:border-gray-800',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Logo area */}
      <div
        className={clsx(
          'flex h-16 items-center border-b border-gray-200 dark:border-gray-800 px-4',
          collapsed ? 'justify-center' : 'justify-between'
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
            <RocketLaunchIcon className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
              HackPortal
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className={clsx(
              'rounded-lg p-1.5 text-gray-400 transition-colors duration-150',
              'hover:bg-gray-100 hover:text-gray-600',
              'dark:hover:bg-gray-800 dark:hover:text-gray-300'
            )}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={clsx(
                    'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium',
                    'transition-all duration-200 ease-in-out',
                    collapsed ? 'justify-center' : 'gap-3',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={clsx(
                      'h-5 w-5 flex-shrink-0 transition-colors duration-200',
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}

                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 h-8 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle for collapsed state */}
      {collapsed && (
        <div className="border-t border-gray-200 dark:border-gray-800 p-3">
          <button
            onClick={onToggle}
            className={clsx(
              'flex w-full items-center justify-center rounded-lg p-2 text-gray-400',
              'transition-colors duration-150',
              'hover:bg-gray-100 hover:text-gray-600',
              'dark:hover:bg-gray-800 dark:hover:text-gray-300'
            )}
          >
            <ChevronLeftIcon className="h-4 w-4 rotate-180" />
          </button>
        </div>
      )}
    </aside>
  );
}
