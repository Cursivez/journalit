

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FilterState } from '../DashboardView';
import {
  getActiveLayout,
  saveLayout,
  LAYOUT_BOTTOM_POSITION,
} from '../utils/layoutUtils';
import {
  createDashboardFilters,
  normalizeDashboardFilters,
} from '../../../settings/viewFiltersDefaults';
import { applyAllCalendarFixes } from '../utils/calendarStyles';
import { usePlugin, useEventBus } from '../../../hooks';
import {
  AVAILABLE_WIDGETS,
  normalizeDashboardWidgetIds,
} from '../components/BottomSection/types';
import { AccountChangedPayload } from '../../../services/events/types';
import { remapAccountFilterFromAccountChange } from '../../shared/filters/remapSelectedAccounts';
import { persistViewFilter } from '../../shared/filters/viewFilterPersistence';

export const useDashboard = () => {
  const plugin = usePlugin();

  
  const [filters, setFilters] = useState<FilterState>(() =>
    createDashboardFilters()
  );

  
  const hydratedRef = useRef(false);

  
  useEffect(() => {
    if (plugin && !hydratedRef.current) {
      const persisted = plugin.uiStateManager.getState().viewFilters?.dashboard;
      if (persisted) {
        const normalizedPersisted = normalizeDashboardFilters(persisted);
        setFilters({
          ...normalizedPersisted,
          
          dateRange: [
            persisted.dateRange[0] ? new Date(persisted.dateRange[0]) : null,
            persisted.dateRange[1] ? new Date(persisted.dateRange[1]) : null,
          ],
        });
      }
      hydratedRef.current = true;
    }
  }, [plugin]);

  
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
      setFilters((previousFilters) => {
        const remappedFilters = remapAccountFilterFromAccountChange(
          previousFilters,
          payload
        );

        if (remappedFilters === previousFilters) {
          return previousFilters;
        }

        const nextFilters = normalizeDashboardFilters(remappedFilters);

        if (plugin) {
          persistViewFilter(plugin.uiStateManager, 'dashboard', nextFilters);
        }

        return nextFilters;
      });
    },
    [plugin]
  );

  
  useEventBus('account:changed', handleAccountChanged);

  
  useEventBus('widgets:changed', handleWidgetsChanged);

  
  const activeLayout = useMemo(() => {
    return plugin ? getActiveLayout(plugin) : null;
  }, [plugin]);

  
  useEffect(() => {
    
    if (!document.querySelector('[data-dashboard-styles="true"]')) {
      
      document.documentElement.setAttribute('data-dashboard-styles', 'true');
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

          
          requestAnimationFrame(() => {
            applyAllCalendarFixes();
          });
        }
      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
      }
    };

    initializeDashboard();
  }, [plugin, activeLayout]);

  
  useEventBus('metrics:changed', handleMetricsChanged);

  
  useEffect(() => {
    
    if (plugin?.settings?.trade?.skipWeekends !== undefined) {
      requestAnimationFrame(() => {
        applyAllCalendarFixes();
      });
    }
  }, [plugin?.settings?.trade?.skipWeekends]);

  
  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      const normalizedFilters = normalizeDashboardFilters(newFilters);
      setFilters(normalizedFilters);

      
      if (plugin) {
        persistViewFilter(
          plugin.uiStateManager,
          'dashboard',
          normalizedFilters
        );
      }
    },
    [plugin]
  );

  
  const toggleEditMode = useCallback(() => {
    setIsEditing((prev) => {
      const newValue = !prev;
      if (newValue === false && showUnifiedSelector) {
        setShowUnifiedSelector(false);
      }
      return newValue;
    });
  }, [showUnifiedSelector]);

  
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

  
  const handleAddMetric = useCallback(
    (metricId: string) => {
      try {
        
        if (!activeMetrics.includes(metricId)) {
          
          setActiveMetrics((prev) => [...prev, metricId]);

          
          if (plugin && activeLayout) {
            const newLayout = {
              ...activeLayout,
              topSection: [...activeMetrics, metricId],
            };

            
            saveLayout(plugin, 'Default', newLayout).catch((err: Error) => {
              console.error('Error saving layout after adding metric:', err);
            });
          }
        }
      } catch (error) {
        console.error('Error in handleAddMetric:', error);
      }
    },
    [activeMetrics, plugin, activeLayout]
  );

  
  const createValidLayoutItem = useMemo(() => {
    const cols: Record<string, number> = {
      lg: 12,
      md: 6,
      sm: 4,
      xs: 2,
      xxs: 1,
    };

    return (widgetId: string, bp: string, widgetDef: any) => {
      const maxCols = cols[bp];
      const scaledWidth = Math.min(widgetDef.defaultSize.w, maxCols);

      return {
        i: widgetId,
        x: 0,
        y: LAYOUT_BOTTOM_POSITION, 
        w: scaledWidth,
        h: widgetDef.defaultSize.h,
      };
    };
  }, []);

  
  const handleAddWidget = useCallback(
    (widgetId: string) => {
      if (!plugin || !activeLayout || activeWidgets.includes(widgetId)) {
        return;
      }

      try {
        
        const widgetDef = AVAILABLE_WIDGETS.find((w) => w.id === widgetId);

        if (!widgetDef) {
          console.warn(`Widget definition not found: ${widgetId}`);
          return;
        }

        
        const breakpoints = ['lg', 'md', 'sm', 'xs', 'xxs'] as const;
        const layoutItems = breakpoints.reduce(
          (acc, bp) => {
            acc[bp] = createValidLayoutItem(widgetId, bp, widgetDef);
            return acc;
          },
          {} as Record<string, any>
        );

        
        const newLayout = {
          ...activeLayout,
          bottomSection: {
            lg: [...activeLayout.bottomSection.lg, layoutItems.lg],
            md: [...activeLayout.bottomSection.md, layoutItems.md],
            sm: [...activeLayout.bottomSection.sm, layoutItems.sm],
            xs: [...(activeLayout.bottomSection.xs || []), layoutItems.xs],
            xxs: [...(activeLayout.bottomSection.xxs || []), layoutItems.xxs],
          },
        };

        
        saveLayout(plugin, 'Default', newLayout);

        
        setActiveWidgets((prev) => [...prev, widgetId]);
      } catch (error) {
        console.error('Error adding widget:', error);
      }
    },
    [activeWidgets, plugin, activeLayout, createValidLayoutItem]
  );

  return {
    filters,
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
    handleAddMetric,
    handleAddWidget,
  };
};
