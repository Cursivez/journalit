export const VIEW_GUIDE_STYLES = `
.journalit-view-guide-overlay {
  position: fixed;
  inset: 0;
  z-index: 100050;
  pointer-events: none;
}

.journalit-view-guide-highlight {
  position: fixed;
  top: var(--journalit-guide-highlight-top, -9999px);
  left: var(--journalit-guide-highlight-left, -9999px);
  width: var(--journalit-guide-highlight-width, 0px);
  height: var(--journalit-guide-highlight-height, 0px);
  border-radius: 8px;
  border: 2px solid var(--interactive-accent, #7c3aed);
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.38);
  transition: top 120ms ease, left 120ms ease, width 120ms ease, height 120ms ease;
  pointer-events: none;
}

.journalit-view-guide-popover {
  position: fixed;
  top: var(--journalit-guide-popover-top, 50%);
  left: var(--journalit-guide-popover-left, 50%);
  transform: translate(-50%, -50%);
  width: min(340px, calc(100vw - 24px));
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  padding: 12px;
  pointer-events: auto;
}

.journalit-view-guide-popover--anchored {
  transform: none;
}

.journalit-view-guide-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-normal);
}

.journalit-view-guide-description {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-muted);
}

.journalit-view-guide-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
}

.journalit-view-guide-step {
  font-size: 11px;
  color: var(--text-faint);
}

.journalit-view-guide-actions {
  display: flex;
  gap: 8px;
}

.journalit-view-guide-button {
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.2;
  cursor: pointer;
}

.journalit-view-guide-actions .journalit-view-guide-button--secondary {
  appearance: none;
  border: none !important;
  padding: 4px 6px;
  background: transparent !important;
  color: var(--text-faint) !important;
  box-shadow: none !important;
}

.journalit-view-guide-actions .journalit-view-guide-button--secondary:hover {
  background: transparent !important;
  color: var(--text-muted) !important;
  text-decoration: underline;
}

.journalit-view-guide-actions .journalit-view-guide-button--secondary:focus,
.journalit-view-guide-actions .journalit-view-guide-button--secondary:focus-visible,
.journalit-view-guide-actions .journalit-view-guide-button--secondary:active {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

.journalit-view-guide-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.journalit-view-guide-button--back,
.journalit-view-guide-button--primary {
  border: 1px solid var(--interactive-accent);
  padding: 4px 10px;
  box-shadow: none;
}

.journalit-view-guide-button--back {
  background: var(--background-secondary);
  border-color: var(--background-modifier-border);
  color: var(--text-normal);
}

.journalit-view-guide-button--back:hover {
  background: var(--background-modifier-hover);
}

.journalit-view-guide-button--primary {
  background: var(--interactive-accent);
  border-color: var(--interactive-accent);
  color: var(--text-on-accent, #fff);
}

.journalit-view-guide-button--primary:hover {
  filter: brightness(1.03);
}
`;
