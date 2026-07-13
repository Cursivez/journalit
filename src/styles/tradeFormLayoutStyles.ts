

export const TRADE_FORM_LAYOUT_STYLES = `
  .journalit-trade-form-layout-modal {
    display: flex;
    flex-direction: column;
    max-height: 90vh;
  }

  .journalit-trade-form-layout-modal__container {
    max-width: 560px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .journalit-trade-form-layout-editor {
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 0;
  }

  .journalit-trade-form-layout-editor__intro {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .journalit-trade-form-layout-editor__title {
    color: var(--text-normal);
    font-size: 15px;
    font-weight: 600;
  }

  .journalit-trade-form-layout-editor__description,
  .journalit-trade-form-layout-editor__note,
  .journalit-trade-form-layout-editor__mode-description {
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.4;
  }

  .journalit-trade-form-layout-editor__mode-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 14px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
  }

  .journalit-trade-form-layout-editor__mode-stack {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    overflow: hidden;
    padding: 10px 14px;
  }

  .journalit-trade-form-layout-editor__mode-stack .journalit-trade-form-layout-editor__mode-card {
    background: transparent;
    border: 0;
    border-radius: 0;
    padding: 4px 0;
  }

  .journalit-trade-form-layout-editor__mode-card .segmented-control-option.is-active {
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    box-shadow: 0 0 0 1px var(--interactive-accent-hover), 0 2px 8px rgba(0, 0, 0, 0.18);
  }

  .journalit-trade-form-layout-editor__mode-card .segmented-control-option:not(.is-active) {
    background: var(--background-primary);
    color: var(--text-normal);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .journalit-trade-form-layout-editor__mode-card .segmented-control-option:not(.is-active):hover {
    background: var(--background-modifier-hover);
  }

  .journalit-trade-form-layout-editor__asset-controls {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-trade-form-layout-editor__asset-controls .selectContainer {
    margin: 0;
  }

  .journalit-trade-form-layout-editor__asset-select {
    min-width: 112px;
  }

  .journalit-trade-form-layout-editor__risk-fields {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 6px;
    margin-top: 6px;
  }

  .journalit-trade-form-layout-editor__risk-field {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0;
    background: transparent;
    border: 0;
    border-radius: 0;
    color: var(--text-normal);
    font-size: 11.5px;
    line-height: 1.2;
  }

  .journalit-trade-form-layout-editor__risk-field input {
    margin: 0;
  }

  .journalit-trade-form-layout-editor__mode-copy {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  .journalit-trade-form-layout-editor__mode-heading {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .journalit-trade-form-layout-editor__mode-title {
    color: var(--text-normal);
    font-size: 13px;
    font-weight: 600;
  }

  .journalit-trade-form-layout-editor__mode-info-trigger {
    display: inline-flex;
    align-items: center;
  }

  .journalit-trade-form-layout-editor__mode-info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    width: auto;
    height: auto;
    padding: 0;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    color: var(--text-muted);
    cursor: help;
    line-height: 1;
  }

  .journalit-trade-form-layout-editor__mode-info:hover,
  .journalit-trade-form-layout-editor__mode-info:focus-visible {
    color: var(--text-normal);
    background: transparent !important;
    box-shadow: none !important;
  }

  .journalit-tooltip.trade-form-input-mode-tooltip {
    max-width: 260px;
    padding: 10px 12px;
  }

  .journalit-tooltip.trade-form-input-mode-tooltip + .tooltip {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  .journalit-trade-form-layout-editor__mode-tooltip {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-trade-form-layout-editor__mode-tooltip-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .journalit-trade-form-layout-editor__mode-tooltip-row strong {
    color: var(--text-normal);
    font-size: 12px;
    font-weight: 600;
  }

  .journalit-trade-form-layout-editor__mode-tooltip-row span {
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.35;
  }

  .journalit-trade-form-layout-editor__note {
    padding: 8px 10px;
    background: var(--background-primary-alt);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
  }

  .journalit-trade-form-layout-editor .journalit-visibility-editor__content {
    max-height: min(52vh, 520px);
  }

  .journalit-trade-form-layout-editor__footer {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 0;
    padding-top: 12px;
    border-top: 1px solid var(--background-modifier-border);
    flex-shrink: 0;
  }

  .journalit-trade-form-layout-editor__footer.is-compact {
    margin-top: 0;
  }

  .journalit-trade-form-layout-editor__reset {
    margin-right: auto;
  }

  .journalit-trade-form-layout-editor__footer .journalit-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-weight: 500;
    box-shadow: none;
    gap: 8px;
    user-select: none;
  }

  .journalit-trade-form-layout-editor__footer .create-account-button {
    min-width: 100px;
  }

  .journalit-trade-form-layout-editor__footer .cancel-button {
    min-width: 70px;
  }

  .journalit-trade-form-layout-editor__footer .journalit-button--primary {
    background: var(--interactive-accent);
    border-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-trade-form-layout-editor__footer .journalit-button--primary:hover:not(:disabled) {
    background: var(--interactive-accent-hover);
    border-color: var(--interactive-accent-hover);
  }

  .journalit-trade-form-layout-editor__footer .journalit-button--secondary {
    background: transparent;
    border-color: var(--background-modifier-border);
    color: var(--text-muted);
  }

  .journalit-trade-form-layout-editor__footer .journalit-button--secondary:hover:not(:disabled) {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-trade-form-header-action {
    all: unset !important;
    appearance: none !important;
    box-sizing: border-box !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 32px !important;
    height: 30px !important;
    padding: 0 !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 6px !important;
    background: var(--background-primary) !important;
    color: var(--text-normal) !important;
    cursor: pointer !important;
    line-height: 1 !important;
    box-shadow: inset 0 0 0 1px rgba(var(--interactive-accent-rgb), 0.16) !important;
    -webkit-app-region: no-drag !important;
  }

  .journalit-trade-form-header-action:hover {
    color: var(--interactive-accent) !important;
    border-color: var(--interactive-accent) !important;
    background: rgba(var(--interactive-accent-rgb), 0.12) !important;
    box-shadow: inset 0 0 0 1px rgba(var(--interactive-accent-rgb), 0.28) !important;
  }

  .journalit-trade-form-header-action:focus-visible {
    outline: 2px solid var(--interactive-accent) !important;
    outline-offset: 2px !important;
  }

  .journalit-trade-form-header-action svg {
    width: 14px;
    height: 14px;
  }

  .trade-form-view-container .journalit-tab-wrapper > .journalit-trade-form-header-action {
    margin-left: 8px !important;
    align-self: center !important;
  }

  .trade-form-view-container .risk-management-section .risk-result-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
  }

  .trade-form-view-container .risk-management-section .risk-result-preview__label {
    color: var(--text-muted);
    font-size: 12px;
  }

  .trade-form-view-container .risk-management-section .risk-result-preview__value {
    color: var(--text-normal);
    font-size: 14px;
    font-weight: 600;
  }

  @media (max-width: 520px) {
    .journalit-trade-form-layout-editor__mode-card {
      align-items: stretch;
      flex-direction: column;
    }
  }
`;
