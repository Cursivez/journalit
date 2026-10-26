import type JournalitPlugin from '../../main';
import { TradovateClientDiagnosticsService } from './TradovateClientDiagnosticsService';
import { HyperliquidClientDiagnosticsService } from './HyperliquidClientDiagnosticsService';
import {
  createBrokerConnectionOperation,
  createBrokerProjectionOperation,
} from './BrokerClientOperations';
import type { BrokerSyncDiagnostics } from './BrokerSyncProvider';
import type {
  BrokerClientOperationContext,
  BrokerClientDiagnosticEventInput,
  BrokerSyncProviderId,
} from './types';


export class BrokerClientDiagnostics implements BrokerSyncDiagnostics {
  private readonly tradovate: TradovateClientDiagnosticsService;
  private readonly hyperliquid: HyperliquidClientDiagnosticsService;

  constructor(private readonly plugin: JournalitPlugin) {
    this.tradovate = new TradovateClientDiagnosticsService(plugin);
    this.hyperliquid = new HyperliquidClientDiagnosticsService(plugin);
  }

  private channel(provider: BrokerSyncProviderId) {
    switch (provider) {
      case 'tradovate':
        return this.tradovate;
      case 'hyperliquid':
        return this.hyperliquid;
      case 'ctrader':
      case 'rithmic':
        return undefined;
    }
  }

  async createConnectionOperation(
    vaultId: string,
    connectionId: string,
    provider: BrokerSyncProviderId
  ) {
    const channel = this.channel(provider);
    return channel
      ? channel.createConnectionOperation(vaultId, connectionId, provider)
      : createBrokerConnectionOperation(
          this.plugin,
          vaultId,
          connectionId,
          provider
        );
  }

  async createProjectionOperation(
    vaultId: string,
    provider: BrokerSyncProviderId,
    syncRunId?: string
  ) {
    const channel = this.channel(provider);
    return channel
      ? channel.createProjectionOperation(vaultId, provider, syncRunId)
      : createBrokerProjectionOperation(
          this.plugin,
          vaultId,
          provider,
          syncRunId
        );
  }

  async record(
    operation: BrokerClientOperationContext,
    event: BrokerClientDiagnosticEventInput
  ): Promise<void> {
    await this.channel(operation.provider)?.record(operation, event);
  }

  async flush(): Promise<void> {
    await Promise.all([this.tradovate.flush(), this.hyperliquid.flush()]);
  }

  dispose(): void {
    this.tradovate.dispose();
    this.hyperliquid.dispose();
  }
}
