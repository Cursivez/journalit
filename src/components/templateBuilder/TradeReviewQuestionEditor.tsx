import React, { useId, useState } from 'react';
import { generateUUID } from '../../utils/uuid';
import { t } from '../../lang/helpers';
import { SegmentedControl } from '../shared/SegmentedControl';
import { Tooltip } from '../shared/Tooltip';
import {
  ArrowDown,
  ArrowUp,
  Info,
  Trash2,
  X,
} from '../shared/icons/ObsidianIcon';
import {
  resolveTradeReviewQuestions,
  TRADE_REVIEW_QUESTION_CONFIG_KEYS,
  wouldCreateTradeReviewQuestionCycle,
  type TradeReviewChoiceOption,
  type TradeReviewOutcome,
  type TradeReviewQuestionConfig,
  type TradeReviewQuestionConfigKey,
  type TradeReviewWidgetConfig,
} from '../reviewV2/widgets/tradeReviewConfig';
import { DropdownSelect } from '../shared/DropdownSelect';
import { Button } from '../ui/Button';

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

function encodeConditionValue(questionId: string, optionId: string): string {
  return JSON.stringify([questionId, optionId]);
}

function decodeConditionValue(
  value: string
): TradeReviewQuestionConfig['visibleWhen'] {
  if (!value) return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    if (
      Array.isArray(parsed) &&
      typeof parsed[0] === 'string' &&
      typeof parsed[1] === 'string'
    ) {
      return { questionId: parsed[0], optionId: parsed[1] };
    }
  } catch {
    // intentional
  }
  return undefined;
}

interface TradeReviewQuestionRowProps {
  question: TradeReviewQuestionConfig;
  questionIndex: number;
  questionCount: number;
  conditionSources: Array<{
    question: TradeReviewQuestionConfig;
    questionNumber: number;
  }>;
  onUpdateQuestion: (
    questionIndex: number,
    updates: Partial<Pick<TradeReviewQuestionConfig, 'label' | 'placeholder'>>
  ) => void;
  onSetQuestionType: (questionIndex: number, type: 'text' | 'choice') => void;
  onSetQuestionCondition: (
    questionIndex: number,
    condition: TradeReviewQuestionConfig['visibleWhen']
  ) => void;
  onUpdateOption: (
    questionIndex: number,
    optionIndex: number,
    label: string
  ) => void;
  onAddOption: (questionIndex: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onRemoveQuestion: (questionIndex: number) => void;
  onMoveQuestion: (questionIndex: number, offset: -1 | 1) => void;
}

const TradeReviewQuestionRow: React.FC<TradeReviewQuestionRowProps> = ({
  question,
  questionIndex,
  questionCount,
  conditionSources,
  onUpdateQuestion,
  onSetQuestionType,
  onSetQuestionCondition,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onRemoveQuestion,
  onMoveQuestion,
}) => {
  const isChoice = question.type === 'choice';
  const conditionValue = question.visibleWhen
    ? encodeConditionValue(
        question.visibleWhen.questionId,
        question.visibleWhen.optionId
      )
    : '';

  return (
    <div className="template-trade-review-question-row">
      <span
        className="template-trade-review-question-number"
        aria-hidden="true"
      >
        {questionIndex + 1}
      </span>
      <div className="template-trade-review-question-fields">
        <div className="template-trade-review-question-main">
          <label className="template-trade-review-field-label">
            <span className="template-trade-review-visually-hidden">
              {t('templateEditor.widget.trade-review.question-label')}
            </span>
            <input
              type="text"
              value={question.label}
              className="template-input template-trade-review-question-input"
              placeholder={t(
                'templateEditor.widget.trade-review.question-placeholder'
              )}
              onChange={(event) =>
                onUpdateQuestion(questionIndex, { label: event.target.value })
              }
            />
          </label>
          <div className="template-trade-review-question-meta">
            <DropdownSelect
              ariaLabel={t(
                'templateEditor.widget.trade-review.answer-type-label'
              )}
              width="content"
              value={isChoice ? 'choice' : 'text'}
              options={[
                {
                  value: 'text',
                  label: t(
                    'templateEditor.widget.trade-review.answer-type-text'
                  ),
                },
                {
                  value: 'choice',
                  label: t(
                    'templateEditor.widget.trade-review.answer-type-choice'
                  ),
                },
              ]}
              onChange={(value) =>
                onSetQuestionType(
                  questionIndex,
                  value === 'choice' ? 'choice' : 'text'
                )
              }
            />
            {conditionSources.length > 0 && (
              <DropdownSelect
                ariaLabel={t(
                  'templateEditor.widget.trade-review.condition-label'
                )}
                width="content"
                showOptionTooltips={false}
                value={conditionValue}
                options={[
                  {
                    value: '',
                    label: t(
                      'templateEditor.widget.trade-review.condition-always'
                    ),
                  },
                  ...conditionSources.flatMap(
                    ({ question: source, questionNumber }) =>
                      (source.options ?? []).flatMap((option) =>
                        option.label.trim() === ''
                          ? []
                          : [
                              {
                                value: encodeConditionValue(
                                  source.id,
                                  option.id
                                ),
                                label: t(
                                  'templateEditor.widget.trade-review.condition-option-label',
                                  {
                                    questionNumber: questionNumber.toString(),
                                    option: option.label,
                                  }
                                ),
                              },
                            ]
                      )
                  ),
                ]}
                onChange={(value) =>
                  onSetQuestionCondition(
                    questionIndex,
                    decodeConditionValue(value)
                  )
                }
              />
            )}
          </div>
        </div>
        {isChoice ? (
          <div className="template-trade-review-option-editor">
            {(question.options ?? []).map(
              (option: TradeReviewChoiceOption, optionIndex) => (
                <div
                  key={option.id}
                  className="template-trade-review-option-row"
                >
                  <label className="template-trade-review-field-label template-trade-review-option-field-label">
                    <span className="template-trade-review-visually-hidden">
                      {t(
                        'templateEditor.widget.trade-review.option-placeholder'
                      )}
                    </span>
                    <input
                      type="text"
                      value={option.label}
                      className="template-input template-trade-review-option-input"
                      placeholder={t(
                        'templateEditor.widget.trade-review.option-placeholder'
                      )}
                      onChange={(event) =>
                        onUpdateOption(
                          questionIndex,
                          optionIndex,
                          event.target.value
                        )
                      }
                    />
                  </label>
                  <Tooltip content={t('button.remove')}>
                    <button
                      type="button"
                      className="journalit-template-builder-button template-trade-review-question-action template-trade-review-question-action--remove template-trade-review-option-remove journalit-icon-button"
                      onClick={() => onRemoveOption(questionIndex, optionIndex)}
                    >
                      <X size={13} aria-hidden="true" />
                      <span className="template-trade-review-visually-hidden">
                        {t('button.remove')}
                      </span>
                    </button>
                  </Tooltip>
                </div>
              )
            )}
            <Button
              variant="secondary"
              size="small"
              className="journalit-template-builder-button template-trade-review-add-option"
              onClick={() => onAddOption(questionIndex)}
            >
              {t('templateEditor.widget.trade-review.add-option')}
            </Button>
          </div>
        ) : (
          <label className="template-trade-review-field-label">
            <span className="template-trade-review-visually-hidden">
              {t('templateEditor.widget.trade-review.answer-placeholder-label')}
            </span>
            <textarea
              value={question.placeholder ?? ''}
              className="template-input template-trade-review-placeholder-input"
              placeholder={t(
                'templateEditor.widget.trade-review.answer-placeholder'
              )}
              onChange={(event) =>
                onUpdateQuestion(questionIndex, {
                  placeholder: event.target.value,
                })
              }
            />
          </label>
        )}
      </div>
      <div className="template-trade-review-question-actions">
        <Tooltip content={t('button.move-up')}>
          <button
            type="button"
            className="journalit-template-builder-button template-trade-review-question-action journalit-icon-button"
            disabled={questionIndex === 0}
            onClick={() => onMoveQuestion(questionIndex, -1)}
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
            className="journalit-template-builder-button template-trade-review-question-action journalit-icon-button"
            disabled={questionIndex === questionCount - 1}
            onClick={() => onMoveQuestion(questionIndex, 1)}
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
            className="journalit-template-builder-button template-trade-review-question-action template-trade-review-question-action--remove journalit-icon-button"
            onClick={() => onRemoveQuestion(questionIndex)}
          >
            <Trash2 size={14} aria-hidden="true" />
            <span className="template-trade-review-visually-hidden">
              {t('button.remove')}
            </span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

function withoutVisibleWhen(
  question: TradeReviewQuestionConfig
): TradeReviewQuestionConfig {
  const copy = { ...question };
  delete copy.visibleWhen;
  return copy;
}

const clearConditionsReferencing = (
  list: TradeReviewQuestionConfig[],
  matches: (
    condition: NonNullable<TradeReviewQuestionConfig['visibleWhen']>
  ) => boolean
): TradeReviewQuestionConfig[] =>
  list.map((question) => {
    if (!question.visibleWhen || !matches(question.visibleWhen)) {
      return question;
    }
    return withoutVisibleWhen(question);
  });

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

  const setQuestionType = (
    questionIndex: number,
    type: 'text' | 'choice'
  ): void => {
    const target = questions[questionIndex];
    if ((target.type ?? 'text') === type) return;
    let next = questions.map((question, index): TradeReviewQuestionConfig => {
      if (index !== questionIndex) return question;
      if (type === 'choice') {
        return {
          ...question,
          type: 'choice',
          options: [
            { id: generateUUID(), label: t('common.yes') },
            { id: generateUUID(), label: t('common.no') },
          ],
        };
      }
      const textQuestion = { ...question };
      delete textQuestion.type;
      delete textQuestion.options;
      return textQuestion;
    });
    if (type === 'text') {
      next = clearConditionsReferencing(
        next,
        (condition) => condition.questionId === target.id
      );
    }
    onChange(configKey, next);
  };

  const setQuestionCondition = (
    questionIndex: number,
    condition: TradeReviewQuestionConfig['visibleWhen']
  ): void => {
    onChange(
      configKey,
      questions.map((question, index) => {
        if (index !== questionIndex) return question;
        if (!condition) {
          return withoutVisibleWhen(question);
        }
        return { ...question, visibleWhen: condition };
      })
    );
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    label: string
  ): void => {
    onChange(
      configKey,
      questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: (question.options ?? []).map((option, currentIndex) =>
                currentIndex === optionIndex ? { ...option, label } : option
              ),
            }
          : question
      )
    );
  };

  const addOption = (questionIndex: number): void => {
    onChange(
      configKey,
      questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: [
                ...(question.options ?? []),
                { id: generateUUID(), label: '' },
              ],
            }
          : question
      )
    );
  };

  const removeOption = (questionIndex: number, optionIndex: number): void => {
    const target = questions[questionIndex];
    const removedOption = target.options?.[optionIndex];
    let next = questions.map((question, index) =>
      index === questionIndex
        ? {
            ...question,
            options: (question.options ?? []).filter(
              (_, currentIndex) => currentIndex !== optionIndex
            ),
          }
        : question
    );
    if (removedOption) {
      next = clearConditionsReferencing(
        next,
        (condition) =>
          condition.questionId === target.id &&
          condition.optionId === removedOption.id
      );
    }
    onChange(configKey, next);
  };

  const removeQuestion = (questionIndex: number): void => {
    const target = questions[questionIndex];
    const next = clearConditionsReferencing(
      questions.filter((_, currentIndex) => currentIndex !== questionIndex),
      (condition) => condition.questionId === target.id
    );
    onChange(configKey, next);
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
        <Button
          variant="secondary"
          size="small"
          className="journalit-template-builder-button template-trade-review-reset-button"
          disabled={!isCustomized}
          onClick={() => onReset(configKey)}
        >
          {t('button.reset-to-defaults')}
        </Button>
      </div>

      <SegmentedControl<TradeReviewOutcome>
        className="template-trade-review-outcome-options"
        options={getOutcomeOptions()}
        value={outcome}
        onChange={setOutcome}
        size="small"
        fullWidth
        groupRole="radiogroup"
        ariaLabelledBy={titleId}
      />

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
              <TradeReviewQuestionRow
                key={question.id}
                question={question}
                questionIndex={questionIndex}
                questionCount={questions.length}
                conditionSources={questions.flatMap(
                  (candidate, candidateIndex) =>
                    candidate.id !== question.id &&
                    !wouldCreateTradeReviewQuestionCycle(
                      questions,
                      question.id,
                      candidate.id
                    ) &&
                    candidate.type === 'choice' &&
                    (candidate.options ?? []).some(
                      (option) => option.label.trim() !== ''
                    )
                      ? [
                          {
                            question: candidate,
                            questionNumber: candidateIndex + 1,
                          },
                        ]
                      : []
                )}
                onUpdateQuestion={updateQuestion}
                onSetQuestionType={setQuestionType}
                onSetQuestionCondition={setQuestionCondition}
                onUpdateOption={updateOption}
                onAddOption={addOption}
                onRemoveOption={removeOption}
                onRemoveQuestion={removeQuestion}
                onMoveQuestion={moveQuestion}
              />
            ))
          )}
        </div>
      </div>

      <Button
        variant="secondary"
        size="small"
        className="journalit-template-builder-button template-previous-context-add-button template-trade-review-add-question"
        onClick={addQuestion}
      >
        {t('templateEditor.widget.trade-review.add-question')}
      </Button>
    </section>
  );
};
