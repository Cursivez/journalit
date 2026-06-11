export const TRADE_ACCOUNT_CELL_STYLES = `
.trade-account-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
}

.trade-account-text {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  background: var(--background-modifier-hover);
  color: var(--interactive-accent);
}

.trade-account-text:hover {
  background: var(--background-modifier-border);
}

.trade-account-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
}

.trade-account-icon {
  color: var(--text-accent);
}

.trade-account-icon:hover {
  color: var(--interactive-accent);
}

.trade-account-count-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  min-width: 12px;
  height: 12px;
  padding: 0 3px;
  border-radius: 6px;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  font-size: 8px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: center;
}

.journalit-tooltip.accounts-tooltip .tooltip-title {
  color: var(--text-accent);
}
`;
