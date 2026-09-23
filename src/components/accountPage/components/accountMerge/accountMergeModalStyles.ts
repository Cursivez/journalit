

export const ACCOUNT_MERGE_MODAL_STYLES = `
.journalit-account-merge-modal {
  width: min(820px, 94vw);
  max-width: 94vw;
  transition: width 160ms ease;
}

.journalit-account-merge-modal.is-compact {
  width: min(620px, 94vw);
}

.journalit-account-merge-modal .journalit-account-merge-modal__body {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
  width: 100%;
  min-width: 0;
  container-type: inline-size;
}


.journalit-account-merge-modal__header {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
  padding-bottom: var(--size-4-2);
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-account-merge-modal__sequence {
  color: var(--text-accent);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0.02em;
}

.journalit-account-merge-modal__steps {
  display: flex;
  align-items: center;
  gap: var(--size-4-4);
}

.journalit-account-merge-modal__step {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2-2);
  color: var(--text-faint);
  font-size: var(--font-ui-smaller);
  white-space: nowrap;
}

.journalit-account-merge-modal__step.is-active {
  color: var(--text-normal);
  font-weight: var(--font-semibold);
}

.journalit-account-merge-modal__step.is-done {
  color: var(--text-muted);
}

.journalit-account-merge-modal__step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid var(--background-modifier-border);
  font-size: 10px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.journalit-account-merge-modal__step.is-active
  .journalit-account-merge-modal__step-index {
  border-color: var(--interactive-accent);
  background: var(--interactive-accent);
  color: var(--text-on-accent);
}

.journalit-account-merge-modal__step.is-done
  .journalit-account-merge-modal__step-index {
  border-color: var(--interactive-accent);
  color: var(--interactive-accent);
}


.journalit-account-merge-modal__content {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-4);
  max-height: 58vh;
  overflow-y: auto;
  padding-right: var(--size-2-1);
}

.journalit-account-merge-modal__section {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
}

.journalit-account-merge-modal__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-4-2);
}

.journalit-account-merge-modal__section-title {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.journalit-account-merge-modal__toggle {
  display: flex;
  align-items: center;
  gap: var(--size-2-2);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-account-merge-modal__hint {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2-1);
  color: var(--text-faint);
  font-size: var(--font-ui-smaller);
}

.journalit-account-merge-modal__hint.is-warning {
  color: var(--text-warning);
}


.journalit-account-merge-modal__list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  overflow: hidden;
  max-height: 260px;
  overflow-y: auto;
}

.journalit-account-merge-modal__row {
  display: flex;
  align-items: center;
  gap: var(--size-4-2);
  padding: var(--size-2-3) var(--size-4-2);
  border-bottom: 1px solid var(--background-modifier-border);
  cursor: pointer;
}

.journalit-account-merge-modal__row:hover {
  background: var(--background-modifier-hover);
}

.journalit-account-merge-modal__row:last-child {
  border-bottom: none;
}

.journalit-account-merge-modal__row.is-empty {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  cursor: default;
}

.journalit-account-merge-modal__row-label {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-account-merge-modal__row-meta {
  display: inline-flex;
  align-items: center;
  gap: var(--size-4-2);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  white-space: nowrap;
}

.journalit-account-merge-modal__badge {
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s);
  padding: 0 var(--size-2-1);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  line-height: 1.6;
  white-space: nowrap;
  text-transform: capitalize;
}


.journalit-account-merge-modal__chain {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--size-2-2);
}

.journalit-account-merge-modal__chain-arrow {
  color: var(--text-faint);
  flex: 0 0 auto;
}

.journalit-account-merge-modal__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2-2);
  padding: var(--size-2-1) var(--size-2-2) var(--size-2-1) var(--size-2-1);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-secondary);
  font-size: var(--font-ui-small);
}

.journalit-account-merge-modal__chip-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--background-modifier-border);
  color: var(--text-muted);
  font-size: 10px;
  font-weight: var(--font-semibold);
  font-variant-numeric: tabular-nums;
  flex: 0 0 auto;
}


.journalit-account-merge-modal__chip-move {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: var(--size-2-1);
}

.journalit-account-merge-modal .journalit-account-merge-modal__chip-move-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: var(--radius-s);
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  cursor: pointer;
}

.journalit-account-merge-modal .journalit-account-merge-modal__chip-move-button:hover:not(:disabled) {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-account-merge-modal .journalit-account-merge-modal__chip-move-button:disabled {
  opacity: 0.35;
  cursor: default;
}


.journalit-account-merge-modal__target {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
}

.journalit-account-merge-modal__target-row {
  display: grid;
  grid-template-columns: auto 110px minmax(0, 1fr);
  align-items: center;
  gap: var(--size-4-2);
}

.journalit-account-merge-modal__target-label {
  cursor: pointer;
  font-size: var(--font-ui-small);
}

.journalit-account-merge-modal__target-input {
  min-width: 0;
  width: 280px;
  max-width: 100%;
  justify-self: start;
}


.journalit-account-merge-modal__field > input,
.journalit-account-merge-modal input.journalit-account-merge-modal__target-input,
.journalit-account-merge-modal__identity .journalit-prop-challenge-field > input,
.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-field > input {
  min-height: 38px;
  border-radius: var(--radius-s);
  font-size: var(--font-ui-medium);
}


.journalit-account-merge-modal__phase-rules .journalit-prop-challenge-rules-empty {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--size-4-2);
}


.journalit-account-merge-modal__identity {
  gap: var(--size-4-3);
}

.journalit-account-merge-modal__applied {
  display: flex;
  align-items: center;
  gap: var(--size-2-2);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-account-merge-modal__applied > span {
  color: var(--text-normal);
}


.journalit-account-merge-modal__phases {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-3);
}

.journalit-account-merge-modal__phase {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-3);
  padding: var(--size-2-3) var(--size-4-2);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-primary);
}

.journalit-account-merge-modal__phase.is-invalid {
  border-color: var(--text-error);
}

.journalit-account-merge-modal__phase.is-pending {
  background: var(--background-secondary);
  color: var(--text-muted);
}

.journalit-account-merge-modal__phase-head {
  display: flex;
  align-items: center;
  gap: var(--size-2-2);
  min-width: 0;
}

.journalit-account-merge-modal__phase-source {
  font-weight: var(--font-semibold);
  font-size: var(--font-ui-small);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-account-merge-modal__phase-facts {
  display: inline-flex;
  align-items: center;
  gap: var(--size-4-2);
  margin-left: auto;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  white-space: nowrap;
}

.journalit-account-merge-modal__phase-grid {
  display: grid;
  grid-template-columns: minmax(160px, 1.6fr) minmax(120px, 1fr) minmax(120px, 1fr);
  gap: var(--size-4-2);
  align-items: end;
}

.journalit-account-merge-modal__phase-dates {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--size-4-2);
}

.journalit-account-merge-modal__phase-dates > * {
  min-width: 0;
}

.journalit-account-merge-modal__phase-facts > * + *::before {
  content: '·';
  margin-right: var(--size-4-2);
  color: var(--text-faint);
}

.journalit-account-merge-modal__field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.journalit-account-merge-modal__field-label {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}


.journalit-account-merge-modal__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-4-3);
  padding: var(--size-4-2) var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-secondary);
}

.journalit-account-merge-modal__summary-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.journalit-account-merge-modal__summary-name {
  font-weight: var(--font-semibold);
  font-size: var(--font-ui-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-account-merge-modal__summary-sub {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-account-merge-modal__summary-stats {
  display: inline-flex;
  align-items: center;
  gap: var(--size-4-4);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  white-space: nowrap;
}

.journalit-account-merge-modal__summary-stats strong {
  color: var(--text-normal);
  font-variant-numeric: tabular-nums;
}

.journalit-account-merge-modal__table {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  overflow: hidden;
}

.journalit-account-merge-modal__table-row,
.journalit-account-merge-modal__table-head {
  display: grid;
  grid-template-columns: 26px minmax(0, 1.6fr) auto minmax(0, 1.4fr) 64px 92px;
  align-items: center;
  gap: var(--size-4-2);
  padding: var(--size-2-2) var(--size-4-2);
  font-size: var(--font-ui-small);
}

.journalit-account-merge-modal__table-row {
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-account-merge-modal__table-head {
  color: var(--text-faint);
  font-size: var(--font-ui-smaller);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--background-secondary);
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-account-merge-modal__table-name {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-account-merge-modal__table-sub {
  color: var(--text-faint);
  font-size: var(--font-ui-smaller);
}

.journalit-account-merge-modal__table-dates {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  white-space: nowrap;
}

.journalit-account-merge-modal__table-count,
.journalit-account-merge-modal__table-head span:nth-last-child(-n + 2) {
  text-align: right;
  font-variant-numeric: tabular-nums;
}


.journalit-account-merge-modal__error {
  display: flex;
  align-items: center;
  gap: var(--size-2-2);
  color: var(--text-error);
  font-size: var(--font-ui-smaller);
}

.journalit-account-merge-modal__warning-group {
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  padding: var(--size-2-2) var(--size-4-2);
}

.journalit-account-merge-modal__warning-summary {
  display: flex;
  align-items: center;
  gap: var(--size-2-2);
  cursor: pointer;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  list-style: none;
}

.journalit-account-merge-modal__warning-summary::-webkit-details-marker {
  display: none;
}

.journalit-account-merge-modal__warning-count {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}

.journalit-account-merge-modal__warning-items {
  margin: var(--size-2-2) 0 0;
  padding-left: var(--size-4-4);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-account-merge-modal__warning-items li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-4-2);
}

.journalit-account-merge-modal__warning-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--size-2-2);
}


.journalit-account-merge-modal__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--size-4-2);
  border-top: 1px solid var(--background-modifier-border);
  padding-top: var(--size-4-2);
}

.journalit-account-merge-modal__actions-spacer {
  flex: 1 1 auto;
}

.journalit-account-merge-modal__loading {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}


.account-date-warning.journalit-account-merge-notice {
  display: flex;
  align-items: center;
  gap: var(--size-4-2);
  background: var(--background-secondary);
  border-color: var(--background-modifier-border);
}

.journalit-account-merge-notice .account-date-warning__icon {
  color: var(--text-muted);
}

.journalit-account-merge-notice__actions {
  display: flex;
  align-items: center;
  gap: var(--size-2-2);
  margin-left: auto;
}


@container (max-width: 680px) {
  .journalit-account-merge-modal__phase-grid,
  .journalit-account-merge-modal__phase-dates {
    grid-template-columns: minmax(0, 1fr);
  }

  .journalit-account-merge-modal__phase-head {
    flex-wrap: wrap;
  }

  .journalit-account-merge-modal__phase-facts {
    margin-left: 0;
    flex-basis: 100%;
    white-space: normal;
  }

  .journalit-account-merge-modal__steps {
    gap: var(--size-4-2);
  }

  .journalit-account-merge-modal__summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .journalit-account-merge-modal__table-row,
  .journalit-account-merge-modal__table-head {
    grid-template-columns: 26px minmax(0, 1fr) auto 64px 92px;
  }

  .journalit-account-merge-modal__table-dates {
    display: none;
  }

}


@container (max-width: 520px) {
  .journalit-account-merge-modal__target-row {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .journalit-account-merge-modal__target-row > :nth-child(3) {
    grid-column: 1 / -1;
  }
}
`;
