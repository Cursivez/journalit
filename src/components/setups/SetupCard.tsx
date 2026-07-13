import React, { useMemo } from 'react';

import { t } from '../../lang/helpers';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';

import { Calendar, CheckCircle2, Circle } from '../shared/icons/ObsidianIcon';
import { MetricValue, PnLValue, RMultipleValue } from '../shared/display';
import type {
  SetupCardHealth,
  SetupCardTone,
  SetupLinkedTrade,
  SetupSparklineModel,
  SetupViewModel,
} from './setupsViewTypes';
import {
  buildSetupSparklineModel,
  calculateAverageRMultiple,
  formatRelativeDateLabel,
  getSetupCardExpectancyTone,
  getSetupCardHealth,
  getSetupCardHealthLabel,
  getSetupSparklineTone,
} from './setupsViewModel';

const MASKED_SPARKLINE_BASELINE_Y = '34';
const MASKED_SPARKLINE_PATH = 'M 8.0 34.0 L 312.0 34.0';

export const SetupCard: React.FC<{
  viewModel: SetupViewModel;
  linkedTrades: SetupLinkedTrade[];
  displayRMultiples: boolean;
  compareMode: boolean;
  compareSelected: boolean;
  compareDisabled: boolean;
  onOpen: () => void;
  onToggleCompare: () => void;
}> = ({
  viewModel,
  linkedTrades,
  displayRMultiples,
  compareMode,
  compareSelected,
  compareDisabled,
  onOpen,
  onToggleCompare,
}) => {
  const { setup, metrics } = viewModel;
  const { shouldMask } = useDisplayFormatter();
  const isPerformanceMasked = shouldMask('rMultiple') || shouldMask('metric');
  const health = isPerformanceMasked ? null : getSetupCardHealth(viewModel);
  const expectancyValue = displayRMultiples
    ? calculateAverageRMultiple(linkedTrades)
    : metrics.expectedValue;
  const expectancyTone = getSetupCardExpectancyTone(
    expectancyValue,
    isPerformanceMasked
  );
  const sparklineModel = useMemo(
    () => buildSetupSparklineModel(linkedTrades, displayRMultiples),
    [displayRMultiples, linkedTrades]
  );
  const sparklineTone = isPerformanceMasked
    ? 'neutral'
    : getSetupSparklineTone(sparklineModel);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (compareMode) {
        if (!compareDisabled) onToggleCompare();
        return;
      }
      onOpen();
    }
  };

  const handleSetupCardActivation = () => {
    if (compareMode) {
      if (!compareDisabled) onToggleCompare();
      return;
    }
    onOpen();
  };

  return (
    <article
      className={[
        'journalit-setup-card',
        `journalit-setup-card--lifecycle-${setup.status}`,
        compareMode ? 'journalit-setup-card--compare-mode' : '',
        compareSelected ? 'journalit-setup-card--compare-selected' : '',
        compareDisabled ? 'journalit-setup-card--compare-disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="button"
      tabIndex={0}
      aria-pressed={compareMode ? compareSelected : undefined}
      onClick={handleSetupCardActivation}
      onKeyDown={handleKeyDown}
      aria-label={
        compareMode
          ? t('setups.view.card.select-for-compare')
          : t('setups.view.card.open-named', { name: setup.name })
      }
    >
      <div className="journalit-setup-card__header">
        <div className="journalit-setup-card__identity">
          <h3 className="journalit-setup-card__title">{setup.name}</h3>
        </div>
        {compareMode ? (
          <span
            className="journalit-setup-card__compare-indicator"
            aria-hidden="true"
          >
            {compareSelected ? (
              <CheckCircle2 size={16} />
            ) : (
              <Circle size={16} />
            )}
          </span>
        ) : health ? (
          <SetupCardHealthBadge health={health} />
        ) : null}
      </div>

      <div className="journalit-setup-card__metric-row">
        <div className="journalit-setup-card__metric-block journalit-setup-card__metric-block--hero">
          <span className="journalit-setup-card__metric-label">
            {t('setups.view.metric.expected-value')}
          </span>
          {displayRMultiples ? (
            <RMultipleValue
              className={[
                'journalit-setup-card__expectancy-value',
                `journalit-setup-card__expectancy-value--${expectancyTone}`,
              ].join(' ')}
              value={expectancyValue}
              precision={1}
              tone="none"
            />
          ) : (
            <PnLValue
              className={[
                'journalit-setup-card__expectancy-value',
                `journalit-setup-card__expectancy-value--${expectancyTone}`,
              ].join(' ')}
              value={expectancyValue}
              precision={0}
              tone="none"
            />
          )}
        </div>
        <div className="journalit-setup-card__metric-block journalit-setup-card__metric-block--win-rate">
          <span className="journalit-setup-card__metric-label">
            {t('setups.view.metric.profit-factor')}
          </span>
          <MetricValue
            className="journalit-setup-card__win-rate-value"
            kind="metric"
            value={metrics.profitFactor}
            precision={2}
            tone="none"
          />
        </div>
      </div>

      <SetupSparkline
        setupId={setup.id}
        model={sparklineModel}
        tone={sparklineTone}
        isMasked={isPerformanceMasked}
      />

      <div className="journalit-setup-card__footer">
        <span className="journalit-setup-card__reviewed">
          <Calendar size={14} aria-hidden="true" />
          <span>
            {t('setups.view.metric.last-traded')}:{' '}
            {metrics.totalTrades > 0
              ? formatRelativeDateLabel(metrics.lastTradeDate)
              : t('setups.view.date.never')}
          </span>
        </span>
        <span className="journalit-setup-card__trades">
          <MetricValue kind="count" value={metrics.totalTrades} tone="none" />{' '}
          {t('setups.view.metric.trades')}
        </span>
      </div>
    </article>
  );
};

SetupCard.displayName = 'SetupCard';

const SetupCardHealthBadge: React.FC<{ health: SetupCardHealth }> = ({
  health,
}) => (
  <span
    className={[
      'journalit-setup-card__status',
      `journalit-setup-card__status--${health}`,
    ].join(' ')}
  >
    <span>{getSetupCardHealthLabel(health)}</span>
    <span className="journalit-setup-card__status-dot" aria-hidden="true" />
  </span>
);

SetupCardHealthBadge.displayName = 'SetupCardHealthBadge';

const SetupSparkline: React.FC<{
  setupId: string;
  model: SetupSparklineModel;
  tone: SetupCardTone;
  isMasked: boolean;
}> = ({ setupId, model, tone, isMasked }) => {
  const gradientPrefix = `journalit-setup-sparkline-gradient-${setupId.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  const positiveGradientId = `${gradientPrefix}-positive`;
  const negativeGradientId = `${gradientPrefix}-negative`;
  const baselineY = isMasked
    ? MASKED_SPARKLINE_BASELINE_Y
    : model.zeroY.toFixed(1);
  return (
    <svg
      className={[
        'journalit-setup-card__sparkline',
        `journalit-setup-card__sparkline--${tone}`,
      ].join(' ')}
      viewBox="0 0 320 68"
      preserveAspectRatio="none"
      role="img"
      aria-label={t('setups.view.card.sparkline-aria')}
      focusable="false"
    >
      <defs>
        <linearGradient id={positiveGradientId} x1="0" x2="0" y1="0" y2="1">
          <stop
            className="journalit-setup-card__sparkline-gradient-start journalit-setup-card__sparkline-gradient-start--positive"
            offset="0%"
          />
          <stop
            className="journalit-setup-card__sparkline-gradient-end"
            offset="100%"
          />
        </linearGradient>
        <linearGradient id={negativeGradientId} x1="0" x2="0" y1="0" y2="1">
          <stop
            className="journalit-setup-card__sparkline-gradient-end"
            offset="0%"
          />
          <stop
            className="journalit-setup-card__sparkline-gradient-start journalit-setup-card__sparkline-gradient-start--negative"
            offset="100%"
          />
        </linearGradient>
      </defs>
      <line
        className="journalit-setup-card__sparkline-baseline"
        x1="0"
        x2="320"
        y1={baselineY}
        y2={baselineY}
      />
      {isMasked ? (
        <path
          className="journalit-setup-card__sparkline-line journalit-setup-card__sparkline-line--masked"
          d={MASKED_SPARKLINE_PATH}
        />
      ) : (
        <>
          {model.positiveAreaPaths.map((path) => (
            <path
              className="journalit-setup-card__sparkline-area journalit-setup-card__sparkline-area--positive"
              d={path}
              fill={`url(#${positiveGradientId})`}
              key={`positive-area-${path}`}
            />
          ))}
          {model.negativeAreaPaths.map((path) => (
            <path
              className="journalit-setup-card__sparkline-area journalit-setup-card__sparkline-area--negative"
              d={path}
              fill={`url(#${negativeGradientId})`}
              key={`negative-area-${path}`}
            />
          ))}
          {model.positivePaths.map((path) => (
            <path
              className="journalit-setup-card__sparkline-line journalit-setup-card__sparkline-line--positive"
              d={path}
              key={`positive-${path}`}
            />
          ))}
          {model.negativePaths.map((path) => (
            <path
              className="journalit-setup-card__sparkline-line journalit-setup-card__sparkline-line--negative"
              d={path}
              key={`negative-${path}`}
            />
          ))}
          {model.neutralPaths.map((path) => (
            <path
              className="journalit-setup-card__sparkline-line journalit-setup-card__sparkline-line--neutral"
              d={path}
              key={`neutral-${path}`}
            />
          ))}
        </>
      )}
    </svg>
  );
};

SetupSparkline.displayName = 'SetupSparkline';
