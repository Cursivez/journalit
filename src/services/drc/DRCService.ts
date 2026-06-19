

import { App, TFile, normalizePath, FileView, WorkspaceLeaf } from 'obsidian';
import { DRCData } from './types';
import { NewsEvent } from '../weekly/types';

import JournalitPlugin from '../../main';
import type { NavigationSource } from '../../navigation/types';
import {
  getNextBusinessDay,
  getPreviousBusinessDay,
  isWeekendSkippingEnabled,
  getISOWeekThursday,
  getWeekAnchorDate,
  getWeekFolderName,
  getWeekStartDate,
  getWeekStartDaySetting,
  getWeekStringForDate,
  parseLocalDateSafe,
  getQuarterForMonth,
} from '../../utils/dateUtils';
import { getTradingDay } from '../../utils/tradingDayUtils';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';

import { FolderPathService } from '../core/FolderPathService';
import { ReviewTemplateService } from '../templates/ReviewTemplateService';
import { TemplateTransformationService } from '../templates/TemplateTransformationService';
import { eventBus } from '../events';
import type { Unsubscribe } from '../events/types';
import { normalizeTradeExecutionForPeriodAnalytics } from '../trade/core/TradeExecutionAnalytics';
import { safeString } from '../../utils/safeString';
import {
  extractJournalitImageWidgetIds,
  extractMarkdownSectionsByHeading,
  stripPreviousTradingDayContextWidgetBlocks,
} from '../../utils/markdownSectionExtractor';

export interface PreviousTradingDayContextSection {
  heading: string;
  level: number;
  markdown: string;
  imageWidgets: Array<{ id: string; images: string[] }>;
  imageWidgetImages: string[];
}

export interface PreviousTradingDayContextResult {
  sourcePath: string;
  sourceDate: string;
  sections: PreviousTradingDayContextSection[];
}

interface ExtractedDRCData extends Partial<DRCData> {
  type: 'drc';
  date: string;
  [key: string]: unknown;
}



function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function getStringValue(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

function getStringArray(
  record: Record<string, unknown>,
  key: string
): string[] {
  const value = record[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function getBooleanRecord(
  record: Record<string, unknown>,
  key: string
): Record<string, boolean> {
  const value = record[key];
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, boolean] => typeof entry[1] === 'boolean'
    )
  );
}

function getGradeValue(value: unknown): 'A' | 'B' | 'C' {
  return value === 'A' || value === 'B' || value === 'C' ? value : 'C';
}

function isNewsEvent(value: unknown): value is NewsEvent {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export class DRCService {
  
  private readonly DRC_PREFIX = 'DRC';

  
  private app: App;

  
  private plugin: JournalitPlugin;

  
  private folderPathService: FolderPathService;

  
  private templateService: ReviewTemplateService | null = null;

  
  private transformService: TemplateTransformationService | null = null;

  
  private unsubscribeFns: Unsubscribe[] = [];

  
  constructor(
    app: App,
    plugin: JournalitPlugin,
    folderPathService: FolderPathService,
    config: { namespace?: string } = {}
  ) {
    this.app = app;
    this.plugin = plugin;
    this.folderPathService = folderPathService;

    
    this.namespace = config.namespace || 'drc';

    
    this.unsubscribeFns.push(
      
      eventBus.subscribe('settings:changed', (payload) => {
        if (payload?.source !== 'user-input') {
          void this.onSettingsUpdated();
        }
      }),
      
      eventBus.subscribe('trade:changed', () => {
        void this.onTradeDataChanged();
      })
    );
  }

  
  private getTemplateServices(): {
    templateService: ReviewTemplateService;
    transformService: TemplateTransformationService;
  } {
    if (!this.templateService) {
      this.templateService = new ReviewTemplateService(this.plugin);
    }
    if (!this.transformService) {
      this.transformService = new TemplateTransformationService(this.plugin);
    }
    return {
      templateService: this.templateService,
      transformService: this.transformService,
    };
  }

  
  private namespace: string;

  
  private async onSettingsUpdated(): Promise<void> {
    try {
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile) return;

      const metadata = this.app.metadataCache.getFileCache(activeFile);
      if (!metadata?.frontmatter || metadata.frontmatter.type !== 'drc') return;

      
      eventBus.publish('review:changed', {
        type: 'drc',
        action: 'updated',
        filePath: activeFile.path,
        source: 'settings-update',
      });
    } catch (error) {
      console.error('Error updating DRC after settings change:', error);
    }
  }

  
  private async onTradeDataChanged(): Promise<void> {
    try {
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile) return;

      const metadata = this.app.metadataCache.getFileCache(activeFile);
      if (!metadata?.frontmatter || metadata.frontmatter.type !== 'drc') return;

      
      eventBus.publish('review:changed', {
        type: 'drc',
        action: 'updated',
        filePath: activeFile.path,
        source: 'trade-data-change',
      });
    } catch (error) {
      console.error('Error updating DRC after trade data change:', error);
    }
  }

  
  private getWeekOfMonth(date: Date): string {
    const weekStartDay = getWeekStartDaySetting(this.plugin);
    const weekAnchor = getWeekAnchorDate(date, weekStartDay);
    return getWeekStringForDate(weekAnchor);
  }

  
  private formatDateForFilename(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); 

    
    const dateFormat = this.plugin?.settings?.trade?.dateFormat || 'DDMMYY';

    switch (dateFormat) {
      case 'MMDDYY':
        return `${month}${day}${year}`;
      case 'YYMMDD':
        return `${year}${month}${day}`;
      case 'DDMMYY':
      default:
        return `${day}${month}${year}`;
    }
  }

  
  private formatDateForDisplay(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  
  private formatDateTimeForDisplay(date: Date): string {
    const datePart = this.formatDateForDisplay(date);
    const timePart = date.toTimeString().split(' ')[0];
    return `${datePart}T${timePart}`;
  }

  
  private async ensureDirectoryExists(filePath: string): Promise<void> {
    
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));

    
    if (!(await this.app.vault.adapter.exists(dirPath))) {
      
      await this.app.vault.adapter.mkdir(dirPath);
    }
  }

  
  private async findDRCByFrontmatterDate(date: Date): Promise<TFile | null> {
    const targetDateString = this.formatDateForDisplay(date);
    const journalFolder = this.folderPathService.journalFolderPath;

    
    const allFiles = this.app.vault.getMarkdownFiles();

    
    for (const file of allFiles) {
      
      if (!file.path.startsWith(journalFolder)) {
        continue;
      }

      
      if (!file.basename.startsWith(this.DRC_PREFIX)) {
        continue;
      }

      
      const cache = this.app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter;

      if (
        frontmatter?.type === 'drc' &&
        frontmatter?.date === targetDateString
      ) {
        return file;
      }
    }

    return null;
  }

  
  public async createDRC(date: Date): Promise<string> {
    try {
      const path = this.getDRCNotePath(date);

      
      const exists = await this.app.vault.adapter.exists(path);
      if (exists) {
        return path;
      }

      
      
      const existingDRC = await this.findDRCByFrontmatterDate(date);
      if (existingDRC) {
        return existingDRC.path;
      }

      
      await this.ensureDirectoryExists(path);

      
      const content = await this.generateInitialDRCContent(date);

      
      const newFile = await this.app.vault.create(path, content);

      
      await forceMetadataCacheRefresh(this.app, newFile);

      
      eventBus.publish('review:changed', {
        type: 'drc',
        action: 'created',
        filePath: path,
      });

      return path;
    } catch (error) {
      console.error('Error creating DRC:', error);
      throw error;
    }
  }

  
  public async getTodayDRC(): Promise<string> {
    const today = new Date();
    return this.createDRC(today);
  }

  
  public async getDRC(date: Date): Promise<string> {
    return this.createDRC(date);
  }

  
  public async getTradesForDate(date: Date): Promise<TFile[]> {
    try {
      
      const tradingDay = getTradingDay(date, this.plugin);

      
      const targetDate = this.formatDateForDisplay(tradingDay);

      
      const files = this.app.vault.getMarkdownFiles();

      
      const tradeFiles: TFile[] = [];

      for (const file of files) {
        const frontmatter =
          this.app.metadataCache.getFileCache(file)?.frontmatter;

        
        if (
          !frontmatter ||
          (frontmatter.type !== 'trade' &&
            frontmatter.type !== 'backtest-trade')
        ) {
          continue;
        }

        const normalizedTrade =
          normalizeTradeExecutionForPeriodAnalytics(frontmatter);

        
        if (normalizedTrade?.entryTime) {
          const entryDate = normalizedTrade.entryTime;

          
          const tradeTradingDay = getTradingDay(entryDate, this.plugin);
          const tradeDate = this.formatDateForDisplay(tradeTradingDay);

          if (tradeDate === targetDate) {
            tradeFiles.push(file);
          }
        } else if (typeof frontmatter.date === 'string') {
          
          const dateObj = parseLocalDateSafe(frontmatter.date);
          if (!dateObj) continue;
          const tradeDate = this.formatDateForDisplay(dateObj);

          
          if (tradeDate === targetDate) {
            tradeFiles.push(file);
          }
        }
      }

      return tradeFiles;
    } catch (error) {
      console.error(
        `Error getting trades for date ${date.toDateString()}:`,
        error
      );
      return [];
    }
  }

  
  public async updateDRCFrontmatter(
    filePath: string,
    updates: Partial<Record<string, unknown>>,
    source: string = 'unknown'
  ): Promise<void> {
    try {
      
      const file = this.app.vault.getAbstractFileByPath(filePath);

      if (!file || !(file instanceof TFile)) {
        throw new Error(`DRC file not found: ${filePath}`);
      }

      
      await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        const frontmatterRecord = asRecord(frontmatter) ?? {};
        const { imagesByWidget, ...rest } = updates;
        Object.assign(frontmatterRecord, rest);

        if (
          imagesByWidget &&
          typeof imagesByWidget === 'object' &&
          !Array.isArray(imagesByWidget)
        ) {
          const existingByWidget =
            frontmatterRecord.imagesByWidget &&
            typeof frontmatterRecord.imagesByWidget === 'object' &&
            !Array.isArray(frontmatterRecord.imagesByWidget)
              ? frontmatterRecord.imagesByWidget
              : {};
          frontmatterRecord.imagesByWidget = {
            ...existingByWidget,
            ...imagesByWidget,
          };
        } else if (imagesByWidget !== undefined) {
          frontmatterRecord.imagesByWidget = imagesByWidget;
        }
      });

      
      await forceMetadataCacheRefresh(this.app, file);

      
      
      if (source === 'user-input') {
        return;
      }

      
      eventBus.publish('review:changed', {
        type: 'drc',
        action: 'updated',
        filePath,
        source,
      });

      return;
    } catch (error) {
      console.error(`Error updating DRC frontmatter in ${filePath}:`, error);
      throw error;
    }
  }

  
  public getWeeklyReviewPath(date: Date): string {
    const weekStartDay = getWeekStartDaySetting(this.plugin);
    const weekAnchor = getWeekAnchorDate(date, weekStartDay);

    
    
    
    
    const thursday = getISOWeekThursday(weekAnchor);
    const year = thursday.getFullYear();
    const monthNum = thursday.getMonth() + 1;
    const month = String(monthNum).padStart(2, '0');

    
    const weekOfMonth = getWeekStringForDate(weekAnchor);

    
    const filename = `${weekOfMonth}-Review.md`;

    
    const quarter = getQuarterForMonth(monthNum);

    
    
    
    return normalizePath(
      this.folderPathService.getDatePathForQuarterSync(
        year.toString(),
        quarter,
        month,
        weekOfMonth,
        filename
      )
    );
  }

  
  public getMonthlyReviewPath(date: Date): string {
    const year = date.getFullYear();
    const monthNum = date.getMonth() + 1;

    
    
    
    return normalizePath(
      this.folderPathService.getMonthlyReviewPathForQuarterSync(year, monthNum)
    );
  }

  public getDRCNotePath(date: Date): string {
    
    
    
    const year = date.getFullYear();
    const monthNum = date.getMonth() + 1;
    const month = String(monthNum).padStart(2, '0');

    
    
    const weekFolderName = getWeekFolderName(date, year);

    
    const formattedDate = this.formatDateForFilename(date);

    
    const filename = `${this.DRC_PREFIX}-${formattedDate}.md`;

    
    const quarter = getQuarterForMonth(monthNum);

    
    
    
    return normalizePath(
      this.folderPathService.getDatePathForQuarterSync(
        year.toString(),
        quarter,
        month,
        weekFolderName,
        filename
      )
    );
  }

  
  public getNextDayDRCPath(currentDate: Date): string {
    
    const skipWeekends = isWeekendSkippingEnabled(this.plugin);
    const nextDay = skipWeekends
      ? getNextBusinessDay(currentDate)
      : new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

    return this.getDRCNotePath(nextDay);
  }

  
  public getPreviousDayDRCPath(currentDate: Date): string {
    
    const skipWeekends = isWeekendSkippingEnabled(this.plugin);
    const previousDay = skipWeekends
      ? getPreviousBusinessDay(currentDate)
      : new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    return this.getDRCNotePath(previousDay);
  }

  
  public async getAdjacentDRC(
    currentDate: Date,
    offset: number,
    autoCreate?: boolean
  ): Promise<string | null> {
    try {
      
      const path =
        offset < 0
          ? this.getPreviousDayDRCPath(currentDate)
          : this.getNextDayDRCPath(currentDate);

      
      const exists = await this.app.vault.adapter.exists(path);

      
      if (exists) {
        return path;
      }

      
      const shouldAutoCreate =
        autoCreate ??
        this.plugin.settings?.drc?.autoCreateDRCOnNavigation ??
        true;

      if (shouldAutoCreate) {
        
        const skipWeekends = isWeekendSkippingEnabled(this.plugin);
        let targetDate: Date;

        if (offset < 0) {
          
          targetDate = skipWeekends
            ? getPreviousBusinessDay(currentDate)
            : new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        } else {
          
          targetDate = skipWeekends
            ? getNextBusinessDay(currentDate)
            : new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        }

        
        await this.createDRC(targetDate);
        return path;
      }

      
      return null;
    } catch (error) {
      console.error('Error getting adjacent DRC:', error);
      return null;
    }
  }

  
  private getDRCFile(path: string): TFile | null {
    const file = this.app.vault.getAbstractFileByPath(path);

    if (!file || !(file instanceof TFile)) {
      return null;
    }

    return file;
  }

  
  public extractDRCData(file: TFile): ExtractedDRCData | null {
    try {
      
      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;

      
      if (!frontmatter || frontmatter.type !== 'drc') {
        return null;
      }

      const record = asRecord(frontmatter);
      if (!record) return null;

      const drcData: ExtractedDRCData = {
        ...record,
        type: 'drc',
        date: getStringValue(record, 'date'),
      };

      if (Array.isArray(record.dailyGoals)) {
        drcData.dailyGoals = getStringArray(record, 'dailyGoals');
      }
      if (Array.isArray(record.tags)) {
        drcData.tags = getStringArray(record, 'tags');
      }
      if (Array.isArray(record.previousDayGoals)) {
        drcData.previousDayGoals = getStringArray(record, 'previousDayGoals');
      }
      if (Array.isArray(record.sessionMistakes)) {
        drcData.sessionMistakes = getStringArray(record, 'sessionMistakes');
      }
      if (isRecord(record.dailyGoalStatus)) {
        drcData.dailyGoalStatus = getBooleanRecord(record, 'dailyGoalStatus');
      }
      if (isRecord(record.preTradeChecklist)) {
        drcData.preTradeChecklist = getBooleanRecord(
          record,
          'preTradeChecklist'
        );
      }
      if (record.mentalGrade !== undefined) {
        drcData.mentalGrade = getGradeValue(record.mentalGrade);
      }
      if (record.technicalGrade !== undefined) {
        drcData.technicalGrade = getGradeValue(record.technicalGrade);
      }

      return drcData;
    } catch (error) {
      console.error('Error extracting DRC data:', error);
      return null;
    }
  }

  
  public async getPreviousDayGoals(
    currentDate: Date
  ): Promise<string[] | null> {
    try {
      
      const previousDRCPath = this.getPreviousDayDRCPath(currentDate);

      
      const exists = await this.app.vault.adapter.exists(previousDRCPath);

      if (!exists) {
        return null;
      }

      
      const previousDRCFile =
        this.app.vault.getAbstractFileByPath(previousDRCPath);

      if (!previousDRCFile || !(previousDRCFile instanceof TFile)) {
        return null;
      }

      
      await forceMetadataCacheRefresh(this.app, previousDRCFile);

      
      const drcData = this.extractDRCData(previousDRCFile);

      return drcData?.dailyGoals || null;
    } catch (error) {
      console.error('Error getting previous day goals:', error);
      return null;
    }
  }

  public async getPreviousTradingDayContext(
    currentDate: Date,
    headings: string[],
    fallbackMode: 'expected-only' | 'nearest-earlier' = 'nearest-earlier'
  ): Promise<PreviousTradingDayContextResult | null> {
    try {
      const previousDRCFile = await this.resolvePreviousDRCFile(
        currentDate,
        fallbackMode
      );
      if (!previousDRCFile) return null;

      await forceMetadataCacheRefresh(this.app, previousDRCFile);
      const frontmatter =
        this.app.metadataCache.getFileCache(previousDRCFile)?.frontmatter;
      if (!frontmatter || frontmatter.type !== 'drc') return null;
      const frontmatterRecord = asRecord(frontmatter) ?? {};

      const content = await this.app.vault.read(previousDRCFile);
      const sections = extractMarkdownSectionsByHeading(content, headings).map(
        (section) => {
          const markdown = stripPreviousTradingDayContextWidgetBlocks(
            section.content
          );
          const imageWidgets = extractJournalitImageWidgetIds(markdown).map(
            (widgetId) => ({
              id: widgetId,
              images: this.getImagesForWidget(
                frontmatterRecord.imagesByWidget,
                widgetId
              ),
            })
          );
          const imageWidgetImages = imageWidgets.flatMap(
            (widget) => widget.images
          );

          return {
            heading: section.heading,
            level: section.level,
            markdown,
            imageWidgets,
            imageWidgetImages,
          };
        }
      );

      return {
        sourcePath: previousDRCFile.path,
        sourceDate:
          typeof frontmatter.date === 'string'
            ? frontmatter.date
            : previousDRCFile.basename,
        sections,
      };
    } catch (error) {
      console.error('Error getting previous trading day context:', error);
      return null;
    }
  }

  private async resolvePreviousDRCFile(
    currentDate: Date,
    fallbackMode: 'expected-only' | 'nearest-earlier'
  ): Promise<TFile | null> {
    const previousDRCPath = this.getPreviousDayDRCPath(currentDate);
    const expectedFile = this.app.vault.getAbstractFileByPath(previousDRCPath);
    if (expectedFile instanceof TFile) {
      await forceMetadataCacheRefresh(this.app, expectedFile);
      const expectedFrontmatter =
        this.app.metadataCache.getFileCache(expectedFile)?.frontmatter;
      if (expectedFrontmatter?.type === 'drc') return expectedFile;
    }

    if (fallbackMode === 'expected-only') return null;

    return this.findNearestEarlierDRC(currentDate);
  }

  private findNearestEarlierDRC(currentDate: Date): TFile | null {
    const journalFolder = normalizePath(
      this.folderPathService.journalFolderPath
    );
    const journalFolderPrefix = `${journalFolder}/`;
    const currentTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    ).getTime();
    let nearest: { file: TFile; time: number } | null = null;

    for (const file of this.app.vault.getMarkdownFiles()) {
      if (
        file.path !== journalFolder &&
        !file.path.startsWith(journalFolderPrefix)
      ) {
        continue;
      }
      if (!file.basename.startsWith(this.DRC_PREFIX)) continue;

      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (frontmatter?.type !== 'drc' || typeof frontmatter.date !== 'string') {
        continue;
      }

      const parsedDate = parseLocalDateSafe(frontmatter.date);
      if (!parsedDate) continue;

      const time = new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate()
      ).getTime();
      if (time >= currentTime) continue;
      if (!nearest || time > nearest.time) nearest = { file, time };
    }

    return nearest?.file ?? null;
  }

  private getImagesForWidget(
    imagesByWidget: unknown,
    widgetId: string
  ): string[] {
    const imageRecord = asRecord(imagesByWidget);
    if (!imageRecord) return [];
    const images = imageRecord[widgetId];
    if (!Array.isArray(images)) return [];
    return images.filter((image): image is string => typeof image === 'string');
  }

  
  private async generateInitialDRCContent(date: Date): Promise<string> {
    
    const drcData: Record<string, unknown> = {
      type: 'drc',
      date: this.formatDateForDisplay(date),
      tags: [],
      
      
      sessionMistakes: [],
    };

    
    const recurringGoals = this.plugin.settings.drc.recurringGoals || [];
    if (recurringGoals.length > 0) {
      drcData.dailyGoals = [...recurringGoals];
      const dailyGoalStatus: Record<string, boolean> = {};
      recurringGoals.forEach((_, index) => {
        dailyGoalStatus[`goal_${index}`] = false;
      });
      drcData.dailyGoalStatus = dailyGoalStatus;
    }

    
    const checklistItems = this.plugin.settings.drc.checklistItems || [];
    if (checklistItems.length > 0) {
      drcData.checklistItems = [...checklistItems];
      const checklistStatus: Record<string, boolean> = {};
      checklistItems.forEach((_, index) => {
        checklistStatus[`item_${index}`] = false;
      });
      drcData.checklistStatus = checklistStatus;
    }

    
    const { templateService, transformService } = this.getTemplateServices();
    const template = templateService.getDefaultTemplate('drc');

    
    drcData.templateId = template.id;
    drcData.templateVersion = template.version;

    
    return transformService.generateNoteFromTemplate(template, drcData);
  }

  
  private convertToYamlFrontmatter(data: Partial<DRCData>): string[] {
    const result: string[] = [];

    
    const stringifyValue = (value: unknown): string => {
      if (value === null || value === undefined) {
        return 'null';
      }

      if (typeof value === 'string') {
        
        if (
          value.includes(':') ||
          value.includes('#') ||
          value.includes('\n') ||
          value.includes('"') ||
          value.trim() === ''
        ) {
          return `"${value.replace(/"/g, '\\"')}"`;
        }
        return value;
      }

      if (typeof value === 'number' || typeof value === 'boolean') {
        return safeString(value);
      }

      if (Array.isArray(value)) {
        return JSON.stringify(value);
      }

      if (typeof value === 'object') {
        return JSON.stringify(value);
      }

      return safeString(value);
    };

    
    for (const [key, value] of Object.entries(data)) {
      if (key === 'type') continue; 

      if (value !== undefined) {
        result.push(`${key}: ${stringifyValue(value)}`);
      }
    }

    return result;
  }

  
  public async openDRC(
    date: Date,
    createNewLeaf: boolean = true,
    focusLeaf: boolean = true,
    source: NavigationSource = 'standard'
  ): Promise<void> {
    try {
      
      const targetDateString = this.formatDateForDisplay(date);

      

      let existingDRCLeaf: WorkspaceLeaf | null = null;

      this.app.workspace.iterateAllLeaves((leaf) => {
        if (existingDRCLeaf) return; 

        if (leaf.view instanceof FileView && leaf.view.file) {
          const file = leaf.view.file;
          const frontmatter =
            this.app.metadataCache.getFileCache(file)?.frontmatter;

          
          if (
            frontmatter?.type === 'drc' &&
            frontmatter?.date === targetDateString
          ) {
            existingDRCLeaf = leaf;
          }
        }
      });

      
      if (existingDRCLeaf) {
        void this.app.workspace.revealLeaf(existingDRCLeaf);
        this.app.workspace.setActiveLeaf(existingDRCLeaf, {
          focus: focusLeaf,
        });
        return;
      }

      
      const drcPath = this.getDRCNotePath(date);

      
      const exists = await this.app.vault.adapter.exists(drcPath);

      if (exists) {
        
        await this.plugin.openFile(drcPath, createNewLeaf, focusLeaf, source);
      } else {
        
        await this.createDRC(date);
        await this.plugin.openFile(drcPath, createNewLeaf, focusLeaf, source);
      }
    } catch (error) {
      console.error(
        `Failed to open DRC for date ${date.toDateString()}:`,
        error
      );
      throw error;
    }
  }

  
  public async createWeeklyReview(date: Date): Promise<string> {
    try {
      const path = this.getWeeklyReviewPath(date);

      
      const exists = await this.app.vault.adapter.exists(path);
      if (exists) {
        return path;
      }

      
      await this.ensureDirectoryExists(path);

      
      const content = this.generateInitialWeeklyReviewContent(date);

      
      const newFile = await this.app.vault.create(path, content);

      
      await forceMetadataCacheRefresh(this.app, newFile);

      return path;
    } catch (error) {
      console.error('Error creating weekly review:', error);
      throw error;
    }
  }

  
  private generateInitialWeeklyReviewContent(date: Date): string {
    const weekStartDay = getWeekStartDaySetting(this.plugin);
    const weekStart = getWeekStartDate(date, weekStartDay);
    const weekAnchor = getWeekAnchorDate(date, weekStartDay);
    const weekAnchorThursday = getISOWeekThursday(weekAnchor);

    
    const year = weekAnchorThursday.getFullYear();
    const month = String(weekAnchorThursday.getMonth() + 1).padStart(2, '0');
    const weekOfMonth = this.getWeekOfMonth(date);

    
    const weeklyReviewData: Record<string, unknown> = {
      type: 'weekly-review',
      date: this.formatDateForDisplay(weekStart),
      created: this.formatDateTimeForDisplay(new Date()),
      week: weekOfMonth,
      month: month,
      year: year.toString(),
    };

    
    const frontmatterLines = [
      '---',
      'type: weekly-review',
      ...this.convertToYamlFrontmatter(weeklyReviewData),
      '---',
    ];

    
    return [
      ...frontmatterLines,
      '',
      `# Weekly Review - Week ${weekOfMonth}, ${month}/${year}`,
      '',
      '## Summary',
      '',
      'Weekly trading summary goes here.',
      '',
      '## Performance',
      '',
      'Performance metrics for the week.',
      '',
      '## Lessons Learned',
      '',
      "Key takeaways from this week's trades.",
      '',
      '## Goals for Next Week',
      '',
      'Trading goals for the upcoming week.',
    ].join('\n');
  }

  
  public async openWeeklyReview(date: Date): Promise<void> {
    try {
      
      const weeklyReviewService =
        await this.plugin.serviceManager.getWeeklyReviewService();
      await weeklyReviewService.openWeeklyReview(date);
    } catch (error) {
      console.error(
        `Failed to open weekly review for date ${date.toDateString()}:`,
        error
      );
      throw error;
    }
  }

  
  public async saveDRCForecastImage(
    file: File,
    drcDate: Date,
    timeframe: string
  ): Promise<string> {
    try {
      
      const year = drcDate.getFullYear();
      const monthNum = drcDate.getMonth() + 1;
      const month = String(monthNum).padStart(2, '0');
      const weekFolderName = getWeekFolderName(drcDate, year);

      
      const safeTimeframe = timeframe.replace(/[^a-zA-Z0-9]/g, '');

      
      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      let fileExt = '';
      if (fileName.includes('.')) {
        fileExt = fileName.substring(fileName.lastIndexOf('.'));
      } else {
        throw new Error('File name does not contain a period.');
      }
      
      const timestamp = Date.now();

      
      const formattedDate = this.formatDateForFilename(drcDate);

      
      const imageFileName = `DRC-${safeTimeframe}-${formattedDate}-${timestamp}${fileExt}`;

      
      const quarter = getQuarterForMonth(monthNum);
      const folderPath = this.folderPathService.getDatePathForQuarterSync(
        year.toString(),
        quarter,
        month,
        weekFolderName,
        'media'
      );

      
      const filePath = `${folderPath}/${imageFileName}`;

      const [, arrayBuffer] = await Promise.all([
        this.app.vault.adapter.mkdir(normalizePath(folderPath)),
        file.arrayBuffer(),
      ]);

      
      await this.app.vault.createBinary(normalizePath(filePath), arrayBuffer);

      return filePath;
    } catch (error) {
      console.error('Error saving DRC forecast image:', error);
      throw error;
    }
  }

  
  public async getWeeklyEventsForDate(date: Date): Promise<NewsEvent[]> {
    try {
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

      
      const weeklyReviewPath = this.getWeeklyReviewPath(date);

      
      const exists = await this.app.vault.adapter.exists(weeklyReviewPath);
      if (!exists) {
        return [];
      }

      
      const file = this.app.vault.getAbstractFileByPath(weeklyReviewPath);
      if (!file || !(file instanceof TFile)) {
        return [];
      }

      
      const frontmatter = asRecord(
        this.app.metadataCache.getFileCache(file)?.frontmatter
      );
      if (!frontmatter || frontmatter.type !== 'weekly-review') {
        return [];
      }

      
      const allEvents = Array.isArray(frontmatter.keyEvents)
        ? frontmatter.keyEvents.filter(isNewsEvent)
        : [];

      
      
      const filteredEvents = allEvents.filter((event: NewsEvent) => {
        
        if (!event.day) {
          return true;
        }

        
        const isMatch = event.day.toLowerCase() === dayOfWeek.toLowerCase();
        return isMatch;
      });

      return filteredEvents;
    } catch (error) {
      console.error('Error getting weekly events for date:', error);
      return [];
    }
  }

  
  public async saveDRCForecastImages(
    files: File[],
    drcDate: Date,
    timeframe: string
  ): Promise<string[]> {
    try {
      const savedPaths: string[] = [];

      for (const file of files) {
        const savedPath = await this.saveDRCForecastImage(
          file,
          drcDate,
          timeframe
        );
        savedPaths.push(savedPath);
      }

      return savedPaths;
    } catch (error) {
      console.error('Error saving multiple DRC forecast images:', error);
      throw error;
    }
  }

  
  public async deleteImage(imagePath: string): Promise<void> {
    try {
      
      const imageFile = this.app.vault.getAbstractFileByPath(imagePath);

      if (!imageFile) {
        throw new Error(`Image file not found: ${imagePath}`);
      }

      
      await this.app.fileManager.trashFile(imageFile);

      
      const folderPath = imagePath.substring(0, imagePath.lastIndexOf('/'));

      
      const exists = await this.app.vault.adapter.exists(folderPath);
      if (exists) {
        const contents = await this.app.vault.adapter.list(folderPath);

        
        if (contents.files.length === 0 && contents.folders.length === 0) {
          
          const folder = this.app.vault.getAbstractFileByPath(folderPath);
          if (folder) {
            await this.app.fileManager.trashFile(folder);
          }
        }
      }
    } catch (error) {
      console.error(`Error deleting image ${imagePath}:`, error);
      throw error;
    }
  }

  
  public destroy(): void {
    for (const unsubscribe of this.unsubscribeFns) {
      unsubscribe();
    }
    this.unsubscribeFns = [];
  }
}
