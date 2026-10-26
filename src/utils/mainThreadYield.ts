

const DEFAULT_SLICE_MS = 12;


function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => {
      channel.port1.close();
      resolve();
    };
    channel.port2.postMessage(null);
  });
}

interface TimeSlicer {
  
  maybeYield(): Promise<void> | void;
}

export function createTimeSlicer(
  sliceMs: number = DEFAULT_SLICE_MS
): TimeSlicer {
  let sliceStart = performance.now();
  return {
    maybeYield() {
      if (performance.now() - sliceStart < sliceMs) return;
      return yieldToMain().then(() => {
        sliceStart = performance.now();
      });
    },
  };
}


export async function startEachInSlices<T, R>(
  items: readonly T[],
  start: (item: T) => R
): Promise<R[]> {
  const slicer = createTimeSlicer();
  const results: R[] = [];
  for (const item of items) {
    const pause = slicer.maybeYield();
    if (pause) await pause;
    results.push(start(item));
  }
  return results;
}
