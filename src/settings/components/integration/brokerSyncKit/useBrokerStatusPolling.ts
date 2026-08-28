

import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_POLL_INTERVAL_MS = 2000;

interface BrokerStatusFailureState {
  
  pollSuspended: boolean;
  
  noteRefreshFailure: (background: boolean) => boolean;
  
  noteRefreshSuccess: () => void;
  
  pollSuspendedRef: React.RefObject<boolean>;
}

export function useBrokerStatusFailureState(): BrokerStatusFailureState {
  const [pollSuspended, setPollSuspended] = useState(false);
  const pollSuspendedRef = useRef(false);
  const failureNoticeShown = useRef(false);

  const noteRefreshFailure = useCallback((background: boolean) => {
    const shouldNotify = !background || !failureNoticeShown.current;
    failureNoticeShown.current = true;
    if (background) {
      pollSuspendedRef.current = true;
      setPollSuspended(true);
    }
    return shouldNotify;
  }, []);

  const noteRefreshSuccess = useCallback(() => {
    failureNoticeShown.current = false;
    pollSuspendedRef.current = false;
    setPollSuspended(false);
  }, []);

  return useMemo(
    () => ({
      pollSuspended,
      noteRefreshFailure,
      noteRefreshSuccess,
      pollSuspendedRef,
    }),
    [noteRefreshFailure, noteRefreshSuccess, pollSuspended]
  );
}

interface BrokerStatusPollingOptions {
  
  hasRunningJob: boolean;
  failureState: BrokerStatusFailureState;
  
  refresh: (options: { background: true }) => Promise<boolean | void>;
  intervalMs?: number;
}

export function useBrokerStatusPolling({
  hasRunningJob,
  failureState,
  refresh,
  intervalMs = DEFAULT_POLL_INTERVAL_MS,
}: BrokerStatusPollingOptions): void {
  const { pollSuspended, pollSuspendedRef } = failureState;

  useEffect(() => {
    if (!hasRunningJob || pollSuspended) return;
    let cancelled = false;
    let timer: number | undefined;
    const poll = async () => {
      await refresh({ background: true });
      if (!cancelled && !pollSuspendedRef.current) {
        timer = window.setTimeout(() => void poll(), intervalMs);
      }
    };
    timer = window.setTimeout(() => void poll(), intervalMs);
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [hasRunningJob, intervalMs, pollSuspended, pollSuspendedRef, refresh]);
}
