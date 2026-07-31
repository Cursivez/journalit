import { safeParseDateValue } from '../../utils/dateUtils';
import { dateKey, periodKey, type ReviewType } from './graphTypes';

export function readPositiveInteger(value: unknown): number | undefined {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim()
        ? Number(value)
        : NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function readWeek(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toUpperCase();
  return /^W\d{1,2}$/.test(normalized) ? normalized : undefined;
}

export function readWeeklyPeriodFromPath(path: string): string | undefined {
  const match = path.match(/\/(\d{4})\/Q[1-4]\/(\d{2})\/(W\d{1,2})(?:-|\/)/i);
  if (!match) return undefined;
  return periodKey(Number(match[1]), Number(match[2]), match[3].toUpperCase());
}

export function readWeeklyPeriod(
  frontmatter: Record<string, unknown>,
  filePath: string
): { year: number; month: number; week: string } | undefined {
  const year = readPositiveInteger(frontmatter.year);
  const month = readPositiveInteger(frontmatter.month);
  const week = readWeek(frontmatter.week);
  if (year && month && week) return { year, month, week };

  const pathPeriod = readWeeklyPeriodFromPath(filePath);
  if (!pathPeriod) return undefined;
  const [pathYear, pathMonth, pathWeek] = pathPeriod.split(':');
  return {
    year: Number(pathYear),
    month: Number(pathMonth),
    week: pathWeek,
  };
}

export function readMonthlyPeriod(
  frontmatter: Record<string, unknown>,
  filePath: string
): { year: number; month: number } | undefined {
  const year = readPositiveInteger(frontmatter.year);
  const month = readPositiveInteger(frontmatter.month);
  if (year && month) return { year, month };

  const match = filePath.match(/\/(\d{4})\/Q[1-4]\/(\d{2})\/\2-Review\.md$/i);
  return match
    ? { year: Number(match[1]), month: Number(match[2]) }
    : undefined;
}

export function readQuarterlyPeriod(
  frontmatter: Record<string, unknown>,
  filePath: string
): { year: number; quarter: number } | undefined {
  const year = readPositiveInteger(frontmatter.year);
  const quarter = readPositiveInteger(frontmatter.quarter);
  if (year && quarter) return { year, quarter };

  const match = filePath.match(/\/(\d{4})\/Q([1-4])\/Q\2-Review\.md$/i);
  return match
    ? { year: Number(match[1]), quarter: Number(match[2]) }
    : undefined;
}

export function readYearFromPath(filePath: string): number | undefined {
  const match = filePath.match(/\/(\d{4})\/\1-Review\.md$/);
  return match ? Number(match[1]) : undefined;
}

export function getReviewTargetSignature(
  reviewType: ReviewType,
  frontmatter: Record<string, unknown>,
  filePath: string
): string {
  let identity: string | undefined;
  if (reviewType === 'drc') {
    const date = safeParseDateValue(frontmatter.date);
    identity = date ? dateKey(date) : undefined;
  } else if (reviewType === 'weekly-review') {
    const period = readWeeklyPeriod(frontmatter, filePath);
    identity = period
      ? periodKey(period.year, period.month, period.week)
      : undefined;
  } else if (reviewType === 'monthly-review') {
    const period = readMonthlyPeriod(frontmatter, filePath);
    identity = period ? periodKey(period.year, period.month) : undefined;
  } else if (reviewType === 'quarterly-review') {
    const period = readQuarterlyPeriod(frontmatter, filePath);
    identity = period ? periodKey(period.year, period.quarter) : undefined;
  } else {
    const year =
      readPositiveInteger(frontmatter.year) ?? readYearFromPath(filePath);
    identity = year ? periodKey(year) : undefined;
  }
  return JSON.stringify([reviewType, filePath, identity ?? null]);
}
