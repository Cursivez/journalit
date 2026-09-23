import { TFile, TFolder, normalizePath } from 'obsidian';
import type JournalitPlugin from '../main';
import { eventBus } from '../services/events/EventBus';
import { ReviewCreationBatch } from '../services/review/ReviewCreationBatch';
import { parseFrontmatterFromContentOrThrow } from '../utils/dataRefresh';
import {
  appendSampleReviewBody,
  getDemoOwnedEntityKind,
  getSampleInstanceId,
  materializeSampleReviewFrontmatter,
} from './DemoOwnership';
import type {
  DemoManifest,
  DemoManifestPhase,
  DemoOwnedEntity,
} from './DemoManifest';
import { DemoManifestStore } from './DemoManifest';
import {
  DemoCleanupPlanner,
  isOwnedEntityFileOnDisk,
  isPathWithinRoot,
  trashFileOrConfirmMissing,
} from './DemoCleanupPlanner';
import {
  createDemoMediaSvg,
  createDemoSupportNoteContent,
} from './DemoStaticContent';
import type { CompiledDemoPack, DemoReviewRecipe } from './compileDemoPack';
import { createSampleReviewAuthoring } from './DemoReviewAuthoring';

export type DemoMaterializationStage =
  | 'materializing'
  
  | 'verifying'
  | 'removing';

export interface DemoMaterializationProgress {
  phase: DemoManifestPhase;
  
  stage: DemoMaterializationStage;
  completed: number;
  total: number;
  message: string;
}

type ProgressListener = (progress: DemoMaterializationProgress) => void;
type DiscoveredOwnedEntities = Map<string, DemoOwnedEntity[]>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function toHostLocalCalendarDate(date: Date): Date {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    12
  );
}

export class DemoMaterializer {
  private readonly cleanupPlanner: DemoCleanupPlanner;

  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly manifestStore: DemoManifestStore
  ) {
    this.cleanupPlanner = new DemoCleanupPlanner(plugin);
  }

  async materialize(
    pack: CompiledDemoPack,
    manifest: DemoManifest,
    onProgress?: ProgressListener
  ): Promise<DemoManifest> {
    this.assertPackMatchesManifest(pack, manifest);
    const total =
      pack.supportNotes.length +
      pack.media.length +
      pack.setups.length +
      pack.trades.length +
      pack.missedTrades.length +
      pack.backtestTrades.length +
      pack.reviews.length;
    let completed = 0;
    const report = (message: string) =>
      onProgress?.({
        phase: manifest.phase,
        stage: 'materializing',
        completed,
        total,
        message,
      });
    const recordsByEntityId = new Map(
      manifest.owned.map((entity) => [entity.entityId, entity])
    );
    const discovered = await this.discoverOwnedMarkdownFiles(
      manifest.instanceId,
      manifest.root
    );

    manifest.phase = 'materializing';
    await this.manifestStore.save(manifest);
    report('Preparing the sample journal');

    for (const note of pack.supportNotes) {
      const content = createDemoSupportNoteContent({
        instanceId: manifest.instanceId,
        entityId: note.entityId,
        title: note.title,
        body: note.body,
      });
      const path = await this.ensureOwnedStaticFile({
        instanceId: manifest.instanceId,
        entityId: note.entityId,
        kind: 'support-note',
        path: note.path,
        content,
        existing: recordsByEntityId.get(note.entityId),
      });
      this.record(manifest, recordsByEntityId, {
        entityId: note.entityId,
        kind: 'support-note',
        path,
      });
      completed += 1;
      report('Writing sample notes');
    }

    for (const recipe of pack.media) {
      const content = createDemoMediaSvg(recipe, manifest.instanceId);
      const path = await this.ensureOwnedStaticFile({
        instanceId: manifest.instanceId,
        entityId: recipe.entityId,
        kind: 'media',
        path: recipe.path,
        content,
        existing: recordsByEntityId.get(recipe.entityId),
      });
      this.record(manifest, recordsByEntityId, {
        entityId: recipe.entityId,
        kind: 'media',
        path,
      });
      completed += 1;
      report('Generating illustrative chart media');
    }
    await this.manifestStore.save(manifest);

    const setupService = await this.plugin.serviceManager.getSetupService();
    this.plugin.setupService = setupService;
    for (const setup of pack.setups) {
      const existing =
        recordsByEntityId.get(setup.entityId) ??
        this.getUniqueDiscoveredEntity(discovered, setup.entityId);
      if (
        existing &&
        (await this.isOwnedMarkdownFile(
          existing.path,
          manifest,
          setup.entityId
        ))
      ) {
        this.record(manifest, recordsByEntityId, {
          ...existing,
          kind: 'setup',
        });
      } else {
        const created = await setupService.createSetup(setup.data);
        if (!created.filePath) {
          throw new Error(
            `Sample setup did not return a file path: ${setup.data.name}`
          );
        }
        this.record(manifest, recordsByEntityId, {
          entityId: setup.entityId,
          kind: 'setup',
          path: created.filePath,
        });
      }
      completed += 1;
      report('Creating authored setup playbooks');
    }
    await this.manifestStore.save(manifest);

    const tradeService = this.plugin.serviceManager.getTradeService();
    this.plugin.tradeService = tradeService;
    const commitEventBatch = tradeService.createTradeCommitEventBatch();
    const batch = tradeService.createTradeCreationBatch();
    try {
      for (const trade of pack.trades) {
        const existing =
          recordsByEntityId.get(trade.entityId) ??
          this.getUniqueDiscoveredEntity(discovered, trade.entityId);
        if (
          existing &&
          (await this.isOwnedMarkdownFile(
            existing.path,
            manifest,
            trade.entityId
          ))
        ) {
          this.record(manifest, recordsByEntityId, {
            ...existing,
            kind: 'trade',
          });
        } else {
          const path = await tradeService.createTrade(
            {
              ...trade.data,
              tradeId: `sample_${manifest.instanceId}_${trade.entityId}`,
              schemaVersion: 1,
            },
            {
              suppressAutoOpen: true,
              suppressPostCreateTasks: true,
              commitEventBatch,
              creationBatch: batch,
            }
          );
          this.record(manifest, recordsByEntityId, {
            entityId: trade.entityId,
            kind: 'trade',
            path,
          });
        }
        completed += 1;
        if (completed % 20 === 0) {
          await this.manifestStore.save(manifest);
          report('Creating fictional trades');
        }
      }
      await batch.flush(() => commitEventBatch.flush());
    } catch (error) {
      batch.abandon();
      throw error;
    }
    await this.manifestStore.save(manifest);

    const missedTradeService =
      await this.plugin.serviceManager.getMissedTradeService();
    this.plugin.missedTradeService = missedTradeService;
    for (const trade of pack.missedTrades) {
      const existing =
        recordsByEntityId.get(trade.entityId) ??
        this.getUniqueDiscoveredEntity(discovered, trade.entityId);
      if (
        existing &&
        (await this.isOwnedMarkdownFile(
          existing.path,
          manifest,
          trade.entityId
        ))
      ) {
        this.record(manifest, recordsByEntityId, {
          ...existing,
          kind: 'missed-trade',
        });
      } else {
        const path = await missedTradeService.createMissedTrade(trade.data, {
          suppressAutoOpen: true,
          deferPostCreateTasks: true,
        });
        this.record(manifest, recordsByEntityId, {
          entityId: trade.entityId,
          kind: 'missed-trade',
          path,
        });
      }
      completed += 1;
      report('Adding missed-trade examples');
    }

    const backtestTradeService =
      await this.plugin.serviceManager.getBacktestTradeService();
    this.plugin.backtestTradeService = backtestTradeService;
    for (const trade of pack.backtestTrades) {
      const existing =
        recordsByEntityId.get(trade.entityId) ??
        this.getUniqueDiscoveredEntity(discovered, trade.entityId);
      if (
        existing &&
        (await this.isOwnedMarkdownFile(
          existing.path,
          manifest,
          trade.entityId
        ))
      ) {
        this.record(manifest, recordsByEntityId, {
          ...existing,
          kind: 'backtest-trade',
        });
      } else {
        const file = await backtestTradeService.createBacktestTrade(
          trade.data,
          {
            openFile: false,
            deferPostCreateTasks: true,
            customFields: trade.data.customFields,
          }
        );
        if (!file) {
          throw new Error(
            `Failed to create sample backtest trade ${trade.entityId}`
          );
        }
        this.record(manifest, recordsByEntityId, {
          entityId: trade.entityId,
          kind: 'backtest-trade',
          path: file.path,
        });
      }
      completed += 1;
      report('Adding backtest examples');
    }
    await this.manifestStore.save(manifest);

    await this.materializeReviews(
      pack,
      manifest,
      recordsByEntityId,
      discovered,
      () => {
        completed += 1;
        report('Creating completed and in-progress reviews');
      }
    );

    manifest.phase = 'validating';
    await this.manifestStore.save(manifest);
    report('Validating sample journal ownership');
    await this.validateOwnedEntities(manifest, total);

    manifest.phase = 'active';
    manifest.activeOnLastShutdown = true;
    manifest.lastValidatedAt = new Date().toISOString();
    manifest.failureMessage = undefined;
    await this.manifestStore.save(manifest);
    eventBus.publish('trade:changed', {
      action: 'created',
      filePaths: manifest.owned
        .filter((entity) => entity.kind === 'trade')
        .map((entity) => entity.path),
    });
    eventBus.publish('settings:changed', { source: 'sample-journal' });
    report('Sample journal ready');
    return manifest;
  }

  async removeOwnedFiles(
    manifest: DemoManifest,
    onProgress?: ProgressListener
  ): Promise<{ removed: number; preserved: string[]; missing: string[] }> {
    manifest.phase = 'retiring';
    await this.manifestStore.save(manifest);
    const preserved = new Set<string>();
    const missing = new Set<string>();
    let removed = 0;
    const movedMarkdown = await this.discoverOwnedMarkdownFiles(
      manifest.instanceId
    );
    const movedMedia = await this.discoverOwnedMediaFiles(manifest.instanceId);
    const removalCandidates = new Map(
      manifest.owned.map((entity) => [entity.path, entity])
    );
    const recordedPaths = new Set(manifest.owned.map((entity) => entity.path));
    for (const discovered of [
      ...this.flattenDiscoveredEntities(movedMarkdown),
      ...this.flattenDiscoveredEntities(movedMedia),
    ]) {
      if (
        isPathWithinRoot(discovered.path, manifest.root) &&
        !recordedPaths.has(discovered.path)
      ) {
        removalCandidates.set(discovered.path, discovered);
      }
    }
    const owned = [...removalCandidates.values()].reverse();
    const planningCandidates = new Map<string, DemoOwnedEntity>();
    
    
    
    const completedPaths = new Set<string>();
    let stage: DemoMaterializationStage = 'verifying';
    const reportProgress = (paths: Iterable<string>, message: string) => {
      for (const path of paths) completedPaths.add(path);
      onProgress?.({
        phase: manifest.phase,
        stage,
        completed: completedPaths.size,
        total: owned.length,
        message,
      });
    };

    reportProgress([], 'Verifying sample ownership');

    for (const entity of owned) {
      if (!isPathWithinRoot(entity.path, manifest.root)) {
        preserved.add(entity.path);
        reportProgress([entity.path], 'Verifying sample ownership');
        continue;
      }
      const abstractFile = this.plugin.app.vault.getAbstractFileByPath(
        entity.path
      );
      if (!(abstractFile instanceof TFile)) {
        const discoveredEntities =
          entity.kind === 'media'
            ? movedMedia.get(entity.entityId)
            : movedMarkdown.get(entity.entityId);
        const alternatePaths = (discoveredEntities ?? []).filter(
          (discovered) => discovered.path !== entity.path
        );
        if (alternatePaths.length > 0) {
          if (
            alternatePaths.some((discovered) =>
              isPathWithinRoot(discovered.path, manifest.root)
            )
          ) {
            missing.add(entity.path);
          }
          for (const discovered of alternatePaths) {
            if (!isPathWithinRoot(discovered.path, manifest.root)) {
              preserved.add(discovered.path);
            }
          }
        } else {
          missing.add(entity.path);
        }
        reportProgress([entity.path], 'Verifying sample ownership');
        continue;
      }
      if (
        await this.hasPlanningOwnershipEvidence(
          entity,
          manifest,
          movedMarkdown,
          movedMedia
        )
      ) {
        planningCandidates.set(entity.path, entity);
      } else {
        preserved.add(entity.path);
      }
      reportProgress([entity.path], 'Verifying sample ownership');
    }

    stage = 'removing';
    completedPaths.clear();
    reportProgress([], 'Removing sample-owned files');
    const removedByFolder =
      await this.cleanupPlanner.removeCompactableOwnedFolders(
        manifest,
        removalCandidates.values(),
        planningCandidates
      );
    removed += removedByFolder.size;
    reportProgress(removedByFolder, 'Removing sample-owned files');

    for (const entity of owned) {
      if (removedByFolder.has(entity.path)) continue;
      if (!planningCandidates.has(entity.path)) {
        reportProgress([entity.path], 'Removing sample-owned files');
        continue;
      }
      try {
        const abstractFile = this.plugin.app.vault.getAbstractFileByPath(
          entity.path
        );
        if (!(abstractFile instanceof TFile)) {
          missing.add(entity.path);
          continue;
        }
        if (
          !(await isOwnedEntityFileOnDisk(
            this.plugin,
            abstractFile,
            entity,
            manifest
          ))
        ) {
          preserved.add(entity.path);
          continue;
        }
        await trashFileOrConfirmMissing(this.plugin, abstractFile);
        removed += 1;
      } finally {
        reportProgress([entity.path], 'Removing sample-owned files');
      }
    }
    await this.cleanupPlanner.removeEmptyOwnedFolders(
      manifest,
      removalCandidates.values()
    );
    return {
      removed,
      preserved: [...preserved],
      missing: [...missing],
    };
  }

  private async materializeReviews(
    pack: CompiledDemoPack,
    manifest: DemoManifest,
    recordsByEntityId: Map<string, DemoOwnedEntity>,
    discovered: DiscoveredOwnedEntities,
    onCreated: () => void
  ): Promise<void> {
    const drc = await this.plugin.serviceManager.getDRCService();
    const weekly = await this.plugin.serviceManager.getWeeklyReviewService();
    const monthly = await this.plugin.serviceManager.getMonthlyReviewService();
    const quarterly =
      await this.plugin.serviceManager.getQuarterlyReviewService();
    const yearly = await this.plugin.serviceManager.getYearlyReviewService();
    this.plugin.drcService = drc;
    this.plugin.weeklyReviewService = weekly;
    this.plugin.monthlyReviewService = monthly;
    this.plugin.quarterlyReviewService = quarterly;
    const creationBatch = new ReviewCreationBatch(this.plugin.app);

    try {
      for (const review of pack.reviews) {
        const recorded = recordsByEntityId.get(review.entityId);
        const recovered = recorded
          ? undefined
          : this.getUniqueDiscoveredEntity(discovered, review.entityId);
        const existing = recorded ?? recovered;
        const expectedPath = await this.getReviewPath(review, {
          drc,
          weekly,
          monthly,
          quarterly,
          yearly,
        });
        let path: string;
        if (
          existing &&
          (await this.isOwnedMarkdownFile(
            existing.path,
            manifest,
            review.entityId
          ))
        ) {
          path = existing.path;
          if (recovered) {
            await this.authorReview(path, review, manifest.instanceId);
          }
        } else {
          const candidatePaths = new Set(
            [existing?.path, expectedPath].filter(
              (candidate): candidate is string => candidate !== undefined
            )
          );
          for (const candidatePath of candidatePaths) {
            const target =
              this.plugin.app.vault.getAbstractFileByPath(candidatePath);
            if (target instanceof TFile) {
              throw new Error(
                `Refusing to overwrite a non-sample review: ${candidatePath}. Move or delete this file, then reset the sample journal.`
              );
            }
          }
          path = await this.createReview(
            review,
            manifest.instanceId,
            creationBatch,
            {
              drc,
              weekly,
              monthly,
              quarterly,
              yearly,
            }
          );
        }
        this.record(manifest, recordsByEntityId, {
          entityId: review.entityId,
          kind: 'review',
          path,
        });
        onCreated();
        if (manifest.owned.length % 10 === 0) {
          await this.manifestStore.save(manifest);
        }
      }
      await creationBatch.flush();
    } catch (error) {
      await creationBatch.abandon();
      await this.manifestStore.save(manifest);
      throw error;
    }
    await this.manifestStore.save(manifest);
  }

  private async getReviewPath(
    review: DemoReviewRecipe,
    services: {
      drc: JournalitPlugin['drcService'];
      weekly: JournalitPlugin['weeklyReviewService'];
      monthly: JournalitPlugin['monthlyReviewService'];
      quarterly: JournalitPlugin['quarterlyReviewService'];
      yearly: Awaited<
        ReturnType<JournalitPlugin['serviceManager']['getYearlyReviewService']>
      >;
    }
  ): Promise<string> {
    const date = toHostLocalCalendarDate(review.date);
    switch (review.type) {
      case 'drc':
        return services.drc.getDRCNotePath(date);
      case 'weekly':
        return services.weekly.getWeeklyReviewPath(date);
      case 'monthly':
        return services.monthly.getMonthlyReviewPath(date);
      case 'quarterly':
        return services.quarterly.getQuarterlyReviewPath(date);
      case 'yearly':
        return services.yearly.getYearlyReviewPath(date);
    }
  }

  private async createReview(
    review: DemoReviewRecipe,
    instanceId: string,
    creationBatch: ReviewCreationBatch,
    services: {
      drc: JournalitPlugin['drcService'];
      weekly: JournalitPlugin['weeklyReviewService'];
      monthly: JournalitPlugin['monthlyReviewService'];
      quarterly: JournalitPlugin['quarterlyReviewService'];
      yearly: Awaited<
        ReturnType<JournalitPlugin['serviceManager']['getYearlyReviewService']>
      >;
    }
  ): Promise<string> {
    const options = {
      sampleMaterialization: {
        ...createSampleReviewAuthoring(review, instanceId),
        creationBatch,
      },
    } as const;
    const date = toHostLocalCalendarDate(review.date);
    switch (review.type) {
      case 'drc':
        return services.drc.createDRC(date, options);
      case 'weekly':
        return services.weekly.createWeeklyReview(date, options);
      case 'monthly': {
        const file = await services.monthly.createMonthlyReview(date, options);
        if (!file) throw new Error('Failed to create sample monthly review');
        return file.path;
      }
      case 'quarterly': {
        const file = await services.quarterly.createQuarterlyReview(
          date,
          options
        );
        if (!file) throw new Error('Failed to create sample quarterly review');
        return file.path;
      }
      case 'yearly': {
        const file = await services.yearly.createYearlyReview(date, options);
        if (!file) throw new Error('Failed to create sample yearly review');
        return file.path;
      }
    }
  }

  private async authorReview(
    path: string,
    review: DemoReviewRecipe,
    instanceId: string
  ): Promise<void> {
    const abstractFile = this.plugin.app.vault.getAbstractFileByPath(path);
    if (!(abstractFile instanceof TFile)) {
      throw new Error(`Created sample review is missing: ${path}`);
    }
    const authoring = createSampleReviewAuthoring(review, instanceId);
    await this.plugin.app.fileManager.processFrontMatter(
      abstractFile,
      (frontmatter) => {
        const candidate: unknown = frontmatter;
        if (!isRecord(candidate)) {
          throw new Error(
            `Created sample review has invalid frontmatter: ${path}`
          );
        }
        Object.assign(
          candidate,
          materializeSampleReviewFrontmatter(candidate, authoring)
        );
      }
    );
    const current = await this.plugin.app.vault.read(abstractFile);
    if (!current.includes('journalit-sample-review-narrative:start')) {
      await this.plugin.app.vault.modify(
        abstractFile,
        appendSampleReviewBody(current, authoring.appendBody)
      );
    }
    eventBus.publish('review:changed', {
      type: review.type,
      action: 'updated',
      filePath: path,
      source: 'sample-journal',
    });
  }

  private record(
    manifest: DemoManifest,
    recordsByEntityId: Map<string, DemoOwnedEntity>,
    record: DemoOwnedEntity
  ): void {
    const normalized = { ...record, path: normalizePath(record.path) };
    recordsByEntityId.set(record.entityId, normalized);
    manifest.owned = Array.from(recordsByEntityId.values()).sort(
      (left, right) => left.entityId.localeCompare(right.entityId)
    );
  }

  private async discoverOwnedMarkdownFiles(
    instanceId: string,
    root?: string
  ): Promise<DiscoveredOwnedEntities> {
    const discovered: DiscoveredOwnedEntities = new Map();
    for (const file of this.plugin.app.vault.getMarkdownFiles()) {
      if (root && !isPathWithinRoot(file.path, root)) continue;
      const cache = this.plugin.app.metadataCache.getFileCache(file);
      let rawFrontmatter: unknown;
      if (cache) {
        rawFrontmatter = cache.frontmatter;
        if (!isRecord(rawFrontmatter)) continue;
      } else {
        const content = await this.plugin.app.vault.read(file);
        try {
          rawFrontmatter = parseFrontmatterFromContentOrThrow(content);
        } catch {
          continue;
        }
      }
      if (
        !isRecord(rawFrontmatter) ||
        getSampleInstanceId(rawFrontmatter) !== instanceId
      ) {
        continue;
      }
      const entityId = rawFrontmatter.journalitSampleEntityId;
      if (typeof entityId !== 'string' || !entityId.trim()) continue;
      const entity: DemoOwnedEntity = {
        entityId,
        kind: getDemoOwnedEntityKind(rawFrontmatter, file.path),
        path: file.path,
      };
      discovered.set(entityId, [...(discovered.get(entityId) ?? []), entity]);
    }
    return discovered;
  }

  private async discoverOwnedMediaFiles(
    instanceId: string
  ): Promise<DiscoveredOwnedEntities> {
    const discovered: DiscoveredOwnedEntities = new Map();
    for (const file of this.plugin.app.vault.getFiles()) {
      if (file.extension.toLowerCase() !== 'svg') continue;
      const content = await this.plugin.app.vault.read(file);
      const marker = content.match(
        /journalit-sample-instance:([^\s]+) journalit-sample-entity:([^\s]+)/
      );
      if (marker?.[1] !== instanceId || !marker[2]) continue;
      const entity: DemoOwnedEntity = {
        entityId: marker[2],
        kind: 'media',
        path: file.path,
      };
      discovered.set(marker[2], [...(discovered.get(marker[2]) ?? []), entity]);
    }
    return discovered;
  }

  private async hasPlanningOwnershipEvidence(
    entity: DemoOwnedEntity,
    manifest: DemoManifest,
    discoveredMarkdown: DiscoveredOwnedEntities,
    discoveredMedia: DiscoveredOwnedEntities
  ): Promise<boolean> {
    
    
    if (entity.kind === 'media') {
      return (
        Boolean(entity.contentHash) ||
        this.discoveryContainsPath(
          discoveredMedia,
          entity.entityId,
          entity.path
        )
      );
    }

    if (
      this.discoveryContainsPath(
        discoveredMarkdown,
        entity.entityId,
        entity.path
      )
    ) {
      return true;
    }

    return this.isOwnedMarkdownFile(entity.path, manifest, entity.entityId);
  }

  private getUniqueDiscoveredEntity(
    discovered: DiscoveredOwnedEntities,
    entityId: string
  ): DemoOwnedEntity | undefined {
    const matches = discovered.get(entityId) ?? [];
    if (matches.length > 1) {
      throw new Error(
        `Sample ownership discovery found duplicate entity ${entityId}: ${matches
          .map((entity) => entity.path)
          .join(', ')}`
      );
    }
    return matches[0];
  }

  private flattenDiscoveredEntities(
    discovered: DiscoveredOwnedEntities
  ): DemoOwnedEntity[] {
    return [...discovered.values()].flat();
  }

  private discoveryContainsPath(
    discovered: DiscoveredOwnedEntities,
    entityId: string,
    path: string
  ): boolean {
    return (discovered.get(entityId) ?? []).some(
      (entity) => entity.path === path
    );
  }

  private async ensureOwnedStaticFile(options: {
    instanceId: string;
    entityId: string;
    kind: 'support-note' | 'media';
    path: string;
    content: string;
    existing?: DemoOwnedEntity;
  }): Promise<string> {
    const path = normalizePath(options.existing?.path ?? options.path);
    const existingFile = this.plugin.app.vault.getAbstractFileByPath(path);
    if (existingFile instanceof TFile) {
      const current = await this.plugin.app.vault.read(existingFile);
      const marker =
        options.kind === 'media'
          ? `journalit-sample-instance:${options.instanceId} journalit-sample-entity:${options.entityId}`
          : `journalitSampleInstance: ${JSON.stringify(options.instanceId)}`;
      if (!current.includes(marker)) {
        throw new Error(`Refusing to overwrite a non-sample file: ${path}`);
      }
      return path;
    }
    await this.ensureParentFolder(path);
    await this.plugin.app.vault.create(path, options.content);
    return path;
  }

  private async isOwnedMarkdownFile(
    path: string,
    manifest: DemoManifest,
    entityId?: string
  ): Promise<boolean> {
    const abstractFile = this.plugin.app.vault.getAbstractFileByPath(path);
    if (!(abstractFile instanceof TFile)) return false;
    const cached =
      this.plugin.app.metadataCache.getFileCache(abstractFile)?.frontmatter;
    if (
      getSampleInstanceId(cached) === manifest.instanceId &&
      (!entityId || cached?.journalitSampleEntityId === entityId)
    ) {
      return true;
    }
    return this.isOwnedMarkdownFileOnDisk(abstractFile, manifest, entityId);
  }

  private async isOwnedMarkdownFileOnDisk(
    file: TFile,
    manifest: DemoManifest,
    entityId?: string
  ): Promise<boolean> {
    const content = await this.plugin.app.vault.read(file);
    try {
      const frontmatter = parseFrontmatterFromContentOrThrow(content);
      return (
        getSampleInstanceId(frontmatter) === manifest.instanceId &&
        (!entityId || frontmatter.journalitSampleEntityId === entityId)
      );
    } catch {
      return false;
    }
  }

  private assertPackMatchesManifest(
    pack: CompiledDemoPack,
    manifest: DemoManifest
  ): void {
    if (pack.root !== manifest.root) {
      throw new Error('Sample pack root does not match its ownership manifest');
    }
    const inputKeys: Array<keyof DemoManifest['inputs']> = [
      'packVersion',
      'seed',
      'anchorInstant',
      'timezone',
      'weekStartDay',
    ];
    for (const key of inputKeys) {
      if (pack.inputs[key] !== manifest.inputs[key]) {
        throw new Error(
          `Sample pack generation input does not match its ownership manifest: ${key}`
        );
      }
    }
    const ownedRecipes = [
      ...pack.setups,
      ...pack.trades,
      ...pack.missedTrades,
      ...pack.backtestTrades,
    ];
    for (const recipe of ownedRecipes) {
      if (
        recipe.data.journalitSampleInstance !== manifest.instanceId ||
        recipe.data.journalitSampleEntityId !== recipe.entityId
      ) {
        throw new Error(
          `Sample pack ownership marker does not match its manifest: ${recipe.entityId}`
        );
      }
    }
  }

  private async ensureParentFolder(path: string): Promise<void> {
    const segments = normalizePath(path).split('/').slice(0, -1);
    let current = '';
    for (const segment of segments) {
      current = current ? `${current}/${segment}` : segment;
      const existing = this.plugin.app.vault.getAbstractFileByPath(current);
      if (existing instanceof TFolder) continue;
      if (existing) {
        throw new Error(
          `Cannot create sample folder because a file exists: ${current}`
        );
      }
      await this.plugin.app.vault.createFolder(current);
    }
  }

  private async validateOwnedEntities(
    manifest: DemoManifest,
    expectedTotal: number
  ): Promise<void> {
    if (manifest.owned.length !== expectedTotal) {
      throw new Error(
        `Sample ownership manifest contains ${manifest.owned.length} of ${expectedTotal} expected entities`
      );
    }
    const seenPaths = new Set<string>();
    for (const entity of manifest.owned) {
      if (!isPathWithinRoot(entity.path, manifest.root)) {
        throw new Error(
          `Sample entity escaped the sample root: ${entity.path}`
        );
      }
      if (seenPaths.has(entity.path)) {
        throw new Error(
          `Sample manifest contains a duplicate path: ${entity.path}`
        );
      }
      seenPaths.add(entity.path);
      const file = this.plugin.app.vault.getAbstractFileByPath(entity.path);
      if (!(file instanceof TFile)) {
        throw new Error(`Sample entity is missing: ${entity.path}`);
      }
      const hasOwnership = await isOwnedEntityFileOnDisk(
        this.plugin,
        file,
        entity,
        manifest
      );
      if (!hasOwnership) {
        throw new Error(
          `Sample entity lost its ownership marker: ${entity.path}`
        );
      }
    }
  }
}
