import { requestUrl } from 'obsidian';

import type JournalitPlugin from '../../main';
import {
  ApiClient,
  type AuthTokenRefresher,
  type AuthTokenRefreshResult,
} from './ApiClient';
import { BackendSecretStorage } from './BackendSecretStorage';

interface RefreshResponse {
  access_token: string;
  refresh_token?: string;
  token_type: 'Bearer';
  expires_in: number;
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


export class TokenManager implements AuthTokenRefresher {
  private refreshPromise: Promise<AuthTokenRefreshResult> | null = null;

  constructor(private readonly plugin: JournalitPlugin) {}

  async refreshAccessToken(
    failedAccessToken: string
  ): Promise<AuthTokenRefreshResult> {
    if (BackendSecretStorage.getAuthToken(this.plugin) !== failedAccessToken) {
      return { status: 'rejected' };
    }
    if (!BackendSecretStorage.hasRefreshToken(this.plugin)) {
      return { status: 'rejected' };
    }
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.exchangeRefreshToken(failedAccessToken).finally(
      () => {
        this.refreshPromise = null;
      }
    );
    return this.refreshPromise;
  }

  async revokeRefreshSession(): Promise<void> {
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

  private async exchangeRefreshToken(
    failedAccessToken: string
  ): Promise<AuthTokenRefreshResult> {
    const refreshToken = BackendSecretStorage.getRefreshToken(this.plugin);
    if (!refreshToken) {
      return { status: 'rejected' };
    }

    let response;
    try {
      response = await requestUrl({
        url: ApiClient.buildUrl('/auth/refresh'),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refresh_token: refreshToken,
          client: 'obsidian',
        }),
        throw: false,
      });
    } catch {
      return { status: 'unavailable' };
    }

    if (response.status < 200 || response.status >= 300) {
      return response.status === 400 || response.status === 401
        ? { status: 'rejected' }
        : { status: 'unavailable' };
    }
    const refreshed = parseRefreshResponse(response.json);
    if (!refreshed) {
      return { status: 'unavailable' };
    }
    let replaced = false;
    try {
      replaced = refreshed.refresh_token
        ? BackendSecretStorage.replaceAuthSession(
            this.plugin,
            failedAccessToken,
            refreshToken,
            refreshed.access_token,
            refreshed.refresh_token
          )
        : BackendSecretStorage.replaceAuthToken(
            this.plugin,
            failedAccessToken,
            refreshed.access_token
          );
    } catch {
      return { status: 'unavailable' };
    }
    if (!replaced) {
      return { status: 'unavailable' };
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
    return { status: 'refreshed', accessToken: refreshed.access_token };
  }
}

const pluginTokenManagers = new WeakMap<JournalitPlugin, TokenManager>();

export function initializeTokenManager(plugin: JournalitPlugin): TokenManager {
  let manager = pluginTokenManagers.get(plugin);
  if (!manager) {
    manager = new TokenManager(plugin);
    pluginTokenManagers.set(plugin, manager);
  }
  ApiClient.setTokenRefresher(manager);
  return manager;
}

export function clearTokenManager(plugin: JournalitPlugin): void {
  const manager = pluginTokenManagers.get(plugin);
  if (!manager) return;
  ApiClient.clearTokenRefresher(manager);
  pluginTokenManagers.delete(plugin);
}
