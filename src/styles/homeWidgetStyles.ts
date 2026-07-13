

export const HOME_WIDGET_STYLES = `
  
  .journalit-home-widget__eyebrow {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-faint);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .journalit-home-widget__muted {
    font-size: 13px;
    color: var(--text-muted);
  }

  .journalit-home-widget__faint {
    font-size: 11px;
    color: var(--text-faint);
  }

  
  .journalit-home-score {
    --journalit-score-excellent: #0ea5e9;
    --journalit-score-phase-established: var(--journalit-score-excellent, #0ea5e9);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .journalit-home-score--compact {
    padding: 12px 12px 8px 12px;
    gap: 0;
  }

  .journalit-home-score--padded {
    padding: 12px;
    gap: 8px;
  }

  .journalit-home-score--expanded {
    padding: 12px;
    gap: 8px;
    overflow: hidden;
  }

  .journalit-home-score--centered {
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .journalit-home-score--clickable {
    cursor: pointer;
  }

  .journalit-home-score__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .journalit-home-score__header-icons {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-faint);
  }

  .journalit-home-score__radar-container {
    flex: 1;
    min-height: 120px;
    min-width: 0;
    width: 100%;
  }

  .journalit-home-score__score-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    margin-top: -4px;
    position: relative;
    width: 100%;
  }

  .journalit-home-score__score-value {
    font-size: 36px;
    font-weight: 700;
    line-height: 1;
  }

  .journalit-home-score__phase-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .journalit-home-score__phase-label {
    font-size: 11px;
    font-weight: 500;
  }

  .journalit-home-score__phase-weeks {
    font-size: 10px;
    color: var(--text-faint);
  }

  .journalit-home-score__legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 0;
    margin-top: 5px;
  }

  .journalit-home-score__legend--status-left {
    column-gap: 7px;
    flex-wrap: nowrap;
    justify-content: flex-start;
    left: 0;
    margin-top: 0;
    max-width: 38%;
    overflow: hidden;
    position: absolute;
    row-gap: 3px;
    top: 42px;
  }

  .journalit-home-score__legend-item {
    position: relative;
    color: var(--text-faint);
    font-size: 10px;
    line-height: 1;
    max-width: 110px;
    overflow: hidden;
    padding-left: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-home-score__legend--status-left .journalit-home-score__legend-item {
    align-items: center;
    display: inline-flex;
    gap: 4px;
    max-width: 84px;
    padding-left: 0;
  }

  .journalit-home-score__legend-more {
    color: var(--text-faint);
    flex: 0 0 auto;
    font-size: 10px;
    line-height: 1;
    white-space: nowrap;
  }

  .journalit-home-score__legend--status-left .journalit-home-score__legend-item::before {
    flex: 0 0 auto;
    position: static;
    transform: translateY(-1px);
  }

  .journalit-home-score__legend-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    transform: translateY(-50%);
  }

  .journalit-home-score__legend-item--selected::before {
    background: var(--journalit-home-score-legend-color, var(--journalit-home-score-selected-color, var(--interactive-accent)));
  }

  .journalit-home-score__legend-item--all::before {
    background: var(--interactive-accent);
  }

  .journalit-home-score__loading-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .journalit-home-score__loading-radar {
    flex: 1;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-home-score__loading-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-top: -4px;
  }

  .journalit-home-score__loading-score-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .journalit-home-score__skeleton-outer {
    fill: var(--background-modifier-border);
    opacity: 0.5;
  }

  .journalit-home-score__skeleton-inner {
    fill: var(--background-primary);
    opacity: 0.3;
  }

  .journalit-home-score__progress-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .journalit-home-score__progress {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .journalit-home-score__progress-svg {
    transform: rotate(-90deg);
  }

  .journalit-home-score__progress-track {
    stroke: var(--background-modifier-border);
    stroke-width: 6px;
    fill: none;
  }

  .journalit-home-score__progress-circle {
    stroke: var(--interactive-accent);
    stroke-width: 6px;
    stroke-linecap: round;
    fill: none;
    transition: stroke-dasharray 0.5s ease;
  }

  .journalit-home-score__progress-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-normal);
    line-height: 1;
  }

  .journalit-home-score__progress-label {
    font-size: 10px;
    color: var(--text-faint);
  }

  .journalit-home-score__center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .journalit-home-score__message {
    text-align: center;
  }

  .journalit-home-score__message-main {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .journalit-home-score__message-sub {
    font-size: 11px;
    color: var(--text-faint);
  }

  .journalit-home-score__close-button {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-home-score__axis-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow: auto;
  }

  .journalit-home-score__axis-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;
    cursor: help;
  }

  .journalit-home-score__axis-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
  }

  .journalit-home-score__axis-name {
    color: var(--text-normal);
  }

  .journalit-home-score__axis-weight {
    color: var(--text-faint);
  }

  .journalit-home-score__axis-score {
    font-weight: 500;
  }

  .journalit-home-score__axis-track {
    height: 4px;
    background: var(--background-modifier-border);
    border-radius: 2px;
    overflow: hidden;
  }

  .journalit-home-score__axis-fill {
    width: var(--journalit-home-score-axis-width, 0%);
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
    background-color: currentColor;
  }

  .journalit-home-score__axis-tooltip {
    position: absolute;
    left: 0;
    top: 100%;
    margin-top: 4px;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 8px 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 100;
    max-width: 200px;
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.4;
    pointer-events: none;
  }

  .journalit-home-score__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 8px;
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-home-score__footer-score {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-home-score__footer-value {
    font-size: 18px;
    font-weight: 600;
  }

  .journalit-home-score__footer-phase {
    font-size: 11px;
    font-weight: 500;
  }

  .journalit-home-score__footer-trades {
    font-size: 10px;
    color: var(--text-faint);
  }

  .journalit-home-score__tooltip {
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 8px 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .journalit-home-score__tooltip-label {
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .journalit-home-score__tooltip-value {
    font-size: 16px;
    font-weight: 600;
  }

  .journalit-home-score__tooltip-series {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-bottom: 5px;
    min-width: 120px;
  }

  .journalit-home-score__tooltip-series-row {
    align-items: baseline;
    display: flex;
    gap: 10px;
    justify-content: space-between;
  }

  .journalit-home-score__tooltip-series-label {
    color: var(--text-muted);
    font-size: 10px;
    max-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-home-score__tooltip-series-value {
    color: var(--journalit-home-score-tooltip-series-color, var(--interactive-accent));
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
  }

  .journalit-home-score__tooltip-series-row--all .journalit-home-score__tooltip-series-value {
    color: var(--interactive-accent);
  }

  .journalit-home-score__tooltip-weight {
    font-size: 10px;
    color: var(--text-faint);
    margin-top: 2px;
  }

  
  .journalit-score-color--poor {
    color: var(--color-red, #e53935);
  }

  .journalit-score-color--below-average {
    color: var(--color-orange, #fb8c00);
  }

  .journalit-score-color--average {
    color: var(--color-yellow, #fdd835);
  }

  .journalit-score-color--strong {
    color: var(--color-green, #43a047);
  }

  .journalit-score-color--excellent {
    color: var(--journalit-score-excellent, #0ea5e9);
  }

  .journalit-score-phase--insufficient {
    color: var(--text-faint);
  }

  .journalit-score-phase--developing {
    color: var(--color-yellow);
  }

  .journalit-score-phase--established {
    color: var(--journalit-score-phase-established, #0ea5e9);
  }

  
  .journalit-home-position {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-home-position__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .journalit-home-position__actions {
    display: flex;
    gap: 4px;
  }

  .journalit-home-position__action-button {
    padding: 4px 6px;
    border-radius: 4px;
    border: 1px solid var(--background-modifier-border);
    background-color: var(--background-primary);
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .journalit-home-position__tabs {
    display: flex;
    border-bottom: 1px solid var(--background-modifier-border);
    margin-bottom: 4px;
  }

  .journalit-home-position__tab {
    flex: 1;
    padding: 6px 8px;
    font-size: 11px;
    font-weight: 500;
    border: none;
    border-bottom: 2px solid transparent;
    background-color: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .journalit-home-position__tab--active {
    border-bottom-color: var(--interactive-accent);
    color: var(--text-normal);
  }

  .journalit-home-position__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .journalit-home-position__label {
    font-size: 12px;
    color: var(--text-muted);
    display: block;
  }

  .journalit-home-position__input {
    width: 100%;
    margin-top: 4px;
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid var(--background-modifier-border);
    background-color: var(--background-modifier-form-field);
    color: var(--text-normal);
    font-size: 13px;
  }

  .journalit-home-position__select {
    width: 100%;
    margin-top: 4px;
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid var(--background-modifier-border);
    background-color: var(--background-modifier-form-field);
    color: var(--text-normal);
    font-size: 13px;
    cursor: pointer;
    appearance: none;
    padding-right: 24px;
    background-image: none;
  }

  .journalit-home-position__select-wrapper {
    position: relative;
  }

  .journalit-home-position__select-icon {
    position: absolute;
    right: 8px;
    bottom: 10px;
    pointer-events: none;
    color: var(--text-muted);
  }

  .journalit-home-position__spec-info {
    font-size: 11px;
    color: var(--text-muted);
    padding: 4px 8px;
    background-color: var(--background-secondary);
    border-radius: 4px;
  }

  .journalit-home-position__results {
    padding: 8px;
    border-radius: 6px;
    background-color: var(--background-secondary);
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: auto;
  }

  .journalit-home-position__results-primary {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 6px;
  }

  .journalit-home-position__results-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-muted);
  }

  .journalit-home-position__results-value--active {
    color: var(--interactive-accent);
  }

  .journalit-home-position__results-unit {
    font-size: 11px;
    color: var(--text-muted);
  }

  .journalit-home-position__direction {
    font-size: 9px;
    font-weight: 600;
    padding: 1px 4px;
    border-radius: 3px;
    text-transform: uppercase;
  }

  .journalit-home-position__direction--long {
    background-color: rgba(var(--color-green-rgb), 0.15);
    color: var(--color-green);
  }

  .journalit-home-position__direction--short {
    background-color: rgba(var(--color-red-rgb), 0.15);
    color: var(--color-red);
  }

  .journalit-home-position__stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 4px;
  }

  .journalit-home-position__stats-left {
    text-align: left;
  }

  .journalit-home-position__stat-label {
    color: var(--text-faint);
  }

  .journalit-home-position__stat-value {
    font-weight: 500;
  }

  .journalit-home-position__reward-value {
    font-weight: 500;
    color: var(--color-green);
  }

  .journalit-home-position__stats-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-home-position__rr {
    font-weight: 600;
    padding: 1px 5px;
    border-radius: 3px;
  }

  .journalit-home-position__rr--strong {
    background-color: rgba(var(--color-green-rgb), 0.15);
    color: var(--color-green);
  }

  .journalit-home-position__rr--medium {
    background-color: rgba(var(--color-yellow-rgb), 0.15);
    color: var(--color-yellow);
  }

  .journalit-home-position__rr--weak {
    background-color: rgba(var(--color-red-rgb), 0.15);
    color: var(--color-red);
  }

  .journalit-home-position__extra {
    color: var(--text-muted);
  }

  .journalit-position-size-modal {
    width: min(760px, 92vw);
  }

  .journalit-position-size-modal .modal-content {
    padding-top: 8px;
  }

  .journalit-position-size-modal-content .journalit-home-position {
    min-height: 460px;
  }

  
  .journalit-home-goals {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .journalit-home-goals--modal {
    padding: 12px;
    gap: 10px;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    scrollbar-gutter: stable;
  }

  .journalit-home-goals--loading {
    padding: 12px;
    gap: 12px;
  }

  .journalit-home-goals--empty {
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-muted);
  }

  .journalit-home-goals--active {
    padding: 12px;
    gap: 12px;
    cursor: pointer;
    position: relative;
  }

  .journalit-home-goals__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .journalit-home-goals__actions {
    display: flex;
    gap: 4px;
  }

  .journalit-home-goals__save-button {
    padding: 4px;
    border: none;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }

  .journalit-home-goals__save-button:not(:disabled) {
    background-color: var(--color-green);
    color: white;
    cursor: pointer;
  }

  .journalit-home-goals__save-button:disabled {
    background-color: var(--background-modifier-border);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  .journalit-home-goals__cancel-button {
    padding: 4px;
    border: none;
    background-color: transparent;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }

  .journalit-home-goals__chip-list {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .journalit-home-goals__chip {
    padding: 4px 8px;
    font-size: 11px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .journalit-home-goals__chip--active {
    border-color: var(--interactive-accent);
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-home-goals__target-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-home-goals__target-label {
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .journalit-home-goals__target-input {
    flex: 1;
    padding: 6px 8px;
    font-size: 13px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-modifier-form-field);
    color: var(--text-normal);
    outline: none;
  }

  .journalit-home-goals__target-suffix {
    font-size: 11px;
    color: var(--text-faint);
  }

  .journalit-home-goals__account-targets {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 120px;
    overflow: auto;
  }

  .journalit-home-goals--modal .journalit-home-goals__account-targets {
    max-height: none;
    overflow: visible;
  }

  .journalit-home-goals__account-scope {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-home-goals__account-scope-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .journalit-home-goals__account-select {
    min-width: 120px;
    max-width: 50%;
    padding: 4px 8px;
    font-size: 11px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-modifier-form-field);
    color: var(--text-normal);
  }

  .journalit-home-goals__account-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .journalit-home-goals__account-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 6px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-secondary);
    color: var(--text-muted);
    font-size: 11px;
    cursor: pointer;
  }

  .journalit-home-goals__account-target-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(72px, 96px) auto;
    align-items: center;
    gap: 6px;
  }

  .journalit-home-goals__account-target-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    color: var(--text-muted);
  }

  .journalit-home-goals__period-row {
    display: flex;
    gap: 4px;
  }

  .journalit-home-goals__period-button {
    flex: 1;
    padding: 4px 6px;
    font-size: 11px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .journalit-home-goals__period-button--active {
    border-color: var(--interactive-accent);
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-home-goals__lifetime {
    font-size: 11px;
    color: var(--text-faint);
    font-style: italic;
  }

  .journalit-home-goals__r-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-muted);
    cursor: pointer;
  }

  .journalit-home-goals__checkbox {
    margin: 0;
    width: 14px;
    height: 14px;
  }

  .journalit-home-goals__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-height: 0;
    gap: 8px;
  }

  .journalit-home-goals__value {
    font-size: 28px;
    font-weight: 600;
    line-height: 1.1;
    color: var(--journalit-goals-text-color);
  }

  .journalit-home-goals__target-context {
    font-size: 12px;
    color: var(--text-muted);
  }

  .journalit-home-goals__bar {
    width: 100%;
    height: 8px;
    background-color: var(--background-modifier-border);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 4px;
  }

  .journalit-home-goals__bar-fill {
    width: var(--journalit-home-goals-progress, 0%);
    height: 100%;
    border-radius: 4px;
    background-color: var(--journalit-goals-progress-color);
    transition: width 0.3s ease;
  }

  .journalit-home-goals__percent {
    font-size: 13px;
    font-weight: 500;
    color: var(--journalit-goals-progress-color);
  }

  .journalit-home-goals__complete {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: var(--color-green);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    line-height: 1;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .journalit-home-goals__complete svg {
    display: block;
    flex-shrink: 0;
  }

  .journalit-home-goals__empty-text {
    font-size: 13px;
  }

  .journalit-home-goals--scope-mismatch {
    gap: 6px;
    padding: 16px;
  }

  .journalit-home-goals__scope-hint {
    max-width: 240px;
    font-size: 11px;
    color: var(--text-faint);
    text-align: center;
    line-height: 1.35;
  }

  .journalit-home-goals--complete,
  .journalit-home-goals--high {
    --journalit-goals-progress-color: var(--color-green);
    --journalit-goals-text-color: var(--color-green);
  }

  .journalit-home-goals--medium {
    --journalit-goals-progress-color: var(--color-yellow);
    --journalit-goals-text-color: var(--text-normal);
  }

  .journalit-home-goals--low {
    --journalit-goals-progress-color: var(--color-orange, #f59e0b);
    --journalit-goals-text-color: var(--color-orange, #f59e0b);
  }

  .journalit-home-goals--critical {
    --journalit-goals-progress-color: var(--color-red);
    --journalit-goals-text-color: var(--color-red);
  }

  
  .journalit-home-aum {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 8px;
    cursor: pointer;
  }

  .journalit-home-aum__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .journalit-home-aum__period {
    font-size: 11px;
    color: var(--text-faint);
  }

  .journalit-home-aum__sparkline {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    padding: 4px 0;
  }

  .journalit-home-aum__sparkline-svg {
    display: block;
    width: 100%;
    height: 40px;
  }

  .journalit-home-aum__sparkline-skeleton {
    opacity: 0.5;
  }

  .journalit-home-aum__sparkline-line {
    stroke: currentColor;
  }

  .journalit-home-aum__sparkline-line--masked {
    stroke: var(--text-muted);
    opacity: 0.45;
  }

  .journalit-home-aum__footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .journalit-home-aum__left {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .journalit-home-aum__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .journalit-home-aum__value {
    font-size: 28px;
    font-weight: 600;
    color: var(--text-normal);
    line-height: 1;
  }

  .journalit-home-aum__account-count {
    font-size: 11px;
    color: var(--text-muted);
  }

  .journalit-home-aum__trend {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .journalit-home-aum__trend-value {
    font-size: 14px;
    font-weight: 500;
  }

  .journalit-home-aum__trend-amount {
    font-size: 11px;
  }

  .journalit-home-aum__trend--positive {
    color: var(--color-green);
  }

  .journalit-home-aum__trend--negative {
    color: var(--color-red);
  }

  .journalit-home-aum__trend--flat {
    color: var(--text-muted);
  }

  .journalit-home-aum__loading {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 8px;
  }

  .journalit-home-aum__loading-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .journalit-home-aum__loading-bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .journalit-home-aum__loading-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .journalit-home-aum__loading-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .journalit-home-aum__empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  
  .journalit-home-weekly {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 8px;
  }

  .journalit-home-weekly--clickable {
    cursor: pointer;
  }

  .journalit-home-weekly__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-height: 0;
    gap: 2px;
  }

  .journalit-home-weekly__hero-value {
    font-size: 32px;
    font-weight: 600;
    line-height: 1.1;
    color: var(--journalit-home-weekly-hero-color, var(--text-normal));
  }

  .journalit-home-weekly__hero-context {
    font-size: 12px;
    color: var(--text-muted);
  }

  .journalit-home-weekly__bars {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 48px;
    gap: 4px;
    padding: 0 4px;
  }

  .journalit-home-weekly__bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;
  }

  .journalit-home-weekly__bar-wrapper--clickable {
    cursor: pointer;
  }

  .journalit-home-weekly__bar {
    width: 100%;
    max-width: 24px;
    height: var(--journalit-home-weekly-bar-height, 4px);
    opacity: var(--journalit-home-weekly-bar-opacity, 1);
    transform: scaleY(var(--journalit-home-weekly-bar-scale, 1));
    border-radius: 2px;
    transition: all 0.15s ease;
    transform-origin: bottom;
  }

  .journalit-home-weekly__bar--positive {
    background-color: var(--color-green);
  }

  .journalit-home-weekly__bar--negative {
    background-color: var(--color-red);
  }

  .journalit-home-weekly__bar--neutral {
    background-color: var(--background-modifier-border);
  }

  .journalit-home-weekly__bar--future {
    background-color: var(--background-modifier-border);
  }

  .journalit-home-weekly__day-label {
    font-size: 10px;
    transition: color 0.15s ease;
  }

  .journalit-home-weekly__day-label--active {
    color: var(--text-normal);
  }

  .journalit-home-weekly__day-label--muted {
    color: var(--text-muted);
  }

  .journalit-home-weekly__day-label--future {
    color: var(--text-faint);
    opacity: 0.5;
  }

  .journalit-home-weekly__tooltip {
    position: absolute;
    top: -36px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 11px;
    color: var(--text-normal);
    white-space: nowrap;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    pointer-events: none;
  }

  .journalit-home-weekly__tooltip-day {
    font-weight: 500;
  }

  .journalit-home-weekly__tooltip-separator {
    color: var(--text-muted);
    margin: 0 4px;
  }

  .journalit-home-weekly__tooltip-value {
    font-weight: 500;
  }

  .journalit-home-weekly__tooltip-value--positive {
    color: var(--color-green);
  }

  .journalit-home-weekly__tooltip-value--negative {
    color: var(--color-red);
  }

  .journalit-home-weekly__tooltip-muted {
    color: var(--text-muted);
  }

  .journalit-home-weekly__tooltip-empty {
    color: var(--text-muted);
    margin-left: 4px;
  }

  .journalit-home-weekly__loading {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 8px;
  }

  .journalit-home-weekly__loading-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-height: 0;
    gap: 8px;
  }

  .journalit-home-weekly__loading-bars {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 48px;
    gap: 4px;
    padding: 0 4px;
  }

  .journalit-home-weekly__loading-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;
  }

  .journalit-home-weekly__skeleton-bar {
    max-width: 24px;
  }

  .journalit-home-weekly__empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  
  .journalit-home-best-hours {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 6px;
  }

  .journalit-home-best-hours__hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-height: 0;
  }

  .journalit-home-best-hours__hero-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-align: center;
  }

  .journalit-home-best-hours__hero-window {
    font-size: 22px;
    font-weight: 650;
    line-height: 1.05;
    color: var(--text-normal);
    text-align: center;
  }

  .journalit-home-best-hours__hero-value {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.1;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 6px;
  }

  .journalit-home-best-hours__hero-badge {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: lowercase;
  }

  .journalit-home-best-hours__hero-value--positive {
    color: var(--color-green);
  }

  .journalit-home-best-hours__hero-value--negative {
    color: var(--color-red);
  }

  .journalit-home-best-hours__timeline {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
  }

  .journalit-home-best-hours__timeline-bar {
    position: relative;
    height: 20px;
    background-color: var(--background-secondary);
    border-radius: 10px;
    overflow: hidden;
  }

  .journalit-home-best-hours__timeline-segment {
    position: absolute;
    left: var(--journalit-home-best-hours-segment-left, 0%);
    width: var(--journalit-home-best-hours-segment-width, 0%);
    opacity: var(--journalit-home-best-hours-segment-opacity, 1);
    height: 100%;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .journalit-home-best-hours__timeline-segment--positive {
    background-color: var(--color-green);
  }

  .journalit-home-best-hours__timeline-segment--negative {
    background-color: var(--color-red);
  }

  .journalit-home-best-hours__timeline-segment--neutral {
    background-color: var(--text-faint);
  }

  .journalit-home-best-hours__timeline-segment--empty {
    background-color: transparent;
    border-left: 1px solid var(--background-modifier-border);
  }

  .journalit-home-best-hours__tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
    background-color: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 8px 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    white-space: nowrap;
    pointer-events: none;
  }

  .journalit-home-best-hours__tooltip-header {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-normal);
    margin-bottom: 3px;
  }

  .journalit-home-best-hours__tooltip-value-row,
  .journalit-home-best-hours__tooltip-stats-row {
    display: flex;
    align-items: baseline;
    font-size: 11px;
    line-height: 1.25;
  }

  .journalit-home-best-hours__tooltip-value-row {
    gap: 8px;
    margin-bottom: 4px;
  }

  .journalit-home-best-hours__tooltip-stats-row {
    gap: 12px;
    white-space: nowrap;
  }

  .journalit-home-best-hours__tooltip-pnl {
    font-weight: 500;
  }

  .journalit-home-best-hours__tooltip-pnl--positive {
    color: var(--color-green);
  }

  .journalit-home-best-hours__tooltip-pnl--negative {
    color: var(--color-red);
  }

  .journalit-home-best-hours__tooltip-stat {
    color: var(--text-muted);
  }

  .journalit-home-best-hours__labels {
    position: relative;
    height: 14px;
    font-size: 10px;
    color: var(--text-faint);
  }

  .journalit-home-best-hours__label {
    position: absolute;
    left: var(--journalit-home-best-hours-label-left, 0%);
    transform: translateX(-50%);
  }

  .journalit-home-best-hours__loading-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 0;
  }

  .journalit-home-best-hours__loading-timeline {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .journalit-home-best-hours__loading-labels {
    display: flex;
    justify-content: space-between;
  }

  .journalit-home-best-hours__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  
  .journalit-home-unreviewed {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
    gap: 4px;
  }

  .journalit-home-unreviewed--row {
    flex-direction: row;
    gap: 8px;
  }

  .journalit-home-unreviewed--clickable {
    cursor: pointer;
  }

  .journalit-home-unreviewed__line {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .journalit-home-unreviewed__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: var(--journalit-home-unreviewed-dot-color, var(--text-muted));
  }

  .journalit-home-unreviewed__count {
    font-size: 13px;
    color: var(--text-normal);
    font-weight: 500;
  }

  .journalit-home-unreviewed__breakdown {
    font-size: 11px;
    color: var(--text-muted);
  }

  .journalit-home-unreviewed__check {
    color: var(--color-green);
  }

  .journalit-home-unreviewed__chevron {
    color: var(--text-faint);
    flex-shrink: 0;
  }

  
  .journalit-home-heatmap {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
  }

  .journalit-home-heatmap--clickable {
    cursor: pointer;
  }

  .journalit-home-heatmap__loading-header {
    margin-bottom: 12px;
  }

  .journalit-home-heatmap__loading-center {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .journalit-home-heatmap__loading-grid {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .journalit-home-heatmap__loading-labels {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding-top: 1px;
  }

  .journalit-home-heatmap__loading-columns {
    display: flex;
    gap: 3px;
  }

  .journalit-home-heatmap__loading-column {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .journalit-home-heatmap__expanded-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .journalit-home-heatmap__close-button {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-home-heatmap__year-selector {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .journalit-home-heatmap__year-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    padding: 4px 0;
  }

  .journalit-home-heatmap__year-button {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.15s ease;
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-home-heatmap__year-button--active {
    background: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-home-heatmap__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .journalit-home-heatmap__chevron {
    color: var(--text-faint);
  }

  .journalit-home-heatmap__heatmap {
    flex: 1;
    min-height: 0;
  }

  
  .journalit-home-embedded-note {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .journalit-home-embedded-note--picker {
    gap: 8px;
  }

  .journalit-home-embedded-note__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .journalit-home-embedded-note__header--spaced {
    margin-bottom: 12px;
    flex-shrink: 0;
  }

  .journalit-home-embedded-note__header-label {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .journalit-home-embedded-note__header-label--interactive {
    cursor: pointer;
  }

  .journalit-home-embedded-note__icon-button {
    padding: 4px;
    border: none;
    background-color: transparent;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-home-embedded-note__cancel-button {
    padding: 4px 8px;
    font-size: 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-secondary);
    color: var(--text-muted);
    cursor: pointer;
  }

  .journalit-home-embedded-note__search {
    padding: 8px 12px;
    font-size: 13px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    outline: none;
  }

  .journalit-home-embedded-note__file-list {
    flex: 1;
    overflow: auto;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
  }

  .journalit-home-embedded-note__file-empty {
    padding: 16px;
    text-align: center;
    color: var(--text-muted);
  }

  .journalit-home-embedded-note__file-item {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid var(--background-modifier-border);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .journalit-home-embedded-note__file-icon {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .journalit-home-embedded-note__file-text {
    min-width: 0;
  }

  .journalit-home-embedded-note__file-name {
    font-size: 13px;
    color: var(--text-normal);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-home-embedded-note__file-path {
    font-size: 11px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-home-embedded-note__loading-content {
    flex: 1;
    overflow: hidden;
    padding: 0 8px 8px 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-home-embedded-note__error-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--text-error);
  }

  .journalit-home-embedded-note__error-message {
    font-size: 13px;
    text-align: center;
  }

  .journalit-home-embedded-note__error-button {
    margin-top: 8px;
    padding: 6px 12px;
    font-size: 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
    cursor: pointer;
  }

  .journalit-home-embedded-note__content {
    flex: 1;
    overflow: auto;
    font-size: 13px;
    line-height: 1.5;
    padding: 0 8px 8px 8px;
  }

  .journalit-home-embedded-note .task-list-item-checkbox {
    pointer-events: auto;
    cursor: pointer;
  }

  
  .journalit-home-recent {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
  }

  .journalit-home-recent__header {
    margin-bottom: 12px;
  }

  .journalit-home-recent__content {
    flex: 1;
    overflow: auto;
  }

  .journalit-home-recent__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-muted);
    text-align: center;
  }

  .journalit-home-recent__empty-icon {
    margin-bottom: 8px;
    opacity: 0.5;
    color: var(--text-muted);
  }

  .journalit-home-recent__empty-title {
    font-size: 14px;
  }

  .journalit-home-recent__empty-hint {
    font-size: 12px;
    margin-top: 4px;
  }

  .journalit-home-recent__list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .journalit-home-recent__item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .journalit-home-recent__item-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }

  .journalit-home-recent__item-body {
    flex: 1;
    min-width: 0;
  }

  .journalit-home-recent__item-title {
    font-size: 13px;
    font-weight: 400;
    color: var(--text-normal);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-home-recent__item-date {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  
  .journalit-home-getting-started {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .journalit-home-getting-started__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .journalit-home-getting-started__title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-normal);
  }

  .journalit-home-getting-started__progress {
    font-size: 11px;
    color: var(--text-muted);
  }

  .journalit-home-getting-started__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    overflow: auto;
  }

  .journalit-home-getting-started__item {
    display: flex;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid var(--background-modifier-border);
    align-items: flex-start;
    transition: background-color 0.15s ease;
  }

  .journalit-home-getting-started__item--clickable {
    cursor: pointer;
    background-color: var(--background-primary);
  }

  .journalit-home-getting-started__item--static {
    cursor: default;
    background-color: var(--background-secondary);
  }

  .journalit-home-getting-started__item-icon {
    margin-top: 2px;
    display: flex;
    align-items: center;
  }

  .journalit-home-getting-started__item-icon--complete {
    color: var(--color-green);
  }

  .journalit-home-getting-started__item-icon--pending {
    color: var(--text-muted);
  }

  .journalit-home-getting-started__item-body {
    flex: 1;
    min-width: 0;
  }

  .journalit-home-getting-started__item-header {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }

  .journalit-home-getting-started__item-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-normal);
  }

  .journalit-home-getting-started__item-time {
    font-size: 11px;
    color: var(--text-faint);
    white-space: nowrap;
  }

  .journalit-home-getting-started__item-description {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .journalit-home-getting-started__item-chevron {
    display: flex;
    align-items: center;
    margin-left: 4px;
    margin-top: 1px;
  }

  .journalit-home-getting-started__item-chevron-icon {
    color: var(--text-faint);
  }

  
  .journalit-home-streak {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 8px;
  }

  .journalit-home-streak__skeleton-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .journalit-home-streak__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    font-weight: 500;
    color: var(--text-faint);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .journalit-home-streak__header-stats {
    text-transform: none;
    letter-spacing: 0;
  }

  .journalit-home-streak__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-height: 0;
    gap: 4px;
    color: var(--journalit-home-streak-color, var(--text-normal));
  }

  .journalit-home-streak__hero--skeleton {
    gap: 8px;
  }

  .journalit-home-streak__icon {
    opacity: 0.8;
  }

  .journalit-home-streak__value {
    font-size: 36px;
    font-weight: 600;
    line-height: 1;
  }

  .journalit-home-streak__label {
    font-size: 14px;
    opacity: 0.9;
  }

  .journalit-home-streak__insight {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  
  .journalit-home-setups {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 10px;
  }

  .journalit-home-setups__header {
    width: 100%;
    margin-bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .journalit-home-setups__header > span:first-child,
  .journalit-home-setups__header > .journalit-home-setups__title {
    min-width: 0;
    flex: 1;
  }

  .journalit-home-setups--active,
  .journalit-home-setups--empty {
    cursor: pointer;
  }

  .journalit-home-setups--modal {
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    scrollbar-gutter: stable;
  }

  .journalit-home-setups__actions {
    display: flex;
    gap: 4px;
  }

  .journalit-home-setups__save-button {
    padding: 4px;
    border: none;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }

  .journalit-home-setups__save-button:not(:disabled) {
    background-color: var(--color-green);
    color: var(--text-on-accent, #ffffff);
    cursor: pointer;
  }

  .journalit-home-setups__save-button:disabled {
    background-color: var(--background-modifier-border);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  .journalit-home-setups__cancel-button {
    padding: 4px;
    border: none;
    background-color: transparent;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }

  .journalit-home-setups__chip-list {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .journalit-home-setups__chip-list--compact {
    margin-top: -2px;
  }

  .journalit-home-setups__chip {
    padding: 4px 8px;
    font-size: 11px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .journalit-home-setups__chip--active {
    border-color: var(--interactive-accent);
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .journalit-home-setups__skeleton-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    min-height: 0;
  }

  .journalit-home-setups__skeleton-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .journalit-home-setups__skeleton-name {
    width: 80px;
    flex-shrink: 0;
  }

  .journalit-home-setups__skeleton-bar {
    flex: 1;
    min-width: 0;
  }

  .journalit-home-setups__skeleton-pnl {
    width: 60px;
    flex-shrink: 0;
  }

  .journalit-home-setups__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-home-setups__empty-message {
    font-size: 13px;
    color: var(--text-muted);
  }

  .journalit-home-setups__list {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    min-height: 0;
  }

  .journalit-home-setups__row {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .journalit-home-setups__name {
    font-size: 12px;
    font-weight: 400;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 80px;
    flex-shrink: 0;
  }

  .journalit-home-setups__bar {
    flex: 1;
    height: 8px;
    min-width: 0;
  }

  .journalit-home-setups__bar-fill {
    width: var(--journalit-home-setups-row-bar-width, 0%);
    height: 100%;
    border-radius: 4px;
    background-color: var(--journalit-home-setups-row-color, var(--text-normal));
    opacity: var(--journalit-home-setups-row-bar-opacity, 1);
    transition: width 0.3s ease;
  }

  .journalit-home-setups__pnl {
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
    min-width: 60px;
    text-align: right;
    color: var(--journalit-home-setups-row-color, var(--text-normal));
  }

  .journalit-home-setups__tooltip {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    line-height: 1.35;
  }

  .journalit-home-setups__tooltip-text {
    color: var(--text-normal);
  }

  .journalit-home-setups__tooltip-separator {
    color: var(--text-muted);
    margin: 0 6px;
  }

  
  .journalit-home-account-progress {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 8px;
  }

  .journalit-home-account-progress__list {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow: hidden;
  }

  .journalit-home-account-progress__row {
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
  }

  .journalit-home-account-progress__row-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .journalit-account-progress-name {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 400;
    transition: font-weight 0.1s ease, color 0.1s ease;
  }

  .journalit-account-progress-row:hover .journalit-account-progress-name {
    font-weight: 500;
    color: var(--text-normal);
  }

  .journalit-home-account-progress__percentage {
    font-size: 15px;
    font-weight: 600;
    text-transform: none;
    letter-spacing: normal;
    color: var(--journalit-home-account-progress-color, var(--text-normal));
  }

  .journalit-home-account-progress__percentage--breached {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-error);
  }

  .journalit-home-account-progress__percentage--achieved {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-green);
  }

  .journalit-home-account-progress__bar {
    display: block;
  }

  .journalit-home-account-progress__remaining {
    font-size: 11px;
    color: var(--text-faint);
  }

  .journalit-home-account-progress__loading-list {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow: hidden;
  }

  .journalit-home-account-progress__loading-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .journalit-home-account-progress__state {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .journalit-home-account-progress__state-title {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-faint);
    text-transform: uppercase;
  }

  .journalit-home-account-progress__state-message {
    font-size: 13px;
    color: var(--text-muted);
  }

  .journalit-home-account-progress__state-icon {
    color: var(--text-muted);
    opacity: 0.5;
  }
`;
