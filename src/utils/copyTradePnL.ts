import JournalitPlugin from '../main';
import { calculateActualCommission } from './pnlCalculation';
import { getEffectivePnL } from './tradeStatusUtils';
import { safeString } from './safeString';

type CopyTradeInput = {
  tradeId?: unknown;
  copyBaseTradeKey?: unknown;
  id?: unknown;
  path?: unknown;
  filePath?: unknown;
  ticker?: unknown;
  instrument?: unknown;
  assetType?: unknown;
  account?: unknown;
  positionSize?: unknown;
  entryPrice?: unknown;
  exitTime?: unknown;
  exits?: unknown;
  pnl?: unknown;
  directPnL?: unknown;
  useDirectPnLInput?: unknown;
  commission?: unknown;
  commissionType?: unknown;
  entries?: unknown;
  mae?: unknown;
  mfe?: unknown;
};

type ExecutionRow = {
  size?: number | null;
  notional?: number | null;
  [key: string]: unknown;
};

interface CopyTradeAdjustment {
  pnlAdjustment: number;
  note?: string;
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;

const getNumericValue = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const buildCopyTradePnlInput = (
  trade: CopyTradeInput
): {
  pnl?: number;
  directPnL?: number;
  useDirectPnLInput: boolean;
  commission?: number;
  commissionType: 'fixed' | 'percentage';
  entryPrice?: number;
  positionSize?: number;
  entries?: Array<{ price: number; size: number }>;
} => ({
  pnl: getNumericValue(trade.pnl),
  directPnL: getNumericValue(trade.directPnL),
  useDirectPnLInput:
    trade.useDirectPnLInput === true || trade.useDirectPnLInput === 'true',
  commission: getNumericValue(trade.commission),
  commissionType:
    trade.commissionType === 'percentage' ? 'percentage' : 'fixed',
  entryPrice: getNumericValue(trade.entryPrice),
  positionSize: getNumericValue(trade.positionSize),
  entries: Array.isArray(trade.entries)
    ? trade.entries.flatMap((entry) => {
        const record = asRecord(entry);
        if (!record) {
          return [];
        }
        return typeof record.price === 'number' &&
          typeof record.size === 'number'
          ? [{ price: record.price, size: record.size }]
          : [];
      })
    : undefined,
});

export function getCopyTradeBaseKey(trade: CopyTradeInput): string {
  return safeString(
    trade.copyBaseTradeKey ??
      trade.filePath ??
      trade.path ??
      trade.tradeId ??
      trade.id ??
      'trade'
  );
}

export function getCopyTradeAdjustment(
  plugin: JournalitPlugin,
  baseTradeKey: string,
  copyAccountLookupKey: string
): CopyTradeAdjustment | undefined {
  return plugin.settings.copyTradeAdjustments?.[baseTradeKey]?.[
    copyAccountLookupKey
  ];
}

export function calculateCopiedTradePnL(input: {
  plugin: JournalitPlugin;
  baseTrade: CopyTradeInput;
  copyAccountName: string;
  copyAccountLookupKey: string;
  multiplier: number;
}): { pnl: number; commission?: number; adjustment: number } {
  const baseTradePnlInput = buildCopyTradePnlInput(input.baseTrade);
  const baseNetPnL = getEffectivePnL(baseTradePnlInput);
  const positionSize = Number(input.baseTrade.positionSize ?? 0);
  const commission = input.plugin.optionsService?.calculateInstrumentCommission(
    {
      instrument: safeString(
        input.baseTrade.ticker ?? input.baseTrade.instrument
      ),
      assetType:
        typeof input.baseTrade.assetType === 'string'
          ? input.baseTrade.assetType
          : undefined,
      account: input.copyAccountName,
      positionSize: positionSize * input.multiplier,
      hasExit:
        Boolean(input.baseTrade.exitTime) ||
        (Array.isArray(input.baseTrade.exits) &&
          input.baseTrade.exits.length > 0),
    }
  );
  const adjustment =
    getCopyTradeAdjustment(
      input.plugin,
      getCopyTradeBaseKey(input.baseTrade),
      input.copyAccountLookupKey
    )?.pnlAdjustment ?? 0;

  const basePnLForCopy =
    commission === undefined
      ? baseNetPnL
      : baseNetPnL + Math.abs(calculateActualCommission(baseTradePnlInput));

  return {
    pnl: basePnLForCopy * input.multiplier - (commission ?? 0) + adjustment,
    commission,
    adjustment,
  };
}

export function scaleCopiedTradeExecutionFields<T extends CopyTradeInput>(
  trade: T,
  multiplier: number
): Partial<T> {
  const scaled: Partial<T> = {};

  if (typeof trade.positionSize === 'number') {
    scaled.positionSize = (trade.positionSize *
      multiplier) as T['positionSize'];
  }

  if (Array.isArray(trade.entries)) {
    scaled.entries = trade.entries.map((entry: ExecutionRow) => ({
      ...entry,
      size:
        typeof entry.size === 'number' ? entry.size * multiplier : entry.size,
      notional:
        typeof entry.notional === 'number'
          ? entry.notional * multiplier
          : entry.notional,
    })) as T['entries'];
  }

  if (Array.isArray(trade.exits)) {
    scaled.exits = trade.exits.map((exit: ExecutionRow) => ({
      ...exit,
      size: typeof exit.size === 'number' ? exit.size * multiplier : exit.size,
      notional:
        typeof exit.notional === 'number'
          ? exit.notional * multiplier
          : exit.notional,
    })) as T['exits'];
  }

  if (typeof trade.mae === 'number') {
    scaled.mae = (trade.mae * multiplier) as T['mae'];
  }

  if (typeof trade.mfe === 'number') {
    scaled.mfe = (trade.mfe * multiplier) as T['mfe'];
  }

  return scaled;
}
