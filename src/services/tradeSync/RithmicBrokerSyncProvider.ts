

import { RithmicBrokerSyncClient } from './RithmicBrokerSyncClient';
import { brokerProviderUnavailableReason } from './http';
import type {
  BrokerSyncAccountBinding,
  BrokerSyncProvider,
} from './BrokerSyncProvider';
import type { BrokerClientOperationContext, BrokerSyncJob } from './types';

export class RithmicBrokerSyncProvider implements BrokerSyncProvider {
  readonly id = 'rithmic' as const;
  readonly label = 'Rithmic';
  private unavailableForSession = false;

  constructor(private readonly client = new RithmicBrokerSyncClient()) {}

  startSync(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<BrokerSyncJob> {
    return this.client.startRithmicSync(connectionId, operation);
  }

  getJob(connectionId: string, jobId: string): Promise<BrokerSyncJob> {
    return this.client.getRithmicJob(connectionId, jobId);
  }

  async listSyncEnabledAccountBindings(): Promise<BrokerSyncAccountBinding[]> {
    if (this.unavailableForSession) return [];
    try {
      const status = await this.client.getRithmicConnections({
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
        allowRithmicDisabled: true,
      });
      if (reason !== null) {
        
        
        if (reason === 'disabled') {
          this.unavailableForSession = true;
        }
        return [];
      }
      throw error;
    }
  }
}
