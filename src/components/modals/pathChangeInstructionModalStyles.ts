
export const PATH_CHANGE_INSTRUCTION_MODAL_STYLES = `
  .path-change-instruction-modal .path-change-instruction-content {
    font-family: var(--default-font);
    font-size: 14px;
    line-height: 1.5;
  }

  .path-change-instruction-modal .path-change-instruction-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .path-change-instruction-modal .path-change-instruction-header-icon {
    margin-right: 10px;
    color: var(--text-accent);
  }

  .path-change-instruction-modal .path-change-instruction-title {
    margin: 0;
    color: var(--text-normal);
    font-size: 18px;
  }

  .path-change-instruction-modal .path-change-instruction-path {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    padding: 15px;
    background-color: var(--background-secondary);
    border-radius: 8px;
  }

  .path-change-instruction-modal .path-change-instruction-path-code {
    padding: 4px 8px;
    background-color: var(--background-primary);
    border-radius: 4px;
    font-family: var(--font-monospace);
  }

  .path-change-instruction-modal .path-change-instruction-path-arrow {
    margin: 0 15px;
    color: var(--text-muted);
  }

  .path-change-instruction-modal .path-change-instruction-instructions {
    margin-bottom: 25px;
  }

  .path-change-instruction-modal .path-change-instruction-alert {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
    padding: 12px;
    background-color: var(--background-secondary);
    border-radius: 6px;
    border: 1px solid var(--color-accent);
  }

  .path-change-instruction-modal .path-change-instruction-alert-icon {
    margin-right: 8px;
    margin-top: 2px;
    color: var(--color-accent);
    flex-shrink: 0;
  }

  .path-change-instruction-modal .path-change-instruction-alert-title {
    color: var(--text-normal);
  }

  .path-change-instruction-modal .path-change-instruction-alert-desc {
    color: var(--text-muted);
    margin-top: 4px;
  }

  .path-change-instruction-modal .path-change-instruction-inline-code {
    font-size: 12px;
    background-color: var(--background-primary);
    padding: 2px 4px;
    border-radius: 3px;
    font-family: var(--font-monospace);
  }

  .path-change-instruction-modal .path-change-instruction-manual {
    padding: 12px;
    background-color: var(--background-secondary);
    border-radius: 6px;
    margin-bottom: 15px;
  }

  .path-change-instruction-modal .path-change-instruction-manual-title {
    color: var(--text-normal);
    display: block;
    margin-bottom: 8px;
  }

  .path-change-instruction-modal .path-change-instruction-manual-desc {
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .path-change-instruction-modal .path-change-instruction-steps {
    color: var(--text-muted);
    margin-left: 16px;
    padding-left: 0;
  }

  .path-change-instruction-modal .path-change-instruction-step {
    margin-bottom: 4px;
  }

  .path-change-instruction-modal .path-change-instruction-note {
    color: var(--text-muted);
    font-size: 13px;
    font-style: italic;
    margin-top: 8px;
  }

  .path-change-instruction-modal .path-change-instruction-sync {
    margin-top: 1em;
    padding: 0.75em;
    background-color: var(--background-secondary);
    border-radius: 4px;
  }

  .path-change-instruction-modal .path-change-instruction-sync-desc {
    margin-top: 0.5em;
    font-size: 0.9em;
  }

  .path-change-instruction-modal .path-change-instruction-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 15px;
  }

  .path-change-instruction-modal .path-change-instruction-button--cancel {
    min-width: 80px;
  }

  .path-change-instruction-modal .path-change-instruction-button--confirm {
    min-width: 120px;
  }
`;
