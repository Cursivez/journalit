

import {
  DEFAULT_ECONOMIC_CALENDAR_SETTINGS,
  ECONOMIC_CALENDAR_IMPACTS,
  type EconomicCalendarSettings,
  type EconomicCalendarViewFilters,
} from '../../settings/types';
import type { NewsEventImpact } from '../weekly/types';
import type { EconomicCalendarEventType } from './types';


export const ECONOMIC_CALENDAR_CURRENCIES = [
  'AUD',
  'CAD',
  'CHF',
  'EUR',
  'GBP',
  'JPY',
  'NZD',
  'USD',
] as const;


type EconomicCalendarCurrency = (typeof ECONOMIC_CALENDAR_CURRENCIES)[number];

export function isEconomicCalendarCurrency(
  value: string
): value is EconomicCalendarCurrency {
  for (const currency of ECONOMIC_CALENDAR_CURRENCIES) {
    if (currency === value) return true;
  }
  return false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function normalizeEconomicCalendarViewFilters(
  value: unknown
): EconomicCalendarViewFilters | undefined {
  if (!isRecord(value)) return undefined;
  if (!Array.isArray(value.currencies) || !Array.isArray(value.impacts)) {
    return undefined;
  }

  const currencies: string[] = [];
  const seenCurrencies = new Set<string>();
  for (const item of value.currencies) {
    if (
      typeof item === 'string' &&
      isEconomicCalendarCurrency(item) &&
      !seenCurrencies.has(item)
    ) {
      seenCurrencies.add(item);
      currencies.push(item);
    }
  }

  const savedImpacts = new Set<unknown>(value.impacts);
  const impacts = ECONOMIC_CALENDAR_IMPACTS.filter((impact) =>
    savedImpacts.has(impact)
  );

  return { currencies, impacts };
}

export interface EconomicCalendarSyncScope {
  
  currencies: readonly string[];
  
  impacts: readonly NewsEventImpact[];
  
  includeHolidays: boolean;
}

export function resolveEconomicCalendarSyncScope(
  settings: EconomicCalendarSettings | undefined
): EconomicCalendarSyncScope {
  const resolved = settings ?? DEFAULT_ECONOMIC_CALENDAR_SETTINGS;
  return {
    currencies: resolved.defaultCurrencies,
    impacts: resolved.impacts,
    includeHolidays: resolved.includeHolidays,
  };
}


export function isEventInSyncScope(
  event: {
    currency: string;
    impact: NewsEventImpact;
    eventType: EconomicCalendarEventType;
  },
  scope: EconomicCalendarSyncScope
): boolean {
  if (
    scope.currencies.length > 0 &&
    !scope.currencies.includes(event.currency)
  ) {
    return false;
  }

  if (event.eventType === 'holiday') return scope.includeHolidays;
  return scope.impacts.includes(event.impact);
}
