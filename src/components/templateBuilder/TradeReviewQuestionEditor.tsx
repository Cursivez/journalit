import React, { useId, useState } from 'react';
import { generateUUID } from '../../utils/uuid';
import { t } from '../../lang/helpers';
import { Tooltip } from '../shared/Tooltip';
import { ArrowDown, ArrowUp, Info, Trash2 } from '../shared/icons/ObsidianIcon';
import {
  resolveTradeReviewQuestions,
  TRADE_REVIEW_QUESTION_CONFIG_KEYS,
  type TradeReviewOutcome,
  type TradeReviewQuestionConfig,
  type TradeReviewQuestionConfigKey,
  type TradeReviewWidgetConfig,
} from '../reviewV2/widgets/tradeReviewConfig';

interface TradeReviewQuestionEditorProps {
  config: TradeReviewWidgetConfig;
  onChange: (
    key: TradeReviewQuestionConfigKey,
    questions: TradeReviewQuestionConfig[]
  ) => void;
  onReset: (key: TradeReviewQuestionConfigKey) => void;
}

const getOutcomeOptions = (): Array<{
  value: TradeReviewOutcome;
  label: string;
}> => [
  {
    value: 'win',
    label: t('templateEditor.widget.trade-review.outcome.win'),
  },
  {
    value: 'loss',
    label: t('templateEditor.widget.trade-review.outcome.loss'),
  },
  {
    value: 'breakeven',
    label: t('templateEditor.widget.trade-review.outcome.breakeven'),
  },
  {
    value: 'open',
    label: t('templateEditor.widget.trade-review.outcome.open'),
  },
];

export const TradeReviewQuestionEditor: React.FC<
  TradeReviewQuestionEditorProps
> = ({ config, onChange, onReset }) => {
  const titleId = useId();
  const [outcome, setOutcome] = useState<TradeReviewOutcome>('win');
  const configKey = TRADE_REVIEW_QUESTION_CONFIG_KEYS[outcome];
  const questions = resolveTradeReviewQuestions(config, outcome);
  const isCustomized = config[configKey] !== undefined;

  const updateQuestion = (
    questionIndex: number,
    updates: Partial<Pick<TradeReviewQuestionConfig, 'label' | 'placeholder'>>
  ): void => {
    onChange(
      configKey,
      questions.map((question, index) =>
        index === questionIndex ? { ...question, ...updates } : question
      )
    );
  };

  const moveQuestion = (questionIndex: number, offset: -1 | 1): void => {
    const destination = questionIndex + offset;
    if (destination < 0 || destination >= questions.length) return;
    const reordered = [...questions];
    [reordered[questionIndex], reordered[destination]] = [
      reordered[destination],
      reordered[questionIndex],
    ];
    onChange(configKey, reordered);
  };

  const addQuestion = (): void => {
    onChange(configKey, [
      ...questions,
      {
        id: `trade-review-${outcome}-${generateUUID()}`,
        label: '',
        placeholder: '',
      },
    ]);
  };

  return (
    <section className="template-trade-review-question-editor">
      <div className="template-trade-review-question-header">
        <div className="template-trade-review-question-title-row">
          <div id={titleId} className="template-trade-review-question-title">
            {t('templateEditor.widget.trade-review.questions')}
          </div>
          <Tooltip
            content={t('templateEditor.widget.trade-review.questions-help')}
            delay={200}
            preferredPosition="top"
          >
            <span className="template-trade-review-question-info">
              <Info size={11} aria-hidden="true" />
            </span>
          </Tooltip>
        </div>
        <button
          type="button"
          className="journalit-template-builder-button template-trade-review-reset-button"
          disabled={!isCustomized}
          onClick={() => onReset(configKey)}
        >
          {t('button.reset-to-defaults')}
        </button>
      </div>

      <div
        className="template-trade-review-outcome-options"
        role="radiogroup"
        aria-labelledby={titleId}
      >
        {getOutcomeOptions().map((option) => {
          const selected = outcome === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={`journalit-template-builder-button template-trade-review-outcome-option${selected ? ' is-selected' : ''}`}
              aria-pressed={selected}
              onClick={() => setOutcome(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="template-trade-review-question-surface">
        {questions.length > 0 && (
          <div
            className="template-trade-review-question-columns"
            aria-hidden="true"
          >
            <div className="template-trade-review-question-column-labels">
              <span>
                {t('templateEditor.widget.trade-review.question-label')}
              </span>
              <span>
                {t(
                  'templateEditor.widget.trade-review.answer-placeholder-label'
                )}
              </span>
            </div>
            <span />
          </div>
        )}

        <div className="template-trade-review-question-list">
          {questions.length === 0 ? (
            <div className="template-trade-review-question-empty">
              {t('templateEditor.widget.trade-review.questions-empty')}
            </div>
          ) : (
            questions.map((question, questionIndex) => (
              <div
                key={question.id}
                className="template-trade-review-question-row"
              >
                <div className="template-trade-review-question-fields">
                  <input
                    type="text"
                    value={question.label}
                    className="template-input template-trade-review-question-input"
                    aria-label={t(
                      'templateEditor.widget.trade-review.question-label'
                    )}
                    placeholder={t(
                      'templateEditor.widget.trade-review.question-placeholder'
                    )}
                    onChange={(event) =>
                      updateQuestion(questionIndex, {
                        label: event.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={question.placeholder ?? ''}
                    className="template-input template-trade-review-placeholder-input"
                    aria-label={t(
                      'templateEditor.widget.trade-review.answer-placeholder-label'
                    )}
                    placeholder={t(
                      'templateEditor.widget.trade-review.answer-placeholder'
                    )}
                    onChange={(event) =>
                      updateQuestion(questionIndex, {
                        placeholder: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="template-trade-review-question-actions">
                  <Tooltip content={t('button.move-up')}>
                    <button
                      type="button"
                      className="journalit-template-builder-button template-trade-review-question-action"
                      disabled={questionIndex === 0}
                      onClick={() => moveQuestion(questionIndex, -1)}
                    >
                      <ArrowUp size={14} aria-hidden="true" />
                      <span className="template-trade-review-visually-hidden">
                        {t('button.move-up')}
                      </span>
                    </button>
                  </Tooltip>
                  <Tooltip content={t('button.move-down')}>
                    <button
                      type="button"
                      className="journalit-template-builder-button template-trade-review-question-action"
                      disabled={questionIndex === questions.length - 1}
                      onClick={() => moveQuestion(questionIndex, 1)}
                    >
                      <ArrowDown size={14} aria-hidden="true" />
                      <span className="template-trade-review-visually-hidden">
                        {t('button.move-down')}
                      </span>
                    </button>
                  </Tooltip>
                  <Tooltip content={t('button.remove')}>
                    <button
                      type="button"
                      className="journalit-template-builder-button template-trade-review-question-action template-trade-review-question-action--remove"
                      onClick={() =>
                        onChange(
                          configKey,
                          questions.filter(
                            (_, currentIndex) => currentIndex !== questionIndex
                          )
                        )
                      }
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      <span className="template-trade-review-visually-hidden">
                        {t('button.remove')}
                      </span>
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        type="button"
        className="journalit-template-builder-button template-previous-context-add-button template-trade-review-add-question"
        onClick={addQuestion}
      >
        {t('templateEditor.widget.trade-review.add-question')}
      </button>
    </section>
  );
};
