import type { AgentEntityIdentityService } from '../../agent/identity/AgentEntityIdentityService';
import type { TradeData } from '../../trade/TradeService';
import { normalizeOptionKey } from '../../../utils/stringNormalization';
import { replaceUserOwnedTradeNotes } from '../../trade/core/TradeNoteDocumentCodec';
import { ActionPlanError } from '../ActionErrors';
import {
  targetListKey,
  wireTargets,
  type TargetListField,
  type WireTarget,
} from './tradePlannedTargets';
import {
  applyChanges,
  currentTags,
  fieldValue,
  FIELD_ORDER,
  MAX_TEXT,
  ratingValue,
  rederivesTrade,
  requireResolved,
  textLength,
  thesisValue,
  userNotes,
  type EntityLookup,
  type FieldChanges,
  type FieldName,
  type JournalChanges,
  type TradeChangeContext,
  type TradeChanges,
  type TradeUpdateInput,
} from './tradeUpdateChanges';
import { exchangeKey } from './tradeDetailFields';



type WireCustomFieldChange = NonNullable<
  TradeUpdateInput['custom_fields']
>[number];


function isWireCustomFieldValue(
  value: unknown
): value is WireCustomFieldChange['value'] {
  return (
    value === null ||
    typeof value === 'string' ||
    (typeof value === 'number' && Number.isFinite(value)) ||
    (Array.isArray(value) && value.every((item) => typeof item === 'string'))
  );
}


function unsetAsNull(value: unknown): unknown {
  return value === undefined ||
    value === null ||
    value === '' ||
    value === false ||
    (Array.isArray(value) && value.length === 0)
    ? null
    : value;
}


function setCustomFields(data: TradeData): string {
  const values = data.customFields ?? {};
  return JSON.stringify(
    Object.keys(values)
      .filter((key) => unsetAsNull(values[key]) !== null)
      .sort()
      .map((key) => [key, values[key]])
  );
}


function labelSet(labels: readonly string[] | undefined): string {
  return JSON.stringify([...(labels ?? [])].sort());
}


const RESTORED_FIELDS = [
  'setup',
  'account',
  'direction',
  'stopLosses',
  'takeProfits',
  'riskAmount',
  'useDirectPnLInput',
  'directPnL',
  'hasExplicitCommission',
  'commission',
  'commissionType',
  'fees',
  'swap',
  'rebate',
  'fxRate',
  'fxRateBaseCurrency',
  'exchange',
  'cryptoExchange',
  'dollarPerPoint',
  'tickSize',
  'tickValue',
  'lotSize',
  'pipValue',
  'pipSize',
  'contractSize',
  'leverageRatio',
  'mae',
  'mfe',
  'maePrice',
  'mfePrice',
  'unrealizedPriceSnapshot',
  'unrealizedPriceSnapshotTime',
  'idealExits',
  'dividends',
  'missedReason',
  'exitReason',
] as const satisfies readonly (keyof TradeData)[];


function sameRestorableFields(left: TradeData, right: TradeData): boolean {
  return (
    RESTORED_FIELDS.every(
      (key) =>
        JSON.stringify(unsetAsNull(left[key])) ===
        JSON.stringify(unsetAsNull(right[key]))
    ) &&
    labelSet(currentTags(left)) === labelSet(currentTags(right)) &&
    labelSet(left.mistake) === labelSet(right.mistake) &&
    setCustomFields(left) === setCustomFields(right)
  );
}

function labelsMissingFrom(
  labels: readonly string[],
  others: readonly string[],
  key: (label: string) => string
): string[] {
  const present = new Set(others.map(key));
  return labels.filter((label) => !present.has(key(label)));
}

function lowerCase(label: string): string {
  return label.toLowerCase();
}


interface NotesCapture {
  readonly previous: string;
  readonly written: string;
}


function restoresJournal(
  journal: JournalChanges,
  previous: TradeData,
  written: TradeData,
  notes: NotesCapture | undefined
): boolean {
  const thesis =
    journal.thesis !== undefined ? journal.thesis : thesisValue(written);
  const reviewed = journal.reviewed ?? written.reviewed === true;
  
  const reviewedAt =
    journal.reviewed === false ? null : unsetAsNull(written.reviewedAt);
  const rating =
    journal.rating !== undefined ? journal.rating : ratingValue(written);
  if (
    thesis !== thesisValue(previous) ||
    reviewed !== (previous.reviewed === true) ||
    reviewedAt !== unsetAsNull(previous.reviewedAt) ||
    rating !== ratingValue(previous)
  ) {
    return false;
  }
  if (journal.notes === undefined) return true;
  if (!notes) return false;
  const restored = replaceUserOwnedTradeNotes(notes.written, journal.notes);
  return restored !== null && userNotes(restored) === userNotes(notes.previous);
}

interface TradeRestoreDependencies {
  entityIdentityService: Pick<
    AgentEntityIdentityService,
    'getOrCreateAccountId' | 'getOrCreateSetupIds'
  >;
  
  resolveChanges(input: TradeUpdateInput): TradeChanges;
  resolveEntities(
    changes: TradeChanges,
    signal: AbortSignal
  ): Promise<EntityLookup>;
  context: TradeChangeContext;
}


export async function captureRestore(
  deps: TradeRestoreDependencies,
  capture: {
    tradeId: string;
    requested: TradeChanges;
    previous: TradeData;
    written: TradeData;
    
    notes?: NotesCapture;
    signal: AbortSignal;
  }
): Promise<TradeUpdateInput | null> {
  const { requested, previous, written, notes, signal } = capture;
  if (rederivesTrade(requested)) return null;
  try {
    const input = await restoringInput(
      deps,
      capture.tradeId,
      requested,
      previous,
      written,
      notes
    );
    if (!input) return null;
    const changes = deps.resolveChanges(input);
    const entities = requireResolved(
      await deps.resolveEntities(changes, signal)
    );
    const restored =
      entities && applyChanges(written, changes, entities, deps.context);
    return restored &&
      sameRestorableFields(restored, previous) &&
      restoresJournal(changes.journal, previous, written, notes)
      ? input
      : null;
  } catch (error) {
    
    if (!(error instanceof ActionPlanError) && !signal.aborted) {
      console.warn('[Journalit] Could not capture a trade change:', error);
    }
    return null;
  }
}


async function restoringInput(
  deps: TradeRestoreDependencies,
  tradeId: string,
  requested: TradeChanges,
  previous: TradeData,
  written: TradeData,
  notes: NotesCapture | undefined
): Promise<TradeUpdateInput | null> {
  const set: FieldChanges = {};
  const { journal } = requested;
  if (
    journal.thesis !== undefined &&
    thesisValue(previous) !== thesisValue(written)
  ) {
    const thesis = thesisValue(previous);
    if (thesis !== null && textLength(thesis) > MAX_TEXT) return null;
    set.thesis = thesis;
  }
  if (
    journal.reviewed !== undefined &&
    (previous.reviewed === true) !== (written.reviewed === true)
  ) {
    
    if (previous.reviewed === true) return null;
    set.reviewed = false;
  }
  if (
    journal.rating !== undefined &&
    ratingValue(previous) !== ratingValue(written)
  ) {
    set.rating = ratingValue(previous);
  }
  if (journal.notes !== undefined) {
    if (!notes) return null;
    const before = userNotes(notes.previous);
    if (before !== userNotes(notes.written)) {
      if (textLength(before) > MAX_TEXT) return null;
      set.notes = before;
    }
  }
  for (const field of FIELD_ORDER) {
    if (requested.set[field] === undefined) continue;
    if (
      JSON.stringify(fieldValue(previous, field)) ===
      JSON.stringify(fieldValue(written, field))
    ) {
      continue;
    }
    const value = await previousFieldValue(deps, previous, field);
    if (value === undefined) return null;
    Object.assign(set, { [field]: value });
  }
  const listRestore = (
    field: TargetListField,
    key: 'stopLosses' | 'takeProfits',
    given: readonly unknown[] | undefined
  ): WireTarget[] | null | undefined =>
    given === undefined ||
    targetListKey(previous[key]) === targetListKey(written[key])
      ? undefined
      : wireTargets(previous[key], field);
  const stopLosses = listRestore(
    'stop_losses',
    'stopLosses',
    requested.stopLosses
  );
  const takeProfits = listRestore(
    'take_profits',
    'takeProfits',
    requested.takeProfits
  );
  if (stopLosses === null || takeProfits === null) return null;
  const idealExits =
    requested.idealExits === undefined ||
    JSON.stringify(previous.idealExits ?? []) ===
      JSON.stringify(written.idealExits ?? [])
      ? undefined
      : wireIdealExits(previous);
  const dividends =
    requested.dividends === undefined ||
    JSON.stringify(previous.dividends ?? []) ===
      JSON.stringify(written.dividends ?? [])
      ? undefined
      : wireDividends(previous);
  if (idealExits === null || dividends === null) return null;
  if (
    (set.stop_loss !== undefined || stopLosses !== undefined) &&
    set.risk_amount === undefined &&
    previous.riskAmount === undefined
  ) {
    
    
    set.risk_amount = null;
  }
  const input: TradeUpdateInput = { trade_id: tradeId };
  if (Object.keys(set).length > 0) input.set = set;
  if (stopLosses) input.stop_losses = stopLosses;
  if (takeProfits) input.take_profits = takeProfits;
  if (idealExits) input.ideal_exits = idealExits;
  if (dividends) input.dividends = dividends;
  const tagsBefore = currentTags(previous);
  const tagsAfter = currentTags(written);
  const addTags = labelsMissingFrom(tagsBefore, tagsAfter, lowerCase);
  const removeTags = labelsMissingFrom(tagsAfter, tagsBefore, lowerCase);
  if (addTags.length > 0) input.add_tags = addTags;
  if (removeTags.length > 0) input.remove_tags = removeTags;
  const mistakesBefore = previous.mistake ?? [];
  const mistakesAfter = written.mistake ?? [];
  const addMistakes = labelsMissingFrom(
    mistakesBefore,
    mistakesAfter,
    normalizeOptionKey
  );
  const removeMistakes = labelsMissingFrom(
    mistakesAfter,
    mistakesBefore,
    normalizeOptionKey
  );
  if (addMistakes.length > 0) input.add_mistakes = addMistakes;
  if (removeMistakes.length > 0) input.remove_mistakes = removeMistakes;
  const customFields: WireCustomFieldChange[] = [];
  for (const { field } of requested.customFields) {
    const before = unsetAsNull(previous.customFields?.[field.id]);
    if (
      JSON.stringify(before) ===
      JSON.stringify(unsetAsNull(written.customFields?.[field.id]))
    ) {
      continue;
    }
    
    
    if (!isWireCustomFieldValue(before)) return null;
    customFields.push({ field_id: field.id, value: before });
  }
  if (customFields.length > 0) input.custom_fields = customFields;
  return Object.keys(input).length > 1 ? input : null;
}


async function previousFieldValue(
  deps: TradeRestoreDependencies,
  previous: TradeData,
  field: FieldName
): Promise<FieldChanges[FieldName] | undefined> {
  const number = (value: number | undefined) =>
    value === undefined ? null : Number.isFinite(value) ? value : undefined;
  switch (field) {
    case 'setup_id': {
      const names = previous.setup ?? [];
      if (names.length === 0) return null;
      if (names.length > 1) return undefined;
      return (
        (await deps.entityIdentityService.getOrCreateSetupIds(names)).get(
          names[0]
        ) ?? undefined
      );
    }
    case 'account_id': {
      const names = previous.clearAccountAssignment
        ? []
        : (previous.account ?? []);
      if (names.length === 0) return null;
      if (names.length > 1) return undefined;
      return (
        (await deps.entityIdentityService.getOrCreateAccountId(names[0])) ??
        undefined
      );
    }
    case 'direction':
      return previous.direction === 'long' || previous.direction === 'short'
        ? previous.direction
        : undefined;
    case 'stop_loss':
      return number(previous.stopLosses?.[0]?.price);
    case 'take_profit':
      return number(previous.takeProfits?.[0]?.price);
    case 'risk_amount':
      return number(previous.riskAmount);
    case 'commission':
      return previous.hasExplicitCommission
        ? (number(previous.commission) ?? undefined)
        : null;
    case 'fees':
      return number(previous.fees);
    case 'swap':
      return number(previous.swap);
    case 'missed_reason':
    case 'exit_reason': {
      const reason = fieldValue(previous, field);
      return typeof reason === 'string' ? reason : null;
    }
    case 'commission_type':
      
      return previous.commissionType;
    case 'rebate':
      return number(previous.rebate);
    case 'fx_rate':
      return number(previous.fxRate);
    case 'exchange': {
      const exchange = previous[exchangeKey(previous.assetType)];
      return typeof exchange === 'string' && exchange !== '' ? exchange : null;
    }
    case 'dollar_per_point':
      return number(previous.dollarPerPoint);
    case 'tick_size':
      return number(previous.tickSize);
    case 'tick_value':
      return number(previous.tickValue);
    case 'lot_size':
      return number(previous.lotSize);
    case 'pip_value':
      return number(previous.pipValue);
    case 'pip_size':
      return number(previous.pipSize);
    case 'contract_size':
      return number(previous.contractSize);
    case 'leverage_ratio':
      return number(previous.leverageRatio);
    case 'mae':
      return number(previous.mae);
    case 'mfe':
      return number(previous.mfe);
    case 'mae_price':
      return number(previous.maePrice);
    case 'mfe_price':
      return number(previous.mfePrice);
    case 'unrealized_price_snapshot': {
      const price = previous.unrealizedPriceSnapshot;
      if (price === undefined) return null;
      const time = previous.unrealizedPriceSnapshotTime;
      
      return Number.isFinite(price) && time && !Number.isNaN(time.getTime())
        ? { price, time: time.toISOString() }
        : undefined;
    }
    
    case 'direct_pnl':
    case 'instrument':
    case 'asset_type':
    case 'option':
    case 'entry_time':
    case 'exit_time':
    case 'currency':
    case 'forex_conversion_rate':
      return undefined;
  }
}


function wireIdealExits(
  previous: TradeData
): NonNullable<TradeUpdateInput['ideal_exits']> | null {
  const exits = previous.idealExits ?? [];
  if (exits.length > 100) return null;
  const wire: NonNullable<TradeUpdateInput['ideal_exits']> = [];
  for (const exit of exits) {
    if (
      exit.price === undefined ||
      !(exit.price > 0) ||
      (exit.time !== undefined && Number.isNaN(exit.time.getTime()))
    ) {
      return null;
    }
    wire.push({
      price: exit.price,
      ...(exit.time === undefined ? {} : { time: exit.time.toISOString() }),
      ...(exit.size === undefined ? {} : { size: exit.size }),
    });
  }
  return wire;
}


function wireDividends(
  previous: TradeData
): NonNullable<TradeUpdateInput['dividends']> | null {
  const dividends = previous.dividends ?? [];
  if (
    dividends.length > 100 ||
    dividends.some(
      (dividend) =>
        Number.isNaN(dividend.time.getTime()) ||
        !Number.isFinite(dividend.amount) ||
        dividend.amount === 0
    )
  ) {
    return null;
  }
  return dividends.map((dividend) => ({
    time: dividend.time.toISOString(),
    amount: dividend.amount,
  }));
}
