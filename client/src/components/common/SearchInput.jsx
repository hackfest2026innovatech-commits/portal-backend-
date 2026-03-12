import { useState, useEffect, useRef, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export default function SearchInput({
  value: controlledValue,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
}) {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const debouncedOnChange = useCallback(
    (val) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange?.(val);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setInternalValue(val);
    debouncedOnChange(val);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  return (
    <div className={clsx('relative', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={clsx(
          'block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-9 text-sm',
          'transition-all duration-200 ease-in-out',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-100',
          'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:border-indigo-500'
        )}
      />
      {internalValue && (
        <button
          onClick={handleClear}
          className={clsx(
            'absolute inset-y-0 right-0 flex items-center pr-3',
            'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300',
            'transition-colors duration-150'
          )}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
