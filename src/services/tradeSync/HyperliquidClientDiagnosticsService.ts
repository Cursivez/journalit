import type JournalitPlugin from '../../main';
import { HyperliquidBrokerSyncClient } from './HyperliquidBrokerSyncClient';
import { BrokerClientDiagnosticsChannel } from './BrokerClientDiagnosticsChannel';

export class HyperliquidClientDiagnosticsService extends BrokerClientDiagnosticsChannel<'hyperliquid-client-diagnostics-v2'> {
  constructor(
    plugin: JournalitPlugin,
    backend = new HyperliquidBrokerSyncClient()
  ) {
    super(plugin, {
      provider: 'hyperliquid',
      schema: 'hyperliquid-client-diagnostics-v2',
      readQueue: () =>
        plugin.settings.backendIntegration?.pendingHyperliquidClientDiagnostics,
      writeQueue: (queue) => {
        if (plugin.settings.backendIntegration) {
          plugin.settings.backendIntegration.pendingHyperliquidClientDiagnostics =
            queue;
        }
      },
      submit: (payload) => backend.submitHyperliquidClientDiagnostics(payload),
    });
  }
}
