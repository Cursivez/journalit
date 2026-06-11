import { logger } from '../../utils/logger';


import { App, TFile, normalizePath, FileView, WorkspaceLeaf } from 'obsidian';
import type JournalitPlugin from '../../main';
import type { NavigationSource } from '../../navigation/types';
import { CustomDataService } from '../base/CustomDataService';
import {
  MonthlyReviewFrontmatter,
  WeeklyPerformanceData,
  DemonTrackerEntry,
  WeeklyGamePerformance,
  GradeDistribution,
} from './types';
import type { Trade } from '../../components/dashboard/utils/dataUtils';
import { normalizeTradeExecutionForPeriodAnalytics } from '../trade/core/TradeExecutionAnalytics';
import {
  getQuarterForMonth,
  getQuarterString,
  getWeekNumberForDate,
  getWeekStartDate,
  getWeekStartDaySetting,
  parseLocalDateSafe,
} from '../../utils/dateUtils';
import { getTradingDay } from '../../utils/tradingDayUtils';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import {
  generatePeriodicTag,
  generateContextualTags,
  combineTags,
  PERIODIC_TYPES,
} from '../../utils/tagSchema';
import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import { FolderPathService } from '../core/FolderPathService';
import { parseTradeFinancialFields } from '../../utils/tradeUtils';
import { ReviewTemplateService } from '../templates/ReviewTemplateService';
import { eventBus, ReviewChangedPayload } from '../events';
import { TemplateTransformationService } from '../templates/TemplateTransformationService';

const getPnlContributingTrades = (trades: Trade[]): Trade[] =>
  trades.filter((trade) => isPnlContributingTrade(trade as Trade));

const sumEffectivePnL = (trades: Trade[]): number =>
  trades.reduce((sum, trade) => sum + getEffectivePnL(trade), 0);

const VALID_REVIEW_GRADES = new Set(['A', 'B', 'C']);

export class MonthlyReviewService extends CustomDataService {
  private folderPathService: FolderPathService | null = null;

  private lastCacheClear: number = 0;
  private monthlyDataCache: Map<string, { data: unknown; timestamp: number }> =
    new Map();

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
      namespace: 'monthly-reviews', 
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
        if (payload.type === 'monthly' && payload.action === 'opened') {
          
          
          const now = Date.now();
          if (!this.lastCacheClear || now - this.lastCacheClear > 5000) {
            await this.clearCache();
            this.monthlyDataCache.clear(); 
            this.lastCacheClear = now;
          }
        }
      }
    );

    eventBus.subscribe(
      'settings:changed',
      (payload?: { section?: string; source?: string }) => {
        if (payload?.section === 'trade' || payload?.source === 'week-start') {
          void this.clearCache();
          this.monthlyDataCache.clear();
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
  protected defaultFrontmatter(): MonthlyReviewFrontmatter {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return {
      type: 'monthly-review',
      date: `${year}-${month}-${day}`,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      reviewQuestions: {},
      monthlyGoals: [],
      keyFocusAreas: [],
      biggestAccomplishment: '',
      biggestChallenge: '',
      lessonsLearned: [],
      nextMonthGoals: [],
      areasOfImprovement: [],
    };
  }

  protected getCacheNamespace(): string {
    return 'monthly-reviews';
  }

  protected isValidType(frontmatter: Record<string, unknown>): boolean {
    return frontmatter?.type === 'monthly-review';
  }

  
  async clearCache(): Promise<void> {
    await super.clearCache();
    this.monthlyDataCache.clear();
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

  
  getMonthlyReviewPath(date: Date): string {
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

    
    const journalPath = this.getJournalFolderPath();
    const month = monthNum.toString().padStart(2, '0');
    const quarterStr = getQuarterString(getQuarterForMonth(monthNum));
    return normalizePath(
      `${journalPath}/${year}/${quarterStr}/${month}/${month}-Review.md`
    );
  }

  
  private formatDateForDisplay(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  
  async createMonthlyReview(date: Date): Promise<TFile | null> {
    const filePath = this.getMonthlyReviewPath(date);

    
    const existingFile = this.app.vault.getAbstractFileByPath(filePath);
    if (existingFile instanceof TFile) {
      return existingFile;
    }

    
    await this.ensureDirectoryExists(filePath);

    
    
    const frontmatter: MonthlyReviewFrontmatter = {
      ...this.defaultFrontmatter(),
      date: this.formatDateForDisplay(date),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };

    
    const content = this.generateInitialContent(frontmatter);

    
    try {
      const file = await this.app.vault.create(filePath, content);
      return file;
    } catch (error) {
      console.error('Error creating monthly review:', error);
      return null;
    }
  }

  
  public async openMonthlyReview(
    date: Date,
    createNewLeaf: boolean = true,
    focusLeaf: boolean = true,
    source: NavigationSource = 'standard'
  ): Promise<void> {
    
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date passed to openMonthlyReview:', date);
      return;
    }

    try {
      
      const targetMonth = date.getMonth() + 1; 
      const targetYear = date.getFullYear();

      
      let existingMonthlyLeaf: WorkspaceLeaf | null = null;

      this.app.workspace.iterateAllLeaves((leaf) => {
        if (leaf.view instanceof FileView && leaf.view.file) {
          const file = leaf.view.file;

          
          const frontmatter =
            this.app.metadataCache.getFileCache(file)?.frontmatter;

          if (
            frontmatter?.type === 'monthly-review' &&
            Number(frontmatter?.month) === targetMonth &&
            Number(frontmatter?.year) === targetYear
          ) {
            existingMonthlyLeaf = leaf; 
          }
        }
      });

      
      if (existingMonthlyLeaf) {
        this.app.workspace.revealLeaf(existingMonthlyLeaf);
        this.app.workspace.setActiveLeaf(existingMonthlyLeaf, {
          focus: focusLeaf,
        });
        return;
      }

      
      const monthlyReviewPath = this.getMonthlyReviewPath(date);

      
      const exists = await this.app.vault.adapter.exists(monthlyReviewPath);

      if (exists) {
        
        await this.getPlugin().openFile(
          monthlyReviewPath,
          createNewLeaf,
          focusLeaf,
          source
        );
      } else {
        
        const monthlyReview = await this.createMonthlyReview(date);
        if (monthlyReview) {
          await this.getPlugin().openFile(
            monthlyReview.path,
            createNewLeaf,
            focusLeaf,
            source
          );
        } else {
          throw new Error(
            `Failed to create monthly review for ${date.toDateString()}. Check console for details.`
          );
        }
      }
    } catch (error) {
      console.error(
        `Failed to open monthly review for date ${date.toDateString()}:`,
        error
      );
      throw error;
    }
  }

  
  private generateMonthlyReviewTags(month: number, year: number): string[] {
    const tagArrays: string[][] = [];

    
    const monthDate = new Date(year, month - 1, 1);

    
    tagArrays.push([generatePeriodicTag(PERIODIC_TYPES.MONTHLY)]);

    
    const contextualTags = generateContextualTags(monthDate);
    if (contextualTags.length > 0) {
      tagArrays.push(contextualTags);
    }

    
    const quarter = Math.ceil(month / 3);
    tagArrays.push([`q${quarter}-review`]);

    
    if (month === 1) {
      tagArrays.push(['year-start']);
    } else if (month === 12) {
      tagArrays.push(['year-end']);
    }

    
    return combineTags(...tagArrays);
  }

  
  private generateInitialContent(
    frontmatter: MonthlyReviewFrontmatter
  ): string {
    const tags = this.generateMonthlyReviewTags(
      frontmatter.month,
      frontmatter.year
    );

    
    const monthlyData: Record<string, unknown> = {
      type: frontmatter.type,
      date: frontmatter.date,
      month: frontmatter.month,
      year: frontmatter.year,
      tags: tags,
    };

    
    const { templateService, transformService } = this.getTemplateServices();
    const template = templateService.getDefaultTemplate('monthly');

    
    monthlyData.templateId = template.id;
    monthlyData.templateVersion = template.version;

    
    return transformService.generateNoteFromTemplate(template, monthlyData);
  }

  
  async getMonthlyTrades(year: number, month: number): Promise<Trade[]> {
    try {
      
      const endDate = new Date(year, month, 0); 
      endDate.setHours(23, 59, 59, 999);

      
      
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

            
            if (
              tradingDay.getFullYear() === year &&
              tradingDay.getMonth() + 1 === month
            ) {
              
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
                exits?: Array<{ time: Date; price: number; size: number }>;
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
      console.error('Error getting monthly trades:', error);
      return [];
    }
  }

  
  async getWeeklyPerformance(
    year: number,
    month: number
  ): Promise<WeeklyPerformanceData[]> {
    try {
      const trades = await this.getMonthlyTrades(year, month);
      if (trades.length === 0) {
        logger.debug(
          `No trades found for ${year}-${String(month).padStart(2, '0')}`
        );
        return [];
      }

      const weeklyData = new Map<number, WeeklyPerformanceData>();

      
      const weeklyService = this.getPlugin()?.serviceManager
        ? await this.getPlugin().serviceManager.getWeeklyReviewService()
        : this.getPlugin()?.weeklyReviewService;

      const weekStartDay = getWeekStartDaySetting(this.getPlugin());
      const pnlContributingTrades = getPnlContributingTrades(trades);

      
      pnlContributingTrades.forEach((trade: Trade) => {
        const tradeDate = new Date(trade.entryTime);
        const weekStart = getWeekStartDate(tradeDate, weekStartDay);
        const weekNumber = getWeekNumberForDate(tradeDate, weekStartDay);

        
        if (tradeDate.getMonth() + 1 !== month) return;

        if (!weeklyData.has(weekNumber)) {
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);

          
          let weeklyReviewPath: string | undefined;
          if (weeklyService) {
            weeklyReviewPath = weeklyService.getWeeklyReviewPath(weekStart);
          }

          weeklyData.set(weekNumber, {
            weekNumber,
            weekStartDate: weekStart,
            weekEndDate: weekEnd,
            trades: 0,
            winRate: 0,
            profitFactor: 0,
            pnl: 0,
            weeklyReviewPath,
          });
        }

        const weekStats = weeklyData.get(weekNumber)!;
        weekStats.trades++;
        weekStats.pnl += getEffectivePnL(trade);
      });

      
      weeklyData.forEach((weekStats, weekNumber) => {
        const weekTrades = pnlContributingTrades.filter((trade) => {
          const tradeDate = new Date(trade.entryTime);
          return (
            this.getWeekNumber(tradeDate) === weekNumber &&
            tradeDate.getMonth() + 1 === month
          );
        });

        const pnlContributingWeekTrades = getPnlContributingTrades(weekTrades);
        const winningTrades = pnlContributingWeekTrades.filter(
          (t) => getEffectivePnL(t) > 0
        );
        const losingTrades = pnlContributingWeekTrades.filter(
          (t) => getEffectivePnL(t) < 0
        );

        weekStats.winRate = calculateWinRateExcludingBreakeven(
          winningTrades.length,
          losingTrades.length
        );

        const totalWins = sumEffectivePnL(winningTrades);
        const totalLosses = Math.abs(sumEffectivePnL(losingTrades));

        weekStats.profitFactor =
          totalLosses > 0
            ? totalWins / totalLosses
            : totalWins > 0
              ? Infinity
              : 0;
      });

      
      return Array.from(weeklyData.values()).sort(
        (a, b) => a.weekNumber - b.weekNumber
      );
    } catch (error) {
      console.error('Error getting weekly performance:', error);
      return [];
    }
  }

  
  private getWeekNumber(date: Date): number {
    const weekStartDay = getWeekStartDaySetting(this.getPlugin());
    return getWeekNumberForDate(date, weekStartDay);
  }

  
  async getDemonTrackerData(
    year: number,
    month: number
  ): Promise<DemonTrackerEntry[]> {
    try {
      
      let drcService = this.getPlugin()?.drcService;
      if (!drcService && this.getPlugin()?.serviceManager) {
        try {
          drcService = await this.getPlugin().serviceManager.getDRCService();
        } catch (serviceError) {
          console.warn('Could not get DRC service:', serviceError);
        }
      }

      if (!drcService) {
        logger.debug('DRC service not available for demon tracker data');
        return [];
      }

      
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); 

      const mistakeMap = new Map<string, DemonTrackerEntry>();
      const monthDates: Date[] = [];
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        monthDates.push(new Date(date));
      }

      const dailyMistakes = await Promise.all(
        monthDates.map(async (date) => {
          const drcPath = drcService.getDRCNotePath(date);
          const file = this.app.vault.getAbstractFileByPath(drcPath);

          if (!(file instanceof TFile)) {
            return [];
          }

          const cache = this.app.metadataCache.getFileCache(file);
          const drcData = cache?.frontmatter;
          if (!drcData || drcData.type !== 'drc') {
            return [];
          }

          const tradeService = this.getPlugin()?.tradeService;
          if (!tradeService) {
            return [];
          }

          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          const tradeFiles = await tradeService.getTrades(startOfDay, endOfDay);
          const dayTrades = await Promise.all(
            tradeFiles.map((tradeFile) =>
              tradeService.extractTradeData(tradeFile)
            )
          );

          const mistakes: Array<{ mistake: string; date: string }> = [];
          dayTrades.forEach((trade) => {
            if (trade?.mistake && Array.isArray(trade.mistake)) {
              trade.mistake.forEach((mistake: string) => {
                mistakes.push({ mistake, date: date.toISOString() });
              });
            }
          });
          return mistakes;
        })
      );

      dailyMistakes.forEach((mistakes) => {
        mistakes.forEach(({ mistake, date }) => {
          if (!mistakeMap.has(mistake)) {
            mistakeMap.set(mistake, {
              mistake,
              occurrences: 0,
              dates: [],
            });
          }

          const entry = mistakeMap.get(mistake)!;
          entry.occurrences++;
          entry.dates.push(date);
        });
      });

      
      return Array.from(mistakeMap.values()).sort(
        (a, b) => b.occurrences - a.occurrences
      );
    } catch (error) {
      console.error('Error getting demon tracker data:', error);
      return [];
    }
  }

  
  async getAdjacentMonthlyReview(
    currentDate: Date,
    offset: number,
    autoCreate: boolean = true
  ): Promise<string | null> {
    const targetDate = new Date(currentDate);
    targetDate.setMonth(targetDate.getMonth() + offset);

    const path = this.getMonthlyReviewPath(targetDate);
    const file = this.app.vault.getAbstractFileByPath(path);

    if (file instanceof TFile) {
      return path;
    }

    
    const settings = this.getPlugin()?.settings;
    if (autoCreate && settings?.monthly?.autoCreateMonthlyReviewOnNavigation) {
      const newFile = await this.createMonthlyReview(targetDate);
      return newFile ? newFile.path : null;
    }

    return null;
  }

  
  async getBestPerformingWeek(
    year: number,
    month: number
  ): Promise<WeeklyPerformanceData | null> {
    const weeklyPerformance = await this.getWeeklyPerformance(year, month);
    if (weeklyPerformance.length === 0) return null;

    return weeklyPerformance.reduce((best, current) =>
      current.pnl > best.pnl ? current : best
    );
  }

  
  async getWorstPerformingWeek(
    year: number,
    month: number
  ): Promise<WeeklyPerformanceData | null> {
    const weeklyPerformance = await this.getWeeklyPerformance(year, month);
    if (weeklyPerformance.length === 0) return null;

    return weeklyPerformance.reduce((worst, current) =>
      current.pnl < worst.pnl ? current : worst
    );
  }

  
  async getWeeklyGamePerformance(
    year: number,
    month: number
  ): Promise<WeeklyGamePerformance[]> {
    try {
      
      const weeklyPerformance = await this.getWeeklyPerformance(year, month);

      
      const weeklyService = this.getPlugin()?.serviceManager
        ? await this.getPlugin().serviceManager.getWeeklyReviewService()
        : this.getPlugin()?.weeklyReviewService;

      const drcService = this.getPlugin()?.serviceManager
        ? await this.getPlugin().serviceManager.getDRCService()
        : this.getPlugin()?.drcService;

      if (!weeklyService || !drcService) {
        console.warn(
          'Weekly or DRC service not available for game performance data'
        );
        return [];
      }

      
      const gamePerformanceData = await Promise.all(
        weeklyPerformance.map(async (week) => {
          
          const mentalGradeDistribution: GradeDistribution = {
            A: 0,
            B: 0,
            C: 0,
          };
          const technicalGradeDistribution: GradeDistribution = {
            A: 0,
            B: 0,
            C: 0,
          };

          
          const drcs = await weeklyService.getDRCsForWeek(week.weekStartDate);

          
          for (const { data: drcData } of drcs) {
            const drcDate = parseLocalDateSafe(drcData.date);
            if (!drcDate) continue; 

            
            if (
              drcDate.getMonth() + 1 === month &&
              drcDate.getFullYear() === year
            ) {
              
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

          
          let mentalRating: number | undefined;
          let technicalRating: number | undefined;
          let mentalNotes: string | undefined;
          let technicalNotes: string | undefined;

          if (week.weeklyReviewPath) {
            const weeklyFile = this.app.vault.getAbstractFileByPath(
              week.weeklyReviewPath
            );
            if (weeklyFile instanceof TFile) {
              const weeklyData =
                await weeklyService.extractWeeklyReviewData(weeklyFile);
              if (weeklyData) {
                mentalRating = weeklyData.mentalGrade;
                technicalRating = weeklyData.technicalGrade;
                mentalNotes = weeklyData.mentalNotes;
                technicalNotes = weeklyData.technicalNotes;
              }
            }
          }

          return {
            weekNumber: week.weekNumber,
            weekStartDate: week.weekStartDate,
            weekEndDate: week.weekEndDate,
            weeklyReviewPath: week.weeklyReviewPath,
            mentalGradeDistribution,
            technicalGradeDistribution,
            mentalRating,
            technicalRating,
            mentalNotes,
            technicalNotes,
          };
        })
      );

      return gamePerformanceData;
    } catch (error) {
      console.error('Error getting weekly game performance:', error);
      return [];
    }
  }

  
  async getMonthlyDataOptimized(
    year: number,
    month: number
  ): Promise<{
    trades: Trade[];
    weeklyPerformance: WeeklyPerformanceData[];
    weeklyGamePerformance: WeeklyGamePerformance[];
    demonTrackerData: DemonTrackerEntry[];
    bestWeek: WeeklyPerformanceData | null;
    worstWeek: WeeklyPerformanceData | null;
  }> {
    
    const cacheKey = `${year}-${month}`;
    const cached = this.monthlyDataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      
      return cached.data as {
        trades: Trade[];
        weeklyPerformance: WeeklyPerformanceData[];
        weeklyGamePerformance: WeeklyGamePerformance[];
        demonTrackerData: DemonTrackerEntry[];
        bestWeek: WeeklyPerformanceData | null;
        worstWeek: WeeklyPerformanceData | null;
      };
    }

    try {
      
      const trades = await this.getMonthlyTradesOptimized(year, month);

      
      const weeklyPerformance = await this.calculateWeeklyPerformance(
        trades,
        year,
        month
      );

      
      const demonTrackerData = this.getDemonTrackerDataFromTrades(trades);
      const weeklyGamePerformance =
        await this.getWeeklyGamePerformanceOptimized(
          weeklyPerformance,
          year,
          month
        );

      
      const bestWeek =
        weeklyPerformance.length > 0
          ? weeklyPerformance.reduce((best, current) =>
              current.pnl > best.pnl ? current : best
            )
          : null;

      const worstWeek =
        weeklyPerformance.length > 0
          ? weeklyPerformance.reduce((worst, current) =>
              current.pnl < worst.pnl ? current : worst
            )
          : null;

      const result = {
        trades,
        weeklyPerformance,
        weeklyGamePerformance,
        demonTrackerData,
        bestWeek,
        worstWeek,
      };

      
      this.monthlyDataCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      console.error('Error getting optimized monthly data:', error);
      return {
        trades: [],
        weeklyPerformance: [],
        weeklyGamePerformance: [],
        demonTrackerData: [],
        bestWeek: null,
        worstWeek: null,
      };
    }
  }

  
  private async getMonthlyTradesOptimized(
    year: number,
    month: number
  ): Promise<Trade[]> {
    try {
      const trades: Trade[] = [];

      
      const monthPath = `${this.getJournalFolderPath()}/${year}/${String(month).padStart(2, '0')}`;
      const files = this.app.vault
        .getMarkdownFiles()
        .filter(
          (file) =>
            file.path.startsWith(monthPath) && file.path.includes('/trades/')
        );

      
      const batchSize = 20;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const batchPromises = batch.map(async (file) => {
          try {
            const cache = this.app.metadataCache.getFileCache(file);
            const frontmatter = cache?.frontmatter;

            if (
              frontmatter?.type === 'trade' ||
              frontmatter?.type === 'backtest-trade'
            ) {
              const normalizedExecution =
                normalizeTradeExecutionForPeriodAnalytics(frontmatter);
              if (!normalizedExecution) return null;
              const entryTime = normalizedExecution.entryTime;

              const tradingDay = getTradingDay(entryTime, this.plugin);

              if (
                tradingDay.getFullYear() === year &&
                tradingDay.getMonth() + 1 === month
              ) {
                
                const originalPnlWasNull =
                  frontmatter.pnl === undefined || frontmatter.pnl === null;

                return {
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
                  exits?: Array<{ time: Date; price: number; size: number }>;
                  _originalPnlWasNull?: boolean;
                };
              }
            }
            return null;
          } catch (error) {
            console.warn(`Error processing trade file ${file.path}:`, error);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        trades.push(
          ...(batchResults.filter((trade) => trade !== null) as Trade[])
        );
      }

      return trades;
    } catch (error) {
      console.error('Error getting optimized monthly trades:', error);
      return [];
    }
  }

  
  private async calculateWeeklyPerformance(
    trades: Trade[],
    _year: number,
    month: number
  ): Promise<WeeklyPerformanceData[]> {
    try {
      if (trades.length === 0) {
        return [];
      }

      const weeklyData = new Map<number, WeeklyPerformanceData>();

      
      const weeklyService = this.getPlugin()?.serviceManager
        ? await this.getPlugin().serviceManager.getWeeklyReviewService()
        : this.getPlugin()?.weeklyReviewService;

      const weekStartDay = getWeekStartDaySetting(this.getPlugin());
      const pnlContributingTrades = getPnlContributingTrades(trades);

      
      pnlContributingTrades.forEach((trade: Trade) => {
        const tradeDate = new Date(trade.entryTime);
        const weekStart = getWeekStartDate(tradeDate, weekStartDay);
        const weekNumber = getWeekNumberForDate(tradeDate, weekStartDay);

        
        if (tradeDate.getMonth() + 1 !== month) return;

        if (!weeklyData.has(weekNumber)) {
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);

          let weeklyReviewPath: string | undefined;
          if (weeklyService) {
            weeklyReviewPath = weeklyService.getWeeklyReviewPath(weekStart);
          }

          weeklyData.set(weekNumber, {
            weekNumber,
            weekStartDate: weekStart,
            weekEndDate: weekEnd,
            trades: 0,
            winRate: 0,
            profitFactor: 0,
            pnl: 0,
            weeklyReviewPath,
          });
        }

        const weekStats = weeklyData.get(weekNumber)!;
        weekStats.trades++;
        weekStats.pnl += getEffectivePnL(trade);
      });

      
      weeklyData.forEach((weekStats, weekNumber) => {
        const weekTrades = pnlContributingTrades.filter((trade) => {
          const tradeDate = new Date(trade.entryTime);
          return (
            this.getWeekNumber(tradeDate) === weekNumber &&
            tradeDate.getMonth() + 1 === month
          );
        });

        const pnlContributingWeekTrades = getPnlContributingTrades(weekTrades);
        const winningTrades = pnlContributingWeekTrades.filter(
          (t) => getEffectivePnL(t) > 0
        );
        const losingTrades = pnlContributingWeekTrades.filter(
          (t) => getEffectivePnL(t) < 0
        );

        weekStats.winRate = calculateWinRateExcludingBreakeven(
          winningTrades.length,
          losingTrades.length
        );

        const totalWins = sumEffectivePnL(winningTrades);
        const totalLosses = Math.abs(sumEffectivePnL(losingTrades));

        weekStats.profitFactor =
          totalLosses > 0
            ? totalWins / totalLosses
            : totalWins > 0
              ? Infinity
              : 0;
      });

      return Array.from(weeklyData.values()).sort(
        (a, b) => a.weekNumber - b.weekNumber
      );
    } catch (error) {
      console.error('Error calculating weekly performance:', error);
      return [];
    }
  }

  
  private async getWeeklyGamePerformanceOptimized(
    weeklyPerformance: WeeklyPerformanceData[],
    year: number,
    month: number
  ): Promise<WeeklyGamePerformance[]> {
    try {
      
      const weeklyService = this.getPlugin()?.serviceManager
        ? await this.getPlugin().serviceManager.getWeeklyReviewService()
        : this.getPlugin()?.weeklyReviewService;

      const drcService = this.getPlugin()?.serviceManager
        ? await this.getPlugin().serviceManager.getDRCService()
        : this.getPlugin()?.drcService;

      if (!weeklyService || !drcService) {
        return [];
      }

      
      const gamePerformancePromises = weeklyPerformance.map(async (week) => {
        
        const mentalGradeDistribution: GradeDistribution = { A: 0, B: 0, C: 0 };
        const technicalGradeDistribution: GradeDistribution = {
          A: 0,
          B: 0,
          C: 0,
        };

        
        const drcs = await weeklyService.getDRCsForWeek(week.weekStartDate);

        
        for (const { data: drcData } of drcs) {
          const drcDate = parseLocalDateSafe(drcData.date);
          if (!drcDate) continue; 

          
          if (
            drcDate.getMonth() + 1 === month &&
            drcDate.getFullYear() === year
          ) {
            
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

        
        let mentalRating: number | undefined;
        let technicalRating: number | undefined;
        let mentalNotes: string | undefined;
        let technicalNotes: string | undefined;

        if (week.weeklyReviewPath) {
          const weeklyFile = this.app.vault.getAbstractFileByPath(
            week.weeklyReviewPath
          );
          if (weeklyFile instanceof TFile) {
            const weeklyData =
              await weeklyService.extractWeeklyReviewData(weeklyFile);
            if (weeklyData) {
              mentalRating = weeklyData.mentalGrade;
              technicalRating = weeklyData.technicalGrade;
              mentalNotes = weeklyData.mentalNotes;
              technicalNotes = weeklyData.technicalNotes;
            }
          }
        }

        return {
          weekNumber: week.weekNumber,
          weekStartDate: week.weekStartDate,
          weekEndDate: week.weekEndDate,
          weeklyReviewPath: week.weeklyReviewPath,
          mentalGradeDistribution,
          technicalGradeDistribution,
          mentalRating,
          technicalRating,
          mentalNotes,
          technicalNotes,
        };
      });

      return await Promise.all(gamePerformancePromises);
    } catch (error) {
      console.error('Error getting optimized weekly game performance:', error);
      return [];
    }
  }

  
  private getDemonTrackerDataFromTrades(trades: Trade[]): DemonTrackerEntry[] {
    try {
      const mistakeMap = new Map<string, DemonTrackerEntry>();

      
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
    } catch (error) {
      console.error('Error processing demon tracker data from trades:', error);
      return [];
    }
  }

  
  public async updateMonthlyReviewFrontmatter(
    filePath: string,
    updates: Partial<Record<string, unknown>>
  ): Promise<void> {
    try {
      
      const file = this.app.vault.getAbstractFileByPath(filePath);

      if (!file || !(file instanceof TFile)) {
        throw new Error(`Monthly Review file not found: ${filePath}`);
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
      this.monthlyDataCache.clear();

      return;
    } catch (error) {
      console.error(
        `Error updating Monthly Review frontmatter in ${filePath}:`,
        error
      );
      throw error;
    }
  }
}
