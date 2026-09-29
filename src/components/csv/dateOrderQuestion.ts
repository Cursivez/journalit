

import { getCurrentLanguage } from '../../lang/helpers';


export const DATE_ORDER_DIAGNOSTIC_CODES: ReadonlySet<string> = new Set([
  'ambiguous_date_format',
  'mixed_date_format',
]);


export const DATE_FORMAT_DIAGNOSTIC_CODES: ReadonlySet<string> = new Set([
  ...DATE_ORDER_DIAGNOSTIC_CODES,
  'future_trade_date',
  'unsupported_date_format',
]);

const FORMAT_TOKEN = /yyyy|MM|M|dd|d|HH|mm|ss/g;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');
}


export function readDateWithFormat(
  value: string,
  format: string
): { year: number; month: number; day: number } | null {
  const order: string[] = [];
  let pattern = '';
  let lastIndex = 0;
  for (const match of format.matchAll(FORMAT_TOKEN)) {
    pattern += escapeRegExp(format.slice(lastIndex, match.index));
    pattern += match[0] === 'yyyy' ? '(\\d{4})' : '(\\d{1,2})';
    order.push(match[0]);
    lastIndex = match.index + match[0].length;
  }
  pattern += escapeRegExp(format.slice(lastIndex));
  const parts = new RegExp(`^${pattern}(?:[ T].*)?$`).exec(value.trim());
  if (!parts) return null;

  let year = 0;
  let month = 0;
  let day = 0;
  order.forEach((token, index) => {
    const number = Number(parts[index + 1]);
    if (token === 'yyyy') year = number;
    else if (token === 'MM' || token === 'M') month = number;
    else if (token === 'dd' || token === 'd') day = number;
  });
  if (month < 1 || month > 12 || day < 1) return null;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day <= daysInMonth ? { year, month, day } : null;
}

const longDateFormatters = new Map<string, Intl.DateTimeFormat>();


export function describeDateReading(
  value: string,
  format: string
): string | null {
  const date = readDateWithFormat(value, format);
  if (!date) return null;
  const locale = getCurrentLanguage();
  let formatter = longDateFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    longDateFormatters.set(locale, formatter);
  }
  return formatter.format(
    new Date(Date.UTC(date.year, date.month - 1, date.day))
  );
}
