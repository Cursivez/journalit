import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type JournalitPlugin from '../../main';
import {
  Check,
  ChevronDown,
  ClockAlert,
  Circle,
  Play,
  RefreshCw,
  X,
} from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import type {
  ResolvedSessionModeWindow,
  TradeGateOption,
  TradeGateOutcomeType,
  TradeGateRun,
  TradeGateWorkflow,
} from '../../types/sessionMode';
import {
  completeTradeGateRun,
  createTradeGateRun,
  getActiveTradeGateRunFromFile,
  getTradeGateRunsFromFile,
  getTradeGateOutcomeNode,
  getTradeGateQuestionNode,
  persistActiveTradeGateRun,
} from './tradeGateUtils';

interface TradeGatePanelProps {
  plugin: JournalitPlugin;
  filePath: string;
  currentSession?: ResolvedSessionModeWindow;
  onRefresh: () => void;
}

const getOutcomeIcon = (outcome: TradeGateOutcomeType | undefined) => {
  switch (outcome) {
    case 'green-light':
      return <Check size={22} />;
    case 'no-trade':
      return <X size={22} />;
    case 'wait':
      return <ClockAlert size={26} />;
    default:
      return <Circle size={22} />;
  }
};

interface TradeGatePanelState {
  selectedWorkflowId: string;
  activeRun: TradeGateRun | null;
}

const isPersistedRunBehindLocalState = (
  localRun: TradeGateRun,
  persistedRun: TradeGateRun
): boolean => {
  if (localRun.id !== persistedRun.id) return true;
  if (localRun.status === 'completed' && persistedRun.status !== 'completed') {
    return true;
  }
  if (localRun.answers.length > persistedRun.answers.length) return true;
  return (
    localRun.currentNodeId !== persistedRun.currentNodeId &&
    localRun.answers.length >= persistedRun.answers.length
  );
};

const isRunOutsideSession = (
  run: TradeGateRun,
  currentSession: ResolvedSessionModeWindow | undefined
): boolean => {
  if (!currentSession) return false;
  const startedAt = new Date(run.startedAt);
  const startedAtMs = startedAt.getTime();
  return (
    Number.isNaN(startedAtMs) ||
    startedAtMs < currentSession.start.getTime() ||
    startedAtMs >= currentSession.end.getTime()
  );
};

const isTradeGateRunCompatibleWithWorkflows = (
  run: TradeGateRun,
  workflows: TradeGateWorkflow[]
): boolean => {
  const workflow = workflows.find((item) => item.id === run.workflowId);
  if (!workflow) return false;

  if (run.status === 'in-progress') {
    return hasRunnableQuestion(workflow, run.currentNodeId);
  }

  if (run.status === 'completed') {
    return Boolean(getTradeGateOutcomeNode(workflow, run.currentNodeId));
  }

  return true;
};

const hasRunnableQuestion = (
  workflow: TradeGateWorkflow,
  nodeId: string | undefined,
  visitedNodeIds = new Set<string>()
): boolean => {
  const question = getTradeGateQuestionNode(workflow, nodeId);
  if (!question) return false;
  if (visitedNodeIds.has(question.id)) return false;

  const nextVisitedNodeIds = new Set(visitedNodeIds);
  nextVisitedNodeIds.add(question.id);

  return (
    getRunnableOptions(workflow, question.options, nextVisitedNodeIds).length >
    0
  );
};

const isRunnableTarget = (
  workflow: TradeGateWorkflow,
  targetNodeId: string,
  visitedNodeIds: Set<string>
): boolean => {
  if (getTradeGateOutcomeNode(workflow, targetNodeId)) return true;
  return hasRunnableQuestion(workflow, targetNodeId, visitedNodeIds);
};

const getRunnableOptions = (
  workflow: TradeGateWorkflow,
  options: TradeGateOption[],
  visitedNodeIds = new Set<string>()
): TradeGateOption[] =>
  options.filter((option) => {
    if (!option.id || !option.label || !option.targetNodeId) return false;
    return isRunnableTarget(workflow, option.targetNodeId, visitedNodeIds);
  });

export const TradeGatePanel: React.FC<TradeGatePanelProps> = React.memo(
  ({ plugin, filePath, currentSession, onRefresh }) => {
    const workflows = plugin.settings.sessionMode.tradeGateWorkflows;
    const workflowPickerRef = useRef<HTMLDivElement>(null);
    const syncedFilePathRef = useRef(filePath);
    const [isWorkflowPickerOpen, setIsWorkflowPickerOpen] = useState(false);
    const [panelState, setPanelState] = useState<TradeGatePanelState>({
      selectedWorkflowId: workflows[0]?.id ?? '',
      activeRun: null,
    });
    const { selectedWorkflowId, activeRun } = panelState;
    const selectedWorkflow = useMemo(
      () =>
        workflows.find((workflow) => workflow.id === selectedWorkflowId) ??
        workflows[0] ??
        null,
      [selectedWorkflowId, workflows]
    );
    useEffect(() => {
      const ownerDocument =
        workflowPickerRef.current?.ownerDocument ?? window.activeDocument;
      const handlePointerDown = (event: PointerEvent) => {
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (!workflowPickerRef.current?.contains(target)) {
          setIsWorkflowPickerOpen(false);
        }
      };

      ownerDocument.addEventListener('pointerdown', handlePointerDown);
      return () =>
        ownerDocument.removeEventListener('pointerdown', handlePointerDown);
    }, []);

    useEffect(() => {
      const filePathChanged = syncedFilePathRef.current !== filePath;
      syncedFilePathRef.current = filePath;
      const persisted = getActiveTradeGateRunFromFile(plugin, filePath);
      const persistedIsStale = Boolean(
        persisted &&
        (isRunOutsideSession(persisted, currentSession) ||
          !isTradeGateRunCompatibleWithWorkflows(persisted, workflows))
      );
      const validPersisted = persistedIsStale ? null : persisted;
      if (persistedIsStale) {
        void persistActiveTradeGateRun({ plugin, filePath, run: null });
      }

      setPanelState((current) => {
        if (
          !filePathChanged &&
          current.activeRun &&
          !isRunOutsideSession(current.activeRun, currentSession) &&
          isTradeGateRunCompatibleWithWorkflows(current.activeRun, workflows) &&
          (!validPersisted ||
            isPersistedRunBehindLocalState(current.activeRun, validPersisted))
        ) {
          return current;
        }

        if (!validPersisted) {
          const completedRuns = getTradeGateRunsFromFile(
            plugin,
            filePath
          ).filter(
            (run) =>
              run.status === 'completed' &&
              !isRunOutsideSession(run, currentSession) &&
              isTradeGateRunCompatibleWithWorkflows(run, workflows)
          );
          const latestCompletedRun =
            completedRuns[completedRuns.length - 1] ?? null;
          if (latestCompletedRun) {
            return {
              activeRun: latestCompletedRun,
              selectedWorkflowId: latestCompletedRun.workflowId,
            };
          }

          const selectedStillExists = workflows.some(
            (workflow) => workflow.id === current.selectedWorkflowId
          );
          return {
            activeRun: null,
            selectedWorkflowId: selectedStillExists
              ? current.selectedWorkflowId
              : (workflows[0]?.id ?? ''),
          };
        }

        return {
          activeRun: validPersisted,
          selectedWorkflowId: validPersisted.workflowId,
        };
      });
    }, [currentSession, filePath, plugin, workflows]);

    const startRun = useCallback(async () => {
      if (!selectedWorkflow) return;
      if (
        !hasRunnableQuestion(selectedWorkflow, selectedWorkflow.startNodeId)
      ) {
        return;
      }
      const nextRun = createTradeGateRun(selectedWorkflow);
      setIsWorkflowPickerOpen(false);
      setPanelState((current) => ({ ...current, activeRun: nextRun }));
      await persistActiveTradeGateRun({ plugin, filePath, run: nextRun });
      onRefresh();
    }, [filePath, onRefresh, plugin, selectedWorkflow]);

    const changeWorkflow = useCallback(
      async (workflowId: string) => {
        const workflow = workflows.find((item) => item.id === workflowId);
        setIsWorkflowPickerOpen(false);
        setPanelState((current) => ({
          ...current,
          selectedWorkflowId: workflowId,
        }));
        if (!workflow) return;
        if (!hasRunnableQuestion(workflow, workflow.startNodeId)) return;
        if (
          activeRun?.status === 'in-progress' &&
          activeRun.answers.length === 0
        ) {
          const nextRun = createTradeGateRun(workflow);
          setPanelState({ selectedWorkflowId: workflowId, activeRun: nextRun });
          await persistActiveTradeGateRun({ plugin, filePath, run: nextRun });
          onRefresh();
        }
      },
      [activeRun, filePath, onRefresh, plugin, workflows]
    );

    const selectOption = useCallback(
      async (optionId: string) => {
        if (!selectedWorkflow || !activeRun) return;
        const currentNode = getTradeGateQuestionNode(
          selectedWorkflow,
          activeRun.currentNodeId
        );
        const option = currentNode?.options.find(
          (item) => item.id === optionId
        );
        if (!currentNode || !option) return;
        if (!getRunnableOptions(selectedWorkflow, [option]).length) return;

        const answer = {
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          prompt: currentNode.prompt,
          selectedOptionId: option.id,
          selectedOptionLabel: option.label,
          targetNodeId: option.targetNodeId,
          timestamp: new Date().toISOString(),
        };
        const targetOutcome = getTradeGateOutcomeNode(
          selectedWorkflow,
          option.targetNodeId
        );

        if (targetOutcome) {
          const completedRun: TradeGateRun = {
            ...activeRun,
            answers: [...activeRun.answers, answer],
            status: 'completed',
            completedAt: new Date().toISOString(),
            currentNodeId: targetOutcome.id,
            outcome: targetOutcome.outcome,
            outcomeTitle: targetOutcome.title,
            outcomeDescription: targetOutcome.description,
          };
          setPanelState((current) => ({ ...current, activeRun: completedRun }));
          await completeTradeGateRun({ plugin, filePath, run: completedRun });
          onRefresh();
          return;
        }

        const nextRun: TradeGateRun = {
          ...activeRun,
          answers: [...activeRun.answers, answer],
          currentNodeId: option.targetNodeId,
        };
        setPanelState((current) => ({ ...current, activeRun: nextRun }));
        await persistActiveTradeGateRun({ plugin, filePath, run: nextRun });
        onRefresh();
      },
      [activeRun, filePath, onRefresh, plugin, selectedWorkflow]
    );

    const currentQuestion = selectedWorkflow
      ? getTradeGateQuestionNode(selectedWorkflow, activeRun?.currentNodeId)
      : null;
    const runnableOptions = useMemo(
      () =>
        selectedWorkflow && currentQuestion
          ? getRunnableOptions(selectedWorkflow, currentQuestion.options)
          : [],
      [currentQuestion, selectedWorkflow]
    );

    if (workflows.length === 0) {
      return null;
    }

    return (
      <section className="journalit-trade-gate-panel">
        <div className="journalit-trade-gate-workflow-launcher">
          <div className="journalit-trade-gate-workflow-launcher__label">
            {t('trade-gate.workflow')}
          </div>
          <div
            ref={workflowPickerRef}
            className={`journalit-trade-gate-workflow-control${activeRun ? ' is-running' : ''}${isWorkflowPickerOpen ? ' is-open' : ''}`}
          >
            <button
              type="button"
              className="journalit-trade-gate-workflow-trigger"
              aria-haspopup="listbox"
              aria-expanded={isWorkflowPickerOpen}
              disabled={Boolean(
                activeRun &&
                (activeRun.status === 'completed' ||
                  activeRun.answers.length > 0)
              )}
              onClick={() => setIsWorkflowPickerOpen((current) => !current)}
            >
              <span>{selectedWorkflow?.name}</span>
              {(!activeRun || activeRun.answers.length === 0) &&
                activeRun?.status !== 'completed' && (
                  <ChevronDown
                    className={
                      isWorkflowPickerOpen
                        ? 'journalit-trade-gate-workflow-trigger__chevron is-open'
                        : 'journalit-trade-gate-workflow-trigger__chevron'
                    }
                    size={16}
                    aria-hidden="true"
                  />
                )}
            </button>
            {!activeRun && (
              <button
                type="button"
                className="journalit-trade-gate-start-button"
                onClick={() => void startRun()}
              >
                <Play size={17} aria-hidden="true" />
                <span>{t('trade-gate.action.start-short')}</span>
              </button>
            )}
            {isWorkflowPickerOpen && (
              <div
                className="journalit-home-period-menu journalit-trade-gate-workflow-menu"
                role="listbox"
                aria-label={t('trade-gate.workflow')}
              >
                {workflows.map((workflow) => (
                  <button
                    key={workflow.id}
                    type="button"
                    role="option"
                    aria-selected={workflow.id === selectedWorkflow?.id}
                    className={
                      workflow.id === selectedWorkflow?.id
                        ? 'journalit-home-period-option journalit-trade-gate-workflow-menu__option journalit-home-period-option--active is-selected'
                        : 'journalit-home-period-option journalit-trade-gate-workflow-menu__option'
                    }
                    onClick={() => void changeWorkflow(workflow.id)}
                  >
                    <span
                      className="journalit-home-period-option__check"
                      aria-hidden="true"
                    >
                      {workflow.id === selectedWorkflow?.id ? '✓' : ''}
                    </span>
                    <span className="journalit-home-period-option__label">
                      {workflow.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {activeRun && (
          <div className="journalit-trade-gate-accordion">
            {activeRun.answers.map((answer, index) => (
              <div
                className="journalit-trade-gate-step is-complete"
                key={answer.timestamp}
              >
                <div className="journalit-trade-gate-step__status">
                  <Check size={16} />
                </div>
                <div className="journalit-trade-gate-step__content">
                  <div className="journalit-trade-gate-step__title">
                    {answer.nodeTitle}
                  </div>
                  <div className="journalit-trade-gate-step__answer">
                    {answer.selectedOptionLabel}
                  </div>
                </div>
              </div>
            ))}

            {activeRun.status === 'in-progress' && currentQuestion && (
              <div className="journalit-trade-gate-step is-active">
                <div className="journalit-trade-gate-step__status">
                  {activeRun.answers.length + 1}
                </div>
                <div className="journalit-trade-gate-step__content">
                  <div className="journalit-trade-gate-step__title">
                    {currentQuestion.title}
                  </div>
                  <div className="journalit-trade-gate-step__prompt">
                    {currentQuestion.prompt}
                  </div>
                  <div className="journalit-trade-gate-options">
                    {runnableOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className="journalit-trade-gate-option"
                        onClick={() => void selectOption(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeRun.status === 'completed' && (
              <div
                className={`journalit-trade-gate-outcome is-${activeRun.outcome}`}
              >
                <div className="journalit-trade-gate-outcome__icon">
                  {getOutcomeIcon(activeRun.outcome)}
                </div>
                <div className="journalit-trade-gate-outcome__content">
                  <div className="journalit-trade-gate-outcome__title">
                    {activeRun.outcomeTitle}
                  </div>
                  {activeRun.outcomeDescription && (
                    <div className="journalit-trade-gate-outcome__description">
                      {activeRun.outcomeDescription}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="journalit-trade-gate-restart-button"
                  onClick={() => void startRun()}
                  aria-label={t('trade-gate.action.start-another')}
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    );
  }
);

TradeGatePanel.displayName = 'TradeGatePanel';
