

import { Modal } from 'obsidian';
import type { App } from 'obsidian';
import React, { useEffect, useRef, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { Button } from '../../../../components/ui/Button';
import { NoTooltipButton } from '../../../../components/ui/NoTooltipButton';
import { Plus, Trash2 } from '../../../../components/shared/icons/ObsidianIcon';
import {
  getDefaultOutcomeDescription,
  getDefaultOutcomeTitle,
} from '../../../../components/sessionMode/tradeGateUtils';
import { t } from '../../../../lang/helpers';
import type {
  TradeGateOutcomeType,
  TradeGateQuestion,
  TradeGateRouteTarget,
  TradeGateWorkflow,
  TradeGateWorkflowNode,
} from '../../../../types/sessionMode';
import { mergeClassNames } from '../../../../utils/classNames';
import { generateUUID } from '../../../../utils/uuid';
import {
  createTradeGateQuestionStub,
  createTradeGateWorkflowNode,
  duplicateTradeGateQuestion,
  getTradeGateNodeById,
  getTradeGateQuestionById,
  getTradeGateQuestionUsage,
  getTradeGateRouteTarget,
  type TradeGateQuestionEdit,
} from './tradeGateEditorUtils';

const TRADE_GATE_OUTCOME_TYPES: TradeGateOutcomeType[] = [
  'green-light',
  'no-trade',
  'wait',
];

interface TradeGateQuestionModalParams {
  app: App;
  
  question: TradeGateQuestion | null;
  questions: TradeGateQuestion[];
  workflows: TradeGateWorkflow[];
  
  workflow?: TradeGateWorkflow;
  
  nodeId?: string;
  focusOptionId?: string;
  onSave: (result: TradeGateQuestionEdit) => void;
}

type TargetSelectValue = string;


type OptionTargetDraft =
  | TradeGateRouteTarget
  | { kind: 'new-node'; questionId: string };

function encodeTarget(target: OptionTargetDraft | null): TargetSelectValue {
  if (!target) return '';
  switch (target.kind) {
    case 'node':
      return `node:${target.nodeId}`;
    case 'new-node':
      return `question:${target.questionId}`;
    case 'outcome':
      return `outcome:${target.outcome}`;
  }
}

function isOutcomeType(value: string): value is TradeGateOutcomeType {
  return value === 'green-light' || value === 'no-trade' || value === 'wait';
}

interface OptionDraft {
  id: string;
  label: string;
  target: OptionTargetDraft | null;
}


function resolveQuestionTargetSelection(params: {
  questionId: string;
  optionId: string;
  workflow: TradeGateWorkflow | undefined;
  optionDrafts: OptionDraft[];
  questions: TradeGateQuestion[];
  createdQuestions: TradeGateQuestion[];
}): { questionId: string; createdQuestion: TradeGateQuestion | null } {
  const alreadyPlaced =
    params.workflow?.nodes.some(
      (node) => node.questionId === params.questionId
    ) ?? false;
  const alreadyTargeted = params.optionDrafts.some(
    (draft) =>
      draft.id !== params.optionId &&
      draft.target?.kind === 'new-node' &&
      draft.target.questionId === params.questionId
  );
  if (alreadyPlaced || alreadyTargeted) {
    const source =
      getTradeGateQuestionById(params.questions, params.questionId) ??
      getTradeGateQuestionById(params.createdQuestions, params.questionId);
    if (source) {
      const duplicate = duplicateTradeGateQuestion(source);
      return { questionId: duplicate.id, createdQuestion: duplicate };
    }
  }
  return { questionId: params.questionId, createdQuestion: null };
}

const TradeGateQuestionModalContent: React.FC<{
  params: TradeGateQuestionModalParams;
  closeModal: () => void;
}> = ({ params, closeModal }) => {
  const isNewQuestion = params.question === null;
  const [question, setQuestion] = useState<TradeGateQuestion>(
    () => params.question ?? createTradeGateQuestionStub()
  );
  const [optionDrafts, setOptionDrafts] = useState<OptionDraft[]>(() =>
    (params.question?.options ?? []).map((option) => ({
      id: option.id,
      label: option.label,
      target:
        params.workflow && params.nodeId
          ? getTradeGateRouteTarget(params.workflow, params.nodeId, option.id)
          : null,
    }))
  );
  const [createdQuestions, setCreatedQuestions] = useState<TradeGateQuestion[]>(
    []
  );
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const focusOptionRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const target = params.focusOptionId
      ? focusOptionRef.current
      : titleInputRef.current;
    target?.focus({ preventScroll: false });
    if (params.focusOptionId) {
      focusOptionRef.current?.scrollIntoView({ block: 'center' });
    }
  }, [params.focusOptionId]);

  const usageCount = params.question
    ? getTradeGateQuestionUsage(params.workflows, params.question.id).length
    : 0;

  const updateOptionDraft = (
    optionId: string,
    updates: Partial<OptionDraft>
  ) => {
    setOptionDrafts((drafts) =>
      drafts.map((draft) =>
        draft.id === optionId ? { ...draft, ...updates } : draft
      )
    );
  };

  const addOption = () => {
    setOptionDrafts((drafts) => [
      ...drafts,
      { id: generateUUID(), label: '', target: null },
    ]);
  };

  const removeOption = (optionId: string) => {
    setOptionDrafts((drafts) =>
      drafts.filter((draft) => draft.id !== optionId)
    );
  };

  const changeTarget = (optionId: string, value: TargetSelectValue) => {
    if (value === 'new-question') {
      const stub = createTradeGateQuestionStub();
      setCreatedQuestions((created) => [...created, stub]);
      updateOptionDraft(optionId, {
        target: { kind: 'new-node', questionId: stub.id },
      });
      return;
    }
    if (value === '') {
      updateOptionDraft(optionId, { target: null });
      return;
    }
    if (value.startsWith('node:')) {
      updateOptionDraft(optionId, {
        target: { kind: 'node', nodeId: value.slice('node:'.length) },
      });
      return;
    }
    if (value.startsWith('question:')) {
      const resolved = resolveQuestionTargetSelection({
        questionId: value.slice('question:'.length),
        optionId,
        workflow: params.workflow,
        optionDrafts,
        questions: params.questions,
        createdQuestions,
      });
      if (resolved.createdQuestion) {
        const createdQuestion = resolved.createdQuestion;
        setCreatedQuestions((created) => [...created, createdQuestion]);
      }
      updateOptionDraft(optionId, {
        target: { kind: 'new-node', questionId: resolved.questionId },
      });
      return;
    }
    const outcome = value.slice('outcome:'.length);
    if (!isOutcomeType(outcome)) return;
    updateOptionDraft(optionId, {
      target: { kind: 'outcome', outcome },
    });
  };

  const changeOutcomeNote = (optionId: string, note: string) => {
    setOptionDrafts((drafts) =>
      drafts.map((draft) => {
        if (draft.id !== optionId || draft.target?.kind !== 'outcome') {
          return draft;
        }
        const trimmed = note.trim();
        return {
          ...draft,
          target: {
            kind: 'outcome',
            outcome: draft.target.outcome,
            ...(trimmed ? { note } : {}),
          },
        };
      })
    );
  };

  const submit = (removeFromWorkflow: boolean) => {
    const nextQuestion: TradeGateQuestion = {
      ...question,
      options: optionDrafts.map((draft) => ({
        id: draft.id,
        label: draft.label,
      })),
    };
    
    
    const createdNodes: TradeGateWorkflowNode[] = [];
    const referencedQuestionIds = new Set<string>();
    const optionTargets = optionDrafts.map((draft) => {
      const target = draft.target;
      if (target?.kind === 'new-node') {
        referencedQuestionIds.add(target.questionId);
        const node = createTradeGateWorkflowNode(target.questionId);
        createdNodes.push(node);
        return {
          optionId: draft.id,
          target: { kind: 'node' as const, nodeId: node.id },
        };
      }
      return { optionId: draft.id, target };
    });
    params.onSave({
      question: nextQuestion,
      createdQuestions: createdQuestions.filter((created) =>
        referencedQuestionIds.has(created.id)
      ),
      createdNodes,
      ...(params.workflow ? { optionTargets } : {}),
      ...(removeFromWorkflow ? { removeFromWorkflow: true } : {}),
    });
    closeModal();
  };

  
  const questionChoices = [...params.questions, ...createdQuestions];

  
  
  const currentNodeTargets = new Map<
    string,
    { nodeId: string; title: string }
  >();
  if (params.workflow && params.nodeId) {
    for (const option of params.question?.options ?? []) {
      const target = getTradeGateRouteTarget(
        params.workflow,
        params.nodeId,
        option.id
      );
      if (target?.kind !== 'node') continue;
      const targetNode = getTradeGateNodeById(params.workflow, target.nodeId);
      const targetQuestion = targetNode
        ? getTradeGateQuestionById(params.questions, targetNode.questionId)
        : null;
      currentNodeTargets.set(option.id, {
        nodeId: target.nodeId,
        title:
          targetQuestion?.title ||
          t('settings.session-mode.trade-gate.question'),
      });
    }
  }

  return (
    <div className="journalit-trade-gate-question-modal">
      <label className="journalit-trade-gate-question-modal__field">
        <span className="setting-item-description">
          {t('settings.session-mode.trade-gate.question-title')}
        </span>
        <input
          ref={titleInputRef}
          type="text"
          value={question.title}
          onChange={(event) =>
            setQuestion((current) => ({
              ...current,
              title: event.target.value,
            }))
          }
        />
      </label>
      <label className="journalit-trade-gate-question-modal__field">
        <span className="setting-item-description">
          {t('settings.session-mode.trade-gate.prompt')}
        </span>
        <textarea
          value={question.prompt}
          onChange={(event) =>
            setQuestion((current) => ({
              ...current,
              prompt: event.target.value,
            }))
          }
          className="journalit-trade-gate-question-modal__textarea"
          rows={2}
        />
      </label>

      <div className="journalit-trade-gate-question-modal__options-header">
        <span>{t('settings.session-mode.trade-gate.options')}</span>
        <Button size="sm" onClick={addOption}>
          <Plus size={15} aria-hidden="true" />
          {t('button.add')}
        </Button>
      </div>
      {optionDrafts.length === 0 && (
        <div className="setting-item-description">
          {t('settings.session-mode.trade-gate.no-options')}
        </div>
      )}
      <div className="journalit-trade-gate-question-modal__options">
        {optionDrafts.map((draft) => (
          <TradeGateOptionEditor
            key={draft.id}
            draft={draft}
            showRouting={Boolean(params.workflow)}
            focusRef={
              draft.id === params.focusOptionId ? focusOptionRef : undefined
            }
            questionChoices={questionChoices}
            currentNodeTarget={currentNodeTargets.get(draft.id)}
            updateOptionDraft={updateOptionDraft}
            removeOption={removeOption}
            changeTarget={changeTarget}
            changeOutcomeNote={changeOutcomeNote}
          />
        ))}
      </div>

      <div className="journalit-trade-gate-question-modal__footer">
        <div className="journalit-trade-gate-question-modal__footer-info">
          {!isNewQuestion && (
            <span className="setting-item-description">
              {usageCount > 0
                ? t('settings.session-mode.trade-gate.used-in-workflows', {
                    count: String(usageCount),
                  })
                : t('settings.session-mode.trade-gate.not-used')}
            </span>
          )}
          {params.workflow && !isNewQuestion && (
            <button
              type="button"
              className="journalit-trade-gate-question-modal__remove"
              onClick={() => submit(true)}
            >
              {t('settings.session-mode.trade-gate.remove-from-workflow')}
            </button>
          )}
        </div>
        <div className="journalit-trade-gate-question-modal__footer-actions">
          <Button onClick={closeModal}>{t('button.cancel')}</Button>
          <Button variant="primary" onClick={() => submit(false)}>
            {t('button.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface TradeGateOptionEditorProps {
  draft: OptionDraft;
  showRouting: boolean;
  focusRef: React.RefObject<HTMLInputElement | null> | undefined;
  questionChoices: TradeGateQuestion[];
  
  currentNodeTarget: { nodeId: string; title: string } | undefined;
  updateOptionDraft: (optionId: string, updates: Partial<OptionDraft>) => void;
  removeOption: (optionId: string) => void;
  changeTarget: (optionId: string, value: TargetSelectValue) => void;
  changeOutcomeNote: (optionId: string, note: string) => void;
}

function TradeGateOptionEditor({
  draft,
  showRouting,
  focusRef,
  questionChoices,
  currentNodeTarget,
  updateOptionDraft,
  removeOption,
  changeTarget,
  changeOutcomeNote,
}: TradeGateOptionEditorProps) {
  const optionRowClassName = mergeClassNames(
    'journalit-trade-gate-question-modal__option-row',
    showRouting
      ? ''
      : 'journalit-trade-gate-question-modal__option-row--no-routing'
  );

  return (
    <div className="journalit-trade-gate-question-modal__option">
      <div className={optionRowClassName}>
        <input
          ref={focusRef}
          type="text"
          value={draft.label}
          placeholder={t('settings.session-mode.trade-gate.option-label')}
          onChange={(event) =>
            updateOptionDraft(draft.id, { label: event.target.value })
          }
          aria-label={t('settings.session-mode.trade-gate.option-label')}
        />
        {showRouting && (
          <select
            value={encodeTarget(draft.target)}
            onChange={(event) => changeTarget(draft.id, event.target.value)}
            className="dropdown"
            aria-label={t('settings.session-mode.trade-gate.option-target')}
          >
            <option value="">
              {t('settings.session-mode.trade-gate.not-wired')}
            </option>
            {currentNodeTarget && (
              <option value={`node:${currentNodeTarget.nodeId}`}>
                {t('settings.session-mode.trade-gate.target-current', {
                  title: currentNodeTarget.title,
                })}
              </option>
            )}
            {questionChoices.length > 0 && (
              <optgroup
                label={t(
                  'settings.session-mode.trade-gate.target-group-questions'
                )}
              >
                {questionChoices.map((candidate) => (
                  <option key={candidate.id} value={`question:${candidate.id}`}>
                    {candidate.title ||
                      t('settings.session-mode.trade-gate.question')}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup
              label={t(
                'settings.session-mode.trade-gate.target-group-outcomes'
              )}
            >
              {TRADE_GATE_OUTCOME_TYPES.map((outcome) => (
                <option key={outcome} value={`outcome:${outcome}`}>
                  {getDefaultOutcomeTitle(outcome)}
                </option>
              ))}
            </optgroup>
            <option value="new-question">
              {t('settings.session-mode.trade-gate.new-question-target')}
            </option>
          </select>
        )}
        <NoTooltipButton
          label={t('button.delete')}
          className="journalit-session-mode-delete-window-button"
          onClick={() => removeOption(draft.id)}
        >
          <Trash2 size={20} aria-hidden="true" />
        </NoTooltipButton>
      </div>
      {showRouting && draft.target?.kind === 'outcome' && (
        <label className="journalit-trade-gate-question-modal__note">
          <span className="setting-item-description">
            {t('settings.session-mode.trade-gate.outcome-note')}
          </span>
          <textarea
            value={draft.target.note ?? ''}
            placeholder={getDefaultOutcomeDescription(draft.target.outcome)}
            onChange={(event) =>
              changeOutcomeNote(draft.id, event.target.value)
            }
            className="journalit-trade-gate-question-modal__textarea"
            rows={2}
          />
        </label>
      )}
    </div>
  );
}

class TradeGateQuestionModal extends Modal {
  private params: TradeGateQuestionModalParams;
  private root: Root | null = null;

  constructor(params: TradeGateQuestionModalParams) {
    super(params.app);
    this.params = params;
    this.titleEl.setText(
      params.question
        ? t('settings.session-mode.trade-gate.edit-question')
        : t('settings.session-mode.trade-gate.new-question-title')
    );
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass('journalit-trade-gate-question-modal-host');
    const container = contentEl.createDiv();
    this.root = createRoot(container);
    this.root.render(
      <TradeGateQuestionModalContent
        params={this.params}
        closeModal={() => this.close()}
      />
    );
  }

  onClose() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}

export function openTradeGateQuestionModal(
  params: TradeGateQuestionModalParams
): void {
  new TradeGateQuestionModal(params).open();
}
