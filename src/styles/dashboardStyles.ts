
export const DASHBOARD_STYLES = `
  
  
  .workspace-leaf-content[data-type="journalit-dashboard-view"] {
    
    --widget-bg-color: transparent;
    --metric-card-bg-color: transparent;
    --chart-bg-color: transparent;
    --calendar-day-bg-color: transparent;
    --calendar-weekday-bg-color: transparent;
    --dashboard-dot-color: rgba(120, 120, 120, 0.15);
    --journalit-primary-filters-max-width: 700px;
  }

  
  .theme-light .journalit-dashboard-view {
    background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px) !important;
  }

  
  .theme-dark .journalit-dashboard-view {
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px) !important;
  }

  
  .workspace-leaf-content[data-type="journalit-dashboard-view"] .view-header {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }
  
  
  .journalit-dashboard-view-container {
    height: 100%;
    padding: 0 !important;
    overflow: hidden !important;
  }

  
  .journalit-dashboard-view {
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    background-color: var(--background-primary) !important;
    background-size: 20px 20px !important;
    background-position: 0 0 !important;
    padding: 0 16px 16px 16px !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    scrollbar-gutter: stable !important;
    margin-top: 0 !important; 
  }
  
  
  .journalit-dashboard-unified-container {
    display: flex !important;
    flex-direction: column !important;
    gap: 2.5px !important; 
    background-color: transparent !important;
    padding: 0 !important;
    flex: 1 1 0 !important; 
    min-height: 0 !important; 
    height: 0 !important; 
  }

  .journalit-dashboard-section-wrapper {
    position: relative;
  }

  .journalit-dashboard-empty-container {
    padding: 40px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
    min-height: 300px;
  }
  
  
  .journalit-dashboard-top-section {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 4px !important; 
    margin-bottom: 0 !important;
    padding: 4px !important; 
    background-color: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  
  
  .journalit-dashboard-metrics {
    display: flex !important;
    flex-direction: row !important; 
    flex-wrap: wrap !important; 
    gap: 8px !important; 
    width: 100% !important; 
    overflow-x: hidden !important; 
    overflow-y: visible !important; 
    align-items: stretch !important; 
    height: auto !important; 
    min-height: auto !important; 
    padding: 10px 0 !important; 
    justify-content: flex-start !important; 
  }
  
  .journalit-dashboard-top-section-header {
    display: flex !important;
    justify-content: flex-end !important;
    align-items: center !important;
    padding: 0 10px !important;
    width: 100% !important;
  }

  .journalit-dashboard-top-section-body {
    position: relative !important;
    width: 100% !important;
  }

  .journalit-dashboard-add-metric-button {
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent) !important;
    border: none !important;
    border-radius: 4px !important;
    padding: 4px 8px !important;
    font-size: 12px !important;
    cursor: pointer !important;
  }

  .journalit-dashboard-add-metric-button:hover {
    filter: brightness(1.05);
  }

  .journalit-dashboard-metric-tooltip {
    max-width: 250px;
    font-size: 12px;
  }

  .journalit-dashboard-metric-tooltip__title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .journalit-dashboard-metric-tooltip__warning {
    margin-top: 4px;
    color: var(--text-warning, #f0a020);
  }

  
  .journalit-dashboard-metric-wrapper {
    position: relative !important;
    display: flex !important;
    flex: 1 1 180px !important; 
    min-width: 180px !important; 
    max-width: 300px !important; 
  }

  .journalit-dashboard-metric-wrapper--sortable {
    height: 100% !important;
  }

  .journalit-dashboard-metric-handle {
    position: relative !important;
    height: 100% !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
  }

  .journalit-dashboard-metric-handle[data-editing="true"] {
    cursor: grab !important;
  }

  .journalit-dashboard-metric-handle[data-editing="false"] {
    cursor: default !important;
  }

  .journalit-dashboard-metric-handle-inner {
    display: flex !important;
    flex: 1 !important;
    width: 100% !important;
    height: 100% !important;
  }
  
  
  .journalit-dashboard-widget-remove {
    position: absolute !important;
    top: 4px !important;
    right: 4px !important;
    background-color: var(--background-modifier-error) !important;
    color: white !important;
    border: none !important;
    border-radius: 50% !important;
    width: 22px !important;
    height: 22px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 12px !important;
    cursor: pointer !important;
    z-index: 10000 !important; 
    padding: 0 !important;
    font-weight: bold !important;
    line-height: 1 !important;
    pointer-events: auto !important;
    transition: opacity 0.2s ease, transform 0.2s ease !important;
    opacity: 0 !important; 
  }
  
  
  .journalit-dashboard-grid-layout.is-editing .react-grid-item:hover .journalit-dashboard-widget-remove {
    opacity: 1 !important;
  }
  
  
  .journalit-dashboard-top-section .journalit-dashboard-metric-wrapper:hover .journalit-dashboard-widget-remove {
    opacity: 1 !important;
  }
  
  
  .journalit-dashboard-metric-wrapper .journalit-dashboard-widget-remove,
  .journalit-dashboard-widget .journalit-dashboard-widget-remove {
    pointer-events: auto !important;
    z-index: 100 !important; 
  }
  
  .journalit-dashboard-widget-remove:hover {
    background-color: var(--text-error) !important;
    transform: scale(1.1) !important;
  }
  
  .journalit-dashboard-metric-card-frame {
    display: flex !important;
    flex: 1 1 auto !important;
    width: 100% !important;
    min-width: 0 !important;
  }

  .journalit-dashboard-metric-card-frame .tooltip-trigger {
    display: flex !important;
    flex: 1 1 auto !important;
    width: 100% !important;
    min-width: 0 !important;
  }

  .journalit-dashboard-metric-card {
    flex: 1 1 auto !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: none !important;
    padding: 14px !important;
    background-color: var(--background-primary) !important;
    border-radius: 8px !important;
    border: 1px solid rgba(var(--background-modifier-border-rgb, 0, 0, 0), 0.08) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.08) !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    position: relative !important;
    min-height: 98px !important;
  }

  .journalit-dashboard-metric-wrapper[data-editing="true"]::after {
    content: '' !important;
    position: absolute !important;
    inset: 0 !important;
    box-sizing: border-box !important;
    border: 2px dashed color-mix(in srgb, var(--interactive-accent) 65%, transparent) !important;
    border-radius: 8px !important;
    pointer-events: none !important;
    z-index: 1 !important;
  }

  .journalit-dashboard-metric-drag-indicator {
    position: absolute !important;
    top: 50% !important;
    right: 8px !important;
    transform: translateY(-50%) !important;
    color: var(--text-muted) !important;
    opacity: 0.75 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    pointer-events: none !important;
    z-index: 2 !important;
  }

  .journalit-dashboard-metric-wrapper[data-editing="true"]:hover .journalit-dashboard-metric-drag-indicator {
    color: var(--interactive-accent) !important;
    opacity: 1 !important;
  }

  .journalit-dashboard-metric-name {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: var(--text-muted) !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    text-align: left !important;
    min-width: 0 !important;
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
    white-space: nowrap !important;
    width: 100% !important;
    margin-bottom: 6px !important;
  }

  .journalit-dashboard-metric-info {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 9px !important;
    line-height: 1 !important;
    opacity: 0.5 !important;
    cursor: help !important;
  }

  .journalit-dashboard-metric-name > .journalit-dashboard-metric-info {
    transform: translateY(-1px) !important;
  }

  .journalit-reviewv2-chart-title .journalit-dashboard-metric-info,
  .journalit-reviewv2-stats-label .journalit-dashboard-metric-info,
  .journalit-home-widget__eyebrow .journalit-dashboard-metric-info,
  .journalit-dashboard-widget-title .journalit-dashboard-metric-info,
  .journalit-chart-widget__title .journalit-dashboard-metric-info,
  .journalit-dashboard-daily-performance-chart__title .journalit-dashboard-metric-info,
  .journalit-dashboard-trades-chart__title .journalit-dashboard-metric-info,
  .journalit-display-value .journalit-dashboard-metric-info {
    margin-left: 4px !important;
  }

  .journalit-currency-conversion-info {
    margin-left: 4px !important;
  }

  .journalit-dashboard-metric-warning {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 9px !important;
    line-height: 1 !important;
    color: var(--text-warning, #f0a020) !important;
    cursor: help !important;
  }

  .journalit-dashboard-metric-name > .journalit-dashboard-metric-warning {
    transform: translateY(-1px) !important;
  }
  
  .journalit-dashboard-metric-value {
    font-size: 24px !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    text-align: left !important;
    width: 100% !important;
    display: flex !important;
    align-items: flex-start !important;
    gap: 6px !important;
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    min-width: 0 !important;
  }

  .journalit-dashboard-metric-primary {
    display: inline-flex !important;
    align-items: baseline !important;
    flex: 0 0 auto !important;
    min-width: 0 !important;
    white-space: nowrap !important;
    overflow: visible !important;
    line-height: 1.05 !important;
  }

  
  .journalit-dashboard-metric-value.positive {
    color: var(--color-green) !important; 
  }
  
  .journalit-dashboard-metric-value.negative {
    color: var(--color-red) !important; 
  }
  
  
  .journalit-dashboard-metric-cents {
    font-size: 16px !important;
    opacity: 0.7 !important;
    font-weight: 500 !important;
    margin-left: 1px !important;
    display: inline-block !important;
  }

  .journalit-dashboard-metric-suffix {
    font-size: 12px !important;
    line-height: 1 !important;
    opacity: 0.95 !important;
    font-weight: 500 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex: 0 0 auto !important;
    white-space: nowrap !important;
    color: var(--text-muted) !important;
    margin-top: 2px !important;
  }

  .journalit-dashboard-metric-suffix--with-cents,
  .journalit-dashboard-metric-suffix--without-cents {
    margin-left: 0 !important;
  }

  .journalit-dashboard-metric-suffix.positive {
    color: var(--color-green) !important;
  }

  .journalit-dashboard-metric-suffix.negative {
    color: var(--color-red) !important;
  }

  .journalit-dashboard-metric-previous-delta-slot {
    min-height: 20px !important;
    margin-top: 6px !important;
  }

  .journalit-dashboard-metric-previous-delta {
    display: inline-flex !important;
    align-items: center !important;
    gap: 3px !important;
    font-size: 11px !important;
    line-height: 1.2 !important;
    font-weight: 500 !important;
    color: var(--text-muted) !important;
    white-space: nowrap !important;
  }

  .journalit-dashboard-metric-previous-delta--positive {
    color: var(--color-green) !important;
  }

  .journalit-dashboard-metric-previous-delta--negative {
    color: var(--color-red) !important;
  }

  .journalit-dashboard-metric-previous-delta-arrow {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 12px !important;
    height: 12px !important;
    flex: 0 0 12px !important;
    line-height: 1 !important;
  }

  .journalit-dashboard-metric-previous-delta-arrow svg {
    width: 12px !important;
    height: 12px !important;
    stroke-width: 3.5 !important;
  }

  .journalit-dashboard-metric-previous-delta-suffix {
    color: var(--text-muted) !important;
    font-weight: 400 !important;
  }

  
  .journalit-dashboard-trades-chart {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .journalit-dashboard-trades-chart__header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid rgba(var(--background-modifier-border-rgb), 0.4);
    position: relative;
  }

  .journalit-dashboard-trades-chart__title {
    font-weight: 500;
    font-size: 13px;
    color: var(--text-muted);
    letter-spacing: 0.3px;
    text-align: center;
    opacity: 0.8;
    text-shadow: 0 1px 1px rgba(var(--background-primary-rgb), 0.8);
  }

  .journalit-dashboard-trades-chart__selector {
    position: absolute;
    right: 12px;
    display: flex;
    align-items: center;
  }

  .journalit-dashboard-trades-chart__select {
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    background-color: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    cursor: pointer;
  }

  .journalit-dashboard-trades-chart__select:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-dashboard-trades-chart__body {
    flex: 1;
    width: 100%;
    min-height: 0;
  }

  .journalit-dashboard-trades-chart__chart {
    box-shadow: var(--shadow-s);
  }

  
  .journalit-dashboard-daily-performance-chart {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .journalit-dashboard-daily-performance-chart__header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid rgba(var(--background-modifier-border-rgb), 0.4);
    position: relative;
  }

  .journalit-dashboard-daily-performance-chart__title {
    font-weight: 500;
    font-size: 13px;
    color: var(--text-muted);
    letter-spacing: 0.3px;
    text-align: center;
    opacity: 0.8;
    text-shadow: 0 1px 1px rgba(var(--background-primary-rgb), 0.8);
  }

  .journalit-dashboard-daily-performance-chart__selector {
    position: absolute;
    right: 12px;
    display: flex;
    align-items: center;
  }

  .journalit-dashboard-daily-performance-chart__select {
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    background-color: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    cursor: pointer;
  }

  .journalit-dashboard-daily-performance-chart__select:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-dashboard-daily-performance-chart__body {
    flex: 1;
    width: 100%;
    min-height: 0;
  }
  
  
  .journalit-dashboard-filter-controls {
    display: flex !important;
    flex-direction: column !important;
    margin-bottom: 2.5px !important; 
    padding: 12px 16px !important;
    background-color: var(--background-secondary) !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
    position: relative !important;
  }
  
  
  .journalit-dashboard-filter-row {
    display: grid !important;
    grid-template-columns: auto 1fr auto !important;
    gap: 20px !important;
    align-items: center !important; 
    width: 100% !important;
  }
  
  
  .journalit-dashboard-filters-section {
    display: flex !important;
    flex-direction: row !important;
    gap: 20px !important;
    align-items: center !important;
    min-width: 0 !important; 
    flex: 1 !important;
  }
  
  .journalit-dashboard-date-range-section {
    display: flex !important;
    flex-direction: row !important;
    position: relative !important; 
    
    flex: 1 !important;
    
    margin-right: 10px !important;
    margin-top: 0 !important; 
  }
  
  .journalit-dashboard-tickers-section,
  .journalit-dashboard-accounts-section {
    display: flex !important;
    flex-direction: row !important;
    
    flex: 0 0 auto !important; 
    margin-right: 10px !important;
    margin-top: 0 !important; 
  }
  
  .journalit-dashboard-filter-label {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    margin-bottom: 4px !important;
    display: inline-block !important;
  }
  
  .journalit-dashboard-filter-actions {
    display: flex !important;
    align-items: center !important;
    
    flex: 0 0 auto !important; 
    gap: 8px !important; 
    min-width: fit-content !important; 
    justify-self: end !important; 
    margin-left: auto !important; 
  }

  .journalit-dashboard-filter-actions > * {
    flex-shrink: 0 !important; 
  }

  .journalit-dashboard-filter-actions
    .journalit-filter-button-container
    .journalit-filter-button.journalit-dashboard-filter-button {
    min-width: 30px !important;
    min-height: 30px !important;
    padding: 0 !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background: var(--background-primary) !important;
    color: var(--text-normal) !important;
    box-shadow: none !important;
  }

  .journalit-dashboard-filter-actions
    .journalit-filter-button-container
    .journalit-filter-button.journalit-dashboard-filter-button:hover,
  .journalit-dashboard-filter-actions
    .journalit-filter-button-container
    .journalit-filter-button.journalit-dashboard-filter-button:focus-visible {
    border-color: var(--background-modifier-border-hover) !important;
    background: var(--background-modifier-hover) !important;
    color: var(--text-normal) !important;
  }

  .journalit-dashboard-filter-actions
    .journalit-filter-button-container.journalit-dashboard-filter-button-container
    .journalit-filter-badge {
    top: -6px !important;
    right: -6px !important;
  }
  
  
  .journalit-dashboard-filter-actions.button-container {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important; 
  }
  
  
  .journalit-dashboard-filter-actions.button-container .journalit-dashboard-reset-button,
  .journalit-dashboard-filter-actions.button-container .journalit-dashboard-edit-mode-button {
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    height: 28px !important;
    line-height: 1 !important;
  }

  
  .journalit-dashboard-header,
  .journalit-dashboard-header-compact {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 16px !important;
    width: 100% !important;
    flex-wrap: wrap !important;
  }

  .journalit-dashboard-primary-filters {
    display: flex !important;
    align-items: center !important;
    flex: 0 1 auto !important;
    min-width: 0 !important;
    max-width: var(--journalit-primary-filters-max-width) !important;
  }

  
  .journalit-dashboard-date-range-filter {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    position: relative !important; 
  }
  
  .journalit-dashboard-date-range-presets {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    align-items: center !important;
  }
  
  .journalit-dashboard-date-range-presets button {
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    padding: 5px 10px !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    color: var(--text-normal) !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    height: 28px !important;
    line-height: 1 !important;
  }
  
  .journalit-dashboard-date-range-presets button:hover {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
  }
  
  .journalit-dashboard-date-range-presets button.active {
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent, white) !important;
    border-color: var(--interactive-accent) !important;
  }

  .journalit-dashboard-custom-date-anchor {
    position: relative !important;
    display: inline-flex !important;
  }
  
  .journalit-dashboard-date-range-inputs {
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
    padding: 20px 24px !important;
    background-color: var(--background-primary) !important;
    border-radius: 8px !important;
    border: 1px solid var(--background-modifier-border) !important;
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    right: auto !important;
    margin-top: 8px !important;
    z-index: 1000 !important;
    width: 300px !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  }
  
  
  .journalit-dashboard-date-range-inputs.date-dropdown-visible {
    animation: dateDropdownFadeIn 0.2s ease-out !important;
  }
  
  @keyframes dateDropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  
  .journalit-dashboard-custom-date-dropdown {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    right: auto !important;
    margin-top: 8px !important;
    z-index: 1000 !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  }

  .journalit-dashboard-view .journalit-dashboard-date-range-inputs.journalit-dashboard-custom-date-dropdown {
    width: 300px !important;
    max-width: min(300px, calc(100vw - 32px)) !important;
  }

  
  .journalit-dashboard-custom-date-dropdown.position-left {
    left: auto !important;
    right: 0 !important;
  }

  
  .journalit-dashboard-custom-date-dropdown.position-below {
    top: 100% !important;
    left: 0 !important;
    right: auto !important;
    margin-top: 8px !important;
  }

  .journalit-dashboard-date-range-start,
  .journalit-dashboard-date-range-end {
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
  }
  
  .journalit-dashboard-date-range-start label,
  .journalit-dashboard-date-range-end label {
    display: block !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    color: var(--text-muted) !important;
  }
  
  
  .journalit-date-picker-input {
    width: max-content !important;
  }
  
  
  .journalit-date-picker-input > div {
    width: max-content !important;
  }

  .journalit-date-picker-input .journalit-fast-datetime__container {
    width: max-content !important;
    flex-wrap: nowrap !important;
  }

  .journalit-date-picker-input .journalit-fast-datetime__container[data-date-only="true"] {
    padding-right: 8px !important;
  }
  
  .journalit-date-picker-input input {
    font-size: 13px !important;
    border-radius: 4px !important;
    border: 1px solid var(--background-modifier-border) !important;
    background-color: var(--background-secondary) !important;
    color: var(--text-normal) !important;
    transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
  }

  .journalit-date-picker-input .journalit-fast-datetime__segment {
    width: 40px !important;
    min-width: 40px !important;
    max-width: 40px !important;
    padding: 6px 4px !important;
  }
  
  .journalit-date-picker-input input:focus {
    border-color: var(--interactive-accent) !important;
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2) !important;
    outline: none !important;
  }
  
  .journalit-date-picker-input input:hover {
    border-color: var(--interactive-hover) !important;
  }
  
  
  .journalit-dashboard-account-filter,
  .journalit-dashboard-ticker-filter,
  .journalit-dashboard-tag-filter {
    display: flex !important;
    flex-direction: column !important;
    
    min-width: 140px !important;
    max-width: 200px !important;
    width: 100% !important;
    position: relative !important;
  }
  
  
  .journalit-dashboard-filters-section .journalit-dashboard-tickers-section {
    flex: 1 !important;
    min-width: 0 !important;
  }
  
  
  .journalit-responsive-account-filter,
  .journalit-responsive-ticker-filter,
  .journalit-responsive-tag-filter,
  .journalit-responsive-mistake-filter {
    width: auto !important;
    flex-shrink: 0 !important;
    
    white-space: nowrap !important;
    overflow: visible !important;
  }
  
  .journalit-dashboard-account-dropdown,
  .journalit-dashboard-ticker-dropdown,
  .journalit-dashboard-setup-dropdown,
  .journalit-dashboard-tag-dropdown,
  .journalit-dashboard-mistake-dropdown {
    position: relative !important;
    width: 100% !important;
  }
  
  .journalit-dashboard-account-summary,
  .journalit-dashboard-ticker-summary,
  .journalit-dashboard-setup-summary,
  .journalit-dashboard-tag-summary,
  .journalit-dashboard-mistake-summary {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 5px 10px !important;
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    font-size: 0.9em !important;
    white-space: nowrap !important;
    gap: 8px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    min-width: 0 !important;
  }

  .journalit-dashboard-summary-text {
    flex: 1 !important;
    min-width: 0 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .journalit-dashboard-account-summary:hover,
  .journalit-dashboard-ticker-summary:hover,
  .journalit-dashboard-setup-summary:hover,
  .journalit-dashboard-tag-summary:hover,
  .journalit-dashboard-mistake-summary:hover {
    border-color: var(--interactive-accent) !important;
    background-color: var(--background-modifier-hover) !important;
  }

  .journalit-dashboard-account-summary:focus-visible,
  .journalit-dashboard-ticker-summary:focus-visible,
  .journalit-dashboard-setup-summary:focus-visible,
  .journalit-dashboard-tag-summary:focus-visible,
  .journalit-dashboard-mistake-summary:focus-visible {
    outline: 2px solid var(--interactive-accent) !important;
    outline-offset: 2px !important;
  }
  
  .journalit-dashboard-account-summary .dropdown-arrow,
  .journalit-dashboard-ticker-summary .dropdown-arrow,
  .journalit-dashboard-setup-summary .dropdown-arrow,
  .journalit-dashboard-tag-summary .dropdown-arrow,
  .journalit-dashboard-mistake-summary .dropdown-arrow {
    font-size: 10px !important;
    color: var(--text-muted) !important;
  }
  
  .journalit-dashboard-account-options-dropdown,
  .journalit-dashboard-ticker-options-dropdown,
  .journalit-dashboard-setup-options-dropdown,
  .journalit-dashboard-tag-options-dropdown,
  .journalit-dashboard-mistake-options-dropdown {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    right: 0 !important;
    max-height: min(300px, 50vh) !important;
    overflow-y: auto !important;
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    margin-top: 4px !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
    z-index: 100 !important;
  }
  
  .journalit-dashboard-account-option-item,
  .journalit-dashboard-ticker-option-item,
  .journalit-dashboard-setup-option-item,
  .journalit-dashboard-tag-option-item,
  .journalit-dashboard-mistake-option-item {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    padding: 6px 10px !important;
    cursor: pointer !important;
    font-size: 13px !important;
  }
  
  .journalit-dashboard-account-option-item:hover,
  .journalit-dashboard-ticker-option-item:hover,
  .journalit-dashboard-setup-option-item:hover,
  .journalit-dashboard-tag-option-item:hover,
  .journalit-dashboard-mistake-option-item:hover {
    background-color: var(--background-modifier-hover) !important;
  }

  .journalit-dashboard-account-option-item:focus-visible,
  .journalit-dashboard-ticker-option-item:focus-visible,
  .journalit-dashboard-setup-option-item:focus-visible,
  .journalit-dashboard-tag-option-item:focus-visible,
  .journalit-dashboard-mistake-option-item:focus-visible {
    outline: 2px solid var(--interactive-accent) !important;
    outline-offset: -2px !important;
  }

  .journalit-dashboard-account-option-item > span:last-child,
  .journalit-dashboard-ticker-option-item > span:last-child,
  .journalit-dashboard-setup-option-item > span:last-child,
  .journalit-dashboard-tag-option-item > span:last-child,
  .journalit-dashboard-mistake-option-item > span:last-child {
    flex: 1 !important;
    min-width: 0 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
  
  .journalit-dashboard-account-option-item.select-all,
  .journalit-dashboard-ticker-option-item.select-all,
  .journalit-dashboard-tag-option-item.select-all,
  .journalit-dashboard-mistake-option-item.select-all {
    font-weight: 500 !important;
  }
  
  .journalit-dashboard-account-divider,
  .journalit-dashboard-ticker-divider,
  .journalit-dashboard-setup-divider,
  .journalit-dashboard-tag-divider,
  .journalit-dashboard-mistake-divider {
    height: 1px !important;
    background-color: var(--background-modifier-border) !important;
    margin: 4px 0 !important;
  }
  
  
  .journalit-dashboard-no-accounts,
  .journalit-dashboard-no-tickers,
  .journalit-dashboard-no-tags,
  .journalit-dashboard-no-mistakes {
    padding: 12px !important;
    color: var(--text-muted) !important;
    font-style: italic !important;
    text-align: center !important;
    font-size: 13px !important;
  }

  
  .journalit-dashboard-account-checkbox,
  .journalit-dashboard-ticker-checkbox,
  .journalit-dashboard-setup-checkbox,
  .journalit-dashboard-tag-checkbox,
  .journalit-dashboard-mistake-checkbox {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 14px !important;
    height: 14px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 2px !important;
    background-color: var(--background-primary) !important;
    font-size: 10px !important;
    color: var(--text-on-accent) !important;
    flex-shrink: 0 !important;
  }

  .journalit-dashboard-account-checkbox.checked,
  .journalit-dashboard-ticker-checkbox.checked,
  .journalit-dashboard-setup-checkbox.checked,
  .journalit-dashboard-tag-checkbox.checked,
  .journalit-dashboard-mistake-checkbox.checked {
    background-color: var(--interactive-accent) !important;
    border-color: var(--interactive-accent) !important;
  }

  
  .journalit-dashboard-setup-filter {
    display: flex !important;
    flex-direction: column !important;
    position: relative !important;
    min-width: 140px !important;
  }


  .journalit-dashboard-setup-option-all {
    font-weight: 500 !important;
  }

  .journalit-dashboard-reset-button {
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    padding: 5px 10px !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease !important;
    white-space: nowrap !important;
    height: 28px !important;
    line-height: 1 !important;
  }
  
  .journalit-dashboard-reset-button:hover {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
  }
  
  .journalit-dashboard-reset-button:disabled {
    opacity: 0.5 !important;
    cursor: default !important;
  }
  
  
  .journalit-dashboard-bottom-section {
    width: 100% !important;
    min-height: 500px !important;
    background-color: transparent !important;
    border-radius: 0 !important;
    padding: 4px !important; 
    position: relative !important;
  }

  .journalit-dashboard-grid-layout {
    padding: 0;
    margin: 0;
  }

  .journalit-dashboard-bottom-section-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 10px;
  }

  .journalit-dashboard-bottom-section-body {
    position: relative;
  }

  .journalit-dashboard-grid-error {
    padding: 20px;
    border: 2px solid var(--text-error);
    border-radius: 4px;
    background: var(--background-secondary);
  }

  .journalit-dashboard-grid-error__retry {
    margin-top: 10px;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid var(--background-modifier-border);
    background: var(--background-primary);
    color: var(--text-normal);
    cursor: pointer;
  }

  .journalit-dashboard-grid-error__retry:hover {
    background: var(--background-modifier-hover);
  }
  
  
  .journalit-dashboard-widget {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    background-color: transparent !important;
    border-radius: 6px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    
  }

  .journalit-dashboard-grid-layout.is-editing .react-grid-item:not(.react-grid-placeholder)::after {
    content: '' !important;
    position: absolute !important;
    inset: 0 !important;
    box-sizing: border-box !important;
    border: 2px dashed color-mix(in srgb, var(--interactive-accent) 65%, transparent) !important;
    border-radius: 6px !important;
    pointer-events: none !important;
    z-index: 50 !important;
  }
  
  
  .journalit-dashboard-widget-minimal-header {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 4px 12px !important;
    height: 24px !important;
    background-color: transparent !important;
    border-bottom: 1px solid rgba(var(--background-modifier-border-rgb), 0.4) !important;
    opacity: 0.8 !important;
  }
  
  .journalit-dashboard-widget-minimal-header .journalit-dashboard-widget-title {
    font-weight: 500 !important;
    font-size: 13px !important;
    color: var(--text-muted) !important;
    letter-spacing: 0.3px !important;
    text-align: center !important;
    width: 100% !important;
    
    text-shadow: 0 1px 1px rgba(var(--background-primary-rgb), 0.8) !important;
  }
  
  .journalit-dashboard-widget-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 12px 16px !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
  }
  
  .journalit-dashboard-widget-title {
    font-size: 16px !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
  }
  
  .journalit-dashboard-widget-controls {
    display: flex !important;
    gap: 8px !important;
  }
  
  .journalit-dashboard-widget-content {
    flex: 1 !important;
    padding: 4px 4px 2px 1px !important;
    overflow: hidden !important;
    background-color: transparent !important;
  }

  .journalit-dashboard-grid-layout.is-editing .journalit-dashboard-widget-content {
    pointer-events: none !important;
    user-select: none !important;
  }

  
  
  .journalit-dashboard-grid-layout .react-grid-item,
  .journalit-home-grid-layout .react-grid-item {
    background-color: transparent !important;
    border-radius: 6px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    transition: none !important;
    
  }

  .journalit-dashboard-grid-layout .react-grid-layout,
  .journalit-home-grid-layout .react-grid-layout,
  .journalit-dashboard-grid-layout .react-grid-item.cssTransforms,
  .journalit-home-grid-layout .react-grid-item.cssTransforms {
    transition: none !important;
  }

  .journalit-dashboard-grid-layout.is-resizing .react-grid-layout {
    min-height: var(--jit-dashboard-edit-grid-height) !important;
  }

  .journalit-dashboard-view .journalit-dashboard-widget,
  .journalit-dashboard-view .react-grid-item {
    box-shadow: none !important;
    text-shadow: none !important;
  }

  .journalit-dashboard-view .recharts-surface,
  .journalit-dashboard-view .recharts-surface * {
    filter: none !important;
  }

  .journalit-dashboard-static-grid {
    display: grid;
    grid-template-columns: repeat(var(--jit-grid-cols), minmax(0, 1fr));
    grid-auto-rows: var(--jit-grid-row-height);
    gap: var(--jit-grid-gap);
    align-items: stretch;
    width: 100%;
    box-sizing: border-box;
  }

  .journalit-dashboard-static-grid--absolute {
    position: relative;
    display: block;
    height: var(--jit-grid-height);
  }

  .journalit-dashboard-static-grid-item {
    grid-column: var(--jit-grid-column);
    grid-row: var(--jit-grid-row);
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
  }

  .journalit-dashboard-static-grid--absolute .journalit-dashboard-static-grid-item {
    position: absolute;
    left: var(--jit-grid-item-left);
    top: var(--jit-grid-item-top);
    width: var(--jit-grid-item-width);
    height: var(--jit-grid-item-height);
  }

  .journalit-dashboard-static-grid-item > .journalit-dashboard-widget {
    width: 100%;
    height: 100%;
  }

  .journalit-dashboard-grid-layout > .journalit-grid-edit-measuring,
  .journalit-home-grid-layout > .journalit-grid-edit-measuring {
    position: absolute !important;
    inset: 0 auto auto 0 !important;
    width: 100% !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

  .journalit-grid-static-hidden {
    position: absolute !important;
    inset: 0 auto auto 0 !important;
    width: 100% !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

  .journalit-grid-edit-placeholder {
    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    background: transparent !important;
  }
  
  .journalit-dashboard-grid-layout .react-grid-item.react-grid-placeholder,
  .journalit-home-grid-layout .react-grid-item.react-grid-placeholder {
    background-color: var(--interactive-accent) !important;
    opacity: 0.3 !important;
  }
  
  .journalit-dashboard-grid-layout .react-resizable-handle,
  .journalit-home-grid-layout .react-resizable-handle {
    position: absolute !important;
    bottom: 0 !important;
    right: 0 !important;
    width: 20px !important;
    height: 20px !important;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(120, 120, 120, 0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 22L12 12M22 13V22H13"></path></svg>') !important;
    background-position: bottom right !important;
    padding: 0 3px 3px 0 !important;
    background-repeat: no-repeat !important;
    background-origin: content-box !important;
    box-sizing: border-box !important;
    cursor: se-resize !important;
    display: none !important; 
  }
  
  
  .journalit-dashboard-grid-layout.is-editing .react-resizable-handle {
    display: block !important;
    width: 18px !important;
    height: 18px !important;
    bottom: 5px !important;
    right: 5px !important;
    padding: 0 !important;
    opacity: 0.8 !important;
    z-index: 60 !important;
    background-image: none !important;
    border-right: 3px solid color-mix(in srgb, var(--interactive-accent) 85%, transparent) !important;
    border-bottom: 3px solid color-mix(in srgb, var(--interactive-accent) 85%, transparent) !important;
    border-radius: 0 0 5px 0 !important;
  }

  .journalit-dashboard-grid-layout.is-editing .react-resizable-handle:hover {
    opacity: 1 !important;
    border-color: var(--interactive-accent) !important;
  }

  
  .journalit-home-grid-layout.is-editing .react-resizable-handle {
    display: block !important;
    position: absolute !important;
    width: 18px !important;
    height: 18px !important;
    bottom: 5px !important;
    right: 5px !important;
    cursor: se-resize !important;
    opacity: 0.8 !important;
    z-index: 60 !important;
    padding: 0 !important;
    background-image: none !important;
    border-right: 3px solid color-mix(in srgb, var(--interactive-accent) 85%, transparent) !important;
    border-bottom: 3px solid color-mix(in srgb, var(--interactive-accent) 85%, transparent) !important;
    border-radius: 0 0 5px 0 !important;
  }

  .journalit-home-grid-layout.is-editing .react-resizable-handle:hover {
    opacity: 1 !important;
    border-color: var(--interactive-accent) !important;
  }

  
  .journalit-dashboard-view .recharts-wrapper {
    width: 100% !important;
    height: 100% !important;
  }
  
  .journalit-dashboard-view .recharts-cartesian-grid-horizontal line,
  .journalit-dashboard-view .recharts-cartesian-grid-vertical line {
    stroke: var(--background-modifier-border) !important;
    stroke-dasharray: 2 !important;
  }
  
  
  .journalit-dashboard-view .recharts-tooltip-wrapper {
    pointer-events: none !important;
    z-index: 1000 !important;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25)) !important;
    background-color: transparent !important;
    border: none !important;
  }
  
  .journalit-dashboard-view .recharts-tooltip-wrapper * {
    outline: none !important;
  }
  
  .journalit-dashboard-custom-tooltip {
    background-color: var(--background-primary, #ffffff) !important;
    border-radius: 8px !important;
    padding: 12px 16px !important;
    min-width: 120px !important;
    border: 1px solid var(--background-modifier-border, rgba(0, 0, 0, 0.05)) !important;
    transform: translateY(-4px) !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
    position: relative !important;
  }
  
  
  .journalit-dashboard-tooltip-date {
    font-size: 14px !important;
    font-weight: 500 !important;
    color: var(--text-normal, #333333) !important;
    margin-bottom: 6px !important;
    text-align: center !important;
  }
  
  .journalit-dashboard-tooltip-value {
    font-size: 18px !important;
    font-weight: 600 !important;
    text-align: center !important;
  }
  
  .journalit-dashboard-tooltip-value.positive {
    color: var(--text-success, #43a047) !important;
  }
  
  .journalit-dashboard-tooltip-value.negative {
    color: var(--text-error, #e53935) !important;
  }
  
  
  .journalit-dashboard-calendar {
    width: 100% !important;
    height: var(--journalit-dashboard-calendar-height, 100%) !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: auto !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  .journalit-dashboard-calendar-inner {
    display: flex;
    flex-direction: column;
    animation: calendarFadeIn 0.5s ease-out;
    padding: 0 6px 6px 0;
    min-height: 100%;
  }
  
  .journalit-dashboard-calendar-header {
    display: grid !important;
    grid-template-columns: repeat(7, 1fr) 1fr !important; 
    margin-bottom: 10px !important;
    gap: 4px !important;
    position: sticky !important;
    top: 0 !important;
    background-color: var(--background-primary) !important;
    z-index: 5 !important;
    padding: 6px 0 !important;
    width: 100% !important;
    justify-content: stretch !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    border-radius: 6px !important;
  }
  
  
  
  .journalit-dashboard-calendar-header.hide-weekends,
  .journalit-dashboard-calendar .hide-weekends .journalit-dashboard-calendar-header,
  .journalit-dashboard-calendar.hide-weekends .journalit-dashboard-calendar-header,
  .journalit-dashboard-calendar.weekends-hidden .journalit-dashboard-calendar-header {
    grid-template-columns: repeat(5, 1fr) 1fr !important;
    width: 100% !important;
  }

  .journalit-dashboard-calendar-weekday {
    text-align: center;
    font-weight: 500;
    font-size: 12px;
    color: var(--text-muted);
    display: block;
  }

  .journalit-dashboard-calendar-weekday--primary {
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.5px;
  }

  .journalit-dashboard-calendar-weekday--first {
    display: block !important;
  }

  .journalit-dashboard-calendar-weekday.weekly-pnl-header {
    text-align: center;
    font-weight: 700;
    font-size: 13px;
    color: var(--text-on-accent);
    background-color: var(--interactive-accent);
    border-left: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 0 6px 6px 0;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  }
  
  .journalit-dashboard-calendar-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
    flex: 1 !important;
    width: 100% !important;
  }
  
  .journalit-dashboard-calendar-week {
    display: grid !important;
    grid-template-columns: repeat(7, 1fr) 1fr !important; 
    gap: 4px !important;
    margin-bottom: 4px !important;
    width: 100% !important;
  }
  
  
  .journalit-dashboard-calendar-week.hide-weekends,
  .journalit-dashboard-calendar .hide-weekends .journalit-dashboard-calendar-week,
  .journalit-dashboard-calendar.hide-weekends .journalit-dashboard-calendar-week,
  .journalit-dashboard-calendar.weekends-hidden .journalit-dashboard-calendar-week {
    grid-template-columns: repeat(5, 1fr) 1fr !important;
    width: 100% !important;
  }
  
  
  .journalit-dashboard-calendar.hide-weekends,
  .journalit-dashboard-calendar.weekends-hidden {
    width: 100% !important;
  }
  
  
  .journalit-dashboard-calendar-day,
  .journalit-dashboard-calendar-weekly-pnl {
    width: 100% !important; 
  }
  
  
  .theme-light .journalit-dashboard-calendar-weekday.weekly-pnl-header {
    background-color: var(--interactive-accent, #5e81ac) !important; 
    color: var(--text-on-accent, #ffffff) !important; 
  }

  
  .journalit-dashboard-calendar-weekly-pnl {
    aspect-ratio: 1 !important;
    position: relative !important;
    background-color: var(--background-secondary-alt) !important;
    border-radius: 8px !important;
    padding: 4px !important;
    border-left: 1px solid rgba(0, 0, 0, 0.08) !important;
    cursor: pointer !important;
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 0 0 1px var(--background-modifier-border) !important;
    color: var(--text-normal) !important;
  }
  
  .journalit-dashboard-calendar-weekly-pnl:hover {
    transform: scale(1.05) !important;
  }
  
  .journalit-dashboard-calendar-weekly-pnl.positive {
    background-color: rgba(var(--color-green-rgb), 0.15) !important;
    color: var(--color-green) !important;
  }
  
  .journalit-dashboard-calendar-weekly-pnl.negative {
    background-color: rgba(var(--color-red-rgb), 0.15) !important;
    color: var(--color-red) !important;
  }
  
  
  .journalit-dashboard-calendar-week-total-label {
    font-size: 11px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    color: var(--text-muted) !important;
    position: absolute !important;
    top: 25% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 100% !important;
    text-align: center !important;
  }

  .journalit-dashboard-calendar-week-total-value {
    font-size: 13px !important;
    font-weight: 700 !important;
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 100% !important;
    text-align: center !important;
  }

  .journalit-dashboard-calendar-week-trade-count {
    font-size: 10px !important;
    color: var(--text-muted) !important;
    font-weight: 500 !important;
    position: absolute !important;
    bottom: 20% !important;
    left: 50% !important;
    transform: translate(-50%, 50%) !important;
    width: 85% !important;
    text-align: center !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  
  .journalit-dashboard-calendar-day {
    aspect-ratio: 1 !important;
    display: flex !important;
    position: relative !important; 
    border-radius: 8px !important;
    cursor: pointer !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    transition: all 0.2s !important;
    background-color: var(--background-secondary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  }
  
  .journalit-dashboard-calendar-day:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
  
  .journalit-dashboard-calendar-day.positive {
    background-color: rgba(var(--color-green-rgb), 0.15) !important;
    background-image: linear-gradient(to bottom, rgba(var(--color-green-rgb), 0.05), rgba(var(--color-green-rgb), 0.2)) !important;
    color: var(--color-green) !important;
    border-color: rgba(var(--color-green-rgb), 0.3) !important;
    box-shadow: 0 2px 8px rgba(var(--color-green-rgb), 0.1) !important;
  }
  
  .journalit-dashboard-calendar-day.negative {
    background-color: rgba(var(--color-red-rgb), 0.15) !important;
    background-image: linear-gradient(to bottom, rgba(var(--color-red-rgb), 0.05), rgba(var(--color-red-rgb), 0.2)) !important;
    color: var(--color-red) !important;
    border-color: rgba(var(--color-red-rgb), 0.3) !important;
    box-shadow: 0 2px 8px rgba(var(--color-red-rgb), 0.1) !important;
  }
  
  .journalit-dashboard-calendar-day.positive:hover {
    box-shadow: 0 4px 12px rgba(var(--color-green-rgb), 0.2), 0 0 0 1px rgba(var(--color-green-rgb), 0.5) !important;
  }
  
  .journalit-dashboard-calendar-day.negative:hover {
    box-shadow: 0 4px 12px rgba(var(--color-red-rgb), 0.2), 0 0 0 1px rgba(var(--color-red-rgb), 0.5) !important;
  }
  
  .journalit-dashboard-calendar-day.other-month {
    opacity: 0.3 !important;
  }
  
  
  .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number,
  .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number,
  .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number {
    position: absolute !important;
    top: 4px !important;
    left: 4px !important;
    text-align: left !important;
    font-size: 12px !important;
    font-weight: 500 !important;
  }
  
  
  .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl,
  .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl,
  .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl {
    font-size: 12px !important; 
    width: 100% !important;
    position: absolute !important;
    top: 46% !important; 
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    margin-top: 0 !important;
    font-weight: 600 !important;
    text-align: center !important;
  }
  
  
  .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades,
  .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades,
  .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades {
    font-size: 10px !important;
    width: 100% !important;
    position: absolute !important;
    top: 70% !important; 
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    margin-top: 0 !important;
    font-weight: 400 !important;
    text-align: center !important;
    color: var(--text-muted) !important;
  }
  
  
  .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-week-number,
  .journalit-dashboard-calendar .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-week-number,
  .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-week-number {
    position: absolute !important;
    top: 4px !important;
    left: 4px !important;
    text-align: left !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    margin-bottom: 0 !important;
  }
  
  
  .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-weekly-pnl-value,
  .journalit-dashboard-calendar .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-weekly-pnl-value,
  .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-weekly-pnl-value {
    font-size: 12px !important; 
    width: 100% !important;
    position: absolute !important;
    top: 46% !important; 
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    font-weight: 600 !important;
    text-align: center !important;
  }
  
  
  .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-weekly-trades,
  .journalit-dashboard-calendar .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-weekly-trades,
  .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-weekly-trades {
    font-size: 10px !important;
    width: 100% !important;
    position: absolute !important;
    top: 70% !important; 
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    font-weight: 400 !important;
    text-align: center !important;
    color: var(--text-muted) !important;
  }
  
  
  .journalit-dashboard-recent-trades {
    width: 100% !important;
    height: 100% !important;
    overflow: auto !important;
    
    padding: 0 8px 8px 8px !important;
    position: relative !important;
  }
  
  .journalit-dashboard-recent-trades-table {
    width: 100% !important;
    border-collapse: collapse !important;
    
    padding-top: 8px !important;
    margin-top: 0 !important;
  }
  
  .journalit-dashboard-recent-trades-table th {
    text-align: center !important;
    padding: 7px 8px !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    color: var(--text-muted) !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    position: sticky !important;
    top: 0 !important;
    background-color: var(--background-primary) !important;
    z-index: 10 !important;
  }

  .journalit-dashboard-recent-trades-table td {
    text-align: center !important;
    padding: 7px 8px !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    font-size: 13px !important;
  }
  
  .journalit-dashboard-recent-trades-table .trade-row {
    cursor: pointer !important;
    transition: background-color 0.15s ease !important;
  }

  .journalit-dashboard-recent-trades-table .trade-row:hover {
    background-color: var(--background-modifier-hover) !important;
  }
  
  .journalit-dashboard-recent-trades-table .ticker-cell {
    font-weight: 600 !important;
  }
  
  .journalit-dashboard-recent-trades-table .direction-cell {
    font-weight: 500 !important;
  }
  
  .journalit-dashboard-recent-trades-table .pnl-cell {
    font-weight: 600 !important;
  }
  
  .journalit-dashboard-recent-trades-table .pnl-cell.positive {
    color: var(--text-success) !important;
  }

  .journalit-dashboard-recent-trades-table .pnl-cell.negative {
    color: var(--text-error) !important;
  }
  
  .journalit-dashboard-recent-trades-table .empty-message {
    text-align: center !important;
    padding: 16px !important;
    color: var(--text-muted) !important;
    font-style: italic !important;
  }

  .journalit-dashboard-recent-trades-empty-cell {
    padding: 20px 0 !important;
    text-align: center !important;
    height: 150px !important;
    position: relative !important;
  }

  .journalit-dashboard-recent-trades-empty-wrapper {
    position: absolute !important;
    inset: 0 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
  
  
  .journalit-dashboard-calendar-day.today,
  .journalit-dashboard-calendar .journalit-dashboard-calendar-day.today,
  .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day.today {
    border: 2px solid var(--interactive-accent) !important;
    box-shadow: 0 0 6px rgba(var(--interactive-accent-rgb), 0.4) !important;
    position: relative !important;
    z-index: 2 !important; 
    animation: pulseBorder 2s infinite ease-in-out !important;
  }
  
  .journalit-dashboard-calendar-day.neutral,
  .journalit-dashboard-calendar-weekly-pnl.neutral {
    background-color: var(--background-modifier-hover, rgba(128, 128, 128, 0.16)) !important;
    background-image: linear-gradient(
      to bottom,
      var(--background-modifier-hover, rgba(160, 160, 160, 0.08)),
      var(--background-modifier-active, rgba(96, 96, 96, 0.18))
    ) !important;
    color: var(--text-normal) !important;
    border-color: var(--background-modifier-border, rgba(128, 128, 128, 0.36)) !important;
    box-shadow: 0 2px 8px rgba(var(--background-modifier-border-rgb, 128, 128, 128), 0.18) !important;
  }

  .journalit-dashboard-calendar-day.neutral:hover,
  .journalit-dashboard-calendar-weekly-pnl.neutral:hover {
    box-shadow: 0 4px 12px rgba(var(--background-modifier-border-rgb, 128, 128, 128), 0.24),
      0 0 0 1px rgba(var(--background-modifier-border-rgb, 128, 128, 128), 0.5) !important;
  }

  
  .journalit-dashboard-calendar {
    overflow: hidden !important;
    min-height: 0 !important;
    container-type: size !important;
  }

  .journalit-dashboard-calendar-inner {
    box-sizing: border-box !important;
    min-height: 0 !important;
    height: 100% !important;
    padding: 0 4px !important;
    gap: clamp(2px, 1.2cqh, 6px) !important;
    animation: none !important;
  }

  .journalit-dashboard-calendar-month-toolbar {
    display: grid !important;
    grid-template-columns: 24px 1fr 24px !important;
    align-items: center !important;
    gap: 6px !important;
    flex: 0 0 clamp(24px, 8cqh, 34px) !important;
  }

  .journalit-dashboard-calendar-current-month {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.35em !important;
    height: 100% !important;
    text-align: center !important;
    font-size: clamp(12px, 3.4cqw, 15px) !important;
    font-weight: 700 !important;
    letter-spacing: 0.04em !important;
    color: var(--text-normal) !important;
    text-transform: uppercase !important;
    line-height: 1 !important;
  }

  .journalit-dashboard-calendar .journalit-dashboard-calendar-header-link {
    appearance: none !important;
    display: inline !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    cursor: pointer !important;
    color: inherit !important;
    font: inherit !important;
    letter-spacing: inherit !important;
    text-transform: inherit !important;
    line-height: inherit !important;
  }

  .journalit-dashboard-calendar .journalit-dashboard-calendar-header-link:hover {
    color: var(--interactive-accent) !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .journalit-dashboard-calendar .journalit-dashboard-calendar-header-link:focus-visible {
    outline: 1px solid var(--interactive-accent) !important;
    outline-offset: 2px !important;
    border-radius: 2px !important;
  }

  .journalit-dashboard-calendar-header-separator {
    color: inherit !important;
  }

  .journalit-calendar-sidebar {
    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    container-type: inline-size !important;
  }

  .journalit-calendar-sidebar .journalit-dashboard-calendar {
    height: clamp(260px, 115cqw, 360px) !important;
    max-height: 360px !important;
  }

  .journalit-calendar-sidebar-loading {
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: var(--text-muted) !important;
    font-size: var(--font-ui-small) !important;
  }

  .journalit-dashboard-calendar .journalit-dashboard-calendar-nav-button {
    appearance: none !important;
    width: 24px !important;
    height: 100% !important;
    min-height: 24px !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: transparent !important;
    color: var(--text-muted) !important;
    font-size: 15px !important;
    font-weight: 700 !important;
    line-height: 1 !important;
    box-shadow: none !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .journalit-dashboard-calendar .journalit-dashboard-calendar-nav-button:hover {
    background: transparent !important;
    color: var(--text-normal) !important;
    box-shadow: none !important;
  }

  .journalit-dashboard-calendar-header {
    position: static !important;
    flex: 0 0 18px !important;
    padding: 0 !important;
    margin: 0 !important;
    gap: clamp(2px, 1cqw, 4px) !important;
    background: transparent !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .journalit-dashboard-calendar-weekday {
    font-size: clamp(8px, 2cqw, 10px) !important;
    font-weight: 800 !important;
    letter-spacing: 0.12em !important;
    color: var(--text-muted) !important;
    text-transform: uppercase !important;
    line-height: 18px !important;
  }

  .journalit-dashboard-calendar-weekday.weekly-pnl-header {
    font-size: 10px !important;
    line-height: 18px !important;
    border-radius: 5px !important;
    background: var(--interactive-accent) !important;
    color: var(--text-on-accent) !important;
    box-shadow: none !important;
  }

  .journalit-dashboard-calendar-grid {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    display: grid !important;
    grid-template-rows: none !important;
    grid-auto-rows: minmax(0, 1fr) !important;
    gap: clamp(2px, 1cqw, 4px) !important;
    overflow: hidden !important;
  }

  .journalit-dashboard-calendar-week {
    min-height: 0 !important;
    margin: 0 !important;
    gap: 4px !important;
  }

  .journalit-dashboard-calendar-day,
  .journalit-dashboard-calendar-weekly-pnl {
    aspect-ratio: auto !important;
    min-width: 0 !important;
    min-height: 0 !important;
    height: 100% !important;
    border-radius: clamp(4px, 1.5cqw, 7px) !important;
    padding: clamp(2px, 1cqw, 4px) !important;
    background-image: none !important;
    transition: border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease !important;
    transform: none !important;
    box-shadow: inset 0 0 0 1px var(--background-modifier-border) !important;
  }

  .journalit-dashboard-grid-layout .journalit-dashboard-calendar-day:not(.has-trades),
  .journalit-dashboard-grid-layout .journalit-dashboard-calendar-weekly-pnl:not(.has-trades),
  .journalit-calendar-sidebar .journalit-dashboard-calendar-day:not(.has-trades),
  .journalit-calendar-sidebar .journalit-dashboard-calendar-weekly-pnl:not(.has-trades) {
    background: var(--calendar-day-bg-color, transparent) !important;
    background-color: var(--calendar-day-bg-color, transparent) !important;
    background-image: none !important;
    box-shadow: inset 0 0 0 1px var(--background-modifier-border) !important;
  }

  .journalit-dashboard-grid-layout .journalit-dashboard-calendar-day.has-trades.neutral,
  .journalit-dashboard-grid-layout .journalit-dashboard-calendar-weekly-pnl.has-trades.neutral,
  .journalit-calendar-sidebar .journalit-dashboard-calendar-day.has-trades.neutral,
  .journalit-calendar-sidebar .journalit-dashboard-calendar-weekly-pnl.has-trades.neutral {
    background: var(--background-modifier-hover, rgba(128, 128, 128, 0.16)) !important;
    background-color: var(--background-modifier-hover, rgba(128, 128, 128, 0.16)) !important;
    background-image: none !important;
    color: var(--text-normal) !important;
    border-color: var(--background-modifier-border) !important;
  }

  .journalit-dashboard-grid-layout.is-editing .journalit-dashboard-calendar-day,
  .journalit-dashboard-grid-layout.is-editing .journalit-dashboard-calendar-weekly-pnl {
    pointer-events: none !important;
    cursor: default !important;
  }

  .journalit-dashboard-calendar-day:not(.has-trades):hover {
    transform: none !important;
    box-shadow: inset 0 0 0 1px var(--background-modifier-border) !important;
    background: var(--calendar-day-bg-color, transparent) !important;
    background-color: var(--calendar-day-bg-color, transparent) !important;
  }

  .journalit-dashboard-calendar-day.other-month {
    cursor: default !important;
  }

  .journalit-dashboard-calendar-weekly-pnl:not(.has-trades):hover {
    transform: none !important;
    box-shadow: inset 0 0 0 1px var(--background-modifier-border) !important;
    background: var(--calendar-day-bg-color, transparent) !important;
    background-color: var(--calendar-day-bg-color, transparent) !important;
  }

  .journalit-dashboard-calendar-day.has-trades:hover,
  .journalit-dashboard-calendar-weekly-pnl.has-trades:hover,
  .journalit-dashboard-calendar-day.has-trades.positive:hover,
  .journalit-dashboard-calendar-day.has-trades.negative:hover,
  .journalit-dashboard-calendar-day.has-trades.neutral:hover,
  .journalit-dashboard-calendar-weekly-pnl.has-trades.neutral:hover {
    transform: none !important;
    box-shadow: inset 0 0 0 1px var(--text-muted) !important;
  }

  .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number,
  .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number,
  .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number {
    top: 4px !important;
    left: 5px !important;
    font-size: 10px !important;
    font-weight: 700 !important;
  }

  .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl,
  .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl,
  .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl {
    top: 48% !important;
    font-size: clamp(13px, 3.1cqw, 16px) !important;
    font-weight: 800 !important;
    line-height: 1 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades,
  .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades,
  .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades,
  .journalit-dashboard-calendar-week-trade-count {
    top: calc(48% + 13px) !important;
    bottom: auto !important;
    font-size: clamp(8.5px, 1.7cqw, 9.5px) !important;
    line-height: 1 !important;
    transform: translate(-50%, -50%) !important;
  }

  .journalit-dashboard-calendar-week-total-label {
    display: none !important;
  }

  .journalit-dashboard-calendar-week-total-value {
    top: 48% !important;
    font-size: clamp(13px, 3.1cqw, 16px) !important;
    font-weight: 800 !important;
    line-height: 1 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .journalit-dashboard-calendar-weekly-pnl {
    border-left: 0 !important;
    background: var(--calendar-day-bg-color, transparent) !important;
    box-shadow: inset 0 0 0 1px var(--background-modifier-border) !important;
  }

  .journalit-dashboard-calendar-weekly-pnl.positive {
    background: rgba(var(--color-green-rgb), 0.2) !important;
    box-shadow: inset 3px 0 0 rgba(var(--color-green-rgb), 0.85),
      inset 0 0 0 1px rgba(var(--color-green-rgb), 0.28) !important;
  }

  .journalit-dashboard-calendar-weekly-pnl.negative {
    background: rgba(var(--color-red-rgb), 0.2) !important;
    box-shadow: inset 3px 0 0 rgba(var(--color-red-rgb), 0.85),
      inset 0 0 0 1px rgba(var(--color-red-rgb), 0.28) !important;
  }

  .journalit-dashboard-calendar-weekly-pnl.has-trades:hover {
    box-shadow: inset 3px 0 0 currentColor,
      inset 0 0 0 1px var(--text-muted) !important;
  }


  .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-week-number,
  .journalit-dashboard-calendar .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-week-number,
  .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-week-number {
    position: absolute !important;
    top: 5px !important;
    left: 8px !important;
    font-size: clamp(9px, 2.4cqw, 11px) !important;
    line-height: 1 !important;
    font-weight: 700 !important;
    color: var(--text-muted) !important;
    opacity: 0.8 !important;
  }

  @container (max-width: 360px), (max-height: 260px) {
    .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades,
    .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades,
    .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades,
    .journalit-dashboard-calendar-week-trade-count {
      display: none !important;
    }

    .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl,
    .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl,
    .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl,
    .journalit-dashboard-calendar-week-total-value {
      top: 56% !important;
    }
  }

  @container (max-width: 300px), (max-height: 210px) {
    .journalit-dashboard-calendar-header {
      display: none !important;
    }

    .journalit-dashboard-calendar-month-toolbar {
      flex-basis: 20px !important;
    }

    .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number,
    .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number,
    .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number {
      font-size: 8px !important;
    }
  }





  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-number,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-week-number,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-week-number,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-week-number {
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    font-size: 10px !important;
    font-weight: 800 !important;
    color: currentColor !important;
    opacity: 1 !important;
  }

  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-pnl,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-grid .journalit-dashboard-calendar-day .journalit-dashboard-calendar-day-trades,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-week-total-value,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-week-trade-count {
    display: none !important;
  }

  .journalit-dashboard-calendar-day.today {
    animation: none !important;
    border: 1px solid var(--interactive-accent) !important;
  }
  
  
  .journalit-dashboard-trades-table {
    width: 100% !important;
    border-collapse: collapse !important;
  }
  
  .journalit-dashboard-trades-table th,
  .journalit-dashboard-trades-table td {
    padding: 8px 12px !important;
    text-align: left !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
  }
  
  .journalit-dashboard-trades-table th {
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    background-color: var(--background-secondary) !important;
    position: sticky !important;
    top: 0 !important;
    z-index: 1 !important;
  }
  
  .journalit-dashboard-trades-table tr:hover {
    background-color: var(--background-modifier-hover) !important;
  }
  
  
  .journalit-dashboard-layout-controls {
    display: flex !important;
    justify-content: flex-end !important;
    gap: 8px !important;
    margin-bottom: 16px !important;
  }
  
  
  .journalit-dashboard-view-container
    .journalit-dashboard-filter-actions
    .journalit-dashboard-edit-mode-button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    box-shadow: none !important;
    padding: 5px 10px !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease !important;
    white-space: nowrap !important;
    height: 28px !important;
    line-height: 1 !important;
  }
  
  .journalit-dashboard-view-container
    .journalit-dashboard-filter-actions
    .journalit-dashboard-edit-mode-button:hover {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
    box-shadow: none !important;
  }
  
  .journalit-dashboard-view-container
    .journalit-dashboard-filter-actions
    .journalit-dashboard-edit-mode-button.active {
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent, white) !important;
    border-color: var(--interactive-accent) !important;
    box-shadow: none !important;
  }

  
  .journalit-dashboard-view-container
    .journalit-dashboard-filter-actions
    .journalit-dashboard-add-widget-button {
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    box-shadow: none !important;
    padding: 5px 10px !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease !important;
    white-space: nowrap !important;
    height: 28px !important;
    line-height: 1 !important;
  }

  .journalit-dashboard-view-container
    .journalit-dashboard-filter-actions
    .journalit-dashboard-add-widget-button:hover {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
  }

  .journalit-dashboard-view-container
    .journalit-dashboard-filter-actions
    .journalit-dashboard-add-widget-button--primary {
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent) !important;
    border-color: var(--interactive-accent) !important;
  }

  .journalit-dashboard-view-container
    .journalit-dashboard-filter-actions
    .journalit-dashboard-add-widget-button--primary:hover {
    background-color: var(--interactive-accent-hover) !important;
    border-color: var(--interactive-accent-hover) !important;
  }

  
  .journalit-dashboard-loading,
  .journalit-dashboard-error {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 20px !important;
    font-size: 16px !important;
    color: var(--text-muted) !important;
  }
  
  .journalit-dashboard-error {
    color: var(--text-error) !important;
  }
  
  
  
  @media (max-width: 1560px) {
    
    .journalit-dashboard-filter-row.standard-responsive {
      grid-template-columns: minmax(300px, auto) auto 1fr auto !important;
      gap: 10px !important;
    }
    
    
    .journalit-dashboard-filters-section {
      flex-wrap: nowrap !important;
      max-width: fit-content !important;
      justify-content: flex-start !important;
    }
    
    
    .journalit-dashboard-account-filter,
    .journalit-dashboard-ticker-filter {
      min-width: 140px !important;
    }
    
    
    .journalit-dashboard-accounts-section {
      margin-left: 0 !important;
      padding-left: 0 !important;
    }
    
    
    .journalit-dashboard-filter-section {
      width: 100% !important;
    }
    
    
    .journalit-dashboard-date-range-inputs,
    .journalit-dashboard-custom-date-dropdown {
      width: 300px !important;
    }
  }
  
  
  @media (max-width: 1200px) {
    
    .journalit-dashboard-view {
      padding: 12px !important;
    }

    .journalit-dashboard-metric-card {
      min-width: 100% !important;
    }

    
    .journalit-dashboard-filter-actions {
      gap: 6px !important;
    }

    .journalit-dashboard-filter-actions button {
      padding: 6px !important;
      min-width: auto !important;
    }
  }
  
  
  @media (max-width: 1000px) {
    
    .journalit-dashboard-view {
      padding: 10px !important;
    }

    .journalit-dashboard-metric-card {
      min-width: 100% !important;
      min-height: 94px !important;
      padding: 12px !important;
    }

    .journalit-dashboard-metric-value {
      font-size: 20px !important;
    }

    
    .journalit-dashboard-date-range-inputs,
    .journalit-dashboard-custom-date-dropdown {
      width: 300px !important;
    }

    
    .journalit-dashboard-primary-filters {
      max-width: 500px !important;
    }

    .journalit-dashboard-header,
    .journalit-dashboard-header-compact {
      gap: 12px !important;
    }
  }
  
  
  @media (max-width: 900px) {
    
    .journalit-dashboard-filter-controls {
      padding: 10px 12px !important;
    }
    
    
    .journalit-dashboard-filter-row.standard-responsive {
      
      grid-template-columns: 1fr auto auto !important;
      gap: 8px !important;
    }
    
    
    .journalit-dashboard-date-range-section {
      margin-right: 5px !important;
    }
    
    
    
    .journalit-dashboard-filter-actions.button-container {
      gap: 8px !important; 
    }
    
    
    .journalit-dashboard-filter-controls.compact-view .journalit-dashboard-reset-button,
    .journalit-dashboard-filter-controls.compact-view .journalit-dashboard-edit-mode-button {
      height: 28px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    .journalit-dashboard-reset-button,
    .journalit-dashboard-edit-mode-button {
      padding: 4px 8px !important;
      font-size: 11px !important;
    }
    
    
    .journalit-dashboard-account-filter {
      min-width: 120px !important;
    }

    
    .journalit-dashboard-primary-filters {
      max-width: 450px !important;
    }

    .journalit-dashboard-header,
    .journalit-dashboard-header-compact {
      gap: 8px !important;
    }
  }

  
  @media (max-width: 768px) {
    
    .journalit-dashboard-filter-controls:not(.compact-view) {
      
      
    }
    
    
    .journalit-dashboard-filter-row.standard-responsive,
    .journalit-dashboard-filter-row.medium-responsive,
    .journalit-dashboard-filter-row {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
    }
    
    .journalit-dashboard-filter-row.compact,
    .journalit-dashboard-filter-row.medium-responsive {
      display: flex !important;
      flex-direction: column !important;
      width: 100% !important;
    }
    
    .journalit-dashboard-date-range-section,
    .journalit-dashboard-accounts-section,
    .journalit-dashboard-filter-actions,
    .journalit-dashboard-filter-section {
      width: 100% !important;
      margin: 8px 0 !important;
    }
    
    .journalit-dashboard-reset-button {
      margin: 5px 0 !important;
      width: 100% !important;
    }

    .journalit-dashboard-edit-mode-button {
      margin: 5px 0 !important;
    }
    
    .journalit-dashboard-account-filter {
      width: 100% !important;
    }
    
    
    .journalit-dashboard-account-dropdown,
    .journalit-dashboard-account-summary {
      width: 100% !important;
    }
    
    
    .journalit-dashboard-date-range-section {
      margin-right: 0 !important;
      width: 100% !important;
      min-width: auto !important;
    }
    
    .journalit-dashboard-custom-date-anchor {
      display: flex !important;
      flex-direction: column !important;
    }

    
    .journalit-dashboard-date-range-inputs,
    .journalit-dashboard-custom-date-dropdown {
      position: static !important;
      width: 300px !important;
      margin-top: 8px !important;
      flex-direction: column !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1) !important;
      border: 1px solid var(--background-modifier-border) !important;
      left: auto !important;
      right: auto !important;
    }

    .journalit-dashboard-view .journalit-dashboard-date-range-inputs.journalit-dashboard-custom-date-dropdown {
      width: 300px !important;
      max-width: none !important;
    }

    .journalit-dashboard-custom-date-dropdown.position-left,
    .journalit-dashboard-custom-date-dropdown.position-below {
      position: static !important;
      left: auto !important;
      right: auto !important;
    }
    
    
    .journalit-dashboard-metrics {
      flex-wrap: wrap !important;
      justify-content: center !important;
    }
    
    .journalit-dashboard-metric-card {
      min-width: calc(50% - 8px) !important;
      max-width: none !important;
      flex: 0 0 calc(50% - 8px) !important;
      margin-bottom: 8px !important;
    }

    
    .journalit-dashboard-filter-actions {
      gap: 4px !important;
      flex-wrap: nowrap !important;
    }

    .journalit-dashboard-filter-actions button {
      padding: 4px 6px !important;
      font-size: 11px !important;
    }

    .journalit-dashboard-edit-layout-button span {
      display: none !important; 
    }
  }

  
  @media (max-width: 480px) {
    
    .journalit-dashboard-view {
      padding: 8px !important;
    }
    
    
    .journalit-dashboard-filter-controls.compact-view {
      padding: 8px !important;
    }
    
    
    .journalit-dashboard-metric-card {
      min-width: 100% !important;
      flex: 0 0 100% !important;
      margin-bottom: 8px !important;
    }
    
    
    .journalit-dashboard-reset-button,
    .journalit-dashboard-edit-mode-button,
    .journalit-dashboard-add-component-button {
      padding: 10px !important;
      height: auto !important;
      min-height: 40px !important;
    }
    
    
    .journalit-dashboard-date-range-presets {
      flex-wrap: wrap !important;
      justify-content: center !important;
    }
    
    .journalit-dashboard-date-range-presets button {
      flex: 0 1 auto !important;
      margin: 2px !important;
      font-size: 11px !important;
      padding: 4px 8px !important;
    }
    
    
    .journalit-dashboard-component-selector {
      width: 90vw !important;
      max-height: 80vh !important;
      margin-top: 50px !important;
    }

    
    .journalit-dashboard-filter-actions {
      gap: 2px !important;
    }

    .journalit-dashboard-filter-actions button {
      padding: 4px !important;
    }
  }

  
  @media (max-width: 360px) {
    
    .journalit-dashboard-view {
      padding: 4px !important;
    }
    
    .journalit-dashboard-filter-controls {
      padding: 6px !important;
    }
    
    
    .journalit-dashboard-top-section,
    .journalit-dashboard-bottom-section {
      padding: 2px !important;
    }
    
    
    .journalit-dashboard-date-range-presets button {
      padding: 3px 6px !important;
      font-size: 10px !important;
    }
  }

  
  @media screen and (max-width: 1160px) {
    .journalit-dashboard-primary-filters {
      max-width: 600px !important;
    }
  }

  
  .unified-selector-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background-color: rgba(0, 0, 0, 0.4) !important;
    backdrop-filter: blur(3px) !important;
    z-index: 1000 !important; 
    display: flex !important;
    align-items: flex-start !important;
    justify-content: center !important;
    padding: 20px !important;
    pointer-events: none !important; 
  }
  
  .journalit-dashboard-component-selector {
    position: relative !important;
    margin-top: 100px !important;
    width: 480px !important;
    max-height: 75vh !important;
    overflow-y: auto !important;
    background-color: var(--background-primary) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    z-index: 1001 !important; 
    pointer-events: auto !important; 
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 16px 64px rgba(0, 0, 0, 0.1) !important;
    max-width: 90vw !important;
    animation: fadeInScale 0.25s cubic-bezier(0.19, 1, 0.22, 1) !important;
  }

  .journalit-dashboard-unified-selector-button-container {
    display: flex !important;
    justify-content: center !important;
    margin: 0 0 4px 0 !important; 
    padding: 4px !important; 
    background-color: transparent !important;
    border-radius: 8px !important;
    border: 1px dashed var(--background-modifier-border) !important;
  }
  
  .journalit-dashboard-add-component-button {
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent, white) !important;
    border: none !important;
    border-radius: 6px !important;
    padding: 8px 16px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
  
  .journalit-dashboard-add-component-button:hover {
    background-color: var(--interactive-accent-hover) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
  }
  
  .journalit-dashboard-component-selector-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 16px 20px !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    background-color: var(--background-secondary-alt) !important;
    border-radius: 12px 12px 0 0 !important;
  }
  
  .journalit-dashboard-component-selector-header h3 {
    font-size: 18px !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    margin: 0 !important;
  }
  
  .journalit-dashboard-component-selector-close {
    width: 28px !important;
    height: 28px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 6px !important;
    background-color: var(--background-modifier-hover) !important;
    color: var(--text-muted) !important;
    transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1) !important;
    border: none !important;
    padding: 0 !important;
    cursor: pointer !important;
  }
  
  .journalit-dashboard-component-selector-close svg {
    width: 14px !important;
    height: 14px !important;
    display: block !important;
  }
  
  .journalit-dashboard-component-selector-close:hover {
    background-color: var(--background-modifier-error-hover) !important;
    color: white !important;
    transform: rotate(90deg) !important;
  }
  
  .journalit-dashboard-component-selector-search {
    padding: 12px 20px !important;
    position: relative !important;
  }
  
  .journalit-dashboard-component-selector-search input {
    width: 100% !important;
    padding: 10px 16px !important;
    border-radius: 8px !important;
    background-color: var(--background-modifier-form-field) !important;
    border: 1px solid var(--background-modifier-border) !important;
    font-size: 14px !important;
    transition: all 0.2s ease !important;
    color: var(--text-normal) !important;
  }
  
  .journalit-dashboard-component-selector-search input:focus {
    box-shadow: 0 0 0 2px var(--interactive-accent) !important;
    border-color: var(--interactive-accent) !important;
    outline: none !important;
  }
  
  .journalit-dashboard-component-selector-categories {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
    padding: 0 20px 12px !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    justify-content: center !important; 
  }
  
  .journalit-dashboard-component-selector-category {
    border-radius: 20px !important;
    padding: 6px 14px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    background-color: var(--background-secondary) !important;
    color: var(--text-muted) !important;
    border: 1px solid transparent !important;
    transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1) !important;
    box-shadow: none !important;
    cursor: pointer !important;
  }
  
  .journalit-dashboard-component-selector-category:hover {
    background-color: var(--background-modifier-hover) !important;
    color: var(--text-normal) !important;
    transform: translateY(-1px) !important;
  }
  
  .journalit-dashboard-component-selector-category.active {
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent, white) !important;
    font-weight: 600 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 2px 8px rgba(var(--interactive-accent-rgb), 0.3) !important;
  }
  
  .journalit-dashboard-component-selector-list {
    padding: 16px 20px !important;
    max-height: 50vh !important;
    overflow-y: auto !important;
    scrollbar-width: thin !important;
  }
  
  .journalit-dashboard-component-selector-list h4 {
    font-size: 15px !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    margin: 0 0 12px 0 !important;
    padding-bottom: 8px !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
  }
  
  
  .journalit-dashboard-component-selector-item {
    background-color: var(--background-secondary) !important;
    border-radius: 10px !important;
    padding: 14px 16px !important;
    margin-bottom: 10px !important;
    cursor: pointer !important;
    position: relative !important;
    transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1) !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
    border: 1px solid transparent !important;
  }

  .journalit-dashboard-component-selector-item[data-is-added="true"] {
    opacity: 0.5;
  }
  
  .journalit-dashboard-component-selector-item:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    background-color: var(--background-primary) !important;
    border-color: var(--interactive-accent) !important;
  }
  
  
  .journalit-dashboard-component-selector-widget-name {
    font-size: 15px !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    margin-bottom: 6px !important;
  }
  
  
  .journalit-dashboard-component-selector-divider {
    height: 1px !important;
    background-color: var(--background-modifier-border) !important;
    margin: 16px 0 20px !important;
    opacity: 0.7 !important;
  }
  
  .journalit-dashboard-component-selector-widget-description {
    font-size: 13px !important;
    color: var(--text-muted) !important;
    margin-bottom: 10px !important;
    line-height: 1.4 !important;
  }
  
  
  .journalit-dashboard-component-selector-widget-category {
    display: inline-block !important;
    font-size: 11px !important;
    font-weight: 500 !important;
    color: var(--text-normal) !important;
    background-color: var(--background-secondary-alt) !important;
    padding: 3px 8px !important;
    border-radius: 12px !important;
    margin-top: 4px !important;
  }
  
  
  .journalit-dashboard-component-selector-widget-badge {
    position: absolute !important;
    top: 12px !important;
    right: 12px !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    color: white !important;
    background: linear-gradient(135deg, var(--text-success), #2e7d32) !important;
    padding: 3px 10px !important;
    border-radius: 12px !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
  
  
  .journalit-dashboard-component-selector-empty {
    text-align: center !important;
    padding: 24px 0 !important;
    color: var(--text-muted) !important;
    font-style: italic !important;
    background-color: var(--background-secondary-alt) !important;
    border-radius: 8px !important;
    font-size: 14px !important;
  }
  
  
  .journalit-dashboard-component-selector-list::-webkit-scrollbar {
    width: 8px !important;
  }
  
  .journalit-dashboard-component-selector-list::-webkit-scrollbar-track {
    background: transparent !important;
  }
  
  .journalit-dashboard-component-selector-list::-webkit-scrollbar-thumb {
    background-color: var(--background-modifier-border) !important;
    border-radius: 4px !important;
    border: 2px solid var(--background-primary) !important;
  }
  
  .journalit-dashboard-component-selector-list::-webkit-scrollbar-thumb:hover {
    background-color: var(--interactive-accent) !important;
  }
  
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  
  @keyframes pulseBorder {
    0% {
      box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2), 0 4px 12px rgba(var(--interactive-accent-rgb), 0.25);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(var(--interactive-accent-rgb), 0.15), 0 4px 16px rgba(var(--interactive-accent-rgb), 0.3);
    }
    100% {
      box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2), 0 4px 12px rgba(var(--interactive-accent-rgb), 0.25);
    }
  }
  
  
  .journalit-dashboard-widget-container {
    background-color: transparent !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .journalit-dashboard-widget-body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: transparent;
    position: relative;
  }

  .journalit-dashboard-directional-chart-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .journalit-dashboard-directional-chart-section {
    flex: 1 1 50%;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .journalit-dashboard-directional-chart-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
    line-height: 1.2;
  }

  .journalit-dashboard-directional-chart-body {
    flex: 1 1 auto;
    min-height: 0;
  }

  .journalit-dashboard-directional-chart-empty {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.9rem;
    padding: 0.75rem;
  }


  .journalit-dashboard-widget-error {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-align: center;
    padding: 16px;
    color: var(--text-error);
  }
  
  
  .journalit-dashboard-widget-container .journalit-empty-state {
    background-color: transparent !important;
    min-height: 140px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 auto !important;
    position: absolute !important; 
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
  }
  
  .journalit-dashboard-widget-container .journalit-empty-state-icon {
    margin-bottom: 12px !important;
    color: var(--text-muted) !important;
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
  }
  
  .journalit-dashboard-widget-container .journalit-empty-state-message {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    text-align: center !important;
    width: 100% !important;
  }
  
  .journalit-dashboard-widget-container .journalit-empty-state-submessage {
    font-size: 12px !important;
    color: var(--text-muted) !important;
    text-align: center !important;
    width: 100% !important;
  }
  
  
  .journalit-dashboard-view .journalit-empty-state {
    margin: 0 auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 200px !important;
    width: 100% !important;
  }
  
  
  .journalit-dashboard-recent-trades-table td .journalit-empty-state {
    padding: 16px !important;
    min-height: 100px !important;
    background-color: transparent !important;
  }
`;


export function forceDashboardStyles(): void {
  return;
}


