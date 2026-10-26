

import type { App } from 'obsidian';

export function normalizeSecretStorageValue(
  value: string | null | undefined
): string | null {
  if (!value) {
    return null;
  }

  return value.trim() ? value : null;
}

export function readSecretStorageValue(app: App, id: string): string | null {
  return normalizeSecretStorageValue(app.secretStorage?.getSecret(id));
}

export function writeSecretStorageValue(
  app: App,
  id: string,
  value: string
): void {
  if (!app.secretStorage) {
    throw new Error('Obsidian SecretStorage is unavailable');
  }
  app.secretStorage.setSecret(id, value);
}
