



const DRC_STYLES = `
  
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

  
  .drc-container .combobox-container,
  .drc-container [data-combobox-type],
  .drc-missed-trade .combobox-container,
  .drc-missed-trade .drc-input-group.field .combobox-container {
    position: relative !important;
    width: 100% !important;
    margin-bottom: 8px !important;
    z-index: 10 !important;
  }

  
  .drc-container .combobox-container[data-is-open="true"],
  .drc-container [data-combobox-type][data-is-open="true"],
  .drc-missed-trade .combobox-container[data-is-open="true"],
  .drc-missed-trade .drc-input-group.field .combobox-container[data-is-open="true"] {
    z-index: 9999 !important;
  }

  
  .drc-container [data-combobox-type] .input-container::after,
  .drc-missed-trade .combobox-container .input-container::after,
  .drc-missed-trade .drc-input-group.field .combobox-container .input-container::after {
    content: "" !important;
    position: absolute !important;
    right: 12px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    width: 0 !important;
    height: 0 !important;
    border-left: 5px solid transparent !important;
    border-right: 5px solid transparent !important;
    border-top: 5px solid var(--text-normal) !important;
    pointer-events: none !important;
    z-index: 10 !important;
  }

  
  .drc-container [data-combobox-type] input[role="combobox"],
  .drc-missed-trade .combobox-container input[role="combobox"],
  .drc-missed-trade .drc-input-group.field .combobox-container input[role="combobox"] {
    padding-right: 30px !important;
    width: 100% !important;
    padding: 8px 12px !important;
    padding-right: 30px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    font-size: 16px !important;
    cursor: pointer !important;
  }

  
  .drc-missed-trade .selected-options,
  .drc-missed-trade .selected-item,
  .drc-missed-trade [data-combobox-type="multi"] > div:first-of-type {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 4px !important;
    max-width: 100% !important;
    padding: 2px 0 !important;
    z-index: 5 !important;
    position: relative !important;
  }

  
  .drc-missed-trade .selected-option,
  .drc-missed-trade .selected-item,
  .drc-container .selected-option,
  .drc-container .selected-item {
    display: inline-flex !important;
    align-items: center !important;
    background-color: var(--interactive-accent, #7c3aed) !important; 
    color: var(--text-on-accent, white) !important;
    border-radius: 4px !important;
    padding: 4px 8px !important; 
    font-size: 12px !important; 
    margin: 0 4px 4px 0 !important; 
    font-weight: 500 !important;
    z-index: 6 !important;
    position: relative !important;
    gap: 6px !important; 
  }

  
  .drc-missed-trade .selected-option-remove,
  .drc-missed-trade .selected-item button,
  .drc-container .selected-option-remove,
  .drc-container .selected-item button {
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

  .drc-date-display {
    font-size: 28px;
    font-weight: 600;
    color: var(--text-normal);
    margin-bottom: 20px;
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

  .drc-navigation {
    width: 100%;
    padding-top: 10px;
    border-top: 1px solid var(--background-modifier-border-subtle, rgba(127, 127, 127, 0.1));
  }

  .drc-navigation-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    width: 100% !important;
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

  
  .drc-content {
    padding: 20px 0 0; 
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

  
  .drc-checklist {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .drc-checklist-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 4px;
    background-color: var(--background-secondary);
    transition: background-color 0.2s ease;
    cursor: pointer !important; 
  }

  
  .drc-checklist-item input[type="checkbox"] {
    margin-right: 10px;
    vertical-align: middle !important;
  }

  .drc-checklist-item:hover {
    background-color: var(--background-modifier-hover);
  }

  
  .drc-input-group {
    margin-bottom: 16px;
  }

  .drc-input-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-normal);
  }

  .drc-input-group input,
  .drc-input-group textarea,
  .drc-input-group select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    font-size: 16px;
  }

  .drc-input-group textarea,
  .drc-textarea {
    width: 100%;
    min-height: 80px;
    padding: 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    font-family: var(--font-text);
    font-size: 16px;
    resize: vertical;
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

  .drc-stat-value {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
    color: var(--text-normal);
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis; 
  }

  .drc-stat-value.positive {
    color: var(--color-success, #43a047);
  }

  .drc-stat-value.negative {
    color: var(--color-error, #e53935);
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

  .drc-grade {
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    min-width: 200px !important;
    padding: 16px !important;
  }

  .drc-grade select {
    font-size: 16px;
    font-weight: 600;
    padding: 10px 16px;
    height: auto;
    line-height: 1.5;
    text-align-last: center;
    appearance: menulist-button;
    -webkit-appearance: menulist-button;
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
    
    
    .trade-image-count-indicator {
      position: absolute !important;
      bottom: 2px !important;
      right: 2px !important;
      background-color: rgba(0, 0, 0, 0.7) !important;
      color: var(--text-on-accent) !important;
      font-size: 10px !important;
      font-weight: bold !important;
      padding: 1px 4px !important;
      border-radius: 3px !important;
      line-height: 1 !important;
      pointer-events: none !important; 
      z-index: 2 !important;
    }
    
    
    .trade-no-image-icon {
      color: var(--text-muted) !important;
      opacity: 0.5 !important;
    }
    
    
    .trade-image-wrapper:hover {
      transform: scale(1.05) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
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

  
  .drc-nav-button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 8px 14px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    cursor: pointer !important;
    font-size: 16px !important;
    transition: all 0.2s !important;
    text-align: center !important;
    flex: 1 !important;
    min-width: 120px !important;
    box-sizing: border-box !important;
  }

  .drc-nav-button:hover {
    background-color: var(--background-modifier-hover) !important;
    transform: translateY(-1px) !important;
  }

  
  .drc-reflection-item {
    margin-bottom: 16px;
  }

  .drc-reflection-item label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: var(--text-normal);
  }

  .drc-reflection-item textarea {
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    resize: vertical;
  }

  
  .drc-container [data-combobox-type] ul[role="listbox"],
  .drc-missed-trade [data-combobox-type] ul[role="listbox"] {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    right: 0 !important;
    max-height: 200px !important;
    overflow-y: auto !important;
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-top: none !important;
    border-radius: 0 0 4px 4px !important;
    margin-top: -1px !important;
    z-index: 9999 !important;
    list-style: none !important; 
    padding: 0 !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
    
    transform: translateZ(0) !important; 
    backface-visibility: hidden !important;
    perspective: 1000px !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    
    animation: drc-dropdown-open 0.15s ease forwards !important;
  }
  
  
  @keyframes drc-dropdown-open {
    from {
      opacity: 0;
      transform: translateY(-5px) translateZ(0);
    }
    to {
      opacity: 1;
      transform: translateY(0) translateZ(0);
    }
  }

  
  .drc-container [data-combobox-type] ul[role="listbox"] li,
  .drc-missed-trade [data-combobox-type] ul[role="listbox"] li {
    padding: 8px 12px !important;
    cursor: pointer !important;
    transition: background-color 150ms ease !important;
    margin: 0 !important;
    list-style: none !important; 
    border-bottom: 1px solid var(--background-modifier-border-subtle, rgba(127, 127, 127, 0.1)) !important;
    
    transform: translateZ(0) !important; 
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    
    text-rendering: optimizeLegibility !important;
  }

  
  .drc-container [data-combobox-type] ul[role="listbox"] li:hover,
  .drc-container [data-combobox-type] ul[role="listbox"] li[aria-selected="true"],
  .drc-missed-trade [data-combobox-type] ul[role="listbox"] li:hover,
  .drc-missed-trade [data-combobox-type] ul[role="listbox"] li[aria-selected="true"] {
    background-color: var(--background-secondary) !important;
  }

  
  .drc-container [data-combobox-type] ul[role="listbox"] li[data-add-option="true"],
  .drc-missed-trade [data-combobox-type] ul[role="listbox"] li[data-add-option="true"] {
    font-style: italic !important;
    border-top: 1px dashed var(--background-modifier-border) !important;
    
    transform: translateZ(0) !important; 
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    
    text-rendering: optimizeLegibility !important;
  }

  
  .drc-container [data-combobox-type][data-is-open="true"] input[role="combobox"],
  .drc-missed-trade [data-combobox-type][data-is-open="true"] input[role="combobox"] {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
  
  
  .drc-missed-trade .selected-option-remove:hover,
  .drc-missed-trade .selected-item button:hover,
  .drc-container .selected-option-remove:hover,
  .drc-container .selected-item button:hover {
    background: rgba(255, 255, 255, 0.4) !important; 
  }

  
.drc-missed-trade {
  padding: 16px;
  padding-top: 42px; 
  margin-bottom: 16px;
  background-color: var(--background-secondary);
  border-radius: 6px;
  position: relative;
}


.drc-missed-trade-remove {
  position: absolute !important;
  top: 12px !important;
  right: 12px !important;
  z-index: 12000 !important; 
  padding: 6px 12px !important;
  min-width: 80px !important;
  min-height: 32px !important;
  margin: 0 !important;
}


.drc-missed-trade-images-container {
  margin-top: 16px;
}


.drc-missed-trade-images {
  margin-bottom: 12px;
  background-color: var(--background-primary);
  border-radius: 6px;
  padding: 12px;
  border: 1px solid var(--background-modifier-border);
}


.drc-missed-trade-image-uploader {
  height: 60px !important; 
  margin-top: 8px;
}

  .drc-missed-trade .drc-remove-button {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  
  .drc-add-button,
  .drc-remove-button,
  .drc-nav-button {
    padding: 8px 14px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .drc-add-button {
    margin-bottom: 16px;
    background-color: var(--interactive-accent);
    color: var(--text-on-accent, white);
    border-color: var(--interactive-accent);
  }

  .drc-add-button:hover {
    background-color: var(--interactive-accent-hover);
  }

  .drc-remove-button {
    background-color: rgba(229, 57, 53, 0.1);
    color: var(--color-error, #e53935);
    border-color: var(--color-error, #e53935);
  }

  .drc-remove-button:hover {
    background-color: rgba(229, 57, 53, 0.2);
  }

  .drc-nav-button:hover {
    background-color: var(--background-modifier-hover);
    transform: translateY(-1px);
  }

  .drc-nav-button .journalit-nav-icon {
    font-size: 16px;
    line-height: 1;
  }

  
  .drc-empty-state {
    padding: 20px;
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    background-color: var(--background-secondary);
    border-radius: 4px;
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

    .drc-navigation-links {
      justify-content: center !important;
      width: 100% !important;
    }

    .drc-nav-button {
      flex: 1 !important;
      justify-content: center !important;
      min-width: 120px !important;
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

  .drc-note-grade {
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    min-width: 200px !important;
    padding: 16px !important;
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

  .drc-note-grade {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    height: 100% !important;
    min-width: 200px !important;
    padding: 16px !important;
    background-color: var(--background-primary) !important;
    border-radius: var(--border-radius-md, 4px) !important;
    border: 1px solid var(--background-modifier-border) !important;
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

  .drc-note-grade-dropdown {
    width: 60px !important;
    height: 60px !important;
    position: relative !important;
  }

  
  .drc-note-grade-value,
  select.drc-note-grade-value {
    width: 60px !important;
    height: 60px !important;
    min-width: 60px !important;
    min-height: 60px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 50% !important;
    font-size: 22px !important;
    font-weight: 600 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background-color: var(--background-secondary) !important;
    color: var(--text-normal) !important;
    cursor: pointer !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    text-align: center !important;
    line-height: 1 !important;
    text-indent: 0 !important;
    box-sizing: border-box !important;
    overflow: visible !important;
    position: relative !important;
  }

  
  .drc-note-grade-value.grade-a {
    background-color: rgba(102, 187, 106, 0.3) !important;
    color: var(--text-success) !important;
  }

  .drc-note-grade-value.grade-b {
    background-color: rgba(255, 152, 0, 0.3) !important;
    color: var(--text-warning) !important;
  }

  .drc-note-grade-value.grade-c {
    background-color: rgba(229, 57, 53, 0.3) !important;
    color: var(--text-error) !important;
  }

  
  .drc-note-grade-dropdown::after,
  .drc-note-grade-dropdown::before,
  .drc-note-grade-dropdown select::after,
  .drc-note-grade-dropdown select::before {
    content: none !important;
    display: none !important;
  }

  
  @media (max-width: 768px) {
    .drc-note-grades {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }

    
    .drc-levels-container {
      flex-direction: column !important;
    }

    .drc-level-section {
      width: 100% !important;
    }
  }

  @media (min-width: 768px) {
    .drc-levels-container {
      flex-direction: row !important;
      gap: 16px !important;
    }

    .drc-level-section {
      width: calc(50% - 8px) !important;
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

  .icon-select-trigger {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  
  .icon-select-trigger svg {
    display: block !important;
    margin: 0 auto !important;
  }

  .icon-select-trigger:hover {
    background-color: var(--background-modifier-hover) !important;
  }

  .icon-select-menu {
    position: absolute !important;
    top: calc(100% + 2px) !important;
    left: 0 !important;
    width: 40px !important;
    background-color: var(--background-primary) !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
    z-index: 1000 !important;
    list-style: none !important;
    padding: 4px 0 !important;
    margin: 0 !important;
  }

  .icon-select-option {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 6px 0 !important;
    cursor: pointer !important;
    height: 28px !important;
  }
  
  
  .icon-select-option svg {
    display: block !important;
    margin: 0 auto !important;
  }

  .icon-select-option:hover {
    background-color: var(--background-modifier-hover) !important;
  }

  .icon-select-option.selected {
    background-color: var(--background-secondary) !important;
  }

  .drc-levels-container {
    display: flex !important;
    flex-direction: column !important;
    gap: 24px !important;
  }

  .drc-level-section {
    border-radius: 8px !important;
    padding: 16px !important;
    background-color: var(--background-secondary) !important;
  }

  .support-section {
    border-left: 3px solid rgba(102, 187, 106, 0.7) !important;
  }

  .resistance-section {
    border-left: 3px solid rgba(229, 57, 53, 0.7) !important;
  }

  .drc-level-header {
    margin: 0 0 12px 0 !important;
    padding-bottom: 8px !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    text-align: center !important;
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

  .drc-level-input-group {
    display: flex !important;
    gap: 8px !important;
    width: 100% !important;
    align-items: center !important;
  }

  .drc-level-input {
    flex: 2 !important;
    min-width: 0 !important;
    padding: 6px 12px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    font-size: 16px !important;
    height: 32px !important;
    min-height: 32px !important;
    max-height: 32px !important;
    line-height: 20px !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    display: block !important;
  }

  .drc-level-importance-select {
    width: 40px !important;
    display: flex !important;
    align-items: center !important;
  }

  .drc-importance-select {
    width: 40px !important;
    padding: 6px 0 6px 24px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    font-size: 16px !important;
    height: 32px !important;
    min-height: 32px !important;
    max-height: 32px !important;
    line-height: 20px !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    vertical-align: middle !important;
    background-image: none !important;
    text-align: center !important;
  }

  
  .drc-importance-select option {
    padding: 4px 8px !important;
    height: auto !important;
    line-height: normal !important;
  }

  .drc-level-add-button {
    padding: 6px 12px !important;
    height: 32px !important;
    min-height: 32px !important;
    max-height: 32px !important;
    box-sizing: border-box !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 !important;
    line-height: 20px !important;
  }

  .drc-levels-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
  }

  .drc-level-item {
    display: flex !important;
    align-items: center !important;
    padding: 8px 12px !important;
    background-color: var(--background-primary) !important;
    border-radius: 4px !important;
    position: relative !important;
    justify-content: flex-start !important;
  }

  .support-level {
    border-left: 3px solid rgba(102, 187, 106, 0.5) !important;
  }

  .resistance-level {
    border-left: 3px solid rgba(229, 57, 53, 0.5) !important;
  }

  .drc-level-price {
    font-weight: 500 !important;
    margin-right: 8px !important;
  }

  .drc-level-importance {
    font-size: 12px !important;
    padding: 2px 6px !important;
    border-radius: 3px !important;
  }

  .importance-high {
    background-color: rgba(229, 57, 53, 0.1) !important;
  }

  .importance-high .drc-level-importance {
    background-color: rgba(229, 57, 53, 0.2) !important;
    color: var(--color-error, #e53935) !important;
  }

  .importance-medium {
    background-color: rgba(255, 152, 0, 0.1) !important;
  }

  .importance-medium .drc-level-importance {
    background-color: rgba(255, 152, 0, 0.2) !important;
    color: var(--color-orange, #ef6c00) !important;
  }

  .importance-low {
    background-color: rgba(33, 150, 243, 0.1) !important;
  }

  .importance-low .drc-level-importance {
    background-color: rgba(33, 150, 243, 0.2) !important;
    color: var(--interactive-accent) !important;
  }

  .drc-level-remove-button {
    padding: 0 !important;
    width: 24px !important;
    height: 24px !important;
    background-color: rgba(229, 57, 53, 0.1) !important;
    color: var(--color-error, #e53935) !important;
    border: none !important;
    border-radius: 50% !important;
    cursor: pointer !important;
    font-size: 16px !important;
    line-height: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin-left: auto !important; 
    text-align: center !important;
    vertical-align: middle !important;
  }

  .drc-empty-levels {
    color: var(--text-muted) !important;
    font-style: italic !important;
    padding: 8px !important;
    text-align: center !important;
  }

  
  html body .drc-container .drc-header .drc-navigation,
  body .drc-container .drc-header .drc-navigation,
  .workspace-leaf .drc-container .drc-header .drc-navigation {
    width: 100% !important;
    padding-top: 10px !important;
    border-top: 1px solid var(--background-modifier-border-subtle, rgba(127, 127, 127, 0.1)) !important;
  }

  
  html body .drc-container .drc-header .drc-navigation .drc-navigation-links,
  body .drc-container .drc-header .drc-navigation .drc-navigation-links,
  .workspace-leaf .drc-container .drc-header .drc-navigation .drc-navigation-links {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 8px !important;
    flex-wrap: wrap !important;
    width: 100% !important;
  }

  
  .drc-forecast-section {
    margin-bottom: 20px;
    padding: 16px;
    background-color: var(--background-secondary);
    border-radius: 8px;
  }

  
  .drc-forecast-section textarea,
  .drc-forecast-section .drc-textarea {
    width: 100%;
    min-height: 80px;
    padding: 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    font-family: var(--font-text);
    font-size: 16px;
    resize: vertical;
  }

  .drc-forecast-section h4 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.05em;
  }

  .drc-image-container {
    margin-bottom: 12px;
  }

  .drc-image {
    position: relative;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 8px;
    background-color: var(--background-primary);
  }

  .drc-forecast-image {
    width: auto;
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 6px;
    margin-bottom: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: var(--background-primary);
  }

  .drc-image-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80px;
    border: 2px dashed var(--background-modifier-border);
    border-radius: 6px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .drc-image-upload:hover {
    border-color: var(--interactive-accent);
    background-color: rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.05);
  }

  .drc-image-upload.dragging-over {
    border-color: var(--interactive-accent);
    background-color: rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.1);
    transform: scale(1.02);
    box-shadow: 0 0 12px rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.3);
  }

  .drc-image-upload::after {
    content: "Drag and drop here";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    font-weight: 600;
    color: var(--interactive-accent);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .drc-image-upload.dragging-over::after {
    opacity: 1;
  }

  .drc-image-upload.dragging-over .drc-image-label {
    opacity: 0;
  }

  .drc-image-label {
    font-size: 16px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .drc-image-upload:hover .drc-image-label {
    color: var(--interactive-accent);
  }

  .drc-image-input {
    display: none;
  }

  .drc-image-delete {
    background-color: rgba(229, 57, 53, 0.1);
    color: var(--color-error, #e53935);
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 12px;
    cursor: pointer;
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

  
  .drc-forecast-image {
    cursor: zoom-in !important;
    position: relative;
  }

  .drc-forecast-image::after {
    content: "Click or hold to enlarge";
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.6);
    color: var(--text-on-accent);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .drc-forecast-image:hover::after {
    opacity: 1;
  }

  
  .drc-fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 4000; 
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-in-out;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    cursor: pointer;
  }

  .drc-fullscreen-content {
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    background-color: var(--background-primary);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    animation: zoomIn 0.3s ease-in-out;
    overflow: hidden;
    cursor: default;
  }

  .drc-fullscreen-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: var(--background-secondary);
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .drc-fullscreen-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-normal);
  }

  .drc-fullscreen-close {
    background-color: rgba(229, 57, 53, 0.1);
    color: var(--color-error, #e53935);
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 16px;
    cursor: pointer;
  }

  .drc-fullscreen-close:hover {
    background-color: rgba(229, 57, 53, 0.2);
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

  .drc-fullscreen-image {
    max-width: 100%;
    max-height: calc(90vh - 120px);
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .drc-fullscreen-footer {
    padding: 10px 16px;
    background-color: var(--background-secondary);
    border-top: 1px solid var(--background-modifier-border);
    text-align: center;
  }

  .drc-fullscreen-footer p {
    margin: 0;
    font-size: 12px;
    color: var(--text-muted);
  }

  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes zoomIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  
  .drc-weekly-events {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .drc-weekly-event-item {
    padding: 12px;
    background-color: var(--background-secondary);
    border-radius: 8px;
    border-left: 5px solid var(--event-color-gray, #888888);
    margin-bottom: 8px;
    transition: border-color 0.3s ease;
  }

  .drc-weekly-event-item.event-color-red {
    border-left-color: var(--event-color-red, #e53935);
  }

  .drc-weekly-event-item.event-color-orange {
    border-left-color: var(--event-color-orange, #fb8c00);
  }

  .drc-weekly-event-item.event-color-yellow {
    border-left-color: var(--event-color-yellow, #fdd835);
  }

  .drc-weekly-event-item.event-color-gray {
    border-left-color: var(--event-color-gray, #888888);
  }

  .drc-weekly-event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .drc-weekly-event-header h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  .drc-weekly-event-item p {
    margin: 0;
    font-size: 16px;
    color: var(--text-normal);
    white-space: pre-line;
  }

  .drc-weekly-event-badge {
    font-size: 12px;
    padding: 2px 8px;
    background-color: var(--background-modifier-border);
    border-radius: 4px;
    color: var(--text-normal);
    font-weight: 500;
    white-space: nowrap;
  }

  
  html body .drc-container .drc-header .drc-navigation .drc-navigation-links .drc-nav-button,
  body .drc-container .drc-header .drc-navigation .drc-navigation-links .drc-nav-button,
  .workspace-leaf .drc-container .drc-header .drc-navigation .drc-navigation-links .drc-nav-button {
    padding: 8px 14px !important;
    border: 1px solid var(--background-modifier-border) !important;
    border-radius: 4px !important;
    background-color: var(--background-primary) !important;
    color: var(--text-normal) !important;
    cursor: pointer !important;
    font-size: 16px !important;
    transition: all 0.2s !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    flex: 1 !important;
    text-align: center !important;
    min-width: 120px !important;
    box-sizing: border-box !important;
    max-width: none !important;
    margin: 0 !important;
  }

  
  html body .drc-container .drc-header .drc-navigation .drc-nav-button .journalit-nav-icon,
  body .drc-container .drc-header .drc-navigation .drc-nav-button .journalit-nav-icon {
    font-size: 16px !important;
    line-height: 1 !important;
  }

  
  .drc-eod-images {
    padding: 16px;
    background-color: var(--background-secondary);
    border-radius: 6px;
  }

  .drc-eod-image-uploader {
    margin-top: 8px;
  }

  .drc-eod-review-button-section {
    text-align: center;
  }

  .drc-eod-review-button-section .review-button-container {
    justify-content: center;
  }

  
  .drc-no-questions {
    padding: 16px;
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
  }

  
  .drc-container .metadata-container {
    position: relative !important;
    z-index: 1 !important;
    transform: translateZ(0) !important;
    will-change: auto !important;
  }

  
  .drc-tabs-content,
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
    .drc-input-group input,
    .drc-input-group textarea,
    .drc-input-group select,
    .drc-textarea,
    .drc-forecast-section textarea,
    .drc-forecast-section .drc-textarea,
    .drc-level-input,
    .drc-trade-table input,
    .drc-reflection-item textarea,
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
    background: rgba(33, 150, 243, 0.15);
    color: var(--color-info);
    border: 1px solid rgba(33, 150, 243, 0.3);
  }

  .journalit-count-badge--setups:hover {
    background: rgba(33, 150, 243, 0.25);
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
    color: var(--interactive-accent);
  }
`;


function injectDRCStyles(): void {
  return;
}


export function ensureDRCStyles(): void {
  return;
}
