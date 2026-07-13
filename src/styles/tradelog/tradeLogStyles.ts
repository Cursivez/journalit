

import { TRADE_ACCOUNT_CELL_STYLES } from '../shared/tradeAccountCellStyles';

export const TRADE_LOG_STYLES = `

.journalit-trade-log-view-container {
  height: 100%;
  overflow: hidden !important; 
  display: flex;
  flex-direction: column;
  padding: 0;
  min-height: 0; 
}


.journalit-trade-log-view-container .journalit-react-view-root {
  height: 100%;
  overflow: visible;
  display: flex;
  flex-direction: column;
  min-height: 0; 
}


.journalit-trade-log {
  display: flex;
  flex-direction: column;
  container-name: journalit-trade-log;
  container-type: inline-size;
  height: 100%;
  background: var(--background-primary);
  color: var(--text-normal);
  overflow: hidden;
  min-height: 0; 
}


.trade-log-header {
  padding: 12px 16px 6px 16px;
  border-bottom: 1px solid var(--background-modifier-border);
  background: var(--background-secondary);
}

.trade-log-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 0;
  flex-wrap: wrap;
}

.trade-log-mode-selector {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-secondary);
  box-shadow: none;
}

.trade-log-mode-selector button.trade-log-mode-selector__button {
  min-height: 30px;
  padding: 0 13px;
  border: 0 !important;
  border-radius: 6px !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    color 0.16s ease;
}

.trade-log-mode-selector button.trade-log-mode-selector__button:hover,
.trade-log-mode-selector button.trade-log-mode-selector__button:focus-visible {
  background: var(--background-modifier-hover) !important;
  background-color: var(--background-modifier-hover) !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-normal);
}

.trade-log-mode-selector button.trade-log-mode-selector__button--active,
.trade-log-mode-selector button.trade-log-mode-selector__button--active:hover,
.trade-log-mode-selector button.trade-log-mode-selector__button--active:focus-visible {
  background: var(--interactive-accent) !important;
  background-color: var(--interactive-accent) !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-on-accent);
}

.trade-log-view-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  min-width: fit-content;
}

.trade-log-view-selector label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
}

.trade-log-view-selector select {
  width: auto;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 13px;
  cursor: pointer;
}


.trade-log-view-dropdown {
  width: auto !important;
  max-width: fit-content !important;
  padding: 6px 8px !important;
  text-align: center !important;
}

.trade-log-view-selector select:hover {
  background: var(--background-modifier-hover);
}

.trade-log-view-selector select option {
  background-color: var(--background-primary) !important;
  color: var(--text-normal) !important;
  padding: 6px 8px !important;
}

.trade-log-view-selector select option:hover,
.trade-log-view-selector select option:focus {
  background-color: var(--background-modifier-hover) !important;
  color: var(--text-normal) !important;
}

.trade-log-image-gallery-controls {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 420px;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-right: -6px;
  min-width: 0;
}

.trade-log-image-gallery-source-sort-controls {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.trade-log-image-gallery-control {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.trade-log-image-gallery-control-dropdown {
  position: relative;
  min-width: 132px;
}

.trade-log-image-gallery-control-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  width: 100%;
  height: auto;
  min-height: 0;
  padding: 8px 12px;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 6px;
  background-color: var(--background-primary) !important;
  background-image: none !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.trade-log-image-gallery-control-trigger:hover,
.trade-log-image-gallery-control-trigger:focus-visible,
.trade-log-image-gallery-control-trigger[aria-expanded='true'] {
  border-color: var(--background-modifier-border-hover, var(--background-modifier-border)) !important;
  background-color: var(--background-primary) !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
}

.trade-log-image-gallery-control-trigger span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trade-log-image-gallery-control-chevron {
  flex: 0 0 auto;
  color: var(--text-muted);
}

.trade-log-image-gallery-control-menu.journalit-home-period-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 100;
  width: max-content;
  min-width: 100%;
  margin-top: 4px;
  max-width: min(280px, calc(100vw - 32px));
}

.journalit-trade-log .trade-log-image-gallery-control-menu.journalit-home-period-menu button.journalit-home-period-option {
  border: none !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
}

.journalit-trade-log .trade-log-image-gallery-control-menu.journalit-home-period-menu button.journalit-home-period-option:hover,
.journalit-trade-log .trade-log-image-gallery-control-menu.journalit-home-period-menu button.journalit-home-period-option:focus-visible {
  background: var(--background-modifier-hover) !important;
  background-color: var(--background-modifier-hover) !important;
  box-shadow: none !important;
}

.trade-log-image-gallery-size-icon {
  display: inline-grid;
  box-sizing: border-box;
  color: currentColor;
}

.trade-log-image-gallery-size-icon span {
  box-sizing: border-box;
  display: block;
  border: 1px solid currentColor;
  border-radius: 1px;
}

.trade-log-image-gallery-size-icon--small {
  grid-template-columns: repeat(3, 4px);
  grid-template-rows: repeat(3, 4px);
  gap: 1px;
}

.trade-log-image-gallery-size-icon--medium {
  grid-template-columns: repeat(2, 6px);
  grid-template-rows: repeat(2, 6px);
  gap: 2px;
}

.trade-log-image-gallery-size-icon--large {
  width: 14px;
  height: 14px;
  border: 1.5px solid currentColor;
  border-radius: 3px;
}

.trade-log-filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  min-width: fit-content;
  margin-left: auto;
}

.trade-log-filter-actions > * {
  flex-shrink: 0;
}

.journalit-filter-button-container .journalit-filter-button.trade-log-image-gallery-filter-button {
  min-width: 30px;
  min-height: 30px;
  padding: 0;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-primary);
  color: var(--text-normal);
  box-shadow: none;
}

.journalit-filter-button-container .journalit-filter-button.trade-log-image-gallery-filter-button:hover,
.journalit-filter-button-container .journalit-filter-button.trade-log-image-gallery-filter-button:focus-visible {
  border-color: var(--background-modifier-border-hover);
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-filter-button-container.trade-log-image-gallery-filter-button-container .journalit-filter-badge {
  top: -6px;
  right: -6px;
}


.journalit-filter-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  background-color: transparent;
  color: var(--text-muted);
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.journalit-filter-button:hover {
  background-color: var(--background-modifier-hover);
  color: var(--text-normal);
}


.journalit-filter-button-container .journalit-filter-button.active,
.journalit-filter-button.active {
  background-color: var(--interactive-accent);
  color: var(--text-on-accent);
}

.journalit-filter-button-container .journalit-filter-button.active:hover,
.journalit-filter-button.active:hover {
  background-color: var(--interactive-accent-hover);
}

.view-level-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-level-selector label {
  font-weight: 500;
  color: var(--text-muted);
}

.date-range-selector {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}


.trade-log-advanced-filters {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 12px;
  background: var(--background-primary-alt);
  border-radius: 4px;
  border: 1px solid var(--background-modifier-border);
}

.trade-type-filter-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trade-type-filter-section label {
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
}

.status-filter-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-filter-section label {
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
}


.journalit-tradelog-trade-type-filter {
  position: relative;
  min-width: 100px !important;
  max-width: 120px !important;
  width: 100% !important;
}

.journalit-tradelog-trade-type-dropdown {
  position: relative !important;
  width: 100% !important;
}

.journalit-tradelog-trade-type-summary {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 5px 10px !important;
  background-color: var(--background-primary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  font-size: 0.9em !important;
  transition: all 0.2s ease !important;
  height: 28px !important;
  line-height: 1 !important;
  white-space: nowrap !important;
  gap: 8px !important;
}

.journalit-tradelog-trade-type-summary:hover {
  border-color: var(--interactive-accent) !important;
  background-color: var(--background-modifier-hover) !important;
}

.journalit-tradelog-trade-type-summary:focus-visible {
  outline: 2px solid var(--interactive-accent) !important;
  outline-offset: 2px !important;
}

.journalit-tradelog-trade-type-summary .dropdown-arrow {
  font-size: 10px;
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

.journalit-tradelog-trade-type-options-dropdown {
  position: absolute;
  top: 100%;
  left: 0 !important;
  right: 0 !important;
  max-height: 250px;
  overflow-y: auto;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.journalit-tradelog-trade-type-option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 13px;
  white-space: nowrap;
}

.journalit-tradelog-trade-type-option-item:hover {
  background-color: var(--background-modifier-hover) !important;
}

.journalit-tradelog-trade-type-option-item:focus-visible {
  outline: 2px solid var(--interactive-accent) !important;
  outline-offset: -2px !important;
}

.journalit-tradelog-trade-type-option-item.select-all {
  font-weight: 500;
}

.journalit-tradelog-trade-type-divider {
  height: 1px;
  background-color: var(--background-modifier-border);
  margin: 4px 0;
}


.journalit-tradelog-checkbox {
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

.journalit-tradelog-checkbox.checked {
  background-color: var(--interactive-accent) !important;
  border-color: var(--interactive-accent) !important;
}

.journalit-tradelog-trade-type-checkbox {
  
  
}

.journalit-tradelog-trade-type-checkbox.checked {
  
}

.journalit-trade-log-view-container .journalit-tradelog-trade-type-option-item input[type="checkbox"] {
  margin: 0 !important;
  width: 14px !important;
  height: 14px !important;
  appearance: none !important;
  -webkit-appearance: none !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 2px !important;
  background: var(--background-primary) !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
  padding: 0 !important;
  font-size: 0 !important;
  min-width: 14px !important;
  max-width: 14px !important;
  min-height: 14px !important;
  max-height: 14px !important;
}

.journalit-trade-log-view-container .journalit-tradelog-trade-type-option-item input[type="checkbox"]:checked {
  background: var(--interactive-accent) !important;
  border-color: var(--interactive-accent) !important;
}

.journalit-trade-log-view-container .journalit-tradelog-trade-type-option-item input[type="checkbox"]:checked::after {
  content: '✓' !important;
  color: var(--text-on-accent) !important;
  font-size: 11px !important;
  font-weight: 900 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  text-shadow: none !important;
  line-height: 1 !important;
}

.journalit-trade-log-view-container .journalit-tradelog-trade-type-option-item input[type="checkbox"]:checked + span {
  color: var(--interactive-accent);
  font-weight: 600;
}


.journalit-tradelog-status-filter {
  position: relative;
  min-width: 120px !important;
  max-width: 150px !important;
  width: 100% !important;
}

.journalit-tradelog-status-dropdown {
  position: relative !important;
  width: 100% !important;
}

.journalit-tradelog-status-summary {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 5px 10px !important;
  background-color: var(--background-primary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  font-size: 0.9em !important;
  transition: all 0.2s ease !important;
  height: 28px !important;
  line-height: 1 !important;
  white-space: nowrap !important;
  gap: 8px !important;
}

.journalit-tradelog-status-summary:hover {
  border-color: var(--interactive-accent) !important;
  background-color: var(--background-modifier-hover) !important;
}

.journalit-tradelog-status-summary:focus-visible {
  outline: 2px solid var(--interactive-accent) !important;
  outline-offset: 2px !important;
}

.journalit-tradelog-status-summary .dropdown-arrow {
  font-size: 10px;
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

.journalit-tradelog-status-options-dropdown {
  position: absolute;
  top: 100%;
  left: 0 !important;
  right: 0 !important;
  max-height: 300px;
  overflow-y: auto;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.journalit-tradelog-status-option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 13px;
  white-space: nowrap;
}

.journalit-tradelog-status-option-item:hover {
  background-color: var(--background-modifier-hover) !important;
}

.journalit-tradelog-status-option-item:focus-visible {
  outline: 2px solid var(--interactive-accent) !important;
  outline-offset: -2px !important;
}

.journalit-tradelog-status-option-item.select-all {
  font-weight: 500;
}

.journalit-tradelog-status-option-item.sub-option {
  padding-left: 24px;
  font-size: 12px;
  color: var(--text-muted);
}

.journalit-tradelog-status-divider {
  height: 1px;
  background-color: var(--background-modifier-border);
  margin: 4px 0;
}

.journalit-tradelog-status-checkbox {
  
  
}

.journalit-tradelog-status-checkbox.checked {
  
}

.journalit-trade-log-view-container .journalit-tradelog-status-option-item input[type="checkbox"] {
  margin: 0 !important;
  width: 14px !important;
  height: 14px !important;
  appearance: none !important;
  -webkit-appearance: none !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 2px !important;
  background: var(--background-primary) !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
  padding: 0 !important;
  font-size: 0 !important;
  min-width: 14px !important;
  max-width: 14px !important;
  min-height: 14px !important;
  max-height: 14px !important;
}

.journalit-trade-log-view-container .journalit-tradelog-status-option-item input[type="checkbox"]:checked {
  background: var(--interactive-accent) !important;
  border-color: var(--interactive-accent) !important;
}

.journalit-trade-log-view-container .journalit-tradelog-status-option-item input[type="checkbox"]:checked::after {
  content: '✓' !important;
  color: var(--text-on-accent) !important;
  font-size: 11px !important;
  font-weight: 900 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  text-shadow: none !important;
  line-height: 1 !important;
}

.journalit-trade-log-view-container .journalit-tradelog-status-option-item input[type="checkbox"]:checked + span {
  color: var(--interactive-accent);
  font-weight: 600;
}


.trade-log-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 0 8px 0;
  position: relative;
  min-height: 0; 
  
  -webkit-overflow-scrolling: touch;
  scroll-behavior: auto; 
  will-change: scroll-position;
  
  contain: layout;
}




.trade-log-content.trades-view,
.trade-log-content.tree-view {

  display: flex;

  flex-direction: column;

  min-height: 0; 

  height: 100%; 

  max-height: 100%; 

  overflow: visible; 

}


.trade-log-hscroll {
  width: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0; 
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}


.trade-log-hscroll-inner {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0; 
  min-width: var(--journalit-tradelog-min-width, 100%);
  width: 100%;
  position: relative; 
}


.trade-log-content.trades-view,
.trade-log-content.tree-view {
  overflow: hidden; 
}



.trade-log-content::-webkit-scrollbar {
  width: 8px;
}

.trade-log-content::-webkit-scrollbar-thumb {
  background: var(--background-modifier-border);
  border-radius: 4px;
}


.trade-log-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-muted);
}

.journalit-trade-log-view-container .spinner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.journalit-trade-log-view-container .spinner::before {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid var(--text-muted);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}




.trade-log-tree {

  width: 100%;

  padding: 0;

  display: flex;
  flex-direction: column;
  flex: 1 1 auto; 
  height: 100%;
  contain: layout; 

  min-height: 0; 

  

  overflow: visible;

}



.trade-log-tree-wrapper {
  position: relative;
  height: 100%;
  min-height: 0;
}


.trade-log-tree-container {
  height: 100%;
  overflow: hidden;
  position: relative;
  min-height: 0; 
}

.trade-log-tree-container--hidden {
  visibility: hidden;
}

.trade-log-tree-container--visible {
  visibility: visible;
}


.trade-log-virtual-list {
  height: var(--journalit-tradelog-virtual-height, 600px);
  width: 100%;
  overflow-x: hidden;
}

.trade-log-scroll-container {
  height: var(--journalit-tradelog-scroll-height, 600px);
  overflow-y: auto;
  overflow-x: hidden;
}


.trade-log-tree--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-muted);
  font-style: italic;
}


.trade-log-node {
  display: flex;
  align-items: stretch;
  min-height: 48px;
  position: relative;
  
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.trade-log-node:hover {
  background-color: var(--background-modifier-hover);
}


.trade-log-node-placeholder {
  display: flex;
  align-items: center;
  position: relative;
  opacity: 0.3;
  height: var(--journalit-trade-log-node-placeholder-height, 48px);
  width: 100%;
  background: var(--background-primary-alt);
  border-bottom: 1px solid var(--background-modifier-border);
}


.journalit-trade-log-view-container .tree-structure {
  position: relative;
  width: var(--journalit-tree-structure-width, 0px);
}


.journalit-trade-log-view-container .tree-structure:not(:empty) {
  display: flex;
  align-items: stretch;
}

.journalit-trade-log-view-container .tree-level {
  width: 24px;
  position: relative;
}

.journalit-trade-log-view-container .tree-level::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--background-modifier-border);
}


.journalit-trade-log-view-container .trade-log-node.is-last-child .tree-level.last-level::before {
  height: 24px;
}


.trade-log-node--trade .tree-expand-wrapper {
  height: auto;
  width: 12px;
  margin-right: 0;
}


.journalit-trade-log-view-container .node-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}


.trade-log-node--trade .journalit-trade-log-view-container .node-wrapper {
  padding-left: 0;
}


.tree-node-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  position: relative;
  margin-right: 8px;
}


.tree-connector {
  position: absolute;
  left: -13px;
  top: 50%;
  width: 12px;
  height: 1px;
  background: var(--background-modifier-border);
}

.tree-connector--trade {
  top: 0;
}


.tree-expand-wrapper {
  width: 20px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 4px;
}


.tree-leaf-node {
  width: 2px;
  height: 2px;
  background: var(--text-muted);
  border-radius: 50%;
  position: relative;
}

.tree-leaf-node::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 50%;
  width: 5px;
  height: 1px;
  background: var(--background-modifier-border);
}

.tree-leaf-node--trade {
  background: var(--text-normal);
  margin-right: 0;
}


.tree-indicator-cell .tree-leaf-node {
  margin-left: 7px;
}

.tree-indicator-cell .tree-connector {
  left: -6px;
  width: 6px;
  transform: translateY(-50%);
}


.node-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  padding-right: 16px;
}


.journalit-trade-log-view-container .node-chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 48px;
  padding: 0;
  border: none;
  background: transparent !important;
  color: var(--text-muted);
  box-shadow: none !important;
  border-radius: 0;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  position: relative;
}

.journalit-trade-log-view-container .node-chevron:hover {
  background: transparent !important;
  color: var(--text-normal);
  box-shadow: none !important;
}

.journalit-trade-log-view-container .node-chevron:active {
  background: transparent !important;
  color: var(--text-normal);
  box-shadow: none !important;
}

.journalit-trade-log-view-container .node-chevron:focus {
  background: transparent !important;
  outline: none;
  box-shadow: none !important;
}

.journalit-trade-log-view-container .node-chevron:focus-visible {
  background: transparent !important;
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
  box-shadow: none !important;
}

.journalit-trade-log-view-container .node-chevron svg {
  width: 16px;
  height: 16px;
}


.node-label {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border-radius: 0;
  cursor: pointer;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-normal);
  transition: color 0.2s ease;
}

.node-label:hover {
  color: var(--text-accent);
  background-color: transparent;
}


.trade-log-node--year .node-label {
  font-size: 16px;
  font-weight: 600;
}

.trade-log-node--quarter .node-label,
.trade-log-node--month .node-label {
  font-size: 15px;
}

.trade-log-node--week .node-label,
.trade-log-node--day .node-label {
  font-size: 14px;
}


.node-metrics {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 6px 12px;
  background: var(--background-modifier-border);
  border-radius: 4px;
  margin-left: auto;
}

.journalit-trade-log-view-container .metric-column {
  display: flex;
  align-items: center;
  justify-content: center;
}

.journalit-trade-log-view-container .metric-column--count {
  width: 90px;
  text-align: center;
}

.journalit-trade-log-view-container .metric-column--winrate {
  width: 70px;
  text-align: center;
}

.journalit-trade-log-view-container .metric-column--pnl {
  min-width: 100px;
  width: fit-content;
  text-align: center;
  padding: 0 8px;
}

.journalit-trade-log-view-container .metric {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1.4;
  font-family: var(--font-monospace);
}

.journalit-trade-log-view-container .metric--count {
  color: var(--text-muted);
}

.journalit-trade-log-view-container .metric--winrate {
  font-weight: 500;
}

.journalit-trade-log-view-container .metric--winrate.high {
  color: var(--text-success);
}

.journalit-trade-log-view-container .metric--winrate.medium {
  color: var(--text-warning);
}

.journalit-trade-log-view-container .metric--winrate.low {
  color: var(--text-error);
}

.journalit-trade-log-view-container .metric--pnl {
  font-weight: 600;
  font-family: var(--font-monospace);
}

.journalit-trade-log-view-container .metric--pnl.positive {
  color: var(--color-green);
}

.journalit-trade-log-view-container .metric--pnl.negative {
  color: var(--color-red);
}

.journalit-trade-log-view-container .metric--pnl.neutral {
  color: var(--text-muted);
}


.performance-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  vertical-align: middle;
}

.performance-indicator svg {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

.performance-indicator--best {
  color: var(--text-warning); 
}

.performance-indicator--worst {
  color: var(--text-error); 
}


.node-label:hover .performance-indicator--best {
  color: var(--text-warning); 
}

.node-label:hover .performance-indicator--worst {
  color: var(--text-error); 
}


.trade-log-headers {
  position: sticky;
  top: 0;
  background: var(--background-secondary);
  border-bottom: 2px solid var(--background-modifier-border);
  z-index: 10;
  padding: 0;
  flex-shrink: 0; 
}


.trade-log-content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}


.trade-log-header-row {

  display: grid;

  grid-template-columns: var(--journalit-tradelog-grid-template);

  width: calc(100% - var(--journalit-tradelog-header-scrollbar-width, 0px));
  gap: 8px;

  align-items: center;

  padding: 12px 16px 12px 16px;

  font-size: 13px;

  font-weight: 600;

  color: var(--text-muted);

  text-transform: uppercase;

}


.header-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
}

.header-cell.sortable {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: color 0.2s ease;
}

.header-cell.sortable:hover {
  color: var(--text-normal);
  background-color: var(--background-modifier-hover);
  border-radius: 4px;
}

.header-cell.sorted {
  color: var(--interactive-accent);
  font-weight: 700;
}

.header-cell:not(.sortable) > span {
  display: block;
  width: 100%;
  text-align: center;
}

.sort-indicator {
  flex-shrink: 0;
}

.sort-indicator-unsorted {
  flex-shrink: 0;
  color: var(--text-faint);
  opacity: 0.5;
}

.header-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-ticker {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-direction {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-duration {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-status {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-pnl {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-date {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-account {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-mistakes {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-setups {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-tags {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-reviewed {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-positionSize {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-thesis {
  display: flex;
  align-items: center;
  justify-content: center;
}


.header-exchange,
.header-entryTime,
.header-exitDate,
.header-exitTime,
.header-expirationDate,
.header-daysToExpiry,
.header-entryPrice,
.header-exitPrice,
.header-stopLoss,
.header-slDistanceDollar,
.header-slDistancePercent,
.header-riskAmount,
.header-rMultiple,
.header-positionValue,
.header-money-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}


.trade-details-row {
  display: grid;
  grid-template-columns: var(--journalit-tradelog-grid-template);
  gap: 8px;
  align-items: center;
  flex: 1;
  padding: 0 16px;
}


.trade-details-row.tree-view-row {
  grid-template-columns: var(--journalit-tradelog-grid-template);
  gap: 6px;
  padding: 0 16px 0 0;
}


.tree-indicator-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  width: 20px;
}


.trade-log-content.trades-view .trade-log-node--trade {
  padding: 0;
}

.trade-log-content.trades-view .trade-details-row.trades-view-row {
  padding: 0 16px;
  width: 100%;
}


.trade-log-node--trade {
  cursor: pointer;
}

.trade-log-node--trade:hover {
  background-color: var(--background-modifier-hover);
}


.trade-image-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-image-wrapper {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  
}

.trade-image-wrapper:hover {
  
  opacity: 0.8;
}

.trade-preview-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-secondary);
  
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  
  image-rendering: -webkit-optimize-contrast;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.trade-image-count {
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
}

.trade-no-image-icon {
  color: var(--text-faint);
}

.trade-ticker-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-ticker {
  font-weight: 600;
  color: var(--text-normal);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.trade-direction-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-direction {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--text-normal);
}


.trade-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-win {
  background: rgba(76, 175, 80, 0.15);
  color: var(--color-green);
}

.status-loss {
  background: rgba(244, 67, 54, 0.15);
  color: var(--color-red);
}

.status-breakeven {
  background: rgba(128, 128, 128, 0.15);
  color: var(--text-muted);
}

.status-closed {
  background: var(--background-modifier-hover);
  color: var(--text-muted);
}

.status-missed {
  background: rgba(255, 149, 0, 0.15);
  color: var(--color-warning);
}

.status-open {
  background: rgba(33, 150, 243, 0.15);
  color: var(--status-open-color);
}

.status-backtest {
  background: rgba(111, 66, 193, 0.15);
  color: var(--text-accent);
}

.trade-pnl-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.journalit-trade-log-view-container .trade-pnl-copy-adjust-trigger {
  cursor: pointer;
}

.journalit-trade-log-view-container .trade-pnl-copy-multiplier {
  margin-left: 3px;
  color: var(--text-muted);
  opacity: 0.65;
  font-size: 0.68em;
  font-weight: var(--font-normal);
  font-family: var(--font-interface);
  vertical-align: super;
}

.journalit-trade-log-view-container .trade-pnl-copy-adjust-trigger:hover .trade-pnl-copy-value,
.journalit-trade-log-view-container .trade-pnl-copy-adjust-trigger:focus-visible .trade-pnl-copy-value {
  text-decoration-line: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}

.journalit-copy-trade-adjustment-modal__description {
  margin-bottom: var(--size-4-3);
  color: var(--text-muted);
}

.journalit-copy-trade-adjustment-modal__description p {
  margin: 0 0 var(--size-2-1);
}

.journalit-copy-trade-adjustment-modal__preview {
  display: flex;
  align-items: center;
  gap: var(--size-2-2);
  margin-top: var(--size-2-3);
  margin-bottom: var(--size-4-3);
  color: var(--text-muted);
}

.journalit-copy-trade-adjustment-modal__preview-value {
  font-weight: var(--font-semibold);
  font-family: var(--font-monospace);
}

.journalit-copy-trade-adjustment-modal__preview-value.positive {
  color: var(--text-success);
}

.journalit-copy-trade-adjustment-modal__preview-value.negative {
  color: var(--text-error);
}

.journalit-copy-trade-adjustment-modal__preview-value.neutral {
  color: var(--text-normal);
}

.trade-pnl {
  font-weight: 600;
  font-family: var(--font-monospace);
  font-size: 15px;
}

.trade-pnl.positive {
  color: var(--color-green);
}

.trade-pnl.negative {
  color: var(--color-red);
}

.trade-pnl.neutral {
  color: var(--text-muted);
}

.trade-pnl.open {
  color: var(--status-open-color);
  font-style: italic;
}

.trade-status-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-duration-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-duration {
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
  white-space: nowrap;
}

.trade-date-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-date {
  color: var(--text-muted);
  font-size: 13px;
  font-family: var(--font-monospace);
}

.trade-mistakes-cell,
.trade-setups-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

${TRADE_ACCOUNT_CELL_STYLES}


.trade-tags-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
}

.trade-tags-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
}

.trade-tags-icon {
  color: var(--text-accent);
}

.trade-tags-icon:hover {
  color: var(--interactive-accent);
}

.trade-tags-count-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  min-width: 12px;
  height: 12px;
  padding: 0 3px;
  border-radius: 6px;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  font-size: 8px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: center;
}

.custom-tags-tooltip .tooltip-title {
  color: var(--interactive-accent);
}


.trade-reviewed-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-reviewed-icon {
  flex-shrink: 0;
}

.trade-reviewed-icon--yes {
  color: var(--color-green);
}

.trade-reviewed-icon--no {
  color: var(--text-muted);
}


.trade-select-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.trade-select-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--interactive-accent);
}

.header-select {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.header-select input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--interactive-accent);
}


.trade-position-size-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-position-size {
  font-family: var(--font-monospace);
  font-size: 13px;
  color: var(--text-normal);
}


.trade-expiration-date-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-expiration-date {
  font-family: var(--font-monospace);
  font-size: 13px;
  color: var(--text-normal);
}


.trade-dte-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-dte-circle {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  min-width: 28px;
  text-align: center;
}

.trade-dte-circle--green {
  background: rgba(76, 175, 80, 0.15);
  color: var(--color-green);
}

.trade-dte-circle--yellow {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
}

.trade-dte-circle--red {
  background: rgba(244, 67, 54, 0.15);
  color: var(--color-red);
}

.trade-dte-number {
  line-height: 1;
}

.trade-dte-expired {
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
}

.trade-thesis-cell,
.trade-mt-comment-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-thesis,
.trade-mt-comment {
  font-size: 13px;
  color: var(--text-normal);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
}


.trade-exchange-cell,
.trade-entry-time-cell,
.trade-exit-date-cell,
.trade-exit-time-cell,
.trade-entry-price-cell,
.trade-exit-price-cell,
.trade-price-move-cell,
.trade-stop-loss-cell,
.trade-sl-distance-cell,
.trade-sl-distance-percent-cell,
.trade-risk-amount-cell,
.trade-r-multiple-cell,
.trade-max-r-cell,
.trade-mae-cell,
.trade-mfe-cell,
.trade-mae-price-cell,
.trade-mfe-price-cell,
.trade-mae-percent-cell,
.trade-mfe-percent-cell,
.trade-position-value-cell,
.trade-money-cell,
.trade-return-percent-cell,
.trade-custom-field-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-exchange {
  color: var(--text-muted);
  font-size: 13px;
}

.trade-custom-field-cell {
  min-width: 0;
  padding: 0 4px;
}

.trade-custom-field-cell span {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trade-entry-time,
.trade-exit-time,
.trade-custom-field-datetime-value {
  color: var(--text-muted);
  font-size: 13px;
  font-family: var(--font-monospace);
}

.trade-exit-date {
  color: var(--text-muted);
  font-size: 13px;
  font-family: var(--font-monospace);
}

.trade-entry-price,
.trade-exit-price,
.trade-stop-loss {
  color: var(--text-muted);
  font-size: 13px;
  font-family: var(--font-monospace);
}

.trade-price-move {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-monospace);
}

.trade-price-move.positive {
  color: var(--color-green);
}

.trade-price-move.negative {
  color: var(--color-red);
}

.trade-sl-distance,
.trade-sl-distance-percent {
  color: var(--text-muted);
  font-size: 13px;
  font-family: var(--font-monospace);
}

.trade-risk-amount {
  color: var(--text-muted);
  font-size: 13px;
  font-family: var(--font-monospace);
}

.trade-r-multiple,
.trade-max-r,
.trade-return-percent {
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-monospace);
}

.trade-r-multiple.positive,
.trade-max-r.positive,
.trade-return-percent.positive {
  color: var(--color-green);
}

.trade-r-multiple.negative,
.trade-max-r.negative,
.trade-return-percent.negative {
  color: var(--color-red);
}

.trade-position-value {
  color: var(--text-normal);
  font-size: 13px;
  font-family: var(--font-monospace);
}

.trade-money-value {
  color: var(--text-muted);
  font-size: 13px;
  font-family: var(--font-monospace);
}

.trade-mae,
.trade-mfe {
  font-size: 13px;
  font-family: var(--font-monospace);
}

.trade-mae-price,
.trade-mfe-price {
  color: var(--text-muted);
  font-size: 13px;
  font-family: var(--font-monospace);
}

.trade-mae-percent,
.trade-mfe-percent {
  color: var(--text-muted);
  font-size: 13px;
  font-family: var(--font-monospace);
}

.trade-no-data {
  color: var(--text-faint);
  font-size: 13px;
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



.trade-log-sizer-row {
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  overflow: visible; 
  pointer-events: none;
  opacity: 0; 
}

.trade-log-sizer-row .sizer-cell {
  display: inline-flex;
  flex-shrink: 0;
}

.trade-log-sizer-row .expanded-pills.sizer-pills {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 4px;
  
  overflow: visible;
  max-width: none;
  width: auto;
}


.trade-setups-cell.expanded,
.trade-mistakes-cell.expanded,
.trade-tags-cell.expanded,
.trade-custom-field-cell.expanded {
  justify-content: center;
  padding: 4px 0;
  min-width: 0;
}

.expanded-pills {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  align-items: center;
}

.journalit-trade-log-view-container .pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.journalit-trade-log-view-container .pill--setup {
  background: rgba(33, 150, 243, 0.15);
  color: var(--color-info);
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.journalit-trade-log-view-container .pill--mistake {
  background: rgba(244, 67, 54, 0.15);
  color: var(--color-red);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.journalit-trade-log-view-container .pill--tag {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
  border: 1px solid var(--background-modifier-border);
}

.journalit-trade-log-view-container .pill.journalit-label-color {
  background: var(--journalit-label-color);
  color: var(--journalit-label-foreground);
  border-color: var(--journalit-label-color);
}


.journalit-trade-log-view-container .tooltip-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

.journalit-tooltip {
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-width: 250px;
  min-width: 120px;
  font-size: 13px;
  color: var(--text-normal);
  z-index: 9999;
  pointer-events: none;
  position: fixed !important;
}

.journalit-tooltip.trade-log-inline-value-tooltip {
  min-width: 0;
  width: auto;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.journalit-tooltip.trade-log-inline-value-tooltip .tooltip-item,
.journalit-tooltip.trade-log-inline-value-tooltip .tooltip-title,
.journalit-tooltip.trade-log-inline-value-tooltip .tooltip-content {
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
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
  white-space: nowrap;
}

.journalit-tooltip.mistakes-tooltip .tooltip-title {
  color: var(--color-red);
}

.journalit-tooltip.setups-tooltip .tooltip-title {
  color: var(--interactive-accent);
}

.journalit-tooltip.thesis-tooltip .tooltip-content {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
  color: var(--text-normal);
}


@media (max-width: 1440px) {
  .journalit-dashboard-custom-date-dropdown {
    right: -250px !important;
    width: 300px !important;
  }

  .journalit-dashboard-custom-date-dropdown.position-left {
    left: -250px !important;
    width: 300px !important;
  }
}

@media (max-width: 1200px) {
  

  .journalit-trade-log-view-container .metric--best,
  .journalit-trade-log-view-container .metric--worst {
    display: none;
  }

  .trade-pnl {
    font-size: 14px;
  }

  .trade-log-controls {
    gap: 12px;
  }

  .trade-log-view-selector select {
    min-width: 75px;
    font-size: 12px;
  }
}

@media (max-width: 996px) {
  .journalit-dashboard-custom-date-dropdown {
    right: -100px !important;
  }

  .journalit-dashboard-custom-date-dropdown.position-left {
    left: -100px !important;
  }
}

@media (max-width: 900px) {
  


  
  .trade-account-cell,

  .header-account,

  .trade-mistakes-cell,

  .trade-setups-cell,

  .header-mistakes,

  .header-setups {

    

  }


  .trade-pnl {
    font-size: 13px;
  }

  .trade-log-controls {
    gap: 8px;
  }

  .trade-log-view-selector {
    gap: 6px;
  }

  .trade-log-view-selector label {
    font-size: 12px;
  }

  .trade-log-filter-actions {
    gap: 6px;
  }
}

@media (max-width: 768px) {
  .trade-pnl {
    font-size: 12px;
  }

  .trade-log-controls {
    gap: 6px;
    flex-wrap: wrap;
  }

  .trade-log-view-selector label {
    display: none;
  }

  .trade-log-view-selector select {
    min-width: 68px;
    font-size: 11px;
    padding: 4px 6px;
  }

  .trade-log-filter-actions {
    gap: 4px;
  }

  .trade-log-image-gallery-controls {
    flex: 1 1 100%;
    justify-content: flex-start;
    gap: 6px;
  }

  .trade-log-image-gallery-control {
    flex: 1 1 130px;
  }

  .trade-log-image-gallery-control-dropdown {
    flex: 1 1 auto;
    min-width: 0;
  }

  .trade-log-image-gallery-control-trigger {
    min-height: 28px;
    padding: 0 7px 0 8px;
    font-size: 12px;
  }

  .journalit-dashboard-custom-date-dropdown {
    position: static !important;
    width: 100% !important;
    margin-top: 8px !important;
    flex-direction: column !important;
    box-shadow: none !important;
    left: auto !important;
    right: auto !important;
  }

  .journalit-dashboard-custom-date-dropdown.position-left,
  .journalit-dashboard-custom-date-dropdown.position-below {
    position: static !important;
    left: auto !important;
    right: auto !important;
  }
}

@media (max-width: 600px) {
  .trade-pnl {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .trade-log-controls {
    gap: 4px;
  }

  .trade-log-view-selector select {
    min-width: 65px;
    font-size: 10px;
  }

  .trade-log-filter-actions {
    gap: 2px;
  }

  .trade-log-header {
    padding: 10px 12px 6px;
  }

  .trade-log-image-gallery-controls {
    gap: 6px;
  }

  .trade-log-image-gallery-control {
    flex: 1 1 calc(50% - 6px);
    font-size: 12px;
  }

  .journalit-image-gallery-size-toggle {
    flex: 0 0 auto;
  }

  .journalit-dashboard-custom-date-dropdown.position-below {
    max-width: 100% !important;
  }
}

@container journalit-trade-log (max-width: 480px) {
  .trade-log-header {
    padding: 10px 12px 6px;
  }

  .trade-log-controls {
    gap: 6px;
  }

  .trade-log-image-gallery-controls {
    flex: 1 1 100%;
    justify-content: flex-start;
    gap: 6px;
  }

  .trade-log-image-gallery-control {
    flex: 1 1 calc(50% - 6px);
    font-size: 12px;
  }

  .trade-log-image-gallery-control-dropdown {
    flex: 1 1 auto;
    min-width: 0;
  }

  .trade-log-image-gallery-control-trigger {
    min-height: 28px;
    padding: 0 7px 0 8px;
    font-size: 12px;
  }

  .journalit-image-gallery-size-toggle {
    flex: 0 0 auto;
  }
}


.journalit-dashboard-custom-date-dropdown.position-below {
  top: 100% !important;
  left: 0 !important;
  right: auto !important;
  margin-top: 8px !important;
  width: 100% !important;
  max-width: 360px !important;
}

.journalit-trade-log-view-container .journalit-dashboard-date-range-inputs.journalit-dashboard-custom-date-dropdown {
  width: 300px !important;
  max-width: min(300px, calc(100vw - 32px)) !important;
}

.journalit-trade-log-view-container .journalit-dashboard-date-range-inputs.journalit-dashboard-custom-date-dropdown.position-left {
  left: auto !important;
  right: 0 !important;
}

@media (max-width: 768px) {
  .journalit-dashboard-custom-date-anchor {
    display: flex !important;
    flex-direction: column !important;
  }

  .journalit-trade-log-view-container .journalit-dashboard-date-range-inputs.journalit-dashboard-custom-date-dropdown {
    width: 100% !important;
    max-width: none !important;
  }

  .journalit-trade-log-view-container .journalit-dashboard-date-range-inputs.journalit-dashboard-custom-date-dropdown.position-left,
  .journalit-trade-log-view-container .journalit-dashboard-date-range-inputs.journalit-dashboard-custom-date-dropdown.position-below {
    position: static !important;
    left: auto !important;
    right: auto !important;
  }
}

`;
