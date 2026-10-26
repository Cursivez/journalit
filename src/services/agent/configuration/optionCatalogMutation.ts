import { normalizeOptionKey } from '../../../utils/stringNormalization';
import type {
  OptionAffectedEntry,
  OptionCatalogChange,
  OptionChangeSummary,
} from './optionChangeTypes';
import { isBoundedString, isRecord } from './configurationPrimitives';
import type { NoteRewriteChange, NoteRewritePlan } from './noteRewritePlan';
import {
  isEventRewritePlan,
  isMistakeRewritePlan,
  isTagRewritePlan,
} from './noteRewritePlan';
import {
  accountTypeOptionCatalogRevision,
  eventOptionCatalogRevision,
  mistakeOptionCatalogRevision,
  tagOptionCatalogRevision,
  type AccountTypeAssignmentSource,
} from './optionCatalogConfiguration';
import {
  applyAccountTypeAssignments,
  materializeAccountTypeLifecycle,
  type AccountTypeOwnedFields,
} from './accountTypeCatalogMutation';
import { OptionCatalogMutationError } from './optionCatalogMutationError';

export { OptionCatalogMutationError } from './optionCatalogMutationError';

const RAW_LIMIT = 100_000;
const NAME_LIMIT = 120;
const NOTES_LIMIT = 1_000;
const TAG_COLOR = /^#[0-9A-Fa-f]{6}$/;
const RESERVED_ACCOUNT_TYPE = 'archived';
const EVENT_COLORS = new Set(['red', 'orange', 'yellow', 'gray']);

type MutableOptionCatalog = OptionChangeSummary['catalog'];

export type OwnedOptionFields =
  | { catalog: 'tags'; tag: unknown[]; tagColors: Record<string, unknown> }
  | { catalog: 'mistakes'; mistake: unknown[] }
  | AccountTypeOwnedFields
  | { catalog: 'events'; event: unknown[] };

export interface MaterializedOptionChange {
  readonly catalog: MutableOptionCatalog;
  readonly baseRevision: string;
  readonly resultingRevision: string;
  readonly ownedFields: OwnedOptionFields;
  readonly change: OptionCatalogChange;
  readonly summary: OptionChangeSummary;
  readonly affectedEntry: OptionAffectedEntry;
  readonly plan?: NoteRewritePlan;
  
  readonly discardsUserSettings?: true;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function fail(code: OptionCatalogMutationError['code']): never {
  throw new OptionCatalogMutationError(code);
}

function validIdentity(value: unknown): value is string {
  if (
    !isBoundedString(value, NAME_LIMIT) ||
    value !== value.trim() ||
    value.includes('/')
  ) {
    return false;
  }
  return !/^["']|["']$/.test(value);
}

function validName(value: unknown): value is string {
  return isBoundedString(value, NAME_LIMIT) && value === value.trim();
}

function requireArray(
  rawOptions: Record<string, unknown>,
  key: string,
  grows = false
): unknown[] {
  const value = rawOptions[key];
  if (!Array.isArray(value)) fail('conflict');
  if (value.length > RAW_LIMIT || (grows && value.length === RAW_LIMIT)) {
    fail('limit_exceeded');
  }
  return clone(value);
}

function requireColors(
  rawOptions: Record<string, unknown>
): Record<string, unknown> {
  const value = rawOptions.tagColors;
  if (value === undefined) return {};
  if (!isRecord(value)) fail('conflict');
  if (Object.keys(value).length > RAW_LIMIT) fail('limit_exceeded');
  return clone(value);
}

function snapshotColors(
  rawOptions: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (rawOptions.tagColors === undefined) return undefined;
  return requireColors(rawOptions);
}

function requireOrder(rawAccountSettings: unknown): unknown[] {
  if (rawAccountSettings !== undefined && !isRecord(rawAccountSettings)) {
    fail('conflict');
  }
  const account = isRecord(rawAccountSettings) ? rawAccountSettings : {};
  const value = account.accountTypeOrder;
  if (value === undefined) return [];
  if (!Array.isArray(value)) fail('conflict');
  if (value.length > RAW_LIMIT) fail('limit_exceeded');
  return clone(value);
}

function validEventColor(
  value: unknown
): value is 'red' | 'orange' | 'yellow' | 'gray' {
  return typeof value === 'string' && EVENT_COLORS.has(value);
}

function uniqueStringIndex(
  values: readonly unknown[],
  identity: string
): number {
  const key = normalizeOptionKey(identity);
  let found = -1;
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (typeof value !== 'string' || normalizeOptionKey(value) !== key)
      continue;
    if (found !== -1) fail('conflict');
    found = index;
  }
  return found;
}

function eventIdentity(value: unknown): string | undefined {
  if (typeof value === 'string') return value.trim();
  if (isRecord(value) && typeof value.name === 'string')
    return value.name.trim();
  return undefined;
}

function uniqueEventIndex(
  values: readonly unknown[],
  identity: string
): number {
  const key = identity.toLowerCase();
  let found = -1;
  for (let index = 0; index < values.length; index += 1) {
    if (eventIdentity(values[index])?.toLowerCase() !== key) continue;
    if (found !== -1) fail('conflict');
    found = index;
  }
  return found;
}

function isWellFormedEventEntry(value: unknown): value is {
  name: string;
  color: 'red' | 'orange' | 'yellow' | 'gray';
  notes?: string;
} {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    if (key !== 'name' && key !== 'color' && key !== 'notes') return false;
  }
  if (!validName(value.name) || !validEventColor(value.color)) return false;
  if (
    value.notes !== undefined &&
    !isBoundedString(value.notes, NOTES_LIMIT, true)
  ) {
    return false;
  }
  return true;
}

function requireWellFormedEvent(
  values: readonly unknown[],
  identity: string
): {
  index: number;
  stored: {
    name: string;
    color: 'red' | 'orange' | 'yellow' | 'gray';
    notes?: string;
  };
} {
  const index = uniqueEventIndex(values, identity);
  if (index === -1) fail('not_found');
  const stored = values[index];
  if (!isWellFormedEventEntry(stored)) fail('conflict');
  return { index, stored };
}

function eventRewriteIdentities(
  change: Extract<
    OptionCatalogChange,
    { kind: 'rename_event' | 'merge_events' | 'delete_event' }
  >
): {
  source: string;
  target: string | undefined;
} {
  const source =
    change.kind === 'delete_event' ? change.name : change.source_name;
  const target =
    change.kind === 'delete_event' ? undefined : change.target_name;
  if (!validName(source) || (target !== undefined && !validName(target))) {
    fail('invalid_request');
  }
  if (target !== undefined && source.toLowerCase() === target.toLowerCase()) {
    fail('conflict');
  }
  return { source, target };
}

function matchingColorKeys(
  colors: Record<string, unknown>,
  identity: string
): string[] {
  const key = normalizeOptionKey(identity);
  const matches: string[] = [];
  const colorKeys = Object.keys(colors);
  for (let index = 0; index < colorKeys.length; index += 1) {
    const colorKey = colorKeys[index];
    if (normalizeOptionKey(colorKey) === key) matches.push(colorKey);
  }
  return matches;
}

function uniqueColorKey(
  colors: Record<string, unknown>,
  identity: string
): string | undefined {
  const keys = matchingColorKeys(colors, identity);
  if (keys.length > 1) fail('conflict');
  return keys[0];
}

function requireCanonicalColor(value: unknown): string {
  if (typeof value !== 'string' || !TAG_COLOR.test(value)) fail('conflict');
  return value;
}

function requireStoredIdentity(
  values: readonly unknown[],
  identity: string
): { index: number; stored: string } {
  const index = uniqueStringIndex(values, identity);
  if (index === -1) fail('not_found');
  const stored = values[index];
  if (typeof stored !== 'string') fail('internal_error');
  if (!validIdentity(stored)) fail('conflict');
  return { index, stored };
}

function rewriteIdentities(
  change: Extract<
    NoteRewriteChange,
    {
      kind:
        | 'rename_tag'
        | 'merge_tags'
        | 'delete_tag'
        | 'rename_mistake'
        | 'merge_mistakes'
        | 'delete_mistake';
    }
  >
): {
  source: string;
  target: string | undefined;
} {
  const source =
    change.kind === 'delete_tag' || change.kind === 'delete_mistake'
      ? change.value
      : change.source_value;
  const target =
    change.kind === 'delete_tag' || change.kind === 'delete_mistake'
      ? undefined
      : change.target_value;
  if (
    !validIdentity(source) ||
    (target !== undefined && !validIdentity(target))
  ) {
    fail('invalid_request');
  }
  if (
    target !== undefined &&
    normalizeOptionKey(source) === normalizeOptionKey(target)
  ) {
    fail('conflict');
  }
  return { source, target };
}

async function scanRewritePlanOrFail(
  scanNoteRewrite?: (change: NoteRewriteChange) => Promise<NoteRewritePlan>,
  change?: NoteRewriteChange
): Promise<NoteRewritePlan> {
  if (!scanNoteRewrite || !change) fail('internal_error');
  try {
    return await scanNoteRewrite(change);
  } catch (error) {
    if (error instanceof OptionCatalogMutationError) throw error;
    fail('internal_error');
  }
}

async function materializeTagRewrite(input: {
  change: Extract<
    NoteRewriteChange,
    { kind: 'rename_tag' | 'merge_tags' | 'delete_tag' }
  >;
  rawOptions: Record<string, unknown>;
  scanNoteRewrite?: (change: NoteRewriteChange) => Promise<NoteRewritePlan>;
}): Promise<{
  ownedFields: Extract<OwnedOptionFields, { catalog: 'tags' }>;
  affectedEntry: OptionAffectedEntry;
  plan: NoteRewritePlan;
}> {
  const change = input.change;
  const { source } = rewriteIdentities(change);
  const tag = requireArray(input.rawOptions, 'tag');
  const tagColors = requireColors(input.rawOptions);
  const sourceMatch = requireStoredIdentity(tag, source);
  let affectedEntry: OptionAffectedEntry;
  let resolvedChange: NoteRewriteChange = change;
  switch (change.kind) {
    case 'rename_tag': {
      if (uniqueStringIndex(tag, change.target_value) !== -1) fail('conflict');
      if (uniqueColorKey(tagColors, change.target_value) !== undefined) {
        fail('conflict');
      }
      const sourceColorKey = uniqueColorKey(tagColors, sourceMatch.stored);
      let movedColor: string | undefined;
      if (sourceColorKey !== undefined) {
        movedColor = requireCanonicalColor(tagColors[sourceColorKey]);
        delete tagColors[sourceColorKey];
        tagColors[change.target_value] = movedColor;
      }
      tag[sourceMatch.index] = change.target_value;
      affectedEntry =
        movedColor === undefined
          ? { value: change.target_value }
          : { value: change.target_value, color: movedColor };
      break;
    }
    case 'merge_tags': {
      const targetMatch = requireStoredIdentity(tag, change.target_value);
      const sourceColorKey = uniqueColorKey(tagColors, sourceMatch.stored);
      if (sourceColorKey !== undefined) {
        requireCanonicalColor(tagColors[sourceColorKey]);
        delete tagColors[sourceColorKey];
      }
      const targetColorKey = uniqueColorKey(tagColors, targetMatch.stored);
      const targetColor =
        targetColorKey === undefined
          ? undefined
          : requireCanonicalColor(tagColors[targetColorKey]);
      tag.splice(sourceMatch.index, 1);
      affectedEntry =
        targetColor === undefined
          ? { value: targetMatch.stored }
          : { value: targetMatch.stored, color: targetColor };
      resolvedChange = { ...change, target_value: targetMatch.stored };
      break;
    }
    case 'delete_tag': {
      const sourceColorKey = uniqueColorKey(tagColors, sourceMatch.stored);
      let removedColor: string | undefined;
      if (sourceColorKey !== undefined) {
        removedColor = requireCanonicalColor(tagColors[sourceColorKey]);
        delete tagColors[sourceColorKey];
      }
      tag.splice(sourceMatch.index, 1);
      affectedEntry =
        removedColor === undefined
          ? { value: sourceMatch.stored }
          : { value: sourceMatch.stored, color: removedColor };
      break;
    }
    default: {
      const exhaustive: never = change;
      return exhaustive;
    }
  }

  return {
    ownedFields: { catalog: 'tags', tag, tagColors },
    affectedEntry,
    plan: await scanRewritePlanOrFail(input.scanNoteRewrite, resolvedChange),
  };
}

async function materializeMistakeRewrite(input: {
  change: Extract<
    NoteRewriteChange,
    { kind: 'rename_mistake' | 'merge_mistakes' | 'delete_mistake' }
  >;
  rawOptions: Record<string, unknown>;
  scanNoteRewrite?: (change: NoteRewriteChange) => Promise<NoteRewritePlan>;
}): Promise<{
  ownedFields: Extract<OwnedOptionFields, { catalog: 'mistakes' }>;
  affectedEntry: OptionAffectedEntry;
  plan: NoteRewritePlan;
}> {
  const change = input.change;
  const { source } = rewriteIdentities(change);
  const mistake = requireArray(input.rawOptions, 'mistake');
  const sourceMatch = requireStoredIdentity(mistake, source);
  let affectedEntry: OptionAffectedEntry;
  let resolvedChange: NoteRewriteChange = change;
  switch (change.kind) {
    case 'rename_mistake': {
      if (uniqueStringIndex(mistake, change.target_value) !== -1) {
        fail('conflict');
      }
      mistake[sourceMatch.index] = change.target_value;
      affectedEntry = { value: change.target_value };
      break;
    }
    case 'merge_mistakes': {
      const targetMatch = requireStoredIdentity(mistake, change.target_value);
      mistake.splice(sourceMatch.index, 1);
      affectedEntry = { value: targetMatch.stored };
      resolvedChange = { ...change, target_value: targetMatch.stored };
      break;
    }
    case 'delete_mistake': {
      mistake.splice(sourceMatch.index, 1);
      affectedEntry = { value: sourceMatch.stored };
      break;
    }
    default: {
      const exhaustive: never = change;
      return exhaustive;
    }
  }
  return {
    ownedFields: { catalog: 'mistakes', mistake },
    affectedEntry,
    plan: await scanRewritePlanOrFail(input.scanNoteRewrite, resolvedChange),
  };
}

async function materializeEventRewrite(input: {
  change: Extract<
    OptionCatalogChange,
    { kind: 'rename_event' | 'merge_events' | 'delete_event' }
  >;
  rawOptions: Record<string, unknown>;
  scanNoteRewrite?: (change: NoteRewriteChange) => Promise<NoteRewritePlan>;
}): Promise<{
  ownedFields: Extract<OwnedOptionFields, { catalog: 'events' }>;
  affectedEntry: OptionAffectedEntry;
  plan: NoteRewritePlan;
}> {
  const change = input.change;
  const { source } = eventRewriteIdentities(change);
  const event = requireArray(input.rawOptions, 'event');
  const sourceMatch = requireWellFormedEvent(event, source);
  let affectedEntry: OptionAffectedEntry;
  let resolvedChange: NoteRewriteChange = change;
  switch (change.kind) {
    case 'rename_event': {
      if (uniqueEventIndex(event, change.target_name) !== -1) fail('conflict');
      if (sourceMatch.stored.notes === undefined) {
        affectedEntry = {
          name: change.target_name,
          color: sourceMatch.stored.color,
        };
      } else {
        affectedEntry = {
          name: change.target_name,
          color: sourceMatch.stored.color,
          notes: sourceMatch.stored.notes,
        };
      }
      event[sourceMatch.index] = affectedEntry;
      break;
    }
    case 'merge_events': {
      const targetMatch = requireWellFormedEvent(event, change.target_name);
      if (targetMatch.stored.notes === undefined) {
        affectedEntry = {
          name: targetMatch.stored.name,
          color: targetMatch.stored.color,
        };
      } else {
        affectedEntry = {
          name: targetMatch.stored.name,
          color: targetMatch.stored.color,
          notes: targetMatch.stored.notes,
        };
      }
      event.splice(sourceMatch.index, 1);
      resolvedChange = { ...change, target_name: targetMatch.stored.name };
      break;
    }
    case 'delete_event': {
      if (sourceMatch.stored.notes === undefined) {
        affectedEntry = {
          name: sourceMatch.stored.name,
          color: sourceMatch.stored.color,
        };
      } else {
        affectedEntry = {
          name: sourceMatch.stored.name,
          color: sourceMatch.stored.color,
          notes: sourceMatch.stored.notes,
        };
      }
      event.splice(sourceMatch.index, 1);
      break;
    }
    default: {
      const exhaustive: never = change;
      return exhaustive;
    }
  }
  return {
    ownedFields: { catalog: 'events', event },
    affectedEntry,
    plan: await scanRewritePlanOrFail(input.scanNoteRewrite, resolvedChange),
  };
}

function summary(
  change: OptionCatalogChange,
  plan?: NoteRewritePlan
): OptionChangeSummary {
  const messages = {
    create_tag: 'Created tag.',
    create_mistake: 'Created mistake.',
    create_account_type: 'Created account type.',
    create_event: 'Created event.',
    set_tag_color: 'Set tag color.',
    clear_tag_color: 'Cleared tag color.',
    update_event_style: 'Updated event style.',
  } as const;
  const common = {
    settings_only: true as const,
    affected_note_count: 0 as const,
  };
  switch (change.kind) {
    case 'create_tag':
      return {
        ...common,
        action: change.kind,
        catalog: 'tags',
        value: change.value,
        message: messages[change.kind],
      };
    case 'create_mistake':
      return {
        ...common,
        action: change.kind,
        catalog: 'mistakes',
        value: change.value,
        message: messages[change.kind],
      };
    case 'create_account_type':
      return {
        ...common,
        action: change.kind,
        catalog: 'account_types',
        value: change.value,
        message: messages[change.kind],
      };
    case 'create_event':
      return {
        ...common,
        action: change.kind,
        catalog: 'events',
        name: change.name,
        message: messages[change.kind],
      };
    case 'set_tag_color':
    case 'clear_tag_color':
      return {
        ...common,
        action: change.kind,
        catalog: 'tags',
        value: change.value,
        message: messages[change.kind],
      };
    case 'update_event_style':
      return {
        ...common,
        action: change.kind,
        catalog: 'events',
        name: change.name,
        message: messages[change.kind],
      };
    case 'rename_tag':
    case 'merge_tags':
    case 'delete_tag': {
      if (!plan || !isTagRewritePlan(plan)) fail('internal_error');
      const counts = {
        settings_only: false as const,
        affected_trade_count: plan.affectedTradeCount,
        affected_setup_count: plan.affectedSetupCount,
        affected_review_count: plan.affectedReviewCount,
        affected_other_note_count: plan.affectedOtherNoteCount,
        affected_note_count: plan.affectedNoteCount,
      };
      if (change.kind === 'delete_tag') {
        return {
          action: change.kind,
          catalog: 'tags',
          value: change.value,
          ...counts,
          message: 'Deleted tag.',
        };
      }
      return {
        action: change.kind,
        catalog: 'tags',
        source_value: change.source_value,
        target_value: change.target_value,
        ...counts,
        message: 'Rewrote tag.',
      };
    }
    case 'rename_mistake':
    case 'merge_mistakes':
    case 'delete_mistake': {
      if (!plan || !isMistakeRewritePlan(plan)) fail('internal_error');
      const counts = {
        settings_only: false as const,
        affected_trade_count: plan.affectedTradeCount,
        affected_review_count: plan.affectedReviewCount,
        affected_note_count: plan.affectedNoteCount,
      };
      if (change.kind === 'delete_mistake') {
        return {
          action: change.kind,
          catalog: 'mistakes',
          value: change.value,
          ...counts,
          message: 'Deleted mistake.',
        };
      }
      return {
        action: change.kind,
        catalog: 'mistakes',
        source_value: change.source_value,
        target_value: change.target_value,
        ...counts,
        message: 'Rewrote mistake.',
      };
    }
    case 'rename_event':
    case 'merge_events':
    case 'delete_event': {
      if (!plan || !isEventRewritePlan(plan)) fail('internal_error');
      if (change.kind === 'delete_event') {
        return {
          action: change.kind,
          catalog: 'events',
          name: change.name,
          settings_only: true,
          preserved_review_count: plan.preservedReviewCount,
          affected_note_count: 0,
          message: 'Deleted event.',
        };
      }
      return {
        action: change.kind,
        catalog: 'events',
        source_name: change.source_name,
        target_name: change.target_name,
        settings_only: false,
        affected_review_count: plan.affectedReviewCount,
        affected_note_count: plan.affectedNoteCount,
        message: 'Rewrote event.',
      };
    }
    case 'rename_account_type':
    case 'move_account_type':
    case 'delete_account_type':
      return accountTypeSummary(change, 0);
  }
}

function accountTypeSummary(
  change: Extract<
    OptionCatalogChange,
    | { kind: 'rename_account_type' }
    | { kind: 'move_account_type' }
    | { kind: 'delete_account_type' }
  >,
  affectedAccountCount: number
): OptionChangeSummary {
  switch (change.kind) {
    case 'rename_account_type':
      return {
        action: change.kind,
        catalog: 'account_types',
        source_value: change.source_value,
        target_value: change.target_value,
        settings_only: true,
        affected_account_count: affectedAccountCount,
        affected_note_count: 0,
        message: 'Renamed account type.',
      };
    case 'move_account_type':
      return change.before_value === undefined
        ? {
            action: change.kind,
            catalog: 'account_types',
            value: change.value,
            settings_only: true,
            affected_note_count: 0,
            message: 'Moved account type.',
          }
        : {
            action: change.kind,
            catalog: 'account_types',
            value: change.value,
            before_value: change.before_value,
            settings_only: true,
            affected_note_count: 0,
            message: 'Moved account type.',
          };
    case 'delete_account_type':
      return {
        action: change.kind,
        catalog: 'account_types',
        value: change.value,
        settings_only: true,
        affected_account_count: 0,
        affected_note_count: 0,
        message: 'Deleted account type.',
      };
  }
}

function catalogForOptionChange(
  change: OptionCatalogChange
): MutableOptionCatalog {
  switch (change.kind) {
    case 'create_tag':
    case 'set_tag_color':
    case 'clear_tag_color':
    case 'rename_tag':
    case 'merge_tags':
    case 'delete_tag':
      return 'tags';
    case 'create_mistake':
    case 'rename_mistake':
    case 'merge_mistakes':
    case 'delete_mistake':
      return 'mistakes';
    case 'create_account_type':
    case 'rename_account_type':
    case 'move_account_type':
    case 'delete_account_type':
      return 'account_types';
    case 'create_event':
    case 'update_event_style':
    case 'rename_event':
    case 'merge_events':
    case 'delete_event':
      return 'events';
  }
}

export function isAccountTypeCatalogChange(
  change: OptionCatalogChange
): boolean {
  switch (change.kind) {
    case 'create_account_type':
    case 'rename_account_type':
    case 'move_account_type':
    case 'delete_account_type':
      return true;
    default:
      return false;
  }
}

function snapshotAccounts(
  accounts: readonly AccountTypeAssignmentSource[] | undefined
): AccountTypeAssignmentSource[] {
  if (accounts === undefined) return [];
  const cloned: AccountTypeAssignmentSource[] = [];
  for (let index = 0; index < accounts.length; index += 1) {
    const account = accounts[index];
    if (!isRecord(account) || typeof account.name !== 'string')
      fail('conflict');
    cloned.push(
      account.accountType === undefined
        ? { name: account.name }
        : { name: account.name, accountType: account.accountType }
    );
  }
  return cloned;
}

function ownedSnapshot(input: {
  rawOptions: unknown;
  rawAccountSettings: unknown;
  change: OptionCatalogChange;
}): {
  rawOptions: Record<string, unknown>;
  rawAccountSettings: Record<string, unknown> | undefined;
} {
  if (!isRecord(input.rawOptions)) fail('conflict');
  switch (catalogForOptionChange(input.change)) {
    case 'tags': {
      const tagColors = snapshotColors(input.rawOptions);
      return {
        rawOptions: {
          tag: requireArray(input.rawOptions, 'tag'),
          ...(tagColors === undefined ? {} : { tagColors }),
        },
        rawAccountSettings: undefined,
      };
    }
    case 'mistakes':
      return {
        rawOptions: {
          mistake: requireArray(input.rawOptions, 'mistake'),
        },
        rawAccountSettings: undefined,
      };
    case 'account_types': {
      if (input.rawAccountSettings === undefined) {
        return {
          rawOptions: {
            account_type: requireArray(input.rawOptions, 'account_type'),
          },
          rawAccountSettings: undefined,
        };
      }
      if (!isRecord(input.rawAccountSettings)) fail('conflict');
      const rawAccountSettings = clone(input.rawAccountSettings);
      if (
        rawAccountSettings.accountTypeOrder !== undefined &&
        !Array.isArray(rawAccountSettings.accountTypeOrder)
      ) {
        fail('conflict');
      }
      if (
        rawAccountSettings.excludedAccountTypes !== undefined &&
        !Array.isArray(rawAccountSettings.excludedAccountTypes)
      ) {
        fail('conflict');
      }
      if (
        rawAccountSettings.includeWithdrawalsFromExcluded !== undefined &&
        !isRecord(rawAccountSettings.includeWithdrawalsFromExcluded)
      ) {
        fail('conflict');
      }
      if (
        rawAccountSettings.accountMetadata !== undefined &&
        !isRecord(rawAccountSettings.accountMetadata)
      ) {
        fail('conflict');
      }
      if (
        (Array.isArray(rawAccountSettings.accountTypeOrder) &&
          rawAccountSettings.accountTypeOrder.length > RAW_LIMIT) ||
        (Array.isArray(rawAccountSettings.excludedAccountTypes) &&
          rawAccountSettings.excludedAccountTypes.length > RAW_LIMIT) ||
        (isRecord(rawAccountSettings.includeWithdrawalsFromExcluded) &&
          Object.keys(rawAccountSettings.includeWithdrawalsFromExcluded)
            .length > RAW_LIMIT) ||
        (isRecord(rawAccountSettings.accountMetadata) &&
          Object.keys(rawAccountSettings.accountMetadata).length > RAW_LIMIT)
      ) {
        fail('limit_exceeded');
      }
      return {
        rawOptions: {
          account_type: requireArray(input.rawOptions, 'account_type'),
        },
        rawAccountSettings,
      };
    }
    case 'events':
      return {
        rawOptions: {
          event: requireArray(input.rawOptions, 'event'),
        },
        rawAccountSettings: undefined,
      };
  }
}

async function optionCatalogRevision(
  catalog: MutableOptionCatalog,
  rawOptions: unknown,
  rawAccountSettings: unknown,
  accounts?: readonly AccountTypeAssignmentSource[]
): Promise<string> {
  switch (catalog) {
    case 'tags':
      return tagOptionCatalogRevision(rawOptions);
    case 'mistakes':
      return mistakeOptionCatalogRevision(rawOptions);
    case 'account_types':
      return accountTypeOptionCatalogRevision(
        rawOptions,
        rawAccountSettings,
        accounts
      );
    case 'events':
      return eventOptionCatalogRevision(rawOptions);
  }
}

export async function materializeOptionCatalogChange(input: {
  rawOptions: unknown;
  rawAccountSettings: unknown;
  change: OptionCatalogChange;
  expectedBaseRevision?: string;
  scanNoteRewrite?: (change: NoteRewriteChange) => Promise<NoteRewritePlan>;
  accounts?: readonly AccountTypeAssignmentSource[];
}): Promise<MaterializedOptionChange> {
  const change = clone(input.change);
  const snapshot = ownedSnapshot({ ...input, change });
  const rawOptions = snapshot.rawOptions;
  const rawAccountSettings = snapshot.rawAccountSettings;
  const catalog = catalogForOptionChange(change);
  const accounts = isAccountTypeCatalogChange(change)
    ? snapshotAccounts(input.accounts)
    : undefined;
  const baseRevision = await optionCatalogRevision(
    catalog,
    rawOptions,
    rawAccountSettings,
    accounts
  );
  if (
    input.expectedBaseRevision !== undefined &&
    baseRevision !== input.expectedBaseRevision
  ) {
    fail('conflict');
  }
  let ownedFields: OwnedOptionFields;
  let affectedEntry: OptionAffectedEntry;
  let plan: NoteRewritePlan | undefined;
  let affectedAccountCount = 0;
  let discardsUserSettings: true | undefined;
  let nextAccounts = accounts;

  switch (change.kind) {
    case 'create_tag': {
      if (
        !validIdentity(change.value) ||
        (change.color !== undefined && !TAG_COLOR.test(change.color))
      )
        fail('invalid_request');
      const tag = requireArray(rawOptions, 'tag', true);
      if (uniqueStringIndex(tag, change.value) !== -1) fail('conflict');
      const tagColors = requireColors(rawOptions);
      const matchingColorKeys = Object.keys(tagColors).filter(
        (key) => normalizeOptionKey(key) === normalizeOptionKey(change.value)
      );
      if (matchingColorKeys.length > 1) fail('conflict');
      const matchingColorKey = matchingColorKeys[0];
      const matchingColor =
        matchingColorKey === undefined
          ? undefined
          : tagColors[matchingColorKey];
      tag.push(change.value);
      let resultingColor: string | undefined;
      if (change.color !== undefined) {
        const colorKey = change.value;
        if (
          matchingColorKey === undefined &&
          Object.keys(tagColors).length === RAW_LIMIT
        ) {
          fail('limit_exceeded');
        }
        if (matchingColorKey !== undefined && matchingColorKey !== colorKey) {
          delete tagColors[matchingColorKey];
        }
        tagColors[colorKey] = change.color;
        resultingColor = change.color;
      } else if (matchingColorKey !== undefined) {
        if (
          typeof matchingColor !== 'string' ||
          !TAG_COLOR.test(matchingColor)
        ) {
          fail('conflict');
        }
        resultingColor = matchingColor;
      }
      ownedFields = { catalog: 'tags', tag, tagColors };
      affectedEntry =
        resultingColor === undefined
          ? { value: change.value }
          : { value: change.value, color: resultingColor };
      break;
    }
    case 'create_mistake': {
      if (!validIdentity(change.value)) fail('invalid_request');
      const mistake = requireArray(rawOptions, 'mistake', true);
      if (uniqueStringIndex(mistake, change.value) !== -1) fail('conflict');
      mistake.push(change.value);
      ownedFields = { catalog: 'mistakes', mistake };
      affectedEntry = { value: change.value };
      break;
    }
    case 'create_account_type': {
      if (!validIdentity(change.value)) fail('invalid_request');
      if (change.value.toLowerCase() === RESERVED_ACCOUNT_TYPE)
        fail('conflict');
      const account_type = requireArray(rawOptions, 'account_type', true);
      if (uniqueStringIndex(account_type, change.value) !== -1)
        fail('conflict');
      const accountTypeOrder = requireOrder(rawAccountSettings);
      account_type.push(change.value);
      const existingOrderIndex = uniqueStringIndex(
        accountTypeOrder,
        change.value
      );
      if (existingOrderIndex !== -1) {
        accountTypeOrder[existingOrderIndex] = change.value.toLowerCase();
      } else if (accountTypeOrder.length === RAW_LIMIT) {
        fail('limit_exceeded');
      }
      const archivedIndex = accountTypeOrder.findIndex(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase() === RESERVED_ACCOUNT_TYPE
      );
      if (existingOrderIndex === -1) {
        accountTypeOrder.splice(
          archivedIndex === -1 ? accountTypeOrder.length : archivedIndex,
          0,
          change.value.toLowerCase()
        );
      }
      ownedFields = {
        catalog: 'account_types',
        account_type,
        accountTypeOrder,
      };
      affectedEntry = { value: change.value };
      break;
    }
    case 'create_event': {
      if (
        !validName(change.name) ||
        !validEventColor(change.color) ||
        (change.notes !== undefined &&
          !isBoundedString(change.notes, NOTES_LIMIT, true))
      )
        fail('invalid_request');
      const event = requireArray(rawOptions, 'event', true);
      if (uniqueEventIndex(event, change.name) !== -1) fail('conflict');
      const entry =
        change.notes === undefined
          ? { name: change.name, color: change.color }
          : { name: change.name, color: change.color, notes: change.notes };
      event.push(entry);
      ownedFields = { catalog: 'events', event };
      affectedEntry = entry;
      break;
    }
    case 'set_tag_color':
    case 'clear_tag_color': {
      if (
        !validIdentity(change.value) ||
        (change.kind === 'set_tag_color' && !TAG_COLOR.test(change.color))
      )
        fail('invalid_request');
      const tag = requireArray(rawOptions, 'tag');
      const tagIndex = uniqueStringIndex(tag, change.value);
      if (tagIndex === -1) fail('not_found');
      const storedTag = tag[tagIndex];
      if (typeof storedTag !== 'string') fail('internal_error');
      if (!validIdentity(storedTag)) fail('conflict');
      const tagColors = requireColors(rawOptions);
      const matchingKeys = Object.keys(tagColors).filter(
        (key) => normalizeOptionKey(key) === normalizeOptionKey(storedTag)
      );
      if (matchingKeys.length > 1) fail('conflict');
      const existingColorKey = matchingKeys[0];
      if (change.kind === 'set_tag_color') {
        if (
          matchingKeys.length === 0 &&
          Object.keys(tagColors).length === RAW_LIMIT
        ) {
          fail('limit_exceeded');
        }
        if (existingColorKey !== undefined && existingColorKey !== storedTag) {
          delete tagColors[existingColorKey];
        }
        tagColors[storedTag] = change.color;
      } else if (existingColorKey !== undefined) {
        delete tagColors[existingColorKey];
      }
      ownedFields = { catalog: 'tags', tag, tagColors };
      affectedEntry =
        change.kind === 'set_tag_color'
          ? { value: storedTag, color: change.color }
          : { value: storedTag };
      break;
    }
    case 'rename_tag':
    case 'merge_tags':
    case 'delete_tag': {
      const rewritten = await materializeTagRewrite({
        change,
        rawOptions,
        scanNoteRewrite: input.scanNoteRewrite,
      });
      ownedFields = rewritten.ownedFields;
      affectedEntry = rewritten.affectedEntry;
      plan = rewritten.plan;
      break;
    }
    case 'rename_mistake':
    case 'merge_mistakes':
    case 'delete_mistake': {
      const rewritten = await materializeMistakeRewrite({
        change,
        rawOptions,
        scanNoteRewrite: input.scanNoteRewrite,
      });
      ownedFields = rewritten.ownedFields;
      affectedEntry = rewritten.affectedEntry;
      plan = rewritten.plan;
      break;
    }
    case 'rename_event':
    case 'merge_events':
    case 'delete_event': {
      const rewritten = await materializeEventRewrite({
        change,
        rawOptions,
        scanNoteRewrite: input.scanNoteRewrite,
      });
      ownedFields = rewritten.ownedFields;
      affectedEntry = rewritten.affectedEntry;
      plan = rewritten.plan;
      break;
    }
    case 'rename_account_type':
    case 'move_account_type':
    case 'delete_account_type': {
      const rewritten = materializeAccountTypeLifecycle({
        change,
        rawOptions,
        rawAccountSettings,
        accounts: accounts ?? [],
      });
      ownedFields = rewritten.ownedFields;
      affectedEntry = rewritten.affectedEntry;
      affectedAccountCount = rewritten.affectedAccountCount;
      discardsUserSettings = rewritten.discardsUserSettings;
      nextAccounts = applyAccountTypeAssignments(accounts ?? [], change);
      break;
    }
    case 'update_event_style': {
      if (
        !validName(change.name) ||
        !validEventColor(change.color) ||
        (change.notes !== undefined &&
          change.notes !== null &&
          !isBoundedString(change.notes, NOTES_LIMIT, true))
      )
        fail('invalid_request');
      const event = requireArray(rawOptions, 'event');
      const index = uniqueEventIndex(event, change.name);
      if (index === -1) fail('not_found');
      const current = event[index];
      const storedName = eventIdentity(current);
      if (!storedName || !validName(storedName)) fail('conflict');
      let notes: string | undefined;
      if (change.notes === undefined && isRecord(current)) {
        if (
          current.notes !== undefined &&
          !isBoundedString(current.notes, NOTES_LIMIT, true)
        )
          fail('conflict');
        notes = current.notes;
      } else if (typeof change.notes === 'string') notes = change.notes;
      const entry =
        notes === undefined
          ? { name: storedName, color: change.color }
          : { name: storedName, color: change.color, notes };
      event[index] = entry;
      ownedFields = { catalog: 'events', event };
      affectedEntry = entry;
      break;
    }
  }

  const nextRawOptions = { ...rawOptions };
  let nextRawAccount = rawAccountSettings;
  switch (ownedFields.catalog) {
    case 'tags':
      nextRawOptions.tag = ownedFields.tag;
      nextRawOptions.tagColors = ownedFields.tagColors;
      break;
    case 'mistakes':
      nextRawOptions.mistake = ownedFields.mistake;
      break;
    case 'account_types':
      nextRawOptions.account_type = ownedFields.account_type;
      nextRawAccount = {
        ...(isRecord(rawAccountSettings) ? rawAccountSettings : {}),
        accountTypeOrder: ownedFields.accountTypeOrder,
        ...(ownedFields.excludedAccountTypes === undefined
          ? {}
          : { excludedAccountTypes: ownedFields.excludedAccountTypes }),
        ...(ownedFields.includeWithdrawalsFromExcluded === undefined
          ? {}
          : {
              includeWithdrawalsFromExcluded:
                ownedFields.includeWithdrawalsFromExcluded,
            }),
      };
      break;
    case 'events':
      nextRawOptions.event = ownedFields.event;
      break;
  }
  const resultingRevision = await optionCatalogRevision(
    catalog,
    nextRawOptions,
    nextRawAccount,
    nextAccounts
  );
  return deepFreeze({
    catalog,
    baseRevision,
    resultingRevision,
    ownedFields: clone(ownedFields),
    change,
    summary:
      change.kind === 'rename_account_type' ||
      change.kind === 'move_account_type' ||
      change.kind === 'delete_account_type'
        ? accountTypeSummary(change, affectedAccountCount)
        : summary(change, plan),
    affectedEntry: clone(affectedEntry),
    ...(plan === undefined ? {} : { plan: clone(plan) }),
    ...(discardsUserSettings ? { discardsUserSettings } : {}),
  });
}
