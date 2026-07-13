import { logger } from '../../utils/logger';


import { App, TAbstractFile, TFile, normalizePath } from 'obsidian';
import {
  CustomDataService,
  CustomDataServiceConfig,
} from '../base/CustomDataService';
import JournalitPlugin from '../../main';
import { mapCustomFieldsToFrontmatter } from '../../utils/customFieldPersistence';
import { getTradingDay } from '../../utils/tradingDayUtils';
import {
  getQuarterForMonth,
  getQuarterString,
  getWeekFolderName,
} from '../../utils/dateUtils';
import { calculatePnL } from '../../utils/pnlCalculation';
import { calculatePersistableRMultiple } from '../../components/forms/trade/validation';
import { MissedTradeFormData } from '../../components/missedTrade/types';
import { eventBus } from '../events';
import { LossReviewData } from '../backend/types';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import { Mutex } from '../../utils/mutex';
import { safeString } from '../../utils/safeString';
import { getDefaultTradeTemplateMetadata } from '../templates/defaultTradeTemplateMetadata';
import { serializeIdealExitFrontmatter } from '../trade/core/TradeFrontmatterCodec';

function isTradeFolderPath(path: string): boolean {
  return /\/trades\//.test(path);
}

interface MissedTradeFolderPathService {
  journalFolderPath: string;
  getPath(...segments: string[]): string;
  isJournalPath(path: string): boolean;
  getDatePathForQuarterSync(
    year: string,
    quarterNum: number,
    month: string,
    week: string,
    ...additionalSegments: string[]
  ): string;
}


export class MissedTradeService extends CustomDataService {
  private recentlyCreatedFiles: Set<string> = new Set();
  private readonly creationMutex = new Mutex();
  private readonly tradesFolder = 'trades';
  private folderPathService: MissedTradeFolderPathService;

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
      namespace: 'missed-trade',
      enableIndexing: true,
      ...config,
    });

    this.setPlugin(plugin);
    this.folderPathService = folderPathService || {
      journalFolderPath: '!Journalit',
      getPath: (...segments: string[]) =>
        normalizePath(['!Journalit', ...segments].join('/')),
      isJournalPath: (path: string) => path.startsWith('!Journalit/'),
      getDatePathForQuarterSync: (
        year: string,
        quarterNum: number,
        month: string,
        week: string,
        ...additionalSegments: string[]
      ) =>
        normalizePath(
          [
            '!Journalit',
            year,
            getQuarterString(quarterNum),
            month,
            week,
            ...additionalSegments,
          ].join('/')
        ),
    };
  }

  
  private getPlugin(): JournalitPlugin {
    if (!this.plugin) {
      throw new Error('Plugin not initialized');
    }
    return this.plugin;
  }

  
  private validateDirectionAndOptionType(data: MissedTradeFormData): void {
    
    if (data.optionType) {
      const normalized = data.optionType.trim().toLowerCase();
      if (normalized === 'call' || normalized === 'put') {
        data.optionType = normalized;
      }
      
    }

    
    if (data.direction && data.optionType) {
      throw new Error('Cannot specify both direction and optionType');
    }

    
    if (data.assetType === 'options') {
      if (!data.optionType) throw new Error('Option type is required');
      if (data.optionType !== 'call' && data.optionType !== 'put')
        throw new Error("Invalid optionType: must be 'call' or 'put'");
      if (data.direction)
        throw new Error('Direction should not be provided for options trades');
    } else {
      if (!data.direction) throw new Error('Direction is required');
      if (data.optionType)
        throw new Error(
          'optionType should only be provided for options trades'
        );
    }
  }

  
  public setPlugin(plugin: JournalitPlugin): void {
    super.setPlugin(plugin);

    
    plugin.registerEvent(
      plugin.app.vault.on('delete', async (file: TAbstractFile) => {
        
        if (file.path.endsWith('.md') && /-M\d+\.md$/.test(file.path)) {
          const normalizedPath = normalizePath(file.path);
          await this.handleMissedTradeDeletion(normalizedPath);
        }
      })
    );
  }

  
  public async createMissedTrade(
    data: MissedTradeFormData,
    options?: { suppressAutoOpen?: boolean; deferPostCreateTasks?: boolean }
  ): Promise<string> {
    try {
      
      if (!data.entryTime) throw new Error('Entry time is required');

      
      this.validateDirectionAndOptionType(data);

      if (!data.instrument) throw new Error('Instrument is required');

      
      
      if (data.entryPrice === undefined) data.entryPrice = 0;
      if (data.exitPrice === undefined) data.exitPrice = 0;
      if (data.positionSize === undefined) data.positionSize = 0;
      if (!data.exitTime) data.exitTime = data.entryTime;

      
      
      const targetFolderPath = this.getTargetFolderPath(
        getTradingDay(data.entryTime, this.plugin)
      );

      
      try {
        await this.app.vault.adapter.mkdir(targetFolderPath);
      } catch {
        // intentional
      }

      const filePath = await this.creationMutex.withLock(async () => {
        
        const nextFilePath = await this.generateMissedTradePath(data);

        
        if (this.recentlyCreatedFiles.has(nextFilePath)) {
          throw new Error(`File creation already in progress: ${nextFilePath}`);
        }

        
        const fileExists = await this.app.vault.adapter.exists(nextFilePath);
        if (fileExists) {
          console.error(
            `Cannot create missed trade - File already exists at path: ${nextFilePath}`
          );
          throw new Error(`File already exists: ${nextFilePath}`);
        }

        
        const content = this.generateMissedTradeContent(data);

        
        this.recentlyCreatedFiles.add(nextFilePath);

        
        window.setTimeout(() => {
          this.recentlyCreatedFiles?.delete(nextFilePath);
        }, 10000);

        
        const newFile = await this.app.vault.create(nextFilePath, content);
        await forceMetadataCacheRefresh(this.app, newFile, 500);

        return nextFilePath;
      });
      
      

      
      eventBus.publish('missed-trade:changed', {
        action: 'created',
        filePath,
        timestamp: Date.now(),
      });

      
      void this.clearCache();

      const runPostCreateTasks = async () => {
        
        if (
          this.plugin?.settings.trade.autoOpenCreatedTrades &&
          !options?.suppressAutoOpen
        ) {
          
          if (this.plugin?.processorManager) {
            await this.getPlugin().processorManager.getTradeNoteProcessor();
          }

          try {
            
            await this.getPlugin().openFile(filePath, true);

            
            
          } catch (error) {
            
            console.warn('Failed to auto-open created missed trade:', error);
          }
        }
      };

      if (options?.deferPostCreateTasks) {
        window.setTimeout(() => {
          void runPostCreateTasks().catch((error) => {
            console.error(
              '[MissedTradeService] Post-create tasks failed:',
              error
            );
          });
        }, 0);
      } else {
        await runPostCreateTasks();
      }

      logger.debug(`Missed trade created successfully: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('Error creating missed trade:', error);
      throw error;
    }
  }

  
  public async updateMissedTrade(
    data: MissedTradeFormData,
    filePath: string
  ): Promise<string> {
    try {
      
      if (!data.entryTime) throw new Error('Entry time is required');

      
      this.validateDirectionAndOptionType(data);

      if (!data.instrument) throw new Error('Instrument is required');

      
      const fileExists = await this.app.vault.adapter.exists(filePath);
      if (!fileExists) {
        throw new Error(`Missed trade file does not exist: ${filePath}`);
      }

      
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!file || !(file instanceof TFile)) {
        throw new Error(`Invalid file path: ${filePath}`);
      }

      
      if (data.entryPrice === undefined) data.entryPrice = 0;
      if (data.exitPrice === undefined) data.exitPrice = 0;
      if (data.positionSize === undefined) data.positionSize = 0;
      if (!data.exitTime) data.exitTime = data.entryTime;

      
      const pnl = calculatePnL(data);

      

      const frontmatterData: Record<string, unknown> = {
        type: 'missed-trade',
        isMissedTrade: true,
        isBacktestTrade: undefined,
        tradeId: undefined,
        schemaVersion: undefined,
        backendTradeId: undefined,
        entryTime: this.formatDateForFrontmatter(data.entryTime),
        exitTime: this.formatDateForFrontmatter(
          data.exitTime || data.entryTime
        ),
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice,
        positionSize: data.positionSize,
        ...(data.direction ? { direction: data.direction } : {}),
        instrument: data.instrument,
        pnl,
        rMultiple: calculatePersistableRMultiple(data),
      };

      if (Array.isArray(data.entries)) {
        const validEntries = data.entries.flatMap((entry) =>
          entry &&
          entry.time instanceof Date &&
          !Number.isNaN(entry.time.getTime()) &&
          entry.price !== undefined &&
          entry.size !== undefined &&
          entry.size > 0
            ? [
                {
                  time: this.formatDateForFrontmatter(entry.time),
                  price: entry.price,
                  size: entry.size,
                  ...(entry.notional !== undefined
                    ? { notional: entry.notional }
                    : {}),
                },
              ]
            : []
        );

        frontmatterData.entries =
          validEntries.length > 0 ? validEntries : undefined;
      }

      if (Array.isArray(data.exits)) {
        const validExits = data.exits.flatMap((exit) =>
          exit &&
          exit.time instanceof Date &&
          !Number.isNaN(exit.time.getTime()) &&
          exit.price !== undefined &&
          exit.size !== undefined &&
          exit.size > 0
            ? [
                {
                  time: this.formatDateForFrontmatter(exit.time),
                  price: exit.price,
                  size: exit.size,
                  ...(exit.notional !== undefined
                    ? { notional: exit.notional }
                    : {}),
                },
              ]
            : []
        );

        frontmatterData.exits = validExits.length > 0 ? validExits : undefined;
      }

      if (data.idealExits !== undefined) {
        const idealExits = serializeIdealExitFrontmatter(data.idealExits);
        frontmatterData.idealExits = idealExits.length ? idealExits : undefined;
      }

      
      if (data.assetType) frontmatterData.assetType = data.assetType;
      
      
      
      if (data.thesis !== undefined) frontmatterData.thesis = data.thesis ?? '';
      if (data.missedReason !== undefined)
        frontmatterData.missedReason = data.missedReason || '';
      frontmatterData.commission = data.commission;
      frontmatterData.commissionType = data.commissionType;
      frontmatterData.hasExplicitCommission = data.hasExplicitCommission;
      frontmatterData.fees = data.fees;
      frontmatterData.swap = data.swap;
      frontmatterData.rebate = data.rebate;
      frontmatterData.riskAmount = data.riskAmount;
      frontmatterData.stopLoss = data.stopLoss;
      frontmatterData.mae = data.mae;
      frontmatterData.mfe = data.mfe;
      frontmatterData.maePrice = data.maePrice;
      frontmatterData.mfePrice = data.mfePrice;
      if (data.account?.length) frontmatterData.account = data.account;
      if (data.setup !== undefined) {
        frontmatterData.setup = data.setup;
      }
      if (data.mistake?.length) frontmatterData.mistake = data.mistake;
      if (data.images?.length) frontmatterData.images = data.images;
      if (data.useDirectPnLInput !== undefined)
        frontmatterData.useDirectPnLInput = data.useDirectPnLInput;
      if (data.directPnL !== undefined)
        frontmatterData.directPnL = data.directPnL;

      if (data.assetType === 'stock') {
        if (data.exchange) frontmatterData.exchange = data.exchange;
      } else if (data.assetType === 'options') {
        if (data.expirationDate)
          frontmatterData.expirationDate = this.formatDateForFrontmatter(
            data.expirationDate
          );
        if (data.strikePrice !== undefined)
          frontmatterData.strikePrice = data.strikePrice;
        if (data.optionType) frontmatterData.optionType = data.optionType;
        if (data.contractSize !== undefined)
          frontmatterData.contractSize = data.contractSize;
      } else if (data.assetType === 'futures') {
        if (data.dollarPerPoint !== undefined)
          frontmatterData.dollarPerPoint = data.dollarPerPoint;
        if (data.tickSize !== undefined)
          frontmatterData.tickSize = data.tickSize;
        if (data.tickValue !== undefined)
          frontmatterData.tickValue = data.tickValue;
      } else if (data.assetType === 'forex') {
        if (data.lotSize !== undefined) frontmatterData.lotSize = data.lotSize;
        if (data.pipValue !== undefined)
          frontmatterData.pipValue = data.pipValue;
      } else if (data.assetType === 'crypto') {
        if (data.cryptoExchange)
          frontmatterData.cryptoExchange = data.cryptoExchange;
      } else if (data.assetType === 'cfd') {
        if (data.contractSize !== undefined)
          frontmatterData.contractSize = data.contractSize;
        if (data.leverageRatio !== undefined)
          frontmatterData.leverageRatio = data.leverageRatio;
      }

      
      if (data.reviewed !== undefined) frontmatterData.reviewed = data.reviewed;
      if (data.reviewedAt) frontmatterData.reviewedAt = data.reviewedAt;

      
      
      if (
        data.customTags &&
        Array.isArray(data.customTags) &&
        data.customTags.length > 0
      ) {
        frontmatterData.tags = data.customTags.filter((tag: string) =>
          tag?.trim()
        );
      } else {
        frontmatterData.tags = [];
      }

      if (Object.prototype.hasOwnProperty.call(data, 'customFields')) {
        try {
          const fieldDefinitions =
            this.plugin?.customFieldsService?.getFields() || [];
          Object.assign(
            frontmatterData,
            mapCustomFieldsToFrontmatter(data.customFields, fieldDefinitions, {
              includeClearedFields: true,
            })
          );
        } catch (error) {
          console.error(
            'Error mapping custom field IDs to keys in missed trade update:',
            error
          );
        }
      }

      
      await this.updateFrontmatter(file, frontmatterData);

      
      eventBus.publish('missed-trade:changed', {
        action: 'updated',
        filePath,
        timestamp: Date.now(),
      });

      
      void this.clearCache();

      logger.debug(`Missed trade updated successfully: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('Error updating missed trade:', error);
      throw error;
    }
  }

  
  public async updateMissedTradeReviewStatus(
    filePath: string,
    reviewed: boolean,
    reviewedAt?: string
  ): Promise<void> {
    try {
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!file || !(file instanceof TFile)) {
        throw new Error(`Invalid file path: ${filePath}`);
      }

      const effectiveReviewedAt = reviewed
        ? reviewedAt || new Date().toISOString()
        : '';
      const frontmatterData: Record<string, unknown> = {
        reviewed,
        reviewedAt: effectiveReviewedAt,
      };

      await this.updateFrontmatter(file, frontmatterData);

      
      eventBus.publish('missed-trade:changed', {
        action: 'updated',
        filePath,
        timestamp: Date.now(),
        reviewed,
        reviewedAt: reviewed ? effectiveReviewedAt : undefined,
      });

      logger.debug(`Missed trade review status updated: ${filePath}`);
    } catch (error) {
      console.error('Error updating missed trade review status:', error);
      throw error;
    }
  }

  
  public async updateMissedTradeReview(
    filePath: string,
    lossReviewData: LossReviewData
  ): Promise<void> {
    try {
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!file || !(file instanceof TFile)) {
        throw new Error(`Invalid file path: ${filePath}`);
      }

      const frontmatterData: Record<string, unknown> = {
        lossReview: lossReviewData,
      };

      await this.updateFrontmatter(file, frontmatterData);

      
      eventBus.publish('missed-trade:changed', {
        action: 'updated',
        filePath,
        timestamp: Date.now(),
      });

      logger.debug(`Missed trade review data updated: ${filePath}`);
    } catch (error) {
      console.error('Error updating missed trade review data:', error);
      throw error;
    }
  }

  
  private async handleMissedTradeDeletion(filePath: string): Promise<void> {
    logger.debug('Handling missed trade deletion:', filePath);

    
    void this.clearCache();

    
    eventBus.publish('missed-trade:changed', {
      action: 'deleted',
      filePath,
      timestamp: Date.now(),
    });
    logger.debug('Emitted missed trade deletion event:', filePath);
  }

  
  public async generateMissedTradePath(
    data: Pick<MissedTradeFormData, 'instrument' | 'entryTime'>
  ): Promise<string> {
    
    const tradingDay = getTradingDay(data.entryTime, this.plugin);

    const year = tradingDay.getFullYear();
    const month = String(tradingDay.getMonth() + 1).padStart(2, '0');
    const day = String(tradingDay.getDate()).padStart(2, '0');
    const weekOfMonth = this.getWeekOfMonth(tradingDay);
    const quarter = getQuarterForMonth(tradingDay.getMonth() + 1);

    
    const ticker = data.instrument
      ? this.sanitizeTickerForFilename(data.instrument)
      : 'UNKNOWN';

    
    const dateFormat = this.plugin?.settings.trade.dateFormat || 'DDMMYY';
    let formattedDate = '';

    if (dateFormat === 'DDMMYY') {
      formattedDate = `${day}${month}${String(year).slice(2)}`;
    } else if (dateFormat === 'MMDDYY') {
      formattedDate = `${month}${day}${String(year).slice(2)}`;
    } else if (dateFormat === 'YYMMDD') {
      formattedDate = `${String(year).slice(2)}${month}${day}`;
    } else {
      
      formattedDate = `${day}${month}${String(year).slice(2)}`;
    }

    
    const missedTradeNumber = await this.getMissedTradeNumberForDay(
      ticker,
      tradingDay
    );

    
    const filename = `${ticker}-${formattedDate}-M${missedTradeNumber}.md`;

    
    const fullPath = this.folderPathService.getDatePathForQuarterSync(
      year.toString(),
      quarter,
      month,
      weekOfMonth,
      this.tradesFolder,
      filename
    );

    return fullPath;
  }

  
  public async getMissedTradeNumberForDay(
    ticker: string,
    date: Date
  ): Promise<number> {
    
    const targetFolder = this.getTargetFolderPath(date);

    
    const files = await this.listFilesInFolder(targetFolder);

    
    const dateFormat = this.plugin?.settings.trade.dateFormat || 'DDMMYY';
    const formattedDate = this.formatDateForFilename(date, dateFormat);

    
    const escapedTicker = ticker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `^${escapedTicker}-${formattedDate}-M(\\d+)\\.md$`
    );

    const existingNumbers = new Set<number>();

    
    
    const folderPrefix = `${targetFolder}/`;
    for (const pendingPath of this.recentlyCreatedFiles) {
      if (!pendingPath.startsWith(folderPrefix)) continue;
      const pendingName = pendingPath.split('/').pop() || '';
      const pendingMatch = pattern.exec(pendingName);
      if (pendingMatch) {
        existingNumbers.add(parseInt(pendingMatch[1], 10));
      }
    }

    
    for (const file of files) {
      const filename = file.split('/').pop() || '';
      const match = pattern.exec(filename);
      if (match) {
        existingNumbers.add(parseInt(match[1], 10));
      }
    }

    
    return existingNumbers.size > 0 ? Math.max(...existingNumbers) + 1 : 1;
  }

  
  private getAllMissedTradeFiles(): TFile[] {
    const allFiles = this.app.vault.getMarkdownFiles();

    return allFiles.filter((file: TFile) => {
      
      if (
        !this.folderPathService.isJournalPath(file.path) ||
        !file.path.includes('/trades/')
      ) {
        return false;
      }

      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (frontmatter?.type === 'missed-trade' || frontmatter?.isMissedTrade) {
        return true;
      }

      
      return file.path.match(/-M\d+\.md$/) !== null;
    });
  }

  
  public async getMissedTradeCount(): Promise<number> {
    const allFiles = this.app.vault.getMarkdownFiles();
    let count = 0;

    for (const file of allFiles) {
      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;

      if (frontmatter?.type === 'missed-trade' || frontmatter?.isMissedTrade) {
        count++;
        continue;
      }

      if (
        isTradeFolderPath(file.path) &&
        this.folderPathService.isJournalPath(file.path) &&
        /-M\d+\.md$/.test(file.path)
      ) {
        count++;
      }
    }

    return count;
  }

  
  public async getMissedTrades(
    startDate: Date,
    endDate: Date
  ): Promise<TFile[]> {
    
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    
    this.invalidateCache();

    
    const tradingStartDate = getTradingDay(startDate, this.plugin);
    const tradingEndDate = getTradingDay(endDate, this.plugin);

    
    tradingEndDate.setHours(23, 59, 59, 999);

    
    const allFiles = this.getAllMissedTradeFiles();

    const missedTradeFiles = await Promise.all(
      allFiles.map(async (file) => {
        try {
          
          if (
            !isTradeFolderPath(file.path) ||
            !this.folderPathService.isJournalPath(file.path)
          ) {
            return null;
          }

          const frontmatter = await this.readFrontmatter(file);

          if (
            !frontmatter ||
            (frontmatter.type !== 'missed-trade' && !frontmatter.isMissedTrade)
          ) {
            return null;
          }

          const entryTimeValue = frontmatter.entryTime;
          const entryTime =
            typeof entryTimeValue === 'string' ||
            typeof entryTimeValue === 'number' ||
            entryTimeValue instanceof Date
              ? new Date(entryTimeValue)
              : null;
          if (!entryTime) {
            return null;
          }

          
          const tradingDay = getTradingDay(entryTime, this.plugin);
          const matches =
            tradingDay >= tradingStartDate && tradingDay <= tradingEndDate;

          return matches ? file : null;
        } catch (error) {
          console.warn(`Failed to read frontmatter for ${file.path}:`, error);
          return null;
        }
      })
    );

    return missedTradeFiles.filter((file): file is TFile => file !== null);
  }

  
  private generateMissedTradeContent(data: MissedTradeFormData): string {
    const templateMetadata = getDefaultTradeTemplateMetadata(this.getPlugin());

    
    const frontmatterLines = [
      '---',
      'type: missed-trade',
      'isMissedTrade: true',
      `templateId: ${templateMetadata.templateId}`,
      `templateVersion: ${templateMetadata.templateVersion}`,
      `entryTime: ${this.formatDateForFrontmatter(data.entryTime)}`,
      `exitTime: ${this.formatDateForFrontmatter(data.exitTime || data.entryTime)}`,
      `entryPrice: ${data.entryPrice || 0}`,
      `exitPrice: ${data.exitPrice || 0}`,
      `positionSize: ${data.positionSize || 0}`,
      data.direction ? `direction: ${data.direction}` : null,
      data.optionType ? `optionType: ${data.optionType}` : null,
      `instrument: ${data.instrument}`,

      
      `pnl: ${calculatePnL(data)}`,
      calculatePersistableRMultiple(data) !== undefined
        ? `rMultiple: ${calculatePersistableRMultiple(data)}`
        : null,
      data.useDirectPnLInput !== undefined
        ? `useDirectPnLInput: ${data.useDirectPnLInput}`
        : null,
      data.directPnL !== undefined ? `directPnL: ${data.directPnL}` : null,

      
      data.commission !== undefined ? `commission: ${data.commission}` : null,
      data.commissionType !== undefined
        ? `commissionType: ${data.commissionType}`
        : null,
      data.hasExplicitCommission !== undefined
        ? `hasExplicitCommission: ${data.hasExplicitCommission}`
        : null,
      data.fees !== undefined ? `fees: ${data.fees}` : null,

      
      data.assetType ? `assetType: ${data.assetType}` : null,
      ...this.serializeYamlStringProperty(
        'thesis',
        data.thesis !== undefined ? data.thesis || '' : undefined
      ),
      data.missedReason !== undefined
        ? `missedReason: ${JSON.stringify(data.missedReason || '')}`
        : null,

      
      data.setup?.length
        ? `setup: [${data.setup.map((setup) => `"${setup}"`).join(', ')}]`
        : null,
      data.mistake?.length
        ? `mistake: [${data.mistake.map((mistake) => `"${mistake}"`).join(', ')}]`
        : null,
      data.account?.length
        ? `account: [${data.account.map((account) => `"${account}"`).join(', ')}]`
        : null,

      
      data.images?.length
        ? `images: [${data.images.map((img) => `"${img.trim()}"`).join(', ')}]`
        : null,

      
      
      'tags: []',
    ];

    const validEntries = data.entries?.flatMap((entry) =>
      entry.time instanceof Date &&
      !Number.isNaN(entry.time.getTime()) &&
      entry.price !== undefined &&
      entry.size !== undefined &&
      entry.size > 0
        ? [
            {
              time: this.formatDateForFrontmatter(entry.time),
              price: entry.price,
              size: entry.size,
              ...(entry.notional !== undefined
                ? { notional: entry.notional }
                : {}),
            },
          ]
        : []
    );
    const validExits = data.exits?.flatMap((exit) =>
      exit.time instanceof Date &&
      !Number.isNaN(exit.time.getTime()) &&
      exit.price !== undefined &&
      exit.size !== undefined &&
      exit.size > 0
        ? [
            {
              time: this.formatDateForFrontmatter(exit.time),
              price: exit.price,
              size: exit.size,
              ...(exit.notional !== undefined
                ? { notional: exit.notional }
                : {}),
            },
          ]
        : []
    );

    if (validEntries?.length) {
      frontmatterLines.push(`entries: ${JSON.stringify(validEntries)}`);
    }
    if (validExits?.length) {
      frontmatterLines.push(`exits: ${JSON.stringify(validExits)}`);
    }
    const idealExits = serializeIdealExitFrontmatter(data.idealExits);
    if (idealExits.length) {
      frontmatterLines.push(`idealExits: ${JSON.stringify(idealExits)}`);
    }

    
    const knownFields = new Set([
      'type',
      'isMissedTrade',
      'entryTime',
      'exitTime',
      'entryPrice',
      'exitPrice',
      'positionSize',
      'direction',
      'optionType',
      'instrument',
      'pnl',
      'rMultiple',
      'useDirectPnLInput',
      'directPnL',
      'idealExits',
      'commission',
      'commissionType',
      'hasExplicitCommission',
      'fees',
      'assetType',
      'thesis',
      'missedReason',

      'setup',
      'mistake',
      'account',
      'images',
      'tags',
      'notes',
      'customFields',
      'entries',
      'exits',
    ]);

    
    if (data.customFields) {
      try {
        const fieldDefinitions =
          this.plugin?.customFieldsService?.getFields() || [];
        const mappedCustomFields = mapCustomFieldsToFrontmatter(
          data.customFields,
          fieldDefinitions
        );

        Object.entries(mappedCustomFields).forEach(([key, value]) => {
          if (value === undefined) {
            return;
          }

          if (Array.isArray(value)) {
            frontmatterLines.push(
              `${key}: [${value.map((entry) => JSON.stringify(entry)).join(', ')}]`
            );
          } else if (typeof value === 'string') {
            frontmatterLines.push(`${key}: ${JSON.stringify(value)}`);
          } else {
            frontmatterLines.push(`${key}: ${safeString(value)}`);
          }
        });
      } catch (error) {
        console.error(
          'Error mapping custom field IDs to keys in missed trade:',
          error
        );
      }
    }

    
    Object.keys(data).forEach((key) => {
      if (
        !knownFields.has(key) &&
        data[key] !== undefined &&
        data[key] !== null
      ) {
        const value = data[key];
        if (Array.isArray(value)) {
          frontmatterLines.push(
            `${key}: [${value.map((v) => JSON.stringify(v)).join(', ')}]`
          );
        } else if (typeof value === 'string') {
          frontmatterLines.push(`${key}: ${JSON.stringify(value)}`);
        } else if (typeof value === 'object') {
          
          frontmatterLines.push(`${key}: ${JSON.stringify(value)}`);
        } else {
          frontmatterLines.push(`${key}: ${safeString(value)}`);
        }
      }
    });

    frontmatterLines.push('---');

    
    const markdownContent = [
      ...frontmatterLines,
      '',
      '# Missed Trade Notes',
      '',
      data.notes || 'Add any additional notes about this missed trade here.',
    ];

    
    return markdownContent.filter((line) => line !== null).join('\n');
  }

  
  private getTargetFolderPath(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const weekOfMonth = this.getWeekOfMonth(date);
    const quarter = getQuarterForMonth(date.getMonth() + 1);

    return this.folderPathService.getDatePathForQuarterSync(
      year.toString(),
      quarter,
      month,
      weekOfMonth,
      this.tradesFolder
    );
  }

  
  private getWeekOfMonth(date: Date): string {
    
    return getWeekFolderName(date, date.getFullYear());
  }

  
  private formatDateForFilename(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    switch (format) {
      case 'DDMMYY':
        return `${day}${month}${String(year).slice(2)}`;
      case 'MMDDYY':
        return `${month}${day}${String(year).slice(2)}`;
      case 'YYMMDD':
        return `${String(year).slice(2)}${month}${day}`;
      default:
        return `${day}${month}${String(year).slice(2)}`;
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

  
  private async listFilesInFolder(folderPath: string): Promise<string[]> {
    try {
      const files = await this.app.vault.adapter.list(folderPath);
      return files.files || [];
    } catch {
      
      return [];
    }
  }

  
  private formatDateForFrontmatter(date: Date): string {
    return date.toISOString();
  }

  private serializeYamlStringProperty(
    key: string,
    value: string | undefined
  ): string[] {
    if (value === undefined) {
      return [];
    }

    if (value.includes('\n')) {
      return [`${key}: |-`, ...value.split('\n').map((line) => `  ${line}`)];
    }

    return [`${key}: ${JSON.stringify(value)}`];
  }
}
