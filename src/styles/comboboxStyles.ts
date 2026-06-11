


const comboboxCSS = `



.journalit-combobox.combobox-container {
  position: relative;
  width: 100%;
  margin-bottom: 8px;
  z-index: 10;
}

.journalit-combobox.combobox-container[data-is-open="true"] {
  z-index: 9999;
}


.journalit-combobox .input-container {
  position: relative;
  width: 100%;
}


.journalit-combobox .input-container::after {
  content: "";
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--text-normal, #333);
  pointer-events: none;
  transition: transform 0.15s ease;
  will-change: transform;
}


.journalit-combobox[data-is-open="true"] .input-container::after {
  transform: translateY(-50%) rotate(180deg);
}


.journalit-combobox .combobox-input {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 8px 12px;
  padding-right: 30px;
  border: 1px solid var(--background-modifier-border, #ddd);
  border-radius: 4px;
  background-color: var(--background-primary, #fff);
  color: var(--text-normal, #333);
  font-size: 14px;
  transition: border-color 0.15s ease;
}


.journalit-combobox .combobox-dropdown,
.journalit-combobox.combobox-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: -1px;
  z-index: 9999;
  background-color: var(--background-primary, #fff);
  border: 1px solid var(--background-modifier-border, #ddd);
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  margin-left: 0;
  margin-right: 0;
  padding: 0;
  list-style: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: opacity 0.15s ease, transform 0.15s ease;
  transform-origin: top center;
  will-change: transform, opacity;

  
  animation: journalit-combobox-dropdown-open 0.15s ease forwards;
}

.journalit-combobox.combobox-dropdown.combobox-dropdown--portal {
  position: fixed;
  top: var(--combobox-portal-top);
  left: var(--combobox-portal-left);
  right: auto;
  width: var(--combobox-portal-width);
  z-index: 100000;
}

@keyframes journalit-combobox-dropdown-open {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.journalit-combobox .combobox-option {
  padding: 8px 12px;
  cursor: pointer;
  margin: 0;
  background-color: var(--background-primary, #fff);
  color: var(--text-normal, #333);
  font-size: 14px;
  line-height: 1.5;
  border-bottom: 1px solid var(--background-modifier-border-subtle, rgba(127, 127, 127, 0.1));
  transition: background-color 0.15s ease;
}

.journalit-combobox .combobox-option.highlighted,
.journalit-combobox .combobox-option:hover {
  background-color: var(--background-secondary, #f5f5f5);
}


.journalit-combobox .combobox-add-option {
  padding: 8px 12px;
  cursor: pointer;
  margin: 0;
  background-color: var(--background-primary, #fff);
  color: var(--text-normal, #333);
  font-size: 14px;
  line-height: 1.5;
  border-bottom: 1px solid var(--background-modifier-border-subtle, rgba(127, 127, 127, 0.1));
  font-style: italic;
  border-top: 1px dashed var(--background-modifier-border, #ddd);
  transition: background-color 0.15s ease;
}

.journalit-combobox .combobox-add-option.highlighted,
.journalit-combobox .combobox-add-option:hover {
  background-color: var(--background-secondary, #f5f5f5);
}


.journalit-combobox .selected-item {
  display: inline-flex;
  align-items: center;
  margin: 0 4px 4px 0;
  padding: 4px 8px;
  background-color: var(--interactive-accent, #5183e4);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  gap: 6px;
}


.journalit-combobox .remove-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  padding: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 50%;
  margin-left: 4px;
  position: relative;
  z-index: 5;
  line-height: 0;
  transition: background-color 0.15s ease;
}

.journalit-combobox .remove-button-glyph {
  width: 10px;
  height: 10px;
  display: block;
  position: relative;
}

.journalit-combobox .remove-button-glyph::before,
.journalit-combobox .remove-button-glyph::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 9px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  transform-origin: center;
}

.journalit-combobox .remove-button-glyph::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.journalit-combobox .remove-button-glyph::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.journalit-combobox .remove-button:hover {
  background: rgba(255, 255, 255, 0.4);
}


.journalit-combobox[data-is-open="true"] .combobox-input {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}


.journalit-combobox .combobox-input:focus {
  border-color: var(--interactive-accent, #5183e4);
  box-shadow: 0 0 0 2px rgba(83, 141, 226, 0.3);
  outline: none;
}


.journalit-combobox .combobox-input.error {
  border-color: var(--text-error, #e53935);
}
`;

export function injectComboBoxStyles(): void {
  return;
}

export function removeComboBoxStyles(): void {
  return;
}

export function ensureComboBoxStyles(): void {
  return;
}
