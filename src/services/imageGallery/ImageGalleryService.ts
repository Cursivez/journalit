import { TFile, type EventRef } from 'obsidian';
import type JournalitPlugin from '../../main';
import { getJournalitCachePath } from '../base/pluginStoragePaths';
import { eventBus } from '../events';
import {
  getMediaKind,
  resolveVaultMediaFile,
} from '../../utils/imageMediaUtils';
import { parseLocalDateSafe } from '../../utils/dateUtils';
import { getTradingDayString } from '../../utils/tradingDayUtils';

import {
  CustomFieldType,
  isDiscreteCustomFieldFilterable,
} from '../../types/customFields';
import { fetchBreakEvenAccountBalanceLookup } from '../trade/core/BreakEvenAccountBalance';
import { getTradeDirectionDisplayKind } from '../trade/core/TradeDirection';
import { OptionType } from '../options/CustomOptionsService';
import type { TradeLogFilters } from '../tradelog/types';
import type {
  ImageGalleryAnnotation,
  ImageGalleryItem,
} from '../../components/imageGallery/types';
import type { AvailableImageFilterOptions } from '../../components/shared/filters/types';
import {
  asRecordArray,
  getAnnotation,
  getDateValue,
  getString,
  getStringArray,
  getTradeDateValue,
  hasAnnotationEntry,
  IMAGE_GALLERY_INDEX_TTL_MS,
  IMAGE_GALLERY_INDEX_VERSION,
  isRecord,
  isReviewNoteType,
  normalizeImagePath,
  REVIEW_METADATA_READY_TIMEOUT_MS,
  REVIEW_TYPE_TO_SOURCE,
  SOURCE_TO_REVIEW_TYPE,
  type ImageGallerySourceType,
  type PersistedImageGalleryIndex,
  type ReviewNoteType,
  type TradeRecord,
} from './ImageGalleryInternal';
import {
  matchesImageGalleryTradeLogFilters,
  normalizeCustomFieldFilterValue,
} from './ImageGalleryFilters';
import {
  classifyOutcome,
  getBreakEvenBalance,
  getCustomFieldRawValue,
  getTradeAccountVariants,
  getTradeRecordType,
  getTradeStatus,
  reviewSourceLabel,
  shouldShowTradePnl,
  toTradePnl,
} from './ImageGalleryProjection';
import {
  isEmptyPersistedAnnotation,
  normalizeAnnotationForPersistence,
  publishTradeAnnotationChanged,
} from './ImageGalleryAnnotations';
import {
  isMissingFileError,
  normalizePersistedImageGalleryIndex,
} from './ImageGalleryPersistence';
import { ImageGalleryAnnotationStore } from './ImageGalleryAnnotationStore';
import { ImageGalleryFolderSource } from './ImageGalleryFolderSource';
import {
  clearPersistedImageGalleryIndex,
  getImageGalleryIndexPath,
} from './ImageGalleryIndexStorage';
import { refreshMetadataWithRecovery } from './ImageGalleryMetadataRefresh';

export class ImageGalleryService {
  private cachedItems: ImageGalleryItem[] | null = null;
  private pendingLoad: Promise<ImageGalleryItem[]> | null = null;
  private persistedIndexInvalidated = false;
  private loadGeneration = 0;
  private annotations: ImageGalleryAnnotationStore;
  private folderSource: ImageGalleryFolderSource;

  constructor(private plugin: JournalitPlugin) {
    this.annotations = new ImageGalleryAnnotationStore(plugin);
    this.folderSource = new ImageGalleryFolderSource(plugin, this.annotations);
  }

  invalidate(): void {
    this.cachedItems = null;
    this.pendingLoad = null;
    this.persistedIndexInvalidated = true;
    this.loadGeneration += 1;
    void this.clearPersistedIndex();
  }

  async getItems(filters: TradeLogFilters): Promise<ImageGalleryItem[]> {
    return (await this.getItemsWithTotal(filters)).items;
  }

  async getItemsWithTotal(filters: TradeLogFilters): Promise<{
    items: ImageGalleryItem[];
    totalItemCount: number;
  }> {
    const sessionLogMatchingDaysPromise =
      filters.sessionLogTags.length > 0
        ? this.getSessionLogMatchingDays(filters.sessionLogTags)
        : Promise.resolve(null);
    const [allItems, sessionLogMatchingDays] = await Promise.all([
      this.getAllItems(),
      sessionLogMatchingDaysPromise,
    ]);

    const items = allItems.filter((item) => {
      let itemTradingDay: string | null = null;
      if (sessionLogMatchingDays) {
        const itemDate = parseLocalDateSafe(item.date);
        if (itemDate) {
          itemTradingDay = getTradingDayString(itemDate, this.plugin);
        }
      }

      return matchesImageGalleryTradeLogFilters(item, filters, {
        matchingDays: sessionLogMatchingDays,
        itemTradingDay,
      });
    });
    return { items, totalItemCount: allItems.length };
  }

  private async getSessionLogMatchingDays(
    selectedSessionLogTags: string[]
  ): Promise<ReadonlySet<string> | null> {
    if (selectedSessionLogTags.length === 0) return null;

    const selectedTagIds = new Set(selectedSessionLogTags);
    const matchingDays = new Set<string>();
    const drcService = await this.plugin.serviceManager.getDRCService();
    for (const [dayId, tagIds] of drcService.getSessionLogTagIdsByDay()) {
      for (const tagId of tagIds) {
        if (selectedTagIds.has(tagId)) {
          matchingDays.add(dayId);
          break;
        }
      }
    }
    return matchingDays;
  }

  async getAllGalleryItems(): Promise<ImageGalleryItem[]> {
    return this.getAllItems();
  }

  async getAvailableFilterOptions(): Promise<AvailableImageFilterOptions> {
    const items = await this.getAllItems();
    const tags = new Set<string>();

    for (const item of items) {
      item.tags.forEach((tag) => tags.add(tag));
    }

    const toOptions = (values: Iterable<string>) =>
      Array.from(values)
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({ value, label: value }));

    return {
      tags: toOptions(tags),
    };
  }

  async updateImageAnnotation(
    sourcePath: string,
    imagePath: string,
    annotation: ImageGalleryAnnotation,
    sourceType?: ImageGallerySourceType
  ): Promise<void> {
    if (sourceType === 'folder') {
      const publishFolderAnnotationChanged = () => {
        this.invalidate();
        eventBus.publish('image-gallery:changed');
      };
      await this.annotations.runOwnedWrite(async () => {
        await this.annotations.update(
          imagePath,
          annotation,
          publishFolderAnnotationChanged
        );
        publishFolderAnnotationChanged();
      });
      return;
    }
    const file = this.plugin.app.vault.getAbstractFileByPath(sourcePath);
    if (!(file instanceof TFile)) {
      throw new Error(`Source note not found: ${sourcePath}`);
    }

    const normalizedImagePath = normalizeImagePath(imagePath);
    const persistedAnnotation = normalizeAnnotationForPersistence(annotation);
    const resolvedMediaFile = resolveVaultMediaFile(
      this.plugin.app,
      imagePath,
      sourcePath
    );
    const hasCentralEntry =
      !!resolvedMediaFile &&
      this.annotations.hasEntryFor(resolvedMediaFile.path, false);
    let resolvedSourceType: ImageGallerySourceType = 'trade';
    let tradeType: 'regular' | 'missed' | 'backtest' = 'regular';

    await this.plugin.app.fileManager.processFrontMatter(
      file,
      (frontmatter) => {
        const record = isRecord(frontmatter) ? frontmatter : {};
        const noteType = getString(record.type);
        if (isReviewNoteType(noteType)) {
          resolvedSourceType = REVIEW_TYPE_TO_SOURCE[noteType];
        } else if (noteType === 'backtest-trade') {
          tradeType = 'backtest';
        } else if (
          noteType === 'missed-trade' ||
          record.isMissedTrade === true
        ) {
          tradeType = 'missed';
        }

        const currentAnnotations = isRecord(record.imageAnnotations)
          ? { ...record.imageAnnotations }
          : {};

        if (isEmptyPersistedAnnotation(persistedAnnotation)) {
          if (hasCentralEntry) {
            currentAnnotations[normalizedImagePath] = {};
          } else {
            delete currentAnnotations[normalizedImagePath];
          }
        } else {
          currentAnnotations[normalizedImagePath] = persistedAnnotation;
        }

        if (Object.keys(currentAnnotations).length > 0) {
          record.imageAnnotations = currentAnnotations;
        } else {
          delete record.imageAnnotations;
        }
      }
    );

    const publishNoteAnnotationChanged = () => {
      this.invalidate();
      if (resolvedSourceType === 'trade') {
        publishTradeAnnotationChanged(sourcePath, tradeType);
        return;
      }
      eventBus.publish('review:changed', {
        action: 'updated',
        type: SOURCE_TO_REVIEW_TYPE[resolvedSourceType] ?? 'drc',
        filePath: sourcePath,
      });
    };
    await refreshMetadataWithRecovery(
      this.plugin.app,
      file,
      publishNoteAnnotationChanged
    );
    publishNoteAnnotationChanged();
  }

  private async getAllItems(): Promise<ImageGalleryItem[]> {
    if (this.cachedItems) return this.cachedItems;
    if (this.pendingLoad) return this.pendingLoad;

    const persistedLoadGeneration = this.loadGeneration;
    const persistedItems = await this.loadPersistedIndex();
    if (persistedItems) {
      if (this.loadGeneration !== persistedLoadGeneration) {
        return this.getAllItems();
      }

      this.cachedItems = persistedItems;
      return persistedItems;
    }

    const loadGeneration = this.loadGeneration;
    const loadStartedAt = Date.now();
    const reviewFiles = this.getGalleryMetadataFiles();
    const metadataFiles = this.getMetadataReadinessFiles(reviewFiles);
    const loadPromise = this.waitForMetadataReady(metadataFiles)
      .then((metadataComplete) =>
        Promise.all([
          this.getTradeItems(),
          this.getReviewItems(reviewFiles),
        ]).then(([tradeItems, reviewItems]) => {
          const noteItems = [...tradeItems, ...reviewItems];
          const resolvedNoteMediaPaths =
            this.getResolvedNoteMediaPaths(noteItems);
          const resolvedNoteMediaPathSet = new Set(
            resolvedNoteMediaPaths.values()
          );
          const centralAnnotations = this.annotations.getAnnotationMap();
          const mergedNoteItems = noteItems.map((item) => {
            if (
              item.hasOwnAnnotation ||
              item.tags.length > 0 ||
              item.notes?.trim()
            ) {
              return item;
            }
            const resolvedPath = resolvedNoteMediaPaths.get(item);
            if (!resolvedPath) return item;
            const annotation = getAnnotation(centralAnnotations, resolvedPath);
            if (annotation.tags.length === 0 && !annotation.notes?.trim()) {
              return item;
            }
            return {
              ...item,
              tags: annotation.tags,
              notes: annotation.notes,
            };
          });
          const folderItems = this.folderSource
            .getItems()
            .filter((item) => !resolvedNoteMediaPathSet.has(item.imagePath));
          return {
            items: [...mergedNoteItems, ...folderItems],
            metadataComplete,
          };
        })
      )
      .then(({ items, metadataComplete }) => {
        if (
          this.loadGeneration !== loadGeneration ||
          this.pendingLoad !== loadPromise
        ) {
          return items;
        }

        this.pendingLoad = null;
        if (metadataComplete) {
          this.cachedItems = items;
          void this.savePersistedIndex(items, loadGeneration, loadStartedAt);
        }
        return items;
      })
      .catch((error: unknown) => {
        if (this.pendingLoad === loadPromise) {
          this.pendingLoad = null;
        }
        throw error;
      });

    this.pendingLoad = loadPromise;
    return this.pendingLoad;
  }

  private getIndexPath(): string {
    return getImageGalleryIndexPath(this.plugin.app);
  }

  private getSettingsFingerprint(
    configuredRoots: readonly string[] = this.folderSource.getConfiguredRoots()
  ): string {
    return JSON.stringify({
      trade: {
        breakEvenThresholdMode: String(
          this.plugin.settings.trade?.breakEvenThresholdMode ?? ''
        ),
        breakEvenRangeMin: String(
          this.plugin.settings.trade?.breakEvenRangeMin ?? ''
        ),
        breakEvenRangeMax: String(
          this.plugin.settings.trade?.breakEvenRangeMax ?? ''
        ),
        breakEvenThresholdPercent: String(
          this.plugin.settings.trade?.breakEvenThresholdPercent ?? ''
        ),
        defaultRiskAmount: String(
          this.plugin.settings.trade?.defaultRiskAmount ?? ''
        ),
        includeCopyAccountsInAllAccountsAnalytics: String(
          this.plugin.settings.trade
            ?.includeCopyAccountsInAllAccountsAnalytics ?? ''
        ),
      },
      accountMetadata: JSON.stringify(
        this.plugin.settings.account?.accountMetadata ?? {}
      ),
      copyTradeAdjustments: JSON.stringify(
        this.plugin.settings.copyTradeAdjustments ?? {}
      ),
      instrumentCommissionRules: JSON.stringify(
        (
          this.plugin.optionsService?.getAllOptions?.()[
            OptionType.INSTRUMENT
          ] ?? []
        ).map((instrument) => ({
          name: instrument.name,
          assetType: instrument.assetType,
          commissionRules: instrument.commissionRules ?? [],
        }))
      ),
      customFields: JSON.stringify(
        (this.plugin.customFieldsService?.getFields() ?? []).map((field) => ({
          id: field.id,
          fieldKey: field.fieldKey,
          type: field.type,
          tradeLog: field.tradeLog,
        }))
      ),
      general: {
        currency: this.plugin.settings.general?.currency,
        journalFolderPath: this.plugin.settings.general?.journalFolderPath,
      },
      galleryFolders: configuredRoots,
    });
  }

  private async loadPersistedIndex(): Promise<ImageGalleryItem[] | null> {
    if (this.persistedIndexInvalidated) {
      return null;
    }

    try {
      const indexPath = this.getIndexPath();
      if (!(await this.plugin.app.vault.adapter.exists(indexPath))) return null;

      const index = normalizePersistedImageGalleryIndex(
        JSON.parse(await this.plugin.app.vault.adapter.read(indexPath))
      );
      if (!index) return null;
      const configuredRoots = this.folderSource.getConfiguredRoots();
      if (
        index.settingsFingerprint !==
        this.getSettingsFingerprint(configuredRoots)
      ) {
        return null;
      }
      const currentAnnotationSignature = this.annotations.getNoteSignature();
      if (
        index.annotationNoteSignature.exists !==
          currentAnnotationSignature.exists ||
        index.annotationNoteSignature.mtime !==
          currentAnnotationSignature.mtime ||
        index.annotationNoteSignature.size !== currentAnnotationSignature.size
      ) {
        return null;
      }
      if (Date.now() - index.timestamp > IMAGE_GALLERY_INDEX_TTL_MS) {
        return null;
      }
      if (
        this.hasGallerySourceModifiedSince(index.timestamp, configuredRoots)
      ) {
        return null;
      }
      if (!this.arePersistedItemsResolvable(index.items, configuredRoots)) {
        return null;
      }

      return index.items;
    } catch (error) {
      if (isMissingFileError(error)) return null;
      console.warn(
        '[ImageGalleryService] Failed to load persisted index:',
        error
      );
      return null;
    }
  }

  private hasGallerySourceModifiedSince(
    timestamp: number,
    configuredRoots: readonly string[]
  ): boolean {
    if (
      this.getGalleryMetadataFiles().some((file) => file.stat.mtime > timestamp)
    ) {
      return true;
    }
    if (configuredRoots.length === 0) return false;
    const matchesConfiguredPath =
      this.folderSource.createPathMatcher(configuredRoots);
    return this.plugin.app.vault
      .getFiles()
      .some(
        (file) =>
          matchesConfiguredPath(file.path) && file.stat.mtime > timestamp
      );
  }

  private arePersistedItemsResolvable(
    items: ImageGalleryItem[],
    configuredRoots: readonly string[]
  ): boolean {
    const persistedFolderPaths = new Set<string>();
    for (const item of items) {
      if (item.sourceType === 'folder') {
        persistedFolderPaths.add(item.imagePath);
      }
    }
    if (configuredRoots.length === 0 && persistedFolderPaths.size > 0) {
      return false;
    }
    const currentFolderPaths =
      configuredRoots.length === 0
        ? new Set<string>()
        : this.folderSource.getCurrentMediaPaths(configuredRoots);
    if (!currentFolderPaths) return false;
    const resolvedNoteMediaPaths = this.getResolvedNoteMediaPaths(items);
    for (const resolvedPath of resolvedNoteMediaPaths.values()) {
      currentFolderPaths.delete(resolvedPath);
    }
    if (currentFolderPaths.size !== persistedFolderPaths.size) return false;
    for (const currentPath of currentFolderPaths) {
      if (!persistedFolderPaths.has(currentPath)) return false;
    }
    const matchesConfiguredPath =
      this.folderSource.createPathMatcher(configuredRoots);

    return items.every((item) => {
      const sourceFile = this.plugin.app.vault.getAbstractFileByPath(
        item.sourcePath
      );
      if (item.sourceType === 'folder') {
        return (
          sourceFile instanceof TFile &&
          item.sourcePath === item.imagePath &&
          item.mediaMtime === sourceFile.stat.mtime &&
          matchesConfiguredPath(sourceFile.path) &&
          getMediaKind(this.plugin.app, sourceFile.path) !== 'unknown'
        );
      }
      return (
        sourceFile instanceof TFile &&
        this.isResolvableMediaPath(item.imagePath, item.sourcePath)
      );
    });
  }

  private getResolvedNoteMediaPaths(
    items: readonly ImageGalleryItem[]
  ): Map<ImageGalleryItem, string> {
    const paths = new Map<ImageGalleryItem, string>();
    for (const item of items) {
      if (item.sourceType === 'folder') continue;
      const file = resolveVaultMediaFile(
        this.plugin.app,
        item.imagePath,
        item.sourcePath
      );
      if (file) paths.set(item, file.path);
    }
    return paths;
  }

  private async savePersistedIndex(
    items: ImageGalleryItem[],
    loadGeneration: number,
    timestamp: number
  ): Promise<void> {
    try {
      if (this.loadGeneration !== loadGeneration) {
        return;
      }

      await this.plugin.app.vault.adapter.mkdir(
        getJournalitCachePath(this.plugin.app)
      );
      if (this.loadGeneration !== loadGeneration) {
        return;
      }

      const index: PersistedImageGalleryIndex = {
        version: IMAGE_GALLERY_INDEX_VERSION,
        timestamp,
        settingsFingerprint: this.getSettingsFingerprint(),
        annotationNoteSignature: this.annotations.getNoteSignature(),
        items,
      };
      await this.plugin.app.vault.adapter.write(
        this.getIndexPath(),
        JSON.stringify(index)
      );
      if (this.loadGeneration !== loadGeneration) {
        return;
      }

      this.persistedIndexInvalidated = false;
    } catch (error) {
      console.warn(
        '[ImageGalleryService] Failed to save persisted index:',
        error
      );
    }
  }

  private async clearPersistedIndex(): Promise<void> {
    await clearPersistedImageGalleryIndex(this.plugin.app);
  }

  private getSourceCustomFields(trade: TradeRecord): Record<string, string[]> {
    const fields = (this.plugin.customFieldsService?.getFields() || []).filter(
      isDiscreteCustomFieldFilterable
    );
    return Object.fromEntries(
      fields.flatMap((field) => {
        const rawValue = getCustomFieldRawValue(trade, field);
        const values =
          field.type === CustomFieldType.MULTISELECT && Array.isArray(rawValue)
            ? rawValue.flatMap((value) => {
                const normalized = normalizeCustomFieldFilterValue(value);
                return normalized === null ? [] : [normalized];
              })
            : rawValue !== undefined
              ? [normalizeCustomFieldFilterValue(rawValue)].filter(
                  (value): value is string => value !== null
                )
              : [];
        return values.length > 0 ? [[field.id, values]] : [];
      })
    );
  }

  private async getMissedTradeRecords(): Promise<TradeRecord[]> {
    if (!this.plugin.serviceManager) {
      return [];
    }

    const missedTradeService =
      await this.plugin.serviceManager.getMissedTradeService();
    const files = await missedTradeService.getMissedTrades(
      new Date(0),
      new Date('2099-12-31T23:59:59.999Z')
    );

    return files.flatMap((file) => {
      const frontmatter =
        this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!isRecord(frontmatter)) return [];

      return [
        {
          ...frontmatter,
          path: file.path,
          filePath: file.path,
          tradeType: 'missed',
          type: 'missed-trade',
          isMissedTrade: true,
        },
      ];
    });
  }

  private async getTradeItems(): Promise<ImageGalleryItem[]> {
    const trades = [
      ...(await this.plugin.tradeService.getTradeData()),
      ...(await this.getMissedTradeRecords()),
    ];
    const accountBalanceLookup =
      this.plugin.settings.trade.breakEvenThresholdMode ===
      'percentage_current_balance'
        ? await fetchBreakEvenAccountBalanceLookup(this.plugin)
        : null;

    return trades.flatMap((trade: TradeRecord) => {
      const sourcePath =
        getString(trade.path) || getString(trade.filePath) || '';
      const media = this.getResolvableMediaPaths(trade.images, sourcePath);
      if (media.length === 0) return [];
      const sourceFile =
        this.plugin.app.vault.getAbstractFileByPath(sourcePath);
      const sourceFrontmatter =
        sourceFile instanceof TFile
          ? this.plugin.app.metadataCache.getFileCache(sourceFile)?.frontmatter
          : undefined;
      const date = getTradeDateValue(trade);
      const pnl = toTradePnl(trade);
      const annotationSource = isRecord(sourceFrontmatter)
        ? sourceFrontmatter.imageAnnotations
        : trade.imageAnnotations;
      const setupIds = getStringArray(trade.setup);
      const sourceTags = getStringArray(trade.tags);
      const mistakes = [
        ...getStringArray(trade.mistake),
        ...getStringArray(trade.mistakes),
      ];
      const symbol = getString(trade.instrument);
      const direction = getTradeDirectionDisplayKind({
        direction: trade.direction,
        assetType: trade.assetType,
        optionType: trade.optionType,
      });
      const sourceCustomFields = this.getSourceCustomFields(trade);
      const tradeType = getTradeRecordType(trade);
      const variants = getTradeAccountVariants(
        trade,
        this.plugin,
        pnl,
        tradeType !== 'missed'
      );

      return variants.flatMap((variant) =>
        media.map((imagePath, imageIndex): ImageGalleryItem => {
          const annotation = getAnnotation(annotationSource, imagePath);
          const hasTradePnlStatus = tradeType !== 'missed';
          const breakEvenBalance = getBreakEvenBalance(
            trade,
            accountBalanceLookup,
            variant.accounts
          );
          const tradeStatus = hasTradePnlStatus
            ? getTradeStatus(trade, variant.pnl, this.plugin, breakEvenBalance)
            : undefined;
          const showTradePnl = shouldShowTradePnl(trade, tradeStatus);
          return {
            id: `${sourcePath}:${variant.idSuffix}:${imageIndex}:${imagePath}`,
            imagePath,
            sourcePath,
            sourceType: 'trade',
            sourceLabel: symbol || reviewSourceLabel('trade'),
            date,
            symbol,
            account: variant.account,
            accounts: variant.accounts,
            direction,
            tradeType,
            isCopiedTrade: variant.isCopiedTrade,
            includeInAllAccounts: variant.includeInAllAccounts,
            setupIds,
            sourceTags,
            mistakes,
            tags: annotation.tags,
            notes: annotation.notes,
            hasOwnAnnotation: hasAnnotationEntry(annotationSource, imagePath),
            sourceCustomFields,
            outcome: showTradePnl
              ? classifyOutcome(variant.pnl, this.plugin, breakEvenBalance)
              : 'unknown',
            tradeStatus,
            pnl: showTradePnl ? variant.pnl : undefined,
            rMultiple: showTradePnl ? variant.rMultiple : undefined,
            reviewed: trade.reviewed === true,
          };
        })
      );
    });
  }

  private async waitForMetadataReady(files: TFile[]): Promise<boolean> {
    const hasMissingMetadata = () =>
      files.some((file) => !this.plugin.app.metadataCache.getFileCache(file));

    if (!hasMissingMetadata()) {
      return true;
    }

    await new Promise<void>((resolve) => {
      let settled = false;
      let timeoutId: number | undefined;
      let eventRef: EventRef | null = null;

      const finish = () => {
        if (settled) return;
        settled = true;
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
        if (eventRef) {
          this.plugin.app.metadataCache.offref(eventRef);
        }
        resolve();
      };

      eventRef = this.plugin.app.metadataCache.on('resolved', finish);
      timeoutId = window.setTimeout(finish, REVIEW_METADATA_READY_TIMEOUT_MS);
    });

    return !hasMissingMetadata();
  }

  private getGalleryMetadataFiles(): TFile[] {
    const files = this.plugin.app.vault.getMarkdownFiles();
    const folderPathService =
      this.plugin.serviceManager?.getFolderPathService();
    return folderPathService
      ? files.filter((file) => folderPathService.isJournalPath(file.path))
      : files;
  }

  private getMetadataReadinessFiles(reviewFiles: TFile[]): TFile[] {
    const result: TFile[] = [];
    const seen = new Set<string>();
    for (const file of reviewFiles) {
      seen.add(file.path);
      result.push(file);
    }
    const configuredRoots = this.folderSource.getConfiguredRoots();
    if (configuredRoots.length === 0) return result;
    const matchesConfiguredPath =
      this.folderSource.createPathMatcher(configuredRoots);
    for (const file of this.plugin.app.vault.getMarkdownFiles()) {
      if (!matchesConfiguredPath(file.path)) continue;
      if (seen.has(file.path)) continue;
      seen.add(file.path);
      result.push(file);
    }
    return result;
  }

  private async getReviewItems(files: TFile[]): Promise<ImageGalleryItem[]> {
    const items: ImageGalleryItem[] = [];

    for (const file of files) {
      const cache = this.plugin.app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter;
      if (!isRecord(frontmatter)) continue;

      const noteType = getString(frontmatter.type);
      if (!isReviewNoteType(noteType)) continue;

      items.push(...this.getReviewItemsFromFile(file, frontmatter, noteType));
    }

    return items;
  }

  private getReviewItemsFromFile(
    file: TFile,
    frontmatter: Record<string, unknown>,
    noteType: ReviewNoteType
  ): ImageGalleryItem[] {
    const sourceType = REVIEW_TYPE_TO_SOURCE[noteType];
    const date = getDateValue(frontmatter);
    const annotations = frontmatter.imageAnnotations;
    const reviewed =
      noteType === 'drc'
        ? isRecord(frontmatter.endOfDayReview) &&
          frontmatter.endOfDayReview.reviewed === true
        : frontmatter.reviewed === true;
    const result: ImageGalleryItem[] = [];
    const seen = new Set<string>();

    const pushImage = (
      imagePath: string,
      sourceLabel: string,
      imageIndex: number
    ) => {
      const normalizedImagePath = normalizeImagePath(imagePath);
      if (
        !normalizedImagePath ||
        seen.has(normalizedImagePath) ||
        !this.isResolvableMediaPath(normalizedImagePath, file.path)
      ) {
        return;
      }
      seen.add(normalizedImagePath);
      const annotation = getAnnotation(annotations, normalizedImagePath);
      result.push({
        id: `${file.path}:${sourceLabel}:${imageIndex}:${normalizedImagePath}`,
        imagePath: normalizedImagePath,
        sourcePath: file.path,
        sourceType,
        sourceLabel,
        date,
        setupIds: [],
        sourceTags: getStringArray(frontmatter.tags),
        mistakes: [],
        tags: annotation.tags,
        notes: annotation.notes,
        hasOwnAnnotation: hasAnnotationEntry(annotations, normalizedImagePath),
        sourceCustomFields: {},
        outcome: 'unknown',
        reviewed,
      });
    };

    const imagesByWidget = frontmatter.imagesByWidget;
    if (isRecord(imagesByWidget)) {
      for (const [widgetId, widgetImages] of Object.entries(imagesByWidget)) {
        getStringArray(widgetImages).forEach((imagePath, imageIndex) =>
          pushImage(imagePath, widgetId, imageIndex)
        );
      }
    }

    getStringArray(frontmatter.images).forEach((imagePath, imageIndex) =>
      pushImage(imagePath, reviewSourceLabel(sourceType), imageIndex)
    );

    const pushSectionImages = (section: unknown, sourceLabel: string) => {
      const sectionRecord = isRecord(section) ? section : null;
      if (!sectionRecord) return;

      getStringArray(sectionRecord.images).forEach((imagePath, imageIndex) =>
        pushImage(imagePath, sourceLabel, imageIndex)
      );
    };

    const forecast = isRecord(frontmatter.forecast)
      ? frontmatter.forecast
      : null;
    if (forecast) {
      for (const [key, section] of Object.entries(forecast)) {
        if (key === 'bias' || key === 'levels' || key === 'keyLevels') {
          continue;
        }

        const sectionRecord = isRecord(section) ? section : null;
        if (key === 'customTimeframes' && sectionRecord) {
          for (const [customKey, customSection] of Object.entries(
            sectionRecord
          )) {
            pushSectionImages(customSection, customKey);
          }
        } else {
          pushSectionImages(section, key);
        }
      }
    }

    if (noteType === 'drc') {
      pushSectionImages(frontmatter.endOfDayReview, 'endOfDayReview');

      asRecordArray(frontmatter.missedTrades).forEach((trade, index) => {
        pushSectionImages(trade, `missedTrades.${index + 1}`);
      });
    }

    return result;
  }

  private isResolvableMediaPath(
    mediaPath: string,
    sourcePath: string
  ): boolean {
    const mediaKind = getMediaKind(this.plugin.app, mediaPath, sourcePath);
    if (mediaKind === 'unknown') return false;
    if (/^(?:https?:|data:)/i.test(mediaPath)) return true;

    return (
      resolveVaultMediaFile(this.plugin.app, mediaPath, sourcePath) instanceof
      TFile
    );
  }

  private getResolvableMediaPaths(
    media: unknown,
    sourcePath: string
  ): string[] {
    const result: string[] = [];
    const seen = new Set<string>();
    for (const mediaPath of getStringArray(media)) {
      const normalizedImagePath = normalizeImagePath(mediaPath);
      if (
        !seen.has(normalizedImagePath) &&
        this.isResolvableMediaPath(normalizedImagePath, sourcePath)
      ) {
        seen.add(normalizedImagePath);
        result.push(normalizedImagePath);
      }
    }
    return result;
  }
}
