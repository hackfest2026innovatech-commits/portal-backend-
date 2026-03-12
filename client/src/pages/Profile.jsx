import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import { ROLE_LABELS, ROLE_COLORS } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { cn } from '../utils/classNames';
import {
  ArrowLeftIcon,
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

export default function Profile() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="card p-8 animate-fade-in">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mb-4 shadow-glow">
              <span className="text-3xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</h2>
            <span className={cn('mt-2 badge', ROLE_COLORS[user?.role] || 'badge-primary')}>
              {ROLE_LABELS[user?.role] || user?.role || 'Unknown'}
            </span>
          </div>

          <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
            <div className="flex items-center gap-3 pt-4">
              <UserCircleIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{user?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{user?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                <p className="font-medium text-gray-900 dark:text-white">{ROLE_LABELS[user?.role] || user?.role || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Preferences
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDark ? <MoonIcon className="w-5 h-5 text-primary-400" /> : <SunIcon className="w-5 h-5 text-amber-500" />}
                <span className="font-medium text-gray-900 dark:text-white">
                  {isDark ? 'Dark' : 'Light'} Mode
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors duration-300',
                  isDark ? 'bg-primary-600' : 'bg-gray-300'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300',
                    isDark ? 'translate-x-6' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
