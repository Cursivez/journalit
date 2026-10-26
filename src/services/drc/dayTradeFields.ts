

import {
  CustomFieldType,
  type CustomFieldDefinition,
} from '../../types/customFields';
import { serializeCustomFieldValue } from '../../utils/customFieldPersistence';
import {
  DAY_TRADE_FIELD_SOURCES_KEY,
  isEditableJournalField,
  type TradeJournalPatch,
  type TradeJournalValues,
} from '../trade/core/TradeJournalFields';

export const DAY_TRADE_FIELDS_KEY = 'dayTradeFields';

export type DayTradeSelectionField = 'setup' | 'mistake' | 'tags';

const SELECTION_FIELDS: ReadonlySet<string> = new Set<DayTradeSelectionField>([
  'setup',
  'mistake',
  'tags',
]);

export type DayTradeFieldRef = DayTradeSelectionField | `custom:${string}`;

export interface DayTradeFieldRule {
  field: DayTradeFieldRef;
  value: unknown;
}

export type ResolvedDayTradeField =
  | { kind: 'selection'; ref: DayTradeFieldRef; field: DayTradeSelectionField }
  | {
      kind: 'custom';
      ref: DayTradeFieldRef;
      definition: CustomFieldDefinition;
    };

export function customFieldRef(fieldId: string): DayTradeFieldRef {
  return `custom:${fieldId}`;
}

function isSelectionField(value: string): value is DayTradeSelectionField {
  return SELECTION_FIELDS.has(value);
}

export function isDayTradeFieldRef(value: string): value is DayTradeFieldRef {
  return isSelectionField(value) || value.startsWith('custom:');
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const unique = new Set<string>();
  for (const entry of value) {
    if (typeof entry !== 'string') continue;
    const trimmed = entry.trim();
    if (trimmed) unique.add(trimmed);
  }
  return [...unique];
}


export function readDayTradeFieldRules(
  frontmatter: Record<string, unknown> | undefined
): DayTradeFieldRule[] {
  const raw = frontmatter?.[DAY_TRADE_FIELDS_KEY];
  if (!Array.isArray(raw)) return [];
  const rules: DayTradeFieldRule[] = [];
  const seen = new Set<string>();
  for (const entry of raw) {
    if (!isPlainRecord(entry)) continue;
    const field = entry.field;
    if (typeof field !== 'string' || seen.has(field)) continue;
    if (!isDayTradeFieldRef(field)) continue;
    seen.add(field);
    rules.push({ field, value: entry.value });
  }
  return rules;
}

export function resolveDayTradeField(
  ref: DayTradeFieldRef,
  fields: CustomFieldDefinition[]
): ResolvedDayTradeField | null {
  if (isSelectionField(ref)) return { kind: 'selection', ref, field: ref };
  const id = ref.slice('custom:'.length);
  const definition = fields.find((field) => field.id === id);
  return definition && isEditableJournalField(definition)
    ? { kind: 'custom', ref, definition }
    : null;
}

type ScalarDayTradeField = Extract<ResolvedDayTradeField, { kind: 'custom' }>;

function isListField(field: ResolvedDayTradeField): boolean {
  return !isScalarField(field);
}


function isScalarField(
  field: ResolvedDayTradeField
): field is ScalarDayTradeField {
  return (
    field.kind === 'custom' &&
    field.definition.type !== CustomFieldType.MULTISELECT
  );
}


type DayTradeFieldValue = string[] | string | number;

export function normalizeDayTradeFieldValue(
  field: ResolvedDayTradeField,
  value: unknown
): DayTradeFieldValue | undefined {
  if (isListField(field)) {
    const list = stringList(value);
    return list.length ? list : undefined;
  }
  if (field.kind !== 'custom') return undefined;
  
  const serialized = serializeCustomFieldValue(value, field.definition.type);
  if (typeof serialized === 'string') return serialized || undefined;
  if (typeof serialized === 'number') return serialized;
  return undefined;
}

function sameScalar(a: unknown, b: unknown): boolean {
  if (typeof a === 'string' && typeof b === 'string')
    return a.trim() === b.trim();
  return a === b;
}


type DayFieldSources = Record<string, Record<string, DayTradeFieldValue>>;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}


function readDayFieldSources(raw: unknown): DayFieldSources {
  const sources: DayFieldSources = {};
  if (!isPlainRecord(raw)) return sources;
  for (const [day, fields] of Object.entries(raw)) {
    if (!isPlainRecord(fields)) continue;
    const entries: Record<string, DayTradeFieldValue> = {};
    for (const [ref, value] of Object.entries(fields)) {
      const normalized = Array.isArray(value)
        ? stringList(value)
        : storedScalar(value);
      const empty =
        normalized === undefined ||
        (Array.isArray(normalized) && !normalized.length);
      if (!empty) entries[ref] = normalized;
    }
    if (Object.keys(entries).length) sources[day] = entries;
  }
  return sources;
}


function storedScalar(value: unknown): string | number | undefined {
  if (typeof value === 'string') return value.trim() || undefined;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return undefined;
}

function setDaySource(
  sources: DayFieldSources,
  day: string,
  ref: string,
  value: DayTradeFieldValue | undefined
): void {
  const entries = sources[day] ?? {};
  if (value === undefined || (Array.isArray(value) && !value.length)) {
    delete entries[ref];
  } else {
    entries[ref] = value;
  }
  if (Object.keys(entries).length) sources[day] = entries;
  else delete sources[day];
}


function pruneDayFieldSources(
  sources: DayFieldSources,
  current: TradeJournalValues
): void {
  for (const [day, entries] of Object.entries(sources)) {
    for (const [ref, recorded] of Object.entries(entries)) {
      let carried: unknown;
      if (isSelectionField(ref)) {
        carried = current[ref];
      } else if (ref.startsWith('custom:')) {
        const id = ref.slice('custom:'.length);
        
        if (!(id in current.customFields)) continue;
        carried = current.customFields[id];
      } else {
        continue;
      }
      if (Array.isArray(recorded)) {
        const carriedValues = new Set(stringList(carried));
        setDaySource(
          sources,
          day,
          ref,
          recorded.filter((value) => carriedValues.has(value))
        );
      } else if (!sameScalar(storedScalar(carried), recorded)) {
        setDaySource(sources, day, ref, undefined);
      }
    }
  }
}

function sourcesPatch(
  sources: DayFieldSources,
  original: string
): Pick<TradeJournalPatch, 'dayFieldSources'> {
  if (JSON.stringify(sources) === original) return {};
  return { dayFieldSources: Object.keys(sources).length ? sources : null };
}


export function reconcileDayFieldSources(
  current: TradeJournalValues
): Pick<TradeJournalPatch, 'dayFieldSources'> {
  const sources = readDayFieldSources(current.dayFieldSources);
  const original = JSON.stringify(sources);
  pruneDayFieldSources(sources, current);
  return sourcesPatch(sources, original);
}

function otherDaysRecording(
  sources: DayFieldSources,
  day: string,
  ref: string,
  matches: (recorded: DayTradeFieldValue) => boolean
): boolean {
  return Object.entries(sources).some(
    ([sourceDay, entries]) =>
      sourceDay !== day && entries[ref] !== undefined && matches(entries[ref])
  );
}

function planListField(
  field: ResolvedDayTradeField,
  day: string,
  previous: unknown,
  next: unknown,
  current: TradeJournalValues,
  sources: DayFieldSources
): TradeJournalPatch {
  const before = new Set(
    stringList(normalizeDayTradeFieldValue(field, previous))
  );
  const after = stringList(normalizeDayTradeFieldValue(field, next));
  const afterSet = new Set(after);
  const existing =
    field.kind === 'selection'
      ? current[field.field]
      : stringList(current.customFields[field.definition.id]);
  const existingSet = new Set(existing);
  const ownedByOtherDay = (value: string) =>
    otherDaysRecording(sources, day, field.ref, (recorded) =>
      stringList(recorded).includes(value)
    );

  const dayOwned = new Set(stringList(sources[day]?.[field.ref]));
  const added: string[] = [];
  for (const value of after) {
    if (before.has(value) || dayOwned.has(value)) continue;
    if (!existingSet.has(value)) {
      added.push(value);
      dayOwned.add(value);
    } else if (ownedByOtherDay(value)) {
      
      dayOwned.add(value);
    }
  }
  const removed: string[] = [];
  for (const value of [...dayOwned]) {
    if (afterSet.has(value)) continue;
    dayOwned.delete(value);
    if (!ownedByOtherDay(value)) removed.push(value);
  }
  setDaySource(sources, day, field.ref, [...dayOwned]);

  if (!added.length && !removed.length) return {};
  if (field.kind === 'selection') {
    return { [field.field]: { added, removed } };
  }
  const removedSet = new Set(removed);
  const result = [
    ...existing.filter((value) => !removedSet.has(value)),
    ...added,
  ];
  return {
    customFields: {
      [field.definition.id]: result.length ? result : undefined,
    },
  };
}


function planScalarField(
  field: ScalarDayTradeField,
  day: string,
  next: unknown,
  current: TradeJournalValues,
  sources: DayFieldSources
): TradeJournalPatch {
  const id = field.definition.id;
  const after = normalizeDayTradeFieldValue(field, next);
  const tradeValue = normalizeDayTradeFieldValue(
    field,
    current.customFields[id]
  );
  const recordsTradeValue = (recorded: DayTradeFieldValue | undefined) =>
    tradeValue !== undefined && sameScalar(recorded, tradeValue);
  const ownedByOtherDay = otherDaysRecording(
    sources,
    day,
    field.ref,
    recordsTradeValue
  );

  if (
    tradeValue !== undefined &&
    !recordsTradeValue(sources[day]?.[field.ref]) &&
    !ownedByOtherDay
  ) {
    
    setDaySource(sources, day, field.ref, undefined);
    return {};
  }
  
  
  
  const ownedByLaterDay = Object.entries(sources).some(
    ([sourceDay, entries]) =>
      sourceDay > day &&
      entries[field.ref] !== undefined &&
      recordsTradeValue(entries[field.ref])
  );
  if (
    after !== undefined &&
    !sameScalar(tradeValue, after) &&
    ownedByLaterDay
  ) {
    setDaySource(sources, day, field.ref, undefined);
    return {};
  }
  if (after === undefined) {
    setDaySource(sources, day, field.ref, undefined);
    
    if (ownedByOtherDay || tradeValue === undefined) return {};
    return { customFields: { [id]: undefined } };
  }
  setDaySource(sources, day, field.ref, after);
  if (sameScalar(tradeValue, after)) return {};
  return { customFields: { [id]: after } };
}

export interface DayTradeFieldUpdate {
  field: ResolvedDayTradeField;
  
  previous: unknown;
  next: unknown;
}


export function planDayTradeFieldUpdate(
  day: string,
  updates: DayTradeFieldUpdate[],
  current: TradeJournalValues
): TradeJournalPatch {
  const sources = readDayFieldSources(current.dayFieldSources);
  const original = JSON.stringify(sources);
  pruneDayFieldSources(sources, current);
  const merged = mergeTradeJournalPatches(
    updates.map(({ field, previous, next }) =>
      isScalarField(field)
        ? planScalarField(field, day, next, current, sources)
        : planListField(field, day, previous, next, current, sources)
    )
  );
  return { ...merged, ...sourcesPatch(sources, original) };
}

function mergeTradeJournalPatches(
  patches: TradeJournalPatch[]
): TradeJournalPatch {
  const merged: TradeJournalPatch = {};
  for (const patch of patches) {
    if (patch.setup) merged.setup = patch.setup;
    if (patch.mistake) merged.mistake = patch.mistake;
    if (patch.tags) merged.tags = patch.tags;
    if (patch.customFields) {
      merged.customFields = { ...merged.customFields, ...patch.customFields };
    }
  }
  return merged;
}


export interface DayTradeFieldChange {
  ref: DayTradeFieldRef;
  previous: unknown;
  next: unknown;
}


export function diffDayTradeFieldRules(
  saved: DayTradeFieldRule[],
  draft: DayTradeFieldRule[],
  fields: CustomFieldDefinition[]
): { nextRules: DayTradeFieldRule[]; changes: DayTradeFieldChange[] } {
  const nextRules: DayTradeFieldRule[] = [];
  const changes: DayTradeFieldChange[] = [];
  const nextByRef = new Map<DayTradeFieldRef, unknown>();
  for (const rule of draft) {
    const field = resolveDayTradeField(rule.field, fields);
    if (!field) continue;
    const value = normalizeDayTradeFieldValue(field, rule.value);
    if (value === undefined) continue;
    nextRules.push({ field: rule.field, value });
    nextByRef.set(rule.field, value);
  }
  const savedByRef = new Map(saved.map((rule) => [rule.field, rule.value]));
  const refs = new Set<DayTradeFieldRef>([
    ...savedByRef.keys(),
    ...nextByRef.keys(),
  ]);
  for (const ref of refs) {
    const field = resolveDayTradeField(ref, fields);
    if (!field) continue;
    const previous = normalizeDayTradeFieldValue(field, savedByRef.get(ref));
    const next = nextByRef.get(ref);
    if (JSON.stringify(previous) !== JSON.stringify(next)) {
      changes.push({ ref, previous, next });
    }
  }
  return { nextRules, changes };
}


export interface DayTradeFieldOptionRewrite {
  field: DayTradeSelectionField;
  matches: (value: string) => boolean;
  rewrite: (values: string[]) => string[];
}


export type DayTradeFieldOptionWrites = {
  [DAY_TRADE_FIELDS_KEY]?: Record<string, unknown>[] | null;
  [DAY_TRADE_FIELD_SOURCES_KEY]?: Record<string, unknown> | null;
};

function rewriteOptionList(
  values: string[],
  rewrite: DayTradeFieldOptionRewrite
): string[] | undefined {
  if (!values.some(rewrite.matches)) return undefined;
  return stringList(rewrite.rewrite(values));
}


export interface DayTradeFieldRetainedValues {
  values: readonly string[];
  key: (value: string) => string;
}


function withRetainedSpelling(
  rewrite: DayTradeFieldOptionRewrite,
  retained: DayTradeFieldRetainedValues
): DayTradeFieldOptionRewrite {
  const kept = new Map<string, string>();
  for (const value of retained.values) {
    const key = retained.key(value);
    if (!kept.has(key)) kept.set(key, value);
  }
  return {
    ...rewrite,
    rewrite: (values) => {
      const before = new Set(values);
      return rewrite
        .rewrite(values)
        .map((value) =>
          before.has(value) ? value : (kept.get(retained.key(value)) ?? value)
        );
    },
  };
}


export function planDayTradeFieldOptionRewrite(
  frontmatter: Record<string, unknown>,
  rewrite: DayTradeFieldOptionRewrite,
  
  retained?: DayTradeFieldRetainedValues
): DayTradeFieldOptionWrites {
  const writes: DayTradeFieldOptionWrites = {};

  const rawRules = frontmatter[DAY_TRADE_FIELDS_KEY];
  if (frontmatter.type === 'drc' && Array.isArray(rawRules)) {
    let changed = false;
    const rules: Record<string, unknown>[] = [];
    for (const entry of rawRules) {
      if (!isPlainRecord(entry)) continue;
      const next =
        entry.field === rewrite.field && Array.isArray(entry.value)
          ? rewriteOptionList(stringList(entry.value), rewrite)
          : undefined;
      if (next === undefined) {
        rules.push(entry);
        continue;
      }
      changed = true;
      if (next.length) rules.push({ ...entry, value: next });
    }
    if (changed) writes[DAY_TRADE_FIELDS_KEY] = rules.length ? rules : null;
  }

  const rawSources = frontmatter[DAY_TRADE_FIELD_SOURCES_KEY];
  if (rawSources !== undefined) {
    const sources = readDayFieldSources(rawSources);
    const sourceRewrite = retained
      ? withRetainedSpelling(rewrite, retained)
      : rewrite;
    let changed = false;
    for (const [day, entries] of Object.entries(sources)) {
      const recorded = entries[rewrite.field];
      if (!Array.isArray(recorded)) continue;
      const next = rewriteOptionList(recorded, sourceRewrite);
      if (next === undefined) continue;
      changed = true;
      setDaySource(sources, day, rewrite.field, next);
    }
    if (changed) {
      writes[DAY_TRADE_FIELD_SOURCES_KEY] = Object.keys(sources).length
        ? sources
        : null;
    }
  }

  return writes;
}


export function applyDayTradeFieldOptionWrites(
  frontmatter: Record<string, unknown>,
  writes: DayTradeFieldOptionWrites
): boolean {
  let changed = false;
  for (const [key, value] of Object.entries(writes)) {
    if (value === undefined) continue;
    changed = true;
    if (value === null) delete frontmatter[key];
    else frontmatter[key] = value;
  }
  return changed;
}
