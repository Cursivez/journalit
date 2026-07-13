import { TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import type {
  TradeGateNode,
  TradeGateOutcomeNode,
  TradeGateQuestionNode,
  TradeGateRun,
  TradeGateWorkflow,
} from '../../types/sessionMode';
import { generateUUID } from '../../utils/uuid';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

function getTradeGateNode(
  workflow: TradeGateWorkflow,
  nodeId: string | undefined
): TradeGateNode | null {
  if (!nodeId) return null;
  return workflow.nodes.find((node) => node.id === nodeId) ?? null;
}

export function getTradeGateQuestionNode(
  workflow: TradeGateWorkflow,
  nodeId: string | undefined
): TradeGateQuestionNode | null {
  const node = getTradeGateNode(workflow, nodeId);
  return node?.type === 'question' ? node : null;
}

export function getTradeGateOutcomeNode(
  workflow: TradeGateWorkflow,
  nodeId: string | undefined
): TradeGateOutcomeNode | null {
  const node = getTradeGateNode(workflow, nodeId);
  return node?.type === 'outcome' ? node : null;
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

const tradeGateMutationQueues = new Map<string, Promise<void>>();

async function enqueueTradeGateMutation(
  filePath: string,
  task: () => Promise<void>
): Promise<void> {
  const previousTask =
    tradeGateMutationQueues.get(filePath) ?? Promise.resolve();
  const nextTask = previousTask.catch(() => undefined).then(task);
  tradeGateMutationQueues.set(filePath, nextTask);
  try {
    await nextTask;
  } finally {
    if (tradeGateMutationQueues.get(filePath) === nextTask) {
      tradeGateMutationQueues.delete(filePath);
    }
  }
}

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
