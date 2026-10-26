

import { Notice, type App } from 'obsidian';
import React, { useEffect, useId, useReducer, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { t } from '../../lang/helpers';
import { Button } from '../ui/Button';
import type {
  ActionBatchService,
  PendingApproval,
} from '../../services/actions/ActionBatchService';
import type {
  AgentChangeBatch,
  AgentChangeHistory,
} from '../../services/actions/history/AgentChangeHistory';
import { isUndoable } from '../../services/actions/history/undoAgentChange';
import { formatLocalizedDateTime } from '../../utils/localizedDateTime';
import { showConfirmationModal } from '../shared/ConfirmationModal';
import { ChevronDown } from '../shared/icons/ObsidianIcon';
import {
  AgentActionList,
  summarizeAgentActions,
  useAgentActionDetailMask,
  type AgentActionListItem,
} from './AgentActionList';
import { DisplayPolicyProvider } from '../../contexts/DisplayPolicyContext';
import { JournalitModal } from '../modals/JournalitModal';

type PendingApprovalSource = Pick<
  ActionBatchService,
  'listPendingApprovals' | 'decide' | 'subscribe'
>;
type ChangeHistorySource = Pick<AgentChangeHistory, 'list' | 'subscribe'>;


const MAX_VISIBLE_HISTORY = 20;


const EXPIRY_REFRESH_MS = 30_000;


const ActivityRow: React.FC<{
  id: string;
  actions: readonly AgentActionListItem[];
  meta?: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ id, actions, meta, className, children }) => {
  const detailsId = useId();
  const [expanded, setExpanded] = useState(false);
  const summary = summarizeAgentActions(actions, useAgentActionDetailMask());
  return (
    <li
      className={`journalit-agent-activity-row${className ? ` ${className}` : ''}`}
    >
      <div className="journalit-agent-activity-row-main">
        <span className="journalit-agent-activity-row-headline">
          {summary.headline}
        </span>
        <span className="journalit-agent-activity-row-detail">
          {summary.detail}
        </span>
        {(meta || summary.expandable) && (
          <span className="journalit-agent-activity-row-meta">
            {meta && <span>{meta}</span>}
            {summary.expandable && (
              <button
                type="button"
                className="journalit-agent-activity-row-toggle"
                aria-expanded={expanded}
                aria-controls={expanded ? detailsId : undefined}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded
                  ? t('agent-approval.hide-details')
                  : t('agent-approval.details')}
                <ChevronDown size={12} aria-hidden="true" />
              </button>
            )}
          </span>
        )}
      </div>
      {children && (
        <div className="journalit-agent-activity-row-controls">{children}</div>
      )}
      {expanded && (
        <div id={detailsId} className="journalit-agent-activity-row-details">
          <AgentActionList batchId={id} actions={actions} />
        </div>
      )}
    </li>
  );
};


function undoFailedMessage(batch: AgentChangeBatch | undefined): string {
  return batch?.undo?.reason === 'in_use'
    ? t('agent-history.undo-in-use')
    : t('agent-history.undo-failed');
}

function historyMeta(batch: AgentChangeBatch): string {
  const parts = [formatLocalizedDateTime(new Date(batch.committedAt))];
  if (batch.undo?.outcome === 'undone') parts.push(t('agent-history.undone'));
  else if (batch.undo?.outcome === 'failed') {
    parts.push(undoFailedMessage(batch));
  } else if (batch.actions.every((action) => action.outcome !== 'applied')) {
    
    parts.push(t('agent-history.not-applied'));
  } else if (batch.actions.some((action) => action.outcome !== 'applied')) {
    parts.push(t('agent-history.partly-applied'));
  }
  return parts.join(' · ');
}

const AgentRequestsPanel: React.FC<{
  source: PendingApprovalSource | null;
  history: ChangeHistorySource;
  onUndo: (batch: AgentChangeBatch) => Promise<void>;
}> = ({ source, history, onUndo }) => {
  const [undoing, setUndoing] = useState<string | null>(null);
  const [, refresh] = useReducer((value: number) => value + 1, 0);

  
  
  useEffect(() => {
    if (!source) return undefined;
    const unsubscribe = source.subscribe(refresh);
    const timer = window.setInterval(refresh, EXPIRY_REFRESH_MS);
    return () => {
      unsubscribe();
      window.clearInterval(timer);
    };
  }, [source]);
  useEffect(() => history.subscribe(refresh), [history]);

  const requests: readonly PendingApproval[] = source
    ? source.listPendingApprovals()
    : [];
  const changes = history.list().slice(0, MAX_VISIBLE_HISTORY);
  return (
    <div className="journalit-agent-requests">
      {requests.length > 0 && (
        
        
        <DisplayPolicyProvider privacyModeOverride={false}>
          <section className="journalit-agent-activity-section">
            <h3 className="journalit-agent-activity-heading">
              {t('agent-activity.waiting')}
            </h3>
            <ul className="journalit-agent-activity-list">
              {requests.map((request) => (
                <ActivityRow
                  key={request.previewId}
                  id={request.previewId}
                  actions={request.actions}
                  className="journalit-agent-request"
                >
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      source?.decide(request.previewId, 'denied');
                    }}
                  >
                    {t('agent-requests.deny')}
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => {
                      source?.decide(request.previewId, 'approved');
                    }}
                  >
                    {t('agent-requests.approve')}
                  </Button>
                </ActivityRow>
              ))}
            </ul>
          </section>
        </DisplayPolicyProvider>
      )}
      <section className="journalit-agent-activity-section">
        <h3 className="journalit-agent-activity-heading">
          {t('agent-history.title')}
        </h3>
        {changes.length === 0 ? (
          <p className="journalit-agent-requests-empty">
            {t('agent-history.empty')}
          </p>
        ) : (
          <ul className="journalit-agent-activity-list">
            {changes.map((batch) => (
              <ActivityRow
                key={batch.id}
                id={batch.id}
                actions={batch.actions.map((action) => ({
                  action: action.action,
                  display: { target: action.target, changes: action.changes },
                }))}
                meta={historyMeta(batch)}
                className="journalit-agent-history-entry"
              >
                {isUndoable(batch) && (
                  <Button
                    variant="secondary"
                    size="small"
                    disabled={undoing !== null}
                    onClick={() => {
                      setUndoing(batch.id);
                      void onUndo(batch).finally(() => setUndoing(null));
                    }}
                  >
                    {t('agent-history.undo')}
                  </Button>
                )}
              </ActivityRow>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export class AgentRequestsModal extends JournalitModal {
  private root: Root | null = null;

  constructor(
    app: App,
    private readonly source: PendingApprovalSource | null,
    private readonly history: ChangeHistorySource,
    private readonly undo: (batchId: string) => Promise<'undone' | 'failed'>,
    private readonly onClosed?: () => void
  ) {
    super(app);
  }

  onOpen(): void {
    this.modalEl.addClass('journalit-modal', 'journalit-agent-requests-modal');
    this.titleEl.setText(t('agent-activity.title'));
    this.root = createRoot(this.contentEl.createDiv());
    this.root.render(
      <DisplayPolicyProvider>
        <AgentRequestsPanel
          source={this.source}
          history={this.history}
          onUndo={(batch) => this.confirmUndo(batch)}
        />
      </DisplayPolicyProvider>
    );
  }

  
  private async confirmUndo(batch: AgentChangeBatch): Promise<void> {
    const confirmed = await showConfirmationModal(this.app, {
      title: t('agent-history.undo-confirm.title'),
      message: t('agent-history.undo-confirm.message'),
      confirmLabel: t('agent-history.undo'),
      cancelLabel: t('button.cancel'),
      destructive: true,
    });
    if (!confirmed) return;
    try {
      const outcome = await this.undo(batch.id);
      new Notice(
        outcome === 'undone'
          ? t('agent-history.undone-notice')
          : undoFailedMessage(
              this.history.list().find((entry) => entry.id === batch.id)
            )
      );
    } catch (error) {
      console.error('[Journalit] Could not undo an agent change:', error);
      new Notice(t('agent-history.undo-failed'));
    }
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    this.contentEl.empty();
    this.onClosed?.();
  }
}
