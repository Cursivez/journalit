


export const TEMPLATE_BUILDER_STYLES = `

.journalit-template-builder-container {
  background: var(--background-primary);
  color: var(--text-normal);
  overflow: hidden;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}


.journalit-template-builder-container .view-header {
  flex-shrink: 0;
}


.journalit-template-builder-container .template-builder-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}


.journalit-template-builder-container .journalit-react-view-root {
  height: 100%;
  overflow: visible;
  display: flex;
  flex-direction: column;
  min-height: 0;
}


.journalit-template-builder-container .template-builder-tabs {
  display: flex;
  border-bottom: 2px solid var(--background-modifier-border);
  background: var(--background-primary);
  flex-shrink: 0;
  padding: 0 16px;
  gap: 4px;
}

.journalit-template-builder-container .template-builder-tab {
  padding: 12px 20px;
  cursor: pointer;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  background: transparent;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
  bottom: -2px;
}

.journalit-template-builder-container .template-builder-tab:hover {
  color: var(--text-normal);
  background: var(--background-modifier-hover);
}

.journalit-template-builder-container .template-builder-tab.is-active {
  color: var(--text-accent);
  border-bottom-color: var(--interactive-accent);
  font-weight: 600;
}


.journalit-template-builder-container .template-builder-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
  background: var(--background-primary);
}


.journalit-template-builder-container .template-editor-canvas {
  background-color: var(--background-primary);
  background-size: 20px 20px;
  background-position: 0 0;
}

.theme-light .journalit-template-builder-container .template-editor-canvas {
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
}

.theme-dark .journalit-template-builder-container .template-editor-canvas {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
}


.journalit-template-builder-container .template-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.journalit-template-builder-container .template-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-primary-alt);
  cursor: pointer;
  transition: all 0.2s ease;
}

.journalit-template-builder-container .template-list-item:hover {
  background: var(--background-modifier-hover);
  border-color: var(--background-modifier-border-hover);
}

.journalit-template-builder-container .template-list-item--selected {
  border-color: var(--interactive-accent);
  background: var(--background-secondary);
}

.journalit-template-builder-container .template-list-item-info {
  flex: 1;
  min-width: 0;
}

.journalit-template-builder-container .template-list-item-name {
  font-weight: 600;
  color: var(--text-normal);
  margin-bottom: 4px;
  font-size: 15px;
}

.journalit-template-builder-container .template-list-item-description {
  color: var(--text-muted);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-template-builder-container .template-list-item-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}


.journalit-template-builder-container .template-editor {
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  padding: 24px;
  background: var(--background-secondary);
}

.journalit-template-builder-container .template-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-template-builder-container .template-editor-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-normal);
  margin: 0;
}

.journalit-template-builder-container .template-editor-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}


.journalit-template-builder-container .template-form-field {
  margin-bottom: 20px;
}

.journalit-template-builder-container .template-form-label {
  display: block;
  font-weight: 500;
  color: var(--text-normal);
  margin-bottom: 8px;
  font-size: 14px;
}

.journalit-template-builder-container .template-form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.journalit-template-builder-container .template-form-input:focus {
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2);
  outline: none;
}

.journalit-template-builder-container .template-form-input:disabled {
  background: var(--background-secondary);
  cursor: not-allowed;
  opacity: 0.7;
}


.journalit-template-builder-container select.template-form-input {
  height: 40px;
  min-height: 40px;
  line-height: 20px;
  padding: 8px 12px;
}

.journalit-template-builder-container .template-form-textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}


.journalit-template-builder-container .template-sections-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.journalit-template-builder-container .template-section-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-primary);
  transition: all 0.2s ease;
}

.journalit-template-builder-container .template-section-item:hover {
  border-color: var(--background-modifier-border-hover);
  background: var(--background-modifier-hover);
}

.journalit-template-builder-container .template-section-item--dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.journalit-template-builder-container .template-section-item__summary {
  flex: 1 1 auto;
  min-width: 0;
}

.journalit-template-builder-container .template-section-item__title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.journalit-template-builder-container .template-section-drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 12px;
  cursor: grab;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.journalit-template-builder-container .template-section-drag-handle:hover {
  color: var(--text-normal);
}

.journalit-template-builder-container .template-section-drag-handle:active {
  cursor: grabbing;
}


.journalit-template-builder-container .template-section-reorder-indicator {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--interactive-accent);
  border-radius: 1px;
  pointer-events: none;
  z-index: 100;
}

.journalit-template-builder-container .template-section-reorder-indicator--top {
  top: -1px;
}

.journalit-template-builder-container .template-section-reorder-indicator--bottom {
  bottom: -1px;
}

.journalit-template-builder-container .template-section-content {
  flex: 1;
  min-width: 0;
}

.journalit-template-builder-container .template-section-title {
  font-weight: 500;
  color: var(--text-normal);
  margin-bottom: 4px;
  font-size: 14px;
}

.journalit-template-builder-container .template-section-type {
  color: var(--text-muted);
  font-size: 12px;
}

.journalit-template-builder-container .template-section-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.journalit-template-builder-container .template-layout-scope-panel {
  gap: 20px;
}

.journalit-template-builder-container .template-layout-scope-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 0;
}

.journalit-template-builder-container .template-layout-scope-header .template-editor-section-title {
  margin-bottom: 0;
}

.journalit-template-builder-container .template-layout-scope-bar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  overflow: visible;
  margin-top: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-template-builder-container .template-layout-scope-tabs {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0;
  width: 100%;
}

.journalit-template-builder-container .template-layout-scope-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex: 0 0 auto;
}

.journalit-template-builder-container .template-layout-scope-tab {
  appearance: none !important;
  flex: 0 1 auto;
  min-width: 70px;
  min-height: 44px;
  margin: 0 !important;
  padding: 0 10px !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-right-width: 1px !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  background: var(--background-secondary) !important;
  color: var(--text-muted) !important;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.journalit-template-builder-container .template-layout-scope-tab:not(.is-first) {
  margin-left: -1px !important;
}

.journalit-template-builder-container .template-layout-scope-tab.is-first {
  border-top-left-radius: 10px !important;
  border-bottom-left-radius: 10px !important;
}

.journalit-template-builder-container .template-layout-scope-tab.is-last {
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}

.journalit-template-builder-container .template-layout-scope-tab:hover:not(.is-active) {
  background: var(--background-modifier-hover) !important;
  color: var(--text-normal) !important;
}

.journalit-template-builder-container .template-layout-scope-tab.is-active {
  position: relative;
  z-index: 1;
  background: color-mix(
    in srgb,
    var(--interactive-accent) 36%,
    var(--background-secondary)
  ) !important;
  border-color: var(--interactive-accent) !important;
  box-shadow:
    inset 0 0 0 1px
      color-mix(in srgb, var(--interactive-accent) 55%, transparent),
    0 0 0 1px color-mix(in srgb, var(--interactive-accent) 25%, transparent) !important;
  color: var(--text-normal) !important;
}

.journalit-template-builder-container .template-layout-scope-tab.is-active:not(.is-first):not(.is-last) {
  border-radius: 0 !important;
}

.journalit-template-builder-container .template-layout-scope-tab.is-active.is-first:not(.is-last) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.journalit-template-builder-container .template-layout-scope-tab.is-active.is-last:not(.is-first) {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.journalit-template-builder-container .template-layout-scope-tab.is-active.is-first.is-last {
  border-radius: 10px !important;
}

.journalit-template-builder-container .template-layout-scope-menu-wrapper {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
}

.journalit-template-builder-container .template-layout-scope-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 20;
  min-width: 160px;
  padding: 6px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-primary);
  box-shadow: var(--shadow-l);
}

.journalit-template-builder-container .template-layout-scope-menu-item {
  appearance: none !important;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 30px;
  padding: 6px 10px !important;
  border: 0 !important;
  border-radius: 6px !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}

.journalit-template-builder-container .template-layout-scope-menu-item:hover {
  background: var(--background-modifier-hover) !important;
}

.journalit-template-builder-container .template-section-item__actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.journalit-template-builder-container .template-section-item__actions .journalit-reorder-controls {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.journalit-template-builder-container .template-section-move-button.journalit-button {
  min-width: 28px !important;
  width: 28px !important;
  height: 28px !important;
  padding: 5px !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 4px !important;
  background-color: var(--background-primary) !important;
  color: var(--text-normal) !important;
  gap: 0 !important;
  flex: 0 0 28px;
  line-height: 1;
  transition: all 0.2s ease !important;
}

.journalit-template-builder-container .template-section-move-button.journalit-button:hover:not(:disabled) {
  background-color: var(--background-modifier-hover) !important;
  border-color: var(--interactive-accent) !important;
  color: var(--text-normal) !important;
}

.journalit-template-builder-container .template-section-move-button.journalit-button:disabled {
  opacity: 0.35;
}


.journalit-template-builder-container .template-action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  white-space: nowrap;
}

.journalit-template-builder-container .template-action-button--primary {
  background: var(--interactive-accent);
  color: var(--text-on-accent, white);
  border-color: var(--interactive-accent);
}

.journalit-template-builder-container .template-action-button--primary:hover {
  background: var(--interactive-accent-hover);
  border-color: var(--interactive-accent-hover);
}

.journalit-template-builder-container .template-action-button--secondary {
  background: var(--background-secondary);
  color: var(--text-normal);
  border-color: var(--background-modifier-border);
}

.journalit-template-builder-container .template-action-button--secondary:hover {
  background: var(--background-modifier-hover);
  border-color: var(--background-modifier-border-hover);
}

.journalit-template-builder-container .template-action-button--danger {
  background: var(--background-modifier-error);
  color: var(--text-on-accent, white);
  border-color: var(--background-modifier-error);
}

.journalit-template-builder-container .template-action-button--danger:hover {
  opacity: 0.9;
}

.journalit-template-builder-container .template-action-button--small {
  padding: 6px 12px;
  font-size: 13px;
}

.journalit-template-builder-container .template-action-button--compact {
  padding: 5px 12px;
  font-size: 12px;
}

.journalit-template-builder-container .template-action-button--neutral {
  background: var(--background-primary);
  color: var(--text-normal);
  border-color: var(--background-modifier-border);
}

.journalit-template-builder-container .template-action-button--neutral:hover {
  background: var(--background-modifier-hover);
  border-color: var(--background-modifier-border-hover);
}

.journalit-template-builder-container .template-action-button--icon-only {
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
}

.journalit-template-builder-container .template-action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.journalit-template-builder-container .template-action-button-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.journalit-template-builder-container .template-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.journalit-template-builder-container .template-modal {
  background: var(--background-primary);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.journalit-template-builder-container .template-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-template-builder-container .template-modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-normal);
  margin: 0;
}

.journalit-template-builder-container .template-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.journalit-template-builder-container .template-modal-close:hover {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-template-builder-container .template-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.journalit-template-builder-container .template-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--background-modifier-border);
}


.journalit-template-builder-container .template-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.journalit-template-builder-container .template-empty-state-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  color: var(--text-muted);
  opacity: 0.5;
}

.journalit-template-builder-container .template-empty-state-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-normal);
  margin-bottom: 8px;
}

.journalit-template-builder-container .template-empty-state-description {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
  max-width: 400px;
  line-height: 1.5;
}


.journalit-template-builder-container .template-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: var(--background-secondary);
  border-bottom: 1px solid var(--background-modifier-border);
  flex-shrink: 0;
}

.journalit-template-builder-container .template-toolbar-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.journalit-template-builder-container .template-toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}


.journalit-template-builder-container .template-search-input {
  padding: 8px 12px 8px 36px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 14px;
  width: 250px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.journalit-template-builder-container .template-search-input:focus {
  border-color: var(--interactive-accent);
  box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2);
  outline: none;
}

.journalit-template-builder-container .template-search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.journalit-template-builder-container .template-search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}


.journalit-template-builder-container .template-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: var(--background-secondary);
  color: var(--text-muted);
}

.journalit-template-builder-container .template-badge--active {
  background: var(--interactive-accent);
  color: var(--text-on-accent, white);
}


.journalit-template-builder-container .template-dropdown {
  position: relative;
  display: inline-block;
}

.journalit-template-builder-container .template-dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 160px;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 100;
}

.journalit-template-builder-container .template-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  color: var(--text-normal);
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s ease;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
}

.journalit-template-builder-container .template-dropdown-item:hover {
  background: var(--background-modifier-hover);
}

.journalit-template-builder-container .template-dropdown-item--danger {
  color: var(--text-error);
}

.journalit-template-builder-container .template-dropdown-divider {
  height: 1px;
  background: var(--background-modifier-border);
  margin: 4px 0;
}


@media (max-width: 768px) {
  .journalit-template-builder-container .template-builder-tabs {
    padding: 0 8px;
    gap: 0;
  }

  .journalit-template-builder-container .template-builder-tab {
    padding: 12px 12px;
    font-size: 13px;
  }

  .journalit-template-builder-container .template-builder-content {
    padding: 16px;
  }

  .journalit-template-builder-container .template-editor {
    padding: 16px;
  }

  .journalit-template-builder-container .template-search-input {
    width: 180px;
  }

  .journalit-template-builder-container .template-toolbar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .journalit-template-builder-container .template-toolbar-left,
  .journalit-template-builder-container .template-toolbar-right {
    flex-direction: column;
    width: 100%;
  }

  .journalit-template-builder-container .template-search-wrapper {
    width: 100%;
  }

  .journalit-template-builder-container .template-search-input {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .journalit-template-builder-container .template-builder-tab {
    padding: 10px 8px;
    font-size: 12px;
  }

  .journalit-template-builder-container .template-modal {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .journalit-template-builder-container .template-list-item-description {
    display: none;
  }

  .journalit-template-builder-container .template-action-button {
    padding: 6px 12px;
    font-size: 13px;
  }
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.journalit-template-builder-container .template-editor,
.journalit-template-builder-container .template-list-item,
.journalit-template-builder-container .template-modal {
  animation: fadeIn 0.2s ease-out;
}


.journalit-template-builder-container .widget-picker-container {
  position: relative;
  width: 100%;
}

.journalit-template-builder-container .widget-picker-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 10px;
  font-size: 13px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-primary);
  color: var(--text-normal);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease;
}

.journalit-template-builder-container .widget-picker-trigger:hover {
  border-color: var(--interactive-accent);
}

.journalit-template-builder-container .widget-picker-trigger--placeholder {
  color: var(--text-muted);
}

.journalit-template-builder-container .widget-picker-icon {
  flex-shrink: 0;
  margin-left: 8px;
  color: var(--text-muted);
  transition: transform 0.15s ease;
}

.journalit-template-builder-container .widget-picker-icon--open {
  transform: rotate(180deg);
}

.journalit-template-builder-container .widget-picker-dropdown,
.widget-picker-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 400px;
  overflow-y: auto;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.widget-picker-dropdown--floating {
  position: fixed;
  top: var(--widget-picker-floating-top, 0px);
  left: var(--widget-picker-floating-left, 0px);
  right: auto;
  width: var(--widget-picker-floating-width, 320px);
  max-height: var(--widget-picker-floating-max-height, 400px);
  z-index: 100080;
}

.journalit-template-builder-container .widget-picker-category,
.widget-picker-dropdown--floating .widget-picker-category {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 14px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  background: var(--background-primary);
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: none;
}

.journalit-template-builder-container .widget-picker-category::before,
.journalit-template-builder-container .widget-picker-category::after,
.widget-picker-dropdown--floating .widget-picker-category::before,
.widget-picker-dropdown--floating .widget-picker-category::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--background-modifier-border);
}

.journalit-template-builder-container .widget-picker-item,
.widget-picker-dropdown--floating .widget-picker-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 50px;
  padding: 14px 14px;
  margin: 4px 0;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  box-sizing: border-box;
  gap: 0;
  transition: background 0.1s ease;
}

.journalit-template-builder-container .widget-picker-item:first-child,
.widget-picker-dropdown--floating .widget-picker-item:first-child {
  margin-top: 4px;
}

.journalit-template-builder-container .widget-picker-item:hover,
.widget-picker-dropdown--floating .widget-picker-item:hover,
.widget-picker-dropdown--floating .widget-picker-item--focused {
  background: var(--background-secondary);
}

.journalit-template-builder-container .widget-picker-item-content,
.widget-picker-dropdown--floating .widget-picker-item-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.journalit-template-builder-container .widget-picker-item-name,
.widget-picker-dropdown--floating .widget-picker-item-name {
  display: block;
  width: 100%;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-normal);
}

.journalit-template-builder-container .widget-picker-item-description,
.widget-picker-dropdown--floating .widget-picker-item-description {
  display: block;
  width: 100%;
  margin-top: 2px;
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
}


.journalit-template-builder-container .template-toggle {
  width: 36px;
  height: 20px;
  border-radius: 10px;
  border: none;
  background: var(--background-modifier-border);
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
}

.journalit-template-builder-container .template-toggle.is-checked {
  background: var(--interactive-accent);
}

.journalit-template-builder-container .template-toggle.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.journalit-template-builder-container .template-toggle__thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: left 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.journalit-template-builder-container .template-toggle.is-checked .template-toggle__thumb {
  left: 18px;
}

.journalit-template-builder-container .template-section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--background-modifier-border);
}

.journalit-template-builder-container .template-editor-panel .template-section-row:last-child {
  border-bottom: 0;
}

.journalit-template-builder-container .template-section-row__info {
  flex: 1;
}

.journalit-template-builder-container .template-section-row__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-normal);
}

.journalit-template-builder-container .template-section-row__description {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.journalit-template-builder-container .template-section-row__control {
  margin-left: 16px;
}

.journalit-template-builder-container .template-select {
  padding: 6px 10px;
  border-radius: var(--radius-s);
  border: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 13px;
  cursor: pointer;
  opacity: 1;
  text-align: center;
}

.journalit-template-builder-container .template-select--compact {
  padding: 4px 8px;
}

.journalit-template-builder-container .template-select.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.journalit-template-builder-container .template-input {
  width: 100%;
  padding: 8px 10px;
  border-radius: var(--radius-s);
  border: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 13px;
  font-family: inherit;
  opacity: 1;
}

.journalit-template-builder-container .template-input--compact {
  padding: 6px 10px;
}

.journalit-template-builder-container .template-input--textarea {
  resize: vertical;
}

.journalit-template-builder-container .template-input.is-disabled {
  opacity: 0.5;
}

.journalit-template-builder-container .template-section-card {
  background: var(--background-secondary);
  border-radius: var(--radius-s);
  border: 1px solid var(--background-modifier-border);
}

.journalit-template-builder-container .template-section-card.is-dragging {
  background: var(--background-primary);
  border-color: var(--interactive-accent);
  opacity: 0.5;
  z-index: 1000;
}

.journalit-template-builder-container .template-section-row-main {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
}

.journalit-template-builder-container .template-section-handle {
  color: var(--text-faint);
  cursor: default;
  padding: 4px;
  display: flex;
  align-items: center;
  touch-action: none;
  opacity: 0.3;
}

.journalit-template-builder-container .template-section-handle.is-editing {
  cursor: grab;
  opacity: 1;
}

.journalit-template-builder-container .template-section-info {
  flex: 1;
  cursor: default;
}

.journalit-template-builder-container .template-section-info.is-editing {
  cursor: pointer;
}

.journalit-template-builder-container .template-section-info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.journalit-template-builder-container .template-section-title {
  font-size: 13px;
  font-weight: 500;
}

.journalit-template-builder-container .template-section-type {
  font-size: 10px;
  padding: 2px 6px;
  background: var(--background-modifier-border);
  border-radius: 4px;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-section-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.journalit-template-builder-container .template-section-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  cursor: pointer;
}

.journalit-template-builder-container .template-section-duplicate {
  color: var(--text-muted);
}

.journalit-template-builder-container .template-section-duplicate:hover {
  color: var(--text-normal);
  background: var(--background-modifier-hover);
}

.journalit-template-builder-container .template-section-remove {
  color: var(--text-error);
}

.journalit-template-builder-container .template-section-remove:hover {
  color: var(--text-error);
  background: var(--background-modifier-hover);
}

.journalit-template-builder-container .template-section-remove:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.journalit-template-builder-container .template-section-expanded {
  padding: 12px;
  border-top: 1px solid var(--background-modifier-border);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.journalit-template-builder-container .template-section-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
  display: block;
}

.journalit-template-builder-container .template-checkboxlist-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.journalit-template-builder-container .template-editor-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.journalit-template-builder-container .template-editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-editor-topbar {
  height: 53px;
  padding: 0 20px;
  border-bottom: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.journalit-template-builder-container .template-editor-topbar-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.journalit-template-builder-container .template-editor-topbar-group--tight {
  gap: 12px;
}

.journalit-template-builder-container .template-editor-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.journalit-template-builder-container .template-editor-title-text {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.journalit-template-builder-container .template-editor-title-text.is-editable {
  cursor: pointer;
}

.journalit-template-builder-container .template-editor-title-name {
  font-size: 14px;
  font-weight: 600;
}

.journalit-template-builder-container .template-editor-title-input {
  font-size: 16px;
  font-weight: 600;
  padding: 4px 8px;
  border: 1px solid var(--interactive-accent);
  border-radius: var(--radius-s);
  background: var(--background-primary);
  color: var(--text-normal);
}

.journalit-template-builder-container .template-editor-badge {
  font-size: 11px;
  padding: 2px 6px;
  background: var(--background-modifier-border);
  border-radius: 4px;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-editor-badge--type {
  text-transform: uppercase;
}

.journalit-template-builder-container .template-editor-builtin-label {
  font-size: 11px;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-editor-canvas-container {
  flex: 1;
  overflow: auto;
}

.journalit-template-builder-container .template-editor-root--has-floating-unsaved .template-editor-canvas-container {
  padding-bottom: var(--template-floating-unsaved-clearance, 112px);
  scroll-padding-bottom: var(--template-floating-unsaved-clearance, 112px);
}

.journalit-template-builder-container .template-editor-root--has-floating-unsaved {
  --template-floating-unsaved-clearance: 112px;
}

.journalit-template-builder-container .template-editor-content {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.journalit-template-builder-container .template-unsaved-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(var(--color-blue-rgb, 72, 138, 224), 0.1);
  border-radius: var(--radius-s);
  border: 1px solid rgba(var(--color-blue-rgb, 72, 138, 224), 0.3);
  font-size: 13px;
}

.journalit-template-builder-container .template-unsaved-banner--floating {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 16px;
  z-index: 20;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
}

.journalit-template-builder-container .template-unsaved-banner__text {
  color: var(--text-normal);
}

.journalit-template-builder-container .template-unsaved-banner__actions {
  display: flex;
  gap: 8px;
}

@container (max-width: 520px) {
  .journalit-template-builder-container .template-editor-root--has-floating-unsaved {
    --template-floating-unsaved-clearance: 152px;
  }

  .journalit-template-builder-container .template-unsaved-banner--floating {
    left: 12px;
    right: 12px;
    bottom: 12px;
    flex-wrap: wrap;
    gap: 10px;
  }
}

.journalit-template-builder-container .template-editor-panel {
  background: var(--background-secondary);
  border-radius: var(--radius-m);
  padding: 16px 20px;
}

.journalit-template-builder-container .template-trade-note-customization-surface {
  overflow: visible;
  border-radius: var(--radius-m);
  background: var(--background-secondary);
}

.journalit-template-builder-container .template-trade-note-customization-surface > .template-editor-panel {
  background: transparent;
  border-radius: 0;
  padding: 16px 20px;
}

.journalit-template-builder-container .template-trade-note-customization-surface > .template-editor-panel + .template-editor-panel {
  border-top: 1px solid var(--background-modifier-border);
}

.journalit-template-builder-container .template-trade-note-customization-surface > .template-layout-scope-panel + .template-editor-panel {
  border-top: 0;
}

.journalit-template-builder-container .template-editor-panel--spaced {
  margin-bottom: 20px;
}

.journalit-template-builder-container .template-editor-section-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-normal);
  display: flex;
  align-items: center;
  gap: 8px;
}

.journalit-template-builder-container .template-editor-section-title--compact {
  margin-bottom: 8px;
}

.journalit-template-builder-container .template-editor-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  margin-bottom: 16px;
  border-radius: var(--radius-s);
  font-size: 13px;
  color: var(--text-normal);
}

.journalit-template-builder-container .template-editor-notice--warning {
  background: rgba(var(--color-yellow-rgb, 224, 175, 72), 0.1);
  border: 1px solid rgba(var(--color-yellow-rgb, 224, 175, 72), 0.3);
}

.journalit-template-builder-container .template-editor-notice--spaced {
  margin-bottom: 20px;
}

.journalit-template-builder-container .template-editor-notice__icon {
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--color-yellow, #e0af48);
}

.journalit-template-builder-container .template-editor-review-sections {
  margin-top: 16px;
}

.journalit-template-builder-container .template-editor-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.journalit-template-builder-container .template-editor-section-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-normal);
}

.journalit-template-builder-container .template-editor-section-label--muted {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-editor-empty-state {
  padding: 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  background: var(--background-primary);
  border-radius: var(--radius-s);
  border: 1px dashed var(--background-modifier-border);
}

.journalit-template-builder-container .template-editor-section-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.journalit-template-builder-container .template-editor-tab-list {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--background-modifier-border);
  padding-bottom: 8px;
}

.journalit-template-builder-container .template-editor-tab-button {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s);
  cursor: pointer;
}

.journalit-template-builder-container .template-editor-tab-button.is-active {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border-color: var(--interactive-accent);
}

.journalit-template-builder-container .template-editor-widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.journalit-template-builder-container .template-editor-widget-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-normal);
}

.journalit-template-builder-container .template-editor-widget-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.journalit-template-builder-container .template-editor-widget-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.journalit-template-builder-container .template-editor-field {
  margin-bottom: 24px;
}

.journalit-template-builder-container .template-editor-field-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-normal);
}

.journalit-template-builder-container .template-widget-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
}

.journalit-template-builder-container .template-widget-handle-spacer {
  width: 20px;
}

.journalit-template-builder-container .template-widget-info {
  flex: 1;
}

.journalit-template-builder-container .template-widget-info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.journalit-template-builder-container .template-widget-name {
  font-size: 13px;
  font-weight: 500;
}

.journalit-template-builder-container .template-widget-badge {
  font-size: 10px;
  padding: 2px 6px;
  background: var(--background-modifier-border);
  border-radius: 4px;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-widget-config-row {
  display: flex;
  gap: 12px;
  padding: 0 12px 10px 40px;
  align-items: center;
}

.journalit-template-builder-container .template-widget-config-row--wide {
  gap: 16px;
}

.journalit-template-builder-container .template-widget-config-row--markdown-zone {
  padding-right: 12px;
  padding-top: 0;
}

.journalit-template-builder-container .template-widget-config-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-widget-config-label--clickable {
  cursor: pointer;
}

.journalit-template-builder-container .template-widget-config-checkbox {
  cursor: pointer;
}

.journalit-template-builder-container .template-review-context-config {
  display: flex;
  flex-direction: column;
  margin: 0 12px 12px 40px;
  border: none;
  border-radius: 0;
  background: transparent;
}

.journalit-template-builder-container .template-review-context-config-row {
  display: grid;
  grid-template-columns: minmax(110px, 0.34fr) minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  min-height: 44px;
  padding: 10px 12px;
}

.journalit-template-builder-container .template-review-context-config-row--fields {
  align-items: center;
}

.journalit-template-builder-container .template-review-context-config-label {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
}

.journalit-template-builder-container .template-review-context-config-control {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.journalit-template-builder-container .template-review-context-config-control .template-select {
  width: min(100%, 280px);
}

.journalit-template-builder-container .template-review-context-pills,
.journalit-template-builder-container .template-review-context-field-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.journalit-template-builder-container .template-review-context-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
}

.journalit-template-builder-container .template-review-context-pill:has(input:checked) {
  color: var(--text-normal);
}

.journalit-template-builder-container .template-review-context-pill input,
.journalit-template-builder-container .template-review-context-toggle-row input {
  margin: 0;
}

.journalit-template-builder-container .template-review-context-toggle-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
}

.journalit-template-builder-container .template-review-context-pills .segmented-control-option:not(.is-active) {
  color: var(--text-faint);
}

.journalit-template-builder-container .template-review-context-pills .segmented-control-option:not(.is-active):hover {
  color: var(--text-muted);
}

.journalit-template-builder-container .template-review-context-field-filter {
  position: relative;
  width: min(100%, 280px);
}

.journalit-template-builder-container .template-review-context-field-filter__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
  max-width: none;
  height: auto;
  padding: 8px 12px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background-color: var(--background-primary);
  color: var(--text-normal);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.journalit-template-builder-container .template-review-context-field-filter__trigger:hover {
  background: var(--background-primary);
}

.journalit-template-builder-container .template-review-context-field-filter__summary {
  min-width: 0;
  max-width: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-template-builder-container .template-review-context-field-filter__chevron {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.journalit-template-builder-container .template-review-context-field-filter__chevron--open {
  transform: rotate(180deg);
}

.journalit-template-builder-container .template-review-context-field-filter__menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  min-width: 100%;
  max-width: none;
  max-height: min(300px, 50vh);
  overflow-y: auto;
  margin-top: 4px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background-color: var(--background-primary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.journalit-template-builder-container .template-review-context-field-filter__option {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none !important;
  border-radius: 0;
  box-shadow: none !important;
  background: transparent !important;
  background-color: transparent !important;
  color: var(--text-normal) !important;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: background-color 0.15s ease;
}

.journalit-template-builder-container .template-review-context-field-filter__option:hover,
.journalit-template-builder-container .template-review-context-field-filter__option--active {
  background: var(--background-modifier-hover) !important;
  background-color: var(--background-modifier-hover) !important;
  color: var(--text-normal) !important;
}

.journalit-template-builder-container .template-review-context-field-filter__checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 2px;
  background-color: var(--background-primary);
  color: var(--text-on-accent);
  font-size: 10px;
  flex-shrink: 0;
}

.journalit-template-builder-container .template-review-context-field-filter__checkbox--checked {
  border-color: var(--interactive-accent);
  background: var(--interactive-accent);
}

.journalit-template-builder-container .template-review-context-field-filter__option-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.journalit-template-builder-container .template-widget-config-input {
  flex: 1;
}

.journalit-template-builder-container .template-widget-config-textarea {
  min-height: 72px;
  resize: vertical;
  width: 100%;
}

.journalit-template-builder-container .template-widget-config-row--previous-context {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 2px 16px 14px 40px;
}

.journalit-template-builder-container .template-weekly-drc-config {
  gap: 16px;
  padding-top: 6px;
}

.journalit-template-builder-container .template-weekly-drc-options {
  display: grid;
  grid-template-columns: minmax(140px, 1fr) minmax(140px, 1fr) auto;
  gap: 14px;
  align-items: end;
  width: 100%;
}

.journalit-template-builder-container .template-weekly-drc-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.journalit-template-builder-container .template-weekly-drc-field .template-select {
  width: 100%;
  min-height: 32px;
}

.journalit-template-builder-container .template-weekly-drc-collapse-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-self: start;
  width: max-content;
  min-height: 32px;
  color: var(--text-normal);
  font-size: 13px;
  line-height: 1.25;
}

.journalit-template-builder-container .template-weekly-drc-collapse-toggle input {
  flex: 0 0 auto;
}

.journalit-template-builder-container .template-previous-context-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}


.journalit-template-builder-container .template-previous-context-sections {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: min(100%, 420px);
}

.journalit-template-builder-container .template-weekly-drc-config .template-previous-context-sections {
  width: 100%;
}

.journalit-template-builder-container .template-weekly-drc-sections-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.journalit-template-builder-container .template-weekly-drc-sections-title {
  color: var(--text-normal);
  font-size: 13px;
  font-weight: 500;
}

.journalit-template-builder-container .template-previous-context-section-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.journalit-template-builder-container .template-weekly-drc-config .template-previous-context-section-row {
  width: 100%;
}

.journalit-template-builder-container .template-previous-context-select-wrapper {
  position: relative;
  flex: 0 1 280px;
  min-width: 180px;
}

.journalit-template-builder-container .template-weekly-drc-config .template-previous-context-select-wrapper {
  flex: 1 1 auto;
}

.journalit-template-builder-container .template-previous-context-heading-input {
  width: 100%;
  padding-right: 32px;
  appearance: none;
}

.journalit-template-builder-container .template-previous-context-select-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  pointer-events: none;
  transform: translateY(-50%);
}

.journalit-template-builder-container .template-previous-context-remove {
  flex: 0 0 auto;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-primary);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 11px;
}

.journalit-template-builder-container .template-previous-context-remove:hover {
  color: var(--text-error);
  background: var(--background-modifier-hover);
}

.journalit-template-builder-container .template-previous-context-remove--icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  padding: 0;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-previous-context-add-button {
  flex: 0 0 auto;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-primary);
  color: var(--text-accent);
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
}

.journalit-template-builder-container .template-previous-context-add-button:hover {
  background: var(--background-modifier-hover);
}

.journalit-template-builder-container .template-previous-context-fallback-select {
  flex: 0 1 240px;
  min-width: 200px;
}

.journalit-template-builder-container .template-builder-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--background-secondary);
  border-right: 1px solid var(--background-modifier-border);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.journalit-template-builder-container .template-builder-sidebar-header {
  height: 53px;
  padding: 0 16px;
  border-bottom: 1px solid var(--background-modifier-border);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.journalit-template-builder-container .template-builder-sidebar-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.journalit-template-builder-container .template-builder-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.journalit-template-builder-container .template-builder-sidebar-divider {
  height: 1px;
  background: var(--background-modifier-border);
  margin: 8px 12px;
}

.journalit-template-builder-container .template-builder-section {
  margin-bottom: 2px;
}

.journalit-template-builder-container .template-builder-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  cursor: pointer;
  user-select: none;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.journalit-template-builder-container .template-builder-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.2;
}

.journalit-template-builder-container .template-builder-section-chevron {
  align-self: center;
  display: block;
  flex: 0 0 auto;
  height: 12px;
  transition: transform 0.15s ease;
  transform-origin: center;
  width: 12px;
}

.journalit-template-builder-container .template-builder-section-chevron.is-expanded {
  transform: rotate(90deg);
}

.journalit-template-builder-container .template-builder-section-add {
  appearance: none;
  background: transparent;
  border: none;
  border-radius: var(--radius-s);
  box-shadow: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  height: 22px;
  line-height: 1;
  min-height: 0;
  min-width: 0;
  padding: 0;
  width: 22px;
}

.journalit-template-builder-container .template-builder-section-add:hover {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.journalit-template-builder-container .template-builder-section-body {
  padding-left: 8px;
  padding-right: 8px;
}

.journalit-template-builder-container .template-builder-section-disabled {
  padding: 12px;
  color: var(--text-muted);
  font-size: 12px;
  font-style: italic;
}

.journalit-template-builder-container .template-builder-sidebar-empty {
  padding: 8px;
  color: var(--text-muted);
  font-size: 12px;
}

.journalit-template-builder-container .template-builder-library-wrapper {
  padding: 4px 0;
}

.journalit-template-builder-container .template-builder-library-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--background-primary);
  color: var(--text-normal);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s);
  cursor: pointer;
  font-size: 13px;
  width: 100%;
  text-align: left;
}

.journalit-template-builder-container .template-builder-library-button.is-selected {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
}

.journalit-template-builder-container .sidebar-template-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  margin-bottom: 1px;
  border-radius: var(--radius-s);
  cursor: pointer;
  background: transparent;
  color: var(--text-normal);
}

.journalit-template-builder-container .sidebar-template-item:not(.sidebar-template-item--selected):hover {
  background: var(--background-modifier-hover);
}

.journalit-template-builder-container .sidebar-template-item--selected {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
}

.journalit-template-builder-container .sidebar-template-item-content {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.journalit-template-builder-container .sidebar-template-item-star {
  display: flex;
  flex-shrink: 0;
  line-height: 0;
  cursor: pointer;
  color: var(--text-faint);
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 0;
  box-shadow: none;
  min-width: 0;
  min-height: 0;
  font: inherit;
}

.journalit-template-builder-container .sidebar-template-item-star.is-default {
  color: var(--interactive-accent);
  cursor: default;
}

.journalit-template-builder-container .sidebar-template-item-star:hover,
.journalit-template-builder-container .sidebar-template-item-star:focus,
.journalit-template-builder-container .sidebar-template-item-star:focus-visible,
.journalit-template-builder-container .sidebar-template-item-star:active {
  background: none;
  border: none;
  box-shadow: none;
}

.journalit-template-builder-container .sidebar-template-item-star:focus {
  outline: none;
}

.journalit-template-builder-container .sidebar-template-item-star:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}

.journalit-template-builder-container .sidebar-template-item--selected .sidebar-template-item-star,
.journalit-template-builder-container .sidebar-template-item--selected .sidebar-template-item-star.is-default {
  color: var(--text-on-accent);
}

.journalit-template-builder-container .sidebar-template-item-name {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journalit-template-builder-container .sidebar-template-item-badge {
  font-size: 9px;
  padding: 1px 4px;
  background: var(--background-modifier-border);
  border-radius: 3px;
  flex-shrink: 0;
}

.journalit-template-builder-container .sidebar-template-item--selected .sidebar-template-item-badge {
  background: rgba(255, 255, 255, 0.2);
}

.journalit-template-builder-container .template-item-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.1s;
}

.journalit-template-builder-container .sidebar-template-item--selected .template-item-actions,
.journalit-template-builder-container .sidebar-template-item:hover .template-item-actions,
.journalit-template-builder-container .sidebar-template-item--show-actions .template-item-actions {
  opacity: 1;
}

.journalit-template-builder-container .template-item-action-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: inherit;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.journalit-template-builder-container .template-item-action-button--danger {
  color: var(--text-error);
}

.journalit-template-builder-container .template-builder-shell {
  display: flex;
  height: 100%;
  overflow: hidden;
  background: var(--background-primary);
}

.journalit-template-builder-container .template-builder-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.journalit-template-builder-container .template-builder-main-content {
  flex: 1;
  overflow: hidden;
  container-type: inline-size;
}

.journalit-template-builder-container .template-builder-library-container {
  height: 100%;
  overflow: auto;
}

.journalit-template-builder-container .template-builder-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-builder-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  gap: 12px;
}

.journalit-template-builder-container .template-builder-empty-icon {
  opacity: 0.5;
}

.journalit-template-builder-container .template-builder-empty-title {
  font-size: 14px;
}

.journalit-template-builder-container .template-builder-empty-subtitle {
  font-size: 12px;
  opacity: 0.7;
}

.journalit-template-builder-container .template-builder-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-preview-placeholder {
  padding: 1.5rem;
  background: var(--background-secondary);
  border-radius: var(--radius-m);
  border: 2px dashed var(--background-modifier-border);
  text-align: center;
}

.journalit-template-builder-container .template-preview-placeholder-title {
  font-weight: 500;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-preview-placeholder-title--spaced {
  margin-bottom: 0.5rem;
}

.journalit-template-builder-container .template-preview-placeholder-description {
  font-size: 0.85em;
  color: var(--text-faint);
}

.journalit-template-builder-container .template-preview-markdown-zone {
  padding: 1rem;
  background: transparent;
  border-radius: var(--radius-s);
  border: 1px dashed var(--background-modifier-border-hover);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.journalit-template-builder-container .template-preview-markdown-text {
  color: var(--text-faint);
  font-size: 0.85em;
  font-style: italic;
  white-space: pre-wrap;
}

.journalit-template-builder-container .template-preview-markdown-text--content {
  color: var(--text-normal);
  font-style: normal;
  line-height: 1.5;
}

.journalit-template-builder-container .template-preview-tooltip-title {
  margin-bottom: 6px;
}

.journalit-template-builder-container .template-preview-tooltip-label {
  color: var(--text-faint);
  font-size: 0.9em;
}

.journalit-template-builder-container .template-preview-tooltip-name {
  font-weight: 600;
}

.journalit-template-builder-container .template-preview-tooltip-description {
  color: var(--text-muted);
  font-size: 0.9em;
  line-height: 1.4;
  max-width: 260px;
}

.journalit-template-builder-container .template-preview-empty {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-preview {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: var(--background-primary);
  border-radius: var(--radius-m);
  border: 1px solid var(--background-modifier-border);
  max-height: 100%;
  overflow-y: auto;
  max-width: calc(var(--file-line-width, 700px) + 34px);
  margin-left: auto;
  margin-right: auto;
}

.journalit-template-builder-container .template-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--background-modifier-border);
  margin-bottom: 1rem;
}

.journalit-template-builder-container .template-preview-title {
  font-weight: 600;
  color: var(--text-normal);
  font-size: 0.95em;
}

.journalit-template-builder-container .template-preview-subtitle {
  font-size: 0.8em;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-preview-mode-badge {
  padding: 4px 8px;
  background: var(--background-secondary);
  border-radius: var(--radius-s);
  font-size: 0.75em;
  color: var(--text-muted);
}

.journalit-template-builder-container .template-preview-content {
  max-width: var(--file-line-width, 700px);
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.journalit-template-builder-container .template-preview-widget {
  position: relative;
}
`;


