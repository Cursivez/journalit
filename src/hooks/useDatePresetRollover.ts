import { getWeekStartDaySetting } from '../utils/dateUtils';
import { type DatePresetSelection, rollDatePreset } from '../utils/datePresets';
import { useCalendarToday } from './useCalendarToday';

interface DatedFilters {
  dateRange: [Date | null, Date | null];
  datePreset?: DatePresetSelection;
}


export function useDatePresetRollover<T extends DatedFilters>(
  filters: T,
  apply: (next: T) => void
): void {
  useCalendarToday(() => {
    const next = rollDatePreset(filters, getWeekStartDaySetting(), new Date());
    if (next !== filters) apply(next);
  });
}
