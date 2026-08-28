import {
  applyFinancialAdjustments,
  calculateDirectionalPriceDiff,
  calculateTotalDividends,
} from '../../utils/pnlCalculation';
import {
  calculateAssetAdjustedPriceMoveValue,
  extractPriceMoveValueFields,
  type PriceMoveValueInput,
  type PriceMoveValueSource,
} from '../../utils/priceMoveValue';
import {
  getEffectivePnL,
  getResolvedWeightedAverageExitPrice,
  getWeightedAverageEntryPrice,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';

type SetupTradePnlSource = PriceMoveValueSource & {
  canonicalTradeId?: string;
  canonicalTradeVersion?: number;
  canonicalProjectionSchemaVersion?: number;
  authoritativePnl?: number | null;
  tradeStatus?: unknown;
  exitTime?: unknown;
  exitPrice?: unknown;
  pnl?: unknown;
  _originalPnlWasNull?: unknown;
  useDirectPnLInput?: unknown;
  directPnL?: unknown;
  dividends?: unknown;
  commission?: unknown;
  commissionType?: unknown;
  swap?: unknown;
  fees?: unknown;
  rebate?: unknown;
  entries?: unknown;
  exits?: unknown;
  entryPrice?: unknown;
  positionSize?: unknown;
  direction?: unknown;
  optionType?: unknown;
  hasExplicitExitPrice?: unknown;
};

type SetupTradePnlInput = Parameters<typeof isPnlContributingTrade>[0] &
  PriceMoveValueInput & {
    entryPrice?: number | null;
    exitPrice?: number | null;
    pnl: number | null;
    directPnL: number | null;
    commissionType?: 'fixed' | 'percentage';
    positionSize: number;
    direction?: string;
    optionType?: string;
    hasExplicitExitPrice?: boolean;
    entries?: Array<{
      time?: Date | string | null;
      price?: number | null;
      size?: number | null;
      hasExplicitPrice?: boolean;
    }>;
    exits?: Array<{
      time?: Date | string | null;
      price?: number | null;
      size?: number | null;
      hasExplicitPrice?: boolean;
    }>;
  };

export function toSetupTradePnlInput(
  trade: SetupTradePnlSource,
  exitTimeOverride?: string
): SetupTradePnlInput {
  const exitTime = exitTimeOverride ?? stringifyDateLike(trade.exitTime);

  return {
    canonicalTradeId: trade.canonicalTradeId,
    canonicalTradeVersion: trade.canonicalTradeVersion,
    canonicalProjectionSchemaVersion: trade.canonicalProjectionSchemaVersion,
    authoritativePnl: trade.authoritativePnl,
    tradeStatus:
      typeof trade.tradeStatus === 'string' ? trade.tradeStatus : undefined,
    exitTime: exitTime || null,
    exitPrice: getOptionalNumber(trade.exitPrice),
    pnl: getOptionalNumber(trade.pnl),
    _originalPnlWasNull: trade._originalPnlWasNull === true,
    useDirectPnLInput: trade.useDirectPnLInput === true,
    directPnL: getOptionalNumber(trade.directPnL),
    dividends: getTradeDividends(trade.dividends),
    commission: getOptionalNumber(trade.commission),
    commissionType:
      trade.commissionType === 'fixed' || trade.commissionType === 'percentage'
        ? trade.commissionType
        : undefined,
    swap: getOptionalNumber(trade.swap),
    fees: getOptionalNumber(trade.fees),
    rebate: getOptionalNumber(trade.rebate),
    entries: getTradeExecutions(trade.entries),
    exits: getTradeExecutions(trade.exits),
    entryPrice: getOptionalNumber(trade.entryPrice),
    positionSize: getOptionalNumber(trade.positionSize) ?? 0,
    direction:
      typeof trade.direction === 'string' ? trade.direction : undefined,
    ...extractPriceMoveValueFields(trade),
    optionType:
      typeof trade.optionType === 'string' ? trade.optionType : undefined,
    hasExplicitExitPrice: trade.hasExplicitExitPrice === true,
  };
}

export function calculateSetupTradePnl(trade: SetupTradePnlInput): number {
  const hasStoredOrDirectPnL =
    trade.pnl !== null ||
    (trade.useDirectPnLInput === true && trade.directPnL !== null);

  if (hasStoredOrDirectPnL) return getEffectivePnL(trade);

  const entryPrice = getWeightedAverageEntryPrice(trade);
  const exitPrice = getResolvedWeightedAverageExitPrice(trade);
  const priceDiff = calculateDirectionalPriceDiff(
    { assetType: trade.assetType, direction: trade.direction || 'long' },
    entryPrice,
    exitPrice
  );

  const grossPnL =
    priceDiff === null
      ? 0
      : calculateAssetAdjustedPriceMoveValue(
          trade,
          priceDiff,
          trade.positionSize
        );
  const netPnL = applyFinancialAdjustments(grossPnL, {
    commission: trade.commission ?? undefined,
    commissionType: trade.commissionType,
    entryPrice: trade.entryPrice ?? undefined,
    positionSize: trade.positionSize,
    entries: trade.entries?.map((entry) => ({
      price: entry.price ?? undefined,
      size: entry.size ?? undefined,
    })),
    swap: trade.swap ?? undefined,
    fees: trade.fees ?? undefined,
    rebate: trade.rebate ?? undefined,
  });

  return netPnL + calculateTotalDividends(trade);
}

function getTradeExecutions(value: unknown): SetupTradePnlInput['entries'] {
  if (!Array.isArray(value)) return undefined;
  return value.flatMap((execution) =>
    isRecord(execution)
      ? [
          {
            time:
              execution.time instanceof Date ||
              typeof execution.time === 'string'
                ? execution.time
                : null,
            price: getOptionalNumber(execution.price),
            size: getOptionalNumber(execution.size),
            ...(typeof execution.hasExplicitPrice === 'boolean' && {
              hasExplicitPrice: execution.hasExplicitPrice,
            }),
          },
        ]
      : []
  );
}

function getTradeDividends(
  value: unknown
): Array<{ amount?: number | null }> | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.flatMap((dividend) =>
    isRecord(dividend) ? [{ amount: getOptionalNumber(dividend.amount) }] : []
  );
}

function getOptionalNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function stringifyDateLike(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString();
  return typeof value === 'string' && value !== '' ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
