import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import type {
  ResolvedSessionModeWindow,
  TradeGateRun,
  TradeGateWorkflow,
} from '../../types/sessionMode';
import {
  advanceTradeGateRun,
  completeTradeGateRun,
  createTradeGateRun,
  getActiveTradeGateRunFromFile,
  getTradeGateRunsFromFile,
  getTradeGateOutcomeNode,
  hasRunnableTradeGateQuestion,
  persistActiveTradeGateRun,
} from './tradeGateUtils';
import { TradeGateRunView } from './TradeGateRunView';
import { TradeGateLauncher } from './TradeGateLauncher';

interface TradeGatePanelProps {
  plugin: JournalitPlugin;
  filePath: string;
  currentSession?: ResolvedSessionModeWindow;
  onRefresh: () => void;
}

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
    return hasRunnableTradeGateQuestion(workflow, run.currentNodeId);
  }

  if (run.status === 'completed') {
    return Boolean(getTradeGateOutcomeNode(workflow, run.currentNodeId));
  }

  return true;
};

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
        !hasRunnableTradeGateQuestion(
          selectedWorkflow,
          selectedWorkflow.startNodeId
        )
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
        if (!hasRunnableTradeGateQuestion(workflow, workflow.startNodeId)) {
          return;
        }
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
        const nextRun = advanceTradeGateRun({
          workflow: selectedWorkflow,
          run: activeRun,
          optionId,
        });
        if (!nextRun) return;

        setPanelState((current) => ({ ...current, activeRun: nextRun }));
        if (nextRun.status === 'completed') {
          await completeTradeGateRun({ plugin, filePath, run: nextRun });
          onRefresh();
          return;
        }
        await persistActiveTradeGateRun({ plugin, filePath, run: nextRun });
        onRefresh();
      },
      [activeRun, filePath, onRefresh, plugin, selectedWorkflow]
    );

    if (workflows.length === 0) {
      return null;
    }

    return (
      <section className="journalit-trade-gate-panel">
        <TradeGateLauncher
          controlRef={workflowPickerRef}
          workflowName={selectedWorkflow?.name ?? ''}
          run={activeRun}
          onStart={() => void startRun()}
          disabled={Boolean(
            activeRun &&
            (activeRun.status === 'completed' || activeRun.answers.length > 0)
          )}
          isOpen={isWorkflowPickerOpen}
          onToggle={() => setIsWorkflowPickerOpen((current) => !current)}
          menu={
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
          }
        />

        {activeRun && selectedWorkflow && (
          <TradeGateRunView
            workflow={selectedWorkflow}
            run={activeRun}
            copySource="run-snapshot"
            onSelectOption={(optionId) => void selectOption(optionId)}
            onRestart={() => void startRun()}
          />
        )}
      </section>
    );
  }
);

TradeGatePanel.displayName = 'TradeGatePanel';
