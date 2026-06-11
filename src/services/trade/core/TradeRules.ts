import { calculatePnL } from '../../../utils/pnlCalculation';
import { calculateStopLossRiskAmount } from '../../../utils/riskCalculation';
import {
  hasRealizedPnLComponents,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import { normalizeTradeExecution } from './TradeExecutionNormalization';
import { TradeExecutionInput, TradeMutationInput } from './types';

export function deriveTradeOpenState(data: TradeMutationInput): boolean {
  const contextualOpenState = isTradeOpenWithContext({
    tradeStatus: data.tradeStatus,
    exitTime: data.exitTime,
    pnl: null,
    useDirectPnLInput: data.useDirectPnLInput,
    exits: data.exits,
    entries: data.entries,
  });

  if (data.tradeStatus === 'CLOSED') {
    return (
      Boolean(data.entries?.length && data.exits?.length) && contextualOpenState
    );
  }

  return contextualOpenState;
}

export function validateAndNormalizeTradeMutationInput(
  input: TradeMutationInput,
  options?: { allowClosedTradeWithoutExitTimeInDirectPnlMode?: boolean }
): { normalizedData: TradeMutationInput; isOpen: boolean } {
  const normalizedData = { ...input };

  if (normalizedData.useDirectPnLInput) {
    if (normalizedData.entryPrice === undefined) normalizedData.entryPrice = 0;
    if (normalizedData.positionSize === undefined)
      normalizedData.positionSize = 0;

    const directPnlIsOpen = deriveTradeOpenState(normalizedData);
    if (!directPnlIsOpen && normalizedData.exitPrice === undefined) {
      normalizedData.exitPrice = 0;
    }
  }

  normalizeCanonicalExecutionAggregates(normalizedData);

  if (!normalizedData.entryTime) throw new Error('Entry time is required');
  if (!normalizedData.direction && normalizedData.assetType !== 'options') {
    throw new Error('Direction is required');
  }

  const isOpen = deriveTradeOpenState(normalizedData);
  const allowMissingExitTimeInDirectPnlMode =
    options?.allowClosedTradeWithoutExitTimeInDirectPnlMode === true;

  if (
    !isOpen &&
    !normalizedData.exitTime &&
    !(allowMissingExitTimeInDirectPnlMode && normalizedData.useDirectPnLInput)
  ) {
    throw new Error('Exit time is required for closed trades');
  }

  if (!normalizedData.useDirectPnLInput) {
    if (!hasCanonicalEntries(normalizedData)) {
      throw new Error('At least one entry transaction is required');
    }
    if (!isOpen && !hasCanonicalExits(normalizedData)) {
      throw new Error(
        'At least one exit transaction is required for closed trades'
      );
    }
  }

  const hasAccount =
    normalizedData.account && normalizedData.account.length > 0;
  if (!hasAccount) throw new Error('At least one account is required');

  return { normalizedData, isOpen };
}

function hasCanonicalEntries(data: TradeMutationInput): boolean {
  return Boolean(
    data.entries?.some(
      (entry) => entry.time && entry.price !== undefined && entry.size > 0
    )
  );
}

function hasCanonicalExits(data: TradeMutationInput): boolean {
  return Boolean(
    data.exits?.some(
      (exit) => exit.time && exit.price !== undefined && exit.size > 0
    )
  );
}

function normalizeCanonicalExecutionAggregates(data: TradeMutationInput): void {
  synthesizeCanonicalExecutions(data);

  if (data.useDirectPnLInput) {
    return;
  }

  const hasStructuredTransactions =
    (Array.isArray(data.entries) && data.entries.length > 0) ||
    (Array.isArray(data.exits) && data.exits.length > 0);

  if (!hasStructuredTransactions) {
    return;
  }

  const execution = normalizeTradeExecution(data, {
    deriveMissingExplicitness: true,
  });
  const totalEntrySize = execution.entries.reduce(
    (sum, entry) =>
      entry.size !== null && entry.size > 0 ? sum + entry.size : sum,
    0
  );

  if (execution.firstEntryTime) {
    data.entryTime = execution.firstEntryTime;
  }
  if (execution.weightedEntryPrice !== null) {
    data.entryPrice = execution.weightedEntryPrice;
  }
  if (totalEntrySize > 0) {
    data.positionSize = totalEntrySize;
  }

  if (execution.lastExitTime) {
    data.exitTime = execution.lastExitTime;
  }
  if (execution.resolvedExitPrice !== null) {
    data.exitPrice = execution.resolvedExitPrice;
  }
  if (typeof execution.hasExplicitExitPrice === 'boolean') {
    data.hasExplicitExitPrice = execution.hasExplicitExitPrice;
  }
}

function synthesizeCanonicalExecutions(data: TradeMutationInput): void {
  if (
    !data.entries?.length &&
    data.entryTime &&
    data.entryPrice !== undefined
  ) {
    data.entries = data.useDirectPnLInput
      ? [
          {
            time: data.entryTime,
            price: data.entryPrice,
            ...(data.positionSize !== undefined
              ? { size: data.positionSize }
              : {}),
          } as TradeExecutionInput,
        ]
      : [
          {
            time: data.entryTime,
            price: data.entryPrice,
            size: data.positionSize ?? 0,
          },
        ];
  }

  if (
    !data.exits?.length &&
    data.exitTime &&
    data.exitPrice !== undefined &&
    (data.useDirectPnLInput || data.positionSize !== undefined)
  ) {
    data.exits = data.useDirectPnLInput
      ? [
          {
            time: data.exitTime,
            price: data.exitPrice,
            ...(data.positionSize !== undefined
              ? { size: data.positionSize }
              : {}),
            ...(typeof data.hasExplicitExitPrice === 'boolean'
              ? { hasExplicitPrice: data.hasExplicitExitPrice }
              : {}),
          } as TradeExecutionInput,
        ]
      : [
          {
            time: data.exitTime,
            price: data.exitPrice,
            size: data.positionSize,
            ...(typeof data.hasExplicitExitPrice === 'boolean'
              ? { hasExplicitPrice: data.hasExplicitExitPrice }
              : {}),
          } as TradeExecutionInput,
        ];
  }
}

export function applyDefaultRiskAmount(
  input: TradeMutationInput,
  defaultRiskAmount?: number
): TradeMutationInput {
  if (
    !input.skipDefaultRiskAmount &&
    input.riskAmount === undefined &&
    input.stopLoss === undefined &&
    defaultRiskAmount &&
    defaultRiskAmount > 0
  ) {
    return { ...input, riskAmount: defaultRiskAmount };
  }

  return input;
}

export function calculateTradeMutationFinancials(
  data: TradeMutationInput,
  params: { isOpen: boolean; financialFieldsChanged?: boolean }
): { pnl: number | null; rMultiple: number | null } {
  const financialFieldsChanged = params.financialFieldsChanged ?? true;

  let pnl: number | null;
  if (
    params.isOpen &&
    typeof data.authoritativePnl === 'number' &&
    Number.isFinite(data.authoritativePnl)
  ) {
    pnl = data.authoritativePnl;
  } else if (params.isOpen) {
    const openTradePnL = calculatePnL(data as Record<string, unknown>);
    pnl = hasRealizedPnLComponents(data) ? openTradePnL : null;
  } else if (
    typeof data.authoritativePnl === 'number' &&
    Number.isFinite(data.authoritativePnl)
  ) {
    pnl = data.authoritativePnl;
  } else if (!financialFieldsChanged && data.originalPnl !== undefined) {
    pnl = data.originalPnl;
  } else {
    pnl = calculatePnL(data as Record<string, unknown>);
  }

  const hasAuthoritativePnlOverride =
    typeof data.authoritativePnl === 'number' &&
    Number.isFinite(data.authoritativePnl);

  const rMultiple =
    !params.isOpen &&
    !financialFieldsChanged &&
    !hasAuthoritativePnlOverride &&
    data.originalRMultiple !== undefined
      ? data.originalRMultiple
      : calculateRMultipleFromMutation(data, pnl);

  return { pnl, rMultiple };
}

function calculateRMultipleFromMutation(
  data: TradeMutationInput,
  resolvedPnl?: number | null
): number {
  if (
    isTradeOpenWithContext({
      tradeStatus: data.tradeStatus,
      exitTime: data.exitTime,
      pnl: null,
      useDirectPnLInput: data.useDirectPnLInput,
      exits: data.exits,
      entries: data.entries,
    })
  ) {
    return 0;
  }

  const pnl =
    typeof resolvedPnl === 'number' && Number.isFinite(resolvedPnl)
      ? resolvedPnl
      : calculatePnL(data as Record<string, unknown>);
  let riskAmount = calculateStopLossRiskAmount(data as Record<string, unknown>);

  if (
    riskAmount === 0 &&
    typeof data.riskAmount === 'number' &&
    Number.isFinite(data.riskAmount) &&
    data.riskAmount > 0
  ) {
    riskAmount = data.riskAmount;
  }

  return riskAmount === 0 ? 0 : pnl / riskAmount;
}
