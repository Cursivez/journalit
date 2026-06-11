

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FilterState } from '../../DashboardView';
import {
  getActiveLayout,
  saveLayout,
  DashboardLayout,
} from '../../utils/layoutUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { GridLayout } from './GridLayout';
import { UnifiedComponentSelector } from '../UnifiedComponentSelector';
import { AVAILABLE_METRICS } from '../TopSection/types';
import { eventBus, useEventBus } from '../../../../services/events';
import { t } from '../../../../lang/helpers';
import { normalizeDashboardWidgetIds } from './types';

interface BottomSectionProps {
  filters: FilterState;
  isEditing: boolean;
  hideAddButton?: boolean;
}


export const BottomSection: React.FC<BottomSectionProps> = ({
  filters,
  isEditing,
  hideAddButton = false,
}) => {
  const plugin = usePlugin();
  const [showComponentSelector, setShowComponentSelector] =
    useState<boolean>(false);
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);

  
  const handleWidgetsChanged = useCallback(
    (payload: { activeWidgets: string[] }) => {
      setActiveWidgets(normalizeDashboardWidgetIds(payload.activeWidgets));
    },
    []
  );

  
  useEventBus('widgets:changed', handleWidgetsChanged);

  
  useEffect(() => {
    const initializeLayout = () => {
      try {
        if (plugin) {
          const activeLayout = getActiveLayout(plugin);
          
          const widgetIds = normalizeDashboardWidgetIds(
            activeLayout.bottomSection.lg.map((item) => item.i)
          );
          setActiveWidgets(widgetIds);
        }
      } catch (error) {
        console.error('Error initializing layout in BottomSection:', error);
        
        const defaultWidgets = [
          'pnlChart',
          'performanceCalendar',
          'dailyPerformance',
        ];
        setActiveWidgets(defaultWidgets);
      }
    };

    
    initializeLayout();
  }, [plugin]);

  
  const handleSettingsUpdated = useCallback(() => {
    if (plugin) {
      const layout = getActiveLayout(plugin);
      const widgetIds = normalizeDashboardWidgetIds(
        layout.bottomSection.lg.map((item) => item.i)
      );
      setActiveWidgets(widgetIds);
    }
  }, [plugin]);

  
  useEventBus('settings:changed', handleSettingsUpdated);

  
  useEffect(() => {
    if (!isEditing && showComponentSelector) {
      setShowComponentSelector(false);
    }
  }, [isEditing, showComponentSelector]);

  
  
  
  const allMetricIds = useMemo(() => AVAILABLE_METRICS.map((m) => m.id), []);

  const handleWidgetAdded = useCallback((_widgetId: string) => {
    
    setShowComponentSelector(false);
  }, []);

  
  const handleRemoveWidget = (widgetId: string) => {
    if (plugin) {
      try {
        
        const currentLayout = getActiveLayout(plugin);

        
        const newLayout: DashboardLayout = {
          ...currentLayout,
          bottomSection: {
            lg: currentLayout.bottomSection.lg.filter(
              (item) => item.i !== widgetId
            ),
            md: currentLayout.bottomSection.md.filter(
              (item) => item.i !== widgetId
            ),
            sm: currentLayout.bottomSection.sm.filter(
              (item) => item.i !== widgetId
            ),
            xs: (currentLayout.bottomSection.xs || []).filter(
              (item) => item.i !== widgetId
            ),
            xxs: (currentLayout.bottomSection.xxs || []).filter(
              (item) => item.i !== widgetId
            ),
          },
        };

        
        
        saveLayout(plugin, 'Default', newLayout);

        
        const newWidgets = activeWidgets.filter((id) => id !== widgetId);
        setActiveWidgets(newWidgets);

        
        
        eventBus.publish('widgets:changed', { activeWidgets: newWidgets });
      } catch (error) {
        console.error('Error removing widget in BottomSection:', error);
      }
    }
  };

  return (
    <div className="journalit-dashboard-bottom-section">
      {isEditing && !hideAddButton && (
        <div className="journalit-dashboard-bottom-section-header">
          <button
            className="journalit-dashboard-add-widget-button journalit-dashboard-add-widget-button--primary"
            onClick={() => {
              setShowComponentSelector(!showComponentSelector);
            }}
          >
            {t('dashboard.button.add-widget')}
          </button>
        </div>
      )}

      <div className="journalit-dashboard-bottom-section-body">
        {!hideAddButton && showComponentSelector && (
          <UnifiedComponentSelector
            activeMetrics={allMetricIds}
            activeWidgets={activeWidgets}
            onAddMetric={() => {
              // intentional
            }}
            onAddWidget={handleWidgetAdded}
            onClose={() => {
              setShowComponentSelector(false);
            }}
          />
        )}

        <GridLayout
          filters={filters}
          isEditing={isEditing}
          widgets={activeWidgets}
          onRemoveWidget={(widgetId) => {
            handleRemoveWidget(widgetId);
          }}
        />
      </div>
    </div>
  );
};
