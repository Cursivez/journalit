
export const FILTER_MENU_STYLES = `
.journalit-filter-menu-trigger {
  display: inline-flex;
}

.journalit-filter-menu .journalit-filter-menu-date-range {
  padding: 4px 6px 6px;
}

.journalit-filter-menu .journalit-filter-menu__panel {
  position: fixed;
  top: var(--journalit-filter-menu-top);
  left: var(--journalit-filter-menu-left);
  z-index: var(--layer-menu);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 264px;
  max-height: var(--journalit-filter-menu-max-height);
  padding: var(--size-2-3);
  border: var(--border-width) solid var(--background-modifier-border-hover);
  border-radius: var(--radius-m);
  background-color: var(--background-primary);
  box-shadow: var(--shadow-s);
  color: var(--text-normal);
  font-size: var(--font-ui-small);
}


.journalit-filter-menu .journalit-filter-menu__panel--from-left::before,
.journalit-filter-menu .journalit-filter-menu__panel--from-right::before {
  content: "";
  position: absolute;
  
  top: calc(-1 * var(--border-width));
  bottom: calc(-1 * var(--border-width));
  width: var(--journalit-filter-menu-gap);
}

.journalit-filter-menu .journalit-filter-menu__panel--from-left::before {
  right: calc(100% + var(--border-width));
}

.journalit-filter-menu .journalit-filter-menu__panel--from-right::before {
  left: calc(100% + var(--border-width));
}

.journalit-filter-menu .journalit-filter-menu__panel--root {
  width: 248px;
}

.journalit-filter-menu .journalit-filter-menu__panel--drilldown {
  width: min(320px, calc(100vw - 16px));
}

.journalit-filter-menu .journalit-filter-menu__panel--date-range {
  width: 288px;
  max-width: calc(100vw - 16px);
}

.journalit-filter-menu .journalit-filter-menu__panel--measuring {
  visibility: hidden;
}

.journalit-filter-menu .journalit-filter-menu__header {
  display: flex;
  align-items: center;
  gap: var(--size-4-1);
  min-height: 28px;
  padding: 0 var(--size-4-2) var(--size-2-2);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-medium);
}

.journalit-filter-menu .journalit-filter-menu__title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-filter-menu .journalit-filter-menu__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: calc(var(--size-4-1) * -1);
  padding: 0;
}

.journalit-filter-menu .journalit-filter-menu__clear {
  height: auto;
  padding: 2px 6px;
  border: 0;
  border-radius: var(--radius-s);
  background: transparent;
  box-shadow: none;
  color: var(--text-accent);
  font-size: var(--font-ui-smaller);
  cursor: pointer;
}

.journalit-filter-menu .journalit-filter-menu__clear:hover,
.journalit-filter-menu .journalit-filter-menu__clear:focus-visible {
  background-color: var(--background-modifier-hover);
}

.journalit-filter-menu .journalit-filter-menu__scroll {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.journalit-filter-menu .journalit-filter-menu__divider {
  flex: 0 0 auto;
  height: 1px;
  margin: var(--size-2-2) 0;
  border: 0;
  background-color: var(--background-modifier-border);
}

.journalit-filter-menu .journalit-filter-menu__row,
.journalit-filter-menu .journalit-filter-menu__option,
.journalit-filter-menu .journalit-filter-menu__reset {
  display: flex;
  align-items: center;
  gap: var(--size-4-2);
  width: 100%;
  height: auto;
  min-height: 30px;
  padding: var(--size-4-1) var(--size-4-2);
  border: 0;
  border-radius: var(--radius-s);
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  font-weight: var(--font-normal);
  text-align: left;
  cursor: pointer;
}

.journalit-filter-menu .journalit-filter-menu__row:hover,
.journalit-filter-menu .journalit-filter-menu__row:focus-visible,
.journalit-filter-menu .journalit-filter-menu__row.is-open,
.journalit-filter-menu .journalit-filter-menu__option:hover:not(:disabled),
.journalit-filter-menu .journalit-filter-menu__option:focus-visible,
.journalit-filter-menu .journalit-filter-menu__option-row.is-open .journalit-filter-menu__option,
.journalit-filter-menu .journalit-filter-menu__reset:hover:not(:disabled),
.journalit-filter-menu .journalit-filter-menu__reset:focus-visible {
  background-color: var(--background-modifier-hover);
  outline: none;
}

.journalit-filter-menu .journalit-filter-menu__row-icon {
  flex: 0 0 auto;
  color: var(--text-muted);
}

.journalit-filter-menu .journalit-filter-menu__row-label {
  flex: 1 0 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-filter-menu .journalit-filter-menu__row-chevron {
  flex: 0 0 auto;
  color: var(--text-faint);
}

.journalit-filter-menu .journalit-filter-menu__counts {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 0 1 auto;
  min-width: 0;
}

.journalit-filter-menu .journalit-filter-menu__count {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-width: 18px;
  height: 18px;
  box-sizing: border-box;
  padding: 0 5px;
  border-radius: 9px;
  background-color: hsla(var(--interactive-accent-hsl), 0.16);
  color: var(--text-accent);
  font-size: var(--font-ui-smaller);
  font-variant-numeric: tabular-nums;
  font-weight: var(--font-semibold);
  justify-content: center;
}

.journalit-filter-menu .journalit-filter-menu__count--excluded {
  background-color: rgba(var(--color-red-rgb), 0.14);
  color: var(--text-error);
}

.journalit-filter-menu .journalit-filter-menu__reset {
  flex: 0 0 auto;
  color: var(--text-error);
}

.journalit-filter-menu .journalit-filter-menu__reset:disabled {
  color: var(--text-faint);
  cursor: default;
}

.journalit-filter-menu .journalit-filter-menu__search {
  display: flex;
  align-items: center;
  gap: var(--size-4-1);
  flex: 0 0 auto;
  margin: 0 0 var(--size-2-2);
  padding: 0 var(--size-4-2);
  border: var(--border-width) solid var(--background-modifier-border);
  border-radius: var(--radius-s);
  color: var(--text-faint);
}

.journalit-filter-menu .journalit-filter-menu__search:hover {
  background-color: var(--background-modifier-hover);
}

.journalit-filter-menu .journalit-filter-menu__search:focus-within {
  border-color: var(--interactive-accent);
  background-color: var(--background-modifier-form-field);
}


.journalit-filter-menu .journalit-filter-menu__search input[type="text"],
.journalit-filter-menu .journalit-filter-menu__search input[type="text"]:hover,
.journalit-filter-menu .journalit-filter-menu__search input[type="text"]:focus,
.journalit-filter-menu .journalit-filter-menu__search input[type="text"]:active {
  flex: 1 1 auto;
  min-width: 0;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  font-size: var(--font-ui-small);
}

.journalit-filter-menu .journalit-filter-menu__option-row {
  display: flex;
  align-items: stretch;
  gap: 2px;
}

.journalit-filter-menu .journalit-filter-menu__option-row .journalit-filter-menu__option {
  flex: 1 1 auto;
  min-width: 0;
}


.journalit-filter-menu .journalit-filter-menu__option-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-width: 32px;
  min-height: 30px;
  margin: calc(-1 * var(--size-4-1)) calc(-1 * var(--size-4-2)) calc(-1 * var(--size-4-1)) auto;
  color: var(--text-faint);
}

.journalit-filter-menu .journalit-filter-menu__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  border: var(--border-width) solid var(--background-modifier-border-hover);
  border-radius: 4px;
  color: var(--text-on-accent);
}

.journalit-filter-menu .journalit-filter-menu__option.is-included .journalit-filter-menu__check,
.journalit-filter-menu .journalit-filter-menu__option.is-partial .journalit-filter-menu__check {
  border-color: var(--interactive-accent);
  background-color: var(--interactive-accent);
  color: var(--text-on-accent);
}

.journalit-filter-menu .journalit-filter-menu__option-text {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}

.journalit-filter-menu .journalit-filter-menu__option-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-filter-menu .journalit-filter-menu__option-description {
  overflow: hidden;
  color: var(--text-faint);
  font-size: var(--font-ui-smaller);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-filter-menu .journalit-filter-menu__empty {
  padding: var(--size-4-2);
  color: var(--text-faint);
  font-size: var(--font-ui-small);
}

.journalit-filter-menu .journalit-filter-menu__match {
  flex: 0 0 auto;
  margin: 0 0 var(--size-2-2);
}

.journalit-filter-menu .journalit-filter-menu__match-badge {
  overflow: hidden;
  min-width: 0;
  color: var(--text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-ui-smaller);
}

.journalit-filter-menu .journalit-filter-menu__exclude {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 26px;
  height: auto;
  padding: 0;
  border-radius: var(--radius-s);
  color: var(--text-faint);
  opacity: 0.55;
}

.journalit-filter-menu .journalit-filter-menu__option-row:hover .journalit-filter-menu__exclude,
.journalit-filter-menu .journalit-filter-menu__exclude:focus-visible {
  opacity: 1;
}

.journalit-filter-menu .journalit-filter-menu__exclude:hover,
.journalit-filter-menu .journalit-filter-menu__exclude:focus-visible {
  background-color: rgba(var(--color-red-rgb), 0.12);
  color: var(--text-error);
  outline: none;
}

.journalit-filter-menu .journalit-filter-menu__exclude.is-active {
  background-color: rgba(var(--color-red-rgb), 0.16);
  color: var(--text-error);
  opacity: 1;
}

.journalit-filter-menu .journalit-filter-menu__option-row.is-excluded .journalit-filter-menu__option-label {
  color: var(--text-error);
}

.journalit-filter-menu .journalit-filter-menu__option:disabled {
  cursor: default;
}

.journalit-filter-menu .journalit-filter-menu__option:disabled .journalit-filter-menu__check,
.journalit-filter-menu .journalit-filter-menu__option:disabled .journalit-filter-menu__option-label {
  opacity: 0.5;
}

.journalit-filter-menu .journalit-filter-menu__panel--drilldown .journalit-filter-menu__exclude {
  opacity: 1;
}

.journalit-filter-menu .journalit-filter-menu__match-label {
  color: var(--text-muted);
}

.journalit-filter-menu .journalit-filter-menu__match-value {
  flex: 1 1 auto;
  text-align: right;
  font-weight: var(--font-medium);
}

.journalit-filter-menu .journalit-filter-menu__match-row {
  display: flex;
  align-items: center;
  gap: var(--size-4-2);
  width: 100%;
  height: auto;
  min-height: 30px;
  padding: var(--size-4-1) var(--size-4-2);
  border: 0;
  border-radius: var(--radius-s);
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  cursor: pointer;
}

.journalit-filter-menu .journalit-filter-menu__match-row:hover,
.journalit-filter-menu .journalit-filter-menu__match-row:focus-visible,
.journalit-filter-menu .journalit-filter-menu__match-row.is-open {
  background-color: var(--background-modifier-hover);
  outline: none;
}


.journalit-filter-menu .journalit-filter-menu__row,
.journalit-filter-menu .journalit-filter-menu__option,
.journalit-filter-menu .journalit-filter-menu__reset,
.journalit-filter-menu .journalit-filter-menu__match-row {
  transition: none;
}

.journalit-filter-menu .journalit-filter-menu__panel:hover .journalit-filter-menu__row.is-open:not(:hover):not(:focus-visible),
.journalit-filter-menu .journalit-filter-menu__panel:hover .journalit-filter-menu__option-row.is-open:not(:hover) .journalit-filter-menu__option:not(:focus-visible),
.journalit-filter-menu .journalit-filter-menu__panel:hover .journalit-filter-menu__match-row.is-open:not(:hover):not(:focus-visible) {
  background-color: transparent;
}

.journalit-filter-menu .journalit-filter-menu__match-row svg {
  flex: 0 0 auto;
  color: var(--text-faint);
}

.journalit-filter-menu .journalit-filter-menu__option[role="menuitemradio"] .journalit-filter-menu__option-description {
  white-space: normal;
}

.journalit-filter-menu .journalit-filter-menu__option[role="menuitemradio"] .journalit-filter-menu__check {
  border-radius: 50%;
}
`;
