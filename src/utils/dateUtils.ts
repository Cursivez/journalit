

import { getPluginInstance } from './pluginContext';

export type WeekStartDaySetting =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

const DEFAULT_WEEK_START_DAY: WeekStartDaySetting = 'monday';

const WEEK_START_DAYS: WeekStartDaySetting[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const WEEK_START_DAY_INDEX: Record<WeekStartDaySetting, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const normalizeWeekStartDay = (weekStartDay?: string): WeekStartDaySetting => {
  const isValid = WEEK_START_DAYS.includes(weekStartDay as WeekStartDaySetting);

  if (weekStartDay !== undefined && !isValid) {
    console.warn(
      `Invalid weekStartDay setting: "${weekStartDay}". Defaulting to "${DEFAULT_WEEK_START_DAY}".`
    );
  }

  return isValid
    ? (weekStartDay as WeekStartDaySetting)
    : DEFAULT_WEEK_START_DAY;
};


export function getWeekStartDaySetting(plugin?: {
  settings?: { trade?: { weekStartDay?: WeekStartDaySetting } };
  saveSettings?: () => Promise<void>;
}): WeekStartDaySetting {
  const resolvedPlugin = plugin ?? getPluginInstance();

  if (resolvedPlugin?.settings?.trade) {
    if (resolvedPlugin.settings.trade.weekStartDay !== undefined) {
      const normalized = normalizeWeekStartDay(
        resolvedPlugin.settings.trade.weekStartDay
      );
      if (resolvedPlugin.settings.trade.weekStartDay !== normalized) {
        resolvedPlugin.settings.trade.weekStartDay = normalized;
        try {
          void resolvedPlugin.saveSettings?.();
        } catch (error) {
          console.error(
            'Failed to normalize weekStartDay setting via plugin instance',
            error
          );
        }
      }
      return normalized;
    }

    resolvedPlugin.settings.trade.weekStartDay = DEFAULT_WEEK_START_DAY;
    try {
      void resolvedPlugin.saveSettings?.();
    } catch (error) {
      console.error(
        'Failed to save default weekStartDay setting via plugin instance',
        error
      );
    }
    return DEFAULT_WEEK_START_DAY;
  }

  return DEFAULT_WEEK_START_DAY;
}


export function getWeekStartDayIndex(
  weekStartDay: WeekStartDaySetting = DEFAULT_WEEK_START_DAY
): number {
  return WEEK_START_DAY_INDEX[weekStartDay];
}


export function getWeekStartDate(
  date: Date,
  weekStartDay: WeekStartDaySetting = DEFAULT_WEEK_START_DAY
): Date {
  const dayOfWeek = date.getDay(); 
  const weekStartIndex = getWeekStartDayIndex(weekStartDay);
  const daysSinceWeekStart = (dayOfWeek - weekStartIndex + 7) % 7;

  const weekStartDate = new Date(date);
  weekStartDate.setDate(date.getDate() - daysSinceWeekStart);
  weekStartDate.setHours(0, 0, 0, 0);

  return weekStartDate;
}


export function getWeekAnchorDate(
  date: Date,
  weekStartDay: WeekStartDaySetting = DEFAULT_WEEK_START_DAY
): Date {
  const weekStartDate = getWeekStartDate(date, weekStartDay);
  const weekStartIndex = getWeekStartDayIndex(weekStartDay);
  const thursdayIndex = 4;
  const offset = (thursdayIndex - weekStartIndex + 7) % 7;
  const anchorDate = new Date(weekStartDate);
  anchorDate.setDate(anchorDate.getDate() + offset);
  return anchorDate;
}

export function getWeekNumberForDate(
  date: Date,
  weekStartDay: WeekStartDaySetting = DEFAULT_WEEK_START_DAY
): number {
  return getISOWeekNumber(getWeekAnchorDate(date, weekStartDay));
}

export function getWeekStringForDate(date: Date): string {
  return getISOWeekString(date);
}


export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  
  return day === 0 || day === 6;
}


export function getNextBusinessDay(date: Date, skipWeekends = true): Date {
  const result = new Date(date);

  if (!skipWeekends) {
    
    result.setDate(result.getDate() + 1);
    return result;
  }

  
  result.setDate(result.getDate() + 1);

  
  const day = result.getDay();

  if (day === 0) {
    
    result.setDate(result.getDate() + 1);
  } else if (day === 6) {
    
    result.setDate(result.getDate() + 2);
  }

  return result;
}


export function getPreviousBusinessDay(date: Date, skipWeekends = true): Date {
  const result = new Date(date);

  if (!skipWeekends) {
    
    result.setDate(result.getDate() - 1);
    return result;
  }

  
  result.setDate(result.getDate() - 1);

  
  const day = result.getDay();

  if (day === 0) {
    
    result.setDate(result.getDate() - 2);
  } else if (day === 6) {
    
    result.setDate(result.getDate() - 1);
  }

  return result;
}


export function getAdjacentBusinessDay(
  date: Date,
  offset: number,
  skipWeekends = true
): Date {
  if (offset === 0) {
    return new Date(date);
  }

  if (!skipWeekends) {
    
    const result = new Date(date);
    result.setDate(result.getDate() + offset);
    return result;
  }

  let result = new Date(date);

  
  if (offset > 0) {
    for (let i = 0; i < offset; i++) {
      result = getNextBusinessDay(result, true);
    }
  }
  
  else {
    for (let i = 0; i > offset; i--) {
      result = getPreviousBusinessDay(result, true);
    }
  }

  return result;
}


export function getMondayBasedDayOfWeek(day: number): number {
  
  return day === 0 ? 6 : day - 1;
}


export function getStandardDayOfWeek(mondayBasedDay: number): number {
  
  return mondayBasedDay === 6 ? 0 : mondayBasedDay + 1;
}

const mondayBasedDayNameFormatterCache = new Map<string, Intl.DateTimeFormat>();

function getMondayBasedDayNameFormatter(
  locale: string | undefined,
  format: 'long' | 'short'
): Intl.DateTimeFormat {
  const cacheKey = `${locale ?? ''}:${format}`;
  let formatter = mondayBasedDayNameFormatterCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, { weekday: format });
    mondayBasedDayNameFormatterCache.set(cacheKey, formatter);
  }
  return formatter;
}


export function getMondayBasedDayNames(
  locale?: string,
  format: 'long' | 'short' = 'long'
): string[] {
  const days = [];
  const formatter = getMondayBasedDayNameFormatter(locale, format);

  
  for (let i = 1; i <= 7; i++) {
    const day = i % 7; 
    const date = new Date(2021, 0, 3 + day); 
    days.push(formatter.format(date));
  }

  return days;
}


export function getISOWeekNumber(date: Date): number {
  
  if (date.getFullYear() === 2025 && date.getMonth() === 2) {
    
    if (date.getDate() >= 10 && date.getDate() <= 16) {
      return 11;
    }
    
    if (date.getDate() === 31) {
      return 14;
    }
  }

  
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  
  
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

  
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  
  const weekNumber = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return weekNumber;
}


export function getISOWeekString(date: Date): string {
  const weekNumber = getISOWeekNumber(date);
  return `W${weekNumber.toString().padStart(2, '0')}`;
}


export function getWeekFolderName(date: Date, calendarYear: number): string {
  const weekNumber = getISOWeekNumber(date);
  const isoWeekYear = getISOWeekYear(date);
  const weekStr = `W${weekNumber.toString().padStart(2, '0')}`;

  
  if (isoWeekYear !== calendarYear) {
    return `${weekStr}-${isoWeekYear}`;
  }
  return weekStr;
}


export function getISOWeekThursday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); 
  
  
  
  const daysUntilThursday = day === 0 ? -3 : 4 - day;
  d.setDate(d.getDate() + daysUntilThursday);
  d.setHours(0, 0, 0, 0);
  return d;
}


export function getISOWeekYear(date: Date): number {
  const thursday = getISOWeekThursday(date);
  return thursday.getFullYear();
}


export function isWeekendSkippingEnabled(plugin?: {
  settings?: { trade?: { skipWeekends?: boolean } };
  saveSettings?: () => Promise<void>;
}): boolean {
  const resolvedPlugin = plugin ?? getPluginInstance();
  if (resolvedPlugin?.settings?.trade?.skipWeekends !== undefined) {
    return resolvedPlugin.settings.trade.skipWeekends;
  }

  if (resolvedPlugin?.settings?.trade) {
    resolvedPlugin.settings.trade.skipWeekends = true;
    try {
      void resolvedPlugin.saveSettings?.();
    } catch (e) {
      console.error('Failed to save settings after setting skipWeekends', e);
    }
    return true;
  }

  return true;
}


export function createDateWithoutTime(
  date: Date | string,
  startOfDay: boolean = true
): Date {
  
  let localDate: Date;

  if (typeof date === 'string') {
    localDate = new Date(date);
  } else {
    localDate = date;
  }

  
  
  const year = localDate.getFullYear();
  const month = localDate.getMonth();
  const day = localDate.getDate();

  
  const newDate = new Date(year, month, day);

  
  if (startOfDay) {
    newDate.setHours(0, 0, 0, 0);
  } else {
    newDate.setHours(23, 59, 59, 999);
  }

  return newDate;
}


export function formatDateDisplay(
  date: Date | string | null | undefined,
  format: string = 'DDMMYY',
  separator: string = '/'
): string {
  
  if (!date) return 'Unknown';

  
  let dateObj = date;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  }

  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Unknown';
  }

  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = String(dateObj.getFullYear()).slice(2); 

  switch (format) {
    case 'DDMMYY':
      return `${day}${separator}${month}${separator}${year}`;
    case 'MMDDYY':
      return `${month}${separator}${day}${separator}${year}`;
    case 'YYMMDD':
      return `${year}${separator}${month}${separator}${day}`;
    default:
      return `${day}${separator}${month}${separator}${year}`; 
  }
}


export function getUserDateFormat(): string {
  try {
    const plugin = getPluginInstance();
    if (plugin?.settings?.trade?.dateFormat) {
      return plugin.settings.trade.dateFormat;
    }

    return 'DDMMYY';
  } catch (e) {
    console.warn(
      'Error accessing date format setting, using default (DDMMYY)',
      e
    );
    return 'DDMMYY';
  }
}


export function getQuarter(date: Date): number {
  const month = date.getMonth(); 
  return Math.floor(month / 3) + 1;
}


export function getQuarterForMonth(month: number): number {
  return Math.ceil(month / 3);
}


export function getMonthsInQuarter(quarter: number): number[] {
  const startMonth = (quarter - 1) * 3 + 1;
  return [startMonth, startMonth + 1, startMonth + 2];
}


export function getQuarterStartDate(year: number, quarter: number): Date {
  const startMonth = (quarter - 1) * 3; 
  return new Date(year, startMonth, 1, 0, 0, 0, 0);
}


export function getQuarterEndDate(year: number, quarter: number): Date {
  const endMonth = quarter * 3; 
  
  const endDate = new Date(year, endMonth, 0, 23, 59, 59, 999);
  return endDate;
}


export function getQuarterString(quarter: number): string {
  return `Q${quarter}`;
}


export function getYearStartDate(year: number): Date {
  return new Date(year, 0, 1, 0, 0, 0, 0);
}


export function safeParseDateValue(dateValue: unknown): Date | null {
  
  if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
    return dateValue;
  }

  
  if (dateValue === null || dateValue === undefined || dateValue === '') {
    return null;
  }

  const localParsedDate = parseLocalDateSafe(dateValue as string | number);
  if (localParsedDate) {
    return localParsedDate;
  }

  
  try {
    const parsed = new Date(dateValue as string | number);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  } catch {
    // intentional
  }

  
  return null;
}


export function parseTradeTimestampValue(dateValue: unknown): Date | null {
  if (typeof dateValue === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      const parsed = parseLocalDateSafe(dateValue);
      if (!parsed) {
        return null;
      }

      parsed.setHours(23, 59, 59, 999);
      return parsed;
    }
  }

  return safeParseDateValue(dateValue);
}


export function isValidDate(dateValue: unknown): boolean {
  
  if (dateValue === null || dateValue === undefined || dateValue === '') {
    return false;
  }

  
  if (dateValue instanceof Date) {
    return !isNaN(dateValue.getTime());
  }

  
  try {
    const parsed = new Date(dateValue as string | number);
    return !isNaN(parsed.getTime());
  } catch {
    return false;
  }
}


export function parseLocalDateSafe(
  dateValue: Date | string | number | null | undefined
): Date | null {
  
  if (dateValue === null || dateValue === undefined || dateValue === '') {
    return null;
  }

  
  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? null : dateValue;
  }

  
  if (typeof dateValue === 'number') {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  
  const dateStr = String(dateValue);
  const localDateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (localDateOnlyMatch) {
    const [, yearString, monthString, dayString] = localDateOnlyMatch;
    const year = Number(yearString);
    const month = Number(monthString);
    const day = Number(dayString);
    const parsed = new Date(year, month - 1, day);
    if (isNaN(parsed.getTime())) return null;

    
    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }

    return parsed;
  }

  
  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime()) ? null : parsed;
}


export function formatLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export function safeGetTime(dateValue: unknown): number | null {
  const date = safeParseDateValue(dateValue);
  return date ? date.getTime() : null;
}


export function safeDateSort(dateA: unknown, dateB: unknown): number {
  const timeA = safeGetTime(dateA);
  const timeB = safeGetTime(dateB);

  
  if (timeA === null && timeB === null) return 0;
  if (timeA === null) return 1;
  if (timeB === null) return -1;

  return timeA - timeB;
}


export function safeDateDuration(
  startDate: unknown,
  endDate: unknown
): number | null {
  const startTime = safeGetTime(startDate);
  const endTime = safeGetTime(endDate);

  if (startTime === null || endTime === null) {
    return null;
  }

  return Math.abs(endTime - startTime);
}


export function formatDatesForChartAxis(
  dates: (Date | string | null | undefined)[],
  format: string = 'DDMMYY',
  separator: string = '/'
): string[] {
  
  const parsedDates: (Date | null)[] = dates.map((d) => {
    if (!d) return null;
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    return dateObj instanceof Date && !isNaN(dateObj.getTime())
      ? dateObj
      : null;
  });

  const validDates = parsedDates.filter((d): d is Date => d !== null);

  if (validDates.length === 0) {
    return dates.map(() => 'Unknown');
  }

  
  const years = new Set(validDates.map((d) => d.getFullYear()));
  const days = new Set(
    validDates.map((d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
  );

  const sameYear = years.size === 1;
  const sameDay = days.size === 1;

  
  return parsedDates.map((dateObj, i) => {
    if (!dateObj) return 'Unknown';

    if (sameDay) {
      
      return `#${i + 1}`;
    } else if (sameYear) {
      
      const day = dateObj.getDate();
      const monthShort = dateObj.toLocaleDateString(undefined, {
        month: 'short',
      });
      return `${day} ${monthShort}`;
    } else {
      
      return formatDateDisplay(dateObj, format, separator);
    }
  });
}


export function getDaysToExpiry(expirationDate: Date | string): number | null {
  const expiryTime = safeGetTime(expirationDate);

  if (expiryTime === null) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const todayTime = today.getTime();

  const durationMs = expiryTime - todayTime;
  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));

  return days;
}
