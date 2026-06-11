import { logger } from '../../utils/logger';


import { TFile, TFolder, Notice } from 'obsidian';
import JournalitPlugin from '../../main';
import { ApiClient } from './ApiClient';
import {
  Trade,
  TradesResponse,
  TradeSyncMapping,
  TradeMetadata,
} from './types';
import {
  BackendIntegrationSettings,
  DEFAULT_SETTINGS,
} from '../../settings/types';
import { FolderPathService } from '../core/FolderPathService';
import {
  getQuarterForMonth,
  getWeekFolderName,
  safeGetTime,
  safeParseDateValue,
} from '../../utils/dateUtils';
import { eventBus, FolderPathChangedPayload, Unsubscribe } from '../events';
import { t } from '../../lang/helpers';
import { getTradeIdentityNoteType } from '../../utils/tradeIdentity';
import { normalizeTradeExecution } from '../trade/core/TradeExecutionNormalization';

interface SyncTradeMatchIdentity {
  symbol: string;
  entryTime: Date;
  entryPrice: number;
  volume: number;
}

const MARKDOWN_OBJECT_ARRAY_FRONTMATTER_KEYS = new Set([
  'entries',
  'exits',
  'dividends',
]);

const MARKDOWN_SCALAR_ARRAY_FRONTMATTER_KEYS = new Set([
  'account',
  'tags',
  'customTags',
  'setup',
  'setupIds',
  'mistake',
  'mistakeIds',
  'executionIds',
  'images',
]);

const MARKDOWN_NUMERIC_FRONTMATTER_KEYS = new Set([
  'backendTradeId',
  'schemaVersion',
  'tradeRevision',
  'canonicalExecutionMigrationVersion',
  'executionLedgerVersion',
  'entryPrice',
  'exitPrice',
  'positionSize',
  'price',
  'size',
  'quantity',
  'notional',
  'amount',
  'pnl',
  'directPnL',
  'commission',
  'fees',
  'swap',
  'rebate',
  'riskAmount',
  'rMultiple',
  'stopLoss',
  'contractSize',
  'dollarPerPoint',
  'tickSize',
  'tickValue',
  'lotSize',
  'pipValue',
  'pipSize',
  'strikePrice',
  'leverageRatio',
]);

export class TradeSyncService {
  private plugin: JournalitPlugin;
  private folderPathService: FolderPathService;

  
  private get settings(): BackendIntegrationSettings {
    if (!this.plugin.settings.backendIntegration) {
      console.error(
        'TradeSyncService: backendIntegration is undefined, using defaults'
      );
      this.plugin.settings.backendIntegration = {
        ...DEFAULT_SETTINGS.backendIntegration!,
      };
    }
    return this.plugin.settings.backendIntegration;
  }
  private tradeSyncMapping: TradeSyncMapping = {};
  private tradeFileCache: Map<
    string,
    {
      path: string;
      metadata: TradeMetadata;
      symbol: string;
      entryTime: Date;
      entryPrice: number;
      volume: number;
    }
  > = new Map();
  private csvImportIdMap: { [csvImportId: string]: string } = {};
  private cacheBuilt: boolean = false;
  private isRebuilding: boolean = false;
  private unsubscribeFolderPath: Unsubscribe | null = null;

  constructor(
    plugin: JournalitPlugin,
    _settings: BackendIntegrationSettings,
    folderPathService: FolderPathService
  ) {
    this.plugin = plugin;
    
    
    this.folderPathService = folderPathService;

    
    this.unsubscribeFolderPath = eventBus.subscribe(
      'folder-path:changed',
      (payload: FolderPathChangedPayload) => {
        void this.onFolderPathChanged(payload);
      }
    );
  }

  
  async loadSyncMapping(): Promise<void> {
    const stored = this.settings.tradeSyncMapping;
    if (stored) {
      this.tradeSyncMapping = stored;
    }

    
    await this.rebuildSyncMapping();
  }

  
  private createCacheKey(
    symbol: string,
    entryTime: Date,
    entryPrice: number,
    volume: number
  ): string {
    
    const timeInSeconds = Math.floor(entryTime.getTime() / 1000);
    return `${encodeURIComponent(symbol)}|${timeInSeconds}|${entryPrice}|${volume}`;
  }

  private parseBooleanLike(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value !== 'string') {
      return false;
    }

    return value.trim().toLowerCase() === 'true';
  }

  private normalizeDirectionForDirectPnl(
    value: unknown
  ): 'long' | 'short' | null {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim().toLowerCase();
    if (
      normalized === 'long' ||
      normalized === 'buy' ||
      normalized === 'b' ||
      normalized === 'l'
    ) {
      return 'long';
    }

    if (normalized === 'short' || normalized === 'sell' || normalized === 's') {
      return 'short';
    }

    return null;
  }

  private parseNumericValue(value: unknown): number | null {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    if (typeof value !== 'string') {
      return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const parsed = parseFloat(trimmed.replace(/[,$]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }

  private normalizeNumericKeyPart(value: number): string {
    const normalized = Object.is(value, -0) ? 0 : value;
    return `${normalized}`;
  }

  private roundToFixedKeyPart(value: number, decimals: number): string {
    const factor = 10 ** decimals;
    const epsilon = value >= 0 ? Number.EPSILON : -Number.EPSILON;
    const rounded = Math.round((value + epsilon) * factor) / factor;
    const normalized = Object.is(rounded, -0) ? 0 : rounded;

    return normalized.toFixed(decimals);
  }

  private getPrimaryAccountName(metadata: TradeMetadata): string | null {
    const source = Array.isArray(metadata.account)
      ? metadata.account
      : metadata.account
        ? [metadata.account]
        : [];

    for (const value of source) {
      const trimmed = String(value)
        .trim()
        .replace(/^['"`]+|['"`]+$/g, '');
      if (trimmed) {
        return trimmed;
      }
    }

    return null;
  }

  private buildDirectPnlCsvImportId(
    metadata: TradeMetadata,
    entryTime: Date,
    canonicalVolume?: number
  ): string | null {
    const directFlag = this.parseBooleanLike(
      (metadata as TradeMetadata & { useDirectPnLInput?: unknown })
        .useDirectPnLInput
    );

    if (!directFlag) {
      return null;
    }

    const accountName = this.getPrimaryAccountName(metadata);
    const symbol = metadata.instrument?.trim();
    const direction = this.normalizeDirectionForDirectPnl(metadata.direction);
    const quantity =
      canonicalVolume ?? this.parseNumericValue(metadata.positionSize);
    const directPnl = this.parseNumericValue(
      (metadata as TradeMetadata & { directPnL?: unknown }).directPnL ??
        metadata.pnl
    );

    if (
      !accountName ||
      !symbol ||
      !direction ||
      quantity === null ||
      directPnl === null
    ) {
      return null;
    }

    const timeInSeconds = Math.floor(entryTime.getTime() / 1000);
    const bucket = Math.floor(timeInSeconds / 60) * 60;

    return `${accountName}_${symbol}_${direction}_${bucket}_${this.normalizeNumericKeyPart(
      quantity
    )}_${this.roundToFixedKeyPart(directPnl, 2)}`;
  }

  private getCanonicalMatchIdentity(
    metadata: TradeMetadata
  ): SyncTradeMatchIdentity | null {
    if (!metadata.instrument) {
      return null;
    }

    const execution = normalizeTradeExecution(metadata, {
      deriveMissingExplicitness: true,
    });
    const volume = this.getCanonicalEntrySize(metadata, execution.entries);
    const entryPrice =
      execution.weightedEntryPrice ??
      (execution.useDirectPnLInput
        ? (execution.entryPrice ?? this.getDirectPnlEntryPrice(metadata))
        : null);

    if (!execution.firstEntryTime || entryPrice === null || volume === null) {
      return null;
    }

    return {
      symbol: metadata.instrument,
      entryTime: execution.firstEntryTime,
      entryPrice,
      volume,
    };
  }

  private getCanonicalEntrySize(
    metadata: TradeMetadata,
    entries: Array<{ size: number | null }>
  ): number | null {
    const entriesSize = entries.reduce(
      (sum, entry) =>
        entry.size !== null && entry.size > 0 ? sum + entry.size : sum,
      0
    );

    if (entriesSize > 0) {
      return entriesSize;
    }

    if (
      this.parseBooleanLike(
        (metadata as TradeMetadata & { useDirectPnLInput?: unknown })
          .useDirectPnLInput
      ) &&
      entries.some((entry) => entry.size === 0)
    ) {
      return 0;
    }

    return this.parseNumericValue(metadata.positionSize);
  }

  private getDirectPnlEntryPrice(metadata: TradeMetadata): number | null {
    if (!Array.isArray(metadata.entries)) {
      return null;
    }

    for (const entry of metadata.entries) {
      const price = this.parseNumericValue(entry?.price);
      if (price !== null) {
        return price;
      }
    }

    return null;
  }

  
  async buildTradeFileCache(): Promise<void> {
    this.tradeFileCache.clear();
    this.csvImportIdMap = {};

    try {
      
      const allFiles = this.plugin.app.vault.getMarkdownFiles();
      const tradeFiles = allFiles.filter((file) => this.isTradeFile(file));

      
      const BATCH_SIZE = 20;
      const batches = [];
      for (let i = 0; i < tradeFiles.length; i += BATCH_SIZE) {
        batches.push(tradeFiles.slice(i, i + BATCH_SIZE));
      }

      for (const [batchIndex, batch] of batches.entries()) {
        
        const batchPromises = batch.map(async (file) => {
          try {
            const metadata = await this.readTradeMetadata(file);
            const matchIdentity = metadata
              ? this.getCanonicalMatchIdentity(metadata)
              : null;

            if (metadata?.csvImportId) {
              this.csvImportIdMap[metadata.csvImportId] = file.path;
            }

            if (metadata && matchIdentity) {
              const cacheKey = this.createCacheKey(
                matchIdentity.symbol,
                matchIdentity.entryTime,
                matchIdentity.entryPrice,
                matchIdentity.volume
              );

              
              
              
              const directPnlCsvImportId = this.buildDirectPnlCsvImportId(
                metadata,
                matchIdentity.entryTime,
                matchIdentity.volume
              );
              if (directPnlCsvImportId) {
                this.csvImportIdMap[directPnlCsvImportId] = file.path;
              }

              this.tradeFileCache.set(cacheKey, {
                path: file.path,
                metadata,
                symbol: matchIdentity.symbol,
                entryTime: matchIdentity.entryTime,
                entryPrice: matchIdentity.entryPrice,
                volume: matchIdentity.volume,
              });
            }
          } catch (error) {
            console.warn(`Error caching trade file ${file.path}:`, error);
          }
        });

        await Promise.all(batchPromises);

        
        if (batchIndex < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }

      this.cacheBuilt = true;
    } catch (error) {
      console.error('Error building trade file cache:', error);
      this.cacheBuilt = false;
    }
  }

  
  clearTradeFileCache(): void {
    this.tradeFileCache.clear();
    this.csvImportIdMap = {};
    this.cacheBuilt = false;
  }

  
  private async rebuildSyncMapping(oldPath?: string): Promise<void> {
    const tradeFiles = this.plugin.app.vault
      .getMarkdownFiles()
      .filter((file) => {
        
        const matchesCurrentPath = this.isTradeFile(file);

        
        if (oldPath && !matchesCurrentPath) {
          return this.isTradeFileAtPath(file, oldPath);
        }

        return matchesCurrentPath;
      });

    
    if (tradeFiles.length === 0) {
      this.tradeSyncMapping = {};
      await this.saveSyncMapping();
      return;
    }

    
    const newMapping: { [key: number]: string } = {};

    for (const file of tradeFiles) {
      try {
        const content = await this.plugin.app.vault.read(file);
        const tradeMeta = this.parseTradeFromMarkdown(content, file.path);

        if (tradeMeta && tradeMeta.backendTradeId) {
          newMapping[tradeMeta.backendTradeId] = file.path;
        }
      } catch (error) {
        console.error('Error reading trade file for sync mapping:', error);
      }
    }

    
    this.tradeSyncMapping = newMapping;
    await this.saveSyncMapping();
  }

  
  async saveSyncMapping(): Promise<boolean> {
    const MAX_RETRIES = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        
        this.settings.tradeSyncMapping = this.tradeSyncMapping;

        
        await this.plugin.saveSettings();

        
        if (this.settings.tradeSyncMapping === this.tradeSyncMapping) {
          return true;
        }

        console.warn(
          `Mapping save verification failed on attempt ${attempt + 1}`
        );
      } catch (error) {
        lastError = error;
        console.error(
          `Failed to save sync mapping on attempt ${attempt + 1}:`,
          error
        );

        
        if (attempt < MAX_RETRIES - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, 100 * (attempt + 1))
          );
        }
      }
    }

    
    console.error(
      `Failed to save sync mapping after ${MAX_RETRIES} attempts:`,
      lastError
    );
    return false;
  }

  
  async addMappingBatch(
    mappings: Array<{ tradeId: number; filePath: string }>
  ): Promise<boolean> {
    for (const { tradeId, filePath } of mappings) {
      this.tradeSyncMapping[tradeId] = filePath;
    }

    return await this.saveSyncMapping();
  }

  
  async validateMappingIntegrity(): Promise<number> {
    let removedCount = 0;
    const invalidIds: number[] = [];

    for (const [tradeId, filePath] of Object.entries(this.tradeSyncMapping)) {
      const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
      if (!file) {
        invalidIds.push(Number(tradeId));
        removedCount++;
      }
    }

    if (invalidIds.length > 0) {
      console.warn(`Removing ${invalidIds.length} invalid mapping entries`);
      for (const tradeId of invalidIds) {
        delete this.tradeSyncMapping[tradeId];
      }

      await this.saveSyncMapping();
    }

    return removedCount;
  }

  
  private async onFolderPathChanged(
    payload: FolderPathChangedPayload
  ): Promise<void> {
    const newPath = payload.value;
    
    const oldPath = this.folderPathService.journalFolderPath;

    
    if (this.isRebuilding) {
      logger.debug('Sync mapping rebuild already in progress, skipping...');
      return;
    }

    this.isRebuilding = true;

    try {
      logger.debug(
        `Folder path changed from "${oldPath}" to "${newPath}", rebuilding sync mapping...`
      );

      
      const notice = new Notice(t('notice.sync-mapping.updating'), 0);

      
      await this.rebuildSyncMapping(oldPath);

      notice.hide();
      new Notice(t('notice.sync-mapping.updated'), 3000);

      logger.debug('Sync mapping rebuilt successfully');
    } catch (error) {
      console.error('Error rebuilding sync mapping:', error);
      new Notice(t('notice.error.sync-mapping-update-failed'), 5000);
    } finally {
      this.isRebuilding = false;
    }
  }

  
  public cleanup(): void {
    if (this.unsubscribeFolderPath) {
      this.unsubscribeFolderPath();
      this.unsubscribeFolderPath = null;
    }
  }

  
  getSyncMapping(): TradeSyncMapping {
    return this.tradeSyncMapping;
  }

  
  addMapping(tradeId: number, filePath: string): void {
    this.tradeSyncMapping[tradeId] = filePath;
  }

  
  removeMapping(tradeId: number): void {
    delete this.tradeSyncMapping[tradeId];
  }

  
  getFilePathForTrade(tradeId: number): string | undefined {
    return this.tradeSyncMapping[tradeId];
  }

  public getValidatedFilePathForTrade(tradeId: number): string | undefined {
    const existingPath = this.getFilePathForTrade(tradeId);
    if (!existingPath) {
      return undefined;
    }

    const existingFile =
      this.plugin.app.vault.getAbstractFileByPath(existingPath);
    if (!(existingFile instanceof TFile)) {
      this.removeMapping(tradeId);
      return undefined;
    }

    const frontmatter =
      this.plugin.app.metadataCache.getFileCache(existingFile)?.frontmatter;

    if (!frontmatter) {
      return existingFile.path;
    }

    if (this.isSyncTradeCandidate(frontmatter, existingFile.path)) {
      return existingFile.path;
    }

    this.removeMapping(tradeId);
    return undefined;
  }

  private isBooleanTrue(value: unknown): boolean {
    return value === true || value === 'true';
  }

  private isSyncTradeCandidate(
    frontmatter: Record<string, unknown> | null | undefined,
    filePath: string
  ): boolean {
    if (
      this.isBooleanTrue(frontmatter?.isMissedTrade) ||
      this.isBooleanTrue(frontmatter?.isBacktestTrade) ||
      frontmatter?.type === 'missed-trade' ||
      frontmatter?.type === 'backtest-trade'
    ) {
      return false;
    }

    if (frontmatter?.type === 'trade') {
      return true;
    }

    return (
      this.folderPathService.isJournalPath(filePath) &&
      getTradeIdentityNoteType(frontmatter, filePath) === 'trade'
    );
  }

  
  async fetchAllTrades(_accountId: number): Promise<Trade[]> {
    const allTrades: Trade[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      
      const url = ApiClient.buildUrl('/api/v1/trades', {
        limit,
        offset,
      });

      const response = await ApiClient.makeRequest<TradesResponse>(
        url,
        { method: 'GET' },
        'fetch trades'
      );

      if (!response || !response.trades) {
        console.warn('Invalid response from trades API:', response);
        break;
      }

      if (Array.isArray(response.trades)) {
        allTrades.push(...response.trades);
      }
      hasMore = response.pagination?.has_more || false;
      offset += limit;
    }

    return allTrades;
  }

  
  isTradeFile(file: TFile): boolean {
    return (
      this.folderPathService.isJournalPath(file.path) &&
      file.path.includes('/trades/') &&
      file.extension === 'md'
    );
  }

  
  private isTradeFileAtPath(file: TFile, basePath: string): boolean {
    const normalizedPath = file.path.toLowerCase().replace(/\\/g, '/');
    const normalizedBasePath = basePath.toLowerCase().replace(/\\/g, '/');

    return (
      (normalizedPath.startsWith(normalizedBasePath + '/') ||
        normalizedPath === normalizedBasePath) &&
      file.path.includes('/trades/') &&
      file.extension === 'md'
    );
  }

  
  parseTradeFromMarkdown(
    content: string,
    filePath?: string
  ): TradeMetadata | null {
    try {
      
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return null;

      const frontmatter = frontmatterMatch[1];

      const trade: any = {};

      
      const lines = frontmatter.split('\n');
      let currentArrayKey: string | null = null;
      let currentArrayItem: Record<string, unknown> | null = null;
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        if (currentArrayKey && trimmedLine.startsWith('- ')) {
          const itemValue = trimmedLine.substring(2).trim();
          if (MARKDOWN_OBJECT_ARRAY_FRONTMATTER_KEYS.has(currentArrayKey)) {
            currentArrayItem = {};
            trade[currentArrayKey].push(currentArrayItem);
            this.parseMarkdownFrontmatterProperty(currentArrayItem, itemValue);
          } else {
            currentArrayItem = null;
            trade[currentArrayKey].push(
              this.parseMarkdownScalarValue(currentArrayKey, itemValue)
            );
          }
          continue;
        }

        if (currentArrayKey && currentArrayItem && /^\s+/.test(line)) {
          this.parseMarkdownFrontmatterProperty(currentArrayItem, trimmedLine);
          continue;
        }

        currentArrayKey = null;
        currentArrayItem = null;

        const colonIndex = line.search(/:/);
        if (colonIndex === -1) continue;

        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();

        if (!key) continue;

        if (
          !value &&
          (MARKDOWN_OBJECT_ARRAY_FRONTMATTER_KEYS.has(key) ||
            MARKDOWN_SCALAR_ARRAY_FRONTMATTER_KEYS.has(key))
        ) {
          trade[key] = [];
          currentArrayKey = key;
          continue;
        }

        if (!value) continue;

        
        if (value.startsWith('[') && value.endsWith(']')) {
          
          const arrayContent = value.substring(1, value.length - 1).trim();
          if (arrayContent) {
            
            trade[key] = arrayContent.split(',').map((item) => item.trim());
          } else {
            trade[key] = [];
          }
        } else {
          trade[key] = this.parseMarkdownScalarValue(key, value);
        }
      }

      return this.normalizeTradeMetadata(trade, filePath);
    } catch (error) {
      console.error('Error parsing trade markdown:', error);
      return null;
    }
  }

  private parseMarkdownFrontmatterProperty(
    target: Record<string, unknown>,
    propertyLine: string
  ): void {
    const colonIndex = propertyLine.indexOf(':');
    if (colonIndex === -1) return;

    const key = propertyLine.substring(0, colonIndex).trim();
    const value = propertyLine.substring(colonIndex + 1).trim();
    if (!key || !value) return;

    target[key] = this.parseMarkdownScalarValue(key, value);
  }

  private parseMarkdownScalarValue(
    key: string,
    value: string
  ): string | number {
    const isQuoted = /^['"].*['"]$/.test(value);
    const unquoted = value.replace(/^['"]|['"]$/g, '');
    if (isQuoted || !this.isMarkdownNumericFrontmatterKey(key)) {
      return unquoted;
    }

    const numericValue = Number(unquoted);
    return Number.isFinite(numericValue) && unquoted.trim() !== ''
      ? numericValue
      : unquoted;
  }

  private isMarkdownNumericFrontmatterKey(key: string): boolean {
    return MARKDOWN_NUMERIC_FRONTMATTER_KEYS.has(key);
  }

  private async readTradeMetadata(file: TFile): Promise<TradeMetadata | null> {
    const cachedFrontmatter =
      this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;
    const cachedMetadata = this.normalizeTradeMetadata(
      cachedFrontmatter,
      file.path
    );
    if (cachedMetadata) {
      return cachedMetadata;
    }

    const content = await this.plugin.app.vault.read(file);
    return this.parseTradeFromMarkdown(content, file.path);
  }

  private normalizeTradeMetadata(
    value: unknown,
    filePath?: string
  ): TradeMetadata | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const trade = { ...(value as Record<string, unknown>) };
    const isValidSyncTrade = filePath
      ? this.isSyncTradeCandidate(trade, filePath)
      : trade.type === 'trade' || trade.type === 'backtest-trade';

    const hasAllowedDirection =
      Boolean(trade.direction) || trade.assetType === 'options';

    if (!trade.instrument || !hasAllowedDirection || !isValidSyncTrade) {
      return null;
    }

    if (trade.backendTradeId) {
      const backendTradeId = this.parseNumericValue(trade.backendTradeId);
      trade.backendTradeId = backendTradeId ?? undefined;
    }
    if (typeof trade.mtComment === 'string') {
      const trimmedComment = trade.mtComment.trim();
      trade.mtComment = trimmedComment.length > 0 ? trimmedComment : undefined;
    }

    return trade as unknown as TradeMetadata;
  }

  
  async findExistingTradeFile(
    trade: Trade,
    dateStr: string,
    entryTime: Date
  ): Promise<string | null> {
    
    if (this.cacheBuilt) {
      return this.findExistingTradeFileFromCache(trade);
    }

    
    return this.findExistingTradeFileFromDisk(trade, dateStr, entryTime);
  }

  
  public getCacheSize(): number {
    return this.tradeFileCache.size;
  }

  
  public async findExistingTradeFileFromCache(
    trade: Trade
  ): Promise<string | null> {
    
    if (trade.csvImportId && this.csvImportIdMap[trade.csvImportId]) {
      return this.csvImportIdMap[trade.csvImportId];
    }

    
    const existingPath = this.getValidatedFilePathForTrade(trade.id);
    if (existingPath) {
      return existingPath;
    }

    
    if (trade.id) {
      const frontmatterPath = await this.findTradeFileByBackendId(trade.id);
      if (frontmatterPath) {
        return frontmatterPath;
      }
    }

    
    const tradeEntryTime = safeParseDateValue(trade.entry_time);
    if (!tradeEntryTime) {
      console.warn(
        `Invalid entry time for trade ${trade.symbol}: ${trade.entry_time}`
      );
      return null;
    }

    
    const primaryKey = this.createCacheKey(
      trade.symbol,
      tradeEntryTime,
      trade.entry_price,
      trade.volume
    );
    const exactMatch = this.tradeFileCache.get(primaryKey);
    if (exactMatch) {
      return exactMatch.path;
    }

    
    const TIME_TOLERANCE = 60000;
    const PRICE_TOLERANCE = 0.00001;

    for (const [_key, cachedTrade] of this.tradeFileCache.entries()) {
      if (
        cachedTrade.symbol === trade.symbol &&
        Math.abs(cachedTrade.volume - trade.volume) < 0.001
      ) {
        const cachedTime = safeGetTime(cachedTrade.entryTime);
        const tradeTime = safeGetTime(tradeEntryTime);

        if (cachedTime === null || tradeTime === null) {
          continue; 
        }

        const timeDiff = Math.abs(cachedTime - tradeTime);
        const priceDiff = Math.abs(cachedTrade.entryPrice - trade.entry_price);

        if (timeDiff < TIME_TOLERANCE && priceDiff < PRICE_TOLERANCE) {
          return cachedTrade.path;
        }
      }
    }

    return null;
  }

  
  private async findTradeFileByBackendId(
    tradeId: number
  ): Promise<string | null> {
    if (!tradeId) return null;

    try {
      
      const allFiles = this.plugin.app.vault.getMarkdownFiles();
      const tradeFiles = allFiles.filter((file) => this.isTradeFile(file));

      
      for (const file of tradeFiles) {
        const frontmatter =
          this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;

        if (
          this.isSyncTradeCandidate(frontmatter, file.path) &&
          frontmatter?.backendTradeId === tradeId
        ) {
          logger.debug(
            `Found trade via frontmatter scan: ${tradeId} -> ${file.path}`
          );

          
          this.addMapping(tradeId, file.path);
          const saved = await this.saveSyncMapping();
          if (!saved) {
            console.warn(`Failed to save rebuilt mapping for trade ${tradeId}`);
          }

          return file.path;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error scanning frontmatter for trade ${tradeId}:`, error);
      return null;
    }
  }

  
  private async findExistingTradeFileFromDisk(
    trade: Trade,
    dateStr: string,
    entryTime: Date
  ): Promise<string | null> {
    const year = entryTime.getFullYear();
    const monthNum = entryTime.getMonth() + 1;
    const month = String(monthNum).padStart(2, '0');
    const quarter = getQuarterForMonth(monthNum);
    const weekFolderName = getWeekFolderName(entryTime, year);

    const tradesDir = this.folderPathService.getDatePathForQuarterSync(
      String(year),
      quarter,
      month,
      weekFolderName,
      'trades'
    );
    const folder = this.plugin.app.vault.getAbstractFileByPath(tradesDir);

    if (folder && folder instanceof TFolder) {
      const prefix = `${trade.symbol}-${dateStr}-T`;

      
      const existingPath = this.getValidatedFilePathForTrade(trade.id);
      if (existingPath) {
        return existingPath;
      }

      
      const candidateFiles = folder.children.filter(
        (child): child is TFile =>
          child instanceof TFile && child.name.startsWith(prefix)
      );

      if (candidateFiles.length === 0) {
        return null;
      }

      
      const checkPromises = candidateFiles.map(async (file) => {
        try {
          const tradeMeta = await this.readTradeMetadata(file);

          if (tradeMeta) {
            if (
              tradeMeta.backendTradeId &&
              tradeMeta.backendTradeId === trade.id
            ) {
              return file.path;
            }

            const matchIdentity = this.getCanonicalMatchIdentity(tradeMeta);
            const tradeEntryTime = safeParseDateValue(trade.entry_time);

            if (!matchIdentity || !tradeEntryTime) {
              return null; 
            }

            const timeDiff = Math.abs(
              matchIdentity.entryTime.getTime() - tradeEntryTime.getTime()
            );
            const priceMatch =
              Math.abs(matchIdentity.entryPrice - trade.entry_price) < 0.00001;
            const volumeMatch =
              Math.abs(matchIdentity.volume - trade.volume) < 0.001;
            const instrumentMatch = matchIdentity.symbol === trade.symbol;

            if (
              timeDiff < 60000 &&
              priceMatch &&
              volumeMatch &&
              instrumentMatch
            ) {
              return file.path;
            }
          }
        } catch (error) {
          console.warn(`Error checking trade file ${file.path}:`, error);
        }
        return null;
      });

      const results = await Promise.all(checkPromises);
      return results.find((path) => path !== null) || null;
    }

    return null;
  }
}
