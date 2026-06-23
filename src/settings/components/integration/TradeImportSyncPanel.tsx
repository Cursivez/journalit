import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { Notice } from 'obsidian';
import {
  CheckCircle2,
  Import,
  RefreshCw,
  RotateCcw,
  Save,
  Server,
} from '../../../components/shared/icons/ObsidianIcon';
import { Button } from '../../../components/ui';
import { t } from '../../../lang/helpers';
import type JournalitPlugin from '../../../main';
import { ApiClient } from '../../../services/backend/ApiClient';
import { BackendTradeImportService } from '../../../services/tradeImport/BackendTradeImportService';
import {
  flushTradeImportProjectionAcks,
  getTradeImportVaultId,
} from '../../../services/tradeImport/TradeImportProjectionAckQueue';
import { TradeImportWorkflowService } from '../../../services/tradeImport/TradeImportWorkflowService';
import type {
  TradeImportAccountInventoryItem,
  TradeImportRestorableProjection,
} from '../../../services/tradeImport/types';

interface TradeImportSyncPanelProps {
  plugin: JournalitPlugin;
}

interface ImportAccountOption {
  name: string;
  id: string;
}

type ConnectionStatus = 'connected' | 'disconnected' | 'unknown';

type AccountMappings = Record<string, string>;

const RESTORE_PAGE_LIMIT = 100;

interface TradeImportSyncState {
  connectionStatus: ConnectionStatus;
  vaultId: string;
  busy: boolean;
  inventoryLoaded: boolean;
  accounts: TradeImportAccountInventoryItem[];
  localAccounts: ImportAccountOption[];
  selectedLocalAccounts: AccountMappings;
  restoringAccountId?: string;
}

function fallbackAccountOptions(
  plugin: JournalitPlugin
): ImportAccountOption[] {
  const metadata = plugin.settings.account?.accountMetadata ?? {};
  const options = Object.keys(metadata).map((name) => ({ name, id: name }));
  return options.length
    ? options
    : [{ name: 'Main Account', id: 'Main Account' }];
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

function reducer(
  state: TradeImportSyncState,
  update: Partial<TradeImportSyncState>
): TradeImportSyncState {
  return { ...state, ...update };
}

function connectionText(status: ConnectionStatus): string {
  if (status === 'connected') return t('backend.status.connected');
  if (status === 'disconnected') return t('backend.status.disconnected');
  return t('backend.status.checking');
}

function selectDefaultLocalAccount(
  account: TradeImportAccountInventoryItem,
  localAccounts: ImportAccountOption[]
): string {
  const mappedName = account.mapping?.localAccountName;
  if (mappedName && localAccounts.some((local) => local.name === mappedName)) {
    return mappedName;
  }
  if (localAccounts.some((local) => local.name === account.displayName)) {
    return account.displayName;
  }
  return localAccounts[0]?.name ?? '';
}

function defaultMappingTarget(
  account: TradeImportAccountInventoryItem,
  localAccounts: ImportAccountOption[]
): string {
  const mappedName = account.mapping?.localAccountName;
  if (mappedName && localAccounts.some((local) => local.name === mappedName)) {
    return mappedName;
  }
  if (localAccounts.some((local) => local.name === account.displayName)) {
    return account.displayName;
  }
  return '';
}

function totalRestorable(accounts: TradeImportAccountInventoryItem[]): number {
  return accounts.reduce(
    (total, account) => total + account.restorableCount,
    0
  );
}

function totalSynced(accounts: TradeImportAccountInventoryItem[]): number {
  return accounts.reduce((total, account) => total + account.syncedCount, 0);
}

async function loadAllRestorableProjections(
  workflowService: TradeImportWorkflowService,
  accountId: string,
  cursor?: string
): Promise<TradeImportRestorableProjection[]> {
  const response = await workflowService.getRestorableProjections({
    accountId,
    limit: RESTORE_PAGE_LIMIT,
    cursor,
  });
  const current = response.projections.filter(
    (projection) => projection.projectionStatus !== 'synced'
  );
  if (!response.nextCursor) return current;
  return current.concat(
    await loadAllRestorableProjections(
      workflowService,
      accountId,
      response.nextCursor
    )
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

const TradeImportAccountCard: React.FC<{
  account: TradeImportAccountInventoryItem;
  localAccounts: ImportAccountOption[];
  selectedLocalAccount: string;
  busy: boolean;
  isRestoring: boolean;
  onSelectLocalAccount: (accountName: string) => void;
  onCreateLocalAccount: () => void;
  onSaveMapping: () => void;
  onRestore: () => void;
}> = ({
  account,
  localAccounts,
  selectedLocalAccount,
  busy,
  isRestoring,
  onSelectLocalAccount,
  onCreateLocalAccount,
  onSaveMapping,
  onRestore,
}) => {
  const initialTarget = selectDefaultLocalAccount(account, localAccounts);
  const defaultTarget = defaultMappingTarget(account, localAccounts);
  const mappingChanged = Boolean(
    selectedLocalAccount && selectedLocalAccount !== initialTarget
  );
  const mapped =
    account.mapping?.localAccountName === selectedLocalAccount ||
    (!account.mapping &&
      selectedLocalAccount === account.displayName &&
      defaultTarget === account.displayName);
  const matchingLocalAccountExists = localAccounts.some(
    (localAccount) => localAccount.name === account.displayName
  );
  return (
    <article className="journalit-trade-import-account-card">
      <div className="journalit-trade-import-account-card__header">
        <div>
          <strong>{account.displayName}</strong>
          <span>{account.broker}</span>
        </div>
        <span className="journalit-trade-import-account-card__count">
          {t('trade-sync.import.account.restorable-count', {
            count: String(account.restorableCount),
          })}
        </span>
      </div>

      <div className="journalit-trade-import-account-card__metrics">
        <span>
          {t('trade-sync.import.account.synced-count', {
            count: String(account.syncedCount),
          })}
        </span>
        <span>
          {t('trade-sync.import.account.missing-count', {
            count: String(account.missingCount + account.localDeletedCount),
          })}
        </span>
        {(account.failedCount > 0 || account.conflictCount > 0) && (
          <span>
            {t('trade-sync.import.account.issue-count', {
              count: String(account.failedCount + account.conflictCount),
            })}
          </span>
        )}
      </div>

      <div className="journalit-trade-import-account-card__mapping">
        <label>
          <span>{t('trade-sync.import.account.local-account')}</span>
          <select
            value={selectedLocalAccount}
            onChange={(event) => onSelectLocalAccount(event.target.value)}
          >
            {localAccounts.map((localAccount) => (
              <option key={localAccount.name} value={localAccount.name}>
                {localAccount.name}
              </option>
            ))}
          </select>
        </label>
        <small>{t('trade-sync.import.account.mapping-hint')}</small>
      </div>

      <div className="journalit-trade-import-account-card__actions">
        <Button
          variant="secondary"
          disabled={busy || matchingLocalAccountExists}
          onClick={onCreateLocalAccount}
          title={t('trade-sync.import.action.create-local-account-title')}
        >
          {t('trade-sync.import.action.create-local-account')}
        </Button>
        <Button
          variant="secondary"
          disabled={busy || !selectedLocalAccount || !mappingChanged || mapped}
          onClick={onSaveMapping}
          title={t('trade-sync.import.action.save-mapping-title')}
        >
          <Save size={14} />
          {t('trade-sync.import.action.save-mapping')}
        </Button>
        <Button
          variant="primary"
          disabled={
            busy || !selectedLocalAccount || account.restorableCount === 0
          }
          onClick={onRestore}
          title={t('trade-sync.import.action.restore-account-title')}
        >
          <RotateCcw size={14} />
          {isRestoring
            ? t('trade-sync.import.action.restoring')
            : t('trade-sync.import.action.restore-account')}
        </Button>
      </div>
    </article>
  );
};

export const TradeImportSyncPanel: React.FC<TradeImportSyncPanelProps> = ({
  plugin,
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
  });

  const backendService = useMemo(() => new BackendTradeImportService(), []);
  const workflowService = useMemo(
    () => new TradeImportWorkflowService(plugin, backendService),
    [backendService, plugin]
  );
  const localAccountIdsByName = useMemo(
    () =>
      Object.fromEntries(
        state.localAccounts.map((account) => [account.name, account.id])
      ),
    [state.localAccounts]
  );
  const pendingAckCount =
    plugin.settings.backendIntegration?.pendingTradeImportProjectionAcks
      ?.length ?? 0;

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
    void getTradeImportVaultId(plugin).then((vaultId) => {
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
      await flushTradeImportProjectionAcks(plugin, backendService);
      const [localAccounts, response] = await Promise.all([
        loadAccountOptions(plugin),
        backendService.getAccountInventory(state.vaultId),
      ]);
      const selectedLocalAccounts = Object.fromEntries(
        response.accounts.map((account) => [
          account.accountId,
          state.selectedLocalAccounts[account.accountId] ||
            selectDefaultLocalAccount(account, localAccounts),
        ])
      );
      dispatchState({
        accounts: response.accounts,
        localAccounts,
        selectedLocalAccounts,
        inventoryLoaded: true,
      });
    } catch (error) {
      new Notice(
        error instanceof Error
          ? error.message
          : t('trade-sync.import.notice.load-failed')
      );
    } finally {
      dispatchState({ busy: false });
    }
  }, [backendService, plugin, state.selectedLocalAccounts, state.vaultId]);

  const persistMapping = useCallback(
    async (
      account: TradeImportAccountInventoryItem,
      localAccountName: string
    ) => {
      if (!state.vaultId || !localAccountName) return;
      const localAccountId =
        localAccountIdsByName[localAccountName] || localAccountName;
      await backendService.updateAccountVaultMapping(account.accountId, {
        vaultId: state.vaultId,
        localAccountId,
        localAccountName,
        mappingStatus: 'mapped',
      });
    },
    [backendService, localAccountIdsByName, state.vaultId]
  );

  const saveMapping = useCallback(
    async (
      account: TradeImportAccountInventoryItem,
      localAccountName: string
    ) => {
      if (!state.vaultId || !localAccountName) return;
      dispatchState({ busy: true });
      try {
        await persistMapping(account, localAccountName);
        await loadInventory();
      } catch (error) {
        new Notice(
          error instanceof Error
            ? error.message
            : t('trade-sync.import.notice.mapping-failed')
        );
      } finally {
        dispatchState({ busy: false });
      }
    },
    [loadInventory, persistMapping, state.vaultId]
  );

  const createLocalAccount = useCallback(
    async (account: TradeImportAccountInventoryItem) => {
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
        new Notice(
          error instanceof Error
            ? error.message
            : t('trade-sync.import.notice.create-account-failed')
        );
      } finally {
        dispatchState({ busy: false });
      }
    },
    [
      plugin.accountPageService,
      refreshLocalAccounts,
      loadInventory,
      persistMapping,
      state.selectedLocalAccounts,
    ]
  );

  const restoreAccount = useCallback(
    async (
      account: TradeImportAccountInventoryItem,
      localAccountName: string
    ) => {
      if (!localAccountName) return;
      dispatchState({ busy: true, restoringAccountId: account.accountId });
      try {
        await persistMapping(account, localAccountName);
        const restorableProjections = await loadAllRestorableProjections(
          workflowService,
          account.accountId
        );
        if (!restorableProjections.length) {
          await loadInventory();
          return;
        }
        const result = await workflowService.restoreProjections({
          accountName: localAccountName,
          brokerLabel: t('trade-import.restore.broker-label'),
          projections: restorableProjections,
          localWriteTimeoutMs: 30000,
        });
        if (!result.success || result.failedCount > 0) {
          new Notice(
            t('trade-import.restore.complete', {
              written: String(result.writtenCount),
              failed: String(result.failedCount),
            })
          );
        } else {
          new Notice(
            t('trade-sync.import.notice.restored', {
              count: String(result.writtenCount),
            })
          );
        }
        await loadInventory();
      } catch (error) {
        new Notice(
          error instanceof Error
            ? error.message
            : t('trade-sync.import.notice.restore-failed')
        );
      } finally {
        dispatchState({ busy: false, restoringAccountId: undefined });
      }
    },
    [loadInventory, persistMapping, workflowService]
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

  return (
    <div className="journalit-trade-import-sync-panel">
      <TradeImportSyncCards
        connectionStatus={state.connectionStatus}
        inventoryLoaded={state.inventoryLoaded}
        accountCount={state.accounts.length}
        restorableCount={totalRestorable(state.accounts)}
        syncedCount={totalSynced(state.accounts)}
        busy={state.busy}
        onRefreshConnection={() => void refreshConnection()}
        onLoadInventory={() => void loadInventory()}
        onOpenTradeImport={() => void plugin.viewManager.openCSVImportView()}
      />

      {pendingAckCount > 0 && (
        <div className="journalit-trade-import-sync-pending">
          {t('trade-sync.import.pending-acks', {
            count: String(pendingAckCount),
          })}
        </div>
      )}

      {state.inventoryLoaded && state.accounts.length === 0 && (
        <div className="journalit-trade-import-sync-placeholder">
          {t('trade-sync.import.empty-accounts')}
        </div>
      )}

      {state.inventoryLoaded && state.accounts.length > 0 && (
        <div className="journalit-trade-import-account-grid">
          {state.accounts.map((account) => {
            const selectedLocalAccount =
              state.selectedLocalAccounts[account.accountId] ||
              selectDefaultLocalAccount(account, state.localAccounts);
            return (
              <TradeImportAccountCard
                key={account.accountId}
                account={account}
                localAccounts={state.localAccounts}
                selectedLocalAccount={selectedLocalAccount}
                busy={state.busy}
                isRestoring={state.restoringAccountId === account.accountId}
                onSelectLocalAccount={(localAccountName) =>
                  setSelectedLocalAccount(account.accountId, localAccountName)
                }
                onCreateLocalAccount={() => void createLocalAccount(account)}
                onSaveMapping={() =>
                  void saveMapping(account, selectedLocalAccount)
                }
                onRestore={() =>
                  void restoreAccount(account, selectedLocalAccount)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

TradeImportSyncPanel.displayName = 'TradeImportSyncPanel';
