

export const VISIBILITY_EDITOR_STYLES = `
  .journalit-visibility-editor {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .journalit-visibility-editor .journalit-tab-nav {
    display: flex;
    border-bottom: 1px solid var(--background-modifier-border);
    margin-bottom: 16px;
    justify-content: center;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 0;
  }

  .journalit-visibility-editor .journalit-tab-wrapper {
    display: flex;
    justify-content: center;
    flex: 1;
  }

  .journalit-visibility-editor .journalit-tab-button {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-visibility-editor .journalit-tab-button:hover {
    color: var(--text-normal);
    background-color: var(--background-modifier-hover);
  }

  .journalit-visibility-editor .journalit-tab-button.journalit-tab-active {
    color: var(--text-normal);
    font-weight: 600;
    border-bottom-color: var(--text-accent);
  }

  .journalit-visibility-editor .journalit-tab-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background-modifier-border);
    color: var(--text-muted);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    min-width: 20px;
  }

  .journalit-visibility-editor .journalit-tab-button.journalit-tab-active .journalit-tab-count {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-visibility-editor__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0 4px;
  }

  .journalit-visibility-editor__panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-visibility-editor__description {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 8px;
    text-align: center;
  }

  .journalit-visibility-editor__empty {
    text-align: center;
    color: var(--text-muted);
    padding: 32px 16px;
    font-size: 13px;
  }

  .journalit-visibility-editor__active-category {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .journalit-visibility-editor__active-category + .journalit-visibility-editor__active-category {
    margin-top: 8px;
    padding-top: 10px;
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-visibility-editor__active-category-label {
    color: var(--text-muted);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .journalit-visibility-editor__active-category-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-visibility-editor__active-item {
    display: grid;
    grid-template-columns: 32px 1fr 32px;
    gap: 8px;
    align-items: center;
    padding: 10px 12px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .journalit-visibility-editor__active-item:hover {
    background: var(--background-modifier-hover);
    border-color: var(--interactive-accent);
  }

  .journalit-visibility-editor__active-item.is-dragging {
    opacity: 0.5;
  }

  .journalit-visibility-editor__active-item.has-description {
    align-items: start;
  }

  .journalit-visibility-editor__drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    cursor: grab;
    min-height: 18px;
  }

  .journalit-visibility-editor__active-item.has-description .journalit-visibility-editor__drag-handle,
  .journalit-visibility-editor__active-item.has-description .journalit-visibility-editor__remove-button {
    margin-top: 1px;
  }

  .journalit-visibility-editor__drag-handle:hover {
    color: var(--text-normal);
  }

  .journalit-visibility-editor__drag-handle:active {
    cursor: grabbing;
  }

  .journalit-visibility-editor__drag-handle.is-disabled {
    cursor: default;
    opacity: 0.45;
  }

  .journalit-visibility-editor__drag-handle.is-disabled:hover {
    color: var(--text-muted);
  }

  .journalit-visibility-editor__item-copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .journalit-visibility-editor__item-label {
    color: var(--text-normal);
    font-size: 14px;
    line-height: 1.3;
  }

  .journalit-visibility-editor__item-description {
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.3;
  }

  .journalit-visibility-editor__remove-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 400;
    line-height: 1;
    padding: 0;
    transition: color 0.15s ease, background-color 0.15s ease, opacity 0.15s ease;
  }

  .journalit-visibility-editor__remove-button:hover:not(:disabled) {
    background: var(--background-modifier-error);
    color: var(--text-on-accent);
  }

  .journalit-visibility-editor__remove-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .journalit-visibility-editor__category {
    margin-bottom: 8px;
  }

  .journalit-visibility-editor__category-header {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-normal);
    transition: background-color 0.15s ease;
  }

  .journalit-visibility-editor__category-header:hover {
    background: var(--background-modifier-hover);
  }

  .journalit-visibility-editor__category-header svg {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .journalit-visibility-editor__category-label {
    flex: 1;
    text-align: left;
  }

  .journalit-visibility-editor__category-count {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    background: var(--background-primary);
    padding: 2px 6px;
    border-radius: 8px;
  }

  .journalit-visibility-editor__available-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 0 0 0;
  }

  .journalit-visibility-editor__available-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    transition: background-color 0.15s ease;
  }

  .journalit-visibility-editor__available-item:hover {
    background: var(--background-secondary);
  }

  .journalit-visibility-editor__available-item .journalit-visibility-editor__item-label {
    font-size: 13px;
  }

  .journalit-visibility-editor__add-button {
    display: grid;
    place-items: center;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    min-width: 24px;
    padding: 0;
    border: none;
    appearance: none;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    cursor: pointer;
    border-radius: 4px;
    line-height: 0;
    transition: background-color 0.15s ease;
  }

  .journalit-visibility-editor__add-button:hover {
    background: var(--interactive-accent-hover);
  }

  .journalit-visibility-editor__add-button-icon {
    width: 14px;
    height: 14px;
    flex: 0 0 14px;
    transform: translateX(0.5px);
  }
`;
