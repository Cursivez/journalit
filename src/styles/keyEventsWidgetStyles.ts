

export const KEY_EVENTS_WIDGET_STYLES = `
.journalit-key-events .key-events-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.journalit-key-events .key-events-widget {
  position: relative;
  z-index: 1;
  margin-bottom: 14px;
  max-width: 600px;
  width: 100%;

  
  --journalit-key-events-color-red: var(
    --event-color-red,
    var(--color-red, #e53935)
  );
  --journalit-key-events-color-orange: var(
    --event-color-orange,
    var(--color-orange, #fb8c00)
  );
  --journalit-key-events-color-yellow: var(
    --event-color-yellow,
    var(--color-yellow, #fdd835)
  );
  --journalit-key-events-color-gray: var(
    --event-color-gray,
    var(--text-muted, #888888)
  );
}

.journalit-key-events .key-events-widget:has(.journalit-combobox[data-is-open="true"]) {
  z-index: 10000;
}

.journalit-key-events:has(.journalit-combobox[data-is-open="true"]),
.cm-preview-code-block:has(.journalit-key-events .key-events-widget .journalit-combobox[data-is-open="true"]) {
  position: relative;
  contain: none;
  overflow: visible;
  z-index: 10000;
}

.journalit-key-events .key-events-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 6px;
}

.journalit-key-events .key-events-title {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}

.journalit-key-events .key-events-tooltip-content {
  max-width: 250px;
  line-height: 1.4;
}

.journalit-key-events .key-events-tooltip-icon {
  cursor: help;
  font-size: 0.65rem;
  color: var(--text-muted);
  opacity: 0.7;
}

.journalit-key-events .key-events-skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.journalit-key-events .key-events-skeleton-item {
  padding: 6px 10px;
  border-radius: 6px;
  background: var(--background-secondary);
  border-left: 3px solid var(--background-modifier-border);
}

.journalit-key-events .key-events-skeleton-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.journalit-key-events .key-events-color-dot--red {
  background: var(--journalit-key-events-color-red);
}

.journalit-key-events .key-events-color-dot--orange {
  background: var(--journalit-key-events-color-orange);
}

.journalit-key-events .key-events-color-dot--yellow {
  background: var(--journalit-key-events-color-yellow);
}

.journalit-key-events .key-events-color-dot--gray {
  background: var(--journalit-key-events-color-gray);
}

.journalit-key-events .key-events-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  color: var(--text-muted);
}

.journalit-key-events .key-events-empty-icon {
  margin-bottom: 8px;
  opacity: 0.5;
}

.journalit-key-events .key-events-empty-title {
  font-size: 13px;
  margin-bottom: 4px;
}

.journalit-key-events .key-events-empty-subtitle {
  font-size: 11px;
  opacity: 0.7;
}

.journalit-key-events .key-events-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 8px;
  padding: 10px;
  background: var(--background-secondary);
  border-radius: 6px;
}

.journalit-key-events .key-events-form--drc {
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--background-modifier-border);
}

.journalit-key-events .key-events-form--drc .key-events-color-picker {
  gap: 6px;
}

.journalit-key-events .key-events-form--drc .key-events-notes-input {
  min-height: 42px;
  font-size: 13px;
}

.journalit-key-events .key-events-header-add-button {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
}

.journalit-key-events .key-events-header-add-button:hover {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-key-events .key-events-form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.journalit-key-events .key-events-form-actions .key-events-add-button {
  margin-left: auto;
}

.journalit-key-events .key-events-form-row {
  display: flex;
  gap: 12px;
}

.journalit-key-events .key-events-event-selector {
  flex: 1;
}


.journalit-key-events .key-events-event-selector .combobox-container {
  margin-bottom: 0;
}


.journalit-key-events .key-events-event-selector .combobox-input {
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  padding: 8px 12px;
  padding-right: 30px;
  font-size: 14px;
}

.journalit-key-events .key-events-event-selector .combobox-input:focus {
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2);
}

.journalit-key-events .key-events-event-selector .combobox-dropdown {
  margin-top: 0;
  border-radius: 0 0 6px 6px;
  border: 1px solid var(--background-modifier-border);
  border-top: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.journalit-key-events .key-events-event-selector .combobox-option,
.journalit-key-events .key-events-event-selector .combobox-add-option {
  padding: 10px 12px;
}

.journalit-key-events .key-events-event-selector .combobox-option:last-child {
  border-bottom: none;
}

.journalit-key-events .key-events-color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.journalit-key-events .key-events-color-label,
.journalit-key-events .key-events-day-label,
.journalit-key-events .key-events-notes-label {
  font-size: 12px;
  color: var(--text-muted);
  min-width: 40px;
}

.journalit-key-events .key-events-notes-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.journalit-key-events .key-events-color-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px;
  
  background: transparent;
  border: none;
  outline: none;
}

.journalit-key-events .key-events-color-option:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 1px;
}

.journalit-key-events .key-events-color-option:hover {
  background: var(--background-modifier-hover);
}

.journalit-key-events .key-events-color-option.selected {
  box-shadow: 0 0 0 2px var(--interactive-accent);
}

.journalit-key-events .key-events-color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--background-modifier-border);
}

.journalit-key-events .key-events-day-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.journalit-key-events .key-events-day-select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 13px;
  width: auto;
}

.journalit-key-events .key-events-notes-input {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 14px;
  resize: vertical;
}

.journalit-key-events .key-events-add-button {
  align-self: flex-start;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  font-size: 14px;
  cursor: pointer;
}

.journalit-key-events .key-events-add-button:hover:not(:disabled) {
  background: var(--interactive-accent-hover);
}

.journalit-key-events .key-events-add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.journalit-key-events .key-events-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.journalit-key-events .key-events-item {
  padding: 7px 10px;
  border-radius: 0;
  background: rgba(var(--background-secondary-rgb, 34, 34, 34), 0.72);
  border-left: 3px solid var(--journalit-key-events-color-gray);
  border-bottom: 1px solid var(--background-modifier-border-hover);
}

.journalit-key-events .key-events-item:first-child {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.journalit-key-events .key-events-item:last-child {
  border-bottom: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.journalit-key-events .key-events-item.event-color-red {
  border-left-color: var(--journalit-key-events-color-red);
}

.journalit-key-events .key-events-item.event-color-orange {
  border-left-color: var(--journalit-key-events-color-orange);
}

.journalit-key-events .key-events-item.event-color-yellow {
  border-left-color: var(--journalit-key-events-color-yellow);
}

.journalit-key-events .key-events-item.event-color-gray {
  border-left-color: var(--journalit-key-events-color-gray);
}

.journalit-key-events .key-events-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.journalit-key-events .key-events-item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.journalit-key-events .key-events-item-title h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.journalit-key-events .key-events-day-badge {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--background-modifier-border);
  border-radius: 4px;
  color: var(--text-muted);
}

.journalit-key-events .key-events-day-badge.key-events-all-week {
  
}

.journalit-key-events .key-events-item-actions,
.journalit-key-events .key-events-edit-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.journalit-key-events .key-events-edit-actions {
  justify-content: space-between;
  width: 100%;
  margin-top: 2px;
}

.journalit-key-events .key-events-action-button,
.journalit-key-events .key-events-remove-button,
.journalit-key-events .key-events-secondary-button,
.journalit-key-events .key-events-save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
  line-height: 1;
}

.journalit-key-events .key-events-action-button,
.journalit-key-events .key-events-remove-button {
  width: 24px;
  height: 24px;
  padding: 0;
}

.journalit-key-events .key-events-action-button:hover,
.journalit-key-events .key-events-secondary-button:hover {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-key-events .key-events-save-button {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
}

.journalit-key-events .key-events-save-button:hover:not(:disabled) {
  background: var(--interactive-accent-hover);
}

.journalit-key-events .key-events-save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.journalit-key-events .key-events-remove-button:hover {
  background: var(--background-modifier-hover);
  color: var(--text-error);
}

.journalit-key-events .key-events-item--editing {
  border-left-color: var(--interactive-accent);
}

.journalit-key-events .key-events-edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.journalit-key-events .key-events-item-notes {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.2;
  font-style: italic;
}
`;
