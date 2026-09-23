import { formatDateDisplay } from '../../utils/dateUtils';
import { formatTimeOfDay } from '../../utils/timeFormat';

export function formatTradeImportPreviewDate(
  dateValue: string | null | undefined,
  dateFormat: string
): string {
  return dateValue ? formatDateDisplay(dateValue, dateFormat) : '—';
}

export function formatTradeImportPreviewDateTime(
  dateValue: string | null | undefined,
  dateFormat: string,
  use24HourTime: boolean
): string {
  if (!dateValue) return '—';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return formatDateDisplay(dateValue, dateFormat);
  }

  return `${formatDateDisplay(date, dateFormat)} ${formatTimeOfDay(date, use24HourTime)}`;
}
