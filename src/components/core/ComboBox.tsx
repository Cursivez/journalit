import React from 'react';
import { createPortal } from 'react-dom';
import { t } from '../../lang/helpers';
import { shareCaptureExcludeProps } from '../../services/share/brandedCapture';
import { cssVars } from '../../styles/inlineStylePolicy';
import { Check, ChevronDown, Plus, X } from '../shared/icons/ObsidianIcon';
import { anchoredMenuPortalRoot } from '../shared/menus/useAnchoredMenuPosition';
import { useComboBox, type ComboBoxProps } from './combobox/useComboBox';

export function ComboBox(props: ComboBoxProps) {
  const {
    label,
    labelAccessory,
    error,
    helperText,
    disabled = false,
    required = false,
    portalDropdown = true,
    selectedItemsPlacement = 'before-input',
    placeholder = t('combobox.placeholder.default'),
  } = props;
  const {
    inputId,
    listId,
    rootRef,
    fieldRef,
    inputRef,
    popupRef,
    isOpen,
    selected,
    items,
    activeIndex,
    activeId,
    inputValue,
    position,
    getOptionLabel,
    openList,
    select,
    remove,
    onKeyDown,
    changeQuery,
    clear,
    toggleList,
    highlight,
  } = useComboBox(props);

  const chipItems =
    props.isMulti && props.value.length > 0
      ? props.value.map((value) => (
          <span key={value} className="selected-item">
            <span className="journalit-combobox-chip-label">
              {getOptionLabel(value)}
            </span>
            <button
              type="button"
              className="remove-button journalit-combobox-remove-button"
              aria-label={t('combobox.aria.remove-item', {
                item: getOptionLabel(value),
              })}
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => remove(value)}
              {...shareCaptureExcludeProps}
            >
              <X size={12} aria-hidden="true" />
            </button>
          </span>
        ))
      : null;
  const chips = chipItems ? (
    <div className="journalit-combobox-selected-items">{chipItems}</div>
  ) : null;

  const popup = isOpen ? (
    <ul
      ref={popupRef}
      id={listId}
      role="listbox"
      aria-label={label || placeholder}
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
          <li
            id={`${listId}-${index}`}
            key={`${item.kind}:${item.value}`}
            role="option"
            aria-selected={activeIndex === index}
            className={`${item.kind === 'create' ? 'combobox-add-option' : 'combobox-option'}${activeIndex === index ? ' highlighted' : ''}`}
            onPointerMove={(event) => {
              if (event.pointerType !== 'touch') highlight(item);
            }}
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              if (event.button !== 0) return;
              
              
              inputRef.current?.focus({ preventScroll: true });
              select(item);
            }}
          >
            <span className="journalit-combobox-option-icon" aria-hidden="true">
              {item.kind === 'create' ? (
                <Plus size={14} />
              ) : selected.has(item.value) ? (
                <Check size={14} />
              ) : null}
            </span>
            <span>
              {item.kind === 'create'
                ? t('combobox.add-option', { value: item.value })
                : item.label}
            </span>
          </li>
        ))
      )}
    </ul>
  ) : null;

  return (
    <div
      ref={rootRef}
      className="combobox-container journalit-combobox"
      data-combobox-type={props.isMulti ? 'multi' : 'single'}
      data-is-open={isOpen}
      data-disabled={disabled}
      data-invalid={Boolean(error)}
      data-selected-items-placement={selectedItemsPlacement}
    >
      {label && (
        <label htmlFor={inputId}>
          <span>{label}</span>
          {labelAccessory}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      {selectedItemsPlacement === 'before-input' ? chips : null}
      <div
        ref={fieldRef}
        className="input-container"
        data-has-clear={!props.isMulti && Boolean(props.value)}
        {...(selectedItemsPlacement === 'inside-input'
          ? {}
          : shareCaptureExcludeProps)}
      >
        {selectedItemsPlacement === 'inside-input' ? chipItems : null}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          className="combobox-input"
          value={inputValue}
          placeholder={
            props.isMulti && props.value.length > 0 ? undefined : placeholder
          }
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
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-help`
                : undefined
          }
          onFocus={openList}
          onClick={openList}
          onKeyDown={onKeyDown}
          onChange={(event) => changeQuery(event.target.value)}
          {...shareCaptureExcludeProps}
        />
        {!props.isMulti && props.value && (
          <button
            type="button"
            className="remove-button journalit-combobox-clear"
            disabled={disabled}
            aria-label={t('combobox.aria.remove-item', {
              item: getOptionLabel(props.value),
            })}
            onMouseDown={(event) => event.preventDefault()}
            onClick={clear}
            {...shareCaptureExcludeProps}
          >
            <X size={12} aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          className="journalit-combobox-chevron"
          tabIndex={-1}
          aria-label={label || placeholder}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listId : undefined}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={toggleList}
          {...shareCaptureExcludeProps}
        >
          <ChevronDown size={14} aria-hidden="true" />
        </button>
        {portalDropdown
          ? popup &&
            createPortal(popup, anchoredMenuPortalRoot(fieldRef.current))
          : popup}
      </div>
      {selectedItemsPlacement === 'after-input' ? chips : null}
      {error ? (
        <div id={`${inputId}-error`} role="alert" className="errorMessage">
          {error}
        </div>
      ) : helperText ? (
        <div id={`${inputId}-help`}>{helperText}</div>
      ) : null}
    </div>
  );
}
