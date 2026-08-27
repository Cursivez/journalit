

import { TradovateBrokerSyncClient } from './TradovateBrokerSyncClient';
import { brokerProviderUnavailableReason } from './http';
import type {
  BrokerSyncAccountBinding,
  BrokerSyncProvider,
} from './BrokerSyncProvider';
import type { BrokerClientOperationContext, BrokerSyncJob } from './types';

export class TradovateBrokerSyncProvider implements BrokerSyncProvider {
  readonly id = 'tradovate' as const;
  readonly label = 'Tradovate';
  constructor(private readonly client = new TradovateBrokerSyncClient()) {}

  startSync(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<BrokerSyncJob> {
    return this.client.startTradovateSync(connectionId, 'sync', operation);
  }

  getJob(connectionId: string, jobId: string): Promise<BrokerSyncJob> {
    return this.client.getTradovateJob(connectionId, jobId);
  }

  async listSyncEnabledAccountBindings(): Promise<BrokerSyncAccountBinding[]> {
    try {
      
      
      const status = await this.client.getTradovateConnections({
        interactiveEntitlement: false,
      });
      const bindings: BrokerSyncAccountBinding[] = [];
      for (const connection of status.connections) {
        for (const account of connection.accounts) {
          if (account.syncEnabled) {
            bindings.push({
              canonicalAccountId: account.canonicalAccountId,
              connectionId: connection.id,
              provider: this.id,
            });
          }
        }
      }
      return bindings;
    } catch (error) {
      
      
      if (brokerProviderUnavailableReason(error) !== null) {
        return [];
      }
      throw error;
    }
  }
}
