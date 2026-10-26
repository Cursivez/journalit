

import { useCallback } from 'react';
import { useEventBus } from '../../../hooks/useEventBus';
import type { AccountChangedPayload } from '../../../services/events/types';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';

interface AccountPageDataEventsArgs {
  accountName: string;
  refreshData: () => Promise<void>;
}

export function useAccountPageDataEvents({
  accountName,
  refreshData,
}: AccountPageDataEventsArgs): void {
  const handleTradeDataChanged = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  
  const handleAccountChanged = useCallback(
    async (payload: AccountChangedPayload) => {
      const currentAccountLookupKey = normalizeAccountLookupKey(accountName);
      if (payload.accountNames && payload.accountNames.length > 0) {
        const payloadLookupKeys = new Set(
          payload.accountNames.map((name) => normalizeAccountLookupKey(name))
        );
        if (!payloadLookupKeys.has(currentAccountLookupKey)) return;
      } else if (payload.accountName) {
        if (
          normalizeAccountLookupKey(payload.accountName) !==
          currentAccountLookupKey
        ) {
          return;
        }
      }
      await refreshData();
    },
    [refreshData, accountName]
  );

  useEventBus('trade-data:changed', handleTradeDataChanged);
  useEventBus('missed-trade-data:changed', handleTradeDataChanged);
  useEventBus('folder-path:changed', handleTradeDataChanged);
  useEventBus('account:changed', handleAccountChanged);
  useEventBus('settings:changed', (payload) => {
    
    
    if (
      payload?.section === 'copyTradeAdjustments' ||
      payload?.section === 'symbolMappings'
    ) {
      void refreshData();
    }
  });
}
