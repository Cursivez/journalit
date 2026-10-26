import type { SessionModeSettings } from '../../../types/sessionMode';
import { Mutex } from '../../../utils/mutex';
import type {
  SessionWorkflowChange,
  SessionWorkflowChangeSummary,
  WireTradeGateQuestion,
  WireTradeGateWorkflow,
} from './configurationChangeTypes';
import {
  throwIfAborted,
  type PlannedConfigurationChange,
} from './configurationPlan';
import {
  SessionModeConfigurationError,
  applySessionWorkflowChange,
  findUniqueSessionQuestionIndex,
  findUniqueSessionWorkflowIndex,
  sessionModeConfigurationRevision,
} from './sessionModeConfiguration';

export interface SessionWorkflowPlanSummary {
  base_revision: string;
  resulting_revision: string;
  change: SessionWorkflowChangeSummary;
  workflow?: WireTradeGateWorkflow;
  questions?: WireTradeGateQuestion[];
}

interface SessionWorkflowPlannerDependencies {
  getSettings(): SessionModeSettings;
  saveSettings(settings: SessionModeSettings): Promise<void>;
}

function boundedText(value: unknown, maximumLength: number): string {
  if (typeof value !== 'string') return '';
  return Array.from(value).slice(0, maximumLength).join('');
}

function summaryFor(
  settings: SessionModeSettings,
  change: SessionWorkflowChange
): SessionWorkflowChangeSummary {
  if (change.kind === 'delete') {
    const workflows = Array.isArray(settings.tradeGateWorkflows)
      ? settings.tradeGateWorkflows
      : [];
    const index = findUniqueSessionWorkflowIndex(workflows, change.workflow_id);
    const target = workflows[index];
    if (target === undefined)
      throw new SessionModeConfigurationError('not_found');
    const workflowName = boundedText(target.name, 120);
    const displayName = workflowName || target.id;
    const nodeCount = Array.isArray(target.nodes) ? target.nodes.length : -1;
    return {
      action: 'delete',
      workflow_id: target.id,
      ...(workflowName === '' ? {} : { workflow_name: workflowName }),
      ...(nodeCount < 0 || nodeCount > 100 ? {} : { node_count: nodeCount }),
      message: boundedText(
        `Delete Session Mode workflow “${displayName}”.`,
        500
      ),
    };
  }
  if (change.kind === 'delete_question') {
    const questions = Array.isArray(settings.tradeGateQuestions)
      ? settings.tradeGateQuestions
      : [];
    const question =
      questions[findUniqueSessionQuestionIndex(questions, change.question_id)];
    const title = boundedText(question.title, 120);
    let workflowCount = 0;
    let placementCount = 0;
    for (const workflow of settings.tradeGateWorkflows ?? []) {
      let placements = 0;
      for (const node of workflow.nodes) {
        if (node.questionId === change.question_id) placements += 1;
      }
      if (placements > 0) workflowCount += 1;
      placementCount += placements;
    }
    return {
      action: 'delete_question',
      question_id: question.id,
      ...(title === '' ? {} : { question_title: title }),
      workflow_count: workflowCount,
      placement_count: placementCount,
      message: boundedText(
        placementCount === 0
          ? `Delete Session Mode question “${title || question.id}”. It is not used in any workflow.`
          : `Delete Session Mode question “${title || question.id}” and its ${countLabel(placementCount, 'placement')} in ${countLabel(workflowCount, 'workflow')}.`,
        500
      ),
    };
  }
  return {
    action: change.kind,
    workflow_id: change.workflow.id,
    workflow_name: change.workflow.name,
    question_count: change.questions.length,
    node_count: change.workflow.nodes.length,
    message:
      change.kind === 'create'
        ? `Create Session Mode workflow “${change.workflow.name}” with ${change.questions.length} questions and ${change.workflow.nodes.length} nodes.`
        : `Update Session Mode workflow “${change.workflow.name}” with ${change.questions.length} questions and ${change.workflow.nodes.length} nodes.`,
  };
}


export class SessionWorkflowPlanner {
  private readonly writeMutex = new Mutex();

  constructor(
    private readonly dependencies: SessionWorkflowPlannerDependencies
  ) {}

  async plan(
    change: SessionWorkflowChange,
    signal: AbortSignal
  ): Promise<PlannedConfigurationChange<SessionWorkflowPlanSummary>> {
    throwIfAborted(signal);
    const current = this.dependencies.getSettings();
    const baseRevision = await sessionModeConfigurationRevision(current);
    const changeSummary = summaryFor(current, change);
    const next = applySessionWorkflowChange(current, change);
    const resultingRevision = await sessionModeConfigurationRevision(next);
    throwIfAborted(signal);
    const summary: SessionWorkflowPlanSummary = {
      base_revision: baseRevision,
      resulting_revision: resultingRevision,
      change: changeSummary,
      ...(change.kind === 'delete' || change.kind === 'delete_question'
        ? {}
        : {
            workflow: structuredClone(change.workflow),
            questions: structuredClone(change.questions),
          }),
    };
    const frozen = structuredClone(change);
    return {
      summary,
      execute: (executionSignal) =>
        this.execute(frozen, summary, executionSignal),
    };
  }

  private async execute(
    change: SessionWorkflowChange,
    planned: SessionWorkflowPlanSummary,
    signal: AbortSignal
  ): Promise<void> {
    await this.writeMutex.withLock(async () => {
      throwIfAborted(signal);
      const current = this.dependencies.getSettings();
      if (
        (await sessionModeConfigurationRevision(current)) !==
        planned.base_revision
      ) {
        throw new SessionModeConfigurationError('conflict');
      }
      const next = applySessionWorkflowChange(current, change);
      if (
        (await sessionModeConfigurationRevision(next)) !==
        planned.resulting_revision
      ) {
        throw new SessionModeConfigurationError('conflict');
      }
      throwIfAborted(signal);
      await this.dependencies.saveSettings(next);
    });
  }
}

function countLabel(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}
