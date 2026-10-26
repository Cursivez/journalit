

import React from 'react';
import { Button } from '../../../../components/ui/Button';
import {
  AlertCircle,
  Download,
  RefreshCw,
  RotateCcw,
  Server,
} from '../../../../components/shared/icons/ObsidianIcon';
import { Tooltip } from '../../../../components/shared/Tooltip';
import { t } from '../../../../lang/helpers';
import type { TradeProjectionAccountInventoryItem } from '../../../../services/tradeSync/types';
import { openExternalUrl } from '../../../../utils/externalLinks';
import { formatLocalizedDateTime } from '../../../../utils/localizedDateTime';
import { isRateLimitActive } from '../../../../services/tradeSync/TradeSyncRateLimit';
import {
  BrokerAccountCard,
  BrokerLocalAccountSelect,
} from '../brokerSyncKit/BrokerAccountCard';
import {
  BrokerActionsRow,
  BrokerConnectionList,
  BrokerStatusPlaceholder,
} from '../brokerSyncKit/BrokerLayout';
import {
  BrokerConnectionStatus,
  type BrokerConnectionTone,
} from '../brokerSyncKit/BrokerConnectionStatus';
import { BrokerUnsavedMappingHint } from '../brokerSyncKit/BrokerMappingHint';
import { BrokerOverviewCard } from '../brokerSyncKit/BrokerOverviewCard';
import {
  rateLimitUiState,
  useRateLimitCountdown,
} from '../brokerSyncKit/rateLimitCooldowns';
import { type LocalAccountOption } from '../brokerSyncKit/types';
import type { AccountDraft, AccountDrafts, HistoryChoice } from './drafts';
import { oauthBrokerAccountDraftKey } from './drafts';
import type {
  ConnectionUiState,
  OAuthBrokerConnection,
  OAuthBrokerConnectionAccount,
  OAuthBrokerPanelSelection,
  OAuthBrokerSharedCopy,
  OAuthBrokerSyncPanelContentProps,
} from './types';

function isHistoryChoice(value: string): value is HistoryChoice {
  return (
    value === 'all_available' ||
    value === 'recent_90_days' ||
    value === 'custom_date' ||
    value === 'new_trades_only'
  );
}

function formatSyncTime(
  value: string | undefined,
  copy: OAuthBrokerSharedCopy
): string {
  return value ? formatLocalizedDateTime(value) : t(copy.never);
}

function formatAccountMetadata(account: OAuthBrokerConnectionAccount): string {
  const environment = account.environment.replace(/^./, (character) =>
    character.toUpperCase()
  );
  return account.currency
    ? `${environment} · ${account.currency}`
    : environment;
}

function formatConnectionStatus(
  status: string,
  copy: OAuthBrokerSharedCopy
): string {
  switch (status) {
    case 'active':
      return t('backend.status.connected');
    case 'disconnected':
      return t('backend.status.disconnected');
    case 'pending':
      return t(copy.statusConnecting);
    case 'setup_required':
      return t(copy.statusSetupRequired);
    case 'paused':
      return t(copy.statusPaused);
    case 'reauthorization_required':
      return t(copy.statusReauthorizationRequired);
    case 'deleting':
      return t(copy.statusDeleting);
    default:
      return t(copy.statusError);
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

function formatConnectionStatusTooltip(
  status: string,
  selection: OAuthBrokerPanelSelection
): string | null {
  const { copy } = selection;
  switch (status) {
    case 'reauthorization_required':
      return t(copy.websiteConnectionDescription);
    case 'paused':
      return copy.pausedWebsiteDescription
        ? t(copy.pausedWebsiteDescription)
        : null;
    case 'setup_required':
      return t(
        selection.mode === 'website'
          ? selection.copy.setupRequiredDescription
          : selection.copy.discoveryDescription
      );
    default:
      return null;
  }
}

interface OAuthBrokerAccountCardProps {
  selection: OAuthBrokerPanelSelection;
  connection: OAuthBrokerConnection;
  account: OAuthBrokerConnectionAccount;
  draft: AccountDraft;
  inventoryAccount?: TradeProjectionAccountInventoryItem;
  localAccounts: LocalAccountOption[];
  mappingUnsaved: boolean;
  busy: boolean;
  canSync: boolean;
  restoringAccountIds: Record<string, true>;
  mappingRateLimited: boolean;
  restoreRateLimited: boolean;
  mappingRateLimitMessage?: string;
  restoreRateLimitMessage?: string;
  claimOwnerDisplayName?: string;
  compact: boolean;
  createLocalAccount: OAuthBrokerSyncPanelContentProps['createLocalAccount'];
  restoreAccount: OAuthBrokerSyncPanelContentProps['restoreAccount'];
  updateDraft: OAuthBrokerSyncPanelContentProps['updateDraft'];
}

const OAuthBrokerAccountToggle: React.FC<
  Pick<
    OAuthBrokerAccountCardProps,
    'selection' | 'connection' | 'account' | 'draft' | 'updateDraft'
  > & { disabled: boolean }
> = ({ selection, connection, account, draft, disabled, updateDraft }) =>
  selection.mode === 'website' ? (
    <span className="journalit-tradovate-account-toggle">
      {t(
        account.syncEnabled
          ? selection.copy.accountSelected
          : selection.copy.accountNotSelected
      )}
    </span>
  ) : (
    <label className="journalit-tradovate-account-toggle">
      <input
        type="checkbox"
        checked={draft.syncEnabled}
        disabled={disabled}
        onChange={(event) =>
          updateDraft(connection.id, account.id, {
            syncEnabled: event.target.checked,
          })
        }
      />
      {t(selection.copy.syncAccount)}
    </label>
  );

const OAuthBrokerHistoryFields: React.FC<
  Pick<
    OAuthBrokerAccountCardProps,
    'selection' | 'connection' | 'account' | 'draft' | 'updateDraft'
  > & { disabled: boolean }
> = ({ selection, connection, account, draft, disabled, updateDraft }) => {
  if (selection.mode !== 'plugin') {
    return null;
  }

  return (
    <div className="journalit-tradovate-account-field">
      <label>
        <span>{t(selection.copy.historyLabel)}</span>
        <select
          value={draft.historyChoice}
          disabled={disabled}
          onChange={(event) => {
            if (isHistoryChoice(event.target.value)) {
              updateDraft(connection.id, account.id, {
                historyChoice: event.target.value,
              });
            }
          }}
        >
          <option value="all_available">{t(selection.copy.historyAll)}</option>
          <option value="recent_90_days">
            {t(selection.copy.historyRecent)}
          </option>
          <option value="custom_date">{t(selection.copy.historyCustom)}</option>
          <option value="new_trades_only">
            {t(selection.copy.historyNew)}
          </option>
        </select>
      </label>
      {draft.historyChoice === 'custom_date' && (
        <label>
          <span>{t(selection.copy.startDate)}</span>
          <input
            type="date"
            value={draft.historyFrom}
            disabled={disabled}
            onChange={(event) =>
              updateDraft(connection.id, account.id, {
                historyFrom: event.target.value,
              })
            }
          />
        </label>
      )}
    </div>
  );
};

const OAuthBrokerAccountRecovery: React.FC<
  Pick<
    OAuthBrokerAccountCardProps,
    | 'connection'
    | 'account'
    | 'draft'
    | 'busy'
    | 'restoringAccountIds'
    | 'mappingRateLimited'
    | 'restoreRateLimited'
    | 'restoreRateLimitMessage'
    | 'restoreAccount'
  > & {
    copy: OAuthBrokerSharedCopy;
    inventoryAccount: TradeProjectionAccountInventoryItem;
  }
> = ({
  copy,
  connection,
  account,
  draft,
  inventoryAccount,
  busy,
  restoringAccountIds,
  mappingRateLimited,
  restoreRateLimited,
  restoreRateLimitMessage,
  restoreAccount,
}) => {
  const restorableCount = inventoryAccount.restorableCount;
  if (restorableCount <= 0) {
    return null;
  }

  return (
    <div className="journalit-tradovate-account-recovery">
      <div className="journalit-tradovate-account-recovery__status">
        <span className="journalit-tradovate-account-recovery__count">
          {t(copy.recoveryCount, {
            count: String(restorableCount),
          })}
        </span>
        {!draft.localAccountId && (
          <span className="journalit-broker-account-action__hint">
            {t(copy.recoverySelectAccount)}
          </span>
        )}
      </div>
      <Button
        variant="secondary"
        size="small"
        disabled={
          busy ||
          mappingRateLimited ||
          restoreRateLimited ||
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
      {restoreRateLimitMessage && (
        <span className="journalit-broker-account-action__hint">
          {restoreRateLimitMessage}
        </span>
      )}
    </div>
  );
};

const OAuthBrokerClaimConflict: React.FC<{
  copy: OAuthBrokerSharedCopy;
  claimOwnerDisplayName: string;
}> = ({ copy, claimOwnerDisplayName }) => (
  <div className="journalit-tradovate-claim-conflict" role="status">
    <AlertCircle size={15} />
    <span>
      {t(copy.claimedByConnection, {
        connection: claimOwnerDisplayName,
      })}
    </span>
  </div>
);

function accountMappingClassName(selection: OAuthBrokerPanelSelection): string {
  return `journalit-tradovate-account-mapping${
    selection.mode === 'website'
      ? ' journalit-tradovate-account-mapping--website'
      : ''
  }`;
}

const OAuthBrokerAccountCard: React.FC<OAuthBrokerAccountCardProps> = ({
  selection,
  connection,
  account,
  draft,
  inventoryAccount,
  localAccounts,
  mappingUnsaved,
  busy,
  canSync,
  restoringAccountIds,
  mappingRateLimited,
  restoreRateLimited,
  mappingRateLimitMessage,
  restoreRateLimitMessage,
  claimOwnerDisplayName,
  compact,
  createLocalAccount,
  restoreAccount,
  updateDraft,
}) => {
  const { copy } = selection;
  const historyLocked = Boolean(account.lastSuccessfulSyncAt);
  const claimedElsewhere = Boolean(claimOwnerDisplayName);
  const localAccountFieldId = `${copy.localAccountFieldPrefix}-${connection.id}-${account.id}`;

  return (
    <BrokerAccountCard
      className={compact ? 'journalit-tradovate-account-card--single' : ''}
      title={account.displayName ?? t('backend.cards.accounts.title')}
      headerTrailing={
        <OAuthBrokerAccountToggle
          selection={selection}
          connection={connection}
          account={account}
          draft={draft}
          disabled={busy || !canSync || claimedElsewhere}
          updateDraft={updateDraft}
        />
      }
      contentClassName="journalit-tradovate-account-card__content"
    >
      <div className="journalit-tradovate-account-summary">
        <div className="journalit-tradovate-account-identity">
          <span>{formatAccountMetadata(account)}</span>
        </div>
        <span className="journalit-tradovate-account-last-sync">
          {t(copy.lastSync)}:{' '}
          {formatSyncTime(account.lastSuccessfulSyncAt, copy)}
        </span>
      </div>
      {claimOwnerDisplayName && (
        <OAuthBrokerClaimConflict
          copy={copy}
          claimOwnerDisplayName={claimOwnerDisplayName}
        />
      )}
      <div className={accountMappingClassName(selection)}>
        <OAuthBrokerHistoryFields
          selection={selection}
          connection={connection}
          account={account}
          draft={draft}
          disabled={busy || historyLocked || !canSync || claimedElsewhere}
          updateDraft={updateDraft}
        />
        <div className="journalit-tradovate-account-field journalit-tradovate-local-account-field">
          <div className="journalit-tradovate-local-account-heading">
            <label htmlFor={localAccountFieldId}>
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
            id={localAccountFieldId}
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
          {mappingRateLimitMessage && (
            <span className="journalit-broker-account-action__hint">
              {mappingRateLimitMessage}
            </span>
          )}
        </div>
      </div>
      {inventoryAccount && (
        <OAuthBrokerAccountRecovery
          copy={copy}
          connection={connection}
          account={account}
          draft={draft}
          inventoryAccount={inventoryAccount}
          busy={busy}
          restoringAccountIds={restoringAccountIds}
          mappingRateLimited={mappingRateLimited}
          restoreRateLimited={restoreRateLimited}
          restoreRateLimitMessage={restoreRateLimitMessage}
          restoreAccount={restoreAccount}
        />
      )}
    </BrokerAccountCard>
  );
};

OAuthBrokerAccountCard.displayName = 'OAuthBrokerAccountCard';

interface OAuthBrokerConnectionCardProps {
  selection: OAuthBrokerPanelSelection;
  connection: OAuthBrokerConnection;
  allConnections: OAuthBrokerConnection[];
  state: ConnectionUiState;
  drafts: AccountDrafts;
  localAccounts: LocalAccountOption[];
  inventoryAccounts: TradeProjectionAccountInventoryItem[];
  mappingDirty: Record<string, true>;
  busy: boolean;
  restoringAccountIds: Record<string, true>;
  mappingRetryAtByAccountId: Record<string, number>;
  restoreRetryAtByAccountId: Record<string, number>;
  now: number;
  syncConnection: OAuthBrokerSyncPanelContentProps['syncConnection'];
  createLocalAccount: OAuthBrokerSyncPanelContentProps['createLocalAccount'];
  restoreAccount: OAuthBrokerSyncPanelContentProps['restoreAccount'];
  updateDraft: OAuthBrokerSyncPanelContentProps['updateDraft'];
}

const OAuthBrokerConnectionStatusBadge: React.FC<{
  selection: OAuthBrokerPanelSelection;
  status: string;
}> = ({ selection, status }) => {
  const connectionStatusLabel = formatConnectionStatus(status, selection.copy);
  const connectionStatus = (
    <BrokerConnectionStatus
      tone={connectionStatusTone(status)}
      label={connectionStatusLabel}
    />
  );
  const connectionStatusTooltip = formatConnectionStatusTooltip(
    status,
    selection
  );

  if (!connectionStatusTooltip) {
    return connectionStatus;
  }

  return (
    
    
    <Tooltip
      content={connectionStatusTooltip}
      disclosureLabel={`${connectionStatusLabel}: ${connectionStatusTooltip}`}
      preferredPosition="bottom"
      delay={150}
    >
      {connectionStatus}
    </Tooltip>
  );
};

const OAuthBrokerConnectionActions: React.FC<
  Pick<
    OAuthBrokerConnectionCardProps,
    'selection' | 'connection' | 'state' | 'busy' | 'syncConnection'
  > & {
    websiteSetupRequired: boolean;
    compact: boolean;
    mappingRateLimited: boolean;
  }
> = ({
  selection,
  connection,
  state,
  busy,
  websiteSetupRequired,
  compact,
  mappingRateLimited,
  syncConnection,
}) => {
  const { copy } = selection;
  return (
    <BrokerActionsRow
      className={`journalit-tradovate-connection-actions${
        compact ? ' journalit-tradovate-connection-actions--single' : ''
      }`}
    >
      {state.requiresWebsite && (
        <Button
          variant="secondary"
          size="small"
          onClick={() => openExternalUrl(copy.integrationsUrl)}
        >
          {t(copy.manageConnection)}
        </Button>
      )}
      {selection.mode === 'plugin' &&
        state.setupRequired &&
        state.discoveryRetryAvailable && (
          <Button
            variant="secondary"
            size="small"
            disabled={busy || state.hasRunningJob}
            onClick={() => void selection.discoverAccounts(connection.id)}
          >
            <RefreshCw size={14} />
            {state.hasRunningJob
              ? t(selection.copy.discovering)
              : t(selection.copy.discoverAccounts)}
          </Button>
        )}
      {connection.accounts.length > 0 && !websiteSetupRequired && (
        <Button
          variant="primary"
          size="small"
          disabled={
            busy || mappingRateLimited || !state.canSync || state.hasRunningJob
          }
          onClick={() => void syncConnection(connection.id)}
        >
          <Download size={14} />
          {selection.mode === 'plugin' && state.setupRequired
            ? t(selection.copy.setupAndSync)
            : t(copy.syncToVault)}
        </Button>
      )}
    </BrokerActionsRow>
  );
};

const OAuthBrokerConnectionSyncMeta: React.FC<{
  copy: OAuthBrokerSharedCopy;
  connection: OAuthBrokerConnection;
}> = ({ copy, connection }) => (
  <div className="journalit-tradovate-connection-meta">
    <span>
      {t(copy.lastSync)}:{' '}
      {formatSyncTime(connection.lastSuccessfulSyncAt, copy)}
    </span>
    {connection.reconciliationIssueCount > 0 && (
      <span>
        {t(copy.reconciliationIssues, {
          count: String(connection.reconciliationIssueCount),
        })}
      </span>
    )}
  </div>
);

const OAuthBrokerConnectionCard: React.FC<OAuthBrokerConnectionCardProps> = ({
  selection,
  connection,
  allConnections,
  state,
  drafts,
  localAccounts,
  inventoryAccounts,
  mappingDirty,
  busy,
  restoringAccountIds,
  mappingRetryAtByAccountId,
  restoreRetryAtByAccountId,
  now,
  syncConnection,
  createLocalAccount,
  restoreAccount,
  updateDraft,
}) => {
  const { copy } = selection;
  
  const websiteSetupRequired =
    selection.mode === 'website' && connection.status === 'setup_required';
  const hasSingleAccount = connection.accounts.length === 1;
  const mappingRateLimitedForConnection = connection.accounts.some(
    (account) =>
      mappingDirty[account.canonicalAccountId] &&
      isRateLimitActive(
        mappingRetryAtByAccountId[account.canonicalAccountId],
        now
      )
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
        <OAuthBrokerConnectionStatusBadge
          selection={selection}
          status={connection.status}
        />
      </summary>
      <div className="journalit-tradovate-connection-body">
        {websiteSetupRequired && selection.mode === 'website' && (
          <div className="journalit-tradovate-connection-meta">
            <span>{t(selection.copy.setupRequiredDescription)}</span>
          </div>
        )}
        {connection.accounts.length === 0 &&
          !state.setupRequired &&
          !websiteSetupRequired && (
            <OAuthBrokerConnectionSyncMeta
              copy={copy}
              connection={connection}
            />
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
                drafts[oauthBrokerAccountDraftKey(connection.id, account.id)];
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
              const mappingRateLimit = rateLimitUiState(
                mappingRetryAtByAccountId[account.canonicalAccountId],
                'mapping',
                now
              );
              const restoreRateLimit = rateLimitUiState(
                restoreRetryAtByAccountId[account.canonicalAccountId],
                'restore',
                now
              );
              return (
                <OAuthBrokerAccountCard
                  key={oauthBrokerAccountDraftKey(connection.id, account.id)}
                  selection={selection}
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
                  mappingRateLimited={mappingRateLimit.limited}
                  restoreRateLimited={restoreRateLimit.limited}
                  mappingRateLimitMessage={mappingRateLimit.message}
                  restoreRateLimitMessage={restoreRateLimit.message}
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
        <OAuthBrokerConnectionActions
          selection={selection}
          connection={connection}
          state={state}
          busy={busy}
          websiteSetupRequired={websiteSetupRequired}
          compact={hasSingleAccount}
          mappingRateLimited={mappingRateLimitedForConnection}
          syncConnection={syncConnection}
        />
      </div>
    </details>
  );
};

OAuthBrokerConnectionCard.displayName = 'OAuthBrokerConnectionCard';

const OAuthBrokerOverviewActions: React.FC<
  Pick<
    OAuthBrokerSyncPanelContentProps,
    | 'canCreateConnections'
    | 'refreshing'
    | 'syncAllBusy'
    | 'syncAllAvailable'
    | 'syncAllBlockedMessage'
    | 'busyConnections'
    | 'refresh'
    | 'syncAll'
  > & {
    copy: OAuthBrokerPanelSelection['copy'];
    statusLoaded: boolean;
    hasConnections: boolean;
  }
> = ({
  copy,
  statusLoaded,
  hasConnections,
  canCreateConnections,
  refreshing,
  syncAllBusy,
  syncAllAvailable,
  syncAllBlockedMessage,
  busyConnections,
  refresh,
  syncAll,
}) => (
  <>
    {statusLoaded && !hasConnections ? (
      canCreateConnections ? (
        <Button
          variant="primary"
          size="small"
          onClick={() => openExternalUrl(copy.integrationsUrl)}
        >
          {t(copy.connect)}
        </Button>
      ) : null
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
        {t(copy.syncAll)}
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
);

const OAuthBrokerStatusNotice: React.FC<{
  copy: OAuthBrokerPanelSelection['copy'];
  statusState: OAuthBrokerSyncPanelContentProps['statusState'];
  hasConnections: boolean;
}> = ({ copy, statusState, hasConnections }) => {
  const statusLoaded = statusState.kind === 'loaded';
  const statusUnavailable = statusState.kind === 'failed';
  return (
    <>
      {!statusLoaded && (
        <BrokerStatusPlaceholder
          role={statusUnavailable ? 'alert' : 'status'}
          message={t(statusUnavailable ? copy.statusFailed : 'common.loading')}
        />
      )}

      {statusLoaded && !hasConnections && (
        <BrokerStatusPlaceholder message={t(copy.noConnections)} />
      )}
    </>
  );
};

export const OAuthBrokerSyncPanelContent: React.FC<
  OAuthBrokerSyncPanelContentProps
> = ({
  selection,
  canCreateConnections,
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
  mappingRetryAtByAccountId,
  restoreRetryAtByAccountId,
  connectionStates,
  pendingAckCount,
  refresh,
  syncConnection,
  syncAll,
  createLocalAccount,
  restoreAccount,
  updateDraft,
}) => {
  const { copy } = selection;
  const connections =
    statusState.kind === 'loaded' ? statusState.data.connections : [];
  const statusLoaded = statusState.kind === 'loaded';
  const now = useRateLimitCountdown(
    mappingRetryAtByAccountId,
    restoreRetryAtByAccountId
  );
  return (
    <section className="journalit-tradovate-sync-panel">
      <BrokerOverviewCard
        title={t(copy.sourceTitle)}
        description={t(copy.pluginSyncDescription)}
        descriptionExtra={
          pendingAckCount > 0 && (
            <span className="journalit-tradovate-sync-pending">
              {t(copy.pendingAcks, {
                count: String(pendingAckCount),
              })}
            </span>
          )
        }
        manageLink={{
          label: t(copy.setupGuide),
          onClick: () => openExternalUrl(copy.docsUrl),
        }}
        actionsHint={syncAllAvailable ? undefined : syncAllBlockedMessage}
        actions={
          <OAuthBrokerOverviewActions
            copy={copy}
            statusLoaded={statusLoaded}
            hasConnections={connections.length > 0}
            canCreateConnections={canCreateConnections}
            refreshing={refreshing}
            syncAllBusy={syncAllBusy}
            syncAllAvailable={syncAllAvailable}
            syncAllBlockedMessage={syncAllBlockedMessage}
            busyConnections={busyConnections}
            refresh={refresh}
            syncAll={syncAll}
          />
        }
        footerLink={
          statusLoaded && connections.length > 0 && canCreateConnections
            ? {
                label: t(copy.connectAnother),
                onClick: () => openExternalUrl(copy.integrationsUrl),
              }
            : undefined
        }
      />

      <OAuthBrokerStatusNotice
        copy={copy}
        statusState={statusState}
        hasConnections={connections.length > 0}
      />

      <BrokerConnectionList>
        {connections.map((connection) => (
          <OAuthBrokerConnectionCard
            key={connection.id}
            selection={selection}
            connection={connection}
            allConnections={connections}
            state={connectionStates[connection.id]}
            drafts={drafts}
            localAccounts={localAccounts}
            inventoryAccounts={inventoryAccounts}
            mappingDirty={mappingDirty}
            busy={Boolean(busyConnections[connection.id] || syncAllBusy)}
            restoringAccountIds={restoringAccountIds}
            mappingRetryAtByAccountId={mappingRetryAtByAccountId}
            restoreRetryAtByAccountId={restoreRetryAtByAccountId}
            now={now}
            syncConnection={syncConnection}
            createLocalAccount={createLocalAccount}
            restoreAccount={restoreAccount}
            updateDraft={updateDraft}
          />
        ))}
      </BrokerConnectionList>
    </section>
  );
};

OAuthBrokerSyncPanelContent.displayName = 'OAuthBrokerSyncPanelContent';
