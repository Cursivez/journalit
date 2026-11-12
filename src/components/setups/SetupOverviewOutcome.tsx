
import React from 'react';
import type { SetupOutcomeScope } from '../../services/setup/types';
import { t, type TranslationKey } from '../../lang/helpers';
import { SegmentedControl } from '../shared/SegmentedControl';
import { DisplayValue } from '../shared/display/DisplayValue';
import type { METRIC_OPTIONS } from './setupOverviewMetrics';
import type { SetupOutcome } from './setupOverviewScope';
import type { SetupViewModel } from './setupsViewTypes';
import { SetupTradeCount } from './SetupTradeCount';


export const OUTCOME_METRIC_LABEL_KEY = {
  wins: 'setups.view.overview.outcome.metric.wins',
  losses: 'setups.view.overview.outcome.metric.losses',
} as const satisfies Record<SetupOutcome, TranslationKey>;

const OUTCOME_COUNT_KEY = {
  wins: 'setups.view.overview.outcome.count.wins',
  losses: 'setups.view.overview.outcome.count.losses',
} as const satisfies Record<SetupOutcome, TranslationKey>;

export const SetupOutcomeScopeControl: React.FC<{
  value: SetupOutcomeScope;
  onChange: (value: SetupOutcomeScope) => void;
}> = ({ value, onChange }) => (
  <SegmentedControl<SetupOutcomeScope>
    ariaLabel={t('setups.view.overview.outcome.aria')}
    className="journalit-setups-performance-widget__outcome-control"
    groupRole="radiogroup"
    size="small"
    value={value}
    options={[
      { value: 'all', label: t('setups.view.overview.outcome.all') },
      { value: 'wins', label: t('setups.view.overview.outcome.wins') },
      { value: 'losses', label: t('setups.view.overview.outcome.losses') },
    ]}
    onChange={onChange}
  />
);

SetupOutcomeScopeControl.displayName = 'SetupOutcomeScopeControl';


export const SetupOutcomeSummary: React.FC<{
  leader: SetupViewModel | null;
  leaderMetricValue: number | null;
  metric: (typeof METRIC_OPTIONS)[number];
  outcome: SetupOutcome;
  tradeCount: number;
}> = ({ leader, leaderMetricValue, metric, outcome, tradeCount }) => (
  <div
    className="journalit-setups-performance-summary"
    aria-label={t('setups.view.summary.aria')}
  >
    <span>{t(OUTCOME_COUNT_KEY[outcome], { count: String(tradeCount) })}</span>
    <span>
      {t('setups.view.overview.outcome.largest')}:{' '}
      <strong>{leader?.setup.name ?? '—'}</strong>
    </span>
    {leader ? (
      <span className="journalit-setups-performance-summary__meta">
        <DisplayValue
          kind={metric.displayKind}
          value={leaderMetricValue}
          precision={metric.precision ?? 2}
          tone="none"
        />{' '}
        {t(metric.labelKey)}
        {metric.key === 'totalTrades' ? null : (
          <>
            <span aria-hidden="true">·</span>
            <SetupTradeCount count={leader.metrics.totalTrades} />
          </>
        )}
      </span>
    ) : null}
  </div>
);

SetupOutcomeSummary.displayName = 'SetupOutcomeSummary';
