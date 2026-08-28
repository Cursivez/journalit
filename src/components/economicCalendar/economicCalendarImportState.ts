

import {
  importedEventIdentityFromCalendar,
  isImportedKeyEventMatch,
} from '../../services/economicCalendar/EconomicCalendarService';
import type { EconomicCalendarEvent } from '../../services/economicCalendar/types';
import type { NewsEvent } from '../../services/weekly/types';

export type EconomicCalendarImportState =
  | 'not-imported'
  | 'imported'
  | 'update-available';


function isSameInstant(stored: string | undefined, incoming: string): boolean {
  if (stored === incoming) return true;
  if (stored === undefined) return false;
  return Date.parse(stored) === Date.parse(incoming);
}

function hasNewerData(
  existing: NewsEvent,
  event: EconomicCalendarEvent
): boolean {
  if (!isSameInstant(existing.time, event.scheduledAt)) return true;
  if (existing.currency !== event.currency) return true;
  if (existing.impact !== event.impact) return true;
  
  
  if ((existing.eventType === 'holiday') !== (event.eventType === 'holiday')) {
    return true;
  }
  if (event.forecast !== undefined && existing.forecast !== event.forecast) {
    return true;
  }
  if (event.actual !== undefined && existing.actual !== event.actual) {
    return true;
  }
  if (event.previous !== undefined && existing.previous !== event.previous) {
    return true;
  }
  return false;
}


export function deriveEconomicCalendarImportState(
  event: EconomicCalendarEvent,
  existingKeyEvents: readonly NewsEvent[]
): EconomicCalendarImportState {
  const incoming = importedEventIdentityFromCalendar(event);
  for (const existing of existingKeyEvents) {
    if (!isImportedKeyEventMatch(existing, incoming)) continue;
    return hasNewerData(existing, event) ? 'update-available' : 'imported';
  }
  return 'not-imported';
}
