

export const badgeStyles = `

.journalit-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-interface);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: center;
  cursor: help;
}

.journalit-count-badge--mistakes {
  background: rgba(244, 67, 54, 0.15);
  color: var(--color-red);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.journalit-count-badge--mistakes:hover {
  background: rgba(244, 67, 54, 0.25);
}

.journalit-count-badge--setups {
  background: rgba(33, 150, 243, 0.15);
  color: var(--color-info);
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.journalit-count-badge--setups:hover {
  background: rgba(33, 150, 243, 0.25);
}


.trade-mistakes-cell,
.trade-setups-cell {
  text-align: center;
  vertical-align: middle;
}


.widget-trade-mistakes-cell,
.widget-trade-setups-cell {
  text-align: center;
  vertical-align: middle;
}

.trade-no-data {
  color: var(--text-muted);
}


.journalit-tooltip {
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-width: 250px;
  min-width: 120px;
  font-size: 13px;
  color: var(--text-normal);
  z-index: 9999;
}


.journalit-tooltip .badge-tooltip {
  min-width: 100px;
}

.journalit-tooltip .badge-tooltip .tooltip-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.journalit-tooltip .badge-tooltip .tooltip-item {
  color: var(--text-muted);
  margin: 2px 0;
  line-height: 1.4;
}

.journalit-tooltip .badge-tooltip.setups-tooltip .tooltip-title {
  color: var(--interactive-accent);
}

.journalit-tooltip .badge-tooltip.mistakes-tooltip .tooltip-title {
  color: var(--color-red);
}
`;
