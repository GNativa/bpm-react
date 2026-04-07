import { useEffect, useState } from "react";

/**
 * @param {string} value 
 * @param {number} delay 
 * @returns 
 */
export function useDebounce(value, delay = 1000) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value]);

  return debounced;
}