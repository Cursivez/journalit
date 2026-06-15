


type DebouncedFunction<Args extends unknown[], Result> = {
  (...args: Args): Result | undefined;
  cancel: () => void;
  flush: () => Result | undefined;
  pending: () => boolean;
};


type DebouncedAsyncFunction<Args extends unknown[], Result> = {
  (...args: Args): Promise<Result | undefined>;
  cancel: () => void;
  flush: () => Promise<Result | undefined>;
};


export function debounce<Args extends unknown[], Result>(
  func: (this: unknown, ...args: Args) => Result,
  delay: number,
  options?: {
    leading?: boolean; 
    trailing?: boolean; 
    maxWait?: number; 
  }
): DebouncedFunction<Args, Result> {
  let timeoutId: number | null = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime = 0;
  let lastArgs: Args | null = null;
  let result: Result | undefined;

  const { leading = false, trailing = true, maxWait } = options || {};

  const invokeFunc = (thisArg: unknown, time: number): Result | undefined => {
    const args = lastArgs;

    lastArgs = null;
    lastInvokeTime = time;
    if (!args) {
      return result;
    }

    result = func(...args);
    return result;
  };

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    
    
    
    return (
      lastCallTime === null ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = delay - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function leadingEdge(_thisArg: unknown, time: number) {
    
    lastInvokeTime = time;
    
    timeoutId = window.setTimeout(timerExpired, delay);
    
    return leading ? invokeFunc(undefined, time) : result;
  }

  function trailingEdge(_thisArg: unknown, time: number) {
    timeoutId = null;

    
    
    if (trailing && lastArgs) {
      return invokeFunc(undefined, time);
    }
    lastArgs = null;
    return result;
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(undefined, time);
    }
    
    timeoutId = window.setTimeout(timerExpired, remainingWait(time));
  }

  function cancel() {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = timeoutId = null;
  }

  function flush() {
    return timeoutId === null ? result : trailingEdge(undefined, Date.now());
  }

  function pending() {
    return timeoutId !== null;
  }

  const debounced: DebouncedFunction<Args, Result> = Object.assign(
    function (this: unknown, ...args: Args): Result | undefined {
      const time = Date.now();
      const isInvoking = shouldInvoke(time);

      lastArgs = args;
      lastCallTime = time;

      if (isInvoking) {
        if (timeoutId === null) {
          return leadingEdge(undefined, lastCallTime);
        }
        if (maxWait !== undefined) {
          
          timeoutId = window.setTimeout(timerExpired, delay);
          return invokeFunc(undefined, lastCallTime);
        }
      }
      if (timeoutId === null) {
        timeoutId = window.setTimeout(timerExpired, delay);
      }
      return result;
    },
    { cancel, flush, pending }
  );

  return debounced;
}


export function debounceAsync<Args extends unknown[], Result>(
  func: (this: unknown, ...args: Args) => Promise<Result>,
  delay: number
): DebouncedAsyncFunction<Args, Result> {
  let timeoutId: number | null = null;
  let pendingPromise: Promise<Result | undefined> | null = null;
  let resolvePromise: ((value: Result | undefined) => void) | null = null;
  let rejectPromise: ((reason: unknown) => void) | null = null;
  let lastArgs: Args | null = null;

  function cancel() {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    
    if (resolvePromise) {
      resolvePromise(undefined);
      resolvePromise = rejectPromise = null;
      pendingPromise = null;
    }
  }

  async function flush(): Promise<Result | undefined> {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;

      if (pendingPromise && lastArgs) {
        try {
          const flushResult = await func(...lastArgs);
          if (resolvePromise) {
            resolvePromise(flushResult);
          }
          return flushResult;
        } catch (error) {
          if (rejectPromise) {
            rejectPromise(error);
          }
          throw error;
        }
      }
    }
    return undefined;
  }

  const debouncedAsync: DebouncedAsyncFunction<Args, Result> = Object.assign(
    function (this: unknown, ...args: Args): Promise<Result | undefined> {
      lastArgs = args;
      cancel();

      pendingPromise = new Promise<Result | undefined>((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;

        timeoutId = window.setTimeout(() => {
          void (async () => {
            try {
              if (!lastArgs) {
                resolve(undefined);
                return;
              }

              const debouncedResult = await func(...lastArgs);
              resolve(debouncedResult);
            } catch (error) {
              reject(error instanceof Error ? error : new Error(String(error)));
            } finally {
              timeoutId = null;
              pendingPromise = null;
              resolvePromise = rejectPromise = null;
            }
          })();
        }, delay);
      });

      return pendingPromise;
    },
    { cancel, flush }
  );

  return debouncedAsync;
}
