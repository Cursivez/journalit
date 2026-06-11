

const ACCOUNT_STYLES = `

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
  font-size: 14px;
  font-weight: 500;
  color: var(--text-normal);
  margin-bottom: 8px;
  text-align: center;
}

.journalit-account-chart-tooltip-value {
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
  color: var(--interactive-accent);
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
  border-radius: 5px;
  transition: width 0.5s ease;
}

.journalit-account .progress-bar.complete {
  background-color: gold; 
}


.journalit-account .account-transactions {
  margin-top: 20px;
}

.journalit-account .transactions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 0.9rem;
}

.journalit-account .transactions-table thead {
  background-color: var(--background-secondary);
}

.journalit-account .transactions-table th {
  text-align: left;
  padding: 10px;
  font-weight: 600;
  color: var(--text-normal);
  border-bottom: 2px solid var(--background-modifier-border);
}

.journalit-account .transactions-table td {
  padding: 10px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-account .transactions-table .transaction-row:hover {
  background-color: var(--background-secondary);
}

.journalit-account .transactions-table .positive {
  color: var(--interactive-success);
}

.journalit-account .transactions-table .negative {
  color: var(--text-error);
}

.journalit-account .transactions-table .deposit {
  background-color: rgba(var(--interactive-success-rgb), 0.05);
}

.journalit-account .transactions-table .withdrawal {
  background-color: rgba(var(--text-error-rgb), 0.05);
}

.journalit-account .empty-transactions {
  padding: 20px;
  text-align: center;
  color: var(--text-muted);
  background-color: var(--background-secondary);
  border-radius: 4px;
}


.journalit-account-dashboard-container {
  padding: 0;
  height: 100%;
  background-color: var(--background-primary);
}

.journalit-account-dashboard {
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
  margin-bottom: 10px;
  padding: 0;
  box-sizing: border-box;
}


.journalit-account-dashboard .dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--account-dashboard-space-lg, 20px);
  padding: 16px var(--account-dashboard-content-gutter, 20px);
  background-color: var(--background-secondary);
  border-radius: 8px;
  border: 1px solid var(--background-modifier-border);
}

.journalit-account-dashboard .dashboard-title h2 {
  margin: 0 0 4px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-normal);
}

.journalit-account-dashboard .dashboard-title p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.journalit-account-dashboard .dashboard-actions {
  display: flex;
  align-items: center;
  gap: 12px;
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
  color: var(--interactive-accent);
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
  color: var(--interactive-accent);
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

.account-dashboard-settings-form .available-account-types {
  width: 100%;
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
  max-width: 400px;
  margin: 0 auto;
}

.account-type-order-list {
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  padding: 8px;
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
  background-color: var(--background-secondary);
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

.journalit-account-dashboard .create-account-primary-button {
  flex-shrink: 0;
  background-color: var(--interactive-accent);
  color: white;
  border: 1px solid var(--interactive-accent);
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.journalit-account-dashboard .create-account-primary-button:hover {
  background-color: var(--interactive-accent-hover);
  transform: translateY(-1px);
}

.journalit-account-dashboard .empty-state-with-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 20px;
}

.journalit-account-dashboard .empty-state-actions {
  display: flex;
  justify-content: center;
}


.journalit-account-dashboard-placeholder {
  text-align: center;
  padding: 40px 20px;
  background-color: var(--background-secondary);
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




.journalit-account-dashboard .dashboard-metrics {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 10px;
  margin-bottom: var(--account-dashboard-space-xl, 24px);
  margin-top: 10px;
  padding: 0;
  overflow-x: auto;
}

.journalit-account-dashboard .metric-item {
  flex: 1;
  min-width: 180px;
  max-width: 300px;
  padding: 15px;
  background-color: var(--background-secondary);
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s ease;
}

.journalit-account-dashboard .metric-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.journalit-account-dashboard .metric-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--text-normal);
}

.journalit-account-dashboard .metric-value.positive {
  color: var(--text-success);
}

.journalit-account-dashboard .metric-value.negative {
  color: var(--text-error);
}

.journalit-account-dashboard .metric-label {
  font-size: 0.9rem;
  color: var(--text-muted);
}


.journalit-account-dashboard .account-sections {
  display: flex;
  flex-direction: column;
  gap: var(--account-dashboard-space-lg, 20px);
  padding: 0;
}

.journalit-account-dashboard .account-section {
  background-color: var(--background-primary);
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.journalit-account-dashboard .account-section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--background-modifier-border);
  color: var(--text-normal);
}


.journalit-account-dashboard .account-section-content {
  padding: 0 0 var(--account-dashboard-space-lg, 20px) 0;
}

.journalit-account-dashboard .account-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--account-dashboard-space-lg, 20px);
  padding: 0 0 var(--account-dashboard-space-lg, 20px) 0;
}

@media (max-width: 600px) {
  .journalit-account-dashboard {
    --account-dashboard-content-gutter: 10px;
    --account-dashboard-space-xs: 6px;
    --account-dashboard-space-sm: 8px;
    --account-dashboard-space-md: 10px;
    --account-dashboard-space-lg: 12px;
    --account-dashboard-space-xl: 16px;
    --account-dashboard-space-xxl: 20px;
  }
}


.journalit-account-dashboard .account-card {
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 12px;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%; 
  min-height: 365px;
}

.journalit-account-dashboard .account-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: var(--interactive-accent-hover);
}


.journalit-account-dashboard .account-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid var(--background-modifier-border);
  background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-primary) 100%);
}

.journalit-account-dashboard .account-identity {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.journalit-account-dashboard .account-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-normal);
  line-height: 1.2;
  margin: 0;
}

.journalit-account-dashboard .account-card-badges {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.journalit-account-dashboard .account-type-badge {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--background-modifier-form-field);
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.journalit-account-dashboard .account-copy-badge,
.journalit-account-dashboard .account-base-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-accent);
  background: var(--background-modifier-form-field);
  border: 1px solid var(--background-modifier-border);
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
  min-height: 26px;
  box-sizing: border-box;
  line-height: 16px;
}

.journalit-account-dashboard .account-copy-badge > span,
.journalit-account-dashboard .account-base-badge > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.journalit-account-dashboard .account-base-badge {
  color: var(--text-success);
}

.account-copy-badge-tooltip {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
}

.account-copy-badge-tooltip-title {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.account-copy-badge-tooltip-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-normal);
  font-size: var(--font-ui-small);
}

.journalit-account-dashboard .account-balance {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.journalit-account-dashboard .balance-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-normal);
  line-height: 1.2;
}

.journalit-account-dashboard .balance-growth {
  font-size: 0.8rem;
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1; 
}


.journalit-account-dashboard .metric-item {
  flex: 1;
  min-width: 180px;
  max-width: 300px;
  padding: 15px;
  background-color: var(--background-secondary);
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s ease;
}

.journalit-account-dashboard .metric-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.journalit-account-dashboard .metric-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--text-normal);
}

.journalit-account-dashboard .metric-value.positive {
  color: var(--text-success);
}

.journalit-account-dashboard .metric-value.negative {
  color: var(--text-error);
}

.journalit-account-dashboard .metric-label {
  font-size: 0.9rem;
  color: var(--text-muted);
}


.journalit-account-dashboard .account-card .key-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.journalit-account-dashboard .account-card .key-metrics .metric-item {
  flex: none;
  min-width: 0;
  max-width: none;
  padding: 10px 6px;
  background: var(--background-modifier-form-field);
  transition: none;
  overflow: hidden;
}

.journalit-account-dashboard .account-card .key-metrics .metric-item:hover {
  transform: none;
  box-shadow: none;
  background: var(--background-modifier-form-field);
}

.journalit-account-dashboard .account-card .key-metrics .metric-item .metric-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-normal);
  margin-bottom: 4px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.journalit-account-dashboard .account-card .key-metrics .metric-item .metric-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
  white-space: nowrap;
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
  justify-content: space-between;
  align-items: center;
  height: 20px; 
}

.journalit-account-dashboard .progress-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
}


.journalit-account-dashboard .progress-label-with-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}


.journalit-account-dashboard .dashboard-status-badge {
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border: 1px solid;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  flex-shrink: 0;
}

.journalit-account-dashboard .dashboard-status-badge.in-progress {
  border-color: var(--color-warning);
  color: var(--color-warning);
  background: rgba(245, 158, 11, 0.1);
}

.journalit-account-dashboard .dashboard-status-badge.achieved {
  border-color: var(--text-success);
  color: var(--text-success);
  background: rgba(var(--color-green-rgb), 0.1);
}

.journalit-account-dashboard .dashboard-status-badge.breached {
  border-color: var(--text-error);
  color: var(--text-error);
  background: rgba(var(--color-red-rgb), 0.1);
}

.journalit-account-dashboard .progress-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-normal);
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
  width: 100%;
  height: 8px;
  background: var(--background-modifier-border);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-top: 8px; 
}

.journalit-account-dashboard .progress-bar {
  height: 100%;
  width: var(--journalit-account-progress-width, 0%);
  border-radius: 4px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  left: 0;
  top: 0;
  min-width: 0;
}


.journalit-account-dashboard .progress-bar.profit-target {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.journalit-account-dashboard .progress-bar.profit-target.complete {
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
}

.journalit-account-dashboard .progress-bar.drawdown.safe {
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
}

.journalit-account-dashboard .progress-bar.drawdown.warning {
  background: linear-gradient(90deg, #eab308 0%, #ca8a04 100%);
  box-shadow: 0 2px 8px rgba(234, 179, 8, 0.2);
}

.journalit-account-dashboard .progress-bar.drawdown.critical {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 2px 8px rgba(var(--color-red-rgb), 0.2);
}


.journalit-account-dashboard .progress-bar.empty {
  background: transparent !important;
  width: 0% !important;
}


.journalit-account-dashboard .progress-bar[data-is-zero="true"] {
  display: none;
}


.journalit-account-dashboard .account-card-footer {
  padding-top: 16px;
  border-top: 1px solid var(--background-modifier-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 24px; 
  gap: 12px;
}

.journalit-account-dashboard .footer-metric {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0; 
}

.journalit-account-dashboard .footer-metric:first-child {
  flex: 1; 
}

.journalit-account-dashboard .footer-metric:last-child {
  flex: 0 0 auto; 
  justify-content: flex-end;
}

.journalit-account-dashboard .footer-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
}

.journalit-account-dashboard .footer-value {
  font-size: 0.75rem;
  color: var(--text-normal);
  font-weight: 600;
  white-space: nowrap;
}


.journalit-account-dashboard.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1.2rem;
  color: var(--text-muted);
}

.journalit-account-dashboard.error {
  padding: 20px;
  color: var(--text-error);
  background-color: rgba(var(--text-error-rgb), 0.05);
  border-left: 3px solid var(--text-error);
  margin: 20px;
  border-radius: 0 4px 4px 0;
}

.journalit-account-dashboard .loading-spinner {
  padding: 20px;
  text-align: center;
}

.journalit-account-dashboard .error-message {
  padding: 20px;
  font-weight: 500;
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
  background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-primary) 100%);
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
  max-width: var(--account-type-metric-max-width, 120px); 
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


.journalit-account-dashboard .account-type-header .metric-item .metric-value.weight-percent {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-info);
}


.journalit-account-dashboard .account-type-header .metric-item .metric-value.excluded-status {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  font-style: italic;
}


.journalit-account-dashboard .account-type-header .metric-item .metric-value.positive {
  color: var(--text-success);
}

.journalit-account-dashboard .account-type-header .metric-item .metric-value.negative {
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
  .journalit-account-dashboard .account-type-header .metric-item-trigger--withdrawals,
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

`;


export function injectAccountStyles(): void {
  return;
}


export function removeAccountStyles(): void {
  return;
}
