

import { useCallback, useMemo, useState } from 'react';

interface ConnectionBusyState {
  busyConnections: Record<string, true>;
  markConnectionBusy: (connectionId: string, busy: boolean) => void;
  
  setBusyConnections: (busyConnections: Record<string, true>) => void;
}

export function useConnectionBusyState(): ConnectionBusyState {
  const [busyConnections, setBusyConnections] = useState<Record<string, true>>(
    {}
  );

  const markConnectionBusy = useCallback(
    (connectionId: string, busy: boolean) => {
      setBusyConnections((current) => {
        if (busy) {
          if (current[connectionId]) return current;
          return { ...current, [connectionId]: true };
        }
        if (!current[connectionId]) return current;
        const next = { ...current };
        delete next[connectionId];
        return next;
      });
    },
    []
  );

  return useMemo(
    () => ({ busyConnections, markConnectionBusy, setBusyConnections }),
    [busyConnections, markConnectionBusy]
  );
}
