import {
  getWeekStartDate,
  safeParseDateValue,
  type WeekStartDaySetting,
} from './dateUtils';


export function getWeeklyReviewDateRange(
  date: Date,
  weekStartDay: WeekStartDaySetting,
  boundaries: { weekStart?: unknown; weekEnd?: unknown }
): { start: Date; end: Date } {
  const explicitStart = safeParseDateValue(boundaries.weekStart);
  const explicitEnd = safeParseDateValue(boundaries.weekEnd);
  if (explicitStart && explicitEnd && explicitStart <= explicitEnd) {
    const start = new Date(explicitStart);
    const end = new Date(explicitEnd);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  const start = getWeekStartDate(date, weekStartDay);
  const end = new Date(start);
  
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}
