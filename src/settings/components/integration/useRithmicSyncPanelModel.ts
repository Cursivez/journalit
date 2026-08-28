

import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { Notice } from 'obsidian';
import { t } from '../../../lang/helpers';
import type JournalitPlugin from '../../../main';
import { TradeProjectionClient } from '../../../services/tradeSync/TradeProjectionClient';
import { RithmicBrokerSyncClient } from '../../../services/tradeSync/RithmicBrokerSyncClient';
import { getTradeProjectionVaultId } from '../../../services/tradeSync/TradeProjectionAckQueue';
import { createTradeProjectionOwnershipGuard } from '../../../services/tradeSync/TradeProjectionOwnership';
import { createBrokerConnectionOperation } from '../../../services/tradeSync/BrokerClientOperations';
import type {
  RithmicConnection,
  RithmicConnections,
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
  useBrokerSyncAll,
  useConnectionBusyState,
  useMappingUpdateQueue,
  withRateLimitRetry,
  type BrokerDataOwnership,
  type BrokerSyncAllEligibility,
  type BrokerSyncAllSummary,
  type LocalAccountOption,
} from './brokerSyncKit';
import {
  rithmicSyncErrorCode,
  rithmicSyncErrorDetail,
  rithmicSyncErrorMessage,
} from './rithmicSyncErrors';
import type {
  RithmicStatusState,
  RithmicSyncPanelContentProps,
} from './RithmicSyncPanelContent';

interface RithmicPanelState {
  statusState: RithmicStatusState;
  vaultId: string;
  localAccounts: LocalAccountOption[];
  
  accountMappings: Record<string, string>;
  mappingDirty: Record<string, true>;
  refreshing: boolean;
  syncAllBusy: boolean;
  dataOwnership?: BrokerDataOwnership;
}

type RithmicPanelUpdate =
  | Partial<RithmicPanelState>
  | ((state: RithmicPanelState) => Partial<RithmicPanelState>);

const INITIAL_PANEL_STATE: RithmicPanelState = {
  statusState: { kind: 'idle' },
  vaultId: '',
  localAccounts: [],
  accountMappings: {},
  mappingDirty: {},
  refreshing: false,
  syncAllBusy: false,
};

const FAILED_PANEL_STATE: RithmicPanelState = {
  ...INITIAL_PANEL_STATE,
  statusState: { kind: 'failed' },
};

function panelReducer(
  state: RithmicPanelState,
  update: RithmicPanelUpdate
): RithmicPanelState {
  const patch = typeof update === 'function' ? update(state) : update;
  return { ...state, ...patch };
}

function loadedRithmicStatus(
  state: RithmicPanelState['statusState']
): RithmicConnections | null {
  return state.kind === 'loaded' ? state.data : null;
}

function connectionCanSync(connection: RithmicConnection): boolean {
  return (
    connection.status === 'active' || connection.status === 'setup_required'
  );
}

function connectionRequiresWebsite(connection: RithmicConnection): boolean {
  return !connectionCanSync(connection) && connection.status !== 'pending';
}


function connectionSyncAllEligibility(
  connection: RithmicConnection,
  accountMappings: Record<string, string>,
  mappingDirty: Record<string, true>
): BrokerSyncAllEligibility {
  if (connectionHasRunningJob(connection)) return 'running-job';
  if (connection.status === 'setup_required') return true;
  if (connection.status !== 'active') return 'not-ready';
  if (
    connection.accounts.some(
      (account) => mappingDirty[account.canonicalAccountId]
    )
  ) {
    return 'unsaved-changes';
  }
  if (
    connection.accounts.some(
      (account) =>
        account.syncEnabled && !accountMappings[account.canonicalAccountId]
    )
  ) {
    return 'mapping-required';
  }
  if (!connection.accounts.some((account) => account.syncEnabled)) {
    return 'not-ready';
  }
  return true;
}

export function useRithmicSyncPanelModel(
  plugin: JournalitPlugin
): RithmicSyncPanelContentProps {
  const projectionClient = useMemo(() => new TradeProjectionClient(), []);
  const brokerClient = useMemo(() => new RithmicBrokerSyncClient(), []);
  const [state, patchState] = useReducer(panelReducer, INITIAL_PANEL_STATE);
  const beginRefresh = useBrokerRefreshSequence(plugin);
  const mappingUpdates = useMappingUpdateQueue();
  const { busyConnections, markConnectionBusy, setBusyConnections } =
    useConnectionBusyState();
  const failureState = useBrokerStatusFailureState();
  const { noteRefreshFailure, noteRefreshSuccess } = failureState;

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
        const currentVaultId = await getTradeProjectionVaultId(plugin);
        const [providerStatus, accounts, inventory] = await Promise.all([
          withRateLimitRetry(() => brokerClient.getRithmicConnections()),
          loadLocalAccounts(plugin),
          withRateLimitRetry(() =>
            projectionClient.getAccountInventory(currentVaultId)
          ),
        ]);
        if (!attempt.isCurrent()) return false;
        if (attempt.shouldStop()) {
          patchState(FAILED_PANEL_STATE);
          return false;
        }
        const localAccounts = createLocalAccountResolver(accounts);
        const mappingByCanonicalAccountId = createAccountMappingIndex(
          inventory.accounts
        );
        const nextMappings: Record<string, string> = {};
        for (const connection of providerStatus.connections) {
          for (const account of connection.accounts) {
            const resolved = localAccounts.resolveMapping(
              mappingByCanonicalAccountId.get(account.canonicalAccountId)
            );
            nextMappings[account.canonicalAccountId] = resolved?.id ?? '';
          }
        }
        patchState((current) => {
          const accountMappings = { ...nextMappings };
          for (const canonicalAccountId of Object.keys(current.mappingDirty)) {
            const pending = current.accountMappings[canonicalAccountId];
            if (pending !== undefined) {
              accountMappings[canonicalAccountId] = pending;
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
            accountMappings,
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
        logger.error('Rithmic connections refresh failed', error);
        if (noteRefreshFailure(Boolean(options?.background))) {
          new Notice(t('trade-sync.rithmic.status-failed'));
        }
        patchState((current) =>
          current.statusState.kind === 'loaded'
            ? {}
            : { statusState: { kind: 'failed' as const } }
        );
        return false;
      } finally {
        if (attempt.isCurrent() && !attempt.shouldStop()) {
          patchState({ refreshing: false });
        }
      }
    },
    [
      beginRefresh,
      brokerClient,
      noteRefreshFailure,
      noteRefreshSuccess,
      plugin,
      projectionClient,
    ]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useBrokerStatusPolling({
    hasRunningJob: anyConnectionHasRunningJob(
      loadedRithmicStatus(state.statusState)?.connections ?? []
    ),
    failureState,
    refresh,
  });

  const updateMapping = useCallback(
    (canonicalAccountId: string, localAccountId: string) => {
      patchState((current) => {
        const mappingDirty = { ...current.mappingDirty };
        if (localAccountId) {
          mappingDirty[canonicalAccountId] = true;
        } else {
          delete mappingDirty[canonicalAccountId];
        }
        return {
          accountMappings: {
            ...current.accountMappings,
            [canonicalAccountId]: localAccountId,
          },
          mappingDirty,
        };
      });
    },
    []
  );

  const syncConnection = useCallback(
    async (connectionId: string) => {
      const connection = loadedRithmicStatus(
        state.statusState
      )?.connections.find((candidate) => candidate.id === connectionId);
      if (!connection || !connectionCanSync(connection)) return;
      const dataOwnership = state.dataOwnership;
      if (!dataOwnership?.isCurrent()) {
        patchState(INITIAL_PANEL_STATE);
        void refresh();
        return;
      }
      const syncableAccounts = connection.accounts.filter(
        (account) => account.syncEnabled
      );
      if (
        syncableAccounts.some(
          (account) => !state.accountMappings[account.canonicalAccountId]
        )
      ) {
        new Notice(t('trade-sync.rithmic.mapping-required'));
        return;
      }
      markConnectionBusy(connectionId, true);
      try {
        const vaultId =
          state.vaultId || (await getTradeProjectionVaultId(plugin));
        const operation = createBrokerConnectionOperation(
          plugin,
          vaultId,
          connectionId,
          'rithmic'
        );
        const ownershipChanged = createTradeProjectionOwnershipGuard(
          plugin,
          operation.ownerUserId
        );
        const assertOwnership = () => {
          if (ownershipChanged() || !dataOwnership.isCurrent()) {
            throw new Error('Trade Projection configuration stopped');
          }
        };
        assertOwnership();
        const localAccountsById = new Map(
          state.localAccounts.map((account) => [account.id, account])
        );
        const persistedLocalAccountIds = new Map<string, string>();
        const pendingUpdates = new Map<string, Promise<void>>();
        for (const account of connection.accounts) {
          if (!state.mappingDirty[account.canonicalAccountId]) continue;
          const localAccount = localAccountsById.get(
            state.accountMappings[account.canonicalAccountId]
          );
          if (!localAccount || pendingUpdates.has(account.canonicalAccountId)) {
            continue;
          }
          assertOwnership();
          persistedLocalAccountIds.set(
            account.canonicalAccountId,
            localAccount.id
          );
          pendingUpdates.set(
            account.canonicalAccountId,
            mappingUpdates.enqueue(account.canonicalAccountId, async () => {
              assertOwnership();
              await projectionClient.updateAccountVaultMapping(
                account.canonicalAccountId,
                {
                  vaultId,
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
        await Promise.all(pendingUpdates.values());
        assertOwnership();
        
        
        const triggersRemoteSync =
          connection.status === 'setup_required' || syncableAccounts.length > 0;
        if (!triggersRemoteSync) {
          new Notice(t('notice.sync-mapping.updated'));
        } else {
          const result = await plugin
            .ensureTradeProjectionSyncService()
            .syncRithmicConnection(connectionId, operation);
          assertOwnership();
          new Notice(
            t(
              result.partial ||
                result.failedCount > 0 ||
                result.pendingCount > 0
                ? 'trade-sync.rithmic.sync-partial-connection'
                : 'trade-sync.rithmic.sync-complete-connection',
              { connection: connection.displayName }
            )
          );
        }
        patchState((current) => ({
          mappingDirty: Object.fromEntries(
            Object.entries(current.mappingDirty).filter(
              ([canonicalAccountId]) => {
                const persistedLocalAccountId =
                  persistedLocalAccountIds.get(canonicalAccountId);
                if (!persistedLocalAccountId) return true;
                return (
                  current.accountMappings[canonicalAccountId] !==
                  persistedLocalAccountId
                );
              }
            )
          ),
        }));
        await refresh();
      } catch (error) {
        logger.error('Rithmic connection synchronization failed', error);
        new Notice(
          rithmicSyncErrorMessage(
            rithmicSyncErrorCode(error),
            rithmicSyncErrorDetail(error)
          )
        );
        await refresh();
      } finally {
        markConnectionBusy(connectionId, false);
      }
    },
    [
      mappingUpdates,
      markConnectionBusy,
      plugin,
      projectionClient,
      refresh,
      state.accountMappings,
      state.dataOwnership,
      state.localAccounts,
      state.mappingDirty,
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
  const isSyncAllEligible = useCallback(
    (connection: RithmicConnection) =>
      connectionSyncAllEligibility(
        connection,
        state.accountMappings,
        state.mappingDirty
      ),
    [state.accountMappings, state.mappingDirty]
  );
  const syncConnections = useCallback(
    (connectionIds: string[]) =>
      plugin.ensureTradeProjectionSyncService().syncRithmicAll(connectionIds),
    [plugin]
  );
  const completionNotice = useCallback(
    ({ succeeded, total, hasIssues }: BrokerSyncAllSummary) =>
      t(
        hasIssues
          ? 'trade-sync.rithmic.sync-all-partial'
          : 'trade-sync.rithmic.sync-all-complete',
        { succeeded: String(succeeded), total: String(total) }
      ),
    []
  );
  const { syncAll, syncAllAvailable, syncAllBlockedMessage } = useBrokerSyncAll(
    {
      plugin,
      connections: loadedRithmicStatus(state.statusState)?.connections ?? [],
      isEligible: isSyncAllEligible,
      dataOwnership: state.dataOwnership,
      syncConnections,
      completionNotice,
      setSyncAllBusy,
      setBusyConnections,
      resetForOwnershipChange,
      refresh,
    }
  );

  const connectionStates = Object.fromEntries(
    (loadedRithmicStatus(state.statusState)?.connections ?? []).map(
      (connection) => [
        connection.id,
        {
          canSync: connectionCanSync(connection),
          requiresWebsite: connectionRequiresWebsite(connection),
          hasRunningJob: connectionHasRunningJob(connection),
          latestJob: connection.jobs[0],
        },
      ]
    )
  );

  return {
    statusState: state.statusState,
    localAccounts: state.localAccounts,
    accountMappings: state.accountMappings,
    mappingDirty: state.mappingDirty,
    busyConnections,
    refreshing: state.refreshing,
    syncAllBusy: state.syncAllBusy,
    syncAllAvailable,
    syncAllBlockedMessage,
    connectionStates,
    refresh,
    syncConnection,
    syncAll,
    updateMapping,
  };
}
