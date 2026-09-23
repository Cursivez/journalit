

import { useCallback, useRef } from 'react';
import type JournalitPlugin from '../../../../main';
import { ApiClient } from '../../../../services/backend/ApiClient';
import {
  createTradeProjectionOwnershipGuard,
  getTradeProjectionOwnerId,
} from '../../../../services/tradeSync/TradeProjectionOwnership';

interface BrokerRefreshAttempt {
  
  ownerUserId: string;
  
  authSessionVersion: number;
  
  generation: number;
  
  isCurrent: () => boolean;
  
  shouldStop: () => boolean;
}

export function useBrokerRefreshSequence(
  plugin: JournalitPlugin
): () => BrokerRefreshAttempt {
  const refreshSequence = useRef(0);

  return useCallback(() => {
    const sequence = ++refreshSequence.current;
    const ownerUserId = getTradeProjectionOwnerId(plugin);
    const authSessionVersion = ApiClient.getAuthSessionVersion();
    const ownerChanged = createTradeProjectionOwnershipGuard(
      plugin,
      ownerUserId
    );
    return {
      ownerUserId,
      authSessionVersion,
      generation: sequence,
      isCurrent: () => refreshSequence.current === sequence,
      shouldStop: () =>
        ownerChanged() ||
        ApiClient.getAuthSessionVersion() !== authSessionVersion,
    };
  }, [plugin]);
}
