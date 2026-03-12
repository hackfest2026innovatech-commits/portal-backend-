import { Outlet } from 'react-router-dom';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

export default function PublicLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-950 px-4 py-12">
      {/* Gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30 blur-3xl dark:from-indigo-600/20 dark:to-purple-600/20" />
        <div className="absolute -bottom-1/2 -right-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 blur-3xl dark:from-cyan-600/10 dark:to-blue-600/10" />
        <div className="absolute top-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-pink-400/15 to-rose-400/15 blur-3xl dark:from-pink-600/10 dark:to-rose-600/10" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25">
            <RocketLaunchIcon className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            HackPortal
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Hackathon Management Platform
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200/50 bg-white/70 p-8 shadow-xl shadow-gray-900/5 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/70 dark:shadow-gray-900/30">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
          &copy; {new Date().getFullYear()} HackPortal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
