
import type JournalitPlugin from '../../main';
import type { PartialTradeFrontmatter } from '../../types/TradeFrontmatter';
import { logger } from '../../utils/logger';
import { isManuallyEnteredTrade } from '../upgrade/manualTradeNudge';
import type { TradeData } from '../trade/TradeService';
import { hasCanonicalProjectionIdentity } from '../trade/core/CanonicalProjectionFields';
import { mapProjectionTradeToTradeData } from './canonicalTradeMapper';
import { applyInstrumentCostRulesToProjection } from './projectionCostRules';
import { TradeProjectionClient } from './TradeProjectionClient';
import type { TradeVerificationRecord } from './types';

export type TradeVerification =
  | { state: 'manual' }
  | { state: 'imported' }
  | { state: 'edited' }
  | { state: 'unavailable' }
  | {
      state: 'verified';
      broker: string;
      environment: TradeVerificationRecord['environment'];
    };


const centsOf = (value: number): string =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const sameMoney = (left: number, right: number): boolean =>
  centsOf(left) === centsOf(right);


const sameQuantity = (left: unknown, right: unknown): boolean =>
  typeof left === 'number' && left === right;


const secondOf = (value: unknown): number =>
  value instanceof Date || typeof value === 'string'
    ? Math.floor(new Date(value).getTime() / 1000)
    : Number.NaN;

const sameCode = (left: unknown, right: unknown): boolean =>
  (typeof left === 'string' ? left.toUpperCase() : null) ===
  (typeof right === 'string' ? right.toUpperCase() : null);

interface FillLeg {
  time?: unknown;
  price?: unknown;
  size?: unknown;
}

function sameLegs(
  shown: readonly FillLeg[] | undefined,
  expected: readonly FillLeg[]
): boolean {
  return (
    shown?.length === expected.length &&
    expected.every(
      (leg, index) =>
        sameQuantity(shown[index].price, leg.price) &&
        sameQuantity(shown[index].size, leg.size) &&
        secondOf(shown[index].time) === secondOf(leg.time)
    )
  );
}


export function noteMatchesBackendTrade(
  data: PartialTradeFrontmatter,
  shownPnl: number,
  expected: TradeData
): boolean {
  const pnl = expected.authoritativePnl;
  if (typeof pnl !== 'number' || !sameMoney(shownPnl, pnl)) return false;
  if (
    data.instrument !== expected.instrument ||
    data.direction?.toLowerCase() !== expected.direction?.toLowerCase() ||
    data.tradeStatus !== expected.tradeStatus ||
    secondOf(data.entryTime) !== secondOf(expected.entryTime) ||
    
    
    typeof expected.currency !== 'string' ||
    expected.currency === '' ||
    !sameCode(data.currency, expected.currency) ||
    !sameCode(data.assetType, expected.assetType) ||
    data.useDirectPnLInput !== expected.useDirectPnLInput
  ) {
    return false;
  }
  const entries = expected.entries ?? [];
  const exits = expected.exits ?? [];
  
  
  return entries.length > 0
    ? sameLegs(data.entries, entries) && sameLegs(data.exits, exits)
    : data.entries?.length === 1 &&
        data.exits?.length === 1 &&
        sameQuantity(data.entries[0].price, expected.entryPrice) &&
        sameQuantity(data.entries[0].size, expected.positionSize) &&
        sameQuantity(data.exits[0].price, expected.exitPrice) &&
        sameQuantity(
          data.exits[0].size,
          expected.closedQuantity ?? expected.positionSize
        );
}


function expectedTradeOf(
  plugin: JournalitPlugin,
  record: TradeVerificationRecord,
  data: PartialTradeFrontmatter
): TradeData | null {
  const base = mapProjectionTradeToTradeData(record.previewTrade, '');
  
  const expected = applyInstrumentCostRulesToProjection(
    { ...base, account: [data.account ?? []].flat() },
    plugin.optionsService
  );
  
  return typeof base.authoritativePnl === 'number' &&
    typeof expected.authoritativePnl === 'number' &&
    expected.authoritativePnl > base.authoritativePnl
    ? null
    : expected;
}


export async function verifyTradeForShare(
  plugin: JournalitPlugin,
  data: PartialTradeFrontmatter,
  shownPnl: number
): Promise<TradeVerification> {
  if (isManuallyEnteredTrade(data)) return { state: 'manual' };
  if (!hasCanonicalProjectionIdentity(data)) return { state: 'unavailable' };
  try {
    const record = await new TradeProjectionClient().getTradeVerification(
      data.canonicalTradeId
    );
    if (record.sourceKind !== 'broker_sync') return { state: 'imported' };
    const expected = expectedTradeOf(plugin, record, data);
    return expected && noteMatchesBackendTrade(data, shownPnl, expected)
      ? {
          state: 'verified',
          broker: record.broker,
          environment: record.environment,
        }
      : { state: 'edited' };
  } catch (error) {
    logger.debug('Trade verification unavailable for sharing', error);
    return { state: 'unavailable' };
  }
}
