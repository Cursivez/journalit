

import { App, TFile, normalizePath, FileView, WorkspaceLeaf } from 'obsidian';
import {
  CustomDataService,
  CustomDataServiceConfig,
} from '../base/CustomDataService';
import type JournalitPlugin from '../../main';
import type { NavigationSource } from '../../navigation/types';
import {
  QuarterlyReviewFrontmatter,
  MonthlyPerformanceData,
  QuarterlyDemonTrackerEntry,
  MonthlyGamePerformance,
  GradeDistribution,
} from './types';
import type { Trade } from '../../components/dashboard/utils/dataUtils';
import { normalizeTradeExecutionForPeriodAnalytics } from '../trade/core/TradeExecutionAnalytics';

import { getTradingDay } from '../../utils/tradingDayUtils';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';

import { FolderPathService } from '../core/FolderPathService';
import { parseTradeFinancialFields } from '../../utils/tradeUtils';
import { ReviewTemplateService } from '../templates/ReviewTemplateService';
import { eventBus, ReviewChangedPayload } from '../events';
import { TemplateTransformationService } from '../templates/TemplateTransformationService';
import {
  getQuarterForMonth,
  getMonthsInQuarter,
  getQuarterStartDate,
  getQuarterEndDate,
  getQuarterString,
} from '../../utils/dateUtils';
import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';

const getPnlContributingTrades = (trades: Trade[]): Trade[] =>
  trades.filter((trade) => isPnlContributingTrade(trade));

const sumEffectivePnL = (trades: Trade[]): number =>
  trades.reduce((sum, trade) => sum + getEffectivePnL(trade), 0);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function getStringValue(
  record: Record<string, unknown>,
  key: string
): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

function getNumberValue(
  record: Record<string, unknown>,
  key: string
): number | undefined {
  const value = record[key];
  return typeof value === 'number' ? value : undefined;
}

function getBooleanValue(
  record: Record<string, unknown>,
  key: string
): boolean | undefined {
  const value = record[key];
  if (value === 'true') return true;
  if (value === 'false') return false;
  return typeof value === 'boolean' ? value : undefined;
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function getGradeValue(value: unknown): keyof GradeDistribution | undefined {
  switch (value) {
    case 'A':
    case 'B':
    case 'C':
      return value;
    default:
      return undefined;
  }
}

function createQuarterlyTradeFromFrontmatter(
  frontmatter: Record<string, unknown>,
  normalizedExecution: ReturnType<
    typeof normalizeTradeExecutionForPeriodAnalytics
  > & {},
  path: string
): Trade {
  const originalPnlWasNull =
    frontmatter.pnl === undefined || frontmatter.pnl === null;

  return {
    instrument:
      getStringValue(frontmatter, 'instrument') ??
      getStringValue(frontmatter, 'ticker'),
    direction:
      getStringValue(frontmatter, 'direction') ??
      getStringValue(frontmatter, 'side') ??
      '',
    ...normalizedExecution,
    pnl: typeof frontmatter.pnl === 'number' ? frontmatter.pnl : 0,
    setup: getStringArray(frontmatter.setup),
    tags: getStringArray(frontmatter.tags),
    mistake: getStringArray(frontmatter.mistake),
    account: Array.isArray(frontmatter.account)
      ? getStringArray(frontmatter.account)
      : typeof frontmatter.account === 'string'
        ? [frontmatter.account]
        : [],
    path,
    tradeStatus: getStringValue(frontmatter, 'tradeStatus'),
    useDirectPnLInput: getBooleanValue(frontmatter, 'useDirectPnLInput'),
    _originalPnlWasNull: originalPnlWasNull,
    ...parseTradeFinancialFields(frontmatter),
  };
}

interface QuarterlyDataResult {
  trades: Trade[];
  monthlyPerformance: MonthlyPerformanceData[];
  monthlyGamePerformance: MonthlyGamePerformance[];
  demonTrackerData: QuarterlyDemonTrackerEntry[];
  bestMonth: MonthlyPerformanceData | null;
  worstMonth: MonthlyPerformanceData | null;
}

export class QuarterlyReviewService extends CustomDataService {
  private folderPathService: FolderPathService | null = null;

  private lastCacheClear: number = 0;
  private quarterlyDataCache: Map<
    string,
    { timestamp: number; data: QuarterlyDataResult }
  > = new Map();

  private templateService: ReviewTemplateService | null = null;
  private transformService: TemplateTransformationService | null = null;

  constructor(
    app: App,
    plugin: JournalitPlugin,
    folderPathService?: FolderPathService,
    config: CustomDataServiceConfig = {}
  ) {
    super(app, {
      ...config,
      namespace: 'quarterly-reviews',
      cacheTTL: 5 * 60 * 1000, 
      persistCache: true,
    });
    this.setPlugin(plugin);
    this.folderPathService = folderPathService || null;

    
    if (!this.folderPathService) {
      void this.initializeFolderPathService();
    }

    
    eventBus.subscribe(
      'review:changed',
      async (payload: ReviewChangedPayload) => {
        if (payload.type === 'quarterly' && payload.action === 'opened') {
          const now = Date.now();
          if (!this.lastCacheClear || now - this.lastCacheClear > 5000) {
            await this.clearCache();
            this.quarterlyDataCache.clear();
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
          this.getPlugin().serviceManager.getFolderPathService();
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

  protected defaultFrontmatter(): QuarterlyReviewFrontmatter {
    const now = new Date();
    return {
      type: 'quarterly-review',
      date: now.toISOString(),
      quarter: getQuarterForMonth(now.getMonth() + 1),
      year: now.getFullYear(),
      reviewQuestions: {},
      quarterlyGoals: [],
      keyFocusAreas: [],
      biggestAccomplishment: '',
      biggestChallenge: '',
      lessonsLearned: [],
      nextQuarterGoals: [],
      areasOfImprovement: [],
    };
  }

  protected getCacheNamespace(): string {
    return 'quarterly-reviews';
  }

  protected isValidType(frontmatter: unknown): boolean {
    return asRecord(frontmatter)?.type === 'quarterly-review';
  }

  
  async clearCache(): Promise<void> {
    await super.clearCache();
    this.quarterlyDataCache.clear();
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

  
  async getQuarterlyReviewPath(date: Date): Promise<string> {
    const year = date.getFullYear();
    const quarter = getQuarterForMonth(date.getMonth() + 1);
    const quarterStr = getQuarterString(quarter);

    
    if (!this.folderPathService) {
      await this.initializeFolderPathService();
    }

    if (this.folderPathService) {
      return this.folderPathService.getQuarterlyReviewPath(year, quarter);
    }

    const journalPath = this.getJournalFolderPath();
    return normalizePath(
      `${journalPath}/${year}/${quarterStr}/${quarterStr}-Review.md`
    );
  }

  
  private formatDateForDisplay(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  
  async createQuarterlyReview(date: Date): Promise<TFile | null> {
    const filePath = await this.getQuarterlyReviewPath(date);

    
    const existingFile = this.app.vault.getAbstractFileByPath(filePath);
    if (existingFile instanceof TFile) {
      return existingFile;
    }

    
    await this.ensureDirectoryExists(filePath);

    
    
    const quarter = getQuarterForMonth(date.getMonth() + 1);
    const frontmatter: QuarterlyReviewFrontmatter = {
      ...this.defaultFrontmatter(),
      date: this.formatDateForDisplay(date),
      quarter: quarter,
      year: date.getFullYear(),
    };

    
    const content = this.generateInitialContent(frontmatter);

    
    try {
      const file = await this.app.vault.create(filePath, content);
      return file;
    } catch (error) {
      console.error('Error creating quarterly review:', error);
      return null;
    }
  }

  
  public async openQuarterlyReview(
    date: Date,
    createNewLeaf: boolean = true,
    focusLeaf: boolean = true,
    source: NavigationSource = 'standard'
  ): Promise<void> {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date passed to openQuarterlyReview:', date);
      return;
    }

    try {
      const targetQuarter = getQuarterForMonth(date.getMonth() + 1);
      const targetYear = date.getFullYear();

      
      let existingQuarterlyLeaf: WorkspaceLeaf | null = null;

      this.app.workspace.iterateAllLeaves((leaf) => {
        if (leaf.view instanceof FileView && leaf.view.file) {
          const file = leaf.view.file;
          const frontmatter =
            this.app.metadataCache.getFileCache(file)?.frontmatter;

          if (
            frontmatter?.type === 'quarterly-review' &&
            Number(frontmatter?.quarter) === targetQuarter &&
            Number(frontmatter?.year) === targetYear
          ) {
            existingQuarterlyLeaf = leaf;
          }
        }
      });

      if (existingQuarterlyLeaf) {
        void this.app.workspace.revealLeaf(existingQuarterlyLeaf);
        this.app.workspace.setActiveLeaf(existingQuarterlyLeaf, {
          focus: focusLeaf,
        });
        return;
      }

      const quarterlyReviewPath = await this.getQuarterlyReviewPath(date);
      const exists = await this.app.vault.adapter.exists(quarterlyReviewPath);

      if (exists) {
        await this.getPlugin().openFile(
          quarterlyReviewPath,
          createNewLeaf,
          focusLeaf,
          source
        );
      } else {
        const quarterlyReview = await this.createQuarterlyReview(date);
        if (quarterlyReview) {
          await this.getPlugin().openFile(
            quarterlyReview.path,
            createNewLeaf,
            focusLeaf,
            source
          );
        } else {
          throw new Error(
            `Failed to create quarterly review for ${date.toDateString()}`
          );
        }
      }
    } catch (error) {
      console.error(
        `Failed to open quarterly review for date ${date.toDateString()}:`,
        error
      );
      throw error;
    }
  }

  
  private generateInitialContent(
    frontmatter: QuarterlyReviewFrontmatter
  ): string {
    
    const quarterlyData: Record<string, unknown> = {
      type: frontmatter.type,
      date: frontmatter.date,
      quarter: frontmatter.quarter,
      year: frontmatter.year,
      tags: [],
    };

    const { templateService, transformService } = this.getTemplateServices();
    const template = templateService.getDefaultTemplate('quarterly');

    quarterlyData.templateId = template.id;
    quarterlyData.templateVersion = template.version;

    return transformService.generateNoteFromTemplate(template, quarterlyData);
  }

  
  async getQuarterlyTrades(year: number, quarter: number): Promise<Trade[]> {
    try {
      const endDate = getQuarterEndDate(year, quarter);
      endDate.setHours(23, 59, 59, 999);

      const trades: Trade[] = [];
      const files = this.app.vault.getMarkdownFiles();

      for (const file of files) {
        try {
          const cache = this.app.metadataCache.getFileCache(file);
          const frontmatter = asRecord(cache?.frontmatter);

          if (
            frontmatter?.type === 'trade' ||
            frontmatter?.type === 'backtest-trade'
          ) {
            const normalizedExecution =
              normalizeTradeExecutionForPeriodAnalytics(frontmatter);
            if (!normalizedExecution) continue;
            const entryTime = normalizedExecution.entryTime;

            const tradingDay = getTradingDay(entryTime, this.plugin);

            
            const tradeQuarter = getQuarterForMonth(tradingDay.getMonth() + 1);
            if (tradingDay.getFullYear() === year && tradeQuarter === quarter) {
              trades.push(
                createQuarterlyTradeFromFrontmatter(
                  frontmatter,
                  normalizedExecution,
                  file.path
                )
              );
            }
          }
        } catch (fileError) {
          console.warn(`Error processing trade file ${file.path}:`, fileError);
          continue;
        }
      }

      return trades;
    } catch (error) {
      console.error('Error getting quarterly trades:', error);
      return [];
    }
  }

  
  async getMonthlyPerformance(
    year: number,
    quarter: number
  ): Promise<MonthlyPerformanceData[]> {
    try {
      const trades = await this.getQuarterlyTrades(year, quarter);
      if (trades.length === 0) {
        return [];
      }

      const monthlyData = new Map<number, MonthlyPerformanceData>();
      const monthsInQuarter = getMonthsInQuarter(quarter);

      
      const monthlyService = this.getPlugin()?.serviceManager
        ? await this.getPlugin().serviceManager.getMonthlyReviewService()
        : null;

      
      for (const month of monthsInQuarter) {
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0);

        let monthlyReviewPath: string | undefined;
        if (monthlyService) {
          monthlyReviewPath = monthlyService.getMonthlyReviewPath(monthStart);
        }

        monthlyData.set(month, {
          month,
          monthStartDate: monthStart,
          monthEndDate: monthEnd,
          trades: 0,
          winRate: 0,
          profitFactor: 0,
          pnl: 0,
          monthlyReviewPath,
        });
      }

      const pnlContributingTrades = getPnlContributingTrades(trades);

      
      pnlContributingTrades.forEach((trade: Trade) => {
        const tradeDate = new Date(trade.entryTime);
        const tradeMonth = tradeDate.getMonth() + 1;

        if (monthlyData.has(tradeMonth)) {
          const monthStats = monthlyData.get(tradeMonth)!;
          monthStats.trades++;
          monthStats.pnl += getEffectivePnL(trade);
        }
      });

      
      monthlyData.forEach((monthStats, month) => {
        const monthTrades = pnlContributingTrades.filter((trade) => {
          const tradeDate = new Date(trade.entryTime);
          return tradeDate.getMonth() + 1 === month;
        });

        const pnlContributingMonthTrades =
          getPnlContributingTrades(monthTrades);
        const winningTrades = pnlContributingMonthTrades.filter(
          (t) => getEffectivePnL(t) > 0
        );
        const losingTrades = pnlContributingMonthTrades.filter(
          (t) => getEffectivePnL(t) < 0
        );

        monthStats.winRate = calculateWinRateExcludingBreakeven(
          winningTrades.length,
          losingTrades.length
        );

        const totalWins = sumEffectivePnL(winningTrades);
        const totalLosses = Math.abs(sumEffectivePnL(losingTrades));

        monthStats.profitFactor =
          totalLosses > 0
            ? totalWins / totalLosses
            : totalWins > 0
              ? Infinity
              : 0;
      });

      return Array.from(monthlyData.values()).sort((a, b) => a.month - b.month);
    } catch (error) {
      console.error('Error getting monthly performance:', error);
      return [];
    }
  }

  
  async getDemonTrackerData(
    year: number,
    quarter: number
  ): Promise<QuarterlyDemonTrackerEntry[]> {
    try {
      const trades = await this.getQuarterlyTrades(year, quarter);
      return this.getDemonTrackerDataFromTrades(trades);
    } catch (error) {
      console.error('Error getting demon tracker data:', error);
      return [];
    }
  }

  
  private getDemonTrackerDataFromTrades(
    trades: Trade[]
  ): QuarterlyDemonTrackerEntry[] {
    const mistakeMap = new Map<string, QuarterlyDemonTrackerEntry>();

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

  
  async getAdjacentQuarterlyReview(
    currentDate: Date,
    offset: number,
    autoCreate: boolean = true
  ): Promise<string | null> {
    const currentQuarter = getQuarterForMonth(currentDate.getMonth() + 1);
    const currentYear = currentDate.getFullYear();

    
    let targetQuarter = currentQuarter + offset;
    let targetYear = currentYear;

    while (targetQuarter < 1) {
      targetQuarter += 4;
      targetYear--;
    }
    while (targetQuarter > 4) {
      targetQuarter -= 4;
      targetYear++;
    }

    const targetDate = getQuarterStartDate(targetYear, targetQuarter);
    const path = await this.getQuarterlyReviewPath(targetDate);
    const file = this.app.vault.getAbstractFileByPath(path);

    if (file instanceof TFile) {
      return path;
    }

    const settings = this.getPlugin()?.settings;
    if (
      autoCreate &&
      settings?.quarterly?.autoCreateQuarterlyReviewOnNavigation
    ) {
      const newFile = await this.createQuarterlyReview(targetDate);
      return newFile ? newFile.path : null;
    }

    return null;
  }

  
  async getBestPerformingMonth(
    year: number,
    quarter: number
  ): Promise<MonthlyPerformanceData | null> {
    const monthlyPerformance = await this.getMonthlyPerformance(year, quarter);
    if (monthlyPerformance.length === 0) return null;

    return monthlyPerformance.reduce((best, current) =>
      current.pnl > best.pnl ? current : best
    );
  }

  
  async getWorstPerformingMonth(
    year: number,
    quarter: number
  ): Promise<MonthlyPerformanceData | null> {
    const monthlyPerformance = await this.getMonthlyPerformance(year, quarter);
    if (monthlyPerformance.length === 0) return null;

    return monthlyPerformance.reduce((worst, current) =>
      current.pnl < worst.pnl ? current : worst
    );
  }

  
  async getMonthlyGamePerformance(
    year: number,
    quarter: number
  ): Promise<MonthlyGamePerformance[]> {
    try {
      const monthlyPerformance = await this.getMonthlyPerformance(
        year,
        quarter
      );

      const monthlyService = this.getPlugin()?.serviceManager
        ? await this.getPlugin().serviceManager.getMonthlyReviewService()
        : null;

      const drcService = this.getPlugin()?.serviceManager
        ? await this.getPlugin().serviceManager.getDRCService()
        : null;

      if (!monthlyService || !drcService) {
        return [];
      }

      const gamePerformanceData: MonthlyGamePerformance[] = [];

      for (const monthData of monthlyPerformance) {
        const mentalGradeDistribution: GradeDistribution = { A: 0, B: 0, C: 0 };
        const technicalGradeDistribution: GradeDistribution = {
          A: 0,
          B: 0,
          C: 0,
        };

        
        const monthStart = monthData.monthStartDate;
        const monthEnd = monthData.monthEndDate;

        for (
          let date = new Date(monthStart);
          date <= monthEnd;
          date.setDate(date.getDate() + 1)
        ) {
          const drcPath = drcService.getDRCNotePath(new Date(date));
          const file = this.app.vault.getAbstractFileByPath(drcPath);

          if (file instanceof TFile) {
            const cache = this.app.metadataCache.getFileCache(file);
            const drcData = cache?.frontmatter;

            if (drcData && drcData.type === 'drc') {
              const mentalGrade = getGradeValue(drcData.mentalGrade);
              if (mentalGrade) {
                mentalGradeDistribution[mentalGrade]++;
              }
              const technicalGrade = getGradeValue(drcData.technicalGrade);
              if (technicalGrade) {
                technicalGradeDistribution[technicalGrade]++;
              }
            }
          }
        }

        
        let mentalRating: number | undefined;
        let technicalRating: number | undefined;
        let mentalNotes: string | undefined;
        let technicalNotes: string | undefined;

        if (monthData.monthlyReviewPath) {
          const monthlyFile = this.app.vault.getAbstractFileByPath(
            monthData.monthlyReviewPath
          );
          if (monthlyFile instanceof TFile) {
            const cache = this.app.metadataCache.getFileCache(monthlyFile);
            const monthlyReviewData = cache?.frontmatter;
            if (monthlyReviewData) {
              mentalRating = getNumberValue(monthlyReviewData, 'mentalGrade');
              technicalRating = getNumberValue(
                monthlyReviewData,
                'technicalGrade'
              );
              mentalNotes = getStringValue(monthlyReviewData, 'mentalNotes');
              technicalNotes = getStringValue(
                monthlyReviewData,
                'technicalNotes'
              );
            }
          }
        }

        gamePerformanceData.push({
          month: monthData.month,
          monthStartDate: monthData.monthStartDate,
          monthEndDate: monthData.monthEndDate,
          monthlyReviewPath: monthData.monthlyReviewPath,
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
      console.error('Error getting monthly game performance:', error);
      return [];
    }
  }

  
  async getQuarterlyDataOptimized(
    year: number,
    quarter: number
  ): Promise<QuarterlyDataResult> {
    const cacheKey = `${year}-Q${quarter}`;
    const cached = this.quarterlyDataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.data;
    }

    try {
      const trades = await this.getQuarterlyTrades(year, quarter);
      const monthlyPerformance = await this.calculateMonthlyPerformance(
        trades,
        year,
        quarter
      );
      const demonTrackerData = this.getDemonTrackerDataFromTrades(trades);
      const monthlyGamePerformance = await this.getMonthlyGamePerformance(
        year,
        quarter
      );

      const bestMonth =
        monthlyPerformance.length > 0
          ? monthlyPerformance.reduce((best, current) =>
              current.pnl > best.pnl ? current : best
            )
          : null;

      const worstMonth =
        monthlyPerformance.length > 0
          ? monthlyPerformance.reduce((worst, current) =>
              current.pnl < worst.pnl ? current : worst
            )
          : null;

      const result = {
        trades,
        monthlyPerformance,
        monthlyGamePerformance,
        demonTrackerData,
        bestMonth,
        worstMonth,
      };

      this.quarterlyDataCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      console.error('Error getting optimized quarterly data:', error);
      return {
        trades: [],
        monthlyPerformance: [],
        monthlyGamePerformance: [],
        demonTrackerData: [],
        bestMonth: null,
        worstMonth: null,
      };
    }
  }

  
  private async calculateMonthlyPerformance(
    trades: Trade[],
    year: number,
    quarter: number
  ): Promise<MonthlyPerformanceData[]> {
    try {
      const monthlyData = new Map<number, MonthlyPerformanceData>();
      const monthsInQuarter = getMonthsInQuarter(quarter);

      const monthlyService = this.getPlugin()?.serviceManager
        ? await this.getPlugin().serviceManager.getMonthlyReviewService()
        : null;

      for (const month of monthsInQuarter) {
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0);

        let monthlyReviewPath: string | undefined;
        if (monthlyService) {
          monthlyReviewPath = monthlyService.getMonthlyReviewPath(monthStart);
        }

        monthlyData.set(month, {
          month,
          monthStartDate: monthStart,
          monthEndDate: monthEnd,
          trades: 0,
          winRate: 0,
          profitFactor: 0,
          pnl: 0,
          monthlyReviewPath,
        });
      }

      const pnlContributingTrades = getPnlContributingTrades(trades);

      pnlContributingTrades.forEach((trade: Trade) => {
        const tradeDate = new Date(trade.entryTime);
        const tradeMonth = tradeDate.getMonth() + 1;

        if (monthlyData.has(tradeMonth)) {
          const monthStats = monthlyData.get(tradeMonth)!;
          monthStats.trades++;
          monthStats.pnl += getEffectivePnL(trade);
        }
      });

      monthlyData.forEach((monthStats, month) => {
        const monthTrades = pnlContributingTrades.filter((trade) => {
          const tradeDate = new Date(trade.entryTime);
          return tradeDate.getMonth() + 1 === month;
        });

        const pnlContributingMonthTrades =
          getPnlContributingTrades(monthTrades);
        const winningTrades = pnlContributingMonthTrades.filter(
          (t) => getEffectivePnL(t) > 0
        );
        const losingTrades = pnlContributingMonthTrades.filter(
          (t) => getEffectivePnL(t) < 0
        );

        monthStats.winRate = calculateWinRateExcludingBreakeven(
          winningTrades.length,
          losingTrades.length
        );

        const totalWins = sumEffectivePnL(winningTrades);
        const totalLosses = Math.abs(sumEffectivePnL(losingTrades));

        monthStats.profitFactor =
          totalLosses > 0
            ? totalWins / totalLosses
            : totalWins > 0
              ? Infinity
              : 0;
      });

      return Array.from(monthlyData.values()).sort((a, b) => a.month - b.month);
    } catch (error) {
      console.error('Error calculating monthly performance:', error);
      return [];
    }
  }

  
  public async updateQuarterlyReviewFrontmatter(
    filePath: string,
    updates: Partial<Record<string, unknown>>
  ): Promise<void> {
    try {
      const file = this.app.vault.getAbstractFileByPath(filePath);

      if (!file || !(file instanceof TFile)) {
        throw new Error(`Quarterly Review file not found: ${filePath}`);
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
            asRecord(frontmatterRecord.imagesByWidget) ?? {};
          frontmatterRecord.imagesByWidget = {
            ...existingByWidget,
            ...imagesByWidget,
          };
        } else if (imagesByWidget !== undefined) {
          frontmatterRecord.imagesByWidget = imagesByWidget;
        }
      });

      await Promise.all([
        forceMetadataCacheRefresh(this.app, file),
        this.clearCache(),
      ]);
      this.quarterlyDataCache.clear();

      return;
    } catch (error) {
      console.error(
        `Error updating Quarterly Review frontmatter in ${filePath}:`,
        error
      );
      throw error;
    }
  }
}
