import { logger } from '../../utils/logger';


import {
  CustomDataService,
  CustomDataServiceConfig,
} from '../base/CustomDataService';
import { TradeFormData } from '../../components/forms/trade/types';
import { calculatePnL } from '../../utils/pnlCalculation';
import { calculatePersistableRMultiple } from '../../components/forms/trade/validation';
import { TFile, TAbstractFile, App, normalizePath } from 'obsidian';
import JournalitPlugin from '../../main';
import { FolderPathService } from '../core/FolderPathService';
import { getQuarterForMonth, getWeekFolderName } from '../../utils/dateUtils';
import { getTradingDay } from '../../utils/tradingDayUtils';
import { eventBus } from '../events';
import { mapCustomFieldsToFrontmatter } from '../../utils/customFieldPersistence';
import { buildTradeIdentityFields } from '../../utils/tradeIdentity';
import { Mutex } from '../../utils/mutex';

function getStringValue(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

function getNumberValue(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  return typeof value === 'number' ? value : Number(value) || 0;
}

function getOptionalNumberValue(
  record: Record<string, unknown>,
  key: string
): number | undefined {
  const value = record[key];
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getDateValue(record: Record<string, unknown>, key: string): Date {
  const value = record[key];
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date(0);
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

function createBacktestTradeData(
  frontmatter: Record<string, unknown>,
  filePath: string
): BacktestTradeFormData {
  return {
    entryTime: getDateValue(frontmatter, 'entryTime'),
    exitTime: getDateValue(frontmatter, 'exitTime'),
    entryPrice: getNumberValue(frontmatter, 'entryPrice'),
    exitPrice: getNumberValue(frontmatter, 'exitPrice'),
    positionSize: getNumberValue(frontmatter, 'positionSize'),
    direction: getStringValue(frontmatter, 'direction'),
    instrument: getStringValue(frontmatter, 'instrument'),
    assetType: getStringValue(frontmatter, 'assetType'),
    setupIds: getStringArray(frontmatter, 'setupIds'),
    setup: getStringArray(frontmatter, 'setup'),
    mistake: getStringArray(frontmatter, 'mistake'),
    account: getStringArray(frontmatter, 'account'),
    tags: getStringArray(frontmatter, 'tags'),
    pnl: getNumberValue(frontmatter, 'pnl'),
    commission: getOptionalNumberValue(frontmatter, 'commission'),
    commissionType:
      frontmatter.commissionType === 'fixed' ||
      frontmatter.commissionType === 'percentage'
        ? frontmatter.commissionType
        : undefined,
    hasExplicitCommission:
      frontmatter.hasExplicitCommission === true
        ? true
        : frontmatter.hasExplicitCommission === false
          ? false
          : undefined,
    filePath,
    isBacktestTrade: true,
  };
}


export interface BacktestTradeFormData extends TradeFormData {
  
  isBacktestTrade: true;
}


export class BacktestTradeService extends CustomDataService {
  private recentlyCreatedFiles = new Set<string>();
  private readonly creationMutex = new Mutex();
  private readonly tradesFolder = 'trades';
  private folderPathService: FolderPathService;

  constructor(
    app: App,
    plugin: JournalitPlugin,
    config: CustomDataServiceConfig = {}
  ) {
    
    const serviceManager = plugin.serviceManager;
    const folderPathService = serviceManager?.getFolderPathService();
    const journalFolderPath =
      folderPathService?.journalFolderPath || '!Journalit';

    super(app, {
      folder: journalFolderPath,
      extension: '.md',
      namespace: 'backtest-trade',
      enableIndexing: true,
      ...config,
    });

    this.setPlugin(plugin);
    this.folderPathService =
      folderPathService || new FolderPathService(app, plugin);
  }

  
  private getPlugin(): JournalitPlugin {
    if (!this.plugin) {
      throw new Error('Plugin not initialized');
    }
    return this.plugin;
  }

  
  public setPlugin(plugin: JournalitPlugin): void {
    super.setPlugin(plugin);

    
    plugin.registerEvent(
      plugin.app.vault.on('delete', async (file: TAbstractFile) => {
        
        if (file.path.endsWith('.md') && /-B\d+\.md$/.test(file.path)) {
          const normalizedPath = normalizePath(file.path);
          await this.handleBacktestTradeDeletion(normalizedPath);
        }
      })
    );
  }

  
  async createBacktestTrade(
    data: BacktestTradeFormData,
    options: {
      openFile?: boolean;
      images?: string[];
      deferPostCreateTasks?: boolean;

      customFields?: Record<string, unknown>;
    } = {}
  ): Promise<TFile | null> {
    try {
      const {
        openFile = true,
        images = [],
        customFields = {},
        deferPostCreateTasks = false,
      } = options;

      
      if (!data.instrument || !data.entryTime) {
        console.error('[BacktestTradeService] Missing required data:', {
          instrument: data.instrument,
          entryTime: data.entryTime,
        });
        return null;
      }

      
      const entryDate =
        data.entryTime instanceof Date
          ? data.entryTime
          : new Date(data.entryTime);
      const tradingDay = getTradingDay(entryDate, this.plugin);
      const ticker = data.instrument.toUpperCase();

      
      const targetFolderPath = await this.getTargetFolderPath(tradingDay);
      if (!targetFolderPath) {
        console.error(
          '[BacktestTradeService] Failed to determine target folder path'
        );
        return null;
      }

      return await this.creationMutex.withLock(async () => {
        
        
        const filePath = await this.generateBacktestTradePath({
          instrument: ticker,
          entryTime: entryDate,
        });

        
        if (this.recentlyCreatedFiles.has(filePath)) {
          console.warn(
            '[BacktestTradeService] File creation already in progress:',
            filePath
          );
          return null;
        }

        this.recentlyCreatedFiles.add(filePath);

        try {
          const identityFields = buildTradeIdentityFields(data);

          
          const frontmatter: Record<string, unknown> = {
            type: 'backtest-trade',
            tradeId: identityFields.tradeId,
            schemaVersion: identityFields.schemaVersion,
            isBacktestTrade: true,
            
            entryTime: data.entryTime
              ? this.formatDateForFrontmatter(data.entryTime)
              : undefined,
            exitTime: data.exitTime
              ? this.formatDateForFrontmatter(data.exitTime)
              : undefined,
            
            entryPrice: data.entryPrice,
            exitPrice: data.exitPrice,
            positionSize: data.positionSize,
            direction: data.direction,
            
            entries: data.entries
              ?.filter((entry) => entry.time instanceof Date)
              .map((entry) => ({
                time: this.formatDateForFrontmatter(entry.time!),
                price: entry.price,
                size: entry.size,
              })),
            exits: data.exits
              ?.filter((exit) => exit.time instanceof Date)
              .map((exit) => ({
                time: this.formatDateForFrontmatter(exit.time!),
                price: exit.price,
                size: exit.size,
              })),
            
            setupIds: data.setupIds,

            thesis: data.thesis || '',
            images: data.images,
            instrument: data.instrument,
            assetType: data.assetType,
            setup: data.setup,
            mistake: data.mistake,
            account: data.account,
            commission: data.commission,
            commissionType: data.commissionType,
            hasExplicitCommission: data.hasExplicitCommission,
            fees: data.fees,
            swap: data.swap,
            rebate: data.rebate,
            stopLoss: data.stopLoss,
            riskAmount: data.riskAmount,
            mae: data.mae,
            mfe: data.mfe,
            maePrice: data.maePrice,
            mfePrice: data.mfePrice,
            pnl: calculatePnL(data),
            rMultiple: calculatePersistableRMultiple(data),
            useDirectPnLInput: data.useDirectPnLInput,
            directPnL: data.directPnL,
            
            tags:
              data.customTags &&
              Array.isArray(data.customTags) &&
              data.customTags.length > 0
                ? data.customTags
                    .map((tag) => String(tag).trim())
                    .filter((tag) => tag.length > 0)
                : [],
          };

          const fieldDefinitions =
            this.getPlugin().customFieldsService?.getFields() || [];
          const mappedCustomFields = mapCustomFieldsToFrontmatter(
            customFields,
            fieldDefinitions
          );
          Object.assign(frontmatter, mappedCustomFields);

          
          if (data.assetType === 'stock') {
            
            if (data.exchange) frontmatter.exchange = data.exchange;
          } else if (data.assetType === 'options') {
            
            if (data.expirationDate)
              frontmatter.expirationDate = this.formatDateForFrontmatter(
                data.expirationDate
              );
            if (data.strikePrice !== undefined)
              frontmatter.strikePrice = data.strikePrice;
            if (data.optionType) frontmatter.optionType = data.optionType;
            if (data.contractSize !== undefined)
              frontmatter.contractSize = data.contractSize;
          } else if (data.assetType === 'futures') {
            
            if (data.dollarPerPoint !== undefined)
              frontmatter.dollarPerPoint = data.dollarPerPoint;
            if (data.tickSize !== undefined)
              frontmatter.tickSize = data.tickSize;
            if (data.tickValue !== undefined)
              frontmatter.tickValue = data.tickValue;
          } else if (data.assetType === 'forex') {
            
            if (data.lotSize !== undefined) frontmatter.lotSize = data.lotSize;
            if (data.pipValue !== undefined)
              frontmatter.pipValue = data.pipValue;
          } else if (data.assetType === 'crypto') {
            
            if (data.cryptoExchange)
              frontmatter.cryptoExchange = data.cryptoExchange;
          } else if (data.assetType === 'cfd') {
            
            if (data.contractSize !== undefined)
              frontmatter.contractSize = data.contractSize;
            if (data.leverageRatio !== undefined)
              frontmatter.leverageRatio = data.leverageRatio;
          }

          
          const fileExists = await this.app.vault.adapter.exists(filePath);
          if (fileExists) {
            console.warn(
              '[BacktestTradeService] File already exists:',
              filePath
            );
            return null;
          }

          
          const file = await this.app.vault.create(filePath, '');
          await this.updateFrontmatter(file, frontmatter);

          
          if (images.length > 0) {
            const backtestTradePrefix =
              file.path.match(/-(B\d+)\.md$/)?.[1] || 'B1';
            await this.copyImagesToTradeFolder(
              images,
              file,
              backtestTradePrefix
            );
          }

          const runPostCreateTasks = async () => {
            
            if (openFile) {
              await this.getPlugin().openFile(file.path, true);
            }
          };

          if (deferPostCreateTasks) {
            window.setTimeout(() => {
              void runPostCreateTasks().catch((error) => {
                console.error(
                  '[BacktestTradeService] Post-create tasks failed:',
                  error
                );
              });
            }, 0);
          } else {
            await runPostCreateTasks();
          }

          
          eventBus.publish('backtest-trade:changed', {
            action: 'created',
            filePath,
            timestamp: Date.now(),
          });

          return file;
        } finally {
          
          window.setTimeout(
            () => this.recentlyCreatedFiles.delete(filePath),
            5000
          );
        }
      });
    } catch (error) {
      console.error(
        '[BacktestTradeService] Failed to create backtest trade:',
        error
      );
      return null;
    }
  }

  
  async updateBacktestTrade(
    data: BacktestTradeFormData,
    filePath: string
  ): Promise<boolean> {
    try {
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!file || !(file instanceof TFile)) {
        console.error('[BacktestTradeService] File not found:', filePath);
        return false;
      }

      const existingData = await this.readFrontmatter(file);
      const identityFields = buildTradeIdentityFields(
        (existingData as Record<string, unknown> | undefined) ?? data
      );

      
      const frontmatter: Record<string, unknown> = {
        type: 'backtest-trade',
        tradeId: identityFields.tradeId,
        schemaVersion: identityFields.schemaVersion,
        backendTradeId: undefined,
        isBacktestTrade: true,
        isMissedTrade: undefined,
        
        entryTime: data.entryTime
          ? this.formatDateForFrontmatter(data.entryTime)
          : undefined,
        exitTime: data.exitTime
          ? this.formatDateForFrontmatter(data.exitTime)
          : undefined,
        
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice,
        positionSize: data.positionSize,
        direction: data.direction,
        
        entries: data.entries
          ?.filter((entry) => entry.time instanceof Date)
          .map((entry) => ({
            time: this.formatDateForFrontmatter(entry.time!),
            price: entry.price,
            size: entry.size,
          })),
        exits: data.exits
          ?.filter((exit) => exit.time instanceof Date)
          .map((exit) => ({
            time: this.formatDateForFrontmatter(exit.time!),
            price: exit.price,
            size: exit.size,
          })),
        
        setupIds: data.setupIds,

        thesis: data.thesis || '',
        images: data.images,
        instrument: data.instrument,
        assetType: data.assetType,
        setup: data.setup,
        mistake: data.mistake,
        account: data.account,
        commission: data.commission,
        commissionType: data.commissionType,
        hasExplicitCommission: data.hasExplicitCommission,
        fees: data.fees,
        swap: data.swap,
        rebate: data.rebate,
        stopLoss: data.stopLoss,
        riskAmount: data.riskAmount,
        mae: data.mae,
        mfe: data.mfe,
        maePrice: data.maePrice,
        mfePrice: data.mfePrice,
        pnl: calculatePnL(data),
        rMultiple: calculatePersistableRMultiple(data),
        useDirectPnLInput: data.useDirectPnLInput,
        directPnL: data.directPnL,
        missedReason: undefined,
        
        tags:
          data.customTags &&
          Array.isArray(data.customTags) &&
          data.customTags.length > 0
            ? data.customTags
                .map((tag) => String(tag).trim())
                .filter((tag) => tag.length > 0)
            : [],
      };

      
      if (data.assetType === 'stock') {
        
        if (data.exchange) frontmatter.exchange = data.exchange;
      } else if (data.assetType === 'options') {
        
        if (data.expirationDate)
          frontmatter.expirationDate = this.formatDateForFrontmatter(
            data.expirationDate
          );
        if (data.strikePrice !== undefined)
          frontmatter.strikePrice = data.strikePrice;
        if (data.optionType) frontmatter.optionType = data.optionType;
        if (data.contractSize !== undefined)
          frontmatter.contractSize = data.contractSize;
      } else if (data.assetType === 'futures') {
        
        if (data.dollarPerPoint !== undefined)
          frontmatter.dollarPerPoint = data.dollarPerPoint;
        if (data.tickSize !== undefined) frontmatter.tickSize = data.tickSize;
        if (data.tickValue !== undefined)
          frontmatter.tickValue = data.tickValue;
      } else if (data.assetType === 'forex') {
        
        if (data.lotSize !== undefined) frontmatter.lotSize = data.lotSize;
        if (data.pipValue !== undefined) frontmatter.pipValue = data.pipValue;
      } else if (data.assetType === 'crypto') {
        
        if (data.cryptoExchange)
          frontmatter.cryptoExchange = data.cryptoExchange;
      } else if (data.assetType === 'cfd') {
        
        if (data.contractSize !== undefined)
          frontmatter.contractSize = data.contractSize;
        if (data.leverageRatio !== undefined)
          frontmatter.leverageRatio = data.leverageRatio;
      }

      const fieldDefinitions =
        this.getPlugin().customFieldsService?.getFields() || [];
      const mappedCustomFields = mapCustomFieldsToFrontmatter(
        data.customFields,
        fieldDefinitions,
        { includeClearedFields: true }
      );
      Object.assign(frontmatter, mappedCustomFields);

      await this.updateFrontmatter(file, frontmatter);

      
      eventBus.publish('backtest-trade:changed', {
        action: 'updated',
        filePath,
        timestamp: Date.now(),
      });

      return true;
    } catch (error) {
      console.error(
        '[BacktestTradeService] Failed to update backtest trade:',
        error
      );
      return false;
    }
  }

  
  private async handleBacktestTradeDeletion(filePath: string): Promise<void> {
    logger.debug('Handling backtest trade deletion:', filePath);

    
    void this.clearCache();

    
    eventBus.publish('backtest-trade:changed', {
      action: 'deleted',
      filePath,
      timestamp: Date.now(),
    });
    logger.debug('Emitted backtest trade deletion event:', filePath);
  }

  
  private getAllBacktestTradeFiles(): TFile[] {
    const allFiles = this.app.vault.getMarkdownFiles();
    return allFiles.filter((file: TFile) => {
      if (
        !file.path.includes('/trades/') ||
        !this.folderPathService.isJournalPath(file.path)
      ) {
        return false;
      }

      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (
        frontmatter?.type === 'backtest-trade' ||
        frontmatter?.isBacktestTrade
      ) {
        return true;
      }

      const backtestPattern = /(-B\d+\.md$|TMB.*\.md$)/;
      return backtestPattern.test(file.path);
    });
  }

  
  async getBacktestTrades(
    startDate: Date,
    endDate: Date
  ): Promise<BacktestTradeFormData[]> {
    try {
      const results = await this.query(async () => {
        const files = this.getAllBacktestTradeFiles();
        const backtestTrades: BacktestTradeFormData[] = [];

        for (const file of files) {
          try {
            
            const cache = this.app.metadataCache.getFileCache(file);
            const frontmatter = cache?.frontmatter as
              | Record<string, unknown>
              | undefined;

            
            if (!frontmatter || frontmatter.type !== 'backtest-trade') continue;

            
            if (backtestTrades.length % 20 === 0) {
              await new Promise((resolve) => window.setTimeout(resolve, 0));
            }

            
            if (
              typeof frontmatter.entryTime === 'string' ||
              typeof frontmatter.entryTime === 'number' ||
              frontmatter.entryTime instanceof Date
            ) {
              const entryDate = new Date(frontmatter.entryTime);
              if (entryDate < startDate || entryDate > endDate) continue;
            }

            
            const data = createBacktestTradeData(frontmatter, file.path);

            backtestTrades.push(data);
          } catch (error) {
            console.error(
              `[BacktestTradeService] Error processing file ${file.path}:`,
              error
            );
          }
        }

        return backtestTrades;
      }, `backtest-trades-${startDate.getTime()}-${endDate.getTime()}`);

      return results;
    } catch (error) {
      console.error(
        '[BacktestTradeService] Failed to get backtest trades:',
        error
      );
      return [];
    }
  }

  

  async getBacktestTradeFiles(
    startDate: Date,
    endDate: Date
  ): Promise<Array<{ file: TFile; data: BacktestTradeFormData }>> {
    try {
      const results = await this.query(
        async () => {
          const files = this.getAllBacktestTradeFiles();

          const backtestTradeFiles: Array<{
            file: TFile;
            data: BacktestTradeFormData;
          }> = [];

          for (const file of files) {
            try {
              
              const cache = this.app.metadataCache.getFileCache(file);
              const frontmatter = cache?.frontmatter as
                | Record<string, unknown>
                | undefined;

              
              if (!frontmatter || frontmatter.type !== 'backtest-trade')
                continue;

              
              if (backtestTradeFiles.length % 20 === 0) {
                await new Promise((resolve) => window.setTimeout(resolve, 0));
              }

              
              if (
                typeof frontmatter.entryTime === 'string' ||
                typeof frontmatter.entryTime === 'number' ||
                frontmatter.entryTime instanceof Date
              ) {
                const entryDate = new Date(frontmatter.entryTime);
                if (entryDate < startDate || entryDate > endDate) continue;
              }

              
              const data = createBacktestTradeData(frontmatter, file.path);

              backtestTradeFiles.push({ file, data });
            } catch (error) {
              console.error(
                `[BacktestTradeService] Error processing file ${file.path}:`,
                error
              );
            }
          }

          return backtestTradeFiles;
        },
        `backtest-trade-files-${startDate.getTime()}-${endDate.getTime()}`
        
      );

      return results;
    } catch (error) {
      console.error(
        '[BacktestTradeService] Failed to get backtest trade files:',
        error
      );
      return [];
    }
  }

  
  async updateBacktestTradeReviewStatus(
    filePath: string,
    reviewed: boolean,
    reviewedAt?: string
  ): Promise<boolean> {
    try {
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!file || !(file instanceof TFile)) {
        return false;
      }

      const existingData = await this.readFrontmatter(file);
      const identityFields = buildTradeIdentityFields(
        existingData as Record<string, unknown> | undefined
      );
      await this.updateFrontmatter(file, {
        ...existingData,
        tradeId: identityFields.tradeId,
        schemaVersion: identityFields.schemaVersion,
        reviewed,
        reviewedAt:
          reviewedAt || (reviewed ? new Date().toISOString() : undefined),
      });

      
      eventBus.publish('backtest-trade:changed', {
        action: 'updated',
        filePath: file.path,
        timestamp: Date.now(),
      });

      return true;
    } catch (error) {
      console.error(
        '[BacktestTradeService] Failed to update review status:',
        error
      );
      return false;
    }
  }

  
  async getBacktestTradeNumberForDay(
    ticker: string,
    tradingDay: Date
  ): Promise<number> {
    try {
      
      const targetFolderPath = await this.getTargetFolderPath(tradingDay);
      if (!targetFolderPath) return 1;

      
      const dateFormat = this.getPlugin().settings.trade.dateFormat || 'DDMMYY';
      const formattedDate = this.formatDateForFile(tradingDay, dateFormat);

      
      const escapedTicker = ticker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(
        `^${escapedTicker}-${formattedDate}-B(\\d+)\\.md$`
      );

      const existingNumbers = new Set<number>();

      
      const folderPrefix = `${targetFolderPath}/`;
      for (const pendingPath of this.recentlyCreatedFiles) {
        if (!pendingPath.startsWith(folderPrefix)) continue;
        const pendingName = pendingPath.split('/').pop() || pendingPath;
        const pendingMatch = pendingName.match(pattern);
        if (pendingMatch) {
          existingNumbers.add(parseInt(pendingMatch[1], 10));
        }
      }

      
      const folderExists =
        await this.app.vault.adapter.exists(targetFolderPath);
      if (folderExists) {
        const folderContents =
          await this.app.vault.adapter.list(targetFolderPath);
        const files = folderContents.files || [];

        for (const filePath of files) {
          
          const fileName = filePath.split('/').pop() || filePath;
          const match = fileName.match(pattern);
          if (match) {
            existingNumbers.add(parseInt(match[1], 10));
          }
        }
      }

      
      const nextNumber =
        existingNumbers.size > 0 ? Math.max(...existingNumbers) + 1 : 1;
      return nextNumber;
    } catch (error) {
      console.error(
        '[BacktestTradeService] Failed to get backtest trade number:',
        error
      );
      return 1;
    }
  }

  public async generateBacktestTradePath(
    data: Pick<BacktestTradeFormData, 'instrument' | 'entryTime'>
  ): Promise<string> {
    const entryDate =
      data.entryTime instanceof Date
        ? data.entryTime
        : new Date(String(data.entryTime));
    const tradingDay = getTradingDay(entryDate, this.plugin);
    const ticker = data.instrument
      ? this.sanitizeTickerForFilename(data.instrument)
      : 'UNKNOWN';

    const targetFolderPath = await this.getTargetFolderPath(tradingDay);
    if (!targetFolderPath) {
      throw new Error(
        'Failed to determine target folder path for backtest trade'
      );
    }

    const backtestTradeNumber = await this.getBacktestTradeNumberForDay(
      ticker,
      tradingDay
    );

    const dateFormat = this.getPlugin().settings.trade.dateFormat || 'DDMMYY';
    const formattedDate = this.formatDateForFile(tradingDay, dateFormat);
    const filename = `${ticker}-${formattedDate}-B${backtestTradeNumber}.md`;
    return `${targetFolderPath}/${filename}`;
  }

  
  private async getTargetFolderPath(tradingDay: Date): Promise<string | null> {
    const year = tradingDay.getFullYear();
    const monthNum = tradingDay.getMonth() + 1;
    const month = String(monthNum).padStart(2, '0');
    const weekFolderName = getWeekFolderName(tradingDay, year);
    const quarter = getQuarterForMonth(monthNum);

    const folderPath = this.folderPathService.getDatePathForQuarterSync(
      year.toString(),
      quarter,
      month,
      weekFolderName,
      this.tradesFolder
    );

    
    await this.app.vault.adapter.mkdir(folderPath);

    return folderPath;
  }

  
  private formatDateForFile(date: Date, format: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    switch (format.toUpperCase()) {
      case 'MMDDYY':
        return `${month}${day}${year}`;
      case 'YYMMDD':
        return `${year}${month}${day}`;
      case 'DDMMYY':
      default:
        return `${day}${month}${year}`;
    }
  }

  public sanitizeTickerForFilename(ticker: string): string {
    if (!ticker) return 'UNKNOWN';

    let sanitized = ticker.trim().toUpperCase();

    sanitized = sanitized
      .replace(/[\\/:*?"<>|+]/g, '')
      .replace(/[\s.[\](){}#%&=;]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');

    if (!sanitized) return 'UNKNOWN';

    const MAX_TICKER_LENGTH = 20;
    if (sanitized.length > MAX_TICKER_LENGTH) {
      sanitized = sanitized.substring(0, MAX_TICKER_LENGTH);
    }

    return sanitized;
  }

  
  private async copyImagesToTradeFolder(
    _images: string[],
    _file: TFile,
    _prefix: string
  ): Promise<void> {
    // intentional
    
  }

  

  private formatDateForFrontmatter(date: unknown): string {
    try {
      if (
        !(date instanceof Date) &&
        typeof date !== 'string' &&
        typeof date !== 'number'
      ) {
        return String(date);
      }
      const dateObj = date instanceof Date ? date : new Date(date);

      
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date value, returning as-is:', date);
        
        return String(date);
      }

      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error formatting date:', date, error);
      
      return date instanceof Date ? date.toISOString() : String(date);
    }
  }
}
