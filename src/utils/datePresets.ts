

import {
  createDateWithoutTime,
  formatLocalDateString,
  getQuarter,
  getWeekStartDate,
  type WeekStartDaySetting,
} from './dateUtils';

export type RollingDatePreset =
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'thisMonth'
  | 'thisQuarter'
  | 'thisYear';

const ROLLING_DATE_PRESETS: readonly RollingDatePreset[] = [
  'today',
  'yesterday',
  'thisWeek',
  'thisMonth',
  'thisQuarter',
  'thisYear',
];

const isRollingDatePreset = (value: unknown): value is RollingDatePreset =>
  ROLLING_DATE_PRESETS.some((preset) => preset === value);

export interface DatePresetSelection {
  preset: RollingDatePreset;
  
  asOf: string;
}

type DateRange = [Date | null, Date | null];

interface DatedFilters {
  dateRange: DateRange;
  datePreset?: DatePresetSelection;
}

const DAY_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;


function parseDayKey(key: string): Date | null {
  const match = DAY_KEY_PATTERN.exec(key);
  if (!match) return null;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  );
  return formatLocalDateString(date) === key ? date : null;
}


function getDatePresetRange(
  preset: RollingDatePreset,
  weekStartDay: WeekStartDaySetting,
  referenceDate: Date
): [Date, Date] {
  const day = new Date(referenceDate);
  let start: Date;
  let end: Date = day;
  switch (preset) {
    case 'today':
      start = day;
      break;
    case 'yesterday':
      start = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
      end = start;
      break;
    case 'thisWeek':
      start = getWeekStartDate(day, weekStartDay);
      break;
    case 'thisMonth':
      start = new Date(day.getFullYear(), day.getMonth(), 1);
      break;
    case 'thisQuarter':
      start = new Date(day.getFullYear(), (getQuarter(day) - 1) * 3, 1);
      break;
    case 'thisYear':
      start = new Date(day.getFullYear(), 0, 1);
      break;
  }
  return [
    createDateWithoutTime(start, true),
    createDateWithoutTime(end, false),
  ];
}


export function selectDatePreset(
  preset: RollingDatePreset,
  weekStartDay: WeekStartDaySetting,
  now: Date
): Required<DatedFilters> {
  return {
    dateRange: getDatePresetRange(preset, weekStartDay, now),
    datePreset: { preset, asOf: formatLocalDateString(now) },
  };
}

const sameLocalDay = (date: Date | null, expected: Date): boolean =>
  date !== null &&
  formatLocalDateString(date) === formatLocalDateString(expected);


export function activeDatePreset(
  filters: DatedFilters,
  weekStartDay: WeekStartDaySetting
): RollingDatePreset | null {
  const selection = filters.datePreset;
  if (!selection) return null;
  const asOf = parseDayKey(selection.asOf);
  if (!asOf) return null;
  const [start, end] = getDatePresetRange(selection.preset, weekStartDay, asOf);
  return sameLocalDay(filters.dateRange[0], start) &&
    sameLocalDay(filters.dateRange[1], end)
    ? selection.preset
    : null;
}


export function rollDatePreset<T extends DatedFilters>(
  filters: T,
  weekStartDay: WeekStartDaySetting,
  now: Date
): T {
  if (!filters.datePreset) return filters;
  const preset = activeDatePreset(filters, weekStartDay);
  if (preset === null) return { ...filters, datePreset: undefined };
  if (filters.datePreset.asOf === formatLocalDateString(now)) return filters;
  return { ...filters, ...selectDatePreset(preset, weekStartDay, now) };
}


export function normalizeDatePresetSelection(
  value: unknown
): DatePresetSelection | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const preset: unknown = Reflect.get(value, 'preset');
  const asOf: unknown = Reflect.get(value, 'asOf');
  return isRollingDatePreset(preset) &&
    typeof asOf === 'string' &&
    parseDayKey(asOf) !== null
    ? { preset, asOf }
    : undefined;
}
