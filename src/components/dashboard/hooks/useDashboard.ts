

import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { FilterState } from '../DashboardView';
import { getActiveLayout } from '../utils/layoutUtils';
import {
  createDashboardFilters,
  normalizeDashboardFilters,
} from '../../../settings/viewFiltersDefaults';
import { applyAllCalendarFixes } from '../utils/calendarStyles';
import { usePlugin } from '../../../hooks/usePlugin';
import { useEventBus } from '../../../hooks/useEventBus';
import { normalizeDashboardWidgetIds } from '../components/BottomSection/types';
import { AccountChangedPayload } from '../../../services/events/types';
import { remapAccountFilterFromAccountChange } from '../../shared/filters/remapSelectedAccounts';
import { persistViewFilter } from '../../shared/filters/viewFilterPersistence';
import {
  readPersistedDashboardCompare,
  readPersistedDashboardFilters,
} from '../dashboardViewState';
import {
  type DashboardComparisonFilters,
  normalizeComparisonFilters,
  toComparisonFilters,
  withSharedDateRange,
} from '../compare/dashboardComparison';
import { useDatePresetRollover } from '../../../hooks/useDatePresetRollover';

export const useDashboard = () => {
  const plugin = usePlugin();

  
  const [filters, setFilters] = useState<FilterState>(() =>
    createDashboardFilters()
  );
  const filtersRef = useRef(filters);
  const applyFilters = useCallback((nextFilters: FilterState) => {
    filtersRef.current = nextFilters;
    setFilters(nextFilters);
  }, []);

  const [isFiltersHydrated, setIsFiltersHydrated] = useState(false);

  
  const [compareFilters, setCompareFilters] =
    useState<DashboardComparisonFilters | null>(null);
  const compareFiltersRef = useRef(compareFilters);
  const applyCompareFilters = useCallback(
    (next: DashboardComparisonFilters | null) => {
      compareFiltersRef.current = next;
      setCompareFilters(next);
      
      void plugin?.uiStateManager.updateState({
        dashboardCompare: next ?? undefined,
      });
    },
    [plugin]
  );

  
  
  useLayoutEffect(() => {
    if (!plugin || isFiltersHydrated) return;

    const uiState = plugin.uiStateManager.getState();
    const persisted = readPersistedDashboardFilters(uiState);
    if (persisted) applyFilters(persisted);
    const persistedCompare = readPersistedDashboardCompare(uiState);
    if (persistedCompare) {
      compareFiltersRef.current = persistedCompare;
      setCompareFilters(persistedCompare);
    }
    setIsFiltersHydrated(true);
  }, [applyFilters, isFiltersHydrated, plugin]);

  
  useEventBus('dashboard:view-requested', () => {
    if (!plugin) return;
    const uiState = plugin.uiStateManager.getState();
    applyFilters(
      readPersistedDashboardFilters(uiState) ?? createDashboardFilters()
    );
    const persistedCompare = readPersistedDashboardCompare(uiState);
    compareFiltersRef.current = persistedCompare;
    setCompareFilters(persistedCompare);
  });

  
  const [isEditing, setIsEditing] = useState<boolean>(false);

  
  const [showUnifiedSelector, setShowUnifiedSelector] =
    useState<boolean>(false);

  
  const [activeMetrics, setActiveMetrics] = useState<string[]>([]);
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);

  
  const handleWidgetsChanged = useCallback(
    (payload: { activeWidgets: string[] }) => {
      setActiveWidgets(payload.activeWidgets);
    },
    []
  );

  const handleMetricsChanged = useCallback(
    (payload: { activeMetrics: string[] }) => {
      setActiveMetrics(payload.activeMetrics);
    },
    []
  );

  const handleAccountChanged = useCallback(
    (payload: AccountChangedPayload) => {
      const currentFilters = filtersRef.current;
      const remappedFilters = remapAccountFilterFromAccountChange(
        currentFilters,
        payload
      );

      
      const currentCompare = compareFiltersRef.current;
      if (currentCompare) {
        const compareState = withSharedDateRange(
          currentCompare,
          currentFilters
        );
        const remappedCompare = remapAccountFilterFromAccountChange(
          compareState,
          payload
        );
        if (remappedCompare !== compareState) {
          applyCompareFilters(
            toComparisonFilters(normalizeDashboardFilters(remappedCompare))
          );
        }
      }

      if (remappedFilters === currentFilters) return;

      const nextFilters = normalizeDashboardFilters(remappedFilters);
      applyFilters(nextFilters);

      if (plugin) {
        persistViewFilter(plugin.uiStateManager, 'dashboard', nextFilters);
      }
    },
    [applyCompareFilters, applyFilters, plugin]
  );

  
  useEventBus('account:changed', handleAccountChanged);

  
  useEventBus('widgets:changed', handleWidgetsChanged);

  
  const activeLayout = useMemo(() => {
    return plugin ? getActiveLayout(plugin) : null;
  }, [plugin]);

  
  useEffect(() => {
    
    if (
      !window.activeDocument.querySelector('[data-dashboard-styles="true"]')
    ) {
      
      window.activeDocument.documentElement.setAttribute(
        'data-dashboard-styles',
        'true'
      );
    }

    
    const initializeDashboard = async () => {
      try {
        if (plugin && activeLayout) {
          
          setActiveMetrics(activeLayout.topSection);
          setActiveWidgets(
            normalizeDashboardWidgetIds(
              activeLayout.bottomSection.lg.map((item) => item.i)
            )
          );

          
          window.requestAnimationFrame(() => {
            applyAllCalendarFixes();
          });
        }
      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
      }
    };

    void initializeDashboard();
  }, [plugin, activeLayout]);

  
  useEventBus('metrics:changed', handleMetricsChanged);

  
  useEffect(() => {
    
    if (plugin?.settings?.trade?.skipWeekends !== undefined) {
      window.requestAnimationFrame(() => {
        applyAllCalendarFixes();
      });
    }
  }, [plugin?.settings?.trade?.skipWeekends]);

  
  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      const normalizedFilters = normalizeDashboardFilters(newFilters);
      applyFilters(normalizedFilters);

      
      if (plugin) {
        persistViewFilter(
          plugin.uiStateManager,
          'dashboard',
          normalizedFilters
        );
      }
    },
    [applyFilters, plugin]
  );

  
  useDatePresetRollover(filters, handleFilterChange);

  
  const handleCompareFilterChange = useCallback(
    (newFilters: FilterState) => {
      applyCompareFilters(
        toComparisonFilters(normalizeDashboardFilters(newFilters))
      );
    },
    [applyCompareFilters]
  );

  
  const startComparison = useCallback(
    (comparison?: {
      a: DashboardComparisonFilters;
      b: DashboardComparisonFilters;
    }) => {
      const current = filtersRef.current;
      if (comparison) {
        handleFilterChange(withSharedDateRange(comparison.a, current));
        applyCompareFilters(normalizeComparisonFilters(comparison.b));
        return;
      }
      applyCompareFilters(toComparisonFilters(current));
    },
    [applyCompareFilters, handleFilterChange]
  );

  const stopComparison = useCallback(() => {
    applyCompareFilters(null);
  }, [applyCompareFilters]);

  
  const compareFilterState = useMemo(
    () =>
      compareFilters ? withSharedDateRange(compareFilters, filters) : null,
    [compareFilters, filters]
  );

  
  const toggleEditMode = useCallback(() => {
    const nextIsEditing = !isEditing;
    if (!nextIsEditing && showUnifiedSelector) {
      setShowUnifiedSelector(false);
    }
    setIsEditing(nextIsEditing);
  }, [isEditing, showUnifiedSelector]);

  
  const openUnifiedSelector = useCallback(() => {
    setShowUnifiedSelector(true);
    
  }, []);

  
  const closeUnifiedSelector = useCallback(() => {
    setShowUnifiedSelector(false);
  }, []);

  const restoreGuideStepState = useCallback(
    async ({
      fromStepId,
      toStepId,
    }: {
      fromStepId: string;
      toStepId: string;
    }) => {
      if (toStepId === 'intro' || toStepId === 'filters') {
        setIsEditing(false);
        setShowUnifiedSelector(false);
        await new Promise((resolve) => window.setTimeout(resolve, 0));
        return;
      }

      if (toStepId === 'edit-layout') {
        setIsEditing(fromStepId !== 'open-widget-selector');
        setShowUnifiedSelector(false);
        await new Promise((resolve) => window.setTimeout(resolve, 0));
        return;
      }

      if (toStepId === 'widget-picker') {
        setIsEditing(true);
        setShowUnifiedSelector(false);
        await new Promise((resolve) => window.setTimeout(resolve, 0));
        return;
      }

      if (
        toStepId === 'open-widget-selector' ||
        toStepId === 'metrics-section' ||
        toStepId === 'bottom-section' ||
        toStepId === 'save-layout'
      ) {
        setIsEditing(true);
        setShowUnifiedSelector(false);
        await new Promise((resolve) => window.setTimeout(resolve, 0));
      }
    },
    []
  );

  return {
    filters,
    compareFilters: compareFilterState,
    handleCompareFilterChange,
    startComparison,
    stopComparison,
    isFiltersHydrated,
    setFilters,
    isLoading: false,
    isEditing,
    showUnifiedSelector,
    activeMetrics,
    activeWidgets,
    handleFilterChange,
    toggleEditMode,
    openUnifiedSelector,
    closeUnifiedSelector,
    restoreGuideStepState,
  };
};
