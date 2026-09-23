import React, {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cssVars } from '../../styles/inlineStylePolicy';
import { ChevronDown } from './icons/ObsidianIcon';
import { useAnchoredMenuPosition } from './menus/useAnchoredMenuPosition';

interface DropdownSelectOption {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  value: string;
  options: DropdownSelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  
  ariaLabelledBy?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  leadingContent?: React.ReactNode;
  triggerRef?: React.Ref<HTMLButtonElement>;
  menuWidth?: 'trigger' | 'content';
}

export function DropdownSelect({
  value,
  options,
  onChange,
  ariaLabel,
  ariaLabelledBy,
  placeholder,
  disabled = false,
  className,
  leadingContent,
  triggerRef,
  menuWidth = 'trigger',
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const internalTriggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const typeaheadBufferRef = useRef('');
  const lastTypeaheadAtRef = useRef(0);
  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label,
    [options, value]
  );
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );

  const setTriggerRef = useCallback(
    (element: HTMLButtonElement | null) => {
      internalTriggerRef.current = element;
      if (typeof triggerRef === 'function') triggerRef(element);
      else if (triggerRef) triggerRef.current = element;
    },
    [triggerRef]
  );

  const closeMenu = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => internalTriggerRef.current?.focus());
    }
  }, []);

  const openMenu = useCallback(
    (index = selectedIndex) => {
      typeaheadBufferRef.current = '';
      lastTypeaheadAtRef.current = 0;
      setActiveIndex(index);
      setIsOpen(true);
    },
    [selectedIndex]
  );
  const menuPosition = useAnchoredMenuPosition({
    isOpen,
    triggerRef: internalTriggerRef,
    menuRef,
    width: menuWidth,
    minWidth: menuWidth === 'trigger' ? 220 : undefined,
    maxHeight: 220,
  });

  const selectOption = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option) return;
      if (option.value !== value) onChange(option.value);
      closeMenu(true);
    },
    [closeMenu, onChange, options, value]
  );
  const closeMenuFromOutsidePress = useEffectEvent(() => closeMenu());

  useEffect(() => {
    if (!isOpen) return;
    const ownerDocument = rootRef.current?.ownerDocument;
    const ownerWindow = ownerDocument?.defaultView;
    if (!ownerDocument || !ownerWindow) return;
    const closeOnOutsidePress = (event: MouseEvent) => {
      const target = event.target;
      const NodeConstructor =
        rootRef.current?.ownerDocument.defaultView?.Node ?? Node;
      if (
        rootRef.current &&
        (!(target instanceof NodeConstructor) ||
          (!rootRef.current.contains(target) &&
            !menuRef.current?.contains(target)))
      ) {
        closeMenuFromOutsidePress();
      }
    };
    const closeOnWindowBlur = () => closeMenuFromOutsidePress();
    ownerDocument.addEventListener('mousedown', closeOnOutsidePress);
    ownerWindow.addEventListener('blur', closeOnWindowBlur);
    return () => {
      ownerDocument.removeEventListener('mousedown', closeOnOutsidePress);
      ownerWindow.removeEventListener('blur', closeOnWindowBlur);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    window.requestAnimationFrame(() =>
      optionRefs.current[activeIndex]?.focus()
    );
  }, [activeIndex, isOpen]);

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex(
        (current) => (current + direction + options.length) % options.length
      );
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOption(activeIndex);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeMenu(true);
    } else if (event.key === 'Tab') {
      internalTriggerRef.current?.focus();
      setIsOpen(false);
    } else if (event.key.length === 1) {
      const now = Date.now();
      const character = event.key.toLocaleLowerCase();
      typeaheadBufferRef.current =
        now - lastTypeaheadAtRef.current > 500
          ? character
          : `${typeaheadBufferRef.current}${character}`;
      lastTypeaheadAtRef.current = now;
      const repeatedCharacter = [...typeaheadBufferRef.current].every(
        (value) => value === character
      );
      const search = repeatedCharacter ? character : typeaheadBufferRef.current;
      const startIndex = repeatedCharacter ? activeIndex + 1 : 0;
      const matchOffset = [...options, ...options]
        .slice(startIndex, startIndex + options.length)
        .findIndex((option) =>
          option.label.toLocaleLowerCase().startsWith(search)
        );
      const match =
        matchOffset < 0 ? -1 : (startIndex + matchOffset) % options.length;
      if (match >= 0) {
        event.preventDefault();
        setActiveIndex(match);
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className={`journalit-dropdown-select${className ? ` ${className}` : ''}`}
    >
      <button
        ref={setTriggerRef}
        type="button"
        className="journalit-dropdown-select__trigger"
        {...(ariaLabelledBy
          ? { 'aria-labelledby': ariaLabelledBy }
          : { 'aria-label': ariaLabel })}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            openMenu(
              event.key === 'ArrowDown'
                ? selectedIndex
                : Math.max(0, selectedIndex - 1)
            );
          }
        }}
      >
        {leadingContent}
        <span className="journalit-dropdown-select__summary">
          {selectedLabel ?? placeholder ?? ariaLabel}
        </span>
        <ChevronDown
          size={14}
          className={`journalit-dropdown-select__chevron${isOpen ? ' is-open' : ''}`}
          aria-hidden="true"
        />
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="journalit-anchored-menu journalit-dropdown-select__menu"
            role="listbox"
            {...(ariaLabelledBy
              ? { 'aria-labelledby': ariaLabelledBy }
              : { 'aria-label': ariaLabel })}
            onKeyDown={handleMenuKeyDown}
            style={cssVars({
              '--journalit-anchored-menu-top': `${menuPosition.top}px`,
              '--journalit-anchored-menu-left': `${menuPosition.left}px`,
              '--journalit-anchored-menu-width':
                menuWidth === 'content' && menuPosition.width === 0
                  ? 'max-content'
                  : `${menuPosition.width}px`,
              '--journalit-anchored-menu-max-height': `${menuPosition.maxHeight}px`,
            })}
          >
            {options.map((option, index) => {
              const selected = option.value === value;
              return (
                <button
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  key={option.value}
                  type="button"
                  className={`journalit-dropdown-select__option${selected ? ' is-selected' : ''}`}
                  role="option"
                  
                  
                  aria-label={option.label}
                  aria-selected={selected}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(index)}
                >
                  <span
                    className={`journalit-dropdown-select__check${selected ? ' is-checked' : ''}`}
                    aria-hidden="true"
                  >
                    {selected ? '✓' : ''}
                  </span>
                  <span className="journalit-dropdown-select__option-label">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>,
          internalTriggerRef.current?.ownerDocument.body ??
            window.activeDocument.body
        )}
    </div>
  );
}
