

const TEMPLATE_SWITCH_WARNING_MODAL_STYLE_ID =
  'journalit-template-switch-warning-modal-styles';

const TEMPLATE_SWITCH_WARNING_MODAL_STYLES = `
  .template-switch-warning-modal .template-switch-warning-content {
    font-family: var(--default-font);
    font-size: 14px;
    line-height: 1.5;
    max-width: 500px;
  }

  .template-switch-warning-modal .template-switch-warning-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .template-switch-warning-modal .template-switch-warning-icon {
    margin-right: 10px;
    color: var(--color-yellow);
    flex-shrink: 0;
  }

  .template-switch-warning-modal .template-switch-warning-title {
    margin: 0;
    color: var(--text-normal);
    font-size: 18px;
    font-weight: 600;
  }

  .template-switch-warning-modal .template-switch-warning-description {
    color: var(--text-normal);
    margin-bottom: 12px;
    line-height: 1.6;
  }

  .template-switch-warning-modal .template-switch-warning-alert {
    padding: 12px 16px;
    background-color: var(--background-secondary);
    border-radius: 6px;
    border: 1px solid var(--background-modifier-border);
    margin-bottom: 20px;
  }

  .template-switch-warning-modal .template-switch-warning-alert-content {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .template-switch-warning-modal .template-switch-warning-alert-icon {
    margin-top: 2px;
    color: var(--color-yellow);
    flex-shrink: 0;
  }

  .template-switch-warning-modal .template-switch-warning-alert-title {
    color: var(--text-normal);
    display: block;
    margin-bottom: 4px;
  }

  .template-switch-warning-modal .template-switch-warning-alert-text {
    color: var(--text-muted);
    font-size: 13px;
  }

  .template-switch-warning-modal .template-switch-warning-note {
    margin: 0 0 20px 0;
    color: var(--text-muted);
    font-size: 13px;
    font-style: italic;
  }

  .template-switch-warning-modal .template-switch-warning-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 15px;
  }

  .template-switch-warning-modal .template-switch-warning-button--cancel {
    min-width: 100px;
  }

  .template-switch-warning-modal .template-switch-warning-button--confirm {
    min-width: 140px;
  }
`;

const templateSwitchWarningModalStylesInjected = false;

function injectTemplateSwitchWarningModalStyles(): void {
  return;
}

export function ensureTemplateSwitchWarningModalStyles(): void {
  return;
}
