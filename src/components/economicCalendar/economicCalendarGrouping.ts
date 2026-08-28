

import type { EconomicCalendarEvent } from '../../services/economicCalendar/types';
import { formatLocalDateString } from '../../utils/dateUtils';

interface EconomicCalendarDayGroup {
  
  key: string;
  
  date: Date;
  events: EconomicCalendarEvent[];
}


export function economicCalendarDayKey(event: EconomicCalendarEvent): string {
  const date = new Date(event.scheduledAt);
  return event.eventType === 'holiday'
    ? date.toISOString().slice(0, 10)
    : formatLocalDateString(date);
}

function localMidnightFromDayKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}


function sortValue(event: EconomicCalendarEvent): number {
  return event.eventType === 'holiday'
    ? localMidnightFromDayKey(economicCalendarDayKey(event)).getTime()
    : new Date(event.scheduledAt).getTime();
}


export function groupEventsByDay(
  events: readonly EconomicCalendarEvent[]
): EconomicCalendarDayGroup[] {
  const groups = new Map<string, EconomicCalendarDayGroup>();

  const sorted = [...events].sort(
    (first, second) => sortValue(first) - sortValue(second)
  );

  for (const event of sorted) {
    const key = economicCalendarDayKey(event);
    const group = groups.get(key);

    if (group) {
      group.events.push(event);
    } else {
      groups.set(key, {
        key,
        date: localMidnightFromDayKey(key),
        events: [event],
      });
    }
  }

  
  
  return [...groups.values()].sort((first, second) =>
    first.key.localeCompare(second.key)
  );
}
