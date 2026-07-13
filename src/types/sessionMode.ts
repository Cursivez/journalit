export interface SessionModeWindow {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface SessionModeLinkedResource {
  path: string;
}

export interface SessionModeSettings {
  sessionWindows: SessionModeWindow[];
  preparationLeadTimeMinutes: number;
  linkedResources: SessionModeLinkedResource[];
  tradeGateWorkflows: TradeGateWorkflow[];
  phaseLayouts: SessionModePhaseLayouts;
}

export type TradeGateOutcomeType = 'green-light' | 'no-trade' | 'wait';

export interface TradeGateOption {
  id: string;
  label: string;
  targetNodeId: string;
}

export interface TradeGateQuestionNode {
  id: string;
  type: 'question';
  title: string;
  prompt: string;
  options: TradeGateOption[];
}

export interface TradeGateOutcomeNode {
  id: string;
  type: 'outcome';
  outcome: TradeGateOutcomeType;
  title: string;
  description?: string;
}

export type TradeGateNode = TradeGateQuestionNode | TradeGateOutcomeNode;

export interface TradeGateWorkflow {
  id: string;
  name: string;
  startNodeId: string;
  nodes: TradeGateNode[];
}

const DEFAULT_TRADE_GATE_WORKFLOWS: TradeGateWorkflow[] = [
  {
    id: 'default-trade-gate-workflow',
    name: 'Starter Trade Gate',
    startNodeId: 'default-trade-gate-setup',
    nodes: [
      {
        id: 'default-trade-gate-setup',
        type: 'question',
        title: 'Setup quality',
        prompt: 'Is there a clear, valid setup according to your plan?',
        options: [
          {
            id: 'default-trade-gate-setup-yes',
            label: 'Yes',
            targetNodeId: 'default-trade-gate-risk',
          },
          {
            id: 'default-trade-gate-setup-no',
            label: 'No',
            targetNodeId: 'default-trade-gate-wait',
          },
        ],
      },
      {
        id: 'default-trade-gate-risk',
        type: 'question',
        title: 'Risk defined',
        prompt: 'Are entry, invalidation, target, and position risk defined?',
        options: [
          {
            id: 'default-trade-gate-risk-yes',
            label: 'Yes',
            targetNodeId: 'default-trade-gate-conditions',
          },
          {
            id: 'default-trade-gate-risk-no',
            label: 'No',
            targetNodeId: 'default-trade-gate-no-trade',
          },
        ],
      },
      {
        id: 'default-trade-gate-conditions',
        type: 'question',
        title: 'Conditions acceptable',
        prompt:
          'Are current volatility, news, and execution conditions acceptable?',
        options: [
          {
            id: 'default-trade-gate-conditions-yes',
            label: 'Yes',
            targetNodeId: 'default-trade-gate-green-light',
          },
          {
            id: 'default-trade-gate-conditions-no',
            label: 'No',
            targetNodeId: 'default-trade-gate-wait',
          },
        ],
      },
      {
        id: 'default-trade-gate-green-light',
        type: 'outcome',
        outcome: 'green-light',
        title: 'Green light',
        description:
          'Plan is valid, risk is defined, and conditions support execution.',
      },
      {
        id: 'default-trade-gate-wait',
        type: 'outcome',
        outcome: 'wait',
        title: 'Wait',
        description:
          'Conditions are not ready yet. Wait for confirmation before acting.',
      },
      {
        id: 'default-trade-gate-no-trade',
        type: 'outcome',
        outcome: 'no-trade',
        title: 'No trade',
        description:
          'The setup or risk definition is not strong enough to take the trade.',
      },
    ],
  },
];

interface TradeGateRunAnswer {
  nodeId: string;
  nodeTitle: string;
  prompt: string;
  selectedOptionId: string;
  selectedOptionLabel: string;
  targetNodeId: string;
  timestamp: string;
}

export interface TradeGateRun {
  id: string;
  workflowId: string;
  workflowName: string;
  startedAt: string;
  completedAt?: string;
  status: 'in-progress' | 'completed' | 'abandoned';
  currentNodeId?: string;
  outcome?: TradeGateOutcomeType;
  outcomeTitle?: string;
  outcomeDescription?: string;
  answers: TradeGateRunAnswer[];
}

type SessionModePhase =
  | 'unconfigured'
  | 'waiting'
  | 'preparation'
  | 'live'
  | 'break'
  | 'ended';

export type SessionModeConfigurablePhase = Exclude<
  SessionModePhase,
  'unconfigured' | 'waiting' | 'break'
>;

export type SessionModeLayoutModuleId =
  | 'preparationResources'
  | 'preparationGoals'
  | 'preparationChecklist'
  | 'tradeGate'
  | 'timeline'
  | 'endedActions'
  | 'endedStats';

export type SessionModePhaseLayouts = Record<
  SessionModeConfigurablePhase,
  SessionModeLayoutModuleId[]
>;

export interface ResolvedSessionModeWindow extends SessionModeWindow {
  start: Date;
  end: Date;
}

export interface SessionModePhaseState {
  phase: SessionModePhase;
  now: Date;
  currentSession?: ResolvedSessionModeWindow;
  nextSession?: ResolvedSessionModeWindow;
  previousSession?: ResolvedSessionModeWindow;
  timeUntilStartMs?: number;
  timeUntilEndMs?: number;
  timeSinceEndMs?: number;
}

export const DEFAULT_SESSION_MODE_SETTINGS: SessionModeSettings = {
  sessionWindows: [],
  preparationLeadTimeMinutes: 30,
  linkedResources: [],
  tradeGateWorkflows: DEFAULT_TRADE_GATE_WORKFLOWS,
  phaseLayouts: {
    preparation: [
      'preparationResources',
      'preparationGoals',
      'preparationChecklist',
    ],
    live: ['tradeGate', 'timeline'],
    ended: ['endedActions', 'endedStats'],
  },
};
