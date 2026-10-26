

import type { NewsEvent } from '../../weekly/types';
import {
  applyManualKeyEventFields,
  buildManualKeyEventTime,
  demoteChangedImportedIdentity,
  keyEventImpactForColor,
  resolveManualKeyEventDate,
  timeOfDayInputValue,
} from '../../../components/reviewV2/widgets/keyEventFields';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput, ActionSummary } from '../ActionTypes';

type NewKeyEvent = ActionInput<'review.add_key_events'>['events'][number];
export type KeyEventFields = ActionInput<'review.update_key_event'>['fields'];
export type KeyEventChange =
  ActionSummary<'review.update_key_event'>['changed_fields'][number];

const CHANGE_ORDER: readonly KeyEventChange[] = [
  'event',
  'day',
  'notes',
  'color',
  'currency',
  'time',
];


function eventName(value: string, field: string): string {
  const name = value.trim();
  if (name === '') throw new ActionPlanError('invalid_request', field);
  return name;
}


export function newKeyEvent(
  input: NewKeyEvent,
  weekStart: Date,
  field: string
): NewsEvent {
  if (input.time !== undefined && input.day === undefined) {
    
    throw new ActionPlanError('invalid_request', field);
  }
  return applyManualKeyEventFields(
    {
      event: eventName(input.event, field),
      notes: input.notes ?? '',
      color: input.color ?? 'gray',
      day: input.day,
    },
    { currency: input.currency ?? '', timeOfDay: input.time ?? '' },
    resolveManualKeyEventDate({ day: input.day, weekStart })
  );
}


export function editedKeyEvent(
  event: NewsEvent,
  fields: KeyEventFields,
  weekStart: Date
): { next: NewsEvent; changed: KeyEventChange[] } {
  const holiday = event.eventType === 'holiday';
  if (holiday && fields.time !== undefined) {
    
    throw new ActionPlanError('unsupported_capability', 'fields.time');
  }
  const day = fields.day === undefined ? event.day : (fields.day ?? undefined);
  if (typeof fields.time === 'string' && day === undefined) {
    throw new ActionPlanError('invalid_request', 'fields.time');
  }

  const next: NewsEvent = { ...event };
  if (fields.event !== undefined) {
    next.event = eventName(fields.event, 'fields.event');
  }
  if (fields.notes !== undefined) next.notes = fields.notes;
  if (day === undefined) delete next.day;
  else next.day = day;
  if (fields.currency === null) delete next.currency;
  else if (fields.currency !== undefined) next.currency = fields.currency;
  if (fields.color !== undefined) {
    next.color = fields.color;
    next.impact = keyEventImpactForColor(fields.color);
  }
  if (!holiday && (fields.time !== undefined || day !== event.day)) {
    
    
    const timeOfDay =
      fields.time === undefined
        ? timeOfDayInputValue(event.time)
        : (fields.time ?? '');
    const time = buildManualKeyEventTime(
      timeOfDay,
      resolveManualKeyEventDate({ day, weekStart })
    );
    if (time === undefined) delete next.time;
    else next.time = time;
    demoteChangedImportedIdentity(event, next);
  }

  const changed = new Set<KeyEventChange>();
  if (next.event !== event.event) changed.add('event');
  if (next.day !== event.day) changed.add('day');
  if (next.notes !== event.notes) changed.add('notes');
  if (next.color !== event.color || next.impact !== event.impact) {
    changed.add('color');
  }
  if (next.currency !== event.currency) changed.add('currency');
  if (
    next.time !== event.time ||
    next.source !== event.source ||
    next.seriesId !== event.seriesId
  ) {
    changed.add('time');
  }
  return { next, changed: CHANGE_ORDER.filter((field) => changed.has(field)) };
}
