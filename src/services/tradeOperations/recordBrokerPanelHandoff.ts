import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import { getTradeProjectionOwnerId } from '../tradeSync/TradeProjectionOwnership';
import type { TradeProjectionSyncResult } from '../tradeSync/types';
import { shouldAnnounceSyncCompletion } from './presentationPolicy';
import { buildProjectionSyncOperationResult } from './resultBuilders';
import type { TradeOperationResult } from './types';

export function recordBrokerPanelHandoff(
  plugin: JournalitPlugin,
  result: TradeProjectionSyncResult,
  message: string
): TradeOperationResult {
  const showSyncNotifications = shouldAnnounceSyncCompletion(plugin);
  const builtResult = buildProjectionSyncOperationResult({
    result,
    source: 'broker-panel',
    ownerUserId: getTradeProjectionOwnerId(plugin),
  });
  if (builtResult.trades.length === 0) {
    if (showSyncNotifications) {
      new Notice(message || t('trade-handoff.title.sync'));
    }
    return builtResult;
  }
  const operationResult = plugin
    .ensureTradeOperationResultService()
    .record(builtResult);
  if (!operationResult) {
    if (showSyncNotifications) {
      new Notice(message || t('trade-handoff.title.sync'));
    }
    return builtResult;
  }
  return operationResult;
}
