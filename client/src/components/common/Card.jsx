import clsx from 'clsx';

export default function Card({
  children,
  header,
  className,
  padding = true,
  hover = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-xl border bg-white shadow-sm',
        'dark:bg-gray-800 dark:border-gray-700',
        'transition-all duration-200 ease-in-out',
        hover && [
          'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',
          'hover:-translate-y-0.5',
          onClick && 'cursor-pointer',
        ],
        className
      )}
    >
      {header && (
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          {typeof header === 'string' ? (
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {header}
            </h3>
          ) : (
            header
          )}
        </div>
      )}
      <div className={clsx(padding && 'p-6')}>{children}</div>
    </div>
  );
}
