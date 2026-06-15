


export const RELEASE_NOTES_STYLES = `

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

.journalit-release-notes-container .release-notes-accordion {
  margin-bottom: 0;
  border-radius: 8px;
  background: var(--background-primary-alt);
}

.journalit-release-notes-container .release-notes-accordion .journalit-settings-accordion__header {
  padding: 16px;
  background: var(--background-primary-alt);
}

.journalit-release-notes-container .release-notes-accordion .journalit-settings-accordion__header:hover {
  background: var(--background-modifier-hover);
}

.journalit-release-notes-container .release-notes-accordion .journalit-settings-accordion__title {
  font-size: 16px;
  font-weight: 600;
}

.journalit-release-notes-container .release-notes-accordion .journalit-settings-accordion__content {
  padding: 12px 16px 16px;
}

.journalit-release-notes-container .changelog-content {
  line-height: 1.6;
}

.journalit-release-notes-container .changelog-content > :first-child {
  margin-top: 0;
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
`;
