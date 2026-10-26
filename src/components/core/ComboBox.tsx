import React from 'react';
import { createPortal } from 'react-dom';
import { t } from '../../lang/helpers';
import { shareCaptureExcludeProps } from '../../services/share/brandedCapture';
import { cssVars } from '../../styles/inlineStylePolicy';
import { Check, ChevronDown, Plus, X } from '../shared/icons/ObsidianIcon';
import { anchoredMenuPortalRoot } from '../shared/menus/useAnchoredMenuPosition';
import { useComboBox, type ComboBoxProps } from './combobox/useComboBox';
import type { ComboBoxItem } from './combobox/comboBoxOptions';

type ComboBoxModel = ReturnType<typeof useComboBox>;

const preventFocusLoss = (event: React.MouseEvent) => event.preventDefault();

function ComboBoxChips({
  values,
  disabled,
  getOptionLabel,
  remove,
}: {
  values: readonly string[];
  disabled: boolean;
  getOptionLabel: (value: string) => string;
  remove: (value: string) => void;
}) {
  return (
    <>
      {values.map((value) => (
        <span key={value} className="selected-item">
          <span className="journalit-combobox-chip-label">
            {getOptionLabel(value)}
          </span>
          <button
            type="button"
            className="remove-button journalit-combobox-remove-button"
            disabled={disabled}
            onMouseDown={preventFocusLoss}
            onClick={() => remove(value)}
            {...shareCaptureExcludeProps}
          >
            <X size={12} aria-hidden="true" />
            
            <span className="journalit-sr-only">
              {t('combobox.aria.remove-item', {
                item: getOptionLabel(value),
              })}
            </span>
          </button>
        </span>
      ))}
    </>
  );
}

function ComboBoxOptionIcon({
  item,
  selected,
}: {
  item: ComboBoxItem;
  selected: ReadonlySet<string>;
}) {
  if (item.kind === 'create') return <Plus size={14} />;
  return selected.has(item.value) ? <Check size={14} /> : null;
}

function ComboBoxOption({
  item,
  index,
  model,
}: {
  item: ComboBoxItem;
  index: number;
  model: ComboBoxModel;
}) {
  const { listId, activeIndex, highlight, inputRef, select, selected } = model;
  const isCreate = item.kind === 'create';
  return (
    <li
      id={`${listId}-${index}`}
      role="option"
      aria-selected={activeIndex === index}
      className={`${isCreate ? 'combobox-add-option' : 'combobox-option'}${activeIndex === index ? ' highlighted' : ''}`}
      onPointerMove={(event) => {
        if (event.pointerType !== 'touch') highlight(item);
      }}
      onMouseDown={preventFocusLoss}
      onClick={(event) => {
        if (event.button !== 0) return;
        
        
        inputRef.current?.focus({ preventScroll: true });
        select(item);
      }}
    >
      <span className="journalit-combobox-option-icon" aria-hidden="true">
        <ComboBoxOptionIcon item={item} selected={selected} />
      </span>
      <span>
        {isCreate
          ? t('combobox.add-option', { value: item.value })
          : item.label}
      </span>
    </li>
  );
}

function ComboBoxListbox({
  model,
  ariaLabel,
  portalDropdown,
}: {
  model: ComboBoxModel;
  ariaLabel: string;
  portalDropdown: boolean;
}) {
  const { popupRef, listId, position, items } = model;
  return (
    <ul
      ref={popupRef}
      id={listId}
      role="listbox"
      aria-label={ariaLabel}
      data-journalit-escape-delegate="true"
      className={`journalit-combobox combobox-dropdown${portalDropdown ? ' combobox-dropdown--portal' : ''}`}
      style={cssVars({
        '--combobox-portal-top': `${position.top}px`,
        '--combobox-portal-left': `${position.left}px`,
        '--combobox-portal-width': `${position.width}px`,
        '--combobox-portal-max-height': `${position.maxHeight}px`,
      })}
      {...shareCaptureExcludeProps}
    >
      {items.length === 0 ? (
        <li role="presentation" className="journalit-combobox-empty">
          <span role="status">{t('filter.menu.no-matches')}</span>
        </li>
      ) : (
        items.map((item, index) => (
          <ComboBoxOption
            key={`${item.kind}:${item.value}`}
            item={item}
            index={index}
            model={model}
          />
        ))
      )}
    </ul>
  );
}

function ComboBoxClearButton({
  value,
  disabled,
  model,
}: {
  value: string;
  disabled: boolean;
  model: ComboBoxModel;
}) {
  return (
    <button
      type="button"
      className="remove-button journalit-combobox-clear"
      disabled={disabled}
      onMouseDown={preventFocusLoss}
      onClick={model.clear}
      {...shareCaptureExcludeProps}
    >
      <X size={12} aria-hidden="true" />
      <span className="journalit-sr-only">
        {t('combobox.aria.remove-item', {
          item: model.getOptionLabel(value),
        })}
      </span>
    </button>
  );
}

const describedById = (
  inputId: string,
  error: string | undefined,
  helperText: string | undefined
): string | undefined => {
  if (error) return `${inputId}-error`;
  return helperText ? `${inputId}-help` : undefined;
};

function ComboBoxMessage({
  inputId,
  error,
  helperText,
}: {
  inputId: string;
  error: string | undefined;
  helperText: string | undefined;
}) {
  if (error)
    return (
      <div id={`${inputId}-error`} role="alert" className="errorMessage">
        {error}
      </div>
    );
  return helperText ? <div id={`${inputId}-help`}>{helperText}</div> : null;
}


const selectionParts = (props: ComboBoxProps) =>
  props.isMulti
    ? {
        chips: props.value,
        clearValue: '',
        hasSelection: props.value.length > 0,
      }
    : {
        chips: [],
        clearValue: props.value,
        hasSelection: Boolean(props.value),
      };

export function ComboBox(props: ComboBoxProps) {
  const {
    label,
    labelAccessory,
    error,
    helperText,
    disabled = false,
    required = false,
    portalDropdown = true,
    placeholder = t('combobox.placeholder.default'),
  } = props;
  const model = useComboBox(props);
  const {
    inputId,
    listId,
    rootRef,
    fieldRef,
    inputRef,
    isOpen,
    activeId,
    inputValue,
    getOptionLabel,
    openList,
    remove,
    onKeyDown,
    changeQuery,
    toggleList,
  } = model;
  const { chips, clearValue, hasSelection } = selectionParts(props);

  const popup = isOpen ? (
    <ComboBoxListbox
      model={model}
      ariaLabel={label || placeholder}
      portalDropdown={portalDropdown}
    />
  ) : null;

  return (
    <div
      ref={rootRef}
      className="combobox-container journalit-combobox"
      data-combobox-type={props.isMulti ? 'multi' : 'single'}
      data-is-open={isOpen}
      data-disabled={disabled}
      data-invalid={Boolean(error)}
    >
      {label && (
        <label htmlFor={inputId}>
          <span>{label}</span>
          {labelAccessory}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      <div
        ref={fieldRef}
        className="input-container"
        data-has-clear={Boolean(clearValue)}
        {...(props.isMulti ? {} : shareCaptureExcludeProps)}
      >
        <ComboBoxChips
          values={chips}
          disabled={disabled}
          getOptionLabel={getOptionLabel}
          remove={remove}
        />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          className="combobox-input"
          value={inputValue}
          
          placeholder={props.isMulti && hasSelection ? undefined : placeholder}
          disabled={disabled}
          autoComplete="off"
          aria-label={label ? undefined : placeholder}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls={isOpen ? listId : undefined}
          aria-activedescendant={activeId}
          aria-invalid={Boolean(error)}
          aria-required={required}
          aria-describedby={describedById(inputId, error, helperText)}
          onFocus={openList}
          onClick={openList}
          onKeyDown={onKeyDown}
          onChange={(event) => changeQuery(event.target.value)}
          {...shareCaptureExcludeProps}
        />
        {clearValue && (
          <ComboBoxClearButton
            value={clearValue}
            disabled={disabled}
            model={model}
          />
        )}
        <button
          type="button"
          className="journalit-combobox-chevron"
          
          
          tabIndex={-1}
          aria-hidden="true"
          disabled={disabled}
          onMouseDown={preventFocusLoss}
          onClick={toggleList}
          {...shareCaptureExcludeProps}
        >
          <ChevronDown size={14} aria-hidden="true" />
        </button>
        {portalDropdown && popup
          ? createPortal(popup, anchoredMenuPortalRoot(fieldRef.current))
          : popup}
      </div>
      <ComboBoxMessage
        inputId={inputId}
        error={error}
        helperText={helperText}
      />
    </div>
  );
}
