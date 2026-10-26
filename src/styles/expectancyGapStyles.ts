export const EXPECTANCY_GAP_STYLES = `
.journalit-expectancy-metric-edit {
  margin-inline-start: auto;
  padding: 0 4px;
  height: 20px;
  flex-shrink: 0;
  color: var(--text-muted);
  background: transparent;
  box-shadow: none;
}
.journalit-expectancy-metric-edit:focus-visible { outline: 2px solid var(--interactive-accent); }
.journalit-expectancy-modal { width: 480px; max-width: calc(100vw - 32px); }
.journalit-expectancy-editor { display: flex; flex-direction: column; gap: 16px; }
.journalit-expectancy-error { color: var(--text-error); }
.journalit-expectancy-editor .journalit-collapsible-section { margin-bottom: 0; }
.journalit-expectancy-explanation { font-size: var(--font-ui-small); line-height: 1.5; color: var(--text-muted); display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.journalit-expectancy-explanation p { margin: 0; }
.journalit-expectancy-formula { padding: 10px 12px; background: var(--background-secondary); border-radius: var(--radius-s); color: var(--text-normal); font-weight: 600; text-align: center; }
`;
