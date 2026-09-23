import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { Notice } from 'obsidian';
import {
  CheckCircle2,
  Import,
  RefreshCw,
  Server,
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

const TradeImportSyncCards: React.FC<{
  connectionStatus: ConnectionStatus;
  inventoryLoaded: boolean;
  accountCount: number;
  restorableCount: number;
  syncedCount: number;
  busy: boolean;
  onRefreshConnection: () => void;
  onLoadInventory: () => void;
  onOpenTradeImport: () => void;
}> = ({
  connectionStatus,
  inventoryLoaded,
  accountCount,
  restorableCount,
  syncedCount,
  busy,
  onRefreshConnection,
  onLoadInventory,
  onOpenTradeImport,
}) => (
  <div className="status-cards">
    <div className={`status-card status-card--${connectionStatus}`}>
      <div className="status-card-header">
        <Server size={20} />
        <span>{t('trade-sync.import.card.connection')}</span>
      </div>
      <div className="status-card-content">
        <div className="status-card-value">
          <CheckCircle2 className="status-icon status-icon--success" />
          <span>{connectionText(connectionStatus)}</span>
        </div>
      </div>
      <div className="status-card-actions">
        <Button variant="secondary" onClick={onRefreshConnection}>
          <RefreshCw size={14} />
          {t('backend.cards.connection.refresh')}
        </Button>
      </div>
    </div>

    <div className="status-card">
      <div className="status-card-header">
        <RefreshCw size={20} />
        <span>{t('trade-sync.import.card.backup')}</span>
      </div>
      <div className="status-card-content">
        <div className="status-card-metric status-card-metric--large">
          <span className="metric-value metric-value--large">
            {inventoryLoaded ? restorableCount : '—'}
          </span>
          <span className="metric-label">
            {t('trade-sync.import.card.restorable')}
          </span>
        </div>
        {inventoryLoaded && (
          <div className="journalit-trade-import-sync-card-subtext">
            {t('trade-sync.import.card.inventory-summary', {
              accounts: String(accountCount),
              trades: String(syncedCount),
            })}
          </div>
        )}
      </div>
      <div className="status-card-actions">
        <Button
          variant="primary"
          disabled={busy || connectionStatus === 'disconnected'}
          onClick={onLoadInventory}
        >
          {t('trade-sync.import.action.check')}
        </Button>
      </div>
    </div>

    <div className="status-card">
      <div className="status-card-header">
        <Import size={20} />
        <span>{t('trade-sync.import.card.import')}</span>
      </div>
      <div className="status-card-content">
        <div className="status-card-metric">
          <span className="metric-label">
            {t('trade-sync.import.card.open-importer-desc')}
          </span>
        </div>
      </div>
      <div className="status-card-actions">
        <Button variant="secondary" onClick={onOpenTradeImport}>
          {t('trade-sync.import.action.open-import')}
        </Button>
      </div>
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
          state.selectedLocalAccounts[account.accountId] ??
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
    state.selectedLocalAccounts,
    state.vaultId,
    brokerFilter,
    canonicalAccountIds,
  ]);

  useEffect(() => {
    if (
      !projectionOnly ||
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
    ) => {
      if (
        !state.vaultId ||
        !localAccountName ||
        isRateLimitActive(state.mappingRetryAtByAccountId[account.accountId])
      ) {
        return;
      }
      dispatchState({ busy: true });
      try {
        await persistMapping(account, localAccountName);
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
          logger.error('Trade projection account mapping failed', error);
          new Notice(t('trade-sync.import.notice.mapping-failed'));
        }
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

  const setSelectedLocalAccount = useCallback(
    (accountId: string, localAccountName: string) => {
      dispatchState({
        selectedLocalAccounts: {
          ...state.selectedLocalAccounts,
          [accountId]: localAccountName,
        },
      });
    },
    [state.selectedLocalAccounts]
  );

  const visibleAccounts = canonicalAccountIds
    ? state.accounts.filter((account) =>
        canonicalAccountIds.includes(account.accountId)
      )
    : state.accounts;

  return (
    <div className="journalit-trade-import-sync-panel">
      {!projectionOnly && (
        <TradeImportSyncCards
          connectionStatus={state.connectionStatus}
          inventoryLoaded={state.inventoryLoaded}
          accountCount={visibleAccounts.length}
          restorableCount={totalRestorable(visibleAccounts)}
          syncedCount={totalSynced(visibleAccounts)}
          busy={state.busy}
          onRefreshConnection={() => void refreshConnection()}
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
        onSelectLocalAccount={setSelectedLocalAccount}
        onCreateLocalAccount={(account) => void createLocalAccount(account)}
        onSaveMapping={(account, localAccountName) =>
          void saveMapping(account, localAccountName)
        }
        onRestore={(account, localAccountName) =>
          void restoreAccount(account, localAccountName)
        }
      />
    </div>
  );
};

TradeImportSyncPanel.displayName = 'TradeImportSyncPanel';
