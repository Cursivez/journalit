


export const accountPageStylesCSS = `

.journalit-account-page-view-container {
  height: 100%;
  overflow: hidden !important; 
  display: flex;
  flex-direction: column;
  padding: 0;
  min-height: 0; 
}

.journalit-account-page-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--background-primary);
  color: var(--text-normal);
  overflow: hidden;
  min-height: 0; 
}


.journalit-account-identity {
  margin: 0 0 16px 0;
}

.journalit-account-page-view button.journalit-account-back-button {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  max-width: 100%;
  margin: 0;
  padding: 0 4px;
  border: 1px solid transparent;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: var(--font-ui-smaller);
  font-weight: 600;
  line-height: 1;
  opacity: 0.92;
  justify-self: start;
  white-space: nowrap;
  transition:
    color 0.16s ease,
    opacity 0.16s ease;
}

.journalit-account-page-view
  button.journalit-account-back-button
  .journalit-obsidian-icon {
  flex: 0 0 auto;
  color: currentColor;
}

.journalit-account-page-view button.journalit-account-back-button:hover,
.journalit-account-page-view button.journalit-account-back-button:focus-visible {
  border-color: transparent;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  opacity: 1;
}

.journalit-account-page-view button.journalit-account-back-button:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}

.journalit-account-identity-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, auto) minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.journalit-account-identity-name {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--text-normal);
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  justify-self: center;
}

.journalit-account-identity-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;
  justify-self: end;
}

.journalit-account-identity-meta {
  display: flex;
  align-items: baseline;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px 14px;
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
}

.journalit-account-identity-meta-item {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  min-width: 0;
}

.journalit-account-identity-meta-label {
  color: var(--text-faint);
}

.journalit-account-identity-meta-value {
  overflow-wrap: anywhere;
  color: var(--text-muted);
}


.account-page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-height: 0; 
}

.account-page-placeholder {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
}

.account-page-placeholder p {
  margin: 8px 0;
  font-size: 14px;
}


.account-page-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 20px;
  text-align: center;
}

.account-page-error h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: var(--text-normal);
}

.account-page-error p {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
}


.account-page-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
  color: var(--text-muted);
}


.edit-account-form .journalit-account-challenge-toggle,
.create-account-form .journalit-account-challenge-toggle {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--size-4-3);
  width: 100%;
  margin-bottom: var(--size-4-3);
  padding: var(--size-4-2) var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-primary);
}

.edit-account-form .journalit-account-challenge-toggle__text,
.create-account-form .journalit-account-challenge-toggle__text {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
  min-width: 0;
}

.edit-account-form .journalit-account-challenge-toggle__label,
.create-account-form .journalit-account-challenge-toggle__label {
  color: var(--text-normal);
  cursor: pointer;
  font-size: var(--font-ui-small);
  font-weight: var(--font-semibold);
}

.edit-account-form .journalit-account-challenge-toggle__help,
.create-account-form .journalit-account-challenge-toggle__help {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  line-height: 1.4;
}


.journalit-account-challenge-toggle .toggle-switch-container {
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
  width: 36px;
  height: 20px;
  margin-top: 2px;
}

.journalit-account-challenge-toggle .toggle-switch-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
}

.journalit-account-challenge-toggle .toggle-switch-label {
  position: absolute;
  inset: 0;
  display: block;
  overflow: hidden;
  border-radius: 999px;
  background: var(--background-modifier-border);
  cursor: pointer;
}

.journalit-account-challenge-toggle .toggle-switch-button {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--background-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.journalit-account-challenge-toggle
  .toggle-switch-input:checked
  + .toggle-switch-label {
  background: var(--interactive-accent);
}

.journalit-account-challenge-toggle
  .toggle-switch-input:checked
  + .toggle-switch-label
  .toggle-switch-button {
  transform: translateX(16px);
}

.journalit-account-challenge-toggle
  .toggle-switch-input:focus-visible
  + .toggle-switch-label {
  box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
}

.journalit-account-challenge-toggle .toggle-switch-container.disabled {
  opacity: 0.6;
}

.journalit-account-challenge-toggle
  .toggle-switch-container.disabled
  .toggle-switch-label {
  cursor: not-allowed;
}

.edit-account-form .journalit-account-created-date-only .journalit-account-created-date-column,
.create-account-form .journalit-account-created-date-only .journalit-account-created-date-column {
  grid-column: 1 / -1;
}


.account-page-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1 1 0; 
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 20px 20px 20px;
  position: relative;
  min-height: 0; 
  max-height: 100%; 
  height: 0; 
  
  -webkit-overflow-scrolling: touch;
  scroll-behavior: auto; 
  will-change: scroll-position;
  
  contain: layout;
  
  container-type: inline-size;
  container-name: journalit-account-page;
}


.journalit-account-page-view .journalit-account-stat {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 14px 12px 12px;
  box-sizing: border-box;
  text-align: center;
}

.journalit-account-page-view .journalit-account-stat-label {
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  line-height: 1.2;
  text-transform: uppercase;
}

.journalit-account-page-view .journalit-account-stat-label-with-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.journalit-account-page-view .metric-label-info-icon {
  cursor: help;
  font-size: 9px;
  opacity: 0.6;
}

.journalit-account-page-view .account-metrics-conversion-tooltip {
  max-width: 200px;
  font-size: 12px;
}

.journalit-account-page-view .account-metrics-conversion-tooltip-title {
  margin-bottom: 4px;
  font-weight: 600;
}

.journalit-account-page-view .account-metrics-conversion-warning {
  margin-top: 4px;
  color: var(--text-warning);
}

.journalit-account-page-view .journalit-account-stat-value {
  margin-top: 7px;
  color: var(--text-normal);
  font-size: 20px;
  font-variant-numeric: tabular-nums;
  font-weight: 550;
  line-height: 1.15;
}

.journalit-account-page-view .journalit-account-stat-value.is-positive {
  color: var(--text-success);
}

.journalit-account-page-view .journalit-account-stat-value.is-negative {
  color: var(--text-error);
}

.journalit-account-page-view .journalit-account-stat-value.is-muted {
  color: var(--text-muted);
  font-size: 17px;
}


.journalit-account-page-view .journalit-account-metrics-panel {
  display: grid;
  grid-template-columns: repeat(
    var(--journalit-metric-tracks, 7),
    minmax(0, 1fr)
  );
  overflow: hidden;
  margin: 0 0 24px;
  background: var(--journalit-detail-card-surface);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
}


.journalit-account-page-view .journalit-account-page-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}


.journalit-account-page-view .journalit-account-section-heading {
  margin: 0 0 8px;
}

.journalit-account-page-view .journalit-account-section-heading h3 {
  margin: 0;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}


.journalit-account-page-view
  .journalit-account-metrics-panel
  .journalit-account-stat {
  grid-column: span var(--journalit-metric-span, 1);
  background: var(--journalit-detail-card-surface);
  box-shadow:
    -1px 0 0 0 var(--background-modifier-border),
    0 -1px 0 0 var(--background-modifier-border);
}


.account-trades {
  margin: 24px 0;
}

.account-trades h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: var(--text-normal);
}

.trades-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trade-item {
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border-hover);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.trade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 12px 20px;
  border-bottom: 1px solid var(--background-modifier-border);
  background: var(--background-primary-alt);
}

.trade-instrument {
  font-weight: 700;
  font-size: 18px;
  color: var(--text-normal);
  letter-spacing: -0.5px;
}

.trade-item .trade-direction {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1.5px solid;
}

.trade-item .trade-direction.long {
  border-color: var(--text-success);
  color: var(--text-success);
  background: rgba(var(--color-green-rgb), 0.1);
}

.trade-item .trade-direction.short {
  border-color: var(--text-error);
  color: var(--text-error);
  background: rgba(var(--color-red-rgb), 0.1);
}

.trade-item .trade-direction.call {
  border-color: var(--text-success);
  color: var(--text-success);
  background: rgba(var(--color-green-rgb), 0.1);
}

.trade-item .trade-direction.put {
  border-color: var(--text-error);
  color: var(--text-error);
  background: rgba(var(--color-red-rgb), 0.1);
}

.trade-pnl {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.5px;
}

.trade-pnl.positive {
  color: var(--text-success);
}

.trade-pnl.negative {
  color: var(--text-error);
}

.trade-pnl.breakeven {
  color: var(--text-muted);
}

.trade-details {
  padding: 16px 20px 20px 20px;
  display: grid;
  gap: 12px;
}


.trade-setups,
.trade-tags {
  font-size: 16px;
  color: var(--text-muted);
}


.account-date-warning {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-top: 12px;
  background-color: rgba(var(--color-red-rgb), 0.15);
  border-radius: 8px;
  border: 1px solid rgba(var(--color-red-rgb), 0.3);
}

.account-date-warning__icon {
  color: var(--color-red);
  flex-shrink: 0;
}

.account-date-warning__content {
  flex: 1;
}

.account-date-warning__title {
  color: var(--text-normal);
  font-weight: 600;
  margin-bottom: 4px;
}


.account-date-warning__title:last-child {
  margin-bottom: 0;
}

.account-date-warning__desc {
  color: var(--text-normal);
  font-size: 0.85em;
  opacity: 0.85;
}

.account-date-warning__button {
  flex-shrink: 0;
}

.account-date-warning__button.is-loading {
  cursor: wait;
}

.edit-modal-placeholder {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  padding: 24px;
  z-index: 1000;
  box-shadow: var(--shadow-l);
}


.account-balance-section {
  margin: 32px 0;
}

.balance-section-header {
  margin-bottom: 16px;
}

.balance-section-header h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: var(--text-normal);
}

.balance-section-subtitle {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
}

.balance-chart-container {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin: 16px 0;
}

.balance-chart-loading {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.balance-section-footer {
  margin-top: 8px;
}

.balance-info {
  margin: 0;
  color: var(--text-muted);
  font-size: 16px;
  font-style: italic;
}


.trades-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
}

.trades-header-centered {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  gap: 20px;
}

.trades-header-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--background-modifier-border), transparent);
}

.trades-header-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-normal);
  white-space: nowrap;
  padding: 0 16px;
  background: var(--background-primary);
}

.trade-item {
  cursor: pointer;
}

.trade-item:hover {
  border-color: var(--interactive-accent);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.trade-item.no-path {
  cursor: default;
  opacity: 0.6;
}

.trade-item.no-path:hover {
  transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border-color: var(--background-modifier-border-hover);
}

.trade-primary-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trade-prices, .trade-dates {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 8px 0;
  border-bottom: 1px solid var(--background-modifier-border);
}

.trade-price, .trade-size, .trade-date {
  font-size: 16px;
  color: var(--text-muted);
  font-weight: 500;
}

.trade-setups, .trade-mistakes, .trade-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--background-modifier-border);
}

.trade-setups:last-child, .trade-mistakes:last-child, .trade-tags:last-child {
  border-bottom: none;
}

.setup-label, .mistake-label, .tags-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 80px;
  flex-shrink: 0;
}

.setup-tags, .mistake-tags, .tag-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
}

.setup-tag, .mistake-tag, .trade-tag {
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.25px;
  transition: all 0.2s ease;
}

.setup-tag {
  background: rgba(var(--color-green-rgb), 0.1);
  color: var(--text-success);
  border: 1px solid rgba(var(--color-green-rgb), 0.2);
}

.mistake-tag {
  background: rgba(var(--color-red-rgb), 0.1);
  color: var(--text-error);
  border: 1px solid rgba(var(--color-red-rgb), 0.2);
}

.trade-tag {
  background: var(--background-modifier-border);
  color: var(--text-muted);
  border: 1px solid var(--background-modifier-border-hover);
}

.trade-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 0 0;
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
}

.review-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.review-status.reviewed {
  color: var(--text-success);
}

.review-status.reviewed::before {
  content: "✓";
  font-size: 14px;
}

.review-status.not-reviewed {
  color: var(--text-warning);
}

.review-status.not-reviewed::before {
  content: "○";
  font-size: 14px;
}

.trade-costs {
  color: var(--text-muted);
  font-weight: 500;
}


.status-open {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(33, 150, 243, 0.15);
  color: var(--color-info);
}


.future-enhancements-placeholder {
  margin: 32px 0;
  padding: 24px;
  background: var(--background-secondary);
  border: 2px dashed var(--background-modifier-border);
  border-radius: 8px;
  text-align: center;
}

.future-enhancements-placeholder h3 {
  margin: 0 0 16px 0;
  color: var(--text-muted);
}

.future-enhancements-placeholder ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.future-enhancements-placeholder li {
  margin: 8px 0;
  color: var(--text-muted);
  font-size: 14px;
}


.journalit-edit-account-modal {
  overflow-y: auto;
  padding-bottom: 0;
}

.edit-account-modal-container {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: none;
  min-height: 0;
}

.journalit-edit-account-modal .modal-content {
  overflow: visible;
}

.edit-account-modal-container .modal-title {
  margin: 0 0 12px 0;
  padding: 0;
  font-size: 18px;
}

.edit-account-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  flex: 1 1 auto;
  min-height: 0;
  overflow: visible;
}

.edit-account-form-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 1 auto;
  min-height: 0;
  overflow: visible;
  padding-right: 0;
}

.edit-account-form .setting-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}


.modal:not(.mod-settings)
  .edit-account-form
  .setting-item:not(.setting-item-heading),
.modal:not(.mod-settings)
  .create-account-form
  .setting-item:not(.setting-item-heading) {
  border-top: none;
}

.edit-account-form .setting-item.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.edit-account-form .setting-item.two-column .column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-account-form .journalit-copy-trading-section {
  align-items: flex-start;
  margin-bottom: 0;
  margin-top: -16px;
  padding-top: 0;
}

.edit-account-form .journalit-checkbox-setting-row {
  display: flex;
  align-items: flex-start;
  gap: var(--size-2-2);
}

.edit-account-form .journalit-checkbox-setting-row > .jl-checkbox-wrapper {
  flex: 0 0 auto;
  margin: 2px 0 0 -24px;
}

.edit-account-form .journalit-checkbox-setting-row .jl-checkbox-label {
  gap: 0;
}

.edit-account-form .journalit-checkbox-setting-label,
.create-account-form .journalit-checkbox-setting-label {
  font-weight: 400 !important;
}


.edit-account-form .journalit-copy-trading-fields.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
  width: 100%;
  margin-top: var(--size-4-4);
}

.edit-account-form .journalit-copy-trading-fields.two-column .column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-account-form .journalit-copy-trading-start-row,
.create-account-form .journalit-copy-trading-start-row {
  border-top: none !important;
  padding-top: 0 !important;
  margin-top: var(--size-4-4);
}

.edit-account-form .journalit-copy-trading-base-warning {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
}

.edit-account-form .journalit-copy-trading-info-trigger,
.create-account-form .journalit-copy-trading-info-trigger {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  vertical-align: middle;
}

.edit-account-form .journalit-copy-trading-info-icon,
.create-account-form .journalit-copy-trading-info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: help;
}

.edit-account-form .journalit-copy-trading-info-icon:hover,
.create-account-form .journalit-copy-trading-info-icon:hover {
  color: var(--text-normal);
}

.edit-account-form .journalit-copy-trading-section .journalit-feature-toggle-row,
.create-account-form .journalit-copy-trading-section .journalit-feature-toggle-row {
  align-items: center;
}

.edit-account-form
  .journalit-copy-trading-section
  .journalit-feature-toggle-row
  > .jl-checkbox-wrapper,
.create-account-form
  .journalit-copy-trading-section
  .journalit-feature-toggle-row
  > .jl-checkbox-wrapper {
  margin-top: 0;
}

.edit-account-form .journalit-copy-trading-section + .journalit-prop-challenge-section,
.create-account-form .journalit-copy-trading-section + .journalit-prop-challenge-section {
  padding-top: var(--size-4-2);
}

.edit-account-form .journalit-copy-trading-section.journalit-copy-trading-section--compact,
.create-account-form .journalit-copy-trading-section.journalit-copy-trading-section--compact {
  width: calc(50% - 8px);
  margin-top: -64px;
  margin-bottom: 64px;
}

.edit-account-form .setting-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: visible;
  min-width: auto;
}

.edit-account-form .setting-item-name {
  font-weight: 600;
  color: var(--text-normal);
  font-size: 16px;
  margin-bottom: 2px;
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  word-break: break-word;
}

.edit-account-form .setting-item-name-optional,
.create-account-form .setting-item-name-optional {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
}

.edit-account-form .setting-item-description {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.2;
  margin-bottom: 4px;
}

.edit-account-form .setting-item-control {
  margin-top: 0;
}

.edit-account-form .setting-item-control input:not(.journalit-fast-datetime__segment),
.edit-account-form .setting-item-control select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 3px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 16px;
  height: 30px;
  line-height: 1.2;
  box-sizing: border-box;
}

.edit-account-form .setting-item-control select {
  height: 32px;
  padding: 5px 6px;
}

.edit-account-form .setting-item-control input:focus,
.edit-account-form .setting-item-control select:focus {
  outline: none;
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 1px var(--interactive-accent);
}

.edit-account-form .setting-item-control input:disabled {
  background: var(--background-secondary);
  color: var(--text-muted);
  cursor: not-allowed;
}

.edit-account-buttons {
  position: sticky;
  bottom: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-top: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
  box-shadow: 0 -12px 18px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
}

.edit-account-buttons .button-group-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.edit-account-buttons .save-account-button {
  min-width: 100px;
}

.edit-account-buttons .cancel-button {
  min-width: 70px;
}


.create-account-modal-container {
  max-width: 600px;
  width: 100%;
}

.create-account-modal-container .modal-title {
  margin: 0 0 12px 0;
  padding: 0;
  font-size: 18px;
}

.create-account-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
}

.create-account-form .setting-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.create-account-form .setting-item.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.create-account-form .setting-item.two-column .column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.create-account-form .journalit-copy-trading-section {
  align-items: flex-start;
  margin-bottom: 0;
  margin-top: -16px;
  padding-top: 0;
}

.create-account-form .journalit-checkbox-setting-row {
  display: flex;
  align-items: flex-start;
  gap: var(--size-2-2);
}

.create-account-form .journalit-checkbox-setting-row > .jl-checkbox-wrapper {
  flex: 0 0 auto;
  margin: 2px 0 0 -24px;
}

.create-account-form .journalit-checkbox-setting-row .jl-checkbox-label {
  gap: 0;
}


.create-account-form .journalit-copy-trading-fields.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
  width: 100%;
  margin-top: var(--size-4-4);
}

.create-account-form .journalit-copy-trading-fields.two-column .column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-account-form .journalit-prop-challenge-section,
.create-account-form .journalit-prop-challenge-section {
  align-items: stretch;
  border-top: 1px solid var(--background-modifier-border);
  padding-top: var(--size-4-4);
}

.edit-account-form .journalit-prop-challenge-identity,
.journalit-account-merge-modal__identity .journalit-prop-challenge-identity,
.create-account-form .journalit-prop-challenge-identity,
.edit-account-form .journalit-prop-profile-picker__controls,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker__controls,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker__controls,
.create-account-form .journalit-prop-profile-picker__controls,
.edit-account-form .journalit-prop-challenge-phase-fields,
.create-account-form .journalit-prop-challenge-phase-fields,
.edit-account-form .journalit-prop-challenge-rule-fields,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rule-fields ,
.create-account-form .journalit-prop-challenge-rule-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-4-2);
  width: 100%;
}

.edit-account-form .journalit-prop-challenge-phases,
.create-account-form .journalit-prop-challenge-phases,
.edit-account-form .journalit-prop-challenge-rules,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rules,
.create-account-form .journalit-prop-challenge-rules,
.edit-account-form .journalit-prop-challenge-costs,
.create-account-form .journalit-prop-challenge-costs {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-2);
}


.edit-account-form .journalit-prop-challenge-identity-heading-row,
.journalit-account-merge-modal__identity .journalit-prop-challenge-identity-heading-row ,
.create-account-form .journalit-prop-challenge-identity-heading-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.edit-account-form .journalit-prop-prefill-heading-link,
.journalit-account-merge-modal__phase-rules .journalit-prop-prefill-heading-link,
.journalit-account-merge-modal__identity .journalit-prop-prefill-heading-link,
.create-account-form .journalit-prop-prefill-heading-link,
.edit-account-form .journalit-prop-prefill-match,
.journalit-account-merge-modal__phase-rules .journalit-prop-prefill-match ,
.journalit-account-merge-modal__identity .journalit-prop-prefill-match ,
.create-account-form .journalit-prop-prefill-match {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  cursor: pointer;
}

.edit-account-form .journalit-prop-prefill-heading-link:hover,
.journalit-account-merge-modal__phase-rules .journalit-prop-prefill-heading-link:hover,
.journalit-account-merge-modal__identity .journalit-prop-prefill-heading-link:hover,
.create-account-form .journalit-prop-prefill-heading-link:hover,
.edit-account-form .journalit-prop-prefill-match:hover,
.journalit-account-merge-modal__phase-rules .journalit-prop-prefill-match:hover ,
.journalit-account-merge-modal__identity .journalit-prop-prefill-match:hover ,
.create-account-form .journalit-prop-prefill-match:hover {
  color: var(--text-normal);
}


.edit-account-form .journalit-prop-prefill-match svg,
.journalit-account-merge-modal__phase-rules .journalit-prop-prefill-match svg ,
.journalit-account-merge-modal__identity .journalit-prop-prefill-match svg ,
.create-account-form .journalit-prop-prefill-match svg {
  flex: 0 0 auto;
  color: var(--color-yellow, var(--interactive-accent));
}


.edit-account-form .journalit-prop-prefill-heading-link-label,
.journalit-account-merge-modal__phase-rules .journalit-prop-prefill-heading-link-label ,
.journalit-account-merge-modal__identity .journalit-prop-prefill-heading-link-label ,
.create-account-form .journalit-prop-prefill-heading-link-label {
  padding-bottom: 1px;
  border-bottom: 1px dotted var(--text-faint);
}
.edit-account-form .journalit-prop-prefill-heading-link:hover .journalit-prop-prefill-heading-link-label,
.journalit-account-merge-modal__phase-rules .journalit-prop-prefill-heading-link:hover .journalit-prop-prefill-heading-link-label,
.journalit-account-merge-modal__identity .journalit-prop-prefill-heading-link:hover .journalit-prop-prefill-heading-link-label,
.create-account-form .journalit-prop-prefill-heading-link:hover .journalit-prop-prefill-heading-link-label,
.edit-account-form .journalit-prop-prefill-heading-link:focus-visible .journalit-prop-prefill-heading-link-label,
.journalit-account-merge-modal__phase-rules .journalit-prop-prefill-heading-link:focus-visible .journalit-prop-prefill-heading-link-label ,
.journalit-account-merge-modal__identity .journalit-prop-prefill-heading-link:focus-visible .journalit-prop-prefill-heading-link-label ,
.create-account-form .journalit-prop-prefill-heading-link:focus-visible .journalit-prop-prefill-heading-link-label {
  border-bottom-color: var(--text-muted);
}

.edit-account-form .journalit-prop-prefill-badge,
.journalit-account-merge-modal__phase-rules .journalit-prop-prefill-badge ,
.journalit-account-merge-modal__identity .journalit-prop-prefill-badge ,
.create-account-form .journalit-prop-prefill-badge {
  padding: 0 4px;
  border-radius: 3px;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  font-size: 9px;
  font-weight: var(--font-semibold);
  letter-spacing: 0.04em;
}


.edit-account-form .journalit-prop-prefill-match,
.journalit-account-merge-modal__phase-rules .journalit-prop-prefill-match ,
.journalit-account-merge-modal__identity .journalit-prop-prefill-match ,
.create-account-form .journalit-prop-prefill-match {
  align-self: flex-start;
  justify-content: flex-start;
  text-align: left;
}


.edit-account-form .journalit-prop-challenge-identity-block,
.journalit-account-merge-modal__identity .journalit-prop-challenge-identity-block ,
.create-account-form .journalit-prop-challenge-identity-block {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
  width: 100%;
}

.edit-account-form .journalit-prop-profile-picker,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker ,
.create-account-form .journalit-prop-profile-picker {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
  width: 100%;
  padding: var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s);
  background: var(--background-secondary);
}

.edit-account-form .journalit-prop-challenge-profile-identity {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
  width: 100%;
}

.edit-account-form .journalit-prop-profile-picker__title,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker__title ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker__title ,
.create-account-form .journalit-prop-profile-picker__title {
  color: var(--text-normal);
  font-weight: var(--font-semibold);
}

.edit-account-form .journalit-prop-profile-picker__title-row,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker__title-row ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker__title-row ,
.create-account-form .journalit-prop-profile-picker__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-4-3);
  min-width: 0;
}

.edit-account-form .journalit-prop-profile-picker__title-row .journalit-prop-profile-status,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker__title-row .journalit-prop-profile-status ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker__title-row .journalit-prop-profile-status ,
.create-account-form .journalit-prop-profile-picker__title-row .journalit-prop-profile-status {
  flex: 0 1 auto;
  margin-left: auto;
  text-align: right;
}

.edit-account-form .journalit-prop-profile-picker__controls,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker__controls ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker__controls ,
.create-account-form .journalit-prop-profile-picker__controls {
  align-items: end;
  grid-template-columns: 1fr 1fr;
}

.edit-account-form .journalit-prop-profile-picker__column,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker__column ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker__column ,
.create-account-form .journalit-prop-profile-picker__column {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-5);
  min-width: 0;
}

.edit-account-form .journalit-prop-profile-picker__challenge-selection,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker__challenge-selection ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker__challenge-selection ,
.create-account-form .journalit-prop-profile-picker__challenge-selection {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: var(--size-4-3);
}

.edit-account-form .journalit-prop-profile-status,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-status ,
.journalit-account-merge-modal__identity .journalit-prop-profile-status ,
.create-account-form .journalit-prop-profile-status {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.edit-account-form .journalit-prop-challenge-costs,
.create-account-form .journalit-prop-challenge-costs {
  padding-top: var(--size-4-4);
  border-top: 1px solid var(--background-modifier-border);
}

.edit-account-form .journalit-prop-challenge-costs-heading,
.create-account-form .journalit-prop-challenge-costs-heading {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
}

.edit-account-form .journalit-prop-challenge-costs-heading span,
.create-account-form .journalit-prop-challenge-costs-heading span {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.edit-account-form .journalit-prop-challenge-cost,
.create-account-form .journalit-prop-challenge-cost {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-4-2);
  padding: var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s);
}

.edit-account-form .journalit-prop-challenge-cost > .journalit-button,
.create-account-form .journalit-prop-challenge-cost > .journalit-button {
  justify-self: start;
}

.edit-account-form .journalit-prop-challenge-phase,
.create-account-form .journalit-prop-challenge-phase {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-2);
  padding: var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s);
}

.edit-account-form .journalit-prop-challenge-rule,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rule ,
.create-account-form .journalit-prop-challenge-rule {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
  padding-top: var(--size-4-2);
  border-top: 1px solid var(--background-modifier-border);
}

.edit-account-form .journalit-prop-challenge-row-header,
.create-account-form .journalit-prop-challenge-row-header {
  display: flex;
  align-items: center;
  gap: var(--size-4-2);
}

.edit-account-form .journalit-prop-challenge-row-header strong,
.create-account-form .journalit-prop-challenge-row-header strong {
  flex: 1;
}


.edit-account-form .journalit-prop-challenge-field,
.journalit-account-merge-modal__identity .journalit-prop-challenge-field ,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-field ,
.create-account-form .journalit-prop-challenge-field {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.edit-account-form .journalit-prop-challenge-field > input,
.journalit-account-merge-modal__identity .journalit-prop-challenge-field > input,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-field > input,
.journalit-account-merge-modal__field > input,
.journalit-account-merge-modal input.journalit-account-merge-modal__target-input,
.create-account-form .journalit-prop-challenge-field > input,
.edit-account-form .journalit-prop-challenge-field select,
.journalit-account-merge-modal__identity .journalit-prop-challenge-field select ,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-field select ,
.create-account-form .journalit-prop-challenge-field select {
  width: 100%;
  height: 30px;
  padding: 6px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 3px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 16px;
  line-height: 1.2;
  box-sizing: border-box;
}

.edit-account-form .journalit-prop-challenge-field select,
.journalit-account-merge-modal__identity .journalit-prop-challenge-field select ,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-field select ,
.create-account-form .journalit-prop-challenge-field select {
  height: 32px;
  padding: 5px 6px;
}

.edit-account-form .journalit-prop-challenge-field > input:focus,
.journalit-account-merge-modal__identity .journalit-prop-challenge-field > input:focus,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-field > input:focus,
.journalit-account-merge-modal__field > input:focus,
.journalit-account-merge-modal input.journalit-account-merge-modal__target-input:focus,
.create-account-form .journalit-prop-challenge-field > input:focus,
.edit-account-form .journalit-prop-challenge-field select:focus,
.journalit-account-merge-modal__identity .journalit-prop-challenge-field select:focus ,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-field select:focus ,
.create-account-form .journalit-prop-challenge-field select:focus {
  outline: none;
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 1px var(--interactive-accent);
}

.edit-account-form .journalit-prop-challenge-field > input:disabled,
.journalit-account-merge-modal__identity .journalit-prop-challenge-field > input:disabled,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-field > input:disabled,
.journalit-account-merge-modal__field > input:disabled,
.journalit-account-merge-modal input.journalit-account-merge-modal__target-input:disabled,
.create-account-form .journalit-prop-challenge-field > input:disabled,
.edit-account-form .journalit-prop-challenge-field select:disabled,
.journalit-account-merge-modal__identity .journalit-prop-challenge-field select:disabled ,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-field select:disabled ,
.create-account-form .journalit-prop-challenge-field select:disabled {
  background: var(--background-secondary);
  color: var(--text-muted);
  cursor: not-allowed;
}

.edit-account-form .journalit-prop-challenge-broker-accounts,
.create-account-form .journalit-prop-challenge-broker-accounts {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.edit-account-form .journalit-prop-challenge-broker-account,
.create-account-form .journalit-prop-challenge-broker-account {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.edit-account-form .journalit-prop-challenge-broker-account-meta,
.create-account-form .journalit-prop-challenge-broker-account-meta {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}


.edit-account-form .modal-save-accent,
.create-account-form .modal-save-accent {
  background-color: var(--interactive-accent) !important;
  color: var(--text-on-accent) !important;
  border-color: var(--interactive-accent) !important;
}

.create-account-form .setting-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: visible;
  min-width: auto;
}

.create-account-form .setting-item-name {
  font-weight: 600;
  color: var(--text-normal);
  font-size: 16px;
  margin-bottom: 2px;
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  word-break: break-word;
}

.create-account-form .setting-item-description {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.2;
  margin-bottom: 4px;
}

.create-account-form .setting-item-control {
  margin-top: 0;
}

.create-account-form .setting-item-control input:not(.journalit-fast-datetime__segment),
.create-account-form .setting-item-control select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 3px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 16px;
  height: 30px;
  line-height: 1.2;
  box-sizing: border-box;
}

.create-account-form .setting-item-control select {
  height: 32px;
  padding: 5px 6px;
}

.create-account-form .setting-item-control input:focus,
.create-account-form .setting-item-control select:focus {
  outline: none;
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 1px var(--interactive-accent);
}

.create-account-form .setting-item-control input:disabled {
  background: var(--background-secondary);
  color: var(--text-muted);
  cursor: not-allowed;
}

.edit-account-form .journalit-setting-item--full-width,
.create-account-form .journalit-setting-item--full-width {
  width: 100%;
}


.edit-account-form .journalit-drawdown-type-control,
.create-account-form .journalit-drawdown-type-control {
  align-self: stretch;
}

.edit-account-form .journalit-account-date-input,
.create-account-form .journalit-account-date-input {
  width: 100%;
}

.edit-account-form .journalit-account-date-input .journalit-fast-datetime__container,
.create-account-form .journalit-account-date-input .journalit-fast-datetime__container {
  justify-content: center;
  min-width: 0;
}

.edit-account-form .journalit-account-date-input .journalit-fast-datetime__container[data-date-only='true'],
.create-account-form .journalit-account-date-input .journalit-fast-datetime__container[data-date-only='true'] {
  justify-content: center;
}

.edit-account-form .journalit-account-date-input .journalit-fast-datetime__container[data-date-only='true'] .journalit-fast-datetime__calendar-button,
.create-account-form .journalit-account-date-input .journalit-fast-datetime__container[data-date-only='true'] .journalit-fast-datetime__calendar-button {
  position: static;
  margin-left: 8px;
}

.edit-account-form .journalit-account-date-input .journalit-fast-datetime__calendar-button,
.create-account-form .journalit-account-date-input .journalit-fast-datetime__calendar-button {
  flex-shrink: 0;
}


.journalit-create-account-modal {
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  padding-bottom: 0;
}

.journalit-create-account-modal .modal-title {
  margin: 0;
  padding: 0 0 var(--size-4-4);
  border-bottom: 1px solid var(--background-modifier-border);
  font-size: 24px;
  line-height: 1.2;
}

.journalit-create-account-modal .modal-content {
  overflow: visible;
}


.journalit-create-account-modal .create-account-form {
  gap: 0;
  max-height: none;
  padding-right: 0;
  overflow: visible;
}

.journalit-create-account-modal .create-account-form > .setting-item {
  margin: 0;
  padding: var(--size-4-5) 0;
  border-top: 0;
}

.journalit-create-account-modal
  .create-account-form
  > .setting-item:not(:first-child) {
  border-top: 0;
}

.journalit-create-account-modal
  .create-account-form
  > .journalit-copy-trading-section.journalit-copy-trading-section--compact {
  margin-top: -64px;
  margin-bottom: 64px;
  padding-top: 0;
  padding-bottom: 0;
}

.journalit-create-account-modal .create-account-form .setting-item.two-column {
  gap: var(--size-4-8);
}

.journalit-create-account-modal .create-account-form .setting-item-name {
  font-size: 15px;
  font-weight: var(--font-semibold);
}

.journalit-create-account-modal .create-account-form .setting-item-description {
  margin-bottom: var(--size-2-2);
  font-size: var(--font-ui-smaller);
  line-height: 1.35;
}

.journalit-create-account-modal .create-account-form .setting-item-control input:not(.journalit-fast-datetime__segment),
.journalit-create-account-modal .create-account-form .setting-item-control select,
.journalit-create-account-modal .create-account-form .journalit-prop-challenge-field > input,
.journalit-create-account-modal .create-account-form .journalit-prop-challenge-field select {
  min-height: 38px;
  border-radius: var(--radius-s);
  font-size: var(--font-ui-medium);
}

.journalit-create-account-modal
  .create-account-form
  .journalit-checkbox-setting-row
  > .jl-checkbox-wrapper {
  margin: 2px 0 0;
}

.edit-account-form .journalit-feature-toggle-row,
.create-account-form .journalit-feature-toggle-row {
  align-items: flex-start;
  width: 100%;
}

.edit-account-form
  .journalit-feature-toggle-row
  > .jl-checkbox-wrapper,
.create-account-form
  .journalit-feature-toggle-row
  > .jl-checkbox-wrapper {
  margin: 2px 0 0;
}

.edit-account-form
  .journalit-feature-toggle-row
  .setting-item-name,
.create-account-form
  .journalit-feature-toggle-row
  .setting-item-name {
  font-weight: var(--font-normal);
}

.edit-account-form
  .journalit-feature-toggle-row
  .setting-item-description,
.create-account-form
  .journalit-feature-toggle-row
  .setting-item-description {
  margin-bottom: 0;
}

.journalit-create-account-modal
  .create-account-form
  .journalit-copy-trading-section
  .journalit-checkbox-setting-label,
.journalit-create-account-modal
  .create-account-form
  .journalit-prop-challenge-section
  .journalit-checkbox-setting-label {
  font-weight: var(--font-normal);
}

.journalit-create-account-modal
  .create-account-form
  > .journalit-copy-trading-section,
.journalit-create-account-modal
  .create-account-form
  > .journalit-prop-challenge-section {
  border-top: 1px solid var(--background-modifier-border);
}

.journalit-create-account-modal
  .create-account-form
  .journalit-drawdown-type-control {
  width: calc(100% - var(--size-4-8));
  margin: 0 auto;
}

.journalit-create-account-modal .create-account-form .create-account-buttons {
  position: sticky;
  bottom: 0;
  z-index: 3;
  margin: 0;
  padding: var(--size-4-4) 0;
  background: var(--background-primary);
}

.edit-account-form .journalit-prop-challenge-section,
.create-account-form .journalit-prop-challenge-section {
  gap: var(--size-2-2);
}

.edit-account-form .journalit-prop-challenge-profile-identity,
.create-account-form .journalit-prop-challenge-profile-identity {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-5);
  width: 100%;
  padding: var(--size-4-4) 0;
  border-top: 0;
}

.edit-account-form .journalit-prop-challenge-identity-heading,
.journalit-account-merge-modal__identity .journalit-prop-challenge-identity-heading ,
.create-account-form .journalit-prop-challenge-identity-heading {
  font-size: var(--font-ui-medium);
  font-weight: var(--font-semibold);
}

.edit-account-form .journalit-prop-profile-picker,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker ,
.create-account-form .journalit-prop-profile-picker {
  gap: var(--size-4-2);
  padding: 0;
  border: 0;
  background: transparent;
}

.edit-account-form .journalit-prop-profile-picker__controls,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker__controls ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker__controls ,
.create-account-form .journalit-prop-profile-picker__controls {
  gap: var(--size-4-3);
}

.edit-account-form .journalit-prop-profile-picker__title,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker__title ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker__title ,
.create-account-form .journalit-prop-profile-picker__title {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-medium);
}

.edit-account-form .journalit-prop-profile-picker__apply,
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker__apply ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker__apply ,
.create-account-form .journalit-prop-profile-picker__apply {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  min-width: 32px;
  height: 32px;
  margin: 0;
  padding: 5px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-primary);
  color: var(--text-normal);
  box-shadow: none;
  box-sizing: border-box;
  cursor: pointer;
  line-height: 1;
  transition: background-color 0.2s ease, border-color 0.2s ease,
    color 0.2s ease;
}

.journalit-create-account-modal
  .create-account-form
  .journalit-prop-profile-picker__apply {
  width: 38px;
  min-width: 38px;
  height: 38px;
}

.edit-account-form .journalit-prop-profile-picker__apply:hover:not(:disabled),
.journalit-account-merge-modal__phase-rules .journalit-prop-profile-picker__apply:hover:not(:disabled) ,
.journalit-account-merge-modal__identity .journalit-prop-profile-picker__apply:hover:not(:disabled) ,
.create-account-form .journalit-prop-profile-picker__apply:hover:not(:disabled) {
  border-color: var(--interactive-accent);
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.edit-account-form .journalit-prop-challenge-phase-workspace,
.create-account-form .journalit-prop-challenge-phase-workspace {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
  padding-top: var(--size-4-5);
  border-top: 0;
}

.edit-account-form .journalit-prop-challenge-phase-timeline,
.create-account-form .journalit-prop-challenge-phase-timeline {
  --journalit-phase-marker-size: 20px;
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(96px, 1fr);
  gap: 0;
  width: 100%;
  padding: 2px var(--size-4-6);
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing: border-box;
  scrollbar-width: thin;
}

.edit-account-form .journalit-prop-challenge-phase-step:not(:first-child)::before,
.create-account-form
  .journalit-prop-challenge-phase-step:not(:first-child)::before {
  position: absolute;
  top: 9.5px;
  left: -50%;
  z-index: 0;
  width: 100%;
  height: 1px;
  background: var(--background-modifier-border-hover);
  content: '';
}

.edit-account-form .journalit-prop-challenge-phase-step,
.create-account-form .journalit-prop-challenge-phase-step {
  position: relative;
  z-index: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: var(--size-2-2);
  min-width: 0;
  min-height: 54px;
  padding: 0 var(--size-2-2);
  border: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  font-weight: var(--font-normal);
  cursor: pointer;
}

.edit-account-form .journalit-prop-challenge-phase-step:hover,
.create-account-form .journalit-prop-challenge-phase-step:hover {
  background: transparent;
  color: var(--text-normal);
}

.edit-account-form .journalit-prop-challenge-phase-step:focus-visible,
.create-account-form .journalit-prop-challenge-phase-step:focus-visible {
  outline: none;
}

.edit-account-form .journalit-prop-challenge-phase-step-marker,
.create-account-form .journalit-prop-challenge-phase-step-marker {
  position: relative;
  z-index: 1;
  display: block;
  width: var(--journalit-phase-marker-size);
  height: var(--journalit-phase-marker-size);
  border: 2px solid var(--background-modifier-border-hover);
  border-radius: 50%;
  background: var(--background-primary);
  box-sizing: border-box;
}

.edit-account-form .journalit-prop-challenge-phase-step.is-selected,
.create-account-form .journalit-prop-challenge-phase-step.is-selected {
  color: var(--interactive-accent);
}

.edit-account-form
  .journalit-prop-challenge-phase-step.is-selected
  .journalit-prop-challenge-phase-step-marker,
.create-account-form
  .journalit-prop-challenge-phase-step.is-selected
  .journalit-prop-challenge-phase-step-marker {
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 1px var(--interactive-accent);
  background: var(--background-primary);
}

.edit-account-form
  .journalit-prop-challenge-phase-step.is-current
  .journalit-prop-challenge-phase-step-marker,
.create-account-form
  .journalit-prop-challenge-phase-step.is-current
  .journalit-prop-challenge-phase-step-marker {
  border-color: var(--background-modifier-border-hover);
}

.edit-account-form
  .journalit-prop-challenge-phase-step.is-current
  .journalit-prop-challenge-phase-step-marker::after,
.create-account-form
  .journalit-prop-challenge-phase-step.is-current
  .journalit-prop-challenge-phase-step-marker::after {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--interactive-accent);
  content: '';
  transform: translate(-50%, -50%);
}

.edit-account-form
  .journalit-prop-challenge-phase-step.is-current.is-selected
  .journalit-prop-challenge-phase-step-marker,
.create-account-form
  .journalit-prop-challenge-phase-step.is-current.is-selected
  .journalit-prop-challenge-phase-step-marker {
  border-color: var(--interactive-accent);
}

.edit-account-form
  .journalit-prop-challenge-phase-step:focus-visible
  .journalit-prop-challenge-phase-step-marker,
.create-account-form
  .journalit-prop-challenge-phase-step:focus-visible
  .journalit-prop-challenge-phase-step-marker {
  box-shadow: inset 0 0 0 2px var(--interactive-accent);
}

.edit-account-form .journalit-prop-challenge-phase-step-label,
.create-account-form .journalit-prop-challenge-phase-step-label {
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-account-form .journalit-prop-challenge-phase-actions,
.create-account-form .journalit-prop-challenge-phase-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-account-form .journalit-prop-challenge-phase,
.create-account-form .journalit-prop-challenge-phase {
  gap: var(--size-4-4);
  padding: var(--size-4-4) 0 0;
  border: 0;
  border-radius: 0;
}

.edit-account-form .journalit-prop-challenge-row-header,
.create-account-form .journalit-prop-challenge-row-header {
  justify-content: flex-start;
}

.edit-account-form .journalit-prop-challenge-row-header strong,
.create-account-form .journalit-prop-challenge-row-header strong {
  flex: 0 1 auto;
  font-size: var(--font-ui-medium);
}

.edit-account-form .journalit-prop-challenge-rules,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rules ,
.create-account-form .journalit-prop-challenge-rules {
  gap: var(--size-2-2);
}

.journalit-create-account-modal .journalit-dropdown-select,
.journalit-edit-account-modal .journalit-dropdown-select {
  position: relative;
  width: 100%;
  min-width: 0;
}

.journalit-account-merge-modal .journalit-dropdown-select__trigger,
.journalit-create-account-modal .journalit-dropdown-select__trigger,
.journalit-edit-account-modal .journalit-dropdown-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-2-2);
  width: 100%;
  min-height: 38px;
  padding: 6px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 3px;
  background: var(--background-primary);
  box-shadow: none;
  color: var(--text-normal);
  font-size: 16px;
  font-weight: var(--font-normal);
  text-align: left;
}

.journalit-edit-account-modal .journalit-dropdown-select__trigger {
  min-height: 32px;
}

.journalit-account-merge-modal .journalit-dropdown-select__trigger:hover,
.journalit-create-account-modal .journalit-dropdown-select__trigger:hover,
.journalit-edit-account-modal .journalit-dropdown-select__trigger:hover {
  background: var(--background-modifier-hover);
}

.journalit-account-merge-modal .journalit-dropdown-select__trigger:focus-visible,
.journalit-create-account-modal .journalit-dropdown-select__trigger:focus-visible,
.journalit-edit-account-modal .journalit-dropdown-select__trigger:focus-visible {
  outline: none;
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 1px var(--interactive-accent);
}

.journalit-account-merge-modal .journalit-dropdown-select__summary,
.journalit-create-account-modal .journalit-dropdown-select__summary,
.journalit-edit-account-modal .journalit-dropdown-select__summary {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-account-merge-modal .journalit-dropdown-select__chevron,
.journalit-create-account-modal .journalit-dropdown-select__chevron,
.journalit-edit-account-modal .journalit-dropdown-select__chevron {
  flex: 0 0 auto;
  transition: transform 0.15s ease;
}

.journalit-account-merge-modal .journalit-dropdown-select__chevron.is-open,
.journalit-create-account-modal .journalit-dropdown-select__chevron.is-open,
.journalit-edit-account-modal .journalit-dropdown-select__chevron.is-open {
  transform: rotate(180deg);
}

.journalit-dropdown-select__menu {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.journalit-dropdown-select__menu .journalit-dropdown-select__option {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  min-width: 0;
  min-height: 0;
  padding: 6px 10px;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  cursor: pointer;
  font-size: 13px;
  font-weight: var(--font-normal);
  text-align: left;
  appearance: none;
  -webkit-appearance: none;
  transition: background-color 0.15s ease;
}


.journalit-dropdown-select__menu .journalit-dropdown-select__option-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-dropdown-select__menu .journalit-dropdown-select__option.is-selected {
  background: transparent;
  color: var(--text-normal);
}

.journalit-dropdown-select__menu .journalit-dropdown-select__option:hover,
.journalit-dropdown-select__menu .journalit-dropdown-select__option:focus-visible {
  outline: none;
  background: var(--background-modifier-hover);
}

.journalit-dropdown-select__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 2px;
  color: var(--text-on-accent);
  background: var(--background-primary);
  font-size: 10px;
  line-height: 1;
  box-sizing: border-box;
}

.journalit-dropdown-select__check.is-checked {
  border-color: var(--interactive-accent);
  background: var(--interactive-accent);
}

.edit-account-form .journalit-prop-challenge-rules-heading,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rules-heading ,
.create-account-form .journalit-prop-challenge-rules-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-4-3);
  padding: var(--size-4-2) 0;
}

.edit-account-form .journalit-prop-challenge-add-rule-menu,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-add-rule-menu ,
.create-account-form .journalit-prop-challenge-add-rule-menu {
  width: auto;
}

.edit-account-form
  .journalit-prop-challenge-add-rule-menu
  .journalit-dropdown-select__trigger,
.create-account-form
  .journalit-prop-challenge-add-rule-menu
  .journalit-dropdown-select__trigger {
  min-height: 28px;
  padding: 4px 8px;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.edit-account-form .journalit-prop-challenge-rules-empty,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rules-empty ,
.create-account-form .journalit-prop-challenge-rules-empty {
  padding: var(--size-4-3) var(--size-4-2);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  text-align: center;
}


.edit-account-form .journalit-prop-challenge-rule,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rule ,
.create-account-form .journalit-prop-challenge-rule {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  border: 0;
  border-radius: var(--radius-s);
  background: var(--background-secondary);
}

.edit-account-form .journalit-prop-challenge-rule-summary-row,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rule-summary-row ,
.create-account-form .journalit-prop-challenge-rule-summary-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--size-4-2);
  min-height: 40px;
}

.edit-account-form .journalit-prop-challenge-rule-toggle,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rule-toggle ,
.create-account-form .journalit-prop-challenge-rule-toggle {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(0, 1.6fr) auto;
  align-items: center;
  gap: var(--size-4-3);
  min-width: 0;
  min-height: 40px;
  padding: 0 0 0 var(--size-4-3);
  border: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  text-align: left;
  cursor: pointer;
}

.edit-account-form .journalit-prop-challenge-rule-toggle strong,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rule-toggle strong ,
.create-account-form .journalit-prop-challenge-rule-toggle strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.edit-account-form .journalit-prop-challenge-rule-toggle:hover,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rule-toggle:hover ,
.create-account-form .journalit-prop-challenge-rule-toggle:hover {
  background: transparent;
  color: var(--text-normal);
}

.edit-account-form .journalit-prop-challenge-rule-toggle:focus-visible,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rule-toggle:focus-visible ,
.create-account-form .journalit-prop-challenge-rule-toggle:focus-visible {
  outline: 1px solid var(--interactive-accent);
  outline-offset: -1px;
}

.edit-account-form .journalit-prop-challenge-rule-summary,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rule-summary ,
.create-account-form .journalit-prop-challenge-rule-summary {
  min-width: 0;
  overflow: hidden;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  font-weight: var(--font-normal);
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.edit-account-form .journalit-prop-challenge-rule-remove,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rule-remove ,
.create-account-form .journalit-prop-challenge-rule-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  min-width: 28px;
  height: 28px;
  margin: 0 var(--size-2-2) 0 0;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  box-shadow: none;
  box-sizing: border-box;
  color: var(--text-muted);
  cursor: pointer;
}

.edit-account-form .journalit-prop-challenge-rule-remove:hover:not(:disabled),
.create-account-form
  .journalit-prop-challenge-rule-remove:hover:not(:disabled) {
  border-color: var(--background-modifier-border);
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.edit-account-form .journalit-prop-challenge-rule-fields,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rule-fields ,
.create-account-form .journalit-prop-challenge-rule-fields {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-4-3);
  padding: var(--size-2-2) var(--size-4-3) var(--size-4-4);
}

.edit-account-form
  .journalit-prop-challenge-rule-fields
  .journalit-prop-challenge-field,
.journalit-account-merge-modal__phase-rules
  .journalit-prop-challenge-rule-fields
  .journalit-prop-challenge-field,
.create-account-form
  .journalit-prop-challenge-rule-fields
  .journalit-prop-challenge-field {
  display: grid;
  grid-template-columns: minmax(120px, 0.7fr) minmax(0, 1.3fr);
  align-items: center;
  gap: var(--size-4-3);
}

.edit-account-form .journalit-prop-payout-policy-editor__fields,
.create-account-form .journalit-prop-payout-policy-editor__fields {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-4);
}

.edit-account-form .journalit-prop-payout-policy-editor__group,
.create-account-form .journalit-prop-payout-policy-editor__group {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
}

.edit-account-form .journalit-prop-payout-policy-editor__group + .journalit-prop-payout-policy-editor__group,
.create-account-form .journalit-prop-payout-policy-editor__group + .journalit-prop-payout-policy-editor__group {
  padding-top: var(--size-4-3);
  border-top: 1px solid var(--background-modifier-border);
}

.edit-account-form .journalit-prop-payout-policy-editor__group-title,
.create-account-form .journalit-prop-payout-policy-editor__group-title {
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.edit-account-form .journalit-prop-payout-policy-editor__group-fields,
.create-account-form .journalit-prop-payout-policy-editor__group-fields {
  display: grid;
  gap: var(--size-4-3);
}

.edit-account-form .journalit-prop-payout-policy-editor__weekdays,
.create-account-form .journalit-prop-payout-policy-editor__weekdays {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--size-4-2);
  min-width: 0;
  margin: 0;
  padding: var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s);
}

.edit-account-form .journalit-prop-payout-policy-editor__weekdays legend,
.create-account-form .journalit-prop-payout-policy-editor__weekdays legend {
  padding: 0 var(--size-4-1);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.edit-account-form .journalit-prop-challenge-field-error,
.journalit-account-merge-modal__identity .journalit-prop-challenge-field-error ,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-field-error ,
.create-account-form .journalit-prop-challenge-field-error {
  color: var(--text-error);
  font-size: var(--font-ui-smaller);
}

.edit-account-form .journalit-prop-payout-policy-editor__weekdays label,
.create-account-form .journalit-prop-payout-policy-editor__weekdays label {
  display: flex;
  align-items: center;
  gap: var(--size-4-2);
  min-width: 0;
}

.edit-account-form .journalit-prop-payout-policy-editor__checks,
.create-account-form .journalit-prop-payout-policy-editor__checks {
  display: grid;
  gap: var(--size-4-3);
  gap: var(--size-4-3);
}

.edit-account-form
  .journalit-prop-payout-policy-editor__checks
  .journalit-prop-challenge-field
  .jl-checkbox-wrapper,
.create-account-form
  .journalit-prop-payout-policy-editor__checks
  .journalit-prop-challenge-field
  .jl-checkbox-wrapper {
  justify-self: start;
}


.edit-account-form .journalit-prop-challenge-costs,
.create-account-form .journalit-prop-challenge-costs {
  gap: 0;
  padding-top: var(--size-4-5);
}

.edit-account-form .journalit-prop-challenge-costs-heading,
.create-account-form .journalit-prop-challenge-costs-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  gap: var(--size-4-3);
  margin-bottom: var(--size-4-3);
}

.edit-account-form .journalit-prop-challenge-costs-heading-copy,
.create-account-form .journalit-prop-challenge-costs-heading-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--size-2-1);
}

.edit-account-form .journalit-prop-challenge-costs-columns,
.create-account-form .journalit-prop-challenge-costs-columns,
.edit-account-form .journalit-prop-challenge-cost,
.create-account-form .journalit-prop-challenge-cost {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.25fr) minmax(0, 0.75fr) minmax(0, 1.1fr) 28px;
  gap: var(--size-4-2);
  align-items: end;
}

.edit-account-form .journalit-prop-challenge-costs-columns,
.create-account-form .journalit-prop-challenge-costs-columns {
  padding: 0 var(--size-2-2) var(--size-2-2);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.edit-account-form .journalit-prop-challenge-cost,
.create-account-form .journalit-prop-challenge-cost {
  padding: var(--size-2-2) var(--size-2-2);
  border: 0;
  border-radius: 0;
}

.edit-account-form .journalit-prop-challenge-cost-date-field,
.create-account-form .journalit-prop-challenge-cost-date-field {
  min-width: 0;
}

.edit-account-form .journalit-prop-challenge-cost-date-picker,
.create-account-form .journalit-prop-challenge-cost-date-picker {
  min-width: 0;
}

.edit-account-form .journalit-prop-challenge-cost-date-picker .journalit-fast-datetime__container,
.create-account-form .journalit-prop-challenge-cost-date-picker .journalit-fast-datetime__container {
  height: 38px;
  min-width: 0;
  padding: 0 6px;
  border-radius: 3px;
  gap: 2px;
}

.edit-account-form .journalit-prop-challenge-cost-date-picker .journalit-fast-datetime__segment,
.create-account-form .journalit-prop-challenge-cost-date-picker .journalit-fast-datetime__segment {
  min-width: 0;
  width: 25px;
  max-width: 25px;
  height: 36px;
  padding: 0 1px;
  border: 0;
  background: transparent;
  font-size: var(--font-ui-small);
}

.edit-account-form .journalit-prop-challenge-cost-date-picker .journalit-fast-datetime__calendar-button,
.create-account-form .journalit-prop-challenge-cost-date-picker .journalit-fast-datetime__calendar-button {
  margin-left: auto;
  padding: 2px;
}

.edit-account-form .journalit-prop-challenge-phase-dates,
.create-account-form .journalit-prop-challenge-phase-dates {
  grid-column: 1 / -1;
  display: grid;
  
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--size-4-2);
  min-width: 0;
}

.edit-account-form .journalit-prop-challenge-phase-date-picker,
.create-account-form .journalit-prop-challenge-phase-date-picker {
  min-width: 0;
}

.edit-account-form .journalit-prop-challenge-phase-date-picker .journalit-fast-datetime__container,
.create-account-form .journalit-prop-challenge-phase-date-picker .journalit-fast-datetime__container {
  min-width: 0;
  height: 38px;
}

.edit-account-form .journalit-prop-challenge-cost .journalit-prop-challenge-field > span,
.create-account-form .journalit-prop-challenge-cost .journalit-prop-challenge-field > span {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  white-space: nowrap;
}

.edit-account-form .journalit-prop-challenge-costs-empty,
.create-account-form .journalit-prop-challenge-costs-empty {
  padding: var(--size-4-3) var(--size-4-2);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  text-align: center;
}

.edit-account-form .journalit-prop-challenge-costs > .journalit-button,
.create-account-form .journalit-prop-challenge-costs > .journalit-button {
  align-self: flex-start;
  margin-top: var(--size-2-2);
}

.edit-account-form .journalit-prop-challenge-add-cost,
.create-account-form .journalit-prop-challenge-add-cost {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2-1);
  min-height: 28px;
  padding: 4px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 3px;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.edit-account-form .journalit-prop-challenge-add-cost:hover:not(:disabled),
.create-account-form .journalit-prop-challenge-add-cost:hover:not(:disabled) {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.edit-account-form .journalit-prop-challenge-cost-remove,
.create-account-form .journalit-prop-challenge-cost-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: 28px;
  height: 28px;
  padding: 4px;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}

.edit-account-form .journalit-prop-challenge-cost-remove:hover:not(:disabled),
.create-account-form .journalit-prop-challenge-cost-remove:hover:not(:disabled) {
  background: var(--background-modifier-hover);
  color: var(--text-error);
}

.edit-account-form .journalit-prop-challenge-cost-remove:disabled,
.create-account-form .journalit-prop-challenge-cost-remove:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.create-account-error {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--text-error);
  border-radius: 6px;
  background: var(--background-secondary);
  margin-bottom: 12px;
  align-items: flex-start;
}

.create-account-error svg {
  color: var(--text-error);
  margin-top: 2px;
}

.create-account-error-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-normal);
}

.create-account-error-message {
  font-size: 0.9rem;
  color: var(--text-error);
}

.error-message-inline {
  color: var(--text-error);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.create-account-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-top: 1px solid var(--background-modifier-border);
  flex-shrink: 0;
}

.edit-account-buttons .journalit-button,
.add-event-buttons .journalit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 500;
  box-shadow: none;
  gap: 8px;
  user-select: none;
}

.edit-account-buttons .journalit-button--primary,
.add-event-buttons .journalit-button--primary {
  background: var(--interactive-accent);
  border-color: var(--interactive-accent);
  color: var(--text-on-accent);
}

.edit-account-buttons .journalit-button--primary:hover:not(:disabled),
.add-event-buttons .journalit-button--primary:hover:not(:disabled) {
  background: var(--interactive-accent-hover);
  border-color: var(--interactive-accent-hover);
}

.edit-account-buttons .journalit-button--secondary,
.add-event-buttons .journalit-button--secondary {
  background: transparent;
  border-color: var(--background-modifier-border);
  color: var(--text-muted);
}

.edit-account-buttons .journalit-button--secondary:hover:not(:disabled),
.add-event-buttons .journalit-button--secondary:hover:not(:disabled) {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.edit-account-buttons .delete-account-danger.journalit-button {
  background: var(--background-modifier-error);
  border-color: var(--background-modifier-error);
  color: var(--text-on-accent);
}

.edit-account-buttons .delete-account-danger.journalit-button:hover:not(:disabled) {
  opacity: 0.9;
}

.edit-account-form .save-account-button:not(:disabled),
.edit-account-form .delete-account-button:not(:disabled),
.edit-account-form .cancel-button:not(:disabled),
.add-event-buttons .add-event-button:not(:disabled),
.add-event-buttons .cancel-button:not(:disabled) {
  cursor: pointer;
}

.edit-account-form .save-account-button:disabled,
.edit-account-form .delete-account-button:disabled,
.edit-account-form .cancel-button:disabled,
.add-event-buttons .add-event-button:disabled,
.add-event-buttons .cancel-button:disabled {
  cursor: not-allowed;
}


.journalit-modal-button-container {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}

.journalit-modal-button-container button {
  padding: 8px 16px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-primary);
  color: var(--text-normal);
  cursor: pointer;
  font-size: 14px;
}

.journalit-modal-button-container button:hover {
  background: var(--background-modifier-hover);
}

.journalit-modal-button-container button.mod-cta {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border-color: var(--interactive-accent);
}

.journalit-modal-button-container button.mod-cta:hover {
  background: var(--interactive-accent-hover);
}

.journalit-modal-button-container button.mod-warning {
  background: var(--color-red);
  color: var(--text-on-accent);
  border-color: var(--color-red);
}

.journalit-modal-button-container button.mod-warning:hover {
  background: var(--color-red);
  opacity: 0.8;
}


.add-event-modal-container {
  max-width: 600px;
  width: 100%;
}

.add-event-modal-container .modal-title {
  margin: 0 0 12px 0;
  padding: 0;
  font-size: 18px;
}

.add-event-modal-container .add-event-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;
}

.add-event-modal-container .add-event-form .setting-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.add-event-modal-container .add-event-form .setting-item.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.add-event-modal-container .add-event-form .setting-item.two-column .column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.add-event-modal-container .add-event-form .setting-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.add-event-modal-container .add-event-form .setting-item-name {
  font-weight: 600;
  color: var(--text-normal);
  font-size: 16px;
  margin-bottom: 2px;
}

.add-event-modal-container .add-event-form .setting-item-description {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.2;
  margin-bottom: 4px;
}

.add-event-modal-container .add-event-form .setting-item-control {
  margin-top: 0;
}

.add-event-modal-container .add-event-form input,
.add-event-modal-container .add-event-form select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 3px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 16px;
  height: 30px;
  line-height: 1.2;
  box-sizing: border-box;
}

.add-event-modal-container .add-event-form select {
  height: 32px;
  padding: 5px 6px;
}

.add-event-modal-container .add-event-form input:focus,
.add-event-modal-container .add-event-form select:focus {
  outline: none;
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 1px var(--interactive-accent);
}

.add-event-modal-container .add-event-form input:disabled {
  background: var(--background-secondary);
  color: var(--text-muted);
  cursor: not-allowed;
}

.add-event-buttons {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--background-modifier-border);
  flex-shrink: 0;
}

.add-event-buttons .button-group-left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-event-buttons .button-group-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-event-buttons .add-event-button {
  min-width: 100px;
}

.add-event-buttons .cancel-button {
  min-width: 70px;
}


.deposits-withdrawals-section {
  overflow: hidden;
  margin: 0;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
}


.journalit-account-page-view .journalit-account-section-header-centered {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 32px 0 24px 0;
  gap: 16px;
}

.journalit-account-page-view .journalit-account-section-header-centered-line {
  flex: 1;
  height: 1px;
  background-color: var(--background-modifier-border);
  min-width: 20px;
}

.journalit-account-page-view .journalit-account-section-header-centered-title {
  flex-shrink: 0;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-normal);
  white-space: nowrap;
  padding: 0 8px;
}


.journalit-account-page-view
  .deposits-withdrawals-section
  .journalit-account-ledger-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding: 11px 12px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-account-page-view .journalit-account-ledger-title {
  min-width: 0;
  margin: 0;
  color: var(--text-normal);
  font-size: 13px;
  font-weight: 650;
  line-height: 1.3;
}

.journalit-account-page-view .journalit-account-ledger-summary {
  flex: 0 1 auto;
  min-width: 0;
  font-size: 12px;
  color: var(--text-muted);
  text-align: right;
}


.journalit-account-page-view .journalit-account-ledger-empty {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 8px;
  margin: 0;
  padding: 12px;
  font-size: 13px;
  color: var(--text-muted);
}

.journalit-account-page-view .journalit-account-ledger-empty-icon {
  display: inline-flex;
  flex: 0 0 auto;
  color: var(--text-faint);
}

.journalit-account-page-view .journalit-account-ledger-empty-icon svg {
  width: 14px;
  height: 14px;
}

.journalit-account-page-view .journalit-account-ledger-empty-hint {
  color: var(--text-faint);
}


.journalit-account-page-view .journalit-account-ledger {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}

.journalit-account-page-view .journalit-account-ledger th {
  padding: 8px 8px 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  text-align: left;
  white-space: nowrap;
}

.journalit-account-page-view .journalit-account-ledger td {
  padding: 10px 8px;
  font-size: 13px;
  color: var(--text-normal);
  border-top: 1px solid var(--background-modifier-border);
}


.journalit-account-page-view .journalit-account-ledger th:first-child,
.journalit-account-page-view .journalit-account-ledger td:first-child {
  padding-left: 12px;
}

.journalit-account-page-view .journalit-account-ledger th:last-child,
.journalit-account-page-view .journalit-account-ledger td:last-child {
  padding-right: 12px;
}

.journalit-account-page-view .journalit-account-ledger-row {
  cursor: pointer;
}

.journalit-account-page-view .journalit-account-ledger-row:hover {
  background: var(--background-modifier-hover);
}


.journalit-account-page-view button.journalit-account-ledger-edit {
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  height: auto;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.journalit-account-page-view button.journalit-account-ledger-edit:hover,
.journalit-account-page-view button.journalit-account-ledger-edit:active {
  background: transparent;
  box-shadow: none;
}

.journalit-account-page-view .journalit-account-ledger-edit:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}

.journalit-account-page-view .journalit-account-ledger-cell-date,
.journalit-account-page-view .journalit-account-ledger-cell-type {
  white-space: nowrap;
}

.journalit-account-page-view .journalit-account-ledger-type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.journalit-account-page-view .journalit-account-ledger-type svg {
  width: 13px;
  height: 13px;
}

.journalit-account-page-view .journalit-account-ledger-type-payout svg {
  color: var(--text-warning);
}

.journalit-account-page-view .journalit-account-ledger-type-deposit {
  color: var(--text-success);
}

.journalit-account-page-view .journalit-account-ledger-type-withdrawal {
  color: var(--text-warning);
}

.journalit-account-page-view .journalit-account-ledger-type-neutral {
  color: var(--text-muted);
}

.journalit-account-page-view td.journalit-account-ledger-cell-description {
  width: 100%;
  max-width: 0;
  min-width: 0;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-account-page-view .journalit-account-ledger-cell-amount,
.journalit-account-page-view .journalit-account-ledger-cell-balance {
  text-align: right;
  white-space: nowrap;
}

.journalit-account-page-view td.journalit-account-ledger-cell-amount {
  font-weight: 600;
}

.journalit-account-page-view td.journalit-account-ledger-cell-balance {
  color: var(--text-muted);
}

.journalit-account-page-view td.journalit-account-ledger-amount-deposit {
  color: var(--text-success);
}

.journalit-account-page-view td.journalit-account-ledger-amount-withdrawal {
  color: var(--text-warning);
}

.journalit-account-page-view td.journalit-account-ledger-amount-payout {
  color: var(--text-warning);
}

.journalit-account-page-view td.journalit-account-ledger-amount-neutral {
  color: var(--text-normal);
}


.journalit-account-page-view .warning {
  color: var(--text-warning);
  font-style: italic;
}



.journalit-prop-cockpit {
  overflow: hidden;
  margin: 0 0 18px;
  padding: 0;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
}


.journalit-prop-phase-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  padding: 11px 12px;
}

.journalit-prop-cockpit.is-masked .journalit-prop-phase-nav {
  padding-bottom: 11px;
}

.journalit-prop-phase-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
}

.journalit-prop-phase-heading {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--text-normal);
  font-size: 13px;
  font-weight: 650;
  line-height: 1.3;
}

.journalit-prop-phase-status {
  flex: 0 0 auto;
  padding: 2px 6px;
  border: 1px solid currentColor;
  border-radius: 4px;
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 650;
  line-height: 1.2;
  white-space: nowrap;
}

.journalit-prop-phase-status.is-warning {
  color: var(--text-warning);
}

.journalit-prop-phase-status.is-passed {
  color: var(--text-success);
}

.journalit-prop-phase-status.is-failed {
  color: var(--text-error);
}

.journalit-prop-phase-status.is-archived {
  color: var(--text-faint);
}


.journalit-prop-phase-status.is-pending {
  color: var(--text-faint);
}

.journalit-prop-phase-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 0 1 auto;
  min-width: 0;
}

.journalit-prop-phase-next {
  max-width: 180px;
  overflow-wrap: anywhere;
  color: var(--text-faint);
  font-size: 11px;
  line-height: 1.25;
  text-align: right;
}

.journalit-prop-phase-selector {
  position: relative;
  flex: 0 1 auto;
  min-width: 0;
}

.journalit-account-page-view button.journalit-prop-phase-selector-trigger {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  width: auto;
  max-width: 230px;
  height: auto;
  min-height: 0;
  padding: 3px 5px;
  border: 0 !important;
  border-radius: 4px;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  cursor: pointer;
  font-size: 13px;
  font-weight: var(--font-semibold);
  line-height: 1.25;
  text-align: right;
}

.journalit-account-page-view button.journalit-prop-phase-selector-trigger:hover,
.journalit-account-page-view button.journalit-prop-phase-selector-trigger:focus-visible {
  background: var(--background-modifier-hover) !important;
  color: var(--text-normal) !important;
}

.journalit-account-page-view button.journalit-prop-phase-selector-trigger:focus-visible {
  outline: 1px solid var(--interactive-accent);
  outline-offset: 1px;
}

.journalit-prop-phase-selector-name {
  min-width: 0;
  overflow-wrap: anywhere;
}

.journalit-prop-phase-selector-count {
  flex: 0 0 auto;
  color: var(--text-faint);
  font-size: 11px;
  font-weight: var(--font-normal);
  font-variant-numeric: tabular-nums;
}

.journalit-prop-phase-selector-trigger svg {
  flex: 0 0 auto;
  transition: transform 120ms ease;
}

.journalit-prop-phase-selector-trigger svg.is-open {
  transform: rotate(180deg);
}

.journalit-prop-phase-menu,
.journalit-prop-actions-popover {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 100;
  width: max-content;
  max-width: min(280px, calc(100cqw - 24px));
  margin-top: 4px;
  overflow: hidden;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-primary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


.journalit-prop-phase-menu {
  min-width: 0;
}

.journalit-prop-actions-popover {
  min-width: 190px;
}

.journalit-account-page-view
  .journalit-prop-phase-menu
  button.journalit-prop-phase-option {
  appearance: none;
  display: flex;
  align-items: flex-start;
  gap: 7px;
  width: 100%;
  height: auto;
  min-height: 0;
  padding: 6px 10px;
  border: none !important;
  border-radius: 0;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  cursor: pointer;
  font-size: 12px;
  justify-content: flex-start;
  text-align: left;
  white-space: normal;
}

.journalit-account-page-view
  .journalit-prop-phase-menu
  button.journalit-prop-phase-option:hover,
.journalit-account-page-view
  .journalit-prop-phase-menu
  button.journalit-prop-phase-option:focus-visible {
  background: var(--background-modifier-hover) !important;
  box-shadow: none !important;
  outline: none;
}

.journalit-prop-phase-option-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 12px;
  height: 16px;
}


.journalit-prop-actions-menu {
  position: relative;
  flex: 0 0 auto;
}


.journalit-account-page-view button.journalit-prop-actions-trigger {
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  padding: 0;
  border-radius: 3px;
}

.journalit-prop-actions-trigger:focus-visible {
  outline: 1px solid var(--interactive-accent);
  outline-offset: 1px;
}

.journalit-prop-actions-popover {
  min-width: 190px;
}

.journalit-account-page-view
  .journalit-prop-actions-popover
  button.journalit-prop-actions-item {
  appearance: none;
  width: 100%;
  height: auto;
  min-height: 0;
  padding: 6px 10px;
  border: none !important;
  border-radius: 0;
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  justify-content: flex-start;
  text-align: left;
}

.journalit-account-page-view
  .journalit-prop-actions-popover
  button.journalit-prop-actions-item:hover:not(:disabled),
.journalit-account-page-view
  .journalit-prop-actions-popover
  button.journalit-prop-actions-item:focus-visible:not(:disabled) {
  background: var(--background-modifier-hover) !important;
  background-color: var(--background-modifier-hover) !important;
  box-shadow: none !important;
  outline: none;
}

.journalit-account-page-view
  .journalit-prop-actions-popover
  button.journalit-prop-actions-item:disabled {
  background: transparent !important;
  color: var(--text-faint) !important;
  cursor: default;
  opacity: 0.55;
  box-shadow: none !important;
}

.journalit-account-page-view
  .journalit-prop-actions-popover
  button.journalit-prop-actions-item:disabled:hover {
  background: transparent !important;
  box-shadow: none !important;
}




.journalit-prop-ledger {
  display: grid;
  grid-template-columns: auto auto auto minmax(120px, 1fr) auto;
  align-content: start;
  padding: 10px 24px 14px 20px;
}

.journalit-prop-ledger-row {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: center;
}


.journalit-prop-ledger-section {
  grid-column: 1 / -1;
  padding: 16px 0 4px;
}

.journalit-prop-ledger-section-label {
  color: var(--text-faint);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.journalit-prop-ledger-cell {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 10px 0;
  overflow-wrap: anywhere;
}


.journalit-prop-ledger-glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  margin-right: 6px;
  color: var(--text-faint);
}

.journalit-prop-ledger-glyph.is-positive {
  color: var(--text-success);
}

.journalit-prop-ledger-glyph.is-attention {
  color: var(--text-muted);
}

.journalit-prop-ledger-glyph.is-warning {
  color: var(--text-warning);
}

.journalit-prop-ledger-glyph.is-negative {
  color: var(--text-error);
}

.journalit-prop-ledger-cell.is-rule {
  padding-right: 14px;
  color: var(--text-normal);
  font-size: 13px;
}

.journalit-prop-ledger-cell.is-value {
  padding-right: 16px;
}

.journalit-prop-ledger-value-text {
  color: var(--text-normal);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.journalit-prop-ledger-row.is-warning .journalit-prop-ledger-value-text {
  color: var(--text-warning);
}

.journalit-prop-ledger-row.is-negative .journalit-prop-ledger-value-text {
  color: var(--text-error);
}


.journalit-account-page-view .journalit-prop-ledger-info-trigger {
  flex: 0 0 auto;
  margin-left: 5px;
  color: var(--text-faint);
  cursor: help;
}

.journalit-account-page-view .journalit-prop-ledger-info-trigger:hover,
.journalit-account-page-view .journalit-prop-ledger-info-trigger:focus-visible {
  color: var(--text-muted);
}

.journalit-account-page-view .journalit-prop-ledger-info-trigger:focus-visible {
  outline: 1px solid var(--interactive-accent);
  outline-offset: 2px;
  border-radius: 2px;
}

.journalit-prop-ledger-info-icon {
  display: block;
}


.journalit-account-page-view button.journalit-native-button.journalit-prop-ledger-rule-trigger {
  padding-bottom: 1px;
  border-bottom: 1px dotted var(--text-faint);
  cursor: help;
}
.journalit-account-page-view button.journalit-native-button.journalit-prop-ledger-rule-trigger:hover,
.journalit-account-page-view button.journalit-native-button.journalit-prop-ledger-rule-trigger:focus-visible {
  border-bottom-color: var(--text-muted);
}
.journalit-account-page-view button.journalit-native-button.journalit-prop-ledger-rule-trigger:focus-visible {
  outline: 1px solid var(--interactive-accent);
  outline-offset: 2px;
  border-radius: 2px;
}


.journalit-prop-ledger-progress-track {
  position: relative;
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: 3px;
  background: var(--background-modifier-border);
}


.journalit-prop-ledger-progress-track.is-segmented {
  overflow: visible;
  border-radius: 0;
  background: transparent;
}


.journalit-prop-ledger-progress-track[data-has-limit='true'] {
  overflow: visible;
}

.journalit-prop-ledger-progress-limit {
  position: absolute;
  top: -3px;
  bottom: -3px;
  left: var(--journalit-prop-challenge-limit, 0%);
  width: 2px;
  margin-left: -1px;
  border-radius: 1px;
  background: var(--text-muted);
}

.journalit-prop-ledger-progress-fill {
  display: block;
  width: var(--journalit-prop-challenge-progress, 0%);
  height: 100%;
  border-radius: 3px;
  background: var(--interactive-accent);
}

.journalit-prop-ledger-row.is-positive .journalit-prop-ledger-progress-fill {
  background: var(--text-success);
}

.journalit-prop-ledger-row.is-warning .journalit-prop-ledger-progress-fill {
  background: var(--text-warning);
}

.journalit-prop-ledger-row.is-negative .journalit-prop-ledger-progress-fill {
  background: var(--text-error);
}

.journalit-prop-ledger-progress-fill[data-is-zero='true'] {
  display: none;
}

.journalit-prop-ledger-cell.is-requirement {
  padding-left: 14px;
  color: var(--text-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}


.journalit-prop-cockpit-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  border-top: 1px solid var(--background-modifier-border);
}

.journalit-prop-cockpit-body.has-payout {
  grid-template-columns: minmax(280px, 3fr) minmax(0, 7fr);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'payout-head ledger'
    'payout-detail ledger';
}

.journalit-prop-cockpit-body.has-payout .journalit-prop-ledger {
  grid-area: ledger;
  align-self: center;
}

.journalit-prop-cockpit-body.has-payout .journalit-prop-payout-head,
.journalit-prop-cockpit-body.has-payout .journalit-prop-payout-detail {
  border-right: 1px solid var(--background-modifier-border);
}

.journalit-prop-payout-head {
  grid-area: payout-head;
  padding: 14px 16px 0;
}

.journalit-prop-payout-detail {
  grid-area: payout-detail;
  padding: 0 16px 16px;
}

.journalit-prop-payout-head__hero {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.journalit-prop-payout-head__label {
  color: var(--text-muted);
  font-size: 12px;
}

.journalit-prop-payout-head__amount {
  color: var(--text-normal);
  font-size: 26px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}


.journalit-prop-payout-head__gates {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

.journalit-prop-payout-head__bar {
  --journalit-segmented-progress-height: 4px;
}

.journalit-prop-payout-head__bar .journalit-segmented-progress__segment {
  background: var(--text-warning);
}

.journalit-prop-payout-head__bar .journalit-segmented-progress__segment.is-met {
  background: var(--text-success);
}

.journalit-prop-payout-head__caption {
  color: var(--text-muted);
  font-size: 11px;
}

.journalit-prop-payout-detail__preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 14px;
  color: var(--text-muted);
  font-size: 12px;
}

.journalit-account-page-view .journalit-prop-payout-detail__preview input {
  width: 100%;
  text-align: left;
}

.journalit-prop-payout-detail__notice {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 8px 0 0;
  color: var(--text-warning);
  font-size: 12px;
}

.journalit-prop-payout-detail__notice.is-danger {
  color: var(--text-error);
}

.journalit-prop-payout-detail__notice.is-info {
  color: var(--text-muted);
}


.journalit-prop-payout-detail__lines {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 14px;
}

.journalit-prop-payout-detail__line {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.journalit-prop-payout-detail__line span {
  flex: 0 0 auto;
  color: var(--text-muted);
  font-size: 12px;
  white-space: nowrap;
}

.journalit-prop-payout-detail__line strong {
  color: var(--text-normal);
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.journalit-prop-payout-detail__provenance {
  display: block;
  margin-top: 10px;
  color: var(--text-faint);
  font-size: 11px;
}

.journalit-prop-cockpit-footer {
  border-top: 1px solid var(--background-modifier-border);
}


.journalit-prop-cockpit-footer .journalit-prop-payout-plan {
  margin: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.journalit-prop-cockpit-footer .journalit-collapsible-header {
  padding: 10px 16px;
  border-radius: 0;
  background: transparent;
}

.journalit-prop-cockpit-footer .journalit-collapsible-title {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
}

.journalit-prop-cockpit-footer
  .journalit-prop-payout-plan
  .journalit-collapsible-content {
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  gap: 12px;
  padding: 10px 16px 14px;
}

.journalit-prop-cockpit-footer .journalit-prop-payout-plan__grid {
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 8px 12px;
}

.journalit-prop-cockpit-footer .journalit-prop-payout-plan__grid label {
  flex: 0 1 220px;
}

.journalit-prop-cockpit-footer .journalit-prop-payout-plan__actions {
  flex: 0 0 auto;
  margin: 0;
}


.journalit-prop-cockpit-footer .journalit-collapsible-chevron {
  transform: rotate(-90deg);
}

.journalit-prop-cockpit-footer .journalit-collapsible-chevron.open {
  transform: rotate(0deg);
}


@container journalit-account-page (max-width: 1099px) {
  
  .journalit-account-page-view .journalit-account-metrics-panel {
    grid-template-columns: repeat(
      var(--journalit-metric-tracks-md, 4),
      minmax(0, 1fr)
    );
  }

  .journalit-account-page-view
    .journalit-account-metrics-panel
    .journalit-account-stat {
    grid-column: span var(--journalit-metric-span-md, 1);
  }
}

@container journalit-account-page (max-width: 699px) {

  .journalit-account-page-view .journalit-prop-cockpit-body.has-payout {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'payout-head'
      'ledger'
      'payout-detail';
  }

  .journalit-account-page-view
    .journalit-prop-cockpit-body.has-payout
    .journalit-prop-payout-head,
  .journalit-account-page-view
    .journalit-prop-cockpit-body.has-payout
    .journalit-prop-payout-detail {
    border-right: 0;
  }


  .journalit-account-page-view .journalit-prop-payout-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    padding: 14px 14px 16px;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-account-page-view .journalit-prop-payout-head__hero {
    align-items: baseline;
    flex-direction: row-reverse;
    justify-content: flex-end;
    gap: 8px;
  }

  .journalit-account-page-view .journalit-prop-payout-head__gates {
    align-items: flex-end;
    margin-top: 0;
    min-width: 140px;
  }

  .journalit-account-page-view .journalit-prop-payout-head__bar {
    width: 140px;
  }


  .journalit-account-page-view .journalit-prop-payout-detail {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
    gap: 0 16px;
    padding: 14px;
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-account-page-view .journalit-prop-payout-detail__preview {
    grid-column: 1;
    margin-top: 0;
  }

  .journalit-account-page-view .journalit-prop-payout-detail__notice {
    grid-column: 1;
  }

  .journalit-account-page-view .journalit-prop-payout-detail__lines {
    grid-column: 2;
    grid-row: 1 / span 5;
    margin-top: 0;
    padding-left: 16px;
    border-left: 1px solid var(--background-modifier-border);
  }

  .journalit-account-page-view .journalit-prop-payout-detail__provenance {
    grid-column: 1 / -1;
  }

  .journalit-account-page-view .journalit-prop-phase-nav {
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 12px;
  }


  .journalit-account-page-view .journalit-prop-phase-controls {
    justify-content: flex-end;
    margin-left: auto;
  }

  .journalit-account-page-view .journalit-prop-phase-next {
    margin-right: auto;
    text-align: left;
  }


  .journalit-account-page-view .journalit-prop-ledger {
    display: block;
    padding: 4px 14px 10px;
  }

  .journalit-account-page-view
    .journalit-prop-cockpit-body.has-payout
    .journalit-prop-ledger {
    align-self: auto;
  }

  .journalit-account-page-view .journalit-prop-ledger-row {
    grid-template-columns: auto auto auto minmax(0, 1fr);
    grid-template-areas:
      'state rule value requirement'
      'bar bar bar bar';
    align-items: baseline;
    padding: 8px 0;
  }

  .journalit-account-page-view .journalit-prop-ledger-cell {
    padding: 4px 0;
  }

  .journalit-account-page-view .journalit-prop-ledger-cell.is-state {
    grid-area: state;
  }

  .journalit-account-page-view .journalit-prop-ledger-cell.is-rule {
    grid-area: rule;
    padding-right: 8px;
  }

  .journalit-account-page-view .journalit-prop-ledger-cell.is-value {
    grid-area: value;
    padding-right: 8px;
  }

  .journalit-account-page-view .journalit-prop-ledger-cell.is-requirement {
    grid-area: requirement;
    padding-left: 0;
  }


  .journalit-account-page-view
    .journalit-prop-ledger-cell.is-requirement::before {
    content: '(';
  }

  .journalit-account-page-view
    .journalit-prop-ledger-cell.is-requirement::after {
    content: ')';
  }

  .journalit-account-page-view .journalit-prop-ledger-cell.is-progress {
    grid-area: bar;
    padding: 2px 0 0;
  }

  .journalit-account-page-view .journalit-prop-ledger-progress-track {
    height: 3px;
    border-radius: 2px;
  }

  .journalit-account-page-view .journalit-prop-ledger-progress-track.is-segmented {
    --journalit-segmented-progress-height: 3px;
  }

  .journalit-account-page-view .journalit-prop-ledger-section {
    padding: 14px 0 2px;
  }

  .journalit-account-page-view .journalit-account-metrics-panel {
    grid-template-columns: repeat(
      var(--journalit-metric-tracks-sm, 2),
      minmax(0, 1fr)
    );
  }

  .journalit-account-page-view
    .journalit-account-metrics-panel
    .journalit-account-stat {
    grid-column: span var(--journalit-metric-span-sm, 1);
  }
}

@container journalit-account-page (max-width: 519px) {
  .journalit-account-page-view button.journalit-account-back-button {
    width: 28px;
    padding: 0;
    justify-content: center;
  }

  .journalit-account-page-view .journalit-account-back-button-label {
    display: none;
  }

  .journalit-account-page-view
    .journalit-account-identity-actions
    button.journalit-toolbar-icon-button {
    width: 32px;
    min-width: 32px;
  }

  .journalit-account-page-view .journalit-account-stat {
    padding: 12px 10px 10px;
  }

  .journalit-account-page-view .journalit-account-stat-value {
    font-size: 17px;
  }

  .journalit-account-page-view .journalit-account-stat-label {
    font-size: 9px;
  }

  .journalit-account-page-view .journalit-account-identity-name {
    font-size: 1.2rem;
  }
}


.journalit-account-page-view .journalit-account-risk {
  margin: 24px 0;
}


.journalit-account-page-view
  .journalit-account-risk
  .journalit-account-section-header-centered {
  margin: 0 0 20px;
}


.journalit-account-page-view .journalit-account-risk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 24px;
}

.journalit-account-page-view .journalit-account-risk-metric {
  min-width: 0;
  padding: 20px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 12px;
}

.journalit-account-page-view .journalit-account-risk-metric-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.journalit-account-page-view .journalit-account-risk-metric-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.journalit-account-page-view .journalit-account-risk-metric-title {
  margin: 0;
  color: var(--text-normal);
  font-size: 16px;
  font-weight: 600;
}

.journalit-account-page-view .journalit-account-risk-metric-value {
  color: var(--text-normal);
  font-size: 24px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  text-align: right;
}


.journalit-account-page-view .journalit-account-risk-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 4px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 16px;
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}

.journalit-account-page-view .journalit-account-risk-badge.is-in-progress {
  border-color: var(--text-warning);
  color: var(--text-warning);
}

.journalit-account-page-view .journalit-account-risk-badge.is-achieved {
  border-color: var(--text-success);
  color: var(--text-success);
}

.journalit-account-page-view .journalit-account-risk-badge.is-breached {
  border-color: var(--text-error);
  color: var(--text-error);
}


.journalit-account-page-view .journalit-account-risk-bar {
  margin-bottom: 16px;
}

.journalit-account-page-view .journalit-account-risk-bar-track {
  position: relative;
  width: 100%;
  height: 12px;
  overflow: hidden;
  background-color: var(--background-modifier-border);
  border-radius: 6px;
}

.journalit-account-page-view .journalit-account-risk-bar-fill {
  position: relative;
  width: var(--journalit-horizontal-bar-fill-width, 0%);
  height: 100%;
  border-radius: 6px;
}

.journalit-account-page-view .journalit-account-risk-bar-fill.is-safe,
.journalit-account-page-view .journalit-account-risk-bar-fill.is-complete {
  background: var(--color-green);
}

.journalit-account-page-view .journalit-account-risk-bar-fill.is-warning {
  background: var(--text-warning);
}

.journalit-account-page-view .journalit-account-risk-bar-fill.is-critical {
  background: var(--color-red);
}

.journalit-account-page-view .journalit-account-risk-bar-fill.is-progress {
  background: var(--interactive-accent);
}


.journalit-account-page-view .journalit-account-risk-details {
  padding: 12px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  font-size: 16px;
}

.journalit-account-page-view .journalit-account-risk-detail-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.journalit-account-page-view .journalit-account-risk-detail-row:last-child {
  margin-bottom: 0;
}

.journalit-account-page-view .journalit-account-risk-detail-label {
  color: var(--text-muted);
  font-weight: 500;
}

.journalit-account-page-view .journalit-account-risk-detail-value {
  min-width: 0;
  color: var(--text-normal);
  font-weight: 600;
  overflow-wrap: anywhere;
  text-align: right;
}


.journalit-account-page-view .account-page-content > * {
  flex-shrink: 0;
  margin-top: 0;
  margin-bottom: 0;
}


@container journalit-account-page (max-width: 699px) {
  .journalit-account-page-view .journalit-account-risk-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
}


@container journalit-account-page (max-width: 699px) {
  .journalit-account-page-view .journalit-account-ledger-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .journalit-account-page-view .journalit-account-ledger-summary {
    text-align: left;
  }

  .journalit-account-page-view .journalit-account-ledger-cell-description {
    display: none;
  }
}


@container journalit-account-page (max-width: 419px) {
  .journalit-account-page-view .journalit-account-metrics-panel {
    grid-template-columns: minmax(0, 1fr);
  }

  
  .journalit-account-page-view .journalit-account-ledger-cell-balance {
    display: none;
  }

  .journalit-account-page-view
    .journalit-account-metrics-panel
    .journalit-account-stat {
    grid-column: 1 / -1;
  }

  .journalit-account-page-view
    .journalit-account-risk
    .journalit-account-section-header-centered {
    gap: 8px;
  }

  .journalit-account-page-view .journalit-account-risk-metric {
    padding: 16px;
  }

  .journalit-account-page-view .journalit-account-risk-metric-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-account-page-view .journalit-account-risk-metric-value {
    font-size: 20px;
    text-align: left;
  }

  .journalit-account-page-view .journalit-account-risk-details {
    font-size: 14px;
  }
}


@media (max-width: 768px) {
  .trade-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .trades-header-centered {
    margin: 24px 0 16px 0;
    gap: 12px;
  }
  
  .trades-header-title {
    font-size: 1rem;
    padding: 0 6px;
  }
  
  .trade-info,
  .trade-dates {
    flex-direction: column;
    gap: 8px;
  }
  
  
  .edit-account-modal-container {
    max-width: 90vw;
    max-height: none;
  }
  
  .edit-account-form {
    gap: 6px;
  }
  
  .edit-account-form .setting-item {
    margin-bottom: 6px;
  }
  
  .edit-account-form .setting-item.two-column {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .edit-account-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .edit-account-buttons .button-group-right {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
  
  .edit-account-buttons .save-account-button,
  .edit-account-buttons .cancel-button,
  .edit-account-buttons .delete-account-button {
    min-width: auto;
    width: 100%;
  }
  
  
  .create-account-modal-container {
    max-width: 90vw;
    max-height: none;
  }
  
  .create-account-form {
    max-height: none;
    gap: 6px;
  }
  
  .create-account-form .setting-item {
    margin-bottom: 6px;
  }
  
  .create-account-form .setting-item.two-column {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .create-account-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .create-account-buttons .create-account-button,
  .create-account-buttons .cancel-button {
    min-width: auto;
    width: 100%;
  }

  .journalit-create-account-modal {
    max-height: calc(100vh - 24px);
  }

  .edit-account-form .journalit-prop-challenge-identity,
  .create-account-form .journalit-prop-challenge-identity,
  .edit-account-form .journalit-prop-profile-picker__controls,
  .create-account-form .journalit-prop-profile-picker__controls,
  .edit-account-form .journalit-prop-challenge-phase-fields,
  .create-account-form .journalit-prop-challenge-phase-fields {
    grid-template-columns: 1fr;
  }

  .edit-account-form .journalit-prop-profile-picker__controls,
  .create-account-form .journalit-prop-profile-picker__controls {
    align-items: stretch;
  }

  .edit-account-form .journalit-prop-profile-picker__apply,
  .create-account-form .journalit-prop-profile-picker__apply {
    justify-self: start;
  }

  .edit-account-form .journalit-prop-challenge-phase-timeline,
  .create-account-form .journalit-prop-challenge-phase-timeline {
    grid-auto-columns: minmax(88px, 1fr);
    padding: 2px 0;
  }

  .edit-account-form .journalit-prop-challenge-rule-toggle,
  .create-account-form .journalit-prop-challenge-rule-toggle {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--size-2-2) var(--size-4-2);
  }

  .edit-account-form .journalit-prop-challenge-rule-summary,
  .create-account-form .journalit-prop-challenge-rule-summary {
    grid-column: 1;
    grid-row: 2;
  }

  .edit-account-form
    .journalit-prop-challenge-rule-toggle
    > .journalit-obsidian-icon,
  .create-account-form
    .journalit-prop-challenge-rule-toggle
    > .journalit-obsidian-icon {
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  .edit-account-form .journalit-prop-challenge-rule-fields,
  .create-account-form .journalit-prop-challenge-rule-fields {
    padding-right: 0;
    padding-left: 0;
  }

  .edit-account-form
    .journalit-prop-challenge-rule-fields
    .journalit-prop-challenge-field,
  .journalit-account-merge-modal__phase-rules
    .journalit-prop-challenge-rule-fields
    .journalit-prop-challenge-field,
  .create-account-form
    .journalit-prop-challenge-rule-fields
    .journalit-prop-challenge-field {
    grid-template-columns: 1fr;
    gap: var(--size-2-1);
  }

  .edit-account-form .journalit-prop-challenge-costs-columns,
  .create-account-form .journalit-prop-challenge-costs-columns {
    display: none;
  }

  .edit-account-form .journalit-prop-challenge-cost,
  .create-account-form .journalit-prop-challenge-cost {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .edit-account-form .journalit-prop-challenge-cost .journalit-prop-challenge-field > span,
  .create-account-form .journalit-prop-challenge-cost .journalit-prop-challenge-field > span {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    white-space: normal;
  }

  .edit-account-form .journalit-prop-challenge-cost > .journalit-button,
  .create-account-form .journalit-prop-challenge-cost > .journalit-button {
    justify-self: start;
  }
}


.modal
  .modal-content
  .account-dashboard-settings-modal-container
  .account-dashboard-settings-form
  .setting-item {
  padding: 16px 16px 16px 20px !important;
  border-radius: 8px !important;
  background-color: var(--background-secondary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  box-sizing: border-box;
}

.modal
  .modal-content
  .account-dashboard-settings-modal-container
  .account-dashboard-settings-form
  .setting-item-info {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.modal
  .modal-content
  .account-dashboard-settings-modal-container
  .account-dashboard-settings-form
  .setting-item-name {
  margin: 0 0 3px 0;
}

.modal
  .modal-content
  .account-dashboard-settings-modal-container
  .account-dashboard-settings-form
  .setting-item-description {
  margin: 0 0 4px 0;
}

.account-dashboard-settings-modal-container .available-account-types {
  margin-top: 8px;
  padding-left: 4px;
}



.account-dashboard-settings-modal-container .account-types-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.account-dashboard-settings-modal-container .account-type-badge-container {
  position: relative;
  display: inline-block;
}

.account-dashboard-settings-modal-container .account-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-normal);
  position: relative;
  transition: all 0.2s ease;
}

.account-dashboard-settings-modal-container .account-type-badge:hover {
  border-color: var(--color-accent);
  background: var(--background-secondary-alt);
}

.account-dashboard-settings-modal-container .journalit-account-type-delete-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-red);
  border: 1px solid var(--background-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
  z-index: 10;
  font-family: system-ui, -apple-system, sans-serif;
}

.account-dashboard-settings-modal-container .journalit-account-type-delete-btn:hover {
  background: var(--color-red-hover, #dc2626);
  transform: scale(1.1);
}

.account-dashboard-settings-modal-container .journalit-account-type-delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.account-dashboard-settings-modal-container .add-account-type-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.account-dashboard-settings-modal-container .add-account-type-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 6px;
  background: var(--interactive-accent);
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--text-on-accent);
  cursor: pointer;
  transition: all 0.2s ease;
}

.account-dashboard-settings-modal-container .add-account-type-btn:hover {
  background: var(--interactive-accent-hover);
}

.account-dashboard-settings-modal-container .add-account-type-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.account-dashboard-settings-modal-container .add-account-type-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  min-width: 200px;
}

.account-dashboard-settings-modal-container .account-type-name-input {
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
}

.account-dashboard-settings-modal-container .account-type-name-input:focus {
  border-color: var(--color-accent);
}

.account-dashboard-settings-modal-container .add-account-type-buttons {
  display: flex;
  gap: 6px;
}

.account-dashboard-settings-modal-container .add-account-type-confirm-btn,
.account-dashboard-settings-modal-container .add-account-type-cancel-btn {
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.account-dashboard-settings-modal-container .add-account-type-confirm-btn {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border-color: transparent;
}

.account-dashboard-settings-modal-container .add-account-type-confirm-btn:hover:not(:disabled) {
  background: var(--interactive-accent-hover);
}

.account-dashboard-settings-modal-container .add-account-type-confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.account-dashboard-settings-modal-container .add-account-type-cancel-btn {
  background: var(--background-primary);
  color: var(--text-normal);
}

.account-dashboard-settings-modal-container .add-account-type-cancel-btn:hover:not(:disabled) {
  background: var(--background-secondary);
  border-color: var(--color-accent);
}

.account-dashboard-settings-modal-container .no-account-types-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.account-dashboard-settings-modal-container .no-account-types {
  color: var(--text-muted);
  font-style: italic;
  font-size: 16px;
}


.account-type-delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(2px);
}

.account-dashboard-settings-modal-container .journalit-confirmation-panel {
  background: var(--background-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.delete-warning {
  padding: 12px;
  background: var(--background-secondary);
  border-radius: 6px;
  margin-bottom: 16px;
}

.delete-warning p {
  margin: 0;
  color: var(--text-normal);
  font-size: 14px;
}

.impact-analysis h4 {
  margin: 0 0 12px 0;
  color: var(--text-normal);
  font-size: 14px;
  font-weight: 600;
}

.impact-analysis h5 {
  margin: 12px 0 8px 0;
  color: var(--text-normal);
  font-size: 16px;
  font-weight: 500;
}

.impact-item {
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 500;
}

.impact-item.impact-critical {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-red);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.impact-item.impact-safe {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-green, #22c55e);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.affected-accounts ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
  list-style-type: disc;
}

.affected-accounts li {
  margin: 4px 0;
  color: var(--text-normal);
  font-weight: normal;
}

.migration-notice {
  margin-top: 12px;
  padding: 8px 12px;
  background: var(--background-secondary-alt);
  border-radius: 4px;
  font-size: 16px;
  color: var(--text-muted);
  border-left: 3px solid var(--color-accent);
}

.settings-cleanup {
  margin-top: 16px;
}

.settings-cleanup ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
  list-style-type: none;
}

.settings-cleanup li {
  margin: 4px 0;
  color: var(--text-normal);
  font-size: 16px;
}


.account-dashboard-settings-modal-container .account-migration-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001; 
  backdrop-filter: blur(2px);
}


.account-dashboard-settings-modal-container .account-migration-modal {
  max-width: 600px;
}

.migration-warning {
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  margin-bottom: 20px;
}

.migration-warning p {
  margin: 0 0 8px 0;
  color: var(--text-normal);
  font-size: 14px;
}

.migration-warning p:last-child {
  margin-bottom: 0;
}

.affected-accounts-list {
  margin: 8px 0 0 20px;
  padding: 0;
  list-style-type: disc;
}

.affected-accounts-list li {
  margin: 4px 0;
  color: var(--text-normal);
  font-size: 16px;
}

.migration-options h4 {
  margin: 0 0 16px 0;
  color: var(--text-normal);
  font-size: 16px;
  font-weight: 600;
}

.migration-option-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.migration-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.migration-option:hover {
  border-color: var(--color-accent);
  background: var(--background-secondary);
}

.migration-option input[type="radio"] {
  margin: 0;
  margin-top: 2px;
}

.migration-option input[type="radio"]:checked + .migration-option-content {
  color: var(--color-accent);
}

.migration-option.checked {
  border-color: var(--color-accent);
  background: var(--background-secondary);
}

.migration-option-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.migration-option-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-normal);
}

.migration-option-desc {
  font-size: 16px;
  color: var(--text-muted);
  line-height: 1.4;
}

.target-type-select {
  margin-top: 12px;
  padding: 12px;
  background: var(--background-secondary-alt);
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.target-type-select label {
  display: block;
  margin-bottom: 6px;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-normal);
}

.target-type-select select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 16px;
}

.target-type-select select:focus {
  outline: none;
  border-color: var(--color-accent);
}


@media (max-width: 768px) {
  .account-dashboard-settings-modal-container .account-types-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .account-dashboard-settings-modal-container .add-account-type-input {
    min-width: 100%;
  }
  
  .account-dashboard-settings-modal-container .add-account-type-buttons {
    width: 100%;
  }
  
  .account-dashboard-settings-modal-container .journalit-confirmation-panel {
    margin: 20px;
    width: calc(100vw - 40px);
    max-width: none;
  }
  
  .account-dashboard-settings-modal-container .journalit-confirmation-panel__actions {
    flex-direction: column;
  }
  
  .account-dashboard-settings-modal-container .journalit-confirmation-panel__action {
    width: 100%;
  }
}


@media (max-width: 600px) {
  .edit-account-form input,
  .edit-account-form select,
  .create-account-form input,
  .create-account-form select,
  .add-event-modal-container .add-event-form input,
  .add-event-modal-container .add-event-form select,
  .account-dashboard-settings-modal-container .account-type-name-input {
    font-size: 18px !important;
  }
}


.journalit-account-merge-modal .journalit-prop-prefill-match,
.journalit-account-merge-modal .journalit-prop-prefill-heading-link,
.edit-account-form .journalit-prop-prefill-match,
.edit-account-form .journalit-prop-prefill-heading-link,
.create-account-form .journalit-prop-prefill-match,
.create-account-form .journalit-prop-prefill-heading-link {
  cursor: pointer;
}

.journalit-account-merge-modal .journalit-prop-prefill-chevron,
.edit-account-form .journalit-prop-prefill-chevron,
.create-account-form .journalit-prop-prefill-chevron {
  flex: 0 0 auto;
  opacity: 0.7;
  transition: transform 120ms ease;
}

.journalit-account-merge-modal .journalit-prop-prefill-match:hover .journalit-prop-prefill-chevron,
.journalit-account-merge-modal .journalit-prop-prefill-heading-link:hover .journalit-prop-prefill-chevron,
.edit-account-form .journalit-prop-prefill-match:hover .journalit-prop-prefill-chevron,
.edit-account-form .journalit-prop-prefill-heading-link:hover .journalit-prop-prefill-chevron,
.create-account-form .journalit-prop-prefill-match:hover .journalit-prop-prefill-chevron,
.create-account-form .journalit-prop-prefill-heading-link:hover .journalit-prop-prefill-chevron {
  transform: translateX(2px);
}
`;


