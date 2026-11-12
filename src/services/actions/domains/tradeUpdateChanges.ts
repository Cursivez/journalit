import type {
  DividendTransaction,
  IdealExitTransaction,
} from '../../../components/forms/trade/types';
import type { InstrumentContractFields } from '../../trade/instrumentContractDefaults';
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
  isValidTradeRating,
  type TradeRating,
} from '../../../utils/tradeRating';
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
import {
  applyDetailFields,
  applyForexConversion,
  applyOption,
  changeAssetType,
  clearTradeFields,
  dividendsFromWire,
  exchangeKey,
  idealExitsFromWire,
  makeResultOnly,
  resetContractSpecs,
  SPEC_FIELD_NAMES,
  type ForexConversion,
} from './tradeDetailFields';
import { isTradeExecutionOwnedBySync } from '../../agent/trades/tradeExecutionOwnership';
import { extractUserOwnedTradeNotes } from '../../trade/core/TradeNoteDocumentCodec';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput } from '../ActionTypes';


export type TradeUpdateInput = ActionInput<'trade.update'>;
export type FieldChanges = NonNullable<TradeUpdateInput['set']>;

type JournalFieldName = 'thesis' | 'reviewed' | 'rating' | 'notes';
export type JournalChanges = Pick<FieldChanges, JournalFieldName>;

export type FieldName = Exclude<keyof FieldChanges, JournalFieldName>;


export interface TradeChanges {
  
  readonly set: Omit<FieldChanges, JournalFieldName>;
  readonly journal: JournalChanges;
  
  readonly stopLosses?: readonly PlannedTarget[];
  
  readonly takeProfits?: readonly PlannedTarget[];
  readonly executions?: Executions;
  
  readonly removeExecutions: boolean;
  
  readonly idealExits?: readonly IdealExitTransaction[];
  
  readonly dividends?: readonly DividendTransaction[];
  
  readonly forex?: ForexConversion;
  
  readonly requestedAt: Date;
  
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

export const INSTRUMENT_PATTERN = /^[A-Z0-9.]{1,40}$/;
export const FIELD_ORDER: readonly FieldName[] = [
  'instrument',
  'asset_type',
  'option',
  'entry_time',
  'exit_time',
  'setup_id',
  'account_id',
  'direction',
  'stop_loss',
  'take_profit',
  'risk_amount',
  'direct_pnl',
  'commission',
  'commission_type',
  'fees',
  'swap',
  'rebate',
  'currency',
  'fx_rate',
  'forex_conversion_rate',
  'exchange',
  ...SPEC_FIELD_NAMES,
  'mae',
  'mfe',
  'mae_price',
  'mfe_price',
  'unrealized_price_snapshot',
  'missed_reason',
  'exit_reason',
];


export function rederivesTrade(changes: TradeChanges): boolean {
  const { set } = changes;
  return (
    changes.executions !== undefined ||
    changes.removeExecutions ||
    set.direct_pnl !== undefined ||
    set.instrument !== undefined ||
    set.asset_type !== undefined ||
    set.option !== undefined ||
    set.entry_time !== undefined ||
    set.exit_time !== undefined ||
    set.currency !== undefined ||
    set.forex_conversion_rate !== undefined
  );
}


export function affectsForexConversion(changes: TradeChanges): boolean {
  const { set } = changes;
  return (
    set.instrument !== undefined ||
    set.asset_type !== undefined ||
    set.currency !== undefined ||
    set.direct_pnl !== undefined ||
    set.forex_conversion_rate !== undefined ||
    
    
    set.lot_size !== undefined ||
    set.pip_value !== undefined ||
    set.pip_size !== undefined ||
    changes.removeExecutions
  );
}


export interface TradeChangeContext {
  
  readonly calculateCommission?: InstrumentCommissionCalculator;
  
  contractDefaults(
    instrument: string,
    assetType: string
  ): InstrumentContractFields;
  
  instrumentCurrency(instrument: string, assetType: string): string | undefined;
  
  readonly globalCurrency: string;
}

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


export function ratingValue(data: TradeData): TradeRating | null {
  return data.tradeRating !== undefined && isValidTradeRating(data.tradeRating)
    ? data.tradeRating
    : null;
}


export function userNotes(content: string): string {
  return extractUserOwnedTradeNotes(content) ?? '';
}

function journalChanges(input: TradeUpdateInput): JournalChanges {
  const { thesis, reviewed, rating, notes } = input.set ?? {};
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
    ...(rating === undefined ? {} : { rating }),
    ...(notes === undefined ? {} : { notes }),
  };
}

export function normalizeInput(
  input: TradeUpdateInput,
  requestedAt: Date = new Date()
): TradeChanges {
  const set: FieldChanges = { ...(input.set ?? {}) };
  delete set.thesis;
  delete set.reviewed;
  delete set.rating;
  delete set.notes;
  if (input.stop_losses !== undefined && set.stop_loss !== undefined) {
    throw new ActionPlanError('invalid_request', 'stop_losses');
  }
  if (input.take_profits !== undefined && set.take_profit !== undefined) {
    throw new ActionPlanError('invalid_request', 'take_profits');
  }
  if (input.remove_executions && input.executions !== undefined) {
    throw new ActionPlanError('invalid_request', 'remove_executions');
  }
  if (
    set.instrument !== undefined &&
    !INSTRUMENT_PATTERN.test(set.instrument)
  ) {
    throw new ActionPlanError('invalid_request', 'set.instrument');
  }
  for (const field of ['entry_time', 'exit_time'] as const) {
    const value = set[field];
    if (value !== undefined && Number.isNaN(new Date(value).getTime())) {
      throw new ActionPlanError('invalid_request', `set.${field}`);
    }
  }
  
  
  for (const field of ['missed_reason', 'exit_reason'] as const) {
    const value = set[field];
    if (typeof value === 'string' && value.trim() === '')
      throw new ActionPlanError('invalid_request', `set.${field}`);
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
    removeExecutions: input.remove_executions === true,
    ...(input.ideal_exits === undefined
      ? {}
      : { idealExits: idealExitsFromWire(input.ideal_exits) }),
    ...(input.dividends === undefined
      ? {}
      : { dividends: dividendsFromWire(input.dividends, 'dividends') }),
    requestedAt,
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
  context: TradeChangeContext
): TradeData | null {
  const next: TradeData = { ...current };
  const { set } = changes;
  
  
  if (set.instrument !== undefined) next.instrument = set.instrument;
  if (set.asset_type !== undefined && set.asset_type !== current.assetType) {
    changeAssetType(next, set.asset_type);
  }
  if (set.option !== undefined) {
    
    applyOption(
      next,
      set.option,
      'set.option',
      current.assetType === 'options' ? current.contractSize : undefined
    );
  }
  const contractDefaults = context.contractDefaults(
    next.instrument ?? '',
    next.assetType ?? ''
  );
  const instrumentChanged =
    next.instrument !== current.instrument ||
    next.assetType !== current.assetType;
  if (instrumentChanged) resetContractSpecs(next, contractDefaults, set);
  if (
    changes.removeExecutions ||
    set.entry_time !== undefined ||
    set.exit_time !== undefined
  ) {
    const { entry, exit } = resultOnlyTimes(current, set);
    makeResultOnly(next, entry, exit);
  }
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
        next.direction = changes.set.direction ?? next.direction;
        break;
      case 'direct_pnl':
        if (value === null) {
          next.useDirectPnLInput = false;
          clearTradeFields(next, 'directPnL');
        } else {
          next.useDirectPnLInput = true;
          next.directPnL = Number(value);
        }
        break;
      case 'commission':
        if (value === null) {
          
          next.hasExplicitCommission = false;
          clearTradeFields(next, 'commission', 'commissionType');
        } else {
          
          next.commissionType = current.hasExplicitCommission
            ? (current.commissionType ?? 'fixed')
            : 'fixed';
          next.hasExplicitCommission = true;
          next.commission = Number(value);
        }
        break;
      case 'fees':
        if (value === null) clearTradeFields(next, 'fees');
        else next.fees = Number(value);
        break;
      case 'swap':
        if (value === null) clearTradeFields(next, 'swap');
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
        next.missedReason = changes.set.missed_reason ?? '';
        break;
      case 'exit_reason':
        next.exitReason = changes.set.exit_reason ?? '';
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
  
  
  const detailFields =
    instrumentChanged && next.assetType === 'cfd' && set.currency === undefined
      ? {
          ...set,
          currency:
            context.instrumentCurrency(next.instrument ?? '', 'cfd') ?? null,
        }
      : set;
  applyDetailFields(next, detailFields, {
    prefix: 'set.',
    defaults: contractDefaults,
    globalCurrency: context.globalCurrency,
    now: changes.requestedAt,
  });
  if (changes.idealExits) {
    next.idealExits = changes.idealExits.map((exit) => ({ ...exit }));
  }
  if (changes.dividends) {
    next.dividends = changes.dividends.map((dividend) => ({ ...dividend }));
  }
  if (changes.forex) applyForexConversion(next, changes.forex);
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
    changes.removeExecutions ||
    changes.set.account_id !== undefined ||
    changes.set.direct_pnl !== undefined ||
    changes.set.instrument !== undefined ||
    changes.set.asset_type !== undefined ||
    changes.set.commission === null;
  return commissionInputsChanged
    ? applyAutoCommission(next, context.calculateCommission, current)
    : next;
}


export function resultOnlyTimes(
  current: TradeData,
  set: Pick<FieldChanges, 'entry_time' | 'exit_time'>
): { entry: Date; exit: Date } {
  const entry =
    set.entry_time === undefined ? current.entryTime : new Date(set.entry_time);
  const storedExit = current.exitTime ?? current.entryTime;
  const exit =
    set.exit_time !== undefined
      ? new Date(set.exit_time)
      : storedExit.getTime() === current.entryTime.getTime()
        ? entry
        : storedExit;
  return { entry, exit };
}


export function prepareWrite(
  next: TradeData,
  changes: TradeChanges,
  type: 'regular' | 'missed' | 'backtest',
  current: TradeData
): TradeData | null {
  const base =
    !changes.executions &&
    !changes.removeExecutions &&
    changes.set.direct_pnl === undefined &&
    changes.set.entry_time === undefined &&
    changes.set.exit_time === undefined
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
    case 'exit_reason':
      return typeof data.exitReason === 'string' &&
        data.exitReason.trim() !== ''
        ? data.exitReason
        : null;
    case 'instrument':
      return data.instrument;
    case 'asset_type':
      return data.assetType;
    case 'option':
      return [
        data.optionType,
        data.strikePrice,
        data.expirationDate?.getTime(),
        data.contractSize,
      ];
    case 'entry_time':
      return data.entryTime.getTime();
    case 'exit_time':
      return data.exitTime?.getTime();
    case 'commission_type':
      return data.commissionType;
    case 'rebate':
      return data.rebate;
    case 'currency':
      return data.currency;
    case 'fx_rate':
      return [data.fxRate, data.fxRateBaseCurrency];
    case 'forex_conversion_rate':
      return [data.forexPnlConversionRate, data.forexPnlConversionRateSource];
    case 'exchange':
      return data[exchangeKey(data.assetType)];
    case 'dollar_per_point':
      return data.dollarPerPoint;
    case 'tick_size':
      return data.tickSize;
    case 'tick_value':
      return data.tickValue;
    case 'lot_size':
      return data.lotSize;
    case 'pip_value':
      return data.pipValue;
    case 'pip_size':
      return data.pipSize;
    case 'contract_size':
      return data.contractSize;
    case 'leverage_ratio':
      return data.leverageRatio;
    case 'mae':
      return data.mae;
    case 'mfe':
      return data.mfe;
    case 'mae_price':
      return data.maePrice;
    case 'mfe_price':
      return data.mfePrice;
    case 'unrealized_price_snapshot':
      return [
        data.unrealizedPriceSnapshot,
        data.unrealizedPriceSnapshotTime?.getTime(),
      ];
  }
}
