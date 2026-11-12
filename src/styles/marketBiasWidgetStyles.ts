

export const MARKET_BIAS_WIDGET_STYLES = `
.journalit-market-bias .journalit-market-bias-widget {
  display: flex;
  flex-direction: column;
  gap: var(--journalit-space-3);
  width: 100%;
  max-width: 600px;
  margin: 0 auto 14px;
}

.journalit-market-bias .journalit-market-bias-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.journalit-market-bias .journalit-market-bias-title {
  font-size: 0.7rem;
  font-weight: var(--journalit-font-weight-medium);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.journalit-market-bias .journalit-market-bias-tooltip-trigger {
  display: inline-flex;
  align-items: center;
  color: var(--text-muted);
  opacity: 0.7;
  cursor: help;
}

.journalit-market-bias-tooltip-content {
  max-width: 260px;
  line-height: 1.4;
}

.journalit-market-bias .journalit-market-bias-rows {
  display: flex;
  flex-direction: column;
  border-radius: var(--journalit-radius-md);
  background: var(--background-secondary);
  overflow: hidden;
}

.journalit-market-bias .journalit-market-bias-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--journalit-space-2) var(--journalit-space-4);
  padding: var(--journalit-space-3) var(--journalit-space-3) var(--journalit-space-3) var(--journalit-space-5);
}

.journalit-market-bias .journalit-market-bias-row + .journalit-market-bias-row {
  border-top: 1px solid var(--background-modifier-border);
}

.journalit-market-bias .journalit-market-bias-row-label {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: var(--journalit-font-size-body);
  font-weight: var(--journalit-font-weight-semibold);
  color: var(--text-normal);
}

.journalit-market-bias .journalit-market-bias-row-label.is-overall {
  font-weight: normal;
  color: var(--text-muted);
}

.journalit-market-bias .journalit-market-bias-choice {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  border-radius: var(--journalit-control-radius);
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
}

.journalit-market-bias button.journalit-market-bias-option {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: auto;
  padding: 3px 10px;
  border: 0;
  border-radius: var(--journalit-control-inner-radius);
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  font-size: var(--journalit-font-size-label);
  cursor: pointer;
}

.journalit-market-bias button.journalit-market-bias-option:hover:not(:disabled):not(.is-selected) {
  color: var(--text-normal);
  background: var(--background-modifier-hover);
}

.journalit-market-bias button.journalit-market-bias-option:focus-visible {
  box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
}

.journalit-market-bias button.journalit-market-bias-option:disabled {
  cursor: default;
  opacity: 1;
}

.journalit-market-bias button.journalit-market-bias-option.is-long {
  background: color-mix(in srgb, var(--journalit-pnl-positive) 20%, transparent);
  color: var(--journalit-pnl-positive);
}

.journalit-market-bias button.journalit-market-bias-option.is-short {
  background: color-mix(in srgb, var(--journalit-pnl-negative) 20%, transparent);
  color: var(--journalit-pnl-negative);
}

.journalit-market-bias button.journalit-market-bias-option.is-neutral {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}
`;
