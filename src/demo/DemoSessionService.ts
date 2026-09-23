import { FileView, Notice, TFile, normalizePath } from 'obsidian';
import type JournalitPlugin from '../main';
import { showConfirmationModal } from '../components/shared/ConfirmationModal';
import { SampleJournalPopout } from '../components/notifications/SampleJournalPopout';
import { t } from '../lang/helpers';
import { eventBus } from '../services/events/EventBus';
import { imageService } from '../services/image/ImageService';
import { createTradeLogFilters } from '../settings/viewFiltersDefaults';
import { generateUUID } from '../utils/uuid';
import {
  DEMO_DEFAULT_ROOT,
  DEMO_PACK_VERSION,
  DemoManifestStore,
  createDemoManifest,
  hashDemoMediaContent,
} from './DemoManifest';
import type {
  DemoManifest,
  DemoManifestPhase,
  DemoOwnedEntity,
  DemoOwnedEntityKind,
} from './DemoManifest';
import { DemoMaterializer } from './DemoMaterializer';
import type { DemoMaterializationProgress } from './DemoMaterializer';
import { DemoSyncGate } from './DemoSyncGate';
import {
  DEMO_CUSTOM_FIELDS_NAMESPACE,
  DEMO_OPTIONS_NAMESPACE,
  compileDemoPack,
} from './compileDemoPack';
import {
  countPreservedSampleContent,
  removeEmptySampleRoot,
  sampleRootHasRemainingContent,
} from './DemoRootContent';

export interface DemoSessionSnapshot {
  active: boolean;
  busy: boolean;
  phase: DemoManifestPhase | 'idle';
  root: string | null;
  progress: DemoMaterializationProgress | null;
}

export type DemoJournalMutationContext = 'real' | 'sample' | 'deferred';

interface DemoOwnershipClaim {
  instanceId: string;
  entityId: string;
  kind: DemoOwnedEntityKind;
}

type DemoSessionListener = () => void;

const SAMPLE_SEED = 'journalit-fictional-sample-v2';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export class DemoSessionService {
  private readonly manifestStore: DemoManifestStore;
  private readonly materializer: DemoMaterializer;
  private listeners = new Set<DemoSessionListener>();
  private snapshot: DemoSessionSnapshot = {
    active: false,
    busy: false,
    phase: 'idle',
    root: null,
    progress: null,
  };
  private operation: Promise<void> | null = null;
  private progressNotice: Notice | null = null;
  private activeInstanceId: string | null = null;
  private ownershipRecordQueue: Promise<void> = Promise.resolve();
  private popout: SampleJournalPopout | null = null;

  constructor(private readonly plugin: JournalitPlugin) {
    this.manifestStore = new DemoManifestStore(plugin);
    this.materializer = new DemoMaterializer(plugin, this.manifestStore);
    imageService.setSampleMediaOwnershipHandler(async (path, content) => {
      const claim = this.claimNewOwnership('media');
      if (!claim) return;
      await this.recordCreatedMedia(path, claim, hashDemoMediaContent(content));
    });
  }

  initializePopout(): void {
    if (this.popout) return;
    this.popout = new SampleJournalPopout(this);
    this.popout.start();
  }

  cleanup(): void {
    imageService.setSampleMediaOwnershipHandler(null);
    this.popout?.cleanup();
    this.popout = null;
    this.progressNotice?.hide();
    this.progressNotice = null;
  }

  async initialize(): Promise<void> {
    return this.runExclusive(async () => {
      const manifest = await this.manifestStore.load();
      if (!manifest) return;
      this.updateSnapshot({ phase: manifest.phase, root: manifest.root });
      if (manifest.phase === 'retiring') {
        try {
          await this.finishInterruptedRetirement(manifest);
        } catch (error) {
          await this.handleRestoreFailure(
            manifest,
            'finish interrupted sample cleanup',
            error
          );
        }
        return;
      }
      if (manifest.activeOnLastShutdown && manifest.phase !== 'removed') {
        try {
          await this.resumeOrActivate(manifest, false);
        } catch (error) {
          await this.handleRestoreFailure(
            manifest,
            'restore sample context',
            error
          );
        }
      }
    });
  }

  getSnapshot = (): DemoSessionSnapshot => this.snapshot;

  subscribe = (listener: DemoSessionListener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  isActive(): boolean {
    return this.snapshot.active;
  }

  hasRecoverableSession(): boolean {
    return this.snapshot.phase !== 'idle' && this.snapshot.phase !== 'removed';
  }

  getJournalMutationContext(): DemoJournalMutationContext {
    if (this.snapshot.busy) return 'deferred';
    if (!this.snapshot.active) return 'real';
    if (this.snapshot.phase !== 'active' || !this.activeInstanceId) {
      return 'deferred';
    }
    return 'sample';
  }

  claimNewOwnership(kind: DemoOwnedEntityKind): DemoOwnershipClaim | null {
    const mutationContext = this.getJournalMutationContext();
    if (mutationContext === 'deferred') {
      throw new Error(t('sample.notice.busy'));
    }
    if (mutationContext === 'real') return null;
    return {
      instanceId: this.activeInstanceId!,
      entityId: `user-${kind}-${generateUUID()}`,
      kind,
    };
  }

  async recordCreatedEntity(
    path: string,
    claim: DemoOwnershipClaim
  ): Promise<void> {
    await this.enqueueOwnershipRecord(path, claim).catch(() => undefined);
  }

  async recordCreatedMedia(
    path: string,
    claim: DemoOwnershipClaim,
    contentHash: string
  ): Promise<void> {
    await this.enqueueOwnershipRecord(path, claim, contentHash);
  }

  private enqueueOwnershipRecord(
    path: string,
    claim: DemoOwnershipClaim,
    contentHash?: string
  ): Promise<void> {
    const normalizedPath = normalizePath(path);
    const task = this.ownershipRecordQueue.then(async () => {
      if (this.activeInstanceId !== claim.instanceId) return;
      const manifest = await this.manifestStore.load();
      if (
        this.activeInstanceId !== claim.instanceId ||
        !manifest ||
        manifest.phase !== 'active' ||
        manifest.instanceId !== claim.instanceId ||
        !normalizedPath.startsWith(`${normalizePath(manifest.root)}/`)
      ) {
        throw new Error(
          `Cannot register sample ownership outside the active journal: ${normalizedPath}`
        );
      }
      const record: DemoOwnedEntity = {
        entityId: claim.entityId,
        kind: claim.kind,
        path: normalizedPath,
        contentHash,
      };
      manifest.owned = [
        ...manifest.owned.filter(
          (entity) =>
            entity.entityId !== record.entityId && entity.path !== record.path
        ),
        record,
      ].sort((left, right) => left.entityId.localeCompare(right.entityId));
      await this.manifestStore.save(manifest);
    });
    this.ownershipRecordQueue = task.catch((error) => {
      this.reportOwnershipRegistrationFailure(
        `Failed to register sample ownership for ${normalizedPath}`,
        error
      );
    });
    return task;
  }

  async recordMovedEntity(oldPath: string, newPath: string): Promise<void> {
    await this.recordMovedEntities([{ oldPath, newPath }]);
  }

  async recordMovedEntities(
    moves: readonly { oldPath: string; newPath: string }[]
  ): Promise<void> {
    const normalizedMoves = moves.flatMap(({ oldPath, newPath }) => {
      const normalizedOldPath = normalizePath(oldPath);
      const normalizedNewPath = normalizePath(newPath);
      return normalizedOldPath === normalizedNewPath
        ? []
        : [{ oldPath: normalizedOldPath, newPath: normalizedNewPath }];
    });
    if (normalizedMoves.length === 0) return;

    const task = this.ownershipRecordQueue.then(async () => {
      if (!this.activeInstanceId) return;
      const instanceId = this.activeInstanceId;
      const manifest = await this.manifestStore.load();
      if (
        this.activeInstanceId !== instanceId ||
        !manifest ||
        manifest.phase !== 'active'
      ) {
        return;
      }
      const rootPrefix = `${normalizePath(manifest.root)}/`;
      let changed = false;
      for (const move of normalizedMoves) {
        if (!move.newPath.startsWith(rootPrefix)) continue;
        const ownedIndex = manifest.owned.findIndex(
          (entity) => entity.path === move.oldPath
        );
        if (ownedIndex === -1) continue;
        manifest.owned[ownedIndex] = {
          ...manifest.owned[ownedIndex],
          path: move.newPath,
        };
        changed = true;
      }
      if (!changed) return;
      await this.manifestStore.save(manifest);
    });
    this.ownershipRecordQueue = task.catch((error) => {
      this.reportOwnershipRegistrationFailure(
        'Failed to update sample ownership after moving owned files',
        error
      );
    });
    await this.ownershipRecordQueue;
  }

  async adoptCreatedMarkdownFile(
    path: string,
    claim: DemoOwnershipClaim
  ): Promise<void> {
    const file = this.plugin.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      throw new Error(`Created sample file is missing: ${path}`);
    }
    await this.plugin.app.fileManager.processFrontMatter(
      file,
      (frontmatter) => {
        const candidate: unknown = frontmatter;
        if (!isRecord(candidate)) {
          throw new Error(
            `Created sample file has invalid frontmatter: ${path}`
          );
        }
        const record = candidate;
        record.journalitSampleInstance = claim.instanceId;
        record.journalitSampleEntityId = claim.entityId;
      }
    );
    await this.recordCreatedEntity(path, claim);
  }

  async startOrOpen(): Promise<void> {
    return this.runExclusive(async () => {
      if (this.snapshot.active) {
        await this.plugin.viewManager.openHomeView();
        return;
      }
      await this.plugin.waitForStartupTradeMigrations();
      const existing = await this.manifestStore.load();
      if (existing && existing.phase !== 'removed') {
        if (existing.phase === 'retiring') {
          const resumesReset = existing.activeOnLastShutdown;
          await this.finishInterruptedRetirement(existing);
          if (resumesReset) return;
          const root = await this.resolveNewRoot();
          if (!root) return;
          await this.createAndActivate({
            root,
            generation: 1,
            anchorInstant: new Date(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            weekStartDay:
              this.plugin.settings.trade.weekStartDay === 'sunday'
                ? 'sunday'
                : 'monday',
          });
          return;
        }
        await this.resumeOrActivate(existing, true);
        return;
      }
      const root = await this.resolveNewRoot();
      if (!root) return;
      await this.createAndActivate({
        root,
        generation: 1,
        anchorInstant: new Date(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        weekStartDay:
          this.plugin.settings.trade.weekStartDay === 'sunday'
            ? 'sunday'
            : 'monday',
      });
    });
  }

  async requestExit(): Promise<void> {
    const confirmed = await showConfirmationModal(this.plugin.app, {
      title: t('sample.exit.title'),
      message: t('sample.exit.remove-warning'),
      confirmLabel: t('sample.exit.remove'),
      cancelLabel: t('button.cancel'),
      destructive: true,
    });
    if (!confirmed) return;
    await this.remove();
  }

  async requestReset(): Promise<void> {
    const confirmed = await showConfirmationModal(this.plugin.app, {
      title: t('sample.reset.title'),
      message: [
        { text: t('sample.reset.message') },
        { text: t('sample.reset.warning'), destructive: true },
      ],
      confirmLabel: t('sample.action.reset'),
      cancelLabel: t('button.cancel'),
      destructive: true,
    });
    if (!confirmed) return;
    await this.reset();
  }

  async reset(): Promise<void> {
    return this.runExclusive(async () => {
      let completed = false;
      const manifest = await this.manifestStore.load();
      if (!manifest) {
        await this.plugin.waitForStartupTradeMigrations();
        const root = await this.resolveNewRoot();
        if (!root) return;
        await this.createAndActivate({
          root,
          generation: 1,
          anchorInstant: new Date(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          weekStartDay:
            this.plugin.settings.trade.weekStartDay === 'sunday'
              ? 'sunday'
              : 'monday',
        });
        completed = true;
        return;
      }
      try {
        manifest.activeOnLastShutdown = true;
        await this.manifestStore.save(manifest);
        DemoSyncGate.activate();
        await this.activateRealContext(true);
        await this.ownershipRecordQueue;
        await this.plugin.waitForStartupTradeMigrations();
        const result = await this.materializer.removeOwnedFiles(
          manifest,
          (progress) => this.updateSnapshot({ progress, phase: progress.phase })
        );
        const preservedCount = await countPreservedSampleContent(
          this.plugin.app,
          manifest.root,
          result.preserved
        );
        await this.plugin.settingsManager.removeSampleSettings();
        await this.plugin.uiStateManager.removeSampleState();
        await this.manifestStore.remove();
        const nextRoot =
          preservedCount > 0 ||
          (await sampleRootHasRemainingContent(this.plugin.app, manifest.root))
            ? await this.findAvailableRoot(manifest.root)
            : manifest.root;
        await this.createAndActivate({
          root: nextRoot,
          instanceId: manifest.instanceId,
          generation: manifest.generation + 1,
          anchorInstant: new Date(manifest.inputs.anchorInstant),
          timezone: manifest.inputs.timezone,
          weekStartDay: manifest.inputs.weekStartDay,
        });
        completed = true;
        new Notice(
          preservedCount > 0
            ? t('sample.notice.reset-preserved', {
                count: String(preservedCount),
              })
            : t('sample.notice.reset')
        );
      } finally {
        if (!completed && !this.snapshot.active) {
          await this.restoreRealContextAfterFailedCleanup();
        }
      }
    });
  }

  async remove(): Promise<void> {
    return this.runExclusive(async () => {
      let completed = false;
      const manifest = await this.manifestStore.load();
      if (manifest) {
        manifest.activeOnLastShutdown = false;
        await this.manifestStore.save(manifest);
      }
      try {
        DemoSyncGate.activate();
        await this.activateRealContext(true);
        await this.ownershipRecordQueue;
        const result = manifest
          ? await this.materializer.removeOwnedFiles(manifest, (progress) =>
              this.updateSnapshot({ progress, phase: progress.phase })
            )
          : { removed: 0, preserved: [], missing: [] };
        const preservedCount = manifest
          ? await countPreservedSampleContent(
              this.plugin.app,
              manifest.root,
              result.preserved
            )
          : 0;
        if (manifest) {
          await removeEmptySampleRoot(this.plugin.app, manifest.root);
        }
        await this.plugin.settingsManager.removeSampleSettings();
        await this.plugin.uiStateManager.removeSampleState();
        await this.manifestStore.remove();
        await this.removeSampleConfigDirectoryIfEmpty();
        DemoSyncGate.deactivate();
        this.updateSnapshot({
          active: false,
          busy: false,
          phase: 'idle',
          root: null,
          progress: null,
        });
        void this.plugin.initializeRealContextBackgroundServices(true);
        completed = true;
        await this.plugin.viewManager.openHomeView();
        new Notice(
          preservedCount > 0
            ? t('sample.notice.removed-preserved', {
                count: String(preservedCount),
              })
            : t('sample.notice.removed')
        );
      } finally {
        if (!completed) {
          await this.restoreRealContextAfterFailedCleanup();
        }
      }
    });
  }

  private async createAndActivate(options: {
    root: string;
    instanceId?: string;
    generation: number;
    anchorInstant: Date;
    timezone: string;
    weekStartDay: 'monday' | 'sunday';
  }): Promise<void> {
    const instanceId = options.instanceId ?? generateUUID();
    const pack = compileDemoPack({
      instanceId,
      seed: SAMPLE_SEED,
      anchorInstant: options.anchorInstant,
      timezone: options.timezone,
      weekStartDay: options.weekStartDay,
      root: options.root,
    });
    const manifest = createDemoManifest({
      instanceId,
      generation: options.generation,
      root: options.root,
      inputs: pack.inputs,
    });
    manifest.activeOnLastShutdown = true;
    await this.manifestStore.save(manifest);
    await this.activateSampleContext(manifest, pack.settings);
    await this.seedSampleUiState(pack);
    try {
      await this.materializer.materialize(pack, manifest, (progress) =>
        this.updateSnapshot({ progress, phase: progress.phase })
      );
      this.plugin.graphLinkService?.resumeAfterContextSwitch();
      this.updateSnapshot({
        active: true,
        phase: 'active',
        root: manifest.root,
        progress: null,
      });
      await this.plugin.viewManager.openHomeView();
      new Notice(t('sample.notice.ready'));
    } catch (error) {
      manifest.phase = 'failed';
      manifest.failureMessage =
        error instanceof Error ? error.message : String(error);
      manifest.activeOnLastShutdown = true;
      await this.manifestStore.save(manifest);
      this.updateSnapshot({ phase: 'failed', progress: null });
      throw error;
    }
  }

  private async resumeOrActivate(
    manifest: DemoManifest,
    openHomeOnComplete: boolean
  ): Promise<void> {
    await this.plugin.waitForStartupTradeMigrations();
    
    
    
    
    
    
    if (
      manifest.phase !== 'active' &&
      manifest.inputs.packVersion !== DEMO_PACK_VERSION
    ) {
      await this.finishInterruptedRetirement({
        ...manifest,
        activeOnLastShutdown: true,
      });
      return;
    }
    const pack = compileDemoPack({
      instanceId: manifest.instanceId,
      seed: manifest.inputs.seed,
      anchorInstant: new Date(manifest.inputs.anchorInstant),
      timezone: manifest.inputs.timezone,
      weekStartDay: manifest.inputs.weekStartDay,
      root: manifest.root,
    });
    await this.activateSampleContext(
      manifest,
      pack.settings,
      manifest.phase === 'active'
    );
    if (
      manifest.phase !== 'active' ||
      !this.plugin.uiStateManager.hasPersistedState()
    ) {
      await this.seedSampleUiState(pack);
    }
    if (manifest.phase !== 'active') {
      await this.materializer.materialize(pack, manifest, (progress) =>
        this.updateSnapshot({ progress, phase: progress.phase })
      );
    } else {
      manifest.activeOnLastShutdown = true;
      await this.manifestStore.save(manifest);
    }
    this.plugin.graphLinkService?.resumeAfterContextSwitch();
    this.updateSnapshot({
      active: true,
      phase: 'active',
      root: manifest.root,
      progress: null,
    });
    if (openHomeOnComplete) {
      await this.plugin.viewManager.openHomeView();
    }
  }

  private async activateSampleContext(
    manifest: DemoManifest,
    seedSettings?: Parameters<
      JournalitPlugin['settingsManager']['activateSampleContext']
    >[0],
    preferPersisted = false
  ): Promise<void> {
    await this.plugin.waitForRealContextBackgroundServices();
    await this.plugin.viewGuideService?.prepareContextSwitch();
    DemoSyncGate.activate();
    try {
      await Promise.all([
        this.plugin.backendIntegrationService?.quiesceForSampleContext?.(),
        this.plugin.tradeProjectionSyncService?.quiesceForSampleContext?.(),
        this.plugin.tradeSyncCoordinator?.quiesceForSampleContext?.(),
        this.quiesceEconomicCalendarForSampleContext(),
        this.plugin.graphLinkService?.quiesceForContextSwitch(),
      ]);
      this.plugin.viewManager?.closeContextBoundViews();
      this.closeJournalMarkdownLeaves();
      this.activeInstanceId = manifest.instanceId;
      await this.plugin.settingsManager.activateSampleContext(seedSettings, {
        preferPersisted,
      });
      await this.plugin.serviceManager.activateFolderContext(
        'sample',
        manifest.root
      );
      await this.plugin.uiStateManager.activateContext('sample');
      this.synchronizeRecentItemsFromUIState();
      await this.plugin.optionsService.setNamespace(DEMO_OPTIONS_NAMESPACE);
      this.plugin.customFieldsService.setNamespace(
        DEMO_CUSTOM_FIELDS_NAMESPACE
      );
      this.plugin.specService.loadMappings();
      this.plugin.customReviewFieldsService.reloadFromSettings();
      this.plugin.reviewDataCache?.invalidateAll();
      await this.plugin.viewGuideService?.loadActiveContext();
      eventBus.publish('settings:changed', { source: 'sample-context' });
      this.updateSnapshot({
        active: true,
        phase: manifest.phase,
        root: manifest.root,
      });
    } catch (error) {
      if (manifest.phase !== 'active') {
        manifest.phase = 'failed';
      }
      manifest.activeOnLastShutdown = false;
      manifest.failureMessage =
        error instanceof Error ? error.message : String(error);
      try {
        await this.manifestStore.save(manifest);
      } catch (manifestError) {
        console.error(
          '[DemoSessionService] Failed to persist sample activation failure:',
          manifestError
        );
      }
      try {
        await this.activateRealContext();
      } catch (rollbackError) {
        console.error(
          '[DemoSessionService] Failed to roll back sample context activation:',
          rollbackError
        );
        DemoSyncGate.activate();
      }
      throw error;
    }
  }

  private async finishInterruptedRetirement(
    manifest: DemoManifest
  ): Promise<void> {
    await this.plugin.waitForStartupTradeMigrations();
    const resumeReset = manifest.activeOnLastShutdown;
    DemoSyncGate.activate();
    await this.activateRealContext(true);
    const result = await this.materializer.removeOwnedFiles(
      manifest,
      (progress) => this.updateSnapshot({ progress, phase: progress.phase })
    );
    if (!resumeReset) {
      await removeEmptySampleRoot(this.plugin.app, manifest.root);
    }
    await this.plugin.settingsManager.removeSampleSettings();
    await this.plugin.uiStateManager.removeSampleState();
    await this.manifestStore.remove();
    await this.removeSampleConfigDirectoryIfEmpty();

    if (resumeReset) {
      const nextRoot =
        result.preserved.length > 0 ||
        (await sampleRootHasRemainingContent(this.plugin.app, manifest.root))
          ? await this.findAvailableRoot(manifest.root)
          : manifest.root;
      await this.createAndActivate({
        root: nextRoot,
        instanceId: manifest.instanceId,
        generation: manifest.generation + 1,
        anchorInstant: new Date(manifest.inputs.anchorInstant),
        timezone: manifest.inputs.timezone,
        weekStartDay: manifest.inputs.weekStartDay,
      });
      return;
    }

    DemoSyncGate.deactivate();
    this.updateSnapshot({
      active: false,
      phase: 'idle',
      root: null,
      progress: null,
    });
    void this.plugin.initializeRealContextBackgroundServices(true);
  }

  private async handleRestoreFailure(
    manifest: DemoManifest,
    operation: string,
    error: unknown
  ): Promise<void> {
    console.error(`[DemoSessionService] Failed to ${operation}:`, error);
    try {
      if (DemoSyncGate.isActive()) {
        await this.activateRealContext();
      }
      this.updateSnapshot({
        active: false,
        phase: 'failed',
        root: manifest.root,
        progress: null,
      });
    } catch (rollbackError) {
      console.error(
        '[DemoSessionService] Failed to restore the real journal context:',
        rollbackError
      );
      DemoSyncGate.activate();
      this.activeInstanceId = manifest.instanceId;
      this.updateSnapshot({
        active: true,
        phase: 'failed',
        root: manifest.root,
        progress: null,
      });
    }
  }

  private async activateRealContext(keepSyncGate = false): Promise<void> {
    await this.plugin.viewGuideService?.prepareContextSwitch();
    await this.plugin.graphLinkService?.quiesceForContextSwitch();
    this.plugin.viewManager?.closeContextBoundViews();
    this.closeJournalMarkdownLeaves();
    this.activeInstanceId = null;
    await this.plugin.settingsManager.activateRealContext();
    await this.plugin.serviceManager.activateFolderContext('real');
    await this.plugin.uiStateManager.activateContext('real');
    this.synchronizeRecentItemsFromUIState();
    await this.plugin.optionsService.setNamespace('options');
    this.plugin.customFieldsService.setNamespace('');
    this.plugin.specService.loadMappings();
    this.plugin.customReviewFieldsService.reloadFromSettings();
    this.plugin.reviewDataCache?.invalidateAll();
    await this.plugin.viewGuideService?.loadActiveContext();
    if (!keepSyncGate) DemoSyncGate.deactivate();
    eventBus.publish('settings:changed', { source: 'real-context' });
    this.plugin.graphLinkService?.resumeAfterContextSwitch();
    this.updateSnapshot({ active: false, progress: null });
    if (!keepSyncGate) {
      void this.plugin.initializeRealContextBackgroundServices(true);
    }
  }

  private async quiesceEconomicCalendarForSampleContext(): Promise<void> {
    if (
      !this.plugin.serviceManager.isServiceInitialized(
        'economicCalendarService'
      )
    ) {
      return;
    }
    const service =
      await this.plugin.serviceManager.getEconomicCalendarService();
    await service.quiesceForSampleContext();
  }

  private closeJournalMarkdownLeaves(): void {
    const root = normalizePath(
      this.plugin.serviceManager.getFolderPathService().journalFolderPath
    );
    for (const leaf of this.plugin.app.workspace.getLeavesOfType('markdown')) {
      const file = leaf.view instanceof FileView ? leaf.view.file : null;
      if (file?.path.startsWith(`${root}/`)) {
        leaf.detach();
      }
    }
  }

  private async seedSampleUiState(
    pack: ReturnType<typeof compileDemoPack>
  ): Promise<void> {
    const filters = pack.settings.dashboard?.defaultFilters;
    let viewFilters;
    if (filters) {
      const { dateRange, ...reviewFilters } = filters;
      void dateRange;
      viewFilters = {
        dashboard: filters,
        tradelog: {
          ...createTradeLogFilters(),
          ...filters,
          dateRange: [null, null] as [null, null],
          viewLevel: 'trades' as const,
          sessionLogTags: [],
        },
        reviews: reviewFilters,
      };
    }
    await this.plugin.uiStateManager.updateStateImmediate({
      dashboardActiveLayout: 'Performance Overview',
      homeActiveLayout: 'Daily Routine',
      homeViewMode: 'overview',
      selectedPeriod: 'lifetime',
      lastUsedFilters: filters,
      viewFilters,
      gettingStartedDismissed: true,
      recentItems: [],
    });
    this.synchronizeRecentItemsFromUIState();
  }

  private async resolveNewRoot(): Promise<string | null> {
    const preferredRoot = DEMO_DEFAULT_ROOT;
    if (!(await this.plugin.app.vault.adapter.exists(preferredRoot))) {
      return preferredRoot;
    }
    const available = await this.findAvailableRoot(preferredRoot);
    const confirmed = await showConfirmationModal(this.plugin.app, {
      title: t('sample.collision.title'),
      message: t('sample.collision.message', { path: available }),
      confirmLabel: t('sample.collision.confirm'),
      cancelLabel: t('button.cancel'),
    });
    return confirmed ? available : null;
  }

  private async findAvailableRoot(baseRoot: string): Promise<string> {
    let suffix = 2;
    let available = `${baseRoot} ${suffix}`;
    while (await this.plugin.app.vault.adapter.exists(available)) {
      suffix += 1;
      available = `${baseRoot} ${suffix}`;
    }
    return available;
  }

  private synchronizeRecentItemsFromUIState(): void {
    const recentItems = [...this.plugin.uiStateManager.getState().recentItems];
    this.plugin.recentItems = recentItems;
    eventBus.publish('recent-items:changed', {
      recentItems: recentItems.map((item) => ({
        path: item.path || item.viewType || '',
        timestamp: new Date(item.openedAt).getTime(),
        type: item.type,
      })),
    });
  }

  private async restoreRealContextAfterFailedCleanup(): Promise<void> {
    try {
      await this.activateRealContext();
    } catch (error) {
      console.error(
        '[DemoSessionService] Failed to restore the real journal after sample cleanup:',
        error
      );
      DemoSyncGate.activate();
    }
  }

  private reportOwnershipRegistrationFailure(
    message: string,
    error?: unknown
  ): void {
    console.warn(`[DemoSessionService] ${message}`, error ?? '');
    new Notice(
      t('sample.notice.error', {
        error: error instanceof Error ? error.message : message,
      }),
      10000
    );
  }

  private async removeSampleConfigDirectoryIfEmpty(): Promise<void> {
    const directory = this.manifestStore.getDirectoryPath();
    if (!(await this.plugin.app.vault.adapter.exists(directory))) return;
    const listed = await this.plugin.app.vault.adapter.list(directory);
    if (listed.files.length === 0 && listed.folders.length === 0) {
      await this.plugin.app.vault.adapter.rmdir(directory, true);
    }
  }

  private runExclusive(operation: () => Promise<void>): Promise<void> {
    if (this.operation) {
      new Notice(t('sample.notice.busy'));
      return Promise.resolve();
    }
    this.updateSnapshot({ busy: true });
    this.operation = operation()
      .catch((error) => {
        console.error(
          '[DemoSessionService] Sample journal operation failed:',
          error
        );
        new Notice(
          t('sample.notice.error', {
            error: error instanceof Error ? error.message : String(error),
          }),
          10000
        );
      })
      .finally(() => {
        this.operation = null;
        this.updateSnapshot({ busy: false, progress: null });
      });
    return this.operation;
  }

  private updateSnapshot(updates: Partial<DemoSessionSnapshot>): void {
    this.snapshot = { ...this.snapshot, ...updates };
    if (this.snapshot.progress) {
      const message = t(
        this.snapshot.progress.stage === 'verifying'
          ? 'sample.progress.verifying'
          : this.snapshot.progress.stage === 'removing'
            ? 'sample.progress.removing'
            : 'sample.progress.creating',
        {
          completed: String(this.snapshot.progress.completed),
          total: String(this.snapshot.progress.total),
        }
      );
      if (this.progressNotice) {
        this.progressNotice.setMessage(message);
      } else {
        this.progressNotice = new Notice(message, 0);
      }
    } else if (this.progressNotice) {
      this.progressNotice.hide();
      this.progressNotice = null;
    }
    for (const listener of this.listeners) listener();
  }
}
