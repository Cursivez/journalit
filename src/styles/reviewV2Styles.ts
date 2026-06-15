


import { TRADE_ACCOUNT_CELL_STYLES } from './shared/tradeAccountCellStyles';

export const REVIEW_V2_STYLES = `
${TRADE_ACCOUNT_CELL_STYLES}

  
  .markdown-source-view.mod-cm6 .HyperMD-codeblock-begin:has(+ .HyperMD-codeblock-bg [class*="journalit"]),
  .markdown-source-view.mod-cm6 .HyperMD-codeblock-end:has(~ .HyperMD-codeblock-bg [class*="journalit"]) {
    font-size: 0;
    line-height: 0;
    height: 0;
    overflow: hidden;
  }

  
  .cm-line.HyperMD-codeblock-bg:has([class*="journalit"]) {
    background: transparent;
  }

  
  .markdown-source-view.mod-cm6 .cm-content > .cm-preview-code-block.cm-embed-block.cm-lang-journalit-session-mistakes {
    contain: none !important;
    z-index: 20002 !important;
  }

  .markdown-source-view.mod-cm6 .cm-content > .cm-preview-code-block.cm-embed-block.cm-lang-journalit-review-context-fields {
    contain: none !important;
    overflow: visible !important;
    z-index: 20002 !important;
  }

  .markdown-source-view.mod-cm6 .cm-content > .cm-preview-code-block.cm-embed-block.cm-lang-journalit-key-levels {
    contain: none !important;
    overflow: visible !important;
    z-index: 20002 !important;
  }

  
  
  [class*="cm-lang-journalit-"],
  [class*="cm-lang-journalit-"]:hover {
    --embed-block-shadow-hover: 0 !important;
    box-shadow: none !important;
  }

  
  .markdown-source-view.mod-cm6 .cm-embed-block[class*="cm-lang-journalit-"]:hover {
    overflow: visible !important;
  }

  
  
  .markdown-source-view.mod-cm6 .cm-content > .cm-preview-code-block.cm-embed-block[class*="cm-lang-journalit-"] > .edit-block-button,
  .markdown-source-view.mod-cm6 .cm-content > .cm-preview-code-block.cm-embed-block[class*="cm-lang-journalit-"]:hover > .edit-block-button {
    display: none;
    opacity: 0;
    pointer-events: none;
  }

  
  .journalit-widget {
    margin: 0 0 0.75rem 0;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 0;

    
    --journalit-review-grade-a: #4ade80;
    --journalit-review-grade-b: #fbbf24;
    --journalit-review-grade-c: #f87171;
    --journalit-review-grade-low: #f87171;
    --journalit-review-grade-mid: #fbbf24;
    --journalit-review-grade-high: #4ade80;
  }

  

  
  .journalit-header {
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    width: 100%;
  }

  
  .journalit-header .journalit-header-content.layout-e {
    width: 100%;
    padding: 1.25rem 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }

  .journalit-header .layout-e .journalit-header-main {
    flex: 1;
  }

  .journalit-header .layout-e .journalit-header-title {
    font-size: 1.8em;
    font-weight: 600;
    color: var(--text-normal);
    line-height: 1.2;
  }

  .journalit-header .layout-e .journalit-header-subtitle {
    color: var(--text-muted);
    font-size: 0.95em;
    margin-top: 0.2rem;
  }

  .journalit-header .layout-e .journalit-header-context {
    margin-top: 0.35rem;
    font-size: 0.95em;
    color: var(--text-muted);
  }

  .journalit-header .layout-e .context-link {
    color: var(--text-accent);
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  .journalit-header .layout-e .context-link:hover:not(.disabled) {
    opacity: 0.8;
    text-decoration: underline;
  }

  .journalit-header .layout-e .context-link.disabled {
    opacity: 0.6;
    cursor: default;
  }

  .journalit-header .layout-e .context-separator {
    margin: 0 0.5rem;
    color: var(--text-faint);
  }

  .journalit-header .layout-e .context-text {
    color: var(--text-muted);
  }

  .journalit-header .layout-e .context-placeholder {
    color: var(--text-faint);
    cursor: not-allowed;
    opacity: 0.7;
  }

  .journalit-header .layout-e .journalit-header-subtle-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    color: var(--text-muted);
    font-size: 0.9em;
  }

  .journalit-header-skeleton-title {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .journalit-header-skeleton-links {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .journalit-header-reviewed-icon {
    color: var(--color-green);
  }

  .journalit-header-unreviewed-icon {
    color: var(--text-muted);
  }

  .journalit-header .layout-e .nav-link {
    padding: 0.3rem 0.6rem;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
  }

  .journalit-header .layout-e .nav-link:hover:not(.disabled) {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-header .layout-e .journalit-header-icon-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .journalit-header .layout-e .journalit-header-icon-button:hover:not(:disabled) {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-header .layout-e .journalit-header-icon-button:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .journalit-header .layout-e .journalit-header-filter-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    font-size: 10px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    color: var(--text-on-accent);
    background-color: var(--interactive-accent);
    border-radius: 8px;
    pointer-events: none;
    z-index: 1;
  }

  .journalit-header .layout-e .nav-link.disabled {
    opacity: 0.6;
    cursor: default;
  }

  .journalit-header .layout-e .nav-separator {
    display: none;
  }

  
  .journalit-goals {
    padding: 0;
    background: transparent;
    border-radius: 0;
  }

  .journalit-goals h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-normal);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-goals .goal-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .journalit-goals .goal-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--background-primary);
    border-radius: var(--radius-s);
    border: 1px solid var(--background-modifier-border);
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .journalit-goals .goal-item:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-goals .goal-checkbox {
    margin: 0;
    flex-shrink: 0;
  }

  .journalit-goals .goal-text {
    flex: 1;
    font-size: 0.95rem;
    color: var(--text-normal);
  }

  .journalit-goals .goal-text.completed {
    text-decoration: line-through;
    opacity: 0.7;
    color: var(--text-muted);
  }

  
  .journalit-tooltip {
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 8px 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    max-width: 280px;
    font-size: 13px;
    color: var(--text-normal);
    z-index: 9999;
  }

  .journalit-tooltip.journalit-reviewv2-entry-tooltip {
    padding: 4px 8px;
    border-radius: 5px;
    font-size: 12px;
    line-height: 1.25;
    min-width: 0 !important;
    width: max-content;
    max-width: calc(100vw - 32px);
    white-space: nowrap;
  }

  .journalit-tooltip.journalit-reviewv2-compact-value-tooltip {
    padding: 4px 8px;
    border-radius: 5px;
    font-size: 12px;
    line-height: 1.25;
    min-width: 0 !important;
    width: max-content;
    max-width: calc(100vw - 32px);
    white-space: nowrap;
  }

  
  .journalit-trades {
    padding: 0;
    background: transparent;
    border-radius: 0;
  }

  .journalit-trades h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-normal);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-trades .trade-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  .journalit-trades .trade-table thead {
    background: var(--background-secondary);
  }

  .journalit-trades .trade-table th {
    padding: 0.5rem;
    text-align: left;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 2px solid var(--background-modifier-border);
  }

  .journalit-trades .trade-table td {
    padding: 0.5rem;
    border-bottom: 1px solid var(--background-modifier-border-subtle);
  }

  .journalit-trades .trade-table tbody tr {
    transition: background-color 0.15s ease;
  }

  .journalit-trades .trade-table tbody tr:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-trades .trade-link {
    color: var(--text-accent);
    text-decoration: none;
    cursor: pointer;
  }

  .journalit-trades .trade-link:hover {
    text-decoration: underline;
  }

  .journalit-trades .pnl-positive {
    color: var(--text-success, #4caf50);
    font-weight: 500;
  }

  .journalit-trades .pnl-negative {
    color: var(--text-error, #f44336);
    font-weight: 500;
  }

  
  .journalit-setup-performance {
    padding: 0;
    background: transparent;
    border: none;
    overflow: visible !important;
  }

  
  .journalit-best-worst {
    padding: 0;
    background: transparent;
    border: none;
  }

  
  .journalit-trades-chart {
    padding: 0;
    background: transparent;
    border: none;
  }

  
  .journalit-review {
    padding: 0;
    background: transparent;
    border-radius: 0;
  }

  .journalit-review h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-normal);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-review .grade-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .journalit-review .grade-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    background: var(--background-primary);
    border-radius: var(--radius-s);
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-review .grade-label {
    font-size: 0.9rem;
    color: var(--text-normal);
  }

  .journalit-review .grade-value {
    font-size: 1.1rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    background: var(--background-secondary);
    border-radius: var(--radius-s);
    min-width: 40px;
    text-align: center;
  }

  .journalit-review .notes-section {
    margin-top: 1rem;
    padding: 0.75rem;
    background: var(--background-primary);
    border-radius: var(--radius-s);
    border-left: 3px solid var(--interactive-accent);
  }

  .journalit-review .notes-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .journalit-review .notes-content {
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--text-normal);
  }

  
  .journalit-reviewv2-table-wrapper {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  .journalit-reviewv2-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    text-align: center;
  }

  .journalit-reviewv2-table--compact {
    font-size: 0.9rem;
  }

  .journalit-reviewv2-table-header-cell {
    border-bottom: 2px solid var(--background-modifier-border);
    padding: 0.5rem;
    text-align: center;
    vertical-align: middle;
    font-weight: 600;
    color: var(--text-muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: var(--background-secondary);
  }

  .journalit-reviewv2-align-left {
    text-align: left;
  }

  .journalit-reviewv2-col-occurrences {
    width: 120px;
  }

  
  .journalit-reviewv2-demontracker-header-stop {
    background: var(--background-modifier-error);
    color: var(--text-on-accent);
  }

  .journalit-reviewv2-demontracker-demon-cell {
    font-weight: 500;
    color: var(--text-normal);
  }

  
  .journalit-reviewv2-demontracker .journalit-reviewv2-table-cell {
    vertical-align: middle;
  }

  .journalit-reviewv2-demontracker-x,
  .journalit-reviewv2-demontracker-empty-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .journalit-reviewv2-demontracker-x {
    color: var(--text-error);
    font-weight: 600;
    font-size: 1.1rem;
  }

  .journalit-reviewv2-demontracker-x--stop {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--background-modifier-error);
    color: var(--text-on-accent);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .journalit-reviewv2-demontracker-empty-mark {
    color: var(--text-faint);
    font-size: 0.9rem;
  }

  .journalit-reviewv2-demontracker-count {
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-normal);
  }

  .journalit-reviewv2-demontracker-count--high {
    color: var(--text-error);
  }

  .journalit-reviewv2-demontracker-summary {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding: 0.75rem;
    background: var(--background-secondary);
    border-radius: 0 0 6px 6px;
  }

  .journalit-reviewv2-demontracker-summary-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .journalit-reviewv2-demontracker-summary-label {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .journalit-reviewv2-demontracker-summary-value {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-normal);
  }

  .journalit-reviewv2-demontracker-summary-value--warning {
    color: var(--text-error);
  }

  .journalit-reviewv2-table-cell {
    padding: 8px 12px;
    border-bottom: 1px solid var(--background-modifier-border);
    text-align: center;
    vertical-align: middle;
  }

  .journalit-reviewv2-table-cell--compact {
    padding: 0.75rem 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-reviewv2-account-breakdown-account-cell {
    max-width: 0;
    min-width: 0;
    white-space: nowrap;
  }

  .journalit-reviewv2-account-breakdown-account-trigger {
    display: block;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
  }

  .journalit-reviewv2-account-breakdown-account-text {
    display: block;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-reviewv2-col-account {
    width: 14%;
    min-width: 110px;
  }

  .journalit-reviewv2-account-cell.trade-account-cell {
    min-width: 0;
    padding: 0;
  }

  .journalit-trades .trade-account-text {
    box-sizing: border-box;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-trades .tooltip-trigger {
    max-width: 100%;
  }

  .journalit-trades .journalit-reviewv2-account-tooltip-trigger {
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
  }

  .journalit-trades .journalit-reviewv2-account-tooltip-trigger .trade-account-text {
    display: block;
    min-width: 0;
  }

  .journalit-trades .trade-account-icon-wrapper {
    margin: 0 auto;
  }

  .journalit-trades .trade-no-data {
    color: var(--text-faint);
    font-size: 13px;
  }

  .journalit-reviewv2-table-row {
    transition: background-color 0.15s ease;
  }

  .journalit-reviewv2-table-row--interactive {
    cursor: pointer;
  }

  .journalit-reviewv2-table-row--static {
    cursor: default;
  }

  .journalit-reviewv2-table-row:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-reviewv2-table-row--static:hover {
    background-color: transparent;
  }

  .journalit-reviewv2-col-images {
    width: 10%;
    min-width: 70px;
  }

  .journalit-reviewv2-col-time {
    width: 16%;
  }

  .journalit-reviewv2-col-ticker {
    width: 15%;
  }

  .journalit-reviewv2-col-pnl {
    width: 15%;
  }

  .journalit-reviewv2-col-direction {
    width: 14%;
    min-width: 88px;
  }

  .journalit-reviewv2-col-setup {
    width: 15%;
    min-width: 88px;
  }

  .journalit-reviewv2-col-mistakes {
    width: 15%;
    min-width: 92px;
  }

  .journalit-trades .journalit-reviewv2-col-images {
    width: 10%;
    min-width: 70px;
  }

  .journalit-trades .journalit-reviewv2-col-time {
    width: 12%;
  }

  .journalit-trades .journalit-reviewv2-col-ticker {
    width: 12%;
  }

  .journalit-trades .journalit-reviewv2-col-pnl {
    width: 14%;
  }

  .journalit-trades .journalit-reviewv2-col-direction {
    width: 11%;
  }

  .journalit-trades .journalit-reviewv2-col-account {
    width: 16%;
    min-width: 120px;
  }

  .journalit-trades .journalit-reviewv2-col-setup,
  .journalit-trades .journalit-reviewv2-col-mistakes {
    width: 10%;
    min-width: 64px;
  }

  .journalit-trades .journalit-reviewv2-col-mistakes {
    width: 12%;
    min-width: 86px;
  }

  .journalit-trades .journalit-reviewv2-table-row {
    height: 42px;
  }

  .journalit-trades .journalit-reviewv2-table-cell {
    height: 42px;
    max-height: 42px;
    overflow: hidden;
    white-space: nowrap;
  }

  .journalit-trades .journalit-reviewv2-col-images {
    padding-top: 1px;
    padding-bottom: 1px;
    text-align: center;
  }

  .journalit-trades .journalit-reviewv2-trade-preview-cell {
    line-height: 0;
  }

  .journalit-trades .journalit-reviewv2-trade-image-wrapper {
    width: 28px;
    height: 28px;
    vertical-align: middle;
  }

  .journalit-trades .journalit-reviewv2-trade-no-image-icon {
    display: inline-block;
    vertical-align: middle;
  }

  .journalit-trades .journalit-reviewv2-col-time {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-trades .journalit-reviewv2-entry-text {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .journalit-trades .journalit-reviewv2-truncated-value-trigger {
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
  }

  .journalit-trades .journalit-reviewv2-trade-duration {
    margin-left: 0.25rem;
  }

  .journalit-trades .journalit-reviewv2-table-header-cell {
    padding-left: 0.35rem;
    padding-right: 0.35rem;
    font-size: 0.72rem;
    letter-spacing: 0.35px;
  }

  .journalit-reviewv2-col-date {
    width: 28%;
  }

  .journalit-reviewv2-col-trades {
    width: 12%;
  }

  .journalit-reviewv2-col-winrate {
    width: 16%;
  }

  .journalit-reviewv2-col-profit-factor {
    width: 16%;
  }

  .journalit-reviewv2-text-muted {
    color: var(--text-muted);
  }

  .journalit-reviewv2-text-faint {
    color: var(--text-faint);
  }

  .journalit-reviewv2-text-sm {
    font-size: 0.85rem;
  }

  .journalit-reviewv2-text-uppercase {
    text-transform: uppercase;
  }

  .journalit-reviewv2-font-semibold {
    font-weight: 600;
  }

  .journalit-reviewv2-font-medium {
    font-weight: 500;
  }

  .journalit-reviewv2-trade-duration {
    color: var(--text-muted);
    margin-left: 4px;
  }

  .journalit-reviewv2-pnl {
    font-weight: 600;
  }

  .journalit-reviewv2-pnl--positive {
    color: var(--color-green);
  }

  .journalit-reviewv2-pnl--negative {
    color: var(--color-red);
  }

  .journalit-reviewv2-pnl--muted {
    color: var(--text-muted);
  }

  .journalit-reviewv2-skeleton-time {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .journalit-reviewv2-skeleton-tags {
    display: flex;
    gap: 4px;
    justify-content: center;
  }

  .journalit-reviewv2-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum';
  }

  .journalit-reviewv2-pagination-showing {
    min-width: 15.5em;
  }

  .journalit-reviewv2-pagination-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .journalit-reviewv2-pagination-button {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    background: var(--background-primary);
    color: var(--text-normal);
    cursor: pointer;
    font-size: 0.85rem;
  }

  .journalit-reviewv2-pagination-button:disabled {
    background: var(--background-secondary);
    color: var(--text-faint);
    cursor: not-allowed;
  }

  .journalit-reviewv2-pagination-status {
    min-width: 7.5em;
    text-align: center;
  }

  .journalit-reviewv2-pagination--bordered {
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 0.5rem;
    margin-top: 0.25rem;
  }

  
  .journalit-reviewv2-pagination--after-table {
    border-top: none;
    
    padding-top: 0.5rem;
    margin-top: 0;
  }

  
  .journalit-reviewv2-game-grade {
    font-weight: 600;
  }

  .journalit-reviewv2-game-grade--a {
    color: var(--journalit-review-grade-a, var(--text-success));
  }

  .journalit-reviewv2-game-grade--b {
    color: var(--journalit-review-grade-b, var(--text-warning, gold));
  }

  .journalit-reviewv2-game-grade--c {
    color: var(--journalit-review-grade-c, var(--text-error));
  }

  .journalit-game-performance-row--disabled {
    opacity: 0.7;
    cursor: default;
  }

  .journalit-reviewv2-card-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .journalit-reviewv2-card {
    padding: 1rem;
    background: var(--background-primary);
    border-radius: var(--radius-m);
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-reviewv2-card--centered {
    max-width: 600px;
    width: 100%;
  }

  .journalit-reviewv2-card--compact {
    padding: 0.75rem;
  }

  
  .journalit-reviewv2-stats-grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(
      var(--reviewv2-stats-columns, 4),
      minmax(0, 1fr)
    );
    gap: 12px;
  }

  .journalit-reviewv2-stats-card {
    min-width: 0;
    padding: 0.75rem;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m);
  }

  .journalit-reviewv2-stats-label {
    margin: 0 0 6px 0;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1.2;
  }

  .journalit-reviewv2-stats-value {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--text-normal);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-reviewv2-stats-value--positive {
    color: var(--text-success);
  }

  .journalit-reviewv2-stats-value--negative {
    color: var(--text-error);
  }

  .journalit-reviewv2-stats-subvalue {
    margin: 6px 0 0 0;
    font-size: 0.78rem;
    color: var(--text-muted);
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-reviewv2-stats-delta {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.35rem;
    font-size: 0.68rem;
    font-weight: 500;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .journalit-reviewv2-stats-delta--positive {
    color: var(--text-success);
  }

  .journalit-reviewv2-stats-delta--negative {
    color: var(--text-error);
  }

  .journalit-reviewv2-stats-delta-arrow {
    font-size: 0.9rem;
    line-height: 1;
  }

  .journalit-reviewv2-stats-delta-suffix {
    color: var(--text-muted);
    font-weight: 400;
  }

  .journalit-reviewv2-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .journalit-reviewv2-card-header--center {
    justify-content: center;
    margin-bottom: 0.5rem;
    gap: 6px;
  }

  .journalit-reviewv2-card-title-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .journalit-reviewv2-card-title {
    margin: 0;
    font-size: 1em;
    font-weight: 600;
    color: var(--text-normal);
  }

  .journalit-reviewv2-card-title--uppercase {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
  }

  .journalit-reviewv2-card-subtitle {
    font-size: 0.8em;
    color: var(--text-muted);
  }

  .journalit-reviewv2-tooltip-icon {
    cursor: help;
    font-size: 0.85em;
    color: var(--text-muted);
    opacity: 0.7;
  }

  .journalit-reviewv2-tooltip-content {
    max-width: 250px;
    line-height: 1.4;
  }

  .journalit-reviewv2-tooltip-subtext {
    margin-top: 4px;
  }

  .journalit-reviewv2-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .journalit-reviewv2-list-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--background-secondary);
    border-radius: var(--radius-s);
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-reviewv2-checkbox {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .journalit-reviewv2-checkbox:disabled {
    cursor: default;
  }

  .journalit-reviewv2-item-text {
    flex: 1;
    cursor: pointer;
    font-size: 0.9em;
    color: var(--text-normal);
  }

  .journalit-reviewv2-item-text--completed {
    text-decoration: line-through;
    color: var(--text-muted);
  }

  .journalit-reviewv2-edit-input {
    flex: 1;
    min-width: 0;
    padding: 0.25rem 0.5rem;
    background: var(--background-primary);
    border: 1px solid var(--interactive-accent);
    border-radius: var(--radius-s);
    color: var(--text-normal);
    font-size: 0.9em;
  }

  .journalit-reviewv2-action-button {
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-s);
    font-size: 0.8em;
    font-weight: 500;
    cursor: pointer;
  }

  .journalit-reviewv2-action-button--primary {
    background: var(--interactive-accent);
    border: none;
    color: var(--text-on-accent);
  }

  .journalit-reviewv2-action-button--secondary {
    background: transparent;
    border: 1px solid var(--background-modifier-border);
    color: var(--text-muted);
  }

  .journalit-reviewv2-icon-button {
    padding: 0.25rem;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.85em;
    line-height: 1;
    opacity: 0.6;
    transition: opacity 0.2s ease;
  }

  .journalit-reviewv2-icon-button:hover {
    opacity: 1;
  }

  .journalit-reviewv2-icon-button--delete {
    font-size: 1em;
  }

  .journalit-reviewv2-empty {
    padding: 12px;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.9em;
  }

  .journalit-reviewv2-empty--large {
    padding: 2rem;
  }

  .journalit-reviewv2-add-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .journalit-reviewv2-add-input {
    flex: 1;
    padding: 0.5rem;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    color: var(--text-normal);
    font-size: 0.9em;
  }

  .journalit-reviewv2-add-button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    font-size: 0.9em;
    font-weight: 500;
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    cursor: pointer;
  }

  .journalit-reviewv2-add-button:disabled {
    background: var(--background-secondary);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  
  .journalit-session-mistakes,
  .journalit-session-mistakes .journalit-reviewv2-card,
  .journalit-session-mistakes .journalit-reviewv2-sessionmistakes,
  .journalit-session-mistakes .journalit-reviewv2-sessionmistakes-input {
    position: relative;
    overflow: visible;
  }

  .journalit-session-mistakes .journalit-reviewv2-sessionmistakes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .journalit-session-mistakes .journalit-reviewv2-sessionmistakes-input .field {
    margin: 0;
  }

  .journalit-session-mistakes .journalit-reviewv2-sessionmistakes-input .combobox-container[data-is-open='true'] {
    z-index: 20000 !important;
  }

  .journalit-session-mistakes .journalit-reviewv2-sessionmistakes-input .combobox-dropdown {
    z-index: 20001 !important;
  }

  .journalit-reviewv2-sessionmistakes-helper {
    margin-top: 0.4rem;
  }

  .journalit-reviewv2-grade-colors {
    --journalit-review-grade-a: #4ade80;
    --journalit-review-grade-b: #fbbf24;
    --journalit-review-grade-c: #f87171;
    --journalit-review-grade-low: #f87171;
    --journalit-review-grade-mid: #fbbf24;
    --journalit-review-grade-high: #4ade80;
  }

  .journalit-reviewv2-grade-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .journalit-reviewv2-grade-column {
    flex: 1 1 200px;
    min-width: 200px;
  }

  .journalit-reviewv2-grade-label {
    margin-bottom: 0.5rem;
    font-size: 0.9em;
    font-weight: 500;
    color: var(--text-normal);
    text-align: center;
  }

  .journalit-reviewv2-grade-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .journalit-reviewv2-grade-button {
    flex: 1;
    padding: 0.75rem;
    background: var(--background-secondary);
    border: 2px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    color: var(--text-normal);
    font-size: 1.1em;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .journalit-reviewv2-grade-button--selected {
    color: var(--text-on-accent);
    font-weight: 600;
  }

  .journalit-reviewv2-grade-button--preview {
    cursor: default;
    opacity: 0.7;
  }

  .journalit-reviewv2-grade-button--a.journalit-reviewv2-grade-button--selected {
    background: var(--journalit-review-grade-a);
    border-color: var(--journalit-review-grade-a);
  }

  .journalit-reviewv2-grade-button--b.journalit-reviewv2-grade-button--selected {
    background: var(--journalit-review-grade-b);
    border-color: var(--journalit-review-grade-b);
  }

  .journalit-reviewv2-grade-button--c.journalit-reviewv2-grade-button--selected {
    background: var(--journalit-review-grade-c);
    border-color: var(--journalit-review-grade-c);
  }

  .journalit-reviewv2-grade-button--a:hover:not(.journalit-reviewv2-grade-button--selected):not(.journalit-reviewv2-grade-button--preview) {
    border-color: var(--journalit-review-grade-a);
    opacity: 0.8;
  }

  .journalit-reviewv2-grade-button--b:hover:not(.journalit-reviewv2-grade-button--selected):not(.journalit-reviewv2-grade-button--preview) {
    border-color: var(--journalit-review-grade-b);
    opacity: 0.8;
  }

  .journalit-reviewv2-grade-button--c:hover:not(.journalit-reviewv2-grade-button--selected):not(.journalit-reviewv2-grade-button--preview) {
    border-color: var(--journalit-review-grade-c);
    opacity: 0.8;
  }

  .journalit-reviewv2-star-rating {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    background: var(--background-secondary);
    border-radius: var(--radius-s);
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-reviewv2-star {
    appearance: none;
    border: 0;
    background: transparent;
    box-shadow: none;
    padding: 0;
    color: inherit;
    font-size: 1.75em;
    line-height: 1;
    user-select: none;
    transition: transform 0.1s ease;
  }

  button.journalit-reviewv2-star,
  button.journalit-reviewv2-star:hover,
  button.journalit-reviewv2-star:focus,
  button.journalit-reviewv2-star:active,
  button.journalit-reviewv2-star:disabled {
    background: transparent;
    border: 0;
    box-shadow: none;
    min-height: 0;
    height: auto;
  }

  .journalit-reviewv2-star--interactive {
    cursor: pointer;
  }

  .journalit-reviewv2-star--interactive:hover {
    transform: scale(1.2);
  }

  .journalit-reviewv2-star--preview {
    cursor: default;
    opacity: 0.7;
  }

  .journalit-reviewv2-star--full {
    color: gold;
  }

  button.journalit-reviewv2-star--full {
    color: gold;
  }

  .journalit-reviewv2-star--empty {
    color: var(--text-muted);
  }

  button.journalit-reviewv2-star--empty {
    color: var(--text-muted);
  }

  .journalit-reviewv2-star-half {
    position: relative;
    display: inline-block;
  }

  .journalit-reviewv2-star-half-base {
    visibility: hidden;
  }

  .journalit-reviewv2-star-half-muted {
    position: absolute;
    left: 0;
    top: 0;
    color: var(--text-muted);
  }

  .journalit-reviewv2-star-half-fill {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    width: 50%;
    color: gold;
  }

  .journalit-reviewv2-star-score {
    font-size: 1em;
    font-weight: 600;
    color: var(--text-muted);
    margin-left: 0.5rem;
  }

  .journalit-reviewv2-missed-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-bottom: 0.5rem;
  }

  .journalit-reviewv2-missed-card-shell--empty {
    min-height: 52px;
    padding: 0.7rem 0.9rem;
    display: flex;
    align-items: center;
  }

  .journalit-reviewv2-missed-card-shell--empty .journalit-reviewv2-missed-header {
    width: 100%;
    justify-content: flex-start;
    gap: 1.15rem;
    margin-bottom: 0;
  }

  .journalit-reviewv2-missed-empty-inline {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--text-muted);
    font-size: 0.8rem;
    line-height: 14px;
    white-space: nowrap;
  }

  .journalit-reviewv2-missed-empty-inline-icon {
    display: block;
    width: 14px;
    height: 14px;
    color: var(--text-muted);
    opacity: 0.55;
    flex: 0 0 auto;
    align-self: center;
    transform: translateY(-0.5px);
  }

  .journalit-reviewv2-missed-card-shell--empty .journalit-reviewv2-missed-add {
    margin-left: auto;
    padding: 4px 9px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background: var(--background-secondary);
    color: var(--text-normal);
    box-shadow: var(--input-shadow);
  }

  .journalit-reviewv2-missed-add {
    padding: 2px 6px;
    border-radius: 4px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .journalit-reviewv2-missed-add:hover {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-reviewv2-missed-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .journalit-reviewv2-missed-card {
    padding: 6px 10px;
    border-radius: 6px;
    background: var(--background-secondary);
    border-left: 3px solid var(--background-modifier-border);
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .journalit-reviewv2-missed-card:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-reviewv2-missed-card--long {
    border-left-color: var(--color-green);
  }

  .journalit-reviewv2-missed-card--short {
    border-left-color: var(--color-red);
  }

  .journalit-reviewv2-missed-card--neutral {
    border-left-color: var(--text-muted);
  }

  .journalit-reviewv2-missed-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .journalit-reviewv2-missed-card-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    flex: 1;
  }

  .journalit-reviewv2-missed-card-meta-top-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    min-width: 0;
  }

  .journalit-reviewv2-missed-card-meta-top {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    flex-wrap: wrap;
    flex: 1;
  }

  .journalit-reviewv2-missed-card-meta-bottom {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    min-width: 0;
  }

  .journalit-reviewv2-missed-instrument {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .journalit-reviewv2-missed-direction {
    display: inline-flex;
    align-items: center;
    font-size: 10px;
    line-height: 1;
    padding: 2px 6px;
    background: transparent;
    border: 1px solid var(--background-modifier-border);
    border-radius: 999px;
    color: var(--text-muted);
    font-weight: 500;
    flex-shrink: 0;
  }

  .journalit-reviewv2-missed-time {
    display: inline-flex;
    align-items: center;
    font-size: 10px;
    line-height: 1;
    padding: 2px 6px;
    background: transparent;
    border: 1px solid var(--background-modifier-border);
    border-radius: 999px;
    color: var(--text-faint);
    font-weight: 500;
    flex-shrink: 0;
  }

  .journalit-reviewv2-missed-setup-tags {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .journalit-reviewv2-missed-setup-tag {
    font-size: 10px;
    padding: 1px 6px;
    background: rgba(var(--color-info-rgb, 33, 150, 243), 0.12);
    color: var(--color-info, #2196f3);
    border-radius: 3px;
    font-weight: 500;
    white-space: nowrap;
  }

  .journalit-reviewv2-missed-setup-overflow {
    font-size: 10px;
    padding: 1px 6px;
    background: rgba(var(--color-info-rgb, 33, 150, 243), 0.08);
    color: var(--text-muted);
    border-radius: 3px;
    font-weight: 500;
    cursor: help;
  }

  .journalit-reviewv2-missed-statuses {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-end;
    flex-wrap: wrap;
    flex-shrink: 0;
    margin-left: auto;
    padding-top: 1px;
  }

  .journalit-reviewv2-missed-reviewed-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .journalit-reviewv2-missed-reviewed-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--color-green, #4caf50);
    flex: 0 0 6px;
    transform: translateY(-0.5px);
  }

  .journalit-reviewv2-missed-reviewed-text {
    display: block;
    font-size: 10px;
    line-height: 10px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .journalit-reviewv2-missed-badge {
    padding: 2px 8px;
    border-radius: 4px;
    background: var(--color-orange, #ef6c00);
    color: white;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .journalit-reviewv2-missed-details {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    margin-top: 6px;
  }

  .journalit-reviewv2-missed-detail-row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .journalit-reviewv2-missed-detail-label {
    font-size: 10px;
    color: var(--text-faint);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    flex-shrink: 0;
  }

  .journalit-reviewv2-missed-detail-value {
    font-size: 11px;
    color: var(--text-normal);
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .journalit-reviewv2-missed-summary {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 6px;
  }

  .journalit-reviewv2-missed-summary-row {
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.35;
  }

  .journalit-reviewv2-missed-summary-label {
    font-weight: 600;
    color: var(--text-faint);
    margin-right: 4px;
  }

  .journalit-reviewv2-missed-summary-value {
    color: var(--text-muted);
  }

  .journalit-reviewv2-missed-day {
    margin-bottom: 12px;
  }

  .journalit-reviewv2-missed-day-title {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-reviewv2-missed-day-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .journalit-reviewv2-skeleton-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 12px 4px 12px;
  }

  .journalit-reviewv2-skeleton-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    align-items: center;
  }

  .journalit-reviewv2-skeleton-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .journalit-reviewv2-skeleton-stars {
    display: flex;
    gap: 4px;
  }

  .journalit-reviewv2-trade-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  
  .journalit-reviewv2-table-wrapper .journalit-reviewv2-trade-image-wrapper {
    position: relative;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }

  .journalit-reviewv2-table-wrapper .journalit-reviewv2-trade-preview-thumbnail {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid var(--background-modifier-border);
    background: var(--background-secondary);
  }

  .journalit-reviewv2-table-wrapper .journalit-reviewv2-trade-preview-thumbnail .journalit-excalidraw-media,
  .journalit-reviewv2-table-wrapper .journalit-reviewv2-trade-preview-thumbnail .journalit-excalidraw-media__embed {
    width: 100%;
    height: 100%;
    min-height: 100%;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  .journalit-reviewv2-table-wrapper .journalit-reviewv2-trade-preview-thumbnail .excalidraw-svg,
  .journalit-reviewv2-table-wrapper .journalit-reviewv2-trade-preview-thumbnail .excalidraw-embedded-img,
  .journalit-reviewv2-table-wrapper .journalit-reviewv2-trade-preview-thumbnail svg {
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
  }

  .journalit-reviewv2-table-wrapper .journalit-reviewv2-trade-image-count-indicator {
    position: absolute;
    bottom: -4px;
    right: -4px;
    background: var(--background-primary);
    color: var(--text-muted);
    font-size: 10px;
    padding: 2px 4px;
    border-radius: 3px;
    border: 1px solid var(--background-modifier-border);
    font-weight: 600;
    line-height: 1;
    z-index: 1;
    pointer-events: none;
  }

  .journalit-reviewv2-table-wrapper .journalit-reviewv2-trade-no-image-icon {
    color: var(--text-faint);
  }

  
  .journalit-chart {
    padding: 0;
    background: transparent;
    border-radius: 0;
    min-height: 300px;
  }

  .journalit-chart h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-normal);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-chart .chart-container {
    width: 100%;
    height: 100%;
    min-height: 250px;
    position: relative;
  }

  .journalit-chart .chart-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 250px;
    color: var(--text-muted);
  }

  
  .journalit-pnl-chart,
  .journalit-drawdown-chart,
  .journalit-trades-chart {
    max-width: 900px;
  }

  
  .journalit-placeholder {
    padding: 2rem 1rem;
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    background: var(--background-primary-alt);
    border: 1px dashed var(--background-modifier-border);
    border-radius: var(--radius-m);
  }

  .journalit-placeholder .placeholder-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }

  .journalit-placeholder .placeholder-text {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .journalit-placeholder .placeholder-section-name {
    font-weight: 600;
    color: var(--text-normal);
    font-style: normal;
  }

  
  .journalit-images-widget {
    width: 100%;
  }

  .journalit-reviewv2-images-skeleton-main {
    width: 100%;
    height: 200px;
    background: var(--background-secondary);
    border-radius: var(--radius-m);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  .journalit-reviewv2-images-skeleton-thumbs {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  
  .journalit-images-widget .journalit-image-carousel {
    margin-bottom: 0;
    padding: 0;
    background-color: transparent;
    border-radius: 0;
  }

  .journalit-images-widget .journalit-carousel-main {
    margin-bottom: 0;
  }

  .journalit-images-widget .journalit-carousel-counter {
    margin: 8px 0 0 0;
  }

  .journalit-images-widget .journalit-carousel-thumbnails {
    margin-top: 8px;
  }

  .journalit-images-empty {
    padding: 2rem;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.9em;
  }

  .journalit-images-uploader {
    margin-top: 0.75rem;
  }

  
  .journalit-reviewv2-images-stacked {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .journalit-reviewv2-images-stacked__item {
    position: relative;
  }

  .journalit-reviewv2-images-stacked__img {
    width: 100%;
    border-radius: var(--radius-m);
    cursor: pointer;
    display: block;
  }

  .journalit-reviewv2-images-stacked__excalidraw {
    width: 100%;
    cursor: pointer;
  }

  .journalit-stacked-image-delete {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    line-height: 1;
    transition: transform 0.15s ease, background-color 0.15s ease;
  }

  .journalit-stacked-image-delete:hover {
    transform: scale(1.05);
    background: rgba(0, 0, 0, 0.75);
  }

  
  .journalit-images-uploader.disabled-preview {
    pointer-events: none;
    opacity: 0.7;
    cursor: default;
  }

  .journalit-images-uploader.disabled-preview .journalit-image-upload-file-area {
    cursor: default;
  }

  
  @media (max-width: 768px) {
    .journalit-header .header-stats {
      flex-direction: column;
      gap: 0.5rem;
    }

    .journalit-trades .trade-table {
      font-size: 0.8rem;
    }

    .journalit-trades .trade-table th,
    .journalit-trades .trade-table td {
      padding: 0.35rem;
    }

    .journalit-chart {
      min-height: 250px;
    }

    .journalit-chart .chart-container {
      min-height: 200px;
    }
  }

  
  .theme-dark .journalit-header .journalit-header-nav-btn {
    background: var(--interactive-normal);
  }

  .theme-dark .journalit-header .journalit-header-nav-btn:hover:not(.disabled) {
    background: var(--interactive-hover);
  }

  
  .journalit-reviewv2-bestworst-grid {
    display: grid;
    gap: 1rem;
  }

  .journalit-reviewv2-bestworst-grid--both {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .journalit-reviewv2-bestworst-grid--single {
    grid-template-columns: 1fr;
  }

  @media (max-width: 900px) {
    .journalit-reviewv2-bestworst-grid--both {
      grid-template-columns: 1fr;
    }
  }

  .journalit-reviewv2-bestworst-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }

  .journalit-reviewv2-bestworst-card {
    display: flex;
    align-items: stretch;
    min-height: 100px;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
    border-radius: var(--radius-m);
    border: 1px solid var(--background-modifier-border);
    border-left-width: 3px;
    gap: 1rem;
    background: var(--background-primary);
    transition: background 0.15s ease;
  }

  .journalit-reviewv2-bestworst-card--positive {
    border-left-color: var(--text-success);
  }

  .journalit-reviewv2-bestworst-card--negative {
    border-left-color: var(--text-error);
  }

  .journalit-reviewv2-bestworst-card--interactive {
    cursor: pointer;
  }

  .journalit-reviewv2-bestworst-card--preview {
    cursor: default;
  }

  .journalit-reviewv2-bestworst-card--interactive:hover,
  .journalit-reviewv2-bestworst-card--interactive:focus-visible {
    background: var(--background-secondary);
  }

  .journalit-reviewv2-bestworst-empty-card {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
    background: var(--background-primary);
    border-radius: var(--radius-m);
    border: 1px solid var(--background-modifier-border);
    text-align: center;
    color: var(--text-muted);
  }

  .journalit-reviewv2-bestworst-pnl-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 100px;
    flex-shrink: 0;
  }

  .journalit-reviewv2-bestworst-pnl {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .journalit-reviewv2-bestworst-pnl--positive {
    color: var(--text-success);
  }

  .journalit-reviewv2-bestworst-pnl--negative {
    color: var(--text-error);
  }

  .journalit-reviewv2-bestworst-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    min-width: 0;
    gap: 0.25rem;
  }

  .journalit-reviewv2-bestworst-primary-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    flex-wrap: wrap;
    min-width: 0;
  }

  .journalit-reviewv2-bestworst-primary {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-normal);
    min-width: 0;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .journalit-reviewv2-bestworst-secondary {
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--text-muted);
  }

  .journalit-reviewv2-bestworst-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .journalit-reviewv2-bestworst-meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    white-space: nowrap;
  }

  .journalit-reviewv2-bestworst-chips {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.25rem;
    overflow: hidden;
  }

  .journalit-reviewv2-bestworst-chip {
    font-size: 0.65rem;
    padding: 0.125rem 0.375rem;
    border-radius: 999px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
    flex-shrink: 1;
    background: var(--background-secondary);
    color: var(--text-muted);
  }

  .journalit-reviewv2-bestworst-chip--setup {
    background: rgba(var(--interactive-accent-rgb, 66, 153, 225), 0.15);
    color: var(--interactive-accent);
  }

  .journalit-reviewv2-bestworst-chip--mistake {
    background: rgba(var(--color-red-rgb), 0.15);
    color: var(--text-error);
  }

  .journalit-reviewv2-bestworst-chip--overflow {
    background: var(--background-modifier-border);
    flex-shrink: 0;
  }

  .journalit-reviewv2-bestworst-wrapper {
    min-width: 0;
    width: 100%;
  }

  .journalit-reviewv2-bestworst-trade-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .journalit-reviewv2-bestworst-chip-row {
    min-height: 1.125rem;
  }

  .journalit-game-performance-row:hover {
    background: var(--background-modifier-hover);
  }

  .journalit-reviewv2-mark-reviewed-button {
    padding: 0.5rem 1rem;
    border-radius: var(--radius-s);
    font-size: 0.85em;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .journalit-reviewv2-mark-reviewed-button--reviewed {
    background: transparent;
    border: 1px solid var(--background-modifier-border);
    color: var(--text-muted);
  }

  .journalit-reviewv2-mark-reviewed-button--pending {
    background: var(--interactive-accent);
    border: none;
    color: var(--text-on-accent);
  }

  .journalit-reviewv2-mark-reviewed-button--reviewed:hover {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-reviewv2-mark-reviewed-button--pending:hover {
    background: var(--interactive-accent-hover);
  }

  .journalit-reviewv2-mark-reviewed-button--disabled {
    cursor: default;
    opacity: 0.7;
  }

  .journalit-reviewv2-mark-reviewed-button--disabled:hover {
    background: inherit;
  }

  .journalit-reviewv2-mark-reviewed-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-m);
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
  }

  .journalit-reviewv2-mark-reviewed-icon {
    flex-shrink: 0;
  }

  .journalit-reviewv2-mark-reviewed-icon--reviewed {
    color: var(--color-green);
  }

  .journalit-reviewv2-mark-reviewed-icon--pending {
    color: var(--text-muted);
  }

  .journalit-reviewv2-mark-reviewed-status-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .journalit-reviewv2-mark-reviewed-status-text {
    font-weight: 600;
    font-size: 0.9em;
    color: var(--text-normal);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .journalit-reviewv2-mark-reviewed-timestamp {
    font-size: 0.85em;
    color: var(--text-muted);
    margin-left: 0.75rem;
  }

  .reviewed-indicator {
    display: inline-flex;
    align-items: center;
    margin-left: 0.6rem;
    vertical-align: middle;
    position: relative;
    top: -0.1em;
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.15s ease;
  }

  .reviewed-indicator--disabled {
    cursor: default;
    opacity: 0.7;
  }

  .reviewed-indicator:not(.reviewed-indicator--disabled):hover {
    opacity: 0.7;
  }

  .journalit-key-levels-importance {
    position: relative;
  }

  .journalit-key-levels-importance-button {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    cursor: pointer;
    min-width: 36px;
    width: 36px;
    height: 30px;
    min-height: 30px;
    line-height: 0;
  }

  .journalit-key-levels-importance-dropdown {
    position: absolute;
    top: auto;
    right: auto;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 4px;
    margin-top: 0;
    min-width: 150px;
    z-index: 100;
  }

  .journalit-key-levels-importance-option {
    min-height: 30px;
  }

  .journalit-key-levels-importance-option-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    flex: 0 0 14px;
  }

  .journalit-key-levels-importance-option-label {
    font-size: 0.78rem;
    line-height: 1;
  }

  .journalit-key-levels-importance-option:hover {
    background: var(--background-modifier-hover);
  }

  .journalit-key-levels-importance-option--selected {
    background: transparent;
    color: var(--text-normal);
  }

  .journalit-key-levels-remove-button {
    min-height: 0;
    height: auto;
    margin: 0;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.9rem;
    line-height: 1;
    opacity: 0.5;
    transition: opacity 0.15s ease;
  }

  .journalit-key-levels-remove-button:hover {
    opacity: 1;
  }

  .journalit-reviewv2-chart-container {
    overflow: visible;
  }

  .journalit-reviewv2-chart-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 12px 4px 12px;
  }

  .journalit-reviewv2-chart-title {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
  }

  .journalit-previous-drc-reference {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--background-modifier-border);
    border-left: 3px solid var(--interactive-accent);
    border-radius: 10px;
    background: rgba(var(--background-secondary-alt-rgb, 35, 35, 35), 0.35);
  }

  .journalit-previous-drc-reference-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--background-modifier-border);
    background: rgba(var(--background-secondary-rgb, 30, 30, 30), 0.45);
  }

  .journalit-previous-drc-reference-title-group {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .journalit-previous-drc-reference-kicker {
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .journalit-previous-drc-reference-date {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-normal);
  }

  .journalit-previous-drc-reference-link {
    flex: 0 0 auto;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-accent);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
  }

  .journalit-previous-drc-reference-link:hover,
  .journalit-previous-drc-reference-link:focus-visible {
    color: var(--text-accent-hover);
    text-decoration: underline;
    outline: none;
  }

  .journalit-previous-drc-reference-body {
    padding: 0.75rem 1rem 1rem;
  }

  .journalit-previous-drc-reference-body > section:first-child > :is(h1, h2, h3, h4, h5, h6):first-child {
    margin-top: 0;
  }

  .journalit-previous-drc-rendered-markdown {
    opacity: 0.92;
  }

  .journalit-reviewv2-chart-body {
    padding: 8px 8px 0 8px;
  }

  .journalit-reviewv2-chart-body--compact {
    padding: 0.5rem;
  }

  .journalit-reviewv2-chart-frame {
    height: var(--reviewv2-chart-height, 250px);
    overflow: visible;
  }

  .journalit-reviewv2-chart-body {
    overflow: visible;
  }

  .journalit-reviewv2-chart-empty {
    padding: 1rem;
    text-align: center;
    color: var(--text-muted);
  }

  .journalit-reviewv2-chart-empty--small {
    font-size: 0.85rem;
  }

  .journalit-reviewv2-directional-container {
    display: flex;
    gap: 1rem;
  }

  .journalit-reviewv2-directional-container--row {
    flex-direction: row;
  }

  .journalit-reviewv2-directional-container--column {
    flex-direction: column;
  }

  .journalit-reviewv2-directional-section {
    min-width: 0;
    overflow: hidden;
  }

  .journalit-reviewv2-directional-container--row .journalit-reviewv2-directional-section {
    flex: 1 1 50%;
  }

  .journalit-reviewv2-directional-container--column .journalit-reviewv2-directional-section {
    flex: 1 1 auto;
  }

  .journalit-reviewv2-chart-skeleton {
    position: relative;
    height: var(--reviewv2-chart-height, 250px);
  }

  .journalit-reviewv2-chart-skeleton-axis {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 25px;
    width: 35px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .journalit-reviewv2-chart-skeleton-bars {
    margin-left: 40px;
    height: calc(100% - 25px);
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    gap: var(--reviewv2-chart-bar-gap, 4px);
  }

  .journalit-reviewv2-chart-skeleton-xline {
    position: absolute;
    bottom: 20px;
    left: 40px;
    right: 0;
    height: 1px;
    background: var(--background-modifier-border);
  }

  .journalit-reviewv2-chart-skeleton-xlabels {
    position: absolute;
    bottom: 0;
    left: 40px;
    right: 0;
    display: flex;
    justify-content: space-around;
  }

  .journalit-reviewv2-chart-skeleton-xlabels--between {
    justify-content: space-between;
  }

  .journalit-reviewv2-chart-skeleton-xlabels--wide {
    left: 45px;
  }

  .journalit-reviewv2-chart-skeleton-wave {
    margin-left: 40px;
    height: 100%;
    padding-bottom: 20px;
  }

  .journalit-reviewv2-chart-skeleton-wave--wide {
    margin-left: 45px;
  }

  .journalit-reviewv2-chart-skeleton-wave-fill {
    opacity: 0.3;
  }

  .journalit-reviewv2-chart-skeleton-wave-line {
    opacity: 0.6;
  }

  .journalit-reviewv2-table-container {
    overflow-x: auto;
  }

  .journalit-reviewv2-table-container--chart {
    margin-top: 0.25rem;
  }

  .journalit-reviewv2-table {
    width: 100%;
    border-collapse: collapse;
  }

  .journalit-reviewv2-table-header-cell {
    padding: 0.4rem 0.5rem;
    text-align: center;
    vertical-align: middle;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--background-modifier-border);
    background: var(--background-secondary);
  }

  .journalit-reviewv2-table-cell {
    padding: 0.35rem 0.5rem;
    font-size: 0.875rem;
    color: var(--text-normal);
    border-bottom: 1px solid var(--background-modifier-border-hover);
    text-align: center;
    vertical-align: middle;
  }

  .journalit-reviewv2-table-cell--positive {
    color: var(--text-success);
  }

  .journalit-reviewv2-table-cell--negative {
    color: var(--text-error);
  }

  .journalit-reviewv2-table-cell--emphasis {
    font-weight: 600;
  }

  .journalit-reviewv2-invalid-context {
    padding: 0.75rem 1rem;
    margin: 0.5rem 0;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    color: var(--text-muted);
    font-size: 0.9em;
  }

  .journalit-reviewv2-invalid-context-title {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  .journalit-reviewv2-invalid-context-reason {
    font-size: 0.85em;
    opacity: 0.8;
  }

  .journalit-key-levels-widget {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
    gap: 1rem;
    overflow: visible;
  }

  @media (max-width: 500px) {
    .journalit-key-levels-widget {
      grid-template-columns: 1fr;
    }
  }

  .key-levels-section {
    display: flex;
    flex-direction: column;
    border: 1px dashed var(--background-modifier-border);
    border-radius: 8px;
    padding: 0;
    background: transparent;
    overflow: visible;
  }

  .key-levels-section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 0;
    padding: 0.75rem 1rem;
    border-bottom: 1px dashed var(--background-modifier-border);
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .key-levels-section--support .key-levels-section-header {
    color: var(--color-green);
  }

  .key-levels-section--resistance .key-levels-section-header {
    color: var(--color-red);
  }

  .key-levels-section-body {
    flex: 1;
    padding: 0 1rem;
  }

  .key-levels-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px dotted var(--background-modifier-border-hover);
  }

  .key-levels-item--last {
    border-bottom: none;
  }

  .key-levels-item-content {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .key-levels-price {
    font-weight: 500;
    font-family: var(--font-monospace);
    font-size: 0.9rem;
    line-height: 1.4;
    color: var(--text-normal);
  }

  .key-levels-price--editable {
    cursor: text;
  }

  .key-levels-price--editable:hover {
    color: var(--text-normal);
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 0.2rem;
  }

  .key-levels-edit-input {
    width: 6.5rem;
    padding: 0.2rem 0.35rem;
    background: var(--background-primary);
    border: 1px solid var(--interactive-accent);
    border-radius: 4px;
    color: var(--text-normal);
    font-family: var(--font-monospace);
    font-size: 0.9rem;
  }

  .key-levels-source-tag,
  .journalit-key-levels-widget button.key-levels-source-tag {
    appearance: none !important;
    min-height: 0 !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0.05rem 0.32rem !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 999px !important;
    box-shadow: none !important;
    color: var(--text-muted) !important;
    background: transparent !important;
    background-color: transparent !important;
    font-size: 0.65rem;
    font-weight: 600;
    line-height: 1.25;
    text-transform: none;
    letter-spacing: 0;
  }

  .key-levels-source-tag--clickable {
    cursor: pointer;
  }

  .key-levels-source-tag--clickable:hover {
    border-color: var(--interactive-accent) !important;
    color: var(--interactive-accent) !important;
  }

  .key-levels-empty {
    padding: 1rem;
    text-align: center;
    color: var(--text-faint);
    font-size: 0.85rem;
    font-style: italic;
  }

  .key-levels-input-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-top: 1px dashed var(--background-modifier-border);
    background: var(--background-secondary);
    border-radius: 0 0 8px 8px;
  }

  .key-levels-input {
    flex: 1;
    box-sizing: border-box;
    height: 30px;
    padding: 0.4rem 0.6rem;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    color: var(--text-normal);
    font-size: 0.85rem;
  }

  .key-levels-add-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 36px;
    height: 30px;
    min-width: 36px;
    min-height: 30px;
    padding: 0;
    background: transparent;
    border: 1px solid var(--interactive-accent);
    border-radius: 4px;
    color: var(--interactive-accent);
    cursor: pointer;
    font-size: 22px;
    font-weight: 400;
    line-height: 0;
    transition: all 0.15s ease;
  }

  .key-levels-add-button:disabled {
    border: 1px solid var(--background-modifier-border);
    color: var(--text-faint);
    cursor: not-allowed;
  }

  .key-levels-flag {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }

  .key-levels-flag--high {
    color: var(--color-red);
  }

  .key-levels-flag--medium {
    color: var(--color-orange);
  }

  .key-levels-flag--low {
    color: var(--color-blue);
  }

  .key-levels-flag--default {
    color: var(--text-faint);
  }

  .key-levels-arrow {
    flex-shrink: 0;
  }

  .key-levels-skeleton-section {
    border: 1px dashed var(--background-modifier-border);
    border-radius: 8px;
    padding: 0;
    background: transparent;
  }

  .key-levels-skeleton-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 0;
    padding: 0.75rem 1rem;
    border-bottom: 1px dashed var(--background-modifier-border);
  }

  .key-levels-skeleton-header--support {
    color: var(--color-green);
  }

  .key-levels-skeleton-header--resistance {
    color: var(--color-red);
  }

  .key-levels-skeleton-title {
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .key-levels-skeleton-body {
    padding: 0.75rem 1rem;
  }

  .key-levels-skeleton-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px dotted var(--background-modifier-border-hover);
  }

  .key-levels-skeleton-row--last {
    border-bottom: none;
  }

  .key-levels-skeleton-row-content {
    display: flex;
    align-items: center;
  }

  .key-levels-skeleton-icon {
    margin-right: 0.5rem;
  }

  
  .journalit-widget .journalit-reviewv2-table.journalit-reviewv2-table {
    display: table !important;
    margin: 0 !important;
    margin-inline: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    border-collapse: collapse !important;
    border-spacing: 0 !important;
    border: none !important;
    table-layout: fixed !important;
    text-align: center !important;
    background: transparent !important;
  }

  .journalit-widget .journalit-reviewv2-table.journalit-reviewv2-table > thead {
    display: table-header-group !important;
  }

  .journalit-widget .journalit-reviewv2-table.journalit-reviewv2-table > tbody {
    display: table-row-group !important;
  }

  .journalit-widget .journalit-reviewv2-table.journalit-reviewv2-table > thead > tr,
  .journalit-widget .journalit-reviewv2-table.journalit-reviewv2-table > tbody > tr {
    display: table-row !important;
    background: transparent !important;
  }

  .journalit-widget .journalit-reviewv2-table.journalit-reviewv2-table > thead > tr > th,
  .journalit-widget .journalit-reviewv2-table.journalit-reviewv2-table > tbody > tr > td {
    display: table-cell !important;
  }

  .journalit-widget .journalit-reviewv2-table-row.journalit-reviewv2-table-row {
    background: transparent !important;
  }

  .journalit-widget .journalit-reviewv2-table-header-cell.journalit-reviewv2-table-header-cell {
    padding: 0.4rem 0.5rem !important;
    text-align: center !important;
    vertical-align: middle !important;
    font-size: 0.75rem !important;
    font-weight: 600 !important;
    color: var(--text-muted) !important;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: none !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    background: var(--background-secondary) !important;
  }

  .journalit-widget .journalit-reviewv2-table-cell.journalit-reviewv2-table-cell {
    padding: 0.35rem 0.5rem !important;
    font-size: 0.875rem !important;
    color: var(--text-normal) !important;
    border: none !important;
    border-bottom: 1px solid var(--background-modifier-border-hover) !important;
    text-align: center !important;
    vertical-align: middle !important;
    background: transparent !important;
  }

  .journalit-widget .journalit-reviewv2-table-header-cell.journalit-reviewv2-align-left,
  .journalit-widget .journalit-reviewv2-table-cell.journalit-reviewv2-align-left {
    text-align: left !important;
  }

  .journalit-widget .journalit-reviewv2-table-cell--positive.journalit-reviewv2-table-cell--positive {
    color: var(--text-success) !important;
  }

  .journalit-widget .journalit-reviewv2-table-cell--negative.journalit-reviewv2-table-cell--negative {
    color: var(--text-error) !important;
  }

  .journalit-widget .journalit-reviewv2-table-cell--emphasis.journalit-reviewv2-table-cell--emphasis {
    font-weight: 600;
  }

  .journalit-widget .journalit-reviewv2-table-cell--muted.journalit-reviewv2-table-cell--muted {
    color: var(--text-muted) !important;
  }

  .journalit-widget.journalit-trades .journalit-reviewv2-table-header-cell.journalit-reviewv2-table-header-cell {
    padding-left: 0.2rem !important;
    padding-right: 0.2rem !important;
    font-size: 0.68rem !important;
    letter-spacing: 0.1px !important;
  }

  .journalit-widget.journalit-trades .journalit-reviewv2-col-images {
    width: 11% !important;
    min-width: 70px !important;
  }

  .journalit-widget.journalit-trades .journalit-reviewv2-col-ticker {
    width: 12% !important;
  }

  .journalit-widget.journalit-trades .journalit-reviewv2-col-pnl {
    width: 14% !important;
  }

  .journalit-widget.journalit-trades .journalit-reviewv2-col-account {
    width: 16% !important;
    min-width: 120px !important;
  }

  .journalit-widget.journalit-trades .journalit-reviewv2-col-setup {
    width: 10% !important;
    min-width: 64px !important;
  }

  .journalit-widget.journalit-trades .journalit-reviewv2-col-mistakes {
    width: 12% !important;
    min-width: 86px !important;
  }

  .journalit-widget.journalit-trades .journalit-reviewv2-table-row {
    height: 42px !important;
  }

  .journalit-widget.journalit-trades .journalit-reviewv2-table-cell.journalit-reviewv2-table-cell {
    height: 42px !important;
    max-height: 42px !important;
    overflow: hidden !important;
    white-space: nowrap !important;
  }

  .journalit-widget.journalit-trades .journalit-reviewv2-col-images.journalit-reviewv2-col-images {
    padding-top: 1px !important;
    padding-bottom: 1px !important;
    text-align: center !important;
  }

  .journalit-widget.journalit-trades .journalit-reviewv2-trade-image-wrapper {
    width: 28px !important;
    height: 28px !important;
  }

  
  .journalit-widget .journalit-reviewv2-table-cell.journalit-reviewv2-game-grade--a {
    color: var(--journalit-review-grade-a, var(--text-success)) !important;
  }

  .journalit-widget .journalit-reviewv2-table-cell.journalit-reviewv2-game-grade--b {
    color: var(--journalit-review-grade-b, var(--text-warning, gold)) !important;
  }

  .journalit-widget .journalit-reviewv2-table-cell.journalit-reviewv2-game-grade--c {
    color: var(--journalit-review-grade-c, var(--text-error)) !important;
  }

  .review-context-fields {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .review-context-fields-group {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 1rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m);
    background: var(--background-primary);
  }

  .review-context-fields-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin: 0;
    padding: 0 0 0.55rem;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .review-context-fields-inherited {
    display: flex;
    flex-direction: column;
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
  }

  .review-context-fields-inherited-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 0;
    padding: 0 0 0.65rem;
    position: relative;
  }

  .review-context-fields-inherited-title,
  .review-context-fields-source-title {
    color: var(--text-muted);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-align: center;
  }

  .review-context-fields-edit-toggle.journalit-button {
    position: absolute;
    right: 0;
    top: 0;
    appearance: none;
    min-height: 0;
    height: auto;
    padding: 0;
    border: 0;
    box-shadow: none;
    background: transparent;
    background-color: transparent;
    color: var(--text-accent);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.25;
    text-decoration: underline;
    text-underline-offset: 0.18rem;
    cursor: pointer;
  }

  .review-context-fields-edit-toggle.journalit-button:hover,
  .review-context-fields-edit-toggle.journalit-button:focus-visible {
    color: var(--text-accent-hover, var(--text-accent));
    text-decoration-thickness: 2px;
  }

  .review-context-fields-by-field {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .review-context-fields-field-group {
    display: grid;
    grid-template-columns: minmax(8rem, 0.22fr) minmax(0, 1fr);
    gap: 0;
    padding: 0;
    border-bottom: 1px solid var(--background-modifier-border-hover);
  }

  .review-context-fields-field-group:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  .review-context-fields-field-chain {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
  }

  .review-context-fields-field-entry,
  .review-context-fields-source-status-row {
    display: grid;
    grid-template-columns: 4.25rem minmax(0, 1fr);
    gap: 0.55rem;
    align-items: center;
    min-width: 0;
    padding: 0.38rem 0.75rem;
    border-bottom: 1px solid var(--background-modifier-border-hover);
  }

  .review-context-fields-field-entry:last-child,
  .review-context-fields-source-status-row:last-child {
    border-bottom: none;
  }

  .review-context-fields-field-entry--local {
    margin-top: 0;
    padding: 0.38rem 0.75rem;
    border-left: none;
    border-radius: 0;
    background: transparent;
  }

  .review-context-fields-field-entry--local .review-context-fields-source-label {
    margin-left: 0;
  }

  .review-context-fields-field-entry:not(.review-context-fields-field-entry--local) .review-context-fields-source-link,
  .review-context-fields-source-status-row .review-context-fields-source-link,
  .review-context-fields-source-status-row .review-context-fields-source-label {
    margin-left: 0;
  }

  .review-context-fields-source-link {
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    height: auto;
    width: fit-content;
    min-width: 3.75rem;
    margin: 0;
    padding: 0.12rem 0.45rem;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: var(--radius-s);
    box-shadow: none !important;
    background: var(--background-secondary) !important;
    background-color: var(--background-secondary) !important;
    color: var(--text-muted) !important;
    font: inherit;
    font-size: 0.74rem;
    font-weight: 600;
    line-height: 1.35;
    cursor: pointer;
    text-align: center;
  }

  .review-context-fields-source-label,
  .review-context-fields-source-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: fit-content;
    min-width: 3.75rem;
    height: 1.55rem;
    padding: 0.12rem 0.45rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    background: var(--background-secondary);
    color: var(--text-muted) !important;
    font-size: 0.74rem;
    font-weight: 600;
    line-height: 1.35;
  }

  .review-context-fields-source-link:hover,
  .review-context-fields-source-link:focus-visible {
    color: var(--text-accent);
    text-decoration: underline;
    text-underline-offset: 0.18rem;
  }

  .review-context-fields-source-status {
    color: var(--text-muted);
    font-size: 0.85rem;
    padding: 0;
    text-align: left;
    font-style: italic;
  }

  .review-context-fields-inherited-label {
    color: var(--text-normal);
    font-size: 0.84rem;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 1.25;
    text-transform: none;
    white-space: normal;
    padding: 0.75rem 0.85rem;
    border-right: 1px solid var(--background-modifier-border-hover);
  }

  .review-context-fields-inherited-label::after {
    content: '';
  }

  .review-context-fields-inherited-value {
    color: var(--text-normal);
    font-size: 0.9rem;
    line-height: 1.4;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .review-context-fields-inherited-value--local::after {
    content: '';
  }

  .review-context-fields-source-statuses {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    padding-top: 0.85rem;
    border-top: 1px solid var(--background-modifier-border-hover);
  }

  .review-context-fields-inline-control {
    width: min(28rem, 100%);
    min-width: 0;
  }

  .review-context-fields-inline-control :is(label, .label) {
    display: none;
  }

  .review-context-fields-inline-control :is(.inputContainer, .selectContainer, .combobox-container) {
    width: 100%;
  }

  .review-context-fields-inline-control :is(input.input, textarea.input, .select, .combobox-input) {
    width: 100%;
    min-width: min(18rem, 100%);
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
  }

  @media (max-width: 640px) {
    .review-context-fields-field-group,
    .review-context-fields-field-entry,
    .review-context-fields-source-status-row {
      grid-template-columns: 1fr;
      gap: 0.35rem;
    }
  }

  .review-context-fields-group-title {
    color: var(--text-normal);
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
  }

  .review-context-fields-local-groups {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .review-context-fields-local-group {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--background-modifier-border-hover);
    border-radius: var(--radius-m);
    background: transparent;
    overflow: hidden;
  }

  .review-context-fields-local-group + .review-context-fields-local-group {
    padding-top: 0;
  }

  .review-context-fields-local-group-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
    padding: 0.6rem 0.85rem;
    border-bottom: 1px solid var(--background-modifier-border);
    background: var(--background-secondary);
    color: var(--text-normal);
    font-size: 0.92rem;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 1.3;
    text-transform: none;
  }

  .review-context-fields-local-group-title::before,
  .review-context-fields-local-group-title::after {
    content: none;
  }



  .review-context-fields-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    column-gap: 1rem;
    row-gap: 0;
    padding: 0;
    background: transparent;
    border-radius: 0;
  }

  .review-context-fields-control {
    min-width: 0;
    padding: 0;
  }

  .review-context-fields-control--compact {
    max-width: 14rem;
  }

  .review-context-fields-control--wide {
    max-width: 28rem;
  }

  .review-context-fields-control:has(.journalit-combobox[data-combobox-type="multi"] .selected-item) {
    max-width: 14rem;
  }

  .review-context-fields-control :is(label, .label) {
    display: block;
    margin: 0 0 0.35rem;
    color: var(--text-muted);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .review-context-fields-control :is(.inputContainer, .selectContainer, .combobox-container) {
    width: 100%;
  }

  .review-context-fields-control :is(.input, .select, .combobox-input) {
    width: 100%;
    font-size: 0.85rem;
  }

  .review-context-fields-control textarea.input {
    min-height: 3.8rem;
  }

  .review-context-fields-control .journalit-form-group,
  .review-context-fields-control .form-group {
    margin: 0;
  }

  .review-context-fields-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted);
    padding: 2rem;
    text-align: center;
    font-size: 0.9em;
  }

  .review-context-fields-empty p {
    margin: 0;
  }

  .review-context-fields-error {
    color: var(--text-error);
  }

  .journalit-weekly-drc-context {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    cursor: default;
    user-select: none;
  }

  .journalit-weekly-drc-context * {
    cursor: default !important;
    user-select: none;
  }

  .journalit-weekly-drc-days {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .journalit-weekly-drc-summary {
    cursor: pointer;
    user-select: none;
    transition: background-color 150ms ease-out;
    background: var(--background-primary);
  }

  .journalit-weekly-drc-summary--sticky-clone {
    position: fixed;
    top: var(--journalit-weekly-drc-sticky-top);
    left: var(--journalit-weekly-drc-sticky-left);
    width: var(--journalit-weekly-drc-sticky-width);
    box-sizing: border-box;
    z-index: 1000;
    background: var(--background-primary);
    border-top: 1px solid var(--background-modifier-border);
    border-right: 1px solid var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);
    border-left: 3px solid var(--interactive-accent);
    border-radius: 10px 10px 0 0;
    box-shadow: 0 0 0 4px var(--background-primary), 0 8px 18px rgba(0, 0, 0, 0.16);
  }

  .journalit-weekly-drc-summary--sticky-clone:hover {
    background: var(--background-primary);
  }

  .journalit-weekly-drc-summary--sticky-clone.journalit-previous-drc-reference-header {
    padding-top: 0.65rem;
    padding-bottom: 0.65rem;
  }

  .journalit-weekly-drc-summary:hover {
    background: var(--background-primary);
  }

  .journalit-weekly-drc-day--accordion .journalit-weekly-drc-summary[aria-expanded="true"] {
    box-shadow: 0 1px 0 var(--background-modifier-border);
  }

  .journalit-weekly-drc-context .journalit-weekly-drc-summary,
  .journalit-weekly-drc-summary--sticky-clone,
  .journalit-weekly-drc-context .journalit-weekly-drc-accordion-indicator,
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-accordion-indicator,
  .journalit-weekly-drc-context .journalit-weekly-drc-header-spacer {
    cursor: pointer !important;
  }

  .journalit-weekly-drc-context .journalit-weekly-drc-reference-date-link,
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-reference-date-link {
    display: inline-flex;
    width: max-content;
    max-width: max-content;
    flex: 0 0 auto;
    cursor: pointer !important;
    text-decoration: underline;
    text-decoration-color: transparent;
    text-underline-offset: 3px;
    transition: color 150ms ease-out, text-decoration-color 150ms ease-out;
  }

  .journalit-weekly-drc-context .journalit-weekly-drc-reference-date-link:hover,
  .journalit-weekly-drc-context .journalit-weekly-drc-reference-date-link:focus-visible,
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-reference-date-link:hover,
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-reference-date-link:focus-visible {
    color: var(--interactive-accent);
    text-decoration-color: currentColor;
  }

  .journalit-weekly-drc-header-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    flex: 0 0 auto;
  }

  .journalit-weekly-drc-header-spacer {
    flex: 1 1 auto;
    align-self: stretch;
  }

  .journalit-weekly-drc-context .journalit-weekly-drc-mark-reviewed-button,
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-mark-reviewed-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    min-height: 30px;
    padding: 1px 0.7rem 0;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    background: var(--background-primary);
    color: var(--text-muted);
    font-size: 0.78rem;
    font-weight: 500;
    line-height: 1;
    cursor: pointer !important;
    transition: border-color 150ms ease-out, color 150ms ease-out, background-color 150ms ease-out;
  }

  .journalit-weekly-drc-context .journalit-weekly-drc-mark-reviewed-button:hover:not(:disabled),
  .journalit-weekly-drc-context .journalit-weekly-drc-mark-reviewed-button:focus-visible:not(:disabled),
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-mark-reviewed-button:hover:not(:disabled),
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-mark-reviewed-button:focus-visible:not(:disabled) {
    border-color: var(--interactive-accent);
    background: var(--background-secondary);
    color: var(--text-normal);
  }

  .journalit-weekly-drc-context .journalit-weekly-drc-mark-reviewed-button--reviewed,
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-mark-reviewed-button--reviewed {
    border-color: var(--color-green);
    color: var(--color-green);
    background: transparent;
  }

  .journalit-weekly-drc-context .journalit-weekly-drc-mark-reviewed-button:disabled,
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-mark-reviewed-button:disabled {
    opacity: 0.8;
    cursor: default !important;
  }

  .journalit-weekly-drc-context .journalit-weekly-drc-mark-reviewed-icon,
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-mark-reviewed-icon {
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

  .journalit-weekly-drc-context .journalit-weekly-drc-mark-reviewed-icon--reviewed,
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-mark-reviewed-icon--reviewed {
    background: var(--color-green);
    border-color: var(--color-green);
    color: var(--background-primary);
  }

  .journalit-weekly-drc-context .journalit-weekly-drc-mark-reviewed-icon > svg,
  .journalit-weekly-drc-summary--sticky-clone .journalit-weekly-drc-mark-reviewed-icon > svg {
    width: 10px;
    height: 10px;
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .journalit-weekly-drc-accordion-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    color: var(--text-muted);
  }

  .journalit-weekly-drc-accordion-indicator > svg {
    transition: transform 250ms ease-in-out;
  }

  .journalit-weekly-drc-day--accordion .journalit-weekly-drc-summary[aria-expanded="false"] .journalit-weekly-drc-accordion-indicator > svg {
    transform: rotate(-90deg);
  }

  .journalit-weekly-drc-summary .journalit-previous-drc-reference-title-group,
  .journalit-weekly-drc-summary--sticky-clone .journalit-previous-drc-reference-title-group {
    margin-left: 8px;
    flex: 0 0 auto;
    width: max-content;
    max-width: max-content;
  }

  .journalit-weekly-drc-day .journalit-previous-drc-reference-date,
  .journalit-weekly-drc-summary--sticky-clone .journalit-previous-drc-reference-date {
    font-size: 0.74rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .journalit-weekly-drc-day .journalit-previous-drc-reference-header {
    padding-top: 0.65rem;
    padding-bottom: 0.65rem;
  }

  .journalit-weekly-drc-day .journalit-previous-drc-reference-body {
    padding-top: 1rem;
  }

  .journalit-weekly-drc-day .journalit-previous-drc-reference-body > section:first-child > :is(h1, h2, h3, h4, h5, h6):first-child {
    margin-top: 0;
  }

  .journalit-weekly-drc-day .journalit-previous-drc-rendered-markdown {
    user-select: none;
  }

  .journalit-weekly-drc-day .journalit-previous-drc-rendered-markdown * {
    user-select: none;
  }
`;
