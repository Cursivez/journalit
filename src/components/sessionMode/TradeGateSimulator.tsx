import React, { useCallback, useState } from 'react';
import { t } from '../../lang/helpers';
import type {
  TradeGateQuestion,
  TradeGateRun,
  TradeGateWorkflow,
} from '../../types/sessionMode';
import {
  advanceTradeGateRun,
  createTradeGateRun,
  getTradeGateRoutingSignature,
  hasRunnableTradeGateQuestion,
} from './tradeGateUtils';
import { TradeGateRunView } from './TradeGateRunView';

interface TradeGateSimulatorProps {
  id: string;
  questions: TradeGateQuestion[];
  workflow: TradeGateWorkflow;
}

interface TradeGateSimulationState {
  routingSignature: string;
  run: TradeGateRun;
}

export const TradeGateSimulator: React.FC<TradeGateSimulatorProps> = React.memo(
  ({ id, questions, workflow }) => {
    const canStart = hasRunnableTradeGateQuestion(
      workflow,
      questions,
      workflow.startNodeId
    );
    const routingSignature = getTradeGateRoutingSignature(workflow, questions);
    const [simulationState, setSimulationState] =
      useState<TradeGateSimulationState>(() => ({
        routingSignature,
        run: createTradeGateRun(workflow),
      }));

    const run = simulationState.run;

    const startRun = useCallback(() => {
      if (!canStart) return;
      setSimulationState({
        routingSignature,
        run: createTradeGateRun(workflow),
      });
    }, [canStart, routingSignature, workflow]);

    const selectOption = useCallback(
      (optionId: string) => {
        const nextRun = advanceTradeGateRun({
          workflow,
          questions,
          run,
          optionId,
        });
        if (nextRun) setSimulationState({ routingSignature, run: nextRun });
      },
      [questions, routingSignature, run, workflow]
    );

    if (simulationState.routingSignature !== routingSignature) {
      setSimulationState({
        routingSignature,
        run: createTradeGateRun(workflow),
      });
      return null;
    }

    if (!canStart) {
      return (
        <section
          id={id}
          className="journalit-trade-gate-simulator__unavailable"
        >
          {t('settings.session-mode.trade-gate.simulation.unavailable')}
        </section>
      );
    }

    return (
      <section id={id} className="journalit-trade-gate-simulator">
        <TradeGateRunView
          workflow={workflow}
          questions={questions}
          run={run}
          copySource="current-workflow"
          onSelectOption={selectOption}
          onRestart={startRun}
        />
      </section>
    );
  }
);

TradeGateSimulator.displayName = 'TradeGateSimulator';
