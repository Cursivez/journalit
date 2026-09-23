

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { Notice } from 'obsidian';
import { showConfirmationModal } from '../../../../components/shared/ConfirmationModal';
import { t } from '../../../../lang/helpers';
import type JournalitPlugin from '../../../../main';
import {
  isTradeProjectionAccountNotFoundError,
  isTradeProjectionAccountRemapUnavailableError,
  isTradeProjectionAccountRemapConflictError,
  TradeProjectionClient,
} from '../../../../services/tradeSync/TradeProjectionClient';
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
import type {
  TradeProjectionAccountInventoryItem,
  TradeProjectionAccountVaultRemapResponse,
  BrokerClientOperationContext,
  TradeProjectionSyncResult,
} from '../../../../services/tradeSync/types';
import { logger } from '../../../../utils/logger';
import { generateUUID } from '../../../../utils/uuid';
import { recordBrokerPanelHandoff } from '../../../../services/tradeOperations/recordBrokerPanelHandoff';
import { combineTradeProjectionSyncResults } from '../../../../services/tradeOperations/resultBuilders';
import {
  useAuthRefreshRecovery,
  useBrokerRefreshSequence,
  useBrokerStatusFailureState,
  useBrokerStatusPolling,
  useBrokerSyncAll,
  useConnectionBusyState,
  useMappingUpdateQueue,
  withRateLimitRetry,
  type BrokerDataOwnership,
  type BrokerSyncAllEligibility,
  type BrokerSyncAllSummary,
  type LocalAccountOption,
} from '../brokerSyncKit';
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
  collectPendingRewriteAccountUpdates,
  deliverableOutstandingCountForAccounts,
  expectedScheduledRewriteCount,
  isNoOpTradeProjectionSyncResult,
  mergePendingRewriteWork,
  oauthBrokerRemapRestoreBindings,
  planOAuthBrokerMappingWrites,
  reconcilePendingRewriteWork,
  remapRestoreAccountIds,
  removePendingRewriteAccounts,
  type OAuthBrokerPendingRewriteAccount,
  type OAuthBrokerPendingRewriteWork,
} from './accountMappingRemap';
import type {
  ConnectionUiState,
  OAuthBrokerConnection,
  OAuthBrokerConnectionAccount,
  OAuthBrokerStatusState,
  OAuthBrokerSyncPanelAdapter,
  OAuthBrokerSyncPanelModel,
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

function connectionCanSync(connection: OAuthBrokerConnection): boolean {
  return (
    connection.status === 'active' || connection.status === 'setup_required'
  );
}

function connectionRequiresWebsite(connection: OAuthBrokerConnection): boolean {
  return (
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

function projectionResultHasIssues(
  result: TradeProjectionSyncResult | undefined
): boolean {
  return Boolean(
    result &&
    (result.partial || result.failedCount > 0 || result.pendingCount > 0)
  );
}

function updateModeRemapReceipts(
  receipts: TradeProjectionAccountVaultRemapResponse[]
): TradeProjectionAccountVaultRemapResponse[] {
  const updateReceipts: TradeProjectionAccountVaultRemapResponse[] = [];
  for (const receipt of receipts) {
    if (receipt.existingNotes === 'update') {
      updateReceipts.push(receipt);
    }
  }
  return updateReceipts;
}

function preservedConflictCountFromUpdateReceipts(
  receipts: TradeProjectionAccountVaultRemapResponse[]
): number {
  let preservedConflictCount = 0;
  for (const receipt of receipts) {
    preservedConflictCount += receipt.preservedConflictCount;
  }
  return preservedConflictCount;
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
  if (isTradeSyncRateLimitError(error)) {
    return tradeSyncRateLimitMessage(error.retryAt, error.action);
  }
  if (adapter.isClaimConflictError(error)) {
    return t(adapter.copy.claimConflict);
  }
  if (isTradeProjectionAccountNotFoundError(error)) {
    return t('trade-sync.oauth.remap.account-unavailable');
  }
  if (isTradeProjectionAccountRemapUnavailableError(error)) {
    return t('trade-sync.oauth.remap.unavailable');
  }
  if (isTradeProjectionAccountRemapConflictError(error)) {
    switch (error.conflict) {
      case 'projection_restore_in_progress':
        return t('trade-sync.oauth.remap.restore-in-progress');
      case 'remap_operation_conflict':
        return t('trade-sync.oauth.remap.operation-conflict');
      case 'account_remap_busy':
        return t('trade-sync.oauth.remap.account-busy');
      default: {
        const _exhaustive: never = error.conflict;
        return _exhaustive;
      }
    }
  }
  return t('trade-sync.import.notice.sync-cloud-failed');
}

function noticeUniqueFailures(
  errors: unknown[],
  adapter: OAuthBrokerSyncPanelAdapter
): void {
  const seen = new Set<string>();
  for (const error of errors) {
    logger.error(adapter.logSyncFailed, error);
    const text = oauthBrokerMappingFailureNotice(error, adapter);
    if (seen.has(text)) continue;
    seen.add(text);
    new Notice(text);
  }
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

  const persistMappings = useCallback(
    async (
      connection: OAuthBrokerConnection,
      operation: BrokerClientOperationContext,
      assertOwnership: () => void
    ) => {
      const vaultId = operation.vaultId;
      const drafts = state.drafts;
      const mappingDirty = state.mappingDirty;
      const localAccounts = state.localAccounts;
      assertOwnership();
      const inventory = await backend.getAccountInventory(vaultId, {
        interactiveEntitlement: false,
      });
      assertOwnership();
      const plan = await planOAuthBrokerMappingWrites({
        connection,
        drafts,
        mappingDirty,
        localAccounts,
        inventoryAccounts: inventory.accounts,
        confirm: async ({ newAccountName }) => {
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
        createOperationId: generateUUID,
      });
      if (plan.status === 'cancelled') {
        return { status: 'cancelled' as const };
      }
      const writes = plan.writes;
      assertOwnership();
      const persistedLocalAccountIds = new Map<string, string>();
      const remapReceiptsByAccountId = new Map<
        string,
        TradeProjectionAccountVaultRemapResponse
      >();
      const writePromises: Promise<void>[] = [];
      for (const write of writes) {
        assertOwnership();
        writePromises.push(
          mappingUpdates.enqueue(write.canonicalAccountId, async () => {
            assertOwnership();
            try {
              if (write.kind === 'remap') {
                const receipt = await backend.remapAccountVaultMapping(
                  write.canonicalAccountId,
                  {
                    vaultId,
                    localAccountId: write.localAccountId,
                    localAccountName: write.localAccountName,
                    existingNotes: write.existingNotes,
                    clientOperationId: write.clientOperationId,
                    pluginVersion: operation.pluginVersion,
                    deviceId: operation.deviceId,
                  }
                );
                remapReceiptsByAccountId.set(write.canonicalAccountId, receipt);
              } else {
                await backend.updateAccountVaultMapping(
                  write.canonicalAccountId,
                  {
                    vaultId,
                    localAccountId: write.localAccountId,
                    localAccountName: write.localAccountName,
                    mappingStatus: 'mapped',
                    pluginVersion: operation.pluginVersion,
                    clientOperationId: operation.clientOperationId,
                  }
                );
              }
              persistedLocalAccountIds.set(
                write.canonicalAccountId,
                write.localAccountId
              );
            } catch (error) {
              if (isTradeSyncRateLimitError(error)) {
                patchState((current) => ({
                  mappingRetryAtByAccountId: {
                    ...current.mappingRetryAtByAccountId,
                    [write.canonicalAccountId]: error.retryAt,
                  },
                }));
              }
              throw error;
            }
          })
        );
      }
      const settledWrites = await Promise.allSettled(writePromises);
      assertOwnership();
      const mappingFailures: Array<{
        canonicalAccountId: string;
        error: unknown;
      }> = [];
      for (let index = 0; index < writes.length; index += 1) {
        const write = writes[index];
        const result = settledWrites[index];
        if (!write || result?.status !== 'rejected') continue;
        mappingFailures.push({
          canonicalAccountId: write.canonicalAccountId,
          error: result.reason,
        });
      }
      const remapReceipts: TradeProjectionAccountVaultRemapResponse[] = [];
      for (const receipt of remapReceiptsByAccountId.values()) {
        remapReceipts.push(receipt);
      }
      return {
        status: 'applied' as const,
        persistedLocalAccountIds,
        remapReceipts,
        mappingFailures,
        inventoryAccounts: inventory.accounts,
      };
    },
    [
      backend,
      mappingUpdates,
      plugin,
      state.drafts,
      state.localAccounts,
      state.mappingDirty,
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
      if (!connection || !connectionCanSync(connection)) return;
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
      const selections = connection.accounts.map((account) => {
        const draft =
          state.drafts[oauthBrokerAccountDraftKey(connectionId, account.id)];
        return draft ? oauthBrokerAccountSelection(account, draft) : null;
      });
      if (selections.some((selection) => selection === null)) {
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
        const persistResult = await persistMappings(
          connection,
          operation,
          assertOwnership
        );
        if (persistResult.status === 'cancelled') {
          return;
        }
        const persistedLocalAccountIds = persistResult.persistedLocalAccountIds;
        const updateReceipts = updateModeRemapReceipts(
          persistResult.remapReceipts
        );
        const preservedConflictCount =
          preservedConflictCountFromUpdateReceipts(updateReceipts);
        assertOwnership();
        const mappingFailures = persistResult.mappingFailures;
        const { pendingAccounts, completedAccountIds } =
          collectPendingRewriteAccountUpdates({
            updateReceipts,
            pendingWork: state.pendingRewriteWork,
            connectionId,
            vaultId: operation.vaultId,
            ownerUserId: operation.ownerUserId,
            inventoryAccounts: persistResult.inventoryAccounts,
            connectionCanonicalAccountIds: connection.accounts.map(
              (account) => account.canonicalAccountId
            ),
          });
        if (Object.keys(pendingAccounts).length > 0) {
          pendingRewriteEpochRef.current += 1;
        }
        const pendingEpoch = pendingRewriteEpochRef.current;
        patchState((current) => ({
          mappingDirty: remainingMappingDirty(
            current.mappingDirty,
            persistedLocalAccountIds,
            loadedStatus(current.statusState)?.connections ?? [],
            current.drafts
          ),
          pendingRewriteWork: mergePendingRewriteWork({
            current: removePendingRewriteAccounts(
              current.pendingRewriteWork,
              completedAccountIds,
              {
                vaultId: operation.vaultId,
                ownerUserId: operation.ownerUserId,
              }
            ),
            vaultId: operation.vaultId,
            ownerUserId: operation.ownerUserId,
            epoch: pendingEpoch,
            accounts: pendingAccounts,
          }),
        }));
        let remapProjection: TradeProjectionSyncResult | undefined;
        let restoreFailure: unknown;
        const remapBindings = oauthBrokerRemapRestoreBindings({
          connection,
          provider: operation.provider,
          remappedCanonicalAccountIds: remapRestoreAccountIds({
            updateReceipts,
            pendingWork: state.pendingRewriteWork,
            connectionId,
            vaultId: operation.vaultId,
            ownerUserId: operation.ownerUserId,
          }),
          inventoryAccounts: persistResult.inventoryAccounts,
        });
        if (remapBindings.length > 0) {
          try {
            const projectionOperation =
              await adapter.diagnostics.createProjectionOperation(
                operation.vaultId
              );
            assertOwnership();
            remapProjection =
              await adapter.syncService.syncRemappedAccountProjections(
                remapBindings,
                projectionOperation
              );
            assertOwnership();
          } catch (error) {
            assertOwnership();
            restoreFailure = error;
          }
        }
        const expectedRewriteCount = expectedScheduledRewriteCount({
          updateReceipts,
          pendingWork: state.pendingRewriteWork,
          connectionId,
          vaultId: operation.vaultId,
          ownerUserId: operation.ownerUserId,
          inventoryAccounts: persistResult.inventoryAccounts,
          connectionCanonicalAccountIds: connection.accounts.map(
            (account) => account.canonicalAccountId
          ),
        });
        let rewriteUnfinished = false;
        let unfinishedCount = 0;
        let latestInventoryAccounts:
          | TradeProjectionAccountInventoryItem[]
          | undefined;
        if (restoreFailure) {
          rewriteUnfinished = expectedRewriteCount > 0;
          unfinishedCount = expectedRewriteCount;
        } else if (expectedRewriteCount > 0) {
          if (
            !remapProjection ||
            isNoOpTradeProjectionSyncResult(remapProjection)
          ) {
            rewriteUnfinished = true;
            unfinishedCount = expectedRewriteCount;
          } else if (projectionResultHasIssues(remapProjection)) {
            rewriteUnfinished = true;
            const issueCount =
              remapProjection.pendingCount + remapProjection.failedCount;
            unfinishedCount =
              issueCount > 0 ? issueCount : expectedRewriteCount;
          } else {
            assertOwnership();
            try {
              const latestInventory = await backend.getAccountInventory(
                operation.vaultId,
                { interactiveEntitlement: false }
              );
              assertOwnership();
              latestInventoryAccounts = latestInventory.accounts;
              unfinishedCount = deliverableOutstandingCountForAccounts(
                latestInventory.accounts,
                remapBindings.map((binding) => binding.canonicalAccountId)
              );
              rewriteUnfinished = unfinishedCount > 0;
            } catch (error) {
              assertOwnership();
              logger.error(adapter.logSyncFailed, error);
              rewriteUnfinished = true;
              unfinishedCount = expectedRewriteCount;
            }
          }
        }
        patchState((current) => {
          if (rewriteUnfinished) {
            if (!latestInventoryAccounts) return {};
            const updates: Record<string, OAuthBrokerPendingRewriteAccount> =
              {};
            for (const binding of remapBindings) {
              const remaining = deliverableOutstandingCountForAccounts(
                latestInventoryAccounts,
                [binding.canonicalAccountId]
              );
              if (remaining <= 0) continue;
              updates[binding.canonicalAccountId] = {
                connectionId,
                scheduledCount: remaining,
              };
            }
            if (Object.keys(updates).length === 0) return {};
            return {
              pendingRewriteWork: mergePendingRewriteWork({
                current: current.pendingRewriteWork,
                vaultId: operation.vaultId,
                ownerUserId: operation.ownerUserId,
                epoch:
                  current.pendingRewriteWork?.epoch ??
                  pendingRewriteEpochRef.current,
                accounts: updates,
              }),
            };
          }
          return {
            pendingRewriteWork: removePendingRewriteAccounts(
              current.pendingRewriteWork,
              remapBindings.map((binding) => binding.canonicalAccountId),
              {
                vaultId: operation.vaultId,
                ownerUserId: operation.ownerUserId,
              }
            ),
          };
        });
        const remapProjectionHasIssues =
          projectionResultHasIssues(remapProjection) ||
          preservedConflictCount > 0 ||
          rewriteUnfinished ||
          Boolean(restoreFailure);
        const validSelections = selections.filter(
          (selection) => selection !== null
        );
        if (
          mappingFailures.length === 0 &&
          !rewriteUnfinished &&
          !restoreFailure
        ) {
          let configuration = null;
          if (
            state.configurationDirty[connectionId] ||
            connection.status === 'setup_required'
          ) {
            configuration = await adapter.client.configureAccounts(
              connectionId,
              validSelections,
              operation
            );
          }
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
              configuration?.job && configuration.created
                ? await adapter.syncService.projectAfterJob(
                    connectionId,
                    configuration.job.id,
                    operation
                  )
                : await (async () => {
                    if (configuration?.job) {
                      await adapter.syncService.waitForCloudSyncTerminal(
                        connectionId,
                        configuration.job.id,
                        { ...operation, jobId: configuration.job.id }
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
        for (const failure of mappingFailures) {
          failureErrors.push(failure.error);
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
      persistMappings,
      plugin,
      refresh,
      state.configurationDirty,
      state.dataOwnership,
      state.drafts,
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
    ({ succeeded, total, hasIssues }: BrokerSyncAllSummary) =>
      t(
        hasIssues ? adapter.copy.syncAllPartial : adapter.copy.syncAllComplete,
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

  const connectionStates = Object.fromEntries(
    (loadedStatus(state.statusState)?.connections ?? []).map((connection) => {
      const latestDiscovery = connection.jobs.find(
        (job) => job.kind === 'discovery'
      );
      const setupRequired = connection.status === 'setup_required';
      const uiState: ConnectionUiState = {
        canSync: connectionCanSync(connection),
        requiresWebsite: connectionRequiresWebsite(connection),
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

  return {
    copy: adapter.copy,
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
    discoverAccounts,
    createLocalAccount,
    restoreAccount,
    updateDraft,
  };
}
