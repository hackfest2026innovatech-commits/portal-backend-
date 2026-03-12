import { forwardRef } from 'react';
import clsx from 'clsx';

const Textarea = forwardRef(
  (
    {
      label,
      error,
      maxLength,
      showCount = false,
      id,
      className,
      disabled = false,
      required = false,
      value,
      rows = 4,
      ...rest
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const charCount = value?.length || 0;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          className={clsx(
            'block w-full rounded-lg border bg-white px-3 py-2.5 text-sm resize-y',
            'transition-all duration-200 ease-in-out',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'dark:bg-gray-800/50 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/50'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-gray-600 dark:focus:border-indigo-500',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
            className
          )}
          {...rest}
        />
        <div className="mt-1.5 flex items-center justify-between">
          <div>
            {error && (
              <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
            )}
          </div>
          {showCount && (
            <p
              className={clsx(
                'text-xs',
                maxLength && charCount >= maxLength
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-gray-400 dark:text-gray-500'
              )}
            >
              {charCount}
              {maxLength ? ` / ${maxLength}` : ''}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
