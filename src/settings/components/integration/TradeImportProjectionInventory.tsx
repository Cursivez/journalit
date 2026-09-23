import React from 'react';
import { RotateCcw, Save } from '../../../components/shared/icons/ObsidianIcon';
import { Button } from '../../../components/ui';
import { t } from '../../../lang/helpers';
import type { TradeProjectionAccountInventoryItem } from '../../../services/tradeSync/types';
import { formatLocalizedDateTime } from '../../../utils/localizedDateTime';
import { rateLimitUiState } from './brokerSyncKit';

export interface ImportAccountOption {
  name: string;
  id: string;
}

type AccountMappings = Record<string, string>;

export function selectDefaultLocalAccount(
  account: TradeProjectionAccountInventoryItem,
  localAccounts: ImportAccountOption[]
): string {
  const mappedId = account.mapping?.localAccountId;
  if (mappedId) {
    const mappedAccount = localAccounts.find((local) => local.id === mappedId);
    if (mappedAccount) return mappedAccount.name;
  }
  const mappedName = account.mapping?.localAccountName;
  if (mappedName && localAccounts.some((local) => local.name === mappedName)) {
    return mappedName;
  }
  if (localAccounts.some((local) => local.name === account.displayName)) {
    return account.displayName;
  }
  return '';
}

const TradeImportAccountCard: React.FC<{
  account: TradeProjectionAccountInventoryItem;
  localAccounts: ImportAccountOption[];
  selectedLocalAccount: string;
  busy: boolean;
  isRestoring: boolean;
  mappingRateLimited: boolean;
  restoreRateLimited: boolean;
  mappingRateLimitMessage?: string;
  restoreRateLimitMessage?: string;
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
  mappingRateLimited,
  restoreRateLimited,
  mappingRateLimitMessage,
  restoreRateLimitMessage,
  onSelectLocalAccount,
  onCreateLocalAccount,
  onSaveMapping,
  onRestore,
}) => {
  const persistedMappingUnchanged = Boolean(
    account.mapping?.localAccountName === selectedLocalAccount
  );
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
        {account.conflictCount > 0 && (
          <p className="journalit-trade-import-account-card__conflict-help">
            {t('trade-sync.import.account.conflict-repair')}
          </p>
        )}
        {account.mapping?.lastSyncedAt && (
          <span>
            {t('trade-sync.tradovate.last-projection')}:{' '}
            {formatLocalizedDateTime(account.mapping.lastSyncedAt)}
          </span>
        )}
        {account.pendingCount + account.needsRewriteCount > 0 && (
          <span>
            {t('trade-sync.tradovate.pending-projections', {
              count: String(account.pendingCount + account.needsRewriteCount),
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
            <option value="">{t('account.link-modal.select-account')}</option>
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
          disabled={busy || mappingRateLimited || matchingLocalAccountExists}
          onClick={onCreateLocalAccount}
          title={t('trade-sync.import.action.create-local-account-title')}
        >
          {t('trade-sync.import.action.create-local-account')}
        </Button>
        <Button
          variant="secondary"
          disabled={
            busy ||
            mappingRateLimited ||
            !selectedLocalAccount ||
            persistedMappingUnchanged
          }
          onClick={onSaveMapping}
          title={t('trade-sync.import.action.save-mapping-title')}
        >
          <Save size={14} />
          {t('trade-sync.import.action.save-mapping')}
        </Button>
        <Button
          variant="primary"
          disabled={
            busy ||
            mappingRateLimited ||
            restoreRateLimited ||
            !selectedLocalAccount ||
            account.restorableCount === 0
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
      {mappingRateLimitMessage && (
        <p className="journalit-trade-import-account-card__conflict-help">
          {mappingRateLimitMessage}
        </p>
      )}
      {restoreRateLimitMessage && (
        <p className="journalit-trade-import-account-card__conflict-help">
          {restoreRateLimitMessage}
        </p>
      )}
    </article>
  );
};

interface TradeProjectionInventoryProps {
  showPendingAcks: boolean;
  pendingAckCount: number;
  inventoryLoaded: boolean;
  accounts: TradeProjectionAccountInventoryItem[];
  localAccounts: ImportAccountOption[];
  selectedLocalAccounts: AccountMappings;
  busy: boolean;
  restoringAccountId?: string;
  mappingRetryAtByAccountId: Record<string, number>;
  restoreRetryAtByAccountId: Record<string, number>;
  now: number;
  onSelectLocalAccount: (accountId: string, localAccountName: string) => void;
  onCreateLocalAccount: (account: TradeProjectionAccountInventoryItem) => void;
  onSaveMapping: (
    account: TradeProjectionAccountInventoryItem,
    localAccountName: string
  ) => void;
  onRestore: (
    account: TradeProjectionAccountInventoryItem,
    localAccountName: string
  ) => void;
}

export const TradeProjectionInventory: React.FC<
  TradeProjectionInventoryProps
> = ({
  showPendingAcks,
  pendingAckCount,
  inventoryLoaded,
  accounts,
  localAccounts,
  selectedLocalAccounts,
  busy,
  restoringAccountId,
  mappingRetryAtByAccountId,
  restoreRetryAtByAccountId,
  now,
  onSelectLocalAccount,
  onCreateLocalAccount,
  onSaveMapping,
  onRestore,
}) => (
  <>
    {showPendingAcks && pendingAckCount > 0 && (
      <div className="journalit-trade-import-sync-pending">
        {t('trade-sync.import.pending-acks', {
          count: String(pendingAckCount),
        })}
      </div>
    )}

    {inventoryLoaded && accounts.length === 0 && (
      <div className="journalit-trade-import-sync-placeholder">
        {t('trade-sync.import.empty-accounts')}
      </div>
    )}

    {inventoryLoaded && accounts.length > 0 && (
      <div className="journalit-trade-import-account-grid">
        {accounts.map((account) => {
          const selectedLocalAccount =
            selectedLocalAccounts[account.accountId] ??
            selectDefaultLocalAccount(account, localAccounts);
          const mappingRateLimit = rateLimitUiState(
            mappingRetryAtByAccountId[account.accountId],
            'mapping',
            now
          );
          const restoreRateLimit = rateLimitUiState(
            restoreRetryAtByAccountId[account.accountId],
            'restore',
            now
          );
          return (
            <TradeImportAccountCard
              key={account.accountId}
              account={account}
              localAccounts={localAccounts}
              selectedLocalAccount={selectedLocalAccount}
              busy={busy}
              isRestoring={restoringAccountId === account.accountId}
              mappingRateLimited={mappingRateLimit.limited}
              restoreRateLimited={restoreRateLimit.limited}
              mappingRateLimitMessage={mappingRateLimit.message}
              restoreRateLimitMessage={restoreRateLimit.message}
              onSelectLocalAccount={(localAccountName) =>
                onSelectLocalAccount(account.accountId, localAccountName)
              }
              onCreateLocalAccount={() => onCreateLocalAccount(account)}
              onSaveMapping={() => onSaveMapping(account, selectedLocalAccount)}
              onRestore={() => onRestore(account, selectedLocalAccount)}
            />
          );
        })}
      </div>
    )}
  </>
);
