
import React, { useEffect, useMemo } from 'react';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import {
  PAIR_R_METRIC_KEYS,
  SETUP_PAIR_METRIC_OPTIONS,
  SETUP_PAIR_MIN_TRADES,
} from './setupOverviewMetrics';
import type {
  SetupPairMetricKey,
  SetupTradeIndex,
  SetupViewModel,
} from './setupsViewTypes';
import {
  buildSetupPairSummary,
  buildSetupPairViewModels,
  buildSetupPairRankingChartData,
  sortSetupPairViewModels,
} from './setupsViewModel';

export function useSetupPairPerformanceModel({
  displayRMultiples,
  pairMetricKey,
  selectedPairKey,
  tradeIndex,
  viewModels,
}: {
  displayRMultiples: boolean;
  pairMetricKey: SetupPairMetricKey;
  selectedPairKey: string | null;
  tradeIndex: SetupTradeIndex;
  viewModels: SetupViewModel[];
}) {
  const { shouldMask } = useDisplayFormatter();
  const pairModels = useMemo(
    () => buildSetupPairViewModels(viewModels, tradeIndex),
    [tradeIndex, viewModels]
  );
  const eligiblePairModels = useMemo(
    () =>
      pairModels.filter(
        (pair) => pair.metrics.totalTrades >= SETUP_PAIR_MIN_TRADES
      ),
    [pairModels]
  );
  const effectivePairMetricKey =
    displayRMultiples || !PAIR_R_METRIC_KEYS.has(pairMetricKey)
      ? pairMetricKey
      : 'profitFactor';
  const pairMetric =
    SETUP_PAIR_METRIC_OPTIONS.find(
      (option) => option.key === effectivePairMetricKey
    ) ?? SETUP_PAIR_METRIC_OPTIONS[0];
  const isPairChartMasked =
    pairMetric.displayKind !== 'count' && shouldMask(pairMetric.displayKind);
  const sortedPairModels = useMemo(
    () =>
      sortSetupPairViewModels(
        eligiblePairModels,
        effectivePairMetricKey,
        isPairChartMasked
      ),
    [effectivePairMetricKey, eligiblePairModels, isPairChartMasked]
  );
  const pairChartData = useMemo(
    () =>
      buildSetupPairRankingChartData(
        sortedPairModels,
        effectivePairMetricKey,
        isPairChartMasked
      ),
    [effectivePairMetricKey, isPairChartMasked, sortedPairModels]
  );
  const selectedPair = useMemo(
    () =>
      selectedPairKey
        ? (sortedPairModels.find((pair) => pair.key === selectedPairKey) ??
          sortedPairModels[0] ??
          null)
        : (sortedPairModels[0] ?? null),
    [selectedPairKey, sortedPairModels]
  );
  const pairSummary = useMemo(
    () => buildSetupPairSummary(eligiblePairModels),
    [eligiblePairModels]
  );

  return {
    effectivePairMetricKey,
    isPairChartMasked,
    pairChartData,
    pairMetric,
    pairSummary,
    selectedPair,
    sortedPairModels,
  };
}

export function useCloseSetupChartMenusOnOutsidePointer(
  metricMenuOpen: boolean,
  setupMenuOpen: boolean,
  metricMenuRef: React.RefObject<HTMLDivElement | null>,
  setupMenuRef: React.RefObject<HTMLDivElement | null>,
  closeMenus: () => void
): void {
  useEffect(() => {
    if (!metricMenuOpen && !setupMenuOpen) return undefined;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (metricMenuRef.current?.contains(target)) return;
      if (setupMenuRef.current?.contains(target)) return;
      closeMenus();
    };

    const listenerDocument = window.activeDocument;
    listenerDocument.addEventListener('pointerdown', handlePointerDown);
    return () =>
      listenerDocument.removeEventListener('pointerdown', handlePointerDown);
  }, [closeMenus, metricMenuOpen, metricMenuRef, setupMenuOpen, setupMenuRef]);
}
