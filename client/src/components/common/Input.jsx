import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      type = 'text',
      id,
      className,
      disabled = false,
      required = false,
      ...rest
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={clsx(
              'block w-full rounded-lg border bg-white px-3 py-2.5 text-sm',
              'transition-all duration-200 ease-in-out',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'dark:bg-gray-800/50 dark:text-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              Icon && 'pl-9',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/50'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-gray-600 dark:focus:border-indigo-500',
              disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
              className
            )}
            {...rest}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
