

export const SETUPS_VIEW_STYLES = `
.journalit-setups-view-container .view-content {
  padding: 0;
}

.journalit-setups-view {
  height: 100%;
  overflow: auto;
  padding: 0 16px 16px;
  background: var(--background-primary);
  color: var(--text-normal);
  container-type: inline-size;
}

.journalit-setups-view__header {
  display: grid;
  grid-template-columns: minmax(32px, 1fr) auto minmax(32px, 1fr);
  gap: 16px;
  align-items: center;
  min-height: 36px;
  margin-bottom: 10px;
  padding: 4px 0 8px;
}

.journalit-setups-view__eyebrow {
  margin: 0 0 4px;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.journalit-setups-view__title {
  margin: 0;
  font-size: 26px;
  line-height: 1.2;
  font-weight: 700;
}

.journalit-setups-view__title--sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.journalit-setups-view__subtitle {
  margin: 8px 0 0;
  color: var(--text-muted);
  max-width: 720px;
}

.journalit-setups-view__actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
}

.journalit-setups-view__tabs {
  display: flex;
  gap: 0;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  padding: 3px;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m, 8px);
  background: var(--background-secondary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.journalit-setups-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s, 6px);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  line-height: 1;
  opacity: 0.75;
  transition:
    opacity 0.16s ease,
    color 0.16s ease,
    border-color 0.16s ease,
    background-color 0.16s ease;
}

.journalit-setups-icon-button:hover:not(:disabled),
.journalit-setups-icon-button:focus-visible:not(:disabled) {
  opacity: 1;
  color: var(--text-normal);
  background: var(--background-modifier-hover);
  border-color: var(--background-modifier-border-hover, var(--background-modifier-border));
}

.journalit-setups-icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.journalit-setups-icon-button--primary {
  color: var(--text-accent);
  background: transparent;
  border-color: transparent;
  opacity: 0.82;
}

.journalit-setups-icon-button--primary:hover:not(:disabled),
.journalit-setups-icon-button--primary:focus-visible:not(:disabled) {
  color: var(--text-accent);
  background: var(--background-modifier-hover);
  border-color: transparent;
  opacity: 1;
}

.journalit-setups-view .journalit-setups-tab-button {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: calc(var(--radius-m, 8px) - 3px);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-size: var(--font-ui-small);
  line-height: 1;
  opacity: 0.78;
  box-shadow: none;
  white-space: nowrap;
  transition:
    opacity 0.16s ease,
    color 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease;
}

.journalit-setups-view .journalit-setups-tab-button + .journalit-setups-tab-button {
  margin-left: 1px;
}

.journalit-setups-view .journalit-setups-tab-button:hover:not(:disabled),
.journalit-setups-view .journalit-setups-tab-button:focus-visible:not(:disabled) {
  opacity: 1;
  color: var(--text-normal);
  background: var(--background-modifier-hover);
  border-color: transparent;
}

.journalit-setups-view .journalit-setups-tab-button:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.journalit-setups-view .journalit-setups-tab-button--active,
.journalit-setups-view .journalit-setups-tab-button--active:hover,
.journalit-setups-view .journalit-setups-tab-button--active:focus-visible {
  position: relative;
  z-index: 1;
  opacity: 1;
  color: var(--text-normal);
  background: var(--background-primary);
  border-color: transparent;
  border-radius: calc(var(--radius-m, 8px) - 3px);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px var(--interactive-accent);
}

.journalit-setups-create-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: var(--radius-s, 6px);
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  cursor: pointer;
  font-size: var(--font-ui-small);
  font-weight: 500;
  line-height: 1;
  transition:
    opacity 0.16s ease,
    background-color 0.16s ease;
}

.journalit-setups-create-button:hover:not(:disabled),
.journalit-setups-create-button:focus-visible:not(:disabled) {
  background: var(--interactive-accent-hover, var(--interactive-accent));
}

.journalit-setups-create-button:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.journalit-setups-button {
  border: 1px solid var(--background-modifier-border);
  background: var(--interactive-normal);
  color: var(--text-normal);
  border-radius: 8px;
  padding: 7px 12px;
  font-size: var(--font-ui-small);
  cursor: pointer;
}

.journalit-setups-button:hover:not(:disabled),
.journalit-setups-button:focus-visible:not(:disabled) {
  background: var(--interactive-hover);
}

.journalit-setups-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.journalit-setups-skeleton .skeleton-shimmer {
  opacity: 0.72;
}

.journalit-setups-skeleton__tabs {
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
}

.journalit-setups-skeleton__chart-card {
  pointer-events: none;
}

.journalit-setups-skeleton__ranking-chart {
  display: flex;
  min-height: 172px;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 18px 40px 26px 168px;
}

.journalit-setup-card--skeleton {
  cursor: default;
  pointer-events: none;
}

.journalit-setup-card--skeleton:hover,
.journalit-setup-card--skeleton:focus-visible {
  transform: none;
  border-color: var(--background-modifier-border);
  box-shadow: none;
}

.journalit-setups-skeleton__chart-toggle {
  position: absolute;
  z-index: 2;
  top: 8px;
  right: 12px;
}

.journalit-setups-skeleton__compare-title {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.journalit-setups-skeleton__compare-edge {
  pointer-events: none;
}

.journalit-setups-skeleton__compare-metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.journalit-setups-button--primary {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border-color: var(--interactive-accent);
}

.journalit-setups-button--ghost {
  background: transparent;
}


.journalit-create-setup-modal .create-setup-modal-container {
  max-width: 600px;
  width: 100%;
}

.journalit-create-setup-modal .create-setup-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
}

.journalit-create-setup-modal .create-setup-form .setting-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
  align-items: stretch;
}

.journalit-create-setup-modal .create-setup-form .setting-item.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.journalit-create-setup-modal .create-setup-form .setting-item.two-column .column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.journalit-create-setup-modal .create-setup-form .create-setup-name-row {
  display: grid;
  grid-template-columns: max-content minmax(180px, 320px);
  gap: 10px;
  align-items: center;
}

.journalit-create-setup-modal .create-setup-form .create-setup-name-row .setting-item-name::after {
  content: ':';
}

.journalit-create-setup-modal .create-setup-color-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  min-height: 36px;
  padding: 4px 0;
}

.journalit-create-setup-modal .create-setup-color-row__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1 1 220px;
}

.journalit-create-setup-modal .create-setup-color-row__label {
  color: var(--text-normal);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
}

.journalit-create-setup-modal .create-setup-color-row__description {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.2;
}

.journalit-create-setup-modal .create-setup-color-row .journalit-label-color-picker {
  flex: 0 0 auto;
}

.journalit-create-setup-profile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 6px 0 8px;
}

.journalit-create-setup-profile__heading {
  margin: 0;
  color: var(--text-normal);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
}

.journalit-create-setup-profile__heading span {
  color: var(--text-muted);
  font-weight: 400;
}

.journalit-create-setup-profile__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.journalit-create-setup-profile__grid > .journalit-combobox {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  min-width: 0;
  margin-bottom: 0;
}

.journalit-create-setup-profile__grid > .journalit-combobox > label {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 4px;
}

.journalit-create-setup-profile__info {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: help;
}

.journalit-create-setup-profile .journalit-combobox[data-selected-items-placement='inside-input'] .input-container {
  display: flex;
  min-height: 34px;
  flex-wrap: wrap;
  align-items: center;
  gap: 3px;
  padding: 3px 28px 3px 6px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-primary);
}

.journalit-create-setup-profile .journalit-combobox[data-selected-items-placement='inside-input'] .journalit-combobox-selected-items {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3px;
}

.journalit-create-setup-profile .journalit-combobox[data-selected-items-placement='inside-input'] .selected-item {
  margin: 0;
  padding: 2px 6px;
  font-size: 11px;
}

.journalit-create-setup-profile .journalit-combobox[data-selected-items-placement='inside-input'] .combobox-input {
  width: auto;
  min-width: 72px;
  height: 26px;
  flex: 1 1 90px;
  padding: 3px 4px;
  border: 0;
  background: transparent;
}

.journalit-create-setup-profile .journalit-combobox[data-selected-items-placement='inside-input'] .combobox-input:focus {
  box-shadow: none;
}

.journalit-create-setup-modal .create-setup-form .setting-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: visible;
  min-width: auto;
  width: 100%;
  align-items: flex-start;
  text-align: left;
}

.journalit-create-setup-modal .create-setup-form .setting-item-name {
  font-weight: 600;
  color: var(--text-normal);
  font-size: 13px;
  line-height: 1.2;
  margin-bottom: 0;
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  word-break: break-word;
}

.journalit-create-setup-modal .create-setup-form .setting-item-description {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.2;
  margin-bottom: 4px;
}

.journalit-create-setup-modal .create-setup-form .setting-item-control {
  margin-top: 0;
}

.journalit-create-setup-modal .create-setup-form .setting-item-control input,
.journalit-create-setup-modal .create-setup-form .setting-item-control select,
.journalit-create-setup-modal .create-setup-form .setting-item-control textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 3px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 16px;
  line-height: 1.2;
  box-sizing: border-box;
}

.journalit-create-setup-modal .create-setup-form .setting-item-control input,
.journalit-create-setup-modal .create-setup-form .setting-item-control select {
  height: 32px;
}

.journalit-create-setup-modal .create-setup-form .setting-item-control textarea {
  min-height: 74px;
  resize: vertical;
}

.journalit-create-setup-modal .create-setup-form .setting-item-control input:focus,
.journalit-create-setup-modal .create-setup-form .setting-item-control select:focus,
.journalit-create-setup-modal .create-setup-form .setting-item-control textarea:focus {
  outline: none;
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 1px var(--interactive-accent);
}

.journalit-create-setup-modal .create-setup-form .setting-item-control input:disabled,
.journalit-create-setup-modal .create-setup-form .setting-item-control select:disabled,
.journalit-create-setup-modal .create-setup-form .setting-item-control textarea:disabled {
  background: var(--background-secondary);
  color: var(--text-muted);
  cursor: not-allowed;
}

.journalit-create-setup-modal .create-setup-error {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--background-modifier-error, var(--text-error));
  border-radius: 6px;
  background: var(--background-modifier-error-hover);
  color: var(--text-error);
}

.journalit-create-setup-modal .create-setup-error-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.journalit-create-setup-modal .create-setup-error-title {
  font-weight: 600;
  font-size: var(--font-ui-small);
}

.journalit-create-setup-modal .create-setup-error-message {
  color: var(--text-normal);
  font-size: var(--font-ui-smaller);
}

.journalit-create-setup-modal .create-setup-warning {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--text-warning) 55%, var(--background-modifier-border));
  border-radius: 6px;
  background: color-mix(in srgb, var(--text-warning) 12%, var(--background-secondary));
  color: var(--text-warning);
}

.journalit-create-setup-modal .create-setup-warning-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.journalit-create-setup-modal .create-setup-warning-title {
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  font-weight: 650;
}

.journalit-create-setup-modal .create-setup-warning-message {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-create-setup-modal .create-setup-linked-notes {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
}

.journalit-create-setup-modal .create-setup-linked-notes__empty {
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-create-setup-modal .create-setup-linked-notes__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.journalit-create-setup-modal .create-setup-linked-notes__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 34px;
  padding: 3px 4px 3px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-secondary);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-create-setup-modal .create-setup-linked-notes__path {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-create-setup-modal .create-setup-linked-notes .custom-fields-option-delete-button {
  min-width: 28px !important;
  width: 28px !important;
  height: 28px !important;
  padding: 5px !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px !important;
  background-color: var(--background-primary) !important;
  color: var(--text-error) !important;
  gap: 0 !important;
  flex: 0 0 28px;
  line-height: 1;
  transition: all 0.2s ease !important;
}

.journalit-create-setup-modal .create-setup-linked-notes .custom-fields-option-delete-button:hover:not(:disabled) {
  background-color: var(--background-modifier-hover) !important;
  border-color: var(--interactive-accent) !important;
  color: var(--text-normal) !important;
}

.journalit-create-setup-modal .create-setup-linked-notes .custom-fields-option-delete-button svg {
  display: block;
}

.journalit-setup-secondary-action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 30px;
  padding: 5px 10px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-primary);
  color: var(--text-normal);
  cursor: pointer;
  font-size: var(--font-ui-small);
  font-weight: 500;
  line-height: 1;
  transition: all 0.15s ease;
}

.journalit-setup-secondary-action-button:hover:not(:disabled),
.journalit-setup-secondary-action-button:focus-visible:not(:disabled) {
  background: var(--background-modifier-hover);
  border-color: var(--interactive-accent);
}

.journalit-create-setup-modal .create-setup-note-picker {
  margin-top: 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-secondary);
  padding: 8px;
}

.journalit-create-setup-modal .create-setup-note-picker .journalit-note-file-picker__file-list {
  max-height: 220px;
  overflow-y: auto;
}

.journalit-setups-card-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

 .journalit-setups-performance-widget {
  width: 100%;
  height: auto;
  min-height: 318px;
  margin-bottom: 16px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 72%, transparent), transparent),
    color-mix(in srgb, var(--background-primary) 88%, black 12%);
  box-shadow: none;
  overflow: hidden;
  display: block;
  container-type: inline-size;
}

.theme-light .journalit-setups-performance-widget {
  border-color: color-mix(in srgb, var(--background-modifier-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 55%, transparent), transparent 42%),
    var(--background-primary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.journalit-setups-performance-widget__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px 8px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-setups-performance-widget__heading {
  min-width: 0;
}

.journalit-setups-performance-widget .journalit-chart-widget__title {
  color: var(--text-normal);
  text-align: left;
  font-size: 16px;
  font-weight: 650;
}

.journalit-setups-performance-widget__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex-wrap: wrap;
}

.journalit-setups-performance-widget .journalit-chart-widget__selector {
  position: static;
  flex: 0 0 auto;
  display: flex;
  gap: 8px;
  overflow: visible;
}

.journalit-setups-performance-widget__metric-menu {
  position: relative;
  z-index: 5;
  display: inline-flex;
  overflow: visible;
}

button.journalit-toolbar-button.journalit-setups-performance-widget__metric-trigger {
  min-width: 132px;
  height: 30px;
  justify-content: space-between;
  gap: 12px;
  padding: 0 10px 0 12px;
  background: color-mix(in srgb, var(--background-primary) 72%, transparent);
  border: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent);
  border-radius: 6px;
  box-shadow: none;
  color: var(--text-normal);
  font-weight: 500;
}

button.journalit-toolbar-button.journalit-setups-performance-widget__metric-trigger:hover:not(:disabled),
button.journalit-toolbar-button.journalit-setups-performance-widget__metric-trigger:focus-visible:not(:disabled) {
  background: color-mix(in srgb, var(--background-primary) 82%, var(--background-modifier-hover));
  border-color: var(--background-modifier-border-hover);
  color: var(--text-normal);
}

.journalit-setups-performance-widget__metric-dropdown {
  position: absolute;
  z-index: 1000;
  top: calc(100% + 4px);
  right: 0;
  min-width: 166px;
  padding: 0;
  background: var(--background-primary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px;
  box-shadow: none !important;
}

.journalit-setups-performance-widget__metric-dropdown .journalit-home-period-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 26px;
  padding: 4px 8px;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
  appearance: none;
}

.journalit-setups-performance-widget__metric-dropdown .journalit-home-period-option:hover,
.journalit-setups-performance-widget__metric-dropdown .journalit-home-period-option:focus-visible {
  background: var(--background-modifier-hover) !important;
}

.journalit-setups-performance-widget__metric-dropdown .journalit-home-period-option__check {
  width: 13px;
  height: 13px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 2px;
  background: transparent;
  color: var(--text-on-accent);
  font-size: 10px;
  line-height: 1;
}

.journalit-setups-performance-widget__metric-dropdown .journalit-home-period-option--active .journalit-home-period-option__check {
  background: var(--interactive-accent);
  border-color: var(--interactive-accent);
}

button.journalit-toolbar-button.journalit-setups-performance-widget__setup-trigger {
  min-width: 124px;
}

.journalit-setups-performance-widget__setup-dropdown {
  min-width: 240px;
}

.journalit-setups-performance-widget__setup-actions {
  display: flex;
  gap: 6px;
  padding: 8px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-setups-performance-widget__setup-actions button {
  flex: 1 1 0;
  min-height: 24px;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px !important;
  background: transparent !important;
  color: var(--text-muted) !important;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
}

.journalit-setups-performance-widget__setup-actions button:hover,
.journalit-setups-performance-widget__setup-actions button:focus-visible {
  background: var(--background-modifier-hover) !important;
  color: var(--text-normal) !important;
}

.journalit-setups-performance-widget__setup-list {
  max-height: 280px;
  overflow-y: auto;
}

.journalit-setups-performance-widget .journalit-chart-widget__select {
  border-color: transparent;
  background: transparent;
  color: var(--text-muted);
}

.journalit-setups-performance-widget .journalit-chart-widget__select:hover,
.journalit-setups-performance-widget .journalit-chart-widget__select:focus-visible {
  border-color: var(--background-modifier-border);
  background: var(--background-modifier-hover);
}


.journalit-setups-performance-widget--pairs {
  border: 0;
  background: transparent;
  box-shadow: none;
  margin-top: -6px;
}

.journalit-setups-performance-widget--pairs .journalit-setups-performance-widget__header {
  align-items: center;
  padding: 0 0 4px;
  border-bottom: 0;
}

.journalit-setups-performance-widget--pairs .journalit-setups-performance-summary {
  margin-top: 0;
}

.journalit-setups-performance-widget--pairs .journalit-chart-widget__title {
  display: none;
}

.journalit-setups-performance-widget__body {
  flex: none;
  min-height: 0;
  padding: 6px 10px 8px 0;
}

.journalit-setups-pairs-widget__body {
  padding: 0;
}

.journalit-setups-pairs-split {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: 16px;
  padding: 4px 0 0;
}

.journalit-setups-pairs-table,
.journalit-setups-pairs-evidence {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--background-modifier-border) 82%, transparent);
  border-radius: 5px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 72%, transparent), transparent),
    color-mix(in srgb, var(--background-primary) 88%, black 12%);
}

.theme-light .journalit-setups-pairs-table,
.theme-light .journalit-setups-pairs-evidence {
  border-color: color-mix(in srgb, var(--background-modifier-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 55%, transparent), transparent 42%),
    var(--background-primary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.theme-light .journalit-setups-view button.journalit-setups-pairs-row--selected {
  background: color-mix(in srgb, var(--interactive-accent) 9%, var(--background-modifier-hover) 52%);
}

.theme-light .journalit-setups-view button.journalit-setups-pairs-row:hover,
.theme-light .journalit-setups-view button.journalit-setups-pairs-row:focus-visible {
  background: color-mix(in srgb, var(--background-modifier-hover) 34%, var(--background-primary));
}

.theme-light .journalit-setups-view button.journalit-setups-pairs-row--selected:hover,
.theme-light .journalit-setups-view button.journalit-setups-pairs-row--selected:focus-visible {
  background: color-mix(in srgb, var(--interactive-accent) 12%, var(--background-modifier-hover) 56%);
}

.journalit-setups-pairs-table__header {
  display: grid;
  grid-template-columns: 44px minmax(104px, 0.58fr) minmax(132px, 1.42fr) 34px;
  gap: 8px;
  align-items: center;
  min-height: 48px;
  padding: 0 10px;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 78%, transparent);
  color: var(--text-faint);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}


.journalit-setups-pairs-table__header span:nth-child(3) {
  justify-self: center;
}

.journalit-setups-pairs-table__header span:last-child {
  justify-self: end;
}

.journalit-setups-pairs-table--trade-count-metric .journalit-setups-pairs-table__header,
.journalit-setups-pairs-table--trade-count-metric .journalit-setups-pairs-row {
  grid-template-columns: 44px minmax(104px, 0.48fr) minmax(160px, 1.52fr);
}

.journalit-setups-view button.journalit-setups-pairs-row {
  appearance: none;
  display: grid;
  grid-template-columns: 44px minmax(104px, 0.58fr) minmax(132px, 1.42fr) 34px;
  gap: 8px;
  align-items: center;
  width: 100%;
  min-height: 44px;
  padding: 0 10px;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 62%, transparent);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  cursor: pointer;
  font-size: var(--font-ui-small);
  text-align: left;
}

.journalit-setups-view button.journalit-setups-pairs-row:hover,
.journalit-setups-view button.journalit-setups-pairs-row:focus-visible {
  background: color-mix(in srgb, var(--background-modifier-hover) 42%, transparent);
  box-shadow: none;
}

.journalit-setups-view button.journalit-setups-pairs-row--selected {
  position: relative;
  background: color-mix(in srgb, var(--interactive-accent) 10%, var(--background-modifier-hover) 54%);
}

.journalit-setups-view button.journalit-setups-pairs-row--selected:hover,
.journalit-setups-view button.journalit-setups-pairs-row--selected:focus-visible {
  background: color-mix(in srgb, var(--interactive-accent) 14%, var(--background-modifier-hover) 58%);
}

.journalit-setups-view button.journalit-setups-pairs-row--selected::before {
  content: none;
}

.journalit-setups-pairs-row__rank,
.journalit-setups-pairs-row__trades {
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.journalit-setups-pairs-row__rank--label {
  color: var(--text-warning);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.journalit-setups-pairs-row__name {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 4px;
  color: var(--text-normal);
  font-weight: 520;
  white-space: nowrap;
}

.journalit-setups-pairs-row__name span:not([aria-hidden]) {
  flex: 0 1 auto;
  overflow: hidden;
  min-width: 0;
  max-width: min(46%, 126px);
  text-overflow: ellipsis;
}

.journalit-setups-pairs-row__name span[aria-hidden] {
  flex: 0 0 auto;
  color: var(--text-faint);
}

.journalit-setups-pairs-row__metric {
  display: grid;
  grid-template-columns: minmax(72px, 1fr) minmax(52px, auto);
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.journalit-setups-pairs-row__bar-track {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
  align-items: center;
  height: 17px;
  background: transparent;
}

.journalit-setups-pairs-row__bar-track::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: color-mix(in srgb, var(--text-muted) 35%, transparent);
}

.journalit-setups-pairs-row__bar {
  grid-column: 3;
  justify-self: start;
  width: var(--journalit-setup-pair-bar-width, 0%);
  height: 5px;
  border-radius: 999px;
  background: var(--chart-positive, var(--text-success));
}

.journalit-setups-pairs-row__bar--negative {
  grid-column: 1;
  justify-self: end;
  background: var(--chart-negative, var(--text-error));
}

.journalit-setups-pairs-row__bar--neutral {
  background: var(--text-muted);
}

.journalit-setups-pairs-row__value,
.journalit-setups-pairs-row__trades {
  justify-self: end;
  font-weight: 600;
  white-space: nowrap;
}

.journalit-setups-pairs-evidence {
  min-width: 0;
  padding: 18px 22px;
}

.journalit-setups-pairs-evidence--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 440px;
}

.journalit-setups-pairs-evidence__header {
  padding-bottom: 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent);
}

.journalit-setups-pairs-evidence__header h3 {
  margin: 0;
  color: var(--text-normal);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.journalit-setups-pairs-evidence__content {
  display: grid;
  grid-template-columns: minmax(280px, 1.3fr) minmax(180px, 0.7fr);
  gap: 16px;
  padding-top: 20px;
}

.journalit-setups-pairs-evidence__section-title {
  margin-bottom: 14px;
  color: var(--text-faint);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.journalit-setups-pairs-mini-chart {
  height: 240px;
  min-width: 0;
}

.journalit-setups-pairs-mini-chart--unavailable {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-faint);
  font-size: 22px;
}

.journalit-setups-pairs-mini-chart .journalit-chart-container {
  overflow: visible;
}

.journalit-setups-pairs-evidence__caption {
  margin: 10px 0 0;
  color: var(--text-faint);
  font-size: 12px;
  line-height: 1.45;
}

.journalit-setups-pairs-evidence__stats {
  min-width: 0;
}

.journalit-setups-pairs-evidence__metric {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: baseline;
  padding: 10px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 58%, transparent);
}

.journalit-setups-pairs-evidence__metric span:first-child {
  overflow: hidden;
  color: var(--text-normal);
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-setups-pairs-evidence__metric strong {
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.journalit-setups-pairs-evidence__metric-value--positive {
  color: var(--chart-positive, var(--text-success));
}

.journalit-setups-pairs-evidence__metric-value--negative {
  color: var(--chart-negative, var(--text-error));
}

.journalit-setups-pairs-evidence__metric-value--neutral {
  color: var(--text-normal);
}

.journalit-setups-pairs-evidence__metric-value--positive *,
.journalit-setups-pairs-evidence__metric-value--negative *,
.journalit-setups-pairs-evidence__metric-value--neutral * {
  color: inherit;
}

.journalit-setups-pairs-edge {
  width: min(820px, 86%);
  max-width: 760px;
  margin: 34px auto 0;
}

.journalit-setups-pairs-edge__track {
  position: relative;
  height: 34px;
  margin: 8px 0 0;
}

.journalit-setups-pairs-edge__track::before {
  content: '';
  position: absolute;
  top: 15px;
  right: 6px;
  left: 6px;
  height: 1px;
  background: color-mix(in srgb, var(--text-muted) 48%, transparent);
}

.journalit-setups-pairs-edge__point {
  position: absolute;
  top: 10px;
  left: var(--journalit-setup-pair-edge-position, 50%);
  width: 11px;
  height: 11px;
  border-radius: 999px;
  background: var(--text-muted);
  transform: translateX(-50%);
}

.journalit-setups-pairs-edge__point--together {
  top: 7px;
  width: 15px;
  height: 15px;
  border: 2px solid var(--chart-negative, var(--text-error));
  background: var(--background-primary);
}

.journalit-setups-pairs-edge__labels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 4px;
}

.journalit-setups-pairs-edge__labels span {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
  color: var(--text-muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.journalit-setups-pairs-edge__label--positive > span:last-child {
  color: var(--chart-positive, var(--text-success));
}

.journalit-setups-pairs-edge__label--negative > span:last-child {
  color: var(--chart-negative, var(--text-error));
}

.journalit-setups-pairs-edge__label--neutral > span:last-child {
  color: var(--text-normal);
}

.journalit-setups-pairs-edge__labels span:nth-child(2) {
  align-items: center;
}

.journalit-setups-pairs-edge__labels span:nth-child(3) {
  align-items: flex-end;
}

@media (max-width: 1120px) {
  .journalit-setups-pairs-split {
    grid-template-columns: 1fr;
  }

  .journalit-setups-pairs-evidence__content {
    grid-template-columns: minmax(280px, 1.25fr) minmax(180px, 0.75fr);
  }
}

@media (max-width: 920px) {
  .journalit-setups-performance-widget--pairs .journalit-setups-performance-widget__header {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-setups-performance-widget--pairs .journalit-chart-widget__selector {
    align-self: flex-end;
  }
}

@media (max-width: 760px) {
  .journalit-setups-pairs-table__header,
  .journalit-setups-view button.journalit-setups-pairs-row {
    grid-template-columns: 28px minmax(0, 0.8fr) minmax(128px, 1.2fr);
  }

  .journalit-setups-pairs-table__header span:last-child,
  .journalit-setups-pairs-row__trades {
    display: none;
  }

  .journalit-setups-pairs-evidence__content {
    grid-template-columns: 1fr;
  }

  .journalit-setups-pairs-evidence {
    padding: 16px;
  }

  .journalit-setups-pairs-edge {
    width: 100%;
    margin-top: 24px;
  }
}

@media (max-width: 560px) {
  .journalit-setups-view__header {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 8px;
    padding-bottom: 10px;
  }

  .journalit-setups-view__actions {
    justify-content: center;
  }

  .journalit-setups-pairs-table__header,
  .journalit-setups-view button.journalit-setups-pairs-row {
    grid-template-columns: 24px minmax(0, 1fr) minmax(92px, 0.72fr);
    gap: 6px;
    padding-right: 8px;
    padding-left: 8px;
  }

  .journalit-setups-pairs-row__metric {
    grid-template-columns: minmax(40px, 1fr) minmax(42px, auto);
    gap: 6px;
  }

  .journalit-setups-pairs-row__value {
    font-size: var(--font-ui-smaller);
  }

  .journalit-setups-pairs-evidence__header h3 {
    font-size: 18px;
  }

  .journalit-setups-pairs-mini-chart {
    height: 210px;
  }

  .journalit-setups-pairs-edge__labels {
    gap: 8px;
  }
}

@container (max-width: 1120px) {
  .journalit-setups-pairs-split {
    grid-template-columns: 1fr;
  }

  .journalit-setups-pairs-evidence__content {
    grid-template-columns: minmax(280px, 1.25fr) minmax(180px, 0.75fr);
  }
}

@container (max-width: 920px) {
  .journalit-setups-performance-widget--pairs .journalit-setups-performance-widget__header {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-setups-performance-widget--pairs .journalit-chart-widget__selector {
    align-self: flex-end;
  }
}

@container (max-width: 760px) {
  .journalit-setups-pairs-table__header,
  .journalit-setups-view button.journalit-setups-pairs-row {
    grid-template-columns: 28px minmax(0, 0.8fr) minmax(128px, 1.2fr);
  }

  .journalit-setups-pairs-table__header span:last-child,
  .journalit-setups-pairs-row__trades {
    display: none;
  }

  .journalit-setups-pairs-evidence__content {
    grid-template-columns: 1fr;
  }

  .journalit-setups-pairs-evidence {
    padding: 16px;
  }

  .journalit-setups-pairs-edge {
    width: 100%;
    margin-top: 24px;
  }
}

@container (max-width: 560px) {
  .journalit-setups-view__header {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 8px;
    padding-bottom: 10px;
  }

  .journalit-setups-view__actions {
    justify-content: center;
  }

  .journalit-setups-pairs-table__header,
  .journalit-setups-view button.journalit-setups-pairs-row {
    grid-template-columns: 24px minmax(0, 1fr) minmax(92px, 0.72fr);
    gap: 6px;
    padding-right: 8px;
    padding-left: 8px;
  }

  .journalit-setups-pairs-row__metric {
    grid-template-columns: minmax(40px, 1fr) minmax(42px, auto);
    gap: 6px;
  }

  .journalit-setups-pairs-row__value {
    font-size: var(--font-ui-smaller);
  }

  .journalit-setups-pairs-evidence__header h3 {
    font-size: 18px;
  }

  .journalit-setups-pairs-mini-chart {
    height: 210px;
  }

  .journalit-setups-pairs-edge__labels {
    gap: 8px;
  }
}

.journalit-setups-performance-widget .journalit-setups-chart-empty-state {
  min-height: 250px;
  border-top: 1px solid var(--background-modifier-border);
  border-radius: 0 0 8px 8px;
  background: transparent;
}

.journalit-setups-pair-insight {
  display: grid;
  grid-template-columns: minmax(210px, 0.9fr) minmax(0, 2.1fr);
  align-items: stretch;
  gap: 14px;
  margin: 0 16px 14px;
  padding: 12px 0 0;
  border-top: 1px solid var(--background-modifier-border);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-setups-pair-insight__title {
  display: flex;
  align-items: center;
  min-width: 0;
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  font-weight: 700;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
}

.journalit-setups-pair-insight__metrics {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--background-modifier-border) 70%, transparent);
  border-radius: 7px;
  background: var(--background-modifier-border);
}

.journalit-setups-pair-insight__metric {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
  padding: 8px 10px;
  background: color-mix(in srgb, var(--background-primary) 58%, transparent);
}

.journalit-setups-pair-insight__metric-label {
  overflow: hidden;
  color: var(--text-faint);
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.04em;
  line-height: 1.1;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.journalit-setups-pair-insight__metric-value {
  color: var(--text-normal);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
}

.journalit-setups-overview-pnl-widget__body {
  height: auto;
  padding-right: 10px;
}

.journalit-setups-overview-pnl-chart {
  display: flex;
  height: auto;
  min-height: 0;
  flex-direction: column;
}

.journalit-setups-overview-pnl-chart__chart {
  flex: none;
  min-height: 0;
}

.journalit-setups-overview-pnl-header-summary {
  align-items: center;
}

.journalit-setups-overview-pnl-header-legend {
  display: inline-flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px 10px;
}

.journalit-setups-overview-pnl-header-legend__item {
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 500;
}

.journalit-setups-overview-pnl-header-legend .journalit-chart-widget__legend-swatch {
  background: var(--journalit-setup-overview-pnl-series-color);
}

.journalit-setups-overview-pnl-tooltip__item {
  color: var(--journalit-setup-overview-pnl-series-color);
}

.journalit-setups-overview-pnl-chart__masked {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-setups-performance-summary {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 10px;
  margin-top: 6px;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  line-height: 1.35;
}

.journalit-setups-performance-summary > span:not(:last-child)::after {
  content: '·';
  margin-left: 10px;
  color: var(--text-faint);
}

.journalit-setups-performance-summary strong {
  color: var(--text-normal);
  font-weight: 600;
}

.journalit-setups-performance-summary__meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.journalit-setups-performance-summary__warning .journalit-display-value {
  color: var(--text-warning);
}

.journalit-setups-panel {
  border: 1px solid var(--background-modifier-border);
  border-radius: 14px;
  background: var(--background-secondary);
  padding: 16px;
}

.journalit-setup-metric__label {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  margin-bottom: 6px;
}

.journalit-setup-metric__value {
  font-size: 22px;
  line-height: 1.2;
  font-weight: 650;
}

.journalit-setups-section-title {
  margin: 0 0 12px;
  font-size: 16px;
}

.journalit-setup-card__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.journalit-setups-detail-header {
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(0, auto) minmax(120px, 1fr);
  align-items: start;
  gap: 16px;
  min-height: 42px;
  margin-bottom: 12px;
  padding: 4px 0 6px;
}

.journalit-setups-detail-header__back {
  display: flex;
  justify-content: flex-start;
}

.journalit-setups-detail-header__identity {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.journalit-setups-detail-header__identity .journalit-setups-view__title {
  max-width: min(620px, 52vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 22px;
  line-height: 1.12;
  letter-spacing: -0.02em;
}

.journalit-setups-detail-header__identity .journalit-setups-badges {
  justify-content: center;
}

.journalit-setups-detail-header__actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 1px;
}

.journalit-setups-detail-header__action-buttons {
  display: inline-flex;
  gap: 5px;
  align-items: center;
}

.journalit-setups-detail-action-icon {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border-color: color-mix(in srgb, var(--background-modifier-border) 72%, transparent);
  background: color-mix(in srgb, var(--background-primary) 68%, transparent);
  color: var(--text-muted);
  opacity: 1;
  box-shadow: none;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease,
    opacity 0.16s ease;
}

.journalit-setups-detail-action-icon:hover:not(:disabled),
.journalit-setups-detail-action-icon:focus-visible:not(:disabled) {
  border-color: var(--background-modifier-border-hover);
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-setups-detail-action-icon--primary {
  color: var(--text-normal);
}

.journalit-setups-detail-action-icon--primary:disabled {
  color: var(--text-muted);
  opacity: 0.52;
}

.journalit-setups-detail-back-button {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 0 4px;
  border: 1px solid transparent !important;
  border-radius: 0;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-muted) !important;
  cursor: pointer;
  font-size: var(--font-ui-smaller);
  font-weight: 600;
  line-height: 1;
  opacity: 0.92;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease,
    opacity 0.16s ease;
}

.journalit-setups-detail-back-button .journalit-obsidian-icon {
  flex: 0 0 auto;
  color: currentColor;
}

.journalit-setups-detail-back-button:hover,
.journalit-setups-detail-back-button:focus-visible {
  color: var(--text-normal) !important;
  border-color: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  opacity: 1;
  text-decoration: none;
  outline: none;
}

.journalit-setups-detail-header h2 {
  margin: 0;
  font-size: 18px;
}

.journalit-setup-card {
  position: relative;
  display: flex;
  min-height: 156px;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px 14px;
  overflow: hidden;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 72%, transparent), transparent),
    color-mix(in srgb, var(--background-primary) 88%, black 12%);
  box-shadow: none;
  text-align: left;
  cursor: pointer;
}

.theme-light .journalit-setup-card {
  border-color: color-mix(in srgb, var(--background-modifier-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 55%, transparent), transparent 42%),
    var(--background-primary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.journalit-setup-card--lifecycle-testing {
  border-style: dashed;
  border-color: rgba(var(--interactive-accent-rgb, 139, 92, 246), 0.42);
  background:
    linear-gradient(
      180deg,
      rgba(var(--interactive-accent-rgb, 139, 92, 246), 0.06),
      rgba(var(--mono-rgb-100), 0)
    ),
    color-mix(in srgb, var(--background-primary) 88%, black 12%);
}

.theme-light .journalit-setup-card--lifecycle-testing {
  background:
    linear-gradient(
      180deg,
      rgba(var(--interactive-accent-rgb, 139, 92, 246), 0.06),
      transparent 42%
    ),
    var(--background-primary);
}

.journalit-setup-card--lifecycle-testing .journalit-setup-card__title {
  color: var(--text-normal);
  text-decoration: underline;
  text-decoration-color: rgba(var(--interactive-accent-rgb, 139, 92, 246), 0.56);
  text-decoration-style: dotted;
  text-underline-offset: 4px;
}

.journalit-setup-card--lifecycle-archived {
  border-color: rgba(var(--mono-rgb-100), 0.09);
  background:
    linear-gradient(
      180deg,
      rgba(var(--mono-rgb-100), 0.018),
      rgba(var(--mono-rgb-0), 0.03)
    ),
    color-mix(in srgb, var(--background-primary) 88%, black 12%);
  opacity: 0.68;
}

.theme-light .journalit-setup-card--lifecycle-archived {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 40%, transparent), transparent 42%),
    var(--background-primary);
}

.journalit-setup-card--lifecycle-archived .journalit-setup-card__title,
.journalit-setup-card--lifecycle-archived .journalit-setup-card__metric-label,
.journalit-setup-card--lifecycle-archived .journalit-setup-card__footer {
  color: var(--text-muted);
}

.journalit-setup-card:hover,
.journalit-setup-card:focus-visible {
  border-color: rgba(var(--interactive-accent-rgb), 0.55);
  background:
    linear-gradient(
      180deg,
      rgba(var(--interactive-accent-rgb), 0.08),
      rgba(var(--mono-rgb-100), 0)
    ),
    color-mix(in srgb, var(--background-primary) 88%, black 12%);
  outline: none;
}

.theme-light .journalit-setup-card:hover,
.theme-light .journalit-setup-card:focus-visible {
  background:
    linear-gradient(180deg, rgba(var(--interactive-accent-rgb), 0.07), transparent 42%),
    var(--background-primary);
}

.journalit-setup-card--compare-mode {
  border-style: dashed;
}

.journalit-setup-card--compare-selected {
  border-color: var(--interactive-accent);
  background:
    linear-gradient(
      180deg,
      rgba(var(--interactive-accent-rgb), 0.12),
      rgba(var(--interactive-accent-rgb), 0.02)
    ),
    var(--background-secondary);
}

.journalit-setup-card--compare-disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.journalit-setup-card__compare-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--text-muted);
}

.journalit-setup-card--compare-selected .journalit-setup-card__compare-indicator {
  color: var(--text-accent);
}

.journalit-setup-card__identity {
  min-width: 0;
}

.journalit-setup-card__title {
  margin: 0;
  overflow: hidden;
  color: var(--text-normal);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-setup-card__status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  padding: 4px 10px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 7px;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.045em;
  line-height: 1;
  text-transform: uppercase;
}

.journalit-setup-card__status-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.85;
}

.journalit-setup-card__status--good {
  border-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.45);
  background: rgba(var(--color-green-rgb, 67, 160, 71), 0.1);
  color: var(--text-success);
}

.journalit-setup-card__status--monitor {
  border-color: rgba(var(--color-yellow-rgb, 245, 196, 67), 0.45);
  background: rgba(var(--color-yellow-rgb, 245, 196, 67), 0.1);
  color: var(--text-warning);
}

.journalit-setup-card__status--review {
  border-color: rgba(var(--color-red-rgb, 229, 57, 53), 0.5);
  background: rgba(var(--color-red-rgb, 229, 57, 53), 0.09);
  color: var(--text-error, #e53935);
}

.journalit-setup-card__metric-row {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.journalit-setup-card__metric-block {
  min-width: 0;
}

.journalit-setup-card__metric-block--win-rate {
  padding-left: 18px;
  border-left: 1px solid var(--background-modifier-border);
}

.journalit-setup-card__metric-label {
  display: block;
  margin-bottom: 5px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
}

.journalit-setup-card__expectancy-value,
.journalit-setup-card__win-rate-value {
  font-size: 23px;
  font-weight: 700;
  line-height: 1;
}

.journalit-setup-card__expectancy-value--positive:not(.journalit-privacy-mask) {
  color: var(--text-success);
}

.journalit-setup-card__expectancy-value--negative:not(.journalit-privacy-mask) {
  color: var(--text-error, #e53935);
}

.journalit-setup-card__expectancy-value--neutral,
.journalit-setup-card__win-rate-value {
  color: var(--text-normal);
}

.journalit-setup-card__sparkline {
  display: block;
  width: 100%;
  height: 52px;
  margin: 0 0 -2px;
  overflow: visible;
}

.journalit-setup-card__sparkline-baseline {
  stroke: var(--background-modifier-border);
  stroke-dasharray: 2 3;
  stroke-width: 1;
}

.journalit-setup-card__sparkline-line {
  fill: none;
  stroke: var(--text-muted);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.2;
  vector-effect: non-scaling-stroke;
}

.journalit-setup-card__sparkline-line--positive {
  stroke: var(--text-success);
}

.journalit-setup-card__sparkline-line--negative {
  stroke: var(--text-error, #e53935);
}

.journalit-setup-card__sparkline-line--neutral,
.journalit-setup-card__sparkline-line--masked {
  stroke: var(--text-muted);
}

.journalit-setup-card__sparkline-area {
  opacity: 1;
}

.journalit-setup-card__sparkline-gradient-start {
  stop-color: var(--text-muted);
  stop-opacity: 0.22;
}

.journalit-setup-card__sparkline-gradient-end {
  stop-color: var(--text-muted);
  stop-opacity: 0;
}

.journalit-setup-card__sparkline--positive .journalit-setup-card__sparkline-area {
  color: var(--text-success);
}

.journalit-setup-card__sparkline--positive .journalit-setup-card__sparkline-gradient-start {
  stop-color: var(--text-success);
}

.journalit-setup-card__sparkline--negative .journalit-setup-card__sparkline-area {
  color: var(--text-error, #e53935);
}

.journalit-setup-card__sparkline--negative .journalit-setup-card__sparkline-gradient-start {
  stop-color: var(--text-error, #e53935);
}

.journalit-setup-card__sparkline-gradient-start--positive,
.journalit-setup-card__sparkline--negative .journalit-setup-card__sparkline-gradient-start--positive {
  stop-color: var(--text-success);
}

.journalit-setup-card__sparkline-gradient-start--negative,
.journalit-setup-card__sparkline--positive .journalit-setup-card__sparkline-gradient-start--negative {
  stop-color: var(--text-error, #e53935);
}

.journalit-setup-card__footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-top: auto;
  padding-top: 2px;
  color: var(--text-muted);
  font-size: 13px;
}

.journalit-setup-card__reviewed {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
}

.journalit-setup-card__reviewed svg {
  flex-shrink: 0;
  color: var(--text-faint);
}

.journalit-setup-card__trades {
  flex-shrink: 0;
  text-align: right;
}

.journalit-setup-card__meta,
.journalit-setups-muted {
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-setups-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.journalit-setups-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--background-modifier-border);
  border-radius: 999px;
  padding: 2px 8px;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  background: var(--background-primary);
}

.journalit-setups-badge--active {
  color: var(--text-success);
  border-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.35);
}

.journalit-setups-badge--testing {
  color: var(--text-accent);
  border-color: var(--interactive-accent);
}

.journalit-setups-badge--archived,
.journalit-setups-badge--warning {
  color: var(--text-warning);
}

.journalit-setup-card__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.journalit-setup-card__metric-label {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-setup-card__metric-value {
  font-weight: 600;
}

.journalit-setups-ranked-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.journalit-setups-ranked-row {
  display: grid;
  grid-template-columns: minmax(140px, 1fr) minmax(160px, 2fr) minmax(90px, auto);
  gap: 12px;
  align-items: center;
}

.journalit-setups-ranked-bar-track {
  height: 10px;
  border-radius: 999px;
  background: var(--background-modifier-border);
  overflow: hidden;
}

.journalit-setups-ranked-bar-fill {
  width: var(--journalit-setup-rank-bar-width, 0%);
  height: 100%;
  border-radius: inherit;
  background: var(--interactive-accent);
}

.journalit-setups-privacy-note {
  margin: 0 0 10px;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-setups-advanced-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.journalit-setups-advanced-card {
  border: 1px solid var(--background-modifier-border);
  border-radius: 12px;
  background: var(--background-primary);
  padding: 12px;
}

.journalit-setups-advanced-card h3 {
  margin: 0 0 10px;
  font-size: 14px;
}

.journalit-setups-insight-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.journalit-setups-insight-list li {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.journalit-setups-insight-severity {
  align-self: flex-start;
  border: 1px solid var(--background-modifier-border);
  border-radius: 999px;
  padding: 1px 7px;
  font-size: var(--font-ui-smaller);
  color: var(--text-muted);
}

.journalit-setups-insight-severity--warning {
  color: var(--text-warning);
}

.journalit-setups-insight-severity--critical {
  color: var(--text-error);
}

.journalit-setups-detail-scaffold {
  display: grid;
  grid-template-columns: minmax(0, 1.85fr) minmax(300px, 0.9fr);
  gap: 14px;
  align-items: start;
}

.journalit-setups-detail-scaffold__panel {
  display: flex;
  min-height: 180px;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--background-modifier-border) 82%, transparent);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 72%, transparent), transparent),
    color-mix(in srgb, var(--background-primary) 88%, black 12%);
  color: var(--text-muted);
}

.theme-light .journalit-setups-detail-scaffold__panel {
  border-color: color-mix(in srgb, var(--background-modifier-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 55%, transparent), transparent 42%),
    var(--background-primary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.journalit-setups-detail-scaffold__panel h2 {
  margin: 4px 0 0;
  color: var(--text-normal);
  font-size: 16px;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.journalit-setups-detail-scaffold__panel p {
  max-width: 56ch;
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  line-height: 1.45;
}

.journalit-setups-detail-scaffold__eyebrow {
  color: var(--text-faint);
  font-size: var(--font-ui-smaller);
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.journalit-setups-detail-scaffold__hero {
  height: 430px;
  min-height: 430px;
}

.journalit-setups-detail-scaffold__evidence {
  height: 430px;
  min-height: 430px;
  overflow: auto;
}

.journalit-setups-detail-scaffold__playbook {
  min-height: 260px;
  justify-content: flex-start;
  gap: 0;
  padding: 0;
  overflow: visible;
}

.journalit-setups-detail-scaffold__rules {
  min-height: 0;
  align-self: start;
}

.journalit-setups-needs-attention {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 10px 16px;
  border-top: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent);
}

.journalit-setups-needs-attention__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.journalit-setups-needs-attention__header h2 {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: 650;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}

.journalit-setups-needs-attention__count {
  color: var(--text-faint);
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.06em;
  line-height: 1;
  text-transform: uppercase;
}

.journalit-setups-needs-attention__list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.journalit-setups-needs-attention__item,
.journalit-setups-needs-attention__empty {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  padding: 5px 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.journalit-setups-needs-attention__item +
  .journalit-setups-needs-attention__item {
  border-top: 1px solid rgba(var(--mono-rgb-100), 0.06);
}

.journalit-setups-needs-attention__empty {
  align-items: center;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-setups-needs-attention__empty .journalit-obsidian-icon {
  color: var(--text-success);
}

.journalit-setups-needs-attention__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 16px;
  height: 20px;
  color: var(--text-muted);
}

.journalit-setups-needs-attention__item--warning
  .journalit-setups-needs-attention__icon {
  color: var(--text-warning);
}

.journalit-setups-needs-attention__item--critical
  .journalit-setups-needs-attention__icon {
  color: var(--text-error);
}

.journalit-setups-needs-attention__item--success
  .journalit-setups-needs-attention__icon {
  color: var(--text-success);
}

.journalit-setups-needs-attention__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.journalit-setups-needs-attention__content strong {
  overflow: hidden;
  color: var(--text-normal);
  font-size: var(--font-ui-smaller);
  font-weight: 650;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-setups-needs-attention__content span {
  display: -webkit-box;
  overflow: hidden;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.25;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.journalit-setups-needs-attention__more-row {
  display: flex;
  padding: 6px 0 0 24px;
}

.journalit-setups-view button.journalit-setups-needs-attention__more-button {
  appearance: none;
  display: inline;
  height: auto;
  min-height: 0;
  padding: 0;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-muted) !important;
  cursor: pointer;
  font-size: var(--font-ui-smaller);
  font-weight: 400;
  line-height: 1.2;
  text-align: left;
  text-shadow: none !important;
  text-decoration: none;
  text-underline-offset: 2px;
}

.journalit-setups-view button.journalit-setups-needs-attention__more-button:hover,
.journalit-setups-view button.journalit-setups-needs-attention__more-button:focus-visible {
  border: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-accent) !important;
  text-decoration: underline;
  text-underline-offset: 2px;
  outline: none;
}

.journalit-setups-rules-panel {
  display: flex;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--background-modifier-border) 82%, transparent);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 72%, transparent), transparent),
    color-mix(in srgb, var(--background-primary) 88%, black 12%);
}

.theme-light .journalit-setups-rules-panel {
  border-color: color-mix(in srgb, var(--background-modifier-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 55%, transparent), transparent 42%),
    var(--background-primary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.journalit-setups-rules-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent);
}

.journalit-setups-rules-panel__header h2 {
  margin: 0;
  color: var(--text-normal);
  font-size: 16px;
  font-weight: 650;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.journalit-setups-rules-panel__header p {
  margin: 3px 0 0;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  line-height: 1.3;
}

.journalit-setups-rules-panel__empty {
  padding: 16px;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-setups-rules-panel__body {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
}

.journalit-setups-rules-panel__meta {
  padding: 10px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 64%, transparent);
  color: var(--text-faint);
  font-size: var(--font-ui-smaller);
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.journalit-setups-rules-grouped-chips {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  margin: 0;
  padding: 0;
  overflow: auto;
}

.journalit-setups-rules-chip-group {
  display: grid;
  grid-template-columns: minmax(88px, 0.58fr) minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  padding: 10px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 58%, transparent);
}

.journalit-setups-rules-chip-group:last-child {
  border-bottom: 0;
}

.journalit-setups-rules-chip-group h3 {
  margin: 0;
  padding-top: 3px;
  color: var(--text-faint);
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.06em;
  line-height: 1.15;
  text-transform: uppercase;
  white-space: normal;
}

.journalit-setups-rules-chip-list {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.journalit-setups-rule-chip {
  display: inline-flex;
  max-width: 100%;
}

.journalit-setups-rule-chip__tooltip-trigger {
  max-width: 100%;
}

.journalit-setups-rule-chip__content {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 7px;
  min-height: 22px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  font-size: var(--font-ui-smaller);
  font-weight: 600;
  line-height: 1.3;
}

.journalit-setups-rule-chip__content .journalit-obsidian-icon {
  flex: 0 0 auto;
  color: var(--text-muted);
  opacity: 0.95;
}

.journalit-setups-rule-chip__content span {
  min-width: 0;
  overflow-wrap: anywhere;
  font-weight: 500;
  white-space: normal;
}

.journalit-setups-rule-chip-tooltip {
  max-width: 260px;
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  line-height: 1.4;
}

.journalit-setups-rules-panel__empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  min-height: 0;
  flex: 1 1 auto;
}

.journalit-setups-rules-panel__empty h3 {
  margin: 0 0 4px;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.journalit-setups-rules-panel__empty p {
  margin: 0;
  max-width: 440px;
  line-height: 1.45;
}

.journalit-setups-rules-panel__template-preview {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
}

.journalit-setups-rules-panel__template-preview > span {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 7px 10px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: rgba(var(--mono-rgb-100), 0.04);
  box-shadow: inset 0 1px 0 rgba(var(--mono-rgb-100), 0.025);
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  font-weight: 600;
}

.journalit-setups-rules-panel__template-preview > span > .journalit-obsidian-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--text-muted) 22%, transparent);
  border-radius: 999px;
  background: rgba(var(--mono-rgb-100), 0.035);
  color: color-mix(in srgb, var(--text-normal) 76%, transparent);
  opacity: 1;
}

.journalit-setups-rules-panel__empty-actions {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  padding-top: 0;
}

.journalit-setups-view .journalit-setups-rules-panel__empty-actions button.journalit-setups-button {
  display: inline-flex;
  width: auto;
  flex: 0 0 auto;
  min-height: 34px;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  box-shadow: none;
  font-size: var(--font-ui-small);
  font-weight: 600;
}

.journalit-setups-view .journalit-setups-rules-panel__empty-actions button.journalit-setups-button--primary {
  border: 1px solid color-mix(in srgb, var(--interactive-accent) 72%, transparent);
  background: color-mix(in srgb, var(--interactive-accent) 72%, var(--background-secondary));
  color: var(--text-on-accent);
}

.journalit-setups-view .journalit-setups-rules-panel__empty-actions button.journalit-setups-button--primary:hover {
  border-color: var(--interactive-accent);
  background: color-mix(in srgb, var(--interactive-accent) 82%, var(--background-secondary));
}

.journalit-setups-view .journalit-setups-rules-panel__empty-actions button.journalit-setups-button--ghost {
  min-height: 30px;
  padding: 5px 0;
  border: 0;
  background: transparent;
  color: var(--text-muted);
}

.journalit-setups-view .journalit-setups-rules-panel__empty-actions button.journalit-setups-button--ghost:hover {
  background: transparent;
  color: var(--text-normal);
}

.modal.journalit-setups-rules-modal .modal-content {
  padding: 0;
  overflow: hidden;
}

.journalit-setups-rules-editor {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: min(620px, 72vh);
  max-height: 72vh;
  flex-direction: column;
  overflow: hidden;
}

.journalit-setups-rules-editor__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px 6px;
}

.journalit-setups-rules-editor__body {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 12px 14px;
}

.journalit-setups-rules-editor__groups {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-secondary);
}

.journalit-setups-rules-editor__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: 650;
}

.journalit-setups-rules-editor__section-header .journalit-setups-button {
  min-height: 26px;
  padding: 3px 8px;
}

.journalit-setups-rules-editor__group-name {
  display: flex;
  gap: 6px;
  align-items: center;
  min-width: 0;
}

.journalit-setups-rules-editor__group-name input[type='text'] {
  flex: 1;
  min-width: 0;
}

.journalit-create-setup-modal .journalit-delete-setup-button {
  margin-right: auto;
}

.journalit-setup-delete-confirmation-modal__warning {
  margin: 0;
  padding: 12px;
  border: 1px solid var(--background-modifier-error);
  border-radius: var(--radius-s);
  background: color-mix(
    in srgb,
    var(--background-modifier-error) 12%,
    transparent
  );
  color: var(--text-normal);
}

.journalit-setup-delete-confirmation-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 18px;
}

.journalit-setup-delete-confirmation-modal__cancel,
.journalit-setup-delete-confirmation-modal__delete {
  cursor: pointer;
}

.journalit-setups-rules-editor__empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border: 1px dashed var(--background-modifier-border);
  border-radius: 8px;
  padding: 18px;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-setups-rules-editor__empty h3 {
  margin: 0;
  color: var(--text-normal);
  font-size: var(--font-ui-medium);
  font-weight: 650;
}

.journalit-setups-rules-editor__empty p {
  margin: 0;
  line-height: 1.45;
}

.journalit-setups-rules-editor__error {
  border: 1px solid rgba(var(--color-red-rgb, 255, 80, 80), 0.32);
  border-radius: 8px;
  background: rgba(var(--color-red-rgb, 255, 80, 80), 0.08);
  color: var(--text-error);
  font-size: var(--font-ui-small);
  padding: 10px 12px;
}

.journalit-setups-rules-editor-row {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  grid-template-columns: 24px minmax(0, 1fr) 28px;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-secondary);
}

.journalit-setups-rules-editor-row__order {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--background-primary);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: 650;
}

.journalit-setups-rules-editor-row__fields {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 10px;
}

.journalit-setups-rules-editor-row__fields label,
.journalit-setups-rules-editor-row__meta label {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: 600;
}

.journalit-setups-rules-editor-row__fields input[type='text'],
.journalit-setups-rules-editor-row__fields textarea,
.journalit-setups-rules-editor-row__fields select {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: var(--font-ui-small);
}

.journalit-setups-rules-editor-row__fields textarea {
  resize: vertical;
}

.journalit-setups-rules-editor-row__meta {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: end;
}

.journalit-setups-rules-editor-row__meta .journalit-setups-rules-editor-row__required {
  flex-direction: row;
  align-items: center;
  padding-bottom: 7px;
  color: var(--text-normal);
  font-weight: 500;
}

.journalit-setups-rules-editor-row__actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.journalit-setups-rules-editor-row__actions .journalit-setups-icon-button {
  width: 26px;
  height: 26px;
}

.journalit-setups-rules-editor__footer {
  flex: 0 0 auto;
  border-top: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
}

.journalit-setups-rules-editor__footer > div {
  display: flex;
  gap: 8px;
}

.journalit-setups-playbook-notebook__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent);
}

.journalit-setups-playbook-notebook__header h2 {
  margin: 0;
  color: var(--text-normal);
  font-size: 16px;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.journalit-setups-playbook-notebook__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.journalit-setups-playbook-note-embed,
.journalit-setups-playbook-notebook__empty {
  margin: 0;
  padding: 16px 18px;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  line-height: 1.45;
}

.journalit-setups-playbook-note-embed__content {
  padding: 16px 18px;
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  line-height: 1.5;
}

.journalit-setups-playbook-note-embed__content > :first-child {
  margin-top: 0;
}

.journalit-setups-playbook-note-embed__content > :last-child {
  margin-bottom: 0;
}

.journalit-setups-playbook-note-embed .journalit-excalidraw-media {
  min-height: 0;
  border: 0;
  background: transparent;
  overflow: visible;
}

.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed {
  min-height: 0;
  align-items: flex-start;
  justify-content: center;
  padding: 12px;
}

.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed p,
.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed .internal-embed,
.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed .media-embed,
.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed .image-embed {
  display: flex;
  justify-content: center;
  width: 100% !important;
  margin: 0;
}

.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed .excalidraw-svg,
.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed .excalidraw-embedded-img {
  width: min(100%, 1000px) !important;
  margin: 0 auto;
}

.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed .internal-embed,
.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed .media-embed,
.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed .image-embed,
.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed img,
.journalit-setups-playbook-note-embed .journalit-excalidraw-media__embed svg {
  width: 100% !important;
  max-height: none;
}

.journalit-setups-brief {
  gap: 0;
  justify-content: flex-start;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0;
}

.journalit-setups-brief__section {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 7px;
  padding: 12px 16px;
  border-top: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent);
}

.journalit-setups-brief__screenshots-section {
  margin-top: auto;
}

.journalit-setups-brief__section:first-child {
  border-top: 0;
}

.journalit-setups-brief__section h2 {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.journalit-setups-brief__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
}

.journalit-setups-view button.journalit-setups-brief__view-all {
  appearance: none;
  width: auto;
  height: auto;
  min-height: 0;
  padding: 2px 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: var(--font-ui-smaller);
  font-weight: 600;
  line-height: 1.2;
}

.journalit-setups-view button.journalit-setups-brief__view-all:hover,
.journalit-setups-view button.journalit-setups-brief__view-all:focus-visible {
  background: transparent;
  box-shadow: none;
  color: var(--text-accent);
  outline: none;
}

.journalit-setups-brief__section-action {
  width: 24px;
  height: 24px;
}

.journalit-setups-brief__health-value {
  color: var(--text-success);
  font-size: 17px;
  font-weight: 700;
  line-height: 1;
}

.journalit-setups-brief__health-bar {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--background-modifier-border);
}

.journalit-setups-brief__health-segment {
  background: var(--background-modifier-hover);
}

.journalit-setups-brief__health-segment--complete {
  background: var(--color-green);
}

.journalit-setups-brief__health-segment + .journalit-setups-brief__health-segment {
  border-left: 2px solid var(--background-secondary);
}

.journalit-setups-brief__count-rail {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.2;
  white-space: nowrap;
}

.journalit-setups-brief__count-rail > span {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.journalit-setups-brief__count-rail > span:not(:last-child)::after {
  content: '·';
  margin-left: 5px;
  color: var(--text-faint);
}

.journalit-setups-brief__count-rail strong {
  color: var(--text-normal);
  font-size: 14px;
  font-weight: 600;
}

.journalit-setups-brief__profile-list {
  display: grid;
  gap: 5px;
  margin: 0;
}

.journalit-setups-brief__profile-list div {
  display: flex;
  align-items: baseline;
  gap: 12px;
  min-width: 0;
}

.journalit-setups-brief__profile-list dt {
  flex: 0 0 68px;
  min-width: 68px;
  overflow: hidden;
  color: var(--text-faint);
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.journalit-setups-brief__profile-list dd {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  color: var(--text-normal);
  font-size: var(--font-ui-smaller);
  font-weight: 500;
  overflow-wrap: anywhere;
  text-align: left;
  white-space: normal;
}

.journalit-setups-brief__notes-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.journalit-setups-brief__notes-list li {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-setups-brief__note-link {
  display: inline;
  max-width: 100%;
  overflow: hidden;
  color: var(--text-normal);
  cursor: pointer;
  font-size: var(--font-ui-smaller);
  font-weight: 400;
  text-overflow: ellipsis;
  text-decoration: none;
  white-space: nowrap;
}

.journalit-setups-brief__note-link:hover,
.journalit-setups-brief__note-link:focus-visible {
  color: var(--text-accent);
  outline: none;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.journalit-setups-brief__more-note {
  all: unset;
  display: inline;
  width: fit-content;
  max-width: 100%;
  color: var(--text-muted);
  cursor: pointer;
  font-family: var(--font-interface);
  font-size: var(--font-ui-smaller);
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
}

.journalit-setups-brief__more-note:hover,
.journalit-setups-brief__more-note:focus-visible {
  color: var(--text-accent);
  background: transparent !important;
  box-shadow: none !important;
  outline: none;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.journalit-setups-brief__screenshot-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
}

.journalit-setups-brief__screenshot-button {
  appearance: none;
  display: block;
  min-height: 0;
  height: auto;
  padding: 0 !important;
  overflow: hidden;
  border: 0 !important;
  border-radius: 7px;
  background: transparent !important;
  box-shadow: none !important;
  cursor: pointer;
}

.journalit-setups-brief__screenshot-button:hover .journalit-setups-brief__screenshot,
.journalit-setups-brief__screenshot-button:focus-visible .journalit-setups-brief__screenshot {
  border-color: var(--text-muted);
}

.journalit-setups-brief__screenshot-button:focus-visible {
  outline: 2px solid var(--background-modifier-border-focus);
  outline-offset: 2px;
}

.journalit-setups-brief__screenshot {
  aspect-ratio: 1.55;
  overflow: hidden;
  border: 1px solid var(--background-modifier-border);
  border-radius: 7px;
  background: var(--background-primary);
}

.journalit-setups-brief__screenshot .lazy-image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.journalit-setups-brief__screenshot .lazy-image-placeholder,
.journalit-setups-brief__screenshot .lazy-image-error {
  min-height: 100%;
  font-size: var(--font-ui-smaller);
}

 .modal.journalit-setups-linked-notes-modal {
  width: min(520px, 92vw);
}

.modal.journalit-setups-linked-notes-modal .modal-content {
  padding-bottom: 8px;
}

.journalit-setups-linked-notes-modal__subtitle {
  margin: 0 0 12px;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-setups-linked-notes-modal__list {
  display: flex;
  max-height: 360px;
  flex-direction: column;
  gap: 0;
  margin: 0;
  overflow-y: auto;
  padding: 0;
  list-style: none;
}

.journalit-setups-linked-notes-modal__list a {
  display: block;
  overflow: hidden;
  border-radius: 6px;
  padding: 8px 10px;
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-setups-linked-notes-modal__list a:hover,
.journalit-setups-linked-notes-modal__list a:focus-visible {
  background: var(--background-modifier-hover);
  color: var(--text-accent);
  outline: none;
}

.journalit-setups-playbook-note-modal__picker {
  height: 360px;
  min-height: 0;
}

.journalit-setups-detail-performance {
  --journalit-setup-detail-performance-line: var(
    --chart-positive,
    var(--text-success, #43a047)
  );
  justify-content: flex-start;
  gap: 6px;
  overflow: hidden;
  padding: 0;
  position: relative;
}

.journalit-setups-detail-performance--negative {
  --journalit-setup-detail-performance-line: var(
    --chart-negative,
    var(--text-error, #e53935)
  );
}

.journalit-setups-detail-performance--neutral {
  --journalit-setup-detail-performance-line: var(--text-muted);
}

.journalit-setups-detail-performance--masked {
  --journalit-setup-detail-performance-line: var(--text-muted);
}

.journalit-setups-detail-tabs,
.journalit-setups-detail-performance__tabs {
  display: flex;
  height: 32px;
  align-items: center;
  justify-content: center;
}

.journalit-setups-detail-performance__toolbar {
  display: grid;
  grid-template-columns: minmax(138px, 1fr) auto minmax(138px, 1fr);
  min-height: 38px;
  align-items: center;
  padding: 3px 12px;
}

.journalit-setups-detail-performance__toolbar .journalit-setups-detail-tabs {
  grid-column: 2;
}

button.journalit-setups-detail-tab,
button.journalit-setups-detail-performance__tab {
  position: relative;
  min-width: 80px;
  height: 30px;
  padding: 0 10px;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

button.journalit-setups-detail-tab::after,
button.journalit-setups-detail-performance__tab::after {
  position: absolute;
  right: 16px;
  bottom: 2px;
  left: 16px;
  height: 2px;
  background: transparent;
  content: '';
}

button.journalit-setups-detail-tab:hover,
button.journalit-setups-detail-tab:focus-visible,
button.journalit-setups-detail-tab--active,
button.journalit-setups-detail-performance__tab:hover,
button.journalit-setups-detail-performance__tab:focus-visible,
button.journalit-setups-detail-performance__tab--active {
  color: var(--text-normal);
}

button.journalit-setups-detail-tab--active::after,
button.journalit-setups-detail-performance__tab--active::after {
  background: var(--interactive-accent);
}

.journalit-setups-detail-tab__badge {
  margin-left: 6px;
  color: var(--text-faint);
  font-size: 11px;
  font-weight: 700;
}

.journalit-setups-detail-performance__header {
  display: block;
  padding: 12px 18px 0;
}

.journalit-setups-detail-performance__chart-mode {
  position: relative;
  z-index: 2;
  grid-column: 3;
  justify-self: end;
  display: inline-flex;
  overflow: visible;
}

button.journalit-toolbar-button.journalit-setups-detail-performance__chart-mode-trigger {
  min-width: 138px;
  height: 30px;
  justify-content: space-between;
  gap: 12px;
  padding: 0 10px 0 12px;
  background: color-mix(in srgb, var(--background-primary) 72%, transparent);
  border: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent);
  border-radius: 6px;
  box-shadow: none;
  color: var(--text-normal);
  font-weight: 500;
}

button.journalit-toolbar-button.journalit-setups-detail-performance__chart-mode-trigger:hover:not(:disabled),
button.journalit-toolbar-button.journalit-setups-detail-performance__chart-mode-trigger:focus-visible:not(:disabled) {
  background: color-mix(in srgb, var(--background-primary) 82%, var(--background-modifier-hover));
  border-color: var(--background-modifier-border-hover);
  color: var(--text-normal);
}

.journalit-setups-detail-performance__chart-mode-dropdown {
  min-width: 154px;
  padding: 0;
  background: var(--background-primary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px;
  box-shadow: none !important;
  z-index: 1000;
}

.journalit-setups-detail-performance__chart-mode-dropdown .journalit-home-period-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 26px;
  padding: 4px 8px;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
  appearance: none;
}

.journalit-setups-detail-performance__chart-mode-dropdown .journalit-home-period-option:hover,
.journalit-setups-detail-performance__chart-mode-dropdown .journalit-home-period-option:focus-visible {
  background: var(--background-modifier-hover) !important;
}

.journalit-setups-detail-performance__chart-mode-dropdown .journalit-home-period-option__check {
  width: 13px;
  height: 13px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 2px;
  background: transparent;
  color: var(--text-on-accent);
  font-size: 10px;
  line-height: 1;
}

.journalit-setups-detail-performance__chart-mode-dropdown .journalit-home-period-option--active .journalit-home-period-option__check {
  background: var(--interactive-accent);
  border-color: var(--interactive-accent);
}


.journalit-setups-detail-performance__chart-mode-dropdown {
  padding: 0;
  background: var(--background-primary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px;
  box-shadow: none !important;
  z-index: 1000;
}

.journalit-setups-detail-performance__chart-mode-dropdown .journalit-home-period-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 26px;
  padding: 4px 8px;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
  appearance: none;
}

.journalit-setups-detail-performance__chart-mode-dropdown .journalit-home-period-option:hover,
.journalit-setups-detail-performance__chart-mode-dropdown .journalit-home-period-option:focus-visible {
  background: var(--background-modifier-hover) !important;
}

.journalit-setups-detail-performance__chart-mode-dropdown .journalit-home-period-option__check {
  width: 13px;
  height: 13px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 2px;
  background: transparent;
  color: var(--text-on-accent);
  font-size: 10px;
  line-height: 1;
}

.journalit-setups-detail-performance__chart-mode-dropdown .journalit-home-period-option--active .journalit-home-period-option__check {
  background: var(--interactive-accent);
  border-color: var(--interactive-accent);
}

.journalit-setups-detail-performance__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: 0;
  align-items: start;
}

.journalit-setups-detail-performance__stat {
  min-width: 0;
  padding: 0 6px;
  border-left: 1px solid var(--background-modifier-border);
  text-align: center;
}

.journalit-setups-detail-performance__stat:first-child {
  border-left: 0;
  padding-left: 14px;
}

.journalit-setups-detail-performance__stat:last-child {
  padding-right: 14px;
}

.journalit-setups-detail-performance__stat-label {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 6px;
  overflow: hidden;
  color: var(--text-faint);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.journalit-setups-detail-performance__stat-label-with-info {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.journalit-setups-detail-performance__stat-info-trigger {
  display: inline-flex;
  align-items: center;
}

.journalit-setups-detail-performance__stat-info-trigger .journalit-dashboard-metric-info {
  color: var(--text-muted);
  opacity: 0.8;
}

.journalit-setups-detail-performance__stat-value {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: flex-start;
  justify-content: center;
  color: var(--text-normal);
  font-size: 24px;
  font-weight: 600;
  gap: 6px;
  line-height: 1.05;
  white-space: nowrap;
}

.journalit-setups-detail-performance__stat-primary {
  display: inline-flex;
  min-width: 0;
  flex: 0 0 auto;
  align-items: baseline;
  overflow: visible;
  line-height: 1.05;
  white-space: nowrap;
}

.journalit-setups-detail-performance__stat-primary .journalit-display-value {
  display: inline !important;
  font-size: inherit !important;
  font-weight: inherit;
  line-height: inherit;
  overflow: visible !important;
}

.journalit-setups-detail-performance__stat-cents {
  display: inline-block;
  margin-left: 1px;
  font-size: 16px;
  font-weight: 500;
  opacity: 0.7;
}

.journalit-setups-detail-performance__stat--positive .journalit-setups-detail-performance__stat-value,
.journalit-setups-detail-performance__stat--positive .journalit-display-value {
  color: var(--chart-positive, var(--text-success, #43a047));
}

.journalit-setups-detail-performance__stat--negative .journalit-setups-detail-performance__stat-value,
.journalit-setups-detail-performance__stat--negative .journalit-display-value {
  color: var(--chart-negative, var(--text-error, #e53935));
}

.journalit-setups-detail-performance__stat--neutral .journalit-setups-detail-performance__stat-value,
.journalit-setups-detail-performance__stat--neutral .journalit-display-value {
  color: var(--text-normal);
}

.journalit-setups-detail-performance__stat--warning .journalit-setups-detail-performance__stat-value,
.journalit-setups-detail-performance__stat--warning .journalit-display-value {
  color: var(--color-orange, #ff9800);
}

.journalit-setups-detail-performance__stat--info .journalit-setups-detail-performance__stat-value,
.journalit-setups-detail-performance__stat--info .journalit-display-value {
  color: var(--text-normal);
}

.journalit-setups-detail-performance__chart {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  padding: 8px 10px 6px 6px;
  margin-top: 0;
}

.journalit-setups-detail-performance__chart--overlay-control {
  padding-top: 26px;
}

.journalit-setups-detail-performance__chart--overlay-control
  .journalit-setups-detail-performance__chart-mode {
  position: absolute;
  top: 8px;
  right: 12px;
  grid-column: auto;
}

.journalit-setups-detail-performance__chart .chart-base,
.journalit-setups-detail-performance__shared-chart {
  height: 100% !important;
}

.journalit-setups-detail-performance__empty {
  display: flex;
  min-height: 240px;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-setups-execution-gap {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  padding: 0 10px 2px 0;
}

.journalit-setups-execution-gap__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 4px;
}

.journalit-setups-execution-gap__header h3 {
  margin: 0;
  color: var(--text-normal);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.1;
  text-transform: uppercase;
}

.journalit-setups-execution-gap__header p {
  margin: 4px 0 0;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
}

.journalit-setups-execution-gap__summary {
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.journalit-setups-execution-gap__summary strong {
  color: var(--text-normal);
  font-size: 20px;
  letter-spacing: 0;
}

.journalit-setups-execution-gap__plot {
  position: relative;
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  padding-top: 0;
}

.journalit-setups-execution-gap__axis {
  position: absolute;
  top: 22px;
  right: 0;
  bottom: 34px;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.journalit-setups-execution-gap__axis span {
  border-top: 1px dashed color-mix(in srgb, var(--text-faint) 22%, transparent);
}

.journalit-setups-execution-gap__bars {
  position: relative;
  display: grid;
  min-height: 220px;
  flex: 1 1 auto;
  grid-template-columns: minmax(150px, 260px) minmax(150px, 260px);
  align-items: end;
  justify-content: center;
  gap: clamp(42px, 9vw, 120px);
  padding-top: 14px;
  padding-right: 86px;
  border-bottom: 1px solid color-mix(in srgb, var(--text-muted) 44%, transparent);
}

.journalit-setups-execution-gap__bar-stack {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 166px;
  flex-direction: column;
  justify-content: flex-end;
}

.journalit-setups-execution-gap__bar,
.journalit-setups-execution-gap__missed-extension {
  display: flex;
  min-height: 24px;
  height: var(--bar-height);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 65%, transparent);
  color: var(--text-normal);
  text-align: center;
}

.journalit-setups-execution-gap__bar--live {
  background: linear-gradient(180deg, color-mix(in srgb, var(--chart-positive, #43a047) 88%, white 8%), color-mix(in srgb, var(--chart-positive, #43a047) 66%, black 28%));
  color: white;
}

.journalit-setups-execution-gap__bar--backtest {
  background: linear-gradient(180deg, color-mix(in srgb, var(--color-blue, #42a5f5) 88%, white 8%), color-mix(in srgb, var(--color-blue, #42a5f5) 62%, black 30%));
  color: white;
}

.journalit-setups-execution-gap__missed-extension {
  background:
    repeating-linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-orange, #ff9800) 42%, transparent) 0 2px,
      transparent 2px 9px
    ),
    color-mix(in srgb, var(--background-primary) 76%, transparent);
  color: var(--color-orange, #ff9800);
}

.journalit-setups-execution-gap__bar span,
.journalit-setups-execution-gap__missed-extension span,
.journalit-setups-execution-gap__potential-marker span,
.journalit-setups-execution-gap__gap-bracket span {
  font-size: 12px;
  font-weight: 600;
}

.journalit-setups-execution-gap__bar strong,
.journalit-setups-execution-gap__missed-extension strong,
.journalit-setups-execution-gap__potential-marker strong,
.journalit-setups-execution-gap__gap-bracket strong {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}

.journalit-setups-execution-gap__potential-marker {
  position: absolute;
  right: -18px;
  left: -18px;
  top: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--text-normal);
  text-align: center;
}

.journalit-setups-execution-gap__potential-marker::after {
  position: absolute;
  right: -72px;
  left: 50%;
  bottom: -22px;
  border-top: 1px dashed var(--text-muted);
  content: '';
}

.journalit-setups-execution-gap__gap-bracket {
  display: none;
}

.journalit-setups-execution-gap__gap-bracket::before {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: -18px;
  width: 10px;
  border-top: 2px dashed currentColor;
  border-bottom: 2px dashed currentColor;
  border-left: 2px dashed currentColor;
  content: '';
}

.journalit-setups-execution-gap__gap-bracket small {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  font-weight: 600;
}

.journalit-setups-execution-gap__labels {
  display: grid;
  grid-template-columns: minmax(150px, 260px) minmax(150px, 260px);
  justify-content: center;
  gap: clamp(42px, 9vw, 120px);
  padding-top: 8px;
  color: var(--text-normal);
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}


.journalit-setups-execution-gap__masked {
  display: flex;
  height: 100%;
  min-height: 220px;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-setups-empty,
.journalit-setups-error,
.journalit-setups-loading {
  border: 1px solid var(--background-modifier-border);
  border-radius: 14px;
  background: var(--background-secondary);
  padding: 18px;
  color: var(--text-muted);
}

.journalit-setups-compare-page {
  --journalit-setup-compare-line-1: var(--chart-positive, #4ade80);
  --journalit-setup-compare-line-2: var(--color-blue, #5b8cff);
  --journalit-setup-edge-positive: var(--chart-positive, #4ade80);
  --journalit-setup-edge-negative: var(--chart-negative, #f87171);
}

.journalit-setups-compare-header,
.journalit-setups-compare-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.journalit-setups-compare-header {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  min-height: 32px;
}

.journalit-setups-compare-header__title {
  position: absolute;
  left: 50%;
  margin: 0;
  width: min(760px, calc(100% - 180px));
  height: 28px;
  overflow: hidden;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  transform: translateX(-50%);
  white-space: nowrap;
}

.journalit-setups-compare-header__setup-name {
  position: absolute;
  top: 0;
  width: calc(50% - 34px);
  overflow: hidden;
  text-overflow: ellipsis;
}

.journalit-setups-compare-header__setup-name--left {
  right: calc(50% + 34px);
  text-align: right;
}

.journalit-setups-compare-header__setup-name--right {
  left: calc(50% + 34px);
  text-align: left;
}

.journalit-setups-compare-header__vs {
  position: absolute;
  top: 50%;
  left: 50%;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: translate(-50%, -50%);
}

.journalit-setups-compare-header .journalit-setups-detail-back-button {
  position: relative;
  z-index: 1;
  min-height: 28px;
  padding-inline: 4px;
  border-radius: 0;
}

.journalit-setups-view button.journalit-setups-detail-back-button,
.journalit-setups-view button.journalit-setups-detail-back-button:hover,
.journalit-setups-view button.journalit-setups-detail-back-button:focus-visible {
  background: rgba(var(--mono-rgb-100), 0.045) !important;
  background-color: rgba(var(--mono-rgb-100), 0.045) !important;
  background-image: none !important;
  box-shadow: 0 1px 0 rgba(var(--mono-rgb-100), 0.04) inset !important;
}

.journalit-setups-view button.journalit-setups-detail-back-button {
  border-color: var(--background-modifier-border) !important;
  border-radius: 7px;
  padding-inline: 10px;
}

.journalit-setups-view button.journalit-setups-detail-back-button:hover,
.journalit-setups-view button.journalit-setups-detail-back-button:focus-visible {
  border-color: var(--background-modifier-border-hover) !important;
  background: var(--background-modifier-hover) !important;
  background-color: var(--background-modifier-hover) !important;
}

.journalit-setups-compare-edge-card {
  display: grid;
  grid-template-columns: minmax(250px, 1.25fr) minmax(130px, 0.7fr) minmax(145px, 0.75fr) minmax(260px, 1.55fr);
  margin: 0 0 18px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--background-modifier-border) 82%, transparent);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 72%, transparent), transparent),
    color-mix(in srgb, var(--background-primary) 88%, black 12%);
}

.journalit-setups-compare-edge-card--masked {
  display: block;
  padding: 16px 18px;
}

.journalit-setups-compare-edge-card--masked .journalit-setups-privacy-note {
  margin: 0;
}

.theme-light .journalit-setups-compare-edge-card {
  border-color: color-mix(in srgb, var(--background-modifier-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 55%, transparent), transparent 42%),
    var(--background-primary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.journalit-setups-compare-edge-card__stat {
  align-items: center;
  text-align: center;
}

.journalit-setups-compare-edge-card__stat {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 14px 16px;
}

.journalit-setups-compare-edge-card__primary {
  position: relative;
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  align-items: center;
  justify-content: start;
  gap: 14px;
  padding: 14px 18px 14px 20px;
}

.journalit-setups-compare-edge-card__primary::after,
.journalit-setups-compare-edge-card__stat::after {
  content: '';
  position: absolute;
  top: 10%;
  right: 0;
  width: 1px;
  height: 80%;
  background: color-mix(in srgb, var(--background-modifier-border) 72%, transparent);
}

.journalit-setups-compare-edge-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-radius: 50%;
  background: rgba(74, 222, 128, 0.14);
  color: var(--chart-positive, #4ade80);
}

.journalit-setups-compare-edge-card__stat:last-of-type::after {
  display: none;
}

.journalit-setups-compare-edge-card__eyebrow,
.journalit-setups-compare-edge-card__stat span:first-child {
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.055em;
  text-transform: uppercase;
}

.journalit-setups-compare-edge-card__primary strong {
  display: block;
  overflow: hidden;
  color: var(--chart-positive, #4ade80);
  font-size: 18px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-setups-compare-edge-card__strength {
  display: block;
  margin-top: 4px;
  color: var(--chart-positive, #4ade80);
  font-size: var(--font-ui-small);
  font-weight: 650;
}

.journalit-setups-compare-edge-card__stat strong,
.journalit-setups-compare-edge-card__stat .journalit-display-value {
  color: var(--text-normal);
  font-size: 18px;
  font-weight: 750;
}

.journalit-setups-compare-confidence {
  display: flex;
  align-items: center;
  gap: 12px;
}

.journalit-setups-compare-confidence__gauge {
  position: relative;
  display: inline-block;
  width: 54px;
  height: 28px;
  overflow: hidden;
}

.journalit-setups-compare-confidence__gauge::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 8px solid var(--background-modifier-border);
  border-bottom: 0;
  border-radius: 54px 54px 0 0;
}

.journalit-setups-compare-confidence__gauge::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 8px solid var(--text-warning);
  border-right-color: transparent;
  border-bottom: 0;
  border-radius: 54px 54px 0 0;
}

.journalit-setups-compare-confidence__gauge--low::after {
  border-color: var(--text-error);
  border-right-color: transparent;
  transform: rotate(-38deg);
  transform-origin: 50% 100%;
}

.journalit-setups-compare-confidence__gauge--moderate::after {
  border-color: var(--text-warning);
  border-right-color: transparent;
  transform: rotate(0deg);
  transform-origin: 50% 100%;
}

.journalit-setups-compare-confidence__gauge--high::after {
  border-color: var(--chart-positive, #4ade80);
  border-right-color: var(--chart-positive, #4ade80);
}

.journalit-setups-compare-confidence__label--low {
  color: var(--text-error) !important;
}

.journalit-setups-compare-confidence__label--moderate {
  color: var(--text-warning) !important;
}

.journalit-setups-compare-confidence__label--high {
  color: var(--chart-positive, #4ade80) !important;
}

.journalit-setups-compare-edge-card__reasons {
  display: grid;
  gap: 7px;
  padding: 12px 14px;
}

.journalit-setups-compare-edge-reason {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-setups-compare-edge-reason strong {
  color: var(--text-normal);
  font-weight: 650;
}

.journalit-setups-compare-edge-reason--positive svg,
.journalit-setups-compare-edge-reason--positive strong .journalit-display-value,
.journalit-setups-compare-edge-reason--positive .journalit-setups-compare-edge-delta {
  color: var(--chart-positive, #4ade80);
}

.journalit-setups-compare-edge-reason--negative svg,
.journalit-setups-compare-edge-reason--negative strong .journalit-display-value,
.journalit-setups-compare-edge-reason--negative .journalit-setups-compare-edge-delta {
  color: var(--text-error);
}

.journalit-setups-compare-edge-reason--neutral svg {
  color: var(--text-faint);
}

.journalit-setups-compare-body-card {
  background: transparent;
  padding: 0;
}

.journalit-setups-compare-body-card .journalit-setups-section-title {
  color: var(--text-normal);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-transform: none;
}

.journalit-setups-compare-main-grid {
  display: grid;
  grid-template-columns: minmax(440px, 0.8fr) minmax(0, 1.2fr);
  align-items: stretch;
  gap: 24px;
  margin-bottom: 0;
  padding: 2px 8px 16px;
}

.journalit-setups-compare-panel--metrics,
.journalit-setups-compare-panel--chart {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 332px;
}

.journalit-setups-compare-panel--metrics {
  padding: 0 24px 0 0;
  border-right: 1px solid color-mix(in srgb, var(--background-modifier-border) 64%, transparent);
}

.journalit-setups-compare-panel--chart {
  padding: 0;
}

.journalit-setups-compare-metrics {
  display: grid;
  flex: 1;
  grid-template-rows: auto repeat(6, minmax(0, 1fr));
  gap: 0;
}

.journalit-setups-compare-metric-row {
  display: grid;
  grid-template-columns: minmax(118px, 0.9fr) repeat(2, minmax(82px, 0.7fr)) minmax(108px, 0.82fr);
  align-items: center;
  gap: 10px;
  min-height: 34px;
  padding: 6px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 58%, transparent);
}

.journalit-setups-compare-metric-row--header {
  min-height: 30px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.045em;
  text-transform: uppercase;
}

.journalit-setups-compare-metric-row--header span,
.journalit-setups-compare-metric-row__value,
.journalit-setups-compare-metric-row__edge {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-setups-compare-metric-row:last-child {
  border-bottom: none;
}

.journalit-setups-compare-metric-row__label {
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  white-space: nowrap;
}

.journalit-setups-compare-metric-row__value {
  font-size: var(--font-ui-medium);
  font-weight: 650;
}

.journalit-setups-compare-metric-row__edge {
  color: var(--text-normal);
  font-size: var(--font-ui-medium);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.journalit-setups-compare-metric-row__edge .journalit-display-value {
  color: inherit;
}

.journalit-setups-compare-metric-row__value--winner {
  color: var(--text-success, var(--chart-positive, #43a047));
  font-weight: 750;
}

.journalit-setups-compare-metric-row__value--nonwinner {
  color: var(--text-muted);
  font-weight: 500;
}

.journalit-setups-compare-chart {
  position: relative;
  flex: 0 0 360px;
  height: 360px;
  min-height: 0;
}

.journalit-setups-compare-chart .journalit-chart-container {
  height: 360px !important;
}

.journalit-setups-compare-chart__zero {
  stroke: var(--background-modifier-border-hover);
}

.journalit-setups-compare-breakdown-section {
  margin-top: 18px;
  padding: 18px 8px 0;
  border-top: 1px solid color-mix(in srgb, var(--background-modifier-border) 64%, transparent);
}

.journalit-setups-compare-breakdowns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
}

.journalit-setups-compare-breakdown {
  min-width: 0;
  padding: 8px 22px 0;
  border: none;
  border-right: 1px solid color-mix(in srgb, var(--background-modifier-border) 58%, transparent);
  border-radius: 0;
  background: transparent;
}

.journalit-setups-compare-breakdown:first-child {
  padding-left: 0;
}

.journalit-setups-compare-breakdown:last-child {
  padding-right: 0;
  border-right: none;
}

.journalit-setups-compare-breakdown__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 58%, transparent);
}

.journalit-setups-compare-breakdown__title {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 7px;
  color: var(--text-normal);
}

.journalit-setups-compare-breakdown__title h3 {
  margin: 0;
  font-size: var(--font-ui-small);
  font-weight: 700;
}

.journalit-setups-compare-breakdown__metric {
  flex: 0 0 auto;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-setups-compare-breakdown .journalit-chart-container {
  margin-top: 8px;
}

.journalit-setups-compare-breakdown-chart__value {
  font-size: 11px;
  font-weight: 700;
}

.journalit-setups-compare-breakdown-chart__value--positive {
  fill: var(--journalit-setup-edge-positive);
}

.journalit-setups-compare-breakdown-chart__value--negative {
  fill: var(--journalit-setup-edge-negative);
}

@media (max-width: 980px) {
  .journalit-setups-compare-breakdowns {
    grid-template-columns: 1fr;
  }

  .journalit-setups-compare-breakdown,
  .journalit-setups-compare-breakdown:first-child,
  .journalit-setups-compare-breakdown:last-child {
    padding: 16px 0;
    border-right: 0;
    border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 58%, transparent);
  }

  .journalit-setups-compare-breakdown:last-child {
    border-bottom: 0;
  }
}

@container (max-width: 700px) {
  .journalit-setups-detail-header {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 8px;
  }

  .journalit-setups-detail-header__back,
  .journalit-setups-detail-header__actions {
    justify-content: center;
  }

  .journalit-setups-detail-header__identity .journalit-setups-view__title {
    max-width: 100%;
    white-space: normal;
  }

  .journalit-setups-detail-scaffold {
    grid-template-columns: 1fr;
  }

  .journalit-setups-detail-performance__header {
    grid-template-columns: 1fr;
  }

  .journalit-setups-detail-performance__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 0;
  }

  .journalit-setups-detail-performance__stat {
    text-align: left;
  }
}

@media (max-width: 1400px) {
  .journalit-setups-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1180px) and (min-width: 901px) {
  .journalit-setups-compare-main-grid {
    grid-template-columns: minmax(390px, 0.84fr) minmax(0, 1.16fr);
    gap: 22px;
  }

  .journalit-setups-compare-panel--metrics {
    padding: 0 22px 0 8px;
  }

  .journalit-setups-compare-metric-row {
    grid-template-columns: minmax(92px, 0.85fr) repeat(2, minmax(66px, 0.7fr)) minmax(96px, 0.82fr);
    gap: 8px;
  }

  .journalit-setups-compare-metric-row__value {
    font-size: var(--font-ui-small);
  }
}

@media (max-width: 900px) {
  .journalit-setups-compare-edge-card {
    grid-template-columns: minmax(220px, 1.2fr) repeat(2, minmax(120px, 0.7fr));
  }

  .journalit-setups-compare-edge-card__reasons {
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    border-top: 1px solid color-mix(in srgb, var(--background-modifier-border) 58%, transparent);
  }

  .journalit-setups-pair-insight {
    grid-template-columns: 1fr;
  }

  .journalit-setups-pair-insight__metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .journalit-setups-compare-main-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .journalit-setups-compare-panel--metrics {
    min-height: 0;
    padding: 0 0 14px;
    border-right: none;
    border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 64%, transparent);
  }

  .journalit-setups-compare-metrics {
    flex: none;
    grid-template-rows: auto;
    grid-auto-rows: auto;
  }

  .journalit-setups-compare-chart {
    height: 340px;
    flex-basis: 340px;
  }

  .journalit-setups-compare-chart .journalit-chart-container {
    height: 340px !important;
  }
}

@media (max-width: 760px) {
  .journalit-setups-compare-header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 8px;
    min-height: 0;
  }

  .journalit-setups-compare-header__title {
    position: static;
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 10px;
    width: 100%;
    height: auto;
    font-size: 18px;
    transform: none;
  }

  .journalit-setups-compare-header__setup-name,
  .journalit-setups-compare-header__setup-name--left,
  .journalit-setups-compare-header__setup-name--right,
  .journalit-setups-compare-header__vs {
    position: static;
    width: auto;
    transform: none;
  }

  .journalit-setups-compare-header__setup-name {
    white-space: normal;
  }

  .journalit-setups-compare-header__vs {
    align-self: center;
  }

  .journalit-setups-compare-metric-row {
    grid-template-columns: minmax(82px, 0.8fr) repeat(3, minmax(58px, 0.7fr));
  }

  .journalit-setups-compare-chart {
    height: 310px;
    flex-basis: 310px;
  }

  .journalit-setups-compare-chart .journalit-chart-container {
    height: 310px !important;
  }
}

@media (max-width: 860px) {
  .journalit-create-setup-modal .create-setup-form .create-setup-name-row,
  .journalit-create-setup-modal .create-setup-form .setting-item.two-column {
    grid-template-columns: 1fr;
  }

  .journalit-create-setup-profile__grid {
    grid-template-columns: 1fr;
  }

  .journalit-create-setup-profile__grid > .journalit-combobox {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .journalit-create-setup-modal .create-setup-form .create-setup-name-row .setting-item-name::after {
    content: '';
  }

  .journalit-setups-view__header {
    flex-direction: column;
  }

  .journalit-setups-detail-header {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .journalit-setups-detail-header__back,
  .journalit-setups-detail-header__actions {
    justify-content: center;
  }

  .journalit-setups-detail-header__identity .journalit-setups-view__title {
    max-width: 100%;
    white-space: normal;
  }

  .journalit-setups-view__actions {
    justify-content: flex-start;
  }

  .journalit-setups-detail-scaffold {
    grid-template-columns: 1fr;
  }

  .journalit-setups-playbook-section {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .journalit-setups-detail-performance__header {
    grid-template-columns: 1fr;
  }

  .journalit-setups-detail-performance__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 0;
  }

  .journalit-setups-detail-performance__stat {
    text-align: left;
  }

  .journalit-setups-ranked-row {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 560px) {
  .journalit-setups-compare-edge-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .journalit-setups-compare-edge-card__primary,
  .journalit-setups-compare-edge-card__reasons {
    grid-column: 1 / -1;
  }

  .journalit-setups-compare-edge-card__primary::after {
    display: none;
  }

  .journalit-setups-compare-edge-card__primary strong {
    overflow: visible;
    text-overflow: clip;
    white-space: normal;
  }

  .journalit-setups-compare-edge-card__reasons {
    grid-template-columns: 1fr;
  }

  .journalit-setups-compare-main-grid,
  .journalit-setups-compare-breakdown-section {
    padding-right: 0;
    padding-left: 0;
  }

  .journalit-setups-card-grid {
    grid-template-columns: 1fr;
  }

  .journalit-setups-pair-insight__metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .journalit-setups-compare-metric-row--header {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .journalit-setups-compare-metric-row--header span:first-child {
    display: none;
  }

  .journalit-setups-compare-metric-row:not(.journalit-setups-compare-metric-row--header) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
    padding: 8px 0;
  }

  .journalit-setups-compare-metric-row__label {
    grid-column: 1 / -1;
    font-size: var(--font-ui-smaller);
  }

  .journalit-setups-compare-metric-row__value,
  .journalit-setups-compare-metric-row__edge {
    font-size: var(--font-ui-small);
  }
}

.journalit-setups-detail-performance__chart:has(.journalit-setups-execution-gap) {
  padding: 8px 10px 2px 6px;
}

.journalit-setups-execution-gap__bars {
  min-height: 142px;
  padding-right: 92px;
}

.journalit-setups-execution-gap__bar-stack {
  min-height: 136px;
}

.journalit-setups-execution-gap__gap-bracket {
  position: absolute;
  right: 4px;
  top: 50%;
  grid-column: auto;
  transform: translateY(-50%);
}

.journalit-setups-execution-gap__labels {
  padding-top: 5px;
  font-size: 13px;
}
.journalit-setups-execution-gap__chart {
  flex: 1 1 auto;
  min-height: 0;
}

.journalit-setups-execution-gap__plot .journalit-chart-container .recharts-bar-rectangle,
.journalit-setups-execution-gap__plot .journalit-chart-container .recharts-bar-rectangle:hover,
.journalit-setups-execution-gap__plot .journalit-chart-container .recharts-bar-rectangle.recharts-active {
  filter: none;
  transform: none;
  transition: none;
}

.journalit-setups-execution-gap__bar-label text {
  fill: color-mix(in srgb, var(--text-on-accent, #fff) 88%, transparent);
  font-size: 12px;
  font-weight: 500;
  paint-order: stroke;
  stroke: color-mix(in srgb, var(--background-primary) 34%, transparent);
  stroke-width: 1.2px;
}

.journalit-setups-execution-gap__bar-label--warning text {
  fill: color-mix(in srgb, var(--color-orange, #ff9800) 86%, var(--text-normal));
}

.journalit-setups-execution-gap__reference-label text {
  fill: var(--text-normal);
  font-size: 12px;
  font-weight: 700;
  paint-order: stroke;
  stroke: color-mix(in srgb, var(--background-primary) 70%, transparent);
  stroke-width: 2px;
}
.journalit-setups-view .journalit-setups-pairs-evidence__metric-value--positive .journalit-display-value {
  color: var(--chart-positive, var(--text-success)) !important;
}

.journalit-setups-view .journalit-setups-pairs-evidence__metric-value--negative .journalit-display-value {
  color: var(--chart-negative, var(--text-error)) !important;
}

.journalit-setups-view .journalit-setups-pairs-evidence__metric-value--neutral .journalit-display-value {
  color: var(--text-normal) !important;
}
`;
