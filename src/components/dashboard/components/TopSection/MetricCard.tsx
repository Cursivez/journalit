

import React from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Info,
} from '../../../shared/icons/ObsidianIcon';
import { Tooltip } from '../../../shared/Tooltip';
import { t } from '../../../../lang/helpers';
import type { StatDelta } from '../../../../utils/previousPeriodDelta';

interface MetricCardProps {
  
  headerAction?: React.ReactNode;
  name: string;
  value: string;
  valueSuffix?: string;
  valueSuffixIsPositive?: boolean;
  isPositive?: boolean;
  mainPart?: string; 
  decimalPart?: string; 
  tooltip?: React.ReactNode; 
  
  tooltipDisclosureLabel?: string;
  hasWarning?: boolean; 
  previousDelta?: StatDelta;
  subline?: string; 
  sublineIsPositive?: boolean;
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


const toneClassOf = (isPositive: boolean | undefined): string => {
  if (isPositive === undefined) return '';
  return isPositive ? 'positive' : 'negative';
};

const classNames = (...names: string[]) => names.filter(Boolean).join(' ');


const splitSuffixArrow = (
  suffix: string
): { direction: 'up' | 'down' | undefined; text: string } => {
  if (suffix.startsWith('↑')) {
    return { direction: 'up', text: suffix.slice(1).trimStart() };
  }
  if (suffix.startsWith('↓')) {
    return { direction: 'down', text: suffix.slice(1).trimStart() };
  }
  return { direction: undefined, text: suffix };
};

const DELTA_TONE_CLASS: Record<NonNullable<StatDelta['tone']>, string> = {
  green: 'journalit-dashboard-metric-previous-delta--positive',
  red: 'journalit-dashboard-metric-previous-delta--negative',
};

const MetricCardIcons: React.FC<{
  tooltip: React.ReactNode;
  tooltipDisclosureLabel: string | undefined;
  hasWarning: boolean;
}> = ({ tooltip, tooltipDisclosureLabel, hasWarning }) => {
  if (tooltip && tooltipDisclosureLabel) {
    return (
      <Tooltip
        content={tooltip}
        delay={200}
        preferredPosition="bottom"
        disclosureLabel={tooltipDisclosureLabel}
        triggerClassName="journalit-dashboard-metric-icons-trigger"
      >
        <Info
          size={10}
          className="journalit-dashboard-metric-info"
          aria-hidden="true"
        />
        {hasWarning && (
          <AlertTriangle
            size={10}
            className="journalit-dashboard-metric-warning"
            aria-hidden="true"
          />
        )}
      </Tooltip>
    );
  }
  return (
    <>
      {tooltip && (
        <Info size={10} className="journalit-dashboard-metric-info" />
      )}
      {hasWarning && (
        <AlertTriangle
          size={10}
          className="journalit-dashboard-metric-warning"
        />
      )}
    </>
  );
};

const MetricCardSuffix: React.FC<{
  suffix: string;
  isPositive: boolean | undefined;
  hasCents: boolean;
}> = ({ suffix, isPositive, hasCents }) => {
  const { direction, text } = splitSuffixArrow(suffix);
  return (
    <span
      dir="ltr"
      className={classNames(
        'journalit-dashboard-metric-suffix',
        toneClassOf(isPositive),
        hasCents
          ? 'journalit-dashboard-metric-suffix--with-cents'
          : 'journalit-dashboard-metric-suffix--without-cents'
      )}
    >
      {direction && <DeltaArrow direction={direction} />}
      {text}
    </span>
  );
};

const MetricCardPrimaryValue: React.FC<{
  value: string;
  mainPart: string | undefined;
  decimalPart: string | undefined;
}> = ({ value, mainPart, decimalPart }) => (
  <span className="journalit-dashboard-metric-primary" dir="ltr">
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
);

const MetricPreviousDelta: React.FC<{ delta: StatDelta }> = ({ delta }) => (
  <div
    className={classNames(
      'journalit-dashboard-metric-previous-delta',
      delta.tone ? DELTA_TONE_CLASS[delta.tone] : ''
    )}
  >
    {delta.direction !== 'flat' && <DeltaArrow direction={delta.direction} />}
    <span dir="ltr">{delta.value}</span>
    <span className="journalit-dashboard-metric-previous-delta-suffix">
      {t(delta.suffixKey ?? 'widget.stats.vs-prev')}
    </span>
  </div>
);


export const MetricCard: React.FC<MetricCardProps> = ({
  headerAction,
  name,
  value,
  valueSuffix,
  valueSuffixIsPositive,
  isPositive,
  mainPart,
  decimalPart,
  tooltip,
  tooltipDisclosureLabel,
  hasWarning = false,
  previousDelta,
  subline,
  sublineIsPositive,
}) => {
  const metricCard = (
    <div className="journalit-dashboard-metric-card">
      <div className="journalit-dashboard-metric-name">
        {name}
        <MetricCardIcons
          tooltip={tooltip}
          tooltipDisclosureLabel={tooltipDisclosureLabel}
          hasWarning={hasWarning}
        />
        {headerAction}
      </div>
      <div
        className={`journalit-dashboard-metric-value ${toneClassOf(isPositive)}`}
      >
        <MetricCardPrimaryValue
          value={value}
          mainPart={mainPart}
          decimalPart={decimalPart}
        />
        {valueSuffix && (
          <MetricCardSuffix
            suffix={valueSuffix}
            isPositive={valueSuffixIsPositive}
            hasCents={Boolean(decimalPart)}
          />
        )}
      </div>
      {subline && (
        <div
          className={classNames(
            'journalit-dashboard-metric-unrealized',
            toneClassOf(sublineIsPositive)
          )}
        >
          {subline}
        </div>
      )}
      <div
        className="journalit-dashboard-metric-previous-delta-slot"
        aria-hidden={previousDelta ? undefined : true}
      >
        {previousDelta && <MetricPreviousDelta delta={previousDelta} />}
      </div>
    </div>
  );

  return (
    <div className="journalit-dashboard-metric-card-frame">
      {tooltip && !tooltipDisclosureLabel ? (
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
