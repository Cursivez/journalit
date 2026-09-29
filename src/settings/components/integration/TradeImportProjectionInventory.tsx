import React from 'react';
import { Menu } from 'obsidian';
import { MoreHorizontal } from '../../../components/shared/icons/ObsidianIcon';
import { IconButton } from '../../../components/ui/IconButton';
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

const TradeImportAccountRow: React.FC<{
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
  onRestore: () => void;
  
  onDeleteFromServer?: () => void;
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
  onRestore,
  onDeleteFromServer,
}) => {
  const matchingLocalAccountExists = localAccounts.some(
    (localAccount) => localAccount.name === account.displayName
  );
  const issueCount = account.failedCount + account.conflictCount;
  const pendingCount = account.pendingCount + account.needsRewriteCount;
  const canRestore =
    !mappingRateLimited &&
    !restoreRateLimited &&
    selectedLocalAccount !== '' &&
    account.restorableCount > 0;

  const openActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    const menu = new Menu();
    menu.addItem((item) =>
      item
        .setTitle(
          isRestoring
            ? t('trade-sync.import.action.restoring')
            : t('trade-sync.import.action.restore-account')
        )
        .setIcon('rotate-ccw')
        .setDisabled(!canRestore)
        .onClick(onRestore)
    );
    if (!matchingLocalAccountExists) {
      menu.addItem((item) =>
        item
          .setTitle(t('trade-sync.import.action.create-local-account'))
          .setIcon('plus')
          .setDisabled(mappingRateLimited)
          .onClick(onCreateLocalAccount)
      );
    }
    if (onDeleteFromServer) {
      menu.addSeparator();
      menu.addItem((item) =>
        item
          .setTitle(t('trade-import.server-deletion.account.button'))
          .setIcon('trash-2')
          .setWarning(true)
          .onClick(onDeleteFromServer)
      );
    }
    menu.showAtMouseEvent(event.nativeEvent);
  };

  const notes = [
    account.conflictCount > 0
      ? t('trade-sync.import.account.conflict-repair')
      : null,
    pendingCount > 0
      ? t('trade-sync.tradovate.pending-projections', {
          count: String(pendingCount),
        })
      : null,
    account.mapping?.lastSyncedAt
      ? `${t('trade-sync.tradovate.last-projection')}: ${formatLocalizedDateTime(account.mapping.lastSyncedAt)}`
      : null,
    mappingRateLimitMessage ?? null,
    restoreRateLimitMessage ?? null,
  ].filter((note): note is string => note !== null);

  return (
    <li className="journalit-trade-import-account-row">
      <div className="journalit-trade-import-account-row__identity">
        <strong>{account.displayName}</strong>
        <span>{account.broker}</span>
      </div>
      <div className="journalit-trade-import-account-row__status">
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
        {account.restorableCount > 0 && (
          <span className="journalit-trade-import-account-row__restorable">
            {t('trade-sync.import.account.restorable-count', {
              count: String(account.restorableCount),
            })}
          </span>
        )}
        {issueCount > 0 && (
          <span className="journalit-trade-import-account-row__issues">
            {t('trade-sync.import.account.issue-count', {
              count: String(issueCount),
            })}
          </span>
        )}
      </div>
      <select
        className="journalit-trade-import-account-row__link dropdown"
        aria-label={t('trade-sync.import.account.local-account')}
        value={selectedLocalAccount}
        disabled={busy || mappingRateLimited}
        onChange={(event) => onSelectLocalAccount(event.target.value)}
      >
        <option value="">{t('account.link-modal.select-account')}</option>
        {localAccounts.map((localAccount) => (
          <option key={localAccount.name} value={localAccount.name}>
            {localAccount.name}
          </option>
        ))}
      </select>
      <IconButton
        className="journalit-trade-import-account-row__menu"
        ariaLabel={t('trade-sync.import.more-actions')}
        disabled={busy}
        onClick={openActions}
      >
        <MoreHorizontal size={16} />
      </IconButton>
      {notes.length > 0 && (
        <div className="journalit-trade-import-account-row__notes">
          {notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      )}
    </li>
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
  
  onSelectLocalAccount: (
    account: TradeProjectionAccountInventoryItem,
    localAccountName: string
  ) => void;
  onCreateLocalAccount: (account: TradeProjectionAccountInventoryItem) => void;
  onRestore: (
    account: TradeProjectionAccountInventoryItem,
    localAccountName: string
  ) => void;
  onDeleteFromServer?: (account: TradeProjectionAccountInventoryItem) => void;
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
  onRestore,
  onDeleteFromServer,
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
      <ul className="journalit-trade-import-account-list">
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
            <TradeImportAccountRow
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
                onSelectLocalAccount(account, localAccountName)
              }
              onCreateLocalAccount={() => onCreateLocalAccount(account)}
              onRestore={() => onRestore(account, selectedLocalAccount)}
              onDeleteFromServer={
                onDeleteFromServer
                  ? () => onDeleteFromServer(account)
                  : undefined
              }
            />
          );
        })}
      </ul>
    )}
  </>
);
