

import React, { memo, useMemo, useEffect } from 'react';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import { useFilteredByPeriod } from '../context/HomePeriodContext';
import { usePlugin } from '../../../hooks/usePlugin';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { Trade } from '../../dashboard/utils/dataUtils';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../shared/display/CurrencyConversionInfo';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { ensureHomeWidgetStyles } from '../../../styles/homeWidgetStyles';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { ensureSkeletonStyles } from '../../../styles/skeletonStyles';
import { t } from '../../../lang/helpers';
import { getTradeAnalyticsDate } from '../../../utils/tradeAnalyticsDate';

interface TimePeriod {
  id: string;
  label: string;
  startHour: number;
  endHour: number;
}

interface PeriodStats {
  period: TimePeriod;
  pnl: number;
  tradeCount: number;
  winRate: number;
}


const formatHour = (hour: number): string => {
  
  const normalized = ((hour % 24) + 24) % 24;
  const totalMinutes = Math.round(normalized * 60);
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = h >= 12 ? 'pm' : 'am';

  
  let displayHour = h % 12;
  if (displayHour === 0) displayHour = 12;

  if (m === 0) {
    return `${displayHour}${period}`;
  }
  return `${displayHour}:${m.toString().padStart(2, '0')}${period}`;
};


const formatTimeRange = (start: number, end: number): string => {
  return `${formatHour(start)} - ${formatHour(end)}`;
};

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
  timePeriods: TimePeriod[];
  periodStats: PeriodStats[];
  bestPeriod: PeriodStats | null;
  hoveredPeriod: string | null;
  hoveredStats: PeriodStats | null;
  dayStart: number;
  dayEnd: number;
  maxPnL: number;
  minPnL: number;
  isPnlMasked: boolean;
  isReturnPercentMasked: boolean;
  effectiveCurrency: string;
  setHoveredPeriod: (period: string | null) => void;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
}

function BestHoursTimeline({
  timePeriods,
  periodStats,
  bestPeriod,
  hoveredPeriod,
  hoveredStats,
  dayStart,
  dayEnd,
  maxPnL,
  minPnL,
  isPnlMasked,
  isReturnPercentMasked,
  effectiveCurrency,
  setHoveredPeriod,
  formatValue,
}: BestHoursTimelineProps) {
  const getTimelinePosition = (
    period: TimePeriod
  ): { left: number; width: number } => {
    const duration = dayEnd - dayStart;
    const left = ((period.startHour - dayStart) / duration) * 100;
    const width = ((period.endHour - period.startHour) / duration) * 100;
    return { left, width };
  };

  return (
    <div className="journalit-home-best-hours__timeline">
      <div className="journalit-home-best-hours__timeline-bar">
        {timePeriods.map((period) => {
          const stats = periodStats.find((s) => s.period.id === period.id);
          const { left, width } = getTimelinePosition(period);
          const isHovered = hoveredPeriod === period.id;
          const isBest = bestPeriod?.period.id === period.id;
          const pnl = stats?.pnl ?? 0;
          const colorClassName = isPnlMasked
            ? 'journalit-home-best-hours__timeline-segment--neutral'
            : Math.abs(pnl) < 0.01
              ? 'journalit-home-best-hours__timeline-segment--neutral'
              : pnl > 0
                ? 'journalit-home-best-hours__timeline-segment--positive'
                : 'journalit-home-best-hours__timeline-segment--negative';

          let opacity: number;
          if (isPnlMasked) {
            opacity = 0.35;
          } else if (isBest) {
            opacity = 1;
          } else {
            const range = maxPnL - minPnL;
            const normalized = range > 0 ? (pnl - minPnL) / range : 0.5;
            opacity = 0.25 + normalized * 0.25;
          }

          const displayOpacity =
            isHovered && !isBest && !isPnlMasked
              ? Math.min(0.65, opacity + 0.15)
              : opacity;

          return (
            <div
              key={period.id}
              onMouseEnter={() => setHoveredPeriod(period.id)}
              onMouseLeave={() => setHoveredPeriod(null)}
              onFocus={() => setHoveredPeriod(period.id)}
              onBlur={() => setHoveredPeriod(null)}
              tabIndex={0}
              role="button"
              aria-label={t('home.widget.best-hours.period-aria', {
                label: period.label,
                pnl: formatValue({
                  kind: 'pnl',
                  value: pnl,
                  currencyCode: effectiveCurrency,
                }),
                count: String(stats?.tradeCount ?? 0),
              })}
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
      {hoveredStats && (
        <div className="journalit-home-best-hours__tooltip">
          <div className="journalit-home-best-hours__tooltip-header">
            {hoveredStats.period.label}
          </div>
          <div className="journalit-home-best-hours__tooltip-row">
            <span
              className={
                isPnlMasked
                  ? 'journalit-home-best-hours__tooltip-pnl'
                  : hoveredStats.pnl >= 0
                    ? 'journalit-home-best-hours__tooltip-pnl journalit-home-best-hours__tooltip-pnl--positive'
                    : 'journalit-home-best-hours__tooltip-pnl journalit-home-best-hours__tooltip-pnl--negative'
              }
            >
              {formatValue({
                kind: 'pnl',
                value: hoveredStats.pnl,
                currencyCode: effectiveCurrency,
              })}
            </span>
            <span className="journalit-home-best-hours__tooltip-stat">
              {t('home.widget.best-hours.trades-count', {
                count: String(hoveredStats.tradeCount),
              })}
            </span>
            <span className="journalit-home-best-hours__tooltip-stat">
              {t('home.widget.best-hours.win-rate', {
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
        {timePeriods.map((period) => {
          const { left } = getTimelinePosition(period);
          return (
            <span
              key={`start-${period.id}`}
              className="journalit-home-best-hours__label"
              style={cssVars({
                '--journalit-home-best-hours-label-left': `${left}%`,
              })}
            >
              {formatHour(period.startHour)}
            </span>
          );
        })}
        {timePeriods.length > 0 && (
          <span
            className="journalit-home-best-hours__label"
            style={cssVars({
              '--journalit-home-best-hours-label-left': '100%',
            })}
          >
            {formatHour(timePeriods[timePeriods.length - 1].endHour)}
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
  const [hoveredPeriod, setHoveredPeriod] = React.useState<string | null>(null);

  useEffect(() => {}, []);

  
  const filteredTrades = useFilteredByPeriod(
    dashboardData?.trades as Trade[] | undefined
  );
  const pnlContributingTrades = useMemo(
    () =>
      (filteredTrades || []).filter((trade) =>
        isPnlContributingTrade(trade as Trade)
      ),
    [filteredTrades]
  );

  
  const { timePeriods, dayStart, dayEnd } = useMemo(() => {
    if (pnlContributingTrades.length === 0) {
      return { timePeriods: [], dayStart: 0, dayEnd: 24 };
    }

    
    const analyticsDateBasis =
      plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';

    const tradingHours: number[] = pnlContributingTrades
      .map((trade: Trade) => getTradeAnalyticsDate(trade, analyticsDateBasis))
      .filter((date): date is Date => date !== null)
      .map((date) => date.getHours() + date.getMinutes() / 60);

    if (tradingHours.length === 0) {
      return { timePeriods: [], dayStart: 0, dayEnd: 24 };
    }

    
    const minHour = Math.min(...tradingHours);
    const maxHour = Math.max(...tradingHours);

    
    const paddedStart = Math.max(0, Math.floor(minHour));
    const paddedEnd = Math.min(24, Math.ceil(maxHour) + 1);

    
    const duration = Math.max(4, paddedEnd - paddedStart);
    const periodCount = duration <= 6 ? 3 : 4; 
    const periodDuration = duration / periodCount;

    const periods: TimePeriod[] = [];
    for (let i = 0; i < periodCount; i++) {
      const start = paddedStart + i * periodDuration;
      const end = paddedStart + (i + 1) * periodDuration;
      periods.push({
        id: `period-${i}`,
        label: formatTimeRange(start, end),
        startHour: start,
        endHour: end,
      });
    }

    return {
      timePeriods: periods,
      dayStart: paddedStart,
      dayEnd: paddedStart + duration,
    };
  }, [pnlContributingTrades, plugin?.settings?.trade?.analyticsDateBasis]);

  
  const periodStats = useMemo((): PeriodStats[] => {
    if (pnlContributingTrades.length === 0 || timePeriods.length === 0) {
      return [];
    }

    
    const statsMap: Map<string, { pnl: number; wins: number; total: number }> =
      new Map();
    timePeriods.forEach((period) => {
      statsMap.set(period.id, { pnl: 0, wins: 0, total: 0 });
    });

    
    const analyticsDateBasis =
      plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';

    pnlContributingTrades.forEach((trade: Trade) => {
      const analyticsDate = getTradeAnalyticsDate(trade, analyticsDateBasis);
      if (!analyticsDate) {
        return;
      }

      const hour = analyticsDate.getHours() + analyticsDate.getMinutes() / 60;
      const pnl = getEffectivePnL(trade);

      
      for (const period of timePeriods) {
        if (hour >= period.startHour && hour < period.endHour) {
          const stats = statsMap.get(period.id)!;
          stats.pnl += pnl;
          stats.total++;
          if (pnl > 0) stats.wins++;
          break;
        }
      }
    });

    
    return timePeriods
      .map((period) => {
        const stats = statsMap.get(period.id)!;
        return {
          period,
          pnl: stats.pnl,
          tradeCount: stats.total,
          winRate: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0,
        };
      })
      .filter((s) => s.tradeCount > 0);
  }, [
    pnlContributingTrades,
    timePeriods,
    plugin?.settings?.trade?.analyticsDateBasis,
  ]);

  
  const { bestPeriod, isNegativeBest } = useMemo(() => {
    if (periodStats.length === 0)
      return { bestPeriod: null, isNegativeBest: false };
    const best = periodStats.reduce((b, curr) => (curr.pnl > b.pnl ? curr : b));
    return { bestPeriod: best, isNegativeBest: best.pnl < 0 };
  }, [periodStats]);

  
  const { maxPnL, minPnL } = useMemo(() => {
    if (periodStats.length === 0) return { maxPnL: 1, minPnL: 0 };
    const pnls = periodStats.map((s) => s.pnl);
    return {
      maxPnL: Math.max(...pnls),
      minPnL: Math.min(...pnls),
    };
  }, [periodStats]);

  
  const hoveredStats = useMemo(() => {
    if (!hoveredPeriod) return null;
    return periodStats.find((s) => s.period.id === hoveredPeriod) || null;
  }, [hoveredPeriod, periodStats]);

  if (!dashboardData) {
    return <BestHoursLoadingState />;
  }

  if (periodStats.length === 0) {
    return <BestHoursEmptyState />;
  }

  const isPnlMasked = shouldMask('pnl');
  const isReturnPercentMasked = shouldMask('returnPercent');
  const currencyConversion = buildCurrencyConversionMetadata(
    dashboardData.metrics
  );
  const effectiveCurrency =
    dashboardData.metrics.conversionBaseCurrency || currency;
  const heroValueClassName = isPnlMasked
    ? 'journalit-home-best-hours__hero-value'
    : isNegativeBest
      ? 'journalit-home-best-hours__hero-value journalit-home-best-hours__hero-value--negative'
      : 'journalit-home-best-hours__hero-value journalit-home-best-hours__hero-value--positive';

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
        {bestPeriod && (
          <>
            
            <div className={heroValueClassName}>
              {formatValue({
                kind: 'pnl',
                value: bestPeriod.pnl,
                currencyCode: effectiveCurrency,
              })}
            </div>
            
            <div className="journalit-home-widget__muted">
              {bestPeriod.period.label}
            </div>
          </>
        )}
      </div>

      <BestHoursTimeline
        timePeriods={timePeriods}
        periodStats={periodStats}
        bestPeriod={bestPeriod}
        hoveredPeriod={hoveredPeriod}
        hoveredStats={hoveredStats}
        dayStart={dayStart}
        dayEnd={dayEnd}
        maxPnL={maxPnL}
        minPnL={minPnL}
        isPnlMasked={isPnlMasked}
        isReturnPercentMasked={isReturnPercentMasked}
        effectiveCurrency={effectiveCurrency}
        setHoveredPeriod={setHoveredPeriod}
        formatValue={formatValue}
      />
    </div>
  );
};

export const BestHoursWidget = memo(BestHoursWidgetComponent);
