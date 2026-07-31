import type JournalitPlugin from '../../main';
import { getTradeProjectionOwnerId } from './TradeProjectionOwnership';
import type { AckQueueBlockReason } from './TradeProjectionAckRetry';
import type { TradeProjectionAckRequest } from './types';

type PendingAck = TradeProjectionAckRequest & { ownerUserId?: string };

type AckRecoveryState =
  | { kind: 'preserve' }
  | { kind: 'clear'; ownerUserId?: string }
  | { kind: 'scheduled'; nextAttemptAt: number; ownerUserId: string }
  | {
      kind: 'blocked';
      blockedBy: AckQueueBlockReason;
      ownerUserId: string;
    };

export function countPendingTradeProjectionAcksForCurrentOwner(
  plugin: JournalitPlugin
): number {
  const ownerUserId = getTradeProjectionOwnerId(plugin);
  if (!ownerUserId) return 0;
  return (
    plugin.settings.backendIntegration?.pendingTradeImportProjectionAcks ?? []
  )
    .filter((request) => request.ownerUserId === ownerUserId)
    .reduce((count, request) => count + request.results.length, 0);
}

export function hasPendingTradeProjectionAckForCurrentOwner(
  plugin: JournalitPlugin
): boolean {
  return countPendingTradeProjectionAcksForCurrentOwner(plugin) > 0;
}

export function clearProjectionAckRecoveryIfOwnerQueueEmpty(
  plugin: JournalitPlugin,
  ownerUserId: string | undefined
): void {
  const settings = plugin.settings.backendIntegration;
  if (!settings || !ownerUserId) return;
  const ownerHasPendingAcks = (
    settings.pendingTradeImportProjectionAcks ?? []
  ).some((request) => request.ownerUserId === ownerUserId);
  if (ownerHasPendingAcks) return;
  const recoveryByOwner = {
    ...(settings.pendingTradeProjectionAckRecoveryByOwner ?? {}),
  };
  delete recoveryByOwner[ownerUserId];
  settings.pendingTradeProjectionAckRecoveryByOwner =
    Object.keys(recoveryByOwner).length > 0 ? recoveryByOwner : undefined;
}

export async function savePendingProjectionAckQueue(
  plugin: JournalitPlugin,
  queue: PendingAck[],
  recovery: AckRecoveryState = { kind: 'preserve' }
): Promise<void> {
  const settings = plugin.settings.backendIntegration;
  if (!settings) return;
  settings.pendingTradeImportProjectionAcks = queue;
  const effectiveRecovery =
    queue.length === 0 ? { kind: 'clear' as const } : recovery;
  if (effectiveRecovery.kind !== 'preserve') {
    if (queue.length === 0) {
      settings.pendingTradeProjectionAckRecoveryByOwner = undefined;
    } else {
      const ownerUserId =
        'ownerUserId' in effectiveRecovery
          ? effectiveRecovery.ownerUserId
          : getTradeProjectionOwnerId(plugin);
      if (ownerUserId) {
        const recoveryByOwner = {
          ...(settings.pendingTradeProjectionAckRecoveryByOwner ?? {}),
        };
        if (effectiveRecovery.kind === 'clear') {
          delete recoveryByOwner[ownerUserId];
        } else {
          recoveryByOwner[ownerUserId] =
            effectiveRecovery.kind === 'scheduled'
              ? {
                  nextAttemptAt: new Date(
                    effectiveRecovery.nextAttemptAt
                  ).toISOString(),
                }
              : { blockedBy: effectiveRecovery.blockedBy };
        }
        settings.pendingTradeProjectionAckRecoveryByOwner =
          Object.keys(recoveryByOwner).length > 0 ? recoveryByOwner : undefined;
      }
    }
  }
  await plugin.saveSettings?.();
}

export function persistedProjectionAckBlockReason(
  plugin: JournalitPlugin
): AckQueueBlockReason | undefined {
  const ownerUserId = getTradeProjectionOwnerId(plugin);
  if (!ownerUserId) return undefined;
  const value =
    plugin.settings.backendIntegration
      ?.pendingTradeProjectionAckRecoveryByOwner?.[ownerUserId]?.blockedBy;
  return value === 'authentication' || value === 'entitlement'
    ? value
    : undefined;
}

export function persistedProjectionAckNextAttemptAt(
  plugin: JournalitPlugin
): number | undefined {
  const ownerUserId = getTradeProjectionOwnerId(plugin);
  if (!ownerUserId) return undefined;
  const value =
    plugin.settings.backendIntegration
      ?.pendingTradeProjectionAckRecoveryByOwner?.[ownerUserId]?.nextAttemptAt;
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : undefined;
}
