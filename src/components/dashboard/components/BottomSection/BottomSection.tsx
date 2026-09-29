

import React, { useEffect, useState, useCallback } from 'react';
import { FilterState } from '../../DashboardView';
import {
  getActiveLayout,
  saveLayout,
  DashboardLayout,
} from '../../utils/layoutUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { GridLayout } from './GridLayout';
import { eventBus } from '../../../../services/events/EventBus';
import { useEventBus } from '../../../../hooks/useEventBus';
import { normalizeDashboardWidgetIds } from './types';

interface BottomSectionProps {
  filters: FilterState;
  isEditing: boolean;
}


export const BottomSection: React.FC<BottomSectionProps> = ({
  filters,
  isEditing,
}) => {
  const plugin = usePlugin();
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

        
        void saveLayout(plugin, newLayout);

        
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
      <div className="journalit-dashboard-bottom-section-body">
        <GridLayout
          filters={filters}
          isEditing={isEditing}
          widgets={activeWidgets}
          onRemoveWidget={handleRemoveWidget}
        />
      </div>
    </div>
  );
};
