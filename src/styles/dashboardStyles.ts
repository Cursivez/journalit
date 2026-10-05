
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
    --journalit-dashboard-gutter: 16px;
    height: 100%;
    padding: 0 !important;
    overflow: hidden !important;
  }

  
  .journalit-dashboard-view {
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    background-color: var(--journalit-dashboard-surface-background, var(--background-primary)) !important;
    background-size: 20px 20px !important;
    background-position: 0 0 !important;
    padding: var(--journalit-dashboard-view-padding, 0 var(--journalit-dashboard-gutter) var(--journalit-dashboard-gutter)) !important;
    overflow-x: hidden !important;
    overflow-y: var(--journalit-dashboard-overflow-y, auto) !important;
    scrollbar-gutter: var(--journalit-dashboard-scrollbar-gutter, stable) !important;
    margin-top: 0 !important; 
  }
  
  
  .journalit-dashboard-unified-container {
    
    overflow: var(--journalit-dashboard-content-overflow, visible);
    scrollbar-gutter: var(--journalit-dashboard-content-scrollbar-gutter, auto);
    display: flex !important;
    flex-direction: column !important;
    gap: 2.5px !important; 
    background-color: transparent !important;
    padding: var(--journalit-dashboard-content-padding, 0) !important;
    box-sizing: border-box;
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
    padding: 0 4px !important; 
    background-color: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  
  
  .journalit-dashboard-metrics {
    --journalit-dashboard-metric-columns: var(--journalit-dashboard-metric-medium-columns);
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100% !important; 
    align-items: stretch !important; 
    height: auto !important; 
    min-height: auto !important; 
    padding: 0 !important; 
  }
  
  .journalit-dashboard-top-section-body {
    position: relative !important;
    width: 100% !important;
    container: journalit-dashboard-metrics / inline-size;
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

  .journalit-dashboard-metric-tooltip__note {
    margin-top: 4px;
  }

  .journalit-dashboard-metric-tooltip__hint {
    margin-top: 6px;
    color: var(--text-muted);
  }

  
  .journalit-dashboard-metric-wrapper {
    position: relative !important;
    display: flex !important;
    flex: 1 1 calc((100% - (var(--journalit-dashboard-metric-columns) - 1) * 8px) / var(--journalit-dashboard-metric-columns));
    min-width: 0;
  }

  .journalit-dashboard-metric-wrapper--sortable {
    height: 100% !important;
  }

  .journalit-dashboard-metric-wrapper[data-dragging="true"] {
    z-index: 3;
  }

  .journalit-dashboard-metric-handle[data-editing="true"] .journalit-dashboard-metric-handle-inner {
    touch-action: manipulation;
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
    background-color: var(--journalit-dashboard-widget-background, var(--background-primary)) !important;
    border-radius: 8px !important;
    border: 1px solid color-mix(in srgb, var(--text-normal) 8%, transparent) !important;
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
    color: var(--text-accent) !important;
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

  
  .journalit-dashboard-metric-name
    > .journalit-dashboard-metric-icons-trigger {
    display: inline-flex !important;
    flex: 0 0 auto !important;
    width: auto !important;
    gap: 4px !important;
    transform: translateY(-1px) !important;
    cursor: help !important;
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

  .journalit-dashboard-metric-unrealized {
    font-size: 11px;
    line-height: 1.2;
    font-weight: 500;
    font-style: italic;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .journalit-dashboard-metric-unrealized.positive {
    color: var(--color-green);
  }

  .journalit-dashboard-metric-unrealized.negative {
    color: var(--color-red);
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

  
  @container journalit-dashboard-metrics (min-width: 1504px) {
    .journalit-dashboard-metrics {
      --journalit-dashboard-metric-columns: var(--journalit-dashboard-metric-wide-columns);
    }
  }

  @container journalit-dashboard-metrics (max-width: 751px) {
    .journalit-dashboard-metrics {
      --journalit-dashboard-metric-columns: var(--journalit-dashboard-metric-narrow-columns);
    }

    .journalit-dashboard-metric-card {
      min-height: 94px;
      padding: 12px;
    }

    .journalit-dashboard-metric-value {
      font-size: 20px;
    }
  }

  @container journalit-dashboard-metrics (max-width: 375px) {
    .journalit-dashboard-metrics {
      --journalit-dashboard-metric-columns: 1;
    }
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
    border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 40%, transparent);
    position: relative;
  }

  .journalit-dashboard-trades-chart__title {
    font-weight: 500;
    font-size: 13px;
    color: var(--text-muted);
    letter-spacing: 0.3px;
    text-align: center;
    opacity: 0.8;
    text-shadow: 0 1px 1px color-mix(in srgb, var(--background-primary) 80%, transparent);
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
    border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 40%, transparent);
    position: relative;
  }

  .journalit-dashboard-daily-performance-chart__title {
    font-weight: 500;
    font-size: 13px;
    color: var(--text-muted);
    letter-spacing: 0.3px;
    text-align: center;
    opacity: 0.8;
    text-shadow: 0 1px 1px color-mix(in srgb, var(--background-primary) 80%, transparent);
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
    flex-shrink: 0;
    display: flex !important;
    flex-direction: column !important;
    margin-bottom: 0 !important;
    
    padding: 8px var(--journalit-dashboard-toolbar-gutter, 0px) 10px !important;
    background-color: var(--journalit-dashboard-toolbar-background, var(--background-primary)) !important;
    border-radius: 0 !important;
    box-shadow: none;
    position: sticky !important;
    top: 0 !important;
    z-index: 30 !important;
  }

  @supports (animation-timeline: scroll()) {
    .journalit-dashboard-view {
      scroll-timeline: --journalit-dashboard-scroll block;
    }

    .journalit-dashboard-filter-controls {
      animation: journalit-dashboard-toolbar-elevate linear both;
      animation-timeline: --journalit-dashboard-scroll;
      animation-range: 0 32px;
    }
  }

  @keyframes journalit-dashboard-toolbar-elevate {
    from {
      box-shadow: 0 1px 0 transparent;
    }
    to {
      box-shadow: 0 1px 0 var(--background-modifier-border);
    }
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
    gap: 6px !important;
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
    width: 32px !important;
    height: 28px !important;
    min-width: 32px !important;
    min-height: 28px !important;
    box-sizing: border-box !important;
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
    
    padding: 0 4px !important;
    box-sizing: border-box !important;
    flex-wrap: wrap !important;
  }

  .journalit-dashboard-primary-filters {
    display: flex !important;
    align-items: center !important;
    flex: 1 1 auto !important;
    min-width: 0 !important;
  }

  
  .journalit-dashboard-date-range-filter {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    min-width: 0 !important;
  }
  
  .journalit-dashboard-date-range-presets {
    display: flex !important;
    flex-wrap: nowrap !important;
    gap: 6px !important;
    align-items: center !important;
    min-width: 0 !important;
    overflow-x: auto !important;
    scrollbar-width: none !important;
  }

  .journalit-dashboard-date-range-presets::-webkit-scrollbar {
    display: none !important;
  }
  
  .journalit-dashboard-date-range-presets button.journalit-native-button {
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
  
  .journalit-dashboard-date-range-presets button.journalit-native-button:hover {
    background-color: var(--background-modifier-hover) !important;
    border-color: var(--interactive-accent) !important;
  }
  
  .journalit-dashboard-date-range-presets button.journalit-native-button.active {
    background-color: var(--interactive-accent) !important;
    color: var(--text-on-accent, white) !important;
    border-color: var(--interactive-accent) !important;
  }

  .journalit-dashboard-custom-date-anchor {
    display: inline-flex !important;
  }

  .journalit-dashboard-custom-date-dropdown {
    display: grid !important;
    grid-template-columns: max-content minmax(0, max-content) !important;
    gap: 8px !important;
    align-items: center !important;
    padding: 10px 12px !important;
    box-sizing: border-box !important;
    background-color: var(--background-primary) !important;
    border-radius: 8px !important;
    border: 1px solid var(--background-modifier-border) !important;
    position: fixed;
    top: var(--journalit-dashboard-date-dropdown-top);
    left: var(--journalit-dashboard-date-dropdown-left);
    z-index: 1000;
    width: max-content;
    max-width: calc(100vw - 32px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  
  .journalit-dashboard-custom-date-dropdown.date-dropdown-visible {
    animation: journalit-date-dropdown-fade-in 0.2s ease-out !important;
  }

  @keyframes journalit-date-dropdown-fade-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .journalit-dashboard-custom-date-dropdown--measuring {
    visibility: hidden;
    pointer-events: none;
  }

  .journalit-dashboard-custom-date-dropdown > .journalit-date-range-editor {
    grid-column: 1 / -1;
  }

  
  .journalit-date-picker-input {
    width: auto !important;
    min-width: 0 !important;
  }
  
  
  .journalit-date-picker-input .journalit-fast-datetime__container {
    width: 100% !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    
    padding: 2px;
    border: none !important;
    border-radius: 0 !important;
    background: transparent !important;
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
    width: 40px;
    min-width: 40px;
    max-width: 40px;
    padding: 6px 4px !important;
  }
  
  .journalit-date-picker-input input:focus {
    border-color: var(--interactive-accent) !important;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--interactive-accent) 20%, transparent) !important;
    outline: none !important;
  }
  
  .journalit-date-picker-input input:hover {
    border-color: var(--interactive-hover) !important;
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
    background-color: var(--journalit-dashboard-widget-background, transparent) !important;
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
    border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 40%, transparent) !important;
    opacity: var(--journalit-dashboard-widget-header-opacity, 0.8) !important;
  }
  
  .journalit-dashboard-widget-minimal-header .journalit-dashboard-widget-title {
    font-weight: 500 !important;
    font-size: 13px !important;
    color: var(--journalit-dashboard-widget-title-color, var(--text-muted)) !important;
    letter-spacing: 0.3px !important;
    text-align: center !important;
    width: 100% !important;
    
    text-shadow: 0 1px 1px color-mix(in srgb, var(--background-primary) 80%, transparent) !important;
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
    color: var(--text-on-accent) !important;
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
    animation: journalit-calendar-fade-in 0.5s ease-out;
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
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 8px 8px 8px !important;
    position: relative !important;
    container: journalit-recent-trades / inline-size;
  }
  
  .journalit-dashboard-recent-trades-table {
    width: 100% !important;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(4, minmax(max-content, 1fr));
    grid-template-rows: auto minmax(0, 1fr);
    margin-top: 0 !important;
  }

  
  .journalit-dashboard-recent-trades-table thead,
  .journalit-dashboard-recent-trades-table tbody {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    min-height: 0;
    scrollbar-gutter: stable;
    overflow: hidden;
  }

  .journalit-dashboard-recent-trades-table tbody {
    overflow-y: auto;
    align-content: start;
  }

  .journalit-dashboard-recent-trades-table tr {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
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
    background-color: transparent;
  }

  .journalit-dashboard-recent-trades-table td {
    text-align: center !important;
    padding: 7px 8px !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    font-size: 13px !important;
  }

  @container journalit-recent-trades (max-width: 360px) {
    .journalit-dashboard-recent-trades-table th {
      padding: 7px 4px;
      font-size: 11px;
      letter-spacing: 0;
    }

    .journalit-dashboard-recent-trades-table td {
      padding: 7px 4px;
      font-size: 12px;
    }
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
    grid-column: 1 / -1;
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
    box-shadow: 0 0 6px color-mix(in srgb, var(--interactive-accent) 40%, transparent) !important;
    position: relative !important;
    z-index: 2 !important; 
    animation: journalit-dashboard-pulse-border 2s infinite ease-in-out !important;
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
    box-shadow: 0 2px 8px color-mix(in srgb, var(--text-normal) 18%, transparent) !important;
  }

  .journalit-dashboard-calendar-day.neutral:hover,
  .journalit-dashboard-calendar-weekly-pnl.neutral:hover {
    box-shadow: 0 4px 12px color-mix(in srgb, var(--text-normal) 24%, transparent),
      0 0 0 1px color-mix(in srgb, var(--text-normal) 50%, transparent) !important;
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
    color: var(--text-accent) !important;
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

  
  .journalit-dashboard-calendar-day .journalit-dashboard-calendar-reviewed-badge,
  .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-reviewed-badge {
    position: absolute !important;
    top: 3px !important;
    right: 3px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: var(--color-green) !important;
    opacity: 0.85 !important;
    pointer-events: none !important;
  }

  
  .journalit-dashboard-calendar-day .journalit-dashboard-calendar-reviewed-dot,
  .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-reviewed-dot {
    display: none !important;
  }

  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-day .journalit-dashboard-calendar-reviewed-badge,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-reviewed-badge {
    display: none !important;
  }

  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-day .journalit-dashboard-calendar-reviewed-dot,
  .journalit-dashboard-calendar.is-compact .journalit-dashboard-calendar-weekly-pnl .journalit-dashboard-calendar-reviewed-dot {
    display: block !important;
    position: absolute !important;
    
    top: calc(75% + 1.5px) !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 4px !important;
    height: 4px !important;
    border-radius: 50% !important;
    background-color: var(--color-green) !important;
    pointer-events: none !important;
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
    width: 32px !important;
    min-width: 32px !important;
    padding: 5px !important;
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
    
    

    
    
    .journalit-dashboard-accounts-section {
      margin-left: 0 !important;
      padding-left: 0 !important;
    }
    
    
    .journalit-dashboard-filter-section {
      width: 100% !important;
    }
    
  }
  
  
  @media (max-width: 1200px) {
    
    .journalit-dashboard-view-container {
      --journalit-dashboard-gutter: 12px;
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
    
    .journalit-dashboard-view-container {
      --journalit-dashboard-gutter: 10px;
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
      padding: 8px var(--journalit-dashboard-toolbar-gutter, 0px) !important;
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
    
    .journalit-dashboard-reset-button {
      padding: 4px 8px !important;
      font-size: 11px !important;
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
    
    

    
    
    .journalit-dashboard-date-range-section {
      margin-right: 0 !important;
      width: 100% !important;
      min-width: auto !important;
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
    
    .journalit-dashboard-view-container {
      --journalit-dashboard-gutter: 8px;
    }
    
    
    .journalit-dashboard-filter-controls.compact-view {
      padding: 8px var(--journalit-dashboard-toolbar-gutter, 0px) !important;
    }
    
    
    .journalit-dashboard-reset-button,
    .journalit-dashboard-edit-mode-button {
      padding: 10px !important;
      height: auto !important;
      min-height: 40px !important;
    }
    
    
    .journalit-dashboard-date-range-presets {
      flex-wrap: nowrap !important;
      justify-content: flex-start !important;
    }
    
    .journalit-dashboard-date-range-presets button.journalit-native-button {
      flex: 0 1 auto !important;
      margin: 2px !important;
      font-size: 11px !important;
      padding: 4px 8px !important;
    }
    

    
    .journalit-dashboard-filter-actions {
      gap: 2px !important;
    }

    .journalit-dashboard-filter-actions button {
      padding: 4px !important;
    }
  }

  
  @media (max-width: 360px) {
    
    .journalit-dashboard-view-container {
      --journalit-dashboard-gutter: 4px;
    }
    
    .journalit-dashboard-filter-controls {
      padding: 6px var(--journalit-dashboard-toolbar-gutter, 0px) !important;
    }

    
    .journalit-dashboard-top-section,
    .journalit-dashboard-bottom-section {
      padding: 2px !important;
    }
    
    
    .journalit-dashboard-date-range-presets button.journalit-native-button {
      padding: 3px 6px !important;
      font-size: 10px !important;
    }
  }

  
  @media screen and (max-width: 1160px) {
    .journalit-dashboard-primary-filters {
      max-width: 600px !important;
    }
  }

  
  
  @keyframes journalit-dashboard-pulse-border {
    0% {
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--interactive-accent) 20%, transparent), 0 4px 12px color-mix(in srgb, var(--interactive-accent) 25%, transparent);
    }
    50% {
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--interactive-accent) 15%, transparent), 0 4px 16px color-mix(in srgb, var(--interactive-accent) 30%, transparent);
    }
    100% {
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--interactive-accent) 20%, transparent), 0 4px 12px color-mix(in srgb, var(--interactive-accent) 25%, transparent);
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


