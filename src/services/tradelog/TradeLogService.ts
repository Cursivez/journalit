

import { TradeService } from '../trade/TradeService';
import {
  formatDateDisplay,
  formatLocalDateString,
  getWeekNumberForDate,
  getWeekStartDate,
  getWeekStartDaySetting,
  type WeekStartDaySetting,
} from '../../utils/dateUtils';
import {
  getTradingDayString,
  createTradingDayFromString,
} from '../../utils/tradingDayUtils';
import {
  getProjectedRealizedEventTrades,
  getTradeRealizedPnlEvents,
} from '../../utils/tradeAnalyticsDate';
import type { AnalyticsDateBasis } from '../../settings/types';
import {
  TimeNode,
  ViewLevel,
  TradeLogMetrics,
  TradeType,
  TradeStatus,
  ReviewStatusFilter,
  DirectionFilter,
  SELECTABLE_TRADE_TYPES_COUNT,
} from './types';
import {
  getCurrentRealizedPnL,
  getTradeDisplayStatusWithContext,
  hasDerivableCurrentRealizedPnL,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import {
  calculateTotalDividends,
  resolveRealizedOrTerminalPnLResolution,
  type RealizedOrTerminalPnLResolution,
} from '../../utils/pnlCalculation';
import {
  areSnapshotKeysClaimedByCustomFields,
  calculateSnapshotRealizedPnL,
  calculateUnrealizedPnL,
} from '../../utils/unrealizedPnl';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import { eventBus } from '../events/EventBus';
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
import { normalizePath } from 'obsidian';
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
import {
  accountsRequiringCopiedRows,
  resolveAccountPhaseWindowsFromPlugin,
} from '../../components/shared/filters/accountPhaseScope';
import type {
  AccountPhaseScope,
  UnifiedFilters,
} from '../../components/shared/filters/types';
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
  weekStartString: string;
  tradingDayString: string;
}



function isTradeLogRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asTradeLogRecord(value: unknown): Record<string, unknown> | undefined {
  return isTradeLogRecord(value) ? value : undefined;
}

function getStringValue(
  record: Record<string, unknown>,
  key: string
): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

function getBooleanValue(
  record: Record<string, unknown>,
  key: string
): boolean | undefined {
  const value = record[key];
  return typeof value === 'boolean' ? value : undefined;
}

function createMissedTradeLogData(
  frontmatter: Record<string, unknown>,
  filePath: string
): TradeLogData | null {
  const entryTimeValue = frontmatter.entryTime;
  const entryTime =
    entryTimeValue instanceof Date
      ? entryTimeValue
      : typeof entryTimeValue === 'string'
        ? new Date(entryTimeValue)
        : null;
  if (!entryTime || Number.isNaN(entryTime.getTime())) {
    return null;
  }

  return {
    ...frontmatter,
    entryTime,
    filePath,
    path: filePath,
    type: 'missed-trade',
    isMissedTrade: true,
    instrument: getStringValue(frontmatter, 'instrument'),
    direction: getStringValue(frontmatter, 'direction'),
    thesis: getStringValue(frontmatter, 'thesis'),
  };
}

type TradeLogData = PartialTradeFrontmatter &
  Record<string, unknown> & {
    breakEvenAccountCurrentBalance?: number;
    breakEvenAccountCurrentBalanceCurrency?: string;
    breakEvenAccountCurrentBalanceTotal?: number;
    breakEvenAccountCurrentBalanceTotalCurrency?: string;
    
    entryTime: Date;
    
    path?: string;
    
    _dateComponents?: DateComponents;
    
    _analyticsEventDate?: Date;
    
    _analyticsEventRowId?: string;
    
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
  analyticsDateBasis?: AnalyticsDateBasis;
  tradeTypes?: TradeType[];
  statuses?: TradeStatus[];
  reviewStatus?: ReviewStatusFilter[];
  directions?: DirectionFilter[];
  sessionLogTags?: string[];
  accounts?: string[];
  tickers?: string[];
  setups?: string[];
  tags?: string[];
  mistakes?: string[];
  customFieldFilters?: CustomFieldFilterSelections;
  operationFilePaths?: string[];
  accountPhases?: AccountPhaseScope[];
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

  const nestedCustomFields = asTradeLogRecord(trade.customFields);
  if (nestedCustomFields) {
    return nestedCustomFields[field.id];
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
  private missedTradeAccountOptionsCache: string[] | null = null;
  private resolvedTradePnLCache = new WeakMap<
    object,
    RealizedOrTerminalPnLResolution
  >();

  
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
    this.tradeService = plugin.tradeService;

    
    this.cacheTradingDaySettings();
  }

  connect(): void {
    if (this.unsubscribeFns.length > 0) return;

    const bumpTradeRevisionAndClearCache = () => {
      this.tradeCommitRevisionToken++;
      this.invalidateTradeDataCaches();
    };
    const bumpQueryRevisionAndClearCache = () => {
      this.tradeCommitRevisionToken++;
      this.clearCache();
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
      eventBus.subscribe(
        'drc:session-log-index-invalidated',
        bumpQueryRevisionAndClearCache
      ),
      eventBus.subscribe('folder-path:changed', bumpQueryRevisionAndClearCache),
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
    accounts?: string[],
    operationFilePaths?: string[],
    accountPhases?: AccountPhaseScope[]
  ): Promise<TradeLogData[]> {
    

    const allTrades: unknown[] = await this.tradeService.getTradeData();

    
    
    
    
    const operationPathSet = operationFilePaths?.length
      ? new Set(operationFilePaths.map(normalizePath))
      : null;
    const relevantTrades = allTrades.flatMap((trade) => {
      const tradeRecord = asTradeLogRecord(trade);
      if (!tradeRecord) return [];
      const filePath =
        getStringValue(tradeRecord, 'path') ??
        getStringValue(tradeRecord, 'filePath');
      if (!filePath) return [];
      if (operationPathSet && !operationPathSet.has(normalizePath(filePath))) {
        return [];
      }
      return [tradeRecord];
    });

    const breakEvenThresholdMode =
      this.plugin.settings.trade.breakEvenThresholdMode ?? 'fixed';
    const accountBalanceLookup =
      breakEvenThresholdMode === 'percentage_current_balance'
        ? await fetchBreakEvenAccountBalanceLookup(this.plugin)
        : null;
    
    
    const copyMaterializationAccounts = accountsRequiringCopiedRows(
      accounts,
      accountPhases
    );

    
    
    const tradesWithPaths = relevantTrades.flatMap((trade) => {
      const normalizedTrade: TradeLogData = {
        ...trade,
        entryTime:
          trade.entryTime instanceof Date
            ? trade.entryTime
            : new Date(String(trade.entryTime)),
        filePath:
          getStringValue(trade, 'path') ?? getStringValue(trade, 'filePath'),
        
        isBacktestTrade:
          getBooleanValue(trade, 'isBacktestTrade') ||
          getStringValue(trade, 'type') === 'backtest-trade',
        isMissedTrade:
          getBooleanValue(trade, 'isMissedTrade') ||
          getStringValue(trade, 'type') === 'missed-trade',
      };

      if (accountBalanceLookup) {
        Object.assign(
          normalizedTrade,
          getBreakEvenAccountBalanceFields(
            resolveBreakEvenAccountBalances(
              normalizedTrade,
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

      
      
      
      
      const copiedRowsForFilters = operationPathSet
        ? []
        : this.createCopiedTradeLogRows(
            normalizedTrade,
            copyMaterializationAccounts
          );
      const allCopiedRowsForSummary = operationPathSet
        ? []
        : this.createCopiedTradeLogRows(normalizedTrade, [], true);
      const tradeWithCopySummary = allCopiedRowsForSummary.length
        ? {
            ...normalizedTrade,
            copiedToAccounts: allCopiedRowsForSummary.map((copiedRow) => ({
              account: Array.isArray(copiedRow.account)
                ? String(copiedRow.account[0] || '')
                : String(copiedRow.account || ''),
              pnl: this.getResolvedTradePnL(copiedRow),
              multiplier: copiedRow.copyMultiplier ?? 0,
            })),
          }
        : normalizedTrade;

      return [tradeWithCopySummary, ...copiedRowsForFilters];
    });

    
    if (!operationPathSet && this.shouldLoadMissedTrades(tradeTypes)) {
      try {
        const missedTrades = await this.getMissedTradeFrontmatter();
        for (const { filePath, frontmatter } of missedTrades) {
          if (!frontmatter.entryTime) {
            continue;
          }

          const missedTradeData = createMissedTradeLogData(
            frontmatter,
            filePath
          );
          if (missedTradeData) {
            tradesWithPaths.push(missedTradeData);
          }
        }
      } catch (error) {
        console.error('Error fetching missed trades for trade log:', error);
      }
    }

    
    
    

    return tradesWithPaths;
  }

  private async getMissedTradeFrontmatter(): Promise<
    Array<{ filePath: string; frontmatter: Record<string, unknown> }>
  > {
    const missedTradeService =
      await this.plugin.serviceManager.getMissedTradeService();
    if (!missedTradeService) {
      return [];
    }

    const missedTradeFiles = await missedTradeService.getMissedTrades(
      new Date('2000-01-01'),
      new Date('2099-12-31')
    );

    return missedTradeFiles.flatMap((file) => {
      const frontmatter = asTradeLogRecord(
        this.plugin.app.metadataCache.getFileCache(file)?.frontmatter
      );
      if (
        !frontmatter ||
        (frontmatter.type !== 'missed-trade' &&
          frontmatter.isMissedTrade !== true)
      ) {
        return [];
      }

      return [{ filePath: file.path, frontmatter }];
    });
  }

  private async getMissedTradeAccountNames(): Promise<string[]> {
    if (this.missedTradeAccountOptionsCache !== null) {
      return this.missedTradeAccountOptionsCache;
    }

    const accountNames = new Map<string, string>();
    try {
      const missedTrades = await this.getMissedTradeFrontmatter();
      for (const { frontmatter } of missedTrades) {
        for (const accountName of normalizeTradeAccountIdentity(frontmatter)
          .accountNames) {
          const normalizedName = accountName.trim();
          const lookupKey = normalizeAccountLookupKey(normalizedName);
          if (!lookupKey || accountNames.has(lookupKey)) {
            continue;
          }

          accountNames.set(lookupKey, normalizedName);
        }
      }
    } catch (error) {
      console.error(
        'Error fetching missed trades for Trade Log account options:',
        error
      );
      return [];
    }

    this.missedTradeAccountOptionsCache = Array.from(accountNames.values());
    return this.missedTradeAccountOptionsCache;
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

    const resolvedBasePnL = this.getResolvedTradePnLResolution(baseTrade);
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
      const copyPnlResult = calculateCopiedTradePnL({
        plugin: this.plugin,
        baseTrade: { ...baseTrade, copyBaseTradeKey },
        copyAccountName,
        copyAccountLookupKey,
        multiplier: copyPeriod.multiplier,
        resolvedBaseNetPnL: resolvedBasePnL.pnl ?? undefined,
        resolvedBaseFinancialAdjustmentRatio:
          resolvedBasePnL.financialAdjustmentRatio,
      });
      const { pnl: copiedPnL, commission, adjustment } = copyPnlResult;
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
        pnl: copiedPnL ?? undefined,
        directPnL:
          typeof baseTrade.directPnL === 'number'
            ? baseTrade.directPnL * copyPeriod.multiplier
            : baseTrade.directPnL,
        riskAmount: copiedRiskAmount,
        rMultiple:
          copiedPnL !== null && copiedRiskAmount && copiedRiskAmount !== 0
            ? copiedPnL / copiedRiskAmount
            : copiedPnL === null
              ? undefined
              : baseTrade.rMultiple,
        commission: commission ?? 0,
        fees: 0,
        currency: baseTrade.currency ?? copyMetadata.currency,
        
        
        
        brokerBaseCurrencyPnl: undefined,
        brokerBaseCurrency: undefined,
        brokerBaseCurrencyPnlSource: undefined,
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
        query.reviewStatus,
        query.directions,
        query.sessionLogTags,
        query.analyticsDateBasis,
        query.operationFilePaths,
        query.accountPhases,
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
    reviewStatus?: ReviewStatusFilter[],
    directions?: DirectionFilter[],
    sessionLogTags?: string[],
    analyticsDateBasis?: AnalyticsDateBasis,
    operationFilePaths?: string[],
    accountPhases?: AccountPhaseScope[],
    retryCount: number = 0
  ): Promise<TimeNode[]> {
    
    const normalizeFilterArray = (arr?: string[]) =>
      !arr || arr.length === 0 ? 'ALL' : JSON.stringify([...arr].sort());
    const normalizeCustomFieldFilters = (
      filters?: CustomFieldFilterSelections
    ): string => {
      const entries = Object.entries(filters || {})
        .flatMap(([fieldId, values]) =>
          Array.isArray(values) && values.length > 0
            ? ([[fieldId, [...values].sort()]] as const)
            : []
        )
        .sort(([fieldIdA], [fieldIdB]) => fieldIdA.localeCompare(fieldIdB));

      return entries.length === 0 ? 'ALL' : JSON.stringify(entries);
    };
    const query: HierarchicalQueryParams = {
      viewLevel,
      startDate,
      endDate,
      analyticsDateBasis,
      tradeTypes,
      statuses,
      reviewStatus,
      directions,
      sessionLogTags,
      accounts,
      tickers,
      setups,
      tags,
      mistakes,
      customFieldFilters,
      operationFilePaths,
      accountPhases,
    };

    const requestRevisionToken = this.tradeCommitRevisionToken;
    const includeCopyAccountsInAllAccounts =
      this.plugin.settings.trade.includeCopyAccountsInAllAccountsAnalytics ===
      true;
    const accountPhaseCacheKey =
      !accountPhases || accountPhases.length === 0
        ? 'ALL'
        : [...accountPhases]
            .map((scope) => `${scope.account}\0${scope.phaseId}`)
            .sort()
            .join(',');
    const cacheKey = `v${this.CACHE_VERSION}-r${requestRevisionToken}-copy${includeCopyAccountsInAllAccounts}-${viewLevel}-${startDate?.toISOString()}-${endDate?.toISOString()}-${analyticsDateBasis ?? 'calendar-entry'}-${normalizeFilterArray(tradeTypes)}-${normalizeFilterArray(statuses)}-${normalizeFilterArray(reviewStatus)}-${normalizeFilterArray(directions)}-${normalizeFilterArray(sessionLogTags)}-${normalizeFilterArray(accounts)}-${normalizeFilterArray(tickers)}-${normalizeFilterArray(setups)}-${normalizeFilterArray(tags)}-${normalizeFilterArray(mistakes)}-${normalizeCustomFieldFilters(customFieldFilters)}-${normalizeFilterArray(operationFilePaths)}-${accountPhaseCacheKey}`;
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
      this.cachedEnrichedTradesCacheKey = null;
      this.cachedEnrichedTradesOperationScopeKey = null;
    }

    
    const allTrades = await this.getTradesWithPaths(
      tradeTypes,
      accounts,
      operationFilePaths,
      accountPhases
    );

    
    
    let filteredTrades = this.applySharedTradeFilters(allTrades, {
      accounts: accounts || [],
      accountPhases: accountPhases || [],
      tickers: tickers || [],
      setups: setups || [],
      tags: tags || [],
      mistakes: mistakes || [],
      tradeTypes: tradeTypes || [],
      statuses: statuses || [],
      reviewStatus: reviewStatus || [],
      directions: directions || [],
      customFieldFilters: customFieldFilters || {},
    });
    if (startDate || endDate || analyticsDateBasis === 'exit') {
      filteredTrades = this.filterTradesByDateRange(
        filteredTrades,
        startDate,
        endDate,
        analyticsDateBasis
      );
    }

    
    let enrichedTrades = this.preComputeDateComponents(filteredTrades);
    const selectedSessionLogTags = sessionLogTags || [];
    const sessionLogFilterActive =
      viewLevel === 'days' && selectedSessionLogTags.length > 0;
    let matchingDays: Set<string> | null = null;
    let sessionLogTagIdsByDay: ReadonlyMap<string, ReadonlySet<string>> | null =
      null;
    if (viewLevel === 'days') {
      sessionLogTagIdsByDay = await this.loadSessionLogTagIdsByDay();

      if (sessionLogFilterActive) {
        const selectedTagIds = new Set(selectedSessionLogTags);
        matchingDays = new Set<string>();
        for (const [dayId, tagIds] of sessionLogTagIdsByDay) {
          for (const tagId of tagIds) {
            if (selectedTagIds.has(tagId)) {
              matchingDays.add(dayId);
              break;
            }
          }
        }
        const resolvedMatchingDays = matchingDays;
        enrichedTrades = enrichedTrades.filter((trade) =>
          resolvedMatchingDays.has(trade._dateComponents.tradingDayString)
        );
      }
    }

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
        result = await this.buildDayNodesOptimized(
          enrichedTrades,
          sessionLogTagIdsByDay
        );
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

    if (matchingDays) {
      const existingDayIds = new Set(result.map((node) => node.id));
      for (const dayId of matchingDays) {
        if (existingDayIds.has(dayId)) continue;
        const date = createTradingDayFromString(dayId);
        if (startDate && date < startDate) continue;
        if (endDate && date > endDate) continue;
        result.push({
          type: 'day',
          id: dayId,
          label: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          metrics: { totalPnL: 0, winRate: 0, tradeCount: 0 },
          sessionLogTagIds: this.getSessionLogTagIdsForDay(
            dayId,
            sessionLogTagIdsByDay
          ),
          expanded: false,
          dataLoaded: true,
          children: [],
        });
      }
      result.sort((a, b) => b.id.localeCompare(a.id));
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
    this.cachedEnrichedTradesOperationScopeKey =
      this.getOperationScopeCacheKey(operationFilePaths);

    
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
  private cachedEnrichedTradesOperationScopeKey: string | null = null;

  private getOperationScopeCacheKey(operationFilePaths?: string[]): string {
    if (!operationFilePaths?.length) return 'ALL';
    return JSON.stringify(
      Array.from(new Set(operationFilePaths.map(normalizePath))).sort()
    );
  }

  private filterEnrichedTradesByOperationPaths(
    trades: EnrichedTradeData[],
    operationFilePaths?: string[]
  ): EnrichedTradeData[] {
    if (!operationFilePaths?.length) return trades;
    const operationPathSet = new Set(operationFilePaths.map(normalizePath));
    return trades.filter((trade) => {
      const filePath =
        typeof trade.path === 'string'
          ? trade.path
          : typeof trade.filePath === 'string'
            ? trade.filePath
            : null;
      return filePath ? operationPathSet.has(normalizePath(filePath)) : false;
    });
  }

  
  async getNodeChildren(
    node: TimeNode,
    options: { operationFilePaths?: string[]; retryCount?: number } = {}
  ): Promise<TimeNode[]> {
    const retryCount = options.retryCount ?? 0;
    const requestRevisionToken = this.tradeCommitRevisionToken;
    const requestedOperationScopeKey = this.getOperationScopeCacheKey(
      options.operationFilePaths
    );

    let enrichedTrades = this.cachedEnrichedTrades;

    
    
    if (
      !enrichedTrades ||
      enrichedTrades.length === 0 ||
      this.cachedEnrichedTradesOperationScopeKey !== requestedOperationScopeKey
    ) {
      const trades = await this.getTradesWithPaths(
        undefined,
        undefined,
        options.operationFilePaths
      );

      if (requestRevisionToken !== this.tradeCommitRevisionToken) {
        if (retryCount < 2) {
          return this.getNodeChildren(node, {
            ...options,
            retryCount: retryCount + 1,
          });
        }
      }

      enrichedTrades = this.preComputeDateComponents(trades);
      if (requestRevisionToken === this.tradeCommitRevisionToken) {
        this.cachedEnrichedTrades = enrichedTrades;
        this.cachedEnrichedTradesCacheKey = null;
        this.cachedEnrichedTradesOperationScopeKey = requestedOperationScopeKey;
      }
    }

    const operationScopedTrades = this.filterEnrichedTradesByOperationPaths(
      enrichedTrades,
      options.operationFilePaths
    );
    const filteredTrades = this.filterTradesByNode(operationScopedTrades, node);

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
        children = this.buildDaysForWeek(
          filteredTrades,
          await this.loadSessionLogTagIdsByDay()
        );
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
        return this.getNodeChildren(node, {
          ...options,
          retryCount: retryCount + 1,
        });
      }
    }

    return children;
  }

  
  private preComputeDateComponents(
    trades: TradeLogData[]
  ): EnrichedTradeData[] {
    const result = trades.flatMap((trade) => {
      
      

      if (!trade.entryTime) {
        return []; 
      }

      const date = new Date(trade._analyticsEventDate ?? trade.entryTime);

      
      if (isNaN(date.getTime())) {
        return []; 
      }
      const tradingDayString = this.getTradingDayStringMemoized(date);
      const tradingDayDate = createTradingDayFromString(tradingDayString);
      const year = tradingDayDate.getFullYear();
      const month = tradingDayDate.getMonth();
      const quarter = Math.floor(month / 3) + 1;
      const weekStart = getWeekStartDate(
        tradingDayDate,
        this.cachedWeekStartDay
      );

      return [
        {
          ...trade,
          _dateComponents: {
            date,
            year,
            month: month + 1, 
            quarter,
            dayKey: tradingDayString,
            weekStartString: formatLocalDateString(weekStart),
            tradingDayString,
          },
        },
      ];
    });

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

  
  private getGroupedDisplayPnL(
    trade: TradeLogData,
    snapshotKeysClaimedByCustomFields: boolean
  ): {
    pnl: number;
    includesUnrealized: boolean;
  } {
    const realizedPnL = this.getResolvedTradePnL(trade);
    if (
      !this.plugin.settings.trade.includeUnrealizedPnLInCalculations ||
      snapshotKeysClaimedByCustomFields
    ) {
      return { pnl: realizedPnL, includesUnrealized: false };
    }

    const unrealizedPnL = calculateUnrealizedPnL(trade);
    if (unrealizedPnL === null) {
      return { pnl: realizedPnL, includesUnrealized: false };
    }

    const currentRealizedPnL = getCurrentRealizedPnL(
      trade,
      calculateTotalDividends(trade)
    );
    if (currentRealizedPnL === null) {
      return { pnl: realizedPnL, includesUnrealized: false };
    }
    const displayedRealizedPnL = calculateSnapshotRealizedPnL(
      trade,
      currentRealizedPnL
    );
    return {
      pnl: displayedRealizedPnL + unrealizedPnL,
      includesUnrealized: true,
    };
  }

  private getMetricContributionTrades(
    trades: TradeLogData[],
    snapshotKeysClaimedByCustomFields: boolean
  ): {
    pnlContributingTrades: TradeLogData[];
    outcomeContributingTrades: TradeLogData[];
  } {
    const pnlContributingTrades: TradeLogData[] = [];
    const outcomeContributingTrades: TradeLogData[] = [];

    for (const trade of trades) {
      if (trade.isMissedTrade) continue;

      const contributesStoredPnL = isPnlContributingTrade(trade);
      const includesUnrealized = this.getGroupedDisplayPnL(
        trade,
        snapshotKeysClaimedByCustomFields
      ).includesUnrealized;
      if (
        contributesStoredPnL ||
        hasDerivableCurrentRealizedPnL(trade) ||
        includesUnrealized
      ) {
        pnlContributingTrades.push(trade);
      }
      if (contributesStoredPnL || includesUnrealized) {
        outcomeContributingTrades.push(trade);
      }
    }

    return { pnlContributingTrades, outcomeContributingTrades };
  }

  
  private calculateMetricsLightweight(trades: TradeLogData[]): TradeLogMetrics {
    if (trades.length === 0) {
      return { totalPnL: 0, winRate: 0, tradeCount: 0 };
    }

    const openTrades = trades.filter((t) =>
      ['open', 'partially_closed'].includes(this.getTradeStatus(t))
    );
    const closedTrades = trades.filter(
      (t) =>
        !['open', 'partially_closed', 'cancelled'].includes(
          this.getTradeStatus(t)
        ) && !t.isMissedTrade
    );
    const snapshotKeysClaimedByCustomFields =
      areSnapshotKeysClaimedByCustomFields(
        this.plugin.customFieldsService?.getFields()
      );
    const { pnlContributingTrades, outcomeContributingTrades } =
      this.getMetricContributionTrades(
        trades,
        snapshotKeysClaimedByCustomFields
      );

    let wins = 0;
    let losses = 0;
    for (const trade of outcomeContributingTrades) {
      const outcome = this.getOutcomeFromPnL(trade);
      if (outcome === 'win') {
        wins++;
      } else if (outcome === 'loss') {
        losses++;
      }
    }

    const totalPnL = pnlContributingTrades.reduce(
      (sum, trade) =>
        sum +
        this.getGroupedDisplayPnL(trade, snapshotKeysClaimedByCustomFields).pnl,
      0
    );
    const totalRMultiple = outcomeContributingTrades.reduce((sum, trade) => {
      const displayPnL = this.getGroupedDisplayPnL(
        trade,
        snapshotKeysClaimedByCustomFields
      );
      return (
        sum +
        (calculateEffectiveRMultiple(
          displayPnL.pnl,
          displayPnL.includesUnrealized
            ? undefined
            : trade.rMultiple || undefined,
          trade.riskAmount,
          this.plugin.settings.trade.defaultRiskAmount
        ) || 0)
      );
    }, 0);

    
    
    const userCurrency: string =
      this.plugin.settings.general?.currency || 'USD';
    const currencyGrouped = aggregatePnLByCurrency(
      pnlContributingTrades,
      userCurrency,
      (trade) =>
        this.getGroupedDisplayPnL(trade, snapshotKeysClaimedByCustomFields).pnl
    );

    return {
      totalPnL,
      winRate: calculateWinRateExcludingBreakeven(wins, losses) * 100,
      tradeCount: trades.length,
      openTradeCount: openTrades.length,
      closedTradeCount: closedTrades.length,
      totalRMultiple,
      
      
      
      totalPnLByCurrency: currencyGrouped.byCurrency,
      isMultiCurrency:
        currencyGrouped.isMultiCurrency ||
        currencyGrouped.currencies.some(
          (currency) => currency !== userCurrency
        ),
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

    
    const openTrades = trades.filter((t) =>
      ['open', 'partially_closed'].includes(this.getTradeStatus(t))
    );
    const closedTrades = trades.filter(
      (t) =>
        !['open', 'partially_closed', 'cancelled'].includes(
          this.getTradeStatus(t)
        ) && !t.isMissedTrade
    );
    const snapshotKeysClaimedByCustomFields =
      areSnapshotKeysClaimedByCustomFields(
        this.plugin.customFieldsService?.getFields()
      );
    const { pnlContributingTrades, outcomeContributingTrades } =
      this.getMetricContributionTrades(
        trades,
        snapshotKeysClaimedByCustomFields
      );

    let wins = 0;
    let losses = 0;
    for (const trade of outcomeContributingTrades) {
      const outcome = this.getOutcomeFromPnL(trade);
      if (outcome === 'win') {
        wins++;
      } else if (outcome === 'loss') {
        losses++;
      }
    }

    const totalPnL = pnlContributingTrades.reduce(
      (sum, trade) =>
        sum +
        this.getGroupedDisplayPnL(trade, snapshotKeysClaimedByCustomFields).pnl,
      0
    );
    const totalRMultiple = outcomeContributingTrades.reduce((sum, trade) => {
      const displayPnL = this.getGroupedDisplayPnL(
        trade,
        snapshotKeysClaimedByCustomFields
      );
      return (
        sum +
        (calculateEffectiveRMultiple(
          displayPnL.pnl,
          displayPnL.includesUnrealized
            ? undefined
            : trade.rMultiple || undefined,
          trade.riskAmount,
          this.plugin.settings.trade.defaultRiskAmount
        ) || 0)
      );
    }, 0);

    
    
    
    const periodMap = new Map<string, number>();

    
    if (pnlContributingTrades.length < 100) {
      pnlContributingTrades.forEach((trade) => {
        const date = new Date(trade.entryTime);
        
        const dayKey = formatLocalDateString(date); 
        periodMap.set(
          dayKey,
          (periodMap.get(dayKey) || 0) +
            this.getGroupedDisplayPnL(trade, snapshotKeysClaimedByCustomFields)
              .pnl
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

    
    
    const userCurrency: string =
      this.plugin.settings.general?.currency || 'USD';
    const currencyGrouped = aggregatePnLByCurrency(
      pnlContributingTrades,
      userCurrency,
      (trade) =>
        this.getGroupedDisplayPnL(trade, snapshotKeysClaimedByCustomFields).pnl
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
      isMultiCurrency:
        currencyGrouped.isMultiCurrency ||
        currencyGrouped.currencies.some(
          (currency) => currency !== userCurrency
        ),
      primaryCurrency: currencyGrouped.defaultCurrency,
    };
  }

  
  private getResolvedTradePnLResolution(
    trade: PartialTradeFrontmatter & Record<string, unknown>
  ): RealizedOrTerminalPnLResolution {
    const cached = this.resolvedTradePnLCache.get(trade);
    if (cached !== undefined) return cached;

    const resolved = resolveRealizedOrTerminalPnLResolution(trade);
    this.resolvedTradePnLCache.set(trade, resolved);
    return resolved;
  }

  private getResolvedTradePnL(
    trade: PartialTradeFrontmatter & Record<string, unknown>
  ): number {
    return this.getResolvedTradePnLResolution(trade).pnl ?? 0;
  }

  
  private getTradeStatus(
    trade: TradeLogData
  ):
    | 'win'
    | 'loss'
    | 'breakeven'
    | 'unknown'
    | 'missed'
    | 'open'
    | 'partially_closed'
    | 'cancelled'
    | 'backtest' {
    return getTradeDisplayStatusWithContext(
      trade,
      this.plugin.settings.trade,
      () => this.getResolvedTradePnL(trade)
    );
  }

  private getOutcomeFromPnL(trade: TradeLogData): 'win' | 'loss' | 'breakeven' {
    const effectivePnL = this.getResolvedTradePnL(trade);
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
    endDate?: Date,
    analyticsDateBasis?: AnalyticsDateBasis
  ): TradeLogData[] {
    if (analyticsDateBasis === 'exit') {
      return trades.flatMap((trade) =>
        getProjectedRealizedEventTrades(trade, this.plugin).flatMap(
          ({ trade: projectedTrade, event, originalIndex }) => {
            if (startDate && event.tradingDay < startDate) return [];
            if (endDate && event.tradingDay > endDate) return [];

            const rowIdentity =
              trade.filePath ||
              trade.path ||
              `${trade.instrument || 'trade'}-${String(trade.entryTime)}`;

            return [
              {
                ...projectedTrade,
                _analyticsEventDate: event.tradingDay,
                _analyticsEventRowId: `${rowIdentity}#realized-${originalIndex}`,
              },
            ];
          }
        )
      );
    }

    if (!startDate && !endDate) return trades;

    return trades.filter((trade) => {
      if (analyticsDateBasis) {
        return getTradeRealizedPnlEvents(
          trade,
          analyticsDateBasis,
          this.plugin
        ).some(({ tradingDay }) => {
          if (startDate && tradingDay < startDate) return false;
          if (endDate && tradingDay > endDate) return false;
          return true;
        });
      }

      const tradeDate = new Date(trade.entryTime);
      if (Number.isNaN(tradeDate.getTime())) return false;
      const tradingDayDate = createTradingDayFromString(
        this.getTradingDayStringMemoized(tradeDate)
      );
      if (startDate && tradingDayDate < startDate) return false;
      if (endDate && tradingDayDate > endDate) return false;
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
        accountPhaseWindows: resolveAccountPhaseWindowsFromPlugin(
          filters.accountPhases,
          this.plugin
        ),
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
        const rawValue = getTradeCustomFieldRawValue(trade, field);

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
    const accountNames = await this.tradeService.getUniqueAccounts();
    const dedupedAccounts = new Map<string, string>();

    const addAccount = (value: unknown): void => {
      if (typeof value !== 'string') {
        return;
      }

      const accountName = value.trim();
      const lookupKey = normalizeAccountLookupKey(accountName);
      if (!lookupKey || dedupedAccounts.has(lookupKey)) {
        return;
      }

      dedupedAccounts.set(lookupKey, accountName);
    };

    accountNames.forEach(addAccount);

    const missedTradeAccountNames = await this.getMissedTradeAccountNames();
    missedTradeAccountNames.forEach(addAccount);

    
    
    
    
    
    
    const accountMetadata = this.plugin.settings.account?.accountMetadata ?? {};
    for (const [accountName, metadata] of Object.entries(accountMetadata)) {
      if (metadata?.copyTradingPeriods?.length) {
        addAccount(accountName);
      }
    }

    return Array.from(dedupedAccounts.values());
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
        const weekStartString = node.anchorDate;
        if (!weekStartString) return [];
        return trades.filter((trade) => {
          if (trade._dateComponents.weekStartString !== weekStartString) {
            return false;
          }
          if (!node.parentPeriodId) return true;
          const [parentYear, parentMonth] = node.parentPeriodId.split('-');
          return (
            trade._dateComponents.year === parseInt(parentYear) &&
            trade._dateComponents.month === parseInt(parentMonth)
          );
        });
      }

      case 'day':
        return trades.filter(
          (t) => t._dateComponents.tradingDayString === node.id
        );

      default:
        return trades;
    }
  }

  private invalidateTradeDataCaches(): void {
    void this.tradeService.clearCache();
    this.clearCache();
  }

  
  clearCache(): void {
    this.cache.clear();
    this.tradingDayStringCache.clear();
    this.resolvedTradePnLCache = new WeakMap<
      object,
      RealizedOrTerminalPnLResolution
    >();
    this.missedTradeAccountOptionsCache = null;
    this.cachedEnrichedTrades = null; 
    this.cachedEnrichedTradesCacheKey = null;
    this.cachedEnrichedTradesOperationScopeKey = null;
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
      const tradeRecord = node.trade;
      const pnl = tradeRecord ? this.getResolvedTradePnL(tradeRecord) : 0;

      
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
      const tradeRecord = trade.trade;
      const pnl = tradeRecord ? this.getResolvedTradePnL(tradeRecord) : 0;
      if (pnl > 0) {
        if (tradeRecord) tradeRecord.performanceIndicator = 'best';
      } else if (pnl < 0) {
        if (tradeRecord) tradeRecord.performanceIndicator = 'worst';
      }
    } else {
      
      
      const bestTrade = best
        ? asTradeLogRecord((best as TimeNode).trade)
        : undefined;
      if (bestTrade && bestPnL > 0) {
        bestTrade.performanceIndicator = 'best';
      }
      
      if (
        worst !== null &&
        worstPnL < 0 &&
        worst !== best &&
        asTradeLogRecord((worst as TimeNode).trade)
      ) {
        const worstTrade = asTradeLogRecord((worst as TimeNode).trade);
        if (worstTrade) {
          worstTrade.performanceIndicator = 'worst';
        }
      }
    }
  }

  
  private async buildTradeNodes(trades: TradeLogData[]): Promise<TimeNode[]> {
    
    const sortedTrades = [...trades].sort((a, b) => {
      const dateA = new Date(a._analyticsEventDate ?? a.entryTime);
      const dateB = new Date(b._analyticsEventDate ?? b.entryTime);
      return dateB.getTime() - dateA.getTime();
    });

    
    if (sortedTrades.length < 100) {
      const tradeNodes: TimeNode[] = sortedTrades.map((trade) => {
        const date = new Date(trade._analyticsEventDate ?? trade.entryTime);
        const formattedDate = formatDateDisplay(date);
        const tradeStatus = this.getTradeStatus(trade);
        const isOpenTrade =
          tradeStatus === 'open' || tradeStatus === 'partially_closed';
        const pnl = this.getResolvedTradePnL(trade);
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
        const isOpenTrade =
          tradeStatus === 'open' || tradeStatus === 'partially_closed';
        const pnl = this.getResolvedTradePnL(trade);
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
        await new Promise((resolve) => window.setTimeout(resolve, 0));
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
    trades: EnrichedTradeData[],
    year: number
  ): TimeNode[] {
    const quarterMap = new Map<number, EnrichedTradeData[]>();

    trades.forEach((trade) => {
      const quarter = trade._dateComponents.quarter;
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
    trades: EnrichedTradeData[],
    quarterId: string
  ): TimeNode[] {
    const [year, quarter] = quarterId.split('-Q');
    const qNum = parseInt(quarter);
    const startMonth = (qNum - 1) * 3;

    const monthMap = new Map<number, EnrichedTradeData[]>();
    trades.forEach((trade) => {
      const month = trade._dateComponents.month - 1;
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
    trades: EnrichedTradeData[],
    parentPeriodId: string
  ): TimeNode[] {
    const weekMap = new Map<string, EnrichedTradeData[]>();

    trades.forEach((trade) => {
      const weekStartString = trade._dateComponents.weekStartString;
      if (!weekMap.has(weekStartString)) {
        weekMap.set(weekStartString, []);
      }
      weekMap.get(weekStartString)!.push(trade);
    });

    const weekNodes: TimeNode[] = [];
    const sortedWeeks = Array.from(weekMap.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    for (const weekStartString of sortedWeeks) {
      const weekTrades = weekMap.get(weekStartString)!;
      const weekStart = createTradingDayFromString(weekStartString);
      const weekNum = this.getWeekNumber(weekStart);
      weekNodes.push({
        type: 'week',
        id: `${parentPeriodId}/W:${weekStartString}`,
        label: `${t('common.week')} ${weekNum}`,
        metrics: this.calculateMetrics(weekTrades),
        expanded: false,
        dataLoaded: false,
        anchorDate: weekStartString,
        parentPeriodId,
      });
    }

    return weekNodes;
  }

  
  private buildDaysForWeek(
    trades: EnrichedTradeData[],
    sessionLogTagIdsByDay: ReadonlyMap<string, ReadonlySet<string>>
  ): TimeNode[] {
    const dayMap = new Map<string, EnrichedTradeData[]>();

    trades.forEach((trade) => {
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
      const date = createTradingDayFromString(dayId);
      const dayName = this.getDayAbbreviation(date.getDay());

      dayNodes.push({
        type: 'day',
        id: dayId,
        label: `${dayName} ${date.getDate()}`,
        metrics: this.calculateMetrics(dayTrades),
        sessionLogTagIds: this.getSessionLogTagIdsForDay(
          dayId,
          sessionLogTagIdsByDay
        ),
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
      const isOpenTrade =
        tradeStatus === 'open' || tradeStatus === 'partially_closed';
      const pnl = this.getResolvedTradePnL(trade);
      const instrument = trade.instrument || 'Unknown';

      const label = `${instrument} - ${formattedDate}${isOpenTrade ? ' (OPEN)' : ''}`;

      return {
        type: 'trade' as const,
        id:
          trade._analyticsEventRowId ||
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
        const isOpenTrade =
          tradeStatus === 'open' || tradeStatus === 'partially_closed';
        const pnl = this.getResolvedTradePnL(trade);
        const instrument = trade.instrument || 'Unknown';

        
        const label = `${instrument} - ${trade._dateComponents.dayKey}${isOpenTrade ? ' (OPEN)' : ''}`;

        return {
          type: 'trade' as const,
          id:
            trade._analyticsEventRowId ||
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
        await new Promise((resolve) => window.setTimeout(resolve, 0));
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
      const weekId = `W:${trade._dateComponents.weekStartString}`;

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

      const weekStartString = weekId.replace(/^W:/, '');
      const weekStart = createTradingDayFromString(weekStartString);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      weekNodes.push({
        type: 'week',
        id: weekId,
        label: `${formatDateDisplay(weekStart, this.plugin.settings.trade.dateFormat)} – ${formatDateDisplay(weekEnd, this.plugin.settings.trade.dateFormat)}`,
        metrics:
          weekTrades.length > 500
            ? this.calculateMetricsLightweight(weekTrades)
            : this.calculateMetrics(weekTrades),
        expanded: false,
        dataLoaded: false,
        anchorDate: weekStartString,
      });
    }

    return weekNodes;
  }

  
  private async buildDayNodesOptimized(
    enrichedTrades: EnrichedTradeData[],
    sessionLogTagIdsByDay: ReadonlyMap<string, ReadonlySet<string>> | null
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
        sessionLogTagIds: this.getSessionLogTagIdsForDay(
          dayId,
          sessionLogTagIdsByDay
        ),
        expanded: false,
        dataLoaded: false,
      });
    }

    return dayNodes;
  }

  private getSessionLogTagIdsForDay(
    dayId: string,
    sessionLogTagIdsByDay: ReadonlyMap<string, ReadonlySet<string>> | null
  ): string[] | undefined {
    const tagIds = sessionLogTagIdsByDay?.get(dayId);
    return tagIds && tagIds.size > 0 ? [...tagIds].sort() : undefined;
  }

  private async loadSessionLogTagIdsByDay(): Promise<
    ReadonlyMap<string, ReadonlySet<string>>
  > {
    const drcService = await this.plugin.serviceManager.getDRCService();
    return drcService.getSessionLogTagIdsByDay();
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
    this.resolvedTradePnLCache = new WeakMap<
      object,
      RealizedOrTerminalPnLResolution
    >();
    this.latestTradeRevisionById.clear();
    this.pendingLegacyMirrors.clear();
    this.missedTradeAccountOptionsCache = null;
  }
}
