import type JournalitPlugin from '../../main';
import { TradovateBrokerSyncClient } from './TradovateBrokerSyncClient';
import { BrokerClientDiagnosticsChannel } from './BrokerClientDiagnosticsChannel';

export class TradovateClientDiagnosticsService extends BrokerClientDiagnosticsChannel<'tradovate-client-diagnostics-v2'> {
  constructor(
    plugin: JournalitPlugin,
    backend = new TradovateBrokerSyncClient()
  ) {
    super(plugin, {
      provider: 'tradovate',
      schema: 'tradovate-client-diagnostics-v2',
      readQueue: () =>
        plugin.settings.backendIntegration?.pendingTradovateClientDiagnostics,
      writeQueue: (queue) => {
        if (plugin.settings.backendIntegration) {
          plugin.settings.backendIntegration.pendingTradovateClientDiagnostics =
            queue;
        }
      },
      submit: (payload) => backend.submitTradovateClientDiagnostics(payload),
    });
  }
}
