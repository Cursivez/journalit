

import { useCallback, useRef } from 'react';
import type JournalitPlugin from '../../../../main';
import {
  createTradeProjectionOwnershipGuard,
  getTradeProjectionOwnerId,
} from '../../../../services/tradeSync/TradeProjectionOwnership';

interface BrokerRefreshAttempt {
  
  ownerUserId: string;
  
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
    const shouldStop = createTradeProjectionOwnershipGuard(plugin, ownerUserId);
    return {
      ownerUserId,
      isCurrent: () => refreshSequence.current === sequence,
      shouldStop,
    };
  }, [plugin]);
}
