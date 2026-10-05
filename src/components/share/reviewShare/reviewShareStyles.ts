
export const REVIEW_SHARE_STYLES = `
  
  .journalit-review-share-modal {
    width: min(900px, 94vw);
    height: min(860px, 85vh);
  }

  .journalit-review-share-modal > .modal-content {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  
  .journalit-review-share-root {
    flex: 1 1 auto;
    min-height: 0;
    container-type: inline-size;
  }

  
  .journalit-review-share-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
    gap: var(--size-4-6);
    height: 100%;
  }

  
  .journalit-review-share-preview {
    min-width: 0;
    min-height: 0;
    overflow: auto;
    scrollbar-gutter: stable;
  }

  
  .journalit-review-share-preview-box {
    width: calc(720px * var(--journalit-share-preview-scale));
    height: var(--journalit-share-preview-height);
  }

  .journalit-review-share-preview-box > .journalit-share-card-frame {
    transform: scale(var(--journalit-share-preview-scale));
    transform-origin: top left;
  }

  .journalit-review-share-controls {
    display: flex;
    flex-direction: column;
    gap: var(--size-4-3);
    
    min-width: 0;
    min-height: 0;
  }

  @container (max-width: 560px) {
    .journalit-review-share-layout {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr);
    }

    .journalit-review-share-controls {
      order: -1;
    }

    .journalit-review-share-controls .journalit-review-share-sections {
      max-height: 30vh;
    }
  }

  .journalit-review-share-picker-actions {
    display: flex;
    gap: var(--size-4-2);
  }

  
  .journalit-review-share-legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-2-2) var(--size-4-3);
    color: var(--text-faint);
    font-size: var(--font-ui-smaller);
  }

  .journalit-review-share-legend-item {
    display: inline-flex;
    align-items: center;
    gap: var(--size-2-2);
  }

  
  .journalit-review-share-legend-label {
    text-box: trim-both cap alphabetic;
  }

  
  .journalit-review-share-sections {
    display: flex;
    flex-direction: column;
    gap: var(--size-4-2);
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  .journalit-review-share-section {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-1);
    padding: var(--size-4-2) var(--size-4-3);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m);
  }

  .journalit-review-share-section-row,
  .journalit-review-share-item-row {
    display: flex;
    align-items: center;
    gap: var(--size-4-2);
    min-width: 0;
    cursor: pointer;
  }

  .journalit-review-share-section-row {
    color: var(--text-normal);
    font-size: var(--font-ui-small);
    font-weight: var(--font-semibold);
  }

  
  .journalit-review-share-section-row input[type='checkbox']:indeterminate {
    position: relative;
    background-color: var(--interactive-accent);
    border-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-review-share-section-row
    input[type='checkbox']:indeterminate::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 25%;
    right: 25%;
    height: 2px;
    border-radius: 1px;
    background-color: var(--text-on-accent);
    transform: translateY(-50%);
  }

  .journalit-review-share-item-row {
    padding-left: var(--size-4-6);
    color: var(--text-muted);
    font-size: var(--font-ui-small);
  }

  
  .journalit-review-share-section.is-flat .journalit-review-share-item-row {
    padding-left: 0;
  }

  .journalit-review-share-item-icon {
    flex: none;
    color: var(--text-faint);
  }

  .journalit-review-share-row-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  
  .journalit-review-share-option {
    display: flex;
    align-items: flex-start;
    gap: var(--size-4-2);
    color: var(--text-normal);
    font-size: var(--font-ui-small);
    cursor: pointer;
  }

  .journalit-review-share-option.is-disabled {
    color: var(--text-faint);
    cursor: default;
  }

  .journalit-review-share-option-text {
    display: flex;
    flex-direction: column;
    gap: var(--size-2-1);
    min-width: 0;
  }

  .journalit-review-share-option-hint {
    color: var(--text-faint);
    font-size: var(--font-ui-smaller);
  }

  
  .journalit-share-card-frame {
    position: relative;
    contain: content;
    width: fit-content;
    border-radius: 16px;
    box-shadow: var(--shadow-s);
  }

  .journalit-share-card {
    width: 720px;
    min-height: 900px;
    box-sizing: border-box;
    padding: 28px 32px 24px;
    display: flex;
    flex-direction: column;
    
    gap: 0;
    border-radius: 16px;
    background: var(--background-primary);
    color: var(--text-normal);
    
    font-family: var(--font-text);
    font-size: var(--font-text-size);
    line-height: var(--line-height-normal);
  }

  
  .journalit-share-card
    .journalit-widget
    [data-journalit-share-exclude][data-journalit-share-exclude] {
    display: none;
  }

  
  .journalit-share-card > .journalit-share-card-note.markdown-preview-view {
    padding: 0;
    height: auto;
    overflow: visible;
    background: transparent;
  }

  .journalit-share-card-footer {
    margin-top: auto;
    padding-top: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
  }

  
  .journalit-share-card-mark {
    --journalit-share-mark-size: 42px;
    width: var(--journalit-share-mark-size);
    height: var(--journalit-share-mark-size);
    background-color: var(--text-normal);
    mask-image: var(--journalit-share-logo);
    mask-repeat: no-repeat;
    mask-size: calc(var(--journalit-share-mark-size) * 747 / 138) auto;
    mask-position: calc(var(--journalit-share-mark-size) * -34 / 138)
      calc(var(--journalit-share-mark-size) * -17 / 138);
  }

  .journalit-share-card-url {
    font-size: 34px;
    font-weight: 600;
  }
`;
