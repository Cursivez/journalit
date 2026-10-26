import {
  CUSTOM_FIELD_KEY_MIGRATION_KEYS,
  RESERVED_FRONTMATTER_KEYS,
  validateCustomFieldValue,
  validateFieldKey,
  type CustomFieldDefinition,
} from '../../../types/customFields';
import { serializeCustomFieldValue } from '../../../utils/customFieldPersistence';
import {
  canonicalizeTradeTagSelection,
  readTradeSelectionEntry,
  type TradeSelectionField,
} from '../../../utils/tradeTagNormalization';
import { normalizeStringArray } from '../../../utils/dataUtils';
import { KNOWN_TRADE_FRONTMATTER_KEYS } from './TradeFrontmatterKeys';
import {
  isValidTradeRating,
  parseTradeRating,
} from '../../../utils/tradeRating';


export const DAY_TRADE_FIELD_SOURCES_KEY = 'dayTradeFieldSources';

export interface TradeJournalValues {
  thesis: string;
  setup: string[];
  mistake: string[];
  tags: string[];
  customFields: Record<string, unknown>;
  
  tradeRating?: number;
  
  dayFieldSources?: unknown;
}

interface JournalSelectionChange {
  added: string[];
  removed: string[];
}

export interface TradeJournalPatch {
  thesis?: string;
  setup?: JournalSelectionChange;
  mistake?: JournalSelectionChange;
  tags?: JournalSelectionChange;
  customFields?: Record<string, unknown>;
  
  removeCustomFieldValues?: string[];
  addImages?: string[];
  
  dayFieldSources?: Record<string, unknown> | null;
  
  tradeRating?: number | null;
}


export type TradeJournalBatchEdit =
  | { type: 'mark-reviewed'; reviewedAt: string }
  | { type: 'add'; field: 'setup' | 'mistake' | 'tags'; values: string[] };

export interface TradeJournalBatchResult {
  
  processed: number;
  
  skipped: number;
  errors: number;
  total: number;
}


export interface TradeJournalCommit {
  thesis?: string;
  setup?: string[];
  mistake?: string[];
  tags?: string[];
  images?: string[];
  
  tradeRating?: number | null;
  customFields: Array<{ id: string; key: string; value: unknown }>;
}


export function normalizeTradeJournalSelection(
  value: unknown,
  field: TradeSelectionField
): string[] {
  const values = new Set<string>();
  for (const entry of normalizeStringArray(value)) {
    const selection = readTradeSelectionEntry(entry, field);
    if (selection) values.add(selection);
  }
  return Array.from(values);
}




const PROTECTED_KEYS = new Set<string>([
  ...RESERVED_FRONTMATTER_KEYS,
  ...KNOWN_TRADE_FRONTMATTER_KEYS,
  ...CUSTOM_FIELD_KEY_MIGRATION_KEYS,
  'missedReason',
]);

export function isEditableJournalField(field: CustomFieldDefinition): boolean {
  return (
    !PROTECTED_KEYS.has(field.fieldKey) &&
    validateFieldKey(field.fieldKey) === null
  );
}

export function journalStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : [];
}

export function readTradeJournalValues(
  frontmatter: Record<string, unknown>,
  fields: CustomFieldDefinition[]
): TradeJournalValues {
  return {
    thesis: typeof frontmatter.thesis === 'string' ? frontmatter.thesis : '',
    
    setup: normalizeTradeJournalSelection(frontmatter.setup, 'setup'),
    mistake: normalizeTradeJournalSelection(frontmatter.mistake, 'mistake'),
    tags: normalizeStringArray(frontmatter.tags),
    customFields: Object.fromEntries(
      fields.flatMap((field) =>
        isEditableJournalField(field)
          ? [[field.id, frontmatter[field.fieldKey]]]
          : []
      )
    ),
    tradeRating: parseTradeRating(frontmatter.tradeRating),
    dayFieldSources: frontmatter[DAY_TRADE_FIELD_SOURCES_KEY],
  };
}

function selectionChange(
  before: string[],
  after: string[]
): JournalSelectionChange | undefined {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  const added = after.filter((value) => !beforeSet.has(value));
  const removed = before.filter((value) => !afterSet.has(value));
  return added.length || removed.length ? { added, removed } : undefined;
}

export function buildTradeJournalPatch(
  before: TradeJournalValues,
  after: TradeJournalValues
): TradeJournalPatch {
  const customFields = Object.fromEntries(
    Object.entries(after.customFields).filter(
      ([id, value]) =>
        JSON.stringify(value) !== JSON.stringify(before.customFields[id])
    )
  );
  return {
    ...(before.thesis !== after.thesis ? { thesis: after.thesis } : {}),
    setup: selectionChange(before.setup, after.setup),
    mistake: selectionChange(before.mistake, after.mistake),
    tags: selectionChange(
      before.tags,
      canonicalizeTradeTagSelection(before.tags, after.tags)
    ),
    customFields,
  };
}

export function hasTradeJournalChanges(patch: TradeJournalPatch): boolean {
  return Boolean(
    patch.thesis !== undefined ||
    patch.setup ||
    patch.mistake ||
    patch.tags ||
    patch.addImages?.length ||
    patch.dayFieldSources !== undefined ||
    patch.tradeRating !== undefined ||
    patch.removeCustomFieldValues?.length ||
    Object.keys(patch.customFields ?? {}).length
  );
}


function applySelection(
  current: unknown,
  change: JournalSelectionChange,
  field?: TradeSelectionField
): string[] {
  const removed = new Set(change.removed);
  const isRemoved = (value: string) =>
    removed.has(field ? (readTradeSelectionEntry(value, field) ?? '') : value);
  return [
    ...new Set([
      ...normalizeStringArray(current).filter((value) => !isRemoved(value)),
      ...change.added,
    ]),
  ];
}


export function applyTradeJournalBatchEdit(
  frontmatter: Record<string, unknown>,
  edit: TradeJournalBatchEdit
): boolean {
  if (edit.type === 'mark-reviewed') {
    if (frontmatter.reviewed === true) return false;
    frontmatter.reviewed = true;
    frontmatter.reviewedAt = edit.reviewedAt;
    return true;
  }
  const selectionField = edit.field === 'tags' ? undefined : edit.field;
  const stored = frontmatter[edit.field];
  const current = selectionField
    ? normalizeTradeJournalSelection(stored, selectionField)
    : normalizeStringArray(stored);
  
  const present = new Set(current.map((value) => value.toLowerCase()));
  const added = edit.values.filter(
    (value) => !present.has(value.toLowerCase())
  );
  if (added.length === 0) return false;
  frontmatter[edit.field] = applySelection(
    stored,
    { added, removed: [] },
    selectionField
  );
  return true;
}


export function applyTradeReviewStatus(
  frontmatter: Record<string, unknown>,
  kind: 'trade' | 'missed-trade' | 'backtest-trade',
  reviewed: boolean,
  reviewedAt: string
): void {
  frontmatter.reviewed = reviewed;
  if (reviewed) frontmatter.reviewedAt = reviewedAt;
  else if (kind === 'missed-trade') frontmatter.reviewedAt = '';
  else delete frontmatter.reviewedAt;
}


export function applyTradeJournalPatch(
  frontmatter: Record<string, unknown>,
  patch: TradeJournalPatch,
  fields: CustomFieldDefinition[],
  getFieldOptions: (id: string) => string[]
): TradeJournalCommit {
  const customWrites: Array<{ id: string; key: string; value: unknown }> = [];
  const fieldsById = new Map(fields.map((field) => [field.id, field]));
  for (const [id, value] of Object.entries(patch.customFields ?? {})) {
    const field = fieldsById.get(id);
    if (!field || !isEditableJournalField(field))
      throw new Error('Custom field is no longer editable');
    const error = validateCustomFieldValue(value, field, getFieldOptions(id));
    if (error) throw new Error(error);
    customWrites.push({
      id,
      key: field.fieldKey,
      value: serializeCustomFieldValue(value, field.type),
    });
  }
  for (const id of patch.removeCustomFieldValues ?? []) {
    const field = fieldsById.get(id);
    if (!field || !isEditableJournalField(field))
      throw new Error('Custom field is no longer editable');
    customWrites.push({ id, key: field.fieldKey, value: undefined });
  }
  if (
    patch.tradeRating !== undefined &&
    patch.tradeRating !== null &&
    !isValidTradeRating(patch.tradeRating)
  )
    throw new Error(`Invalid trade rating: ${patch.tradeRating}`);
  if (patch.thesis !== undefined) frontmatter.thesis = patch.thesis;
  if (patch.setup)
    frontmatter.setup = applySelection(frontmatter.setup, patch.setup, 'setup');
  if (patch.mistake)
    frontmatter.mistake = applySelection(
      frontmatter.mistake,
      patch.mistake,
      'mistake'
    );
  if (patch.tags)
    frontmatter.tags = applySelection(frontmatter.tags, patch.tags);
  if (patch.addImages)
    frontmatter.images = [
      ...new Set([
        ...journalStringList(frontmatter.images),
        ...patch.addImages,
      ]),
    ];
  for (const { key, value } of customWrites) {
    if (value === undefined) delete frontmatter[key];
    else frontmatter[key] = value;
  }
  if (patch.dayFieldSources === null)
    delete frontmatter[DAY_TRADE_FIELD_SOURCES_KEY];
  else if (patch.dayFieldSources)
    frontmatter[DAY_TRADE_FIELD_SOURCES_KEY] = patch.dayFieldSources;
  if (patch.tradeRating === null) delete frontmatter.tradeRating;
  else if (patch.tradeRating !== undefined)
    frontmatter.tradeRating = patch.tradeRating;
  return {
    ...(patch.thesis !== undefined ? { thesis: patch.thesis } : {}),
    ...(patch.setup
      ? { setup: normalizeTradeJournalSelection(frontmatter.setup, 'setup') }
      : {}),
    ...(patch.mistake
      ? {
          mistake: normalizeTradeJournalSelection(
            frontmatter.mistake,
            'mistake'
          ),
        }
      : {}),
    ...(patch.tags ? { tags: normalizeStringArray(frontmatter.tags) } : {}),
    ...(patch.addImages
      ? { images: journalStringList(frontmatter.images) }
      : {}),
    ...(patch.tradeRating !== undefined
      ? { tradeRating: patch.tradeRating }
      : {}),
    customFields: customWrites,
  };
}
