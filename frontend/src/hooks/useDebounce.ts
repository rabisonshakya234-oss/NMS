'use client';
import { useEffect, useState } from 'react';

// Returns `value` only after it stopped changing for `delay` ms.
export default function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
