

import { TradeService } from '../trade/TradeService';
import { ServiceManager } from '../ServiceManager';
import {
  formatDateDisplay,
  getQuarter,
  formatLocalDateString,
  getWeekNumberForDate,
  getWeekStartDaySetting,
  type WeekStartDaySetting,
} from '../../utils/dateUtils';
import {
  getTradingDayString,
  createTradingDayFromString,
} from '../../utils/tradingDayUtils';
import {
  TimeNode,
  ViewLevel,
  TradeLogMetrics,
  TradeType,
  TradeStatus,
  SELECTABLE_TRADE_TYPES_COUNT,
} from './types';
import {
  getTradeDisplayStatusWithContext,
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import { eventBus } from '../events';
import type {
  TradeChangedPayload,
  TradeCommittedPayload,
  Unsubscribe,
} from '../events/types';
import { aggregatePnLByCurrency } from '../../utils/currencyAggregation';
import {
  calculateWinRateExcludingBreakeven,
  classifyPnLWithBreakEvenSettings,
} from '../../utils/breakEvenRange';
import type { PartialTradeFrontmatter } from '../../types/TradeFrontmatter';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import {
  type CustomFieldDefinition,
  type CustomFieldFilterSelections,
  CustomFieldType,
  type DropdownOption,
  isDiscreteCustomFieldFilterable,
} from '../../types/customFields';
import {
  fetchBreakEvenAccountBalanceLookup,
  getBreakEvenAccountBalanceFields,
  resolveBreakEvenAccountBalances,
} from '../trade/core/BreakEvenAccountBalance';
import { applyTradeFilters } from '../../components/shared/filters/filterUtils';
import type { UnifiedFilters } from '../../components/shared/filters/types';
import {
  getCopyTradingPeriodForEntryDate,
  isCopyTradingBaseEligible,
} from '../../utils/accountCopyTrading';
import {
  calculateCopiedTradePnL,
  scaleCopiedTradeExecutionFields,
} from '../../utils/copyTradePnL';
import {
  normalizeAccountLookupKey,
  normalizeTradeAccountIdentity,
} from '../trade/core/TradeAccountIdentity';


interface DateComponents {
  date: Date;
  year: number;
  month: number;
  quarter: number;
  dayKey: string;
  weekNum: number;
  tradingDayString: string;
}


type TradeLogData = PartialTradeFrontmatter & {
  breakEvenAccountCurrentBalance?: number;
  breakEvenAccountCurrentBalanceCurrency?: string;
  breakEvenAccountCurrentBalanceTotal?: number;
  breakEvenAccountCurrentBalanceTotalCurrency?: string;
  
  entryTime: Date | string;
  
  path?: string;
  
  _dateComponents?: DateComponents;
  
  hasExplicitExitPrice?: boolean;
  
  isMissedTrade?: boolean;
  isBacktestTrade?: boolean;
  
  performanceIndicator?: 'best' | 'worst';
  
  isCopiedTrade?: boolean;
  copiedFromAccount?: string;
  copyMultiplier?: number;
  copyAccountLookupKey?: string;
  copyPnlAdjustment?: number;
  copySourceFilePath?: string;
  copiedTradeRowId?: string;
  copiedToAccounts?: Array<{
    account: string;
    pnl: number;
    multiplier: number;
  }>;
};


type EnrichedTradeData = TradeLogData & {
  _dateComponents: DateComponents;
};

interface HierarchicalQueryParams {
  viewLevel: ViewLevel;
  startDate?: Date;
  endDate?: Date;
  tradeTypes?: TradeType[];
  statuses?: TradeStatus[];
  accounts?: string[];
  tickers?: string[];
  setups?: string[];
  tags?: string[];
  mistakes?: string[];
  customFieldFilters?: CustomFieldFilterSelections;
}

function normalizeCustomFieldFilterValue(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }

  return null;
}

function getTradeCustomFieldRawValue(
  trade: Record<string, unknown>,
  field: CustomFieldDefinition
): unknown {
  const rootLevelValue = trade[field.fieldKey];
  if (rootLevelValue !== undefined) {
    return rootLevelValue;
  }

  const nestedCustomFields = trade.customFields;
  if (nestedCustomFields && typeof nestedCustomFields === 'object') {
    return (nestedCustomFields as Record<string, unknown>)[field.id];
  }

  return undefined;
}

function buildCustomFieldOptionLabelMap(
  field: CustomFieldDefinition
): Map<string, string> {
  return new Map(
    (field.options || []).map((option) => [option.value, option.label])
  );
}

export class TradeLogService {
  private tradeService: TradeService;
  private cache: Map<string, TimeNode> = new Map();
  private lastUpdateTime: number = 0;
  private updateThreshold: number = 5000; 
  private readonly CACHE_VERSION = 3; 
  private plugin: JournalitPlugin;
  
  private unsubscribeFns: Unsubscribe[] = [];
  
  private readonly latestTradeRevisionById = new Map<string, number>();
  
  private readonly pendingLegacyMirrors = new Map<string, number>();
  
  private tradeCommitRevisionToken: number = 0;

  
  private cachedTradingDayCutoffTime: string | null = null;
  private cachedWeekStartDay: WeekStartDaySetting = 'monday';

  private registerPendingLegacyMirror(
    change: TradeCommittedPayload['change']
  ): void {
    const now = Date.now();
    for (const [key, expiresAt] of this.pendingLegacyMirrors.entries()) {
      if (expiresAt < now) {
        this.pendingLegacyMirrors.delete(key);
      }
    }

    const primaryPath =
      typeof change.path === 'string' && change.path.length > 0
        ? change.path
        : null;
    if (!primaryPath) {
      return;
    }

    this.pendingLegacyMirrors.set(
      `${change.action}:${primaryPath}`,
      now + 1200
    );
  }

  private shouldIgnoreMirroredLegacyTradeChanged(
    payload?: TradeChangedPayload
  ): boolean {
    if (!payload) {
      return false;
    }

    const action = payload.action;
    if (
      action !== 'created' &&
      action !== 'updated' &&
      action !== 'deleted' &&
      action !== 'relocated'
    ) {
      return false;
    }

    const pathCandidates = Array.isArray(payload.filePaths)
      ? payload.filePaths
      : payload.filePath
        ? [payload.filePath]
        : [];

    if (pathCandidates.length !== 1) {
      return false;
    }

    const key = `${action}:${pathCandidates[0]}`;
    const expiresAt = this.pendingLegacyMirrors.get(key);
    if (!expiresAt) {
      return false;
    }

    if (expiresAt < Date.now()) {
      this.pendingLegacyMirrors.delete(key);
      return false;
    }

    this.pendingLegacyMirrors.delete(key);
    return true;
  }

  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
    this.tradeService = ServiceManager.getInstance(
      plugin.app,
      plugin
    ).getTradeService();

    
    this.cacheTradingDaySettings();

    const bumpTradeRevisionAndClearCache = () => {
      this.tradeCommitRevisionToken++;
      this.invalidateTradeDataCaches();
    };

    const handleTradeCommitted = (payload: TradeCommittedPayload) => {
      const tradeId = payload.receipt?.tradeId ?? payload.change?.tradeId;
      const revision = payload.receipt?.revision;

      if (!tradeId || typeof revision !== 'number' || revision <= 0) {
        bumpTradeRevisionAndClearCache();
        return;
      }

      const latestRevision = this.latestTradeRevisionById.get(tradeId) ?? 0;
      if (revision <= latestRevision) {
        return;
      }

      this.latestTradeRevisionById.set(tradeId, revision);
      if (payload.legacyTradeChangedExpected === true) {
        this.registerPendingLegacyMirror(payload.change);
      }
      bumpTradeRevisionAndClearCache();
    };

    const handleTradeChanged = (payload: TradeChangedPayload) => {
      if (this.shouldIgnoreMirroredLegacyTradeChanged(payload)) {
        return;
      }
      bumpTradeRevisionAndClearCache();
    };

    
    
    this.unsubscribeFns.push(
      eventBus.subscribe('trade:committed', handleTradeCommitted),
      eventBus.subscribe('trade:changed', handleTradeChanged),
      eventBus.subscribe(
        'missed-trade:changed',
        bumpTradeRevisionAndClearCache
      ),
      eventBus.subscribe(
        'backtest-trade:changed',
        bumpTradeRevisionAndClearCache
      ),
      eventBus.subscribe('settings:changed', (payload) => {
        if (
          payload?.section === 'trade' ||
          payload?.section === 'copyTradeAdjustments' ||
          payload?.source === 'week-start'
        ) {
          this.clearCache();
        }
      }),
      eventBus.subscribe('account:changed', bumpTradeRevisionAndClearCache)
    );
  }

  
  private getMonthAbbreviation(monthIndex: number): string {
    const monthKeys = [
      'calendar.month.jan',
      'calendar.month.feb',
      'calendar.month.mar',
      'calendar.month.apr',
      'calendar.month.may',
      'calendar.month.jun',
      'calendar.month.jul',
      'calendar.month.aug',
      'calendar.month.sep',
      'calendar.month.oct',
      'calendar.month.nov',
      'calendar.month.dec',
    ] as const;
    return t(monthKeys[monthIndex]);
  }

  
  private getDayAbbreviation(dayIndex: number): string {
    const dayKeys = [
      'calendar.day.sun',
      'calendar.day.mon',
      'calendar.day.tue',
      'calendar.day.wed',
      'calendar.day.thu',
      'calendar.day.fri',
      'calendar.day.sat',
    ] as const;
    return t(dayKeys[dayIndex]);
  }

  
  private async getTradesWithPaths(
    tradeTypes?: TradeType[],
    accounts?: string[]
  ): Promise<TradeLogData[]> {
    

    const allTrades = await this.tradeService.getTradeData();

    
    
    
    
    const relevantTrades = allTrades.filter((trade) =>
      Boolean(trade.path || trade.filePath)
    );

    const breakEvenThresholdMode =
      this.plugin.settings.trade.breakEvenThresholdMode ?? 'fixed';
    const accountBalanceLookup =
      breakEvenThresholdMode === 'percentage_current_balance'
        ? await fetchBreakEvenAccountBalanceLookup(this.plugin)
        : null;

    
    
    const tradesWithPaths = relevantTrades.flatMap((trade) => {
      const normalizedTrade: TradeLogData = {
        ...trade,
        filePath: trade.path || trade.filePath,
        
        isBacktestTrade:
          trade.isBacktestTrade || trade.type === 'backtest-trade',
        isMissedTrade: trade.isMissedTrade || trade.type === 'missed-trade',
      };

      if (accountBalanceLookup) {
        Object.assign(
          normalizedTrade,
          getBreakEvenAccountBalanceFields(
            resolveBreakEvenAccountBalances(
              normalizedTrade as unknown as Record<string, unknown>,
              accountBalanceLookup,
              {
                resolveAccountIdDisplayName: (accountId) =>
                  this.plugin.settings.backendIntegration?.accountMapping?.[
                    accountId
                  ],
              }
            )
          )
        );
      }

      const copiedRowsForFilters = this.createCopiedTradeLogRows(
        normalizedTrade,
        accounts || []
      );
      const allCopiedRowsForSummary = this.createCopiedTradeLogRows(
        normalizedTrade,
        [],
        true
      );
      const tradeWithCopySummary = allCopiedRowsForSummary.length
        ? {
            ...normalizedTrade,
            copiedToAccounts: allCopiedRowsForSummary.map((copiedRow) => ({
              account: Array.isArray(copiedRow.account)
                ? String(copiedRow.account[0] || '')
                : String(copiedRow.account || ''),
              pnl: getEffectivePnL(copiedRow),
              multiplier: copiedRow.copyMultiplier ?? 0,
            })),
          }
        : normalizedTrade;

      return [tradeWithCopySummary, ...copiedRowsForFilters];
    });

    
    if (this.shouldLoadMissedTrades(tradeTypes)) {
      const missedTradeService =
        await this.plugin.serviceManager.getMissedTradeService();
      if (missedTradeService) {
        try {
          const startDate = new Date('2000-01-01');
          const endDate = new Date('2099-12-31');
          const missedTradeFiles = await missedTradeService.getMissedTrades(
            startDate,
            endDate
          );

          for (const file of missedTradeFiles) {
            const cache = this.plugin.app.metadataCache.getFileCache(file);
            const frontmatter = cache?.frontmatter;

            if (frontmatter && frontmatter.type === 'missed-trade') {
              if (!frontmatter.entryTime) {
                continue;
              }

              tradesWithPaths.push({
                ...frontmatter,
                entryTime: frontmatter.entryTime,
                filePath: file.path,
                isMissedTrade: true, 
                path: file.path,
              } as TradeLogData);
            }
          }
        } catch (error) {
          console.error('Error fetching missed trades for trade log:', error);
        }
      }
    }

    
    
    

    return tradesWithPaths;
  }

  private createCopiedTradeLogRows(
    baseTrade: TradeLogData,
    requestedAccounts: string[],
    includeAllCopiedRows = false
  ): TradeLogData[] {
    const accountMetadata = this.plugin.settings.account?.accountMetadata ?? {};
    const entryDate = this.parseTradeDate(baseTrade.entryTime);
    if (!entryDate) {
      return [];
    }

    const includeCopyAccountsInAllAccounts =
      this.plugin.settings.trade.includeCopyAccountsInAllAccountsAnalytics ===
      true;
    const requestedAccountLookupKeys = new Set(
      requestedAccounts.map((accountName) =>
        normalizeAccountLookupKey(accountName)
      )
    );

    if (
      !includeAllCopiedRows &&
      !includeCopyAccountsInAllAccounts &&
      requestedAccountLookupKeys.size === 0
    ) {
      return [];
    }

    const baseAccountLookupKeys = new Set(
      normalizeTradeAccountIdentity(
        baseTrade as Record<string, unknown>
      ).accountNames.map((accountName) =>
        normalizeAccountLookupKey(accountName)
      )
    );
    if (baseAccountLookupKeys.size === 0) {
      return [];
    }

    const copiedRows: TradeLogData[] = [];
    for (const [copyAccountName, copyMetadata] of Object.entries(
      accountMetadata
    )) {
      const copyPeriod = getCopyTradingPeriodForEntryDate(
        copyMetadata,
        entryDate
      );
      if (!copyPeriod) {
        continue;
      }

      const copyAccountLookupKey = normalizeAccountLookupKey(copyAccountName);
      if (
        !includeAllCopiedRows &&
        requestedAccountLookupKeys.size > 0 &&
        !requestedAccountLookupKeys.has(copyAccountLookupKey)
      ) {
        continue;
      }

      if (
        !baseAccountLookupKeys.has(
          normalizeAccountLookupKey(copyPeriod.baseAccount)
        )
      ) {
        continue;
      }

      if (
        !isCopyTradingBaseEligible(
          accountMetadata,
          copyMetadata,
          copyPeriod.baseAccount,
          entryDate,
          this.plugin.settings.general?.currency
        )
      ) {
        continue;
      }

      const copiedTradeRowId = `${baseTrade.filePath || baseTrade.path || baseTrade.tradeId || 'trade'}::copy::${copyAccountLookupKey}`;
      const copySourceFilePath = baseTrade.filePath || baseTrade.path;
      const copyBaseTradeKey = String(
        baseTrade.filePath ?? baseTrade.path ?? baseTrade.tradeId ?? 'trade'
      );
      const {
        pnl: copiedPnL,
        commission,
        adjustment,
      } = calculateCopiedTradePnL({
        plugin: this.plugin,
        baseTrade: { ...baseTrade, copyBaseTradeKey },
        copyAccountName,
        copyAccountLookupKey,
        multiplier: copyPeriod.multiplier,
      });
      const baseRiskAmount =
        typeof baseTrade.riskAmount === 'number'
          ? baseTrade.riskAmount
          : baseTrade.riskAmount === undefined
            ? undefined
            : Number(baseTrade.riskAmount);
      const copiedRiskAmount =
        baseRiskAmount === undefined
          ? undefined
          : baseRiskAmount * copyPeriod.multiplier;

      copiedRows.push({
        ...baseTrade,
        ...scaleCopiedTradeExecutionFields(baseTrade, copyPeriod.multiplier),
        filePath: copiedTradeRowId,
        path: copiedTradeRowId,
        account: [copyAccountName],
        pnl: copiedPnL,
        directPnL:
          typeof baseTrade.directPnL === 'number'
            ? baseTrade.directPnL * copyPeriod.multiplier
            : baseTrade.directPnL,
        riskAmount: copiedRiskAmount,
        rMultiple:
          copiedRiskAmount && copiedRiskAmount !== 0
            ? copiedPnL / copiedRiskAmount
            : baseTrade.rMultiple,
        commission: commission ?? 0,
        fees: 0,
        currency: baseTrade.currency ?? copyMetadata.currency,
        isCopiedTrade: true,
        copiedFromAccount: copyPeriod.baseAccount,
        copyMultiplier: copyPeriod.multiplier,
        copyAccountLookupKey,
        copyPnlAdjustment: adjustment,
        copySourceFilePath,
        copyBaseTradeKey,
        copiedTradeRowId,
      });
    }

    return copiedRows;
  }

  private parseTradeDate(value: Date | string | undefined): Date | null {
    if (!value) {
      return null;
    }
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private async retryHierarchicalDataIfRevisionChanged(
    requestRevisionToken: number,
    query: HierarchicalQueryParams,
    retryCount: number
  ): Promise<TimeNode[] | undefined> {
    if (requestRevisionToken === this.tradeCommitRevisionToken) {
      return undefined;
    }

    if (retryCount < 2) {
      return this.getHierarchicalData(
        query.viewLevel,
        query.startDate,
        query.endDate,
        query.tradeTypes,
        query.statuses,
        query.accounts,
        query.tickers,
        query.setups,
        query.tags,
        query.mistakes,
        query.customFieldFilters,
        retryCount + 1
      );
    }

    
    
    return undefined;
  }

  
  async getHierarchicalData(
    viewLevel: ViewLevel,
    startDate?: Date,
    endDate?: Date,
    tradeTypes?: TradeType[],
    statuses?: TradeStatus[],
    accounts?: string[],
    tickers?: string[],
    setups?: string[],
    tags?: string[],
    mistakes?: string[],
    customFieldFilters?: CustomFieldFilterSelections,
    retryCount: number = 0
  ): Promise<TimeNode[]> {
    
    const normalizeFilterArray = (arr?: string[]) =>
      !arr || arr.length === 0 ? 'ALL' : [...arr].sort().join(',');
    const normalizeCustomFieldFilters = (
      filters?: CustomFieldFilterSelections
    ): string => {
      const entries = Object.entries(filters || {})
        .filter(([, values]) => Array.isArray(values) && values.length > 0)
        .map(([fieldId, values]) => [fieldId, [...values].sort()] as const)
        .sort(([fieldIdA], [fieldIdB]) => fieldIdA.localeCompare(fieldIdB));

      return entries.length === 0 ? 'ALL' : JSON.stringify(entries);
    };
    const query: HierarchicalQueryParams = {
      viewLevel,
      startDate,
      endDate,
      tradeTypes,
      statuses,
      accounts,
      tickers,
      setups,
      tags,
      mistakes,
      customFieldFilters,
    };

    const requestRevisionToken = this.tradeCommitRevisionToken;
    const includeCopyAccountsInAllAccounts =
      this.plugin.settings.trade.includeCopyAccountsInAllAccountsAnalytics ===
      true;
    const cacheKey = `v${this.CACHE_VERSION}-r${requestRevisionToken}-copy${includeCopyAccountsInAllAccounts}-${viewLevel}-${startDate?.toISOString()}-${endDate?.toISOString()}-${normalizeFilterArray(tradeTypes)}-${normalizeFilterArray(statuses)}-${normalizeFilterArray(accounts)}-${normalizeFilterArray(tickers)}-${normalizeFilterArray(setups)}-${normalizeFilterArray(tags)}-${normalizeFilterArray(mistakes)}-${normalizeCustomFieldFilters(customFieldFilters)}`;
    const now = Date.now();

    
    if (
      this.cache.has(cacheKey) &&
      this.cachedEnrichedTradesCacheKey === cacheKey &&
      now - this.lastUpdateTime < this.updateThreshold
    ) {
      const cachedResult = this.cache.get(cacheKey)!.children || [];
      
      
      return cachedResult;
    }

    
    
    const isNewDataRequest = !this.cache.has(cacheKey.split('-')[0]); 
    if (isNewDataRequest) {
      this.cachedEnrichedTrades = null;
    }

    
    const allTrades = await this.getTradesWithPaths(tradeTypes, accounts);

    
    let filteredTrades = allTrades;
    if (startDate || endDate) {
      filteredTrades = this.filterTradesByDateRange(
        filteredTrades,
        startDate,
        endDate
      );
    }
    filteredTrades = this.applySharedTradeFilters(filteredTrades, {
      accounts: accounts || [],
      tickers: tickers || [],
      setups: setups || [],
      tags: tags || [],
      mistakes: mistakes || [],
      tradeTypes: tradeTypes || [],
      statuses: statuses || [],
      customFieldFilters: customFieldFilters || {},
    });

    
    const enrichedTrades = this.preComputeDateComponents(filteredTrades);

    const retryAfterEnrichment =
      await this.retryHierarchicalDataIfRevisionChanged(
        requestRevisionToken,
        query,
        retryCount
      );
    if (retryAfterEnrichment !== undefined) {
      return retryAfterEnrichment;
    }

    
    let result: TimeNode[];
    switch (viewLevel) {
      case 'years':
        result = await this.buildYearNodesOptimized(enrichedTrades);
        break;
      case 'quarters':
        result = await this.buildQuarterNodesOptimized(enrichedTrades);
        break;
      case 'months':
        result = await this.buildMonthNodesOptimized(enrichedTrades);
        break;
      case 'weeks':
        result = await this.buildWeekNodesOptimized(enrichedTrades);
        break;
      case 'days':
        result = await this.buildDayNodesOptimized(enrichedTrades);
        break;
      case 'trades':
        result = await this.buildTradeNodesOptimized(enrichedTrades);
        break;
      default:
        result = [];
    }

    
    if (result.length < 50) {
      this.markBestWorstPerformers(result);
    }

    
    const rootMetrics =
      enrichedTrades.length > 500
        ? this.calculateMetricsLightweight(enrichedTrades)
        : this.calculateMetrics(enrichedTrades);

    const retryAfterBuild = await this.retryHierarchicalDataIfRevisionChanged(
      requestRevisionToken,
      query,
      retryCount
    );
    if (retryAfterBuild !== undefined) {
      return retryAfterBuild;
    }

    
    
    this.cachedEnrichedTrades = enrichedTrades;
    this.cachedEnrichedTradesCacheKey = cacheKey;

    
    const rootNode: TimeNode = {
      type: 'root',
      id: 'root',
      label: t('tradelog.root.all-trades'),
      metrics: rootMetrics,
      children: result,
      expanded: true,
      dataLoaded: true,
    };
    this.cache.set(cacheKey, rootNode);
    this.lastUpdateTime = now;

    return result;
  }

  
  private cacheTradingDaySettings(): void {
    try {
      this.cachedTradingDayCutoffTime =
        this.plugin.settings.trade.tradingDayCutoffTime || null;
      this.cachedWeekStartDay = getWeekStartDaySetting(this.plugin);
    } catch {
      this.cachedTradingDayCutoffTime = null;
      this.cachedWeekStartDay = 'monday';
    }
  }

  
  private cachedEnrichedTrades: EnrichedTradeData[] | null = null;
  private cachedEnrichedTradesCacheKey: string | null = null;

  
  async getNodeChildren(
    node: TimeNode,
    retryCount: number = 0
  ): Promise<TimeNode[]> {
    const requestRevisionToken = this.tradeCommitRevisionToken;

    let enrichedTrades = this.cachedEnrichedTrades;

    
    
    if (!enrichedTrades || enrichedTrades.length === 0) {
      const trades = await this.getTradesWithPaths();

      if (requestRevisionToken !== this.tradeCommitRevisionToken) {
        if (retryCount < 2) {
          return this.getNodeChildren(node, retryCount + 1);
        }
      }

      enrichedTrades = this.preComputeDateComponents(trades);
      if (requestRevisionToken === this.tradeCommitRevisionToken) {
        this.cachedEnrichedTrades = enrichedTrades;
      }
    }

    const filteredTrades = this.filterTradesByNode(enrichedTrades, node);

    let children: TimeNode[] = [];

    switch (node.type) {
      case 'year':
        children = this.buildQuartersForYear(filteredTrades, parseInt(node.id));
        break;
      case 'quarter':
        children = this.buildMonthsForQuarter(filteredTrades, node.id);
        break;
      case 'month':
        children = this.buildWeeksForMonth(filteredTrades, node.id);
        break;
      case 'week':
        children = this.buildDaysForWeek(filteredTrades);
        break;
      case 'day':
        children = await this.buildTradesForDay(filteredTrades, node.id);
        break;
      default:
        return [];
    }

    
    this.markBestWorstPerformers(children);

    if (requestRevisionToken !== this.tradeCommitRevisionToken) {
      if (retryCount < 2) {
        return this.getNodeChildren(node, retryCount + 1);
      }
    }

    return children;
  }

  
  private async buildFullHierarchy(
    trades: TradeLogData[]
  ): Promise<TimeNode[]> {
    const yearMap = new Map<number, any[]>();

    
    trades.forEach((trade) => {
      const date = new Date(trade.entryTime);
      const year = date.getFullYear();
      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }
      yearMap.get(year)!.push(trade);
    });

    
    const yearNodes: TimeNode[] = [];
    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b - a);

    for (const year of sortedYears) {
      const yearTrades = yearMap.get(year)!;
      const quarterNodes = this.buildQuartersForYear(yearTrades, year);

      yearNodes.push({
        type: 'year',
        id: year.toString(),
        label: year.toString(),
        metrics: this.calculateMetrics(yearTrades),
        children: quarterNodes,
        expanded: year === new Date().getFullYear(), 
        dataLoaded: true,
      });
    }

    
    this.markBestWorstPerformersRecursive(yearNodes);

    return yearNodes;
  }

  
  private async buildYearNodes(trades: TradeLogData[]): Promise<TimeNode[]> {
    const yearMap = new Map<number, any[]>();

    trades.forEach((trade) => {
      const date = new Date(trade.entryTime);
      const year = date.getFullYear();
      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }
      yearMap.get(year)!.push(trade);
    });

    const yearNodes: TimeNode[] = [];
    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b - a);

    for (const year of sortedYears) {
      const yearTrades = yearMap.get(year)!;
      yearNodes.push({
        type: 'year',
        id: year.toString(),
        label: year.toString(),
        metrics: this.calculateMetrics(yearTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return yearNodes;
  }

  
  private preComputeDateComponents(
    trades: TradeLogData[]
  ): EnrichedTradeData[] {
    const result = trades
      .map((trade) => {
        
        

        if (!trade.entryTime) {
          return null; 
        }

        const date = new Date(trade.entryTime);

        
        if (isNaN(date.getTime())) {
          return null; 
        }
        const year = date.getFullYear();
        const month = date.getMonth();
        const quarter = Math.floor(month / 3) + 1;

        return {
          ...trade,
          _dateComponents: {
            date,
            year,
            month: month + 1, 
            quarter,
            dayKey: formatLocalDateString(date), 
            weekNum: this.getWeekNumber(date),
            tradingDayString: this.getTradingDayStringMemoized(date),
          },
        };
      })
      .filter((trade) => trade !== null); 

    return result;
  }

  
  private tradingDayStringCache = new Map<string, string>();
  private getTradingDayStringMemoized(date: Date): string {
    const key = date.toISOString();
    if (!this.tradingDayStringCache.has(key)) {
      
      const tradingDayString = this.cachedTradingDayCutoffTime
        ? this.getTradingDayStringWithCachedSettings(
            date,
            this.cachedTradingDayCutoffTime
          )
        : getTradingDayString(date, this.plugin);
      this.tradingDayStringCache.set(key, tradingDayString);
    }
    return this.tradingDayStringCache.get(key)!;
  }

  
  private getTradingDayStringWithCachedSettings(
    date: Date,
    cutoffTime: string
  ): string {
    return getTradingDayString(date, {
      settings: { trade: { tradingDayCutoffTime: cutoffTime } },
    });
  }

  
  private getWeekNumber(date: Date): number {
    return getWeekNumberForDate(date, this.cachedWeekStartDay);
  }

  
  private calculateMetricsLightweight(trades: TradeLogData[]): TradeLogMetrics {
    if (trades.length === 0) {
      return { totalPnL: 0, winRate: 0, tradeCount: 0 };
    }

    const openTrades = trades.filter((t) => this.getTradeStatus(t) === 'open');
    const closedTrades = trades.filter(
      (t) => this.getTradeStatus(t) !== 'open' && !t.isMissedTrade
    );
    const pnlContributingTrades = trades.filter(
      (t) => !t.isMissedTrade && isPnlContributingTrade(t)
    );

    let wins = 0;
    let losses = 0;
    for (const trade of pnlContributingTrades) {
      const outcome = this.getOutcomeFromPnL(trade);
      if (outcome === 'win') {
        wins++;
      } else if (outcome === 'loss') {
        losses++;
      }
    }

    const totalPnL = pnlContributingTrades.reduce(
      (sum, t) => sum + getEffectivePnL(t),
      0
    );
    const totalRMultiple = pnlContributingTrades.reduce(
      (sum, t) =>
        sum +
        (calculateEffectiveRMultiple(
          getEffectivePnL(t),
          t.rMultiple || undefined,
          t.riskAmount,
          this.plugin.settings.trade.defaultRiskAmount
        ) || 0),
      0
    );

    
    
    const userCurrency = this.plugin.settings.general?.currency || 'USD';
    const currencyGrouped = aggregatePnLByCurrency(
      pnlContributingTrades,
      userCurrency
    );

    return {
      totalPnL,
      winRate: calculateWinRateExcludingBreakeven(wins, losses) * 100,
      tradeCount: trades.length,
      openTradeCount: openTrades.length,
      closedTradeCount: closedTrades.length,
      totalRMultiple,
      
      totalPnLByCurrency: currencyGrouped.byCurrency,
      isMultiCurrency: currencyGrouped.isMultiCurrency,
      primaryCurrency: currencyGrouped.defaultCurrency,
      
    };
  }

  
  private calculateMetrics(trades: TradeLogData[]): TradeLogMetrics {
    if (trades.length === 0) {
      return {
        totalPnL: 0,
        winRate: 0,
        tradeCount: 0,
      };
    }

    
    const openTrades = trades.filter((t) => this.getTradeStatus(t) === 'open');
    const closedTrades = trades.filter(
      (t) => this.getTradeStatus(t) !== 'open' && !t.isMissedTrade
    );
    const pnlContributingTrades = trades.filter(
      (t) => !t.isMissedTrade && isPnlContributingTrade(t)
    );

    let wins = 0;
    let losses = 0;
    for (const trade of pnlContributingTrades) {
      const outcome = this.getOutcomeFromPnL(trade);
      if (outcome === 'win') {
        wins++;
      } else if (outcome === 'loss') {
        losses++;
      }
    }

    const totalPnL = pnlContributingTrades.reduce(
      (sum, t) => sum + getEffectivePnL(t),
      0
    );
    const totalRMultiple = pnlContributingTrades.reduce(
      (sum, t) =>
        sum +
        (calculateEffectiveRMultiple(
          getEffectivePnL(t),
          t.rMultiple || undefined,
          t.riskAmount,
          this.plugin.settings.trade.defaultRiskAmount
        ) || 0),
      0
    );

    
    
    
    const periodMap = new Map<string, number>();

    
    if (pnlContributingTrades.length < 100) {
      pnlContributingTrades.forEach((trade) => {
        const date = new Date(trade.entryTime);
        
        const dayKey = formatLocalDateString(date); 
        periodMap.set(
          dayKey,
          (periodMap.get(dayKey) || 0) + getEffectivePnL(trade)
        );
      });
    }

    let bestDay = { label: '', pnl: -Infinity };
    let worstDay = { label: '', pnl: Infinity };

    if (periodMap.size > 0) {
      periodMap.forEach((pnl, label) => {
        if (pnl > bestDay.pnl) {
          bestDay = { label, pnl };
        }
        if (pnl < worstDay.pnl) {
          worstDay = { label, pnl };
        }
      });
    }

    
    
    const userCurrency = this.plugin.settings.general?.currency || 'USD';
    const currencyGrouped = aggregatePnLByCurrency(
      pnlContributingTrades,
      userCurrency
    );

    return {
      totalPnL,
      winRate: calculateWinRateExcludingBreakeven(wins, losses) * 100,
      tradeCount: trades.length,
      openTradeCount: openTrades.length,
      closedTradeCount: closedTrades.length,
      totalRMultiple,
      bestPeriod: bestDay.label && periodMap.size > 0 ? bestDay : undefined,
      worstPeriod: worstDay.label && periodMap.size > 0 ? worstDay : undefined,
      
      totalPnLByCurrency: currencyGrouped.byCurrency,
      isMultiCurrency: currencyGrouped.isMultiCurrency,
      primaryCurrency: currencyGrouped.defaultCurrency,
    };
  }

  
  private getTradeStatus(
    trade: TradeLogData
  ): 'win' | 'loss' | 'breakeven' | 'missed' | 'open' | 'backtest' {
    return getTradeDisplayStatusWithContext(trade, this.plugin.settings.trade);
  }

  private getOutcomeFromPnL(trade: TradeLogData): 'win' | 'loss' | 'breakeven' {
    const effectivePnL = getEffectivePnL(trade);
    const breakEvenBalance =
      trade.breakEvenAccountCurrentBalanceTotal ??
      trade.breakEvenAccountCurrentBalance;

    const outcome = classifyPnLWithBreakEvenSettings(
      effectivePnL,
      this.plugin.settings.trade,
      breakEvenBalance
    );

    return outcome === 'unknown' ? 'breakeven' : outcome;
  }

  
  private filterTradesByDateRange(
    trades: TradeLogData[],
    startDate?: Date,
    endDate?: Date
  ): TradeLogData[] {
    if (!startDate && !endDate) return trades;

    return trades.filter((trade) => {
      const tradeDate = new Date(trade.entryTime);
      if (startDate && tradeDate < startDate) return false;
      if (endDate && tradeDate > endDate) return false;
      return true;
    });
  }

  private applySharedTradeFilters(
    trades: TradeLogData[],
    filters: UnifiedFilters
  ): TradeLogData[] {
    return applyTradeFilters(
      trades,
      filters,
      this.plugin.customFieldsService?.getFields() || [],
      {
        resolveAccountIdDisplayName: (accountId) =>
          this.plugin.settings.backendIntegration?.accountMapping?.[accountId],
        breakEvenSettings: this.plugin.settings.trade,
        getBreakEvenBalance: (trade) =>
          trade.breakEvenAccountCurrentBalanceTotal ??
          trade.breakEvenAccountCurrentBalance,
      }
    );
  }

  async getAvailableCustomFieldFilters(
    customFields: CustomFieldDefinition[]
  ): Promise<
    Array<{ field: CustomFieldDefinition; options: DropdownOption[] }>
  > {
    const discreteFields = customFields.filter((field) =>
      isDiscreteCustomFieldFilterable(field)
    );
    if (discreteFields.length === 0) {
      return [];
    }

    const trades = await this.getTradesWithPaths();

    return discreteFields.map((field) => {
      const optionMap = buildCustomFieldOptionLabelMap(field);
      const orderedOptions: DropdownOption[] = [];
      const seenValues = new Set<string>();

      const addOption = (value: unknown, labelOverride?: string) => {
        const normalizedValue = normalizeCustomFieldFilterValue(value);
        if (!normalizedValue || seenValues.has(normalizedValue)) {
          return;
        }

        seenValues.add(normalizedValue);
        orderedOptions.push({
          value: normalizedValue,
          label:
            labelOverride?.trim() ||
            optionMap.get(normalizedValue) ||
            normalizedValue,
        });
      };

      (field.options || []).forEach((option) => {
        addOption(option.value, option.label);
      });

      const savedOptions =
        this.plugin.customFieldsService?.getFieldOptions(field.id) || [];
      savedOptions.forEach((option) => addOption(option, option));

      trades.forEach((trade) => {
        const rawValue = getTradeCustomFieldRawValue(
          trade as Record<string, unknown>,
          field
        );

        if (
          field.type === CustomFieldType.MULTISELECT &&
          Array.isArray(rawValue)
        ) {
          rawValue.forEach((value) => addOption(value));
          return;
        }

        addOption(rawValue);
      });

      return {
        field,
        options: orderedOptions,
      };
    });
  }

  
  async getUniqueAccounts(): Promise<string[]> {
    return await this.tradeService.getUniqueAccounts();
  }

  
  private filterTradesByNode(
    trades: EnrichedTradeData[],
    node: TimeNode
  ): EnrichedTradeData[] {
    switch (node.type) {
      case 'year': {
        const year = parseInt(node.id);
        return trades.filter((t) => t._dateComponents.year === year);
      }

      case 'quarter': {
        const [qYear, quarter] = node.id.split('-Q');
        const qNum = parseInt(quarter);
        const yearNum = parseInt(qYear);
        return trades.filter(
          (t) =>
            t._dateComponents.year === yearNum &&
            t._dateComponents.quarter === qNum
        );
      }

      case 'month': {
        const [mYear, month] = node.id.split('-');
        const monthNum = parseInt(month);
        const monthYearNum = parseInt(mYear);
        return trades.filter(
          (t) =>
            t._dateComponents.year === monthYearNum &&
            t._dateComponents.month === monthNum
        );
      }

      case 'week': {
        
        
        const parts = node.id.split('-W');
        const weekNum = parts[1];
        const weekNumber = parseInt(weekNum);
        const yearMonth = parts[0]; 
        const weekYearNum = parseInt(yearMonth.split('-')[0]); 
        const weekMonthNum = parseInt(yearMonth.split('-')[1]); 
        return trades.filter(
          (t) =>
            t._dateComponents.year === weekYearNum &&
            t._dateComponents.weekNum === weekNumber &&
            t._dateComponents.month === weekMonthNum
        );
      }

      case 'day':
        return trades.filter(
          (t) => t._dateComponents.tradingDayString === node.id
        );

      default:
        return trades;
    }
  }

  
  private async buildQuarterNodes(trades: TradeLogData[]): Promise<TimeNode[]> {
    const quarterMap = new Map<string, any[]>();

    trades.forEach((trade) => {
      const date = new Date(trade.entryTime);
      const year = date.getFullYear();
      const quarter = getQuarter(date);
      const quarterId = `${year}-Q${quarter}`;

      if (!quarterMap.has(quarterId)) {
        quarterMap.set(quarterId, []);
      }
      quarterMap.get(quarterId)!.push(trade);
    });

    const quarterNodes: TimeNode[] = [];
    const sortedQuarters = Array.from(quarterMap.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    for (const quarterId of sortedQuarters) {
      const quarterTrades = quarterMap.get(quarterId)!;
      const [year, q] = quarterId.split('-Q');

      quarterNodes.push({
        type: 'quarter',
        id: quarterId,
        label: `Q${q} ${year}`,
        metrics: this.calculateMetrics(quarterTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return quarterNodes;
  }

  
  private async buildMonthNodes(trades: TradeLogData[]): Promise<TimeNode[]> {
    const monthMap = new Map<string, any[]>();

    trades.forEach((trade) => {
      const date = new Date(trade.entryTime);
      const monthId = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      if (!monthMap.has(monthId)) {
        monthMap.set(monthId, []);
      }
      monthMap.get(monthId)!.push(trade);
    });

    const monthNodes: TimeNode[] = [];
    const sortedMonths = Array.from(monthMap.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    for (const monthId of sortedMonths) {
      const monthTrades = monthMap.get(monthId)!;
      const [year, month] = monthId.split('-');

      monthNodes.push({
        type: 'month',
        id: monthId,
        label: `${this.getMonthAbbreviation(parseInt(month) - 1)} ${year}`,
        metrics: this.calculateMetrics(monthTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return monthNodes;
  }

  
  private async buildWeekNodes(trades: TradeLogData[]): Promise<TimeNode[]> {
    const weekMap = new Map<string, any[]>();

    trades.forEach((trade) => {
      const date = new Date(trade.entryTime);
      const weekNum = this.getWeekNumber(date);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const weekId = `${year}-${month}-W${weekNum.toString().padStart(2, '0')}`;

      if (!weekMap.has(weekId)) {
        weekMap.set(weekId, []);
      }
      weekMap.get(weekId)!.push(trade);
    });

    const weekNodes: TimeNode[] = [];
    const sortedWeeks = Array.from(weekMap.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    for (const weekId of sortedWeeks) {
      const weekTrades = weekMap.get(weekId)!;

      
      const yearMatch = weekId.match(/^(\d{4})/);
      const weekMatch = weekId.match(/W(\d+)$/);
      const year = yearMatch ? yearMatch[1] : '';
      const weekNum = weekMatch ? weekMatch[1] : '';

      weekNodes.push({
        type: 'week',
        id: weekId,
        label: `${year} ${t('common.week')} ${weekNum}`,
        metrics: this.calculateMetrics(weekTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return weekNodes;
  }

  
  private async buildDayNodes(trades: TradeLogData[]): Promise<TimeNode[]> {
    const dayMap = new Map<string, any[]>();

    trades.forEach((trade) => {
      const date = new Date(trade.entryTime);
      
      const dayId = getTradingDayString(date, this.plugin);

      if (!dayMap.has(dayId)) {
        dayMap.set(dayId, []);
      }
      dayMap.get(dayId)!.push(trade);
    });

    const dayNodes: TimeNode[] = [];
    const sortedDays = Array.from(dayMap.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    for (const dayId of sortedDays) {
      const dayTrades = dayMap.get(dayId)!;

      dayNodes.push({
        type: 'day',
        id: dayId,
        label: createTradingDayFromString(dayId).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        metrics: this.calculateMetrics(dayTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return dayNodes;
  }

  private invalidateTradeDataCaches(): void {
    this.tradeService.clearCache();
    this.clearCache();
  }

  
  clearCache(): void {
    this.cache.clear();
    this.tradingDayStringCache.clear();
    this.cachedEnrichedTrades = null; 
    this.cachedEnrichedTradesCacheKey = null;
    this.lastUpdateTime = 0;
    
    this.cacheTradingDaySettings();
  }

  
  private markBestWorstPerformers(nodes: TimeNode[]): void {
    if (nodes.length === 0) return;

    
    if (nodes[0].type === 'trade') return;

    
    let best: TimeNode | null = null;
    let worst: TimeNode | null = null;
    let bestPnL = -Infinity;
    let worstPnL = Infinity;

    nodes.forEach((node: TimeNode) => {
      const pnl = node.metrics.totalPnL;

      
      if (pnl > 0 && pnl > bestPnL) {
        bestPnL = pnl;
        best = node;
      }

      
      if (pnl < 0 && pnl < worstPnL) {
        worstPnL = pnl;
        worst = node;
      }
    });

    
    if (nodes.length === 1) {
      const node = nodes[0];
      if (node.metrics.totalPnL > 0) {
        node.performanceIndicator = 'best';
      } else if (node.metrics.totalPnL < 0) {
        node.performanceIndicator = 'worst';
      }
    } else {
      
      
      if (best !== null && bestPnL > 0) {
        (best as TimeNode).performanceIndicator = 'best';
      }
      
      if (worst !== null && worstPnL < 0 && worst !== best) {
        (worst as TimeNode).performanceIndicator = 'worst';
      }
    }
  }

  
  private markBestWorstPerformersRecursive(nodes: TimeNode[]): void {
    
    this.markBestWorstPerformers(nodes);

    
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        this.markBestWorstPerformersRecursive(node.children);
      }
    });
  }

  
  private markBestWorstTrades(trades: TimeNode[]): void {
    if (trades.length === 0) return;

    
    let best: TimeNode | null = null;
    let worst: TimeNode | null = null;
    let bestPnL = -Infinity;
    let worstPnL = Infinity;

    trades.forEach((node: TimeNode) => {
      const pnl = node.trade ? getEffectivePnL(node.trade) : 0;

      
      if (pnl > 0 && pnl > bestPnL) {
        bestPnL = pnl;
        best = node;
      }

      
      if (pnl < 0 && pnl < worstPnL) {
        worstPnL = pnl;
        worst = node;
      }
    });

    
    if (trades.length === 1) {
      const trade = trades[0];
      const pnl = trade.trade ? getEffectivePnL(trade.trade) : 0;
      if (pnl > 0) {
        if (trade.trade) trade.trade.performanceIndicator = 'best';
      } else if (pnl < 0) {
        if (trade.trade) trade.trade.performanceIndicator = 'worst';
      }
    } else {
      
      
      if (best !== null && bestPnL > 0 && (best as TimeNode).trade) {
        (best as TimeNode).trade.performanceIndicator = 'best';
      }
      
      if (
        worst !== null &&
        worstPnL < 0 &&
        worst !== best &&
        (worst as TimeNode).trade
      ) {
        (worst as TimeNode).trade.performanceIndicator = 'worst';
      }
    }
  }

  
  private async buildTradeNodes(trades: TradeLogData[]): Promise<TimeNode[]> {
    
    const sortedTrades = [...trades].sort((a, b) => {
      const dateA = new Date(a.entryTime);
      const dateB = new Date(b.entryTime);
      return dateB.getTime() - dateA.getTime();
    });

    
    if (sortedTrades.length < 100) {
      const tradeNodes: TimeNode[] = sortedTrades.map((trade) => {
        const date = new Date(trade.entryTime);
        const formattedDate = formatDateDisplay(date);
        const tradeStatus = this.getTradeStatus(trade);
        const isOpenTrade = tradeStatus === 'open';
        const pnl = getEffectivePnL(trade);
        const instrument = trade.instrument || 'Unknown';

        const label = `${instrument} - ${formattedDate}${isOpenTrade ? ' (OPEN)' : ''}`;

        return {
          type: 'trade' as const,
          id:
            trade.copiedTradeRowId ||
            trade.filePath ||
            `trade-${instrument}-${date.getTime()}`,
          label,
          metrics: {
            totalPnL: pnl,
            winRate:
              isOpenTrade || this.getOutcomeFromPnL(trade) !== 'win' ? 0 : 100,
            tradeCount: 1,
            status: tradeStatus,
          },
          trade: trade,
          expanded: false,
          dataLoaded: true,
        };
      });

      
      return tradeNodes;
    }

    
    const tradeNodes: TimeNode[] = [];
    const batchSize = 50;

    for (let i = 0; i < sortedTrades.length; i += batchSize) {
      const batch = sortedTrades.slice(i, i + batchSize);

      const batchNodes = batch.map((trade) => {
        const date = new Date(trade.entryTime);
        const formattedDate = formatDateDisplay(date);
        const tradeStatus = this.getTradeStatus(trade);
        const isOpenTrade = tradeStatus === 'open';
        const pnl = getEffectivePnL(trade);
        const instrument = trade.instrument || 'Unknown';

        const label = `${instrument} - ${formattedDate}${isOpenTrade ? ' (OPEN)' : ''}`;

        return {
          type: 'trade' as const,
          id:
            trade.copiedTradeRowId ||
            trade.filePath ||
            `trade-${instrument}-${date.getTime()}`,
          label,
          metrics: {
            totalPnL: pnl,
            winRate:
              isOpenTrade || this.getOutcomeFromPnL(trade) !== 'win' ? 0 : 100,
            tradeCount: 1,
            status: tradeStatus,
          },
          trade: trade,
          expanded: false,
          dataLoaded: true,
        };
      });

      tradeNodes.push(...batchNodes);

      
      if ((i / batchSize) % 3 === 0 && i + batchSize < sortedTrades.length) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    return tradeNodes;
  }

  
  private async buildTradesForDay(
    trades: EnrichedTradeData[],
    _dayId: string
  ): Promise<TimeNode[]> {
    try {
      const tradeNodes = await this.buildTradeNodesOptimized(trades);
      return tradeNodes;
    } catch (error) {
      console.error('Error building trades for day:', error);
      return [];
    }
  }

  
  private buildQuartersForYear(
    trades: TradeLogData[],
    year: number
  ): TimeNode[] {
    const quarterMap = new Map<number, TradeLogData[]>();

    trades.forEach((trade) => {
      const date = new Date(trade.entryTime);
      const quarter = getQuarter(date);
      if (!quarterMap.has(quarter)) {
        quarterMap.set(quarter, []);
      }
      quarterMap.get(quarter)!.push(trade);
    });

    const quarterNodes: TimeNode[] = [];
    for (let q = 4; q >= 1; q--) {
      if (quarterMap.has(q)) {
        const quarterTrades = quarterMap.get(q)!;
        quarterNodes.push({
          type: 'quarter',
          id: `${year}-Q${q}`,
          label: `Q${q}`,
          metrics: this.calculateMetrics(quarterTrades),
          expanded: false,
          dataLoaded: false,
        });
      }
    }

    return quarterNodes;
  }

  
  private buildMonthsForQuarter(
    trades: TradeLogData[],
    quarterId: string
  ): TimeNode[] {
    const [year, quarter] = quarterId.split('-Q');
    const qNum = parseInt(quarter);
    const startMonth = (qNum - 1) * 3;

    const monthMap = new Map<number, TradeLogData[]>();
    trades.forEach((trade) => {
      const date = new Date(trade.entryTime);
      const month = date.getMonth();
      if (!monthMap.has(month)) {
        monthMap.set(month, []);
      }
      monthMap.get(month)!.push(trade);
    });

    const monthNodes: TimeNode[] = [];
    for (let m = startMonth + 2; m >= startMonth; m--) {
      if (monthMap.has(m)) {
        const monthTrades = monthMap.get(m)!;
        monthNodes.push({
          type: 'month',
          id: `${year}-${(m + 1).toString().padStart(2, '0')}`,
          label: this.getMonthAbbreviation(m),
          metrics: this.calculateMetrics(monthTrades),
          expanded: false,
          dataLoaded: false,
        });
      }
    }

    return monthNodes;
  }

  
  private buildWeeksForMonth(
    trades: TradeLogData[],
    monthId: string
  ): TimeNode[] {
    const weekMap = new Map<number, TradeLogData[]>();

    trades.forEach((trade) => {
      const date = new Date(trade.entryTime);
      const weekNum = this.getWeekNumber(date);
      if (!weekMap.has(weekNum)) {
        weekMap.set(weekNum, []);
      }
      weekMap.get(weekNum)!.push(trade);
    });

    const weekNodes: TimeNode[] = [];
    const sortedWeeks = Array.from(weekMap.keys()).sort((a, b) => b - a);

    for (const weekNum of sortedWeeks) {
      const weekTrades = weekMap.get(weekNum)!;
      const [_year] = monthId.split('-');
      weekNodes.push({
        type: 'week',
        id: `${monthId}-W${weekNum.toString().padStart(2, '0')}`,
        label: `${t('common.week')} ${weekNum}`,
        metrics: this.calculateMetrics(weekTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return weekNodes;
  }

  
  private buildDaysForWeek(trades: TradeLogData[]): TimeNode[] {
    const dayMap = new Map<string, TradeLogData[]>();

    trades.forEach((trade) => {
      const date = new Date(trade.entryTime);
      
      const dayId = getTradingDayString(date, this.plugin);

      if (!dayMap.has(dayId)) {
        dayMap.set(dayId, []);
      }
      dayMap.get(dayId)!.push(trade);
    });

    const dayNodes: TimeNode[] = [];
    const sortedDays = Array.from(dayMap.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    for (const dayId of sortedDays) {
      const dayTrades = dayMap.get(dayId)!;
      const date = createTradingDayFromString(dayId);
      const dayName = this.getDayAbbreviation(date.getDay());

      dayNodes.push({
        type: 'day',
        id: dayId,
        label: `${dayName} ${date.getDate()}`,
        metrics: this.calculateMetrics(dayTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return dayNodes;
  }

  

  
  private async buildTradeNodesOptimized(
    enrichedTrades: EnrichedTradeData[]
  ): Promise<TimeNode[]> {
    
    const sortedTrades = [...enrichedTrades].sort((a, b) => {
      return (
        b._dateComponents.date.getTime() - a._dateComponents.date.getTime()
      );
    });

    
    if (sortedTrades.length > 200) {
      return await this.buildTradeNodesLightweight(sortedTrades);
    }

    
    const tradeNodes: TimeNode[] = sortedTrades.map((trade) => {
      const formattedDate = formatDateDisplay(trade._dateComponents.date);
      const tradeStatus = this.getTradeStatus(trade);
      const isOpenTrade = tradeStatus === 'open';
      const pnl = getEffectivePnL(trade);
      const instrument = trade.instrument || 'Unknown';

      const label = `${instrument} - ${formattedDate}${isOpenTrade ? ' (OPEN)' : ''}`;

      return {
        type: 'trade' as const,
        id:
          trade.copiedTradeRowId ||
          trade.filePath ||
          `trade-${instrument}-${trade._dateComponents.date.getTime()}`,
        label,
        metrics: {
          totalPnL: pnl,
          winRate:
            isOpenTrade || this.getOutcomeFromPnL(trade) !== 'win' ? 0 : 100,
          tradeCount: 1,
          status: tradeStatus,
        },
        trade: trade,
        expanded: false,
        dataLoaded: true,
      };
    });

    return tradeNodes;
  }

  
  private async buildTradeNodesLightweight(
    sortedTrades: EnrichedTradeData[]
  ): Promise<TimeNode[]> {
    const tradeNodes: TimeNode[] = [];
    const batchSize = 100;

    for (let i = 0; i < sortedTrades.length; i += batchSize) {
      const batch = sortedTrades.slice(i, i + batchSize);

      const batchNodes = batch.map((trade) => {
        const tradeStatus = this.getTradeStatus(trade);
        const isOpenTrade = tradeStatus === 'open';
        const pnl = getEffectivePnL(trade);
        const instrument = trade.instrument || 'Unknown';

        
        const label = `${instrument} - ${trade._dateComponents.dayKey}${isOpenTrade ? ' (OPEN)' : ''}`;

        return {
          type: 'trade' as const,
          id:
            trade.copiedTradeRowId ||
            trade.filePath ||
            `trade-${instrument}-${trade._dateComponents.date.getTime()}`,
          label,
          metrics: {
            totalPnL: pnl,
            winRate:
              isOpenTrade || this.getOutcomeFromPnL(trade) !== 'win' ? 0 : 100,
            tradeCount: 1,
            status: tradeStatus,
          },
          trade: trade,
          expanded: false,
          dataLoaded: true,
        };
      });

      tradeNodes.push(...batchNodes);

      
      if (i % 200 === 0 && i + batchSize < sortedTrades.length) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    return tradeNodes;
  }

  
  private async buildYearNodesOptimized(
    enrichedTrades: EnrichedTradeData[]
  ): Promise<TimeNode[]> {
    const yearMap = new Map<number, EnrichedTradeData[]>();

    
    enrichedTrades.forEach((trade) => {
      const year = trade._dateComponents.year;
      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }
      yearMap.get(year)!.push(trade);
    });

    const yearNodes: TimeNode[] = [];
    
    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b - a);

    for (const year of sortedYears) {
      const yearTrades = yearMap.get(year)!;
      yearNodes.push({
        type: 'year',
        id: year.toString(),
        label: year.toString(),
        metrics:
          yearTrades.length > 500
            ? this.calculateMetricsLightweight(yearTrades)
            : this.calculateMetrics(yearTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return yearNodes;
  }

  
  private async buildQuarterNodesOptimized(
    enrichedTrades: EnrichedTradeData[]
  ): Promise<TimeNode[]> {
    const quarterMap = new Map<string, EnrichedTradeData[]>();

    enrichedTrades.forEach((trade) => {
      const year = trade._dateComponents.year;
      const quarter = trade._dateComponents.quarter;
      const quarterId = `${year}-Q${quarter}`;

      if (!quarterMap.has(quarterId)) {
        quarterMap.set(quarterId, []);
      }
      quarterMap.get(quarterId)!.push(trade);
    });

    const quarterNodes: TimeNode[] = [];
    const sortedQuarters = Array.from(quarterMap.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    for (const quarterId of sortedQuarters) {
      const quarterTrades = quarterMap.get(quarterId)!;
      const [year, q] = quarterId.split('-Q');

      quarterNodes.push({
        type: 'quarter',
        id: quarterId,
        label: `Q${q} ${year}`,
        metrics:
          quarterTrades.length > 500
            ? this.calculateMetricsLightweight(quarterTrades)
            : this.calculateMetrics(quarterTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return quarterNodes;
  }

  
  private async buildMonthNodesOptimized(
    enrichedTrades: EnrichedTradeData[]
  ): Promise<TimeNode[]> {
    const monthMap = new Map<string, EnrichedTradeData[]>();

    enrichedTrades.forEach((trade) => {
      const monthId = `${trade._dateComponents.year}-${trade._dateComponents.month.toString().padStart(2, '0')}`;

      if (!monthMap.has(monthId)) {
        monthMap.set(monthId, []);
      }
      monthMap.get(monthId)!.push(trade);
    });

    const monthNodes: TimeNode[] = [];
    const sortedMonths = Array.from(monthMap.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    for (const monthId of sortedMonths) {
      const monthTrades = monthMap.get(monthId)!;
      const [year, month] = monthId.split('-');

      monthNodes.push({
        type: 'month',
        id: monthId,
        label: `${this.getMonthAbbreviation(parseInt(month) - 1)} ${year}`,
        metrics:
          monthTrades.length > 500
            ? this.calculateMetricsLightweight(monthTrades)
            : this.calculateMetrics(monthTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return monthNodes;
  }

  
  private async buildWeekNodesOptimized(
    enrichedTrades: EnrichedTradeData[]
  ): Promise<TimeNode[]> {
    const weekMap = new Map<string, EnrichedTradeData[]>();

    enrichedTrades.forEach((trade) => {
      const weekId = `${trade._dateComponents.year}-${trade._dateComponents.month.toString().padStart(2, '0')}-W${trade._dateComponents.weekNum.toString().padStart(2, '0')}`;

      if (!weekMap.has(weekId)) {
        weekMap.set(weekId, []);
      }
      weekMap.get(weekId)!.push(trade);
    });

    const weekNodes: TimeNode[] = [];
    const sortedWeeks = Array.from(weekMap.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    for (const weekId of sortedWeeks) {
      const weekTrades = weekMap.get(weekId)!;

      
      const parts = weekId.split('-W');
      const yearMonth = parts[0]; 
      const weekNum = parts[1] || ''; 

      weekNodes.push({
        type: 'week',
        id: weekId,
        label: `${yearMonth} ${t('common.week')} ${weekNum}`,
        metrics:
          weekTrades.length > 500
            ? this.calculateMetricsLightweight(weekTrades)
            : this.calculateMetrics(weekTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return weekNodes;
  }

  
  private async buildDayNodesOptimized(
    enrichedTrades: EnrichedTradeData[]
  ): Promise<TimeNode[]> {
    const dayMap = new Map<string, EnrichedTradeData[]>();

    
    enrichedTrades.forEach((trade) => {
      const dayId = trade._dateComponents.tradingDayString;

      if (!dayMap.has(dayId)) {
        dayMap.set(dayId, []);
      }
      dayMap.get(dayId)!.push(trade);
    });

    const dayNodes: TimeNode[] = [];
    const sortedDays = Array.from(dayMap.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    for (const dayId of sortedDays) {
      const dayTrades = dayMap.get(dayId)!;

      dayNodes.push({
        type: 'day',
        id: dayId,
        label: createTradingDayFromString(dayId).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        metrics:
          dayTrades.length > 500
            ? this.calculateMetricsLightweight(dayTrades)
            : this.calculateMetrics(dayTrades),
        expanded: false,
        dataLoaded: false,
      });
    }

    return dayNodes;
  }

  
  private shouldLoadMissedTrades(tradeTypes?: TradeType[]): boolean {
    if (
      !tradeTypes ||
      tradeTypes.length === 0 ||
      tradeTypes.length === SELECTABLE_TRADE_TYPES_COUNT
    )
      return true;
    return tradeTypes.includes('missed');
  }

  
  destroy(): void {
    
    for (const unsubscribe of this.unsubscribeFns) {
      unsubscribe();
    }
    this.unsubscribeFns = [];

    
    this.tradingDayStringCache.clear();
    this.cache.clear();
    this.latestTradeRevisionById.clear();
    this.pendingLegacyMirrors.clear();
  }
}
