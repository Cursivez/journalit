

const HOME_PAGE_STYLES = `
  
  .journalit-home-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .journalit-home-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 4px 28px 8px 16px;
    background-color: var(--background-primary);
    flex-shrink: 0;
  }

  .journalit-home-greeting {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1 1 auto;
  }

  .journalit-home-greeting-title {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    color: var(--text-normal);
    line-height: 1.2;
  }

  .journalit-home-greeting-subtitle {
    margin: 4px 0 0 0;
    font-size: 14px;
    color: var(--text-muted);
    font-weight: 400;
  }

  .journalit-home-greeting-normal {
    font-weight: 400;
  }

  .journalit-home-greeting-strong {
    font-weight: 600;
  }

  .journalit-home-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: stretch;
    flex: 0 1 auto;
  }

  .journalit-home-filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: stretch;
  }

  .journalit-home-period-wrapper,
  .journalit-home-account-filter,
  .journalit-home-trade-type-filter {
    position: relative;
    min-width: 0;
  }

  .journalit-home-period-selector {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    width: auto;
    height: auto;
    color: var(--text-normal);
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid var(--background-modifier-border);
    background-color: var(--background-primary);
  }

  .journalit-home-period-chevron {
    transition: transform 0.2s ease;
  }

  .journalit-home-period-chevron--open {
    transform: rotate(180deg);
  }

  .journalit-home-period-menu {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 150px;
    margin-top: 4px;
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
    z-index: 100;
    overflow: hidden;
  }

  .journalit-home-period-option {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 6px 10px;
    cursor: pointer;
    font-size: 13px;
    text-align: left;
    color: var(--text-normal) !important;
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    border-radius: 0;
    box-shadow: none !important;
    appearance: none;
    -webkit-appearance: none;
  }

  .journalit-home-period-option:hover {
    background: var(--background-modifier-hover) !important;
    background-color: var(--background-modifier-hover) !important;
  }

  .journalit-home-period-option__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-home-period-option__check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 2px;
    background-color: var(--background-primary);
    font-size: 10px;
    color: var(--text-on-accent);
    flex-shrink: 0;
  }

  .journalit-home-period-option--active .journalit-home-period-option__check {
    background-color: var(--interactive-accent);
    border-color: var(--interactive-accent);
  }

  .journalit-home-period-option--active {
    background: transparent !important;
    background-color: transparent !important;
  }

  .journalit-home-account-filter__trigger,
  .journalit-home-trade-type-filter__trigger,
  .journalit-home-add-widget-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    width: auto;
    height: auto;
    color: var(--text-normal);
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid var(--background-modifier-border);
    background-color: var(--background-primary);
  }

  .journalit-home-account-filter__trigger,
  .journalit-home-trade-type-filter__trigger {
    width: fit-content;
    max-width: 180px;
    justify-content: flex-start;
    gap: 6px;
  }

  .journalit-home-account-filter__summary,
  .journalit-home-trade-type-filter__summary {
    min-width: 0;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-home-account-filter__chevron,
  .journalit-home-trade-type-filter__chevron {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .journalit-home-account-filter__chevron--open,
  .journalit-home-trade-type-filter__chevron--open {
    transform: rotate(180deg);
  }

  .journalit-home-account-filter__menu,
  .journalit-home-trade-type-filter__menu {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 220px;
    max-width: 280px;
    max-height: min(300px, 50vh);
    overflow-y: auto;
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px;
    margin-top: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
    z-index: 100;
  }

  .journalit-home-account-filter__option,
  .journalit-home-trade-type-filter__option {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    width: 100%;
    padding: 6px 10px;
    border: none !important;
    border-radius: 0;
    box-shadow: none !important;
    background: transparent !important;
    background-color: transparent !important;
    color: var(--text-normal) !important;
    cursor: pointer;
    text-align: left;
    font-size: 13px;
    appearance: none;
    -webkit-appearance: none;
    transition: background-color 0.15s ease;
  }

  .journalit-home-account-filter__option:hover,
  .journalit-home-trade-type-filter__option:hover {
    background: var(--background-modifier-hover) !important;
    background-color: var(--background-modifier-hover) !important;
  }

  .journalit-home-account-filter__option--active,
  .journalit-home-trade-type-filter__option--active {
    background: transparent !important;
    background-color: transparent !important;
    color: var(--text-normal) !important;
  }

  .journalit-home-account-filter__option-label,
  .journalit-home-trade-type-filter__option-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .journalit-home-account-filter__checkbox,
  .journalit-home-trade-type-filter__checkbox {
    width: 14px;
    height: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--background-modifier-border);
    border-radius: 2px;
    flex-shrink: 0;
    color: var(--text-on-accent);
    background-color: var(--background-primary);
    font-size: 10px;
  }

  .journalit-home-account-filter__checkbox--checked,
  .journalit-home-trade-type-filter__checkbox--checked {
    background-color: var(--interactive-accent);
    border-color: var(--interactive-accent);
  }

  .journalit-home-account-filter__divider,
  .journalit-home-trade-type-filter__divider {
    height: 1px;
    background-color: var(--background-modifier-border);
    margin: 4px 0;
  }

  .journalit-home-account-filter__empty {
    padding: 10px 12px;
    color: var(--text-muted);
    font-size: 12px;
  }

  .journalit-home-quick-links-position-toggle,
  .journalit-home-edit-toggle {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 8px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .journalit-home-edit-toggle--active {
    border-color: var(--interactive-accent);
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-home-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
    padding: 0 16px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-home-section {
    flex: 0 0 auto;
  }

  .journalit-home-section--quick-links .journalit-quick-links-row {
    padding: 6px 0;
  }

  .journalit-home-section--quick-links .journalit-quick-links-row--empty {
    padding: 6px 0;
  }

  
  .journalit-quick-links-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px 0;
    justify-content: center;
  }

  .journalit-quick-links-row--empty {
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: 13px;
  }

  .journalit-quick-link-item {
    position: relative;
    height: 100%;
    flex: 0 0 auto;
    min-width: 0;
  }

  .journalit-quick-link-wrapper {
    position: relative;
    width: max-content;
    height: 100%;
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }

  .journalit-quick-link-wrapper[data-editing="true"] {
    cursor: grab;
  }

  .journalit-quick-link-wrapper[data-editing="true"]::after {
    content: '';
    position: absolute;
    inset: -1px;
    box-sizing: border-box;
    border: 2px dashed color-mix(in srgb, var(--interactive-accent) 65%, transparent);
    border-radius: 8px;
    pointer-events: none;
    z-index: 10;
  }

  .journalit-quick-link-handle {
    flex: 1;
    height: 100%;
  }

  .journalit-quick-link-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    color: var(--text-normal);
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    width: auto;
    height: 100%;
  }

  .journalit-quick-link-wrapper[data-editing="true"] .journalit-quick-link-button:disabled {
    cursor: grab;
  }

  .journalit-quick-link-icon {
    color: var(--link-color, var(--interactive-accent));
    flex-shrink: 0;
  }

  .journalit-quick-link-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-quick-link-remove {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 18px;
    height: 18px;
    background-color: var(--background-modifier-error);
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
    padding: 0;
    z-index: 20;
    opacity: 0;
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .journalit-quick-link-wrapper:hover .journalit-quick-link-remove,
  .journalit-quick-link-remove:focus-visible {
    opacity: 1;
  }

  .journalit-quick-link-remove:hover {
    background-color: var(--text-error);
    transform: scale(1.05);
  }

  @media (max-width: 900px) {
    .journalit-home-header {
      flex-direction: column;
      align-items: stretch;
    }

    .journalit-home-actions {
      width: 100%;
      justify-content: flex-start;
    }
  }

  @media (max-width: 700px) {
    .journalit-home-content {
      padding: 0 12px 12px 12px;
    }

    .journalit-home-actions {
      gap: 6px;
    }

    .journalit-home-period-wrapper,
    .journalit-home-account-filter,
    .journalit-home-trade-type-filter,
    .journalit-home-add-widget-button,
    .journalit-home-quick-links-position-toggle,
    .journalit-home-edit-toggle {
      flex: 1 1 calc(50% - 6px);
      min-width: 0;
    }

    .journalit-home-period-selector,
    .journalit-home-account-filter__trigger,
    .journalit-home-trade-type-filter__trigger,
    .journalit-home-add-widget-button {
      width: 100%;
      max-width: none;
      justify-content: center;
      position: relative;
      padding-right: 36px;
      box-sizing: border-box;
    }

    .journalit-home-quick-links-position-toggle,
    .journalit-home-edit-toggle {
      width: auto;
      min-width: 40px;
      justify-content: center;
      padding: 8px;
      flex: 0 0 auto;
    }

    .journalit-home-period-chevron,
    .journalit-home-account-filter__chevron,
    .journalit-home-trade-type-filter__chevron {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }

    .journalit-home-period-chevron--open,
    .journalit-home-account-filter__chevron--open,
    .journalit-home-trade-type-filter__chevron--open {
      transform: translateY(-50%) rotate(180deg);
    }

    .journalit-home-account-filter__summary,
    .journalit-home-trade-type-filter__summary {
      max-width: none;
      flex: 0 1 auto;
      text-align: center;
    }

    .journalit-home-period-menu,
    .journalit-home-account-filter__menu,
    .journalit-home-trade-type-filter__menu {
      left: 0;
      right: 0;
      min-width: 0;
      max-width: none;
      width: auto;
      box-sizing: border-box;
      overflow-x: hidden;
    }
  }

  @media (max-width: 520px) {
    .journalit-home-header {
      padding: 12px 12px 8px 12px;
    }

    .journalit-home-greeting-title {
      font-size: 24px;
    }

    .journalit-home-greeting-subtitle {
      font-size: 13px;
    }

    .journalit-home-period-wrapper,
    .journalit-home-account-filter,
    .journalit-home-trade-type-filter,
    .journalit-home-add-widget-button {
      flex-basis: 100%;
    }

    .journalit-home-quick-links-position-toggle,
    .journalit-home-edit-toggle {
      flex-basis: auto;
      align-self: flex-start;
    }

    .journalit-home-period-selector,
    .journalit-home-account-filter__trigger,
    .journalit-home-trade-type-filter__trigger,
    .journalit-home-add-widget-button,
    .journalit-home-quick-links-position-toggle,
    .journalit-home-edit-toggle {
      padding: 10px 12px;
      font-size: 13px;
    }

  }

  
  .journalit-home-grid-layout {
    position: relative;
    padding: 0;
    margin: 0;
  }

  .journalit-home-grid-error {
    padding: 20px;
    border: 2px solid var(--text-error);
    border-radius: 4px;
    background: var(--background-secondary);
  }

  .journalit-home-grid-error__retry {
    margin-top: 10px;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
    color: var(--text-normal);
    cursor: pointer;
  }

  .journalit-home-grid-error__retry:hover {
    background: var(--background-modifier-hover);
  }

  .journalit-home-widget {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--background-primary);
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-home-grid-layout.is-editing .react-grid-item:not(.react-grid-placeholder)::after {
    content: '';
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: 2px dashed color-mix(in srgb, var(--interactive-accent) 65%, transparent);
    border-radius: 6px;
    pointer-events: none;
    z-index: 50;
  }

  .journalit-home-widget-remove {
    position: absolute;
    top: 4px;
    right: 4px;
    background-color: var(--background-modifier-error);
    color: white;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
    z-index: 100;
    padding: 0;
    font-weight: bold;
    line-height: 1;
    opacity: 0;
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .journalit-home-widget-remove:hover {
    transform: scale(1.05);
  }

  .journalit-home-grid-layout.is-editing .react-grid-item:hover .journalit-home-widget-remove {
    opacity: 1;
  }

  .journalit-home-widget-content {
    flex: 1;
    padding: 12px;
    height: 100%;
    overflow: hidden;
  }

  .journalit-home-grid-layout.is-editing .journalit-home-widget-content {
    pointer-events: none;
    user-select: none;
  }

  .journalit-home-static-grid {
    display: grid;
    grid-template-columns: repeat(var(--jit-grid-cols), minmax(0, 1fr));
    grid-auto-rows: var(--jit-grid-row-height);
    gap: var(--jit-grid-gap);
    align-items: stretch;
    width: 100%;
    padding: 12px 0;
    box-sizing: border-box;
  }

  .journalit-home-static-grid-item {
    grid-column: var(--jit-grid-column);
    grid-row: var(--jit-grid-row);
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
  }

  .journalit-home-static-grid-item > .journalit-home-widget {
    width: 100%;
    height: 100%;
  }

  
  .journalit-quick-links-row .journalit-quick-link-item {
    flex: 0 0 auto;
    min-width: 0;
  }

  .journalit-quick-links-row .journalit-quick-link-wrapper {
    width: max-content;
  }

  .journalit-quick-links-row .journalit-quick-link-button {
    width: auto;
  }
`;

const homePageStylesInjected = false;

function injectHomePageStyles(): void {
  return;
}

export function ensureHomePageStyles(): void {}
