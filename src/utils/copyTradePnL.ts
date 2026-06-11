import JournalitPlugin from '../main';
import { calculateActualCommission } from './pnlCalculation';
import { getEffectivePnL } from './tradeStatusUtils';

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

export function getCopyTradeBaseKey(trade: CopyTradeInput): string {
  return String(
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
  const baseNetPnL = getEffectivePnL(input.baseTrade as never);
  const positionSize = Number(input.baseTrade.positionSize ?? 0);
  const commission = input.plugin.optionsService?.calculateInstrumentCommission(
    {
      instrument: String(
        input.baseTrade.ticker ?? input.baseTrade.instrument ?? ''
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
      : baseNetPnL +
        Math.abs(calculateActualCommission(input.baseTrade as never));

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
