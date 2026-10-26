import type JournalitPlugin from '../../../main';
import { BackendSecretStorage } from '../../backend/BackendSecretStorage';
import { eventBus, type Unsubscribe } from '../../events';
import {
  AgentInstallationRegistrationClient,
  AgentInstallationRegistrationClientError,
  type AgentInstallationRegistrationErrorCode,
  type ReplaceableAgentVault,
} from './AgentInstallationRegistrationClient';
import { AgentInstallationIdentityService } from './AgentInstallationIdentityService';

type AgentAccess = JournalitPlugin['settings']['agentAccess'];
type Installation = NonNullable<AgentAccess['installation']>;

type FailureReason =
  | AgentInstallationRegistrationErrorCode
  | 'settings_unavailable';

export type AgentAccessSessionSnapshot =
  | Readonly<{ status: 'disabled' }>
  | Readonly<{ status: 'registering' }>
  | Readonly<{ status: 'ready' }>
  | Readonly<{
      status: 'failed';
      reason: FailureReason;
      message: string;
      enabled: boolean;
      retryable: boolean;
      
      replaceableVault?: ReplaceableAgentVault;
    }>;

interface SessionDependencies {
  hasAuthentication(plugin: JournalitPlugin): boolean;
  subscribeToSettingsChanges(
    listener: (section: string | undefined) => void
  ): Unsubscribe;
  subscribeToAuthenticationChanges(listener: () => void): Unsubscribe;
  identityService: Pick<
    AgentInstallationIdentityService,
    'hasInstallationBinding' | 'persistInstallationBinding'
  >;
}

const FAILURE_MESSAGES: Readonly<Record<FailureReason, string>> = {
  account_unavailable: 'The account is unavailable for agent registration.',
  agent_vault_limit_reached: 'No agent vault access is available.',
  authentication_required: 'Authentication is required for agent registration.',
  identity_unavailable: 'Agent registration identity is unavailable.',
  invalid_registration_request: 'Agent registration was rejected.',
  protocol_error: 'Agent registration received an invalid response.',
  rate_limit_exceeded: 'Agent registration is temporarily rate limited.',
  registration_temporarily_unavailable:
    'Agent registration is temporarily unavailable.',
  settings_unavailable: 'Agent access settings are unavailable.',
  transport_error: 'Agent registration could not connect.',
  unauthorized: 'Authentication is required for agent registration.',
};

const DEFAULT_DEPENDENCIES: Omit<SessionDependencies, 'identityService'> = {
  hasAuthentication: (plugin) => BackendSecretStorage.hasAuthToken(plugin),
  subscribeToSettingsChanges: (listener) =>
    eventBus.subscribe('settings:changed', (payload) =>
      listener(payload.section)
    ),
  subscribeToAuthenticationChanges: (listener) => {
    window.addEventListener('journalit:subscription-changed', listener);
    return () =>
      window.removeEventListener('journalit:subscription-changed', listener);
  },
};

function cloneAgentAccess(value: AgentAccess): AgentAccess {
  return value.installation
    ? {
        enabled: value.enabled,
        fullAccess: value.fullAccess,
        installation: { ...value.installation },
      }
    : { enabled: value.enabled, fullAccess: value.fullAccess };
}

function equalAgentAccess(left: AgentAccess, right: AgentAccess): boolean {
  return (
    left.enabled === right.enabled &&
    left.fullAccess === right.fullAccess &&
    left.installation?.deviceId === right.installation?.deviceId &&
    left.installation?.vaultId === right.installation?.vaultId &&
    left.installation?.installationId === right.installation?.installationId
  );
}

export class AgentAccessSessionService {
  readonly #plugin: JournalitPlugin;
  readonly #client: Pick<AgentInstallationRegistrationClient, 'register'>;
  readonly #dependencies: SessionDependencies;
  readonly #listeners = new Set<() => void>();
  #unsubscribes: Unsubscribe[] = [];
  #snapshot: AgentAccessSessionSnapshot;
  #knownAgentAccess: AgentAccess;
  #provisionalAgentAccess: AgentAccess | null = null;
  #requestedEnabled: boolean;
  #settingsIntent = 0;
  #generation = 0;
  #writeQueue: Promise<void> = Promise.resolve();
  #registrationPromise: Promise<void> | null = null;
  #registrationGeneration: number | null = null;
  #disposed = false;

  public constructor(
    plugin: JournalitPlugin,
    client: Pick<AgentInstallationRegistrationClient, 'register'>,
    dependencies: Partial<SessionDependencies> = {}
  ) {
    this.#plugin = plugin;
    this.#client = client;
    this.#dependencies = {
      ...DEFAULT_DEPENDENCIES,
      ...dependencies,
      identityService:
        dependencies.identityService ??
        new AgentInstallationIdentityService(plugin),
    };
    this.#knownAgentAccess = cloneAgentAccess(plugin.settings.agentAccess);
    this.#requestedEnabled = this.#knownAgentAccess.enabled;
    this.#snapshot = this.#baseSnapshot(this.#knownAgentAccess);
    this.#unsubscribes = [
      this.#dependencies.subscribeToSettingsChanges((section) => {
        if (section === 'agentAccess' || section === 'all') {
          this.#reconcileSettings();
        }
      }),
      this.#dependencies.subscribeToAuthenticationChanges(() => {
        if (this.#disposed) return;
        if (this.#hasAuthentication()) {
          void this.recoverRegistration();
        } else if (this.#snapshot.status === 'registering') {
          this.#generation += 1;
          this.#publishFailure('authentication_required', false);
        }
      }),
    ];
  }

  public subscribe(listener: () => void): () => void {
    if (this.#disposed) return () => undefined;
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  public getSnapshot(): AgentAccessSessionSnapshot {
    return this.#snapshot;
  }

  public async setEnabled(enabled: boolean): Promise<void> {
    if (this.#disposed) return;
    if (enabled === this.#requestedEnabled) {
      await this.#writeQueue;
      return;
    }
    this.#requestedEnabled = enabled;
    if (!enabled) {
      this.#generation += 1;
      this.#publish(Object.freeze({ status: 'disabled' }));
    }
    const intent = ++this.#settingsIntent;
    await this.#queueWrite(async () => {
      if (this.#disposed || intent !== this.#settingsIntent) return;
      const live = this.#plugin.settings.agentAccess;
      if (
        live !== this.#provisionalAgentAccess &&
        !equalAgentAccess(live, this.#knownAgentAccess)
      ) {
        this.#adoptExternalAgentAccess(live);
        return;
      }
      const previous = cloneAgentAccess(this.#knownAgentAccess);
      const provisional = { ...cloneAgentAccess(previous), enabled };
      if (equalAgentAccess(previous, provisional)) return;
      this.#provisionalAgentAccess = provisional;
      this.#plugin.settings.agentAccess = provisional;
      try {
        await this.#plugin.saveSettings();
      } catch {
        await this.#completeFailedWrite({ intent, previous, provisional });
        return;
      }
      this.#completeSuccessfulWrite({ intent, provisional });
    });
    if (
      enabled &&
      !this.#disposed &&
      intent === this.#settingsIntent &&
      this.#knownAgentAccess.enabled
    ) {
      await this.recoverRegistration();
    }
  }

  public getFullAccess(): boolean {
    return this.#knownAgentAccess.fullAccess;
  }

  
  public async setFullAccess(fullAccess: boolean): Promise<void> {
    if (this.#disposed) return;
    const intent = ++this.#settingsIntent;
    await this.#queueWrite(async () => {
      if (this.#disposed || intent !== this.#settingsIntent) return;
      const live = this.#plugin.settings.agentAccess;
      if (
        live !== this.#provisionalAgentAccess &&
        !equalAgentAccess(live, this.#knownAgentAccess)
      ) {
        this.#adoptExternalAgentAccess(live);
        return;
      }
      const previous = cloneAgentAccess(this.#knownAgentAccess);
      const provisional = { ...cloneAgentAccess(previous), fullAccess };
      if (equalAgentAccess(previous, provisional)) return;
      this.#provisionalAgentAccess = provisional;
      this.#plugin.settings.agentAccess = provisional;
      try {
        await this.#plugin.saveSettings();
      } catch {
        await this.#completeFailedWrite({ intent, previous, provisional });
        return;
      }
      this.#completeSuccessfulWrite({ intent, provisional });
    });
  }

  
  public async recoverRegistration(): Promise<void> {
    await this.#writeQueue;
    if (this.#disposed) return;
    if (!this.#knownAgentAccess.enabled) {
      this.#publish(Object.freeze({ status: 'disabled' }));
      return;
    }
    if (this.#hasAuthoritativeInstallation(this.#knownAgentAccess)) {
      this.#publish(Object.freeze({ status: 'ready' }));
      return;
    }
    await this.#register(() => this.recoverRegistration());
  }

  
  public async reconnect(): Promise<void> {
    await this.#writeQueue;
    if (this.#disposed) return;
    if (!this.#knownAgentAccess.enabled) {
      this.#publish(Object.freeze({ status: 'disabled' }));
      return;
    }
    await this.#register(() => this.reconnect());
  }

  
  public async moveAccessToThisVault(vaultId: string): Promise<void> {
    await this.#writeQueue;
    if (this.#disposed) return;
    const snapshot = this.#snapshot;
    if (
      snapshot.status !== 'failed' ||
      snapshot.reason !== 'agent_vault_limit_reached' ||
      snapshot.replaceableVault?.vaultId !== vaultId ||
      !this.#knownAgentAccess.enabled
    ) {
      return;
    }
    await this.#register(() => this.moveAccessToThisVault(vaultId), vaultId);
  }

  async #register(
    retry: () => Promise<void>,
    replaceVaultId?: string
  ): Promise<void> {
    if (!this.#hasAuthentication()) {
      this.#publishFailure('authentication_required', false);
      return;
    }
    if (this.#registrationPromise) {
      const activeRegistration = this.#registrationPromise;
      const activeGeneration = this.#registrationGeneration;
      await activeRegistration;
      if (activeGeneration === this.#generation) return;
      if (this.#registrationPromise === activeRegistration) {
        this.#registrationPromise = null;
        this.#registrationGeneration = null;
      }
      return retry();
    }

    const generation = ++this.#generation;
    this.#publish(Object.freeze({ status: 'registering' }));
    const registration = this.#performRegistration(generation, replaceVaultId);
    this.#registrationPromise = registration;
    this.#registrationGeneration = generation;
    try {
      await registration;
    } finally {
      if (this.#registrationPromise === registration) {
        this.#registrationPromise = null;
        this.#registrationGeneration = null;
      }
    }
  }

  public async retryRegistration(): Promise<void> {
    if (
      this.#disposed ||
      this.#snapshot.status !== 'failed' ||
      !this.#snapshot.enabled ||
      !this.#snapshot.retryable
    ) {
      return;
    }
    await this.recoverRegistration();
  }

  public dispose(): void {
    if (this.#disposed) return;
    this.#generation += 1;
    this.#disposed = true;
    for (const unsubscribe of this.#unsubscribes) unsubscribe();
    this.#unsubscribes = [];
    this.#listeners.clear();
  }

  async #performRegistration(
    generation: number,
    replaceVaultId: string | undefined
  ): Promise<void> {
    try {
      
      const result = replaceVaultId
        ? await this.#client.register({ replaceVaultId })
        : await this.#client.register();
      if (!this.#isCurrent(generation)) return;
      const installation: Installation = {
        deviceId: result.deviceId,
        vaultId: result.vaultId,
        installationId: result.installationId,
      };
      const intent = ++this.#settingsIntent;
      await this.#queueWrite(async () => {
        if (
          !this.#isCurrent(generation) ||
          intent !== this.#settingsIntent ||
          !this.#knownAgentAccess.enabled
        ) {
          return;
        }
        const live = this.#plugin.settings.agentAccess;
        if (
          live !== this.#provisionalAgentAccess &&
          !equalAgentAccess(live, this.#knownAgentAccess)
        ) {
          this.#adoptExternalAgentAccess(live);
          return;
        }
        try {
          this.#dependencies.identityService.persistInstallationBinding({
            vaultKey: result.vaultKey,
            ...installation,
          });
        } catch {
          this.#publishFailure('settings_unavailable', true);
          return;
        }
        const previous = cloneAgentAccess(this.#knownAgentAccess);
        const provisional: AgentAccess = {
          enabled: true,
          fullAccess: previous.fullAccess,
          installation: { ...installation },
        };
        this.#provisionalAgentAccess = provisional;
        this.#plugin.settings.agentAccess = provisional;
        try {
          await this.#plugin.saveSettings();
        } catch {
          await this.#completeFailedWrite({ intent, previous, provisional });
          return;
        }
        this.#completeSuccessfulWrite({ intent, provisional });
      });
    } catch (error) {
      if (!this.#isCurrent(generation)) return;
      if (error instanceof AgentInstallationRegistrationClientError) {
        this.#publishFailure(
          error.code,
          error.retryable,
          error.replaceableVault
        );
      } else {
        this.#publishFailure('protocol_error', false);
      }
    }
  }

  #completeSuccessfulWrite(options: {
    intent: number;
    provisional: AgentAccess;
  }): void {
    const actual = this.#plugin.settings.agentAccess;
    const externalWon = actual !== options.provisional;
    if (externalWon) this.#adoptExternalAgentAccess(actual);
    else this.#knownAgentAccess = cloneAgentAccess(options.provisional);
    if (this.#provisionalAgentAccess === options.provisional) {
      this.#provisionalAgentAccess = null;
    }
    if (!externalWon && !this.#disposed) {
      eventBus.publish('settings:changed', { section: 'agentAccess' });
    }
    if (
      !this.#disposed &&
      !externalWon &&
      options.intent === this.#settingsIntent
    ) {
      this.#publish(this.#baseSnapshot(this.#knownAgentAccess));
    }
  }

  async #completeFailedWrite(options: {
    intent: number;
    previous: AgentAccess;
    provisional: AgentAccess;
  }): Promise<void> {
    const actual = this.#plugin.settings.agentAccess;
    if (actual === options.provisional) {
      this.#plugin.settings.agentAccess = options.previous;
      this.#knownAgentAccess = cloneAgentAccess(options.previous);
      if (this.#provisionalAgentAccess === options.provisional) {
        this.#provisionalAgentAccess = null;
      }
      if (!this.#disposed) {
        eventBus.publish('settings:changed', { section: 'agentAccess' });
      }
      if (!this.#disposed && options.intent === this.#settingsIntent) {
        this.#requestedEnabled = this.#knownAgentAccess.enabled;
        this.#publishFailure('settings_unavailable', true);
      }
      try {
        await this.#plugin.saveSettings();
      } catch {
        // intentional
      }
      return;
    } else {
      this.#adoptExternalAgentAccess(actual);
    }
    if (this.#provisionalAgentAccess === options.provisional) {
      this.#provisionalAgentAccess = null;
    }
    if (!this.#disposed && options.intent === this.#settingsIntent) {
      this.#requestedEnabled = this.#knownAgentAccess.enabled;
      this.#publishFailure('settings_unavailable', true);
    }
  }

  #baseSnapshot(value: AgentAccess): AgentAccessSessionSnapshot {
    if (!value.enabled) return Object.freeze({ status: 'disabled' });
    if (this.#hasAuthoritativeInstallation(value)) {
      return Object.freeze({ status: 'ready' });
    }
    return Object.freeze({ status: 'registering' });
  }

  #hasAuthoritativeInstallation(value: AgentAccess): boolean {
    if (!value.installation) return false;
    try {
      return this.#dependencies.identityService.hasInstallationBinding(
        value.installation
      );
    } catch {
      return false;
    }
  }

  #hasAuthentication(): boolean {
    try {
      return this.#dependencies.hasAuthentication(this.#plugin);
    } catch {
      return false;
    }
  }

  #publishFailure(
    reason: FailureReason,
    retryable: boolean,
    replaceableVault?: ReplaceableAgentVault
  ): void {
    this.#publish(
      Object.freeze({
        status: 'failed',
        reason,
        message: FAILURE_MESSAGES[reason],
        enabled: this.#knownAgentAccess.enabled,
        retryable,
        ...(reason === 'agent_vault_limit_reached' && replaceableVault
          ? { replaceableVault }
          : {}),
      })
    );
  }

  #publish(snapshot: AgentAccessSessionSnapshot): void {
    if (this.#disposed) return;
    this.#snapshot = snapshot;
    for (const listener of this.#listeners) {
      try {
        listener();
      } catch {
        // intentional
      }
    }
  }

  #isCurrent(generation: number): boolean {
    return !this.#disposed && generation === this.#generation;
  }

  #queueWrite(operation: () => Promise<void>): Promise<void> {
    const queued = this.#writeQueue.then(operation, operation);
    this.#writeQueue = queued.then(
      () => undefined,
      () => undefined
    );
    return queued;
  }

  #reconcileSettings(): void {
    if (this.#disposed) return;
    const actual = this.#plugin.settings.agentAccess;
    if (actual === this.#provisionalAgentAccess) return;
    if (!equalAgentAccess(actual, this.#knownAgentAccess)) {
      this.#adoptExternalAgentAccess(actual);
      return;
    }
    if (this.#snapshot.status !== 'registering') {
      const base = this.#baseSnapshot(this.#knownAgentAccess);
      if (base.status !== this.#snapshot.status) this.#publish(base);
    }
  }

  #adoptExternalAgentAccess(actual: AgentAccess): void {
    if (
      this.#provisionalAgentAccess === null &&
      equalAgentAccess(actual, this.#knownAgentAccess)
    ) {
      return;
    }
    this.#settingsIntent += 1;
    this.#generation += 1;
    this.#provisionalAgentAccess = null;
    this.#knownAgentAccess = cloneAgentAccess(actual);
    this.#requestedEnabled = actual.enabled;
    this.#publish(this.#baseSnapshot(actual));
    if (actual.enabled && !this.#hasAuthoritativeInstallation(actual)) {
      this.#scheduleRecoveryAfterWrites();
    }
  }

  #scheduleRecoveryAfterWrites(): void {
    const writesBeforeRecovery = this.#writeQueue;
    void writesBeforeRecovery.then(
      () => this.recoverRegistration(),
      () => this.recoverRegistration()
    );
  }
}
