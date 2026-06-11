


const WEEKLY_REVIEW_STYLES = `

.journalit-weekly-review-view {
  --chart-positive: var(--color-green, #43a047);
  --chart-negative: var(--color-red, #e53935);
  --event-color-red: var(--color-red, #e53935);
  --event-color-orange: var(--color-orange, #fb8c00);
  --event-color-yellow: var(--color-yellow, #fdd835);
  --event-color-gray: var(--text-muted, #888888); 
  --event-text-color-on-dark: #ffffff; 
  --event-text-color-on-light: #000000; 
  --interactive-accent-rgb: 83, 141, 226; 
}


.journalit-weekly-review-view,
.markdown-preview-view .journalit-weekly-review-view {
  margin: 0 !important; 
  border-bottom: none !important; 
  padding: 0 !important; 
  display: block !important;
  width: 100% !important;
  z-index: 100 !important;
  
  visibility: visible !important;
  opacity: 1 !important;
  background-color: var(--background-primary) !important;
  
  border: none !important;
  border-radius: 8px !important;
  
  position: relative;
  box-sizing: border-box;
  
  contain: content;
  
  isolation: isolate;
}


.weekly-review-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  contain: content;
  
  isolation: isolate;
  
  position: relative;
  
  box-sizing: border-box;
  margin: 0 !important;
  z-index: 100 !important;
}



.weekly-review-container {
  display: flex;
  flex-direction: column;
  font-family: var(--font-text);
  color: var(--text-normal);
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--background-primary);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative; 
  z-index: 1; 
  transform: translateZ(0); 
  will-change: auto !important; 
  contain: layout style !important; 
}


.weekly-review-header {
  padding: 16px 20px 12px;
  background-color: var(--background-secondary);
  text-align: center;
  border-bottom: 1px solid var(--background-modifier-border);
}

.weekly-review-date {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-normal);
  margin-bottom: 20px;
}



.weekly-review-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-normal);
  margin-bottom: 20px;
  text-align: center;
}

.weekly-review-date-container {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-normal);
  margin-bottom: 20px;
  text-align: center;
}

.weekly-review-navigation {
  width: 100%;
  padding-top: 10px;
  border-top: 1px solid var(--background-modifier-border-subtle, rgba(127, 127, 127, 0.1));
}

.weekly-review-navigation-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  width: 100% !important;
}

.weekly-review-nav-button {
  padding: 8px 14px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background-color: var(--background-primary);
  color: var(--text-normal);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  text-align: center;
  min-width: 120px;
}

.weekly-review-nav-button:hover {
  background-color: var(--background-modifier-hover);
  transform: translateY(-1px);
}

.weekly-review-nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.journalit-nav-icon {
  font-size: 14px;
  margin-right: 4px;
  margin-left: 4px;
}


html body .weekly-review-container .weekly-review-navigation .weekly-review-navigation-links,
body .weekly-review-container .weekly-review-navigation .weekly-review-navigation-links,
.workspace-leaf .weekly-review-container .weekly-review-navigation .weekly-review-navigation-links {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 8px !important;
  flex-wrap: wrap !important;
  width: 100% !important;
}

html body .weekly-review-container .weekly-review-navigation .weekly-review-navigation-links .weekly-review-nav-button,
body .weekly-review-container .weekly-review-navigation .weekly-review-navigation-links .weekly-review-nav-button,
.workspace-leaf .weekly-review-container .weekly-review-navigation .weekly-review-navigation-links .weekly-review-nav-button {
  padding: 8px 14px !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px !important;
  background-color: var(--background-primary) !important;
  color: var(--text-normal) !important;
  cursor: pointer !important;
  font-size: 14px !important;
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


html body .weekly-review-container .weekly-review-navigation .weekly-review-nav-button .journalit-nav-icon,
body .weekly-review-container .weekly-review-navigation .weekly-review-nav-button .journalit-nav-icon {
  font-size: 16px !important;
  line-height: 1 !important;
}


.weekly-review-tabs-container {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid var(--background-modifier-border);
  background-color: var(--background-secondary-alt, #2a2a2a);
  padding: 0;
}

.weekly-review-tabs {
  display: flex;
  justify-content: center;
  background-color: transparent;
  max-width: 600px;
  margin: 0 auto;
}

.weekly-review-tab {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  outline: none;
}

.weekly-review-tab:hover {
  color: var(--text-normal);
  background-color: rgba(127, 127, 127, 0.05);
}

.weekly-review-tab.active {
  color: var(--text-accent);
  border-bottom: 2px solid var(--text-accent);
}


.weekly-review-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0 0; 
}


.weekly-review-section {
  margin: 0 0 24px 0; 
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  padding: 16px;
  width: 100%; 
  box-sizing: border-box; 
}

.weekly-review-section-title {
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-normal);
  border-bottom: 1px solid var(--background-modifier-border);
  text-align: center;
}


.weekly-review-previous-goals h3,
.weekly-review-section h3 {
  font-size: 1rem !important;
  margin-top: 0.5rem !important;
  margin-bottom: 1rem !important;
  text-align: center !important;
  font-weight: 600 !important;
  color: var(--text-normal) !important;
  padding-bottom: 0.5rem !important;
  border-bottom: 1px solid var(--background-modifier-border) !important;
}


.weekly-review-empty-state,
.weekly-review-no-trades,
.weekly-review-no-drcs,
.weekly-review-no-events,
.weekly-review-no-questions {
  padding: 16px;
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  background-color: var(--background-secondary);
  border-radius: 6px;
}


.weekly-review-checklist {
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 12px; 
}

.weekly-review-checklist-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: var(--background-secondary);
  cursor: pointer; 
  transition: background-color 0.2s ease;
}

.weekly-review-checklist-item:hover {
  background-color: var(--background-modifier-hover);
}

.weekly-review-checkbox {
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
}


.weekly-review-key-events {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weekly-review-event-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: var(--background-secondary);
  border-radius: 8px;
}


.weekly-review-container .combobox-container,
.weekly-review-container [data-combobox-type],
.weekly-review-event-selector .combobox-container,
.weekly-review-section .combobox-container {
  position: relative !important;
  width: 100% !important;
  margin-bottom: 8px !important;
  z-index: 10 !important;
}


.weekly-review-container .combobox-container[data-is-open="true"],
.weekly-review-container [data-combobox-type][data-is-open="true"],
.weekly-review-event-selector .combobox-container[data-is-open="true"],
.weekly-review-section .combobox-container[data-is-open="true"] {
  z-index: 9999 !important;
}


.weekly-review-container [data-combobox-type] .input-container::after,
.weekly-review-event-selector .combobox-container .input-container::after,
.weekly-review-section .combobox-container .input-container::after {
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


.weekly-review-container [data-combobox-type] input[role="combobox"],
.weekly-review-event-selector .combobox-container input[role="combobox"],
.weekly-review-section .combobox-container input[role="combobox"] {
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
  position: relative !important;
  z-index: 10000 !important; 
}


.weekly-review-container [data-combobox-type] input[role="combobox"]:focus,
.weekly-review-event-selector .combobox-container input[role="combobox"]:focus,
.weekly-review-section .combobox-container input[role="combobox"]:focus {
  outline: 2px solid var(--interactive-accent) !important; 
  outline-offset: -1px !important;
  border-color: var(--interactive-accent) !important;
  box-shadow: 0 0 0 1px var(--interactive-accent) !important;
  z-index: 10001 !important; 
}


.weekly-review-container [data-combobox-type] ul[role="listbox"],
.weekly-review-event-selector [data-combobox-type] ul[role="listbox"],
.weekly-review-section [data-combobox-type] ul[role="listbox"] {
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
  clip-path: inset(1px -15px -15px -15px) !important; 
}


.weekly-review-container [data-combobox-type] ul[role="listbox"] li,
.weekly-review-event-selector [data-combobox-type] ul[role="listbox"] li,
.weekly-review-section [data-combobox-type] ul[role="listbox"] li {
  padding: 8px 12px !important;
  cursor: pointer !important;
  transition: background-color 150ms ease !important;
  margin: 0 !important;
  list-style: none !important; 
  border-bottom: 1px solid var(--background-modifier-border-subtle, rgba(127, 127, 127, 0.1)) !important;
}


.weekly-review-container [data-combobox-type] ul[role="listbox"] li:hover,
.weekly-review-container [data-combobox-type] ul[role="listbox"] li[aria-selected="true"],
.weekly-review-event-selector [data-combobox-type] ul[role="listbox"] li:hover,
.weekly-review-event-selector [data-combobox-type] ul[role="listbox"] li[aria-selected="true"],
.weekly-review-section [data-combobox-type] ul[role="listbox"] li:hover,
.weekly-review-section [data-combobox-type] ul[role="listbox"] li[aria-selected="true"] {
  background-color: var(--background-secondary) !important;
}


.weekly-review-container [data-combobox-type] ul[role="listbox"] li[data-add-option="true"],
.weekly-review-event-selector [data-combobox-type] ul[role="listbox"] li[data-add-option="true"],
.weekly-review-section [data-combobox-type] ul[role="listbox"] li[data-add-option="true"] {
  font-style: italic !important;
  border-top: 1px dashed var(--background-modifier-border) !important;
}


.weekly-review-container [data-combobox-type][data-is-open="true"] input[role="combobox"],
.weekly-review-event-selector [data-combobox-type][data-is-open="true"] input[role="combobox"],
.weekly-review-section [data-combobox-type][data-is-open="true"] input[role="combobox"] {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}


.weekly-review-event-selector .selected-options,
.weekly-review-event-selector .selected-item,
.weekly-review-section .selected-options,
.weekly-review-section .selected-item,
.weekly-review-container [data-combobox-type="multi"] > div:first-of-type {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 4px !important;
  max-width: 100% !important;
  padding: 2px 0 !important;
  z-index: 5 !important;
  position: relative !important;
}


.weekly-review-event-selector .selected-option,
.weekly-review-event-selector .selected-item,
.weekly-review-section .selected-option,
.weekly-review-section .selected-item {
  display: inline-flex !important;
  align-items: center !important;
  background-color: var(--interactive-accent, #7c3aed) !important;
  color: white !important;
  border-radius: 4px !important;
  padding: 4px 8px !important;
  font-size: 12px !important;
  margin: 0 4px 4px 0 !important;
  font-weight: 500 !important;
  z-index: 6 !important;
  position: relative !important;
  gap: 6px !important;
}


.weekly-review-event-selector .selected-option-remove,
.weekly-review-event-selector .selected-item button,
.weekly-review-section .selected-option-remove,
.weekly-review-section .selected-item button {
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
  color: white !important;
  font-size: 14px !important;
  line-height: 1 !important;
  text-align: center !important;
  z-index: 7 !important;
  position: relative !important;
  transition: background-color 0.2s !important;
}


.weekly-review-event-selector .selected-option-remove:hover,
.weekly-review-event-selector .selected-item button:hover,
.weekly-review-section .selected-option-remove:hover,
.weekly-review-section .selected-item button:hover {
  background: rgba(255, 255, 255, 0.4) !important;
}


.weekly-review-event-color-selector {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 8px;
}

.weekly-review-event-color-selector span { 
  margin-right: 5px;
  font-size: 12px;
  color: var(--text-muted);
}

.weekly-review-event-color-selector label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.weekly-review-event-color-selector input[type="radio"] {
  margin-right: 4px;
  cursor: pointer;
  
}

.weekly-review-event-color-selector label span { 
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--background-modifier-border);
}



.weekly-review-events-list {
  display: flex;
  flex-direction: column;
  gap: 12px; 
}


.weekly-review-event-item {
  padding: 12px;
  background-color: var(--background-secondary);
  border-radius: 8px;
  border-left: 5px solid var(--event-color-gray); 
  margin-bottom: 8px; 
  transition: border-color 0.3s ease; 
}


.weekly-review-event-item.event-color-red {
  border-left-color: var(--event-color-red);
}
.weekly-review-event-item.event-color-orange {
  border-left-color: var(--event-color-orange);
}
.weekly-review-event-item.event-color-yellow {
  border-left-color: var(--event-color-yellow);
}
.weekly-review-event-item.event-color-gray {
  border-left-color: var(--event-color-gray);
}



.weekly-review-event-day-selector {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 8px;
}

.weekly-review-event-day-selector span {
  margin-right: 5px;
  font-size: 12px;
  color: var(--text-muted);
}

.weekly-review-event-day-selector select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--background-modifier-border);
  background-color: var(--background-primary);
  color: var(--text-normal);
  font-size: 14px;
  width: 150px;
}


.weekly-review-event-day {
  font-size: 12px;
  padding: 2px 8px;
  background-color: var(--background-modifier-border);
  border-radius: 4px;
  color: var(--text-normal);
  font-weight: 500;
  white-space: nowrap;
}

.weekly-review-event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.weekly-review-event-header h4 {
  margin: 0;
  font-size: 14px; 
  font-weight: 600;
}


.weekly-review-forecast-section {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--background-secondary); 
  border-radius: 8px; 
}

.weekly-review-forecast-section h4 { 
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.05em; 
}

.weekly-review-image-container {
  margin-bottom: 12px; 
}

.weekly-review-image {
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

.weekly-review-forecast-image {
  width: auto; 
  max-width: 100%; 
  max-height: 300px; 
  object-fit: contain; 
  border-radius: 6px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
  background-color: var(--background-primary); 
}

.weekly-review-image-upload {
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

.weekly-review-image-upload:hover {
  border-color: var(--interactive-accent);
  background-color: rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.05);
}

.weekly-review-image-upload.dragging-over {
  border-color: var(--interactive-accent);
  background-color: rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.1);
  transform: scale(1.02);
  box-shadow: 0 0 12px rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.3);
}

.weekly-review-image-upload::after {
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

.weekly-review-image-upload.dragging-over::after {
  opacity: 1;
}

.weekly-review-image-upload.dragging-over .weekly-review-image-label {
  opacity: 0;
}

.weekly-review-image-label {
  font-size: 14px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.weekly-review-image-upload:hover .weekly-review-image-label {
  color: var(--interactive-accent);
}

.weekly-review-image-input {
  display: none;
}

.weekly-review-image-delete {
  
  background-color: rgba(229, 57, 53, 0.1);
  color: var(--color-error, #e53935);
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px; 
  cursor: pointer;
  
}


.weekly-review-add-button {
  background-color: var(--interactive-accent);
  color: white; 
  border: none;
  border-radius: 4px;
  padding: 8px 16px; 
  font-size: 14px; 
  cursor: pointer;
  font-weight: normal; 
  
}

.weekly-review-add-button:hover {
  background-color: var(--interactive-accent-hover);
}

.weekly-review-add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.weekly-review-remove-button,
.weekly-review-event-remove { 
  background-color: rgba(229, 57, 53, 0.1); 
  color: var(--color-error, #e53935); 
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px; 
  cursor: pointer;
}


.weekly-review-image-error {
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

.weekly-review-remove-button:hover,
.weekly-review-event-remove:hover {
  background-color: rgba(229, 57, 53, 0.2);
}

.weekly-review-add-event { 
  align-self: flex-start;
  margin-top: 12px;
}


.weekly-review-textarea {
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

.weekly-review-input { 
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background-color: var(--background-primary);
  color: var(--text-normal);
  font-family: var(--font-text);
  font-size: 16px;
}


.weekly-review-metric-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.weekly-review-metric-card {
  padding: 16px;
  background-color: var(--background-secondary);
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.weekly-review-metric-card:hover {
  transform: translateY(-2px);
}

.weekly-review-metric-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.weekly-review-metric-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-normal);
}

.weekly-review-metric-value[style*="color: var(--color-green)"],
.weekly-review-metric-value[style*="var(--color-green)"] {
  color: var(--color-green) !important;
}
.weekly-review-metric-value.positive { 
  color: var(--chart-positive) !important;
}

.weekly-review-metric-value[style*="color: var(--color-red)"],
.weekly-review-metric-value[style*="var(--color-red)"] {
  color: var(--color-red) !important;
}
.weekly-review-metric-value.negative { 
   color: var(--chart-negative) !important;
}



.weekly-review-trades {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.weekly-review-trade-item { 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: var(--background-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.weekly-review-trade-item:hover {
  background-color: var(--background-modifier-hover);
}

.weekly-review-trade-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weekly-review-trade-instrument {
  font-weight: 600;
}

.weekly-review-trade-direction {
  color: var(--text-muted);
  font-size: 12px;
}

.weekly-review-trade-pnl {
  font-weight: 600;
}

.weekly-review-trade-pnl[style*="color: var(--color-green)"],
.weekly-review-trade-pnl[style*="var(--color-green)"] {
  color: var(--color-green) !important;
}
.weekly-review-trade-pnl.positive { 
   color: var(--chart-positive) !important;
}

.weekly-review-trade-pnl[style*="color: var(--color-red)"],
.weekly-review-trade-pnl[style*="var(--color-red)"] {
  color: var(--color-red) !important;
}
.weekly-review-trade-pnl.negative { 
   color: var(--chart-negative) !important;
}


.weekly-review-grades { 
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weekly-review-grade-item { 
  background-color: var(--background-secondary);
  border-radius: 8px;
  padding: 16px;
}

.weekly-review-grade-label {
  font-size: 14px; 
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-normal);
}


.weekly-review-grade-stars {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  position: relative;
}

.weekly-review-star {
  cursor: pointer;
  color: var(--text-muted);
  transition: color 0.2s ease;
  font-size: 1.5em;
  user-select: none;
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1em;
  line-height: 1;
  text-align: center;
}

.weekly-review-star.full {
  color: gold !important;
}

.weekly-review-star.half {
  position: relative;
  color: var(--text-muted);
}

.weekly-review-star.half::after {
  content: "★";
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  overflow: hidden;
  color: gold !important;
  pointer-events: none;
}


.weekly-review-grade-stars::after {
  content: "Left click for full star, right click for half star";
  position: absolute;
  font-size: 10px;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.3s ease;
  margin-top: 30px;
  background: var(--background-primary);
  padding: 4px 8px;
  border-radius: 4px;
  pointer-events: none;
  border: 1px solid var(--background-modifier-border);
  white-space: nowrap;
  z-index: 100;
}

.weekly-review-grade-stars:hover::after {
  opacity: 1;
}



.weekly-review-drcs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}


.weekly-review-drc-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}


.weekly-review-drc-card {
  background-color: var(--background-primary);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--background-modifier-border);
}


.weekly-review-drc-header {
  background-color: var(--background-secondary-alt, var(--background-secondary));
  padding: 10px 16px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--background-modifier-border);
}

.weekly-review-drc-date {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-normal);
  flex: 1;
}


.weekly-review-drc-grades {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex: 2;
}

.weekly-review-drc-grade {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: var(--background-secondary-alt, var(--background-secondary));
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  line-height: 1;
  color: white;
}


.weekly-review-drc-grade.grade-a {
  background-color: var(--color-green, #43a047);
}

.weekly-review-drc-grade.grade-b {
  background-color: var(--color-orange, #fb8c00);
}

.weekly-review-drc-grade.grade-c {
  background-color: var(--color-red, #e53935);
}


.weekly-review-drc-grade[data-grade="A"] {
  background-color: var(--color-green, #43a047);
}

.weekly-review-drc-grade[data-grade="B"] {
  background-color: var(--color-orange, #fb8c00);
}

.weekly-review-drc-grade[data-grade="C"] {
  background-color: var(--color-red, #e53935);
}


.weekly-review-drc-summary {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--background-primary-alt, var(--background-primary));
}

.weekly-review-drc-section {
  padding: 12px;
  background-color: var(--background-secondary);
  border-radius: 6px;
}

.weekly-review-drc-section-label {
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 6px;
  color: var(--text-accent);
}

.weekly-review-drc-section-content {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-normal);
  white-space: pre-line;
  overflow-wrap: break-word;
}


.weekly-review-drc-actions {
  display: flex;
  justify-content: flex-end;
  flex: 1;
}

.weekly-review-drc-button {
  background-color: var(--interactive-accent);
  color: var(--text-on-accent, white);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.weekly-review-drc-button:hover {
  background-color: var(--interactive-accent-hover);
}

.weekly-review-drc-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


.weekly-review-drc-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: var(--background-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.weekly-review-drc-item:hover {
  background-color: var(--background-modifier-hover);
}


.weekly-review-questions { 
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weekly-review-question-section { 
  margin-bottom: 15px;
}

.weekly-review-question { 
  background-color: var(--background-secondary);
  border-radius: 8px;
  padding: 16px;
}

.weekly-review-question-text { 
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--text-normal);
}


.weekly-review-goal-input {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.weekly-review-goal-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background-color: var(--background-primary);
  color: var(--text-normal);
  font-size: 16px;
}
.weekly-review-goals-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.weekly-review-goal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--background-secondary);
  border-radius: 4px;
}



.weekly-review-chart-tooltip {
  background-color: var(--background-primary) !important;
  border-radius: 10px !important;
  padding: 14px 18px !important;
  border: 1px solid var(--background-modifier-border) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
}

.weekly-review-tooltip-setup,
.weekly-review-tooltip-date {
  font-size: 14px !important;
  font-weight: 500 !important;
  color: var(--text-normal) !important;
  margin-bottom: 8px !important;
  text-align: center !important;
}

.weekly-review-tooltip-value {
  font-size: 20px !important;
  font-weight: 600 !important;
  text-align: center !important;
}

.weekly-review-tooltip-value.positive {
  color: var(--chart-positive) !important;
}

.weekly-review-tooltip-value.negative {
  color: var(--chart-negative) !important;
}

.weekly-review-tooltip-info {
  font-size: 12px !important;
  color: var(--text-muted) !important;
  margin-top: 6px !important;
  text-align: center !important;
}


@media (max-width: 768px) {
  .weekly-review-metric-cards {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .weekly-review-navigation-links {
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
  }

  .weekly-review-nav-button {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }

  .weekly-review-tab {
    padding: 10px 12px;
    font-size: 13px;
  }

  
  .weekly-review-tabs {
    flex-wrap: wrap;
  }
  .weekly-review-tab {
    flex-grow: 1;
    text-align: center;
  }
}




.weekly-review-fullscreen-overlay {
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

.weekly-review-fullscreen-content {
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

.weekly-review-fullscreen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--background-secondary);
  border-bottom: 1px solid var(--background-modifier-border);
}

.weekly-review-fullscreen-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-normal);
}

.weekly-review-fullscreen-close {
  background-color: rgba(229, 57, 53, 0.1);
  color: var(--color-error, #e53935);
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
}

.weekly-review-fullscreen-close:hover {
  background-color: rgba(229, 57, 53, 0.2);
}

.weekly-review-fullscreen-image-container {
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

.weekly-review-fullscreen-image {
  max-width: 100%;
  max-height: calc(90vh - 120px);
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.weekly-review-fullscreen-footer {
  padding: 10px 16px;
  background-color: var(--background-secondary);
  border-top: 1px solid var(--background-modifier-border);
  text-align: center;
}

.weekly-review-fullscreen-footer p {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}


.weekly-review-info-text {
  padding: 10px 14px;
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  background-color: var(--background-primary-alt, var(--background-secondary));
  border-radius: 6px;
  border-left: 3px solid var(--text-accent);
  margin-top: 8px;
  font-size: 14px;
}


.weekly-review-forecast-image {
  cursor: zoom-in !important;
  position: relative;
}

.weekly-review-forecast-image::after {
  content: "Click or hold to enlarge";
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.weekly-review-forecast-image:hover::after {
  opacity: 1;
}


.weekly-review-best-trade-pnl {
  font-size: 20px !important;
  font-weight: 700 !important;
  padding: 4px 10px !important;
  border-radius: 4px !important;
  display: inline-block !important;
}

.weekly-review-best-trade-pnl[style*="color: var(--color-green)"] {
  background-color: rgba(67, 160, 71, 0.15) !important;
}

.weekly-review-best-trade-pnl[style*="color: var(--color-red)"] {
  background-color: rgba(229, 57, 53, 0.15) !important;
}


@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}


.weekly-review-container .metadata-container {
  position: relative !important;
  z-index: 1 !important;
  transform: translateZ(0) !important;
  will-change: auto !important;
}


.weekly-tabs-content,
.weekly-review-container .tab-content {
  position: relative !important;
  z-index: 1 !important;
}


.weekly-review-container::before {
  content: '';
  display: table;
}


.weekly-review-container .metadata-container[style*="position"] {
  position: relative !important;
}


.weekly-review-container select,
.weekly-review-container input,
.weekly-review-container textarea {
  box-sizing: border-box !important;
  max-width: 100% !important;
}


@media (max-width: 600px) {
  .weekly-review-container input[role="combobox"],
  .weekly-review-container input,
  .weekly-review-container textarea,
  .weekly-review-textarea,
  .weekly-review-input,
  .weekly-review-goal-input input {
    font-size: 18px !important;
  }
}
`;


export function injectWeeklyReviewStyles(): void {
  return;
}


export function removeWeeklyReviewStyles(): void {
  return;
}


