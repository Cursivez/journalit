export const TRADE_REVIEW_JOURNAL_STYLES = `
  .journalit-trade-inline-value { min-width: 0; width: 100%; }
  .journalit-trade-review-card button.journalit-trade-inline-trigger {
    display: flex; align-items: center; gap: 8px; width: 100%; height: auto;
    min-height: 22px; margin: 0; padding: 0; border: 0; border-radius: 3px;
    background: transparent; box-shadow: none; color: inherit; font: inherit;
    text-align: start; cursor: pointer;
  }
  .journalit-trade-review-card button.journalit-trade-inline-trigger:hover,
  .journalit-trade-review-card button.journalit-trade-inline-trigger:focus-visible {
    background: var(--background-modifier-hover); box-shadow: none;
  }
  .journalit-trade-inline-display {
    display: flex; flex-wrap: wrap; align-items: center; gap: 0.3rem; min-width: 0; flex: 1;
  }
  .journalit-trade-inline-hint {
    display: inline-flex; align-items: center; justify-content: center;
    flex: 0 0 22px; height: 22px; opacity: 0; color: var(--text-muted);
  }
  .journalit-trade-inline-trigger:hover .journalit-trade-inline-hint,
  .journalit-trade-inline-trigger:focus-visible .journalit-trade-inline-hint { opacity: 1; }
  .journalit-trade-inline-control {
    display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: start;
    margin: 0; padding: 0; border: 0; min-width: 0;
  }
  .journalit-trade-inline-control .formSection,
  .journalit-trade-inline-control .sectionContent,
  .journalit-trade-inline-control .field { margin: 0; padding: 0; border: 0; }
  
  .journalit-trade-inline-control label,
  .journalit-trade-inline-control .journalit-fast-datetime__label {
    position: absolute; width: 1px; height: 1px; overflow: hidden;
    margin: -1px; padding: 0; border: 0; white-space: nowrap;
  }
  .journalit-trade-inline-control .inputContainer,
  .journalit-trade-inline-control .selectContainer { margin: 0; }
  
  .journalit-trade-inline-control input:not(.journalit-fast-datetime input):not(.combobox-input),
  .journalit-trade-inline-control select { width: 100%; max-width: 100%; font-size: 0.8rem; }
  .journalit-trade-inline-control .journalit-dropdown-select__trigger { font-size: 0.8rem; }
  .journalit-trade-inline-control textarea {
    width: 100%; min-height: 5.5rem; resize: vertical; font-size: 0.8rem;
  }
  .journalit-trade-inline-actions { display: flex; gap: 8px; padding-top: 6px; }
  .journalit-trade-inline-control .journalit-combobox .selected-item {
    color: var(--text-normal); background: var(--background-modifier-hover); border: 1px solid var(--background-modifier-border);
    border-radius: 999px; font-size: 0.72rem; padding: 2px 6px;
  }
  .journalit-trade-inline-editor[data-selection="setup"] .journalit-combobox .selected-item { color: var(--color-blue); }
  .journalit-trade-inline-editor[data-selection="mistake"] .journalit-combobox .selected-item { color: var(--color-red); }
  .journalit-trade-inline-editor[data-selection="tags"] .journalit-combobox .selected-item { color: var(--color-purple); }
  .journalit-trade-inline-control .journalit-combobox button.remove-button { background: transparent; box-shadow: none; color: inherit; }
  .journalit-trade-review-card button.journalit-trade-inline-action {
    background: transparent; box-shadow: none; border: 0; padding: 2px 0;
    height: auto; font-size: 0.7rem; color: var(--text-muted); cursor: pointer;
  }
  .journalit-trade-review-card button.journalit-trade-inline-action:hover,
  .journalit-trade-review-card button.journalit-trade-inline-action:focus-visible { color: var(--text-normal); }
  .journalit-trade-inline-error { color: var(--text-error); font-size: 0.75rem; margin-top: 5px; }
  .journalit-trade-inline-media { display: flex; flex-direction: column; gap: 8px; border-radius: var(--radius-s); }
  .journalit-trade-inline-media.is-dragging { outline: 1px solid var(--interactive-accent); background: var(--background-modifier-hover); }
  .journalit-trade-inline-media-controls .journalit-image-upload-wrapper { margin-bottom: 0; }
  @media (hover: none) { .journalit-trade-inline-hint { opacity: 0.65; } }
`;
