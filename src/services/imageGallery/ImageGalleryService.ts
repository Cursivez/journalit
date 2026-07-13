import { TFile, type EventRef } from 'obsidian';
import type JournalitPlugin from '../../main';
import { getJournalitCachePath } from '../base/pluginStoragePaths';
import { eventBus } from '../events';
import {
  getMediaKind,
  resolveVaultMediaFile,
} from '../../utils/imageMediaUtils';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
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

export class ImageGalleryService {
  private cachedItems: ImageGalleryItem[] | null = null;
  private pendingLoad: Promise<ImageGalleryItem[]> | null = null;
  private persistedIndexInvalidated = false;
  private loadGeneration = 0;

  constructor(private plugin: JournalitPlugin) {}

  invalidate(): void {
    this.cachedItems = null;
    this.pendingLoad = null;
    this.persistedIndexInvalidated = true;
    this.loadGeneration += 1;
    void this.clearPersistedIndex();
  }

  async getItems(filters: TradeLogFilters): Promise<ImageGalleryItem[]> {
    const allItems = await this.getAllItems();

    return allItems.filter((item) =>
      matchesImageGalleryTradeLogFilters(item, filters)
    );
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
    annotation: ImageGalleryAnnotation
  ): Promise<void> {
    const file = this.plugin.app.vault.getAbstractFileByPath(sourcePath);
    if (!(file instanceof TFile)) {
      throw new Error(`Source note not found: ${sourcePath}`);
    }

    const normalizedImagePath = normalizeImagePath(imagePath);
    const persistedAnnotation = normalizeAnnotationForPersistence(annotation);
    let sourceType: ImageGallerySourceType = 'trade';
    let tradeType: 'regular' | 'missed' | 'backtest' = 'regular';

    await this.plugin.app.fileManager.processFrontMatter(
      file,
      (frontmatter) => {
        const record = isRecord(frontmatter) ? frontmatter : {};
        const noteType = getString(record.type);
        if (isReviewNoteType(noteType)) {
          sourceType = REVIEW_TYPE_TO_SOURCE[noteType];
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
          delete currentAnnotations[normalizedImagePath];
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

    await forceMetadataCacheRefresh(this.plugin.app, file);
    this.invalidate();

    if (sourceType === 'trade') {
      publishTradeAnnotationChanged(sourcePath, tradeType);
      return;
    }

    eventBus.publish('review:changed', {
      action: 'updated',
      type: SOURCE_TO_REVIEW_TYPE[sourceType] ?? 'drc',
      filePath: sourcePath,
    });
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
    const metadataFiles = this.getGalleryMetadataFiles();
    const loadPromise = this.waitForMetadataReady(metadataFiles)
      .then((metadataComplete) =>
        Promise.all([
          this.getTradeItems(),
          this.getReviewItems(metadataFiles),
        ]).then(([tradeItems, reviewItems]) => ({
          items: [...tradeItems, ...reviewItems],
          metadataComplete,
        }))
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
    return `${getJournalitCachePath(this.plugin.app)}/image-gallery-index.json`;
  }

  private getSettingsFingerprint(): string {
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
      if (index.settingsFingerprint !== this.getSettingsFingerprint()) {
        return null;
      }
      if (Date.now() - index.timestamp > IMAGE_GALLERY_INDEX_TTL_MS) {
        return null;
      }
      if (this.hasGallerySourceModifiedSince(index.timestamp)) {
        return null;
      }
      if (!this.arePersistedItemsResolvable(index.items)) {
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

  private hasGallerySourceModifiedSince(timestamp: number): boolean {
    return this.getGalleryMetadataFiles().some(
      (file) => file.stat.mtime > timestamp
    );
  }

  private arePersistedItemsResolvable(items: ImageGalleryItem[]): boolean {
    return items.every((item) => {
      const sourceFile = this.plugin.app.vault.getAbstractFileByPath(
        item.sourcePath
      );
      return (
        sourceFile instanceof TFile &&
        this.isResolvableMediaPath(item.imagePath, item.sourcePath)
      );
    });
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
    try {
      const indexPath = this.getIndexPath();
      if (await this.plugin.app.vault.adapter.exists(indexPath)) {
        await this.plugin.app.vault.adapter.remove(indexPath);
      }
    } catch (error) {
      if (isMissingFileError(error)) return;
      console.warn(
        '[ImageGalleryService] Failed to clear persisted index:',
        error
      );
    }
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
