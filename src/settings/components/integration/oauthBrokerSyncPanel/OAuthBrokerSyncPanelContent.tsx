

import React from 'react';
import { Button } from '../../../../components/ui';
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
  BrokerActionsRow,
  BrokerConnectionList,
  BrokerConnectionStatus,
  BrokerLocalAccountSelect,
  BrokerUnsavedMappingHint,
  BrokerOverviewCard,
  BrokerStatusPlaceholder,
  rateLimitUiState,
  useRateLimitCountdown,
  type BrokerConnectionTone,
  type LocalAccountOption,
} from '../brokerSyncKit';
import type { AccountDraft, AccountDrafts, HistoryChoice } from './drafts';
import { oauthBrokerAccountDraftKey } from './drafts';
import type {
  ConnectionUiState,
  OAuthBrokerConnection,
  OAuthBrokerConnectionAccount,
  OAuthBrokerSyncCopy,
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
  copy: OAuthBrokerSyncCopy
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
  copy: OAuthBrokerSyncCopy
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
  copy: OAuthBrokerSyncCopy
): string | null {
  switch (status) {
    case 'reauthorization_required':
      return t(copy.websiteConnectionDescription);
    case 'paused':
      return copy.pausedWebsiteDescription
        ? t(copy.pausedWebsiteDescription)
        : null;
    case 'setup_required':
      return t(copy.discoveryDescription);
    default:
      return null;
  }
}

interface OAuthBrokerAccountCardProps {
  copy: OAuthBrokerSyncCopy;
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

const OAuthBrokerAccountCard: React.FC<OAuthBrokerAccountCardProps> = ({
  copy,
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
  const historyLocked = Boolean(account.lastSuccessfulSyncAt);
  const restorableCount = inventoryAccount?.restorableCount ?? 0;
  const claimedElsewhere = Boolean(claimOwnerDisplayName);
  const localAccountFieldId = `${copy.localAccountFieldPrefix}-${connection.id}-${account.id}`;

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
          {t(copy.syncAccount)}
        </label>
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
        <div className="journalit-tradovate-claim-conflict" role="status">
          <AlertCircle size={15} />
          <span>
            {t(copy.claimedByConnection, {
              connection: claimOwnerDisplayName,
            })}
          </span>
        </div>
      )}
      <div className="journalit-tradovate-account-mapping">
        <div className="journalit-tradovate-account-field">
          <label>
            <span>{t(copy.historyLabel)}</span>
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
              <option value="all_available">{t(copy.historyAll)}</option>
              <option value="recent_90_days">{t(copy.historyRecent)}</option>
              <option value="custom_date">{t(copy.historyCustom)}</option>
              <option value="new_trades_only">{t(copy.historyNew)}</option>
            </select>
          </label>
          {draft.historyChoice === 'custom_date' && (
            <label>
              <span>{t(copy.startDate)}</span>
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
      {inventoryAccount && restorableCount > 0 && (
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
      )}
    </BrokerAccountCard>
  );
};

OAuthBrokerAccountCard.displayName = 'OAuthBrokerAccountCard';

interface OAuthBrokerConnectionCardProps {
  copy: OAuthBrokerSyncCopy;
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
  discoverAccounts: OAuthBrokerSyncPanelContentProps['discoverAccounts'];
  createLocalAccount: OAuthBrokerSyncPanelContentProps['createLocalAccount'];
  restoreAccount: OAuthBrokerSyncPanelContentProps['restoreAccount'];
  updateDraft: OAuthBrokerSyncPanelContentProps['updateDraft'];
}

const OAuthBrokerConnectionCard: React.FC<OAuthBrokerConnectionCardProps> = ({
  copy,
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
  discoverAccounts,
  createLocalAccount,
  restoreAccount,
  updateDraft,
}) => {
  const hasSingleAccount = connection.accounts.length === 1;
  const connectionStatusLabel = formatConnectionStatus(connection.status, copy);
  const connectionStatus = (
    <BrokerConnectionStatus
      tone={connectionStatusTone(connection.status)}
      label={connectionStatusLabel}
    />
  );
  const connectionStatusTooltip = formatConnectionStatusTooltip(
    connection.status,
    copy
  );
  const mappingRateLimitedForConnection = connection.accounts.some(
    (account) =>
      mappingDirty[account.canonicalAccountId] &&
      isRateLimitActive(
        mappingRetryAtByAccountId[account.canonicalAccountId],
        now
      )
  );
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
          onClick={() => openExternalUrl(copy.integrationsUrl)}
        >
          {t(copy.manageConnection)}
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
          {state.hasRunningJob ? t(copy.discovering) : t(copy.discoverAccounts)}
        </Button>
      )}
      {connection.accounts.length > 0 && (
        <Button
          variant="primary"
          size="small"
          disabled={
            busy ||
            mappingRateLimitedForConnection ||
            !state.canSync ||
            state.hasRunningJob
          }
          onClick={() => void syncConnection(connection.id)}
        >
          <Download size={14} />
          {state.setupRequired ? t(copy.setupAndSync) : t(copy.syncToVault)}
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
            disclosureLabel={`${connectionStatusLabel}: ${connectionStatusTooltip}`}
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
                  copy={copy}
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
        {actions}
      </div>
    </details>
  );
};

OAuthBrokerConnectionCard.displayName = 'OAuthBrokerConnectionCard';

export const OAuthBrokerSyncPanelContent: React.FC<
  OAuthBrokerSyncPanelContentProps
> = ({
  copy,
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
  discoverAccounts,
  createLocalAccount,
  restoreAccount,
  updateDraft,
}) => {
  const connections =
    statusState.kind === 'loaded' ? statusState.data.connections : [];
  const statusLoaded = statusState.kind === 'loaded';
  const statusUnavailable = statusState.kind === 'failed';
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
          <>
            {statusLoaded && connections.length === 0 ? (
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

      {!statusLoaded && (
        <BrokerStatusPlaceholder
          role={statusUnavailable ? 'alert' : 'status'}
          message={t(statusUnavailable ? copy.statusFailed : 'common.loading')}
        />
      )}

      {statusLoaded && connections.length === 0 && (
        <BrokerStatusPlaceholder message={t(copy.noConnections)} />
      )}

      <BrokerConnectionList>
        {connections.map((connection) => (
          <OAuthBrokerConnectionCard
            key={connection.id}
            copy={copy}
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

OAuthBrokerSyncPanelContent.displayName = 'OAuthBrokerSyncPanelContent';
