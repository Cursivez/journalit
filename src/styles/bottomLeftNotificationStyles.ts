export const BOTTOM_LEFT_NOTIFICATION_STYLES = `
  .journalit-bottom-left-notifications {
    position: fixed;
    bottom: 24px;
    left: 24px;
    z-index: var(--layer-notice);
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 12px;
    max-width: calc(100vw - 48px);
    pointer-events: none;
  }

  .journalit-bottom-left-notifications > * {
    pointer-events: auto;
  }

  @media (max-width: 768px) {
    .journalit-bottom-left-notifications {
      bottom: 80px;
      left: 12px;
      right: 12px;
      max-width: none;
      align-items: stretch;
    }
  }
`;
