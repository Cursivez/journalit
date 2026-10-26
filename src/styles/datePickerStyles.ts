
export const DATE_PICKER_STYLES = `
.journalit-date-picker {
  position: fixed;
  top: var(--journalit-date-picker-top);
  left: var(--journalit-date-picker-left);
  
  z-index: 100001;
  display: flex;
  flex-direction: column;
  width: 280px;
  max-height: var(--journalit-date-picker-max-height);
  overflow: hidden auto;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--journalit-radius-md);
  background: var(--background-primary);
  box-shadow: var(--shadow-s);
  color: var(--text-normal);
  font-family: var(--font-interface);
  font-size: var(--font-ui-small);
}

.journalit-date-picker[data-time-only="true"] {
  width: auto;
}

.journalit-date-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 8px;
  background: var(--background-secondary);
}

.journalit-date-picker__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: var(--journalit-radius-sm);
  color: var(--text-muted);
}

.journalit-date-picker__title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-ui-small);
  font-weight: 600;
}

.journalit-date-picker__year,
.journalit-date-picker__time-unit {
  display: inline-flex;
  align-items: center;
}

.journalit-date-picker__year-input {
  width: 5ch;
  height: auto;
  padding: 0 2px;
  border: none;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  font: inherit;
  text-align: right;
}

.journalit-date-picker__year-input:focus-visible {
  box-shadow: inset 0 0 0 1px var(--interactive-accent);
}

.journalit-date-picker__stepper {
  display: inline-flex;
  flex-direction: column;
}

.journalit-date-picker__step {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 12px;
  padding: 0;
  border: none;
  border-radius: var(--journalit-radius-sm);
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  cursor: pointer;
}

.journalit-date-picker__step:hover {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-date-picker__weekdays,
.journalit-date-picker__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 8px;
}

.journalit-date-picker__weekdays {
  padding-top: 6px;
  padding-bottom: 2px;
}

.journalit-date-picker__weekday {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
}

.journalit-date-picker__days {
  gap: 2px;
  padding-bottom: 8px;
}

.journalit-date-picker__day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--journalit-radius-sm);
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  cursor: pointer;
}

.journalit-date-picker__day:hover {
  background: var(--background-modifier-hover);
}

.journalit-date-picker__day:focus-visible {
  outline: 2px solid var(--background-modifier-border-focus);
  outline-offset: -2px;
}

.journalit-date-picker__day[data-outside-month="true"] {
  color: var(--text-faint);
}

.journalit-date-picker__day[data-today="true"] {
  box-shadow: inset 0 0 0 2px var(--interactive-accent);
  color: var(--text-accent);
  font-weight: 600;
}

.journalit-date-picker__day[data-active="true"],
.journalit-date-picker__day[data-active="true"]:hover {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  font-weight: 600;
}

.journalit-date-picker__day:disabled,
.journalit-date-picker__day:disabled:hover {
  background: transparent;
  color: var(--text-faint);
  cursor: not-allowed;
  opacity: 0.5;
}

.journalit-date-picker__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px;
  border-top: 1px solid var(--background-modifier-border);
}

.journalit-date-picker[data-time-only="true"] .journalit-date-picker__footer {
  border-top: none;
}

.journalit-date-picker[data-has-seconds="true"] .journalit-date-picker__footer {
  gap: 4px;
  padding: 8px 6px;
}

.journalit-date-picker[data-has-seconds="true"] .journalit-date-picker__step {
  width: 12px;
}

.journalit-date-picker[data-has-seconds="true"] .journalit-date-picker__action {
  padding: 6px 7px;
}

.journalit-date-picker__action {
  flex-shrink: 0;
  padding: 6px 10px;
  font-size: var(--font-ui-smaller);
  white-space: nowrap;
}

.journalit-date-picker__time {
  display: flex;
  align-items: center;
  gap: 2px;
}

.journalit-date-picker__time-input {
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--journalit-radius-sm);
  background: var(--background-secondary);
  box-shadow: none;
  color: var(--text-normal);
  font-size: var(--font-ui-medium);
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.journalit-date-picker__time-input:hover,
.journalit-date-picker__time-input:focus,
.journalit-date-picker__time-input:focus-visible {
  border-color: var(--interactive-accent);
  background: var(--background-primary);
  box-shadow: inset 0 0 0 1px var(--interactive-accent);
}

.journalit-date-picker__separator {
  color: var(--text-muted);
  font-weight: 600;
}

.journalit-date-picker__ampm {
  height: 30px;
  margin-left: 4px;
  padding: 0 6px;
  font-size: var(--font-ui-smaller);
  font-weight: 600;
}
`;
