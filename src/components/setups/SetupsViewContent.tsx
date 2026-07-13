import React, { useCallback, useEffect, useState } from 'react';
import type { Component } from 'obsidian';

import type JournalitPlugin from '../../main';
import { useService } from '../../hooks/useService';
import { useEventBusMultiple } from '../../hooks/useEventBus';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideContextValue,
  useGuideCurrentStepId,
} from '../../guides/GuideRuntimeLayer';
import { SETUPS_SETUP_AVAILABLE_ACTION_ID } from '../../guides/setupsGuideIds';
import { SETUPS_COUNT_CONTEXT_KEY } from '../../guides/setupsMainGuide';
import type { EventName } from '../../services/events';
import type { Setup, SetupMetrics } from '../../services/setup/types';
import { buildSetupAdvancedAnalytics } from '../../services/setup/setupAdvancedAnalytics';
import { buildSetupOpportunityStats } from '../../services/setup/setupOpportunityStats';
import { getAnalyticsDateBasis } from '../../utils/tradeAnalyticsDate';
import { t } from '../../lang/helpers';
import { openCreateSetupModal, openEditSetupModal } from './CreateSetupModal';
import { SetupComparePage } from './SetupComparePage';
import {
  loadSetupBacktestTradeData,
  loadSetupMissedTradeData,
  openSetupsOverview,
  SetupDetailPage,
} from './SetupDetailPage';
import { SetupOverviewPage } from './SetupOverviewPage';
import { SetupViewSkeleton } from './SetupViewSkeleton';
import { buildSetupTradeIndex, getCompletenessBadges } from './setupsViewModel';
import type { SetupsDataState, SetupsViewState } from './setupsViewTypes';

export type { SetupsViewState } from './setupsViewTypes';

interface SetupsViewContentProps {
  hoverParent: Component;
  plugin: JournalitPlugin;
  state: SetupsViewState;
  onStateChange: (state: SetupsViewState) => void;
}

const SETUPS_VIEW_REFRESH_EVENTS: EventName[] = [
  'setup:changed',
  'trade:committed',
  'trade:changed',
  'missed-trade:changed',
  'backtest-trade:changed',
  'options:changed',
  'settings:changed',
];

const EMPTY_METRICS: SetupMetrics = {
  totalTrades: 0,
  winRate: 0,
  totalPnL: 0,
  avgWinner: 0,
  avgLoser: 0,
  winStreak: 0,
  loseStreak: 0,
  currentStreak: 0,
  expectedValue: 0,
  riskRewardRatio: 0,
  profitFactor: 0,
  averageDuration: 0,
  bestTrade: 0,
  worstTrade: 0,
  averageVolume: 0,
  lastTradeDate: '',
  tradingFrequency: 0,
  inactivityStreak: 0,
};

const INITIAL_SETUPS_DATA_STATE: SetupsDataState = {
  viewModels: [],
  tradeIndex: {
    primary: new Map(),
    any: new Map(),
  },
  loadError: null,
  hasLoadedData: false,
};

export function buildSetupsViewOpportunityStats(
  setups: Setup[],
  liveTrades: unknown[],
  missedTrades: unknown[],
  backtestTrades: unknown[],
  defaultRiskAmount?: number
) {
  return buildSetupOpportunityStats(
    setups,
    [...liveTrades, ...missedTrades, ...backtestTrades],
    defaultRiskAmount
  );
}

export const SetupsViewContent: React.FC<SetupsViewContentProps> = ({
  hoverParent,
  plugin,
  state,
  onStateChange,
}) => {
  const { service: setupService, status, error } = useService('setupService');
  const emitGuideAction = useGuideAction();
  const currentGuideStepId = useGuideCurrentStepId();
  const [dataState, setDataState] = useState<SetupsDataState>(
    INITIAL_SETUPS_DATA_STATE
  );
  const { viewModels, tradeIndex, loadError, hasLoadedData } = dataState;

  const loadData = useCallback(
    async (options?: { forceFresh?: boolean }) => {
      if (!setupService) return;

      setDataState((current) => ({ ...current, loadError: null }));
      try {
        await plugin.tradeService.waitForTradeDataReady();
        if (options?.forceFresh) {
          await setupService.clearCache();
        }
        const [setups, trades, missedTrades, backtestTrades] =
          await Promise.all([
            setupService.listSetups(),
            plugin.tradeService.getTradeData(),
            loadSetupMissedTradeData(plugin),
            loadSetupBacktestTradeData(plugin),
          ]);
        const metricsBySetupId = setupService.getAllSetupMetricsFromTradeData(
          setups,
          trades
        );

        const advancedAnalytics = buildSetupAdvancedAnalytics(setups, trades);
        const opportunityStatsBySetupId = buildSetupsViewOpportunityStats(
          setups,
          trades,
          missedTrades,
          backtestTrades,
          plugin.settings.trade?.defaultRiskAmount
        );
        const tradeIndex = buildSetupTradeIndex(
          setups,
          trades,
          plugin.settings.trade?.defaultRiskAmount,
          getAnalyticsDateBasis(plugin.settings)
        );
        setDataState({
          viewModels: setups.map((setup) => ({
            setup,
            metrics: metricsBySetupId.get(setup.id) ?? EMPTY_METRICS,
            advancedAnalytics: advancedAnalytics.bySetup[setup.id],
            opportunityStats: opportunityStatsBySetupId[setup.id],
            completenessBadges: getCompletenessBadges(setup),
          })),
          tradeIndex,
          loadError: null,
          hasLoadedData: true,
        });
      } catch (loadFailure) {
        setDataState((current) => ({
          ...current,
          hasLoadedData: true,
          loadError:
            loadFailure instanceof Error
              ? loadFailure.message
              : t('setups.view.error.load-failed'),
        }));
      }
    },
    [plugin, setupService]
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEventBusMultiple(
    SETUPS_VIEW_REFRESH_EVENTS,
    () => void loadData({ forceFresh: true }),
    Boolean(setupService)
  );

  useGuideContextValue(
    SETUPS_COUNT_CONTEXT_KEY,
    hasLoadedData ? viewModels.length : -1
  );

  const currentError = loadError ?? error?.message ?? null;
  const guideBackHandler = useCallback(
    ({ toStepId }: { toStepId: string }) => {
      const deferStateChange = (nextState: SetupsViewState): void => {
        window.setTimeout(() => onStateChange(nextState), 0);
      };
      const currentSetup =
        state.setupId || state.setupPath
          ? viewModels.find(
              ({ setup }) =>
                setup.id === state.setupId ||
                (state.setupPath && setup.filePath === state.setupPath)
            )?.setup
          : undefined;
      const targetDetailSetup = currentSetup ?? viewModels[0]?.setup;
      const firstTwoSetupIds = viewModels
        .slice(0, 2)
        .map(({ setup }) => setup.id);

      if (toStepId.startsWith('detail-') && targetDetailSetup) {
        deferStateChange({
          page: 'detail',
          setupId: targetDetailSetup.id,
          setupPath: targetDetailSetup.filePath,
          setupName: targetDetailSetup.name,
        });
        return;
      }

      if (
        (toStepId === 'compare-summary' ||
          toStepId === 'compare-body' ||
          toStepId === 'compare-details') &&
        firstTwoSetupIds.length === 2
      ) {
        deferStateChange({
          page: 'compare',
          selectedSetupIds: firstTwoSetupIds,
        });
        return;
      }

      if (
        toStepId === 'open-detail' ||
        toStepId === 'compare-mode' ||
        toStepId === 'compare-select' ||
        toStepId.includes('overview')
      ) {
        deferStateChange({ page: 'overview' });
      }
    },
    [onStateChange, state.setupId, state.setupPath, viewModels]
  );

  useGuideBackHandler(guideBackHandler);
  if (currentError) {
    return (
      <div className="journalit-setups-view">
        <div className="journalit-setups-error">
          <strong>{t('setups.view.error.title')}</strong>
          <p>{currentError}</p>
          <button
            className="journalit-setups-button"
            onClick={() => void loadData({ forceFresh: true })}
          >
            {t('setups.view.action.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (status === 'loading' || !hasLoadedData) {
    return <SetupViewSkeleton page={state.page} />;
  }

  const selectedSetup = viewModels.find(
    (viewModel) =>
      viewModel.setup.id === state.setupId ||
      (state.setupPath && viewModel.setup.filePath === state.setupPath)
  );

  if (state.page === 'detail' && selectedSetup) {
    const selectedLinkedTrades =
      tradeIndex.any.get(selectedSetup.setup.id) ?? [];

    return (
      <SetupDetailPage
        hoverParent={hoverParent}
        plugin={plugin}
        viewModel={selectedSetup}
        linkedTrades={selectedLinkedTrades}
        onBack={() => openSetupsOverview(plugin, onStateChange)}
        onEditSetup={(setup) => {
          openEditSetupModal(
            plugin,
            setup,
            (updatedSetup) => {
              setDataState((current) => ({
                ...current,
                hasLoadedData: false,
                loadError: null,
              }));
              onStateChange({
                page: 'detail',
                setupId: updatedSetup.id,
                setupPath: updatedSetup.filePath,
                setupName: updatedSetup.name,
              });
              void loadData({ forceFresh: true });
            },
            () => {
              setDataState((current) => ({
                ...current,
                hasLoadedData: false,
                loadError: null,
              }));
              onStateChange({ page: 'overview' });
              void loadData({ forceFresh: true });
            }
          );
        }}
      />
    );
  }

  if (state.page === 'detail' && !selectedSetup) {
    return hasLoadedData ? (
      <div className="journalit-setups-view">
        <div className="journalit-setups-error">
          {t('setups.view.error.load-failed')}
        </div>
      </div>
    ) : (
      <SetupViewSkeleton page="detail" />
    );
  }

  if (state.page === 'compare') {
    return (
      <SetupComparePage
        displayRMultiples={plugin.settings.trade?.displayRMultiples ?? false}
        viewModels={viewModels}
        tradeIndex={tradeIndex}
        selectedSetupIds={state.selectedSetupIds ?? []}
        onBack={() => onStateChange({ page: 'overview' })}
      />
    );
  }

  const handleCreateSetup = () => {
    openCreateSetupModal(plugin, (setup) => {
      void (async () => {
        await loadData({ forceFresh: true });

        if (currentGuideStepId === 'create-setup') {
          onStateChange({ page: 'overview' });
          window.setTimeout(() => {
            emitGuideAction(SETUPS_SETUP_AVAILABLE_ACTION_ID);
          }, 250);
          return;
        }

        void plugin.viewManager.openSetupsView({
          page: 'detail',
          setupId: setup.id,
          setupPath: setup.filePath,
          setupName: setup.name,
        });
      })();
    });
  };

  return (
    <SetupOverviewPage
      plugin={plugin}
      viewModels={viewModels}
      tradeIndex={tradeIndex}
      onOpenSetup={(setupId, setupName, setupPath) => {
        onStateChange({
          page: 'detail',
          setupId,
          setupPath,
          setupName,
        });
      }}
      selectedSetupIds={state.selectedSetupIds ?? []}
      onSelectedSetupIdsChange={(selectedSetupIds) =>
        onStateChange({
          page: 'overview',
          selectedSetupIds,
        })
      }
      onCompareSelected={(setupIds) =>
        onStateChange({
          page: 'compare',
          selectedSetupIds: setupIds,
        })
      }
      onCreateSetup={handleCreateSetup}
    />
  );
};

SetupsViewContent.displayName = 'SetupsViewContent';
