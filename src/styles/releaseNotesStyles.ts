


const RELEASE_NOTES_STYLES = `

.journalit-release-notes-container {
  background: var(--background-primary);
  color: var(--text-normal);
  height: 100%;
  overflow: hidden;
}


.journalit-release-notes-container .view-header {
  flex-shrink: 0;
}

.journalit-release-notes-container .release-notes-view {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 24px;
}

.journalit-release-notes-container .release-notes-view > * {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.journalit-release-notes-container .release-notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--background-modifier-border);
}

.journalit-release-notes-container .release-notes-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.journalit-release-notes-container .current-version {
  font-size: 14px;
  color: var(--text-muted);
  background: var(--background-secondary);
  padding: 4px 12px;
  border-radius: 12px;
}

.journalit-release-notes-container .release-notes-header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.journalit-release-notes-container .release-notes-action-button {
  background: var(--background-secondary);
  color: var(--text-normal);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.journalit-release-notes-container .release-notes-action-button:hover {
  background: var(--background-modifier-hover);
  border-color: var(--background-modifier-border-hover);
}

.journalit-release-notes-container .release-notes-action-button .button-icon {
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.journalit-release-notes-container .changelog-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.journalit-release-notes-container .changelog-entry {
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--background-primary-alt);
}

.journalit-release-notes-container .changelog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  background: var(--background-primary-alt);
  transition: background 0.2s;
}

.journalit-release-notes-container .changelog-header:hover {
  background: var(--background-modifier-hover);
}

.journalit-release-notes-container .changelog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.expand-icon {
  color: var(--text-muted);
  font-size: 12px;
  transition: transform 0.2s;
}

.journalit-release-notes-container .changelog-content {
  padding: 0 16px 16px 16px;
  line-height: 1.6;
  animation: expandDown 0.3s ease-out;
}

.journalit-release-notes-container .changelog-content h3 {
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
}

.journalit-release-notes-container .changelog-content h4 {
  margin-top: 12px;
  margin-bottom: 6px;
  font-size: 16px;
  font-weight: 600;
}

.journalit-release-notes-container .changelog-content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 16px 0;
  border: 1px solid var(--background-modifier-border);
}

.journalit-release-notes-container .changelog-content ul {
  padding-left: 24px;
  margin: 8px 0;
}

.journalit-release-notes-container .changelog-content li {
  margin: 4px 0;
}

.journalit-release-notes-container .loading {
  text-align: center;
  padding: 48px;
  color: var(--text-muted);
}

@keyframes expandDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 5000px;
  }
}
`;


function injectReleaseNotesStyles(): void {
  return;
}


export function ensureReleaseNotesStyles(): void {
  return;
}
