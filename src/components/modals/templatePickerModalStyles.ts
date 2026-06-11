

const TEMPLATE_PICKER_MODAL_STYLES = `

.journalit-template-picker-modal .template-picker-container {
  display: flex;
  flex-direction: column;
}


.journalit-template-picker-modal .template-picker-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}


.journalit-template-picker-modal .template-picker-empty {
  padding: 32px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}


.journalit-template-picker-modal .template-picker-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 60vh;
  min-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
}


.journalit-template-picker-modal .template-picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  width: 100%;
  transition: all 0.15s ease;
  position: relative;
}


.journalit-template-picker-modal .template-picker-list:focus {
  outline: none;
}


.journalit-template-picker-modal .template-picker-item:hover {
  background: var(--background-secondary);
  border-color: var(--background-modifier-border);
}

.journalit-template-picker-modal .template-picker-item.template-picker-item--focused {
  background: var(--background-modifier-hover) !important;
  border-color: var(--background-modifier-border-hover) !important;
}

.journalit-template-picker-modal .template-picker-item--current {
  background: var(--background-secondary-alt);
  border-color: var(--interactive-accent);
}

.journalit-template-picker-modal .template-picker-item--current.template-picker-item--focused {
  background: var(--background-modifier-hover) !important;
  border-color: var(--interactive-accent) !important;
}


.journalit-template-picker-modal .template-picker-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
}


.journalit-template-picker-modal .template-picker-item-name {
  font-weight: 500;
  font-size: 13px;
  color: var(--text-normal);
}


.journalit-template-picker-modal .template-picker-item-version {
  font-size: 11px;
  color: var(--text-faint);
}


.journalit-template-picker-modal .template-picker-item-builtin {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-muted);
}


.journalit-template-picker-modal .template-picker-badges {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}


.journalit-template-picker-modal .template-picker-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}


.journalit-template-picker-modal .template-picker-badge--current {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
}


.journalit-template-picker-modal .template-picker-badge--default {
  background: var(--background-modifier-success);
  color: var(--text-on-accent);
}


.journalit-template-picker-modal .template-picker-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--background-modifier-border);
}

.journalit-template-picker-modal .template-picker-buttons .journalit-button {
  min-width: 80px;
}
`;

const templatePickerModalStylesInjected = false;


function injectTemplatePickerModalStyles(): void {
  return;
}


export function ensureTemplatePickerModalStyles(): void {}
