import type { ActionId, TradeNoteContent } from '../ActionTypes';
import { isRecord } from '../../agent/configuration/configurationPrimitives';
import type { ActionCall } from '../ActionBatchService';
import {
  isKeyEventContentKey,
  isKeyEventKey,
  manualKeyEventOccurrence,
} from '../../weekly/keyEventKeys';
import {
  accountFieldsRestore,
  customFieldRestore,
  customFieldSettingsRestore,
  isBoolean,
  isReview,
  imageAnnotationsRestore,
  isText,
  isTexts,
  keyEventFieldsRestore,
  matchesShape,
  plannedTargets,
  reviewContentRestore,
  setupFieldsRestore,
  shaped,
  tradeFieldsRestore,
  type InputShape,
} from './restoreShapes';
import { settingsInverse, settingsRestoreShape } from './settingsInverses';
import {
  CATALOG_DELETES,
  catalogEntryState,
  catalogKey,
} from './createdItemInverses';


export interface ActionInverse {
  readonly calls: readonly ActionCall[];
  
  readonly tradeContent?: TradeContentGuard;
  
  readonly entryContent?: EntryContentGuard;
  
  readonly itemGuard?: InverseItemGuard;
  
  readonly createdItems?: readonly string[];
}


interface TradeContentGuard extends TradeNoteContent {
  readonly tradeId: string;
}


interface EntryContentGuard {
  readonly entryId: string;
  readonly snapshot: string;
}


export interface InverseItemGuard extends EditableItem {
  readonly snapshot: string;
}

export interface EditableItem {
  readonly kind: 'account_transaction' | 'prop_challenge_cost';
  readonly accountId: string;
  readonly itemId: string;
}


export function editableItemOf(
  action: ActionId,
  result: unknown
): EditableItem | null {
  const output = record(result);
  const accountId = text(output.account_id);
  if (!accountId) return null;
  if (action === 'account.add_transaction') {
    const itemId = text(output.transaction_id);
    return itemId ? { kind: 'account_transaction', accountId, itemId } : null;
  }
  if (action === 'prop_challenge.add_cost') {
    const itemId = text(output.cost_id);
    return itemId ? { kind: 'prop_challenge_cost', accountId, itemId } : null;
  }
  return null;
}

type Values = Readonly<Record<string, unknown>>;

function record(value: unknown): Values {
  return isRecord(value) ? value : {};
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function ids(...keys: string[]): InputShape {
  return {
    required: Object.fromEntries(keys.map((key) => [key, isText])),
  };
}


const INVERSE_INPUT_TABLE: Partial<Record<ActionId, InputShape>> = {
  'trade.delete': ids('trade_id'),
  'trade.update': {
    required: { trade_id: isText },
    optional: {
      set: tradeFieldsRestore,
      stop_losses: plannedTargets,
      take_profits: plannedTargets,
      add_tags: isTexts,
      remove_tags: isTexts,
      add_mistakes: isTexts,
      remove_mistakes: isTexts,
      custom_fields: (value) =>
        Array.isArray(value) &&
        value.length > 0 &&
        value.length <= 50 &&
        value.every(customFieldRestore),
    },
    needsOptional: true,
  },
  'account.delete': ids('account_id', 'expected_revision'),
  'account.update': {
    required: {
      account_id: isText,
      expected_revision: isText,
      fields: accountFieldsRestore,
    },
  },
  'account.delete_transaction': ids('account_id', 'transaction_id'),
  'prop_challenge.delete_cost': ids('account_id', 'cost_id'),
  'session_log_tag.update': {
    required: {
      tag_id: isText,
      expected_revision: isText,
      fields: shaped({
        required: {},
        optional: {
          label: isText,
          short_label: isText,
          color: isText,
          requires_resolution: (value) => typeof value === 'boolean',
          lesson: (value) => typeof value === 'boolean',
        },
        needsOptional: true,
      }),
    },
  },
  'setup.update': {
    required: {
      setup_id: isText,
      expected_revision: isText,
      fields: setupFieldsRestore,
    },
  },
  'custom_field.update': {
    required: {
      field_id: isText,
      expected_revision: isText,
      fields: customFieldSettingsRestore,
    },
  },
  'review.update': {
    required: {
      review: isReview,
      expected_revision: isText,
      content: reviewContentRestore,
    },
  },
  'review.update_session_log_entry': {
    required: {
      review: isReview,
      entry_id: isText,
      fields: shaped({
        required: {},
        optional: {
          time: isText,
          tag_id: isText,
          text: isText,
          resolved: isBoolean,
        },
        needsOptional: true,
      }),
    },
  },
  'review.update_key_event': {
    required: {
      review: isReview,
      key: isKeyEventKey,
      fields: keyEventFieldsRestore,
    },
  },
  'trade.set_image_annotations': {
    required: { trade_id: isText, images: imageAnnotationsRestore },
  },
  'review.set_image_annotations': {
    required: { review: isReview, images: imageAnnotationsRestore },
  },
  
  'review.delete_key_event': {
    required: { review: isReview, key: isKeyEventContentKey },
  },
  'custom_field.delete': ids('field_id'),
  'session_log_tag.delete': ids('tag_id'),
  'review.delete_session_log_entry': {
    required: { review: isReview, entry_id: isText },
  },
  'review.remove_images': {
    required: { review: isReview, widget: isText, media_ids: isTexts },
  },
  'dashboard_layout.delete': ids('name'),
  'home_layout.delete': ids('name'),
  'review_template.delete': ids('template_id'),
  'session_workflow.delete': ids('workflow_id'),
  
  'tag.delete': ids('value'),
  'mistake.delete': ids('value'),
  'account_type.delete': ids('value'),
  'event.delete': ids('name'),
  'setup.delete': ids('setup_id'),
};


const REMOVAL_INVERSES: ReadonlySet<ActionId> = new Set<ActionId>([
  'trade.delete',
  'account.delete',
  'account.delete_transaction',
  'prop_challenge.delete_cost',
  'custom_field.delete',
  'session_log_tag.delete',
  'review.delete_session_log_entry',
  'review.delete_key_event',
  'review.remove_images',
  'dashboard_layout.delete',
  'home_layout.delete',
  'review_template.delete',
  'session_workflow.delete',
  'tag.delete',
  'mistake.delete',
  'account_type.delete',
  'event.delete',
  'setup.delete',
]);


export function isRemovalInverse(action: ActionId): boolean {
  return REMOVAL_INVERSES.has(action);
}

const INVERSE_INPUTS = new Map<unknown, InputShape>(
  Object.entries(INVERSE_INPUT_TABLE).flatMap(([action, shape]) =>
    shape ? [[action, shape] as const] : []
  )
);


export function inverseGuarded(
  calls: readonly ActionCall[],
  tradeContent: TradeContentGuard | undefined,
  entryContent?: EntryContentGuard
): boolean {
  return calls.every((call) => {
    const input = record(call.input);
    switch (call.action) {
      case 'trade.update':
      case 'trade.delete':
        return tradeContent?.tradeId === input.trade_id;
      case 'review.update_session_log_entry':
        return entryContent?.entryId === input.entry_id;
      case 'review.update_key_event':
        return entryContent?.entryId === input.key;
      case 'trade.set_image_annotations':
        return entryContent?.entryId === input.trade_id;
      case 'review.set_image_annotations':
        return entryContent?.entryId === reviewEntryId(input.review);
      default:
        return true;
    }
  });
}


function reviewEntryId(review: unknown): string | undefined {
  const { period, period_start } = record(review);
  return isText(period) && isText(period_start)
    ? `${period}:${period_start}`
    : undefined;
}


export function readEntryContentGuard(
  value: unknown
): EntryContentGuard | null {
  if (!isRecord(value)) return null;
  const { entryId, snapshot } = value;
  return Object.keys(value).length === 2 && isText(entryId) && isText(snapshot)
    ? { entryId, snapshot }
    : null;
}


export function readTradeContentGuard(
  value: unknown
): TradeContentGuard | null {
  if (!isRecord(value)) return null;
  const { tradeId, path, editRevision } = value;
  return Object.keys(value).length === 3 &&
    isText(tradeId) &&
    isText(path) &&
    isText(editRevision)
    ? { tradeId, path, editRevision }
    : null;
}


export function inverseCall(
  action: unknown,
  input: unknown
): ActionCall | null {
  const shape = INVERSE_INPUTS.get(action) ?? settingsRestoreShape(action);
  const given = record(input);
  if (!shape || !matchesShape(shape, input)) return null;
  
  return { action, input: given } as unknown as ActionCall;
}

function call(action: ActionId, input: Values): ActionCall {
  const checked = inverseCall(action, input);
  if (!checked) throw new InverseUnavailable();
  return checked;
}

class InverseUnavailable extends Error {}


interface UndoReport {
  readonly restoreInput?: unknown;
  readonly tradeContent?: unknown;
  readonly entrySnapshot?: unknown;
  readonly noteContent?: unknown;
}

function sameTarget(left: unknown, right: unknown): boolean {
  return isText(left)
    ? left === right
    : isReview(left) &&
        isReview(right) &&
        record(left).period === record(right).period &&
        record(left).period_start === record(right).period_start;
}


function restoreInverse(
  action: ActionId,
  targetKey: string,
  output: Values,
  undo: UndoReport
): ActionInverse | null {
  if (undo.restoreInput === 'unchanged') return { calls: [] };
  const restore = record(undo.restoreInput);
  const target = output[targetKey];
  if (!sameTarget(target, restore[targetKey])) return null;
  if (action === 'trade.update') {
    const tradeContent = readTradeContentGuard({
      ...record(undo.tradeContent),
      tradeId: target,
    });
    return tradeContent
      ? { calls: [call(action, restore)], tradeContent }
      : null;
  }
  if (
    action === 'trade.set_image_annotations' ||
    action === 'review.set_image_annotations'
  ) {
    
    const entryId =
      action === 'trade.set_image_annotations'
        ? text(target)
        : reviewEntryId(target);
    const entryContent = readEntryContentGuard({
      entryId,
      snapshot: undo.entrySnapshot,
    });
    return entryContent
      ? { calls: [call(action, restore)], entryContent }
      : null;
  }
  if (
    action === 'review.update_session_log_entry' ||
    action === 'review.update_key_event'
  ) {
    const entryContent = readEntryContentGuard({
      entryId: target,
      snapshot: undo.entrySnapshot,
    });
    return entryContent && sameTarget(output.review, restore.review)
      ? { calls: [call(action, restore)], entryContent }
      : null;
  }
  const revision = text(output.revision);
  return revision && restore.expected_revision === revision
    ? { calls: [call(action, restore)] }
    : null;
}

export function inverseOf(
  action: ActionId,
  input: unknown,
  summary: unknown,
  result: unknown,
  
  undo?: UndoReport
): ActionInverse | null {
  try {
    return buildInverse(action, input, summary, result, undo ?? {});
  } catch (error) {
    if (error instanceof InverseUnavailable) return null;
    throw error;
  }
}


const RESTORE_TARGETS: Partial<Record<ActionId, string>> = {
  'trade.update': 'trade_id',
  'account.update': 'account_id',
  'session_log_tag.update': 'tag_id',
  'setup.update': 'setup_id',
  'custom_field.update': 'field_id',
  'review.update': 'review',
  'review.update_session_log_entry': 'entry_id',
  'review.update_key_event': 'key',
  'trade.set_image_annotations': 'trade_id',
  'review.set_image_annotations': 'review',
};

function buildInverse(
  action: ActionId,
  input: unknown,
  summary: unknown,
  result: unknown,
  undo: UndoReport
): ActionInverse | null {
  const given = record(input);
  const planned = record(summary);
  const output = record(result);
  const targetKey = RESTORE_TARGETS[action];
  if (targetKey !== undefined) {
    return restoreInverse(action, targetKey, output, undo);
  }
  switch (action) {
    case 'trade.create': {
      const tradeId = text(output.trade_id);
      const content = record(undo.tradeContent);
      const tradeContent = readTradeContentGuard({ ...content, tradeId });
      return tradeId && tradeContent
        ? {
            calls: [call('trade.delete', { trade_id: tradeId })],
            tradeContent,
          }
        : null;
    }
    case 'account.create': {
      const accountId = text(output.account_id);
      const revision = text(output.revision);
      return accountId && revision
        ? {
            calls: [
              call('account.delete', {
                account_id: accountId,
                expected_revision: revision,
              }),
            ],
          }
        : null;
    }
    case 'account.add_transaction': {
      const accountId = text(output.account_id);
      const transactionId = text(output.transaction_id);
      return accountId && transactionId
        ? {
            calls: [
              call('account.delete_transaction', {
                account_id: accountId,
                transaction_id: transactionId,
              }),
            ],
          }
        : null;
    }
    case 'prop_challenge.add_cost': {
      const accountId = text(output.account_id);
      const costId = text(output.cost_id);
      return accountId && costId
        ? {
            calls: [
              call('prop_challenge.delete_cost', {
                account_id: accountId,
                cost_id: costId,
              }),
            ],
          }
        : null;
    }
    case 'custom_field.create': {
      const fieldId = text(output.field_id);
      return fieldId
        ? { calls: [call('custom_field.delete', { field_id: fieldId })] }
        : null;
    }
    case 'session_log_tag.create': {
      const tagId = text(output.tag_id);
      return tagId
        ? { calls: [call('session_log_tag.delete', { tag_id: tagId })] }
        : null;
    }
    case 'review.add_session_log_entries': {
      const ids = strings(output.entry_ids);
      return ids.length > 0
        ? {
            calls: ids.map((entryId) =>
              call('review.delete_session_log_entry', {
                review: given.review,
                entry_id: entryId,
              })
            ),
          }
        : null;
    }
    case 'review.add_key_events': {
      
      
      
      
      
      
      
      
      const keys = strings(output.keys);
      if (keys.length === 0) return null;
      const seen = new Map<string, number>();
      const calls: ActionCall[] = [];
      for (const key of keys) {
        const added = manualKeyEventOccurrence(key);
        if (!added) return null;
        const earlierInAdd = seen.get(added.hash) ?? 0;
        if (added.occurrence > earlierInAdd) return null;
        seen.set(added.hash, earlierInAdd + 1);
        calls.push(
          call('review.delete_key_event', {
            review: given.review,
            key: `ke_c_${added.hash}`,
          })
        );
      }
      return { calls };
    }
    case 'review.add_images': {
      const widget = text(output.widget);
      const mediaIds = strings(output.media_ids);
      return widget && mediaIds.length > 0
        ? {
            calls: [
              call('review.remove_images', {
                review: given.review,
                widget,
                media_ids: mediaIds,
              }),
            ],
          }
        : null;
    }
    case 'dashboard_layout.create':
    case 'dashboard_layout.duplicate':
    case 'home_layout.create':
    case 'home_layout.duplicate': {
      const name = text(record(planned.layout).name);
      const remove = action.startsWith('dashboard')
        ? 'dashboard_layout.delete'
        : 'home_layout.delete';
      return name ? { calls: [call(remove, { name })] } : null;
    }
    case 'review_template.create':
    case 'review_template.duplicate': {
      const templateId = text(record(planned.template).id);
      return templateId
        ? {
            calls: [
              call('review_template.delete', { template_id: templateId }),
            ],
          }
        : null;
    }
    case 'tag.create':
    case 'mistake.create':
    case 'account_type.create':
    case 'event.create': {
      
      
      const remove = CATALOG_DELETES[action];
      const key = catalogKey(remove);
      const created = Array.isArray(output.created) ? output.created : [];
      if (created.length === 0) return null;
      const calls: ActionCall[] = [];
      const createdItems: string[] = [];
      for (const item of created) {
        const entry = record(record(item).affected_entry);
        const identity = text(entry[key]);
        const state = catalogEntryState(entry);
        if (!identity || !state) return null;
        calls.push(call(remove, { [key]: identity }));
        createdItems.push(state);
      }
      return { calls, createdItems };
    }
    case 'setup.create': {
      
      
      const setupId = text(output.setup_id);
      const content = text(record(undo.noteContent).editRevision);
      return setupId && content
        ? {
            calls: [call('setup.delete', { setup_id: setupId })],
            createdItems: [content],
          }
        : null;
    }
    case 'session_workflow.create': {
      const workflowId = text(record(planned.workflow).id);
      return workflowId
        ? {
            calls: [
              call('session_workflow.delete', { workflow_id: workflowId }),
            ],
          }
        : null;
    }
    default:
      return settingsInverse(action, output, undo.restoreInput, call);
  }
}
