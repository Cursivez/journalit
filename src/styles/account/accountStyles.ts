

export const ACCOUNT_STYLES = `

.journalit-account-note {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: var(--font-text);
  color: var(--text-normal);
}


.journalit-account .account-balance-chart-container {
  margin-bottom: 25px;
  border-radius: 8px;
  padding: 12px 16px;
  
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.journalit-account-chart-empty {
  height: var(--account-chart-empty-height, 0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.journalit-account-chart-tooltip {
  background-color: var(--background-primary);
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 180px;
  border: 1px solid var(--background-modifier-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-4px);
  position: relative;
}

.journalit-account-chart-tooltip-date {
  direction: ltr;
  unicode-bidi: isolate;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-normal);
  margin-bottom: 8px;
  text-align: center;
}

.journalit-account-chart-tooltip-value {
  direction: ltr;
  unicode-bidi: isolate;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: var(--text-normal);
}

.journalit-account-chart-tooltip-section {
  margin-top: 8px;
  padding: 6px 0;
  border-top: 1px solid var(--background-modifier-border);
  font-size: 13px;
}

.journalit-account-chart-tooltip-row {
  font-size: 13px;
  margin-bottom: 2px;
}

.journalit-account-chart-tooltip-row--compact {
  font-size: 12px;
}

.journalit-account-chart-tooltip-row--spaced {
  margin-bottom: 4px;
}

.journalit-account-chart-tooltip-row--emphasis {
  font-weight: 500;
}

.journalit-account-chart-tooltip-label {
  font-weight: 500;
}

.journalit-account-chart-tooltip-row--deposit {
  color: var(--text-accent);
}

.journalit-account-chart-tooltip-row--withdrawal {
  color: var(--text-warning, gold);
}

.journalit-account-chart-tooltip-row--positive {
  color: var(--text-success);
}

.journalit-account-chart-tooltip-row--negative {
  color: var(--text-error);
}

.journalit-account-chart-tooltip-row--neutral {
  color: var(--text-normal);
}

.journalit-account-chart-tooltip-list {
  margin-top: 4px;
}

.journalit-account-chart-tooltip-muted {
  color: var(--text-muted);
  font-style: italic;
}

.journalit-account-chart-tooltip-description {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
}

.journalit-account-chart-tooltip-drawdown {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-error);
}

.journalit-account-chart-tooltip-drawdown--masked {
  color: var(--text-muted);
}

.journalit-account .account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-account .account-name {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-normal);
}

.journalit-account .account-type {
  font-size: 1rem;
  color: var(--text-muted);
  background-color: var(--background-secondary);
  padding: 4px 8px;
  border-radius: 4px;
}

.journalit-account .account-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.journalit-account .account-metric {
  flex: 1;
  min-width: 200px;
  padding: 15px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.journalit-account .metric-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 5px;
}

.journalit-account .metric-value {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-normal);
}

.journalit-account .account-details,
.journalit-account .account-performance {
  margin-bottom: 30px;
}

.journalit-account h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-account .details-grid,
.journalit-account .metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.journalit-account .detail-item,
.journalit-account .metric-item {
  padding: 10px;
  background-color: var(--background-secondary);
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.journalit-account .detail-label,
.journalit-account .metric-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 5px;
}

.journalit-account .detail-value,
.journalit-account .metric-value {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-normal);
}


.journalit-account .cost-details {
  margin-top: 5px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.journalit-account .cost-total {
  font-weight: 500;
}

.journalit-account .cost-months {
  font-style: italic;
  font-size: 0.8rem;
}


.journalit-account .profit-target-item {
  grid-column: 1 / -1; 
  width: 100%;
  box-sizing: border-box;
  margin: 0;
}

.journalit-account .target-date {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-style: italic;
  margin-left: 5px;
}

.journalit-account .target-progress {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-left: 5px;
}

.journalit-account .profit-target-progress {
  margin-top: 10px;
}

.journalit-account .progress-container {
  width: 100%;
  height: 10px;
  background-color: var(--background-modifier-border);
  border-radius: 5px;
  overflow: hidden;
}

.journalit-account .progress-bar {
  height: 100%;
  background-color: var(--interactive-accent);
  color: var(--text-on-accent);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.journalit-account .progress-bar.complete {
  background-color: gold; 
}


.journalit-account .account-transactions {
  margin-top: 20px;
}


.journalit-account-dashboard-container {
  padding: 0;
  height: 100%;
  background-color: var(--background-primary);
}


.journalit-account-dashboard {
  container-name: journalit-account-dashboard;
  container-type: inline-size;
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 20px 20px 20px;
  --account-dashboard-content-gutter: 20px;
  --account-dashboard-space-xs: 8px;
  --account-dashboard-space-sm: 12px;
  --account-dashboard-space-md: 16px;
  --account-dashboard-space-lg: 20px;
  --account-dashboard-space-xl: 24px;
  --account-dashboard-space-xxl: 32px;
}

.journalit-account-dashboard .dashboard-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}


.virtualized-account-list {
  height: var(--journalit-account-list-height, 400px);
  overflow-y: auto;
  position: relative;
}

.virtualized-account-list__spacer {
  height: var(--journalit-account-list-total-height, 0px);
  position: relative;
}

.virtualized-account-list__row {
  margin-bottom: 15px;
}


.journalit-account-dashboard .aum-chart {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


.journalit-account-dashboard .dashboard-title p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.journalit-account-dashboard .dashboard-actions .account-dashboard-trade-type-filter {
  width: auto;
}


.account-dashboard-settings-modal-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 12px;
}


.folder-migration-modal-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 12px;
}

.folder-migration-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.folder-migration-modal {
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  padding: 0;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.migration-warning-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(var(--color-red-rgb), 0.1) 0%, rgba(var(--color-red-rgb), 0.05) 100%);
  border-bottom: 1px solid var(--background-modifier-border);
  border-radius: 8px 8px 0 0;
}

.migration-warning-header .warning-icon {
  color: var(--text-error);
  flex-shrink: 0;
}

.migration-warning-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-error);
  border: none;
  padding: 0;
}

.migration-content {
  padding: 24px;
}

.migration-warning {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(var(--color-red-rgb), 0.1);
  border: 1px solid rgba(var(--color-red-rgb), 0.3);
  border-radius: 6px;
}

.migration-warning p {
  margin: 0 0 8px 0;
  color: var(--text-normal);
  line-height: 1.5;
}

.migration-warning p:last-child {
  margin-bottom: 0;
}

.migration-details {
  margin-bottom: 24px;
}

.migration-path-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
}

.migration-path {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.migration-path .path-label {
  font-weight: 500;
  color: var(--text-muted);
  min-width: 50px;
}

.migration-path .path-text {
  background: var(--background-modifier-form-field);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: var(--font-monospace);
  font-size: 0.9rem;
  color: var(--text-normal);
  flex: 1;
}

.migration-arrow {
  color: var(--text-muted);
  align-self: center;
  margin: 4px 0;
}

.impact-analysis {
  margin-bottom: 24px;
}

.impact-analysis h4 {
  margin: 0 0 12px 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-normal);
}

.impact-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.impact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--background-secondary);
  border-radius: 4px;
  border-left: 3px solid var(--interactive-accent);
}

.impact-item svg {
  color: var(--text-accent);
  flex-shrink: 0;
}

.impact-item span {
  color: var(--text-normal);
  line-height: 1.4;
}

.backup-notice {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  border-left: 4px solid var(--interactive-accent);
}

.backup-notice-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.backup-notice-header svg {
  color: var(--text-accent);
}

.backup-notice-header h5 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-normal);
}

.backup-notice p {
  margin: 0 0 8px 0;
  color: var(--text-normal);
  line-height: 1.5;
}

.backup-details {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--background-modifier-border);
}

.backup-details span {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.backup-details code {
  background: var(--background-modifier-form-field);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: var(--font-monospace);
  font-size: 0.85rem;
}

.safety-information {
  margin-bottom: 24px;
}

.safety-information h5 {
  margin: 0 0 8px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-normal);
}

.safety-information ul {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.safety-information li {
  margin-bottom: 4px;
  color: var(--text-normal);
  line-height: 1.4;
  position: relative;
  padding-left: 4px;
}

.safety-information li::before {
  content: '✓';
  color: var(--text-success);
  font-weight: 600;
  position: absolute;
  left: -16px;
}

.final-warning {
  padding: 16px;
  background: rgba(var(--color-red-rgb), 0.1);
  border: 1px solid rgba(var(--color-red-rgb), 0.2);
  border-radius: 6px;
  margin-bottom: 0;
}

.final-warning p {
  margin: 0;
  color: var(--text-normal);
  line-height: 1.5;
}


.migration-progress-bar {
  width: 100%;
  height: 8px;
  background: var(--background-modifier-border, #e0e0e0);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.migration-progress-fill {
  height: 100%;
  background: var(--interactive-accent, #007acc);
  color: var(--text-on-accent);
  transition: width 0.3s ease;
  border-radius: 4px;
  
}


.migration-progress-section {
  background: var(--background-primary);
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid var(--background-modifier-border);
}

.migration-progress-section h4 {
  margin: 0 0 16px 0;
  color: var(--text-normal);
  font-weight: 600;
  font-size: 14px;
}

.progress-container {
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--background-secondary, #f0f0f0);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: var(--interactive-accent, #007acc);
  color: var(--text-on-accent);
  transition: width 0.3s ease;
  border-radius: 4px;
  
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-phase {
  font-weight: 600;
  color: var(--text-normal);
  font-size: 13px;
  text-transform: capitalize;
}

.progress-message {
  color: var(--text-muted);
  font-size: 12px;
  flex: 1;
  text-align: center;
  margin: 0 16px;
}

.progress-percentage {
  font-weight: 600;
  color: var(--text-normal);
  font-size: 13px;
}

.detailed-progress {
  background: var(--background-secondary);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 8px;
}


.migration-result-section {
  background: var(--background-primary);
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid var(--background-modifier-border);
}

.migration-result-section.success {
  border-color: var(--text-success);
  background: var(--background-primary);
}

.migration-result-section.error {
  border-color: var(--text-error);
  background: var(--background-primary);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 14px;
}

.migration-result-section.success .result-header {
  color: var(--text-success);
}

.migration-result-section.error .result-header {
  color: var(--text-error);
}

.result-details {
  color: var(--text-normal);
}

.result-details p {
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.migration-stats {
  display: flex;
  gap: 24px;
  margin: 12px 0;
  padding: 12px;
  background: var(--background-secondary);
  border-radius: 4px;
  font-size: 13px;
}

.migration-stats span {
  color: var(--text-muted);
}

.backup-info {
  margin-top: 16px;
  padding: 12px;
  background: var(--background-secondary);
  border-radius: 4px;
  border-left: 3px solid var(--interactive-accent);
}

.backup-info p {
  margin: 0 0 8px 0;
  color: var(--text-normal);
  font-size: 13px;
}

.backup-info code {
  background: var(--background-primary);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: var(--font-monospace);
  color: var(--text-accent);
  font-size: 12px;
}

.backup-cleanup-note {
  color: var(--text-muted) !important;
  font-size: 12px !important;
  margin-top: 8px !important;
}

.error-message {
  color: var(--text-error) !important;
  background: var(--background-secondary);
  padding: 8px 12px;
  border-radius: 4px;
  font-family: var(--font-monospace);
  font-size: 12px;
  margin: 8px 0;
}

.rollback-info {
  color: var(--text-accent) !important;
  background: var(--background-secondary);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  margin: 8px 0;
}

.close-migration-button {
  min-width: 80px;
  padding: 8px 16px;
}

.migration-modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  background: var(--background-secondary);
  border-top: 1px solid var(--background-modifier-border);
  border-radius: 0 0 8px 8px;
}

.cancel-migration-button {
  min-width: 100px;
  padding: 8px 16px;
}

.confirm-migration-button {
  min-width: 120px;
  padding: 8px 16px;
}

.migration-danger-button {
  background-color: var(--text-error) !important;
  border-color: var(--text-error) !important;
  color: white !important;
}

.migration-danger-button:hover {
  background-color: var(--background-modifier-error-hover) !important;
  border-color: var(--background-modifier-error-hover) !important;
}


@media (max-width: 600px) {
  .folder-migration-modal {
    margin: 10px;
    max-width: calc(100vw - 20px);
  }

  .migration-content {
    padding: 16px;
  }

  .migration-warning-header {
    padding: 16px;
  }

  .migration-path-container {
    padding: 12px;
  }

  .migration-path .path-text {
    font-size: 0.8rem;
    word-break: break-all;
  }

  .migration-modal-actions {
    flex-direction: column;
    gap: 8px;
    padding: 16px;
  }

  .cancel-migration-button,
  .confirm-migration-button {
    width: 100%;
  }
}

.account-dashboard-settings-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.account-dashboard-settings-form .setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  padding-left: 20px;
  background-color: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  margin: 0;
  box-sizing: border-box;
}

.account-dashboard-settings-form .setting-item:last-child {
  border-bottom: 1px solid var(--background-modifier-border);
}

.account-dashboard-settings-form .setting-item-info {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.account-dashboard-settings-form .setting-item-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-normal);
  margin: 0 0 3px 0;
}

.account-dashboard-settings-form .setting-item-description {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
  margin: 0 0 4px 0;
}

.account-dashboard-settings-form .setting-item-control {
  width: 100%;
}


.account-dashboard-settings-form .setting-item.journalit-legacy-challenge-entry {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.account-dashboard-settings-form
  .journalit-legacy-challenge-entry
  .setting-item-info,
.account-dashboard-settings-form
  .journalit-legacy-challenge-entry
  .setting-item-control {
  width: auto;
}

.account-dashboard-settings-form
  .journalit-legacy-challenge-entry
  .setting-item-name {
  margin: 0;
}

.account-dashboard-settings-form .available-account-types {
  width: 100%;
}

.account-dashboard-settings-form .challenge-stage-type-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.account-dashboard-settings-form .challenge-stage-type-row {
  display: grid;
  grid-template-columns: 1fr minmax(140px, 180px);
  align-items: center;
  gap: 12px;
}

.account-dashboard-settings-form .challenge-stage-type-label {
  font-size: 13px;
  color: var(--text-normal);
  text-align: left;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-dashboard-settings-form .challenge-stage-type-dropdown {
  width: 100%;
  min-width: 0;
}

.account-dashboard-settings-form
  .challenge-stage-type-dropdown
  .journalit-dropdown-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
  text-align: left;
}

.account-dashboard-settings-form .available-account-types > div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
  align-items: flex-start;
}

.account-type-badge {
  padding: 6px 12px;
  border-radius: 6px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  color: var(--text-normal);
  font-size: 13px;
  font-weight: 500;
}

.no-account-types {
  color: var(--text-muted);
  font-style: italic;
  text-align: left;
}


.account-types-settings-table {
  width: 100%;
}

.account-types-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-type-setting-row {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
}

.account-type-name {
  font-weight: 500;
  color: var(--text-normal);
  flex: 1;
  margin-right: 16px;
  min-width: 0;
  text-align: left;
}

.account-type-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-normal);
  cursor: pointer;
  white-space: nowrap;
}

.toggle-label input[type="checkbox"] {
  margin: 0;
  cursor: pointer;
  transform: scale(0.9);
}


.account-type-order-container {
  width: 100%;
  max-width: none;
  margin: 0;
}

.account-type-order-list {
  background-color: transparent;
  border: 0;
  border-radius: 0;
  padding: 0;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-list-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 3px;
  transition: background-color 0.15s ease;
}

.order-list-item:hover {
  background-color: var(--background-modifier-hover);
}

.order-list-item .type-name {
  font-weight: 500;
  color: var(--text-normal);
  flex: 1;
  font-size: 13px;
  text-align: left;
  margin-right: 12px;
}

.order-controls {
  display: flex;
  gap: 2px;
  margin-left: auto;
  flex-shrink: 0;
}

.order-button {
  background-color: transparent;
  border: 1px solid var(--background-modifier-border);
  color: var(--text-muted);
  border-radius: 3px;
  padding: 4px 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.15s ease;
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.order-button:hover:not(:disabled) {
  background-color: var(--background-modifier-hover);
  color: var(--text-normal);
  border-color: var(--background-modifier-border-hover);
}

.order-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.settings-modal-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--background-modifier-border);
}

.settings-modal-buttons .save-settings-button {
  min-width: 90px;
  padding: 8px 16px;
}

.settings-modal-buttons .cancel-button {
  min-width: 60px;
  padding: 8px 12px;
}

.account-dashboard-settings-modal-container
  .settings-modal-buttons
  .journalit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 500;
  box-shadow: none;
}

.account-dashboard-settings-modal-container
  .settings-modal-buttons
  .journalit-button:not(:disabled) {
  cursor: pointer;
}

.account-dashboard-settings-modal-container
  .settings-modal-buttons
  .journalit-button:disabled {
  cursor: not-allowed;
}

.account-dashboard-settings-modal-container
  .settings-modal-buttons
  .journalit-button--primary {
  background: var(--interactive-accent);
  border-color: var(--interactive-accent);
  color: var(--text-on-accent);
}

.account-dashboard-settings-modal-container
  .settings-modal-buttons
  .journalit-button--primary:hover:not(:disabled) {
  background: var(--interactive-accent-hover);
  color: var(--text-on-accent);
  border-color: var(--interactive-accent-hover);
}

.account-dashboard-settings-modal-container
  .settings-modal-buttons
  .journalit-button--secondary {
  background: transparent;
  border-color: var(--background-modifier-border);
  color: var(--text-muted);
}

.account-dashboard-settings-modal-container
  .settings-modal-buttons
  .journalit-button--secondary:hover:not(:disabled) {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}


@media (max-width: 600px) {
  .account-dashboard-settings-modal-container {
    padding: 0 8px;
  }
  
  .account-dashboard-settings-form .setting-item {
    padding: 12px;
  }
  
  .account-type-setting-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 10px;
  }
  
  .account-dashboard-settings-form .challenge-stage-type-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  
  .account-type-name {
    margin-right: 0;
    margin-bottom: 4px;
  }
  
  .account-type-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .toggle-label {
    justify-content: flex-start;
  }
  
  .settings-modal-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .settings-modal-buttons .save-settings-button,
  .settings-modal-buttons .cancel-button {
    min-width: auto;
    width: 100%;
  }
}

.journalit-account-dashboard .journalit-account-dashboard-empty-state {
  height: auto;
  min-height: 420px;
  margin-top: 20px;
  padding: 56px 24px;
}

@media (max-width: 768px) {
  .journalit-account-dashboard .journalit-account-dashboard-empty-state {
    min-height: 320px;
    margin-top: 12px;
    padding: 32px 16px;
  }
}


.journalit-account-dashboard-placeholder {
  text-align: center;
  padding: 40px 20px;
  background: var(--journalit-detail-card-surface);
  border-radius: 8px;
  margin-top: 20px;
}

.journalit-account-dashboard-placeholder h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: var(--text-normal);
}

.journalit-account-dashboard-placeholder p {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 15px;
}

.journalit-account-dashboard-placeholder ul {
  text-align: left;
  max-width: 400px;
  margin: 20px auto;
}

.journalit-account-dashboard-placeholder li {
  margin-bottom: 8px;
  color: var(--text-normal);
}


.withdrawal-breakdown-tooltip {
  min-width: 160px;
  max-width: 240px;
}

.withdrawal-breakdown-empty {
  color: var(--text-muted);
  font-size: 12px;
  text-align: center;
  padding: 4px 0;
}

.withdrawal-breakdown-year {
  margin-bottom: 8px;
}

.withdrawal-breakdown-year:last-child {
  margin-bottom: 0;
}

.withdrawal-breakdown-year-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-normal);
  margin-bottom: 4px;
  padding-bottom: 3px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.withdrawal-breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
  gap: 12px;
}

.withdrawal-breakdown-month {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.withdrawal-breakdown-amount {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-normal);
  white-space: nowrap;
}


.journalit-account-dashboard .dashboard-metrics .tooltip-trigger--inline .metric-item,
.journalit-account-dashboard .account-type-header .tooltip-trigger--inline .metric-item,
.journalit-account-dashboard .account-card .tooltip-trigger--inline .metric-item {
  cursor: help;
}


.journalit-account-dashboard .dashboard-metrics > .tooltip-trigger--inline {
  flex: 1;
  min-width: 180px;
  max-width: 300px;
}


.withdrawal-info-icon {
  opacity: 0.45;
  margin-left: 3px;
  vertical-align: middle;
  flex-shrink: 0;
}

.journalit-account-dashboard .metric-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}


.journalit-account-dashboard {
  --account-dashboard-content-gutter: 16px;
}

.journalit-account-dashboard .dashboard-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  margin-bottom: 14px;
  padding: 10px 0 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  min-height: 42px;
}

.journalit-account-dashboard .dashboard-actions {
  grid-column: -2 / -1;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-self: end;
}

.journalit-account-dashboard .dashboard-header:not(.has-mode-switch) {
  grid-template-columns: minmax(0, 1fr) auto;
}

.journalit-account-dashboard .journalit-account-dashboard-mode-switch {
  justify-self: center;
  width: 280px;
  
  max-width: 100%;
}

.journalit-account-dashboard .journalit-account-dashboard-mode-control {
  width: 100%;
  min-width: 0;
}


.journalit-account-dashboard .dashboard-actions > * {
  display: flex;
  align-items: center;
}

.journalit-account-dashboard
  .dashboard-actions
  .account-dashboard-trade-type-filter
  .journalit-home-trade-type-filter__trigger {
  height: 28px;
  padding: 0 10px;
  box-sizing: border-box;
  line-height: 1;
}

.journalit-account-dashboard .journalit-account-dashboard-hero {
  --journalit-account-hero-height: 260px;
}

.journalit-account-dashboard .journalit-account-dashboard-hero-chart {
  min-width: 0;
  height: var(--journalit-account-hero-height);
}

.journalit-account-dashboard .journalit-account-dashboard-hero-chart .aum-chart,
.journalit-account-dashboard .journalit-account-dashboard-hero-chart .journalit-account-chart-empty {
  min-width: 0;
  height: 100%;
}

.journalit-account-dashboard .journalit-account-challenge-overview {
  margin-bottom: 18px;
}

.journalit-account-dashboard .journalit-account-challenge-summary {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  overflow: hidden;
  margin-bottom: 14px;
  background: var(--journalit-detail-card-surface);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
}

.journalit-account-dashboard .journalit-account-challenge-summary > * + * {
  border-left: 1px solid var(--background-modifier-border);
}

.journalit-account-dashboard .journalit-account-challenge-metric {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 14px 12px 12px;
  box-sizing: border-box;
  text-align: center;
}

.journalit-account-dashboard .journalit-account-challenge-metric > span,
.journalit-account-dashboard .journalit-account-challenge-phase-header,
.journalit-account-dashboard .journalit-account-challenge-firm-header {
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.journalit-account-dashboard .journalit-account-challenge-metric-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.journalit-account-dashboard .journalit-account-challenge-info-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-faint);
  cursor: help;
  line-height: 0;
  transform: translateY(-1px);
}

.journalit-account-dashboard .journalit-account-challenge-info-trigger:hover,
.journalit-account-dashboard .journalit-account-challenge-info-trigger:focus-visible {
  color: var(--text-muted);
}

.journalit-account-dashboard .journalit-account-challenge-info-icon {
  display: block;
  flex-shrink: 0;
  opacity: 0.7;
}

.journalit-account-dashboard .journalit-account-challenge-metric-value {
  margin-top: 7px;
  color: var(--text-normal);
  font-size: 20px;
  font-variant-numeric: tabular-nums;
  font-weight: 550;
  line-height: 1;
}

.journalit-account-dashboard .journalit-account-challenge-metric-value.is-positive {
  color: var(--text-success);
}

.journalit-account-dashboard .journalit-account-challenge-metric-value.is-negative {
  color: var(--text-error);
}

.journalit-account-dashboard .journalit-account-challenge-insights {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.journalit-account-dashboard .journalit-account-challenge-panel {
  min-width: 0;
  padding: 16px;
  background: var(--journalit-detail-card-surface);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  box-sizing: border-box;
}


.journalit-account-dashboard .journalit-account-challenge-panel-heading {
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

.journalit-account-dashboard .journalit-account-challenge-insight-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: -3px 0 10px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-account-dashboard button.journalit-account-challenge-insight-tab {
  min-height: 0;
  height: auto;
  padding: 0 0 8px;
  margin: 0 0 -1px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  box-shadow: none;
  color: var(--text-faint);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.journalit-account-dashboard button.journalit-account-challenge-insight-tab:hover,
.journalit-account-dashboard button.journalit-account-challenge-insight-tab:focus-visible {
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
}

.journalit-account-dashboard button.journalit-account-challenge-insight-tab.is-active {
  border-bottom-color: var(--interactive-accent);
  color: var(--text-normal);
}

.journalit-account-dashboard button.journalit-account-challenge-insight-tab:focus-visible {
  outline: 1px solid var(--background-modifier-border-focus);
  outline-offset: 2px;
}

.journalit-account-dashboard .journalit-account-challenge-economics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(76px, 1fr));
  flex: 1;
  min-height: 0;
}

.journalit-account-dashboard .journalit-account-challenge-economics-panel {
  display: flex;
  flex-direction: column;
}

.journalit-account-dashboard .journalit-account-challenge-economics .journalit-account-challenge-metric {
  min-height: 76px;
}

.journalit-account-dashboard .journalit-account-challenge-economics .journalit-account-challenge-metric:nth-child(odd) {
  border-right: 1px solid var(--background-modifier-border);
}

.journalit-account-dashboard .journalit-account-challenge-economics .journalit-account-challenge-metric:nth-child(n + 3) {
  border-top: 1px solid var(--background-modifier-border);
}

.journalit-account-dashboard .journalit-account-challenge-phase-empty {
  margin: 24px 0;
  color: var(--text-faint);
  font-size: 12px;
  text-align: center;
}

.journalit-account-dashboard .journalit-account-challenge-phase-table,
.journalit-account-dashboard .journalit-account-challenge-firm-table {
  display: flex;
  flex-direction: column;
}

.journalit-account-dashboard .journalit-account-challenge-phase-toggle-row {
  display: flex;
  justify-content: center;
  padding-top: 7px;
}

.journalit-account-dashboard button.journalit-account-challenge-phase-toggle {
  min-height: 0;
  height: auto;
  padding: 3px 8px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 550;
}

.journalit-account-dashboard .journalit-account-challenge-phase-header,
.journalit-account-dashboard .journalit-account-challenge-phase-row,
.journalit-account-dashboard .journalit-account-challenge-firm-header,
.journalit-account-dashboard .journalit-account-challenge-firm-row {
  display: grid;
  align-items: baseline;
  gap: 14px;
}

.journalit-account-dashboard .journalit-account-challenge-phase-header,
.journalit-account-dashboard .journalit-account-challenge-phase-row {
  grid-template-columns: minmax(0, 1fr) minmax(86px, auto) minmax(110px, auto);
}

.journalit-account-dashboard .journalit-account-challenge-firm-header,
.journalit-account-dashboard .journalit-account-challenge-firm-row {
  grid-template-columns: minmax(0, 1fr) minmax(62px, auto) minmax(86px, auto) minmax(88px, auto);
}

.journalit-account-dashboard .journalit-account-challenge-phase-header,
.journalit-account-dashboard .journalit-account-challenge-firm-header {
  padding: 0 0 8px;
}

.journalit-account-dashboard .journalit-account-challenge-phase-header > span:not(:first-child),
.journalit-account-dashboard .journalit-account-challenge-phase-row > span:not(:first-child),
.journalit-account-dashboard .journalit-account-challenge-firm-header > span:not(:first-child),
.journalit-account-dashboard .journalit-account-challenge-firm-row > span:not(:first-child) {
  text-align: right;
}

.journalit-account-dashboard .journalit-account-challenge-phase-row,
.journalit-account-dashboard .journalit-account-challenge-firm-row {
  padding: 10px 0;
  border-top: 1px solid var(--background-modifier-border);
  color: var(--text-normal);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}


.journalit-account-dashboard .journalit-account-challenge-phase-name,
.journalit-account-dashboard .journalit-account-challenge-firm-name {
  min-width: 0;
  overflow-wrap: anywhere;
}

.journalit-account-dashboard .journalit-account-challenge-phase-row strong,
.journalit-account-dashboard .journalit-account-challenge-firm-row strong {
  font-weight: 500;
}


.journalit-account-dashboard .journalit-account-challenge-phase-inline-label,
.journalit-account-dashboard .journalit-account-challenge-firm-inline-label {
  display: none;
}


.journalit-account-dashboard .journalit-account-challenge-phase-badge {
  display: inline-block;
  margin-left: 7px;
  padding: 1px 5px;
  color: var(--text-muted);
  background: var(--background-modifier-border);
  border-radius: 4px;
  font-size: 9px;
  font-variant-numeric: normal;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1.4;
  text-transform: uppercase;
  
  max-width: 100%;
}


.journalit-account-dashboard .dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0;
  overflow: hidden;
  margin: 14px 0 18px;
  background: var(--journalit-detail-card-surface);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
}


.journalit-account-dashboard .dashboard-metrics > .metric-item,
.journalit-account-dashboard .dashboard-metrics > .tooltip-trigger--inline {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: none;
}

.journalit-account-dashboard .dashboard-metrics > * + * {
  border-left: 1px solid var(--background-modifier-border);
}

.journalit-account-dashboard .dashboard-metrics .metric-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-width: 0;
  max-width: none;
  padding: 14px 12px 12px;
  background-color: transparent;
  border-radius: 0;
  box-sizing: border-box;
  transition: none;
}

.journalit-account-dashboard .dashboard-metrics .metric-item:hover {
  transform: none;
  box-shadow: none;
}

.journalit-account-dashboard .dashboard-metrics .metric-value {
  order: 2;
  margin: 7px 0 0;
  font-size: 21px;
  font-variant-numeric: tabular-nums;
  font-weight: 550;
  line-height: 1;
}

.journalit-account-dashboard .dashboard-metrics .metric-label {
  order: 1;
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  line-height: 1.2;
  text-transform: uppercase;
}

.journalit-account-dashboard .account-sections {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.journalit-account-dashboard .account-section {
  padding: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}


.journalit-account-dashboard {
  
  --account-type-header-gap: 20px;
  --account-type-metrics-gap: 20px;
  --account-type-metrics-justify: flex-end;
  --account-type-metric-max-width: 120px;
}

.journalit-account-dashboard .account-type-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--account-type-header-gap, 20px);
  padding: 12px var(--account-dashboard-content-gutter, 20px);
  margin: 0 0 var(--account-dashboard-space-md, 16px) 0;
  background: var(--journalit-detail-card-surface);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}


.journalit-account-dashboard .account-type-header .account-type-name {
  
  flex: 0 0 auto;
  margin-right: 0; 
  min-width: auto;
}

.journalit-account-dashboard .account-type-header .account-type-name h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-normal);
  border: none;
  padding: 0;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}


.journalit-account-dashboard .account-type-header .account-type-metrics {
  display: flex;
  align-items: center;
  gap: var(--account-type-metrics-gap, 20px);
  flex: 1;
  justify-content: var(--account-type-metrics-justify, flex-end);
  flex-wrap: wrap;
  min-width: 0; 
  margin-left: auto; 
}


.journalit-account-dashboard .account-type-header .metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 0;
  flex-shrink: 1;
  flex-basis: auto;
  padding: 0;
  background: none;
  border-radius: 0;
  transition: none;
  text-align: center;
  max-width: var(
    --account-type-metric-max-width,
    120px
  ); 
}

.journalit-account-dashboard .account-type-header .metric-item:hover {
  transform: none;
  box-shadow: none;
  background: none;
}


.journalit-account-dashboard .account-type-header .metric-item .metric-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-normal);
  margin: 0;
  line-height: 1.2;
  white-space: normal; 
  overflow-wrap: break-word; 
  overflow-wrap: anywhere; 
  word-break: normal;
  text-align: center;
}


.journalit-account-dashboard
  .account-type-header
  .metric-item
  .metric-value.weight-percent {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-info);
}


.journalit-account-dashboard
  .account-type-header
  .metric-item
  .metric-value.excluded-status {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  font-style: italic;
}


.journalit-account-dashboard
  .account-type-header
  .metric-item
  .metric-value.positive {
  color: var(--text-success);
}

.journalit-account-dashboard
  .account-type-header
  .metric-item
  .metric-value.negative {
  color: var(--text-error);
}


.journalit-account-dashboard .account-type-header .metric-item .metric-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin: 0;
  line-height: 1.2;
  white-space: normal; 
  overflow-wrap: break-word; 
  overflow-wrap: anywhere; 
  word-break: normal;
  text-align: center;
}


@media (max-width: 400px) {
  .journalit-account-dashboard .account-type-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 16px var(--account-dashboard-content-gutter, 20px);
  }

  .journalit-account-dashboard .account-type-header .account-type-name {
    margin-right: 0;
    text-align: center;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-account-dashboard .account-type-header .account-type-metrics {
    justify-content: center;
    gap: 16px;
  }
}


@media (max-width: 350px) {
  .journalit-account-dashboard .account-type-header .account-type-metrics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 20px;
    justify-content: center;
  }

  .journalit-account-dashboard .account-type-header .metric-item .metric-value {
    font-size: 0.9rem;
    white-space: normal; 
    word-break: break-word;
  }

  .journalit-account-dashboard .account-type-header .metric-item .metric-label {
    font-size: 0.7rem;
    white-space: normal;
    word-break: break-word;
  }
}


@media (max-width: 300px) {
  .journalit-account-dashboard .account-type-header .account-type-metrics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px 16px;
    text-align: center;
  }

  .journalit-account-dashboard .account-type-header .metric-item {
    align-items: center;
    min-width: 0; 
  }

  .journalit-account-dashboard .account-type-header .metric-item .metric-value {
    font-size: 0.8rem;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .journalit-account-dashboard .account-type-header .metric-item .metric-label {
    font-size: 0.65rem;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
    line-height: 1.1;
  }
}


@media (max-width: 480px) {
  .journalit-account-dashboard .account-type-header .account-type-metrics {
    gap: 10px 12px;
  }

  
  .journalit-account-dashboard .account-type-header .metric-item--withdrawals,
  .journalit-account-dashboard
    .account-type-header
    .metric-item-trigger--withdrawals,
  .journalit-account-dashboard .account-type-header .metric-item--trades {
    display: none;
  }

  .journalit-account-dashboard .account-type-header .metric-item .metric-value {
    font-size: 0.75rem;
  }

  .journalit-account-dashboard .account-type-header .metric-item .metric-label {
    font-size: 0.6rem;
  }
}

.journalit-account-dashboard .account-cards {
  display: grid;
  padding: 0;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 12px;
}

.journalit-account-dashboard .account-card {
  --journalit-account-card-background: var(--journalit-detail-card-surface);
  display: flex;
  overflow: hidden;
  flex-direction: column;
  height: 390px;
  box-sizing: border-box;
  cursor: pointer;
  min-height: 390px;
  background: var(--journalit-account-card-background);
  border: 1px solid transparent;
  border-radius: 12px;
  box-shadow: none;
  transition:
    border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}


.journalit-account-dashboard .account-card:hover {
  --journalit-account-card-background: color-mix(
    in srgb,
    var(--journalit-detail-card-surface) 88%,
    black 12%
  );
  border-color: color-mix(in srgb, var(--interactive-accent) 55%, transparent);
}


.journalit-account-dashboard .account-card.is-action-hover:hover {
  --journalit-account-card-background: var(--journalit-detail-card-surface);
  border-color: transparent;
}


.theme-light
  .journalit-account-dashboard-container
  .journalit-account-dashboard
  .account-card:not(:hover),
.theme-light
  .journalit-account-dashboard-container
  .journalit-account-dashboard
  .account-card.is-action-hover:hover {
  border-color: var(--background-modifier-border);
}

.journalit-account-dashboard .account-card.is-prop-challenge {
  align-self: stretch;
}

.journalit-account-dashboard .account-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 20px 16px;
  background: var(--journalit-account-card-background);
  
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.journalit-account-dashboard .account-identity {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 8px;
}


.journalit-tooltip .account-copy-badge-tooltip {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.journalit-tooltip .account-copy-badge-tooltip-title {
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.journalit-tooltip .account-copy-badge-tooltip-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.journalit-tooltip .account-copy-badge-tooltip-row > span:last-child {
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}


.journalit-account-dashboard .account-identity.has-inline-badges {
  align-items: center;
  flex-direction: row;
  gap: 8px;
}

.journalit-account-dashboard
  .account-identity.has-inline-badges
  > button.journalit-account-card-name {
  width: auto;
  flex: 0 1 auto;
  min-width: 0;
}

.journalit-account-dashboard
  .account-identity.has-inline-badges
  > .account-card-badges {
  flex: 0 0 auto;
  flex-wrap: nowrap;
}


.journalit-account-dashboard button.journalit-account-card-name {
  appearance: none;
  display: block;
  width: 100%;
  height: auto;
  padding: 0;
  border: 0;
  border-radius: 2px;
  background: transparent;
  box-shadow: none;
  cursor: pointer;
  text-align: left;
}

.journalit-account-dashboard button.journalit-account-card-name:hover,
.journalit-account-dashboard button.journalit-account-card-name:active {
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
}

.journalit-account-dashboard button.journalit-account-card-name:focus-visible {
  outline: 2px solid var(--background-modifier-border-focus);
  outline-offset: 2px;
}

.journalit-account-dashboard .account-name {
  overflow: hidden;
  color: var(--text-normal);
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-account-dashboard .account-card-badges {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.journalit-account-dashboard .account-type-badge,
.journalit-account-dashboard .account-copy-badge,
.journalit-account-dashboard .account-base-badge {
  min-height: 0;
  padding: 4px 8px;
  background: var(--background-modifier-form-field);
  border: 0;
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}


.journalit-account-dashboard .account-copy-badge,
.journalit-account-dashboard .account-base-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-accent);
  font-weight: 600;
}

.journalit-account-dashboard .account-copy-badge > .journalit-obsidian-icon,
.journalit-account-dashboard .account-base-badge > .journalit-obsidian-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.journalit-account-dashboard .account-base-badge {
  color: var(--text-success);
}

.journalit-account-dashboard .account-balance {
  display: flex;
  flex: 0 0 auto;
  align-items: flex-end;
  flex-direction: column;
  gap: 3px;
}

.journalit-account-dashboard .balance-amount {
  color: var(--text-normal);
  font-size: 1.25rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  line-height: 1.2;
}


.journalit-account-dashboard .balance-growth {
  color: var(--text-muted);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  line-height: 1.2;
}

.journalit-account-dashboard .balance-growth.positive {
  color: var(--text-success);
}

.journalit-account-dashboard .balance-growth.negative {
  color: var(--text-error);
}

.journalit-account-dashboard .account-card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px 20px;
}

.journalit-account-dashboard .account-card .key-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}


.journalit-account-dashboard .account-card .key-metrics > .tooltip-trigger--inline {
  display: block;
  width: 100%;
  min-width: 0;
}

.journalit-account-dashboard .account-card .key-metrics .metric-item {
  min-width: 0;
  max-width: none;
  overflow: hidden;
  padding: 10px 2px;
  background: var(--background-modifier-form-field);
  border-radius: 8px;
  text-align: center;
}

.journalit-account-dashboard .account-card .key-metrics .metric-item + .metric-item {
  border-left: 0;
}

.journalit-account-dashboard .account-card .key-metrics .metric-item:hover {
  background: var(--background-modifier-form-field);
}


.theme-light
  .journalit-account-dashboard-container
  .journalit-account-dashboard
  .account-card
  .key-metrics
  .metric-item,
.theme-light
  .journalit-account-dashboard-container
  .journalit-account-dashboard
  .account-card
  .key-metrics
  .metric-item:hover {
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
}

.journalit-account-dashboard .account-card .key-metrics .metric-item .metric-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  margin-bottom: 4px;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  white-space: nowrap;
}

.journalit-account-dashboard .account-card .key-metrics .metric-item .metric-value > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-account-dashboard .account-card .key-metrics .metric-item .metric-value > svg {
  flex-shrink: 0;
}


.journalit-account-dashboard .account-card .key-metrics .metric-item .metric-label {
  max-width: 100%;
  min-width: 0;
  letter-spacing: 0.03em;
}

.journalit-account-dashboard .account-card .key-metrics .metric-item .metric-label > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-account-dashboard .account-card .key-metrics .metric-item .metric-label > svg {
  flex-shrink: 0;
}

.journalit-account-dashboard .account-card .key-metrics .metric-item .metric-label,
.journalit-account-dashboard .progress-label,
.journalit-account-dashboard .footer-label {
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 550;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.journalit-account-dashboard .progress-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.journalit-account-dashboard .progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 44px;
}

.journalit-account-dashboard .progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
}

.journalit-account-dashboard .footer-value {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.journalit-account-dashboard .progress-value {
  color: var(--text-normal);
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.journalit-account-dashboard .progress-value.not-set {
  color: var(--text-muted);
  font-style: italic;
  font-weight: 500;
}

.journalit-account-dashboard .progress-item.not-set {
  opacity: 0.7;
}

.journalit-account-dashboard .progress-bar-container {
  display: block;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 8px;
  box-sizing: border-box;
  margin-top: 0;
  background: var(--background-modifier-border);
  border-radius: 4px;
}

.journalit-account-dashboard .progress-bar.profit-target,
.journalit-account-dashboard .progress-bar.drawdown.safe {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border-radius: 4px;
  box-shadow: none;
}

.journalit-account-dashboard .progress-bar.profit-target.complete {
  background: var(--text-success);
}

.journalit-account-dashboard .progress-bar.drawdown.warning {
  background: var(--text-warning);
}

.journalit-account-dashboard .progress-bar.drawdown.critical {
  background: var(--text-error);
}

.journalit-account-dashboard .account-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 24px;
  margin-top: auto;
  padding-top: 16px;
}


.journalit-account-dashboard .account-section-content {
  padding: 0;
}

.journalit-account-dashboard .progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--journalit-account-progress-width, 0%);
  height: 100%;
  margin: 0;
  border-radius: 4px;
}

.journalit-account-dashboard .progress-bar.empty,
.journalit-account-dashboard .progress-bar[data-is-zero="true"] {
  display: none;
}

.journalit-account-dashboard .footer-metric {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 6px;
}

.journalit-account-dashboard .footer-metric:first-child {
  flex: 1;
}

.journalit-account-dashboard .footer-metric:last-child {
  flex: 0 0 auto;
  justify-content: flex-end;
}

.journalit-account-dashboard .journalit-account-phase-ribbon {
  display: flex;
  flex: 0 0 22px;
  min-width: 0;
  height: 22px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  list-style: none;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment {
  --journalit-phase-ribbon-background: var(--background-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-width: 0;
  flex: 1 1 0;
  padding: 0 7px;
  background: var(--journalit-phase-ribbon-background);
  border-top: 1px solid var(--background-modifier-border);
  border-bottom: 1px solid var(--background-modifier-border);
  color: var(--text-muted);
  font-size: 9px;
  font-weight: 650;
  letter-spacing: 0.06em;
  line-height: 1;
  position: relative;
  text-transform: uppercase;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment:first-child {
  border-left: 1px solid var(--background-modifier-border);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment:last-child {
  border-right: 1px solid var(--background-modifier-border);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector {
  --journalit-phase-ribbon-from: var(--background-primary);
  --journalit-phase-ribbon-to: var(--background-primary);
  --journalit-phase-ribbon-connector-border: var(
    --background-modifier-border
  );
  --journalit-phase-ribbon-connector-edge: var(--background-modifier-border);
  position: relative;
  z-index: 1;
  flex: 0 0 12px;
  height: 22px;
  margin: 0;
  padding: 0;
  background: var(--journalit-phase-ribbon-to);
  border-top: 1px solid var(--journalit-phase-ribbon-connector-edge);
  border-bottom: 1px solid var(--journalit-phase-ribbon-connector-edge);
  list-style: none;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector::before,
.journalit-account-dashboard .journalit-account-phase-ribbon-connector::after {
  position: absolute;
  left: 0;
  width: 0;
  height: 0;
  content: '';
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector::before {
  top: -1px;
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  border-left: 13px solid var(--journalit-phase-ribbon-connector-border);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector::after {
  top: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 12px solid var(--journalit-phase-ribbon-from);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.from-passed {
  --journalit-phase-ribbon-from: var(--background-secondary-alt);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.from-current {
  --journalit-phase-ribbon-from: color-mix(
    in srgb,
    var(--interactive-accent) 38%,
    var(--background-secondary)
  );
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--interactive-accent) 55%,
    var(--background-modifier-border)
  );
  --journalit-phase-ribbon-connector-edge: transparent;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.from-pending {
  --journalit-phase-ribbon-from: var(--background-secondary-alt);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.from-failed {
  --journalit-phase-ribbon-from: color-mix(
    in srgb,
    var(--text-error) 24%,
    var(--background-secondary)
  );
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.to-passed {
  
  --journalit-phase-ribbon-to: var(--background-secondary-alt);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.to-current {
  --journalit-phase-ribbon-to: color-mix(
    in srgb,
    var(--interactive-accent) 38%,
    var(--background-secondary)
  );
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--interactive-accent) 55%,
    var(--background-modifier-border)
  );
  --journalit-phase-ribbon-connector-edge: var(
    --journalit-phase-ribbon-connector-border
  );
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.to-pending {
  --journalit-phase-ribbon-to: var(--background-secondary-alt);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.to-failed {
  --journalit-phase-ribbon-to: color-mix(
    in srgb,
    var(--text-error) 24%,
    var(--background-secondary)
  );
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--text-error) 42%,
    var(--background-modifier-border)
  );
  --journalit-phase-ribbon-connector-edge: var(
    --journalit-phase-ribbon-connector-border
  );
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.from-current-warning {
  --journalit-phase-ribbon-from: color-mix(
    in srgb,
    var(--text-warning) 34%,
    var(--background-secondary)
  );
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--text-warning) 55%,
    var(--background-modifier-border)
  );
  --journalit-phase-ribbon-connector-edge: transparent;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.to-current-warning {
  --journalit-phase-ribbon-to: color-mix(
    in srgb,
    var(--text-warning) 34%,
    var(--background-secondary)
  );
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--text-warning) 55%,
    var(--background-modifier-border)
  );
  --journalit-phase-ribbon-connector-edge: var(
    --journalit-phase-ribbon-connector-border
  );
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.from-current-failed {
  --journalit-phase-ribbon-from: color-mix(
    in srgb,
    var(--text-error) 34%,
    var(--background-secondary)
  );
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--text-error) 55%,
    var(--background-modifier-border)
  );
  --journalit-phase-ribbon-connector-edge: transparent;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.to-current-failed {
  --journalit-phase-ribbon-to: color-mix(
    in srgb,
    var(--text-error) 34%,
    var(--background-secondary)
  );
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--text-error) 55%,
    var(--background-modifier-border)
  );
  --journalit-phase-ribbon-connector-edge: var(
    --journalit-phase-ribbon-connector-border
  );
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.from-current-passed {
  --journalit-phase-ribbon-from: color-mix(
    in srgb,
    var(--text-success) 34%,
    var(--background-secondary)
  );
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--text-success) 55%,
    var(--background-modifier-border)
  );
  --journalit-phase-ribbon-connector-edge: transparent;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.to-current-passed {
  --journalit-phase-ribbon-to: color-mix(
    in srgb,
    var(--text-success) 34%,
    var(--background-secondary)
  );
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--text-success) 55%,
    var(--background-modifier-border)
  );
  --journalit-phase-ribbon-connector-edge: var(
    --journalit-phase-ribbon-connector-border
  );
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.from-current-payout {
  --journalit-phase-ribbon-from: color-mix(
    in srgb,
    var(--color-cyan, #53dfdd) 34%,
    var(--background-secondary)
  );
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--color-cyan, #53dfdd) 55%,
    var(--background-modifier-border)
  );
  --journalit-phase-ribbon-connector-edge: transparent;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.to-current-payout {
  --journalit-phase-ribbon-to: color-mix(
    in srgb,
    var(--color-cyan, #53dfdd) 34%,
    var(--background-secondary)
  );
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--color-cyan, #53dfdd) 55%,
    var(--background-modifier-border)
  );
  --journalit-phase-ribbon-connector-edge: var(
    --journalit-phase-ribbon-connector-border
  );
}



.journalit-account-dashboard .journalit-account-phase-ribbon.is-attention.is-failed {
  --journalit-phase-ribbon-action-background: var(--text-error);
  --journalit-phase-ribbon-action-color: #fff;
}

.journalit-account-dashboard .journalit-account-phase-ribbon.is-attention.is-passed {
  --journalit-phase-ribbon-action-background: var(--color-green);
  --journalit-phase-ribbon-action-color: #fff;
}

.journalit-account-dashboard .journalit-account-phase-ribbon.is-attention.is-payout_ready {
  --journalit-phase-ribbon-action-background: var(--color-cyan, #53dfdd);
  --journalit-phase-ribbon-action-color: var(--background-primary);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-connector.to-action {
  --journalit-phase-ribbon-to: var(--journalit-phase-ribbon-action-background);
  --journalit-phase-ribbon-connector-border: var(--journalit-phase-ribbon-action-background);
  --journalit-phase-ribbon-connector-edge: var(--journalit-phase-ribbon-action-background);
}


.journalit-account-dashboard .journalit-account-phase-ribbon.is-attention .journalit-account-phase-ribbon-segment {
  flex: 1 0 auto;
  max-width: 60%;
  justify-content: flex-start;
  gap: 5px;
  padding-left: 9px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-transform: none;
}

.journalit-account-dashboard .journalit-account-phase-ribbon.is-attention .journalit-account-phase-ribbon-segment.is-state-failed {
  color: var(--text-error);
}

.journalit-account-dashboard .journalit-account-phase-ribbon.is-attention .journalit-account-phase-ribbon-segment.is-state-passed {
  color: var(--color-green);
}

.journalit-account-dashboard .journalit-account-phase-ribbon.is-attention .journalit-account-phase-ribbon-segment.is-state-payout_ready {
  color: var(--color-cyan, #53dfdd);
}


.journalit-account-dashboard .journalit-account-phase-ribbon-action {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  height: 22px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 22px;
  min-width: 0;
  padding: 0 10px;
  border: none;
  border-radius: 0;
  background: var(--journalit-phase-ribbon-action-background);
  box-shadow: none;
  color: var(--journalit-phase-ribbon-action-color);
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1;
  text-transform: none;
  white-space: nowrap;
  overflow: hidden;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-action-button:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: -2px;
}


.journalit-account-dashboard .journalit-account-phase-ribbon-action-button:active,
.journalit-account-dashboard .journalit-account-phase-ribbon-action-button:disabled {
  background: var(--journalit-phase-ribbon-action-background);
  color: var(--journalit-phase-ribbon-action-color);
  box-shadow: none;
  opacity: 1;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-action-button:disabled {
  cursor: default;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-action-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}


.journalit-account-dashboard .journalit-account-phase-ribbon-action-icon {
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.journalit-account-dashboard .account-card.is-action-hover .journalit-account-phase-ribbon-action-icon.is-trailing {
  transform: translateX(3px);
}

.journalit-account-dashboard .account-card.is-action-hover .journalit-account-phase-ribbon-action-icon.is-leading {
  transform: translateY(-1px);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-action-icon svg {
  stroke-width: 2.5;
}


.journalit-account-dashboard
  .journalit-account-phase-ribbon-connector.from-passed.to-passed,
.journalit-account-dashboard
  .journalit-account-phase-ribbon-connector.from-passed.to-pending,
.journalit-account-dashboard
  .journalit-account-phase-ribbon-connector.from-pending.to-passed,
.journalit-account-dashboard
  .journalit-account-phase-ribbon-connector.from-pending.to-pending {
  --journalit-phase-ribbon-connector-border: color-mix(
    in srgb,
    var(--text-muted) 20%,
    var(--background-secondary-alt)
  );
}

.journalit-account-dashboard .journalit-account-phase-ribbon-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}







.journalit-account-dashboard .journalit-account-phase-ribbon-segment.is-passed {
  --journalit-phase-ribbon-background: var(--background-secondary-alt);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment.is-current {
  --journalit-phase-ribbon-background: color-mix(
    in srgb,
    var(--interactive-accent) 38%,
    var(--background-secondary)
  );
  border-color: color-mix(
    in srgb,
    var(--interactive-accent) 55%,
    var(--background-modifier-border)
  );
  color: var(--text-normal);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment.is-failed {
  --journalit-phase-ribbon-background: color-mix(
    in srgb,
    var(--text-error) 24%,
    var(--background-secondary)
  );
  border-color: color-mix(
    in srgb,
    var(--text-error) 42%,
    var(--background-modifier-border)
  );
  color: var(--text-normal);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment.is-warning {
  --journalit-phase-ribbon-background: color-mix(
    in srgb,
    var(--text-warning) 24%,
    var(--background-secondary)
  );
  border-color: color-mix(
    in srgb,
    var(--text-warning) 42%,
    var(--background-modifier-border)
  );
  color: var(--text-normal);
}


.journalit-account-dashboard .journalit-account-phase-ribbon-segment.is-current.is-warning {
  --journalit-phase-ribbon-background: color-mix(
    in srgb,
    var(--text-warning) 34%,
    var(--background-secondary)
  );
  border-color: color-mix(
    in srgb,
    var(--text-warning) 55%,
    var(--background-modifier-border)
  );
  color: var(--text-normal);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment.is-current.is-failed {
  --journalit-phase-ribbon-background: color-mix(
    in srgb,
    var(--text-error) 34%,
    var(--background-secondary)
  );
  border-color: color-mix(
    in srgb,
    var(--text-error) 55%,
    var(--background-modifier-border)
  );
  color: var(--text-normal);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment.is-pending,
.journalit-account-dashboard .journalit-account-phase-ribbon-segment.is-ellipsis {
  --journalit-phase-ribbon-background: var(--background-secondary-alt);
  color: var(--text-faint);
}


.journalit-account-dashboard .journalit-account-prop-card-content {
  gap: 12px;
}


.journalit-account-dashboard .account-card.is-prop-challenge .account-card-header {
  flex-wrap: wrap;
  row-gap: 7px;
}

.journalit-account-dashboard .journalit-account-phase-ribbon.is-in-header {
  flex: 0 0 100%;
  width: 100%;
  height: 22px;
  border-radius: 4px;
}

.journalit-account-dashboard .journalit-account-phase-ribbon-icon {
  flex-shrink: 0;
}


.journalit-account-dashboard .journalit-account-phase-ribbon-segment.has-state.is-state-warning {
  color: var(--text-warning);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment.has-state.is-state-failed {
  color: var(--text-error);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment.has-state.is-state-passed {
  --journalit-phase-ribbon-background: color-mix(
    in srgb,
    var(--text-success) 34%,
    var(--background-secondary)
  );
  border-color: color-mix(
    in srgb,
    var(--text-success) 55%,
    var(--background-modifier-border)
  );
  color: var(--text-success);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment.has-state.is-state-payout_ready {
  --journalit-phase-ribbon-background: color-mix(
    in srgb,
    var(--color-cyan, #53dfdd) 34%,
    var(--background-secondary)
  );
  border-color: color-mix(
    in srgb,
    var(--color-cyan, #53dfdd) 55%,
    var(--background-modifier-border)
  );
  color: var(--color-cyan, #53dfdd);
}


.journalit-account-dashboard .journalit-account-phase-ribbon-segment.is-state-passed:not(.has-state) .journalit-account-phase-ribbon-icon {
  color: var(--text-success);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment.is-state-failed:not(.has-state) .journalit-account-phase-ribbon-icon {
  color: var(--text-error);
}

.journalit-account-dashboard .journalit-account-phase-ribbon-segment.is-state-failed:not(.has-state) .journalit-account-phase-ribbon-icon {
  color: var(--text-error);
}

.journalit-account-dashboard .journalit-account-prop-progress-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.journalit-account-dashboard .journalit-account-rule-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.journalit-account-dashboard .journalit-account-rule-progress-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.journalit-account-dashboard .journalit-account-rule-progress-header > span {
  color: var(--text-muted);
  font-weight: 550;
}

.journalit-account-dashboard .journalit-account-rule-progress-header > strong {
  overflow: hidden;
  color: var(--text-normal);
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-account-dashboard .journalit-account-rule-progress.is-breached .journalit-account-rule-progress-header > strong {
  color: var(--text-error);
}

.journalit-account-dashboard .journalit-account-rule-progress.is-warning .journalit-account-rule-progress-header > strong {
  color: var(--text-warning);
}

.journalit-account-dashboard .journalit-account-rule-progress-track {
  height: 8px;
  overflow: hidden;
  background: var(--background-modifier-border);
  border-radius: 4px;
}

.journalit-account-dashboard .journalit-account-rule-progress-fill {
  display: block;
  width: var(--journalit-account-progress-width, 0%);
  height: 100%;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border-radius: 4px;
}

.journalit-account-dashboard .journalit-account-rule-progress.is-satisfied .journalit-account-rule-progress-fill {
  background: var(--text-success);
}

.journalit-account-dashboard .journalit-account-rule-progress.is-breached .journalit-account-rule-progress-fill {
  background: var(--text-error);
}

.journalit-account-dashboard .journalit-account-rule-progress.is-warning .journalit-account-rule-progress-fill {
  background: var(--text-warning);
}

.journalit-account-dashboard .journalit-account-rule-progress-fill[data-is-zero="true"] {
  display: none;
}


.journalit-account-dashboard .journalit-account-prop-secondary-rules {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.journalit-account-dashboard .journalit-account-prop-rule-metric {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.journalit-account-dashboard .journalit-account-prop-rule-metric > .progress-label {
  flex: 0 1 auto;
  min-width: 0;
}

.journalit-account-dashboard .journalit-account-prop-rule-metric > .progress-value {
  flex: 0 0 auto;
  white-space: nowrap;
}

.journalit-account-dashboard .journalit-account-prop-rule-metric.is-satisfied > strong {
  color: var(--text-success);
}

.journalit-account-dashboard .journalit-account-prop-rule-metric.is-warning > strong {
  color: var(--text-warning);
}

.journalit-account-dashboard .journalit-account-prop-rule-metric.is-breached > strong {
  color: var(--text-error);
}


@container journalit-account-dashboard (max-width: 850px) {
  .journalit-account-dashboard .dashboard-header.has-mode-switch {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px 8px;
  }

  .journalit-account-dashboard .dashboard-header.has-mode-switch .dashboard-header-spacer {
    display: none;
  }

  .journalit-account-dashboard .journalit-account-dashboard-mode-switch {
    grid-column: 1 / -1;
    grid-row: 1;
  }

  .journalit-account-dashboard .dashboard-header.has-mode-switch .dashboard-actions {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-content: flex-end;
  }

  .journalit-account-dashboard .journalit-account-challenge-summary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .journalit-account-dashboard .journalit-account-challenge-summary > * + * {
    border-left: 0;
  }

  .journalit-account-dashboard .journalit-account-challenge-summary .journalit-account-challenge-metric:not(:nth-child(3n + 1)) {
    border-left: 1px solid var(--background-modifier-border);
  }

  .journalit-account-dashboard .journalit-account-challenge-summary .journalit-account-challenge-metric:nth-child(n + 4) {
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-account-dashboard .journalit-account-challenge-insights {
    grid-template-columns: minmax(0, 1fr);
  }

  .journalit-account-dashboard .dashboard-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}


@container journalit-account-dashboard (max-width: 600px) {
  .journalit-account-dashboard .dashboard-header.has-mode-switch .dashboard-actions {
    width: 100%;
  }

  .journalit-account-dashboard .journalit-account-challenge-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .journalit-account-dashboard .journalit-account-challenge-summary .journalit-account-challenge-metric:nth-child(n) {
    border-left: 0;
  }

  .journalit-account-dashboard .journalit-account-challenge-summary .journalit-account-challenge-metric:not(:nth-child(2n + 1)) {
    border-left: 1px solid var(--background-modifier-border);
  }

  .journalit-account-dashboard .journalit-account-challenge-summary .journalit-account-challenge-metric:nth-child(n + 3) {
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-account-dashboard .journalit-account-challenge-summary .journalit-account-challenge-metric:last-child {
    grid-column: 1 / -1;
  }

  .journalit-account-dashboard .journalit-account-challenge-economics {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: repeat(4, minmax(76px, auto));
  }

  .journalit-account-dashboard .journalit-account-challenge-economics .journalit-account-challenge-metric:nth-child(odd) {
    border-right: 0;
  }

  .journalit-account-dashboard .journalit-account-challenge-economics .journalit-account-challenge-metric:nth-child(n + 2) {
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-account-dashboard .journalit-account-challenge-phase-header,
  .journalit-account-dashboard .journalit-account-challenge-phase-row,
  .journalit-account-dashboard .journalit-account-challenge-firm-header,
  .journalit-account-dashboard .journalit-account-challenge-firm-row {
    display: flex;
    flex-wrap: wrap;
    gap: 5px 18px;
  }

  .journalit-account-dashboard .journalit-account-challenge-phase-header > span:not(:first-child),
  .journalit-account-dashboard .journalit-account-challenge-firm-header > span:not(:first-child) {
    display: none;
  }

  .journalit-account-dashboard .journalit-account-challenge-phase-row > span:not(:first-child),
  .journalit-account-dashboard .journalit-account-challenge-firm-row > span:not(:first-child) {
    text-align: left;
  }

  .journalit-account-dashboard .journalit-account-challenge-phase-name,
  .journalit-account-dashboard .journalit-account-challenge-firm-name {
    flex: 1 0 100%;
  }

  .journalit-account-dashboard .journalit-account-challenge-phase-inline-label,
  .journalit-account-dashboard .journalit-account-challenge-firm-inline-label {
    display: inline;
    margin-right: 5px;
    color: var(--text-muted);
    font-size: 10px;
    font-variant-numeric: normal;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .journalit-account-dashboard .dashboard-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


.journalit-account-dashboard .journalit-challenge-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-2-2);
  padding: var(--size-4-8) var(--size-4-4);
  border: 1px dashed var(--background-modifier-border);
  border-radius: var(--radius-m);
  text-align: center;
}

.journalit-account-dashboard .journalit-challenge-empty__icon {
  color: var(--text-faint);
  margin-bottom: var(--size-2-1);
}

.journalit-account-dashboard .journalit-challenge-empty__title {
  font-weight: var(--font-semibold);
  color: var(--text-normal);
}

.journalit-account-dashboard .journalit-challenge-empty__message {
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  max-width: 420px;
}

.journalit-account-dashboard .journalit-challenge-empty__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--size-4-2);
  margin-top: var(--size-4-2);
}
`;
