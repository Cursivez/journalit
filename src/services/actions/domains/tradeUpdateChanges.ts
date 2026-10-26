import type { TradeData } from '../../trade/TradeService';
import {
  applyAutoCommission,
  type InstrumentCommissionCalculator,
} from '../../trade/autoCommission';
import {
  isReservedTradeTagPath,
  normalizeTradeTagList,
} from '../../../utils/tradeTagNormalization';
import { normalizeOptionKey } from '../../../utils/stringNormalization';
import {
  customFieldValuesAfter,
  type CustomFieldChange,
} from './tradeCustomFieldValues';
import {
  applyExecutions,
  normalizedTradeForWrite,
  parseExecutions,
  type Executions,
} from './tradeActionSupport';
import { parseTargetList, type PlannedTarget } from './tradePlannedTargets';
import { isTradeExecutionOwnedBySync } from '../../agent/trades/tradeExecutionOwnership';
import { extractUserOwnedTradeNotes } from '../../trade/core/TradeNoteDocumentCodec';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput } from '../ActionTypes';


export type TradeUpdateInput = ActionInput<'trade.update'>;
export type FieldChanges = NonNullable<TradeUpdateInput['set']>;

type JournalFieldName = 'thesis' | 'reviewed' | 'notes';
export type JournalChanges = Pick<FieldChanges, JournalFieldName>;

export type FieldName = Exclude<keyof FieldChanges, JournalFieldName>;


export interface TradeChanges {
  
  readonly set: Omit<FieldChanges, JournalFieldName>;
  readonly journal: JournalChanges;
  
  readonly stopLosses?: readonly PlannedTarget[];
  
  readonly takeProfits?: readonly PlannedTarget[];
  readonly executions?: Executions;
  
  readonly customFields: readonly CustomFieldChange[];
  readonly addTags: readonly string[];
  readonly removeTags: readonly string[];
  readonly addMistakes: readonly string[];
  readonly removeMistakes: readonly string[];
}


export interface EntityLookup {
  readonly account: string | null | undefined;
  readonly setup: string | null | undefined;
}


export interface ResolvedEntities {
  readonly account?: string;
  readonly setup?: string;
}

export function requireResolved(lookup: EntityLookup): ResolvedEntities | null {
  if (lookup.account === null || lookup.setup === null) return null;
  return { account: lookup.account, setup: lookup.setup };
}


export const MAX_TEXT = 20_000;
const MIN_PRICE = -1_000_000_000;
const MAX_VALUE = 1_000_000_000;
const MAX_AMOUNT = 1_000_000_000_000;
export const FIELD_ORDER: readonly FieldName[] = [
  'setup_id',
  'account_id',
  'direction',
  'stop_loss',
  'take_profit',
  'risk_amount',
  'direct_pnl',
  'commission',
  'fees',
  'swap',
  'missed_reason',
];

function trimmedUnique(values: readonly string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed !== '' && !seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
    }
  }
  return result;
}

function validateNumber(field: FieldName, value: number | null): void {
  if (value === null) return;
  const valid =
    field === 'risk_amount'
      ? Number.isFinite(value) && value > 0 && value <= MAX_VALUE
      : field === 'commission' || field === 'fees'
        ? Number.isFinite(value) && value >= 0 && value <= MAX_VALUE
        : field === 'direct_pnl' || field === 'swap'
          ? Number.isFinite(value) && Math.abs(value) <= MAX_AMOUNT
          : Number.isFinite(value) && value >= MIN_PRICE && value <= MAX_VALUE;
  if (!valid) throw new ActionPlanError('invalid_request', `set.${field}`);
}


export function textLength(value: string): number {
  return [...value].length;
}


export function thesisValue(data: TradeData): string | null {
  return typeof data.thesis === 'string' && data.thesis !== ''
    ? data.thesis
    : null;
}


export function userNotes(content: string): string {
  return extractUserOwnedTradeNotes(content) ?? '';
}

function journalChanges(input: TradeUpdateInput): JournalChanges {
  const { thesis, reviewed, notes } = input.set ?? {};
  if (
    thesis !== undefined &&
    thesis !== null &&
    (thesis === '' || textLength(thesis) > MAX_TEXT)
  ) {
    throw new ActionPlanError('invalid_request', 'set.thesis');
  }
  if (notes !== undefined && textLength(notes) > MAX_TEXT) {
    throw new ActionPlanError('invalid_request', 'set.notes');
  }
  return {
    ...(thesis === undefined ? {} : { thesis }),
    ...(reviewed === undefined ? {} : { reviewed }),
    ...(notes === undefined ? {} : { notes }),
  };
}

export function normalizeInput(input: TradeUpdateInput): TradeChanges {
  const set: FieldChanges = { ...(input.set ?? {}) };
  delete set.thesis;
  delete set.reviewed;
  delete set.notes;
  if (input.stop_losses !== undefined && set.stop_loss !== undefined) {
    throw new ActionPlanError('invalid_request', 'stop_losses');
  }
  if (input.take_profits !== undefined && set.take_profit !== undefined) {
    throw new ActionPlanError('invalid_request', 'take_profits');
  }
  if (typeof set.missed_reason === 'string') {
    set.missed_reason = set.missed_reason.trim();
    if (set.missed_reason === '')
      throw new ActionPlanError('invalid_request', 'set.missed_reason');
  }
  for (const field of [
    'stop_loss',
    'take_profit',
    'risk_amount',
    'direct_pnl',
    'commission',
    'fees',
    'swap',
  ] as const) {
    const value = set[field];
    if (value !== undefined) validateNumber(field, value);
  }
  const tags = (field: 'add_tags' | 'remove_tags'): string[] => {
    const raw = input[field];
    if (raw === undefined) return [];
    const labels = normalizeTradeTagList(raw);
    if (labels.length === 0)
      throw new ActionPlanError('invalid_request', field);
    return labels;
  };
  const mistakes = (field: 'add_mistakes' | 'remove_mistakes'): string[] => {
    const raw = input[field];
    if (raw === undefined) return [];
    const labels = trimmedUnique(raw);
    if (labels.length === 0)
      throw new ActionPlanError('invalid_request', field);
    return labels;
  };
  const changes: TradeChanges = {
    set,
    journal: journalChanges(input),
    ...(input.stop_losses === undefined
      ? {}
      : { stopLosses: parseTargetList(input.stop_losses, 'stop_losses') }),
    ...(input.take_profits === undefined
      ? {}
      : { takeProfits: parseTargetList(input.take_profits, 'take_profits') }),
    customFields: [],
    ...(input.executions === undefined
      ? {}
      : { executions: parseExecutions(input.executions) }),
    addTags: tags('add_tags'),
    removeTags: tags('remove_tags'),
    addMistakes: mistakes('add_mistakes'),
    removeMistakes: mistakes('remove_mistakes'),
  };
  const removedTags = new Set(
    changes.removeTags.map((tag) => tag.toLowerCase())
  );
  if (changes.addTags.some((tag) => removedTags.has(tag.toLowerCase()))) {
    throw new ActionPlanError('invalid_request', 'remove_tags');
  }
  const removedMistakes = new Set(
    changes.removeMistakes.map(normalizeOptionKey)
  );
  if (
    changes.addMistakes.some((label) =>
      removedMistakes.has(normalizeOptionKey(label))
    )
  ) {
    throw new ActionPlanError('invalid_request', 'remove_mistakes');
  }
  return changes;
}

function addMistakeLabels(
  current: readonly string[],
  labels: readonly string[]
): string[] {
  const next = [...current];
  const seen = new Set(next.map((label) => normalizeOptionKey(label)));
  for (const label of labels) {
    const key = normalizeOptionKey(label);
    if (key === '' || seen.has(key)) continue;
    seen.add(key);
    next.push(label);
  }
  return next;
}

function removeMistakeLabels(
  current: readonly string[],
  labels: readonly string[]
): string[] {
  const removed = new Set(labels.map((label) => normalizeOptionKey(label)));
  return current.filter((label) => !removed.has(normalizeOptionKey(label)));
}

export function currentTags(data: TradeData): string[] {
  return normalizeTradeTagList(data.tags ?? []);
}


export function applyChanges(
  current: TradeData,
  changes: TradeChanges,
  entities: ResolvedEntities,
  calculateCommission?: InstrumentCommissionCalculator
): TradeData | null {
  const next: TradeData = { ...current };
  for (const field of FIELD_ORDER) {
    const value = changes.set[field];
    if (value === undefined) continue;
    switch (field) {
      case 'account_id':
        if (value === null || entities.account === undefined) {
          next.account = [];
          next.clearAccountAssignment = true;
        } else {
          next.account = [entities.account];
          delete next.clearAccountAssignment;
        }
        break;
      case 'setup_id':
        next.setup =
          value === null || entities.setup === undefined
            ? []
            : [entities.setup];
        break;
      case 'direction':
        next.direction = String(value);
        break;
      case 'direct_pnl':
        if (value === null) {
          next.useDirectPnLInput = false;
          delete next.directPnL;
        } else {
          next.useDirectPnLInput = true;
          next.directPnL = Number(value);
        }
        break;
      case 'commission':
        if (value === null) {
          
          next.hasExplicitCommission = false;
          delete next.commission;
          delete next.commissionType;
        } else {
          next.hasExplicitCommission = true;
          next.commissionType = 'fixed';
          next.commission = Number(value);
        }
        break;
      case 'fees':
        if (value === null) delete next.fees;
        else next.fees = Number(value);
        break;
      case 'swap':
        if (value === null) delete next.swap;
        else next.swap = Number(value);
        break;
      case 'stop_loss': {
        
        const stops = current.stopLosses ?? [];
        if (stops.length > 1) return null;
        next.stopLosses =
          value === null
            ? []
            : stops.length === 0
              ? [{ price: Number(value) }]
              : [{ ...stops[0], price: Number(value) }];
        break;
      }
      case 'risk_amount':
        next.riskAmount = value === null ? undefined : Number(value);
        if (value === null) next.skipDefaultRiskAmount = true;
        break;
      case 'missed_reason':
        next.missedReason = value === null ? '' : String(value);
        break;
      case 'take_profit': {
        const targets = current.takeProfits ?? [];
        if (targets.length > 1) return null;
        next.takeProfits =
          value === null
            ? []
            : targets.length === 0
              ? [{ price: Number(value) }]
              : [{ ...targets[0], price: Number(value) }];
        break;
      }
    }
  }
  if (changes.stopLosses) {
    next.stopLosses = changes.stopLosses.map((target) => ({ ...target }));
  }
  if (changes.takeProfits) {
    next.takeProfits = changes.takeProfits.map((target) => ({ ...target }));
  }
  if (changes.executions) applyExecutions(next, changes.executions);
  if (changes.customFields.length > 0) {
    next.customFields = customFieldValuesAfter(
      current.customFields,
      changes.customFields
    );
  }
  if (changes.addTags.length > 0 || changes.removeTags.length > 0) {
    const existing = currentTags(current);
    const protectedReserved = existing.filter(isReservedTradeTagPath);
    const removed = new Set(changes.removeTags.map((tag) => tag.toLowerCase()));
    const tags = normalizeTradeTagList([
      ...protectedReserved,
      ...normalizeTradeTagList([...existing, ...changes.addTags]).filter(
        (tag) => !removed.has(tag.toLowerCase())
      ),
    ]);
    next.tags = [...tags];
  }
  if (changes.addMistakes.length > 0 || changes.removeMistakes.length > 0) {
    next.mistake = removeMistakeLabels(
      addMistakeLabels(current.mistake ?? [], changes.addMistakes),
      changes.removeMistakes
    );
  }
  
  
  const commissionInputsChanged =
    changes.executions !== undefined ||
    changes.set.account_id !== undefined ||
    changes.set.direct_pnl !== undefined ||
    changes.set.commission === null;
  return commissionInputsChanged
    ? applyAutoCommission(next, calculateCommission, current)
    : next;
}


export function prepareWrite(
  next: TradeData,
  changes: TradeChanges,
  type: 'regular' | 'missed' | 'backtest',
  current: TradeData
): TradeData | null {
  const base =
    !changes.executions && changes.set.direct_pnl === undefined
      ? next
      : (normalizedTradeForWrite(next, type, { requireAccount: false })?.data ??
        null);
  
  
  
  return base && isTradeExecutionOwnedBySync(current)
    ? {
        ...base,
        authoritativePnl: current._originalPnlWasNull
          ? null
          : current.originalPnl,
      }
    : base;
}

export function fieldValue(data: TradeData, field: FieldName): unknown {
  switch (field) {
    case 'account_id':
      return data.clearAccountAssignment ? [] : (data.account ?? []);
    case 'setup_id':
      return data.setup ?? [];
    case 'stop_loss':
      return data.stopLosses?.[0]?.price;
    case 'take_profit':
      return data.takeProfits?.[0]?.price;
    case 'risk_amount':
      return data.riskAmount;
    case 'direction':
      return data.direction;
    case 'direct_pnl':
      return data.useDirectPnLInput ? data.directPnL : undefined;
    case 'commission':
      return data.hasExplicitCommission ? data.commission : undefined;
    case 'fees':
      return data.fees;
    case 'swap':
      return data.swap;
    case 'missed_reason':
      return typeof data.missedReason === 'string' &&
        data.missedReason.trim() !== ''
        ? data.missedReason
        : null;
  }
}
