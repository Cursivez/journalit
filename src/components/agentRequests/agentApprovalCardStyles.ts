
export const AGENT_APPROVAL_CARD_STYLES = `
  .journalit-agent-approval-toast {
    width: 320px;
    max-width: calc(100vw - 48px);
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background: var(--background-primary);
    box-shadow: var(--shadow-l);
    font-family: var(--font-interface);
    opacity: 0;
    transform: translateX(-100%);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  }

  .journalit-agent-approval-toast.journalit-agent-approval-toast--visible {
    opacity: 1;
    transform: translateX(0);
  }

  .journalit-agent-approval {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 10px 12px 14px;
  }

  .journalit-agent-approval-header {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 20px;
  }

  .journalit-agent-approval-eyebrow {
    flex: 1;
    min-width: 0;
    color: var(--text-faint);
    font-size: var(--font-ui-smaller);
  }

  .journalit-agent-approval-pager {
    display: inline-flex;
    align-items: center;
    color: var(--text-faint);
    font-size: var(--font-ui-smaller);
    font-variant-numeric: tabular-nums;
  }

  .journalit-agent-approval-position {
    padding: 0 2px;
    white-space: nowrap;
  }

  .journalit-agent-approval .journalit-agent-approval-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    border-radius: var(--radius-s);
    background: transparent;
    box-shadow: none;
    color: var(--text-faint);
    cursor: var(--cursor);
  }

  .journalit-agent-approval .journalit-agent-approval-icon-button:hover:not(:disabled) {
    background: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .journalit-agent-approval .journalit-agent-approval-icon-button:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .journalit-agent-approval-outcome {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    padding-right: 4px;
    color: var(--text-muted);
    font-size: var(--font-ui-small);
  }

  .journalit-agent-approval-outcome.is-approved {
    color: var(--text-success);
  }

  .journalit-agent-approval-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    padding-right: 4px;
  }

  .journalit-agent-approval-title {
    margin: 0;
    color: var(--text-normal);
    font-size: var(--font-ui-medium);
    font-weight: var(--font-semibold);
    line-height: 1.3;
  }

  .journalit-agent-approval-detail {
    display: -webkit-box;
    margin: 0;
    overflow: hidden;
    color: var(--text-muted);
    font-size: var(--font-ui-small);
    line-height: 1.4;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .journalit-agent-approval-details {
    padding-right: 4px;
  }

  .journalit-agent-approval-details .journalit-agent-request-actions {
    max-height: min(240px, 40vh);
  }

  .journalit-agent-approval .journalit-agent-approval-details-toggle {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    height: auto;
    padding: 0;
    border: none;
    background: transparent;
    box-shadow: none;
    color: var(--text-muted);
    font-size: var(--font-ui-small);
    cursor: var(--cursor);
  }

  .journalit-agent-approval .journalit-agent-approval-details-toggle:hover {
    color: var(--text-normal);
  }

  .journalit-agent-approval[data-expanded='true'] .journalit-agent-approval-details-toggle .journalit-obsidian-icon {
    transform: rotate(180deg);
  }

  .journalit-agent-approval-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: 4px;
  }

  .journalit-agent-approval-actions {
    display: inline-flex;
    gap: 6px;
    margin-left: auto;
  }

  @media (max-width: 768px) {
    .journalit-agent-approval-toast {
      width: auto;
      max-width: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .journalit-agent-approval-toast {
      transform: none;
      transition: opacity 0.15s linear;
    }
  }
`;
