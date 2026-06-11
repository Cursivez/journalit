

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { X, Plus } from '../../shared/icons/ObsidianIcon';
import { AVAILABLE_METRICS, MetricDefinition } from './TopSection/types';
import { AVAILABLE_WIDGETS, WidgetDefinition } from './BottomSection/types';
import { findBestWidgetPosition } from './BottomSection/GridLayout';
import { usePlugin } from '../../../hooks/usePlugin';
import {
  getActiveLayout,
  saveLayout,
  DashboardLayout,
} from '../utils/layoutUtils';
import { eventBus } from '../../../services/events';
import { t, TranslationKey } from '../../../lang/helpers';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { DASHBOARD_WIDGET_PICKER_TARGET_ID } from '../../../guides/dashboardGuideIds';

interface UnifiedComponentSelectorProps {
  activeMetrics: string[];
  activeWidgets: string[];
  onAddMetric: (metricId: string) => void;
  onAddWidget: (widgetId: string) => void;
  onClose: () => void;
}

type SelectableItem =
  | { type: 'metric'; data: MetricDefinition }
  | { type: 'widget'; data: WidgetDefinition };

interface SelectorItemProps {
  item: SelectableItem;
  itemIndex: number;
  isSelected: boolean;
  onAddMetric: (metric: MetricDefinition) => void;
  onAddWidget: (widget: WidgetDefinition) => void;
  onSelectIndex: (index: number) => void;
  onItemKeyDown: (event: React.KeyboardEvent, action: () => void) => void;
}

const SelectorItem: React.FC<SelectorItemProps> = ({
  item,
  itemIndex,
  isSelected,
  onAddMetric,
  onAddWidget,
  onSelectIndex,
  onItemKeyDown,
}) => {
  const isMetric = item.type === 'metric';
  const translationPrefix = isMetric ? 'metric' : 'widget';
  const action = () => {
    if (isMetric) {
      onAddMetric(item.data);
      return;
    }

    onAddWidget(item.data);
  };

  return (
    <div
      data-selectable
      data-item-index={itemIndex}
      onClick={action}
      onKeyDown={(event) => onItemKeyDown(event, action)}
      onMouseEnter={() => onSelectIndex(itemIndex)}
      onFocus={() => onSelectIndex(itemIndex)}
      role="button"
      tabIndex={0}
      className={`journalit-shared-selector-item${isSelected ? ' journalit-shared-selector-item--selected' : ''}`}
    >
      <div className="journalit-shared-selector-icon">
        <Plus size={16} />
      </div>
      <div className="journalit-shared-selector-body">
        <div className="journalit-shared-selector-item-title">
          {t(`${translationPrefix}.${item.data.id}.name` as TranslationKey)}
        </div>
        <div className="journalit-shared-selector-item-description">
          {t(
            `${translationPrefix}.${item.data.id}.description` as TranslationKey
          )}
        </div>
      </div>
    </div>
  );
};

interface SelectorSectionProps {
  title: string;
  items: SelectableItem[];
  selectedIndex: number;
  spaced?: boolean;
  getItemIndex: (type: 'metric' | 'widget', id: string) => number;
  onAddMetric: (metric: MetricDefinition) => void;
  onAddWidget: (widget: WidgetDefinition) => void;
  onSelectIndex: (index: number) => void;
  onItemKeyDown: (event: React.KeyboardEvent, action: () => void) => void;
}

const SelectorSection: React.FC<SelectorSectionProps> = ({
  title,
  items,
  selectedIndex,
  spaced = false,
  getItemIndex,
  onAddMetric,
  onAddWidget,
  onSelectIndex,
  onItemKeyDown,
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={`journalit-shared-selector-section${spaced ? ' journalit-shared-selector-section--spaced' : ''}`}
      >
        {title}
      </div>

      {items.map((item) => {
        const currentIndex = getItemIndex(item.type, item.data.id);

        return (
          <SelectorItem
            key={item.data.id}
            item={item}
            itemIndex={currentIndex}
            isSelected={currentIndex === selectedIndex}
            onAddMetric={onAddMetric}
            onAddWidget={onAddWidget}
            onSelectIndex={onSelectIndex}
            onItemKeyDown={onItemKeyDown}
          />
        );
      })}
    </>
  );
};

function useSelectorKeyboardNavigation({
  onClose,
  selectableItems,
  selectedIndex,
  setSelectedIndex,
  handleAddMetric,
  handleAddWidget,
}: {
  onClose: () => void;
  selectableItems: SelectableItem[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  handleAddMetric: (metric: MetricDefinition) => void;
  handleAddWidget: (widget: WidgetDefinition) => void;
}) {
  const keyboardSelectionRef = useRef({
    onClose,
    selectableItems,
    selectedIndex,
    handleAddMetric,
    handleAddWidget,
  });

  useEffect(() => {
    keyboardSelectionRef.current = {
      onClose,
      selectableItems,
      selectedIndex,
      handleAddMetric,
      handleAddWidget,
    };
  }, [
    onClose,
    selectableItems,
    selectedIndex,
    handleAddMetric,
    handleAddWidget,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentSelection = keyboardSelectionRef.current;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation(); 
          currentSelection.onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(prev + 1, currentSelection.selectableItems.length - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter': {
          e.preventDefault();
          const item =
            currentSelection.selectableItems[currentSelection.selectedIndex];
          if (item) {
            if (item.type === 'metric') {
              currentSelection.handleAddMetric(item.data);
            } else {
              currentSelection.handleAddWidget(item.data);
            }
          }
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [setSelectedIndex]);
}

const UnifiedComponentSelectorBase: React.FC<UnifiedComponentSelectorProps> = ({
  activeMetrics,
  activeWidgets,
  onAddMetric,
  onAddWidget,
  onClose,
}) => {
  const plugin = usePlugin();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const registerWidgetPickerTarget = useGuideTarget(
    DASHBOARD_WIDGET_PICKER_TARGET_ID
  );

  
  const availableMetrics = useMemo(
    () => AVAILABLE_METRICS.filter((m) => !activeMetrics.includes(m.id)),
    [activeMetrics]
  );

  const availableWidgets = useMemo(
    () => AVAILABLE_WIDGETS.filter((w) => !activeWidgets.includes(w.id)),
    [activeWidgets]
  );

  
  const selectableItems = useMemo<SelectableItem[]>(() => {
    const items: SelectableItem[] = [];

    availableWidgets.forEach((widget) => {
      items.push({ type: 'widget', data: widget });
    });

    availableMetrics.forEach((metric) => {
      items.push({ type: 'metric', data: metric });
    });

    return items;
  }, [availableMetrics, availableWidgets]);

  const availableWidgetItems = useMemo<SelectableItem[]>(
    () => availableWidgets.map((widget) => ({ type: 'widget', data: widget })),
    [availableWidgets]
  );

  const availableMetricItems = useMemo<SelectableItem[]>(
    () => availableMetrics.map((metric) => ({ type: 'metric', data: metric })),
    [availableMetrics]
  );

  
  const handleAddMetric = useCallback(
    async (metric: MetricDefinition) => {
      if (activeMetrics.includes(metric.id)) return;

      if (plugin) {
        try {
          const currentLayout = getActiveLayout(plugin);
          const updatedTopSection = [...currentLayout.topSection];
          if (!updatedTopSection.includes(metric.id)) {
            updatedTopSection.push(metric.id);
          }

          const newLayout: DashboardLayout = {
            ...currentLayout,
            topSection: updatedTopSection,
          };

          await saveLayout(plugin, 'Default', newLayout);
          onAddMetric(metric.id);

          eventBus.publish('metrics:changed', {
            activeMetrics: updatedTopSection,
          });
        } catch (error) {
          console.error('Error adding metric:', error);
        }
      } else {
        onAddMetric(metric.id);
      }
    },
    [activeMetrics, plugin, onAddMetric]
  );

  
  const handleAddWidget = useCallback(
    async (widget: WidgetDefinition) => {
      if (activeWidgets.includes(widget.id)) return;

      if (plugin) {
        try {
          const currentLayout = getActiveLayout(plugin);
          const widgetDef = AVAILABLE_WIDGETS.find((w) => w.id === widget.id);

          if (!widgetDef) {
            throw new Error(`Widget definition not found: ${widget.id}`);
          }

          const newLayoutItem = findBestWidgetPosition(
            currentLayout.bottomSection.lg,
            widget.id,
            widgetDef.defaultSize.w,
            widgetDef.defaultSize.h,
            plugin
          );

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

          await saveLayout(plugin, 'Default', newLayout);
          onAddWidget(widget.id);

          eventBus.publish('widgets:changed', {
            activeWidgets: [...activeWidgets, widget.id],
          });
        } catch (error) {
          console.error('Error adding widget:', error);
        }
      } else {
        onAddWidget(widget.id);
      }
    },
    [activeWidgets, plugin, onAddWidget]
  );
  useSelectorKeyboardNavigation({
    onClose,
    selectableItems,
    selectedIndex,
    setSelectedIndex,
    handleAddMetric,
    handleAddWidget,
  });

  
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-selectable]');
    const selected = items[selectedIndex] as HTMLElement;
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  
  const getItemIndex = useCallback(
    (type: 'metric' | 'widget', id: string): number => {
      return selectableItems.findIndex(
        (item) => item.type === type && item.data.id === id
      );
    },
    [selectableItems]
  );

  const handleItemKeyDown = useCallback(
    (event: React.KeyboardEvent, action: () => void) => {
      if (event.key !== ' ') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      action();
    },
    []
  );

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      role="presentation"
      className="journalit-shared-selector-overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
        className="journalit-shared-selector-modal"
        ref={registerWidgetPickerTarget}
      >
        
        <div className="journalit-shared-selector-header">
          <span className="journalit-shared-selector-title">
            {t('dashboard.selector.title')}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="journalit-shared-selector-close"
          >
            <X size={16} />
          </button>
        </div>

        
        <div ref={listRef} className="journalit-shared-selector-content">
          <SelectorSection
            title={t('dashboard.selector.charts')}
            items={availableWidgetItems}
            selectedIndex={selectedIndex}
            getItemIndex={getItemIndex}
            onAddMetric={handleAddMetric}
            onAddWidget={handleAddWidget}
            onSelectIndex={setSelectedIndex}
            onItemKeyDown={handleItemKeyDown}
          />

          <SelectorSection
            title={t('dashboard.selector.metrics')}
            items={availableMetricItems}
            selectedIndex={selectedIndex}
            spaced={availableWidgets.length > 0}
            getItemIndex={getItemIndex}
            onAddMetric={handleAddMetric}
            onAddWidget={handleAddWidget}
            onSelectIndex={setSelectedIndex}
            onItemKeyDown={handleItemKeyDown}
          />

          
          {availableMetrics.length === 0 && availableWidgets.length === 0 && (
            <div className="journalit-shared-selector-empty">
              {t('dashboard.selector.empty')}
            </div>
          )}
        </div>

        
        <div className="journalit-shared-selector-footer">
          <span>{t('dashboard.selector.hint.navigate')}</span>
          <span>{t('dashboard.selector.hint.select')}</span>
          <span>{t('dashboard.selector.hint.close')}</span>
        </div>
      </div>
    </div>
  );
};

export const UnifiedComponentSelector = React.memo(
  UnifiedComponentSelectorBase
);
UnifiedComponentSelector.displayName = 'UnifiedComponentSelector';
