

const SETTINGS_RESET_MODAL_STYLE_ID = 'journalit-settings-reset-modal-styles';

const SETTINGS_RESET_MODAL_STYLES = `
  .journalit-settings-reset-modal {
    padding: 20px;
    font-family: var(--default-font);
  }

  .journalit-settings-reset-modal__text {
    margin: 0 0 16px 0;
    color: var(--text-normal);
    font-size: 14px;
    line-height: 1.5;
  }

  .journalit-settings-reset-modal__text--compact {
    margin: 0;
  }

  .journalit-settings-reset-modal__text--muted {
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.4;
  }

  .journalit-settings-reset-modal__info {
    background: var(--background-secondary);
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
  }

  .journalit-settings-reset-modal__list {
    margin: 0;
    padding-left: 20px;
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.6;
  }

  .journalit-settings-reset-modal__warning {
    background: var(--background-modifier-error);
    border: 1px solid var(--background-modifier-error);
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
  }

  .journalit-settings-reset-modal__actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-settings-reset-modal__button {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }

  .journalit-settings-reset-modal__button--secondary {
    border: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
    color: var(--text-normal);
    font-weight: 400;
  }

  .journalit-settings-reset-modal__button--danger {
    border: none;
    background: var(--background-modifier-error);
    color: var(--text-on-accent);
  }

  .journalit-settings-reset-modal__backup-warning {
    margin: 0 0 12px 0;
    color: var(--text-normal);
    font-size: 13px;
    line-height: 1.5;
  }

  .journalit-settings-reset-modal__backup-warning.mod-warning {
    color: var(--text-error);
  }
`;

const settingsResetModalStylesInjected = false;

function injectSettingsResetModalStyles(): void {
  return;
}

export function ensureSettingsResetModalStyles(): void {
  return;
}
