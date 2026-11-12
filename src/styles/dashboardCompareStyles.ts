
export const DASHBOARD_COMPARE_STYLES = `


.journalit-compare-tone--a {
  color: var(--journalit-chart-series-1);
}

.journalit-compare-tone--b {
  color: var(--journalit-chart-series-3);
}




.journalit-dashboard-header .journalit-dashboard-filter-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
  min-width: 0;
  max-width: 100%;
}


.journalit-compare-slot {
  display: flex;
  align-items: center;
}

.journalit-compare-slot > * {
  flex-shrink: 0;
}

.journalit-compare-control {
  display: inline-flex;
  align-items: stretch;
  gap: 2px;
  height: var(--journalit-control-height);
  box-sizing: border-box;
  padding: 2px;
  border: 0;
  border-radius: var(--journalit-control-radius);
  background: var(--journalit-control-strip);
}

.journalit-compare-control .journalit-filter-menu-trigger {
  display: inline-flex;
  align-items: stretch;
}

.journalit-compare-control .journalit-compare-control__part,
.journalit-compare-control .journalit-compare-control__stop {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--journalit-space-1);
  height: 100%;
  min-width: 30px;
  margin: 0;
  padding: 0 var(--journalit-space-2);
  border: 0;
  border-radius: var(--journalit-control-inner-radius);
  box-shadow: none;
  font-size: var(--journalit-font-size-caption);
  font-variant-numeric: var(--journalit-font-numeric);
  cursor: pointer;
}

.journalit-compare-control .journalit-compare-control__part--a {
  background: color-mix(in srgb, var(--journalit-chart-series-1) 14%, transparent);
  color: var(--journalit-chart-series-1);
}

.journalit-compare-control .journalit-compare-control__part--b {
  background: color-mix(in srgb, var(--journalit-chart-series-3) 14%, transparent);
  color: var(--journalit-chart-series-3);
}

.journalit-compare-control .journalit-compare-control__part--a:hover,
.journalit-compare-control .journalit-compare-control__part--a.is-open,
.journalit-compare-control .journalit-compare-control__part--a:focus-visible {
  background: color-mix(in srgb, var(--journalit-chart-series-1) 24%, transparent);
}

.journalit-compare-control .journalit-compare-control__part--b:hover,
.journalit-compare-control .journalit-compare-control__part--b.is-open,
.journalit-compare-control .journalit-compare-control__part--b:focus-visible {
  background: color-mix(in srgb, var(--journalit-chart-series-3) 24%, transparent);
}

.journalit-compare-control .journalit-compare-control__count {
  font-weight: var(--journalit-font-weight-semibold);
}

.journalit-compare-control .journalit-compare-control__stop {
  min-width: 26px;
  padding: 0 var(--journalit-space-1);
  background: transparent;
  color: var(--journalit-text-faint);
}

.journalit-compare-control .journalit-compare-control__stop:hover,
.journalit-compare-control .journalit-compare-control__stop:focus-visible {
  background: var(--journalit-control-overlay-hover);
  color: var(--journalit-text-normal);
}

.journalit-compare-control .journalit-compare-control__part:focus-visible,
.journalit-compare-control .journalit-compare-control__stop:focus-visible {
  outline: 2px solid var(--journalit-control-focus);
  outline-offset: -2px;
}



.journalit-filter-menu .journalit-compare-menu-switch {
  display: flex;
  width: fit-content;
  margin: 0 auto;
}

.journalit-filter-menu .journalit-filter-menu__row-icons {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 1px;
}

.journalit-filter-menu .journalit-filter-menu__row-icons .journalit-compare-tone--a,
.journalit-filter-menu .journalit-filter-menu__row-icons .journalit-compare-tone--b {
  color: inherit;
}

.journalit-filter-menu .journalit-filter-menu__row-icons .journalit-compare-tone--a {
  color: var(--journalit-chart-series-1);
}

.journalit-filter-menu .journalit-filter-menu__row-icons .journalit-compare-tone--b {
  color: var(--journalit-chart-series-3);
}

.journalit-filter-menu .journalit-filter-menu__row--action .journalit-filter-menu__row-label {
  flex: 1 1 auto;
}

.journalit-filter-menu .journalit-filter-menu__heading {
  padding: var(--size-2-2) var(--size-4-2) var(--size-2-1);
  color: var(--journalit-text-faint);
  font-size: var(--journalit-font-size-caption);
}

.journalit-filter-menu .journalit-compare-save {
  display: flex;
  flex-direction: column;
  gap: var(--journalit-space-2);
  padding: var(--size-2-2);
}

.journalit-filter-menu .journalit-compare-save .journalit-compare-save__input {
  width: 100%;
  height: 28px;
  box-sizing: border-box;
  font-size: var(--font-ui-small);
}

.journalit-filter-menu .journalit-compare-save__actions {
  display: flex;
  justify-content: flex-end;
}




.journalit-compare-metric-values {
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--journalit-space-4);
  width: 100%;
}

.journalit-compare-metric-value {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: var(--journalit-space-1) var(--journalit-space-2);
  min-width: 0;
}

.journalit-compare-metric-values .journalit-compare-metric-value .journalit-dashboard-metric-value {
  align-items: center;
  width: auto;
  min-width: 0;
  overflow: hidden;
  font-size: calc(clamp(14px, 8cqi, 24px) * var(--journalit-compare-value-scale, 1));
}

.journalit-compare-metric-value .journalit-dashboard-metric-cents {
  font-size: 0.67em;
}

.journalit-compare-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-width: 16px;
  height: 16px;
  box-sizing: border-box;
  padding: 0 3px;
  border-radius: var(--journalit-radius-sm);
  font-size: var(--journalit-font-size-caption);
  font-weight: var(--journalit-font-weight-semibold);
  line-height: 1;
}

.journalit-compare-tag--a {
  background: color-mix(in srgb, var(--journalit-chart-series-1) 16%, transparent);
  color: var(--journalit-chart-series-1);
}

.journalit-compare-tag--b {
  background: color-mix(in srgb, var(--journalit-chart-series-3) 16%, transparent);
  color: var(--journalit-chart-series-3);
}

.journalit-compare-low-sample {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  color: var(--journalit-status-warning);
  cursor: help;
}

.journalit-compare-low-sample:focus-visible {
  border-radius: var(--journalit-radius-sm);
  outline: 2px solid var(--background-modifier-border-focus);
  outline-offset: 1px;
}



.journalit-compare-widget {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--journalit-space-1);
  min-width: 0;
  min-height: 0;
  height: 100%;
}

.journalit-compare-widget__empty {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  color: var(--journalit-text-muted);
  font-size: var(--font-ui-small);
}

.journalit-compare-chart {
  position: relative;
  margin: 0;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}

.journalit-compare-legend {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--journalit-space-1) var(--journalit-space-4);
  min-width: 0;
  color: var(--journalit-text-muted);
  font-size: var(--journalit-font-size-caption);
}

.journalit-compare-legend__item {
  display: inline-flex;
  align-items: center;
  gap: var(--journalit-space-2);
  min-width: 0;
  max-width: 100%;
}

.journalit-compare-legend__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-compare-legend__line {
  display: inline-block;
  width: 16px;
  border-top: 2px solid var(--journalit-text-muted);
}

.journalit-compare-legend__line--dashed {
  border-top-style: dashed;
}

.journalit-chart-tooltip.journalit-compare-tooltip {
  display: flex;
  flex-direction: column;
  gap: var(--journalit-space-1);
}

.journalit-compare-tooltip .journalit-compare-tooltip__row {
  display: flex;
  align-items: center;
  gap: var(--journalit-space-2);
  white-space: nowrap;
}

.journalit-compare-tooltip .journalit-compare-tooltip__label {
  color: var(--journalit-text-muted);
}

.journalit-compare-tooltip .journalit-compare-tooltip__value {
  font-variant-numeric: var(--journalit-font-numeric);
  font-weight: var(--journalit-font-weight-medium);
}

.journalit-compare-tooltip .journalit-compare-tooltip__note {
  color: var(--journalit-text-faint);
}


.journalit-compare-multiples {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--journalit-space-1);
  min-height: 0;
}

.journalit-compare-multiples__row {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  gap: var(--journalit-space-2);
  min-height: 0;
}

.journalit-compare-multiples__row > .journalit-compare-multiples__chart {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
}

.journalit-compare-multiples__empty {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--journalit-text-faint);
  font-size: var(--font-ui-small);
}


.journalit-dashboard-calendar-month-toolbar.journalit-dashboard-calendar-month-toolbar--with-action {
  grid-template-columns: 24px 1fr 24px auto;
}

.journalit-compare-switch {
  display: inline-flex;
  height: 22px;
  box-sizing: border-box;
  border: var(--border-width) solid var(--background-modifier-border);
  border-radius: var(--journalit-radius-sm);
  overflow: hidden;
}

.journalit-compare-switch .journalit-compare-switch__option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 24px;
  margin: 0;
  padding: 0 var(--journalit-space-2);
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  font-size: var(--journalit-font-size-caption);
  font-weight: var(--journalit-font-weight-semibold);
  opacity: 0.55;
  cursor: pointer;
}

.journalit-compare-switch .journalit-compare-switch__option--a {
  color: var(--journalit-chart-series-1);
}

.journalit-compare-switch .journalit-compare-switch__option--b {
  border-left: var(--border-width) solid var(--background-modifier-border);
  color: var(--journalit-chart-series-3);
}

.journalit-compare-switch .journalit-compare-switch__option--a.is-active {
  background: color-mix(in srgb, var(--journalit-chart-series-1) 16%, transparent);
  opacity: 1;
}

.journalit-compare-switch .journalit-compare-switch__option--b.is-active {
  background: color-mix(in srgb, var(--journalit-chart-series-3) 16%, transparent);
  opacity: 1;
}

.journalit-compare-switch .journalit-compare-switch__option:hover,
.journalit-compare-switch .journalit-compare-switch__option:focus-visible {
  opacity: 1;
}


.journalit-dashboard-recent-trades-table.journalit-dashboard-recent-trades-table--compare {
  grid-template-columns: max-content repeat(4, minmax(max-content, 1fr));
}

.journalit-dashboard-recent-trades-table--compare .journalit-compare-dots-column {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 0;
  white-space: nowrap;
}

.journalit-compare-dots {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.journalit-compare-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  box-sizing: border-box;
  border-radius: 50%;
}

.journalit-compare-dot--a {
  border: 1.5px solid var(--journalit-chart-series-1);
  background: var(--journalit-chart-series-1);
}

.journalit-compare-dot--b {
  border: 1.5px solid var(--journalit-chart-series-3);
  background: var(--journalit-chart-series-3);
}

.journalit-compare-dot.is-empty {
  background: transparent;
  opacity: 0.6;
}
`;
