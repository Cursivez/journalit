

export const VIEW_ACTIONS_STYLES = `
  .journalit-view-actions {
    --journalit-view-actions-time: 160ms;
    --journalit-view-actions-curve: cubic-bezier(0.2, 0, 0, 1);
    --journalit-view-actions-collapse:
      max-width var(--journalit-view-actions-time) var(--journalit-view-actions-curve),
      min-width var(--journalit-view-actions-time) var(--journalit-view-actions-curve),
      width var(--journalit-view-actions-time) var(--journalit-view-actions-curve),
      margin var(--journalit-view-actions-time) var(--journalit-view-actions-curve),
      opacity 120ms ease-out;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 0;
    min-width: fit-content;
  }

  .journalit-view-actions > * {
    flex-shrink: 0;
  }

  .journalit-view-actions > :not(.journalit-home-mode-toggle-wrapper) {
    background-color: var(--journalit-control-strip);
  }

  .journalit-view-actions > :first-child {
    max-width: 240px;
    border-radius: var(--journalit-control-radius) 0 0 var(--journalit-control-radius);
    transition: var(--journalit-view-actions-collapse);
  }

  
  .journalit-view-actions > button.journalit-home-settings-button:not(.segmented-control-option) {
    margin-right: var(--journalit-space-3);
    border-radius: 0 var(--journalit-control-radius) var(--journalit-control-radius) 0;
  }

  .journalit-view-actions button:not(.segmented-control-option, .journalit-compare-control *) {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 32px;
    min-width: 32px;
    height: var(--journalit-control-height);
    min-height: var(--journalit-control-height);
    padding: 0;
    border: 0;
    border-radius: var(--journalit-control-radius);
    background: none;
    box-shadow: none;
    color: var(--text-muted);
    cursor: pointer;
  }

  .journalit-view-actions > button:not(.segmented-control-option, .journalit-compare-control *) {
    border-radius: 0;
    background-color: var(--journalit-control-strip);
  }

  .journalit-view-actions > :first-child > button,
  .journalit-view-actions button svg {
    flex: none;
  }

  .journalit-view-actions button:not(.segmented-control-option, .journalit-compare-control *) svg {
    width: 15px;
    height: 15px;
  }

  
  .journalit-view-actions button:not(.segmented-control-option, .journalit-compare-control *)::before {
    position: absolute;
    inset: 0;
    border-radius: var(--journalit-control-radius);
    content: '';
    pointer-events: none;
  }

  .journalit-view-actions button:not(.segmented-control-option, .journalit-compare-control *):hover {
    color: var(--text-normal);
  }

  .journalit-view-actions button:not(.segmented-control-option, .journalit-compare-control *):hover::before {
    background: var(--background-modifier-hover);
  }

  .journalit-view-actions button:not(.segmented-control-option, .journalit-compare-control *):focus-visible {
    outline: 2px solid var(--journalit-control-focus);
    outline-offset: 2px;
  }

  .journalit-view-actions .journalit-home-settings-button {
    transition: var(--journalit-view-actions-collapse);
  }

  
  .journalit-view-actions.is-editing-layout > :first-child,
  .journalit-view-actions.is-editing-layout > button.journalit-home-settings-button:not(.segmented-control-option) {
    width: 0;
    min-width: 0;
    max-width: 0;
    margin: 0;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transition: var(--journalit-view-actions-collapse), visibility 0s var(--journalit-view-actions-time);
  }

  
  .journalit-view-actions > .journalit-view-actions__save-slot,
  .journalit-view-actions .journalit-view-actions__save {
    transition:
      background-color var(--journalit-view-actions-time) var(--journalit-view-actions-curve),
      border-radius var(--journalit-view-actions-time) var(--journalit-view-actions-curve),
      color var(--journalit-view-actions-time) var(--journalit-view-actions-curve),
      margin var(--journalit-view-actions-time) var(--journalit-view-actions-curve);
  }

  .journalit-view-actions .journalit-view-actions__save {
    isolation: isolate;
  }

  .journalit-view-actions .journalit-view-actions__save::after {
    position: absolute;
    z-index: -1;
    inset: 0;
    border-radius: var(--journalit-control-radius);
    background: var(--journalit-control-primary-fill);
    box-shadow: var(--journalit-control-primary-shadow);
    content: '';
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--journalit-view-actions-time) var(--journalit-view-actions-curve);
  }

  .journalit-view-actions.is-editing-layout > .journalit-view-actions__save-slot {
    margin-right: var(--journalit-space-3);
    background-color: transparent;
  }

  .journalit-view-actions.is-editing-layout .journalit-view-actions__save,
  .journalit-view-actions.is-editing-layout .journalit-view-actions__save:hover {
    border-radius: var(--journalit-control-radius);
    background-color: transparent;
    color: var(--text-on-accent);
  }

  .journalit-view-actions.is-editing-layout > button.journalit-view-actions__save {
    margin-right: var(--journalit-space-3);
  }

  .journalit-view-actions.is-editing-layout .journalit-view-actions__save::after {
    opacity: 1;
  }

  .journalit-view-actions.is-editing-layout .journalit-view-actions__save:hover::after {
    background: var(--journalit-control-primary-fill-hover);
  }

  .journalit-view-actions.is-editing-layout .journalit-view-actions__save:hover::before {
    background: none;
  }

  
  .journalit-view-actions > .journalit-view-actions__tool {
    margin-right: var(--journalit-space-3);
    background-color: transparent;
    animation: journalit-view-action-in var(--journalit-view-actions-time) var(--journalit-view-actions-curve);
  }

  .journalit-view-actions button.journalit-view-actions__tool,
  .journalit-view-actions .journalit-view-actions__tool button {
    border-radius: var(--journalit-control-radius);
    background: var(--journalit-control-secondary-fill);
    box-shadow: var(--journalit-control-secondary-shadow);
    color: var(--text-normal);
  }

  .journalit-view-actions button.journalit-view-actions__tool:hover,
  .journalit-view-actions .journalit-view-actions__tool button:hover {
    background: var(--journalit-control-secondary-fill-hover);
  }

  .journalit-view-actions button.journalit-view-actions__tool:hover::before,
  .journalit-view-actions .journalit-view-actions__tool button:hover::before {
    background: none;
  }

  .journalit-view-actions button.journalit-view-actions__tool--label,
  .journalit-view-actions .journalit-view-actions__tool button {
    gap: var(--journalit-space-2);
    width: auto;
    min-width: 0;
    padding: 0 var(--journalit-space-3);
    font-size: var(--font-ui-small);
    font-weight: 500;
    white-space: nowrap;
  }

  @keyframes journalit-view-action-in {
    from {
      opacity: 0;
      transform: translateX(6px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .journalit-view-actions,
    .journalit-view-actions > *,
    .journalit-view-actions .journalit-view-actions__save,
    .journalit-view-actions .journalit-view-actions__save::after {
      animation: none;
      transition: none;
    }
  }
`;
