import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  AgentApprovalCard,
  type AgentApprovalOutcome,
} from '../../components/agentRequests/AgentApprovalCard';
import {
  mountBottomLeftNotification,
  removeBottomLeftNotification,
} from '../../components/notifications/BottomLeftNotificationHost';
import type { ActionBatchService } from './ActionBatchService';
import { DisplayPolicyProvider } from '../../contexts/DisplayPolicyContext';


const OUTCOME_MS = 5_000;

const EXPIRY_REFRESH_MS = 30_000;

const LEAVE_MS = 300;

const CONTAINER_CLASS = 'journalit-agent-approval-toast';
const VISIBLE_CLASS = 'journalit-agent-approval-toast--visible';

type ApprovalSource = Pick<
  ActionBatchService,
  'listPendingApprovals' | 'decide' | 'subscribe'
>;


export class AgentApprovalCardController {
  private container: HTMLElement | null = null;
  private root: Root | null = null;
  
  private readonly hidden = new Set<string>();
  private outcome: AgentApprovalOutcome | null = null;
  private outcomeTimer: number | null = null;
  private refreshTimer: number | null = null;
  private leaveTimer: number | null = null;
  private readonly unsubscribe: () => void;

  constructor(private readonly source: ApprovalSource) {
    this.unsubscribe = source.subscribe(() => this.update());
    this.update();
  }

  dispose(): void {
    this.unsubscribe();
    this.clearOutcomeTimer();
    if (this.leaveTimer !== null) window.clearTimeout(this.leaveTimer);
    this.leaveTimer = null;
    this.unmount();
  }

  private update(): void {
    const pending = this.source.listPendingApprovals();
    const pendingIds = new Set(pending.map((request) => request.previewId));
    for (const previewId of this.hidden) {
      if (!pendingIds.has(previewId)) this.hidden.delete(previewId);
    }
    const requests = pending.filter(
      (request) => !this.hidden.has(request.previewId)
    );
    if (requests.length === 0 && this.outcome === null) {
      this.leave();
      return;
    }
    
    
    
    this.enter().render(
      createElement(
        DisplayPolicyProvider,
        { privacyModeOverride: false },
        createElement(AgentApprovalCard, {
          requests,
          outcome: this.outcome,
          onDecide: (previewId, decision) => this.decide(previewId, decision),
          onDismiss: () => this.dismiss(),
        })
      )
    );
  }

  private decide(previewId: string, decision: 'approved' | 'denied'): void {
    
    this.showOutcome(decision);
    if (!this.source.decide(previewId, decision)) {
      this.showOutcome('expired');
      this.update();
    }
  }

  private dismiss(): void {
    for (const request of this.source.listPendingApprovals()) {
      this.hidden.add(request.previewId);
    }
    this.clearOutcomeTimer();
    this.outcome = null;
    this.update();
  }

  private showOutcome(outcome: AgentApprovalOutcome): void {
    this.clearOutcomeTimer();
    this.outcome = outcome;
    this.outcomeTimer = window.setTimeout(() => {
      this.outcomeTimer = null;
      this.outcome = null;
      this.update();
    }, OUTCOME_MS);
  }

  private clearOutcomeTimer(): void {
    if (this.outcomeTimer !== null) window.clearTimeout(this.outcomeTimer);
    this.outcomeTimer = null;
  }

  
  private enter(): Root {
    if (this.leaveTimer !== null) {
      window.clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
      this.container?.classList.add(VISIBLE_CLASS);
    }
    if (this.container && this.root && this.container.isConnected) {
      return this.root;
    }
    this.unmount();
    const container = mountBottomLeftNotification(CONTAINER_CLASS);
    const root = createRoot(container);
    this.container = container;
    this.root = root;
    this.refreshTimer = window.setInterval(
      () => this.update(),
      EXPIRY_REFRESH_MS
    );
    window.requestAnimationFrame(() => {
      if (this.container === container) container.classList.add(VISIBLE_CLASS);
    });
    return root;
  }

  
  private leave(): void {
    if (!this.container || this.leaveTimer !== null) return;
    this.container.classList.remove(VISIBLE_CLASS);
    this.leaveTimer = window.setTimeout(() => {
      this.leaveTimer = null;
      this.unmount();
    }, LEAVE_MS);
  }

  private unmount(): void {
    if (this.refreshTimer !== null) window.clearInterval(this.refreshTimer);
    this.refreshTimer = null;
    this.root?.unmount();
    this.root = null;
    if (this.container) removeBottomLeftNotification(this.container);
    this.container = null;
  }
}
