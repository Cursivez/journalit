

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




.jl-checkbox-wrapper,
.jl-checkbox-wrapper *:not(svg) {
  cursor: pointer !important;
}


.jl-checkbox-wrapper label {
  display: flex !important;
  align-items: center !important;
  cursor: pointer !important;
}



.jl-force-redraw {
  opacity: 0.99;
  animation: journalit-redraw 0.01s;
}

@keyframes journalit-redraw {
  to { opacity: 1; }
}


.jl-focus-reset-input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  pointer-events: none;
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
