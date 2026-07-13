import { logger } from '../../utils/logger';


import { TFile, TFolder } from 'obsidian';
import JournalitPlugin from '../../main';
import { Trade } from './types';
import { BackendIntegrationSettings } from '../../settings/types';
import { ensureInstrumentOptionsExist } from '../options/instrumentOptionHelper';
import { FolderPathService } from '../core/FolderPathService';
import { formatPnL } from '../../utils/formatting';
import {
  calculatePnL,
  deriveRawDirectPnLFromStoredCombinedPnL,
} from '../../utils/pnlCalculation';
import { generateUUID } from '../../utils/uuid';
import { deduplicateOptions } from '../../utils/stringNormalization';
import { hasRealizedPnLComponents } from '../../utils/tradeStatusUtils';
import { buildTradeIdentityFields } from '../../utils/tradeIdentity';
import {
  buildTradeFilePath,
  buildTradeDirectoryPath,
  formatTradeDateForFilename,
  sanitizeTradeSymbolForFilename,
} from '../trade/core/TradePathPolicy';
import {
  buildTradeFrontmatter,
  serializeTradeFrontmatter,
} from '../trade/core/TradeFrontmatterCodec';
import { USER_OWNED_TRADE_CONTENT_MARKER } from '../trade/core/TradeNoteDocumentCodec';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const getErrorCode = (error: unknown): string | undefined =>
  error && typeof error === 'object' && 'code' in error
    ? String(error.code)
    : undefined;

const FILE_ALREADY_EXISTS_PATTERN = /already exists/;

const normalizeMetaTraderRiskTarget = (
  value: number | null | undefined
): number | undefined =>
  value !== undefined && value !== null && value !== 0 ? value : undefined;

const parseTradeStatus = (value: unknown): 'OPEN' | 'CLOSED' | null => {
  switch (value) {
    case 'OPEN':
    case 'CLOSED':
      return value;
    default:
      return null;
  }
};

const ACCOUNT_DISPLAY_NAME_PREFIX_PATTERN = /Account-/;

export class TradeFileGenerator {
  private plugin: JournalitPlugin;
  private folderPathService: FolderPathService;
  private accountCache: Map<string, string> = new Map(); 
  private accountCacheTime: number = 0; 
  private readonly CACHE_TTL = 5 * 60 * 1000; 

  constructor(
    plugin: JournalitPlugin,
    settings: BackendIntegrationSettings,
    folderPathService: FolderPathService
  ) {
    this.plugin = plugin;
    this.folderPathService = folderPathService;
    
  }

  private sanitizeSymbolForFilename(symbol: string): string {
    return sanitizeTradeSymbolForFilename(symbol);
  }

  
  private getTradeDirectoryPath(entryTime: Date): string {
    return buildTradeDirectoryPath(this.folderPathService, entryTime, 'trades');
  }

  
  generateTradeFilePath(trade: Trade): string {
    const entryTime = new Date(trade.entry_time);
    const filenameSymbol = this.sanitizeSymbolForFilename(trade.symbol);
    const dateFormat = this.plugin.settings.trade.dateFormat || 'DDMMYY';
    const dateStr = formatTradeDateForFilename(entryTime, dateFormat);
    const tradeNumber = this.getNextTradeNumber(
      filenameSymbol,
      dateStr,
      this.getTradeDirectoryPath(entryTime)
    );

    return buildTradeFilePath({
      folderPathService: this.folderPathService,
      date: entryTime,
      symbol: filenameSymbol,
      tradeNumber,
      dateFormat,
      tradesFolder: 'trades',
    });
  }

  
  private getNextTradeNumber(
    symbol: string,
    dateStr: string,
    tradesDir: string
  ): number {
    
    const folder = this.plugin.app.vault.getAbstractFileByPath(tradesDir);

    let maxNumber = 0;

    if (folder && folder instanceof TFolder) {
      const prefix = `${symbol}-${dateStr}-T`;

      for (const child of folder.children) {
        if (child.name.startsWith(prefix) && child.name.endsWith('.md')) {
          const match = child.name.match(/T(\d+)\.md$/);
          if (match) {
            const num = parseInt(match[1]);
            if (num > maxNumber) {
              maxNumber = num;
            }
          }
        }
      }
    }

    return maxNumber + 1;
  }

  
  async createTradeFileAtomic(trade: Trade, content: string): Promise<string> {
    const entryTime = new Date(trade.entry_time);
    const dateFormat = this.plugin.settings.trade.dateFormat || 'DDMMYY';
    const dateStr = formatTradeDateForFilename(entryTime, dateFormat);
    const dirPath = this.getTradeDirectoryPath(entryTime);
    const filenameSymbol = this.sanitizeSymbolForFilename(trade.symbol);

    await this.ensureDirectoryExists(dirPath);

    
    const MAX_RETRIES = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      let tempFile: TFile | null = null;

      try {
        
        const uuid = generateUUID().split('-')[0]; 
        const tempFileName = `${filenameSymbol}-${dateStr}-temp-${uuid}.md`;
        const tempPath = `${dirPath}/${tempFileName}`;

        
        tempFile = await this.plugin.app.vault.create(tempPath, content);

        
        const tradeNumber = this.getNextTradeNumber(
          filenameSymbol,
          dateStr,
          dirPath
        );
        const finalPath = buildTradeFilePath({
          folderPathService: this.folderPathService,
          date: entryTime,
          symbol: filenameSymbol,
          tradeNumber,
          dateFormat,
          tradesFolder: 'trades',
        });

        
        const existingFile =
          this.plugin.app.vault.getAbstractFileByPath(finalPath);

        if (existingFile) {
          
          console.warn(
            `Trade file collision detected on attempt ${attempt + 1}: ${finalPath}`
          );

          
          await new Promise((resolve) =>
            window.setTimeout(resolve, 50 * (attempt + 1))
          );
          continue;
        }

        
        await this.plugin.app.vault.rename(tempFile, finalPath);

        
        tempFile = null;
        return finalPath;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        
        const errorMessage = getErrorMessage(error);
        if (FILE_ALREADY_EXISTS_PATTERN.test(errorMessage)) {
          console.warn(
            `Temp file collision on attempt ${attempt + 1}, retrying...`
          );
          await new Promise((resolve) =>
            window.setTimeout(resolve, 50 * (attempt + 1))
          );
          continue;
        }

        
        throw error;
      } finally {
        
        if (tempFile) {
          try {
            await this.plugin.app.fileManager.trashFile(tempFile);
          } catch (cleanupError) {
            
            if (
              getErrorCode(cleanupError) !== undefined &&
              getErrorCode(cleanupError) !== 'ENOENT'
            ) {
              console.warn(
                `Failed to cleanup temp file ${tempFile.path}:`,
                cleanupError
              );
            }
          }
        }
      }
    }

    
    throw new Error(
      `Failed to create trade file after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`
    );
  }

  
  public clearAccountCache(): void {
    this.accountCache.clear();
    this.accountCacheTime = 0;
  }

  
  private async refreshAccountCache(): Promise<void> {
    const now = Date.now();

    
    if (
      this.accountCacheTime > 0 &&
      now - this.accountCacheTime < this.CACHE_TTL
    ) {
      return; 
    }

    try {
      
      this.accountCache.clear();

      
      const backendSettings = this.plugin.settings.backendIntegration;
      if (backendSettings?.accountMapping) {
        for (const [mtAccountId, displayName] of Object.entries(
          backendSettings.accountMapping
        )) {
          this.accountCache.set(mtAccountId, displayName);
        }
      }

      
      const accountPageService = this.plugin.accountPageService;
      if (accountPageService) {
        try {
          const allAccounts = await accountPageService.getAccountCatalog();

          for (const account of allAccounts) {
            const displayName = account.name || account.id;

            
            if (account.id && !this.accountCache.has(account.id)) {
              this.accountCache.set(account.id, displayName);
            }

            
            if (ACCOUNT_DISPLAY_NAME_PREFIX_PATTERN.test(displayName)) {
              const mtNumber = displayName.replace('Account-', '');
              if (/^\d+$/.test(mtNumber) && !this.accountCache.has(mtNumber)) {
                this.accountCache.set(mtNumber, displayName);
              }
            }
          }
        } catch (error) {
          console.warn(
            'Error loading accounts from AccountPageService:',
            error
          );
        }
      }

      this.accountCacheTime = now;
    } catch (error) {
      console.error('Error refreshing account cache:', error);
    }
  }

  
  private async resolveAccountDisplayName(
    mtAccountNumber: string,
    fallbackDisplayName?: string
  ): Promise<string> {
    try {
      
      await this.refreshAccountCache();

      
      const cachedDisplayName = this.accountCache.get(mtAccountNumber);
      if (cachedDisplayName) {
        return cachedDisplayName;
      }

      
      const fallback = fallbackDisplayName || `Account-${mtAccountNumber}`;

      
      if (!this.accountCache.has(`_notfound_${mtAccountNumber}`)) {
        this.accountCache.set(`_notfound_${mtAccountNumber}`, fallback); 
      }

      return fallback;
    } catch (error) {
      console.error('Error resolving account display name:', error);
      return fallbackDisplayName || `Account-${mtAccountNumber}`;
    }
  }

  
  async generateTradeMarkdown(
    trade: Trade,
    accountDisplayName?: string
  ): Promise<string> {
    const entryTime = new Date(trade.entry_time);
    const exitTime = trade.exit_time ? new Date(trade.exit_time) : null;

    
    const direction =
      trade.direction.toUpperCase() === 'BUY' ? 'long' : 'short';

    
    logger.debug(
      '[TradeFileGenerator] trade.assetType:',
      trade.assetType,
      'symbol:',
      trade.symbol
    );
    const assetType = trade.assetType || this.determineAssetType(trade.symbol);
    logger.debug('[TradeFileGenerator] Final assetType used:', assetType);

    const tradeStatus =
      parseTradeStatus(trade.status) ?? (trade.exit_time ? 'CLOSED' : 'OPEN');
    const useDirectPnLInput =
      tradeStatus === 'OPEN' ? false : trade.useDirectPnLInput === true;
    const directPnLValue =
      trade.directPnL ??
      (useDirectPnLInput && trade.profit_loss !== undefined
        ? deriveRawDirectPnLFromStoredCombinedPnL({
            pnl: trade.profit_loss,
            dividends: trade.dividends?.map((dividend) => ({
              time: new Date(dividend.time),
              amount: dividend.amount,
            })),
            fees: trade.fees,
            swap: trade.swap,
            commission: trade.commission,
            rebate: trade.rebate,
          })
        : undefined);
    const normalizeStringList = (values: string[] | undefined): string[] => {
      if (!values?.length) {
        return [];
      }

      return deduplicateOptions(
        values.flatMap((value) => {
          const trimmed = value.trim();
          return trimmed ? [trimmed] : [];
        })
      );
    };

    const normalizeImageList = (values: string[] | undefined): string[] => {
      if (!values?.length) {
        return [];
      }

      const normalized: string[] = [];
      const seen = new Set<string>();

      for (const rawValue of values) {
        const cleaned = rawValue.trim().replace(/^['"`]+|['"`]+$/g, '');
        if (!cleaned) {
          continue;
        }

        const dedupeKey = cleaned.toLowerCase();
        if (seen.has(dedupeKey)) {
          continue;
        }

        seen.add(dedupeKey);
        normalized.push(cleaned);
      }

      return normalized;
    };

    const setups = normalizeStringList(trade.setup);
    const mistakes = normalizeStringList(trade.mistake);
    const tags = normalizeStringList(trade.tags);
    const images = normalizeImageList(trade.images);
    const thesis = trade.thesis?.trim() || '';
    const notes = trade.notes?.trim();
    const mtComment = trade.mt_comment?.trim() || undefined;
    const identityFields = buildTradeIdentityFields(
      Object.fromEntries(Object.entries(trade))
    );

    await ensureInstrumentOptionsExist(this.plugin, [
      {
        symbol: trade.symbol,
        assetType,
      },
    ]);

    let account: string[];
    let accountId: string | undefined;

    if (trade.mt_account_number) {
      accountId = trade.mt_account_number;
      const resolvedDisplayName = await this.resolveAccountDisplayName(
        trade.mt_account_number,
        accountDisplayName || trade.mt_account_display_name
      );
      account = [resolvedDisplayName];
    } else {
      const fallbackName =
        accountDisplayName ||
        trade.mt_account_display_name ||
        'Unknown Account';
      account = [fallbackName];
    }

    const openTradeCalculationData = {
      tradeStatus: 'OPEN' as const,
      entryTime: new Date(trade.entry_time),
      entryPrice: trade.entry_price,
      positionSize: trade.volume,
      direction,
      assetType,
      entries: trade.entries?.length
        ? trade.entries.map((entry) => ({
            time: new Date(entry.time),
            price: entry.price,
            size: entry.size,
          }))
        : [
            {
              time: new Date(trade.entry_time),
              price: trade.entry_price,
              size: trade.volume,
            },
          ],
      exits: (trade.exits || []).map((exit) => ({
        time: new Date(exit.time),
        price: exit.price,
        size: exit.size,
      })),
      dividends: (trade.dividends || []).map((dividend) => ({
        time: new Date(dividend.time),
        amount: dividend.amount,
      })),
      commission: trade.commission ?? 0,
      swap: trade.swap ?? 0,
      fees: trade.fees ?? 0,
      rebate: trade.rebate,
    };

    const realizedOpenTradePnL =
      tradeStatus === 'OPEN' &&
      hasRealizedPnLComponents(openTradeCalculationData)
        ? calculatePnL(openTradeCalculationData)
        : null;

    const stopLoss = normalizeMetaTraderRiskTarget(trade.stop_loss);
    const takeProfit = normalizeMetaTraderRiskTarget(trade.take_profit);

    const builtFrontmatter = buildTradeFrontmatter(
      {
        backendTradeId: trade.id,
        executionLedgerVersion: trade.executionLedgerVersion,
        executionIds: trade.executionIds,
        entryTime: trade.entry_time,
        exitTime: trade.exit_time || undefined,
        entryPrice: trade.entry_price,
        exitPrice: trade.exit_price ?? undefined,
        positionSize: trade.volume,
        direction,
        instrument: trade.symbol,
        assetType,
        currency: trade.currency,
        entries: trade.entries?.length
          ? trade.entries
          : [
              {
                time: trade.entry_time,
                price: trade.entry_price,
                size: trade.volume,
              },
            ],
        exits: trade.exits?.length
          ? trade.exits
          : tradeStatus === 'CLOSED' &&
              trade.exit_time &&
              trade.exit_price !== undefined &&
              trade.exit_price !== null
            ? [
                {
                  time: trade.exit_time,
                  price: trade.exit_price,
                  size: trade.volume,
                },
              ]
            : [],
        dividends: trade.dividends || [],
        commission: trade.commission ?? 0,
        commissionType: 'fixed',
        swap: trade.swap ?? 0,
        fees: trade.fees ?? 0,
        rebate: trade.rebate,
        stopLoss,
        takeProfits:
          takeProfit !== undefined
            ? [{ price: takeProfit, closePercent: 100 }]
            : undefined,
        useDirectPnLInput,
        directPnL: useDirectPnLInput ? directPnLValue : undefined,
        mistake: [...mistakes],
        accountId,
        account,
        setup: [...setups],
        images,
        tags,
        thesis,
        mtComment,
        customFields: trade.customFields,
        contractSize:
          assetType === 'options'
            ? trade.contractSize || 100
            : trade.contractSize,
        strikePrice: trade.strikePrice,
        expirationDate: trade.expirationDate,
        optionType: trade.optionType,
        dollarPerPoint: trade.dollarPerPoint,
        lotSize:
          assetType === 'forex' ? (trade.lotSize ?? 100000) : trade.lotSize,
        pipValue: trade.pipValue,
      },
      {
        tradeStatus,
        pnl:
          tradeStatus === 'OPEN'
            ? realizedOpenTradePnL
            : (trade.profit_loss ?? null),
        customFieldDefinitions:
          this.plugin.customFieldsService?.getFields() || [],
        invalidDateFallback: 'now',
      }
    );

    const frontmatterData: Record<string, unknown> = {
      type: 'trade',
      tradeId: identityFields.tradeId,
      schemaVersion: identityFields.schemaVersion,
      ...(builtFrontmatter.backendTradeId !== undefined && {
        backendTradeId: builtFrontmatter.backendTradeId,
      }),
      tradeStatus,
      entryTime: builtFrontmatter.entryTime,
      ...(builtFrontmatter.executionLedgerVersion !== undefined && {
        executionLedgerVersion: builtFrontmatter.executionLedgerVersion,
      }),
      ...(builtFrontmatter.executionIds !== undefined && {
        executionIds: builtFrontmatter.executionIds,
      }),
      entryPrice: builtFrontmatter.entryPrice,
      positionSize: builtFrontmatter.positionSize,
      direction: builtFrontmatter.direction,
      instrument: builtFrontmatter.instrument,
      assetType: builtFrontmatter.assetType,
      ...(builtFrontmatter.exitTime !== undefined && {
        exitTime: builtFrontmatter.exitTime,
      }),
      ...(builtFrontmatter.exitPrice !== undefined && {
        exitPrice: builtFrontmatter.exitPrice,
      }),
      ...(builtFrontmatter.pnl !== undefined && { pnl: builtFrontmatter.pnl }),
      ...(builtFrontmatter.currency !== undefined && {
        currency: builtFrontmatter.currency,
      }),
      entries: builtFrontmatter.entries,
      ...(builtFrontmatter.exits !== undefined && {
        exits: builtFrontmatter.exits,
      }),
      ...(builtFrontmatter.dividends !== undefined && {
        dividends: builtFrontmatter.dividends,
      }),
      commission: builtFrontmatter.commission,
      commissionType: builtFrontmatter.commissionType,
      swap: builtFrontmatter.swap,
      fees: builtFrontmatter.fees,
      useDirectPnLInput,
      ...(builtFrontmatter.directPnL !== undefined && {
        directPnL: builtFrontmatter.directPnL,
      }),
      ...(accountId !== undefined ? { accountId, account } : { account }),
      setup: [...setups],
      mistake: [...mistakes],
      images,
      tags,
      thesis,
      ...(builtFrontmatter.mtComment !== undefined && {
        mtComment: builtFrontmatter.mtComment,
      }),
      ...(assetType === 'forex' && builtFrontmatter.lotSize !== undefined
        ? { lotSize: builtFrontmatter.lotSize }
        : {}),
      ...(assetType === 'forex' && builtFrontmatter.pipValue !== undefined
        ? { pipValue: builtFrontmatter.pipValue }
        : {}),
      ...(assetType === 'options' && builtFrontmatter.contractSize !== undefined
        ? { contractSize: builtFrontmatter.contractSize }
        : {}),
      ...(assetType === 'options' && builtFrontmatter.strikePrice !== undefined
        ? { strikePrice: builtFrontmatter.strikePrice }
        : {}),
      ...(assetType === 'options' &&
      builtFrontmatter.expirationDate !== undefined
        ? { expirationDate: builtFrontmatter.expirationDate }
        : {}),
      ...(assetType === 'options' && builtFrontmatter.optionType !== undefined
        ? { optionType: builtFrontmatter.optionType }
        : {}),
      ...(assetType === 'futures' &&
      builtFrontmatter.dollarPerPoint !== undefined
        ? { dollarPerPoint: builtFrontmatter.dollarPerPoint }
        : {}),
    };

    for (const [key, value] of Object.entries(builtFrontmatter)) {
      if (!(key in frontmatterData) && value !== undefined) {
        frontmatterData[key] = value;
      }
    }

    const frontmatter =
      serializeTradeFrontmatter(frontmatterData, {
        arrayStyle: 'inline',
        scalarStyle: 'inline',
        doubleQuotedInlineArrayKeys: ['images'],
        doubleQuotedScalarKeys: ['mtComment'],
      }) + '\n\n';

    
    let content = `# ${trade.symbol} - ${trade.direction.toUpperCase()}\n\n`;
    content += `Entry: ${trade.entry_price} at ${entryTime.toLocaleString()}\n`;

    if (
      tradeStatus === 'CLOSED' &&
      exitTime &&
      trade.exit_price !== undefined &&
      trade.exit_price !== null
    ) {
      content += `Exit: ${trade.exit_price} at ${exitTime.toLocaleString()}\n`;
    }

    if (tradeStatus === 'CLOSED') {
      if (trade.profit_loss !== undefined && trade.profit_loss !== null) {
        
        const displayRMultiples =
          this.plugin.settings.trade.displayRMultiples || false;
        const defaultRiskAmount =
          this.plugin.settings.trade.defaultRiskAmount || 0;

        
        let rMultiple: number | undefined;
        if (defaultRiskAmount > 0 && trade.profit_loss !== 0) {
          rMultiple = trade.profit_loss / defaultRiskAmount;
        }

        
        const currency = this.plugin.settings.general?.currency;

        if (trade.profit_loss > 0) {
          const formattedPnL = formatPnL(
            trade.profit_loss,
            true,
            currency,
            displayRMultiples,
            rMultiple
          );
          content += `✅ Profit: ${formattedPnL}\n`;
        } else if (trade.profit_loss < 0) {
          const formattedPnL = formatPnL(
            trade.profit_loss,
            true,
            currency,
            displayRMultiples,
            rMultiple
          );
          content += `❌ Loss: ${formattedPnL}\n`;
        }
      }
    } else {
      content += `Status: Open\n`;
    }

    if (notes) {
      content += `\nNotes:\n${notes}\n`;
    }

    content += `\n\n${USER_OWNED_TRADE_CONTENT_MARKER}`;

    return frontmatter + content;
  }

  
  formatDateForUser(date: Date): string {
    return formatTradeDateForFilename(
      date,
      this.plugin.settings.trade.dateFormat || 'DDMMYY'
    );
  }

  
  async ensureDirectoryExists(path: string): Promise<void> {
    const parts = path.split('/');
    let currentPath = '';

    for (const part of parts) {
      if (!part) continue;
      currentPath += (currentPath ? '/' : '') + part;

      if (!this.plugin.app.vault.getAbstractFileByPath(currentPath)) {
        try {
          await this.plugin.app.vault.createFolder(currentPath);
        } catch (error) {
          
          const errorMessage = getErrorMessage(error);
          if (!FILE_ALREADY_EXISTS_PATTERN.test(errorMessage)) {
            throw error;
          }
        }
      }
    }
  }

  
  private determineAssetType(symbol: string): string {
    
    const upperSymbol = symbol.toUpperCase();

    
    if (
      upperSymbol.includes('/') ||
      (upperSymbol.length === 6 &&
        this.isForexCurrency(upperSymbol.substring(0, 3)) &&
        this.isForexCurrency(upperSymbol.substring(3, 6)))
    ) {
      return 'forex';
    }

    
    if (
      upperSymbol.endsWith('USDT') ||
      upperSymbol.endsWith('BTC') ||
      upperSymbol.endsWith('ETH') ||
      upperSymbol.includes('CRYPTO')
    ) {
      return 'crypto';
    }

    
    if (
      /[0-9]/.test(upperSymbol) &&
      (upperSymbol.startsWith('ES') ||
        upperSymbol.startsWith('NQ') ||
        upperSymbol.startsWith('CL') ||
        upperSymbol.startsWith('GC'))
    ) {
      return 'futures';
    }

    
    return 'stock';
  }

  
  private isForexCurrency(code: string): boolean {
    const forexCurrencies = [
      'EUR',
      'USD',
      'GBP',
      'JPY',
      'CHF',
      'CAD',
      'AUD',
      'NZD',
    ];
    return forexCurrencies.includes(code);
  }
}
