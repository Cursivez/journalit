import { parseLocalDateSafe } from './dateUtils';

export function resolveYearlyReviewYear(
  frontmatter: Record<string, unknown>,
  fallbackYear: number
): number {
  const explicitYear = frontmatter.year;
  if (typeof explicitYear === 'number' && Number.isInteger(explicitYear)) {
    return explicitYear;
  }

  const date = frontmatter.date;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return fallbackYear;
  }

  return parseLocalDateSafe(date)?.getFullYear() ?? fallbackYear;
}
