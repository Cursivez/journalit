

import { useCallback } from 'react';
import { useEventBus } from '../../../hooks/useEventBus';
import type {
  AccountChangedPayload,
  TradeChangedPayload,
} from '../../../services/events/types';
import type { TradeCommittedPayload } from '../../../services/trade/core/tradeCoreTypes';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';

interface AccountPageDataEventsArgs {
  accountName: string;
  refreshData: () => Promise<void>;
  
  rememberCommittedTradeChange: (paths: string[]) => void;
  wasExpectedLegacyMirror: (payload: TradeChangedPayload) => boolean;
}

export function useAccountPageDataEvents({
  accountName,
  refreshData,
  rememberCommittedTradeChange,
  wasExpectedLegacyMirror,
}: AccountPageDataEventsArgs): void {
  const handleTradeDataChanged = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  const handleTradeCommitted = useCallback(
    async (payload: TradeCommittedPayload) => {
      const changedPaths = [
        payload.change.path,
        payload.change.previousPath,
      ].filter((path): path is string => Boolean(path));

      if (payload.legacyTradeChangedExpected) {
        rememberCommittedTradeChange(changedPaths);
      }

      await refreshData();
    },
    [refreshData, rememberCommittedTradeChange]
  );

  const handleLegacyTradeChanged = useCallback(
    async (payload: TradeChangedPayload) => {
      if (wasExpectedLegacyMirror(payload)) return;
      await handleTradeDataChanged();
    },
    [handleTradeDataChanged, wasExpectedLegacyMirror]
  );

  
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

  useEventBus('trade:changed', handleLegacyTradeChanged);
  useEventBus('trade:committed', handleTradeCommitted);
  useEventBus('missed-trade:changed', handleTradeDataChanged);
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
