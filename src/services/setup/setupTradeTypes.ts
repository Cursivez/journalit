
import { inferStoredTradeType } from '../../utils/tradeTypeRouting';

export type SetupTradeType = 'regular' | 'missed' | 'backtest';

const SETUP_TRADE_TYPES: readonly SetupTradeType[] = [
  'regular',
  'missed',
  'backtest',
];

export const LIVE_SETUP_TRADE_TYPES: ReadonlySet<SetupTradeType> = new Set([
  'regular',
]);


export function normalizeSetupTradeTypes(value: unknown): SetupTradeType[] {
  const selected = new Set(Array.isArray(value) ? value : []);
  const tradeTypes = SETUP_TRADE_TYPES.filter((tradeType) =>
    selected.has(tradeType)
  );
  return tradeTypes.length > 0 ? tradeTypes : ['regular'];
}

export function isDefaultSetupTradeTypeSelection(
  tradeTypes: readonly SetupTradeType[]
): boolean {
  return tradeTypes.length === 1 && tradeTypes[0] === 'regular';
}

export function getSetupTradeType(trade: {
  path?: unknown;
  type?: unknown;
  isMissedTrade?: unknown;
  isBacktestTrade?: unknown;
}): SetupTradeType {
  return inferStoredTradeType({
    filePath: typeof trade.path === 'string' ? trade.path : undefined,
    type: trade.type,
    isMissedTrade: trade.isMissedTrade,
    isBacktestTrade: trade.isBacktestTrade,
  });
}
