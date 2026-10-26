

export const TRADELOG_SETTINGS_MODAL_STYLES = `
  .tradelog-settings-modal {
    display: flex;
    flex-direction: column;
    min-height: 500px;
    max-height: min(80vh, 720px);
    overflow: hidden;
  }

  .tradelog-settings-modal-container {
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    height: min(70vh, 640px);
    min-height: 0;
  }

  .tradelog-settings-modal-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 4px;
  }

  .tradelog-settings-modal-container .journalit-visibility-editor {
    flex: 0 0 auto;
    min-height: 0;
  }

  .tradelog-settings-modal-container .journalit-visibility-editor__content {
    flex: 0 0 auto;
    min-height: 0;
    max-height: none;
    overflow: visible;
  }

  
  .tradelog-settings-display-mode {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    margin-top: 16px;
    flex: 0 0 auto;
  }

  .display-mode-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .display-mode-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-normal);
  }

  .display-mode-description {
    font-size: 12px;
    color: var(--text-muted);
  }

  
  .tradelog-settings-modal-container .journalit-tab-nav {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 3;
    border-bottom: 1px solid var(--background-modifier-border);
    margin-bottom: 16px;
    justify-content: center;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 0;
    background: var(--background-primary);
  }

  .tradelog-settings-modal-container .journalit-tab-wrapper {
    display: flex;
    justify-content: center;
    flex: 1;
  }

  .tradelog-settings-modal-container .journalit-tab-button {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    transition: all 0.2s ease;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tradelog-settings-modal-container .journalit-tab-button:hover {
    color: var(--text-normal);
    background-color: var(--background-modifier-hover);
  }

  .tradelog-settings-modal-container .journalit-tab-button.journalit-tab-active {
    color: var(--text-normal);
    font-weight: 600;
    border-bottom-color: var(--text-accent);
  }

  .tradelog-settings-modal-container .journalit-tab-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background-modifier-border);
    color: var(--text-muted);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    min-width: 20px;
  }

  .tradelog-settings-modal-container .journalit-tab-button.journalit-tab-active .journalit-tab-count {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  

  .panel-description {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 8px;
    text-align: center;
  }

  

  .category-header {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-normal);
    transition: background-color 0.15s ease;
  }

  .category-header:hover {
    background: var(--background-modifier-hover);
  }

  .category-header svg {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .category-label {
    flex: 1;
    text-align: left;
  }

  
  .tradelog-settings-modal-buttons {
    position: sticky;
    bottom: 0;
    z-index: 2;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 8px;
    padding: 8px 0 0;
    border-top: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
    flex: 0 0 auto;
  }

  .tradelog-settings-modal-buttons button {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid var(--background-modifier-border);
    background: var(--background-secondary);
    color: var(--text-normal);
    box-shadow: none;
  }

  .tradelog-settings-modal-buttons button:hover {
    background: var(--background-modifier-hover);
  }

  .tradelog-settings-modal-buttons .cancel-button {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    color: var(--text-muted);
  }

  .tradelog-settings-modal-buttons .cancel-button:hover:not(:disabled) {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .tradelog-settings-modal-buttons button.primary {
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    border-color: var(--interactive-accent);
  }

  .tradelog-settings-modal-buttons button.primary:hover {
    background: var(--interactive-accent-hover);
    color: var(--text-on-accent);
  }

  .tradelog-settings-modal-buttons .reset-button {
    margin-right: auto;
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    color: var(--text-muted);
  }

  .tradelog-settings-modal-buttons .reset-button:hover:not(:disabled) {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }
`;
