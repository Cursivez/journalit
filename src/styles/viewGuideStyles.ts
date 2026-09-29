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
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
  transition: top 120ms ease, left 120ms ease, width 120ms ease, height 120ms ease;
  pointer-events: none;
}


.journalit-view-guide-popover {
  --journalit-guide-card-bg: #f7f6fb;
  --journalit-guide-card-text: #16131f;
  --journalit-guide-card-body: #26232f;
  --journalit-guide-card-faint: #6b6680;
  --journalit-guide-card-track: #e3e0ec;
  --journalit-guide-card-control-bg: #ffffff;
  --journalit-guide-card-control-border: #d9d6e3;
  --journalit-guide-card-control-hover: #efedf5;
  position: fixed;
  top: var(--journalit-guide-popover-top, 50%);
  left: var(--journalit-guide-popover-left, 50%);
  transform: translate(-50%, -50%);
  width: min(340px, calc(100vw - 24px));
  background: var(--journalit-guide-card-bg);
  color: var(--journalit-guide-card-text);
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  padding: 16px 18px;
  pointer-events: auto;
}

.theme-light .journalit-view-guide-popover {
  --journalit-guide-card-bg: #1f1d27;
  --journalit-guide-card-text: #f5f4fa;
  --journalit-guide-card-body: #e6e4ee;
  --journalit-guide-card-faint: #9e9aae;
  --journalit-guide-card-track: #3a3747;
  --journalit-guide-card-control-bg: #2c2a36;
  --journalit-guide-card-control-border: #474456;
  --journalit-guide-card-control-hover: #37343f;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
}

.journalit-view-guide-popover--anchored {
  transform: none;
}


.journalit-view-guide-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--journalit-guide-card-text);
}

.journalit-view-guide-description {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--journalit-guide-card-body);
}

.journalit-view-guide-progress-group {
  display: flex;
  flex: 0 1 88px;
  flex-direction: column;
  gap: 5px;
  min-width: 32px;
}

.journalit-view-guide-step-count {
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
  color: var(--journalit-guide-card-faint);
}

.journalit-view-guide-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}

.journalit-view-guide-progress {
  height: 4px;
  border-radius: 4px;
  overflow: hidden;
  background: var(--journalit-guide-card-track);
}

.journalit-view-guide-progress-fill {
  width: var(--journalit-guide-progress, 0%);
  height: 100%;
  border-radius: inherit;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  transition: width 160ms ease;
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
  color: var(--journalit-guide-card-faint) !important;
  box-shadow: none !important;
}

.journalit-view-guide-actions .journalit-view-guide-button--secondary:hover {
  background: transparent !important;
  color: var(--journalit-guide-card-text) !important;
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

.journalit-view-guide-actions .journalit-view-guide-button--back,
.journalit-view-guide-actions .journalit-view-guide-button--primary {
  padding: 4px 12px;
  box-shadow: none;
}


.journalit-view-guide-actions .journalit-view-guide-button--back {
  background: var(--journalit-guide-card-control-bg);
  border: 1px solid var(--journalit-guide-card-control-border);
  color: var(--journalit-guide-card-text);
}

.journalit-view-guide-actions .journalit-view-guide-button--back:hover {
  background: var(--journalit-guide-card-control-hover);
}

.journalit-trade-form-guide-orb-layer {
  position: fixed;
  inset: 0;
  z-index: 100050;
  pointer-events: none;
}

.journalit-trade-form-guide-hover-highlight {
  position: fixed;
  top: var(--journalit-guide-highlight-top, -9999px);
  left: var(--journalit-guide-highlight-left, -9999px);
  width: var(--journalit-guide-highlight-width, 0px);
  height: var(--journalit-guide-highlight-height, 0px);
  border: 1px solid var(--interactive-accent, #7c3aed);
  border-radius: 6px;
  background: color-mix(in srgb, var(--interactive-accent) 12%, transparent);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--interactive-accent) 16%, transparent),
    0 0 0 2px color-mix(in srgb, var(--interactive-accent) 8%, transparent);
  pointer-events: none;
}
`;
