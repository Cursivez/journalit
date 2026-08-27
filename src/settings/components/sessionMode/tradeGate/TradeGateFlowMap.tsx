

import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Check,
  ClockAlert,
  Minus,
  Plus,
  X,
} from '../../../../components/shared/icons/ObsidianIcon';
import { Button } from '../../../../components/ui/Button';
import {
  getDefaultOutcomeTitle,
  getReachableTradeGateNodeIds,
} from '../../../../components/sessionMode/tradeGateUtils';
import { t } from '../../../../lang/helpers';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import type {
  TradeGateOutcomeType,
  TradeGateQuestion,
  TradeGateWorkflow,
  TradeGateWorkflowNode,
} from '../../../../types/sessionMode';
import {
  buildTradeGateFlowLayout,
  getTradeGateNodeById,
  getTradeGateQuestionById,
  truncateTradeGateFlowLabel,
  type TradeGateFlowLayoutEdge,
  type TradeGateFlowLayoutNode,
} from './tradeGateEditorUtils';

const TRADE_GATE_FLOW_MIN_SCALE = 0.45;
const TRADE_GATE_FLOW_MAX_SCALE = 1.4;
const TRADE_GATE_FLOW_ZOOM_STEP = 0.15;
const TRADE_GATE_FLOW_VIEWPORT_PADDING = 24;
const TRADE_GATE_FLOW_CANVAS_MIN_HEIGHT = 220;
const TRADE_GATE_FLOW_CANVAS_MAX_HEIGHT = 560;
const TRADE_GATE_FLOW_CANVAS_FALLBACK_HEIGHT = 320;

interface TradeGateFlowPanState {
  x: number;
  y: number;
}

interface TradeGateFlowDragState {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startPan: TradeGateFlowPanState;
}

interface TradeGateFlowViewState {
  scale: number;
  pan: TradeGateFlowPanState;
}

interface TradeGateFlowMapProps {
  workflow: TradeGateWorkflow;
  questions: TradeGateQuestion[];
  openNode: (nodeId: string, focusOptionId?: string) => void;
}

const getOutcomeIcon = (outcome: TradeGateOutcomeType) => {
  switch (outcome) {
    case 'green-light':
      return <Check size={14} aria-hidden="true" />;
    case 'no-trade':
      return <X size={14} aria-hidden="true" />;
    case 'wait':
      return <ClockAlert size={14} aria-hidden="true" />;
  }
};

export function TradeGateFlowMap({
  workflow,
  questions,
  openNode,
}: TradeGateFlowMapProps) {
  const dragStateRef = useRef<TradeGateFlowDragState | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [viewState, setViewState] = useState<TradeGateFlowViewState>({
    scale: 1,
    pan: { x: 0, y: 0 },
  });
  const [isPanning, setIsPanning] = useState(false);
  const { scale, pan } = viewState;

  const startNode = getTradeGateNodeById(workflow, workflow.startNodeId);
  const layout = useMemo(
    () =>
      startNode
        ? buildTradeGateFlowLayout(workflow, questions, startNode)
        : null,
    [questions, startNode, workflow]
  );
  const layoutWidth = layout?.width ?? 0;
  const layoutHeight = layout?.height ?? 0;

  const unplacedNodes = useMemo(() => {
    const reachableNodeIds = getReachableTradeGateNodeIds(workflow, questions);
    const unplaced: Array<{
      node: TradeGateWorkflowNode;
      question: TradeGateQuestion;
    }> = [];
    for (const node of workflow.nodes) {
      const question = getTradeGateQuestionById(questions, node.questionId);
      if (question && !reachableNodeIds.has(node.id)) {
        unplaced.push({ node, question });
      }
    }
    return unplaced;
  }, [questions, workflow]);

  const hasMeasuredViewport = viewportSize.width > 0;

  
  
  
  const canvasHeight = useMemo(() => {
    if (!layoutWidth || !layoutHeight || !viewportSize.width) return null;
    const availableWidth = Math.max(
      viewportSize.width - TRADE_GATE_FLOW_VIEWPORT_PADDING * 2,
      1
    );
    const widthFitScale = Math.min(
      TRADE_GATE_FLOW_MAX_SCALE,
      Math.max(
        TRADE_GATE_FLOW_MIN_SCALE,
        Math.min(availableWidth / layoutWidth, 1)
      )
    );
    return Math.round(
      Math.min(
        TRADE_GATE_FLOW_CANVAS_MAX_HEIGHT,
        Math.max(
          TRADE_GATE_FLOW_CANVAS_MIN_HEIGHT,
          layoutHeight * widthFitScale + TRADE_GATE_FLOW_VIEWPORT_PADDING * 2
        )
      )
    );
  }, [layoutHeight, layoutWidth, viewportSize.width]);
  const fitFlowToView = useCallback(() => {
    if (!layoutWidth || !layoutHeight || !viewportSize.width) return;

    
    
    const viewportHeight = canvasHeight ?? viewportSize.height;
    const availableWidth = Math.max(
      viewportSize.width - TRADE_GATE_FLOW_VIEWPORT_PADDING * 2,
      1
    );
    const availableHeight = Math.max(
      viewportHeight - TRADE_GATE_FLOW_VIEWPORT_PADDING * 2,
      1
    );
    const nextScale = Math.min(
      TRADE_GATE_FLOW_MAX_SCALE,
      Math.max(
        TRADE_GATE_FLOW_MIN_SCALE,
        Math.min(
          availableWidth / layoutWidth,
          availableHeight / layoutHeight,
          1
        )
      )
    );

    setViewState({
      scale: nextScale,
      pan: {
        x: Math.max(
          TRADE_GATE_FLOW_VIEWPORT_PADDING / 2,
          (viewportSize.width - layoutWidth * nextScale) / 2
        ),
        y: Math.max(
          TRADE_GATE_FLOW_VIEWPORT_PADDING / 2,
          (viewportHeight - layoutHeight * nextScale) / 2
        ),
      },
    });
  }, [canvasHeight, layoutHeight, layoutWidth, viewportSize]);

  
  
  
  const observeCanvas = useCallback((canvas: HTMLDivElement | null) => {
    
    
    if (!canvas) return;

    const updateViewportSize = () => {
      setViewportSize({
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      });
    };
    updateViewportSize();

    const resizeObserver = new ResizeObserver(updateViewportSize);
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  
  
  
  
  const layoutKey = layout ? `${layoutWidth}:${layoutHeight}` : '';
  const autoFittedLayoutKeyRef = useRef('');
  useLayoutEffect(() => {
    if (
      !hasMeasuredViewport ||
      !layoutKey ||
      autoFittedLayoutKeyRef.current === layoutKey
    ) {
      return;
    }
    autoFittedLayoutKeyRef.current = layoutKey;
    fitFlowToView();
  }, [fitFlowToView, hasMeasuredViewport, layoutKey]);

  const zoomFlow = (direction: 'in' | 'out') => {
    const delta =
      direction === 'in'
        ? TRADE_GATE_FLOW_ZOOM_STEP
        : -TRADE_GATE_FLOW_ZOOM_STEP;
    const centerX = viewportSize.width / 2;
    const centerY = viewportSize.height / 2;

    setViewState((currentViewState) => {
      const nextScale = Math.min(
        TRADE_GATE_FLOW_MAX_SCALE,
        Math.max(TRADE_GATE_FLOW_MIN_SCALE, currentViewState.scale + delta)
      );
      if (nextScale === currentViewState.scale) return currentViewState;

      const ratio = nextScale / currentViewState.scale;
      return {
        scale: nextScale,
        pan: {
          x: centerX - (centerX - currentViewState.pan.x) * ratio,
          y: centerY - (centerY - currentViewState.pan.y) * ratio,
        },
      };
    });
  };

  const handleCanvasPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (event.button !== 0) return;
    if (event.target instanceof HTMLElement && event.target.closest('button')) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPan: pan,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPanning(true);
  };

  const handleCanvasPointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    setViewState((currentViewState) => ({
      ...currentViewState,
      pan: {
        x: dragState.startPan.x + event.clientX - dragState.startClientX,
        y: dragState.startPan.y + event.clientY - dragState.startClientY,
      },
    }));
  };

  const finishCanvasPan = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsPanning(false);
  };

  return (
    <div className="journalit-session-mode-trade-gate-flow-map">
      <div className="journalit-session-mode-trade-gate-flow-map__toolbar">
        <div className="journalit-session-mode-trade-gate-flow-canvas__controls">
          <Button size="sm" onClick={fitFlowToView}>
            {t('settings.session-mode.trade-gate.flow-fit')}
          </Button>
          <Button size="sm" onClick={() => zoomFlow('out')}>
            <Minus size={15} aria-hidden="true" />
          </Button>
          <span className="journalit-session-mode-trade-gate-flow-canvas__zoom">
            {Math.round(scale * 100)}%
          </span>
          <Button size="sm" onClick={() => zoomFlow('in')}>
            <Plus size={15} aria-hidden="true" />
          </Button>
        </div>
      </div>
      {!layout ? (
        <div className="setting-item-description">
          {workflow.nodes.length > 0
            ? t('settings.session-mode.trade-gate.no-start')
            : t('settings.session-mode.trade-gate.no-questions')}
        </div>
      ) : (
        <div
          ref={observeCanvas}
          className={`journalit-session-mode-trade-gate-flow-canvas${isPanning ? ' is-panning' : ''}`}
          style={cssVars({
            '--trade-gate-flow-canvas-height': `${canvasHeight ?? TRADE_GATE_FLOW_CANVAS_FALLBACK_HEIGHT}px`,
          })}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={finishCanvasPan}
          onPointerCancel={finishCanvasPan}
        >
          <TradeGateFlowStage
            layout={layout}
            scale={scale}
            pan={pan}
            openNode={openNode}
          />
          <div className="journalit-session-mode-trade-gate-flow-canvas__hint">
            {layout.truncated
              ? t('settings.session-mode.trade-gate.flow-truncated')
              : t('settings.session-mode.trade-gate.flow-click-hint')}
          </div>
        </div>
      )}
      {unplacedNodes.length > 0 && (
        <div className="journalit-trade-gate-unplaced">
          <span className="journalit-trade-gate-unplaced__title">
            {t('settings.session-mode.trade-gate.unplaced-title')}
          </span>
          <div className="journalit-trade-gate-unplaced__list">
            {unplacedNodes.map(({ node, question }) => (
              <button
                key={node.id}
                type="button"
                className="journalit-trade-gate-unplaced__chip"
                onClick={() => openNode(node.id)}
              >
                {question.title ||
                  t('settings.session-mode.trade-gate.question')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TradeGateFlowStage({
  layout,
  scale,
  pan,
  openNode,
}: {
  layout: ReturnType<typeof buildTradeGateFlowLayout>;
  scale: number;
  pan: TradeGateFlowPanState;
  openNode: (nodeId: string, focusOptionId?: string) => void;
}) {
  return (
    <div
      className="journalit-session-mode-trade-gate-flow-stage"
      style={cssVars({
        '--trade-gate-flow-width': `${layout.width}px`,
        '--trade-gate-flow-height': `${layout.height}px`,
        '--trade-gate-flow-scale': scale,
        '--trade-gate-flow-pan-x': `${pan.x}px`,
        '--trade-gate-flow-pan-y': `${pan.y}px`,
      })}
    >
      <svg
        className="journalit-session-mode-trade-gate-flow-svg"
        width={layout.width}
        height={layout.height}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="img"
        aria-label={t('settings.session-mode.trade-gate.flow-map')}
      >
        {layout.edges.map((edge) => (
          <TradeGateFlowEdge key={edge.id} edge={edge} />
        ))}
      </svg>
      {layout.edges.map((edge) =>
        edge.wired ? (
          <button
            key={`${edge.id}-label`}
            type="button"
            className="journalit-session-mode-trade-gate-flow-edge-label-button"
            onClick={() => openNode(edge.sourceNodeId, edge.sourceOptionId)}
            style={cssVars({
              '--trade-gate-flow-edge-label-left': `${edge.labelX}px`,
              '--trade-gate-flow-edge-label-top': `${edge.labelY}px`,
            })}
          >
            {truncateTradeGateFlowLabel(edge.label, 18)}
          </button>
        ) : null
      )}
      {layout.nodes.map((layoutNode) => (
        <TradeGateFlowNodeButton
          key={layoutNode.occurrenceId}
          layoutNode={layoutNode}
          openNode={openNode}
        />
      ))}
    </div>
  );
}

function TradeGateFlowEdge({ edge }: { edge: TradeGateFlowLayoutEdge }) {
  const midY = edge.sourceY + (edge.targetY - edge.sourceY) * 0.52;
  const path = `M ${edge.sourceX} ${edge.sourceY} C ${edge.sourceX} ${midY}, ${edge.targetX} ${midY}, ${edge.targetX} ${edge.targetY}`;

  return (
    <g
      className={`journalit-session-mode-trade-gate-flow-edge${edge.wired ? '' : ' is-unwired'}`}
    >
      <path d={path} />
    </g>
  );
}

function TradeGateFlowNodeButton({
  layoutNode,
  openNode,
}: {
  layoutNode: TradeGateFlowLayoutNode;
  openNode: (nodeId: string, focusOptionId?: string) => void;
}) {
  if (layoutNode.kind === 'question') {
    const { question } = layoutNode;
    return (
      <button
        type="button"
        className="journalit-session-mode-trade-gate-flow-svg-node is-question"
        onClick={() => openNode(layoutNode.nodeId)}
        style={cssVars({
          '--trade-gate-flow-node-left': `${layoutNode.x}px`,
          '--trade-gate-flow-node-top': `${layoutNode.y}px`,
        })}
      >
        <span className="journalit-session-mode-trade-gate-flow-svg-node__content">
          <span className="journalit-session-mode-trade-gate-flow-svg-node__title">
            {truncateTradeGateFlowLabel(
              question.title || t('settings.session-mode.trade-gate.question'),
              18
            )}
          </span>
          {question.prompt && (
            <span className="journalit-session-mode-trade-gate-flow-svg-node__detail">
              {question.prompt}
            </span>
          )}
        </span>
      </button>
    );
  }

  if (layoutNode.kind === 'outcome') {
    return (
      <button
        type="button"
        className={`journalit-trade-gate-flow-outcome is-${layoutNode.outcome}`}
        onClick={() =>
          openNode(layoutNode.sourceNodeId, layoutNode.sourceOptionId)
        }
        style={cssVars({
          '--trade-gate-flow-node-left': `${layoutNode.x}px`,
          '--trade-gate-flow-node-top': `${layoutNode.y}px`,
        })}
      >
        {getOutcomeIcon(layoutNode.outcome)}
        <span>{getDefaultOutcomeTitle(layoutNode.outcome)}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="journalit-trade-gate-flow-unwired"
      onClick={() =>
        openNode(layoutNode.sourceNodeId, layoutNode.sourceOptionId)
      }
      style={cssVars({
        '--trade-gate-flow-node-left': `${layoutNode.x}px`,
        '--trade-gate-flow-node-top': `${layoutNode.y}px`,
      })}
    >
      <span className="journalit-trade-gate-flow-unwired__label">
        {truncateTradeGateFlowLabel(
          layoutNode.optionLabel ||
            t('settings.session-mode.trade-gate.option'),
          14
        )}
      </span>
      <span className="journalit-trade-gate-flow-unwired__hint">
        {t('settings.session-mode.trade-gate.not-wired-hint')}
      </span>
    </button>
  );
}
