

import { App, TFile, normalizePath, FileView, WorkspaceLeaf } from 'obsidian';
import type JournalitPlugin from '../../main';
import type { NavigationSource } from '../../navigation/types';
import { CustomDataService } from '../base/CustomDataService';
import {
  YearlyReviewFrontmatter,
  QuarterlyPerformanceData,
  YearlyDemonTrackerEntry,
  QuarterlyGamePerformance,
  GradeDistribution,
} from './types';
import type { Trade } from '../../components/dashboard/utils/dataUtils';
import { normalizeTradeExecutionForPeriodAnalytics } from '../trade/core/TradeExecutionAnalytics';
import { getTradingDay } from '../../utils/tradingDayUtils';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import {
  generatePeriodicTag,
  generateContextualTags,
  combineTags,
  PERIODIC_TYPES,
} from '../../utils/tagSchema';
import { FolderPathService } from '../core/FolderPathService';
import { parseTradeFinancialFields } from '../../utils/tradeUtils';
import { ReviewTemplateService } from '../templates/ReviewTemplateService';
import { eventBus, ReviewChangedPayload } from '../events';
import { TemplateTransformationService } from '../templates/TemplateTransformationService';
import {
  getQuarterForMonth,
  getQuarterStartDate,
  getQuarterEndDate,
  getYearStartDate,
} from '../../utils/dateUtils';
import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';

const getPnlContributingTrades = (trades: Trade[]): Trade[] =>
  trades.filter((trade) => isPnlContributingTrade(trade as Trade));

const sumEffectivePnL = (trades: Trade[]): number =>
  trades.reduce((sum, trade) => sum + getEffectivePnL(trade), 0);

const VALID_REVIEW_GRADES = new Set(['A', 'B', 'C']);

export class YearlyReviewService extends CustomDataService {
  private folderPathService: FolderPathService | null = null;

  private lastCacheClear: number = 0;

  private yearlyDataCache: Map<string, any> = new Map();

  private templateService: ReviewTemplateService | null = null;
  private transformService: TemplateTransformationService | null = null;

  constructor(
    app: App,
    plugin: JournalitPlugin,
    folderPathService?: FolderPathService,
    config: Record<string, unknown> = {}
  ) {
    super(app, {
      ...config,
      namespace: 'yearly-reviews',
      cacheTTL: 5 * 60 * 1000, 
      persistCache: true,
    });
    this.setPlugin(plugin);
    this.folderPathService = folderPathService || null;

    
    if (!this.folderPathService) {
      this.initializeFolderPathService();
    }

    
    eventBus.subscribe(
      'review:changed',
      async (payload: ReviewChangedPayload) => {
        if (payload.type === 'yearly' && payload.action === 'opened') {
          const now = Date.now();
          if (!this.lastCacheClear || now - this.lastCacheClear > 5000) {
            await this.clearCache();
            this.yearlyDataCache.clear();
            this.lastCacheClear = now;
          }
        }
      }
    );
  }

  
  private getPlugin(): JournalitPlugin {
    if (!this.plugin) {
      throw new Error('Plugin not initialized');
    }
    return this.plugin;
  }

  
  private async initializeFolderPathService(): Promise<void> {
    try {
      if (this.getPlugin()?.serviceManager) {
        this.folderPathService =
          await this.getPlugin().serviceManager.getFolderPathService();
      }
    } catch (error) {
      console.warn('Could not initialize FolderPathService:', error);
      this.folderPathService = null;
    }
  }

  
  private getTemplateServices(): {
    templateService: ReviewTemplateService;
    transformService: TemplateTransformationService;
  } {
    if (!this.templateService) {
      this.templateService = new ReviewTemplateService(this.getPlugin());
    }
    if (!this.transformService) {
      this.transformService = new TemplateTransformationService(
        this.getPlugin()
      );
    }
    return {
      templateService: this.templateService,
      transformService: this.transformService,
    };
  }

  protected defaultFrontmatter(): YearlyReviewFrontmatter {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return {
      type: 'yearly-review',
      date: `${year}-${month}-${day}`,
      year: now.getFullYear(),
      reviewQuestions: {},
      yearlyGoals: [],
      keyFocusAreas: [],
      biggestAccomplishment: '',
      biggestChallenge: '',
      lessonsLearned: [],
      nextYearGoals: [],
      areasOfImprovement: [],
    };
  }

  protected getCacheNamespace(): string {
    return 'yearly-reviews';
  }

  protected isValidType(frontmatter: Record<string, unknown>): boolean {
    return frontmatter?.type === 'yearly-review';
  }

  
  async clearCache(): Promise<void> {
    await super.clearCache();
    this.yearlyDataCache.clear();
  }

  
  private async ensureDirectoryExists(filePath: string): Promise<void> {
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
    if (!(await this.app.vault.adapter.exists(dirPath))) {
      await this.app.vault.createFolder(dirPath);
    }
  }

  
  private getJournalFolderPath(): string {
    if (this.folderPathService) {
      return this.folderPathService.journalFolderPath;
    }
    return '!Journalit';
  }

  
  async getYearlyReviewPath(date: Date): Promise<string> {
    const year = date.getFullYear();

    if (this.folderPathService) {
      return this.folderPathService.getYearlyReviewPath(year);
    }

    
    return normalizePath(
      `${this.getJournalFolderPath()}/${year}/${year}-Review.md`
    );
  }

  
  private formatDateForDisplay(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  
  async createYearlyReview(date: Date): Promise<TFile | null> {
    const filePath = await this.getYearlyReviewPath(date);

    
    const existingFile = this.app.vault.getAbstractFileByPath(filePath);
    if (existingFile instanceof TFile) {
      return existingFile;
    }

    
    await this.ensureDirectoryExists(filePath);

    
    
    const year = date.getFullYear();
    const frontmatter: YearlyReviewFrontmatter = {
      ...this.defaultFrontmatter(),
      date: this.formatDateForDisplay(date),
      year: year,
    };

    
    const content = this.generateInitialContent(frontmatter);

    
    try {
      const file = await this.app.vault.create(filePath, content);
      return file;
    } catch (error) {
      console.error('Error creating yearly review:', error);
      return null;
    }
  }

  
  public async openYearlyReview(
    date: Date,
    createNewLeaf: boolean = true,
    focusLeaf: boolean = true,
    source: NavigationSource = 'standard'
  ): Promise<void> {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date passed to openYearlyReview:', date);
      return;
    }

    try {
      const targetYear = date.getFullYear();

      
      let existingYearlyLeaf: WorkspaceLeaf | null = null;

      this.app.workspace.iterateAllLeaves((leaf) => {
        if (leaf.view instanceof FileView && leaf.view.file) {
          const file = leaf.view.file;
          const frontmatter =
            this.app.metadataCache.getFileCache(file)?.frontmatter;

          if (
            frontmatter?.type === 'yearly-review' &&
            Number(frontmatter?.year) === targetYear
          ) {
            existingYearlyLeaf = leaf;
          }
        }
      });

      if (existingYearlyLeaf) {
        this.app.workspace.revealLeaf(existingYearlyLeaf);
        this.app.workspace.setActiveLeaf(existingYearlyLeaf, {
          focus: focusLeaf,
        });
        return;
      }

      const yearlyReviewPath = await this.getYearlyReviewPath(date);
      const exists = await this.app.vault.adapter.exists(yearlyReviewPath);

      if (exists) {
        await this.getPlugin().openFile(
          yearlyReviewPath,
          createNewLeaf,
          focusLeaf,
          source
        );
      } else {
        const yearlyReview = await this.createYearlyReview(date);
        if (yearlyReview) {
          await this.getPlugin().openFile(
            yearlyReview.path,
            createNewLeaf,
            focusLeaf,
            source
          );
        } else {
          throw new Error(
            `Failed to create yearly review for ${date.toDateString()}`
          );
        }
      }
    } catch (error) {
      console.error(
        `Failed to open yearly review for date ${date.toDateString()}:`,
        error
      );
      throw error;
    }
  }

  
  private generateYearlyReviewTags(year: number): string[] {
    const tagArrays: string[][] = [];

    
    const yearDate = getYearStartDate(year);

    
    tagArrays.push([generatePeriodicTag(PERIODIC_TYPES.YEARLY)]);

    
    const contextualTags = generateContextualTags(yearDate);
    if (contextualTags.length > 0) {
      tagArrays.push(contextualTags);
    }

    
    tagArrays.push([`year-${year}-review`]);

    
    const decade = Math.floor(year / 10) * 10;
    tagArrays.push([`decade-${decade}s`]);

    return combineTags(...tagArrays);
  }

  
  private generateInitialContent(frontmatter: YearlyReviewFrontmatter): string {
    const tags = this.generateYearlyReviewTags(frontmatter.year);

    

    const yearlyData: Record<string, any> = {
      type: frontmatter.type,
      date: frontmatter.date,
      year: frontmatter.year,
      tags: tags,
    };

    const { templateService, transformService } = this.getTemplateServices();
    const template = templateService.getDefaultTemplate('yearly');

    yearlyData.templateId = template.id;
    yearlyData.templateVersion = template.version;

    return transformService.generateNoteFromTemplate(template, yearlyData);
  }

  
  async getYearlyTrades(year: number): Promise<Trade[]> {
    try {
      const trades: Trade[] = [];
      const files = this.app.vault.getMarkdownFiles();

      for (const file of files) {
        try {
          const cache = this.app.metadataCache.getFileCache(file);
          const frontmatter = cache?.frontmatter;

          if (
            frontmatter?.type === 'trade' ||
            frontmatter?.type === 'backtest-trade'
          ) {
            const normalizedExecution =
              normalizeTradeExecutionForPeriodAnalytics(frontmatter);
            if (!normalizedExecution) continue;
            const entryTime = normalizedExecution.entryTime;

            const tradingDay = getTradingDay(entryTime, this.plugin);

            
            if (tradingDay.getFullYear() === year) {
              const originalPnlWasNull =
                frontmatter.pnl === undefined || frontmatter.pnl === null;

              const trade: Trade = {
                instrument: frontmatter.instrument || frontmatter.ticker,
                direction: frontmatter.direction || frontmatter.side,
                ...normalizedExecution,
                pnl:
                  frontmatter.pnl !== undefined && frontmatter.pnl !== null
                    ? frontmatter.pnl
                    : 0,
                setup: frontmatter.setup,
                tags: frontmatter.tags,
                mistake: frontmatter.mistake,
                account: Array.isArray(frontmatter.account)
                  ? frontmatter.account
                  : frontmatter.account
                    ? [frontmatter.account]
                    : [],
                path: file.path,
                tradeStatus: frontmatter.tradeStatus,
                useDirectPnLInput: frontmatter.useDirectPnLInput,
                _originalPnlWasNull: originalPnlWasNull,
                ...parseTradeFinancialFields(frontmatter),
              } as Trade & {
                tradeStatus?: string;
                useDirectPnLInput?: boolean;

                exits?: any[];
                _originalPnlWasNull?: boolean;
              };
              trades.push(trade);
            }
          }
        } catch (fileError) {
          console.warn(`Error processing trade file ${file.path}:`, fileError);
          continue;
        }
      }

      return trades;
    } catch (error) {
      console.error('Error getting yearly trades:', error);
      return [];
    }
  }

  
  async getQuarterlyPerformance(
    year: number
  ): Promise<QuarterlyPerformanceData[]> {
    try {
      const trades = await this.getYearlyTrades(year);
      if (trades.length === 0) {
        return [];
      }

      const quarterlyData = new Map<number, QuarterlyPerformanceData>();

      
      const quarterEntries = await Promise.all(
        [1, 2, 3, 4].map(async (quarter) => {
          const quarterStart = getQuarterStartDate(year, quarter);
          const quarterEnd = getQuarterEndDate(year, quarter);

          let quarterlyReviewPath: string | undefined;
          if (this.folderPathService) {
            quarterlyReviewPath =
              await this.folderPathService.getQuarterlyReviewPath(
                year,
                quarter
              );
          }

          return [
            quarter,
            {
              quarter,
              quarterStartDate: quarterStart,
              quarterEndDate: quarterEnd,
              trades: 0,
              winRate: 0,
              profitFactor: 0,
              pnl: 0,
              quarterlyReviewPath,
            },
          ] as const;
        })
      );
      quarterEntries.forEach(([quarter, quarterData]) => {
        quarterlyData.set(quarter, quarterData);
      });

      const pnlContributingTrades = getPnlContributingTrades(trades);

      
      pnlContributingTrades.forEach((trade: Trade) => {
        const tradeDate = new Date(trade.entryTime);
        const tradeQuarter = getQuarterForMonth(tradeDate.getMonth() + 1);

        if (quarterlyData.has(tradeQuarter)) {
          const quarterStats = quarterlyData.get(tradeQuarter)!;
          quarterStats.trades++;
          quarterStats.pnl += getEffectivePnL(trade);
        }
      });

      
      quarterlyData.forEach((quarterStats, quarter) => {
        const quarterTrades = pnlContributingTrades.filter((trade) => {
          const tradeDate = new Date(trade.entryTime);
          return getQuarterForMonth(tradeDate.getMonth() + 1) === quarter;
        });

        const pnlContributingQuarterTrades =
          getPnlContributingTrades(quarterTrades);
        const winningTrades = pnlContributingQuarterTrades.filter(
          (t) => getEffectivePnL(t) > 0
        );
        const losingTrades = pnlContributingQuarterTrades.filter(
          (t) => getEffectivePnL(t) < 0
        );

        quarterStats.winRate = calculateWinRateExcludingBreakeven(
          winningTrades.length,
          losingTrades.length
        );

        const totalWins = sumEffectivePnL(winningTrades);
        const totalLosses = Math.abs(sumEffectivePnL(losingTrades));

        quarterStats.profitFactor =
          totalLosses > 0
            ? totalWins / totalLosses
            : totalWins > 0
              ? Infinity
              : 0;
      });

      return Array.from(quarterlyData.values()).sort(
        (a, b) => a.quarter - b.quarter
      );
    } catch (error) {
      console.error('Error getting quarterly performance:', error);
      return [];
    }
  }

  
  async getDemonTrackerData(year: number): Promise<YearlyDemonTrackerEntry[]> {
    try {
      const trades = await this.getYearlyTrades(year);
      return this.getDemonTrackerDataFromTrades(trades);
    } catch (error) {
      console.error('Error getting demon tracker data:', error);
      return [];
    }
  }

  
  private getDemonTrackerDataFromTrades(
    trades: Trade[]
  ): YearlyDemonTrackerEntry[] {
    const mistakeMap = new Map<string, YearlyDemonTrackerEntry>();

    trades.forEach((trade: Trade) => {
      if (trade.mistake && Array.isArray(trade.mistake)) {
        trade.mistake.forEach((mistake: string) => {
          if (!mistakeMap.has(mistake)) {
            mistakeMap.set(mistake, {
              mistake,
              occurrences: 0,
              dates: [],
            });
          }

          const entry = mistakeMap.get(mistake)!;
          entry.occurrences++;
          entry.dates.push(trade.entryTime.toISOString());
        });
      }
    });

    return Array.from(mistakeMap.values()).sort(
      (a, b) => b.occurrences - a.occurrences
    );
  }

  
  async getAdjacentYearlyReview(
    currentDate: Date,
    offset: number,
    autoCreate: boolean = true
  ): Promise<string | null> {
    const currentYear = currentDate.getFullYear();
    const targetYear = currentYear + offset;

    const targetDate = getYearStartDate(targetYear);
    const path = await this.getYearlyReviewPath(targetDate);
    const file = this.app.vault.getAbstractFileByPath(path);

    if (file instanceof TFile) {
      return path;
    }

    const settings = this.getPlugin()?.settings;
    if (autoCreate && settings?.yearly?.autoCreateYearlyReviewOnNavigation) {
      const newFile = await this.createYearlyReview(targetDate);
      return newFile ? newFile.path : null;
    }

    return null;
  }

  
  async getBestPerformingQuarter(
    year: number
  ): Promise<QuarterlyPerformanceData | null> {
    const quarterlyPerformance = await this.getQuarterlyPerformance(year);
    if (quarterlyPerformance.length === 0) return null;

    return quarterlyPerformance.reduce((best, current) =>
      current.pnl > best.pnl ? current : best
    );
  }

  
  async getWorstPerformingQuarter(
    year: number
  ): Promise<QuarterlyPerformanceData | null> {
    const quarterlyPerformance = await this.getQuarterlyPerformance(year);
    if (quarterlyPerformance.length === 0) return null;

    return quarterlyPerformance.reduce((worst, current) =>
      current.pnl < worst.pnl ? current : worst
    );
  }

  
  async getQuarterlyGamePerformance(
    year: number
  ): Promise<QuarterlyGamePerformance[]> {
    try {
      const quarterlyPerformance = await this.getQuarterlyPerformance(year);

      const drcService = this.getPlugin()?.serviceManager
        ? await this.getPlugin().serviceManager.getDRCService()
        : null;

      if (!drcService) {
        return [];
      }

      const gamePerformanceData: QuarterlyGamePerformance[] = [];

      for (const quarterData of quarterlyPerformance) {
        const mentalGradeDistribution: GradeDistribution = { A: 0, B: 0, C: 0 };
        const technicalGradeDistribution: GradeDistribution = {
          A: 0,
          B: 0,
          C: 0,
        };

        
        const quarterStart = quarterData.quarterStartDate;
        const quarterEnd = quarterData.quarterEndDate;

        for (
          let date = new Date(quarterStart);
          date <= quarterEnd;
          date.setDate(date.getDate() + 1)
        ) {
          const drcPath = drcService.getDRCNotePath(new Date(date));
          const file = this.app.vault.getAbstractFileByPath(drcPath);

          if (file instanceof TFile) {
            const cache = this.app.metadataCache.getFileCache(file);
            const drcData = cache?.frontmatter;

            if (drcData && drcData.type === 'drc') {
              if (
                drcData.mentalGrade &&
                VALID_REVIEW_GRADES.has(drcData.mentalGrade)
              ) {
                mentalGradeDistribution[
                  drcData.mentalGrade as keyof GradeDistribution
                ]++;
              }
              if (
                drcData.technicalGrade &&
                VALID_REVIEW_GRADES.has(drcData.technicalGrade)
              ) {
                technicalGradeDistribution[
                  drcData.technicalGrade as keyof GradeDistribution
                ]++;
              }
            }
          }
        }

        
        let mentalRating: number | undefined;
        let technicalRating: number | undefined;
        let mentalNotes: string | undefined;
        let technicalNotes: string | undefined;

        if (quarterData.quarterlyReviewPath) {
          const quarterlyFile = this.app.vault.getAbstractFileByPath(
            quarterData.quarterlyReviewPath
          );
          if (quarterlyFile instanceof TFile) {
            const cache = this.app.metadataCache.getFileCache(quarterlyFile);
            const quarterlyReviewData = cache?.frontmatter;
            if (quarterlyReviewData) {
              mentalRating = quarterlyReviewData.mentalGrade;
              technicalRating = quarterlyReviewData.technicalGrade;
              mentalNotes = quarterlyReviewData.mentalNotes;
              technicalNotes = quarterlyReviewData.technicalNotes;
            }
          }
        }

        gamePerformanceData.push({
          quarter: quarterData.quarter,
          quarterStartDate: quarterData.quarterStartDate,
          quarterEndDate: quarterData.quarterEndDate,
          quarterlyReviewPath: quarterData.quarterlyReviewPath,
          mentalGradeDistribution,
          technicalGradeDistribution,
          mentalRating,
          technicalRating,
          mentalNotes,
          technicalNotes,
        });
      }

      return gamePerformanceData;
    } catch (error) {
      console.error('Error getting quarterly game performance:', error);
      return [];
    }
  }

  
  async getYearlyDataOptimized(year: number): Promise<{
    trades: Trade[];
    quarterlyPerformance: QuarterlyPerformanceData[];
    quarterlyGamePerformance: QuarterlyGamePerformance[];
    demonTrackerData: YearlyDemonTrackerEntry[];
    bestQuarter: QuarterlyPerformanceData | null;
    worstQuarter: QuarterlyPerformanceData | null;
  }> {
    const cacheKey = `${year}`;
    const cached = this.yearlyDataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.data;
    }

    try {
      const trades = await this.getYearlyTrades(year);
      const quarterlyPerformance = await this.calculateQuarterlyPerformance(
        trades,
        year
      );
      const demonTrackerData = this.getDemonTrackerDataFromTrades(trades);
      const quarterlyGamePerformance =
        await this.getQuarterlyGamePerformance(year);

      const bestQuarter =
        quarterlyPerformance.length > 0
          ? quarterlyPerformance.reduce((best, current) =>
              current.pnl > best.pnl ? current : best
            )
          : null;

      const worstQuarter =
        quarterlyPerformance.length > 0
          ? quarterlyPerformance.reduce((worst, current) =>
              current.pnl < worst.pnl ? current : worst
            )
          : null;

      const result = {
        trades,
        quarterlyPerformance,
        quarterlyGamePerformance,
        demonTrackerData,
        bestQuarter,
        worstQuarter,
      };

      this.yearlyDataCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      console.error('Error getting optimized yearly data:', error);
      return {
        trades: [],
        quarterlyPerformance: [],
        quarterlyGamePerformance: [],
        demonTrackerData: [],
        bestQuarter: null,
        worstQuarter: null,
      };
    }
  }

  
  private async calculateQuarterlyPerformance(
    trades: Trade[],
    year: number
  ): Promise<QuarterlyPerformanceData[]> {
    try {
      const quarterlyData = new Map<number, QuarterlyPerformanceData>();

      const quarterEntries = await Promise.all(
        [1, 2, 3, 4].map(async (quarter) => {
          const quarterStart = getQuarterStartDate(year, quarter);
          const quarterEnd = getQuarterEndDate(year, quarter);

          let quarterlyReviewPath: string | undefined;
          if (this.folderPathService) {
            quarterlyReviewPath =
              await this.folderPathService.getQuarterlyReviewPath(
                year,
                quarter
              );
          }

          return [
            quarter,
            {
              quarter,
              quarterStartDate: quarterStart,
              quarterEndDate: quarterEnd,
              trades: 0,
              winRate: 0,
              profitFactor: 0,
              pnl: 0,
              quarterlyReviewPath,
            },
          ] as const;
        })
      );
      quarterEntries.forEach(([quarter, quarterData]) => {
        quarterlyData.set(quarter, quarterData);
      });

      const pnlContributingTrades = getPnlContributingTrades(trades);

      pnlContributingTrades.forEach((trade: Trade) => {
        const tradeDate = new Date(trade.entryTime);
        const tradeQuarter = getQuarterForMonth(tradeDate.getMonth() + 1);

        if (quarterlyData.has(tradeQuarter)) {
          const quarterStats = quarterlyData.get(tradeQuarter)!;
          quarterStats.trades++;
          quarterStats.pnl += getEffectivePnL(trade);
        }
      });

      quarterlyData.forEach((quarterStats, quarter) => {
        const quarterTrades = pnlContributingTrades.filter((trade) => {
          const tradeDate = new Date(trade.entryTime);
          return getQuarterForMonth(tradeDate.getMonth() + 1) === quarter;
        });

        const pnlContributingQuarterTrades =
          getPnlContributingTrades(quarterTrades);
        const winningTrades = pnlContributingQuarterTrades.filter(
          (t) => getEffectivePnL(t) > 0
        );
        const losingTrades = pnlContributingQuarterTrades.filter(
          (t) => getEffectivePnL(t) < 0
        );

        quarterStats.winRate = calculateWinRateExcludingBreakeven(
          winningTrades.length,
          losingTrades.length
        );

        const totalWins = sumEffectivePnL(winningTrades);
        const totalLosses = Math.abs(sumEffectivePnL(losingTrades));

        quarterStats.profitFactor =
          totalLosses > 0
            ? totalWins / totalLosses
            : totalWins > 0
              ? Infinity
              : 0;
      });

      return Array.from(quarterlyData.values()).sort(
        (a, b) => a.quarter - b.quarter
      );
    } catch (error) {
      console.error('Error calculating quarterly performance:', error);
      return [];
    }
  }

  
  public async updateYearlyReviewFrontmatter(
    filePath: string,

    updates: Partial<Record<string, any>>
  ): Promise<void> {
    try {
      const file = this.app.vault.getAbstractFileByPath(filePath);

      if (!file || !(file instanceof TFile)) {
        throw new Error(`Yearly Review file not found: ${filePath}`);
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

      await Promise.all([
        forceMetadataCacheRefresh(this.app, file),
        this.clearCache(),
      ]);
      this.yearlyDataCache.clear();

      return;
    } catch (error) {
      console.error(
        `Error updating Yearly Review frontmatter in ${filePath}:`,
        error
      );
      throw error;
    }
  }
}
