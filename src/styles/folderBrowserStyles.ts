


export const folderBrowserCSS = `



.journalit-folder-browser-container {
  position: relative;
  width: 100%;
  margin-bottom: 8px;
}


.journalit-folder-browser-container .input-container {
  position: relative;
  width: 100%;
}


.journalit-folder-browser-container .input-container::after {
  content: "";
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--text-normal, #333);
  pointer-events: none;
  transition: transform 0.15s ease;
  will-change: transform;
}


[data-is-open="true"] .journalit-folder-browser-container .input-container::after {
  transform: translateY(-50%) rotate(180deg);
}


.journalit-folder-browser-input {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 8px 12px;
  padding-right: 30px;
  border: 1px solid var(--background-modifier-border, #ddd);
  border-radius: 4px;
  background-color: var(--background-primary, #fff);
  color: var(--text-normal, #333);
  font-size: 14px;
  transition: border-color 0.15s ease;
}


.journalit-folder-browser-input:focus {
  border-color: var(--interactive-accent, #5183e4);
  box-shadow: 0 0 0 2px rgba(83, 141, 226, 0.3);
  outline: none;
}


.journalit-folder-browser-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: -1px;
  z-index: 9999;
  background-color: var(--background-primary, #fff);
  border: 1px solid var(--background-modifier-border, #ddd);
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: opacity 0.15s ease;
  animation: journalit-folder-browser-dropdown-open 0.15s ease forwards;
}

@keyframes journalit-folder-browser-dropdown-open {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}


.journalit-folder-browser-item {
  padding: 7px 12px;
  cursor: pointer;
  margin: 0;
  background-color: var(--background-primary, #fff);
  color: var(--text-normal, #333);
  font-size: 14px;
  line-height: 1.5;
  border-bottom: 1px solid var(--background-modifier-border-subtle, rgba(127, 127, 127, 0.1));
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
}

.journalit-folder-browser-item.highlighted,
.journalit-folder-browser-item:hover {
  background-color: var(--background-secondary, #f5f5f5);
}


.journalit-folder-browser-indent {
  flex-shrink: 0;
  width: calc(var(--folder-depth, 0) * 14px);
}


.journalit-folder-browser-label {
  display: block;
  margin-bottom: 4px;
}

.journalit-folder-browser-required {
  color: var(--text-error);
  margin-left: 2px;
}


.journalit-folder-browser-clear-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 16px;
}


.journalit-folder-browser-container .input-container[data-has-clear="true"]::after {
  right: 32px;
}


.journalit-folder-browser-error {
  color: var(--text-error);
  font-size: 12px;
  margin-top: 4px;
}

.journalit-folder-browser-helper {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 4px;
}


.journalit-folder-browser-toggle {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 20px;
  min-height: 20px;
  padding: 0;
  margin: 0 2px 0 0;
  background: transparent;
  border: 0;
  border-radius: 3px;
  box-shadow: none;
  cursor: pointer;
  color: var(--text-muted, #666);
  flex-shrink: 0;
}

.journalit-folder-browser-toggle:hover {
  color: var(--text-normal, #333);
  background: var(--background-modifier-hover);
  box-shadow: none;
}

.journalit-folder-browser-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.journalit-folder-browser-toggle-spacer {
  width: 20px;
  min-width: 20px;
  height: 20px;
  margin-right: 2px;
  flex-shrink: 0;
}


.journalit-folder-browser-folder-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  flex-shrink: 0;
  color: var(--text-muted);
}


.journalit-folder-browser-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.journalit-folder-browser-input.error {
  border-color: var(--text-error, #e53935);
}


[data-is-open="true"] .journalit-folder-browser-input {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
`;
