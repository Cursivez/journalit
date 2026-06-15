import { useCallback, useEffect, useState } from 'react';
import type JournalitPlugin from '../../../main';
import { useEventBus } from '../../../hooks/useEventBus';
import {
  getAccountCapitalBasisLookup,
  type AccountCapitalBasisLookupEntry,
} from '../../../utils/accountCapitalBasis';

export function useAccountCapitalBasisLookup(
  plugin: JournalitPlugin,
  enabled: boolean = true
): Record<string, AccountCapitalBasisLookupEntry> | undefined {
  const [lookup, setLookup] = useState<
    Record<string, AccountCapitalBasisLookupEntry> | undefined
  >(undefined);

  const refreshLookup = useCallback(() => {
    if (!enabled) {
      setLookup(undefined);
      return;
    }

    let active = true;

    void (async () => {
      const nextLookup = await getAccountCapitalBasisLookup(plugin);
      if (active) {
        setLookup(nextLookup);
      }
    })();

    return () => {
      active = false;
    };
  }, [enabled, plugin]);

  useEffect(() => {
    return refreshLookup();
  }, [refreshLookup]);

  useEventBus(
    'account:changed',
    () => {
      refreshLookup();
    },
    enabled
  );
  useEventBus(
    'settings:changed',
    () => {
      refreshLookup();
    },
    enabled
  );

  return lookup;
}
