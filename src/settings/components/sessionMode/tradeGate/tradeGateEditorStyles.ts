

export const TRADE_GATE_EDITOR_STYLES = `
  
  .journalit-settings .journalit-session-mode-trade-gate-expand__summary {
    flex: 0 0 auto;
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
    white-space: nowrap;
  }

  
  .journalit-settings
    .journalit-session-mode-trade-gate-flow-edge.is-unwired
    path {
    stroke-dasharray: 5 4;
    opacity: 0.7;
  }

  
  .journalit-settings button.journalit-trade-gate-flow-outcome {
    position: absolute;
    left: var(--trade-gate-flow-node-left);
    top: var(--trade-gate-flow-node-top);
    display: inline-flex;
    width: 132px;
    height: auto;
    min-height: 0;
    align-items: center;
    justify-content: center;
    gap: var(--size-2-1);
    padding: var(--size-2-2) var(--size-2-3);
    border: 1px solid var(--background-modifier-border);
    border-radius: 999px;
    background: var(--background-secondary);
    font-size: var(--font-ui-smaller);
    font-weight: var(--font-semibold);
    cursor: pointer;
  }

  .journalit-settings button.journalit-trade-gate-flow-outcome.is-green-light {
    border-color: rgba(var(--color-green-rgb), 0.55);
    background: rgba(var(--color-green-rgb), 0.12);
    color: var(--color-green);
  }

  .journalit-settings button.journalit-trade-gate-flow-outcome.is-no-trade {
    border-color: rgba(var(--color-red-rgb), 0.55);
    background: rgba(var(--color-red-rgb), 0.12);
    color: var(--color-red);
  }

  .journalit-settings button.journalit-trade-gate-flow-outcome.is-wait {
    border-color: rgba(var(--color-yellow-rgb), 0.55);
    background: rgba(var(--color-yellow-rgb), 0.12);
    color: var(--color-yellow);
  }

  .journalit-settings button.journalit-trade-gate-flow-outcome:hover {
    filter: brightness(1.1);
  }

  
  .journalit-settings button.journalit-trade-gate-flow-unwired {
    position: absolute;
    left: var(--trade-gate-flow-node-left);
    top: var(--trade-gate-flow-node-top);
    display: inline-flex;
    width: 132px;
    height: auto;
    min-height: 0;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: var(--size-2-2) var(--size-2-3);
    border: 1px dashed rgba(var(--color-yellow-rgb), 0.75);
    border-radius: var(--radius-m);
    background: rgba(var(--color-yellow-rgb), 0.08);
    color: var(--color-yellow);
    cursor: pointer;
  }

  .journalit-settings button.journalit-trade-gate-flow-unwired:hover {
    background: rgba(var(--color-yellow-rgb), 0.16);
  }

  .journalit-settings .journalit-trade-gate-flow-unwired__label {
    font-size: var(--font-ui-smaller);
    font-weight: var(--font-semibold);
  }

  .journalit-settings .journalit-trade-gate-flow-unwired__hint {
    color: var(--text-muted);
    font-size: 10px;
  }

  
  .journalit-settings .journalit-trade-gate-unplaced {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-2);
    padding: var(--size-2-3);
    border: 1px dashed var(--background-modifier-border-hover);
    border-radius: var(--radius-m);
  }

  .journalit-settings .journalit-trade-gate-unplaced__title {
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
    font-weight: var(--font-semibold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .journalit-settings .journalit-trade-gate-unplaced__list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2-2);
  }

  .journalit-settings button.journalit-trade-gate-unplaced__chip {
    display: inline-flex;
    width: auto;
    height: auto;
    min-height: 0;
    align-items: center;
    padding: var(--size-2-1) var(--size-2-3);
    border: 1px solid var(--background-modifier-border);
    border-radius: 999px;
    background: var(--background-secondary);
    font-size: var(--font-ui-smaller);
    cursor: pointer;
  }

  .journalit-settings button.journalit-trade-gate-unplaced__chip:hover {
    background: var(--background-modifier-hover);
  }

  
  .journalit-trade-gate-question-modal-host {
    width: min(560px, 92vw);
  }

  .journalit-trade-gate-question-modal {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-3);
  }

  .journalit-trade-gate-question-modal__field {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-1);
  }

  .journalit-trade-gate-question-modal__field input,
  .journalit-trade-gate-question-modal__option-row input,
  .journalit-trade-gate-question-modal__note textarea,
  .journalit-trade-gate-question-modal__textarea {
    width: 100%;
  }

  .journalit-trade-gate-question-modal__textarea {
    min-height: 56px;
    resize: vertical;
  }

  .journalit-trade-gate-question-modal__options-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--size-2-2);
    font-weight: var(--font-semibold);
  }

  .journalit-trade-gate-question-modal__options {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-3);
  }

  .journalit-trade-gate-question-modal__option {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-2);
    padding: var(--size-2-2);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    background: var(--background-secondary);
  }

  .journalit-trade-gate-question-modal__option-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
    gap: var(--size-2-2);
    align-items: center;
  }

  .journalit-trade-gate-question-modal__option-row--no-routing {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .journalit-trade-gate-question-modal__note {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-1);
  }

  .journalit-trade-gate-question-modal__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-2-3);
    margin-top: var(--size-2-3);
    padding-top: var(--size-2-3);
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-trade-gate-question-modal__footer-info {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: var(--size-2-1);
    align-items: flex-start;
  }

  .journalit-trade-gate-question-modal__footer-actions {
    display: flex;
    flex: 0 0 auto;
    gap: var(--size-2-2);
  }

  .journalit-trade-gate-question-modal button.journalit-trade-gate-question-modal__remove {
    display: inline;
    width: auto;
    height: auto;
    min-height: 0;
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
    color: var(--text-error);
    font-size: var(--font-ui-smaller);
    text-decoration: underline;
    cursor: pointer;
  }

  
  .journalit-trade-gate-library-modal-host {
    width: min(600px, 92vw);
  }

  .journalit-trade-gate-library {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-3);
  }

  .journalit-trade-gate-library__toolbar {
    display: flex;
    gap: var(--size-2-2);
    align-items: center;
  }

  .journalit-trade-gate-library__toolbar input {
    flex: 1 1 auto;
  }

  .journalit-trade-gate-library__list {
    display: flex;
    flex-direction: column;
  }

  .journalit-trade-gate-library__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    gap: var(--size-2-3);
    align-items: center;
    padding: var(--size-2-3) var(--size-2-1);
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-trade-gate-library__row:last-child {
    border-bottom: 0;
  }

  .journalit-trade-gate-library__row-main {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: var(--size-2-1);
  }

  .journalit-trade-gate-library__row-title {
    overflow: hidden;
    font-weight: var(--font-semibold);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-trade-gate-library__row-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2-1);
  }

  .journalit-trade-gate-library__chip {
    padding: 1px var(--size-2-2);
    border: 1px solid var(--background-modifier-border);
    border-radius: 999px;
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
  }

  .journalit-trade-gate-library__usage {
    flex: 0 0 auto;
    padding: 2px var(--size-2-2);
    border-radius: var(--radius-s);
    background: var(--background-modifier-hover);
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
    white-space: nowrap;
  }

  .journalit-trade-gate-library__usage.is-unused {
    border: 1px dashed var(--background-modifier-border-hover);
    background: transparent;
  }

  .journalit-trade-gate-library__row-actions {
    display: flex;
    flex: 0 0 auto;
    gap: var(--size-2-1);
    align-items: center;
  }

  .journalit-trade-gate-library__row-actions
    button.journalit-trade-gate-library__icon-button {
    width: auto;
    height: auto;
    min-height: 0;
    padding: var(--size-2-1);
    border: 0;
    background: transparent;
    box-shadow: none;
    color: var(--text-muted);
    cursor: pointer;
  }

  .journalit-trade-gate-library__row-actions
    button.journalit-trade-gate-library__icon-button:hover {
    color: var(--text-normal);
  }
`;
