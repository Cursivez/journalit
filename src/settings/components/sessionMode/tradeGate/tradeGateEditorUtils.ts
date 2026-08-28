

import { t } from '../../../../lang/helpers';
import {
  DEFAULT_TRADE_GATE_QUESTIONS,
  DEFAULT_TRADE_GATE_WORKFLOWS,
} from '../../../../types/sessionMode';
import type {
  TradeGateOutcomeType,
  TradeGateQuestion,
  TradeGateRoute,
  TradeGateRouteTarget,
  TradeGateWorkflow,
  TradeGateWorkflowNode,
} from '../../../../types/sessionMode';
import { generateUUID } from '../../../../utils/uuid';


export function createEmptyTradeGateWorkflow(): TradeGateWorkflow {
  return {
    id: generateUUID(),
    name: '',
    startNodeId: '',
    nodes: [],
    routes: [],
  };
}

interface TradeGateStarterSeed {
  
  newQuestions: TradeGateQuestion[];
  workflow: TradeGateWorkflow;
}


export function createStarterTradeGateWorkflow(
  existingQuestions: TradeGateQuestion[]
): TradeGateStarterSeed {
  const template = DEFAULT_TRADE_GATE_WORKFLOWS[0];
  const newQuestions: TradeGateQuestion[] = [];
  const questionsById = new Map<string, TradeGateQuestion>();
  const nodeIdByQuestionId = new Map<string, string>();
  const existingById = new Map(
    existingQuestions.map((question) => [question.id, question])
  );
  const defaultsById = new Map(
    DEFAULT_TRADE_GATE_QUESTIONS.map((question) => [question.id, question])
  );

  for (const templateNode of template.nodes) {
    const existing = existingById.get(templateNode.questionId);
    const defaultQuestion = defaultsById.get(templateNode.questionId);
    const question =
      existing ??
      (defaultQuestion
        ? {
            ...defaultQuestion,
            options: defaultQuestion.options.map((option) => ({ ...option })),
          }
        : null);
    if (!question) continue;
    if (!existing) newQuestions.push(question);
    questionsById.set(question.id, question);
    nodeIdByQuestionId.set(templateNode.questionId, generateUUID());
  }

  const routes: TradeGateRoute[] = [];
  for (const templateRoute of template.routes) {
    
    const sourceNodeId = nodeIdByQuestionId.get(templateRoute.nodeId);
    const sourceQuestion = questionsById.get(templateRoute.nodeId);
    if (
      !sourceNodeId ||
      !sourceQuestion ||
      !sourceQuestion.options.some(
        (option) => option.id === templateRoute.optionId
      )
    ) {
      continue;
    }
    let target: TradeGateRouteTarget;
    if (templateRoute.target.kind === 'node') {
      const targetNodeId = nodeIdByQuestionId.get(templateRoute.target.nodeId);
      if (!targetNodeId) continue;
      target = { kind: 'node', nodeId: targetNodeId };
    } else {
      target = { ...templateRoute.target };
    }
    routes.push({
      nodeId: sourceNodeId,
      optionId: templateRoute.optionId,
      target,
    });
  }

  const nodes: TradeGateWorkflowNode[] = [];
  for (const templateNode of template.nodes) {
    const nodeId = nodeIdByQuestionId.get(templateNode.questionId);
    if (nodeId) nodes.push({ id: nodeId, questionId: templateNode.questionId });
  }

  return {
    newQuestions,
    workflow: {
      id: generateUUID(),
      name: template.name,
      startNodeId: nodeIdByQuestionId.get(template.startNodeId) ?? '',
      nodes,
      routes,
    },
  };
}

export function getTradeGateQuestionById(
  questions: TradeGateQuestion[],
  questionId: string
): TradeGateQuestion | null {
  return questions.find((question) => question.id === questionId) ?? null;
}

export function getTradeGateNodeById(
  workflow: TradeGateWorkflow,
  nodeId: string
): TradeGateWorkflowNode | null {
  return workflow.nodes.find((node) => node.id === nodeId) ?? null;
}

export function getTradeGateRouteTarget(
  workflow: TradeGateWorkflow,
  nodeId: string,
  optionId: string
): TradeGateRouteTarget | null {
  return (
    workflow.routes.find(
      (route) => route.nodeId === nodeId && route.optionId === optionId
    )?.target ?? null
  );
}


export function getTradeGateQuestionUsage(
  workflows: TradeGateWorkflow[],
  questionId: string
): TradeGateWorkflow[] {
  return workflows.filter((workflow) =>
    workflow.nodes.some((node) => node.questionId === questionId)
  );
}


export function createTradeGateWorkflowNode(
  questionId: string
): TradeGateWorkflowNode {
  return { id: generateUUID(), questionId };
}


export function addNodeToTradeGateWorkflow(
  workflow: TradeGateWorkflow,
  node: TradeGateWorkflowNode
): TradeGateWorkflow {
  if (workflow.nodes.some((candidate) => candidate.id === node.id)) {
    return workflow;
  }
  return {
    ...workflow,
    startNodeId: workflow.startNodeId || node.id,
    nodes: [...workflow.nodes, node],
  };
}


export function removeNodeFromTradeGateWorkflow(
  workflow: TradeGateWorkflow,
  nodeId: string
): TradeGateWorkflow {
  if (!workflow.nodes.some((node) => node.id === nodeId)) return workflow;
  const nodes = workflow.nodes.filter((node) => node.id !== nodeId);
  return {
    ...workflow,
    startNodeId:
      workflow.startNodeId === nodeId
        ? (nodes[0]?.id ?? '')
        : workflow.startNodeId,
    nodes,
    routes: workflow.routes.filter(
      (route) =>
        route.nodeId !== nodeId &&
        !(route.target.kind === 'node' && route.target.nodeId === nodeId)
    ),
  };
}


export function deleteTradeGateQuestionFromLibrary(
  questions: TradeGateQuestion[],
  workflows: TradeGateWorkflow[],
  questionId: string
): { questions: TradeGateQuestion[]; workflows: TradeGateWorkflow[] } {
  return {
    questions: questions.filter((question) => question.id !== questionId),
    workflows: workflows.map((workflow) => {
      let nextWorkflow = workflow;
      for (const node of workflow.nodes) {
        if (node.questionId === questionId) {
          nextWorkflow = removeNodeFromTradeGateWorkflow(nextWorkflow, node.id);
        }
      }
      return nextWorkflow;
    }),
  };
}


export function replaceTradeGateNodeRoutes(
  workflow: TradeGateWorkflow,
  nodeId: string,
  optionTargets: ReadonlyArray<{
    optionId: string;
    target: TradeGateRouteTarget | null;
  }>
): TradeGateWorkflow {
  const retained = workflow.routes.filter((route) => route.nodeId !== nodeId);
  const added: TradeGateRoute[] = [];
  for (const entry of optionTargets) {
    if (!entry.target) continue;
    added.push({
      nodeId,
      optionId: entry.optionId,
      target: entry.target,
    });
  }
  return { ...workflow, routes: [...retained, ...added] };
}


export function pruneTradeGateRoutesForQuestion(
  workflow: TradeGateWorkflow,
  question: TradeGateQuestion
): TradeGateWorkflow {
  const optionIds = new Set(question.options.map((option) => option.id));
  const questionNodeIds = new Set<string>();
  for (const node of workflow.nodes) {
    if (node.questionId === question.id) {
      questionNodeIds.add(node.id);
    }
  }
  const routes = workflow.routes.filter(
    (route) =>
      !questionNodeIds.has(route.nodeId) || optionIds.has(route.optionId)
  );
  return routes.length === workflow.routes.length
    ? workflow
    : { ...workflow, routes };
}


export function duplicateTradeGateQuestion(
  source: TradeGateQuestion
): TradeGateQuestion {
  return {
    id: generateUUID(),
    title: source.title,
    prompt: source.prompt,
    options: [],
  };
}

export function createTradeGateQuestionStub(): TradeGateQuestion {
  return {
    id: generateUUID(),
    title: t('settings.session-mode.trade-gate.new-question-title'),
    prompt: '',
    options: [],
  };
}

export interface TradeGateQuestionEdit {
  question: TradeGateQuestion;
  
  createdQuestions: TradeGateQuestion[];
  
  createdNodes: TradeGateWorkflowNode[];
  
  optionTargets?: Array<{
    optionId: string;
    target: TradeGateRouteTarget | null;
  }>;
  removeFromWorkflow?: boolean;
}

export interface TradeGateEditContext {
  workflowId: string;
  
  nodeId: string;
}


export function applyTradeGateQuestionEdit(
  questions: TradeGateQuestion[],
  workflows: TradeGateWorkflow[],
  context: TradeGateEditContext | null,
  edit: TradeGateQuestionEdit
): { questions: TradeGateQuestion[]; workflows: TradeGateWorkflow[] } {
  const questionExists = questions.some(
    (question) => question.id === edit.question.id
  );
  const nextQuestions = [
    ...(questionExists
      ? questions.map((question) =>
          question.id === edit.question.id ? edit.question : question
        )
      : [...questions, edit.question]),
    ...edit.createdQuestions,
  ];

  const nextWorkflows = workflows.map((workflow) => {
    const pruned = pruneTradeGateRoutesForQuestion(workflow, edit.question);
    if (pruned.id !== context?.workflowId) return pruned;

    if (edit.removeFromWorkflow) {
      return removeNodeFromTradeGateWorkflow(pruned, context.nodeId);
    }

    let nextWorkflow = pruned;
    for (const node of edit.createdNodes) {
      nextWorkflow = addNodeToTradeGateWorkflow(nextWorkflow, node);
    }
    return replaceTradeGateNodeRoutes(
      nextWorkflow,
      context.nodeId,
      edit.optionTargets ?? []
    );
  });

  return { questions: nextQuestions, workflows: nextWorkflows };
}



const TRADE_GATE_FLOW_NODE_WIDTH = 132;
const TRADE_GATE_FLOW_NODE_HEIGHT = 84;
const TRADE_GATE_FLOW_HORIZONTAL_GAP = 48;
const TRADE_GATE_FLOW_VERTICAL_GAP = 72;
const TRADE_GATE_FLOW_PADDING = 60;
export const TRADE_GATE_FLOW_MAX_PLACED_NODES = 200;

export type TradeGateFlowLayoutNode =
  | {
      kind: 'question';
      occurrenceId: string;
      nodeId: string;
      question: TradeGateQuestion;
      x: number;
      y: number;
    }
  | {
      kind: 'outcome';
      occurrenceId: string;
      outcome: TradeGateOutcomeType;
      sourceNodeId: string;
      sourceOptionId: string;
      x: number;
      y: number;
    }
  | {
      kind: 'unwired';
      occurrenceId: string;
      sourceNodeId: string;
      sourceOptionId: string;
      optionLabel: string;
      x: number;
      y: number;
    };

export interface TradeGateFlowLayoutEdge {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  labelX: number;
  labelY: number;
  label: string;
  sourceNodeId: string;
  sourceOptionId: string;
  wired: boolean;
}

interface TradeGateFlowLayout {
  nodes: TradeGateFlowLayoutNode[];
  edges: TradeGateFlowLayoutEdge[];
  width: number;
  height: number;
  truncated: boolean;
}

export function buildTradeGateFlowLayout(
  workflow: TradeGateWorkflow,
  questions: TradeGateQuestion[],
  startNode: TradeGateWorkflowNode
): TradeGateFlowLayout {
  const questionsById = new Map(
    questions.map((question) => [question.id, question])
  );
  const nodesById = new Map(workflow.nodes.map((node) => [node.id, node]));
  const layoutNodes: TradeGateFlowLayoutNode[] = [];
  const edges: TradeGateFlowLayoutEdge[] = [];
  let leafCursor = 0;
  let maxDepth = 0;
  let placedNodeCount = 0;
  let truncated = false;
  const occurrenceIds = new Set<string>();

  const getUniqueOccurrenceId = (baseId: string): string => {
    let occurrenceId = baseId;
    let suffix = 1;
    while (occurrenceIds.has(occurrenceId)) {
      occurrenceId = `${baseId}-${suffix}`;
      suffix += 1;
    }
    occurrenceIds.add(occurrenceId);
    return occurrenceId;
  };

  const reserveNode = (): void => {
    if (placedNodeCount < TRADE_GATE_FLOW_MAX_PLACED_NODES) {
      placedNodeCount += 1;
      return;
    }

    
    
    truncated = true;
  };

  const toX = (center: number): number =>
    TRADE_GATE_FLOW_PADDING +
    center * (TRADE_GATE_FLOW_NODE_WIDTH + TRADE_GATE_FLOW_HORIZONTAL_GAP);
  const toY = (depth: number): number =>
    TRADE_GATE_FLOW_PADDING +
    depth * (TRADE_GATE_FLOW_NODE_HEIGHT + TRADE_GATE_FLOW_VERTICAL_GAP);

  const placeLeaf = (
    node:
      | Omit<Extract<TradeGateFlowLayoutNode, { kind: 'outcome' }>, 'x' | 'y'>
      | Omit<Extract<TradeGateFlowLayoutNode, { kind: 'unwired' }>, 'x' | 'y'>,
    depth: number
  ): { center: number; x: number; y: number } => {
    reserveNode();
    maxDepth = Math.max(maxDepth, depth);
    const center = leafCursor++;
    const x = toX(center);
    const y = toY(depth);
    layoutNodes.push({ ...node, x, y });
    return { center, x, y };
  };

  const placeNode = (
    node: TradeGateWorkflowNode,
    question: TradeGateQuestion,
    depth: number,
    ancestorNodeIds: string[]
  ): { center: number; x: number; y: number } => {
    reserveNode();
    maxDepth = Math.max(maxDepth, depth);
    const occurrenceId = getUniqueOccurrenceId(node.id);
    
    
    const isRepeated = ancestorNodeIds.includes(node.id);

    interface ChildPlacement {
      optionId: string;
      optionLabel: string;
      wired: boolean;
      placement: { center: number; x: number; y: number };
    }
    const childPlacements: ChildPlacement[] = [];

    if (!isRepeated && !truncated) {
      for (const option of question.options) {
        if (truncated) break;
        const target = getTradeGateRouteTarget(workflow, node.id, option.id);
        if (!target) {
          childPlacements.push({
            optionId: option.id,
            optionLabel: option.label,
            wired: false,
            placement: placeLeaf(
              {
                kind: 'unwired',
                occurrenceId: getUniqueOccurrenceId(
                  `unwired-${node.id}-${option.id}`
                ),
                sourceNodeId: node.id,
                sourceOptionId: option.id,
                optionLabel: option.label,
              },
              depth + 1
            ),
          });
          continue;
        }
        if (target.kind === 'outcome') {
          childPlacements.push({
            optionId: option.id,
            optionLabel: option.label,
            wired: true,
            placement: placeLeaf(
              {
                kind: 'outcome',
                occurrenceId: getUniqueOccurrenceId(
                  `outcome-${node.id}-${option.id}`
                ),
                outcome: target.outcome,
                sourceNodeId: node.id,
                sourceOptionId: option.id,
              },
              depth + 1
            ),
          });
          continue;
        }
        const targetNode = nodesById.get(target.nodeId);
        const targetQuestion = targetNode
          ? questionsById.get(targetNode.questionId)
          : undefined;
        if (!targetNode || !targetQuestion) {
          continue;
        }
        childPlacements.push({
          optionId: option.id,
          optionLabel: option.label,
          wired: true,
          placement: placeNode(targetNode, targetQuestion, depth + 1, [
            ...ancestorNodeIds,
            node.id,
          ]),
        });
      }
    }

    const childCenters = childPlacements.map((child) => child.placement.center);
    const center =
      childCenters.length > 0
        ? (childCenters[0] + childCenters[childCenters.length - 1]) / 2
        : leafCursor++;
    const x = toX(center);
    const y = toY(depth);

    layoutNodes.push({
      kind: 'question',
      occurrenceId,
      nodeId: node.id,
      question,
      x,
      y,
    });

    for (const child of childPlacements) {
      const sourceX = x + TRADE_GATE_FLOW_NODE_WIDTH / 2;
      const sourceY = y + TRADE_GATE_FLOW_NODE_HEIGHT;
      const targetX = child.placement.x + TRADE_GATE_FLOW_NODE_WIDTH / 2;
      const targetY = child.placement.y;
      const labelPosition = getTradeGateFlowEdgeLabelPosition({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
      edges.push({
        id: `${occurrenceId}-${child.optionId}`,
        sourceX,
        sourceY,
        targetX,
        targetY,
        labelX: labelPosition.x,
        labelY: labelPosition.y,
        label:
          child.optionLabel || t('settings.session-mode.trade-gate.option'),
        sourceNodeId: node.id,
        sourceOptionId: child.optionId,
        wired: child.wired,
      });
    }

    return { center, x, y };
  };

  const startQuestion = questionsById.get(startNode.questionId);
  if (startQuestion) {
    placeNode(startNode, startQuestion, 0, []);
  }

  const usedLeaves = Math.max(leafCursor, 1);
  return {
    nodes: layoutNodes,
    edges,
    width:
      TRADE_GATE_FLOW_PADDING * 2 +
      usedLeaves * TRADE_GATE_FLOW_NODE_WIDTH +
      Math.max(0, usedLeaves - 1) * TRADE_GATE_FLOW_HORIZONTAL_GAP,
    height:
      TRADE_GATE_FLOW_PADDING * 2 +
      (maxDepth + 1) * TRADE_GATE_FLOW_NODE_HEIGHT +
      maxDepth * TRADE_GATE_FLOW_VERTICAL_GAP,
    truncated,
  };
}

function getTradeGateFlowEdgeLabelPosition({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: Pick<
  TradeGateFlowLayoutEdge,
  'sourceX' | 'sourceY' | 'targetX' | 'targetY'
>): { x: number; y: number } {
  const midpoint = 0.5;
  const inverse = 1 - midpoint;
  const controlY = sourceY + (targetY - sourceY) * 0.52;
  const x =
    inverse ** 3 * sourceX +
    3 * inverse ** 2 * midpoint * sourceX +
    3 * inverse * midpoint ** 2 * targetX +
    midpoint ** 3 * targetX;
  const y =
    inverse ** 3 * sourceY +
    3 * inverse ** 2 * midpoint * controlY +
    3 * inverse * midpoint ** 2 * controlY +
    midpoint ** 3 * targetY;

  return { x, y: y - 11 };
}

export function truncateTradeGateFlowLabel(
  value: string,
  maxLength: number
): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}
