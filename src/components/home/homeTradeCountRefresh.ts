interface MutableBooleanRef {
  current: boolean;
}

interface MutablePromiseRef {
  current: Promise<void> | null;
}

export function runQueuedTradeCountRefresh(
  loadingRef: MutableBooleanRef,
  queuedRef: MutableBooleanRef,
  activeRefreshRef: MutablePromiseRef,
  refresh: () => Promise<void>
): Promise<void> {
  if (activeRefreshRef.current) {
    queuedRef.current = true;
    return activeRefreshRef.current;
  }

  loadingRef.current = true;

  const drainRefreshQueue = async (): Promise<void> => {
    queuedRef.current = false;
    await refresh();
    if (queuedRef.current) {
      await drainRefreshQueue();
    }
  };

  const completion = drainRefreshQueue().finally(() => {
    if (activeRefreshRef.current === completion) {
      activeRefreshRef.current = null;
      loadingRef.current = false;
    }
  });
  activeRefreshRef.current = completion;

  return completion;
}
