

export const SETTINGS_TAB_STYLES = `
  
  .journalit-settings-wrapper,
  .journalit-settings .settings-tab-container {
    width: 100%;
    box-sizing: border-box;
  }

  
  .journalit-settings .settings-tab-nav {
    display: flex;
    border-bottom: 1px solid var(--background-modifier-border);
    margin-bottom: 4px;
    justify-content: center;
    width: 100%;
    padding-bottom: 0;
  }

  
  .journalit-settings .settings-tab-button {
    padding: 8px 16px;
    cursor: pointer;
    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 2px solid transparent;
    color: var(--text-muted);
    font-weight: 500;
    margin-right: 8px;
    position: relative;
    bottom: -1px;
    background: transparent;
    border-radius: 0;
    font-size: 14px;
    transition: all 0.15s ease;
  }

  
  .journalit-settings .settings-tab-button--active {
    border-bottom-color: var(--text-accent);
    color: var(--text-normal);
    font-weight: 600;
  }

  
  .journalit-settings .settings-tab-content {
    overflow: visible;
    padding: 4px 24px 20px;
    background: var(--background-primary);
  }

  
  .journalit-settings-tab .option-edit-input {
    flex: 1 !important;
    margin-right: 12px !important;
    padding: 6px 10px !important;
    border: 1px solid var(--interactive-accent) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.3) !important;
    position: relative !important;
    z-index: 100 !important;
    min-width: 100px !important;
    pointer-events: auto !important;
    -webkit-user-select: text !important;
    user-select: text !important;
    cursor: text !important;
  }

  .journalit-settings-tab .custom-options-event-item-edit {
    display: block !important;
  }

  .journalit-settings-tab .custom-options-event-item-edit .setting-item-control {
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    margin-left: 0 !important;
  }

  .journalit-settings-tab .custom-options-event-editor {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
    min-width: 0 !important;
    width: 100% !important;
    text-align: start !important;
  }

  .journalit-settings-tab .custom-options-event-editor-main {
    width: 100% !important;
    align-self: flex-start !important;
    text-align: start !important;
  }

  .journalit-settings-tab .custom-options-event-input {
    display: block !important;
    flex: 0 1 auto !important;
    width: clamp(160px, 32vw, 280px) !important;
    max-width: min(280px, 100%) !important;
    margin-right: 0 !important;
  }

  .journalit-settings-tab .custom-options-event-editor-footer {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px !important;
    width: 100% !important;
  }

  .journalit-settings-tab .custom-options-event-notes-textarea {
    width: 100% !important;
    min-height: 88px !important;
    resize: vertical !important;
  }

  .journalit-settings-tab .custom-options-event-notes-preview {
    margin-top: 4px !important;
    white-space: pre-wrap !important;
  }

  .journalit-settings-tab .custom-options-event-actions {
    margin-top: 0 !important;
    margin-left: auto !important;
    flex-shrink: 0 !important;
    align-self: flex-end !important;
  }

  .journalit-settings-tab .custom-options-symbol-mapping-arrow {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    align-self: stretch !important;
    min-height: 34px !important;
    line-height: 1 !important;
  }

  
  .journalit-settings-tab .drc-settings .custom-item-add,
  .journalit-settings-tab .weekly-review-settings .custom-item-add,
  .journalit-settings-tab .custom-options-settings .custom-item-add {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    width: 100% !important;
    gap: 10px !important;
    margin-bottom: 16px !important;
    position: relative !important;
    padding: 4px 0 !important;
  }

  .journalit-settings-tab .custom-options-settings .custom-item-add {
    padding-inline: 8px !important;
  }

  
  .journalit-settings-tab .drc-settings input[type="text"],
  .journalit-settings-tab .drc-settings .custom-item-add input,
  .journalit-settings-tab .weekly-review-settings input[type="text"],
  .journalit-settings-tab .weekly-review-settings .custom-item-add input,
  .journalit-settings-tab .custom-options-settings input[type="text"],
  .journalit-settings-tab .custom-options-settings .custom-item-add input {
    height: 34px !important;
    line-height: normal !important;
    font-size: 16px !important;
    padding: 6px 10px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    width: 100% !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }

  .journalit-settings-tab .drc-settings .custom-item-add .input,
  .journalit-settings-tab .drc-settings .custom-item-add input,
  .journalit-settings-tab .weekly-review-settings .custom-item-add .input,
  .journalit-settings-tab .weekly-review-settings .custom-item-add input,
  .journalit-settings-tab .custom-options-settings .custom-item-add .input,
  .journalit-settings-tab .custom-options-settings .custom-item-add input {
    width: 100% !important;
    height: 34px !important;
    max-height: 34px !important;
    padding: 6px 10px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    font-size: 16px !important;
    box-shadow: none !important;
    transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
    line-height: normal !important;
    min-height: 34px !important;
    display: inline-block !important;
    appearance: none !important;
    overflow: visible !important;
  }

  .journalit-settings-tab .drc-settings .custom-item-add .input:focus,
  .journalit-settings-tab .drc-settings .custom-item-add input:focus,
  .journalit-settings-tab .weekly-review-settings .custom-item-add .input:focus,
  .journalit-settings-tab .weekly-review-settings .custom-item-add input:focus {
    border-color: var(--interactive-accent) !important;
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2) !important;
    outline: none !important;
  }

  
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .drc-settings .custom-item-add .inputContainer,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .drc-settings .custom-item-add .inputWrapper,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .weekly-review-settings .custom-item-add .inputContainer,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .weekly-review-settings .custom-item-add .inputWrapper {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    position: relative !important;
    display: block !important;
    height: 34px !important;
  }

  
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .drc-settings .custom-item-add div,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .drc-settings .custom-item-add .setting-item-info div,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .weekly-review-settings .custom-item-add div,
  body .vertical-tab-header .vertical-tab-content-container .vertical-tab-content .journalit-settings-tab .weekly-review-settings .custom-item-add .setting-item-info div {
    height: auto !important;
    min-height: 34px !important;
    width: 100% !important;
    position: relative !important;
  }

  .journalit-settings-tab .drc-settings .custom-item-add .inputContainer,
  .journalit-settings-tab .weekly-review-settings .custom-item-add .inputContainer {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    position: relative !important;
    display: block !important;
  }

  .journalit-settings-tab .drc-settings .custom-item-add .setting-item-info,
  .journalit-settings-tab .weekly-review-settings .custom-item-add .setting-item-info {
    margin-right: 10px !important;
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }

  
  .journalit-settings-tab .drc-settings .custom-item-add .setting-item-control,
  .journalit-settings-tab .weekly-review-settings .custom-item-add .setting-item-control {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    min-width: auto !important;
    flex-shrink: 0 !important;
  }

  
  .journalit-settings-tab .drc-settings .custom-item-add button,
  .journalit-settings-tab .weekly-review-settings .custom-item-add button {
    min-width: 60px !important;
    height: 34px !important;
    max-height: 34px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    padding: 6px 12px !important;
    border-radius: 4px !important;
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent, white) !important;
    border: 1px solid var(--interactive-accent) !important;
    cursor: pointer !important;
    transition: background-color 0.15s ease !important;
  }

  .journalit-settings-tab .drc-settings button:hover,
  .journalit-settings-tab .weekly-review-settings button:hover {
    background-color: var(--interactive-accent-hover) !important;
    border-color: var(--interactive-accent-hover) !important;
  }

  
  
  .journalit-settings .drc-settings .custom-item-add input,
  .journalit-settings .weekly-review-settings .custom-item-add input,
  .journalit-settings .custom-options-settings .custom-item-add input,
  
  .journalit-settings input[placeholder="New checklist item"],
  .journalit-settings input[placeholder="New review question"],
  .journalit-settings input[placeholder="New timeframe (e.g., 15M, 5M)"],
  .journalit-settings input[placeholder="New timeframe (e.g., 4H, 1H)"],
  .journalit-settings input[placeholder="New timeframe (e.g., Weekly, Daily)"] {
    height: 34px !important;
    width: 100% !important;
    padding: 6px 10px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    font-size: 16px !important;
    box-shadow: none !important;
    transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
    line-height: normal !important;
    min-height: 34px !important;
    display: inline-block !important;
    appearance: none !important;
    overflow: visible !important;
    margin: 0 !important;
  }

  
  .journalit-settings .drc-settings .custom-item-add input:focus,
  .journalit-settings .weekly-review-settings .custom-item-add input:focus,
  .journalit-settings .custom-options-settings .custom-item-add input:focus,
  .journalit-settings input[placeholder="New checklist item"]:focus,
  .journalit-settings input[placeholder="New review question"]:focus,
  .journalit-settings input[placeholder="New timeframe (e.g., 15M, 5M)"]:focus,
  .journalit-settings input[placeholder="New timeframe (e.g., 4H, 1H)"]:focus,
  .journalit-settings input[placeholder="New timeframe (e.g., Weekly, Daily)"]:focus {
    
    border-color: var(--interactive-accent) !important;
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2) !important;
    outline: none !important;
  }

  
  .journalit-settings .cmdr-accordion {
    margin-bottom: 16px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    overflow: visible; 
    transition: box-shadow 0.2s ease;
  }

  .journalit-settings .cmdr-accordion:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .journalit-settings .cmdr-accordion .cmdr-accordion-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    padding: 12px 16px;
    cursor: pointer;
    background-color: var(--background-secondary);
    transition: background-color 0.15s ease;
  }

  .journalit-settings .cmdr-accordion .cmdr-accordion-header:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-settings .cmdr-accordion .cmdr-accordion-chevron > svg {
    transition: transform 0.3s ease-in-out;
  }

  .journalit-settings .cmdr-accordion .cmdr-accordion-content {
    max-height: none; 
    transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out, margin 0.3s ease-in-out;
    overflow: visible; 
    background-color: var(--background-primary);
    padding: 16px;
  }

  
  .journalit-settings .cmdr-accordion .cmdr-accordion-content .timeframe-manager > .setting-item:first-child,
  .journalit-settings .cmdr-accordion .cmdr-accordion-content .item-manager > .setting-item:first-child,
  .journalit-settings .cmdr-accordion .cmdr-accordion-content > div > .setting-item:first-child,
  .journalit-settings .cmdr-accordion .cmdr-accordion-content > .setting-item:first-child {
    border-top: none !important;
  }

  
  .journalit-settings .cmdr-accordion .cmdr-accordion-content .weekly-review-section {
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    background-color: transparent !important;
  }

  
  .journalit-settings .timeframe-manager .custom-item-add .inputContainer,
  .journalit-settings .timeframe-manager .custom-item-add input {
    height: 34px !important;
    min-height: 34px !important;
    margin: 0 !important;
    width: 100% !important;
  }

  
  .journalit-settings .item-manager .custom-item .setting-item-info {
    min-width: 0;
  }

  .journalit-settings .item-manager .custom-item .inputContainer {
    width: 100%;
  }

  .journalit-settings .item-manager .item-manager-item-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  .journalit-settings .item-manager .item-manager-item-actions .journalit-button {
    white-space: nowrap;
  }

  .journalit-settings .item-manager .item-manager-item-actions .item-manager-move-button {
    min-width: 28px !important;
    width: 28px;
    padding: 5px !important;
    gap: 0 !important;
  }

  
  .journalit-settings .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-chevron > svg {
    transform: rotate(-90deg);
  }

  .journalit-settings .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-content {
    max-height: 0 !important;
    transition: max-height 0.2s ease-out;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    overflow: hidden; 
  }
  
  
  .journalit-settings .edit-account-form.setting-item-container,
  .journalit-settings-tab .edit-account-form.setting-item-container {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    align-items: stretch !important;
  }

  
  .journalit-settings .edit-account-form.setting-item-container .edit-account-buttons,
  .journalit-settings-tab .edit-account-form.setting-item-container .edit-account-buttons {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    margin-top: 16px !important;
    position: relative !important;
  }
  
  .journalit-settings .edit-account-form.setting-item-container .edit-account-buttons .button-group-right,
  .journalit-settings-tab .edit-account-form.setting-item-container .edit-account-buttons .button-group-right {
    display: flex !important;
    gap: 8px !important;
    align-items: center !important;
  }
  
  
  .journalit-settings .accounts-list,
  .journalit-settings-tab .accounts-list {
    display: flex !important;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    width: 100% !important;
  }

  .journalit-settings .account-items,
  .journalit-settings-tab .account-items {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    flex-wrap: nowrap !important;
  }

  .journalit-settings .account-item,
  .journalit-settings-tab .account-item {
    width: 100% !important;
  }

  
  .mt-accounts-list {
    margin-top: 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .mt-account-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid var(--background-modifier-border);
    background-color: var(--background-primary);
  }

  .mt-account-item:last-child {
    border-bottom: none;
  }

  .mt-account-item:hover {
    background-color: var(--background-secondary);
  }

  .mt-account-info {
    flex: 1;
    min-width: 0;
  }

  .mt-account-id {
    font-weight: 600;
    color: var(--text-normal);
    margin-bottom: 4px;
  }

  .mt-account-broker {
    color: var(--text-muted);
    font-size: 0.9em;
    margin-bottom: 4px;
  }

  .mt-account-dates {
    color: var(--text-muted);
    font-size: 0.85em;
  }

  .mt-account-display {
    margin-left: 20px;
    min-width: 250px;
  }

  .mt-account-display .mt-account-action-button.journalit-button {
    min-width: 0 !important;
    height: 28px !important;
    padding: 4px 10px !important;
    font-size: 12px !important;
    margin-top: 8px;
  }

  .mt-account-name {
    display: flex;
    align-items: center;
  }

  .mt-account-name span {
    font-weight: 500;
    color: var(--text-normal);
  }

  .backend-integration__ignored-accounts {
    margin-top: 10px;
  }

  .backend-integration__ignored-accounts .journalit-settings-accordion {
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .backend-integration__ignored-accounts .journalit-settings-accordion__header {
    min-height: 34px;
    padding: 7px 12px;
    background: var(--background-secondary);
  }

  .backend-integration__ignored-accounts .mt-accounts-list {
    margin-top: 0;
    border: none;
    border-radius: 0;
  }

  .backend-integration__ignored-accounts .mt-accounts-list .setting-item {
    border: none;
    padding: 12px 14px;
  }

  .mt-account-edit {
    display: flex;
    align-items: center;
  }

  .mt-account-edit input {
    background-color: var(--background-primary-alt);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    padding: 4px 6px;
    color: var(--text-normal);
  }

  .mt-account-edit input:focus {
    border-color: var(--interactive-accent);
    outline: none;
  }

  
  
  .journalit-settings .setting-item-control,
  .journalit-settings-tab .setting-item-control {
    min-width: 120px !important;
    width: fit-content !important;
    flex-shrink: 0 !important;
  }

  .journalit-settings .setting-item-control select,
  .journalit-settings .setting-item-control .selectContainer,
  .journalit-settings .setting-item-control .select,
  .journalit-settings-tab .setting-item-control select,
  .journalit-settings-tab .setting-item-control .selectContainer,
  .journalit-settings-tab .setting-item-control .select {
    width: auto !important;
    min-width: 120px !important;
    text-align: center !important;
  }

  
  .journalit-settings select option {
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings select option:hover {
    background-color: var(--background-modifier-hover) !important;
  }

  
  .journalit-settings .inputContainer {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .journalit-settings .input,
  .journalit-settings textarea.input {
    width: 100% !important;
    padding: 8px 12px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    font-size: 14px !important;
    font-family: inherit !important;
    resize: vertical !important;
  }

  .journalit-settings .input:focus,
  .journalit-settings textarea.input:focus {
    border-color: var(--interactive-accent) !important;
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2) !important;
    outline: none !important;
  }

  
  .journalit-settings .journalit-button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 4px !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease !important;
    gap: 8px !important;
    user-select: none !important;
    outline: none !important;
    min-width: 80px !important;
  }

  
  .journalit-settings .journalit-button--small {
    padding: 6px 12px !important;
    font-size: 13px !important;
    height: 32px !important;
  }

  .journalit-settings .journalit-button--medium {
    padding: 8px 16px !important;
    font-size: 14px !important;
    height: 36px !important;
  }

  .journalit-settings .journalit-button--large {
    padding: 12px 24px !important;
    font-size: 16px !important;
    height: 44px !important;
  }

  
  .journalit-settings .journalit-button--primary {
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent, white) !important;
    border: 1px solid var(--interactive-accent) !important;
  }

  .journalit-settings .journalit-button--primary:hover:not(:disabled) {
    background-color: var(--interactive-accent-hover) !important;
    border-color: var(--interactive-accent-hover) !important;
  }

  .journalit-settings .journalit-button--secondary {
    background-color: var(--background-secondary) !important;
    color: var(--text-normal) !important;
    border: 1px solid var(--background-modifier-border) !important;
  }

  .journalit-settings .journalit-button--secondary:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
  }

  .journalit-settings .journalit-button--danger {
    background-color: var(--background-modifier-error) !important;
    color: var(--text-on-accent, white) !important;
    border: 1px solid var(--background-modifier-error) !important;
  }

  .journalit-settings .journalit-button--danger:hover:not(:disabled) {
    opacity: 0.9 !important;
  }

  .journalit-settings .journalit-button:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  
  .journalit-settings .account-profile-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 20px 0;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--background-modifier-border);
    background: transparent;
    border-radius: 0;
    gap: 16px;
  }

  .journalit-settings .account-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .journalit-settings .account-email-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .journalit-settings .account-email {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-normal);
  }

  .journalit-settings .tier-badge {
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
    border: 1px solid transparent;
  }

  
  .journalit-settings .tier-badge.tier-pro,
  .journalit-settings .tier-badge.tier-premium {
    background: rgba(var(--interactive-accent-rgb, 0, 200, 100), 0.15);
    color: var(--interactive-accent);
    border-color: var(--interactive-accent);
  }

  .journalit-settings .tier-badge.tier-enterprise {
    background: rgba(var(--interactive-accent-rgb, 0, 200, 100), 0.2);
    color: var(--interactive-accent);
    border-color: var(--interactive-accent);
    font-weight: 700;
  }

  .journalit-settings .tier-badge.tier-free {
    background: var(--background-secondary);
    color: var(--text-muted);
    border-color: var(--background-modifier-border);
  }

  .journalit-settings .tier-badge.tier-unknown {
    background: var(--background-secondary);
    color: var(--text-faint);
    border-color: var(--background-modifier-border);
  }

  .journalit-settings .account-status {
    font-size: 12px;
    font-weight: 400;
  }

  .journalit-settings .account-status.online {
    color: var(--color-green);
  }

  .journalit-settings .account-status.offline {
    color: var(--text-muted);
  }

  
  .journalit-settings .sign-out-inline.journalit-button--danger {
    background-color: transparent !important;
    color: var(--text-muted) !important;
    border: 1px solid var(--background-modifier-border) !important;
    font-size: 13px !important;
    padding: 6px 14px !important;
    height: auto !important;
    flex-shrink: 0;
    transition: all 0.15s ease !important;
  }

  .journalit-settings .sign-out-inline.journalit-button--danger:hover:not(:disabled) {
    background-color: var(--background-modifier-error) !important;
    color: var(--text-on-accent, white) !important;
    border-color: var(--background-modifier-error) !important;
  }

  .journalit-settings .sign-in-inline.journalit-button--primary {
    font-size: 13px !important;
    padding: 6px 14px !important;
    height: auto !important;
    flex-shrink: 0;
  }

  .journalit-settings .auth-error-panel {
    border: 1px solid var(--background-modifier-border);
    background: var(--background-secondary);
    border-left: 3px solid var(--background-modifier-error);
    border-radius: 6px;
    padding: 12px 14px;
    margin: 16px 0 20px;
  }

  .journalit-settings .auth-error-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-normal);
    margin-bottom: 8px;
  }

  .journalit-settings .auth-error-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .journalit-settings .auth-error-help {
    margin-top: 10px;
    font-size: 12px;
    color: var(--text-muted);
  }

  .journalit-settings .auth-error-help-content {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .journalit-settings .auth-error-help-icon {
    color: var(--text-faint);
  }

  
  .journalit-settings .account-section {
    margin-bottom: 24px;
  }

  .journalit-settings .section-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .journalit-settings .section-header {
    font-size: 11px;
    text-transform: uppercase;
    color: var(--text-muted);
    letter-spacing: 0.6px;
    font-weight: 600;
    margin-bottom: 0;
  }

  
  .journalit-settings .section-header-row .manage-subscription-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    text-decoration: none;
    transition: all 0.15s ease;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid var(--background-modifier-border);
    background: var(--background-secondary);
  }

  .journalit-settings .section-header-row .manage-subscription-link:hover {
    color: var(--interactive-accent);
    border-color: var(--interactive-accent);
    gap: 6px;
  }

  
  .journalit-settings .plan-features-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .journalit-settings .feature-tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    font-size: 12px;
    color: var(--text-muted);
  }

  .journalit-settings .feature-tag::before {
    content: "✓";
    margin-right: 6px;
    color: var(--color-green);
    font-weight: 600;
  }

  .journalit-settings .feature-tag--locked {
    border-style: dashed;
    color: var(--text-faint);
    background: var(--background-primary);
  }

  .journalit-settings .feature-tag--locked::before {
    content: "PRO";
    color: var(--text-faint);
    font-weight: 600;
  }

  

  .ftp-credentials-section {
    padding: 8px 0;
  }

  .ftp-credentials-section h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 600;
  }

  .ftp-credentials-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 16px;
  }

  .ftp-credential-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ftp-credential-field label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .ftp-readonly-input {
    flex: 0 1 auto;
    width: auto;
    min-width: 200px;
    max-width: 320px;
    padding: 8px 12px;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    color: var(--text-normal);
    font-family: var(--font-monospace);
    font-size: 13px;
  }

  .ftp-credentials-section .input-with-action {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ftp-credentials-section .clickable-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--text-muted);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .ftp-credentials-section .clickable-icon:hover:not(:disabled) {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .ftp-credentials-section .clickable-icon:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ftp-info-message {
    margin-bottom: 16px;
    padding: 12px;
    background: var(--background-secondary);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text-muted);
  }


  .ftp-reset-password {
    margin-top: 24px;
    margin-bottom: 16px;
  }

  .ftp-reset-password-button {
    width: auto;
  }

  .ftp-reset-hint {
    margin-top: 10px;
    font-size: 14px;
    color: var(--text-muted);
  }

  .ftp-setup-instructions {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--background-modifier-border);
  }

  .ftp-setup-instructions h4 {
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
  }

  .ftp-setup-instructions ol {
    margin: 0;
    padding-left: 20px;
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-muted);
  }

  .ftp-setup-instructions li {
    margin-bottom: 8px;
  }

  .ftp-password-notice {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    font-size: 11px;
    color: var(--text-muted);
  }

  

  
  .backend-integration-settings .trade-sync-header {
    margin-bottom: 24px;
  }

  .backend-integration-settings .trade-sync-header h3 {
    margin-bottom: 8px;
  }

  .backend-integration-settings .journalit-trade-sync-source-switcher {
    display: flex;
    width: fit-content;
    gap: 4px;
    margin: 0 auto 8px;
    padding: 3px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background: var(--background-secondary);
  }

  .backend-integration-settings .journalit-trade-sync-source {
    padding: 6px 12px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 600;
    box-shadow: none;
    cursor: pointer;
  }

  .backend-integration-settings .journalit-trade-sync-source:hover {
    color: var(--text-normal);
    background: var(--background-modifier-hover);
  }

  .backend-integration-settings .journalit-trade-sync-source.is-active {
    color: var(--text-on-accent);
    background: var(--interactive-accent);
  }

  .backend-integration-settings .journalit-trade-sync-source-description {
    max-width: 520px;
    margin: 0 auto 18px;
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.45;
    text-align: center;
  }

  .backend-integration-settings .journalit-trade-import-sync-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin: 16px 0;
  }

  .backend-integration-settings .journalit-trade-import-sync-toolbar label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted);
    font-size: 12px;
  }

  .backend-integration-settings .journalit-trade-import-sync-toolbar select {
    min-width: 180px;
  }

  .backend-integration-settings .journalit-trade-import-sync-card-subtext {
    margin-top: 6px;
    color: var(--text-muted);
    font-size: 12px;
    text-align: center;
  }

  .backend-integration-settings .journalit-trade-import-sync-pending {
    margin: 14px 0;
    color: var(--text-accent);
    font-size: 12px;
    font-weight: 600;
  }

  .backend-integration-settings .journalit-trade-import-sync-placeholder {
    margin-top: 16px;
    padding: 14px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background: var(--background-primary);
    color: var(--text-muted);
    font-size: 13px;
    text-align: center;
  }

  .backend-integration-settings .journalit-trade-import-account-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .backend-integration-settings .journalit-trade-import-account-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 10px;
    background: var(--background-primary);
  }

  .backend-integration-settings .journalit-trade-import-account-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__header div {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__header span {
    color: var(--text-muted);
    font-size: 12px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__count {
    padding: 3px 7px;
    border-radius: 999px;
    background: var(--background-modifier-hover);
    color: var(--text-accent) !important;
    font-size: 11px !important;
    font-weight: 700;
    white-space: nowrap;
  }

  .backend-integration-settings .journalit-trade-import-account-card__metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__metrics span {
    padding: 3px 7px;
    border-radius: 6px;
    background: var(--background-secondary);
    color: var(--text-muted);
    font-size: 11px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__mapping label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: var(--text-muted);
    font-size: 12px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__mapping select {
    width: 100%;
  }

  .backend-integration-settings .journalit-trade-import-account-card__mapping small {
    display: block;
    margin-top: 6px;
    color: var(--text-faint);
    font-size: 11px;
    line-height: 1.35;
  }

  .backend-integration-settings .journalit-trade-import-account-card__actions {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .backend-integration-settings .journalit-trade-import-account-card__actions button {
    justify-content: center;
  }

  .backend-integration-settings .journalit-trade-import-account-card__actions button:disabled {
    border-color: var(--background-modifier-border);
    background: var(--background-secondary);
    color: var(--text-faint);
    opacity: 0.75;
    cursor: not-allowed;
  }

  .backend-integration-settings .journalit-trade-import-sync-recovery {
    padding: 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background: var(--background-primary);
  }

  .backend-integration-settings .journalit-trade-import-sync-recovery-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }

  .backend-integration-settings .journalit-trade-import-sync-recovery-header strong {
    margin-right: auto;
  }

  .backend-integration-settings .journalit-trade-import-sync-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 6px;
    max-height: 260px;
    overflow: auto;
  }

  .backend-integration-settings .journalit-trade-import-sync-list label {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 6px;
    background: var(--background-secondary);
    font-size: 12px;
  }

  .backend-integration-settings .journalit-trade-import-sync-list small {
    color: var(--text-muted);
  }

  .backend-integration-settings .backend-integration__button-content {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }

  .backend-integration-settings .backend-integration__sync-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .backend-integration-settings .backend-integration__connection-error {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-error);
    margin-top: 4px;
  }

  .backend-integration-settings .backend-integration__loading {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .backend-integration-settings .backend-integration__account-linking-divider {
    margin-top: 30px;
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 20px;
  }

  .backend-integration-settings .account-linking-source-select {
    width: 350px;
    max-width: 100%;
  }

  .backend-integration-settings .account-linking-target-select {
    width: 250px;
    max-width: 100%;
  }

  .backend-integration-settings .backend-integration__sync-error-panel {
    margin-top: 4px;
    padding: 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background: var(--background-secondary);
  }

  .backend-integration-settings .backend-integration__sync-error-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-error);
  }

  .backend-integration-settings .backend-integration__sync-error-list {
    margin: 8px 0 0 18px;
    padding: 0;
    font-size: 12px;
    color: var(--text-normal);
  }

  .backend-integration-settings .backend-integration__sync-error-more {
    margin-top: 6px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .backend-integration-settings .backend-integration__sync-error-request {
    margin-top: 8px;
    font-size: 12px;
    color: var(--text-error);
  }

  .backend-integration-settings .backend-integration__sync-error-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  .backend-integration-settings .backend-integration__sync-discord-help {
    margin-top: 8px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .backend-integration-settings .backend-integration__sync-discord-help-content {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .backend-integration-settings .backend-integration__sync-discord-help-icon {
    color: var(--text-faint);
  }

  
  .setup-progress {
    margin-bottom: 20px;
    padding: 12px 16px;
    background: var(--background-secondary);
    border-radius: 8px;
    border: 1px solid var(--background-modifier-border);
  }

  .setup-progress-header {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  .setup-progress-steps {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
  }

  .setup-step {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 14px;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    flex: 1;
    min-width: 120px;
    max-width: calc(50% - 4px);
  }

  .setup-step:hover:not(:disabled) {
    border-color: var(--interactive-accent);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .setup-step:disabled {
    cursor: default;
  }

  .setup-step--completed {
    border-color: var(--background-modifier-border);
    background: var(--background-primary);
    opacity: 0.85;
  }

  .setup-step--current {
    border-color: var(--interactive-accent);
    background: rgba(var(--interactive-accent-rgb), 0.08);
    box-shadow: 0 0 0 1px var(--interactive-accent);
  }

  .setup-step--current .setup-step-indicator {
    background: var(--interactive-accent);
    color: var(--text-on-accent, white);
  }

  .setup-step--completed .setup-step-indicator {
    background: transparent;
    color: var(--color-green);
    border: 1px solid var(--color-green);
  }

  .setup-step--pending {
    opacity: 0.7;
  }

  .setup-step--pending .setup-step-indicator {
    background: var(--background-primary);
    color: var(--text-muted);
    border: 2px solid var(--background-modifier-border);
  }

  .setup-step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    flex-shrink: 0;
    font-size: 11px;
    transition: all 0.2s ease;
  }

  .setup-step-content {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .setup-step-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-normal);
  }

  .setup-step-description {
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.4;
    margin-top: 2px;
  }

  
  .setup-step-connector {
    display: none;
  }

  
  .status-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .status-card {
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .status-card:hover {
    border-color: var(--background-modifier-border-hover);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .status-card--connected {
    border-color: var(--background-modifier-border);
    background: var(--background-primary);
  }

  .status-card--disconnected {
    border-color: var(--background-modifier-error);
    background: rgba(var(--background-modifier-error-rgb, 255, 0, 0), 0.04);
  }

  .status-card--unknown {
    border-color: var(--text-muted);
  }

  .status-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }

  .status-card-content {
    flex: 1;
    margin-bottom: 12px;
  }

  .status-card-value {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    color: var(--text-normal);
  }

  .status-card-metric {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .status-card-metric--large {
    align-items: center;
    text-align: center;
    padding: 8px 0;
  }

  .metric-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-normal);
  }

  .metric-value--large {
    font-size: 32px;
    font-weight: 700;
    color: var(--interactive-accent);
    line-height: 1;
  }

  .metric-label {
    font-size: 12px;
    color: var(--text-muted);
  }

  .status-card-actions {
    margin-top: auto;
  }

  .status-card-actions .journalit-button {
    width: 100%;
    justify-content: center;
  }

  
  .status-icon {
    flex-shrink: 0;
  }

  .status-icon--success {
    color: var(--color-green);
  }

  .status-icon--error {
    color: var(--background-modifier-error);
  }

  .status-icon--pending {
    color: var(--text-muted);
  }

  
  @keyframes journalit-settings-icon-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .journalit-settings .status-card-action-icon,
  .journalit-settings .spinning {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-size, 14px);
    height: var(--icon-size, 14px);
    line-height: 0;
    flex: 0 0 var(--icon-size, 14px);
  }

  .journalit-settings .status-card-action-icon svg,
  .journalit-settings .spinning svg {
    display: block;
  }

  .journalit-settings .spinning svg {
    animation: journalit-settings-icon-spin 1s linear infinite;
    transform-box: view-box;
    transform-origin: center;
  }

  
  .custom-options-asset-select {
    width: 120px;
  }

  .custom-options-spec-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 8px;
    padding: 8px;
    background-color: var(--background-secondary);
    border-radius: 4px;
    text-align: left;
  }

  .custom-options-spec-grid > div {
    text-align: left;
    justify-self: stretch;
    width: 100%;
  }

  .custom-options-spec-label {
    font-size: 11px;
    color: var(--text-muted);
    display: block;
    margin-bottom: 4px;
    text-align: left;
  }

  .custom-options-cfd-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
    gap: 8px;
    margin-top: 8px;
    padding: 8px;
    background-color: var(--background-secondary);
    border-radius: 4px;
    align-items: end;
    text-align: left;
    justify-content: start;
  }

  .custom-options-cfd-row > div {
    text-align: left;
    justify-self: start;
    width: 100%;
  }

  .custom-options-cfd-actions {
    align-self: end;
    justify-self: end;
    margin-top: 0;
    white-space: nowrap;
    width: auto;
    text-align: right;
  }

  @media (max-width: 900px) {
    .custom-options-cfd-row {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .custom-options-cfd-actions {
      grid-column: 1 / -1;
      justify-self: end;
    }
  }

  .custom-options-spec-preview {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .custom-options-spec-built-in {
    margin-left: 4px;
    font-style: italic;
    color: var(--text-faint);
  }

  .journalit-settings-tab .custom-options-commission-section {
    container-type: inline-size;
    margin-top: 8px;
    padding: 8px;
    background-color: var(--background-secondary);
    border-radius: 4px;
    text-align: left;
  }

  .journalit-settings-tab .custom-options-commission-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 600;
    text-align: left;
  }

  .journalit-settings-tab .custom-options-commission-table {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .journalit-settings-tab .custom-options-commission-rule {
    display: grid;
    gap: 8px;
    align-items: end;
    width: 100%;
    box-sizing: border-box;
  }

  .journalit-settings-tab .custom-options-commission-rule--perSide {
    grid-template-columns: minmax(120px, 1fr) minmax(178px, 1.1fr) minmax(68px, 0.5fr) minmax(68px, 0.5fr) 28px;
  }

  .journalit-settings-tab .custom-options-commission-rule--roundTrip {
    grid-template-columns: minmax(120px, 1fr) minmax(178px, 1.1fr) minmax(68px, 0.5fr) minmax(68px, 0.5fr) 28px;
  }

  .journalit-settings-tab .custom-options-commission-rule--roundTrip .custom-options-commission-field--round-trip {
    grid-column: 3 / 5;
  }

  .journalit-settings-tab .custom-options-commission-field {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .journalit-settings-tab .custom-options-commission-field > span {
    display: block;
    color: var(--text-muted);
    font-size: 11px;
    line-height: 1.2;
    text-align: left;
  }

  .journalit-settings-tab .custom-options-commission-table input,
  .journalit-settings-tab .custom-options-commission-table select {
    min-width: 0;
    width: 100%;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown {
    position: relative;
    min-width: 0;
    width: 100%;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    min-width: 0;
    width: 100%;
    min-height: 30px;
    padding: 4px 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__summary {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__chevron {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__chevron--open {
    transform: rotate(180deg);
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    min-width: 100%;
    max-width: 280px;
    max-height: min(300px, 50vh);
    overflow-y: auto;
    margin-top: 4px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__option {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 6px 10px;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    color: var(--text-normal);
    cursor: pointer;
    font-size: 13px;
    text-align: left;
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__option:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__option--active {
    color: var(--text-normal);
  }

  .journalit-settings-tab .custom-options-commission-account-dropdown__option-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-options-commission-method-toggle {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-width: 0;
    width: 100%;
    overflow: hidden;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background-color: var(--background-secondary);
  }

  .journalit-settings-tab .custom-options-commission-method-button {
    min-width: 0;
    width: 100%;
    min-height: 30px;
    padding: 4px 8px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    background-color: transparent;
    color: var(--text-muted);
    font-size: 12px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-options-commission-method-button + .custom-options-commission-method-button {
    border-left: 1px solid var(--background-modifier-border);
  }

  .journalit-settings-tab .custom-options-commission-method-button[aria-checked="true"] {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-settings-tab .custom-options-commission-method-button:hover {
    background-color: var(--interactive-hover);
    color: var(--text-normal);
  }

  .journalit-settings-tab .custom-options-commission-method-button[aria-checked="true"]:hover {
    background-color: var(--interactive-accent-hover);
    color: var(--text-on-accent);
  }

  .journalit-settings-tab .custom-options-compact-icon-button,
  .journalit-settings-tab .journalit-no-tooltip-button,
  .journalit-settings-tab .journalit-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    min-width: 28px;
    margin: 0;
    padding: 5px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.2s ease;
    line-height: 1;
  }

  .journalit-settings-tab .journalit-no-tooltip-button:hover,
  .journalit-settings-tab .journalit-icon-button:hover,
  .journalit-settings-tab .custom-options-compact-icon-button:hover {
    background-color: var(--background-modifier-hover);
    border-color: var(--interactive-accent);
    color: var(--text-normal);
  }

  .journalit-settings-tab .journalit-no-tooltip-button svg,
  .journalit-settings-tab .journalit-icon-button svg,
  .journalit-settings-tab .custom-options-compact-icon-button svg {
    width: 16px;
    height: 16px;
  }

  .journalit-settings-tab .journalit-no-tooltip-button > span,
  .journalit-settings-tab .journalit-icon-button > span,
  .journalit-settings-tab .custom-options-compact-icon-button > span {
    --icon-size: 16px;
  }

  .journalit-settings-tab .journalit-no-tooltip-button + .journalit-no-tooltip-button,
  .journalit-settings-tab .journalit-icon-button + .journalit-icon-button,
  .journalit-settings-tab .custom-options-compact-icon-button + .custom-options-compact-icon-button {
    margin-left: 8px;
  }

  .journalit-settings-tab .custom-options-commission-rule > .journalit-no-tooltip-button {
    width: 28px;
    height: 28px;
    min-width: 28px;
    padding: 4px;
  }

  @container (max-width: 520px) {
    .journalit-settings-tab .custom-options-commission-header {
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .journalit-settings-tab .custom-options-commission-header .journalit-button {
      width: auto;
      min-height: 32px;
      padding: 4px 10px;
      margin-left: auto;
    }

    .journalit-settings-tab .custom-options-commission-rule {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 28px;
      padding: 8px;
      border: 1px solid var(--background-modifier-border);
      border-radius: 6px;
      background-color: var(--background-primary);
    }

    .journalit-settings-tab .custom-options-commission-field--account {
      grid-column: 1 / 3;
    }

    .journalit-settings-tab .custom-options-commission-field--method {
      grid-column: 1 / 3;
    }

    .journalit-settings-tab .custom-options-commission-method-button {
      min-height: 32px;
    }

    .journalit-settings-tab .custom-options-commission-field--entry {
      grid-column: 1;
    }

    .journalit-settings-tab .custom-options-commission-field--exit {
      grid-column: 2;
    }

    .journalit-settings-tab .custom-options-commission-field--round-trip {
      grid-column: 1 / 3;
    }

    .journalit-settings-tab .custom-options-commission-rule > .journalit-no-tooltip-button {
      grid-column: 3;
      grid-row: 1;
      align-self: start;
      justify-self: end;
      margin-top: 16px;
      width: 28px;
      height: 28px;
      min-width: 28px;
      padding: 4px;
    }
  }

  @container (max-width: 360px) {
    .journalit-settings-tab .custom-options-commission-rule {
      grid-template-columns: minmax(0, 1fr) 28px;
    }

    .journalit-settings-tab .custom-options-commission-field--account,
    .journalit-settings-tab .custom-options-commission-field--method,
    .journalit-settings-tab .custom-options-commission-field--entry,
    .journalit-settings-tab .custom-options-commission-field--exit,
    .journalit-settings-tab .custom-options-commission-field--round-trip {
      grid-column: 1 / -1;
    }

    .journalit-settings-tab .custom-options-commission-rule > .journalit-no-tooltip-button {
      grid-column: 2;
      grid-row: 1;
      margin-top: 16px;
    }
  }

  .custom-options-mapped-message {
    font-size: 11px;
    color: var(--text-accent);
    margin-top: 4px;
    font-style: italic;
  }

  .custom-options-spec-empty {
    font-size: 11px;
    color: var(--text-faint);
    margin-top: 4px;
    font-style: italic;
  }

  .custom-options-color-picker {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding: 8px;
    width: fit-content;
    max-width: 100%;
    background-color: var(--background-secondary);
    border-radius: 4px;
  }

  .custom-options-color-picker--compact {
    margin-top: 0;
    padding: 6px 8px;
    gap: 6px;
  }

  .custom-options-color-label {
    font-size: 12px;
    color: var(--text-muted);
  }

  .custom-options-color-option {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    cursor: pointer;
    padding: 4px;
    background-color: transparent;
    border: 2px solid transparent;
  }

  .custom-options-color-option--selected {
    background-color: var(--background-modifier-hover);
    border-color: var(--interactive-accent);
  }

  .custom-options-color-swatch {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid var(--background-modifier-border);
  }

  .custom-options-color-swatch--gray {
    background-color: var(--text-muted);
  }

  .custom-options-color-swatch--red {
    background-color: var(--color-red, red);
  }

  .custom-options-color-swatch--orange {
    background-color: var(--color-warning, orange);
  }

  .custom-options-color-swatch--yellow {
    background-color: var(--color-warning-light, #ffb74d);
  }

  .custom-options-name-row {
    display: flex;
    align-items: center;
  }

  .custom-options-name-row--gap {
    gap: 6px;
  }

  .custom-options-asset-tag {
    display: inline-block;
    margin-left: 8px;
    font-size: 12px;
    color: var(--text-muted);
    padding: 2px 6px;
    border-radius: 4px;
    background-color: var(--background-secondary);
  }

  .custom-options-lock-icon {
    color: var(--text-muted);
    opacity: 0.7;
  }

  .custom-options-locked-label {
    font-size: 11px;
    color: var(--text-muted);
    font-style: italic;
  }

  .custom-options-event-color-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 8px;
    border: 1px solid var(--background-modifier-border);
  }

  .custom-options-event-color-dot--gray {
    background-color: var(--text-muted);
  }

  .custom-options-event-color-dot--red {
    background-color: var(--color-red, red);
  }

  .custom-options-event-color-dot--orange {
    background-color: var(--color-warning, orange);
  }

  .custom-options-event-color-dot--yellow {
    background-color: var(--color-warning-light, #ffb74d);
  }

  
  @media (max-width: 768px) {
    .setup-progress-steps {
      flex-direction: column;
    }

    .setup-step-connector {
      display: none;
    }

    .setup-step {
      width: 100%;
    }

    .status-cards {
      grid-template-columns: 1fr;
    }
  }

  
  @media (max-width: 600px) {
    .journalit-settings-tab input[type="text"],
    .journalit-settings-tab .custom-item-add input,
    .journalit-settings input,
    .mt-account-edit input {
      font-size: 18px !important;
    }
  }

  @media (max-width: 768px) {
    .journalit-settings .settings-tab-nav {
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 8px;
    }

    .journalit-settings .settings-tab-button {
      margin-right: 0;
    }
  }

  
  .journalit-settings .general-settings .journalit-settings-links {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    align-items: center;
  }

  .journalit-settings .general-settings .journalit-settings-display-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-settings .general-settings .journalit-settings-display-name-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    font-size: 14px;
  }

  .journalit-settings .general-settings .journalit-settings-display-name-button {
    padding: 6px 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    min-width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-settings .general-settings .journalit-settings-display-name-button--confirm {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-settings .general-settings .journalit-settings-display-name-button--cancel {
    background-color: var(--background-modifier-error);
    color: var(--text-normal);
  }

  .journalit-settings .general-settings .journalit-settings-divider {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-settings .general-settings .journalit-settings-divider--compact {
    margin-top: 8px;
    padding-top: 8px;
  }

  .journalit-settings .general-settings .journalit-settings-input {
    padding: 8px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    box-sizing: border-box;
  }

  .journalit-settings .general-settings .journalit-settings-input--compact {
    width: 80px;
  }

  .journalit-settings .general-settings .journalit-settings-input--time {
    width: 120px;
  }

  .journalit-settings .general-settings .journalit-settings-range {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .journalit-settings .general-settings .journalit-settings-muted-text {
    color: var(--text-muted);
  }

  .journalit-settings .general-settings .journalit-settings-text-error {
    color: var(--text-error);
  }

  .journalit-settings .general-settings .journalit-settings-action-button.journalit-button:disabled {
    background-color: var(--background-modifier-border);
    border-color: var(--background-modifier-border);
    color: var(--text-on-accent);
    opacity: 0.6;
  }

  
  .journalit-settings-tab .custom-fields-manager {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-intro {
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.45;
    padding: 2px 4px 4px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-panel,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel,
  .journalit-settings-tab .custom-fields-manager .custom-fields-empty-state,
  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-zone {
    border: 1px solid var(--background-modifier-border);
    border-radius: 12px;
    background: var(--background-secondary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-panel,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel {
    overflow: hidden;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-header,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel-header,
  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-zone {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-header,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel-header {
    border-bottom: 1px solid var(--background-modifier-border);
    background: var(--background-secondary-alt);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-title,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel-title,
  .journalit-settings-tab .custom-fields-manager .custom-fields-empty-title,
  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-zone-title {
    color: var(--text-normal);
    font-size: 14px;
    font-weight: 600;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-description,
  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-panel-description,
  .journalit-settings-tab .custom-fields-manager .custom-fields-empty-description,
  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-zone-description {
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.35;
    margin-top: 3px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-list-meta {
    color: var(--text-muted);
    font-size: 12px;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-list {
    display: flex;
    flex-direction: column;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-groups-list {
    display: flex;
    flex-direction: column;
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-panel {
    border-bottom: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-panel:last-child {
    border-bottom: none;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 54px;
    padding: 10px 12px 10px 16px;
    background: var(--background-secondary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .setting-item-info {
    min-width: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .setting-item-control {
    margin-left: 0;
    flex-shrink: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .setting-item-name {
    color: var(--text-normal);
    font-size: 14px;
    font-weight: 600;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .setting-item-description {
    color: var(--text-muted);
    font-size: 12px;
    margin-top: 2px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .custom-review-field-group-icon-button.journalit-button {
    width: 28px !important;
    min-width: 28px !important;
    max-width: 28px !important;
    height: 28px !important;
    padding: 5px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    gap: 0 !important;
    justify-content: center !important;
    line-height: 1 !important;
    transition: all 0.2s ease !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .custom-review-field-group-icon-button.journalit-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .custom-review-field-group-add-button.journalit-button {
    background-color: var(--interactive-accent) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-on-accent) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-header .custom-review-field-group-add-button.journalit-button:hover:not(:disabled) {
    background-color: var(--interactive-accent-hover) !important;
    border-color: var(--interactive-accent-hover) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-editor {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px 10px 16px;
    border-top: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-editor-label {
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-editor .inputContainer,
  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-editor .inputWrapper,
  .journalit-settings-tab .custom-fields-manager .custom-review-field-group-editor input {
    flex: 1 1 auto;
    min-width: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-empty-group {
    padding: 12px 16px;
    color: var(--text-muted);
    font-size: 12px;
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 56px;
    padding: 10px 12px 10px 16px;
    border-bottom: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item:last-child {
    border-bottom: none;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item:hover {
    background: var(--background-modifier-hover);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item .setting-item-info {
    min-width: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item .setting-item-control {
    margin-left: 0;
    flex-shrink: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item .setting-item-name {
    color: var(--text-normal);
    font-size: 14px;
    font-weight: 600;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-item .setting-item-description {
    color: var(--text-muted);
    font-size: 12px;
    margin-top: 2px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-empty-state {
    padding: 22px 18px;
    text-align: center;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-zone {
    background: transparent;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor {
    padding: 4px 16px 16px;
    background: var(--background-primary);
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:first-child {
    display: none;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item {
    border-top: none;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 12px 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:has(.setting-item-control) {
    border-bottom: none;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:not(:has(.setting-item-control)) {
    border-top: 1px solid var(--background-modifier-border);
    border-bottom: none;
    margin-top: 14px;
    padding: 16px 0 6px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:first-child + .setting-item:not(:has(.setting-item-control)),
  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:first-child + .setting-item {
    border-top: none;
    margin-top: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-field-editor > .setting-item:not(:has(.setting-item-control)) .setting-item-name {
    color: var(--text-faint);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-accordion {
    margin-left: 16px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-accordion-title {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-danger-outline {
    color: var(--text-error);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-field-actions,
  .journalit-settings-tab .custom-fields-manager .custom-fields-reorder-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-settings-tab .option-actions,
  .journalit-settings-tab .item-manager-item-actions {
    gap: 8px;
  }

  .journalit-settings-tab .item-manager-item-actions .item-manager-icon-button.journalit-button,
  .journalit-settings-tab .item-manager-item-actions .item-manager-move-button.journalit-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px !important;
    height: 28px !important;
    min-width: 28px !important;
    padding: 5px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.2s ease !important;
    line-height: 1;
  }

  .journalit-settings-tab .item-manager-item-actions .item-manager-icon-button.journalit-button:hover:not(:disabled),
  .journalit-settings-tab .item-manager-item-actions .item-manager-move-button.journalit-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings-tab .item-manager-item-actions .item-manager-icon-button.journalit-button svg,
  .journalit-settings-tab .item-manager-item-actions .item-manager-move-button.journalit-button svg {
    width: 14px;
    height: 14px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-reorder-button,
  .journalit-settings-tab .custom-fields-manager .custom-fields-edit-button {
    min-width: 28px !important;
    width: 28px !important;
    height: 28px !important;
    padding: 5px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    gap: 0 !important;
    flex: 0 0 28px;
    line-height: 1;
    transition: all 0.2s ease !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-reorder-button:hover:not(:disabled),
  .journalit-settings-tab .custom-fields-manager .custom-fields-edit-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-edit-button svg {
    display: block;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-reorder-button:disabled {
    opacity: 0.35;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-item {
    min-height: auto;
    padding: 4px 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-name {
    font-size: 0.9em;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-button {
    padding: 2px 8px;
    font-size: 0.8em;
    min-width: auto;
  }

  .journalit-settings-tab .custom-review-field-editor .setting-item-control {
    overflow: visible;
  }

  .journalit-settings-tab .custom-review-field-editor .journalit-combobox.combobox-container[data-is-open="true"] {
    z-index: 20010;
  }

  .journalit-settings-tab .custom-review-field-editor .journalit-combobox .combobox-dropdown {
    z-index: 20011;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-fields-option-move-button,
  .journalit-settings-tab .custom-review-field-editor .custom-fields-option-delete-button {
    min-width: 28px !important;
    width: 28px !important;
    height: 28px !important;
    padding: 5px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    gap: 0 !important;
    flex: 0 0 28px;
    line-height: 1;
    transition: all 0.2s ease !important;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-fields-option-move-button:hover:not(:disabled),
  .journalit-settings-tab .custom-review-field-editor .custom-fields-option-delete-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-number-input {
    max-width: 96px;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-review-type-setting {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-review-type-setting .setting-item-info,
  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-review-type-setting .setting-item-control {
    width: 100%;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 8px 14px;
  }

  .journalit-settings-tab .custom-review-field-editor .custom-review-fields-checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-move-button,
  .journalit-settings-tab .custom-fields-manager .custom-fields-option-delete-button {
    min-width: 28px !important;
    width: 28px !important;
    height: 28px !important;
    padding: 5px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    gap: 0 !important;
    flex: 0 0 28px;
    line-height: 1;
    transition: all 0.2s ease !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-move-button:hover:not(:disabled),
  .journalit-settings-tab .custom-fields-manager .custom-fields-option-delete-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-normal) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-delete-button {
    color: var(--text-error);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-option-delete-button svg {
    display: block;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-required-indicator {
    color: var(--text-error);
    margin-left: 4px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-key-preview {
    background-color: var(--background-modifier-border);
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 0.9em;
    color: var(--custom-fields-key-color, var(--text-accent));
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-key-reserved {
    color: var(--text-error);
    margin-left: 8px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-label-control {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-label-error {
    width: 100%;
    color: var(--text-error);
    margin-top: 0;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-label-error code {
    color: inherit;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-checkbox {
    transform: scale(1.2);
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-top: 1px solid var(--background-modifier-border) !important;
    padding-top: 16px !important;
    margin-top: 16px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-primary-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-delete-button,
  .journalit-settings-tab .custom-fields-manager .custom-fields-delete-all-button {
    background-color: var(--background-modifier-error) !important;
    border-color: var(--background-modifier-error) !important;
    color: var(--text-on-accent) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-delete-button:hover,
  .journalit-settings-tab .custom-fields-manager .custom-fields-delete-all-button:hover {
    background-color: var(--text-error) !important;
    border-color: var(--text-error) !important;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-editor-divider {
    border-top: 2px solid var(--background-modifier-border);
    margin-top: 16px;
    padding-top: 16px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-actions {
    justify-content: space-between;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-actions-buttons {
    display: flex;
    gap: 8px;
  }

  .journalit-settings-tab .custom-fields-manager .custom-fields-saved-options {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--background-modifier-border);
  }
`;
