

type AnyFunction = (...args: any[]) => any;

type AnyAsyncFunction = (...args: any[]) => Promise<any>;


type DebouncedFunction<T extends AnyFunction> = {
  (...args: Parameters<T>): ReturnType<T>;
  cancel: () => void;
  flush: () => ReturnType<T>;
  pending: () => boolean;
};


type DebouncedAsyncFunction<T extends AnyAsyncFunction> = {
  (...args: Parameters<T>): ReturnType<T>;
  cancel: () => void;
  flush: () => Promise<Awaited<ReturnType<T>> | undefined>;
};


export function debounce<T extends AnyFunction>(
  func: T,
  delay: number,
  options?: {
    leading?: boolean; 
    trailing?: boolean; 
    maxWait?: number; 
  }
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | null = null;
  let thisContext: unknown = null;
  let result: ReturnType<T> | undefined;

  const { leading = false, trailing = true, maxWait } = options || {};

  const invokeFunc = (
    thisArg: unknown,
    time: number
  ): ReturnType<T> | undefined => {
    const args = lastArgs;

    lastArgs = null;
    lastInvokeTime = time;
    result = func.apply(thisArg, args!) as ReturnType<T>;
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

  function leadingEdge(thisArg: unknown, time: number) {
    
    lastInvokeTime = time;
    
    timeoutId = setTimeout(timerExpired, delay);
    
    return leading ? invokeFunc(thisArg, time) : result;
  }

  function trailingEdge(thisArg: unknown, time: number) {
    timeoutId = null;

    
    
    if (trailing && lastArgs) {
      return invokeFunc(thisArg, time);
    }
    lastArgs = null;
    return result;
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(thisContext, time);
    }
    
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  }

  function cancel() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = timeoutId = null;
    thisContext = null;
  }

  function flush() {
    return timeoutId === null ? result : trailingEdge(thisContext, Date.now());
  }

  function pending() {
    return timeoutId !== null;
  }

  function debounced(this: unknown, ...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    thisContext = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(thisContext, lastCallTime);
      }
      if (maxWait !== undefined) {
        
        timeoutId = setTimeout(timerExpired, delay);
        return invokeFunc(thisContext, lastCallTime);
      }
    }
    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, delay);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced as DebouncedFunction<T>;
}


export function debounceAsync<T extends AnyAsyncFunction>(
  func: T,
  delay: number
): DebouncedAsyncFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingPromise: ReturnType<T> | null = null;
  let resolvePromise:
    | ((value: Awaited<ReturnType<T>> | undefined) => void)
    | null = null;
  let rejectPromise: ((reason: unknown) => void) | null = null;
  let lastArgs: Parameters<T> | null = null;
  let thisContext: unknown = null;

  function cancel() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    
    if (resolvePromise) {
      resolvePromise(undefined);
      resolvePromise = rejectPromise = null;
      pendingPromise = null;
    }
  }

  async function flush(): Promise<Awaited<ReturnType<T>> | undefined> {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;

      if (pendingPromise && thisContext !== null && lastArgs) {
        try {
          const result = await func.apply(thisContext, lastArgs);
          if (resolvePromise) {
            resolvePromise(result);
          }
          return result;
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

  const debouncedAsync = function (
    this: unknown,
    ...args: Parameters<T>
  ): ReturnType<T> {
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    thisContext = this;

    cancel();

    pendingPromise = new Promise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await func.apply(thisContext, lastArgs!);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          timeoutId = null;
          pendingPromise = null;
          resolvePromise = rejectPromise = null;
        }
      }, delay);
    }) as ReturnType<T>;

    return pendingPromise;
  };

  debouncedAsync.cancel = cancel;
  debouncedAsync.flush = flush;

  return debouncedAsync as DebouncedAsyncFunction<T>;
}
