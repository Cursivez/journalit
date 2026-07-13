import { logger } from '../../utils/logger';


import { App, TFile } from 'obsidian';
import {
  CustomDataService,
  CustomDataServiceConfig,
} from '../base/CustomDataService';
import JournalitPlugin from '../../main';
import { BackendSecretStorage } from '../backend/BackendSecretStorage';
import {
  AccountCatalogEntry,
  AccountPageData,
  AccountTradeData,
  AccountMetrics,
} from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function toUnknownList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [value];
}

function isExtractedTradeData(value: unknown): value is TradeData {
  if (!isRecord(value)) return false;
  return (
    value.entryTime instanceof Date &&
    typeof value.entryPrice === 'number' &&
    typeof value.positionSize === 'number' &&
    typeof value.direction === 'string' &&
    (!('setup' in value) || Array.isArray(value.setup))
  );
}

interface AccountTradeGroupingSnapshot {
  builtAt: number;
  accountNames: string[];
  tradesByAccount: Record<string, AccountTradeData[]>;
  accountNamesByLookupKey: Record<string, string[]>;
}

interface AccountAggregateSnapshot {
  accountName: string;
  trades: AccountTradeData[];
  account: AccountData;
  metrics: AccountMetrics;
}

interface AccountDeletionRewriteContext {
  accountLookupKey: string;
  accountTagToRemove: string;
  snapshotLookupKeysToRemove: Set<string>;
  removedMappedAccountIds: string[];
  removedMappedAccountNames: string[];
  removedMappedAccountLookupKeys: Set<string>;
  accountLookupKeysToRemove: Set<string>;
}

interface AccountDeletionRollbackSnapshot {
  fileRef: TFile;
  originalPath: string;
  updatedPath: string;
  originalContent: string;
  originalTradeData?: TradeData;
}
import {
  AccountData,
  AccountTransaction,
  TransactionType,
  AccountMetrics as AccountServiceMetrics,
  DrawdownType,
  ProfitTargetType,
  AccountType,
  DailyBalanceRecord,
} from '../account/types';
import { AccountMetadata } from '../../settings/types';
import {
  hasLiveBalanceAdjustment,
  normalizeLiveBalanceAdjustment,
} from '../account/liveBalanceAdjustment';
import { formatLocalDateString } from '../../utils/dateUtils';
import {
  getEffectivePnL,
  getLastExitTime,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import { getTradeRealizedPnlEvents } from '../../utils/tradeAnalyticsDate';
import {
  calculateWinRateExcludingBreakeven,
  classifyPnLWithBreakEvenSettings,
} from '../../utils/breakEvenRange';
import { FolderPathService } from '../core/FolderPathService';
import { EnhancedTradeData } from '../../types/EnhancedTradeData';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import { eventBus, Unsubscribe } from '../events';
import { ExchangeRateService } from '../exchangeRate';
import {
  CurrencyCode,
  parseCuratedCurrencyCode,
} from '../../utils/currencyConfig';
import { inferStoredTradeType } from '../../utils/tradeTypeRouting';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
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
import { normalizeTradeExecution } from '../trade/core/TradeExecutionNormalization';
import { TradeType } from '../tradelog/types';
import type { TradeData } from '../trade/TradeService';

const ACCOUNT_DELETION_REQUIRED_ACCOUNT_ERROR =
  /At least one account is required/;


export class AccountPageService extends CustomDataService {
  private folderPathService: FolderPathService | null = null;
  private unsubscribeTradeChanged: Unsubscribe;
  private unsubscribeTradeCommitted: Unsubscribe;
  private unsubscribeMissedTradeChanged: Unsubscribe;
  private unsubscribeBacktestTradeChanged: Unsubscribe;
  private unsubscribeSettingsChanged: Unsubscribe;
  private unsubscribeAccountChanged: Unsubscribe;
  private tradeGroupingSnapshots = new Map<
    string,
    AccountTradeGroupingSnapshot
  >();
  private tradeGroupingSnapshotPromises = new Map<
    string,
    Promise<AccountTradeGroupingSnapshot>
  >();
  private accountAggregateSnapshots = new Map<
    string,
    AccountAggregateSnapshot
  >();
  private accountAggregateSnapshotPromises = new Map<
    string,
    Promise<AccountAggregateSnapshot | null>
  >();
  private exchangeRateService: ExchangeRateService | null = null;
  private accountSnapshotGeneration = 0;

  private requirePlugin(): JournalitPlugin {
    if (!this.plugin) {
      throw new Error('Journalit plugin is not available');
    }
    return this.plugin;
  }

  constructor(app: App, config: CustomDataServiceConfig = {}) {
    super(app, {
      
      
      
      cacheTTL: 2 * 60 * 1000, 
      persistCache: true,
      namespace: config.namespace || 'accountPage',
      ...config,
    });

    
    const handleTradeDataChange = () => {
      this.invalidateTradeReadCache();
      this.clearAccountSnapshots();
      
      void this.clearCache();
    };

    
    this.unsubscribeTradeChanged = eventBus.subscribe(
      'trade:changed',
      handleTradeDataChange
    );
    this.unsubscribeTradeCommitted = eventBus.subscribe(
      'trade:committed',
      handleTradeDataChange
    );
    this.unsubscribeMissedTradeChanged = eventBus.subscribe(
      'missed-trade:changed',
      handleTradeDataChange
    );
    this.unsubscribeBacktestTradeChanged = eventBus.subscribe(
      'backtest-trade:changed',
      handleTradeDataChange
    );
    this.unsubscribeSettingsChanged = eventBus.subscribe(
      'settings:changed',
      () => {
        this.clearAccountSnapshots();
        void this.clearCache();
      }
    );
    this.unsubscribeAccountChanged = eventBus.subscribe(
      'account:changed',
      () => {
        this.clearAccountSnapshots();
        void this.clearCache();
      }
    );
  }

  
  public setPlugin(plugin: JournalitPlugin): void {
    super.setPlugin(plugin);
    this.folderPathService =
      plugin.serviceManager?.getFolderPathService() || null;
  }

  private normalizeSupportedTradeTypes(tradeTypes?: TradeType[]): TradeType[] {
    const supportedTradeTypes: TradeType[] = ['regular', 'backtest'];
    const selectedTradeTypes = new Set(
      (tradeTypes || []).filter((tradeType): tradeType is TradeType =>
        supportedTradeTypes.includes(tradeType)
      )
    );

    const normalized = supportedTradeTypes.filter((tradeType) =>
      selectedTradeTypes.has(tradeType)
    );

    return normalized.length > 0 ? normalized : ['regular'];
  }

  private getTradeTypeSelectionKey(tradeTypes?: TradeType[]): string {
    return this.normalizeSupportedTradeTypes(tradeTypes).join('|');
  }

  private getAccountAggregateSnapshotKey(
    accountName: string,
    tradeTypes?: TradeType[]
  ): string {
    return `${accountName}::${this.getTradeTypeSelectionKey(tradeTypes)}`;
  }

  private clearAccountSnapshots(accountName?: string): void {
    this.accountSnapshotGeneration += 1;
    this.tradeGroupingSnapshots.clear();
    this.tradeGroupingSnapshotPromises.clear();

    if (!accountName) {
      this.accountAggregateSnapshots.clear();
      this.accountAggregateSnapshotPromises.clear();
      return;
    }

    for (const key of Array.from(this.accountAggregateSnapshots.keys())) {
      if (key.startsWith(`${accountName}::`)) {
        this.accountAggregateSnapshots.delete(key);
      }
    }

    for (const key of Array.from(
      this.accountAggregateSnapshotPromises.keys()
    )) {
      if (key.startsWith(`${accountName}::`)) {
        this.accountAggregateSnapshotPromises.delete(key);
      }
    }
  }

  private getTradeServiceOrThrow(): NonNullable<
    JournalitPlugin['tradeService']
  > {
    const tradeService = this.plugin?.serviceManager?.getTradeService
      ? this.plugin.serviceManager.getTradeService()
      : this.plugin?.tradeService;

    if (!tradeService) {
      throw new Error('TradeService is not available');
    }

    return tradeService;
  }

  private invalidateTradeReadCache(): void {
    const tradeService = this.plugin?.serviceManager?.getTradeService
      ? this.plugin.serviceManager.getTradeService()
      : this.plugin?.tradeService;

    if (!tradeService) {
      return;
    }

    void tradeService.clearCacheWithPrefix('trade:all-trades');
  }

  private async getReadyTradeService(): Promise<
    NonNullable<JournalitPlugin['tradeService']>
  > {
    const tradeService = this.getTradeServiceOrThrow();
    await tradeService.waitForTradeDataReady();
    return tradeService;
  }

  private normalizeStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return [
        ...new Set(
          value.flatMap((item) => {
            const trimmed = String(item).trim();
            return trimmed ? [trimmed] : [];
          })
        ),
      ];
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed ? [trimmed] : [];
    }

    return [];
  }

  private resolveMappedAccountName(accountId: string): string | undefined {
    const mappedAccountName =
      this.plugin?.settings.backendIntegration?.accountMapping?.[accountId];
    if (typeof mappedAccountName !== 'string') {
      return undefined;
    }

    const normalized = mappedAccountName.trim();
    return normalized || undefined;
  }

  private getTradeAccountIdentity(trade: Record<string, unknown>) {
    return normalizeTradeAccountIdentity(trade, {
      resolveAccountIdDisplayName: (accountId) =>
        this.resolveMappedAccountName(accountId),
    });
  }

  private getLookupMatchedAccountNames(
    groupingSnapshot: AccountTradeGroupingSnapshot,
    accountName: string
  ): string[] {
    const lookupKey = normalizeAccountLookupKey(accountName);
    const matchedAccountNames =
      groupingSnapshot.accountNamesByLookupKey[lookupKey] || [];

    if (matchedAccountNames.length === 0) {
      return [accountName];
    }

    if (matchedAccountNames.includes(accountName)) {
      return [accountName];
    }

    return matchedAccountNames;
  }

  private resolveCanonicalAccountName(
    groupingSnapshot: AccountTradeGroupingSnapshot,
    accountName: string
  ): string {
    const matchedAccountNames = this.getLookupMatchedAccountNames(
      groupingSnapshot,
      accountName
    );

    return matchedAccountNames.length === 1
      ? matchedAccountNames[0]
      : accountName;
  }

  private getTradesForAccountLookup(
    groupingSnapshot: AccountTradeGroupingSnapshot,
    accountName: string
  ): AccountTradeData[] {
    const matchedAccountNames = this.getLookupMatchedAccountNames(
      groupingSnapshot,
      accountName
    );

    if (matchedAccountNames.length === 1) {
      return groupingSnapshot.tradesByAccount[matchedAccountNames[0]] || [];
    }

    const dedupedTrades = new Map<string, AccountTradeData>();
    for (const matchedAccountName of matchedAccountNames) {
      const trades = groupingSnapshot.tradesByAccount[matchedAccountName] || [];
      for (const trade of trades) {
        dedupedTrades.set(trade.path, trade);
      }
    }

    return Array.from(dedupedTrades.values());
  }

  private normalizeFrontmatterScalarString(value: unknown): string | undefined {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed || undefined;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }

    return undefined;
  }

  private getNormalizedAccountFieldValues(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.flatMap((item) => {
        const normalized = String(item).trim();
        return normalized ? [normalized] : [];
      });
    }

    const scalar = this.normalizeFrontmatterScalarString(value);
    return scalar ? [scalar] : [];
  }

  private filterAccountFieldValues(
    value: unknown,
    accountLookupKeysToRemove: Set<string>
  ): string[] {
    return this.getNormalizedAccountFieldValues(value).filter(
      (item) => !accountLookupKeysToRemove.has(normalizeAccountLookupKey(item))
    );
  }

  private applyFilteredAccountField(
    frontmatter: Record<string, unknown>,
    field: 'account',
    nextValues: string[]
  ): boolean {
    const currentValue = frontmatter[field];

    if (nextValues.length === 0) {
      if (currentValue !== undefined) {
        delete frontmatter[field];
        return true;
      }
      return false;
    }

    if (Array.isArray(currentValue)) {
      if (currentValue.length !== nextValues.length) {
        frontmatter[field] = nextValues;
        return true;
      }

      const changed = currentValue.some(
        (value, index) => String(value).trim() !== nextValues[index]
      );
      if (changed) {
        frontmatter[field] = nextValues;
      }
      return changed;
    }

    if (typeof currentValue === 'string') {
      const nextValue = nextValues[0];
      if (currentValue.trim() !== nextValue) {
        frontmatter[field] = nextValue;
        return true;
      }
      return false;
    }

    return false;
  }

  private applyAccountDeletionToMutableRecord(
    mutableTrade: Record<string, unknown>,
    context: AccountDeletionRewriteContext
  ): { didUpdate: boolean } {
    let modified = false;

    const normalizedAccountId = this.normalizeFrontmatterScalarString(
      mutableTrade.accountId
    );
    const effectiveAccountLookupKeysToRemove = new Set(
      context.accountLookupKeysToRemove
    );

    const hasRemovedMappedAccountRef =
      normalizedAccountId &&
      context.removedMappedAccountLookupKeys.has(
        normalizeAccountLookupKey(normalizedAccountId)
      );

    if (
      normalizedAccountId &&
      (context.removedMappedAccountLookupKeys.has(
        normalizeAccountLookupKey(normalizedAccountId)
      ) ||
        normalizeAccountLookupKey(normalizedAccountId) ===
          context.accountLookupKey)
    ) {
      effectiveAccountLookupKeysToRemove.add(
        normalizeAccountLookupKey(normalizedAccountId)
      );
    }

    if (hasRemovedMappedAccountRef) {
      for (const lookupKey of context.snapshotLookupKeysToRemove) {
        effectiveAccountLookupKeysToRemove.add(lookupKey);
      }
    }

    const accountValuesBefore = this.getNormalizedAccountFieldValues(
      mutableTrade.account
    );
    const nextAccountValues = this.filterAccountFieldValues(
      mutableTrade.account,
      effectiveAccountLookupKeysToRemove
    );
    if (
      this.applyFilteredAccountField(mutableTrade, 'account', nextAccountValues)
    ) {
      modified = true;
    }

    const removedAccountValues = [
      ...accountValuesBefore.filter(
        (value) => !nextAccountValues.includes(value)
      ),
    ];

    let removedAccountIdValue: string | undefined;
    if (
      normalizedAccountId &&
      effectiveAccountLookupKeysToRemove.has(
        normalizeAccountLookupKey(normalizedAccountId)
      )
    ) {
      removedAccountIdValue = normalizedAccountId;
      modified = true;
      delete mutableTrade.accountId;
    }

    if (Array.isArray(mutableTrade.tags)) {
      const existingTags = mutableTrade.tags;
      const accountTagsToRemove = new Set([
        context.accountTagToRemove,
        ...Array.from(context.accountLookupKeysToRemove).map(
          (lookupKey) => `account/${this.formatTagForYAML(lookupKey)}`
        ),
        ...context.removedMappedAccountIds.map(
          (accountId) => `account/${this.formatTagForYAML(accountId)}`
        ),
        ...context.removedMappedAccountNames.map(
          (value) => `account/${this.formatTagForYAML(value)}`
        ),
        ...removedAccountValues.map(
          (value) => `account/${this.formatTagForYAML(value)}`
        ),
        ...(removedAccountIdValue
          ? [`account/${this.formatTagForYAML(removedAccountIdValue)}`]
          : []),
      ]);

      const nextTags = existingTags.filter((tag: unknown) => {
        if (typeof tag !== 'string') {
          return true;
        }

        const normalizedTag = tag.trim();
        return (
          normalizedTag.length > 0 && !accountTagsToRemove.has(normalizedTag)
        );
      });

      if (
        nextTags.length !== existingTags.length ||
        nextTags.some((value, index) => value !== existingTags[index])
      ) {
        mutableTrade.tags = nextTags;
        modified = true;
      }
    }

    return {
      didUpdate: modified,
    };
  }

  private shouldAvoidCanonicalMetadataUpdate(tradeData: TradeData): boolean {
    const defaultRiskAmount = this.plugin?.settings?.trade?.defaultRiskAmount;
    if (
      typeof defaultRiskAmount !== 'number' ||
      !Number.isFinite(defaultRiskAmount) ||
      defaultRiskAmount <= 0
    ) {
      return false;
    }

    return (
      tradeData.riskAmount === undefined && tradeData.stopLoss === undefined
    );
  }

  private shouldAvoidCanonicalPathNormalization(filePath: string): boolean {
    return !/-T\d+\.md$/i.test(filePath);
  }

  private buildAccountDeletionTradeUpdate(
    tradeData: TradeData,
    context: AccountDeletionRewriteContext
  ): { didUpdate: boolean; nextTradeData: TradeData } {
    const nextTradeData: TradeData = { ...tradeData };
    const mutationResult = this.applyAccountDeletionToMutableRecord(
      nextTradeData,
      context
    );

    return {
      didUpdate: mutationResult.didUpdate,
      nextTradeData,
    };
  }

  private async applyAccountDeletionFrontmatterPatch(
    file: TFile,
    context: AccountDeletionRewriteContext
  ): Promise<boolean> {
    let didUpdate = false;

    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      const mutationResult = this.applyAccountDeletionToMutableRecord(
        asRecord(frontmatter) ?? {},
        context
      );
      didUpdate = mutationResult.didUpdate;
    });

    return didUpdate;
  }

  private async rollbackAccountDeletionTradeUpdates(
    snapshots: AccountDeletionRollbackSnapshot[],
    tradeService: JournalitPlugin['tradeService']
  ): Promise<void> {
    for (const snapshot of [...snapshots].reverse()) {
      try {
        const latestKnownPath =
          snapshot.fileRef.path && snapshot.fileRef.path.length > 0
            ? snapshot.fileRef.path
            : snapshot.updatedPath;

        const getFileByPath = (path: string) =>
          this.app.vault.getAbstractFileByPath(path);
        let fileToRestore = getFileByPath(latestKnownPath);

        if (!(fileToRestore instanceof TFile)) {
          fileToRestore = getFileByPath(snapshot.updatedPath);
        }

        if (!(fileToRestore instanceof TFile)) {
          fileToRestore = getFileByPath(snapshot.originalPath);
        }

        if (!(fileToRestore instanceof TFile)) {
          console.error(
            `AccountPageService: Could not locate file for rollback ${latestKnownPath}`
          );
          continue;
        }

        if (snapshot.originalTradeData && tradeService) {
          await tradeService.updateTrade(
            snapshot.originalTradeData,
            fileToRestore.path,
            'account-deletion-rollback'
          );
          continue;
        }

        await this.app.vault.modify(fileToRestore, snapshot.originalContent);

        if (
          snapshot.updatedPath !== snapshot.originalPath &&
          fileToRestore.path !== snapshot.originalPath
        ) {
          await this.app.vault.rename(fileToRestore, snapshot.originalPath);
        }

        const restoredFile = this.app.vault.getAbstractFileByPath(
          snapshot.originalPath
        );
        if (restoredFile instanceof TFile) {
          await forceMetadataCacheRefresh(this.app, restoredFile);
        }
      } catch (rollbackError) {
        console.error(
          `AccountPageService: Failed to rollback trade rewrite for ${snapshot.originalPath}:`,
          rollbackError
        );
      }
    }
  }

  private normalizeAccountTrade(
    trade: Record<string, unknown>
  ): AccountTradeData | null {
    const entryTime = this.safeParseDate(trade.entryTime);
    if (!entryTime) {
      return null;
    }

    const setup = this.normalizeStringArray(trade.setup);
    const mistake = this.normalizeStringArray(trade.mistake);
    const tags = this.normalizeStringArray(trade.tags);
    const normalizedExecution = normalizeTradeExecution(trade, {
      deriveMissingExplicitness: true,
    });
    const entries = Array.isArray(trade.entries)
      ? normalizedExecution.entries.map((entry) => ({
          time: entry.time,
          price: entry.price ?? 0,
          size: entry.size ?? 0,
          ...(entry.notional !== undefined ? { notional: entry.notional } : {}),
        }))
      : undefined;
    const exits = Array.isArray(trade.exits)
      ? normalizedExecution.exits.map((exit) => ({
          time: exit.time,
          price: exit.price ?? 0,
          size: exit.size ?? 0,
          hasExplicitPrice: exit.hasExplicitPrice ?? false,
          ...(exit.notional !== undefined ? { notional: exit.notional } : {}),
        }))
      : undefined;
    const dividends = Array.isArray(trade.dividends)
      ? (trade.dividends as EnhancedTradeData['dividends'])
      : undefined;

    return {
      path:
        typeof trade.path === 'string'
          ? trade.path
          : typeof trade.filePath === 'string'
            ? trade.filePath
            : '',
      instrument:
        typeof trade.instrument === 'string'
          ? trade.instrument
          : typeof trade.symbol === 'string'
            ? trade.symbol
            : '',
      direction: typeof trade.direction === 'string' ? trade.direction : '',
      entryPrice: normalizedExecution.entryPrice ?? 0,
      hasExplicitExitPrice: normalizedExecution.hasExplicitExitPrice ?? false,
      exitPrice: normalizedExecution.exitPrice ?? 0,
      positionSize: normalizedExecution.positionSize ?? 0,
      pnl: typeof trade.pnl === 'number' ? trade.pnl : Number(trade.pnl) || 0,
      commission:
        typeof trade.commission === 'number'
          ? trade.commission
          : Number(trade.commission) || 0,
      swap:
        typeof trade.swap === 'number' ? trade.swap : Number(trade.swap) || 0,
      fees:
        typeof trade.fees === 'number' ? trade.fees : Number(trade.fees) || 0,
      rebate:
        typeof trade.rebate === 'number'
          ? trade.rebate
          : trade.rebate === undefined
            ? undefined
            : Number(trade.rebate) || 0,
      entryTime,
      exitTime: this.safeParseDate(trade.exitTime),
      setup,
      mistake,
      tags,
      reviewed: trade.reviewed === true,
      assetType:
        typeof trade.assetType === 'string' ? trade.assetType : undefined,
      optionType:
        typeof trade.optionType === 'string' ? trade.optionType : undefined,
      rMultiple:
        typeof trade.rMultiple === 'number'
          ? trade.rMultiple
          : trade.rMultiple === undefined
            ? undefined
            : Number(trade.rMultiple),
      riskAmount:
        typeof trade.riskAmount === 'number'
          ? trade.riskAmount
          : trade.riskAmount === undefined
            ? undefined
            : Number(trade.riskAmount),
      stopLoss:
        typeof trade.stopLoss === 'number'
          ? trade.stopLoss
          : trade.stopLoss === undefined
            ? undefined
            : Number(trade.stopLoss),
      currency: typeof trade.currency === 'string' ? trade.currency : undefined,
      tradeStatus:
        typeof trade.tradeStatus === 'string' ? trade.tradeStatus : undefined,
      useDirectPnLInput: normalizedExecution.useDirectPnLInput,
      directPnL:
        typeof trade.directPnL === 'number'
          ? trade.directPnL
          : trade.directPnL === undefined
            ? undefined
            : Number(trade.directPnL),
      entries,
      exits,
      dividends,
      settlementTime: this.safeParseDate(trade.settlementTime),
      _originalPnlWasNull:
        typeof trade._originalPnlWasNull === 'boolean'
          ? trade._originalPnlWasNull
          : trade.pnl === null || trade.pnl === undefined,
    };
  }

  private cloneAccountTrade(trade: AccountTradeData): AccountTradeData {
    return {
      ...trade,
      entryTime: new Date(trade.entryTime),
      exitTime: trade.exitTime ? new Date(trade.exitTime) : null,
      setup: [...trade.setup],
      mistake: [...trade.mistake],
      tags: [...trade.tags],
      entries: trade.entries?.map((entry) => ({
        ...entry,
        time: entry.time ? new Date(entry.time) : null,
      })),
      exits: trade.exits?.map((exit) => ({
        ...exit,
        time: exit.time ? new Date(exit.time) : null,
      })),
      dividends: trade.dividends?.map((dividend) => ({
        ...dividend,
        time: dividend.time ? new Date(dividend.time) : null,
      })),
      settlementTime: trade.settlementTime
        ? new Date(trade.settlementTime)
        : null,
    };
  }

  private cloneAccountTrades(trades: AccountTradeData[]): AccountTradeData[] {
    return trades.map((trade) => this.cloneAccountTrade(trade));
  }

  private createCopiedAccountTrade(
    baseTrade: AccountTradeData,
    copyAccountName: string,
    baseAccountName: string,
    multiplier: number,
    copyMetadata: AccountMetadata
  ): AccountTradeData {
    const copiedTrade = this.cloneAccountTrade(baseTrade);
    const copyAccountLookupKey = normalizeAccountLookupKey(copyAccountName);
    const copyBaseTradeKey = String(baseTrade.path ?? 'trade');
    const {
      pnl: copiedPnL,
      commission,
      adjustment,
    } = calculateCopiedTradePnL({
      plugin: this.requirePlugin(),
      baseTrade: { ...baseTrade, copyBaseTradeKey },
      copyAccountName,
      copyAccountLookupKey,
      multiplier,
    });
    const copiedRiskAmount =
      copiedTrade.riskAmount === undefined
        ? undefined
        : copiedTrade.riskAmount * multiplier;

    return {
      ...copiedTrade,
      ...scaleCopiedTradeExecutionFields(copiedTrade, multiplier),
      pnl: copiedPnL,
      directPnL:
        copiedTrade.directPnL === undefined
          ? undefined
          : copiedTrade.directPnL * multiplier,
      dividends: copiedTrade.dividends?.map((dividend) => ({
        ...dividend,
        amount: dividend.amount * multiplier,
      })),
      riskAmount: copiedRiskAmount,
      rMultiple:
        copiedRiskAmount && copiedRiskAmount !== 0
          ? copiedPnL / copiedRiskAmount
          : copiedTrade.rMultiple,
      commission: commission ?? 0,
      fees: 0,
      currency: copiedTrade.currency ?? copyMetadata.currency,
      isCopiedTrade: true,
      copiedFromAccount: baseAccountName,
      copyMultiplier: multiplier,
      copyAccountLookupKey,
      copyPnlAdjustment: adjustment,
      copyBaseTradeKey,
    };
  }

  private cloneAccountData(account: AccountData): AccountData {
    return {
      ...account,
      createdDate: new Date(account.createdDate),
      lastUpdated: new Date(account.lastUpdated),
      profitTargetDate: account.profitTargetDate
        ? new Date(account.profitTargetDate)
        : undefined,
      lastBillingDate: account.lastBillingDate
        ? new Date(account.lastBillingDate)
        : undefined,
      currentDrawdownSnapshot: account.currentDrawdownSnapshot
        ? {
            ...account.currentDrawdownSnapshot,
            date: new Date(account.currentDrawdownSnapshot.date),
          }
        : undefined,
      allDrawdownSnapshots: account.allDrawdownSnapshots?.map((snapshot) => ({
        ...snapshot,
        date: new Date(snapshot.date),
      })),
      metrics: { ...account.metrics },
      transactions: account.transactions.map((transaction) => ({
        ...transaction,
        date: new Date(transaction.date),
      })),
      dailyBalances: account.dailyBalances.map((balance) => ({
        ...balance,
        date: new Date(balance.date),
      })),
    };
  }

  private async getTradeGroupingSnapshot(
    tradeTypes?: TradeType[]
  ): Promise<AccountTradeGroupingSnapshot> {
    const normalizedTradeTypes = this.normalizeSupportedTradeTypes(tradeTypes);
    const tradeTypeSelectionKey = this.getTradeTypeSelectionKey(tradeTypes);

    const cachedSnapshot = this.tradeGroupingSnapshots.get(
      tradeTypeSelectionKey
    );
    if (cachedSnapshot) {
      return cachedSnapshot;
    }

    const pendingSnapshot = this.tradeGroupingSnapshotPromises.get(
      tradeTypeSelectionKey
    );
    if (pendingSnapshot) {
      return pendingSnapshot;
    }

    const snapshotGeneration = this.accountSnapshotGeneration;

    const snapshotPromise = (async () => {
      const tradeService = await this.getReadyTradeService();
      const allTrades = await tradeService.getTradeData();
      const normalizedTradeTypeSet = new Set(normalizedTradeTypes);
      const tradesByAccount: Record<string, AccountTradeData[]> = {};
      const canonicalAccountNamesByLookupKey = new Map<string, string>();
      const accountAliasIndex = new Map<string, Set<string>>();

      for (const trade of allTrades) {
        const storedTradeType = inferStoredTradeType({
          filePath:
            typeof trade.path === 'string'
              ? trade.path
              : typeof trade.filePath === 'string'
                ? trade.filePath
                : undefined,
          type: typeof trade.type === 'string' ? trade.type : undefined,
          isMissedTrade: trade.isMissedTrade,
          isBacktestTrade: trade.isBacktestTrade,
        });

        if (
          (storedTradeType !== 'regular' && storedTradeType !== 'backtest') ||
          !normalizedTradeTypeSet.has(storedTradeType)
        ) {
          continue;
        }

        const accountIdentity = this.getTradeAccountIdentity(trade);
        if (accountIdentity.accountNames.length === 0) {
          continue;
        }

        const normalizedTrade = this.normalizeAccountTrade(trade);
        if (!normalizedTrade) {
          continue;
        }

        const canonicalAccountNames = accountIdentity.accountNames.map(
          (accountName) => {
            const lookupKey = normalizeAccountLookupKey(accountName);
            const existingCanonicalName =
              canonicalAccountNamesByLookupKey.get(lookupKey);
            if (existingCanonicalName) {
              return existingCanonicalName;
            }

            canonicalAccountNamesByLookupKey.set(lookupKey, accountName);
            return accountName;
          }
        );
        const canonicalAccountLookupKeys = new Set(
          canonicalAccountNames.map((accountName) =>
            normalizeAccountLookupKey(accountName)
          )
        );

        for (const accountName of canonicalAccountNames) {
          if (!tradesByAccount[accountName]) {
            tradesByAccount[accountName] = [];
          }
          tradesByAccount[accountName].push(normalizedTrade);
        }

        const accountMetadata =
          this.plugin?.settings.account?.accountMetadata ?? {};
        for (const [copyAccountName, copyMetadata] of Object.entries(
          accountMetadata
        )) {
          const copyPeriod = getCopyTradingPeriodForEntryDate(
            copyMetadata,
            normalizedTrade.entryTime
          );
          if (!copyPeriod) {
            continue;
          }

          const baseLookupKey = normalizeAccountLookupKey(
            copyPeriod.baseAccount
          );
          if (!canonicalAccountLookupKeys.has(baseLookupKey)) {
            continue;
          }

          if (
            !isCopyTradingBaseEligible(
              accountMetadata,
              copyMetadata,
              copyPeriod.baseAccount,
              normalizedTrade.entryTime,
              this.plugin?.settings.general?.currency
            )
          ) {
            continue;
          }

          const copiedTrade = this.createCopiedAccountTrade(
            normalizedTrade,
            copyAccountName,
            copyPeriod.baseAccount,
            copyPeriod.multiplier,
            copyMetadata
          );
          if (!tradesByAccount[copyAccountName]) {
            tradesByAccount[copyAccountName] = [];
          }
          tradesByAccount[copyAccountName].push(copiedTrade);
        }

        for (const accountName of canonicalAccountNames) {
          const accountLookupKey = normalizeAccountLookupKey(accountName);
          const accountAliases =
            accountAliasIndex.get(accountLookupKey) ?? new Set<string>();
          accountAliases.add(accountName);
          accountAliasIndex.set(accountLookupKey, accountAliases);
        }

        const primaryCanonicalAccountName = canonicalAccountNames[0];

        for (const ref of accountIdentity.refs) {
          if (canonicalAccountLookupKeys.has(ref.lookupKey)) {
            continue;
          }

          const targetCanonicalAccountName =
            canonicalAccountNames.length === 1
              ? primaryCanonicalAccountName
              : undefined;

          if (!targetCanonicalAccountName) {
            continue;
          }

          const existing =
            accountAliasIndex.get(ref.lookupKey) ?? new Set<string>();
          existing.add(targetCanonicalAccountName);
          accountAliasIndex.set(ref.lookupKey, existing);
        }
      }

      const accountNamesByLookupKey = Object.fromEntries(
        Array.from(accountAliasIndex.entries()).map(
          ([lookupKey, accountNames]) =>
            [
              lookupKey,
              Array.from(accountNames).sort((a, b) => a.localeCompare(b)),
            ] as const
        )
      );
      const snapshot: AccountTradeGroupingSnapshot = {
        builtAt: Date.now(),
        accountNames: Object.keys(tradesByAccount).sort((a, b) =>
          a.localeCompare(b)
        ),
        tradesByAccount,
        accountNamesByLookupKey,
      };

      if (snapshotGeneration !== this.accountSnapshotGeneration) {
        this.tradeGroupingSnapshotPromises.delete(tradeTypeSelectionKey);
        return this.getTradeGroupingSnapshot(normalizedTradeTypes);
      }

      this.tradeGroupingSnapshots.set(tradeTypeSelectionKey, snapshot);
      this.tradeGroupingSnapshotPromises.delete(tradeTypeSelectionKey);
      return snapshot;
    })();

    this.tradeGroupingSnapshotPromises.set(
      tradeTypeSelectionKey,
      snapshotPromise
    );

    try {
      return await snapshotPromise;
    } catch (error) {
      this.tradeGroupingSnapshotPromises.delete(tradeTypeSelectionKey);
      throw error;
    }
  }

  private async getAccountAggregateSnapshot(
    accountName: string,
    tradeTypes?: TradeType[]
  ): Promise<AccountAggregateSnapshot | null> {
    const normalizedTradeTypes = this.normalizeSupportedTradeTypes(tradeTypes);
    const groupingSnapshot =
      await this.getTradeGroupingSnapshot(normalizedTradeTypes);
    const canonicalAccountName = this.resolveCanonicalAccountName(
      groupingSnapshot,
      accountName
    );
    const snapshotKey = this.getAccountAggregateSnapshotKey(
      canonicalAccountName,
      normalizedTradeTypes
    );

    const cachedSnapshot = this.accountAggregateSnapshots.get(snapshotKey);
    if (cachedSnapshot) {
      return cachedSnapshot;
    }

    const pendingSnapshot =
      this.accountAggregateSnapshotPromises.get(snapshotKey);
    if (pendingSnapshot) {
      return pendingSnapshot;
    }

    const snapshotGeneration = this.accountSnapshotGeneration;

    const snapshotPromise = (async () => {
      const rawTrades = this.getTradesForAccountLookup(
        groupingSnapshot,
        accountName
      );
      const accountTrades = this.cloneAccountTrades(rawTrades);
      const metadataEntries =
        this.plugin?.settings.account?.accountMetadata || {};
      const canonicalLookupKey =
        normalizeAccountLookupKey(canonicalAccountName);
      const metadataRecords = Object.entries(metadataEntries).map(
        ([key, metadata]) => ({ key, metadata })
      );
      const metadataEntry =
        metadataRecords.find(
          ({ key }) => normalizeAccountLookupKey(key) === canonicalLookupKey
        ) ||
        metadataRecords.find(
          ({ key }) =>
            normalizeAccountLookupKey(
              this.resolveCanonicalAccountName(groupingSnapshot, key)
            ) === canonicalLookupKey
        );
      const metadata = metadataEntry?.metadata;
      const metadataKeyMatchesCanonical =
        metadataEntry !== undefined &&
        normalizeAccountLookupKey(metadataEntry.key) ===
          normalizeAccountLookupKey(canonicalAccountName);
      const displayAccountName = metadataKeyMatchesCanonical
        ? metadataEntry.key
        : canonicalAccountName;

      if (accountTrades.length === 0 && !metadata) {
        this.accountAggregateSnapshotPromises.delete(snapshotKey);
        return null;
      }

      const account = this.createAccountDataFromTrades(
        displayAccountName,
        accountTrades,
        metadata
      );
      const conversionResult = await this.tryConvertTrades(
        accountTrades,
        metadata?.currency
      );
      const convertedTrades = conversionResult?.trades ?? accountTrades;
      const pnlContributingTradesForMetrics = convertedTrades.filter((trade) =>
        isPnlContributingTrade(trade as EnhancedTradeData)
      );

      let accountCurrentBalanceForBreakEven: number | undefined =
        account.currentBalance;

      if (conversionResult) {
        const nativeCurrency =
          account.currency ||
          metadata?.currency ||
          conversionResult.baseCurrency;

        if (nativeCurrency !== conversionResult.baseCurrency) {
          this.exchangeRateService ??= new ExchangeRateService(this.plugin!);

          const convertedBalance =
            await this.exchangeRateService.convertPnLToBaseCurrency(
              { [nativeCurrency]: account.currentBalance },
              conversionResult.baseCurrency
            );

          accountCurrentBalanceForBreakEven =
            convertedBalance &&
            convertedBalance.unconvertedCurrencies.length === 0
              ? convertedBalance.total
              : undefined;
        }
      }

      const metrics = this.calculateAccountMetrics(
        pnlContributingTradesForMetrics,
        conversionResult?.baseCurrency
          ? parseCuratedCurrencyCode(conversionResult.baseCurrency)
          : metadata?.currency,
        accountCurrentBalanceForBreakEven
      );

      if (conversionResult) {
        metrics.isMultiCurrency = true;
        metrics.convertedTotalPnL = metrics.totalPnL;
        metrics.conversionBaseCurrency = conversionResult.baseCurrency;
        metrics.conversionRateDate = conversionResult.rateDate;
        metrics.unconvertedCurrencies =
          conversionResult.unconvertedCurrencies.length > 0
            ? conversionResult.unconvertedCurrencies
            : undefined;
        if (
          conversionResult.originalTradeCount !==
          conversionResult.convertedTradeCount
        ) {
          metrics.originalTradeCount = conversionResult.originalTradeCount;
          metrics.convertedTradeCount = conversionResult.convertedTradeCount;
        }
      }

      const enhancedAccount = await this.enhanceAccountWithTransactions(
        account,
        convertedTrades,
        metrics
      );

      const snapshot: AccountAggregateSnapshot = {
        accountName: displayAccountName,
        trades: accountTrades,
        account: enhancedAccount,
        metrics,
      };

      if (snapshotGeneration !== this.accountSnapshotGeneration) {
        this.accountAggregateSnapshotPromises.delete(snapshotKey);
        return this.getAccountAggregateSnapshot(
          accountName,
          normalizedTradeTypes
        );
      }

      this.accountAggregateSnapshots.set(snapshotKey, snapshot);
      this.accountAggregateSnapshotPromises.delete(snapshotKey);
      return snapshot;
    })();

    this.accountAggregateSnapshotPromises.set(snapshotKey, snapshotPromise);

    try {
      return await snapshotPromise;
    } catch (error) {
      this.accountAggregateSnapshotPromises.delete(snapshotKey);
      throw error;
    }
  }

  

  private safeParseDate(dateValue: unknown): Date | null {
    
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue;
    }

    
    if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      try {
        const parsed = new Date(dateValue);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      } catch {
        // intentional
      }
    }

    
    return null;
  }

  private findAccountMetadataEntry(accountName: string):
    | {
        key: string;
        metadata: AccountMetadata;
      }
    | undefined {
    const accountMetadata = this.plugin?.settings.account?.accountMetadata;
    if (!accountMetadata) {
      return undefined;
    }

    const exactMatch = accountMetadata[accountName];
    if (exactMatch) {
      return { key: accountName, metadata: exactMatch };
    }

    const accountLookupKey = normalizeAccountLookupKey(accountName);
    for (const [metadataKey, metadata] of Object.entries(accountMetadata)) {
      if (normalizeAccountLookupKey(metadataKey) === accountLookupKey) {
        return { key: metadataKey, metadata };
      }
    }

    return undefined;
  }

  
  private getAccountMetadata(accountName: string): AccountMetadata | undefined {
    const metadataEntry = this.findAccountMetadataEntry(accountName);
    if (!metadataEntry) {
      logger.debug(
        `AccountPageService.getAccountMetadata: No metadata found for "${accountName}"`
      );
      return undefined;
    }

    const rawMetadata = metadataEntry.metadata;

    
    const metadata: AccountMetadata = {
      ...rawMetadata,
      
      createdDate:
        rawMetadata.createdDate instanceof Date
          ? rawMetadata.createdDate
          : this.safeParseDate(rawMetadata.createdDate) || new Date(),
      profitTargetDate: rawMetadata.profitTargetDate
        ? rawMetadata.profitTargetDate instanceof Date
          ? rawMetadata.profitTargetDate
          : this.safeParseDate(rawMetadata.profitTargetDate) || undefined
        : undefined,
      lastUpdated:
        rawMetadata.lastUpdated instanceof Date
          ? rawMetadata.lastUpdated
          : this.safeParseDate(rawMetadata.lastUpdated) || new Date(),
      liveBalanceAdjustment: normalizeLiveBalanceAdjustment(
        rawMetadata.liveBalanceAdjustment
      ),

      
      manualTransactions: rawMetadata.manualTransactions
        ? rawMetadata.manualTransactions.flatMap((t) => {
            if (t === null || t === undefined) return [];
            const parsedDate =
              t.date instanceof Date ? t.date : this.safeParseDate(t.date);

            if (!parsedDate || isNaN(parsedDate.getTime())) {
              console.warn(
                'AccountPageService: Skipping transaction with invalid date:',
                t
              );
              return [];
            }

            const transaction = { ...t, date: parsedDate };
            
            if (typeof transaction.id !== 'string' || !transaction.id)
              return [];
            if (!(transaction.date instanceof Date)) return [];
            if (typeof transaction.type !== 'string' || !transaction.type)
              return [];
            if (
              typeof transaction.amount !== 'number' ||
              isNaN(transaction.amount)
            )
              return [];
            if (
              typeof transaction.balanceAfter !== 'number' ||
              isNaN(transaction.balanceAfter)
            )
              return [];
            return [transaction];
          })
        : undefined,

      
      manualDrawdownSnapshots: rawMetadata.manualDrawdownSnapshots
        ? rawMetadata.manualDrawdownSnapshots.flatMap((s) => {
            if (s === null || s === undefined) return [];
            const parsedDate =
              s.date instanceof Date ? s.date : this.safeParseDate(s.date);

            if (!parsedDate || isNaN(parsedDate.getTime())) {
              console.warn(
                'AccountPageService: Skipping snapshot with invalid date:',
                s
              );
              return [];
            }

            const snapshot = { ...s, date: parsedDate };
            
            if (!(snapshot.date instanceof Date)) return [];
            if (
              typeof snapshot.drawdownLimit !== 'number' ||
              isNaN(snapshot.drawdownLimit)
            )
              return [];
            return [snapshot];
          })
        : undefined,
    };

    return metadata;
  }

  
  private async saveAccountMetadata(
    accountName: string,
    metadata: AccountMetadata
  ): Promise<void> {
    if (!this.plugin?.settings.account) {
      
      if (!this.plugin?.settings) {
        throw new Error(
          'Plugin settings not initialized - cannot save account metadata'
        );
      }
      this.plugin.settings.account = {
        defaultAccountType: AccountType.DEMO,
        defaultDrawdownType: DrawdownType.NONE,
        defaultDrawdownAmount: 0,
        showBalanceInDashboard: true,
        excludedAccountTypes: ['archived'],
        includeWithdrawalsFromExcluded: { archived: true, demo: false },
        accountTypeOrder: ['funded', 'evaluation', 'demo', 'archived'],
        accountMetadata: {},
      };
    }

    if (!this.plugin.settings.account.accountMetadata) {
      this.plugin.settings.account.accountMetadata = {};
    }

    const existingMetadataEntry = this.findAccountMetadataEntry(accountName);
    const metadataKey = existingMetadataEntry?.key ?? accountName;
    const previousMetadata =
      this.plugin.settings.account.accountMetadata[metadataKey];
    this.plugin.settings.account.accountMetadata[metadataKey] = metadata;

    try {
      await this.plugin.saveSettings();
    } catch (error) {
      if (previousMetadata) {
        this.plugin.settings.account.accountMetadata[metadataKey] =
          previousMetadata;
      } else {
        delete this.plugin.settings.account.accountMetadata[metadataKey];
      }
      throw error;
    }
  }

  private buildAccountMetadata(
    accountName: string,
    existingMetadata: AccountMetadata | undefined,
    updates: Partial<AccountMetadata>
  ): AccountMetadata {
    return {
      accountType: existingMetadata?.accountType || AccountType.DEMO,
      createdDate: existingMetadata?.createdDate || new Date(),
      initialBalance: existingMetadata?.initialBalance ?? 0,
      drawdownType: existingMetadata?.drawdownType || DrawdownType.NONE,
      drawdownAmount: existingMetadata?.drawdownAmount || 0,
      hasProfitTarget: existingMetadata?.hasProfitTarget || false,
      profitTarget: existingMetadata?.profitTarget || 0,
      profitTargetType:
        existingMetadata?.profitTargetType || ProfitTargetType.ABSOLUTE,
      profitTargetDate: existingMetadata?.profitTargetDate,
      monthlyCost: existingMetadata?.monthlyCost || 0,
      manualTransactions: existingMetadata?.manualTransactions,
      manualDrawdownSnapshots: existingMetadata?.manualDrawdownSnapshots,
      copyTradingPeriods: existingMetadata?.copyTradingPeriods,
      currency: existingMetadata?.currency,
      ...updates,
      liveBalanceAdjustment: normalizeLiveBalanceAdjustment(
        Object.prototype.hasOwnProperty.call(updates, 'liveBalanceAdjustment')
          ? updates.liveBalanceAdjustment
          : existingMetadata?.liveBalanceAdjustment
      ),
      name: accountName,
      lastUpdated: new Date(),
    };
  }

  private applyLiveBalanceAdjustment(
    account: AccountData,
    runningBalance: number,
    liveBalanceAdjustment: number | undefined
  ): void {
    const normalizedLiveBalanceAdjustment = normalizeLiveBalanceAdjustment(
      liveBalanceAdjustment
    );
    account.liveBalanceAdjustment = normalizedLiveBalanceAdjustment;
    account.currentBalance =
      runningBalance + (normalizedLiveBalanceAdjustment ?? 0);
  }

  private appendLiveBalanceDailyBalancePoint(
    balancesByDate: Map<string, DailyBalanceRecord>,
    account: AccountData
  ): void {
    if (!hasLiveBalanceAdjustment(account.liveBalanceAdjustment)) {
      return;
    }

    const liveBalanceDate = new Date();
    liveBalanceDate.setHours(0, 0, 0, 0);

    balancesByDate.set(formatLocalDateString(liveBalanceDate), {
      date: liveBalanceDate,
      balance: account.currentBalance,
      drawdownLevel: Math.max(
        0,
        (account.initialBalance || 0) - account.currentBalance
      ),
    });
  }

  public async updateAccountMetadata(
    accountName: string,
    updates: Partial<AccountMetadata>
  ): Promise<void> {
    const existingMetadata = this.getAccountMetadata(accountName);
    const metadata = this.buildAccountMetadata(
      accountName,
      existingMetadata,
      updates
    );

    await this.saveAccountMetadata(accountName, metadata);
    await this.refreshAccountData();
  }

  public async renameAccountMetadata(
    oldAccountName: string,
    newAccountName: string,
    updates: Partial<AccountMetadata> = {}
  ): Promise<void> {
    const oldMetadataEntry = this.findAccountMetadataEntry(oldAccountName);
    const existingMetadata = oldMetadataEntry?.metadata;
    const metadata = this.buildAccountMetadata(
      newAccountName,
      existingMetadata,
      updates
    );

    if (!this.plugin) {
      throw new Error(
        'Plugin not initialized - cannot rename account metadata'
      );
    }

    const accountMetadata = this.plugin.settings.account?.accountMetadata;
    if (!accountMetadata) {
      await this.saveAccountMetadata(newAccountName, metadata);
      await this.refreshAllAccountData();
      return;
    }

    const oldMetadataKey = oldMetadataEntry?.key ?? oldAccountName;
    const previousOldMetadata = accountMetadata[oldMetadataKey];
    const existingNewEntry = this.findAccountMetadataEntry(newAccountName);
    if (existingNewEntry && existingNewEntry.key !== oldMetadataKey) {
      throw new Error(`Account "${newAccountName}" already exists`);
    }

    const newMetadataKey = newAccountName;
    const previousNewMetadata =
      newMetadataKey === oldMetadataKey
        ? undefined
        : accountMetadata[newMetadataKey];

    delete accountMetadata[oldMetadataKey];
    accountMetadata[newMetadataKey] = metadata;

    const copyTradingPeriodRollbacks: Array<{
      metadataKey: string;
      previousPeriods: AccountMetadata['copyTradingPeriods'];
    }> = [];
    const oldLookupKeyForCopyPeriods =
      normalizeAccountLookupKey(oldAccountName);
    const newLookupKeyForCopyAdjustments =
      normalizeAccountLookupKey(newAccountName);
    for (const [metadataKey, accountEntry] of Object.entries(accountMetadata)) {
      if (!accountEntry.copyTradingPeriods?.length) {
        continue;
      }

      const updatedPeriods = accountEntry.copyTradingPeriods.map((period) =>
        normalizeAccountLookupKey(period.baseAccount) ===
        oldLookupKeyForCopyPeriods
          ? { ...period, baseAccount: newAccountName }
          : period
      );

      if (updatedPeriods === accountEntry.copyTradingPeriods) {
        continue;
      }

      const changed = updatedPeriods.some(
        (period, index) =>
          period.baseAccount !==
          accountEntry.copyTradingPeriods?.[index]?.baseAccount
      );
      if (!changed) {
        continue;
      }

      copyTradingPeriodRollbacks.push({
        metadataKey,
        previousPeriods: accountEntry.copyTradingPeriods,
      });
      accountEntry.copyTradingPeriods = updatedPeriods;
    }

    const copyTradeAdjustments = this.plugin.settings.copyTradeAdjustments;
    type CopyTradeAdjustment = { pnlAdjustment: number; note?: string };
    const copyTradeAdjustmentRollbacks: Array<{
      baseTradeKey: string;
      previousOldAdjustment: CopyTradeAdjustment;
      previousNewAdjustment: CopyTradeAdjustment | undefined;
    }> = [];
    if (copyTradeAdjustments) {
      for (const [baseTradeKey, accountAdjustments] of Object.entries(
        copyTradeAdjustments
      )) {
        if (!(oldLookupKeyForCopyPeriods in accountAdjustments)) {
          continue;
        }

        copyTradeAdjustmentRollbacks.push({
          baseTradeKey,
          previousOldAdjustment: accountAdjustments[oldLookupKeyForCopyPeriods],
          previousNewAdjustment:
            accountAdjustments[newLookupKeyForCopyAdjustments],
        });
        accountAdjustments[newLookupKeyForCopyAdjustments] =
          accountAdjustments[oldLookupKeyForCopyPeriods];
        delete accountAdjustments[oldLookupKeyForCopyPeriods];
      }
    }

    const updatedAccountMappings: Array<{
      accountId: string;
      previous: string;
    }> = [];
    const accountMapping =
      this.plugin.settings.backendIntegration?.accountMapping;
    if (accountMapping) {
      const oldLookupKey = normalizeAccountLookupKey(oldAccountName);
      for (const [accountId, displayName] of Object.entries(accountMapping)) {
        if (
          normalizeAccountLookupKey(String(displayName)) !== oldLookupKey ||
          displayName === newAccountName
        ) {
          continue;
        }

        updatedAccountMappings.push({
          accountId,
          previous: displayName,
        });
        accountMapping[accountId] = newAccountName;
      }
    }

    const homeGoalRollbacks: Array<{
      goalId: string;
      previousAccountTargets: Record<string, number> | undefined;
      previousAccountTargetAccounts: string[] | undefined;
    }> = [];
    const homeGoals = this.plugin.settings.home?.goals;
    if (homeGoals) {
      const oldLookupKey = normalizeAccountLookupKey(oldAccountName);
      for (const [goalId, goalConfig] of Object.entries(homeGoals)) {
        let changed = false;

        const nextAccountTargets = goalConfig.accountTargets
          ? { ...goalConfig.accountTargets }
          : undefined;
        if (nextAccountTargets) {
          for (const [accountName, target] of Object.entries(
            goalConfig.accountTargets ?? {}
          )) {
            if (normalizeAccountLookupKey(accountName) !== oldLookupKey) {
              continue;
            }

            nextAccountTargets[newAccountName] = target;
            delete nextAccountTargets[accountName];
            changed = true;
          }
        }

        const nextAccountTargetAccounts = goalConfig.accountTargetAccounts?.map(
          (accountName) => {
            if (normalizeAccountLookupKey(accountName) !== oldLookupKey) {
              return accountName;
            }

            changed = true;
            return newAccountName;
          }
        );

        if (!changed) {
          continue;
        }

        homeGoalRollbacks.push({
          goalId,
          previousAccountTargets: goalConfig.accountTargets,
          previousAccountTargetAccounts: goalConfig.accountTargetAccounts,
        });
        goalConfig.accountTargets = nextAccountTargets;
        goalConfig.accountTargetAccounts = nextAccountTargetAccounts;
      }
    }

    try {
      await this.plugin.saveSettings();
    } catch (error) {
      if (previousOldMetadata) {
        accountMetadata[oldMetadataKey] = previousOldMetadata;
      }

      if (newMetadataKey !== oldMetadataKey) {
        if (previousNewMetadata) {
          accountMetadata[newMetadataKey] = previousNewMetadata;
        } else {
          delete accountMetadata[newMetadataKey];
        }
      }

      if (accountMapping) {
        for (const { accountId, previous } of updatedAccountMappings) {
          accountMapping[accountId] = previous;
        }
      }

      if (homeGoals) {
        for (const {
          goalId,
          previousAccountTargets,
          previousAccountTargetAccounts,
        } of homeGoalRollbacks) {
          const goalConfig = homeGoals[goalId];
          if (!goalConfig) {
            continue;
          }

          goalConfig.accountTargets = previousAccountTargets;
          goalConfig.accountTargetAccounts = previousAccountTargetAccounts;
        }
      }

      for (const {
        metadataKey,
        previousPeriods,
      } of copyTradingPeriodRollbacks) {
        if (accountMetadata[metadataKey]) {
          accountMetadata[metadataKey].copyTradingPeriods = previousPeriods;
        }
      }
      if (copyTradeAdjustments) {
        for (const {
          baseTradeKey,
          previousOldAdjustment,
          previousNewAdjustment,
        } of copyTradeAdjustmentRollbacks) {
          const accountAdjustments = copyTradeAdjustments[baseTradeKey];
          if (!accountAdjustments) {
            continue;
          }

          accountAdjustments[oldLookupKeyForCopyPeriods] =
            previousOldAdjustment;
          if (previousNewAdjustment === undefined) {
            delete accountAdjustments[newLookupKeyForCopyAdjustments];
          } else {
            accountAdjustments[newLookupKeyForCopyAdjustments] =
              previousNewAdjustment;
          }
        }
      }
      throw error;
    }

    await this.refreshAllAccountData();
  }

  
  private createAccountDataFromTrades(
    accountName: string,
    trades: AccountTradeData[],
    metadata?: AccountMetadata
  ): AccountData {
    
    
    const pnlContributingTrades = trades.filter((trade) =>
      isPnlContributingTrade(trade as EnhancedTradeData)
    );

    
    const initialBalance = metadata?.initialBalance ?? 0;
    const liveBalanceAdjustment = metadata?.liveBalanceAdjustment;
    const createdDate =
      metadata?.createdDate || this.estimateCreationDate(trades);
    const currentBalanceForBreakEven =
      initialBalance +
      pnlContributingTrades.reduce(
        (sum, trade) => sum + getEffectivePnL(trade),
        0
      ) +
      (liveBalanceAdjustment ?? 0);

    const metrics = this.calculateAccountMetrics(
      pnlContributingTrades,
      metadata?.currency,
      currentBalanceForBreakEven
    );

    const baseCurrentBalance = initialBalance + metrics.totalPnL;
    const currentBalance = baseCurrentBalance + (liveBalanceAdjustment ?? 0);

    const accountData: AccountData = {
      id: this.getAccountId(accountName),
      name: accountName,
      accountType: metadata?.accountType || AccountType.DEMO,
      initialBalance,
      currentBalance,
      drawdownType: metadata?.drawdownType || DrawdownType.NONE,
      drawdownAmount: metadata?.drawdownAmount || 0,
      maxDrawdownReached:
        currentBalance < initialBalance ? currentBalance : initialBalance,
      hasProfitTarget: metadata?.hasProfitTarget || false,
      profitTarget: metadata?.profitTarget || 0,
      profitTargetType: metadata?.profitTargetType || ProfitTargetType.ABSOLUTE,
      profitTargetDate: metadata?.profitTargetDate,
      monthlyCost: metadata?.monthlyCost || 0,
      liveBalanceAdjustment,
      createdDate,
      lastUpdated: new Date(),
      metrics: {
        totalTrades: metrics.totalTrades,
        winningTrades: metrics.winningTrades,
        losingTrades: metrics.losingTrades,
        breakEvenTrades:
          metrics.totalTrades - metrics.winningTrades - metrics.losingTrades,
        winRate: metrics.winRate,
        totalPnL: metrics.totalPnL,
        bestTrade:
          pnlContributingTrades.length > 0
            ? Math.max(...pnlContributingTrades.map((t) => getEffectivePnL(t)))
            : 0,
        worstTrade:
          pnlContributingTrades.length > 0
            ? Math.min(...pnlContributingTrades.map((t) => getEffectivePnL(t)))
            : 0,
        profitFactor: metrics.profitFactor,
        averageWin: metrics.avgWin,
        averageLoss: metrics.avgLoss,
        maxDrawdown:
          initialBalance -
          (currentBalance < initialBalance ? currentBalance : initialBalance),
        totalWithdrawals: 0, 
      },
      transactions: [],
      dailyBalances: [],
      notePath: '', 
      currency: metadata?.currency,
      copyTradingPeriods: metadata?.copyTradingPeriods,
    };

    this.applyLiveBalanceAdjustment(
      accountData,
      baseCurrentBalance,
      liveBalanceAdjustment
    );

    
    if (
      metadata?.manualDrawdownSnapshots &&
      accountData.drawdownType === DrawdownType.MANUAL
    ) {
      const now = new Date();
      let currentSnapshot:
        | (typeof metadata.manualDrawdownSnapshots)[number]
        | undefined;
      let latestSnapshotTime = Number.NEGATIVE_INFINITY;

      for (const snapshot of metadata.manualDrawdownSnapshots) {
        if (!snapshot?.date || !(snapshot.drawdownLimit > 0)) continue;

        const parsedDate =
          snapshot.date instanceof Date
            ? snapshot.date
            : this.safeParseDate(snapshot.date);
        if (!parsedDate || isNaN(parsedDate.getTime()) || parsedDate > now) {
          continue;
        }

        const snapshotTime = parsedDate.getTime();
        if (snapshotTime > latestSnapshotTime) {
          latestSnapshotTime = snapshotTime;
          currentSnapshot = snapshot;
        }
      }
      if (currentSnapshot) {
        
        const snapshotDate =
          currentSnapshot.date instanceof Date
            ? currentSnapshot.date
            : this.safeParseDate(currentSnapshot.date);

        
        accountData.currentDrawdownSnapshot = {
          date: new Date(snapshotDate || new Date()),
          drawdownLimit: currentSnapshot.drawdownLimit,
          note: currentSnapshot.note,
        };
      }
    }

    
    if (
      metadata?.manualDrawdownSnapshots &&
      accountData.drawdownType === DrawdownType.MANUAL
    ) {
      accountData.allDrawdownSnapshots = [...metadata.manualDrawdownSnapshots]
        .filter((s) => {
          
          if (!s || !s.date) return false;
          
          const parsedDate =
            s.date instanceof Date ? s.date : this.safeParseDate(s.date);
          return parsedDate && !isNaN(parsedDate.getTime());
        })
        .sort((a, b) => {
          const dateA =
            a.date instanceof Date ? a.date : this.safeParseDate(a.date);
          const dateB =
            b.date instanceof Date ? b.date : this.safeParseDate(b.date);
          return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
        });
    }

    return accountData;
  }

  
  private getAccountId(accountName: string): string {
    return `account-${accountName.replace(/[^a-zA-Z0-9]/g, '-')}`;
  }

  private estimateCreationDate(trades: AccountTradeData[]): Date {
    if (trades.length === 0) {
      return new Date(); 
    }

    
    const earliestTrade = trades.reduce((earliest, trade) => {
      const tradeDate =
        trade.entryTime instanceof Date
          ? trade.entryTime
          : this.safeParseDate(trade.entryTime);
      const earliestDate =
        earliest.entryTime instanceof Date
          ? earliest.entryTime
          : this.safeParseDate(earliest.entryTime);

      
      if (!tradeDate) return earliest;
      if (!earliestDate) return trade;

      return tradeDate < earliestDate ? trade : earliest;
    });

    
    const creationDate =
      earliestTrade.entryTime instanceof Date &&
      !isNaN(earliestTrade.entryTime.getTime())
        ? new Date(earliestTrade.entryTime)
        : this.safeParseDate(earliestTrade.entryTime);

    
    if (!creationDate || isNaN(creationDate.getTime())) {
      const fallbackDate = new Date();
      fallbackDate.setMonth(0, 1); 
      fallbackDate.setHours(0, 0, 0, 0);
      console.warn(
        'AccountPageService: Could not determine account creation date, using fallback'
      );
      return fallbackDate;
    }
    creationDate.setDate(creationDate.getDate() - 1);
    creationDate.setHours(0, 0, 0, 0); 

    return creationDate;
  }

  
  public async getAccountPageData(
    accountName: string,
    tradeTypes?: TradeType[]
  ): Promise<AccountPageData | null> {
    try {
      const snapshot = await this.getAccountAggregateSnapshot(
        accountName,
        tradeTypes
      );
      if (!snapshot) {
        return null;
      }

      return {
        account: this.cloneAccountData(snapshot.account),
        trades: this.cloneAccountTrades(snapshot.trades),
        metrics: { ...snapshot.metrics },
      };
    } catch (error) {
      console.error(
        `Error getting account page data for ${accountName}:`,
        error
      );
      return null;
    }
  }

  
  public async getAccountTrades(
    accountName: string,
    tradeTypes?: TradeType[]
  ): Promise<AccountTradeData[]> {
    try {
      const snapshot = await this.getTradeGroupingSnapshot(tradeTypes);
      const trades = this.getTradesForAccountLookup(snapshot, accountName);
      return this.cloneAccountTrades(trades).sort(
        (a, b) => b.entryTime.getTime() - a.entryTime.getTime()
      );
    } catch (error) {
      console.error(`Error getting account trades for ${accountName}:`, error);
      return [];
    }
  }

  private calculateAccountMetrics(
    trades: AccountTradeData[],
    accountCurrency?: CurrencyCode,
    accountCurrentBalanceForBreakEven?: number
  ): AccountMetrics {
    const defaultCurrency =
      accountCurrency || this.plugin?.settings?.general?.currency || 'USD';

    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalPnL: 0,
        avgWin: 0,
        avgLoss: 0,
        avgWinRMultiple: undefined,
        avgLossRMultiple: undefined,
        profitFactor: 0,
        totalCommission: 0,
        totalSwap: 0,
        totalFees: 0,
        pnlByCurrency: {},
        isMultiCurrency: false,
        primaryCurrency: defaultCurrency,
      };
    }

    const totalTrades = trades.length;
    const totalCommission = trades.reduce(
      (sum, trade) => sum + trade.commission,
      0
    );
    const totalSwap = trades.reduce((sum, trade) => sum + trade.swap, 0);
    const totalFees = trades.reduce((sum, trade) => sum + trade.fees, 0);

    const totalPnL = trades.reduce(
      (sum, trade) => sum + getEffectivePnL(trade),
      0
    );

    const pnlByCurrency: Record<string, number> = {};
    for (const trade of trades) {
      const currency = trade.currency || defaultCurrency;
      pnlByCurrency[currency] =
        (pnlByCurrency[currency] || 0) + getEffectivePnL(trade);
    }

    const currencies = Object.keys(pnlByCurrency).sort();
    const isMultiCurrency = currencies.length > 1;
    const primaryCurrency = currencies[0] || defaultCurrency;

    const breakEvenSettings = this.plugin?.settings.trade;
    const winningTrades = trades.filter(
      (trade) =>
        classifyPnLWithBreakEvenSettings(
          getEffectivePnL(trade),
          breakEvenSettings,
          accountCurrentBalanceForBreakEven
        ) === 'win'
    );
    const losingTrades = trades.filter(
      (trade) =>
        classifyPnLWithBreakEvenSettings(
          getEffectivePnL(trade),
          breakEvenSettings,
          accountCurrentBalanceForBreakEven
        ) === 'loss'
    );

    const winRate =
      calculateWinRateExcludingBreakeven(
        winningTrades.length,
        losingTrades.length
      ) * 100;

    const totalWinAmount = winningTrades.reduce(
      (sum, trade) => sum + getEffectivePnL(trade),
      0
    );
    const totalLossAmount = Math.abs(
      losingTrades.reduce((sum, trade) => sum + getEffectivePnL(trade), 0)
    );

    const avgWin =
      winningTrades.length > 0 ? totalWinAmount / winningTrades.length : 0;
    const avgLoss =
      losingTrades.length > 0 ? totalLossAmount / losingTrades.length : 0;

    const defaultRiskAmount = this.plugin?.settings?.trade?.defaultRiskAmount;
    const winningTradesR = winningTrades.flatMap((t) => {
      const rMultiple = calculateEffectiveRMultiple(
        getEffectivePnL(t),
        t.rMultiple,
        t.riskAmount,
        defaultRiskAmount
      );
      return rMultiple === undefined ? [] : [rMultiple];
    });
    const avgWinRMultiple =
      winningTradesR.length > 0
        ? winningTradesR.reduce((sum, r) => sum + r, 0) / winningTradesR.length
        : undefined;

    const losingTradesR = losingTrades.flatMap((t) => {
      const rMultiple = calculateEffectiveRMultiple(
        getEffectivePnL(t),
        t.rMultiple,
        t.riskAmount,
        defaultRiskAmount
      );
      return rMultiple === undefined ? [] : [rMultiple];
    });
    const avgLossRMultiple =
      losingTradesR.length > 0
        ? losingTradesR.reduce((sum, r) => sum + Math.abs(r), 0) /
          losingTradesR.length
        : undefined;

    let profitFactor = 0;
    if (totalLossAmount > 0) {
      profitFactor = totalWinAmount / totalLossAmount;
    } else if (totalWinAmount > 0) {
      profitFactor = 999;
    }

    return {
      totalTrades,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      totalPnL,
      avgWin,
      avgLoss,
      avgWinRMultiple,
      avgLossRMultiple,
      profitFactor,
      totalCommission,
      totalSwap,
      totalFees,
      pnlByCurrency,
      isMultiCurrency,
      primaryCurrency,
    };
  }

  
  private formatTagForYAML(tagString: string): string {
    return tagString
      .trim()
      .replace(/\s+/g, '-') 
      .toLowerCase() 
      .replace(/[^a-z0-9-]/g, ''); 
  }

  
  public async refreshAllAccountData(): Promise<void> {
    this.clearAccountSnapshots();
    await Promise.all([
      this.clearCacheWithPrefix('allEnhancedAccounts'),
      this.clearCacheWithPrefix('accountPage:'),
      this.clearCacheWithPrefix('accountTrades:'),
    ]);
  }

  
  public async addManualDeposit(
    accountName: string,
    amount: number,
    date: Date,
    description?: string
  ): Promise<void> {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }

    const transactionId = this.generateTransactionId();
    const transaction: AccountTransaction = {
      id: transactionId,
      date: new Date(date),
      type: TransactionType.DEPOSIT,
      amount: amount,
      description: description || 'Manual deposit',
      balanceAfter: 0, 
    };

    await this.addManualTransaction(accountName, transaction);
  }

  
  public async addManualWithdrawal(
    accountName: string,
    amount: number,
    date: Date,
    description?: string
  ): Promise<void> {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }

    const transactionId = this.generateTransactionId();
    const transaction: AccountTransaction = {
      id: transactionId,
      date: new Date(date),
      type: TransactionType.WITHDRAWAL,
      amount: -amount, 
      description: description || 'Manual withdrawal',
      balanceAfter: 0, 
    };

    await this.addManualTransaction(accountName, transaction);
  }

  private async tryConvertTrades(
    trades: AccountTradeData[],
    accountCurrency?: CurrencyCode
  ) {
    if (!this.plugin) return null;

    
    const baseCurrency =
      accountCurrency || this.plugin.settings?.general?.currency || 'USD';

    
    const currencies = new Set<string>();
    for (const trade of trades) {
      currencies.add(trade.currency || baseCurrency);
    }

    
    if (currencies.size <= 1) {
      return null;
    }

    
    if (!this.exchangeRateService) {
      this.exchangeRateService = new ExchangeRateService(this.plugin);
    }

    return this.exchangeRateService.convertTrades(trades, baseCurrency);
  }

  
  public async getAccountTradesInRange(
    accountName: string,
    startDate: Date,
    endDate: Date,
    tradeTypes?: TradeType[]
  ): Promise<AccountTradeData[]> {
    const accountTrades = await this.getAccountTrades(accountName, tradeTypes);

    return accountTrades.filter((trade) => {
      const tradeDate = trade.entryTime;
      return tradeDate >= startDate && tradeDate <= endDate;
    });
  }

  
  public async getAccountInstruments(
    accountName: string,
    tradeTypes?: TradeType[]
  ): Promise<string[]> {
    const trades = await this.getAccountTrades(accountName, tradeTypes);
    const instruments = [...new Set(trades.map((trade) => trade.instrument))];
    return instruments.filter(Boolean);
  }

  
  public async getAccountSetups(
    accountName: string,
    tradeTypes?: TradeType[]
  ): Promise<string[]> {
    const trades = await this.getAccountTrades(accountName, tradeTypes);
    const setups = [...new Set(trades.flatMap((trade) => trade.setup))];
    return setups.filter(Boolean);
  }

  
  private async enhanceAccountWithTransactions(
    account: AccountData,
    trades: AccountTradeData[],
    pageMetrics: AccountMetrics
  ): Promise<AccountData> {
    
    const enhancedAccount: AccountData = {
      ...account,
      
      currentDrawdownSnapshot: account.currentDrawdownSnapshot
        ? {
            date: new Date(account.currentDrawdownSnapshot.date),
            drawdownLimit: account.currentDrawdownSnapshot.drawdownLimit,
            note: account.currentDrawdownSnapshot.note,
          }
        : undefined,
    };

    
    let hasInconsistentDates = false;
    if (account.transactions && account.transactions.length > 0) {
      const initialDeposit = account.transactions.find(
        (t) =>
          t.type === TransactionType.DEPOSIT &&
          t.description === 'Initial deposit'
      );
      if (initialDeposit) {
        const accountCreatedDate = new Date(account.createdDate);
        const depositDate = new Date(initialDeposit.date);
        
        const daysDifference =
          Math.abs(accountCreatedDate.getTime() - depositDate.getTime()) /
          (1000 * 60 * 60 * 24);
        if (daysDifference > 2) {
          hasInconsistentDates = true;
          
        }
      }
    }

    
    if (
      account.transactions &&
      account.transactions.length > 1 &&
      !hasInconsistentDates
    ) {
      
      
      const allTransactions = account.transactions.flatMap((t) => {
        const transactionDate =
          t.date instanceof Date ? t.date : this.safeParseDate(t.date);

        if (!transactionDate) {
          console.warn(
            `AccountPageService: Skipping existing transaction with invalid date:`,
            t
          );
          return [];
        }

        return [
          {
            ...t,
            date: transactionDate,
          },
        ];
      });

      
      const metadata = this.getAccountMetadata(account.name);
      if (metadata?.manualTransactions) {
        
        const existingTransactionIds = new Set(
          account.transactions.map((t) => t.id)
        );
        const newManualTransactions = metadata.manualTransactions.flatMap(
          (t) => {
            if (existingTransactionIds.has(t.id)) return [];
            
            const transactionDate =
              t.date instanceof Date ? t.date : this.safeParseDate(t.date);

            if (!transactionDate) {
              console.warn(
                `AccountPageService: Skipping manual transaction with invalid date:`,
                t
              );
              return [];
            }

            return [
              {
                ...t,
                date: transactionDate,
              },
            ];
          }
        );

        allTransactions.push(...newManualTransactions);
      }

      
      const sortedTransactions = allTransactions.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      
      let runningBalance = 0;
      for (const transaction of sortedTransactions) {
        runningBalance += transaction.amount;
        transaction.balanceAfter = runningBalance;
      }

      
      enhancedAccount.transactions = sortedTransactions;
      this.applyLiveBalanceAdjustment(
        enhancedAccount,
        runningBalance,
        metadata?.liveBalanceAdjustment
      );

      
      const enhancedMetrics: AccountServiceMetrics = {
        totalTrades: pageMetrics.totalTrades,
        winningTrades: pageMetrics.winningTrades,
        losingTrades: pageMetrics.losingTrades,
        breakEvenTrades:
          pageMetrics.totalTrades -
          pageMetrics.winningTrades -
          pageMetrics.losingTrades,
        winRate: pageMetrics.winRate,
        totalPnL: pageMetrics.totalPnL,
        bestTrade:
          trades.length > 0 ? Math.max(...trades.map((t) => t.pnl)) : 0,
        worstTrade:
          trades.length > 0 ? Math.min(...trades.map((t) => t.pnl)) : 0,
        profitFactor: pageMetrics.profitFactor,
        averageWin: pageMetrics.avgWin,
        averageLoss: pageMetrics.avgLoss,
        maxDrawdown: account.maxDrawdownReached
          ? account.initialBalance - account.maxDrawdownReached
          : 0,
        totalWithdrawals: sortedTransactions
          .filter(
            (t) =>
              t.type === TransactionType.WITHDRAWAL ||
              (t.type === TransactionType.DEPOSIT && t.amount < 0)
          )
          .reduce((sum, t) => sum + Math.abs(t.amount), 0),
        
        isMultiCurrency: pageMetrics.isMultiCurrency,
        conversionBaseCurrency: pageMetrics.conversionBaseCurrency,
      };

      enhancedAccount.metrics = enhancedMetrics;

      
      const dailyBalances: DailyBalanceRecord[] = [];
      if (sortedTransactions.length > 0) {
        
        const balancesByDate = new Map<string, number>();

        for (const transaction of sortedTransactions) {
          const transactionDate = new Date(transaction.date);
          const dateStr = formatLocalDateString(transactionDate);
          const year = transactionDate.getFullYear();

          
          if (year < 1970 || year > 2100) {
            console.warn(
              `AccountPageService: Skipping existing transaction with corrupted date ${dateStr} - year ${year} outside valid range`
            );
            continue;
          }

          balancesByDate.set(dateStr, transaction.balanceAfter);
        }

        
        const sortedDates = Array.from(balancesByDate.keys()).sort();
        for (const dateStr of sortedDates) {
          const balance = balancesByDate.get(dateStr)!;
          const initialBalance = account.initialBalance || 0;
          const drawdownLevel = Math.max(0, initialBalance - balance);

          dailyBalances.push({
            date: new Date(dateStr),
            balance: balance,
            drawdownLevel: drawdownLevel,
          });
        }
      }

      
      const finalBalancesByDate = new Map<string, DailyBalanceRecord>();
      for (const balance of dailyBalances) {
        const dateStr = formatLocalDateString(balance.date);
        finalBalancesByDate.set(dateStr, balance);
      }

      this.appendLiveBalanceDailyBalancePoint(
        finalBalancesByDate,
        enhancedAccount
      );

      enhancedAccount.dailyBalances = Array.from(
        finalBalancesByDate.values()
      ).sort((a, b) => a.date.getTime() - b.date.getTime());

      return enhancedAccount;
    }

    
    const transactions: AccountTransaction[] = [];

    
    const metadata = this.getAccountMetadata(account.name);

    const manualTransactions = metadata?.manualTransactions
      ? metadata.manualTransactions.flatMap((t) => {
          
          const transactionDate =
            t.date instanceof Date ? t.date : this.safeParseDate(t.date);

          if (!transactionDate) {
            console.warn(
              `AccountPageService: Skipping manual transaction with invalid date:`,
              t
            );
            return [];
          }

          return [
            {
              ...t,
              date: transactionDate,
              balanceAfter: 0, 
            },
          ];
        })
      : []; 

    
    const hasInitialDeposit = manualTransactions.some(
      (t) =>
        t.type === TransactionType.DEPOSIT &&
        t.description === 'Initial deposit'
    );

    
    if (
      (!account.transactions ||
        account.transactions.length === 0 ||
        hasInconsistentDates) &&
      !hasInitialDeposit
    ) {
      
      const initialDepositDate = new Date(account.createdDate);
      
      initialDepositDate.setHours(0, 0, 0, 0);

      transactions.push({
        id: `${account.id}-initial`,
        date: initialDepositDate,
        type: TransactionType.DEPOSIT,
        amount: account.initialBalance,
        description: 'Initial deposit',
        balanceAfter: 0, 
      });
    } else if (
      !hasInconsistentDates &&
      account.transactions &&
      account.transactions.length > 0
    ) {
      
      transactions.push(...account.transactions);
    }
    

    
    transactions.push(...manualTransactions);

    
    
    const pnlContributingTrades = trades.filter((trade) =>
      isPnlContributingTrade(trade as EnhancedTradeData)
    );

    const validTrades = pnlContributingTrades.flatMap((trade) => {
      const entryTime =
        trade.entryTime instanceof Date
          ? trade.entryTime
          : this.safeParseDate(trade.entryTime);
      const latestExitTime = getLastExitTime({ exits: trade.exits });

      const settlementCandidate =
        (
          trade as EnhancedTradeData & {
            settlementTime?: Date | string | null;
          }
        ).settlementTime ??
        latestExitTime ??
        trade.exitTime ??
        trade.entryTime;
      const settlementTime =
        settlementCandidate instanceof Date
          ? settlementCandidate
          : this.safeParseDate(settlementCandidate);

      if (!entryTime || !settlementTime) {
        console.warn(
          `AccountPageService: Skipping trade (${trade.path}) - invalid dates`
        );
        return [];
      }

      const entryYear = entryTime.getFullYear();
      const settlementYear = settlementTime.getFullYear();

      if (
        entryYear < 1970 ||
        entryYear > 2100 ||
        settlementYear < 1970 ||
        settlementYear > 2100
      ) {
        console.warn(
          `AccountPageService: Skipping trade with corrupted dates (${trade.path}) - year ${entryYear}/${settlementYear} outside valid range`
        );
        return [];
      }

      return [
        {
          ...trade,
          entryTime,
          settlementTime,
        },
      ];
    });

    for (const trade of validTrades) {
      const tradeIdBase = `${account.id}-trade-${trade.path.replace(/[^a-zA-Z0-9]/g, '-')}`;
      const dividendTransactions = (trade.dividends || [])
        .flatMap((dividend, index) => {
          const date =
            dividend.time instanceof Date
              ? dividend.time
              : this.safeParseDate(dividend.time);
          const amount =
            dividend.amount !== undefined && dividend.amount !== null
              ? Number(dividend.amount)
              : Number.NaN;

          if (
            !date ||
            isNaN(date.getTime()) ||
            !Number.isFinite(amount) ||
            amount === 0
          ) {
            return [];
          }

          return [
            {
              id: `${tradeIdBase}-dividend-${index}`,
              date,
              type: TransactionType.TRADE,
              amount,
              description: `Dividend: ${trade.path}`,
              tradeId: trade.path,
              balanceAfter: 0,
            },
          ];
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      const emittedDividendTotal = dividendTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );
      const residualTradePnL = getEffectivePnL(trade) - emittedDividendTotal;
      const settlementDate = trade.settlementTime ?? trade.entryTime;
      const analyticsDateBasis =
        this.plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';
      const realizedPnlEvents =
        analyticsDateBasis === 'exit'
          ? getTradeRealizedPnlEvents(trade, analyticsDateBasis, this.plugin)
          : [];
      const realizedPnlDividendAdjustment =
        trade.tradeStatus === 'CLOSED' ? emittedDividendTotal : 0;
      const realizedPnlAdjustmentIndex = realizedPnlEvents.length - 1;

      transactions.push(...dividendTransactions);

      if (realizedPnlEvents.length > 0) {
        for (const [index, event] of realizedPnlEvents.entries()) {
          const amount =
            index === realizedPnlAdjustmentIndex
              ? event.pnl - realizedPnlDividendAdjustment
              : event.pnl;
          if (amount === 0) {
            continue;
          }

          transactions.push({
            id: `${tradeIdBase}-realized-${index}`,
            date: event.date,
            type: TransactionType.TRADE,
            amount,
            description: `Trade realized P&L: ${trade.path}`,
            tradeId: trade.path,
            balanceAfter: 0,
          });
        }
      } else if (
        (dividendTransactions.length === 0 || residualTradePnL !== 0) &&
        settlementDate instanceof Date &&
        !isNaN(settlementDate.getTime())
      ) {
        transactions.push({
          id: `${tradeIdBase}-settlement`,
          date: settlementDate,
          type: TransactionType.TRADE,
          amount: residualTradePnL,
          description:
            dividendTransactions.length > 0
              ? `Trade settlement P&L: ${trade.path}`
              : `Trade P&L: ${trade.path}`,
          tradeId: trade.path,
          balanceAfter: 0,
        });
      }
    }

    
    const sortedTransactions = transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    
    
    let runningBalance = 0;

    
    const initialDepositIndex = sortedTransactions.findIndex(
      (t) =>
        t.type === TransactionType.DEPOSIT &&
        t.description === 'Initial deposit'
    );

    if (initialDepositIndex >= 0) {
      

      for (let i = 0; i < sortedTransactions.length; i++) {
        const transaction = sortedTransactions[i];

        if (i === initialDepositIndex) {
          
          runningBalance = account.initialBalance;
          transaction.balanceAfter = runningBalance;
        } else if (i < initialDepositIndex) {
          
          
          
          if (i <= 2) {
            console.warn(
              `AccountPageService: ${sortedTransactions.length - initialDepositIndex} transactions before initial deposit (showing first few)`
            );
          }
          runningBalance += transaction.amount;
          transaction.balanceAfter = runningBalance;
        } else {
          
          runningBalance += transaction.amount;
          transaction.balanceAfter = runningBalance;
        }
      }
    } else {
      
      console.warn(
        `AccountPageService: No initial deposit found, using zero-based balance calculation`
      );
      for (const transaction of sortedTransactions) {
        runningBalance += transaction.amount;
        transaction.balanceAfter = runningBalance;
      }
    }

    
    enhancedAccount.transactions = sortedTransactions;
    this.applyLiveBalanceAdjustment(
      enhancedAccount,
      runningBalance,
      metadata?.liveBalanceAdjustment
    );

    
    const enhancedMetrics: AccountServiceMetrics = {
      totalTrades: pageMetrics.totalTrades,
      winningTrades: pageMetrics.winningTrades,
      losingTrades: pageMetrics.losingTrades,
      breakEvenTrades:
        pageMetrics.totalTrades -
        pageMetrics.winningTrades -
        pageMetrics.losingTrades,
      winRate: pageMetrics.winRate,
      totalPnL: pageMetrics.totalPnL,
      bestTrade:
        pnlContributingTrades.length > 0
          ? Math.max(...pnlContributingTrades.map((t) => getEffectivePnL(t)))
          : 0,
      worstTrade:
        pnlContributingTrades.length > 0
          ? Math.min(...pnlContributingTrades.map((t) => getEffectivePnL(t)))
          : 0,
      profitFactor: pageMetrics.profitFactor,
      averageWin: pageMetrics.avgWin,
      averageLoss: pageMetrics.avgLoss,
      maxDrawdown: account.maxDrawdownReached
        ? account.initialBalance - account.maxDrawdownReached
        : 0,
      totalWithdrawals: sortedTransactions
        .filter(
          (t) =>
            t.type === TransactionType.WITHDRAWAL ||
            (t.type === TransactionType.DEPOSIT && t.amount < 0)
        )
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
      
      isMultiCurrency: pageMetrics.isMultiCurrency,
      conversionBaseCurrency: pageMetrics.conversionBaseCurrency,
    };

    enhancedAccount.metrics = enhancedMetrics;

    
    const dailyBalances: DailyBalanceRecord[] = [];
    if (transactions.length > 0) {
      
      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      
      const balancesByDate = new Map<string, number>();

      for (const transaction of sortedTransactions) {
        const transactionDate = new Date(transaction.date);
        const dateStr = formatLocalDateString(transactionDate);
        const year = transactionDate.getFullYear();

        
        if (year < 1970 || year > 2100) {
          console.warn(
            `AccountPageService: Skipping transaction with corrupted date ${dateStr} - year ${year} outside valid range`
          );
          continue;
        }

        balancesByDate.set(dateStr, transaction.balanceAfter);
      }

      
      const sortedDates = Array.from(balancesByDate.keys()).sort();
      for (const dateStr of sortedDates) {
        const balance = balancesByDate.get(dateStr)!;
        const initialBalance = account.initialBalance || 0;
        const drawdownLevel = Math.max(0, initialBalance - balance);

        dailyBalances.push({
          date: new Date(dateStr),
          balance: balance,
          drawdownLevel: drawdownLevel,
        });
      }
    }

    
    const finalBalancesByDate = new Map<string, DailyBalanceRecord>();
    for (const balance of dailyBalances) {
      const dateStr = formatLocalDateString(balance.date);
      finalBalancesByDate.set(dateStr, balance);
    }

    this.appendLiveBalanceDailyBalancePoint(
      finalBalancesByDate,
      enhancedAccount
    );

    enhancedAccount.dailyBalances = Array.from(
      finalBalancesByDate.values()
    ).sort((a, b) => a.date.getTime() - b.date.getTime());

    return enhancedAccount;
  }

  
  public async refreshAccountData(accountName?: string): Promise<void> {
    this.clearAccountSnapshots(accountName);

    if (accountName) {
      const accountNamesToClear = new Set<string>([accountName]);

      const mappedAccountName = this.resolveMappedAccountName(accountName);
      if (mappedAccountName) {
        accountNamesToClear.add(mappedAccountName);
      }

      try {
        const groupingSnapshot = await this.getTradeGroupingSnapshot();
        const canonicalAccountName = this.resolveCanonicalAccountName(
          groupingSnapshot,
          accountName
        );
        accountNamesToClear.add(canonicalAccountName);
      } catch (error) {
        console.warn(
          `AccountPageService: Failed to clear canonical snapshot for ${accountName}`,
          error
        );
      }

      const cacheClearPromises: Promise<unknown>[] = [];
      for (const accountNameToClear of accountNamesToClear) {
        this.clearAccountSnapshots(accountNameToClear);
        cacheClearPromises.push(
          this.clearCacheWithPrefix(`accountPage:${accountNameToClear}`),
          this.clearCacheWithPrefix(`accountTrades:${accountNameToClear}`)
        );
      }
      await Promise.all(cacheClearPromises);
    } else {
      await this.clearCacheWithPrefix('accountPage:');
      await this.clearCacheWithPrefix('accountTrades:');
    }

    await this.clearCacheWithPrefix('allEnhancedAccounts');
  }

  public async getAccountCatalog(
    tradeTypes?: TradeType[]
  ): Promise<AccountCatalogEntry[]> {
    try {
      const groupingSnapshot = await this.getTradeGroupingSnapshot(tradeTypes);
      const metadataEntries =
        this.plugin?.settings.account?.accountMetadata || {};

      const catalogByLookupKey = new Map<
        string,
        {
          name: string;
          metadata?: AccountMetadata;
        }
      >();

      for (const accountName of groupingSnapshot.accountNames) {
        catalogByLookupKey.set(normalizeAccountLookupKey(accountName), {
          name: accountName,
        });
      }

      for (const [metadataKey, metadata] of Object.entries(metadataEntries)) {
        const metadataLookupKey = normalizeAccountLookupKey(metadataKey);
        const existing = catalogByLookupKey.get(metadataLookupKey);
        if (existing) {
          existing.metadata = metadata;
          existing.name = metadataKey;
        } else {
          catalogByLookupKey.set(metadataLookupKey, {
            name: metadataKey,
            metadata,
          });
        }
      }

      return Array.from(catalogByLookupKey.values())
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ name, metadata }) => {
          const accountType = metadata?.accountType;
          return {
            id: this.getAccountId(name),
            name,
            accountType,
            archived: accountType?.toLowerCase() === 'archived',
            currency: metadata?.currency,
          };
        });
    } catch (error) {
      console.error('Error getting account catalog:', error);
      return [];
    }
  }

  
  public async getAllEnhancedAccounts(
    tradeTypes?: TradeType[]
  ): Promise<AccountData[]> {
    try {
      const normalizedTradeTypes =
        this.normalizeSupportedTradeTypes(tradeTypes);
      const catalog = await this.getAccountCatalog(normalizedTradeTypes);
      const allAccountNames = catalog.map((account) => account.name);

      const enhancedAccounts = await Promise.all(
        allAccountNames.map((accountName) =>
          this.getAccountAggregateSnapshot(accountName, normalizedTradeTypes)
        )
      );

      return enhancedAccounts.flatMap((account) =>
        account === null ? [] : [this.cloneAccountData(account.account)]
      );
    } catch (error) {
      console.error('Error getting all enhanced accounts:', error);
      return [];
    }
  }

  
  public async deleteAccount(
    accountName: string,
    options: { deleteAssociatedTrades?: boolean } = {}
  ): Promise<void> {
    if (!this.plugin) {
      throw new Error('Plugin not initialized');
    }

    const accountLookupKey = normalizeAccountLookupKey(accountName);
    const snapshotLookupKeysToRemove = new Set<string>();
    let canonicalAccountNameForDeletion = accountName;
    let canonicalAccountLookupKey = accountLookupKey;

    try {
      const groupingSnapshot = await this.getTradeGroupingSnapshot();
      canonicalAccountNameForDeletion = this.resolveCanonicalAccountName(
        groupingSnapshot,
        accountName
      );
      canonicalAccountLookupKey = normalizeAccountLookupKey(
        canonicalAccountNameForDeletion
      );

      for (const [lookupKey, accountNames] of Object.entries(
        groupingSnapshot.accountNamesByLookupKey
      )) {
        const canonicalLookupKeysForAlias = new Set(
          accountNames.map((name) =>
            normalizeAccountLookupKey(
              this.resolveCanonicalAccountName(groupingSnapshot, name)
            )
          )
        );

        if (canonicalLookupKeysForAlias.size !== 1) {
          continue;
        }

        const [canonicalLookupKeyForAlias] = Array.from(
          canonicalLookupKeysForAlias
        );
        const aliasBelongsToDeletedAccount =
          canonicalLookupKeyForAlias === accountLookupKey ||
          canonicalLookupKeyForAlias === canonicalAccountLookupKey;

        if (aliasBelongsToDeletedAccount) {
          snapshotLookupKeysToRemove.add(lookupKey);
        }
      }
    } catch (error) {
      console.warn(
        `AccountPageService: Failed to precompute account alias lookup keys for deletion of ${accountName}`,
        error
      );
    }

    
    const metadataKeysToDelete: string[] = [];
    const metadataLookupKeysToDelete = new Set<string>([
      accountLookupKey,
      canonicalAccountLookupKey,
    ]);
    const accountMetadata = this.plugin.settings.account?.accountMetadata;
    if (accountMetadata) {
      for (const metadataKey of Object.keys(accountMetadata)) {
        const metadataLookupKey = normalizeAccountLookupKey(metadataKey);

        if (metadataLookupKeysToDelete.has(metadataLookupKey)) {
          metadataKeysToDelete.push(metadataKey);
        }
      }
    }

    const removedMappedAccountIds: string[] = [];
    const removedMappedAccountNames: string[] = [];
    const accountMapping =
      this.plugin.settings.backendIntegration?.accountMapping;
    if (accountMapping) {
      const mappingLookupKeysToDelete = new Set([
        accountLookupKey,
        canonicalAccountLookupKey,
      ]);

      for (const [accountId, mappedName] of Object.entries(accountMapping)) {
        const mappedNameLookupKey = normalizeAccountLookupKey(
          String(mappedName)
        );
        const accountIdLookupKey = normalizeAccountLookupKey(accountId);

        if (
          mappingLookupKeysToDelete.has(mappedNameLookupKey) ||
          mappingLookupKeysToDelete.has(accountIdLookupKey)
        ) {
          removedMappedAccountIds.push(accountId);
        }
      }
    }

    const tradeService = this.plugin.tradeService;
    if (!tradeService) {
      throw new Error('TradeService not available');
    }

    
    const allFiles = this.app.vault.getFiles();

    const deletedMetadataEntries: Array<{
      key: string;
      value: AccountMetadata;
    }> = [];
    const deletedMappingEntries: Array<{ accountId: string; value: string }> =
      [];
    const removedMappedAccountLookupKeys = new Set(
      removedMappedAccountIds.map((accountId) =>
        normalizeAccountLookupKey(accountId)
      )
    );
    const accountLookupKeysToRemove = new Set([
      accountLookupKey,
      canonicalAccountLookupKey,
      ...snapshotLookupKeysToRemove,
      ...removedMappedAccountLookupKeys,
    ]);
    const homeGoals = this.plugin.settings.home?.goals;
    const updatedHomeGoalEntries: Array<{
      goalId: string;
      previousAccountTargets: Record<string, number> | undefined;
      previousAccountTargetAccounts: string[] | undefined;
    }> = [];
    const restoreUpdatedHomeGoals = () => {
      if (!homeGoals) {
        return;
      }

      for (const {
        goalId,
        previousAccountTargets,
        previousAccountTargetAccounts,
      } of updatedHomeGoalEntries) {
        const goalConfig = homeGoals[goalId];
        if (!goalConfig) {
          continue;
        }

        goalConfig.accountTargets = previousAccountTargets;
        goalConfig.accountTargetAccounts = previousAccountTargetAccounts;
      }
    };

    if (accountMetadata) {
      for (const metadataKey of metadataKeysToDelete) {
        const existingMetadata = accountMetadata[metadataKey];
        if (!existingMetadata) {
          continue;
        }

        deletedMetadataEntries.push({
          key: metadataKey,
          value: existingMetadata,
        });
        delete accountMetadata[metadataKey];
      }
    }

    if (accountMapping) {
      for (const accountId of removedMappedAccountIds) {
        const existingMapping = accountMapping[accountId];
        if (typeof existingMapping !== 'string') {
          continue;
        }

        deletedMappingEntries.push({ accountId, value: existingMapping });
        removedMappedAccountNames.push(existingMapping);
        delete accountMapping[accountId];
      }
    }

    if (homeGoals) {
      for (const [goalId, goalConfig] of Object.entries(homeGoals)) {
        let changed = false;
        const nextAccountTargets = goalConfig.accountTargets
          ? { ...goalConfig.accountTargets }
          : undefined;
        if (nextAccountTargets) {
          for (const accountName of Object.keys(nextAccountTargets)) {
            if (
              !accountLookupKeysToRemove.has(
                normalizeAccountLookupKey(accountName)
              )
            ) {
              continue;
            }

            delete nextAccountTargets[accountName];
            changed = true;
          }
        }

        const nextAccountTargetAccounts =
          goalConfig.accountTargetAccounts?.filter(
            (accountName) =>
              !accountLookupKeysToRemove.has(
                normalizeAccountLookupKey(accountName)
              )
          );
        if (
          nextAccountTargetAccounts &&
          nextAccountTargetAccounts.length !==
            goalConfig.accountTargetAccounts?.length
        ) {
          changed = true;
        }

        if (!changed) {
          continue;
        }

        updatedHomeGoalEntries.push({
          goalId,
          previousAccountTargets: goalConfig.accountTargets,
          previousAccountTargetAccounts: goalConfig.accountTargetAccounts,
        });
        goalConfig.accountTargets = nextAccountTargets;
        goalConfig.accountTargetAccounts = nextAccountTargetAccounts;
      }
    }

    if (
      deletedMetadataEntries.length > 0 ||
      deletedMappingEntries.length > 0 ||
      updatedHomeGoalEntries.length > 0
    ) {
      try {
        await this.plugin.saveSettings();
      } catch (error) {
        if (accountMetadata) {
          for (const { key, value } of deletedMetadataEntries) {
            accountMetadata[key] = value;
          }
        }
        if (accountMapping) {
          for (const { accountId, value } of deletedMappingEntries) {
            accountMapping[accountId] = value;
          }
        }
        restoreUpdatedHomeGoals();

        throw new Error(
          `Account deletion could not persist settings before trade rewrites: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    
    const trades = allFiles.filter((file) => {
      if (!file.path.endsWith('.md')) {
        return false;
      }

      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;

      
      if (frontmatter?.isMissedTrade) {
        return false;
      }

      
      if (frontmatter?.type === 'trade') {
        return true;
      }

      
      
      const journalFolder =
        this.folderPathService?.journalFolderPath || '!Journalit';
      return (
        file.path.includes('/trades/') &&
        file.path.startsWith(`${journalFolder}/`)
      );
    });
    const accountTagToRemove = `account/${this.formatTagForYAML(accountName)}`;
    const accountTagValuesToRemove = new Set(
      [
        accountName,
        canonicalAccountNameForDeletion,
        ...metadataKeysToDelete,
        ...removedMappedAccountIds,
        ...removedMappedAccountNames,
        ...Array.from(snapshotLookupKeysToRemove),
      ].flatMap((value) =>
        typeof value === 'string' && value.trim().length > 0
          ? [this.formatTagForYAML(value)]
          : []
      )
    );

    const isDeletableAccountTradeFile = (file: TFile): boolean => {
      if (!file.path.endsWith('.md')) {
        return false;
      }

      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (
        frontmatter?.type === 'trade' ||
        frontmatter?.type === 'missed-trade' ||
        frontmatter?.type === 'backtest-trade' ||
        frontmatter?.isMissedTrade ||
        frontmatter?.isBacktestTrade
      ) {
        return true;
      }

      if (typeof frontmatter?.type === 'string') {
        return false;
      }

      const journalFolder =
        this.folderPathService?.journalFolderPath || '!Journalit';
      return (
        file.path.includes('/trades/') &&
        file.path.startsWith(`${journalFolder}/`)
      );
    };

    const getAccountTags = (
      frontmatter: Record<string, unknown> | undefined
    ) =>
      Array.isArray(frontmatter?.tags)
        ? frontmatter.tags.flatMap((tag) =>
            typeof tag === 'string' && tag.startsWith('account/')
              ? [tag.slice('account/'.length)]
              : []
          )
        : [];

    const backendAccountIdsToUnlink = new Set(removedMappedAccountIds);
    if (options.deleteAssociatedTrades) {
      for (const file of allFiles) {
        if (!(file instanceof TFile) || !isDeletableAccountTradeFile(file)) {
          continue;
        }

        const frontmatter = asRecord(
          this.app.metadataCache.getFileCache(file)?.frontmatter
        );
        const values = [
          frontmatter?.account,
          frontmatter?.accounts,
          frontmatter?.accountId,
          frontmatter?.mtAccountId,
        ].flatMap(toUnknownList);
        const hasDeletedAccountFieldReference = values.some((value) => {
          const normalizedValue = this.normalizeFrontmatterScalarString(value);
          return Boolean(
            normalizedValue &&
            accountLookupKeysToRemove.has(
              normalizeAccountLookupKey(normalizedValue)
            )
          );
        });
        const hasDeletedAccountTagReference = getAccountTags(frontmatter).some(
          (tag) => accountTagValuesToRemove.has(this.formatTagForYAML(tag))
        );

        if (
          !hasDeletedAccountFieldReference &&
          !hasDeletedAccountTagReference
        ) {
          continue;
        }

        const directBackendAccountValues = [frontmatter?.mtAccountId].flatMap(
          toUnknownList
        );
        const backendTradeId = frontmatter?.backendTradeId;
        if (
          (typeof backendTradeId === 'number' &&
            Number.isFinite(backendTradeId)) ||
          (typeof backendTradeId === 'string' &&
            backendTradeId.trim().length > 0)
        ) {
          directBackendAccountValues.push(...[frontmatter?.accountId].flat());
        }
        for (const value of directBackendAccountValues) {
          const normalizedValue = this.normalizeFrontmatterScalarString(value);
          if (normalizedValue) {
            backendAccountIdsToUnlink.add(normalizedValue);
          }
        }
      }
    }

    if (
      options.deleteAssociatedTrades &&
      backendAccountIdsToUnlink.size > 0 &&
      (!this.plugin.backendIntegrationService ||
        !BackendSecretStorage.hasAuthToken(this.plugin))
    ) {
      if (accountMetadata) {
        for (const { key, value } of deletedMetadataEntries) {
          accountMetadata[key] = value;
        }
      }
      if (accountMapping) {
        for (const { accountId, value } of deletedMappingEntries) {
          accountMapping[accountId] = value;
        }
      }
      restoreUpdatedHomeGoals();

      if (
        deletedMetadataEntries.length > 0 ||
        deletedMappingEntries.length > 0 ||
        updatedHomeGoalEntries.length > 0
      ) {
        await this.plugin.saveSettings();
      }

      throw new Error(
        'Cannot delete synced account trades while offline or signed out. Unlink the MetaTrader account first, then try again.'
      );
    }

    if (options.deleteAssociatedTrades) {
      const deletableTradeFiles = allFiles.filter(
        (file): file is TFile =>
          file instanceof TFile && isDeletableAccountTradeFile(file)
      );

      const deletedTradeSnapshots: Array<{ path: string; content: string }> =
        [];
      const deletedSyncMappingEntries: Array<{
        tradeId: number;
        filePath: string;
      }> = [];
      const deletedRegularTradePaths: string[] = [];
      const deletedMissedTradePaths: string[] = [];
      const deletedBacktestTradePaths: string[] = [];
      const unlinkedBackendAccounts: Array<{
        accountId: string;
        displayName: string;
      }> = [];

      try {
        for (const trade of deletableTradeFiles) {
          const frontmatterRecord = asRecord(
            this.app.metadataCache.getFileCache(trade)?.frontmatter
          );
          const values = [
            frontmatterRecord?.account,
            frontmatterRecord?.accounts,
            frontmatterRecord?.accountId,
            frontmatterRecord?.mtAccountId,
          ].flatMap(toUnknownList);
          const accountTags = getAccountTags(frontmatterRecord);
          const hasDeletedAccountFieldReference = values.some((value) => {
            const normalizedValue =
              this.normalizeFrontmatterScalarString(value);
            if (!normalizedValue) {
              return false;
            }
            const lookupKey = normalizeAccountLookupKey(normalizedValue);
            return accountLookupKeysToRemove.has(lookupKey);
          });
          const hasDeletedAccountTagReference = accountTags.some((tag) =>
            accountTagValuesToRemove.has(this.formatTagForYAML(tag))
          );
          const referencesDeletedAccount =
            hasDeletedAccountFieldReference || hasDeletedAccountTagReference;

          if (referencesDeletedAccount) {
            const originalContent = await this.app.vault.read(trade);
            const backendTradeId = frontmatterRecord?.backendTradeId;
            const storedTradeType = inferStoredTradeType({
              filePath: trade.path,
              type: frontmatterRecord?.type,
              isMissedTrade: frontmatterRecord?.isMissedTrade,
              isBacktestTrade: frontmatterRecord?.isBacktestTrade,
            });
            await this.app.fileManager.trashFile(trade);
            if (storedTradeType === 'missed') {
              deletedMissedTradePaths.push(trade.path);
            } else if (storedTradeType === 'backtest') {
              deletedBacktestTradePaths.push(trade.path);
            } else {
              deletedRegularTradePaths.push(trade.path);
            }
            if (typeof backendTradeId === 'number') {
              const tradeSyncMapping =
                this.plugin.settings.backendIntegration?.tradeSyncMapping;
              const mappedPath = tradeSyncMapping?.[backendTradeId];
              if (tradeSyncMapping && typeof mappedPath === 'string') {
                deletedSyncMappingEntries.push({
                  tradeId: backendTradeId,
                  filePath: mappedPath,
                });
                delete tradeSyncMapping[backendTradeId];
              }
            }
            deletedTradeSnapshots.push({
              path: trade.path,
              content: originalContent,
            });
          }
        }

        if (
          backendAccountIdsToUnlink.size > 0 &&
          this.plugin.backendIntegrationService &&
          BackendSecretStorage.hasAuthToken(this.plugin)
        ) {
          const deletedMappingEntryByAccountId = new Map<
            string,
            (typeof deletedMappingEntries)[number]
          >();
          for (const entry of deletedMappingEntries) {
            if (!deletedMappingEntryByAccountId.has(entry.accountId)) {
              deletedMappingEntryByAccountId.set(entry.accountId, entry);
            }
          }

          for (const accountId of backendAccountIdsToUnlink) {
            await this.plugin.backendIntegrationService.unlinkMtAccount(
              accountId
            );
            const deletedMappingEntry =
              deletedMappingEntryByAccountId.get(accountId);
            unlinkedBackendAccounts.push({
              accountId,
              displayName: deletedMappingEntry?.value ?? accountId,
            });
          }
        }

        if (deletedSyncMappingEntries.length > 0) {
          await this.plugin.saveSettings();
        }

        const timestamp = Date.now();
        if (deletedRegularTradePaths.length > 0) {
          eventBus.publish('trade:changed', {
            action: 'deleted',
            filePaths: deletedRegularTradePaths,
            timestamp,
          });
        }
        for (const filePath of deletedMissedTradePaths) {
          eventBus.publish('missed-trade:changed', {
            action: 'deleted',
            filePath,
            timestamp,
          });
        }
        for (const filePath of deletedBacktestTradePaths) {
          eventBus.publish('backtest-trade:changed', {
            action: 'deleted',
            filePath,
            timestamp,
          });
        }
      } catch (error) {
        for (const snapshot of deletedTradeSnapshots.reverse()) {
          try {
            if (!this.app.vault.getAbstractFileByPath(snapshot.path)) {
              await this.app.vault.create(snapshot.path, snapshot.content);
            }
          } catch (restoreError) {
            console.error(
              `AccountPageService: Failed to restore deleted trade ${snapshot.path} after account deletion error:`,
              restoreError
            );
          }
        }

        if (accountMetadata) {
          for (const { key, value } of deletedMetadataEntries) {
            accountMetadata[key] = value;
          }
        }
        if (accountMapping) {
          for (const { accountId, value } of deletedMappingEntries) {
            accountMapping[accountId] = value;
          }
        }
        restoreUpdatedHomeGoals();
        if (this.plugin.backendIntegrationService) {
          for (const { accountId, displayName } of unlinkedBackendAccounts
            .slice()
            .reverse()) {
            try {
              await this.plugin.backendIntegrationService.relinkMtAccount(
                accountId,
                displayName
              );
            } catch (relinkError) {
              console.error(
                `AccountPageService: Failed to relink backend MT account ${accountId} after account deletion error:`,
                relinkError
              );
            }
          }
        }
        const tradeSyncMapping =
          this.plugin.settings.backendIntegration?.tradeSyncMapping;
        if (tradeSyncMapping) {
          for (const { tradeId, filePath } of deletedSyncMappingEntries) {
            tradeSyncMapping[tradeId] = filePath;
          }
        }

        if (
          deletedMetadataEntries.length > 0 ||
          deletedMappingEntries.length > 0 ||
          deletedSyncMappingEntries.length > 0 ||
          updatedHomeGoalEntries.length > 0
        ) {
          await this.plugin.saveSettings();
        }

        throw new Error(
          `Account deletion aborted while deleting associated trades: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    } else {
      
      const rollbackSnapshots: AccountDeletionRollbackSnapshot[] = [];

      const deletionContext: AccountDeletionRewriteContext = {
        accountLookupKey,
        accountTagToRemove,
        snapshotLookupKeysToRemove,
        removedMappedAccountIds,
        removedMappedAccountNames,
        removedMappedAccountLookupKeys,
        accountLookupKeysToRemove,
      };

      for (const trade of trades) {
        try {
          const originalContent = await this.app.vault.read(trade);
          const rollbackSnapshot: AccountDeletionRollbackSnapshot = {
            fileRef: trade,
            originalPath: trade.path,
            updatedPath: trade.path,
            originalContent,
          };
          rollbackSnapshots.push(rollbackSnapshot);

          const frontmatterRecord =
            this.app.metadataCache.getFileCache(trade)?.frontmatter;
          const storedTradeType = inferStoredTradeType({
            filePath: trade.path,
            type: frontmatterRecord?.type,
            isMissedTrade: frontmatterRecord?.isMissedTrade,
            isBacktestTrade: frontmatterRecord?.isBacktestTrade,
          });
          const isExplicitNonTradeType =
            typeof frontmatterRecord?.type === 'string' &&
            frontmatterRecord.type !== 'trade' &&
            frontmatterRecord.type !== 'backtest-trade';
          if (isExplicitNonTradeType) {
            rollbackSnapshots.pop();
            continue;
          }

          const hasNonStringTagValues =
            Array.isArray(frontmatterRecord?.tags) &&
            frontmatterRecord.tags.some((tag) => typeof tag !== 'string');

          if (storedTradeType !== 'regular' || hasNonStringTagValues) {
            const didUpdate = await this.applyAccountDeletionFrontmatterPatch(
              trade,
              deletionContext
            );

            if (!didUpdate) {
              rollbackSnapshots.pop();
              continue;
            }

            await forceMetadataCacheRefresh(this.app, trade);
            logger.debug(
              `Updated trade note references for deleted account via direct frontmatter patch: ${accountName}`
            );
            continue;
          }

          let extractedTradeData = await tradeService.extractTradeData(trade);
          if (!isExtractedTradeData(extractedTradeData)) {
            extractedTradeData = null;
          }

          if (!extractedTradeData) {
            await forceMetadataCacheRefresh(this.app, trade).catch(() => {
              // intentional
            });
            extractedTradeData = await tradeService.extractTradeData(trade);
            if (!isExtractedTradeData(extractedTradeData)) {
              extractedTradeData = null;
            }
          }

          if (!extractedTradeData) {
            const canFallbackFromExtractionFailure =
              frontmatterRecord?.type === 'trade';

            if (!canFallbackFromExtractionFailure) {
              logger.warn(
                `AccountPageService: Skipping account deletion rewrite for ${trade.path} because canonical extraction returned null and note is not an explicit regular trade`
              );
              rollbackSnapshots.pop();
              continue;
            }

            logger.warn(
              `AccountPageService: Falling back to direct frontmatter patch for ${trade.path} because canonical extraction returned null`
            );

            const didUpdateViaFallback =
              await this.applyAccountDeletionFrontmatterPatch(
                trade,
                deletionContext
              );

            if (!didUpdateViaFallback) {
              rollbackSnapshots.pop();
              continue;
            }

            await forceMetadataCacheRefresh(this.app, trade);
            continue;
          }

          const canonicalTradeData = extractedTradeData;
          const { didUpdate, nextTradeData } =
            this.buildAccountDeletionTradeUpdate(
              canonicalTradeData,
              deletionContext
            );

          if (!didUpdate) {
            rollbackSnapshots.pop();
            continue;
          }

          const shouldAvoidCanonicalUpdate =
            this.shouldAvoidCanonicalPathNormalization(trade.path) ||
            this.shouldAvoidCanonicalMetadataUpdate(nextTradeData);

          if (shouldAvoidCanonicalUpdate) {
            const didUpdateViaFallback =
              await this.applyAccountDeletionFrontmatterPatch(
                trade,
                deletionContext
              );

            if (!didUpdateViaFallback) {
              rollbackSnapshots.pop();
              continue;
            }

            await forceMetadataCacheRefresh(this.app, trade);
            continue;
          }

          rollbackSnapshot.originalTradeData = canonicalTradeData;

          let updatedPath: string;
          try {
            updatedPath = await tradeService.updateTrade(
              nextTradeData,
              trade.path,
              'account-deletion'
            );
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            if (!ACCOUNT_DELETION_REQUIRED_ACCOUNT_ERROR.test(errorMessage)) {
              throw error;
            }

            const didUpdateViaFallback =
              await this.applyAccountDeletionFrontmatterPatch(
                trade,
                deletionContext
              );

            if (!didUpdateViaFallback) {
              rollbackSnapshots.pop();
              continue;
            }

            await forceMetadataCacheRefresh(this.app, trade);
            logger.debug(
              `Updated trade note references for deleted account via direct frontmatter patch after canonical account validation: ${accountName}`
            );
            continue;
          }
          rollbackSnapshot.updatedPath = updatedPath;

          logger.debug(
            `Updated trade note references for deleted account via canonical trade update: ${accountName}`
          );
        } catch (error) {
          console.error(
            `Error updating trade file ${trade.path} during account deletion:`,
            error
          );

          await this.rollbackAccountDeletionTradeUpdates(
            rollbackSnapshots,
            tradeService
          );

          if (accountMetadata) {
            for (const { key, value } of deletedMetadataEntries) {
              accountMetadata[key] = value;
            }
          }
          if (accountMapping) {
            for (const { accountId, value } of deletedMappingEntries) {
              accountMapping[accountId] = value;
            }
          }
          restoreUpdatedHomeGoals();

          let settingsRestoreFailureMessage: string | undefined;
          try {
            if (
              deletedMetadataEntries.length > 0 ||
              deletedMappingEntries.length > 0 ||
              updatedHomeGoalEntries.length > 0
            ) {
              await this.plugin.saveSettings();
            }
          } catch (restoreError) {
            console.error(
              'AccountPageService: Failed to restore settings after deletion rewrite error:',
              restoreError
            );
            settingsRestoreFailureMessage =
              restoreError instanceof Error
                ? restoreError.message
                : String(restoreError);
          }

          const accountDeletionErrorMessage = `Account deletion aborted while updating ${trade.path}: ${error instanceof Error ? error.message : String(error)}`;

          if (settingsRestoreFailureMessage) {
            throw new Error(
              `${accountDeletionErrorMessage}. Settings rollback persistence also failed: ${settingsRestoreFailureMessage}`
            );
          }

          throw new Error(accountDeletionErrorMessage);
        }
      }
    }

    
    this.clearAccountSnapshots();
    await Promise.all([
      this.clearCacheWithPrefix('allEnhancedAccounts'),
      this.clearCacheWithPrefix('accountPage:'),
      this.clearCacheWithPrefix('accountTrades:'),
    ]);

    
    
    if (this.plugin?.tradeService) {
      await Promise.all([
        this.plugin.tradeService.clearCacheWithPrefix('trade:all-trades'),
        this.plugin.tradeService.clearCacheWithPrefix('trade:unique-accounts'),
        this.plugin.tradeService.clearCacheWithPrefix('trade:unique-values'),
      ]);
    }

    const deletedAccountAliases = Array.from(
      new Set([
        accountName,
        canonicalAccountNameForDeletion,
        ...metadataKeysToDelete,
        ...removedMappedAccountIds,
        ...Array.from(snapshotLookupKeysToRemove),
      ])
    ).filter((value) => typeof value === 'string' && value.trim().length > 0);

    eventBus.publish('account:changed', {
      action: 'deleted',
      accountId: removedMappedAccountIds[0] ?? canonicalAccountNameForDeletion,
      accountName: canonicalAccountNameForDeletion,
      accountNames: deletedAccountAliases,
    });

    
    

    logger.debug(
      `Account "${accountName}" has been successfully deleted and all references removed`
    );
  }

  
  public async updateManualTransaction(
    accountName: string,
    transactionId: string,
    updates: Partial<
      Pick<AccountTransaction, 'amount' | 'date' | 'description'>
    >
  ): Promise<void> {
    const metadata = this.getAccountMetadata(accountName);
    if (!metadata?.manualTransactions) {
      throw new Error('No manual transactions found for this account');
    }

    const transactionIndex = metadata.manualTransactions.findIndex(
      (t) => t.id === transactionId
    );
    if (transactionIndex === -1) {
      throw new Error('Transaction not found');
    }

    const existingTransaction = metadata.manualTransactions[transactionIndex];
    const updatedTransaction: AccountTransaction = {
      ...existingTransaction,
      ...updates,
      date: updates.date ? new Date(updates.date) : existingTransaction.date,
      balanceAfter: 0, 
    };

    
    if (updates.amount !== undefined) {
      if (
        existingTransaction.type === TransactionType.DEPOSIT &&
        updates.amount <= 0
      ) {
        throw new Error('Deposit amount must be positive');
      }
      if (
        existingTransaction.type === TransactionType.WITHDRAWAL &&
        updates.amount <= 0
      ) {
        throw new Error('Withdrawal amount must be positive');
      }

      
      if (existingTransaction.type === TransactionType.WITHDRAWAL) {
        updatedTransaction.amount = -Math.abs(updates.amount);
      }
    }

    metadata.manualTransactions[transactionIndex] = updatedTransaction;
    await this.saveAccountMetadata(accountName, {
      ...metadata,
      lastUpdated: new Date(),
    });
    await this.refreshAccountData();

    eventBus.publish('account:changed', {
      action: 'updated',
      accountName,
    });
  }

  
  public async deleteManualTransaction(
    accountName: string,
    transactionId: string
  ): Promise<void> {
    const metadata = this.getAccountMetadata(accountName);
    if (!metadata?.manualTransactions) {
      throw new Error('No manual transactions found for this account');
    }

    const transactionIndex = metadata.manualTransactions.findIndex(
      (t) => t.id === transactionId
    );
    if (transactionIndex === -1) {
      throw new Error('Transaction not found');
    }

    metadata.manualTransactions.splice(transactionIndex, 1);
    await this.saveAccountMetadata(accountName, {
      ...metadata,
      lastUpdated: new Date(),
    });
    await this.refreshAccountData();

    eventBus.publish('account:changed', {
      action: 'transaction-deleted',
      accountName,
    });
  }

  
  public getManualTransactions(accountName: string): AccountTransaction[] {
    const metadata = this.getAccountMetadata(accountName);
    return metadata?.manualTransactions || [];
  }

  
  private async addManualTransaction(
    accountName: string,
    transaction: AccountTransaction
  ): Promise<void> {
    const metadata = this.getAccountMetadata(accountName) || {
      name: accountName,
      accountType: AccountType.DEMO,
      createdDate: new Date(),
      initialBalance: 10000,
      drawdownType: DrawdownType.NONE,
      drawdownAmount: 0,
      hasProfitTarget: false,
      profitTarget: 0,
      profitTargetType: ProfitTargetType.ABSOLUTE,
      monthlyCost: 0,
      lastUpdated: new Date(),
    };

    if (!metadata.manualTransactions) {
      metadata.manualTransactions = [];
    }

    metadata.manualTransactions.push(transaction);
    metadata.lastUpdated = new Date();

    await this.saveAccountMetadata(accountName, metadata);
    await this.refreshAccountData();

    eventBus.publish('account:changed', {
      action: 'transaction-added',
      accountName,
    });
  }

  
  private generateTransactionId(): string {
    return `manual-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  
  public destroy(): void {
    
    if (this.unsubscribeTradeChanged) {
      this.unsubscribeTradeChanged();
    }
    if (this.unsubscribeTradeCommitted) {
      this.unsubscribeTradeCommitted();
    }
    if (this.unsubscribeMissedTradeChanged) {
      this.unsubscribeMissedTradeChanged();
    }
    if (this.unsubscribeBacktestTradeChanged) {
      this.unsubscribeBacktestTradeChanged();
    }
    if (this.unsubscribeSettingsChanged) {
      this.unsubscribeSettingsChanged();
    }
    if (this.unsubscribeAccountChanged) {
      this.unsubscribeAccountChanged();
    }
  }
}
