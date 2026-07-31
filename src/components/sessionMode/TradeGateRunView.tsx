import React, { useMemo } from 'react';
import { t } from '../../lang/helpers';
import type {
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
  getTradeGateOutcomeNode,
  getRunnableTradeGateOptions,
  getTradeGateQuestionNode,
} from './tradeGateUtils';

interface TradeGateRunViewProps {
  workflow: TradeGateWorkflow;
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
  run,
  copySource,
  onSelectOption,
  onRestart,
}) => {
  const currentQuestion = getTradeGateQuestionNode(workflow, run.currentNodeId);
  
  const currentOutcome =
    copySource === 'current-workflow'
      ? getTradeGateOutcomeNode(workflow, run.currentNodeId)
      : null;
  const outcomeTitle = currentOutcome ? currentOutcome.title : run.outcomeTitle;
  const outcomeDescription = currentOutcome
    ? currentOutcome.description
    : run.outcomeDescription;
  const runnableOptions = useMemo(
    () =>
      currentQuestion
        ? getRunnableTradeGateOptions(workflow, currentQuestion.options)
        : [],
    [currentQuestion, workflow]
  );

  return (
    <div className="journalit-trade-gate-accordion">
      {run.answers.map((answer) => {
        const answerQuestion =
          copySource === 'current-workflow'
            ? getTradeGateQuestionNode(workflow, answer.nodeId)
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
