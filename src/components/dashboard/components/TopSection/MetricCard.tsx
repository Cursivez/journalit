

import React from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Info,
} from '../../../shared/icons/ObsidianIcon';
import { Tooltip } from '../../../shared';
import { t } from '../../../../lang/helpers';
import type { StatDelta } from '../../../../utils/previousPeriodDelta';

interface MetricCardProps {
  name: string;
  value: string;
  valueSuffix?: string;
  valueSuffixIsPositive?: boolean;
  isPositive?: boolean;
  mainPart?: string; 
  decimalPart?: string; 
  tooltip?: React.ReactNode; 
  hasWarning?: boolean; 
  previousDelta?: StatDelta;
}

const DeltaArrow: React.FC<{ direction: 'up' | 'down' }> = ({ direction }) => {
  const ArrowIcon = direction === 'up' ? ArrowUp : ArrowDown;
  return (
    <ArrowIcon
      className={[
        'journalit-dashboard-metric-previous-delta-arrow',
        direction === 'up'
          ? 'journalit-dashboard-metric-previous-delta-arrow--up'
          : 'journalit-dashboard-metric-previous-delta-arrow--down',
      ].join(' ')}
      size={12}
      strokeWidth={3.5}
      aria-hidden="true"
    />
  );
};


export const MetricCard: React.FC<MetricCardProps> = ({
  name,
  value,
  valueSuffix,
  valueSuffixIsPositive,
  isPositive,
  mainPart,
  decimalPart,
  tooltip,
  hasWarning = false,
  previousDelta,
}) => {
  const valueSuffixDirection = valueSuffix?.startsWith('↑')
    ? 'up'
    : valueSuffix?.startsWith('↓')
      ? 'down'
      : undefined;
  const valueSuffixWithoutArrow = valueSuffixDirection
    ? valueSuffix?.slice(1).trimStart()
    : valueSuffix;
  const toneClass =
    isPositive !== undefined ? (isPositive ? 'positive' : 'negative') : '';
  const suffixToneClass =
    valueSuffixIsPositive !== undefined
      ? valueSuffixIsPositive
        ? 'positive'
        : 'negative'
      : '';

  const metricCard = (
    <div className="journalit-dashboard-metric-card">
      <div className="journalit-dashboard-metric-name">
        {name}
        {tooltip && (
          <Info size={10} className="journalit-dashboard-metric-info" />
        )}
        {hasWarning && (
          <AlertTriangle
            size={10}
            className="journalit-dashboard-metric-warning"
          />
        )}
      </div>
      <div className={`journalit-dashboard-metric-value ${toneClass}`}>
        <span className="journalit-dashboard-metric-primary">
          {mainPart ? (
            <>
              {mainPart}
              {decimalPart && (
                <span className="journalit-dashboard-metric-cents">
                  {decimalPart}
                </span>
              )}
            </>
          ) : (
            value
          )}
        </span>
        {valueSuffix && (
          <span
            className={[
              'journalit-dashboard-metric-suffix',
              suffixToneClass,
              decimalPart
                ? 'journalit-dashboard-metric-suffix--with-cents'
                : 'journalit-dashboard-metric-suffix--without-cents',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {valueSuffixDirection && (
              <DeltaArrow direction={valueSuffixDirection} />
            )}
            {valueSuffixWithoutArrow}
          </span>
        )}
      </div>
      <div
        className="journalit-dashboard-metric-previous-delta-slot"
        aria-hidden={previousDelta ? undefined : true}
      >
        {previousDelta && (
          <div
            className={[
              'journalit-dashboard-metric-previous-delta',
              previousDelta.tone === 'green'
                ? 'journalit-dashboard-metric-previous-delta--positive'
                : previousDelta.tone === 'red'
                  ? 'journalit-dashboard-metric-previous-delta--negative'
                  : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {previousDelta.direction !== 'flat' && (
              <DeltaArrow direction={previousDelta.direction} />
            )}
            <span>{previousDelta.value}</span>
            <span className="journalit-dashboard-metric-previous-delta-suffix">
              {t(previousDelta.suffixKey ?? 'widget.stats.vs-prev')}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="journalit-dashboard-metric-card-frame">
      {tooltip ? (
        <Tooltip
          content={tooltip}
          delay={200}
          preferredPosition="bottom"
          block={true}
        >
          {metricCard}
        </Tooltip>
      ) : (
        metricCard
      )}
    </div>
  );
};
