

import React from 'react';
import { Button } from '../../../components/ui';
import {
  AlertCircle,
  Download,
  RefreshCw,
  Server,
} from '../../../components/shared/icons/ObsidianIcon';
import { t } from '../../../lang/helpers';
import type {
  BrokerSyncJob,
  RithmicConnection,
  RithmicConnectionAccount,
  RithmicConnections,
} from '../../../services/tradeSync/types';
import { isBrokerSyncJobInProgress } from '../../../services/tradeSync/types';
import { isRateLimitActive } from '../../../services/tradeSync/TradeSyncRateLimit';
import { openExternalUrl } from '../../../utils/externalLinks';
import { formatLocalizedDateTime } from '../../../utils/localizedDateTime';
import {
  BrokerAccountCard,
  BrokerActionsRow,
  BrokerConnectionList,
  BrokerConnectionStatus,
  BrokerLocalAccountSelect,
  BrokerOverviewCard,
  BrokerStatusPlaceholder,
  BrokerUnsavedMappingHint,
  rateLimitUiState,
  useRateLimitCountdown,
  type BrokerConnectionTone,
  type BrokerStatusState,
  type LocalAccountOption,
} from './brokerSyncKit';
import { RithmicAttribution } from './RithmicAttribution';
import {
  isRithmicRetryingErrorCode,
  rithmicSyncErrorMessage,
} from './rithmicSyncErrors';

const RITHMIC_INTEGRATIONS_URL =
  'https://journalit.co/dashboard/integrations?provider=rithmic';

function formatSyncTime(value?: string): string {
  return value ? formatLocalizedDateTime(value) : t('trade-sync.rithmic.never');
}

function formatConnectionStatus(status: string): string {
  switch (status) {
    case 'active':
      return t('backend.status.connected');
    case 'disconnected':
      return t('backend.status.disconnected');
    case 'pending':
      return t('trade-sync.rithmic.status.connecting');
    case 'paused':
      return t('trade-sync.rithmic.status.paused');
    case 'setup_required':
      return t('trade-sync.rithmic.status.waiting-for-accounts');
    case 'reauthorization_required':
      return t('trade-sync.rithmic.status.reauthorization-required');
    default:
      return t('trade-sync.rithmic.status.error');
  }
}

function connectionStatusTone(status: string): BrokerConnectionTone {
  if (status === 'active') return 'success';
  if (status === 'pending' || status === 'setup_required') return 'pending';
  return 'error';
}

function formatJobStatus(status: string): string {
  switch (status) {
    case 'queued':
      return t('trade-sync.job.status.queued');
    case 'running':
      return t('trade-sync.job.status.running');
    case 'succeeded':
      return t('trade-sync.job.status.succeeded');
    case 'partial':
      return t('trade-sync.job.status.partial');
    case 'failed':
      return t('trade-sync.job.status.failed');
    case 'cancelled':
      return t('trade-sync.job.status.cancelled');
    default:
      return t('trade-sync.job.status.unknown');
  }
}

interface ConnectionUiState {
  canSync: boolean;
  requiresWebsite: boolean;
  hasRunningJob: boolean;
  latestJob?: BrokerSyncJob;
}

export type RithmicStatusState = BrokerStatusState<RithmicConnections>;

export interface RithmicSyncPanelContentProps {
  statusState: RithmicStatusState;
  localAccounts: LocalAccountOption[];
  accountMappings: Record<string, string>;
  
  mappingDirty: Record<string, true>;
  mappingRetryAtByAccountId: Record<string, number>;
  busyConnections: Record<string, true>;
  refreshing: boolean;
  syncAllBusy: boolean;
  syncAllAvailable: boolean;
  
  syncAllBlockedMessage?: string;
  connectionStates: Record<string, ConnectionUiState>;
  refresh: (options?: { background?: boolean }) => Promise<boolean | void>;
  syncConnection: (connectionId: string) => Promise<void>;
  syncAll: () => Promise<void>;
  updateMapping: (canonicalAccountId: string, localAccountId: string) => void;
}

interface RithmicAccountRowProps {
  connectionId: string;
  account: RithmicConnectionAccount;
  localAccounts: LocalAccountOption[];
  localAccountId: string;
  mappingUnsaved: boolean;
  mappingRateLimitMessage?: string;
  busy: boolean;
  canSync: boolean;
  updateMapping: RithmicSyncPanelContentProps['updateMapping'];
}

const RithmicAccountRow: React.FC<RithmicAccountRowProps> = ({
  connectionId,
  account,
  localAccounts,
  localAccountId,
  mappingUnsaved,
  mappingRateLimitMessage,
  busy,
  canSync,
  updateMapping,
}) => (
  <BrokerAccountCard
    title={account.displayName ?? account.canonicalAccountId}
    headerTrailing={
      <span className="journalit-rithmic-account-state">
        {account.syncEnabled ? t('common.enabled') : t('common.disabled')}
      </span>
    }
  >
    <div className="journalit-rithmic-account-summary">
      {account.currency && <span>{account.currency}</span>}
      <span>
        {t('trade-sync.rithmic.last-sync')}:{' '}
        {formatSyncTime(account.lastSuccessfulSyncAt)}
      </span>
    </div>
    <div className="journalit-rithmic-account-field">
      <label htmlFor={`rithmic-local-account-${connectionId}-${account.id}`}>
        {t('trade-sync.import.account.local-account')}
      </label>
      <BrokerLocalAccountSelect
        id={`rithmic-local-account-${connectionId}-${account.id}`}
        value={localAccountId}
        disabled={busy || !canSync}
        localAccounts={localAccounts}
        onChange={(value) => updateMapping(account.canonicalAccountId, value)}
      />
      {mappingUnsaved && <BrokerUnsavedMappingHint />}
      {mappingRateLimitMessage && (
        <span className="journalit-broker-account-action__hint">
          {mappingRateLimitMessage}
        </span>
      )}
    </div>
  </BrokerAccountCard>
);

RithmicAccountRow.displayName = 'RithmicAccountRow';

interface RithmicConnectionCardProps {
  connection: RithmicConnection;
  state: ConnectionUiState;
  localAccounts: LocalAccountOption[];
  accountMappings: Record<string, string>;
  mappingDirty: Record<string, true>;
  mappingRetryAtByAccountId: Record<string, number>;
  now: number;
  busy: boolean;
  syncConnection: RithmicSyncPanelContentProps['syncConnection'];
  updateMapping: RithmicSyncPanelContentProps['updateMapping'];
}

const RithmicConnectionCard: React.FC<RithmicConnectionCardProps> = ({
  connection,
  state,
  localAccounts,
  accountMappings,
  mappingDirty,
  mappingRetryAtByAccountId,
  now,
  busy,
  syncConnection,
  updateMapping,
}) => {
  const latestJob = state.latestJob;
  const jobErrorCode = latestJob?.errorCode ?? connection.lastErrorCode;
  const showJobError = Boolean(
    jobErrorCode &&
    (latestJob?.status === 'failed' ||
      latestJob?.status === 'partial' ||
      latestJob === undefined)
  );
  const mappingRateLimited = connection.accounts.some(
    (account) =>
      mappingDirty[account.canonicalAccountId] &&
      isRateLimitActive(
        mappingRetryAtByAccountId[account.canonicalAccountId],
        now
      )
  );

  return (
    <section className="journalit-rithmic-connection-card">
      <div className="journalit-rithmic-connection-summary">
        <span className="journalit-broker-card-header__title">
          <Server size={20} />
          <strong>{connection.displayName}</strong>
        </span>
        <BrokerConnectionStatus
          tone={connectionStatusTone(connection.status)}
          label={formatConnectionStatus(connection.status)}
        />
      </div>
      <div className="journalit-rithmic-connection-meta">
        <span>
          {t('trade-sync.rithmic.system')}: {connection.systemName}
        </span>
        <span>
          {t('trade-sync.rithmic.accounts')}: {connection.accounts.length}
        </span>
        <span>
          {t('trade-sync.rithmic.last-sync')}:{' '}
          {formatSyncTime(connection.lastSuccessfulSyncAt)}
        </span>
        {latestJob && (
          <span className="journalit-rithmic-connection-job">
            {isBrokerSyncJobInProgress(latestJob.status)
              ? t('trade-sync.rithmic.job.running')
              : t('trade-sync.rithmic.job.last', {
                  status: formatJobStatus(latestJob.status),
                })}
          </span>
        )}
      </div>
      {showJobError && (
        <div className="journalit-rithmic-connection-error" role="status">
          <AlertCircle size={15} />
          <span>
            {rithmicSyncErrorMessage(jobErrorCode)}
            {isRithmicRetryingErrorCode(jobErrorCode)
              ? ` ${t('trade-sync.rithmic.error.auto-retry')}`
              : ''}
          </span>
        </div>
      )}
      {connection.accounts.length > 0 && (
        <div className="journalit-rithmic-connection-accounts">
          {connection.accounts.map((account) => {
            const mappingRateLimit = rateLimitUiState(
              mappingRetryAtByAccountId[account.canonicalAccountId],
              'mapping',
              now
            );
            return (
              <RithmicAccountRow
                key={account.id}
                connectionId={connection.id}
                account={account}
                localAccounts={localAccounts}
                localAccountId={
                  accountMappings[account.canonicalAccountId] ?? ''
                }
                mappingUnsaved={Boolean(
                  mappingDirty[account.canonicalAccountId]
                )}
                mappingRateLimitMessage={mappingRateLimit.message}
                busy={busy}
                canSync={state.canSync}
                updateMapping={updateMapping}
              />
            );
          })}
        </div>
      )}
      <BrokerActionsRow>
        {state.requiresWebsite && (
          <Button
            variant="secondary"
            size="small"
            onClick={() => openExternalUrl(RITHMIC_INTEGRATIONS_URL)}
          >
            {t('trade-sync.rithmic.manage')}
          </Button>
        )}
        <Button
          variant="primary"
          size="small"
          disabled={
            busy || mappingRateLimited || !state.canSync || state.hasRunningJob
          }
          onClick={() => void syncConnection(connection.id)}
        >
          <Download size={14} />
          {state.hasRunningJob
            ? t('trade-sync.rithmic.syncing')
            : t('trade-sync.rithmic.sync-to-vault')}
        </Button>
      </BrokerActionsRow>
    </section>
  );
};

RithmicConnectionCard.displayName = 'RithmicConnectionCard';

export const RithmicSyncPanelContent: React.FC<
  RithmicSyncPanelContentProps
> = ({
  statusState,
  localAccounts,
  accountMappings,
  mappingDirty,
  mappingRetryAtByAccountId,
  busyConnections,
  refreshing,
  syncAllBusy,
  syncAllAvailable,
  syncAllBlockedMessage,
  connectionStates,
  refresh,
  syncConnection,
  syncAll,
  updateMapping,
}) => {
  const connections =
    statusState.kind === 'loaded' ? statusState.data.connections : [];
  const statusLoaded = statusState.kind === 'loaded';
  const statusUnavailable = statusState.kind === 'failed';
  const now = useRateLimitCountdown(mappingRetryAtByAccountId);
  const openIntegrations = () => openExternalUrl(RITHMIC_INTEGRATIONS_URL);

  return (
    <section>
      <BrokerOverviewCard
        title={t('trade-sync.source.rithmic')}
        description={t('trade-sync.rithmic.plugin-sync-description')}
        manageLink={{
          label: t('trade-sync.rithmic.manage'),
          onClick: openIntegrations,
        }}
        actionsHint={syncAllAvailable ? undefined : syncAllBlockedMessage}
        actions={
          <>
            {statusLoaded && connections.length === 0 ? (
              <Button variant="primary" size="small" onClick={openIntegrations}>
                {t('trade-sync.rithmic.connect')}
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
                {t('trade-sync.rithmic.sync-all')}
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
                label: t('trade-sync.rithmic.connect-another'),
                onClick: openIntegrations,
              }
            : undefined
        }
      />

      {!statusLoaded && (
        <BrokerStatusPlaceholder
          role={statusUnavailable ? 'alert' : 'status'}
          message={t(
            statusUnavailable
              ? 'trade-sync.rithmic.status-failed'
              : 'common.loading'
          )}
        />
      )}

      {statusLoaded && connections.length === 0 && (
        <BrokerStatusPlaceholder
          message={t('trade-sync.rithmic.no-connections')}
        />
      )}

      <BrokerConnectionList>
        {connections.map((connection) => (
          <RithmicConnectionCard
            key={connection.id}
            connection={connection}
            state={connectionStates[connection.id]}
            localAccounts={localAccounts}
            accountMappings={accountMappings}
            mappingDirty={mappingDirty}
            mappingRetryAtByAccountId={mappingRetryAtByAccountId}
            now={now}
            busy={Boolean(busyConnections[connection.id] || syncAllBusy)}
            syncConnection={syncConnection}
            updateMapping={updateMapping}
          />
        ))}
      </BrokerConnectionList>

      <RithmicAttribution />
    </section>
  );
};

RithmicSyncPanelContent.displayName = 'RithmicSyncPanelContent';
