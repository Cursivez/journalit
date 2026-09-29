import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Notice } from 'obsidian';
import {
  Import,
  RefreshCw,
} from '../../../components/shared/icons/ObsidianIcon';
import { Button } from '../../../components/ui';
import { t } from '../../../lang/helpers';
import { logger } from '../../../utils/logger';
import type JournalitPlugin from '../../../main';
import { ApiClient } from '../../../services/backend/ApiClient';
import { BackendTradeImportService } from '../../../services/tradeImport/BackendTradeImportService';
import { TradeProjectionClient } from '../../../services/tradeSync/TradeProjectionClient';
import {
  clearLocalDeletedTradeProjection,
  countPendingTradeProjectionAcksForCurrentOwner,
  flushTradeProjectionAcks,
  getTradeProjectionVaultId,
  restoreTradeProjectionAtomically,
} from '../../../services/tradeSync/TradeProjectionAckQueue';
import {
  createTradeProjectionOwnershipGuard,
  getTradeProjectionOwnerId,
} from '../../../services/tradeSync/TradeProjectionOwnership';
import { loadAllProjectionPages } from '../../../services/tradeSync/TradeProjectionPagination';
import { TradeImportWorkflowService } from '../../../services/tradeImport/TradeImportWorkflowService';
import { deleteTradeImportAccountsFromServer } from '../../../services/tradeImport/tradeImportServerDeletion';
import { syncServerDeletedTrades } from '../../../services/tradeSync/ServerDeletedTradeSync';
import { showConfirmationModal } from '../../../components/shared/ConfirmationModal';
import { TradeImportHistorySection } from './TradeImportHistorySection';
import { consumeImportHistoryFocus } from '../../../services/tradeImport/importManagementNavigation';
import { buildProjectionSyncOperationResult } from '../../../services/tradeOperations/resultBuilders';
import type {
  TradeProjectionAccountInventoryItem,
  TradeProjection,
} from '../../../services/tradeSync/types';
import {
  isRateLimitActive,
  isTradeSyncRateLimitError,
  tradeSyncRateLimitMessage,
} from '../../../services/tradeSync/TradeSyncRateLimit';
import { useRateLimitCountdown } from './brokerSyncKit';
import {
  TradeProjectionInventory,
  selectDefaultLocalAccount,
  type ImportAccountOption,
} from './TradeImportProjectionInventory';

interface TradeImportSyncPanelProps {
  plugin: JournalitPlugin;
  projectionOnly?: boolean;
  brokerFilter?: string;
  canonicalAccountIds?: readonly string[];
}

type ConnectionStatus = 'connected' | 'disconnected' | 'unknown';

type AccountMappings = Record<string, string>;

const RESTORE_PAGE_LIMIT = 100;

interface TradeImportSyncState {
  connectionStatus: ConnectionStatus;
  vaultId: string;
  busy: boolean;
  inventoryLoaded: boolean;
  accounts: TradeProjectionAccountInventoryItem[];
  localAccounts: ImportAccountOption[];
  selectedLocalAccounts: AccountMappings;
  inventoryOwnership?: TradeProjectionInventoryOwnership;
  restoringAccountId?: string;
  mappingRetryAtByAccountId: Record<string, number>;
  restoreRetryAtByAccountId: Record<string, number>;
}

interface TradeProjectionInventoryOwnership {
  ownerUserId: string;
  isCurrent: () => boolean;
}

function fallbackAccountOptions(
  plugin: JournalitPlugin
): ImportAccountOption[] {
  const metadata = plugin.settings.account?.accountMetadata ?? {};
  const options = Object.keys(metadata).map((name) => ({ name, id: name }));
  return options;
}

async function loadAccountOptions(
  plugin: JournalitPlugin
): Promise<ImportAccountOption[]> {
  const catalog = await plugin.accountPageService?.getAccountCatalog();
  const catalogOptions = (catalog ?? []).flatMap((account) =>
    !account.archived && account.name
      ? [{ name: account.name, id: account.id || account.name }]
      : []
  );
  return catalogOptions.length
    ? catalogOptions
    : fallbackAccountOptions(plugin);
}

export async function loadTradeProjectionInventoryForCurrentOwner(
  plugin: JournalitPlugin,
  projectionBackendService: TradeProjectionClient,
  vaultId: string
): Promise<{
  localAccounts: ImportAccountOption[];
  ownership: TradeProjectionInventoryOwnership;
  response: Awaited<ReturnType<TradeProjectionClient['getAccountInventory']>>;
} | null> {
  const initiatingOwnerUserId = getTradeProjectionOwnerId(plugin);
  const shouldStop = createTradeProjectionOwnershipGuard(
    plugin,
    initiatingOwnerUserId
  );
  if (shouldStop()) return null;
  await flushTradeProjectionAcks(plugin, projectionBackendService);
  if (shouldStop()) return null;
  const [localAccounts, response] = await Promise.all([
    loadAccountOptions(plugin),
    projectionBackendService.getAccountInventory(vaultId),
  ]);
  return shouldStop()
    ? null
    : {
        localAccounts,
        ownership: {
          ownerUserId: initiatingOwnerUserId,
          isCurrent: () => !shouldStop(),
        },
        response,
      };
}

type TradeImportSyncUpdate =
  | Partial<TradeImportSyncState>
  | ((state: TradeImportSyncState) => Partial<TradeImportSyncState>);

function reducer(
  state: TradeImportSyncState,
  update: TradeImportSyncUpdate
): TradeImportSyncState {
  const patch = typeof update === 'function' ? update(state) : update;
  return { ...state, ...patch };
}

function connectionText(status: ConnectionStatus): string {
  if (status === 'connected') return t('backend.status.connected');
  if (status === 'disconnected') return t('backend.status.disconnected');
  return t('backend.status.checking');
}

export async function persistTradeProjectionMappingForInventoryOwner(
  ownership: TradeProjectionInventoryOwnership,
  projectionBackendService: TradeProjectionClient,
  accountId: string,
  mapping: Parameters<TradeProjectionClient['updateAccountVaultMapping']>[1]
): Promise<void> {
  if (!ownership.isCurrent()) {
    throw new Error('Trade Projection inventory ownership changed');
  }
  await projectionBackendService.updateAccountVaultMapping(accountId, mapping);
}

function totalRestorable(
  accounts: TradeProjectionAccountInventoryItem[]
): number {
  return accounts.reduce(
    (total, account) => total + account.restorableCount,
    0
  );
}

function totalSynced(accounts: TradeProjectionAccountInventoryItem[]): number {
  return accounts.reduce((total, account) => total + account.syncedCount, 0);
}

export async function loadAllRestorableProjections(
  workflowService: TradeImportWorkflowService,
  accountId: string,
  shouldStop: () => boolean
): Promise<TradeProjection[]> {
  return loadAllProjectionPages(
    async (cursor) => {
      if (shouldStop()) throw new Error('Trade Projection recovery stopped');
      const response = await workflowService.getRestorableProjections({
        accountId,
        includeLocalDeleted: true,
        includeConflict: true,
        limit: RESTORE_PAGE_LIMIT,
        cursor,
      });
      if (shouldStop()) throw new Error('Trade Projection recovery stopped');
      return response;
    },
    (projection) => projection.projectionStatus !== 'synced'
  );
}


const TradeImportSyncHeader: React.FC<{
  connectionStatus: ConnectionStatus;
  inventoryLoaded: boolean;
  accountCount: number;
  restorableCount: number;
  syncedCount: number;
  busy: boolean;
  onLoadInventory: () => void;
  onOpenTradeImport: () => void;
}> = ({
  connectionStatus,
  inventoryLoaded,
  accountCount,
  restorableCount,
  syncedCount,
  busy,
  onLoadInventory,
  onOpenTradeImport,
}) => (
  <div className="journalit-trade-import-sync-header">
    <div className="journalit-trade-import-sync-header__summary">
      <span
        className={`journalit-trade-import-sync-header__connection is-${connectionStatus}`}
      >
        {connectionText(connectionStatus)}
      </span>
      {inventoryLoaded && (
        <>
          <span>
            {t('trade-sync.import.card.inventory-summary', {
              accounts: String(accountCount),
              trades: String(syncedCount),
            })}
          </span>
          {restorableCount > 0 && (
            <span className="journalit-trade-import-sync-header__restorable">
              {t('trade-sync.import.account.restorable-count', {
                count: String(restorableCount),
              })}
            </span>
          )}
        </>
      )}
    </div>
    <div className="journalit-trade-import-sync-header__actions">
      <Button variant="secondary" onClick={onOpenTradeImport}>
        <Import size={14} />
        {t('trade-sync.import.action.open-import')}
      </Button>
      <Button
        variant="primary"
        disabled={busy || connectionStatus === 'disconnected'}
        onClick={onLoadInventory}
      >
        <RefreshCw size={14} />
        {t('trade-sync.import.action.check')}
      </Button>
    </div>
  </div>
);

export const TradeImportSyncPanel: React.FC<TradeImportSyncPanelProps> = ({
  plugin,
  projectionOnly = false,
  brokerFilter,
  canonicalAccountIds,
}) => {
  const initialAccounts = fallbackAccountOptions(plugin);
  const [state, dispatchState] = useReducer(reducer, {
    connectionStatus: 'unknown',
    vaultId: '',
    busy: false,
    inventoryLoaded: false,
    accounts: [],
    localAccounts: initialAccounts,
    selectedLocalAccounts: {},
    mappingRetryAtByAccountId: {},
    restoreRetryAtByAccountId: {},
  });

  const backendService = useMemo(() => new BackendTradeImportService(), []);
  const projectionBackendService = useMemo(
    () => new TradeProjectionClient(),
    []
  );
  const workflowService = useMemo(
    () =>
      new TradeImportWorkflowService(
        plugin,
        backendService,
        projectionBackendService
      ),
    [backendService, plugin, projectionBackendService]
  );
  const localAccountIdsByName = useMemo(
    () =>
      Object.fromEntries(
        state.localAccounts.map((account) => [account.name, account.id])
      ),
    [state.localAccounts]
  );
  const pendingAckCount =
    countPendingTradeProjectionAcksForCurrentOwner(plugin);
  const autoLoadVaultId = useRef<string | null>(null);
  
  const [focusHistory] = useState(
    () => !projectionOnly && consumeImportHistoryFocus(plugin)
  );
  const now = useRateLimitCountdown(
    state.mappingRetryAtByAccountId,
    state.restoreRetryAtByAccountId
  );
  const refreshConnection = useCallback(async () => {
    try {
      dispatchState({
        connectionStatus: (await ApiClient.checkHealth())
          ? 'connected'
          : 'disconnected',
      });
    } catch {
      dispatchState({ connectionStatus: 'disconnected' });
    }
  }, []);

  const refreshLocalAccounts = useCallback(async () => {
    const localAccounts = await loadAccountOptions(plugin);
    dispatchState({ localAccounts });
    return localAccounts;
  }, [plugin]);

  useEffect(() => {
    let cancelled = false;
    void getTradeProjectionVaultId(plugin).then((vaultId) => {
      if (!cancelled) dispatchState({ vaultId });
    });
    void refreshConnection();
    void refreshLocalAccounts();
    return () => {
      cancelled = true;
    };
  }, [plugin, refreshConnection, refreshLocalAccounts]);

  const loadInventory = useCallback(async () => {
    if (!state.vaultId) return;
    dispatchState({ busy: true });
    try {
      if (!projectionOnly) {
        
        
        await syncServerDeletedTrades(plugin).catch((error: unknown) => {
          logger.warn('Server-deleted trade cleanup failed', error);
        });
      }
      const loaded = await loadTradeProjectionInventoryForCurrentOwner(
        plugin,
        projectionBackendService,
        state.vaultId
      );
      if (!loaded) {
        autoLoadVaultId.current = null;
        dispatchState({
          accounts: [],
          selectedLocalAccounts: {},
          inventoryOwnership: undefined,
          inventoryLoaded: false,
        });
        return;
      }
      const { localAccounts, ownership, response } = loaded;
      const accounts = brokerFilter
        ? response.accounts.filter(
            (account) =>
              account.broker === brokerFilter &&
              (canonicalAccountIds === undefined ||
                canonicalAccountIds.includes(account.accountId))
          )
        : response.accounts;
      
      
      const selectedLocalAccounts = Object.fromEntries(
        accounts.map((account) => [
          account.accountId,
          selectDefaultLocalAccount(account, localAccounts),
        ])
      );
      dispatchState({
        accounts,
        localAccounts,
        inventoryOwnership: ownership,
        selectedLocalAccounts,
        inventoryLoaded: true,
      });
    } catch (error) {
      logger.error('Trade projection inventory load failed', error);
      new Notice(t('trade-sync.import.notice.load-failed'));
    } finally {
      dispatchState({ busy: false });
    }
  }, [
    plugin,
    projectionBackendService,
    projectionOnly,
    state.vaultId,
    brokerFilter,
    canonicalAccountIds,
  ]);

  
  const [historyRevision, setHistoryRevision] = useState(0);

  const deleteAccountFromServer = useCallback(
    async (account: TradeProjectionAccountInventoryItem) => {
      const confirmed = await showConfirmationModal(plugin.app, {
        title: t('trade-import.server-deletion.account.title'),
        message: t('trade-import.server-deletion.account.message', {
          account: account.displayName,
          count: String(account.tradeCount),
        }),
        confirmLabel: t('trade-import.server-deletion.account.confirm'),
        cancelLabel: t('button.cancel'),
        destructive: true,
      });
      if (!confirmed) return;
      dispatchState({ busy: true });
      let deleted = false;
      try {
        deleted = await deleteTradeImportAccountsFromServer(plugin, [
          account.accountId,
        ]);
      } finally {
        dispatchState({ busy: false });
      }
      if (deleted) {
        setHistoryRevision((revision) => revision + 1);
        await loadInventory();
      }
    },
    [loadInventory, plugin]
  );

  useEffect(() => {
    if (
      !(projectionOnly || focusHistory) ||
      !state.vaultId ||
      state.inventoryLoaded ||
      state.busy ||
      autoLoadVaultId.current === state.vaultId
    ) {
      return;
    }
    autoLoadVaultId.current = state.vaultId;
    void loadInventory();
  }, [
    projectionOnly,
    focusHistory,
    state.vaultId,
    state.inventoryLoaded,
    state.busy,
    loadInventory,
  ]);

  const persistMapping = useCallback(
    async (
      account: TradeProjectionAccountInventoryItem,
      localAccountName: string
    ) => {
      if (!state.vaultId || !localAccountName) return;
      const ownership = state.inventoryOwnership;
      if (!ownership) {
        throw new Error('Trade Projection inventory ownership unavailable');
      }
      const localAccountId =
        localAccountIdsByName[localAccountName] || localAccountName;
      await persistTradeProjectionMappingForInventoryOwner(
        ownership,
        projectionBackendService,
        account.accountId,
        {
          vaultId: state.vaultId,
          localAccountId,
          localAccountName,
          mappingStatus: 'mapped',
        }
      );
    },
    [
      localAccountIdsByName,
      projectionBackendService,
      state.inventoryOwnership,
      state.vaultId,
    ]
  );

  
  const saveMapping = useCallback(
    async (
      account: TradeProjectionAccountInventoryItem,
      localAccountName: string
    ): Promise<boolean> => {
      if (
        !state.vaultId ||
        !localAccountName ||
        isRateLimitActive(state.mappingRetryAtByAccountId[account.accountId])
      ) {
        return false;
      }
      dispatchState({ busy: true });
      try {
        await persistMapping(account, localAccountName);
        await loadInventory();
        return true;
      } catch (error) {
        if (isTradeSyncRateLimitError(error)) {
          dispatchState((current) => ({
            mappingRetryAtByAccountId: {
              ...current.mappingRetryAtByAccountId,
              [account.accountId]: error.retryAt,
            },
          }));
          new Notice(tradeSyncRateLimitMessage(error.retryAt, error.action));
        } else {
          logger.error('Trade projection account mapping failed', error);
          new Notice(t('trade-sync.import.notice.mapping-failed'));
        }
        return false;
      } finally {
        dispatchState({ busy: false });
      }
    },
    [
      loadInventory,
      persistMapping,
      state.mappingRetryAtByAccountId,
      state.vaultId,
    ]
  );

  const createLocalAccount = useCallback(
    async (account: TradeProjectionAccountInventoryItem) => {
      if (
        isRateLimitActive(state.mappingRetryAtByAccountId[account.accountId])
      ) {
        return;
      }
      const accountName = account.displayName;
      dispatchState({ busy: true });
      try {
        await plugin.accountPageService?.updateAccountMetadata(accountName, {});
        const localAccounts = await refreshLocalAccounts();
        dispatchState({
          selectedLocalAccounts: {
            ...state.selectedLocalAccounts,
            [account.accountId]: accountName,
          },
          localAccounts,
        });
        await persistMapping(account, accountName);
        await loadInventory();
      } catch (error) {
        if (isTradeSyncRateLimitError(error)) {
          dispatchState((current) => ({
            mappingRetryAtByAccountId: {
              ...current.mappingRetryAtByAccountId,
              [account.accountId]: error.retryAt,
            },
          }));
          new Notice(tradeSyncRateLimitMessage(error.retryAt, error.action));
        } else {
          logger.error('Trade projection local account creation failed', error);
          new Notice(t('trade-sync.import.notice.create-account-failed'));
        }
      } finally {
        dispatchState({ busy: false });
      }
    },
    [
      plugin.accountPageService,
      refreshLocalAccounts,
      loadInventory,
      persistMapping,
      state.mappingRetryAtByAccountId,
      state.selectedLocalAccounts,
    ]
  );

  const restoreAccount = useCallback(
    async (
      account: TradeProjectionAccountInventoryItem,
      localAccountName: string
    ) => {
      if (
        !localAccountName ||
        isRateLimitActive(state.mappingRetryAtByAccountId[account.accountId]) ||
        isRateLimitActive(state.restoreRetryAtByAccountId[account.accountId])
      ) {
        return;
      }
      const initiatingOwnerUserId = getTradeProjectionOwnerId(plugin);
      const shouldStop = createTradeProjectionOwnershipGuard(
        plugin,
        initiatingOwnerUserId
      );
      if (shouldStop()) return;
      dispatchState({ busy: true, restoringAccountId: account.accountId });
      try {
        
        
        await persistMapping(account, localAccountName);
        if (shouldStop()) return;
        let restorableProjections = await loadAllRestorableProjections(
          workflowService,
          account.accountId,
          shouldStop
        );
        if (!restorableProjections.length) {
          if (!shouldStop()) await loadInventory();
          return;
        }
        const restoredProjectionIds = new Set<string>();
        for (const projection of restorableProjections) {
          if (shouldStop()) return;
          if (projection.projectionStatus === 'local_deleted') {
            await restoreTradeProjectionAtomically(
              plugin,
              projection.id,
              async () => {
                if (shouldStop())
                  throw new Error('Trade Projection recovery stopped');
                const restored =
                  await projectionBackendService.restoreProjection(
                    projection.id,
                    state.vaultId
                  );
                if (shouldStop())
                  throw new Error('Trade Projection recovery stopped');
                return restored;
              }
            );
            restoredProjectionIds.add(projection.id);
          } else {
            await clearLocalDeletedTradeProjection(plugin, projection.id);
          }
        }
        if (restoredProjectionIds.size > 0) {
          const refreshed = await loadAllRestorableProjections(
            workflowService,
            account.accountId,
            shouldStop
          );
          const refreshedById = new Map(
            refreshed.map((projection) => [projection.id, projection])
          );
          restorableProjections = restorableProjections.map((projection) => {
            if (!restoredProjectionIds.has(projection.id)) return projection;
            const current = refreshedById.get(projection.id);
            if (!current) {
              throw new Error('Restored projection is not available');
            }
            return current;
          });
        }
        if (shouldStop()) return;
        const result = await workflowService.restoreProjections({
          accountName: localAccountName,
          brokerLabel: t('trade-import.restore.broker-label'),
          projections: restorableProjections,
          localWriteTimeoutMs: 30000,
          ownerUserId: initiatingOwnerUserId,
          shouldStop,
        });
        if (shouldStop()) return;
        plugin.ensureTradeOperationResultService().record(
          buildProjectionSyncOperationResult({
            result: {
              accountCount: 1,
              writtenCount: result.writtenCount,
              failedCount: result.failedCount,
              pendingCount: result.pendingCount,
              importedTrades: result.importedTrades,
            },
            source: 'projection-restore',
            ownerUserId: initiatingOwnerUserId,
          })
        );
        if (result.failedCount > 0) {
          new Notice(
            t('trade-import.restore.complete', {
              written: String(result.writtenCount),
              failed: String(result.failedCount),
            })
          );
        } else if (result.writtenCount > 0) {
          new Notice(
            t('trade-sync.import.notice.restored', {
              count: String(result.writtenCount),
            })
          );
        }
        if (result.pendingCount > 0) {
          new Notice(
            t('csv.results.pending-local-writes', {
              count: String(result.pendingCount),
            })
          );
        }
        await loadInventory();
      } catch (error) {
        if (shouldStop()) return;
        if (isTradeSyncRateLimitError(error)) {
          const field =
            error.action === 'mapping'
              ? 'mappingRetryAtByAccountId'
              : 'restoreRetryAtByAccountId';
          dispatchState((current) => ({
            [field]: {
              ...current[field],
              [account.accountId]: error.retryAt,
            },
          }));
          new Notice(tradeSyncRateLimitMessage(error.retryAt, error.action));
        } else {
          logger.error('Trade projection restore failed', error);
          new Notice(t('trade-sync.import.notice.restore-failed'));
        }
      } finally {
        dispatchState({ busy: false, restoringAccountId: undefined });
      }
    },
    [
      loadInventory,
      persistMapping,
      plugin,
      projectionBackendService,
      state.mappingRetryAtByAccountId,
      state.restoreRetryAtByAccountId,
      state.vaultId,
      workflowService,
    ]
  );

  
  const selectLocalAccount = useCallback(
    (
      account: TradeProjectionAccountInventoryItem,
      localAccountName: string
    ) => {
      const previous = state.selectedLocalAccounts[account.accountId] ?? '';
      dispatchState({
        selectedLocalAccounts: {
          ...state.selectedLocalAccounts,
          [account.accountId]: localAccountName,
        },
      });
      if (
        localAccountName &&
        account.mapping?.localAccountName !== localAccountName
      ) {
        
        
        void saveMapping(account, localAccountName).then((saved) => {
          if (saved) return;
          dispatchState((current) => ({
            selectedLocalAccounts: {
              ...current.selectedLocalAccounts,
              [account.accountId]: previous,
            },
          }));
        });
      }
    },
    [saveMapping, state.selectedLocalAccounts]
  );

  const visibleAccounts = canonicalAccountIds
    ? state.accounts.filter((account) =>
        canonicalAccountIds.includes(account.accountId)
      )
    : state.accounts;

  return (
    <div className="journalit-trade-import-sync-panel">
      {!projectionOnly && (
        <TradeImportSyncHeader
          connectionStatus={state.connectionStatus}
          inventoryLoaded={state.inventoryLoaded}
          accountCount={visibleAccounts.length}
          restorableCount={totalRestorable(visibleAccounts)}
          syncedCount={totalSynced(visibleAccounts)}
          busy={state.busy}
          onLoadInventory={() => void loadInventory()}
          onOpenTradeImport={() => void plugin.viewManager.openCSVImportView()}
        />
      )}

      <TradeProjectionInventory
        showPendingAcks={!projectionOnly}
        pendingAckCount={pendingAckCount}
        inventoryLoaded={state.inventoryLoaded}
        accounts={visibleAccounts}
        localAccounts={state.localAccounts}
        selectedLocalAccounts={state.selectedLocalAccounts}
        busy={state.busy}
        restoringAccountId={state.restoringAccountId}
        mappingRetryAtByAccountId={state.mappingRetryAtByAccountId}
        restoreRetryAtByAccountId={state.restoreRetryAtByAccountId}
        now={now}
        onSelectLocalAccount={selectLocalAccount}
        onCreateLocalAccount={(account) => void createLocalAccount(account)}
        onRestore={(account, localAccountName) =>
          void restoreAccount(account, localAccountName)
        }
        onDeleteFromServer={
          projectionOnly
            ? undefined
            : (account) => void deleteAccountFromServer(account)
        }
      />

      
      {!projectionOnly && (state.inventoryLoaded || focusHistory) && (
        <TradeImportHistorySection
          plugin={plugin}
          defaultOpen={focusHistory}
          revision={historyRevision}
          onDeleted={() => void loadInventory()}
        />
      )}
    </div>
  );
};

TradeImportSyncPanel.displayName = 'TradeImportSyncPanel';
