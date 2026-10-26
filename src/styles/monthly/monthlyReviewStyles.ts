

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



.monthly-review-section-description {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 15px;
}



.monthly-review-metric-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}



.monthly-review-best-trade-label {
  color: var(--text-muted);
  font-weight: 500;
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
  color: var(--text-on-accent);
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
  background: var(--interactive-accent);
  color: var(--text-on-accent);
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


.demon-tracker-summary {
  margin-top: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.demon-summary-label {
  font-size: 14px;
  color: var(--text-muted);
}


.monthly-review-header {
  padding: 16px 20px 12px;
  background-color: var(--background-secondary);
  text-align: center;
  border-bottom: 1px solid var(--background-modifier-border);
}


.monthly-review-tabs-container {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid var(--background-modifier-border);
  background-color: var(--background-secondary-alt, #2a2a2a);
  padding: 0;
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
`;
