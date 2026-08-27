import type JournalitPlugin from '../../main';
import { ApiError } from '../../types/errors';
import { ApiClient } from '../backend/ApiClient';
import { TradovateBrokerSyncClient } from './TradovateBrokerSyncClient';
import { getTradeProjectionOwnerId } from './TradeProjectionOwnership';
import {
  createBrokerConnectionOperation,
  createBrokerProjectionOperation,
} from './BrokerClientOperations';
import type {
  BrokerClientDiagnosticErrorCode,
  BrokerClientDiagnosticEvent,
  BrokerClientDiagnosticEventInput,
  BrokerClientDiagnosticEventType,
  TradovateClientDiagnosticPayload,
  BrokerClientOperationContext,
  BrokerSyncProviderId,
} from './types';

const MAX_QUEUED_OPERATIONS = 25;
const MAX_EVENT_COUNT = 100_000;

const FLUSH_DEBOUNCE_MS = 2000;

const RATE_LIMIT_COOLDOWN_MS = 60_000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DIAGNOSTICS_PROVIDER: BrokerSyncProviderId = 'tradovate';
const workByPlugin = new WeakMap<JournalitPlugin, Promise<void>>();
const scheduledFlushByPlugin = new WeakMap<JournalitPlugin, number>();
const deliveryBlockedUntilByPlugin = new WeakMap<JournalitPlugin, number>();
const disposedPlugins = new WeakSet<JournalitPlugin>();
const registeredFlushLifecycle = new WeakSet<JournalitPlugin>();

type PersistedBatch = TradovateClientDiagnosticPayload & {
  ownerUserId: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;
}

function nonEmptyString(value: unknown, maximumLength: number): string | null {
  return typeof value === 'string' &&
    value.length > 0 &&
    value.length <= maximumLength
    ? value
    : null;
}

function eventType(value: unknown): BrokerClientDiagnosticEventType | null {
  switch (value) {
    case 'sync_requested':
    case 'job_poll_started':
    case 'job_poll_completed':
    case 'projection_inventory_loaded':
    case 'account_mapping_missing':
    case 'projection_write_failed':
    case 'projection_ack_queued':
      return value;
    default:
      return null;
  }
}

function errorCode(
  value: unknown
): BrokerClientDiagnosticErrorCode | null | undefined {
  if (value === undefined) return undefined;
  switch (value) {
    case 'broker_job_failed':
      return 'broker_job_failed';
    case 'broker_job_cancelled':
      return 'broker_job_cancelled';
    case 'job_poll_request_failed':
      return 'job_poll_request_failed';
    case 'local_account_mapping_missing':
      return 'local_account_mapping_missing';
    case 'obsidian_write_timeout':
      return 'obsidian_write_timeout';
    case 'blocked_by_obsidian_write_timeout':
      return 'blocked_by_obsidian_write_timeout';
    case 'obsidian_write_failed':
      return 'obsidian_write_failed';
    case 'trade_cache_lookup_failed':
      return 'trade_cache_lookup_failed';
    default:
      return null;
  }
}

function isVaultScopedEvent(value: BrokerClientDiagnosticEventType): boolean {
  return (
    value === 'projection_inventory_loaded' ||
    value === 'projection_write_failed' ||
    value === 'projection_ack_queued'
  );
}

function normalizeEvent(value: unknown): BrokerClientDiagnosticEvent | null {
  const candidate = asRecord(value);
  const normalizedEventType = eventType(candidate?.eventType);
  const occurredAtText =
    typeof candidate?.occurredAt === 'string' ? candidate.occurredAt : null;
  const occurredAt =
    occurredAtText === null ? Number.NaN : Date.parse(occurredAtText);
  const now = Date.now();
  if (
    !candidate ||
    !normalizedEventType ||
    occurredAtText === null ||
    !Number.isFinite(occurredAt) ||
    occurredAt < now - 30 * 24 * 60 * 60 * 1000 ||
    occurredAt > now + 10 * 60 * 1000
  ) {
    return null;
  }
  const normalizedErrorCode = errorCode(candidate.errorCode);
  if (normalizedErrorCode === null) return null;
  const count =
    candidate.count === undefined
      ? undefined
      : typeof candidate.count === 'number' &&
          Number.isInteger(candidate.count) &&
          candidate.count > 0 &&
          candidate.count <= MAX_EVENT_COUNT
        ? candidate.count
        : null;
  if (count === null) return null;
  return {
    eventType: normalizedEventType,
    occurredAt: occurredAtText,
    errorCode: normalizedErrorCode,
    count,
  };
}

function normalizeBatch(value: unknown): PersistedBatch | null {
  const candidate = asRecord(value);
  if (
    !candidate ||
    candidate.schemaVersion !== 'tradovate-client-diagnostics-v2'
  ) {
    return null;
  }
  const ownerUserId = nonEmptyString(candidate.ownerUserId, 200);
  const pluginVersion = nonEmptyString(candidate.pluginVersion, 50);
  const vaultId = nonEmptyString(candidate.vaultId, 200);
  const operationId = nonEmptyString(candidate.operationId, 36);
  const deviceId =
    candidate.deviceId === undefined
      ? undefined
      : nonEmptyString(candidate.deviceId, 36);
  const jobId =
    candidate.jobId === undefined
      ? undefined
      : nonEmptyString(candidate.jobId, 200);
  const connectionId =
    candidate.connectionId === undefined
      ? undefined
      : nonEmptyString(candidate.connectionId, 200);
  const syncRunId =
    candidate.syncRunId === undefined
      ? undefined
      : nonEmptyString(candidate.syncRunId, 36);
  if (
    !ownerUserId ||
    !pluginVersion ||
    !vaultId ||
    !operationId ||
    !UUID_PATTERN.test(operationId) ||
    deviceId === null ||
    (deviceId !== undefined && !UUID_PATTERN.test(deviceId)) ||
    jobId === null ||
    connectionId === null ||
    syncRunId === null ||
    (syncRunId !== undefined && !UUID_PATTERN.test(syncRunId)) ||
    (connectionId === undefined && syncRunId === undefined) ||
    (connectionId !== undefined && syncRunId !== undefined) ||
    (jobId !== undefined && connectionId === undefined) ||
    !Array.isArray(candidate.events)
  ) {
    return null;
  }
  const events = candidate.events.flatMap((event) => {
    const normalized = normalizeEvent(event);
    return normalized ? [normalized] : [];
  });
  if (
    events.length === 0 ||
    events.some(
      (event) => isVaultScopedEvent(event.eventType) !== !connectionId
    )
  ) {
    return null;
  }
  return {
    ownerUserId,
    schemaVersion: 'tradovate-client-diagnostics-v2',
    pluginVersion,
    vaultId,
    deviceId,
    jobId,
    operationId,
    connectionId,
    syncRunId,
    events,
  };
}

export function normalizeTradovateClientDiagnosticQueue(
  value: unknown
): PersistedBatch[] {
  if (!Array.isArray(value)) return [];
  return value
    .flatMap((batch) => {
      const normalized = normalizeBatch(batch);
      return normalized ? [normalized] : [];
    })
    .slice(-MAX_QUEUED_OPERATIONS);
}

function payload(batch: PersistedBatch): TradovateClientDiagnosticPayload {
  return {
    schemaVersion: batch.schemaVersion,
    pluginVersion: batch.pluginVersion,
    vaultId: batch.vaultId,
    deviceId: batch.deviceId,
    jobId: batch.jobId,
    operationId: batch.operationId,
    connectionId: batch.connectionId,
    syncRunId: batch.syncRunId,
    events: batch.events,
  };
}

function eventKey(event: BrokerClientDiagnosticEvent): string {
  return `${event.eventType}:${event.errorCode ?? ''}`;
}


function cancelScheduledFlush(plugin: JournalitPlugin): void {
  const scheduled = scheduledFlushByPlugin.get(plugin);
  if (scheduled !== undefined) {
    window.clearTimeout(scheduled);
    scheduledFlushByPlugin.delete(plugin);
  }
}

function isPluginDisposed(plugin: JournalitPlugin): boolean {
  return disposedPlugins.has(plugin);
}

function disposePluginDiagnostics(plugin: JournalitPlugin): void {
  cancelScheduledFlush(plugin);
  disposedPlugins.add(plugin);
}

function ensureFlushLifecycle(plugin: JournalitPlugin): void {
  if (registeredFlushLifecycle.has(plugin)) return;
  registeredFlushLifecycle.add(plugin);
  plugin.register(() => disposePluginDiagnostics(plugin));
}

async function serialized(
  plugin: JournalitPlugin,
  work: () => Promise<void>
): Promise<void> {
  const previous = workByPlugin.get(plugin) ?? Promise.resolve();
  const current = previous.then(work, work);
  workByPlugin.set(
    plugin,
    current.catch(() => undefined)
  );
  await current;
}

export class TradovateClientDiagnosticsService {
  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly backend = new TradovateBrokerSyncClient()
  ) {
    ensureFlushLifecycle(plugin);
  }

  
  dispose(): void {
    disposePluginDiagnostics(this.plugin);
  }

  async createConnectionOperation(
    vaultId: string,
    connectionId: string,
    provider: BrokerSyncProviderId
  ): Promise<BrokerClientOperationContext> {
    const operation = createBrokerConnectionOperation(
      this.plugin,
      vaultId,
      connectionId,
      provider
    );
    this.scheduleFlush();
    return operation;
  }

  async createProjectionOperation(
    vaultId: string,
    provider: BrokerSyncProviderId,
    syncRunId?: string
  ): Promise<BrokerClientOperationContext> {
    const operation = createBrokerProjectionOperation(
      this.plugin,
      vaultId,
      provider,
      syncRunId
    );
    this.scheduleFlush();
    return operation;
  }

  
  async record(
    operation: BrokerClientOperationContext,
    event: BrokerClientDiagnosticEventInput
  ): Promise<void> {
    if (isPluginDisposed(this.plugin)) return;
    if (operation.provider !== DIAGNOSTICS_PROVIDER) return;
    if (
      isVaultScopedEvent(event.eventType) !==
      (operation.scope === 'projection')
    ) {
      return;
    }
    await serialized(this.plugin, async () => {
      try {
        const ownerUserId = getTradeProjectionOwnerId(this.plugin);
        const settings = this.plugin.settings.backendIntegration;
        if (!ownerUserId || !settings || operation.ownerUserId !== ownerUserId)
          return;
        const queue = normalizeTradovateClientDiagnosticQueue(
          settings.pendingTradovateClientDiagnostics
        );
        const existing = queue.find(
          (batch) =>
            batch.ownerUserId === ownerUserId &&
            batch.operationId === operation.clientOperationId
        );
        const occurredAt = new Date().toISOString();
        if (existing) {
          if (operation.jobId) existing.jobId = operation.jobId;
          const key = `${event.eventType}:${event.errorCode ?? ''}`;
          const existingEvent = existing.events.find(
            (candidate) => eventKey(candidate) === key
          );
          if (existingEvent) {
            existingEvent.count = Math.min(
              MAX_EVENT_COUNT,
              (existingEvent.count ?? 1) + (event.count ?? 1)
            );
          } else {
            existing.events.push({ ...event, occurredAt });
          }
        } else {
          queue.push({
            ownerUserId,
            schemaVersion: 'tradovate-client-diagnostics-v2',
            pluginVersion: operation.pluginVersion,
            vaultId: operation.vaultId,
            deviceId: operation.deviceId,
            jobId: operation.jobId,
            operationId: operation.clientOperationId,
            connectionId:
              operation.scope === 'connection'
                ? operation.connectionId
                : undefined,
            syncRunId:
              operation.scope === 'projection'
                ? operation.syncRunId
                : undefined,
            events: [{ ...event, occurredAt }],
          });
        }
        settings.pendingTradovateClientDiagnostics = queue.slice(
          -MAX_QUEUED_OPERATIONS
        );
        await this.plugin.saveSettings().catch(() => undefined);
      } catch {
        // intentional
      }
    });
    this.scheduleFlush();
  }

  
  private scheduleFlush(): void {
    if (isPluginDisposed(this.plugin)) return;
    if (scheduledFlushByPlugin.has(this.plugin)) return;
    const timer = window.setTimeout(() => {
      scheduledFlushByPlugin.delete(this.plugin);
      void this.flush();
    }, FLUSH_DEBOUNCE_MS);
    scheduledFlushByPlugin.set(this.plugin, timer);
  }

  async flush(): Promise<void> {
    if (isPluginDisposed(this.plugin)) return;
    cancelScheduledFlush(this.plugin);
    await serialized(this.plugin, async () => {
      try {
        const ownerUserId = getTradeProjectionOwnerId(this.plugin);
        const settings = this.plugin.settings.backendIntegration;
        if (!settings) return;
        const rawQueue = settings.pendingTradovateClientDiagnostics;
        const queue = normalizeTradovateClientDiagnosticQueue(rawQueue);
        if (JSON.stringify(rawQueue ?? []) !== JSON.stringify(queue)) {
          settings.pendingTradovateClientDiagnostics = queue;
          await this.plugin.saveSettings().catch(() => undefined);
        }
        const ownerAuthSessionVersion = ApiClient.getAuthSessionVersion();
        if (!ownerUserId || !ApiClient.getAuthToken()) return;
        const retained: PersistedBatch[] = [];
        
        
        const blockedUntil = deliveryBlockedUntilByPlugin.get(this.plugin) ?? 0;
        if (Date.now() < blockedUntil) return;
        let deliveryAvailable = true;
        await queue.reduce(
          (delivery, batch) =>
            delivery.then(async () => {
              if (
                batch.ownerUserId !== ownerUserId ||
                !deliveryAvailable ||
                getTradeProjectionOwnerId(this.plugin) !== ownerUserId ||
                ApiClient.getAuthSessionVersion() !== ownerAuthSessionVersion
              ) {
                retained.push(batch);
                return;
              }
              try {
                await this.backend.submitTradovateClientDiagnostics(
                  payload(batch)
                );
              } catch (error) {
                if (error instanceof ApiError && error.statusCode === 400) {
                  return;
                }
                if (error instanceof ApiError && error.statusCode === 429) {
                  deliveryBlockedUntilByPlugin.set(
                    this.plugin,
                    Date.now() + RATE_LIMIT_COOLDOWN_MS
                  );
                }
                retained.push(batch);
                deliveryAvailable = false;
              }
            }),
          Promise.resolve()
        );
        settings.pendingTradovateClientDiagnostics = retained;
        await this.plugin.saveSettings().catch(() => undefined);
      } catch {
        // intentional
      }
    });
  }
}
