import React, { useMemo } from 'react';
import { t } from '../../lang/helpers';
import type {
  TradeGateQuestion,
  TradeGateOutcomeType,
  TradeGateRun,
  TradeGateWorkflow,
} from '../../types/sessionMode';
import {
  Check,
  Circle,
  ClockAlert,
  RefreshCw,
  X,
} from '../shared/icons/ObsidianIcon';
import {
  getDefaultOutcomeDescription,
  getDefaultOutcomeTitle,
  getRunnableTradeGateOptions,
  getTradeGateQuestion,
} from './tradeGateUtils';

interface TradeGateRunViewProps {
  workflow: TradeGateWorkflow;
  questions: TradeGateQuestion[];
  run: TradeGateRun;
  copySource: 'run-snapshot' | 'current-workflow';
  onSelectOption: (optionId: string) => void;
  onRestart: () => void;
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

export const TradeGateRunView: React.FC<TradeGateRunViewProps> = ({
  workflow,
  questions,
  run,
  copySource,
  onSelectOption,
  onRestart,
}) => {
  const currentQuestion = getTradeGateQuestion(
    workflow,
    questions,
    run.currentNodeId
  );
  
  
  const lastAnswer = run.answers[run.answers.length - 1];
  const currentOutcomeTarget =
    copySource === 'current-workflow' && run.status === 'completed'
      ? workflow.routes.find(
          (route) =>
            route.nodeId === lastAnswer?.nodeId &&
            route.optionId === lastAnswer?.selectedOptionId
        )?.target
      : undefined;
  const currentOutcome =
    currentOutcomeTarget?.kind === 'outcome' ? currentOutcomeTarget : null;
  const outcomeTitle =
    run.outcomeTitle ??
    (run.outcome ? getDefaultOutcomeTitle(run.outcome) : undefined);
  const outcomeDescription = currentOutcome
    ? (currentOutcome.note ??
      getDefaultOutcomeDescription(currentOutcome.outcome))
    : (run.outcomeDescription ??
      (run.outcome ? getDefaultOutcomeDescription(run.outcome) : undefined));
  
  
  const runnableOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const answeredNodeIds = new Set(run.answers.map((answer) => answer.nodeId));
    return getRunnableTradeGateOptions(
      workflow,
      questions,
      run.currentNodeId,
      answeredNodeIds
    );
  }, [currentQuestion, questions, run.answers, run.currentNodeId, workflow]);

  return (
    <div className="journalit-trade-gate-accordion">
      {run.answers.map((answer) => {
        const answerQuestion =
          copySource === 'current-workflow'
            ? getTradeGateQuestion(workflow, questions, answer.nodeId)
            : null;
        const answerOption = answerQuestion?.options.find(
          (option) => option.id === answer.selectedOptionId
        );

        return (
          <div
            className="journalit-trade-gate-step is-complete"
            key={`${answer.timestamp}:${answer.nodeId}:${answer.selectedOptionId}`}
          >
            <div className="journalit-trade-gate-step__status">
              <Check size={16} />
            </div>
            <div className="journalit-trade-gate-step__content">
              <div className="journalit-trade-gate-step__title">
                {answerQuestion?.title ?? answer.nodeTitle}
              </div>
              <div className="journalit-trade-gate-step__answer">
                {answerOption?.label ?? answer.selectedOptionLabel}
              </div>
            </div>
          </div>
        );
      })}

      {run.status === 'in-progress' && currentQuestion && (
        <div className="journalit-trade-gate-step is-active">
          <div className="journalit-trade-gate-step__status">
            {run.answers.length + 1}
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
                  onClick={() => onSelectOption(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {run.status === 'completed' && (
        <div className={`journalit-trade-gate-outcome is-${run.outcome}`}>
          <div className="journalit-trade-gate-outcome__icon">
            {getOutcomeIcon(run.outcome)}
          </div>
          <div className="journalit-trade-gate-outcome__content">
            <div className="journalit-trade-gate-outcome__title">
              {outcomeTitle}
            </div>
            {outcomeDescription && (
              <div className="journalit-trade-gate-outcome__description">
                {outcomeDescription}
              </div>
            )}
          </div>
          <button
            type="button"
            className="journalit-trade-gate-restart-button"
            onClick={onRestart}
            aria-label={t('trade-gate.action.start-another')}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
