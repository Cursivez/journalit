import type JournalitPlugin from '../../main';
import { TradovateClientDiagnosticsService } from './TradovateClientDiagnosticsService';
import type {
  TradeProjectionAckClient,
  TradeProjectionAckRequest,
  TradeProjectionRequestOptions,
} from './types';

type PendingAck = TradeProjectionAckRequest & { ownerUserId?: string };
type AckResult = TradeProjectionAckRequest['results'][number];
const activeAckSendCounts = new WeakMap<JournalitPlugin, Map<string, number>>();
const activeAckPermanentFailures = new WeakMap<
  JournalitPlugin,
  Map<string, { remainingConsumers: number; result: AckResult }>
>();

export function projectionAckDeliveryRequest(
  request: PendingAck
): TradeProjectionAckRequest {
  return {
    vaultId: request.vaultId,
    ...(request.deviceId ? { deviceId: request.deviceId } : {}),
    ...(request.pluginVersion ? { pluginVersion: request.pluginVersion } : {}),
    ...(request.clientOperationId
      ? { clientOperationId: request.clientOperationId }
      : {}),
    results: request.results,
  };
}

export async function recordProjectionAckQueuedDiagnostic(
  plugin: JournalitPlugin,
  request: TradeProjectionAckRequest,
  ownerUserId: string
): Promise<void> {
  if (!request.clientOperationId || !request.pluginVersion || !ownerUserId)
    return;
  await new TradovateClientDiagnosticsService(plugin).record(
    {
      clientOperationId: request.clientOperationId,
      ownerUserId,
      pluginVersion: request.pluginVersion,
      vaultId: request.vaultId,
      deviceId: request.deviceId,
      scope: 'projection',
      syncRunId: request.diagnosticSyncRunId ?? request.clientOperationId,
    },
    { eventType: 'projection_ack_queued', count: request.results.length }
  );
}

export async function deliverProjectionAck(
  backendService: TradeProjectionAckClient,
  request: TradeProjectionAckRequest,
  options: TradeProjectionRequestOptions
): Promise<void> {
  if (Object.keys(options).length === 0) {
    await backendService.projectionAck(request);
  } else {
    await backendService.projectionAck(request, options);
  }
}

function projectionAckResultIdentityKey(
  request: TradeProjectionAckRequest,
  result: TradeProjectionAckRequest['results'][number]
): string {
  return JSON.stringify([
    request.vaultId,
    request.deviceId ?? null,
    request.pluginVersion ?? null,
    request.clientOperationId ?? null,
    result.tradeId,
    result.backendTradeVersion,
    result.filePath ?? null,
    result.frontmatterHash ?? null,
    result.localRevision ?? null,
    result.status,
    result.errorCode ?? null,
  ]);
}

function activeAckResultKey(request: PendingAck, result: AckResult): string {
  return JSON.stringify([
    request.ownerUserId ?? null,
    projectionAckResultIdentityKey(request, result),
  ]);
}

export function registerActiveProjectionAckSend(
  plugin: JournalitPlugin,
  request: PendingAck
): () => void {
  const counts = activeAckSendCounts.get(plugin) ?? new Map<string, number>();
  activeAckSendCounts.set(plugin, counts);
  const keys = request.results.map((result) =>
    activeAckResultKey(request, result)
  );
  keys.forEach((key) => counts.set(key, (counts.get(key) ?? 0) + 1));
  return () => {
    keys.forEach((key) => {
      const remaining = (counts.get(key) ?? 1) - 1;
      if (remaining > 0) counts.set(key, remaining);
      else {
        counts.delete(key);
        activeAckPermanentFailures.get(plugin)?.delete(key);
      }
    });
    if (counts.size === 0) activeAckSendCounts.delete(plugin);
    if (activeAckPermanentFailures.get(plugin)?.size === 0) {
      activeAckPermanentFailures.delete(plugin);
    }
  };
}

export function recordActiveProjectionAckPermanentFailures(
  plugin: JournalitPlugin,
  request: PendingAck,
  results: AckResult[]
): void {
  const counts = activeAckSendCounts.get(plugin);
  if (!counts) return;
  const failures =
    activeAckPermanentFailures.get(plugin) ??
    new Map<string, { remainingConsumers: number; result: AckResult }>();
  for (const result of results) {
    const key = activeAckResultKey(request, result);
    const activeCount = counts.get(key) ?? 0;
    if (activeCount > 0) {
      failures.set(key, { remainingConsumers: activeCount, result });
    }
  }
  if (failures.size > 0) activeAckPermanentFailures.set(plugin, failures);
}

export function consumeActiveProjectionAckPermanentFailures(
  plugin: JournalitPlugin,
  request: PendingAck
): AckResult[] {
  const failures = activeAckPermanentFailures.get(plugin);
  if (!failures) return [];
  const matched: AckResult[] = [];
  for (const result of request.results) {
    const key = activeAckResultKey(request, result);
    const failure = failures.get(key);
    if (!failure) continue;
    matched.push(failure.result);
    if (failure.remainingConsumers > 1) {
      failure.remainingConsumers -= 1;
    } else {
      failures.delete(key);
    }
  }
  if (failures.size === 0) activeAckPermanentFailures.delete(plugin);
  return matched;
}

export function matchingProjectionAckResults(
  requests: TradeProjectionAckRequest[],
  requested: TradeProjectionAckRequest
): TradeProjectionAckRequest['results'] {
  const keys = new Set(
    requested.results.map((result) =>
      projectionAckResultIdentityKey(requested, result)
    )
  );
  return requests.flatMap((candidate) =>
    candidate.results.filter((result) =>
      keys.has(projectionAckResultIdentityKey(candidate, result))
    )
  );
}
