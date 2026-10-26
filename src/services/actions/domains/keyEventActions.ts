import type { TFile } from 'obsidian';
import { t, tPlural } from '../../../lang/helpers';
import { KEY_EVENT_COLORS, KEY_EVENT_DAYS } from '../../../utils/keyEvents';
import { createTradingDayFromString } from '../../../utils/tradingDayUtils';
import {
  KEY_EVENT_CURRENCIES,
  timeOfDayInputValue,
} from '../../../components/reviewV2/widgets/keyEventFields';
import type { NewsEvent, WeeklyKeyEventsWriteState } from '../../weekly/types';
import {
  isImportedKeyEvent,
  isKeyEventContentKey,
  keyEventKeys,
  keyEventSnapshot,
  locateKeyEvent,
  locateKeyEventByContent,
  MAX_AGENT_KEY_EVENTS,
} from '../../weekly/keyEventKeys';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionDefinitions,
  type ActionInput,
  type ActionPlanContext,
} from '../ActionTypes';
import { throwIfAborted } from './tradeActionSupport';
import { resolvePlannedReview } from './plannedReview';
import {
  editedKeyEvent,
  newKeyEvent,
  type KeyEventChange,
  type KeyEventFields,
} from './keyEventEdits';

type KeyEventActionId =
  | 'review.add_key_events'
  | 'review.update_key_event'
  | 'review.delete_key_event';
type ReviewIdentity = ActionInput<'review.add_key_events'>['review'];
type UpdateInput = ActionInput<'review.update_key_event'>;


interface KeyEventActionDependencies {
  
  resolveWeekReview(
    review: ReviewIdentity,
    signal: AbortSignal
  ): Promise<TFile | null>;
  
  weekReviewPath(weekStart: Date): string;
  readKeyEvents(weekStart: Date): WeeklyKeyEventsWriteState;
  
  updateKeyEvents(
    weekStart: Date,
    update: (current: WeeklyKeyEventsWriteState) => WeeklyKeyEventsWriteState
  ): Promise<unknown>;
}


function oneOf<Value extends string>(
  allowed: readonly Value[],
  value: string | undefined
): Value | undefined {
  return allowed.find((candidate) => candidate === value);
}
const MAX_NOTES = 2000;
const MAX_NAME = 200;


class KeyEventConflictError extends Error {}

function displayTarget(review: ReviewIdentity): string {
  return t('actions.review.target.week', { date: review.period_start });
}

function requireWeek(review: ReviewIdentity): Date {
  if (review.period !== 'week') {
    throw new ActionPlanError('unsupported_capability', 'review');
  }
  return createTradingDayFromString(review.period_start);
}

function executionError(error: unknown): never {
  if (error instanceof ActionExecutionError) throw error;
  if (error instanceof KeyEventConflictError) {
    throw new ActionExecutionError('conflict', false);
  }
  throw new ActionExecutionError('write_failed', true);
}


function expectAt(
  current: WeeklyKeyEventsWriteState,
  key: string,
  planned: NewsEvent,
  locate: typeof locateKeyEvent = locateKeyEvent
): number {
  const index = locate(current.keyEvents, key);
  if (
    index === 'missing' ||
    keyEventSnapshot(current.keyEvents[index]) !== keyEventSnapshot(planned)
  ) {
    throw new KeyEventConflictError();
  }
  return index;
}


function restoringKeyEventUpdate(
  review: ReviewIdentity,
  key: string,
  previous: NewsEvent,
  written: NewsEvent,
  changed: readonly KeyEventChange[],
  weekStart: Date
): UpdateInput | null {
  const fields: KeyEventFields = {};
  for (const field of changed) {
    switch (field) {
      case 'event':
        if (
          previous.event.trim() !== previous.event ||
          previous.event === '' ||
          Array.from(previous.event).length > MAX_NAME
        ) {
          return null;
        }
        fields.event = previous.event;
        break;
      case 'day': {
        const day = oneOf(KEY_EVENT_DAYS, previous.day);
        if (previous.day !== undefined && day === undefined) return null;
        fields.day = day ?? null;
        break;
      }
      case 'notes':
        if (Array.from(previous.notes).length > MAX_NOTES) return null;
        fields.notes = previous.notes;
        break;
      case 'color': {
        const color = oneOf(KEY_EVENT_COLORS, previous.color);
        if (color === undefined) return null;
        fields.color = color;
        break;
      }
      case 'currency': {
        const currency = oneOf(KEY_EVENT_CURRENCIES, previous.currency);
        if (previous.currency !== undefined && currency === undefined) {
          return null;
        }
        fields.currency = currency ?? null;
        break;
      }
      case 'time': {
        if (previous.eventType === 'holiday') return null;
        fields.time = timeOfDayInputValue(previous.time) || null;
        break;
      }
    }
  }
  if (Object.keys(fields).length === 0) return null;
  try {
    const restored = editedKeyEvent(written, fields, weekStart).next;
    if (keyEventSnapshot(restored) !== keyEventSnapshot(previous)) return null;
  } catch (error) {
    
    if (error instanceof ActionPlanError) return null;
    console.warn('[Journalit] Could not capture a key event change:', error);
    return null;
  }
  return {
    review: { period: review.period, period_start: review.period_start },
    key,
    fields,
  };
}


export function createKeyEventActions(
  deps: KeyEventActionDependencies
): Pick<ActionDefinitions, KeyEventActionId> {
  const requireReview = async (
    review: ReviewIdentity,
    weekStart: Date,
    signal: AbortSignal
  ): Promise<TFile> => {
    const file = await deps.resolveWeekReview(review, signal);
    throwIfAborted(signal);
    if (!file) throw new ActionPlanError('not_found', 'review');
    
    if (deps.weekReviewPath(weekStart) !== file.path) {
      throw new ActionPlanError('conflict', 'review');
    }
    return file;
  };
  
  const requireWritable = async (
    review: ReviewIdentity,
    weekStart: Date,
    signal: AbortSignal
  ): Promise<void> => {
    const file = await deps.resolveWeekReview(review, signal);
    throwIfAborted(signal);
    if (!file) throw new ActionExecutionError('not_found', false);
    if (deps.weekReviewPath(weekStart) !== file.path) {
      throw new ActionExecutionError('conflict', false);
    }
  };
  const requireEvent = (
    weekStart: Date,
    key: string,
    locate: typeof locateKeyEvent = locateKeyEvent
  ): { index: number; event: NewsEvent } => {
    const events = deps.readKeyEvents(weekStart).keyEvents;
    const index = locate(events, key);
    if (index === 'missing') throw new ActionPlanError('not_found', 'key');
    return { index, event: events[index] };
  };

  const add: ActionDefinition<'review.add_key_events'> = {
    async plan(input, context: ActionPlanContext) {
      throwIfAborted(context.signal);
      const weekStart = requireWeek(input.review);
      const events = input.events.map((event) =>
        newKeyEvent(event, weekStart, 'events')
      );
      
      const stored = deps.readKeyEvents(weekStart).keyEvents.length;
      if (stored + events.length > MAX_AGENT_KEY_EVENTS) {
        throw new ActionPlanError('limit_exceeded', 'events');
      }
      
      
      const file = await resolvePlannedReview(
        (review, signal) => deps.resolveWeekReview(review, signal),
        input.review,
        context
      );
      if (file && deps.weekReviewPath(weekStart) !== file.path) {
        throw new ActionPlanError('conflict', 'review');
      }
      return {
        target: `review:${input.review.period}:${input.review.period_start}:key_events`,
        summary: {
          review: structuredClone(input.review),
          event_count: events.length,
        },
        affectedNotes: 1,
        display: {
          target: displayTarget(input.review),
          changes: [tPlural('actions.review.key-events.add', events.length)],
        },
        execute: async (signal) => {
          throwIfAborted(signal);
          await requireWritable(input.review, weekStart, signal);
          let keys: string[] = [];
          try {
            await deps.updateKeyEvents(weekStart, (current) => {
              
              if (
                current.keyEvents.length + events.length >
                MAX_AGENT_KEY_EVENTS
              ) {
                throw new KeyEventConflictError();
              }
              const next = [...current.keyEvents, ...events];
              keys = keyEventKeys(next).slice(current.keyEvents.length);
              return {
                keyEvents: next,
                keyEventsAutoImported: current.keyEventsAutoImported,
              };
            });
          } catch (error) {
            return executionError(error);
          }
          return { review: structuredClone(input.review), keys };
        },
      };
    },
  };

  const update: ActionDefinition<'review.update_key_event'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const weekStart = requireWeek(input.review);
      await requireReview(input.review, weekStart, signal);
      const { event } = requireEvent(weekStart, input.key);
      const { next, changed } = editedKeyEvent(event, input.fields, weekStart);
      return {
        target: `key_event:${input.review.period_start}:${input.key}`,
        summary: {
          review: structuredClone(input.review),
          key: input.key,
          changed_fields: changed,
        },
        affectedNotes: changed.length > 0 ? 1 : 0,
        display: {
          target: displayTarget(input.review),
          changes:
            changed.length === 0
              ? []
              : [t('actions.review.key-events.update', { name: next.event })],
        },
        ...(context.origin === 'ui'
          ? { baseEntry: keyEventSnapshot(event) }
          : {}),
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          if (changed.length === 0) {
            return new ActionExecution(
              { review: structuredClone(input.review), key: input.key },
              { restoreInput: 'unchanged' }
            );
          }
          await requireWritable(input.review, weekStart, executionSignal);
          let key = input.key;
          try {
            await deps.updateKeyEvents(weekStart, (current) => {
              const index = expectAt(current, input.key, event);
              const events = current.keyEvents.map((candidate, position) =>
                position === index ? next : candidate
              );
              key = keyEventKeys(events)[index];
              return {
                keyEvents: events,
                keyEventsAutoImported: current.keyEventsAutoImported,
              };
            });
          } catch (error) {
            return executionError(error);
          }
          const result = { review: structuredClone(input.review), key };
          if (context.origin !== 'agent') {
            return new ActionExecution(result, { restoreInput: null });
          }
          return new ActionExecution(result, {
            restoreInput: restoringKeyEventUpdate(
              input.review,
              key,
              event,
              next,
              changed,
              weekStart
            ),
            entrySnapshot: keyEventSnapshot(next),
          });
        },
      };
    },
  };

  const remove: ActionDefinition<'review.delete_key_event'> = {
    async plan(input, context: ActionPlanContext) {
      const { signal } = context;
      throwIfAborted(signal);
      const weekStart = requireWeek(input.review);
      
      const locate =
        context.origin === 'ui' && isKeyEventContentKey(input.key)
          ? locateKeyEventByContent
          : locateKeyEvent;
      await requireReview(input.review, weekStart, signal);
      const { event } = requireEvent(weekStart, input.key, locate);
      return {
        target: `key_event:${input.review.period_start}:${input.key}`,
        summary: {
          review: structuredClone(input.review),
          key: input.key,
          imported: isImportedKeyEvent(event),
        },
        affectedNotes: 1,
        display: {
          target: displayTarget(input.review),
          changes: [
            t('actions.review.key-events.delete', { name: event.event }),
          ],
        },
        ...(context.origin === 'ui'
          ? { baseEntry: keyEventSnapshot(event) }
          : {}),
        execute: async (executionSignal) => {
          throwIfAborted(executionSignal);
          await requireWritable(input.review, weekStart, executionSignal);
          try {
            await deps.updateKeyEvents(weekStart, (current) => {
              const index = expectAt(current, input.key, event, locate);
              
              
              return {
                keyEvents: current.keyEvents.filter(
                  (_candidate, position) => position !== index
                ),
                keyEventsAutoImported: current.keyEventsAutoImported,
              };
            });
          } catch (error) {
            return executionError(error);
          }
          return { review: structuredClone(input.review), key: input.key };
        },
      };
    },
  };

  return {
    'review.add_key_events': add,
    'review.update_key_event': update,
    'review.delete_key_event': remove,
  };
}
