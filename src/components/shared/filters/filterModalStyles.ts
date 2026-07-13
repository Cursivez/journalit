

export const FILTER_MODAL_STYLES = `
.journalit-filter-modal .filter-modal-container {
  display: flex;
  flex-direction: column;
  min-height: 500px;
  max-height: 80vh;
}


.journalit-filter-modal .filter-modal-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}


.journalit-filter-modal .filter-modal-scroll-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 12px 84px;
}


.journalit-filter-modal .filter-modal-active-filters {
  margin-bottom: 16px;
  padding: 12px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
}

.journalit-filter-modal .filter-modal-active-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.journalit-filter-modal .filter-modal-active-filters-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.journalit-filter-modal .filter-modal-clear-all {
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-accent);
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.journalit-filter-modal .filter-modal-clear-all:hover {
  background: var(--background-modifier-hover);
}

.journalit-filter-modal .filter-modal-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}


.journalit-filter-modal .filter-modal-sections {
  display: flex;
  flex-direction: column;
}


.journalit-filter-modal .filter-modal-section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}


.journalit-filter-modal .filter-modal-section-grid-2col {
  display: grid;
  grid-template-columns: repeat(2, 150px);
  gap: 16px;
}


.journalit-filter-modal .filter-modal-section-grid-3col {
  display: grid;
  grid-template-columns: repeat(3, 150px);
  gap: 12px;
}


.journalit-filter-modal .filter-modal-section-grid-3col-auto {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
}

.journalit-filter-modal .filter-modal-section-grid-3col-auto .journalit-dashboard-setup-summary,
.journalit-filter-modal .filter-modal-section-grid-3col-auto .journalit-dashboard-tag-summary,
.journalit-filter-modal .filter-modal-section-grid-3col-auto .journalit-dashboard-mistake-summary,
.journalit-filter-modal .filter-modal-section-grid-3col-auto .journalit-tradelog-custom-field-summary {
  width: 100%;
  min-width: 0;
  max-width: none;
}

.journalit-filter-modal .filter-modal-section-grid-3col-auto .journalit-dashboard-setup-options-dropdown,
.journalit-filter-modal .filter-modal-section-grid-3col-auto .journalit-dashboard-tag-options-dropdown,
.journalit-filter-modal .filter-modal-section-grid-3col-auto .journalit-dashboard-mistake-options-dropdown,
.journalit-filter-modal .filter-modal-section-grid-3col-auto .journalit-tradelog-custom-field-options-dropdown {
  width: 100%;
}


.journalit-filter-modal .filter-modal-controls {
  display: flex;
  flex-direction: column;
}

.journalit-filter-modal .filter-modal-image-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}


.journalit-filter-modal .filter-modal-controls .journalit-dashboard-account-summary,
.journalit-filter-modal .filter-modal-controls .journalit-dashboard-ticker-summary,
.journalit-filter-modal .filter-modal-controls .journalit-dashboard-setup-summary,
.journalit-filter-modal .filter-modal-controls .journalit-dashboard-tag-summary,
.journalit-filter-modal .filter-modal-controls .journalit-dashboard-mistake-summary,
.journalit-filter-modal .filter-modal-controls .journalit-tradelog-trade-type-summary,
.journalit-filter-modal .filter-modal-controls .journalit-tradelog-status-summary,
.journalit-filter-modal .filter-modal-controls .journalit-tradelog-custom-field-summary {
  width: 150px;
  min-width: 150px;
  max-width: 150px;
}


.journalit-filter-modal .filter-modal-buttons {
  position: sticky;
  bottom: 0;
  background: var(--background-primary);
  border-top: 1px solid var(--background-modifier-border);
  padding: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.journalit-filter-modal .filter-modal-buttons .journalit-button {
  min-width: 80px;
}

.journalit-filter-modal .filter-modal-buttons .journalit-button--primary {
  background: var(--interactive-accent) !important;
  color: var(--text-on-accent) !important;
  border-color: var(--interactive-accent) !important;
}

.journalit-filter-modal .filter-modal-buttons .journalit-button--primary:hover:not(:disabled) {
  background: var(--interactive-accent-hover) !important;
  border-color: var(--interactive-accent-hover) !important;
}


@media (max-width: 768px) {
  .journalit-filter-modal .filter-modal-section-grid,
  .journalit-filter-modal .filter-modal-section-grid-2col,
  .journalit-filter-modal .filter-modal-section-grid-3col,
  .journalit-filter-modal .filter-modal-section-grid-3col-auto {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .journalit-filter-modal .filter-modal-section-grid-2col {
    max-width: 100%;
  }

  .journalit-filter-modal .filter-modal-scroll-area {
    padding: 12px;
  }

  .journalit-filter-modal .filter-modal-active-filters {
    padding: 10px;
  }

  .journalit-filter-modal .filter-modal-chips {
    gap: 8px;
  }

  .journalit-filter-modal .filter-modal-buttons {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
  }

  .journalit-filter-modal .filter-modal-buttons .journalit-button {
    width: 100%;
  }
}


.journalit-filter-modal .filter-modal-controls .journalit-dashboard-account-options-dropdown,
.journalit-filter-modal .filter-modal-controls .journalit-dashboard-ticker-options-dropdown,
.journalit-filter-modal .filter-modal-controls .journalit-dashboard-setup-options-dropdown,
.journalit-filter-modal .filter-modal-controls .journalit-dashboard-tag-options-dropdown,
.journalit-filter-modal .filter-modal-controls .journalit-dashboard-mistake-options-dropdown,
.journalit-filter-modal .filter-modal-controls .journalit-tradelog-status-options-dropdown,
.journalit-filter-modal .filter-modal-controls .journalit-tradelog-trade-type-options-dropdown,
.journalit-filter-modal .filter-modal-controls .journalit-tradelog-custom-field-options-dropdown {
  max-height: none !important;
  width: 150px;
  overflow: visible !important;
}


.journalit-tradelog-trade-type-filter {
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 140px;
}

.journalit-tradelog-trade-type-dropdown {
  position: relative;
}

.journalit-tradelog-trade-type-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  white-space: nowrap;
  gap: 8px;
}

.journalit-tradelog-trade-type-summary:hover {
  border-color: var(--interactive-accent);
  background-color: var(--background-modifier-hover);
}

.journalit-tradelog-trade-type-options-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
}

.journalit-tradelog-trade-type-option-item {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
  gap: 8px;
}

.journalit-tradelog-trade-type-option-item:hover {
  background-color: var(--background-modifier-hover);
}

.journalit-tradelog-trade-type-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 2px;
  background-color: var(--background-primary);
  font-size: 10px;
  color: var(--text-on-accent);
  flex-shrink: 0;
}

.journalit-tradelog-trade-type-checkbox.checked {
  background-color: var(--interactive-accent);
  border-color: var(--interactive-accent);
}

.journalit-tradelog-trade-type-divider {
  height: 1px;
  background-color: var(--background-modifier-border);
  margin: 4px 0;
}


.journalit-tradelog-status-filter {
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 140px;
}

.journalit-tradelog-status-dropdown {
  position: relative;
}

.journalit-tradelog-status-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  white-space: nowrap;
  gap: 8px;
}

.journalit-tradelog-status-summary:hover {
  border-color: var(--interactive-accent);
  background-color: var(--background-modifier-hover);
}

.journalit-tradelog-status-options-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
}

.journalit-tradelog-status-option-item {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
  gap: 8px;
}

.journalit-tradelog-status-option-item:hover {
  background-color: var(--background-modifier-hover);
}

.journalit-tradelog-status-option-item.sub-option {
  padding-left: 24px;
}

.journalit-tradelog-status-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 2px;
  background-color: var(--background-primary);
  font-size: 10px;
  color: var(--text-on-accent);
  flex-shrink: 0;
}

.journalit-tradelog-status-checkbox.checked {
  background-color: var(--interactive-accent);
  border-color: var(--interactive-accent);
}

.journalit-tradelog-status-divider {
  height: 1px;
  background-color: var(--background-modifier-border);
  margin: 4px 0;
}


.journalit-filter-modal .filter-modal-custom-field-label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.journalit-tradelog-custom-field-filter {
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 140px;
}

.journalit-tradelog-custom-field-dropdown {
  position: relative;
}

.journalit-tradelog-custom-field-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  white-space: nowrap;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.journalit-tradelog-custom-field-summary:hover {
  border-color: var(--interactive-accent);
  background-color: var(--background-modifier-hover);
}

.journalit-tradelog-custom-field-summary:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}

.journalit-tradelog-custom-field-summary .dropdown-arrow {
  font-size: 10px;
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

.journalit-tradelog-custom-field-options-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
}

.journalit-tradelog-custom-field-option-item {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
  gap: 8px;
  font-size: 13px;
}

.journalit-tradelog-custom-field-option-item:hover {
  background-color: var(--background-modifier-hover);
}

.journalit-tradelog-custom-field-option-item:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: -2px;
}

.journalit-tradelog-custom-field-option-item > span:last-child {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-tradelog-custom-field-option-all {
  font-weight: 500;
}

.journalit-tradelog-custom-field-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 2px;
  background-color: var(--background-primary);
  font-size: 10px;
  color: var(--text-on-accent);
  flex-shrink: 0;
}

.journalit-tradelog-custom-field-checkbox.checked {
  background-color: var(--interactive-accent);
  border-color: var(--interactive-accent);
}

.journalit-tradelog-custom-field-divider {
  height: 1px;
  background-color: var(--background-modifier-border);
  margin: 4px 0;
}

.journalit-tradelog-custom-field-empty {
  padding: 12px;
  color: var(--text-muted);
  font-style: italic;
  text-align: center;
  font-size: 13px;
}
`;
