

import { useEffect, useMemo, useState } from 'react';
import type JournalitPlugin from '../../../main';
import { HyperliquidBrokerSyncClient } from '../../../services/tradeSync/HyperliquidBrokerSyncClient';
import { HyperliquidClientDiagnosticsService } from '../../../services/tradeSync/HyperliquidClientDiagnosticsService';
import { tradeSyncApiErrorCode } from '../../../services/tradeSync/http';
import { ApiError } from '../../../types/errors';
import { logger } from '../../../utils/logger';
import { useOAuthBrokerSyncPanelModel } from './oauthBrokerSyncPanel/useOAuthBrokerSyncPanelModel';
import type {
  OAuthBrokerSyncPanelAdapter,
  OAuthBrokerSyncPanelModel,
  OAuthBrokerWebsiteSelectionCopy,
} from './oauthBrokerSyncPanel/types';

const HYPERLIQUID_INTEGRATIONS_URL =
  'https://journalit.co/dashboard/integrations?provider=hyperliquid';

const HYPERLIQUID_SYNC_PANEL_COPY: OAuthBrokerWebsiteSelectionCopy = {
  sourceTitle: 'trade-sync.source.hyperliquid',
  pluginSyncDescription: 'trade-sync.hyperliquid.description',
  pendingAcks: 'trade-sync.hyperliquid.pending-acks',
  setupGuide: 'trade-sync.hyperliquid.manage-on-website',
  connect: 'trade-sync.hyperliquid.connect-on-website',
  connectAnother: 'trade-sync.hyperliquid.connect-on-website',
  syncAll: 'trade-sync.hyperliquid.sync-all',
  never: 'trade-sync.hyperliquid.never',
  lastSync: 'trade-sync.hyperliquid.last-sync',
  claimedByConnection: 'trade-sync.hyperliquid.claimed-by-connection',
  recoveryCount: 'trade-sync.hyperliquid.recovery-count',
  recoverySelectAccount: 'trade-sync.hyperliquid.recovery-select-account',
  websiteConnectionDescription: 'trade-sync.hyperliquid.notice.attention',
  pausedWebsiteDescription: 'trade-sync.hyperliquid.notice.paused',
  setupRequiredDescription: 'trade-sync.hyperliquid.notice.setup-required',
  manageConnection: 'trade-sync.hyperliquid.manage-connection',
  syncToVault: 'trade-sync.hyperliquid.sync-to-vault',
  reconciliationIssues: 'trade-sync.hyperliquid.reconciliation-issues',
  statusFailed: 'trade-sync.hyperliquid.status-failed',
  noConnections: 'trade-sync.hyperliquid.no-connections',
  statusConnecting: 'trade-sync.hyperliquid.status.pending',
  statusSetupRequired: 'trade-sync.hyperliquid.status.setup-required',
  statusPaused: 'trade-sync.hyperliquid.status.paused',
  statusReauthorizationRequired: 'trade-sync.hyperliquid.status.attention',
  statusDeleting: 'trade-sync.hyperliquid.status.deleting',
  statusError: 'trade-sync.hyperliquid.status.error',
  recoveryTitle: 'trade-sync.hyperliquid.recovery-title',
  recoveryConfirm: 'trade-sync.hyperliquid.recovery-confirm',
  mappingRequired: 'trade-sync.hyperliquid.mapping-required',
  syncPartialConnection: 'trade-sync.hyperliquid.sync-partial',
  syncCompleteConnection: 'trade-sync.hyperliquid.sync-complete',
  syncAllPartial: 'trade-sync.hyperliquid.sync-all-partial',
  syncAllProviderPartial: 'trade-sync.hyperliquid.sync-all-provider-partial',
  syncAllComplete: 'trade-sync.hyperliquid.sync-all-complete',
  accountSelected: 'trade-sync.hyperliquid.account.selected',
  accountNotSelected: 'trade-sync.hyperliquid.account.not-selected',
  docsUrl: HYPERLIQUID_INTEGRATIONS_URL,
  integrationsUrl: HYPERLIQUID_INTEGRATIONS_URL,
  localAccountFieldPrefix: 'hyperliquid-local-account',
};

type HyperliquidAvailability =
  | { kind: 'checking' }
  | { kind: 'disabled' }
  | { kind: 'available'; eligible: boolean };


function isHyperliquidDisabledError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    error.statusCode === 404 &&
    tradeSyncApiErrorCode(error.context?.responseBody) ===
      'hyperliquid_disabled'
  );
}


export function useHyperliquidAvailability(): HyperliquidAvailability {
  const brokerClient = useMemo(() => new HyperliquidBrokerSyncClient(), []);
  const [availability, setAvailability] = useState<HyperliquidAvailability>({
    kind: 'checking',
  });
  useEffect(() => {
    let cancelled = false;
    void brokerClient
      .getHyperliquidConfig({ interactiveEntitlement: false })
      .then(
        (config): HyperliquidAvailability =>
          config.enabled
            ? { kind: 'available', eligible: config.eligible }
            : { kind: 'disabled' },
        (error: unknown): HyperliquidAvailability => {
          if (isHyperliquidDisabledError(error)) return { kind: 'disabled' };
          logger.error('Hyperliquid config refresh failed', error);
          return { kind: 'available', eligible: false };
        }
      )
      .then((next) => {
        if (!cancelled) setAvailability(next);
      });
    return () => {
      cancelled = true;
    };
  }, [brokerClient]);
  return availability;
}

export function useHyperliquidSyncPanelModel(
  plugin: JournalitPlugin
): OAuthBrokerSyncPanelModel {
  const brokerClient = useMemo(() => new HyperliquidBrokerSyncClient(), []);
  
  const diagnostics = useMemo(
    () => new HyperliquidClientDiagnosticsService(plugin, brokerClient),
    [brokerClient, plugin]
  );
  const adapter = useMemo((): OAuthBrokerSyncPanelAdapter => {
    const syncService = () => plugin.ensureTradeProjectionSyncService();
    return {
      accountSelection: 'website',
      copy: HYPERLIQUID_SYNC_PANEL_COPY,
      client: {
        getConnections: (options) =>
          brokerClient.getHyperliquidConnections(options),
      },
      diagnostics: {
        flush: () => {
          void diagnostics.flush();
        },
        createConnectionOperation: (vaultId, connectionId) =>
          diagnostics.createConnectionOperation(
            vaultId,
            connectionId,
            'hyperliquid'
          ),
        createProjectionOperation: (vaultId) =>
          diagnostics.createProjectionOperation(vaultId, 'hyperliquid'),
      },
      syncService: {
        syncConnection: (connectionId, operation) =>
          syncService().syncHyperliquidConnection(connectionId, operation),
        syncRemappedAccountProjections: (accountBindings, operation) =>
          syncService().syncRemappedAccountProjections(
            accountBindings,
            operation
          ),
        syncAllConnections: (connectionIds) =>
          syncService().syncHyperliquidAll(connectionIds),
      },
      logRefreshFailed: 'Hyperliquid connections refresh failed',
      logLocalAccountCreateFailed: 'Hyperliquid local account creation failed',
      logSyncFailed: 'Hyperliquid connection synchronization failed',
      localAccountNameUnavailableError:
        'Hyperliquid account name is unavailable',
      createdLocalAccountUnavailableError:
        'Created local account is unavailable',
      onCatalogLoaded: (_hasConnections) => undefined,
    };
  }, [brokerClient, diagnostics, plugin]);
  return useOAuthBrokerSyncPanelModel(plugin, adapter);
}
