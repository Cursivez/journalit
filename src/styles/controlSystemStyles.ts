


export const CONTROL_SYSTEM_STYLES = `
  
  :is(.modal[class*="journalit-"], .modal-container[class*="journalit-"], .journalit-modal, .journalit-drawer-inner, .journalit-settings, .journalit-settings-tab, .journalit-settings-group, .journalit-settings-inline-item, .journalit-csv-import, .journalit-template-builder-container, .journalit-home-page) :is(input:not([type]), input[type='text'], input[type='number'], input[type='search'], input[type='email'], input[type='password'], input[type='url'], textarea):not(.combobox-input, .segment-input, .journalit-fast-datetime__segment, .journalit-input-field *, .journalit-dropdown-select__search, .journalit-broker-picker__search input, .journalit-nav-search-input, .journalit-wpd-search-input, .widget-picker-search-input) {
    box-sizing: border-box;
    min-height: var(--journalit-control-height);
    border: 0;
    border-radius: var(--journalit-control-radius);
    outline: 1px solid transparent;
    outline-offset: -1px;
    background-color: var(--journalit-control-field-fill);
    box-shadow: var(--journalit-control-field-ring);
    color: var(--text-normal);
    font-size: var(--font-ui-small);
    line-height: 1.3;
  }

  :is(.modal[class*="journalit-"], .modal-container[class*="journalit-"], .journalit-modal, .journalit-drawer-inner, .journalit-settings, .journalit-settings-tab, .journalit-settings-group, .journalit-settings-inline-item, .journalit-csv-import, .journalit-template-builder-container, .journalit-home-page) :is(input:not([type]), input[type='text'], input[type='number'], input[type='search'], input[type='email'], input[type='password'], input[type='url']):not(.combobox-input, .segment-input, .journalit-fast-datetime__segment, .journalit-input-field *, .journalit-dropdown-select__search, .journalit-broker-picker__search input, .journalit-nav-search-input, .journalit-wpd-search-input, .widget-picker-search-input) {
    height: var(--journalit-control-height);
    padding: 0 8px 0 var(--journalit-field-inset-start, 8px);
  }

  :is(.modal[class*="journalit-"], .modal-container[class*="journalit-"], .journalit-modal, .journalit-drawer-inner, .journalit-settings, .journalit-settings-tab, .journalit-settings-group, .journalit-settings-inline-item, .journalit-csv-import, .journalit-template-builder-container, .journalit-home-page) textarea:not(.combobox-input, .segment-input, .journalit-fast-datetime__segment, .journalit-input-field *, .journalit-dropdown-select__search, .journalit-broker-picker__search input, .journalit-nav-search-input, .journalit-wpd-search-input, .widget-picker-search-input) {
    padding: 5px 8px;
  }

  :is(.modal[class*="journalit-"], .modal-container[class*="journalit-"], .journalit-modal, .journalit-drawer-inner, .journalit-settings, .journalit-settings-tab, .journalit-settings-group, .journalit-settings-inline-item, .journalit-csv-import, .journalit-template-builder-container, .journalit-home-page) :is(input:not([type]), input[type='text'], input[type='number'], input[type='search'], input[type='email'], input[type='password'], input[type='url'], textarea):not(.combobox-input, .segment-input, .journalit-fast-datetime__segment, .journalit-input-field *, .journalit-dropdown-select__search, .journalit-broker-picker__search input, .journalit-nav-search-input, .journalit-wpd-search-input, .widget-picker-search-input):hover:not(:disabled, :focus) {
    background-color: var(--journalit-control-field-fill-hover);
    box-shadow: var(--journalit-control-field-ring);
  }

  :is(.modal[class*="journalit-"], .modal-container[class*="journalit-"], .journalit-modal, .journalit-drawer-inner, .journalit-settings, .journalit-settings-tab, .journalit-settings-group, .journalit-settings-inline-item, .journalit-csv-import, .journalit-template-builder-container, .journalit-home-page) :is(input:not([type]), input[type='text'], input[type='number'], input[type='search'], input[type='email'], input[type='password'], input[type='url'], textarea):not(.combobox-input, .segment-input, .journalit-fast-datetime__segment, .journalit-input-field *, .journalit-dropdown-select__search, .journalit-broker-picker__search input, .journalit-nav-search-input, .journalit-wpd-search-input, .widget-picker-search-input):focus {
    outline-color: var(--journalit-control-focus);
    box-shadow: none;
  }

  :is(.modal[class*="journalit-"], .modal-container[class*="journalit-"], .journalit-modal, .journalit-drawer-inner, .journalit-settings, .journalit-settings-tab, .journalit-settings-group, .journalit-settings-inline-item, .journalit-csv-import, .journalit-template-builder-container, .journalit-home-page) :is(input:not([type]), input[type='text'], input[type='number'], input[type='search'], input[type='email'], input[type='password'], input[type='url'], textarea):not(.combobox-input, .segment-input, .journalit-fast-datetime__segment, .journalit-input-field *, .journalit-dropdown-select__search, .journalit-broker-picker__search input, .journalit-nav-search-input, .journalit-wpd-search-input, .widget-picker-search-input)::placeholder {
    color: var(--text-faint);
  }

  :is(.modal[class*="journalit-"], .modal-container[class*="journalit-"], .journalit-modal, .journalit-drawer-inner, .journalit-settings, .journalit-settings-tab, .journalit-settings-group, .journalit-settings-inline-item, .journalit-csv-import, .journalit-template-builder-container, .journalit-home-page) :is(input:not([type]), input[type='text'], input[type='number'], input[type='search'], input[type='email'], input[type='password'], input[type='url'], textarea):not(.combobox-input, .segment-input, .journalit-fast-datetime__segment, .journalit-input-field *, .journalit-dropdown-select__search, .journalit-broker-picker__search input, .journalit-nav-search-input, .journalit-wpd-search-input, .widget-picker-search-input)[aria-invalid="true"] {
    outline-color: var(--journalit-status-error);
    box-shadow: none;
  }

  
  button.journalit-dropdown-select__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-2-2);
    box-sizing: border-box;
    width: 100%;
    min-height: var(--journalit-control-height);
    height: var(--journalit-control-height);
    padding: 0 8px;
    border: 0;
    border-radius: var(--journalit-control-radius);
    background: var(--journalit-control-field-fill);
    box-shadow: var(--journalit-control-field-ring);
    color: var(--text-normal);
    font-size: var(--font-ui-small);
    font-weight: var(--font-normal);
    text-align: left;
    cursor: pointer;
  }

  button.journalit-dropdown-select__trigger:hover {
    background: var(--journalit-control-field-fill-hover);
    box-shadow: var(--journalit-control-field-ring);
  }

  button.journalit-dropdown-select__trigger:focus-visible {
    outline: 1px solid var(--journalit-control-focus);
    outline-offset: -1px;
    box-shadow: none;
  }

  .journalit-dropdown-select {
    position: relative;
    width: 100%;
    min-width: 0;
  }

  .journalit-dropdown-select__summary {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-dropdown-select__chevron {
    flex: 0 0 auto;
    color: var(--text-muted);
    transition: transform 150ms var(--journalit-control-curve);
  }

  .journalit-dropdown-select__chevron.is-open {
    transform: rotate(180deg);
  }

  
  .journalit-dropdown-select--button {
    display: inline-flex;
    width: auto;
  }

  .journalit-dropdown-select--button button.journalit-dropdown-select__trigger {
    width: auto;
    gap: 6px;
    padding: 0 8px 0 10px;
    background: var(--journalit-control-secondary-fill);
    box-shadow: var(--journalit-control-secondary-shadow);
    color: var(--text-normal);
    font-weight: 500;
  }

  .journalit-dropdown-select--button button.journalit-dropdown-select__trigger:hover {
    background: var(--journalit-control-secondary-fill-hover);
    box-shadow: var(--journalit-control-secondary-shadow);
  }

  .journalit-dropdown-select--button .journalit-dropdown-select__summary {
    flex: 0 1 auto;
  }

  
  .journalit-dropdown-select--content {
    display: inline-flex;
    flex: 0 1 auto;
    width: auto;
    max-width: 100%;
  }

  .journalit-dropdown-select--content button.journalit-dropdown-select__trigger {
    width: auto;
    max-width: 100%;
  }

  .journalit-dropdown-select--content .journalit-dropdown-select__summary {
    display: grid;
    flex: 0 1 auto;
  }

  .journalit-dropdown-select__summary-text,
  .journalit-dropdown-select__summary-sizer {
    grid-area: 1 / 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-dropdown-select__summary-sizer {
    visibility: hidden;
  }

  
  .journalit-anchored-menu.journalit-dropdown-select__menu {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 2px;
    border-radius: var(--journalit-control-radius);
    background: var(--journalit-control-menu-fill);
  }

  .journalit-dropdown-select__menu button.journalit-dropdown-select__option {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    min-height: var(--journalit-control-height);
    height: auto;
    padding: 0 8px;
    border: 0;
    border-radius: var(--journalit-control-inner-radius);
    background: transparent;
    box-shadow: none;
    color: var(--text-normal);
    cursor: pointer;
    font-size: var(--font-ui-small);
    font-weight: var(--font-normal);
    text-align: left;
    appearance: none;
  }

  .journalit-dropdown-select__menu button.journalit-dropdown-select__option:hover,
  .journalit-dropdown-select__menu button.journalit-dropdown-select__option:focus-visible {
    outline: none;
    background: var(--journalit-control-overlay-hover);
  }

  .journalit-dropdown-select__group {
    padding: 6px 8px 2px;
    color: var(--text-faint);
    font-size: var(--font-ui-smaller);
    font-weight: 500;
  }

  
  .journalit-dropdown-select__option-label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  
  .journalit-dropdown-select__menu button.journalit-dropdown-select__option--described {
    padding-block: 4px;
  }

  .journalit-dropdown-select__option-text {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .journalit-dropdown-select__option-description {
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
  }

  .journalit-dropdown-select__check {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    color: var(--text-accent);
    font-size: var(--font-ui-smaller);
    line-height: 1;
  }

  
  .journalit-toggle-switch {
    position: relative;
    display: inline-block;
    flex-shrink: 0;
    width: 32px;
    height: 18px;
  }

  .journalit-toggle-switch .toggle-switch-input {
    position: absolute;
    width: 0;
    height: 0;
    margin: 0;
    opacity: 0;
  }

  .journalit-toggle-switch .toggle-switch-label {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: var(--journalit-control-inner-radius);
    background-color: var(--journalit-control-switch-off);
    box-shadow: var(--journalit-control-switch-shadow);
    cursor: pointer;
    transition: background-color 90ms ease-out;
  }

  .journalit-toggle-switch .toggle-switch-button {
    position: absolute;
    bottom: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: var(--journalit-control-switch-thumb-radius);
    background-color: white;
    box-shadow: var(--journalit-control-thumb-shadow);
    transition: transform 90ms ease-out;
  }

  .journalit-toggle-switch .toggle-switch-input:checked + .toggle-switch-label {
    color: var(--text-on-accent);
    background-color: var(--interactive-accent);
    box-shadow: none;
  }

  .journalit-toggle-switch .toggle-switch-input:checked + .toggle-switch-label .toggle-switch-button {
    background-color: var(--text-on-accent);
    transform: translateX(14px);
  }

  .journalit-toggle-switch .toggle-switch-input:focus-visible + .toggle-switch-label {
    outline: 2px solid var(--journalit-control-focus);
    outline-offset: 1px;
  }

  .journalit-toggle-switch.disabled {
    opacity: 0.5;
  }

  .journalit-toggle-switch.disabled .toggle-switch-label {
    cursor: not-allowed;
  }

  :is(.journalit-settings, .journalit-settings-tab, .journalit-settings-group) .checkbox-container {
    width: 32px;
    height: 18px;
    border-radius: var(--journalit-control-inner-radius);
    background-color: var(--journalit-control-switch-off);
    box-shadow: var(--journalit-control-switch-shadow);
    transition: background-color 90ms ease-out;
  }

  :is(.journalit-settings, .journalit-settings-tab, .journalit-settings-group) .checkbox-container::after {
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    margin: 0;
    border-radius: var(--journalit-control-switch-thumb-radius);
    background-color: white;
    box-shadow: var(--journalit-control-thumb-shadow);
    transform: none;
    transition: transform 90ms ease-out;
  }

  :is(.journalit-settings, .journalit-settings-tab, .journalit-settings-group) .checkbox-container.is-enabled {
    color: var(--text-on-accent);
    background-color: var(--interactive-accent);
    box-shadow: none;
  }

  :is(.journalit-settings, .journalit-settings-tab, .journalit-settings-group) .checkbox-container.is-enabled::after {
    background-color: var(--text-on-accent);
    transform: translateX(14px);
  }

  
  .journalit-icon-strip {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    border-radius: var(--journalit-control-radius);
    background-color: var(--journalit-control-strip);
  }

  .journalit-filter-button-container {
    position: relative;
    display: inline-flex;
  }

  button.journalit-filter-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 32px;
    min-width: 32px;
    height: var(--journalit-control-height);
    min-height: var(--journalit-control-height);
    padding: 0;
    border: 0;
    border-radius: var(--journalit-control-radius);
    background: var(--journalit-control-strip);
    box-shadow: none;
    color: var(--text-muted);
    cursor: pointer;
  }

  .journalit-icon-strip button.journalit-filter-button {
    background: transparent;
  }

  button.journalit-filter-button svg {
    width: 15px;
    height: 15px;
  }

  button.journalit-filter-button:hover {
    background: var(--background-modifier-hover);
    box-shadow: none;
    color: var(--text-normal);
  }

  button.journalit-filter-button:focus-visible {
    outline: 2px solid var(--journalit-control-focus);
    outline-offset: 2px;
  }

  button.journalit-filter-button.active,
  .journalit-icon-strip button.journalit-filter-button.active {
    background: var(--journalit-control-primary-fill);
    box-shadow: var(--journalit-control-primary-shadow);
    color: var(--text-on-accent);
  }

  button.journalit-filter-button.active:hover,
  .journalit-icon-strip button.journalit-filter-button.active:hover {
    background: var(--journalit-control-primary-fill-hover);
    color: var(--text-on-accent);
  }

  
  [class*="journalit-"]:not(body) button.mod-cta:not(.journalit-button, .journalit-view-guide-button) {
    border: 0;
    border-radius: var(--journalit-control-radius);
    background: var(--journalit-control-primary-fill);
    box-shadow: var(--journalit-control-primary-shadow);
    color: var(--text-on-accent);
  }

  [class*="journalit-"]:not(body) button.mod-cta:not(.journalit-button, .journalit-view-guide-button):hover:not(:disabled) {
    background: var(--journalit-control-primary-fill-hover);
    box-shadow: var(--journalit-control-primary-shadow);
    color: var(--text-on-accent);
  }

  button.journalit-image-url-button,
  button.journalit-quick-link-button,
  button.journalit-settings-accordion__header {
    border: 0;
    border-radius: var(--journalit-control-radius);
    background: var(--journalit-control-secondary-fill);
    box-shadow: var(--journalit-control-secondary-shadow);
    color: var(--text-normal);
  }
`;
