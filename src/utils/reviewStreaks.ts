

import type { WeekStartDay } from '../settings/types';
import { getWeekStartDate } from './dateUtils';

export type ReviewStreakKind =
  | 'trade-review'
  | 'drc-review'
  | 'weekly-review'
  | 'monthly-review';

export type ScheduledReviewStreakKind = Exclude<
  ReviewStreakKind,
  'trade-review'
>;

export interface ReviewStreakItem {
  date: Date;
  reviewed: boolean;
}

type ReviewStreakUnitType = 'trade' | 'day' | 'week' | 'month';

interface ReviewStreakCalculationOptions {
  
  now?: Date;
  
  skipWeekends?: boolean;
  
  weekStartDay?: WeekStartDay;
}

interface ReviewStreakUnit {
  
  key: string;
  
  date: Date;
  reviewed: boolean;
  required: boolean;
  
  pending: boolean;
  type: ReviewStreakUnitType;
}

interface ReviewStreakSummary {
  currentStreak: number;
  
  missedRequiredUnits: number;
  hasReviewedAnchor: boolean;
  
  waitingCount?: number;
}

const DEFAULT_WEEK_START: WeekStartDay = 'monday';

const isValidDate = (date: Date): boolean =>
  date instanceof Date && Number.isFinite(date.getTime());

const formatLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDateKey = (key: string): Date => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};


const addLocalDays = (key: string, amount: number): string => {
  const date = parseLocalDateKey(key);
  date.setDate(date.getDate() + amount);
  return formatLocalDateKey(date);
};

const addLocalMonths = (key: string, amount: number): string => {
  const [year, month] = key.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + amount);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const monthKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const weekKey = (date: Date, weekStartDay?: WeekStartDay): string => {
  return formatLocalDateKey(
    getWeekStartDate(date, weekStartDay ?? DEFAULT_WEEK_START)
  );
};

const getNow = (options: ReviewStreakCalculationOptions): Date => {
  const now = options.now ?? new Date();
  if (!isValidDate(now)) {
    throw new Error('Review streak calculations require a valid current date.');
  }
  return now;
};

const getSourceItems = (
  items: readonly ReviewStreakItem[],
  getKey: (date: Date) => string,
  endKey: string
): ReviewStreakItem[] => {
  const sourceItems: ReviewStreakItem[] = [];
  for (const item of items) {
    if (!isValidDate(item.date) || getKey(item.date) > endKey) {
      continue;
    }
    sourceItems.push({
      date: new Date(item.date.getTime()),
      reviewed: item.reviewed,
    });
  }
  return sourceItems;
};

const getEarliestKey = (
  sourceItems: readonly ReviewStreakItem[],
  getKey: (date: Date) => string
): string | null => {
  let earliest: string | null = null;
  for (const item of sourceItems) {
    const key = getKey(item.date);
    if (earliest === null || key < earliest) earliest = key;
  }
  return earliest;
};

const createReviewedByKey = (
  sourceItems: readonly ReviewStreakItem[],
  getKey: (date: Date) => string
): Map<string, boolean> => {
  const reviewedByKey = new Map<string, boolean>();
  for (const item of sourceItems) {
    const key = getKey(item.date);
    
    
    reviewedByKey.set(key, (reviewedByKey.get(key) ?? false) || item.reviewed);
  }
  return reviewedByKey;
};

const createScheduledUnits = ({
  sourceItems,
  startKey,
  endKey,
  type,
  currentKey,
  nextKey,
  requiredForKey,
  dateForKey,
  getKey,
}: {
  sourceItems: readonly ReviewStreakItem[];
  startKey: string | null;
  endKey: string;
  type: Exclude<ReviewStreakUnitType, 'trade'>;
  currentKey: string;
  nextKey: (key: string) => string;
  requiredForKey: (key: string) => boolean;
  dateForKey: (key: string) => Date;
  getKey: (date: Date) => string;
}): ReviewStreakUnit[] => {
  if (startKey === null || startKey > endKey) return [];

  const reviewedByKey = createReviewedByKey(sourceItems, getKey);
  const units: ReviewStreakUnit[] = [];
  let key = startKey;

  while (key <= endKey) {
    units.push({
      key,
      date: dateForKey(key),
      reviewed: reviewedByKey.get(key) ?? false,
      required: requiredForKey(key),
      pending: key === currentKey,
      type,
    });
    key = nextKey(key);
  }

  return units;
};


export const buildTradeReviewUnits = (
  items: readonly ReviewStreakItem[],
  options: ReviewStreakCalculationOptions = {}
): ReviewStreakUnit[] => {
  const now = getNow(options);
  const todayKey = formatLocalDateKey(now);
  
  
  
  return getSourceItems(items, formatLocalDateKey, todayKey)
    .sort((left, right) => left.date.getTime() - right.date.getTime())
    .map((item, index) => ({
      key: `trade:${index}`,
      date: item.date,
      reviewed: item.reviewed,
      required: true,
      pending: formatLocalDateKey(item.date) === todayKey,
      type: 'trade',
    }));
};


export const buildDRCReviewUnits = (
  items: readonly ReviewStreakItem[],
  options: ReviewStreakCalculationOptions = {}
): ReviewStreakUnit[] => {
  const now = getNow(options);
  const todayKey = formatLocalDateKey(now);
  const skipWeekends = options.skipWeekends ?? true;
  const getKey = (date: Date): string => formatLocalDateKey(date);
  const sourceItems = getSourceItems(items, getKey, todayKey);
  const startKey = getEarliestKey(sourceItems, getKey);

  return createScheduledUnits({
    sourceItems,
    startKey,
    endKey: todayKey,
    currentKey: todayKey,
    nextKey: (key) => addLocalDays(key, 1),
    requiredForKey: (key) =>
      !(skipWeekends && isWeekend(parseLocalDateKey(key))),
    dateForKey: parseLocalDateKey,
    getKey,
    type: 'day',
  });
};


export const buildWeeklyReviewUnits = (
  items: readonly ReviewStreakItem[],
  options: ReviewStreakCalculationOptions = {}
): ReviewStreakUnit[] => {
  const now = getNow(options);
  const resolvedWeekStart = options.weekStartDay ?? DEFAULT_WEEK_START;
  const getKey = (date: Date): string => weekKey(date, resolvedWeekStart);
  const currentKey = getKey(now);
  const sourceItems = getSourceItems(items, getKey, currentKey);
  const startKey = getEarliestKey(sourceItems, getKey);

  return createScheduledUnits({
    sourceItems,
    startKey,
    endKey: currentKey,
    currentKey,
    nextKey: (key) => addLocalDays(key, 7),
    requiredForKey: () => true,
    dateForKey: parseLocalDateKey,
    getKey,
    type: 'week',
  });
};


export const buildMonthlyReviewUnits = (
  items: readonly ReviewStreakItem[],
  options: ReviewStreakCalculationOptions = {}
): ReviewStreakUnit[] => {
  const now = getNow(options);
  const currentKey = monthKey(now);
  const getKey = monthKey;
  const sourceItems = getSourceItems(items, getKey, currentKey);
  const startKey = getEarliestKey(sourceItems, getKey);

  return createScheduledUnits({
    sourceItems,
    startKey,
    endKey: currentKey,
    currentKey,
    nextKey: (key) => addLocalMonths(key, 1),
    requiredForKey: () => true,
    dateForKey: (key) => {
      const [year, month] = key.split('-').map(Number);
      return new Date(year, month - 1, 1);
    },
    getKey,
    type: 'month',
  });
};


export const buildReviewStreakUnits = (
  kind: ReviewStreakKind,
  items: readonly ReviewStreakItem[],
  options: ReviewStreakCalculationOptions = {}
): ReviewStreakUnit[] => {
  switch (kind) {
    case 'trade-review':
      return buildTradeReviewUnits(items, options);
    case 'drc-review':
      return buildDRCReviewUnits(items, options);
    case 'weekly-review':
      return buildWeeklyReviewUnits(items, options);
    case 'monthly-review':
      return buildMonthlyReviewUnits(items, options);
  }
};

const summarizeUnits = (
  units: readonly ReviewStreakUnit[],
  waitingCount?: number
): ReviewStreakSummary => {
  const newestReviewedIndex = (() => {
    for (let index = units.length - 1; index >= 0; index -= 1) {
      if (units[index].reviewed) return index;
    }
    return -1;
  })();

  if (newestReviewedIndex === -1) {
    return {
      currentStreak: 0,
      missedRequiredUnits: 0,
      hasReviewedAnchor: false,
      ...(waitingCount === undefined ? {} : { waitingCount }),
    };
  }

  let currentStreak = 0;
  for (let index = units.length - 1; index >= 0; index -= 1) {
    const unit = units[index];

    
    
    if (unit.pending) {
      if (unit.reviewed) currentStreak += 1;
      continue;
    }

    if (unit.reviewed) {
      currentStreak += 1;
      continue;
    }

    
    if (!unit.required) continue;
    break;
  }

  let missedRequiredUnits = 0;
  for (let index = newestReviewedIndex + 1; index < units.length; index += 1) {
    const unit = units[index];
    if (!unit.pending && unit.required && !unit.reviewed) {
      missedRequiredUnits += 1;
    }
  }

  return {
    currentStreak,
    missedRequiredUnits,
    hasReviewedAnchor: true,
    ...(waitingCount === undefined ? {} : { waitingCount }),
  };
};


export const calculateReviewStreakSummary = (
  kind: ReviewStreakKind,
  items: readonly ReviewStreakItem[],
  options: ReviewStreakCalculationOptions = {}
): ReviewStreakSummary => {
  const units = buildReviewStreakUnits(kind, items, options);
  if (kind !== 'trade-review') return summarizeUnits(units);

  const now = getNow(options);
  const waitingCount = getSourceItems(
    items,
    formatLocalDateKey,
    formatLocalDateKey(now)
  ).filter((item) => !item.reviewed).length;
  return summarizeUnits(units, waitingCount);
};
