import { getCurrentLanguage } from '../lang/helpers';
import { formatDateDisplay } from './dateUtils';
import { getUserHourCycle } from './timeFormat';



const timeFormatters = new Map<string, Intl.DateTimeFormat>();
const monthFormatters = new Map<string, Intl.DateTimeFormat>();
const reviewDateFormatters = new Map<string, Intl.DateTimeFormat>();
const monthDayFormatters = new Map<string, Intl.DateTimeFormat>();

type LocalizedReviewDateLength = 'full' | 'medium' | 'short';

function getTimeFormatter(
  locale: string,
  timeStyle: 'short' | 'medium'
): Intl.DateTimeFormat {
  const hourCycle = getUserHourCycle();
  const cacheKey = `${locale}\u0000${timeStyle}\u0000${hourCycle}`;
  let formatter = timeFormatters.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      timeStyle,
      hourCycle,
    });
    timeFormatters.set(cacheKey, formatter);
  }
  return formatter;
}

export function formatLocalizedTime(
  date: Date,
  timeStyle: 'short' | 'medium' = 'short'
): string {
  return getTimeFormatter(getCurrentLanguage(), timeStyle).format(date);
}

export function formatLocalizedDateTime(
  value: Date | string,
  timeStyle: 'short' | 'medium' = 'short'
): string {
  const date = value instanceof Date ? value : new Date(value);
  return `${formatDateDisplay(date)} ${formatLocalizedTime(date, timeStyle)}`;
}


export function formatLocalizedMonthDay(value: Date): string {
  const locale = getCurrentLanguage();
  let formatter = monthDayFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
    });
    monthDayFormatters.set(locale, formatter);
  }
  return formatter.format(value);
}

export function formatLocalizedMonth(
  value: Date | number | string,
  timeZone: string
): string {
  const locale = getCurrentLanguage();
  const cacheKey = `${locale}\u0000${timeZone}`;
  let formatter = monthFormatters.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      month: 'short',
      year: 'numeric',
      timeZone,
    });
    monthFormatters.set(cacheKey, formatter);
  }
  return formatter.format(new Date(value));
}

export function formatLocalizedReviewDate(
  date: Date,
  length: LocalizedReviewDateLength,
  dateFormat?: string
): string {
  const dateLabel = formatDateDisplay(date, dateFormat);
  if (length === 'short') return dateLabel;
  const locale = getCurrentLanguage();
  const cacheKey = `${locale}\u0000${length}`;
  let formatter = reviewDateFormatters.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      weekday: length === 'full' ? 'long' : 'short',
    });
    reviewDateFormatters.set(cacheKey, formatter);
  }
  return `${formatter.format(date)}, ${dateLabel}`;
}
