


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


.account-page-header {
  padding: 16px 20px;
  margin: 0 0 20px 0;
  background-color: var(--background-secondary);
  border-radius: 8px;
  border: 1px solid var(--background-modifier-border);
}

.account-page-header h2 {
  margin: 0 0 4px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-normal);
}

.account-page-header p {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
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


.account-page-content {
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
}


.account-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--background-modifier-border);
}

.account-info p {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}


.journalit-account-page-view .account-metrics {
  margin: 24px 0;
}

.journalit-account-page-view .account-metrics h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: var(--text-normal);
}

.journalit-account-page-view .account-metrics .metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.journalit-account-page-view .account-metrics .metric-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
}

.journalit-account-page-view .account-metrics .metric-label {
  font-size: 16px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.journalit-account-page-view .account-metrics .metric-label--with-icon {
  display: flex;
  align-items: center;
  gap: 4px;
}

.journalit-account-page-view .account-metrics .metric-label-info-icon {
  font-size: 9px;
  opacity: 0.6;
  cursor: help;
}

.journalit-account-page-view .account-metrics .account-metrics-conversion-tooltip {
  max-width: 200px;
  font-size: 12px;
}

.journalit-account-page-view .account-metrics .account-metrics-conversion-tooltip-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.journalit-account-page-view .account-metrics .account-metrics-conversion-warning {
  margin-top: 4px;
  color: var(--text-warning, #f0a020);
}

.journalit-account-page-view .account-metrics .metric-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-normal);
}

.journalit-account-page-view .account-metrics .metric-value.positive {
  color: var(--text-success);
}

.journalit-account-page-view .account-metrics .metric-value.negative {
  color: var(--text-error);
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


.account-header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
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

.header-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.account-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
}

.info-label {
  font-weight: 500;
  color: var(--text-muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: var(--text-normal);
  font-size: 1.1rem;
  font-weight: 600;
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


.journalit-account-page-view .account-metrics .metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.journalit-account-page-view .account-metrics .metrics-subtitle {
  color: var(--text-muted);
  font-size: 14px;
}

.journalit-account-page-view .account-metrics .metric-value.neutral {
  color: var(--text-normal);
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


.edit-account-modal-container {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: min(80vh, 720px);
  min-height: 0;
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
  overflow: hidden;
}

.edit-account-form-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}

.edit-account-form .setting-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
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

.edit-account-form .journalit-copy-trading-toggle-row {
  margin-top: var(--size-2-2);
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

.create-account-form .journalit-copy-trading-toggle-row {
  margin-top: var(--size-2-2);
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

.edit-account-form .journalit-drawdown-radio-group,
.create-account-form .journalit-drawdown-radio-group {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.edit-account-form .journalit-drawdown-radio-option,
.create-account-form .journalit-drawdown-radio-option {
  width: 100%;
  min-height: 40px;
  padding: 10px 12px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-primary);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease,
    color 0.15s ease;
}

.edit-account-form .journalit-drawdown-radio-option:hover,
.create-account-form .journalit-drawdown-radio-option:hover {
  border-color: var(--interactive-accent-hover);
  color: var(--text-normal);
}

.edit-account-form .journalit-drawdown-radio-option.is-selected,
.create-account-form .journalit-drawdown-radio-option.is-selected {
  border-color: var(--interactive-accent);
  background: color-mix(
    in srgb,
    var(--interactive-accent) 12%,
    var(--background-primary)
  );
  color: var(--text-normal);
}

.edit-account-form .journalit-drawdown-radio-option:disabled,
.create-account-form .journalit-drawdown-radio-option:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  margin: 32px 0;
}

.section-header-centered {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 32px 0 24px 0;
  gap: 16px;
}

.section-header-line {
  flex: 1;
  height: 1px;
  background-color: var(--background-modifier-border);
  min-width: 20px;
}

.section-header-title {
  flex-shrink: 0;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-normal);
  white-space: nowrap;
  padding: 0 8px;
}

.empty-transactions {
  text-align: center;
  padding: 20px;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}


.transaction-item {
  padding: 16px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.transaction-item:hover {
  background: var(--background-modifier-hover);
}

.transaction-item.clickable {
  cursor: pointer;
}

.transaction-item.clickable:hover {
  background: var(--background-modifier-hover);
  border-color: var(--background-modifier-border-hover);
}

.transaction-item.deposit {
  border-left: 4px solid var(--color-info);
}

.transaction-item.withdrawal {
  border-left: 4px solid var(--text-warning);
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.transaction-primary-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.transaction-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
}

.transaction-type.deposit {
  background: rgba(37, 99, 235, 0.15);
  color: var(--color-info);
  font-weight: 600;
}

.transaction-type.withdrawal {
  background: rgba(234, 179, 8, 0.15);
  color: var(--text-warning);
  font-weight: 600;
}

.transaction-date {
  font-size: 16px;
  color: var(--text-muted);
}

.transaction-amount {
  font-weight: 600;
  font-size: 16px;
}

.transaction-amount.positive {
  color: var(--color-info);
}

.transaction-amount.negative {
  color: var(--text-warning);
}

.transaction-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transaction-description {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.description-label {
  font-size: 16px;
  color: var(--text-muted);
  font-weight: 500;
}

.description-text {
  font-size: 16px;
  color: var(--text-normal);
}

.transaction-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.balance-after {
  font-size: 16px;
  color: var(--text-muted);
  font-weight: 500;
}

.transaction-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.edit-transaction-btn,
.delete-transaction-btn {
  padding: 4px 8px;
  min-width: auto;
  height: auto;
}

.edit-transaction-btn {
  background-color: var(--interactive-accent);
  color: white;
  border-color: var(--interactive-accent);
}

.edit-transaction-btn:hover {
  background-color: var(--interactive-accent-hover);
}

.delete-transaction-btn {
  background-color: var(--color-red);
  color: white;
  border-color: var(--color-red);
}

.delete-transaction-btn:hover {
  background-color: var(--color-red);
  opacity: 0.8;
}

.transaction-description {
  color: var(--text-muted);
  font-style: italic;
  font-size: 16px;
}


.journalit-account-page-view .warning {
  color: var(--text-warning);
  font-style: italic;
}


.account-risk-metrics-section {
  margin: 32px 0;
}

.risk-metrics-container {
  display: flex;
  gap: 24px;
  margin-top: 24px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.risk-metric-box {
  flex: 1;
  min-width: 300px;
  background-color: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 12px;
  padding: 20px;
}

.risk-metric-box.not-set {
  opacity: 0.6;
}

.risk-metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-with-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.risk-metric-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-normal);
}

.risk-metric-percentage {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-normal);
  text-align: right;
}

.risk-metric-percentage.not-set {
  color: var(--text-muted);
  font-weight: 500;
  font-size: 16px;
}


.risk-status-badge {
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1.5px solid;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  flex-shrink: 0;
}

.risk-status-badge.in-progress {
  border-color: var(--color-warning);
  color: var(--color-warning);
  background: rgba(245, 158, 11, 0.1);
}

.risk-status-badge.achieved {
  border-color: var(--text-success);
  color: var(--text-success);
  background: rgba(var(--color-green-rgb), 0.1);
}

.risk-status-badge.breached {
  border-color: var(--text-error);
  color: var(--text-error);
  background: rgba(var(--color-red-rgb), 0.1);
}


.horizontal-bar-container {
  margin-bottom: 16px;
}

.horizontal-bar-track {
  width: 100%;
  height: 12px;
  background-color: var(--background-modifier-border);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.horizontal-bar-fill {
  height: 100%;
  width: var(--journalit-horizontal-bar-fill-width, 0%);
  border-radius: 6px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}


.horizontal-bar-fill.safe {
  background: linear-gradient(90deg, var(--color-green) 0%, var(--color-green) 100%);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
}

.horizontal-bar-fill.warning {
  background: linear-gradient(90deg, var(--text-warning) 0%, var(--text-warning) 100%);
  box-shadow: 0 2px 8px rgba(234, 179, 8, 0.2);
}

.horizontal-bar-fill.critical {
  background: linear-gradient(90deg, var(--color-red) 0%, var(--color-red) 100%);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}


.horizontal-bar-fill.progress {
  background: linear-gradient(90deg, var(--interactive-accent) 0%, var(--interactive-accent) 100%);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.horizontal-bar-fill.complete {
  background: linear-gradient(90deg, var(--color-green) 0%, var(--color-green) 100%);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
}


.risk-metric-details {
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  color: var(--text-muted);
  font-weight: 500;
}

.detail-value {
  color: var(--text-normal);
  font-weight: 600;
}

.detail-value.no-limit,
.detail-value.no-target {
  color: var(--text-muted);
  font-style: italic;
  text-align: center;
  width: 100%;
}


@media (max-width: 768px) {
  .account-page-header {
    margin: 0 0 16px 0;
    padding: 12px 16px;
  }
  
  .account-page-header h2 {
    font-size: 1.3rem;
  }
  
  
  .risk-metrics-container {
    flex-direction: column;
    gap: 16px;
  }
  
  .risk-metric-box {
    min-width: 0;
    width: 100%;
  }
  
  .risk-metric-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .header-left {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 4px;
  }
  
  .title-with-badge {
    gap: 8px;
  }
  
  .risk-metric-percentage {
    text-align: left;
    font-size: 20px;
  }
  
  .account-page-content {
    padding: 16px;
  }
  
  .account-header-main {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .edit-account-btn {
    align-self: flex-end;
    width: auto;
  }
  
  .account-info {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .journalit-account-page-view .account-metrics .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  
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
    max-height: 85vh;
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
    max-height: 85vh;
  }
  
  .create-account-form {
    max-height: 60vh;
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

  .edit-account-form .journalit-drawdown-radio-group,
  .create-account-form .journalit-drawdown-radio-group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

.account-dashboard-settings-modal-container .account-type-delete-btn {
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

.account-dashboard-settings-modal-container .account-type-delete-btn:hover {
  background: var(--color-red-hover, #dc2626);
  transform: scale(1.1);
}

.account-dashboard-settings-modal-container .account-type-delete-btn:disabled {
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

.account-type-delete-modal {
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

.account-type-delete-modal h3 {
  margin: 0 0 16px 0;
  color: var(--text-normal);
  font-size: 18px;
  font-weight: 600;
}

.delete-modal-content {
  margin-bottom: 20px;
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

.account-dashboard-settings-modal-container .delete-modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end; 
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.account-dashboard-settings-modal-container .delete-modal-actions .button {
  min-width: 100px;
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


.account-migration-modal {
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

.account-dashboard-settings-modal-container .delete-modal-actions .delete-confirm-button {
  background: var(--color-red) !important;
  color: white !important;
  border-color: var(--color-red) !important;
}

.account-dashboard-settings-modal-container .delete-modal-actions .delete-confirm-button:hover:not(:disabled) {
  background: var(--color-red-hover, #dc2626) !important;
  border-color: var(--color-red-hover, #dc2626) !important;
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
  
  .account-type-delete-modal {
    margin: 20px;
    width: calc(100vw - 40px);
    max-width: none;
  }
  
  .account-dashboard-settings-modal-container .delete-modal-actions {
    flex-direction: column;
  }
  
  .account-dashboard-settings-modal-container .delete-modal-actions .button {
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
`;


