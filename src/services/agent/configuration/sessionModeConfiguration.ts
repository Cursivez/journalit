import type { InspectConfigurationResult } from '../protocol/generated/inspect_configuration.result.generated';
import type {
  SessionWorkflowChange,
  WireTradeGateQuestion,
  WireTradeGateWorkflow,
} from './configurationChangeTypes';
import type {
  SessionModePhaseLayouts,
  SessionModeSettings,
  TradeGateQuestion,
  TradeGateWorkflow,
} from '../../../types/sessionMode';
import { normalizeSessionModePhaseLayouts } from '../../../utils/sessionModeLayout';
import { deleteTradeGateQuestionFromLibrary } from '../../../components/sessionMode/tradeGateUtils';
import {
  boundedText,
  canonicalizeConfigurationValue,
  configurationRevision,
  isBoundedString,
  isOpaqueId,
  isRecord,
} from './configurationPrimitives';

type InspectSuccess = Extract<InspectConfigurationResult, { status: 'ok' }>;
type Projection = NonNullable<InspectSuccess['configuration']['session_mode']>;
type QuestionIssue = Projection['invalid_questions'][number]['issues'][number];
type WorkflowIssue = Projection['invalid_workflows'][number]['issues'][number];

const MAX_PROJECTED_QUESTIONS = 500;
const MAX_PROJECTED_WORKFLOWS = 50;

type SessionModeConfigurationErrorCode =
  | 'invalid_request'
  | 'not_found'
  | 'conflict';

export class SessionModeConfigurationError extends Error {
  constructor(readonly code: SessionModeConfigurationErrorCode) {
    super('Session Mode configuration request failed.');
    this.name = 'SessionModeConfigurationError';
  }
}

function addIdentityIssue(
  issues: Set<QuestionIssue | WorkflowIssue>,
  value: unknown
): void {
  if (!isOpaqueId(value)) issues.add('invalid_identity');
}

function validateQuestion(value: unknown): readonly QuestionIssue[] {
  const issues = new Set<QuestionIssue>();
  if (!isRecord(value)) return Object.freeze(['invalid_content']);
  addIdentityIssue(issues, value.id);
  if (
    !isBoundedString(value.title, 120) ||
    !isBoundedString(value.prompt, 1000)
  ) {
    issues.add('invalid_content');
  }
  if (
    !Array.isArray(value.options) ||
    value.options.length < 1 ||
    value.options.length > 20
  ) {
    issues.add('invalid_content');
  }
  const optionIds = new Set<string>();
  for (const option of Array.isArray(value.options) ? value.options : []) {
    if (!isRecord(option)) {
      issues.add('invalid_content');
      continue;
    }
    addIdentityIssue(issues, option.id);
    if (typeof option.id === 'string') {
      if (optionIds.has(option.id)) issues.add('duplicate_identity');
      optionIds.add(option.id);
    }
    if (!isBoundedString(option.label, 120)) issues.add('invalid_content');
  }
  return Object.freeze([...issues]);
}

function projectQuestion(question: TradeGateQuestion): WireTradeGateQuestion {
  return {
    id: question.id,
    title: question.title,
    prompt: question.prompt,
    options: question.options.map((option) => ({
      id: option.id,
      label: option.label,
    })),
  };
}

function storeQuestion(question: WireTradeGateQuestion): TradeGateQuestion {
  return {
    id: question.id,
    title: question.title,
    prompt: question.prompt,
    options: question.options.map((option) => ({
      id: option.id,
      label: option.label,
    })),
  };
}

function questionById(
  questions: readonly TradeGateQuestion[]
): Map<string, TradeGateQuestion> {
  return new Map(questions.map((question) => [question.id, question]));
}


function validateSessionWorkflow(
  value: unknown,
  questions: readonly TradeGateQuestion[]
): readonly WorkflowIssue[] {
  const issues = new Set<WorkflowIssue>();
  if (!isRecord(value)) return Object.freeze(['invalid_node']);
  addIdentityIssue(issues, value.id);
  addIdentityIssue(issues, value.startNodeId);
  if (!isBoundedString(value.name, 120)) issues.add('invalid_content');
  if (
    !Array.isArray(value.nodes) ||
    value.nodes.length < 1 ||
    value.nodes.length > 100
  ) {
    issues.add('invalid_node');
  }
  if (!Array.isArray(value.routes) || value.routes.length > 2000)
    issues.add('invalid_node');

  const questionsById = questionById(questions);
  const nodeIds = new Set<string>();
  const nodeQuestions = new Map<string, TradeGateQuestion>();
  for (const node of Array.isArray(value.nodes) ? value.nodes : []) {
    if (!isRecord(node)) {
      issues.add('invalid_node');
      continue;
    }
    addIdentityIssue(issues, node.id);
    addIdentityIssue(issues, node.questionId);
    if (typeof node.id === 'string') {
      if (nodeIds.has(node.id)) issues.add('duplicate_identity');
      nodeIds.add(node.id);
    }
    if (typeof node.questionId === 'string') {
      const question = questionsById.get(node.questionId);
      if (!question) issues.add('missing_question');
      else if (typeof node.id === 'string')
        nodeQuestions.set(node.id, question);
    }
  }

  if (
    typeof value.startNodeId !== 'string' ||
    !nodeIds.has(value.startNodeId)
  ) {
    issues.add('invalid_start');
  }

  const routeKeys = new Set<string>();
  const routedOptions = new Map<string, Set<string>>();
  const edges = new Map<string, string[]>();
  let outcomeCount = 0;
  for (const route of Array.isArray(value.routes) ? value.routes : []) {
    if (!isRecord(route)) {
      issues.add('invalid_node');
      continue;
    }
    addIdentityIssue(issues, route.nodeId);
    addIdentityIssue(issues, route.optionId);
    const nodeId = typeof route.nodeId === 'string' ? route.nodeId : undefined;
    const optionId =
      typeof route.optionId === 'string' ? route.optionId : undefined;
    if (nodeId && !nodeIds.has(nodeId)) issues.add('dangling_route');
    const question = nodeId ? nodeQuestions.get(nodeId) : undefined;
    if (
      question &&
      optionId &&
      !question.options.some((option) => option.id === optionId)
    ) {
      issues.add('unknown_option');
    }
    if (nodeId && optionId) {
      const key = `${nodeId}\u0000${optionId}`;
      if (routeKeys.has(key)) issues.add('duplicate_route');
      routeKeys.add(key);
      const options = routedOptions.get(nodeId) ?? new Set<string>();
      options.add(optionId);
      routedOptions.set(nodeId, options);
    }

    if (!isRecord(route.target)) {
      issues.add('invalid_reference');
      continue;
    }
    if (route.target.kind === 'node') {
      const targetNodeId = route.target.nodeId;
      addIdentityIssue(issues, targetNodeId);
      if (typeof targetNodeId !== 'string' || !nodeIds.has(targetNodeId)) {
        issues.add('invalid_reference');
      } else if (nodeId) {
        const targets = edges.get(nodeId) ?? [];
        targets.push(targetNodeId);
        edges.set(nodeId, targets);
      }
    } else if (route.target.kind === 'outcome') {
      outcomeCount += 1;
      const outcome = route.target.outcome;
      if (
        outcome !== 'green-light' &&
        outcome !== 'no-trade' &&
        outcome !== 'wait'
      )
        issues.add('invalid_content');
      if (
        route.target.note !== undefined &&
        !isBoundedString(route.target.note, 1000, true)
      ) {
        issues.add('invalid_content');
      }
    } else {
      issues.add('invalid_reference');
    }
  }

  for (const [nodeId, question] of nodeQuestions) {
    const routed = routedOptions.get(nodeId) ?? new Set<string>();
    for (const option of question.options) {
      if (!routed.has(option.id)) issues.add('missing_route');
    }
  }
  if (outcomeCount === 0) issues.add('no_outcome');

  if (typeof value.startNodeId === 'string' && nodeIds.has(value.startNodeId)) {
    const state = new Map<string, 0 | 1 | 2>();
    const visit = (nodeId: string): void => {
      if (state.get(nodeId) === 1) {
        issues.add('cycle');
        return;
      }
      if (state.get(nodeId) === 2) return;
      state.set(nodeId, 1);
      for (const target of edges.get(nodeId) ?? []) visit(target);
      state.set(nodeId, 2);
    };
    visit(value.startNodeId);
    if (state.size !== nodeIds.size) issues.add('unreachable_node');
  }
  return Object.freeze([...issues]);
}

function projectWorkflow(workflow: TradeGateWorkflow): WireTradeGateWorkflow {
  return {
    id: workflow.id,
    name: workflow.name,
    start_node_id: workflow.startNodeId,
    nodes: workflow.nodes.map((node) => ({
      id: node.id,
      question_id: node.questionId,
    })),
    routes: workflow.routes.map((route) => ({
      node_id: route.nodeId,
      option_id: route.optionId,
      target:
        route.target.kind === 'node'
          ? { kind: 'node', node_id: route.target.nodeId }
          : {
              kind: 'outcome',
              outcome: route.target.outcome,
              ...(route.target.note === undefined
                ? {}
                : { note: route.target.note }),
            },
    })),
  };
}

function storeWorkflow(workflow: WireTradeGateWorkflow): TradeGateWorkflow {
  return {
    id: workflow.id,
    name: workflow.name,
    startNodeId: workflow.start_node_id,
    nodes: workflow.nodes.map((node) => ({
      id: node.id,
      questionId: node.question_id,
    })),
    routes: workflow.routes.map((route) => ({
      nodeId: route.node_id,
      optionId: route.option_id,
      target:
        route.target.kind === 'node'
          ? { kind: 'node', nodeId: route.target.node_id }
          : {
              kind: 'outcome',
              outcome: route.target.outcome,
              ...(route.target.note === undefined
                ? {}
                : { note: route.target.note }),
            },
    })),
  };
}

function projectPhaseLayouts(
  layouts: SessionModePhaseLayouts
): Projection['phase_layouts'] {
  return {
    preparation: [...new Set(layouts.preparation)].filter(
      (
        value
      ): value is
        | 'preparationResources'
        | 'preparationGoals'
        | 'preparationChecklist' =>
        value === 'preparationResources' ||
        value === 'preparationGoals' ||
        value === 'preparationChecklist'
    ),
    live: [...new Set(layouts.live)].filter(
      (value): value is 'tradeGate' | 'timeline' =>
        value === 'tradeGate' || value === 'timeline'
    ),
    ended: [...new Set(layouts.ended)].filter(
      (value): value is 'endedActions' | 'endedStats' =>
        value === 'endedActions' || value === 'endedStats'
    ),
  };
}

function identityCounts(values: readonly unknown[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (isRecord(value) && typeof value.id === 'string')
      counts.set(value.id, (counts.get(value.id) ?? 0) + 1);
  }
  return counts;
}

export async function projectSessionModeConfiguration(
  settings: SessionModeSettings
): Promise<Projection> {
  const storedQuestions = Array.isArray(settings.tradeGateQuestions)
    ? settings.tradeGateQuestions
    : [];
  const storedWorkflows = Array.isArray(settings.tradeGateWorkflows)
    ? settings.tradeGateWorkflows
    : [];
  const questionCounts = identityCounts(storedQuestions);
  const workflowCounts = identityCounts(storedWorkflows);
  const strictQuestions: TradeGateQuestion[] = [];
  const projectedQuestions: Projection['trade_gate_questions'] = [];
  const invalidQuestions: Projection['invalid_questions'] = [];
  let omittedQuestions = 0;

  for (const question of storedQuestions) {
    const issues = [...validateQuestion(question)];
    const id = isRecord(question) ? question.id : undefined;
    const unique = typeof id === 'string' && questionCounts.get(id) === 1;
    if (!unique) issues.push('duplicate_identity');
    const uniqueIssues = [...new Set(issues)];
    if (uniqueIssues.length === 0) {
      if (projectedQuestions.length < MAX_PROJECTED_QUESTIONS) {
        strictQuestions.push(question);
        projectedQuestions.push(projectQuestion(question));
      } else omittedQuestions += 1;
      continue;
    }
    if (invalidQuestions.length >= MAX_PROJECTED_QUESTIONS) {
      omittedQuestions += 1;
      continue;
    }
    const title = boundedText(
      isRecord(question) ? question.title : undefined,
      120
    );
    const actionable = unique && isOpaqueId(id);
    invalidQuestions.push(
      actionable
        ? {
            question_id: id,
            ...(title === undefined ? {} : { title }),
            issues: uniqueIssues,
            can_replace: true,
          }
        : {
            ...(typeof id === 'string'
              ? { question_id: id.slice(0, 256) }
              : {}),
            ...(title === undefined ? {} : { title }),
            issues: uniqueIssues,
            can_replace: false,
          }
    );
  }

  const projectedWorkflows: Projection['trade_gate_workflows'] = [];
  const invalidWorkflows: Projection['invalid_workflows'] = [];
  let omittedWorkflows = 0;
  for (const workflow of storedWorkflows) {
    const issues = [...validateSessionWorkflow(workflow, strictQuestions)];
    const id = isRecord(workflow) ? workflow.id : undefined;
    const unique = typeof id === 'string' && workflowCounts.get(id) === 1;
    if (!unique) issues.push('duplicate_identity');
    const uniqueIssues = [...new Set(issues)];
    if (uniqueIssues.length === 0) {
      if (projectedWorkflows.length < MAX_PROJECTED_WORKFLOWS) {
        projectedWorkflows.push(projectWorkflow(workflow));
      } else omittedWorkflows += 1;
      continue;
    }
    if (invalidWorkflows.length >= MAX_PROJECTED_WORKFLOWS) {
      omittedWorkflows += 1;
      continue;
    }
    const name = boundedText(
      isRecord(workflow) ? workflow.name : undefined,
      120
    );
    const actionable = unique && isOpaqueId(id);
    invalidWorkflows.push(
      actionable
        ? {
            workflow_id: id,
            ...(name === undefined ? {} : { name }),
            issues: uniqueIssues,
            can_replace_or_delete: true,
          }
        : {
            ...(typeof id === 'string'
              ? { workflow_id: id.slice(0, 256) }
              : {}),
            ...(name === undefined ? {} : { name }),
            issues: uniqueIssues,
            can_replace_or_delete: false,
          }
    );
  }

  return {
    revision: await sessionModeConfigurationRevision(settings),
    workflow_schema_version: 1,
    trade_gate_questions: projectedQuestions,
    trade_gate_workflows: projectedWorkflows,
    phase_layouts: projectPhaseLayouts(
      normalizeSessionModePhaseLayouts(settings.phaseLayouts)
    ),
    invalid_questions: invalidQuestions,
    invalid_workflows: invalidWorkflows,
    question_count: storedQuestions.length,
    omitted_question_count: omittedQuestions,
    workflow_count: storedWorkflows.length,
    omitted_workflow_count: omittedWorkflows,
  };
}

export async function sessionModeConfigurationRevision(
  settings: SessionModeSettings
): Promise<string> {
  return configurationRevision({
    phaseLayouts: settings.phaseLayouts,
    tradeGateQuestions: settings.tradeGateQuestions,
    tradeGateWorkflows: settings.tradeGateWorkflows,
  });
}

export function findUniqueSessionWorkflowIndex(
  workflows: readonly unknown[],
  workflowId: string
): number {
  let match = -1;
  for (let index = 0; index < workflows.length; index += 1) {
    const candidate = workflows[index];
    if (!isRecord(candidate) || candidate.id !== workflowId) continue;
    if (match !== -1) throw new SessionModeConfigurationError('conflict');
    match = index;
  }
  if (match === -1) throw new SessionModeConfigurationError('not_found');
  return match;
}

function structurallyEqual(left: unknown, right: unknown): boolean {
  return (
    JSON.stringify(canonicalizeConfigurationValue(left)) ===
    JSON.stringify(canonicalizeConfigurationValue(right))
  );
}

function validateSubmittedChange(
  change: Exclude<SessionWorkflowChange, { kind: 'delete' | 'delete_question' }>
): {
  workflow: TradeGateWorkflow;
  questions: TradeGateQuestion[];
} {
  const questions = change.questions.map(storeQuestion);
  const counts = identityCounts(questions);
  if (
    questions.some(
      (question) =>
        validateQuestion(question).length > 0 || counts.get(question.id) !== 1
    )
  ) {
    throw new SessionModeConfigurationError('invalid_request');
  }
  const workflow = storeWorkflow(change.workflow);
  if (validateSessionWorkflow(workflow, questions).length > 0) {
    throw new SessionModeConfigurationError('invalid_request');
  }
  const referenced = new Set(workflow.nodes.map((node) => node.questionId));
  if (
    referenced.size !== questions.length ||
    questions.some((question) => !referenced.has(question.id))
  ) {
    throw new SessionModeConfigurationError('invalid_request');
  }
  return { workflow, questions };
}

function workflowReferencesQuestion(
  value: unknown,
  questionId: string
): boolean {
  if (!isRecord(value) || !Array.isArray(value.nodes)) return false;
  return value.nodes.some(
    (node) => isRecord(node) && node.questionId === questionId
  );
}


export function findUniqueSessionQuestionIndex(
  questions: readonly unknown[],
  questionId: string
): number {
  let match = -1;
  for (let index = 0; index < questions.length; index += 1) {
    const candidate = questions[index];
    if (!isRecord(candidate) || candidate.id !== questionId) continue;
    if (match !== -1) throw new SessionModeConfigurationError('conflict');
    match = index;
  }
  if (match === -1) throw new SessionModeConfigurationError('not_found');
  return match;
}


export function applySessionWorkflowChange(
  settings: SessionModeSettings,
  change: SessionWorkflowChange
): SessionModeSettings {
  const workflows = Array.isArray(settings.tradeGateWorkflows)
    ? structuredClone(settings.tradeGateWorkflows)
    : [];

  if (change.kind === 'delete') {
    const index = findUniqueSessionWorkflowIndex(workflows, change.workflow_id);
    workflows.splice(index, 1);
    return {
      ...settings,
      tradeGateWorkflows: workflows,
    };
  }

  const questions = Array.isArray(settings.tradeGateQuestions)
    ? structuredClone(settings.tradeGateQuestions)
    : [];

  if (change.kind === 'delete_question') {
    findUniqueSessionQuestionIndex(questions, change.question_id);
    
    const next = deleteTradeGateQuestionFromLibrary(
      questions,
      workflows,
      change.question_id
    );
    return {
      ...settings,
      tradeGateQuestions: next.questions,
      tradeGateWorkflows: next.workflows,
    };
  }

  const submitted = validateSubmittedChange(change);
  let updatedIndex: number | undefined;
  if (change.kind === 'create') {
    if (
      workflows.some(
        (candidate) =>
          isRecord(candidate) && candidate.id === submitted.workflow.id
      )
    ) {
      throw new SessionModeConfigurationError('conflict');
    }
  } else {
    if (change.workflow_id !== submitted.workflow.id)
      throw new SessionModeConfigurationError('invalid_request');
    updatedIndex = findUniqueSessionWorkflowIndex(
      workflows,
      change.workflow_id
    );
  }

  for (const submittedQuestion of submitted.questions) {
    let existingIndex = -1;
    for (let index = 0; index < questions.length; index += 1) {
      const candidate = questions[index];
      if (!isRecord(candidate) || candidate.id !== submittedQuestion.id)
        continue;
      if (existingIndex !== -1)
        throw new SessionModeConfigurationError('conflict');
      existingIndex = index;
    }
    if (existingIndex < 0) {
      questions.push(structuredClone(submittedQuestion));
      continue;
    }
    if (structurallyEqual(questions[existingIndex], submittedQuestion))
      continue;
    const shared = workflows.some(
      (workflow, index) =>
        index !== updatedIndex &&
        workflowReferencesQuestion(workflow, submittedQuestion.id)
    );
    if (shared) throw new SessionModeConfigurationError('conflict');
    questions[existingIndex] = structuredClone(submittedQuestion);
  }

  if (updatedIndex === undefined)
    workflows.push(structuredClone(submitted.workflow));
  else workflows[updatedIndex] = structuredClone(submitted.workflow);
  return {
    ...structuredClone(settings),
    tradeGateQuestions: questions,
    tradeGateWorkflows: workflows,
  };
}
