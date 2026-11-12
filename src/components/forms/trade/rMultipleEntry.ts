

import {
  calculateStopLossRiskAmount,
  canCalculateStopLossRiskAmount,
  hasStopLossRiskBasis,
} from '../../../utils/riskCalculation';
import { hasAuthoritativePriceMoveMultiplier } from '../../../utils/priceMoveValue';
import type {
  RMultipleEntryField,
  TradeFormData,
  TradeFormREntries,
} from './types';

const R_MULTIPLE_ENTRY_FIELDS: readonly RMultipleEntryField[] = [
  'directPnL',
  'mae',
  'mfe',
];

export const isRMultipleEntryField = (
  field: keyof TradeFormData
): field is RMultipleEntryField =>
  (R_MULTIPLE_ENTRY_FIELDS as readonly PropertyKey[]).includes(field);

const roundTo = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const isPositiveAmount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

export type RMultipleEntryRisk =
  | { status: 'known'; amount: number; source: 'stop' | 'trade' | 'default' }
  
  | { status: 'stop-unpriced' }
  | { status: 'unknown' };


export const resolveRMultipleEntryRisk = (
  data: Partial<TradeFormData>,
  defaultRiskAmount: number | undefined
): RMultipleEntryRisk => {
  if (canCalculateStopLossRiskAmount(data)) {
    if (!hasAuthoritativePriceMoveMultiplier(data)) {
      return { status: 'stop-unpriced' };
    }
    const stopRisk = calculateStopLossRiskAmount(data);
    if (isPositiveAmount(stopRisk)) {
      return { status: 'known', amount: stopRisk, source: 'stop' };
    }
  }
  if (isPositiveAmount(data.riskAmount)) {
    return { status: 'known', amount: data.riskAmount, source: 'trade' };
  }
  if (isPositiveAmount(defaultRiskAmount) && !hasStopLossRiskBasis(data)) {
    return { status: 'known', amount: defaultRiskAmount, source: 'default' };
  }
  return { status: 'unknown' };
};


export const isRMultipleEntryStopUnpriced = (
  data: Partial<TradeFormData>
): boolean =>
  canCalculateStopLossRiskAmount(data) &&
  !hasAuthoritativePriceMoveMultiplier(data);


export const applyRMultipleEntries = (
  data: Partial<TradeFormData>,
  defaultRiskAmount: number | undefined
): Partial<TradeFormData> => {
  const entries = data.rEntries;
  if (!entries) return data;

  const fields = R_MULTIPLE_ENTRY_FIELDS.filter((field) => field in entries);
  if (fields.length === 0) return data;

  const risk = resolveRMultipleEntryRisk(data, defaultRiskAmount);
  const next = { ...data };
  let usesRisk = false;
  for (const field of fields) {
    const rValue = entries[field];
    if (rValue !== undefined && risk.status === 'known') {
      next[field] = roundTo(rValue * risk.amount, 2);
      usesRisk = true;
    } else {
      next[field] = undefined;
    }
  }
  if (usesRisk && risk.status === 'known' && risk.source === 'default') {
    next.riskAmount = risk.amount;
  }
  return next;
};


export const mergeRMultipleEntries = (
  current: TradeFormREntries | undefined,
  update: TradeFormREntries | undefined
): TradeFormREntries | undefined =>
  update === undefined ? current : { ...current, ...update };


export const withoutRMultipleEntry = (
  entries: TradeFormREntries | undefined,
  field: RMultipleEntryField
): TradeFormREntries | undefined => {
  if (!entries || !(field in entries)) return entries;
  const next = { ...entries };
  delete next[field];
  return Object.keys(next).length > 0 ? next : undefined;
};


export const resolveRMultipleEntryDisplayValue = (
  data: Partial<TradeFormData>,
  field: RMultipleEntryField,
  risk: RMultipleEntryRisk
): number | undefined => {
  if (data.rEntries && field in data.rEntries) {
    return data.rEntries[field];
  }
  const currencyValue = data[field];
  if (
    typeof currencyValue !== 'number' ||
    !Number.isFinite(currencyValue) ||
    risk.status !== 'known'
  ) {
    return undefined;
  }
  return roundTo(currencyValue / risk.amount, 2);
};


export const hasUnconvertibleRMultipleEntry = (
  data: Partial<TradeFormData>,
  field: RMultipleEntryField
): boolean => data.rEntries?.[field] !== undefined && data[field] === undefined;

export const hasAnyUnconvertibleRMultipleEntry = (
  data: Partial<TradeFormData>
): boolean =>
  R_MULTIPLE_ENTRY_FIELDS.some((field) =>
    hasUnconvertibleRMultipleEntry(data, field)
  );


export const hasRMultipleEntryValues = (
  data: Partial<TradeFormData>
): boolean =>
  data.rEntries !== undefined &&
  Object.values(data.rEntries).some((value) => value !== undefined);
