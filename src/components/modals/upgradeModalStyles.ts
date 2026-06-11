

const UPGRADE_MODAL_STYLE_ID = 'journalit-upgrade-modal-styles';

const UPGRADE_MODAL_STYLES = `
  .upgrade-modal .upgrade-modal-content {
    font-family: var(--default-font);
    font-size: 14px;
    line-height: 1.5;
    padding: 20px;
  }

  .upgrade-modal .upgrade-modal-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .upgrade-modal .upgrade-modal-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--interactive-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    color: var(--text-on-accent);
  }

  .upgrade-modal .upgrade-modal-title {
    margin: 0;
    color: var(--text-normal);
    font-size: 18px;
  }

  .upgrade-modal .upgrade-modal-message {
    margin: 0 0 20px 0;
    color: var(--text-normal);
  }

  .upgrade-modal .upgrade-modal-benefits {
    background: var(--background-secondary);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .upgrade-modal .upgrade-modal-benefits-title {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: var(--text-normal);
  }

  .upgrade-modal .upgrade-modal-benefits-list {
    margin: 0;
    padding-left: 20px;
    color: var(--text-muted);
  }

  .upgrade-modal .upgrade-modal-trial {
    margin: 0 0 20px 0;
    padding: 10px;
    background: var(--background-primary-alt);
    border-radius: 4px;
    font-size: 13px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .upgrade-modal .upgrade-modal-trial-icon {
    color: var(--text-accent);
  }

  .upgrade-modal .upgrade-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 15px;
  }
`;

const upgradeModalStylesInjected = false;

function injectUpgradeModalStyles(): void {
  return;
}

export function ensureUpgradeModalStyles(): void {
  return;
}
