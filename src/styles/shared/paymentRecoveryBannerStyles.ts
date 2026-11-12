
export const PAYMENT_RECOVERY_BANNER_STYLES = `
  .journalit-payment-recovery-banner {
    --journalit-payment-recovery-tone: var(--journalit-status-warning);
    display: flex;
    align-items: center;
    gap: var(--journalit-space-3);
    padding: var(--journalit-space-3) var(--journalit-space-4);
    margin-bottom: var(--journalit-space-4);
    border: 1px solid color-mix(in srgb, var(--journalit-payment-recovery-tone) 45%, transparent);
    border-radius: var(--journalit-radius-md);
    background: color-mix(in srgb, var(--journalit-payment-recovery-tone) 10%, transparent);
    color: var(--journalit-text-normal);
  }

  .journalit-payment-recovery-banner--error {
    --journalit-payment-recovery-tone: var(--journalit-status-error);
  }

  .journalit-payment-recovery-banner__icon {
    flex: none;
    color: var(--journalit-payment-recovery-tone);
  }

  .journalit-payment-recovery-banner__message {
    flex: 1;
    margin: 0;
    font-size: var(--journalit-font-size-body);
    font-weight: var(--journalit-font-weight-medium);
  }

  .journalit-payment-recovery-banner__actions {
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--journalit-space-2);
  }

  @media (max-width: 520px) {
    .journalit-payment-recovery-banner {
      flex-wrap: wrap;
    }

    .journalit-payment-recovery-banner__message {
      flex-basis: calc(100% - 2 * var(--journalit-space-5));
    }
  }

  .journalit-home-payment-notice {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--journalit-space-1) var(--journalit-space-2);
    color: var(--journalit-status-warning);
  }

  .journalit-home-payment-notice__icon {
    flex: none;
    color: var(--journalit-status-warning);
  }

  .journalit-home-page .journalit-home-payment-notice__action {
    height: auto;
    padding: 0;
    border: none;
    background: none;
    box-shadow: none;
    color: inherit;
    font: inherit;
    font-weight: var(--journalit-font-weight-semibold);
    cursor: pointer;
  }

  .journalit-home-page .journalit-home-payment-notice__action:hover {
    background: none;
    color: color-mix(in srgb, var(--journalit-status-warning) 75%, var(--journalit-text-normal));
  }

  .journalit-home-page .journalit-home-payment-notice__action:focus-visible {
    outline: 2px solid var(--background-modifier-border-focus);
    outline-offset: 2px;
    border-radius: var(--journalit-radius-sm);
  }

  .journalit-home-settings-button--attention {
    position: relative;
  }

  .journalit-home-settings-button__dot {
    position: absolute;
    top: -3px;
    right: -3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--journalit-status-error);
    box-shadow: 0 0 0 2px var(--background-primary);
  }
`;
