import { HyperliquidBrokerSyncClient } from './HyperliquidBrokerSyncClient';
import { brokerProviderUnavailableReason } from './http';
import type {
  BrokerSyncAccountBinding,
  BrokerSyncProvider,
} from './BrokerSyncProvider';
import type { BrokerClientOperationContext, BrokerSyncJob } from './types';

export class HyperliquidBrokerSyncProvider implements BrokerSyncProvider {
  readonly id = 'hyperliquid' as const;
  readonly label = 'Hyperliquid';
  private unavailableForSession = false;
  constructor(private readonly client = new HyperliquidBrokerSyncClient()) {}

  startSync(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<BrokerSyncJob> {
    return this.client.startHyperliquidSync(connectionId, operation);
  }

  getJob(connectionId: string, jobId: string): Promise<BrokerSyncJob> {
    return this.client.getHyperliquidJob(connectionId, jobId);
  }

  async listSyncEnabledAccountBindings(): Promise<BrokerSyncAccountBinding[]> {
    if (this.unavailableForSession) return [];
    try {
      const status = await this.client.getHyperliquidConnections({
        interactiveEntitlement: false,
      });
      return status.connections.flatMap((connection) =>
        connection.accounts.flatMap((account) =>
          account.syncEnabled
            ? [
                {
                  canonicalAccountId: account.canonicalAccountId,
                  connectionId: connection.id,
                  provider: this.id,
                },
              ]
            : []
        )
      );
    } catch (error) {
      const reason = brokerProviderUnavailableReason(error, {
        allowHyperliquidDisabled: true,
      });
      if (reason === null) throw error;
      if (reason === 'disabled') this.unavailableForSession = true;
      return [];
    }
  }
}
