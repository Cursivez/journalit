import { t, type TranslationKey } from '../lang/helpers';
import type { NewsEvent } from '../services/weekly/types';

export const KEY_EVENT_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const KEY_EVENT_COLORS = ['gray', 'red', 'orange', 'yellow'] as const;

export type KeyEventColor = (typeof KEY_EVENT_COLORS)[number];

const DAY_TO_KEY: Partial<Record<string, TranslationKey>> = {
  Monday: 'common.day.monday',
  Tuesday: 'common.day.tuesday',
  Wednesday: 'common.day.wednesday',
  Thursday: 'common.day.thursday',
  Friday: 'common.day.friday',
  Saturday: 'common.day.saturday',
  Sunday: 'common.day.sunday',
};

const DAY_TO_SHORT_KEY: Partial<Record<string, TranslationKey>> = {
  Monday: 'calendar.day.mon',
  Tuesday: 'calendar.day.tue',
  Wednesday: 'calendar.day.wed',
  Thursday: 'calendar.day.thu',
  Friday: 'calendar.day.fri',
  Saturday: 'calendar.day.sat',
  Sunday: 'calendar.day.sun',
};

export function getKeyEventColor(value: unknown): KeyEventColor {
  switch (value) {
    case 'red':
    case 'orange':
    case 'yellow':
      return value;
    default:
      return 'gray';
  }
}

export function getKeyEventDayLabel(day: string | undefined): string {
  if (!day) return t('common.day.all-week');
  const dayKey = DAY_TO_KEY[day];
  return dayKey ? t(dayKey) : day;
}

export function getKeyEventShortDayLabel(day: string): string {
  const dayKey = DAY_TO_SHORT_KEY[day];
  return dayKey ? t(dayKey) : day;
}

export function isKnownKeyEventDay(day: string): boolean {
  return KEY_EVENT_DAYS.some((candidate) => candidate === day);
}

export function compareKeyEventDays(
  firstDay: string | undefined,
  secondDay: string | undefined
): number {
  return getKeyEventDayIndex(firstDay) - getKeyEventDayIndex(secondDay);
}

export function isKeyEventDayPast(
  day: string | undefined,
  currentDate: Date
): boolean {
  if (!day) return false;

  const dayIndex = KEY_EVENT_DAYS.findIndex((candidate) => candidate === day);
  if (dayIndex === -1) return false;

  const currentDayIndex = (currentDate.getDay() + 6) % 7;
  return dayIndex < currentDayIndex;
}

export function getKeyEventDateForWeek(
  weekStartDate: Date,
  day: string | undefined
): Date | null {
  if (!day) return null;
  const dayIndex = KEY_EVENT_DAYS.findIndex((candidate) => candidate === day);
  if (dayIndex === -1) return null;

  
  
  
  const targetDayOfWeek = (dayIndex + 1) % 7;
  const offset = (targetDayOfWeek - weekStartDate.getDay() + 7) % 7;
  const date = new Date(weekStartDate);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}


export function isKeyEventPast(
  event: Pick<NewsEvent, 'day' | 'time' | 'eventType'>,
  weekStartDate: Date | null,
  currentDate: Date
): boolean {
  if (!weekStartDate) return false;

  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  if (!event.day) {
    const weekEnd = new Date(weekStartDate);
    weekEnd.setHours(0, 0, 0, 0);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return weekEnd.getTime() <= today.getTime();
  }

  const eventDate = getKeyEventDateForWeek(weekStartDate, event.day);
  if (!eventDate) return false;
  if (eventDate.getTime() < today.getTime()) return true;
  if (eventDate.getTime() > today.getTime()) return false;
  if (event.eventType === 'holiday' || !event.time) return false;

  const scheduledAt = new Date(event.time).getTime();
  return Number.isFinite(scheduledAt) && scheduledAt < currentDate.getTime();
}

function getKeyEventDayIndex(day: string | undefined): number {
  if (!day) return -1;
  const index = KEY_EVENT_DAYS.findIndex((candidate) => candidate === day);
  return index === -1 ? KEY_EVENT_DAYS.length : index;
}

interface KeyEventPickerDay {
  day: string;
  
  date: Date | null;
  hasEvents: boolean;
  isToday: boolean;
  isPast: boolean;
}


export function buildKeyEventPickerDays(
  daysWithEvents: ReadonlySet<string>,
  weekStartDate: Date | null,
  currentDate: Date
): KeyEventPickerDay[] {
  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);
  const days: KeyEventPickerDay[] = [];
  for (const day of KEY_EVENT_DAYS) {
    const hasEvents = daysWithEvents.has(day);
    if ((day === 'Saturday' || day === 'Sunday') && !hasEvents) continue;
    const date = weekStartDate
      ? getKeyEventDateForWeek(weekStartDate, day)
      : null;
    days.push({
      day,
      date,
      hasEvents,
      isToday: date !== null && date.getTime() === today.getTime(),
      isPast: date !== null && date.getTime() < today.getTime(),
    });
  }
  if (!weekStartDate) return days;
  return days.sort(
    (first, second) =>
      (first.date?.getTime() ?? 0) - (second.date?.getTime() ?? 0)
  );
}


export function resolveDefaultKeyEventPickerDay(
  days: readonly KeyEventPickerDay[]
): string | null {
  const eventful = days.filter((entry) => entry.hasEvents);
  if (eventful.length === 0) return null;
  return (
    eventful.find((entry) => !entry.isPast) ?? eventful[eventful.length - 1]
  ).day;
}
