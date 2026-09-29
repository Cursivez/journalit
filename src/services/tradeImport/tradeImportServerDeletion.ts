

import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import { logger } from '../../utils/logger';
import { syncServerDeletedTrades } from '../tradeSync/ServerDeletedTradeSync';
import { getTradeProjectionVaultId } from '../tradeSync/TradeProjectionAckQueue';
import { markServerDeletedTradeProjections } from '../tradeSync/TradeProjectionWriteLock';
import { TradeProjectionClient } from '../tradeSync/TradeProjectionClient';
import {
  TradeImportAccountDeletionBlockedError,
  TradeImportManagementClient,
  type TradeImportDeletionResult,
} from './TradeImportManagementClient';

type DeletionClient = Pick<
  TradeImportManagementClient,
  'deleteImport' | 'deleteAccount' | 'listDeletedTrades'
>;

function announceDeletion(result: TradeImportDeletionResult): void {
  new Notice(
    t('trade-import.server-deletion.deleted', {
      count: String(result.deletedTradeIds.length),
    })
  );
  if (result.keptTradeCount > 0) {
    new Notice(
      t('trade-import.server-deletion.kept', {
        count: String(result.keptTradeCount),
      })
    );
  }
}

function announceFailure(error: unknown): void {
  if (error instanceof TradeImportAccountDeletionBlockedError) {
    new Notice(
      error.reason === 'broker_connected'
        ? t('trade-import.server-deletion.blocked-broker-connected')
        : t('trade-import.server-deletion.blocked-broker-history')
    );
    return;
  }
  logger.error('Trade Import server deletion failed', error);
  new Notice(t('trade-import.server-deletion.failed'));
}

async function removeDeletedNotes(
  plugin: JournalitPlugin,
  client: DeletionClient,
  deletedTradeIds: readonly string[]
): Promise<void> {
  
  
  
  markServerDeletedTradeProjections(plugin, deletedTradeIds);
  try {
    await syncServerDeletedTrades(plugin, client);
  } catch (error) {
    
    
    logger.warn('Server-deleted trade note cleanup failed', error);
  }
}


export async function deleteTradeImportFromServer(
  plugin: JournalitPlugin,
  importId: string,
  client: DeletionClient = new TradeImportManagementClient()
): Promise<boolean> {
  let result: TradeImportDeletionResult;
  try {
    result = await client.deleteImport(importId);
  } catch (error) {
    announceFailure(error);
    return false;
  }
  await removeDeletedNotes(plugin, client, result.deletedTradeIds);
  announceDeletion(result);
  return true;
}


export async function deleteTradeImportAccountsFromServer(
  plugin: JournalitPlugin,
  accountIds: readonly string[],
  client: DeletionClient = new TradeImportManagementClient()
): Promise<boolean> {
  const combined: TradeImportDeletionResult = {
    deletedTradeIds: [],
    keptTradeCount: 0,
  };
  
  
  for (const accountId of accountIds) {
    try {
      const result = await client.deleteAccount(accountId);
      combined.deletedTradeIds.push(...result.deletedTradeIds);
      combined.keptTradeCount += result.keptTradeCount;
    } catch (error) {
      if (combined.deletedTradeIds.length > 0) {
        await removeDeletedNotes(plugin, client, combined.deletedTradeIds);
        announceDeletion(combined);
      }
      announceFailure(error);
      return false;
    }
  }
  await removeDeletedNotes(plugin, client, combined.deletedTradeIds);
  announceDeletion(combined);
  return true;
}

export interface ServerImportAccount {
  accountId: string;
  displayName: string;
  tradeCount: number;
}


export async function findServerImportAccountsForLocalAccount(
  plugin: JournalitPlugin,
  localAccount: { id: string; name: string },
  client: Pick<
    TradeProjectionClient,
    'getAccountInventory'
  > = new TradeProjectionClient()
): Promise<ServerImportAccount[]> {
  if (!plugin.settings.backendIntegration?.authenticatedAccountId) return [];
  try {
    const vaultId = await getTradeProjectionVaultId(plugin);
    const inventory = await client.getAccountInventory(vaultId, {
      interactiveEntitlement: false,
    });
    return inventory.accounts.flatMap((account) =>
      (
        account.mapping
          ? account.mapping.localAccountId === localAccount.id ||
            account.mapping.localAccountName === localAccount.name
          : account.displayName === localAccount.name
      )
        ? [
            {
              accountId: account.accountId,
              displayName: account.displayName,
              tradeCount: account.tradeCount,
            },
          ]
        : []
    );
  } catch (error) {
    logger.debug('Trade Import account inventory unavailable', error);
    return [];
  }
}
