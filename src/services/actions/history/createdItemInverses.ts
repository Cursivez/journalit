import type { ActionId, ActionPlan } from '../ActionTypes';
import type { ActionCall } from '../ActionBatchService';
import { isRecord } from '../../agent/configuration/configurationPrimitives';




const CREATED_ITEM_REMOVALS: ReadonlySet<ActionId> = new Set<ActionId>([
  'tag.delete',
  'mistake.delete',
  'account_type.delete',
  'event.delete',
  'setup.delete',
]);


export const CATALOG_DELETES = {
  'tag.create': 'tag.delete',
  'mistake.create': 'mistake.delete',
  'account_type.create': 'account_type.delete',
  'event.create': 'event.delete',
} as const;


export function catalogKey(action: ActionId): 'name' | 'value' {
  return action === 'event.delete' ? 'name' : 'value';
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function record(value: unknown): Readonly<Record<string, unknown>> {
  return isRecord(value) ? value : {};
}


export function catalogEntryState(entry: unknown): string | null {
  if (!isRecord(entry)) return null;
  return JSON.stringify(
    Object.keys(entry)
      .sort()
      .map((key) => [key, entry[key]])
  );
}


export function isCreatedItemRemoval(action: ActionId): boolean {
  return CREATED_ITEM_REMOVALS.has(action);
}


export type CreatedItemPlan = Pick<
  ActionPlan<ActionId>,
  'summary' | 'affectedNotes' | 'baseContent' | 'discardsUserSettings'
>;


export function checkCreatedItem(
  action: ActionId,
  plan: CreatedItemPlan,
  created: string
): 'ok' | 'in_use' | 'edited' {
  if (plan.affectedNotes !== 0 || plan.discardsUserSettings === true)
    return 'in_use';
  if (action === 'setup.delete')
    return plan.baseContent?.editRevision === created ? 'ok' : 'edited';
  const summary = record(plan.summary);
  if (
    action === 'event.delete' &&
    record(summary.change).preserved_review_count !== 0
  )
    return 'in_use';
  return catalogEntryState(summary.affected_entry) === created
    ? 'ok'
    : 'edited';
}


export function createdItemsGuarded(
  calls: readonly ActionCall[],
  createdItems: readonly string[] | undefined
): boolean {
  const removals = calls.filter((entry) => isCreatedItemRemoval(entry.action));
  if (removals.length === 0) return createdItems === undefined;
  return (
    createdItems !== undefined &&
    removals.length === calls.length &&
    createdItems.length === calls.length &&
    calls.every((entry, index) => {
      const state = createdItems[index];
      if (!isText(state)) return false;
      if (entry.action === 'setup.delete') return true;
      const key = catalogKey(entry.action);
      const created = parseState(state);
      return created !== null && created[key] === record(entry.input)[key];
    })
  );
}


function parseState(state: string): Record<string, unknown> | null {
  try {
    const pairs: unknown = JSON.parse(state);
    if (!Array.isArray(pairs)) return null;
    const entry: Record<string, unknown> = {};
    for (const pair of pairs as unknown[]) {
      if (!Array.isArray(pair) || pair.length !== 2) return null;
      const key: unknown = pair[0];
      if (!isText(key)) return null;
      entry[key] = pair[1] as unknown;
    }
    return catalogEntryState(entry) === state ? entry : null;
  } catch {
    return null;
  }
}


export function readCreatedItems(
  value: unknown
): readonly string[] | undefined | null {
  if (value === undefined) return undefined;
  return Array.isArray(value) &&
    value.length > 0 &&
    value.length <= 50 &&
    value.every(isText)
    ? [...value]
    : null;
}
