import type JournalitPlugin from '../../main';
import { normalizePath, parseYaml } from 'obsidian';
import {
  getTradeProjectionVaultId,
  queueTradeProjectionAck,
} from './TradeProjectionAckQueue';
import { getTradeProjectionOwnerId } from './TradeProjectionOwnership';
import type { CustomFieldKeyMigration } from '../CustomFieldsService';
import {
  CANONICAL_PROJECTION_CUSTOM_FIELD_MIGRATION_KEYS,
  CUSTOM_FIELD_KEY_MIGRATION_KEYS,
  validateFieldKey,
} from '../../types/customFields';
import { getTradeIdentityNoteType } from '../../utils/tradeIdentity';
import {
  isSampleOwnedFrontmatter,
  SAMPLE_ENTITY_ID_FRONTMATTER_KEY,
  SAMPLE_INSTANCE_FRONTMATTER_KEY,
} from '../../demo/DemoOwnership';
import { DemoSyncGate } from '../../demo/DemoSyncGate';

const CANONICAL_PROJECTION_SCHEMA_VERSION = 1;
const CANONICAL_PROJECTION_MIGRATION_VERSION = 4;
const PROJECTION_OWNED_CUSTOM_FIELD_MIGRATION_KEYS = new Set<string>(
  CANONICAL_PROJECTION_CUSTOM_FIELD_MIGRATION_KEYS
);
const MIGRATABLE_CUSTOM_FIELD_KEYS = new Set<string>(
  CUSTOM_FIELD_KEY_MIGRATION_KEYS
);

type ProjectionIdentity = {
  id: string;
  version: number;
  legacy: boolean;
};

type MarkdownFile = ReturnType<
  JournalitPlugin['app']['vault']['getMarkdownFiles']
>[number];

type MigrationDocument = {
  file: MarkdownFile;
  frontmatter: Record<string, unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasOwnKey(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key) === true;
}

function parsePendingCustomFieldKeyMigrations(
  value: unknown
): CustomFieldKeyMigration[] | null {
  if (value === undefined) return null;
  if (!Array.isArray(value)) {
    throw new Error('Invalid pending custom-field key migration');
  }
  return value.map((item) => {
    if (!isRecord(item)) {
      throw new Error('Invalid pending custom-field key migration');
    }
    const { fieldId, sourceKey, targetKey } = item;
    if (
      typeof fieldId !== 'string' ||
      fieldId.length === 0 ||
      typeof sourceKey !== 'string' ||
      sourceKey.length === 0 ||
      typeof targetKey !== 'string' ||
      targetKey.length === 0 ||
      sourceKey === targetKey ||
      !MIGRATABLE_CUSTOM_FIELD_KEYS.has(sourceKey) ||
      validateFieldKey(targetKey) !== null
    ) {
      throw new Error('Invalid pending custom-field key migration');
    }
    return { fieldId, sourceKey, targetKey };
  });
}

function projectionIdentity(
  frontmatter: Record<string, unknown>,
  filePath: string,
  migratingCustomFieldKeys: ReadonlySet<string>
): ProjectionIdentity | null {
  const hasCanonicalSchema =
    frontmatter.canonicalProjectionSchemaVersion ===
    CANONICAL_PROJECTION_SCHEMA_VERSION;
  const idValue = hasCanonicalSchema
    ? frontmatter.canonicalTradeId
    : frontmatter.tradeImportId;
  const versionValue = hasCanonicalSchema
    ? frontmatter.canonicalTradeVersion
    : frontmatter.tradeImportVersion;
  const identityKeysAreMigrating = hasCanonicalSchema
    ? [
        'canonicalProjectionSchemaVersion',
        'canonicalTradeId',
        'canonicalTradeVersion',
      ].some((key) => migratingCustomFieldKeys.has(key))
    : ['tradeImportId', 'tradeImportVersion'].some((key) =>
        migratingCustomFieldKeys.has(key)
      );
  const independentOwnershipKeys = hasCanonicalSchema
    ? [
        'canonicalAccountId',
        'canonicalBroker',
        'canonicalAccountDisplayName',
        'canonicalProjectionGeneration',
      ]
    : [
        'tradeImportAccountId',
        'tradeImportAccountBroker',
        'tradeImportAccountDisplayName',
      ];
  const hasIndependentOwnershipMarker = independentOwnershipKeys.some(
    (key) =>
      !migratingCustomFieldKeys.has(key) &&
      frontmatter[key] !== undefined &&
      frontmatter[key] !== null &&
      frontmatter[key] !== ''
  );
  const hasValidIdentity =
    typeof idValue === 'string' &&
    idValue.trim() !== '' &&
    idValue === idValue.trim() &&
    typeof versionValue === 'number' &&
    Number.isInteger(versionValue) &&
    versionValue > 0;
  if (
    hasValidIdentity &&
    (!identityKeysAreMigrating || hasIndependentOwnershipMarker)
  ) {
    return {
      id: idValue.trim(),
      version: versionValue,
      legacy: !hasCanonicalSchema,
    };
  }
  if (hasValidIdentity && identityKeysAreMigrating) return null;

  if (
    !hasCanonicalSchema ||
    (hasCanonicalSchema &&
      migratingCustomFieldKeys.has('canonicalProjectionSchemaVersion'))
  ) {
    return null;
  }
  
  
  
  if (!hasIndependentOwnershipMarker) return null;
  throw new Error(`Invalid projection identity in ${filePath}`);
}

function hasProjectionMarkerInYaml(yaml: string): boolean {
  const canonicalMarker = new RegExp(
    `^\\s*canonicalProjectionSchemaVersion\\s*:\\s*${CANONICAL_PROJECTION_SCHEMA_VERSION}\\s*$`,
    'm'
  ).test(yaml);
  const legacyMarkers =
    /^\s*tradeImportId\s*:/m.test(yaml) &&
    /^\s*tradeImportVersion\s*:/m.test(yaml);
  return canonicalMarker || legacyMarkers;
}

function isCustomFieldTradeNote(
  frontmatter: Record<string, unknown>,
  filePath: string,
  journalFolderPath: string,
  migratingCustomFieldKeys: ReadonlySet<string>
): boolean {
  const sampleOwnershipKeyIsMigrating = [
    SAMPLE_INSTANCE_FRONTMATTER_KEY,
    SAMPLE_ENTITY_ID_FRONTMATTER_KEY,
  ].some(
    (key) => migratingCustomFieldKeys.has(key) && hasOwnKey(frontmatter, key)
  );
  if (isSampleOwnedFrontmatter(frontmatter) && !sampleOwnershipKeyIsMigrating) {
    return false;
  }

  if (
    typeof frontmatter.type === 'string' &&
    frontmatter.type !== 'trade' &&
    frontmatter.type !== 'missed-trade' &&
    frontmatter.type !== 'backtest-trade'
  ) {
    return false;
  }
  const normalizedFilePath = normalizePath(filePath);
  const normalizedJournalPath = normalizePath(journalFolderPath);
  const isJournalPath =
    !normalizedFilePath.includes('-backup-') &&
    (normalizedFilePath === normalizedJournalPath ||
      normalizedFilePath.startsWith(`${normalizedJournalPath}/`));
  return (
    frontmatter.type === 'trade' ||
    frontmatter.type === 'missed-trade' ||
    frontmatter.type === 'backtest-trade' ||
    frontmatter.isMissedTrade === true ||
    frontmatter.isMissedTrade === 'true' ||
    frontmatter.isBacktestTrade === true ||
    frontmatter.isBacktestTrade === 'true' ||
    (isJournalPath && /-[TMB]\d+\.md$/i.test(filePath))
  );
}

function migrateCustomFieldValues(
  frontmatter: Record<string, unknown>,
  migrations: readonly CustomFieldKeyMigration[],
  preserveProjectionOwnedSources: boolean
): void {
  for (const migration of migrations) {
    const hasSource = hasOwnKey(frontmatter, migration.sourceKey);
    if (!hasSource) continue;
    const hasTarget = hasOwnKey(frontmatter, migration.targetKey);
    if (
      hasTarget &&
      JSON.stringify(frontmatter[migration.targetKey]) !==
        JSON.stringify(frontmatter[migration.sourceKey])
    ) {
      throw new Error('Custom field migration target became occupied');
    }
    if (!hasTarget) {
      frontmatter[migration.targetKey] = frontmatter[migration.sourceKey];
    }
    if (
      !preserveProjectionOwnedSources ||
      !PROJECTION_OWNED_CUSTOM_FIELD_MIGRATION_KEYS.has(migration.sourceKey)
    ) {
      delete frontmatter[migration.sourceKey];
    }
  }
}

export class CanonicalProjectionMigrationService {
  private running: Promise<void> | null = null;

  constructor(private readonly plugin: JournalitPlugin) {}

  run(): Promise<void> {
    if (DemoSyncGate.isActive()) return Promise.resolve();
    if (
      (this.plugin.settings.backendIntegration
        ?.canonicalProjectionMigrationVersion ?? 0) >=
      CANONICAL_PROJECTION_MIGRATION_VERSION
    ) {
      return Promise.resolve();
    }
    if (this.running) return this.running;
    this.running = this.migrate().finally(() => {
      this.running = null;
    });
    return this.running;
  }

  private async migrate(): Promise<void> {
    await this.plugin.tradeService.waitForTradeDataReady();
    const journalFolderPath =
      this.plugin.serviceManager.getFolderPathService().journalFolderPath;
    const documents: MigrationDocument[] = [];
    const occupiedFrontmatterKeys = new Set<string>();
    for (const file of this.plugin.app.vault.getMarkdownFiles()) {
      const frontmatter = await this.readFrontmatter(file);
      if (!frontmatter) continue;
      documents.push({ file, frontmatter });
      if (
        isCustomFieldTradeNote(
          frontmatter,
          file.path,
          journalFolderPath,
          
          
          MIGRATABLE_CUSTOM_FIELD_KEYS
        )
      ) {
        for (const key of Object.keys(frontmatter)) {
          occupiedFrontmatterKeys.add(key);
        }
      }
    }
    const settings = this.plugin.settings.backendIntegration;
    await this.queuePendingConflictAcknowledgements();
    const pendingCustomFieldKeyMigrations =
      parsePendingCustomFieldKeyMigrations(
        settings?.canonicalProjectionCustomFieldKeyMigrations
      );
    const customFieldKeyMigrations =
      pendingCustomFieldKeyMigrations ??
      this.plugin.customFieldsService.planCanonicalProjectionFieldKeyMigrations(
        occupiedFrontmatterKeys
      );
    if (
      pendingCustomFieldKeyMigrations === null &&
      customFieldKeyMigrations.length > 0
    ) {
      if (!settings) {
        throw new Error(
          'Backend settings unavailable for custom-field migration'
        );
      }
      settings.canonicalProjectionCustomFieldKeyMigrations =
        customFieldKeyMigrations;
      try {
        await this.plugin.saveSettings();
      } catch (error) {
        delete settings.canonicalProjectionCustomFieldKeyMigrations;
        throw error;
      }
    }
    const migratingCustomFieldKeys = new Set(
      customFieldKeyMigrations.map((migration) => migration.sourceKey)
    );
    const projectedNotes = new Map<
      string,
      Array<{ path: string; version: number }>
    >();

    
    
    for (const { file, frontmatter } of documents) {
      if (
        !isCustomFieldTradeNote(
          frontmatter,
          file.path,
          journalFolderPath,
          migratingCustomFieldKeys
        )
      ) {
        continue;
      }
      const fileCustomFieldMigrations = customFieldKeyMigrations.filter(
        (migration) => hasOwnKey(frontmatter, migration.sourceKey)
      );
      const identity =
        getTradeIdentityNoteType(frontmatter, file.path) !== 'trade'
          ? null
          : projectionIdentity(
              frontmatter,
              file.path,
              migratingCustomFieldKeys
            );
      if (identity) {
        projectedNotes.set(identity.id, [
          ...(projectedNotes.get(identity.id) ?? []),
          { path: file.path, version: identity.version },
        ]);
      }
      if (fileCustomFieldMigrations.length === 0 && !identity?.legacy) {
        continue;
      }
      await this.plugin.app.fileManager.processFrontMatter(
        file,
        (current: Record<string, unknown>) => {
          migrateCustomFieldValues(
            current,
            fileCustomFieldMigrations,
            identity !== null
          );
          if (identity?.legacy) {
            current.canonicalTradeId = identity.id;
            current.canonicalTradeVersion = identity.version;
            current.canonicalAccountId = current.tradeImportAccountId;
            current.canonicalBroker = current.tradeImportAccountBroker;
            current.canonicalAccountDisplayName =
              current.tradeImportAccountDisplayName;
            current.canonicalProjectionSchemaVersion =
              CANONICAL_PROJECTION_SCHEMA_VERSION;
            delete current.tradeImportId;
            delete current.tradeImportVersion;
            delete current.tradeImportAccountId;
            delete current.tradeImportAccountBroker;
            delete current.tradeImportAccountDisplayName;
          }
        }
      );
      if (identity?.legacy) {
        await this.waitForCanonicalMetadata(
          file,
          identity.id,
          identity.version
        );
      }
    }
    await this.plugin.customFieldsService.applyFieldKeyMigrations(
      customFieldKeyMigrations
    );
    const duplicateResults = [...projectedNotes.entries()].flatMap(
      ([tradeId, notes]) =>
        notes.length > 1
          ? [
              {
                tradeId,
                backendTradeVersion: Math.max(
                  ...notes.map((note) => note.version)
                ),
                filePath: notes[0].path,
                status: 'conflict' as const,
                errorCode: 'duplicate_canonical_projection' as const,
              },
            ]
          : []
    );
    if (duplicateResults.length > 0) {
      if (!settings) {
        throw new Error(
          'Backend settings unavailable for canonical projection conflicts'
        );
      }
      const ownerUserId = getTradeProjectionOwnerId(this.plugin);
      const claimableResults = ownerUserId
        ? duplicateResults.filter(
            (result) =>
              settings.canonicalTradeProjectionOwners?.[result.tradeId] ===
              ownerUserId
          )
        : [];
      const claimableResultsSet = new Set(claimableResults);
      const quarantinedResults = duplicateResults.filter(
        (result) => !claimableResultsSet.has(result)
      );
      if (claimableResults.length > 0) {
        await queueTradeProjectionAck(this.plugin, {
          vaultId: await getTradeProjectionVaultId(this.plugin),
          results: claimableResults,
        });
      }
      if (quarantinedResults.length > 0) {
        settings.pendingCanonicalProjectionMigrationAcks = [
          ...(settings.pendingCanonicalProjectionMigrationAcks ?? []),
          ...quarantinedResults,
        ];
      }
    }
    if (settings) {
      const previousVersion = settings.canonicalProjectionMigrationVersion;
      const pendingMigrations =
        settings.canonicalProjectionCustomFieldKeyMigrations;
      settings.canonicalProjectionMigrationVersion =
        CANONICAL_PROJECTION_MIGRATION_VERSION;
      delete settings.canonicalProjectionCustomFieldKeyMigrations;
      try {
        await this.plugin.saveSettings();
      } catch (error) {
        if (previousVersion === undefined) {
          delete settings.canonicalProjectionMigrationVersion;
        } else {
          settings.canonicalProjectionMigrationVersion = previousVersion;
        }
        if (pendingMigrations !== undefined) {
          settings.canonicalProjectionCustomFieldKeyMigrations =
            pendingMigrations;
        }
        throw error;
      }
    }
  }

  async queuePendingConflictAcknowledgements(): Promise<void> {
    const settings = this.plugin.settings.backendIntegration;
    const pending = settings?.pendingCanonicalProjectionMigrationAcks;
    const ownerUserId = getTradeProjectionOwnerId(this.plugin);
    if (!settings || !pending?.length || !ownerUserId) return;
    const claimable = pending.filter(
      (result) =>
        settings.canonicalTradeProjectionOwners?.[result.tradeId] ===
        ownerUserId
    );
    if (claimable.length === 0) return;
    const claimableSet = new Set(claimable);
    const quarantined = pending.filter((result) => !claimableSet.has(result));
    await queueTradeProjectionAck(this.plugin, {
      vaultId: await getTradeProjectionVaultId(this.plugin),
      results: claimable,
    });
    if (quarantined.length > 0) {
      settings.pendingCanonicalProjectionMigrationAcks = quarantined;
    } else {
      delete settings.pendingCanonicalProjectionMigrationAcks;
    }
    try {
      await this.plugin.saveSettings();
    } catch (error) {
      settings.pendingCanonicalProjectionMigrationAcks = pending;
      throw error;
    }
  }

  private async readFrontmatter(
    file: MarkdownFile
  ): Promise<Record<string, unknown> | null> {
    const cached = this.plugin.app.metadataCache.getFileCache(file);
    if (cached) return cached.frontmatter ?? null;

    const content = await this.plugin.app.vault.cachedRead(file);
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!match) return null;
    try {
      const parsed: unknown = parseYaml(match[1]);
      if (!isRecord(parsed)) {
        throw new Error('frontmatter is not an object');
      }
      return parsed;
    } catch {
      if (!hasProjectionMarkerInYaml(match[1])) return null;
      throw new Error(`Unable to inspect frontmatter in ${file.path}`);
    }
  }

  private async waitForCanonicalMetadata(
    file: Parameters<
      JournalitPlugin['app']['metadataCache']['getFileCache']
    >[0],
    tradeId: string,
    version: number
  ): Promise<void> {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const frontmatter =
        this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;
      
      if (!frontmatter) return;
      if (
        frontmatter.canonicalTradeId === tradeId &&
        frontmatter.canonicalTradeVersion === version
      ) {
        return;
      }
      await new Promise<void>((resolve) => window.setTimeout(resolve, 50));
    }
    throw new Error(`Metadata cache did not refresh for ${file.path}`);
  }
}
