
export const accountLinkModalStyles = `
  .account-link-modal {
    padding: 16px;
    font-family: var(--font-text);
    color: var(--text-normal);
    min-width: 450px;
  }

  .account-link-modal h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--text-normal);
    border-bottom: 1px solid var(--background-modifier-border);
    padding-bottom: 8px;
  }

  .account-link-modal .account-link-error {
    display: flex;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--text-error);
    border-radius: 6px;
    background-color: var(--background-secondary);
    margin-bottom: 16px;
    align-items: flex-start;
  }

  .account-link-modal .account-link-error svg {
    color: var(--text-error);
    margin-top: 2px;
  }

  .account-link-modal .account-link-error-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-normal);
  }

  .account-link-modal .account-link-error-message {
    font-size: 0.9rem;
    color: var(--text-error);
  }

  .account-link-modal .account-info {
    background-color: var(--background-secondary);
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 20px;
    border: 1px solid var(--background-modifier-border);
  }

  .account-link-modal .account-info p {
    margin: 4px 0;
    font-size: 0.9rem;
  }

  .account-link-modal .account-info strong {
    font-weight: 600;
    margin-right: 8px;
    color: var(--text-muted);
  }

  .account-link-modal .modal-field {
    margin-bottom: 16px;
  }

  .account-link-modal .section-label {
    display: block;
    margin-bottom: 12px;
    font-weight: 500;
    font-size: 0.95rem;
    color: var(--text-normal);
  }

  .account-link-modal .link-option-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .account-link-modal .link-option {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.1s ease;
  }

  .account-link-modal .link-option:hover {
    background-color: var(--background-modifier-hover);
  }

  .account-link-modal .link-option input[type="radio"] {
    margin-right: 10px;
    cursor: pointer;
  }

  .account-link-modal .link-option span {
    flex: 1;
    font-size: 0.9rem;
  }

  .account-link-modal .custom-name-input,
  .account-link-modal .existing-account-select {
    margin-left: 32px;
    margin-top: 8px;
    margin-bottom: 12px;
  }

  .account-link-modal .modal-input,
  .account-link-modal .modal-select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    font-size: 0.9rem;
    min-height: 36px;
  }

  .account-link-modal .modal-input:focus,
  .account-link-modal .modal-select:focus {
    border-color: var(--interactive-accent);
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2);
    outline: none;
  }

  .account-link-modal .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--background-modifier-border);
  }
`;
