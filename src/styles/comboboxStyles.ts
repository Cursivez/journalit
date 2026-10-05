
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
  min-height: 36px;
  box-sizing: border-box;
  padding: 4px 30px 4px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--input-radius, 6px);
  background: var(--background-primary);
  cursor: text;
}

.journalit-combobox .input-container:hover {
  border-color: var(--background-modifier-border-hover);
}

.journalit-combobox .input-container:focus-within {
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--interactive-accent) 18%, transparent);
}

.journalit-combobox .combobox-input {
  flex: 1 1 80px;
  width: 0;
  min-width: 0;
  max-width: 100%;
  height: 26px;
  padding: 2px;
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
  top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 3px;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  cursor: pointer;
  transform: translateY(-50%);
}

.journalit-combobox .journalit-combobox-chevron:hover {
  background: var(--background-modifier-hover);
}

.journalit-combobox[data-is-open="true"] .journalit-combobox-chevron {
  transform: translateY(-50%) rotate(180deg);
}

.journalit-combobox.combobox-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 4px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-primary);
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
  align-items: center;
  gap: 8px;
  min-height: 32px;
  box-sizing: border-box;
  margin: 0;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--font-ui-small);
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.journalit-combobox .combobox-option.highlighted,
.journalit-combobox .combobox-add-option.highlighted {
  background: var(--background-modifier-hover);
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

.journalit-combobox .journalit-combobox-selected-items {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin: 4px 0;
}

.journalit-combobox .selected-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 2px 4px 2px 8px;
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
  top: 18px;
  transform: translateY(-50%);
}

.journalit-combobox .remove-button:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 1px;
}

.journalit-combobox[data-disabled="true"] .input-container {
  opacity: 0.6;
  cursor: not-allowed;
}

.journalit-combobox[data-invalid="true"] .input-container {
  border-color: var(--text-error);
}
`;
