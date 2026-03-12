import { clsx } from 'clsx';

/**
 * Utility function for conditionally joining class names.
 * Combines clsx for conditional classes.
 *
 * @param  {...any} inputs - Class name values (strings, objects, arrays)
 * @returns {string} Merged class name string
 *
 * @example
 * cn('base-class', isActive && 'active', { 'bg-red': hasError })
 */
export function cn(...inputs) {
  return clsx(inputs);
}
