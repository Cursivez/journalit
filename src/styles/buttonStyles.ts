

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
    border: 0;
    border-radius: var(--journalit-control-radius);
    box-shadow: none;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.2;
    text-decoration: none;
    user-select: none;
    white-space: nowrap;
    cursor: pointer;
    transition:
      background var(--journalit-motion-fast) var(--journalit-easing-standard),
      box-shadow var(--journalit-motion-fast) var(--journalit-easing-standard),
      color var(--journalit-motion-fast) var(--journalit-easing-standard),
      opacity var(--journalit-motion-fast) var(--journalit-easing-standard);
  }

  button.journalit-button {
    box-sizing: border-box;
    height: var(--journalit-control-height);
    min-height: var(--journalit-control-height);
    padding: 0 11px;
    background: var(--journalit-control-secondary-fill);
    box-shadow: var(--journalit-control-secondary-shadow);
    color: var(--text-normal);
    font-size: var(--font-ui-small);
  }

  
  button.journalit-button:focus-visible,
  button.journalit-icon-button:focus-visible,
  button.journalit-no-tooltip-button:focus-visible {
    outline: 2px solid var(--journalit-control-focus);
    outline-offset: 2.5px;
  }

  
  button .journalit-button__label:not(#journalit-button-label) {
    color: inherit;
  }

  
  @supports (text-box: trim-both cap alphabetic) {
    button .journalit-button__label {
      display: block;
      padding-block: calc((1lh - 1cap) / 2);
      text-box: trim-both cap alphabetic;
    }
  }

  button.journalit-button:hover:not(:disabled) {
    background: var(--journalit-control-secondary-fill-hover);
    color: var(--text-normal);
  }

  button.journalit-button--primary {
    background: var(--journalit-control-primary-fill);
    box-shadow: var(--journalit-control-primary-shadow);
    color: var(--text-on-accent);
  }

  button.journalit-button--primary:hover:not(:disabled) {
    background: var(--journalit-control-primary-fill-hover);
    color: var(--text-on-accent);
  }

  
  button.journalit-button--danger {
    color: var(--journalit-control-danger-text);
  }

  button.journalit-button--danger:hover:not(:disabled) {
    color: var(--journalit-control-danger-text);
  }

  button.journalit-button--plain {
    background: transparent;
    box-shadow: none;
    color: var(--text-muted);
  }

  button.journalit-button--plain:hover:not(:disabled) {
    background: var(--journalit-control-overlay-hover);
    color: var(--text-normal);
  }

  button.journalit-button--small {
    padding: 0 8px;
  }

  button.journalit-button--large {
    height: 32px;
    min-height: 32px;
    padding: 0 16px;
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
    min-width: var(--journalit-control-height);
    min-height: var(--journalit-control-height);
    padding: 6px;
    background-color: transparent;
    color: var(--text-muted);
  }

  button.journalit-no-tooltip-button {
    position: relative;
    box-sizing: content-box;
    margin: 0 2px;
  }

  button.journalit-icon-button:hover:not(:disabled),
  button.journalit-no-tooltip-button:hover:not(:disabled) {
    background-color: var(--journalit-control-overlay-hover);
    color: var(--text-normal);
  }

  button.journalit-no-tooltip-button:active:not(:disabled) {
    background-color: var(--background-modifier-active);
    transform: translateY(1px);
  }

  button.journalit-no-tooltip-button svg {
    width: 18px;
    height: 18px;
    pointer-events: none;
    fill: none;
  }

  button.journalit-toolbar-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    gap: 4px;
    box-sizing: border-box;
    width: auto;
    height: var(--journalit-control-height);
    min-width: 24px;
    min-height: 24px;
    padding: 0 10px;
    border: 0;
    border-radius: var(--journalit-control-radius);
    background: var(--journalit-control-secondary-fill);
    box-shadow: var(--journalit-control-secondary-shadow);
    color: var(--text-normal);
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
  }

  button.journalit-toolbar-icon-button:hover:not(:disabled) {
    background: var(--journalit-control-secondary-fill-hover);
    color: var(--text-normal);
  }
`;
