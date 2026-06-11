

import { App, TFile, normalizePath, FileView } from 'obsidian';
import { imageService } from '../../services/image/ImageService';
import { NewsEvent, WeeklyReviewData } from './types';

import JournalitPlugin from '../../main';
import type { NavigationSource } from '../../navigation/types';
import {
  getWeekStartDate,
  getWeekStartDaySetting,
  getWeekAnchorDate,
  getWeekStringForDate,
  getISOWeekThursday,
  parseLocalDateSafe,
  getQuarterForMonth,
} from '../../utils/dateUtils';
import { getTradingDay } from '../../utils/tradingDayUtils';
import { DRCData } from '../drc/types';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import {
  generatePeriodicTag,
  generateContextualTags,
  combineTags,
  PERIODIC_TYPES,
} from '../../utils/tagSchema';
import { FolderPathService } from '../core/FolderPathService';
import { ReviewTemplateService } from '../templates/ReviewTemplateService';
import { TemplateTransformationService } from '../templates/TemplateTransformationService';
import { normalizeTradeExecutionForPeriodAnalytics } from '../trade/core/TradeExecutionAnalytics';
import { eventBus, Unsubscribe } from '../events';


export class WeeklyReviewService {
  
  private readonly WEEKLY_PREFIX = 'Weekly';

  
  private app: App;

  
  private plugin: JournalitPlugin;

  
  private folderPathService: FolderPathService | null = null;

  
  private templateService: ReviewTemplateService | null = null;
  private transformService: TemplateTransformationService | null = null;

  
  private unsubscribeSettings?: Unsubscribe;

  
  constructor(
    app: App,
    plugin: JournalitPlugin,
    folderPathService?: FolderPathService,
    _config: { namespace?: string } = {}
  ) {
    this.app = app;
    this.plugin = plugin;

    
    this.folderPathService = folderPathService || null;

    
    if (!this.folderPathService) {
      this.initializeFolderPathService();
    }

    
    this.unsubscribeSettings = eventBus.subscribe(
      'settings:changed',
      (payload) => {
        this.onSettingsUpdated(payload);
      }
    );
  }

  
  private async initializeFolderPathService(): Promise<void> {
    try {
      if (this.plugin.serviceManager) {
        this.folderPathService =
          this.plugin.serviceManager.getFolderPathService();
      }
    } catch (error) {
      console.error(
        '[WeeklyReviewService] Error initializing folder path service:',
        error
      );
    }
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

  
  private getJournalFolderPath(): string {
    if (this.folderPathService) {
      return this.folderPathService.journalFolderPath;
    }
    
    return '!Journalit';
  }

  
  private async onSettingsUpdated(payload?: {
    component?: string;
    source?: string;
  }) {
    try {
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile) return;

      const metadata = this.app.metadataCache.getFileCache(activeFile);
      if (
        !metadata?.frontmatter ||
        metadata.frontmatter.type !== 'weekly-review'
      )
        return;

      
      
      if (
        payload?.component === 'weekly' &&
        this.plugin.settings.weekly?.reviewQuestions
      ) {
        
        const currentData = await this.extractWeeklyReviewData(activeFile);
        if (!currentData) return;

        
        const currentQuestions = Object.keys(currentData.reviewQuestions || {});
        const newQuestions = this.plugin.settings.weekly.reviewQuestions;

        if (
          currentQuestions.length !== newQuestions.length ||
          !currentQuestions.every((q) => newQuestions.includes(q))
        ) {
          
          const updatedQuestions: Record<string, string> = {};
          newQuestions.forEach((question) => {
            updatedQuestions[question] =
              currentData.reviewQuestions &&
              question in currentData.reviewQuestions
                ? currentData.reviewQuestions[question]
                : '';
          });

          
          await this.updateWeeklyReviewFrontmatter(activeFile.path, {
            reviewQuestions: updatedQuestions,
          });
        }
      }

      
      eventBus.publish('review:changed', {
        type: 'weekly',
        action: 'updated',
        filePath: activeFile.path,
      });
    } catch (error) {
      console.error(
        'Error updating Weekly Review after settings change:',
        error
      );
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

    
    
    
    if (this.folderPathService) {
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

    
    return normalizePath(
      `${this.getJournalFolderPath()}/${year}/${month}/${weekOfMonth}/${filename}`
    );
  }

  
  private async ensureDirectoryExists(filePath: string): Promise<void> {
    
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));

    
    if (!(await this.app.vault.adapter.exists(dirPath))) {
      
      await this.app.vault.adapter.mkdir(dirPath);
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

      
      const content = await this.generateInitialWeeklyReviewContent(date);

      
      const newFile = await this.app.vault.create(path, content);

      
      await forceMetadataCacheRefresh(this.app, newFile);

      
      eventBus.publish('review:changed', {
        type: 'weekly',
        action: 'created',
        filePath: path,
      });

      return path;
    } catch (error) {
      console.error('Error creating weekly review:', error);
      throw error;
    }
  }

  
  
  private formatDateForDisplay(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  
  private generateWeeklyReviewTags(date: Date): string[] {
    const tagArrays: string[][] = [];

    const weekStartDay = getWeekStartDaySetting(this.plugin);
    const weekStart = getWeekStartDate(date, weekStartDay);

    
    tagArrays.push([generatePeriodicTag(PERIODIC_TYPES.WEEKLY)]);

    
    const contextualTags = generateContextualTags(weekStart);
    if (contextualTags.length > 0) {
      tagArrays.push(contextualTags);
    }

    
    return combineTags(...tagArrays);
  }

  
  private async generateInitialWeeklyReviewContent(
    date: Date
  ): Promise<string> {
    const weekStartDay = getWeekStartDaySetting(this.plugin);
    const weekStart = getWeekStartDate(date, weekStartDay);
    const weekAnchor = getWeekAnchorDate(date, weekStartDay);
    const weekOfMonth = getWeekStringForDate(weekAnchor);

    
    
    const thursday = getISOWeekThursday(weekAnchor);
    const isoYear = thursday.getFullYear();
    const isoMonth = thursday.getMonth() + 1;

    
    const weeklyReviewData: Partial<WeeklyReviewData> = {
      type: 'weekly-review',
      date: this.formatDateForDisplay(weekStart),
      tags: this.generateWeeklyReviewTags(date),
      week: weekOfMonth,
      month: String(isoMonth).padStart(2, '0'),
      year: String(isoYear),
    };

    
    const recurringGoals = this.plugin.settings.weekly?.recurringGoals || [];
    if (recurringGoals.length > 0) {
      weeklyReviewData.weeklyGoals = [...recurringGoals];
      weeklyReviewData.weeklyGoalStatus = {};
      recurringGoals.forEach((_, index) => {
        weeklyReviewData.weeklyGoalStatus![`goal_${index}`] = false;
      });
    }

    
    const checklistItems = this.plugin.settings.weekly?.checklistItems || [];
    if (checklistItems.length > 0) {
      weeklyReviewData.checklistItems = [...checklistItems];
      weeklyReviewData.checklistStatus = {};
      checklistItems.forEach((_, index) => {
        weeklyReviewData.checklistStatus![`item_${index}`] = false;
      });
    }

    
    const { templateService, transformService } = this.getTemplateServices();
    const template = templateService.getDefaultTemplate('weekly');

    
    weeklyReviewData.templateId = template.id;
    weeklyReviewData.templateVersion = template.version;

    
    return transformService.generateNoteFromTemplate(
      template,
      weeklyReviewData as Record<string, any>
    );
  }

  
  private convertToYamlFrontmatter(data: Partial<WeeklyReviewData>): string[] {
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
        return String(value);
      }

      if (Array.isArray(value)) {
        return JSON.stringify(value);
      }

      if (typeof value === 'object') {
        return JSON.stringify(value);
      }

      return String(value);
    };

    
    for (const [key, value] of Object.entries(data)) {
      if (key === 'type') continue; 

      if (value !== undefined) {
        result.push(`${key}: ${stringifyValue(value)}`);
      }
    }

    return result;
  }

  
  public async extractWeeklyReviewData(
    file: TFile
  ): Promise<WeeklyReviewData | null> {
    try {
      
      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;

      
      if (!frontmatter || frontmatter.type !== 'weekly-review') {
        return null;
      }

      return frontmatter as unknown as WeeklyReviewData;
    } catch (error) {
      console.error('Error extracting Weekly Review data:', error);
      return null;
    }
  }

  
  public async updateWeeklyReviewFrontmatter(
    filePath: string,
    updates: Partial<Record<string, any>>
  ): Promise<void> {
    try {
      
      const file = this.app.vault.getAbstractFileByPath(filePath);

      if (!file || !(file instanceof TFile)) {
        throw new Error(`Weekly Review file not found: ${filePath}`);
      }

      
      await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        const { imagesByWidget, ...rest } = updates;
        Object.assign(frontmatter, rest);

        if (
          imagesByWidget &&
          typeof imagesByWidget === 'object' &&
          !Array.isArray(imagesByWidget)
        ) {
          const existingByWidget =
            frontmatter.imagesByWidget &&
            typeof frontmatter.imagesByWidget === 'object' &&
            !Array.isArray(frontmatter.imagesByWidget)
              ? frontmatter.imagesByWidget
              : {};
          frontmatter.imagesByWidget = {
            ...existingByWidget,
            ...(imagesByWidget as Record<string, unknown>),
          };
        } else if (imagesByWidget !== undefined) {
          frontmatter.imagesByWidget = imagesByWidget;
        }
      });

      
      await forceMetadataCacheRefresh(this.app, file);

      
      eventBus.publish('review:changed', {
        type: 'weekly',
        action: 'updated',
        filePath,
      });

      
      if (updates.nextWeekGoals !== undefined) {
        await this.syncGoalsToNextWeek(filePath, updates.nextWeekGoals);
      }

      return;
    } catch (error) {
      console.error(
        `Error updating Weekly Review frontmatter in ${filePath}:`,
        error
      );
      throw error;
    }
  }

  
  public async appendKeyEventToWeeklyReview(
    date: Date,
    event: NewsEvent
  ): Promise<string> {
    const weeklyReviewPath = this.getWeeklyReviewPath(date);

    if (!(await this.app.vault.adapter.exists(weeklyReviewPath))) {
      await this.createWeeklyReview(date);
    }

    const weeklyReviewFile =
      this.app.vault.getAbstractFileByPath(weeklyReviewPath);
    if (!(weeklyReviewFile instanceof TFile)) {
      throw new Error(`Weekly Review file not found: ${weeklyReviewPath}`);
    }

    await this.app.fileManager.processFrontMatter(
      weeklyReviewFile,
      (frontmatter) => {
        const currentEvents = Array.isArray(frontmatter.keyEvents)
          ? frontmatter.keyEvents
          : [];
        frontmatter.keyEvents = [...currentEvents, event];
      }
    );

    await forceMetadataCacheRefresh(this.app, weeklyReviewFile);

    eventBus.publish('review:changed', {
      type: 'weekly',
      action: 'updated',
      filePath: weeklyReviewPath,
    });

    return weeklyReviewPath;
  }

  public async updateKeyEventForDate(
    date: Date,
    filteredEventIndex: number,
    event: NewsEvent
  ): Promise<string> {
    return this.mutateKeyEventForDate(date, filteredEventIndex, event);
  }

  public async removeKeyEventForDate(
    date: Date,
    filteredEventIndex: number
  ): Promise<string> {
    return this.mutateKeyEventForDate(date, filteredEventIndex, null);
  }

  private async mutateKeyEventForDate(
    date: Date,
    filteredEventIndex: number,
    replacement: NewsEvent | null
  ): Promise<string> {
    const weeklyReviewPath = this.getWeeklyReviewPath(date);
    const weeklyReviewFile =
      this.app.vault.getAbstractFileByPath(weeklyReviewPath);
    if (!(weeklyReviewFile instanceof TFile)) {
      throw new Error(`Weekly Review file not found: ${weeklyReviewPath}`);
    }

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    let didMutate = false;

    await this.app.fileManager.processFrontMatter(
      weeklyReviewFile,
      (frontmatter) => {
        const currentEvents: NewsEvent[] = Array.isArray(frontmatter.keyEvents)
          ? frontmatter.keyEvents
          : [];
        let visibleIndex = -1;

        frontmatter.keyEvents = currentEvents.flatMap((currentEvent) => {
          const appliesToDate =
            !currentEvent.day ||
            currentEvent.day.toLowerCase() === dayOfWeek.toLowerCase();

          if (!appliesToDate) return [currentEvent];

          visibleIndex++;
          if (visibleIndex !== filteredEventIndex) return [currentEvent];

          didMutate = true;
          return replacement ? [replacement] : [];
        });
      }
    );

    if (!didMutate) {
      throw new Error(
        `Weekly Review key event not found at filtered index ${filteredEventIndex}: ${weeklyReviewPath}`
      );
    }

    await forceMetadataCacheRefresh(this.app, weeklyReviewFile);

    eventBus.publish('review:changed', {
      type: 'weekly',
      action: 'updated',
      filePath: weeklyReviewPath,
    });

    return weeklyReviewPath;
  }

  
  private async syncGoalsToNextWeek(
    currentFilePath: string,
    nextWeekGoals: string[] | undefined
  ): Promise<void> {
    try {
      
      const currentFile = this.app.vault.getAbstractFileByPath(currentFilePath);
      if (!currentFile || !(currentFile instanceof TFile)) {
        return; 
      }

      
      const currentData = await this.extractWeeklyReviewData(currentFile);
      if (!currentData?.date) {
        return; 
      }

      
      const dateParts = currentData.date
        .split('-')
        .map((part) => parseInt(part, 10));
      const currentWeekDate = new Date(
        dateParts[0],
        dateParts[1] - 1,
        dateParts[2]
      );
      const nextWeekDate = new Date(currentWeekDate);
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);

      
      const nextWeekPath = this.getWeeklyReviewPath(nextWeekDate);
      const nextWeekFile = this.app.vault.getAbstractFileByPath(nextWeekPath);

      
      if (nextWeekFile instanceof TFile) {
        
        await this.app.fileManager.processFrontMatter(
          nextWeekFile,
          (frontmatter) => {
            frontmatter.previousGoals = nextWeekGoals || [];
          }
        );

        
        await forceMetadataCacheRefresh(this.app, nextWeekFile);

        
        eventBus.publish('review:changed', {
          type: 'weekly',
          action: 'updated',
          filePath: nextWeekPath,
        });
      }
    } catch (error) {
      
      console.warn(`Warning: Failed to sync goals to next week:`, error);
    }
  }

  
  public async getDRCsForWeek(
    date: Date
  ): Promise<{ file: TFile; data: DRCData }[]> {
    try {
      const weekStartDay = getWeekStartDaySetting(this.plugin);
      const weekStart = getWeekStartDate(date, weekStartDay);

      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      
      const startDate = this.formatDateForDisplay(weekStart);
      const endDate = this.formatDateForDisplay(weekEnd);

      
      const files = this.app.vault.getMarkdownFiles();

      
      const drcFiles: { file: TFile; data: DRCData }[] = [];

      for (const file of files) {
        const frontmatter =
          this.app.metadataCache.getFileCache(file)?.frontmatter;

        
        if (!frontmatter || frontmatter.type !== 'drc') {
          continue;
        }

        
        const drcDate = frontmatter.date;
        if (!drcDate) continue;

        
        
        
        
        if (drcDate >= startDate && drcDate <= endDate) {
          drcFiles.push({
            file,
            data: frontmatter as unknown as DRCData,
          });
        }
      }

      
      drcFiles.sort((a, b) => a.data.date.localeCompare(b.data.date));

      return drcFiles;
    } catch (error) {
      console.error('Error getting DRCs for week:', error);
      return [];
    }
  }

  
  public async getTradesForWeek(date: Date): Promise<TFile[]> {
    try {
      const weekStartDay = getWeekStartDaySetting(this.plugin);
      const weekStart = getWeekStartDate(date, weekStartDay);

      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      
      const startDateStr = this.formatDateForDisplay(weekStart);
      const endDateStr = this.formatDateForDisplay(weekEnd);

      
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

          
          const tradingDay = getTradingDay(entryDate, this.plugin);
          const tradingDayStr = this.formatDateForDisplay(tradingDay);

          
          if (tradingDayStr >= startDateStr && tradingDayStr <= endDateStr) {
            tradeFiles.push(file);
          }
        } else if (frontmatter.date) {
          
          
          const noteDate = parseLocalDateSafe(frontmatter.date);
          if (!noteDate) continue;
          const tradeDateStr = this.formatDateForDisplay(noteDate);

          
          if (tradeDateStr >= startDateStr && tradeDateStr <= endDateStr) {
            tradeFiles.push(file);
          }
        }
      }

      return tradeFiles;
    } catch (error) {
      console.error('Error getting trades for week:', error);
      return [];
    }
  }

  
  public async openWeeklyReview(
    date: Date,
    createNewLeaf: boolean = true,
    focusLeaf: boolean = true,
    source: NavigationSource = 'standard'
  ): Promise<void> {
    try {
      const weekStartDay = getWeekStartDaySetting(this.plugin);
      const weekAnchor = getWeekAnchorDate(date, weekStartDay);
      const weekAnchorThursday = getISOWeekThursday(weekAnchor);
      const targetWeek = getWeekStringForDate(weekAnchor);
      const targetMonth = String(weekAnchorThursday.getMonth() + 1).padStart(
        2,
        '0'
      );
      const targetYear = weekAnchorThursday.getFullYear().toString();

      

      let existingWeeklyLeaf: any = null;
      this.app.workspace.iterateAllLeaves((leaf) => {
        if (leaf.view instanceof FileView && leaf.view.file) {
          const frontmatter = this.app.metadataCache.getFileCache(
            leaf.view.file
          )?.frontmatter;
          if (
            frontmatter?.type === 'weekly-review' &&
            frontmatter.week === targetWeek &&
            frontmatter.month === targetMonth &&
            frontmatter.year === targetYear
          ) {
            existingWeeklyLeaf = leaf;
            return true; 
          }
        }
      });

      
      if (existingWeeklyLeaf) {
        this.app.workspace.revealLeaf(existingWeeklyLeaf);
        this.app.workspace.setActiveLeaf(existingWeeklyLeaf, {
          focus: focusLeaf,
        });
        return;
      }

      
      const weeklyReviewPath = this.getWeeklyReviewPath(date);

      
      const exists = await this.app.vault.adapter.exists(weeklyReviewPath);

      if (exists) {
        
        await this.plugin.openFile(
          weeklyReviewPath,
          createNewLeaf,
          focusLeaf,
          source
        );
      } else {
        
        await this.createWeeklyReview(date);
        await this.plugin.openFile(
          weeklyReviewPath,
          createNewLeaf,
          focusLeaf,
          source
        );
      }
    } catch (error) {
      console.error(
        `Failed to open weekly review for date ${date.toDateString()}:`,
        error
      );
      throw error;
    }
  }

  
  public getNextWeekReviewPath(currentDate: Date): string {
    const weekStartDay = getWeekStartDaySetting(this.plugin);
    const weekStart = getWeekStartDate(currentDate, weekStartDay);

    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    return this.getWeeklyReviewPath(nextWeekStart);
  }

  
  public getPreviousWeekReviewPath(currentDate: Date): string {
    const weekStartDay = getWeekStartDaySetting(this.plugin);
    const weekStart = getWeekStartDate(currentDate, weekStartDay);

    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);

    return this.getWeeklyReviewPath(prevWeekStart);
  }

  
  public async getAdjacentWeeklyReview(
    currentDate: Date,
    offset: number,
    autoCreate?: boolean
  ): Promise<string | null> {
    try {
      
      const path =
        offset < 0
          ? this.getPreviousWeekReviewPath(currentDate)
          : this.getNextWeekReviewPath(currentDate);

      
      const exists = await this.app.vault.adapter.exists(path);

      
      if (exists) {
        return path;
      }

      
      const shouldAutoCreate =
        autoCreate ??
        this.plugin.settings?.weekly?.autoCreateWeeklyReviewOnNavigation ??
        true;

      if (shouldAutoCreate) {
        const weekStartDay = getWeekStartDaySetting(this.plugin);
        const weekStart = getWeekStartDate(currentDate, weekStartDay);
        let targetWeekStart: Date;

        if (offset < 0) {
          
          targetWeekStart = new Date(weekStart);
          targetWeekStart.setDate(targetWeekStart.getDate() - 7);
        } else {
          
          targetWeekStart = new Date(weekStart);
          targetWeekStart.setDate(targetWeekStart.getDate() + 7);
        }

        
        await this.createWeeklyReview(targetWeekStart);
        return path;
      }

      
      return null;
    } catch (error) {
      console.error('Error getting adjacent weekly review:', error);
      return null;
    }
  }

  
  public async saveWeeklyReviewImage(
    file: File,
    weekDate: Date,
    section: string
  ): Promise<string> {
    try {
      const weekStartDay = getWeekStartDaySetting(this.plugin);
      const weekAnchor = getWeekAnchorDate(weekDate, weekStartDay);
      const weekAnchorThursday = getISOWeekThursday(weekAnchor);

      
      const year = weekAnchorThursday.getFullYear();
      const month = String(weekAnchorThursday.getMonth() + 1).padStart(2, '0');
      const weekOfMonth = getWeekStringForDate(weekAnchor);

      
      const safeSection = section.replace(/[^a-zA-Z0-9]/g, '');

      
      const folderPath = `${this.getJournalFolderPath()}/${year}/${month}/${weekOfMonth}/media`;

      
      return await imageService.saveImage(
        file,
        folderPath, 
        `${weekOfMonth}-${safeSection}`, 
        undefined 
      );
    } catch (error) {
      console.error('Error saving weekly review image:', error);
      throw error;
    }
  }

  
  public async saveWeeklyReviewImages(
    files: File[],
    weekDate: Date,
    section: string
  ): Promise<string[]> {
    try {
      const savedPaths: string[] = [];

      for (const file of files) {
        const savedPath = await this.saveWeeklyReviewImage(
          file,
          weekDate,
          section
        );
        savedPaths.push(savedPath);
      }

      return savedPaths;
    } catch (error) {
      console.error('Error saving multiple weekly review images:', error);
      throw error;
    }
  }

  
  public async deleteImage(imagePath: string): Promise<void> {
    try {
      
      await imageService.deleteImage(imagePath, true);
    } catch (error) {
      console.error(`Error deleting image ${imagePath}:`, error);
      throw error;
    }
  }

  
  public async deleteEmptyFolder(folderPath: string): Promise<void> {
    try {
      
      await imageService.deleteEmptyFolder(
        folderPath,
        this.getJournalFolderPath()
      );
    } catch (error) {
      console.error(`Error deleting empty folder ${folderPath}:`, error);
    }
  }

  
  public getMonthlyReviewPath(date: Date): string {
    const year = date.getFullYear();
    const monthNum = date.getMonth() + 1;

    
    
    
    if (this.folderPathService) {
      return normalizePath(
        this.folderPathService.getMonthlyReviewPathForQuarterSync(
          year,
          monthNum
        )
      );
    }

    
    const month = monthNum.toString().padStart(2, '0');
    return normalizePath(
      `${this.getJournalFolderPath()}/${year}/${month}/${month}-Review.md`
    );
  }

  
  public cleanup(): void {
    this.unsubscribeSettings?.();
  }
}
