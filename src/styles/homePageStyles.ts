

export const HOME_PAGE_STYLES = `
  
  .journalit-home-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    isolation: isolate;
    background-color: var(--background-primary);
    
    container-name: journalit-home-page;
    container-type: inline-size;
  }

  
  .journalit-home-actions
    .journalit-filter-button-container
    .journalit-filter-button,
  .journalit-home-actions .journalit-home-settings-button,
  .journalit-dashboard-filter-actions .journalit-home-settings-button,
  .journalit-home-actions .journalit-home-edit-toggle:not(.journalit-home-edit-toggle--active) {
    width: 32px;
    height: 28px;
    padding: 5px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    box-shadow: none;
    box-sizing: border-box;
  }

  .journalit-home-actions .journalit-home-settings-button,
  .journalit-dashboard-filter-actions .journalit-home-settings-button {
    cursor: pointer;
  }

  .journalit-home-actions
    .journalit-filter-button-container
    .journalit-filter-button:hover,
  .journalit-home-actions .journalit-home-settings-button:hover,
  .journalit-dashboard-filter-actions .journalit-home-settings-button:hover,
  .journalit-home-actions .journalit-home-edit-toggle:not(.journalit-home-edit-toggle--active):hover,
  .journalit-home-actions .journalit-home-add-widget-button:hover {
    background-color: var(--background-modifier-hover);
    border-color: var(--background-modifier-border-hover);
  }

  .journalit-home-actions .journalit-home-mode-toggle-wrapper,
  .journalit-dashboard-filter-actions .journalit-home-mode-toggle-wrapper {
    display: inline-flex;
    align-items: center;
    height: 28px;
  }

  
  .journalit-home-actions .journalit-home-edit-toggle,
  .journalit-home-actions .journalit-home-quick-links-position-toggle,
  .journalit-home-actions .journalit-home-add-widget-button {
    height: 28px;
    box-sizing: border-box;
  }

  .journalit-home-actions .journalit-home-add-widget-button {
    padding-block: 4px;
  }

  
  .journalit-home-mode-toggle.segmented-control {
    height: 100%;
    box-sizing: border-box;
    align-items: stretch;
  }

  .journalit-home-mode-toggle .segmented-control-option {
    display: inline-flex;
    align-items: center;
  }

  .journalit-home-mode-panels {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
  }

  .journalit-home-mode-panel {
    position: absolute;
    inset: 0;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition:
      opacity 140ms ease,
      visibility 0s linear 140ms;
  }

  .journalit-home-mode-panel.is-active {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition-delay: 0s;
  }

  .journalit-home-mode-panel--dashboard {
    overflow: hidden;
  }

  .journalit-dashboard-view--embedded {
    height: 100%;
  }

  .journalit-home-page--custom-background
    .journalit-dashboard-view--embedded {
    
    --journalit-dashboard-view-padding: 0;
    
    --journalit-dashboard-content-padding: 0 max(0px, calc(var(--journalit-dashboard-gutter) - var(--scrollbar-width))) var(--journalit-dashboard-gutter) var(--journalit-dashboard-gutter);
    --journalit-dashboard-toolbar-gutter: var(--journalit-dashboard-gutter);
    --journalit-dashboard-surface-background: transparent;
    --journalit-dashboard-toolbar-background: transparent;
    --journalit-dashboard-overflow-y: hidden;
    --journalit-dashboard-scrollbar-gutter: auto;
    --journalit-dashboard-content-overflow: hidden auto;
    --journalit-dashboard-content-scrollbar-gutter: stable;
    --journalit-dashboard-widget-background: var(--journalit-home-widget-background);
    --journalit-dashboard-widget-header-opacity: 1;
    --journalit-dashboard-widget-title-color: var(--text-normal);
  }

  .journalit-home-page--custom-background .journalit-dashboard-empty-container {
    padding: 40px var(--journalit-dashboard-gutter);
    box-sizing: border-box;
    min-height: 0;
    overflow: hidden auto;
    align-items: safe center;
  }

  .journalit-home-page::before,
  .journalit-home-page::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .journalit-home-page::before {
    background-image: var(--journalit-home-background-image, none);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0;
    z-index: -2;
  }

  .journalit-home-page::after {
    background-color: var(--background-primary);
    opacity: 0;
    z-index: -1;
  }

  .journalit-home-page--custom-background::before {
    opacity: 0.42;
  }

  .journalit-home-page--custom-background {
    --journalit-home-surface-alpha: 62%;
    --journalit-home-scrim-opacity: 0.66;
    --journalit-home-widget-opacity: var(--journalit-home-widget-opacity-dark, 50%);
    --journalit-home-widget-background: color-mix(
      in srgb,
      var(--background-primary) var(--journalit-home-widget-opacity),
      transparent
    );
  }

  .journalit-home-page--custom-background::after {
    opacity: var(--journalit-home-scrim-opacity);
  }

  .journalit-home-page--custom-background .journalit-home-widget {
    background-color: var(--journalit-home-widget-background);
  }

  .journalit-home-page--custom-background
    .journalit-home-widget
    button:not(.journalit-native-button--unstyled):not(.journalit-home-goals__save-button):not(
      .journalit-home-widget__option--active
    ):not(.journalit-home-goals__period-button--active):not(
      .journalit-home-setups__save-button
    ):not(.journalit-home-setups__chip--active):not(
      .journalit-home-streak__config-save
    ):not(.journalit-home-heatmap__year-button--active):not(
      .journalit-home-embedded-note__error-button
    ):not(
      .journalit-home-widget-remove
    ) {
    background-color: color-mix(
      in srgb,
      var(--background-primary) var(--journalit-home-surface-alpha),
      transparent
    );
  }

  .journalit-home-page--custom-background .journalit-home-period-selector,
  .journalit-home-page--custom-background
    .journalit-home-account-filter__trigger,
  .journalit-home-page--custom-background
    .journalit-home-trade-type-filter__trigger,
  .journalit-home-page--custom-background
    .journalit-home-quick-links-position-toggle,
  .journalit-home-page--custom-background button.journalit-quick-link-button {
    background-color: color-mix(
      in srgb,
      var(--background-primary) var(--journalit-home-surface-alpha),
      transparent
    );
  }

  .journalit-home-page--custom-background
    .journalit-home-edit-toggle--active {
    background-color: var(--interactive-accent);
  }

  .theme-light .journalit-home-page--custom-background {
    --journalit-home-surface-alpha: 38%;
    --journalit-home-scrim-opacity: 0.42;
    --journalit-home-widget-opacity: var(--journalit-home-widget-opacity-light, 50%);
  }

  .theme-light .journalit-home-page--custom-background::before {
    opacity: 0.5;
  }

  .journalit-home-page .journalit-home-header {
    padding: 16px 28px 4px 40px;
    background-color: transparent;
    flex-shrink: 0;
  }

  .journalit-home-greeting {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1 1 auto;
  }

  .journalit-home-subtitle-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    margin-top: 0;
  }

  .journalit-home-greeting-title {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    color: var(--text-normal);
    line-height: 1.05;
    transform: translateY(6px);
  }

  .journalit-home-greeting-subtitle {
    margin: 0;
    font-size: 14px;
    color: var(--text-muted);
    font-weight: 400;
  }

  .journalit-home-greeting-normal {
    font-weight: 400;
  }

  .journalit-home-page .journalit-home-greeting-name-editor {
    position: relative;
    display: inline-block;
    max-width: min(240px, 45vw);
    vertical-align: top;
  }

  .journalit-home-page .journalit-home-greeting-name-sizer,
  .journalit-home-page .journalit-home-greeting-name,
  .journalit-home-page .journalit-home-greeting-name-input {
    margin: 0;
    padding: 0 2px;
    border: 0;
    border-bottom: 1px solid transparent;
    border-radius: 0;
    background: transparent;
    color: var(--text-normal);
    font: inherit;
    font-weight: 600;
    line-height: inherit;
    box-shadow: none;
  }

  .journalit-home-page .journalit-home-greeting-name-sizer {
    display: block;
    visibility: hidden;
    padding-right: 6px;
    white-space: pre;
    overflow: hidden;
  }

  .journalit-home-page .journalit-home-greeting-name,
  .journalit-home-page .journalit-home-greeting-name-input {
    position: absolute;
    inset: 0;
  }

  .journalit-home-page button.journalit-home-greeting-name {
    display: block;
    background-color: transparent;
    cursor: text;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-home-page .journalit-home-greeting-name.is-placeholder {
    color: var(--text-muted);
    border-bottom-color: var(--background-modifier-border);
    border-bottom-style: dashed;
  }

  .journalit-home-page .journalit-home-greeting-name:hover,
  .journalit-home-page .journalit-home-greeting-name:focus-visible,
  .journalit-home-page .journalit-home-greeting-name-input:focus {
    color: var(--text-normal);
    border-bottom-color: var(--interactive-accent);
    box-shadow: none;
    outline: none;
  }

  .journalit-home-page .journalit-home-greeting-name-input {
    min-width: 0;
    overflow: hidden;
  }

  .journalit-home-actions {
    display: flex;
    gap: 6px;
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

  .journalit-home-filter-icon {
    flex: 0 0 auto;
    color: var(--text-muted);
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

  .journalit-home-page .journalit-home-period-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: max-content;
    min-width: 112px;
    max-width: min(220px, calc(100cqw - 24px));
    margin-top: 4px;
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
    z-index: 100;
    overflow: hidden;
  }

  .journalit-home-page .journalit-home-period-option {
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

  .journalit-home-page .journalit-home-period-option:hover {
    background: var(--background-modifier-hover) !important;
    background-color: var(--background-modifier-hover) !important;
  }

  .journalit-home-page .journalit-home-period-option__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-home-page .journalit-home-period-option__check {
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

  .journalit-home-page
    .journalit-home-period-option--active
    .journalit-home-period-option__check {
    background-color: var(--interactive-accent);
    border-color: var(--interactive-accent);
  }

  .journalit-home-page .journalit-home-period-option--active {
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

  button.journalit-native-button--unstyled.journalit-home-add-shortcut {
    box-sizing: border-box;
    width: 100%;
    padding: 10px 16px;
  }

  button.journalit-native-button--unstyled.journalit-home-add-shortcut:hover {
    background-color: var(--background-secondary);
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
    width: max-content;
    min-width: 120px;
    max-width: min(280px, calc(100cqw - 24px));
    max-height: min(300px, 50vh);
    overflow-y: auto;
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px;
    margin-top: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
    z-index: 100;
  }

  .journalit-home-account-filter .journalit-home-account-filter__option,
  .journalit-home-trade-type-filter .journalit-home-trade-type-filter__option {
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

  .journalit-home-account-filter .journalit-home-account-filter__option:hover,
  .journalit-home-trade-type-filter
    .journalit-home-trade-type-filter__option:hover {
    background: var(--background-modifier-hover) !important;
    background-color: var(--background-modifier-hover) !important;
  }

  .journalit-home-account-filter
    .journalit-home-account-filter__option--active,
  .journalit-home-trade-type-filter
    .journalit-home-trade-type-filter__option--active {
    background: transparent !important;
    background-color: transparent !important;
    color: var(--text-normal) !important;
  }

  .journalit-home-account-filter .journalit-home-account-filter__option-label,
  .journalit-home-trade-type-filter
    .journalit-home-trade-type-filter__option-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .journalit-home-account-filter .journalit-home-account-filter__checkbox,
  .journalit-home-trade-type-filter
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

  .journalit-home-account-filter
    .journalit-home-account-filter__checkbox--checked,
  .journalit-home-trade-type-filter
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

  .journalit-home-edit-toggle {
    width: 32px;
    height: 28px;
    padding: 5px;
    box-sizing: border-box;
  }

  .journalit-home-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
    padding: 0 16px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .journalit-home-section {
    flex: 0 0 auto;
  }

  .journalit-home-content
    > .journalit-home-section:first-child:not(
      .journalit-home-section--quick-links
    ) {
    margin-top: 6px;
  }

  .journalit-home-section--quick-links .journalit-quick-links-row {
    padding: 6px 0;
  }

  .journalit-home-section--quick-links:empty {
    display: none;
  }

  
  .journalit-quick-links-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px 0;
    justify-content: center;
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

  button.journalit-quick-link-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background-color: var(--background-primary);
    box-shadow: none;
    color: var(--text-normal);
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    width: auto;
    height: 100%;
    cursor: pointer;
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

  @container journalit-home-page (max-width: 900px) {
    .journalit-home-subtitle-row {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      margin-top: 0;
    }

    .journalit-home-actions {
      width: 100%;
      justify-content: flex-start;
    }

    
    .journalit-home-actions
      .journalit-drilldown-filter
      .journalit-drilldown-filter__menu {
      left: 0;
      right: auto;
    }
  }

  @container journalit-home-page (max-width: 700px) {
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
    .journalit-home-actions .journalit-home-settings-button,
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
      padding: 5px;
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

  @container journalit-home-page (max-width: 520px) {
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
    .journalit-home-add-widget-button {
      padding: 10px 12px;
      font-size: 13px;
    }

    .journalit-home-quick-links-position-toggle,
    .journalit-home-edit-toggle {
      padding: 5px;
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
