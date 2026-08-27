

import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { Notice } from 'obsidian';
import { showConfirmationModal } from '../../../components/shared/ConfirmationModal';
import { t } from '../../../lang/helpers';
import type JournalitPlugin from '../../../main';
import { TradeProjectionClient } from '../../../services/tradeSync/TradeProjectionClient';
import {
  TradovateBrokerSyncClient,
  TradovateSyncClaimConflictError,
} from '../../../services/tradeSync/TradovateBrokerSyncClient';
import { TradeProjectionAccountRecoveryService } from '../../../services/tradeSync/TradeProjectionAccountRecoveryService';
import { getTradeProjectionVaultId } from '../../../services/tradeSync/TradeProjectionAckQueue';
import {
  createTradeProjectionOwnershipGuard,
  getTradeProjectionOwnerId,
} from '../../../services/tradeSync/TradeProjectionOwnership';
import { TradovateClientDiagnosticsService } from '../../../services/tradeSync/TradovateClientDiagnosticsService';
import type {
  TradeProjectionAccountInventoryItem,
  TradovateAccountSelection,
  BrokerClientOperationContext,
  TradovateConnection,
  TradovateConnectionAccount,
  TradovateConnections,
} from '../../../services/tradeSync/types';
import { logger } from '../../../utils/logger';
import {
  anyConnectionHasRunningJob,
  connectionHasRunningJob,
  createAccountMappingIndex,
  createLocalAccountResolver,
  loadLocalAccounts,
  useBrokerRefreshSequence,
  useBrokerStatusFailureState,
  useBrokerStatusPolling,
  useConnectionBusyState,
  useMappingUpdateQueue,
  withRateLimitRetry,
  type BrokerDataOwnership,
  type LocalAccountOption,
} from './brokerSyncKit';
import type {
  TradovateStatusState,
  TradovateSyncPanelContentProps,
} from './TradovateSyncPanelContent';
import {
  type AccountDraft,
  type AccountDrafts,
  type HistoryChoice,
  tradovateAccountDraftKey,
} from './tradovateSyncPanelDrafts';
import { useTradovateSyncAll } from './useTradovateSyncAll';

interface TradovatePanelState {
  statusState: TradovateStatusState;
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
}

type TradovatePanelUpdate =
  | Partial<TradovatePanelState>
  | ((state: TradovatePanelState) => Partial<TradovatePanelState>);

const INITIAL_PANEL_STATE: TradovatePanelState = {
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
};

const FAILED_PANEL_STATE: TradovatePanelState = {
  ...INITIAL_PANEL_STATE,
  statusState: { kind: 'failed' },
};

function panelReducer(
  state: TradovatePanelState,
  update: TradovatePanelUpdate
): TradovatePanelState {
  const patch = typeof update === 'function' ? update(state) : update;
  return { ...state, ...patch };
}

function loadedTradovateStatus(
  state: TradovatePanelState['statusState']
): TradovateConnections | null {
  return state.kind === 'loaded' ? state.data : null;
}

function historyChoice(account: TradovateConnectionAccount): HistoryChoice {
  if (account.historyMode === 'from_connection') return 'new_trades_only';
  if (account.historyMode === 'from_date') return 'custom_date';
  return 'all_available';
}

function recentHistoryFrom(): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 90);
  return `${date.toISOString().slice(0, 10)}T00:00:00.000Z`;
}

function accountSelection(
  account: TradovateConnectionAccount,
  draft: AccountDraft
): TradovateAccountSelection | null {
  if (!draft.syncEnabled) {
    return {
      accountId: account.id,
      syncEnabled: false,
      historyMode: account.historyMode,
      historyFrom: account.historyFrom ?? null,
    };
  }
  if (draft.historyChoice === 'custom_date' && !draft.historyFrom) return null;
  if (draft.historyChoice === 'all_available') {
    return {
      accountId: account.id,
      syncEnabled: true,
      historyMode: 'all_available',
      historyFrom: null,
    };
  }
  if (draft.historyChoice === 'new_trades_only') {
    return {
      accountId: account.id,
      syncEnabled: true,
      historyMode: 'from_connection',
      historyFrom: null,
    };
  }
  return {
    accountId: account.id,
    syncEnabled: true,
    historyMode: 'from_date',
    historyFrom:
      draft.historyChoice === 'recent_90_days'
        ? recentHistoryFrom()
        : `${draft.historyFrom}T00:00:00.000Z`,
  };
}

async function createTradovateLocalAccount(
  plugin: JournalitPlugin,
  account: TradovateConnectionAccount
): Promise<{ accountName: string; accounts: LocalAccountOption[] }> {
  const accountName = account.displayName?.trim();
  if (!accountName || !plugin.accountPageService) {
    throw new Error('Tradovate account name is unavailable');
  }
  await plugin.accountPageService.updateAccountMetadata(accountName, {});
  const accounts = await loadLocalAccounts(plugin);
  if (!accounts.some((localAccount) => localAccount.name === accountName)) {
    throw new Error('Created local account is unavailable');
  }
  return { accountName, accounts };
}

function connectionCanSync(connection: TradovateConnection): boolean {
  return (
    connection.status === 'active' || connection.status === 'setup_required'
  );
}

function connectionRequiresWebsite(connection: TradovateConnection): boolean {
  return (
    connection.status === 'disconnected' ||
    connection.status === 'pending' ||
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

export function useTradovateSyncPanelModel(
  plugin: JournalitPlugin
): TradovateSyncPanelContentProps {
  const backend = useMemo(() => new TradeProjectionClient(), []);
  const brokerClient = useMemo(() => new TradovateBrokerSyncClient(), []);
  const recoveryService = useMemo(
    () => new TradeProjectionAccountRecoveryService(plugin, backend),
    [backend, plugin]
  );
  const diagnostics = useMemo(
    () => new TradovateClientDiagnosticsService(plugin, brokerClient),
    [brokerClient, plugin]
  );
  const [state, patchState] = useReducer(panelReducer, INITIAL_PANEL_STATE);
  const beginRefresh = useBrokerRefreshSequence(plugin);
  const mappingUpdates = useMappingUpdateQueue();
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
      patchState((current) => ({
        refreshing: true,
        ...(current.statusState.kind === 'loaded'
          ? {}
          : { statusState: { kind: 'loading' } as const }),
      }));
      try {
        void diagnostics.flush();
        const currentVaultId = await getTradeProjectionVaultId(plugin);
        const [providerStatus, accounts, inventory] = await Promise.all([
          withRateLimitRetry(() => brokerClient.getTradovateConnections()),
          loadLocalAccounts(plugin),
          withRateLimitRetry(() => backend.getAccountInventory(currentVaultId)),
        ]);
        if (!attempt.isCurrent()) return false;
        if (attempt.shouldStop()) {
          patchState(FAILED_PANEL_STATE);
          return false;
        }
        const mappingByCanonicalAccountId = createAccountMappingIndex(
          inventory.accounts
        );
        const localAccounts = createLocalAccountResolver(accounts);
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
            nextDrafts[tradovateAccountDraftKey(connection.id, account.id)] = {
              syncEnabled: account.syncEnabled,
              historyChoice: historyChoice(account),
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
              const key = tradovateAccountDraftKey(connectionId, account.id);
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
                const key = tradovateAccountDraftKey(connection.id, account.id);
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
            mappingDirty: {
              ...current.mappingDirty,
              ...Object.fromEntries(
                Array.from(inferredMappingIds, (id) => [id, true] as const)
              ),
            },
          };
        });
        noteRefreshSuccess();
        return true;
      } catch (error) {
        if (!attempt.isCurrent()) return false;
        if (attempt.shouldStop()) {
          patchState(FAILED_PANEL_STATE);
          return false;
        }
        logger.error('Tradovate connections refresh failed', error);
        if (noteRefreshFailure(Boolean(options?.background))) {
          new Notice(t('trade-sync.tradovate.status-failed'));
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
      backend,
      beginRefresh,
      brokerClient,
      diagnostics,
      noteRefreshFailure,
      noteRefreshSuccess,
      plugin,
    ]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useBrokerStatusPolling({
    hasRunningJob: anyConnectionHasRunningJob(
      loadedTradovateStatus(state.statusState)?.connections ?? []
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
        const connection = loadedTradovateStatus(
          current.statusState
        )?.connections.find((candidate) => candidate.id === connectionId);
        const account = connection?.accounts.find(
          (candidate) => candidate.id === accountId
        );
        if (!account) return {};
        const drafts = { ...current.drafts };
        if (mapping && patch.localAccountId !== undefined) {
          for (const candidateConnection of loadedTradovateStatus(
            current.statusState
          )?.connections ?? []) {
            for (const candidateAccount of candidateConnection.accounts) {
              if (
                candidateAccount.canonicalAccountId !==
                account.canonicalAccountId
              ) {
                continue;
              }
              const key = tradovateAccountDraftKey(
                candidateConnection.id,
                candidateAccount.id
              );
              drafts[key] = {
                ...drafts[key],
                localAccountId: patch.localAccountId,
              };
            }
          }
          return {
            drafts,
            mappingDirty: patch.localAccountId
              ? {
                  ...current.mappingDirty,
                  [account.canonicalAccountId]: true,
                }
              : removeKey(current.mappingDirty, account.canonicalAccountId),
          };
        }
        const key = tradovateAccountDraftKey(connectionId, accountId);
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
        const operation = await diagnostics.createConnectionOperation(
          state.vaultId || (await getTradeProjectionVaultId(plugin)),
          connectionId,
          'tradovate'
        );
        const shouldStop = createTradeProjectionOwnershipGuard(
          plugin,
          operation.ownerUserId
        );
        if (shouldStop() || !dataOwnership.isCurrent()) return;
        const job = await brokerClient.startTradovateSync(
          connectionId,
          'discovery',
          operation
        );
        await plugin
          .ensureTradeProjectionSyncService()
          .waitForCloudSync(connectionId, job.id, {
            ...operation,
            jobId: job.id,
          });
        await refresh();
      } catch (error) {
        logger.error('Tradovate account discovery failed', error);
        new Notice(t('trade-sync.tradovate.discovery-failed'));
      } finally {
        markConnectionBusy(connectionId, false);
      }
    },
    [
      brokerClient,
      diagnostics,
      markConnectionBusy,
      plugin,
      refresh,
      state.dataOwnership,
      state.vaultId,
    ]
  );

  const persistMappings = useCallback(
    async (
      connection: TradovateConnection,
      operation: BrokerClientOperationContext,
      assertOwnership: () => void
    ) => {
      if (!state.vaultId) return;
      const localAccountsById = new Map(
        state.localAccounts.map((account) => [account.id, account])
      );
      const updates = new Map<string, Promise<void>>();
      const persistedLocalAccountIds = new Map<string, string>();
      for (const account of connection.accounts) {
        if (!state.mappingDirty[account.canonicalAccountId]) continue;
        const draft =
          state.drafts[tradovateAccountDraftKey(connection.id, account.id)];
        const localAccount = draft?.localAccountId
          ? localAccountsById.get(draft.localAccountId)
          : undefined;
        if (!localAccount || updates.has(account.canonicalAccountId)) continue;
        assertOwnership();
        persistedLocalAccountIds.set(
          account.canonicalAccountId,
          localAccount.id
        );
        updates.set(
          account.canonicalAccountId,
          mappingUpdates.enqueue(account.canonicalAccountId, async () => {
            assertOwnership();
            await backend.updateAccountVaultMapping(
              account.canonicalAccountId,
              {
                vaultId: state.vaultId,
                localAccountId: localAccount.id,
                localAccountName: localAccount.name,
                mappingStatus: 'mapped',
                pluginVersion: operation.pluginVersion,
                clientOperationId: operation.clientOperationId,
              }
            );
          })
        );
      }
      await Promise.all(updates.values());
      return persistedLocalAccountIds;
    },
    [
      backend,
      mappingUpdates,
      state.drafts,
      state.localAccounts,
      state.mappingDirty,
      state.vaultId,
    ]
  );

  const createLocalAccount = useCallback(
    async (connectionId: string, account: TradovateConnectionAccount) => {
      const dataOwnership = state.dataOwnership;
      if (!dataOwnership?.isCurrent()) {
        patchState(INITIAL_PANEL_STATE);
        void refresh();
        return;
      }
      markConnectionBusy(connectionId, true);
      try {
        const { accountName, accounts } = await createTradovateLocalAccount(
          plugin,
          account
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
        logger.error('Tradovate local account creation failed', error);
        new Notice(t('trade-sync.import.notice.create-account-failed'));
      } finally {
        markConnectionBusy(connectionId, false);
      }
    },
    [markConnectionBusy, plugin, refresh, state.dataOwnership, updateDraft]
  );

  const restoreAccount = useCallback(
    async (
      connectionId: string,
      account: TradovateConnectionAccount,
      inventoryAccount: TradeProjectionAccountInventoryItem
    ) => {
      const draft =
        state.drafts[tradovateAccountDraftKey(connectionId, account.id)];
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
        title: t('trade-sync.tradovate.recovery-title'),
        message: t('trade-sync.tradovate.recovery-confirm', {
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
        const clientOperation = await diagnostics.createProjectionOperation(
          state.vaultId,
          'tradovate'
        );
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
        logger.error('Trade projection restore failed', error);
        new Notice(t('trade-sync.import.notice.restore-failed'));
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
      diagnostics,
      markConnectionBusy,
      plugin,
      recoveryService,
      refresh,
      state.dataOwnership,
      state.drafts,
      state.localAccounts,
      state.vaultId,
    ]
  );

  const syncConnection = useCallback(
    async (connectionId: string) => {
      const connection = loadedTradovateStatus(
        state.statusState
      )?.connections.find((candidate) => candidate.id === connectionId);
      if (!connection || !connectionCanSync(connection)) return;
      const dataOwnership = state.dataOwnership;
      if (!dataOwnership?.isCurrent()) {
        patchState(INITIAL_PANEL_STATE);
        void refresh();
        return;
      }
      const selections = connection.accounts.map((account) => {
        const draft =
          state.drafts[tradovateAccountDraftKey(connectionId, account.id)];
        return draft ? accountSelection(account, draft) : null;
      });
      if (selections.some((selection) => selection === null)) {
        new Notice(t('trade-sync.tradovate.custom-date-required'));
        return;
      }
      const enabledAccounts = connection.accounts.filter(
        (account) =>
          state.drafts[tradovateAccountDraftKey(connectionId, account.id)]
            ?.syncEnabled
      );
      if (
        enabledAccounts.some(
          (account) =>
            !state.drafts[tradovateAccountDraftKey(connectionId, account.id)]
              ?.localAccountId
        )
      ) {
        new Notice(t('trade-sync.tradovate.mapping-required'));
        return;
      }
      markConnectionBusy(connectionId, true);
      try {
        const operation = await diagnostics.createConnectionOperation(
          state.vaultId || (await getTradeProjectionVaultId(plugin)),
          connectionId,
          'tradovate'
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
        const persistedLocalAccountIds = await persistMappings(
          connection,
          operation,
          assertOwnership
        );
        assertOwnership();
        const validSelections = selections.filter(
          (selection): selection is TradovateAccountSelection =>
            selection !== null
        );
        let configuration = null;
        if (
          state.configurationDirty[connectionId] ||
          connection.status === 'setup_required'
        ) {
          configuration = await brokerClient.configureTradovateAccounts(
            connectionId,
            validSelections,
            operation
          );
        }
        assertOwnership();
        if (enabledAccounts.length === 0) {
          new Notice(t('notice.sync-mapping.updated'));
        } else {
          const syncService = plugin.ensureTradeProjectionSyncService();
          const result =
            configuration?.job && configuration.created
              ? await syncService.projectAfterJob(
                  connectionId,
                  configuration.job.id,
                  operation
                )
              : await (async () => {
                  if (configuration?.job) {
                    await syncService.waitForCloudSyncTerminal(
                      connectionId,
                      configuration.job.id,
                      { ...operation, jobId: configuration.job.id }
                    );
                  }
                  return syncService.syncConnection(connectionId, operation);
                })();
          assertOwnership();
          new Notice(
            t(
              result.partial ||
                result.failedCount > 0 ||
                result.pendingCount > 0
                ? 'trade-sync.tradovate.sync-partial-connection'
                : 'trade-sync.tradovate.sync-complete-connection',
              { connection: connection.displayName }
            )
          );
        }
        patchState((current) => ({
          configurationDirty: removeKey(
            current.configurationDirty,
            connectionId
          ),
          mappingDirty: Object.fromEntries(
            Object.entries(current.mappingDirty).filter(
              ([canonicalAccountId]) => {
                const persistedLocalAccountId =
                  persistedLocalAccountIds?.get(canonicalAccountId);
                if (!persistedLocalAccountId) return true;
                return (
                  loadedTradovateStatus(current.statusState)?.connections ?? []
                ).some((candidateConnection) =>
                  candidateConnection.accounts.some(
                    (candidateAccount) =>
                      candidateAccount.canonicalAccountId ===
                        canonicalAccountId &&
                      current.drafts[
                        tradovateAccountDraftKey(
                          candidateConnection.id,
                          candidateAccount.id
                        )
                      ]?.localAccountId !== persistedLocalAccountId
                  )
                );
              }
            )
          ),
        }));
        await refresh();
      } catch (error) {
        logger.error('Tradovate connection synchronization failed', error);
        new Notice(
          error instanceof TradovateSyncClaimConflictError
            ? t('trade-sync.tradovate.claim-conflict')
            : t('trade-sync.import.notice.sync-cloud-failed')
        );
        await refresh();
      } finally {
        markConnectionBusy(connectionId, false);
      }
    },
    [
      brokerClient,
      diagnostics,
      markConnectionBusy,
      persistMappings,
      plugin,
      refresh,
      state.configurationDirty,
      state.dataOwnership,
      state.drafts,
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
  const { syncAll, syncAllAvailable, syncAllBlockedMessage } =
    useTradovateSyncAll({
      plugin,
      connections: loadedTradovateStatus(state.statusState)?.connections ?? [],
      configurationDirty: state.configurationDirty,
      mappingDirty: state.mappingDirty,
      drafts: state.drafts,
      dataOwnership: state.dataOwnership,
      setSyncAllBusy,
      setBusyConnections,
      resetForOwnershipChange,
      refresh,
    });

  const connectionStates = Object.fromEntries(
    (loadedTradovateStatus(state.statusState)?.connections ?? []).map(
      (connection) => {
        const latestDiscovery = connection.jobs.find(
          (job) => job.kind === 'discovery'
        );
        const setupRequired = connection.status === 'setup_required';
        return [
          connection.id,
          {
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
          },
        ];
      }
    )
  );

  return {
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
