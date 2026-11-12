import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { Component } from 'obsidian';

import type JournalitPlugin from '../../main';
import { useService } from '../../hooks/useService';
import { useEventBusMultiple } from '../../hooks/useEventBus';
import {
  useGuideAction,
  useGuideBackHandler,
  useContextualGuideResolution,
  useGuideContextValue,
  useGuideCurrentStepId,
} from '../../guides/GuideRuntimeLayer';
import { SETUPS_SETUP_AVAILABLE_ACTION_ID } from '../../guides/setupsGuideIds';
import {
  SETUPS_COMPARE_GUIDE_ID,
  SETUPS_COUNT_CONTEXT_KEY,
  SETUPS_DETAIL_GUIDE_ID,
  SETUPS_MAIN_GUIDE_ID,
} from '../../guides/setupsGuideIds';
import type { EventName } from '../../services/events';
import type { Setup, SetupMetricsResult } from '../../services/setup/types';
import type { SetupService } from '../../services/setup/SetupService';
import { buildSetupAdvancedAnalytics } from '../../services/setup/setupAdvancedAnalytics';
import { buildSetupOpportunityStats } from '../../services/setup/setupOpportunityStats';
import { getAnalyticsDateBasis } from '../../utils/tradeAnalyticsDate';
import { t } from '../../lang/helpers';
import { openCreateSetupModal, openEditSetupModal } from './CreateSetupModal';
import { SetupComparePage } from './SetupComparePage';
import {
  loadSetupMissedTradeData,
  openSetupsOverview,
  SetupDetailPage,
} from './SetupDetailPage';
import { SetupOverviewPage } from './SetupOverviewPage';
import { SetupViewSkeleton } from './SetupViewSkeleton';
import { buildSetupTradeIndex, getCompletenessBadges } from './setupsViewModel';
import { EMPTY_SETUP_METRICS, type SetupOutcome } from './setupOverviewScope';
import type {
  SetupOutcomeMetricsSource,
  SetupTradeIndex,
  SetupViewModel,
  SetupsViewState,
} from './setupsViewTypes';
import type { SetupOpportunityStats } from '../../services/setup/types';
import {
  normalizeSetupTradeTypes,
  type SetupTradeType,
} from '../../services/setup/setupTradeTypes';
import type { AnalyticsDateBasis } from '../../settings/types';
import {
  createSetupTradeOutcomeClassifier,
  type SetupTradeOutcomeClassifier,
} from '../../services/setup/setupTradeOutcome';
import {
  attachBreakEvenAccountBalancesToTrade,
  fetchBreakEvenAccountBalanceLookup,
} from '../../services/trade/core/BreakEvenAccountBalance';
import { Button } from '../ui/Button';

export type { SetupsViewState } from './setupsViewTypes';

interface SetupsViewContentProps {
  hoverParent: Component;
  plugin: JournalitPlugin;
  state: SetupsViewState;
  onStateChange: (state: SetupsViewState) => void;
}

const SETUPS_VIEW_REFRESH_EVENTS: EventName[] = [
  'setup:changed',
  'trade-data:changed',
  'missed-trade-data:changed',
  'backtest-trade:changed',
  'options:changed',
  'settings:changed',
  
  'account:changed',
];


interface SetupsLoadedData {
  setupService: SetupService;
  setups: Setup[];
  
  trades: Array<Record<string, unknown>>;
  classifyOutcome: SetupTradeOutcomeClassifier;
  defaultRiskAmount: number | undefined;
  analyticsDateBasis: AnalyticsDateBasis;
  
  opportunityStatsBySetupId: Record<string, SetupOpportunityStats>;
}

interface SetupsDataState {
  loaded: SetupsLoadedData | null;
  loadError: string | null;
  hasLoadedData: boolean;
}

interface SetupsViewData {
  viewModels: SetupViewModel[];
  tradeIndex: SetupTradeIndex;
  outcomeMetrics: SetupOutcomeMetricsSource;
}

const INITIAL_SETUPS_DATA_STATE: SetupsDataState = {
  loaded: null,
  loadError: null,
  hasLoadedData: false,
};

const EMPTY_SETUPS_VIEW_DATA: SetupsViewData = {
  viewModels: [],
  tradeIndex: { primary: new Map(), any: new Map() },
  outcomeMetrics: () => ({ metricsBySetupId: new Map(), tradeCount: 0 }),
};


function createOutcomeMetricsSource(
  loaded: SetupsLoadedData,
  tradeTypes: ReadonlySet<SetupTradeType>
): SetupOutcomeMetricsSource {
  const cache = new Map<SetupOutcome, SetupMetricsResult>();
  return (outcome) => {
    const cached = cache.get(outcome);
    if (cached) return cached;
    const metrics = loaded.setupService.getAllSetupMetricsFromTradeData(
      loaded.setups,
      loaded.trades,
      loaded.classifyOutcome,
      outcome,
      tradeTypes
    );
    cache.set(outcome, metrics);
    return metrics;
  };
}


function buildSetupsViewData(
  loaded: SetupsLoadedData,
  selectedTradeTypes: readonly SetupTradeType[]
): SetupsViewData {
  const tradeTypes = new Set(selectedTradeTypes);
  const { setups, trades, classifyOutcome } = loaded;
  const { metricsBySetupId } =
    loaded.setupService.getAllSetupMetricsFromTradeData(
      setups,
      trades,
      classifyOutcome,
      'all',
      tradeTypes
    );
  const advancedAnalytics = buildSetupAdvancedAnalytics(
    setups,
    trades,
    classifyOutcome,
    tradeTypes
  );
  return {
    viewModels: setups.map((setup) => ({
      setup,
      metrics: metricsBySetupId.get(setup.id) ?? EMPTY_SETUP_METRICS,
      advancedAnalytics: advancedAnalytics.bySetup[setup.id],
      opportunityStats: loaded.opportunityStatsBySetupId[setup.id],
      completenessBadges: getCompletenessBadges(setup),
    })),
    tradeIndex: buildSetupTradeIndex(
      setups,
      trades,
      loaded.defaultRiskAmount,
      loaded.analyticsDateBasis,
      classifyOutcome,
      tradeTypes
    ),
    outcomeMetrics: createOutcomeMetricsSource(loaded, tradeTypes),
  };
}


async function loadBreakEvenBalanceAttacher(
  plugin: JournalitPlugin
): Promise<<T>(trades: T[]) => T[]> {
  if (
    plugin.settings.trade?.breakEvenThresholdMode !==
    'percentage_current_balance'
  ) {
    return (trades) => trades;
  }
  const lookup = await fetchBreakEvenAccountBalanceLookup(plugin);
  return (trades) =>
    trades.map((trade) =>
      isTradeRecord(trade)
        ? attachBreakEvenAccountBalancesToTrade(trade, lookup)
        : trade
    );
}

function isTradeRecord<T>(value: T): value is T & Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}


const SetupsGuideResolution: React.FC<{ page: SetupsViewState['page'] }> = ({
  page,
}) => {
  const contextualGuides = useMemo(
    () => [
      { guideId: SETUPS_DETAIL_GUIDE_ID, active: page === 'detail' },
      { guideId: SETUPS_COMPARE_GUIDE_ID, active: page === 'compare' },
    ],
    [page]
  );
  useContextualGuideResolution({
    baseGuideId: SETUPS_MAIN_GUIDE_ID,
    contextualGuides,
  });
  return null;
};

function useSetupsGuideNavigation(
  state: SetupsViewState,
  viewModels: SetupViewModel[],
  onStateChange: (state: SetupsViewState) => void
): void {
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
}

const guideSetupCount = (
  hasLoadedData: boolean,
  viewModels: SetupViewModel[]
): number => (hasLoadedData ? viewModels.length : -1);

const setupsLoadErrorOf = (
  loadError: string | null,
  serviceError: Error | null | undefined
): string | null => loadError ?? serviceError?.message ?? null;

const linkedTradesOf = (tradeIndex: SetupTradeIndex, setupId: string) =>
  tradeIndex.any.get(setupId) ?? [];

const selectedSetupIdsOf = (state: SetupsViewState): string[] =>
  state.selectedSetupIds ?? [];

const SetupsCompareRoute: React.FC<{
  plugin: JournalitPlugin;
  viewModels: SetupViewModel[];
  tradeIndex: SetupTradeIndex;
  selectedSetupIds: string[];
  onBack: () => void;
}> = ({ plugin, viewModels, tradeIndex, selectedSetupIds, onBack }) => {
  const hasValidComparison =
    selectedSetupIds.length >= 2 &&
    selectedSetupIds.every((setupId) =>
      viewModels.some(({ setup }) => setup.id === setupId)
    );
  return (
    <>
      {hasValidComparison && <SetupsGuideResolution page="compare" />}
      <SetupComparePage
        displayRMultiples={plugin.settings.trade?.displayRMultiples ?? false}
        viewModels={viewModels}
        tradeIndex={tradeIndex}
        selectedSetupIds={selectedSetupIds}
        onBack={onBack}
      />
    </>
  );
};

const SetupsViewBody: React.FC<SetupsViewContentProps> = ({
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
  const { loaded, loadError, hasLoadedData } = dataState;
  const [tradeTypes, setTradeTypes] = useState<SetupTradeType[]>(() =>
    normalizeSetupTradeTypes(
      plugin.uiStateManager.getState().setupOverviewTradeTypes
    )
  );
  const handleTradeTypesChange = useCallback(
    (nextTradeTypes: SetupTradeType[]) => {
      const normalized = normalizeSetupTradeTypes(nextTradeTypes);
      setTradeTypes(normalized);
      void plugin.uiStateManager.updateState({
        setupOverviewTradeTypes: normalized,
      });
    },
    [plugin.uiStateManager]
  );
  const { viewModels, tradeIndex, outcomeMetrics } = useMemo(
    () =>
      loaded ? buildSetupsViewData(loaded, tradeTypes) : EMPTY_SETUPS_VIEW_DATA,
    [loaded, tradeTypes]
  );

  const loadData = useCallback(
    async (options?: { forceFresh?: boolean }) => {
      if (!setupService) return;

      setDataState((current) => ({ ...current, loadError: null }));
      try {
        await plugin.tradeService.waitForTradeDataReady();
        if (options?.forceFresh) {
          await setupService.clearCache();
        }
        const [setups, rawTrades, rawMissedTrades, attachBalances] =
          await Promise.all([
            setupService.listSetups(),
            
            plugin.tradeService.getTradeData(),
            loadSetupMissedTradeData(plugin),
            loadBreakEvenBalanceAttacher(plugin),
          ]);
        const trades = attachBalances([...rawTrades, ...rawMissedTrades]);
        const classifyOutcome = createSetupTradeOutcomeClassifier(
          plugin.settings.trade
        );
        const defaultRiskAmount = plugin.settings.trade?.defaultRiskAmount;
        setDataState({
          loaded: {
            setupService,
            setups,
            trades,
            classifyOutcome,
            defaultRiskAmount,
            analyticsDateBasis: getAnalyticsDateBasis(plugin.settings),
            opportunityStatsBySetupId: buildSetupOpportunityStats(
              setups,
              trades,
              classifyOutcome,
              defaultRiskAmount
            ),
          },
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
    guideSetupCount(hasLoadedData, viewModels)
  );

  const currentError = setupsLoadErrorOf(loadError, error);
  useSetupsGuideNavigation(state, viewModels, onStateChange);
  if (currentError) {
    return (
      <div className="journalit-setups-view">
        <div className="journalit-setups-error">
          <strong>{t('setups.view.error.title')}</strong>
          <p>{currentError}</p>
          <Button
            variant="secondary"
            size="small"
            className="journalit-setups-button"
            onClick={() => void loadData({ forceFresh: true })}
          >
            {t('setups.view.action.retry')}
          </Button>
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
    const selectedLinkedTrades = linkedTradesOf(
      tradeIndex,
      selectedSetup.setup.id
    );

    return (
      <>
        <SetupsGuideResolution page="detail" />
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
      </>
    );
  }

  if (state.page === 'detail') {
    
    return (
      <div className="journalit-setups-view">
        <div className="journalit-setups-error">
          {t('setups.view.error.load-failed')}
        </div>
      </div>
    );
  }

  if (state.page === 'compare') {
    return (
      <SetupsCompareRoute
        plugin={plugin}
        viewModels={viewModels}
        tradeIndex={tradeIndex}
        selectedSetupIds={selectedSetupIdsOf(state)}
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
    <>
      <SetupsGuideResolution page="overview" />
      <SetupOverviewPage
        plugin={plugin}
        viewModels={viewModels}
        tradeIndex={tradeIndex}
        outcomeMetrics={outcomeMetrics}
        tradeTypes={tradeTypes}
        onTradeTypesChange={handleTradeTypesChange}
        onOpenSetup={(setupId, setupName, setupPath) => {
          onStateChange({
            page: 'detail',
            setupId,
            setupPath,
            setupName,
          });
        }}
        selectedSetupIds={selectedSetupIdsOf(state)}
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
    </>
  );
};


export const SetupsViewContent: React.FC<SetupsViewContentProps> = (props) => (
  <SetupsViewBody {...props} />
);

SetupsViewContent.displayName = 'SetupsViewContent';
