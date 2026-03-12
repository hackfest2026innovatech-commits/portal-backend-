import clsx from 'clsx';

export default function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={clsx('border-b border-gray-200 dark:border-gray-700', className)}>
      <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          const Icon = tab.icon;

          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={clsx(
                'group relative inline-flex items-center gap-2 whitespace-nowrap pb-3 pt-1 text-sm font-medium',
                'transition-all duration-200 ease-in-out',
                'focus:outline-none',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              {Icon && (
                <Icon
                  className={clsx(
                    'h-4 w-4 transition-colors duration-200',
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                  )}
                />
              )}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    isActive
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  )}
                >
                  {tab.count}
                </span>
              )}

              {/* Active indicator */}
              <span
                className={clsx(
                  'absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-all duration-200',
                  isActive
                    ? 'bg-indigo-600 dark:bg-indigo-400'
                    : 'bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600'
                )}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
