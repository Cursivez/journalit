

import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from 'react';
import { X, Plus } from '../../shared/icons/ObsidianIcon';
import { AVAILABLE_HOME_WIDGETS } from '../homeTypes';
import { QuickLinkButton } from '../../../settings/types';
import { resolveIcon } from '../../../utils/iconResolver';

import { hasTranslation, t } from '../../../lang/helpers';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { HOME_WIDGET_SELECTOR_TARGET_ID } from '../../../guides/homeGuideIds';

interface HomeWidgetSelectorProps {
  activeWidgets: string[];
  hiddenQuickLinks: QuickLinkButton[];
  onAddWidget: (widgetId: string) => void;
  onRestoreQuickLink: (quickLinkId: string) => void;
  onClose: () => void;
}

type SelectableItem =
  | { type: 'widget'; id: string; configurable: boolean; instanceCount: number }
  | { type: 'quicklink'; id: string };

export const HomeWidgetSelector: React.FC<HomeWidgetSelectorProps> = React.memo(
  ({
    activeWidgets,
    hiddenQuickLinks,
    onAddWidget,
    onRestoreQuickLink,
    onClose,
  }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);
    const registerWidgetSelectorTarget = useGuideTarget(
      HOME_WIDGET_SELECTOR_TARGET_ID
    );

    useEffect(() => {}, []);

    
    const instanceCounts = useMemo(() => {
      const counts: Record<string, number> = {};
      activeWidgets.forEach((widgetId) => {
        const baseType = widgetId.split('-')[0];
        counts[baseType] = (counts[baseType] || 0) + 1;
      });
      return counts;
    }, [activeWidgets]);

    
    const availableWidgets = useMemo(
      () =>
        AVAILABLE_HOME_WIDGETS.filter((widget) => {
          if (widget.configurable) return true; 
          return !activeWidgets.includes(widget.id); 
        }),
      [activeWidgets]
    );

    
    const selectableItems = useMemo<SelectableItem[]>(() => {
      const items: SelectableItem[] = [];

      availableWidgets.forEach((widget) => {
        items.push({
          type: 'widget',
          id: widget.id,
          configurable: widget.configurable || false,
          instanceCount: widget.configurable
            ? instanceCounts[widget.id] || 0
            : 0,
        });
      });

      hiddenQuickLinks.forEach((ql) => {
        items.push({ type: 'quicklink', id: ql.id });
      });

      return items;
    }, [availableWidgets, hiddenQuickLinks, instanceCounts]);

    const currentSelectedIndex = Math.min(
      selectedIndex,
      Math.max(0, selectableItems.length - 1)
    );

    
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (selectableItems.length === 0) return;

        switch (e.key) {
          case 'Escape':
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); 
            onClose();
            break;
          case 'ArrowDown':
            e.preventDefault();
            setSelectedIndex(
              Math.min(currentSelectedIndex + 1, selectableItems.length - 1)
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex(Math.max(currentSelectedIndex - 1, 0));
            break;
          case 'Enter': {
            e.preventDefault();
            const item = selectableItems[currentSelectedIndex];
            if (item) {
              if (item.type === 'widget') {
                onAddWidget(item.id);
              } else {
                onRestoreQuickLink(item.id);
              }
            }
            break;
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown, true);
      return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [
      onClose,
      selectableItems,
      currentSelectedIndex,
      onAddWidget,
      onRestoreQuickLink,
    ]);

    
    useEffect(() => {
      if (!listRef.current) return;
      const items = listRef.current.querySelectorAll('[data-selectable]');
      const selected = items[currentSelectedIndex];
      if (selected instanceof HTMLElement) {
        selected.scrollIntoView({ block: 'nearest' });
      }
    }, [currentSelectedIndex]);

    
    const getItemIndex = useCallback(
      (type: 'widget' | 'quicklink', id: string): number => {
        return selectableItems.findIndex(
          (item) => item.type === type && item.id === id
        );
      },
      [selectableItems]
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="journalit-home-selector-title"
          className="journalit-shared-selector-modal"
          ref={registerWidgetSelectorTarget}
        >
          
          <div className="journalit-shared-selector-header">
            <span
              id="journalit-home-selector-title"
              className="journalit-shared-selector-title"
            >
              {t('home.widget-selector.title')}
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
            
            {availableWidgets.length > 0 && (
              <>
                <div className="journalit-shared-selector-section">
                  {t('home.widget-selector.section.widgets')}
                </div>

                {availableWidgets.map((widget) => {
                  const count = widget.configurable
                    ? instanceCounts[widget.id] || 0
                    : 0;
                  const currentIndex = getItemIndex('widget', widget.id);
                  const isSelected = currentIndex === currentSelectedIndex;

                  return (
                    <div
                      role="button"
                      tabIndex={0}
                      key={widget.id}
                      data-selectable
                      onClick={() => onAddWidget(widget.id)}
                      onKeyDown={(event) => {
                        if (event.key !== ' ') return;
                        event.preventDefault();
                        onAddWidget(widget.id);
                      }}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      onFocus={() => setSelectedIndex(currentIndex)}
                      className={`journalit-shared-selector-item${isSelected ? ' journalit-shared-selector-item--selected' : ''}`}
                    >
                      <div className="journalit-shared-selector-icon">
                        <Plus size={16} />
                      </div>
                      <div className="journalit-shared-selector-body">
                        <div className="journalit-shared-selector-item-title">
                          {widget.name}
                          {count > 0 && (
                            <span className="journalit-shared-selector-widget-category">
                              ({count})
                            </span>
                          )}
                        </div>
                        <div className="journalit-shared-selector-item-description">
                          {widget.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            
            {hiddenQuickLinks.length > 0 && (
              <>
                <div
                  className={`journalit-shared-selector-section${availableWidgets.length > 0 ? ' journalit-shared-selector-section--spaced' : ''}`}
                >
                  {t('home.widget-selector.section.quick-links')}
                </div>

                {hiddenQuickLinks.map((quickLink) => {
                  const IconComponent = resolveIcon(quickLink.icon);
                  const currentIndex = getItemIndex('quicklink', quickLink.id);
                  const isSelected = currentIndex === currentSelectedIndex;

                  const labelKey = `home.quick-links.${quickLink.id}`;
                  const label = hasTranslation(labelKey)
                    ? t(labelKey)
                    : labelKey;

                  return (
                    <div
                      role="button"
                      tabIndex={0}
                      key={quickLink.id}
                      data-selectable
                      onClick={() => onRestoreQuickLink(quickLink.id)}
                      onKeyDown={(event) => {
                        if (event.key !== ' ') return;
                        event.preventDefault();
                        onRestoreQuickLink(quickLink.id);
                      }}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      onFocus={() => setSelectedIndex(currentIndex)}
                      className={`journalit-shared-selector-item${isSelected ? ' journalit-shared-selector-item--selected' : ''}`}
                    >
                      <div className="journalit-shared-selector-icon">
                        <IconComponent size={16} />
                      </div>
                      <div className="journalit-shared-selector-body">
                        <div className="journalit-shared-selector-item-title">
                          {label}
                        </div>
                      </div>
                      <span className="journalit-shared-selector-widget-category">
                        {t('home.widget-selector.restore')}
                      </span>
                    </div>
                  );
                })}
              </>
            )}

            
            {availableWidgets.length === 0 && hiddenQuickLinks.length === 0 && (
              <div className="journalit-shared-selector-empty">
                {t('home.widget-selector.empty')}
              </div>
            )}
          </div>

          
          <div className="journalit-shared-selector-footer">
            <span>{t('home.widget-selector.hint.navigate')}</span>
            <span>{t('home.widget-selector.hint.select')}</span>
            <span>{t('home.widget-selector.hint.close')}</span>
          </div>
        </div>
      </div>
    );
  }
);

HomeWidgetSelector.displayName = 'HomeWidgetSelector';
