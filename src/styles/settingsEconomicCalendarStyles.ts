

export const SETTINGS_ECONOMIC_CALENDAR_STYLES = `
.journalit-settings-econ .journalit-settings-econ__intro {
  margin: 0 0 12px;
  color: var(--text-muted);
}

.journalit-settings-econ .journalit-settings-econ__gate {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 10px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-secondary);
}

.journalit-settings-econ .journalit-settings-econ__pro-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex: 0 0 auto;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--interactive-accent);
  color: var(--text-on-accent, #ffffff);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.journalit-settings-econ .journalit-settings-econ__gate-text {
  flex: 1;
  min-width: 160px;
  color: var(--text-muted);
  font-size: 12px;
}

.journalit-settings-econ .journalit-settings-econ__gate-cta {
  flex: 0 0 auto;
  padding: 3px 10px;
  border: none;
  border-radius: 4px;
  background: var(--interactive-accent);
  color: var(--text-on-accent, #ffffff);
  font-size: 12px;
  cursor: pointer;
}

.journalit-settings-econ .journalit-settings-econ__chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
  max-width: 240px;
}

.journalit-settings-econ .journalit-settings-econ__chip {
  display: inline-flex;
  align-items: center;
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

.journalit-settings-econ .journalit-settings-econ__chip:hover:not(:disabled) {
  color: var(--text-normal);
}

.journalit-settings-econ .journalit-settings-econ__chip[aria-pressed='true'] {
  border-color: var(--interactive-accent);
  background-color: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-settings-econ .journalit-settings-econ__chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;
