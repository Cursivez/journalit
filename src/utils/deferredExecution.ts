


export function scheduleIdle(
  fn: () => unknown,
  fallbackTimeoutMs: number = 200
): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      try {
        fn();
      } catch (error) {
        console.error('Error in idle scheduled function:', error);
      }
    });
  } else {
    window.setTimeout(() => {
      try {
        fn();
      } catch (error) {
        console.error('Error in scheduled function:', error);
      }
    }, fallbackTimeoutMs);
  }
}


export function scheduleSequence(
  operations: Array<() => unknown>,
  delayBetweenMs: number = 100
): Promise<void> {
  return new Promise((resolve) => {
    if (operations.length === 0) {
      resolve();
      return;
    }

    let index = 0;

    function executeNext() {
      if (index >= operations.length) {
        resolve();
        return;
      }

      try {
        const operation = operations[index++];
        operation();

        if (index < operations.length) {
          window.setTimeout(executeNext, delayBetweenMs);
        } else {
          resolve();
        }
      } catch (error) {
        console.error(
          `Error in scheduled operation at index ${index - 1}:`,
          error
        );
        
        window.setTimeout(executeNext, delayBetweenMs);
      }
    }

    
    executeNext();
  });
}
