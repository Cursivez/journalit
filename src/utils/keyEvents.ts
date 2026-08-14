import { t, type TranslationKey } from '../lang/helpers';

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

function getKeyEventDayIndex(day: string | undefined): number {
  if (!day) return -1;
  const index = KEY_EVENT_DAYS.findIndex((candidate) => candidate === day);
  return index === -1 ? KEY_EVENT_DAYS.length : index;
}
