

import type JournalitPlugin from '../main';


export function formatTimeOfDay(date: Date, use24HourTime: boolean): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (use24HourTime) {
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${period}`;
}


export function getUse24HourTimeSetting(plugin: JournalitPlugin): boolean {
  return plugin.settings?.trade?.use24HourTime === true;
}


export function formatIsoTimeOfDay(
  isoTimestamp: string | undefined,
  use24HourTime: boolean
): string | null {
  if (typeof isoTimestamp !== 'string' || isoTimestamp.length === 0) {
    return null;
  }

  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return null;

  return formatTimeOfDay(date, use24HourTime);
}
