import { getCurrentLanguage } from '../lang/helpers';



const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();
const monthFormatters = new Map<string, Intl.DateTimeFormat>();
const reviewDateFormatters = new Map<string, Intl.DateTimeFormat>();

type LocalizedReviewDateLength = 'full' | 'medium' | 'short';

function getDateTimeFormatter(locale: string): Intl.DateTimeFormat {
  let formatter = dateTimeFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    dateTimeFormatters.set(locale, formatter);
  }
  return formatter;
}

export function formatLocalizedDateTime(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return getDateTimeFormatter(getCurrentLanguage()).format(date);
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
  length: LocalizedReviewDateLength
): string {
  const locale = getCurrentLanguage();
  const cacheKey = `${locale}\u0000${length}`;
  let formatter = reviewDateFormatters.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      weekday:
        length === 'short' ? undefined : length === 'full' ? 'long' : 'short',
      year: 'numeric',
      month: length === 'full' ? 'long' : 'short',
      day: 'numeric',
    });
    reviewDateFormatters.set(cacheKey, formatter);
  }
  return formatter.format(date);
}
