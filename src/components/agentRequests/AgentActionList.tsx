

import React from 'react';
import { t, tPlural } from '../../lang/helpers';
import type { TranslationKey } from '../../lang/locale/en';
import type {
  ActionDisplay,
  ActionId,
} from '../../services/actions/ActionTypes';
import {
  useDisplayFormatter,
  useDisplayPolicy,
} from '../../contexts/DisplayPolicyContext';

export interface AgentActionListItem {
  readonly action: ActionId;
  readonly display: ActionDisplay;
}


function agentActionTitle(action: ActionId): string {
  const key: TranslationKey = `agent-action.title.${action}`;
  return t(key);
}


export function useAgentActionDetailMask(): string | null {
  const { shouldMask } = useDisplayFormatter();
  const { privacyMask } = useDisplayPolicy();
  return shouldMask('money') ? privacyMask : null;
}

interface AgentActionsSummary {
  
  readonly headline: string;
  
  readonly detail: string;
  
  readonly expandable: boolean;
}


function describeAgentAction(
  action: AgentActionListItem,
  detailMask: string | null
): string {
  const { target, changes } = action.display;
  if (detailMask === null) return [target, ...changes].join(' · ');
  return (changes.length > 0 ? [target, detailMask] : [target]).join(' · ');
}


export function summarizeAgentActions(
  actions: readonly AgentActionListItem[],
  detailMask: string | null
): AgentActionsSummary {
  if (actions.length === 1) {
    const [action] = actions;
    return {
      headline: agentActionTitle(action.action),
      detail: describeAgentAction(action, detailMask),
      expandable: false,
    };
  }
  const kinds = new Map<string, number>();
  for (const action of actions) {
    const title = agentActionTitle(action.action);
    kinds.set(title, (kinds.get(title) ?? 0) + 1);
  }
  return {
    headline: tPlural('agent-requests.changes', actions.length),
    detail: [...kinds]
      .map(([title, count]) =>
        count === 1
          ? title
          : t('agent-requests.kind-count', { title, count: String(count) })
      )
      .join(', '),
    expandable: true,
  };
}

export const AgentActionList: React.FC<{
  
  batchId: string;
  actions: readonly AgentActionListItem[];
}> = ({ batchId, actions }) => {
  const detailMask = useAgentActionDetailMask();
  
  
  
  return (
    <ol className="journalit-agent-request-actions">
      {actions.map((action, position) => (
        <li
          key={`${batchId}:${position}`}
          className="journalit-agent-request-action"
        >
          <span className="journalit-agent-request-action-kind">
            {agentActionTitle(action.action)}
          </span>
          <span className="journalit-agent-request-action-detail">
            {describeAgentAction(action, detailMask)}
          </span>
        </li>
      ))}
    </ol>
  );
};
