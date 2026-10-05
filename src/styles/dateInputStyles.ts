export const DATE_INPUT_STYLES = `
.journalit-date-range-editor {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.journalit-date-range-editor .journalit-date-range-editor__row,
.journalit-date-range-editor .journalit-date-input {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: center;
  gap: 8px;
}
.journalit-date-range-editor .journalit-fast-datetime__label {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  white-space: nowrap;
}
.journalit-date-range-editor .journalit-fast-datetime__error {
  grid-column: 2;
  font-size: var(--font-ui-smaller);
}
.journalit-date-range-editor .journalit-date-range-editor__error {
  grid-column: 1 / -1;
  margin: 0;
  font-size: var(--font-ui-smaller);
  color: var(--text-error);
}
`;
