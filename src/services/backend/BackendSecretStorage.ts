

import type JournalitPlugin from '../../main';
import { ApiClient } from './ApiClient';

const AUTH_TOKEN_SECRET_NAME = 'auth-token';
const FTP_PASSWORD_SECRET_NAME = 'ftp-password';

function createNamespaceId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function normalizeSecret(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? value : null;
}

function getSecret(plugin: JournalitPlugin, id: string): string | null {
  return normalizeSecret(plugin.app.secretStorage?.getSecret(id));
}

function setSecret(plugin: JournalitPlugin, id: string, value: string): void {
  if (!plugin.app.secretStorage) {
    throw new Error('Obsidian SecretStorage is unavailable');
  }
  plugin.app.secretStorage.setSecret(id, value);
}

function clearSecret(plugin: JournalitPlugin, id: string): void {
  setSecret(plugin, id, '');
  if (getSecret(plugin, id) !== null) {
    throw new Error('Obsidian SecretStorage did not clear the secret');
  }
}

function hashNamespace(value: string): string {
  let primaryHash = 0x811c9dc5;
  let secondaryHash = 0x01000193;
  for (let index = 0; index < value.length; index += 1) {
    const charCode = value.charCodeAt(index);
    primaryHash ^= charCode;
    primaryHash = Math.imul(primaryHash, 0x01000193);
    secondaryHash ^= charCode;
    secondaryHash = Math.imul(secondaryHash, 0x811c9dc5);
  }
  return `${(primaryHash >>> 0).toString(16).padStart(8, '0')}${(secondaryHash >>> 0).toString(16).padStart(8, '0')}`;
}

function getVaultNamespace(plugin: JournalitPlugin): string {
  const backend = plugin.settings.backendIntegration;
  if (!backend) {
    return hashNamespace('journalit:default');
  }

  if (!backend.secretStorageNamespace) {
    backend.secretStorageNamespace = createNamespaceId();
  }

  return hashNamespace(backend.secretStorageNamespace);
}

function getSecretId(plugin: JournalitPlugin, secretName: string): string {
  return `journalit-${getVaultNamespace(plugin)}-${secretName}`;
}

export class BackendSecretStorage {
  static getAuthToken(plugin: JournalitPlugin): string | null {
    const storedToken = getSecret(
      plugin,
      getSecretId(plugin, AUTH_TOKEN_SECRET_NAME)
    );
    if (storedToken) {
      return storedToken;
    }

    return normalizeSecret(plugin.settings.backendIntegration?.authToken);
  }

  static hasAuthToken(plugin: JournalitPlugin): boolean {
    return this.getAuthToken(plugin) !== null;
  }

  static setAuthToken(plugin: JournalitPlugin, token: string): void {
    setSecret(plugin, getSecretId(plugin, AUTH_TOKEN_SECRET_NAME), token);
    if (plugin.settings.backendIntegration) {
      plugin.settings.backendIntegration.authToken = undefined;
    }
    ApiClient.setAuthToken(token);
  }

  static clearAuthToken(plugin: JournalitPlugin): void {
    clearSecret(plugin, getSecretId(plugin, AUTH_TOKEN_SECRET_NAME));
    if (plugin.settings.backendIntegration) {
      plugin.settings.backendIntegration.authToken = undefined;
    }
    ApiClient.setAuthToken(null);
  }

  static getFTPPassword(plugin: JournalitPlugin): string | null {
    const storedPassword = getSecret(
      plugin,
      getSecretId(plugin, FTP_PASSWORD_SECRET_NAME)
    );
    if (storedPassword) {
      return storedPassword;
    }

    return normalizeSecret(plugin.settings.backendIntegration?.ftpPassword);
  }

  static hasFTPPassword(plugin: JournalitPlugin): boolean {
    return this.getFTPPassword(plugin) !== null;
  }

  static setFTPPassword(plugin: JournalitPlugin, password: string): void {
    setSecret(plugin, getSecretId(plugin, FTP_PASSWORD_SECRET_NAME), password);
    if (plugin.settings.backendIntegration) {
      plugin.settings.backendIntegration.ftpPassword = undefined;
    }
  }

  static clearFTPPassword(plugin: JournalitPlugin): void {
    clearSecret(plugin, getSecretId(plugin, FTP_PASSWORD_SECRET_NAME));
    if (plugin.settings.backendIntegration) {
      plugin.settings.backendIntegration.ftpPassword = undefined;
    }
  }

  
  static async migrateLegacySettings(
    plugin: JournalitPlugin,
    options: { overwriteExistingSecrets?: boolean } = {}
  ): Promise<{ migratedAuthToken: boolean; migratedFTPPassword: boolean }> {
    const backend = plugin.settings.backendIntegration;
    if (!backend) {
      return { migratedAuthToken: false, migratedFTPPassword: false };
    }

    let migratedAuthToken = false;
    let migratedFTPPassword = false;
    let shouldSave = false;

    const legacyAuthToken = normalizeSecret(backend.authToken);
    if (legacyAuthToken) {
      try {
        const authTokenSecretId = getSecretId(plugin, AUTH_TOKEN_SECRET_NAME);
        if (
          options.overwriteExistingSecrets ||
          !getSecret(plugin, authTokenSecretId)
        ) {
          setSecret(plugin, authTokenSecretId, legacyAuthToken);
        }
        backend.authToken = undefined;
        migratedAuthToken = true;
        shouldSave = true;
      } catch (error) {
        console.warn('[Journalit] Failed to migrate auth token:', error);
      }
    }

    const legacyFTPPassword = normalizeSecret(backend.ftpPassword);
    if (legacyFTPPassword) {
      try {
        const ftpPasswordSecretId = getSecretId(
          plugin,
          FTP_PASSWORD_SECRET_NAME
        );
        if (
          options.overwriteExistingSecrets ||
          !getSecret(plugin, ftpPasswordSecretId)
        ) {
          setSecret(plugin, ftpPasswordSecretId, legacyFTPPassword);
        }
        backend.ftpPassword = undefined;
        migratedFTPPassword = true;
        shouldSave = true;
      } catch (error) {
        console.warn('[Journalit] Failed to migrate FTP password:', error);
      }
    }

    const authToken = this.getAuthToken(plugin);
    if (authToken) {
      ApiClient.setAuthToken(authToken);
    }

    if (shouldSave) {
      await plugin.saveSettings();
    }

    return { migratedAuthToken, migratedFTPPassword };
  }
}
