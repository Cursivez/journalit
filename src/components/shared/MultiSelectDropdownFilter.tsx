import React, { useCallback, useMemo, useRef, useState } from 'react';
import { usePopupDismiss } from './menus/usePopupDismiss';
import { FilterButton } from './FilterButton';
import { ChevronDown, type ObsidianIconComponent } from './icons/ObsidianIcon';

interface MultiSelectDropdownOption {
  value: string;
  label: string;
  
  detail?: string;
}

const identityDropdownValue = (value: string): string => value;

interface MultiSelectDropdownFilterProps {
  options: MultiSelectDropdownOption[];
  selectedValues: string[];
  summary: string;
  emptyMessage: string;
  onChange: (values: string[]) => void | Promise<void>;
  classNamePrefix: string;
  ariaLabel?: string;
  selectAllLabel?: string;
  showSelectAll?: boolean;
  icon?: ObsidianIconComponent;
  triggerVariant?: 'summary' | 'filter-button';
  activeFilterCount?: number;
  disabled?: boolean;
  header?: {
    title: string;
    resetLabel: string;
    onReset: () => void;
  };
  normalizeValue?: (value: string) => string;
}

const MultiSelectDropdownTrigger: React.FC<{
  variant: 'summary' | 'filter-button';
  activeFilterCount: number;
  isOpen: boolean;
  label: string;
  summary: string;
  classNamePrefix: string;
  disabled: boolean;
  icon: ObsidianIconComponent | undefined;
  onToggle: () => void;
}> = ({
  variant,
  activeFilterCount,
  isOpen,
  label,
  summary,
  classNamePrefix,
  disabled,
  icon: LeadingIcon,
  onToggle,
}) =>
  variant === 'filter-button' ? (
    <FilterButton
      activeFilterCount={activeFilterCount}
      ariaExpanded={isOpen}
      ariaHaspopup="true"
      ariaLabel={label}
      className={`${classNamePrefix}__trigger`}
      disabled={disabled}
      onClick={onToggle}
    />
  ) : (
    <button
      type="button"
      onClick={onToggle}
      className={`journalit-native-button journalit-multi-select-dropdown-filter__trigger ${classNamePrefix}__trigger clickable-icon`}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label={label}
      disabled={disabled}
    >
      {LeadingIcon && (
        <LeadingIcon
          size={14}
          className="journalit-home-filter-icon"
          aria-hidden="true"
        />
      )}
      <span className={`${classNamePrefix}__summary`}>{summary}</span>
      <ChevronDown
        size={14}
        className={`${classNamePrefix}__chevron${isOpen ? ` ${classNamePrefix}__chevron--open` : ''}`}
        aria-hidden="true"
      />
    </button>
  );

const MultiSelectDropdownOptionButton: React.FC<{
  classNamePrefix: string;
  modifierClassName: string;
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({
  classNamePrefix,
  modifierClassName,
  isSelected,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`journalit-native-button journalit-multi-select-dropdown-filter__option ${classNamePrefix}__option${modifierClassName}${isSelected ? ` ${classNamePrefix}__option--active` : ''}`}
    aria-pressed={isSelected}
  >
    <span
      className={`${classNamePrefix}__checkbox${isSelected ? ` ${classNamePrefix}__checkbox--checked` : ''}`}
      aria-hidden="true"
    >
      {isSelected ? '✓' : ''}
    </span>
    {children}
  </button>
);

const MultiSelectDropdownMenu: React.FC<{
  classNamePrefix: string;
  header: MultiSelectDropdownFilterProps['header'];
  options: MultiSelectDropdownOption[];
  emptyMessage: string;
  
  selectAllLabel: string | undefined;
  allSelected: boolean;
  onToggleAll: () => void;
  isSelected: (value: string) => boolean;
  onToggleValue: (value: string) => void;
}> = ({
  classNamePrefix,
  header,
  options,
  emptyMessage,
  selectAllLabel,
  allSelected,
  onToggleAll,
  isSelected,
  onToggleValue,
}) => (
  <div className={`${classNamePrefix}__menu`}>
    {header ? (
      <div className={`${classNamePrefix}__header`}>
        <span>{header.title}</span>
        <button
          className={`journalit-native-button journalit-multi-select-dropdown-filter__reset ${classNamePrefix}__reset`}
          type="button"
          onClick={header.onReset}
        >
          {header.resetLabel}
        </button>
      </div>
    ) : null}
    {options.length > 0 ? (
      <div className={`${classNamePrefix}__options`}>
        {selectAllLabel ? (
          <>
            <MultiSelectDropdownOptionButton
              classNamePrefix={classNamePrefix}
              modifierClassName={` ${classNamePrefix}__option--select-all`}
              isSelected={allSelected}
              onClick={onToggleAll}
            >
              <span>{selectAllLabel}</span>
            </MultiSelectDropdownOptionButton>
            <div className={`${classNamePrefix}__divider`} />
          </>
        ) : null}

        {options.map((option) => (
          <MultiSelectDropdownOptionButton
            key={option.value}
            classNamePrefix={classNamePrefix}
            modifierClassName=""
            isSelected={isSelected(option.value)}
            onClick={() => onToggleValue(option.value)}
          >
            <span className={`${classNamePrefix}__option-label`}>
              {option.label}
            </span>
            {option.detail ? (
              <span className={`${classNamePrefix}__option-detail`}>
                {option.detail}
              </span>
            ) : null}
          </MultiSelectDropdownOptionButton>
        ))}
      </div>
    ) : (
      <div className={`${classNamePrefix}__empty`}>{emptyMessage}</div>
    )}
  </div>
);

export const MultiSelectDropdownFilter: React.FC<MultiSelectDropdownFilterProps> =
  React.memo(
    ({
      options,
      selectedValues,
      summary,
      emptyMessage,
      onChange,
      classNamePrefix,
      ariaLabel,
      selectAllLabel,
      showSelectAll = false,
      icon: LeadingIcon,
      triggerVariant = 'summary',
      activeFilterCount = selectedValues.length,
      disabled = false,
      header,
      normalizeValue = identityDropdownValue,
    }) => {
      const [isOpen, setIsOpen] = useState(false);
      const dropdownRef = useRef<HTMLDivElement>(null);

      
      
      usePopupDismiss({
        isOpen,
        rootRef: dropdownRef,
        popupRef: dropdownRef,
        onDismiss: () => setIsOpen(false),
        onEscape: () => {
          setIsOpen(false);
          dropdownRef.current?.querySelector('button')?.focus();
        },
      });
      const selectedKeys = useMemo(
        () => new Set(selectedValues.map(normalizeValue)),
        [normalizeValue, selectedValues]
      );
      const allSelected =
        options.length > 0 &&
        options.every((option) =>
          selectedKeys.has(normalizeValue(option.value))
        );

      const toggleValue = useCallback(
        (value: string) => {
          const valueKey = normalizeValue(value);
          if (selectedKeys.has(valueKey)) {
            void onChange(
              selectedValues.filter(
                (selected) => normalizeValue(selected) !== valueKey
              )
            );
            return;
          }
          void onChange([...selectedValues, value]);
        },
        [normalizeValue, onChange, selectedKeys, selectedValues]
      );

      const toggleAll = useCallback(() => {
        if (allSelected) {
          void onChange([]);
          return;
        }
        void onChange(options.map((option) => option.value));
      }, [allSelected, onChange, options]);

      return (
        <div className={classNamePrefix} ref={dropdownRef}>
          <MultiSelectDropdownTrigger
            variant={triggerVariant}
            activeFilterCount={activeFilterCount}
            isOpen={isOpen}
            label={ariaLabel || summary}
            summary={summary}
            classNamePrefix={classNamePrefix}
            disabled={disabled}
            icon={LeadingIcon}
            onToggle={() => setIsOpen((prev) => !prev)}
          />

          {isOpen && (
            <MultiSelectDropdownMenu
              classNamePrefix={classNamePrefix}
              header={header}
              options={options}
              emptyMessage={emptyMessage}
              selectAllLabel={showSelectAll ? selectAllLabel : undefined}
              allSelected={allSelected}
              onToggleAll={toggleAll}
              isSelected={(value) => selectedKeys.has(normalizeValue(value))}
              onToggleValue={toggleValue}
            />
          )}
        </div>
      );
    }
  );

MultiSelectDropdownFilter.displayName = 'MultiSelectDropdownFilter';
