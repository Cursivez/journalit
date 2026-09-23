

import { useMemo } from 'react';
import type JournalitPlugin from '../../../main';
import {
  TradovateBrokerSyncClient,
  TradovateSyncClaimConflictError,
} from '../../../services/tradeSync/TradovateBrokerSyncClient';
import { TradovateClientDiagnosticsService } from '../../../services/tradeSync/TradovateClientDiagnosticsService';
import { useOAuthBrokerSyncPanelModel } from './oauthBrokerSyncPanel';
import type {
  OAuthBrokerSyncCopy,
  OAuthBrokerSyncPanelAdapter,
  OAuthBrokerSyncPanelModel,
} from './oauthBrokerSyncPanel';

const TRADOVATE_SYNC_PANEL_COPY: OAuthBrokerSyncCopy = {
  sourceTitle: 'trade-sync.source.tradovate',
  pluginSyncDescription: 'trade-sync.tradovate.plugin-sync-description',
  pendingAcks: 'trade-sync.tradovate.pending-acks',
  setupGuide: 'trade-sync.tradovate.setup-guide',
  connect: 'trade-sync.tradovate.connect',
  connectAnother: 'trade-sync.tradovate.connect-another',
  syncAll: 'trade-sync.tradovate.sync-all',
  never: 'trade-sync.tradovate.never',
  lastSync: 'trade-sync.tradovate.last-sync',
  syncAccount: 'trade-sync.tradovate.sync-account',
  claimedByConnection: 'trade-sync.tradovate.claimed-by-connection',
  historyLabel: 'trade-sync.tradovate.history-label',
  historyAll: 'trade-sync.tradovate.history-all',
  historyRecent: 'trade-sync.tradovate.history-recent',
  historyCustom: 'trade-sync.tradovate.history-custom',
  historyNew: 'trade-sync.tradovate.history-new',
  startDate: 'trade-sync.tradovate.start-date',
  recoveryCount: 'trade-sync.tradovate.recovery-count',
  recoverySelectAccount: 'trade-sync.tradovate.recovery-select-account',
  websiteConnectionDescription:
    'trade-sync.tradovate.website-connection-description',
  pausedWebsiteDescription: 'trade-sync.tradovate.paused-website-description',
  discoveryDescription: 'trade-sync.tradovate.discovery-description',
  manageConnection: 'trade-sync.tradovate.manage-connection',
  discovering: 'trade-sync.tradovate.discovering',
  discoverAccounts: 'trade-sync.tradovate.discover-accounts',
  setupAndSync: 'trade-sync.tradovate.setup-and-sync',
  syncToVault: 'trade-sync.tradovate.sync-to-vault',
  reconciliationIssues: 'trade-sync.tradovate.reconciliation-issues',
  statusFailed: 'trade-sync.tradovate.status-failed',
  noConnections: 'trade-sync.tradovate.no-connections',
  statusConnecting: 'trade-sync.tradovate.status.connecting',
  statusSetupRequired: 'trade-sync.tradovate.status.setup-required',
  statusPaused: 'trade-sync.tradovate.status.paused',
  statusReauthorizationRequired:
    'trade-sync.tradovate.status.reauthorization-required',
  statusDeleting: 'trade-sync.tradovate.status.deleting',
  statusError: 'trade-sync.tradovate.status.error',
  discoveryFailed: 'trade-sync.tradovate.discovery-failed',
  recoveryTitle: 'trade-sync.tradovate.recovery-title',
  recoveryConfirm: 'trade-sync.tradovate.recovery-confirm',
  customDateRequired: 'trade-sync.tradovate.custom-date-required',
  mappingRequired: 'trade-sync.tradovate.mapping-required',
  claimConflict: 'trade-sync.tradovate.claim-conflict',
  syncPartialConnection: 'trade-sync.tradovate.sync-partial-connection',
  syncCompleteConnection: 'trade-sync.tradovate.sync-complete-connection',
  syncAllPartial: 'trade-sync.tradovate.sync-all-partial',
  syncAllComplete: 'trade-sync.tradovate.sync-all-complete',
  docsUrl: 'https://journalit.co/docs/trade-sync-tradovate',
  integrationsUrl:
    'https://journalit.co/dashboard/integrations?provider=tradovate',
  localAccountFieldPrefix: 'tradovate-local-account',
};

export function useTradovateSyncPanelModel(
  plugin: JournalitPlugin
): OAuthBrokerSyncPanelModel {
  const brokerClient = useMemo(() => new TradovateBrokerSyncClient(), []);
  const diagnostics = useMemo(
    () => new TradovateClientDiagnosticsService(plugin, brokerClient),
    [brokerClient, plugin]
  );
  const adapter = useMemo((): OAuthBrokerSyncPanelAdapter => {
    const syncService = () => plugin.ensureTradeProjectionSyncService();
    return {
      copy: TRADOVATE_SYNC_PANEL_COPY,
      client: {
        getConnections: (options) =>
          brokerClient.getTradovateConnections(options),
        configureAccounts: (connectionId, accounts, operation) =>
          brokerClient.configureTradovateAccounts(
            connectionId,
            accounts,
            operation
          ),
        startSync: (connectionId, intent, operation) =>
          brokerClient.startTradovateSync(connectionId, intent, operation),
      },
      diagnostics: {
        flush: () => {
          void diagnostics.flush();
        },
        createConnectionOperation: (vaultId, connectionId) =>
          diagnostics.createConnectionOperation(
            vaultId,
            connectionId,
            'tradovate'
          ),
        createProjectionOperation: (vaultId) =>
          diagnostics.createProjectionOperation(vaultId, 'tradovate'),
      },
      syncService: {
        waitForCloudSync: (connectionId, jobId, operation) =>
          syncService().waitForCloudSync(connectionId, jobId, operation),
        projectAfterJob: (connectionId, jobId, operation) =>
          syncService().projectAfterJob(connectionId, jobId, operation),
        waitForCloudSyncTerminal: (connectionId, jobId, operation) =>
          syncService().waitForCloudSyncTerminal(
            connectionId,
            jobId,
            operation
          ),
        syncConnection: (connectionId, operation) =>
          syncService().syncConnection(connectionId, operation),
        syncRemappedAccountProjections: (accountBindings, operation) =>
          syncService().syncRemappedAccountProjections(
            accountBindings,
            operation
          ),
        syncAllConnections: (connectionIds) =>
          syncService().syncAll(connectionIds),
      },
      isClaimConflictError: (error) =>
        error instanceof TradovateSyncClaimConflictError,
      logRefreshFailed: 'Tradovate connections refresh failed',
      logDiscoveryFailed: 'Tradovate account discovery failed',
      logLocalAccountCreateFailed: 'Tradovate local account creation failed',
      logSyncFailed: 'Tradovate connection synchronization failed',
      localAccountNameUnavailableError: 'Tradovate account name is unavailable',
      createdLocalAccountUnavailableError:
        'Created local account is unavailable',
      onCatalogLoaded: (_hasConnections) => undefined,
    };
  }, [brokerClient, diagnostics, plugin]);
  return useOAuthBrokerSyncPanelModel(plugin, adapter);
}
