import { generateUUID } from '../../../utils/uuid';
import { ApiError } from '../../../types/errors';
import {
  isBrokerSyncJobInProgress,
  tradovateConnectionCanSync,
  tradovateConnectionRequiresWebsite,
  type TradeProjectionSyncResult,
  type TradovateConnection,
  type TradovateConnections,
} from '../../tradeSync/types';

const DEFAULT_MAX_OPERATIONS = 32;
const DEFAULT_TERMINAL_TTL_MS = 15 * 60 * 1000;
const MAX_CONNECTIONS = 20;
const MAX_LABEL_LENGTH = 120;
const OPAQUE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const LABEL_PATTERN = /^\S(?:.*\S)?$/;

type AgentIntegrationErrorCode =
  | 'invalid_request'
  | 'not_found'
  | 'conflict'
  | 'permission_denied'
  | 'offline'
  | 'limit_exceeded'
  | 'unsupported_capability'
  | 'integration_unavailable';

const RETRYABLE_CODES: ReadonlySet<AgentIntegrationErrorCode> = new Set([
  'conflict',
  'offline',
  'integration_unavailable',
]);

export class AgentIntegrationError extends Error {
  readonly code: AgentIntegrationErrorCode;
  readonly retryable: boolean;
  
  readonly field?: '/connection_id';

  constructor(code: AgentIntegrationErrorCode, field?: '/connection_id') {
    super('Agent integration failed.');
    this.name = 'AgentIntegrationError';
    this.code = code;
    this.retryable = RETRYABLE_CODES.has(code);
    if (field !== undefined) this.field = field;
  }
}

interface AgentIntegrationDependencies {
  getAuthToken(): string | null;
  isOnline(): boolean;
  getTradovateConnections(): Promise<TradovateConnections>;
  syncConnection(connectionId: string): Promise<TradeProjectionSyncResult>;
  openImportWorkflow(): Promise<void>;
  
  importEconomicCalendarWeek(
    weekDate: Date
  ): Promise<EconomicCalendarWeekImport>;
  now?: () => number;
  idFactory?: () => string;
  maxOperationsPerInstallation?: number;
  terminalTtlMs?: number;
}


type EconomicCalendarWeekImport =
  | {
      status: 'ok';
      
      weekStart: string;
      importedCount: number;
      updatedCount: number;
      skippedCount: number;
    }
  | { status: 'not_entitled' | 'signed_out' | 'offline' | 'error' };

export type AgentIntegrationConnectionStatus =
  | {
      connectionId: string;
      label?: string;
      state: 'running';
      operationId: string;
    }
  | {
      connectionId: string;
      label?: string;
      state: 'idle' | 'requires_attention';
    };

interface AgentIntegrationInspectStatus {
  state: 'idle' | 'running' | 'requires_attention';
  connections: AgentIntegrationConnectionStatus[];
}

interface AgentIntegrationAccepted {
  operationId: string;
  cached: boolean;
}

interface AgentIntegrationOperationStatus {
  operationId: string;
  integration: 'tradovate';
  state: 'running' | 'succeeded' | 'failed' | 'requires_attention';
}

type OperationState = AgentIntegrationOperationStatus['state'];

interface OperationRecord {
  operationId: string;
  connectionId: string;
  binding: string;
  idempotencyKey: string;
  state: OperationState;
  expiresAt: number | null;
  accessSequence: number;
}

interface IdempotencyRecord {
  binding: string;
  operation: OperationRecord;
}

interface InstallationMemory {
  operations: Map<string, OperationRecord>;
  flights: Map<string, string>;
  idempotency: Map<string, IdempotencyRecord>;
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

function isOpaqueId(value: string): boolean {
  return value.length <= 128 && OPAQUE_ID_PATTERN.test(value);
}

function projectLabel(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return undefined;
  const capped = Array.from(trimmed)
    .slice(0, MAX_LABEL_LENGTH)
    .join('')
    .trimEnd();
  if (capped.length === 0 || !LABEL_PATTERN.test(capped)) return undefined;
  return capped;
}

function startSyncBinding(connectionId: string): string {
  return `start_sync:tradovate:${connectionId}`;
}

function connectionNeedsAttention(connection: TradovateConnection): boolean {
  if (!tradovateConnectionCanSync(connection)) return true;
  const lastErrorCode = connection.lastErrorCode?.trim();
  return Boolean(lastErrorCode) || connection.reconciliationIssueCount > 0;
}

function startSyncRejection(
  connection: TradovateConnection
): AgentIntegrationError {
  if (
    tradovateConnectionRequiresWebsite(connection) &&
    connection.status !== 'pending'
  ) {
    
    return new AgentIntegrationError('permission_denied', '/connection_id');
  }
  return new AgentIntegrationError('integration_unavailable', '/connection_id');
}

function httpStatusCode(error: ApiError): AgentIntegrationErrorCode {
  switch (error.statusCode) {
    case 401:
    case 402:
    case 403:
      return 'permission_denied';
    case 404:
      return 'not_found';
    case 409:
      return 'conflict';
    default:
      return 'integration_unavailable';
  }
}

function mapIntegrationBackendError(error: unknown): AgentIntegrationError {
  if (error instanceof AgentIntegrationError) return error;
  if (error instanceof ApiError) {
    return new AgentIntegrationError(httpStatusCode(error));
  }
  return new AgentIntegrationError('integration_unavailable');
}

function aggregateConnectionState(
  connections: readonly AgentIntegrationConnectionStatus[]
): AgentIntegrationInspectStatus['state'] {
  let running = false;
  let attention = false;
  for (const connection of connections) {
    if (connection.state === 'running') running = true;
    else if (connection.state === 'requires_attention') attention = true;
  }
  if (running) return 'running';
  if (attention) return 'requires_attention';
  return 'idle';
}

export class AgentIntegrationService {
  private disposed = false;
  private accessSequence = 0;
  private readonly now: () => number;
  private readonly idFactory: () => string;
  private readonly maxOperations: number;
  private readonly terminalTtlMs: number;
  private readonly installations = new Map<string, InstallationMemory>();
  private readonly activeConnections = new Set<string>();
  private readonly locks = new Map<string, Promise<void>>();

  constructor(private readonly dependencies: AgentIntegrationDependencies) {
    this.now = dependencies.now ?? Date.now;
    this.idFactory =
      dependencies.idFactory ?? (() => `integration_${generateUUID()}`);
    this.maxOperations =
      dependencies.maxOperationsPerInstallation ?? DEFAULT_MAX_OPERATIONS;
    this.terminalTtlMs = dependencies.terminalTtlMs ?? DEFAULT_TERMINAL_TTL_MS;
    if (
      !Number.isSafeInteger(this.maxOperations) ||
      this.maxOperations <= 0 ||
      !Number.isSafeInteger(this.terminalTtlMs) ||
      this.terminalTtlMs <= 0
    ) {
      throw new AgentIntegrationError('invalid_request');
    }
  }

  async inspectTradovateStatus(input: {
    installationId: string;
    signal: AbortSignal;
  }): Promise<AgentIntegrationInspectStatus> {
    this.throwIfDisposed();
    this.validateInstallationId(input.installationId);
    throwIfAborted(input.signal);
    this.requirePreflight();
    throwIfAborted(input.signal);

    let snapshot: TradovateConnections;
    try {
      snapshot = await this.dependencies.getTradovateConnections();
    } catch (error) {
      throwIfAborted(input.signal);
      throw mapIntegrationBackendError(error);
    }
    throwIfAborted(input.signal);
    this.throwIfDisposed();
    if (snapshot.connections.length > MAX_CONNECTIONS) {
      throw new AgentIntegrationError('limit_exceeded');
    }

    const installation = this.installations.get(input.installationId);
    const flights = installation?.flights;
    const connections: AgentIntegrationConnectionStatus[] = [];
    for (const connection of snapshot.connections) {
      if (!isOpaqueId(connection.id)) {
        throw new AgentIntegrationError('integration_unavailable');
      }
      const label = projectLabel(connection.displayName);
      const activeOperationId = flights?.get(connection.id);
      if (activeOperationId !== undefined) {
        connections.push({
          connectionId: connection.id,
          ...(label === undefined ? {} : { label }),
          state: 'running',
          operationId: activeOperationId,
        });
        continue;
      }
      connections.push({
        connectionId: connection.id,
        ...(label === undefined ? {} : { label }),
        state: connectionNeedsAttention(connection)
          ? 'requires_attention'
          : 'idle',
      });
    }

    return {
      state: aggregateConnectionState(connections),
      connections,
    };
  }

  async startTradovateSync(input: {
    installationId: string;
    connectionId: string;
    idempotencyKey: string;
    signal: AbortSignal;
  }): Promise<AgentIntegrationAccepted> {
    this.throwIfDisposed();
    this.validateInstallationId(input.installationId);
    if (!isOpaqueId(input.connectionId)) {
      throw new AgentIntegrationError('invalid_request');
    }
    throwIfAborted(input.signal);

    return this.withInstallationLock(input.installationId, async () => {
      throwIfAborted(input.signal);
      this.throwIfDisposed();
      const binding = startSyncBinding(input.connectionId);
      const installation = this.installations.get(input.installationId);
      if (installation !== undefined) {
        this.purgeExpired(
          input.installationId,
          installation,
          this.currentTime()
        );
        const existing = installation.idempotency.get(input.idempotencyKey);
        if (existing !== undefined) {
          if (existing.binding !== binding) {
            throw new AgentIntegrationError('invalid_request');
          }
          this.touch(existing.operation);
          return {
            operationId: existing.operation.operationId,
            cached: true,
          };
        }
        const activeOperationId = installation.flights.get(input.connectionId);
        if (activeOperationId !== undefined) {
          throw new AgentIntegrationError('conflict');
        }
      }

      this.requirePreflight();
      throwIfAborted(input.signal);

      let snapshot: TradovateConnections;
      try {
        snapshot = await this.dependencies.getTradovateConnections();
      } catch (error) {
        throwIfAborted(input.signal);
        throw mapIntegrationBackendError(error);
      }
      throwIfAborted(input.signal);
      this.throwIfDisposed();

      const found = snapshot.connections.find(
        (connection) => connection.id === input.connectionId
      );
      if (found === undefined) {
        throw new AgentIntegrationError('not_found');
      }
      if (found.jobs.some((job) => isBrokerSyncJobInProgress(job.status))) {
        throw new AgentIntegrationError('conflict');
      }
      if (!tradovateConnectionCanSync(found)) {
        throw startSyncRejection(found);
      }
      if (this.activeConnections.has(input.connectionId)) {
        throw new AgentIntegrationError('conflict');
      }

      const target = this.ensureInstallation(input.installationId);
      this.prepareCapacity(target);
      const operationId = this.createOperationId();
      const record: OperationRecord = {
        operationId,
        connectionId: input.connectionId,
        binding,
        idempotencyKey: input.idempotencyKey,
        state: 'running',
        expiresAt: null,
        accessSequence: this.nextAccessSequence(),
      };
      target.operations.set(operationId, record);
      target.flights.set(input.connectionId, operationId);
      this.activeConnections.add(input.connectionId);
      target.idempotency.set(input.idempotencyKey, {
        binding,
        operation: record,
      });
      this.launchDetached(
        input.installationId,
        operationId,
        input.connectionId
      );
      return { operationId, cached: false };
    });
  }

  getOperationStatus(input: {
    installationId: string;
    operationId: string;
  }): AgentIntegrationOperationStatus {
    this.throwIfDisposed();
    this.validateInstallationId(input.installationId);
    if (!isOpaqueId(input.operationId)) {
      throw new AgentIntegrationError('not_found');
    }
    const installation = this.installations.get(input.installationId);
    if (installation === undefined) {
      throw new AgentIntegrationError('not_found');
    }
    this.purgeExpired(input.installationId, installation, this.currentTime());
    const record = installation.operations.get(input.operationId);
    if (record === undefined) {
      throw new AgentIntegrationError('not_found');
    }
    this.touch(record);
    return {
      operationId: record.operationId,
      integration: 'tradovate',
      state: record.state,
    };
  }

  async openImportWorkflow(signal: AbortSignal): Promise<void> {
    this.throwIfDisposed();
    throwIfAborted(signal);
    try {
      await this.dependencies.openImportWorkflow();
    } catch (error) {
      throwIfAborted(signal);
      throw mapIntegrationBackendError(error);
    }
    throwIfAborted(signal);
  }

  
  async importEconomicCalendar(input: {
    week: string;
    signal: AbortSignal;
  }): Promise<Extract<EconomicCalendarWeekImport, { status: 'ok' }>> {
    this.throwIfDisposed();
    throwIfAborted(input.signal);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.week);
    const weekDate = match
      ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
      : null;
    if (
      !match ||
      !weekDate ||
      weekDate.getFullYear() !== Number(match[1]) ||
      weekDate.getMonth() !== Number(match[2]) - 1 ||
      weekDate.getDate() !== Number(match[3])
    ) {
      throw new AgentIntegrationError('invalid_request');
    }
    this.requirePreflight();
    let result: EconomicCalendarWeekImport;
    try {
      
      
      result = await this.dependencies.importEconomicCalendarWeek(weekDate);
    } catch (error) {
      throwIfAborted(input.signal);
      throw mapIntegrationBackendError(error);
    }
    throwIfAborted(input.signal);
    switch (result.status) {
      case 'ok':
        return result;
      case 'not_entitled':
      case 'signed_out':
        throw new AgentIntegrationError('permission_denied');
      case 'offline':
        throw new AgentIntegrationError('offline');
      default:
        throw new AgentIntegrationError('integration_unavailable');
    }
  }

  clear(): void {
    this.disposed = true;
    this.installations.clear();
    this.locks.clear();
    this.accessSequence = 0;
  }

  private launchDetached(
    installationId: string,
    operationId: string,
    connectionId: string
  ): void {
    void this.runDetached(installationId, operationId, connectionId);
  }

  private async runDetached(
    installationId: string,
    operationId: string,
    connectionId: string
  ): Promise<void> {
    try {
      const result = await this.dependencies.syncConnection(connectionId);
      this.settle(installationId, operationId, this.stateFromResult(result));
    } catch {
      this.settle(installationId, operationId, 'failed');
    }
  }

  private stateFromResult(result: TradeProjectionSyncResult): OperationState {
    if (
      result.partial === true ||
      result.failedCount > 0 ||
      result.pendingCount > 0
    ) {
      return 'requires_attention';
    }
    if (!this.isAuthorized()) return 'failed';
    return 'succeeded';
  }

  private settle(
    installationId: string,
    operationId: string,
    state: OperationState
  ): void {
    if (this.disposed) return;
    const installation = this.installations.get(installationId);
    if (installation === undefined) return;
    const record = installation.operations.get(operationId);
    if (record === undefined || record.state !== 'running') return;
    record.state = state;
    record.expiresAt = this.currentTime() + this.terminalTtlMs;
    record.accessSequence = this.nextAccessSequence();
    if (installation.flights.get(record.connectionId) === operationId) {
      installation.flights.delete(record.connectionId);
    }
    this.activeConnections.delete(record.connectionId);
  }

  private requirePreflight(): void {
    if (!this.dependencies.isOnline()) {
      throw new AgentIntegrationError('offline');
    }
    if (!this.isAuthorized()) {
      throw new AgentIntegrationError('permission_denied');
    }
  }

  private isAuthorized(): boolean {
    return Boolean(this.dependencies.getAuthToken());
  }

  private async withInstallationLock<T>(
    installationId: string,
    fn: () => Promise<T>
  ): Promise<T> {
    this.throwIfDisposed();
    const previous = this.locks.get(installationId) ?? Promise.resolve();
    let release!: () => void;
    const current = new Promise<void>((resolve) => {
      release = resolve;
    });
    const tail = previous.then(
      () => current,
      () => current
    );
    this.locks.set(installationId, tail);
    try {
      await previous;
      this.throwIfDisposed();
      return await fn();
    } finally {
      release();
      if (this.locks.get(installationId) === tail) {
        this.locks.delete(installationId);
      }
    }
  }

  private ensureInstallation(installationId: string): InstallationMemory {
    const existing = this.installations.get(installationId);
    if (existing !== undefined) return existing;
    const created: InstallationMemory = {
      operations: new Map(),
      flights: new Map(),
      idempotency: new Map(),
    };
    this.installations.set(installationId, created);
    return created;
  }

  private prepareCapacity(installation: InstallationMemory): void {
    if (installation.operations.size < this.maxOperations) return;
    if (!this.evictLeastRecentTerminal(installation)) {
      throw new AgentIntegrationError('limit_exceeded');
    }
  }

  private evictLeastRecentTerminal(installation: InstallationMemory): boolean {
    let leastRecent: OperationRecord | undefined;
    for (const record of installation.operations.values()) {
      if (record.state === 'running') continue;
      if (
        leastRecent === undefined ||
        record.accessSequence < leastRecent.accessSequence
      ) {
        leastRecent = record;
      }
    }
    if (leastRecent === undefined) return false;
    this.removeOperation(installation, leastRecent);
    return true;
  }

  private purgeExpired(
    installationId: string,
    installation: InstallationMemory,
    now: number
  ): void {
    for (const record of [...installation.operations.values()]) {
      if (
        record.state !== 'running' &&
        record.expiresAt !== null &&
        now >= record.expiresAt
      ) {
        this.removeOperation(installation, record);
      }
    }
    this.maybeForgetInstallation(installationId, installation);
  }

  private removeOperation(
    installation: InstallationMemory,
    record: OperationRecord
  ): void {
    installation.operations.delete(record.operationId);
    const idempotency = installation.idempotency.get(record.idempotencyKey);
    if (idempotency?.operation === record) {
      installation.idempotency.delete(record.idempotencyKey);
    }
    if (installation.flights.get(record.connectionId) === record.operationId) {
      installation.flights.delete(record.connectionId);
    }
  }

  private maybeForgetInstallation(
    installationId: string,
    installation: InstallationMemory
  ): void {
    if (
      installation.operations.size === 0 &&
      installation.flights.size === 0 &&
      installation.idempotency.size === 0
    ) {
      this.installations.delete(installationId);
    }
  }

  private createOperationId(): string {
    const operationId = this.idFactory();
    if (!isOpaqueId(operationId)) {
      throw new AgentIntegrationError('invalid_request');
    }
    for (const installation of this.installations.values()) {
      if (installation.operations.has(operationId)) {
        throw new AgentIntegrationError('invalid_request');
      }
    }
    return operationId;
  }

  private touch(record: OperationRecord): void {
    record.accessSequence = this.nextAccessSequence();
  }

  private currentTime(): number {
    const now = this.now();
    if (!Number.isFinite(now)) {
      throw new AgentIntegrationError('invalid_request');
    }
    return now;
  }

  private nextAccessSequence(): number {
    this.accessSequence += 1;
    return this.accessSequence;
  }

  private validateInstallationId(installationId: string): void {
    if (typeof installationId !== 'string' || installationId.length === 0) {
      throw new AgentIntegrationError('invalid_request');
    }
  }

  private throwIfDisposed(): void {
    if (this.disposed) {
      throw new AgentIntegrationError('integration_unavailable');
    }
  }
}
