

import { useEffect } from 'react';
import type JournalitPlugin from '../../../../main';
import { subscribeAuthRefreshCircuit } from '../../../../services/backend/TokenManager';

export function useAuthRefreshRecovery(
  plugin: JournalitPlugin,
  refresh: (options: { background: true }) => Promise<boolean | void>
): void {
  useEffect(
    () =>
      subscribeAuthRefreshCircuit(plugin, (blocked) => {
        if (!blocked) {
          void refresh({ background: true });
        }
      }),
    [plugin, refresh]
  );
}
