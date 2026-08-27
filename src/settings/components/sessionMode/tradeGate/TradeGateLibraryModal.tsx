

import { Modal } from 'obsidian';
import type { App } from 'obsidian';
import React, { useEffect, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { Button } from '../../../../components/ui/Button';
import { NoTooltipButton } from '../../../../components/ui/NoTooltipButton';
import {
  Edit,
  Plus,
  Trash2,
} from '../../../../components/shared/icons/ObsidianIcon';
import { eventBus } from '../../../../services/events/EventBus';
import { t } from '../../../../lang/helpers';
import type {
  TradeGateQuestion,
  TradeGateWorkflow,
} from '../../../../types/sessionMode';
import { getTradeGateQuestionUsage } from './tradeGateEditorUtils';

interface TradeGateLibraryState {
  questions: TradeGateQuestion[];
  workflows: TradeGateWorkflow[];
}

type TradeGateLibraryModalParams = {
  app: App;
  getState: () => TradeGateLibraryState;
  onCreateQuestion: () => void;
  onEditQuestion: (questionId: string) => void;
} & (
  | { mode: 'manage'; onDeleteQuestion: (questionId: string) => void }
  | {
      mode: 'pick';
      workflowId: string;
      onPickQuestion: (questionId: string) => void;
    }
);

const TradeGateLibraryModalContent: React.FC<{
  params: TradeGateLibraryModalParams;
  closeModal: () => void;
}> = ({ params, closeModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe('settings:changed', () => {
      setVersion((current) => current + 1);
    });
    return unsubscribe;
  }, []);

  const { questions, workflows } = params.getState();
  const normalizedQuery = searchQuery.trim().toLowerCase();
  
  
  const visibleQuestions = questions.filter((question) => {
    if (!normalizedQuery) return true;
    return (
      question.title.toLowerCase().includes(normalizedQuery) ||
      question.prompt.toLowerCase().includes(normalizedQuery) ||
      question.options.some((option) =>
        option.label.toLowerCase().includes(normalizedQuery)
      )
    );
  });

  return (
    <div className="journalit-trade-gate-library">
      <div className="journalit-trade-gate-library__toolbar">
        <input
          type="search"
          value={searchQuery}
          placeholder={t('settings.session-mode.trade-gate.library-search')}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label={t('settings.session-mode.trade-gate.library-search')}
        />
        <Button size="sm" variant="primary" onClick={params.onCreateQuestion}>
          <Plus size={15} aria-hidden="true" />
          {t('settings.session-mode.trade-gate.new-question-title')}
        </Button>
      </div>

      {visibleQuestions.length === 0 && (
        <div className="setting-item-description">
          {t('settings.session-mode.trade-gate.library-empty')}
        </div>
      )}

      <div className="journalit-trade-gate-library__list">
        {visibleQuestions.map((question) => {
          const usageCount = getTradeGateQuestionUsage(
            workflows,
            question.id
          ).length;
          const usageLabel =
            usageCount > 0
              ? t('settings.session-mode.trade-gate.used-in-workflows', {
                  count: String(usageCount),
                })
              : t('settings.session-mode.trade-gate.not-used');
          return (
            <div
              key={question.id}
              className="journalit-trade-gate-library__row"
            >
              <div className="journalit-trade-gate-library__row-main">
                <span className="journalit-trade-gate-library__row-title">
                  {question.title ||
                    t('settings.session-mode.trade-gate.question')}
                </span>
                <span className="journalit-trade-gate-library__row-chips">
                  {question.options.map((option) => (
                    <span
                      key={option.id}
                      className="journalit-trade-gate-library__chip"
                    >
                      {option.label ||
                        t('settings.session-mode.trade-gate.option')}
                    </span>
                  ))}
                </span>
              </div>
              <span
                className={`journalit-trade-gate-library__usage${usageCount === 0 ? ' is-unused' : ''}`}
              >
                {usageLabel}
              </span>
              <div className="journalit-trade-gate-library__row-actions">
                {params.mode === 'pick' ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      params.onPickQuestion(question.id);
                      closeModal();
                    }}
                  >
                    <Plus size={15} aria-hidden="true" />
                    {t('button.add')}
                  </Button>
                ) : (
                  <>
                    <NoTooltipButton
                      label={t('button.edit')}
                      className="journalit-trade-gate-library__icon-button"
                      onClick={() => params.onEditQuestion(question.id)}
                    >
                      <Edit size={16} aria-hidden="true" />
                    </NoTooltipButton>
                    <NoTooltipButton
                      label={t('button.delete')}
                      className="journalit-session-mode-delete-window-button"
                      onClick={() => params.onDeleteQuestion(question.id)}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </NoTooltipButton>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

class TradeGateLibraryModal extends Modal {
  private params: TradeGateLibraryModalParams;
  private root: Root | null = null;

  constructor(params: TradeGateLibraryModalParams) {
    super(params.app);
    this.params = params;
    this.titleEl.setText(
      params.mode === 'pick'
        ? t('settings.session-mode.trade-gate.add-question')
        : t('settings.session-mode.trade-gate.library-title')
    );
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass('journalit-trade-gate-library-modal-host');
    const container = contentEl.createDiv();
    this.root = createRoot(container);
    this.root.render(
      <TradeGateLibraryModalContent
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

export function openTradeGateLibraryModal(
  params: TradeGateLibraryModalParams
): void {
  new TradeGateLibraryModal(params).open();
}
