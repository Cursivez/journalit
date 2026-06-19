

export const ASSET_FIELDS_STYLES = `
    
    .trade-form-view-container .asset-loading-accounts {
      padding: 12px;
      border: 1px solid var(--background-modifier-border);
      border-radius: 4px;
      color: var(--text-muted);
      background-color: var(--background-secondary);
    }

    
    .trade-form-view-container .asset-account-label {
      margin-bottom: 8px;
    }

    
    .trade-form-view-container .asset-error-message {
      font-size: 12px;
      color: var(--text-error);
      margin-top: 4px;
    }

    .trade-form-view-container .trade-form-account-empty-state {
      margin-top: 8px;
      padding: 10px 12px;
      border: 1px solid rgba(var(--color-error-rgb, 229, 57, 53), 0.24);
      border-radius: 8px;
      background: rgba(var(--color-error-rgb, 229, 57, 53), 0.08);
    }

    .trade-form-view-container .trade-form-account-empty-state-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .trade-form-view-container .trade-form-account-empty-state-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-normal);
      line-height: 1.3;
    }

    .trade-form-view-container .trade-form-account-empty-state-button {
      flex: 0 0 auto;
      white-space: nowrap;
    }

    @media (max-width: 600px) {
      .trade-form-view-container .trade-form-account-empty-state-header {
        align-items: flex-start;
        flex-direction: column;
      }
    }

    
    .trade-form-view-container .commission-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: flex-start;
    }

    
    .trade-form-view-container .risk-management-section {
      margin-top: 20px;
      border-top: 1px solid var(--background-modifier-border);
      padding-top: 16px;
    }

    .trade-form-view-container .risk-fields {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .trade-form-view-container .take-profits-section {
      grid-column: 1 / -1;
      padding: 0;
    }

    .trade-form-view-container .take-profits-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }

    .trade-form-view-container .take-profits-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 10px;
    }

    .trade-form-view-container .take-profit-row {
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr) 140px 32px;
      gap: 6px;
      align-items: start;
    }

    .trade-form-view-container .take-profit-row-header {
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
      align-items: center;
    }

    .trade-form-view-container .take-profit-row .form-group {
      margin-bottom: 0;
    }

    .trade-form-view-container .take-profit-row .input {
      min-height: 32px;
    }

    .trade-form-view-container .take-profit-index-label {
      display: flex;
      align-items: center;
      min-height: 32px;
      color: var(--text-normal);
      font-weight: 500;
      padding-left: 2px;
    }

    .trade-form-view-container .take-profit-remove-button {
      width: 32px;
      height: 32px;
      padding: 0;
      margin-top: 0;
      font-size: 20px;
      line-height: 1;
    }

    .trade-form-view-container .take-profit-remove-button:hover {
      color: var(--text-error);
      border-color: var(--text-error);
    }

    .trade-form-view-container .take-profit-add-button {
      margin: 0;
      padding: 2px 6px;
      color: var(--text-muted);
      background: transparent;
      box-shadow: none;
      height: 24px;
      min-height: 24px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 4px;
    }

    .trade-form-view-container .take-profit-add-button:hover {
      color: var(--text-normal);
      background: var(--background-modifier-hover);
      text-decoration: none;
    }

    .trade-form-view-container .take-profits-empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 42px;
      border: 1px dashed var(--background-modifier-border);
      border-radius: 6px;
      background: transparent;
      color: var(--text-faint);
      font-size: 13px;
    }

    @media (max-width: 600px) {
      .trade-form-view-container .risk-fields,
      .trade-form-view-container .take-profit-row {
        grid-template-columns: 1fr;
      }

      .trade-form-view-container .take-profit-row-header {
        display: none;
      }
    }

    
    .trade-form-view-container .calculated-risk-hint {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
      display: block;
    }
`;


