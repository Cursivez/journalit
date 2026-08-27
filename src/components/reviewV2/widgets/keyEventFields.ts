

import type {
  NewsEvent,
  NewsEventImpact,
} from '../../../services/weekly/types';
import { ECONOMIC_CALENDAR_CURRENCIES } from '../../../services/economicCalendar/economicCalendarScope';
import {
  getKeyEventDateForWeek,
  getKeyEventColor,
  type KeyEventColor,
} from '../../../utils/keyEvents';


export const KEY_EVENT_CURRENCIES = ECONOMIC_CALENDAR_CURRENCIES;


export interface ManualKeyEventDraft {
  currency: string;
  timeOfDay: string;
}

export const EMPTY_MANUAL_KEY_EVENT_DRAFT: ManualKeyEventDraft = {
  currency: '',
  timeOfDay: '',
};

const COLOR_IMPACTS: Record<KeyEventColor, NewsEventImpact> = {
  red: 'high',
  orange: 'medium',
  yellow: 'low',
  gray: 'none',
};

function parseKeyEventCurrency(value: string): string | undefined {
  return KEY_EVENT_CURRENCIES.find((currency) => currency === value);
}

export function keyEventImpactForColor(
  color: string | undefined
): NewsEventImpact {
  return COLOR_IMPACTS[getKeyEventColor(color)];
}


export function timeOfDayInputValue(isoTimestamp: string | undefined): string {
  if (typeof isoTimestamp !== 'string' || isoTimestamp.length === 0) return '';
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}


export function resolveManualKeyEventDate(options: {
  day: string | undefined;
  weekStart: Date | null;
  eventDate?: Date | null;
}): Date | null {
  if (options.eventDate) return new Date(options.eventDate);

  const { day, weekStart } = options;
  if (!day || !weekStart) return null;

  return getKeyEventDateForWeek(weekStart, day);
}

function utcDateKey(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function demoteChangedImportedIdentity(
  original: NewsEvent,
  updated: NewsEvent
): void {
  if (!original.source || original.eventType === 'holiday') return;

  const originalDate = utcDateKey(original.time);
  const updatedDate = utcDateKey(updated.time);
  if (!originalDate || !updatedDate || originalDate !== updatedDate) {
    delete updated.source;
    delete updated.seriesId;
  }
}


export function buildManualKeyEventTime(
  timeOfDay: string,
  baseDate: Date | null
): string | undefined {
  if (!timeOfDay || !baseDate) return undefined;

  const match = /^(\d{1,2}):(\d{2})$/.exec(timeOfDay);
  if (!match) return undefined;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return undefined;

  const stamped = new Date(baseDate);
  stamped.setHours(hours, minutes, 0, 0);
  return stamped.toISOString();
}


export function applyManualKeyEventFields(
  event: NewsEvent,
  draft: ManualKeyEventDraft,
  baseDate: Date | null
): NewsEvent {
  const next: NewsEvent = { ...event };

  const currency = parseKeyEventCurrency(draft.currency);
  if (currency) {
    next.currency = currency;
  } else {
    delete next.currency;
  }

  next.impact = keyEventImpactForColor(event.color);

  if (event.eventType === 'holiday') {
    if (event.time) next.time = event.time;
    else delete next.time;
  } else {
    const time = buildManualKeyEventTime(draft.timeOfDay, baseDate);
    if (time) {
      next.time = time;
    } else {
      delete next.time;
    }
    
    
    
    
    demoteChangedImportedIdentity(event, next);
  }

  return next;
}


export function hasKeyEventReadings(event: NewsEvent): boolean {
  if (event.eventType === 'holiday') return false;
  return (
    event.actual !== undefined ||
    event.forecast !== undefined ||
    event.previous !== undefined
  );
}
