

import type JournalitPlugin from '../../main';
import {
  ECONOMIC_CALENDAR_IMPACTS,
  ECONOMIC_CALENDAR_IMPACTS_DISPLAY_ORDER,
  type EconomicCalendarSettings,
  type EconomicCalendarViewFilters,
} from '../../settings/types';
import {
  ECONOMIC_CALENDAR_CURRENCIES,
  normalizeEconomicCalendarViewFilters,
  resolveEconomicCalendarSyncScope,
} from '../../services/economicCalendar/economicCalendarScope';
import type { NewsEventImpact } from '../../services/weekly/types';

export interface EconomicCalendarFilterState {
  currencies: ReadonlySet<string>;
  impacts: ReadonlySet<NewsEventImpact>;
}


export function resolveEconomicCalendarViewFilters(
  settings: EconomicCalendarSettings | undefined,
  savedViewFilters?: EconomicCalendarViewFilters
): EconomicCalendarFilterState {
  const saved = normalizeEconomicCalendarViewFilters(savedViewFilters);
  if (saved) {
    return {
      currencies: new Set(saved.currencies),
      impacts: new Set<NewsEventImpact>(saved.impacts),
    };
  }

  const scope = resolveEconomicCalendarSyncScope(settings);
  const currencies = ECONOMIC_CALENDAR_CURRENCIES.filter((currency) =>
    scope.currencies.includes(currency)
  );
  const impacts = ECONOMIC_CALENDAR_IMPACTS_DISPLAY_ORDER.filter((impact) =>
    scope.impacts.includes(impact)
  );

  return {
    currencies: new Set<string>(
      currencies.length > 0 ? currencies : ECONOMIC_CALENDAR_CURRENCIES
    ),
    impacts: new Set<NewsEventImpact>(
      impacts.length > 0 ? impacts : ECONOMIC_CALENDAR_IMPACTS_DISPLAY_ORDER
    ),
  };
}


export async function saveEconomicCalendarViewFilters(
  plugin: JournalitPlugin,
  filters: EconomicCalendarFilterState
): Promise<void> {
  const current = plugin.uiStateManager.getState().economicCalendar ?? {};
  await plugin.uiStateManager.updateState({
    economicCalendar: {
      ...current,
      viewFilters: {
        currencies: ECONOMIC_CALENDAR_CURRENCIES.filter((currency) =>
          filters.currencies.has(currency)
        ),
        impacts: ECONOMIC_CALENDAR_IMPACTS.filter((impact) =>
          filters.impacts.has(impact)
        ),
      },
    },
  });
}
