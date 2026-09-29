

export const ECONOMIC_CALENDAR_STYLES = `
.journalit-economic-calendar-view-container .view-content {
  padding: 0;
  overflow: hidden;
}

.journalit-econ-calendar {
  --journalit-econ-high: var(--color-red, #e53935);
  --journalit-econ-medium: var(--color-orange, #fb8c00);
  --journalit-econ-low: var(--color-yellow, #fdd835);
  --journalit-econ-none: var(--text-faint, #888888);
  
  --journalit-econ-columns: 22px 62px 34px 10px minmax(0, 1fr) 62px 62px 62px;
  --journalit-econ-column-gap: 10px;
  
  container-type: inline-size;
  container-name: journalit-econ;
  height: 100%;
  
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 24px 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.journalit-econ-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex: 0 0 auto;
}

.journalit-econ-header__titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.journalit-econ-header__heading {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}

.journalit-econ-header__actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 0 0 auto;
}

.journalit-econ-header__title {
  margin: 0;
  color: var(--text-normal);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
}

.journalit-econ-header__week {
  color: var(--text-faint);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.journalit-econ-header__refresh {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border: none;
  border-radius: 5px;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  cursor: pointer;
}

.journalit-econ-header__refresh:hover:not(:disabled) {
  background-color: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-econ-header__refresh:disabled {
  opacity: 0.5;
  cursor: default;
}

.journalit-econ-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  flex: 0 0 auto;
  margin-top: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-econ-filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
  min-width: 0;
}

.journalit-econ-filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.journalit-econ-filter-group__label {
  color: var(--text-faint);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.journalit-econ-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.journalit-econ-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  padding: 0 9px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 11px;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
}

.journalit-econ-chip:hover {
  color: var(--text-normal);
}

.journalit-econ-chip[aria-pressed='true'] {
  border-color: var(--interactive-accent);
  background-color: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-econ-select-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
}

.journalit-econ-select-all--disabled {
  color: var(--text-faint);
  cursor: default;
}

.journalit-econ-select-all--disabled input {
  cursor: default;
}

.journalit-econ-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  
  scrollbar-gutter: stable;
  
  padding: 0 0 12px;
}

.journalit-econ-day + .journalit-econ-day {
  margin-top: 10px;
}

.journalit-econ-day__label {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  padding: 6px 0 4px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.journalit-econ-day__weekday {
  color: var(--text-muted);
}

.journalit-econ-day__date {
  color: var(--text-faint);
}


.journalit-econ-columns {
  position: sticky;
  top: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: var(--journalit-econ-columns);
  gap: var(--journalit-econ-column-gap);
  align-items: center;
  
  padding: 8px 6px 6px;
  background-color: var(--background-primary);
}

.journalit-econ-columns__label {
  color: var(--text-faint);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  text-align: right;
}


.journalit-econ-columns .skeleton-shimmer {
  justify-self: end;
}

.journalit-econ-columns__label--actual {
  grid-column: 6;
}

.journalit-econ-columns__label--forecast {
  grid-column: 7;
}

.journalit-econ-columns__label--previous {
  grid-column: 8;
}

.journalit-econ-row {
  display: grid;
  grid-template-columns: var(--journalit-econ-columns);
  align-items: center;
  gap: var(--journalit-econ-column-gap);
  min-height: 30px;
  padding: 3px 6px;
  border-radius: 5px;
}

.journalit-econ-row:hover {
  background-color: var(--background-modifier-hover);
}

.journalit-econ-row__select {
  display: flex;
  align-items: center;
}

.journalit-econ-row__checkbox {
  margin: 0;
  cursor: pointer;
}

.journalit-econ-row__imported-status {
  color: var(--text-faint);
}

.journalit-econ-row__time {
  color: var(--text-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.journalit-econ-row__currency {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  border-radius: 3px;
  background-color: var(--background-modifier-border);
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.journalit-econ-impact {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex: 0 0 auto;
}

.journalit-econ-impact--high {
  background-color: var(--journalit-econ-high);
}

.journalit-econ-impact--medium {
  background-color: var(--journalit-econ-medium);
}

.journalit-econ-impact--low {
  background-color: var(--journalit-econ-low);
}

.journalit-econ-impact--none {
  background-color: var(--journalit-econ-none);
}


.journalit-econ-row__holiday-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  margin-left: -1px;
  color: var(--journalit-econ-none);
}

.journalit-econ-row--holiday .journalit-econ-row__time,
.journalit-econ-row--holiday .journalit-econ-row__title {
  color: var(--text-muted);
}

.journalit-econ-row--holiday .journalit-econ-row__time {
  font-variant-numeric: normal;
}


.journalit-econ-row--past .journalit-econ-row__time,
.journalit-econ-row--past .journalit-econ-row__currency,
.journalit-econ-row--past .journalit-econ-reading__value {
  color: var(--text-faint);
}

.journalit-econ-row--past .journalit-econ-row__title,
.journalit-econ-row--past
  .journalit-econ-reading--actual
  .journalit-econ-reading__value {
  color: var(--text-muted);
}


.journalit-econ-row--past .journalit-econ-impact {
  opacity: 0.55;
}

.journalit-econ-chip .journalit-econ-impact {
  width: 6px;
  height: 6px;
}

.journalit-econ-row__name {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.journalit-econ-row__title {
  overflow: hidden;
  color: var(--text-normal);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-econ-badge {
  display: inline-flex;
  align-items: center;
  height: 16px;
  padding: 0 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  white-space: nowrap;
}

.journalit-econ-badge--update {
  background-color: var(--background-modifier-hover);
  color: var(--text-accent);
}


.journalit-econ-row__readings {
  display: grid;
  grid-column: 6 / span 3;
  grid-template-columns: subgrid;
  gap: var(--journalit-econ-column-gap);
  align-items: center;
}

.journalit-econ-reading {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 4px;
  min-width: 0;
  font-size: 11px;
  white-space: nowrap;
}


.journalit-econ-reading__label {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.journalit-econ-reading__value {
  overflow: hidden;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  text-overflow: ellipsis;
}

.journalit-econ-reading--actual .journalit-econ-reading__value {
  color: var(--text-normal);
  font-weight: 600;
}


@container journalit-econ (max-width: 620px) {
  .journalit-econ-columns {
    display: none;
  }

  
  .journalit-econ-list {
    padding-top: 8px;
  }

  .journalit-econ-row {
    grid-template-columns: auto auto auto 10px minmax(0, 1fr);
    grid-template-areas:
      'select time currency impact name'
      'readings readings readings readings readings';
    row-gap: 1px;
    padding: 5px 6px;
  }

  .journalit-econ-row__select {
    grid-area: select;
  }

  .journalit-econ-row__time {
    grid-area: time;
  }

  .journalit-econ-row__currency {
    grid-area: currency;
    padding: 0 5px;
  }

  .journalit-econ-row .journalit-econ-impact,
  .journalit-econ-row__holiday-icon {
    grid-area: impact;
  }

  .journalit-econ-row__name {
    grid-area: name;
  }

  .journalit-econ-row__readings {
    display: flex;
    grid-area: readings;
    flex-wrap: wrap;
    gap: 4px 12px;
    padding-left: 2px;
  }

  
  .journalit-econ-reading:empty {
    display: none;
  }

  .journalit-econ-reading {
    justify-content: flex-start;
  }

  .journalit-econ-reading__label {
    position: static;
    width: auto;
    height: auto;
    margin: 0;
    overflow: visible;
    clip: auto;
    color: var(--text-faint);
    font-size: 9px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .journalit-econ-filters {
    gap: 8px 12px;
  }

  .journalit-econ-filter-controls {
    gap: 8px 12px;
  }
}

.journalit-econ-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  flex: 0 0 auto;
  padding: 10px 0 16px;
  border-top: 1px solid var(--background-modifier-border);
}

.journalit-econ-footer__restore,
.journalit-econ-footer__import {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 6px 14px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.journalit-econ-footer__restore {
  border: 1px solid var(--background-modifier-border);
  background-color: transparent;
  color: var(--text-muted);
}

.journalit-econ-footer__restore:hover:not(:disabled) {
  border-color: var(--background-modifier-border-hover);
  background-color: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-econ-footer__import {
  margin-left: auto;
  border: none;
  background-color: var(--interactive-accent);
  color: var(--text-on-accent);
}

.journalit-econ-footer__import:hover:not(:disabled) {
  background-color: var(--interactive-accent-hover);
  color: var(--text-on-accent);
}

.journalit-econ-footer__restore:disabled,
.journalit-econ-footer__import:disabled {
  opacity: 0.45;
  cursor: default;
}


.journalit-econ-loading {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.journalit-econ-loading__select-all {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
}


.journalit-econ-row--skeleton:hover {
  background-color: transparent;
}

.journalit-econ-message {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-faint);
  text-align: center;
}

.journalit-econ-message__text {
  margin: 0;
  color: var(--text-muted);
  font-size: 13px;
}

.journalit-econ-message__action {
  padding: 5px 12px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 5px;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  font-size: 12px;
  cursor: pointer;
}

.journalit-econ-message__action:hover {
  background-color: var(--background-modifier-hover);
}

.journalit-econ-gate {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 24px;
  text-align: center;
}

.journalit-econ-gate__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: var(--background-modifier-hover);
  color: var(--text-accent);
}

.journalit-econ-gate__title {
  margin: 0;
  color: var(--text-normal);
  font-size: 17px;
  font-weight: 600;
}

.journalit-econ-gate__benefits {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--text-muted);
  font-size: 12px;
}

.journalit-econ-gate__benefits > div {
  display: flex;
  align-items: center;
  gap: 6px;
}


.journalit-econ-gate .journalit-econ-gate__cta {
  padding: 7px 18px;
  border: none;
  border-radius: 5px;
  background-color: var(--interactive-accent);
  color: var(--text-on-accent);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.journalit-econ-gate .journalit-econ-gate__cta:hover {
  background-color: var(--interactive-accent-hover);
  color: var(--text-on-accent);
}

.journalit-econ-gate .journalit-econ-gate__secondary {
  padding: 2px 6px;
  border: none;
  background: none;
  box-shadow: none;
  color: var(--text-muted);
  font-size: 12px;
  cursor: pointer;
}

.journalit-econ-gate .journalit-econ-gate__secondary:hover {
  background: none;
  color: var(--text-normal);
}
`;
