
import React, { useMemo } from 'react';
import { t } from '../../lang/helpers';
import type { SetupTimesSeenPoint } from '../charts/SetupTimesSeenChart';
import {
  getOverviewChartHeight,
  SetupPerformanceEmptyState,
  type SetupPerformanceHeaderRenderer,
} from './SetupOverviewPerformanceChrome';
import {
  buildSetupTimesSeenChartData,
  getMostSkippedSetup,
} from './setupOverviewScope';
import type { SetupViewModel } from './setupsViewTypes';

const LazySetupTimesSeenChart = React.lazy(async () => {
  const module = await import('../charts/SetupTimesSeenChart');
  return { default: module.SetupTimesSeenChart };
});

export const SetupTimesSeenPanel: React.FC<{
  viewModels: SetupViewModel[];
  renderHeader: SetupPerformanceHeaderRenderer;
  onSetupSelected: (setupId: string) => void;
}> = ({ viewModels, renderHeader, onSetupSelected }) => {
  const points = useMemo(
    () => buildSetupTimesSeenChartData(viewModels),
    [viewModels]
  );
  const hasData = points.some(({ seen }) => seen > 0);

  return (
    <>
      {renderHeader({
        summary: <SetupTimesSeenSummary points={points} />,
        metricKey: 'timesSeen',
        metricLabel: t('setups.view.metric.times-seen'),
        showOutcomeControl: false,
      })}
      {hasData ? (
        <div className="journalit-chart-widget__body journalit-setups-performance-widget__body">
          <React.Suspense
            fallback={
              <div className="journalit-setups-empty">
                {t('common.loading')}
              </div>
            }
          >
            <LazySetupTimesSeenChart
              data={points}
              height={getOverviewChartHeight(points.length)}
              onPointClick={onSetupSelected}
            />
          </React.Suspense>
        </div>
      ) : (
        <SetupPerformanceEmptyState reason="timesSeen" />
      )}
    </>
  );
};

SetupTimesSeenPanel.displayName = 'SetupTimesSeenPanel';


const SetupTimesSeenSummary: React.FC<{
  points: SetupTimesSeenPoint[];
}> = ({ points }) => {
  const mostSkipped = getMostSkippedSetup(points);
  return (
    <div
      className="journalit-setups-performance-summary"
      aria-label={t('setups.view.summary.aria')}
    >
      <span className="journalit-setups-times-seen-legend">
        <span className="journalit-chart-widget__legend-item">
          <span
            className="journalit-setups-times-seen-legend__swatch journalit-setups-times-seen-legend__swatch--taken"
            aria-hidden="true"
          />
          {t('setups.view.times-seen.taken')}
        </span>
        <span className="journalit-chart-widget__legend-item">
          <span
            className="journalit-setups-times-seen-legend__swatch journalit-setups-times-seen-legend__swatch--missed"
            aria-hidden="true"
          />
          {t('setups.view.times-seen.missed')}
        </span>
      </span>
      {mostSkipped ? (
        <>
          <span>
            {t('setups.view.times-seen.most-skipped')}:{' '}
            <strong>{mostSkipped.name}</strong>
          </span>
          <span className="journalit-setups-performance-summary__meta">
            {t('setups.view.times-seen.not-taken', {
              missed: String(mostSkipped.missed),
              seen: String(mostSkipped.seen),
            })}
          </span>
        </>
      ) : (
        <span>{t('setups.view.times-seen.none-missed')}</span>
      )}
    </div>
  );
};

SetupTimesSeenSummary.displayName = 'SetupTimesSeenSummary';
