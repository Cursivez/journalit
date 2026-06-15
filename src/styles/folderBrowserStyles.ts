


export const folderBrowserCSS = `



.folder-browser-container {
  position: relative;
  width: 100%;
  margin-bottom: 8px;
}


.folder-browser-container .input-container {
  position: relative;
  width: 100%;
}


.folder-browser-container .input-container::after {
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


[data-is-open="true"] .folder-browser-container .input-container::after {
  transform: translateY(-50%) rotate(180deg);
}


.folder-browser-input {
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


.folder-browser-input:focus {
  border-color: var(--interactive-accent, #5183e4);
  box-shadow: 0 0 0 2px rgba(83, 141, 226, 0.3);
  outline: none;
}


.folder-browser-dropdown {
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: opacity 0.15s ease, transform 0.15s ease;
  transform-origin: top center;
  will-change: transform, opacity;
  animation: folder-browser-dropdown-open 0.15s ease forwards;
}

@keyframes folder-browser-dropdown-open {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.folder-browser-item {
  padding: 8px 12px;
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

.folder-browser-item.highlighted,
.folder-browser-item:hover {
  background-color: var(--background-secondary, #f5f5f5);
}


.folder-indent {
  flex-shrink: 0;
  width: calc(var(--folder-depth, 0) * 16px);
}


.folder-browser-label {
  display: block;
  margin-bottom: 4px;
}

.folder-browser-required {
  color: var(--text-error);
  margin-left: 2px;
}


.folder-browser-clear-button {
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


.folder-browser-container .input-container[data-has-clear="true"]::after {
  right: 32px;
}


.folder-browser-error {
  color: var(--text-error);
  font-size: 12px;
  margin-top: 4px;
}

.folder-browser-helper {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 4px;
}


.folder-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  margin-right: 4px;
  font-size: 12px;
  color: var(--text-muted, #666);
  transition: color 0.15s ease;
  flex-shrink: 0;
}

.folder-toggle:hover {
  color: var(--text-normal, #333);
}


.folder-icon {
  margin-right: 6px;
  font-size: 14px;
  flex-shrink: 0;
}


.folder-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.folder-browser-input.error {
  border-color: var(--text-error, #e53935);
}


[data-is-open="true"] .folder-browser-input {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
`;
