import type { TFile } from 'obsidian';
import type {
  SessionLogEntry,
  SessionLogTagDefinition,
} from '../../../types/sessionLog';
import { t, tPlural } from '../../../lang/helpers';
import {
  addSessionLogEntries,
  deleteSessionLogEntry,
  readSessionLogEntries,
  SessionLogEntryConflictError,
  sessionLogEntrySnapshot,
  updateSessionLogEntry,
  type SessionLogStore,
} from '../../sessionLog/sessionLogEntries';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionDefinitions,
  type ActionInput,
  type ActionPlanContext,
  type ActionSummary,
} from '../ActionTypes';
import { throwIfAborted } from './tradeActionSupport';
import { restoringEntryUpdate } from './sessionLogEntryRestore';
import { resolvePlannedReview, reviewIdentityKey } from './plannedReview';

type SessionLogEntryActionId =
  | 'review.add_session_log_entries'
  | 'review.update_session_log_entry'
  | 'review.delete_session_log_entry';
type ReviewIdentity = ActionInput<'review.add_session_log_entries'>['review'];
type EntryFields = ActionInput<'review.update_session_log_entry'>['fields'];
type ChangedField =
  ActionSummary<'review.update_session_log_entry'>['changed_fields'][number];

const CHANGED_FIELD_ORDER: readonly ChangedField[] = [
  'time',
  'tag_id',
  'text',
  'resolved',
];

interface SessionLogEntryActionDependencies {
  
  resolveDayReview(
    review: ReviewIdentity,
    signal: AbortSignal
  ): Promise<TFile | null>;
  store: SessionLogStore;
  getTags(): readonly SessionLogTagDefinition[];
}

function displayTarget(review: ReviewIdentity): string {
  return t('actions.review.target.day', { date: review.period_start });
}

function requireDay(review: ReviewIdentity): void {
  if (review.period !== 'day') {
    throw new ActionPlanError('unsupported_capability', 'review');
  }
}

function parseTime(value: string, field: string): Date {
  const time = new Date(value);
  if (Number.isNaN(time.getTime())) {
    throw new ActionPlanError('invalid_request', field);
  }
  return time;
}


function changedEntry(
  entry: SessionLogEntry,
  fields: EntryFields
): { next: SessionLogEntry; changed: ChangedField[] } {
  const next: SessionLogEntry = {
    ...entry,
    ...(fields.time === undefined
      ? {}
      : { timestamp: parseTime(fields.time, 'fields.time').toISOString() }),
    ...(fields.tag_id === undefined ? {} : { tagId: fields.tag_id }),
    ...(fields.text === undefined ? {} : { text: fields.text.trim() }),
    ...(fields.resolved === undefined ? {} : { resolved: fields.resolved }),
  };
  const changed = new Set<ChangedField>();
  if (next.timestamp !== entry.timestamp) changed.add('time');
  if (next.tagId !== entry.tagId) changed.add('tag_id');
  if (next.text !== entry.text) changed.add('text');
  if (next.resolved !== entry.resolved) changed.add('resolved');
  return {
    next,
    changed: CHANGED_FIELD_ORDER.filter((field) => changed.has(field)),
  };
}

function executionError(error: unknown): never {
  if (error instanceof ActionExecutionError) throw error;
  if (error instanceof SessionLogEntryConflictError) {
    throw new ActionExecutionError('conflict', false);
  }
  throw new ActionExecutionError('write_failed', true);
}


export function createSessionLogEntryActions(
  deps: SessionLogEntryActionDependencies
): Pick<ActionDefinitions, SessionLogEntryActionId> {
  const requireTag = (tagId: string, field: string): void => {
    if (!deps.getTags().some((tag) => tag.id === tagId)) {
      throw new ActionPlanError('not_found', field);
    }
  };
  const requireReview = async (
    review: ReviewIdentity,
    signal: AbortSignal
  ): Promise<TFile> => {
    const file = await deps.resolveDayReview(review, signal);
    throwIfAborted(signal);
    if (!file) throw new ActionPlanError('not_found', 'review');
    return file;
  };
  const requireEntry = (file: TFile, entryId: string): SessionLogEntry => {
    const entry = readSessionLogEntries(deps.store, file.path).find(
      (candidate) => candidate.id === entryId
    );
    if (!entry) throw new ActionPlanError('not_found', 'entry_id');
    return entry;
  };

  const add: ActionDefinition<'review.add_session_log_entries'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      requireDay(input.review);
      const entries = input.entries.map((entry) => {
        requireTag(entry.tag_id, 'entries');
        const text = entry.text.trim();
        if (text === '')
          throw new ActionPlanError('invalid_request', 'entries');
        return {
          tagId: entry.tag_id,
          text,
          timestamp: parseTime(entry.time, 'entries'),
        };
      });
      
      
      
      await resolvePlannedReview(
        (review, signal) => deps.resolveDayReview(review, signal),
        input.review,
        context
      );
      return {
        target: `${reviewIdentityKey(input.review)}:session_log`,
        dependsOn: [
          ...new Set(entries.map((entry) => `session_log_tag:${entry.tagId}`)),
        ],
        summary: {
          review: structuredClone(input.review),
          entry_count: entries.length,
        },
        affectedNotes: 1,
        display: {
          target: displayTarget(input.review),
          changes: [tPlural('actions.review.session-log.add', entries.length)],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          const file = await deps.resolveDayReview(input.review, signal);
          if (!file) throw new ActionExecutionError('not_found', false);
          if (
            !entries.every((entry) =>
              deps.getTags().some((tag) => tag.id === entry.tagId)
            )
          ) {
            throw new ActionExecutionError('conflict', false);
          }
          try {
            const added = await addSessionLogEntries(
              deps.store,
              file.path,
              entries,
              'agent'
            );
            return {
              review: structuredClone(input.review),
              entry_ids: added.map((entry) => entry.id),
            };
          } catch (error) {
            return executionError(error);
          }
        },
      };
    },
  };

  const update: ActionDefinition<'review.update_session_log_entry'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      requireDay(input.review);
      if (input.fields.tag_id !== undefined) {
        requireTag(input.fields.tag_id, 'fields.tag_id');
      }
      if (input.fields.text !== undefined && input.fields.text.trim() === '') {
        throw new ActionPlanError('invalid_request', 'fields.text');
      }
      const file = await requireReview(input.review, signal);
      const entry = requireEntry(file, input.entry_id);
      const { next, changed } = changedEntry(entry, input.fields);
      return {
        target: `session_log_entry:${entry.id}`,
        ...(input.fields.tag_id === undefined
          ? {}
          : { dependsOn: [`session_log_tag:${input.fields.tag_id}`] }),
        summary: {
          review: structuredClone(input.review),
          entry_id: entry.id,
          changed_fields: changed,
        },
        affectedNotes: changed.length > 0 ? 1 : 0,
        display: {
          target: displayTarget(input.review),
          changes:
            changed.length === 0
              ? []
              : [
                  t('actions.review.session-log.update', {
                    fields: changed
                      .map((field) =>
                        t(`actions.review.session-log.field.${field}`)
                      )
                      .join(', '),
                  }),
                ],
        },
        ...(context.origin === 'ui'
          ? { baseEntry: sessionLogEntrySnapshot(entry) }
          : {}),
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          const result = {
            review: structuredClone(input.review),
            entry_id: entry.id,
          };
          if (changed.length === 0) {
            return new ActionExecution(result, { restoreInput: 'unchanged' });
          }
          try {
            await updateSessionLogEntry(
              deps.store,
              file.path,
              entry.id,
              {
                timestamp: next.timestamp,
                tagId: next.tagId,
                text: next.text,
                resolved: next.resolved,
              },
              'agent',
              entry
            );
          } catch (error) {
            return executionError(error);
          }
          
          if (context.origin !== 'agent') {
            return new ActionExecution(result, { restoreInput: null });
          }
          return new ActionExecution(result, {
            restoreInput: restoringEntryUpdate(
              input.review,
              entry,
              next,
              changed,
              (written, fields) => changedEntry(written, fields).next
            ),
            entrySnapshot: sessionLogEntrySnapshot(next),
          });
        },
      };
    },
  };

  const remove: ActionDefinition<'review.delete_session_log_entry'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      requireDay(input.review);
      const file = await requireReview(input.review, signal);
      const entry = requireEntry(file, input.entry_id);
      return {
        target: `session_log_entry:${entry.id}`,
        summary: {
          review: structuredClone(input.review),
          entry_id: entry.id,
          tag_id: entry.tagId,
        },
        affectedNotes: 1,
        display: {
          target: displayTarget(input.review),
          changes: [t('actions.review.session-log.delete')],
        },
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          try {
            await deleteSessionLogEntry(
              deps.store,
              file.path,
              entry.id,
              'agent',
              entry
            );
          } catch (error) {
            return executionError(error);
          }
          return {
            review: structuredClone(input.review),
            entry_id: entry.id,
          };
        },
      };
    },
  };

  return {
    'review.add_session_log_entries': add,
    'review.update_session_log_entry': update,
    'review.delete_session_log_entry': remove,
  };
}
