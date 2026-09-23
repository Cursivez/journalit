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
  showTradeExecutionsInSessionLog: boolean;
  linkedResources: SessionModeLinkedResource[];
  tradeGateQuestions: TradeGateQuestion[];
  tradeGateWorkflows: TradeGateWorkflow[];
  phaseLayouts: SessionModePhaseLayouts;
}

export type TradeGateOutcomeType = 'green-light' | 'no-trade' | 'wait';

export interface TradeGateQuestionOption {
  id: string;
  label: string;
}

export interface TradeGateQuestion {
  id: string;
  title: string;
  prompt: string;
  options: TradeGateQuestionOption[];
}

export type TradeGateRouteTarget =
  | { kind: 'node'; nodeId: string }
  | { kind: 'outcome'; outcome: TradeGateOutcomeType; note?: string };


export interface TradeGateWorkflowNode {
  id: string;
  questionId: string;
}

export interface TradeGateRoute {
  nodeId: string;
  optionId: string;
  target: TradeGateRouteTarget;
}

export interface TradeGateWorkflow {
  id: string;
  name: string;
  startNodeId: string;
  nodes: TradeGateWorkflowNode[];
  routes: TradeGateRoute[];
}

export const DEFAULT_TRADE_GATE_QUESTIONS: TradeGateQuestion[] = [
  {
    id: 'default-trade-gate-setup',
    title: 'Setup quality',
    prompt: 'Is there a clear, valid setup according to your plan?',
    options: [
      { id: 'default-trade-gate-setup-yes', label: 'Yes' },
      { id: 'default-trade-gate-setup-no', label: 'No' },
    ],
  },
  {
    id: 'default-trade-gate-risk',
    title: 'Risk defined',
    prompt: 'Are entry, invalidation, target, and position risk defined?',
    options: [
      { id: 'default-trade-gate-risk-yes', label: 'Yes' },
      { id: 'default-trade-gate-risk-no', label: 'No' },
    ],
  },
  {
    id: 'default-trade-gate-conditions',
    title: 'Conditions acceptable',
    prompt:
      'Are current volatility, news, and execution conditions acceptable?',
    options: [
      { id: 'default-trade-gate-conditions-yes', label: 'Yes' },
      { id: 'default-trade-gate-conditions-no', label: 'No' },
    ],
  },
];

export const DEFAULT_TRADE_GATE_WORKFLOWS: TradeGateWorkflow[] = [
  {
    id: 'default-trade-gate-workflow',
    name: 'Starter Trade Gate',
    startNodeId: 'default-trade-gate-setup',
    nodes: [
      {
        id: 'default-trade-gate-setup',
        questionId: 'default-trade-gate-setup',
      },
      { id: 'default-trade-gate-risk', questionId: 'default-trade-gate-risk' },
      {
        id: 'default-trade-gate-conditions',
        questionId: 'default-trade-gate-conditions',
      },
    ],
    routes: [
      {
        nodeId: 'default-trade-gate-setup',
        optionId: 'default-trade-gate-setup-yes',
        target: {
          kind: 'node',
          nodeId: 'default-trade-gate-risk',
        },
      },
      {
        nodeId: 'default-trade-gate-setup',
        optionId: 'default-trade-gate-setup-no',
        target: {
          kind: 'outcome',
          outcome: 'wait',
          note: 'Conditions are not ready yet. Wait for confirmation before acting.',
        },
      },
      {
        nodeId: 'default-trade-gate-risk',
        optionId: 'default-trade-gate-risk-yes',
        target: {
          kind: 'node',
          nodeId: 'default-trade-gate-conditions',
        },
      },
      {
        nodeId: 'default-trade-gate-risk',
        optionId: 'default-trade-gate-risk-no',
        target: {
          kind: 'outcome',
          outcome: 'no-trade',
          note: 'The setup or risk definition is not strong enough to take the trade.',
        },
      },
      {
        nodeId: 'default-trade-gate-conditions',
        optionId: 'default-trade-gate-conditions-yes',
        target: {
          kind: 'outcome',
          outcome: 'green-light',
          note: 'Plan is valid, risk is defined, and conditions support execution.',
        },
      },
      {
        nodeId: 'default-trade-gate-conditions',
        optionId: 'default-trade-gate-conditions-no',
        target: {
          kind: 'outcome',
          outcome: 'wait',
          note: 'Conditions are not ready yet. Wait for confirmation before acting.',
        },
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


export interface UnplannedSession {
  id: string;
  reason: string;
  startedAt: string;
  stoppedAt?: string;
}

function isUnplannedSessionRecord(
  value: unknown
): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isValidIsoTimestamp(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(new Date(value).getTime());
}

export function normalizeUnplannedSessions(value: unknown): UnplannedSession[] {
  if (!Array.isArray(value)) return [];

  const sessions: UnplannedSession[] = [];
  for (const item of value) {
    if (!isUnplannedSessionRecord(item)) continue;
    if (
      typeof item.id !== 'string' ||
      typeof item.reason !== 'string' ||
      !isValidIsoTimestamp(item.startedAt)
    ) {
      continue;
    }
    if (item.stoppedAt !== undefined && item.stoppedAt !== null) {
      if (!isValidIsoTimestamp(item.stoppedAt)) continue;
      if (
        new Date(item.stoppedAt).getTime() < new Date(item.startedAt).getTime()
      ) {
        continue;
      }
      sessions.push({
        id: item.id,
        reason: item.reason,
        startedAt: item.startedAt,
        stoppedAt: item.stoppedAt,
      });
      continue;
    }
    sessions.push({
      id: item.id,
      reason: item.reason,
      startedAt: item.startedAt,
    });
  }

  return sessions.sort(
    (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
  );
}

export interface ResolvedScheduledSessionWindow extends SessionModeWindow {
  kind: 'scheduled';
  start: Date;
  end: Date;
}


export interface ResolvedUnplannedSessionWindow {
  kind: 'unplanned';
  id: string;
  name: string;
  reason: string;
  start: Date;
  end: Date;
  isRunning: boolean;
}

export type ResolvedSessionModeWindow =
  | ResolvedScheduledSessionWindow
  | ResolvedUnplannedSessionWindow;

export interface SessionModePhaseState {
  phase: SessionModePhase;
  now: Date;
  currentSession?: ResolvedSessionModeWindow;
  nextSession?: ResolvedSessionModeWindow;
  previousSession?: ResolvedSessionModeWindow;
  timeUntilStartMs?: number;
  timeUntilEndMs?: number;
  timeSinceEndMs?: number;
  
  timeSinceStartMs?: number;
}

export const DEFAULT_SESSION_MODE_SETTINGS: SessionModeSettings = {
  sessionWindows: [],
  preparationLeadTimeMinutes: 30,
  showTradeExecutionsInSessionLog: true,
  linkedResources: [],
  tradeGateQuestions: DEFAULT_TRADE_GATE_QUESTIONS,
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
