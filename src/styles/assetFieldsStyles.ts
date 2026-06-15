

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
    }

    .trade-form-view-container .risk-fields {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    
    .trade-form-view-container .calculated-risk-hint {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
      display: block;
    }
`;


