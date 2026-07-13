

import { App, TFile, TFolder, normalizePath } from 'obsidian';
import {
  CustomDataService,
  CustomDataServiceConfig,
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
import { SetupMetricsCalculator } from './metrics';
import { TradeService } from '../trade/TradeService';
import { eventBus, type Unsubscribe } from '../events';
import { OptionType } from '../options/CustomOptionsService';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import {
  readFileContentForMutation,
  replaceFileContent,
} from '../../utils/fileMutation';
import { getSetupHistoryDateRange } from './setupHistoryRange';
import { normalizeLabelColor, type LabelColor } from '../../types/labelColor';
import { normalizeSetupKey } from './setupIdentity';

const SETUPS_FOLDER_NAME = 'Setups';
const SETUP_FRONTMATTER_KEY = 'journalit-setup';
const SETUP_WARNING =
  '==⚠ This is a Journalit Setup file. Journalit opens it in the Setup view by default. If you are reading this as markdown, use the note menu / pane details menu and choose “Open as Journalit Setup” to return to the setup editor. This markdown exists for portability, search, and manual reference; create and edit setups through Journalit’s Setups view. ⚠==';

interface SetupFileRecord {
  file: TFile;
  setup: Setup;
}

interface MarkdownSection {
  heading: string;
  level: number;
  startLine: number;
  contentStartLine: number;
  endLine: number;
}


export class SetupService extends CustomDataService {
  private metricsCalculator: SetupMetricsCalculator;
  private materializePromise: Promise<void> | null = null;
  private mutationQueue: Promise<void> = Promise.resolve();
  private tradeCacheUnsubscribers: Unsubscribe[] = [];

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
    this.metricsCalculator = new SetupMetricsCalculator(tradeService);
    const invalidateMetricsCache = () => {
      void this.clearCacheWithPrefix('metrics:');
    };
    this.tradeCacheUnsubscribers = [
      eventBus.subscribe('trade:changed', invalidateMetricsCache),
      eventBus.subscribe('missed-trade:changed', invalidateMetricsCache),
      eventBus.subscribe('backtest-trade:changed', invalidateMetricsCache),
    ];
  }

  public override cleanup(): void {
    this.tradeCacheUnsubscribers.forEach((unsubscribe) => unsubscribe());
    this.tradeCacheUnsubscribers = [];
    super.cleanup();
  }

  public async getSetupMetrics(id: string): Promise<SetupMetrics> {
    validateSetupId(id);

    return this.query(
      async () => {
        const setup = await this.getSetupById(id);
        if (!setup) return this.metricsCalculator.calculateMetrics(id);
        return this.metricsCalculator.calculateMetricsForSetup(setup);
      },
      `metrics:${id}`,
      { offlineCapable: true }
    );
  }

  public async getAllSetupMetrics(
    filter?: SetupFilter
  ): Promise<Map<string, SetupMetrics>> {
    const cacheKey = `metrics:all${filter ? `:${JSON.stringify(filter)}` : ''}`;

    return this.query(
      async () => {
        const setups = await this.listSetups(filter);
        const metrics = new Map<string, SetupMetrics>();

        const results = await Promise.all(
          setups.map(async (setup) => {
            try {
              const setupMetrics =
                await this.metricsCalculator.calculateMetricsForSetup(setup);
              return { setupId: setup.id, setupMetrics };
            } catch {
              console.warn(
                `Failed to calculate metrics for setup: ${setup.name}`
              );
              return null;
            }
          })
        );

        for (const result of results) {
          if (result) metrics.set(result.setupId, result.setupMetrics);
        }

        return metrics;
      },
      cacheKey,
      { offlineCapable: true }
    );
  }

  public getAllSetupMetricsFromTradeData(
    setups: Setup[],
    tradeData: Array<Record<string, unknown>>
  ): Map<string, SetupMetrics> {
    return new Map(
      setups.map((setup) => [
        setup.id,
        this.metricsCalculator.calculateMetricsForSetupFromTradeData(
          setup,
          tradeData
        ),
      ])
    );
  }

  
  public async listSetups(filter?: SetupFilter): Promise<Setup[]> {
    await this.materializeTradeSetups();
    const records = await this.listSetupFileRecords();
    return this.filterSetups(
      records.map((record) => record.setup),
      filter
    );
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

  public async createSetup(data: SetupData): Promise<Setup> {
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
    await this.app.vault.create(filePath, this.serializeNewSetup(data));
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) {
      throw new Error(`Failed to create setup file: ${filePath}`);
    }
    await Promise.all([
      forceMetadataCacheRefresh(this.app, file),
      this.clearCache(),
      this.plugin?.optionsService?.addOption?.(OptionType.SETUP, name),
    ]);
    const setup = await this.parseSetupFile(file);
    this.publishChanged('created', setup);
    return setup;
  }

  public async updateSetup(
    id: string,
    data: Partial<SetupData>
  ): Promise<Setup> {
    validateSetupId(id);
    const record = await this.requireSetupFileRecord(id);
    const existing = record.setup;

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
    const currentContent = await readFileContentForMutation(
      this.app,
      record.file
    );
    const nextContent = this.updateSetupMarkdown(currentContent, existing, {
      ...data,
      name: nextName,
    });
    await replaceFileContent(this.app, record.file, nextContent);

    let targetFile = record.file;
    if (nextName !== existing.name) {
      const newPath = this.getRenamedSetupPath(record.file.path, nextName);
      if (newPath !== record.file.path) {
        await this.app.fileManager.renameFile(record.file, newPath);
        const renamed = this.app.vault.getAbstractFileByPath(newPath);
        if (renamed instanceof TFile) targetFile = renamed;
      }
      await this.updateTradeSetupName(existing.name, nextName);
    }

    await Promise.all([
      forceMetadataCacheRefresh(this.app, targetFile),
      this.clearCache(),
    ]);
    const updated = await this.parseSetupFile(targetFile);
    this.publishChanged('updated', updated);
    return updated;
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

  public async deleteSetup(id: string): Promise<void> {
    return this.runMutationExclusive(() => this.deleteSetupNow(id));
  }

  private async deleteSetupNow(id: string): Promise<void> {
    validateSetupId(id);
    const record = await this.requireSetupFileRecord(id);
    const optionsService = this.plugin?.optionsService;

    if (optionsService) {
      await optionsService.removeOptionValueFromNotes(
        OptionType.SETUP,
        record.setup.name
      );
      await optionsService.removeOption(OptionType.SETUP, record.setup.name);
    }

    await this.app.fileManager.trashFile(record.file);
    await this.clearCache();
    this.publishChanged('deleted', record.setup);
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

  private async materializeTradeSetups(): Promise<void> {
    if (this.materializePromise) return this.materializePromise;
    this.materializePromise = this.runMutationExclusive(() =>
      this.materializeTradeSetupsNow()
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

  private async materializeTradeSetupsNow(): Promise<void> {
    const [labels, existing] = await Promise.all([
      this.collectSetupLabels(),
      this.listSetupFileRecordsWithoutMaterialization(),
    ]);
    const existingNames = new Set(
      existing.map((record) => normalizeSetupKey(record.setup.name))
    );

    const namesToCreate: string[] = [];
    for (const label of labels) {
      const name = label.trim();
      const normalizedName = normalizeSetupKey(name);
      if (!name || existingNames.has(normalizedName)) continue;
      existingNames.add(normalizedName);
      namesToCreate.push(name);
    }

    if (namesToCreate.length > 0) {
      const folder = await this.ensureSetupFolder();
      const createdFilePaths = await Promise.all(
        namesToCreate.map(async (name) => {
          const filePath = this.getUniqueSetupFilePath(folder.path, name);
          await this.app.vault.create(
            filePath,
            this.serializeNewSetup({ name, playbookMarkdown: '' })
          );
          return filePath;
        })
      );
      await Promise.all(
        createdFilePaths.map(async (filePath) => {
          const file = this.app.vault.getAbstractFileByPath(filePath);
          if (file instanceof TFile)
            await forceMetadataCacheRefresh(this.app, file);
        })
      );

      await this.clearCache();
    }

    const optionsService = this.plugin?.optionsService;
    if (optionsService) {
      
      const setupNames = [
        ...existing.map((record) => record.setup.name),
        ...namesToCreate,
      ];
      const addedCount = await optionsService.addOptions(
        OptionType.SETUP,
        setupNames
      );
      if (addedCount > 0) optionsService.notifyOptionsChanged();
    }
  }

  private async listSetupFileRecords(): Promise<SetupFileRecord[]> {
    return this.query(
      async () => this.listSetupFileRecordsWithoutMaterialization(),
      'setups:records',
      { offlineCapable: true }
    );
  }

  private async listSetupFileRecordsWithoutMaterialization(): Promise<
    SetupFileRecord[]
  > {
    const setupFolderPath = this.getSetupsFolderPath();
    const files = this.app.vault
      .getMarkdownFiles()
      .filter((file) => this.isPathInSetupsFolder(file.path, setupFolderPath));

    const records = await Promise.all(
      files.map(async (file) => {
        try {
          if (!(await this.isSetupFile(file))) return null;
          return { file, setup: await this.parseSetupFile(file) };
        } catch (error) {
          console.warn(`Failed to parse setup file ${file.path}:`, error);
          return null;
        }
      })
    );

    return records
      .filter((record): record is SetupFileRecord => record !== null)
      .sort(
        (a, b) =>
          a.setup.order - b.setup.order ||
          a.setup.name.localeCompare(b.setup.name)
      );
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

  private async parseSetupFile(file: TFile): Promise<Setup> {
    const content = await this.app.vault.cachedRead(file);
    const body = this.stripFrontmatter(content);
    const title = this.extractTitle(body) || file.basename;
    const details = this.parseDetailsSection(body);
    const linkedNotes = this.parseLinkedNotesSection(body);
    const ruleData = this.parseRulesSection(body);
    const timestamps = this.getSetupTimestamps(file);

    return {
      id: title,
      name: title,
      filePath: file.path,
      aliases: [],
      status: this.parseStatus(details.status),
      color: normalizeLabelColor(details.color?.toLowerCase()),
      icon: 'trading_setup',
      tags: [],
      preferredSessions: this.parseCommaList(details['preferred sessions']),
      preferredTimeframes: this.parseCommaList(details['preferred timeframes']),
      preferredTickers: this.parseCommaList(details['preferred tickers']),
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
    };
  }

  private serializeNewSetup(data: SetupData): string {
    const name = data.name.trim();
    const status = data.status ?? 'active';
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
        value: data.preferredSessions.join(', '),
      });
    }
    if (data.preferredTimeframes !== undefined) {
      detailUpdates.push({
        key: 'Preferred Timeframes',
        value: data.preferredTimeframes.join(', '),
      });
    }
    if (data.preferredTickers !== undefined) {
      detailUpdates.push({
        key: 'Preferred Tickers',
        value: data.preferredTickers.join(', '),
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

    return this.mergeSetupFrontmatter(content, body);
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
      ['Preferred Sessions', details.preferredSessions?.join(', ') ?? ''],
      ['Preferred Timeframes', details.preferredTimeframes?.join(', ') ?? ''],
      ['Preferred Tickers', details.preferredTickers?.join(', ') ?? ''],
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
    const configured = this.plugin?.settings?.general?.journalFolderPath;
    const root =
      configured && configured.trim() ? configured.trim() : '!Journalit';
    return normalizePath([root, ...segments].join('/'));
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
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    return Boolean(match?.[1].match(/^journalit-setup:\s*true\s*$/m));
  }

  private stripFrontmatter(content: string): string {
    return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();
  }

  private mergeSetupFrontmatter(content: string, body: string): string {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const frontmatterLines = match ? match[1].split(/\r?\n/) : [];
    const markerPattern = new RegExp(`^${SETUP_FRONTMATTER_KEY}\\s*:`);
    const markerIndexes = frontmatterLines.flatMap((line, index) =>
      markerPattern.test(line) ? [index] : []
    );

    if (markerIndexes.length === 0) {
      frontmatterLines.push(`${SETUP_FRONTMATTER_KEY}: true`);
    } else {
      frontmatterLines[markerIndexes[0]] = `${SETUP_FRONTMATTER_KEY}: true`;
      for (const index of markerIndexes.slice(1).reverse()) {
        frontmatterLines.splice(index, 1);
      }
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
    this.plugin?.optionsService
      ?.getUserDefinedSetupOptions()
      .forEach((label) => this.addStringOrArrayLabels(label, labels));
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

  private async updateTradeSetupName(
    oldName: string,
    newName: string
  ): Promise<void> {
    if (oldName === newName) return;
    const optionsService = this.plugin?.optionsService;
    if (!optionsService) return;

    const normalizedOldName = normalizeSetupKey(oldName);
    const [tradeData, missedTradeData, backtestTradeData] = await Promise.all([
      this.tradeService.getTradeData({ fresh: false }),
      this.getMissedTradeSetupData(),
      this.getBacktestTradeSetupData(),
    ]);
    const hasLinkedTrades = [
      ...tradeData,
      ...missedTradeData,
      ...backtestTradeData,
    ].some((trade) => {
      if (!this.isRecord(trade)) return false;
      const value = trade.setup;
      const labels = Array.isArray(value)
        ? value
        : typeof value === 'string'
          ? [value]
          : [];
      return labels.some(
        (label) =>
          typeof label === 'string' &&
          normalizeSetupKey(label) === normalizedOldName
      );
    });

    const hasOption = optionsService
      .getOptions(OptionType.SETUP)
      .some((option) => option.toLowerCase() === oldName.toLowerCase());

    if (hasOption) {
      const result = await optionsService.updateOption(
        OptionType.SETUP,
        oldName,
        newName,
        hasLinkedTrades
      );
      if (result.success) return;
    }

    await Promise.all([
      ...(hasLinkedTrades
        ? [
            optionsService.updateNotesForOptionValue(
              OptionType.SETUP,
              oldName,
              newName
            ),
          ]
        : []),
      optionsService.addOption(OptionType.SETUP, newName),
    ]);
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

  private parseCommaList(value: unknown): string[] {
    if (typeof value !== 'string') return [];
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
