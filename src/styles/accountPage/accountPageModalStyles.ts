

const ACCOUNT_PAGE_MODAL_STYLE_ID = 'journalit-account-page-modal-styles';

const ACCOUNT_PAGE_MODAL_STYLES = `
  .journalit-account-modal {
    padding: 20px;
    font-family: var(--default-font);
  }

  .journalit-account-modal__info {
    background: var(--background-secondary);
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
  }

  .journalit-account-modal__warning {
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-account-modal__warning--spaced {
    margin-bottom: 20px;
  }

  .journalit-account-modal__warning--warning {
    background: var(--background-modifier-warning);
  }

  .journalit-account-modal__warning--danger {
    background: var(--background-modifier-error);
    border-color: var(--background-modifier-error);
  }

  .journalit-account-modal__text {
    margin: 0;
    color: var(--text-normal);
    font-size: 14px;
    line-height: 1.5;
  }

  .journalit-account-modal__text--small {
    font-size: 13px;
  }

  .journalit-account-modal__text--muted {
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.5;
  }

  .journalit-account-modal__text--spaced {
    margin-bottom: 8px;
  }

  .journalit-account-modal__text--spaced-lg {
    margin-bottom: 16px;
  }

  .journalit-account-modal__text--emphasis {
    font-weight: 500;
  }

  .journalit-account-modal__danger-note {
    margin: 0 0 20px 0;
    color: var(--text-muted);
    font-size: 13px;
    font-style: italic;
  }

  .journalit-account-modal__question {
    margin: 0 0 16px 0;
    color: var(--text-normal);
    font-size: 14px;
    line-height: 1.5;
  }

  .journalit-account-modal__list {
    margin: 0;
    padding-left: 20px;
    color: var(--text-normal);
    font-size: 13px;
    line-height: 1.6;
  }

  .journalit-account-modal__danger-warning {
    margin: 0 0 20px 0;
    color: var(--text-error);
    font-size: 13px;
  }

  .journalit-account-modal__actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-account-modal__button {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }

  .journalit-account-modal__button--secondary {
    border: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
    color: var(--text-normal);
    font-weight: 400;
  }

  .journalit-account-modal__button--primary {
    border: none;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-account-modal__button--danger {
    border: none;
    background: var(--background-modifier-error);
    color: var(--text-on-accent);
  }

  .journalit-modal-title-danger {
    color: var(--text-error);
  }

  
  .journalit-manual-drawdown-validation-error {
    color: var(--text-error);
    background-color: var(--background-secondary-alt);
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 13px;
    white-space: normal;
  }

  .journalit-manual-drawdown-date-input-wrapper {
    display: flex;
    align-items: center;
    position: relative;
  }

  .journalit-manual-drawdown-limit-input {
    width: 100%;
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid var(--background-secondary-alt);
    background-color: var(--background-secondary);
    color: var(--text-normal);
  }

  .journalit-setting-item--full-width {
    margin-top: 12px;
    grid-column: 1 / -1;
  }
`;

const accountPageModalStylesInjected = false;

function injectAccountPageModalStyles(): void {
  return;
}

export function ensureAccountPageModalStyles(): void {
  return;
}
