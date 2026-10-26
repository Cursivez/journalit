

export const DRC_STYLES = `
  
  .drc-container {
    background-color: transparent; 
    border-radius: 0; 
    box-shadow: none; 
    margin: 0; 
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-family: var(--font-interface, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
    position: relative; 
    z-index: 1; 
    transform: translateZ(0); 
    will-change: auto !important; 
    contain: layout style !important; 
  }

  
  .drc-container .selected-option-remove {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 16px !important;
    height: 16px !important;
    min-width: 16px !important; 
    min-height: 16px !important; 
    padding: 0 !important;
    margin-left: 4px !important;
    cursor: pointer !important;
    background: rgba(255, 255, 255, 0.2) !important;
    border: none !important;
    border-radius: 50% !important;
    color: var(--text-on-accent, white) !important;
    font-size: 16px !important;
    line-height: 1 !important; 
    text-align: center !important;
    z-index: 7 !important;
    position: relative !important;
    transition: background-color 0.2s !important;
  }

  
  .drc-header {
    padding: 16px 20px 12px;
    background-color: var(--background-secondary);
    text-align: center;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  
  .drc-title {
    font-size: 28px;
    font-weight: 600;
    color: var(--text-normal);
    margin-bottom: 20px;
    text-align: center;
  }

  .drc-date-container {
    font-size: 28px;
    font-weight: 600;
    color: var(--text-normal);
    margin-bottom: 20px;
    text-align: center;
  }

  
  .drc-tabs-container {
    background-color: var(--background-secondary-alt, #2a2a2a);
    border-bottom: 1px solid var(--background-modifier-border);
    display: flex;
    justify-content: center;
    padding: 0;
  }

  
  .drc-tabs {
    display: flex;
    justify-content: center;
    background-color: transparent;
    max-width: 600px;
    margin: 0 auto;
  }

  .drc-tab {
    padding: 12px 24px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    outline: none;
    border-bottom: 2px solid transparent;
  }

  .drc-tab:hover {
    color: var(--text-normal);
    background-color: rgba(127, 127, 127, 0.05);
  }

  .drc-tab.active {
    color: var(--text-accent);
    border-bottom: 2px solid var(--text-accent);
  }

  .drc-tab.active::after {
    content: none; 
  }

  
  .drc-section {
    margin: 0 0 24px 0; 
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 16px;
    background-color: var(--background-primary);
    width: 100%; 
    box-sizing: border-box; 
  }

  
  .drc-section:last-child {
    margin-bottom: 0 !important;
  }

  
  .drc-section:first-child {
    margin-top: 0 !important;
  }

  .drc-section h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 16px;
    color: var(--text-normal);
    border-bottom: 1px solid var(--background-modifier-border);
    padding-bottom: 8px;
    text-align: center;
  }

  
  .drc-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .drc-stat-card {
    background-color: var(--background-secondary);
    border-radius: 6px;
    padding: 16px;
    text-align: center;
    transition: transform 0.2s;
    min-width: 0; 
  }

  .drc-stat-card:hover {
    transform: translateY(-2px);
  }
  
  
  .drc-stats .drc-stat-card:nth-child(4) {
    min-width: 140px; 
  }

  .drc-stat-label {
    font-size: 12px;
    color: var(--text-muted);
  }

  
  .drc-grades {
    display: grid;
    grid-template-columns: minmax(200px, 1fr) minmax(200px, 1fr) !important;
    gap: 16px !important;
    margin-bottom: 24px !important;
    align-items: end !important;
  }

  
  .drc-trade-table {
    width: 100%;
    border-collapse: collapse;
  }

  .drc-trade-table th {
    text-align: left;
    padding: 10px;
    border-bottom: 2px solid var(--background-modifier-border);
    font-weight: 600;
    color: var(--text-normal);
  }

  .drc-trade-table td {
    padding: 10px;
    border-bottom: 1px solid var(--background-modifier-border);
    color: var(--text-normal);
  }

  .drc-trade-table td.positive {
    color: var(--color-success, #43a047);
  }

  .drc-trade-table td.negative {
    color: var(--color-error, #e53935);
  }

  .drc-trade-table select,
  .drc-trade-table input {
    width: 100%;
    padding: 6px 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
  }
  
  
  .weekly-review-trades-table {
    
    th:first-child {
      width: 60px !important; 
      text-align: center !important;
      padding: 8px 4px !important;
    }
    
    
    .trade-preview-cell {
      width: 60px !important;
      padding: 4px !important;
      text-align: center !important;
      vertical-align: middle !important;
    }
    
    
    .trade-image-wrapper {
      position: relative !important;
      width: 48px !important; 
      height: 48px !important;
      display: inline-block !important;
      cursor: pointer !important;
      overflow: hidden !important;
      border-radius: 4px !important;
      border: 1px solid var(--background-modifier-border) !important;
    }
    
    
    .trade-preview-thumbnail {
      width: 100% !important;
      height: 100% !important;
    }
    
    
    .trade-preview-placeholder {
      width: 100% !important;
      height: 100% !important;
      background-color: var(--background-modifier-hover) !important;
      border-radius: 4px !important;
    }
    
    
    .trade-no-image-icon {
      color: var(--text-muted) !important;
      opacity: 0.5 !important;
    }
    
    
    .trade-image-wrapper:hover {
      transform: scale(1.05) !important;
      transition: all 0.2s ease !important;
    }
  }
  
  .weekly-review-trades-table {
    width: 100% !important;
    overflow-x: auto !important;
    margin-bottom: 16px !important;
  }

  .weekly-review-trades-table table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-size: 16px !important;
    text-align: center !important;
    margin: 0 !important;
    table-layout: auto !important;
  }

  .weekly-review-trades-table th {
    padding: 10px 12px !important;
    border-bottom: 2px solid var(--background-modifier-border) !important;
    font-weight: 600 !important;
    color: var(--text-normal) !important;
    background-color: var(--background-secondary) !important;
    text-align: center !important;
    white-space: nowrap !important;
  }

  .weekly-review-trades-table td {
    padding: 8px 12px !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    text-align: center !important;
    transition: background-color 0.2s ease !important;
  }

  .weekly-review-trades-table tr:hover td {
    background-color: var(--background-modifier-hover) !important;
  }

  .weekly-review-trade-row {
    cursor: pointer !important;
  }

  .weekly-review-trade-row:hover {
    background-color: var(--background-modifier-hover) !important;
  }

  
  .drc-container .selected-option-remove:hover {
    background: rgba(255, 255, 255, 0.4) !important; 
  }


.drc-missed-trade-images-container {
  margin-top: 16px;
}

  
  .drc-goal-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    gap: 10px;
  }

  .drc-goal-item input {
    flex: 1;
  }

  
  @media (max-width: 768px) {
    .drc-grades {
      grid-template-columns: 1fr;
    }

    .drc-stats {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }

    .drc-trade-table {
      display: block;
      overflow-x: auto;
    }

    
    .drc-tab {
      padding: 10px 16px;
      font-size: 13px;
    }
  }

  
  .drc-note-grades {
    display: grid !important;
    grid-template-columns: minmax(200px, 1fr) minmax(200px, 1fr) !important;
    gap: 16px !important;
    margin-bottom: 24px !important;
    align-items: end !important;
  }

  .drc-note-grade-label {
    font-size: 16px !important;
    font-weight: 500 !important;
    color: var(--text-normal) !important;
    margin-bottom: 8px !important;
    display: block !important;
    text-align: center !important;
  }

  
  .drc-note-grades {
    display: grid !important;
    grid-template-columns: minmax(200px, 1fr) minmax(200px, 1fr) !important;
    gap: 16px !important;
    margin-bottom: 24px !important;
    align-items: center !important;
  }

  .drc-note-grade-label {
    font-size: 16px !important;
    font-weight: 500 !important;
    color: var(--text-normal) !important;
    margin-bottom: 12px !important;
    display: block !important;
    text-align: center !important;
    width: 100% !important;
  }

  
  @media (max-width: 768px) {
    .drc-note-grades {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }

    
    .drc-levels-container {
      flex-direction: column !important;
    }
  }

  @media (min-width: 768px) {
    .drc-levels-container {
      flex-direction: row !important;
      gap: 16px !important;
    }
  }

  
  .drc-key-levels {
    margin-top: 16px !important;
  }
  
  
  .icon-select-container {
    position: relative !important;
    display: inline-block !important;
    width: 40px !important;
    height: 32px !important;
    vertical-align: middle !important;
  }
  
  

  .drc-levels-container {
    display: flex !important;
    flex-direction: column !important;
    gap: 24px !important;
  }

  .support-header {
    color: var(--color-success, #43a047) !important;
  }

  .resistance-header {
    color: var(--color-error, #e53935) !important;
  }

  .drc-level-add-container {
    margin-bottom: 12px !important;
  }

  

  .drc-image-container {
    margin-bottom: 12px;
  }

  .drc-image-label {
    font-size: 16px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .drc-image-error {
    color: var(--text-error, var(--color-red, #e53935));
    font-size: 12px;
    text-align: center;
    margin-top: 4px;
    margin-bottom: 8px;
    padding: 6px 10px;
    background-color: rgba(229, 57, 53, 0.1);
    border-radius: 4px;
    width: 100%;
  }

  

  .drc-fullscreen-image-container {
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background-color: var(--background-primary);
    max-height: calc(90vh - 120px);
    
    background-image: linear-gradient(45deg, var(--background-secondary) 25%, transparent 25%, transparent 75%, var(--background-secondary) 75%),
               linear-gradient(45deg, var(--background-secondary) 25%, transparent 25%, transparent 75%, var(--background-secondary) 75%);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
  }

  
  .drc-weekly-events {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  
  .drc-eod-images {
    padding: 16px;
    background-color: var(--background-secondary);
    border-radius: 6px;
  }

  
  .drc-container .metadata-container {
    position: relative !important;
    z-index: 1 !important;
    transform: translateZ(0) !important;
    will-change: auto !important;
  }

  
  .drc-container .tab-content {
    position: relative !important;
    z-index: 1 !important;
  }

  
  .drc-container::before {
    content: '';
    display: table;
  }

  
  .drc-container .metadata-container[style*="position"] {
    position: relative !important;
  }

  
  .drc-container select,
  .drc-container input,
  .drc-container textarea {
    box-sizing: border-box !important;
    max-width: 100% !important;
  }

  
  @media (max-width: 600px) {
    .drc-container input[role="combobox"],
    .drc-trade-table input,
    .drc-goal-item input {
      font-size: 18px !important;
    }
  }

  
  .journalit-count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 600;
    font-family: var(--font-interface);
    font-variant-numeric: tabular-nums;
    line-height: 1;
    text-align: center;
    cursor: help;
  }

  .journalit-count-badge--mistakes {
    background: rgba(244, 67, 54, 0.15);
    color: var(--color-red);
    border: 1px solid rgba(244, 67, 54, 0.3);
  }

  .journalit-count-badge--mistakes:hover {
    background: rgba(244, 67, 54, 0.25);
  }

  .journalit-count-badge--setups {
    background: rgba(var(--color-blue-rgb), 0.15);
    color: var(--color-blue);
    border: 1px solid rgba(var(--color-blue-rgb), 0.3);
  }

  .journalit-count-badge--setups:hover {
    background: rgba(var(--color-blue-rgb), 0.25);
  }

  
  .trade-mistakes-cell,
  .trade-setups-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trade-no-data {
    color: var(--text-faint);
    font-size: 13px;
  }

  
  .journalit-tooltip .tooltip-title {
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--text-normal);
  }

  .journalit-tooltip .tooltip-item {
    color: var(--text-muted);
    margin: 2px 0;
    line-height: 1.4;
  }

  .journalit-tooltip.mistakes-tooltip .tooltip-title {
    color: var(--color-red);
  }

  .journalit-tooltip.setups-tooltip .tooltip-title {
    color: var(--text-accent);
  }
`;
