

export const BATCH_ACTION_TOOLBAR_STYLES = `
  .batch-action-toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px;
    background: var(--background-secondary);
    border-top: 1px solid var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  @media (max-width: 768px) {
    .batch-action-toolbar {
      padding: 8px 12px;
      gap: 8px;
    }

    .batch-action-toolbar-actions {
      gap: 6px;
    }
  }

  
  .batch-action-modal {
    min-height: 400px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }

  .batch-action-modal-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    min-height: 0;
  }

  .batch-action-modal-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .batch-action-modal-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
    min-height: 0;
  }

  .batch-action-modal-buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding: 12px 16px;
    border-top: 1px solid var(--background-modifier-border);
    flex-shrink: 0;
    background: var(--background-primary);
  }

  .journalit-batch-modal-title {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-normal);
  }

  

  .batch-selection-count {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 12px;
    border: 1px solid var(--background-modifier-border);
    background: var(--background-modifier-hover);
    color: var(--text-normal);
    font-weight: 600;
    font-size: 13px;
    line-height: 1;
    white-space: nowrap;
    text-transform: uppercase;
  }

  .batch-action-toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 0 1 auto;
    min-width: 0;
  }

  .batch-action-select-all-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
  }

  .batch-action-select-all-btn svg {
    flex-shrink: 0;
  }

  .batch-action-select-all-btn .journalit-obsidian-icon,
  .batch-action-toolbar-actions button .journalit-obsidian-icon {
    line-height: 0;
  }

  @media (max-width: 768px) {
    .batch-action-select-all-btn .select-all-label {
      display: none;
    }
    .batch-action-select-all-btn {
      min-width: var(--journalit-control-height);
    }
  }

  .batch-action-toolbar-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  
  .batch-action-toolbar-actions button svg {
    flex-shrink: 0;
  }

  
  @media (max-width: 900px) {
    .batch-action-toolbar-actions .btn-label {
      display: none;
    }
    .batch-action-toolbar-actions button {
      min-width: var(--journalit-control-height);
      padding: 0;
    }
    .batch-action-toolbar-actions button svg {
      flex-shrink: 0;
    }
  }

  
  @media (max-width: 600px) {
    .batch-action-toolbar {
      gap: 6px;
    }

    .batch-action-toolbar-actions {
      width: 100%;
      justify-content: flex-start;
    }
  }
`;
