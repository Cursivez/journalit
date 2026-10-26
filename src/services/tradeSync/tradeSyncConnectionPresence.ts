

import { logger } from '../../utils/logger';
import { CTraderBrokerSyncClient } from './CTraderBrokerSyncClient';
import { HyperliquidBrokerSyncClient } from './HyperliquidBrokerSyncClient';
import { RithmicBrokerSyncClient } from './RithmicBrokerSyncClient';
import { TradovateBrokerSyncClient } from './TradovateBrokerSyncClient';
import type { BrokerSyncProviderId } from './types';

export type TradeSyncConnectionPresence = 'connected' | 'none' | 'unknown';

const loadConnectionCount = async (
  providerId: BrokerSyncProviderId
): Promise<number> => {
  
  const options = { interactiveEntitlement: false };
  switch (providerId) {
    case 'hyperliquid':
      return (
        await new HyperliquidBrokerSyncClient().getHyperliquidConnections(
          options
        )
      ).connections.length;
    case 'tradovate':
      return (
        await new TradovateBrokerSyncClient().getTradovateConnections(options)
      ).connections.length;
    case 'ctrader':
      return (
        await new CTraderBrokerSyncClient().getCTraderConnections(options)
      ).connections.length;
    case 'rithmic':
      return (
        await new RithmicBrokerSyncClient().getRithmicConnections(options)
      ).connections.length;
  }
};

export async function getTradeSyncConnectionPresence(
  providerId: BrokerSyncProviderId | 'metatrader'
): Promise<TradeSyncConnectionPresence> {
  if (providerId === 'metatrader') return 'unknown';
  try {
    return (await loadConnectionCount(providerId)) > 0 ? 'connected' : 'none';
  } catch (error: unknown) {
    
    logger.debug('[TradeSync] Connection presence unavailable', {
      providerId,
      error: error instanceof Error ? error.message : String(error),
    });
    return 'unknown';
  }
}
