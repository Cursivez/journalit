import { logger } from '../../utils/logger';


import { App, TFile, normalizePath } from 'obsidian';
import { calculatePnL } from '../../utils/pnlCalculation';
import { calculateRMultiple } from '../../components/forms/trade/validation';
import {
  CustomDataService,
  CustomDataServiceConfig,
} from '../base/CustomDataService';
import JournalitPlugin from '../../main';
import { parseDisplayText } from '../../utils/tagSchema';
import {
  getISOWeekString,
  parseTradeTimestampValue,
} from '../../utils/dateUtils';
import { getTradingDay } from '../../utils/tradingDayUtils';
import {
  getTradeAnalyticsTradingDay,
  getTradeRealizedPnlEvents,
} from '../../utils/tradeAnalyticsDate';
import type { AnalyticsDateBasis } from '../../settings/types';
import { LossReviewData } from '../backend/types';
import { CustomFieldValues } from '../../types/customFields';
import { AccountPageService } from '../accountPage/AccountPageService';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import { normalizeStringArray } from '../../utils/dataUtils';
import {
  readFileContentForMutation,
  replaceFileContent,
} from '../../utils/fileMutation';
import {
  getFirstEntryTime,
  getLastExitTime,
  hasRealizedPnLComponents,
  isTradeOpenWithContext,
} from '../../utils/tradeStatusUtils';
import { FolderPathService } from '../core/FolderPathService';
import { TradeFormData } from '../../components/forms/trade/types';
import { OptionType } from '../options/CustomOptionsService';
import { parseTradeDividendTransactions } from '../../utils/tradeUtils';
import { eventBus, OptionsChangedPayload, Unsubscribe } from '../events';
import { ObsidianTradeNoteStore } from './core/ObsidianTradeNoteStore';
import { TradeReadModel } from './core/TradeReadModel';
import { TradeCommandService } from './core/TradeCommandService';
import { TradeEventBridge } from './core/TradeEventBridge';
import { planTradeMutation } from './core/TradeMutationPlanner';
import {
  buildTradeFilePath,
  buildTradeDirectoryPath,
  formatTradeDateForFilename,
  sanitizeTradeSymbolForFilename,
} from './core/TradePathPolicy';
import {
  backfillCanonicalExecutionFrontmatter,
  buildTradeFrontmatter,
  CANONICAL_EXECUTION_MIGRATION_VERSION,
  formatTradeFrontmatterDate,
  serializeTradeFrontmatter,
} from './core/TradeFrontmatterCodec';
import { normalizeTradeExecution } from './core/TradeExecutionNormalization';
import {
  normalizeAccountLookupKey,
  normalizeTradeAccountIdentity,
} from './core/TradeAccountIdentity';
import {
  createTradeNotesDocument,
  ensureTradeNoteOwnershipMarker,
} from './core/TradeNoteDocumentCodec';
import { safeString } from '../../utils/safeString';
import {
  buildTradeIdentityFields,
  ensureTradeIdentityFrontmatter,
  getTradeIdValue,
  getTradeIdentityFields,
  getTradeIdentityFieldsFromContent,
  getTradeIdentityNoteType,
  isTradeIdentityEligibleNote,
  type TradeId,
  type TradeRef,
} from '../../utils/tradeIdentity';

const CANONICAL_EXECUTION_INDEX_FIELDS = new Set([
  'entryTime',
  'exitTime',
  'entryPrice',
  'exitPrice',
  'positionSize',
]);

type RuntimeEntryExecution = {
  time?: string | Date | null;
  price?: string | number | null;
  size?: string | number | null;
  quantity?: string | number | null;
};

type RuntimeExitExecution = RuntimeEntryExecution & {
  hasExplicitPrice?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isDirectPnLInputEnabled(value: unknown): boolean {
  return value === true || value === 'true';
}

function getErrorCode(error: unknown): string | undefined {
  return isRecord(error) && typeof error.code === 'string'
    ? error.code
    : undefined;
}

function normalizeBooleanMap(
  value: unknown
): Record<string, boolean> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, boolean] => typeof entry[1] === 'boolean'
    )
  );
}

function normalizeStringMap(
  value: unknown
): Record<string, string> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  );
}

function normalizeLossReviewData(value: unknown): LossReviewData | undefined {
  if (!isRecord(value) || !isRecord(value.sections)) {
    return undefined;
  }

  const sections = Object.fromEntries(
    Object.entries(value.sections).flatMap(([sectionId, section]) => {
      if (!isRecord(section)) {
        return [];
      }

      return [
        [
          sectionId,
          {
            checkboxes: normalizeBooleanMap(section.checkboxes),
            textAreas: normalizeStringMap(section.textAreas),
          },
        ],
      ];
    })
  );

  return {
    sections,
    reviewed: value.reviewed === true,
    reviewedAt:
      typeof value.reviewedAt === 'string' ? value.reviewedAt : undefined,
  };
}

function getDateOrString(value: unknown): Date | string | undefined {
  return typeof value === 'string' || value instanceof Date ? value : undefined;
}

interface TradeFinancialFrontmatter extends Record<string, unknown> {
  type?: string;
  instrument?: string;
  assetType?: string;
  tradeStatus?: string;
  entryTime?: string | Date | null;
  exitTime?: string | Date | null;
  entryPrice?: number | null;
  exitPrice?: number | null;
  positionSize?: number | null;
  direction?: string;
  pnl?: number | null;
  rMultiple?: number;
  useDirectPnLInput?: boolean;
  directPnL?: number;
  entries?: Array<{
    time?: string | Date | null;
    price?: number | null;
    size?: number | null;
  }>;
  exits?: Array<{
    time?: string | Date | null;
    price?: number | null;
    size?: number | null;
  }>;
  dividends?: Array<{ time?: string | Date; amount?: number }>;
  commission?: number;
  hasExplicitCommission?: boolean;
  commissionType?: 'fixed' | 'percentage';
  fees?: number;
  swap?: number;
  rebate?: number;
  stopLoss?: number;
  riskAmount?: number;
  contractSize?: number;
  dollarPerPoint?: number;
  tickSize?: number;
  tickValue?: number;
  lotSize?: number;
  pipValue?: number;
  pipSize?: number;
  leverageRatio?: number;
}

function asTradeFinancialFrontmatter(
  value: unknown
): TradeFinancialFrontmatter | undefined {
  return isRecord(value) ? value : undefined;
}

interface ExecutionSnapshotItem {
  time?: string | Date;
  price?: number | null;
  size?: number | null;
  notional?: number | null;
}

function normalizeExecutionSnapshotItems(
  value: unknown
): ExecutionSnapshotItem[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    return [
      {
        time: getDateOrString(item.time),
        price: typeof item.price === 'number' ? item.price : undefined,
        size: typeof item.size === 'number' ? item.size : undefined,
        notional: typeof item.notional === 'number' ? item.notional : undefined,
      },
    ];
  });

  return items.length > 0 ? items : undefined;
}

function normalizeDividendSnapshotItems(
  value: unknown
): Array<{ time?: string | Date; amount?: number }> | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    return [
      {
        time: getDateOrString(item.time),
        amount: typeof item.amount === 'number' ? item.amount : undefined,
      },
    ];
  });

  return items.length > 0 ? items : undefined;
}

function normalizeTradeStatusExecutions(value: unknown):
  | Array<{
      time?: string | Date | null;
      price?: number | null;
      size?: number | null;
    }>
  | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const executions = value.flatMap((execution) => {
    if (!isRecord(execution)) {
      return [];
    }

    return [
      {
        time:
          typeof execution.time === 'string' || execution.time instanceof Date
            ? execution.time
            : null,
        price: typeof execution.price === 'number' ? execution.price : null,
        size: typeof execution.size === 'number' ? execution.size : null,
      },
    ];
  });

  return executions.length > 0 ? executions : undefined;
}

function normalizeRuntimeEntryExecutions(
  value: unknown
): RuntimeEntryExecution[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const executions = value.flatMap((execution) => {
    if (!isRecord(execution)) {
      return [];
    }

    return [
      {
        time:
          typeof execution.time === 'string' || execution.time instanceof Date
            ? execution.time
            : null,
        price:
          typeof execution.price === 'string' ||
          typeof execution.price === 'number'
            ? execution.price
            : null,
        size:
          typeof execution.size === 'string' ||
          typeof execution.size === 'number'
            ? execution.size
            : null,
        quantity:
          typeof execution.quantity === 'string' ||
          typeof execution.quantity === 'number'
            ? execution.quantity
            : null,
      },
    ];
  });

  return executions.length > 0 ? executions : undefined;
}

function normalizeRuntimeExitExecutions(
  value: unknown
): RuntimeExitExecution[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const sourceItems: unknown[] = value;
  return normalizeRuntimeEntryExecutions(sourceItems)?.map(
    (execution, index) => {
      const source = sourceItems[index];
      const hasExplicitPrice = isRecord(source)
        ? source.hasExplicitPrice === true
        : undefined;
      return { ...execution, hasExplicitPrice };
    }
  );
}

type CanonicalExecutionRuntimeFields = {
  entryTime?: Date;
  exitTime?: Date;
  entryPrice?: number;
  exitPrice?: number;
  positionSize?: number;
};

function parseRuntimeDate(value: unknown): Date | undefined {
  const parsed = parseTradeTimestampValue(value);
  return parsed ?? undefined;
}

function parseRuntimeNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = typeof value === 'number' ? value : Number(safeString(value));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getCanonicalExecutionSize(
  records: Array<RuntimeEntryExecution | RuntimeExitExecution> | undefined
): number {
  return (records ?? []).reduce((sum, execution) => {
    const size = parseRuntimeNumber(execution.size ?? execution.quantity);
    return size !== undefined && size > 0 ? sum + size : sum;
  }, 0);
}

function isTruthyRuntimeValue(value: unknown): boolean {
  return value === true || value === 'true';
}

function canonicalExecutionsCoverScalarSize(
  canonicalSize: number,
  scalarPositionSize: number | undefined
): boolean {
  return (
    scalarPositionSize === undefined ||
    Math.abs(canonicalSize - scalarPositionSize) < 1e-9
  );
}

function deriveCanonicalExecutionRuntimeFields(
  data: Record<string, unknown>
): CanonicalExecutionRuntimeFields {
  const entries = normalizeRuntimeEntryExecutions(data.entries);
  const exits = normalizeRuntimeExitExecutions(data.exits);
  const useDirectPnLInput =
    data.useDirectPnLInput === true || data.useDirectPnLInput === 'true';
  const hasExplicitExitPrice = isTruthyRuntimeValue(data.hasExplicitExitPrice);
  const normalized = normalizeTradeExecution(
    {
      entries: data.entries,
      exits: data.exits,
      useDirectPnLInput: data.useDirectPnLInput,
      hasExplicitExitPrice: data.hasExplicitExitPrice,
    },
    { deriveMissingExplicitness: true }
  );
  const canonicalEntrySize = getCanonicalExecutionSize(entries);
  const canonicalExitSize = getCanonicalExecutionSize(exits);
  const scalarPositionSize = parseRuntimeNumber(data.positionSize);
  const entriesCoverScalarSize = canonicalExecutionsCoverScalarSize(
    canonicalEntrySize,
    scalarPositionSize
  );
  const exitsCoverScalarSize = canonicalExecutionsCoverScalarSize(
    canonicalExitSize,
    scalarPositionSize
  );

  const derived: CanonicalExecutionRuntimeFields = {};
  const entryTime = entriesCoverScalarSize
    ? (getFirstEntryTime({ entries }) ?? parseRuntimeDate(data.entryTime))
    : (parseRuntimeDate(data.entryTime) ?? getFirstEntryTime({ entries }));
  const exitTime =
    exitsCoverScalarSize || useDirectPnLInput
      ? (getLastExitTime({ exits, useDirectPnLInput }) ??
        parseRuntimeDate(data.exitTime))
      : (parseRuntimeDate(data.exitTime) ??
        getLastExitTime({ exits, useDirectPnLInput }));
  const entryPrice = entriesCoverScalarSize
    ? (normalized.weightedEntryPrice ?? parseRuntimeNumber(data.entryPrice))
    : (parseRuntimeNumber(data.entryPrice) ??
      normalized.weightedEntryPrice ??
      undefined);
  const exitPrice =
    exitsCoverScalarSize || useDirectPnLInput
      ? (normalized.resolvedExitPrice ??
        (hasExplicitExitPrice ? parseRuntimeNumber(data.exitPrice) : undefined))
      : (parseRuntimeNumber(data.exitPrice) ??
        normalized.resolvedExitPrice ??
        undefined);
  const runtimePositionSize =
    entriesCoverScalarSize || scalarPositionSize === undefined
      ? canonicalEntrySize || scalarPositionSize
      : scalarPositionSize;

  if (entryTime) derived.entryTime = entryTime;
  if (exitTime) derived.exitTime = exitTime;
  if (entryPrice !== undefined) derived.entryPrice = entryPrice;
  if (exitPrice !== undefined) derived.exitPrice = exitPrice;
  if (runtimePositionSize !== undefined) {
    derived.positionSize = runtimePositionSize;
  }

  return derived;
}

function getCanonicalExecutionRuntimeValue(
  data: unknown,
  field: string
): unknown {
  if (!isRecord(data)) {
    return undefined;
  }

  if (!CANONICAL_EXECUTION_INDEX_FIELDS.has(field)) {
    return data[field];
  }

  const record = data;
  const derived = deriveCanonicalExecutionRuntimeFields(record);

  switch (field) {
    case 'entryTime':
      return derived.entryTime;
    case 'exitTime':
      return derived.exitTime;
    case 'entryPrice':
      return derived.entryPrice;
    case 'exitPrice':
      return derived.exitPrice;
    case 'positionSize':
      return derived.positionSize;
    default:
      return undefined;
  }
}

function withCanonicalExecutionRuntimeFields(
  trade: Record<string, unknown>
): Record<string, unknown> {
  const derived = deriveCanonicalExecutionRuntimeFields(trade);
  return {
    ...trade,
    ...derived,
  };
}

interface LegacyExecutionMigrationResult {
  scanned: number;
  migrated: number;
  skipped: number;
  failed: number;
  filePaths: string[];
  errors: Array<{ filePath: string; message: string }>;
}

function normalizeExtractedMTComment(comment: unknown): string | undefined {
  if (typeof comment !== 'string') {
    return undefined;
  }

  const normalizedDisplayText = parseDisplayText(comment).trim();
  if (!normalizedDisplayText) {
    return undefined;
  }

  if (
    normalizedDisplayText.startsWith("'") &&
    normalizedDisplayText.endsWith("'")
  ) {
    const unwrapped = normalizedDisplayText.slice(1, -1).replace(/''/g, "'");
    return unwrapped.trim() || undefined;
  }

  return normalizedDisplayText;
}


interface EntryTransaction {
  
  time: Date;
  
  price: number;
  
  size: number;
  
  notional?: number;
}


interface ExitTransaction {
  
  time: Date;
  
  price: number;
  
  size: number;
  
  notional?: number;
  
  hasExplicitPrice?: boolean;
}


interface DividendTransaction {
  
  time: Date;
  
  amount: number;
}


export interface TradeData {
  
  entries?: EntryTransaction[];
  exits?: ExitTransaction[];
  dividends?: DividendTransaction[];

  
  tradeStatus?: 'OPEN' | 'CLOSED';

  
  entryTime: Date;
  exitTime?: Date; 
  entryPrice: number;
  exitPrice?: number; 
  hasExplicitExitPrice?: boolean;
  positionSize: number;
  direction: string;
  setupIds: string[];
  accountId?: string; 
  thesis?: string;
  images?: string[];
  instrument?: string;
  assetType?: string;
  account?: string[];
  setup?: string[];
  mistake?: string[];
  customTags?: string[]; 
  tags?: string[]; 
  commission?: number;
  hasExplicitCommission?: boolean;
  commissionType?: 'fixed' | 'percentage';
  swap?: number;
  fees?: number;
  rebate?: number;
  stopLoss?: number;
  riskAmount?: number;
  currency?: string; 
  brokerBaseCurrencyPnl?: number;
  brokerBaseCurrency?: string;
  brokerBaseCurrencyPnlSource?: string;
  mae?: number;
  mfe?: number;
  maePrice?: number;
  mfePrice?: number;

  
  exchange?: string;

  
  underlyingSymbol?: string;
  expirationDate?: Date;
  strikePrice?: number;
  optionType?: string;
  contractSize?: number;

  
  contractSymbol?: string;
  dollarPerPoint?: number;
  tickSize?: number;
  tickValue?: number;

  
  currencyPair?: string;
  lotSize?: number;
  pipValue?: number;
  pipSize?: number;

  
  tradingPair?: string;
  cryptoExchange?: string;

  
  leverageRatio?: number;

  
  lossReview?: LossReviewData;

  
  reviewed?: boolean;
  reviewedAt?: string;

  
  notes?: string;

  
  mtComment?: string;

  
  originalPnl?: number;
  originalRMultiple?: number;

  
  authoritativePnl?: number;

  
  skipDefaultRiskAmount?: boolean;

  
  useDirectPnLInput?: boolean;
  directPnL?: number;

  
  executionLedgerVersion?: number;
  executionIds?: string[];

  
  tradeId?: TradeId;
  schemaVersion?: number;
  tradeRevision?: number;

  
  
  customFields?: CustomFieldValues;

  
  [key: string]: unknown;
}

type TradeRecord = Record<string, unknown> & {
  path?: string;
  filePath?: string;
  accountRefs?: unknown[];
};


export class TradeService extends CustomDataService {
  
  private static getFolderPath(folderPathService: FolderPathService): string {
    return folderPathService.journalFolderPath;
  }
  
  public async updateTrade(
    data: TradeData,
    filePath: string,
    source?: string,
    options?: { suppressLegacyTradeChanged?: boolean }
  ): Promise<string> {
    return this.tradeCommandService.updateTrade(
      this.applyAutomaticCommission(data),
      filePath,
      source,
      options
    );
  }

  public async legacyUpdateTrade(
    data: TradeData,
    filePath: string,
    source?: string,
    suppressTradeChangedEvent: boolean = false
  ): Promise<string> {
    try {
      const defaultRisk = this.plugin?.settings.trade.defaultRiskAmount;

      
      const fileExists = await this.app.vault.adapter.exists(filePath);
      if (!fileExists) {
        throw new Error(`Trade file does not exist: ${filePath}`);
      }

      
      let file = this.app.vault.getAbstractFileByPath(filePath);
      if (!file || !(file instanceof TFile)) {
        throw new Error(`Invalid file path: ${filePath}`);
      }

      
      const existingCache = this.app.metadataCache.getFileCache(file);
      const existingFrontmatter = existingCache?.frontmatter;
      const existingFrontmatterRecord =
        existingFrontmatter && typeof existingFrontmatter === 'object'
          ? (existingFrontmatter as Record<string, unknown>)
          : null;
      const existingEntryTime = existingFrontmatterRecord
        ? this.getExistingEntryTimeForRelocation(existingFrontmatterRecord)
        : undefined;
      const existingTicker =
        typeof existingFrontmatterRecord?.instrument === 'string'
          ? existingFrontmatterRecord.instrument
          : undefined;
      let persistedIdentity = getTradeIdentityFields(existingFrontmatterRecord);

      if (!persistedIdentity.tradeId || !persistedIdentity.schemaVersion) {
        const existingContent = await this.app.vault.read(file);
        persistedIdentity = {
          ...persistedIdentity,
          ...getTradeIdentityFieldsFromContent(existingContent),
        };
      }

      const identityFields = buildTradeIdentityFields({
        ...persistedIdentity,
        tradeId: getTradeIdValue(data.tradeId) ?? persistedIdentity.tradeId,
        schemaVersion: data.schemaVersion ?? persistedIdentity.schemaVersion,
      });

      
      const originalFilePath = filePath;
      let wasRelocated = false;

      const oldTicker = existingTicker
        ? this.sanitizeTickerForFilename(existingTicker)
        : 'UNKNOWN';

      const normalizedForComparison = planTradeMutation({
        mode: 'update',
        data,
        defaultRiskAmount: defaultRisk,
        financialFieldsChanged: true,
        existingPathContext: {
          filePath,
          existingEntryTime: existingEntryTime,
          existingTicker,
          existingType:
            typeof existingFrontmatterRecord?.type === 'string'
              ? existingFrontmatterRecord.type
              : undefined,
          isMissedTrade: existingFrontmatterRecord?.isMissedTrade === true,
        },
      }).normalizedData;

      
      let financialFieldsChanged = true; 

      try {
        
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file && file instanceof TFile) {
          const cachedFrontmatter =
            this.app.metadataCache.getFileCache(file)?.frontmatter;
          const existingFrontmatter =
            cachedFrontmatter && typeof cachedFrontmatter === 'object'
              ? (cachedFrontmatter as Record<string, unknown>)
              : null;

          if (
            existingFrontmatter &&
            normalizedForComparison.originalPnl !== undefined
          ) {
            const normalizeExecutionSnapshot = (
              executions:
                | Array<{
                    time?: string | Date;
                    price?: number | null;
                    size?: number | null;
                    notional?: number | null;
                  }>
                | undefined
            ) =>
              JSON.stringify(
                (executions || []).map((execution) => ({
                  time: execution?.time
                    ? formatTradeFrontmatterDate(execution.time)
                    : null,
                  price: execution?.price,
                  size: execution?.size,
                  notional: execution?.notional,
                }))
              );
            const getEntrySnapshotSource = (
              frontmatter: Record<string, unknown>
            ) => {
              const entries = normalizeExecutionSnapshotItems(
                frontmatter.entries
              );
              if (entries) {
                return entries;
              }
              if (
                frontmatter.entryTime &&
                frontmatter.entryPrice !== undefined
              ) {
                return [
                  {
                    time: getDateOrString(frontmatter.entryTime),
                    price: this.parseFiniteNumber(frontmatter.entryPrice),
                    size: this.parseFiniteNumber(frontmatter.positionSize),
                  },
                ];
              }
              return undefined;
            };
            const getExitSnapshotSource = (
              frontmatter: Record<string, unknown>
            ) => {
              const exits = normalizeExecutionSnapshotItems(frontmatter.exits);
              if (exits) {
                return exits;
              }
              if (frontmatter.exitTime && frontmatter.exitPrice !== undefined) {
                return [
                  {
                    time: getDateOrString(frontmatter.exitTime),
                    price: this.parseFiniteNumber(frontmatter.exitPrice),
                    size: this.parseFiniteNumber(frontmatter.positionSize),
                  },
                ];
              }
              return undefined;
            };
            const normalizeDividendSnapshot = (
              dividends:
                | Array<{ time?: string | Date; amount?: number }>
                | undefined
            ) =>
              JSON.stringify(
                (dividends || []).map((dividend) => ({
                  time: dividend?.time
                    ? formatTradeFrontmatterDate(dividend.time)
                    : null,
                  amount: dividend?.amount,
                }))
              );
            const existingExecution = normalizeTradeExecution(
              existingFrontmatter,
              { deriveMissingExplicitness: true }
            );
            const existingPositionSize = existingExecution.entries.reduce(
              (sum, entry) =>
                entry.size !== null && entry.size > 0 ? sum + entry.size : sum,
              0
            );
            const executionAggregatesChanged =
              normalizedForComparison.useDirectPnLInput !== true &&
              (existingExecution.weightedEntryPrice !==
                normalizedForComparison.entryPrice ||
                existingExecution.resolvedExitPrice !==
                  normalizedForComparison.exitPrice ||
                (existingPositionSize ||
                  existingExecution.positionSize ||
                  0) !== normalizedForComparison.positionSize);

            
            financialFieldsChanged =
              executionAggregatesChanged ||
              existingFrontmatter.direction !==
                normalizedForComparison.direction ||
              existingFrontmatter.commission !==
                normalizedForComparison.commission ||
              existingFrontmatter.hasExplicitCommission !==
                normalizedForComparison.hasExplicitCommission ||
              existingFrontmatter.commissionType !==
                normalizedForComparison.commissionType ||
              existingFrontmatter.fees !== normalizedForComparison.fees ||
              existingFrontmatter.swap !== normalizedForComparison.swap ||
              existingFrontmatter.rebate !== normalizedForComparison.rebate ||
              existingFrontmatter.directPnL !==
                normalizedForComparison.directPnL ||
              this.hasTradeStatusChanged(
                existingFrontmatter,
                normalizedForComparison
              ) ||
              existingFrontmatter.contractSize !==
                normalizedForComparison.contractSize ||
              existingFrontmatter.dollarPerPoint !==
                normalizedForComparison.dollarPerPoint ||
              existingFrontmatter.tickSize !==
                normalizedForComparison.tickSize ||
              existingFrontmatter.tickValue !==
                normalizedForComparison.tickValue ||
              existingFrontmatter.lotSize !== normalizedForComparison.lotSize ||
              existingFrontmatter.pipValue !==
                normalizedForComparison.pipValue ||
              existingFrontmatter.leverageRatio !==
                normalizedForComparison.leverageRatio ||
              existingFrontmatter.riskAmount !==
                normalizedForComparison.riskAmount ||
              existingFrontmatter.stopLoss !==
                normalizedForComparison.stopLoss ||
              normalizeExecutionSnapshot(
                getEntrySnapshotSource(existingFrontmatter)
              ) !==
                normalizeExecutionSnapshot(normalizedForComparison.entries) ||
              normalizeExecutionSnapshot(
                getExitSnapshotSource(existingFrontmatter)
              ) !== normalizeExecutionSnapshot(normalizedForComparison.exits) ||
              normalizeDividendSnapshot(
                normalizeDividendSnapshotItems(existingFrontmatter.dividends)
              ) !==
                normalizeDividendSnapshot(normalizedForComparison.dividends);
          }
        }
      } catch (error) {
        console.warn(
          'Could not compare with existing data, will recalculate PNL:',
          error
        );
      }

      const plan = planTradeMutation({
        mode: 'update',
        data: normalizedForComparison,
        defaultRiskAmount: defaultRisk,
        financialFieldsChanged,
        existingPathContext: {
          filePath,
          existingEntryTime: existingEntryTime,
          existingTicker,
          existingType:
            typeof existingFrontmatterRecord?.type === 'string'
              ? existingFrontmatterRecord.type
              : undefined,
          isMissedTrade: existingFrontmatterRecord?.isMissedTrade === true,
        },
      });
      data = plan.normalizedData;
      const isOpenTrade = plan.isOpen;

      if (plan.relocation?.required) {
        const newPath = await this.generateNewTradePath(
          plan.normalizedTicker,
          plan.normalizedEntryTime
        );

        
        const newFolderPath = newPath.substring(0, newPath.lastIndexOf('/'));
        await this.ensureDirectoryExists(newFolderPath);

        
        if (newPath !== filePath) {
          await this.app.vault.rename(file, newPath);
          filePath = newPath;
          wasRelocated = true;

          file = this.app.vault.getAbstractFileByPath(newPath);
          if (!file || !(file instanceof TFile)) {
            throw new Error(`Failed to get file after relocation: ${newPath}`);
          }
        }

        const changeReasons = [];
        if (plan.relocation?.dateChanged && existingEntryTime) {
          changeReasons.push(
            `date: ${formatTradeFrontmatterDate(existingEntryTime)} -> ${formatTradeFrontmatterDate(plan.normalizedEntryTime)}`
          );
        }
        if (plan.relocation?.tickerChanged) {
          changeReasons.push(
            `ticker: ${oldTicker} -> ${plan.normalizedTicker}`
          );
        }
        if (plan.relocation?.needsRegularTradePath) {
          changeReasons.push('type/path normalization');
        }
        if (wasRelocated) {
          logger.debug(
            `[TradeService] Trade file relocated (${changeReasons.join(', ')}): ${originalFilePath} -> ${newPath}`
          );
        }
      }

      const frontmatterData = buildTradeFrontmatter(
        {
          ...data,
          tradeId: identityFields.tradeId,
          schemaVersion: identityFields.schemaVersion,
        },
        {
          tradeStatus: isOpenTrade ? 'OPEN' : 'CLOSED',
          pnl: plan.pnl,
          rMultiple: plan.rMultiple,
          customFieldDefinitions:
            this.plugin?.customFieldsService?.getFields() || [],
          includeClearedCustomFields: true,
        }
      );
      frontmatterData.isMissedTrade = undefined;
      frontmatterData.isBacktestTrade = undefined;
      frontmatterData.missedReason = undefined;
      frontmatterData.customTags = undefined;

      if (
        Object.prototype.hasOwnProperty.call(data, 'mtComment') &&
        data.mtComment === undefined
      ) {
        frontmatterData.mtComment = undefined;
      }

      
      
      await this.updateFrontmatter(file, frontmatterData);
      

      const updatedContent = await readFileContentForMutation(this.app, file);
      const contentWithOwnershipMarker =
        ensureTradeNoteOwnershipMarker(updatedContent);
      if (contentWithOwnershipMarker !== updatedContent) {
        await replaceFileContent(this.app, file, contentWithOwnershipMarker);
        await forceMetadataCacheRefresh(this.app, file);
      }

      

      
      
      
      if (!suppressTradeChangedEvent && source !== 'user-input') {
        
        window.setTimeout(() => {
          eventBus.publish('trade:changed', {
            action: wasRelocated ? 'relocated' : 'updated',
            filePaths: [filePath],
            oldFilePath: wasRelocated ? originalFilePath : undefined,
          });
        }, 100);
      }

      
      await this.clearCacheWithPrefix('trade:');

      return filePath;
    } catch (error) {
      console.error('Error updating trade:', error);
      throw error;
    }
  }
  
  public recentlyCreatedFiles?: Set<string>;
  
  private unsubscribeOptions?: Unsubscribe;
  
  public get TRADES_FOLDER(): string {
    return this.tradesFolder;
  }

  
  public get JOURNALIT_FOLDER(): string {
    return this.folderPathService.journalFolderPath;
  }

  
  private readonly tradesFolder = 'trades';

  
  private folderPathService: FolderPathService;

  
  private readonly tradeNoteStore: ObsidianTradeNoteStore;
  private readonly tradeReadModel: TradeReadModel;
  private readonly tradeEventBridge: TradeEventBridge;
  private readonly tradeCommandService: TradeCommandService;

  
  private metadataCacheReady: boolean = false;
  
  private metadataCacheReadyPromise: Promise<void>;
  
  private resolveMetadataCacheReady: (() => void) | null = null;

  
  private tradeIndexReady: boolean = false;
  
  private needsTradeIndexRefresh: boolean = false;
  
  private tradeIndexReadyPromise: Promise<void>;
  
  private resolveTradeIndexReady: (() => void) | null = null;

  
  private unsubscribeIndexReady?: Unsubscribe;

  
  constructor(
    app: App,
    folderPathService: FolderPathService,
    config: CustomDataServiceConfig = {}
  ) {
    
    const appRef = app;
    const folderPathServiceRef = folderPathService;

    super(app, {
      folder: TradeService.getFolderPath(folderPathService),
      extension: '.md',
      cacheTTL: 5 * 60 * 1000, 
      persistCache: true,
      namespace: config.namespace || 'trade',
      enableIndexing: true,
      indexes: [
        
        {
          name: 'trades',
          fields: [
            'instrument',
            'direction',
            'pnl',
            'entryTime',
            'exitTime',
            'account',
            'setup',
            'mistake',
            'tags',
            'assetType',
          ],
          includeNested: false,
          valueExtractor: getCanonicalExecutionRuntimeValue,
          fileFilter: (file) => {
            
            if (!file.path.endsWith('.md')) {
              return false;
            }

            const frontmatter =
              appRef.metadataCache.getFileCache(file)?.frontmatter;

            
            if (frontmatter?.isMissedTrade) {
              return false;
            }

            
            if (
              frontmatter?.type === 'trade' ||
              frontmatter?.type === 'backtest-trade'
            ) {
              return true;
            }

            
            
            return (
              /\/trades\//.test(file.path) &&
              folderPathServiceRef.isJournalPath(file.path)
            );
          },
        },
        
        {
          name: 'trade-unique-values',
          fields: ['instrument', 'account', 'setup', 'mistake', 'tags'],
          includeNested: false,
          valueExtractor: (data, field) => {
            
            if (!isRecord(data)) {
              return undefined;
            }
            const value = data[field];
            if (Array.isArray(value)) {
              return value.filter(
                (item): item is string => typeof item === 'string'
              );
            } else if (typeof value === 'string') {
              return value
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean);
            }
            return value;
          },
          fileFilter: (file) => {
            
            if (!file.path.endsWith('.md')) {
              return false;
            }

            const frontmatter =
              appRef.metadataCache.getFileCache(file)?.frontmatter;

            
            if (frontmatter?.isMissedTrade) {
              return false;
            }

            
            if (
              frontmatter?.type === 'trade' ||
              frontmatter?.type === 'backtest-trade'
            ) {
              return true;
            }

            
            
            return (
              /\/trades\//.test(file.path) &&
              folderPathServiceRef.isJournalPath(file.path)
            );
          },
        },
      ],
    });

    this.metadataCacheReadyPromise = new Promise((resolve) => {
      this.resolveMetadataCacheReady = resolve;
    });

    this.tradeIndexReadyPromise = new Promise((resolve) => {
      this.resolveTradeIndexReady = resolve;
    });

    this.folderPathService = folderPathService;
    this.tradeNoteStore = new ObsidianTradeNoteStore(app);
    this.tradeReadModel = new TradeReadModel();
    this.tradeEventBridge = new TradeEventBridge();
    this.tradeCommandService = new TradeCommandService(
      this,
      this.tradeNoteStore,
      this.tradeReadModel,
      this.tradeEventBridge
    );
  }

  public getTradeSchemaVersion(): number {
    return 1;
  }

  private async publishCanonicalTradeCommit(
    filePath: string,
    action: 'updated' | 'relocated',
    options?: { previousPath?: string; suppressLegacyTradeChanged?: boolean }
  ): Promise<void> {
    const identity = await this.tradeNoteStore.readIdentity(filePath);
    if (!identity?.tradeId) {
      return;
    }

    const receipt = {
      tradeId: identity.tradeId,
      path: filePath,
      previousPath: options?.previousPath,
      revision: identity.tradeRevision ?? 1,
      schemaVersion: identity.schemaVersion ?? this.getTradeSchemaVersion(),
      committedAt: Date.now(),
    };

    this.tradeReadModel.recordCommit(receipt);
    this.tradeEventBridge.publishCommittedChange(
      {
        change: {
          action,
          tradeId: identity.tradeId,
          path: filePath,
          previousPath: options?.previousPath,
        },
        receipt,
      },
      {
        suppressLegacyTradeChanged: options?.suppressLegacyTradeChanged,
      }
    );
  }

  
  private normalizeUniqueOptionValues(values: unknown[]): string[] {
    if (!Array.isArray(values) || values.length === 0) {
      return [];
    }

    const normalizedValues = values
      .map((value) => {
        if (typeof value === 'string') {
          return value.trim();
        }

        if (
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          typeof value === 'bigint'
        ) {
          return safeString(value);
        }

        return '';
      })
      .filter((value) => value.length > 0);

    return Array.from(new Set(normalizedValues));
  }

  private canUseTradeIndexes(): boolean {
    return (
      this.isIndexingEnabled() && !this.tradeReadModel.shouldBypassIndexes()
    );
  }

  private getTradeRevisionValue(value: unknown): number | undefined {
    if (typeof value === 'number') {
      return Number.isInteger(value) && value > 0 ? value : undefined;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
    }

    return undefined;
  }

  private getTrackedMarkdownFiles(): TFile[] {
    const files = new Map<string, TFile>();

    const vaultFiles = [
      ...this.app.vault.getFiles(),
      ...this.app.vault.getMarkdownFiles(),
    ];

    for (const file of vaultFiles) {
      if (file.path.endsWith('.md')) {
        files.set(file.path, file);
      }
    }

    if (this.recentlyCreatedFiles) {
      for (const recentPath of this.recentlyCreatedFiles) {
        const recentFile = this.app.vault.getAbstractFileByPath(recentPath);
        if (recentFile instanceof TFile && recentFile.path.endsWith('.md')) {
          files.set(recentFile.path, recentFile);
        }
      }
    }

    for (const knownPath of this.tradeReadModel.getKnownPaths()) {
      const knownFile = this.app.vault.getAbstractFileByPath(knownPath);
      if (knownFile instanceof TFile && knownFile.path.endsWith('.md')) {
        files.set(knownFile.path, knownFile);
      }
    }

    return Array.from(files.values());
  }

  
  public async getUniqueInstruments(): Promise<string[]> {
    
    if (this.canUseTradeIndexes()) {
      const uniqueValues = this.getUniqueIndexValues(
        'trade-unique-values',
        'instrument'
      );
      if (uniqueValues.length > 0) {
        return this.normalizeUniqueOptionValues(uniqueValues);
      }
    }

    
    const trades = await this.getAllTrades(undefined, {
      useIndexes: this.canUseTradeIndexes(),
    });
    
    const instruments = trades.flatMap((trade) => {
      const instrument = this.getTradeValue(trade, 'instrument');
      return instrument ? [instrument] : [];
    });

    
    return this.normalizeUniqueOptionValues(instruments);
  }

  
  public async getUniqueAccounts(): Promise<string[]> {
    const trades = await this.getAllTrades(undefined, {
      useIndexes: this.canUseTradeIndexes(),
    });

    const normalizedAccounts = trades.flatMap(
      (trade) =>
        normalizeTradeAccountIdentity(trade, {
          resolveAccountIdDisplayName: (accountId) =>
            this.plugin?.settings.backendIntegration?.accountMapping?.[
              accountId
            ],
        }).accountNames
    );

    const dedupedAccounts = new Map<string, string>();
    for (const accountName of normalizedAccounts) {
      const lookupKey = normalizeAccountLookupKey(accountName);
      if (dedupedAccounts.has(lookupKey)) {
        continue;
      }
      dedupedAccounts.set(lookupKey, accountName);
    }

    return this.normalizeUniqueOptionValues(
      Array.from(dedupedAccounts.values())
    );
  }

  
  public getAccountService(): null {
    
    return null;
  }

  
  public getAccountPageService(): AccountPageService | undefined {
    return this.plugin?.accountPageService;
  }

  
  public async getUniqueSetups(): Promise<string[]> {
    
    if (this.canUseTradeIndexes()) {
      const uniqueValues = this.getUniqueIndexValues(
        'trade-unique-values',
        'setup'
      );
      if (uniqueValues.length > 0) {
        return this.normalizeUniqueOptionValues(uniqueValues);
      }
    }

    
    const trades = await this.getAllTrades(undefined, {
      useIndexes: this.canUseTradeIndexes(),
    });
    
    const setups = trades
      .flatMap((trade) => this.getTradeArrayValue(trade, 'setup'))
      .filter(Boolean);

    
    return this.normalizeUniqueOptionValues(setups);
  }

  
  public async getUniqueMistakes(): Promise<string[]> {
    
    if (this.canUseTradeIndexes()) {
      const uniqueValues = this.getUniqueIndexValues(
        'trade-unique-values',
        'mistake'
      );
      if (uniqueValues.length > 0) {
        return this.normalizeUniqueOptionValues(uniqueValues);
      }
    }

    
    const trades = await this.getAllTrades(undefined, {
      useIndexes: this.canUseTradeIndexes(),
    });
    
    const mistakes = trades
      .flatMap((trade) => this.getTradeArrayValue(trade, 'mistake'))
      .filter(Boolean);

    
    return this.normalizeUniqueOptionValues(mistakes);
  }

  
  private hasTradeStatusChanged(
    existingFrontmatter: Record<string, unknown>,
    newData: Record<string, unknown>
  ): boolean {
    
    const existingLogicalStatus =
      this.determineLogicalTradeStatus(existingFrontmatter);

    
    const newLogicalStatus = this.determineLogicalTradeStatus(newData);

    
    return existingLogicalStatus !== newLogicalStatus;
  }

  
  private determineLogicalTradeStatus(
    tradeData: Record<string, unknown>
  ): string {
    
    if (
      tradeData.tradeStatus === 'OPEN' ||
      tradeData.tradeStatus === 'CLOSED'
    ) {
      return tradeData.tradeStatus;
    }

    
    const hasExitTime =
      tradeData.exitTime !== undefined && tradeData.exitTime !== null;
    const exitPrice = tradeData.exitPrice;
    const hasExitPrice =
      exitPrice !== undefined &&
      exitPrice !== null &&
      typeof exitPrice === 'number' &&
      exitPrice > 0;
    const hasExitsArray =
      tradeData.exits &&
      Array.isArray(tradeData.exits) &&
      tradeData.exits.length > 0;

    
    if (hasExitTime && hasExitPrice) return 'CLOSED';
    if (hasExitsArray) return 'CLOSED';

    return 'OPEN';
  }

  
  public async getUniqueTags(): Promise<string[]> {
    
    if (this.canUseTradeIndexes()) {
      const uniqueValues = this.getUniqueIndexValues(
        'trade-unique-values',
        'tags'
      );
      if (uniqueValues.length > 0) {
        return this.normalizeUniqueOptionValues(uniqueValues);
      }
    }

    
    const trades = await this.getAllTrades(undefined, {
      useIndexes: this.canUseTradeIndexes(),
    });
    
    const tags = trades
      .flatMap((trade) => this.getTradeArrayValue(trade, 'tags'))
      .filter(Boolean);

    
    return this.normalizeUniqueOptionValues(tags);
  }

  
  public async getUniqueCustomTags(): Promise<string[]> {
    
    const trades = await this.getAllTrades(undefined, {
      useIndexes: this.canUseTradeIndexes(),
    });

    
    const allCustomTags: string[] = [];

    for (const trade of trades) {
      if (Array.isArray(trade.tags)) {
        allCustomTags.push(
          ...trade.tags.filter((tag): tag is string => typeof tag === 'string')
        );
      }
    }

    
    return Array.from(
      new Set(
        allCustomTags
          .map((tag) => String(tag).trim())
          .filter((tag) => tag.length > 0)
      )
    );
  }

  

  public async getTradeData(options?: {
    fresh?: boolean;
  }): Promise<Array<Record<string, unknown>>> {
    
    const allMarkdownFiles = this.getTrackedMarkdownFiles();

    const bypassIndexes = this.tradeReadModel.shouldBypassIndexes();

    
    const trades = await this.getAllTrades(allMarkdownFiles, {
      useIndexes: options?.fresh ? false : !bypassIndexes,
    });

    
    const result = await this.resolveTradePathsAsync(trades, allMarkdownFiles);

    return result.map((trade) => {
      const tradeRecord = trade as Record<string, unknown>;
      const existingAccountRefs = tradeRecord.accountRefs;

      if (Array.isArray(existingAccountRefs)) {
        return trade;
      }

      return {
        ...trade,
        accountRefs: normalizeTradeAccountIdentity(tradeRecord, {
          resolveAccountIdDisplayName: (accountId) =>
            this.plugin?.settings.backendIntegration?.accountMapping?.[
              accountId
            ],
        }).refs,
      };
    });
  }

  
  public async getTradeCount(): Promise<number> {
    if (
      this.canUseTradeIndexes() &&
      this.indexManager &&
      !this.indexManager.isDirtyIndex('trades')
    ) {
      const index = this.indexManager.getIndex('trades');
      if (index.length > 0) {
        return index.length;
      }
    }

    const allFiles = this.getTrackedMarkdownFiles();
    let count = 0;

    for (const file of allFiles) {
      const cachedFrontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      const frontmatter =
        cachedFrontmatter && typeof cachedFrontmatter === 'object'
          ? (cachedFrontmatter as Record<string, unknown>)
          : null;

      if (frontmatter?.isMissedTrade || /-M\d+\.md$/.test(file.path)) {
        continue;
      }

      if (
        frontmatter?.type === 'trade' ||
        frontmatter?.type === 'backtest-trade'
      ) {
        count++;
        continue;
      }

      if (
        /\/trades\//.test(file.path) &&
        this.folderPathService.isJournalPath(file.path)
      ) {
        count++;
      }
    }

    return count;
  }

  

  private async resolveTradePathsAsync(
    trades: TradeRecord[],
    allMarkdownFiles?: TFile[]
  ): Promise<TradeRecord[]> {
    
    const tradesWithPaths = trades.filter(
      (t) => t.path && t.path.trim() !== ''
    );
    if (tradesWithPaths.length === trades.length) {
      return trades;
    }

    
    const files = allMarkdownFiles || this.getTrackedMarkdownFiles();

    
    const fileMap = new Map<string, TFile>();
    for (const file of files) {
      const cachedFrontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      const frontmatter =
        cachedFrontmatter ?? (await this.readFrontmatter(file));
      const entryTime = frontmatter
        ? this.getTradePathResolutionEntryTime(frontmatter)
        : null;
      if (
        (frontmatter?.type === 'trade' ||
          frontmatter?.type === 'backtest-trade') &&
        frontmatter.instrument &&
        entryTime
      ) {
        
        const key = `${frontmatter.instrument}-${entryTime}-${frontmatter.direction || ''}`;
        fileMap.set(key, file);
      }
    }

    
    const BATCH_SIZE = 100;

    const result: TradeRecord[] = [];

    for (let i = 0; i < trades.length; i += BATCH_SIZE) {
      const batch = trades.slice(i, i + BATCH_SIZE);

      const processedBatch = batch.map((trade) => {
        
        if (trade.path && trade.path.trim() !== '') {
          return trade;
        }

        
        let matchingFile: TFile | undefined;
        const entryTime = this.getTradePathResolutionEntryTime(trade);
        const instrument =
          typeof trade.instrument === 'string' ? trade.instrument : undefined;
        const direction =
          typeof trade.direction === 'string' ? trade.direction : '';
        if (instrument && entryTime) {
          const key = `${instrument}-${entryTime}-${direction}`;
          matchingFile = fileMap.get(key);
        }

        return {
          ...trade,
          path: matchingFile?.path || this.generateUniqueTradePath(trade),
        };
      });

      result.push(...processedBatch);

      
      if (i + BATCH_SIZE < trades.length) {
        await new Promise((resolve) => window.setTimeout(resolve, 0));
      }
    }

    return result;
  }

  private getTradePathResolutionEntryTime(
    trade: Record<string, unknown>
  ): string | null {
    const normalizedExecution = normalizeTradeExecution(trade, {
      deriveMissingExplicitness: true,
    });

    return normalizedExecution.firstEntryTime
      ? formatTradeFrontmatterDate(normalizedExecution.firstEntryTime)
      : null;
  }

  
  private generateUniqueTradePath(trade: TradeRecord): string {
    const date = trade.entryTime instanceof Date ? trade.entryTime : new Date();
    const ticker =
      typeof trade.instrument === 'string'
        ? this.sanitizeTickerForFilename(trade.instrument)
        : 'UNKNOWN';
    const directory = buildTradeDirectoryPath(
      this.folderPathService,
      date,
      this.tradesFolder
    );
    const formattedDate = formatTradeDateForFilename(
      date,
      this.plugin?.settings.trade.dateFormat || 'DDMMYY'
    );
    const randomSuffix = Math.random().toString(36).substring(2, 8);

    return `${directory}/${ticker}-${formattedDate}-T${randomSuffix}.md`;
  }

  

  public async readFrontmatter(file: TFile): Promise<Record<string, unknown>> {
    return super.readFrontmatter(file);
  }

  
  public getApp(): App {
    return this.app;
  }

  

  private async getAllTrades(
    allMarkdownFiles?: TFile[],
    queryOptions?: { useIndexes?: boolean }
  ): Promise<TradeRecord[]> {
    const cacheKey = 'trade:all-trades';

    try {
      const result = await this.query(
        async () => {
          const files = await this.getTradeFiles(allMarkdownFiles);

          
          if (files.length === 0) {
            return [];
          }

          
          const BATCH_SIZE = 10; 

          const tradeData: Array<Record<string, unknown>> = [];

          for (let i = 0; i < files.length; i += BATCH_SIZE) {
            const batch = files.slice(i, i + BATCH_SIZE);

            
            const batchResults = await Promise.all(
              batch.map(async (file) => {
                try {
                  
                  const frontmatter = await this.readFrontmatter(file);
                  
                  return {
                    ...frontmatter,
                    path: file.path,
                  };
                } catch (error) {
                  console.error(
                    `Error processing trade file ${file.path}:`,
                    error
                  );
                  return { path: file.path }; 
                }
              })
            );

            tradeData.push(...batchResults);

            
            if (i + BATCH_SIZE < files.length) {
              await new Promise((resolve) => window.setTimeout(resolve, 5));
            }
          }

          return tradeData;
        },
        cacheKey,
        {
          offlineCapable: true,
          useIndexes:
            queryOptions?.useIndexes !== undefined
              ? queryOptions.useIndexes
              : true,
          useCache: queryOptions?.useIndexes === false ? false : true,
        },
        
        {
          indexName: 'trades',
          
          filters: {},
        }
      );

      
      const finalResult: Array<Record<string, unknown>> = Array.isArray(result)
        ? result
        : [];
      return finalResult.map((trade) =>
        withCanonicalExecutionRuntimeFields(
          this.withRuntimeExitPriceExplicitness(trade)
        )
      );
    } catch (error) {
      console.error('Error in getAllTrades:', error);
      return []; 
    }
  }

  private parseFiniteNumber(value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const parsed =
      typeof value === 'number' ? value : Number(safeString(value));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private withRuntimeExitPriceExplicitness(
    trade: Record<string, unknown>
  ): Record<string, unknown> {
    const normalizedExecution = normalizeTradeExecution(trade, {
      deriveMissingExplicitness: true,
    });
    let normalizedExitIndex = 0;

    const rawExits: unknown = trade.exits;
    const exits = Array.isArray(rawExits)
      ? rawExits.map((exit: unknown) => {
          if (!isRecord(exit)) {
            return exit;
          }

          const normalizedExit = normalizedExecution.exits[normalizedExitIndex];
          normalizedExitIndex += 1;
          return {
            ...exit,
            ...(normalizedExit?.hasExplicitPrice !== undefined
              ? { hasExplicitPrice: normalizedExit.hasExplicitPrice }
              : {}),
          };
        })
      : rawExits;

    return {
      ...trade,
      exits,
      hasExplicitExitPrice: normalizedExecution.hasExplicitExitPrice ?? false,
    };
  }

  
  private getTradeValue(
    trade: Record<string, unknown>,
    field: string
  ): string | null {
    return trade && trade[field] ? safeString(trade[field]) : null;
  }

  
  private getTradeArrayValue(
    trade: Record<string, unknown>,
    field: string
  ): string[] {
    if (!trade || !trade[field]) return [];

    
    if (Array.isArray(trade[field])) {
      return (trade[field] as unknown[]).map(String);
    } else {
      return safeString(trade[field])
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  
  public addRecentlyCreatedFile(filePath: string): void {
    if (!this.recentlyCreatedFiles) {
      this.recentlyCreatedFiles = new Set<string>();
    }
    this.recentlyCreatedFiles.add(filePath);

    
    window.setTimeout(() => {
      this.recentlyCreatedFiles?.delete(filePath);
    }, 10000);
  }

  
  public async waitForTradeDataReady(): Promise<void> {
    await this.waitForMetadataCacheReady();

    if (this.isIndexingEnabled()) {
      await this.waitForTradeIndexReady();
    }
  }

  private async waitForMetadataCacheReady(): Promise<void> {
    if (this.metadataCacheReady) return;

    const metadataCache = this.app
      .metadataCache as typeof this.app.metadataCache & {
      initialized?: boolean;
      inProgressTaskCount?: number;
    };

    if (
      metadataCache?.initialized &&
      (metadataCache.inProgressTaskCount ?? 0) === 0
    ) {
      this.markMetadataCacheReady();
      return;
    }

    await new Promise<void>((resolve) => {
      const timeoutMs = 30000;
      let finished = false;
      const timeoutId = window.setTimeout(() => {
        if (finished) return;
        finished = true;
        console.warn(
          'TradeService: metadata cache readiness timeout, proceeding anyway'
        );
        this.markMetadataCacheReady();
        resolve();
      }, timeoutMs);

      void this.metadataCacheReadyPromise.then(() => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timeoutId);
        resolve();
      });
    });
  }

  private async waitForTradeIndexReady(): Promise<void> {
    if (!this.indexManager) return;

    if (this.needsTradeIndexRefresh) {
      this.indexManager.markDirty('trades');
      this.indexManager.markDirty('trade-unique-values');
      this.needsTradeIndexRefresh = false;
    }

    if (this.indexManager.isDirtyIndex('trades')) {
      this.queryIndex('trades', {}, {});
    }

    if (this.indexManager.isIndexReady('trades')) {
      this.markTradeIndexReady();
      return;
    }

    await new Promise<void>((resolve) => {
      const timeoutMs = 30000;
      let finished = false;
      let unsubscribe: Unsubscribe | null = null;
      const timeoutId = window.setTimeout(() => {
        if (finished) return;
        finished = true;
        unsubscribe?.();
        console.warn(
          'TradeService: trade index readiness timeout, proceeding anyway'
        );
        this.markTradeIndexReady();
        resolve();
      }, timeoutMs);

      unsubscribe = eventBus.subscribe('index:ready', (payload) => {
        if (payload.indexName !== 'trades') return;
        if (finished) return;
        finished = true;
        window.clearTimeout(timeoutId);
        unsubscribe?.();
        this.markTradeIndexReady();
        resolve();
      });
    });
  }

  private markMetadataCacheReady(): void {
    if (this.metadataCacheReady) return;
    this.metadataCacheReady = true;
    this.resolveMetadataCacheReady?.();
  }

  private markTradeIndexReady(): void {
    if (this.tradeIndexReady) return;
    this.tradeIndexReady = true;
    this.resolveTradeIndexReady?.();
  }

  
  public setPlugin(plugin: JournalitPlugin): void {
    super.setPlugin(plugin);

    if (typeof this.app.metadataCache.on === 'function') {
      plugin.registerEvent(
        this.app.metadataCache.on('resolved', () => {
          this.markMetadataCacheReady();
          if (this.isIndexingEnabled()) {
            this.needsTradeIndexRefresh = true;
          }
        })
      );
    } else {
      this.markMetadataCacheReady();
    }

    const metadataCache = this.app
      .metadataCache as typeof this.app.metadataCache & {
      initialized?: boolean;
      inProgressTaskCount?: number;
    };

    if (
      !this.metadataCacheReady &&
      metadataCache?.initialized &&
      (metadataCache.inProgressTaskCount ?? 0) === 0
    ) {
      this.markMetadataCacheReady();
      if (this.isIndexingEnabled()) {
        this.needsTradeIndexRefresh = true;
      }
    }

    if (this.isIndexingEnabled()) {
      if (this.indexManager?.isIndexReady('trades')) {
        this.markTradeIndexReady();
      } else {
        this.unsubscribeIndexReady?.();
        this.unsubscribeIndexReady = eventBus.subscribe(
          'index:ready',
          (payload) => {
            if (payload.indexName === 'trades') {
              this.markTradeIndexReady();
            }
          }
        );
        if (typeof plugin.register === 'function') {
          plugin.register(() => {
            this.unsubscribeIndexReady?.();
          });
        }
      }
    } else {
      this.markTradeIndexReady();
    }

    
    plugin.registerEvent(
      plugin.app.vault.on('delete', async (file) => {
        
        if (/\/trades\//.test(file.path) && file.path.endsWith('.md')) {
          
          const normalizedPath = normalizePath(file.path);
          await this.handleTradeDeletion(
            normalizedPath,
            file instanceof TFile ? file : undefined
          );
        }
      })
    );

    this.unsubscribeOptions?.();
    this.unsubscribeOptions = eventBus.subscribe(
      'options:changed',
      (payload: OptionsChangedPayload) => {
        this.handleOptionsChanged(payload);
      }
    );
  }

  private handleOptionsChanged(payload: OptionsChangedPayload): void {
    if (
      payload.optionType !== OptionType.INSTRUMENT ||
      !payload.applyToTrades ||
      !payload.instrument ||
      !payload.assetType
    ) {
      return;
    }

    void this.applyInstrumentSpecsToTrades(
      payload.instrument,
      payload.assetType
    );
  }

  public async applyInstrumentSpecsToTrades(
    instrument: string,
    assetType: string
  ): Promise<number> {
    if (!this.plugin?.specService) return 0;

    const normalizedInstrument = instrument.trim().toLowerCase();
    const normalizedAssetType = assetType.trim().toLowerCase();

    if (!normalizedInstrument || !normalizedAssetType) return 0;

    this.plugin.specService.refreshCustomInstrumentsCache();
    const specs = this.plugin.specService.getSpecsForSymbol(
      instrument,
      assetType
    );

    if (!specs) return 0;

    const files = this.app.vault.getMarkdownFiles();
    const tradeFiles = files.filter((file) => {
      const cachedFrontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      const frontmatterRecord = isRecord(cachedFrontmatter)
        ? cachedFrontmatter
        : null;
      if (!frontmatterRecord) return false;

      if (
        frontmatterRecord.type !== 'trade' &&
        frontmatterRecord.type !== 'backtest-trade'
      ) {
        return false;
      }

      const instrumentValue =
        typeof frontmatterRecord.instrument === 'string'
          ? frontmatterRecord.instrument.toLowerCase()
          : '';
      const assetTypeValue =
        typeof frontmatterRecord.assetType === 'string'
          ? frontmatterRecord.assetType.toLowerCase()
          : '';

      return (
        instrumentValue === normalizedInstrument &&
        assetTypeValue === normalizedAssetType
      );
    });

    if (tradeFiles.length === 0) return 0;

    this.plugin.backendIntegrationService?.addBatchModifiedFiles(
      tradeFiles.map((file) => file.path)
    );

    const parseNumber = (value: unknown): number | undefined => {
      if (typeof value === 'number') {
        return Number.isFinite(value) ? value : undefined;
      }
      if (typeof value === 'string' && value.trim() !== '') {
        const parsed = parseFloat(value);
        return Number.isFinite(parsed) ? parsed : undefined;
      }
      return undefined;
    };

    const normalizeDirection = (value: unknown): string | undefined => {
      if (typeof value !== 'string') return undefined;
      const normalized = value.trim().toLowerCase();
      if (normalized === 'buy') return 'long';
      if (normalized === 'sell') return 'short';
      return normalized || undefined;
    };

    let updatedCount = 0;
    const updatedTradeFiles: string[] = [];
    const updatedBacktestFiles: string[] = [];

    const BATCH_SIZE = 25;

    for (let i = 0; i < tradeFiles.length; i += BATCH_SIZE) {
      const batch = tradeFiles.slice(i, i + BATCH_SIZE);

      for (const file of batch) {
        try {
          let updated = false;
          let updatedFileType: 'trade' | 'backtest-trade' | null = null;

          await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
            const frontmatterData = asTradeFinancialFrontmatter(frontmatter);
            if (!frontmatterData) return;
            const frontmatterRecord = frontmatterData;
            if (
              frontmatterData.type !== 'trade' &&
              frontmatterData.type !== 'backtest-trade'
            ) {
              return;
            }

            updatedFileType = frontmatterData.type;

            const instrumentValue =
              typeof frontmatterData.instrument === 'string'
                ? frontmatterData.instrument.toLowerCase()
                : '';
            const assetTypeValue =
              typeof frontmatterData.assetType === 'string'
                ? frontmatterData.assetType.toLowerCase()
                : '';

            if (
              instrumentValue !== normalizedInstrument ||
              assetTypeValue !== normalizedAssetType
            ) {
              return;
            }

            const identityResult =
              ensureTradeIdentityFrontmatter(frontmatterRecord);
            if (identityResult.changed) {
              updated = true;
            }

            if (
              normalizedAssetType === 'futures' &&
              'dollarPerPoint' in specs
            ) {
              if (frontmatterData.dollarPerPoint !== specs.dollarPerPoint) {
                frontmatterData.dollarPerPoint = specs.dollarPerPoint;
                updated = true;
              }
              if (frontmatterData.tickSize !== specs.tickSize) {
                frontmatterData.tickSize = specs.tickSize;
                updated = true;
              }
              if (frontmatterData.tickValue !== specs.tickValue) {
                frontmatterData.tickValue = specs.tickValue;
                updated = true;
              }
            }

            if (normalizedAssetType === 'forex' && 'lotSize' in specs) {
              if (frontmatterData.lotSize !== specs.lotSize) {
                frontmatterData.lotSize = specs.lotSize;
                updated = true;
              }
              if (frontmatterData.pipValue !== specs.pipValue) {
                frontmatterData.pipValue = specs.pipValue;
                updated = true;
              }
              if (frontmatterData.pipSize !== specs.pipSize) {
                frontmatterData.pipSize = specs.pipSize;
                updated = true;
              }
            }

            if (normalizedAssetType === 'cfd' && 'contractSize' in specs) {
              if (frontmatterData.contractSize !== specs.contractSize) {
                frontmatterData.contractSize = specs.contractSize;
                updated = true;
              }
            }

            const isOpenTrade = isTradeOpenWithContext({
              tradeStatus: frontmatterData.tradeStatus,
              exitTime: frontmatterData.exitTime,
              pnl: frontmatterData.pnl,
              useDirectPnLInput: frontmatterData.useDirectPnLInput,
              exits: frontmatterData.exits,
              entries: frontmatterData.entries,
            });

            const normalizedExecution = normalizeTradeExecution(
              frontmatterRecord,
              {
                deriveMissingExplicitness: true,
              }
            );

            const entries: EntryTransaction[] =
              normalizedExecution.entries.flatMap((entry) => {
                const time = entry.time ?? normalizedExecution.firstEntryTime;
                return entry.price !== null && entry.size !== null && time
                  ? [
                      {
                        time,
                        price: entry.price,
                        size: entry.size,
                        notional: entry.notional,
                      },
                    ]
                  : [];
              });

            const exits: ExitTransaction[] = normalizedExecution.exits.flatMap(
              (exit) => {
                const time =
                  exit.time ??
                  normalizedExecution.lastExitTime ??
                  normalizedExecution.firstEntryTime;
                return exit.price !== null && exit.size !== null && time
                  ? [
                      {
                        time,
                        price: exit.price,
                        size: exit.size,
                        notional: exit.notional,
                        ...(exit.hasExplicitPrice !== undefined
                          ? { hasExplicitPrice: exit.hasExplicitPrice }
                          : {}),
                      },
                    ]
                  : [];
              }
            );

            const dividends =
              parseTradeDividendTransactions(frontmatterData.dividends, {
                parseTime: (value) =>
                  value ? new Date(safeString(value)) : new Date(),
                filter: (dividend) => dividend.amount !== undefined,
              })?.map((dividend) => ({
                time: dividend.time,
                amount: dividend.amount ?? 0,
              })) || [];

            const entryPrice =
              normalizedExecution.weightedEntryPrice ??
              normalizedExecution.entryPrice ??
              undefined;
            const exitPrice =
              normalizedExecution.resolvedExitPrice ??
              normalizedExecution.exitPrice ??
              undefined;
            const positionSize = normalizedExecution.positionSize ?? undefined;
            const commission = parseNumber(frontmatterData.commission);
            const fees = parseNumber(frontmatterData.fees);
            const swap = parseNumber(frontmatterData.swap);
            const rebate = parseNumber(frontmatterData.rebate);

            const hasEntryExit =
              entryPrice !== undefined &&
              exitPrice !== undefined &&
              positionSize !== undefined;
            const hasEntriesExits = entries.length > 0 && exits.length > 0;
            const hasOpenTradeRealizedCashflow =
              isOpenTrade &&
              hasRealizedPnLComponents({
                tradeStatus:
                  typeof frontmatterData.tradeStatus === 'string'
                    ? frontmatterData.tradeStatus
                    : undefined,
                exits: exits.length > 0 ? exits : undefined,
                dividends: dividends.length > 0 ? dividends : undefined,
                commission,
                fees,
                swap,
                rebate,
                useDirectPnLInput: frontmatterData.useDirectPnLInput === true,
                directPnL: parseNumber(frontmatterData.directPnL),
              });

            if (
              !hasEntryExit &&
              !hasEntriesExits &&
              !hasOpenTradeRealizedCashflow
            ) {
              if (
                isOpenTrade &&
                (frontmatterData.pnl !== undefined ||
                  frontmatterData.rMultiple !== undefined)
              ) {
                frontmatterData.pnl = undefined;
                frontmatterData.rMultiple = undefined;
                updated = true;
              }
              return;
            }

            if (isDirectPnLInputEnabled(frontmatterData.useDirectPnLInput)) {
              return;
            }

            const direction = normalizeDirection(frontmatterData.direction);

            if (!direction && assetTypeValue !== 'options') {
              return;
            }

            const pnlData: Partial<TradeFormData> = {
              entries: entries.length > 0 ? entries : undefined,
              exits: exits.length > 0 ? exits : undefined,
              dividends: dividends.length > 0 ? dividends : undefined,
              entryTime:
                normalizedExecution.firstEntryTime ??
                (frontmatterData.entryTime
                  ? new Date(frontmatterData.entryTime)
                  : new Date()),
              exitTime:
                normalizedExecution.lastExitTime ??
                (frontmatterData.exitTime
                  ? new Date(frontmatterData.exitTime)
                  : undefined),
              entryPrice: entryPrice ?? 0,
              exitPrice: exitPrice ?? 0,
              positionSize: positionSize ?? 0,
              direction: direction || '',
              assetType: frontmatterData.assetType,
              commission: parseNumber(frontmatterData.commission),
              hasExplicitCommission:
                frontmatterData.hasExplicitCommission === true,
              commissionType: frontmatterData.commissionType,
              fees: parseNumber(frontmatterData.fees),
              swap: parseNumber(frontmatterData.swap),
              rebate: parseNumber(frontmatterData.rebate),
              stopLoss: parseNumber(frontmatterData.stopLoss),
              riskAmount: parseNumber(frontmatterData.riskAmount),
              useDirectPnLInput: frontmatterData.useDirectPnLInput,
              directPnL: parseNumber(frontmatterData.directPnL),
              tradeStatus: frontmatterData.tradeStatus,
              contractSize: parseNumber(frontmatterData.contractSize),
              tickSize: parseNumber(frontmatterData.tickSize),
              tickValue: parseNumber(frontmatterData.tickValue),
              dollarPerPoint: parseNumber(frontmatterData.dollarPerPoint),
              lotSize: parseNumber(frontmatterData.lotSize),
              pipValue: parseNumber(frontmatterData.pipValue),
              pipSize: parseNumber(frontmatterData.pipSize),
            };

            const newPnL = calculatePnL(pnlData);
            const newRMultiple = calculateRMultiple(pnlData);

            const existingPnL = parseNumber(frontmatterData.pnl);
            const existingRMultiple = parseNumber(frontmatterData.rMultiple);

            if (existingPnL !== newPnL) {
              frontmatterData.pnl = newPnL;
              updated = true;
            }

            if (existingRMultiple !== newRMultiple) {
              frontmatterData.rMultiple = newRMultiple;
              updated = true;
            }

            if (updated) {
              const existingTradeId =
                typeof frontmatterData.tradeId === 'string' &&
                frontmatterData.tradeId.length > 0
                  ? frontmatterData.tradeId
                  : buildTradeIdentityFields(frontmatterRecord).tradeId;
              const existingSchemaVersion = Number(
                frontmatterData.schemaVersion
              );
              const existingTradeRevision = this.getTradeRevisionValue(
                frontmatterData.tradeRevision
              );

              frontmatterData.tradeId = existingTradeId;
              frontmatterData.schemaVersion = Number.isFinite(
                existingSchemaVersion
              )
                ? Math.max(existingSchemaVersion, this.getTradeSchemaVersion())
                : this.getTradeSchemaVersion();
              frontmatterData.tradeRevision = existingTradeRevision
                ? existingTradeRevision + 1
                : 1;
            }
          });

          if (updated) {
            updatedCount += 1;
            if (updatedFileType === 'backtest-trade') {
              updatedBacktestFiles.push(file.path);
            } else {
              updatedTradeFiles.push(file.path);
            }
          }
        } catch (error) {
          console.error(
            `Failed to update trade specs for ${file.path}:`,
            error
          );
        }
      }

      if (i + BATCH_SIZE < tradeFiles.length) {
        await new Promise((resolve) => window.setTimeout(resolve, 0));
      }
    }

    if (updatedCount > 0) {
      const timestamp = Date.now();

      if (updatedTradeFiles.length > 0) {
        for (const filePath of updatedTradeFiles) {
          const file = this.app.vault.getAbstractFileByPath(filePath);
          if (file instanceof TFile) {
            await forceMetadataCacheRefresh(this.app, file);
          }

          await this.publishCanonicalTradeCommit(filePath, 'updated', {
            suppressLegacyTradeChanged: true,
          });
        }

        eventBus.publish('trade:changed', {
          action: 'updated',
          filePaths: updatedTradeFiles,
          timestamp,
        });
      }

      if (updatedBacktestFiles.length > 0) {
        updatedBacktestFiles.forEach((filePath) => {
          eventBus.publish('backtest-trade:changed', {
            action: 'updated',
            filePath,
            timestamp,
          });
        });
      }

      await this.clearCacheWithPrefix('trade:');
      await this.clearCacheWithPrefix('backtest-trade:');
    }

    window.setTimeout(() => {
      this.plugin?.backendIntegrationService?.removeBatchModifiedFiles(
        tradeFiles.map((file) => file.path)
      );
    }, 500);

    return updatedCount;
  }

  
  public async createTrade(
    data: TradeData,
    options?: {
      suppressAutoOpen?: boolean;
      deferPostCreateTasks?: boolean;
      suppressPostCreateTasks?: boolean;
    }
  ): Promise<string> {
    return this.tradeCommandService.createTrade(
      this.applyAutomaticCommission(data),
      options
    );
  }

  private applyAutomaticCommission(data: TradeData): TradeData {
    if (data.hasExplicitCommission === true) {
      return data;
    }

    const instrument = data.instrument;
    if (!instrument) {
      return data;
    }

    const hasExit =
      data.tradeStatus === 'OPEN'
        ? false
        : Boolean(data.exitTime || data.exits?.length);

    const commission =
      typeof this.plugin?.optionsService?.calculateInstrumentCommission ===
      'function'
        ? this.plugin.optionsService.calculateInstrumentCommission({
            instrument,
            assetType: data.assetType,
            account: data.account,
            positionSize: data.positionSize,
            hasExit,
          })
        : undefined;

    if (data.commission && data.commission !== 0) {
      if (commission === undefined || hasExit === false) {
        return data;
      }

      const entryOnlyCommission =
        typeof this.plugin?.optionsService?.calculateInstrumentCommission ===
        'function'
          ? this.plugin.optionsService.calculateInstrumentCommission({
              instrument,
              assetType: data.assetType,
              account: data.account,
              positionSize: data.positionSize,
              hasExit: false,
            })
          : undefined;

      if (entryOnlyCommission === undefined) {
        return data;
      }

      const isStoredEntryOnlyCommission =
        Math.abs(data.commission - entryOnlyCommission) < 0.000001;
      if (!isStoredEntryOnlyCommission) {
        return data;
      }
    }

    return commission === undefined
      ? data
      : { ...data, commission, hasExplicitCommission: false };
  }

  public async legacyCreateTrade(
    data: TradeData,
    options?: {
      suppressAutoOpen?: boolean;
      deferPostCreateTasks?: boolean;
      suppressPostCreateTasks?: boolean;
    },
    suppressTradeChangedEvent: boolean = false
  ): Promise<string> {
    try {
      const plan = planTradeMutation({
        mode: 'create',
        data,
        defaultRiskAmount: this.plugin?.settings.trade.defaultRiskAmount,
      });
      data = plan.normalizedData;

      
      const targetFolderPath = this.getTargetFolderPath(data.entryTime);

      
      try {
        await this.app.vault.adapter.mkdir(targetFolderPath);
      } catch {
        // intentional
      }

      
      const filePath = await this.getTradeFilePath(data);

      
      const existingFiles = await this.listFilesInFolder(targetFolderPath);

      
      const fileExists = await this.app.vault.adapter.exists(filePath);
      if (fileExists) {
        console.error(
          `Cannot create trade - File already exists at path: ${filePath}`
        );
        console.error(
          `Existing files in folder: ${JSON.stringify(existingFiles)}`
        );
        throw new Error(`File already exists: ${filePath}`);
      }

      
      const content = this.generateTradeContent(data);

      
      
      if (!this.recentlyCreatedFiles) {
        this.recentlyCreatedFiles = new Set<string>();
      }
      this.recentlyCreatedFiles.add(filePath);

      
      window.setTimeout(() => {
        this.recentlyCreatedFiles?.delete(filePath);
      }, 10000);

      
      const newFile = await this.app.vault.create(filePath, content);
      await forceMetadataCacheRefresh(this.app, newFile, 500);

      

      
      
      
      if (!suppressTradeChangedEvent) {
        window.setTimeout(() => {
          eventBus.publish('trade:changed', {
            action: 'created',
            filePaths: [filePath],
          });
        }, 500); 
      }

      
      await this.clearCacheWithPrefix('trade:');

      const runPostCreateTasks = async () => {
        
        if (
          this.plugin?.settings.trade.autoOpenCreatedTrades &&
          !options?.suppressAutoOpen
        ) {
          
          if (this.plugin?.processorManager) {
            await this.plugin.processorManager.getTradeNoteProcessor(); 
          }

          try {
            
            await this.plugin.openFile(filePath, true);

            
            window.setTimeout(() => {
              Promise.resolve(
                this.plugin?.tradeNoteProcessor?.renderActiveComponent()
              ).catch((error) => {
                console.error(
                  '[TradeService] Error rendering active trade component:',
                  error
                );
              });
            }, 50);
          } catch (error) {
            
            console.warn('Failed to auto-open created trade:', error);
          }
        }

        
        if (this.plugin?.settings.drc.autoCreateOnFirstTrade) {
          try {
            
            const tradeDate = new Date(data.entryTime);

            
            if (this.plugin.drcService) {
              
              const drcPath = this.plugin.drcService.getDRCNotePath(tradeDate);

              
              const drcExists = await this.app.vault.adapter.exists(drcPath);

              
              if (!drcExists) {
                await this.plugin.drcService.createDRC(tradeDate);
              }
            }
          } catch (error) {
            
            console.error('Failed to auto-create DRC for trade:', error);
          }
        }

        
        if (this.plugin?.settings.weekly?.autoCreateOnFirstTrade) {
          try {
            
            const tradeDate = new Date(data.entryTime);

            
            if (this.plugin.weeklyReviewService) {
              
              const weeklyReviewPath =
                this.plugin.weeklyReviewService.getWeeklyReviewPath(tradeDate);

              
              const weeklyReviewExists =
                await this.app.vault.adapter.exists(weeklyReviewPath);

              
              if (!weeklyReviewExists) {
                await this.plugin.weeklyReviewService.createWeeklyReview(
                  tradeDate
                );
              }
            }
          } catch (error) {
            
            console.error(
              'Failed to auto-create Weekly Review for trade:',
              error
            );
          }
        }

        
        if (this.plugin?.settings.monthly?.autoCreateOnFirstTrade) {
          try {
            
            const tradeDate = new Date(data.entryTime);

            
            if (this.plugin.monthlyReviewService) {
              
              const monthlyReviewPath =
                this.plugin.monthlyReviewService.getMonthlyReviewPath(
                  tradeDate
                );

              
              const monthlyReviewExists =
                await this.app.vault.adapter.exists(monthlyReviewPath);

              
              if (!monthlyReviewExists) {
                await this.plugin.monthlyReviewService.createMonthlyReview(
                  tradeDate
                );
              }
            }
          } catch (error) {
            
            console.error(
              'Failed to auto-create Monthly Review for trade:',
              error
            );
          }
        }

        
        if (this.plugin?.settings.quarterly?.autoCreateOnFirstTrade) {
          try {
            
            const tradeDate = new Date(data.entryTime);

            
            if (this.plugin.quarterlyReviewService) {
              
              const quarterlyReviewPath =
                await this.plugin.quarterlyReviewService.getQuarterlyReviewPath(
                  tradeDate
                );

              
              const quarterlyReviewExists =
                await this.app.vault.adapter.exists(quarterlyReviewPath);

              
              if (!quarterlyReviewExists) {
                await this.plugin.quarterlyReviewService.createQuarterlyReview(
                  tradeDate
                );
              }
            }
          } catch (error) {
            
            console.error(
              'Failed to auto-create Quarterly Review for trade:',
              error
            );
          }
        }

        
        if (this.plugin?.settings.yearly?.autoCreateOnFirstTrade) {
          try {
            
            const tradeDate = new Date(data.entryTime);

            
            const yearlyReviewService =
              await this.plugin.serviceManager.getYearlyReviewService();

            
            const yearlyReviewPath =
              await yearlyReviewService.getYearlyReviewPath(tradeDate);

            
            const yearlyReviewExists =
              await this.app.vault.adapter.exists(yearlyReviewPath);

            
            if (!yearlyReviewExists) {
              await yearlyReviewService.createYearlyReview(tradeDate);
            }
          } catch (error) {
            
            console.error(
              'Failed to auto-create Yearly Review for trade:',
              error
            );
          }
        }
      };

      if (!options?.suppressPostCreateTasks) {
        if (options?.deferPostCreateTasks) {
          window.setTimeout(() => {
            void runPostCreateTasks().catch((error) => {
              console.error('[TradeService] Post-create tasks failed:', error);
            });
          }, 0);
        } else {
          await runPostCreateTasks();
        }
      }

      return filePath;
    } catch (error) {
      console.error('Error creating trade:', error);
      throw error;
    }
  }

  
  public async getTrades(
    startDate: Date,
    endDate: Date,
    options?: { dateBasis?: AnalyticsDateBasis; fresh?: boolean }
  ): Promise<TFile[]> {
    
    
    await new Promise((resolve) => window.setTimeout(resolve, 50));
    
    const plugin = this.plugin;
    const tradingStartDate = plugin
      ? getTradingDay(startDate, plugin)
      : new Date(startDate);
    const tradingEndDate = plugin
      ? getTradingDay(endDate, plugin)
      : new Date(endDate);
    const dateBasis = options?.dateBasis ?? 'entry';

    
    tradingEndDate.setHours(23, 59, 59, 999);

    
    
    

    
    const recentMatchingFiles: TFile[] = [];
    if (this.recentlyCreatedFiles && this.recentlyCreatedFiles.size > 0) {
      for (const recentPath of this.recentlyCreatedFiles) {
        const recentFile = this.app.vault.getAbstractFileByPath(recentPath);
        if (recentFile instanceof TFile) {
          const cachedFrontmatter =
            this.app.metadataCache.getFileCache(recentFile)?.frontmatter;
          const frontmatter =
            cachedFrontmatter ?? (await this.readFrontmatter(recentFile));

          if (
            frontmatter?.type === 'trade' ||
            frontmatter?.type === 'backtest-trade'
          ) {
            const tradeForAnalytics = {
              ...frontmatter,
              _originalPnlWasNull:
                frontmatter.pnl === undefined || frontmatter.pnl === null,
            };
            const tradingDay = getTradeAnalyticsTradingDay(
              tradeForAnalytics,
              dateBasis,
              plugin
            );
            const realizedEvents = getTradeRealizedPnlEvents(
              tradeForAnalytics,
              dateBasis,
              plugin
            );
            if (
              (tradingDay &&
                tradingDay >= tradingStartDate &&
                tradingDay <= tradingEndDate) ||
              realizedEvents.some(
                (event) =>
                  event.tradingDay >= tradingStartDate &&
                  event.tradingDay <= tradingEndDate
              )
            ) {
              recentMatchingFiles.push(recentFile);
            }
          }
        }
      }
    }

    const indexReady = this.indexManager?.isIndexReady('trades') === true;
    const indexDirty = this.indexManager?.isDirtyIndex('trades') === true;
    const canUseIndex =
      !options?.fresh &&
      dateBasis === 'entry' &&
      this.canUseTradeIndexes() &&
      (indexReady || indexDirty);

    
    if (canUseIndex) {
      try {
        
        const indexResults = this.queryIndex('trades', {}, {});

        if (indexReady) {
          
          const matchingEntries = indexResults.filter((entry) => {
            try {
              
              const entryTimeValue = entry.values.entryTime;
              if (!entryTimeValue) return false;

              const entryDate = parseTradeTimestampValue(entryTimeValue);

              if (!entryDate) return false;

              
              const tradingDay = plugin
                ? getTradingDay(entryDate, plugin)
                : entryDate;

              
              return (
                tradingDay >= tradingStartDate && tradingDay <= tradingEndDate
              );
            } catch {
              return false;
            }
          });

          
          if (matchingEntries.length > 0) {
            
            const indexedFiles = matchingEntries.map((entry) => entry.file);

            

            
            const allFiles = [...indexedFiles];
            const allFilePaths = new Set(allFiles.map((file) => file.path));
            for (const recentFile of recentMatchingFiles) {
              if (!allFilePaths.has(recentFile.path)) {
                allFiles.push(recentFile);
                allFilePaths.add(recentFile.path);
              }
            }
            return allFiles;
          }

          
          if (recentMatchingFiles.length > 0) {
            return recentMatchingFiles;
          }
        }
      } catch (error) {
        console.warn('Error using index for date range query:', error);
        
      }
    }

    

    
    

    
    const allMarkdownFiles = this.getTrackedMarkdownFiles();
    const allFiles = allMarkdownFiles.filter((file) => {
      
      return (
        ((file.path.startsWith(this.folderPathService.journalFolderPath) &&
          file.path.includes(`/${this.tradesFolder}/`)) ||
          file.path.startsWith(this.tradesFolder)) &&
        file.path.endsWith('.md')
      );
    });

    
    
    const allFilePaths = new Set(allFiles.map((file) => file.path));
    for (const recentFile of recentMatchingFiles) {
      if (!allFilePaths.has(recentFile.path)) {
        allFiles.push(recentFile);
        allFilePaths.add(recentFile.path);
      }
    }

    
    const matchingFiles: TFile[] = [];

    for (const file of allFiles) {
      try {
        const cachedFrontmatter =
          this.app.metadataCache.getFileCache(file)?.frontmatter;
        const frontmatter =
          cachedFrontmatter ?? (await this.readFrontmatter(file));

        if (
          frontmatter?.type !== 'trade' &&
          frontmatter?.type !== 'backtest-trade'
        ) {
          continue;
        }

        const tradeForAnalytics = {
          ...frontmatter,
          _originalPnlWasNull:
            frontmatter.pnl === undefined || frontmatter.pnl === null,
        };
        const tradingDay = getTradeAnalyticsTradingDay(
          tradeForAnalytics,
          dateBasis,
          this.plugin
        );
        const realizedEvents = getTradeRealizedPnlEvents(
          tradeForAnalytics,
          dateBasis,
          this.plugin
        );

        if (
          (tradingDay &&
            tradingDay >= tradingStartDate &&
            tradingDay <= tradingEndDate) ||
          realizedEvents.some(
            (event) =>
              event.tradingDay >= tradingStartDate &&
              event.tradingDay <= tradingEndDate
          )
        ) {
          matchingFiles.push(file);
        }
      } catch (error) {
        console.warn(`Error checking trade file ${file.path}:`, error);
      }
    }

    return matchingFiles;
  }

  
  public async readTradeContent(file: TFile): Promise<string> {
    return this.app.vault.read(file);
  }

  

  public async extractTradeData(
    file: TFile
  ): Promise<Record<string, unknown> | null> {
    try {
      
      const cachedFrontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      const frontmatter =
        cachedFrontmatter && typeof cachedFrontmatter === 'object'
          ? (cachedFrontmatter as Record<string, unknown>)
          : null;

      const isPathBasedLegacyTrade =
        this.folderPathService.isJournalPath(file.path) &&
        isTradeIdentityEligibleNote(frontmatter, file.path);

      
      if (
        !frontmatter ||
        (frontmatter.type !== 'trade' &&
          frontmatter.type !== 'backtest-trade' &&
          !isPathBasedLegacyTrade)
      ) {
        return null;
      }

      
      const isExtractTradeOpen = isTradeOpenWithContext({
        tradeStatus:
          typeof frontmatter.tradeStatus === 'string'
            ? frontmatter.tradeStatus
            : undefined,
        exitTime:
          typeof frontmatter.exitTime === 'string' ||
          frontmatter.exitTime instanceof Date
            ? frontmatter.exitTime
            : undefined,
        pnl: this.parseFiniteNumber(frontmatter.pnl),
        useDirectPnLInput: isDirectPnLInputEnabled(
          frontmatter.useDirectPnLInput
        ),
        exits: normalizeTradeStatusExecutions(frontmatter.exits),
        entries: normalizeTradeStatusExecutions(frontmatter.entries),
      });

      const parsedDirectPnL = this.parseFiniteNumber(frontmatter.directPnL);

      const customTags = normalizeStringArray(frontmatter.tags);

      const customFieldDefinitions =
        this.plugin?.customFieldsService?.getFields() || [];
      const customFields: CustomFieldValues = {};
      const knownCustomFieldKeys = new Set<string>();

      for (const field of customFieldDefinitions) {
        const fieldKey = field.fieldKey || field.id;
        knownCustomFieldKeys.add(fieldKey);
        knownCustomFieldKeys.add(field.id);
        const fieldValue =
          frontmatter[fieldKey] !== undefined
            ? frontmatter[fieldKey]
            : frontmatter[field.id];
        if (fieldValue !== undefined) {
          customFields[field.id] = fieldValue;
        }
      }

      const knownTradeFrontmatterKeys = new Set<string>([
        'position',
        'type',
        'tradeId',
        'schemaVersion',
        'tradeRevision',
        'backendTradeId',
        'csvImportId',
        'legacyCsvImportIds',
        'sourceRows',
        'orderId',
        'executionLedgerVersion',
        'canonicalExecutionMigrationVersion',
        'executionIds',
        'instrument',
        'direction',
        'tradeStatus',
        'entryTime',
        'exitTime',
        'entryPrice',
        'exitPrice',
        'hasExplicitExitPrice',
        'positionSize',
        'entries',
        'exits',
        'dividends',
        'pnl',
        'rMultiple',
        'commission',
        'hasExplicitCommission',
        'commissionType',
        'fees',
        'swap',
        'rebate',
        'riskAmount',
        'stopLoss',
        'mae',
        'mfe',
        'maePrice',
        'mfePrice',
        'account',
        'accountId',

        'setup',
        'setupIds',
        'mistake',
        'mistakeIds',
        'thesis',
        'images',
        'tags',
        'assetType',
        'exchange',
        'optionType',
        'strikePrice',
        'expirationDate',
        'contractSize',
        'dollarPerPoint',
        'tickSize',
        'tickValue',
        'lotSize',
        'pipValue',
        'pipSize',
        'cryptoExchange',
        'leverageRatio',
        'useDirectPnLInput',
        'directPnL',
        'reviewed',
        'reviewedAt',
        'lossReview',
        'currency',
        'brokerBaseCurrencyPnl',
        'brokerBaseCurrency',
        'brokerBaseCurrencyPnlSource',
        'mtComment',
      ]);

      for (const [key, value] of Object.entries(frontmatter)) {
        if (
          value !== undefined &&
          !knownTradeFrontmatterKeys.has(key) &&
          !knownCustomFieldKeys.has(key)
        ) {
          customFields[key] = value;
        }
      }

      const normalizedExecution = normalizeTradeExecution(frontmatter, {
        deriveMissingExplicitness: true,
      });
      const totalEntrySize = normalizedExecution.entries.reduce(
        (sum, entry) =>
          entry.size !== null && entry.size > 0 ? sum + entry.size : sum,
        0
      );
      const extractedEntryTime =
        normalizedExecution.firstEntryTime ??
        (await this.extractFirstCanonicalEntryTimeFromContent(file));
      const extractedExitTime = normalizedExecution.lastExitTime;

      
      return {
        path: file.path,
        tradeId: getTradeIdValue(frontmatter.tradeId),
        schemaVersion:
          frontmatter.schemaVersion !== undefined
            ? Number(frontmatter.schemaVersion)
            : undefined,
        tradeRevision: this.getTradeRevisionValue(frontmatter.tradeRevision),
        backendTradeId: this.parseFiniteNumber(frontmatter.backendTradeId),
        csvImportId:
          typeof frontmatter.csvImportId === 'string'
            ? frontmatter.csvImportId
            : undefined,
        legacyCsvImportIds:
          frontmatter.legacyCsvImportIds &&
          Array.isArray(frontmatter.legacyCsvImportIds)
            ? frontmatter.legacyCsvImportIds.map((value: unknown) =>
                safeString(value)
              )
            : undefined,
        sourceRows:
          frontmatter.sourceRows && Array.isArray(frontmatter.sourceRows)
            ? frontmatter.sourceRows
                .map((value: unknown) => Number(value))
                .filter((value: number) => Number.isFinite(value))
            : undefined,
        orderId:
          typeof frontmatter.orderId === 'string'
            ? frontmatter.orderId
            : undefined,
        instrument:
          typeof frontmatter.instrument === 'string'
            ? frontmatter.instrument
            : 'Unknown',
        
        
        
        direction:
          typeof frontmatter.direction === 'string'
            ? frontmatter.direction
            : frontmatter.assetType === 'options' &&
                typeof frontmatter.optionType === 'string'
              ? frontmatter.optionType
              : 'Unknown',
        tradeStatus:
          typeof frontmatter.tradeStatus === 'string'
            ? frontmatter.tradeStatus
            : isExtractTradeOpen
              ? 'OPEN'
              : 'CLOSED',
        entryPrice: normalizedExecution.weightedEntryPrice ?? 0,
        hasExplicitExitPrice: normalizedExecution.hasExplicitExitPrice ?? false,
        exitPrice: isExtractTradeOpen
          ? null
          : (normalizedExecution.resolvedExitPrice ?? 0),
        positionSize: totalEntrySize || normalizedExecution.positionSize || 0,
        pnl:
          frontmatter.pnl != null && frontmatter.pnl !== ''
            ? (this.parseFiniteNumber(frontmatter.pnl) ?? 0)
            : isExtractTradeOpen
              ? null
              : 0,
        originalPnl: this.parseFiniteNumber(frontmatter.pnl),
        originalRMultiple: this.parseFiniteNumber(frontmatter.rMultiple),
        commission: this.parseFiniteNumber(frontmatter.commission) ?? 0,
        hasExplicitCommission: frontmatter.hasExplicitCommission === true,
        commissionType:
          frontmatter.commissionType === 'percentage' ||
          frontmatter.commissionType === 'fixed'
            ? frontmatter.commissionType
            : undefined,
        swap: this.parseFiniteNumber(frontmatter.swap) ?? 0,
        fees: this.parseFiniteNumber(frontmatter.fees) ?? 0,
        rebate:
          frontmatter.rebate != null && frontmatter.rebate !== ''
            ? this.parseFiniteNumber(frontmatter.rebate)
            : undefined,
        riskAmount:
          frontmatter.riskAmount != null && frontmatter.riskAmount !== ''
            ? this.parseFiniteNumber(frontmatter.riskAmount)
            : undefined,
        stopLoss:
          frontmatter.stopLoss != null && frontmatter.stopLoss !== ''
            ? this.parseFiniteNumber(frontmatter.stopLoss)
            : undefined,
        mae:
          frontmatter.mae != null && frontmatter.mae !== ''
            ? this.parseFiniteNumber(frontmatter.mae)
            : undefined,
        mfe:
          frontmatter.mfe != null && frontmatter.mfe !== ''
            ? this.parseFiniteNumber(frontmatter.mfe)
            : undefined,
        maePrice:
          frontmatter.maePrice != null && frontmatter.maePrice !== ''
            ? this.parseFiniteNumber(frontmatter.maePrice)
            : undefined,
        mfePrice:
          frontmatter.mfePrice != null && frontmatter.mfePrice !== ''
            ? this.parseFiniteNumber(frontmatter.mfePrice)
            : undefined,
        entryTime: extractedEntryTime ?? new Date(),
        exitTime: isExtractTradeOpen
          ? null
          : (extractedExitTime ?? extractedEntryTime ?? new Date()),

        
        entries: normalizedExecution.entries.map((entry) => ({
          time: entry.time,
          price: entry.price ?? 0,
          size: entry.size ?? 0,
          ...(entry.notional !== undefined ? { notional: entry.notional } : {}),
        })),
        exits: normalizedExecution.exits.map((exit) => ({
          time: exit.time,
          price: exit.price ?? 0,
          size: exit.size ?? 0,
          hasExplicitPrice: exit.hasExplicitPrice ?? false,
          ...(exit.notional !== undefined ? { notional: exit.notional } : {}),
        })),
        dividends:
          parseTradeDividendTransactions(frontmatter.dividends, {
            parseTime: (value) => (value ? new Date(safeString(value)) : null),
          })?.map((dividend) => ({
            time: dividend.time,
            amount: dividend.amount ?? 0,
          })) || [],

        
        
        setup: normalizeStringArray(frontmatter.setup).filter(
          (value) => !value.includes('/')
        ),
        setupIds: normalizeStringArray(frontmatter.setupIds).filter(
          (value) => !value.includes('/')
        ),
        mistake: normalizeStringArray(frontmatter.mistake).filter(
          (value) => !value.includes('/')
        ),
        mistakeIds: normalizeStringArray(frontmatter.mistakeIds).filter(
          (value) => !value.includes('/')
        ),
        account: frontmatter.account,

        accountId: frontmatter.accountId,
        accountRefs: normalizeTradeAccountIdentity(frontmatter, {
          resolveAccountIdDisplayName: (accountId) =>
            this.plugin?.settings.backendIntegration?.accountMapping?.[
              accountId
            ],
        }).refs,
        useDirectPnLInput: isDirectPnLInputEnabled(
          frontmatter.useDirectPnLInput
        ),
        directPnL:
          parsedDirectPnL !== undefined && Number.isFinite(parsedDirectPnL)
            ? parsedDirectPnL
            : undefined,
        thesis: frontmatter.thesis,
        images: Array.isArray(frontmatter.images)
          ? frontmatter.images.filter(
              (image): image is string => typeof image === 'string'
            )
          : [],
        customTags,
        tags: customTags,
        assetType:
          typeof frontmatter.assetType === 'string'
            ? frontmatter.assetType
            : undefined,
        optionType:
          frontmatter.optionType === 'call' || frontmatter.optionType === 'put'
            ? frontmatter.optionType
            : undefined,
        strikePrice: this.parseFiniteNumber(frontmatter.strikePrice),
        expirationDate:
          typeof frontmatter.expirationDate === 'string' ||
          typeof frontmatter.expirationDate === 'number' ||
          frontmatter.expirationDate instanceof Date
            ? new Date(frontmatter.expirationDate)
            : undefined,
        contractSize: this.parseFiniteNumber(frontmatter.contractSize),
        exchange:
          typeof frontmatter.exchange === 'string'
            ? frontmatter.exchange
            : undefined,
        dollarPerPoint: this.parseFiniteNumber(frontmatter.dollarPerPoint),
        tickSize: this.parseFiniteNumber(frontmatter.tickSize),
        tickValue: this.parseFiniteNumber(frontmatter.tickValue),
        lotSize: this.parseFiniteNumber(frontmatter.lotSize),
        pipValue: this.parseFiniteNumber(frontmatter.pipValue),
        pipSize: this.parseFiniteNumber(frontmatter.pipSize),
        cryptoExchange:
          typeof frontmatter.cryptoExchange === 'string'
            ? frontmatter.cryptoExchange
            : undefined,
        leverageRatio: this.parseFiniteNumber(frontmatter.leverageRatio),
        lossReview: normalizeLossReviewData(frontmatter.lossReview),
        reviewed: frontmatter.reviewed === true,
        reviewedAt:
          typeof frontmatter.reviewedAt === 'string'
            ? frontmatter.reviewedAt
            : undefined,
        currency:
          typeof frontmatter.currency === 'string'
            ? frontmatter.currency
            : undefined,
        brokerBaseCurrencyPnl: this.parseFiniteNumber(
          frontmatter.brokerBaseCurrencyPnl
        ),
        brokerBaseCurrency:
          typeof frontmatter.brokerBaseCurrency === 'string'
            ? frontmatter.brokerBaseCurrency
            : undefined,
        brokerBaseCurrencyPnlSource:
          typeof frontmatter.brokerBaseCurrencyPnlSource === 'string'
            ? frontmatter.brokerBaseCurrencyPnlSource
            : undefined,
        mtComment: normalizeExtractedMTComment(frontmatter.mtComment),
        customFields:
          Object.keys(customFields).length > 0 ? customFields : undefined,
        executionLedgerVersion:
          frontmatter.executionLedgerVersion !== undefined
            ? Number(frontmatter.executionLedgerVersion)
            : undefined,
        executionIds:
          frontmatter.executionIds && Array.isArray(frontmatter.executionIds)
            ? frontmatter.executionIds.map((value: unknown) =>
                safeString(value)
              )
            : undefined,
      };
    } catch (error) {
      console.error(`Error extracting trade data from ${file.path}:`, error);
      return null;
    }
  }

  private async extractFirstCanonicalEntryTimeFromContent(
    file: TFile
  ): Promise<Date | null> {
    try {
      const content = await this.app.vault.cachedRead(file);
      const entriesMatch = content.match(/^entries:\s*\n([\s\S]*?)(?:\n\S|$)/m);
      const timeMatch = entriesMatch?.[1]?.match(/^\s+-\s+time:\s*(.+)$/m);
      const parsed = timeMatch?.[1] ? new Date(timeMatch[1].trim()) : null;
      return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
    } catch {
      return null;
    }
  }

  private getExistingEntryTimeForRelocation(
    frontmatter: Record<string, unknown>
  ): Date | string | undefined {
    const entryTime = getDateOrString(frontmatter.entryTime);
    if (entryTime !== undefined) {
      return entryTime;
    }

    return (
      normalizeTradeExecution(frontmatter, {
        deriveMissingExplicitness: true,
      }).firstEntryTime ?? undefined
    );
  }

  
  public async updateLossReview(
    filePath: string,
    lossReviewData: LossReviewData,
    source: string = 'unknown'
  ): Promise<void> {
    try {
      
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!file || !(file instanceof TFile)) {
        throw new Error(`Invalid file path: ${filePath}`);
      }

      let shouldPublishCommittedChange = false;

      await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        if (!isRecord(frontmatter)) return;
        const frontmatterRecord = frontmatter;
        if (isTradeIdentityEligibleNote(frontmatterRecord, file.path)) {
          const existingIdentity = getTradeIdentityFields(frontmatterRecord);
          const tradeId =
            existingIdentity.tradeId ??
            buildTradeIdentityFields(frontmatterRecord).tradeId;
          const schemaVersion = Math.max(
            existingIdentity.schemaVersion ?? 0,
            this.getTradeSchemaVersion()
          );
          const tradeRevision = this.tradeReadModel.getNextRevision(
            tradeId,
            this.getTradeRevisionValue(frontmatterRecord.tradeRevision) ?? 0
          );

          frontmatterRecord.tradeId = tradeId;
          frontmatterRecord.schemaVersion = schemaVersion;
          frontmatterRecord.tradeRevision = tradeRevision;
          shouldPublishCommittedChange = true;
        }

        
        frontmatterRecord.lossReview = lossReviewData;
      });

      
      await forceMetadataCacheRefresh(this.app, file);
      if (shouldPublishCommittedChange) {
        await this.publishCanonicalTradeCommit(filePath, 'updated', {
          suppressLegacyTradeChanged: true,
        });
      }

      
      if (source !== 'user-input') {
        
        
        eventBus.publish('trade:changed', {
          action: 'loss-review-updated',
          filePaths: [filePath],
        });
      }
    } catch (error) {
      console.error(
        `[TradeService] Error updating loss review for ${filePath}:`,
        error
      );
      throw error;
    }
  }

  
  public async updateTradeReviewStatus(
    filePath: string,
    reviewed: boolean,
    reviewedAt: string,
    _source: string = 'unknown'
  ): Promise<void> {
    try {
      
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!file || !(file instanceof TFile)) {
        throw new Error(`Invalid file path: ${filePath}`);
      }

      let shouldPublishCommittedChange = false;

      await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        if (!isRecord(frontmatter)) return;
        const frontmatterRecord = frontmatter;
        if (isTradeIdentityEligibleNote(frontmatterRecord, file.path)) {
          const existingIdentity = getTradeIdentityFields(frontmatterRecord);
          const tradeId =
            existingIdentity.tradeId ??
            buildTradeIdentityFields(frontmatterRecord).tradeId;
          const schemaVersion = Math.max(
            existingIdentity.schemaVersion ?? 0,
            this.getTradeSchemaVersion()
          );
          const tradeRevision = this.tradeReadModel.getNextRevision(
            tradeId,
            this.getTradeRevisionValue(frontmatterRecord.tradeRevision) ?? 0
          );

          frontmatterRecord.tradeId = tradeId;
          frontmatterRecord.schemaVersion = schemaVersion;
          frontmatterRecord.tradeRevision = tradeRevision;
          shouldPublishCommittedChange = true;
        }

        
        frontmatterRecord.reviewed = reviewed;
        frontmatterRecord.reviewedAt = reviewedAt;
      });

      
      await forceMetadataCacheRefresh(this.app, file);
      if (shouldPublishCommittedChange) {
        await this.publishCanonicalTradeCommit(filePath, 'updated', {
          suppressLegacyTradeChanged: true,
        });
      }

      
      eventBus.publish('trade:changed', {
        action: 'review-status-updated',
        filePaths: [filePath],
      });
    } catch (error) {
      console.error(
        `[TradeService] Error updating review status for ${filePath}:`,
        error
      );
      throw error;
    }
  }

  public async migrateLegacyExecutionFields(options?: {
    dryRun?: boolean;
  }): Promise<LegacyExecutionMigrationResult> {
    const result: LegacyExecutionMigrationResult = {
      scanned: 0,
      migrated: 0,
      skipped: 0,
      failed: 0,
      filePaths: [],
      errors: [],
    };

    const files = await this.getTradeFiles();
    for (const file of files) {
      const cachedFrontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      const frontmatter =
        cachedFrontmatter ?? (await this.readFrontmatter(file));
      if (getTradeIdentityNoteType(frontmatter, file.path) !== 'trade') {
        continue;
      }

      result.scanned += 1;

      if (!cachedFrontmatter && Object.keys(frontmatter).length === 0) {
        result.failed += 1;
        result.errors.push({
          filePath: file.path,
          message:
            'Unable to read trade frontmatter before canonical execution migration',
        });
        continue;
      }

      const preview = { ...(frontmatter || {}) };
      if (!backfillCanonicalExecutionFrontmatter(preview)) {
        result.skipped += 1;
        continue;
      }

      if (options?.dryRun) {
        result.migrated += 1;
        result.filePaths.push(file.path);
        continue;
      }

      try {
        await this.app.fileManager.processFrontMatter(file, (current) => {
          if (!isRecord(current)) return;
          backfillCanonicalExecutionFrontmatter(current);
        });
        await forceMetadataCacheRefresh(this.app, file);
        result.migrated += 1;
        result.filePaths.push(file.path);
      } catch (error) {
        result.failed += 1;
        result.errors.push({
          filePath: file.path,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    if (
      !options?.dryRun &&
      result.failed === 0 &&
      this.plugin?.settings.trade
    ) {
      this.plugin.settings.trade.canonicalExecutionMigrationVersion =
        CANONICAL_EXECUTION_MIGRATION_VERSION;
      await this.plugin.saveSettings();
    }

    if (!options?.dryRun && result.migrated > 0) {
      eventBus.publish('trade:changed', {
        action: 'updated',
        filePaths: result.filePaths,
      });
    }

    return result;
  }

  
  private async getTradeFiles(allMarkdownFiles?: TFile[]): Promise<TFile[]> {
    
    const allFiles = allMarkdownFiles || this.getTrackedMarkdownFiles();

    
    const existenceChecks = await Promise.all(
      allFiles.map(async (file) => {
        try {
          const exists = await this.app.vault.adapter.exists(file.path);
          return { file, exists };
        } catch (error) {
          
          console.warn(
            `Error checking file existence for ${file.path}:`,
            error
          );
          return { file, exists: false };
        }
      })
    );

    
    const existingFiles = existenceChecks
      .filter(({ exists }) => exists)
      .map(({ file }) => file);

    
    const tradeFiles = existingFiles.filter((file) => {
      
      if (!this.folderPathService.isJournalPath(file.path)) {
        return false;
      }

      
      const cachedFrontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      const frontmatter =
        cachedFrontmatter && typeof cachedFrontmatter === 'object'
          ? (cachedFrontmatter as Record<string, unknown>)
          : null;

      if (!frontmatter) {
        
        const isTradePath = file.path.includes(`/${this.tradesFolder}/`);
        if (isTradePath) {
          return true;
        }
        return false;
      }

      
      if (frontmatter?.isMissedTrade) {
        return false;
      }

      
      if (
        frontmatter?.type === 'trade' ||
        frontmatter?.type === 'backtest-trade'
      ) {
        return true;
      }

      
      const isTradePath = file.path.includes(`/${this.tradesFolder}/`);
      if (isTradePath) {
        return true;
      }

      return false;
    });

    return tradeFiles;
  }

  
  public sanitizeTickerForFilename(ticker: string): string {
    return sanitizeTradeSymbolForFilename(ticker);
  }

  
  public getWeekOfMonth(date: Date): string {
    
    return getISOWeekString(date);
  }

  
  private areDatesOnSameDay(date1: Date, date2: Date): boolean {
    
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      return false;
    }
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  
  public async getTradePathComponents(date: Date): Promise<{
    year: string;
    month: string;
    weekOfMonth: string;
    formattedDate: string;
  }> {
    const year = date.getFullYear().toString();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const weekOfMonth = getISOWeekString(date);

    
    const dateFormat = this.plugin?.settings.trade.dateFormat || 'DDMMYY';
    const formattedDate = this.formatDateForFilename(date, dateFormat);

    return {
      year,
      month,
      weekOfMonth,
      formattedDate,
    };
  }

  
  private getTradeFilePath(data: TradeData): Promise<string> {
    const ticker = data.instrument
      ? this.sanitizeTickerForFilename(data.instrument)
      : 'UNKNOWN';

    return this.generateNewTradePath(
      ticker,
      data.entryTime instanceof Date
        ? data.entryTime
        : new Date(String(data.entryTime))
    );
  }

  
  public async generateNewTradePath(
    ticker: string,
    date: Date
  ): Promise<string> {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new Error(
        `Invalid date passed to generateNewTradePath: ${String(date)}`
      );
    }

    const sanitizedTicker = this.sanitizeTickerForFilename(ticker);
    const tradeNumber = await this.getTradeNumberForDay(sanitizedTicker, date);

    return buildTradeFilePath({
      folderPathService: this.folderPathService,
      date,
      symbol: sanitizedTicker,
      tradeNumber,
      dateFormat: this.plugin?.settings.trade.dateFormat || 'DDMMYY',
      tradesFolder: this.tradesFolder,
    });
  }

  
  public async getTradeNumberForDay(
    ticker: string,
    date: Date
  ): Promise<number> {
    
    const targetFolder = this.getTargetFolderPath(date);

    
    const files = await this.listFilesInFolder(targetFolder);

    
    const dateFormat = this.plugin?.settings.trade.dateFormat || 'DDMMYY';
    const formattedDate = this.formatDateForFilename(date, dateFormat);

    
    const escapedTicker = ticker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `^${escapedTicker}-${formattedDate}-T(\\d+)\\.md$`
    );

    
    let maxTradeNumber = 0;
    for (const file of files) {
      const filename = file.split('/').pop() || '';
      const match = pattern.exec(filename);
      if (match) {
        const tradeNumber = parseInt(match[1], 10);
        maxTradeNumber = Math.max(maxTradeNumber, tradeNumber);
      }
    }

    const nextTradeNumber = maxTradeNumber + 1;
    return nextTradeNumber;
  }

  
  private async listFilesInFolder(folderPath: string): Promise<string[]> {
    try {
      
      const exists = await this.app.vault.adapter.exists(folderPath);
      if (!exists) {
        
        try {
          await this.app.vault.adapter.mkdir(folderPath);
          return []; 
        } catch (createError) {
          console.warn(`Error creating folder ${folderPath}:`, createError);
          return [];
        }
      }

      
      const files = await this.app.vault.adapter.list(folderPath);
      return files.files || [];
    } catch (error) {
      console.warn(`Error listing files in folder ${folderPath}:`, error);
      return [];
    }
  }

  
  private async ensureDirectoryExists(path: string): Promise<void> {
    
    const normalized = normalizePath(path);
    const parts = normalized.split('/');
    let currentPath = '';

    for (const part of parts) {
      if (!part) continue;
      currentPath += (currentPath ? '/' : '') + part;

      if (!this.app.vault.getAbstractFileByPath(currentPath)) {
        try {
          await this.app.vault.createFolder(currentPath);
        } catch (error: unknown) {
          
          
          if (!this.app.vault.getAbstractFileByPath(currentPath)) {
            
            throw error;
          }
          
        }
      }
    }
  }

  
  public getTargetFolderPath(date: Date): string {
    return buildTradeDirectoryPath(
      this.folderPathService,
      date,
      this.tradesFolder
    );
  }

  
  public async deleteImage(imagePath: string): Promise<boolean> {
    try {
      const normalizedPath = normalizePath(imagePath);
      const exists = await this.app.vault.adapter.exists(normalizedPath);

      if (exists) {
        await this.app.vault.adapter.remove(normalizedPath);
        return true;
      } else {
        
        return false;
      }
    } catch (error) {
      
      if (getErrorCode(error) === 'ENOENT') {
        return false;
      }
      console.error(`Failed to delete image ${imagePath}:`, error);
      return false;
    }
  }

  
  public async deleteEmptyFolder(folderPath: string): Promise<boolean> {
    try {
      const normalizedPath = normalizePath(folderPath);
      const exists = await this.app.vault.adapter.exists(normalizedPath);

      if (!exists) {
        
        return false;
      }

      
      const { files = [], folders = [] } =
        await this.app.vault.adapter.list(normalizedPath);

      
      if (files.length === 0 && folders.length === 0) {
        await this.app.vault.adapter.rmdir(normalizedPath, false);
        return true;
      } else {
        
        return false;
      }
    } catch (error) {
      
      if (getErrorCode(error) === 'ENOENT') {
        return false;
      }
      console.error(`Failed to delete folder ${folderPath}:`, error);
      return false;
    }
  }

  
  public formatDateForFilename(date: Date, format: string): string {
    return formatTradeDateForFilename(date, format);
  }

  
  private generateTradeContent(data: TradeData): string {
    const plan = planTradeMutation({
      mode: 'create',
      data,
      defaultRiskAmount: this.plugin?.settings.trade.defaultRiskAmount,
    });
    const normalizedData = plan.normalizedData;
    const identityFields = buildTradeIdentityFields(normalizedData);
    const frontmatterData = buildTradeFrontmatter(
      {
        ...normalizedData,
        tradeId: identityFields.tradeId,
        schemaVersion: identityFields.schemaVersion,
      },
      {
        tradeStatus: plan.isOpen ? 'OPEN' : 'CLOSED',
        pnl: plan.pnl,
        rMultiple: plan.rMultiple,
        customFieldDefinitions:
          this.plugin?.customFieldsService?.getFields() || [],
      }
    );
    const frontmatterYAML = serializeTradeFrontmatter(frontmatterData, {
      arrayStyle: 'block',
      scalarStyle: 'minimal',
    });

    return createTradeNotesDocument(frontmatterYAML, normalizedData.notes);
  }

  
  private extractDateFromTradePath(filePath: string): Date | null {
    try {
      
      
      const match = filePath.match(/([A-Z]+)-(\d{6,8})-[TMB]\d+\.md$/);
      if (!match) return null;

      const dateStr = match[2];

      if (dateStr.length === 8) {
        
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1; 
        const day = parseInt(dateStr.substring(6, 8));
        return new Date(year, month, day);
      } else if (dateStr.length === 6) {
        
        const day = parseInt(dateStr.substring(0, 2));
        const month = parseInt(dateStr.substring(2, 4)) - 1; 
        const year = 2000 + parseInt(dateStr.substring(4, 6)); 
        return new Date(year, month, day);
      }

      return null;
    } catch (error) {
      console.error('Error extracting date from trade path:', error);
      return null;
    }
  }

  public async repairTradeIdentityIntegrity(): Promise<{
    scanned: number;
    backfilled: number;
    duplicatesRepaired: number;
  }> {
    const tradeFiles = this.app.vault.getMarkdownFiles().filter((file) => {
      const cachedFrontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      const frontmatter =
        cachedFrontmatter && typeof cachedFrontmatter === 'object'
          ? (cachedFrontmatter as Record<string, unknown>)
          : null;

      return (
        this.folderPathService.isJournalPath(file.path) &&
        isTradeIdentityEligibleNote(frontmatter, file.path)
      );
    });

    const seenTradeIds = new Map<string, TradeRef>();
    let backfilled = 0;
    let duplicatesRepaired = 0;
    const updatedTradeFiles: string[] = [];
    const updatedBacktestFiles: string[] = [];

    for (const file of tradeFiles) {
      let changed = false;
      let duplicateRepair = false;
      let updatedFileType: 'trade' | 'backtest-trade' | null =
        getTradeIdentityNoteType(
          (this.app.metadataCache.getFileCache(file)?.frontmatter as
            | Record<string, unknown>
            | null
            | undefined) ?? null,
          file.path
        );

      await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        if (!isRecord(frontmatter)) return;
        const frontmatterRecord = frontmatter;
        updatedFileType = getTradeIdentityNoteType(
          frontmatterRecord,
          file.path
        );
        if (!updatedFileType) {
          return;
        }

        const currentTradeId = getTradeIdValue(frontmatterRecord.tradeId);
        const duplicateOwner = currentTradeId
          ? seenTradeIds.get(currentTradeId)
          : undefined;

        const identityResult = ensureTradeIdentityFrontmatter(
          frontmatterRecord,
          {
            forceNewTradeId:
              duplicateOwner !== undefined &&
              duplicateOwner.filePath !== file.path,
          }
        );

        if (!currentTradeId) {
          backfilled += 1;
        }

        if (
          duplicateOwner !== undefined &&
          duplicateOwner.filePath !== file.path &&
          identityResult.tradeId !== currentTradeId
        ) {
          duplicatesRepaired += 1;
          duplicateRepair = true;
        }

        changed = identityResult.changed;
        seenTradeIds.set(identityResult.tradeId, {
          tradeId: identityResult.tradeId,
          filePath: file.path,
          backendTradeId:
            typeof frontmatterRecord.backendTradeId === 'number'
              ? frontmatterRecord.backendTradeId
              : undefined,
        });
      });

      if (changed || duplicateRepair) {
        await forceMetadataCacheRefresh(this.app, file);
        if (updatedFileType === 'backtest-trade') {
          updatedBacktestFiles.push(file.path);
        } else {
          updatedTradeFiles.push(file.path);
        }
      }
    }

    if (updatedTradeFiles.length > 0) {
      await this.clearCacheWithPrefix('trade:');
      eventBus.publish('trade:changed', {
        action: 'updated',
        filePaths: updatedTradeFiles,
        timestamp: Date.now(),
      });
    }

    if (updatedBacktestFiles.length > 0) {
      await this.clearCacheWithPrefix('backtest-trade:');
      updatedBacktestFiles.forEach((filePath) => {
        eventBus.publish('backtest-trade:changed', {
          action: 'updated',
          filePath,
          timestamp: Date.now(),
        });
      });
    }

    return {
      scanned: tradeFiles.length,
      backfilled,
      duplicatesRepaired,
    };
  }

  
  public async handleTradeDeletion(
    filePath: string,
    deletedFile?: TFile
  ): Promise<void> {
    try {
      
      

      const deletedEntry = this.tradeReadModel.getEntryForPath(filePath);
      const deletedFrontmatter = deletedFile
        ? this.app.metadataCache.getFileCache(deletedFile)?.frontmatter
        : null;
      const deletedIdentity = getTradeIdentityFields(
        (deletedFrontmatter as Record<string, unknown> | null | undefined) ??
          null
      );
      const deletedTradeRevision = this.getTradeRevisionValue(
        deletedFrontmatter?.tradeRevision
      );

      const committedDelete = deletedEntry
        ? {
            tradeId: deletedEntry.tradeId,
            revision:
              Math.max(deletedEntry.revision, deletedTradeRevision ?? 0) + 1,
            schemaVersion: Math.max(
              deletedEntry.schemaVersion,
              deletedIdentity.schemaVersion ?? 0,
              this.getTradeSchemaVersion()
            ),
          }
        : deletedIdentity.tradeId
          ? {
              tradeId: deletedIdentity.tradeId,
              revision: (deletedTradeRevision ?? 0) + 1,
              schemaVersion:
                deletedIdentity.schemaVersion ?? this.getTradeSchemaVersion(),
            }
          : null;

      this.tradeReadModel.forgetPath(filePath);

      if (committedDelete) {
        this.tradeEventBridge.publishCommittedChange(
          {
            change: {
              action: 'deleted',
              tradeId: committedDelete.tradeId,
              path: filePath,
            },
            receipt: {
              tradeId: committedDelete.tradeId,
              path: filePath,
              revision: committedDelete.revision,
              schemaVersion: committedDelete.schemaVersion,
              committedAt: Date.now(),
            },
          },
          {
            suppressLegacyTradeChanged: true,
          }
        );
      }

      
      await this.clearCache();

      
      
      try {
        const adapter = this.app.vault.adapter;
        if (adapter && adapter.list) {
          const tradesFolder = this.folderPathService.journalFolderPath;
          try {
            await adapter.list(tradesFolder);
          } catch {
            // intentional
          }
        }
      } catch {
        // intentional
      }

      
      await new Promise((resolve) => window.setTimeout(resolve, 300));

      
      
      
      window.setTimeout(() => {
        eventBus.publish('trade:changed', {
          action: 'deleted',
          filePaths: [filePath],
        });
      }, 500); 
    } catch (error) {
      console.error('Error handling trade deletion:', error);
    }
  }

  public override cleanup(): void {
    this.unsubscribeOptions?.();
    this.unsubscribeOptions = undefined;
    super.cleanup();
  }
}
