import { App, TFile, TFolder } from 'obsidian';
import type JournalitPlugin from '../../main';
import { getTradeIdentityNoteType } from '../../utils/tradeIdentity';
import { eventBus } from '../events/EventBus';
import type { Unsubscribe } from '../events/types';
import { GeneratedGraphWriteCoordinator } from './GeneratedGraphWriteCoordinator';
import { GraphFrontmatterReader } from './GraphFrontmatterReader';
import { GraphIndexBuilder } from './GraphIndexBuilder';
import { GraphProjectionService } from './GraphProjectionService';
import { getReviewTargetSignature } from './graphPeriods';
import {
  createEmptyResult,
  errorMessage,
  frontmatterSignature,
  getReviewType,
  hasManagedProperties,
  isBlockingProjectionWarning,
  isRecord,
  JOURNALIT_DRC_PROPERTY,
  JOURNALIT_PARENT_REVIEW_PROPERTY,
  JOURNALIT_SETUPS_PROPERTY,
  MANAGED_PROPERTIES,
  normalizeFrontmatter,
  valuesEqual,
  type GraphIndex,
  type GraphLinkRebuildResult,
} from './graphTypes';

export const GRAPH_LINK_MIGRATION_VERSION = '2026-07-native-graph-links-v1';
const GRAPH_AFFECTING_TRADE_SETTING_SOURCES = new Set([
  'week-start',
  'trading-day-cutoff',
  'weekStartDay',
  'tradingDayCutoffTime',
]);

export class GraphLinkService {
  private readonly app: App;
  private unsubscribes: Unsubscribe[] = [];
  private operationQueue: Promise<void> = Promise.resolve();
  private scheduledRebuild: number | undefined;
  private scheduledPathReconciliation: number | undefined;
  private pendingPaths = new Set<string>();
  private readonly generatedWrites: GeneratedGraphWriteCoordinator;
  private readonly frontmatterReader: GraphFrontmatterReader;
  private readonly projector: GraphProjectionService;
  private readonly indexBuilder: GraphIndexBuilder;
  private cachedIndex: GraphIndex | undefined;
  private initialized = false;
  private destroyed = false;

  constructor(private readonly plugin: JournalitPlugin) {
    this.app = plugin.app;
    this.generatedWrites = new GeneratedGraphWriteCoordinator(plugin);
    this.frontmatterReader = new GraphFrontmatterReader(
      plugin,
      this.generatedWrites
    );
    this.projector = new GraphProjectionService(plugin);
    this.indexBuilder = new GraphIndexBuilder(plugin, async (file) =>
      this.frontmatterReader.read(file)
    );
  }

  public initialize(): void {
    if (this.initialized) return;
    this.initialized = true;
    this.destroyed = false;

    this.unsubscribes.push(
      eventBus.subscribe('trade:committed', (payload) => {
        this.reconcilePathSoon(payload.change.path);
      }),
      eventBus.subscribe('review:changed', (payload) => {
        if (payload.type === 'migration') return;
        if (payload.filePath) this.reconcilePathSoon(payload.filePath);
        if (payload.action === 'created' || payload.action === 'deleted') {
          this.scheduleRebuild();
        }
      }),
      eventBus.subscribe('setup:changed', () => this.scheduleRebuild()),
      eventBus.subscribe('settings:changed', (payload) => {
        if (
          payload.section === 'all' ||
          (payload.section === 'trade' &&
            payload.source !== undefined &&
            GRAPH_AFFECTING_TRADE_SETTING_SOURCES.has(payload.source))
        ) {
          this.scheduleRebuild();
        }
      }),
      eventBus.subscribe('folder-path:changed', () => this.scheduleRebuild())
    );

    this.plugin.registerEvent(
      this.app.vault.on('create', (file) => {
        if (!(file instanceof TFile) || file.extension !== 'md') return;
        if (!this.isJournalPath(file.path)) return;
        this.scheduleRebuild();
      })
    );
    this.plugin.registerEvent(
      this.app.vault.on('delete', (file) => {
        if (!(file instanceof TFile) || file.extension !== 'md') return;
        if (!this.isJournalPath(file.path)) return;
        this.scheduleRebuild();
      })
    );
    this.plugin.registerEvent(
      this.app.vault.on('rename', (file, oldPath) => {
        if (file instanceof TFolder) {
          if (
            !this.intersectsJournalPath(file.path) &&
            !this.intersectsJournalPath(oldPath)
          ) {
            return;
          }
        } else if (file instanceof TFile) {
          if (file.extension !== 'md') return;
          if (!this.isJournalPath(file.path) && !this.isJournalPath(oldPath)) {
            return;
          }
        } else {
          return;
        }
        this.scheduleRebuild();
      })
    );
    this.plugin.registerEvent(
      this.app.metadataCache.on('changed', (file) => {
        if (file.extension !== 'md' || !this.isJournalPath(file.path)) return;
        const cached = this.app.metadataCache.getFileCache(file)?.frontmatter;
        const frontmatter = isRecord(cached)
          ? normalizeFrontmatter(cached)
          : undefined;
        const match = this.generatedWrites.inspect(file.path, frontmatter);
        if (match === 'source') {
          void this.resolveSourceSignatureEvent(file).catch((error) => {
            console.error(
              '[GraphLinkService] Failed to resolve generated metadata acknowledgement:',
              error
            );
          });
          return;
        }
        if (match === 'generated') {
          this.generatedWrites.acknowledge(file.path);
          return;
        }
        if (match === 'external') {
          this.generatedWrites.releaseExternal(file.path);
        }
        this.handleMetadataChange(file);
      })
    );
  }

  public destroy(): void {
    this.destroyed = true;
    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
    this.unsubscribes = [];
    if (this.scheduledRebuild !== undefined) {
      window.clearTimeout(this.scheduledRebuild);
      this.scheduledRebuild = undefined;
    }
    if (this.scheduledPathReconciliation !== undefined) {
      window.clearTimeout(this.scheduledPathReconciliation);
      this.scheduledPathReconciliation = undefined;
    }
    this.generatedWrites.destroy();
    this.cachedIndex = undefined;
    this.pendingPaths.clear();
    this.initialized = false;
  }

  public async runMigrationIfNeeded(): Promise<GraphLinkRebuildResult> {
    if (
      this.plugin.settings.trade.graphLinkMigrationVersion ===
      GRAPH_LINK_MIGRATION_VERSION
    ) {
      return createEmptyResult();
    }

    const result = await this.rebuildAll();
    if (result.failed === 0 && result.conflicted === 0 && !result.cancelled) {
      this.plugin.settings.trade.graphLinkMigrationVersion =
        GRAPH_LINK_MIGRATION_VERSION;
      await this.plugin.saveSettings();
    }
    return result;
  }

  public rebuildAll(): Promise<GraphLinkRebuildResult> {
    return this.enqueue(() => this.rebuildAllNow());
  }

  public reconcilePath(path: string): Promise<GraphLinkRebuildResult> {
    return this.enqueue(() => this.reconcilePathNow(path));
  }

  private reconcilePathSoon(path: string): void {
    if (this.destroyed || !this.isJournalPath(path)) return;
    this.pendingPaths.add(path);
    if (this.scheduledPathReconciliation !== undefined) return;
    this.scheduledPathReconciliation = window.setTimeout(() => {
      this.scheduledPathReconciliation = undefined;
      const paths = Array.from(this.pendingPaths);
      this.pendingPaths.clear();
      void this.enqueue(() => this.reconcilePathsNow(paths)).catch((error) => {
        console.error('[GraphLinkService] Failed to reconcile notes:', error);
      });
    }, 100);
  }

  private handleMetadataChange(file: TFile): void {
    const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
    this.handleFrontmatterChange(
      file,
      isRecord(frontmatter) ? normalizeFrontmatter(frontmatter) : undefined
    );
  }

  private handleFrontmatterChange(
    file: TFile,
    frontmatter: Record<string, unknown> | undefined
  ): void {
    const previousReviewSignature =
      this.cachedIndex?.reviewTargetSignaturesByPath.get(file.path);
    const wasSetupTarget =
      this.cachedIndex?.setupTargetPaths.has(file.path) ?? false;

    if (!frontmatter) {
      if (previousReviewSignature !== undefined || wasSetupTarget) {
        this.scheduleRebuild();
      }
      return;
    }

    const reviewType = getReviewType(frontmatter);
    if (reviewType) {
      const currentSignature = getReviewTargetSignature(
        reviewType,
        frontmatter,
        file.path
      );
      if (previousReviewSignature !== currentSignature) {
        this.scheduleRebuild();
      } else {
        this.reconcilePathSoon(file.path);
      }
      return;
    }

    if (
      previousReviewSignature !== undefined ||
      wasSetupTarget ||
      frontmatter['journalit-setup'] === true
    ) {
      this.scheduleRebuild();
      return;
    }

    if (
      getTradeIdentityNoteType(frontmatter, file.path) === 'trade' ||
      hasManagedProperties(frontmatter)
    ) {
      this.reconcilePathSoon(file.path);
    }
  }

  private async resolveSourceSignatureEvent(file: TFile): Promise<void> {
    if (this.destroyed || !this.generatedWrites.isPending(file.path)) return;
    const frontmatter = await this.frontmatterReader.readFromDisk(file);
    if (!this.destroyed && this.generatedWrites.isPending(file.path)) {
      const expectedSignature = this.generatedWrites.getGeneratedSignature(
        file.path
      );
      const diskSignature = frontmatter
        ? frontmatterSignature(frontmatter)
        : undefined;
      if (
        expectedSignature === undefined ||
        diskSignature !== expectedSignature
      ) {
        this.generatedWrites.releaseExternal(file.path);
        this.handleFrontmatterChange(file, frontmatter);
      } else {
        this.generatedWrites.acknowledge(file.path);
      }
    }
  }

  private scheduleRebuild(): void {
    if (this.destroyed) return;
    this.cachedIndex = undefined;
    if (this.scheduledRebuild !== undefined) {
      window.clearTimeout(this.scheduledRebuild);
    }
    this.scheduledRebuild = window.setTimeout(() => {
      this.scheduledRebuild = undefined;
      void this.rebuildAll().catch((error) => {
        console.error('[GraphLinkService] Scheduled rebuild failed:', error);
      });
    }, 500);
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.operationQueue.then(operation, operation);
    this.operationQueue = result.then(
      () => undefined,
      () => undefined
    );
    return result;
  }

  private async rebuildAllNow(): Promise<GraphLinkRebuildResult> {
    const result = createEmptyResult();
    if (this.destroyed) {
      result.cancelled = true;
      return result;
    }
    const index = await this.buildIndex();
    this.cachedIndex = index;
    result.failed += index.readErrors.length;
    result.errors.push(...index.readErrors);
    const files = Array.from(index.frontmatterByPath.keys());

    for (let indexPosition = 0; indexPosition < files.length; indexPosition++) {
      if (this.destroyed) {
        result.cancelled = true;
        break;
      }
      const path = files[indexPosition];
      const file = this.app.vault.getAbstractFileByPath(path);
      if (!(file instanceof TFile)) {
        result.skipped += 1;
        continue;
      }
      await this.reconcileFile(file, index, result);
      if ((indexPosition + 1) % 50 === 0) await Promise.resolve();
    }

    if (this.destroyed) result.cancelled = true;

    if (result.updated > 0) {
      eventBus.publish('review:changed', {
        type: 'migration',
        action: 'bulk-migrated',
        count: result.updated,
      });
    }
    return result;
  }

  private async reconcilePathNow(
    path: string
  ): Promise<GraphLinkRebuildResult> {
    return this.reconcilePathsNow([path]);
  }

  private async reconcilePathsNow(
    paths: string[]
  ): Promise<GraphLinkRebuildResult> {
    const result = createEmptyResult();
    const index = await this.getOrBuildIndex();
    for (const path of paths) {
      if (this.destroyed || !this.isJournalPath(path)) {
        result.skipped += 1;
        continue;
      }
      const file = this.app.vault.getAbstractFileByPath(path);
      if (!(file instanceof TFile) || file.extension !== 'md') {
        result.skipped += 1;
        continue;
      }
      let frontmatter: Record<string, unknown> | undefined;
      try {
        frontmatter = await this.frontmatterReader.read(file);
      } catch (error) {
        result.failed += 1;
        result.errors.push({ filePath: path, message: errorMessage(error) });
        continue;
      }
      if (frontmatter) {
        index.frontmatterByPath.set(path, frontmatter);
      } else {
        index.frontmatterByPath.delete(path);
      }
      await this.reconcileFile(file, index, result, frontmatter);
    }
    return result;
  }

  private async getOrBuildIndex(): Promise<GraphIndex> {
    if (this.cachedIndex) return this.cachedIndex;
    const index = await this.buildIndex();
    this.cachedIndex = index;
    return index;
  }

  private async buildIndex(): Promise<GraphIndex> {
    return this.indexBuilder.build();
  }

  private async reconcileFile(
    file: TFile,
    index: GraphIndex,
    result: GraphLinkRebuildResult,
    suppliedFrontmatter?: Record<string, unknown>
  ): Promise<void> {
    if (this.destroyed) {
      result.skipped += 1;
      return;
    }
    let frontmatter =
      suppliedFrontmatter ?? index.frontmatterByPath.get(file.path);
    if (!frontmatter) {
      try {
        frontmatter = await this.frontmatterReader.read(file);
      } catch (error) {
        result.failed += 1;
        result.errors.push({
          filePath: file.path,
          message: errorMessage(error),
        });
        return;
      }
    }
    if (!frontmatter) {
      result.skipped += 1;
      return;
    }

    const isTrade =
      getTradeIdentityNoteType(frontmatter, file.path) === 'trade';
    const reviewType = getReviewType(frontmatter);
    if (!isTrade && !reviewType && !hasManagedProperties(frontmatter)) {
      result.skipped += 1;
      return;
    }

    result.scanned += 1;
    try {
      const projection = isTrade
        ? await this.projector.projectTrade(frontmatter, index, file.path)
        : reviewType
          ? await this.projector.projectReview(
              reviewType,
              frontmatter,
              index,
              file.path
            )
          : { warnings: [] };
      if (this.destroyed) {
        result.cancelled = true;
        return;
      }
      const blockingWarnings = projection.warnings.filter(
        isBlockingProjectionWarning
      );
      if (blockingWarnings.length > 0) {
        result.conflicted += 1;
        blockingWarnings.forEach((message) => {
          result.conflicts.push({ filePath: file.path, message });
        });
      }

      const changed = MANAGED_PROPERTIES.some(
        (property) => !valuesEqual(frontmatter[property], projection[property])
      );
      if (!changed) {
        result.unchanged += 1;
        return;
      }

      this.generatedWrites.begin(file.path, frontmatter);
      let writeSucceeded = false;
      let sourceChangedDuringWrite = false;
      let frontmatterAfterWrite: Record<string, unknown> | undefined;
      try {
        await this.app.fileManager.processFrontMatter(file, (current) => {
          if (!isRecord(current)) return;
          sourceChangedDuringWrite = this.generatedWrites.sourceChanged(
            file.path,
            current
          );
          this.setManagedProperty(
            current,
            JOURNALIT_DRC_PROPERTY,
            projection.journalitDrc
          );
          this.setManagedProperty(
            current,
            JOURNALIT_SETUPS_PROPERTY,
            projection.journalitSetups
          );
          this.setManagedProperty(
            current,
            JOURNALIT_PARENT_REVIEW_PROPERTY,
            projection.journalitParentReview
          );
          frontmatterAfterWrite = this.generatedWrites.capture(
            file.path,
            current
          );
          index.frontmatterByPath.set(file.path, frontmatterAfterWrite);
          if (isTrade) this.generatedWrites.armFileWatcher(file.path);
        });
        writeSucceeded = true;
        if (sourceChangedDuringWrite && frontmatterAfterWrite) {
          this.handleFrontmatterChange(file, frontmatterAfterWrite);
        }
      } finally {
        if (!writeSucceeded) {
          this.generatedWrites.fail(file.path);
        } else if (!this.initialized) {
          this.generatedWrites.releaseUninitialized(file.path);
        }
      }
      result.updated += 1;
      result.filePaths.push(file.path);
    } catch (error) {
      result.failed += 1;
      result.errors.push({
        filePath: file.path,
        message: errorMessage(error),
      });
    }
  }

  private setManagedProperty(
    frontmatter: Record<string, unknown>,
    property: (typeof MANAGED_PROPERTIES)[number],
    value: string | string[] | undefined
  ): void {
    if (value === undefined) {
      delete frontmatter[property];
    } else {
      frontmatter[property] = value;
    }
  }

  private isJournalPath(path: string): boolean {
    return this.plugin.serviceManager
      .getFolderPathService()
      .isJournalPath(path);
  }

  private intersectsJournalPath(path: string): boolean {
    const journalPath = this.plugin.serviceManager
      .getFolderPathService()
      .journalFolderPath.replace(/\/$/, '');
    const candidate = path.replace(/\/$/, '');
    return (
      candidate === journalPath ||
      candidate.startsWith(`${journalPath}/`) ||
      journalPath.startsWith(`${candidate}/`)
    );
  }
}
