

const RADIO_OPTION_STYLES = `

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border: 2px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-option:hover {
  border-color: var(--interactive-accent-hover);
  background: var(--background-secondary);
}

.radio-option.selected {
  border-color: var(--interactive-accent);
  background: var(--background-secondary);
}

.option-radio {
  width: 16px;
  height: 16px;
  border: 2px solid var(--background-modifier-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.radio-option.selected .option-radio {
  border-color: var(--interactive-accent);
}

.radio-inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: transparent;
  transition: background 0.2s ease;
}

.radio-inner.selected {
  background: var(--interactive-accent);
}

.option-content {
  flex: 1;
}

.option-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-normal);
  margin-bottom: 2px;
}

.option-description {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.3;
}


.goal-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 24px 0;
  text-align: left;
}

.goal-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 2px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.goal-option:hover {
  border-color: var(--interactive-accent-hover);
  background: var(--background-secondary);
}

.goal-option.selected {
  border-color: var(--interactive-accent);
  background: var(--background-secondary);
}

.goal-radio {
  width: 20px;
  height: 20px;
  border: 2px solid var(--background-modifier-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.goal-option.selected .goal-radio {
  border-color: var(--interactive-accent);
}

.goal-radio-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
  transition: background 0.2s ease;
}

.goal-radio-inner.selected {
  background: var(--interactive-accent);
}

.goal-content {
  flex: 1;
}

.goal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.goal-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-on-accent);
  background: var(--interactive-accent);
  padding: 2px 8px;
  border-radius: 12px;
}
`;

const RADIO_OPTION_STYLE_ID = 'radio-option-styles';


function injectRadioOptionStyles(): void {
  return;
}


export function ensureRadioOptionStyles(): void {
  return;
}
