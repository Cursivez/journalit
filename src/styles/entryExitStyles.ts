

export const ENTRY_EXIT_STYLES = `
    
    .trade-form-view-container .entries-section,
    .trade-form-view-container .exits-section,
    .trade-form-view-container .dividends-section {
      margin-bottom: 16px;
      padding: 12px;
      border: 1px solid var(--background-modifier-border);
      border-radius: 4px;
      background-color: var(--background-primary);
    }

    .trade-form-view-container .entries-section:last-child,
    .trade-form-view-container .exits-section:last-child,
    .trade-form-view-container .dividends-section:last-child {
      margin-bottom: 0;
    }

    .trade-form-view-container .section-title {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      color: var(--text-normal);
    }

    .trade-form-view-container .badge {
      display: inline-block;
      background: var(--interactive-accent);
      color: white;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 8px;
    }

    .trade-form-view-container .entry-row,
    .trade-form-view-container .exit-row,
    .trade-form-view-container .dividend-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--background-modifier-border);
    }

    .trade-form-view-container .entry-index,
    .trade-form-view-container .exit-index,
    .trade-form-view-container .dividend-index {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--background-secondary);
      border-radius: 50%;
      margin-right: 12px;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
      margin-top: 26px; 
    }

    .trade-form-view-container .entry-fields,
    .trade-form-view-container .exit-fields,
    .trade-form-view-container .dividend-fields {
      display: flex;
      flex: 1;
      gap: 12px;
      flex-wrap: wrap;
    }

    .trade-form-view-container .time-field {
      flex: 2;
      min-width: 180px;
    }

    .trade-form-view-container .price-field,
    .trade-form-view-container .size-field,
    .trade-form-view-container .amount-field {
      flex: 1;
      min-width: 120px;
    }

    .trade-form-view-container .journalit-direct-pnl-time-input .journalit-fast-datetime__container {
      width: fit-content;
      max-width: 100%;
      padding-right: 12px;
      gap: 6px;
    }

    .trade-form-view-container .journalit-direct-pnl-time-input .journalit-fast-datetime__calendar-button {
      margin-left: 12px;
    }

    .trade-form-view-container .journalit-direct-pnl-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: fit-content;
      max-width: 100%;
      margin-bottom: 12px;
    }

    .trade-form-view-container .journalit-direct-pnl-value-field,
    .trade-form-view-container .journalit-direct-pnl-value-field .inputContainer {
      width: 100%;
    }

    
    .trade-form-view-container .time-field-wrapper {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 200px;
    }

    .trade-form-view-container .time-field-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .trade-form-view-container .time-field-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-normal);
    }

    .trade-form-view-container .required-star {
      color: var(--text-error);
      margin-left: 2px;
    }

    .trade-form-view-container .remove-button-inline {
      width: 24px !important;
      height: 24px !important;
      min-width: 24px !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 4px !important;
      background: transparent !important;
      border: 1px solid var(--background-modifier-border) !important;
      color: var(--text-muted) !important;
      cursor: pointer !important;
      transition: all 0.15s ease !important;
    }

    .trade-form-view-container .remove-button-inline:hover {
      background: rgba(var(--color-red-rgb, 233, 49, 71), 0.1) !important;
      border-color: var(--text-error) !important;
      color: var(--text-error) !important;
    }

    
    .trade-form-view-container .entry-row .remove-button,
    .trade-form-view-container .exit-row .remove-button {
      width: 28px;
      height: 28px;
      min-width: 28px;
      padding: 0;
      margin-left: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 26px; 
    }

    .trade-form-view-container .add-button {
      margin-top: 8px;
      margin-bottom: 12px;
    }

    .trade-form-view-container .total-size,
    .trade-form-view-container .remaining-size,
    .trade-form-view-container .dividend-total {
      font-size: 14px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
      background: var(--background-secondary);
      display: inline-block;
      margin-top: 8px;
    }

    .trade-form-view-container .remaining-size.positive {
      color: var(--text-success);
    }

    .trade-form-view-container .remaining-size.neutral {
      color: var(--text-normal);
    }

    .trade-form-view-container .journalit-ideal-exits {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid var(--background-modifier-border);
    }

    .trade-form-view-container .journalit-ideal-exits__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }

    .trade-form-view-container .journalit-ideal-exits__title-group,
    .trade-form-view-container .journalit-ideal-exits__header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .trade-form-view-container .journalit-ideal-exits__title {
      color: var(--text-normal);
      font-size: 15px;
      line-height: 20px;
      font-weight: 500;
      white-space: nowrap;
    }

    .trade-form-view-container .journalit-ideal-exits__optional-text {
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 400;
    }

    .trade-form-view-container .journalit-ideal-exits__info {
      color: var(--text-muted);
    }

    .trade-form-view-container .journalit-ideal-exits__info:hover {
      color: var(--text-normal);
    }

    .trade-form-view-container .journalit-ideal-exits__coverage {
      flex-shrink: 0;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--background-secondary);
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
    }

    .trade-form-view-container .journalit-ideal-exits__add-button,
    .trade-form-view-container .journalit-ideal-exits__copy-button {
      margin: 0;
      padding: 2px 6px;
      color: var(--text-muted);
      background: transparent;
      box-shadow: none;
      height: 24px;
      min-height: 24px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 4px;
    }

    .trade-form-view-container .journalit-ideal-exits__add-button:hover,
    .trade-form-view-container .journalit-ideal-exits__copy-button:hover {
      color: var(--text-normal);
      background: var(--background-modifier-hover);
      text-decoration: none;
    }

    .trade-form-view-container .journalit-ideal-exits__empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      min-height: 42px;
      border: 1px dashed var(--background-modifier-border);
      border-radius: 6px;
      background: transparent;
      color: var(--text-faint);
      font-size: 13px;
    }

    .trade-form-view-container .journalit-ideal-exit-row {
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr) 90px 32px;
      gap: 6px;
      align-items: start;
      margin-top: 6px;
    }

    .trade-form-view-container .journalit-ideal-exit-row--header {
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
      align-items: center;
    }

    .trade-form-view-container .journalit-ideal-exit-row .form-group,
    .trade-form-view-container .journalit-ideal-exit-row .inputContainer {
      margin-bottom: 0;
    }

    .trade-form-view-container .journalit-ideal-exit-row .input {
      min-height: 32px;
    }

    .trade-form-view-container .journalit-ideal-exit-field-label {
      display: none;
    }

    .trade-form-view-container .journalit-ideal-exit-index-label {
      display: flex;
      align-items: center;
      min-height: 32px;
      color: var(--text-normal);
      font-weight: 500;
      padding-left: 2px;
    }

    .trade-form-view-container .journalit-ideal-exit-remove-button {
      grid-column: 4;
      grid-row: 1;
      width: 32px;
      height: 32px;
      padding: 0;
      margin-top: 0;
      font-size: 20px;
      line-height: 1;
    }

    .trade-form-view-container .journalit-ideal-exit-remove-button:hover {
      color: var(--text-error);
      border-color: var(--text-error);
    }

    .trade-form-view-container .journalit-ideal-exits__actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 6px;
    }

    @media (max-width: 640px) {
      .trade-form-view-container .journalit-ideal-exits__header {
        align-items: flex-start;
        flex-direction: column;
      }

      .trade-form-view-container .journalit-ideal-exit-row {
        grid-template-columns: 1fr;
      }

      .trade-form-view-container .journalit-ideal-exit-remove-button {
        grid-column: auto;
        grid-row: auto;
        justify-self: flex-start;
      }

      .trade-form-view-container .journalit-ideal-exit-field-label {
        display: block;
        margin-bottom: 3px;
        color: var(--text-muted);
        font-size: 12px;
        font-weight: 600;
      }

      .trade-form-view-container .journalit-ideal-exit-row--header {
        display: none;
      }
    }

    
    .trade-form-view-container .journalit-pnl-mode-toggle,
    .trade-form-view-container .journalit-dollar-mode-toggle {
      margin-bottom: 12px;
      padding: 8px 12px;
      border: 1px solid var(--background-modifier-border);
      border-radius: 8px;
      background: var(--background-primary);
    }

    
    .trade-form-view-container .calculated-size {
      font-size: 12px;
      color: var(--text-muted);
      padding: 4px 8px;
      background: var(--background-secondary);
      border-radius: 4px;
      display: flex;
      align-items: center;
      align-self: flex-end;
      margin-bottom: 8px;
      white-space: nowrap;
    }

    .trade-form-view-container .journalit-pnl-toggle-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .trade-form-view-container .journalit-pnl-toggle-label {
      font-weight: 500;
      color: var(--text-normal);
    }

    .trade-form-view-container .journalit-pnl-toggle-description {
      color: var(--text-muted);
      font-size: 0.9em;
      line-height: 1.4;
      margin: 0;
    }

    
    .trade-form-view-container .toggle-switch-container {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 24px;
    }

    .trade-form-view-container .toggle-switch-input {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }

    .trade-form-view-container .toggle-switch-label {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--background-modifier-border);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      border-radius: 34px;
      overflow: hidden;
    }

    .trade-form-view-container .toggle-switch-label .toggle-switch-button {
      position: absolute;
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: var(--background-primary);
      transition: transform 0.3s ease;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .trade-form-view-container .toggle-switch-input:checked + .toggle-switch-label {
      background-color: var(--interactive-accent);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    }

    .trade-form-view-container .toggle-switch-input:checked + .toggle-switch-label .toggle-switch-button {
      transform: translateX(16px);
    }

    .trade-form-view-container .toggle-switch-input:focus + .toggle-switch-label {
      box-shadow: 0 0 2px var(--interactive-accent);
    }

    .trade-form-view-container .toggle-switch-container.disabled {
      opacity: 0.6;
    }

    .trade-form-view-container .toggle-switch-container.disabled .toggle-switch-label {
      cursor: not-allowed;
    }

    
    @media (max-width: 768px) {
      .trade-form-view-container .entry-fields,
      .trade-form-view-container .exit-fields {
        flex-direction: column;
        gap: 8px;
      }

      .trade-form-view-container .time-field,
      .trade-form-view-container .price-field,
      .trade-form-view-container .size-field {
        width: 100%;
        min-width: 0;
      }
    }
`;
