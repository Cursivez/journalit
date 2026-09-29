import type { Plugin } from 'obsidian';
import { isSupportedTimeZone } from '../services/propChallenge/normalization';

export const DEMO_PACK_VERSION = 4;
export const DEMO_MANIFEST_SCHEMA_VERSION = 1;
export const DEMO_DEFAULT_ROOT = 'Journalit Sample';
const DEMO_STATE_PARENT_DIRECTORY = 'journalit';
const DEMO_STATE_DIRECTORY = 'sample-journal';

export function getDemoStateDirectoryPath(plugin: Pick<Plugin, 'app'>): string {
  return `${plugin.app.vault.configDir}/${DEMO_STATE_PARENT_DIRECTORY}/${DEMO_STATE_DIRECTORY}`;
}

export async function ensureDemoStateDirectory(
  plugin: Pick<Plugin, 'app'>
): Promise<void> {
  const parent = `${plugin.app.vault.configDir}/${DEMO_STATE_PARENT_DIRECTORY}`;
  if (!(await plugin.app.vault.adapter.exists(parent))) {
    await plugin.app.vault.adapter.mkdir(parent);
  }
  const directory = getDemoStateDirectoryPath(plugin);
  if (!(await plugin.app.vault.adapter.exists(directory))) {
    await plugin.app.vault.adapter.mkdir(directory);
  }
}

export type DemoManifestPhase =
  | 'staging'
  | 'materializing'
  | 'validating'
  | 'active'
  | 'retiring'
  | 'failed'
  | 'removed';

export type DemoOwnedEntityKind =
  | 'trade'
  | 'missed-trade'
  | 'backtest-trade'
  | 'review'
  | 'setup'
  | 'support-note'
  | 'media';

export interface DemoOwnedEntity {
  entityId: string;
  kind: DemoOwnedEntityKind;
  path: string;
  contentHash?: string;
}

export function hashDemoMediaContent(content: ArrayBuffer): string {
  let hash = 2166136261;
  for (const byte of new Uint8Array(content)) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export interface DemoGenerationInputs {
  packVersion: number;
  seed: string;
  anchorInstant: string;
  timezone: string;
  weekStartDay: 'monday' | 'sunday';
}

export interface DemoManifest {
  schemaVersion: typeof DEMO_MANIFEST_SCHEMA_VERSION;
  instanceId: string;
  generation: number;
  root: string;
  phase: DemoManifestPhase;
  activeOnLastShutdown: boolean;
  inputs: DemoGenerationInputs;
  owned: DemoOwnedEntity[];
  createdAt: string;
  updatedAt: string;
  lastValidatedAt?: string;
  failureMessage?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function isCanonicalVaultPath(value: string): boolean {
  if (value.length === 0 || value.trim() !== value || value.startsWith('/')) {
    return false;
  }
  const segments = value.split('/');
  return segments.every(
    (segment) => segment.length > 0 && segment !== '.' && segment !== '..'
  );
}

const isPhase = (value: unknown): value is DemoManifestPhase =>
  value === 'staging' ||
  value === 'materializing' ||
  value === 'validating' ||
  value === 'active' ||
  value === 'retiring' ||
  value === 'failed' ||
  value === 'removed';

const isOwnedEntityKind = (value: unknown): value is DemoOwnedEntityKind =>
  value === 'trade' ||
  value === 'missed-trade' ||
  value === 'backtest-trade' ||
  value === 'review' ||
  value === 'setup' ||
  value === 'support-note' ||
  value === 'media';

function parseOwnedEntity(value: unknown): DemoOwnedEntity | null {
  if (!isRecord(value)) return null;
  const hasContentHash = 'contentHash' in value;
  const contentHash =
    typeof value.contentHash === 'string' ? value.contentHash : undefined;
  if (
    typeof value.entityId !== 'string' ||
    !isOwnedEntityKind(value.kind) ||
    typeof value.path !== 'string' ||
    (hasContentHash &&
      (value.kind !== 'media' ||
        contentHash === undefined ||
        !/^[0-9a-f]{8}$/.test(contentHash)))
  ) {
    return null;
  }
  return {
    entityId: value.entityId,
    kind: value.kind,
    path: value.path,
    contentHash,
  };
}

export function parseDemoManifest(value: unknown): DemoManifest | null {
  if (!isRecord(value)) return null;
  if (
    value.schemaVersion !== DEMO_MANIFEST_SCHEMA_VERSION ||
    typeof value.instanceId !== 'string' ||
    value.instanceId.length === 0 ||
    typeof value.generation !== 'number' ||
    !Number.isSafeInteger(value.generation) ||
    value.generation < 1 ||
    typeof value.root !== 'string' ||
    !isCanonicalVaultPath(value.root) ||
    !isPhase(value.phase) ||
    typeof value.activeOnLastShutdown !== 'boolean' ||
    !isRecord(value.inputs) ||
    typeof value.createdAt !== 'string' ||
    typeof value.updatedAt !== 'string' ||
    !Array.isArray(value.owned)
  ) {
    return null;
  }

  const weekStartDay = value.inputs.weekStartDay;
  if (
    typeof value.inputs.packVersion !== 'number' ||
    !Number.isSafeInteger(value.inputs.packVersion) ||
    value.inputs.packVersion < 1 ||
    typeof value.inputs.seed !== 'string' ||
    value.inputs.seed.length === 0 ||
    typeof value.inputs.anchorInstant !== 'string' ||
    Number.isNaN(new Date(value.inputs.anchorInstant).getTime()) ||
    typeof value.inputs.timezone !== 'string' ||
    value.inputs.timezone.length === 0 ||
    !isSupportedTimeZone(value.inputs.timezone) ||
    (weekStartDay !== 'monday' && weekStartDay !== 'sunday')
  ) {
    return null;
  }

  const owned = value.owned.flatMap((entry) => {
    const parsed = parseOwnedEntity(entry);
    return parsed ? [parsed] : [];
  });
  if (owned.length !== value.owned.length) return null;
  const entityIds = new Set<string>();
  const paths = new Set<string>();
  for (const entity of owned) {
    if (
      entity.entityId.length === 0 ||
      !isCanonicalVaultPath(entity.path) ||
      !entity.path.startsWith(`${value.root}/`) ||
      entityIds.has(entity.entityId) ||
      paths.has(entity.path)
    ) {
      return null;
    }
    entityIds.add(entity.entityId);
    paths.add(entity.path);
  }

  return {
    schemaVersion: DEMO_MANIFEST_SCHEMA_VERSION,
    instanceId: value.instanceId,
    generation: value.generation,
    root: value.root,
    phase: value.phase,
    activeOnLastShutdown: value.activeOnLastShutdown,
    inputs: {
      packVersion: value.inputs.packVersion,
      seed: value.inputs.seed,
      anchorInstant: value.inputs.anchorInstant,
      timezone: value.inputs.timezone,
      weekStartDay,
    },
    owned,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    lastValidatedAt:
      typeof value.lastValidatedAt === 'string'
        ? value.lastValidatedAt
        : undefined,
    failureMessage:
      typeof value.failureMessage === 'string'
        ? value.failureMessage
        : undefined,
  };
}

export function createDemoManifest(options: {
  instanceId: string;
  generation: number;
  root?: string;
  inputs: DemoGenerationInputs;
}): DemoManifest {
  const now = new Date().toISOString();
  return {
    schemaVersion: DEMO_MANIFEST_SCHEMA_VERSION,
    instanceId: options.instanceId,
    generation: options.generation,
    root: options.root ?? DEMO_DEFAULT_ROOT,
    phase: 'staging',
    activeOnLastShutdown: false,
    inputs: options.inputs,
    owned: [],
    createdAt: now,
    updatedAt: now,
  };
}

export class DemoManifestStore {
  constructor(private plugin: Plugin) {}

  getDirectoryPath(): string {
    return getDemoStateDirectoryPath(this.plugin);
  }

  getPath(): string {
    return `${this.getDirectoryPath()}/manifest.json`;
  }

  private getTemporaryPath(): string {
    return `${this.getPath()}.tmp`;
  }

  private getBackupPath(): string {
    return `${this.getPath()}.bak`;
  }

  async load(): Promise<DemoManifest | null> {
    for (const path of [this.getPath(), this.getBackupPath()]) {
      if (!(await this.plugin.app.vault.adapter.exists(path))) continue;
      try {
        const parseJson: (text: string) => unknown = JSON.parse;
        const manifest = parseDemoManifest(
          parseJson(await this.plugin.app.vault.adapter.read(path))
        );
        if (manifest) return manifest;
      } catch (error) {
        console.error(
          `[DemoManifestStore] Failed to read manifest checkpoint ${path}:`,
          error
        );
      }
    }
    return null;
  }

  async save(manifest: DemoManifest): Promise<void> {
    await ensureDemoStateDirectory(this.plugin);
    manifest.updatedAt = new Date().toISOString();
    const adapter = this.plugin.app.vault.adapter;
    const path = this.getPath();
    const temporaryPath = this.getTemporaryPath();
    const backupPath = this.getBackupPath();

    if (await adapter.exists(temporaryPath)) {
      await adapter.remove(temporaryPath);
    }
    await adapter.write(temporaryPath, JSON.stringify(manifest, null, 2));

    if (await adapter.exists(backupPath)) {
      await adapter.remove(backupPath);
    }
    const hadPreviousManifest = await adapter.exists(path);
    if (hadPreviousManifest) {
      await adapter.rename(path, backupPath);
    }
    try {
      await adapter.rename(temporaryPath, path);
    } catch (error) {
      if (
        hadPreviousManifest &&
        !(await adapter.exists(path)) &&
        (await adapter.exists(backupPath))
      ) {
        await adapter.rename(backupPath, path);
      }
      throw error;
    }
    if (await adapter.exists(backupPath)) {
      await adapter.remove(backupPath);
    }
  }

  async remove(): Promise<void> {
    for (const path of [
      this.getPath(),
      this.getTemporaryPath(),
      this.getBackupPath(),
    ]) {
      if (await this.plugin.app.vault.adapter.exists(path)) {
        await this.plugin.app.vault.adapter.remove(path);
      }
    }
  }
}
