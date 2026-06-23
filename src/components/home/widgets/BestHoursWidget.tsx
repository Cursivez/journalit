

import React, { memo, useMemo } from 'react';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import { useFilteredByPeriod } from '../context/HomePeriodContext';
import { usePlugin } from '../../../hooks/usePlugin';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../shared/display/CurrencyConversionInfo';
import { isPnlContributingTrade } from '../../../utils/tradeStatusUtils';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { t } from '../../../lang/helpers';
import { normalizeBreakEvenRange } from '../../../utils/breakEvenRange';
import {
  aggregateEntryTimeBuckets,
  formatMinuteOfDay,
  selectBestEntryWindow,
} from './bestHoursUtils';
import type { BucketStats, TimeBucket } from './bestHoursUtils';

const LOW_SAMPLE_TRADE_THRESHOLD = 5;

function BestHoursLoadingState() {
  return (
    <div className="journalit-home-best-hours">
      <SkeletonText width="70px" height="11px" />
      <div className="journalit-home-best-hours__loading-hero">
        <SkeletonBox width={80} height={28} borderRadius="8px" />
        <SkeletonText width="100px" height="13px" />
      </div>
      <div className="journalit-home-best-hours__loading-timeline">
        <SkeletonBox width="100%" height={20} borderRadius="10px" />
        <div className="journalit-home-best-hours__loading-labels">
          <SkeletonText width="30px" height="10px" />
          <SkeletonText width="30px" height="10px" />
          <SkeletonText width="30px" height="10px" />
        </div>
      </div>
    </div>
  );
}

function BestHoursEmptyState() {
  return (
    <div className="journalit-home-best-hours">
      <div className="journalit-home-widget__eyebrow">
        {t('home.widget.best-hours.title')}
      </div>
      <div className="journalit-home-best-hours__empty">
        <span className="journalit-home-widget__muted">
          {t('home.widget.best-hours.no-data')}
        </span>
      </div>
    </div>
  );
}

interface BestHoursTimelineProps {
  buckets: TimeBucket[];
  bucketStats: BucketStats[];
  bestBucket: BucketStats | null;
  hoveredBucket: string | null;
  hoveredStats: BucketStats | null;
  rangeStartMinute: number;
  rangeEndMinute: number;
  maxPnL: number;
  minPnL: number;
  isPnlMasked: boolean;
  isReturnPercentMasked: boolean;
  effectiveCurrency: string;
  setHoveredBucket: (bucket: string | null) => void;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
}

function BestHoursTimeline({
  buckets,
  bucketStats,
  bestBucket,
  hoveredBucket,
  hoveredStats,
  rangeStartMinute,
  rangeEndMinute,
  maxPnL,
  minPnL,
  isPnlMasked,
  isReturnPercentMasked,
  effectiveCurrency,
  setHoveredBucket,
  formatValue,
}: BestHoursTimelineProps) {
  const getTimelinePosition = (
    bucket: TimeBucket
  ): { left: number; width: number } => {
    const duration = rangeEndMinute - rangeStartMinute;
    const left = ((bucket.startMinute - rangeStartMinute) / duration) * 100;
    const width = ((bucket.endMinute - bucket.startMinute) / duration) * 100;
    return { left, width };
  };

  const durationMinutes = rangeEndMinute - rangeStartMinute;
  const labelIntervalMinutes =
    durationMinutes > 12 * 60 ? 6 * 60 : durationMinutes > 4 * 60 ? 2 * 60 : 60;
  const labelMinutes = buckets.flatMap((bucket, index) => {
    const isFirst = index === 0;
    const isInterval = bucket.startMinute % labelIntervalMinutes === 0;
    return isFirst || isInterval ? [bucket.startMinute] : [];
  });

  return (
    <div className="journalit-home-best-hours__timeline">
      <div className="journalit-home-best-hours__timeline-bar">
        {buckets.map((bucket) => {
          const stats = bucketStats.find((s) => s.bucket.id === bucket.id)!;
          const { left, width } = getTimelinePosition(bucket);
          const isHovered = hoveredBucket === bucket.id;
          const isBest = bestBucket?.bucket.id === bucket.id;
          const averagePnl = stats.averagePnl ?? 0;
          const isEmpty = stats.tradeCount === 0;
          const isLowSample =
            !isEmpty &&
            (!stats.isDevelopingEligible ||
              stats.tradeCount < LOW_SAMPLE_TRADE_THRESHOLD);
          const colorClassName =
            isPnlMasked || isLowSample
              ? 'journalit-home-best-hours__timeline-segment--neutral'
              : isEmpty
                ? 'journalit-home-best-hours__timeline-segment--empty'
                : Math.abs(averagePnl) < 0.01
                  ? 'journalit-home-best-hours__timeline-segment--neutral'
                  : averagePnl > 0
                    ? 'journalit-home-best-hours__timeline-segment--positive'
                    : 'journalit-home-best-hours__timeline-segment--negative';

          let opacity: number;
          if (isPnlMasked) {
            opacity = 0.35;
          } else if (isEmpty) {
            opacity = 1;
          } else if (isLowSample) {
            opacity = 0.3;
          } else if (isBest) {
            opacity = 1;
          } else {
            const range = maxPnL - minPnL;
            const normalized = range > 0 ? (averagePnl - minPnL) / range : 0.5;
            opacity = 0.25 + normalized * 0.25;
          }

          const displayOpacity =
            isHovered && !isBest && !isPnlMasked
              ? Math.min(0.65, opacity + 0.15)
              : opacity;

          return (
            <div
              key={bucket.id}
              onMouseEnter={() => setHoveredBucket(bucket.id)}
              onMouseLeave={() => setHoveredBucket(null)}
              aria-hidden="true"
              className={`journalit-home-best-hours__timeline-segment ${colorClassName}`}
              style={cssVars({
                '--journalit-home-best-hours-segment-left': `${left}%`,
                '--journalit-home-best-hours-segment-width': `${width}%`,
                '--journalit-home-best-hours-segment-opacity':
                  String(displayOpacity),
              })}
            />
          );
        })}
      </div>
      {hoveredStats && !isPnlMasked && (
        <div className="journalit-home-best-hours__tooltip">
          <div className="journalit-home-best-hours__tooltip-header">
            {hoveredStats.bucket.label}
          </div>
          <div className="journalit-home-best-hours__tooltip-value-row">
            <span
              className={
                hoveredStats.averagePnl === null
                  ? 'journalit-home-best-hours__tooltip-pnl'
                  : hoveredStats.averagePnl >= 0
                    ? 'journalit-home-best-hours__tooltip-pnl journalit-home-best-hours__tooltip-pnl--positive'
                    : 'journalit-home-best-hours__tooltip-pnl journalit-home-best-hours__tooltip-pnl--negative'
              }
            >
              {hoveredStats.averagePnl === null
                ? t('common.na')
                : formatValue({
                    kind: 'pnl',
                    value: hoveredStats.averagePnl,
                    currencyCode: effectiveCurrency,
                  })}
            </span>
            <span className="journalit-home-best-hours__tooltip-stat">
              {t('home.widget.best-hours.avg-per-trade')}
            </span>
          </div>
          <div className="journalit-home-best-hours__tooltip-stats-row">
            <span className="journalit-home-best-hours__tooltip-stat">
              {t('home.widget.best-hours.trades-count', {
                count: String(hoveredStats.tradeCount),
              })}
            </span>
            <span className="journalit-home-best-hours__tooltip-stat">
              {t('home.widget.best-hours.days-count', {
                count: String(hoveredStats.distinctDayCount),
              })}
            </span>
            <span className="journalit-home-best-hours__tooltip-stat">
              {hoveredStats.winRate === null
                ? t('home.widget.best-hours.win-rate-na')
                : t('home.widget.best-hours.win-rate', {
                    rate: isReturnPercentMasked
                      ? formatValue({
                          kind: 'returnPercent',
                          value: hoveredStats.winRate,
                          signed: false,
                          precision: 0,
                        })
                      : hoveredStats.winRate.toFixed(0),
                  })}
            </span>
          </div>
        </div>
      )}
      <div className="journalit-home-best-hours__labels">
        {labelMinutes.map((minute) => {
          const left =
            ((minute - rangeStartMinute) /
              (rangeEndMinute - rangeStartMinute)) *
            100;
          return (
            <span
              key={`label-${minute}`}
              className="journalit-home-best-hours__label"
              style={cssVars({
                '--journalit-home-best-hours-label-left': `${left}%`,
              })}
            >
              {formatMinuteOfDay(minute)}
            </span>
          );
        })}
        {buckets.length > 0 && (
          <span
            className="journalit-home-best-hours__label"
            style={cssVars({
              '--journalit-home-best-hours-label-left': '100%',
            })}
          >
            {formatMinuteOfDay(buckets[buckets.length - 1].endMinute)}
          </span>
        )}
      </div>
    </div>
  );
}

const BestHoursWidgetComponent: React.FC = () => {
  const { dashboardData } = useDashboardData();
  const plugin = usePlugin();
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const [hoveredBucket, setHoveredBucket] = React.useState<string | null>(null);
  const tradeSettings = plugin?.settings?.trade;

  
  const filteredTrades = useFilteredByPeriod(dashboardData?.trades);
  const pnlContributingTrades = useMemo(
    () =>
      (filteredTrades || []).filter((trade) => isPnlContributingTrade(trade)),
    [filteredTrades]
  );

  const breakEvenSettings = useMemo(() => {
    const breakEvenRange = normalizeBreakEvenRange(tradeSettings);
    return {
      breakEvenRangeMin: breakEvenRange.min,
      breakEvenRangeMax: breakEvenRange.max,
      breakEvenThresholdMode: tradeSettings?.breakEvenThresholdMode ?? 'fixed',
      breakEvenThresholdPercent: tradeSettings?.breakEvenThresholdPercent,
    };
  }, [tradeSettings]);

  const { buckets, stats: bucketStats } = useMemo(
    () =>
      aggregateEntryTimeBuckets({
        trades: pnlContributingTrades,
        plugin,
        breakEvenSettings,
      }),
    [pnlContributingTrades, plugin, breakEvenSettings]
  );

  const bestBucket = useMemo(
    () => selectBestEntryWindow(bucketStats),
    [bucketStats]
  );

  
  const { maxPnL, minPnL } = useMemo(() => {
    const averages = bucketStats.flatMap((s) =>
      s.averagePnl === null || !s.isDevelopingEligible ? [] : [s.averagePnl]
    );
    if (averages.length === 0) return { maxPnL: 1, minPnL: 0 };
    return {
      maxPnL: Math.max(...averages),
      minPnL: Math.min(...averages),
    };
  }, [bucketStats]);

  
  const hoveredStats = useMemo(() => {
    if (!hoveredBucket) return null;
    return bucketStats.find((s) => s.bucket.id === hoveredBucket) || null;
  }, [hoveredBucket, bucketStats]);

  if (!dashboardData) {
    return <BestHoursLoadingState />;
  }

  if (bucketStats.length === 0) {
    return <BestHoursEmptyState />;
  }

  const isPnlMasked = shouldMask('pnl');
  const isReturnPercentMasked = shouldMask('returnPercent');
  const currencyConversion = buildCurrencyConversionMetadata(
    dashboardData.metrics
  );
  const effectiveCurrency =
    dashboardData.metrics.conversionBaseCurrency || currency;
  const rangeStartMinute = buckets[0].startMinute;
  const rangeEndMinute = buckets[buckets.length - 1].endMinute;
  const sampledBucketCount = bucketStats.filter(
    (bucket) => bucket.isDevelopingEligible
  ).length;
  const heroValueClassName =
    bestBucket && !isPnlMasked
      ? 'journalit-home-best-hours__hero-value journalit-home-best-hours__hero-value--positive'
      : 'journalit-home-best-hours__hero-value';

  return (
    <div className="journalit-home-best-hours">
      <div className="journalit-home-widget__eyebrow">
        {t('home.widget.best-hours.title')}
        <CurrencyConversionInfo
          metadata={currencyConversion}
          trades={pnlContributingTrades}
        />
      </div>

      
      <div className="journalit-home-best-hours__hero">
        {isPnlMasked ? (
          <>
            <div className="journalit-home-best-hours__hero-label">
              {t('home.widget.best-hours.hidden')}
            </div>
            <div className="journalit-home-widget__muted">
              {t('home.widget.best-hours.hidden-detail')}
            </div>
          </>
        ) : bestBucket ? (
          <>
            <div className="journalit-home-best-hours__hero-window">
              {bestBucket.bucket.label}
            </div>
            <div className={heroValueClassName}>
              {formatValue({
                kind: 'pnl',
                value: bestBucket.averagePnl ?? 0,
                currencyCode: effectiveCurrency,
              })}
              {bestBucket.sampleTier === 'developing' && (
                <span className="journalit-home-best-hours__hero-badge">
                  {t('home.widget.best-hours.developing')}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="journalit-home-best-hours__hero-label">
              {sampledBucketCount >= 2
                ? t('home.widget.best-hours.no-positive-window')
                : t('home.widget.best-hours.insufficient-history')}
            </div>
            <div className="journalit-home-widget__muted">
              {sampledBucketCount >= 2
                ? t('home.widget.best-hours.no-positive-detail')
                : t('home.widget.best-hours.sample-requirement', {
                    count: String(sampledBucketCount),
                  })}
            </div>
          </>
        )}
      </div>

      <BestHoursTimeline
        buckets={buckets}
        bucketStats={bucketStats}
        bestBucket={isPnlMasked ? null : bestBucket}
        hoveredBucket={hoveredBucket}
        hoveredStats={hoveredStats}
        rangeStartMinute={rangeStartMinute}
        rangeEndMinute={rangeEndMinute}
        maxPnL={maxPnL}
        minPnL={minPnL}
        isPnlMasked={isPnlMasked}
        isReturnPercentMasked={isReturnPercentMasked}
        effectiveCurrency={effectiveCurrency}
        setHoveredBucket={setHoveredBucket}
        formatValue={formatValue}
      />
    </div>
  );
};

export const BestHoursWidget = memo(BestHoursWidgetComponent);
