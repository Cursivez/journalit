

import { useLayoutEffect, useMemo, useRef } from 'react';
import type JournalitPlugin from '../../../main';
import {
  CTraderBrokerSyncClient,
  CTraderSyncClaimConflictError,
} from '../../../services/tradeSync/CTraderBrokerSyncClient';
import {
  createBrokerConnectionOperation,
  createBrokerProjectionOperation,
} from '../../../services/tradeSync/BrokerClientOperations';
import { useOAuthBrokerSyncPanelModel } from './oauthBrokerSyncPanel';
import type {
  OAuthBrokerSyncCopy,
  OAuthBrokerSyncPanelAdapter,
  OAuthBrokerSyncPanelModel,
} from './oauthBrokerSyncPanel';

const CTRADER_SYNC_PANEL_COPY: OAuthBrokerSyncCopy = {
  sourceTitle: 'trade-sync.source.ctrader',
  pluginSyncDescription: 'trade-sync.ctrader.plugin-sync-description',
  pendingAcks: 'trade-sync.ctrader.pending-acks',
  setupGuide: 'trade-sync.ctrader.setup-guide',
  connect: 'trade-sync.ctrader.connect',
  connectAnother: 'trade-sync.ctrader.connect-another',
  syncAll: 'trade-sync.ctrader.sync-all',
  never: 'trade-sync.ctrader.never',
  lastSync: 'trade-sync.ctrader.last-sync',
  syncAccount: 'trade-sync.ctrader.sync-account',
  claimedByConnection: 'trade-sync.ctrader.claimed-by-connection',
  historyLabel: 'trade-sync.ctrader.history-label',
  historyAll: 'trade-sync.ctrader.history-all',
  historyRecent: 'trade-sync.ctrader.history-recent',
  historyCustom: 'trade-sync.ctrader.history-custom',
  historyNew: 'trade-sync.ctrader.history-new',
  startDate: 'trade-sync.ctrader.start-date',
  recoveryCount: 'trade-sync.ctrader.recovery-count',
  recoverySelectAccount: 'trade-sync.ctrader.recovery-select-account',
  websiteConnectionDescription:
    'trade-sync.ctrader.website-connection-description',
  discoveryDescription: 'trade-sync.ctrader.discovery-description',
  manageConnection: 'trade-sync.ctrader.manage-connection',
  discovering: 'trade-sync.ctrader.discovering',
  discoverAccounts: 'trade-sync.ctrader.discover-accounts',
  setupAndSync: 'trade-sync.ctrader.setup-and-sync',
  syncToVault: 'trade-sync.ctrader.sync-to-vault',
  reconciliationIssues: 'trade-sync.ctrader.reconciliation-issues',
  statusFailed: 'trade-sync.ctrader.status-failed',
  noConnections: 'trade-sync.ctrader.no-connections',
  statusConnecting: 'trade-sync.ctrader.status.connecting',
  statusSetupRequired: 'trade-sync.ctrader.status.setup-required',
  statusPaused: 'trade-sync.ctrader.status.paused',
  statusReauthorizationRequired:
    'trade-sync.ctrader.status.reauthorization-required',
  statusDeleting: 'trade-sync.ctrader.status.deleting',
  statusError: 'trade-sync.ctrader.status.error',
  discoveryFailed: 'trade-sync.ctrader.discovery-failed',
  recoveryTitle: 'trade-sync.ctrader.recovery-title',
  recoveryConfirm: 'trade-sync.ctrader.recovery-confirm',
  customDateRequired: 'trade-sync.ctrader.custom-date-required',
  mappingRequired: 'trade-sync.ctrader.mapping-required',
  claimConflict: 'trade-sync.ctrader.claim-conflict',
  syncPartialConnection: 'trade-sync.ctrader.sync-partial-connection',
  syncCompleteConnection: 'trade-sync.ctrader.sync-complete-connection',
  syncAllPartial: 'trade-sync.ctrader.sync-all-partial',
  syncAllComplete: 'trade-sync.ctrader.sync-all-complete',
  docsUrl: 'https://journalit.co/docs/trade-sync-ctrader',
  integrationsUrl:
    'https://journalit.co/dashboard/integrations?provider=ctrader',
  localAccountFieldPrefix: 'ctrader-local-account',
};

export function useCTraderSyncPanelModel(
  plugin: JournalitPlugin,
  onCatalogLoaded: (hasConnections: boolean) => void
): OAuthBrokerSyncPanelModel {
  const brokerClient = useMemo(() => new CTraderBrokerSyncClient(), []);
  const onCatalogLoadedRef = useRef(onCatalogLoaded);
  useLayoutEffect(() => {
    onCatalogLoadedRef.current = onCatalogLoaded;
  }, [onCatalogLoaded]);
  const adapter = useMemo((): OAuthBrokerSyncPanelAdapter => {
    const syncService = () => plugin.ensureTradeProjectionSyncService();
    return {
      copy: CTRADER_SYNC_PANEL_COPY,
      client: {
        getConnections: (options) =>
          brokerClient.getCTraderConnections(options),
        configureAccounts: (connectionId, accounts, operation) =>
          brokerClient.configureCTraderAccounts(
            connectionId,
            accounts,
            operation
          ),
        startSync: (connectionId, intent, operation) =>
          brokerClient.startCTraderSync(connectionId, intent, operation),
      },
      diagnostics: {
        flush: () => undefined,
        createConnectionOperation: (vaultId, connectionId) =>
          createBrokerConnectionOperation(
            plugin,
            vaultId,
            connectionId,
            'ctrader'
          ),
        createProjectionOperation: (vaultId) =>
          createBrokerProjectionOperation(plugin, vaultId, 'ctrader'),
      },
      syncService: {
        waitForCloudSync: (connectionId, jobId, operation) =>
          syncService().waitForCTraderCloudSync(connectionId, jobId, operation),
        projectAfterJob: (connectionId, jobId, operation) =>
          syncService().projectAfterCTraderJob(connectionId, jobId, operation),
        waitForCloudSyncTerminal: (connectionId, jobId, operation) =>
          syncService().waitForCTraderCloudSyncTerminal(
            connectionId,
            jobId,
            operation
          ),
        syncConnection: (connectionId, operation) =>
          syncService().syncCTraderConnection(connectionId, operation),
        syncRemappedAccountProjections: (accountBindings, operation) =>
          syncService().syncRemappedAccountProjections(
            accountBindings,
            operation
          ),
        syncAllConnections: (connectionIds) =>
          syncService().syncCTraderAll(connectionIds),
      },
      isClaimConflictError: (error) =>
        error instanceof CTraderSyncClaimConflictError,
      logRefreshFailed: 'cTrader connections refresh failed',
      logDiscoveryFailed: 'cTrader account discovery failed',
      logLocalAccountCreateFailed: 'cTrader local account creation failed',
      logSyncFailed: 'cTrader connection synchronization failed',
      localAccountNameUnavailableError: 'cTrader account name is unavailable',
      createdLocalAccountUnavailableError:
        'Created local account is unavailable',
      onCatalogLoaded: (hasConnections) => {
        onCatalogLoadedRef.current(hasConnections);
      },
    };
  }, [brokerClient, plugin]);
  return useOAuthBrokerSyncPanelModel(plugin, adapter);
}
