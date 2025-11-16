import { useEffect, useState } from "react";

/**
 * useDebounce
 * Returns debounced value that updates after `delay` ms of inactivity.
 */
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
