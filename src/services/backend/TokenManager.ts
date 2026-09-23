import { requestUrl } from 'obsidian';

import type JournalitPlugin from '../../main';
import {
  ApiClient,
  type AuthTokenRefresher,
  type AuthTokenRefreshResult,
} from './ApiClient';
import {
  AuthRefreshCircuit,
  type AuthRefreshResumeReason,
} from './AuthRefreshCircuit';
import { BackendSecretStorage } from './BackendSecretStorage';
import { DemoSyncGate } from '../../demo/DemoSyncGate';

export const ACCESS_TOKEN_CLOCK_SKEW_MS = 60_000;

type AuthReadiness =
  | { status: 'ready'; accessToken: string | null }
  | { status: 'unavailable' }
  | { status: 'rejected' }
  | { status: 'unauthenticated' };

interface RefreshResponse {
  access_token: string;
  refresh_token?: string;
  token_type: 'Bearer';
  expires_in: number;
}

interface AuthSessionIdentity {
  accessToken: string;
  refreshToken: string;
  sessionVersion: number;
}

interface RefreshFlight extends AuthSessionIdentity {
  promise: Promise<AuthTokenRefreshResult>;
}

function parseRefreshResponse(value: unknown): RefreshResponse | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  const response = Object.fromEntries(Object.entries(value));
  if (
    typeof response.access_token !== 'string' ||
    response.access_token.length === 0 ||
    response.token_type !== 'Bearer' ||
    typeof response.expires_in !== 'number' ||
    !Number.isFinite(response.expires_in) ||
    response.expires_in <= 0
  ) {
    return null;
  }
  const refreshToken: unknown = response.refresh_token;
  if (
    refreshToken !== undefined &&
    (typeof refreshToken !== 'string' || refreshToken.length === 0)
  ) {
    return null;
  }
  return {
    access_token: response.access_token,
    ...(typeof refreshToken === 'string'
      ? { refresh_token: refreshToken }
      : {}),
    token_type: 'Bearer',
    expires_in: response.expires_in,
  };
}

function declaredPluginVersion(plugin: JournalitPlugin): string | undefined {
  const version = plugin.manifest?.version;
  return typeof version === 'string' && version.length > 0
    ? version
    : undefined;
}

function parseAccessTokenExpiry(value: unknown): number | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }
  const expiry = Date.parse(value);
  return Number.isFinite(expiry) ? expiry : undefined;
}


export class TokenManager implements AuthTokenRefresher {
  private refreshFlight: RefreshFlight | null = null;
  private readonly circuit = new AuthRefreshCircuit();
  private observedSessionVersion: number;
  private unsubscribeAuthSessionChanges: (() => void) | null = null;

  constructor(private readonly plugin: JournalitPlugin) {
    this.observedSessionVersion = ApiClient.getAuthSessionVersion();
  }

  async refreshAccessToken(
    failedAccessToken: string
  ): Promise<AuthTokenRefreshResult> {
    this.reconcileAuthSession();
    if (BackendSecretStorage.getAuthToken(this.plugin) !== failedAccessToken) {
      return { status: 'rejected' };
    }
    const refreshToken = BackendSecretStorage.getRefreshToken(this.plugin);
    if (!refreshToken) {
      return { status: 'rejected' };
    }
    const sessionVersion = ApiClient.getAuthSessionVersion();
    if (
      this.refreshFlight?.accessToken === failedAccessToken &&
      this.refreshFlight.refreshToken === refreshToken &&
      this.refreshFlight.sessionVersion === sessionVersion
    ) {
      return this.refreshFlight.promise;
    }

    const session = {
      accessToken: failedAccessToken,
      refreshToken,
      sessionVersion,
    };
    const promise = this.exchangeRefreshToken(session).finally(() => {
      if (this.refreshFlight?.promise === promise) {
        this.refreshFlight = null;
      }
    });
    this.refreshFlight = { ...session, promise };
    return promise;
  }

  getAuthRefreshCircuit(): AuthRefreshCircuit {
    return this.circuit;
  }

  async ensureAuthReady(options?: {
    resume?: AuthRefreshResumeReason;
  }): Promise<AuthReadiness> {
    if (DemoSyncGate.isActive()) {
      return { status: 'unavailable' };
    }
    this.reconcileAuthSession();
    if (options?.resume) {
      this.circuit.resume(options.resume);
    } else if (this.circuit.isBlocked()) {
      return { status: 'unavailable' };
    }

    const accessToken = BackendSecretStorage.getAuthToken(this.plugin);
    if (!accessToken) {
      return { status: 'unauthenticated' };
    }
    if (!BackendSecretStorage.hasRefreshToken(this.plugin)) {
      return { status: 'ready', accessToken };
    }

    const expiresAt = parseAccessTokenExpiry(
      this.plugin.settings.backendIntegration?.accessTokenExpiresAt
    );
    if (expiresAt === undefined) {
      return { status: 'ready', accessToken };
    }
    if (Date.now() + ACCESS_TOKEN_CLOCK_SKEW_MS < expiresAt) {
      return { status: 'ready', accessToken };
    }

    const result = await this.refreshAccessToken(accessToken);
    if (result.status === 'refreshed') {
      return { status: 'ready', accessToken: result.accessToken };
    }
    if (result.status === 'rejected') {
      const latest = BackendSecretStorage.getAuthToken(this.plugin);
      if (latest && latest !== accessToken) {
        return { status: 'ready', accessToken: latest };
      }
    }
    return { status: result.status };
  }

  async revokeRefreshSession(): Promise<void> {
    DemoSyncGate.assertNetworkAllowed();
    const refreshToken = BackendSecretStorage.getRefreshToken(this.plugin);
    if (!refreshToken) {
      return;
    }

    const response = await requestUrl({
      url: ApiClient.buildUrl('/auth/logout'),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Backend session revocation failed (${response.status})`);
    }
  }

  dispose(): void {
    this.unsubscribeAuthSessionChanges?.();
    this.unsubscribeAuthSessionChanges = null;
    this.circuit.dispose();
  }

  observeAuthSessionChanges(): void {
    if (this.unsubscribeAuthSessionChanges) return;
    this.unsubscribeAuthSessionChanges = ApiClient.subscribeAuthSessionChanges(
      () => this.reconcileAuthSession()
    );
  }

  private async exchangeRefreshToken(
    session: AuthSessionIdentity
  ): Promise<AuthTokenRefreshResult> {
    if (!this.isCurrentSession(session)) {
      return { status: 'rejected' };
    }

    const pluginVersion = declaredPluginVersion(this.plugin);
    let response;
    try {
      DemoSyncGate.assertNetworkAllowed();
      response = await requestUrl({
        url: ApiClient.buildUrl('/auth/refresh'),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refresh_token: session.refreshToken,
          client: 'obsidian',
          ...(pluginVersion ? { pluginVersion } : {}),
        }),
        throw: false,
      });
    } catch {
      return this.unavailableRefresh(session);
    }

    if (response.status < 200 || response.status >= 300) {
      if (!this.isCurrentSession(session)) {
        return { status: 'rejected' };
      }
      return response.status === 400 || response.status === 401
        ? { status: 'rejected' }
        : this.unavailableRefresh(session);
    }
    const refreshed = parseRefreshResponse(response.json);
    if (!refreshed) {
      return this.unavailableRefresh(session);
    }
    let replaced = false;
    try {
      replaced = refreshed.refresh_token
        ? BackendSecretStorage.replaceAuthSession(
            this.plugin,
            session.accessToken,
            session.refreshToken,
            refreshed.access_token,
            refreshed.refresh_token
          )
        : BackendSecretStorage.replaceAuthToken(
            this.plugin,
            session.accessToken,
            refreshed.access_token
          );
    } catch {
      return this.unavailableRefresh(session, true);
    }
    if (!replaced) {
      return { status: 'rejected' };
    }

    const backend = this.plugin.settings.backendIntegration;
    if (backend) {
      backend.accessTokenExpiresAt = new Date(
        Date.now() + refreshed.expires_in * 1000
      ).toISOString();
      try {
        await this.plugin.saveSettings();
      } catch (error) {
        console.error(
          'Failed to persist refreshed access token expiry:',
          error
        );
      }
    }
    this.circuit.resume('manual');
    return { status: 'refreshed', accessToken: refreshed.access_token };
  }

  private unavailableRefresh(
    session: AuthSessionIdentity,
    allowRefreshTokenRotation = false
  ): AuthTokenRefreshResult {
    if (
      !(allowRefreshTokenRotation
        ? this.isCurrentAccessSession(session)
        : this.isCurrentSession(session))
    ) {
      return { status: 'rejected' };
    }
    this.circuit.recordUnavailable();
    return { status: 'unavailable' };
  }

  private reconcileAuthSession(): void {
    const sessionVersion = ApiClient.getAuthSessionVersion();
    if (sessionVersion === this.observedSessionVersion) return;
    this.observedSessionVersion = sessionVersion;
    this.circuit.resume('session');
  }

  private isCurrentSession(session: AuthSessionIdentity): boolean {
    return (
      this.isCurrentAccessSession(session) &&
      BackendSecretStorage.getRefreshToken(this.plugin) === session.refreshToken
    );
  }

  private isCurrentAccessSession(session: AuthSessionIdentity): boolean {
    return (
      ApiClient.getAuthSessionVersion() === session.sessionVersion &&
      ApiClient.getAuthToken() === session.accessToken &&
      BackendSecretStorage.getAuthToken(this.plugin) === session.accessToken
    );
  }
}

const pluginTokenManagers = new WeakMap<JournalitPlugin, TokenManager>();

export function initializeTokenManager(plugin: JournalitPlugin): TokenManager {
  let manager = pluginTokenManagers.get(plugin);
  if (!manager) {
    manager = new TokenManager(plugin);
    pluginTokenManagers.set(plugin, manager);
  }
  manager.observeAuthSessionChanges();
  ApiClient.setTokenRefresher(manager);
  return manager;
}

export function clearTokenManager(plugin: JournalitPlugin): void {
  const manager = pluginTokenManagers.get(plugin);
  if (!manager) return;
  manager.dispose();
  ApiClient.clearTokenRefresher(manager);
  pluginTokenManagers.delete(plugin);
}

export async function ensureAuthReady(
  plugin: JournalitPlugin,
  options?: { resume?: AuthRefreshResumeReason }
): Promise<AuthReadiness> {
  const manager = pluginTokenManagers.get(plugin);
  if (!manager) {
    return { status: 'ready', accessToken: null };
  }
  return manager.ensureAuthReady(options);
}

export function isAuthRefreshUnavailable(plugin: JournalitPlugin): boolean {
  return (
    pluginTokenManagers.get(plugin)?.getAuthRefreshCircuit().isBlocked() ??
    false
  );
}

export function subscribeAuthRefreshCircuit(
  plugin: JournalitPlugin,
  listener: (blocked: boolean) => void
): () => void {
  const circuit = pluginTokenManagers.get(plugin)?.getAuthRefreshCircuit();
  if (!circuit) return () => undefined;
  return circuit.subscribe(listener);
}
