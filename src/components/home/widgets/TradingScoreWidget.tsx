

import React, { memo, useEffect, useMemo, useState } from 'react';
import { Info, X, ChevronRight } from '../../shared/icons/ObsidianIcon';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  TooltipProps,
} from 'recharts';
import { ChartBase } from '../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../charts/RechartsPortalTooltip';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import {
  calculateTradingScore,
  TradingScoreResult,
  AxisScores,
  getScoreLabel,
  AXIS_WEIGHTS,
} from '../../../utils/tradingScoreUtils';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { ensureHomeWidgetStyles } from '../../../styles/homeWidgetStyles';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { t, tPlural } from '../../../lang/helpers';


type TradingScoreWidgetProps = Record<string, never>;

interface RadarDataPoint {
  axis: string;
  axisKey: keyof AxisScores;
  value: number;
  fullMark: 100;
  weight: number;
}

type TooltipContentLike<TData> = TooltipProps<number, string> & {
  payload?: ReadonlyArray<{
    payload?: TData;
  }>;
};

const getScoreColorClass = (score: number): string => {
  if (score < 30) return 'journalit-score-color--poor';
  if (score < 50) return 'journalit-score-color--below-average';
  if (score < 70) return 'journalit-score-color--average';
  if (score < 90) return 'journalit-score-color--strong';
  return 'journalit-score-color--excellent';
};

const getPhaseClass = (phase: TradingScoreResult['phase']): string => {
  switch (phase) {
    case 'insufficient':
      return 'journalit-score-phase--insufficient';
    case 'developing':
      return 'journalit-score-phase--developing';
    case 'established':
      return 'journalit-score-phase--established';
    default:
      return 'journalit-score-phase--insufficient';
  }
};

const TradingScoreLoadingState: React.FC = () => (
  <div className="journalit-home-score journalit-home-score--compact">
    <div className="journalit-home-score__loading-header">
      <SkeletonText width="90px" height="11px" />
      <SkeletonBox width={36} height={12} borderRadius="4px" />
    </div>

    <div className="journalit-home-score__loading-radar">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <polygon
          points="60,10 105,35 105,85 60,110 15,85 15,35"
          className="skeleton-shimmer journalit-home-score__skeleton-outer"
        />
        <polygon
          points="60,30 85,45 85,75 60,90 35,75 35,45"
          className="journalit-home-score__skeleton-inner"
        />
      </svg>
    </div>

    <div className="journalit-home-score__loading-score">
      <SkeletonBox width={56} height={36} borderRadius="8px" />
      <div className="journalit-home-score__loading-score-row">
        <SkeletonText width="60px" height="11px" />
        <SkeletonText width="20px" height="10px" />
      </div>
    </div>
  </div>
);

const TradingScoreNoDataState: React.FC = () => (
  <div className="journalit-home-score journalit-home-score--padded journalit-home-score--centered">
    <span className="journalit-home-widget__eyebrow">
      {t('widget.trading-score.title')}
    </span>
    <span className="journalit-home-widget__muted">
      {t('widget.trading-score.no-data')}
    </span>
  </div>
);

const TradingScoreInsufficientState: React.FC<{
  scoreResult: TradingScoreResult;
}> = ({ scoreResult }) => {
  const weeksRequired = 4;
  const minTradesRequired = 5;
  const weeksProgress = Math.min(scoreResult.phaseWeeks, weeksRequired);
  const progressPercent = (weeksProgress / weeksRequired) * 100;
  const remainingWeeks = Math.max(0, weeksRequired - weeksProgress);
  const remainingTrades = Math.max(
    0,
    minTradesRequired - scoreResult.tradeCount
  );

  let encouragingMessage: string;
  if (scoreResult.phaseWeeks < weeksRequired) {
    if (weeksProgress === 0) {
      encouragingMessage = t('widget.trading-score.start-trading');
    } else if (weeksProgress === 1) {
      encouragingMessage = t('widget.trading-score.one-week-down');
    } else {
      encouragingMessage = tPlural(
        'widget.trading-score.weeks-to-unlock',
        remainingWeeks
      );
    }
  } else if (remainingTrades > 0) {
    encouragingMessage = tPlural(
      'widget.trading-score.trades-to-unlock',
      remainingTrades
    );
  } else {
    encouragingMessage = t('widget.trading-score.collect-more-data');
  }

  return (
    <div className="journalit-home-score journalit-home-score--padded">
      <div className="journalit-home-widget__eyebrow">
        {t('widget.trading-score.title')}
      </div>
      <div className="journalit-home-score__center">
        <div className="journalit-home-score__progress">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            className="journalit-home-score__progress-svg"
          >
            <circle
              cx="40"
              cy="40"
              r="34"
              className="journalit-home-score__progress-track"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              className="journalit-home-score__progress-circle"
              strokeDasharray={`${(progressPercent / 100) * 213.6} 213.6`}
            />
          </svg>
          <div className="journalit-home-score__progress-center">
            <div className="journalit-home-score__progress-value">
              {weeksProgress}
            </div>
            <div className="journalit-home-score__progress-label">
              {t('widget.trading-score.of-weeks', {
                count: String(weeksRequired),
              })}
            </div>
          </div>
        </div>

        <div className="journalit-home-score__message">
          <div className="journalit-home-score__message-main">
            {encouragingMessage}
          </div>
          <div className="journalit-home-score__message-sub">
            {tPlural(
              'widget.trading-score.trades-logged',
              scoreResult.tradeCount
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TradingScoreWidgetComponent: React.FC<TradingScoreWidgetProps> = () => {
  const { dashboardData } = useDashboardData();
  const chartRef = React.useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredAxis, setHoveredAxis] = useState<keyof AxisScores | null>(null);

  useEffect(() => {}, []);

  const scoreResult = useMemo((): TradingScoreResult | null => {
    if (!dashboardData?.trades || dashboardData.trades.length === 0) {
      return null;
    }
    return calculateTradingScore(dashboardData.trades);
  }, [dashboardData?.trades]);

  const radarData = useMemo((): RadarDataPoint[] => {
    if (!scoreResult) return [];

    
    
    const axes: (keyof AxisScores)[] = [
      'riskManagement', 
      'profitability', 
      'execution', 
      'returnConsistency', 
      'consistency', 
      'experience', 
    ];

    return axes.map((axisKey) => ({
      axis: t(`widget.trading-score.axis.${axisKey}` as const).replaceAll(
        ' ',
        '\n'
      ), 
      axisKey,
      value: scoreResult.axisScores[axisKey],
      fullMark: 100,
      weight: AXIS_WEIGHTS[axisKey] * 100,
    }));
  }, [scoreResult]);

  
  if (!dashboardData) {
    return <TradingScoreLoadingState />;
  }

  
  if (!scoreResult) {
    return <TradingScoreNoDataState />;
  }

  
  if (scoreResult.phase === 'insufficient') {
    return <TradingScoreInsufficientState scoreResult={scoreResult} />;
  }

  const phaseClass = getPhaseClass(scoreResult.phase);
  const scoreClass = getScoreColorClass(scoreResult.compositeScore);
  const scoreLabel = getScoreLabel(scoreResult.compositeScore);

  
  if (isExpanded) {
    return (
      <div className="journalit-home-score journalit-home-score--expanded">
        
        <div className="journalit-home-score__header">
          <span className="journalit-home-widget__eyebrow">
            {t('widget.trading-score.breakdown-title')}
          </span>
          <button
            onClick={() => setIsExpanded(false)}
            className="journalit-home-score__close-button"
            aria-label={t('widget.trading-score.close-breakdown')}
          >
            <X size={14} />
          </button>
        </div>

        
        <div className="journalit-home-score__axis-list">
          {(Object.keys(scoreResult.axisScores) as (keyof AxisScores)[]).map(
            (axisKey) => {
              const score = scoreResult.axisScores[axisKey];
              const axisScoreClass = getScoreColorClass(score);
              const weight = Math.round(AXIS_WEIGHTS[axisKey] * 100);
              const isHovered = hoveredAxis === axisKey;
              const axisName = t(
                `widget.trading-score.axis.${axisKey}` as const
              );
              const axisDescription = t(
                `widget.trading-score.axis.${axisKey}.desc` as const
              );

              return (
                <div
                  key={axisKey}
                  className="journalit-home-score__axis-item"
                  tabIndex={0}
                  role="button"
                  aria-label={t('widget.trading-score.axis-aria', {
                    axis: axisName,
                    score: String(score),
                    weight: String(weight),
                  })}
                  onMouseEnter={() => setHoveredAxis(axisKey)}
                  onMouseLeave={() => setHoveredAxis(null)}
                  onFocus={() => setHoveredAxis(axisKey)}
                  onBlur={() => setHoveredAxis(null)}
                >
                  <div className="journalit-home-score__axis-row">
                    <span className="journalit-home-score__axis-name">
                      {axisName}{' '}
                      <span className="journalit-home-score__axis-weight">
                        ({weight}%)
                      </span>
                    </span>
                    <span
                      className={`journalit-home-score__axis-score ${axisScoreClass}`}
                    >
                      {score}
                    </span>
                  </div>
                  <div className="journalit-home-score__axis-track">
                    <div
                      className={`journalit-home-score__axis-fill ${axisScoreClass}`}
                      style={cssVars({
                        '--journalit-home-score-axis-width': `${score}%`,
                      })}
                    />
                  </div>
                  
                  {isHovered && (
                    <div className="journalit-home-score__axis-tooltip">
                      {axisDescription}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>

        
        <div className="journalit-home-score__footer">
          <div className="journalit-home-score__footer-score">
            <span
              className={`journalit-home-score__footer-value ${scoreClass}`}
            >
              {scoreResult.compositeScore}
            </span>
            <span
              className={`journalit-home-score__footer-phase ${phaseClass}`}
            >
              {t(`widget.trading-score.phase.${scoreResult.phase}` as const)}
            </span>
          </div>
          <span className="journalit-home-score__footer-trades">
            {t('widget.trading-score.trades-count', {
              count: String(scoreResult.tradeCount),
            })}
          </span>
        </div>
      </div>
    );
  }

  
  return (
    <div
      className="journalit-home-score journalit-home-score--compact journalit-home-score--clickable"
      onClick={() => setIsExpanded(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsExpanded(true);
        }
      }}
    >
      
      <div className="journalit-home-score__header">
        <span className="journalit-home-widget__eyebrow">
          {t('widget.trading-score.title')}
        </span>
        <div className="journalit-home-score__header-icons">
          <Info size={12} />
          <ChevronRight size={12} />
        </div>
      </div>

      
      <div className="journalit-home-score__radar-container">
        <ChartBase height="100%" width="100%" chartRef={chartRef}>
          <RadarChart
            data={radarData}
            margin={{ top: 5, right: 25, bottom: 0, left: 25 }}
          >
            <PolarGrid
              stroke="var(--background-modifier-border)"
              strokeOpacity={0.6}
            />
            <PolarAngleAxis
              dataKey="axis"
              tick={{
                fill: 'var(--text-faint)',
                fontSize: 9,
              }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name={t('widget.trading-score.title')}
              dataKey="value"
              stroke={scoreLabel.color}
              fill={scoreLabel.color}
              fillOpacity={scoreResult.phase === 'developing' ? 0.3 : 0.4}
              strokeWidth={scoreResult.phase === 'developing' ? 1.5 : 2}
              strokeDasharray={
                scoreResult.phase === 'developing' ? '4 2' : undefined
              }
            />
            <RechartsPortalTooltip chartRef={chartRef}>
              {({ active, payload }: TooltipContentLike<RadarDataPoint>) => {
                const data = payload?.[0]?.payload as
                  | RadarDataPoint
                  | undefined;

                if (!active || !data) return null;
                const scoreClass = getScoreColorClass(data.value);
                return (
                  <div className="journalit-home-score__tooltip">
                    <div className="journalit-home-score__tooltip-label">
                      {t(`widget.trading-score.axis.${data.axisKey}` as const)}
                    </div>
                    <div
                      className={`journalit-home-score__tooltip-value ${scoreClass}`}
                    >
                      {data.value}
                    </div>
                    <div className="journalit-home-score__tooltip-weight">
                      {t('widget.trading-score.weight', {
                        weight: String(data.weight),
                      })}
                    </div>
                  </div>
                );
              }}
            </RechartsPortalTooltip>
          </RadarChart>
        </ChartBase>
      </div>

      
      <div className="journalit-home-score__score-display">
        <div className={`journalit-home-score__score-value ${scoreClass}`}>
          {scoreResult.compositeScore}
        </div>
        <div className="journalit-home-score__phase-row">
          <span className={`journalit-home-score__phase-label ${phaseClass}`}>
            {t(`widget.trading-score.phase.${scoreResult.phase}` as const)}
          </span>
          <span className="journalit-home-score__phase-weeks">
            {t('widget.trading-score.weeks-suffix', {
              weeks: String(scoreResult.phaseWeeks),
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export const TradingScoreWidget = memo(TradingScoreWidgetComponent);
