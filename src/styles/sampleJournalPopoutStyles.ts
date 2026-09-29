export const SAMPLE_JOURNAL_POPOUT_STYLES = `
.journalit-sample-popout {
  position: relative;
  overflow: hidden;
  border: 1px dashed var(--text-warning);
  border-radius: 8px;
  background: var(--background-primary);
  box-shadow: var(
    --shadow-s,
    0 4px 12px var(--background-modifier-border)
  );
  font-family: var(--font-interface);
  width: fit-content;
  max-width: 100%;
  padding: 14px 18px;
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.journalit-sample-popout--visible {
  opacity: 1;
  transform: translateX(0);
}

.journalit-sample-popout__title {
  margin: 0;
  color: var(--text-normal);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.journalit-sample-popout__description {
  margin: 3px 0 0;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.4;
}

.journalit-sample-popout__actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  margin-top: 7px;
}

.journalit-sample-popout__button {
  margin: 0;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
}

.journalit-sample-popout__button--primary {
  border: none;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
}

.journalit-sample-popout__button--primary:hover {
  background: var(--interactive-accent-hover);
  color: var(--text-on-accent);
}

.journalit-sample-popout__button--secondary {
  border: 1px solid var(--background-modifier-border);
  background: transparent;
  color: var(--text-muted);
}

.journalit-sample-popout__button--secondary:hover {
  border-color: var(--background-modifier-border-hover);
  background: var(--background-secondary);
  color: var(--text-normal);
}
`;
