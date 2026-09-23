

import { CTraderBrokerSyncClient } from './CTraderBrokerSyncClient';
import { brokerProviderUnavailableReason } from './http';
import type {
  BrokerSyncAccountBinding,
  BrokerSyncProvider,
} from './BrokerSyncProvider';
import type { BrokerClientOperationContext, BrokerSyncJob } from './types';

export class CTraderBrokerSyncProvider implements BrokerSyncProvider {
  readonly id = 'ctrader' as const;
  readonly label = 'cTrader';
  private unavailableForSession = false;
  constructor(private readonly client = new CTraderBrokerSyncClient()) {}

  startSync(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<BrokerSyncJob> {
    return this.client.startCTraderSync(connectionId, 'sync', operation);
  }

  getJob(connectionId: string, jobId: string): Promise<BrokerSyncJob> {
    return this.client.getCTraderJob(connectionId, jobId);
  }

  async listSyncEnabledAccountBindings(): Promise<BrokerSyncAccountBinding[]> {
    if (this.unavailableForSession) return [];
    try {
      
      
      const status = await this.client.getCTraderConnections({
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
      const reason = brokerProviderUnavailableReason(error, {
        allowCTraderDisabled: true,
      });
      if (reason !== null) {
        
        if (reason === 'disabled') this.unavailableForSession = true;
        return [];
      }
      throw error;
    }
  }
}
