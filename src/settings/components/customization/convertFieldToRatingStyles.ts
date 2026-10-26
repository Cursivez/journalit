

export const CONVERT_FIELD_TO_RATING_STYLES = `
.journalit-convert-rating-modal.is-busy .modal-close-button,
.journalit-convert-rating-modal.is-busy .modal-header-button {
  visibility: hidden;
}

.journalit-convert-rating-modal .journalit-convert-rating {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-4);
}

.journalit-convert-rating-modal .journalit-convert-rating__intro,
.journalit-convert-rating-modal .journalit-convert-rating__result {
  margin: 0;
  font-size: var(--font-ui-small);
  color: var(--text-normal);
}

.journalit-convert-rating-modal .journalit-convert-rating__muted {
  margin: 0;
  font-size: var(--font-ui-smaller);
  color: var(--text-muted);
}

.journalit-convert-rating-modal .journalit-convert-rating__error {
  font-size: var(--font-ui-smaller);
  color: var(--text-error);
}

.journalit-convert-rating-modal .journalit-convert-rating__scale {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--size-4-2);
  font-size: var(--font-ui-small);
}

.journalit-convert-rating-modal .journalit-convert-rating__scale-input {
  width: 9em;
}

.journalit-convert-rating-modal .journalit-convert-rating__table-scroll {
  max-height: min(50vh, 420px);
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
}

.journalit-convert-rating-modal .journalit-convert-rating__table {
  width: 100%;
  margin: 0;
  border: 0;
  border-collapse: collapse;
  font-size: var(--font-ui-small);
}

.journalit-convert-rating-modal .journalit-convert-rating__table :is(th, td) {
  padding: var(--size-4-2) var(--size-4-3);
  border: 0;
  border-top: 1px solid var(--background-modifier-border);
  text-align: left;
  vertical-align: middle;
}

.journalit-convert-rating-modal .journalit-convert-rating__table th {
  position: sticky;
  top: 0;
  z-index: 1;
  border-top: 0;
  background: var(--background-secondary);
  font-size: var(--font-ui-smaller);
  font-weight: 600;
  color: var(--text-muted);
}

.journalit-convert-rating-modal .journalit-convert-rating__table .is-count {
  width: 1%;
  white-space: nowrap;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

.journalit-convert-rating-modal .journalit-convert-rating__value {
  
  max-width: 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.journalit-convert-rating-modal .journalit-convert-rating__stars {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--size-4-1) var(--size-4-2);
}

.journalit-convert-rating-modal .journalit-convert-rating__stars > * {
  white-space: nowrap;
}

.journalit-convert-rating-modal .journalit-convert-rating__conflict {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-4-2);
  font-size: var(--font-ui-small);
}

.journalit-convert-rating-modal .journalit-convert-rating__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-4-3);
  padding-top: var(--size-4-3);
  border-top: 1px solid var(--background-modifier-border);
}

.journalit-convert-rating-modal .journalit-convert-rating__summary {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
  font-size: var(--font-ui-small);
}

.journalit-convert-rating-modal .journalit-convert-rating__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--size-4-2);
  margin-left: auto;
}

.journalit-convert-rating-modal .journalit-convert-rating__next {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-1);
  padding: var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-secondary);
}

.journalit-convert-rating-modal .journalit-convert-rating__next-title {
  font-size: var(--font-ui-small);
  font-weight: 600;
}

.journalit-convert-rating-modal .journalit-convert-rating__issues ul {
  margin: var(--size-4-1) 0 0;
  padding-left: var(--size-4-5);
  max-height: 160px;
  overflow-y: auto;
  font-size: var(--font-ui-smaller);
  color: var(--text-muted);
  word-break: break-all;
}

.journalit-convert-rating-modal .journalit-convert-rating__progress {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-2);
  font-size: var(--font-ui-small);
}

.journalit-convert-rating-modal .journalit-convert-rating__progress-track {
  height: 6px;
  overflow: hidden;
  border-radius: var(--radius-s);
  background: var(--background-modifier-border);
}

.journalit-convert-rating-modal .journalit-convert-rating__progress-fill {
  width: var(--journalit-convert-progress, 0%);
  height: 100%;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  transition: width 120ms ease-out;
}
`;
