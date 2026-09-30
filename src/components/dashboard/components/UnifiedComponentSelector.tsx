

import React, { useMemo, useCallback } from 'react';
import { AVAILABLE_METRICS, MetricDefinition } from './TopSection/types';
import {
  AVAILABLE_WIDGETS,
  WidgetDefinition,
  normalizeDashboardWidgetIds,
  type DashboardWidgetCategory,
} from './BottomSection/types';
import { findBestWidgetPosition } from '../../shared/gridLayout/gridLayoutUtils';
import type { Layout } from '../../shared/gridLayout/reactGridLayoutCompat';
import { usePlugin } from '../../../hooks/usePlugin';
import {
  getActiveLayout,
  getSavedDashboardLgLayouts,
  saveLayout,
  DashboardLayout,
} from '../utils/layoutUtils';
import { eventBus } from '../../../services/events/EventBus';
import { t } from '../../../lang/helpers';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { DASHBOARD_WIDGET_PICKER_TARGET_ID } from '../../../guides/dashboardGuideIds';
import {
  WidgetPreviewDrawer,
  type WidgetDrawerItem,
  type WidgetDrawerTab,
} from '../../shared/widgetDrawer/WidgetPreviewDrawer';
import {
  DASHBOARD_WIDGET_PREVIEWS,
  renderMetricPreview,
} from './dashboardWidgetPreviews';

interface UnifiedComponentSelectorProps {
  activeMetrics: string[];
  activeWidgets: string[];
  onClose: () => void;
}

const METRICS_TAB_ID = 'metrics';
const METRIC_ITEM_PREFIX = 'metric:';

const CATEGORY_LABEL_KEYS = {
  performance: 'dashboard.selector.tab.performance',
  breakdowns: 'dashboard.selector.tab.breakdowns',
  risk: 'dashboard.selector.tab.risk',
} as const satisfies Record<DashboardWidgetCategory, string>;

const UnifiedComponentSelectorBase: React.FC<UnifiedComponentSelectorProps> = ({
  activeMetrics,
  activeWidgets,
  onClose,
}) => {
  const plugin = usePlugin();
  const registerWidgetPickerTarget = useGuideTarget(
    DASHBOARD_WIDGET_PICKER_TARGET_ID
  );

  const tabs = useMemo<WidgetDrawerTab[]>(
    () => [
      ...Object.entries(CATEGORY_LABEL_KEYS).map(([id, labelKey]) => ({
        id,
        label: t(labelKey),
      })),
      { id: METRICS_TAB_ID, label: t('dashboard.selector.metrics') },
    ],
    []
  );

  
  
  const items = useMemo<WidgetDrawerItem[]>(() => {
    const widgetsInUse = new Set(activeWidgets);
    const metricsInUse = new Set(activeMetrics);
    return [
      ...AVAILABLE_WIDGETS.map((widget) => ({
        id: widget.id,
        name: widget.name,
        description: widget.description,
        tabId: widget.category,
        renderPreview: DASHBOARD_WIDGET_PREVIEWS[widget.id],
        inUse: widgetsInUse.has(widget.id),
      })),
      ...AVAILABLE_METRICS.map((metric) => ({
        id: `${METRIC_ITEM_PREFIX}${metric.id}`,
        name: metric.name,
        description: metric.description,
        tabId: METRICS_TAB_ID,
        renderPreview: () => renderMetricPreview(metric),
        compact: true,
        inUse: metricsInUse.has(metric.id),
      })),
    ];
  }, [activeMetrics, activeWidgets]);

  
  
  
  
  
  
  const handleAddMetric = useCallback(
    async (metric: MetricDefinition) => {
      if (!plugin) return;
      try {
        const currentLayout = getActiveLayout(plugin);
        if (currentLayout.topSection.includes(metric.id)) return;

        const updatedTopSection = [...currentLayout.topSection, metric.id];
        const persisted = saveLayout(plugin, {
          ...currentLayout,
          topSection: updatedTopSection,
        });
        eventBus.publish('metrics:changed', {
          activeMetrics: updatedTopSection,
        });
        await persisted;
      } catch (error) {
        console.error('Error adding metric:', error);
      }
    },
    [plugin]
  );

  const handleAddWidget = useCallback(
    async (widget: WidgetDefinition) => {
      if (!plugin) return;
      try {
        const currentLayout = getActiveLayout(plugin);
        if (
          currentLayout.bottomSection.lg.some((item) => item.i === widget.id)
        ) {
          return;
        }

        const newLayoutItem = findBestWidgetPosition({
          layout: currentLayout.bottomSection.lg,
          widgetId: widget.id,
          w: widget.defaultSize.w,
          h: widget.defaultSize.h,
          sizing: widget,
          savedLgLayouts: getSavedDashboardLgLayouts(plugin),
        });

        const newLayout: DashboardLayout = {
          ...currentLayout,
          bottomSection: {
            lg: [...currentLayout.bottomSection.lg, newLayoutItem],
            md: [...currentLayout.bottomSection.md, newLayoutItem],
            sm: [...currentLayout.bottomSection.sm, newLayoutItem],
            xs: [
              ...(currentLayout.bottomSection.xs || []),
              {
                ...newLayoutItem,
                w: Math.min(newLayoutItem.w, 2),
              },
            ],
            xxs: [
              ...(currentLayout.bottomSection.xxs || []),
              {
                ...newLayoutItem,
                w: 1,
              },
            ],
          },
        };

        const persisted = saveLayout(plugin, newLayout);
        eventBus.publish('widgets:changed', {
          activeWidgets: normalizeDashboardWidgetIds(
            newLayout.bottomSection.lg.map((item) => item.i)
          ),
        });
        await persisted;
      } catch (error) {
        console.error('Error adding widget:', error);
      }
    },
    [plugin]
  );

  const handleAdd = useCallback(
    (itemId: string) => {
      if (itemId.startsWith(METRIC_ITEM_PREFIX)) {
        const metricId = itemId.slice(METRIC_ITEM_PREFIX.length);
        const metric = AVAILABLE_METRICS.find((m) => m.id === metricId);
        if (metric) return handleAddMetric(metric);
        return;
      }
      const widget = AVAILABLE_WIDGETS.find((w) => w.id === itemId);
      if (widget) return handleAddWidget(widget);
    },
    [handleAddMetric, handleAddWidget]
  );

  
  
  const handleRemove = useCallback(
    async (itemId: string) => {
      if (!plugin) return;
      try {
        const currentLayout = getActiveLayout(plugin);
        if (itemId.startsWith(METRIC_ITEM_PREFIX)) {
          const metricId = itemId.slice(METRIC_ITEM_PREFIX.length);
          const updatedTopSection = currentLayout.topSection.filter(
            (id) => id !== metricId
          );
          const persisted = saveLayout(plugin, {
            ...currentLayout,
            topSection: updatedTopSection,
          });
          eventBus.publish('metrics:changed', {
            activeMetrics: updatedTopSection,
          });
          await persisted;
          return;
        }

        const withoutWidget = (items: Layout[] = []) =>
          items.filter((item) => item.i !== itemId);
        const bottomSection = {
          lg: withoutWidget(currentLayout.bottomSection.lg),
          md: withoutWidget(currentLayout.bottomSection.md),
          sm: withoutWidget(currentLayout.bottomSection.sm),
          xs: withoutWidget(currentLayout.bottomSection.xs),
          xxs: withoutWidget(currentLayout.bottomSection.xxs),
        };
        const persisted = saveLayout(plugin, {
          ...currentLayout,
          bottomSection,
        });
        eventBus.publish('widgets:changed', {
          activeWidgets: normalizeDashboardWidgetIds(
            bottomSection.lg.map((item) => item.i)
          ),
        });
        await persisted;
      } catch (error) {
        console.error('Error removing dashboard item:', error);
      }
    },
    [plugin]
  );

  return (
    <WidgetPreviewDrawer
      title={t('dashboard.selector.title')}
      subtitle={t('dashboard.selector.subtitle')}
      tabs={tabs}
      items={items}
      onAdd={handleAdd}
      onRemove={handleRemove}
      onClose={onClose}
      panelRef={registerWidgetPickerTarget}
    />
  );
};

export const UnifiedComponentSelector = React.memo(
  UnifiedComponentSelectorBase
);
UnifiedComponentSelector.displayName = 'UnifiedComponentSelector';
