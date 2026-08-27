

import { isTradeOpenWithContext } from './tradeStatusUtils';
import {
  calculateAssetAdjustedPriceMoveValue,
  type PriceMoveValueInput,
} from './priceMoveValue';
import { calculateTradeDirectionPriceDiff } from '../services/trade/core/TradeDirection';
import { normalizeTradeExecution } from '../services/trade/core/TradeExecutionNormalization';
import { safeParseDateValue } from './dateUtils';
import { calculatePnL } from './pnlCalculation';
import type { TradeFormData } from '../components/forms/trade/types';

const SIZE_COMPARISON_TOLERANCE = 1e-9;

type UnrealizedPnLTradeInput = PriceMoveValueInput & {
  tradeStatus?: string;
  isMissedTrade?: boolean;
  isBacktestTrade?: boolean;
  useDirectPnLInput?: boolean;
  _originalPnlWasNull?: boolean;
  pnl?: number | null;
  exitTime?: Date | string | null;
  exitPrice?: number | null;
  unrealizedPriceSnapshot?: number | null;
  unrealizedPriceSnapshotTime?: Date | string | number | null;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
    hasExplicitPrice?: boolean;
  }>;
  direction?: string;
  optionType?: string;
};

const UNREALIZED_SNAPSHOT_FRONTMATTER_KEYS = [
  'unrealizedPriceSnapshot',
  'unrealizedPriceSnapshotTime',
] as const;


export function areSnapshotKeysClaimedByCustomFields(
  definitions: ReadonlyArray<{ fieldKey?: string }> | undefined
): boolean {
  return Boolean(
    definitions?.some(
      (definition) =>
        definition.fieldKey !== undefined &&
        (UNREALIZED_SNAPSHOT_FRONTMATTER_KEYS as readonly string[]).includes(
          definition.fieldKey
        )
    )
  );
}

export function hasUnrealizedPriceSnapshot(
  trade: Pick<UnrealizedPnLTradeInput, 'unrealizedPriceSnapshot'>
): boolean {
  return (
    typeof trade.unrealizedPriceSnapshot === 'number' &&
    Number.isFinite(trade.unrealizedPriceSnapshot) &&
    trade.unrealizedPriceSnapshot >= 0
  );
}

interface OpenPositionBasis {
  avgEntryPrice: number;
  remainingSize: number;
}

interface PositionEvent {
  kind: 'entry' | 'exit';
  time: Date | null;
  price: number;
  size: number;
  sequence: number;
}

interface PositionWalk {
  basis: OpenPositionBasis | null;
  lastFlatTime: Date | null;
}

function getPositionEvents(trade: UnrealizedPnLTradeInput): PositionEvent[] {
  const normalizedExecution = normalizeTradeExecution(trade, {
    deriveMissingExplicitness: true,
  });
  const events: PositionEvent[] = [];
  for (const [sequence, entry] of normalizedExecution.entries.entries()) {
    if (
      entry.price !== null &&
      entry.price > 0 &&
      entry.size !== null &&
      entry.size > 0
    ) {
      events.push({
        kind: 'entry',
        time: entry.time,
        price: entry.price,
        size: entry.size,
        sequence,
      });
    }
  }
  for (const [sequence, exit] of normalizedExecution.exits.entries()) {
    if (exit.hasExplicitPrice === true && exit.size !== null && exit.size > 0) {
      events.push({
        kind: 'exit',
        time: exit.time,
        price: 0,
        size: exit.size,
        sequence: normalizedExecution.entries.length + sequence,
      });
    }
  }
  events.sort((left, right) => {
    if (left.time && right.time) {
      return (
        left.time.getTime() - right.time.getTime() ||
        left.sequence - right.sequence
      );
    }
    if (left.time) return 1;
    if (right.time) return -1;
    return left.sequence - right.sequence;
  });

  return events;
}

function walkPosition(
  events: PositionEvent[],
  capturedAt?: Date
): PositionWalk {
  let remainingSize = 0;
  let remainingCost = 0;
  let lastFlatTime: Date | null = null;
  for (const event of events) {
    if (capturedAt && event.time && event.time > capturedAt) continue;

    if (event.kind === 'entry') {
      remainingCost += event.price * event.size;
      remainingSize += event.size;
      continue;
    }

    if (remainingSize <= SIZE_COMPARISON_TOLERANCE) continue;
    const closedSize = Math.min(event.size, remainingSize);
    remainingCost -= (remainingCost / remainingSize) * closedSize;
    remainingSize -= closedSize;
    if (remainingSize <= SIZE_COMPARISON_TOLERANCE) {
      remainingSize = 0;
      remainingCost = 0;
      
      
      lastFlatTime = event.time;
    }
  }

  if (remainingSize <= SIZE_COMPARISON_TOLERANCE) {
    return { basis: null, lastFlatTime };
  }

  const avgEntryPrice = remainingCost / remainingSize;

  return {
    basis: { avgEntryPrice, remainingSize },
    lastFlatTime,
  };
}

function isSnapshotExecutionValidAt(
  captureWalk: PositionWalk,
  fullWalk: PositionWalk,
  capturedAt: Date
): boolean {
  return (
    captureWalk.basis !== null &&
    (fullWalk.lastFlatTime === null || fullWalk.lastFlatTime <= capturedAt)
  );
}


export function isUnrealizedSnapshotExecutionValid(
  trade: UnrealizedPnLTradeInput
): boolean {
  const capturedAt = safeParseDateValue(trade.unrealizedPriceSnapshotTime);
  const events = getPositionEvents(trade);
  if (!capturedAt) {
    return walkPosition(events).basis !== null;
  }

  return isSnapshotExecutionValidAt(
    walkPosition(events, capturedAt),
    walkPosition(events),
    capturedAt
  );
}


export function calculateSnapshotRealizedPnL(
  trade: Partial<TradeFormData>,
  currentRealizedPnL: number
): number {
  const capturedAt = safeParseDateValue(trade.unrealizedPriceSnapshotTime);
  if (!capturedAt) return currentRealizedPnL;

  const existedAtCapture = (time: Date | undefined): boolean =>
    !time || time <= capturedAt;
  const snapshotTrade: Partial<TradeFormData> = {
    ...trade,
    entries: trade.entries?.filter((entry) => existedAtCapture(entry.time)),
    exits: trade.exits?.filter((exit) => existedAtCapture(exit.time)),
    dividends: trade.dividends?.filter((dividend) =>
      existedAtCapture(dividend.time)
    ),
  };
  const currentCalculatedPnL = calculatePnL(trade);
  const snapshotCalculatedPnL = calculatePnL(snapshotTrade);

  return currentRealizedPnL - (currentCalculatedPnL - snapshotCalculatedPnL);
}


export function shouldInvalidateUnrealizedSnapshot(
  previousTrade: UnrealizedPnLTradeInput,
  nextTrade: UnrealizedPnLTradeInput
): boolean {
  const previousEvents = getPositionEvents(previousTrade);
  const nextEvents = getPositionEvents(nextTrade);
  const previousBasis = walkPosition(previousEvents).basis;
  const nextWalk = walkPosition(nextEvents);
  const nextBasis = nextWalk.basis;

  const basesDiffer = (
    previous: OpenPositionBasis | null,
    next: OpenPositionBasis | null
  ): boolean => {
    if (!previous || !next) return previous !== next;
    return (
      previous.avgEntryPrice !== next.avgEntryPrice ||
      previous.remainingSize !== next.remainingSize
    );
  };

  if (basesDiffer(previousBasis, nextBasis)) {
    return true;
  }

  const capturedAt = safeParseDateValue(
    previousTrade.unrealizedPriceSnapshotTime ??
      nextTrade.unrealizedPriceSnapshotTime
  );
  if (!capturedAt) return false;

  const previousCaptureWalk = walkPosition(previousEvents, capturedAt);
  const nextCaptureWalk = walkPosition(nextEvents, capturedAt);
  if (!isSnapshotExecutionValidAt(nextCaptureWalk, nextWalk, capturedAt)) {
    return true;
  }

  return basesDiffer(previousCaptureWalk.basis, nextCaptureWalk.basis);
}


export function calculateUnrealizedPnL(
  trade: UnrealizedPnLTradeInput
): number | null {
  if (trade.isMissedTrade || trade.isBacktestTrade) {
    return null;
  }

  
  
  
  
  if (trade.useDirectPnLInput === true) {
    return null;
  }

  const snapshotPrice = trade.unrealizedPriceSnapshot;
  if (
    typeof snapshotPrice !== 'number' ||
    !Number.isFinite(snapshotPrice) ||
    snapshotPrice < 0
  ) {
    return null;
  }

  const isOpen = isTradeOpenWithContext({
    tradeStatus: trade.tradeStatus,
    exitTime: trade.exitTime,
    exitPrice: trade.exitPrice,
    pnl: trade._originalPnlWasNull ? null : trade.pnl,
    useDirectPnLInput: trade.useDirectPnLInput,
    exits: trade.exits,
    entries: trade.entries,
  });
  if (!isOpen) {
    return null;
  }

  const capturedAt = safeParseDateValue(trade.unrealizedPriceSnapshotTime);
  const events = getPositionEvents(trade);
  const fullWalk = walkPosition(events);
  const captureWalk = capturedAt ? walkPosition(events, capturedAt) : fullWalk;
  if (
    capturedAt &&
    !isSnapshotExecutionValidAt(captureWalk, fullWalk, capturedAt)
  ) {
    return null;
  }
  const basis = captureWalk.basis;
  if (!basis) {
    return null;
  }

  const priceDiff = calculateTradeDirectionPriceDiff(
    trade,
    basis.avgEntryPrice,
    snapshotPrice
  );
  if (priceDiff === null) {
    return null;
  }

  return calculateAssetAdjustedPriceMoveValue(
    trade,
    priceDiff,
    basis.remainingSize
  );
}


export function calculateTotalUnrealizedPnL(
  trades: readonly UnrealizedPnLTradeInput[]
): number {
  let total = 0;
  for (const trade of trades) {
    const unrealized = calculateUnrealizedPnL(trade);
    if (unrealized !== null) {
      total += unrealized;
    }
  }
  return total;
}
