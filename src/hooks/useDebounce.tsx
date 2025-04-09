import { useState, useEffect } from 'react';

/**
 * Debounces a value.
 * 
 * @param value The value to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Set up a timer to update the debounced value after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cleanup function: Cancel the timer if the value changes 
      // (i.e., the user keeps typing) or if the component unmounts.
      // This is the core of debouncing – resetting the timer on new input.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-run the effect if the value or delay changes
  );

  // Return the debounced value, which updates only after the delay
  return debouncedValue;
}

// Optional: Export as default if preferred
// export default useDebounce; 