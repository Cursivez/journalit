



export const TRADE_NOTE_STYLES = `
  

  
  .journalit-trade-view,
  .trade-form-view-container .journalit-trade-view {
    margin-top: 0;
    margin-bottom: var(--size-4-12, 3rem);
    border-bottom: none;
    padding: 0;
    display: block !important;
    width: 100% !important;
    z-index: 1;
    
    position: relative;
    box-sizing: border-box;
    
    contain: content;
    
    isolation: isolate;
  }
  
  
  .journalit-trade-note-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    contain: content;
    
    isolation: isolate;
    
    position: relative;
    
    box-sizing: border-box;
  }

  
  .markdown-source-view.is-live-preview.is-readable-line-width .journalit-trade-view {
    max-width: var(--file-line-width, 700px);
    margin-left: auto;
    margin-right: auto;
  }

  
  .markdown-reading-view > .journalit-trade-view[data-mode="reading"],
  .markdown-preview-view.is-readable-line-width > .journalit-trade-view[data-mode="reading"] {
    max-width: var(--file-line-width, 700px);
    margin-left: auto;
    margin-right: auto;
  }

  .markdown-reading-view.journalit-trade-note-reading-view {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
  }

  .markdown-reading-view.journalit-trade-note-reading-view > .markdown-preview-view {
    margin-top: var(--size-4-8, 2rem);
    height: auto;
    min-height: 0;
    overflow: visible;
    contain: none;
  }

  .markdown-reading-view.journalit-trade-note-reading-view > .markdown-preview-view .markdown-preview-sizer {
    min-height: 0 !important;
    padding-bottom: var(--size-4-8, 2rem);
  }

  .markdown-source-view.is-live-preview.is-readable-line-width .journalit-trade-view[data-mode="source"] {
    max-width: var(--file-line-width, 700px);
    margin-left: auto;
    margin-right: auto;
  }

  
  .journalit-trade-view[data-mode="export"] {
    margin-bottom: var(--size-4-4, 1rem);
  }

  .journalit-trade-view[data-mode="export"] .trade-navigation-with-edit,
  .journalit-trade-view[data-mode="export"] .trade-note-loading-placeholder,
  .journalit-trade-view[data-mode="export"] .trade-note-review-section,
  .journalit-trade-view[data-mode="export"] button {
    display: none;
  }

  @media print {
    .journalit-trade-view .trade-navigation-with-edit,
    .journalit-trade-view .trade-note-loading-placeholder,
    .journalit-trade-view .trade-note-review-section,
    .journalit-trade-view button {
      display: none;
    }
  }

  .journalit-trade-view .trade-note-review-section {
    margin-top: 0.75rem;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0.25rem;
    border-top: 0;
    display: grid;
    grid-template-columns: minmax(2rem, 1fr) auto minmax(2rem, 1fr);
    align-items: start;
    gap: 0.75rem;
  }

  .journalit-trade-view .trade-note-review-section::before,
  .journalit-trade-view .trade-note-review-section::after {
    content: '';
    display: block;
    height: 1px;
    min-width: 2rem;
    margin-top: 15px;
    background: var(--background-modifier-border);
  }

  .journalit-trade-view .trade-note-review-control {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .journalit-trade-view .trade-note-review-section .journalit-weekly-drc-mark-reviewed-button {
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    min-height: 30px;
    padding: 1px 0.7rem 0;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    background: transparent !important;
    color: var(--text-muted);
    box-shadow: none !important;
    font-size: 0.78rem;
    font-weight: 500;
    line-height: 1;
    cursor: pointer !important;
    transition: border-color 150ms ease-out, color 150ms ease-out, background-color 150ms ease-out;
  }

  .journalit-trade-view .trade-note-review-section .journalit-weekly-drc-mark-reviewed-button:hover:not(:disabled),
  .journalit-trade-view .trade-note-review-section .journalit-weekly-drc-mark-reviewed-button:focus-visible:not(:disabled) {
    border-color: var(--interactive-accent);
    background: var(--background-secondary) !important;
    color: var(--text-normal);
  }

  .journalit-trade-view .trade-note-review-section .journalit-weekly-drc-mark-reviewed-button--reviewed,
  .journalit-trade-view .trade-note-review-section .journalit-weekly-drc-mark-reviewed-button--reviewed:hover:not(:disabled),
  .journalit-trade-view .trade-note-review-section .journalit-weekly-drc-mark-reviewed-button--reviewed:focus-visible:not(:disabled) {
    border-color: var(--color-green);
    color: var(--color-green);
    background: transparent !important;
  }

  .journalit-trade-view .trade-note-review-section .journalit-weekly-drc-mark-reviewed-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border: 1.5px solid currentColor;
    border-radius: 999px;
    flex: 0 0 auto;
    position: relative;
    top: -1px;
  }

  .journalit-trade-view .trade-note-review-section .journalit-weekly-drc-mark-reviewed-icon--reviewed {
    background: var(--color-green);
    border-color: var(--color-green);
    color: var(--background-primary);
  }

  .journalit-trade-view .trade-note-review-section .journalit-weekly-drc-mark-reviewed-icon > svg {
    width: 10px;
    height: 10px;
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .journalit-trade-view .trade-note-reviewed-timestamp {
    color: var(--text-muted);
    font-size: 0.85rem;
    font-style: italic;
    line-height: 1.2;
    text-align: center;
    white-space: nowrap;
  }
  
  .trade-note-container {
    background-color: var(--background-primary);
    border-radius: var(--border-radius-lg, 8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin: 0;
    overflow: hidden;
    position: relative;
    font-family: var(--font-interface);
    
    
    isolation: isolate;
    
    contain: layout style paint;
    
    width: 100%;
    align-self: flex-start;
    
    transition: box-shadow 0.2s ease-in-out;
  }

  .trade-note-loading-placeholder {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trade-note-loading-text {
    color: var(--text-muted);
    font-size: 12px;
  }
  
  
  .trade-note-header {
    min-height: 98px;
    padding: 0.6rem 0 0.65rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 0.35rem;
    border-bottom: 0;
    background: transparent;
  }
  
  .trade-note-header.profit {
    background: transparent;
  }

  .trade-note-header.loss {
    background: transparent;
  }

  .trade-note-header.open {
    background: transparent;
  }

  .trade-note-header.breakeven {
    background: transparent;
  }

  .trade-note-header.privacy-masked {
    background: transparent;
  }

  .journalit-trade-view .trade-header-main-row,
  .journalit-trade-view .trade-header-context-row {
    display: flex;
    justify-content: space-between;
    min-width: 0;
  }

  .journalit-trade-view .trade-header-main-row {
    align-items: flex-end;
    gap: 1.25rem;
  }

  .journalit-trade-view .trade-header-context-row {
    align-items: center;
    gap: 1rem;
    margin-top: 0;
  }

  .journalit-trade-view .trade-header-actions {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .journalit-trade-view .trade-header-primary {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .journalit-trade-view .trade-instrument {
    color: var(--text-normal);
    white-space: nowrap;
    margin-left: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .journalit-trade-view .trade-instrument-mainline {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-top: 0.08rem;
  }

  .journalit-trade-view .trade-instrument-stack {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .journalit-trade-view .trade-instrument-title-row {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
  }

  .journalit-trade-view .trade-instrument-symbol {
    font-size: clamp(2.25rem, 4.6vw, 3.35rem);
    line-height: 0.95;
    font-weight: 750;
    letter-spacing: -0.055em;
    margin-left: -0.055em;
  }

  .journalit-trade-view .trade-instrument-direction {
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.045em;
    line-height: 1;
    margin-left: 0;
    margin-bottom: -0.24rem;
    text-transform: uppercase;
  }

  .journalit-trade-view .trade-type-badge {
    align-self: flex-start;
    margin-left: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    color: var(--text-muted);
    background: transparent;
    font-size: 0.74rem;
    font-weight: 600;
    letter-spacing: 0.045em;
    line-height: 1;
    margin-top: -0.18rem;
    text-transform: uppercase;
  }

  .journalit-trade-view .trade-type-badge--missed {
    color: var(--color-orange, #ff9800);
  }

  .journalit-trade-view .trade-type-badge--backtest {
    color: var(--color-purple, #6f42c1);
  }

  .journalit-trade-view .trade-type-badge--open {
    color: var(--status-open-color, #2196f3);
  }

  .journalit-trade-view .trade-header-review-indicator {
    display: inline-flex;
    align-items: center;
    margin-left: 0;
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.15s ease;
  }

  .journalit-trade-view .trade-header-review-indicator:hover {
    opacity: 0.7;
  }

  .journalit-trade-view .trade-header-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .journalit-trade-view .trade-header-meta {
    color: var(--text-muted);
    font-size: 0.95rem;
    font-weight: 500;
    min-width: 0;
  }

  .journalit-trade-view .trade-header-context-link {
    color: var(--text-accent);
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  .journalit-trade-view .trade-header-context-link:hover,
  .journalit-trade-view .trade-header-context-link:focus-visible {
    opacity: 0.8;
    text-decoration: underline;
  }

  .journalit-trade-view .trade-header-context-link:focus-visible {
    outline: 2px solid var(--background-modifier-border-focus, var(--interactive-accent));
    outline-offset: 2px;
    border-radius: 3px;
  }

  .journalit-trade-view .trade-header-ordinal-suffix {
    font-size: 0.68em;
    line-height: 1;
    vertical-align: super;
  }

  .journalit-trade-view .trade-header-context-separator {
    margin: 0 0.5rem;
    color: var(--text-faint);
  }

  
  .trade-edit-button {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background-color: var(--interactive-accent);
    color: var(--text-on-accent, white);
    border: none;
    border-radius: 4px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .trade-edit-button:hover {
    background-color: var(--interactive-accent-hover, var(--interactive-accent));
    opacity: 0.9;
  }
  
  .trade-edit-button svg {
    width: 14px;
    height: 14px;
  }

  .trade-note-header .trade-pnl {
    display: flex;
    align-items: baseline;
    gap: 0.65rem;
    margin-bottom: -0.12rem;
    font-size: clamp(1.55rem, 3.1vw, 2.1rem);
    font-weight: 600;
    line-height: 1;
    text-align: right;
    white-space: nowrap;
  }

  .trade-note-header .trade-pnl-label {
    color: var(--text-muted);
    font-size: 0.95rem;
    font-weight: 500;
  }

  .trade-note-header .trade-pnl-primary {
    display: inline-flex;
    align-items: baseline;
    line-height: 1.05;
    white-space: nowrap;
  }

  .trade-note-header .trade-pnl-cents {
    font-size: 0.66em;
    opacity: 0.7;
    font-weight: 500;
    margin-left: 1px;
  }

  .trade-note-header .trade-pnl-suffix {
    font-size: 0.45em;
    line-height: 1;
    opacity: 0.95;
    font-weight: 500;
    margin-left: 0.25rem;
    color: var(--text-muted);
  }

  .trade-note-header .profit-text,
  .trade-note-header .loss-text,
  .trade-note-header .breakeven-text,
  .trade-note-header .open-text {
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
  }

  .trade-note-header .journalit-header-icon-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    width: auto;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.6rem;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .trade-note-header .journalit-header-icon-button:hover:not(:disabled),
  .trade-note-header .journalit-header-icon-button:focus-visible:not(:disabled) {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .trade-note-header .journalit-header-icon-button:disabled {
    opacity: 0.6;
    cursor: default;
  }
  
  .profit-text {
    color: var(--color-success, #43a047);
  }
  
  .loss-text {
    color: var(--color-error, #e53935);
  }

  .breakeven-text {
    color: var(--text-muted);
  }

  .open-text {
    color: var(--status-open-color, #2196f3);
    font-weight: 600;
  }
  
  
  .missed-trade-badge {
    background-color: var(--color-orange, #ff9800);
    color: var(--text-on-accent, white);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    margin-left: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  
  .open-trade-badge {
    background-color: var(--status-open-color, #2196f3);
    color: var(--text-on-accent, white);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    margin-left: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  
  .backtest-trade-badge {
    background-color: var(--color-purple, #6f42c1);
    color: var(--text-on-accent, white);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    margin-left: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  
  
  
  .trade-note-content {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem; 
  }
  
  
  .trade-overview-section {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    padding: 0;
    position: relative;
    margin-bottom: 0;
  }

  
  .trade-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 0.8rem;
    margin-bottom: 0;
  }

  .trade-metrics-grid > .tooltip-trigger--block {
    display: block;
    min-width: 0;
  }

  .trade-metrics-grid > .tooltip-trigger--block .metric-card {
    height: 100%;
  }
  
  .journalit-trade-view .metric-card {
    background-color: var(--background-primary);
    padding: 0.7rem;
    border-radius: var(--border-radius-md, 4px);
    border: 1px solid var(--background-modifier-border);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }
  
  .journalit-trade-view .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
    border-color: var(--interactive-accent-hover);
  }
  
  .journalit-trade-view .metric-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 0.2rem;
    letter-spacing: 0.5px;
  }
  
  .journalit-trade-view .metric-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-normal);
    margin-bottom: 0.2rem;
    max-width: 100%;
    line-height: 1.2;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  
  .metric-subtitle {
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  .journalit-trade-view .trade-risk-target-strip {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    gap: 0.8rem;
    width: 100%;
  }

  .journalit-trade-view .trade-risk-target-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    min-height: 42px;
    min-width: 0;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--border-radius-md, 6px);
    background: color-mix(
      in srgb,
      var(--background-primary) 82%,
      var(--background-secondary) 18%
    );
  }

  .journalit-trade-view .trade-risk-target-label {
    color: var(--text-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .journalit-trade-view .trade-risk-target-value {
    min-width: 0;
    color: var(--text-normal);
    font-size: 0.95rem;
    font-weight: 700;
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-trade-view .trade-risk-target-meta {
    color: var(--text-muted);
    font-size: 0.72rem;
    white-space: nowrap;
  }

  .journalit-trade-view .trade-execution-summary-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .journalit-trade-view .trade-execution-summary-toggle {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    min-height: 38px;
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--border-radius-md, 6px);
    background: var(--background-primary);
    color: var(--text-normal);
    text-align: left;
  }

  .journalit-trade-view .trade-execution-summary-toggle:hover {
    border-color: var(--interactive-accent-hover);
    background: var(--background-secondary-alt);
  }

  .journalit-trade-view .trade-execution-summary-title {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .journalit-trade-view .trade-execution-summary-counts,
  .journalit-trade-view .trade-execution-summary-action {
    color: var(--text-muted);
    font-size: 0.78rem;
  }

  .journalit-trade-view .trade-execution-summary-counts {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-trade-view .trade-execution-summary-action {
    color: var(--text-accent);
    white-space: nowrap;
  }

  .trade-execution-breakdown {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--border-radius-md, 6px);
    background: var(--background-secondary);
  }

  .trade-execution-breakdown-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    min-width: 0;
  }

  .trade-execution-breakdown-label {
    color: var(--text-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .trade-execution-breakdown-rows {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .trade-execution-breakdown-row {
    display: grid;
    grid-template-columns: 1.5rem max-content max-content;
    gap: 0.65rem;
    align-items: center;
    min-width: 0;
    color: var(--text-normal);
    font-size: 0.78rem;
  }

  .trade-execution-breakdown-row span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trade-execution-breakdown-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.35rem;
    height: 1.35rem;
    border-radius: 999px;
    background: var(--background-modifier-border);
    color: var(--text-muted);
    font-size: 0.68rem;
    font-weight: 700;
  }

  .journalit-trade-view .trade-context-section {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    margin: 0;
  }

  .journalit-trade-view .trade-context-title {
    color: var(--text-normal);
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
  }

  .journalit-trade-view .trade-context-card {
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m, var(--border-radius-lg, 10px));
    padding: 0;
    box-shadow: none;
  }

  .journalit-trade-view .trade-context-row {
    display: grid;
    grid-template-columns: minmax(9.75rem, 0.24fr) minmax(0, 1fr);
    gap: 1rem;
    align-items: center;
    min-height: 3.15rem;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-trade-view .trade-context-row:last-child {
    border-bottom: 0;
  }

  .journalit-trade-view .trade-context-label {
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    font-size: 0.9rem;
    font-weight: 650;
    line-height: 18px;
  }

  .journalit-trade-view .trade-context-icon {
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
    line-height: 0;
  }

  .journalit-trade-view .trade-context-row--setup .trade-context-icon {
    color: rgb(66, 133, 244);
  }

  .journalit-trade-view .trade-context-row--mistake .trade-context-icon {
    color: var(--text-error, var(--color-red, #e53935));
  }

  .journalit-trade-view .trade-context-row--tag .trade-context-icon {
    color: rgb(139, 92, 246);
  }

  .journalit-trade-view .trade-context-values {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.45rem;
    min-width: 0;
  }
  
  .trade-broker-metadata-section {
    margin: 0;
  }

  .trade-broker-metadata-card {
    width: 100%;
  }

  .trade-broker-metadata-value {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-normal);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .journalit-trade-view .tag {
    padding: 0.32rem 0.68rem;
    border-radius: 7px;
    font-size: 0.78rem;
    font-weight: 550;
    display: inline-flex;
    align-items: center;
    line-height: 1.2;
    color: var(--text-normal);
  }

  .journalit-trade-view .trade-context-chip {
    background-color: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    color: var(--text-normal);
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .journalit-trade-view .trade-context-chip--tag {
    background-color: rgba(139, 92, 246, 0.14);
    border-color: rgba(139, 92, 246, 0.34);
    color: rgb(167, 139, 250);
  }
  
  .setup-tag {
    background-color: rgba(66, 133, 244, 0.15);
    color: rgba(66, 133, 244, 1);
    border: 1px solid rgba(66, 133, 244, 0.3);
  }
  
  .mistake-tag {
    background-color: rgba(229, 57, 53, 0.15);
    color: var(--color-error, #e53935);
    border: 1px solid rgba(229, 57, 53, 0.3);
  }

  .journalit-trade-view .trade-context-chip.account-tag {
    appearance: none;
    color: var(--text-normal);
    background-color: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 7px;
    font-size: 0.78rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    line-height: 1.2;
    padding: 0.32rem 0.68rem;
    box-shadow: none;
    height: auto;
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease;
    text-decoration: none;
  }
  
  .journalit-trade-view .trade-context-chip.account-tag:hover {
    border-color: var(--text-accent);
    color: var(--text-accent-hover, var(--text-accent));
  }

  .journalit-trade-view .missed-trade-reason-section {
    background-color: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m, 8px);
    margin: 0;
    padding: 0.85rem 1rem 0.95rem;
  }

  .journalit-trade-view .missed-trade-reason-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.55rem;
  }

  .journalit-trade-view .missed-trade-reason-section h4 {
    color: var(--text-muted);
    font-size: 0.9rem;
    font-weight: 700;
    line-height: 17px;
    margin: 0;
  }

  .journalit-trade-view .missed-trade-reason-title {
    align-items: center;
    color: var(--text-muted);
    display: inline-flex;
    gap: 0.5rem;
    line-height: 17px;
  }

  .journalit-trade-view .missed-trade-reason-title .journalit-obsidian-icon {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    height: 17px;
    justify-content: center;
    line-height: 0;
    width: 17px;
  }

  .journalit-trade-view .missed-trade-reason-content {
    color: var(--text-normal);
    font-size: 0.95rem;
    line-height: 1.7;
    padding-left: calc(17px + 0.5rem);
    white-space: pre-wrap;
  }
  
  
  .trade-notes-preview {
    background-color: var(--background-secondary);
    padding: 1rem;
    border-radius: var(--border-radius-md, 4px);
    margin-top: 1.5rem;
  }
  
  .trade-notes-preview h4 {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
    color: var(--text-normal);
  }
  
  .trade-notes-preview p {
    color: var(--text-normal);
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
  }
  
  
  .trade-details-footer {
    margin-top: 0;
  }
  
  .details-card {
    background-color: var(--background-primary);
    padding: 1rem;
    border-radius: var(--border-radius-md, 6px);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--background-modifier-border);
    margin-bottom: 0;
    transition: box-shadow 0.2s ease;
  }

  .details-card:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  }
  
  .details-card.expanded-details {
    width: 100%;
  }

  .trade-custom-fields-subsection {
    padding: 0.85rem 1rem 0.95rem;
  }

  .journalit-trade-view .trade-custom-fields-toggle {
    align-items: center;
    appearance: none;
    background: transparent;
    background-color: transparent;
    border: 0;
    box-shadow: none;
    color: var(--text-muted);
    cursor: pointer;
    display: inline-flex;
    font-size: 0.82rem;
    font-weight: 650;
    gap: 0.45rem;
    height: auto;
    padding: 0.2rem 0;
  }

  .journalit-trade-view .trade-custom-fields-toggle:hover {
    background: transparent;
    background-color: transparent;
    box-shadow: none;
    color: var(--text-normal);
  }

  .trade-custom-fields-toggle-icon {
    transition: transform 0.16s ease;
  }

  .trade-custom-fields-toggle-icon.is-expanded {
    transform: rotate(180deg);
  }

  .trade-custom-fields-rows {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(1.75rem, 7vw, 4.5rem);
    row-gap: 0.62rem;
    padding: 0;
    width: 100%;
  }

  .trade-custom-field-item {
    align-items: baseline;
    border-bottom: 0;
    column-gap: 1rem;
    display: grid;
    grid-template-columns: minmax(8.25rem, 8.25rem) minmax(0, 1fr);
    min-width: 0;
    padding: 0;
  }

  .trade-custom-field-item:last-child {
    border-bottom: 0;
  }

  .trade-custom-field-label {
    color: var(--text-muted);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: normal;
    margin: 0;
    min-width: 0;
    text-transform: none;
  }

  .trade-custom-field-value,
  .trade-custom-field-text {
    color: var(--text-normal);
    font-size: 0.92rem;
    font-weight: 650;
    line-height: 1.45;
    min-width: 0;
    overflow-wrap: anywhere;
    text-align: left;
    white-space: pre-wrap;
  }

  .trade-custom-field-tooltip-anchor {
    display: flex;
    justify-content: flex-start;
    min-width: 0;
  }

  .journalit-trade-view .trade-custom-fields-show-all {
    align-items: center;
    appearance: none;
    background: transparent;
    background-color: transparent;
    border: 0;
    color: var(--text-accent);
    cursor: pointer;
    display: flex;
    font-size: 0.9rem;
    font-weight: 650;
    gap: 0.45rem;
    justify-content: flex-start;
    min-height: 0;
    margin-top: 0.75rem;
    padding: 0;
    width: auto;
    box-shadow: none;
  }

  .journalit-trade-view .trade-custom-fields-show-all:hover {
    color: var(--text-accent-hover, var(--text-accent));
    background: transparent;
    background-color: transparent;
    box-shadow: none;
  }

  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--background-modifier-border);
  }
  
  .details-card h4 {
    font-size: 1rem;
    margin: 0;
    color: var(--text-normal);
  }
  
  
  .trade-main-content {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .thesis-section {
    background-color: var(--background-primary);
    padding: 0.85rem 1rem 0.95rem;
    border-radius: var(--radius-m, var(--border-radius-lg, 10px));
    box-shadow: none;
    border: 1px solid var(--background-modifier-border);
    margin: 0;
  }

  .thesis-section-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.55rem;
  }

  .thesis-section-title {
    align-items: center;
    color: var(--text-muted);
    display: inline-flex;
    font-size: 0.9rem;
    font-weight: 700;
    gap: 0.5rem;
    line-height: 17px;
  }

  .thesis-section-title .journalit-obsidian-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    height: 17px;
    line-height: 0;
    width: 17px;
  }
  
  .thesis-content {
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-normal);
    padding-left: calc(17px + 0.5rem);
    white-space: pre-wrap;
  }

  .details-card h4 {
    font-size: 0.9rem;
    margin-top: 0;
    margin-bottom: 0.8rem;
    color: var(--text-normal);
    
    padding-bottom: 0;
  }
  
  .details-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  
  .details-table td {
    padding: 0.6rem 0.5rem;
    font-size: 0.9rem;
    text-overflow: ellipsis;
    overflow: hidden;
    border-bottom: none;
  }
  
  
  .details-table tr:nth-child(2) td {
    border-bottom: 1px solid var(--background-modifier-border-hover, rgba(0, 0, 0, 0.04));
    padding-bottom: 0.8rem;
  }
  
  .details-table tr:nth-child(3) td {
    padding-top: 0.8rem;
  }
  
  .details-table tr:nth-child(4) td {
    border-bottom: 1px solid var(--background-modifier-border-hover, rgba(0, 0, 0, 0.04));
    padding-bottom: 0.8rem;
  }
  
  .details-table tr:nth-child(5) td {
    padding-top: 0.8rem;
  }
  
  .details-table td:nth-child(odd) {
    color: var(--text-muted);
    width: 20%;
    font-weight: 500;
  }
  
  .details-table td:nth-child(even) {
    color: var(--text-normal);
    font-weight: 500;
    width: 30%;
  }
  
  .details-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .details-list li {
    padding: 0.4rem 0;
    font-size: 0.9rem;
    color: var(--text-normal);
    border-bottom: 1px solid var(--background-modifier-border-hover, var(--background-modifier-border));
  }
  
  
  .accounts-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.2rem 0;
  }
  
  
  .account-tag {
    padding: 0.4rem 0.8rem;
    background-color: var(--background-secondary-alt, var(--background-secondary));
    color: var(--text-normal);
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    display: inline-block;
    cursor: pointer; 
    transition: background-color 0.2s;
  }
  
  .account-tag:hover {
    background-color: var(--background-modifier-hover);
  }
  
  .notes-content {
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--text-normal);
    white-space: pre-wrap;
  }
  
  
  .trade-images-section {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background: transparent;
    border: 0;
    border-radius: 0;
    padding: 0;
    margin: 0;
    width: 100%;
    overflow: hidden;
  }
  
  
  .trade-empty-images {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    background: transparent;
    border: 1px dashed var(--background-modifier-border-hover);
    border-radius: var(--radius-l, 12px);
    padding: 1.5rem 1.75rem;
    margin: 0.5rem auto 0;
    width: min(100%, 40rem);
    min-height: 8rem;
  }

  .trade-empty-images-icon {
    width: 2.4rem;
    height: 2.4rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    color: var(--text-faint);
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  .trade-empty-images-copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.45rem;
    flex: 1 1 auto;
    text-align: center;
  }

  .trade-empty-images-title {
    color: var(--text-muted);
    font-size: 0.95rem;
    font-weight: 500;
  }

  .journalit-trade-view .trade-empty-images .trade-empty-images-action {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0;
    border: 0;
    background: transparent !important;
    box-shadow: none;
    color: var(--text-accent);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    appearance: none;
  }

  .journalit-trade-view .trade-empty-images .trade-empty-images-action:hover,
  .journalit-trade-view .trade-empty-images .trade-empty-images-action:focus-visible {
    background: transparent !important;
    box-shadow: none;
    color: var(--text-accent-hover, var(--text-accent));
    text-decoration: underline;
  }
  
  .image-carousel {
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  
  .trade-images-section[data-image-count="1"] .image-carousel,
  .trade-images-section[data-image-count="1"] .journalit-carousel-main {
    margin: 0;
    padding: 0;
  }
  
  .image-container {
    width: 100%;
    max-height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: var(--background-secondary-alt, var(--background-secondary));
    border-radius: var(--border-radius-md, 4px);
  }
  
  .image-container img {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
  }
  
  .carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--background-secondary);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    opacity: 0.7;
    transition: opacity 0.2s, background-color 0.2s;
    z-index: 10;
  }
  
  .carousel-button:hover {
    opacity: 1;
    background-color: var(--background-primary);
  }
  
  .carousel-button.prev {
    left: 10px;
  }
  
  .carousel-button.next {
    right: 10px;
  }
  
  .image-counter {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 0.3rem;
  }
  
  
  .trade-images-section[data-image-count="1"] .image-counter {
    display: none;
  }
  
  .image-thumbnails {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 100%;
    margin-top: 0.3rem;
  }
  
  .journalit-trade-view .thumbnail {
    width: 60px;
    height: 60px;
    border-radius: var(--border-radius-sm, 2px);
    overflow: hidden;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    border: 2px solid transparent;
  }
  
  .journalit-trade-view .thumbnail:hover {
    opacity: 1;
  }
  
  .journalit-trade-view .thumbnail.active {
    opacity: 1;
    border-color: var (--color-primary, var(--interactive-accent));
  }
  
  .journalit-trade-view .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  
  @media (max-width: 900px) {
    .trade-metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .details-table {
      table-layout: auto;
    }

    .details-table td:nth-child(odd) {
      width: auto;
      min-width: 100px;
    }

    .details-table td:nth-child(even) {
      width: auto;
    }
  }

  @media (max-width: 768px) {
    .trade-note-content {
      padding: 0;
      gap: 0.6rem;
    }

    .journalit-trade-view .trade-context-row,
    .trade-custom-field-item {
      grid-template-columns: 1fr;
      gap: 0.45rem;
      align-items: start;
    }

    .trade-custom-fields-rows {
      grid-template-columns: 1fr;
    }

    .trade-custom-field-value,
    .trade-custom-field-text {
      text-align: left;
    }

    .trade-custom-field-tooltip-anchor {
      justify-content: flex-start;
    }

    .details-table {
      display: block;
      overflow-x: auto;
    }
    
    .details-table td {
      padding: 0.5rem 0.3rem;
      word-break: break-word;
    }

    .thesis-section {
      padding: 0.8rem;
    }

    .thesis-section-title {
      font-size: 0.9rem;
    }

    .thesis-content {
      font-size: 0.85rem;
      line-height: 1.5;
    }
  }

  @media (max-width: 480px) {
    .trade-metrics-grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .trade-custom-fields-header {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.35rem;
    }
  }
  
  
  .trade-navigation-container {
    display: flex;
    justify-content: flex-end;
    padding: 0;
    margin: 0;
    background: transparent;
    border-bottom: 0;
  }

  .trade-session-nav {
    display: inline-flex;
    align-items: center;
    gap: 0.15rem;
  }

  .trade-session-nav-button {
    width: 2rem;
    padding: 0;
  }

  .trade-session-nav-button:disabled {
    opacity: 0.35;
  }
  
  
  .trade-navigation-with-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.8rem;
    border-bottom: 1px solid var(--background-modifier-border);
    padding-bottom: 0.8rem;
  }
  
  
  .edit-button-container {
    display: flex;
    align-items: center;
    height: auto;
    padding-top: 0;
  }
  
  
  .trade-timeline-container {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 0.3rem; 
  }
  
  .trade-timeline {
    display: flex;
    align-items: center;
  }
  
  .timeline-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-normal);
    margin-right: 0.8rem;
    white-space: nowrap;
    min-width: 70px;
  }
  
  .timeline-label.active-ticker {
    font-weight: 600;
    color: var(--interactive-accent);
  }
  
  .timeline-items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  
  .timeline-item {
    padding: 0.3rem 0.6rem;
    background-color: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .timeline-item:hover {
    background-color: var(--background-modifier-hover);
    color: var(--text-normal);
  }
  
  
  .timeline-item.profit {
    background-color: rgba(102, 187, 106, 0.15);
    color: var(--color-success, #43a047);
    border-color: rgba(102, 187, 106, 0.3);
  }
  
  .timeline-item.loss {
    background-color: rgba(229, 57, 53, 0.15);
    color: var(--color-error, #e53935);
    border-color: rgba(229, 57, 53, 0.3);
  }
  
  .timeline-item.open {
    background-color: rgba(33, 150, 243, 0.15);
    color: var(--color-info, #2196f3);
    border-color: rgba(33, 150, 243, 0.3);
  }
  
  .timeline-item.profit:hover {
    background-color: rgba(102, 187, 106, 0.25);
  }
  
  .timeline-item.loss:hover {
    background-color: rgba(229, 57, 53, 0.25);
  }
  
  .timeline-item.open:hover {
    background-color: rgba(33, 150, 243, 0.25);
  }
  
  
  .timeline-item.backtest-trade {
    background-color: rgba(138, 43, 226, 0.15);
    color: var(--color-purple, #8a2be2);
    border-color: rgba(138, 43, 226, 0.3);
    font-weight: 500;
  }

  .timeline-item.backtest-trade:hover {
    background-color: rgba(138, 43, 226, 0.25);
    transform: translateY(-1px);
  }

  .timeline-item.backtest-trade.active {
    border: 2px solid var(--color-purple, #8a2be2);
    background-color: rgba(138, 43, 226, 0.2);
    font-weight: 600;
  }
  
  
  .timeline-item.active {
    border: 2px solid var(--interactive-accent);
    font-weight: 600;
  }
  
  .timeline-item.active.profit {
    border-color: var(--interactive-accent);
  }
  
  .timeline-item.active.loss {
    border-color: var(--interactive-accent);
  }
  
  
  .trade-review-navigation {
    flex: 1;
    margin-bottom: 0;
    margin-right: 0.8rem;
  }
  
  
  .trade-nav-edit-button {
    width: auto;
    min-width: 36px;
    border-radius: 4px;
    border: 1px solid var(--interactive-accent);
    background-color: var(--interactive-accent);
    color: var(--text-on-accent, white);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
    padding: 6px 8px; 
    margin: 0;
    box-sizing: border-box;
    font-size: 14px; 
    line-height: 1.15; 
  }
  
  .trade-nav-edit-button:hover {
    background-color: var(--interactive-accent-hover, var(--interactive-accent));
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  .trade-nav-edit-button svg {
    width: 14px;
    height: 14px;
  }
  
  .journalit-trade-view .trade-review-navigation-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    width: 100%;
  }
  
  .journalit-trade-view .trade-review-navigation-button {
    flex: 1;
    min-width: 120px;
    text-align: center;
    padding: 8px 14px;
    font-size: 14px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .journalit-trade-view .trade-review-navigation-button:hover {
    background-color: var(--background-modifier-hover);
    transform: translateY(-1px);
  }

  .journalit-trade-view .trade-review-navigation-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  
  .workspace-split.mod-vertical .journalit-trade-view {
    
    max-width: 100%;
    flex-shrink: 1;
  }

  .workspace-split.mod-vertical .markdown-reading-view > .journalit-trade-view[data-mode="reading"] {
    max-width: var(--file-line-width, 700px);
    margin-left: auto;
    margin-right: auto;
  }
  
  
  .workspace-leaf-content .journalit-trade-view .trade-metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  
  .workspace-leaf-content .journalit-trade-view .trade-note-tabs {
    flex-wrap: wrap;
  }
  
  
  .workspace-leaf-content .journalit-trade-view .trade-note-container {
    min-width: 0;
  }
  
  
  @media (max-width: 576px) {
    .trade-timeline {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 0.6rem;
    }
    
    .timeline-label {
      margin-bottom: 0.4rem;
      margin-right: 0;
      font-weight: 600;
    }
    
    .trade-timeline-container {
      gap: 1rem;
    }
    
    
    .trade-navigation-with-edit {
      align-items: center;
    }
    
    .edit-button-container {
      padding-top: 0;
    }
    
    .trade-nav-edit-button {
      padding: 5px 6px; 
      min-width: 32px;
    }
    
    .trade-nav-edit-button svg {
      width: 16px;
      height: 16px;
    }
  }

  
  
  
  .trade-review-container,
  .loss-review-container {
    margin-top: 2rem;
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 1.5rem;
  }

  .trade-review-accordion,
  .loss-review-accordion {
    background: var(--background-secondary);
    border-radius: 8px;
    overflow: hidden;
  }

  
  .trade-review-sections,
  .loss-review-sections {
    padding: 1.5rem;
  }

  .trade-review-section,
  .loss-review-section {
    margin-bottom: 1.5rem;
  }

  .trade-review-section:last-child,
  .loss-review-section:last-child {
    margin-bottom: 0;
  }

  
  .trade-review-header h3,
  .loss-review-header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-normal);
  }

  .trade-review-content,
  .loss-review-content {
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .trade-review-content p,
  .loss-review-content p {
    margin: 0.5rem 0;
  }

  
  .trade-review-checkbox,
  .trade-review-checkbox-list,
  .loss-review-checkbox,
  .loss-review-checkbox-list {
    margin: 0.5rem 0;
  }

  .trade-review-checkbox-list h3,
  .loss-review-checkbox-list h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .checkbox-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-label input[type="checkbox"] {
    margin-top: 0.25rem;
    cursor: pointer;
    flex-shrink: 0;
  }

  .checkbox-label span {
    flex: 1;
    line-height: 1.5;
  }

  .checkbox-label span strong {
    color: var(--text-normal);
  }

  
  .trade-review-textarea h3,
  .loss-review-textarea h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .trade-review-textarea-input,
  .loss-review-textarea-input {
    width: 100%;
    min-height: 100px;
    padding: 0.75rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    color: var(--text-normal);
    font-family: inherit;
    font-size: 16px;
    line-height: 1.5;
    resize: vertical;
    transition: border-color 0.15s ease;
  }

  .trade-review-textarea-input:focus,
  .loss-review-textarea-input:focus {
    outline: none;
    border-color: var(--interactive-accent);
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2);
  }

  .trade-review-textarea-input::placeholder,
  .loss-review-textarea-input::placeholder {
    color: var(--text-muted);
    opacity: 0.7;
  }

  
  .trade-review-footer,
  .loss-review-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--background-modifier-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .reviewed-timestamp {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  
  @media (max-width: 768px) {
    .trade-review-sections,
    .loss-review-sections {
      padding: 1rem;
    }

    .trade-review-footer,
    .loss-review-footer {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
  }

  
  .theme-dark .journalit-trade-view .trade-review-textarea-input,
  .theme-dark .journalit-trade-view .loss-review-textarea-input {
    background: var(--background-secondary-alt);
  }

  .theme-dark .journalit-trade-view .trade-review-accordion,
  .theme-dark .journalit-trade-view .loss-review-accordion {
    background: var(--background-secondary-alt);
  }

  
  .trade-review-container .cmdr-accordion,
  .loss-review-container .cmdr-accordion {
    margin-bottom: 16px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    overflow: hidden;
    transition: box-shadow 0.2s ease;
  }

  .trade-review-container .cmdr-accordion:hover,
  .loss-review-container .cmdr-accordion:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .trade-review-container .cmdr-accordion .cmdr-accordion-header,
  .loss-review-container .cmdr-accordion .cmdr-accordion-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    padding: 12px 16px;
    cursor: pointer;
    background-color: var(--background-secondary);
    transition: background-color 0.15s ease;
  }

  .trade-review-container .cmdr-accordion .cmdr-accordion-header:hover,
  .loss-review-container .cmdr-accordion .cmdr-accordion-header:hover {
    background-color: var(--background-modifier-hover);
  }

  .trade-review-container .cmdr-accordion .cmdr-accordion-chevron > svg,
  .loss-review-container .cmdr-accordion .cmdr-accordion-chevron > svg {
    transition: transform 0.3s ease-in-out;
  }

  .trade-review-container .cmdr-accordion .cmdr-accordion-content,
  .loss-review-container .cmdr-accordion .cmdr-accordion-content {
    max-height: 5000px;
    transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out, margin 0.3s ease-in-out;
    overflow: hidden;
    background-color: var(--background-primary);
    padding: 16px;
  }

  
  .trade-review-container .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-chevron > svg,
  .loss-review-container .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-chevron > svg {
    transform: rotate(-90deg);
  }

  .trade-review-container .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-content,
  .loss-review-container .cmdr-accordion[aria-expanded="false"] .cmdr-accordion-content {
    max-height: 0 !important;
    transition: max-height 0.2s ease-out;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    overflow: hidden;
  }

  
  @media (max-width: 600px) {
    .journalit-trade-view .trade-note-header {
      padding: 1.25rem 1rem;
    }

    .journalit-trade-view .trade-header-main-row,
    .journalit-trade-view .trade-header-controls-row {
      width: 100%;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .journalit-trade-view .trade-pnl {
      text-align: right;
      flex-wrap: wrap;
    }

    .journalit-trade-view .trade-note-header .journalit-header-icon-button {
      min-height: 2.2rem;
    }

    .journalit-trade-view .trade-review-textarea-input,
    .journalit-trade-view .loss-review-textarea-input {
      font-size: 18px !important;
    }
  }

  
  .theme-light .journalit-trade-view .trade-note-header.open {
    background: transparent;
  }

  .theme-light .journalit-trade-view .trade-note-header.profit {
    background: transparent;
  }

  .theme-light .journalit-trade-view .trade-note-header.loss {
    background: transparent;
  }

  .theme-light .journalit-trade-view .trade-note-header.breakeven {
    background: transparent;
  }

`;


