import { forwardRef } from 'react';
import clsx from 'clsx';
import Spinner from './Spinner';

const variantStyles = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm shadow-indigo-500/25 dark:shadow-indigo-500/10',
  secondary:
    'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm shadow-red-500/25 dark:shadow-red-500/10',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm shadow-emerald-500/25 dark:shadow-emerald-500/10',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
};

const iconOnlySizeStyles = {
  sm: 'p-1.5 rounded-md',
  md: 'p-2 rounded-lg',
  lg: 'p-3 rounded-lg',
};

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon: Icon,
      fullWidth = false,
      type = 'button',
      onClick,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const isIconOnly = Icon && !children;

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={clsx(
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          'active:scale-[0.98]',
          variantStyles[variant],
          isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
          fullWidth && 'w-full',
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        {...rest}
      >
        {loading ? (
          <>
            <Spinner
              size="sm"
              className={clsx(
                variant === 'primary' || variant === 'danger' || variant === 'success'
                  ? 'text-white/70'
                  : 'text-gray-400'
              )}
            />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {Icon && (
              <Icon
                className={clsx(
                  size === 'sm' && 'h-3.5 w-3.5',
                  size === 'md' && 'h-4 w-4',
                  size === 'lg' && 'h-5 w-5'
                )}
              />
            )}
            {children && <span>{children}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
