

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { Notice } from 'obsidian';
import { showConfirmationModal } from '../../../../components/shared/ConfirmationModal';
import { t } from '../../../../lang/helpers';
import type JournalitPlugin from '../../../../main';
import { TradeProjectionClient } from '../../../../services/tradeSync/TradeProjectionClient';
import { TradeProjectionAccountRecoveryService } from '../../../../services/tradeSync/TradeProjectionAccountRecoveryService';
import { getTradeProjectionVaultId } from '../../../../services/tradeSync/TradeProjectionAckQueue';
import { refreshTradeProjectionCatalog } from '../../../../services/tradeSync/TradeProjectionCatalogRefresh';
import {
  createTradeProjectionOwnershipGuard,
  getTradeProjectionOwnerId,
} from '../../../../services/tradeSync/TradeProjectionOwnership';
import {
  createTradeSyncAccountMappingIndex,
  createTradeSyncLocalAccountResolver,
  loadTradeSyncLocalAccounts,
} from '../../../../services/tradeSync/TradeSyncAccountMappings';
import {
  anyConnectionHasRunningJob,
  connectionHasRunningJob,
  oauthBrokerConnectionSyncEligibility,
} from '../../../../services/tradeSync/TradeSyncEligibility';
import type { TradeProjectionAccountInventoryItem } from '../../../../services/tradeSync/types';
import { logger } from '../../../../utils/logger';
import { recordBrokerPanelHandoff } from '../../../../services/tradeOperations/recordBrokerPanelHandoff';
import { combineTradeProjectionSyncResults } from '../../../../services/tradeOperations/resultBuilders';
import { useAuthRefreshRecovery } from '../brokerSyncKit/useAuthRefreshRecovery';
import { useBrokerRefreshSequence } from '../brokerSyncKit/useBrokerRefreshSequence';
import {
  useBrokerStatusFailureState,
  useBrokerStatusPolling,
} from '../brokerSyncKit/useBrokerStatusPolling';
import {
  useBrokerSyncAll,
  type BrokerSyncAllEligibility,
  type BrokerSyncAllSummary,
} from '../brokerSyncKit/useBrokerSyncAll';
import { useConnectionBusyState } from '../brokerSyncKit/useConnectionBusyState';
import { useMappingUpdateQueue } from '../brokerSyncKit/useMappingUpdateQueue';
import { withRateLimitRetry } from '../brokerSyncKit/rateLimitRetry';
import {
  type BrokerDataOwnership,
  type LocalAccountOption,
} from '../brokerSyncKit/types';
import {
  isRateLimitActive,
  isTradeSyncRateLimitError,
  tradeSyncRateLimitMessage,
} from '../../../../services/tradeSync/TradeSyncRateLimit';
import {
  type AccountDraft,
  type AccountDrafts,
  oauthBrokerAccountDraftKey,
  oauthBrokerAccountSelection,
  oauthBrokerHistoryChoice,
} from './drafts';
import {
  confirmOAuthBrokerAccountRemap,
  reconcilePendingRewriteWork,
  type OAuthBrokerPendingRewriteWork,
} from './accountMappingRemap';
import {
  applyCanonicalMappingChanges,
  applyCanonicalRewriteSettlement,
  prepareCanonicalPendingRewrite,
  canonicalMappingFailureNotice,
  noticeUniqueMappingFailures,
  projectionResultHasIssues,
} from './canonicalMappingWorkflow';
import type {
  ConnectionUiState,
  OAuthBrokerAccountConfiguration,
  OAuthBrokerConnection,
  OAuthBrokerConnectionAccount,
  OAuthBrokerPanelSelection,
  OAuthBrokerStatusState,
  OAuthBrokerSyncPanelAdapter,
  OAuthBrokerSyncPanelModel,
  OAuthBrokerSyncServiceOperations,
} from './types';

interface OAuthBrokerPanelState {
  statusState: OAuthBrokerStatusState;
  vaultId: string;
  localAccounts: LocalAccountOption[];
  inventoryAccounts: TradeProjectionAccountInventoryItem[];
  drafts: AccountDrafts;
  configurationDirty: Record<string, true>;
  mappingDirty: Record<string, true>;
  refreshing: boolean;
  syncAllBusy: boolean;
  dataOwnership?: BrokerDataOwnership;
  restoringAccountIds: Record<string, true>;
  mappingRetryAtByAccountId: Record<string, number>;
  restoreRetryAtByAccountId: Record<string, number>;
  pendingRewriteWork: OAuthBrokerPendingRewriteWork | null;
}

type OAuthBrokerPanelUpdate =
  | Partial<OAuthBrokerPanelState>
  | ((state: OAuthBrokerPanelState) => Partial<OAuthBrokerPanelState>);

const INITIAL_PANEL_STATE: OAuthBrokerPanelState = {
  statusState: { kind: 'idle' },
  vaultId: '',
  localAccounts: [],
  inventoryAccounts: [],
  drafts: {},
  configurationDirty: {},
  mappingDirty: {},
  refreshing: false,
  syncAllBusy: false,
  restoringAccountIds: {},
  mappingRetryAtByAccountId: {},
  restoreRetryAtByAccountId: {},
  pendingRewriteWork: null,
};

const FAILED_PANEL_STATE: OAuthBrokerPanelState = {
  ...INITIAL_PANEL_STATE,
  statusState: { kind: 'failed' },
};

function panelReducer(
  state: OAuthBrokerPanelState,
  update: OAuthBrokerPanelUpdate
): OAuthBrokerPanelState {
  const patch = typeof update === 'function' ? update(state) : update;
  return { ...state, ...patch };
}

function loadedStatus(
  state: OAuthBrokerPanelState['statusState']
): { connections: OAuthBrokerConnection[] } | null {
  return state.kind === 'loaded' ? state.data : null;
}

async function createOAuthLocalAccount(
  plugin: JournalitPlugin,
  account: OAuthBrokerConnectionAccount,
  unavailableNameError: string,
  createdUnavailableError: string
): Promise<{ accountName: string; accounts: LocalAccountOption[] }> {
  const accountName = account.displayName?.trim();
  if (!accountName || !plugin.accountPageService) {
    throw new Error(unavailableNameError);
  }
  await plugin.accountPageService.updateAccountMetadata(accountName, {});
  const accounts = await loadTradeSyncLocalAccounts(plugin);
  if (!accounts.some((localAccount) => localAccount.name === accountName)) {
    throw new Error(createdUnavailableError);
  }
  return { accountName, accounts };
}

function connectionCanSync(
  connection: OAuthBrokerConnection,
  websiteSelection: boolean
): boolean {
  return (
    connection.status === 'active' ||
    (!websiteSelection && connection.status === 'setup_required')
  );
}

function connectionRequiresWebsite(
  connection: OAuthBrokerConnection,
  websiteSelection: boolean
): boolean {
  return (
    (websiteSelection && connection.status === 'setup_required') ||
    connection.status === 'disconnected' ||
    connection.status === 'pending' ||
    connection.status === 'paused' ||
    connection.status === 'reauthorization_required' ||
    connection.status === 'error'
  );
}

function removeKey(
  record: Record<string, true>,
  key: string
): Record<string, true> {
  const next = { ...record };
  delete next[key];
  return next;
}

function draftLocalAccountId(
  drafts: AccountDrafts,
  connections: OAuthBrokerConnection[],
  canonicalAccountId: string
): string {
  for (const connection of connections) {
    for (const account of connection.accounts) {
      if (account.canonicalAccountId !== canonicalAccountId) continue;
      return (
        drafts[oauthBrokerAccountDraftKey(connection.id, account.id)]
          ?.localAccountId ?? ''
      );
    }
  }
  return '';
}

function reconcileMappingDirty(
  currentDirty: Record<string, true>,
  inferredMappingIds: Set<string>,
  drafts: AccountDrafts,
  connections: OAuthBrokerConnection[],
  mappingByCanonicalAccountId: Map<
    string,
    { localAccountId?: string | null } | null
  >
): Record<string, true> {
  const next: Record<string, true> = {};
  const candidateIds = new Set([
    ...Object.keys(currentDirty),
    ...inferredMappingIds,
  ]);
  for (const canonicalAccountId of candidateIds) {
    const authoritativeLocalAccountId =
      mappingByCanonicalAccountId.get(canonicalAccountId)?.localAccountId ?? '';
    const localAccountId = draftLocalAccountId(
      drafts,
      connections,
      canonicalAccountId
    );
    if (localAccountId !== authoritativeLocalAccountId) {
      next[canonicalAccountId] = true;
    }
  }
  return next;
}

function remainingMappingDirty(
  currentDirty: Record<string, true>,
  persistedLocalAccountIds: Map<string, string>,
  connections: OAuthBrokerConnection[],
  drafts: AccountDrafts
): Record<string, true> {
  return Object.fromEntries(
    Object.entries(currentDirty).filter(([canonicalAccountId]) => {
      const persistedLocalAccountId =
        persistedLocalAccountIds.get(canonicalAccountId);
      if (!persistedLocalAccountId) return true;
      return connections.some((candidateConnection) =>
        candidateConnection.accounts.some(
          (candidateAccount) =>
            candidateAccount.canonicalAccountId === canonicalAccountId &&
            drafts[
              oauthBrokerAccountDraftKey(
                candidateConnection.id,
                candidateAccount.id
              )
            ]?.localAccountId !== persistedLocalAccountId
        )
      );
    })
  );
}

function oauthBrokerMappingFailureNotice(
  error: unknown,
  adapter: OAuthBrokerSyncPanelAdapter
): string {
  return canonicalMappingFailureNotice(error, (fallbackError) =>
    adapter.accountSelection !== 'website' &&
    adapter.isClaimConflictError(fallbackError)
      ? t(adapter.copy.claimConflict)
      : t('trade-sync.import.notice.sync-cloud-failed')
  );
}

function noticeUniqueFailures(
  errors: unknown[],
  adapter: OAuthBrokerSyncPanelAdapter
): void {
  noticeUniqueMappingFailures(errors, adapter.logSyncFailed, (error) =>
    oauthBrokerMappingFailureNotice(error, adapter)
  );
}

function connectionSyncAllEligibility(
  connection: OAuthBrokerConnection,
  configurationDirty: Record<string, true>,
  mappingDirty: Record<string, true>,
  drafts: AccountDrafts
): BrokerSyncAllEligibility {
  return oauthBrokerConnectionSyncEligibility(connection, {
    hasUnsavedChanges:
      Boolean(configurationDirty[connection.id]) ||
      connection.accounts.some((account) =>
        Boolean(mappingDirty[account.canonicalAccountId])
      ),
    isAccountMapped: (canonicalAccountId) => {
      const account = connection.accounts.find(
        (candidate) => candidate.canonicalAccountId === canonicalAccountId
      );
      return Boolean(
        account &&
        drafts[oauthBrokerAccountDraftKey(connection.id, account.id)]
          ?.localAccountId
      );
    },
  });
}

export function useOAuthBrokerSyncPanelModel(
  plugin: JournalitPlugin,
  adapter: OAuthBrokerSyncPanelAdapter
): OAuthBrokerSyncPanelModel {
  const backend = useMemo(() => new TradeProjectionClient(), []);
  const catalogBackend = useMemo(
    () => ({
      getConnections: (options?: { interactiveEntitlement?: boolean }) =>
        withRateLimitRetry(() => adapter.client.getConnections(options)),
      getAccountInventory: (
        vaultId: string,
        options?: { interactiveEntitlement?: boolean }
      ) =>
        withRateLimitRetry(() => backend.getAccountInventory(vaultId, options)),
    }),
    [adapter, backend]
  );
  const recoveryService = useMemo(
    () => new TradeProjectionAccountRecoveryService(plugin, backend),
    [backend, plugin]
  );
  const [state, patchState] = useReducer(panelReducer, INITIAL_PANEL_STATE);
  const beginRefresh = useBrokerRefreshSequence(plugin);
  const mappingUpdates = useMappingUpdateQueue();
  const pendingRewriteEpochRef = useRef(0);
  const { busyConnections, markConnectionBusy, setBusyConnections } =
    useConnectionBusyState();
  const failureState = useBrokerStatusFailureState();
  const { noteRefreshFailure, noteRefreshSuccess } = failureState;
  const currentOwnerUserId = getTradeProjectionOwnerId(plugin);
  const pendingAckCount = currentOwnerUserId
    ? (plugin.settings.backendIntegration?.pendingTradeImportProjectionAcks
        ?.filter((request) => request.ownerUserId === currentOwnerUserId)
        .reduce((count, request) => count + request.results.length, 0) ?? 0)
    : 0;

  const refresh = useCallback(
    async (options?: { background?: boolean }) => {
      const attempt = beginRefresh();
      const pendingEpochAtStart = pendingRewriteEpochRef.current;
      patchState((current) => ({
        refreshing: true,
        ...(current.statusState.kind === 'loaded'
          ? {}
          : { statusState: { kind: 'loading' } as const }),
      }));
      try {
        adapter.diagnostics.flush();
        const currentVaultId = await getTradeProjectionVaultId(plugin);
        const requestOptions = options?.background
          ? { interactiveEntitlement: false }
          : undefined;
        const [catalog, accounts] = await Promise.all([
          refreshTradeProjectionCatalog(
            catalogBackend,
            currentVaultId,
            requestOptions,
            {
              ownerUserId: attempt.ownerUserId,
              authSessionVersion: attempt.authSessionVersion,
              freshnessGeneration: attempt.generation,
            }
          ),
          loadTradeSyncLocalAccounts(plugin),
        ]);
        const { connections: providerStatus, inventory } = catalog;
        if (!attempt.isCurrent()) return false;
        if (attempt.shouldStop()) {
          patchState(FAILED_PANEL_STATE);
          return false;
        }
        const mappingByCanonicalAccountId = createTradeSyncAccountMappingIndex(
          inventory.accounts
        );
        const localAccounts = createTradeSyncLocalAccountResolver(accounts);
        const connectionById = new Map(
          providerStatus.connections.map((connection) => [
            connection.id,
            connection,
          ])
        );
        const inferredMappingIds = new Set<string>();
        const nextDrafts: AccountDrafts = {};
        for (const connection of providerStatus.connections) {
          for (const account of connection.accounts) {
            const mapping = mappingByCanonicalAccountId.get(
              account.canonicalAccountId
            );
            const resolvedLocalAccount =
              localAccounts.resolveMapping(mapping) ??
              localAccounts.byName(account.displayName);
            if (
              resolvedLocalAccount &&
              mapping?.localAccountId !== resolvedLocalAccount.id
            ) {
              inferredMappingIds.add(account.canonicalAccountId);
            }
            nextDrafts[oauthBrokerAccountDraftKey(connection.id, account.id)] =
              {
                syncEnabled: account.syncEnabled,
                historyChoice: oauthBrokerHistoryChoice(account),
                historyFrom: account.historyFrom?.slice(0, 10) ?? '',
                localAccountId: resolvedLocalAccount?.id ?? '',
              };
          }
        }
        patchState((current) => {
          const drafts = { ...nextDrafts };
          for (const connectionId of Object.keys(current.configurationDirty)) {
            const connection = connectionById.get(connectionId);
            for (const account of connection?.accounts ?? []) {
              const key = oauthBrokerAccountDraftKey(connectionId, account.id);
              if (
                account.syncClaim.state !== 'held_elsewhere' &&
                current.drafts[key]
              ) {
                drafts[key] = current.drafts[key];
              }
            }
          }
          for (const canonicalAccountId of Object.keys(current.mappingDirty)) {
            for (const connection of providerStatus.connections) {
              for (const account of connection.accounts) {
                if (account.canonicalAccountId !== canonicalAccountId) continue;
                const key = oauthBrokerAccountDraftKey(
                  connection.id,
                  account.id
                );
                const currentDraft = current.drafts[key];
                if (currentDraft) {
                  drafts[key] = {
                    ...drafts[key],
                    localAccountId: currentDraft.localAccountId,
                  };
                }
              }
            }
          }
          return {
            vaultId: currentVaultId,
            statusState: { kind: 'loaded', data: providerStatus },
            dataOwnership: {
              ownerUserId: attempt.ownerUserId,
              isCurrent: () => !attempt.shouldStop(),
            },
            localAccounts: accounts,
            inventoryAccounts: inventory.accounts,
            drafts,
            mappingDirty: reconcileMappingDirty(
              current.mappingDirty,
              inferredMappingIds,
              drafts,
              providerStatus.connections,
              mappingByCanonicalAccountId
            ),
            pendingRewriteWork: reconcilePendingRewriteWork(
              current.pendingRewriteWork,
              {
                ownerUserId: attempt.ownerUserId,
                vaultId: currentVaultId,
                epochAtStart: pendingEpochAtStart,
                inventoryAccounts: inventory.accounts,
              }
            ),
          };
        });
        noteRefreshSuccess();
        adapter.onCatalogLoaded(providerStatus.connections.length > 0);
        return true;
      } catch (error) {
        if (!attempt.isCurrent()) return false;
        if (attempt.shouldStop()) {
          patchState(FAILED_PANEL_STATE);
          return false;
        }
        logger.error(adapter.logRefreshFailed, error);
        if (noteRefreshFailure(Boolean(options?.background))) {
          new Notice(t(adapter.copy.statusFailed));
        }
        patchState((current) =>
          current.statusState.kind === 'loaded'
            ? {}
            : { statusState: { kind: 'failed' } }
        );
        return false;
      } finally {
        if (attempt.isCurrent() && !attempt.shouldStop()) {
          patchState({ refreshing: false });
        }
      }
    },
    [
      adapter,
      beginRefresh,
      catalogBackend,
      noteRefreshFailure,
      noteRefreshSuccess,
      plugin,
    ]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useAuthRefreshRecovery(plugin, refresh);

  useBrokerStatusPolling({
    hasRunningJob: anyConnectionHasRunningJob(
      loadedStatus(state.statusState)?.connections ?? []
    ),
    failureState,
    refresh,
  });

  const updateDraft = useCallback(
    (
      connectionId: string,
      accountId: string,
      patch: Partial<AccountDraft>,
      mapping = false
    ) => {
      patchState((current) => {
        const connection = loadedStatus(current.statusState)?.connections.find(
          (candidate) => candidate.id === connectionId
        );
        const account = connection?.accounts.find(
          (candidate) => candidate.id === accountId
        );
        if (!account) return {};
        const drafts = { ...current.drafts };
        if (mapping && patch.localAccountId !== undefined) {
          for (const candidateConnection of loadedStatus(current.statusState)
            ?.connections ?? []) {
            for (const candidateAccount of candidateConnection.accounts) {
              if (
                candidateAccount.canonicalAccountId !==
                account.canonicalAccountId
              ) {
                continue;
              }
              const key = oauthBrokerAccountDraftKey(
                candidateConnection.id,
                candidateAccount.id
              );
              drafts[key] = {
                ...drafts[key],
                localAccountId: patch.localAccountId,
              };
            }
          }
          const mappingByCanonicalAccountId =
            createTradeSyncAccountMappingIndex(current.inventoryAccounts);
          const mapping = mappingByCanonicalAccountId.get(
            account.canonicalAccountId
          );
          const authoritativeLocalAccountId = mapping?.localAccountId ?? '';
          const mappingChanged =
            patch.localAccountId !== authoritativeLocalAccountId;
          return {
            drafts,
            mappingDirty: mappingChanged
              ? {
                  ...current.mappingDirty,
                  [account.canonicalAccountId]: true,
                }
              : removeKey(current.mappingDirty, account.canonicalAccountId),
          };
        }
        const key = oauthBrokerAccountDraftKey(connectionId, accountId);
        drafts[key] = { ...drafts[key], ...patch };
        return {
          drafts,
          configurationDirty: {
            ...current.configurationDirty,
            [connectionId]: true,
          },
        };
      });
    },
    []
  );

  const discoverAccounts = useCallback(
    async (connectionId: string) => {
      if (adapter.accountSelection === 'website') return;
      const dataOwnership = state.dataOwnership;
      if (!dataOwnership?.isCurrent()) {
        patchState(INITIAL_PANEL_STATE);
        void refresh();
        return;
      }
      markConnectionBusy(connectionId, true);
      try {
        const operation = await adapter.diagnostics.createConnectionOperation(
          state.vaultId || (await getTradeProjectionVaultId(plugin)),
          connectionId
        );
        const shouldStop = createTradeProjectionOwnershipGuard(
          plugin,
          operation.ownerUserId
        );
        if (shouldStop() || !dataOwnership.isCurrent()) return;
        const job = await adapter.client.startSync(
          connectionId,
          'discovery',
          operation
        );
        await adapter.syncService.waitForCloudSync(connectionId, job.id, {
          ...operation,
          jobId: job.id,
        });
        await refresh();
      } catch (error) {
        logger.error(adapter.logDiscoveryFailed, error);
        new Notice(t(adapter.copy.discoveryFailed));
      } finally {
        markConnectionBusy(connectionId, false);
      }
    },
    [
      adapter,
      markConnectionBusy,
      plugin,
      refresh,
      state.dataOwnership,
      state.vaultId,
    ]
  );

  const createLocalAccount = useCallback(
    async (connectionId: string, account: OAuthBrokerConnectionAccount) => {
      const dataOwnership = state.dataOwnership;
      if (!dataOwnership?.isCurrent()) {
        patchState(INITIAL_PANEL_STATE);
        void refresh();
        return;
      }
      markConnectionBusy(connectionId, true);
      try {
        const { accountName, accounts } = await createOAuthLocalAccount(
          plugin,
          account,
          adapter.localAccountNameUnavailableError,
          adapter.createdLocalAccountUnavailableError
        );
        if (!dataOwnership.isCurrent()) return;
        const createdAccount = accounts.find(
          (localAccount) => localAccount.name === accountName
        );
        if (!createdAccount) return;
        patchState({ localAccounts: accounts });
        updateDraft(
          connectionId,
          account.id,
          { localAccountId: createdAccount.id },
          true
        );
      } catch (error) {
        logger.error(adapter.logLocalAccountCreateFailed, error);
        new Notice(t('trade-sync.import.notice.create-account-failed'));
      } finally {
        markConnectionBusy(connectionId, false);
      }
    },
    [
      adapter,
      markConnectionBusy,
      plugin,
      refresh,
      state.dataOwnership,
      updateDraft,
    ]
  );

  const restoreAccount = useCallback(
    async (
      connectionId: string,
      account: OAuthBrokerConnectionAccount,
      inventoryAccount: TradeProjectionAccountInventoryItem
    ) => {
      if (
        isRateLimitActive(
          state.mappingRetryAtByAccountId[inventoryAccount.accountId]
        ) ||
        isRateLimitActive(
          state.restoreRetryAtByAccountId[inventoryAccount.accountId]
        )
      ) {
        return;
      }
      const draft =
        state.drafts[oauthBrokerAccountDraftKey(connectionId, account.id)];
      const localAccount = state.localAccounts.find(
        (candidate) => candidate.id === draft?.localAccountId
      );
      if (!localAccount || !state.vaultId) return;
      const dataOwnership = state.dataOwnership;
      if (!dataOwnership?.isCurrent()) {
        patchState(INITIAL_PANEL_STATE);
        void refresh();
        return;
      }
      const operationOwnershipChanged =
        createTradeProjectionOwnershipGuard(plugin);
      const shouldStop = () =>
        !dataOwnership.isCurrent() || operationOwnershipChanged();
      if (shouldStop()) return;
      const confirmed = await showConfirmationModal(plugin.app, {
        title: t(adapter.copy.recoveryTitle),
        message: t(adapter.copy.recoveryConfirm, {
          count: String(inventoryAccount.restorableCount),
          account: localAccount.name,
        }),
        confirmLabel: t('trade-sync.import.action.restore-account'),
        cancelLabel: t('button.cancel'),
      });
      if (!confirmed || shouldStop()) return;
      patchState((current) => ({
        restoringAccountIds: {
          ...current.restoringAccountIds,
          [inventoryAccount.accountId]: true,
        },
      }));
      markConnectionBusy(connectionId, true);
      try {
        const clientOperation =
          await adapter.diagnostics.createProjectionOperation(state.vaultId);
        if (shouldStop()) return;
        const result = await recoveryService.restoreAccount({
          account: inventoryAccount,
          vaultId: state.vaultId,
          localAccountId: localAccount.id,
          localAccountName: localAccount.name,
          brokerLabel: t('trade-import.restore.broker-label'),
          clientOperation,
        });
        if (result) {
          new Notice(
            result.success && result.failedCount === 0
              ? t('trade-sync.import.notice.restored', {
                  count: String(result.writtenCount),
                })
              : t('trade-import.restore.complete', {
                  written: String(result.writtenCount),
                  failed: String(result.failedCount),
                })
          );
        }
        await refresh();
      } catch (error) {
        if (isTradeSyncRateLimitError(error)) {
          const key =
            error.action === 'mapping'
              ? 'mappingRetryAtByAccountId'
              : 'restoreRetryAtByAccountId';
          patchState((current) => ({
            [key]: {
              ...current[key],
              [inventoryAccount.accountId]: error.retryAt,
            },
          }));
          new Notice(tradeSyncRateLimitMessage(error.retryAt, error.action));
        } else {
          logger.error('Trade projection restore failed', error);
          new Notice(t('trade-sync.import.notice.restore-failed'));
        }
      } finally {
        markConnectionBusy(connectionId, false);
        patchState((current) => ({
          restoringAccountIds: removeKey(
            current.restoringAccountIds,
            inventoryAccount.accountId
          ),
        }));
      }
    },
    [
      adapter,
      markConnectionBusy,
      plugin,
      recoveryService,
      refresh,
      state.dataOwnership,
      state.drafts,
      state.localAccounts,
      state.mappingRetryAtByAccountId,
      state.restoreRetryAtByAccountId,
      state.vaultId,
    ]
  );

  const syncConnection = useCallback(
    async (connectionId: string) => {
      const connection = loadedStatus(state.statusState)?.connections.find(
        (candidate) => candidate.id === connectionId
      );
      if (
        !connection ||
        !connectionCanSync(connection, adapter.accountSelection === 'website')
      ) {
        return;
      }
      if (
        connection.accounts.some(
          (account) =>
            state.mappingDirty[account.canonicalAccountId] &&
            isRateLimitActive(
              state.mappingRetryAtByAccountId[account.canonicalAccountId]
            )
        )
      ) {
        return;
      }
      const dataOwnership = state.dataOwnership;
      if (!dataOwnership?.isCurrent()) {
        patchState(INITIAL_PANEL_STATE);
        void refresh();
        return;
      }
      
      const selections =
        adapter.accountSelection === 'website'
          ? []
          : connection.accounts.map((account) => {
              const draft =
                state.drafts[
                  oauthBrokerAccountDraftKey(connectionId, account.id)
                ];
              return draft ? oauthBrokerAccountSelection(account, draft) : null;
            });
      if (
        adapter.accountSelection !== 'website' &&
        selections.some((selection) => selection === null)
      ) {
        new Notice(t(adapter.copy.customDateRequired));
        return;
      }
      const enabledAccounts = connection.accounts.filter(
        (account) =>
          state.drafts[oauthBrokerAccountDraftKey(connectionId, account.id)]
            ?.syncEnabled
      );
      if (
        enabledAccounts.some(
          (account) =>
            !state.drafts[oauthBrokerAccountDraftKey(connectionId, account.id)]
              ?.localAccountId
        )
      ) {
        new Notice(t(adapter.copy.mappingRequired));
        return;
      }
      markConnectionBusy(connectionId, true);
      try {
        const operation = await adapter.diagnostics.createConnectionOperation(
          state.vaultId || (await getTradeProjectionVaultId(plugin)),
          connectionId
        );
        const shouldStop = createTradeProjectionOwnershipGuard(
          plugin,
          operation.ownerUserId
        );
        const assertOwnership = () => {
          if (shouldStop() || !dataOwnership.isCurrent()) {
            throw new Error('Trade Projection configuration stopped');
          }
        };
        assertOwnership();
        const outcome = await applyCanonicalMappingChanges({
          connection,
          drafts: state.drafts,
          mappingDirty: state.mappingDirty,
          localAccounts: state.localAccounts,
          pendingWork: state.pendingRewriteWork,
          operation,
          backend,
          enqueue: (canonicalAccountId, update) =>
            mappingUpdates.enqueue(canonicalAccountId, update),
          confirmRemap: async (newAccountName) => {
            assertOwnership();
            const decision = await confirmOAuthBrokerAccountRemap(
              plugin.app,
              newAccountName
            );
            if (decision !== 'cancel') {
              assertOwnership();
            }
            return decision;
          },
          assertOwnership,
          createProjectionOperation: async () =>
            adapter.diagnostics.createProjectionOperation(operation.vaultId),
          restore: (bindings, projectionOperation) =>
            adapter.syncService.syncRemappedAccountProjections(
              bindings,
              projectionOperation
            ),
          onRateLimited: (canonicalAccountId, retryAt) => {
            patchState((current) => ({
              mappingRetryAtByAccountId: {
                ...current.mappingRetryAtByAccountId,
                [canonicalAccountId]: retryAt,
              },
            }));
          },
          onMappingsPersisted: (persisted) => {
            const pending = prepareCanonicalPendingRewrite(
              persisted,
              pendingRewriteEpochRef.current,
              {
                vaultId: operation.vaultId,
                ownerUserId: operation.ownerUserId,
              }
            );
            pendingRewriteEpochRef.current = pending.epoch;
            patchState((current) => ({
              mappingDirty: remainingMappingDirty(
                current.mappingDirty,
                persisted.persistedLocalAccountIds,
                loadedStatus(current.statusState)?.connections ?? [],
                current.drafts
              ),
              pendingRewriteWork: pending.transition(
                current.pendingRewriteWork
              ),
            }));
          },
          logLabel: adapter.logSyncFailed,
        });
        if (outcome.status === 'cancelled') {
          return;
        }
        const {
          mappingFailures,
          remapProjection,
          restoreFailure,
          rewriteUnfinished,
          unfinishedCount,
          preservedConflictCount,
          remapHasIssues: remapProjectionHasIssues,
          settlement,
        } = outcome;
        if (settlement) {
          patchState((current) => ({
            pendingRewriteWork: applyCanonicalRewriteSettlement(
              current.pendingRewriteWork,
              settlement,
              {
                vaultId: operation.vaultId,
                ownerUserId: operation.ownerUserId,
              },
              pendingRewriteEpochRef.current
            ),
          }));
        }
        const validSelections = selections.filter(
          (selection) => selection !== null
        );
        if (
          mappingFailures.length === 0 &&
          !rewriteUnfinished &&
          !restoreFailure
        ) {
          
          
          let configured: {
            configuration: OAuthBrokerAccountConfiguration;
            syncService: OAuthBrokerSyncServiceOperations;
          } | null = null;
          if (
            adapter.accountSelection !== 'website' &&
            (state.configurationDirty[connectionId] ||
              connection.status === 'setup_required')
          ) {
            configured = {
              configuration: await adapter.client.configureAccounts(
                connectionId,
                validSelections,
                operation
              ),
              syncService: adapter.syncService,
            };
          }
          const configuredJob = configured?.configuration.job;
          assertOwnership();
          if (enabledAccounts.length === 0) {
            const message = remapProjectionHasIssues
              ? t(adapter.copy.syncPartialConnection, {
                  connection: connection.displayName,
                })
              : t('notice.sync-mapping.updated');
            if (remapProjection) {
              recordBrokerPanelHandoff(plugin, remapProjection, message);
            } else {
              new Notice(message);
            }
          } else {
            const result =
              configured && configuredJob && configured.configuration.created
                ? await configured.syncService.projectAfterJob(
                    connectionId,
                    configuredJob.id,
                    operation
                  )
                : await (async () => {
                    if (configured && configuredJob) {
                      await configured.syncService.waitForCloudSyncTerminal(
                        connectionId,
                        configuredJob.id,
                        { ...operation, jobId: configuredJob.id }
                      );
                    }
                    return adapter.syncService.syncConnection(
                      connectionId,
                      operation
                    );
                  })();
            assertOwnership();
            recordBrokerPanelHandoff(
              plugin,
              combineTradeProjectionSyncResults(
                remapProjection ? [remapProjection, result] : [result]
              ),
              t(
                remapProjectionHasIssues || projectionResultHasIssues(result)
                  ? adapter.copy.syncPartialConnection
                  : adapter.copy.syncCompleteConnection,
                { connection: connection.displayName }
              )
            );
          }
          patchState((current) => ({
            configurationDirty: removeKey(
              current.configurationDirty,
              connectionId
            ),
          }));
        } else if (remapProjectionHasIssues) {
          const message = t(adapter.copy.syncPartialConnection, {
            connection: connection.displayName,
          });
          if (remapProjection) {
            recordBrokerPanelHandoff(plugin, remapProjection, message);
          } else {
            new Notice(message);
          }
        }
        if (rewriteUnfinished && unfinishedCount > 0) {
          new Notice(
            t('trade-sync.oauth.remap.notes-pending', {
              count: String(unfinishedCount),
            })
          );
        }
        if (preservedConflictCount > 0) {
          new Notice(
            t('trade-sync.oauth.remap.preserved-conflicts', {
              count: String(preservedConflictCount),
            })
          );
        }
        const failureErrors: unknown[] = [];
        if (restoreFailure) failureErrors.push(restoreFailure);
        for (const error of mappingFailures) {
          failureErrors.push(error);
        }
        noticeUniqueFailures(failureErrors, adapter);
        await refresh();
      } catch (error) {
        logger.error(adapter.logSyncFailed, error);
        new Notice(oauthBrokerMappingFailureNotice(error, adapter));
        await refresh();
      } finally {
        markConnectionBusy(connectionId, false);
      }
    },
    [
      adapter,
      backend,
      markConnectionBusy,
      mappingUpdates,
      plugin,
      refresh,
      state.configurationDirty,
      state.dataOwnership,
      state.drafts,
      state.localAccounts,
      state.mappingDirty,
      state.mappingRetryAtByAccountId,
      state.pendingRewriteWork,
      state.statusState,
      state.vaultId,
    ]
  );

  const resetForOwnershipChange = useCallback(() => {
    patchState(INITIAL_PANEL_STATE);
    void refresh();
  }, [refresh]);
  const setSyncAllBusy = useCallback((syncAllBusy: boolean) => {
    patchState({ syncAllBusy });
  }, []);
  const isEligible = useCallback(
    (connection: OAuthBrokerConnection) =>
      connectionSyncAllEligibility(
        connection,
        state.configurationDirty,
        state.mappingDirty,
        state.drafts
      ),
    [state.configurationDirty, state.drafts, state.mappingDirty]
  );
  const completionNotice = useCallback(
    ({ succeeded, total, hasIssues, partlyFinished }: BrokerSyncAllSummary) =>
      t(
        hasIssues
          ? adapter.copy.syncAllPartial
          : partlyFinished
            ? adapter.copy.syncAllProviderPartial
            : adapter.copy.syncAllComplete,
        { succeeded: String(succeeded), total: String(total) }
      ),
    [adapter]
  );
  const { syncAll, syncAllAvailable, syncAllBlockedMessage } = useBrokerSyncAll(
    {
      plugin,
      connections: loadedStatus(state.statusState)?.connections ?? [],
      isEligible,
      dataOwnership: state.dataOwnership,
      syncConnections: adapter.syncService.syncAllConnections,
      completionNotice,
      setSyncAllBusy,
      setBusyConnections,
      resetForOwnershipChange,
      refresh,
    }
  );

  const websiteSelection = adapter.accountSelection === 'website';
  const connectionStates = Object.fromEntries(
    (loadedStatus(state.statusState)?.connections ?? []).map((connection) => {
      const latestDiscovery = connection.jobs.find(
        (job) => job.kind === 'discovery'
      );
      
      const setupRequired =
        !websiteSelection && connection.status === 'setup_required';
      const uiState: ConnectionUiState = {
        canSync: connectionCanSync(connection, websiteSelection),
        requiresWebsite: connectionRequiresWebsite(
          connection,
          websiteSelection
        ),
        setupRequired,
        discoveryRetryAvailable:
          setupRequired &&
          (connection.accounts.length === 0 ||
            latestDiscovery?.status === 'partial' ||
            latestDiscovery?.status === 'failed' ||
            latestDiscovery?.status === 'cancelled'),
        hasRunningJob: connectionHasRunningJob(connection),
      };
      return [connection.id, uiState];
    })
  );

  const selection: OAuthBrokerPanelSelection =
    adapter.accountSelection === 'website'
      ? { mode: 'website', copy: adapter.copy }
      : { mode: 'plugin', copy: adapter.copy, discoverAccounts };

  return {
    selection,
    statusState: state.statusState,
    drafts: state.drafts,
    localAccounts: state.localAccounts,
    inventoryAccounts: state.inventoryAccounts,
    busyConnections,
    refreshing: state.refreshing,
    syncAllBusy: state.syncAllBusy,
    syncAllAvailable,
    syncAllBlockedMessage,
    mappingDirty: state.mappingDirty,
    restoringAccountIds: state.restoringAccountIds,
    mappingRetryAtByAccountId: state.mappingRetryAtByAccountId,
    restoreRetryAtByAccountId: state.restoreRetryAtByAccountId,
    connectionStates,
    pendingAckCount,
    refresh,
    syncConnection,
    syncAll,
    createLocalAccount,
    restoreAccount,
    updateDraft,
  };
}
