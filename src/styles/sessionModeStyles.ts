export const SESSION_MODE_STYLES = `
.journalit-session-mode-view-container,
.journalit-session-mode,
.journalit-session-log-panel {
  height: 100%;
}

.journalit-session-log-panel {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
  padding: var(--size-4-3);
  color: var(--text-normal);
}

.journalit-session-mode {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-3);
  height: 100%;
  min-height: 0;
  overflow: auto;
  padding: var(--size-4-3);
}

.journalit-session-mode > * {
  width: 100%;
  max-width: 576px;
  margin-right: auto;
  margin-left: auto;
  box-sizing: border-box;
}

.journalit-session-mode .journalit-session-log-panel {
  height: auto;
  padding: 0;
}

.journalit-session-mode-skeleton {
  pointer-events: none;
}

.journalit-session-mode-skeleton__body {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
}

.journalit-session-mode-skeleton__title {
  --journalit-skeleton-width: min(220px, 60%);
  --journalit-skeleton-height: 22px;
  --journalit-skeleton-radius: var(--radius-s);
}

.journalit-session-mode-skeleton__eyebrow {
  --journalit-skeleton-width: 110px;
  --journalit-skeleton-height: 13px;
  --journalit-skeleton-radius: var(--radius-s);
}

.journalit-session-mode-skeleton__meta {
  --journalit-skeleton-width: min(300px, 70%);
  --journalit-skeleton-height: 18px;
  --journalit-skeleton-radius: var(--radius-s);
}

.journalit-session-mode-skeleton__countdown,
.journalit-session-mode-skeleton__center-state,
.journalit-session-mode-skeleton__ended {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-2-3);
  padding: var(--size-4-4) 0;
}

.journalit-session-mode-skeleton__countdown-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-4-4);
}

.journalit-session-mode-skeleton__countdown-number {
  --journalit-skeleton-width: 76px;
  --journalit-skeleton-height: 58px;
  --journalit-skeleton-radius: var(--radius-m);
}

.journalit-session-mode-skeleton__countdown-separator {
  --journalit-skeleton-width: 12px;
  --journalit-skeleton-height: 44px;
  --journalit-skeleton-radius: var(--radius-s);
}

.journalit-session-mode-skeleton__hero-line {
  --journalit-skeleton-width: min(380px, 82%);
  --journalit-skeleton-height: 34px;
  --journalit-skeleton-radius: var(--radius-s);
}

.journalit-session-mode-skeleton__button {
  --journalit-skeleton-width: 112px;
  --journalit-skeleton-height: 36px;
  --journalit-skeleton-radius: var(--radius-m);
  margin-top: var(--size-2-2);
}

.journalit-session-mode-skeleton__small-icon {
  --journalit-skeleton-width: 28px;
  --journalit-skeleton-height: 28px;
  --journalit-skeleton-radius: var(--radius-s);
}

.journalit-session-mode-skeleton__card {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-3);
  padding: var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
}

.journalit-session-mode-skeleton__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-2-3);
}

.journalit-session-mode-skeleton__card-title {
  --journalit-skeleton-width: 150px;
  --journalit-skeleton-height: 20px;
  --journalit-skeleton-radius: var(--radius-s);
}

.journalit-session-mode-skeleton__card-pill {
  --journalit-skeleton-width: 86px;
  --journalit-skeleton-height: 18px;
  --journalit-skeleton-radius: 999px;
}

.journalit-session-mode-skeleton__line {
  --journalit-skeleton-height: 36px;
  --journalit-skeleton-radius: var(--radius-s);
}

.journalit-session-mode-skeleton__line:nth-child(odd) {
  --journalit-skeleton-width: 88%;
}

.journalit-session-mode-skeleton__selector {
  --journalit-skeleton-height: 32px;
  --journalit-skeleton-radius: var(--radius-s);
}

.journalit-session-mode-skeleton__section-label {
  --journalit-skeleton-width: 86px;
  --journalit-skeleton-height: 14px;
  --journalit-skeleton-radius: var(--radius-s);
  margin: var(--size-2-3) auto 0;
}

.journalit-session-mode-skeleton__composer {
  --journalit-skeleton-height: 46px;
  --journalit-skeleton-radius: var(--radius-m);
}

.journalit-session-mode-skeleton__timeline {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
}

.journalit-session-mode-skeleton__timeline-label {
  --journalit-skeleton-width: 120px;
  --journalit-skeleton-height: 14px;
  --journalit-skeleton-radius: var(--radius-s);
  margin: 0 auto;
}

.journalit-session-mode-skeleton__timeline-entry {
  --journalit-skeleton-height: 68px;
  --journalit-skeleton-radius: var(--radius-m);
}

.journalit-session-mode-skeleton__action-row {
  --journalit-skeleton-height: 64px;
  --journalit-skeleton-radius: var(--radius-m);
}

.journalit-session-mode-skeleton__stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--size-4-3);
  width: 100%;
  padding-top: var(--size-2-3);
}

.journalit-session-mode-skeleton__stat {
  --journalit-skeleton-height: 42px;
  --journalit-skeleton-radius: var(--radius-s);
}

.journalit-session-mode-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-2-1);
}

.journalit-session-mode-header__top,
.journalit-session-mode-ended-summary__header-top {
  display: grid;
  grid-template-columns: minmax(44px, 1fr) auto minmax(44px, 1fr);
  align-items: center;
  width: 100%;
  gap: var(--size-2-2);
}

.journalit-session-mode-header__top h3,
.journalit-session-mode-ended-summary__header-top h3 {
  grid-column: 2;
}

.journalit-session-mode-header__title-group {
  position: relative;
  display: inline-flex;
  grid-column: 2;
  align-items: center;
  justify-content: center;
}

.journalit-session-mode-header__title-group h3 {
  grid-column: auto;
}

.journalit-session-mode-header__title-group .journalit-session-mode-drc-header-button {
  position: absolute;
  left: calc(100% + 3px);
  top: 50%;
  transform: translateY(-50%);
}

.journalit-session-mode-header__actions {
  display: inline-flex;
  grid-column: 3;
  align-items: center;
  justify-self: end;
  gap: var(--size-2-1);
}

.journalit-session-mode .journalit-session-mode-edit-button,
.journalit-session-mode .journalit-session-mode-drc-header-button {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: var(--size-2-1);
  min-height: 28px;
  padding: 0 var(--size-2-2);
  border: 1px solid transparent;
  border-radius: var(--radius-s);
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-muted);
  cursor: pointer;
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-medium);
  line-height: 1;
}

.journalit-session-mode .journalit-session-mode-edit-button:hover,
.journalit-session-mode .journalit-session-mode-edit-button:focus-visible,
.journalit-session-mode .journalit-session-mode-drc-header-button:hover,
.journalit-session-mode .journalit-session-mode-drc-header-button:focus-visible {
  border-color: transparent;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-normal);
}

.journalit-session-mode .journalit-session-mode-drc-header-button {
  justify-content: center;
  width: 24px;
  min-height: 24px;
  padding: 0;
}

.journalit-session-mode-header h3 {
  margin: 0;
  color: var(--text-normal);
  font-size: clamp(var(--font-ui-medium), 4vw, 1.05rem);
  font-weight: var(--font-bold);
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
}

.journalit-session-mode-section {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
}

.journalit-session-mode-section--timeline {
  min-height: 0;
  margin-top: var(--size-4-3);
}

.journalit-trade-gate-panel {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-3);
  padding: 0;
}

.journalit-trade-gate-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-2-2);
  color: var(--text-normal);
  font-size: var(--font-ui-medium);
  font-weight: var(--font-semibold);
}

.journalit-trade-gate-option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-2-1);
}

.journalit-trade-gate-workflow-launcher {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
}

.journalit-trade-gate-workflow-launcher__label {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0.04em;
  text-align: center;
  text-transform: uppercase;
}

.journalit-trade-gate-workflow-control {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 154px;
  overflow: visible;
  border: 1px solid var(--background-modifier-border-hover);
  border-radius: 8px;
  background: color-mix(in srgb, var(--background-primary-alt) 86%, transparent);
  box-shadow: none;
}

.journalit-trade-gate-workflow-control.is-open {
  z-index: 50;
}

.journalit-trade-gate-workflow-control.is-running {
  grid-template-columns: minmax(0, 1fr);
}

.journalit-trade-gate-workflow-control.is-running .journalit-trade-gate-workflow-menu {
  right: 0;
}

.journalit-session-mode .journalit-trade-gate-workflow-trigger,
.journalit-session-mode .journalit-trade-gate-start-button {
  all: unset;
  appearance: none !important;
  -webkit-appearance: none !important;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  height: 44px !important;
  min-width: 0;
  min-height: 44px !important;
  margin: 0 !important;
  padding: 0 var(--size-4-4) !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-normal);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--font-ui-small);
  font-weight: var(--font-normal);
  line-height: 1.4;
  text-align: left;
}

.journalit-session-mode .journalit-trade-gate-workflow-trigger {
  justify-content: space-between;
  gap: var(--size-2-2);
  border-right: 1px solid var(--background-modifier-border);
  border-top-left-radius: 7px !important;
  border-bottom-left-radius: 7px !important;
}

.journalit-trade-gate-workflow-control.is-running .journalit-trade-gate-workflow-trigger {
  border-right: 0;
}

.journalit-trade-gate-workflow-trigger:disabled {
  cursor: default;
  opacity: 1;
}

.journalit-trade-gate-workflow-trigger > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-trade-gate-workflow-trigger__chevron {
  flex: 0 0 auto;
  color: var(--text-muted);
  transition: transform 120ms ease;
}

.journalit-trade-gate-workflow-trigger__chevron.is-open {
  transform: rotate(180deg);
}

.journalit-session-mode .journalit-trade-gate-start-button {
  justify-content: center;
  gap: var(--size-2-2);
  border-left: 1px solid var(--background-modifier-border-hover) !important;
  border-top-right-radius: 7px !important;
  border-bottom-right-radius: 7px !important;
  color: var(--text-normal);
  font-weight: var(--font-medium);
}

.journalit-trade-gate-start-button svg {
  fill: currentColor;
}

.journalit-session-mode .journalit-trade-gate-workflow-trigger:hover:not(:disabled),
.journalit-session-mode .journalit-trade-gate-workflow-trigger:focus-visible:not(:disabled),
.journalit-session-mode .journalit-trade-gate-start-button:hover,
.journalit-session-mode .journalit-trade-gate-start-button:focus-visible {
  background: color-mix(in srgb, var(--background-modifier-hover) 76%, transparent) !important;
  background-color: color-mix(in srgb, var(--background-modifier-hover) 76%, transparent) !important;
  color: var(--text-normal);
}

.journalit-trade-gate-workflow-menu {
  position: absolute;
  z-index: 60;
  top: calc(100% + 4px);
  right: 154px;
  left: 0;
  display: flex;
  max-height: 180px;
  flex-direction: column;
  overflow-y: auto;
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-primary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  animation: none;
  transform: none;
  will-change: auto;
}

.journalit-session-mode .journalit-trade-gate-workflow-menu__option {
  all: unset;
  appearance: none !important;
  -webkit-appearance: none !important;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  min-height: 34px !important;
  margin: 0 !important;
  padding: var(--size-2-2) var(--size-4-3) !important;
  border: 0 !important;
  border-bottom: 1px solid var(--background-modifier-border-subtle) !important;
  border-radius: 0 !important;
  background: var(--background-primary) !important;
  background-color: var(--background-primary) !important;
  box-shadow: none !important;
  color: var(--text-normal);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--font-ui-small);
  line-height: 1.5;
  text-align: left;
}

.journalit-session-mode .journalit-trade-gate-workflow-menu__option:hover,
.journalit-session-mode .journalit-trade-gate-workflow-menu__option:focus-visible,
.journalit-session-mode .journalit-trade-gate-workflow-menu__option.is-selected {
  background: var(--background-secondary) !important;
  background-color: var(--background-secondary) !important;
}

.journalit-session-mode .journalit-trade-gate-workflow-menu__option .journalit-home-period-option__check {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 2px;
  background-color: var(--background-primary);
  color: var(--text-on-accent);
  font-size: 10px;
  line-height: 1;
}

.journalit-session-mode .journalit-trade-gate-workflow-menu__option.is-selected .journalit-home-period-option__check {
  border-color: var(--interactive-accent);
  background-color: var(--interactive-accent);
}

.journalit-session-mode .journalit-trade-gate-workflow-menu__option .journalit-home-period-option__label {
  overflow: hidden;
  flex: 1 1 auto;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 360px) {
  .journalit-trade-gate-workflow-control {
    grid-template-columns: minmax(0, 1fr) 112px;
  }

  .journalit-trade-gate-workflow-menu {
    right: 112px;
  }

  .journalit-trade-gate-workflow-trigger,
  .journalit-trade-gate-start-button {
    padding-right: var(--size-2-3);
    padding-left: var(--size-2-3);
  }
}

.journalit-trade-gate-restart-button {
  display: inline-flex;
  width: 34px;
  min-width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s);
  background: var(--background-primary-alt);
  color: var(--text-muted);
  cursor: pointer;
}

.journalit-trade-gate-restart-button:hover,
.journalit-trade-gate-restart-button:focus-visible {
  border-color: var(--interactive-accent);
  color: var(--text-normal);
}

.journalit-trade-gate-outcome .journalit-trade-gate-restart-button {
  margin-left: auto;
  background: rgba(var(--mono-rgb-100), 0.06);
}

.journalit-trade-gate-accordion {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
}

.journalit-trade-gate-step {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: var(--size-2-2);
  align-items: center;
  padding: var(--size-2-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-primary);
}

.journalit-trade-gate-step.is-active {
  align-items: flex-start;
  border-color: var(--interactive-accent);
}

.journalit-trade-gate-step__status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 50%;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
}

.journalit-trade-gate-step.is-complete .journalit-trade-gate-step__status {
  border-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.65);
  color: var(--text-success);
}

.journalit-trade-gate-step__content {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
  min-width: 0;
}

.journalit-trade-gate-step__title {
  color: var(--text-normal);
  font-weight: var(--font-semibold);
}

.journalit-trade-gate-step__answer,
.journalit-trade-gate-step__prompt {
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  line-height: 1.45;
}

.journalit-trade-gate-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 112px), 1fr));
  gap: var(--size-2-2);
  margin-top: var(--size-2-2);
}

.journalit-trade-gate-option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: auto !important;
  min-height: 34px;
  padding: var(--size-2-2) var(--size-2-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s);
  overflow: visible;
  font-size: var(--font-ui-small);
  line-height: 1.35;
  text-align: center;
  overflow-wrap: anywhere;
  word-break: break-word;
  white-space: normal;
}

.journalit-trade-gate-option:hover {
  border-color: var(--interactive-accent);
  background: var(--background-modifier-hover);
}

.journalit-trade-gate-outcome {
  display: flex;
  gap: var(--size-4-3);
  align-items: center;
  padding: var(--size-4-3) var(--size-4-4);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: linear-gradient(
    135deg,
    var(--background-secondary),
    var(--background-primary)
  );
}

.journalit-trade-gate-outcome.is-green-light {
  border-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.55);
  background: linear-gradient(
    135deg,
    rgba(var(--color-green-rgb, 67, 160, 71), 0.18),
    rgba(var(--color-green-rgb, 67, 160, 71), 0.06)
  );
}

.journalit-trade-gate-outcome.is-no-trade {
  border-color: rgba(var(--color-red-rgb, 233, 49, 71), 0.55);
  background: linear-gradient(
    135deg,
    rgba(var(--color-red-rgb, 233, 49, 71), 0.16),
    rgba(var(--color-red-rgb, 233, 49, 71), 0.05)
  );
}

.journalit-trade-gate-outcome.is-wait {
  border-color: rgba(var(--color-orange-rgb, 245, 124, 0), 0.55);
  background: linear-gradient(
    135deg,
    rgba(var(--color-orange-rgb, 245, 124, 0), 0.16),
    rgba(var(--color-orange-rgb, 245, 124, 0), 0.05)
  );
}

.journalit-trade-gate-outcome__icon {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--background-primary);
}

.journalit-trade-gate-outcome.is-green-light .journalit-trade-gate-outcome__icon {
  border: 1px solid rgba(var(--color-green-rgb, 67, 160, 71), 0.75);
  color: var(--text-success);
}

.journalit-trade-gate-outcome.is-no-trade .journalit-trade-gate-outcome__icon {
  border: 1px solid rgba(var(--color-red-rgb, 233, 49, 71), 0.75);
  color: var(--text-error);
}

.journalit-trade-gate-outcome.is-wait .journalit-trade-gate-outcome__icon {
  border: none;
  background: transparent;
  color: var(--text-warning);
}

.journalit-trade-gate-outcome__title {
  color: var(--text-normal);
  font-size: var(--font-ui-medium);
  font-weight: var(--font-bold);
}

.journalit-trade-gate-outcome__content {
  min-width: 0;
}

.journalit-trade-gate-outcome__description {
  margin-top: var(--size-2-1);
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-session-mode-section__header {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0.04em;
  text-align: center;
  text-transform: uppercase;
}

.journalit-session-mode-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--size-4-3);
  min-height: 340px;
  padding: var(--size-4-8) var(--size-4-8);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-l);
  background: transparent;
  text-align: center;
}

.journalit-session-mode-empty-state__title {
  color: var(--text-normal);
  font-size: var(--font-ui-large);
  font-weight: var(--font-semibold);
}

.journalit-session-mode-empty-state__description {
  max-width: 34rem;
  color: var(--text-muted);
  font-size: var(--font-ui-medium);
  line-height: 1.45;
}

.journalit-session-mode-empty-state__button {
  margin-top: var(--size-2-2);
}

.journalit-session-mode button.journalit-session-mode-empty-state__button {
  appearance: none;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 var(--size-4-5);
  border: 1px solid var(--interactive-accent);
  border-radius: var(--radius-m);
  background: color-mix(in srgb, var(--interactive-accent) 18%, transparent);
  box-shadow: none;
  color: var(--text-normal);
  cursor: pointer;
  font-size: var(--font-ui-small);
  font-weight: var(--font-semibold);
  line-height: 1;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    transform 120ms ease;
}

.journalit-session-mode button.journalit-session-mode-empty-state__button:hover,
.journalit-session-mode button.journalit-session-mode-empty-state__button:focus-visible {
  border-color: var(--interactive-accent-hover);
  background: color-mix(in srgb, var(--interactive-accent) 28%, transparent);
  box-shadow: none;
  color: var(--text-normal);
}

.journalit-session-mode button.journalit-session-mode-empty-state__button:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--interactive-accent) 35%, transparent);
  outline-offset: 2px;
}

.journalit-session-mode button.journalit-session-mode-empty-state__button:active {
  transform: translateY(1px);
}

.journalit-session-mode-empty-state__steps {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
  width: min(100%, 22rem);
  margin: var(--size-4-2) 0 0;
  text-align: left;
}

.journalit-session-mode-empty-state__step {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: var(--size-4-3);
}

.journalit-session-mode-empty-state__step-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--background-modifier-border-hover);
  border-radius: 999px;
  background: transparent;
  color: var(--text-muted);
}

.journalit-session-mode-empty-state__step-title {
  color: var(--text-normal);
  font-size: var(--font-ui-medium);
  font-weight: var(--font-semibold);
  line-height: 1.35;
}



.journalit-session-mode-prep-grid {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
}

.journalit-session-mode-prep-card {
  min-width: 0;
}

.journalit-session-mode-prep-card__title {
  margin-bottom: var(--size-2-2);
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  font-weight: var(--font-semibold);
}

.journalit-session-mode button.journalit-session-mode-drc-link {
  appearance: none;
  width: auto;
  height: auto;
  min-height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--link-color);
  cursor: pointer;
  font-size: var(--font-ui-small);
  font-weight: var(--font-normal);
  line-height: 1.4;
  text-align: left;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.journalit-session-mode button.journalit-session-mode-drc-link:hover,
.journalit-session-mode button.journalit-session-mode-drc-link:focus-visible {
  background: transparent;
  box-shadow: none;
  color: var(--link-color-hover);
  text-decoration: underline;
}

.journalit-session-mode button.journalit-session-mode-drc-link:active {
  transform: none;
}

.journalit-session-mode-resource-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: var(--size-2-3);
}

.journalit-session-mode-resource-links__list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.journalit-session-mode button.journalit-session-mode-resource-link {
  appearance: none;
  display: inline-block;
  width: auto;
  height: auto;
  min-height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--link-color);
  cursor: pointer;
  font-size: var(--font-ui-small);
  font-weight: var(--font-normal);
  line-height: 1.4;
  text-align: left;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  overflow-wrap: anywhere;
}

.journalit-session-mode button.journalit-session-mode-resource-link:active {
  transform: none;
}

.journalit-session-mode button.journalit-session-mode-resource-link:hover,
.journalit-session-mode button.journalit-session-mode-resource-link:focus-visible {
  color: var(--link-color-hover);
  text-decoration: underline;
  background: transparent;
  box-shadow: none;
}

.journalit-session-mode-countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-2-2);
  padding: var(--size-2-2) 0 var(--size-4-3);
  border-bottom: 1px solid var(--background-modifier-border);
  text-align: center;
}

.journalit-session-mode-countdown__eyebrow {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.journalit-session-mode-countdown__timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(var(--size-2-2), 3vw, var(--size-4-4));
  width: 100%;
}

.journalit-session-mode-countdown__segment {
  display: flex;
  flex: 1 1 0;
  max-width: 132px;
  min-width: 70px;
  flex-direction: column;
  align-items: center;
  gap: var(--size-2-1);
}

.journalit-session-mode-countdown__value {
  font-family: var(--font-monospace);
  font-size: clamp(2rem, 14vw, 3.05rem);
  font-weight: var(--font-bold);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.07em;
  line-height: 1;
  min-width: 2.15ch;
  text-align: center;
}

.journalit-session-mode-countdown__label {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.journalit-session-mode-countdown__separator {
  color: var(--text-accent);
  font-family: var(--font-monospace);
  font-size: clamp(1.7rem, 9vw, 2.4rem);
  font-weight: var(--font-bold);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  min-width: 0.6ch;
  text-align: center;
  transform: translateY(-0.18em);
}

.journalit-session-mode-countdown__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--size-2-1);
  color: var(--text-faint);
  font-size: 0.72rem;
  line-height: 1.35;
}

.journalit-session-mode-status {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--size-2-3);
  align-items: center;
  padding: var(--size-2-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-secondary);
}

.journalit-session-mode-status__indicator {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--text-accent);
  box-shadow: 0 0 0 4px var(--background-modifier-border);
}

.journalit-session-mode-status.is-live .journalit-session-mode-status__indicator {
  background: var(--color-green);
  box-shadow: 0 0 0 4px rgba(var(--color-green-rgb, 67, 160, 71), 0.18);
}

.journalit-session-mode-status.is-ended .journalit-session-mode-status__indicator {
  background: var(--text-muted);
  box-shadow: 0 0 0 4px var(--background-modifier-border);
}

.journalit-session-mode-status__content {
  min-width: 0;
}

.journalit-session-mode-status__phase {
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  font-weight: var(--font-semibold);
  line-height: 1.25;
}

.journalit-session-mode-status__description {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  line-height: 1.35;
}

.journalit-session-mode-waiting-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-2-3);
  padding: var(--size-4-8) 0 var(--size-4-6);
  text-align: center;
}

.journalit-session-mode-waiting-state__eyebrow {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-transform: uppercase;
}

.journalit-session-mode-waiting-state__title {
  max-width: 28rem;
  color: var(--text-normal);
  font-size: clamp(1.25rem, 5vw, 1.65rem);
  font-weight: var(--font-semibold);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.journalit-session-mode-waiting-state__meta {
  color: var(--text-muted);
  font-size: var(--font-ui-medium);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
  line-height: 1.4;
}

.journalit-session-mode-waiting-state .journalit-session-mode-waiting-state__action {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-2-2);
  min-height: 36px;
  margin-top: var(--size-2-3);
  padding: var(--size-2-2) var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  appearance: none;
  background: transparent;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-muted);
  cursor: pointer;
  font-size: var(--font-ui-small);
  line-height: 1.2;
  transition:
    border-color 120ms ease,
    color 120ms ease;
}

.journalit-session-mode-waiting-state .journalit-session-mode-waiting-state__action:hover,
.journalit-session-mode-waiting-state .journalit-session-mode-waiting-state__action:focus-visible {
  border-color: var(--background-modifier-border-hover);
  background: transparent;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-normal);
}

.journalit-session-mode-break-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-2-3);
  padding: var(--size-4-6) 0 var(--size-4-4);
  text-align: center;
}

.journalit-session-mode-break-state__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--text-muted);
}

.journalit-session-mode-break-state__eyebrow {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-transform: uppercase;
}

.journalit-session-mode-break-state__title {
  max-width: 28rem;
  color: var(--text-normal);
  font-size: clamp(1.25rem, 5vw, 1.65rem);
  font-weight: var(--font-semibold);
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.journalit-session-mode-break-state__meta {
  color: var(--text-muted);
  font-size: var(--font-ui-medium);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
  line-height: 1.4;
}

.journalit-session-mode-break-state__description {
  max-width: 30rem;
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  line-height: 1.45;
}

.journalit-session-mode-break-state .journalit-session-mode-break-state__action {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-2-2);
  min-height: 36px;
  margin-top: var(--size-2-2);
  padding: var(--size-2-2) var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  appearance: none;
  background: transparent;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-muted);
  cursor: pointer;
  font-size: var(--font-ui-small);
  line-height: 1.2;
  transition:
    border-color 120ms ease,
    color 120ms ease;
}

.journalit-session-mode-break-state .journalit-session-mode-break-state__action:hover,
.journalit-session-mode-break-state .journalit-session-mode-break-state__action:focus-visible {
  border-color: var(--background-modifier-border-hover);
  background: transparent;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-normal);
}

.journalit-session-mode-ended-summary {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-3);
  margin-top: var(--size-4-6);
  padding: var(--size-4-5) 0;
}

.journalit-session-mode-ended-summary__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-2-2);
  text-align: center;
}

.journalit-session-mode-ended-summary__header h3 {
  margin: 0;
  color: var(--text-normal);
  font-size: clamp(var(--font-ui-medium), 4vw, 1.05rem);
  font-weight: var(--font-bold);
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-transform: uppercase;
}

.journalit-session-mode-ended-summary__header p {
  max-width: 30rem;
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-ui-medium);
  line-height: 1.4;
}

.journalit-session-mode-ended-summary__actions {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-3);
}

.journalit-session-mode-ended-summary .journalit-session-mode-ended-action {
  all: unset;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: var(--size-4-2);
  align-items: center;
  width: 100%;
  min-height: 64px;
  padding: var(--size-4-2) var(--size-4-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  appearance: none;
  background: transparent;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-normal);
  cursor: pointer;
  font-size: var(--font-ui-medium);
  font-weight: var(--font-normal);
  line-height: 1.2;
  text-align: center;
  transition:
    border-color 120ms ease,
    background-color 120ms ease,
    color 120ms ease;
}

.journalit-session-mode-ended-summary .journalit-session-mode-ended-action:hover,
.journalit-session-mode-ended-summary .journalit-session-mode-ended-action:focus-visible {
  border-color: var(--background-modifier-border-hover);
  background: transparent;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
}

.journalit-session-mode-ended-summary .journalit-session-mode-ended-action.is-primary {
  border-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.55);
  background: rgba(var(--color-green-rgb, 67, 160, 71), 0.1);
  background-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.1) !important;
  background-image: none !important;
  box-shadow: none !important;
}

.journalit-session-mode-ended-summary .journalit-session-mode-ended-action.is-primary:hover,
.journalit-session-mode-ended-summary .journalit-session-mode-ended-action.is-primary:focus-visible {
  border-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.75);
  background: rgba(var(--color-green-rgb, 67, 160, 71), 0.15);
  background-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.15) !important;
  background-image: none !important;
  box-shadow: none !important;
}

.journalit-session-mode-ended-summary .journalit-session-mode-ended-action__icon,
.journalit-session-mode-ended-summary .journalit-session-mode-ended-action__chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.journalit-session-mode-ended-summary .journalit-session-mode-ended-action__icon {
  justify-self: end;
}

.journalit-session-mode-ended-summary .journalit-session-mode-ended-action.is-primary .journalit-session-mode-ended-action__icon,
.journalit-session-mode-ended-summary .journalit-session-mode-ended-action.is-primary .journalit-session-mode-ended-action__chevron {
  color: var(--text-success);
}

.journalit-session-mode-ended-summary .journalit-session-mode-ended-action.is-primary > span {
  font-weight: var(--font-normal);
}

.journalit-session-mode-ended-summary .journalit-session-mode-ended-action__chevron {
  justify-self: end;
}

.journalit-session-mode-ended-summary__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding-top: var(--size-4-2);
  border-top: 1px solid var(--background-modifier-border);
}

.journalit-session-mode-ended-summary__stat {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: var(--size-2-1);
  padding: 0 var(--size-2-2);
  text-align: center;
}

.journalit-session-mode-ended-summary__stat + .journalit-session-mode-ended-summary__stat {
  border-left: 1px solid var(--background-modifier-border);
}

.journalit-session-mode-ended-summary__stat-label {
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  line-height: 1.25;
}

.journalit-session-mode-ended-summary__stat-value {
  color: var(--text-normal);
  font-size: 1.35rem;
  font-weight: var(--font-semibold);
  line-height: 1;
}

.journalit-session-mode-empty-layout-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-2-2);
  padding: var(--size-4-6) 0;
  text-align: center;
}

.journalit-session-mode-empty-layout-state__title {
  color: var(--text-normal);
  font-size: var(--font-ui-medium);
  font-weight: var(--font-semibold);
}

.journalit-session-mode-empty-layout-state__description {
  max-width: 24rem;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
  line-height: 1.35;
}


@media (max-width: 320px) {
  .journalit-session-mode {
    padding: var(--size-4-3) var(--size-2-3);
  }

  .journalit-session-mode-countdown {
    padding: var(--size-2-2) 0 var(--size-4-3);
  }

  .journalit-session-mode-countdown__segment {
    min-width: 0;
  }

  .journalit-session-mode-ended-summary {
    padding: var(--size-4-3);
  }

  .journalit-session-mode-ended-summary .journalit-session-mode-ended-action {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    min-height: 56px;
    padding: var(--size-2-3);
  }
}

.journalit-session-log-panel__header h3 {
  margin: 0 0 var(--size-2-1);
  font-size: var(--font-ui-medium);
}

.journalit-session-log-session-groups {
  display: flex;
  flex-direction: column;
  gap: var(--size-4-4);
}

.journalit-session-log-session-group {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
}

.journalit-session-log-session-group__header {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
}

.journalit-session-log-session-group .journalit-session-log-panel {
  height: auto;
  padding: 0;
}

.journalit-session-log-lessons-summary {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-3);
  margin: var(--size-4-2) 0 var(--size-4-3);
  padding: 0 var(--size-4-3);
}

.journalit-session-log-lessons-summary__header {
  display: flex;
  align-items: center;
  gap: var(--size-2-2);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0.09em;
  line-height: 1.2;
  text-transform: uppercase;
}

.journalit-session-log-lessons-summary__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 var(--size-2-1);
  border: 1px solid var(--background-modifier-border);
  border-radius: 999px;
  background: var(--background-secondary);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0;
  text-transform: none;
}

.journalit-session-log-lessons-summary__badge {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 var(--size-2-2);
  border-radius: var(--radius-s);
  background: rgba(var(--mono-rgb-100), 0.08);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0.04em;
}

.journalit-session-log-lessons-summary__list {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
}

.journalit-session-log-lessons-summary__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0 10px;
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  line-height: 1.4;
}

.journalit-session-log-lessons-summary__dot {
  align-self: start;
  width: 7px;
  height: 7px;
  margin-top: 0.45em;
  border-radius: 999px;
  background: var(--color-yellow);
}

.journalit-session-log-lessons-summary__time {
  color: var(--text-faint);
  font-family: var(--font-monospace);
  font-size: var(--font-ui-smaller);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.journalit-session-log-lessons-summary__separator {
  margin: 0 var(--size-2-1);
  color: var(--text-faint);
  font-size: var(--font-ui-small);
}

.journalit-session-log-lessons-summary__text {
  min-width: 0;
  color: var(--text-muted);
  overflow-wrap: anywhere;
}

.journalit-session-log-lessons-summary__text
  .journalit-session-log-lessons-summary__badge {
  margin-left: var(--size-2-2);
}

.journalit-session-log-panel__header p,
.journalit-session-log-empty {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-ui-small);
}

.journalit-session-log-empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-2-2);
  padding: var(--size-4-2) var(--size-4-3);
  border: 1px dashed var(--background-modifier-border);
  border-radius: var(--radius-m);
}

.journalit-session-log-empty--centered {
  justify-content: center;
  text-align: center;
}

.journalit-session-log-empty--centered .journalit-session-log-empty__actions {
  display: none;
}

.journalit-session-log-empty__actions {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--size-2-2);
}

.journalit-session-log-alert {
  display: flex;
  gap: var(--size-2-2);
  align-items: flex-start;
  padding: var(--size-2-3);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-secondary);
  color: var(--text-warning);
  font-size: var(--font-ui-small);
}

.journalit-session-log-composer {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
}

.journalit-session-log-composer-tag-control {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  color: var(--text-muted);
}

.journalit-session-log-composer-bar .journalit-session-log-composer-tag-trigger {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: auto;
  min-height: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
  cursor: pointer;
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  line-height: 1;
}

.journalit-session-log-composer-bar .journalit-session-log-composer-tag-trigger:hover,
.journalit-session-log-composer-bar .journalit-session-log-composer-tag-trigger:focus,
.journalit-session-log-composer-bar .journalit-session-log-composer-tag-trigger:focus-visible,
.journalit-session-log-composer-bar .journalit-session-log-composer-tag-trigger:active {
  outline: none;
  border: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-normal);
}

.journalit-session-log-composer-tag-chevron {
  color: var(--text-faint);
  transition: transform 120ms ease-in-out;
}

.journalit-session-log-composer-tag-chevron.is-open {
  transform: rotate(180deg);
}

.journalit-session-log-composer-tag-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 100;
  min-width: 220px;
  max-width: 280px;
  max-height: min(300px, 50vh);
  overflow-y: auto;
  padding: 0;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px;
  background: var(--background-primary) !important;
  background-color: var(--background-primary) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.journalit-session-log-composer-tag-menu--portal {
  position: fixed !important;
  top: var(--journalit-session-log-tag-menu-top) !important;
  left: var(--journalit-session-log-tag-menu-left) !important;
  z-index: 10000 !important;
}

.journalit-session-log-composer-tag-menu
  .journalit-session-log-composer-tag-option {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  min-height: 30px;
  padding: 6px 10px;
  border: none !important;
  border-radius: 0;
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  font-size: 13px;
  text-align: left;
  appearance: none;
  -webkit-appearance: none;
}

.journalit-session-log-composer-tag-menu
  .journalit-session-log-composer-tag-option:hover {
  background: var(--background-modifier-hover) !important;
  background-color: var(--background-modifier-hover) !important;
}

.journalit-session-log-composer-tag-menu
  .journalit-session-log-composer-tag-option.is-active {
  background: transparent !important;
  background-color: transparent !important;
  color: var(--text-normal) !important;
}

.journalit-session-log-composer-tag-checkbox {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 2px;
  background-color: var(--background-primary);
  color: var(--text-on-accent);
  font-size: 10px;
}

.journalit-session-log-composer-tag-checkbox.is-checked {
  border-color: var(--interactive-accent);
  background-color: var(--interactive-accent);
}

.journalit-session-log-composer-tag-option-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-session-log-composer-bar {
  display: flex;
  align-items: center;
  gap: var(--size-2-1);
  min-height: 46px;
  padding: var(--size-2-1) var(--size-2-2);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: var(--background-secondary);
}

.journalit-session-log-composer-bar:focus-within {
  border-color: var(--background-modifier-border);
  box-shadow: none;
}

.journalit-session-log-composer-bar > input[type='text'] {
  flex: 1 1 auto;
  min-width: 0;
  height: 34px;
  min-height: 34px;
  padding: 0 var(--size-2-2);
  border: 0;
  background: transparent;
  box-shadow: none;
  outline: none;
  color: var(--text-normal);
}

.journalit-session-log-composer-bar > input[type='text']:focus {
  border: 0 !important;
  outline: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

.journalit-session-log-edit-form select,
.journalit-session-log-edit-form textarea {
  width: 100%;
}

.journalit-session-log-timestamp-input {
  width: fit-content;
  max-width: 100%;
}

.journalit-session-log-timestamp-input[data-controller-only='true'] {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
}

.journalit-session-log-timestamp-input .journalit-fast-datetime__container {
  width: fit-content;
  max-width: 100%;
}

.journalit-session-log-timestamp-input
  .journalit-fast-datetime__container[data-date-only='false']
  .journalit-fast-datetime__calendar-button {
  margin-left: 4px;
}

.journalit-session-log-edit-form textarea {
  min-height: 72px;
  resize: vertical;
}

.journalit-session-log-primary-button,
.journalit-session-log-ghost-button,
.journalit-session-log-filter-trigger,
.journalit-session-log-entry__actions button,
.journalit-session-log-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-2-1);
}

.journalit-session-log-primary-button {
  width: 100%;
}

.journalit-session-log-filter {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
}

.journalit-session-log-filter-trigger {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 2rem !important;
  min-width: 2rem !important;
  height: 2rem !important;
  min-height: 2rem !important;
  padding: 0 !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px !important;
  background: var(--background-secondary) !important;
  background-color: var(--background-secondary) !important;
  box-shadow: none !important;
  color: var(--text-muted) !important;
  cursor: pointer;
  transition: all 0.15s ease;
}

.journalit-session-log-panel button.journalit-session-log-filter-trigger.journalit-header-icon-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  min-width: 2rem;
  height: 2rem;
  min-height: 2rem;
  padding: 0;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-secondary);
  background-color: var(--background-secondary);
  box-shadow: none;
  color: var(--text-muted);
  cursor: pointer;
}

.journalit-session-log-filter-trigger:hover,
.journalit-session-log-filter-trigger:focus,
.journalit-session-log-filter-trigger:focus-visible,
.journalit-session-log-filter-trigger:active,
.journalit-session-log-filter-trigger.is-active {
  outline: none !important;
  background: var(--background-modifier-hover) !important;
  background-color: var(--background-modifier-hover) !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
}

.journalit-session-log-panel button.journalit-session-log-filter-trigger.journalit-header-icon-button:hover,
.journalit-session-log-panel button.journalit-session-log-filter-trigger.journalit-header-icon-button:focus,
.journalit-session-log-panel button.journalit-session-log-filter-trigger.journalit-header-icon-button:focus-visible,
.journalit-session-log-panel button.journalit-session-log-filter-trigger.journalit-header-icon-button:active {
  outline: none;
  background: var(--background-modifier-hover);
  background-color: var(--background-modifier-hover);
  box-shadow: none;
  color: var(--text-normal);
}

.journalit-session-log-filter-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background-color: var(--interactive-accent);
  color: var(--text-on-accent);
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  pointer-events: none;
  z-index: 1;
}


.journalit-session-log-filter-menu {
  left: auto;
  right: 0;
}

.journalit-session-log-filter-menu--portal {
  position: fixed !important;
  top: var(--journalit-session-log-filter-menu-top) !important;
  left: var(--journalit-session-log-filter-menu-left) !important;
  right: auto !important;
  z-index: 10000 !important;
}

.journalit-session-log-timeline {
  display: grid;
  gap: var(--size-2-3);
  min-height: 0;
}

.journalit-session-log-separator {
  display: flex;
  align-items: center;
  gap: var(--size-2-3);
  color: var(--text-faint);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0.06em;
  line-height: 1;
  text-transform: uppercase;
}

.journalit-session-log-separator::before,
.journalit-session-log-separator::after {
  content: '';
  flex: 1 1 0;
  height: 1px;
  background: var(--background-modifier-border);
}

.journalit-session-log-separator > span {
  flex: 0 0 auto;
}

.journalit-session-log-separator .journalit-session-log-add-button,
.journalit-session-log-empty .journalit-session-log-add-button,
.journalit-session-log-empty .journalit-session-log-clear-filter-button {
  display: flex !important;
  flex: 0 0 auto;
  align-items: center !important;
  justify-content: center !important;
  gap: normal !important;
  min-width: 0 !important;
  min-height: 0 !important;
  height: 24px !important;
  padding: 2px 6px !important;
  border: none !important;
  border-radius: 4px !important;
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  color: var(--text-muted) !important;
  cursor: pointer;
  font-size: 12px !important;
  font-weight: var(--font-normal) !important;
  letter-spacing: 0 !important;
  line-height: var(--line-height-tight);
  text-transform: none !important;
}

.journalit-session-log-panel button.journalit-session-log-add-button.journalit-button.journalit-button--plain.journalit-button--small,
.journalit-session-log-panel button.journalit-session-log-clear-filter-button.journalit-button.journalit-button--plain.journalit-button--small {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: normal;
  min-width: 0;
  min-height: 0;
  height: 24px;
  padding: 2px 6px;
  border: none;
  border-radius: 4px;
  background: transparent;
  background-color: transparent;
  box-shadow: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 12px;
  font-weight: var(--font-normal);
  letter-spacing: 0;
  line-height: var(--line-height-tight);
  text-transform: none;
}

.journalit-session-log-separator .journalit-session-log-add-button:hover,
.journalit-session-log-separator .journalit-session-log-add-button:focus,
.journalit-session-log-separator .journalit-session-log-add-button:focus-visible,
.journalit-session-log-separator .journalit-session-log-add-button:active,
.journalit-session-log-empty .journalit-session-log-add-button:hover,
.journalit-session-log-empty .journalit-session-log-add-button:focus,
.journalit-session-log-empty .journalit-session-log-add-button:focus-visible,
.journalit-session-log-empty .journalit-session-log-add-button:active,
.journalit-session-log-empty .journalit-session-log-clear-filter-button:hover,
.journalit-session-log-empty .journalit-session-log-clear-filter-button:focus,
.journalit-session-log-empty .journalit-session-log-clear-filter-button:focus-visible,
.journalit-session-log-empty .journalit-session-log-clear-filter-button:active {
  outline: none !important;
  background: var(--background-modifier-hover) !important;
  background-color: var(--background-modifier-hover) !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
}
.journalit-session-log-panel button.journalit-session-log-add-button.journalit-button.journalit-button--plain.journalit-button--small:hover,
.journalit-session-log-panel button.journalit-session-log-add-button.journalit-button.journalit-button--plain.journalit-button--small:focus,
.journalit-session-log-panel button.journalit-session-log-add-button.journalit-button.journalit-button--plain.journalit-button--small:focus-visible,
.journalit-session-log-panel button.journalit-session-log-add-button.journalit-button.journalit-button--plain.journalit-button--small:active,
.journalit-session-log-panel button.journalit-session-log-clear-filter-button.journalit-button.journalit-button--plain.journalit-button--small:hover,
.journalit-session-log-panel button.journalit-session-log-clear-filter-button.journalit-button.journalit-button--plain.journalit-button--small:focus,
.journalit-session-log-panel button.journalit-session-log-clear-filter-button.journalit-button.journalit-button--plain.journalit-button--small:focus-visible,
.journalit-session-log-panel button.journalit-session-log-clear-filter-button.journalit-button.journalit-button--plain.journalit-button--small:active {
  outline: none;
  background: transparent;
  background-color: transparent;
  box-shadow: none;
  color: var(--text-normal);
}


.journalit-session-log-separator__action {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--size-2-1);
  min-height: 24px;
  padding: 2px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s);
  background: var(--background-secondary);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
  letter-spacing: 0;
  text-transform: none;
}

.journalit-session-log-separator__action:hover,
.journalit-session-log-separator__action:focus-visible {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-session-log-entry {
  position: relative;
  display: block;
  min-width: 0;
}

.journalit-session-log-entry__time {
  color: var(--text-muted);
  font-family: var(--font-monospace);
  font-size: var(--font-ui-smaller);
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
  white-space: nowrap;
}

.journalit-session-log-entry__body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--size-2-2);
  min-width: 0;
  padding: var(--size-2-3);
  border: 1px solid var(--background-modifier-border);
  border-left-width: 3px;
  border-radius: var(--radius-m);
  background: var(--background-secondary);
}

.journalit-session-log-entry__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-2-2);
}

.journalit-session-log-entry__meta {
  display: flex;
  align-items: center;
  gap: var(--size-2-2);
  min-width: 0;
}

.journalit-session-log-entry__text {
  min-width: 0;
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.journalit-session-log-entry__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-2-1);
  justify-content: flex-end;
  opacity: 0;
  transition: opacity 120ms ease-in-out;
}

.journalit-session-log-entry:hover .journalit-session-log-entry__actions,
.journalit-session-log-entry:focus-within .journalit-session-log-entry__actions {
  opacity: 1;
}

.journalit-session-log-entry__actions button,
.journalit-session-log-icon-button {
  min-height: 26px;
  padding: 0 var(--size-2-2);
  font-size: var(--font-ui-smaller);
}

.journalit-session-log-entry__actions .journalit-session-log-action-button {
  all: unset;
  appearance: none !important;
  -webkit-appearance: none !important;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-2-1);
  height: 28px;
  min-height: 28px;
  margin: 0 !important;
  padding: 0 var(--size-2-2) !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: var(--radius-s) !important;
  background: var(--background-primary-alt) !important;
  background-color: var(--background-primary-alt) !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--font-ui-smaller);
  line-height: 1;
}

.journalit-session-log-entry__actions .journalit-session-log-action-button--icon {
  width: 28px;
  min-width: 28px;
  height: 28px;
  min-height: 28px;
  padding: 5px !important;
}

.journalit-session-log-entry__actions .journalit-session-log-action-button:hover,
.journalit-session-log-entry__actions .journalit-session-log-action-button:focus-visible {
  border-color: var(--background-modifier-border-hover) !important;
  background: var(--background-modifier-hover) !important;
  background-color: var(--background-modifier-hover) !important;
  box-shadow: none !important;
  color: var(--text-normal);
}

.journalit-session-log-entry__actions .journalit-session-log-action-button .journalit-obsidian-icon {
  display: flex;
  width: 16px;
  align-items: center;
  justify-content: center;
  padding: 0;
  gap: normal;
}

.journalit-session-log-entry__actions .journalit-session-log-action-button .journalit-obsidian-icon > svg {
  width: 16px;
  height: 16px;
}

.journalit-session-log-icon-button {
  flex: 0 0 auto;
  width: 34px;
  min-width: 34px;
  height: 34px;
  padding: 0;
  border-radius: var(--radius-s);
  opacity: 0;
  transition: opacity 120ms ease-in-out;
}

.journalit-session-log-composer-bar .journalit-session-log-icon-button {
  opacity: 1;
  border-color: transparent;
  background: transparent;
  box-shadow: none;
}

.journalit-session-log-composer-bar .journalit-session-log-icon-button:not(:disabled) {
  cursor: pointer;
}

.journalit-session-log-composer-bar .journalit-session-log-icon-button:disabled {
  cursor: not-allowed;
}

.journalit-session-log-composer-bar .journalit-session-log-send-button {
  border-color: var(--background-modifier-border);
  background: var(--background-primary-alt);
  box-shadow: var(--input-shadow);
}

.journalit-session-log-composer-bar .journalit-session-log-icon-button.is-active {
  color: var(--text-accent);
}

.journalit-session-log-send-button:not(:disabled) {
  color: var(--text-accent);
}

.journalit-session-log-entry:hover .journalit-session-log-icon-button,
.journalit-session-log-entry:focus-within .journalit-session-log-icon-button {
  opacity: 1;
}

.journalit-session-log-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  padding: 2px 7px;
  border-radius: var(--radius-s);
  background: var(--background-modifier-border);
  color: var(--text-normal);
  font-size: 0.7rem;
  font-weight: var(--font-semibold);
  line-height: 1.4;
}

.journalit-session-log-tag--blue { background: rgba(var(--color-blue-rgb, 72, 138, 224), 0.22); }
.journalit-session-log-tag--indigo { background: rgba(var(--color-blue-rgb, 72, 138, 224), 0.16); }
.journalit-session-log-tag--purple { background: rgba(var(--color-purple-rgb, 126, 87, 194), 0.22); }
.journalit-session-log-tag--green { background: rgba(var(--color-green-rgb, 67, 160, 71), 0.22); }
.journalit-session-log-tag--pink { background: rgba(var(--color-pink-rgb, 216, 27, 96), 0.22); }
.journalit-session-log-tag--amber { background: rgba(var(--color-yellow-rgb, 224, 175, 72), 0.25); }
.journalit-session-log-tag--red { background: rgba(var(--color-red-rgb, 233, 49, 71), 0.2); }
.journalit-session-log-tag--orange { background: rgba(var(--color-orange-rgb, 245, 124, 0), 0.22); }

.journalit-session-log-entry--analysis .journalit-session-log-entry__body { border-left-color: rgba(var(--color-blue-rgb, 72, 138, 224), 0.9); }
.journalit-session-log-entry--trade-plan .journalit-session-log-entry__body { border-left-color: rgba(var(--color-blue-rgb, 72, 138, 224), 0.72); }
.journalit-session-log-entry--market .journalit-session-log-entry__body,
.journalit-session-log-entry--market-structure .journalit-session-log-entry__body { border-left-color: rgba(var(--color-purple-rgb, 126, 87, 194), 0.9); }
.journalit-session-log-entry--trade .journalit-session-log-entry__body,
.journalit-session-log-entry--execution .journalit-session-log-entry__body,
.journalit-session-log-entry--green .journalit-session-log-entry__body { border-left-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.9); }
.journalit-session-log-entry--psychology .journalit-session-log-entry__body { border-left-color: rgba(var(--color-pink-rgb, 216, 27, 96), 0.9); }
.journalit-session-log-entry--lesson .journalit-session-log-entry__body { border-left-color: rgba(var(--color-yellow-rgb, 224, 175, 72), 0.9); }
.journalit-session-log-entry--mistake .journalit-session-log-entry__body,
.journalit-session-log-entry--red .journalit-session-log-entry__body { border-left-color: rgba(var(--color-red-rgb, 233, 49, 71), 0.9); }
.journalit-session-log-entry--uncategorized .journalit-session-log-entry__body,
.journalit-session-log-entry--review-needed .journalit-session-log-entry__body { border-left-color: rgba(var(--color-orange-rgb, 245, 124, 0), 0.9); }
.journalit-session-log-entry--tag-blue .journalit-session-log-entry__body { border-left-color: rgba(var(--color-blue-rgb, 72, 138, 224), 0.9); }
.journalit-session-log-entry--tag-indigo .journalit-session-log-entry__body { border-left-color: rgba(var(--color-blue-rgb, 72, 138, 224), 0.72); }
.journalit-session-log-entry--tag-purple .journalit-session-log-entry__body { border-left-color: rgba(var(--color-purple-rgb, 126, 87, 194), 0.9); }
.journalit-session-log-entry--tag-green .journalit-session-log-entry__body { border-left-color: rgba(var(--color-green-rgb, 67, 160, 71), 0.9); }
.journalit-session-log-entry--tag-pink .journalit-session-log-entry__body { border-left-color: rgba(var(--color-pink-rgb, 216, 27, 96), 0.9); }
.journalit-session-log-entry--tag-amber .journalit-session-log-entry__body { border-left-color: rgba(var(--color-yellow-rgb, 224, 175, 72), 0.9); }
.journalit-session-log-entry--tag-red .journalit-session-log-entry__body { border-left-color: rgba(var(--color-red-rgb, 233, 49, 71), 0.9); }
.journalit-session-log-entry--tag-orange .journalit-session-log-entry__body { border-left-color: rgba(var(--color-orange-rgb, 245, 124, 0), 0.9); }

.journalit-settings .journalit-session-log-trade-events-setting .toggle-switch-container {
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
  width: 36px;
  height: 20px;
}

.journalit-settings .journalit-session-log-trade-events-setting .toggle-switch-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
}

.journalit-settings .journalit-session-log-trade-events-setting .toggle-switch-label {
  position: absolute;
  inset: 0;
  display: block;
  cursor: pointer;
  overflow: hidden;
  border-radius: 999px;
  background: var(--background-modifier-border);
}

.journalit-settings .journalit-session-log-trade-events-setting .toggle-switch-button {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--background-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.journalit-settings .journalit-session-log-trade-events-setting .toggle-switch-input:checked + .toggle-switch-label {
  background: var(--interactive-accent);
}

.journalit-settings .journalit-session-log-trade-events-setting .toggle-switch-input:checked + .toggle-switch-label .toggle-switch-button {
  transform: translateX(16px);
}

.journalit-settings .journalit-session-log-trade-events-setting .toggle-switch-input:focus-visible + .toggle-switch-label {
  box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
}

.journalit-session-log-tag-settings-list {
  display: flex;
  flex-direction: column;
  margin: var(--size-2-3) var(--size-4-3) var(--size-4-2);
  padding: 0;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: transparent;
  overflow: hidden;
}

.journalit-settings .journalit-session-mode-tags-heading {
  margin-top: var(--size-4-4) !important;
  padding-top: var(--size-4-4) !important;
  border-top: 1px solid var(--background-modifier-border) !important;
  border-radius: 0 !important;
  background: transparent !important;
}

.journalit-settings .journalit-session-log-tag-settings-list .option-item.setting-item {
  margin: 0 !important;
  padding: var(--size-4-3) !important;
  border: 0 !important;
  border-bottom: 1px solid var(--background-modifier-border) !important;
  border-radius: 0 !important;
  background: transparent !important;
}

.journalit-settings .journalit-session-log-tag-settings-list .option-item.setting-item:last-child {
  border-bottom: 0 !important;
}

.journalit-settings .journalit-session-log-tags-reset-container {
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
}

.journalit-settings button.journalit-session-log-tags-reset-link {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: var(--size-2-2);
  width: auto !important;
  height: auto !important;
  min-width: 0 !important;
  min-height: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-error);
  cursor: pointer;
  font-size: var(--font-ui-small);
  font-weight: var(--font-medium);
  line-height: 1.2;
}

.journalit-settings button.journalit-session-log-tags-reset-link:hover,
.journalit-settings button.journalit-session-log-tags-reset-link:focus-visible {
  border: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-error-hover, var(--text-error));
  text-decoration: underline;
}

.journalit-session-mode-layout-settings {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-1);
  margin: var(--size-4-4) 0;
  padding: var(--size-4-4) var(--size-4-3) 0;
  border-top: 1px solid var(--background-modifier-border);
}

.journalit-session-mode-layout-settings .journalit-session-mode-layout-heading {
  margin-bottom: 0 !important;
  padding-bottom: 0;
  padding-right: 0 !important;
  padding-left: 0 !important;
}

.journalit-session-mode-layout-card {
  display: flex;
  flex-direction: column;
  gap: var(--size-2-3);
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.journalit-session-mode-layout-phase-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  padding: 0;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  background: transparent;
  overflow: hidden;
}

.journalit-session-mode-layout-phase-tabs .journalit-session-mode-layout-phase-tab {
  all: unset;
  box-sizing: border-box;
  min-height: 32px;
  padding: 0 var(--size-2-2);
  border: 0;
  border-right: 1px solid var(--background-modifier-border);
  border-radius: 0;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-muted);
  cursor: pointer;
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-medium);
  line-height: 1;
  text-align: center;
}

.journalit-session-mode-layout-phase-tabs .journalit-session-mode-layout-phase-tab:last-child {
  border-right: 0;
}

.journalit-session-mode-layout-phase-tabs .journalit-session-mode-layout-phase-tab:hover,
.journalit-session-mode-layout-phase-tabs .journalit-session-mode-layout-phase-tab:focus-visible {
  color: var(--text-normal);
}

.journalit-session-mode-layout-phase-tabs .journalit-session-mode-layout-phase-tab.is-active {
  background: color-mix(in srgb, var(--interactive-accent) 18%, transparent) !important;
  background-color: color-mix(in srgb, var(--interactive-accent) 18%, transparent) !important;
  color: var(--text-normal);
}

.journalit-session-mode-layout-phase__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--size-4-3);
}

.journalit-session-mode-layout-phase__description {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  line-height: 1.3;
}

.journalit-settings button.journalit-session-mode-layout-reset-link {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: var(--size-2-1);
  width: auto !important;
  height: auto !important;
  min-width: 0 !important;
  min-height: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-accent) !important;
  cursor: pointer;
  font-size: var(--font-ui-small);
  font-weight: var(--font-medium);
  line-height: 1.2;
  white-space: nowrap;
}

.journalit-settings button.journalit-session-mode-layout-reset-link:hover,
.journalit-settings button.journalit-session-mode-layout-reset-link:focus-visible {
  border: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-accent-hover) !important;
  text-decoration: underline;
}

.journalit-session-mode-layout-module-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  overflow: hidden;
}

.journalit-session-mode-layout-module {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--size-2-3);
  padding: var(--size-2-3);
  border: 0;
  border-bottom: 1px solid var(--background-modifier-border);
  border-radius: 0;
  background: transparent;
  opacity: 0.72;
}

.journalit-session-mode-layout-module:last-child {
  border-bottom: 0;
}

.journalit-session-mode-layout-module.is-enabled {
  opacity: 1;
}

.journalit-session-mode-layout-module__toggle {
  display: flex;
  align-items: flex-start;
  gap: var(--size-2-3);
  min-width: 0;
}

.journalit-session-mode-layout-module__label,
.journalit-session-mode-layout-module__description {
  display: block;
}

.journalit-session-mode-layout-module__label {
  color: var(--text-normal);
  font-size: var(--font-ui-small);
  font-weight: var(--font-medium);
}

.journalit-session-mode-layout-module__description {
  margin-top: 2px;
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  line-height: 1.3;
}

.journalit-session-mode-layout-module__order {
  display: flex;
  gap: var(--size-2-1);
}

.journalit-settings-tab .session-mode-settings .journalit-session-mode-layout-reorder-button.journalit-button {
  min-width: 28px !important;
  width: 28px !important;
  height: 28px !important;
  padding: 5px !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px !important;
  background-color: var(--background-primary) !important;
  color: var(--text-normal) !important;
  gap: 0 !important;
  flex: 0 0 28px;
  line-height: 1;
  transition: all 0.2s ease !important;
}

.journalit-settings-tab .session-mode-settings .journalit-session-mode-layout-reorder-button.journalit-button:hover:not(:disabled) {
  border-color: var(--interactive-accent) !important;
  background-color: var(--background-modifier-hover) !important;
  color: var(--text-normal) !important;
}

.journalit-settings-tab .session-mode-settings .journalit-session-mode-layout-reorder-button.journalit-button:disabled {
  opacity: 0.35;
}

@media (max-width: 520px) {
  .journalit-session-mode-layout-phase-tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.journalit-session-log-tag-edit-grid,
.journalit-session-log-tag-draft-fields {
  display: grid;
  grid-template-columns: minmax(120px, 0.85fr) 126px 112px;
  gap: var(--size-2-2);
  align-items: start;
  width: 100%;
}

.journalit-session-log-tag-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--size-2-1);
}

.journalit-session-log-tag-field__label {
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  line-height: 1.2;
}

.journalit-session-log-tag-field > input,
.journalit-session-log-tag-field > select {
  width: 100%;
}

.journalit-session-log-tag-edit-grid .option-actions {
  grid-column: 1 / -1;
  justify-content: flex-end;
}

.journalit-session-log-tag-short-input {
  text-transform: none;
}

.journalit-settings .session-mode-settings .journalit-session-log-tag-color-select {
  height: 36px;
  min-height: 36px;
  min-width: 0;
  padding-top: 6px;
  padding-bottom: 6px;
  line-height: 20px;
}

.journalit-session-log-tag-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2-1);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
}

.journalit-session-log-tag-setting-info {
  color: var(--text-muted);
  opacity: 0.9;
  vertical-align: -1px;
}

.journalit-session-log-tag-setting-info:hover {
  color: var(--text-normal);
  opacity: 1;
}

.journalit-session-log-tag-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  padding: 2px 7px;
  border-radius: var(--radius-s);
  background: var(--background-modifier-border);
  color: var(--text-normal);
  font-size: 0.7rem;
  font-weight: var(--font-semibold);
  line-height: 1.4;
}

.journalit-session-log-tag-preview--blue { background: rgba(var(--color-blue-rgb, 72, 138, 224), 0.22); }
.journalit-session-log-tag-preview--indigo { background: rgba(var(--color-blue-rgb, 72, 138, 224), 0.16); }
.journalit-session-log-tag-preview--purple { background: rgba(var(--color-purple-rgb, 126, 87, 194), 0.22); }
.journalit-session-log-tag-preview--green { background: rgba(var(--color-green-rgb, 67, 160, 71), 0.22); }
.journalit-session-log-tag-preview--pink { background: rgba(var(--color-pink-rgb, 216, 27, 96), 0.22); }
.journalit-session-log-tag-preview--amber { background: rgba(var(--color-yellow-rgb, 224, 175, 72), 0.25); }
.journalit-session-log-tag-preview--red { background: rgba(var(--color-red-rgb, 233, 49, 71), 0.2); }
.journalit-session-log-tag-preview--orange { background: rgba(var(--color-orange-rgb, 245, 124, 0), 0.22); }

.journalit-session-log-tag-setting-pill {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: var(--radius-s);
  background: var(--background-modifier-border);
  color: var(--text-muted);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-normal);
}

.journalit-session-log-tag-add-row .setting-item-info {
  flex: 1 1 auto;
}

.journalit-settings .journalit-session-log-tag-add-row.setting-item {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 70px;
  align-items: flex-start !important;
  gap: var(--size-2-2) 16px !important;
  margin: 0 !important;
  padding: var(--size-2-3) var(--size-4-3) !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
}

.journalit-settings .journalit-session-log-tag-add-row .setting-item-control {
  display: grid !important;
  grid-column: 2;
  grid-row: 1;
  min-width: 70px !important;
  grid-template-rows: calc(var(--font-ui-smaller) * 1.2) 36px;
  align-items: start !important;
  justify-self: end !important;
  justify-content: end !important;
  gap: var(--size-2-1) !important;
  padding-top: 0 !important;
}

.journalit-settings .journalit-session-log-tag-add-row .setting-item-info {
  display: block !important;
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
}

.journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-draft-fields {
  display: grid !important;
  grid-template-columns: 150px 100px 82px;
}

.journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tags-reset-container {
  display: flex;
  justify-content: flex-end;
  min-height: calc(var(--font-ui-smaller) * 1.2);
}

.journalit-settings .journalit-session-log-tag-add-row button.journalit-session-log-tags-reset-link {
  align-self: flex-start;
  white-space: nowrap;
}

.journalit-settings .journalit-session-log-tag-add-row .journalit-settings-input,
.journalit-settings .journalit-session-log-tag-add-row select,
.journalit-settings .journalit-session-log-tag-add-row button.journalit-button {
  align-self: stretch !important;
  justify-self: stretch !important;
  min-height: 36px !important;
  height: 36px !important;
  box-sizing: border-box;
}

.journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-color-select {
  width: 82px !important;
  min-width: 82px !important;
  max-width: 82px !important;
}

.journalit-settings .journalit-session-log-tag-add-row button.journalit-button {
  width: 70px !important;
  min-width: 70px !important;
  max-width: 70px !important;
}

.journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-toggle {
  display: inline-grid;
  grid-template-columns: auto max-content auto;
  align-items: center;
  justify-self: start;
  column-gap: var(--size-2-2);
  max-width: 100%;
}

.journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-toggle:nth-child(4) {
  grid-column: 1;
}

.journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-toggle:nth-child(5) {
  grid-column: 2;
}

.journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-toggle input[type='checkbox'],
.journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-toggle .journalit-session-log-tag-setting-info {
  flex: 0 0 auto;
}

.journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-toggle .journalit-session-log-tag-setting-info {
  justify-self: start;
}

@media (max-width: 760px) {
  .journalit-settings .journalit-session-log-tag-add-row.setting-item {
    grid-template-columns: minmax(0, 1fr);
  }

  .journalit-settings .journalit-session-log-tag-add-row .setting-item-info,
  .journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-draft-fields {
    display: grid !important;
  }

  .journalit-settings .journalit-session-log-tag-add-row .setting-item-control {
    grid-column: 1;
    grid-row: auto;
  }

}

@media (max-width: 700px) {
  .journalit-session-log-tag-edit-grid,
  .journalit-session-log-tag-draft-fields {
    grid-template-columns: 1fr;
  }

  .journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-draft-fields {
    grid-template-columns: 1fr;
  }

  .journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-toggle:nth-child(4),
  .journalit-settings .journalit-session-log-tag-add-row .journalit-session-log-tag-toggle:nth-child(5) {
    grid-column: 1;
  }
}

.journalit-session-log-unresolved {
  display: inline-flex;
  margin-left: var(--size-2-2);
  padding: 1px 6px;
  border-radius: var(--radius-s);
  background: rgba(var(--color-red-rgb, 233, 49, 71), 0.18);
  color: var(--text-error);
  font-size: var(--font-ui-smaller);
  font-weight: var(--font-semibold);
}

.journalit-session-log-edit-form {
  display: flex;
  flex: 1 1 100%;
  align-items: flex-start;
  gap: var(--size-2-2);
  min-width: 0;
}

.journalit-session-log-edit-tag-control {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  min-height: 30px;
  align-items: center;
}

.journalit-session-log-entry .journalit-session-log-edit-tag-trigger {
  min-height: 30px !important;
  padding: 0 2px !important;
  border: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.journalit-session-log-edit-tag-menu {
  top: calc(100% + 4px);
}

.journalit-session-log-edit-form textarea {
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
  min-height: 30px;
  height: 30px;
  max-height: 96px;
  padding: 6px 8px;
  resize: vertical;
  line-height: 1.35;
}

.journalit-session-log-edit-actions {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--size-2-1);
}

.journalit-session-log-entry button.journalit-session-log-edit-icon-button.custom-options-compact-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  min-width: 28px;
  height: 28px;
  min-height: 28px;
  margin: 0;
  padding: 5px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background-color: var(--background-primary);
  box-shadow: none;
  color: var(--text-normal);
  cursor: pointer;
  line-height: 1;
  transition: all 0.2s ease;
}

.journalit-session-log-entry button.journalit-session-log-edit-icon-button.custom-options-compact-icon-button:hover,
.journalit-session-log-entry button.journalit-session-log-edit-icon-button.custom-options-compact-icon-button:focus-visible {
  outline: none;
  border-color: var(--interactive-accent);
  background-color: var(--background-modifier-hover);
  box-shadow: none;
  color: var(--text-normal);
}

.journalit-session-log-entry button.journalit-session-log-edit-icon-button.custom-options-compact-icon-button svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 520px) {
  .journalit-session-log-edit-form {
    flex-wrap: wrap;
  }

  .journalit-session-log-edit-form textarea {
    flex-basis: 100%;
    order: 3;
  }
}
`;
