

import React, { useId, useState } from 'react';
import { t } from '../../lang/helpers';
import { Button } from '../ui/Button';
import type { PendingApproval } from '../../services/actions/ActionBatchService';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  XCircle,
} from '../shared/icons/ObsidianIcon';
import {
  AgentActionList,
  summarizeAgentActions,
  useAgentActionDetailMask,
} from './AgentActionList';

export type AgentApprovalOutcome = 'approved' | 'denied' | 'expired';

interface AgentApprovalCardProps {
  
  readonly requests: readonly PendingApproval[];
  
  readonly outcome: AgentApprovalOutcome | null;
  readonly onDecide: (
    previewId: string,
    decision: 'approved' | 'denied'
  ) => void;
  readonly onDismiss: () => void;
}

function outcomeMessage(outcome: AgentApprovalOutcome): string {
  switch (outcome) {
    case 'approved':
      return t('agent-approval.approved');
    case 'denied':
      return t('agent-approval.denied');
    case 'expired':
      return t('agent-approval.expired');
    default: {
      const exhaustive: never = outcome;
      return exhaustive;
    }
  }
}

const Outcome: React.FC<{ outcome: AgentApprovalOutcome }> = ({ outcome }) => (
  <p className={`journalit-agent-approval-outcome is-${outcome}`} role="status">
    {outcome === 'approved' ? (
      <Check size={14} aria-hidden="true" />
    ) : (
      <XCircle size={14} aria-hidden="true" />
    )}
    <span>{outcomeMessage(outcome)}</span>
  </p>
);

export const AgentApprovalCard: React.FC<AgentApprovalCardProps> = ({
  requests,
  outcome,
  onDecide,
  onDismiss,
}) => {
  const titleId = useId();
  const detailsId = useId();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  
  const foundIndex = requests.findIndex(
    (request) => request.previewId === selectedId
  );
  const index = foundIndex === -1 ? 0 : foundIndex;
  const request: PendingApproval | undefined = requests[index];
  const detailMask = useAgentActionDetailMask();
  const summary = request
    ? summarizeAgentActions(request.actions, detailMask)
    : null;
  const expanded =
    request !== undefined &&
    summary?.expandable === true &&
    expandedId === request.previewId;

  const show = (next: number) => {
    setSelectedId(requests[next].previewId);
  };

  return (
    <section
      className="journalit-agent-approval"
      aria-labelledby={titleId}
      data-expanded={expanded ? 'true' : 'false'}
    >
      <header className="journalit-agent-approval-header">
        <span
          className="journalit-agent-approval-eyebrow"
          id={request ? undefined : titleId}
        >
          {t('agent-approval.eyebrow')}
        </span>
        {requests.length > 1 && (
          <span className="journalit-agent-approval-pager">
            <button
              type="button"
              className="journalit-agent-approval-icon-button"
              aria-label={t('agent-approval.previous')}
              disabled={index === 0}
              onClick={() => show(index - 1)}
            >
              <ChevronLeft size={14} aria-hidden="true" />
            </button>
            <span className="journalit-agent-approval-position">
              {t('agent-approval.position', {
                index: String(index + 1),
                total: String(requests.length),
              })}
            </span>
            <button
              type="button"
              className="journalit-agent-approval-icon-button"
              aria-label={t('agent-approval.next')}
              disabled={index === requests.length - 1}
              onClick={() => show(index + 1)}
            >
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </span>
        )}
        <button
          type="button"
          className="journalit-agent-approval-icon-button"
          aria-label={t('agent-approval.hide')}
          onClick={onDismiss}
        >
          <X size={14} aria-hidden="true" />
        </button>
      </header>

      {outcome && <Outcome outcome={outcome} />}

      {request && summary && (
        <>
          <div className="journalit-agent-approval-body">
            <h3 id={titleId} className="journalit-agent-approval-title">
              {summary.headline}
            </h3>
            <p className="journalit-agent-approval-detail">{summary.detail}</p>
          </div>
          {expanded && (
            <div id={detailsId} className="journalit-agent-approval-details">
              <AgentActionList
                batchId={request.previewId}
                actions={request.actions}
              />
            </div>
          )}
          <footer className="journalit-agent-approval-footer">
            {summary.expandable && (
              <button
                type="button"
                className="journalit-agent-approval-details-toggle"
                aria-expanded={expanded}
                aria-controls={expanded ? detailsId : undefined}
                onClick={() =>
                  setExpandedId(expanded ? null : request.previewId)
                }
              >
                {expanded
                  ? t('agent-approval.hide-details')
                  : t('agent-approval.details')}
                <ChevronDown size={14} aria-hidden="true" />
              </button>
            )}
            <span className="journalit-agent-approval-actions">
              <Button
                variant="secondary"
                size="small"
                onClick={() => onDecide(request.previewId, 'denied')}
              >
                {t('agent-requests.deny')}
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => onDecide(request.previewId, 'approved')}
              >
                {t('agent-requests.approve')}
              </Button>
            </span>
          </footer>
        </>
      )}
    </section>
  );
};
