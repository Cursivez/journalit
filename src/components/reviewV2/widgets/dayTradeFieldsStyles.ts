
export const DAY_TRADE_FIELDS_STYLES = `
  .journalit-day-trade-fields-card {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    overflow: visible;
    container-type: inline-size;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .journalit-day-trade-fields-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    min-height: 1.9rem;
    justify-content: space-between;
    gap: 0.25rem 0.75rem;
  }

  .journalit-day-trade-fields-rows {
    display: flex;
    flex-direction: column;
  }

  .journalit-day-trade-fields-row {
    
    --journalit-dtf-tint: var(--interactive-accent);
    display: grid;
    grid-template-columns: minmax(5.5rem, 9rem) minmax(0, 1fr) auto;
    grid-template-areas: 'label value actions';
    align-items: start;
    gap: 0.35rem 1rem;
    padding: 0.5rem 0;
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-day-trade-fields-row:first-child {
    border-top: none;
  }

  .journalit-day-trade-fields-row--setup {
    --journalit-dtf-tint: var(--color-blue);
  }

  .journalit-day-trade-fields-row--mistake {
    --journalit-dtf-tint: var(--color-red);
  }

  .journalit-day-trade-fields-row--tags {
    --journalit-dtf-tint: var(--color-purple);
  }

  .journalit-day-trade-fields-label {
    grid-area: label;
    min-width: 0;
    padding-top: 0.2rem;
    color: var(--text-normal);
    font-size: var(--font-ui-small);
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .journalit-day-trade-fields-values,
  .journalit-day-trade-fields-editor {
    grid-area: value;
  }

  .journalit-day-trade-fields-row--editing .journalit-day-trade-fields-label {
    padding-top: 0.5rem;
  }

  .journalit-day-trade-fields-values {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    min-width: 0;
  }

  .journalit-day-trade-fields-chip,
  .journalit-day-trade-fields-card .journalit-day-trade-fields-editor-control .journalit-combobox .selected-item {
    max-width: 100%;
    box-sizing: border-box;
    background: color-mix(in srgb, var(--journalit-dtf-tint) 14%, transparent);
    border: none;
    border-radius: var(--radius-s);
    color: var(--journalit-dtf-tint);
    font-size: var(--font-ui-small);
    font-weight: 500;
    line-height: 1.35;
    padding: 0.2rem 0.55rem;
    overflow-wrap: anywhere;
  }

  .journalit-day-trade-fields-chip {
    white-space: pre-line;
  }

  .journalit-day-trade-fields-row--custom .journalit-day-trade-fields-chip,
  .journalit-day-trade-fields-card .journalit-day-trade-fields-row--custom .journalit-day-trade-fields-editor-control .journalit-combobox .selected-item {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-day-trade-fields-card .journalit-day-trade-fields-editor-control .journalit-combobox .selected-item .remove-button {
    color: inherit;
  }

  .journalit-day-trade-fields-empty-value {
    color: var(--text-faint);
    font-size: var(--font-ui-small);
  }

  .journalit-day-trade-fields-actions {
    grid-area: actions;
    display: inline-flex;
    gap: 0.15rem;
    padding-top: 0.2rem;
  }

  .journalit-day-trade-fields-editor {
    grid-area: value;
  }

  .journalit-day-trade-fields-row--editing .journalit-day-trade-fields-label {
    padding-top: 0.5rem;
  }

  .journalit-day-trade-fields-values {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    min-width: 0;
  }

  .journalit-day-trade-fields-chip,
  .journalit-day-trade-fields-card .journalit-day-trade-fields-editor-control .journalit-combobox .selected-item {
    max-width: 100%;
    box-sizing: border-box;
    background: color-mix(in srgb, var(--journalit-dtf-tint) 14%, transparent);
    border: none;
    border-radius: var(--radius-s);
    color: var(--journalit-dtf-tint);
    font-size: var(--font-ui-small);
    font-weight: 500;
    line-height: 1.35;
    padding: 0.2rem 0.55rem;
    overflow-wrap: anywhere;
  }

  .journalit-day-trade-fields-chip {
    white-space: pre-line;
  }

  .journalit-day-trade-fields-row--custom .journalit-day-trade-fields-chip,
  .journalit-day-trade-fields-card .journalit-day-trade-fields-row--custom .journalit-day-trade-fields-editor-control .journalit-combobox .selected-item {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-day-trade-fields-card .journalit-day-trade-fields-editor-control .journalit-combobox .selected-item .remove-button {
    color: inherit;
  }

  .journalit-day-trade-fields-empty-value {
    color: var(--text-faint);
    font-size: var(--font-ui-small);
  }

  
  .journalit-day-trade-fields-actions {
    grid-area: actions;
    display: inline-flex;
    gap: 0.15rem;
    opacity: 0;
    transition: opacity 120ms ease;
  }

  .journalit-day-trade-fields-row:hover .journalit-day-trade-fields-actions,
  .journalit-day-trade-fields-row:focus-within .journalit-day-trade-fields-actions,
  .journalit-day-trade-fields-row--editing .journalit-day-trade-fields-actions {
    opacity: 1;
  }

  .journalit-day-trade-fields-row--editing .journalit-day-trade-fields-actions {
    padding-top: 0.2rem;
  }

  @media (hover: none) {
    .journalit-day-trade-fields-actions {
      opacity: 1;
    }
  }

  .journalit-day-trade-fields-editor {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .journalit-day-trade-fields-editor-control {
    border: none;
    margin: 0;
    padding: 0;
    min-width: 0;
  }

  .journalit-day-trade-fields-editor-control .formSection,
  .journalit-day-trade-fields-editor-control .sectionContent,
  .journalit-day-trade-fields-editor-control .field {
    margin: 0;
    padding: 0;
    gap: 0;
  }

  .journalit-day-trade-fields-editor-control .input-container {
    width: 100%;
    min-height: 2.1rem;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    box-shadow: none;
  }

  
  .journalit-day-trade-fields-card .journalit-day-trade-fields-editor-control .journalit-combobox .combobox-input {
    flex: 1 1 1.5rem;
  }

  
  .journalit-day-trade-fields-card .journalit-day-trade-fields-editor-control .inputWrapper :is(input, textarea) {
    width: 100%;
    min-height: 2.25rem;
    box-sizing: border-box;
    padding: 0.35rem 0.6rem;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    box-shadow: none;
    color: var(--text-normal);
    font-size: var(--font-ui-small);
  }

  .journalit-day-trade-fields-card .journalit-day-trade-fields-editor-control .inputWrapper :is(input, textarea):focus {
    border-color: var(--interactive-accent);
    box-shadow: 0 0 0 1px var(--interactive-accent);
  }

  .journalit-day-trade-fields-card .journalit-day-trade-fields-editor-control .journalit-fast-datetime__container {
    min-height: 2.25rem;
    padding: 0.2rem 0.6rem;
    background: var(--background-secondary);
    border-radius: var(--radius-s);
  }

  
  .journalit-day-trade-fields-editor-control label,
  .journalit-day-trade-fields-editor-control .journalit-fast-datetime__label {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    white-space: nowrap;
    border: 0;
  }

  .journalit-day-trade-fields-empty {
    padding: 0.25rem 0;
  }

  .journalit-day-trade-fields-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-top: 0.6rem;
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-day-trade-fields-footer-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-left: auto;
  }

  
  .journalit-day-trade-fields-retry-message {
    color: var(--text-error);
    font-size: var(--font-ui-small);
  }

  
  .journalit-day-trade-fields-add .journalit-dropdown-select__trigger {
    box-shadow: none;
    cursor: pointer;
  }

  .journalit-day-trade-fields-add .journalit-dropdown-select__chevron {
    color: var(--text-muted);
    transition: transform 0.15s ease;
  }

  .journalit-day-trade-fields-add .journalit-dropdown-select__chevron.is-open {
    transform: rotate(180deg);
  }

  
  .journalit-day-trade-fields-add-wrapper {
    display: inline-flex;
    margin-left: auto;
  }

  .journalit-day-trade-fields-card .journalit-day-trade-fields-add .journalit-dropdown-select__trigger,
  .journalit-day-trade-fields-edit-button {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    height: auto;
    min-height: 1.75rem;
    padding: 0.25rem 0.6rem;
    font-size: var(--font-ui-small);
  }

  .journalit-day-trade-fields-edit-button {
    margin-left: auto;
  }

  
  .journalit-day-trade-fields-card .journalit-day-trade-fields-editor-control .journalit-dropdown-select__trigger {
    min-height: 2.25rem;
    padding: 0.35rem 0.6rem;
    background: var(--background-secondary);
    border-radius: var(--radius-s);
  }

  
  @container (max-width: 520px) {
    .journalit-day-trade-fields-row {
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas:
        'label actions'
        'value value';
    }

    .journalit-day-trade-fields-row--editing .journalit-day-trade-fields-label {
      padding-top: 0.2rem;
    }
  }
`;
