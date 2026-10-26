import { ApiClient } from '../../backend/ApiClient';
import {
  agentContractManifest,
  parseAgentRelayMessage,
  type AgentRelayMessage,
  type AgentToolName,
} from '../protocol';
import { isCanonicalNonNilUuid } from '../../../utils/uuid';
import { isCanonicalBase64Url32 } from '../base64Url';

const RELAY_PATH = '/api/v1/agent/relay';
const MAX_HANDSHAKE_BYTES = 32 * 1024;
const MAX_FRAME_BYTES = 11 * 1024 * 1024;
const DEFAULT_HANDSHAKE_TIMEOUT_MS = 10_000;
const SOCKET_OPEN = 1;

type RelayState = 'idle' | 'connecting' | 'ready' | 'stopped';
type RelayErrorCode =
  | 'consumed_ticket'
  | 'contract_mismatch'
  | 'expired_ticket'
  | 'handshake_timeout'
  | 'invalid_input'
  | 'invalid_ticket'
  | 'invalid_url'
  | 'protocol_error'
  | 'revoked_installation'
  | 'runtime_error'
  | 'send_error'
  | 'state_error'
  | 'transport_error'
  | 'unexpected_close'
  | 'unsupported_protocol';

type RelayMessage = AgentRelayMessage;
type RelaySink = (message: RelayMessage) => void | Promise<void>;
type TimerHandle = number;

export interface AgentRelayRuntimeBoundary {
  attachSink(sink: RelaySink): () => void;
  handleFrame(value: unknown): Promise<void>;
  shutdown(): Promise<void>;
}

interface RelaySocket {
  readonly readyState: number;
  readonly bufferedAmount: number;
  binaryType: BinaryType;
  onopen: ((event: Event) => void) | null;
  onmessage: ((event: MessageEvent<unknown>) => void) | null;
  onerror: ((event: Event) => void) | null;
  onclose: ((event: CloseEvent) => void) | null;
  send(data: string): void;
  close(code?: number, reason?: string): void;
}

interface ClientDependencies {
  socketFactory: (url: string) => RelaySocket;
  urlBuilder: () => string;
  now: () => number;
  setTimer: (callback: () => void, delayMs: number) => TimerHandle;
  clearTimer: (handle: TimerHandle) => void;
  handshakeTimeoutMs: number;
}

export interface AgentRelayRunInput {
  ticket: string;
  installation: {
    deviceId: string;
    vaultId: string;
    installationId: string;
  };
  capabilities: readonly AgentToolName[];
}

export interface AgentRelaySnapshot {
  readonly state: RelayState;
}

const SNAPSHOTS: Readonly<Record<RelayState, AgentRelaySnapshot>> = {
  idle: Object.freeze({ state: 'idle' }),
  connecting: Object.freeze({ state: 'connecting' }),
  ready: Object.freeze({ state: 'ready' }),
  stopped: Object.freeze({ state: 'stopped' }),
};

const ERROR_DEFINITIONS: Readonly<
  Record<RelayErrorCode, { message: string; retryable: boolean }>
> = {
  invalid_input: {
    message: 'Agent relay input was invalid.',
    retryable: false,
  },
  invalid_url: {
    message: 'Agent relay endpoint was invalid.',
    retryable: false,
  },
  state_error: {
    message: 'Agent relay client cannot be reused.',
    retryable: false,
  },
  invalid_ticket: { message: 'Relay ticket was invalid.', retryable: false },
  expired_ticket: { message: 'Relay ticket expired.', retryable: false },
  consumed_ticket: {
    message: 'Relay ticket was already used.',
    retryable: false,
  },
  revoked_installation: {
    message: 'Agent installation was revoked.',
    retryable: false,
  },
  unsupported_protocol: {
    message: 'Agent relay protocol is unsupported.',
    retryable: false,
  },
  contract_mismatch: {
    message: 'Agent relay contract is incompatible.',
    retryable: false,
  },
  handshake_timeout: {
    message: 'Agent relay handshake timed out.',
    retryable: true,
  },
  protocol_error: {
    message: 'Agent relay protocol was invalid.',
    retryable: false,
  },
  runtime_error: {
    message: 'Agent runtime failed.',
    retryable: true,
  },
  send_error: { message: 'Agent relay send failed.', retryable: true },
  transport_error: {
    message: 'Agent relay connection failed.',
    retryable: true,
  },
  unexpected_close: {
    message: 'Agent relay connection closed unexpectedly.',
    retryable: true,
  },
};

export class AgentRelayClientError extends Error {
  public readonly code: RelayErrorCode;
  public readonly retryable: boolean;

  constructor(code: RelayErrorCode) {
    const definition = ERROR_DEFINITIONS[code];
    super(definition.message);
    this.name = 'AgentRelayClientError';
    this.code = code;
    this.retryable = definition.retryable;
  }
}

function relayError(code: RelayErrorCode): AgentRelayClientError {
  return new AgentRelayClientError(code);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateTimeout(value: number): number {
  if (!Number.isInteger(value) || value < 1_000 || value > 30_000) {
    throw relayError('invalid_input');
  }
  return value;
}

function buildSocketUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw relayError('invalid_url');
  }
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== RELAY_PATH
  ) {
    throw relayError('invalid_url');
  }
  if (url.protocol === 'https:') {
    url.protocol = 'wss:';
  } else if (
    url.protocol === 'http:' &&
    (url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      url.hostname === '[::1]')
  ) {
    url.protocol = 'ws:';
  } else {
    throw relayError('invalid_url');
  }
  return url.toString();
}

function validateInput(input: AgentRelayRunInput): {
  installation: AgentRelayRunInput['installation'];
  capabilities: AgentToolName[];
} {
  if (
    !isCanonicalBase64Url32(input.ticket) ||
    !isCanonicalNonNilUuid(input.installation.deviceId) ||
    !isCanonicalNonNilUuid(input.installation.vaultId) ||
    !isCanonicalNonNilUuid(input.installation.installationId) ||
    input.capabilities.length > 50
  ) {
    throw relayError('invalid_input');
  }
  const knownTools: ReadonlySet<string> = new Set(agentContractManifest.tools);
  const capabilities = [...input.capabilities];
  if (
    new Set(capabilities).size !== capabilities.length ||
    capabilities.some((tool) => !knownTools.has(tool))
  ) {
    throw relayError('invalid_input');
  }
  return {
    installation: { ...input.installation },
    capabilities,
  };
}

function defaultSocketFactory(url: string): RelaySocket {
  return new WebSocket(url);
}

function defaultUrlBuilder(): string {
  return ApiClient.buildUrl(RELAY_PATH);
}

function safeParseText(
  text: string,
  maxBytes: number
): Record<string, unknown> {
  if (
    text.length === 0 ||
    new TextEncoder().encode(text).byteLength > maxBytes
  ) {
    throw relayError('protocol_error');
  }
  try {
    const value: unknown = JSON.parse(text);
    if (!isRecord(value)) throw relayError('protocol_error');
    return value;
  } catch (error) {
    if (error instanceof AgentRelayClientError) throw error;
    throw relayError('protocol_error');
  }
}

function inspectContract(value: Record<string, unknown>): void {
  if (
    typeof value.protocol_version === 'number' &&
    Number.isSafeInteger(value.protocol_version) &&
    value.protocol_version > 0 &&
    value.protocol_version !== agentContractManifest.protocol_major
  ) {
    throw relayError('unsupported_protocol');
  }
  if (
    typeof value.contract_digest === 'string' &&
    /^sha256:[0-9a-f]{64}$/.test(value.contract_digest) &&
    value.contract_digest !== agentContractManifest.digest
  ) {
    throw relayError('contract_mismatch');
  }
}

function parseInbound(text: string, maxBytes: number): RelayMessage {
  const value = safeParseText(text, maxBytes);
  const isToolFrame =
    value.type === 'tool.invoke' || value.type === 'tool.cancel';
  if (!isToolFrame) inspectContract(value);
  let parseValue = value;
  if (
    isToolFrame &&
    typeof value.protocol_version === 'number' &&
    Number.isSafeInteger(value.protocol_version) &&
    value.protocol_version > 0 &&
    value.protocol_version !== agentContractManifest.protocol_major
  ) {
    parseValue = {
      ...value,
      protocol_version: agentContractManifest.protocol_major,
      contract_digest:
        value.contract_digest === agentContractManifest.digest
          ? `sha256:${'0'.repeat(64)}`
          : value.contract_digest,
    };
  }
  try {
    return parseAgentRelayMessage(parseValue);
  } catch {
    throw relayError('protocol_error');
  }
}

function rejectionError(
  reason: Extract<RelayMessage, { type: 'relay.rejected' }>['reason']
): AgentRelayClientError {
  return relayError(reason);
}

export class AgentRelayClient {
  private readonly dependencies: ClientDependencies;
  private readonly listeners = new Set<() => void>();
  private snapshot = SNAPSHOTS.idle;
  private socket: RelaySocket | undefined;
  private detachSink: (() => void) | undefined;
  private handshakeTimer: TimerHandle | undefined;
  private heartbeatTimer: TimerHandle | undefined;
  private sendQueue: Promise<void> = Promise.resolve();
  private resolveRun: (() => void) | undefined;
  private rejectRun: ((error: AgentRelayClientError) => void) | undefined;
  private installation:
    | Pick<AgentRelayRunInput['installation'], 'vaultId' | 'installationId'>
    | undefined;
  private started = false;
  private ready = false;
  private handshakeAccepted = false;
  private terminating = false;
  private terminationPromise: Promise<void> | undefined;
  private terminalError: AgentRelayClientError | undefined;
  private socketClosed = false;
  private sinkWritesAllowed = false;
  private sendFailed = false;

  constructor(
    private readonly runtime: AgentRelayRuntimeBoundary,
    dependencies: Partial<ClientDependencies> = {}
  ) {
    this.dependencies = {
      socketFactory: dependencies.socketFactory ?? defaultSocketFactory,
      urlBuilder: dependencies.urlBuilder ?? defaultUrlBuilder,
      now: dependencies.now ?? Date.now,
      setTimer:
        dependencies.setTimer ??
        ((callback, delayMs) => window.setTimeout(callback, delayMs)),
      clearTimer:
        dependencies.clearTimer ?? ((handle) => window.clearTimeout(handle)),
      handshakeTimeoutMs: validateTimeout(
        dependencies.handshakeTimeoutMs ?? DEFAULT_HANDSHAKE_TIMEOUT_MS
      ),
    };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getSnapshot(): AgentRelaySnapshot {
    return this.snapshot;
  }

  public run(input: AgentRelayRunInput): Promise<void> {
    if (this.started) return Promise.reject(relayError('state_error'));
    this.started = true;
    const runPromise = new Promise<void>((resolve, reject) => {
      this.resolveRun = resolve;
      this.rejectRun = reject;
    });

    let validated: ReturnType<typeof validateInput>;
    let socketUrl: string;
    try {
      validated = validateInput(input);
      socketUrl = buildSocketUrl(this.dependencies.urlBuilder());
    } catch (error) {
      const safeError =
        error instanceof AgentRelayClientError
          ? error
          : relayError('invalid_url');
      void this.terminate(safeError, false);
      return runPromise;
    }

    this.installation = {
      vaultId: validated.installation.vaultId,
      installationId: validated.installation.installationId,
    };
    this.setSnapshot('connecting');

    try {
      this.socket = this.dependencies.socketFactory(socketUrl);
      this.socket.binaryType = 'arraybuffer';
    } catch {
      void this.terminate(relayError('transport_error'), false);
      return runPromise;
    }

    const ticket = input.ticket;
    const installationId = validated.installation.installationId;
    const capabilities = validated.capabilities;
    this.socket.onopen = () => {
      if (this.terminating) return;
      const hello = {
        type: 'relay.hello',
        protocol_version: agentContractManifest.protocol_major,
        contract_digest: agentContractManifest.digest,
        ticket,
        installation_id: installationId,
        capabilities: [...capabilities],
      };
      this.socket!.onopen = null;
      void this.sendClientMessage(hello, ['relay.hello']).catch(
        (error: unknown) => {
          void this.terminate(
            error instanceof AgentRelayClientError
              ? error
              : relayError('send_error'),
            false
          );
        }
      );
    };
    this.socket.onmessage = (event) => this.receive(event.data);
    this.socket.onerror = () => {
      void this.terminate(relayError('transport_error'), false);
    };
    this.socket.onclose = () => {
      if (!this.terminating) {
        void this.terminate(relayError('unexpected_close'), false);
      }
    };
    this.handshakeTimer = this.dependencies.setTimer(() => {
      void this.terminate(relayError('handshake_timeout'), false);
    }, this.dependencies.handshakeTimeoutMs);
    return runPromise;
  }

  public async shutdown(): Promise<void> {
    if (!this.started) {
      this.started = true;
      await this.terminate(undefined, true);
    } else {
      await this.terminate(undefined, true);
    }
    if (this.terminalError !== undefined) throw this.terminalError;
  }

  private receive(data: unknown): void {
    if (this.terminating) return;
    if (typeof data !== 'string') {
      void this.terminate(relayError('protocol_error'), false);
      return;
    }
    let message: RelayMessage;
    try {
      message = parseInbound(
        data,
        this.ready ? MAX_FRAME_BYTES : MAX_HANDSHAKE_BYTES
      );
    } catch (error) {
      void this.terminate(
        error instanceof AgentRelayClientError
          ? error
          : relayError('protocol_error'),
        false
      );
      return;
    }
    if (!this.ready) {
      if (this.handshakeAccepted) {
        void this.terminate(relayError('protocol_error'), false);
        return;
      }
      void this.handleHandshake(message);
      return;
    }
    this.handleReadyMessage(message);
  }

  private async handleHandshake(message: RelayMessage): Promise<void> {
    if (message.type === 'relay.rejected') {
      await this.terminate(rejectionError(message.reason), false);
      return;
    }
    if (message.type !== 'relay.ready') {
      await this.terminate(relayError('protocol_error'), false);
      return;
    }
    this.handshakeAccepted = true;
    this.clearHandshakeTimer();
    try {
      this.detachSink = this.runtime.attachSink((outbound) =>
        this.sendSinkMessage(outbound)
      );
      this.sinkWritesAllowed = true;
    } catch {
      await this.terminate(relayError('runtime_error'), false);
      return;
    }
    try {
      await this.sendStatus('ready');
    } catch (error) {
      await this.terminate(
        error instanceof AgentRelayClientError
          ? error
          : relayError('send_error'),
        false
      );
      return;
    }
    if (this.terminating) return;
    this.ready = true;
    this.setSnapshot('ready');
    this.scheduleHeartbeat(message.heartbeat_seconds);
  }

  private handleReadyMessage(message: RelayMessage): void {
    if (message.type === 'relay.heartbeat') return;
    if (message.type !== 'tool.invoke' && message.type !== 'tool.cancel') {
      void this.terminate(relayError('protocol_error'), false);
      return;
    }
    if (
      message.type === 'tool.invoke' &&
      (message.installation_id !== this.installation!.installationId ||
        message.vault_id !== this.installation!.vaultId)
    ) {
      void this.terminate(relayError('protocol_error'), false);
      return;
    }
    void this.runtime.handleFrame(message).catch(() => {
      void this.terminate(relayError('runtime_error'), false);
    });
  }

  private sendSinkMessage(message: RelayMessage): Promise<void> {
    if (!this.sinkWritesAllowed)
      return Promise.reject(relayError('send_error'));
    return this.sendClientMessage(message, ['tool.result', 'tool.error']).catch(
      (error: unknown) => {
        const safeError =
          error instanceof AgentRelayClientError
            ? error
            : relayError('send_error');
        void this.terminate(safeError, false);
        throw safeError;
      }
    );
  }

  private sendStatus(state: 'ready' | 'shutting_down'): Promise<void> {
    return this.sendClientMessage(
      {
        type: 'runtime.status',
        protocol_version: agentContractManifest.protocol_major,
        contract_digest: agentContractManifest.digest,
        state,
      },
      ['runtime.status'],
      state === 'shutting_down'
    );
  }

  private sendHeartbeat(): Promise<void> {
    let sentAt: string;
    try {
      sentAt = new Date(this.dependencies.now()).toISOString();
    } catch {
      return Promise.reject(relayError('runtime_error'));
    }
    return this.sendClientMessage(
      {
        type: 'relay.heartbeat',
        protocol_version: agentContractManifest.protocol_major,
        contract_digest: agentContractManifest.digest,
        sent_at: sentAt,
      },
      ['relay.heartbeat']
    );
  }

  private sendClientMessage(
    value: unknown,
    allowedTypes: readonly RelayMessage['type'][],
    allowDuringTermination = false
  ): Promise<void> {
    if (this.sendFailed || (this.terminating && !allowDuringTermination)) {
      return Promise.reject(relayError('send_error'));
    }
    let message: RelayMessage;
    try {
      message = parseAgentRelayMessage(value);
    } catch {
      return Promise.reject(relayError('protocol_error'));
    }
    if (!allowedTypes.includes(message.type)) {
      return Promise.reject(relayError('protocol_error'));
    }
    const frame = JSON.stringify(message);
    const frameBytes = new TextEncoder().encode(frame).byteLength;
    if (frameBytes > MAX_FRAME_BYTES) {
      this.latchSendFailure();
      return Promise.reject(relayError('send_error'));
    }
    const queued = this.sendQueue.then(() => {
      if (this.sendFailed || (this.terminating && !allowDuringTermination)) {
        this.latchSendFailure();
        throw relayError('send_error');
      }
      const socket = this.socket;
      if (
        socket === undefined ||
        socket.readyState !== SOCKET_OPEN ||
        socket.bufferedAmount + frameBytes > MAX_FRAME_BYTES
      ) {
        this.latchSendFailure();
        throw relayError('send_error');
      }
      try {
        socket.send(frame);
      } catch {
        this.latchSendFailure();
        throw relayError('send_error');
      }
    });
    this.sendQueue = queued.catch(() => undefined);
    return queued;
  }

  private scheduleHeartbeat(seconds: number): void {
    this.heartbeatTimer = this.dependencies.setTimer(() => {
      this.heartbeatTimer = undefined;
      void this.runHeartbeat(seconds);
    }, seconds * 1000);
  }

  private async runHeartbeat(seconds: number): Promise<void> {
    if (this.terminating || !this.ready) return;
    try {
      await this.sendHeartbeat();
      await this.sendStatus('ready');
    } catch (error) {
      await this.terminate(
        error instanceof AgentRelayClientError
          ? error
          : relayError('send_error'),
        false
      );
      return;
    }
    if (!this.terminating) this.scheduleHeartbeat(seconds);
  }

  private terminate(
    error: AgentRelayClientError | undefined,
    local: boolean
  ): Promise<void> {
    if (this.terminationPromise !== undefined) return this.terminationPromise;
    this.terminating = true;
    this.sinkWritesAllowed = false;
    this.terminationPromise = this.performTermination(error, local);
    return this.terminationPromise;
  }

  private latchSendFailure(): void {
    this.sendFailed = true;
    this.sinkWritesAllowed = false;
  }

  private async performTermination(
    error: AgentRelayClientError | undefined,
    local: boolean
  ): Promise<void> {
    this.clearHandshakeTimer();
    this.clearHeartbeatTimer();

    if (local && this.ready) {
      try {
        await this.sendStatus('shutting_down');
      } catch {
        error = relayError('send_error');
        local = false;
      }
    }
    if (!local) this.sinkWritesAllowed = false;
    let runtimeShutdownFailed = false;
    try {
      await this.runtime.shutdown();
    } catch {
      runtimeShutdownFailed = true;
    }
    await this.sendQueue;
    if (local && this.sendFailed) {
      error = relayError('send_error');
      local = false;
    } else if (local && runtimeShutdownFailed) {
      error = relayError('runtime_error');
      local = false;
    }
    if (!local) this.sinkWritesAllowed = false;
    this.sinkWritesAllowed = false;
    try {
      this.detachSink?.();
    } catch {
      if (local) {
        error = relayError('runtime_error');
        local = false;
      }
    }
    this.detachSink = undefined;
    this.releaseSocket(local ? 1000 : this.closeCode(error), local);
    this.ready = false;
    this.installation = undefined;
    this.setSnapshot('stopped');
    if (local) {
      this.terminalError = undefined;
      this.resolveRun?.();
    } else {
      const terminalError = error ?? relayError('runtime_error');
      this.terminalError = terminalError;
      this.rejectRun?.(terminalError);
    }
    this.resolveRun = undefined;
    this.rejectRun = undefined;
  }

  private closeCode(error: AgentRelayClientError | undefined): number {
    return error?.code === 'protocol_error' ||
      error?.code === 'unsupported_protocol' ||
      error?.code === 'contract_mismatch'
      ? 1002
      : 1011;
  }

  private releaseSocket(code: number, local: boolean): void {
    const socket = this.socket;
    this.socket = undefined;
    if (socket === undefined) return;
    socket.onopen = null;
    socket.onmessage = null;
    socket.onerror = null;
    socket.onclose = null;
    if (this.socketClosed) return;
    this.socketClosed = true;
    try {
      socket.close(
        code,
        local
          ? 'client shutdown'
          : code === 1002
            ? 'protocol error'
            : 'internal error'
      );
    } catch {
      // intentional
    }
  }

  private clearHandshakeTimer(): void {
    if (this.handshakeTimer !== undefined) {
      this.dependencies.clearTimer(this.handshakeTimer);
      this.handshakeTimer = undefined;
    }
  }

  private clearHeartbeatTimer(): void {
    if (this.heartbeatTimer !== undefined) {
      this.dependencies.clearTimer(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  private setSnapshot(state: RelayState): void {
    const next = SNAPSHOTS[state];
    if (this.snapshot === next) return;
    this.snapshot = next;
    for (const listener of this.listeners) {
      try {
        listener();
      } catch {
        // intentional
      }
    }
  }
}
