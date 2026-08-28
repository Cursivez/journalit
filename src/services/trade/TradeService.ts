import { logger } from '../../utils/logger';


import { App, TFile, TFolder, normalizePath } from 'obsidian';
import { calculatePnL } from '../../utils/pnlCalculation';
import { calculateRMultiple } from '../../components/forms/trade/validation';
import {
  CustomDataService,
  CustomDataServiceConfig,
} from '../base/CustomDataService';
import { isPathWithinDirectory } from '../base/pluginStoragePaths';
import JournalitPlugin from '../../main';
import { parseDisplayText } from '../../utils/tagSchema';
import {
  getISOWeekString,
  parseTradeTimestampValue,
  safeParseDateValue,
} from '../../utils/dateUtils';
import { getTradingDay } from '../../utils/tradingDayUtils';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsTradingDay,
  getTradeRealizedPnlEvents,
  type AnalyticsDateTradeLike,
} from '../../utils/tradeAnalyticsDate';
import type { AnalyticsDateBasis } from '../../settings/types';
import { LossReviewData, TradeReviewData } from '../backend/types';
import { CustomFieldValues } from '../../types/customFields';
import type { ImageAnnotations } from '../../types/imageAnnotations';
import { parseImageAnnotations } from '../../utils/imageAnnotations';
import { AccountPageService } from '../accountPage/AccountPageService';
import {
  forceMetadataCacheRefresh,
  readFrontmatterFromDisk,
} from '../../utils/dataRefresh';
import { normalizeStringArray } from '../../utils/dataUtils';
import {
  readFileContentForMutation,
  replaceFileContent,
} from '../../utils/fileMutation';
import {
  getFirstEntryTime,
  getLastExitTime,
  hasRealizedPnLComponents,
  isTradeOpenPreservingNullPnl,
  isTradeOpenWithContext,
} from '../../utils/tradeStatusUtils';
import {
  areSnapshotKeysClaimedByCustomFields,
  shouldInvalidateUnrealizedSnapshot,
  hasUnrealizedPriceSnapshot,
} from '../../utils/unrealizedPnl';
import { FolderPathService } from '../core/FolderPathService';
import {
  IdealExitTransaction,
  TradeFormData,
  TakeProfitTarget,
} from '../../components/forms/trade/types';
import {
  OptionType,
  type PreviousTagAssignments,
} from '../options/CustomOptionsService';
import { parseTradeDividendTransactions } from '../../utils/tradeUtils';
import { getPluginInstance } from '../../utils/pluginContext';
import { eventBus } from '../events/EventBus';
import { OptionsChangedPayload, Unsubscribe } from '../events/types';
import {
  acknowledgeLocalDeletedTradeProjection,
  clearLocalDeletedTradeProjection,
  reserveLocalDeletedTradeProjection,
} from '../tradeSync/TradeProjectionAckQueue';
import {
  registerTradeProjectionDeletionIntent,
  runWithTradeProjectionWriteLock,
} from '../tradeSync/TradeProjectionWriteLock';
import { ObsidianTradeNoteStore } from './core/ObsidianTradeNoteStore';
import { TradeReadModel } from './core/TradeReadModel';
import { isTradeIndexEligible } from './TradeIndexEligibility';
import {
  TradeCommandService,
  TradeCommitEventBatch,
  type TradeCreateOptions,
  type TradeCreationBatch,
  type TradeUpdateOptions,
} from './core/TradeCommandService';
import { getDefaultTradeTemplateMetadata } from '../templates/defaultTradeTemplateMetadata';
import { TradeEventBridge } from './core/TradeEventBridge';
import { planTradeMutation } from './core/TradeMutationPlanner';
import {
  buildTradeFilePath,
  buildTradeDirectoryPath,
  formatTradeDateForFilename,
  getTradeFilenameDateTokens,
  sanitizeTradeSymbolForFilename,
} from './core/TradePathPolicy';
import {
  cleanupRelocatedManagedTradeMediaDirectories,
  rekeyRelocatedManagedTradeMediaAnnotations,
  relocateManagedTradeMedia,
  rollbackRelocatedManagedTradeMedia,
  type RelocatedManagedTradeMedia,
} from './core/TradeMediaRelocation';
import { resolveManagedTradeMediaReferencePath } from './core/TradeMediaOwnership';
import {
  CANONICAL_PROJECTION_CLEAR_FIELDS,
  hasCanonicalProjectionIdentity,
  type CanonicalProjectionClearField,
} from './core/CanonicalProjectionFields';
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
import {
  rewriteTradeNoteMediaReferences,
  snapshotTradeNoteMediaReferenceResolutions,
} from './core/TradeNoteMediaReferenceCodec';
import {
  ensureTradeReviewEndBoundary,
  migrateTradeReviewFrontmatterToMarkdown,
  parseTradeReviewMarkdown,
  repairLegacyTradeReviewMarkdown,
  TRADE_REVIEW_MARKDOWN_MIGRATION_VERSION,
  upsertTradeReviewMarkdownQuestion,
} from './core/TradeReviewMarkdownCodec';
import { ReviewTemplateService } from '../templates/ReviewTemplateService';
import {
  buildLegacyTradeReviewMigrationPlan,
  createMigratedDefaultDrcTemplate,
  MIGRATED_TRADE_REVIEW_DRC_TEMPLATE_ID,
  TRADE_REVIEW_LAYOUT_MIGRATION_VERSION,
  upsertHistoricalDrcTradeReviewWidget,
} from './LegacyTradeReviewMigration';
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

function isJournalitTradeNoteFrontmatter(
  value: unknown
): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  return (
    value.type === 'trade' ||
    value.type === 'backtest-trade' ||
    value.type === 'missed-trade' ||
    value.isMissedTrade === true
  );
}

function normalizeLossReviewData(value: unknown): LossReviewData | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const sections = normalizeReviewSections(value);
  if (!sections) {
    return undefined;
  }

  return {
    sections,
    reviewed: value.reviewed === true,
    reviewedAt:
      typeof value.reviewedAt === 'string' ? value.reviewedAt : undefined,
  };
}

function normalizeTradeReviewData(value: unknown): TradeReviewData | undefined {
  const sections = normalizeReviewSections(value);
  return sections ? { sections } : undefined;
}

function normalizeReviewSections(
  value: unknown
): TradeReviewData['sections'] | undefined {
  if (!isRecord(value) || !isRecord(value.sections)) {
    return undefined;
  }

  return Object.fromEntries(
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
}

function getReviewMigrationNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getReviewMigrationString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getReviewMigrationDividends(
  value: unknown
): Array<{ amount?: number | null }> | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.flatMap((dividend): Array<{ amount?: number | null }> => {
    if (!isRecord(dividend)) return [];
    return [{ amount: getReviewMigrationNumber(dividend.amount) }];
  });
}

function formatReviewMigrationTradingDay(tradingDay: Date): string {
  const year = tradingDay.getFullYear();
  const month = String(tradingDay.getMonth() + 1).padStart(2, '0');
  const day = String(tradingDay.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getReviewMigrationTradingDays(
  frontmatter: Record<string, unknown>,
  plugin: JournalitPlugin
): string[] {
  const execution = normalizeTradeExecution(frontmatter, {
    deriveMissingExplicitness: true,
  });
  const commissionType =
    frontmatter.commissionType === 'fixed' ||
    frontmatter.commissionType === 'percentage'
      ? frontmatter.commissionType
      : undefined;
  const analyticsTrade: AnalyticsDateTradeLike = {
    entryTime: execution.firstEntryTime,
    exitTime: execution.lastExitTime,
    entries: execution.entries,
    exits: execution.exits,
    tradeStatus: getReviewMigrationString(frontmatter.tradeStatus),
    pnl: getReviewMigrationNumber(frontmatter.pnl),
    directPnL: getReviewMigrationNumber(frontmatter.directPnL),
    useDirectPnLInput: execution.useDirectPnLInput,
    _originalPnlWasNull:
      frontmatter.pnl === undefined || frontmatter.pnl === null,
    direction: getReviewMigrationString(frontmatter.direction),
    assetType: getReviewMigrationString(frontmatter.assetType),
    optionType: getReviewMigrationString(frontmatter.optionType),
    contractSize:
      getReviewMigrationNumber(frontmatter.contractSize) ?? undefined,
    dollarPerPoint:
      getReviewMigrationNumber(frontmatter.dollarPerPoint) ?? undefined,
    tickValue: getReviewMigrationNumber(frontmatter.tickValue) ?? undefined,
    tickSize: getReviewMigrationNumber(frontmatter.tickSize) ?? undefined,
    lotSize: getReviewMigrationNumber(frontmatter.lotSize) ?? undefined,
    pipValue: getReviewMigrationNumber(frontmatter.pipValue) ?? undefined,
    commission: getReviewMigrationNumber(frontmatter.commission),
    commissionType,
    swap: getReviewMigrationNumber(frontmatter.swap),
    fees: getReviewMigrationNumber(frontmatter.fees),
    rebate: getReviewMigrationNumber(frontmatter.rebate),
    dividends: getReviewMigrationDividends(frontmatter.dividends),
  };
  const basis = getAnalyticsDateBasis(plugin.settings);

  if (basis === 'exit') {
    const events = getTradeRealizedPnlEvents(analyticsTrade, basis, plugin);
    if (events.length > 0) {
      return Array.from(
        new Set(
          events.map((event) =>
            formatReviewMigrationTradingDay(event.tradingDay)
          )
        )
      );
    }
  }

  const tradingDay = getTradeAnalyticsTradingDay(analyticsTrade, basis, plugin);
  return tradingDay ? [formatReviewMigrationTradingDay(tradingDay)] : [];
}

function getDrcReviewMigrationDate(
  frontmatter: Record<string, unknown>
): string | null {
  return typeof frontmatter.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date)
    ? frontmatter.date
    : null;
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
  forexQuoteCurrency?: string;
  forexPnlConversionRate?: number;
  forexPnlConversionBaseCurrency?: string;
  forexPnlConversionRateDate?: string;
  forexPnlConversionRateSource?: 'automatic' | 'manual';
  leverageRatio?: number;
  lastBrokerSyncAt?: string;
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
  idealExits?: IdealExitTransaction[];
  dividends?: DividendTransaction[];

  
  tradeStatus?: 'OPEN' | 'PARTIALLY_CLOSED' | 'CLOSED' | 'CANCELLED';
  openQuantity?: number;
  closedQuantity?: number;

  
  entryTime: Date;
  exitTime?: Date; 
  entryPrice: number;
  exitPrice?: number; 
  hasExplicitExitPrice?: boolean;
  positionSize: number;
  direction: string;

  accountId?: string; 
  thesis?: string;
  images?: string[];
  imageAnnotations?: ImageAnnotations;
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
  takeProfits?: TakeProfitTarget[];
  riskAmount?: number;
  currency?: string; 
  fxRate?: number; 
  fxRateBaseCurrency?: string; 
  brokerBaseCurrencyPnl?: number;
  brokerBaseCurrency?: string;
  brokerBaseCurrencyPnlSource?: string;
  mae?: number;
  mfe?: number;
  maePrice?: number;
  mfePrice?: number;
  unrealizedPriceSnapshot?: number;
  unrealizedPriceSnapshotTime?: Date;

  
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
  forexQuoteCurrency?: string;
  forexPnlConversionRate?: number;
  forexPnlConversionBaseCurrency?: string;
  forexPnlConversionRateDate?: string;
  forexPnlConversionRateSource?: 'automatic' | 'manual';

  
  tradingPair?: string;
  cryptoExchange?: string;

  
  leverageRatio?: number;

  
  lossReview?: LossReviewData;
  tradeReview?: TradeReviewData;

  
  reviewed?: boolean;
  reviewedAt?: string;

  
  notes?: string;

  
  mtComment?: string;
  lastBrokerSyncAt?: string;

  
  originalPnl?: number;
  originalRMultiple?: number;

  
  authoritativePnl?: number | null;

  
  skipDefaultRiskAmount?: boolean;

  
  
  
  clearUnsetCurrencyFields?: boolean;
  
  clearUnsetForexPnlConversionFields?: boolean;

  
  useDirectPnLInput?: boolean;
  directPnL?: number;

  
  executionLedgerVersion?: number;
  executionIds?: string[];

  
  tradeId?: TradeId;
  schemaVersion?: number;
  tradeRevision?: number;
  templateId?: string;
  templateVersion?: number;
  tradeImportId?: string;
  tradeImportVersion?: number;
  tradeImportAccountId?: string;
  tradeImportAccountBroker?: string;
  tradeImportAccountDisplayName?: string;
  canonicalTradeId?: string;
  canonicalTradeVersion?: number;
  canonicalProjectionGeneration?: string;
  canonicalAccountId?: string;
  canonicalBroker?: string;
  canonicalAccountDisplayName?: string;
  canonicalProjectionSchemaVersion?: number;
  
  canonicalProjectionClearFields?: CanonicalProjectionClearField[];

  
  
  customFields?: CustomFieldValues;

  
  [key: string]: unknown;
}

type TradeRecord = Record<string, unknown> & {
  path?: string;
  filePath?: string;
  accountRefs?: unknown[];
};

class TradeCreationBatchImpl implements TradeCreationBatch {
  private readonly filePaths: string[] = [];
  private readonly postCreateTasksByPath = new Map<
    string,
    () => Promise<void>
  >();
  private cacheInvalidationRequested = false;
  private flushed = false;

  constructor(private readonly tradeService: TradeService) {}

  public async registerCreatedFile(filePath: string): Promise<void> {
    this.tradeService.markCreatedTradePendingFinalization(filePath);
    if (this.flushed) {
      try {
        await this.tradeService.finalizeCreatedTradeFiles([filePath]);
      } finally {
        this.tradeService.markCreatedTradeFinalized(filePath);
      }
      return;
    }
    this.filePaths.push(filePath);
  }

  public async registerPostCreateTask(
    filePath: string,
    task: () => Promise<void>
  ): Promise<void> {
    if (this.flushed) {
      await task();
      return;
    }
    this.postCreateTasksByPath.set(filePath, task);
  }

  public async requestCacheInvalidation(): Promise<void> {
    if (this.flushed) {
      await this.tradeService.clearCacheWithPrefix('trade:');
      return;
    }
    this.cacheInvalidationRequested = true;
  }

  public retainPaths(filePaths: ReadonlySet<string>): void {
    if (this.flushed) return;
    for (let index = this.filePaths.length - 1; index >= 0; index--) {
      if (!filePaths.has(this.filePaths[index])) {
        this.postCreateTasksByPath.delete(this.filePaths[index]);
        this.filePaths.splice(index, 1);
      }
    }
  }

  public abandon(): void {
    if (this.flushed) return;
    for (const filePath of this.filePaths) {
      this.tradeService.markCreatedTradeFinalized(filePath);
    }
    this.filePaths.length = 0;
    this.postCreateTasksByPath.clear();
    this.flushed = true;
  }

  public async flush(
    beforePostCreateTasks?: () => void | Promise<void>
  ): Promise<void> {
    if (this.flushed) return;
    await this.tradeService.finalizeCreatedTradeFiles(this.filePaths);
    if (this.cacheInvalidationRequested) {
      await this.tradeService.clearCacheWithPrefix('trade:');
    }
    this.tradeService.assertCreatedTradeFilesExist(this.filePaths);
    const postCreateTasks = this.filePaths.flatMap((filePath) => {
      const task = this.postCreateTasksByPath.get(filePath);
      return task ? [task] : [];
    });
    await beforePostCreateTasks?.();
    for (const filePath of this.filePaths) {
      this.tradeService.markCreatedTradeFinalized(filePath);
    }
    this.filePaths.length = 0;
    this.postCreateTasksByPath.clear();
    this.flushed = true;
    for (const task of postCreateTasks) {
      try {
        await task();
      } catch (error) {
        console.error('[TradeService] Post-create tasks failed:', error);
      }
    }
  }
}


export class TradeService extends CustomDataService {
  private readonly projectionIdentityByPath = new Map<
    string,
    {
      canonicalTradeId: string;
      canonicalTradeVersion: number;
      canonicalProjectionGeneration?: string;
    }
  >();
  private tradeReviewQuestionWriteQueueByFile = new Map<
    string,
    Promise<void>
  >();

  
  private static getFolderPath(folderPathService: FolderPathService): string {
    return folderPathService.journalFolderPath;
  }
  
  public async updateTrade(
    data: TradeData,
    filePath: string,
    source?: string,
    options?: TradeUpdateOptions
  ): Promise<string> {
    return this.tradeCommandService.updateTrade(
      data.canonicalTradeId ? data : this.applyAutomaticCommission(data),
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
    const originalFilePath = filePath;
    let wasRelocated = false;
    let relocatedManagedMedia: RelocatedManagedTradeMedia[] = [];
    let relocatedFrontmatterCommitted = false;
    let originalTradeContentBeforeRelocation: string | null = null;
    let managedRelocationPaths: [string, string] | null = null;

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

      
      const diskFrontmatter = await readFrontmatterFromDisk(this.app, file);
      const existingFrontmatterRecord =
        Object.keys(diskFrontmatter).length > 0 ? diskFrontmatter : null;
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
              existingFrontmatter.forexPnlConversionRate !==
                normalizedForComparison.forexPnlConversionRate ||
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
          originalTradeContentBeforeRelocation =
            await readFileContentForMutation(this.app, file);
          const resolvedOriginalMediaReferences =
            snapshotTradeNoteMediaReferenceResolutions(
              originalTradeContentBeforeRelocation,
              (target) => {
                const resolvedLink =
                  !target.includes('/') && !target.includes('\\')
                    ? this.app.metadataCache.getFirstLinkpathDest(
                        target,
                        originalFilePath
                      )?.path
                    : undefined;
                return (
                  resolvedLink ??
                  resolveManagedTradeMediaReferencePath({
                    mediaTarget: target,
                    tradeFilePath: originalFilePath,
                    instrument: existingTicker,
                    pathExists: (path) =>
                      this.app.vault.getAbstractFileByPath(path) instanceof
                      TFile,
                  }) ??
                  this.app.metadataCache.getFirstLinkpathDest(
                    target,
                    originalFilePath
                  )?.path ??
                  target
                );
              },
              'document'
            );
          const mediaRelocation = await relocateManagedTradeMedia({
            app: this.app,
            images: data.images ?? [],
            additionalMediaPaths: Array.from(
              resolvedOriginalMediaReferences.values()
            ),
            sourceTradeFilePath: originalFilePath,
            sourceInstrument: existingTicker,
            destinationTradeFilePath: newPath,
            destinationInstrument: data.instrument ?? plan.normalizedTicker,
            ensureDirectory: (path) => this.ensureDirectoryExists(path),
          });
          relocatedManagedMedia = mediaRelocation.relocated;
          if (relocatedManagedMedia.length > 0 && data.images) {
            data.images = mediaRelocation.images;
          }

          managedRelocationPaths = [originalFilePath, newPath];
          this.beginManagedTradeRename(...managedRelocationPaths);
          await this.app.vault.rename(file, newPath);
          filePath = newPath;
          wasRelocated = true;

          file = this.app.vault.getAbstractFileByPath(newPath);
          if (!file || !(file instanceof TFile)) {
            throw new Error(`Failed to get file after relocation: ${newPath}`);
          }

          const relocatedContent = await readFileContentForMutation(
            this.app,
            file
          );
          const contentWithRelocatedMediaReferences =
            rewriteTradeNoteMediaReferences(
              relocatedContent,
              relocatedManagedMedia,
              resolvedOriginalMediaReferences,
              (target) =>
                this.app.metadataCache.getFirstLinkpathDest(target, filePath)
                  ?.path ??
                this.app.metadataCache.getFirstLinkpathDest(
                  target,
                  originalFilePath
                )?.path
            );
          if (contentWithRelocatedMediaReferences !== relocatedContent) {
            await replaceFileContent(
              this.app,
              file,
              contentWithRelocatedMediaReferences
            );
            await forceMetadataCacheRefresh(this.app, file);
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
          tradeStatus:
            data.tradeStatus === 'CANCELLED'
              ? 'CANCELLED'
              : data.tradeStatus === 'PARTIALLY_CLOSED'
                ? 'PARTIALLY_CLOSED'
                : isOpenTrade
                  ? 'OPEN'
                  : 'CLOSED',
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

      if (
        Object.prototype.hasOwnProperty.call(data, 'stopLoss') &&
        data.stopLoss === undefined
      ) {
        frontmatterData.stopLoss = undefined;
      }

      const snapshotKeysClaimedByCustomFields =
        areSnapshotKeysClaimedByCustomFields(
          this.plugin?.customFieldsService?.getFields()
        );
      const quoteContextValuesEqual = (
        field: string,
        existingValue: unknown,
        incomingValue: unknown
      ): boolean => {
        if (field !== 'expirationDate') {
          return existingValue === incomingValue;
        }

        const existingDate = safeParseDateValue(existingValue);
        const incomingDate = safeParseDateValue(incomingValue);
        return existingDate && incomingDate
          ? existingDate.getTime() === incomingDate.getTime()
          : existingValue === incomingValue;
      };
      const snapshotQuoteContextChanged =
        existingFrontmatterRecord !== null &&
        [
          'instrument',
          'direction',
          'currency',
          'assetType',
          'exchange',
          'expirationDate',
          'strikePrice',
          'optionType',
          'contractSize',
          'contractSymbol',
          'dollarPerPoint',
          'tickSize',
          'tickValue',
          'currencyPair',
          'lotSize',
          'pipValue',
          'tradingPair',
          'cryptoExchange',
        ].some(
          (field) =>
            Object.prototype.hasOwnProperty.call(data, field) &&
            !quoteContextValuesEqual(
              field,
              existingFrontmatterRecord[field],
              (data as Record<string, unknown>)[field]
            )
        );
      const shouldInvalidatePreservedBackendSnapshot =
        source === 'backend-sync' &&
        !snapshotKeysClaimedByCustomFields &&
        existingFrontmatterRecord !== null &&
        hasUnrealizedPriceSnapshot(existingFrontmatterRecord) &&
        (snapshotQuoteContextChanged ||
          shouldInvalidateUnrealizedSnapshot(existingFrontmatterRecord, {
            ...existingFrontmatterRecord,
            ...data,
          }));

      if (shouldInvalidatePreservedBackendSnapshot) {
        frontmatterData.unrealizedPriceSnapshot = undefined;
        frontmatterData.unrealizedPriceSnapshotTime = undefined;
      } else if (
        !snapshotKeysClaimedByCustomFields &&
        Object.prototype.hasOwnProperty.call(data, 'unrealizedPriceSnapshot') &&
        data.unrealizedPriceSnapshot === undefined
      ) {
        frontmatterData.unrealizedPriceSnapshot = undefined;
        frontmatterData.unrealizedPriceSnapshotTime = undefined;
      }

      if (data.clearUnsetCurrencyFields) {
        if (data.currency === undefined) {
          frontmatterData.currency = undefined;
        }
        if (data.fxRate === undefined) {
          frontmatterData.fxRate = undefined;
          frontmatterData.fxRateBaseCurrency = undefined;
        }
      }

      if (
        data.clearUnsetForexPnlConversionFields &&
        data.forexPnlConversionRate === undefined
      ) {
        frontmatterData.forexQuoteCurrency = undefined;
        frontmatterData.forexPnlConversionRate = undefined;
        frontmatterData.forexPnlConversionBaseCurrency = undefined;
        frontmatterData.forexPnlConversionRateDate = undefined;
        frontmatterData.forexPnlConversionRateSource = undefined;
      } else if (
        data.clearUnsetForexPnlConversionFields &&
        data.forexPnlConversionRateSource === 'manual' &&
        data.forexPnlConversionRateDate === undefined
      ) {
        frontmatterData.forexPnlConversionRateDate = undefined;
      }

      const storedCurrency =
        typeof existingFrontmatterRecord?.currency === 'string'
          ? existingFrontmatterRecord.currency
          : undefined;
      const incomingCurrencyChangesStored =
        typeof data.currency === 'string' && data.currency !== storedCurrency;
      const hasCompleteIncomingFxPair =
        typeof data.fxRate === 'number' &&
        Number.isFinite(data.fxRate) &&
        data.fxRate > 0 &&
        typeof data.fxRateBaseCurrency === 'string' &&
        data.fxRateBaseCurrency.trim() !== '';
      if (incomingCurrencyChangesStored && !hasCompleteIncomingFxPair) {
        frontmatterData.fxRate = undefined;
        frontmatterData.fxRateBaseCurrency = undefined;
      }

      const canonicalProjectionClearFields =
        data.canonicalProjectionClearFields;
      const canonicalProjectionClearFieldSet = new Set(
        canonicalProjectionClearFields
      );
      for (const field of CANONICAL_PROJECTION_CLEAR_FIELDS) {
        if (canonicalProjectionClearFieldSet.has(field)) {
          frontmatterData[field] = undefined;
        }
      }
      delete data.canonicalProjectionClearFields;

      
      
      if (relocatedManagedMedia.length > 0) {
        await this.updateFrontmatter(
          file,
          frontmatterData,
          (frontmatter) =>
            rekeyRelocatedManagedTradeMediaAnnotations(
              frontmatter,
              relocatedManagedMedia
            ),
          () => {
            relocatedFrontmatterCommitted = true;
          }
        );
      } else if (wasRelocated) {
        await this.updateFrontmatter(file, frontmatterData, undefined, () => {
          relocatedFrontmatterCommitted = true;
        });
      } else {
        await this.updateFrontmatter(file, frontmatterData);
      }
      await cleanupRelocatedManagedTradeMediaDirectories(
        this.app,
        relocatedManagedMedia
      );
      

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
      if (relocatedFrontmatterCommitted) {
        console.warn(
          `Trade relocation committed but post-commit refresh failed for ${filePath}:`,
          error
        );
        try {
          await this.clearCacheWithPrefix('trade:');
        } catch (cacheError) {
          console.warn(
            `Failed to recover trade cache after committed relocation ${filePath}:`,
            cacheError
          );
        }
        return filePath;
      }

      const rollbackFailures: string[] = [];
      if (
        (wasRelocated || relocatedManagedMedia.length > 0) &&
        originalTradeContentBeforeRelocation !== null
      ) {
        try {
          const relocatedFile = this.app.vault.getAbstractFileByPath(filePath);
          if (!(relocatedFile instanceof TFile)) {
            throw new Error(`Relocated trade file not found: ${filePath}`);
          }
          await replaceFileContent(
            this.app,
            relocatedFile,
            originalTradeContentBeforeRelocation
          );
        } catch (rollbackError) {
          const detail =
            rollbackError instanceof Error
              ? rollbackError.message
              : String(rollbackError);
          rollbackFailures.push(
            `Failed to restore relocated trade content ${filePath}: ${detail}`
          );
        }
      }

      if (relocatedManagedMedia.length > 0) {
        try {
          await rollbackRelocatedManagedTradeMedia(
            this.app,
            relocatedManagedMedia,
            (path) => this.ensureDirectoryExists(path)
          );
        } catch (rollbackError) {
          rollbackFailures.push(
            rollbackError instanceof Error
              ? rollbackError.message
              : String(rollbackError)
          );
        }
      }

      if (wasRelocated) {
        try {
          const relocatedFile = this.app.vault.getAbstractFileByPath(filePath);
          if (!(relocatedFile instanceof TFile)) {
            throw new Error(`Relocated trade file not found: ${filePath}`);
          }
          const originalDirectory = originalFilePath.slice(
            0,
            originalFilePath.lastIndexOf('/')
          );
          await this.ensureDirectoryExists(originalDirectory);
          await this.app.vault.rename(relocatedFile, originalFilePath);
          filePath = originalFilePath;
          wasRelocated = false;
        } catch (rollbackError) {
          const detail =
            rollbackError instanceof Error
              ? rollbackError.message
              : String(rollbackError);
          rollbackFailures.push(
            `Failed to roll back relocated trade note ${filePath}: ${detail}`
          );
        }
      }
      console.error('Error updating trade:', error);
      if (rollbackFailures.length > 0) {
        await this.refreshAfterIncompleteManagedRollback(
          originalFilePath,
          filePath
        );
        const updateDetail =
          error instanceof Error ? error.message : String(error);
        throw new Error(
          `Trade update failed (${updateDetail}) and rollback was incomplete: ${rollbackFailures.join('; ')}`
        );
      }
      throw error;
    } finally {
      if (managedRelocationPaths) {
        this.endManagedTradeRename(...managedRelocationPaths);
      }
    }
  }
  
  public recentlyCreatedFiles?: Set<string>;
  
  private readonly rollbackSuppressedDeletionPaths = new Set<string>();
  private readonly pendingCreationBatchPaths = new Set<string>();
  
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
  
  private unsubscribeFolderPathChanged?: Unsubscribe;
  private folderPathRefreshGeneration = 0;
  
  private vaultRenameBridgeRegistered: boolean = false;
  private readonly managedTradeRenameKeys = new Set<string>();

  private getManagedTradeRenameKey(oldPath: string, newPath: string): string {
    return `${oldPath}\0${newPath}`;
  }

  private beginManagedTradeRename(oldPath: string, newPath: string): void {
    this.managedTradeRenameKeys.add(
      this.getManagedTradeRenameKey(oldPath, newPath)
    );
    this.managedTradeRenameKeys.add(
      this.getManagedTradeRenameKey(newPath, oldPath)
    );
  }

  private endManagedTradeRename(oldPath: string, newPath: string): void {
    this.managedTradeRenameKeys.delete(
      this.getManagedTradeRenameKey(oldPath, newPath)
    );
    this.managedTradeRenameKeys.delete(
      this.getManagedTradeRenameKey(newPath, oldPath)
    );
  }

  private isManagedTradeRename(oldPath: string, newPath: string): boolean {
    return this.managedTradeRenameKeys.has(
      this.getManagedTradeRenameKey(oldPath, newPath)
    );
  }

  private async refreshAfterIncompleteManagedRollback(
    originalPath: string,
    currentPath: string
  ): Promise<void> {
    this.indexManager?.markDirty('trades');
    this.indexManager?.markDirty('trade-unique-values');

    try {
      await this.clearCacheWithPrefix('trade:');
    } catch (error) {
      console.warn(
        'Failed to clear trade cache after an incomplete managed rollback:',
        error
      );
    }

    const survivingPaths = Array.from(
      new Set([currentPath, originalPath])
    ).filter(
      (path) => this.app.vault.getAbstractFileByPath(path) instanceof TFile
    );

    eventBus.publish('trade:changed', {
      action: 'relocated',
      filePaths: survivingPaths.length > 0 ? survivingPaths : undefined,
      oldFilePath: originalPath,
      timestamp: Date.now(),
    });
  }

  
  constructor(
    app: App,
    folderPathService: FolderPathService,
    config: CustomDataServiceConfig = {}
  ) {
    
    const appRef = app;
    const folderPathServiceRef = folderPathService;
    const shouldScanTradeFile = (file: TFile): boolean => {
      if (
        file.extension !== 'md' ||
        !folderPathServiceRef.isJournalPath(file.path)
      ) {
        return false;
      }

      const frontmatter = appRef.metadataCache.getFileCache(file)?.frontmatter;
      return frontmatter
        ? isTradeIndexEligible(file, frontmatter, folderPathServiceRef)
        : true;
    };
    const shouldIndexTradeData = (data: unknown, file: TFile): boolean =>
      isTradeIndexEligible(
        file,
        isRecord(data) ? data : undefined,
        folderPathServiceRef
      );
    const canContainIndexedTradeFiles = (path: string): boolean =>
      folderPathServiceRef.isJournalPath(path) ||
      isPathWithinDirectory(folderPathServiceRef.journalFolderPath, path);

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
          fileFilter: shouldScanTradeFile,
          dataFilter: shouldIndexTradeData,
          folderFilter: canContainIndexedTradeFiles,
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
              return value.split(',').flatMap((s: string) => {
                const trimmed = s.trim();
                return trimmed ? [trimmed] : [];
              });
            }
            return value;
          },
          fileFilter: shouldScanTradeFile,
          dataFilter: shouldIndexTradeData,
          folderFilter: canContainIndexedTradeFiles,
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
    this.hydrateProjectionIdentityIndex();
  }

  private hydrateProjectionIdentityIndex(): void {
    if (typeof this.app.vault.getMarkdownFiles !== 'function') return;
    for (const file of this.app.vault.getMarkdownFiles()) {
      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!hasCanonicalProjectionIdentity(frontmatter)) continue;
      const projectionGeneration: unknown =
        frontmatter?.canonicalProjectionGeneration;
      this.projectionIdentityByPath.set(file.path, {
        canonicalTradeId: frontmatter.canonicalTradeId,
        canonicalTradeVersion: frontmatter.canonicalTradeVersion,
        canonicalProjectionGeneration:
          typeof projectionGeneration === 'string'
            ? projectionGeneration
            : undefined,
      });
    }
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

    const normalizedValues = values.flatMap((value) => {
      if (typeof value === 'string') {
        const normalizedValue = value.trim();
        return normalizedValue ? [normalizedValue] : [];
      }

      if (
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'bigint'
      ) {
        return [safeString(value)];
      }

      return [];
    });

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
    await this.waitForTradeDataReady();

    
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
    await this.waitForTradeDataReady();

    
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
    
    const setups = trades.flatMap((trade) =>
      this.getTradeArrayValue(trade, 'setup').filter(Boolean)
    );

    
    return this.normalizeUniqueOptionValues(setups);
  }

  
  public async getUniqueMistakes(): Promise<string[]> {
    await this.waitForTradeDataReady();

    
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
    
    const mistakes = trades.flatMap((trade) =>
      this.getTradeArrayValue(trade, 'mistake').filter(Boolean)
    );

    
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
  ): 'OPEN' | 'PARTIALLY_CLOSED' | 'CLOSED' | 'CANCELLED' {
    
    if (
      tradeData.tradeStatus === 'OPEN' ||
      tradeData.tradeStatus === 'PARTIALLY_CLOSED' ||
      tradeData.tradeStatus === 'CLOSED' ||
      tradeData.tradeStatus === 'CANCELLED'
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
    await this.waitForTradeDataReady();

    
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
    
    const tags = trades.flatMap((trade) =>
      this.getTradeArrayValue(trade, 'tags').filter(Boolean)
    );

    
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
          ...trade.tags.flatMap((tag) => (typeof tag === 'string' ? [tag] : []))
        );
      }
    }

    
    return Array.from(
      new Set(
        allCustomTags.flatMap((tag) => {
          const normalizedTag = String(tag).trim();
          return normalizedTag ? [normalizedTag] : [];
        })
      )
    );
  }

  

  public async getTradeData(options?: {
    fresh?: boolean;
  }): Promise<Array<Record<string, unknown>>> {
    
    
    
    
    await this.waitForTradeDataReady();

    
    const allMarkdownFiles = this.getTrackedMarkdownFiles();

    const bypassIndexes = this.tradeReadModel.shouldBypassIndexes();

    
    const trades = await this.getAllTrades(allMarkdownFiles, {
      useIndexes: options?.fresh ? false : !bypassIndexes,
    });

    
    const result = await this.resolveTradePathsAsync(trades, allMarkdownFiles);

    return result.map((trade) => {
      const tradeRecord = trade as Record<string, unknown>;
      const canonicalTradeId = tradeRecord.canonicalTradeId;
      const canonicalTradeVersion = this.parseFiniteNumber(
        tradeRecord.canonicalTradeVersion
      );
      if (
        typeof tradeRecord.path === 'string' &&
        typeof canonicalTradeId === 'string' &&
        canonicalTradeVersion !== undefined
      ) {
        this.projectionIdentityByPath.set(tradeRecord.path, {
          canonicalTradeId,
          canonicalTradeVersion,
          canonicalProjectionGeneration:
            typeof tradeRecord.canonicalProjectionGeneration === 'string'
              ? tradeRecord.canonicalProjectionGeneration
              : undefined,
        });
      }
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
      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;

      if (/-M\d+\.md$/.test(file.path)) {
        continue;
      }

      if (isTradeIndexEligible(file, frontmatter, this.folderPathService)) {
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

    
    const fileMap = new Map<string, TFile | null>();
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
        const existingMatch = fileMap.get(key);
        if (existingMatch === undefined) {
          fileMap.set(key, file);
        } else if (existingMatch?.path !== file.path) {
          fileMap.set(key, null);
        }
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
        let hasAmbiguousMatch = false;
        const entryTime = this.getTradePathResolutionEntryTime(trade);
        const instrument =
          typeof trade.instrument === 'string' ? trade.instrument : undefined;
        const direction =
          typeof trade.direction === 'string' ? trade.direction : '';
        if (instrument && entryTime) {
          const key = `${instrument}-${entryTime}-${direction}`;
          const fileMatch = fileMap.get(key);
          hasAmbiguousMatch = fileMatch === null;
          matchingFile = fileMatch ?? undefined;
        }

        if (hasAmbiguousMatch) {
          return trade;
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
    
    
    
    await this.waitForTradeDataReady();

    const useIndexes = queryOptions?.useIndexes ?? true;
    if (
      useIndexes &&
      this.indexManager?.isIndexReady('trades') &&
      this.indexManager.getIndex('trades').length === 0
    ) {
      
      
      
      return [];
    }

    const cacheKey = 'trade:all-trades:index-path-v2';

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
          useIndexes,
          
          
          
          
          useCache: false,
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
        .flatMap((s) => {
          const trimmed = s.trim();
          return trimmed ? [trimmed] : [];
        });
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
        
        
        
        
        if (this.isIndexingEnabled()) {
          this.needsTradeIndexRefresh = true;
        }
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
      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timeoutId);
        unsubscribe?.();
        this.markTradeIndexReady();
        resolve();
      };
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
        finish();
      });

      
      
      
      if (this.indexManager?.isIndexReady('trades')) {
        finish();
      }
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

  private async refreshAfterFolderPathChange(
    folderPath: string
  ): Promise<void> {
    const generation = ++this.folderPathRefreshGeneration;
    this.setMonitoredFolder(folderPath);
    this.indexManager?.markDirty('trades');
    this.indexManager?.markDirty('trade-unique-values');
    await this.clearCache();
    if (this.isIndexingEnabled()) {
      await this.waitForTradeIndexReady();
    }

    if (generation !== this.folderPathRefreshGeneration) {
      return;
    }

    eventBus.publish('trade:changed', {
      action: 'relocated',
      timestamp: Date.now(),
    });
  }

  
  public setPlugin(plugin: JournalitPlugin): void {
    super.setPlugin(plugin);

    this.unsubscribeFolderPathChanged?.();
    this.unsubscribeFolderPathChanged = eventBus.subscribe(
      'folder-path:changed',
      (payload) => {
        void this.refreshAfterFolderPathChange(payload.value);
      }
    );

    if (!this.vaultRenameBridgeRegistered) {
      this.vaultRenameBridgeRegistered = true;
      plugin.registerEvent(
        plugin.app.vault.on('rename', async (file, oldPath) => {
          if (file instanceof TFolder) {
            const journalPath = this.folderPathService.journalFolderPath;
            const affectsJournal = [file.path, oldPath].some(
              (path) =>
                isPathWithinDirectory(path, journalPath) ||
                isPathWithinDirectory(journalPath, path)
            );
            if (!affectsJournal || oldPath === file.path) return;

            eventBus.publish('trade:changed', {
              action: 'relocated',
              filePaths: [file.path],
              oldFilePath: oldPath,
              timestamp: Date.now(),
            });
            return;
          }

          if (!(file instanceof TFile) || oldPath === file.path) {
            return;
          }
          if (this.isManagedTradeRename(oldPath, file.path)) {
            return;
          }
          if (!oldPath.endsWith('.md') && file.extension !== 'md') {
            return;
          }

          const frontmatter =
            plugin.app.metadataCache.getFileCache(file)?.frontmatter ??
            (await this.readFrontmatter(file));
          const wasEligible =
            Boolean(
              this.tradeReadModel.getEntryForPath(normalizePath(oldPath))
            ) ||
            isTradeIndexEligible(
              { path: oldPath },
              frontmatter,
              this.folderPathService
            );
          const isEligible = isTradeIndexEligible(
            file,
            frontmatter,
            this.folderPathService
          );
          if (!wasEligible && !isEligible) return;

          if (wasEligible !== isEligible) {
            this.indexManager?.markDirty('trades');
            this.indexManager?.markDirty('trade-unique-values');
            await this.clearCacheWithPrefix('trade:');
            if (this.isIndexingEnabled()) {
              await this.waitForTradeIndexReady();
            }
          }

          eventBus.publish('trade:changed', {
            action: 'relocated',
            filePaths: [file.path],
            oldFilePath: oldPath,
            timestamp: Date.now(),
          });
        })
      );
    }

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

    
    
    if (typeof plugin.app.metadataCache.on === 'function') {
      plugin.registerEvent(
        plugin.app.metadataCache.on('deleted', async (file, previousCache) => {
          if (file.path.endsWith('.md')) {
            const normalizedPath = normalizePath(file.path);
            const frontmatter = previousCache?.frontmatter;
            const wasTrade =
              frontmatter?.type === 'trade' ||
              frontmatter?.isMissedTrade === true ||
              frontmatter?.isBacktestTrade === true ||
              typeof frontmatter?.canonicalTradeId === 'string' ||
              Boolean(this.tradeReadModel.getEntryForPath(normalizedPath));
            if (!wasTrade && !/\/trades\//.test(file.path)) return;
            await this.handleTradeDeletion(
              normalizedPath,
              file,
              frontmatter
                ? Object.fromEntries(Object.entries(frontmatter))
                : undefined
            );
          }
        })
      );
    } else {
      
      plugin.registerEvent(
        plugin.app.vault.on('delete', async (file) => {
          if (file.path.endsWith('.md')) {
            const normalizedPath = normalizePath(file.path);
            if (
              !/\/trades\//.test(file.path) &&
              !this.tradeReadModel.getEntryForPath(normalizedPath)
            )
              return;
            await this.handleTradeDeletion(
              normalizedPath,
              file instanceof TFile ? file : undefined
            );
          }
        })
      );
    }

    this.unsubscribeOptions?.();
    this.unsubscribeOptions = eventBus.subscribe(
      'options:changed',
      (payload: OptionsChangedPayload) => {
        this.handleOptionsChanged(payload);
      }
    );
  }

  public setTagAssignmentRunner(
    runner: <T>(
      tags: readonly string[],
      operation: () => Promise<T>,
      previousTags?: PreviousTagAssignments
    ) => Promise<T>
  ): void {
    this.tradeCommandService.setTagAssignmentRunner(runner);
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

            if (
              typeof frontmatterData.canonicalTradeId === 'string' &&
              frontmatterData.canonicalTradeId.trim()
            ) {
              return;
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
                typeof frontmatterData.hasExplicitCommission === 'boolean'
                  ? frontmatterData.hasExplicitCommission
                  : undefined,
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
              forexPnlConversionRate: parseNumber(
                frontmatterData.forexPnlConversionRate
              ),
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
    options?: TradeCreateOptions
  ): Promise<string> {
    const templateMetadata = this.plugin
      ? getDefaultTradeTemplateMetadata(this.plugin)
      : undefined;
    const mergedData = { ...(templateMetadata ?? {}), ...data };
    return this.tradeCommandService.createTrade(
      data.canonicalTradeId
        ? mergedData
        : this.applyAutomaticCommission(mergedData),
      options
    );
  }

  public createTradeCommitEventBatch(): TradeCommitEventBatch {
    return new TradeCommitEventBatch(this.tradeEventBridge);
  }

  public createTradeCreationBatch(): TradeCreationBatch {
    return new TradeCreationBatchImpl(this);
  }

  public markCreatedTradePendingFinalization(filePath: string): void {
    this.pendingCreationBatchPaths.add(normalizePath(filePath));
  }

  public markCreatedTradeFinalized(filePath: string): void {
    this.pendingCreationBatchPaths.delete(normalizePath(filePath));
  }

  public discardCreatedTradeState(filePath: string): void {
    this.pendingCreationBatchPaths.delete(normalizePath(filePath));
    this.recentlyCreatedFiles?.delete(filePath);
    this.tradeReadModel.forgetPath(filePath);
    this.projectionIdentityByPath.delete(filePath);
  }

  public suppressCreatedTradeRollbackDeletion(filePath: string): void {
    const normalizedPath = normalizePath(filePath);
    this.rollbackSuppressedDeletionPaths.add(normalizedPath);
    window.setTimeout(() => {
      this.rollbackSuppressedDeletionPaths.delete(normalizedPath);
    }, 30_000);
  }

  public cancelCreatedTradeRollbackDeletion(filePath: string): void {
    this.rollbackSuppressedDeletionPaths.delete(normalizePath(filePath));
  }

  public async finalizeCreatedTradeFiles(filePaths: string[]): Promise<void> {
    const files = this.assertCreatedTradeFilesExist(filePaths);
    await Promise.all(
      files.map((file) => forceMetadataCacheRefresh(this.app, file, 500))
    );
  }

  public assertCreatedTradeFilesExist(filePaths: string[]): TFile[] {
    const files: TFile[] = [];
    const missingFilePaths: string[] = [];
    for (const filePath of filePaths) {
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (file instanceof TFile) {
        files.push(file);
      } else {
        missingFilePaths.push(filePath);
      }
    }
    if (missingFilePaths.length > 0) {
      throw new Error(
        `Cannot finalize missing created trade files: ${missingFilePaths.join(', ')}`
      );
    }
    return files;
  }

  private applyAutomaticCommission(data: TradeData): TradeData {
    if (
      data.hasExplicitCommission === true ||
      data.commissionType === 'percentage'
    ) {
      return data;
    }

    const instrument = data.instrument;
    if (!instrument) {
      return data;
    }

    const hasScalarExitPrice =
      data.exitPrice !== undefined &&
      data.exitPrice !== null &&
      (data.exitPrice > 0 || data.hasExplicitExitPrice === true);
    const hasMeaningfulExitRows = Boolean(
      data.exits?.some(
        (exit) =>
          (exit.price !== undefined &&
            exit.price !== null &&
            exit.price !== 0) ||
          (exit.size !== undefined && exit.size !== null && exit.size !== 0)
      )
    );
    const hasClosedDirectPnL =
      data.useDirectPnLInput === true &&
      data.tradeStatus !== 'OPEN' &&
      data.tradeStatus !== 'PARTIALLY_CLOSED' &&
      data.tradeStatus !== 'CANCELLED';
    const hasExit =
      hasClosedDirectPnL ||
      (data.tradeStatus === 'CLOSED' && hasScalarExitPrice) ||
      hasMeaningfulExitRows;
    const exitedPositionSizeTotal = (data.exits ?? []).reduce(
      (total, exit) =>
        exit.size !== undefined && exit.size !== null && exit.size > 0
          ? total + exit.size
          : total,
      0
    );
    const exitedPositionSize =
      exitedPositionSizeTotal > 0 ? exitedPositionSizeTotal : undefined;

    const commission =
      typeof this.plugin?.optionsService?.calculateInstrumentCommission ===
      'function'
        ? this.plugin.optionsService.calculateInstrumentCommission({
            instrument,
            assetType: data.assetType,
            account: data.account,
            positionSize: data.positionSize,
            exitedPositionSize,
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
              exitedPositionSize,
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
    options?: TradeCreateOptions,
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

      
      
      const fileExists = await this.app.vault.adapter.exists(filePath);
      if (fileExists) {
        const existingFiles = await this.listFilesInFolder(targetFolderPath);
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
      if (options?.creationBatch) {
        await options.creationBatch.registerCreatedFile(filePath);
      } else {
        await forceMetadataCacheRefresh(this.app, newFile, 500);
      }

      

      
      
      
      if (!suppressTradeChangedEvent) {
        window.setTimeout(() => {
          eventBus.publish('trade:changed', {
            action: 'created',
            filePaths: [filePath],
          });
        }, 500); 
      }

      
      if (options?.creationBatch) {
        await options.creationBatch.requestCacheInvalidation();
      } else {
        await this.clearCacheWithPrefix('trade:');
      }

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
        if (options?.creationBatch) {
          await options.creationBatch.registerPostCreateTask(
            filePath,
            runPostCreateTasks
          );
        } else if (options?.deferPostCreateTasks) {
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
    options?: {
      dateBasis?: AnalyticsDateBasis;
      fresh?: boolean;
      includeUnrealizedPnL?: boolean;
    }
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
    const snapshotKeysClaimedByCustomFields =
      areSnapshotKeysClaimedByCustomFields(
        this.plugin?.customFieldsService?.getFields()
      );
    const isSnapshotCaptureInRange = (
      frontmatter: Record<string, unknown>,
      tradeForAnalytics: Record<string, unknown>
    ): boolean => {
      if (
        dateBasis !== 'exit' ||
        options?.includeUnrealizedPnL !== true ||
        snapshotKeysClaimedByCustomFields ||
        !hasUnrealizedPriceSnapshot({
          unrealizedPriceSnapshot: this.parseFiniteNumber(
            frontmatter.unrealizedPriceSnapshot
          ),
        }) ||
        !isTradeOpenPreservingNullPnl(tradeForAnalytics)
      ) {
        return false;
      }

      
      
      
      const snapshotCaptureTime = safeParseDateValue(
        frontmatter.unrealizedPriceSnapshotTime
      );
      const snapshotTradingDay = snapshotCaptureTime
        ? getTradingDay(snapshotCaptureTime, this.plugin)
        : getTradeAnalyticsTradingDay(tradeForAnalytics, 'entry', this.plugin);
      return Boolean(
        snapshotTradingDay &&
        snapshotTradingDay >= tradingStartDate &&
        snapshotTradingDay <= tradingEndDate
      );
    };

    
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
            !isTradeIndexEligible(
              recentFile,
              frontmatter,
              this.folderPathService
            )
          ) {
            continue;
          }

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
              ) ||
              isSnapshotCaptureInRange(frontmatter, tradeForAnalytics)
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
    const allFiles = allMarkdownFiles.filter(
      (file) =>
        file.path.endsWith('.md') &&
        this.folderPathService.isJournalPath(file.path)
    );

    
    
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

        if (!isTradeIndexEligible(file, frontmatter, this.folderPathService)) {
          continue;
        }

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
        } else if (isSnapshotCaptureInRange(frontmatter, tradeForAnalytics)) {
          matchingFiles.push(file);
        }
      } catch (error) {
        console.warn(`Error checking trade file ${file.path}:`, error);
      }
    }

    return matchingFiles;
  }

  

  public async extractTradeData(
    file: TFile,
    frontmatterOverride?: Record<string, unknown>,
    contentOverride?: string
  ): Promise<Record<string, unknown> | null> {
    try {
      
      const cachedFrontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      const cachedFrontmatterRecord =
        cachedFrontmatter && typeof cachedFrontmatter === 'object'
          ? Object.fromEntries(Object.entries(cachedFrontmatter))
          : null;
      const frontmatter: Record<string, unknown> | null =
        frontmatterOverride ?? cachedFrontmatterRecord;

      const isPathBasedLegacyTrade =
        this.folderPathService.isJournalPath(file.path) &&
        isTradeIdentityEligibleNote(frontmatter, file.path);

      
      if (
        !frontmatter ||
        (frontmatter.type !== 'trade' &&
          frontmatter.type !== 'backtest-trade' &&
          frontmatter.type !== 'missed-trade' &&
          frontmatter.isMissedTrade !== true &&
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

      const isCanonicalProjection = hasCanonicalProjectionIdentity(frontmatter);
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
        'tradeImportId',
        'tradeImportVersion',
        'tradeImportAccountId',
        'tradeImportAccountBroker',
        'tradeImportAccountDisplayName',
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
        'openQuantity',
        'closedQuantity',
        'entries',
        'exits',
        'idealExits',
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
        'takeProfits',
        'mae',
        'mfe',
        'maePrice',
        'mfePrice',
        'unrealizedPriceSnapshot',
        'unrealizedPriceSnapshotTime',
        'account',
        'accountId',

        'setup',
        'journalitDrc',
        'journalitSetups',
        'journalitParentReview',

        'mistake',
        'mistakeIds',
        'thesis',
        'images',
        'imageAnnotations',
        'tags',
        'assetType',
        'exchange',
        'underlyingSymbol',
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
        'currencyPair',
        'tradingPair',
        'contractSymbol',
        'cryptoExchange',
        'leverageRatio',
        'useDirectPnLInput',
        'directPnL',
        'reviewed',
        'reviewedAt',
        'templateId',
        'templateVersion',
        'lastBrokerSyncAt',
        'canonicalTradeId',
        'canonicalTradeVersion',
        'canonicalProjectionGeneration',
        'canonicalAccountId',
        'canonicalBroker',
        'canonicalAccountDisplayName',
        'canonicalProjectionSchemaVersion',
        'lossReview',
        'tradeReview',
        'currency',
        'fxRate',
        'fxRateBaseCurrency',
        'forexQuoteCurrency',
        'forexPnlConversionRate',
        'forexPnlConversionBaseCurrency',
        'forexPnlConversionRateDate',
        'forexPnlConversionRateSource',
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
        (contentOverride !== undefined
          ? this.extractFirstCanonicalEntryTime(contentOverride)
          : frontmatterOverride === undefined
            ? await this.extractFirstCanonicalEntryTimeFromContent(file)
            : null);
      const extractedExitTime = normalizedExecution.lastExitTime;
      const takeProfits: TakeProfitTarget[] = Array.isArray(
        frontmatter.takeProfits
      )
        ? frontmatter.takeProfits.flatMap((target) => {
            if (!isRecord(target)) {
              return [];
            }
            const price = this.parseFiniteNumber(target.price);
            const closePercent = this.parseFiniteNumber(target.closePercent);

            if (price === undefined && closePercent === undefined) {
              return [];
            }

            return [
              {
                ...(price !== undefined && { price }),
                ...(closePercent !== undefined && { closePercent }),
              },
            ];
          })
        : [];
      const idealExits: IdealExitTransaction[] = Array.isArray(
        frontmatter.idealExits
      )
        ? frontmatter.idealExits.flatMap((exit) => {
            if (!isRecord(exit)) {
              return [];
            }

            const price = this.parseFiniteNumber(exit.price);
            const size = this.parseFiniteNumber(exit.size);

            if (price === undefined && size === undefined) {
              return [];
            }

            return [
              {
                ...(exit.time !== undefined && {
                  time: new Date(safeString(exit.time)),
                }),
                ...(price !== undefined && { price }),
                ...(size !== undefined && { size }),
              },
            ];
          })
        : [];

      const normalizedTradeReview = normalizeTradeReviewData(
        frontmatter.tradeReview
      );

      
      return {
        path: file.path,
        tradeId: getTradeIdValue(frontmatter.tradeId),
        schemaVersion:
          frontmatter.schemaVersion !== undefined
            ? Number(frontmatter.schemaVersion)
            : undefined,
        tradeRevision: this.getTradeRevisionValue(frontmatter.tradeRevision),
        templateId:
          typeof frontmatter.templateId === 'string'
            ? frontmatter.templateId
            : undefined,
        templateVersion: this.parseFiniteNumber(frontmatter.templateVersion),
        canonicalTradeId: isCanonicalProjection
          ? frontmatter.canonicalTradeId.trim()
          : undefined,
        canonicalTradeVersion: isCanonicalProjection
          ? frontmatter.canonicalTradeVersion
          : undefined,
        canonicalProjectionGeneration:
          isCanonicalProjection &&
          typeof frontmatter.canonicalProjectionGeneration === 'string'
            ? frontmatter.canonicalProjectionGeneration
            : undefined,
        canonicalAccountId:
          isCanonicalProjection &&
          typeof frontmatter.canonicalAccountId === 'string'
            ? frontmatter.canonicalAccountId
            : undefined,
        canonicalBroker:
          isCanonicalProjection &&
          typeof frontmatter.canonicalBroker === 'string'
            ? frontmatter.canonicalBroker
            : undefined,
        canonicalAccountDisplayName:
          isCanonicalProjection &&
          typeof frontmatter.canonicalAccountDisplayName === 'string'
            ? frontmatter.canonicalAccountDisplayName
            : undefined,
        canonicalProjectionSchemaVersion: isCanonicalProjection
          ? frontmatter.canonicalProjectionSchemaVersion
          : undefined,
        type:
          frontmatter.type === 'backtest-trade' ||
          frontmatter.type === 'missed-trade'
            ? frontmatter.type
            : 'trade',
        isMissedTrade:
          frontmatter.type === 'missed-trade' ||
          frontmatter.isMissedTrade === true,
        missedReason:
          typeof frontmatter.missedReason === 'string'
            ? frontmatter.missedReason
            : undefined,
        backendTradeId: this.parseFiniteNumber(frontmatter.backendTradeId),
        tradeImportId:
          typeof frontmatter.tradeImportId === 'string'
            ? frontmatter.tradeImportId
            : undefined,
        tradeImportVersion: this.parseFiniteNumber(
          frontmatter.tradeImportVersion
        ),
        tradeImportAccountId:
          typeof frontmatter.tradeImportAccountId === 'string'
            ? frontmatter.tradeImportAccountId
            : undefined,
        tradeImportAccountBroker:
          typeof frontmatter.tradeImportAccountBroker === 'string'
            ? frontmatter.tradeImportAccountBroker
            : undefined,
        tradeImportAccountDisplayName:
          typeof frontmatter.tradeImportAccountDisplayName === 'string'
            ? frontmatter.tradeImportAccountDisplayName
            : undefined,
        sourceRows:
          frontmatter.sourceRows && Array.isArray(frontmatter.sourceRows)
            ? frontmatter.sourceRows.flatMap((value: unknown) => {
                const sourceRow = Number(value);
                return Number.isFinite(sourceRow) ? [sourceRow] : [];
              })
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
        openQuantity: this.parseFiniteNumber(frontmatter.openQuantity),
        closedQuantity: this.parseFiniteNumber(frontmatter.closedQuantity),
        pnl:
          frontmatter.pnl != null && frontmatter.pnl !== ''
            ? (this.parseFiniteNumber(frontmatter.pnl) ?? 0)
            : isExtractTradeOpen || isCanonicalProjection
              ? null
              : 0,
        _originalPnlWasNull:
          isCanonicalProjection &&
          !isExtractTradeOpen &&
          (frontmatter.pnl === undefined || frontmatter.pnl === null)
            ? true
            : undefined,
        originalPnl: this.parseFiniteNumber(frontmatter.pnl),
        originalRMultiple: this.parseFiniteNumber(frontmatter.rMultiple),
        commission:
          this.parseFiniteNumber(frontmatter.commission) ??
          (isCanonicalProjection ? undefined : 0),
        hasExplicitCommission:
          typeof frontmatter.hasExplicitCommission === 'boolean'
            ? frontmatter.hasExplicitCommission
            : undefined,
        commissionType:
          frontmatter.commissionType === 'percentage' ||
          frontmatter.commissionType === 'fixed'
            ? frontmatter.commissionType
            : undefined,
        swap:
          this.parseFiniteNumber(frontmatter.swap) ??
          (isCanonicalProjection ? undefined : 0),
        fees:
          this.parseFiniteNumber(frontmatter.fees) ??
          (isCanonicalProjection ? undefined : 0),
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
        takeProfits,
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
        
        
        unrealizedPriceSnapshot:
          !areSnapshotKeysClaimedByCustomFields(
            this.plugin?.customFieldsService?.getFields()
          ) &&
          frontmatter.unrealizedPriceSnapshot != null &&
          frontmatter.unrealizedPriceSnapshot !== ''
            ? this.parseFiniteNumber(frontmatter.unrealizedPriceSnapshot)
            : undefined,
        unrealizedPriceSnapshotTime:
          !areSnapshotKeysClaimedByCustomFields(
            this.plugin?.customFieldsService?.getFields()
          ) &&
          (typeof frontmatter.unrealizedPriceSnapshotTime === 'string' ||
            typeof frontmatter.unrealizedPriceSnapshotTime === 'number' ||
            frontmatter.unrealizedPriceSnapshotTime instanceof Date)
            ? (safeParseDateValue(frontmatter.unrealizedPriceSnapshotTime) ??
              undefined)
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
        idealExits,

        
        
        setup: normalizeStringArray(frontmatter.setup).filter(
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
        imageAnnotations: parseImageAnnotations(frontmatter.imageAnnotations),
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
        underlyingSymbol:
          typeof frontmatter.underlyingSymbol === 'string'
            ? frontmatter.underlyingSymbol
            : undefined,
        contractSymbol:
          typeof frontmatter.contractSymbol === 'string'
            ? frontmatter.contractSymbol
            : undefined,
        dollarPerPoint: this.parseFiniteNumber(frontmatter.dollarPerPoint),
        tickSize: this.parseFiniteNumber(frontmatter.tickSize),
        tickValue: this.parseFiniteNumber(frontmatter.tickValue),
        lotSize: this.parseFiniteNumber(frontmatter.lotSize),
        pipValue: this.parseFiniteNumber(frontmatter.pipValue),
        pipSize: this.parseFiniteNumber(frontmatter.pipSize),
        currencyPair:
          typeof frontmatter.currencyPair === 'string'
            ? frontmatter.currencyPair
            : undefined,
        tradingPair:
          typeof frontmatter.tradingPair === 'string'
            ? frontmatter.tradingPair
            : undefined,
        cryptoExchange:
          typeof frontmatter.cryptoExchange === 'string'
            ? frontmatter.cryptoExchange
            : undefined,
        leverageRatio: this.parseFiniteNumber(frontmatter.leverageRatio),
        lossReview: normalizeLossReviewData(frontmatter.lossReview),
        tradeReview: normalizedTradeReview,
        reviewed: frontmatter.reviewed === true,
        reviewedAt:
          typeof frontmatter.reviewedAt === 'string'
            ? frontmatter.reviewedAt
            : undefined,
        currency:
          typeof frontmatter.currency === 'string'
            ? frontmatter.currency
            : undefined,
        fxRate: this.parseFiniteNumber(frontmatter.fxRate),
        fxRateBaseCurrency:
          typeof frontmatter.fxRateBaseCurrency === 'string'
            ? frontmatter.fxRateBaseCurrency
            : undefined,
        forexQuoteCurrency:
          typeof frontmatter.forexQuoteCurrency === 'string'
            ? frontmatter.forexQuoteCurrency
            : undefined,
        forexPnlConversionRate: this.parseFiniteNumber(
          frontmatter.forexPnlConversionRate
        ),
        forexPnlConversionBaseCurrency:
          typeof frontmatter.forexPnlConversionBaseCurrency === 'string'
            ? frontmatter.forexPnlConversionBaseCurrency
            : undefined,
        forexPnlConversionRateDate:
          typeof frontmatter.forexPnlConversionRateDate === 'string'
            ? frontmatter.forexPnlConversionRateDate
            : undefined,
        forexPnlConversionRateSource:
          frontmatter.forexPnlConversionRateSource === 'automatic' ||
          frontmatter.forexPnlConversionRateSource === 'manual'
            ? frontmatter.forexPnlConversionRateSource
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
        lastBrokerSyncAt:
          typeof frontmatter.lastBrokerSyncAt === 'string'
            ? frontmatter.lastBrokerSyncAt
            : undefined,
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
      return this.extractFirstCanonicalEntryTime(content);
    } catch {
      return null;
    }
  }

  private extractFirstCanonicalEntryTime(content: string): Date | null {
    const entriesMatch = content.match(/^entries:\s*\n([\s\S]*?)(?:\n\S|$)/m);
    const timeMatch = entriesMatch?.[1]?.match(/^\s+-\s+time:\s*(.+)$/m);
    const parsed = timeMatch?.[1] ? new Date(timeMatch[1].trim()) : null;
    return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
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

  
  public async updateTradeReview(
    filePath: string,
    tradeReviewData: TradeReviewData,
    _source: string = 'unknown'
  ): Promise<void> {
    try {
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!file || !(file instanceof TFile)) {
        throw new Error(`Invalid file path: ${filePath}`);
      }

      const currentContent = await readFileContentForMutation(this.app, file);
      const migrated = migrateTradeReviewFrontmatterToMarkdown({
        content: currentContent,
        tradeReview: tradeReviewData,
      });
      if (migrated.migrated) {
        await replaceFileContent(this.app, file, migrated.content);
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

        delete frontmatterRecord.tradeReview;
        delete frontmatterRecord.lossReview;
      });

      await forceMetadataCacheRefresh(this.app, file);
      if (shouldPublishCommittedChange) {
        await this.publishCanonicalTradeCommit(filePath, 'updated', {
          suppressLegacyTradeChanged: true,
        });
      }

      eventBus.publish('trade:changed', {
        action: 'trade-review-updated',
        filePaths: [filePath],
      });
    } catch (error) {
      console.error(
        `[TradeService] Error updating trade review for ${filePath}:`,
        error
      );
      throw error;
    }
  }

  public async updateTradeReviewQuestion(
    filePath: string,
    questionId: string,
    questionLabel: string,
    value: string,
    _source: string = 'unknown',
    questionOrder?: Array<{
      id: string;
      label?: string;
      knownLabels?: string[];
      depth?: number;
    }>,
    selectedOptionId?: string
  ): Promise<void> {
    return this.runTradeReviewQuestionWrite(filePath, async () => {
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        throw new Error(`Invalid file path: ${filePath}`);
      }

      const currentContent = await readFileContentForMutation(this.app, file);
      const nextContent = upsertTradeReviewMarkdownQuestion({
        content: currentContent,
        questionId,
        questionLabel,
        value,
        selectedOptionId,
        questionOrder,
      });
      if (nextContent !== currentContent) {
        await replaceFileContent(this.app, file, nextContent);
      }

      await forceMetadataCacheRefresh(this.app, file);
      eventBus.publish('trade:changed', {
        action: 'trade-review-updated',
        filePaths: [filePath],
      });
    }).catch((error: unknown) => {
      console.error(
        `[TradeService] Error updating trade review question for ${filePath}:`,
        error
      );
      throw error;
    });
  }

  private async runTradeReviewQuestionWrite(
    filePath: string,
    write: () => Promise<void>
  ): Promise<void> {
    const previousWrite =
      this.tradeReviewQuestionWriteQueueByFile.get(filePath) ??
      Promise.resolve();
    const nextWrite = previousWrite.catch(() => undefined).then(write);
    this.tradeReviewQuestionWriteQueueByFile.set(filePath, nextWrite);

    try {
      await nextWrite;
    } finally {
      if (
        this.tradeReviewQuestionWriteQueueByFile.get(filePath) === nextWrite
      ) {
        this.tradeReviewQuestionWriteQueueByFile.delete(filePath);
      }
    }
  }

  private async refreshTradeIndexesAfterReviewMigration(): Promise<void> {
    this.indexManager?.markDirty('trades');
    this.indexManager?.markDirty('trade-unique-values');
    await this.clearCache();
    await this.waitForTradeIndexReady();
  }

  public async migrateTradeReviewFrontmatterToMarkdown(): Promise<{
    scanned: number;
    migrated: number;
    failed: number;
  }> {
    const files = this.app.vault.getMarkdownFiles();
    let scanned = 0;
    let migrated = 0;
    let failed = 0;

    for (const file of files) {
      let frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!frontmatter) {
        try {
          frontmatter = await readFrontmatterFromDisk(this.app, file);
        } catch (error) {
          failed++;
          console.error(
            `[TradeService] Failed to inspect trade review frontmatter for ${file.path}:`,
            error
          );
          continue;
        }
      }
      if (!isJournalitTradeNoteFrontmatter(frontmatter)) continue;

      const tradeReview = normalizeTradeReviewData(frontmatter.tradeReview);
      const lossReview = normalizeLossReviewData(frontmatter.lossReview);
      const legacyLossReview = lossReview
        ? { sections: lossReview.sections }
        : undefined;
      if (!tradeReview && !legacyLossReview) continue;
      scanned++;

      try {
        const currentContent = await readFileContentForMutation(this.app, file);
        let nextContent = ensureTradeReviewEndBoundary(currentContent);
        let changed = nextContent !== currentContent;

        if (tradeReview) {
          const result = migrateTradeReviewFrontmatterToMarkdown({
            content: nextContent,
            tradeReview,
          });
          nextContent = result.content;
          changed = changed || result.migrated;
        }

        if (legacyLossReview) {
          const result = migrateTradeReviewFrontmatterToMarkdown({
            content: nextContent,
            tradeReview: legacyLossReview,
          });
          nextContent = result.content;
          changed = changed || result.migrated;
        }

        if (changed) {
          await replaceFileContent(this.app, file, nextContent);
        }
        if (tradeReview || legacyLossReview) {
          await this.app.fileManager.processFrontMatter(file, (fm) => {
            if (isRecord(fm)) {
              const currentLossReview = isRecord(fm.lossReview)
                ? fm.lossReview
                : undefined;
              if (currentLossReview) {
                if (
                  !Object.prototype.hasOwnProperty.call(fm, 'reviewed') &&
                  typeof currentLossReview.reviewed === 'boolean'
                ) {
                  fm.reviewed = currentLossReview.reviewed;
                }
                if (
                  !Object.prototype.hasOwnProperty.call(fm, 'reviewedAt') &&
                  typeof currentLossReview.reviewedAt === 'string'
                ) {
                  fm.reviewedAt = currentLossReview.reviewedAt;
                }
              }
              delete fm.tradeReview;
              delete fm.lossReview;
            }
          });
          await forceMetadataCacheRefresh(this.app, file);
        }
        if (changed || tradeReview || legacyLossReview) migrated++;
      } catch (error) {
        failed++;
        console.error(
          `[TradeService] Failed to migrate trade review markdown for ${file.path}:`,
          error
        );
      }
    }

    if (migrated > 0) {
      await this.refreshTradeIndexesAfterReviewMigration();
    }

    if (failed === 0 && this.plugin?.settings.trade) {
      this.plugin.settings.trade.tradeReviewMarkdownMigrationVersion =
        TRADE_REVIEW_MARKDOWN_MIGRATION_VERSION;
      await this.plugin.saveSettings();
    }

    return { scanned, migrated, failed };
  }

  public async migrateTradeReviewLayout(): Promise<{
    scannedTrades: number;
    repairedTrades: number;
    scannedDrcs: number;
    migratedDrcs: number;
    templateMigrated: boolean;
    conflicts: number;
    failed: number;
  }> {
    const plugin = this.plugin;
    if (!plugin) {
      return {
        scannedTrades: 0,
        repairedTrades: 0,
        scannedDrcs: 0,
        migratedDrcs: 0,
        templateMigrated: false,
        conflicts: 0,
        failed: 1,
      };
    }

    const plan = buildLegacyTradeReviewMigrationPlan(plugin.settings);
    const affectedTradingDays = new Set<string>();
    const drcFiles: Array<{ file: TFile; date: string }> = [];
    let scannedTrades = 0;
    let repairedTrades = 0;
    let scannedDrcs = 0;
    let migratedDrcs = 0;
    let templateMigrated = false;
    let conflicts = 0;
    let failed = 0;

    for (const file of this.app.vault.getMarkdownFiles()) {
      let frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!frontmatter) {
        try {
          frontmatter = await readFrontmatterFromDisk(this.app, file);
        } catch (error) {
          failed++;
          console.error(
            `[TradeService] Failed to inspect trade review layout for ${file.path}:`,
            error
          );
          continue;
        }
      }
      if (!isRecord(frontmatter)) continue;

      if (frontmatter.type === 'drc') {
        const date = getDrcReviewMigrationDate(frontmatter);
        if (date) drcFiles.push({ file, date });
        continue;
      }
      if (!isJournalitTradeNoteFrontmatter(frontmatter)) continue;

      try {
        const currentContent = await readFileContentForMutation(this.app, file);
        const review = parseTradeReviewMarkdown(currentContent);
        if (!review || Object.keys(review.sections).length === 0) continue;
        scannedTrades++;

        for (const tradingDay of getReviewMigrationTradingDays(
          frontmatter,
          plugin
        )) {
          affectedTradingDays.add(tradingDay);
        }

        const tradeTemplateId =
          typeof frontmatter.templateId === 'string'
            ? frontmatter.templateId
            : undefined;
        const repaired = repairLegacyTradeReviewMarkdown({
          content: currentContent,
          labelsByQuestionId:
            (tradeTemplateId
              ? plan.labelsByTemplateId.get(tradeTemplateId)
              : undefined) ?? plan.labelsByQuestionId,
        });
        conflicts += repaired.conflicts;
        if (repaired.repaired) {
          await replaceFileContent(this.app, file, repaired.content);
          await forceMetadataCacheRefresh(this.app, file);
          repairedTrades++;
        }
      } catch (error) {
        failed++;
        console.error(
          `[TradeService] Failed to repair migrated trade review for ${file.path}:`,
          error
        );
      }
    }

    for (const { file, date } of drcFiles) {
      if (!affectedTradingDays.has(date)) continue;
      scannedDrcs++;

      try {
        const currentContent = await readFileContentForMutation(this.app, file);
        const migrated = upsertHistoricalDrcTradeReviewWidget(
          currentContent,
          plan.widgetConfig
        );
        if (migrated.status === 'conflict') {
          conflicts++;
          failed++;
          continue;
        }
        if (migrated.status === 'inserted' || migrated.status === 'updated') {
          await replaceFileContent(this.app, file, migrated.content);
          migratedDrcs++;
        }
      } catch (error) {
        failed++;
        console.error(
          `[TradeService] Failed to add the Trade Review widget to ${file.path}:`,
          error
        );
      }
    }

    const reviewV2Settings = plugin.settings.reviewV2;
    const templateSettings = plugin.settings.templates;
    if (
      reviewV2Settings &&
      templateSettings &&
      Object.keys(plan.widgetConfig).length > 0
    ) {
      const templateService = new ReviewTemplateService(plugin);
      const sourceTemplate = templateService.getDefaultTemplate('drc');
      const existingMigratedTemplate = reviewV2Settings.templates?.find(
        (template) =>
          template.id === MIGRATED_TRADE_REVIEW_DRC_TEMPLATE_ID &&
          template.type === 'drc'
      );
      const templateMigration = createMigratedDefaultDrcTemplate({
        sourceTemplate,
        existingMigratedTemplate,
        legacyConfig: plan.widgetConfig,
        now: new Date().toISOString(),
      });

      if (templateMigration.status === 'conflict') {
        conflicts++;
        failed++;
      } else if (templateMigration.status === 'updated') {
        const migratedTemplate = templateMigration.template;
        const savedTemplates = reviewV2Settings.templates ?? [];
        reviewV2Settings.templates = [
          ...savedTemplates.filter(
            (template) => template.id !== MIGRATED_TRADE_REVIEW_DRC_TEMPLATE_ID
          ),
          migratedTemplate,
        ];
        templateSettings.defaultDrc = migratedTemplate.id;
        templateMigrated = true;
      } else if (
        existingMigratedTemplate &&
        templateSettings.defaultDrc !== existingMigratedTemplate.id
      ) {
        templateSettings.defaultDrc = existingMigratedTemplate.id;
        templateMigrated = true;
      }
    }

    if (repairedTrades > 0) {
      await this.refreshTradeIndexesAfterReviewMigration();
    }
    if (failed === 0) {
      plugin.settings.trade.tradeReviewLayoutMigrationVersion =
        TRADE_REVIEW_LAYOUT_MIGRATION_VERSION;
      await plugin.saveSettings();
    }

    return {
      scannedTrades,
      repairedTrades,
      scannedDrcs,
      migratedDrcs,
      templateMigrated,
      conflicts,
      failed,
    };
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
        if (reviewed) {
          frontmatterRecord.reviewedAt = reviewedAt;
        } else {
          delete frontmatterRecord.reviewedAt;
        }
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
        reviewed,
        reviewedAt: reviewed ? reviewedAt : undefined,
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

    
    const existingFiles = existenceChecks.flatMap(({ file, exists }) =>
      exists ? [file] : []
    );

    
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

      
      if (frontmatter?.isMissedTrade || frontmatter?.type === 'missed-trade') {
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

    
    
    
    const escapedTicker = ticker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const datePattern = getTradeFilenameDateTokens(date).join('|');
    const pattern = new RegExp(
      `^${escapedTicker}-(?:${datePattern})-T(\\d+)\\.md$`
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
        tradeStatus:
          data.tradeStatus === 'CANCELLED'
            ? 'CANCELLED'
            : data.tradeStatus === 'PARTIALLY_CLOSED'
              ? 'PARTIALLY_CLOSED'
              : plan.isOpen
                ? 'OPEN'
                : 'CLOSED',
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

  private hasCanonicalProjectionInVault(
    canonicalTradeId: string,
    excludedPath: string
  ): boolean {
    return this.app.vault.getMarkdownFiles().some((file) => {
      if (file.path === excludedPath) return false;
      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      return (
        hasCanonicalProjectionIdentity(frontmatter) &&
        frontmatter.canonicalTradeId === canonicalTradeId
      );
    });
  }

  
  public async handleTradeDeletion(
    filePath: string,
    deletedFile?: TFile,
    previousFrontmatter?: Record<string, unknown>
  ): Promise<void> {
    try {
      const normalizedPath = normalizePath(filePath);
      const rollbackSuppressed =
        this.rollbackSuppressedDeletionPaths.delete(normalizedPath);
      const pendingCreation =
        this.pendingCreationBatchPaths.delete(normalizedPath);
      if (rollbackSuppressed || pendingCreation) {
        this.discardCreatedTradeState(normalizedPath);
        return;
      }

      
      

      const deletedEntry = this.tradeReadModel.getEntryForPath(filePath);
      const indexedProjection = this.projectionIdentityByPath.get(filePath);
      const deletedFrontmatter =
        previousFrontmatter ??
        (deletedFile
          ? this.app.metadataCache.getFileCache(deletedFile)?.frontmatter
          : null);
      const deletedIdentity = getTradeIdentityFields(
        deletedFrontmatter ?? null
      );
      const deletedCanonicalIdentity =
        hasCanonicalProjectionIdentity(deletedFrontmatter);
      const deletedTradeRevision = this.getTradeRevisionValue(
        deletedFrontmatter?.tradeRevision
      );
      const canonicalTradeId = deletedCanonicalIdentity
        ? deletedFrontmatter.canonicalTradeId
        : (deletedEntry?.canonicalTradeId ??
          indexedProjection?.canonicalTradeId);
      const canonicalTradeVersion = deletedCanonicalIdentity
        ? deletedFrontmatter.canonicalTradeVersion
        : (deletedEntry?.canonicalTradeVersion ??
          indexedProjection?.canonicalTradeVersion);
      const canonicalProjectionGeneration =
        deletedCanonicalIdentity &&
        typeof deletedFrontmatter.canonicalProjectionGeneration === 'string'
          ? deletedFrontmatter.canonicalProjectionGeneration
          : (deletedEntry?.canonicalProjectionGeneration ??
            indexedProjection?.canonicalProjectionGeneration);
      const tradeImportId =
        canonicalTradeId ??
        (typeof deletedFrontmatter?.tradeImportId === 'string'
          ? deletedFrontmatter.tradeImportId
          : deletedEntry?.tradeImportId);
      const tradeImportVersion =
        canonicalTradeVersion ??
        this.parseFiniteNumber(deletedFrontmatter?.tradeImportVersion) ??
        deletedEntry?.tradeImportVersion;

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
      this.projectionIdentityByPath.delete(filePath);

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

      if (tradeImportId && tradeImportVersion !== undefined) {
        try {
          const plugin = getPluginInstance();
          if (plugin) {
            const releaseDeletionIntent = registerTradeProjectionDeletionIntent(
              plugin,
              tradeImportId
            );
            let shouldAcknowledge = false;
            try {
              shouldAcknowledge = await runWithTradeProjectionWriteLock(
                plugin,
                async () => {
                  const remainingProjection =
                    this.hasCanonicalProjectionInVault(
                      tradeImportId,
                      filePath
                    ) ||
                    (await this.getTradeData({ fresh: true })).some(
                      (trade) =>
                        trade.path !== filePath &&
                        (trade.canonicalTradeId === tradeImportId ||
                          trade.tradeImportId === tradeImportId)
                    );
                  if (remainingProjection) {
                    await clearLocalDeletedTradeProjection(
                      plugin,
                      tradeImportId
                    );
                    return { value: false };
                  }
                  await reserveLocalDeletedTradeProjection(
                    plugin,
                    tradeImportId
                  );
                  return { value: true };
                }
              );
            } finally {
              releaseDeletionIntent();
            }
            if (shouldAcknowledge) {
              void acknowledgeLocalDeletedTradeProjection(
                plugin,
                tradeImportId,
                tradeImportVersion,
                filePath,
                canonicalProjectionGeneration
              ).catch(() => {
                // intentional
              });
            }
          }
        } catch {
          // intentional
        }
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
    this.unsubscribeFolderPathChanged?.();
    this.unsubscribeFolderPathChanged = undefined;
    super.cleanup();
  }
}
