import type JournalitPlugin from '../../../main';
import { Platform } from 'obsidian';
import { AgentRuntimeService } from '../AgentRuntimeService';
import { AgentToolRegistry } from '../AgentToolRegistry';
import { eventBus } from '../../events';
import { BackendSecretStorage } from '../../backend/BackendSecretStorage';
import { ApiClient } from '../../backend/ApiClient';
import { AgentInstallationIdentityService } from '../registration/AgentInstallationIdentityService';
import {
  AgentRelayClient,
  AgentRelayClientError,
  type AgentRelayRuntimeBoundary,
} from './AgentRelayClient';
import {
  AgentRelayTicketClientError,
  type AgentRelayTicketClient,
} from './AgentRelayTicketClient';

type TimerHandle = number;
type SessionStatus =
  | 'stopped'
  | 'disabled'
  | 'installation_required'
  | 'authentication_required'
  | 'background'
  | 'offline'
  | 'connecting'
  | 'connected'
  | 'retry_wait'
  | 'blocked';

export type AgentRelayBlockedReason =
  | 'installation_inactive'
  | 'installation_revoked'
  | 'protocol_incompatible'
  | 'relay_protocol_error'
  | 'local_configuration';

export type AgentRelaySessionSnapshot =
  | Readonly<{ status: Exclude<SessionStatus, 'blocked'> }>
  | Readonly<{ status: 'blocked'; reason: AgentRelayBlockedReason }>;

type Installation = NonNullable<
  JournalitPlugin['settings']['agentAccess']['installation']
>;

type ExecutionVisibility = 'unrestricted' | 'foreground' | 'background';

interface RelayClientBoundary {
  subscribe(listener: () => void): () => void;
  getSnapshot(): {
    readonly state: 'idle' | 'connecting' | 'ready' | 'stopped';
  };
  run(input: {
    ticket: string;
    installation: Installation;
    capabilities: ReturnType<AgentToolRegistry['listCapabilities']>;
  }): Promise<void>;
  shutdown(): Promise<void>;
}

interface SessionDependencies {
  hasAuthentication(plugin: JournalitPlugin): boolean;
  hasInstallationBinding(installation: Installation): boolean;
  isOnline(): boolean;
  readExecutionVisibility(): ExecutionVisibility;
  subscribeToSettingsChanges(listener: (section?: string) => void): () => void;
  subscribeToAuthenticationChanges(listener: () => void): () => void;
  subscribeToNetworkChanges(listener: () => void): () => void;
  subscribeToExecutionVisibilityChanges(
    listener: (visibility: ExecutionVisibility) => void
  ): () => void;
  setTimer(callback: () => void, delayMs: number): TimerHandle;
  clearTimer(handle: TimerHandle): void;
  readRelayEndpoint(plugin: JournalitPlugin): string;
  createRuntime(registry: AgentToolRegistry): AgentRelayRuntimeBoundary;
  createRelayClient(runtime: AgentRelayRuntimeBoundary): RelayClientBoundary;
}

const SIMPLE_SNAPSHOTS: Readonly<
  Record<Exclude<SessionStatus, 'blocked'>, AgentRelaySessionSnapshot>
> = {
  stopped: Object.freeze({ status: 'stopped' }),
  disabled: Object.freeze({ status: 'disabled' }),
  installation_required: Object.freeze({ status: 'installation_required' }),
  authentication_required: Object.freeze({ status: 'authentication_required' }),
  background: Object.freeze({ status: 'background' }),
  offline: Object.freeze({ status: 'offline' }),
  connecting: Object.freeze({ status: 'connecting' }),
  connected: Object.freeze({ status: 'connected' }),
  retry_wait: Object.freeze({ status: 'retry_wait' }),
};

const BLOCKED_SNAPSHOTS: Readonly<
  Record<AgentRelayBlockedReason, AgentRelaySessionSnapshot>
> = {
  installation_inactive: Object.freeze({
    status: 'blocked',
    reason: 'installation_inactive',
  }),
  installation_revoked: Object.freeze({
    status: 'blocked',
    reason: 'installation_revoked',
  }),
  protocol_incompatible: Object.freeze({
    status: 'blocked',
    reason: 'protocol_incompatible',
  }),
  relay_protocol_error: Object.freeze({
    status: 'blocked',
    reason: 'relay_protocol_error',
  }),
  local_configuration: Object.freeze({
    status: 'blocked',
    reason: 'local_configuration',
  }),
};

const RETRY_DELAYS_MS = [5_000, 10_000, 20_000, 40_000, 60_000] as const;

function readDefaultExecutionVisibility(): ExecutionVisibility {
  if (!Platform.isMobileApp) return 'unrestricted';
  try {
    return window.activeDocument.visibilityState === 'visible'
      ? 'foreground'
      : 'background';
  } catch {
    return 'background';
  }
}

function subscribeToDefaultExecutionVisibilityChanges(
  listener: (visibility: ExecutionVisibility) => void
): () => void {
  if (!Platform.isMobileApp) return () => undefined;
  const handleVisibilityChange = () =>
    listener(readDefaultExecutionVisibility());
  let visibilityDocument: Document;
  try {
    visibilityDocument = window.activeDocument;
    visibilityDocument.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );
  } catch {
    listener('background');
    return () => undefined;
  }
  listener(readDefaultExecutionVisibility());
  return () =>
    visibilityDocument.removeEventListener(
      'visibilitychange',
      handleVisibilityChange
    );
}

const DEFAULT_DEPENDENCIES: Omit<
  SessionDependencies,
  'hasInstallationBinding'
> = {
  hasAuthentication: (plugin) => BackendSecretStorage.hasAuthToken(plugin),
  isOnline: () => navigator.onLine !== false,
  readExecutionVisibility: readDefaultExecutionVisibility,
  subscribeToSettingsChanges: (listener) =>
    eventBus.subscribe('settings:changed', (payload) =>
      listener(payload.section)
    ),
  subscribeToAuthenticationChanges: (listener) => {
    window.addEventListener('journalit:subscription-changed', listener);
    return () =>
      window.removeEventListener('journalit:subscription-changed', listener);
  },
  subscribeToNetworkChanges: (listener) => {
    window.addEventListener('online', listener);
    window.addEventListener('offline', listener);
    return () => {
      window.removeEventListener('online', listener);
      window.removeEventListener('offline', listener);
    };
  },
  subscribeToExecutionVisibilityChanges:
    subscribeToDefaultExecutionVisibilityChanges,
  setTimer: (callback, delayMs) => window.setTimeout(callback, delayMs),
  clearTimer: (handle) => window.clearTimeout(handle),
  readRelayEndpoint: (plugin) =>
    ApiClient.getNormalizedBackendServerAuthority(
      plugin.settings.backendIntegration?.serverUrl
    ),
  createRuntime: (registry) => new AgentRuntimeService(registry),
  createRelayClient: (runtime) => new AgentRelayClient(runtime),
};

type Eligibility =
  | {
      kind: 'ineligible';
      status:
        | 'disabled'
        | 'installation_required'
        | 'authentication_required'
        | 'background'
        | 'offline';
    }
  | { kind: 'eligible'; installation: Installation; key: string };

interface CurrentAttempt {
  generation: number;
  key: string;
  client: RelayClientBoundary;
  unsubscribe: () => void;
}

type FailureAction =
  | { kind: 'retry'; delayMs?: number }
  | { kind: 'status'; status: 'authentication_required' }
  | { kind: 'blocked'; reason: AgentRelayBlockedReason };

export class AgentRelaySessionService {
  private readonly dependencies: SessionDependencies;
  private readonly listeners = new Set<() => void>();
  private snapshot: AgentRelaySessionSnapshot = SIMPLE_SNAPSHOTS.stopped;
  private queue: Promise<void> = Promise.resolve();
  private unsubscribers: Array<() => void> = [];
  private current: CurrentAttempt | undefined;
  private retryTimer: TimerHandle | undefined;
  private retryTimerToken = 0;
  private generation = 0;
  private retryIndex = 0;
  private attemptActive = false;
  private attemptKey: string | undefined;
  private executionVisibility: ExecutionVisibility = 'unrestricted';
  private started = false;
  private disposed = false;

  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly ticketClient: Pick<AgentRelayTicketClient, 'issue'>,
    private readonly registry: AgentToolRegistry,
    dependencies: Partial<SessionDependencies> = {}
  ) {
    const identityService = new AgentInstallationIdentityService(plugin);
    this.dependencies = {
      ...DEFAULT_DEPENDENCIES,
      hasInstallationBinding: (installation) =>
        identityService.hasInstallationBinding(installation),
      ...dependencies,
    };
  }

  public start(): void {
    if (this.started || this.disposed) return;
    this.started = true;
    this.executionVisibility = this.readExecutionVisibility();
    this.unsubscribers = [
      this.dependencies.subscribeToSettingsChanges((section) => {
        if (
          section === 'agentAccess' ||
          section === 'backendIntegration' ||
          section === 'all'
        ) {
          this.requestReconciliation(true);
        }
      }),
      this.dependencies.subscribeToAuthenticationChanges(() =>
        this.requestReconciliation(true)
      ),
      this.dependencies.subscribeToNetworkChanges(() =>
        this.requestReconciliation(true)
      ),
      this.dependencies.subscribeToExecutionVisibilityChanges((visibility) =>
        this.requestVisibilityReconciliation(visibility)
      ),
    ];
    this.requestReconciliation(false);
  }

  public async dispose(): Promise<void> {
    if (this.disposed) {
      await this.queue;
      return;
    }
    this.disposed = true;
    this.started = false;
    this.generation += 1;
    this.attemptActive = false;
    this.attemptKey = undefined;
    this.clearRetryTimer();
    for (const unsubscribe of this.unsubscribers.splice(0)) {
      try {
        unsubscribe();
      } catch {
        // intentional
      }
    }
    await this.enqueue(async () => {
      await this.stopCurrent();
      this.setSnapshot(SIMPLE_SNAPSHOTS.stopped);
    });
  }

  public subscribe(listener: () => void): () => void {
    if (this.disposed) return () => undefined;
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getSnapshot(): AgentRelaySessionSnapshot {
    return this.snapshot;
  }

  private requestReconciliation(authoritative: boolean): void {
    void this.enqueue(() => this.reconcile(authoritative));
  }

  private requestVisibilityReconciliation(
    visibility: ExecutionVisibility
  ): void {
    void this.enqueue(async () => {
      if (!this.started || this.disposed) return;
      this.executionVisibility = visibility;
      await this.reconcile(true);
    });
  }

  private async reconcile(authoritative: boolean): Promise<void> {
    if (!this.started || this.disposed) return;
    const eligibility = this.readEligibility();

    if (eligibility.kind === 'ineligible') {
      this.generation += 1;
      this.attemptActive = false;
      this.attemptKey = undefined;
      this.retryIndex = 0;
      this.clearRetryTimer();
      await this.stopCurrent();
      if (!this.started || this.disposed) return;
      this.setSnapshot(SIMPLE_SNAPSHOTS[eligibility.status]);
      return;
    }

    if (
      (this.current?.key === eligibility.key ||
        (this.attemptActive && this.attemptKey === eligibility.key)) &&
      this.retryTimer === undefined
    ) {
      return;
    }

    if (authoritative) {
      this.retryIndex = 0;
      this.clearRetryTimer();
      this.generation += 1;
      this.attemptActive = false;
      this.attemptKey = undefined;
    } else if (this.retryTimer !== undefined) {
      return;
    }

    if (this.current !== undefined && this.current.key !== eligibility.key) {
      this.generation += 1;
      this.attemptActive = false;
      this.attemptKey = undefined;
      await this.stopCurrent();
      if (!this.matchesEligibility(eligibility.key)) return;
    }
    if (this.current !== undefined || this.attemptActive) return;
    this.beginAttempt(eligibility);
  }

  private beginAttempt(
    eligibility: Extract<Eligibility, { kind: 'eligible' }>
  ): void {
    const generation = ++this.generation;
    this.attemptActive = true;
    this.attemptKey = eligibility.key;
    this.setSnapshot(SIMPLE_SNAPSHOTS.connecting);
    let issue: ReturnType<AgentRelayTicketClient['issue']>;
    try {
      issue = this.ticketClient.issue(eligibility.installation.installationId);
    } catch (error) {
      void this.enqueue(() => this.finishFailure(generation, error, 'ticket'));
      return;
    }
    void issue.then(
      (ticket) => {
        void this.enqueue(() =>
          this.finishTicket(
            generation,
            eligibility.key,
            eligibility.installation,
            ticket
          )
        );
      },
      (error: unknown) => {
        void this.enqueue(() =>
          this.finishFailure(generation, error, 'ticket')
        );
      }
    );
  }

  private async finishTicket(
    generation: number,
    key: string,
    installation: Installation,
    ticket: { ticket: string; expiresAt: string }
  ): Promise<void> {
    if (
      !this.isCurrentGeneration(generation) ||
      !this.matchesEligibility(key)
    ) {
      return;
    }
    let runtime: AgentRelayRuntimeBoundary | undefined;
    let client: RelayClientBoundary;
    try {
      runtime = this.dependencies.createRuntime(this.registry);
      client = this.dependencies.createRelayClient(runtime);
    } catch {
      if (runtime !== undefined) {
        try {
          await runtime.shutdown();
        } catch {
          // intentional
        }
      }
      if (
        !this.isCurrentGeneration(generation) ||
        !this.matchesEligibility(key)
      ) {
        return;
      }
      await this.applyFailure({
        kind: 'blocked',
        reason: 'local_configuration',
      });
      return;
    }
    let unsubscribe: (() => void) | undefined;
    let run: Promise<void>;
    try {
      unsubscribe = client.subscribe(() => {
        if (
          this.current?.generation === generation &&
          this.matchesEligibility(key) &&
          client.getSnapshot().state === 'ready'
        ) {
          this.retryIndex = 0;
          this.setSnapshot(SIMPLE_SNAPSHOTS.connected);
        }
      });
      this.current = { generation, key, client, unsubscribe };
      const capabilities = [...this.registry.listCapabilities()];
      run = client.run({
        ticket: ticket.ticket,
        installation: { ...installation },
        capabilities,
      });
    } catch {
      try {
        unsubscribe?.();
      } catch {
        // intentional
      }
      this.current = undefined;
      try {
        await client.shutdown();
      } catch {
        // intentional
      }
      if (
        !this.isCurrentGeneration(generation) ||
        !this.matchesEligibility(key)
      ) {
        return;
      }
      await this.applyFailure({
        kind: 'blocked',
        reason: 'local_configuration',
      });
      return;
    }
    void run.then(
      () => void this.enqueue(() => this.finishRun(generation, undefined)),
      (error: unknown) =>
        void this.enqueue(() => this.finishRun(generation, error))
    );
  }

  private async finishRun(generation: number, error: unknown): Promise<void> {
    if (!this.isCurrentGeneration(generation)) return;
    await this.stopCurrent();
    if (!this.isCurrentGeneration(generation) || !this.matchesEligibility())
      return;
    await this.applyFailure(
      error === undefined
        ? { kind: 'blocked', reason: 'local_configuration' }
        : this.classifyRelayFailure(error)
    );
  }

  private async finishFailure(
    generation: number,
    error: unknown,
    boundary: 'ticket'
  ): Promise<void> {
    if (!this.isCurrentGeneration(generation)) return;
    this.attemptActive = false;
    this.attemptKey = undefined;
    if (!this.matchesEligibility()) return;
    await this.applyFailure(
      boundary === 'ticket'
        ? this.classifyTicketFailure(error)
        : { kind: 'blocked', reason: 'local_configuration' }
    );
  }

  private async applyFailure(action: FailureAction): Promise<void> {
    this.attemptActive = false;
    this.attemptKey = undefined;
    if (action.kind === 'retry') {
      this.scheduleRetry(action.delayMs);
    } else if (action.kind === 'status') {
      this.setSnapshot(SIMPLE_SNAPSHOTS[action.status]);
    } else {
      this.setSnapshot(BLOCKED_SNAPSHOTS[action.reason]);
    }
  }

  private classifyTicketFailure(error: unknown): FailureAction {
    if (!(error instanceof AgentRelayTicketClientError)) {
      return { kind: 'blocked', reason: 'local_configuration' };
    }
    switch (error.code) {
      case 'transport_error':
      case 'relay_ticket_temporarily_unavailable':
        return { kind: 'retry' };
      case 'rate_limit_exceeded':
        return { kind: 'retry', delayMs: error.retryAfterSeconds! * 1000 };
      case 'authentication_required':
      case 'unauthorized':
      case 'account_unavailable':
        return { kind: 'status', status: 'authentication_required' };
      case 'agent_installation_inactive':
        return { kind: 'blocked', reason: 'installation_inactive' };
      case 'invalid_request':
      case 'protocol_error':
        return { kind: 'blocked', reason: 'local_configuration' };
      default: {
        const exhaustive: never = error.code;
        return exhaustive;
      }
    }
  }

  private classifyRelayFailure(error: unknown): FailureAction {
    if (!(error instanceof AgentRelayClientError)) {
      return { kind: 'blocked', reason: 'local_configuration' };
    }
    switch (error.code) {
      case 'handshake_timeout':
      case 'send_error':
      case 'transport_error':
      case 'unexpected_close':
      case 'runtime_error':
      case 'expired_ticket':
      case 'consumed_ticket':
        return { kind: 'retry' };
      case 'invalid_ticket':
      case 'invalid_input':
      case 'invalid_url':
      case 'state_error':
        return { kind: 'blocked', reason: 'local_configuration' };
      case 'revoked_installation':
        return { kind: 'blocked', reason: 'installation_revoked' };
      case 'unsupported_protocol':
      case 'contract_mismatch':
        return { kind: 'blocked', reason: 'protocol_incompatible' };
      case 'protocol_error':
        return { kind: 'blocked', reason: 'relay_protocol_error' };
      default: {
        const exhaustive: never = error.code;
        return exhaustive;
      }
    }
  }

  private scheduleRetry(overrideMs?: number): void {
    this.clearRetryTimer();
    const delayMs =
      overrideMs ??
      RETRY_DELAYS_MS[Math.min(this.retryIndex, RETRY_DELAYS_MS.length - 1)];
    if (
      overrideMs === undefined &&
      this.retryIndex < RETRY_DELAYS_MS.length - 1
    ) {
      this.retryIndex += 1;
    }
    this.setSnapshot(SIMPLE_SNAPSHOTS.retry_wait);
    const token = ++this.retryTimerToken;
    let handle: TimerHandle | undefined;
    handle = this.dependencies.setTimer(() => {
      if (
        handle === undefined ||
        this.retryTimer !== handle ||
        this.retryTimerToken !== token
      ) {
        return;
      }
      this.retryTimer = undefined;
      this.requestReconciliation(false);
    }, delayMs);
    this.retryTimer = handle;
  }

  private readEligibility(): Eligibility {
    const access = this.plugin.settings.agentAccess;
    if (access.enabled !== true)
      return { kind: 'ineligible', status: 'disabled' };
    if (access.installation === undefined) {
      return { kind: 'ineligible', status: 'installation_required' };
    }
    try {
      if (!this.dependencies.hasInstallationBinding(access.installation)) {
        return { kind: 'ineligible', status: 'installation_required' };
      }
    } catch {
      return { kind: 'ineligible', status: 'installation_required' };
    }
    let authenticated = false;
    let online = false;
    try {
      authenticated = this.dependencies.hasAuthentication(this.plugin);
    } catch {
      authenticated = false;
    }
    if (!authenticated) {
      return { kind: 'ineligible', status: 'authentication_required' };
    }
    if (this.executionVisibility === 'background') {
      return { kind: 'ineligible', status: 'background' };
    }
    try {
      online = this.dependencies.isOnline();
    } catch {
      online = false;
    }
    if (!online) return { kind: 'ineligible', status: 'offline' };
    const installation = { ...access.installation };
    let relayEndpoint: string;
    try {
      relayEndpoint = this.dependencies.readRelayEndpoint(this.plugin);
    } catch {
      return { kind: 'ineligible', status: 'offline' };
    }
    return {
      kind: 'eligible',
      installation,
      key: `${relayEndpoint}\u0000${installation.deviceId}\u0000${installation.vaultId}\u0000${installation.installationId}`,
    };
  }

  private matchesEligibility(expectedKey?: string): boolean {
    if (!this.started || this.disposed) return false;
    const eligibility = this.readEligibility();
    return (
      eligibility.kind === 'eligible' &&
      (expectedKey === undefined || eligibility.key === expectedKey)
    );
  }

  private readExecutionVisibility(): ExecutionVisibility {
    try {
      return this.dependencies.readExecutionVisibility();
    } catch {
      return 'background';
    }
  }

  private isCurrentGeneration(generation: number): boolean {
    return this.started && !this.disposed && this.generation === generation;
  }

  private async stopCurrent(): Promise<void> {
    const current = this.current;
    this.current = undefined;
    this.attemptActive = false;
    this.attemptKey = undefined;
    if (current === undefined) return;
    try {
      current.unsubscribe();
    } catch {
      // intentional
    }
    try {
      await current.client.shutdown();
    } catch {
      // intentional
    }
  }

  private clearRetryTimer(): void {
    this.retryTimerToken += 1;
    if (this.retryTimer === undefined) return;
    this.dependencies.clearTimer(this.retryTimer);
    this.retryTimer = undefined;
  }

  private enqueue(operation: () => Promise<void>): Promise<void> {
    const queued = this.queue.then(operation, operation);
    this.queue = queued.then(
      () => undefined,
      () => undefined
    );
    return queued;
  }

  private setSnapshot(snapshot: AgentRelaySessionSnapshot): void {
    if (this.snapshot === snapshot) return;
    this.snapshot = snapshot;
    for (const listener of this.listeners) {
      try {
        listener();
      } catch {
        // intentional
      }
    }
  }
}
