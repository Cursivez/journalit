

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';
import type { ReviewTemplateType } from '../../types/reviewV2';
import {
  getWidgetsForTemplate,
  getWidgetsByCategory,
  getWidgetName,
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
  '.folder-browser-dropdown',
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

export const WidgetPicker: React.FC<WidgetPickerProps> = React.memo(
  ({
    value,
    valueConfig,
    templateType,
    onChange,
    placeholder = t('widget.picker.placeholder'),
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [dropdownPosition, setDropdownPosition] = useState({
      top: 0,
      left: 0,
      width: 0,
      maxHeight: 400,
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
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    
    const widgets = useMemo(
      () => getWidgetsForTemplate(templateType),
      [templateType]
    );
    const groupedWidgets = useMemo(
      () => getWidgetsByCategory(widgets),
      [widgets]
    );

    
    const flatWidgets = useMemo(() => {
      const flat: WidgetDefinition[] = [];
      groupedWidgets.forEach((categoryWidgets) => {
        flat.push(...categoryWidgets);
      });
      return flat;
    }, [groupedWidgets]);

    
    const isWidgetSelected = useCallback(
      (widget: WidgetDefinition): boolean => {
        if (widget.type !== value) return false;
        
        if (widget.defaultConfig) {
          if (!valueConfig) return false;
          
          return Object.entries(widget.defaultConfig).every(
            ([key, val]) => valueConfig[key] === val
          );
        }
        
        return !valueConfig || Object.keys(valueConfig).length === 0;
      },
      [value, valueConfig]
    );

    
    const selectedWidget = useMemo(() => {
      return flatWidgets.find((w) => isWidgetSelected(w));
    }, [flatWidgets, isWidgetSelected]);

    const openDropdown = useCallback(() => {
      const selectedIndex = flatWidgets.findIndex((w) => isWidgetSelected(w));
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      setIsOpen(true);
    }, [flatWidgets, isWidgetSelected]);

    const closeDropdown = useCallback(() => {
      setFocusedIndex(-1);
      setIsOpen(false);
    }, []);

    
    useEffect(() => {
      if (isOpen && focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
        itemRefs.current[focusedIndex]?.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }, [focusedIndex, isOpen]);

    const updateDropdownPosition = useCallback(() => {
      const trigger = triggerRef.current;
      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();
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
        top: openAbove ? rect.top - gap - availableHeight : rect.bottom + gap,
        left: rect.left,
        width: rect.width,
        maxHeight: availableHeight,
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
        closeDropdown();
        triggerRef.current?.focus();
      },
      [closeDropdown, emitGuideAction, onChange]
    );

    const handleGlobalKeyDown = useCallback(
      (event: KeyboardEvent) => {
        const target = event.target;
        const isPickerEvent =
          target instanceof Node &&
          (containerRef.current?.contains(target) ||
            dropdownRef.current?.contains(target));

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
            closeDropdown();
            triggerRef.current?.focus();
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

    const handleTriggerClick = useCallback(() => {
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }, [closeDropdown, isOpen, openDropdown]);

    const handleTriggerKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (isOpen) {
            closeDropdown();
          } else {
            openDropdown();
          }
        } else if (event.key === 'ArrowDown' && !isOpen) {
          event.preventDefault();
          openDropdown();
        }
      },
      [closeDropdown, isOpen, openDropdown]
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
            setIsOpen(true);
            await new Promise((resolve) => window.setTimeout(resolve, 0));
          }
          return;
        }

        if (
          toStepId === 'open-widget-picker' ||
          toStepId === 'widget-library-docs'
        ) {
          setIsOpen(false);
          await new Promise((resolve) => window.setTimeout(resolve, 0));
        }
      },
      [value]
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
        setIsOpen(!value);
        return;
      }

      if (
        currentGuideStepId === 'open-widget-picker' ||
        currentGuideStepId === 'widget-library-docs'
      ) {
        setIsOpen(false);
      }
    }, [currentGuideStepId, value]);

    const displayValue =
      selectedWidget?.name || (value ? getWidgetName(value) : placeholder);
    const triggerClasses = `widget-picker-trigger${!value ? ' widget-picker-trigger--placeholder' : ''}`;
    const iconClasses = `widget-picker-icon${isOpen ? ' widget-picker-icon--open' : ''}`;

    
    let flatIndex = 0;

    return (
      <div ref={containerRef} className="widget-picker-container">
        <button
          ref={(element) => {
            triggerRef.current = element;
            if (!value) {
              registerEmptyPickerTriggerTarget(element);
            }
          }}
          type="button"
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          className={triggerClasses}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{displayValue}</span>
          <ChevronDown size={14} className={iconClasses} />
        </button>

        {isOpen &&
          createPortal(
            <div
              ref={(element) => {
                dropdownRef.current = element;
                registerWidgetPickerTarget(element);
              }}
              className="widget-picker-dropdown widget-picker-dropdown--floating"
              role="listbox"
              style={cssVars({
                '--widget-picker-floating-top': `${dropdownPosition.top}px`,
                '--widget-picker-floating-left': `${dropdownPosition.left}px`,
                '--widget-picker-floating-width': `${dropdownPosition.width}px`,
                '--widget-picker-floating-max-height': `${dropdownPosition.maxHeight}px`,
              })}
            >
              {Array.from(groupedWidgets.entries()).map(
                ([category, categoryWidgets]) => (
                  <div key={category}>
                    <div className="widget-picker-category">
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
                          key={widgetKey}
                          ref={(el) => {
                            itemRefs.current[currentIndex] = el;
                          }}
                          type="button"
                          onClick={() => handleSelect(widget)}
                          onMouseEnter={() => setFocusedIndex(currentIndex)}
                          className={`widget-picker-item${isFocused ? ' widget-picker-item--focused' : ''}${isSelected ? ' widget-picker-item--selected' : ''}`}
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
                )
              )}
            </div>,
            window.activeDocument.body
          )}
      </div>
    );
  }
);

WidgetPicker.displayName = 'WidgetPicker';
