

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useId,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, X } from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';
import type { ReviewTemplateType } from '../../types/reviewV2';
import {
  getWidgetsForTemplate,
  getWidgetsByCategory,
  getWidgetName,
  widgetMatchesPlacement,
  CATEGORY_LABELS,
  type WidgetDefinition,
} from '../../data/widgetRegistry';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideCurrentStepId,
  useGuideTarget,
} from '../../guides/GuideRuntimeLayer';
import {
  LAYOUT_BUILDER_EMPTY_WIDGET_PICKER_TRIGGER_TARGET_ID,
  LAYOUT_BUILDER_WIDGET_PICKER_OPENED_ACTION_ID,
  LAYOUT_BUILDER_WIDGET_PICKER_TARGET_ID,
  LAYOUT_BUILDER_WIDGET_SELECTED_ACTION_ID,
} from '../../guides/layoutBuilderGuideIds';

const COMPETING_ESCAPE_SURFACE_SELECTOR = [
  '#journalit-fullscreen-portal:not(:empty)',
  '.journalit-fullscreen-portal-container:not(:empty)',
  '.journalit-shared-selector-overlay',
  '.journalit-component-selector-overlay',
  '.journalit-modal-overlay',
  '.journalit-combobox[data-is-open="true"]',
  '.journalit-combobox.combobox-dropdown--portal',
  '.journalit-folder-browser-dropdown',
  '.journalit-trade-import-dropdown-menu--portal',
  '.journalit-trade-import-template-menu--portal',
  '.modal-container',
  '.suggestion-container',
  '.menu',
].join(', ');

interface WidgetPickerProps {
  
  value: string;
  
  valueConfig?: Record<string, unknown>;
  templateType: ReviewTemplateType;
  
  onChange: (widget: WidgetDefinition) => void;
  placeholder?: string;
}

const widgetMatchesQuery = (
  widget: WidgetDefinition,
  normalizedQuery: string
): boolean => {
  const categoryLabel = CATEGORY_LABELS[widget.category];
  return [widget.name, widget.description, categoryLabel, widget.type].some(
    (valueToSearch) =>
      valueToSearch.toLocaleLowerCase().includes(normalizedQuery)
  );
};

export const WidgetPicker: React.FC<WidgetPickerProps> = React.memo(
  ({
    value,
    valueConfig,
    templateType,
    onChange,
    placeholder = t('widget.picker.placeholder'),
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [dropdownPosition, setDropdownPosition] = useState({
      top: 0,
      bottom: 0,
      left: 0,
      width: 0,
      maxHeight: 400,
      openAbove: false,
    });
    const emitGuideAction = useGuideAction();
    const currentGuideStepId = useGuideCurrentStepId();
    const registerEmptyPickerTriggerTarget = useGuideTarget(
      LAYOUT_BUILDER_EMPTY_WIDGET_PICKER_TRIGGER_TARGET_ID
    );
    const registerWidgetPickerTarget = useGuideTarget(
      LAYOUT_BUILDER_WIDGET_PICKER_TARGET_ID
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const clearButtonRef = useRef<HTMLButtonElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const focusTriggerOnCloseRef = useRef(false);
    const listboxId = useId();
    const searchLabelId = `${listboxId}-search-label`;
    const listboxLabelId = `${listboxId}-label`;

    
    const widgets = useMemo(
      () => getWidgetsForTemplate(templateType),
      [templateType]
    );
    const allGroupedWidgets = useMemo(
      () => getWidgetsByCategory(widgets),
      [widgets]
    );
    const allFlatWidgets = useMemo(() => {
      const flat: WidgetDefinition[] = [];
      allGroupedWidgets.forEach((categoryWidgets) => {
        flat.push(...categoryWidgets);
      });
      return flat;
    }, [allGroupedWidgets]);

    const groupedWidgets = useMemo(() => {
      const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
      if (!normalizedQuery) {
        return allGroupedWidgets;
      }

      return getWidgetsByCategory(
        widgets.filter((widget) => widgetMatchesQuery(widget, normalizedQuery))
      );
    }, [allGroupedWidgets, searchQuery, widgets]);

    
    const flatWidgets = useMemo(() => {
      const flat: WidgetDefinition[] = [];
      groupedWidgets.forEach((categoryWidgets) => {
        flat.push(...categoryWidgets);
      });
      return flat;
    }, [groupedWidgets]);

    
    const isWidgetSelected = useCallback(
      (widget: WidgetDefinition): boolean =>
        widgetMatchesPlacement(widget, value, valueConfig),
      [value, valueConfig]
    );

    
    const selectedWidget = useMemo(() => {
      return widgets.find((widget) => isWidgetSelected(widget));
    }, [isWidgetSelected, widgets]);

    const getInitialFocusedIndex = useCallback(
      (candidateWidgets: WidgetDefinition[]): number => {
        const selectedIndex = candidateWidgets.findIndex((widget) =>
          isWidgetSelected(widget)
        );
        return selectedIndex >= 0
          ? selectedIndex
          : candidateWidgets.length > 0
            ? 0
            : -1;
      },
      [isWidgetSelected]
    );

    const openDropdown = useCallback(() => {
      setFocusedIndex(getInitialFocusedIndex(allFlatWidgets));
      setIsOpen(true);
    }, [allFlatWidgets, getInitialFocusedIndex]);

    const closeDropdown = useCallback((focusTrigger = false) => {
      focusTriggerOnCloseRef.current = focusTrigger;
      setSearchQuery('');
      setFocusedIndex(-1);
      setIsOpen(false);
    }, []);

    useEffect(() => {
      if (isOpen) {
        searchInputRef.current?.focus();
        return;
      }

      if (focusTriggerOnCloseRef.current) {
        focusTriggerOnCloseRef.current = false;
        triggerRef.current?.focus();
      }
    }, [isOpen]);

    
    useEffect(() => {
      if (isOpen && focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
        itemRefs.current[focusedIndex]?.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }, [focusedIndex, isOpen]);

    const updateDropdownPosition = useCallback(() => {
      const anchor = containerRef.current;
      if (!anchor) {
        return;
      }

      const rect = anchor.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const gap = 4;
      const margin = 12;
      const spaceBelow = viewportHeight - rect.bottom - margin;
      const spaceAbove = rect.top - margin;
      const openAbove = spaceBelow < 240 && spaceAbove > spaceBelow;
      const availableHeight = Math.max(
        160,
        Math.min(400, openAbove ? spaceAbove - gap : spaceBelow - gap)
      );

      setDropdownPosition({
        top: rect.bottom + gap,
        bottom: viewportHeight - rect.top + gap,
        left: rect.left,
        width: rect.width,
        maxHeight: availableHeight,
        openAbove,
      });
    }, []);

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      updateDropdownPosition();

      const handleUpdate = () => {
        updateDropdownPosition();
      };

      window.addEventListener('resize', handleUpdate);
      window.addEventListener('scroll', handleUpdate, true);

      return () => {
        window.removeEventListener('resize', handleUpdate);
        window.removeEventListener('scroll', handleUpdate, true);
      };
    }, [isOpen, updateDropdownPosition]);

    
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Node)) {
          closeDropdown();
          return;
        }

        if (
          containerRef.current?.contains(target) ||
          dropdownRef.current?.contains(target)
        ) {
          return;
        }

        closeDropdown();
      };

      window.activeDocument.addEventListener('mousedown', handleClickOutside);
      return () =>
        window.activeDocument.removeEventListener(
          'mousedown',
          handleClickOutside
        );
    }, [closeDropdown, isOpen]);

    const handleSelect = useCallback(
      (widget: WidgetDefinition) => {
        onChange(widget);
        emitGuideAction(LAYOUT_BUILDER_WIDGET_SELECTED_ACTION_ID);
        closeDropdown(true);
      },
      [closeDropdown, emitGuideAction, onChange]
    );

    const handleGlobalKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.isComposing) {
          return;
        }

        const target = event.target;
        const isPickerEvent =
          target instanceof Node &&
          (containerRef.current?.contains(target) ||
            dropdownRef.current?.contains(target));

        if (
          event.key === 'Enter' &&
          target instanceof Node &&
          target !== searchInputRef.current &&
          (clearButtonRef.current?.contains(target) ||
            dropdownRef.current?.contains(target))
        ) {
          return;
        }

        if (
          !isPickerEvent &&
          window.activeDocument.querySelector(COMPETING_ESCAPE_SURFACE_SELECTOR)
        ) {
          return;
        }

        switch (event.key) {
          case 'Escape':
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            closeDropdown(true);
            break;
          case 'ArrowDown':
            event.preventDefault();
            setFocusedIndex((prev) =>
              prev < flatWidgets.length - 1 ? prev + 1 : 0
            );
            break;
          case 'ArrowUp':
            event.preventDefault();
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : flatWidgets.length - 1
            );
            break;
          case 'Enter':
            event.preventDefault();
            if (focusedIndex >= 0 && focusedIndex < flatWidgets.length) {
              handleSelect(flatWidgets[focusedIndex]);
            }
            break;
        }
      },
      [closeDropdown, flatWidgets, focusedIndex, handleSelect]
    );
    const handleGlobalKeyDownRef = useRef(handleGlobalKeyDown);

    useEffect(() => {
      handleGlobalKeyDownRef.current = handleGlobalKeyDown;
    }, [handleGlobalKeyDown]);

    
    useEffect(() => {
      if (!isOpen) return;

      const listener = (event: KeyboardEvent) => {
        handleGlobalKeyDownRef.current(event);
      };

      const activeWindow = window.activeDocument.defaultView ?? window;
      activeWindow.addEventListener('keydown', listener, true);
      return () => activeWindow.removeEventListener('keydown', listener, true);
    }, [isOpen]);

    const handleTriggerKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          openDropdown();
        }
      },
      [openDropdown]
    );

    const handleSearchChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextQuery = event.target.value;
        const normalizedQuery = nextQuery.trim().toLocaleLowerCase();
        setSearchQuery(nextQuery);
        setFocusedIndex(
          normalizedQuery.length > 0
            ? 0
            : getInitialFocusedIndex(allFlatWidgets)
        );
      },
      [allFlatWidgets, getInitialFocusedIndex]
    );

    const handleClearSearch = useCallback(() => {
      setSearchQuery('');
      setFocusedIndex(getInitialFocusedIndex(allFlatWidgets));
      searchInputRef.current?.focus();
    }, [allFlatWidgets, getInitialFocusedIndex]);

    const handleClearSearchKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleClearSearch();
        }
      },
      [handleClearSearch]
    );

    const registerSearchContainer = useCallback(
      (element: HTMLDivElement | null) => {
        registerWidgetPickerTarget(element);
      },
      [registerWidgetPickerTarget]
    );

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      emitGuideAction(LAYOUT_BUILDER_WIDGET_PICKER_OPENED_ACTION_ID);
    }, [emitGuideAction, isOpen]);

    const handleGuideBack = useCallback(
      async ({ toStepId }: { toStepId: string }) => {
        if (toStepId === 'choose-widget') {
          if (!value) {
            triggerRef.current?.scrollIntoView({
              block: 'center',
              inline: 'nearest',
            });
            await new Promise((resolve) => window.setTimeout(resolve, 100));
            openDropdown();
            await new Promise((resolve) => window.setTimeout(resolve, 0));
          }
          return;
        }

        if (
          toStepId === 'open-widget-picker' ||
          toStepId === 'widget-library-docs'
        ) {
          closeDropdown();
          await new Promise((resolve) => window.setTimeout(resolve, 0));
        }
      },
      [closeDropdown, openDropdown, value]
    );

    useGuideBackHandler(handleGuideBack);

    useEffect(() => {
      if (currentGuideStepId === 'choose-widget') {
        if (!value) {
          triggerRef.current?.scrollIntoView({
            block: 'center',
            inline: 'nearest',
          });
        }
        if (value) {
          closeDropdown();
        } else {
          openDropdown();
        }
        return;
      }

      if (
        currentGuideStepId === 'open-widget-picker' ||
        currentGuideStepId === 'widget-library-docs'
      ) {
        closeDropdown();
      }
    }, [closeDropdown, currentGuideStepId, openDropdown, value]);

    const displayValue =
      selectedWidget?.name || (value ? getWidgetName(value) : placeholder);
    const triggerClasses = `widget-picker-trigger${!value ? ' widget-picker-trigger--placeholder' : ''}`;

    
    let flatIndex = 0;

    return (
      <div ref={containerRef} className="widget-picker-container">
        {isOpen ? (
          <div
            ref={registerSearchContainer}
            className="widget-picker-search widget-picker-search--inline"
            aria-controls={listboxId}
          >
            <span
              id={searchLabelId}
              className="journalit-widget-picker-sr-only"
            >
              {t('widget.picker.search-label')}
            </span>
            <Search
              size={14}
              className="widget-picker-search-icon"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="search"
              className="widget-picker-search-input"
              placeholder={t('widget.picker.search-placeholder')}
              aria-labelledby={searchLabelId}
              role="combobox"
              aria-expanded={isOpen}
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-activedescendant={
                focusedIndex >= 0 && focusedIndex < flatWidgets.length
                  ? `${listboxId}-option-${focusedIndex}`
                  : undefined
              }
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                ref={clearButtonRef}
                type="button"
                className="journalit-widget-picker-search-clear widget-picker-search-clear"
                onClick={handleClearSearch}
              >
                <X size={13} aria-hidden="true" />
                <span className="journalit-widget-picker-sr-only">
                  {t('widget.picker.clear-search')}
                </span>
              </button>
            )}
          </div>
        ) : (
          <button
            ref={(element) => {
              triggerRef.current = element;
              if (!value) {
                registerEmptyPickerTriggerTarget(element);
              }
            }}
            type="button"
            onClick={openDropdown}
            onKeyDown={handleTriggerKeyDown}
            className={`journalit-widget-picker-trigger ${triggerClasses}`}
            aria-haspopup="listbox"
            aria-expanded={false}
          >
            <span>{displayValue}</span>
            <ChevronDown size={14} className="widget-picker-icon" />
          </button>
        )}

        {isOpen &&
          createPortal(
            <div
              ref={(element) => {
                dropdownRef.current = element;
              }}
              className={`journalit-widget-picker-dropdown widget-picker-dropdown widget-picker-dropdown--floating${dropdownPosition.openAbove ? ' widget-picker-dropdown--above' : ''}`}
              style={cssVars({
                '--widget-picker-floating-top': `${dropdownPosition.top}px`,
                '--widget-picker-floating-bottom': `${dropdownPosition.bottom}px`,
                '--widget-picker-floating-left': `${dropdownPosition.left}px`,
                '--widget-picker-floating-width': `${dropdownPosition.width}px`,
                '--widget-picker-floating-max-height': `${dropdownPosition.maxHeight}px`,
              })}
            >
              <span
                id={listboxLabelId}
                className="journalit-widget-picker-sr-only"
              >
                {t('widget.picker.results-label')}
              </span>
              <div
                id={listboxId}
                className="widget-picker-results"
                role={flatWidgets.length > 0 ? 'listbox' : undefined}
                aria-labelledby={
                  flatWidgets.length > 0 ? listboxLabelId : undefined
                }
              >
                {flatWidgets.length > 0 &&
                  Array.from(groupedWidgets.entries()).map(
                    ([category, categoryWidgets]) => {
                      const categoryId = `${listboxId}-category-${category.toLocaleLowerCase().replaceAll(' ', '-')}`;
                      return (
                        <div
                          key={category}
                          role="group"
                          aria-labelledby={categoryId}
                        >
                          <div
                            id={categoryId}
                            className="widget-picker-category"
                          >
                            {CATEGORY_LABELS[category]}
                          </div>
                          {categoryWidgets.map((widget) => {
                            const currentIndex = flatIndex++;
                            const isFocused = currentIndex === focusedIndex;
                            const isSelected = isWidgetSelected(widget);
                            
                            const widgetKey = widget.defaultConfig
                              ? `${widget.type}-${JSON.stringify(widget.defaultConfig)}`
                              : widget.type;
                            return (
                              <button
                                id={`${listboxId}-option-${currentIndex}`}
                                key={widgetKey}
                                ref={(el) => {
                                  itemRefs.current[currentIndex] = el;
                                }}
                                type="button"
                                data-guide-primary-action={
                                  currentIndex === 0 ? true : undefined
                                }
                                onClick={() => handleSelect(widget)}
                                onMouseEnter={() =>
                                  setFocusedIndex(currentIndex)
                                }
                                className={`journalit-widget-picker-item widget-picker-item${isFocused ? ' widget-picker-item--focused' : ''}${isSelected ? ' widget-picker-item--selected' : ''}`}
                                role="option"
                                aria-selected={isSelected}
                              >
                                <span className="widget-picker-item-content">
                                  <span className="widget-picker-item-name">
                                    {widget.name}
                                  </span>
                                  <span className="widget-picker-item-description">
                                    {widget.description}
                                  </span>
                                </span>
                                {isSelected && (
                                  <Check
                                    size={16}
                                    className="widget-picker-item-check"
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    }
                  )}
                {flatWidgets.length === 0 && (
                  <button
                    type="button"
                    className="journalit-widget-picker-empty widget-picker-empty"
                    data-guide-primary-action
                    onClick={handleClearSearch}
                    onKeyDown={handleClearSearchKeyDown}
                  >
                    <span role="status">{t('widget.picker.no-results')}</span>
                    <span className="widget-picker-empty-action">
                      {t('widget.picker.clear-search')}
                    </span>
                  </button>
                )}
              </div>
            </div>,
            window.activeDocument.body
          )}
      </div>
    );
  }
);

WidgetPicker.displayName = 'WidgetPicker';
