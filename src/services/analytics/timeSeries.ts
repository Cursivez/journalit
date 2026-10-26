import {
  getWeekStartDate,
  type WeekStartDaySetting,
} from '../../utils/dateUtils';
import type { AnalyticsDateRange, AnalyticsInterval } from './types';

export const getAnalyticsIntervalStart = (
  date: Date,
  interval: AnalyticsInterval,
  weekStartDay: WeekStartDaySetting
): Date => {
  if (interval === 'week') return getWeekStartDate(date, weekStartDay);
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  switch (interval) {
    case 'day':
      return start;
    case 'month':
      start.setDate(1);
      return start;
    case 'quarter':
      start.setMonth(Math.floor(start.getMonth() / 3) * 3, 1);
      return start;
    case 'year':
      start.setMonth(0, 1);
      return start;
    default: {
      const exhaustive: never = interval;
      return exhaustive;
    }
  }
};

export const shiftAnalyticsInterval = (
  start: Date,
  interval: AnalyticsInterval,
  amount: number
): Date => {
  const shifted = new Date(start);
  switch (interval) {
    case 'day':
      shifted.setDate(shifted.getDate() + amount);
      break;
    case 'week':
      shifted.setDate(shifted.getDate() + amount * 7);
      break;
    case 'month':
      shifted.setMonth(shifted.getMonth() + amount);
      break;
    case 'quarter':
      shifted.setMonth(shifted.getMonth() + amount * 3);
      break;
    case 'year':
      shifted.setFullYear(shifted.getFullYear() + amount);
      break;
    default: {
      const exhaustive: never = interval;
      return exhaustive;
    }
  }
  return shifted;
};

export const getAnalyticsIntervalRange = (
  start: Date,
  interval: AnalyticsInterval
): AnalyticsDateRange => ({
  from: new Date(start),
  to: new Date(shiftAnalyticsInterval(start, interval, 1).getTime() - 1),
});
