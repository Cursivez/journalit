

export const monthlyReviewStyles = `

.monthly-review {
  width: 100%;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.monthly-review-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 600;
}


.monthly-review-content {
  margin-top: 8px;
}


.monthly-review-section {
  margin-bottom: 20px;
  background: var(--background-primary-alt);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--background-modifier-border);
}

.monthly-review-section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--text-normal);
  text-align: center;
}

.monthly-review-section-description {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 15px;
}


.monthly-review-metric-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.monthly-review-metric-card {
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  padding: 15px;
  text-align: center;
}

.monthly-review-metric-card.highlight-card {
  position: relative;
}

.monthly-review-metric-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.monthly-review-metric-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-normal);
}

.monthly-review-metric-detail {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 4px;
}


.monthly-review-best-trade {
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  padding: 20px;
}

.monthly-review-best-trade.best-trade {
  border-left: 3px solid var(--color-green);
}

.monthly-review-best-trade.worst-trade {
  border-left: 3px solid var(--color-red);
}

.monthly-review-best-trade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.monthly-review-best-trade-title {
  font-size: 16px;
  font-weight: 600;
}

.monthly-review-best-trade-pnl {
  font-size: 20px;
  font-weight: 600;
}

.monthly-review-best-trade-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.monthly-review-best-trade-detail {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.monthly-review-best-trade-label {
  color: var(--text-muted);
  font-weight: 500;
}

.monthly-review-best-trade-value {
  color: var(--text-normal);
}

.monthly-review-best-trade-actions {
  margin-top: 15px;
}

.monthly-review-view-button {
  padding: 6px 12px;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.monthly-review-view-button:hover {
  background: var(--interactive-accent-hover);
}

.monthly-review-link-button {
  padding: 4px 8px;
  background: transparent;
  color: var(--text-accent);
  border: 1px solid var(--text-accent);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 8px;
}

.monthly-review-link-button:hover {
  background: var(--text-accent);
  color: var(--text-on-accent);
}


.monthly-review-week-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}


.monthly-review-trades-table {
  width: 100%;
  overflow-x: auto;
}

.monthly-review-trades-table table {
  width: 100%;
  border-collapse: collapse;
}

.monthly-review-trades-table th,
.monthly-review-trades-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid var(--background-modifier-border);
}

.monthly-review-trades-table th {
  font-weight: 600;
  color: var(--text-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.monthly-review-trade-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.monthly-review-trade-row:hover {
  background: var(--background-modifier-hover);
}


.demon-tracker-container {
  margin-top: 15px;
}

.demon-tracker-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  overflow: hidden;
}

.demon-tracker-table th,
.demon-tracker-table td {
  padding: 12px;
  text-align: center;
  border-right: 1px solid var(--background-modifier-border);
}

.demon-tracker-table th:last-child,
.demon-tracker-table td:last-child {
  border-right: none;
}

.demon-tracker-header {
  background: var(--background-secondary);
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
}

.demon-tracker-header.stop-trading {
  background: var(--background-modifier-error);
  color: var(--text-error);
}

.demon-tracker-row {
  border-top: 1px solid var(--background-modifier-border);
}

.demon-tracker-row:hover {
  background: var(--background-modifier-hover);
}


.monthly-review-content .drc-section:first-child {
  border: 1px solid var(--background-modifier-border);
  border-top: none;
  border-radius: 0 0 6px 6px;
  margin: 0 0 24px 0;
  padding: 16px;
  background-color: var(--background-primary);
}

.demon-name {
  text-align: left;
  font-weight: 500;
  color: var(--text-normal);
}

.demon-occurrence {
  position: relative;
}

.demon-x {
  color: var(--text-error);
  font-weight: 600;
  font-size: 18px;
}

.demon-x.stop {
  color: var(--text-on-accent);
  background: var(--background-modifier-error);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.demon-empty {
  color: var(--text-faint);
  font-size: 14px;
}


.demon-tracker-summary {
  margin-top: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.demon-summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.demon-summary-label {
  font-size: 14px;
  color: var(--text-muted);
}

.demon-summary-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-normal);
}

.demon-summary-item.warning .demon-summary-value {
  color: var(--text-error);
}


.monthly-review-header {
  padding: 16px 20px 12px;
  background-color: var(--background-secondary);
  text-align: center;
  border-bottom: 1px solid var(--background-modifier-border);
}


.monthly-review-content-placeholder {
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
  background: var(--background-secondary-alt);
  border-radius: 6px;
  border: 1px dashed var(--background-modifier-border);
}


.monthly-review-navigation {
  width: 100%;
  padding-top: 10px;
  border-top: 1px solid var(--background-modifier-border-subtle, rgba(127, 127, 127, 0.1));
  background-color: var(--background-secondary);
}

.monthly-review-navigation-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;
}

.monthly-review-navigation-button {
  padding: 8px 14px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background-color: var(--background-primary);
  color: var(--text-normal);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  text-align: center;
  min-width: 120px;
  box-sizing: border-box;
}

.monthly-review-navigation-button:hover {
  background-color: var(--background-modifier-hover);
  transform: translateY(-1px);
}

.monthly-review-navigation-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


.monthly-review-tabs-container {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid var(--background-modifier-border);
  background-color: var(--background-secondary-alt, #2a2a2a);
  padding: 0;
}

.monthly-review-tabs {
  display: flex;
  justify-content: center;
  background-color: transparent;
  max-width: 600px;
  margin: 0 auto;
}

.monthly-review-tab {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  outline: none;
}

.monthly-review-tab:hover {
  color: var(--text-normal);
  background-color: rgba(127, 127, 127, 0.05);
}

.monthly-review-tab.active {
  color: var(--text-accent);
  border-bottom: 2px solid var(--text-accent);
}


.monthly-review-overview .recharts-responsive-container {
  margin: 0 auto;
}


.monthly-review-overview {
  padding-top: 4px;
}


.monthly-review-review {
  padding-top: 4px;
}


.monthly-review-overview > *:first-child,
.monthly-review-review > *:first-child {
  margin-top: 0 !important;
}


.grade-count {
  text-align: center;
  font-weight: 600;
  padding: 8px;
}

.grade-count.grade-a {
  color: var(--color-green, #43a047);
}

.grade-count.grade-b {
  color: var(--color-orange, #fb8c00);
}

.grade-count.grade-c {
  color: var(--color-red, #e53935);
}

.rating-cell {
  text-align: center;
  font-weight: 600;
}

.notes-cell {
  max-width: 300px;
}

.notes-content {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.4;
  color: var(--text-muted);
  font-size: 13px;
}

.empty-performance-message {
  text-align: center;
  color: var(--text-muted);
  padding: 20px;
  font-style: italic;
}
`;
