
export const comboboxCSS = `
.journalit-combobox.combobox-container {
  position: relative;
  width: 100%;
  min-width: 0;
  margin-bottom: 8px;
}

.journalit-combobox.combobox-container[data-is-open="true"] {
  z-index: 10;
}

.journalit-combobox .input-container {
position: relative;
display: flex;
flex-wrap: wrap;
align-items: center;
gap: 4px;
width: 100%;
min-height: var(--journalit-control-height);
box-sizing: border-box;

padding: 3px 26px 3px 8px;
border: 0;
border-radius: var(--journalit-control-radius);
outline: 1px solid transparent;
outline-offset: -1px;
background: var(--journalit-control-field-fill);
box-shadow: var(--journalit-control-field-ring);
cursor: text;
transition: outline-color 85ms ease-out, box-shadow 85ms ease-out;
}

.journalit-combobox .input-container:hover:not(:focus-within) {
  background: var(--journalit-control-field-fill-hover);
}

.journalit-combobox .input-container:focus-within {
  outline-color: var(--journalit-control-focus);
  box-shadow: none;
}

.journalit-combobox .combobox-input {
  
  flex: 1 1 24px;
  width: 0;
  min-width: 0;
  max-width: 100%;
  height: 20px;
  min-height: 20px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  font-family: var(--font-interface);
  font-size: var(--font-ui-small);
}

.journalit-combobox .combobox-input:focus {
  outline: none;
  box-shadow: none;
}

.journalit-combobox .combobox-input::placeholder {
  color: var(--text-faint);
}

.journalit-combobox .journalit-combobox-chevron {
  position: absolute;
  right: 4px;
  top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: var(--journalit-radius-sm);
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  cursor: pointer;
}

.journalit-combobox .journalit-combobox-chevron:hover {
  background: var(--background-modifier-hover);
}

.journalit-combobox[data-is-open="true"] .journalit-combobox-chevron {
  transform: rotate(180deg);
}

.journalit-combobox.combobox-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 2px;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--journalit-control-radius);
  background: var(--journalit-control-menu-fill);
  color: var(--text-normal);
  box-shadow: var(--shadow-s);
  max-height: 240px;
  overflow-y: auto;
  overscroll-behavior: contain;
  list-style: none;
  z-index: 100000;
}

.journalit-combobox.combobox-dropdown--portal {
  position: fixed;
  top: var(--combobox-portal-top);
  left: var(--combobox-portal-left);
  width: var(--combobox-portal-width);
  max-height: var(--combobox-portal-max-height);
}

.journalit-combobox .combobox-option,
.journalit-combobox .combobox-add-option {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  min-height: var(--journalit-control-height);
  box-sizing: border-box;
  margin: 0;
  padding: 0 8px;
  border-radius: var(--journalit-control-inner-radius);
  color: var(--text-normal);
  cursor: pointer;
  font-size: var(--font-ui-small);
  font-weight: var(--font-normal);
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.journalit-combobox .combobox-option .journalit-combobox-option-label {
  flex: 1 1 auto;
  min-width: 0;
}

.journalit-combobox .combobox-option.highlighted,
.journalit-combobox .combobox-add-option.highlighted {
  background: var(--journalit-control-overlay-hover);
}

.journalit-combobox .combobox-add-option {
  color: var(--text-accent);
}

.journalit-combobox .journalit-combobox-option-icon {
  display: flex;
  flex: 0 0 14px;
  color: var(--text-accent);
}

.journalit-combobox .journalit-combobox-empty {
  padding: 12px;
  margin: 0;
  text-align: center;
  font-size: var(--font-ui-small);
  color: var(--text-muted);
  list-style: none;
}

.journalit-combobox .selected-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 0 4px 0 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-secondary);
  color: var(--text-normal);
  font-size: var(--font-ui-smaller);
  line-height: 1.4;
}

.journalit-combobox .journalit-combobox-chip-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.journalit-combobox .remove-button {
  display: inline-flex;
  flex: 0 0 20px;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  min-height: 20px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 3px;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  cursor: pointer;
}

.journalit-combobox .remove-button:hover {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-combobox .input-container[data-has-clear="true"] {
  padding-right: 54px;
}

.journalit-combobox .journalit-combobox-clear {
  position: absolute;
  right: 28px;
  top: 4px;
}

.journalit-combobox .remove-button:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 1px;
}

.journalit-combobox[data-disabled="true"] .input-container {
  opacity: 0.6;
  cursor: not-allowed;
}

.journalit-combobox[data-invalid="true"] .input-container,
.journalit-combobox[data-invalid="true"] .input-container:focus-within {
  outline-color: var(--text-error);
  box-shadow: none;
}

.journalit-combobox .journalit-combobox-favorite {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin: 0 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-faint);
  cursor: pointer;
}

.journalit-combobox .journalit-combobox-favorite:hover,
.journalit-combobox .journalit-combobox-favorite:focus-visible {
  color: var(--text-normal);
}

.journalit-combobox .journalit-combobox-favorite.is-favorite {
  color: var(--text-accent);
}

.journalit-combobox .journalit-combobox-favorite.is-favorite svg {
  fill: currentColor;
}

.journalit-combobox .journalit-combobox-favorite--chip {
  width: 16px;
  height: 16px;
  margin: 0;
}
`;
