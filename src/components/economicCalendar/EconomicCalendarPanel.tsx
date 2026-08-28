

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import {
  ECONOMIC_CALENDAR_IMPACTS_DISPLAY_ORDER,
  SETTINGS_TAB_IDS,
} from '../../settings/types';
import {
  ECONOMIC_CALENDAR_CURRENCIES,
  resolveEconomicCalendarSyncScope,
} from '../../services/economicCalendar/economicCalendarScope';
import { countMissingConfiguredEvents } from '../../services/economicCalendar/EconomicCalendarService';
import {
  resolveEconomicCalendarViewFilters,
  saveEconomicCalendarViewFilters,
  type EconomicCalendarFilterState,
} from './economicCalendarViewFilters';
import type { EconomicCalendarEvent } from '../../services/economicCalendar/types';
import type { SettingsChangedPayload } from '../../services/events/types';
import type { NewsEvent, NewsEventImpact } from '../../services/weekly/types';
import { t, tPlural, type TranslationKey } from '../../lang/helpers';
import {
  formatDateDisplay,
  formatLocalDateString,
  formatWeekdayLong,
  getUserDateFormat,
} from '../../utils/dateUtils';
import { getKeyEventDayLabel } from '../../utils/keyEvents';
import { getUse24HourTimeSetting } from '../../utils/timeFormat';
import { EconomicCalendarColumnHeader } from './EconomicCalendarColumnHeader';
import { EconomicCalendarEventRow } from './EconomicCalendarEventRow';
import { EconomicCalendarFilters } from './EconomicCalendarFilters';
import {
  EconomicCalendarEmpty,
  EconomicCalendarError,
  EconomicCalendarLoading,
  EconomicCalendarProGate,
} from './EconomicCalendarStates';
import {
  economicCalendarDayKey,
  groupEventsByDay,
} from './economicCalendarGrouping';
import { deriveEconomicCalendarImportState } from './economicCalendarImportState';
import { EconomicCalendarHeader } from './EconomicCalendarHeader';
import { useEconomicCalendarWeek } from './useEconomicCalendarWeek';
import { Import } from '../shared/icons/ObsidianIcon';
import { useGuideTarget } from '../../guides/GuideRuntimeLayer';
import {
  ECONOMIC_CALENDAR_MANUAL_IMPORT_TARGET_ID,
  ECONOMIC_CALENDAR_RESTORE_TARGET_ID,
} from '../../guides/economicCalendarGuideIds';
import { useEventBus } from '../../hooks/useEventBus';

const ERROR_MESSAGE_KEYS: Record<'offline' | 'error', TranslationKey> = {
  offline: 'view.economic-calendar.error.offline',
  error: 'view.economic-calendar.error.generic',
};

interface EconomicCalendarPanelProps {
  plugin: JournalitPlugin;
}

interface SelectionState {
  ids: ReadonlySet<number>;
  isImporting: boolean;
}

type SelectionAction =
  | { type: 'toggle'; id: number }
  | { type: 'toggle-all'; ids: readonly number[] }
  | { type: 'remove'; ids: ReadonlySet<number> }
  | { type: 'clear' }
  | { type: 'reset' }
  | { type: 'set-importing'; value: boolean };

function selectionReducer(
  state: SelectionState,
  action: SelectionAction
): SelectionState {
  switch (action.type) {
    case 'toggle':
      return { ...state, ids: toggleSetValue(state.ids, action.id) };
    case 'toggle-all': {
      const allSelected = action.ids.every((id) => state.ids.has(id));
      const next = new Set(state.ids);
      for (const id of action.ids) {
        if (allSelected) next.delete(id);
        else next.add(id);
      }
      return { ...state, ids: next };
    }
    case 'remove': {
      const next = new Set([...state.ids].filter((id) => !action.ids.has(id)));
      return next.size === state.ids.size ? state : { ...state, ids: next };
    }
    case 'clear':
      return { ...state, ids: new Set() };
    case 'reset':
      return { ids: new Set(), isImporting: false };
    case 'set-importing':
      return { ...state, isImporting: action.value };
  }
}
function toggleSetValue<T>(current: ReadonlySet<T>, value: T): ReadonlySet<T> {
  const next = new Set(current);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

function collectPastEventIds(
  events: readonly EconomicCalendarEvent[],
  referenceTime: number
): Set<number> {
  const pastIds = new Set<number>();
  const referenceDayKey = formatLocalDateString(new Date(referenceTime));

  for (const event of events) {
    
    
    const isPast =
      event.eventType === 'holiday'
        ? economicCalendarDayKey(event) < referenceDayKey
        : new Date(event.scheduledAt).getTime() < referenceTime;
    if (isPast) {
      pastIds.add(event.id);
    }
  }
  return pastIds;
}

export const EconomicCalendarPanel: React.FC<EconomicCalendarPanelProps> = ({
  plugin,
}) => {
  const [selection, dispatchSelection] = useReducer(selectionReducer, {
    ids: new Set<number>(),
    isImporting: false,
  });
  const eventsRef = useRef<readonly EconomicCalendarEvent[]>([]);
  const handleKeyEventsChanged = useCallback(
    (weekEvents: NewsEvent[]): void => {
      const importedIds = new Set<number>();
      for (const event of eventsRef.current) {
        if (
          deriveEconomicCalendarImportState(event, weekEvents) === 'imported'
        ) {
          importedIds.add(event.id);
        }
      }
      dispatchSelection({ type: 'remove', ids: importedIds });
    },
    []
  );
  const {
    status,
    events,
    fetchedAt,
    weekDate,
    keyEvents,
    refresh,
    refreshKeyEvents,
  } = useEconomicCalendarWeek(plugin, handleKeyEventsChanged);
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);
  const [isRestoringConfiguredEvents, setIsRestoringConfiguredEvents] =
    useState(false);
  const [configuredScope, setConfiguredScope] = useState(() =>
    resolveEconomicCalendarSyncScope(plugin.settings.economicCalendar)
  );
  
  const [filters, setFilters] = useState<EconomicCalendarFilterState>(() =>
    resolveEconomicCalendarViewFilters(
      plugin.settings.economicCalendar,
      plugin.uiStateManager.getState().economicCalendar?.viewFilters
    )
  );
  
  const filtersRef = useRef(filters);
  const isMountedRef = useRef(false);
  const { ids: selectedIds, isImporting } = selection;
  const { currencies: selectedCurrencies, impacts: selectedImpacts } = filters;
  const registerManualImportTarget = useGuideTarget(
    ECONOMIC_CALENDAR_MANUAL_IMPORT_TARGET_ID
  );
  const registerRestoreTarget = useGuideTarget(
    ECONOMIC_CALENDAR_RESTORE_TARGET_ID
  );

  const use24HourTime = getUse24HourTimeSetting(plugin);

  const openSettings = useCallback((): void => {
    plugin.openSettingsToTab(SETTINGS_TAB_IDS.ECONOMIC_CALENDAR);
  }, [plugin]);

  const handleSettingsChanged = useCallback(
    (payload: SettingsChangedPayload): void => {
      if (payload.section && payload.section !== 'economicCalendar') return;
      setConfiguredScope(
        resolveEconomicCalendarSyncScope(plugin.settings.economicCalendar)
      );
    },
    [plugin]
  );

  useEventBus('settings:changed', handleSettingsChanged);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  
  const loadWeek = useCallback(async (): Promise<void> => {
    const loadedStatus = await refresh();
    if (loadedStatus === 'ok' && isMountedRef.current) {
      dispatchSelection({ type: 'reset' });
    }
  }, [refresh]);

  
  
  
  const visibleEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          selectedCurrencies.has(event.currency) &&
          (event.eventType === 'holiday' || selectedImpacts.has(event.impact))
      ),
    [events, selectedCurrencies, selectedImpacts]
  );

  const importStates = useMemo(() => {
    const states = new Map<
      number,
      ReturnType<typeof deriveEconomicCalendarImportState>
    >();
    for (const event of events) {
      states.set(event.id, deriveEconomicCalendarImportState(event, keyEvents));
    }
    return states;
  }, [events, keyEvents]);

  const missingConfiguredCount = useMemo(
    () => countMissingConfiguredEvents(events, keyEvents, configuredScope),
    [configuredScope, events, keyEvents]
  );

  const selectableVisibleIds = useMemo(() => {
    const ids: number[] = [];
    for (const event of visibleEvents) {
      if (importStates.get(event.id) !== 'imported') ids.push(event.id);
    }
    return ids;
  }, [importStates, visibleEvents]);

  const selectedVisibleEvents = useMemo(() => {
    const selectableIds = new Set(selectableVisibleIds);
    return visibleEvents.filter(
      (event) => selectableIds.has(event.id) && selectedIds.has(event.id)
    );
  }, [selectableVisibleIds, selectedIds, visibleEvents]);
  const selectedVisibleIds = useMemo(
    () => selectedVisibleEvents.map((event) => event.id),
    [selectedVisibleEvents]
  );

  const allVisibleSelected =
    selectableVisibleIds.length > 0 &&
    selectableVisibleIds.every((id) => selectedIds.has(id));

  const pastEventIds = useMemo(
    () => collectPastEventIds(visibleEvents, fetchedAt),
    [fetchedAt, visibleEvents]
  );

  const dayGroups = useMemo(
    () => groupEventsByDay(visibleEvents),
    [visibleEvents]
  );

  const handleToggleSelected = useCallback((eventId: number): void => {
    dispatchSelection({ type: 'toggle', id: eventId });
  }, []);

  const handleToggleSelectAll = useCallback((): void => {
    if (selectableVisibleIds.length === 0) return;
    dispatchSelection({ type: 'toggle-all', ids: selectableVisibleIds });
  }, [selectableVisibleIds]);

  
  
  
  
  const applyFilters = useCallback(
    (
      update: (
        current: EconomicCalendarFilterState
      ) => EconomicCalendarFilterState
    ): void => {
      const next = update(filtersRef.current);
      filtersRef.current = next;
      setFilters(next);
      void saveEconomicCalendarViewFilters(plugin, next).catch((error) => {
        console.error('[EconomicCalendar] Failed to save view filters:', error);
      });
    },
    [plugin]
  );

  const handleToggleCurrency = useCallback(
    (currency: string): void => {
      applyFilters((current) => ({
        currencies: toggleSetValue(current.currencies, currency),
        impacts: current.impacts,
      }));
    },
    [applyFilters]
  );

  const handleToggleImpact = useCallback(
    (impact: NewsEventImpact): void => {
      applyFilters((current) => ({
        currencies: current.currencies,
        impacts: toggleSetValue(current.impacts, impact),
      }));
    },
    [applyFilters]
  );

  const handleImport = useCallback(async (): Promise<void> => {
    const eventsToImport = selectedVisibleEvents;
    if (eventsToImport.length === 0) return;

    dispatchSelection({ type: 'set-importing', value: true });
    try {
      const service = await plugin.serviceManager.getEconomicCalendarService();
      const result = await service.importEvents(eventsToImport, { weekDate });
      new Notice(
        t('view.economic-calendar.import-success', {
          imported: String(result.importedCount),
          updated: String(result.updatedCount),
        })
      );
      if (isMountedRef.current) {
        const importedIds = new Set(eventsToImport.map((event) => event.id));
        dispatchSelection({ type: 'remove', ids: importedIds });
      }
      await refreshKeyEvents();
    } catch (error) {
      console.error('[EconomicCalendar] Failed to import events:', error);
      new Notice(t('view.economic-calendar.import-failed'));
    } finally {
      if (isMountedRef.current) {
        dispatchSelection({ type: 'set-importing', value: false });
      }
    }
  }, [plugin, refreshKeyEvents, selectedVisibleEvents, weekDate]);

  const handleRestoreConfiguredEvents = useCallback(async (): Promise<void> => {
    if (missingConfiguredCount === 0 || isRestoringConfiguredEvents) return;

    setIsRestoringConfiguredEvents(true);
    try {
      const service = await plugin.serviceManager.getEconomicCalendarService();
      const result = await service.restoreConfiguredEventsForWeek(weekDate);
      if (result.status !== 'ok') {
        new Notice(t('view.economic-calendar.import-failed'));
        return;
      }
      new Notice(
        t('view.economic-calendar.import-success', {
          imported: String(result.importedCount),
          updated: String(result.updatedCount),
        })
      );
      await refreshKeyEvents();
    } catch (error) {
      console.error(
        '[EconomicCalendar] Failed to restore configured events:',
        error
      );
      new Notice(t('view.economic-calendar.import-failed'));
    } finally {
      if (isMountedRef.current) setIsRestoringConfiguredEvents(false);
    }
  }, [
    isRestoringConfiguredEvents,
    missingConfiguredCount,
    plugin,
    refreshKeyEvents,
    weekDate,
  ]);

  return (
    <div className="journalit-econ-calendar">
      <EconomicCalendarHeader
        refreshDisabled={status === 'loading'}
        onRefresh={() => void loadWeek()}
        onOpenSettings={openSettings}
      />

      {status === 'loading' && <EconomicCalendarLoading />}
      {status === 'not_entitled' && <EconomicCalendarProGate />}
      {(status === 'offline' || status === 'error') && (
        <EconomicCalendarError
          messageKey={ERROR_MESSAGE_KEYS[status]}
          onRetry={() => void loadWeek()}
        />
      )}

      {status === 'ok' && (
        <>
          <EconomicCalendarFilters
            currencies={ECONOMIC_CALENDAR_CURRENCIES}
            selectedCurrencies={selectedCurrencies}
            onToggleCurrency={handleToggleCurrency}
            impacts={ECONOMIC_CALENDAR_IMPACTS_DISPLAY_ORDER}
            selectedImpacts={selectedImpacts}
            onToggleImpact={handleToggleImpact}
            selectAllChecked={allVisibleSelected}
            selectAllDisabled={selectableVisibleIds.length === 0}
            onToggleSelectAll={handleToggleSelectAll}
          />

          {dayGroups.length === 0 ? (
            <EconomicCalendarEmpty />
          ) : (
            <div className="journalit-econ-list">
              <EconomicCalendarColumnHeader />
              {dayGroups.map((group) => (
                <section key={group.key} className="journalit-econ-day">
                  <h2 className="journalit-econ-day__label">
                    <span className="journalit-econ-day__weekday">
                      {getKeyEventDayLabel(formatWeekdayLong(group.date))}
                    </span>
                    <span className="journalit-econ-day__date">
                      {formatDateDisplay(group.date, getUserDateFormat())}
                    </span>
                  </h2>
                  {group.events.map((event) => (
                    <EconomicCalendarEventRow
                      key={event.id}
                      event={event}
                      importState={importStates.get(event.id) ?? 'not-imported'}
                      selected={selectedIds.has(event.id)}
                      isPast={pastEventIds.has(event.id)}
                      use24HourTime={use24HourTime}
                      onToggleSelected={handleToggleSelected}
                    />
                  ))}
                </section>
              ))}
            </div>
          )}

          <div className="journalit-econ-footer">
            <button
              ref={registerRestoreTarget}
              type="button"
              className="journalit-econ-footer__restore"
              onClick={() => void handleRestoreConfiguredEvents()}
              disabled={
                missingConfiguredCount === 0 ||
                isRestoringConfiguredEvents ||
                isImporting
              }
            >
              <Import size={13} aria-hidden="true" />
              {t('view.economic-calendar.restore-missing-events', {
                count: String(missingConfiguredCount),
              })}
            </button>
            <button
              ref={registerManualImportTarget}
              type="button"
              className="journalit-econ-footer__import"
              onClick={() => void handleImport()}
              disabled={
                selectedVisibleIds.length === 0 ||
                isImporting ||
                isRestoringConfiguredEvents
              }
            >
              {tPlural(
                'view.economic-calendar.import-count',
                selectedVisibleIds.length
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

EconomicCalendarPanel.displayName = 'EconomicCalendarPanel';
