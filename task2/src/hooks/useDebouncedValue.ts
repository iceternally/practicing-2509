'use client';

import { useEffect, useState } from 'react';

/**
 * Debounce any value changes over a specified delay.
 * Useful for search inputs, filter sliders, etc.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}