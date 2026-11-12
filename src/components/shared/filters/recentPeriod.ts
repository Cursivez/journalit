

export type RecentPeriodUnit = 'sessions' | 'trades' | 'days';

export interface RecentPeriod {
  unit: RecentPeriodUnit;
  count: number;
}

export const RECENT_PERIOD_UNITS: readonly RecentPeriodUnit[] = [
  'sessions',
  'trades',
  'days',
];

export const RECENT_PERIOD_MAX_COUNT = 1000;

const isRecentPeriodUnit = (value: unknown): value is RecentPeriodUnit =>
  value === 'sessions' || value === 'trades' || value === 'days';


export const normalizeRecentPeriod = (
  value: unknown
): RecentPeriod | undefined => {
  if (typeof value !== 'object' || value === null) return undefined;
  const unit: unknown = Reflect.get(value, 'unit');
  const count: unknown = Reflect.get(value, 'count');
  if (
    !isRecentPeriodUnit(unit) ||
    typeof count !== 'number' ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > RECENT_PERIOD_MAX_COUNT
  ) {
    return undefined;
  }
  return { unit, count };
};

export const areRecentPeriodsEqual = (
  first: RecentPeriod | undefined,
  second: RecentPeriod | undefined
): boolean =>
  first === second ||
  (first !== undefined &&
    second !== undefined &&
    first.unit === second.unit &&
    first.count === second.count);

export interface RecentPeriodAccess<T> {
  
  dayOf: (item: T) => Date | null;
  
  firstDayOf: (item: T) => Date | null;
  
  isClosed: (item: T) => boolean;
  
  timeOf: (item: T) => number;
  
  keyOf: (item: T) => string;
}


export interface RecentPeriodWindow {
  
  start: Date | null;
  
  end: Date | null;
  
  keys?: ReadonlySet<string>;
  
  empty: boolean;
}

const startOfLocalDay = (date: Date): Date => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
};

const addLocalDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const EMPTY_WINDOW: RecentPeriodWindow = {
  start: null,
  end: null,
  empty: true,
};

export function resolveRecentPeriodWindow<T>(
  items: readonly T[],
  period: RecentPeriod,
  access: RecentPeriodAccess<T>,
  options: { today: Date; windowIndex?: number }
): RecentPeriodWindow {
  const windowIndex = options.windowIndex ?? 0;
  const today = startOfLocalDay(options.today);

  if (period.unit === 'days') {
    const end = addLocalDays(today, -period.count * windowIndex);
    return {
      start: addLocalDays(end, -(period.count - 1)),
      end: windowIndex === 0 ? null : end,
      empty: false,
    };
  }

  if (period.unit === 'sessions') {
    const sessionDays = new Set<number>();
    for (const item of items) {
      if (!access.isClosed(item)) continue;
      const day = access.dayOf(item);
      if (day) sessionDays.add(startOfLocalDay(day).getTime());
    }
    const newestFirst = [...sessionDays].sort((a, b) => b - a);
    const window = newestFirst.slice(
      windowIndex * period.count,
      (windowIndex + 1) * period.count
    );
    if (window.length === 0) return EMPTY_WINDOW;
    return {
      start: new Date(window[window.length - 1]),
      end: windowIndex === 0 ? null : new Date(window[0]),
      empty: false,
    };
  }

  
  
  const latestByKey = new Map<string, number>();
  for (const item of items) {
    if (!access.isClosed(item) || !access.dayOf(item)) continue;
    const key = access.keyOf(item);
    const time = access.timeOf(item);
    const existing = latestByKey.get(key);
    if (existing === undefined || time > existing) latestByKey.set(key, time);
  }
  const newestFirst = [...latestByKey]
    .sort(([keyA, a], [keyB, b]) => b - a || (keyA < keyB ? 1 : -1))
    .slice(windowIndex * period.count, (windowIndex + 1) * period.count);
  if (newestFirst.length === 0) return EMPTY_WINDOW;
  const keys = new Set(newestFirst.map(([key]) => key));
  let start: Date | null = null;
  let end: Date | null = null;
  for (const item of items) {
    if (!keys.has(access.keyOf(item))) continue;
    const last = access.dayOf(item);
    const first = access.firstDayOf(item) ?? last;
    if (first && (!start || first < start)) start = startOfLocalDay(first);
    if (last && (!end || last > end)) end = startOfLocalDay(last);
  }
  return {
    start,
    end: windowIndex === 0 ? null : end,
    keys,
    empty: false,
  };
}


export function isInRecentPeriodWindow<T>(
  item: T,
  window: RecentPeriodWindow,
  access: Pick<RecentPeriodAccess<T>, 'dayOf' | 'keyOf'>
): boolean {
  if (window.empty) return false;
  if (window.keys) return window.keys.has(access.keyOf(item));
  const day = access.dayOf(item);
  return day !== null && isDayInRecentPeriodWindow(day, window);
}


export function isDayInRecentPeriodWindow(
  day: Date,
  window: RecentPeriodWindow
): boolean {
  if (window.empty) return false;
  const time = startOfLocalDay(day).getTime();
  if (window.start && time < window.start.getTime()) return false;
  if (window.end && time > window.end.getTime()) return false;
  return true;
}
