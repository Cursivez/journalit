

import { useState, useEffect, useRef, useCallback } from 'react';


export function useDebounced<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


export function useDebouncedFunction<Args extends any[], Return>(
  fn: (...args: Args) => Return,
  delay: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = { leading: false, trailing: true }
): (...args: Args) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const lastArgsRef = useRef<Args | null>(null);

  const debouncedFn = useCallback(
    (...args: Args) => {
      const now = Date.now();
      lastArgsRef.current = args;

      const callNow =
        options.leading &&
        (!lastCallTimeRef.current || now - lastCallTimeRef.current > delay);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (callNow) {
        lastCallTimeRef.current = now;
        fn(...args);
      } else if (options.trailing) {
        timeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            lastCallTimeRef.current = Date.now();
            fn(...lastArgsRef.current);
          }
        }, delay);
      }
    },
    [fn, delay, options.leading, options.trailing]
  );

  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn;
}
