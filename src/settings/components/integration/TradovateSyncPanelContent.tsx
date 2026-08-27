import React from 'react';
import { Button } from '../../../components/ui';
import {
  AlertCircle,
  Download,
  RefreshCw,
  RotateCcw,
  Server,
} from '../../../components/shared/icons/ObsidianIcon';
import { Tooltip } from '../../../components/shared/Tooltip';
import { t } from '../../../lang/helpers';
import type {
  TradeProjectionAccountInventoryItem,
  TradovateConnection,
  TradovateConnectionAccount,
  TradovateConnections,
} from '../../../services/tradeSync/types';
import { openExternalUrl } from '../../../utils/externalLinks';
import { formatLocalizedDateTime } from '../../../utils/localizedDateTime';
import {
  BrokerAccountCard,
  BrokerActionsRow,
  BrokerConnectionList,
  BrokerConnectionStatus,
  BrokerLocalAccountSelect,
  BrokerUnsavedMappingHint,
  BrokerOverviewCard,
  BrokerStatusPlaceholder,
  type BrokerConnectionTone,
  type BrokerStatusState,
  type LocalAccountOption,
} from './brokerSyncKit';
import type {
  AccountDraft,
  AccountDrafts,
  HistoryChoice,
} from './tradovateSyncPanelDrafts';
import { tradovateAccountDraftKey } from './tradovateSyncPanelDrafts';

const TRADOVATE_DOCS_URL = 'https://journalit.co/docs/trade-sync-tradovate';
const TRADOVATE_INTEGRATIONS_URL =
  'https://journalit.co/dashboard/integrations?provider=tradovate';

function isHistoryChoice(value: string): value is HistoryChoice {
  return (
    value === 'all_available' ||
    value === 'recent_90_days' ||
    value === 'custom_date' ||
    value === 'new_trades_only'
  );
}

function formatSyncTime(value?: string): string {
  return value
    ? formatLocalizedDateTime(value)
    : t('trade-sync.tradovate.never');
}

function formatAccountMetadata(account: TradovateConnectionAccount): string {
  const environment = account.environment.replace(/^./, (character) =>
    character.toUpperCase()
  );
  return account.currency
    ? `${environment} · ${account.currency}`
    : environment;
}

function formatConnectionStatus(status: string): string {
  switch (status) {
    case 'active':
      return t('backend.status.connected');
    case 'disconnected':
      return t('backend.status.disconnected');
    case 'pending':
      return t('trade-sync.tradovate.status.connecting');
    case 'setup_required':
      return t('trade-sync.tradovate.status.setup-required');
    case 'paused':
      return t('trade-sync.tradovate.status.paused');
    case 'reauthorization_required':
      return t('trade-sync.tradovate.status.reauthorization-required');
    case 'deleting':
      return t('trade-sync.tradovate.status.deleting');
    default:
      return t('trade-sync.tradovate.status.error');
  }
}

function connectionStatusTone(status: string): BrokerConnectionTone {
  if (status === 'active' || status === 'setup_required') return 'success';
  if (
    status === 'disconnected' ||
    status === 'reauthorization_required' ||
    status === 'error'
  ) {
    return 'error';
  }
  return 'pending';
}

interface ConnectionUiState {
  canSync: boolean;
  requiresWebsite: boolean;
  setupRequired: boolean;
  discoveryRetryAvailable: boolean;
  hasRunningJob: boolean;
}

export type TradovateStatusState = BrokerStatusState<TradovateConnections>;

export interface TradovateSyncPanelContentProps {
  statusState: TradovateStatusState;
  drafts: AccountDrafts;
  localAccounts: LocalAccountOption[];
  inventoryAccounts: TradeProjectionAccountInventoryItem[];
  busyConnections: Record<string, true>;
  refreshing: boolean;
  syncAllBusy: boolean;
  syncAllAvailable: boolean;
  
  syncAllBlockedMessage?: string;
  
  mappingDirty: Record<string, true>;
  restoringAccountIds: Record<string, true>;
  connectionStates: Record<string, ConnectionUiState>;
  pendingAckCount: number;
  refresh: (options?: { background?: boolean }) => Promise<boolean | void>;
  syncConnection: (connectionId: string) => Promise<void>;
  syncAll: () => Promise<void>;
  discoverAccounts: (connectionId: string) => Promise<void>;
  createLocalAccount: (
    connectionId: string,
    account: TradovateConnectionAccount
  ) => Promise<void>;
  restoreAccount: (
    connectionId: string,
    account: TradovateConnectionAccount,
    inventoryAccount: TradeProjectionAccountInventoryItem
  ) => Promise<void>;
  updateDraft: (
    connectionId: string,
    accountId: string,
    patch: Partial<AccountDraft>,
    mapping?: boolean
  ) => void;
}

interface TradovateAccountCardProps {
  connection: TradovateConnection;
  account: TradovateConnectionAccount;
  draft: AccountDraft;
  inventoryAccount?: TradeProjectionAccountInventoryItem;
  localAccounts: LocalAccountOption[];
  mappingUnsaved: boolean;
  busy: boolean;
  canSync: boolean;
  restoringAccountIds: Record<string, true>;
  claimOwnerDisplayName?: string;
  compact: boolean;
  createLocalAccount: TradovateSyncPanelContentProps['createLocalAccount'];
  restoreAccount: TradovateSyncPanelContentProps['restoreAccount'];
  updateDraft: TradovateSyncPanelContentProps['updateDraft'];
}

const TradovateAccountCard: React.FC<TradovateAccountCardProps> = ({
  connection,
  account,
  draft,
  inventoryAccount,
  localAccounts,
  mappingUnsaved,
  busy,
  canSync,
  restoringAccountIds,
  claimOwnerDisplayName,
  compact,
  createLocalAccount,
  restoreAccount,
  updateDraft,
}) => {
  const historyLocked = Boolean(account.lastSuccessfulSyncAt);
  const restorableCount = inventoryAccount?.restorableCount ?? 0;
  const claimedElsewhere = Boolean(claimOwnerDisplayName);

  return (
    <BrokerAccountCard
      className={compact ? 'journalit-tradovate-account-card--single' : ''}
      title={account.displayName ?? t('backend.cards.accounts.title')}
      headerTrailing={
        <label className="journalit-tradovate-account-toggle">
          <input
            type="checkbox"
            checked={draft.syncEnabled}
            disabled={busy || !canSync || claimedElsewhere}
            onChange={(event) =>
              updateDraft(connection.id, account.id, {
                syncEnabled: event.target.checked,
              })
            }
          />
          {t('trade-sync.tradovate.sync-account')}
        </label>
      }
      contentClassName="journalit-tradovate-account-card__content"
    >
      <div className="journalit-tradovate-account-summary">
        <div className="journalit-tradovate-account-identity">
          <span>{formatAccountMetadata(account)}</span>
        </div>
        <span className="journalit-tradovate-account-last-sync">
          {t('trade-sync.tradovate.last-sync')}:{' '}
          {formatSyncTime(account.lastSuccessfulSyncAt)}
        </span>
      </div>
      {claimOwnerDisplayName && (
        <div className="journalit-tradovate-claim-conflict" role="status">
          <AlertCircle size={15} />
          <span>
            {t('trade-sync.tradovate.claimed-by-connection', {
              connection: claimOwnerDisplayName,
            })}
          </span>
        </div>
      )}
      <div className="journalit-tradovate-account-mapping">
        <div className="journalit-tradovate-account-field">
          <label>
            <span>{t('trade-sync.tradovate.history-label')}</span>
            <select
              value={draft.historyChoice}
              disabled={busy || historyLocked || !canSync || claimedElsewhere}
              onChange={(event) => {
                if (isHistoryChoice(event.target.value)) {
                  updateDraft(connection.id, account.id, {
                    historyChoice: event.target.value,
                  });
                }
              }}
            >
              <option value="all_available">
                {t('trade-sync.tradovate.history-all')}
              </option>
              <option value="recent_90_days">
                {t('trade-sync.tradovate.history-recent')}
              </option>
              <option value="custom_date">
                {t('trade-sync.tradovate.history-custom')}
              </option>
              <option value="new_trades_only">
                {t('trade-sync.tradovate.history-new')}
              </option>
            </select>
          </label>
          {draft.historyChoice === 'custom_date' && (
            <label>
              <span>{t('trade-sync.tradovate.start-date')}</span>
              <input
                type="date"
                value={draft.historyFrom}
                disabled={busy || historyLocked || !canSync || claimedElsewhere}
                onChange={(event) =>
                  updateDraft(connection.id, account.id, {
                    historyFrom: event.target.value,
                  })
                }
              />
            </label>
          )}
        </div>
        <div className="journalit-tradovate-account-field journalit-tradovate-local-account-field">
          <div className="journalit-tradovate-local-account-heading">
            <label
              htmlFor={`tradovate-local-account-${connection.id}-${account.id}`}
            >
              {t('trade-sync.import.account.local-account')}
            </label>
            <button
              type="button"
              className="journalit-tradovate-create-local"
              disabled={
                busy ||
                !canSync ||
                localAccounts.some(
                  (localAccount) => localAccount.name === account.displayName
                )
              }
              onClick={() => void createLocalAccount(connection.id, account)}
            >
              {t('trade-sync.import.action.create-local-account')}
            </button>
          </div>
          <BrokerLocalAccountSelect
            id={`tradovate-local-account-${connection.id}-${account.id}`}
            value={draft.localAccountId}
            disabled={busy || !canSync}
            localAccounts={localAccounts}
            onChange={(value) =>
              updateDraft(
                connection.id,
                account.id,
                { localAccountId: value },
                true
              )
            }
          />
          {mappingUnsaved && <BrokerUnsavedMappingHint />}
        </div>
      </div>
      {inventoryAccount && restorableCount > 0 && (
        <div className="journalit-tradovate-account-recovery">
          <div className="journalit-tradovate-account-recovery__status">
            <span className="journalit-tradovate-account-recovery__count">
              {t('trade-sync.tradovate.recovery-count', {
                count: String(restorableCount),
              })}
            </span>
            {!draft.localAccountId && (
              <span className="journalit-tradovate-account-recovery__hint">
                {t('trade-sync.tradovate.recovery-select-account')}
              </span>
            )}
          </div>
          <Button
            variant="secondary"
            size="small"
            disabled={
              busy ||
              !draft.localAccountId ||
              Boolean(restoringAccountIds[inventoryAccount.accountId])
            }
            onClick={() =>
              void restoreAccount(connection.id, account, inventoryAccount)
            }
          >
            <RotateCcw size={14} />
            {restoringAccountIds[inventoryAccount.accountId]
              ? t('trade-sync.import.action.restoring')
              : t('trade-sync.import.action.restore-account')}
          </Button>
        </div>
      )}
    </BrokerAccountCard>
  );
};

TradovateAccountCard.displayName = 'TradovateAccountCard';

interface TradovateConnectionCardProps {
  connection: TradovateConnection;
  allConnections: TradovateConnection[];
  state: ConnectionUiState;
  drafts: AccountDrafts;
  localAccounts: LocalAccountOption[];
  inventoryAccounts: TradeProjectionAccountInventoryItem[];
  mappingDirty: Record<string, true>;
  busy: boolean;
  restoringAccountIds: Record<string, true>;
  syncConnection: TradovateSyncPanelContentProps['syncConnection'];
  discoverAccounts: TradovateSyncPanelContentProps['discoverAccounts'];
  createLocalAccount: TradovateSyncPanelContentProps['createLocalAccount'];
  restoreAccount: TradovateSyncPanelContentProps['restoreAccount'];
  updateDraft: TradovateSyncPanelContentProps['updateDraft'];
}

const TradovateConnectionCard: React.FC<TradovateConnectionCardProps> = ({
  connection,
  allConnections,
  state,
  drafts,
  localAccounts,
  inventoryAccounts,
  mappingDirty,
  busy,
  restoringAccountIds,
  syncConnection,
  discoverAccounts,
  createLocalAccount,
  restoreAccount,
  updateDraft,
}) => {
  const hasSingleAccount = connection.accounts.length === 1;
  const connectionStatus = (
    <BrokerConnectionStatus
      tone={connectionStatusTone(connection.status)}
      label={formatConnectionStatus(connection.status)}
    />
  );
  const connectionStatusTooltip =
    connection.status === 'reauthorization_required'
      ? t('trade-sync.tradovate.website-connection-description')
      : connection.status === 'setup_required'
        ? t('trade-sync.tradovate.discovery-description')
        : null;
  const actions = (
    <BrokerActionsRow
      className={`journalit-tradovate-connection-actions${
        hasSingleAccount
          ? ' journalit-tradovate-connection-actions--single'
          : ''
      }`}
    >
      {state.requiresWebsite && (
        <Button
          variant="secondary"
          size="small"
          onClick={() => openExternalUrl(TRADOVATE_INTEGRATIONS_URL)}
        >
          {t('trade-sync.tradovate.manage-connection')}
        </Button>
      )}
      {state.setupRequired && state.discoveryRetryAvailable && (
        <Button
          variant="secondary"
          size="small"
          disabled={busy || state.hasRunningJob}
          onClick={() => void discoverAccounts(connection.id)}
        >
          <RefreshCw size={14} />
          {state.hasRunningJob
            ? t('trade-sync.tradovate.discovering')
            : t('trade-sync.tradovate.discover-accounts')}
        </Button>
      )}
      {connection.accounts.length > 0 && (
        <Button
          variant="primary"
          size="small"
          disabled={busy || !state.canSync || state.hasRunningJob}
          onClick={() => void syncConnection(connection.id)}
        >
          <Download size={14} />
          {state.setupRequired
            ? t('trade-sync.tradovate.setup-and-sync')
            : t('trade-sync.tradovate.sync-to-vault')}
        </Button>
      )}
    </BrokerActionsRow>
  );

  return (
    <details
      className={`journalit-tradovate-connection-card${
        hasSingleAccount ? ' journalit-tradovate-connection-card--single' : ''
      }`}
      open
    >
      <summary className="journalit-tradovate-connection-summary">
        <span className="journalit-broker-card-header__title">
          <Server size={20} />
          <strong>{connection.displayName}</strong>
        </span>
        {connectionStatusTooltip ? (
          <Tooltip
            content={connectionStatusTooltip}
            preferredPosition="bottom"
            delay={150}
          >
            {connectionStatus}
          </Tooltip>
        ) : (
          connectionStatus
        )}
      </summary>
      <div className="journalit-tradovate-connection-body">
        {connection.accounts.length === 0 && !state.setupRequired && (
          <div className="journalit-tradovate-connection-meta">
            <span>
              {t('trade-sync.tradovate.last-sync')}:{' '}
              {formatSyncTime(connection.lastSuccessfulSyncAt)}
            </span>
            {connection.reconciliationIssueCount > 0 && (
              <span>
                {t('trade-sync.tradovate.reconciliation-issues', {
                  count: String(connection.reconciliationIssueCount),
                })}
              </span>
            )}
          </div>
        )}
        {connection.accounts.length > 0 && (
          <div
            className={`journalit-trade-import-account-grid journalit-tradovate-connection-accounts${
              hasSingleAccount
                ? ' journalit-tradovate-connection-accounts--single'
                : ''
            }`}
          >
            {connection.accounts.map((account) => {
              const draft =
                drafts[tradovateAccountDraftKey(connection.id, account.id)];
              if (!draft) return null;
              const inventoryAccount = inventoryAccounts.find(
                (item) => item.accountId === account.canonicalAccountId
              );
              const claimedConnectionId =
                account.syncClaim.state === 'held_elsewhere'
                  ? account.syncClaim.holderConnectionId
                  : undefined;
              const claimOwner =
                claimedConnectionId && claimedConnectionId !== connection.id
                  ? allConnections.find(
                      (candidate) => candidate.id === claimedConnectionId
                    )?.displayName
                  : undefined;
              return (
                <TradovateAccountCard
                  key={tradovateAccountDraftKey(connection.id, account.id)}
                  connection={connection}
                  account={account}
                  draft={draft}
                  inventoryAccount={inventoryAccount}
                  localAccounts={localAccounts}
                  mappingUnsaved={Boolean(
                    mappingDirty[account.canonicalAccountId]
                  )}
                  busy={busy}
                  canSync={state.canSync}
                  restoringAccountIds={restoringAccountIds}
                  claimOwnerDisplayName={claimOwner}
                  compact={hasSingleAccount}
                  createLocalAccount={createLocalAccount}
                  restoreAccount={restoreAccount}
                  updateDraft={updateDraft}
                />
              );
            })}
          </div>
        )}
        {actions}
      </div>
    </details>
  );
};

TradovateConnectionCard.displayName = 'TradovateConnectionCard';

export const TradovateSyncPanelContent: React.FC<
  TradovateSyncPanelContentProps
> = ({
  statusState,
  drafts,
  localAccounts,
  inventoryAccounts,
  busyConnections,
  refreshing,
  syncAllBusy,
  syncAllAvailable,
  syncAllBlockedMessage,
  mappingDirty,
  restoringAccountIds,
  connectionStates,
  pendingAckCount,
  refresh,
  syncConnection,
  syncAll,
  discoverAccounts,
  createLocalAccount,
  restoreAccount,
  updateDraft,
}) => {
  const connections =
    statusState.kind === 'loaded' ? statusState.data.connections : [];
  const statusLoaded = statusState.kind === 'loaded';
  const statusUnavailable = statusState.kind === 'failed';
  return (
    <section className="journalit-tradovate-sync-panel">
      <BrokerOverviewCard
        title={t('trade-sync.source.tradovate')}
        description={t('trade-sync.tradovate.plugin-sync-description')}
        descriptionExtra={
          pendingAckCount > 0 && (
            <span className="journalit-tradovate-sync-pending">
              {t('trade-sync.tradovate.pending-acks', {
                count: String(pendingAckCount),
              })}
            </span>
          )
        }
        manageLink={{
          label: t('trade-sync.tradovate.setup-guide'),
          onClick: () => openExternalUrl(TRADOVATE_DOCS_URL),
        }}
        actionsHint={syncAllAvailable ? undefined : syncAllBlockedMessage}
        actions={
          <>
            {statusLoaded && connections.length === 0 ? (
              <Button
                variant="primary"
                size="small"
                onClick={() => openExternalUrl(TRADOVATE_INTEGRATIONS_URL)}
              >
                {t('trade-sync.tradovate.connect')}
              </Button>
            ) : statusLoaded ? (
              <Button
                variant="primary"
                size="small"
                disabled={
                  refreshing ||
                  syncAllBusy ||
                  !syncAllAvailable ||
                  Object.keys(busyConnections).length > 0
                }
                title={syncAllAvailable ? undefined : syncAllBlockedMessage}
                onClick={() => void syncAll()}
              >
                <Download size={14} />
                {t('trade-sync.tradovate.sync-all')}
              </Button>
            ) : null}
            <Button
              variant="secondary"
              size="small"
              disabled={refreshing || syncAllBusy}
              onClick={() => void refresh()}
            >
              <RefreshCw size={14} />
              {t('backend.cards.connection.refresh')}
            </Button>
          </>
        }
        footerLink={
          statusLoaded && connections.length > 0
            ? {
                label: t('trade-sync.tradovate.connect-another'),
                onClick: () => openExternalUrl(TRADOVATE_INTEGRATIONS_URL),
              }
            : undefined
        }
      />

      {!statusLoaded && (
        <BrokerStatusPlaceholder
          role={statusUnavailable ? 'alert' : 'status'}
          message={t(
            statusUnavailable
              ? 'trade-sync.tradovate.status-failed'
              : 'common.loading'
          )}
        />
      )}

      {statusLoaded && connections.length === 0 && (
        <BrokerStatusPlaceholder
          message={t('trade-sync.tradovate.no-connections')}
        />
      )}

      <BrokerConnectionList>
        {connections.map((connection) => (
          <TradovateConnectionCard
            key={connection.id}
            connection={connection}
            allConnections={connections}
            state={connectionStates[connection.id]}
            drafts={drafts}
            localAccounts={localAccounts}
            inventoryAccounts={inventoryAccounts}
            mappingDirty={mappingDirty}
            busy={Boolean(busyConnections[connection.id] || syncAllBusy)}
            restoringAccountIds={restoringAccountIds}
            syncConnection={syncConnection}
            discoverAccounts={discoverAccounts}
            createLocalAccount={createLocalAccount}
            restoreAccount={restoreAccount}
            updateDraft={updateDraft}
          />
        ))}
      </BrokerConnectionList>
    </section>
  );
};
