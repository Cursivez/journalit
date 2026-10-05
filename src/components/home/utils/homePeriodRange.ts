import type { HomePeriodSelection } from '../../../settings/homePeriod';
import {
  createDateWithoutTime,
  getWeekStartDate,
  parseLocalDateSafe,
  type WeekStartDaySetting,
} from '../../../utils/dateUtils';


export function getHomePeriodRange(
  selection: HomePeriodSelection,
  today: Date,
  weekStartDay: WeekStartDaySetting
): [Date | null, Date | null] {
  switch (selection.period) {
    case 'lifetime':
      return [null, null];
    case 'custom':
      return [
        createDateWithoutTime(parseLocalDateSafe(selection.range.start)!, true),
        createDateWithoutTime(parseLocalDateSafe(selection.range.end)!, false),
      ];
    case 'week':
      return [
        createDateWithoutTime(getWeekStartDate(today, weekStartDay), true),
        createDateWithoutTime(today, false),
      ];
    case 'month':
      return [
        new Date(today.getFullYear(), today.getMonth(), 1),
        createDateWithoutTime(today, false),
      ];
    case 'quarter':
      return [
        new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1),
        createDateWithoutTime(today, false),
      ];
    case 'year':
      return [
        new Date(today.getFullYear(), 0, 1),
        createDateWithoutTime(today, false),
      ];
  }
}
