

export const TRADE_FORM_STYLES = `
  
  .trade-form-modal-container .modal-title {
    margin-bottom: 16px;
  }

  .journalit-trade-form-modal {
    padding-bottom: 0 !important;
  }

  
  .trade-form-modal-container {
    max-height: var(--modal-content-height);
    overflow-y: auto;
  }

  
  
  .trade-form-view-container {
    --interactive-accent-rgb: 83, 141, 226;
    --color-error-rgb: 229, 57, 53;
    height: 100% !important;
    overflow-y: auto !important;
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }
  .trade-form-view-container .formContainer {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important; 
    max-width: 800px !important;
    margin: 0 auto !important;
    padding: 16px 20px !important;
    width: 100% !important;
    flex: 1 1 auto !important; 
    min-height: min-content !important; 
    box-sizing: border-box !important; 
  }
  .trade-form-view-container .formSection {
    display: flex !important;
    flex-direction: column !important;
    padding: 0 !important;
    margin: 0 !important; 
    position: relative !important;
  }
  
  
  .trade-form-view-container .formSection + .formSection {
    padding: 0 !important;
    margin: 0 !important;
  }
  .trade-form-view-container .sectionTitle {
    font-size: 18px !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    margin-bottom: 4px !important;
    display: none !important; 
  }
  .trade-form-view-container .minimizedSectionTitle {
    font-size: 16px !important;
    font-weight: 500 !important;
    color: var(--text-muted) !important;
    margin-bottom: 8px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
  }
  .trade-form-view-container .sectionDescription {
    font-size: 16px !important;
    color: var(--text-muted) !important;
    margin-bottom: 16px !important;
    display: none !important; 
  }
  .trade-form-view-container .formTitle {
    font-size: 20px !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    margin-bottom: 8px !important;
  }
  .trade-form-view-container .sectionContent {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important; 
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .trade-form-view-container .field {
    margin: 0 !important; 
    padding: 0 !important; 
  }
  .trade-form-view-container input,
  .trade-form-view-container textarea {
    box-sizing: border-box !important;
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    color: var(--text-normal) !important;
    border-radius: 4px !important;
    padding: 8px 12px !important;
    width: 100% !important;
    font-size: 16px !important;
  }

  
  .trade-form-view-container input.segment-input {
    width: 38px !important;
    min-width: 38px !important;
    max-width: 38px !important;
    padding: 6px 4px !important;
    font-size: 14px !important;
    text-align: center !important;
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
  }

  
  .trade-form-view-container input::placeholder,
  .trade-form-view-container textarea::placeholder {
    color: var(--text-muted) !important;
    opacity: 0.7 !important;
  }
  
  .trade-form-view-container select,
  .trade-form-view-container .journalit-select {
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    color: var(--text-normal) !important;
    border-radius: 4px !important;
    padding: 8px 30px 8px 12px !important; 
    width: 100% !important;
    font-size: 16px !important;
    min-height: 38px !important; 
    line-height: 1.5 !important; 
    text-overflow: ellipsis !important; 
  }

  
  .trade-form-view-container select:invalid,
  .trade-form-view-container select:not([value]),
  .trade-form-view-container select[value=""] {
    color: var(--text-muted) !important;
    opacity: 0.7 !important; 
  }

  
  .trade-form-view-container select[data-has-value="true"] {
    color: var(--text-normal) !important;
    opacity: 1 !important;
  }

  
  .trade-form-view-container select option[value=""][disabled],
  .trade-form-view-container select option:first-child:not([value]),
  .trade-form-view-container select option:first-child[value=""],
  .trade-form-view-container .select-placeholder,
  .trade-form-view-container option.select-placeholder {
    color: var(--text-muted) !important;
    opacity: 0.7 !important;
  }

  
  .trade-form-view-container select option:not([value=""]):not(:disabled),
  .trade-form-view-container select option:not(.select-placeholder),
  .trade-form-view-container select option:checked {
    color: var(--text-normal) !important;
    opacity: 1 !important;
  }
  
  .trade-form-view-container input[type="date"] {
    padding-left: 35px !important; 
    padding-right: 15px !important;
    min-width: 150px !important; 
  }
  
  .trade-form-view-container input[type="time"] {
    padding-left: 35px !important; 
    padding-right: 15px !important;
    min-width: 110px !important; 
  }
  
  .trade-form-view-container input[type="date"]::-webkit-calendar-picker-indicator,
  .trade-form-view-container input[type="time"]::-webkit-calendar-picker-indicator {
    position: absolute !important;
    left: 10px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    margin: 0 !important;
    z-index: 2 !important; 
  }
  
  .trade-form-view-container input[type="date"],
  .trade-form-view-container input[type="time"] {
    position: relative !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    background-image: var(--calendar-icon, initial) !important;
    background-repeat: no-repeat !important;
    background-position: 10px center !important;
  }
  
  .trade-form-view-container input[type="date"] {
    
  }
  
  .trade-form-view-container input[type="time"] {
    
  }
  
  @-moz-document url-prefix() {
    .trade-form-view-container input[type="date"],
    .trade-form-view-container input[type="time"] {
      position: relative !important;
      background-position: 10px center !important;
    }
  }
  
  .trade-form-view-container {
    overflow-y: auto !important; 
    max-height: 100vh !important; 
  }
  
  
  .modal .trade-form-view-container,
  .modal-content .trade-form-view-container {
    height: auto !important;
    max-height: none !important;
    overflow: visible !important; 
  }
  
  #trade-form-root {
    height: 100% !important;
    min-height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    flex: 1 1 auto !important;
  }
  
  .trade-form-view-container .formContainer {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    position: relative !important;
    min-height: min-content !important;
    height: auto !important; 
    flex: 1 1 auto !important;
    overflow: visible !important; 
  }
  
  .trade-form-view-container .formHeader {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }

  
  .trade-form-view-container > div, 
  .trade-form-view-container > form > div {
    margin-bottom: 0 !important;
  }

  
  .trade-form-view-container .formHeader + div,
  .trade-form-view-container .formHeader + .formSection {
    margin-top: 0 !important;
  }

  
  .trade-form-view-container .formTitle + .formSection,
  .trade-form-view-container .formHeader + .formSection,
  .trade-form-view-container .errorSummary + .formSection {
    margin-top: 12px !important;
  }

  .trade-form-view-container .setup-create-confirmations {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    margin-top: 6px !important;
  }

  .trade-form-view-container .setup-create-confirmation-button {
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 999px !important;
    background: var(--background-secondary) !important;
    color: var(--text-normal) !important;
    cursor: pointer !important;
    font-size: 12px !important;
    padding: 4px 10px !important;
  }

  .trade-form-view-container .setup-create-confirmation-button:hover {
    background: var(--background-modifier-hover) !important;
  }

  
  .trade-form-view-container .combobox-container,
  .trade-form-view-container [data-combobox-type] {
    position: relative !important;
    width: 100% !important;
    margin-bottom: 8px !important;
    
    z-index: 10 !important;
  }

  
  .trade-form-view-container [data-is-open="true"] {
    z-index: 9999 !important;
  }

  
  .trade-form-view-container [data-combobox-type] > .input-container {
    position: relative !important;
    margin: 0 !important;
    padding: 0 !important;
    
    z-index: 1 !important;
  }

  
  .trade-form-view-container .selected-item {
    display: inline-flex !important;
    align-items: center !important;
    margin: 0 4px 4px 0 !important;
    padding: 4px 8px !important;
    background-color: var(--interactive-accent) !important;
    color: white !important;
    border-radius: 4px !important;
    font-size: 12px !important;
    gap: 6px !important;
  }

  .trade-form-view-container .selected-item button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 16px !important;
    height: 16px !important;
    min-width: 16px !important; 
    min-height: 16px !important; 
    padding: 0 !important;
    background: rgba(255, 255, 255, 0.2) !important; 
    border: none !important;
    color: white !important;
    font-size: 16px !important;
    line-height: 1 !important;
    cursor: pointer !important;
    border-radius: 50% !important; 
    margin-left: 4px !important;
    position: relative !important; 
    z-index: 5 !important; 
    transition: background-color 0.2s !important;
  }

  .trade-form-view-container .selected-item button:hover {
    background: rgba(255, 255, 255, 0.4) !important; 
  }

  .trade-form-view-container [data-combobox-type] > div:nth-child(2) {
    position: relative !important;
    width: 100% !important;
  }
  
  .trade-form-view-container [data-combobox-type] .input-container::after {
    content: "" !important;
    position: absolute !important;
    right: 12px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    width: 0 !important;
    height: 0 !important;
    border-left: 5px solid transparent !important;
    border-right: 5px solid transparent !important;
    border-top: 5px solid var(--text-normal) !important;
    pointer-events: none !important;
    z-index: 10 !important;
  }
  
  .trade-form-view-container [data-combobox-type][data-is-open="true"] .input-container::after {
    transform: translateY(-50%) rotate(180deg) !important;
  }
  .trade-form-view-container [data-combobox-type] input[role="combobox"] {
    width: 100% !important;
    padding: 8px 12px !important;
    padding-right: 30px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    font-size: 16px !important;
    cursor: pointer !important;
  }
  
  .trade-form-view-container [data-combobox-type][data-is-open="true"] input[role="combobox"] {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
  .trade-form-view-container [data-combobox-type] input[role="combobox"]:focus {
    border-color: var(--interactive-accent) !important;
    box-shadow: 0 0 0 2px rgba(83, 141, 226, 0.3) !important;
    outline: none !important;
  }
  
  .trade-form-view-container [data-combobox-type] ul[role="listbox"] {
    position: absolute !important;
    top: 38px !important; 
    left: 0 !important;
    right: 0 !important;
    max-height: 200px !important;
    overflow-y: auto !important;
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-top: none !important; 
    border-radius: 0 0 4px 4px !important; 
    margin-top: -1px !important; 
    z-index: 9999 !important; 
    list-style: none !important;
    padding: 0 !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
    animation: dropdown-fade-in 150ms ease-out !important;
    pointer-events: auto !important; 
  }
  
  .trade-form-view-container [data-combobox-type] ul[role="listbox"] li {
    padding: 8px 12px !important;
    cursor: pointer !important;
    transition: background-color 150ms ease !important;
    margin: 0 !important;
  }
  
  .trade-form-view-container [data-combobox-type] ul[role="listbox"] li:hover,
  .trade-form-view-container [data-combobox-type] ul[role="listbox"] li[aria-selected="true"] {
    background-color: var(--background-secondary) !important;
  }
  
  .trade-form-view-container [data-combobox-type="multi"] > div:first-of-type {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 4px !important;
    margin-bottom: 4px !important;
  }
  
  .trade-form-view-container [data-combobox-type="multi"] > div:first-of-type > span {
    display: inline-flex !important;
    align-items: center !important;
    padding: 2px 8px !important;
    background-color: var(--interactive-accent) !important;
    color: white !important;
    border-radius: 4px !important;
    font-size: 12px !important;
  }
  
  .trade-form-view-container [data-combobox-type="multi"] > div:first-of-type > span > button {
    background: none !important;
    border: none !important;
    color: white !important;
    cursor: pointer !important;
    font-size: 16px !important;
    line-height: 1 !important;
    padding: 0 4px !important;
    margin-left: 4px !important;
    
    pointer-events: auto !important;
    
    opacity: 0.8 !important;
    transition: opacity 0.2s !important;
  }
  
  .trade-form-view-container [data-combobox-type="multi"] > div:first-of-type > span > button:hover {
    opacity: 1 !important;
  }
  
  .trade-form-view-container [data-combobox-type] ul[role="listbox"] li[data-add-option="true"] {
    font-style: italic !important;
    border-top: 1px dashed var(--background-modifier-border) !important;
  }
  
  @keyframes dropdown-fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .trade-form-view-container select option {
    padding: 8px 12px !important;
    font-size: 16px !important;
    line-height: 1.5 !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
  }

  
  .trade-form-view-container select option[value=""][disabled],
  .trade-form-view-container select option:first-child:not([value]),
  .trade-form-view-container select option:first-child[value=""],
  .trade-form-view-container .select-placeholder,
  .trade-form-view-container option.select-placeholder {
    color: var(--text-muted) !important;
    font-style: italic !important; 
  }
  .trade-form-view-container input:focus,
  .trade-form-view-container select:focus,
  .trade-form-view-container textarea:focus {
    border-color: var(--interactive-accent) !important;
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.3) !important;
    outline: none !important;
  }
  .trade-form-view-container .label {
    display: block !important;
    font-size: 15px !important;
    line-height: 20px !important;
    font-weight: 500 !important;
    margin-bottom: 4px !important;
    color: var(--text-normal) !important;
  }

  .trade-form-view-container .journalit-combobox > label {
    font-size: 15px !important;
    line-height: 20px !important;
    font-weight: 500 !important;
    color: var(--text-normal) !important;
  }
  .trade-form-view-container .journalit-direct-pnl-section .label {
    font-size: 14px !important;
    line-height: 18.2px !important;
  }
  .trade-form-view-container .errorMessage {
    font-size: 11px !important;
    color: var(--text-error) !important;
    margin-top: 2px !important;
    padding-left: 1px !important;
  }
  .trade-form-view-container button:not(.journalit-trade-form-header-action):not(.journalit-button) {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 8px 16px !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    font-weight: 500 !important;
    font-size: 16px !important;
  }
  .trade-form-view-container button.primary {
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent) !important;
    border: 1px solid var(--interactive-accent) !important;
  }
  .trade-form-view-container button.primary:hover:not(:disabled) {
    background-color: var(--interactive-accent-hover) !important;
    border-color: var(--interactive-accent-hover) !important;
  }
  .trade-form-view-container button.outline {
    background-color: transparent !important;
    color: var(--interactive-accent) !important;
    border: 1px solid var(--interactive-accent) !important;
  }
  .trade-form-view-container button.outline:hover:not(:disabled) {
    background-color: rgba(var(--interactive-accent-rgb), 0.1) !important;
  }
  
  .trade-form-view-container input.default-value {
    color: var(--text-muted) !important;
    font-style: italic !important;
  }
  
  .trade-form-view-container input.default-value:focus {
    color: var(--text-normal) !important;
    font-style: normal !important;
  }
  .trade-form-view-container .formActionsWrapper {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    position: sticky !important;
    bottom: 0 !important;
    z-index: 20 !important;
    margin: 4px -20px -16px !important;
    width: calc(100% + 40px) !important;
    padding: 12px 20px 4px !important;
    background: var(--background-primary) !important;
    border-top: 1px solid var(--background-modifier-border) !important;
  }
  .trade-form-view-container .formActions {
    display: flex !important;
    justify-content: space-between !important;
    gap: 8px !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .trade-form-view-container .formActionsLeft {
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
  }
  .trade-form-view-container .formActionsRight {
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
  }
  .trade-form-view-container .formActions .journalit-button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 6px !important;
    font-weight: 500 !important;
    box-shadow: none !important;
    gap: 8px !important;
    user-select: none !important;
  }
  .trade-form-view-container .formActions .create-account-button {
    min-width: 100px !important;
  }
  .trade-form-view-container .formActions .cancel-button {
    min-width: 70px !important;
  }
  .trade-form-view-container .formActions .journalit-button--primary {
    background: var(--interactive-accent) !important;
    border-color: var(--interactive-accent) !important;
    color: var(--text-on-accent) !important;
  }
  .trade-form-view-container .formActions .journalit-button--primary:hover:not(:disabled) {
    background: var(--interactive-accent-hover) !important;
    border-color: var(--interactive-accent-hover) !important;
  }
  .trade-form-view-container .formActions .journalit-button--secondary {
    background: transparent !important;
    border-color: var(--background-modifier-border) !important;
    color: var(--text-muted) !important;
  }
  .trade-form-view-container .formActions .journalit-button--secondary:hover:not(:disabled) {
    background: var(--background-modifier-hover) !important;
    color: var(--text-normal) !important;
  }
  .trade-form-view-container .formActions .journalit-button--secondary.importTradesButton {
    min-width: 108px !important;
    background: var(--background-secondary) !important;
    border-color: var(--background-modifier-border) !important;
    color: var(--text-normal) !important;
  }
  .trade-form-view-container .formActions .journalit-button--secondary.importTradesButton:hover:not(:disabled) {
    background: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
  }
  .trade-form-view-container .formSubmitHelperText {
    font-size: 12px !important;
    color: var(--text-muted) !important;
    text-align: right !important;
  }
  .trade-form-view-container .twoColumnLayout {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 12px !important; 
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .trade-form-view-container .date-picker-container {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
  }
  @media (max-width: 600px) {
    .trade-form-view-container .twoColumnLayout {
      grid-template-columns: 1fr !important;
    }
  }
  .trade-form-view-container .calculatedValue {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    padding: 12px !important;
    background-color: var(--background-secondary) !important;
    border-radius: 4px !important;
    margin: 0 !important; 
    width: 100% !important;
  }
  .trade-form-view-container .calculatedValue--footer {
    align-items: center !important;
    text-align: center !important;
    padding: 10px 12px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 6px !important;
    background: var(--background-secondary) !important;
  }
  .trade-form-view-container .calculatedValue--footer .calculatedAmount {
    font-size: 16px !important;
  }
  .trade-form-view-container .calculatedLabel {
    font-size: 12px !important;
    color: var(--text-muted) !important;
  }
  .trade-form-view-container .calculatedAmount {
    font-size: 18px !important;
    font-weight: 600 !important;
  }
  .trade-form-view-container .positive {
    color: var(--color-green) !important;
  }
  .trade-form-view-container .negative {
    color: var(--color-red) !important;
  }
  .trade-form-view-container .neutral {
    color: var(--text-normal) !important;
  }

  
  .trade-form-view-container .asset-type-container {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    grid-template-rows: repeat(2, 1fr) !important;
    gap: 8px !important;
    width: 100% !important;
    margin-bottom: 12px !important;
  }

  .trade-form-view-container .asset-type-button {
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 6px !important;
    padding: 8px 4px !important;
    font-size: 13px !important;
    height: 34px !important;
    transition: background-color 0.2s, border-color 0.2s !important;
    cursor: pointer !important;
    margin: 0 !important;
  }

  .trade-form-view-container .asset-type-button[aria-checked="true"] {
    background-color: var(--interactive-accent) !important;
    border-color: var(--interactive-accent) !important;
    color: white !important;
    font-weight: 500 !important;
  }

  .trade-form-view-container .asset-type-button:hover:not([aria-checked="true"]) {
    background-color: var(--background-secondary-alt) !important;
  }

  
  .trade-form-view-container .asset-specific-fields {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important; 
    width: 100% !important;
    margin-bottom: 12px !important; 
  }

  
  .trade-form-view-container .direction-container {
    display: flex !important;
    width: 100% !important;
    gap: 8px !important;
    margin-bottom: 12px !important;
  }

  .trade-form-view-container .direction-button {
    flex: 1 !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 6px !important;
    padding: 8px 4px !important;
    font-size: 13px !important;
    height: 34px !important;
    transition: background-color 0.2s, border-color 0.2s !important;
    cursor: pointer !important;
    margin: 0 !important;
  }

  
  

  .trade-form-view-container .direction-button[aria-checked="true"] {
    background-color: var(--interactive-accent) !important;
    color: white !important;
  }

  .trade-form-view-container .direction-button:hover:not([aria-checked="true"]) {
    background-color: var(--background-secondary-alt) !important;
  }

  
  .trade-form-view-container .required-indicator {
    color: var(--text-error) !important;
    margin-left: 4px !important;
    font-weight: bold !important;
  }

  .trade-form-view-container .thesisField {
    min-height: 100px !important;
  }
  .trade-form-view-container .tagContainer {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 4px !important;
    margin-top: 4px !important;
  }
  .trade-form-view-container .tag {
    display: inline-flex !important;
    align-items: center !important;
    padding: 4px 8px !important;
    background-color: var(--background-secondary) !important;
    border-radius: 2px !important;
    font-size: 12px !important;
    gap: 4px !important;
  }
  .trade-form-view-container .removeTag {
    cursor: pointer !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 16px !important;
    height: 16px !important;
    border-radius: 50% !important;
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
  .trade-form-view-container .errorSummary {
    background-color: rgba(229, 57, 53, 0.05) !important;
    border: 1px solid rgba(229, 57, 53, 0.5) !important;
    color: var(--text-error) !important;
    padding: 10px 12px !important;
    border-radius: 4px !important;
    margin-bottom: 16px !important;
    font-size: 13px !important;
    line-height: 1.4 !important;
    font-weight: 400 !important;
    box-shadow: none !important;
  }

  .trade-form-view-container .errorSummary ul {
    margin: 8px 0 0 20px !important;
    padding: 0 !important;
  }

  .trade-form-view-container .trade-form-advanced-tab .sectionContent {
    gap: 0 !important;
  }

  .trade-form-view-container .trade-form-details-tab {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
  }

  .trade-form-view-container .trade-form-details-block .sectionContent {
    gap: 0 !important;
  }

  .trade-form-view-container .trade-form-details-block .combobox-container,
  .trade-form-view-container .trade-form-details-block [data-combobox-type] {
    margin-bottom: 0 !important;
  }

  .trade-form-view-container .trade-form-details-block .journalit-combobox > label,
  .trade-form-view-container .trade-form-details-block .inputContainer > .label,
  .trade-form-view-container .trade-form-details-block .field > .label {
    display: block !important;
    color: var(--text-normal) !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    line-height: 1.15 !important;
    margin: 0 0 1px !important;
  }

  .trade-form-view-container .trade-form-details-block--attachments .field {
    display: flex !important;
    flex-direction: column !important;
    gap: 2px !important;
  }

  .trade-form-view-container .trade-form-details-block--attachments .label {
    margin-bottom: 0 !important;
  }

  .trade-form-view-container .trade-form-details-block--attachments .journalit-image-upload-wrapper {
    margin-bottom: 0 !important;
  }

  .trade-form-view-container .trade-form-details-block--attachments .journalit-image-url-container {
    margin-top: 4px !important;
  }

  .trade-form-view-container .custom-fields-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 14px !important;
  }

  .trade-form-view-container .custom-field-wrapper {
    display: grid !important;
    grid-template-columns: 34px minmax(0, 1fr) !important;
    gap: 12px !important;
    align-items: start !important;
  }

  .trade-form-view-container .custom-field-order {
    color: var(--text-faint) !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    letter-spacing: 0.06em !important;
    line-height: 1 !important;
    padding-top: 5px !important;
    text-align: right !important;
  }

  .trade-form-view-container .custom-field-control {
    min-width: 0 !important;
  }

  .trade-form-view-container .custom-field-control .field,
  .trade-form-view-container .custom-field-control .inputContainer,
  .trade-form-view-container .custom-field-control .selectContainer,
  .trade-form-view-container .custom-field-control .comboBoxContainer {
    width: 100% !important;
  }

  .trade-form-view-container .custom-field-control label,
  .trade-form-view-container .custom-field-control .label {
    color: var(--text-normal) !important;
    display: block !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    line-height: 1.2 !important;
    margin-bottom: 6px !important;
  }

  .trade-form-view-container .custom-field-control input,
  .trade-form-view-container .custom-field-control textarea,
  .trade-form-view-container .custom-field-control select,
  .trade-form-view-container .custom-field-control .selectTrigger,
  .trade-form-view-container .custom-field-control .comboBoxInput {
    min-height: 38px !important;
  }

  .trade-form-view-container .custom-fields-empty {
    border: 1px dashed var(--background-modifier-border) !important;
    border-radius: 8px !important;
    color: var(--text-muted) !important;
    padding: 18px !important;
    text-align: center !important;
  }

  .trade-form-view-container .custom-fields-empty p {
    margin: 0 !important;
  }

  .trade-form-view-container .custom-fields-empty p:first-child {
    color: var(--text-normal) !important;
    font-weight: 600 !important;
    margin-bottom: 4px !important;
  }

  .trade-form-view-container .custom-fields-empty .journalit-button {
    margin-top: 14px !important;
  }

  .trade-form-view-container .trade-form-custom-fields-empty {
    font-style: italic !important;
    color: var(--text-muted) !important;
  }

  .trade-form-view-container .trade-form-attachments {
    margin-top: 1rem !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-image-carousel {
    position: relative !important;
    margin-bottom: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-carousel-main {
    align-items: center !important;
    justify-content: center !important;
    gap: 0 !important;
    margin: 0 !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-carousel-image-container {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    aspect-ratio: 1594 / 1003 !important;
    max-height: min(52vh, 420px) !important;
    overflow: hidden !important;
    background: transparent !important;
    border-radius: var(--radius-m, 8px) !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-carousel-image {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: min(52vh, 420px) !important;
    object-fit: contain !important;
    margin: 0 auto !important;
    border-radius: var(--radius-m, 8px) !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-carousel-counter {
    position: absolute !important;
    top: 0.65rem !important;
    left: 0.65rem !important;
    right: auto !important;
    z-index: 2 !important;
    margin: 0 !important;
    padding: 0.25rem 0.55rem !important;
    border: 1px solid rgba(var(--mono-rgb-100), 0.14) !important;
    border-radius: var(--radius-s, 6px) !important;
    background: rgba(var(--mono-rgb-0), 0.52) !important;
    color: var(--text-normal) !important;
    font-size: 0.75rem !important;
    font-weight: 600 !important;
    line-height: 1 !important;
    backdrop-filter: blur(8px) !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-carousel-thumbnails {
    display: flex !important;
    flex-wrap: nowrap !important;
    justify-content: flex-start !important;
    gap: 0.5rem !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    padding: 0.65rem 0 0 !important;
    margin: 0 !important;
    border-top: 0 !important;
    background: transparent !important;
    scrollbar-color: var(--scrollbar-thumb-bg, var(--background-modifier-border-hover)) transparent !important;
    scrollbar-width: thin !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-carousel-thumbnails::-webkit-scrollbar {
    height: 4px !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-carousel-thumbnails::-webkit-scrollbar-button {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-carousel-thumbnails::-webkit-scrollbar-track {
    background: transparent !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-carousel-thumbnails::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb-bg, rgba(var(--mono-rgb-100), 0.22)) !important;
    border-radius: 999px !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-carousel-thumbnails::-webkit-scrollbar-thumb:hover {
    background-color: var(--scrollbar-active-thumb-bg, rgba(var(--mono-rgb-100), 0.34)) !important;
  }

  .trade-form-view-container .trade-form-attachments .journalit-carousel-thumbnail {
    width: 4.5rem !important;
    height: 3rem !important;
    flex: 0 0 auto !important;
    border-radius: var(--radius-s, 6px) !important;
    background: transparent !important;
    scroll-snap-align: center !important;
  }

  @keyframes errorPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  
  .trade-form-view-container .formContainer.is-dragging-over {
    position: relative !important;
  }

  .trade-form-view-container .drag-overlay {
    position: fixed !important; 
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background-color: rgba(var(--background-primary-rgb, 255, 255, 255), 0.4) !important; 
    backdrop-filter: blur(3px) !important;
    -webkit-backdrop-filter: blur(3px) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    z-index: 9999 !important;
    animation: fade-in 0.2s ease-out !important;
  }

  .trade-form-view-container .drag-message-container {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important; 
    z-index: 10000 !important;
  }

  .trade-form-view-container .drag-message {
    font-size: 22px !important;
    font-weight: 400 !important; 
    font-family: var(--font-interface, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif) !important;
    color: var(--interactive-accent) !important;
    background-color: rgba(var(--background-primary-rgb, 255, 255, 255), 0.7) !important; 
    padding: 14px 28px !important;
    border-radius: 6px !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important; 
    letter-spacing: 0.5px !important;
    border: 1px solid rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.5) !important; 
    white-space: nowrap !important;
  }

  
  @media (max-width: 600px) {
    .trade-form-view-container input,
    .trade-form-view-container textarea,
    .trade-form-view-container select,
    .trade-form-view-container .journalit-select {
      font-size: 18px !important;
    }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  
  .trade-form-view-container .journalit-tab-nav {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    border-bottom: 1px solid var(--background-modifier-border);
    margin-bottom: 20px;
    width: 100%;
    padding: 4px 16px 0;
    position: sticky;
    top: -16px;
    background-color: var(--background-primary);
    z-index: 100;
  }

  .trade-form-view-container .journalit-tab-wrapper {
    grid-column: 2;
    display: flex;
    justify-content: center;
  }

  .trade-form-view-container .journalit-trade-form-header-actions {
    grid-column: 3;
    justify-self: end;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .trade-form-view-container .journalit-tab-button {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    transition: all 0.2s ease;
    position: relative;
  }

  .trade-form-view-container .journalit-tab-button:hover {
    color: var(--text-normal);
    background-color: var(--background-modifier-hover);
  }

  .trade-form-view-container .journalit-tab-button.journalit-tab-active {
    color: var(--text-normal);
    font-weight: 600;
    border-bottom-color: var(--text-accent);
  }

  .trade-form-view-container .journalit-tab-error-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--text-error);
    color: white;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    margin-left: 6px;
    min-width: 18px;
  }

  
  .trade-form-view-container .journalit-edit-badge {
    font-size: 12px;
    color: white;
    background-color: var(--interactive-accent);
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    white-space: nowrap;
  }

  
  .trade-form-view-container .journalit-image-url-container {
    display: flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
    margin-top: 0.5rem !important;
  }

  .trade-form-view-container .journalit-image-url-input {
    flex: 1 !important;
    padding: 0.5rem !important;
    background: var(--background-secondary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: var(--radius-s) !important;
    color: var(--text-normal) !important;
    font-size: 0.9em !important;
  }

  .trade-form-view-container .journalit-image-url-input.has-error {
    border-color: var(--text-error) !important;
  }

  .trade-form-view-container .journalit-image-url-button {
    padding: 0.5rem 1rem !important;
    background: var(--background-secondary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: var(--radius-s) !important;
    color: var(--text-muted) !important;
    cursor: not-allowed !important;
    font-size: 0.9em !important;
    font-weight: 500 !important;
  }

  .trade-form-view-container .journalit-image-url-button.is-active {
    background: var(--interactive-accent) !important;
    color: var(--text-on-accent) !important;
    cursor: pointer !important;
  }

  .trade-form-view-container .journalit-image-url-error {
    color: var(--text-error) !important;
    font-size: 0.8em !important;
    margin-top: 0.25rem !important;
  }

  
  .trade-form-view-container .journalit-trade-type-selector {
    margin-bottom: 16px;
    border-radius: 8px;
  }

  .trade-form-view-container .journalit-trade-type-selector.is-expanded {
    border: 1px solid var(--background-modifier-border);
    background-color: var(--background-secondary);
  }

  .trade-form-view-container .journalit-trade-type-selector__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    user-select: none;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background-color: var(--background-primary);
  }

  .trade-form-view-container .journalit-trade-type-selector.is-expanded
    .journalit-trade-type-selector__header {
    border: none;
    border-bottom: 1px solid var(--background-modifier-border);
    border-radius: 0;
    background-color: transparent;
  }

  .trade-form-view-container .journalit-trade-type-selector__header-main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    gap: 2px;
  }

  .trade-form-view-container .journalit-trade-type-selector__title {
    display: block;
    font-weight: 600;
    color: var(--text-normal);
    margin: 0;
    cursor: pointer;
    line-height: 1.2;
  }

  .trade-form-view-container .journalit-trade-type-selector__current {
    font-size: 14px;
    color: var(--text-muted);
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    line-height: 1.2;
  }

  .trade-form-view-container .journalit-trade-type-selector__icon {
    display: inline-flex;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .trade-form-view-container .journalit-trade-type-selector__chevron {
    color: var(--text-muted);
    transition: transform 0.2s ease;
  }

  .trade-form-view-container .journalit-trade-type-selector__chevron.is-expanded {
    transform: rotate(180deg);
  }

  .trade-form-view-container .journalit-trade-type-selector__content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.25s ease;
  }

  .trade-form-view-container .journalit-trade-type-selector.is-expanded
    .journalit-trade-type-selector__content {
    max-height: var(--trade-type-accordion-height, 0px);
  }

  .trade-form-view-container .journalit-trade-type-selector__content-inner {
    padding: 16px;
  }

  .trade-form-view-container .journalit-trade-type-selector__description {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0 0 12px 0;
  }

  .trade-form-view-container .journalit-trade-type-selector__missed-field {
    margin-top: 16px;
  }

  .trade-form-view-container .journalit-trade-type-selector__textarea {
    font-size: 14px !important;
  }
`;
