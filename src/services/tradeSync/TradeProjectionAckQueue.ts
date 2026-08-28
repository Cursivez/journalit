import type JournalitPlugin from '../../main';
import { generateUUID } from '../../utils/uuid';
import { logger } from '../../utils/logger';
import { ApiClient } from '../backend/ApiClient';
import { TradeProjectionClient } from './TradeProjectionClient';
import {
  consumeActiveProjectionAckPermanentFailures,
  deliverProjectionAck,
  matchingProjectionAckResults,
  projectionAckDeliveryRequest,
  recordActiveProjectionAckPermanentFailures,
  recordProjectionAckQueuedDiagnostic,
  registerActiveProjectionAckSend,
} from './TradeProjectionAckDelivery';
import {
  retryableProjectionAckFailure,
  type RetryableAckFailure,
} from './TradeProjectionAckRetry';
import {
  clearProjectionAckRecoveryIfOwnerQueueEmpty,
  hasPendingTradeProjectionAckForCurrentOwner,
  persistedProjectionAckBlockReason,
  persistedProjectionAckNextAttemptAt,
  savePendingProjectionAckQueue,
} from './TradeProjectionAckPersistence';
import { getTradeProjectionOwnerId } from './TradeProjectionOwnership';
import {
  clearProjectionAckRetryTimer,
  drainInitialProjectionAckBatches,
  initializeProjectionAckRuntime,
  isProjectionAckRuntimeDisposed,
  runProjectionAckWork,
  scheduleProjectionAckRetry,
  startProjectionAckRuntime,
  type ProjectionAckDrainStep,
} from './TradeProjectionAckRuntime';

import type {
  TradeProjectionAckClient,
  TradeProjectionAckRequest,
  TradeProjectionRequestOptions,
} from './types';

export { countPendingTradeProjectionAcksForCurrentOwner } from './TradeProjectionAckPersistence';

type PendingAck = TradeProjectionAckRequest & { ownerUserId?: string };
type TradeProjectionAckSendStatus = 'sent' | 'queued' | 'failed';
interface TradeProjectionAckSendResult {
  status: TradeProjectionAckSendStatus;
  permanentlyFailedResults: TradeProjectionAckRequest['results'];
}

interface FlushOutcome extends ProjectionAckDrainStep {
  durable: boolean;
  permanentlyFailed: TradeProjectionAckRequest[];
}

const QUEUED_ACK_PACING_MS = 650;
const vaultIdWorkByPlugin = new WeakMap<JournalitPlugin, Promise<string>>();

export async function getTradeProjectionVaultId(
  plugin: JournalitPlugin
): Promise<string> {
  const backendSettings = plugin.settings.backendIntegration;
  const existing = backendSettings?.vaultIdentifier;
  if (existing) return existing;
  const pending = vaultIdWorkByPlugin.get(plugin);
  if (pending) return pending;

  const work = (async () => {
    const persistedDuringWait = backendSettings?.vaultIdentifier;
    if (persistedDuringWait) return persistedDuringWait;
    const vaultId = `vault_${generateUUID()}`;
    if (!backendSettings) return vaultId;
    backendSettings.vaultIdentifier = vaultId;
    try {
      await plugin.saveSettings?.();
      return vaultId;
    } catch (error) {
      if (backendSettings.vaultIdentifier === vaultId) {
        delete backendSettings.vaultIdentifier;
      }
      throw error;
    }
  })();
  vaultIdWorkByPlugin.set(plugin, work);
  try {
    return await work;
  } finally {
    if (vaultIdWorkByPlugin.get(plugin) === work) {
      vaultIdWorkByPlugin.delete(plugin);
    }
  }
}

function pendingQueue(plugin: JournalitPlugin): PendingAck[] {
  return (
    plugin.settings.backendIntegration?.pendingTradeImportProjectionAcks ?? []
  );
}

function pendingAckBelongsToOwner(
  request: PendingAck,
  ownerUserId: string
): boolean {
  return request.ownerUserId === ownerUserId;
}

async function flushTradeProjectionAcksOneStep(
  plugin: JournalitPlugin,
  backendService: TradeProjectionAckClient,
  options: TradeProjectionRequestOptions = {}
): Promise<void> {
  try {
    await runProjectionAckWork(plugin, async () => {
      await flushTradeProjectionAcksUnlocked(plugin, backendService, options);
    });
  } catch (error) {
    console.error(
      '[Journalit] Failed to persist projection acknowledgement queue progress:',
      error
    );
  }
}

function scheduleRetry(
  plugin: JournalitPlugin,
  backendService: TradeProjectionAckClient,
  nextAttemptAt: number,
  ownerUserId?: string
): void {
  scheduleProjectionAckRetry(
    plugin,
    backendService,
    nextAttemptAt,
    flushTradeProjectionAcksOneStep,
    ownerUserId
  );
}

export function initializeTradeProjectionAckQueue(
  plugin: JournalitPlugin
): void {
  initializeProjectionAckRuntime(plugin, flushTradeProjectionAcksOneStep);
}

export function startTradeProjectionAckQueue(plugin: JournalitPlugin): void {
  startProjectionAckRuntime(plugin, flushTradeProjectionAcksOneStep);
}

function pendingAckCoalescingKey(
  request: PendingAck,
  result: TradeProjectionAckRequest['results'][number]
): string {
  return JSON.stringify([
    request.ownerUserId ?? '',
    request.vaultId,
    result.tradeId,
    result.backendTradeVersion,
  ]);
}

function pendingAckExactKey(
  request: PendingAck,
  result: TradeProjectionAckRequest['results'][number]
): string {
  return JSON.stringify([
    request.ownerUserId ?? null,
    request.vaultId,
    request.deviceId ?? null,
    request.pluginVersion ?? null,
    request.clientOperationId ?? null,
    request.diagnosticSyncRunId ?? null,
    result.tradeId,
    result.backendTradeVersion,
    result.filePath ?? null,
    result.frontmatterHash ?? null,
    result.localRevision ?? null,
    result.status,
    result.errorCode ?? null,
  ]);
}

function coalescePendingAcks(
  queue: PendingAck[],
  incoming: PendingAck
): PendingAck[] {
  const requests = [...queue, incoming];
  const winners = new Map<
    string,
    {
      requestIndex: number;
      sequence: number;
      result: TradeProjectionAckRequest['results'][number];
    }
  >();
  let sequence = 0;
  requests.forEach((request, requestIndex) => {
    request.results.forEach((result) => {
      const key = pendingAckCoalescingKey(request, result);
      const existing = winners.get(key);
      if (
        existing?.result.status === 'local_deleted' &&
        result.status !== 'local_deleted'
      ) {
        sequence += 1;
        return;
      }
      winners.set(key, { requestIndex, sequence, result });
      sequence += 1;
    });
  });
  const grouped = new Map<
    number,
    Array<TradeProjectionAckRequest['results'][number]>
  >();
  for (const winner of Array.from(winners.values()).sort(
    (left, right) => left.sequence - right.sequence
  )) {
    const results = grouped.get(winner.requestIndex) ?? [];
    results.push(winner.result);
    grouped.set(winner.requestIndex, results);
  }
  return Array.from(grouped.entries())
    .sort(([left], [right]) => left - right)
    .map(([requestIndex, results]) => ({
      ...requests[requestIndex],
      results,
    }));
}

async function enqueueProjectionAck(
  plugin: JournalitPlugin,
  request: TradeProjectionAckRequest,
  ownerOverride?: string
): Promise<{ hadBacklog: boolean; persisted: boolean }> {
  const ownerUserId =
    ownerOverride?.trim() || getTradeProjectionOwnerId(plugin);
  const settings = plugin.settings.backendIntegration;
  if (settings && ownerUserId) {
    const projectionOwners = {
      ...(settings.canonicalTradeProjectionOwners ?? {}),
    };
    for (const result of request.results) {
      if (result.status === 'synced') {
        projectionOwners[result.tradeId] = ownerUserId;
      }
    }
    settings.canonicalTradeProjectionOwners = projectionOwners;
  }
  const queue = pendingQueue(plugin);
  const hadBacklog = Boolean(
    ownerUserId &&
    queue.some((pending) => pendingAckBelongsToOwner(pending, ownerUserId))
  );
  const nextQueue = coalescePendingAcks(queue, {
    ...request,
    ownerUserId: ownerUserId || undefined,
  });
  try {
    await savePendingProjectionAckQueue(plugin, nextQueue);
    return { hadBacklog, persisted: true };
  } catch (error) {
    console.error(
      '[Journalit] Failed to persist a projection acknowledgement:',
      error
    );
    return { hadBacklog, persisted: false };
  }
}

export async function queueTradeProjectionAck(
  plugin: JournalitPlugin,
  request: TradeProjectionAckRequest
): Promise<void> {
  if (isProjectionAckRuntimeDisposed(plugin)) {
    throw new Error('Projection acknowledgement queue is disposed');
  }
  const acceptance = await enqueueProjectionAck(plugin, request);
  if (!acceptance.persisted) {
    throw new Error('Projection acknowledgement could not be persisted');
  }
}

function removeProcessedResults(
  queue: PendingAck[],
  processed: PendingAck
): PendingAck[] {
  const keys = new Set(
    processed.results.map((result) => pendingAckExactKey(processed, result))
  );
  return queue.flatMap((request) => {
    const results = request.results.filter(
      (result) => !keys.has(pendingAckExactKey(request, result))
    );
    return results.length > 0 ? [{ ...request, results }] : [];
  });
}

async function persistAndScheduleRetry(
  plugin: JournalitPlugin,
  backendService: TradeProjectionAckClient,
  recovery: RetryableAckFailure,
  ownerUserId: string
): Promise<boolean> {
  if (recovery.kind === 'event') {
    try {
      await savePendingProjectionAckQueue(plugin, pendingQueue(plugin), {
        kind: 'blocked',
        blockedBy: recovery.blockedBy,
        ownerUserId,
      });
      return true;
    } catch (error) {
      console.error(
        '[Journalit] Failed to retain a projection acknowledgement:',
        error
      );
      return false;
    } finally {
      clearProjectionAckRetryTimer(plugin, ownerUserId);
    }
  }
  const nextAttemptAt = Date.now() + recovery.retryAfterMs;
  try {
    await savePendingProjectionAckQueue(plugin, pendingQueue(plugin), {
      kind: 'scheduled',
      nextAttemptAt,
      ownerUserId,
    });
    return true;
  } catch (error) {
    console.error(
      '[Journalit] Failed to persist projection acknowledgement retry state:',
      error
    );
    return false;
  } finally {
    scheduleRetry(plugin, backendService, nextAttemptAt, ownerUserId);
  }
}

async function completeProcessedResults(
  plugin: JournalitPlugin,
  backendService: TradeProjectionAckClient,
  processed: PendingAck
): Promise<boolean> {
  const remaining = removeProcessedResults(pendingQueue(plugin), processed);
  const ownerUserId =
    processed.ownerUserId?.trim() || getTradeProjectionOwnerId(plugin);
  const hasEligibleRemaining = Boolean(
    ownerUserId &&
    remaining.some((request) => pendingAckBelongsToOwner(request, ownerUserId))
  );
  const nextAttemptAt = Date.now() + QUEUED_ACK_PACING_MS;
  try {
    await savePendingProjectionAckQueue(
      plugin,
      remaining,
      hasEligibleRemaining && ownerUserId
        ? { kind: 'scheduled', nextAttemptAt, ownerUserId }
        : { kind: 'clear', ownerUserId: processed.ownerUserId }
    );
    return true;
  } catch (error) {
    console.error(
      '[Journalit] Failed to persist projection acknowledgement queue progress:',
      error
    );
    return false;
  } finally {
    if (hasEligibleRemaining) {
      scheduleRetry(plugin, backendService, nextAttemptAt, ownerUserId);
    } else {
      clearProjectionAckRetryTimer(plugin, ownerUserId);
    }
  }
}

async function flushTradeProjectionAcksUnlocked(
  plugin: JournalitPlugin,
  backendService: TradeProjectionAckClient,
  options: TradeProjectionRequestOptions = {}
): Promise<FlushOutcome> {
  const ownerUserId = getTradeProjectionOwnerId(plugin);
  if (isProjectionAckRuntimeDisposed(plugin) || !ownerUserId) {
    return {
      continueDrain: false,
      madeProgress: false,
      durable: true,
      permanentlyFailed: [],
    };
  }
  if (persistedProjectionAckBlockReason(plugin)) {
    return {
      continueDrain: false,
      madeProgress: false,
      durable: true,
      permanentlyFailed: [],
    };
  }
  const nextAttemptAt = persistedProjectionAckNextAttemptAt(plugin);
  if (nextAttemptAt !== undefined && nextAttemptAt > Date.now()) {
    scheduleRetry(plugin, backendService, nextAttemptAt);
    return {
      continueDrain: false,
      madeProgress: false,
      durable: true,
      permanentlyFailed: [],
    };
  }
  const request = pendingQueue(plugin).find((pending) =>
    pendingAckBelongsToOwner(pending, ownerUserId)
  );
  if (!request) {
    clearProjectionAckRetryTimer(plugin);
    return {
      continueDrain: false,
      madeProgress: false,
      durable: true,
      permanentlyFailed: [],
    };
  }
  const ownerAuthSessionVersion = ApiClient.getAuthSessionVersion();
  const outgoingRequest = projectionAckDeliveryRequest(request);
  try {
    await deliverProjectionAck(backendService, outgoingRequest, options);
    if (
      isProjectionAckRuntimeDisposed(plugin) ||
      getTradeProjectionOwnerId(plugin) !== ownerUserId ||
      ApiClient.getAuthSessionVersion() !== ownerAuthSessionVersion
    ) {
      return {
        continueDrain: false,
        madeProgress: false,
        durable: true,
        permanentlyFailed: [],
      };
    }
    const durable = await completeProcessedResults(
      plugin,
      backendService,
      request
    );
    return {
      continueDrain: hasPendingTradeProjectionAckForCurrentOwner(plugin),
      madeProgress: true,
      durable,
      permanentlyFailed: [],
    };
  } catch (error) {
    if (isProjectionAckRuntimeDisposed(plugin)) {
      return {
        continueDrain: false,
        madeProgress: false,
        durable: true,
        permanentlyFailed: [],
      };
    }
    const retryable = retryableProjectionAckFailure(error);
    if (retryable) {
      const durable = await persistAndScheduleRetry(
        plugin,
        backendService,
        retryable,
        ownerUserId
      );
      return {
        continueDrain: false,
        madeProgress: false,
        durable,
        permanentlyFailed: [],
      };
    }
  }

  if (request.results.length === 1) {
    const durable = await completeProcessedResults(
      plugin,
      backendService,
      request
    );
    recordActiveProjectionAckPermanentFailures(
      plugin,
      request,
      request.results
    );
    return {
      continueDrain: hasPendingTradeProjectionAckForCurrentOwner(plugin),
      madeProgress: true,
      durable,
      permanentlyFailed: [outgoingRequest],
    };
  }

  const processedResults: TradeProjectionAckRequest['results'] = [];
  const permanentlyFailedResults: TradeProjectionAckRequest['results'] = [];
  let retryableFailure: RetryableAckFailure | null = null;
  await request.results.reduce(
    (delivery, result) =>
      delivery.then(async (shouldContinue) => {
        if (
          !shouldContinue ||
          isProjectionAckRuntimeDisposed(plugin) ||
          getTradeProjectionOwnerId(plugin) !== ownerUserId ||
          ApiClient.getAuthSessionVersion() !== ownerAuthSessionVersion
        ) {
          return false;
        }
        const single = { ...outgoingRequest, results: [result] };
        try {
          await deliverProjectionAck(backendService, single, options);
          processedResults.push(result);
          return true;
        } catch (error) {
          const retryable = retryableProjectionAckFailure(error);
          if (retryable) {
            retryableFailure = retryable;
            return false;
          }
          processedResults.push(result);
          permanentlyFailedResults.push(result);
          return true;
        }
      }),
    Promise.resolve(true)
  );
  let durable = true;
  if (!isProjectionAckRuntimeDisposed(plugin) && processedResults.length > 0) {
    durable = await completeProcessedResults(plugin, backendService, {
      ...request,
      results: processedResults,
    });
  }
  if (!isProjectionAckRuntimeDisposed(plugin) && retryableFailure) {
    durable =
      (await persistAndScheduleRetry(
        plugin,
        backendService,
        retryableFailure,
        ownerUserId
      )) && durable;
  }
  recordActiveProjectionAckPermanentFailures(
    plugin,
    request,
    permanentlyFailedResults
  );
  return {
    continueDrain:
      !retryableFailure && hasPendingTradeProjectionAckForCurrentOwner(plugin),
    madeProgress: processedResults.length > 0,
    durable,
    permanentlyFailed:
      permanentlyFailedResults.length > 0
        ? [{ ...outgoingRequest, results: permanentlyFailedResults }]
        : [],
  };
}

export async function sendTradeProjectionAckWithStatus(
  plugin: JournalitPlugin,
  backendService: TradeProjectionAckClient,
  request: TradeProjectionAckRequest,
  options: TradeProjectionRequestOptions = {},
  ownerUserId?: string
): Promise<TradeProjectionAckSendStatus> {
  return (
    await sendTradeProjectionAckWithResult(
      plugin,
      backendService,
      request,
      options,
      ownerUserId
    )
  ).status;
}

export async function sendTradeProjectionAckWithResult(
  plugin: JournalitPlugin,
  backendService: TradeProjectionAckClient,
  request: TradeProjectionAckRequest,
  options: TradeProjectionRequestOptions = {},
  ownerUserId?: string
): Promise<TradeProjectionAckSendResult> {
  if (isProjectionAckRuntimeDisposed(plugin)) {
    return { status: 'failed', permanentlyFailedResults: [] };
  }
  const initiatingOwnerUserId =
    ownerUserId?.trim() || getTradeProjectionOwnerId(plugin);
  const acceptedRequest: PendingAck = {
    ...request,
    ownerUserId: initiatingOwnerUserId || undefined,
  };
  const unregisterActiveSend = registerActiveProjectionAckSend(
    plugin,
    acceptedRequest
  );
  try {
    const acceptance = await enqueueProjectionAck(
      plugin,
      request,
      initiatingOwnerUserId
    );
    if (acceptance.persisted) {
      await recordProjectionAckQueuedDiagnostic(
        plugin,
        request,
        initiatingOwnerUserId
      );
    }

    return await runProjectionAckWork(plugin, async () => {
      if (isProjectionAckRuntimeDisposed(plugin)) {
        return {
          status: acceptance.persisted ? 'queued' : 'failed',
          permanentlyFailedResults: [],
        };
      }
      if (ownerUserId && getTradeProjectionOwnerId(plugin) !== ownerUserId) {
        return {
          status: acceptance.persisted ? 'queued' : 'failed',
          permanentlyFailedResults: [],
        };
      }
      const previouslyFailedResults =
        consumeActiveProjectionAckPermanentFailures(plugin, acceptedRequest);
      if (previouslyFailedResults.length > 0) {
        return {
          status: 'failed',
          permanentlyFailedResults: previouslyFailedResults,
        };
      }
      const blockedBy = persistedProjectionAckBlockReason(plugin);
      const nextAttemptAt = persistedProjectionAckNextAttemptAt(plugin);
      if (
        acceptance.hadBacklog ||
        blockedBy ||
        (nextAttemptAt ?? 0) > Date.now()
      ) {
        if (!blockedBy) {
          scheduleRetry(plugin, backendService, nextAttemptAt ?? Date.now());
        }
        return {
          status: acceptance.persisted ? 'queued' : 'failed',
          permanentlyFailedResults: [],
        };
      }
      const outcome = await flushTradeProjectionAcksUnlocked(
        plugin,
        backendService,
        options
      );
      const permanentlyFailedResults = matchingProjectionAckResults(
        outcome.permanentlyFailed,
        request
      );
      const attributedFailedResults =
        consumeActiveProjectionAckPermanentFailures(plugin, acceptedRequest);
      const reportedFailedResults =
        permanentlyFailedResults.length > 0
          ? permanentlyFailedResults
          : attributedFailedResults;
      if (reportedFailedResults.length > 0) {
        return {
          status: 'failed',
          permanentlyFailedResults: reportedFailedResults,
        };
      }
      const queuedKeys = new Set(
        pendingQueue(plugin).flatMap((pending) =>
          pending.results.map((result) =>
            pendingAckCoalescingKey(pending, result)
          )
        )
      );
      const stillQueued = request.results.some((result) =>
        queuedKeys.has(pendingAckCoalescingKey(acceptedRequest, result))
      );
      return {
        status: stillQueued
          ? acceptance.persisted || outcome.durable
            ? 'queued'
            : 'failed'
          : 'sent',
        permanentlyFailedResults: [],
      };
    });
  } finally {
    unregisterActiveSend();
  }
}

export async function flushTradeProjectionAcks(
  plugin: JournalitPlugin,
  backendService: TradeProjectionAckClient,
  options: TradeProjectionRequestOptions = {}
): Promise<void> {
  try {
    await drainInitialProjectionAckBatches(plugin, () =>
      flushTradeProjectionAcksUnlocked(plugin, backendService, options)
    );
  } catch (error) {
    console.error(
      '[Journalit] Failed to persist projection acknowledgement queue progress:',
      error
    );
  }
}

export async function acknowledgeLocalDeletedTradeProjection(
  plugin: JournalitPlugin,
  tradeId: string,
  tradeVersion: number,
  filePath: string,
  projectionGeneration?: string
): Promise<void> {
  const settings = plugin.settings.backendIntegration;
  if (settings) {
    settings.localDeletedCanonicalTradeIds = Array.from(
      new Set([...(settings.localDeletedCanonicalTradeIds ?? []), tradeId])
    );
    try {
      await plugin.saveSettings?.();
    } catch {
      logger.warn(
        'Trade projection tombstone persistence failed; attempting backend acknowledgement.'
      );
    }
  }
  const vaultId = await getTradeProjectionVaultId(plugin);
  const rememberedOwner =
    settings?.canonicalTradeProjectionOwners?.[tradeId]?.trim() ?? '';
  await sendTradeProjectionAckWithStatus(
    plugin,
    new TradeProjectionClient(),
    {
      vaultId,
      results: [
        {
          tradeId,
          backendTradeVersion: tradeVersion,
          localRevision: projectionGeneration,
          filePath,
          status: 'local_deleted',
        },
      ],
    },
    {},
    rememberedOwner || getTradeProjectionOwnerId(plugin)
  );
}

export function isLocallyDeletedTradeProjection(
  plugin: JournalitPlugin,
  tradeId: string
): boolean {
  const settings = plugin.settings.backendIntegration;
  return (
    settings?.localDeletedCanonicalTradeIds?.includes(tradeId) === true &&
    settings.restoringCanonicalTradeIds?.includes(tradeId) !== true
  );
}

export async function reserveLocalDeletedTradeProjection(
  plugin: JournalitPlugin,
  tradeId: string
): Promise<void> {
  const settings = plugin.settings.backendIntegration;
  if (!settings) return;
  settings.localDeletedCanonicalTradeIds = Array.from(
    new Set([...(settings.localDeletedCanonicalTradeIds ?? []), tradeId])
  );
  try {
    await plugin.saveSettings?.();
  } catch {
    logger.warn(
      'Local trade projection tombstone persistence failed; continuing with backend acknowledgement.'
    );
  }
}

export async function migrateQueuedTradeProjectionTombstones(
  plugin: JournalitPlugin
): Promise<void> {
  const settings = plugin.settings.backendIntegration;
  if (!settings) return;
  const owner = getTradeProjectionOwnerId(plugin);
  if (!owner) return;
  const queue = pendingQueue(plugin);
  const tombstones = queue.flatMap((request) =>
    request.ownerUserId === owner
      ? request.results.flatMap((result) =>
          result.status === 'local_deleted' ? [result.tradeId] : []
        )
      : []
  );
  if (tombstones.length === 0) return;
  settings.localDeletedCanonicalTradeIds = Array.from(
    new Set([...(settings.localDeletedCanonicalTradeIds ?? []), ...tombstones])
  );
  await plugin.saveSettings?.();
}

export async function clearLocalDeletedTradeProjection(
  plugin: JournalitPlugin,
  tradeId: string
): Promise<void> {
  await runProjectionAckWork(plugin, () =>
    clearLocalDeletedTradeProjectionUnlocked(plugin, tradeId)
  );
}

async function clearLocalDeletedTradeProjectionUnlocked(
  plugin: JournalitPlugin,
  tradeId: string
): Promise<void> {
  const settings = plugin.settings.backendIntegration;
  if (!settings) return;
  settings.localDeletedCanonicalTradeIds = (
    settings.localDeletedCanonicalTradeIds ?? []
  ).filter((id) => id !== tradeId);
  settings.restoringCanonicalTradeIds = (
    settings.restoringCanonicalTradeIds ?? []
  ).filter((id) => id !== tradeId);
  const currentOwner = getTradeProjectionOwnerId(plugin);
  settings.pendingTradeImportProjectionAcks = (
    settings.pendingTradeImportProjectionAcks ?? []
  ).flatMap((request) => {
    if (!request.ownerUserId || request.ownerUserId !== currentOwner)
      return [request];
    const results = request.results.filter(
      (result) =>
        result.tradeId !== tradeId || result.status !== 'local_deleted'
    );
    return results.length ? [{ ...request, results }] : [];
  });
  clearProjectionAckRecoveryIfOwnerQueueEmpty(plugin, currentOwner);
  await plugin.saveSettings?.();
}

export async function restoreTradeProjectionAtomically<T>(
  plugin: JournalitPlugin,
  tradeId: string,
  restoreBackend: () => Promise<T>
): Promise<T> {
  return runProjectionAckWork(plugin, async () => {
    const settings = plugin.settings.backendIntegration;
    const previousDeletedIds = [
      ...(settings?.localDeletedCanonicalTradeIds ?? []),
    ];
    const previousRestoringIds = [
      ...(settings?.restoringCanonicalTradeIds ?? []),
    ];
    const previousQueue = [
      ...(settings?.pendingTradeImportProjectionAcks ?? []),
    ];
    const previousRecoveryByOwner = {
      ...(settings?.pendingTradeProjectionAckRecoveryByOwner ?? {}),
    };
    if (settings) {
      settings.restoringCanonicalTradeIds = Array.from(
        new Set([...(settings.restoringCanonicalTradeIds ?? []), tradeId])
      );
      const currentOwner = getTradeProjectionOwnerId(plugin);
      settings.pendingTradeImportProjectionAcks = (
        settings.pendingTradeImportProjectionAcks ?? []
      ).flatMap((request) => {
        if (!request.ownerUserId || request.ownerUserId !== currentOwner)
          return [request];
        const results = request.results.filter(
          (result) =>
            result.tradeId !== tradeId || result.status !== 'local_deleted'
        );
        return results.length ? [{ ...request, results }] : [];
      });
      clearProjectionAckRecoveryIfOwnerQueueEmpty(plugin, currentOwner);
      await plugin.saveSettings?.();
    }
    let result: T;
    try {
      result = await restoreBackend();
    } catch (error) {
      if (settings) {
        const queueChangesDuringRestore =
          settings.pendingTradeImportProjectionAcks ?? [];
        settings.localDeletedCanonicalTradeIds = previousDeletedIds;
        settings.restoringCanonicalTradeIds = previousRestoringIds;
        settings.pendingTradeImportProjectionAcks =
          queueChangesDuringRestore.reduce(
            (queue, request) => coalescePendingAcks(queue, request),
            previousQueue
          );
        settings.pendingTradeProjectionAckRecoveryByOwner =
          Object.keys(previousRecoveryByOwner).length > 0
            ? previousRecoveryByOwner
            : undefined;
        await plugin.saveSettings?.();
      }
      throw error;
    }
    if (settings) {
      settings.localDeletedCanonicalTradeIds = (
        settings.localDeletedCanonicalTradeIds ?? []
      ).filter((id) => id !== tradeId);
      settings.restoringCanonicalTradeIds = (
        settings.restoringCanonicalTradeIds ?? []
      ).filter((id) => id !== tradeId);
      await plugin.saveSettings?.();
    }
    return result;
  });
}
