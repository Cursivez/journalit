



export const SHARED_COMPONENT_STYLES = `
  .journalit-obsidian-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-size, auto);
    height: var(--icon-size, auto);
    line-height: 0;
    flex: 0 0 auto;
    vertical-align: middle;
  }

  .journalit-obsidian-icon svg {
    display: block;
  }

  
  .journalit-shared-selector-overlay {
    position: fixed !important;
    inset: 0 !important;
    background-color: rgba(0, 0, 0, 0.4) !important;
    z-index: 100010 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding-bottom: 10vh !important;
  }

  .journalit-shared-selector-modal {
    width: 100% !important;
    max-width: 380px !important;
    max-height: 75vh !important;
    background-color: var(--background-primary) !important;
    border-radius: 8px !important;
    border: 1px solid var(--background-modifier-border) !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
    display: flex !important;
    flex-direction: column !important;
  }

  .journalit-shared-selector-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 12px 16px !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    flex-shrink: 0 !important;
  }

  .journalit-shared-selector-title {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
  }

  .journalit-shared-selector-close {
    background: none !important;
    border: none !important;
    padding: 4px !important;
    cursor: pointer !important;
    color: var(--text-muted) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 4px !important;
  }

  .journalit-shared-selector-content {
    flex: 1 1 auto !important;
    overflow-y: auto !important;
    padding: 8px 0 !important;
    min-height: 0 !important;
  }

  .journalit-shared-selector-section {
    padding: 4px 16px 8px !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    color: var(--text-faint) !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
  }

  .journalit-shared-selector-section--spaced {
    padding: 16px 16px 8px !important;
  }

  .journalit-shared-selector-item {
    display: flex !important;
    align-items: flex-start !important;
    gap: 12px !important;
    padding: 10px 16px !important;
    cursor: pointer !important;
    background-color: transparent !important;
  }

  .journalit-shared-selector-item--selected {
    background-color: var(--background-secondary) !important;
  }

  .journalit-shared-selector-icon {
    width: 20px !important;
    height: 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    margin-top: 1px !important;
    color: var(--text-muted) !important;
  }

  .journalit-shared-selector-body {
    flex: 1 !important;
    min-width: 0 !important;
  }

  .journalit-shared-selector-item-title {
    font-size: 13px !important;
    font-weight: 500 !important;
    color: var(--text-normal) !important;
    margin-bottom: 2px !important;
  }

  .journalit-shared-selector-item-description {
    font-size: 12px !important;
    color: var(--text-muted) !important;
    line-height: 1.3 !important;
  }

  .journalit-shared-selector-empty {
    padding: 24px 16px !important;
    text-align: center !important;
    color: var(--text-muted) !important;
    font-size: 13px !important;
  }

  .journalit-shared-selector-footer {
    padding: 8px 12px !important;
    border-top: 1px solid var(--background-modifier-border) !important;
    font-size: 11px !important;
    color: var(--text-faint) !important;
    display: flex !important;
    gap: 12px !important;
    flex-shrink: 0 !important;
  }

  .journalit-shared-selector-widget-category {
    color: var(--text-faint);
    font-size: 11px;
    margin-left: 6px;
  }

  .journalit-privacy-mask,
  .journalit-display-value.journalit-privacy-mask {
    color: var(--text-muted) !important;
    font-family: var(--font-interface);
    font-size: 0.8125rem !important;
    font-weight: 600;
    letter-spacing: 0.08em;
    line-height: inherit;
    white-space: nowrap;
  }

  .journalit-display-value {
    font-variant-numeric: tabular-nums;
  }

  .journalit-display-value--positive {
    color: var(--text-success, var(--color-green));
  }

  .journalit-display-value--negative {
    color: var(--text-error, var(--color-red));
  }

  .journalit-display-value--neutral {
    color: var(--text-muted);
  }

  
  .review-base-container {
    padding: 0 !important;
    margin: 0 !important;
  }

  
  .drc-navigation, .weekly-review-navigation, .daily-report-card-navigation, .shared-navigation {
    width: 100%;
    padding-top: 10px;
    border-top: 1px solid var(--background-modifier-border-subtle, rgba(127, 127, 127, 0.1));
  }
  
  .drc-navigation-links, .weekly-review-navigation-links, .daily-report-card-navigation-links, .shared-navigation-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    width: 100%;
  }
  
  .drc-navigation-button, .weekly-review-navigation-button, .daily-report-card-navigation-button, .shared-navigation-button {
    padding: 8px 14px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex: 1;
    text-align: center;
    min-width: 120px;
    box-sizing: border-box;
  }
  
  .drc-navigation-button:hover, .weekly-review-navigation-button:hover, .daily-report-card-navigation-button:hover, .shared-navigation-button:hover {
    background-color: var(--background-modifier-hover);
  }
  
  .drc-navigation-button:disabled, .weekly-review-navigation-button:disabled, .daily-report-card-navigation-button:disabled, .shared-navigation-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .journalit-nav-icon {
    font-size: 14px;
    line-height: 1;
  }

  .journalit-support-actions__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .journalit-support-actions__button-content {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .journalit-support-actions__help {
    margin-top: 8px;
    font-size: 12px;
    color: var(--text-muted);
  }

  .journalit-support-actions__help-content {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .journalit-support-actions__help-icon {
    color: var(--text-faint);
  }

  
  .shared-goal-tracker h3 {
    font-size: 1rem !important;
    margin-top: 1rem !important;
    margin-bottom: 0.75rem !important;
    text-align: center !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    padding-bottom: 0.5rem !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
  }

  
  .weekly-review-previous-goals h3,
  .weekly-review-preparation .weekly-review-section h3 {
    font-size: 1rem !important;
    margin-top: 1rem !important;
    margin-bottom: 0.75rem !important;
    text-align: center !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    padding-bottom: 0.5rem !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
  }

  .shared-goal-tracker-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.5rem !important;
    margin-top: 0.75rem !important;
    padding: 0.5rem !important;
    background-color: var(--background-secondary) !important;
    border-radius: 4px !important;
  }

  .shared-goal-item {
    display: flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
    padding: 0.5rem !important;
    background-color: var(--background-primary) !important;
    border-radius: 4px !important;
    border: 1px solid var(--background-modifier-border) !important;
    cursor: pointer !important;
  }

  .shared-goal-item:hover {
    background-color: var(--background-modifier-hover) !important;
  }

  .shared-goal-checkbox {
    margin: 0 !important;
  }

  .shared-goal-text {
    flex: 1 !important;
    font-size: 0.95rem !important;
  }

  .shared-goal-text.completed {
    text-decoration: line-through !important;
    opacity: 0.7 !important;
    color: var(--text-muted) !important;
  }
  
  
.journalit-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  background-color: var(--background-secondary);
  border-radius: 8px;
  min-height: 160px;
  width: 100%;
  height: 100%; 
  color: var(--text-muted);
  animation: fadeIn 0.3s ease-out;
  margin: 0 auto; 
}

.journalit-empty-state-icon {
  margin-bottom: 16px;
  opacity: 0.6;
  color: var(--text-muted);
  display: flex; 
  justify-content: center; 
}

.journalit-empty-state-content {
  max-width: 280px;
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
}

  .journalit-empty-state-message {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 8px 0;
    color: var(--text-normal);
  }

  .journalit-empty-state-submessage {
    font-size: 13px;
    opacity: 0.8;
    margin: 0 0 16px 0;
    color: var(--text-muted);
  }
  
  .journalit-empty-state-action-button {
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent) !important;
    border: none !important;
    border-radius: 6px !important;
    padding: 0 16px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    margin-top: 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 120px !important;
    height: 36px !important;
    line-height: 1 !important;
  }
  
  .journalit-empty-state-action-button:hover {
    background-color: var(--interactive-accent-hover) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
  }

  .journalit-empty-state-action-icon {
    margin-right: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  
  .journalit-chart-container .journalit-empty-state {
    background-color: transparent;
    border: 1px dashed var(--background-modifier-border);
  }

  
  .journalit-table-container .journalit-empty-state {
    min-height: 120px;
    padding: 16px;
  }

  
  @media (max-width: 768px) {
    .journalit-empty-state {
      padding: 16px;
      min-height: 140px;
    }
    
    .journalit-empty-state-icon {
      margin-bottom: 12px;
    }
    
    .journalit-empty-state-message {
      font-size: 14px;
    }
  }

  
  .review-button-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
  }

  .review-button {
    min-width: 140px;
  }

  .review-timestamp {
    font-size: 0.85em;
    color: var(--text-muted);
    font-style: italic;
  }

  
  .drc-eod-review-button-section,
  .weekly-review-mark-reviewed-section,
  .monthly-review-mark-reviewed-section,
  .trade-note-review-section {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--background-modifier-border);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  
  .drc-eod-review-button-section .review-button-container,
  .weekly-review-mark-reviewed-section .review-button-container,
  .monthly-review-mark-reviewed-section .review-button-container,
  .trade-note-review-section .review-button-container {
    margin-top: 0;
  }

  
  .journalit-loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px;
  }
  
  
  .journalit-loading-spinner .journalit-spinner-icon::before,
  .journalit-loading-spinner .journalit-spinner-icon::after {
    display: none !important;
  }

  .journalit-loading-spinner.small {
    padding: 8px;
    gap: 8px;
  }

  .journalit-loading-spinner.large {
    padding: 24px;
    gap: 16px;
  }

  .journalit-loading-spinner .journalit-spinner-icon {
    border: 2px solid var(--background-modifier-border);
    border-top-color: var(--interactive-accent);
    border-radius: 50%;
    animation: journalit-spin 0.6s linear infinite;
    flex-shrink: 0;
    
    min-width: var(--spinner-size, 24px);
    min-height: var(--spinner-size, 24px);
    max-width: var(--spinner-size, 24px);
    max-height: var(--spinner-size, 24px);
  }

  .journalit-loading-spinner .loading-message {
    color: var(--text-muted);
    font-size: 14px;
  }

  .journalit-loading-spinner.small .loading-message {
    font-size: 12px;
  }

  .journalit-loading-spinner.large .loading-message {
    font-size: 16px;
  }

  
  .journalit-loading-fullscreen {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 200px;
  }

  
  .journalit-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.02);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
  }

  .journalit-loading-overlay-content {
    padding: 8px 16px;
    background-color: var(--background-primary);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  
  @keyframes journalit-spin {
    to { transform: rotate(360deg); }
  }

  
  .journalit-u-flex {
    display: flex;
  }

  .journalit-u-inline-flex {
    display: inline-flex;
  }

  .journalit-u-flex-row {
    display: flex;
    flex-direction: row;
  }

  .journalit-u-flex-col {
    display: flex;
    flex-direction: column;
  }

  .journalit-u-flex-wrap {
    flex-wrap: wrap;
  }

  .journalit-u-flex-1 {
    flex: 1;
  }

  .journalit-u-items-center {
    align-items: center;
  }

  .journalit-u-items-start {
    align-items: flex-start;
  }

  .journalit-u-items-end {
    align-items: flex-end;
  }

  .journalit-u-items-stretch {
    align-items: stretch;
  }

  .journalit-u-justify-center {
    justify-content: center;
  }

  .journalit-u-justify-between {
    justify-content: space-between;
  }

  .journalit-u-justify-start {
    justify-content: flex-start;
  }

  .journalit-u-justify-end {
    justify-content: flex-end;
  }

  .journalit-u-gap-2 {
    gap: 2px;
  }

  .journalit-u-gap-4 {
    gap: 4px;
  }

  .journalit-u-gap-6 {
    gap: 6px;
  }

  .journalit-u-gap-8 {
    gap: 8px;
  }

  .journalit-u-gap-10 {
    gap: 10px;
  }

  .journalit-u-gap-12 {
    gap: 12px;
  }

  .journalit-u-gap-14 {
    gap: 14px;
  }

  .journalit-u-gap-15 {
    gap: 15px;
  }

  .journalit-u-gap-16 {
    gap: 16px;
  }

  .journalit-u-gap-20 {
    gap: 20px;
  }

  .journalit-u-w-full {
    width: 100%;
  }

  .journalit-u-h-full {
    height: 100%;
  }

  .journalit-u-max-w-full {
    max-width: 100%;
  }

  .journalit-u-max-h-full {
    max-height: 100%;
  }

  .journalit-u-overflow-visible {
    overflow: visible;
  }

  .journalit-u-overflow-auto {
    overflow: auto;
  }

  .journalit-u-overflow-hidden {
    overflow: hidden;
  }

  .journalit-u-text-center {
    text-align: center;
  }

  .journalit-u-text-left {
    text-align: left;
  }

  .journalit-u-text-right {
    text-align: right;
  }

  .journalit-u-text-muted {
    color: var(--text-muted);
  }

  .journalit-u-text-faint {
    color: var(--text-faint);
  }

  .journalit-u-text-normal {
    color: var(--text-normal);
  }

  .journalit-u-text-success {
    color: var(--text-success);
  }

  .journalit-u-text-error {
    color: var(--text-error);
  }

  .journalit-u-text-warning {
    color: var(--text-warning);
  }

  .journalit-u-text-accent {
    color: var(--interactive-accent);
  }

  .journalit-u-font-italic {
    font-style: italic;
  }

  .journalit-u-font-medium {
    font-weight: 500;
  }

  .journalit-u-font-semibold {
    font-weight: 600;
  }

  .journalit-u-border {
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-u-border-top {
    border-top: 1px solid var(--background-modifier-border);
  }

  .journalit-u-border-bottom {
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-u-rounded-sm {
    border-radius: 2px;
  }

  .journalit-u-rounded-md {
    border-radius: 4px;
  }

  .journalit-u-rounded-lg {
    border-radius: 8px;
  }

  .journalit-u-bg-primary {
    background-color: var(--background-primary);
  }

  .journalit-u-bg-secondary {
    background-color: var(--background-secondary);
  }

  .journalit-u-bg-hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-u-mt-4 {
    margin-top: 4px;
  }

  .journalit-u-mt-6 {
    margin-top: 6px;
  }

  .journalit-u-mt-8 {
    margin-top: 8px;
  }

  .journalit-u-mt-10 {
    margin-top: 10px;
  }

  .journalit-u-mt-12 {
    margin-top: 12px;
  }

  .journalit-u-mt-16 {
    margin-top: 16px;
  }

  .journalit-u-mt-20 {
    margin-top: 20px;
  }

  .journalit-u-mt-24 {
    margin-top: 24px;
  }

  .journalit-u-mt-32 {
    margin-top: 32px;
  }

  .journalit-u-mb-4 {
    margin-bottom: 4px;
  }

  .journalit-u-mb-6 {
    margin-bottom: 6px;
  }

  .journalit-u-mb-8 {
    margin-bottom: 8px;
  }

  .journalit-u-mb-10 {
    margin-bottom: 10px;
  }

  .journalit-u-mb-12 {
    margin-bottom: 12px;
  }

  .journalit-u-mb-14 {
    margin-bottom: 14px;
  }

  .journalit-u-mb-15 {
    margin-bottom: 15px;
  }

  .journalit-u-mb-16 {
    margin-bottom: 16px;
  }

  .journalit-u-mb-20 {
    margin-bottom: 20px;
  }

  .journalit-u-mb-24 {
    margin-bottom: 24px;
  }

  .journalit-u-ml-4 {
    margin-left: 4px;
  }

  .journalit-u-ml-6 {
    margin-left: 6px;
  }

  .journalit-u-ml-8 {
    margin-left: 8px;
  }

  .journalit-u-ml-12 {
    margin-left: 12px;
  }

  .journalit-u-ml-16 {
    margin-left: 16px;
  }

  .journalit-u-mr-4 {
    margin-right: 4px;
  }

  .journalit-u-mr-6 {
    margin-right: 6px;
  }

  .journalit-u-mr-8 {
    margin-right: 8px;
  }

  .journalit-u-mr-10 {
    margin-right: 10px;
  }

  .journalit-u-mr-15 {
    margin-right: 15px;
  }

  .journalit-u-p-2 {
    padding: 2px;
  }

  .journalit-u-p-4 {
    padding: 4px;
  }

  .journalit-u-p-6 {
    padding: 6px;
  }

  .journalit-u-p-8 {
    padding: 8px;
  }

  .journalit-u-p-10 {
    padding: 10px;
  }

  .journalit-u-p-12 {
    padding: 12px;
  }

  .journalit-u-p-14 {
    padding: 14px;
  }

  .journalit-u-p-15 {
    padding: 15px;
  }

  .journalit-u-p-16 {
    padding: 16px;
  }

  .journalit-u-p-20 {
    padding: 20px;
  }

  .journalit-u-px-4 {
    padding-left: 4px;
    padding-right: 4px;
  }

  .journalit-u-px-6 {
    padding-left: 6px;
    padding-right: 6px;
  }

  .journalit-u-px-8 {
    padding-left: 8px;
    padding-right: 8px;
  }

  .journalit-u-px-10 {
    padding-left: 10px;
    padding-right: 10px;
  }

  .journalit-u-px-12 {
    padding-left: 12px;
    padding-right: 12px;
  }

  .journalit-u-px-16 {
    padding-left: 16px;
    padding-right: 16px;
  }

  .journalit-u-py-4 {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .journalit-u-py-6 {
    padding-top: 6px;
    padding-bottom: 6px;
  }

  .journalit-u-py-8 {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .journalit-u-py-10 {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .journalit-u-py-12 {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .journalit-u-py-16 {
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .journalit-external-link-button {
    background: var(--background-secondary);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
  }

  .journalit-external-link-button:hover {
    background: var(--background-modifier-hover);
  }

  .journalit-external-link-button__icon {
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  
  .journalit-fast-datetime {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .journalit-fast-datetime__label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-normal);
    margin-bottom: 2px;
  }

  .journalit-fast-datetime__required {
    color: var(--text-error);
    margin-left: 2px;
  }

  .journalit-fast-datetime__container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: 4px;
    padding: 6px 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background: var(--background-primary);
    width: 100%;
    box-sizing: border-box;
    position: static;
  }

  .journalit-fast-datetime__container[data-date-only="true"] {
    justify-content: flex-start;
    position: relative;
  }

  .journalit-fast-datetime__container[data-has-error="true"] {
    border-color: var(--text-error);
  }

  .journalit-fast-datetime__segment {
    width: 42px;
    min-width: 42px;
    max-width: 42px;
    padding: 6px 4px;
    text-align: center;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    color: var(--text-normal);
    font-size: 14px;
    box-sizing: border-box;
    flex-shrink: 0;
    flex-grow: 0;
  }

  .journalit-fast-datetime__separator {
    color: var(--text-muted);
    padding: 0 1px;
    user-select: none;
    flex: 0 0 auto;
  }

  .journalit-fast-datetime__separator--spacer {
    padding: 0 8px;
  }

  .journalit-fast-datetime__ampm-button {
    margin-left: 4px;
    padding: 6px 8px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-secondary);
    color: var(--text-normal);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    min-width: 36px;
    flex-shrink: 0;
  }

  .journalit-fast-datetime__ampm-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .journalit-fast-datetime__calendar-button {
    padding: 4px;
    background: none;
    border: none;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    flex: 0 0 auto;
  }

  .journalit-fast-datetime__calendar-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .journalit-fast-datetime__container[data-date-only="true"] .journalit-fast-datetime__calendar-button {
    position: static;
    margin-left: 8px;
  }

  .journalit-fast-datetime__container[data-date-only="false"] .journalit-fast-datetime__calendar-button {
    margin-left: auto;
  }

  .journalit-account-date-input .journalit-fast-datetime__container[data-date-only="true"] {
    justify-content: center;
  }

  .journalit-fast-datetime__error {
    color: var(--text-error);
    font-size: 12px;
  }

  
  .lazy-image-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .lazy-image-placeholder,
  .lazy-image-error {
    width: 100%;
    height: 100%;
  }

  .lazy-image-placeholder-inner,
  .lazy-image-error-inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .lazy-image-placeholder-inner {
    background-color: var(--background-modifier-border);
    color: var(--text-muted);
  }

  .lazy-image-error-inner {
    background-color: var(--background-modifier-error);
    color: var(--text-error);
  }

  .lazy-image-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-width: none !important;
    height: 100%;
    max-height: none !important;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .lazy-image-img.is-loaded {
    opacity: 1;
  }

  
  .jl-checkbox-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    user-select: none;
  }

  .jl-checkbox-wrapper[data-disabled="false"] {
    cursor: pointer;
    opacity: 1;
  }

  .jl-checkbox-wrapper[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .jl-checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
  }

  .jl-checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: inherit;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-normal);
  }

  .jl-checkbox-wrapper[data-disabled="true"] .jl-checkbox-label {
    color: var(--text-muted);
  }

  .jl-checkbox-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 3px;
    background-color: var(--background-primary);
    transition: background-color 0.2s ease, border-color 0.2s ease;
    flex-shrink: 0;
  }

  .jl-checkbox-box[data-checked="true"] {
    background-color: var(--interactive-accent);
    border-color: var(--interactive-accent);
  }

  .jl-checkbox-check {
    color: var(--text-on-accent);
    display: block;
    pointer-events: none;
  }

  .jl-checkbox-text {
    font-size: 13px;
    font-weight: 500;
    color: inherit;
  }

  .journalit-toolbar-icon-button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    gap: 4px !important;
    height: 28px !important;
    padding: 5px 10px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    line-height: 1 !important;
    white-space: nowrap !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
  }

  .journalit-toolbar-icon-button:hover:not(:disabled) {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
  }

  .journalit-toolbar-icon-button:disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
  }

  
  .tooltip-trigger--block {
    display: block;
    width: 100%;
  }

  .tooltip-trigger--inline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .journalit-tooltip {
    position: fixed;
    top: var(--journalit-tooltip-top, -9999px);
    left: var(--journalit-tooltip-left, -9999px);
    z-index: 9999;
    opacity: 0;
    transition: opacity 150ms ease-in-out;
    pointer-events: none;

    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 8px 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    max-width: 280px;
    font-size: 13px;
    color: var(--text-normal);
  }

  .journalit-tooltip--visible {
    opacity: 1;
  }

  
  .journalit-skeleton-text-multi {
    display: flex;
    flex-direction: column;
    gap: var(--journalit-skeleton-text-gap, 8px);
    width: var(--journalit-skeleton-text-width, 100%);
  }

  
  .metric-card-skeleton {
    flex: 1 1 180px;
    min-width: 180px;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .metric-card-skeleton-label {
    margin-bottom: 6px;
  }

  
  .segmented-control {
    display: inline-flex;
    align-items: center;
    gap: var(--journalit-seg-gap, 2px);
    padding: var(--journalit-seg-container-padding, 3px);
    background: var(--background-secondary);
    border-radius: var(--journalit-seg-radius, 8px);
    border: 1px solid var(--background-modifier-border);
    width: auto;
  }

  .segmented-control[data-full-width="true"] {
    width: 100%;
  }

  .segmented-control-option {
    flex: none;
    padding: var(--journalit-seg-option-padding, 6px 14px);
    font-size: var(--journalit-seg-option-font-size, 13px);
    font-weight: 500;
    border: none;
    border-radius: calc(var(--journalit-seg-radius, 8px) - 2px);
    cursor: pointer;
    transition: all 150ms ease;
    background: transparent;
    color: var(--text-muted);
    box-shadow: none;
  }

  .segmented-control[data-full-width="true"] .segmented-control-option {
    flex: 1;
  }

  .segmented-control-option.is-active {
    background: var(--background-primary);
    color: var(--text-normal);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .segmented-control-option:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  
  .journalit-select[data-has-value="false"] {
    color: var(--text-muted);
    opacity: 0.7;
  }

  .journalit-select[data-has-value="true"] {
    color: var(--text-normal);
    opacity: 1;
  }

  .journalit-select option.select-placeholder {
    color: var(--text-muted);
    opacity: 0.7;
  }

  .journalit-select option:not(.select-placeholder):not(:disabled),
  .journalit-select option:checked {
    color: var(--text-normal);
    opacity: 1;
  }
`;
