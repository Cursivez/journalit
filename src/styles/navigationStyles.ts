

const NAVIGATION_STYLES = `
  .journalit-navigation-view-container {
    height: 100% !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
  }

  .journalit-navigation-view-container > .view-content {
    padding: 0 !important;
    overflow: hidden !important;
  }

  .journalit-navigation-view-container .journalit-react-view-root {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
  }

  .journalit-navigation-view-container .journalit-nav-sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  .journalit-navigation-view-container .journalit-nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 8px 4px;
    flex-shrink: 0;
  }

  .journalit-navigation-view-container .journalit-nav-logo {
    width: 165px;
    max-width: 165px;
    height: auto;
    display: block;
  }

  .theme-dark .journalit-navigation-view-container .journalit-nav-logo {
    filter: invert(1);
  }

  .journalit-navigation-view-container .journalit-nav-edit-toggle {
    background: none;
    border: none;
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
    color: var(--text-muted);
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-top: -2px;
    transition: opacity 0.15s ease;
  }

  .journalit-navigation-view-container .journalit-nav-edit-toggle:hover {
    opacity: 1;
    background-color: var(--background-modifier-hover);
  }

  .journalit-navigation-view-container .journalit-nav-edit-toggle[data-active="true"] {
    opacity: 1;
    color: var(--interactive-accent);
  }

  .journalit-navigation-view-container .journalit-nav-section {
    margin-top: 2px;
  }

  .journalit-navigation-view-container .journalit-nav-section-header {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-faint);
    margin-top: 12px;
    padding: 0 12px 2px 12px;
    user-select: none;
  }

  .journalit-navigation-view-container .journalit-nav-section:first-of-type .journalit-nav-section-header {
    margin-top: 0;
  }

  .journalit-navigation-view-container .journalit-nav-item {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    color: var(--text-normal);
    cursor: pointer;
    margin: 1px 6px;
    gap: 8px;
    user-select: none;
    transition: background-color 0.1s ease;
    position: relative;
  }

  .journalit-navigation-view-container .journalit-nav-item:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-navigation-view-container .journalit-nav-item[data-editing="true"] {
    cursor: grab;
  }

  .journalit-navigation-view-container .journalit-nav-item[data-editing="true"]:active {
    cursor: grabbing;
  }

  .journalit-navigation-view-container .journalit-nav-item-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  .journalit-navigation-view-container .journalit-nav-item-label {
    flex: 1;
    line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .journalit-navigation-view-container .journalit-nav-item-drag {
    flex-shrink: 0;
    color: var(--text-faint);
    opacity: 0.5;
    display: flex;
    align-items: center;
    cursor: grab;
  }

  .journalit-navigation-view-container .journalit-nav-item-drag:active {
    cursor: grabbing;
  }

  .journalit-navigation-view-container .journalit-nav-item-remove {
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background-color: var(--background-modifier-error);
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    z-index: 20;
  }

  .journalit-navigation-view-container .journalit-nav-item-remove:hover {
    background-color: var(--text-error);
  }

  .journalit-navigation-view-container .journalit-nav-restore-section {
    margin-top: 16px;
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 8px;
  }

  .journalit-navigation-view-container .journalit-nav-restore-header {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-faint);
    padding: 0 12px 4px 12px;
    user-select: none;
  }

  .journalit-navigation-view-container .journalit-nav-restore-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 12px;
    margin: 1px 6px;
    border-radius: 6px;
    font-size: 13px;
    color: var(--text-muted);
  }

  .journalit-navigation-view-container .journalit-nav-restore-item-info {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .journalit-navigation-view-container .journalit-nav-restore-item-info .journalit-obsidian-icon {
    width: 14px;
    height: 14px;
    flex: 0 0 14px;
  }

  .journalit-navigation-view-container .journalit-nav-restore-item-info span {
    line-height: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-navigation-view-container .journalit-nav-restore-btn {
    background: none;
    border: none;
    color: var(--interactive-accent);
    cursor: pointer;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .journalit-navigation-view-container .journalit-nav-restore-btn:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-navigation-view-container .journalit-nav-search {
    padding: 4px 8px 4px;
    flex-shrink: 0;
  }

  .journalit-navigation-view-container .journalit-nav-search-input-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 6px;
    background-color: var(--background-modifier-form-field);
    border: 1px solid var(--background-modifier-border);
    transition: border-color 120ms ease, box-shadow 120ms ease;
  }

  .journalit-navigation-view-container .journalit-nav-search:focus-within .journalit-nav-search-input-wrapper {
    border-color: var(--background-modifier-border-hover);
    box-shadow: 0 0 0 1px var(--background-modifier-border-hover);
  }

  .journalit-navigation-view-container .journalit-nav-search-input {
    flex: 1;
    border: none !important;
    background: transparent !important;
    color: var(--text-normal);
    font-size: 12px;
    outline: none !important;
    box-shadow: none !important;
    padding: 0;
    min-width: 0;
  }

  .journalit-navigation-view-container .journalit-nav-search-input:focus {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  .journalit-navigation-view-container .journalit-nav-search-input::placeholder {
    color: var(--text-faint);
  }

  .journalit-navigation-view-container .journalit-nav-search-icon {
    width: 16px;
    height: 16px;
    color: var(--text-faint);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  .journalit-navigation-view-container .journalit-nav-search-clear {
    background: none;
    border: none;
    padding: 2px;
    cursor: pointer;
    color: var(--text-faint);
    display: flex;
    align-items: center;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .journalit-navigation-view-container .journalit-nav-search-clear:hover {
    color: var(--text-muted);
    background-color: var(--background-modifier-hover);
  }

  .journalit-navigation-view-container .journalit-nav-search-results {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 8px;
  }

  .journalit-navigation-view-container .journalit-nav-content-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 8px;
  }

  .journalit-navigation-view-container .journalit-nav-search-section-header {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-faint);
    margin-top: 12px;
    padding: 0 12px 2px 12px;
    user-select: none;
  }

  .journalit-navigation-view-container .journalit-nav-search-results .journalit-nav-search-section-header:first-child {
    margin-top: 4px;
  }

  .journalit-navigation-view-container .journalit-nav-search-result {
    display: flex;
    align-items: center;
    padding: 5px 12px;
    margin: 1px 6px;
    border-radius: 6px;
    cursor: pointer;
    gap: 8px;
    transition: background-color 0.1s ease;
  }

  .journalit-navigation-view-container .journalit-nav-search-result:hover,
  .journalit-navigation-view-container .journalit-nav-search-result.is-selected {
    background-color: var(--background-modifier-hover);
  }

  .journalit-navigation-view-container .journalit-nav-search-result-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    color: var(--text-muted);
  }

  .journalit-navigation-view-container .journalit-nav-search-result-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .journalit-navigation-view-container .journalit-nav-search-result-primary {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-normal);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-navigation-view-container .journalit-nav-search-result-secondary {
    font-size: 11px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-navigation-view-container .journalit-nav-search-result-pnl {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  .journalit-navigation-view-container .journalit-nav-search-result-pnl[data-positive="true"] {
    color: var(--color-green);
  }

  .journalit-navigation-view-container .journalit-nav-search-result-pnl[data-positive="false"] {
    color: var(--color-red);
  }

  .journalit-navigation-view-container .journalit-nav-search-result-pnl[data-neutral="true"] {
    color: var(--text-faint);
  }

  .journalit-navigation-view-container .journalit-nav-search-result-badge {
    flex-shrink: 0;
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 4px;
    background-color: rgba(33, 150, 243, 0.15);
    color: var(--status-open-color, #2196f3);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .journalit-navigation-view-container .journalit-nav-search-result-reviewed {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    color: var(--color-green);
  }

  .journalit-navigation-view-container .journalit-nav-search-empty {
    padding: 16px 12px;
    text-align: center;
    font-size: 12px;
    color: var(--text-faint);
  }
`;

const navigationStylesInjected = false;

export function injectNavigationStyles(): void {
  return;
}

export function removeNavigationStyles(): void {
  return;
}

export function ensureNavigationStyles(): void {}
