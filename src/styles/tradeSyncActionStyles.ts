export const TRADE_SYNC_ACTION_STYLES = `
  button.journalit-quick-link-button[data-trade-sync-running="true"] {
    cursor: wait;
  }

  button.journalit-quick-link-button[data-trade-sync-running="true"]
    .journalit-quick-link-icon svg,
  .journalit-navigation-view-container
    .journalit-nav-item[data-trade-sync-running="true"]
    .journalit-nav-item-icon svg {
    animation: journalit-trade-sync-action-spin 0.8s linear infinite;
    transform-box: fill-box;
    transform-origin: center;
  }

  .journalit-navigation-view-container
    .journalit-nav-item[data-trade-sync-running="true"] {
    cursor: wait;
    opacity: 0.72;
  }

  @keyframes journalit-trade-sync-action-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    button.journalit-quick-link-button[data-trade-sync-running="true"]
      .journalit-quick-link-icon svg,
    .journalit-navigation-view-container
      .journalit-nav-item[data-trade-sync-running="true"]
      .journalit-nav-item-icon svg {
      animation: none;
    }
  }
`;
