

import type { App } from 'obsidian';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { showConfirmationModal } from '../../../../components/shared/ConfirmationModal';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Play,
  Plus,
  Trash2,
} from '../../../../components/shared/icons/ObsidianIcon';
import { Button } from '../../../../components/ui/Button';
import { NoTooltipButton } from '../../../../components/ui/NoTooltipButton';
import { TradeGateSimulator } from '../../../../components/sessionMode/TradeGateSimulator';
import { t } from '../../../../lang/helpers';
import type {
  TradeGateQuestion,
  TradeGateWorkflow,
} from '../../../../types/sessionMode';
import { openExternalUrl } from '../../../../utils/externalLinks';
import { generateUUID } from '../../../../utils/uuid';
import { TradeGateFlowMap } from './TradeGateFlowMap';
import { openTradeGateLibraryModal } from './TradeGateLibraryModal';
import { openTradeGateQuestionModal } from './TradeGateQuestionModal';
import {
  addNodeToTradeGateWorkflow,
  applyTradeGateQuestionEdit,
  createEmptyTradeGateWorkflow,
  createStarterTradeGateWorkflow,
  createTradeGateWorkflowNode,
  deleteTradeGateQuestionFromLibrary,
  duplicateTradeGateQuestion,
  getTradeGateNodeById,
  getTradeGateQuestionById,
  getTradeGateQuestionUsage,
  type TradeGateEditContext,
  type TradeGateQuestionEdit,
} from './tradeGateEditorUtils';

interface TradeGateSectionProps {
  app: App;
  questions: TradeGateQuestion[];
  workflows: TradeGateWorkflow[];
  
  getLatestTradeGate: () => {
    questions: TradeGateQuestion[];
    workflows: TradeGateWorkflow[];
  };
  persistTradeGate: (
    questions: TradeGateQuestion[],
    workflows: TradeGateWorkflow[]
  ) => Promise<void>;
}

interface TradeGateSectionActionsParams {
  app: App;
  getLatestTradeGate: TradeGateSectionProps['getLatestTradeGate'];
  persistTradeGate: TradeGateSectionProps['persistTradeGate'];
  expandedWorkflowId: string | null;
  setExpandedWorkflowId: React.Dispatch<React.SetStateAction<string | null>>;
}


function createTradeGateSectionActions({
  app,
  getLatestTradeGate,
  persistTradeGate,
  expandedWorkflowId,
  setExpandedWorkflowId,
}: TradeGateSectionActionsParams) {
  const applyQuestionModalResult = async (
    context: TradeGateEditContext | null,
    edit: TradeGateQuestionEdit
  ) => {
    const latest = getLatestTradeGate();
    const next = applyTradeGateQuestionEdit(
      latest.questions,
      latest.workflows,
      context,
      edit
    );
    await persistTradeGate(next.questions, next.workflows);
  };

  
  const openNodeEditor = (
    workflowId: string,
    nodeId: string,
    focusOptionId?: string
  ) => {
    const { questions: latestQuestions, workflows: latestWorkflows } =
      getLatestTradeGate();
    const workflow = latestWorkflows.find(
      (candidate) => candidate.id === workflowId
    );
    const node = workflow ? getTradeGateNodeById(workflow, nodeId) : null;
    if (!workflow || !node) return;
    openTradeGateQuestionModal({
      app,
      question: getTradeGateQuestionById(latestQuestions, node.questionId),
      questions: latestQuestions,
      workflows: latestWorkflows,
      workflow,
      nodeId,
      ...(focusOptionId ? { focusOptionId } : {}),
      onSave: (result) => {
        void applyQuestionModalResult({ workflowId, nodeId }, result);
      },
    });
  };

  
  const openLibraryQuestionEditor = (questionId: string | null) => {
    const { questions: latestQuestions, workflows: latestWorkflows } =
      getLatestTradeGate();
    openTradeGateQuestionModal({
      app,
      question: questionId
        ? getTradeGateQuestionById(latestQuestions, questionId)
        : null,
      questions: latestQuestions,
      workflows: latestWorkflows,
      onSave: (result) => {
        void applyQuestionModalResult(null, result);
      },
    });
  };

  const deleteQuestionFromLibrary = async (questionId: string) => {
    const { questions: latestQuestions, workflows: latestWorkflows } =
      getLatestTradeGate();
    const question = getTradeGateQuestionById(latestQuestions, questionId);
    if (!question) return;
    const usage = getTradeGateQuestionUsage(latestWorkflows, questionId);
    const confirmed = await showConfirmationModal(app, {
      title: t('settings.session-mode.trade-gate.delete-question.title'),
      message:
        usage.length > 0
          ? t('settings.session-mode.trade-gate.delete-question.message-used', {
              name:
                question.title ||
                t('settings.session-mode.trade-gate.question'),
              workflows: usage
                .map(
                  (workflow) =>
                    workflow.name ||
                    t('settings.session-mode.trade-gate.untitled')
                )
                .join(', '),
            })
          : t('settings.session-mode.trade-gate.delete-question.message', {
              name:
                question.title ||
                t('settings.session-mode.trade-gate.question'),
            }),
      confirmLabel: t(
        'settings.session-mode.trade-gate.delete-question.confirm'
      ),
      cancelLabel: t('button.cancel'),
      destructive: true,
    });
    if (!confirmed) return;
    const latest = getLatestTradeGate();
    const next = deleteTradeGateQuestionFromLibrary(
      latest.questions,
      latest.workflows,
      questionId
    );
    await persistTradeGate(next.questions, next.workflows);
  };

  const openLibrary = () => {
    openTradeGateLibraryModal({
      app,
      mode: 'manage',
      getState: getLatestTradeGate,
      onCreateQuestion: () => openLibraryQuestionEditor(null),
      onEditQuestion: (questionId) => openLibraryQuestionEditor(questionId),
      onDeleteQuestion: (questionId) => {
        void deleteQuestionFromLibrary(questionId);
      },
    });
  };

  
  const addQuestionToWorkflow = async (
    workflowId: string,
    questionId: string
  ) => {
    const latest = getLatestTradeGate();
    const workflow = latest.workflows.find(
      (candidate) => candidate.id === workflowId
    );
    const source = getTradeGateQuestionById(latest.questions, questionId);
    if (!workflow || !source) return;

    let nextQuestions = latest.questions;
    let placedQuestionId = questionId;
    if (workflow.nodes.some((node) => node.questionId === questionId)) {
      const duplicate = duplicateTradeGateQuestion(source);
      nextQuestions = [...latest.questions, duplicate];
      placedQuestionId = duplicate.id;
    }

    const node = createTradeGateWorkflowNode(placedQuestionId);
    const nextWorkflows = latest.workflows.map((candidate) =>
      candidate.id === workflowId
        ? addNodeToTradeGateWorkflow(candidate, node)
        : candidate
    );
    await persistTradeGate(nextQuestions, nextWorkflows);
  };

  
  const createQuestionInWorkflow = (workflowId: string) => {
    const { questions: latestQuestions, workflows: latestWorkflows } =
      getLatestTradeGate();
    const workflow = latestWorkflows.find(
      (candidate) => candidate.id === workflowId
    );
    if (!workflow) return;
    const pendingNodeId = generateUUID();
    openTradeGateQuestionModal({
      app,
      question: null,
      questions: latestQuestions,
      workflows: latestWorkflows,
      workflow,
      nodeId: pendingNodeId,
      onSave: (result) => {
        void applyQuestionModalResult(
          { workflowId, nodeId: pendingNodeId },
          {
            ...result,
            
            
            createdNodes: [
              { id: pendingNodeId, questionId: result.question.id },
              ...result.createdNodes,
            ],
          }
        );
      },
    });
  };

  const openQuestionPicker = (workflowId: string) => {
    openTradeGateLibraryModal({
      app,
      mode: 'pick',
      workflowId,
      getState: getLatestTradeGate,
      onCreateQuestion: () => {
        createQuestionInWorkflow(workflowId);
      },
      onEditQuestion: (questionId) => openLibraryQuestionEditor(questionId),
      onPickQuestion: (questionId) => {
        void addQuestionToWorkflow(workflowId, questionId);
      },
    });
  };

  
  const addWorkflow = async () => {
    const latest = getLatestTradeGate();
    if (latest.workflows.length === 0) {
      const seed = createStarterTradeGateWorkflow(latest.questions);
      await persistTradeGate(
        [...latest.questions, ...seed.newQuestions],
        [seed.workflow]
      );
      setExpandedWorkflowId(seed.workflow.id);
      return;
    }
    const workflow = createEmptyTradeGateWorkflow();
    await persistTradeGate(latest.questions, [...latest.workflows, workflow]);
    setExpandedWorkflowId(workflow.id);
  };

  const removeWorkflow = async (workflowId: string) => {
    const workflow = getLatestTradeGate().workflows.find(
      (candidate) => candidate.id === workflowId
    );
    if (!workflow) return;
    const confirmed = await showConfirmationModal(app, {
      title: t('settings.session-mode.trade-gate.delete-workflow.title'),
      message: t('settings.session-mode.trade-gate.delete-workflow.message', {
        name: workflow.name || t('settings.session-mode.trade-gate.untitled'),
      }),
      confirmLabel: t(
        'settings.session-mode.trade-gate.delete-workflow.confirm'
      ),
      cancelLabel: t('button.cancel'),
      destructive: true,
    });
    if (!confirmed) return;
    if (expandedWorkflowId === workflowId) setExpandedWorkflowId(null);
    const latest = getLatestTradeGate();
    await persistTradeGate(
      latest.questions,
      latest.workflows.filter((candidate) => candidate.id !== workflowId)
    );
  };

  const updateWorkflow = async (
    workflowId: string,
    updates: Partial<TradeGateWorkflow>
  ) => {
    const latest = getLatestTradeGate();
    await persistTradeGate(
      latest.questions,
      latest.workflows.map((workflow) =>
        workflow.id === workflowId ? { ...workflow, ...updates } : workflow
      )
    );
  };

  return {
    openLibrary,
    openNodeEditor,
    openQuestionPicker,
    addWorkflow,
    removeWorkflow,
    updateWorkflow,
  };
}

export function TradeGateSection({
  app,
  questions,
  workflows,
  getLatestTradeGate,
  persistTradeGate,
}: TradeGateSectionProps) {
  const [expandedWorkflowId, setExpandedWorkflowId] = useState<string | null>(
    null
  );
  const {
    openLibrary,
    openNodeEditor,
    openQuestionPicker,
    addWorkflow,
    removeWorkflow,
    updateWorkflow,
  } = createTradeGateSectionActions({
    app,
    getLatestTradeGate,
    persistTradeGate,
    expandedWorkflowId,
    setExpandedWorkflowId,
  });

  return (
    <>
      <div className="setting-item setting-item-heading journalit-session-mode-trade-gate-heading">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.session-mode.trade-gate.title')}
          </div>
          <div className="setting-item-description">
            {t('settings.session-mode.trade-gate.desc')}{' '}
            <button
              type="button"
              className="journalit-session-mode-trade-gate-learn-more"
              onClick={() =>
                openExternalUrl('https://journalit.co/docs/session-mode')
              }
            >
              {t('button.learn-more')}
            </button>
          </div>
        </div>
        <div className="setting-item-control">
          <Button size="sm" onClick={openLibrary}>
            <BookOpen size={15} aria-hidden="true" />
            {t('settings.session-mode.trade-gate.library-title')}
          </Button>
          <Button size="sm" onClick={() => void addWorkflow()}>
            <Plus size={15} aria-hidden="true" />
            {t('button.add')}
          </Button>
        </div>
      </div>

      {workflows.length > 0 && (
        <div className="journalit-session-mode-trade-gate-list">
          {workflows.map((workflow) => (
            <TradeGateWorkflowEditor
              key={workflow.id}
              workflow={workflow}
              questions={questions}
              isExpanded={expandedWorkflowId === workflow.id}
              setExpanded={() =>
                setExpandedWorkflowId((current) =>
                  current === workflow.id ? null : workflow.id
                )
              }
              openNode={(nodeId, focusOptionId) =>
                openNodeEditor(workflow.id, nodeId, focusOptionId)
              }
              openQuestionPicker={() => openQuestionPicker(workflow.id)}
              updateWorkflow={(updates) => updateWorkflow(workflow.id, updates)}
              removeWorkflow={() => removeWorkflow(workflow.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}

interface TradeGateWorkflowEditorProps {
  workflow: TradeGateWorkflow;
  questions: TradeGateQuestion[];
  isExpanded: boolean;
  setExpanded: () => void;
  openNode: (nodeId: string, focusOptionId?: string) => void;
  openQuestionPicker: () => void;
  updateWorkflow: (updates: Partial<TradeGateWorkflow>) => Promise<void>;
  removeWorkflow: () => Promise<void>;
}

function TradeGateWorkflowEditor({
  workflow,
  questions,
  isExpanded,
  setExpanded,
  openNode,
  openQuestionPicker,
  updateWorkflow,
  removeWorkflow,
}: TradeGateWorkflowEditorProps) {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const questionsById = new Map(
    questions.map((question) => [question.id, question])
  );
  
  
  const questionPlacementCounts = new Map<string, number>();
  for (const node of workflow.nodes) {
    questionPlacementCounts.set(
      node.questionId,
      (questionPlacementCounts.get(node.questionId) ?? 0) + 1
    );
  }
  const seenPlacements = new Map<string, number>();
  const startChoices: Array<{ nodeId: string; title: string }> = [];
  for (const node of workflow.nodes) {
    const question = questionsById.get(node.questionId);
    if (!question) continue;
    const occurrence = (seenPlacements.get(node.questionId) ?? 0) + 1;
    seenPlacements.set(node.questionId, occurrence);
    const isDuplicated =
      (questionPlacementCounts.get(node.questionId) ?? 0) > 1;
    const baseTitle =
      question.title || t('settings.session-mode.trade-gate.question');
    startChoices.push({
      nodeId: node.id,
      title: isDuplicated ? `${baseTitle} (${occurrence})` : baseTitle,
    });
  }
  const simulationRegionId = `journalit-trade-gate-simulator-${workflow.id}`;

  return (
    <div
      className={`journalit-session-mode-trade-gate-workflow${isExpanded ? ' is-expanded' : ''}`}
      data-journalit-guide-target={
        isExpanded ? 'session-mode.trade-gate-editor' : undefined
      }
    >
      <div className="journalit-session-mode-trade-gate-row">
        <button
          type="button"
          className="journalit-session-mode-trade-gate-expand"
          onClick={setExpanded}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <ChevronDown size={16} aria-hidden="true" />
          ) : (
            <ChevronRight size={16} aria-hidden="true" />
          )}
          <span className="journalit-session-mode-trade-gate-expand__name">
            {workflow.name || t('settings.session-mode.trade-gate.untitled')}
          </span>
          <span className="journalit-session-mode-trade-gate-expand__summary">
            {t('settings.session-mode.trade-gate.question-count', {
              count: String(workflow.nodes.length),
            })}
          </span>
        </button>
        {isExpanded && (
          <>
            <Button
              size="sm"
              className={`journalit-session-mode-trade-gate-simulate-button${isSimulatorOpen ? ' is-active' : ''}`}
              aria-label={t('settings.session-mode.trade-gate.simulation.show')}
              aria-controls={simulationRegionId}
              aria-expanded={isSimulatorOpen}
              onClick={() => setIsSimulatorOpen((current) => !current)}
            >
              <Play size={15} aria-hidden="true" />
            </Button>
            <Button size="sm" onClick={openQuestionPicker}>
              <Plus size={15} aria-hidden="true" />
              {t('settings.session-mode.trade-gate.add-question')}
            </Button>
          </>
        )}
        <NoTooltipButton
          label={t('button.delete')}
          className="journalit-session-mode-delete-window-button"
          onClick={() => void removeWorkflow()}
        >
          <Trash2 size={24} aria-hidden="true" />
        </NoTooltipButton>
      </div>

      {isExpanded && (
        <div className="journalit-session-mode-trade-gate-editor">
          <div className="journalit-session-mode-trade-gate-editor-grid">
            <label className="journalit-session-mode-trade-gate-field">
              <span className="setting-item-description">
                {t('settings.session-mode.trade-gate.name')}
              </span>
              <TradeGateWorkflowNameInput
                workflow={workflow}
                updateWorkflow={updateWorkflow}
              />
            </label>
            <label className="journalit-session-mode-trade-gate-field">
              <span className="setting-item-description">
                {t('settings.session-mode.trade-gate.start-node')}
              </span>
              <select
                value={workflow.startNodeId}
                onChange={(event) =>
                  void updateWorkflow({ startNodeId: event.target.value })
                }
                className="dropdown journalit-settings-input"
              >
                {workflow.startNodeId === '' && (
                  <option value="">
                    {t('settings.session-mode.trade-gate.not-wired')}
                  </option>
                )}
                {startChoices.map((choice) => (
                  <option key={choice.nodeId} value={choice.nodeId}>
                    {choice.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {isSimulatorOpen && (
            <TradeGateSimulator
              id={simulationRegionId}
              questions={questions}
              workflow={workflow}
            />
          )}

          <TradeGateFlowMap
            workflow={workflow}
            questions={questions}
            openNode={openNode}
          />
        </div>
      )}
    </div>
  );
}

function TradeGateWorkflowNameInput({
  workflow,
  updateWorkflow,
}: {
  workflow: TradeGateWorkflow;
  updateWorkflow: (updates: Partial<TradeGateWorkflow>) => Promise<void>;
}) {
  const pendingNameRef = useRef<string | null>(null);
  const persistTimerRef = useRef<number | null>(null);
  const updateWorkflowRef = useRef(updateWorkflow);
  useLayoutEffect(() => {
    updateWorkflowRef.current = updateWorkflow;
  }, [updateWorkflow]);

  useEffect(
    () => () => {
      if (persistTimerRef.current !== null) {
        window.clearTimeout(persistTimerRef.current);
      }
      if (pendingNameRef.current !== null) {
        void updateWorkflowRef.current({ name: pendingNameRef.current });
      }
    },
    []
  );

  const updateName = (name: string) => {
    pendingNameRef.current = name;
    if (persistTimerRef.current !== null) {
      window.clearTimeout(persistTimerRef.current);
    }
    persistTimerRef.current = window.setTimeout(() => {
      pendingNameRef.current = null;
      persistTimerRef.current = null;
      void updateWorkflowRef.current({ name });
    }, 350);
  };

  return (
    <input
      type="text"
      defaultValue={workflow.name}
      placeholder={t('settings.session-mode.trade-gate.name')}
      onChange={(event) => updateName(event.target.value)}
      className="setting-input journalit-settings-input journalit-session-mode-trade-gate-workflow-name-input"
      aria-label={t('settings.session-mode.trade-gate.name')}
    />
  );
}
