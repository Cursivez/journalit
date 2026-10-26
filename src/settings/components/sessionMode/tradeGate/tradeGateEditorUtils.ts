

import dagre, {
  type EdgeLabel,
  type Graph,
  type GraphLabel,
  type NodeLabel,
} from '@dagrejs/dagre';
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
import { removeNodeFromTradeGateWorkflow } from '../../../../components/sessionMode/tradeGateUtils';


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


function replaceTradeGateNodeRoutes(
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


function pruneTradeGateRoutesForQuestion(
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
const TRADE_GATE_FLOW_QUESTION_HEIGHT = 84;

const TRADE_GATE_FLOW_OUTCOME_HEIGHT = 24;
const TRADE_GATE_FLOW_UNWIRED_HEIGHT = 40;
const TRADE_GATE_FLOW_HORIZONTAL_GAP = 48;
const TRADE_GATE_FLOW_PADDING = 60;



export const TRADE_GATE_FLOW_EDGE_LABEL_MAX_CHARS = 18;
const TRADE_GATE_FLOW_EDGE_LABEL_MAX_WIDTH = 112;

const TRADE_GATE_FLOW_EDGE_LABEL_HEIGHT = 22;


function estimateTradeGateFlowLabelWidth(label: string): number {
  let width = 16;
  for (const character of truncateTradeGateFlowLabel(
    label,
    TRADE_GATE_FLOW_EDGE_LABEL_MAX_CHARS
  )) {
    width += /[⺀-￿]/u.test(character) ? 11 : 7;
  }
  return Math.min(TRADE_GATE_FLOW_EDGE_LABEL_MAX_WIDTH, width);
}

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
  
  points: Array<{ x: number; y: number }>;
  
  labelX: number;
  labelY: number;
  
  labelMaxWidth: number;
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
}

interface TradeGateFlowGraphEdge {
  width: number;
  height: number;
  labelpos: 'c';
  points?: Array<{ x: number; y: number }>;
  x?: number;
  y?: number;
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
  const startQuestion = questionsById.get(startNode.questionId);
  if (!startQuestion) {
    return { nodes: [], edges: [], width: 0, height: 0 };
  }

  const graph = new dagre.graphlib.Graph<
    GraphLabel,
    NodeLabel,
    TradeGateFlowGraphEdge
  >({ multigraph: true });
  graph.setGraph({
    rankdir: 'TB',
    nodesep: TRADE_GATE_FLOW_HORIZONTAL_GAP,
    edgesep: 24,
    
    
    
    ranksep: 36,
    marginx: TRADE_GATE_FLOW_PADDING,
    marginy: TRADE_GATE_FLOW_PADDING,
  });

  const questionKey = (nodeId: string) => `question:${nodeId}`;
  const leafKey = (nodeId: string, optionId: string) =>
    `leaf:${nodeId}:${optionId}`;
  const layoutNodes: TradeGateFlowLayoutNode[] = [];
  const pendingEdges: Array<{
    from: string;
    to: string;
    edge: Omit<TradeGateFlowLayoutEdge, 'points' | 'labelX' | 'labelY'>;
  }> = [];

  
  
  const visited = new Set<string>();
  
  
  const walkOrder = new Map<string, number>();
  const visit = (nodeId: string, question: TradeGateQuestion): void => {
    visited.add(nodeId);
    walkOrder.set(questionKey(nodeId), walkOrder.size);
    graph.setNode(questionKey(nodeId), {
      width: TRADE_GATE_FLOW_NODE_WIDTH,
      height: TRADE_GATE_FLOW_QUESTION_HEIGHT,
    });
    layoutNodes.push({
      kind: 'question',
      occurrenceId: nodeId,
      nodeId,
      question,
      x: 0,
      y: 0,
    });

    for (const option of question.options) {
      const label =
        option.label || t('settings.session-mode.trade-gate.option');
      const edge = {
        id: `${nodeId}-${option.id}`,
        labelMaxWidth: estimateTradeGateFlowLabelWidth(label),
        label,
        sourceNodeId: nodeId,
        sourceOptionId: option.id,
        wired: true,
      };
      const target = getTradeGateRouteTarget(workflow, nodeId, option.id);
      walkOrder.set(edge.id, walkOrder.size);

      if (!target || target.kind === 'outcome') {
        const key = leafKey(nodeId, option.id);
        walkOrder.set(key, walkOrder.size);
        graph.setNode(key, {
          width: TRADE_GATE_FLOW_NODE_WIDTH,
          height: target
            ? TRADE_GATE_FLOW_OUTCOME_HEIGHT
            : TRADE_GATE_FLOW_UNWIRED_HEIGHT,
        });
        layoutNodes.push(
          target
            ? {
                kind: 'outcome',
                occurrenceId: `outcome-${nodeId}-${option.id}`,
                outcome: target.outcome,
                sourceNodeId: nodeId,
                sourceOptionId: option.id,
                x: 0,
                y: 0,
              }
            : {
                kind: 'unwired',
                occurrenceId: `unwired-${nodeId}-${option.id}`,
                sourceNodeId: nodeId,
                sourceOptionId: option.id,
                optionLabel: option.label,
                x: 0,
                y: 0,
              }
        );
        
        pendingEdges.push({
          from: questionKey(nodeId),
          to: key,
          edge: target ? edge : { ...edge, wired: false },
        });
        continue;
      }

      const targetNode = nodesById.get(target.nodeId);
      const targetQuestion = targetNode
        ? questionsById.get(targetNode.questionId)
        : undefined;
      if (!targetQuestion) continue;
      pendingEdges.push({
        from: questionKey(nodeId),
        to: questionKey(target.nodeId),
        edge,
      });
      if (!visited.has(target.nodeId)) visit(target.nodeId, targetQuestion);
    }
  };
  visit(startNode.id, startQuestion);

  for (const { from, to, edge } of pendingEdges) {
    graph.setEdge(
      from,
      to,
      {
        width: edge.wired ? edge.labelMaxWidth : 0,
        height: edge.wired ? TRADE_GATE_FLOW_EDGE_LABEL_HEIGHT : 0,
        labelpos: 'c',
      },
      edge.id
    );
  }

  dagre.layout(graph, {
    customOrder: (layered) => {
      orderTradeGateFlowRows(layered, (key) => {
        const { edgeObj } = layered.node(key);
        return walkOrder.get(edgeObj?.name ?? key) ?? 0;
      });
    },
  });

  const positionOf = (key: string): { x: number; y: number } => {
    const { x, y, width, height } = graph.node(key);
    
    return { x: (x ?? 0) - width / 2, y: (y ?? 0) - height / 2 };
  };
  const positionedNodes = layoutNodes.map((node) => ({
    ...node,
    ...positionOf(
      node.kind === 'question'
        ? questionKey(node.nodeId)
        : leafKey(node.sourceNodeId, node.sourceOptionId)
    ),
  }));

  const edges = pendingEdges.map(({ from, to, edge }) => {
    const { points = [], x = 0, y = 0 } = graph.edge(from, to, edge.id);
    
    
    const source = graph.node(from);
    const target = graph.node(to);
    return {
      ...edge,
      points: [
        { x: source.x ?? 0, y: (source.y ?? 0) + source.height / 2 },
        ...points.slice(1, -1),
        { x: target.x ?? 0, y: (target.y ?? 0) - target.height / 2 },
      ],
      labelX: x,
      labelY: y - TRADE_GATE_FLOW_EDGE_LABEL_HEIGHT / 2,
    };
  });

  const { width = 0, height = 0 } = graph.graph();
  return { nodes: positionedNodes, edges, width, height };
}


function orderTradeGateFlowRows(
  layered: Graph<GraphLabel, NodeLabel, EdgeLabel>,
  preference: (key: string) => number
): void {
  const rowsByRank = new Map<number, string[]>();
  for (const key of layered.nodes()) {
    const rank = layered.node(key).rank ?? 0;
    rowsByRank.set(rank, [...(rowsByRank.get(rank) ?? []), key]);
  }
  const rows = [...rowsByRank.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, row]) =>
      row.sort((left, right) => preference(left) - preference(right))
    );

  const position = new Map<string, number>();
  const index = (row: string[]) =>
    row.forEach((key, at) => position.set(key, at));
  rows.forEach(index);
  const positionOf = (key: string) => position.get(key) ?? 0;
  const predecessors = (key: string) => layered.predecessors(key) ?? [];
  const successors = (key: string) => layered.successors(key) ?? [];

  
  
  const pairCrossings = (
    left: string,
    right: string,
    neighbours: (key: string) => string[]
  ): number => {
    let crossings = 0;
    for (const leftNeighbour of neighbours(left)) {
      for (const rightNeighbour of neighbours(right)) {
        if (positionOf(leftNeighbour) > positionOf(rightNeighbour)) {
          crossings += 1;
        }
      }
    }
    return crossings;
  };
  const totalCrossings = (): number => {
    let crossings = 0;
    for (const row of rows) {
      row.forEach((left, at) => {
        for (const right of row.slice(at + 1)) {
          crossings += pairCrossings(left, right, successors);
        }
      });
    }
    return crossings;
  };

  const transpose = (): void => {
    let improved = true;
    while (improved) {
      improved = false;
      for (const row of rows) {
        for (let at = 0; at < row.length - 1; at += 1) {
          const left = row[at];
          const right = row[at + 1];
          const kept =
            pairCrossings(left, right, predecessors) +
            pairCrossings(left, right, successors);
          const swapped =
            pairCrossings(right, left, predecessors) +
            pairCrossings(right, left, successors);
          if (
            swapped < kept ||
            (swapped === kept && preference(left) > preference(right))
          ) {
            row[at] = right;
            row[at + 1] = left;
            index(row);
            improved = true;
          }
        }
      }
    }
  };

  
  
  
  const sortByNeighbours = (
    row: string[],
    neighbours: (key: string) => string[],
    tieDirection: 1 | -1
  ): void => {
    const weight = new Map<string, number>();
    for (const key of row) {
      const placed = neighbours(key);
      weight.set(
        key,
        placed.length > 0
          ? placed.reduce((sum, other) => sum + positionOf(other), 0) /
              placed.length
          : positionOf(key)
      );
    }
    row.sort(
      (left, right) =>
        (weight.get(left) ?? 0) - (weight.get(right) ?? 0) ||
        (positionOf(left) - positionOf(right)) * tieDirection
    );
    index(row);
  };

  transpose();
  const initial = rows.map((row) => [...row]);
  let best = initial;
  let bestCrossings = totalCrossings();
  
  
  for (const tieDirection of [1, -1] as const) {
    initial.forEach((row, at) => {
      rows[at].splice(0, rows[at].length, ...row);
      index(rows[at]);
    });
    for (let pass = 0; pass < 8 && bestCrossings > 0; pass += 1) {
      if (pass % 2 === 0) {
        for (const row of rows.slice(1)) {
          sortByNeighbours(row, predecessors, tieDirection);
        }
      } else {
        for (const row of rows.slice(0, -1).reverse()) {
          sortByNeighbours(row, successors, tieDirection);
        }
      }
      transpose();
      const crossings = totalCrossings();
      if (crossings < bestCrossings) {
        best = rows.map((row) => [...row]);
        bestCrossings = crossings;
      }
    }
  }

  
  
  let inOrderPairs = 0;
  let outOfOrderPairs = 0;
  for (const row of best) {
    row.forEach((left, at) => {
      for (const right of row.slice(at + 1)) {
        const difference = preference(right) - preference(left);
        if (difference > 0) inOrderPairs += 1;
        if (difference < 0) outOfOrderPairs += 1;
      }
    });
  }
  if (outOfOrderPairs > inOrderPairs) {
    for (const row of best) row.reverse();
  }

  for (const row of best) {
    row.forEach((key, at) => {
      layered.node(key).order = at;
    });
  }
}


export function getTradeGateFlowEdgePath(
  edge: TradeGateFlowLayoutEdge
): string {
  const [start, ...rest] = edge.points;
  if (!start) return '';
  const segments = [`M ${start.x} ${start.y}`];
  let from = start;
  for (const to of rest) {
    const midY = from.y + (to.y - from.y) / 2;
    segments.push(`C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`);
    from = to;
  }
  return segments.join(' ');
}

export function truncateTradeGateFlowLabel(
  value: string,
  maxLength: number
): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}
