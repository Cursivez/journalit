

import { t } from '../../../lang/helpers';

const MONTH_SHORT_KEYS = [
  'calendar.month.jan',
  'calendar.month.feb',
  'calendar.month.mar',
  'calendar.month.apr',
  'calendar.month.may',
  'calendar.month.jun',
  'calendar.month.jul',
  'calendar.month.aug',
  'calendar.month.sep',
  'calendar.month.oct',
  'calendar.month.nov',
  'calendar.month.dec',
] as const;


const DAY_KEYS = [
  'calendar.day.sun',
  'calendar.day.mon',
  'calendar.day.tue',
  'calendar.day.wed',
  'calendar.day.thu',
  'calendar.day.fri',
  'calendar.day.sat',
] as const;


const CALENDAR_WEEKDAY_KEYS = [
  'calendar.weekday.sun',
  'calendar.weekday.mon',
  'calendar.weekday.tue',
  'calendar.weekday.wed',
  'calendar.weekday.thu',
  'calendar.weekday.fri',
  'calendar.weekday.sat',
] as const;


export const previewMonthShort = (month: number): string =>
  t(MONTH_SHORT_KEYS[month]);


export const previewDayLabel = (weekday: number): string =>
  t(DAY_KEYS[weekday]);


export const previewCalendarWeekday = (weekday: number): string =>
  t(CALENDAR_WEEKDAY_KEYS[weekday]);


export const previewDateTick = (day: number, month: number): string =>
  `${day} ${previewMonthShort(month)}`;
