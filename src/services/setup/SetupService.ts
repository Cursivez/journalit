

import {
  App,
  TFile,
  TFolder,
  normalizePath,
  parseYaml,
  type FrontMatterCache,
} from 'obsidian';
import type JournalitPlugin from '../../main';
import type {
  DemoJournalMutationContext,
  DemoSessionService,
} from '../../demo/DemoSessionService';
import {
  CustomDataService,
  CustomDataServiceConfig,
  type CachedQueryDependency,
} from '../base/CustomDataService';
import {
  ConvertUnmanagedSetupLabelData,
  Setup,
  SetupData,
  SetupFilter,
  SetupMetrics,
  SetupRefResolution,
  SetupRule,
  SetupRuleCategory,
  SetupRuleGroup,
} from './types';
import { validateSetupData, validateSetupId } from './validation';
import {
  assertCompleteSetupDiscovery,
  normalizeSetupReadError,
  SETUP_IDENTITY_UNAVAILABLE_ERROR,
  SetupNoteFormatError,
} from './setupReadErrors';
import { SetupMetricsCalculator } from './metrics';
import { TradeService } from '../trade/TradeService';
import { eventBus } from '../events/EventBus';
import { type PreviousTagAssignments } from '../options/CustomOptionsService';
import type { SetupOptionWriter } from '../options/setupOptionWriter';
import {
  forceMetadataCacheRefresh,
  readFrontmatterFromDisk,
} from '../../utils/dataRefresh';
import {
  readFileContentForMutation,
  replaceFileContent,
  replaceFileContentIfUnchanged,
} from '../../utils/fileMutation';
import { getSetupHistoryDateRange } from './setupHistoryRange';
import { normalizeLabelColor, type LabelColor } from '../../types/labelColor';
import { normalizeSetupKey } from './setupIdentity';
import { SETUP_FRONTMATTER_KEY } from './constants';
import {
  getSampleEntityId,
  getSampleInstanceId,
  SAMPLE_ENTITY_ID_FRONTMATTER_KEY,
  SAMPLE_INSTANCE_FRONTMATTER_KEY,
} from '../../demo/DemoOwnership';
import { deduplicateOptions } from '../../utils/stringNormalization';
import { commitSetupShortcutRename } from './setupShortcutRename';
import {
  SetupChangedError,
  SetupDeletionOutcomeError,
} from './setupDeletionErrors';
import { resolveJournalFolderPath } from '../../utils/tagOptionNoteEligibility';
import {
  compareSetupIdentityOrder,
  generateSetupAgentId,
  isSetupAgentId,
  separateSetupAgentIdFrontmatter,
  SETUP_AGENT_ID_FRONTMATTER_KEY,
  upsertSetupAgentId,
} from '../agent/identity/setupIdentityStore';

const SETUPS_FOLDER_NAME = 'Setups';
const FRONTMATTER_BLOCK_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const SETUP_MARKER_LINE_PATTERN = new RegExp(
  `^${SETUP_FRONTMATTER_KEY}:\\s*true\\s*$`,
  'm'
);
const SETUP_MARKER_KEY_PATTERN = new RegExp(`^${SETUP_FRONTMATTER_KEY}\\s*:`);
const FRONTMATTER_TAGS_KEY_PATTERN = /^(?:tags|'tags'|"tags")\s*:/;
const SETUP_WARNING =
  '==⚠ This is a Journalit Setup file. Journalit opens it in the Setup view by default. If you are reading this as markdown, use the note menu / pane details menu and choose “Open as Journalit Setup” to return to the setup editor. This markdown exists for portability, search, and manual reference; create and edit setups through Journalit’s Setups view. ⚠==';
interface SetupFileRecord {
  file: TFile;
  setup: Setup;
}

interface ExistingSetupDiscoveryResult {
  setups: Setup[];
  errors: Array<{ filePath: string; message: string }>;
}

interface SetupDiscoveryOptions {
  suppressPathWarnings?: boolean;
  readFromDisk?: boolean;
}

interface MarkdownSection {
  heading: string;
  level: number;
  startLine: number;
  contentStartLine: number;
  endLine: number;
}

function matchFrontmatterBlock(content: string): RegExpMatchArray | null {
  return content.match(FRONTMATTER_BLOCK_PATTERN);
}

interface FlowCollectionScan {
  endIndex?: number;
  nodeProperties: string[];
}

function scanFlowCollection(
  lines: string[],
  keyLineIndex: number
): FlowCollectionScan {
  let squareDepth = 0;
  let curlyDepth = 0;
  let quote: 'single' | 'double' | undefined;
  let collectionStarted = false;
  const nodeProperties: string[] = [];
  const keyValueStartIndex = lines[keyLineIndex].indexOf(':') + 1;

  for (let lineIndex = keyLineIndex; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const startIndex = lineIndex === keyLineIndex ? keyValueStartIndex : 0;

    for (let index = startIndex; index < line.length; index += 1) {
      const character = line[index];
      if (!collectionStarted) {
        if (/\s/.test(character)) continue;
        if (character === '#') break;
        if (character === '&' || character === '!') {
          const propertyStart = index;
          while (index + 1 < line.length && !/\s/.test(line[index + 1])) {
            index += 1;
          }
          nodeProperties.push(line.slice(propertyStart, index + 1));
          continue;
        }
        if (character !== '[' && character !== '{') {
          return { nodeProperties };
        }
      }
      if (quote === 'single') {
        if (character === "'") {
          if (line[index + 1] === "'") index += 1;
          else quote = undefined;
        }
        continue;
      }
      if (quote === 'double') {
        if (character === '\\') index += 1;
        else if (character === '"') quote = undefined;
        continue;
      }
      if (character === '#') break;
      if (character === "'") {
        quote = 'single';
        continue;
      }
      if (character === '"') {
        quote = 'double';
        continue;
      }
      if (character === '[') {
        squareDepth += 1;
        collectionStarted = true;
      } else if (character === ']') {
        squareDepth -= 1;
      } else if (character === '{') {
        curlyDepth += 1;
        collectionStarted = true;
      } else if (character === '}') {
        curlyDepth -= 1;
      }

      if (collectionStarted && squareDepth === 0 && curlyDepth === 0) {
        return { endIndex: lineIndex, nodeProperties };
      }
    }
  }

  return { nodeProperties };
}


export class SetupService extends CustomDataService {
  private metricsCalculator: SetupMetricsCalculator;
  private materializePromise: Promise<void> | null = null;
  private legacyMigrationPromise: Promise<void> | null = null;
  private mutationQueue: Promise<void> = Promise.resolve();
  private setupRecordsGeneration = 0;

  constructor(
    app: App,
    private tradeService: TradeService,
    config: CustomDataServiceConfig = {}
  ) {
    super(app, {
      folder: undefined,
      extension: '.md',
      cacheTTL: 5 * 60 * 1000,
      persistCache: false,
      namespace: config.namespace || 'setup',
    });
    this.metricsCalculator = new SetupMetricsCalculator();
  }

  public override setPlugin(plugin: JournalitPlugin): void {
    super.setPlugin(plugin);
    plugin.registerEvent(
      this.app.vault.on('rename', (file, oldPath) => {
        if (!(file instanceof TFolder)) return;
        const setupsFolderPath = this.getSetupsFolderPath();
        if (
          !this.pathsIntersect(file.path, setupsFolderPath) &&
          !this.pathsIntersect(oldPath, setupsFolderPath)
        ) {
          return;
        }
        this.setupRecordsGeneration += 1;
        void this.clearCache();
      })
    );
  }

  
  protected override cachedQueriesDependingOn(
    path: string,
    _frontmatter: FrontMatterCache | undefined
  ): CachedQueryDependency {
    return this.isPathInSetupsFolder(path) ? 'all' : null;
  }

  public getAllSetupMetricsFromTradeData(
    setups: Setup[],
    tradeData: Array<Record<string, unknown>>
  ): Map<string, SetupMetrics> {
    return this.metricsCalculator.calculateMetricsForSetupsFromTradeData(
      setups,
      tradeData
    );
  }

  
  public async listSetups(filter?: SetupFilter): Promise<Setup[]> {
    await this.materializeTradeSetups();
    const { records, errors } = await this.discoverSetupFileRecords();
    if (errors.length > 0) {
      throw new Error(
        `Failed to load setup files: ${errors
          .map(({ filePath, message }) => `${filePath}: ${message}`)
          .join('; ')}`
      );
    }
    return this.filterSetups(
      records.map((record) => record.setup),
      filter
    );
  }

  
  public async listExistingSetups(filter?: SetupFilter): Promise<Setup[]> {
    const records = await this.listSetupFileRecords();
    return this.filterSetups(
      records.map((record) => record.setup),
      filter
    );
  }

  public async listExistingSetupsWithErrors(
    filter?: SetupFilter
  ): Promise<ExistingSetupDiscoveryResult> {
    const { records, errors } = await this.discoverSetupFileRecords();
    return {
      setups: this.filterSetups(
        records.map((record) => record.setup),
        filter
      ),
      errors,
    };
  }

  public async listSetupsForAgentIdentityStrict(): Promise<Setup[]> {
    try {
      await this.materializeTradeSetups({ suppressPathWarnings: true });
      const discovery = await this.discoverSetupFileRecords({
        suppressPathWarnings: true,
      });
      assertCompleteSetupDiscovery(discovery);
      return discovery.records.map((record) => record.setup);
    } catch (error) {
      throw normalizeSetupReadError(error);
    }
  }

  
  public async readExistingSetupDefinitionsStrict(): Promise<Setup[]> {
    try {
      const discovery = await this.discoverSetupFileRecords({
        suppressPathWarnings: true,
        readFromDisk: true,
      });
      assertCompleteSetupDiscovery(discovery);
      return discovery.records.map((record) => record.setup);
    } catch (error) {
      throw normalizeSetupReadError(error);
    }
  }

  public async ensureAgentEntityId(currentSetupId: string): Promise<string> {
    const identities = await this.ensureAgentEntityIds([currentSetupId]);
    const identity = identities.get(currentSetupId);
    if (!identity) throw new Error('Setup identity is unavailable');
    return identity;
  }

  public async ensureAgentEntityIds(
    setupNames: readonly string[]
  ): Promise<ReadonlyMap<string, string | null>> {
    return this.runMutationExclusive(async () => {
      try {
        return await this.ensureAgentEntityIdsNow(setupNames);
      } catch (error) {
        throw normalizeSetupReadError(error);
      }
    });
  }

  
  public async getSetupLabelColors(): Promise<Record<string, LabelColor>> {
    const records = await this.listSetupFileRecords();
    const colors: Record<string, LabelColor> = {};
    for (const { setup } of records) {
      if (setup.color) {
        colors[normalizeSetupKey(setup.name)] = setup.color;
      }
    }
    return colors;
  }

  
  public async getSetupById(id: string): Promise<Setup | null> {
    validateSetupId(id);
    await this.materializeTradeSetups();
    const records = await this.listSetupFileRecords();
    return (
      records.find(
        ({ setup }) =>
          setup.id === id ||
          normalizeSetupKey(setup.id) === normalizeSetupKey(id)
      )?.setup ?? null
    );
  }

  
  public async resolveSetupRef(raw: string): Promise<SetupRefResolution> {
    await this.materializeTradeSetups();
    return this.resolveSetupRefFromSetups(raw, await this.listSetups());
  }

  
  public async listUnmanagedSetupLabels(): Promise<string[]> {
    await this.materializeTradeSetups();
    return [];
  }

  
  public async convertUnmanagedSetupLabel(
    label: string,
    data: ConvertUnmanagedSetupLabelData = {}
  ): Promise<Setup> {
    const legacyLabel = label.trim();
    if (!legacyLabel) throw new Error('Setup label is required');

    const resolution = await this.resolveSetupRef(legacyLabel);
    if (resolution.kind === 'resolved' && resolution.setup) {
      return resolution.setup;
    }
    if (resolution.kind === 'ambiguous') {
      throw new Error(`Cannot convert ambiguous setup label: ${legacyLabel}`);
    }

    return this.createSetup({
      ...data,
      name: data.name?.trim() || legacyLabel,
    });
  }

  public async createSetup(inputData: SetupData): Promise<Setup> {
    const snapshot = structuredClone(inputData);
    return this.runMutationExclusive(() => this.createSetupNow(snapshot));
  }

  private async createSetupNow(inputData: SetupData): Promise<Setup> {
    const { data, ownership } = this.prepareSetupOwnership(inputData);
    const errors = validateSetupData(data);
    if (errors.length) {
      throw new Error(
        `Invalid setup data: ${errors.map((e) => e.message).join(', ')}`
      );
    }

    const name = data.name.trim();
    const existingRecords =
      await this.listSetupFileRecordsWithoutMaterialization();
    const existing = this.resolveSetupRefFromSetups(
      name,
      existingRecords.map((record) => record.setup)
    );
    if (existing.kind === 'resolved') {
      throw new Error(`Setup already exists: ${name}`);
    }

    const folder = await this.ensureSetupFolder();
    const filePath = this.getUniqueSetupFilePath(folder.path, name);
    return this.runWithTagAssignments(data.tags ?? [], async () => {
      await this.app.vault.create(filePath, this.serializeNewSetup(data));
      try {
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (!(file instanceof TFile)) {
          throw new Error(`Failed to create setup file: ${filePath}`);
        }
        await forceMetadataCacheRefresh(this.app, file);
        await this.clearCache();
        await this.recordSetupOwnership(filePath, ownership);
        const setup = await this.parseSetupFile(file);
        this.publishChanged('created', setup);
        return setup;
      } catch (error) {
        
        
        const failures = [error];
        try {
          await this.clearCache();
        } catch (refreshError) {
          failures.push(refreshError);
        }
        throw new AggregateError(
          failures,
          'A setup note was created, but creation could not finish. Review it in Journalit before retrying.'
        );
      }
    });
  }

  public async updateSetup(
    id: string,
    data: Partial<SetupData>
  ): Promise<Setup> {
    const snapshot = structuredClone(data);
    return this.runMutationExclusive(() => this.updateSetupNow(id, snapshot));
  }

  private async updateSetupNow(
    id: string,
    data: Partial<SetupData>
  ): Promise<Setup> {
    validateSetupId(id);
    const plugin = this.plugin;
    if (!plugin) {
      throw new Error('Plugin not initialized - cannot update setup');
    }
    const assertContext = this.captureMutationContext(plugin);
    const record = await this.requireSetupFileRecord(id);
    const originalPath = record.file.path;
    assertContext();
    const currentContent = await readFileContentForMutation(
      this.app,
      record.file
    );
    const existing = this.parseSetupMutationTarget(record.file, currentContent);
    if (normalizeSetupKey(existing.id) !== normalizeSetupKey(record.setup.id)) {
      throw new Error(
        'Setup changed before the update. Refresh it before retrying.'
      );
    }

    if (Object.keys(data).length > 0) {
      const validationTarget: SetupData = {
        name: data.name ?? existing.name,
        ...data,
        rules: data.rules ?? existing.rules,
        ruleGroups: data.ruleGroups ?? existing.ruleGroups,
      };
      const errors = validateSetupData(validationTarget);
      if (errors.length) {
        throw new Error(
          `Invalid setup data: ${errors.map((e) => e.message).join(', ')}`
        );
      }
    }

    const nextName = data.name?.trim() || existing.name;
    if (nextName !== existing.name) {
      const duplicate = (await this.listSetupFileRecords()).find(
        ({ file, setup }) =>
          file.path !== record.file.path &&
          normalizeSetupKey(setup.name) === normalizeSetupKey(nextName)
      );
      if (duplicate) {
        throw new Error(`Setup already exists: ${nextName}`);
      }
    }
    return this.runWithTagAssignments(
      data.tags ?? existing.tags,
      async (writer) => {
        assertContext();
        if (record.file.path !== originalPath)
          throw new Error(
            'Setup moved during the update. Refresh it before retrying.'
          );
        const nextContent = this.updateSetupMarkdown(currentContent, existing, {
          ...data,
          name: nextName,
        });
        const shortcutRemap =
          nextName !== existing.name
            ? await commitSetupShortcutRename(plugin, existing.id, nextName)
            : null;
        let installedPath = originalPath;
        let targetFile = record.file;
        let setupWriteStarted = false;
        let referenceRollback: (() => Promise<void>) | undefined;
        try {
          assertContext();
          setupWriteStarted = true;
          const replaced = await replaceFileContentIfUnchanged(
            this.app,
            record.file,
            currentContent,
            nextContent
          );
          if (replaced === 'stale') {
            setupWriteStarted = false;
            throw new Error(
              'Setup changed during the update. Refresh it before retrying.'
            );
          }

          if (nextName !== existing.name) {
            const newPath = this.getRenamedSetupPath(
              record.file.path,
              nextName
            );
            if (newPath !== record.file.path) {
              await this.app.fileManager.renameFile(record.file, newPath);
              installedPath = newPath;
              const renamed = this.app.vault.getAbstractFileByPath(newPath);
              if (!(renamed instanceof TFile))
                throw new Error('Setup was removed during the update.');
              targetFile = renamed;
            }
            if (writer) {
              assertContext();
              if (
                (await readFileContentForMutation(this.app, targetFile)) !==
                nextContent
              )
                throw new Error(
                  'Setup changed during the update. Refresh it before retrying.'
                );
              const renamed = await writer.rename(
                existing.name,
                nextName,
                true
              );
              if (!renamed.success)
                throw new Error(`Setup name is already in use: ${nextName}`);
              referenceRollback = () => renamed.rollback();
            }
          }

          await Promise.all([
            forceMetadataCacheRefresh(this.app, targetFile),
            this.clearCache(),
          ]);
          const writtenContent = await readFileContentForMutation(
            this.app,
            targetFile
          );
          if (writtenContent !== nextContent)
            throw new Error(
              'Setup changed during the update. Refresh it before retrying.'
            );
          const updated = this.parseSetupContent(targetFile, writtenContent);
          assertContext();
          shortcutRemap?.assertCurrent();
          if (targetFile.path !== originalPath) {
            await plugin.demoSessionService?.recordMovedEntity(
              originalPath,
              targetFile.path
            );
          }
          if (shortcutRemap?.changed) {
            eventBus.publish('entity-shortcuts:changed', { surface: 'all' });
          }
          this.publishChanged('updated', updated);
          return updated;
        } catch (error) {
          const rollbackErrors: unknown[] = [];
          if (referenceRollback) {
            try {
              await referenceRollback();
            } catch (rollbackError) {
              rollbackErrors.push(rollbackError);
            }
          }
          if (setupWriteStarted) {
            try {
              const restoredFile =
                this.app.vault.getAbstractFileByPath(installedPath);
              if (
                !(restoredFile instanceof TFile) ||
                targetFile.path !== installedPath
              ) {
                throw new Error(
                  'Cannot restore a setup that has been moved or removed during the update.'
                );
              }
              const current = await readFileContentForMutation(
                this.app,
                restoredFile
              );
              if (
                current !== currentContent &&
                (await replaceFileContentIfUnchanged(
                  this.app,
                  restoredFile,
                  nextContent,
                  currentContent
                )) === 'stale'
              ) {
                throw new Error('Cannot restore a setup with newer edits.');
              }
              if (installedPath !== originalPath) {
                if (this.app.vault.getAbstractFileByPath(originalPath)) {
                  throw new Error(
                    'Cannot restore a setup because its original path is occupied.'
                  );
                }
                await this.app.fileManager.renameFile(
                  restoredFile,
                  originalPath
                );
              }
              await forceMetadataCacheRefresh(this.app, restoredFile);
            } catch (rollbackError) {
              rollbackErrors.push(rollbackError);
            }
          }
          if (shortcutRemap?.changed) {
            try {
              await shortcutRemap.rollback();
            } catch (rollbackError) {
              rollbackErrors.push(rollbackError);
            }
            eventBus.publish('entity-shortcuts:changed', { surface: 'all' });
          }
          try {
            await this.clearCache();
          } catch (rollbackError) {
            rollbackErrors.push(rollbackError);
          }
          if (rollbackErrors.length > 0) {
            throw new AggregateError(
              [error, ...rollbackErrors],
              `Failed to update setup and fully restore ${existing.name}`
            );
          }
          throw error;
        }
      },
      async () =>
        this.normalizeSetupTags(
          (await readFrontmatterFromDisk(this.app, record.file)).tags
        )
    );
  }

  public async archiveSetup(id: string): Promise<Setup> {
    const setup = await this.updateSetup(id, { status: 'archived' });
    eventBus.publish('setup:changed', {
      action: 'archived',
      setupId: setup.id,
      timestamp: Date.now(),
    });
    return setup;
  }

  
  public async getSetupNoteRevision(
    id: string
  ): Promise<{ path: string; revision: string }> {
    const record = await this.requireSetupFileRecord(id);
    const content = await readFileContentForMutation(this.app, record.file);
    return { path: record.file.path, revision: await contentRevision(content) };
  }

  
  public async deleteSetup(
    id: string,
    guard?: { revision: string; unreferenced: boolean }
  ): Promise<void> {
    return this.runMutationExclusive(() => this.deleteSetupNow(id, guard));
  }

  private async deleteSetupNow(
    id: string,
    guard: { revision: string; unreferenced: boolean } | undefined
  ): Promise<void> {
    validateSetupId(id);
    const plugin = this.plugin;
    if (!plugin)
      throw new Error('Plugin not initialized - cannot delete setup');
    const assertContext = this.captureMutationContext(plugin);
    const record = await this.requireSetupFileRecord(id);
    const path = record.file.path;
    const content = await readFileContentForMutation(this.app, record.file);
    
    if (guard && (await contentRevision(content)) !== guard.revision)
      throw new SetupChangedError();
    const setup = this.parseSetupMutationTarget(record.file, content);
    if (normalizeSetupKey(setup.id) !== normalizeSetupKey(record.setup.id))
      throw new Error(
        'Setup changed before deletion. Refresh it before retrying.'
      );
    const requireCurrentTarget = async (): Promise<TFile> => {
      assertContext();
      const current = this.app.vault.getAbstractFileByPath(path);
      if (
        !(current instanceof TFile) ||
        record.file.path !== path ||
        (await readFileContentForMutation(this.app, current)) !== content ||
        current.path !== path
      ) {
        throw new Error(
          'Setup changed before deletion. Refresh it before retrying.'
        );
      }
      assertContext();
      return current;
    };
    assertContext();
    await this.runWithTagAssignments([], async (writer) => {
      if (!writer)
        throw new Error(
          'Setup reference persistence is unavailable. Wait for Journalit to finish loading.'
        );
      await requireCurrentTarget();
      const references = await writer.remove(setup.name, {
        expectNone: guard?.unreferenced ?? false,
      });
      if (!references.success)
        throw new Error('Setup reference removal was refused.');
      let trashAttempted = false;
      try {
        const current = await requireCurrentTarget();
        
        
        trashAttempted = true;
        await this.app.fileManager.trashFile(current);
      } catch (error) {
        const failures: unknown[] = [error];
        let canRestore = false;
        try {
          const current = this.app.vault.getAbstractFileByPath(path);
          if (current instanceof TFile) {
            const currentContent = await readFileContentForMutation(
              this.app,
              current
            );
            if (trashAttempted) {
              
              
              
              
              canRestore = currentContent === content;
            } else {
              
              
              const remaining = this.parseSetupMutationTarget(
                current,
                currentContent
              );
              canRestore =
                normalizeSetupKey(remaining.id) ===
                  normalizeSetupKey(setup.id) &&
                remaining.agentEntityId === setup.agentEntityId;
            }
          }
        } catch (inspectionError) {
          failures.push(inspectionError);
        }
        if (!canRestore) {
          try {
            await this.clearCache();
          } catch (refreshError) {
            failures.push(refreshError);
          }
          throw new SetupDeletionOutcomeError('unknown', failures);
        }
        try {
          await references.rollback();
        } catch (rollbackError) {
          failures.push(rollbackError);
        }
        try {
          await this.clearCache();
        } catch (refreshError) {
          failures.push(refreshError);
        }
        if (failures.length > 1)
          throw new AggregateError(
            failures,
            'Failed to delete setup and fully restore its references. Review the affected trades before retrying.'
          );
        throw error;
      }
      try {
        await this.clearCache();
      } catch (error) {
        this.publishChanged('deleted', setup);
        throw new SetupDeletionOutcomeError('deleted', [error]);
      }
      this.publishChanged('deleted', setup);
    });
  }

  private captureMutationContext(plugin: JournalitPlugin): () => void {
    const settingsRoot = plugin.settings;
    const journalFolder = resolveJournalFolderPath(settingsRoot);
    const activeFolder = this.getJournalFolderPath();
    return () => {
      if (
        this.plugin !== plugin ||
        plugin.settings !== settingsRoot ||
        resolveJournalFolderPath(settingsRoot) !== journalFolder ||
        this.getJournalFolderPath() !== activeFolder
      ) {
        throw new Error(
          'Journal settings changed during the setup operation. Review them before retrying.'
        );
      }
    };
  }

  
  public async getSetups(filter?: SetupFilter): Promise<Setup[]> {
    return this.listSetups(filter);
  }

  public async isSetupFile(file: TFile): Promise<boolean> {
    const normalized = normalizePath(file.path);
    if (!normalized.endsWith('.md')) return false;

    const cache = this.app.metadataCache.getFileCache(file);
    if (cache?.frontmatter?.[SETUP_FRONTMATTER_KEY]) return true;

    const content = await this.app.vault.cachedRead(file);
    return this.hasSetupFrontmatterMarker(content);
  }

  public async getSetupByFilePath(path: string): Promise<Setup | null> {
    const file = this.app.vault.getAbstractFileByPath(normalizePath(path));
    if (!(file instanceof TFile) || !(await this.isSetupFile(file)))
      return null;
    return this.parseSetupFile(file);
  }

  public getSetupsFolderPath(): string {
    return this.getJournalFolderPath(SETUPS_FOLDER_NAME);
  }

  private async materializeTradeSetups(
    discoveryOptions: SetupDiscoveryOptions = {}
  ): Promise<void> {
    if (this.materializePromise) return this.materializePromise;
    this.materializePromise = this.runMutationExclusive(() =>
      this.materializeTradeSetupsNow(discoveryOptions)
    ).finally(() => {
      this.materializePromise = null;
    });
    return this.materializePromise;
  }

  private runMutationExclusive<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.mutationQueue.then(operation, operation);
    this.mutationQueue = result.then(
      () => undefined,
      () => undefined
    );
    return result;
  }

  private runWithTagAssignments<T>(
    tags: readonly string[],
    operation: (writer: SetupOptionWriter | undefined) => Promise<T>,
    previousTags: PreviousTagAssignments = []
  ): Promise<T> {
    return this.plugin?.optionsService
      ? this.plugin.optionsService.runWithSetupTagAssignments(
          tags,
          operation,
          previousTags
        )
      : operation(undefined);
  }

  private getJournalMutationContext(): DemoJournalMutationContext {
    return (
      this.plugin?.demoSessionService?.getJournalMutationContext() ?? 'real'
    );
  }

  private prepareSetupOwnership(inputData: SetupData): {
    data: SetupData;
    ownership: ReturnType<DemoSessionService['claimNewOwnership']>;
  } {
    const ownership =
      !inputData.journalitSampleInstance || !inputData.journalitSampleEntityId
        ? (this.plugin?.demoSessionService?.claimNewOwnership('setup') ?? null)
        : null;
    return {
      data: ownership
        ? {
            ...inputData,
            journalitSampleInstance: ownership.instanceId,
            journalitSampleEntityId: ownership.entityId,
          }
        : inputData,
      ownership,
    };
  }

  private async recordSetupOwnership(
    filePath: string,
    ownership: ReturnType<DemoSessionService['claimNewOwnership']>
  ): Promise<void> {
    if (!ownership) return;
    await this.plugin?.demoSessionService?.recordCreatedEntity(
      filePath,
      ownership
    );
  }

  private async materializeTradeSetupsNow(
    discoveryOptions: SetupDiscoveryOptions = {}
  ): Promise<void> {
    const mutationContext = this.getJournalMutationContext();
    if (mutationContext === 'deferred') return;

    await this.createMissingSetupNotes(
      await this.collectSetupLabels(),
      mutationContext,
      discoveryOptions
    );
  }

  
  public migrateLegacySetupOptions(): Promise<void> {
    this.legacyMigrationPromise ??=
      this.runLegacySetupOptionsMigration().finally(() => {
        this.legacyMigrationPromise = null;
      });
    return this.legacyMigrationPromise;
  }

  private async runLegacySetupOptionsMigration(): Promise<void> {
    const optionsService = this.plugin?.optionsService;
    if (!optionsService) return;

    await optionsService.migrateLegacySetupOptions((names) =>
      this.runMutationExclusive(async () => {
        if (this.getJournalMutationContext() !== 'real') return false;
        return this.createMissingSetupNotes(
          [...names, ...(await this.collectSetupLabels())],
          'real'
        );
      })
    );
  }

  
  public async ensureSetup(label: string): Promise<Setup> {
    const name = label.trim();
    if (!name) throw new Error('Setup label is required');

    return this.runMutationExclusive(async () => {
      const resolution = this.resolveSetupRefFromSetups(
        name,
        (await this.listSetupFileRecordsWithoutMaterialization()).map(
          (record) => record.setup
        )
      );
      if (resolution.kind === 'resolved' && resolution.setup) {
        return resolution.setup;
      }
      if (resolution.kind === 'ambiguous') {
        throw new Error(`Setup label is ambiguous: ${name}`);
      }
      return this.createSetupNow({ name });
    });
  }

  
  private async createMissingSetupNotes(
    labels: readonly string[],
    mutationContext: Exclude<DemoJournalMutationContext, 'deferred'>,
    discoveryOptions: SetupDiscoveryOptions = {}
  ): Promise<boolean> {
    const discovery = await this.discoverSetupFileRecords(discoveryOptions);
    const existingNames = new Set(
      [
        ...discovery.records.map((record) => record.setup.name),
        ...discovery.rejectedNames,
      ].map(normalizeSetupKey)
    );

    const namesToCreate: string[] = [];
    for (const label of labels) {
      const name = label.trim();
      const normalizedName = normalizeSetupKey(name);
      if (!name || existingNames.has(normalizedName)) continue;
      existingNames.add(normalizedName);
      namesToCreate.push(name);
    }
    if (namesToCreate.length === 0) return true;

    const folder = await this.ensureSetupFolder();
    
    
    const createdFilePaths = await namesToCreate.reduce<Promise<string[]>>(
      async (previousPaths, name) => {
        const paths = await previousPaths;
        if (this.getJournalMutationContext() !== mutationContext) {
          return paths;
        }
        const { data, ownership } = this.prepareSetupOwnership({
          name,
          playbookMarkdown: '',
        });
        const filePath = this.getUniqueSetupFilePath(folder.path, name);
        await this.app.vault.create(filePath, this.serializeNewSetup(data));
        await this.recordSetupOwnership(filePath, ownership);
        return [...paths, filePath];
      },
      Promise.resolve([])
    );

    await Promise.all(
      createdFilePaths.map(async (filePath) => {
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file instanceof TFile)
          await forceMetadataCacheRefresh(this.app, file);
      })
    );
    await this.clearCache();
    if (createdFilePaths.length > 0) {
      eventBus.publish('setup:changed', {
        action: 'created',
        filePaths: createdFilePaths,
        timestamp: Date.now(),
      });
    }
    return createdFilePaths.length === namesToCreate.length;
  }

  private pathsIntersect(path: string, folderPath: string): boolean {
    const candidate = normalizePath(path).replace(/\/$/, '');
    const folder = normalizePath(folderPath).replace(/\/$/, '');
    return (
      candidate === folder ||
      candidate.startsWith(`${folder}/`) ||
      folder.startsWith(`${candidate}/`)
    );
  }

  private async listSetupFileRecords(): Promise<SetupFileRecord[]> {
    return this.query(
      async () => this.listSetupFileRecordsWithoutMaterialization(),
      `setups:records:${this.setupRecordsGeneration}`,
      { offlineCapable: true }
    );
  }

  private async listSetupFileRecordsWithoutMaterialization(): Promise<
    SetupFileRecord[]
  > {
    return (await this.discoverSetupFileRecords()).records;
  }

  private async discoverSetupFileRecords(
    options: SetupDiscoveryOptions = {}
  ): Promise<{
    records: SetupFileRecord[];
    errors: Array<{ filePath: string; message: string }>;
    rejectedNames: string[];
    hasInvalidNotes: boolean;
  }> {
    const setupFolderPath = this.getSetupsFolderPath();
    const files = this.app.vault
      .getMarkdownFiles()
      .filter((file) => this.isPathInSetupsFolder(file.path, setupFolderPath));

    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const content = options.readFromDisk
            ? await this.app.vault.read(file)
            : undefined;
          const isSetup =
            content === undefined
              ? await this.isSetupFile(file)
              : this.hasSetupFrontmatterMarker(content);
          if (!isSetup) {
            return { record: null, error: undefined };
          }
          return {
            record: {
              file,
              setup:
                content === undefined
                  ? await this.parseSetupFile(file)
                  : this.parseSetupContent(file, content),
            },
            error: undefined,
          };
        } catch (error) {
          if (!options.suppressPathWarnings) {
            console.warn(`Failed to parse setup file ${file.path}:`, error);
          }
          let rejectedName = file.basename;
          try {
            const content = await this.app.vault.cachedRead(file);
            rejectedName =
              this.extractTitle(this.stripFrontmatter(content)) ||
              file.basename;
          } catch {
            // intentional
          }
          return {
            record: null,
            error: {
              filePath: file.path,
              message: error instanceof Error ? error.message : String(error),
            },
            rejectedName,
            invalidNote: error instanceof SetupNoteFormatError,
          };
        }
      })
    );

    const records = results
      .flatMap(({ record }) => (record ? [record] : []))
      .sort(
        (a, b) =>
          a.setup.order - b.setup.order ||
          a.setup.name.localeCompare(b.setup.name)
      );
    const errors = results.flatMap(({ error }) => (error ? [error] : []));
    const rejectedNames = results.flatMap(({ rejectedName }) =>
      rejectedName ? [rejectedName] : []
    );
    return {
      records,
      errors,
      rejectedNames,
      hasInvalidNotes: results.some((result) => result.invalidNote === true),
    };
  }

  private async requireSetupFileRecord(id: string): Promise<SetupFileRecord> {
    const records = await this.listSetupFileRecords();
    const normalized = normalizeSetupKey(id);
    const record = records.find(
      ({ setup }) =>
        setup.id === id || normalizeSetupKey(setup.name) === normalized
    );
    if (!record) throw new Error(`Setup not found: ${id}`);
    return record;
  }

  private async ensureAgentEntityIdsNow(
    setupNames: readonly string[]
  ): Promise<ReadonlyMap<string, string | null>> {
    const discovery = await this.discoverSetupFileRecords({
      suppressPathWarnings: true,
    });
    assertCompleteSetupDiscovery(discovery);

    const setups = discovery.records.map((record) => record.setup);
    const recordsByPath = new Map(
      discovery.records.map((record) => [record.setup.filePath, record])
    );
    const requestedRecords = new Map<string, SetupFileRecord>();
    const resolvedPaths = new Map<string, string | null>();
    for (const setupName of setupNames) {
      const resolution = this.resolveSetupRefFromSetups(setupName, setups);
      const filePath =
        resolution.kind === 'resolved' ? resolution.setup?.filePath : undefined;
      const record = filePath ? recordsByPath.get(filePath) : undefined;
      const recordFilePath = record?.setup.filePath;
      resolvedPaths.set(setupName, recordFilePath ?? null);
      if (recordFilePath) {
        requestedRecords.set(recordFilePath, record);
      }
    }

    const currentContents = new Map(
      await Promise.all(
        Array.from(
          requestedRecords,
          async ([filePath, record]) =>
            [
              filePath,
              await readFileContentForMutation(this.app, record.file),
            ] as const
        )
      )
    );
    const usedIds = new Set(
      discovery.records.flatMap(({ setup }) =>
        setup.agentEntityId ? [setup.agentEntityId] : []
      )
    );
    const identitiesByPath = new Map<string, string>();
    const writes: Array<{
      record: SetupFileRecord;
      currentContent: string;
      nextContent: string;
    }> = [];
    for (const [filePath, record] of requestedRecords) {
      const currentContent = currentContents.get(filePath);
      if (currentContent === undefined) {
        throw new Error(SETUP_IDENTITY_UNAVAILABLE_ERROR);
      }
      const currentFrontmatter = this.parseSetupFrontmatter(currentContent);
      const parsedId = currentFrontmatter[SETUP_AGENT_ID_FRONTMATTER_KEY];
      const currentId = isSetupAgentId(parsedId) ? parsedId : undefined;
      let identity =
        currentId &&
        this.isSetupAgentIdWinner(record.setup, discovery.records, currentId)
          ? currentId
          : undefined;
      if (!identity) {
        do {
          identity = generateSetupAgentId();
        } while (usedIds.has(identity));
      }
      usedIds.add(identity);
      identitiesByPath.set(filePath, identity);
      const nextContent = upsertSetupAgentId(currentContent, identity);
      if (nextContent !== currentContent) {
        writes.push({ record, currentContent, nextContent });
      }
    }

    const completedWrites: typeof writes = [];
    try {
      
      for (const write of writes) {
        const latestContent = await readFileContentForMutation(
          this.app,
          write.record.file
        );
        if (latestContent !== write.currentContent) {
          throw new Error(SETUP_IDENTITY_UNAVAILABLE_ERROR);
        }
        await replaceFileContent(
          this.app,
          write.record.file,
          write.nextContent
        );
        completedWrites.push(write);
      }
      if (writes.length > 0) {
        await Promise.all(
          writes.map(({ record }) =>
            forceMetadataCacheRefresh(this.app, record.file)
          )
        );
        await this.clearCache();
      }
    } catch {
      let rollbackIncomplete = false;
      
      for (const write of completedWrites.reverse()) {
        try {
          const latestContent = await readFileContentForMutation(
            this.app,
            write.record.file
          );
          if (latestContent !== write.nextContent) {
            rollbackIncomplete = true;
            continue;
          }
          await replaceFileContent(
            this.app,
            write.record.file,
            write.currentContent
          );
        } catch {
          rollbackIncomplete = true;
        }
      }
      if (completedWrites.length > 0) {
        await Promise.allSettled(
          completedWrites.map(({ record }) =>
            forceMetadataCacheRefresh(this.app, record.file)
          )
        );
        await this.clearCache();
      }
      if (rollbackIncomplete) {
        console.error('Setup identity batch rollback was incomplete.');
      }
      throw new Error(SETUP_IDENTITY_UNAVAILABLE_ERROR);
    }

    return new Map(
      Array.from(resolvedPaths, ([requestedName, filePath]) => [
        requestedName,
        filePath ? (identitiesByPath.get(filePath) ?? null) : null,
      ])
    );
  }

  private isSetupAgentIdWinner(
    setup: Setup,
    records: SetupFileRecord[],
    agentEntityId: string
  ): boolean {
    const matching = records
      .map((record) => record.setup)
      .filter((candidate) =>
        candidate.filePath === setup.filePath
          ? true
          : candidate.agentEntityId === agentEntityId
      )
      .sort(compareSetupIdentityOrder);
    return matching[0]?.filePath === setup.filePath;
  }

  private async parseSetupFile(file: TFile): Promise<Setup> {
    const content = await this.app.vault.cachedRead(file);
    return this.parseSetupContent(file, content);
  }

  private parseSetupMutationTarget(file: TFile, content: string): Setup {
    const frontmatter = this.parseSetupFrontmatter(content);
    if (frontmatter[SETUP_FRONTMATTER_KEY] !== true) {
      throw new SetupNoteFormatError(
        'The note is no longer a setup definition'
      );
    }
    return this.parseSetupContent(file, content, frontmatter);
  }

  private parseSetupContent(
    file: TFile,
    content: string,
    frontmatter: Record<string, unknown> = this.parseSetupFrontmatter(content)
  ): Setup {
    const body = this.stripFrontmatter(content);
    const title = this.extractTitle(body) || file.basename;
    const details = this.parseDetailsSection(body);
    const linkedNotes = this.parseLinkedNotesSection(body);
    const ruleData = this.parseRulesSection(body);
    const timestamps = this.getSetupTimestamps(file);

    return {
      id: title,
      agentEntityId: isSetupAgentId(frontmatter[SETUP_AGENT_ID_FRONTMATTER_KEY])
        ? frontmatter[SETUP_AGENT_ID_FRONTMATTER_KEY]
        : undefined,
      name: title,
      filePath: file.path,
      aliases: [],
      status: this.parseStatus(details.status),
      color: normalizeLabelColor(details.color?.toLowerCase()),
      icon: 'trading_setup',
      tags: this.normalizeSetupTags(frontmatter.tags),
      preferredSessions: this.parseStringList(details['preferred sessions']),
      preferredTimeframes: this.parseStringList(
        details['preferred timeframes']
      ),
      preferredTickers: this.parseStringList(details['preferred tickers']),
      direction: this.parseDirection(details.direction),
      playbookMarkdown: this.getSectionContent(body, 'Playbook'),
      ruleGroups: ruleData.ruleGroups,
      rules: ruleData.rules,
      ruleSetVersion: 1,
      linkedNotes,
      version: 1,
      createdAt: timestamps.createdAt,
      updatedAt: timestamps.updatedAt,
      order: 0,
      journalitSampleInstance: getSampleInstanceId(frontmatter) ?? undefined,
      journalitSampleEntityId: getSampleEntityId(frontmatter) ?? undefined,
    };
  }

  private serializeNewSetup(data: SetupData): string {
    const name = data.name.trim();
    const status = data.status ?? 'active';
    const tags = this.normalizeSetupTags(data.tags);
    const details = this.serializeDetailsContent({
      status,
      direction: data.direction,
      color: data.color ?? undefined,
      preferredSessions: data.preferredSessions,
      preferredTimeframes: data.preferredTimeframes,
      preferredTickers: data.preferredTickers,
    });

    const rules = Array.isArray(data.rules)
      ? this.serializeRulesSection(data.rules, data.ruleGroups ?? [])
      : typeof data.rules === 'string'
        ? data.rules.trim()
        : '';

    return [
      '---',
      `${SETUP_FRONTMATTER_KEY}: true`,
      ...(data.journalitSampleInstance
        ? [
            `${SAMPLE_INSTANCE_FRONTMATTER_KEY}: ${JSON.stringify(data.journalitSampleInstance)}`,
          ]
        : []),
      ...(data.journalitSampleEntityId
        ? [
            `${SAMPLE_ENTITY_ID_FRONTMATTER_KEY}: ${JSON.stringify(data.journalitSampleEntityId)}`,
          ]
        : []),
      `${SETUP_AGENT_ID_FRONTMATTER_KEY}: ${generateSetupAgentId()}`,
      `tags: ${JSON.stringify(tags)}`,
      '---',
      '',
      `# ${name}`,
      '',
      SETUP_WARNING,
      '',
      '## Details',
      '',
      details,
      '',
      '## Linked Notes',
      '',
      ...(data.linkedNotes ?? []).map(
        (path) => `- [[${path.replace(/\.md$/i, '')}]]`
      ),
      '',
      '## Rules',
      '',
      rules,
      '',
      '## Playbook',
      '',
      data.playbookMarkdown?.trim() || '',
      '',
      '## Common Mistakes',
      '',
    ].join('\n');
  }

  private updateSetupMarkdown(
    content: string,
    existing: Setup,
    data: Partial<SetupData> & { name: string }
  ): string {
    let body = this.stripFrontmatter(content);
    body = this.ensureWarning(body);
    body = this.replaceTitle(body, data.name);

    const hasDirectionPatch = Object.keys(data).includes('direction');
    const hasColorPatch = Object.keys(data).includes('color');
    const detailUpdates: Array<{ key: string; value?: string }> = [];
    if (data.status !== undefined) {
      detailUpdates.push({
        key: 'Status',
        value: this.formatStatus(data.status),
      });
    }
    if (hasDirectionPatch) {
      detailUpdates.push({
        key: 'Direction',
        value: data.direction
          ? this.formatDirection(data.direction)
          : undefined,
      });
    }
    if (hasColorPatch) {
      detailUpdates.push({
        key: 'Color',
        value: data.color ?? undefined,
      });
    }
    if (data.preferredSessions !== undefined) {
      detailUpdates.push({
        key: 'Preferred Sessions',
        value: this.serializeStringList(data.preferredSessions),
      });
    }
    if (data.preferredTimeframes !== undefined) {
      detailUpdates.push({
        key: 'Preferred Timeframes',
        value: this.serializeStringList(data.preferredTimeframes),
      });
    }
    if (data.preferredTickers !== undefined) {
      detailUpdates.push({
        key: 'Preferred Tickers',
        value: this.serializeStringList(data.preferredTickers),
      });
    }
    if (detailUpdates.length > 0) {
      body = this.replaceSection(
        body,
        'Details',
        this.mergeDetailsContent(
          this.getSectionContent(body, 'Details'),
          detailUpdates
        )
      );
    }

    if (data.linkedNotes !== undefined) {
      body = this.replaceSection(
        body,
        'Linked Notes',
        data.linkedNotes
          .map((path) => `- [[${path.replace(/\.md$/i, '')}]]`)
          .join('\n')
      );
    }

    if (typeof data.rules === 'string') {
      body = this.replaceSection(body, 'Rules', data.rules.trim());
    } else if (Array.isArray(data.rules) || Array.isArray(data.ruleGroups)) {
      body = this.replaceSection(
        body,
        'Rules',
        this.serializeRulesSection(
          Array.isArray(data.rules) ? data.rules : existing.rules,
          Array.isArray(data.ruleGroups) ? data.ruleGroups : existing.ruleGroups
        )
      );
    }

    if (data.playbookMarkdown !== undefined) {
      body = this.replaceSection(
        body,
        'Playbook',
        data.playbookMarkdown.trim()
      );
    }

    return this.mergeSetupFrontmatter(
      content,
      body,
      data.tags === undefined ? undefined : this.normalizeSetupTags(data.tags)
    );
  }

  private serializeDetailsContent(details: {
    status?: Setup['status'];
    direction?: Setup['direction'];
    color?: Setup['color'];
    preferredSessions?: string[];
    preferredTimeframes?: string[];
    preferredTickers?: string[];
  }): string {
    return [
      ['Status', details.status ? this.formatStatus(details.status) : ''],
      [
        'Direction',
        details.direction ? this.formatDirection(details.direction) : '',
      ],
      ['Color', details.color ?? ''],
      [
        'Preferred Sessions',
        this.serializeStringList(details.preferredSessions),
      ],
      [
        'Preferred Timeframes',
        this.serializeStringList(details.preferredTimeframes),
      ],
      ['Preferred Tickers', this.serializeStringList(details.preferredTickers)],
    ]
      .flatMap(([key, value]) => (value ? [`- ${key}: ${value}`] : []))
      .join('\n');
  }

  private mergeDetailsContent(
    content: string,
    updates: Array<{ key: string; value?: string }>
  ): string {
    const updatesByKey = new Map(
      updates.map((update) => [update.key.toLowerCase(), update])
    );
    const applied = new Set<string>();
    const lines = content.split(/\r?\n/).flatMap((line) => {
      const match = line.match(/^\s*-\s*([^:]+):\s*(.*)$/);
      if (!match) return [line];
      const key = match[1].trim().toLowerCase();
      const update = updatesByKey.get(key);
      if (!update) return [line];
      applied.add(key);
      return update.value ? [`- ${update.key}: ${update.value}`] : [];
    });

    for (const update of updates) {
      const key = update.key.toLowerCase();
      if (!applied.has(key) && update.value) {
        lines.push(`- ${update.key}: ${update.value}`);
      }
    }

    return lines.join('\n').trim();
  }

  private serializeRulesSection(
    rules: SetupRule[],
    groups: SetupRuleGroup[]
  ): string {
    const fallbackGroups = this.groupRulesByCategory(rules);
    const orderedGroups =
      groups.length > 0
        ? Array.from(groups).sort((a, b) => a.order - b.order)
        : fallbackGroups;

    return orderedGroups
      .map((group) => {
        const groupRules = rules
          .filter((rule) =>
            groups.length > 0
              ? rule.groupId === group.id
              : rule.category === group.id
          )
          .sort((a, b) => a.order - b.order);
        return [
          `### ${group.name}`,
          '',
          ...groupRules.map((rule) => {
            const optional = rule.required ? '' : ' _(optional)_';
            const descriptionLines = rule.description
              ?.replace(/\r\n?/g, '\n')
              .trim()
              .split('\n');
            return [
              `- [ ] ${rule.label}${optional}${descriptionLines?.[0] ? ` — ${descriptionLines[0]}` : ''}`,
              ...(descriptionLines?.slice(1).map((line) => `    ${line}`) ??
                []),
            ].join('\n');
          }),
        ].join('\n');
      })
      .join('\n\n');
  }

  private groupRulesByCategory(rules: SetupRule[]): SetupRuleGroup[] {
    const categories = [...new Set(rules.map((rule) => rule.category))];
    return categories.map((category, index) => ({
      id: category,
      name: this.formatRuleCategory(category),
      order: index,
    }));
  }

  private async ensureSetupFolder(): Promise<TFolder> {
    const journalFolderPath = this.getJournalFolderPath();
    await this.ensureFolderPath(journalFolderPath);
    const setupFolderPath = this.getSetupsFolderPath();
    await this.ensureFolderPath(setupFolderPath);
    const folder = this.app.vault.getAbstractFileByPath(setupFolderPath);
    if (!(folder instanceof TFolder)) {
      throw new Error(`Unable to create setup folder: ${setupFolderPath}`);
    }
    return folder;
  }

  private async ensureFolderPath(path: string): Promise<void> {
    const segments = normalizePath(path).split('/').filter(Boolean);
    await this.ensureFolderSegments(segments, '');
  }

  private async ensureFolderSegments(
    segments: string[],
    currentPath: string
  ): Promise<void> {
    const [segment, ...remaining] = segments;
    if (!segment) return;
    const current = currentPath ? `${currentPath}/${segment}` : segment;
    const existing = this.app.vault.getAbstractFileByPath(current);
    if (!existing) await this.app.vault.createFolder(current);
    await this.ensureFolderSegments(remaining, current);
  }

  private getJournalFolderPath(...segments: string[]): string {
    const folderPathService =
      this.plugin?.serviceManager?.getFolderPathService?.();
    if (folderPathService) return folderPathService.getPath(...segments);
    throw new Error('FolderPathService is unavailable');
  }

  private getUniqueSetupFilePath(folderPath: string, name: string): string {
    const baseName = this.sanitizeFileName(name) || 'Setup';
    let candidate = normalizePath(`${folderPath}/${baseName}.md`);
    let counter = 2;
    while (this.app.vault.getAbstractFileByPath(candidate)) {
      candidate = normalizePath(`${folderPath}/${baseName} ${counter}.md`);
      counter += 1;
    }
    return candidate;
  }

  private getRenamedSetupPath(currentPath: string, name: string): string {
    const folderPath = currentPath.split('/').slice(0, -1).join('/');
    const desired = normalizePath(
      `${folderPath}/${this.sanitizeFileName(name)}.md`
    );
    const existing = this.app.vault.getAbstractFileByPath(desired);
    if (!existing || existing.path === currentPath) return desired;
    return currentPath;
  }

  private sanitizeFileName(value: string): string {
    return value
      .trim()
      .replace(/[\\/:*?"<>|]/g, '-')
      .replace(/\s+/g, ' ');
  }

  private isPathInSetupsFolder(
    path: string,
    setupFolderPath = this.getSetupsFolderPath()
  ): boolean {
    const normalized = normalizePath(path);
    const folder = normalizePath(setupFolderPath);
    return normalized === folder || normalized.startsWith(`${folder}/`);
  }

  private hasSetupFrontmatterMarker(content: string): boolean {
    const match = matchFrontmatterBlock(content);
    return Boolean(match?.[1].match(SETUP_MARKER_LINE_PATTERN));
  }

  private stripFrontmatter(content: string): string {
    const match = matchFrontmatterBlock(content);
    return match
      ? content
          .slice(match[0].length)
          .replace(/^\r?\n?/, '')
          .trim()
      : content.trim();
  }

  private parseSetupFrontmatter(content: string): Record<string, unknown> {
    
    const match = matchFrontmatterBlock(content);
    if (!match) return {};

    const { yamlWithoutAgentId, agentEntityId } =
      separateSetupAgentIdFrontmatter(match[1]);
    let parsed: unknown;
    try {
      parsed = parseYaml(yamlWithoutAgentId);
    } catch (error) {
      throw new SetupNoteFormatError(
        error instanceof Error ? error.message : 'Invalid setup YAML'
      );
    }
    if (!this.isRecord(parsed)) {
      throw new SetupNoteFormatError(
        'Invalid setup frontmatter: expected a YAML mapping'
      );
    }
    if (agentEntityId) {
      parsed[SETUP_AGENT_ID_FRONTMATTER_KEY] = agentEntityId;
    }
    return parsed;
  }

  private normalizeSetupTags(value: unknown): string[] {
    if (value === undefined) return [];
    if (!Array.isArray(value)) {
      throw new SetupNoteFormatError(
        'Invalid setup tags: expected an array of strings'
      );
    }

    const values: string[] = [];
    for (const item of value) {
      if (typeof item !== 'string') {
        throw new SetupNoteFormatError(
          'Invalid setup tags: expected an array of strings'
        );
      }
      values.push(item);
    }
    return deduplicateOptions(values);
  }

  private mergeSetupFrontmatter(
    content: string,
    body: string,
    tags?: string[]
  ): string {
    const match = matchFrontmatterBlock(content);
    let frontmatterLines = match ? match[1].split(/\r?\n/) : [];
    const markerIndexes = frontmatterLines.flatMap((line, index) =>
      SETUP_MARKER_KEY_PATTERN.test(line) ? [index] : []
    );

    if (markerIndexes.length === 0) {
      frontmatterLines.push(`${SETUP_FRONTMATTER_KEY}: true`);
    } else {
      frontmatterLines[markerIndexes[0]] = `${SETUP_FRONTMATTER_KEY}: true`;
      for (const index of markerIndexes.slice(1).reverse()) {
        frontmatterLines.splice(index, 1);
      }
    }

    if (tags !== undefined) {
      const linesWithoutTags: string[] = [];
      let firstTagPosition: number | undefined;
      let firstTagNodeProperties: string[] | undefined;
      for (let index = 0; index < frontmatterLines.length; index += 1) {
        if (!FRONTMATTER_TAGS_KEY_PATTERN.test(frontmatterLines[index])) {
          linesWithoutTags.push(frontmatterLines[index]);
          continue;
        }

        firstTagPosition ??= linesWithoutTags.length;
        const flowCollection = scanFlowCollection(frontmatterLines, index);
        firstTagNodeProperties ??= flowCollection.nodeProperties;
        if (flowCollection.endIndex !== undefined) {
          index = flowCollection.endIndex;
        } else {
          while (
            index + 1 < frontmatterLines.length &&
            /^(?:\s+|-\s)/.test(frontmatterLines[index + 1])
          ) {
            index += 1;
          }
        }
      }

      const nodeProperties = firstTagNodeProperties?.join(' ');
      const serializedTags = `tags: ${nodeProperties ? `${nodeProperties} ` : ''}${JSON.stringify(tags)}`;
      const markerIndex = linesWithoutTags.findIndex((line) =>
        SETUP_MARKER_KEY_PATTERN.test(line)
      );
      linesWithoutTags.splice(
        firstTagPosition ?? markerIndex + 1,
        0,
        serializedTags
      );
      frontmatterLines = linesWithoutTags;
    }

    return ['---', ...frontmatterLines, '---', '', body.trim(), ''].join('\n');
  }

  private extractTitle(body: string): string | null {
    const line = body.split(/\r?\n/).find((current) => /^#\s+/.test(current));
    return line ? line.replace(/^#\s+/, '').trim() : null;
  }

  private replaceTitle(body: string, name: string): string {
    const lines = body.split(/\r?\n/);
    const index = lines.findIndex((line) => /^#\s+/.test(line));
    if (index >= 0) {
      lines[index] = `# ${name}`;
      return lines.join('\n');
    }
    return [`# ${name}`, '', body].join('\n');
  }

  private ensureWarning(body: string): string {
    return body.includes('This is a Journalit Setup file')
      ? body
      : body.replace(/^(#\s+.*)$/m, `$1\n\n${SETUP_WARNING}`);
  }

  private parseDetailsSection(body: string): Record<string, string> {
    const section = this.getSectionContent(body, 'Details');
    const details: Record<string, string> = {};
    for (const line of section.split(/\r?\n/)) {
      const match = line.match(/^\s*-\s*([^:]+):\s*(.*)$/);
      if (match) details[match[1].trim().toLowerCase()] = match[2].trim();
    }
    return details;
  }

  private parseLinkedNotesSection(body: string): string[] {
    const section = this.getSectionContent(body, 'Linked Notes');
    return [...section.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?]]/g)].map(
      (match) => match[1]
    );
  }

  private parseRulesSection(body: string): {
    ruleGroups: SetupRuleGroup[];
    rules: SetupRule[];
  } {
    const section = this.getSectionContent(body, 'Rules');
    const lines = section.split(/\r?\n/);
    const ruleGroups: SetupRuleGroup[] = [];
    const rules: SetupRule[] = [];
    let currentGroup: SetupRuleGroup | null = null;
    let currentRule: SetupRule | null = null;

    for (const line of lines) {
      const heading = line.match(/^###\s+(.+)$/);
      if (heading) {
        currentGroup = {
          id: `group_${ruleGroups.length}`,
          name: heading[1].trim(),
          order: ruleGroups.length,
        };
        ruleGroups.push(currentGroup);
        currentRule = null;
        continue;
      }

      const continuation = currentRule ? line.match(/^ {4}(.*)$/) : null;
      if (continuation && currentRule) {
        const continuationText = continuation[1].trimEnd();
        currentRule.description =
          currentRule.description === undefined
            ? continuationText
            : `${currentRule.description}\n${continuationText}`;
        continue;
      }

      const ruleMatch = line.match(/^\s*-\s*(?:\[[ xX-]\]\s*)?(.+?)\s*$/);
      if (!ruleMatch || !currentGroup) {
        if (line.trim()) currentRule = null;
        continue;
      }
      const rawRule = ruleMatch[1].trim();
      const descriptionSeparator = /\s+—\s+/.exec(rawRule);
      const labelWithOptional = descriptionSeparator
        ? rawRule.slice(0, descriptionSeparator.index)
        : rawRule;
      const description = descriptionSeparator
        ? rawRule.slice(
            descriptionSeparator.index + descriptionSeparator[0].length
          )
        : undefined;
      const required = !/\s*_\(optional\)_\s*/.test(labelWithOptional);
      const label = labelWithOptional
        .replace(/\s*_\(optional\)_\s*/g, '')
        .trim();
      if (!label) continue;
      currentRule = {
        id: `rule_${rules.length}`,
        label,
        description,
        category: this.inferRuleCategory(currentGroup.name),
        groupId: currentGroup.id,
        required,
        order: rules.length,
      };
      rules.push(currentRule);
    }

    return { ruleGroups, rules };
  }

  private getSectionContent(body: string, heading: string): string {
    const section = this.findSections(body).find(
      (candidate) =>
        candidate.level === 2 &&
        candidate.heading.toLowerCase() === heading.toLowerCase()
    );
    if (!section) return '';
    return body
      .split(/\r?\n/)
      .slice(section.contentStartLine, section.endLine)
      .join('\n')
      .trim();
  }

  private replaceSection(
    body: string,
    heading: string,
    content: string
  ): string {
    const lines = body.split(/\r?\n/);
    const section = this.findSections(body).find(
      (candidate) =>
        candidate.level === 2 &&
        candidate.heading.toLowerCase() === heading.toLowerCase()
    );
    const replacement = [`## ${heading}`, '', content.trim()].filter(
      (line, index) => index < 2 || line.length > 0
    );
    if (!section) return [...lines, '', ...replacement].join('\n');
    lines.splice(
      section.startLine,
      section.endLine - section.startLine,
      ...replacement
    );
    return lines.join('\n');
  }

  private findSections(body: string): MarkdownSection[] {
    const lines = body.split(/\r?\n/);
    const sections: MarkdownSection[] = [];
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (!match) return;
      sections.push({
        heading: match[2].trim(),
        level: match[1].length,
        startLine: index,
        contentStartLine: index + 1,
        endLine: lines.length,
      });
    });
    sections.forEach((section, index) => {
      const next = sections
        .slice(index + 1)
        .find((candidate) => candidate.level <= section.level);
      section.endLine = next?.startLine ?? lines.length;
    });
    return sections;
  }

  private async collectSetupLabels(): Promise<string[]> {
    const labels = new Set<string>();
    const [tradeData, missedTradeData, backtestTradeData] = await Promise.all([
      this.tradeService.getTradeData({ fresh: false }),
      this.getMissedTradeSetupData(),
      this.getBacktestTradeSetupData(),
    ]);
    tradeData.forEach((trade) => this.collectLabelsFromTrade(trade, labels));
    missedTradeData.forEach((trade) =>
      this.collectLabelsFromTrade(trade, labels)
    );
    backtestTradeData.forEach((trade) =>
      this.collectLabelsFromTrade(trade, labels)
    );
    return Array.from(labels).sort((a, b) => a.localeCompare(b));
  }

  private async getMissedTradeSetupData(): Promise<unknown[]> {
    if (!this.plugin) return [];

    const missedTradeService =
      await this.plugin.serviceManager.getMissedTradeService();
    const { startDate, endDate } = getSetupHistoryDateRange();
    const files = await missedTradeService.getMissedTrades(startDate, endDate);
    return Promise.all(
      files.map((file) => this.tradeService.readFrontmatter(file))
    );
  }

  private async getBacktestTradeSetupData(): Promise<unknown[]> {
    if (!this.plugin) return [];

    const backtestTradeService =
      await this.plugin.serviceManager.getBacktestTradeService();
    const { startDate, endDate } = getSetupHistoryDateRange();
    return backtestTradeService.getBacktestTrades(startDate, endDate);
  }

  private collectLabelsFromTrade(trade: unknown, labels: Set<string>): void {
    if (!this.isRecord(trade)) return;
    this.addStringOrArrayLabels(trade.setup, labels);
  }

  private addStringOrArrayLabels(value: unknown, labels: Set<string>): void {
    if (typeof value === 'string' && value.trim()) {
      labels.add(value.trim());
      return;
    }
    if (!Array.isArray(value)) return;
    value.forEach((item) => {
      if (typeof item === 'string' && item.trim()) labels.add(item.trim());
    });
  }

  private resolveSetupRefFromSetups(
    raw: string,
    setups: Setup[]
  ): SetupRefResolution {
    const trimmed = raw.trim();
    const candidates = setups.filter(
      (setup) =>
        setup.name === trimmed ||
        normalizeSetupKey(setup.name) === normalizeSetupKey(trimmed)
    );
    if (candidates.length === 1) {
      return {
        kind: 'resolved',
        raw,
        setup: candidates[0],
        matchedBy: candidates[0].name === trimmed ? 'name' : 'normalized-name',
      };
    }
    if (candidates.length > 1)
      return { kind: 'ambiguous', raw, setups: candidates, matchedBy: 'name' };
    return { kind: 'unmanaged', raw };
  }

  private filterSetups(setups: Setup[], filter?: SetupFilter): Setup[] {
    const filtered = setups.filter((setup) =>
      this.matchesFilter(setup, filter)
    );
    const sortBy = filter?.sortBy;
    if (!sortBy) return filtered;
    return Array.from(filtered).sort((a, b) => {
      const direction = filter?.sortDir === 'desc' ? -1 : 1;
      return (
        this.getSortValue(a, sortBy).localeCompare(
          this.getSortValue(b, sortBy)
        ) * direction
      );
    });
  }

  private matchesFilter(setup: Setup, filter?: SetupFilter): boolean {
    if (!filter) return true;
    if (filter.status && setup.status !== filter.status) return false;
    if (filter.search && !this.matchesSearch(setup, filter.search))
      return false;
    return true;
  }

  private getSortValue(
    setup: Setup,
    sortBy: NonNullable<SetupFilter['sortBy']>
  ): string {
    switch (sortBy) {
      case 'createdAt':
        return setup.createdAt;
      case 'order':
        return String(setup.order).padStart(8, '0');
      case 'winRate':
        return '';
      case 'name':
        return setup.name;
    }
  }

  private matchesSearch(setup: Setup, search: string): boolean {
    const searchLower = search.toLowerCase();
    return [
      setup.name,
      setup.playbookMarkdown,
      ...setup.tags,
      ...setup.rules.map((rule) => rule.label),
    ].some((value) => value.toLowerCase().includes(searchLower));
  }

  private getSetupTimestamps(file: TFile): {
    createdAt: string;
    updatedAt: string;
  } {
    const stat = file.stat as { ctime?: number; mtime?: number } | undefined;
    return {
      createdAt: this.formatDateTimeForDisplay(
        new Date(stat?.ctime ?? Date.now())
      ),
      updatedAt: this.formatDateTimeForDisplay(
        new Date(stat?.mtime ?? Date.now())
      ),
    };
  }

  private parseStatus(value: unknown): Setup['status'] {
    const normalized =
      typeof value === 'string' ? value.trim().toLowerCase() : '';
    if (normalized === 'testing' || normalized === 'archived')
      return normalized;
    return 'active';
  }

  private parseDirection(value: unknown): Setup['direction'] {
    const normalized =
      typeof value === 'string' ? value.trim().toLowerCase() : '';
    if (
      normalized === 'long' ||
      normalized === 'short' ||
      normalized === 'both'
    )
      return normalized;
    return undefined;
  }

  private serializeStringList(values: string[] | undefined): string {
    return values && values.length > 0 ? JSON.stringify(values) : '';
  }

  private parseStringList(value: unknown): string[] {
    if (typeof value !== 'string') return [];

    if (value.trimStart().startsWith('[')) {
      try {
        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];
        return parsed.flatMap((item) => {
          if (typeof item !== 'string') return [];
          const trimmed = item.trim();
          return trimmed ? [trimmed] : [];
        });
      } catch {
        return [];
      }
    }

    
    return value.split(',').flatMap((item) => {
      const trimmed = item.trim();
      return trimmed ? [trimmed] : [];
    });
  }

  private inferRuleCategory(groupName: string): SetupRuleCategory {
    const normalized = groupName.toLowerCase();
    if (normalized.includes('best condition')) return 'context';
    if (normalized.includes('avoid')) return 'invalidation';
    if (normalized.includes('mistake')) return 'psychology';
    if (normalized.includes('context')) return 'context';
    if (normalized.includes('exit')) return 'exit';
    if (normalized.includes('risk')) return 'risk';
    if (normalized.includes('management')) return 'management';
    if (normalized.includes('invalid')) return 'invalidation';
    if (normalized.includes('psych')) return 'psychology';
    return 'entry';
  }

  private formatRuleCategory(category: string): string {
    return category
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  private formatStatus(status: Setup['status']): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  private formatDirection(direction: NonNullable<Setup['direction']>): string {
    return direction.charAt(0).toUpperCase() + direction.slice(1);
  }

  private formatDateTimeForDisplay(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  private publishChanged(
    action: 'created' | 'updated' | 'deleted',
    setup: Setup
  ): void {
    eventBus.publish('setup:changed', {
      action,
      setupId: setup.id,
      timestamp: Date.now(),
    });
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }
}


async function contentRevision(content: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(content)
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}
