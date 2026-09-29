

import { Notice, TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import { DemoSyncGate } from '../../demo/DemoSyncGate';
import { t } from '../../lang/helpers';
import { eventBus } from '../events/EventBus';
import { TradeImportManagementClient } from '../tradeImport/TradeImportManagementClient';
import { clearLocalDeletedTradeProjections } from './TradeProjectionAckQueue';
import {
  createTradeProjectionOwnershipGuard,
  getTradeProjectionOwnerId,
} from './TradeProjectionOwnership';
import {
  markServerDeletedTradeProjections,
  runWithTradeProjectionWriteLock,
} from './TradeProjectionWriteLock';
import { projectedTradesByBackendId } from './TradeProjectionWriter';

type DeletedTradesClient = Pick<
  TradeImportManagementClient,
  'listDeletedTrades'
>;

const activeSyncs = new WeakMap<JournalitPlugin, Promise<number>>();
const queuedSyncs = new WeakMap<JournalitPlugin, Promise<number>>();


export function syncServerDeletedTrades(
  plugin: JournalitPlugin,
  client: DeletedTradesClient = new TradeImportManagementClient()
): Promise<number> {
  const active = activeSyncs.get(plugin);
  if (!active) return startServerDeletedTradeSync(plugin, client);
  const queued = queuedSyncs.get(plugin);
  if (queued) return queued;
  const followUp = active
    .catch(() => undefined)
    .then(() => {
      queuedSyncs.delete(plugin);
      return startServerDeletedTradeSync(plugin, client);
    });
  queuedSyncs.set(plugin, followUp);
  return followUp;
}

function startServerDeletedTradeSync(
  plugin: JournalitPlugin,
  client: DeletedTradesClient
): Promise<number> {
  const run = runServerDeletedTradeSync(plugin, client).finally(() => {
    if (activeSyncs.get(plugin) === run) activeSyncs.delete(plugin);
  });
  activeSyncs.set(plugin, run);
  return run;
}

async function runServerDeletedTradeSync(
  plugin: JournalitPlugin,
  client: DeletedTradesClient
): Promise<number> {
  if (DemoSyncGate.isActive()) return 0;
  const ownerUserId = getTradeProjectionOwnerId(plugin);
  if (!ownerUserId) return 0;
  const ownershipChanged = createTradeProjectionOwnershipGuard(
    plugin,
    ownerUserId
  );
  if (ownershipChanged()) return 0;
  let cursor = storedCursor(plugin, ownerUserId);
  let removed = 0;
  for (;;) {
    const page = await client.listDeletedTrades(cursor);
    if (ownershipChanged()) return removed;
    if (page.hasMore && page.nextCursor <= cursor) {
      throw new Error('Deleted-trades feed cursor did not advance');
    }
    if (page.trades.length > 0) {
      removed += await removeServerDeletedTradeNotes(
        plugin,
        page.trades.map((trade) => trade.tradeId)
      );
    }
    if (page.nextCursor !== cursor) {
      cursor = page.nextCursor;
      await storeCursor(plugin, ownerUserId, cursor);
    }
    if (!page.hasMore) break;
  }
  if (removed > 0) {
    new Notice(
      t('trade-import.server-deletion.notice', { count: String(removed) })
    );
  }
  return removed;
}

function storedCursor(plugin: JournalitPlugin, ownerUserId: string): number {
  const value =
    plugin.settings.backendIntegration?.serverDeletedTradesCursorByOwner?.[
      ownerUserId
    ];
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
    ? value
    : 0;
}

async function storeCursor(
  plugin: JournalitPlugin,
  ownerUserId: string,
  cursor: number
): Promise<void> {
  const settings = plugin.settings.backendIntegration;
  if (!settings) return;
  settings.serverDeletedTradesCursorByOwner = {
    ...(settings.serverDeletedTradesCursorByOwner ?? {}),
    [ownerUserId]: cursor,
  };
  await plugin.saveSettings();
}


async function removeServerDeletedTradeNotes(
  plugin: JournalitPlugin,
  tradeIds: string[]
): Promise<number> {
  const deleted = new Set(tradeIds);
  if (deleted.size === 0) return 0;
  
  
  markServerDeletedTradeProjections(plugin, deleted);

  
  
  const removedPaths = await runWithTradeProjectionWriteLock(
    plugin,
    async () => {
      const byBackendId = await projectedTradesByBackendId(plugin);
      
      
      const paths: string[] = [];
      for (const tradeId of deleted) {
        for (const trade of byBackendId.get(tradeId) ?? []) {
          const path = trade.path;
          if (typeof path !== 'string') continue;
          const file = plugin.app.vault.getAbstractFileByPath(path);
          if (!(file instanceof TFile)) continue;
          await plugin.app.fileManager.trashFile(file);
          paths.push(path);
        }
      }
      return { value: paths };
    }
  );

  await clearLocalDeletedTradeProjections(plugin, deleted);
  const settings = plugin.settings.backendIntegration;
  const owners = settings?.canonicalTradeProjectionOwners;
  if (settings && owners && tradeIds.some((tradeId) => tradeId in owners)) {
    const remaining: Record<string, string> = {};
    for (const [tradeId, owner] of Object.entries(owners)) {
      if (!deleted.has(tradeId)) remaining[tradeId] = owner;
    }
    settings.canonicalTradeProjectionOwners = remaining;
    await plugin.saveSettings();
  }

  if (removedPaths.length > 0) {
    eventBus.publish('trade:changed', {
      action: 'batch',
      filePaths: removedPaths,
      timestamp: Date.now(),
    });
  }
  return removedPaths.length;
}
