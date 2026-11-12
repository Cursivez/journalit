
export const MOTION_CARD_STYLES = `
  
  .journalit-trade-share-modes {
    display: flex;
    flex-direction: column;
    gap: var(--size-4-3);
    height: 100%;
  }

  .journalit-trade-share-modes > .journalit-review-share-layout {
    flex: 1 1 auto;
    height: auto;
    min-height: 0;
  }

  
  .journalit-motion-card-settings {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: var(--size-4-3);
    min-height: 0;
    overflow-y: auto;
  }

  .journalit-motion-card-settings .journalit-review-share-sections {
    flex: 0 0 auto;
  }

  .journalit-motion-card-actions {
    display: flex;
    flex-direction: column;
    gap: var(--size-4-2);
  }

  @container (max-width: 560px) {
    .journalit-motion-card-settings {
      max-height: 38vh;
    }
  }

  .journalit-motion-card-preview {
    display: block;
    margin: 0 auto;
    border-radius: var(--journalit-radius-lg);
    background: var(--background-secondary);
    font-family: var(--font-interface);
  }

  .journalit-motion-card-preview.is-landscape {
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  .journalit-motion-card-preview.is-square {
    width: min(100%, 460px);
    aspect-ratio: 1;
  }

  .journalit-motion-card-preview.is-portrait {
    width: min(100%, 300px);
    aspect-ratio: 9 / 16;
  }

  .journalit-motion-card-field {
    display: flex;
    flex-direction: column;
    gap: var(--size-4-2);
  }

  .journalit-motion-card-label {
    font-size: var(--font-ui-small);
    color: var(--text-muted);
  }

  .journalit-motion-card-file {
    display: none;
  }

  .journalit-motion-card-error {
    font-size: var(--font-ui-small);
    color: var(--text-error);
  }

  .journalit-motion-card-current {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-4-2);
    font-size: var(--font-ui-small);
  }

  .journalit-motion-card-current-name {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
