

export const interactionsCSS = `

.jl-icon-button-hover {
  background: none;
  color: var(--text-muted);
  transition: background 0.2s ease, color 0.2s ease;
  cursor: pointer;
}

.jl-icon-button-hover:hover:not(:disabled) {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}


.jl-restore-button-hover {
  background-color: var(--background-secondary);
  border-color: var(--background-modifier-border);
  transition: all 0.2s ease;
}

.jl-restore-button-hover:hover:not(:disabled) {
  background-color: var(--background-modifier-hover);
  border-color: var(--text-accent);
}


.jl-quick-link-hover {
  background-color: var(--background-secondary);
  border-color: var(--background-modifier-border);
  transform: translateY(0);
  box-shadow: none;
  transition: all 0.2s ease;
}

.jl-quick-link-hover:hover:not(:disabled) {
  background-color: var(--background-modifier-hover);
  border-color: var(--link-color, var(--interactive-accent));
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}


.jl-recent-item-hover {
  background-color: var(--background-secondary);
  border-color: var(--background-modifier-border);
  transition: all 0.2s ease;
}

.jl-recent-item-hover:hover {
  background-color: var(--background-modifier-hover);
  border-color: var(--interactive-accent);
}



.jl-checkbox-wrapper:hover .jl-checkbox:not(.jl-checkbox-checked) {
  background-color: var(--background-modifier-hover);
  border-color: var(--interactive-accent);
}


.jl-checkbox-wrapper:hover .jl-checkbox.jl-checkbox-checked {
  opacity: 0.85 !important;
  box-shadow: 0 0 0 2px var(--background-modifier-border) !important;
}

.jl-checkbox {
  background-color: var(--background-primary);
  border-color: var(--background-modifier-border);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.jl-checkbox-checked {
  background-color: var(--interactive-accent);
  border-color: var(--interactive-accent);
}


.jl-checkbox svg {
  pointer-events: none !important;
}


.jl-checkbox-wrapper,
.jl-checkbox-wrapper *:not(svg) {
  cursor: pointer !important;
}


.jl-checkbox-wrapper label {
  display: flex !important;
  align-items: center !important;
  cursor: pointer !important;
}


.jl-checkbox {
  cursor: pointer !important;
}


.jl-button-destructive {
  background-color: var(--background-modifier-error);
  color: var(--text-on-accent);
  border-color: var(--background-modifier-error);
}

.jl-button-destructive:hover:not(:disabled) {
  background-color: var(--background-modifier-error-hover);
  opacity: 0.9;
}


.jl-image-hidden {
  display: none;
}

.jl-component-visible {
  display: block !important;
}

.jl-force-redraw {
  opacity: 0.99;
  animation: redraw 0.01s;
}

@keyframes redraw {
  to { opacity: 1; }
}


.jl-focus-reset-input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  pointer-events: none;
}


.jl-component-reset {
  margin: 0;
  padding: 0;
  border: none;
}

.jl-component-container-reset {
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  display: block;
  box-sizing: border-box;
}


.journalit-drawdown-account-name {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 400;
  transition: font-weight 0.1s ease, color 0.1s ease;
}

.journalit-drawdown-account-row:hover .journalit-drawdown-account-name {
  font-weight: 500;
  color: var(--text-normal);
}


.journalit-aum-widget:hover .journalit-aum-label {
  text-decoration: underline;
}


.journalit-weekly-widget:hover .journalit-weekly-label {
  text-decoration: underline;
}
`;
