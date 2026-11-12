

import React, { useLayoutEffect, useRef, useState } from 'react';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Info,
} from '../../../shared/icons/ObsidianIcon';
import { Tooltip } from '../../../shared/Tooltip';
import { t, tPlural } from '../../../../lang/helpers';
import type { StatDelta } from '../../../../utils/previousPeriodDelta';


export interface MetricCardValue {
  value: string;
  isPositive?: boolean;
  mainPart?: string;
  decimalPart?: string;
  
  lowSampleTrades?: number;
}

interface MetricCardProps {
  
  headerAction?: React.ReactNode;
  name: string;
  value: string;
  isPositive?: boolean;
  mainPart?: string; 
  decimalPart?: string; 
  tooltip?: React.ReactNode; 
  
  tooltipDisclosureLabel?: string;
  hasWarning?: boolean; 
  previousDelta?: StatDelta;
  subline?: string; 
  sublineIsPositive?: boolean;
  
  compare?: { a: MetricCardValue; b: MetricCardValue };
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


const LowSampleMarker: React.FC<{ trades: number }> = ({ trades }) => {
  const label = tPlural('dashboard.compare.low-sample', trades);
  return (
    <span
      className="journalit-compare-low-sample"
      role="img"
      tabIndex={0}
      aria-label={label}
    >
      <AlertTriangle size={13} aria-hidden="true" />
    </span>
  );
};

const CompareValue: React.FC<{
  side: 'a' | 'b';
  value: MetricCardValue;
}> = ({ side, value }) => (
  <div className="journalit-compare-metric-value">
    <span
      className={`journalit-compare-tag journalit-compare-tag--${side}`}
      aria-label={t('dashboard.compare.filter-side', {
        side: side === 'a' ? 'A' : 'B',
      })}
    >
      {side === 'a' ? 'A' : 'B'}
    </span>
    <div
      className={`journalit-dashboard-metric-value ${toneClassOf(value.isPositive)}`}
    >
      <MetricCardPrimaryValue
        value={value.value}
        mainPart={value.mainPart}
        decimalPart={value.decimalPart}
      />
      {value.lowSampleTrades !== undefined && (
        <LowSampleMarker trades={value.lowSampleTrades} />
      )}
    </div>
  </div>
);


const MIN_COMPARE_VALUE_SCALE = 0.5;


const CompareValues: React.FC<{ a: MetricCardValue; b: MetricCardValue }> = ({
  a,
  b,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const fit = () => {
      let next = 1;
      for (const value of element.querySelectorAll<HTMLElement>(
        '.journalit-dashboard-metric-value'
      )) {
        
        
        const parts = Array.from(value.children);
        const gap = parseFloat(getComputedStyle(value).columnGap) || 0;
        const content =
          parts.reduce(
            (width, part) => width + part.getBoundingClientRect().width,
            0
          ) +
          gap * Math.max(parts.length - 1, 0);
        const neededAtFullSize = content / scale;
        if (neededAtFullSize > value.clientWidth) {
          next = Math.min(next, value.clientWidth / neededAtFullSize);
        }
      }
      next = Math.max(MIN_COMPARE_VALUE_SCALE, Math.floor(next * 100) / 100);
      setScale((current) => (Math.abs(current - next) < 0.01 ? current : next));
    };
    fit();
    const observer = new (
      element.ownerDocument.defaultView ?? window
    ).ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, [a, b, scale]);
  return (
    <div
      ref={ref}
      className="journalit-compare-metric-values"
      style={cssVars({ '--journalit-compare-value-scale': scale })}
    >
      <CompareValue side="a" value={a} />
      <CompareValue side="b" value={b} />
    </div>
  );
};


export const MetricCard: React.FC<MetricCardProps> = ({
  headerAction,
  name,
  value,
  isPositive,
  mainPart,
  decimalPart,
  tooltip,
  tooltipDisclosureLabel,
  hasWarning = false,
  previousDelta,
  subline,
  sublineIsPositive,
  compare,
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
      {compare ? (
        <CompareValues a={compare.a} b={compare.b} />
      ) : (
        <div
          className={`journalit-dashboard-metric-value ${toneClassOf(isPositive)}`}
        >
          <MetricCardPrimaryValue
            value={value}
            mainPart={mainPart}
            decimalPart={decimalPart}
          />
        </div>
      )}
      {subline && !compare && (
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
