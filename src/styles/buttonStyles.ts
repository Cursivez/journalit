

export const BUTTON_STYLES = `
  button.journalit-button,
  button.journalit-icon-button,
  button.journalit-no-tooltip-button {
    -webkit-appearance: none;
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: auto;
    height: auto;
    min-height: 0;
    border: 1px solid transparent;
    border-radius: 6px;
    box-shadow: none;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.2;
    text-decoration: none;
    user-select: none;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
  }

  button.journalit-button {
    padding: 6px 12px;
    background-color: var(--background-primary);
    border-color: var(--background-modifier-border);
    color: var(--text-normal);
    font-size: var(--font-ui-small);
  }

  button.journalit-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  button.journalit-button--primary {
    background-color: var(--interactive-accent);
    border-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  button.journalit-button--primary:hover:not(:disabled) {
    background-color: var(--interactive-accent-hover);
    border-color: var(--interactive-accent-hover);
    color: var(--text-on-accent);
  }

  button.journalit-button--secondary {
    background-color: var(--background-primary);
    border-color: var(--background-modifier-border);
    color: var(--text-normal);
  }

  button.journalit-button--secondary:hover:not(:disabled) {
    background-color: var(--background-modifier-hover);
  }

  button.journalit-button--danger {
    background-color: var(--background-primary);
    border-color: var(--background-modifier-error);
    color: var(--text-error);
  }

  button.journalit-button--danger:hover:not(:disabled) {
    background-color: var(--background-modifier-error);
    border-color: var(--background-modifier-error);
    color: var(--text-on-accent);
  }

  button.journalit-button--plain {
    background-color: transparent;
    border-color: transparent;
    color: var(--text-muted);
  }

  button.journalit-button--plain:hover:not(:disabled) {
    background-color: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  button.journalit-button--small {
    padding: 4px 8px;
    font-size: var(--font-ui-smaller);
  }

  button.journalit-button--medium {
    padding: 6px 12px;
    font-size: var(--font-ui-small);
  }

  button.journalit-button--large {
    padding: 8px 16px;
    font-size: var(--font-ui-medium);
  }

  button.journalit-button--full-width {
    width: 100%;
  }

  button.journalit-button--loading,
  button.journalit-button:disabled,
  button.journalit-icon-button:disabled,
  button.journalit-no-tooltip-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button.journalit-icon-button,
  button.journalit-no-tooltip-button {
    min-width: 28px;
    min-height: 28px;
    padding: 6px;
    background-color: transparent;
    border-color: transparent;
    color: var(--text-muted);
  }

  button.journalit-icon-button:hover:not(:disabled),
  button.journalit-no-tooltip-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  button.journalit-toolbar-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    gap: 4px;
    width: auto;
    height: 28px;
    min-width: 24px;
    min-height: 24px;
    padding: 5px 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
  }

  button.journalit-toolbar-icon-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover);
    border-color: var(--interactive-accent);
    color: var(--text-normal);
  }
`;
