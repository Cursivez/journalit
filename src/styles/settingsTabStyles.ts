

export const SETTINGS_TAB_STYLES = `
  
  .journalit-settings-wrapper,
  .journalit-settings .settings-tab-container {
    width: 100%;
    box-sizing: border-box;
  }

  .journalit-settings .journalit-session-mode-window-row {
    display: grid;
    grid-template-columns: minmax(150px, 1fr) 122px 122px 28px;
    gap: var(--size-4-3);
    align-items: end;
    justify-content: stretch;
    max-width: 640px;
    padding: 0 var(--size-4-3);
  }

  .journalit-settings .journalit-session-mode-settings-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--size-4-4);
    margin-bottom: var(--size-4-4);
  }

  .journalit-settings .journalit-session-mode-settings-header__copy {
    min-width: 0;
  }

  .journalit-settings .journalit-session-mode-settings-header__copy h3 {
    margin-bottom: var(--size-2-2);
  }

  .journalit-settings .journalit-session-mode-open-button.journalit-button {
    flex: 0 0 auto;
    margin-top: 0;
    gap: var(--size-2-2);
    white-space: nowrap;
  }

  @media (max-width: 720px) {
    .journalit-settings .journalit-session-mode-settings-header {
      flex-direction: column;
      align-items: stretch;
    }

    .journalit-settings .journalit-session-mode-open-button.journalit-button {
      width: fit-content;
    }
  }

  .journalit-settings .journalit-session-mode-window-row + .journalit-session-mode-window-row {
    margin-top: var(--size-2-2);
  }

  .journalit-settings .journalit-session-mode-add-window-button {
    min-width: 0 !important;
    height: 28px !important;
    min-height: 28px !important;
    padding: 3px 8px !important;
    gap: var(--size-2-1) !important;
    line-height: 1 !important;
  }

  .journalit-settings .journalit-session-mode-windows-heading {
    margin-top: var(--size-4-4) !important;
    margin-bottom: var(--size-2-1) !important;
    padding-top: var(--size-4-4) !important;
    padding-bottom: var(--size-2-1) !important;
    border-top: 1px solid var(--background-modifier-border) !important;
    border-radius: 0 !important;
    background: transparent !important;
  }

  .journalit-settings .journalit-session-mode-windows-heading + .journalit-session-mode-window-row {
    margin-top: 0 !important;
  }

  .journalit-settings .journalit-session-mode-lead-time-input {
    width: 72px;
  }

  .journalit-settings .session-mode-settings .journalit-settings-input {
    padding: 6px 8px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    box-sizing: border-box;
  }

  .journalit-settings .session-mode-settings .journalit-settings-input--time {
    width: 120px;
  }

  .journalit-settings .journalit-session-mode-window-list {
    padding: 0;
    border-radius: var(--radius-m);
    background: transparent;
  }

  .journalit-settings .journalit-session-mode-empty-window-setting {
    background: transparent !important;
  }

  .journalit-settings .journalit-session-mode-window-field {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
  }

  .journalit-settings .journalit-session-mode-window-field > label {
    display: block;
    margin-bottom: 2px;
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
    line-height: 1.2;
  }

  .journalit-settings .journalit-session-mode-window-name-field input {
    width: 100%;
  }

  .journalit-settings .journalit-session-mode-window-row > .journalit-session-mode-window-field:nth-of-type(2) {
    grid-column: 2;
  }

  .journalit-settings .journalit-session-mode-window-row > .journalit-session-mode-window-field:nth-of-type(3) {
    grid-column: 3;
  }

  .journalit-settings .journalit-session-mode-window-delete-field {
    grid-column: 4;
    align-self: end;
    padding-bottom: 3px;
  }

  .journalit-settings .journalit-session-mode-delete-window-button {
    color: var(--text-muted);
  }

  .journalit-settings .journalit-session-mode-resources-heading {
    margin-top: var(--size-4-4) !important;
    margin-bottom: var(--size-2-2) !important;
    padding-top: var(--size-4-4) !important;
    padding-bottom: var(--size-2-1) !important;
    border-top: 1px solid var(--background-modifier-border) !important;
    border-radius: 0 !important;
    background: transparent !important;
  }

  .journalit-settings .journalit-session-mode-linked-resources-accordion {
    margin-top: var(--size-4-4);
  }

  .journalit-settings .journalit-session-mode-linked-resources-settings {
    margin-top: var(--size-4-3);
  }

  .journalit-settings .journalit-session-mode-linked-resources-accordion .journalit-settings-accordion__content {
    padding-top: var(--size-2-2);
  }

  .journalit-settings .journalit-session-mode-resource-picker {
    position: relative;
    max-width: 420px;
  }

  .journalit-settings .journalit-session-mode-resource-search-icon {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 10px;
    color: var(--text-faint);
    pointer-events: none;
    transform: translateY(-50%);
  }

  .journalit-settings .journalit-session-mode-resource-setting {
    background: transparent !important;
    padding-top: var(--size-2-2) !important;
    padding-bottom: var(--size-2-2) !important;
  }

  .journalit-settings .journalit-session-mode-resource-setting .journalit-session-mode-linked-resources-toggle-control {
    align-self: center;
    padding-left: var(--size-2-2);
  }

  .journalit-settings button.journalit-session-mode-linked-resources-toggle {
    all: unset;
    box-sizing: border-box;
    width: auto !important;
    height: auto !important;
    min-width: 0 !important;
    min-height: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    color: var(--text-muted) !important;
    cursor: pointer;
    display: inline-flex !important;
    align-items: center;
    gap: var(--size-2-1);
    font-size: var(--font-ui-small);
    font-weight: var(--font-medium);
    line-height: 1.2;
    text-align: left !important;
    white-space: nowrap;
  }

  .journalit-settings button.journalit-session-mode-linked-resources-toggle:hover,
  .journalit-settings button.journalit-session-mode-linked-resources-toggle:focus-visible {
    border: 0 !important;
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    color: var(--text-accent) !important;
    text-decoration: underline;
  }

  .journalit-settings button.journalit-session-mode-linked-resources-toggle svg {
    flex: 0 0 auto;
  }

  .journalit-settings .journalit-session-mode-resource-setting .setting-item-info {
    width: 100%;
    max-width: 420px;
  }

  .journalit-settings .session-mode-settings .journalit-session-mode-resource-search {
    width: 100%;
    max-width: 420px;
    padding: 8px 12px 8px 34px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    font-size: 13px;
    outline: none;
  }

  .journalit-settings .journalit-session-mode-resource-results,
  .journalit-settings .journalit-session-mode-resource-list {
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
  }

  .journalit-settings .journalit-session-mode-resource-results {
    position: absolute;
    z-index: 20;
    top: calc(100% + var(--size-2-1));
    right: 0;
    left: 0;
    max-height: 188px;
    margin-top: 0;
    overflow-x: hidden;
    overflow-y: auto;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.32);
  }

  .journalit-settings .journalit-session-mode-resource-list {
    display: flex;
    max-width: 520px;
    flex-direction: column;
    margin-top: 0;
  }

  .journalit-settings button.journalit-session-mode-resource-result,
  .journalit-settings .journalit-session-mode-resource-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-2-2);
    min-width: 0;
    min-height: 44px;
    padding: 8px 12px;
    border-radius: 0;
    border-bottom: 1px solid var(--background-modifier-border);
    line-height: 1.35;
  }

  .journalit-settings button.journalit-session-mode-resource-result {
    width: 100%;
    height: auto;
    border: 0;
    border-bottom: 1px solid var(--background-modifier-border);
    background: transparent;
    box-shadow: none;
    color: var(--text-normal);
    text-align: left;
    cursor: pointer;
  }

  .journalit-settings button.journalit-session-mode-resource-result:last-child,
  .journalit-settings .journalit-session-mode-resource-row:last-child {
    border-bottom: 0;
  }

  .journalit-settings button.journalit-session-mode-resource-result:hover,
  .journalit-settings button.journalit-session-mode-resource-result:focus-visible {
    background: var(--background-modifier-hover);
    box-shadow: none;
  }

  .journalit-settings .journalit-session-mode-resource-result__name,
  .journalit-settings .journalit-session-mode-resource-row__name {
    color: var(--text-normal);
    font-size: var(--font-ui-small);
    font-weight: var(--font-medium);
    line-height: 1.35;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings .journalit-session-mode-resource-result__path,
  .journalit-settings .journalit-session-mode-resource-row__path {
    max-width: 100%;
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
    line-height: 1.35;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings button.journalit-session-mode-resource-result,
  .journalit-settings .journalit-session-mode-resource-row__text {
    min-width: 0;
  }

  .journalit-settings .journalit-session-mode-resource-row__text,
  .journalit-settings button.journalit-session-mode-resource-result {
    flex: 1 1 auto;
    flex-direction: column;
    align-items: flex-start;
  }

  .journalit-settings .journalit-session-mode-resource-row__text {
    display: flex;
    flex-direction: column;
  }

  .journalit-settings .journalit-session-mode-trade-gate-list {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-2);
    width: calc(100% - var(--size-4-3) * 2);
    max-width: 760px;
    margin: var(--size-2-2) var(--size-4-3) var(--size-4-3);
    padding: 0;
  }

  .journalit-settings .journalit-session-mode-trade-gate-heading {
    width: auto;
    margin-top: var(--size-4-4) !important;
    padding-top: var(--size-4-4) !important;
    border-top: 1px solid var(--background-modifier-border) !important;
    border-radius: 0 !important;
    background: transparent !important;
  }

  .journalit-settings .journalit-session-mode-trade-gate-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--size-2-2);
    align-items: center;
    padding: var(--size-2-1) var(--size-2-2) var(--size-2-1) var(--size-2-1);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    background: var(--background-secondary);
  }

  .journalit-settings .journalit-session-mode-trade-gate-row:hover {
    background: var(--background-modifier-hover);
  }

  .journalit-settings .journalit-session-mode-trade-gate-workflow {
    display: flex;
    flex-direction: column;
    padding: 0;
    border: 1px solid transparent;
    border-radius: var(--radius-m);
    overflow: visible;
  }

  .journalit-settings .journalit-session-mode-trade-gate-workflow.is-expanded {
    border-color: var(--background-modifier-border);
    background: var(--background-primary);
    overflow: hidden;
  }

  .journalit-settings .journalit-session-mode-trade-gate-workflow.is-expanded .journalit-session-mode-trade-gate-row {
    grid-template-columns: minmax(0, 1fr) auto auto;
    border-width: 0 0 1px;
    border-radius: 0;
  }

  .journalit-settings .journalit-session-mode-trade-gate-row > .tooltip-trigger {
    min-width: 0;
  }

  .journalit-settings .journalit-session-mode-trade-gate-row button.is-disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .journalit-sticky-header-clone.journalit-session-mode-trade-gate-header--sticky-clone {
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m) var(--radius-m) 0 0;
    background: var(--background-secondary);
    box-shadow:
      0 0 0 4px var(--background-primary),
      0 8px 18px rgba(0, 0, 0, 0.16);
    overflow: hidden;
  }

  .journalit-session-mode-trade-gate-header--sticky-clone .journalit-session-mode-trade-gate-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    border: 0;
    border-radius: 0;
  }

  .journalit-settings button.journalit-session-mode-trade-gate-expand {
    display: grid;
    height: auto;
    min-width: 0;
    min-height: 38px;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--size-2-2);
    padding: var(--size-2-1) var(--size-2-2);
    border: 0;
    background: transparent;
    box-shadow: none;
    line-height: 1.35;
    text-align: left;
  }

  .journalit-settings button.journalit-session-mode-trade-gate-expand:hover {
    background: transparent;
  }

  .journalit-settings .journalit-session-mode-trade-gate-expand__name {
    width: 100%;
    overflow: hidden;
    color: var(--text-normal);
    font-weight: var(--font-medium);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings .journalit-session-mode-trade-gate-expand__icon {
    display: inline-flex;
    color: var(--text-muted);
  }

  .journalit-settings .journalit-session-mode-trade-gate-summary {
    white-space: nowrap;
  }

  .journalit-settings .journalit-session-mode-trade-gate-editor {
    display: flex;
    flex-direction: column;
    gap: var(--size-4-2);
    padding: var(--size-2-3);
  }

  .journalit-settings .journalit-session-mode-trade-gate-editor-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--size-2-3);
  }

  .journalit-settings .journalit-session-mode-trade-gate-field,
  .journalit-settings .journalit-session-mode-trade-gate-field--wide {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: var(--size-2-1);
  }

  .journalit-settings .journalit-session-mode-trade-gate-field--wide {
    grid-column: 1 / -1;
  }

  .journalit-settings .journalit-session-mode-trade-gate-textarea {
    min-height: 64px;
    resize: vertical;
  }

  .journalit-settings .journalit-session-mode-trade-gate-editor-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2-2);
  }

  .journalit-settings .journalit-session-mode-trade-gate-outcome-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--size-2-1);
  }

  .journalit-settings .journalit-session-mode-trade-gate-outcome-summary__buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: var(--size-2-1);
  }

  .journalit-settings .journalit-session-mode-trade-gate-outcome-chip {
    height: 28px;
    min-height: 28px;
    padding: 0 var(--size-2-3);
    border: 1px solid var(--background-modifier-border-hover);
    border-radius: 999px;
    background: var(--background-secondary);
    box-shadow: none;
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
    font-weight: var(--font-semibold);
    line-height: 26px;
  }

  .journalit-settings .journalit-session-mode-trade-gate-outcome-chip:hover,
  .journalit-settings .journalit-session-mode-trade-gate-outcome-chip.is-selected {
    color: var(--text-normal);
  }

  .journalit-settings .journalit-session-mode-trade-gate-outcome-chip.is-green-light {
    border-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.55);
  }

  .journalit-settings .journalit-session-mode-trade-gate-outcome-chip.is-no-trade {
    border-color: rgba(var(--color-red-rgb, 233, 49, 71), 0.55);
  }

  .journalit-settings .journalit-session-mode-trade-gate-outcome-chip.is-wait {
    border-color: rgba(var(--color-yellow-rgb, 224, 175, 72), 0.55);
  }

  .journalit-settings .journalit-session-mode-trade-gate-results-panel {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-3);
    padding: var(--size-2-3);
    border: 1px solid var(--background-modifier-border-hover);
    border-radius: var(--radius-m);
    background: var(--background-primary-alt);
  }

  .journalit-settings .journalit-session-mode-trade-gate-results-panel.is-compact {
    position: absolute;
    z-index: 5;
    top: calc(100% + var(--size-2-1));
    right: 0;
    width: min(260px, calc(100vw - 64px));
    max-height: 360px;
    overflow: auto;
    box-shadow: var(--shadow-l);
  }

  .journalit-settings .journalit-session-mode-trade-gate-results-panel.is-compact .journalit-session-mode-trade-gate-results-panel__grid,
  .journalit-settings .journalit-session-mode-trade-gate-results-panel.is-compact .journalit-session-mode-trade-gate-results-panel__custom-list {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-1);
  }

  .journalit-settings .journalit-session-mode-trade-gate-results-panel.is-compact .journalit-session-mode-trade-gate-result-button {
    min-height: 34px;
    padding: var(--size-2-1) var(--size-2-2);
  }

  .journalit-settings .journalit-session-mode-trade-gate-results-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-2-3);
  }

  .journalit-settings .journalit-session-mode-trade-gate-results-panel__title {
    color: var(--text-normal);
    font-size: var(--font-ui-small);
    font-weight: var(--font-semibold);
  }

  .journalit-settings .journalit-session-mode-trade-gate-results-panel__group {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-1);
  }

  .journalit-settings .journalit-session-mode-trade-gate-results-panel__label {
    color: var(--text-faint);
    font-size: var(--font-ui-smaller);
    font-weight: var(--font-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .journalit-settings .journalit-session-mode-trade-gate-results-panel__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--size-2-2);
  }

  .journalit-settings .journalit-session-mode-trade-gate-results-panel__custom-list {
    display: grid;
    max-height: 160px;
    overflow: auto;
    gap: var(--size-2-2);
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button {
    display: flex;
    height: auto;
    min-height: 54px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 2px;
    padding: var(--size-2-2);
    border: 1px solid var(--background-modifier-border-hover);
    border-radius: var(--radius-s);
    background: var(--background-secondary);
    box-shadow: none;
    line-height: 1.25;
    text-align: left;
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button:hover,
  .journalit-settings .journalit-session-mode-trade-gate-result-button.is-selected {
    border-color: var(--interactive-accent);
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button.is-green-light {
    border-color: var(--background-modifier-border-hover);
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button.is-no-trade {
    border-color: var(--background-modifier-border-hover);
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button.is-wait {
    border-color: var(--background-modifier-border-hover);
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button.is-green-light .journalit-session-mode-trade-gate-result-button__title::before,
  .journalit-settings .journalit-session-mode-trade-gate-result-button.is-no-trade .journalit-session-mode-trade-gate-result-button__title::before,
  .journalit-settings .journalit-session-mode-trade-gate-result-button.is-wait .journalit-session-mode-trade-gate-result-button__title::before {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-right: var(--size-2-2);
    border-radius: 999px;
    content: '';
    vertical-align: 1px;
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button.is-green-light .journalit-session-mode-trade-gate-result-button__title::before {
    background: var(--color-green);
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button.is-no-trade .journalit-session-mode-trade-gate-result-button__title::before {
    background: var(--color-red);
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button.is-wait .journalit-session-mode-trade-gate-result-button__title::before {
    background: var(--color-yellow);
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button__title,
  .journalit-settings .journalit-session-mode-trade-gate-result-button__description {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button__title {
    color: var(--text-normal);
    font-weight: var(--font-semibold);
  }

  .journalit-settings .journalit-session-mode-trade-gate-result-button__description {
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
  }

  .journalit-settings .journalit-session-mode-trade-gate-editor select,
  .journalit-settings .journalit-session-mode-trade-gate-option-row select {
    height: 36px;
    min-height: 36px;
    padding-top: 6px;
    padding-bottom: 6px;
    line-height: 20px;
  }

  .journalit-settings .journalit-session-mode-trade-gate-option-row input {
    height: 36px;
    min-height: 36px;
  }

  .journalit-settings input.journalit-session-mode-trade-gate-workflow-name-input {
    height: 36px;
    min-height: 36px;
  }

  .journalit-settings input.journalit-session-mode-trade-gate-result-title-input {
    height: 36px;
    min-height: 36px;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-map {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-3);
    padding: var(--size-2-3);
    border: 1px solid var(--background-modifier-border-hover);
    border-radius: var(--radius-m);
    background: var(--background-primary-alt);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-map__toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--size-2-3);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-map__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2-2);
  }


  .journalit-settings .journalit-session-mode-trade-gate-flow-map__header {
    display: flex;
    justify-content: space-between;
    gap: var(--size-2-3);
    align-items: baseline;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-map__title {
    color: var(--text-muted);
    font-size: var(--font-ui-small);
    font-weight: var(--font-semibold);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-canvas {
    position: relative;
    overflow: hidden;
    min-height: 420px;
    padding: 0;
    border-radius: var(--radius-s);
    background: var(--background-primary);
    cursor: grab;
    touch-action: none;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-canvas.is-panning {
    cursor: grabbing;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-canvas__controls {
    display: inline-flex;
    align-items: center;
    gap: var(--size-2-1);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-canvas__controls button {
    min-width: 30px;
    height: 28px;
    min-height: 28px;
    padding: 0 var(--size-2-2);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-canvas__zoom {
    min-width: 42px;
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
    font-variant-numeric: tabular-nums;
    text-align: center;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-canvas__hint {
    position: absolute;
    left: var(--size-2-3);
    bottom: var(--size-2-2);
    color: var(--text-faint);
    font-size: var(--font-ui-smaller);
    pointer-events: none;
  }

  .journalit-settings .journalit-session-mode-trade-gate-unconnected {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-2);
    padding: var(--size-2-3);
    border: 1px dashed var(--background-modifier-border-hover);
    border-radius: var(--radius-s);
    background: var(--background-secondary);
  }

  .journalit-settings .journalit-session-mode-trade-gate-unconnected__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-2-2);
  }

  .journalit-settings .journalit-session-mode-trade-gate-unconnected__title {
    color: var(--text-normal);
    font-size: var(--font-ui-small);
    font-weight: var(--font-semibold);
  }

  .journalit-settings .journalit-session-mode-trade-gate-unconnected__count {
    display: inline-flex;
    min-width: 22px;
    height: 22px;
    align-items: center;
    justify-content: center;
    padding: 0 var(--size-2-1);
    border-radius: 999px;
    background: var(--background-modifier-hover);
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
    font-variant-numeric: tabular-nums;
  }

  .journalit-settings .journalit-session-mode-trade-gate-unconnected__list {
    display: grid;
    max-height: 146px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--size-2-1);
    overflow-y: auto;
  }

  .journalit-settings button.journalit-session-mode-trade-gate-unconnected__item {
    display: grid;
    min-width: 0;
    min-height: 34px;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    justify-content: initial;
    gap: var(--size-2-2);
    padding: var(--size-2-1) var(--size-2-2);
    border: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
    box-shadow: none;
    color: var(--text-muted);
    text-align: left;
  }

  .journalit-settings button.journalit-session-mode-trade-gate-unconnected__item:hover,
  .journalit-settings button.journalit-session-mode-trade-gate-unconnected__item.is-selected {
    border-color: var(--interactive-accent);
    color: var(--text-normal);
  }

  .journalit-settings .journalit-session-mode-trade-gate-unconnected__item-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings .journalit-session-mode-trade-gate-unconnected__item-index {
    color: var(--text-faint);
    font-size: var(--font-ui-smaller);
    font-variant-numeric: tabular-nums;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-stage {
    position: relative;
    width: var(--trade-gate-flow-width);
    height: var(--trade-gate-flow-height);
    margin: 0;
    transform: translate(
        var(--trade-gate-flow-pan-x, 0),
        var(--trade-gate-flow-pan-y, 0)
      )
      scale(var(--trade-gate-flow-scale, 1));
    transform-origin: 0 0;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg {
    position: absolute;
    inset: 0;
    display: block;
    pointer-events: none;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-edge path {
    fill: none;
    stroke: rgba(var(--mono-rgb-100), 0.28);
    stroke-linecap: round;
    stroke-width: 1.6;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-edge-label-button {
    position: absolute;
    left: var(--trade-gate-flow-edge-label-left);
    top: var(--trade-gate-flow-edge-label-top);
    display: block;
    width: max-content;
    max-width: 112px;
    height: 22px;
    min-height: 22px;
    padding: 0 var(--size-2-2);
    border: 1px solid var(--background-modifier-border-hover);
    border-radius: 999px;
    background: var(--background-secondary);
    box-shadow: none;
    color: var(--text-muted);
    font-size: 11px;
    font-weight: 600;
    line-height: 20px;
    overflow: hidden;
    justify-content: initial;
    align-items: initial;
    text-align: left;
    text-overflow: ellipsis;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node {
    position: absolute;
    left: var(--trade-gate-flow-node-left);
    top: var(--trade-gate-flow-node-top);
    display: flex;
    width: 132px;
    height: 84px;
    min-height: 84px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--size-2-2);
    padding: var(--size-2-3);
    border: 1px solid var(--background-modifier-border-hover);
    border-radius: var(--radius-m);
    background: var(--background-secondary);
    filter: none;
    box-shadow:
      0 10px 28px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.03);
    line-height: 1.2;
    text-align: center;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-selected {
    border-color: var(--interactive-accent);
    box-shadow:
      0 0 0 2px var(--interactive-accent),
      0 0 0 4px rgba(var(--mono-rgb-100), 0.08),
      0 10px 26px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-selected::after {
    position: absolute;
    top: var(--size-2-1);
    right: var(--size-2-1);
    width: 7px;
    height: 7px;
    border: 2px solid var(--background-primary);
    border-radius: 999px;
    background: var(--interactive-accent);
    content: '';
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-question {
    background: rgba(var(--color-blue-rgb, 72, 138, 224), 0.08);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-question .journalit-session-mode-trade-gate-flow-svg-node__icon {
    position: absolute;
    top: -16px;
    left: calc(50% - 16px);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-green-light {
    border-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.65);
    background: rgba(var(--color-green-rgb, 67, 160, 71), 0.1);
    box-shadow:
      0 10px 28px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.03);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-no-trade {
    border-color: rgba(var(--color-red-rgb, 233, 49, 71), 0.65);
    background: rgba(var(--color-red-rgb, 233, 49, 71), 0.1);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-wait {
    border-color: rgba(var(--color-yellow-rgb, 224, 175, 72), 0.65);
    background: rgba(var(--color-yellow-rgb, 224, 175, 72), 0.12);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-selected {
    border-color: var(--interactive-accent);
    box-shadow:
      0 0 0 2px var(--interactive-accent),
      0 0 0 4px rgba(var(--mono-rgb-100), 0.08),
      0 10px 26px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node__icon {
    display: inline-flex;
    width: 28px;
    height: 28px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: var(--background-modifier-hover);
    color: var(--text-muted);
    font-size: 15px;
    font-weight: var(--font-bold);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-question .journalit-session-mode-trade-gate-flow-svg-node__icon {
    border: 1px solid rgba(var(--color-blue-rgb, 72, 138, 224), 0.55);
    background: var(--background-secondary);
    color: var(--text-normal);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-green-light .journalit-session-mode-trade-gate-flow-svg-node__icon {
    background: rgba(var(--color-green-rgb, 67, 160, 71), 0.2);
    color: var(--color-green);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-no-trade .journalit-session-mode-trade-gate-flow-svg-node__icon {
    background: rgba(var(--color-red-rgb, 233, 49, 71), 0.2);
    color: var(--color-red);
    font-size: 22px;
    line-height: 1;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-wait .journalit-session-mode-trade-gate-flow-svg-node__icon {
    background: rgba(var(--color-yellow-rgb, 224, 175, 72), 0.2);
    color: var(--color-yellow);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node__content {
    display: flex;
    min-width: 0;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node__title {
    max-width: 100%;
    overflow: hidden;
    color: var(--text-normal);
    font-size: 12px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-green-light .journalit-session-mode-trade-gate-flow-svg-node__title,
  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-no-trade .journalit-session-mode-trade-gate-flow-svg-node__title,
  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node.is-wait .journalit-session-mode-trade-gate-flow-svg-node__title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-svg-node__detail {
    max-width: 100%;
    overflow: hidden;
    color: var(--text-muted);
    font-size: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--size-2-3);
    padding: var(--size-2-2) var(--size-2-2) 0;
    border-top: 1px solid var(--background-modifier-border-hover);
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--text-muted);
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor__summary {
    display: flex;
    align-items: center;
    gap: var(--size-2-2);
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor__status {
    display: inline-flex;
    width: 9px;
    height: 9px;
    flex: 0 0 auto;
    border-radius: 999px;
    background: var(--interactive-accent);
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor__status.is-green-light {
    background: var(--color-green);
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor__status.is-no-trade {
    background: var(--color-red);
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor__status.is-wait {
    background: var(--color-yellow);
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor__eyebrow {
    color: var(--text-faint);
    font-size: var(--font-ui-smaller);
    font-weight: var(--font-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor__title {
    color: var(--text-normal);
    font-size: var(--font-ui-small);
    font-weight: var(--font-semibold);
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor__type {
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-map__rows {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-1);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-map__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--size-2-1);
    min-width: 0;
    color: var(--text-muted);
    font-size: var(--font-ui-small);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-map__node,
  .journalit-settings .journalit-session-mode-trade-gate-flow-map__target,
  .journalit-settings .journalit-session-mode-trade-gate-flow-map__option {
    max-width: 100%;
    overflow: hidden;
    padding: 2px 6px;
    border-radius: var(--radius-s);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-map__node {
    background: rgba(var(--color-blue-rgb, 72, 138, 224), 0.12);
    color: var(--text-normal);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-map__option {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-map__target {
    background: rgba(var(--color-green-rgb, 67, 160, 71), 0.12);
    color: var(--text-normal);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-map__arrow {
    color: var(--text-faint);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-tree {
    overflow-x: auto;
    padding-bottom: var(--size-2-1);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-node {
    display: inline-flex;
    min-width: 150px;
    flex-direction: column;
    gap: var(--size-2-2);
    padding: var(--size-2-2);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    background: var(--background-secondary);
    vertical-align: top;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-node.is-question {
    border-color: rgba(var(--color-blue-rgb, 72, 138, 224), 0.35);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-node.is-green-light {
    border-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.45);
    background: rgba(var(--color-green-rgb, 67, 160, 71), 0.08);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-node.is-no-trade {
    border-color: rgba(var(--color-red-rgb, 233, 49, 71), 0.45);
    background: rgba(var(--color-red-rgb, 233, 49, 71), 0.08);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-node.is-wait {
    border-color: rgba(var(--color-yellow-rgb, 224, 175, 72), 0.45);
    background: rgba(var(--color-yellow-rgb, 224, 175, 72), 0.08);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-node.is-missing {
    border-style: dashed;
    color: var(--text-error);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-node__label {
    overflow: hidden;
    font-size: var(--font-ui-small);
    font-weight: var(--font-semibold);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-branches {
    display: flex;
    gap: var(--size-2-2);
    align-items: flex-start;
    padding-top: var(--size-2-2);
    border-top: 1px solid var(--background-modifier-border-hover);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-branch {
    display: flex;
    min-width: 160px;
    flex-direction: column;
    align-items: center;
    gap: var(--size-2-1);
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-branch__option {
    max-width: 160px;
    overflow: hidden;
    padding: 2px 8px;
    border-radius: var(--radius-s);
    background: var(--background-modifier-hover);
    color: var(--text-normal);
    font-size: var(--font-ui-smaller);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings .journalit-session-mode-trade-gate-flow-repeat {
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
  }

  .journalit-settings .journalit-session-mode-trade-gate-node-list {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-3);
  }

  .journalit-settings .journalit-session-mode-trade-gate-node {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-3);
    padding: var(--size-2-3);
    border: 0;
    border-radius: var(--radius-m);
    background: transparent;
  }

  .journalit-settings .journalit-session-mode-trade-gate-node__header,
  .journalit-settings .journalit-session-mode-trade-gate-options-editor__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-2-2);
    color: var(--text-muted);
    font-size: var(--font-ui-small);
    font-weight: var(--font-semibold);
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor .journalit-session-mode-trade-gate-node {
    position: relative;
    padding: 0;
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor .journalit-session-mode-trade-gate-node__header {
    position: absolute;
    top: 31px;
    right: 0;
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor .journalit-session-mode-trade-gate-editor-grid {
    padding-right: 42px;
  }

  .journalit-settings .journalit-session-mode-trade-gate-selected-editor .journalit-session-mode-trade-gate-node__header > span {
    display: none;
  }

  .journalit-settings .journalit-session-mode-trade-gate-options-editor {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-2);
  }

  .journalit-settings .journalit-session-mode-trade-gate-option-row {
    display: grid;
    grid-template-columns: minmax(120px, 0.75fr) minmax(160px, 1fr) auto;
    gap: var(--size-2-2);
    align-items: center;
  }

  @media (max-width: 720px) {
    .journalit-settings .journalit-session-mode-trade-gate-editor-grid,
    .journalit-settings .journalit-session-mode-trade-gate-option-row {
      grid-template-columns: 1fr;
    }
  }

  
  .journalit-settings .settings-tab-nav {
    display: flex;
    border-bottom: 1px solid var(--background-modifier-border);
    margin-bottom: 4px;
    justify-content: center;
    width: 100%;
    padding-bottom: 0;
  }

  
  .journalit-settings .settings-tab-button {
    padding: 8px 16px;
    cursor: pointer;
    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 2px solid transparent;
    color: var(--text-muted);
    font-weight: 500;
    margin-right: 8px;
    position: relative;
    bottom: -1px;
    background: transparent;
    border-radius: 0;
    font-size: 14px;
    transition: all 0.15s ease;
  }

  .journalit-settings .journalit-settings-main-nav .settings-tab-button {
    min-width: 86px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  
  .journalit-settings .settings-tab-button--active {
    border-bottom-color: var(--text-accent);
    color: var(--text-normal);
    font-weight: 600;
  }

  
  .journalit-settings .settings-tab-content {
    overflow: visible;
    padding: 4px 24px 20px;
    background: var(--background-primary);
  }

  .journalit-settings .journalit-settings-section {
    margin: 18px 0 22px;
    padding-top: 4px;
  }

  .journalit-settings .journalit-settings-section + .journalit-settings-section {
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 18px;
  }

  .journalit-settings .general-settings .journalit-settings-section + .journalit-settings-section {
    border-top: none;
    padding-top: 4px;
  }

  .journalit-settings .sync-settings .journalit-settings-subnav {
    border-bottom: none;
  }

  .journalit-settings .journal-settings .journalit-settings-subnav {
    border-bottom: none;
  }

  .journalit-settings .journal-settings .templates-defaults-section {
    margin-top: 12px;
  }

  .journalit-settings .journalit-settings-section h4 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-normal);
  }

  .journalit-settings .journalit-settings-section > .setting-item:first-of-type {
    border-top: none;
  }

  .journalit-settings .journalit-settings-trade-form-layout-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin: 14px 0 18px;
    padding: 14px 16px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 10px;
    background: var(--background-secondary);
  }

  .journalit-settings .journalit-settings-trade-form-layout-card__content {
    min-width: 0;
  }

  .journalit-settings .journalit-settings-trade-form-layout-card h4 {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-normal);
  }

  .journalit-settings .journalit-settings-trade-form-layout-card p {
    margin: 0;
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.4;
  }

  
  .journalit-settings-tab .option-edit-input {
    flex: 1 !important;
    margin-right: 12px !important;
    padding: 6px 10px !important;
    border: 1px solid var(--interactive-accent) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.3) !important;
    position: relative !important;
    z-index: 100 !important;
    min-width: 100px !important;
    pointer-events: auto !important;
    -webkit-user-select: text !important;
    user-select: text !important;
    cursor: text !important;
  }

  .journalit-settings-tab .custom-options-event-item-edit {
    display: block !important;
  }

  .journalit-settings-tab .custom-options-event-item-edit .setting-item-control {
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    margin-left: 0 !important;
  }

  .journalit-settings-tab .custom-options-event-editor {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
    min-width: 0 !important;
    width: 100% !important;
    text-align: start !important;
  }

  .journalit-settings-tab .custom-options-event-editor-main {
    width: 100% !important;
    align-self: flex-start !important;
    text-align: start !important;
  }

  .journalit-settings-tab .custom-options-event-input {
    display: block !important;
    flex: 0 1 auto !important;
    width: clamp(160px, 32vw, 280px) !important;
    max-width: min(280px, 100%) !important;
    margin-right: 0 !important;
  }

  .journalit-settings-tab .custom-options-event-editor-footer {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px !important;
    width: 100% !important;
  }

  .journalit-settings-tab .custom-options-event-notes-textarea {
    width: 100% !important;
    min-height: 88px !important;
    resize: vertical !important;
  }

  .journalit-settings-tab .custom-options-event-notes-preview {
    margin-top: 4px !important;
    white-space: pre-wrap !important;
  }

  .journalit-settings-tab .custom-options-event-actions {
    margin-top: 0 !important;
    margin-left: auto !important;
    flex-shrink: 0 !important;
    align-self: flex-end !important;
  }

  .journalit-settings-tab .custom-options-symbol-mapping-arrow {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    align-self: stretch !important;
    min-height: 34px !important;
    line-height: 1 !important;
  }

  
  .journalit-settings-tab .drc-settings .custom-item-add,
  .journalit-settings-tab .weekly-review-settings .custom-item-add,
  .journalit-settings-tab .custom-options-settings .custom-item-add {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    width: 100% !important;
    gap: 10px !important;
    margin-bottom: 16px !important;
    position: relative !important;
    padding: 4px 0 !important;
  }

  .journalit-settings-tab .custom-options-settings .custom-item-add {
    padding-inline: 8px !important;
  }

  
  .journalit-settings-tab .drc-settings input[type="text"],
  .journalit-settings-tab .drc-settings .custom-item-add input,
  .journalit-settings-tab .weekly-review-settings input[type="text"],
  .journalit-settings-tab .weekly-review-settings .custom-item-add input,
  .journalit-settings-tab .custom-options-settings input[type="text"],
  .journalit-settings-tab .custom-options-settings .custom-item-add input {
    height: 34px !important;
    line-height: normal !important;
    font-size: 16px !important;
    padding: 6px 10px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    width: 100% !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }

  .journalit-settings-tab .drc-settings .custom-item-add .input,
  .journalit-settings-tab .drc-settings .custom-item-add input,
  .journalit-settings-tab .weekly-review-settings .custom-item-add .input,
  .journalit-settings-tab .weekly-review-settings .custom-item-add input,
  .journalit-settings-tab .custom-options-settings .custom-item-add .input,
  .journalit-settings-tab .custom-options-settings .custom-item-add input {
    width: 100% !important;
    height: 34px !important;
    max-height: 34px !important;
    padding: 6px 10px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    font-size: 16px !important;
    box-shadow: none !important;
    transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
    line-height: normal !important;
    min-height: 34px !important;
    display: inline-block !important;
    appearance: none !important;
    overflow: visible !important;
  }

  .journalit-settings-tab .drc-settings .custom-item-add .input:focus,
  .journalit-settings-tab .drc-settings .custom-item-add input:focus,
  .journalit-settings-tab .weekly-review-settings .custom-item-add .input:focus,
  .journalit-settings-tab .weekly-review-settings .custom-item-add input:focus {
    border-color: var(--interactive-accent) !important;
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2) !important;
    outline: none !important;
  }

  
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .drc-settings .custom-item-add .inputContainer,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .drc-settings .custom-item-add .inputWrapper,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .weekly-review-settings .custom-item-add .inputContainer,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .weekly-review-settings .custom-item-add .inputWrapper {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    position: relative !important;
    display: block !important;
    height: 34px !important;
  }

  
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .drc-settings .custom-item-add div,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .drc-settings .custom-item-add .setting-item-info div,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .weekly-review-settings .custom-item-add div,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .weekly-review-settings .custom-item-add .setting-item-info div {
    height: auto !important;
    min-height: 34px !important;
    width: 100% !important;
    position: relative !important;
  }

  .journalit-settings-tab .drc-settings .custom-item-add .inputContainer,
  .journalit-settings-tab .weekly-review-settings .custom-item-add .inputContainer {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    position: relative !important;
    display: block !important;
  }

  .journalit-settings-tab .drc-settings .custom-item-add .setting-item-info,
  .journalit-settings-tab .weekly-review-settings .custom-item-add .setting-item-info {
    margin-right: 10px !important;
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }

  
  .journalit-settings-tab .drc-settings .custom-item-add .setting-item-control,
  .journalit-settings-tab .weekly-review-settings .custom-item-add .setting-item-control {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    min-width: auto !important;
    flex-shrink: 0 !important;
  }

  
  .journalit-settings-tab .drc-settings .custom-item-add button,
  .journalit-settings-tab .weekly-review-settings .custom-item-add button {
    min-width: 60px !important;
    height: 34px !important;
    max-height: 34px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    padding: 6px 12px !important;
    border-radius: 4px !important;
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent, white) !important;
    border: 1px solid var(--interactive-accent) !important;
    cursor: pointer !important;
    transition: background-color 0.15s ease !important;
  }

  .journalit-settings-tab .drc-settings button:hover,
  .journalit-settings-tab .weekly-review-settings button:hover {
    background-color: var(--interactive-accent-hover) !important;
    border-color: var(--interactive-accent-hover) !important;
  }

  
  
  .journalit-settings .drc-settings .custom-item-add input,
  .journalit-settings .weekly-review-settings .custom-item-add input,
  .journalit-settings .custom-options-settings .custom-item-add input,
  
  .journalit-settings input[placeholder="New checklist item"],
  .journalit-settings input[placeholder="New review question"],
  .journalit-settings input[placeholder="New timeframe (e.g., 15M, 5M)"],
  .journalit-settings input[placeholder="New timeframe (e.g., 4H, 1H)"],
  .journalit-settings input[placeholder="New timeframe (e.g., Weekly, Daily)"] {
    height: 34px !important;
    width: 100% !important;
    padding: 6px 10px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    font-size: 16px !important;
    box-shadow: none !important;
    transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
    line-height: normal !important;
    min-height: 34px !important;
    display: inline-block !important;
    appearance: none !important;
    overflow: visible !important;
    margin: 0 !important;
  }

  
  .journalit-settings .drc-settings .custom-item-add input:focus,
  .journalit-settings .weekly-review-settings .custom-item-add input:focus,
  .journalit-settings .custom-options-settings .custom-item-add input:focus,
  .journalit-settings input[placeholder="New checklist item"]:focus,
  .journalit-settings input[placeholder="New review question"]:focus,
  .journalit-settings input[placeholder="New timeframe (e.g., 15M, 5M)"]:focus,
  .journalit-settings input[placeholder="New timeframe (e.g., 4H, 1H)"]:focus,
  .journalit-settings input[placeholder="New timeframe (e.g., Weekly, Daily)"]:focus {
    
    border-color: var(--interactive-accent) !important;
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2) !important;
    outline: none !important;
  }

  
  .journalit-settings .cmdr-accordion {
    margin-bottom: 16px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    overflow: visible; 
    transition: box-shadow 0.2s ease;
  }

  .journalit-settings .cmdr-accordion:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .journalit-settings .cmdr-accordion .cmdr-accordion-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    padding: 12px 16px;
    cursor: pointer;
    background-color: var(--background-secondary);
    transition: background-color 0.15s ease;
  }

  .journalit-settings .cmdr-accordion .cmdr-accordion-header:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-settings .cmdr-accordion .cmdr-accordion-chevron > svg {
    transition: transform 0.3s ease-in-out;
  }

  .journalit-settings .cmdr-accordion .cmdr-accordion-content {
    max-height: none; 
    transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out, margin 0.3s ease-in-out;
    overflow: visible; 
    background-color: var(--background-primary);
    padding: 16px;
  }

  
  .journalit-settings .cmdr-accordion .cmdr-accordion-content .timeframe-manager > .setting-item:first-child,
  .journalit-settings .cmdr-accordion .cmdr-accordion-content .item-manager > .setting-item:first-child,
  .journalit-settings .cmdr-accordion .cmdr-accordion-content > div > .setting-item:first-child,
  .journalit-settings .cmdr-accordion .cmdr-accordion-content > .setting-item:first-child {
    border-top: none !important;
  }

  
  .journalit-settings .cmdr-accordion .cmdr-accordion-content .weekly-review-section {
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    background-color: transparent !important;
  }

  
  .journalit-settings .timeframe-manager .custom-item-add .inputContainer,
  .journalit-settings .timeframe-manager .custom-item-add input {
    height: 34px !important;
    min-height: 34px !important;
    margin: 0 !important;
    width: 100% !important;
  }

  
  .journalit-settings .item-manager .custom-item .setting-item-info {
    min-width: 0;
  }

  .journalit-settings .item-manager .custom-item .inputContainer {
    width: 100%;
  }

  .journalit-settings .item-manager .item-manager-item-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  .journalit-settings .item-manager .item-manager-item-actions .journalit-button {
    white-space: nowrap;
  }

  .journalit-settings .item-manager .item-manager-item-actions .item-manager-move-button {
    min-width: 28px !important;
    width: 28px;
    padding: 5px !important;
    gap: 0 !important;
  }

  
  .journalit-settings .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-chevron > svg {
    transform: rotate(-90deg);
  }

  .journalit-settings .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-content {
    max-height: 0 !important;
    transition: max-height 0.2s ease-out;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    overflow: hidden; 
  }
  
  
  .journalit-settings .edit-account-form.setting-item-container,
  .journalit-settings-tab .edit-account-form.setting-item-container {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    align-items: stretch !important;
  }

  
  .journalit-settings .edit-account-form.setting-item-container .edit-account-buttons,
  .journalit-settings-tab .edit-account-form.setting-item-container .edit-account-buttons {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    margin-top: 16px !important;
    position: relative !important;
  }
  
  .journalit-settings .edit-account-form.setting-item-container .edit-account-buttons .button-group-right,
  .journalit-settings-tab .edit-account-form.setting-item-container .edit-account-buttons .button-group-right {
    display: flex !important;
    gap: 8px !important;
    align-items: center !important;
  }
  
  
  .journalit-settings .accounts-list,
  .journalit-settings-tab .accounts-list {
    display: flex !important;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    width: 100% !important;
  }

  .journalit-settings .account-items,
  .journalit-settings-tab .account-items {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    flex-wrap: nowrap !important;
  }

  .journalit-settings .account-item,
  .journalit-settings-tab .account-item {
    width: 100% !important;
  }

  
  .mt-accounts-list {
    margin-top: 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .mt-account-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid var(--background-modifier-border);
    background-color: var(--background-primary);
  }

  .mt-account-item:last-child {
    border-bottom: none;
  }

  .mt-account-item:hover {
    background-color: var(--background-secondary);
  }

  .mt-account-info {
    flex: 1;
    min-width: 0;
  }

  .mt-account-id {
    font-weight: 600;
    color: var(--text-normal);
    margin-bottom: 4px;
  }

  .mt-account-broker {
    color: var(--text-muted);
    font-size: 0.9em;
    margin-bottom: 4px;
  }

  .mt-account-dates {
    color: var(--text-muted);
    font-size: 0.85em;
  }

  .mt-account-display {
    margin-left: 20px;
    min-width: 250px;
  }

  .mt-account-display .mt-account-action-button.journalit-button {
    min-width: 0 !important;
    height: 28px !important;
    padding: 4px 10px !important;
    font-size: 12px !important;
    margin-top: 8px;
  }

  .mt-account-name {
    display: flex;
    align-items: center;
  }

  .mt-account-name span {
    font-weight: 500;
    color: var(--text-normal);
  }

  .backend-integration__ignored-accounts {
    margin-top: 10px;
  }

  .backend-integration__ignored-accounts .journalit-settings-accordion {
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .backend-integration__ignored-accounts .journalit-settings-accordion__header {
    min-height: 34px;
    padding: 7px 12px;
    background: var(--background-secondary);
  }

  .backend-integration__ignored-accounts .mt-accounts-list {
    margin-top: 0;
    border: none;
    border-radius: 0;
  }

  .backend-integration__ignored-accounts .mt-accounts-list .setting-item {
    border: none;
    padding: 12px 14px;
  }

  .mt-account-edit {
    display: flex;
    align-items: center;
  }

  .mt-account-edit input {
    background-color: var(--background-primary-alt);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    padding: 4px 6px;
    color: var(--text-normal);
  }

  .mt-account-edit input:focus {
    border-color: var(--interactive-accent);
    outline: none;
  }

  
  
  .journalit-settings .setting-item-control,
  .journalit-settings-tab .setting-item-control {
    min-width: 120px !important;
    width: fit-content !important;
    flex-shrink: 0 !important;
  }

  .journalit-settings .setting-item-control select,
  .journalit-settings .setting-item-control .selectContainer,
  .journalit-settings .setting-item-control .select,
  .journalit-settings-tab .setting-item-control select,
  .journalit-settings-tab .setting-item-control .selectContainer,
  .journalit-settings-tab .setting-item-control .select {
    width: auto !important;
    min-width: 120px !important;
    text-align: center !important;
  }

  
  .journalit-settings select option {
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings select option:hover {
    background-color: var(--background-modifier-hover) !important;
  }

  
  .journalit-settings .inputContainer {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .journalit-settings .input,
  .journalit-settings textarea.input {
    width: 100% !important;
    padding: 8px 12px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    font-size: 14px !important;
    font-family: inherit !important;
    resize: vertical !important;
  }

  .journalit-settings .input:focus,
  .journalit-settings textarea.input:focus {
    border-color: var(--interactive-accent) !important;
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2) !important;
    outline: none !important;
  }

  
  .journalit-settings .journalit-button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 4px !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease !important;
    gap: 8px !important;
    user-select: none !important;
    outline: none !important;
    min-width: 80px !important;
  }

  
  .journalit-settings .journalit-button--small {
    padding: 6px 12px !important;
    font-size: 13px !important;
    height: 32px !important;
  }

  .journalit-settings .journalit-button--medium {
    padding: 8px 16px !important;
    font-size: 14px !important;
    height: 36px !important;
  }

  .journalit-settings .journalit-button--large {
    padding: 12px 24px !important;
    font-size: 16px !important;
    height: 44px !important;
  }

  
  .journalit-settings .journalit-button--primary {
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent, white) !important;
    border: 1px solid var(--interactive-accent) !important;
  }

  .journalit-settings .journalit-button--primary:hover:not(:disabled) {
    background-color: var(--interactive-accent-hover) !important;
    border-color: var(--interactive-accent-hover) !important;
  }

  .journalit-settings .journalit-button--secondary {
    background-color: var(--background-secondary) !important;
    color: var(--text-normal) !important;
    border: 1px solid var(--background-modifier-border) !important;
  }

  .journalit-settings .journalit-button--secondary:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
  }

  .journalit-settings .journalit-button--danger {
    background-color: var(--background-modifier-error) !important;
    color: var(--text-on-accent, white) !important;
    border: 1px solid var(--background-modifier-error) !important;
  }

  .journalit-settings .journalit-button--danger:hover:not(:disabled) {
    opacity: 0.9 !important;
  }

  .journalit-settings .journalit-button:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  
  .journalit-settings .account-profile-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    margin-bottom: 20px;
    border-bottom: none;
    background: transparent;
    border-radius: 0;
    gap: 16px;
  }

  .journalit-settings .sync-settings .account-profile-card {
    margin-top: 12px;
  }

  .journalit-settings .account-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }

  .journalit-settings .account-email-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .journalit-settings .account-email {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-normal);
  }

  .journalit-settings .tier-badge {
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
    border: 1px solid transparent;
  }

  
  .journalit-settings .tier-badge.tier-pro,
  .journalit-settings .tier-badge.tier-premium {
    background: rgba(var(--interactive-accent-rgb, 0, 200, 100), 0.15);
    color: var(--interactive-accent);
    border-color: var(--interactive-accent);
  }

  .journalit-settings .tier-badge.tier-enterprise {
    background: rgba(var(--interactive-accent-rgb, 0, 200, 100), 0.2);
    color: var(--interactive-accent);
    border-color: var(--interactive-accent);
    font-weight: 700;
  }

  .journalit-settings .tier-badge.tier-free {
    background: var(--background-secondary);
    color: var(--text-muted);
    border-color: var(--background-modifier-border);
  }

  .journalit-settings .tier-badge.tier-unknown {
    background: var(--background-secondary);
    color: var(--text-faint);
    border-color: var(--background-modifier-border);
  }

  .journalit-settings .account-status {
    font-size: 12px;
    font-weight: 400;
  }

  .journalit-settings .account-status.online {
    color: var(--color-green);
  }

  .journalit-settings .account-status.offline {
    color: var(--text-muted);
  }

  
  .journalit-settings .sign-out-inline.journalit-button--danger {
    background-color: transparent !important;
    color: var(--text-muted) !important;
    border: 1px solid var(--background-modifier-border) !important;
    font-size: 13px !important;
    padding: 6px 14px !important;
    height: auto !important;
    flex-shrink: 0;
    transition: all 0.15s ease !important;
  }

  .journalit-settings .sign-out-inline.journalit-button--danger:hover:not(:disabled) {
    background-color: var(--background-modifier-error) !important;
    color: var(--text-on-accent, white) !important;
    border-color: var(--background-modifier-error) !important;
  }

  .journalit-settings .sign-in-inline.journalit-button--primary {
    font-size: 13px !important;
    padding: 6px 14px !important;
    height: auto !important;
    flex-shrink: 0;
  }

  .journalit-settings .auth-error-panel {
    border: 1px solid var(--background-modifier-border);
    background: var(--background-secondary);
    border-left: 3px solid var(--background-modifier-error);
    border-radius: 6px;
    padding: 12px 14px;
    margin: 16px 0 20px;
  }

  .journalit-settings .auth-error-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-normal);
    margin-bottom: 8px;
  }

  .journalit-settings .auth-error-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .journalit-settings .auth-error-help {
    margin-top: 10px;
    font-size: 12px;
    color: var(--text-muted);
  }

  .journalit-settings .auth-error-help-content {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .journalit-settings .auth-error-help-icon {
    color: var(--text-faint);
  }

  
  .journalit-settings .account-section {
    margin-bottom: 24px;
  }

  .journalit-settings .section-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .journalit-settings .section-header {
    font-size: 11px;
    text-transform: uppercase;
    color: var(--text-muted);
    letter-spacing: 0.6px;
    font-weight: 600;
    margin-bottom: 0;
  }

  
  .journalit-settings .section-header-row .manage-subscription-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    text-decoration: none;
    transition: all 0.15s ease;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid var(--background-modifier-border);
    background: var(--background-secondary);
  }

  .journalit-settings .section-header-row .manage-subscription-link:hover {
    color: var(--interactive-accent);
    border-color: var(--interactive-accent);
    gap: 6px;
  }

  
  .journalit-settings .plan-features-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .journalit-settings .feature-tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    font-size: 12px;
    color: var(--text-muted);
  }

  .journalit-settings .feature-tag::before {
    content: "✓";
    margin-right: 6px;
    color: var(--color-green);
    font-weight: 600;
  }

  .journalit-settings .feature-tag--locked {
    border-style: dashed;
    color: var(--text-faint);
    background: var(--background-primary);
  }

  .journalit-settings .feature-tag--locked::before {
    content: "PRO";
    color: var(--text-faint);
    font-weight: 600;
  }

  

  .ftp-credentials-section {
    padding: 8px 0;
  }

  .ftp-credentials-section h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 600;
  }

  .ftp-credentials-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 16px;
  }

  .ftp-credential-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ftp-credential-field label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .ftp-readonly-input {
    flex: 0 1 auto;
    width: auto;
    min-width: 200px;
    max-width: 320px;
    padding: 8px 12px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    color: var(--text-normal);
    font-family: var(--font-monospace);
    font-size: 13px;
  }

  .ftp-credentials-section .input-with-action {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ftp-credentials-section .clickable-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--text-muted);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .ftp-credentials-section .clickable-icon:hover:not(:disabled) {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .ftp-credentials-section .clickable-icon:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ftp-info-message {
    margin-bottom: 16px;
    padding: 12px;
    background: var(--background-secondary);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text-muted);
  }


  .ftp-reset-password {
    margin-top: 24px;
    margin-bottom: 16px;
  }

  .ftp-reset-password-button {
    width: auto;
  }

  .ftp-reset-hint {
    margin-top: 10px;
    font-size: 14px;
    color: var(--text-muted);
  }

  .ftp-setup-instructions {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--background-modifier-border);
  }

  .ftp-setup-instructions h4 {
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
  }

  .ftp-setup-instructions ol {
    margin: 0;
    padding-left: 20px;
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-muted);
  }

  .ftp-setup-instructions li {
    margin-bottom: 8px;
  }

  .ftp-password-notice {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    font-size: 11px;
    color: var(--text-muted);
  }

  

  
  .backend-integration-settings .trade-sync-header {
    margin-bottom: 24px;
  }

  .backend-integration-settings .trade-sync-header h3 {
    margin-bottom: 8px;
  }

  .backend-integration-settings .journalit-trade-sync-source-switcher {
    display: flex;
    width: fit-content;
    gap: 4px;
    margin: 0 auto 8px;
    padding: 3px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background: var(--background-secondary);
  }

  .backend-integration-settings .journalit-trade-sync-source {
    padding: 6px 12px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 600;
    box-shadow: none;
    cursor: pointer;
  }

  .backend-integration-settings .journalit-trade-sync-source:hover {
    color: var(--text-normal);
    background: var(--background-modifier-hover);
  }

  .backend-integration-settings .journalit-trade-sync-source.is-active {
    color: var(--text-on-accent);
    background: var(--interactive-accent);
  }

  .backend-integration-settings .journalit-trade-sync-source-description {
    max-width: 520px;
    margin: 0 auto 18px;
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.45;
    text-align: center;
  }

  .journalit-settings .backend-integration-settings .journalit-trade-sync-trial {
    max-width: 560px;
    margin: 18px auto;
    padding: 24px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 10px;
    background: var(--background-secondary);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .journalit-settings .backend-integration-settings .journalit-trade-sync-trial-copy h3 {
    margin: 0 0 6px;
    padding: 0;
    color: var(--text-normal);
    font-size: 21px;
    line-height: 1.3;
    text-align: left;
  }

  .journalit-settings .backend-integration-settings .journalit-trade-sync-trial-copy p {
    margin: 0;
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.45;
  }

  .journalit-settings .backend-integration-settings .journalit-trade-sync-trial-benefits {
    display: grid;
    gap: 10px;
    margin: 18px 0;
    padding: 0;
    list-style: none;
  }

  .journalit-settings .backend-integration-settings .journalit-trade-sync-trial-benefits li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-normal);
    font-size: 14px;
    font-weight: 600;
  }

  .journalit-settings .backend-integration-settings .journalit-trade-sync-trial-benefits li > span {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 24px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-settings .backend-integration-settings .journalit-trade-sync-trial-actions {
    display: flex;
    gap: 8px;
  }

  .journalit-settings .backend-integration-settings .journalit-trade-sync-trial-actions .journalit-button--primary {
    flex: 1;
  }

  .journalit-settings .backend-integration-settings button.journalit-trade-sync-trial-signin {
    display: block;
    width: fit-content;
    margin: 12px auto 0;
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
    color: var(--text-accent);
    font-size: 12px;
    cursor: pointer;
  }

  .journalit-settings .backend-integration-settings button.journalit-trade-sync-trial-signin:hover {
    color: var(--text-accent-hover);
  }

  .journalit-settings .backend-integration-settings .journalit-trade-sync-trial-eligibility {
    margin: 8px 0 0;
    color: var(--text-faint);
    font-size: 11px;
    line-height: 1.4;
    text-align: center;
  }

  @media (max-width: 620px) {
    .journalit-settings .backend-integration-settings .journalit-trade-sync-trial-actions {
      flex-direction: column;
    }

    .journalit-settings .backend-integration-settings .journalit-trade-sync-trial-actions .journalit-button {
      width: 100%;
    }
  }

  .backend-integration-settings .journalit-trade-import-sync-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin: 16px 0;
  }

  .backend-integration-settings .journalit-trade-import-sync-toolbar label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted);
    font-size: 12px;
  }

  .backend-integration-settings .journalit-trade-import-sync-toolbar select {
    min-width: 180px;
  }

  .backend-integration-settings .journalit-trade-import-sync-card-subtext {
    margin-top: 6px;
    color: var(--text-muted);
    font-size: 12px;
    text-align: center;
  }

  .backend-integration-settings .journalit-trade-import-sync-pending {
    margin: 14px 0;
    color: var(--text-accent);
    font-size: 12px;
    font-weight: 600;
  }

  .backend-integration-settings .journalit-trade-import-sync-placeholder {
    margin-top: 16px;
    padding: 14px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background: var(--background-primary);
    color: var(--text-muted);
    font-size: 13px;
    text-align: center;
  }

  .backend-integration-settings .journalit-trade-import-account-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .backend-integration-settings .journalit-trade-import-account-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 10px;
    background: var(--background-primary);
  }

  .backend-integration-settings .journalit-trade-import-account-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__header div {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__header span {
    color: var(--text-muted);
    font-size: 12px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__count {
    padding: 3px 7px;
    border-radius: 999px;
    background: var(--background-modifier-hover);
    color: var(--text-accent) !important;
    font-size: 11px !important;
    font-weight: 700;
    white-space: nowrap;
  }

  .backend-integration-settings .journalit-trade-import-account-card__metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__metrics span {
    padding: 3px 7px;
    border-radius: 6px;
    background: var(--background-secondary);
    color: var(--text-muted);
    font-size: 11px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__mapping label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: var(--text-muted);
    font-size: 12px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__mapping select {
    width: 100%;
  }

  .backend-integration-settings .journalit-trade-import-account-card__mapping small {
    display: block;
    margin-top: 6px;
    color: var(--text-faint);
    font-size: 11px;
    line-height: 1.35;
  }

  .backend-integration-settings .journalit-trade-import-account-card__actions {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__actions button {
    justify-content: center;
  }

  .backend-integration-settings .journalit-trade-import-account-card__actions button:disabled {
    border-color: var(--background-modifier-border);
    background: var(--background-secondary);
    color: var(--text-faint);
    opacity: 0.75;
    cursor: not-allowed;
  }

  .backend-integration-settings .journalit-trade-import-sync-recovery {
    padding: 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background: var(--background-primary);
  }

  .backend-integration-settings .journalit-trade-import-sync-recovery-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }

  .backend-integration-settings .journalit-trade-import-sync-recovery-header strong {
    margin-right: auto;
  }

  .backend-integration-settings .journalit-trade-import-sync-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 6px;
    max-height: 260px;
    overflow: auto;
  }

  .backend-integration-settings .journalit-trade-import-sync-list label {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 6px;
    background: var(--background-secondary);
    font-size: 12px;
  }

  .backend-integration-settings .journalit-trade-import-sync-list small {
    color: var(--text-muted);
  }

  .backend-integration-settings .backend-integration__button-content {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }

  .backend-integration-settings .backend-integration__sync-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .backend-integration-settings .backend-integration__connection-error {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-error);
    margin-top: 4px;
  }

  .backend-integration-settings .backend-integration__loading {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .backend-integration-settings .backend-integration__account-linking-divider {
    margin-top: 30px;
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 20px;
  }

  .backend-integration-settings .account-linking-source-select {
    width: 350px;
    max-width: 100%;
  }

  .backend-integration-settings .account-linking-target-select {
    width: 250px;
    max-width: 100%;
  }

  .backend-integration-settings .backend-integration__sync-error-panel {
    margin-top: 4px;
    padding: 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background: var(--background-secondary);
  }

  .backend-integration-settings .backend-integration__sync-error-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-error);
  }

  .backend-integration-settings .backend-integration__sync-error-list {
    margin: 8px 0 0 18px;
    padding: 0;
    font-size: 12px;
    color: var(--text-normal);
  }

  .backend-integration-settings .backend-integration__sync-error-more {
    margin-top: 6px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .backend-integration-settings .backend-integration__sync-error-request {
    margin-top: 8px;
    font-size: 12px;
    color: var(--text-error);
  }

  .backend-integration-settings .backend-integration__sync-error-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  .backend-integration-settings .backend-integration__sync-discord-help {
    margin-top: 8px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .backend-integration-settings .backend-integration__sync-discord-help-content {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .backend-integration-settings .backend-integration__sync-discord-help-icon {
    color: var(--text-faint);
  }

  
  .setup-progress {
    margin-bottom: 20px;
    padding: 12px 16px;
    background: var(--background-secondary);
    border-radius: 8px;
    border: 1px solid var(--background-modifier-border);
  }

  .setup-progress-header {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  .setup-progress-steps {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
  }

  .setup-step {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 14px;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    flex: 1;
    min-width: 120px;
    max-width: calc(50% - 4px);
  }

  .setup-step:hover:not(:disabled) {
    border-color: var(--interactive-accent);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .setup-step:disabled {
    cursor: default;
  }

  .setup-step--completed {
    border-color: var(--background-modifier-border);
    background: var(--background-primary);
    opacity: 0.85;
  }

  .setup-step--current {
    border-color: var(--interactive-accent);
    background: rgba(var(--interactive-accent-rgb), 0.08);
    box-shadow: 0 0 0 1px var(--interactive-accent);
  }

  .setup-step--current .setup-step-indicator {
    background: var(--interactive-accent);
    color: var(--text-on-accent, white);
  }

  .setup-step--completed .setup-step-indicator {
    background: transparent;
    color: var(--color-green);
    border: 1px solid var(--color-green);
  }

  .setup-step--pending {
    opacity: 0.7;
  }

  .setup-step--pending .setup-step-indicator {
    background: var(--background-primary);
    color: var(--text-muted);
    border: 2px solid var(--background-modifier-border);
  }

  .setup-step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    flex-shrink: 0;
    font-size: 11px;
    transition: all 0.2s ease;
  }

  .setup-step-content {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .setup-step-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-normal);
  }

  .setup-step-description {
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.4;
    margin-top: 2px;
  }

  
  .setup-step-connector {
    display: none;
  }

  
  .status-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .status-card {
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .status-card:hover {
    border-color: var(--background-modifier-border-hover);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .status-card--connected {
    border-color: var(--background-modifier-border);
    background: var(--background-primary);
  }

  .status-card--disconnected {
    border-color: var(--background-modifier-error);
    background: rgba(var(--background-modifier-error-rgb, 255, 0, 0), 0.04);
  }

  .status-card--unknown {
    border-color: var(--text-muted);
  }

  .status-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }

  .status-card-content {
    flex: 1;
    margin-bottom: 12px;
  }

  .status-card-value {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    color: var(--text-normal);
  }

  .status-card-metric {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .status-card-metric--large {
    align-items: center;
    text-align: center;
    padding: 8px 0;
  }

  .metric-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-normal);
  }

  .metric-value--large {
    font-size: 32px;
    font-weight: 700;
    color: var(--interactive-accent);
    line-height: 1;
  }

  .metric-label {
    font-size: 12px;
    color: var(--text-muted);
  }

  .status-card-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: auto;
  }

  .status-card-actions .journalit-button {
    width: 100%;
    justify-content: center;
  }

  
  .status-icon {
    flex-shrink: 0;
  }

  .status-icon--success {
    color: var(--color-green);
  }

  .status-icon--error {
    color: var(--background-modifier-error);
  }

  .status-icon--pending {
    color: var(--text-muted);
  }

  
  @keyframes journalit-settings-icon-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .journalit-settings .status-card-action-icon,
  .journalit-settings .spinning {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-size, 14px);
    height: var(--icon-size, 14px);
    line-height: 0;
    flex: 0 0 var(--icon-size, 14px);
  }

  .journalit-settings .status-card-action-icon svg,
  .journalit-settings .spinning svg {
    display: block;
  }

  .journalit-settings .spinning svg {
    animation: journalit-settings-icon-spin 1s linear infinite;
    transform-box: view-box;
    transform-origin: center;
  }

  
  .custom-options-asset-select {
    width: 120px;
  }

  .custom-options-spec-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 8px;
    padding: 8px;
    background-color: var(--background-secondary);
    border-radius: 4px;
    text-align: left;
  }

  .custom-options-spec-grid > div {
    text-align: left;
    justify-self: stretch;
    width: 100%;
  }

  .custom-options-spec-label {
    font-size: 11px;
    color: var(--text-muted);
    display: block;
    margin-bottom: 4px;
    text-align: left;
  }

  .custom-options-cfd-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
    gap: 8px;
    margin-top: 8px;
    padding: 8px;
    background-color: var(--background-secondary);
    border-radius: 4px;
    align-items: end;
    text-align: left;
    justify-content: start;
  }

  .custom-options-cfd-row > div {
    text-align: left;
    justify-self: start;
    width: 100%;
  }

  .custom-options-cfd-actions {
    align-self: end;
    justify-self: end;
    margin-top: 0;
    white-space: nowrap;
    width: auto;
    text-align: right;
  }

  @media (max-width: 900px) {
    .custom-options-cfd-row {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .custom-options-cfd-actions {
      grid-column: 1 / -1;
      justify-self: end;
    }
  }

  .custom-options-spec-preview {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .custom-options-spec-built-in {
    margin-left: 4px;
    font-style: italic;
    color: var(--text-faint);
  }

  .journalit-settings-tab .custom-options-commission-section {
    container-type: inline-size;
    margin-top: 8px;
    padding: 8px;
    background-color: var(--background-secondary);
    border-radius: 4px;
    text-align: left;
  }

  .journalit-settings-tab .custom-options-commission-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 600;
    text-align: left;
  }

  .journalit-settings-tab .custom-options-commission-table {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .journalit-settings-tab .custom-options-commission-rule {
    display: grid;
    gap: 8px;
    align-items: end;
    width: 100%;
    box-sizing: border-box;
  }

  .journalit-settings-tab .custom-options-commission-rule--perSide {
    grid-template-columns: minmax(120px, 1fr) minmax(178px, 1.1fr) minmax(68px, 0.5fr) minmax(68px, 0.5fr) 28px;
  }

  .journalit-settings-tab .custom-options-commission-rule--roundTrip {
    grid-template-columns: minmax(120px, 1fr) minmax(178px, 1.1fr) minmax(68px, 0.5fr) minmax(68px, 0.5fr) 28px;
  }

  .journalit-settings-tab .custom-options-commission-rule--roundTrip .custom-options-commission-field--round-trip {
    grid-column: 3 / 5;
  }

  .journalit-settings-tab .custom-options-commission-field {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .journalit-settings-tab .custom-options-commission-field > span {
    display: block;
    color: var(--text-muted);
    font-size: 11px;
    line-height: 1.2;
    text-align: left;
  }

  .journalit-settings-tab .custom-options-commission-table input,
  .journalit-settings-tab .custom-options-commission-table select {
    min-width: 0;
    width: 100%;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown {
    position: relative;
    min-width: 0;
    width: 100%;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    min-width: 0;
    width: 100%;
    min-height: 30px;
    padding: 4px 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__summary {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__chevron {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__chevron--open {
    transform: rotate(180deg);
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    min-width: 100%;
    max-width: 280px;
    max-height: min(300px, 50vh);
    overflow-y: auto;
    margin-top: 4px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__option {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 6px 10px;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    color: var(--text-normal);
    cursor: pointer;
    font-size: 13px;
    text-align: left;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__option:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__option--active {
    color: var(--text-normal);
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__option-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-options-commission-method-toggle {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-width: 0;
    width: 100%;
    overflow: hidden;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background-color: var(--background-secondary);
  }

  .journalit-settings-tab .custom-options-commission-method-button {
    min-width: 0;
    width: 100%;
    min-height: 30px;
    padding: 4px 8px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    background-color: transparent;
    color: var(--text-muted);
    font-size: 12px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-options-commission-method-button + .custom-options-commission-method-button {
    border-left: 1px solid var(--background-modifier-border);
  }

  .journalit-settings-tab .custom-options-commission-method-button[aria-checked="true"] {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-settings-tab .custom-options-commission-method-button:hover {
    background-color: var(--interactive-hover);
    color: var(--text-normal);
  }

  .journalit-settings-tab .custom-options-commission-method-button[aria-checked="true"]:hover {
    background-color: var(--interactive-accent-hover);
    color: var(--text-on-accent);
  }

  .journalit-settings-tab .custom-options-compact-icon-button,
  .journalit-settings-tab .journalit-no-tooltip-button,
  .journalit-settings-tab .journalit-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    min-width: 28px;
    margin: 0;
    padding: 5px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.2s ease;
    line-height: 1;
  }

  .journalit-settings-tab .journalit-no-tooltip-button:hover,
  .journalit-settings-tab .journalit-icon-button:hover,
  .journalit-settings-tab .custom-options-compact-icon-button:hover {
    background-color: var(--background-modifier-hover);
    border-color: var(--interactive-accent);
    color: var(--text-normal);
  }

  .journalit-settings-tab .journalit-no-tooltip-button svg,
  .journalit-settings-tab .journalit-icon-button svg,
  .journalit-settings-tab .custom-options-compact-icon-button svg {
    width: 16px;
    height: 16px;
  }

  .journalit-settings-tab .journalit-no-tooltip-button > span,
  .journalit-settings-tab .journalit-icon-button > span,
  .journalit-settings-tab .custom-options-compact-icon-button > span {
    --icon-size: 16px;
  }

  .journalit-settings-tab .journalit-no-tooltip-button + .journalit-no-tooltip-button,
  .journalit-settings-tab .journalit-icon-button + .journalit-icon-button,
  .journalit-settings-tab .custom-options-compact-icon-button + .custom-options-compact-icon-button {
    margin-left: 8px;
  }

  .journalit-settings-tab .custom-options-commission-rule > .journalit-no-tooltip-button {
    width: 28px;
    height: 28px;
    min-width: 28px;
    padding: 4px;
  }

  @container (max-width: 520px) {
    .journalit-settings-tab .custom-options-commission-header {
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .journalit-settings-tab .custom-options-commission-header .journalit-button {
      width: auto;
      min-height: 32px;
      padding: 4px 10px;
      margin-left: auto;
    }

    .journalit-settings-tab .custom-options-commission-rule {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 28px;
      padding: 8px;
      border: 1px solid var(--background-modifier-border);
      border-radius: 6px;
      background-color: var(--background-primary);
    }

    .journalit-settings-tab .custom-options-commission-field--account {
      grid-column: 1 / 3;
    }

    .journalit-settings-tab .custom-options-commission-field--method {
      grid-column: 1 / 3;
    }

    .journalit-settings-tab .custom-options-commission-method-button {
      min-height: 32px;
    }

    .journalit-settings-tab .custom-options-commission-field--entry {
      grid-column: 1;
    }

    .journalit-settings-tab .custom-options-commission-field--exit {
      grid-column: 2;
    }

    .journalit-settings-tab .custom-options-commission-field--round-trip {
      grid-column: 1 / 3;
    }

    .journalit-settings-tab .custom-options-commission-rule > .journalit-no-tooltip-button {
      grid-column: 3;
      grid-row: 1;
      align-self: start;
      justify-self: end;
      margin-top: 16px;
      width: 28px;
      height: 28px;
      min-width: 28px;
      padding: 4px;
    }
  }

  @container (max-width: 360px) {
    .journalit-settings-tab .custom-options-commission-rule {
      grid-template-columns: minmax(0, 1fr) 28px;
    }

    .journalit-settings-tab .custom-options-commission-field--account,
    .journalit-settings-tab .custom-options-commission-field--method,
    .journalit-settings-tab .custom-options-commission-field--entry,
    .journalit-settings-tab .custom-options-commission-field--exit,
    .journalit-settings-tab .custom-options-commission-field--round-trip {
      grid-column: 1 / -1;
    }

    .journalit-settings-tab .custom-options-commission-rule > .journalit-no-tooltip-button {
      grid-column: 2;
      grid-row: 1;
      margin-top: 16px;
    }
  }

  .custom-options-mapped-message {
    font-size: 11px;
    color: var(--text-accent);
    margin-top: 4px;
    font-style: italic;
  }

  .custom-options-spec-empty {
    font-size: 11px;
    color: var(--text-faint);
    margin-top: 4px;
    font-style: italic;
  }

  .custom-options-color-picker {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding: 8px;
    width: fit-content;
    max-width: 100%;
    background-color: var(--background-secondary);
    border-radius: 4px;
  }

  .custom-options-color-picker--compact {
    margin-top: 0;
    padding: 6px 8px;
    gap: 6px;
  }

  .custom-options-color-label {
    font-size: 12px;
    color: var(--text-muted);
  }

  .custom-options-color-option {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    cursor: pointer;
    padding: 4px;
    background-color: transparent;
    border: 2px solid transparent;
  }

  .custom-options-color-option--selected {
    background-color: var(--background-modifier-hover);
    border-color: var(--interactive-accent);
  }

  .custom-options-color-swatch {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid var(--background-modifier-border);
  }

  .custom-options-color-swatch--gray {
    background-color: var(--text-muted);
  }

  .custom-options-color-swatch--red {
    background-color: var(--color-red, red);
  }

  .custom-options-color-swatch--orange {
    background-color: var(--color-warning, orange);
  }

  .custom-options-color-swatch--yellow {
    background-color: var(--color-warning-light, #ffb74d);
  }

  .custom-options-name-row {
    display: flex;
    align-items: center;
  }

  .custom-options-name-row--gap {
    gap: 6px;
  }

  .custom-options-asset-tag {
    display: inline-block;
    margin-left: 8px;
    font-size: 12px;
    color: var(--text-muted);
    padding: 2px 6px;
    border-radius: 4px;
    background-color: var(--background-secondary);
  }

  .custom-options-lock-icon {
    color: var(--text-muted);
    opacity: 0.7;
  }

  .custom-options-locked-label {
    font-size: 11px;
    color: var(--text-muted);
    font-style: italic;
  }

  .custom-options-event-color-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 8px;
    border: 1px solid var(--background-modifier-border);
  }

  .custom-options-event-color-dot--gray {
    background-color: var(--text-muted);
  }

  .custom-options-event-color-dot--red {
    background-color: var(--color-red, red);
  }

  .custom-options-event-color-dot--orange {
    background-color: var(--color-warning, orange);
  }

  .custom-options-event-color-dot--yellow {
    background-color: var(--color-warning-light, #ffb74d);
  }

  .journalit-settings-tab .custom-options-label-color-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 50%;
    background: var(--journalit-label-color, var(--text-muted));
  }

  .journalit-settings-tab .option-item .journalit-label-color-picker {
    flex-wrap: wrap;
  }

  
  @media (max-width: 768px) {
    .setup-progress-steps {
      flex-direction: column;
    }

    .setup-step-connector {
      display: none;
    }

    .setup-step {
      width: 100%;
    }

    .status-cards {
      grid-template-columns: 1fr;
    }
  }

  
  @media (max-width: 600px) {
    .journalit-settings-tab input[type="text"],
    .journalit-settings-tab .custom-item-add input,
    .journalit-settings input,
    .mt-account-edit input {
      font-size: 18px !important;
    }
  }

  @media (max-width: 768px) {
    .journalit-settings .settings-tab-nav {
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 8px;
    }

    .journalit-settings .settings-tab-button {
      margin-right: 0;
    }
  }

  
  .journalit-settings .general-settings .journalit-settings-links {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    align-items: center;
  }

  .journalit-settings .general-settings .journalit-settings-display-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-settings .general-settings .journalit-settings-display-name-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    font-size: 14px;
  }

  .journalit-settings .general-settings .journalit-settings-display-name-button {
    padding: 6px 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    min-width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-settings .general-settings .journalit-settings-display-name-button--confirm {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-settings .general-settings .journalit-settings-display-name-button--cancel {
    background-color: var(--background-modifier-error);
    color: var(--text-normal);
  }

  .journalit-settings .general-settings .journalit-settings-divider {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-settings .general-settings .journalit-settings-divider--compact {
    margin-top: 8px;
    padding-top: 8px;
  }

  .journalit-settings .general-settings .journalit-settings-input {
    padding: 8px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    box-sizing: border-box;
  }

  .journalit-settings .general-settings .journalit-settings-input--compact {
    width: 80px;
  }

  .journalit-settings .general-settings .journalit-settings-input--time {
    width: 120px;
  }

  .journalit-settings .general-settings .journalit-settings-range {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .journalit-settings .general-settings .journalit-settings-muted-text {
    color: var(--text-muted);
  }

  .journalit-settings .general-settings .journalit-settings-text-error {
    color: var(--text-error);
  }

  .journalit-settings .general-settings .journalit-settings-action-button.journalit-button:disabled {
    background-color: var(--background-modifier-border);
    border-color: var(--background-modifier-border);
    color: var(--text-on-accent);
    opacity: 0.6;
  }

  
  .journalit-settings-tab .custom-fields-manager {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-intro {
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.45;
    padding: 2px 4px 4px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-panel,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel,
  .journalit-settings-tab .custom-fields-manager .custom-fields-empty-state,
  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-zone {
    border: 1px solid var(--background-modifier-border);
    border-radius: 12px;
    background: var(--background-secondary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-panel,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel {
    overflow: hidden;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-header,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel-header,
  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-zone {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-header,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel-header {
    border-bottom: 1px solid var(--background-modifier-border);
    background: var(--background-secondary-alt);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-title,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel-title,
  .journalit-settings-tab .custom-fields-manager .custom-fields-empty-title,
  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-zone-title {
    color: var(--text-normal);
    font-size: 14px;
    font-weight: 600;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-description,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel-description,
  .journalit-settings-tab .custom-fields-manager .custom-fields-empty-description,
  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-zone-description {
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.35;
    margin-top: 3px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-meta {
    color: var(--text-muted);
    font-size: 12px;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-list {
    display: flex;
    flex-direction: column;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-groups-list {
    display: flex;
    flex-direction: column;
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-panel {
    border-bottom: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-panel:last-child {
    border-bottom: none;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 54px;
    padding: 10px 12px 10px 16px;
    background: var(--background-secondary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .setting-item-info {
    min-width: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .setting-item-control {
    margin-left: 0;
    flex-shrink: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .setting-item-name {
    color: var(--text-normal);
    font-size: 14px;
    font-weight: 600;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .setting-item-description {
    color: var(--text-muted);
    font-size: 12px;
    margin-top: 2px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .custom-review-field-group-icon-button.journalit-button {
    width: 28px !important;
    min-width: 28px !important;
    max-width: 28px !important;
    height: 28px !important;
    padding: 5px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    gap: 0 !important;
    justify-content: center !important;
    line-height: 1 !important;
    transition: all 0.2s ease !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .custom-review-field-group-icon-button.journalit-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .custom-review-field-group-add-button.journalit-button {
    background-color: var(--interactive-accent) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-on-accent) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .custom-review-field-group-add-button.journalit-button:hover:not(:disabled) {
    background-color: var(--interactive-accent-hover) !important;
    border-color: var(--interactive-accent-hover) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-editor {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px 10px 16px;
    border-top: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-editor-label {
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-editor .inputContainer,
  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-editor .inputWrapper,
  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-editor input {
    flex: 1 1 auto;
    min-width: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-empty-group {
    padding: 12px 16px;
    color: var(--text-muted);
    font-size: 12px;
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 56px;
    padding: 10px 12px 10px 16px;
    border-bottom: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item:last-child {
    border-bottom: none;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item:hover {
    background: var(--background-modifier-hover);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item .setting-item-info {
    min-width: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item .setting-item-control {
    margin-left: 0;
    flex-shrink: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item .setting-item-name {
    color: var(--text-normal);
    font-size: 14px;
    font-weight: 600;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item .setting-item-description {
    color: var(--text-muted);
    font-size: 12px;
    margin-top: 2px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-empty-state {
    padding: 22px 18px;
    text-align: center;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-zone {
    background: transparent;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor {
    padding: 4px 16px 16px;
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:first-child {
    display: none;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item {
    border-top: none;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 12px 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:has(.setting-item-control) {
    border-bottom: none;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:not(:has(.setting-item-control)) {
    border-top: 1px solid var(--background-modifier-border);
    border-bottom: none;
    margin-top: 14px;
    padding: 16px 0 6px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:first-child + .setting-item:not(:has(.setting-item-control)),
  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:first-child + .setting-item {
    border-top: none;
    margin-top: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:not(:has(.setting-item-control)) .setting-item-name {
    color: var(--text-faint);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-accordion {
    margin-left: 16px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-accordion-title {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-outline {
    color: var(--text-error);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-actions,
  .journalit-settings-tab .custom-fields-manager .custom-fields-reorder-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-settings-tab .option-actions,
  .journalit-settings-tab .item-manager-item-actions {
    gap: 8px;
  }

  .journalit-settings-tab .item-manager-item-actions .item-manager-icon-button.journalit-button,
  .journalit-settings-tab .item-manager-item-actions .item-manager-move-button.journalit-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px !important;
    height: 28px !important;
    min-width: 28px !important;
    padding: 5px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.2s ease !important;
    line-height: 1;
  }

  .journalit-settings-tab .item-manager-item-actions .item-manager-icon-button.journalit-button:hover:not(:disabled),
  .journalit-settings-tab .item-manager-item-actions .item-manager-move-button.journalit-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings-tab .item-manager-item-actions .item-manager-icon-button.journalit-button svg,
  .journalit-settings-tab .item-manager-item-actions .item-manager-move-button.journalit-button svg {
    width: 14px;
    height: 14px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-reorder-button,
  .journalit-settings-tab .custom-fields-manager .custom-fields-edit-button {
    min-width: 28px !important;
    width: 28px !important;
    height: 28px !important;
    padding: 5px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    gap: 0 !important;
    flex: 0 0 28px;
    line-height: 1;
    transition: all 0.2s ease !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-reorder-button:hover:not(:disabled),
  .journalit-settings-tab .custom-fields-manager .custom-fields-edit-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-edit-button svg {
    display: block;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-reorder-button:disabled {
    opacity: 0.35;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-item {
    min-height: auto;
    padding: 4px 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-name {
    font-size: 0.9em;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-button {
    padding: 2px 8px;
    font-size: 0.8em;
    min-width: auto;
  }

  .journalit-settings-tab .custom-review-field-editor .setting-item-control {
    overflow: visible;
  }

  .journalit-settings-tab .custom-review-field-editor .journalit-combobox.combobox-container[data-is-open="true"] {
    z-index: 20010;
  }

  .journalit-settings-tab .custom-review-field-editor .journalit-combobox .combobox-dropdown {
    z-index: 20011;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-fields-option-move-button,
  .journalit-settings-tab .custom-review-field-editor .custom-fields-option-delete-button {
    min-width: 28px !important;
    width: 28px !important;
    height: 28px !important;
    padding: 5px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    gap: 0 !important;
    flex: 0 0 28px;
    line-height: 1;
    transition: all 0.2s ease !important;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-fields-option-move-button:hover:not(:disabled),
  .journalit-settings-tab .custom-review-field-editor .custom-fields-option-delete-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-number-input {
    max-width: 96px;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-review-type-setting {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-review-type-setting .setting-item-info,
  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-review-type-setting .setting-item-control {
    width: 100%;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 8px 14px;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-move-button,
  .journalit-settings-tab .custom-fields-manager .custom-fields-option-delete-button {
    min-width: 28px !important;
    width: 28px !important;
    height: 28px !important;
    padding: 5px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    gap: 0 !important;
    flex: 0 0 28px;
    line-height: 1;
    transition: all 0.2s ease !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-move-button:hover:not(:disabled),
  .journalit-settings-tab .custom-fields-manager .custom-fields-option-delete-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-delete-button {
    color: var(--text-error);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-delete-button svg {
    display: block;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-required-indicator {
    color: var(--text-error);
    margin-left: 4px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-key-preview {
    background-color: var(--background-modifier-border);
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 0.9em;
    color: var(--custom-fields-key-color, var(--text-accent));
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-key-reserved {
    color: var(--text-error);
    margin-left: 8px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-label-control {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-label-error {
    width: 100%;
    color: var(--text-error);
    margin-top: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-label-error code {
    color: inherit;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-checkbox {
    transform: scale(1.2);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-top: 1px solid var(--background-modifier-border) !important;
    padding-top: 16px !important;
    margin-top: 16px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-primary-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-delete-button,
  .journalit-settings-tab .custom-fields-manager .custom-fields-delete-all-button {
    background-color: var(--background-modifier-error) !important;
    border-color: var(--background-modifier-error) !important;
    color: var(--text-on-accent) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-delete-button:hover,
  .journalit-settings-tab .custom-fields-manager .custom-fields-delete-all-button:hover {
    background-color: var(--text-error) !important;
    border-color: var(--text-error) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-divider {
    border-top: 2px solid var(--background-modifier-border);
    margin-top: 16px;
    padding-top: 16px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-actions {
    justify-content: space-between;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-actions-buttons {
    display: flex;
    gap: 8px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-saved-options {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--background-modifier-border);
  }
`;
