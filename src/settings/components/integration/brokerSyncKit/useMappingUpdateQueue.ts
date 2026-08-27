

import { useCallback, useMemo, useRef } from 'react';

interface MappingUpdateQueue {
  
  enqueue(
    canonicalAccountId: string,
    update: () => Promise<void>
  ): Promise<void>;
}

export function useMappingUpdateQueue(): MappingUpdateQueue {
  const queues = useRef(new Map<string, Promise<void>>());

  const enqueue = useCallback(
    (canonicalAccountId: string, update: () => Promise<void>) => {
      const previousUpdate =
        queues.current.get(canonicalAccountId) ?? Promise.resolve();
      const queuedUpdate = previousUpdate.catch(() => undefined).then(update);
      queues.current.set(canonicalAccountId, queuedUpdate);
      const clearCompletedUpdate = () => {
        if (queues.current.get(canonicalAccountId) === queuedUpdate) {
          queues.current.delete(canonicalAccountId);
        }
      };
      void queuedUpdate.then(clearCompletedUpdate, clearCompletedUpdate);
      return queuedUpdate;
    },
    []
  );

  return useMemo(() => ({ enqueue }), [enqueue]);
}
