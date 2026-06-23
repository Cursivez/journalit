import { safeString } from '../../../utils/safeString';
import { mapCustomFieldsToFrontmatter } from '../../../utils/customFieldPersistence';
import { deduplicateOptions } from '../../../utils/stringNormalization';
import { CustomFieldDefinition } from '../../../types/customFields';
import { shouldShowTradeDividends } from '../../../components/forms/trade/types';
import { TradeMutationInput } from './types';

export const CANONICAL_EXECUTION_MIGRATION_VERSION =
  '2026-05-canonical-execution-v2';

const LEGACY_AGGREGATE_EXECUTION_FIELDS = [
  'entryTime',
  'exitTime',
  'entryPrice',
  'exitPrice',
  'positionSize',
] as const;

interface SerializeTradeFrontmatterOptions {
  arrayStyle?: 'block' | 'inline';
  scalarStyle?: 'minimal' | 'inline';
  inlineArrayKeys?: string[];
  doubleQuotedInlineArrayKeys?: string[];
  doubleQuotedScalarKeys?: string[];
}

interface BuildTradeFrontmatterOptions {
  tradeStatus: 'OPEN' | 'CLOSED';
  pnl?: number | null;
  rMultiple?: number | null;
  customFieldDefinitions?: CustomFieldDefinition[];
  includeClearedCustomFields?: boolean;
  invalidDateFallback?: 'preserve' | 'now';
}

export function formatTradeFrontmatterDate(
  dateInput: string | Date,
  invalidDateFallback: 'preserve' | 'now' = 'preserve'
): string {
  const parseDateInput = (input: string | Date): Date | null => {
    if (input instanceof Date) {
      return Number.isNaN(input.getTime()) ? null : input;
    }

    const trimmed = input.trim();
    const dateOnlyMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnlyMatch) {
      const [, yy, mm, dd] = dateOnlyMatch;
      const parsed = new Date(
        parseInt(yy, 10),
        parseInt(mm, 10) - 1,
        parseInt(dd, 10),
        0,
        0,
        0
      );

      if (
        parsed.getFullYear() !== parseInt(yy, 10) ||
        parsed.getMonth() !== parseInt(mm, 10) - 1 ||
        parsed.getDate() !== parseInt(dd, 10)
      ) {
        return null;
      }

      return parsed;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const formatLocalDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const date = parseDateInput(dateInput);

  if (!date) {
    console.error(
      `Invalid date input for frontmatter: ${safeString(dateInput)}`
    );
    return invalidDateFallback === 'now'
      ? formatLocalDateTime(new Date())
      : safeString(dateInput);
  }

  return formatLocalDateTime(date);
}

export function buildTradeFrontmatter(
  data: TradeMutationInput,
  options: BuildTradeFrontmatterOptions
): Record<string, unknown> {
  const frontmatterData: Record<string, unknown> = {
    type: 'trade',
    tradeStatus: options.tradeStatus,
  };

  if (data.tradeId) frontmatterData.tradeId = data.tradeId;
  if (data.schemaVersion !== undefined) {
    frontmatterData.schemaVersion = data.schemaVersion;
  }
  if (data.tradeRevision !== undefined) {
    frontmatterData.tradeRevision = data.tradeRevision;
  }
  if (data.backendTradeId && data.backendTradeId !== 0) {
    frontmatterData.backendTradeId = data.backendTradeId;
  }
  if (data.tradeImportId) {
    frontmatterData.tradeImportId = data.tradeImportId;
  }
  if (data.tradeImportVersion !== undefined) {
    frontmatterData.tradeImportVersion = data.tradeImportVersion;
  }
  if (data.tradeImportAccountId) {
    frontmatterData.tradeImportAccountId = data.tradeImportAccountId;
  }
  if (data.tradeImportAccountBroker) {
    frontmatterData.tradeImportAccountBroker = data.tradeImportAccountBroker;
  }
  if (data.tradeImportAccountDisplayName) {
    frontmatterData.tradeImportAccountDisplayName =
      data.tradeImportAccountDisplayName;
  }
  if (data.sourceRows?.length) frontmatterData.sourceRows = data.sourceRows;
  if (data.orderId) frontmatterData.orderId = data.orderId;
  if (data.executionLedgerVersion) {
    frontmatterData.executionLedgerVersion = data.executionLedgerVersion;
  }
  if (data.executionIds?.length)
    frontmatterData.executionIds = data.executionIds;
  if (data.direction) frontmatterData.direction = data.direction;
  if (data.instrument) {
    frontmatterData.instrument = data.instrument;
  }
  if (data.assetType) frontmatterData.assetType = data.assetType;

  if (options.tradeStatus === 'CLOSED') {
    if (typeof data.hasExplicitExitPrice === 'boolean') {
      frontmatterData.hasExplicitExitPrice = data.hasExplicitExitPrice;
    }
    if (options.pnl !== null && options.pnl !== undefined) {
      frontmatterData.pnl = options.pnl;
    }
  } else {
    frontmatterData.pnl = options.pnl ?? undefined;
  }

  if (options.rMultiple !== null && options.rMultiple !== undefined) {
    frontmatterData.rMultiple = options.rMultiple;
  }

  if (data.entries?.length) {
    frontmatterData.entries = data.entries.flatMap((entry) =>
      entry &&
      entry.time &&
      entry.price !== undefined &&
      (data.useDirectPnLInput || (entry.size !== undefined && entry.size > 0))
        ? [
            {
              time: formatTradeFrontmatterDate(
                entry.time,
                options.invalidDateFallback
              ),
              price: entry.price,
              ...(entry.size !== undefined && { size: entry.size }),
              ...(entry.notional !== undefined && { notional: entry.notional }),
            },
          ]
        : []
    );
  }

  if (data.exits?.length) {
    frontmatterData.exits = data.exits.flatMap((exit) =>
      exit &&
      exit.time &&
      exit.price !== undefined &&
      (data.useDirectPnLInput || (exit.size !== undefined && exit.size > 0))
        ? [
            {
              time: formatTradeFrontmatterDate(
                exit.time,
                options.invalidDateFallback
              ),
              price: exit.price,
              ...(exit.size !== undefined && { size: exit.size }),
              ...(exit.notional !== undefined && { notional: exit.notional }),
              ...(typeof exit.hasExplicitPrice === 'boolean' && {
                hasExplicitPrice: exit.hasExplicitPrice,
              }),
            },
          ]
        : []
    );
  }

  if (data.dividends !== undefined && shouldShowTradeDividends(data)) {
    const serializedDividends = (data.dividends || []).flatMap((dividend) =>
      dividend &&
      dividend.time &&
      dividend.amount !== undefined &&
      Number.isFinite(dividend.amount) &&
      dividend.amount !== 0
        ? [
            {
              time: formatTradeFrontmatterDate(
                dividend.time,
                options.invalidDateFallback
              ),
              amount: dividend.amount,
            },
          ]
        : []
    );

    frontmatterData.dividends =
      serializedDividends.length > 0 ? serializedDividends : undefined;
  }

  if (data.commission !== undefined)
    frontmatterData.commission = data.commission;
  if (data.hasExplicitCommission !== undefined) {
    frontmatterData.hasExplicitCommission = data.hasExplicitCommission;
  }
  if (data.commissionType !== undefined) {
    frontmatterData.commissionType = data.commissionType;
  }
  if (data.swap !== undefined) frontmatterData.swap = data.swap;
  if (data.fees !== undefined) frontmatterData.fees = data.fees;
  if (data.rebate !== undefined) frontmatterData.rebate = data.rebate;
  if (data.riskAmount !== undefined)
    frontmatterData.riskAmount = data.riskAmount;
  if (data.stopLoss !== undefined) frontmatterData.stopLoss = data.stopLoss;
  if (data.takeProfits !== undefined) {
    const takeProfits = data.takeProfits.filter(
      (target) => target.price !== undefined
    );
    if (takeProfits.length) {
      frontmatterData.takeProfits = takeProfits.map((target) => ({
        ...(target.price !== undefined && { price: target.price }),
        ...(target.closePercent !== undefined && {
          closePercent: target.closePercent,
        }),
      }));
    } else {
      frontmatterData.takeProfits = undefined;
    }
  }
  if (data.currency !== undefined) frontmatterData.currency = data.currency;
  if (data.brokerBaseCurrencyPnl !== undefined) {
    frontmatterData.brokerBaseCurrencyPnl = data.brokerBaseCurrencyPnl;
  }
  if (data.brokerBaseCurrency !== undefined) {
    frontmatterData.brokerBaseCurrency = data.brokerBaseCurrency;
  }
  if (data.brokerBaseCurrencyPnlSource !== undefined) {
    frontmatterData.brokerBaseCurrencyPnlSource =
      data.brokerBaseCurrencyPnlSource;
  }
  if (data.mae !== undefined) frontmatterData.mae = data.mae;
  if (data.mfe !== undefined) frontmatterData.mfe = data.mfe;
  if (data.maePrice !== undefined) frontmatterData.maePrice = data.maePrice;
  if (data.mfePrice !== undefined) frontmatterData.mfePrice = data.mfePrice;
  if (data.accountId) frontmatterData.accountId = data.accountId;
  if (data.setupIds?.length) frontmatterData.setupIds = data.setupIds;
  if (data.setup?.length) frontmatterData.setup = data.setup;
  const normalizedMistakes = normalizeStringList(data.mistake || []);
  if (normalizedMistakes.length) frontmatterData.mistake = normalizedMistakes;
  if (data.account?.length) frontmatterData.account = data.account;
  if (data.lossReview !== undefined)
    frontmatterData.lossReview = data.lossReview;
  if (data.reviewed !== undefined) frontmatterData.reviewed = data.reviewed;
  if (data.reviewedAt) frontmatterData.reviewedAt = data.reviewedAt;

  if (data.images !== undefined) {
    frontmatterData.images = data.images.length
      ? normalizeImageList(data.images)
      : [];
  }

  frontmatterData.tags = normalizeTagList(data.tags || []);
  frontmatterData.thesis = data.thesis ?? '';
  if (data.mtComment !== undefined) {
    frontmatterData.mtComment = data.mtComment;
  }

  if (data.assetType === 'stock' && data.exchange) {
    frontmatterData.exchange = data.exchange;
  }

  if (data.assetType === 'options') {
    if (data.expirationDate) {
      frontmatterData.expirationDate = formatTradeFrontmatterDate(
        data.expirationDate,
        options.invalidDateFallback
      );
    }
    if (data.strikePrice !== undefined) {
      frontmatterData.strikePrice = data.strikePrice;
    }
    if (data.optionType) frontmatterData.optionType = data.optionType;
    if (data.contractSize !== undefined) {
      frontmatterData.contractSize = data.contractSize;
    }
  }

  if (data.assetType === 'futures') {
    if (data.dollarPerPoint !== undefined) {
      frontmatterData.dollarPerPoint = data.dollarPerPoint;
    }
    if (data.tickSize !== undefined) frontmatterData.tickSize = data.tickSize;
    if (data.tickValue !== undefined)
      frontmatterData.tickValue = data.tickValue;
  }

  if (data.assetType === 'forex') {
    if (data.lotSize !== undefined) frontmatterData.lotSize = data.lotSize;
    if (data.pipValue !== undefined) frontmatterData.pipValue = data.pipValue;
    if (data.pipSize !== undefined) frontmatterData.pipSize = data.pipSize;
  }

  if (data.assetType === 'crypto' && data.cryptoExchange) {
    frontmatterData.cryptoExchange = data.cryptoExchange;
  }

  if (data.assetType === 'cfd') {
    if (data.contractSize !== undefined) {
      frontmatterData.contractSize = data.contractSize;
    }
    if (data.leverageRatio !== undefined) {
      frontmatterData.leverageRatio = data.leverageRatio;
    }
  }

  if (data.useDirectPnLInput !== undefined) {
    frontmatterData.useDirectPnLInput = data.useDirectPnLInput;
  }
  if (data.useDirectPnLInput && data.directPnL !== undefined) {
    frontmatterData.directPnL = data.directPnL;
  }

  try {
    mergeNonConflictingCustomFields(
      frontmatterData,
      mapCustomFieldsToFrontmatter(
        data.customFields,
        options.customFieldDefinitions,
        options.includeClearedCustomFields
          ? { includeClearedFields: true }
          : undefined
      )
    );
  } catch (error) {
    console.error('Error processing custom fields:', error);
    mergeNonConflictingCustomFields(
      frontmatterData,
      mapCustomFieldsToFrontmatter(
        data.customFields,
        [],
        options.includeClearedCustomFields
          ? { includeClearedFields: true }
          : undefined
      )
    );
  }

  return frontmatterData;
}

export function serializeTradeFrontmatter(
  frontmatter: Record<string, unknown>,
  options: SerializeTradeFrontmatterOptions = {}
): string {
  const lines: string[] = ['---'];
  const serializerOptions = {
    arrayStyle: options.arrayStyle || 'block',
    scalarStyle: options.scalarStyle || 'minimal',
    inlineArrayKeys: new Set(options.inlineArrayKeys || []),
    doubleQuotedInlineArrayKeys: new Set(
      options.doubleQuotedInlineArrayKeys || []
    ),
    doubleQuotedScalarKeys: new Set(options.doubleQuotedScalarKeys || []),
  };

  for (const [key, value] of Object.entries(frontmatter)) {
    appendYamlField(lines, key, value, '', serializerOptions);
  }

  lines.push('---');
  return lines.join('\n');
}

export function decodeTradeFrontmatter(
  frontmatter: Record<string, unknown>
): Record<string, unknown> {
  return migrateTradeFrontmatter(frontmatter);
}

export function migrateTradeFrontmatter(
  frontmatter: Record<string, unknown>
): Record<string, unknown> {
  return { ...frontmatter };
}

export function backfillCanonicalExecutionFrontmatter(
  frontmatter: Record<string, unknown>
): boolean {
  if (
    frontmatter.canonicalExecutionMigrationVersion ===
      CANONICAL_EXECUTION_MIGRATION_VERSION &&
    !LEGACY_AGGREGATE_EXECUTION_FIELDS.some((field) => field in frontmatter)
  ) {
    return false;
  }

  let changed = false;
  const isDirectPnL =
    frontmatter.useDirectPnLInput === true ||
    frontmatter.useDirectPnLInput === 'true';
  const entryTime = frontmatter.entryTime;
  const entryPrice = isDirectPnL
    ? parseFiniteFrontmatterNumber(frontmatter.entryPrice)
    : parsePositiveFrontmatterNumber(frontmatter.entryPrice);
  const positionSize = parsePositiveFrontmatterNumber(frontmatter.positionSize);

  if (
    !hasExecutionArray(frontmatter.entries) &&
    hasPresentFrontmatterValue(entryTime) &&
    entryPrice !== null &&
    (isDirectPnL || positionSize !== null)
  ) {
    frontmatter.entries = [
      {
        time: entryTime,
        price: entryPrice,
        ...(positionSize !== null ? { size: positionSize } : {}),
      },
    ];
    changed = true;
  }

  const exitTime = frontmatter.exitTime;
  const exitPrice = parseFiniteFrontmatterNumber(frontmatter.exitPrice);
  if (
    !hasExecutionArray(frontmatter.exits) &&
    hasPresentFrontmatterValue(exitTime) &&
    exitPrice !== null &&
    (isDirectPnL || positionSize !== null)
  ) {
    frontmatter.exits = [
      {
        time: exitTime,
        price: exitPrice,
        ...(positionSize !== null ? { size: positionSize } : {}),
        ...(typeof frontmatter.hasExplicitExitPrice === 'boolean'
          ? { hasExplicitPrice: frontmatter.hasExplicitExitPrice }
          : {}),
      },
    ];
    changed = true;
  }

  const removeLegacyField = (
    field: (typeof LEGACY_AGGREGATE_EXECUTION_FIELDS)[number]
  ) => {
    if (field in frontmatter) {
      delete frontmatter[field];
      changed = true;
    }
  };

  if (
    hasCanonicalEntryTime(
      frontmatter.entries,
      isDirectPnL,
      frontmatter.positionSize
    )
  ) {
    removeLegacyField('entryTime');
  }

  if (
    hasCanonicalEntryPrice(
      frontmatter.entries,
      isDirectPnL,
      frontmatter.positionSize
    )
  ) {
    removeLegacyField('entryPrice');
  }

  if (hasCanonicalPositionSize(frontmatter.entries, frontmatter.positionSize)) {
    removeLegacyField('positionSize');
  }

  if (
    hasCanonicalExitTime(
      frontmatter.exits,
      isDirectPnL,
      frontmatter.positionSize,
      frontmatter.entries
    )
  ) {
    removeLegacyField('exitTime');
  }

  if (
    hasCanonicalExitPrice(
      frontmatter.exits,
      isDirectPnL,
      frontmatter.positionSize,
      frontmatter.entries
    )
  ) {
    removeLegacyField('exitPrice');
  }

  if (changed) {
    frontmatter.canonicalExecutionMigrationVersion =
      CANONICAL_EXECUTION_MIGRATION_VERSION;
  }

  return changed;
}

function hasExecutionArray(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

function getExecutionRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item)
      )
    : [];
}

function hasCanonicalEntryTime(
  entries: unknown,
  isDirectPnL: boolean,
  aggregatePositionSize: unknown
): boolean {
  const entryRecords = getExecutionRecords(entries);
  if (isDirectPnL) {
    return entryRecords.some((entry) => hasPresentFrontmatterValue(entry.time));
  }

  const coveredEntrySize = entryRecords.reduce((sum, entry) => {
    const size = parsePositiveFrontmatterNumber(entry.size ?? entry.quantity);
    return hasPresentFrontmatterValue(entry.time) && size !== null
      ? sum + size
      : sum;
  }, 0);

  return isSizeCoveredByCanonicalExecutions(
    coveredEntrySize,
    aggregatePositionSize,
    entries
  );
}

function hasCanonicalEntryPrice(
  entries: unknown,
  isDirectPnL: boolean,
  aggregatePositionSize: unknown
): boolean {
  const entryRecords = getExecutionRecords(entries);
  if (isDirectPnL) {
    return entryRecords.some(
      (entry) => parseFiniteFrontmatterNumber(entry.price) !== null
    );
  }

  const coveredEntrySize = entryRecords.reduce((sum, entry) => {
    const price = parsePositiveFrontmatterNumber(entry.price);
    const size = parsePositiveFrontmatterNumber(entry.size ?? entry.quantity);
    return price !== null && size !== null ? sum + size : sum;
  }, 0);

  return isSizeCoveredByCanonicalExecutions(
    coveredEntrySize,
    aggregatePositionSize,
    entries
  );
}

function hasCanonicalPositionSize(
  entries: unknown,
  aggregatePositionSize: unknown
): boolean {
  const scalarPositionSize = parsePositiveFrontmatterNumber(
    aggregatePositionSize
  );
  const canonicalPositionSize = getExecutionRecords(entries).reduce(
    (sum, entry) => {
      const size = parsePositiveFrontmatterNumber(entry.size ?? entry.quantity);
      return size !== null ? sum + size : sum;
    },
    0
  );

  if (scalarPositionSize === null) {
    return canonicalPositionSize > 0;
  }

  return Math.abs(canonicalPositionSize - scalarPositionSize) < 1e-9;
}

function hasCanonicalExitTime(
  exits: unknown,
  isDirectPnL: boolean,
  aggregatePositionSize: unknown,
  entries: unknown
): boolean {
  const exitRecords = getExecutionRecords(exits);
  if (isDirectPnL) {
    return exitRecords.some((exit) => hasPresentFrontmatterValue(exit.time));
  }

  const coveredExitSize = exitRecords.reduce((sum, exit) => {
    const size = parsePositiveFrontmatterNumber(exit.size ?? exit.quantity);
    return hasPresentFrontmatterValue(exit.time) && size !== null
      ? sum + size
      : sum;
  }, 0);

  return isSizeCoveredByCanonicalExecutions(
    coveredExitSize,
    aggregatePositionSize,
    entries
  );
}

function hasCanonicalExitPrice(
  exits: unknown,
  isDirectPnL: boolean,
  aggregatePositionSize: unknown,
  entries: unknown
): boolean {
  const exitRecords = getExecutionRecords(exits);
  if (isDirectPnL) {
    return exitRecords.some((exit) => {
      const price = parseFiniteFrontmatterNumber(exit.price);
      const size = parsePositiveFrontmatterNumber(exit.size ?? exit.quantity);
      return price !== null && size !== null;
    });
  }

  const coveredExitSize = exitRecords.reduce((sum, exit) => {
    const price = parseFiniteFrontmatterNumber(exit.price);
    const size = parsePositiveFrontmatterNumber(exit.size ?? exit.quantity);
    return price !== null && size !== null ? sum + size : sum;
  }, 0);

  const scalarPositionSize = parsePositiveFrontmatterNumber(
    aggregatePositionSize
  );
  const canonicalEntrySize = getExecutionRecords(entries).reduce(
    (sum, entry) => {
      const size = parsePositiveFrontmatterNumber(entry.size ?? entry.quantity);
      return size !== null ? sum + size : sum;
    },
    0
  );
  const requiredSize = scalarPositionSize ?? canonicalEntrySize;

  return requiredSize > 0 && Math.abs(coveredExitSize - requiredSize) < 1e-9;
}

function isSizeCoveredByCanonicalExecutions(
  coveredSize: number,
  aggregatePositionSize: unknown,
  entries: unknown
): boolean {
  const scalarPositionSize = parsePositiveFrontmatterNumber(
    aggregatePositionSize
  );
  if (scalarPositionSize !== null) {
    return Math.abs(coveredSize - scalarPositionSize) < 1e-9;
  }

  const canonicalEntrySize = getExecutionRecords(entries).reduce(
    (sum, entry) => {
      const size = parsePositiveFrontmatterNumber(entry.size ?? entry.quantity);
      return size !== null ? sum + size : sum;
    },
    0
  );
  const requiredSize = canonicalEntrySize || coveredSize;

  return requiredSize > 0 && Math.abs(coveredSize - requiredSize) < 1e-9;
}

function hasPresentFrontmatterValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}

function parsePositiveFrontmatterNumber(value: unknown): number | null {
  const parsed = parseFiniteFrontmatterNumber(value);
  return parsed !== null && parsed > 0 ? parsed : null;
}

function parseFiniteFrontmatterNumber(value: unknown): number | null {
  if (!hasPresentFrontmatterValue(value)) {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function mergeNonConflictingCustomFields(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): void {
  for (const [key, value] of Object.entries(source)) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      continue;
    }
    target[key] = value;
  }
}

function normalizeStringList(values: string[]): string[] {
  return deduplicateOptions(
    values.flatMap((value) => {
      const trimmed = value.trim();
      return trimmed ? [trimmed] : [];
    })
  );
}

function normalizeTagList(values: string[]): string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const rawValue of values) {
    const cleaned = rawValue.trim().replace(/^['"`]+|['"`]+$/g, '');
    if (!cleaned) continue;

    const dedupeKey = cleaned.toLowerCase();
    if (seen.has(dedupeKey)) continue;

    seen.add(dedupeKey);
    normalized.push(cleaned);
  }

  return normalized;
}

function normalizeImageList(values: string[]): string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const rawValue of values) {
    const cleaned = rawValue.trim().replace(/^['"`]+|['"`]+$/g, '');
    if (!cleaned) continue;
    const dedupeKey = cleaned.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    normalized.push(cleaned);
  }

  return normalized;
}

function appendYamlField(
  lines: string[],
  key: string,
  value: unknown,
  indent: string,
  options: {
    arrayStyle: 'block' | 'inline';
    scalarStyle: 'minimal' | 'inline';
    inlineArrayKeys: Set<string>;
    doubleQuotedInlineArrayKeys: Set<string>;
    doubleQuotedScalarKeys: Set<string>;
  }
): void {
  if (value === undefined || value === null) {
    return;
  }

  if (Array.isArray(value)) {
    const useInlineArrays =
      indent === '' &&
      (options.arrayStyle === 'inline' || options.inlineArrayKeys.has(key));

    if (value.length === 0) {
      lines.push(`${indent}${key}: []`);
      return;
    }

    if (useInlineArrays && value.every((item) => !isPlainObject(item))) {
      const rendered = value
        .map((item) =>
          options.doubleQuotedInlineArrayKeys.has(key)
            ? `"${escapeYamlDoubleQuoted(String(item))}"`
            : serializeYamlInlineValue(item)
        )
        .join(', ');
      lines.push(`${indent}${key}: [${rendered}]`);
      return;
    }

    lines.push(`${indent}${key}:`);
    value.forEach((item) =>
      appendYamlArrayItem(lines, item, `${indent}  `, options)
    );
    return;
  }

  if (isPlainObject(value)) {
    lines.push(`${indent}${key}:`);
    appendYamlObject(lines, value, `${indent}  `, options);
    return;
  }

  if (typeof value === 'string' && /\r|\n/.test(value)) {
    lines.push(
      `${indent}${key}: ${
        options.scalarStyle === 'inline' ? formatYamlBlockScalar(value) : '|-'
      }`
    );
    if (options.scalarStyle !== 'inline') {
      value.split('\n').forEach((line) => lines.push(`${indent}  ${line}`));
    }
    return;
  }

  const scalar =
    options.doubleQuotedScalarKeys.has(key) && typeof value === 'string'
      ? `"${escapeYamlDoubleQuoted(value)}"`
      : options.scalarStyle === 'inline'
        ? serializeYamlInlineValue(value)
        : formatYamlScalar(value);
  lines.push(`${indent}${key}: ${scalar}`);
}

function appendYamlArrayItem(
  lines: string[],
  value: unknown,
  indent: string,
  options: {
    arrayStyle: 'block' | 'inline';
    scalarStyle: 'minimal' | 'inline';
    inlineArrayKeys: Set<string>;
    doubleQuotedInlineArrayKeys: Set<string>;
    doubleQuotedScalarKeys: Set<string>;
  }
): void {
  if (isPlainObject(value)) {
    const entries = Object.entries(value).filter(
      ([, nestedValue]) => nestedValue !== undefined && nestedValue !== null
    );

    if (entries.length === 0) {
      lines.push(`${indent}- {}`);
      return;
    }

    const [firstKey, firstValue] = entries[0];
    if (
      !Array.isArray(firstValue) &&
      !isPlainObject(firstValue) &&
      !(typeof firstValue === 'string' && /\r|\n/.test(firstValue))
    ) {
      const scalar =
        options.scalarStyle === 'inline'
          ? serializeYamlInlineValue(firstValue)
          : formatYamlScalar(firstValue);
      lines.push(`${indent}- ${firstKey}: ${scalar}`);
      entries.slice(1).forEach(([nestedKey, nestedValue]) => {
        appendYamlField(lines, nestedKey, nestedValue, `${indent}  `, options);
      });
      return;
    }

    lines.push(`${indent}-`);
    entries.forEach(([nestedKey, nestedValue]) => {
      appendYamlField(lines, nestedKey, nestedValue, `${indent}  `, options);
    });
    return;
  }

  const scalar =
    options.scalarStyle === 'inline'
      ? serializeYamlInlineValue(value)
      : formatYamlScalar(value);
  lines.push(`${indent}- ${scalar}`);
}

function appendYamlObject(
  lines: string[],
  value: Record<string, unknown>,
  indent: string,
  options: {
    arrayStyle: 'block' | 'inline';
    scalarStyle: 'minimal' | 'inline';
    inlineArrayKeys: Set<string>;
    doubleQuotedInlineArrayKeys: Set<string>;
    doubleQuotedScalarKeys: Set<string>;
  }
): void {
  Object.entries(value).forEach(([nestedKey, nestedValue]) => {
    appendYamlField(lines, nestedKey, nestedValue, indent, options);
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function formatYamlScalar(value: unknown): string {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const needsQuotes =
      trimmed === '' ||
      trimmed !== value ||
      trimmed.startsWith('"') ||
      trimmed.startsWith("'") ||
      trimmed.endsWith('"') ||
      trimmed.endsWith("'") ||
      /[|>[\]{}*&!%@`]/.test(trimmed) ||
      /^[?\-:#]/.test(trimmed) ||
      /:\s/.test(value) ||
      /\s#/.test(value) ||
      /^(?:true|false|null|~|yes|no|on|off)$/i.test(trimmed);

    return needsQuotes ? JSON.stringify(value) : value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value);
}

function serializeYamlInlineValue(value: unknown): string {
  if (typeof value === 'string') {
    if (value === '') return '""';

    const normalized = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    if (normalized.includes('\n') || requiresYamlQuoting(normalized)) {
      return `"${escapeYamlDoubleQuoted(normalized)}"`;
    }

    return normalized;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return `"${escapeYamlDoubleQuoted(JSON.stringify(value))}"`;
}

function escapeYamlDoubleQuoted(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function requiresYamlQuoting(value: string): boolean {
  if (value.length === 0) return true;
  if (/^\s|\s$/.test(value)) return true;
  if (/^[-?:,[\]{}!&*|>'"%@`]/.test(value)) return true;
  if (/^:/.test(value) || /:\s/.test(value)) return true;
  if (/\s#/.test(value)) return true;
  if (/,/.test(value)) return true;

  return ['true', 'false', 'yes', 'no', 'on', 'off', 'null', '~'].includes(
    value.toLowerCase()
  );
}

function formatYamlBlockScalar(value: string): string {
  const normalized = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const withoutTrailingNewline = normalized.replace(/\n+$/g, '');
  const lines = withoutTrailingNewline.split('\n');
  const indented = lines.map((line) => `  ${line}`).join('\n');
  return `|-\n${indented}`;
}
