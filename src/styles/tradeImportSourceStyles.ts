
export const TRADE_IMPORT_SOURCE_STYLES = `

.journalit-csv-import .journalit-trade-import-source-step {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 18px;
}

.journalit-csv-import .journalit-trade-import-source-step__header h3 {
  margin: 0 0 4px;
  font-size: 1.15rem;
}

.journalit-csv-import .journalit-trade-import-source-step__header p {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-csv-import .journalit-trade-import-source-step__cancel {
  align-self: flex-end;
}


.journalit-csv-import .journalit-trade-import-source-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding: 10px 12px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background: var(--background-secondary);
}

.journalit-csv-import .journalit-trade-import-source-summary__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.journalit-csv-import .journalit-trade-import-source-summary__eyebrow {
  color: var(--text-faint);
  font-size: var(--font-ui-smaller);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.journalit-csv-import .journalit-trade-import-source-summary__text strong {
  overflow: hidden;
  color: var(--text-normal);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-csv-import .journalit-trade-import-source-summary__hint {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-csv-import .journalit-trade-import-source-summary__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
}

.journalit-csv-import .journalit-trade-import-source-summary__actions .journalit-trade-import-favorite-button {
  margin-right: 0;
}


.journalit-csv-import .journalit-trade-import-sync-suggestion {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 18px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--interactive-accent) 45%, transparent);
  border-radius: 10px;
  background: color-mix(in srgb, var(--interactive-accent) 8%, var(--background-secondary));
  scroll-margin: 22px;
}


.journalit-csv-import .journalit-trade-import-source-step .journalit-trade-import-sync-suggestion,
.journalit-csv-import .journalit-trade-import-sync-suggestion:last-child {
  margin: 0;
}

.journalit-csv-import .journalit-trade-import-sync-suggestion__icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
}

.journalit-csv-import .journalit-trade-import-sync-suggestion__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  font-size: var(--font-ui-small);
}

.journalit-csv-import .journalit-trade-import-sync-suggestion__text span {
  color: var(--text-muted);
}

.journalit-csv-import .journalit-trade-import-sync-suggestion__action {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
}

@media (max-width: 720px) {
  .journalit-csv-import .journalit-trade-import-source-summary,
  .journalit-csv-import .journalit-trade-import-sync-suggestion {
    flex-wrap: wrap;
  }
}
`;
