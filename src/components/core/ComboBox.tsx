

import React, {
  useState,
  useEffect,
  useId,
  useRef,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';
import {
  ADD_OPTION_PREFIX,
  getFilteredComboBoxOptions,
  getSelectedOptionValue,
  getSelectedValues,
  isAddOption,
  normalizeComboBoxOptions,
  shouldSaveCustomOption,
  shouldShowAddOption,
} from './combobox/comboBoxUtils';


const CLASS_NAMES = {
  COMBOBOX_CONTAINER: 'combobox-container',
  INPUT_CONTAINER: 'input-container',
  INPUT: 'combobox-input',
  DROPDOWN: 'combobox-dropdown',
  OPTION: 'combobox-option',
  OPTION_HIGHLIGHTED: 'highlighted',
  ADD_OPTION: 'combobox-add-option',
  SELECTED_ITEM: 'selected-item',
  REMOVE_BUTTON: 'remove-button',
  REMOVE_BUTTON_GLYPH: 'remove-button-glyph',
};

interface ComboBoxProps {
  
  options: string[];

  
  value: string | string[];

  
  onChange: (value: string | string[]) => void;

  
  allowCreate?: boolean;

  
  isMulti?: boolean;

  
  label?: string;

  
  placeholder?: string;

  
  error?: string;

  
  helperText?: string;

  
  optionType?: string;

  
  onSaveOption?: (option: string) => void;

  
  required?: boolean;

  
  portalDropdown?: boolean;
}


function useComboBoxModel({
  options,
  value,
  onChange,
  allowCreate = false,
  isMulti = false,
  optionType,
  onSaveOption,
  portalDropdown = false,
}: ComboBoxProps) {
  
  const uniqueId = useId();
  const inputId = `combobox-${uniqueId}`;
  const listId = `combobox-list-${uniqueId}`;
  const helperId = `helper-${uniqueId}`;
  const errorId = `error-${uniqueId}`;

  
  const [inputValue, setInputValue] = useState(() => {
    
    if (isMulti) return '';
    return value !== undefined && value !== null ? String(value) : '';
  });
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  
  const comboRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [portalDropdownRect, setPortalDropdownRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const updatePortalDropdownRect = useCallback(() => {
    if (!inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      setPortalDropdownRect(null);
      return;
    }

    setPortalDropdownRect({
      top: rect.bottom,
      left: rect.left,
      width: rect.width,
    });
  }, []);
  const updatePortalDropdownRectRef = useRef(updatePortalDropdownRect);

  useLayoutEffect(() => {
    updatePortalDropdownRectRef.current = updatePortalDropdownRect;
  }, [updatePortalDropdownRect]);

  
  const isSelectingOption = useRef(false);
  const isHandlingRemove = useRef(false);

  
  const normalizedOptions = useMemo(
    () => normalizeComboBoxOptions(options),
    [options]
  );

  
  const selectedValues = getSelectedValues(value, isMulti);

  
  

  
  
  
  const displayInputValue = useMemo(() => {
    if (!isMulti && !isOpen && value !== undefined && value !== null) {
      return typeof value === 'string' ? value : String(value);
    }
    return inputValue;
  }, [isMulti, isOpen, value, inputValue]);

  
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      
      setInputValue(e.target.value);
      
      setIsOpen(true);
      
      setHighlightedIndex(-1);
      
    },
    []
  );

  
  const handleSelect = useCallback(
    (selected: string) => {
      
      const newValue = getSelectedOptionValue(selected);
      const trimmedValue = newValue.trim();

      
      if (trimmedValue === '') return;

      if (isMulti) {
        
        const currentValues = Array.isArray(value)
          ? [...(value as string[])]
          : [];

        if (!currentValues.includes(trimmedValue)) {
          
          const updatedValues = [...currentValues, trimmedValue];
          onChange(updatedValues);

          
          if (
            onSaveOption &&
            isAddOption(selected) &&
            shouldSaveCustomOption(optionType, trimmedValue)
          ) {
            onSaveOption(trimmedValue);
          }

          
          if (isAddOption(selected) || normalizedOptions.includes(selected)) {
            setInputValue('');
          }
        }

        
        setIsOpen(true);

        
        if (inputRef.current) {
          setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
          }, 0);
        }
      } else {
        
        onChange(trimmedValue);

        
        if (
          onSaveOption &&
          isAddOption(selected) &&
          shouldSaveCustomOption(optionType, trimmedValue)
        ) {
          onSaveOption(trimmedValue);
        }

        setInputValue(trimmedValue);
        
        setIsOpen(false);
      }

      
      setHighlightedIndex(-1);
    },
    [isMulti, value, onChange, onSaveOption, optionType, normalizedOptions]
  );

  
  useEffect(() => {
    const handleOptionSelection = (e: MouseEvent) => {
      
      const target = e.target as HTMLElement;
      const isOption = target?.closest?.('[role="option"]');

      const isInsideCombo = comboRef.current?.contains(target);
      const isInsideDropdown = dropdownRef.current?.contains(target);

      if (isOption && (isInsideCombo || isInsideDropdown)) {
        
        isSelectingOption.current = true;

        
        const optionText = isOption.textContent?.trim();
        if (!optionText) return;

        
        const selection = isOption.hasAttribute('data-add-option')
          ? `${ADD_OPTION_PREFIX}${inputValue}`
          : optionText;

        
        const actualValue = isAddOption(selection) ? selection : optionText;

        
        handleSelect(actualValue);

        
        setTimeout(() => {
          isSelectingOption.current = false;

          if (!isMulti) {
            setIsOpen(false);
          } else {
            
            setIsOpen(true);
            if (inputRef.current) {
              inputRef.current.focus();
              setInputValue('');
            }
          }
        }, 50);
      }
    };

    
    document.addEventListener('mousedown', handleOptionSelection, true);

    return () => {
      document.removeEventListener('mousedown', handleOptionSelection, true);
    };
  }, [isMulti, inputValue, handleSelect]);

  
  
  const handleRemove = useCallback(
    (val: string) => {
      if (!isMulti) return;

      
      isHandlingRemove.current = true;

      
      const currentValues = Array.isArray(value)
        ? [...(value as string[])]
        : [];
      const updatedValues = currentValues.filter((v) => v !== val);

      
      onChange(updatedValues);

      
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
        isHandlingRemove.current = false;
      }, 50);
    },
    [isMulti, value, onChange]
  );

  
  useLayoutEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      
      if (isHandlingRemove.current) return;

      
      const target = e.target as HTMLElement;
      const isClickingOption = target?.closest?.('[role="option"]');
      const isClickingRemoveButton = target?.closest?.(
        '[data-remove-button="true"]'
      );
      const isClickingInsideCombo = comboRef.current?.contains(target);
      const isClickingInsideDropdown = dropdownRef.current?.contains(target);

      
      if (!isClickingInsideCombo && !isClickingInsideDropdown) {
        setIsOpen(false);
        return;
      }

      
      if (isClickingOption) {
        e.stopPropagation();
        return;
      }

      
      if (isClickingRemoveButton) {
        e.preventDefault();
        e.stopPropagation();

        
        isHandlingRemove.current = true;

        
        const removeLabel =
          isClickingRemoveButton.getAttribute('aria-label') || '';
        const valueToRemove = removeLabel.replace('Remove ', '');

        if (valueToRemove) {
          
          const currentValues = Array.isArray(value)
            ? [...(value as string[])]
            : [];
          const updatedValues = currentValues.filter(
            (v) => v !== valueToRemove
          );

          
          onChange(updatedValues);

          
          setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
            isHandlingRemove.current = false;
          }, 50);
        }
      }
    };

    
    document.addEventListener('mousedown', handleOutsideClick, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
    };
  }, [isOpen, value, onChange]);

  useLayoutEffect(() => {
    if (!isOpen || !portalDropdown || !inputRef.current) {
      setPortalDropdownRect(null);
      return;
    }

    const updateCurrentPortalDropdownRect = () => {
      updatePortalDropdownRectRef.current();
    };

    updateCurrentPortalDropdownRect();
    window.addEventListener('resize', updateCurrentPortalDropdownRect);
    window.addEventListener('scroll', updateCurrentPortalDropdownRect, true);

    return () => {
      window.removeEventListener('resize', updateCurrentPortalDropdownRect);
      window.removeEventListener(
        'scroll',
        updateCurrentPortalDropdownRect,
        true
      );
    };
  }, [isOpen, portalDropdown]);

  
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey, true);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey, true);
    };
  }, [isOpen]);

  
  useEffect(() => {
    if (!isOpen) return;

    const windowBlurHandler = () => {
      setIsOpen(false);
    };

    window.addEventListener('blur', windowBlurHandler);

    return () => {
      window.removeEventListener('blur', windowBlurHandler);
    };
  }, [isOpen]);

  
  const filteredOptions = useMemo(
    () =>
      getFilteredComboBoxOptions({
        normalizedOptions,
        inputValue,
        isMulti,
        value,
      }),
    [normalizedOptions, inputValue, isMulti, value]
  );

  
  const showAddOption = useMemo(
    () =>
      shouldShowAddOption({
        allowCreate,
        inputValue,
        normalizedOptions,
      }),
    [allowCreate, inputValue, normalizedOptions]
  );

  
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const optionCount = filteredOptions.length + (showAddOption ? 1 : 0);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex((prev) => (prev + 1) % optionCount);
          break;

        case 'ArrowUp':
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex((prev) => (prev - 1 + optionCount) % optionCount);
          break;

        case 'Enter':
          e.preventDefault();
          if (isOpen) {
            if (
              highlightedIndex >= 0 &&
              highlightedIndex < filteredOptions.length
            ) {
              
              handleSelect(filteredOptions[highlightedIndex]);
            } else if (
              showAddOption &&
              highlightedIndex === filteredOptions.length
            ) {
              
              handleSelect(`${ADD_OPTION_PREFIX}${inputValue}`);
            } else if (allowCreate && inputValue.trim() !== '') {
              
              
              handleSelect(`${ADD_OPTION_PREFIX}${inputValue}`);
            }
          } else {
            setIsOpen(true);
          }
          break;

        case 'Tab':
          
          if (inputValue.trim() !== '' && filteredOptions.length > 0) {
            
            const matchedOption = filteredOptions.find((option) =>
              option.toLowerCase().startsWith(inputValue.toLowerCase())
            );

            if (matchedOption) {
              e.preventDefault(); 
              handleSelect(matchedOption);
            } else {
              
              handleSelect(filteredOptions[0]);
            }
          } else {
            
            
            if (!isMulti) {
              setIsOpen(false);
            }
          }
          break;

        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [
      filteredOptions,
      showAddOption,
      isOpen,
      highlightedIndex,
      allowCreate,
      inputValue,
      isMulti,
      handleSelect,
    ]
  );

  

  
  const renderedOptions = React.useMemo(() => {
    return filteredOptions.map((option, index) => (
      <li
        id={`option-${index}`}
        key={option}
        role="option"
        aria-selected={highlightedIndex === index}
        className={`${CLASS_NAMES.OPTION} ${highlightedIndex === index ? CLASS_NAMES.OPTION_HIGHLIGHTED : ''}`}
        onMouseEnter={() => setHighlightedIndex(index)}
      >
        {option}
      </li>
    ));
  }, [filteredOptions, highlightedIndex]);

  
  const renderedAddOption = React.useMemo(() => {
    if (!showAddOption) return null;

    return (
      <li
        id={`option-${filteredOptions.length}`}
        role="option"
        aria-selected={highlightedIndex === filteredOptions.length}
        data-add-option="true"
        className={`${CLASS_NAMES.ADD_OPTION} ${highlightedIndex === filteredOptions.length ? CLASS_NAMES.OPTION_HIGHLIGHTED : ''}`}
        onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
      >
        {t('combobox.add-option', { value: inputValue })}
      </li>
    );
  }, [showAddOption, inputValue, filteredOptions.length, highlightedIndex]);

  
  const renderedSelectedItems = React.useMemo(() => {
    if (!isMulti) return null;

    return (
      <div>
        {(Array.isArray(value) ? (value as string[]) : []).map((val) => (
          <span key={val} className={CLASS_NAMES.SELECTED_ITEM}>
            {val}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isHandlingRemove.current) return;
                handleRemove(val);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isHandlingRemove.current) return;
                handleRemove(val);
              }}
              aria-label={t('combobox.aria.remove-item', { item: val })}
              data-remove-button="true"
              className={CLASS_NAMES.REMOVE_BUTTON}
            >
              <span
                aria-hidden="true"
                className={CLASS_NAMES.REMOVE_BUTTON_GLYPH}
              />
            </button>
          </span>
        ))}
      </div>
    );
  }, [isMulti, value, handleRemove]);

  
  const handleInputFocus = React.useCallback(() => {
    setIsOpen(true);
    
    if (!isMulti) {
      setInputValue('');
    }
  }, [isMulti]);

  const handleInputBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (isSelectingOption.current || isHandlingRemove.current) return;

      const isRemoveButton =
        e.relatedTarget &&
        (e.relatedTarget as HTMLElement)?.hasAttribute?.('data-remove-button');
      if (isRemoveButton) return;

      if (!comboRef.current?.contains(e.relatedTarget as Node)) {
        setTimeout(() => {
          if (!isSelectingOption.current && !isHandlingRemove.current) {
            setIsOpen(false);
          }
        }, 100);
      }
    },
    []
  );

  const handleInputClick = React.useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (portalDropdown) {
        updatePortalDropdownRect();
      }

      setIsOpen(true);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [portalDropdown, updatePortalDropdownRect]
  );

  const handleInputMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      if (isOpen) {
        e.preventDefault();
      }
    },
    [isOpen]
  );

  const dropdownList =
    isOpen && (filteredOptions.length > 0 || showAddOption) ? (
      <ul
        ref={dropdownRef}
        id={listId}
        role="listbox"
        data-dropdown-visible="true"
        className={`${CLASS_NAMES.DROPDOWN} ${portalDropdown ? 'journalit-combobox combobox-dropdown--portal' : ''}`}
        style={cssVars({
          '--combobox-portal-top': portalDropdownRect
            ? `${portalDropdownRect.top}px`
            : undefined,
          '--combobox-portal-left': portalDropdownRect
            ? `${portalDropdownRect.left}px`
            : undefined,
          '--combobox-portal-width': portalDropdownRect
            ? `${portalDropdownRect.width}px`
            : undefined,
        })}
      >
        {renderedOptions}
        {renderedAddOption}
      </ul>
    ) : null;

  return {
    comboRef,
    inputRef,
    inputId,
    listId,
    helperId,
    errorId,
    isOpen,
    highlightedIndex,
    portalDropdownRect,
    selectedValues,
    displayInputValue,
    renderedSelectedItems,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleInputMouseDown,
    handleInputClick,
    handleKeyDown,
    dropdownList,
  };
}

export const ComboBox: React.FC<ComboBoxProps> = (props) => {
  const {
    label,
    required = false,
    isMulti = false,
    placeholder = t('combobox.placeholder.default'),
    error,
    helperText,
    portalDropdown = false,
  } = props;
  const {
    comboRef,
    inputRef,
    inputId,
    listId,
    helperId,
    errorId,
    isOpen,
    highlightedIndex,
    portalDropdownRect,
    selectedValues,
    displayInputValue,
    renderedSelectedItems,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleInputMouseDown,
    handleInputClick,
    handleKeyDown,
    dropdownList,
  } = useComboBoxModel(props);

  return (
    <div
      ref={comboRef}
      data-combobox-type={isMulti ? 'multi' : 'single'}
      data-is-open={isOpen ? 'true' : 'false'}
      className={`${CLASS_NAMES.COMBOBOX_CONTAINER} journalit-combobox`}
    >
      {label && (
        <label htmlFor={inputId}>
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      
      {renderedSelectedItems}

      
      <div className={CLASS_NAMES.INPUT_CONTAINER}>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={displayInputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onMouseDown={handleInputMouseDown}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={isMulti && selectedValues.length > 0 ? '' : placeholder}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={isOpen ? listId : undefined}
          aria-activedescendant={
            highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined
          }
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          role="combobox"
          className={CLASS_NAMES.INPUT}
        />

        
        {portalDropdown && portalDropdownRect
          ? createPortal(dropdownList, document.body)
          : dropdownList}
      </div>

      
      {error && (
        <div id={errorId} role="alert" className="errorMessage">
          {error}
        </div>
      )}

      
      {!error && helperText && <div id={helperId}>{helperText}</div>}
    </div>
  );
};


ComboBox.displayName = 'ComboBox';
