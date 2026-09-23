import { TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import type {
  ResolvedSessionModeWindow,
  TradeGateOutcomeType,
  TradeGateQuestion,
  TradeGateQuestionOption,
  TradeGateRun,
  TradeGateWorkflow,
} from '../../types/sessionMode';
import { t } from '../../lang/helpers';
import { generateUUID } from '../../utils/uuid';
import { enqueueFileMutation } from '../../utils/fileMutationQueue';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);


export function getTradeGateQuestion(
  workflow: TradeGateWorkflow,
  questions: TradeGateQuestion[],
  nodeId: string | undefined
): TradeGateQuestion | null {
  if (!nodeId) return null;
  const node = workflow.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) return null;
  return questions.find((question) => question.id === node.questionId) ?? null;
}

function getTradeGateRoute(
  workflow: TradeGateWorkflow,
  nodeId: string,
  optionId: string
) {
  return workflow.routes.find(
    (route) => route.nodeId === nodeId && route.optionId === optionId
  );
}

function canReachTradeGateOutcome(
  workflow: TradeGateWorkflow,
  questions: TradeGateQuestion[],
  nodeId: string,
  visitedNodeIds: Set<string>
): boolean {
  const question = getTradeGateQuestion(workflow, questions, nodeId);
  if (!question || visitedNodeIds.has(nodeId)) return false;

  const nextVisitedNodeIds = new Set(visitedNodeIds);
  nextVisitedNodeIds.add(nodeId);
  return question.options.some((option) =>
    isRunnableTradeGateOption(
      workflow,
      questions,
      nodeId,
      option,
      nextVisitedNodeIds
    )
  );
}

function isRunnableTradeGateOption(
  workflow: TradeGateWorkflow,
  questions: TradeGateQuestion[],
  nodeId: string,
  option: TradeGateQuestionOption,
  visitedNodeIds: Set<string>
): boolean {
  if (!option.id || !option.label) return false;
  const route = getTradeGateRoute(workflow, nodeId, option.id);
  if (!route) return false;
  if (route.target.kind === 'outcome') return true;
  return canReachTradeGateOutcome(
    workflow,
    questions,
    route.target.nodeId,
    visitedNodeIds
  );
}

export function getRunnableTradeGateOptions(
  workflow: TradeGateWorkflow,
  questions: TradeGateQuestion[],
  nodeId: string | undefined,
  visitedNodeIds = new Set<string>()
): TradeGateQuestionOption[] {
  const question = getTradeGateQuestion(workflow, questions, nodeId);
  if (!question || !nodeId || visitedNodeIds.has(nodeId)) return [];

  const nextVisitedNodeIds = new Set(visitedNodeIds);
  nextVisitedNodeIds.add(nodeId);
  return question.options.filter((option) =>
    isRunnableTradeGateOption(
      workflow,
      questions,
      nodeId,
      option,
      nextVisitedNodeIds
    )
  );
}

export function hasRunnableTradeGateQuestion(
  workflow: TradeGateWorkflow,
  questions: TradeGateQuestion[],
  nodeId: string | undefined,
  visitedNodeIds = new Set<string>()
): boolean {
  return canReachTradeGateOutcome(
    workflow,
    questions,
    nodeId ?? '',
    visitedNodeIds
  );
}

export function getRunnableTradeGateWorkflows(
  workflows: TradeGateWorkflow[],
  questions: TradeGateQuestion[]
): TradeGateWorkflow[] {
  return workflows.filter((workflow) =>
    hasRunnableTradeGateQuestion(workflow, questions, workflow.startNodeId)
  );
}

export function getTradeGateRoutingSignature(
  workflow: TradeGateWorkflow,
  questions: TradeGateQuestion[]
): string {
  const questionById = new Map(
    questions.map((question) => [question.id, question])
  );
  const nodeSignatures = workflow.nodes.map((node) => {
    const question = questionById.get(node.questionId);
    if (!question) return `node:${node.id}:${node.questionId}:missing`;
    
    const optionSignatures = question.options.map(
      (option) => `${option.id}:${option.label ? 'labeled' : 'unlabeled'}`
    );
    return `node:${node.id}:${question.id}:${optionSignatures.join(',')}`;
  });
  const routeSignatures = workflow.routes.map((route) => {
    const target =
      route.target.kind === 'node'
        ? `node:${route.target.nodeId}`
        : `outcome:${route.target.outcome}`;
    return `${route.nodeId}:${route.optionId}>${target}`;
  });

  return `${workflow.startNodeId}|${nodeSignatures.join('|')}|routes:${routeSignatures.join('|')}`;
}

export function getReachableTradeGateNodeIds(
  workflow: TradeGateWorkflow,
  questions: TradeGateQuestion[]
): Set<string> {
  const reachableNodeIds = new Set<string>();
  const pendingNodeIds = workflow.startNodeId ? [workflow.startNodeId] : [];

  while (pendingNodeIds.length > 0) {
    const nodeId = pendingNodeIds.shift();
    if (!nodeId || reachableNodeIds.has(nodeId)) continue;

    const question = getTradeGateQuestion(workflow, questions, nodeId);
    if (!question) continue;
    reachableNodeIds.add(nodeId);

    for (const option of question.options) {
      const route = getTradeGateRoute(workflow, nodeId, option.id);
      if (route?.target.kind === 'node') {
        pendingNodeIds.push(route.target.nodeId);
      }
    }
  }

  return reachableNodeIds;
}

export function isTradeGateRunOutsideSession(
  run: TradeGateRun,
  currentSession: ResolvedSessionModeWindow | undefined
): boolean {
  if (!currentSession) return false;
  const startedAtMs = new Date(run.startedAt).getTime();
  return (
    Number.isNaN(startedAtMs) ||
    startedAtMs < currentSession.start.getTime() ||
    startedAtMs >= currentSession.end.getTime()
  );
}


export function isTradeGateRunCompatibleWithWorkflows(
  run: TradeGateRun,
  workflows: TradeGateWorkflow[],
  questions: TradeGateQuestion[]
): boolean {
  const workflow = workflows.find((item) => item.id === run.workflowId);
  if (!workflow) return false;

  if (run.status === 'in-progress') {
    return hasRunnableTradeGateQuestion(workflow, questions, run.currentNodeId);
  }

  return hasRunnableTradeGateQuestion(
    workflow,
    questions,
    workflow.startNodeId
  );
}

export function createTradeGateRun(workflow: TradeGateWorkflow): TradeGateRun {
  return {
    id: generateUUID(),
    workflowId: workflow.id,
    workflowName: workflow.name,
    startedAt: new Date().toISOString(),
    status: 'in-progress',
    currentNodeId: workflow.startNodeId,
    answers: [],
  };
}

export function getDefaultOutcomeTitle(outcome: TradeGateOutcomeType): string {
  switch (outcome) {
    case 'green-light':
      return t('trade-gate.outcome.green-light');
    case 'no-trade':
      return t('trade-gate.outcome.no-trade');
    case 'wait':
      return t('trade-gate.outcome.wait');
  }
}

export function getDefaultOutcomeDescription(
  outcome: TradeGateOutcomeType
): string {
  switch (outcome) {
    case 'green-light':
      return t('trade-gate.outcome.green-light-description');
    case 'no-trade':
      return t('trade-gate.outcome.no-trade-description');
    case 'wait':
      return t('trade-gate.outcome.wait-description');
  }
}

function getTradeGateOutcomeRunTargetId(outcome: TradeGateOutcomeType): string {
  return `outcome:${outcome}`;
}

export function advanceTradeGateRun(params: {
  workflow: TradeGateWorkflow;
  questions: TradeGateQuestion[];
  run: TradeGateRun;
  optionId: string;
  timestamp?: string;
}): TradeGateRun | null {
  if (params.run.status !== 'in-progress') return null;

  const currentNodeId = params.run.currentNodeId;
  const currentQuestion = getTradeGateQuestion(
    params.workflow,
    params.questions,
    currentNodeId
  );
  const option = currentQuestion?.options.find(
    (candidate) => candidate.id === params.optionId
  );
  if (!currentNodeId || !currentQuestion || !option) return null;
  const answeredNodeIds = new Set(
    params.run.answers.map((answer) => answer.nodeId)
  );
  if (
    !getRunnableTradeGateOptions(
      params.workflow,
      params.questions,
      currentNodeId,
      answeredNodeIds
    ).some((candidate) => candidate.id === option.id)
  ) {
    return null;
  }

  const route = getTradeGateRoute(params.workflow, currentNodeId, option.id);
  if (!route) return null;

  const timestamp = params.timestamp ?? new Date().toISOString();
  const targetNodeId =
    route.target.kind === 'node'
      ? route.target.nodeId
      : getTradeGateOutcomeRunTargetId(route.target.outcome);

  const answer = {
    nodeId: currentNodeId,
    nodeTitle: currentQuestion.title,
    prompt: currentQuestion.prompt,
    selectedOptionId: option.id,
    selectedOptionLabel: option.label,
    targetNodeId,
    timestamp,
  };

  if (route.target.kind === 'outcome') {
    return {
      ...params.run,
      answers: [...params.run.answers, answer],
      status: 'completed',
      completedAt: answer.timestamp,
      currentNodeId: targetNodeId,
      outcome: route.target.outcome,
      outcomeTitle: getDefaultOutcomeTitle(route.target.outcome),
      outcomeDescription: route.target.note,
    };
  }

  return {
    ...params.run,
    answers: [...params.run.answers, answer],
    currentNodeId: route.target.nodeId,
  };
}

function normalizeTradeGateRuns(value: unknown): TradeGateRun[] {
  if (!Array.isArray(value)) return [];
  const runs: TradeGateRun[] = [];
  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.workflowId !== 'string' ||
      typeof item.workflowName !== 'string' ||
      typeof item.startedAt !== 'string' ||
      !Array.isArray(item.answers)
    ) {
      continue;
    }
    const status =
      item.status === 'completed' || item.status === 'abandoned'
        ? item.status
        : 'in-progress';
    const answers = [];
    for (const answer of item.answers) {
      if (
        !isRecord(answer) ||
        typeof answer.nodeId !== 'string' ||
        typeof answer.nodeTitle !== 'string' ||
        typeof answer.prompt !== 'string' ||
        typeof answer.selectedOptionId !== 'string' ||
        typeof answer.selectedOptionLabel !== 'string' ||
        typeof answer.targetNodeId !== 'string' ||
        typeof answer.timestamp !== 'string'
      ) {
        continue;
      }
      answers.push({
        nodeId: answer.nodeId,
        nodeTitle: answer.nodeTitle,
        prompt: answer.prompt,
        selectedOptionId: answer.selectedOptionId,
        selectedOptionLabel: answer.selectedOptionLabel,
        targetNodeId: answer.targetNodeId,
        timestamp: answer.timestamp,
      });
    }
    runs.push({
      id: item.id,
      workflowId: item.workflowId,
      workflowName: item.workflowName,
      startedAt: item.startedAt,
      completedAt:
        typeof item.completedAt === 'string' ? item.completedAt : undefined,
      status,
      currentNodeId:
        typeof item.currentNodeId === 'string' ? item.currentNodeId : undefined,
      outcome:
        item.outcome === 'green-light' ||
        item.outcome === 'no-trade' ||
        item.outcome === 'wait'
          ? item.outcome
          : undefined,
      outcomeTitle:
        typeof item.outcomeTitle === 'string' ? item.outcomeTitle : undefined,
      outcomeDescription:
        typeof item.outcomeDescription === 'string'
          ? item.outcomeDescription
          : undefined,
      answers,
    });
  }
  return runs;
}

export function getTradeGateRunsFromFile(
  plugin: JournalitPlugin,
  filePath: string
): TradeGateRun[] {
  const file = plugin.app.vault.getAbstractFileByPath(filePath);
  if (!(file instanceof TFile)) return [];
  const frontmatter = plugin.app.metadataCache.getFileCache(file)?.frontmatter;
  return normalizeTradeGateRuns(frontmatter?.sessionModeTradeGateRuns);
}

export function getActiveTradeGateRunFromFile(
  plugin: JournalitPlugin,
  filePath: string
): TradeGateRun | null {
  const file = plugin.app.vault.getAbstractFileByPath(filePath);
  if (!(file instanceof TFile)) return null;
  const frontmatter = plugin.app.metadataCache.getFileCache(file)?.frontmatter;
  const runs = normalizeTradeGateRuns([
    frontmatter?.sessionModeTradeGateActiveRun,
  ]);
  return runs[0] ?? null;
}

async function getDRCService(plugin: JournalitPlugin) {
  return plugin.drcService
    ? plugin.drcService
    : await plugin.serviceManager.getDRCService();
}

const enqueueTradeGateMutation = (
  filePath: string,
  task: () => Promise<void>
): Promise<void> => enqueueFileMutation('trade-gate', filePath, task);

export async function persistActiveTradeGateRun(params: {
  plugin: JournalitPlugin;
  filePath: string;
  run: TradeGateRun | null;
}): Promise<void> {
  await enqueueTradeGateMutation(params.filePath, async () => {
    const drcService = await getDRCService(params.plugin);
    await drcService.updateDRCFrontmatter(
      params.filePath,
      { sessionModeTradeGateActiveRun: params.run },
      'trade-gate'
    );
  });
}

export async function completeTradeGateRun(params: {
  plugin: JournalitPlugin;
  filePath: string;
  run: TradeGateRun;
}): Promise<void> {
  await enqueueTradeGateMutation(params.filePath, async () => {
    const existingRuns = getTradeGateRunsFromFile(
      params.plugin,
      params.filePath
    );
    if (existingRuns.some((run) => run.id === params.run.id)) {
      return;
    }
    const drcService = await getDRCService(params.plugin);
    await drcService.updateDRCFrontmatter(
      params.filePath,
      {
        sessionModeTradeGateActiveRun: null,
        sessionModeTradeGateRuns: [...existingRuns, params.run],
      },
      'trade-gate'
    );
  });
}
