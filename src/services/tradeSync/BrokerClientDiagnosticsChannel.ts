import type JournalitPlugin from '../../main';
import { ApiError } from '../../types/errors';
import { ApiClient } from '../backend/ApiClient';
import { getTradeProjectionOwnerId } from './TradeProjectionOwnership';
import {
  createBrokerConnectionOperation,
  createBrokerProjectionOperation,
} from './BrokerClientOperations';
import type {
  BrokerClientDiagnosticBatch,
  BrokerClientDiagnosticPayload,
  BrokerClientDiagnosticSchema,
  BrokerClientDiagnosticErrorCode,
  BrokerClientDiagnosticEvent,
  BrokerClientDiagnosticEventInput,
  BrokerClientDiagnosticEventType,
  BrokerClientOperationContext,
  BrokerSyncProviderId,
} from './types';

const MAX_QUEUED_OPERATIONS = 25;
const MAX_EVENTS = 50;
const MAX_EVENT_COUNT = 100_000;
const FLUSH_DEBOUNCE_MS = 2000;
const RATE_LIMIT_COOLDOWN_MS = 60_000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type SupportedProvider = 'tradovate' | 'hyperliquid';
type ChannelState = { scheduledFlush?: number; blockedUntil: number };


const workByPlugin = new WeakMap<JournalitPlugin, Promise<void>>();
const channelsByPlugin = new WeakMap<
  JournalitPlugin,
  Map<SupportedProvider, ChannelState>
>();
const disposedPlugins = new WeakSet<JournalitPlugin>();

interface ChannelSpec<Schema extends BrokerClientDiagnosticSchema> {
  provider: SupportedProvider;
  schema: Schema;
  readQueue: () => unknown;
  writeQueue: (queue: BrokerClientDiagnosticBatch<Schema>[]) => void;
  submit: (payload: BrokerClientDiagnosticPayload<Schema>) => Promise<void>;
}

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
  )
    return null;
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

function normalizeBatch<Schema extends BrokerClientDiagnosticSchema>(
  value: unknown,
  schema: Schema
): BrokerClientDiagnosticBatch<Schema> | null {
  const candidate = asRecord(value);
  if (!candidate || candidate.schemaVersion !== schema) return null;
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
  )
    return null;
  const events = candidate.events.flatMap((event) => {
    const normalized = normalizeEvent(event);
    return normalized ? [normalized] : [];
  });
  if (
    events.length === 0 ||
    events.some(
      (event) => isVaultScopedEvent(event.eventType) !== !connectionId
    )
  )
    return null;
  return {
    ownerUserId,
    schemaVersion: schema,
    pluginVersion,
    vaultId,
    deviceId,
    jobId,
    operationId,
    connectionId,
    syncRunId,
    events: events.slice(-MAX_EVENTS),
  };
}

function normalizeBrokerClientDiagnosticQueue<
  Schema extends BrokerClientDiagnosticSchema,
>(value: unknown, schema: Schema): BrokerClientDiagnosticBatch<Schema>[] {
  if (!Array.isArray(value)) return [];
  return value
    .flatMap((batch) => {
      const normalized = normalizeBatch(batch, schema);
      return normalized ? [normalized] : [];
    })
    .slice(-MAX_QUEUED_OPERATIONS);
}

function payload<Schema extends BrokerClientDiagnosticSchema>(
  batch: BrokerClientDiagnosticBatch<Schema>
): BrokerClientDiagnosticPayload<Schema> {
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

function cancelScheduledFlush(state: ChannelState): void {
  if (state.scheduledFlush !== undefined) {
    window.clearTimeout(state.scheduledFlush);
    delete state.scheduledFlush;
  }
}

function disposePluginDiagnostics(plugin: JournalitPlugin): void {
  channelsByPlugin.get(plugin)?.forEach(cancelScheduledFlush);
  disposedPlugins.add(plugin);
}

function channelState(
  plugin: JournalitPlugin,
  provider: SupportedProvider
): ChannelState {
  let channels = channelsByPlugin.get(plugin);
  if (!channels) {
    channels = new Map();
    channelsByPlugin.set(plugin, channels);
    plugin.register(() => disposePluginDiagnostics(plugin));
  }
  let state = channels.get(provider);
  if (!state) {
    state = { blockedUntil: 0 };
    channels.set(provider, state);
  }
  return state;
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


export class BrokerClientDiagnosticsChannel<
  Schema extends BrokerClientDiagnosticSchema,
> {
  private readonly state: ChannelState;

  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly spec: ChannelSpec<Schema>
  ) {
    this.state = channelState(plugin, spec.provider);
  }

  dispose(): void {
    disposePluginDiagnostics(this.plugin);
  }

  async createConnectionOperation(
    vaultId: string,
    connectionId: string,
    provider: BrokerSyncProviderId
  ) {
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
  ) {
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
    if (
      disposedPlugins.has(this.plugin) ||
      operation.provider !== this.spec.provider
    )
      return;
    
    const normalizedEvent = normalizeEvent({
      eventType: event.eventType,
      errorCode: event.errorCode,
      count: event.count,
      occurredAt: new Date().toISOString(),
    });
    if (
      !normalizedEvent ||
      isVaultScopedEvent(normalizedEvent.eventType) !==
        (operation.scope === 'projection')
    )
      return;
    await serialized(this.plugin, async () => {
      try {
        if (disposedPlugins.has(this.plugin)) return;
        const ownerUserId = getTradeProjectionOwnerId(this.plugin);
        if (
          !ownerUserId ||
          !this.plugin.settings.backendIntegration ||
          operation.ownerUserId !== ownerUserId
        )
          return;
        const batch = normalizeBatch(
          {
            ownerUserId,
            schemaVersion: this.spec.schema,
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
            events: [normalizedEvent],
          },
          this.spec.schema
        );
        if (!batch) return;
        const queue = normalizeBrokerClientDiagnosticQueue(
          this.spec.readQueue(),
          this.spec.schema
        );
        const existing = queue.find(
          (candidate) =>
            candidate.ownerUserId === ownerUserId &&
            candidate.operationId === batch.operationId
        );
        if (existing) {
          if (operation.jobId) existing.jobId = batch.jobId;
          const existingEvent = existing.events.find(
            (candidate) => eventKey(candidate) === eventKey(normalizedEvent)
          );
          if (existingEvent) {
            existingEvent.count = Math.min(
              MAX_EVENT_COUNT,
              (existingEvent.count ?? 1) + (normalizedEvent.count ?? 1)
            );
          } else {
            existing.events.push(normalizedEvent);
            existing.events = existing.events.slice(-MAX_EVENTS);
          }
        } else queue.push(batch);
        this.spec.writeQueue(queue.slice(-MAX_QUEUED_OPERATIONS));
        await this.plugin.saveSettings().catch(() => undefined);
      } catch {
        // intentional
      }
    });
    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (
      disposedPlugins.has(this.plugin) ||
      this.state.scheduledFlush !== undefined
    )
      return;
    this.state.scheduledFlush = window.setTimeout(() => {
      delete this.state.scheduledFlush;
      void this.flush();
    }, FLUSH_DEBOUNCE_MS);
  }

  async flush(): Promise<void> {
    if (disposedPlugins.has(this.plugin)) return;
    cancelScheduledFlush(this.state);
    await serialized(this.plugin, async () => {
      try {
        if (
          disposedPlugins.has(this.plugin) ||
          !this.plugin.settings.backendIntegration
        )
          return;
        const ownerUserId = getTradeProjectionOwnerId(this.plugin);
        const rawQueue = this.spec.readQueue();
        const queue = normalizeBrokerClientDiagnosticQueue(
          rawQueue,
          this.spec.schema
        );
        if (JSON.stringify(rawQueue ?? []) !== JSON.stringify(queue)) {
          this.spec.writeQueue(queue);
          await this.plugin.saveSettings().catch(() => undefined);
        }
        
        if (queue.length === 0) return;
        const ownerAuthSessionVersion = ApiClient.getAuthSessionVersion();
        if (
          !ownerUserId ||
          !ApiClient.getAuthToken() ||
          Date.now() < this.state.blockedUntil
        )
          return;
        const retained: BrokerClientDiagnosticBatch<Schema>[] = [];
        let deliveryAvailable = true;
        
        
        for (const batch of queue) {
          if (
            batch.ownerUserId !== ownerUserId ||
            !deliveryAvailable ||
            disposedPlugins.has(this.plugin) ||
            getTradeProjectionOwnerId(this.plugin) !== ownerUserId ||
            ApiClient.getAuthSessionVersion() !== ownerAuthSessionVersion
          ) {
            retained.push(batch);
            continue;
          }
          try {
            await this.spec.submit(payload(batch));
          } catch (error) {
            if (error instanceof ApiError && error.statusCode === 400) continue;
            if (error instanceof ApiError && error.statusCode === 429) {
              this.state.blockedUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS;
            }
            retained.push(batch);
            deliveryAvailable = false;
          }
        }
        this.spec.writeQueue(retained);
        await this.plugin.saveSettings().catch(() => undefined);
      } catch {
        // intentional
      }
    });
  }
}
