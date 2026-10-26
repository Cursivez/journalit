
export const AGENT_REQUESTS_MODAL_STYLES = `
  .journalit-agent-requests {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 520px;
  }

  .journalit-agent-activity-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .journalit-agent-activity-heading {
    margin: 0;
    color: var(--text-faint);
    font-size: var(--font-ui-smaller);
    font-weight: var(--font-medium);
  }

  .journalit-agent-requests-empty {
    margin: 4px 0 0;
    color: var(--text-muted);
    font-size: var(--font-ui-small);
  }

  .journalit-agent-activity-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .journalit-agent-activity-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    column-gap: 12px;
    row-gap: 8px;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .journalit-agent-activity-row:last-child {
    border-bottom: none;
  }

  .journalit-agent-activity-row-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .journalit-agent-activity-row-headline {
    color: var(--text-normal);
    font-size: var(--font-ui-small);
    font-weight: var(--font-semibold);
  }

  .journalit-agent-activity-row-detail {
    overflow: hidden;
    color: var(--text-muted);
    font-size: var(--font-ui-small);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journalit-agent-activity-row-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-faint);
    font-size: var(--font-ui-smaller);
  }

  .journalit-agent-requests .journalit-agent-activity-row-toggle {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    height: auto;
    padding: 0;
    border: none;
    background: transparent;
    box-shadow: none;
    color: var(--text-muted);
    font-size: var(--font-ui-smaller);
    cursor: var(--cursor);
  }

  .journalit-agent-requests .journalit-agent-activity-row-toggle:hover {
    color: var(--text-normal);
  }

  .journalit-agent-activity-row-toggle[aria-expanded='true'] .journalit-obsidian-icon {
    transform: rotate(180deg);
  }

  .journalit-agent-activity-row-controls {
    display: inline-flex;
    gap: 6px;
  }

  .journalit-agent-activity-row-details {
    grid-column: 1 / -1;
  }

  .journalit-agent-request-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 280px;
    margin: 0;
    padding: 0 0 0 10px;
    overflow-y: auto;
    border-left: 2px solid var(--background-modifier-border);
    list-style: none;
  }

  .journalit-agent-request-action {
    display: flex;
    flex-direction: column;
    min-width: 0;
    font-size: var(--font-ui-small);
  }

  .journalit-agent-request-action-kind {
    color: var(--text-normal);
  }

  .journalit-agent-request-action-detail {
    color: var(--text-muted);
    overflow-wrap: anywhere;
  }
`;
