export const TRADE_OPERATION_HANDOFF_STYLES = `
  .journalit-sync-result-toast-mount {
    width: min(360px, calc(100vw - 48px));
    opacity: 0;
    transform: translateX(-24px);
    transition:
      opacity 180ms ease-out,
      transform 220ms ease-out;
  }

  .journalit-sync-result-toast-mount--visible {
    opacity: 1;
    transform: translateX(0);
  }

  .journalit-trade-operation-result {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m);
    background: var(--background-secondary);
    color: var(--text-normal);
    font-family: var(--font-interface);
  }

  .journalit-trade-operation-result--toast {
    border-radius: var(--radius-l);
    background: var(--background-primary);
    box-shadow: var(--shadow-l);
  }

  .journalit-trade-operation-result--inline,
  .journalit-trade-operation-result--inline-compact {
    padding: 0;
    border: 0;
    background: transparent;
  }

  .journalit-trade-operation-result--inline-compact {
    gap: 9px;
  }

  .journalit-trade-operation-result__external-subtitle {
    overflow: hidden;
    margin: 0;
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-trade-operation-result__dismiss {
    position: absolute;
    top: 7px;
    right: 7px;
    z-index: 1;
  }

  .journalit-trade-operation-result__header {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding-right: 22px;
  }

  .journalit-trade-operation-result__status-icon {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: color-mix(
      in srgb,
      var(--text-success) 16%,
      var(--background-primary)
    );
    color: var(--text-success);
  }

  .journalit-trade-operation-result--partial
    .journalit-trade-operation-result__status-icon {
    background: color-mix(
      in srgb,
      var(--text-warning) 16%,
      var(--background-primary)
    );
    color: var(--text-warning);
  }

  .journalit-trade-operation-result__heading-copy {
    min-width: 0;
  }

  .journalit-trade-operation-result
    .journalit-trade-operation-result__heading-copy h3,
  .journalit-trade-operation-result
    .journalit-trade-operation-result__heading-copy p {
    margin: 0;
  }

  .journalit-trade-operation-result
    .journalit-trade-operation-result__heading-copy h3 {
    overflow: hidden;
    font-size: var(--font-ui-small);
    font-weight: var(--font-semibold);
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-trade-operation-result
    .journalit-trade-operation-result__heading-copy p {
    overflow: hidden;
    margin-top: 1px;
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-trade-operation-result__review-button,
  .journalit-trade-operation-result__review-menu-button,
  .journalit-trade-operation-result__trades-button,
  .journalit-trade-operation-result__period-chip {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    min-height: 28px;
    gap: 5px;
    font-size: var(--font-ui-smaller);
  }

  .journalit-trade-operation-result__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 33px;
  }

  .journalit-trade-operation-result--external-heading
    .journalit-trade-operation-result__actions,
  .journalit-trade-operation-result--external-heading
    .journalit-trade-operation-result__recommended {
    padding-left: 0;
  }

  .journalit-trade-operation-result__review-split {
    display: inline-flex;
    align-items: stretch;
  }

  .journalit-trade-operation-result__review-split
    .journalit-trade-operation-result__review-button {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .journalit-trade-operation-result__review-menu-button {
    width: 28px;
    padding: 0;
    border-left: 1px solid
      color-mix(in srgb, var(--text-on-accent) 25%, transparent);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .journalit-trade-operation-result
    .journalit-trade-operation-result__trades-button {
    padding: 3px 6px;
    border: 0;
    background: transparent;
    box-shadow: none;
    color: var(--text-muted);
  }

  .journalit-trade-operation-result
    .journalit-trade-operation-result__trades-button:hover {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-trade-operation-result__recommended {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-left: 33px;
  }

  .journalit-trade-operation-result__recommended-label {
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
  }

  .journalit-trade-operation-result__period-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .journalit-trade-operation-result__period-chip {
    min-height: 26px;
    padding: 2px 8px;
    background: var(--background-primary);
  }

  .journalit-trade-log-operation-scope {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0 12px 10px;
    padding: 8px 10px;
    border: 1px solid var(--interactive-accent);
    border-radius: var(--radius-s);
    background: var(--background-secondary);
  }

  .journalit-trade-log--operation-scope > .trade-log-header {
    border-bottom: 0;
  }

  .journalit-trade-log-operation-scope__label {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .journalit-trade-log-operation-scope__label span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 600px) {
    .journalit-sync-result-toast-mount {
      width: auto;
    }

    .journalit-trade-operation-result__actions,
    .journalit-trade-operation-result__recommended {
      padding-left: 0;
    }

    .journalit-trade-operation-result__review-button,
    .journalit-trade-operation-result__trades-button {
      flex: 1 1 auto;
    }

    .journalit-trade-log-operation-scope {
      align-items: stretch;
      flex-direction: column;
    }
  }
`;
