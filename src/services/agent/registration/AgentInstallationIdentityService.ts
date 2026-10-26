import { Platform, type App } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { generateUUID, isCanonicalNonNilUuid } from '../../../utils/uuid';
import {
  readSecretStorageValue,
  writeSecretStorageValue,
} from '../../backend/SecretStorageAccess';
import { getOrCreateVaultIdentifier } from '../../backend/VaultIdentity';

const AGENT_DEVICE_KEY_SECRET_ID = 'journalit-agent-device-key';
const AGENT_INSTALLATION_BINDINGS_SECRET_ID =
  'journalit-agent-installation-bindings';
const DEVICE_IDENTITY_INVALID_ERROR = 'Agent device identity is invalid.';
const DEVICE_IDENTITY_UNAVAILABLE_ERROR =
  'Agent device identity is unavailable.';
const VAULT_IDENTITY_UNAVAILABLE_ERROR = 'Agent vault identity is unavailable.';
const VAULT_DISPLAY_NAME_FALLBACK = 'Journalit vault';
const INSTALLATION_BINDING_INVALID_ERROR =
  'Agent installation binding is invalid.';
const INSTALLATION_BINDING_UNAVAILABLE_ERROR =
  'Agent installation binding is unavailable.';
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

interface AgentInstallationRegistrationIdentity {
  deviceKey: string;
  deviceDisplayName: string;
  platform: string;
  pluginVersion?: string;
  vaultKey: string;
  vaultDisplayName: string;
}

interface PlatformMetadata {
  token: string;
  displayName: string;
}

interface AgentInstallationIdentity {
  deviceId: string;
  vaultId: string;
  installationId: string;
}

interface StoredInstallationBinding extends AgentInstallationIdentity {
  vaultKey: string;
}

interface StoredInstallationBindings {
  deviceKey: string;
  installations: StoredInstallationBinding[];
}

function isLegacyInstallationBinding(value: unknown): boolean {
  return (
    isRecord(value) &&
    hasExactKeys(value, ['deviceId', 'vaultId', 'installationId']) &&
    isCanonicalNonNilUuid(value.deviceId) &&
    isCanonicalNonNilUuid(value.vaultId) &&
    isCanonicalNonNilUuid(value.installationId)
  );
}

function hasLegacyInstallationBindings(plugin: JournalitPlugin): boolean {
  const raw = readSecretStorageValue(
    plugin.app,
    AGENT_INSTALLATION_BINDINGS_SECRET_ID
  );
  if (raw === null) return false;
  try {
    const value: unknown = JSON.parse(raw);
    return (
      isRecord(value) &&
      hasExactKeys(value, ['deviceKey', 'installations']) &&
      typeof value.deviceKey === 'string' &&
      UUID_V4_PATTERN.test(value.deviceKey) &&
      Array.isArray(value.installations) &&
      value.installations.every(isLegacyInstallationBinding)
    );
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[]
): boolean {
  const keys = Object.keys(value);
  return (
    keys.length === expectedKeys.length &&
    expectedKeys.every((key) =>
      Object.prototype.hasOwnProperty.call(value, key)
    )
  );
}

function isStoredInstallationBinding(
  value: unknown
): value is StoredInstallationBinding {
  return (
    isRecord(value) &&
    hasExactKeys(value, [
      'vaultKey',
      'deviceId',
      'vaultId',
      'installationId',
    ]) &&
    typeof value.vaultKey === 'string' &&
    value.vaultKey.length > 0 &&
    value.vaultKey.length <= 128 &&
    isCanonicalNonNilUuid(value.deviceId) &&
    isCanonicalNonNilUuid(value.vaultId) &&
    isCanonicalNonNilUuid(value.installationId)
  );
}

function equalInstallationIdentity(
  left: StoredInstallationBinding,
  right: StoredInstallationBinding
): boolean {
  return (
    left.vaultKey === right.vaultKey &&
    left.deviceId === right.deviceId &&
    left.vaultId === right.vaultId &&
    left.installationId === right.installationId
  );
}

function sanitizeText(value: string): string {
  return value
    .replace(/\s/gu, ' ')
    .replace(/[\p{Cc}\p{Cf}]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim();
}

function truncateCodePoints(value: string, maximum: number): string {
  return Array.from(value).slice(0, maximum).join('');
}

function getPlatformMetadata(): PlatformMetadata {
  if (Platform.isIosApp) {
    return { token: 'ios', displayName: 'Obsidian on iOS' };
  }
  if (Platform.isAndroidApp) {
    return { token: 'android', displayName: 'Obsidian on Android' };
  }
  if (Platform.isWin) {
    return { token: 'windows', displayName: 'Obsidian on Windows' };
  }
  if (Platform.isMacOS) {
    return { token: 'macos', displayName: 'Obsidian on macOS' };
  }
  if (Platform.isLinux) {
    return { token: 'linux', displayName: 'Obsidian on Linux' };
  }
  if (Platform.isMobile || Platform.isMobileApp) {
    return { token: 'mobile', displayName: 'Obsidian on Mobile' };
  }
  if (Platform.isDesktop || Platform.isDesktopApp) {
    return { token: 'desktop', displayName: 'Obsidian on Desktop' };
  }
  return { token: 'unknown', displayName: 'Obsidian' };
}

function readDeviceSecret(app: App): string | null {
  try {
    return readSecretStorageValue(app, AGENT_DEVICE_KEY_SECRET_ID);
  } catch {
    throw new Error(DEVICE_IDENTITY_UNAVAILABLE_ERROR);
  }
}

function getOrCreateDeviceKey(plugin: JournalitPlugin): string {
  const storedValue = readDeviceSecret(plugin.app);

  if (storedValue !== null) {
    if (!UUID_V4_PATTERN.test(storedValue)) {
      throw new Error(DEVICE_IDENTITY_INVALID_ERROR);
    }
    return storedValue;
  }

  const deviceKey = generateUUID();
  try {
    writeSecretStorageValue(plugin.app, AGENT_DEVICE_KEY_SECRET_ID, deviceKey);
  } catch {
    throw new Error(DEVICE_IDENTITY_UNAVAILABLE_ERROR);
  }

  const persistedDeviceKey = readDeviceSecret(plugin.app);
  if (persistedDeviceKey !== deviceKey) {
    throw new Error(DEVICE_IDENTITY_UNAVAILABLE_ERROR);
  }
  return deviceKey;
}

function readInstallationBindings(
  plugin: JournalitPlugin
): StoredInstallationBindings | null {
  let storedValue: string | null;
  try {
    storedValue = readSecretStorageValue(
      plugin.app,
      AGENT_INSTALLATION_BINDINGS_SECRET_ID
    );
  } catch {
    throw new Error(INSTALLATION_BINDING_UNAVAILABLE_ERROR);
  }
  if (storedValue === null) return null;

  let value: unknown;
  try {
    value = JSON.parse(storedValue);
  } catch {
    throw new Error(INSTALLATION_BINDING_INVALID_ERROR);
  }
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['deviceKey', 'installations']) ||
    typeof value.deviceKey !== 'string' ||
    !UUID_V4_PATTERN.test(value.deviceKey) ||
    !Array.isArray(value.installations) ||
    !value.installations.every(isStoredInstallationBinding)
  ) {
    throw new Error(INSTALLATION_BINDING_INVALID_ERROR);
  }
  return {
    deviceKey: value.deviceKey,
    installations: value.installations.map((installation) => ({
      ...installation,
    })),
  };
}

export class AgentInstallationIdentityService {
  constructor(private readonly plugin: JournalitPlugin) {}

  public async getRegistrationIdentity(): Promise<AgentInstallationRegistrationIdentity> {
    const deviceKey = getOrCreateDeviceKey(this.plugin);
    let vaultKey: string;
    try {
      vaultKey = await getOrCreateVaultIdentifier(this.plugin);
    } catch {
      throw new Error(VAULT_IDENTITY_UNAVAILABLE_ERROR);
    }
    const platform = getPlatformMetadata();
    const sanitizedVaultName = truncateCodePoints(
      sanitizeText(this.plugin.app.vault.getName()),
      120
    ).trim();
    const sanitizedVersion = sanitizeText(this.plugin.manifest.version);

    return {
      deviceKey,
      deviceDisplayName: platform.displayName,
      platform: platform.token,
      ...(sanitizedVersion && Array.from(sanitizedVersion).length <= 64
        ? { pluginVersion: sanitizedVersion }
        : {}),
      vaultKey,
      vaultDisplayName: sanitizedVaultName || VAULT_DISPLAY_NAME_FALLBACK,
    };
  }

  public hasInstallationBinding(
    installation: AgentInstallationIdentity
  ): boolean {
    const vaultKey = this.plugin.settings.backendIntegration?.vaultIdentifier;
    if (!vaultKey) return false;
    const deviceKey = readDeviceSecret(this.plugin.app);
    if (deviceKey === null) return false;
    if (!UUID_V4_PATTERN.test(deviceKey)) {
      throw new Error(DEVICE_IDENTITY_INVALID_ERROR);
    }
    const bindings = readInstallationBindings(this.plugin);
    return (
      bindings !== null &&
      bindings.deviceKey === deviceKey &&
      bindings.installations.some((bound) =>
        equalInstallationIdentity(bound, { vaultKey, ...installation })
      )
    );
  }

  public persistInstallationBinding(
    installation: StoredInstallationBinding
  ): void {
    const currentVaultKey =
      this.plugin.settings.backendIntegration?.vaultIdentifier;
    if (
      !isStoredInstallationBinding(installation) ||
      installation.vaultKey !== currentVaultKey
    ) {
      throw new Error(INSTALLATION_BINDING_INVALID_ERROR);
    }
    const deviceKey = getOrCreateDeviceKey(this.plugin);
    let existing: StoredInstallationBindings | null;
    try {
      existing = readInstallationBindings(this.plugin);
    } catch (error) {
      if (!hasLegacyInstallationBindings(this.plugin)) throw error;
      existing = null;
    }
    if (existing !== null && existing.deviceKey !== deviceKey) {
      throw new Error(INSTALLATION_BINDING_INVALID_ERROR);
    }
    const installations = [...(existing?.installations ?? [])];
    if (
      !installations.some((bound) =>
        equalInstallationIdentity(bound, installation)
      )
    ) {
      installations.push({ ...installation });
    }
    try {
      writeSecretStorageValue(
        this.plugin.app,
        AGENT_INSTALLATION_BINDINGS_SECRET_ID,
        JSON.stringify({ deviceKey, installations })
      );
    } catch {
      throw new Error(INSTALLATION_BINDING_UNAVAILABLE_ERROR);
    }
    if (!this.hasInstallationBinding(installation)) {
      throw new Error(INSTALLATION_BINDING_UNAVAILABLE_ERROR);
    }
  }
}
